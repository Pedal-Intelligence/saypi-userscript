// ==UserScript==
// @name         Say, Pi
// @namespace    http://www.saypi.ai/
// @version      1.3.6
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
/* harmony import */ var _StateMachineService_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./StateMachineService.js */ "./src/StateMachineService.js");
/* harmony import */ var _icons_exit_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./icons/exit.svg */ "./src/icons/exit.svg");
/* harmony import */ var _icons_maximize_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./icons/maximize.svg */ "./src/icons/maximize.svg");
/* harmony import */ var _icons_rectangles_svg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./icons/rectangles.svg */ "./src/icons/rectangles.svg");
/* harmony import */ var _icons_waveform_svg__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./icons/waveform.svg */ "./src/icons/waveform.svg");
/* harmony import */ var _icons_muted_microphone_svg__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./icons/muted_microphone.svg */ "./src/icons/muted_microphone.svg");
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
    this.actor = _StateMachineService_js__WEBPACK_IMPORTED_MODULE_2__["default"].actor;
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
        iconContainer.innerHTML = _icons_rectangles_svg__WEBPACK_IMPORTED_MODULE_5__["default"];
      } else {
        iconContainer.innerHTML = _icons_waveform_svg__WEBPACK_IMPORTED_MODULE_6__["default"];
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
      button.innerHTML = _icons_exit_svg__WEBPACK_IMPORTED_MODULE_3__["default"];
      document.body.appendChild(button);
      return button;
    }
  }, {
    key: "createEnterButton",
    value: function createEnterButton() {
      var label = "Enter Voice-Controlled Mobile Mode";
      var button = this.createButton("", function () {
        (0,_UserAgentModule__WEBPACK_IMPORTED_MODULE_0__.enterMobileMode)();
      });
      button.id = "saypi-enterButton";
      button.type = "button";
      button.className = "enter-button fixed rounded-full bg-cream-550 enabled:hover:bg-cream-650";
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
      button.innerHTML = _icons_maximize_svg__WEBPACK_IMPORTED_MODULE_4__["default"];
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
  }, {
    key: "showNotification",
    value: function showNotification(details) {
      var icon = details.icon;
      var iconSVG;
      if (icon === "muted-microphone") {
        iconSVG = _icons_muted_microphone_svg__WEBPACK_IMPORTED_MODULE_7__["default"];
      }
      var notification = document.getElementById("saypi-notification");
      if (notification) {
        notification.classList.remove("hidden");
        notification.innerHTML = iconSVG;
      } else {
        var _notification = document.createElement("div");
        _notification.id = "saypi-notification";
        _notification.className = "notification";
        _notification.innerHTML = iconSVG;
        document.body.appendChild(_notification);
      }
    }
  }, {
    key: "dismissNotification",
    value: function dismissNotification() {
      var notification = document.getElementById("saypi-notification");
      if (notification) {
        notification.classList.add("hidden");
      }
    }
  }], [{
    key: "simulateFormSubmit",
    value: function simulateFormSubmit() {
      var submitButton = document.getElementById("saypi-submitButton");
      if (submitButton) {
        submitButton.click();
      } else {
        /* hit enter key in the prompt textarea, might not work as expected on "new ui layout" */
        var textarea = document.getElementById("saypi-prompt");
        var enterEvent = new KeyboardEvent("keydown", {
          bubbles: true,
          key: "Enter",
          keyCode: 13,
          which: 13
        });
        textarea.dispatchEvent(enterEvent);
      }
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
    if (responseJson.text.length === 0) {
      _StateMachineService_js__WEBPACK_IMPORTED_MODULE_0__["default"].actor.send("saypi:transcribedEmpty");
    } else {
      _StateMachineService_js__WEBPACK_IMPORTED_MODULE_0__["default"].actor.send("saypi:transcribed", {
        text: responseJson.text
      });
    }
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
  /** @xstate-layout N4IgpgJg5mDOIC5SwIYE8AKBLAdFiANmAMSpoAOWCArrGAE4DK5YKA1lgHZQDaADAF1EocgHtYWAC5ZRnYSAAeiAMwB2PjmUBOPgDYAjLq379y3QBoQaRPr5atOXaq26ALKoBMy-QA5TAX39LMmw8QhIySgRyFFowfiEkEDEJaVl5JQQ1DW09Q2NTCytEVSMcUo8tH3cfVWVXM0Dg9FD8IlJ0KMpmVg5uBPkUqRk5JMzszR0DIxMzS2sEVx8PHHddAFZSrWVN3V0+daaQENw4phZ2LigOiiozgDEuLFgAC0gey-7BQfFh9LHEJUtK4cOs+Ko6ps+Hp1sp5ohYbpQR4NqV6j4tOsPEcTjgzh8+tdInc6ExJKJyCwIASrgMkkM0qNQJkPHwMThlnwzMo7Bj1j44cUEB5XBotKV1vywXs9r4cS1TqSadwblFJPQUJxYABjehYABGtO+9N+jIygPsILBEJ26hhgoWrg2OD4KKxVS5EMl8swuBicQgqqo5AI6DpIlNI3NCFsOk0DS9ugFrO88IQEJB6m8ro8qlcHixrh9oX9dEDxIQ9FYEDQ4eSkf+zMQezFSYq+32Ap8af2yhwHjd610lVqA-0xb9WGVRM6wan5Mp7wuhLrDKjAJj+aRri0A6dBZ26xcafFPhwu5cTh8SZ8m3HQWOCpw3WXVyDNCVr6+iQjqXXTeFNkHE5bleUxAU0x3M9c1RSoMxRZQJ2fKcvxnW5oiwR5OGeN5qVQ1cGyZRQbC3UFvGUbxgS5TYtDTMx9HKQcIXUJMlkOB9cXVTUdT1Q0VQrLitV1A1IAIv9G2IrJeRwfQh0qLllAHTE0z8UFoWhdRfAFfRcyQwSeINN8BI1ITeLAe4UCwIgIDEv4iMdV1yglTYfFvdZXCPSxxmqM81CgyoGj2Ic9JMgy+LQtVQuE-VIAAUQAW3ISRa2NX87OjPg0z4JCCFEFAICM2cMOnWyzQ3fRSJ3Pdh1hSVjyFZxVEcZw3CHcF9B0HwkIYehRHoWBiAUWBJBQSQwBwFAADMxvoAAKVl1IAShuUIer62BSv-ST3IcZRlj8Ase1cmSWuWbxcx5djml9HA1v6wbhtG8appm+b1L4ZbcTujb9B-etxKIzIds0fadPWHtRROlwzp0uoDkCB9OFECA4HkE4fgB6MAFoljTLHajU9StKMcUPHva7WnCDH0o3fM0zBzR1lkuSBz8Dqiw4p98VQ6myoAgtHOtdRln5XJVEg0x+wlfMB35A5EM5m7S0gXmtqBqp4z8smaiHbsGrMKGky8WHLqQl9eiuVWJMyQxqnKME2U8VEd0gp1kVg0xWT8ELuOiy2TUxjd6gLGSRSqAKzA2IoHJWCENhctyPK0HK8oK7grcBmwC18qolmBDN6jTPN1nPSo3DWXwPKux8bu+jPozphq7f0FqbSPDwBQVincG+nB9Oi8zLOs+uNx0E9SkNmGLvhxXVvoXr+pweKsG1WL576keALHoUTE2ZqXFk+w3FMBXAiAA */
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
          cond: "isSafariMobile"
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
      }, {
        type: "transcribeAudio",
        params: {}
      }],
      exit: {
        type: "stopAnimation",
        params: {
          animation: "transcribing"
        }
      },
      on: {
        "saypi:transcribed": {
          target: "idle",
          actions: {
            type: "handleTranscriptionResponse",
            params: {}
          },
          description: "Successfully transcribed user audio to text."
        },
        "saypi:transcribeFailed": {
          target: "#sayPi.errors.transcribeFailed",
          description: "Received an error response from the /transcribe API"
        },
        "saypi:transcribedEmpty": {
          target: "#sayPi.errors.micError",
          description: "Received an empty response from the /transcribe API (no speech detected)"
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
      after: {
        10000: [{
          target: "#sayPi.idle",
          actions: [],
          description: "Reset to the idle state and clear errors."
        }, {
          internal: false
        }]
      },
      initial: "transcribeFailed",
      states: {
        transcribeFailed: {
          description: "The /transcribe API responded with an error.",
          type: "final",
          entry: {
            type: "startAnimation",
            params: {
              animation: "error"
            }
          },
          exit: {
            type: "stopAnimation",
            params: {
              animation: "error"
            }
          }
        },
        micError: {
          type: "final",
          description: "No audio input detected",
          entry: {
            type: "showNotification",
            params: {
              icon: "muted-microphone"
            }
          },
          exit: {
            type: "dismissNotification",
            params: {}
          }
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
    },
    showNotification: function showNotification(context, event, _ref3) {
      var action = _ref3.action;
      var icon = action.params.icon;
      var message = action.params.message;
      _ButtonModule__WEBPACK_IMPORTED_MODULE_0__.buttonModule.showNotification({
        icon: icon,
        message: message
      });
    },
    dismissNotification: function dismissNotification(context, event) {
      _ButtonModule__WEBPACK_IMPORTED_MODULE_0__.buttonModule.dismissNotification();
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
    isSafariMobile: function isSafariMobile(context, event) {
      return (0,_UserAgentModule__WEBPACK_IMPORTED_MODULE_2__.isSafari)() && (0,_UserAgentModule__WEBPACK_IMPORTED_MODULE_2__.isMobileView)();
    }
  },
  delays: {}
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles/rectangles.css":
/*!*************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles/rectangles.css ***!
  \*************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
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

/* toned-down dissary animation to indicate an error */
/* toned-down error animation with reduced opacity */
@keyframes errorAnimation {
  0% {
    transform: rotate(0deg) translate(0%, 0%);
  }
  25% {
    transform: rotate(-5deg) translate(-5%, 5%);
  }
  50% {
    transform: rotate(5deg) translate(5%, -5%);
  }
  75% {
    transform: rotate(-5deg) translate(-5%, 5%);
  }
  100% {
    transform: rotate(0deg) translate(0%, 0%);
  }
}

.outermost.error {
  animation: errorAnimation 25s 1;
  fill: #ff0000;
  fill-opacity: 0.7;
}

.second.error {
  animation: errorAnimation 25s 1;
  fill: #ff3300;
  fill-opacity: 0.7;
}

.third.error {
  animation: errorAnimation 25s 1;
  fill: #ff6600;
  fill-opacity: 0.7;
}

.fourth.error {
  animation: errorAnimation 25s 1;
  fill: #ff9900;
  fill-opacity: 0.7;
}

.fifth.error {
  animation: errorAnimation 25s 1;
  fill: #ffcc00;
  fill-opacity: 0.7;
}

.innermost.error {
  animation: errorAnimation 25s 1;
  fill: #ffff00;
  fill-opacity: 0.7;
}
`, "",{"version":3,"sources":["webpack://./src/styles/rectangles.css"],"names":[],"mappings":"AAAA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,sBAAsB;EACxB;AACF;AACA;EACE,sCAAsC;EACtC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,mCAAmC;EACnC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,kCAAkC;EAClC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,mCAAmC;EACnC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,kCAAkC;EAClC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,qBAAqB;EACvB;AACF;AACA;EACE,sCAAsC;EACtC,wBAAwB;AAC1B;;AAEA,2EAA2E;AAC3E;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,0BAA0B;EAC5B;EACA;IACE,0BAA0B;EAC5B;AACF;AACA;EACE,gCAAgC;EAChC,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,4BAA4B;EAC9B;EACA;IACE,6BAA6B;EAC/B;AACF;AACA;EACE,6BAA6B;EAC7B,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,4BAA4B;EAC9B;EACA;IACE,6BAA6B;EAC/B;AACF;AACA;EACE,4BAA4B;EAC5B,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,4BAA4B;EAC9B;EACA;IACE,6BAA6B;EAC/B;AACF;AACA;EACE,6BAA6B;EAC7B,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,4BAA4B;EAC9B;EACA;IACE,6BAA6B;EAC/B;AACF;AACA;EACE,4BAA4B;EAC5B,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,0BAA0B;EAC5B;EACA;IACE,4BAA4B;EAC9B;AACF;AACA;EACE,gCAAgC;EAChC,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA,iDAAiD;AACjD;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,uBAAuB;EACzB;EACA;IACE,qBAAqB;EACvB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,yCAAyC;EACzC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,oCAAoC;EACtC;EACA;IACE,mCAAmC;EACrC;EACA;IACE,oCAAoC;EACtC;AACF;AACA;EACE,sCAAsC;EACtC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,qCAAqC;EACvC;EACA;IACE,mCAAmC;EACrC;EACA;IACE,oCAAoC;EACtC;AACF;AACA;EACE,qCAAqC;EACrC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,oCAAoC;EACtC;EACA;IACE,mCAAmC;EACrC;EACA;IACE,oCAAoC;EACtC;AACF;AACA;EACE,sCAAsC;EACtC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,qCAAqC;EACvC;EACA;IACE,mCAAmC;EACrC;EACA;IACE,oCAAoC;EACtC;AACF;AACA;EACE,qCAAqC;EACrC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,oCAAoC;EACtC;EACA;IACE,mCAAmC;EACrC;EACA;IACE,oCAAoC;EACtC;AACF;AACA;EACE,yCAAyC;EACzC,wBAAwB;AAC1B;;AAEA,gDAAgD;AAChD;EACE;IACE;mDAC+C;EACjD;EACA;IACE;mDAC+C;EACjD;AACF;AACA,wCAAwC;AACxC;EACE;;IAEE,8BAA8B;EAChC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE;;IAEE,kCAAkC;EACpC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE;;IAEE,kCAAkC;EACpC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE;;IAEE,kCAAkC;EACpC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE;;IAEE,kCAAkC;EACpC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE;;IAEE,kCAAkC;EACpC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE,qDAAqD;AACvD;;AAEA;EACE,mDAAmD;AACrD;;AAEA;EACE,iDAAiD;AACnD;;AAEA;EACE,mDAAmD;AACrD;;AAEA;EACE,iDAAiD;AACnD;;AAEA;EACE,sDAAsD;AACxD;;AAEA,yEAAyE;AACzE;EACE;;IAEE,wBAAwB;IACxB,2BAA2B;EAC7B;EACA;IACE,0BAA0B;IAC1B,+BAA+B;EACjC;AACF;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,yCAAyC;AAC3C;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,yCAAyC;AAC3C;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,yCAAyC;AAC3C;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,yCAAyC;AAC3C;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,yCAAyC;AAC3C;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,uCAAuC;AACzC;;AAEA,6DAA6D;AAC7D;EACE;;IAEE,UAAU;IACV,2BAA2B;EAC7B;EACA;IACE,YAAY;IACZ,sBAAsB,EAAE,iBAAiB;EAC3C;AACF;;AAEA;EACE,yBAAyB;EACzB,gCAAgC;EAChC,mBAAmB;AACrB;;AAEA;EACE,yBAAyB;EACzB,gCAAgC;EAChC,qBAAqB;AACvB;;AAEA;EACE,yBAAyB;EACzB,gCAAgC;EAChC,qBAAqB;AACvB;;AAEA;EACE,yBAAyB;EACzB,gCAAgC;EAChC,qBAAqB;AACvB;;AAEA;EACE,yBAAyB;EACzB,gCAAgC;EAChC,qBAAqB;AACvB;;AAEA;EACE,yBAAyB;EACzB,gCAAgC;EAChC,mBAAmB;AACrB;;AAEA,sDAAsD;AACtD,oDAAoD;AACpD;EACE;IACE,yCAAyC;EAC3C;EACA;IACE,2CAA2C;EAC7C;EACA;IACE,0CAA0C;EAC5C;EACA;IACE,2CAA2C;EAC7C;EACA;IACE,yCAAyC;EAC3C;AACF;;AAEA;EACE,+BAA+B;EAC/B,aAAa;EACb,iBAAiB;AACnB;;AAEA;EACE,+BAA+B;EAC/B,aAAa;EACb,iBAAiB;AACnB;;AAEA;EACE,+BAA+B;EAC/B,aAAa;EACb,iBAAiB;AACnB;;AAEA;EACE,+BAA+B;EAC/B,aAAa;EACb,iBAAiB;AACnB;;AAEA;EACE,+BAA+B;EAC/B,aAAa;EACb,iBAAiB;AACnB;;AAEA;EACE,+BAA+B;EAC/B,aAAa;EACb,iBAAiB;AACnB","sourcesContent":["@keyframes pulse_outermost {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.92);\n  }\n}\n.outermost {\n  animation: pulse_outermost 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_second {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.856);\n  }\n}\n.second {\n  animation: pulse_second 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_third {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.792);\n  }\n}\n.third {\n  animation: pulse_third 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_fourth {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.728);\n  }\n}\n.fourth {\n  animation: pulse_fourth 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_fifth {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.664);\n  }\n}\n.fifth {\n  animation: pulse_fifth 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_innermost {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.6);\n  }\n}\n.innermost {\n  animation: pulse_innermost 5s infinite;\n  transform-origin: center;\n}\n\n/* bounce animation to indicate Pi is paused awaiting permission to speak */\n@keyframes bounce_outermost {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-5%);\n  }\n  60% {\n    transform: translateY(-3%);\n  }\n}\n.outermost.paused {\n  animation-name: bounce_outermost;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes bounce_second {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-5.8%);\n  }\n  60% {\n    transform: translateY(-3.48%);\n  }\n}\n.second.paused {\n  animation-name: bounce_second;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes bounce_third {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-6.6%);\n  }\n  60% {\n    transform: translateY(-3.96%);\n  }\n}\n.third.paused {\n  animation-name: bounce_third;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes bounce_fourth {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-7.4%);\n  }\n  60% {\n    transform: translateY(-4.44%);\n  }\n}\n.fourth.paused {\n  animation-name: bounce_fourth;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes bounce_fifth {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-8.2%);\n  }\n  60% {\n    transform: translateY(-4.92%);\n  }\n}\n.fifth.paused {\n  animation-name: bounce_fifth;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes bounce_innermost {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-9%);\n  }\n  60% {\n    transform: translateY(-5.4%);\n  }\n}\n.innermost.paused {\n  animation-name: bounce_innermost;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n/* playful animation to indicate Pi is speaking */\n@keyframes speaking_outermost {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.995);\n  }\n  50% {\n    transform: scale(0.9);\n  }\n  75% {\n    transform: scale(0.895);\n  }\n}\n.outermost.piSpeaking {\n  animation: speaking_outermost 2s infinite;\n  transform-origin: center;\n}\n\n@keyframes speaking_second {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.98) rotate(-1deg);\n  }\n  50% {\n    transform: scale(0.87) rotate(0deg);\n  }\n  75% {\n    transform: scale(0.865) rotate(1deg);\n  }\n}\n.second.piSpeaking {\n  animation: speaking_second 2s infinite;\n  transform-origin: center;\n}\n\n@keyframes speaking_third {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.965) rotate(-2deg);\n  }\n  50% {\n    transform: scale(0.84) rotate(0deg);\n  }\n  75% {\n    transform: scale(0.835) rotate(2deg);\n  }\n}\n.third.piSpeaking {\n  animation: speaking_third 2s infinite;\n  transform-origin: center;\n}\n\n@keyframes speaking_fourth {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.95) rotate(-3deg);\n  }\n  50% {\n    transform: scale(0.81) rotate(0deg);\n  }\n  75% {\n    transform: scale(0.805) rotate(3deg);\n  }\n}\n.fourth.piSpeaking {\n  animation: speaking_fourth 2s infinite;\n  transform-origin: center;\n}\n\n@keyframes speaking_fifth {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.935) rotate(-4deg);\n  }\n  50% {\n    transform: scale(0.78) rotate(0deg);\n  }\n  75% {\n    transform: scale(0.775) rotate(4deg);\n  }\n}\n.fifth.piSpeaking {\n  animation: speaking_fifth 2s infinite;\n  transform-origin: center;\n}\n\n@keyframes speaking_innermost {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.92) rotate(-5deg);\n  }\n  50% {\n    transform: scale(0.75) rotate(0deg);\n  }\n  75% {\n    transform: scale(0.745) rotate(5deg);\n  }\n}\n.innermost.piSpeaking {\n  animation: speaking_innermost 2s infinite;\n  transform-origin: center;\n}\n\n/* wave animation to indicate user is speaking */\n@keyframes userSpeakingAnimation {\n  50% {\n    transform: scaleY(0.05) scaleX(var(--width-factor))\n      translateX(calc(-50% + var(--spread-amount)));\n  }\n  100% {\n    transform: scaleY(1) scaleX(var(--width-factor))\n      translateX(calc(-50% + var(--spread-amount)));\n  }\n}\n/* user speaking oscillation animation */\n@keyframes waveform_outermost {\n  0%,\n  100% {\n    transform: scaleY(1) scaleX(1);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.9) scaleX(0.9);\n  }\n}\n\n@keyframes waveform_second {\n  0%,\n  100% {\n    transform: scaleY(0.9) scaleX(0.9);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.8) scaleX(0.8);\n  }\n}\n\n@keyframes waveform_third {\n  0%,\n  100% {\n    transform: scaleY(0.8) scaleX(0.8);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.7) scaleX(0.7);\n  }\n}\n\n@keyframes waveform_fourth {\n  0%,\n  100% {\n    transform: scaleY(0.7) scaleX(0.7);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.6) scaleX(0.6);\n  }\n}\n\n@keyframes waveform_fifth {\n  0%,\n  100% {\n    transform: scaleY(0.6) scaleX(0.6);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.5) scaleX(0.5);\n  }\n}\n\n@keyframes waveform_innermost {\n  0%,\n  100% {\n    transform: scaleY(0.5) scaleX(0.5);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.4) scaleX(0.4);\n  }\n}\n\n.outermost.userSpeaking {\n  animation: waveform_outermost 0.7s infinite alternate;\n}\n\n.second.userSpeaking {\n  animation: waveform_second 0.65s infinite alternate;\n}\n\n.third.userSpeaking {\n  animation: waveform_third 0.6s infinite alternate;\n}\n\n.fourth.userSpeaking {\n  animation: waveform_fourth 0.55s infinite alternate;\n}\n\n.fifth.userSpeaking {\n  animation: waveform_fifth 0.5s infinite alternate;\n}\n\n.innermost.userSpeaking {\n  animation: waveform_innermost 0.45s infinite alternate;\n}\n\n/* flipcard animation to indicate Say, Pi is transcribing audio to text */\n@keyframes transcribingFlip {\n  0%,\n  100% {\n    transform: rotateY(0deg);\n    fill: var(--original-color);\n  }\n  50% {\n    transform: rotateY(180deg);\n    fill: var(--transcribing-color);\n  }\n}\n\n.outermost.transcribing {\n  --original-color: #e4f2d1;\n  --transcribing-color: #b3e0fe;\n  animation: transcribingFlip 1.5s infinite;\n}\n\n.second.transcribing {\n  --original-color: #cce8b5;\n  --transcribing-color: #89c2ff;\n  animation: transcribingFlip 1.6s infinite;\n}\n\n.third.transcribing {\n  --original-color: #b3db95;\n  --transcribing-color: #5fa4ff;\n  animation: transcribingFlip 1.7s infinite;\n}\n\n.fourth.transcribing {\n  --original-color: #9bd078;\n  --transcribing-color: #3586ff;\n  animation: transcribingFlip 1.8s infinite;\n}\n\n.fifth.transcribing {\n  --original-color: #83c55c;\n  --transcribing-color: #0b69e3;\n  animation: transcribingFlip 1.9s infinite;\n}\n\n.innermost.transcribing {\n  --original-color: #428a2f;\n  --transcribing-color: #0053bf;\n  animation: transcribingFlip 2s infinite;\n}\n\n/* heartbeat animation to indicate Pi is preparing to speak */\n@keyframes heartbeat {\n  0%,\n  100% {\n    opacity: 1;\n    fill: var(--original-color);\n  }\n  50% {\n    opacity: 0.5;\n    fill: rgb(245 238 223); /* bg-cream-550 */\n  }\n}\n\n.outermost.loading {\n  --original-color: #e4f2d1;\n  animation: heartbeat 2s infinite;\n  animation-delay: 0s;\n}\n\n.second.loading {\n  --original-color: #cce8b5;\n  animation: heartbeat 2s infinite;\n  animation-delay: 0.4s;\n}\n\n.third.loading {\n  --original-color: #b3db95;\n  animation: heartbeat 2s infinite;\n  animation-delay: 0.8s;\n}\n\n.fourth.loading {\n  --original-color: #9bd078;\n  animation: heartbeat 2s infinite;\n  animation-delay: 1.2s;\n}\n\n.fifth.loading {\n  --original-color: #83c55c;\n  animation: heartbeat 2s infinite;\n  animation-delay: 1.6s;\n}\n\n.innermost.loading {\n  --original-color: #428a2f;\n  animation: heartbeat 2s infinite;\n  animation-delay: 2s;\n}\n\n/* toned-down dissary animation to indicate an error */\n/* toned-down error animation with reduced opacity */\n@keyframes errorAnimation {\n  0% {\n    transform: rotate(0deg) translate(0%, 0%);\n  }\n  25% {\n    transform: rotate(-5deg) translate(-5%, 5%);\n  }\n  50% {\n    transform: rotate(5deg) translate(5%, -5%);\n  }\n  75% {\n    transform: rotate(-5deg) translate(-5%, 5%);\n  }\n  100% {\n    transform: rotate(0deg) translate(0%, 0%);\n  }\n}\n\n.outermost.error {\n  animation: errorAnimation 25s 1;\n  fill: #ff0000;\n  fill-opacity: 0.7;\n}\n\n.second.error {\n  animation: errorAnimation 25s 1;\n  fill: #ff3300;\n  fill-opacity: 0.7;\n}\n\n.third.error {\n  animation: errorAnimation 25s 1;\n  fill: #ff6600;\n  fill-opacity: 0.7;\n}\n\n.fourth.error {\n  animation: errorAnimation 25s 1;\n  fill: #ff9900;\n  fill-opacity: 0.7;\n}\n\n.fifth.error {\n  animation: errorAnimation 25s 1;\n  fill: #ffcc00;\n  fill-opacity: 0.7;\n}\n\n.innermost.error {\n  animation: errorAnimation 25s 1;\n  fill: #ffff00;\n  fill-opacity: 0.7;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[3].use[1]!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[3].use[2]!./src/styles/common.scss":
/*!*********************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[3].use[1]!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[3].use[2]!./src/styles/common.scss ***!
  \*********************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.hidden {
  display: none;
}

#saypi-playButton.play-button {
  /* position over the talk button, but under any controls */
  z-index: 70; /* talk button z-index is 59 or 60 */
  background-color: rgba(0, 0, 0, 0); /* transparent without holes */
  border: none;
}

@media (max-width: 768px) {
  /* maximize (mobile view) button is only displayed on compatible devices */
  #saypi-enterButton,
  #saypi-exitButton {
    position: fixed;
    top: 4rem;
    left: 1.25rem;
    width: 3rem;
    height: 3rem;
    padding: 6px;
    border: 0;
    z-index: 60;
  }
}`, "",{"version":3,"sources":["webpack://./src/styles/common.scss"],"names":[],"mappings":"AAAA;EACE,aAAA;AACF;;AACA;EACE,0DAAA;EACA,WAAA,EAAA,oCAAA;EACA,kCAAA,EAAA,8BAAA;EACA,YAAA;AAEF;;AACA;EACE,0EAAA;EACA;;IAEE,eAAA;IACA,SAAA;IACA,aAAA;IACA,WAAA;IACA,YAAA;IACA,YAAA;IACA,SAAA;IACA,WAAA;EAEF;AACF","sourcesContent":[".hidden {\n  display: none;\n}\n#saypi-playButton.play-button {\n  /* position over the talk button, but under any controls */\n  z-index: 70; /* talk button z-index is 59 or 60 */\n  background-color: rgba(0, 0, 0, 0); /* transparent without holes */\n  border: none;\n}\n\n@media (max-width: 768px) {\n  /* maximize (mobile view) button is only displayed on compatible devices */\n  #saypi-enterButton,\n  #saypi-exitButton {\n    position: fixed;\n    top: 4rem;\n    left: 1.25rem;\n    width: 3rem;\n    height: 3rem;\n    padding: 6px;\n    border: 0;\n    z-index: 60;\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[3].use[1]!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[3].use[2]!./src/styles/desktop.scss":
/*!**********************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[3].use[1]!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[3].use[2]!./src/styles/desktop.scss ***!
  \**********************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
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
html.desktop-view #saypi-talkButton,
html.desktop-view .play-button {
  margin: 0.5rem;
  border-radius: 18px;
  height: 2.25rem;
  width: 5rem;
  display: block; /* For Safari */
}
html.desktop-view html:not(.firefox-android) #saypi-talkButton:active .waveform,
html.desktop-view #saypi-talkButton.active .waveform {
  animation: pulse 1s infinite;
}
html.desktop-view #saypi-talkButton .waveform {
  fill: #776d6d;
}
html.desktop-view #saypi-talkButton.autoSubmit .waveform {
  fill: rgb(65, 138, 47); /* Pi's text-brand-green-600 */
}
html.desktop-view #saypi-notification > svg {
  width: 3rem;
  height: 3rem;
  bottom: 4rem;
  right: 12rem;
  position: fixed;
}
html.desktop-view #saypi-exitButton {
  display: none;
}`, "",{"version":3,"sources":["webpack://./src/styles/desktop.scss"],"names":[],"mappings":"AACE;EACE;IACE,mBAAA;EAAJ;EAEE;IACE,qBAAA;EAAJ;EAEE;IACE,mBAAA;EAAJ;AACF;AAEE;;EAEE,cAAA;EACA,mBAAA;EACA,eAAA;EACA,WAAA;EACA,cAAA,EAAA,eAAA;AAAJ;AAGE;;EAEE,4BAAA;AADJ;AAGE;EACE,aAAA;AADJ;AAGE;EACE,sBAAA,EAAA,8BAAA;AADJ;AAIE;EACE,WAAA;EACA,YAAA;EACA,YAAA;EACA,YAAA;EACA,eAAA;AAFJ;AAKE;EACE,aAAA;AAHJ","sourcesContent":["html.desktop-view {\n  @keyframes pulse {\n    0% {\n      transform: scale(1);\n    }\n    50% {\n      transform: scale(0.9);\n    }\n    100% {\n      transform: scale(1);\n    }\n  }\n  #saypi-talkButton,\n  .play-button {\n    margin: 0.5rem;\n    border-radius: 18px;\n    height: 2.25rem;\n    width: 5rem;\n    display: block; /* For Safari */\n  }\n\n  html:not(.firefox-android) #saypi-talkButton:active .waveform,\n  #saypi-talkButton.active .waveform {\n    animation: pulse 1s infinite;\n  }\n  #saypi-talkButton .waveform {\n    fill: #776d6d;\n  }\n  #saypi-talkButton.autoSubmit .waveform {\n    fill: rgb(65 138 47); /* Pi's text-brand-green-600 */\n  }\n\n  #saypi-notification > svg {\n    width: 3rem;\n    height: 3rem;\n    bottom: 4rem;\n    right: 12rem;\n    position: fixed;\n  }\n\n  #saypi-exitButton {\n    display: none;\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[3].use[1]!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[3].use[2]!./src/styles/mobile.scss":
/*!*********************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[3].use[1]!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[3].use[2]!./src/styles/mobile.scss ***!
  \*********************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `@media (max-width: 768px) {
  html.mobile-view {
    /* Pi controls: ellipsis, experiences */
    /* Pi controls: mute/unmute */
    /* fix an alignment issue with the "new ui layout" */
  }
  html.mobile-view #saypi-panel,
  html.mobile-view .play-button,
  html.mobile-view .notification {
    width: 100%;
    position: fixed;
    left: 0;
    background-color: rgba(245, 238, 223, 0.98);
    height: 100vh;
    top: 0;
  }
  html.mobile-view #saypi-talkButton {
    width: 100%;
    height: 100%;
    background-color: transparent;
    border-radius: 0;
    margin: 0;
  }
  html.mobile-view #saypi-notification {
    z-index: 100;
    background-color: transparent;
  }
  html.mobile-view #saypi-notification svg {
    width: 75%;
    height: 100%;
    margin: auto;
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
  html.mobile-view .text-body-chat-m {
    padding-top: 0;
  }
  html.mobile-view #saypi-enterButton {
    display: none;
  }
  html.mobile-view #saypi-footer {
    display: none;
  }
  html.mobile-view #saypi-prompt {
    /* hides virtual keyboard on android */
    display: none;
  }
  html.mobile-view #saypi-submitButton {
    display: none;
  }
}`, "",{"version":3,"sources":["webpack://./src/styles/mobile.scss"],"names":[],"mappings":"AAAA;EACE;IA+BE,uCAAA;IAMA,6BAAA;IAiBA,oDAAA;EAlDF;EAHE;;;IAGE,WAAA;IACA,eAAA;IACA,OAAA;IACA,2CAAA;IAEA,aAAA;IACA,MAAA;EAIJ;EADE;IACE,WAAA;IACA,YAAA;IACA,6BAAA;IACA,gBAAA;IACA,SAAA;EAGJ;EAAE;IACE,YAAA;IACA,6BAAA;EAEJ;EADI;IACE,UAAA;IACA,YAAA;IACA,YAAA;EAGN;EAEE;;IAEE,qBAAA;EAAJ;EAIE;IACE,2BAAA;IAIA,0BAAA;EALJ;EAEI;IACE,aAAA;EAAN;EAGI;IACE,8BAAA;IACA,WAAA;IACA,mCAAA;EADN;EAEM;IACE,aAAA;EAAR;EAME;IACE,cAAA;EAJJ;EAOE;IACE,aAAA;EALJ;EAQE;IACE,aAAA;EANJ;EASE;IACE,sCAAA;IACA,aAAA;EAPJ;EAUE;IACE,aAAA;EARJ;AACF","sourcesContent":["@media (max-width: 768px) {\n  html.mobile-view {\n    #saypi-panel,\n    .play-button,\n    .notification {\n      width: 100%;\n      position: fixed;\n      left: 0;\n      background-color: rgba(245, 238, 223, 0.98);\n\n      height: 100vh;\n      top: 0;\n    }\n\n    #saypi-talkButton {\n      width: 100%;\n      height: 100%;\n      background-color: transparent;\n      border-radius: 0;\n      margin: 0;\n    }\n\n    #saypi-notification {\n      z-index: 100;\n      background-color: transparent;\n      svg {\n        width: 75%;\n        height: 100%;\n        margin: auto;\n      }\n    }\n\n    /* Pi controls: ellipsis, experiences */\n    #__next > main > div > div > div.fixed.top-4.right-6 > button,\n    #saypi-experiences-button {\n      transform: scale(1.5);\n    }\n\n    /* Pi controls: mute/unmute */\n    #saypi-audio-controls {\n      /* hide the voice options */\n      div.p-1 {\n        display: none;\n      }\n      /* scale the mute button */\n      button.group {\n        transform: scale(2) !important;\n        z-index: 50;\n        /* hide the voice selector twisty */\n        + button {\n          display: none;\n        }\n      }\n    }\n\n    /* fix an alignment issue with the \"new ui layout\" */\n    .text-body-chat-m {\n      padding-top: 0;\n    }\n\n    #saypi-enterButton {\n      display: none;\n    }\n\n    #saypi-footer {\n      display: none;\n    }\n\n    #saypi-prompt {\n      /* hides virtual keyboard on android */\n      display: none;\n    }\n\n    #saypi-submitButton {\n      display: none;\n    }\n  }\n}\n"],"sourceRoot":""}]);
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

/***/ "./src/icons/exit.svg":
/*!****************************!*\
  !*** ./src/icons/exit.svg ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64.06 64.33\">\n  <defs>\n    <style>\n      .cls-1 {\n        fill: #24381b;\n      }\n\n      .cls-1, .cls-2 {\n        stroke-width: 0px;\n      }\n\n      .cls-2 {\n        fill: #dfd7c2;\n      }\n    </style>\n  </defs>\n  <path class=\"cls-2\" d=\"m31.71,64.32C14.77,64.46-.44,49.93,0,31.33.41,14.47,14.29-.32,32.7,0c16.91.3,31.8,14.32,31.36,33.14-.39,16.76-14.49,31.55-32.34,31.18Zm10.67-23.19c.06-.7-.41-1.12-.84-1.55-2-2-3.94-4.07-6.02-5.97-1.14-1.04-1.32-1.68-.06-2.82,2.13-1.93,4.07-4.08,6.1-6.12.78-.79,1.31-1.64.34-2.56-.92-.87-1.72-.28-2.43.45-2.17,2.21-4.39,4.39-6.52,6.65-.72.77-1.16.7-1.84-.02-2.06-2.17-4.19-4.28-6.29-6.41-.76-.77-1.59-1.68-2.66-.63-1.14,1.12-.19,1.98.62,2.79,2.07,2.09,4.09,4.22,6.2,6.26.77.75.82,1.2.02,1.97-2.21,2.1-4.33,4.3-6.49,6.45-.79.78-1.3,1.65-.32,2.56.92.85,1.71.26,2.43-.47,2.11-2.12,4.28-4.19,6.33-6.38.88-.94,1.37-.86,2.21.03,2.13,2.26,4.37,4.41,6.57,6.6.51.51,1.09.78,1.8.48.56-.24.85-.68.87-1.3Z\"/>\n  <path class=\"cls-1\" d=\"m42.47,41.27c-.02.62-.32,1.06-.87,1.3-.71.31-1.29.03-1.8-.48-2.2-2.2-4.44-4.35-6.57-6.6-.84-.89-1.33-.96-2.21-.03-2.04,2.19-4.22,4.25-6.33,6.38-.72.72-1.51,1.32-2.43.47-.98-.91-.47-1.78.32-2.56,2.16-2.15,4.28-4.35,6.49-6.45.81-.77.76-1.22-.02-1.97-2.11-2.04-4.13-4.17-6.2-6.26-.8-.81-1.75-1.67-.62-2.79,1.07-1.05,1.9-.14,2.66.63,2.1,2.13,4.23,4.24,6.29,6.41.69.73,1.12.79,1.84.02,2.13-2.26,4.35-4.43,6.52-6.65.72-.73,1.51-1.31,2.43-.45.97.92.44,1.78-.34,2.56-2.03,2.04-3.97,4.19-6.1,6.12-1.25,1.14-1.08,1.78.06,2.82,2.09,1.91,4.02,3.97,6.02,5.97.43.43.9.85.84,1.55Z\"/>\n</svg>");

/***/ }),

/***/ "./src/icons/maximize.svg":
/*!********************************!*\
  !*** ./src/icons/maximize.svg ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" zoomAndPan=\"magnify\" viewBox=\"0 0 768 767.999994\" preserveAspectRatio=\"xMidYMid meet\" version=\"1.0\"><path fill=\"#e4d8c1\" d=\"M 768.132812 379.535156 C 768.132812 169.089844 597.523438 -1.496094 387.050781 -1.496094 C 176.609375 -1.496094 5.996094 169.089844 5.996094 379.535156 C 5.996094 589.949219 176.609375 760.539062 387.050781 760.539062 C 597.523438 760.539062 768.132812 589.949219 768.132812 379.535156 \" fill-opacity=\"1\" fill-rule=\"nonzero\"/><path fill=\"#776d6d\" d=\"M 538.996094 223.152344 L 306.535156 229.855469 L 538.996094 455.695312 Z M 538.996094 223.152344 \" fill-opacity=\"1\" fill-rule=\"nonzero\"/><path fill=\"#776d6d\" d=\"M 235.105469 535.890625 L 467.597656 529.1875 L 235.105469 303.34375 Z M 235.105469 535.890625 \" fill-opacity=\"1\" fill-rule=\"nonzero\"/></svg>");

/***/ }),

/***/ "./src/icons/muted_microphone.svg":
/*!****************************************!*\
  !*** ./src/icons/muted_microphone.svg ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"500\" zoomAndPan=\"magnify\" viewBox=\"0 0 375 374.999991\" height=\"500\" preserveAspectRatio=\"xMidYMid meet\" version=\"1.0\"><path fill=\"#776d6d\" d=\"M 239.722656 126.441406 L 239.722656 122.300781 C 239.722656 93.507812 216.296875 70.078125 187.5 70.078125 C 158.703125 70.078125 135.277344 93.507812 135.277344 122.300781 L 135.277344 187.953125 C 135.277344 199.988281 139.410156 211.050781 146.273438 219.890625 Z M 239.722656 126.441406 \" fill-opacity=\"1\" fill-rule=\"nonzero\"/><path fill=\"#776d6d\" d=\"M 155.046875 228.792969 C 163.964844 235.898438 175.234375 240.175781 187.5 240.175781 C 216.296875 240.175781 239.722656 216.75 239.722656 187.953125 L 239.722656 144.113281 Z M 155.046875 228.792969 \" fill-opacity=\"1\" fill-rule=\"nonzero\"/><path fill=\"#776d6d\" d=\"M 187.5 0 C 83.945312 0 0 83.945312 0 187.5 C 0 291.054688 83.945312 375 187.5 375 C 291.054688 375 375 291.054688 375 187.5 C 375 83.945312 291.054688 0 187.5 0 Z M 287.484375 96.355469 L 254.640625 129.195312 L 254.640625 187.953125 C 254.640625 224.976562 224.523438 255.097656 187.5 255.097656 C 171.117188 255.097656 156.105469 249.183594 144.4375 239.402344 L 138.109375 245.730469 C 151.417969 257.121094 168.652344 264.046875 187.5 264.046875 C 229.457031 264.046875 263.59375 229.914062 263.59375 187.953125 C 263.59375 183.832031 266.933594 180.496094 271.054688 180.496094 C 275.175781 180.496094 278.515625 183.835938 278.515625 187.953125 C 278.515625 235.625 241.667969 274.828125 194.960938 278.640625 L 194.960938 304.921875 L 220.121094 304.921875 C 224.242188 304.921875 227.582031 308.261719 227.582031 312.382812 C 227.582031 316.5 224.242188 319.839844 220.121094 319.839844 L 154.875 319.839844 C 150.757812 319.839844 147.417969 316.5 147.417969 312.382812 C 147.417969 308.261719 150.757812 304.921875 154.875 304.921875 L 180.039062 304.921875 L 180.039062 278.636719 C 160.007812 277.003906 141.816406 268.824219 127.542969 256.296875 L 96.351562 287.484375 C 95.132812 288.703125 93.53125 289.316406 91.933594 289.316406 C 90.335938 289.316406 88.734375 288.703125 87.515625 287.484375 C 85.074219 285.042969 85.074219 281.085938 87.515625 278.644531 L 118.761719 247.398438 C 104.929688 231.4375 96.484375 210.6875 96.484375 187.953125 C 96.484375 183.832031 99.824219 180.496094 103.941406 180.496094 C 108.0625 180.496094 111.402344 183.835938 111.402344 187.953125 C 111.402344 206.574219 118.148438 223.628906 129.292969 236.867188 L 135.628906 230.53125 C 126.089844 218.9375 120.355469 204.105469 120.355469 187.953125 L 120.355469 122.300781 C 120.355469 85.28125 150.476562 55.160156 187.496094 55.160156 C 221.128906 55.160156 248.980469 80.039062 253.816406 112.34375 L 278.640625 87.515625 C 281.082031 85.078125 285.039062 85.078125 287.480469 87.515625 C 289.925781 89.957031 289.925781 93.914062 287.484375 96.355469 Z M 287.484375 96.355469 \" fill-opacity=\"1\" fill-rule=\"nonzero\"/></svg>");

/***/ }),

/***/ "./src/icons/rectangles.svg":
/*!**********************************!*\
  !*** ./src/icons/rectangles.svg ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 307 640\">\n  <defs>\n    <style>\n      .innermost, .second, .third, .fourth, .fifth, .outermost {\n        stroke-width: 0px;\n      }\n      \n      .outermost {\n        fill: #e4f2d1;\n      }\n\n      .second {\n        fill: #cce8b5;\n      }\n\n      .third {\n        fill: #b3db95;\n      }\n\n      .fourth {\n        fill: #9bd078;\n      }\n\n      .fifth {\n        fill: #83c55c;\n      }\n\n      .innermost {\n        fill: #428a2f;\n      }\n    </style>\n  </defs>\n  <path class=\"outermost\" d=\"m306.9,320c0,105.3-.02,210.6.1,315.91,0,3.42-.67,4.1-4.09,4.09-99.6-.12-199.21-.12-298.81,0C.67,640,0,639.33,0,635.91.11,425.3.11,214.7,0,4.09,0,.67.67,0,4.09,0,103.7.12,203.3.12,302.91,0c3.42,0,4.1.67,4.09,4.09-.12,105.3-.1,210.6-.1,315.91Z\"/>\n  <path class=\"second\" d=\"m275.92,323c0,87.63,0,175.27,0,262.9,0,7.24-.55,7.93-7.86,7.98-14.66.09-29.31.03-43.97.03-60.96,0-121.92,0-182.88,0q-7.13,0-7.14-7.24c0-176.1,0-352.21,0-528.31q0-7.26,7.12-7.26c75.78,0,151.56,0,227.35,0q7.38,0,7.38,7.5c0,88.13,0,176.27,0,264.4Z\"/>\n  <path class=\"third\" d=\"m68.06,322.24c0-69.47,0-138.94,0-208.41,0-8.99,1.33-10.13,10.49-9.12,1.98.22,3.98.32,5.97.32,46.13.02,92.26.02,138.39,0,3.48,0,6.92-.23,10.41-.67,5.5-.7,8.74.46,8.73,7.25-.18,138.94-.13,277.88-.13,416.81,0,.33,0,.67,0,1q-.14,10.51-10.39,10.51c-52.13,0-104.25,0-156.38,0q-7.09,0-7.09-7.28c0-70.14,0-140.27,0-210.41Z\"/>\n  <path class=\"fourth\" d=\"m103.02,322.5c0-52.46,0-104.91,0-157.37,0-6.68.36-7.06,7.07-7.06,30.3-.01,60.6.07,90.9-.09,4.54-.02,6.08,1.33,6.07,5.98-.1,105.58-.1,211.16,0,316.74,0,4.18-1.27,5.37-5.38,5.35-29.3-.15-58.6-.08-87.9-.08q-10.76,0-10.76-11.09c0-50.79,0-101.58,0-152.37Z\"/>\n  <path class=\"fifth\" d=\"m173,322.2c0,35.29,0,70.58,0,105.88q0,6.89-6.99,6.9c-8.15,0-16.31-.13-24.46.06-3.47.08-4.68-1.09-4.61-4.59.18-9.65.06-19.31.06-28.96,0-58.26-.01-116.53.02-174.79,0-4.76-1.12-9.46-.14-14.3.51-2.54,1.39-3.38,3.8-3.36,8.82.06,17.64.14,26.46-.02,4.59-.09,5.95,1.85,5.94,6.33-.14,35.62-.08,71.25-.08,106.87Z\"/>\n  <path class=\"innermost\" d=\"m151.04,322.01c0-9.99.07-19.97-.05-29.96-.04-2.93.83-4.18,3.95-4.18,3.06,0,4.03,1.12,4.02,4.11-.09,19.97-.08,39.94.01,59.91.01,2.96-.84,4.16-3.96,4.14-3.03-.01-4.08-1.04-4.03-4.08.14-9.98.05-19.97.05-29.96Z\"/>\n</svg>");

/***/ }),

/***/ "./src/icons/waveform.svg":
/*!********************************!*\
  !*** ./src/icons/waveform.svg ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.0\" viewBox=\"0 0 56.25 30\" class=\"waveform\">\n    <defs>\n        <clipPath id=\"a\">\n            <path d=\"M.54 12H3v5H.54Zm0 0\"/>\n        </clipPath>\n        <clipPath id=\"b\">\n            <path d=\"M25 2.2h2v24.68h-2Zm0 0\"/>\n        </clipPath>\n        <clipPath id=\"c\">\n            <path d=\"M53 12h1.98v5H53Zm0 0\"/>\n        </clipPath>\n    </defs>\n    <g clip-path=\"url(#a)\">\n        <path d=\"M1.48 12.71c-.5 0-.9.4-.9.9v1.85a.9.9 0 0 0 1.8 0v-1.84c0-.5-.4-.9-.9-.9Zm0 0\"/>\n    </g>\n    <path d=\"M4.98 6.63c-.5 0-.9.4-.9.9v14.01a.9.9 0 0 0 1.81 0v-14c0-.5-.4-.92-.9-.92Zm3.51 3.1a.9.9 0 0 0-.9.91v7.79a.9.9 0 0 0 1.8 0v-7.79c0-.5-.4-.9-.9-.9ZM12 3.83a.9.9 0 0 0-.91.9v19.6a.9.9 0 0 0 1.8 0V4.74c0-.5-.4-.9-.9-.9Zm3.5 8.29a.9.9 0 0 0-.91.9v3.03a.9.9 0 0 0 1.81 0v-3.03c0-.5-.4-.9-.9-.9ZM19 6.8c-.5 0-.9.4-.9.9v13.68a.9.9 0 0 0 1.8 0V7.7c0-.5-.4-.9-.9-.9Zm3.58-2.97h-.01c-.5 0-.9.4-.9.9l-.13 19.6c0 .5.4.9.9.91.5 0 .9-.4.9-.9l.14-19.6a.9.9 0 0 0-.9-.9Zm0 0\"/>\n    <g clip-path=\"url(#b)\">\n        <path d=\"M26 2.2c-.5 0-.9.4-.9.9v22.86a.9.9 0 1 0 1.81 0V3.11a.9.9 0 0 0-.9-.91Zm0 0\"/>\n    </g>\n    <path d=\"M29.52 7.71a.9.9 0 0 0-.91.9v11.85a.9.9 0 0 0 1.81 0V8.62c0-.5-.4-.9-.9-.9Zm3.5 2.93a.9.9 0 0 0-.9.91v5.97a.9.9 0 0 0 1.8 0v-5.97c0-.5-.4-.9-.9-.9Zm3.5-5.78c-.5 0-.9.4-.9.9v17.55a.9.9 0 0 0 1.81 0V5.76c0-.5-.4-.9-.9-.9Zm3.51 3.34c-.5 0-.9.4-.9.9v10.87a.9.9 0 0 0 1.8 0V9.1a.9.9 0 0 0-.9-.91Zm3.5 3.08c-.5 0-.9.4-.9.91v4.7a.9.9 0 1 0 1.8 0v-4.7a.9.9 0 0 0-.9-.9Zm3.51-7.45a.9.9 0 0 0-.91.9v19.6a.9.9 0 0 0 1.81 0V4.74c0-.5-.4-.9-.9-.9Zm3.5 5.57a.9.9 0 0 0-.9.91v8.45a.9.9 0 0 0 1.8 0v-8.45c0-.5-.4-.9-.9-.9Zm0 0\"/>\n    <g clip-path=\"url(#c)\">\n        <path d=\"M54.04 12.96a.9.9 0 0 0-.9.91v1.33a.9.9 0 1 0 1.8 0v-1.32a.9.9 0 0 0-.9-.92Zm0 0\"/>\n    </g>\n</svg>");

/***/ }),

/***/ "./src/styles/rectangles.css":
/*!***********************************!*\
  !*** ./src/styles/rectangles.css ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_rectangles_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./rectangles.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles/rectangles.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_rectangles_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_rectangles_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_rectangles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_rectangles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/styles/common.scss":
/*!********************************!*\
  !*** ./src/styles/common.scss ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_3_use_1_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_3_use_2_common_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[3].use[1]!../../node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[3].use[2]!./common.scss */ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[3].use[1]!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[3].use[2]!./src/styles/common.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_3_use_1_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_3_use_2_common_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_3_use_1_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_3_use_2_common_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_3_use_1_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_3_use_2_common_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_3_use_1_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_3_use_2_common_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/styles/desktop.scss":
/*!*********************************!*\
  !*** ./src/styles/desktop.scss ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_3_use_1_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_3_use_2_desktop_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[3].use[1]!../../node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[3].use[2]!./desktop.scss */ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[3].use[1]!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[3].use[2]!./src/styles/desktop.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_3_use_1_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_3_use_2_desktop_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_3_use_1_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_3_use_2_desktop_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_3_use_1_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_3_use_2_desktop_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_3_use_1_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_3_use_2_desktop_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/styles/mobile.scss":
/*!********************************!*\
  !*** ./src/styles/mobile.scss ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_3_use_1_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_3_use_2_mobile_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[3].use[1]!../../node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[3].use[2]!./mobile.scss */ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[3].use[1]!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[3].use[2]!./src/styles/mobile.scss");

      
      
      
      
      
      
      
      
      

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
/* harmony import */ var _styles_common_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./styles/common.scss */ "./src/styles/common.scss");
/* harmony import */ var _styles_desktop_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./styles/desktop.scss */ "./src/styles/desktop.scss");
/* harmony import */ var _styles_mobile_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./styles/mobile.scss */ "./src/styles/mobile.scss");
/* harmony import */ var _styles_rectangles_css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./styles/rectangles.css */ "./src/styles/rectangles.css");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }








(function () {
  "use strict";

  var pageScript = (__webpack_require__(/*! raw-loader!./AudioModule.js */ "./node_modules/raw-loader/dist/cjs.js!./src/AudioModule.js")["default"]);
  (0,_UserAgentModule_js__WEBPACK_IMPORTED_MODULE_3__.addUserAgentFlags)();
  _EventModule_js__WEBPACK_IMPORTED_MODULE_2__["default"].init();
  setupEventBus();

  // Create a MutationObserver to listen for changes to the DOM
  // textareas are added to the DOM after the page loads
  var callback = function callback(mutationsList, observer) {
    var _iterator = _createForOfIteratorHelper(mutationsList),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var mutation = _step.value;
        if (mutation.type === "childList") {
          // Iterate through added nodes
          mutation.addedNodes.forEach(function (node) {
            // Check if added node is a textarea with 'enterkeyhint' attribute
            if (node.nodeName === "TEXTAREA" && node.hasAttribute("enterkeyhint")) {
              // Stop observing to avoid any potential infinite loops
              observer.disconnect();

              // Do something with the textarea, like add an event listener
              annotateDOM(node);
              return;
            }

            // Check if added node contains a textarea with 'enterkeyhint' attribute
            if (node.querySelectorAll) {
              var textareas = node.querySelectorAll("textarea[enterkeyhint]");
              if (textareas.length > 0) {
                // Stop observing
                observer.disconnect();

                // Do something with the first textarea that has 'enterkeyhint'
                annotateDOM(textareas[0]);
                return;
              }
            }
          });
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };

  // Options for the observer (which mutations to observe)
  var config = {
    attributes: false,
    childList: true,
    subtree: true
  };

  // Create an observer instance linked to the callback function
  var observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(document.body, config);
  function setupEventBus() {
    // Setting the correct context
    var context = window;
    if (GM_info.scriptHandler !== "Userscripts") {
      context = unsafeWindow;
    }
    context.EventBus = _EventBus_js__WEBPACK_IMPORTED_MODULE_1__["default"]; // Make the EventBus available to the page script
  }

  function annotateDOM(prompt) {
    // Add id attributes to important elements
    prompt.id = "saypi-prompt";
    var foundFooter = addIdFooter();
    var foundAudioControls = addIdAudioControls();
    var promptControlsContainer = prompt.parentElement.parentElement;
    addIdSubmitButton(promptControlsContainer);
    addTalkButton(promptControlsContainer);
    _ButtonModule_js__WEBPACK_IMPORTED_MODULE_0__.buttonModule.createEnterButton();
    _ButtonModule_js__WEBPACK_IMPORTED_MODULE_0__.buttonModule.createExitButton();
  }
  function addIdSubmitButton(container) {
    var submitButton = container.querySelector("button[type=button]");
    if (submitButton) {
      submitButton.id = "saypi-submitButton";
    }
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
        precedingDiv.lastElementChild.id = "saypi-footer";
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
    // Create a containing div
    var panel = document.createElement("div");
    panel.id = "saypi-panel";

    // Check if the container has any child elements
    if (container.childNodes.length > 0) {
      // Insert the panel as the second-to-last child
      container.insertBefore(panel, container.lastChild);
    } else {
      // If the container has no children, just append the panel
      container.appendChild(panel);
    }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sNEZBQTRGLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxZQUFZLE1BQU0sU0FBUyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxTQUFTLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFNBQVMsWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssU0FBUyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxTQUFTLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFNBQVMsWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLFlBQVksTUFBTSxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sWUFBWSxNQUFNLEtBQUssS0FBSyxPQUFPLE1BQU0sS0FBSyxLQUFLLE9BQU8sTUFBTSxLQUFLLFlBQVksTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLEtBQUssTUFBTSxZQUFZLE1BQU0sTUFBTSxZQUFZLE1BQU0sTUFBTSxLQUFLLE1BQU0sWUFBWSxNQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sS0FBSyxNQUFNLFlBQVksTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLEtBQUssTUFBTSxZQUFZLE1BQU0sTUFBTSxZQUFZLE1BQU0sTUFBTSxLQUFLLE1BQU0sWUFBWSxNQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sWUFBWSxNQUFNLE1BQU0sWUFBWSxhQUFhLE1BQU0sS0FBSyxZQUFZLGFBQWEsTUFBTSxNQUFNLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FB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Q0FBQ3dCLG1CQUFtQixDQUFDcEgsSUFBSSxDQUFDNEYsdURBQVcsQ0FDbEQsQ0FBQztJQUNEckYsTUFBTSxDQUFDOEMsZ0JBQWdCLENBQ3JCLFNBQVMsRUFDVHVDLHVEQUFXLENBQUN5QixpQkFBaUIsQ0FBQ3JILElBQUksQ0FBQzRGLHVEQUFXLENBQ2hELENBQUM7SUFDRHJGLE1BQU0sQ0FBQzhDLGdCQUFnQixDQUFDLFVBQVUsRUFBRTtNQUFBLE9BQ2xDdUMsdURBQVcsQ0FBQzBCLHFCQUFxQixDQUFDL0csTUFBTSxDQUFDO0lBQUEsQ0FDM0MsQ0FBQztJQUNEQSxNQUFNLENBQUM4QyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsVUFBQ1osQ0FBQztNQUFBLE9BQ3RDbUQsdURBQVcsQ0FBQzZCLG9CQUFvQixDQUFDbEgsTUFBTSxFQUFFa0MsQ0FBQyxDQUFDO0lBQUEsQ0FDN0MsQ0FBQztJQUNEbEMsTUFBTSxDQUFDOEMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFO01BQUEsT0FDbEN1Qyx1REFBVyxDQUFDK0Isa0JBQWtCLENBQUNwSCxNQUFNLENBQUM7SUFBQSxDQUN4QyxDQUFDO0lBRURxRix1REFBVyxDQUFDZ0MsOEJBQThCLENBQUNySCxNQUFNLENBQUM7SUFDbERxRix1REFBVyxDQUFDc0MsY0FBYyxDQUFDLENBQUM7RUFDOUI7O0VBRUE7RUFDQXJHLFFBQVEsQ0FBQ2UsT0FBTyxDQUFDMUUsUUFBUSxFQUFFO0lBQUVtUSxTQUFTLEVBQUUsSUFBSTtJQUFFQyxPQUFPLEVBQUU7RUFBSyxDQUFDLENBQUM7QUFDaEUsQ0FBQyxFQUFFLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL0FuaW1hdGlvbk1vZHVsZS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL0J1dHRvbk1vZHVsZS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL0V2ZW50QnVzLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvRXZlbnRNb2R1bGUuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9TdGF0ZU1hY2hpbmVTZXJ2aWNlLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvVHJhbnNjcmlwdGlvbk1vZHVsZS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL1VzZXJBZ2VudE1vZHVsZS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3NheXBpU3RhdGVNYWNoaW5lLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvc3R5bGVzL3JlY3RhbmdsZXMuY3NzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvc3R5bGVzL2NvbW1vbi5zY3NzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvc3R5bGVzL2Rlc2t0b3Auc2NzcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3N0eWxlcy9tb2JpbGUuc2NzcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvQXVkaW9Nb2R1bGUuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9pY29ucy9leGl0LnN2ZyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL2ljb25zL21heGltaXplLnN2ZyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL2ljb25zL211dGVkX21pY3JvcGhvbmUuc3ZnIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvaWNvbnMvcmVjdGFuZ2xlcy5zdmciLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9pY29ucy93YXZlZm9ybS5zdmciLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9zdHlsZXMvcmVjdGFuZ2xlcy5jc3M/OTc0NSIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3N0eWxlcy9jb21tb24uc2Nzcz8wNGMzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvc3R5bGVzL2Rlc2t0b3Auc2Nzcz9kYWQ3Iiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvc3R5bGVzL21vYmlsZS5zY3NzPzFjODMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9BY3Rvci5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9NYWNoaW5lLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL1N0YXRlLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL1N0YXRlTm9kZS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9fdmlydHVhbC9fdHNsaWIuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvYWN0aW9uVHlwZXMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvYWN0aW9ucy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9iZWhhdmlvcnMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvY29uc3RhbnRzLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL2RldlRvb2xzLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL2Vudmlyb25tZW50LmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL2ludGVycHJldGVyLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL2ludm9rZVV0aWxzLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL3JlZ2lzdHJ5LmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL3NjaGVkdWxlci5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9zZXJ2aWNlU2NvcGUuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvc3RhdGVVdGlscy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy90eXBlcy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy91dGlscy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9zYXlwaS5pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBBbmltYXRpb25Nb2R1bGUge1xuICBzdGF0aWMgcmVjdGFuZ2xlc1NlbGVjdG9yID1cbiAgICBcIi5vdXRlcm1vc3QsIC5zZWNvbmQsIC50aGlyZCwgLmZvdXJ0aCwgLmZpZnRoLCAuaW5uZXJtb3N0XCI7XG4gIHN0YXRpYyB0YWxrQnV0dG9uQW5pbWF0aW9ucyA9IFtcbiAgICBcImxvYWRpbmdcIixcbiAgICBcInBpU3BlYWtpbmdcIixcbiAgICBcInVzZXJTcGVha2luZ1wiLFxuICAgIFwidHJhbnNjcmliaW5nXCIsXG4gICAgXCJwYXVzZWRcIixcbiAgXTtcblxuICBzdGF0aWMgc3RhcnRBbmltYXRpb24oYW5pbWF0aW9uKSB7XG4gICAgdGhpcy5zdG9wT3RoZXJBbmltYXRpb25zKGFuaW1hdGlvbik7XG5cbiAgICBsZXQgcmVjdGFuZ2xlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5yZWN0YW5nbGVzU2VsZWN0b3IpO1xuICAgIHJlY3RhbmdsZXMuZm9yRWFjaCgocmVjdCkgPT4gcmVjdC5jbGFzc0xpc3QuYWRkKGFuaW1hdGlvbikpO1xuICB9XG5cbiAgc3RhdGljIHN0b3BBbmltYXRpb24oYW5pbWF0aW9uKSB7XG4gICAgbGV0IHJlY3RhbmdsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMucmVjdGFuZ2xlc1NlbGVjdG9yKTtcbiAgICByZWN0YW5nbGVzLmZvckVhY2goKHJlY3QpID0+IHJlY3QuY2xhc3NMaXN0LnJlbW92ZShhbmltYXRpb24pKTtcbiAgfVxuXG4gIHN0YXRpYyBzdG9wQWxsQW5pbWF0aW9ucygpIHtcbiAgICB0aGlzLnRhbGtCdXR0b25BbmltYXRpb25zLmZvckVhY2goKGFuaW1hdGlvbikgPT5cbiAgICAgIHRoaXMuc3RvcEFuaW1hdGlvbihhbmltYXRpb24pXG4gICAgKTtcbiAgfVxuXG4gIHN0YXRpYyBzdG9wT3RoZXJBbmltYXRpb25zKGtlZXBBbmltYXRpb24pIHtcbiAgICB0aGlzLnRhbGtCdXR0b25BbmltYXRpb25zLmZvckVhY2goKGFuaW1hdGlvbikgPT4ge1xuICAgICAgaWYgKGFuaW1hdGlvbiAhPT0ga2VlcEFuaW1hdGlvbikge1xuICAgICAgICB0aGlzLnN0b3BBbmltYXRpb24oYW5pbWF0aW9uKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgZW50ZXJNb2JpbGVNb2RlLFxuICBleGl0TW9iaWxlTW9kZSxcbiAgaXNNb2JpbGVWaWV3LFxufSBmcm9tIFwiLi9Vc2VyQWdlbnRNb2R1bGVcIjtcbmltcG9ydCBFdmVudEJ1cyBmcm9tIFwiLi9FdmVudEJ1c1wiO1xuaW1wb3J0IFN0YXRlTWFjaGluZVNlcnZpY2UgZnJvbSBcIi4vU3RhdGVNYWNoaW5lU2VydmljZS5qc1wiO1xuaW1wb3J0IGV4aXRJY29uU1ZHIGZyb20gXCIuL2ljb25zL2V4aXQuc3ZnXCI7XG5pbXBvcnQgbWF4aW1pemVJY29uU1ZHIGZyb20gXCIuL2ljb25zL21heGltaXplLnN2Z1wiO1xuaW1wb3J0IHJlY3RhbmdsZXNTVkcgZnJvbSBcIi4vaWNvbnMvcmVjdGFuZ2xlcy5zdmdcIjtcbmltcG9ydCB0YWxrSWNvblNWRyBmcm9tIFwiLi9pY29ucy93YXZlZm9ybS5zdmdcIjtcbmltcG9ydCBtdXRlZE1pY0ljb25TVkcgZnJvbSBcIi4vaWNvbnMvbXV0ZWRfbWljcm9waG9uZS5zdmdcIjtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1dHRvbk1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucGxheUJ1dHRvbiA9IG51bGw7XG4gICAgdGhpcy5hY3RvciA9IFN0YXRlTWFjaGluZVNlcnZpY2UuYWN0b3I7XG4gICAgLy8gQmluZGluZyBtZXRob2RzIHRvIHRoZSBjdXJyZW50IGluc3RhbmNlXG4gICAgdGhpcy5oYW5kbGVQbGF5QnV0dG9uQ2xpY2sgPSB0aGlzLmhhbmRsZVBsYXlCdXR0b25DbGljay5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVnaXN0ZXJPdGhlckV2ZW50cygpO1xuICB9XG5cbiAgcmVnaXN0ZXJPdGhlckV2ZW50cygpIHtcbiAgICBFdmVudEJ1cy5vbihcInNheXBpOmF1dG9TdWJtaXRcIiwgQnV0dG9uTW9kdWxlLmhhbmRsZUF1dG9TdWJtaXQpO1xuICB9XG5cbiAgLy8gRnVuY3Rpb24gdG8gY3JlYXRlIGEgbmV3IGJ1dHRvblxuICBjcmVhdGVCdXR0b24obGFiZWwsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICBidXR0b24udGV4dENvbnRlbnQgPSBsYWJlbDtcbiAgICBidXR0b24ub25jbGljayA9IGNhbGxiYWNrO1xuICAgIHJldHVybiBidXR0b247XG4gIH1cblxuICAvLyBGdW5jdGlvbiB0byBzdHlsZSBhIGdpdmVuIGJ1dHRvblxuICBzdHlsZUJ1dHRvbihidXR0b24sIHN0eWxlcykge1xuICAgIGZvciAobGV0IGtleSBpbiBzdHlsZXMpIHtcbiAgICAgIGlmIChzdHlsZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBidXR0b24uc3R5bGVba2V5XSA9IHN0eWxlc1trZXldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFkZFRhbGtJY29uKGJ1dHRvbikge1xuICAgIHRoaXMudXBkYXRlSWNvbkNvbnRlbnQoYnV0dG9uKTtcblxuICAgIHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1heC13aWR0aDogNzY4cHgpXCIpLmFkZExpc3RlbmVyKCgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlSWNvbkNvbnRlbnQoYnV0dG9uKTtcbiAgICB9KTtcbiAgICB0aGlzLnNldHVwQ2xhc3NPYnNlcnZlcihidXR0b24pO1xuICB9XG5cbiAgdXBkYXRlSWNvbkNvbnRlbnQoaWNvbkNvbnRhaW5lcikge1xuICAgIGlmIChpc01vYmlsZVZpZXcoKSkge1xuICAgICAgaWNvbkNvbnRhaW5lci5pbm5lckhUTUwgPSByZWN0YW5nbGVzU1ZHO1xuICAgIH0gZWxzZSB7XG4gICAgICBpY29uQ29udGFpbmVyLmlubmVySFRNTCA9IHRhbGtJY29uU1ZHO1xuICAgIH1cbiAgfVxuXG4gIHNldHVwQ2xhc3NPYnNlcnZlcihidXR0b24pIHtcbiAgICBjb25zdCB0YXJnZXROb2RlID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50OyAvLyBUaGUgPGh0bWw+IGVsZW1lbnRcblxuICAgIGNvbnN0IGNvbmZpZyA9IHsgYXR0cmlidXRlczogdHJ1ZSwgYXR0cmlidXRlRmlsdGVyOiBbXCJjbGFzc1wiXSB9O1xuXG4gICAgY29uc3QgY2FsbGJhY2sgPSAobXV0YXRpb25zTGlzdCwgb2JzZXJ2ZXIpID0+IHtcbiAgICAgIGZvciAobGV0IG11dGF0aW9uIG9mIG11dGF0aW9uc0xpc3QpIHtcbiAgICAgICAgaWYgKG11dGF0aW9uLnR5cGUgPT09IFwiYXR0cmlidXRlc1wiKSB7XG4gICAgICAgICAgaWYgKG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUgPT09IFwiY2xhc3NcIikge1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJtb2JpbGUtdmlld1wiKSkge1xuICAgICAgICAgICAgICAvLyAnbW9iaWxlLXZpZXcnIGNsYXNzIHdhcyBhZGRlZFxuICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUljb25Db250ZW50KGJ1dHRvbik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyAnbW9iaWxlLXZpZXcnIGNsYXNzIHdhcyByZW1vdmVkXG4gICAgICAgICAgICAgIHRoaXMudXBkYXRlSWNvbkNvbnRlbnQoYnV0dG9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihjYWxsYmFjayk7XG5cbiAgICAvLyBTdGFydCBvYnNlcnZpbmcgdGhlIHRhcmdldCBub2RlIGZvciBjb25maWd1cmVkIG11dGF0aW9uc1xuICAgIG9ic2VydmVyLm9ic2VydmUodGFyZ2V0Tm9kZSwgY29uZmlnKTtcblxuICAgIC8vIExhdGVyLCB5b3UgY2FuIHN0b3Agb2JzZXJ2aW5nIGJ5IGNhbGxpbmc6XG4gICAgLy8gb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICB9XG5cbiAgLy8gU2ltdWxhdGUgYW4gXCJFbnRlclwiIGtleXByZXNzIGV2ZW50IG9uIGEgZm9ybVxuICBzdGF0aWMgc2ltdWxhdGVGb3JtU3VibWl0KCkge1xuICAgIGNvbnN0IHN1Ym1pdEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F5cGktc3VibWl0QnV0dG9uXCIpO1xuICAgIGlmIChzdWJtaXRCdXR0b24pIHtcbiAgICAgIHN1Ym1pdEJ1dHRvbi5jbGljaygpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvKiBoaXQgZW50ZXIga2V5IGluIHRoZSBwcm9tcHQgdGV4dGFyZWEsIG1pZ2h0IG5vdCB3b3JrIGFzIGV4cGVjdGVkIG9uIFwibmV3IHVpIGxheW91dFwiICovXG4gICAgICBjb25zdCB0ZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F5cGktcHJvbXB0XCIpO1xuXG4gICAgICBjb25zdCBlbnRlckV2ZW50ID0gbmV3IEtleWJvYXJkRXZlbnQoXCJrZXlkb3duXCIsIHtcbiAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAga2V5OiBcIkVudGVyXCIsXG4gICAgICAgIGtleUNvZGU6IDEzLFxuICAgICAgICB3aGljaDogMTMsXG4gICAgICB9KTtcblxuICAgICAgdGV4dGFyZWEuZGlzcGF0Y2hFdmVudChlbnRlckV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvLyBGdW5jdGlvbiB0byBoYW5kbGUgYXV0by1zdWJtaXQgYmFzZWQgb24gdGhlIGJ1dHRvbidzIGRhdGEgYXR0cmlidXRlXG4gIHN0YXRpYyBoYW5kbGVBdXRvU3VibWl0KCkge1xuICAgIGNvbnN0IHRhbGtCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNheXBpLXRhbGtCdXR0b25cIik7XG5cbiAgICBpZiAodGFsa0J1dHRvbi5kYXRhc2V0LmF1dG9zdWJtaXQgPT09IFwiZmFsc2VcIikge1xuICAgICAgY29uc29sZS5sb2coXCJBdXRvc3VibWl0IGlzIGRpc2FibGVkXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBCdXR0b25Nb2R1bGUuc2ltdWxhdGVGb3JtU3VibWl0KCk7XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlRXhpdEJ1dHRvbigpIHtcbiAgICBjb25zdCBsYWJlbCA9IFwiRXhpdCBWb2ljZS1Db250cm9sbGVkIE1vYmlsZSBNb2RlXCI7XG4gICAgY29uc3QgYnV0dG9uID0gdGhpcy5jcmVhdGVCdXR0b24oXCJcIiwgKCkgPT4ge1xuICAgICAgZXhpdE1vYmlsZU1vZGUoKTtcbiAgICB9KTtcbiAgICBidXR0b24uaWQgPSBcInNheXBpLWV4aXRCdXR0b25cIjtcbiAgICBidXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgYnV0dG9uLmNsYXNzTmFtZSA9XG4gICAgICBcImV4aXQtYnV0dG9uIGZpeGVkIHJvdW5kZWQtZnVsbCBiZy1jcmVhbS01NTAgZW5hYmxlZDpob3ZlcjpiZy1jcmVhbS02NTBcIjtcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBsYWJlbCk7XG4gICAgYnV0dG9uLnNldEF0dHJpYnV0ZShcInRpdGxlXCIsIGxhYmVsKTtcbiAgICBidXR0b24uaW5uZXJIVE1MID0gZXhpdEljb25TVkc7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChidXR0b24pO1xuICAgIHJldHVybiBidXR0b247XG4gIH1cblxuICBjcmVhdGVFbnRlckJ1dHRvbigpIHtcbiAgICBjb25zdCBsYWJlbCA9IFwiRW50ZXIgVm9pY2UtQ29udHJvbGxlZCBNb2JpbGUgTW9kZVwiO1xuICAgIGNvbnN0IGJ1dHRvbiA9IHRoaXMuY3JlYXRlQnV0dG9uKFwiXCIsICgpID0+IHtcbiAgICAgIGVudGVyTW9iaWxlTW9kZSgpO1xuICAgIH0pO1xuICAgIGJ1dHRvbi5pZCA9IFwic2F5cGktZW50ZXJCdXR0b25cIjtcbiAgICBidXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgYnV0dG9uLmNsYXNzTmFtZSA9XG4gICAgICBcImVudGVyLWJ1dHRvbiBmaXhlZCByb3VuZGVkLWZ1bGwgYmctY3JlYW0tNTUwIGVuYWJsZWQ6aG92ZXI6YmctY3JlYW0tNjUwXCI7XG4gICAgYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgbGFiZWwpO1xuICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiLCBsYWJlbCk7XG4gICAgYnV0dG9uLmlubmVySFRNTCA9IG1heGltaXplSWNvblNWRztcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gICAgcmV0dXJuIGJ1dHRvbjtcbiAgfVxuXG4gIGNyZWF0ZVBsYXlCdXR0b24oKSB7XG4gICAgY29uc3QgbGFiZWwgPSBcIkhlYXIgUGkncyByZXNwb25zZVwiO1xuICAgIHRoaXMucGxheUJ1dHRvbiA9IHRoaXMuY3JlYXRlQnV0dG9uKFwiXCIsICgpID0+IHt9KTtcbiAgICB0aGlzLnBsYXlCdXR0b24uaWQgPSBcInNheXBpLXBsYXlCdXR0b25cIjtcbiAgICB0aGlzLnBsYXlCdXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgdGhpcy5wbGF5QnV0dG9uLmNsYXNzTmFtZSA9IFwiaGlkZGVuIHBsYXktYnV0dG9uXCI7XG4gICAgdGhpcy5wbGF5QnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgbGFiZWwpO1xuICAgIHRoaXMucGxheUJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiLCBsYWJlbCk7XG4gICAgdGhpcy5wbGF5QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLmhhbmRsZVBsYXlCdXR0b25DbGljayk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnBsYXlCdXR0b24pO1xuICAgIHJldHVybiB0aGlzLnBsYXlCdXR0b247XG4gIH1cblxuICBzaG93UGxheUJ1dHRvbigpIHtcbiAgICBpZiAoIXRoaXMucGxheUJ1dHRvbikge1xuICAgICAgdGhpcy5jcmVhdGVQbGF5QnV0dG9uKCk7XG4gICAgfVxuICAgIHRoaXMucGxheUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICB9XG5cbiAgaGlkZVBsYXlCdXR0b24oKSB7XG4gICAgaWYgKHRoaXMucGxheUJ1dHRvbikge1xuICAgICAgdGhpcy5wbGF5QnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlUGxheUJ1dHRvbkNsaWNrKCkge1xuICAgIHRoaXMuYWN0b3Iuc2VuZChcInNheXBpOnBsYXlcIik7XG4gICAgRXZlbnRCdXMuZW1pdChcImF1ZGlvOnJlbG9hZFwiKTtcbiAgfVxuXG4gIHNob3dOb3RpZmljYXRpb24oZGV0YWlscykge1xuICAgIGNvbnN0IGljb24gPSBkZXRhaWxzLmljb247XG4gICAgbGV0IGljb25TVkc7XG4gICAgaWYgKGljb24gPT09IFwibXV0ZWQtbWljcm9waG9uZVwiKSB7XG4gICAgICBpY29uU1ZHID0gbXV0ZWRNaWNJY29uU1ZHO1xuICAgIH1cblxuICAgIGNvbnN0IG5vdGlmaWNhdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F5cGktbm90aWZpY2F0aW9uXCIpO1xuICAgIGlmIChub3RpZmljYXRpb24pIHtcbiAgICAgIG5vdGlmaWNhdGlvbi5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgICAgbm90aWZpY2F0aW9uLmlubmVySFRNTCA9IGljb25TVkc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG5vdGlmaWNhdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBub3RpZmljYXRpb24uaWQgPSBcInNheXBpLW5vdGlmaWNhdGlvblwiO1xuICAgICAgbm90aWZpY2F0aW9uLmNsYXNzTmFtZSA9IFwibm90aWZpY2F0aW9uXCI7XG4gICAgICBub3RpZmljYXRpb24uaW5uZXJIVE1MID0gaWNvblNWRztcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobm90aWZpY2F0aW9uKTtcbiAgICB9XG4gIH1cblxuICBkaXNtaXNzTm90aWZpY2F0aW9uKCkge1xuICAgIGNvbnN0IG5vdGlmaWNhdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F5cGktbm90aWZpY2F0aW9uXCIpO1xuICAgIGlmIChub3RpZmljYXRpb24pIHtcbiAgICAgIG5vdGlmaWNhdGlvbi5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIH1cbiAgfVxufVxuXG4vLyBTaW5nbGV0b25cbmV4cG9ydCBjb25zdCBidXR0b25Nb2R1bGUgPSBuZXcgQnV0dG9uTW9kdWxlKCk7XG4iLCJpbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gXCJldmVudHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgbmV3IEV2ZW50RW1pdHRlcigpO1xuIiwiaW1wb3J0IEV2ZW50QnVzIGZyb20gXCIuL0V2ZW50QnVzLmpzXCI7XG5pbXBvcnQgU3RhdGVNYWNoaW5lU2VydmljZSBmcm9tIFwiLi9TdGF0ZU1hY2hpbmVTZXJ2aWNlLmpzXCI7XG5cbmNvbnN0IFVTRVJfU1BFQUtJTkcgPSBcInNheXBpOnVzZXJTcGVha2luZ1wiO1xuY29uc3QgVVNFUl9TVE9QUEVEX1NQRUFLSU5HID0gXCJzYXlwaTp1c2VyU3RvcHBlZFNwZWFraW5nXCI7XG5jb25zdCBVU0VSX0ZJTklTSEVEX1NQRUFLSU5HID0gXCJzYXlwaTp1c2VyRmluaXNoZWRTcGVha2luZ1wiO1xuY29uc3QgVFJBTlNDUklCSU5HID0gXCJzYXlwaTp0cmFuc2NyaWJpbmdcIjtcbmNvbnN0IFBJX1NQRUFLSU5HID0gXCJzYXlwaTpwaVNwZWFraW5nXCI7XG5jb25zdCBQSV9TVE9QUEVEX1NQRUFLSU5HID0gXCJzYXlwaTpwaVN0b3BwZWRTcGVha2luZ1wiO1xuY29uc3QgUElfRklOSVNIRURfU1BFQUtJTkcgPSBcInNheXBpOnBpRmluaXNoZWRTcGVha2luZ1wiO1xuY29uc3QgUEFVU0UgPSBcInNheXBpOnBhdXNlXCI7XG5jb25zdCBSRUFEWSA9IFwic2F5cGk6cmVhZHlcIjtcbmNvbnN0IFBMQVkgPSBcInNheXBpOnBsYXlcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRNb2R1bGUge1xuICBzdGF0aWMgaW5pdCgpIHtcbiAgICAvLyBBbGwgdGhlIGV2ZW50IGxpc3RlbmVycyBjYW4gYmUgYWRkZWQgaGVyZVxuICAgIHRoaXMucmVnaXN0ZXJTdGF0ZU1hY2hpbmVFdmVudHMoU3RhdGVNYWNoaW5lU2VydmljZS5hY3Rvcik7XG4gICAgLy8gQW55IG90aGVyIGluaXRpYWxpemF0aW9ucy4uLlxuICB9XG5cbiAgc3RhdGljIGNsZWFudXAoKSB7XG4gICAgLy8gUmVtb3ZlIGV2ZW50IGxpc3RlbmVycyBpZiBuZWVkZWQsIG9yIGFueSBvdGhlciBjbGVhbnVwIG9wZXJhdGlvbnNcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwic2F5cGk6dHJhbnNjcmliZWRcIixcbiAgICAgIHRoaXMuaGFuZGxlVHJhbnNjcmlwdGlvblJlc3BvbnNlXG4gICAgKTtcbiAgfVxuXG4gIHN0YXRpYyBzaW11bGF0ZVR5cGluZyhlbGVtZW50LCB0ZXh0KSB7XG4gICAgY29uc3Qgd29yZHMgPSB0ZXh0LnNwbGl0KFwiIFwiKTtcbiAgICBsZXQgaSA9IDA7XG5cbiAgICBjb25zdCB0eXBlV29yZCA9ICgpID0+IHtcbiAgICAgIGlmIChpIDwgd29yZHMubGVuZ3RoKSB7XG4gICAgICAgIEV2ZW50TW9kdWxlLnNldE5hdGl2ZVZhbHVlKGVsZW1lbnQsIGVsZW1lbnQudmFsdWUgKyB3b3Jkc1tpKytdICsgXCIgXCIpO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodHlwZVdvcmQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRXZlbnRCdXMuZW1pdChcInNheXBpOmF1dG9TdWJtaXRcIik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHR5cGVXb3JkKCk7XG4gIH1cblxuICBzdGF0aWMgc2V0TmF0aXZlVmFsdWUoZWxlbWVudCwgdmFsdWUpIHtcbiAgICBsZXQgbGFzdFZhbHVlID0gZWxlbWVudC52YWx1ZTtcbiAgICBlbGVtZW50LnZhbHVlID0gdmFsdWU7XG4gICAgbGV0IGV2ZW50ID0gbmV3IEV2ZW50KFwiaW5wdXRcIiwgeyB0YXJnZXQ6IGVsZW1lbnQsIGJ1YmJsZXM6IHRydWUgfSk7XG4gICAgLy8gUmVhY3QgMTVcbiAgICBldmVudC5zaW11bGF0ZWQgPSB0cnVlO1xuICAgIC8vIFJlYWN0IDE2LTE3XG4gICAgbGV0IHRyYWNrZXIgPSBlbGVtZW50Ll92YWx1ZVRyYWNrZXI7XG4gICAgaWYgKHRyYWNrZXIpIHtcbiAgICAgIHRyYWNrZXIuc2V0VmFsdWUobGFzdFZhbHVlKTtcbiAgICB9XG4gICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgfVxuXG4gIHN0YXRpYyBoYW5kbGVUYWxrTW91c2VEb3duKCkge1xuICAgIEV2ZW50QnVzLmVtaXQoXCJhdWRpbzpzdGFydFJlY29yZGluZ1wiKTtcbiAgfVxuXG4gIHN0YXRpYyBoYW5kbGVUYWxrTW91c2VVcCgpIHtcbiAgICBFdmVudEJ1cy5lbWl0KFwiYXVkaW86c3RvcFJlY29yZGluZ1wiKTtcbiAgfVxuXG4gIHN0YXRpYyBoYW5kbGVUYWxrRG91YmxlQ2xpY2soYnV0dG9uKSB7XG4gICAgLy8gVG9nZ2xlIHRoZSBDU1MgY2xhc3NlcyB0byBpbmRpY2F0ZSB0aGUgbW9kZVxuICAgIGJ1dHRvbi5jbGFzc0xpc3QudG9nZ2xlKFwiYXV0b1N1Ym1pdFwiKTtcbiAgICBpZiAoYnV0dG9uLmdldEF0dHJpYnV0ZShcImRhdGEtYXV0b3N1Ym1pdFwiKSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJkYXRhLWF1dG9zdWJtaXRcIiwgXCJmYWxzZVwiKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiYXV0b3N1Ym1pdCBkaXNhYmxlZFwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZShcImRhdGEtYXV0b3N1Ym1pdFwiLCBcInRydWVcIik7XG4gICAgICBjb25zb2xlLmxvZyhcImF1dG9zdWJtaXQgZW5hYmxlZFwiKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgaGFuZGxlVGFsa1RvdWNoU3RhcnQoYnV0dG9uLCBlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIEV2ZW50QnVzLmVtaXQoXCJhdWRpbzpzdGFydFJlY29yZGluZ1wiKTtcbiAgfVxuXG4gIHN0YXRpYyBoYW5kbGVUYWxrVG91Y2hFbmQoYnV0dG9uKSB7XG4gICAgRXZlbnRCdXMuZW1pdChcImF1ZGlvOnN0b3BSZWNvcmRpbmdcIik7XG4gIH1cblxuICBzdGF0aWMgcmVnaXN0ZXJPdGhlckF1ZGlvQnV0dG9uRXZlbnRzKGJ1dHRvbikge1xuICAgIC8vIFwid2FybSB1cFwiIHRoZSBtaWNyb3Bob25lIGJ5IGFjcXVpcmluZyBpdCBiZWZvcmUgdGhlIHVzZXIgcHJlc3NlcyB0aGUgYnV0dG9uXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsICgpID0+IHtcbiAgICAgIEV2ZW50QnVzLmVtaXQoXCJhdWRpbzpzZXR1cFJlY29yZGluZ1wiKTtcbiAgICB9KTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgKCkgPT4ge1xuICAgICAgRXZlbnRCdXMuZW1pdChcImF1ZGlvOnRlYXJEb3duUmVjb3JkaW5nXCIpO1xuICAgIH0pO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiYmVmb3JldW5sb2FkXCIsICgpID0+IHtcbiAgICAgIEV2ZW50QnVzLmVtaXQoXCJhdWRpbzp0ZWFyRG93blJlY29yZGluZ1wiKTtcbiAgICB9KTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoY2FuY2VsXCIsICgpID0+IHtcbiAgICAgIEV2ZW50QnVzLmVtaXQoXCJhdWRpbzp0ZWFyRG93blJlY29yZGluZ1wiKTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyByZWdpc3RlclN0YXRlTWFjaGluZUV2ZW50cyhhY3Rvcikge1xuICAgIEV2ZW50QnVzLm9uKFVTRVJfU1BFQUtJTkcsICgpID0+IHtcbiAgICAgIGFjdG9yLnNlbmQoVVNFUl9TUEVBS0lORyk7XG4gICAgfSk7XG5cbiAgICBbVVNFUl9TVE9QUEVEX1NQRUFLSU5HLCBVU0VSX0ZJTklTSEVEX1NQRUFLSU5HXS5mb3JFYWNoKChldmVudE5hbWUpID0+IHtcbiAgICAgIEV2ZW50QnVzLm9uKGV2ZW50TmFtZSwgKGRldGFpbCkgPT4ge1xuICAgICAgICBpZiAoZGV0YWlsKSB7XG4gICAgICAgICAgYWN0b3Iuc2VuZCh7IHR5cGU6IGV2ZW50TmFtZSwgLi4uZGV0YWlsIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUud2FybihgUmVjZWl2ZWQgJHtldmVudE5hbWV9IHdpdGhvdXQgZGV0YWlscy5gKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBFdmVudEJ1cy5vbihUUkFOU0NSSUJJTkcsICgpID0+IHtcbiAgICAgIGFjdG9yLnNlbmQoVFJBTlNDUklCSU5HKTtcbiAgICB9KTtcblxuICAgIFtQSV9TUEVBS0lORywgUElfU1RPUFBFRF9TUEVBS0lORywgUElfRklOSVNIRURfU1BFQUtJTkddLmZvckVhY2goXG4gICAgICAoZXZlbnROYW1lKSA9PiB7XG4gICAgICAgIEV2ZW50QnVzLm9uKGV2ZW50TmFtZSwgKCkgPT4ge1xuICAgICAgICAgIGFjdG9yLnNlbmQoZXZlbnROYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgKTtcblxuICAgIFtQQVVTRSwgUkVBRFksIFBMQVldLmZvckVhY2goKGV2ZW50TmFtZSkgPT4ge1xuICAgICAgRXZlbnRCdXMub24oZXZlbnROYW1lLCAoKSA9PiB7XG4gICAgICAgIGFjdG9yLnNlbmQoZXZlbnROYW1lKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyogZXZlbnRzIHRvIGRpcmVjdCB0aGUgYXVkaW8gbW9kdWxlIHRvIHN0YXJ0L3N0b3AgcmVjb3JkaW5nICovXG5cbiAgc3RhdGljIHJlZ2lzdGVySG90a2V5KCkge1xuICAgIGxldCBjdHJsRG93biA9IGZhbHNlO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQuY3RybEtleSAmJiBldmVudC5jb2RlID09PSBcIlNwYWNlXCIgJiYgIWN0cmxEb3duKSB7XG4gICAgICAgIGN0cmxEb3duID0gdHJ1ZTtcbiAgICAgICAgRXZlbnRCdXMuZW1pdChcImF1ZGlvOnN0YXJ0UmVjb3JkaW5nXCIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIChldmVudCkgPT4ge1xuICAgICAgaWYgKGN0cmxEb3duICYmIGV2ZW50LmNvZGUgPT09IFwiU3BhY2VcIikge1xuICAgICAgICBjdHJsRG93biA9IGZhbHNlO1xuICAgICAgICBFdmVudEJ1cy5lbWl0KFwiYXVkaW86c3RvcFJlY29yZGluZ1wiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgaW50ZXJwcmV0IH0gZnJvbSBcInhzdGF0ZVwiO1xuaW1wb3J0IHsgbWFjaGluZSB9IGZyb20gXCIuL3NheXBpU3RhdGVNYWNoaW5lXCI7XG5cbi8qKlxuICogQSBzaW5nbGV0b24gc2VydmljZSB0aGF0IG1hbmFnZXMgdGhlIHN0YXRlIG1hY2hpbmUuXG4gKi9cbmNsYXNzIFN0YXRlTWFjaGluZVNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmFjdG9yID0gaW50ZXJwcmV0KG1hY2hpbmUpLm9uVHJhbnNpdGlvbigoc3RhdGUpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGBUcmFuc2l0aW9uZWQgdG8gc3RhdGU6ICR7c3RhdGUudmFsdWV9YCk7XG4gICAgfSk7XG4gICAgdGhpcy5hY3Rvci5zdGFydCgpO1xuICB9XG59XG5cbi8vIFNpbmdsZXRvblxuZXhwb3J0IGRlZmF1bHQgbmV3IFN0YXRlTWFjaGluZVNlcnZpY2UoKTtcbiIsImltcG9ydCBTdGF0ZU1hY2hpbmVTZXJ2aWNlIGZyb20gXCIuL1N0YXRlTWFjaGluZVNlcnZpY2UuanNcIjtcbmltcG9ydCB7IGlzTW9iaWxlVmlldyB9IGZyb20gXCIuL1VzZXJBZ2VudE1vZHVsZS5qc1wiO1xuaW1wb3J0IEV2ZW50QnVzIGZyb20gXCIuL0V2ZW50QnVzLmpzXCI7XG5pbXBvcnQgRXZlbnRNb2R1bGUgZnJvbSBcIi4vRXZlbnRNb2R1bGUuanNcIjtcblxuY29uc3QgY29uZmlnID0ge1xuICBhcHBTZXJ2ZXJVcmw6IHByb2Nlc3MuZW52LkFQUF9TRVJWRVJfVVJMLFxuICBhcGlTZXJ2ZXJVcmw6IHByb2Nlc3MuZW52LkFQSV9TRVJWRVJfVVJMLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHVwbG9hZEF1ZGlvKGF1ZGlvQmxvYikge1xuICAvLyBDcmVhdGUgYSBGb3JtRGF0YSBvYmplY3RcbiAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gIHZhciBhdWRpb0ZpbGVuYW1lID0gXCJhdWRpby53ZWJtXCI7XG4gIGlmIChhdWRpb0Jsb2IudHlwZSA9PT0gXCJhdWRpby9tcDRcIikge1xuICAgIGF1ZGlvRmlsZW5hbWUgPSBcImF1ZGlvLm1wNFwiO1xuICB9XG4gIC8vIEFkZCB0aGUgYXVkaW8gYmxvYiB0byB0aGUgRm9ybURhdGEgb2JqZWN0XG4gIGZvcm1EYXRhLmFwcGVuZChcImF1ZGlvXCIsIGF1ZGlvQmxvYiwgYXVkaW9GaWxlbmFtZSk7XG4gIC8vIEdldCB0aGUgdXNlcidzIHByZWZlcnJlZCBsYW5ndWFnZVxuICB2YXIgbGFuZ3VhZ2UgPSBuYXZpZ2F0b3IubGFuZ3VhZ2U7XG4gIC8vIFBvc3QgdGhlIGF1ZGlvIHRvIHRoZSBzZXJ2ZXIgZm9yIHRyYW5zY3JpcHRpb25cbiAgZmV0Y2goY29uZmlnLmFwaVNlcnZlclVybCArIFwiL3RyYW5zY3JpYmU/bGFuZ3VhZ2U9XCIgKyBsYW5ndWFnZSwge1xuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgYm9keTogZm9ybURhdGEsXG4gIH0pXG4gICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIHRocm93IEVycm9yKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICB9KVxuICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZUpzb24pIHtcbiAgICAgIGlmIChyZXNwb25zZUpzb24udGV4dC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgU3RhdGVNYWNoaW5lU2VydmljZS5hY3Rvci5zZW5kKFwic2F5cGk6dHJhbnNjcmliZWRFbXB0eVwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFN0YXRlTWFjaGluZVNlcnZpY2UuYWN0b3Iuc2VuZChcInNheXBpOnRyYW5zY3JpYmVkXCIsIHtcbiAgICAgICAgICB0ZXh0OiByZXNwb25zZUpzb24udGV4dCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiTG9va3MgbGlrZSB0aGVyZSB3YXMgYSBwcm9ibGVtOiBcIiwgZXJyb3IpO1xuICAgICAgU3RhdGVNYWNoaW5lU2VydmljZS5hY3Rvci5zZW5kKFwic2F5cGk6dHJhbnNjcmliZUZhaWxlZFwiKTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZVRyYW5zY3JpcHRpb25SZXNwb25zZSh0cmFuc2NyaXB0KSB7XG4gIGNvbnNvbGUubG9nKFwiVHJhbnNjcmlwdDogXCIgKyB0cmFuc2NyaXB0KTtcbiAgY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNheXBpLXByb21wdFwiKTtcbiAgaWYgKGlzTW9iaWxlVmlldygpKSB7XG4gICAgLy8gaWYgdHJhbnNjcmlwdCBpcyA+IDEwMDAgY2hhcmFjdGVycywgdHJ1bmNhdGUgaXQgdG8gOTk5IGNoYXJhY3RlcnMgcGx1cyBhbiBlbGxpcHNpc1xuICAgIGlmICh0cmFuc2NyaXB0Lmxlbmd0aCA+IDEwMDApIHtcbiAgICAgIHRyYW5zY3JpcHQgPSB0cmFuc2NyaXB0LnN1YnN0cmluZygwLCA5OTkpICsgXCLigKZcIjtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgXCJUcmFuc2NyaXB0IHdhcyB0b28gbG9uZyBmb3IgUGkuIFRydW5jYXRlZCB0byA5OTkgY2hhcmFjdGVycywgbG9zaW5nIHRoZSBmb2xsb3dpbmcgdGV4dDogLi4uIFwiICtcbiAgICAgICAgICB0cmFuc2NyaXB0LnN1YnN0cmluZyg5OTkpXG4gICAgICApO1xuICAgIH1cbiAgICBFdmVudE1vZHVsZS5zZXROYXRpdmVWYWx1ZSh0ZXh0YXJlYSwgdHJhbnNjcmlwdCk7XG4gICAgRXZlbnRCdXMuZW1pdChcInNheXBpOmF1dG9TdWJtaXRcIik7XG4gIH0gZWxzZSB7XG4gICAgRXZlbnRNb2R1bGUuc2ltdWxhdGVUeXBpbmcodGV4dGFyZWEsIHRyYW5zY3JpcHQgKyBcIiBcIik7XG4gIH1cbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBpc1NhZmFyaSgpIHtcbiAgcmV0dXJuIC9eKCg/IWNocm9tZXxhbmRyb2lkKS4pKnNhZmFyaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNNb2JpbGVEZXZpY2UoKSB7XG4gIHJldHVybiAoXG4gICAgL0FuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fElFTW9iaWxlfE9wZXJhIE1pbmkvaS50ZXN0KFxuICAgICAgbmF2aWdhdG9yLnVzZXJBZ2VudFxuICAgICkgfHwgd2luZG93Lm1hdGNoTWVkaWEoXCIobWF4LXdpZHRoOiA3NjhweClcIikubWF0Y2hlc1xuICApO1xufVxuXG4vLyBVc2UgbG9jYWxTdG9yYWdlIHRvIHBlcnNpc3QgdXNlciBwcmVmZXJlbmNlXG5leHBvcnQgZnVuY3Rpb24gaXNNb2JpbGVWaWV3KCkge1xuICBjb25zdCB1c2VyVmlld1ByZWZlcmVuY2UgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInVzZXJWaWV3UHJlZmVyZW5jZVwiKTtcblxuICBpZiAodXNlclZpZXdQcmVmZXJlbmNlKSB7XG4gICAgcmV0dXJuIHVzZXJWaWV3UHJlZmVyZW5jZSA9PT0gXCJtb2JpbGVcIjtcbiAgfVxuXG4gIHJldHVybiBpc01vYmlsZURldmljZSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXhpdE1vYmlsZU1vZGUoKSB7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidXNlclZpZXdQcmVmZXJlbmNlXCIsIFwiZGVza3RvcFwiKTsgLy8gU2F2ZSBwcmVmZXJlbmNlXG5cbiAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwibW9iaWxlLXZpZXdcIik7XG4gIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImRlc2t0b3Atdmlld1wiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVudGVyTW9iaWxlTW9kZSgpIHtcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ1c2VyVmlld1ByZWZlcmVuY2VcIiwgXCJtb2JpbGVcIik7IC8vIFNhdmUgcHJlZmVyZW5jZVxuXG4gIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImRlc2t0b3Atdmlld1wiKTtcbiAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwibW9iaWxlLXZpZXdcIik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRVc2VyQWdlbnRGbGFncygpIHtcbiAgY29uc3QgaXNGaXJlZm94QW5kcm9pZCA9XG4gICAgL0ZpcmVmb3gvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgJiYgL0FuZHJvaWQvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cbiAgaWYgKGlzRmlyZWZveEFuZHJvaWQpIHtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJmaXJlZm94LWFuZHJvaWRcIik7XG4gIH1cblxuICBhZGREZXZpY2VGbGFncyhlbGVtZW50KTtcbiAgYWRkVmlld0ZsYWdzKGVsZW1lbnQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkRGV2aWNlRmxhZ3MoZWxlbWVudCkge1xuICBpZiAoaXNNb2JpbGVEZXZpY2UoKSkge1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcIm1vYmlsZS1kZXZpY2VcIik7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFZpZXdGbGFncyhlbGVtZW50KSB7XG4gIGlmIChpc01vYmlsZVZpZXcoKSkge1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcIm1vYmlsZS12aWV3XCIpO1xuICB9IGVsc2Uge1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcIm1vYmlsZS12aWV3XCIpO1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImRlc2t0b3Atdmlld1wiKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgYnV0dG9uTW9kdWxlIH0gZnJvbSBcIi4vQnV0dG9uTW9kdWxlXCI7XG5pbXBvcnQgeyBjcmVhdGVNYWNoaW5lIH0gZnJvbSBcInhzdGF0ZVwiO1xuaW1wb3J0IEFuaW1hdGlvbk1vZHVsZSBmcm9tIFwiLi9BbmltYXRpb25Nb2R1bGVcIjtcbmltcG9ydCB7IGlzU2FmYXJpLCBpc01vYmlsZVZpZXcgfSBmcm9tIFwiLi9Vc2VyQWdlbnRNb2R1bGVcIjtcbmltcG9ydCB7XG4gIHVwbG9hZEF1ZGlvLFxuICBoYW5kbGVUcmFuc2NyaXB0aW9uUmVzcG9uc2UsXG59IGZyb20gXCIuL1RyYW5zY3JpcHRpb25Nb2R1bGVcIjtcbmltcG9ydCBFdmVudEJ1cyBmcm9tIFwiLi9FdmVudEJ1c1wiO1xuXG5leHBvcnQgY29uc3QgbWFjaGluZSA9IGNyZWF0ZU1hY2hpbmUoXG4gIHtcbiAgICAvKiogQHhzdGF0ZS1sYXlvdXQgTjRJZ3BnSmc1bURPSUM1U3dJWUU4QUtCTEFkRmlBTm1BTVNwb0FPV0NBcnJHQUU0REs1WUtBMWxnSFpRRGFBREFGMUVvY2dIdFlXQUM1WlJuWVNBQWVpQU13QjJQam1VQk9QZ0RZQWpMcTM3OXkzUUJvUWFSUHI1YXRPWGFxMjZBTEtvQk15LVFBNVRBWDM5TE1tdzhRaEl5U2dSeUZGb3dmaUVrRURFSmFWbDVKUVExRFcwOVEyTlRDeXRFVlNNY1VvOHRIM2NmVldWWE0wRGc5RkQ4SWxKMEtNcG1WZzV1QlBrVXFSazVKTXpzelIwREl4TXpTMnNFVng4UEhIZGRBRlpTcldWTjNWMCtkYWFRRU53NHBoWjJMaWdPaWlvemdERXVMRmdBQzBnZXktN0JRZkZoOUxIRUpVdEs0Y09zK0tvNnBzK0hwMXNwNW9oWWJwUVI0TnFWNmo0dE9zUEVjVGpnemg4K3RkSW5jNkV4SktKeUN3SUFTcmdNa2tNMHFOUUprUEh3TVRobG53ek1vN0JqMWo0NGNVRUI1WEJvdEtWMXZ5d1hzOXI0Y1MxVHFTYWR3YmxGSlBRVUp4WUFCamVoWUFCR3RPKzlOK2pJeWdQc0lMQkVKMjZoaGdvV3JnMk9ENEtLeFZTNUVNbDhzd3VCaWNRZ3FxbzVBSTZEcElsTkkzTkNGc09rMERTOXVnRnJPODhJUUVKQjZtOHJvOHFsY0hpeHJoOW9YOWRFRHhJUTlGWUVEUTRlU2tmK3pNUWV6RlNZcSszMkFwOGFmMnlod0hqZDYxMGxWcUEtMHhiOVdHVlJNNndhbjVNcDd3dWhMckRLakFKaithUnJpMEE2ZEJaMjZ4Y2FmRlBod3U1Y1RoOFNaOG0zSFFXT0NwdzNXWFZ5RE5DVnI2K2lRanFYWFRlRk5rSEU1YmxlVXhBVTB4M005YzFSU29NeFJaUUoyZktjdnhuVzVvaXdSNU9HZU41cVZRMWNHeVpSUWJDM1VGdkdVYnhnUzVUWXREVE14OUhLUWNJWFVKTWxrT0I5Y1hWVFVkVDFRMFZRckxpdFYxQTFJQUl2OUcySXJKZVJ3ZlFoMHFMbGxBSFRFMHo4VUZvV2hkUmZBRmZSY3lRd1NlSU5OOEJJMUlUZUxBZTRVQ3dJZ0lERXY0aU1kVjF5Z2xUWWZGdmRaWENQU3h4bXFNODFDZ3lvR2oySWM5Sk1neStMUXRWUXVFLVZJQUFVUUFXM0lTUmEyTlg4N09qUGcwejRKQ0NGRUZBSUNNMmNNT25XeXpRM2ZSU0ozUGRoMWhTVmp5Rlp4VkVjWnczQ0hjRjlCMEh3a0lZZWhSSG9XQmlBVVdCSkJRU1F3QndGQUFETXh2b0FBS1ZsMUlBU2h1VUllcjYyQlN2LVNUM0ljWlJsajhBc2UxY21TV3VXYnhjeDVkam1sOUhBMXY2d2JodEc4YXBwbStiMUw0WmJjVHVqYjlCLWV0eEtJeklkczBmYWRQV0h0UlJPbHd6cDB1b0RrQ0I5T0ZFQ0E0SGtFNGZnQjZNQUZvbGpUTEhhalU5U3RLTWNVUEh2YTdXbkNESDBvM2ZNMHpCelIxbGt1U0J6OERxaXc0cDk4VlE2bXlvQWd0SE90ZFJsbjVYSlZFZzB4K3dsZk1CMzVBNUVNNW03UzBnWG10cUJxcDR6OHNtYWlIYnNHck1LR2t5OFdITHFRbDllaXVWV0pNeVF4cW5LTUUyVThWRWQwZ3Axa1ZnMHhXVDhFTHVPaXkyVFV4amQ2Z0xHU1JTcUFLekEySW9ISldDRU5oY3R5UEswSEs4b0s3Z3JjQm13QzE4cW9sbUJETjZqVFBOMW5QU28zRFdYd1BLdXg4YnUralBvenBocTdmMEZxYlNQRHdCUVZpbmNHK25COU9pOHpMT3MrdU54MEU5U2tObUdMdmh4WFZ2b1hyK3B3ZUtzRzFXTDU3NmtlQUxIb1VURTJacVhGayt3M0ZNQlhBaUFBICovXG4gICAgaWQ6IFwic2F5UGlcIixcbiAgICBpbml0aWFsOiBcImlkbGVcIixcbiAgICBzdGF0ZXM6IHtcbiAgICAgIGlkbGU6IHtcbiAgICAgICAgZGVzY3JpcHRpb246IFwiSW5pdGlhbCBzdGF0ZS5cXG5HZW50bGUgcHVsc2luZyBhbmltYXRpb24uXCIsXG4gICAgICAgIGVudHJ5OiBbXCJzdG9wQWxsQW5pbWF0aW9uc1wiLCBcImFjcXVpcmVNaWNyb3Bob25lXCJdLFxuICAgICAgICBvbjoge1xuICAgICAgICAgIFwic2F5cGk6dXNlclNwZWFraW5nXCI6IHtcbiAgICAgICAgICAgIHRhcmdldDogXCJ1c2VyU3BlYWtpbmdcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2F5cGk6cGF1c2VcIjoge1xuICAgICAgICAgICAgdGFyZ2V0OiBcInBhdXNlZFwiLFxuICAgICAgICAgICAgY29uZDogXCJpc1NhZmFyaU1vYmlsZVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzYXlwaTpwaVNwZWFraW5nXCI6IHtcbiAgICAgICAgICAgIHRhcmdldDogXCJwaVNwZWFraW5nXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG5cbiAgICAgIHVzZXJTcGVha2luZzoge1xuICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICBcIlVzZXIgaXMgc3BlYWtpbmcgYW5kIGJlaW5nIHJlY29yZGVkIGJ5IHRoZSBtaWNyb3Bob25lLlxcbldhdmVmb3JtIGFuaW1hdGlvbi5cIixcblxuICAgICAgICBlbnRyeTogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6IFwic3RhcnRBbmltYXRpb25cIixcbiAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICBhbmltYXRpb246IFwidXNlclNwZWFraW5nXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJhY3RpdmF0ZVRhbGtCdXR0b25cIixcbiAgICAgICAgXSxcblxuICAgICAgICBleGl0OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogXCJzdG9wQW5pbWF0aW9uXCIsXG4gICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgYW5pbWF0aW9uOiBcInVzZXJTcGVha2luZ1wiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZGVhY3RpdmF0ZVRhbGtCdXR0b25cIixcbiAgICAgICAgXSxcblxuICAgICAgICBvbjoge1xuICAgICAgICAgIFwic2F5cGk6dXNlckZpbmlzaGVkU3BlYWtpbmdcIjoge1xuICAgICAgICAgICAgdGFyZ2V0OiBcInRyYW5zY3JpYmluZ1wiLFxuICAgICAgICAgICAgY29uZDogXCJsb25nRW5vdWdoRm9yVXBsb2FkXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNheXBpOnVzZXJTdG9wcGVkU3BlYWtpbmdcIjoge1xuICAgICAgICAgICAgdGFyZ2V0OiBcImlkbGVcIixcbiAgICAgICAgICAgIGNvbmQ6IFwidG9vU2hvcnRGb3JVcGxvYWRcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2F5cGk6dHJhbnNjcmliaW5nXCI6IHtcbiAgICAgICAgICAgIHRhcmdldDogXCJ0cmFuc2NyaWJpbmdcIixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcblxuICAgICAgcGF1c2VkOiB7XG4gICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgIFwiQmxvY2tpbmcgYWN0aW9uIG9uIFNhZmFyaS5cXG5Vc2VyIG11c3QgcHJlc3MgcGxheSB0byBoZWFyIFBpJ3MgcmVzcG9uc2UuXFxuQm91bmNlIGFuaW1hdGlvbi5cIixcbiAgICAgICAgZW50cnk6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiBcInN0YXJ0QW5pbWF0aW9uXCIsXG4gICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgYW5pbWF0aW9uOiBcInBhdXNlZFwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBleGl0OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogXCJzdG9wQW5pbWF0aW9uXCIsXG4gICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgYW5pbWF0aW9uOiBcInBhdXNlZFwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBvbjoge1xuICAgICAgICAgIFwic2F5cGk6cGxheVwiOiB7XG4gICAgICAgICAgICB0YXJnZXQ6IFwibG9hZGluZ1wiLFxuICAgICAgICAgICAgYWN0aW9uczogXCJoaWRlUGxheUJ1dHRvblwiLFxuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBcInNheXBpOnJlYWR5XCI6IHtcbiAgICAgICAgICAgIHRhcmdldDogXCJwYXVzZWRcIixcbiAgICAgICAgICAgIGludGVybmFsOiB0cnVlLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IGBFbm91Z2ggYXVkaW8gaGFzIGJlZW4gYnVmZmVyZWQgdG8gc3RhcnQgcGxheWJhY2suYCxcbiAgICAgICAgICAgIGFjdGlvbnM6IFwic2hvd1BsYXlCdXR0b25cIixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcblxuICAgICAgcGlTcGVha2luZzoge1xuICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICBcIlBpJ3Mgc3ludGhlc2lzZWQgc3BlZWNoIGF1ZGlvIGlzIHBsYXlpbmcuXFxuUGxheWZ1bCBhbmltYXRpb24uXCIsXG4gICAgICAgIGVudHJ5OiB7XG4gICAgICAgICAgdHlwZTogXCJzdGFydEFuaW1hdGlvblwiLFxuICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgYW5pbWF0aW9uOiBcInBpU3BlYWtpbmdcIixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBleGl0OiB7XG4gICAgICAgICAgdHlwZTogXCJzdG9wQW5pbWF0aW9uXCIsXG4gICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICBhbmltYXRpb246IFwicGlTcGVha2luZ1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgXCJzYXlwaTpwaVN0b3BwZWRTcGVha2luZ1wiOiB7XG4gICAgICAgICAgICB0YXJnZXQ6IFwiaWRsZVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzYXlwaTp1c2VyU3BlYWtpbmdcIjoge1xuICAgICAgICAgICAgdGFyZ2V0OiBcInVzZXJTcGVha2luZ1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzYXlwaTpwaUZpbmlzaGVkU3BlYWtpbmdcIjoge1xuICAgICAgICAgICAgdGFyZ2V0OiBcImlkbGVcIixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcblxuICAgICAgdHJhbnNjcmliaW5nOiB7XG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlRyYW5zY3JpYmluZyBhdWRpbyB0byB0ZXh0LlxcbkNhcmQgZmxpcCBhbmltYXRpb24uXCIsXG4gICAgICAgIGVudHJ5OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogXCJzdGFydEFuaW1hdGlvblwiLFxuICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgIGFuaW1hdGlvbjogXCJ0cmFuc2NyaWJpbmdcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiBcInRyYW5zY3JpYmVBdWRpb1wiLFxuICAgICAgICAgICAgcGFyYW1zOiB7fSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBleGl0OiB7XG4gICAgICAgICAgdHlwZTogXCJzdG9wQW5pbWF0aW9uXCIsXG4gICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICBhbmltYXRpb246IFwidHJhbnNjcmliaW5nXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgb246IHtcbiAgICAgICAgICBcInNheXBpOnRyYW5zY3JpYmVkXCI6IHtcbiAgICAgICAgICAgIHRhcmdldDogXCJpZGxlXCIsXG4gICAgICAgICAgICBhY3Rpb25zOiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiaGFuZGxlVHJhbnNjcmlwdGlvblJlc3BvbnNlXCIsXG4gICAgICAgICAgICAgIHBhcmFtczoge30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiU3VjY2Vzc2Z1bGx5IHRyYW5zY3JpYmVkIHVzZXIgYXVkaW8gdG8gdGV4dC5cIixcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgXCJzYXlwaTp0cmFuc2NyaWJlRmFpbGVkXCI6IHtcbiAgICAgICAgICAgIHRhcmdldDogXCIjc2F5UGkuZXJyb3JzLnRyYW5zY3JpYmVGYWlsZWRcIixcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlJlY2VpdmVkIGFuIGVycm9yIHJlc3BvbnNlIGZyb20gdGhlIC90cmFuc2NyaWJlIEFQSVwiLFxuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBcInNheXBpOnRyYW5zY3JpYmVkRW1wdHlcIjoge1xuICAgICAgICAgICAgdGFyZ2V0OiBcIiNzYXlQaS5lcnJvcnMubWljRXJyb3JcIixcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgICAgICBcIlJlY2VpdmVkIGFuIGVtcHR5IHJlc3BvbnNlIGZyb20gdGhlIC90cmFuc2NyaWJlIEFQSSAobm8gc3BlZWNoIGRldGVjdGVkKVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuXG4gICAgICBsb2FkaW5nOiB7XG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlBpJ3MgYXVkaW8gaXMgbG9hZGluZy5cIixcbiAgICAgICAgZW50cnk6IHtcbiAgICAgICAgICB0eXBlOiBcInN0YXJ0QW5pbWF0aW9uXCIsXG4gICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICBhbmltYXRpb246IFwibG9hZGluZ1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGV4aXQ6IHtcbiAgICAgICAgICB0eXBlOiBcInN0b3BBbmltYXRpb25cIixcbiAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogXCJsb2FkaW5nXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgb246IHtcbiAgICAgICAgICBcInNheXBpOnBpU3BlYWtpbmdcIjoge1xuICAgICAgICAgICAgdGFyZ2V0OiBcInBpU3BlYWtpbmdcIixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcblxuICAgICAgZXJyb3JzOiB7XG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIkVycm9yIHBhcmVudCBzdGF0ZS5cIixcblxuICAgICAgICBhZnRlcjoge1xuICAgICAgICAgIDEwMDAwOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRhcmdldDogXCIjc2F5UGkuaWRsZVwiLFxuICAgICAgICAgICAgICBhY3Rpb25zOiBbXSxcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiUmVzZXQgdG8gdGhlIGlkbGUgc3RhdGUgYW5kIGNsZWFyIGVycm9ycy5cIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGludGVybmFsOiBmYWxzZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0aWFsOiBcInRyYW5zY3JpYmVGYWlsZWRcIixcblxuICAgICAgICBzdGF0ZXM6IHtcbiAgICAgICAgICB0cmFuc2NyaWJlRmFpbGVkOiB7XG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgL3RyYW5zY3JpYmUgQVBJIHJlc3BvbmRlZCB3aXRoIGFuIGVycm9yLlwiLFxuICAgICAgICAgICAgdHlwZTogXCJmaW5hbFwiLFxuICAgICAgICAgICAgZW50cnk6IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJzdGFydEFuaW1hdGlvblwiLFxuICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IFwiZXJyb3JcIixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGV4aXQ6IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJzdG9wQW5pbWF0aW9uXCIsXG4gICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogXCJlcnJvclwiLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgbWljRXJyb3I6IHtcbiAgICAgICAgICAgIHR5cGU6IFwiZmluYWxcIixcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBgTm8gYXVkaW8gaW5wdXQgZGV0ZWN0ZWRgLFxuICAgICAgICAgICAgZW50cnk6IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJzaG93Tm90aWZpY2F0aW9uXCIsXG4gICAgICAgICAgICAgIHBhcmFtczogeyBpY29uOiBcIm11dGVkLW1pY3JvcGhvbmVcIiB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGV4aXQ6IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJkaXNtaXNzTm90aWZpY2F0aW9uXCIsXG4gICAgICAgICAgICAgIHBhcmFtczoge30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgcHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHM6IHRydWUsXG4gICAgcHJlc2VydmVBY3Rpb25PcmRlcjogdHJ1ZSxcbiAgfSxcbiAge1xuICAgIGFjdGlvbnM6IHtcbiAgICAgIHN0b3BBbGxBbmltYXRpb25zOiAoY29udGV4dCwgZXZlbnQpID0+IHtcbiAgICAgICAgQW5pbWF0aW9uTW9kdWxlLnN0b3BBbGxBbmltYXRpb25zKCk7XG4gICAgICB9LFxuXG4gICAgICBzdGFydEFuaW1hdGlvbjogKGNvbnRleHQsIGV2ZW50LCB7IGFjdGlvbiB9KSA9PiB7XG4gICAgICAgIEFuaW1hdGlvbk1vZHVsZS5zdGFydEFuaW1hdGlvbihhY3Rpb24ucGFyYW1zLmFuaW1hdGlvbik7XG4gICAgICB9LFxuXG4gICAgICBzdG9wQW5pbWF0aW9uOiAoY29udGV4dCwgZXZlbnQsIHsgYWN0aW9uIH0pID0+IHtcbiAgICAgICAgQW5pbWF0aW9uTW9kdWxlLnN0b3BBbmltYXRpb24oYWN0aW9uLnBhcmFtcy5hbmltYXRpb24pO1xuICAgICAgfSxcblxuICAgICAgdHJhbnNjcmliZUF1ZGlvOiAoY29udGV4dCwgZXZlbnQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJ0cmFuc2NyaWJlQXVkaW9cIiwgZXZlbnQpO1xuICAgICAgICBjb25zdCBhdWRpb0Jsb2IgPSBldmVudC5ibG9iO1xuICAgICAgICB1cGxvYWRBdWRpbyhhdWRpb0Jsb2IpO1xuICAgICAgfSxcblxuICAgICAgaGFuZGxlVHJhbnNjcmlwdGlvblJlc3BvbnNlOiAoY29udGV4dCwgZXZlbnQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJoYW5kbGVUcmFuc2NyaXB0aW9uUmVzcG9uc2VcIiwgZXZlbnQpO1xuICAgICAgICBjb25zdCB0cmFuc2NyaXB0aW9uID0gZXZlbnQudGV4dDtcbiAgICAgICAgaGFuZGxlVHJhbnNjcmlwdGlvblJlc3BvbnNlKHRyYW5zY3JpcHRpb24pO1xuICAgICAgfSxcblxuICAgICAgc2hvd1BsYXlCdXR0b246IChjb250ZXh0LCBldmVudCkgPT4ge1xuICAgICAgICBidXR0b25Nb2R1bGUuc2hvd1BsYXlCdXR0b24oKTtcbiAgICAgIH0sXG5cbiAgICAgIGhpZGVQbGF5QnV0dG9uOiAoY29udGV4dCwgZXZlbnQpID0+IHtcbiAgICAgICAgYnV0dG9uTW9kdWxlLmhpZGVQbGF5QnV0dG9uKCk7XG4gICAgICB9LFxuXG4gICAgICBhY3RpdmF0ZVRhbGtCdXR0b246IChjb250ZXh0LCBldmVudCkgPT4ge1xuICAgICAgICBjb25zdCB0YWxrQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS10YWxrQnV0dG9uXCIpO1xuICAgICAgICB0YWxrQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7IC8vIEFkZCB0aGUgYWN0aXZlIGNsYXNzIChmb3IgRmlyZWZveCBvbiBBbmRyb2lkKVxuICAgICAgfSxcblxuICAgICAgZGVhY3RpdmF0ZVRhbGtCdXR0b246IChjb250ZXh0LCBldmVudCkgPT4ge1xuICAgICAgICBjb25zdCB0YWxrQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS10YWxrQnV0dG9uXCIpO1xuICAgICAgICB0YWxrQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7IC8vIFJlbW92ZSB0aGUgYWN0aXZlIGNsYXNzIChmb3IgRmlyZWZveCBvbiBBbmRyb2lkKVxuICAgICAgfSxcblxuICAgICAgYWNxdWlyZU1pY3JvcGhvbmU6IChjb250ZXh0LCBldmVudCkgPT4ge1xuICAgICAgICAvLyB3YXJtdXAgdGhlIG1pY3JvcGhvbmUgb24gaWRsZSBpbiBtb2JpbGUgdmlldyxcbiAgICAgICAgLy8gc2luY2UgdGhlcmUncyBubyBtb3VzZW92ZXIgZXZlbnQgdG8gdHJpZ2dlciBpdFxuICAgICAgICBpZiAoaXNNb2JpbGVWaWV3KCkpIHtcbiAgICAgICAgICBFdmVudEJ1cy5lbWl0KFwiYXVkaW86c2V0dXBSZWNvcmRpbmdcIik7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIHNob3dOb3RpZmljYXRpb246IChjb250ZXh0LCBldmVudCwgeyBhY3Rpb24gfSkgPT4ge1xuICAgICAgICBjb25zdCBpY29uID0gYWN0aW9uLnBhcmFtcy5pY29uO1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gYWN0aW9uLnBhcmFtcy5tZXNzYWdlO1xuICAgICAgICBidXR0b25Nb2R1bGUuc2hvd05vdGlmaWNhdGlvbih7IGljb24sIG1lc3NhZ2UgfSk7XG4gICAgICB9LFxuXG4gICAgICBkaXNtaXNzTm90aWZpY2F0aW9uOiAoY29udGV4dCwgZXZlbnQpID0+IHtcbiAgICAgICAgYnV0dG9uTW9kdWxlLmRpc21pc3NOb3RpZmljYXRpb24oKTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBzZXJ2aWNlczoge30sXG4gICAgZ3VhcmRzOiB7XG4gICAgICB0b29TaG9ydEZvclVwbG9hZDogKGNvbnRleHQsIGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwidG9vU2hvcnRGb3JVcGxvYWRcIiwgZXZlbnQpO1xuICAgICAgICByZXR1cm4gZXZlbnQuZHVyYXRpb24gPCAxMDAwO1xuICAgICAgfSxcblxuICAgICAgbG9uZ0Vub3VnaEZvclVwbG9hZDogKGNvbnRleHQsIGV2ZW50KSA9PiB7XG4gICAgICAgIHJldHVybiBldmVudC5kdXJhdGlvbiA+PSAxMDAwO1xuICAgICAgfSxcblxuICAgICAgaXNTYWZhcmlNb2JpbGU6IChjb250ZXh0LCBldmVudCkgPT4ge1xuICAgICAgICByZXR1cm4gaXNTYWZhcmkoKSAmJiBpc01vYmlsZVZpZXcoKTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBkZWxheXM6IHt9LFxuICB9XG4pO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYEBrZXlmcmFtZXMgcHVsc2Vfb3V0ZXJtb3N0IHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTIpO1xuICB9XG59XG4ub3V0ZXJtb3N0IHtcbiAgYW5pbWF0aW9uOiBwdWxzZV9vdXRlcm1vc3QgNXMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBwdWxzZV9zZWNvbmQge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44NTYpO1xuICB9XG59XG4uc2Vjb25kIHtcbiAgYW5pbWF0aW9uOiBwdWxzZV9zZWNvbmQgNXMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBwdWxzZV90aGlyZCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjc5Mik7XG4gIH1cbn1cbi50aGlyZCB7XG4gIGFuaW1hdGlvbjogcHVsc2VfdGhpcmQgNXMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBwdWxzZV9mb3VydGgge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43MjgpO1xuICB9XG59XG4uZm91cnRoIHtcbiAgYW5pbWF0aW9uOiBwdWxzZV9mb3VydGggNXMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBwdWxzZV9maWZ0aCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjY2NCk7XG4gIH1cbn1cbi5maWZ0aCB7XG4gIGFuaW1hdGlvbjogcHVsc2VfZmlmdGggNXMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBwdWxzZV9pbm5lcm1vc3Qge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC42KTtcbiAgfVxufVxuLmlubmVybW9zdCB7XG4gIGFuaW1hdGlvbjogcHVsc2VfaW5uZXJtb3N0IDVzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbi8qIGJvdW5jZSBhbmltYXRpb24gdG8gaW5kaWNhdGUgUGkgaXMgcGF1c2VkIGF3YWl0aW5nIHBlcm1pc3Npb24gdG8gc3BlYWsgKi9cbkBrZXlmcmFtZXMgYm91bmNlX291dGVybW9zdCB7XG4gIDAlLFxuICAyMCUsXG4gIDUwJSxcbiAgODAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gIH1cbiAgNDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUlKTtcbiAgfVxuICA2MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMyUpO1xuICB9XG59XG4ub3V0ZXJtb3N0LnBhdXNlZCB7XG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2Vfb3V0ZXJtb3N0O1xuICBhbmltYXRpb24tZHVyYXRpb246IDJzO1xuICBhbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiBpbmZpbml0ZTtcbn1cblxuQGtleWZyYW1lcyBib3VuY2Vfc2Vjb25kIHtcbiAgMCUsXG4gIDIwJSxcbiAgNTAlLFxuICA4MCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcbiAgfVxuICA0MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNS44JSk7XG4gIH1cbiAgNjAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTMuNDglKTtcbiAgfVxufVxuLnNlY29uZC5wYXVzZWQge1xuICBhbmltYXRpb24tbmFtZTogYm91bmNlX3NlY29uZDtcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XG59XG5cbkBrZXlmcmFtZXMgYm91bmNlX3RoaXJkIHtcbiAgMCUsXG4gIDIwJSxcbiAgNTAlLFxuICA4MCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcbiAgfVxuICA0MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNi42JSk7XG4gIH1cbiAgNjAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTMuOTYlKTtcbiAgfVxufVxuLnRoaXJkLnBhdXNlZCB7XG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2VfdGhpcmQ7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xufVxuXG5Aa2V5ZnJhbWVzIGJvdW5jZV9mb3VydGgge1xuICAwJSxcbiAgMjAlLFxuICA1MCUsXG4gIDgwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xuICB9XG4gIDQwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC03LjQlKTtcbiAgfVxuICA2MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNC40NCUpO1xuICB9XG59XG4uZm91cnRoLnBhdXNlZCB7XG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2VfZm91cnRoO1xuICBhbmltYXRpb24tZHVyYXRpb246IDJzO1xuICBhbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiBpbmZpbml0ZTtcbn1cblxuQGtleWZyYW1lcyBib3VuY2VfZmlmdGgge1xuICAwJSxcbiAgMjAlLFxuICA1MCUsXG4gIDgwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xuICB9XG4gIDQwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC04LjIlKTtcbiAgfVxuICA2MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNC45MiUpO1xuICB9XG59XG4uZmlmdGgucGF1c2VkIHtcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV9maWZ0aDtcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XG59XG5cbkBrZXlmcmFtZXMgYm91bmNlX2lubmVybW9zdCB7XG4gIDAlLFxuICAyMCUsXG4gIDUwJSxcbiAgODAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gIH1cbiAgNDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTklKTtcbiAgfVxuICA2MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNS40JSk7XG4gIH1cbn1cbi5pbm5lcm1vc3QucGF1c2VkIHtcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV9pbm5lcm1vc3Q7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xufVxuXG4vKiBwbGF5ZnVsIGFuaW1hdGlvbiB0byBpbmRpY2F0ZSBQaSBpcyBzcGVha2luZyAqL1xuQGtleWZyYW1lcyBzcGVha2luZ19vdXRlcm1vc3Qge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XG4gIH1cbiAgMjUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTk1KTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45KTtcbiAgfVxuICA3NSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44OTUpO1xuICB9XG59XG4ub3V0ZXJtb3N0LnBpU3BlYWtpbmcge1xuICBhbmltYXRpb246IHNwZWFraW5nX291dGVybW9zdCAycyBpbmZpbml0ZTtcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xufVxuXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX3NlY29uZCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcbiAgfVxuICAyNSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45OCkgcm90YXRlKC0xZGVnKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44Nykgcm90YXRlKDBkZWcpO1xuICB9XG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjg2NSkgcm90YXRlKDFkZWcpO1xuICB9XG59XG4uc2Vjb25kLnBpU3BlYWtpbmcge1xuICBhbmltYXRpb246IHNwZWFraW5nX3NlY29uZCAycyBpbmZpbml0ZTtcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xufVxuXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX3RoaXJkIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xuICB9XG4gIDI1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjk2NSkgcm90YXRlKC0yZGVnKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44NCkgcm90YXRlKDBkZWcpO1xuICB9XG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjgzNSkgcm90YXRlKDJkZWcpO1xuICB9XG59XG4udGhpcmQucGlTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfdGhpcmQgMnMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBzcGVha2luZ19mb3VydGgge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XG4gIH1cbiAgMjUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTUpIHJvdGF0ZSgtM2RlZyk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODEpIHJvdGF0ZSgwZGVnKTtcbiAgfVxuICA3NSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44MDUpIHJvdGF0ZSgzZGVnKTtcbiAgfVxufVxuLmZvdXJ0aC5waVNwZWFraW5nIHtcbiAgYW5pbWF0aW9uOiBzcGVha2luZ19mb3VydGggMnMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBzcGVha2luZ19maWZ0aCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcbiAgfVxuICAyNSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45MzUpIHJvdGF0ZSgtNGRlZyk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzgpIHJvdGF0ZSgwZGVnKTtcbiAgfVxuICA3NSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43NzUpIHJvdGF0ZSg0ZGVnKTtcbiAgfVxufVxuLmZpZnRoLnBpU3BlYWtpbmcge1xuICBhbmltYXRpb246IHNwZWFraW5nX2ZpZnRoIDJzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgc3BlYWtpbmdfaW5uZXJtb3N0IHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xuICB9XG4gIDI1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkyKSByb3RhdGUoLTVkZWcpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjc1KSByb3RhdGUoMGRlZyk7XG4gIH1cbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzQ1KSByb3RhdGUoNWRlZyk7XG4gIH1cbn1cbi5pbm5lcm1vc3QucGlTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfaW5uZXJtb3N0IDJzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbi8qIHdhdmUgYW5pbWF0aW9uIHRvIGluZGljYXRlIHVzZXIgaXMgc3BlYWtpbmcgKi9cbkBrZXlmcmFtZXMgdXNlclNwZWFraW5nQW5pbWF0aW9uIHtcbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjA1KSBzY2FsZVgodmFyKC0td2lkdGgtZmFjdG9yKSlcbiAgICAgIHRyYW5zbGF0ZVgoY2FsYygtNTAlICsgdmFyKC0tc3ByZWFkLWFtb3VudCkpKTtcbiAgfVxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgxKSBzY2FsZVgodmFyKC0td2lkdGgtZmFjdG9yKSlcbiAgICAgIHRyYW5zbGF0ZVgoY2FsYygtNTAlICsgdmFyKC0tc3ByZWFkLWFtb3VudCkpKTtcbiAgfVxufVxuLyogdXNlciBzcGVha2luZyBvc2NpbGxhdGlvbiBhbmltYXRpb24gKi9cbkBrZXlmcmFtZXMgd2F2ZWZvcm1fb3V0ZXJtb3N0IHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDEpIHNjYWxlWCgxKTtcbiAgfVxuICAyNSUsXG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC45KSBzY2FsZVgoMC45KTtcbiAgfVxufVxuXG5Aa2V5ZnJhbWVzIHdhdmVmb3JtX3NlY29uZCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjkpIHNjYWxlWCgwLjkpO1xuICB9XG4gIDI1JSxcbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjgpIHNjYWxlWCgwLjgpO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgd2F2ZWZvcm1fdGhpcmQge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC44KSBzY2FsZVgoMC44KTtcbiAgfVxuICAyNSUsXG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC43KSBzY2FsZVgoMC43KTtcbiAgfVxufVxuXG5Aa2V5ZnJhbWVzIHdhdmVmb3JtX2ZvdXJ0aCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjcpIHNjYWxlWCgwLjcpO1xuICB9XG4gIDI1JSxcbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjYpIHNjYWxlWCgwLjYpO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgd2F2ZWZvcm1fZmlmdGgge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC42KSBzY2FsZVgoMC42KTtcbiAgfVxuICAyNSUsXG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC41KSBzY2FsZVgoMC41KTtcbiAgfVxufVxuXG5Aa2V5ZnJhbWVzIHdhdmVmb3JtX2lubmVybW9zdCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjUpIHNjYWxlWCgwLjUpO1xuICB9XG4gIDI1JSxcbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjQpIHNjYWxlWCgwLjQpO1xuICB9XG59XG5cbi5vdXRlcm1vc3QudXNlclNwZWFraW5nIHtcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV9vdXRlcm1vc3QgMC43cyBpbmZpbml0ZSBhbHRlcm5hdGU7XG59XG5cbi5zZWNvbmQudXNlclNwZWFraW5nIHtcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV9zZWNvbmQgMC42NXMgaW5maW5pdGUgYWx0ZXJuYXRlO1xufVxuXG4udGhpcmQudXNlclNwZWFraW5nIHtcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV90aGlyZCAwLjZzIGluZmluaXRlIGFsdGVybmF0ZTtcbn1cblxuLmZvdXJ0aC51c2VyU3BlYWtpbmcge1xuICBhbmltYXRpb246IHdhdmVmb3JtX2ZvdXJ0aCAwLjU1cyBpbmZpbml0ZSBhbHRlcm5hdGU7XG59XG5cbi5maWZ0aC51c2VyU3BlYWtpbmcge1xuICBhbmltYXRpb246IHdhdmVmb3JtX2ZpZnRoIDAuNXMgaW5maW5pdGUgYWx0ZXJuYXRlO1xufVxuXG4uaW5uZXJtb3N0LnVzZXJTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogd2F2ZWZvcm1faW5uZXJtb3N0IDAuNDVzIGluZmluaXRlIGFsdGVybmF0ZTtcbn1cblxuLyogZmxpcGNhcmQgYW5pbWF0aW9uIHRvIGluZGljYXRlIFNheSwgUGkgaXMgdHJhbnNjcmliaW5nIGF1ZGlvIHRvIHRleHQgKi9cbkBrZXlmcmFtZXMgdHJhbnNjcmliaW5nRmxpcCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZVkoMGRlZyk7XG4gICAgZmlsbDogdmFyKC0tb3JpZ2luYWwtY29sb3IpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGVZKDE4MGRlZyk7XG4gICAgZmlsbDogdmFyKC0tdHJhbnNjcmliaW5nLWNvbG9yKTtcbiAgfVxufVxuXG4ub3V0ZXJtb3N0LnRyYW5zY3JpYmluZyB7XG4gIC0tb3JpZ2luYWwtY29sb3I6ICNlNGYyZDE7XG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjYjNlMGZlO1xuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMS41cyBpbmZpbml0ZTtcbn1cblxuLnNlY29uZC50cmFuc2NyaWJpbmcge1xuICAtLW9yaWdpbmFsLWNvbG9yOiAjY2NlOGI1O1xuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogIzg5YzJmZjtcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDEuNnMgaW5maW5pdGU7XG59XG5cbi50aGlyZC50cmFuc2NyaWJpbmcge1xuICAtLW9yaWdpbmFsLWNvbG9yOiAjYjNkYjk1O1xuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogIzVmYTRmZjtcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDEuN3MgaW5maW5pdGU7XG59XG5cbi5mb3VydGgudHJhbnNjcmliaW5nIHtcbiAgLS1vcmlnaW5hbC1jb2xvcjogIzliZDA3ODtcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICMzNTg2ZmY7XG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAxLjhzIGluZmluaXRlO1xufVxuXG4uZmlmdGgudHJhbnNjcmliaW5nIHtcbiAgLS1vcmlnaW5hbC1jb2xvcjogIzgzYzU1YztcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICMwYjY5ZTM7XG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAxLjlzIGluZmluaXRlO1xufVxuXG4uaW5uZXJtb3N0LnRyYW5zY3JpYmluZyB7XG4gIC0tb3JpZ2luYWwtY29sb3I6ICM0MjhhMmY7XG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjMDA1M2JmO1xuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMnMgaW5maW5pdGU7XG59XG5cbi8qIGhlYXJ0YmVhdCBhbmltYXRpb24gdG8gaW5kaWNhdGUgUGkgaXMgcHJlcGFyaW5nIHRvIHNwZWFrICovXG5Aa2V5ZnJhbWVzIGhlYXJ0YmVhdCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICBvcGFjaXR5OiAxO1xuICAgIGZpbGw6IHZhcigtLW9yaWdpbmFsLWNvbG9yKTtcbiAgfVxuICA1MCUge1xuICAgIG9wYWNpdHk6IDAuNTtcbiAgICBmaWxsOiByZ2IoMjQ1IDIzOCAyMjMpOyAvKiBiZy1jcmVhbS01NTAgKi9cbiAgfVxufVxuXG4ub3V0ZXJtb3N0LmxvYWRpbmcge1xuICAtLW9yaWdpbmFsLWNvbG9yOiAjZTRmMmQxO1xuICBhbmltYXRpb246IGhlYXJ0YmVhdCAycyBpbmZpbml0ZTtcbiAgYW5pbWF0aW9uLWRlbGF5OiAwcztcbn1cblxuLnNlY29uZC5sb2FkaW5nIHtcbiAgLS1vcmlnaW5hbC1jb2xvcjogI2NjZThiNTtcbiAgYW5pbWF0aW9uOiBoZWFydGJlYXQgMnMgaW5maW5pdGU7XG4gIGFuaW1hdGlvbi1kZWxheTogMC40cztcbn1cblxuLnRoaXJkLmxvYWRpbmcge1xuICAtLW9yaWdpbmFsLWNvbG9yOiAjYjNkYjk1O1xuICBhbmltYXRpb246IGhlYXJ0YmVhdCAycyBpbmZpbml0ZTtcbiAgYW5pbWF0aW9uLWRlbGF5OiAwLjhzO1xufVxuXG4uZm91cnRoLmxvYWRpbmcge1xuICAtLW9yaWdpbmFsLWNvbG9yOiAjOWJkMDc4O1xuICBhbmltYXRpb246IGhlYXJ0YmVhdCAycyBpbmZpbml0ZTtcbiAgYW5pbWF0aW9uLWRlbGF5OiAxLjJzO1xufVxuXG4uZmlmdGgubG9hZGluZyB7XG4gIC0tb3JpZ2luYWwtY29sb3I6ICM4M2M1NWM7XG4gIGFuaW1hdGlvbjogaGVhcnRiZWF0IDJzIGluZmluaXRlO1xuICBhbmltYXRpb24tZGVsYXk6IDEuNnM7XG59XG5cbi5pbm5lcm1vc3QubG9hZGluZyB7XG4gIC0tb3JpZ2luYWwtY29sb3I6ICM0MjhhMmY7XG4gIGFuaW1hdGlvbjogaGVhcnRiZWF0IDJzIGluZmluaXRlO1xuICBhbmltYXRpb24tZGVsYXk6IDJzO1xufVxuXG4vKiB0b25lZC1kb3duIGRpc3NhcnkgYW5pbWF0aW9uIHRvIGluZGljYXRlIGFuIGVycm9yICovXG4vKiB0b25lZC1kb3duIGVycm9yIGFuaW1hdGlvbiB3aXRoIHJlZHVjZWQgb3BhY2l0eSAqL1xuQGtleWZyYW1lcyBlcnJvckFuaW1hdGlvbiB7XG4gIDAlIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKSB0cmFuc2xhdGUoMCUsIDAlKTtcbiAgfVxuICAyNSUge1xuICAgIHRyYW5zZm9ybTogcm90YXRlKC01ZGVnKSB0cmFuc2xhdGUoLTUlLCA1JSk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSg1ZGVnKSB0cmFuc2xhdGUoNSUsIC01JSk7XG4gIH1cbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgtNWRlZykgdHJhbnNsYXRlKC01JSwgNSUpO1xuICB9XG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpIHRyYW5zbGF0ZSgwJSwgMCUpO1xuICB9XG59XG5cbi5vdXRlcm1vc3QuZXJyb3Ige1xuICBhbmltYXRpb246IGVycm9yQW5pbWF0aW9uIDI1cyAxO1xuICBmaWxsOiAjZmYwMDAwO1xuICBmaWxsLW9wYWNpdHk6IDAuNztcbn1cblxuLnNlY29uZC5lcnJvciB7XG4gIGFuaW1hdGlvbjogZXJyb3JBbmltYXRpb24gMjVzIDE7XG4gIGZpbGw6ICNmZjMzMDA7XG4gIGZpbGwtb3BhY2l0eTogMC43O1xufVxuXG4udGhpcmQuZXJyb3Ige1xuICBhbmltYXRpb246IGVycm9yQW5pbWF0aW9uIDI1cyAxO1xuICBmaWxsOiAjZmY2NjAwO1xuICBmaWxsLW9wYWNpdHk6IDAuNztcbn1cblxuLmZvdXJ0aC5lcnJvciB7XG4gIGFuaW1hdGlvbjogZXJyb3JBbmltYXRpb24gMjVzIDE7XG4gIGZpbGw6ICNmZjk5MDA7XG4gIGZpbGwtb3BhY2l0eTogMC43O1xufVxuXG4uZmlmdGguZXJyb3Ige1xuICBhbmltYXRpb246IGVycm9yQW5pbWF0aW9uIDI1cyAxO1xuICBmaWxsOiAjZmZjYzAwO1xuICBmaWxsLW9wYWNpdHk6IDAuNztcbn1cblxuLmlubmVybW9zdC5lcnJvciB7XG4gIGFuaW1hdGlvbjogZXJyb3JBbmltYXRpb24gMjVzIDE7XG4gIGZpbGw6ICNmZmZmMDA7XG4gIGZpbGwtb3BhY2l0eTogMC43O1xufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGVzL3JlY3RhbmdsZXMuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0U7O0lBRUUsbUJBQW1CO0VBQ3JCO0VBQ0E7SUFDRSxzQkFBc0I7RUFDeEI7QUFDRjtBQUNBO0VBQ0Usc0NBQXNDO0VBQ3RDLHdCQUF3QjtBQUMxQjs7QUFFQTtFQUNFOztJQUVFLG1CQUFtQjtFQUNyQjtFQUNBO0lBQ0UsdUJBQXVCO0VBQ3pCO0FBQ0Y7QUFDQTtFQUNFLG1DQUFtQztFQUNuQyx3QkFBd0I7QUFDMUI7O0FBRUE7RUFDRTs7SUFFRSxtQkFBbUI7RUFDckI7RUFDQTtJQUNFLHVCQUF1QjtFQUN6QjtBQUNGO0FB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QUFDbkI7O0FBRUE7RUFDRSwrQkFBK0I7RUFDL0IsYUFBYTtFQUNiLGlCQUFpQjtBQUNuQjs7QUFFQTtFQUNFLCtCQUErQjtFQUMvQixhQUFhO0VBQ2IsaUJBQWlCO0FBQ25COztBQUVBO0VBQ0UsK0JBQStCO0VBQy9CLGFBQWE7RUFDYixpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSwrQkFBK0I7RUFDL0IsYUFBYTtFQUNiLGlCQUFpQjtBQUNuQlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJAa2V5ZnJhbWVzIHB1bHNlX291dGVybW9zdCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkyKTtcXG4gIH1cXG59XFxuLm91dGVybW9zdCB7XFxuICBhbmltYXRpb246IHB1bHNlX291dGVybW9zdCA1cyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBwdWxzZV9zZWNvbmQge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44NTYpO1xcbiAgfVxcbn1cXG4uc2Vjb25kIHtcXG4gIGFuaW1hdGlvbjogcHVsc2Vfc2Vjb25kIDVzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHB1bHNlX3RoaXJkIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzkyKTtcXG4gIH1cXG59XFxuLnRoaXJkIHtcXG4gIGFuaW1hdGlvbjogcHVsc2VfdGhpcmQgNXMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbkBrZXlmcmFtZXMgcHVsc2VfZm91cnRoIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzI4KTtcXG4gIH1cXG59XFxuLmZvdXJ0aCB7XFxuICBhbmltYXRpb246IHB1bHNlX2ZvdXJ0aCA1cyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBwdWxzZV9maWZ0aCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjY2NCk7XFxuICB9XFxufVxcbi5maWZ0aCB7XFxuICBhbmltYXRpb246IHB1bHNlX2ZpZnRoIDVzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHB1bHNlX2lubmVybW9zdCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjYpO1xcbiAgfVxcbn1cXG4uaW5uZXJtb3N0IHtcXG4gIGFuaW1hdGlvbjogcHVsc2VfaW5uZXJtb3N0IDVzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG4vKiBib3VuY2UgYW5pbWF0aW9uIHRvIGluZGljYXRlIFBpIGlzIHBhdXNlZCBhd2FpdGluZyBwZXJtaXNzaW9uIHRvIHNwZWFrICovXFxuQGtleWZyYW1lcyBib3VuY2Vfb3V0ZXJtb3N0IHtcXG4gIDAlLFxcbiAgMjAlLFxcbiAgNTAlLFxcbiAgODAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcXG4gIH1cXG4gIDQwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNSUpO1xcbiAgfVxcbiAgNjAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0zJSk7XFxuICB9XFxufVxcbi5vdXRlcm1vc3QucGF1c2VkIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2Vfb3V0ZXJtb3N0O1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcXG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIGJvdW5jZV9zZWNvbmQge1xcbiAgMCUsXFxuICAyMCUsXFxuICA1MCUsXFxuICA4MCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xcbiAgfVxcbiAgNDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01LjglKTtcXG4gIH1cXG4gIDYwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMy40OCUpO1xcbiAgfVxcbn1cXG4uc2Vjb25kLnBhdXNlZCB7XFxuICBhbmltYXRpb24tbmFtZTogYm91bmNlX3NlY29uZDtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XFxuICBhbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiBpbmZpbml0ZTtcXG59XFxuXFxuQGtleWZyYW1lcyBib3VuY2VfdGhpcmQge1xcbiAgMCUsXFxuICAyMCUsXFxuICA1MCUsXFxuICA4MCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xcbiAgfVxcbiAgNDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC02LjYlKTtcXG4gIH1cXG4gIDYwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMy45NiUpO1xcbiAgfVxcbn1cXG4udGhpcmQucGF1c2VkIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2VfdGhpcmQ7XFxuICBhbmltYXRpb24tZHVyYXRpb246IDJzO1xcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XFxufVxcblxcbkBrZXlmcmFtZXMgYm91bmNlX2ZvdXJ0aCB7XFxuICAwJSxcXG4gIDIwJSxcXG4gIDUwJSxcXG4gIDgwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XFxuICB9XFxuICA0MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTcuNCUpO1xcbiAgfVxcbiAgNjAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC00LjQ0JSk7XFxuICB9XFxufVxcbi5mb3VydGgucGF1c2VkIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2VfZm91cnRoO1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcXG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIGJvdW5jZV9maWZ0aCB7XFxuICAwJSxcXG4gIDIwJSxcXG4gIDUwJSxcXG4gIDgwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XFxuICB9XFxuICA0MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTguMiUpO1xcbiAgfVxcbiAgNjAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC00LjkyJSk7XFxuICB9XFxufVxcbi5maWZ0aC5wYXVzZWQge1xcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV9maWZ0aDtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XFxuICBhbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiBpbmZpbml0ZTtcXG59XFxuXFxuQGtleWZyYW1lcyBib3VuY2VfaW5uZXJtb3N0IHtcXG4gIDAlLFxcbiAgMjAlLFxcbiAgNTAlLFxcbiAgODAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcXG4gIH1cXG4gIDQwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtOSUpO1xcbiAgfVxcbiAgNjAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01LjQlKTtcXG4gIH1cXG59XFxuLmlubmVybW9zdC5wYXVzZWQge1xcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV9pbm5lcm1vc3Q7XFxuICBhbmltYXRpb24tZHVyYXRpb246IDJzO1xcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XFxufVxcblxcbi8qIHBsYXlmdWwgYW5pbWF0aW9uIHRvIGluZGljYXRlIFBpIGlzIHNwZWFraW5nICovXFxuQGtleWZyYW1lcyBzcGVha2luZ19vdXRlcm1vc3Qge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XFxuICB9XFxuICAyNSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTk1KTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45KTtcXG4gIH1cXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44OTUpO1xcbiAgfVxcbn1cXG4ub3V0ZXJtb3N0LnBpU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiBzcGVha2luZ19vdXRlcm1vc3QgMnMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbkBrZXlmcmFtZXMgc3BlYWtpbmdfc2Vjb25kIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgMjUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjk4KSByb3RhdGUoLTFkZWcpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjg3KSByb3RhdGUoMGRlZyk7XFxuICB9XFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODY1KSByb3RhdGUoMWRlZyk7XFxuICB9XFxufVxcbi5zZWNvbmQucGlTcGVha2luZyB7XFxuICBhbmltYXRpb246IHNwZWFraW5nX3NlY29uZCAycyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBzcGVha2luZ190aGlyZCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDI1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45NjUpIHJvdGF0ZSgtMmRlZyk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODQpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44MzUpIHJvdGF0ZSgyZGVnKTtcXG4gIH1cXG59XFxuLnRoaXJkLnBpU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiBzcGVha2luZ190aGlyZCAycyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBzcGVha2luZ19mb3VydGgge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XFxuICB9XFxuICAyNSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTUpIHJvdGF0ZSgtM2RlZyk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODEpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44MDUpIHJvdGF0ZSgzZGVnKTtcXG4gIH1cXG59XFxuLmZvdXJ0aC5waVNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfZm91cnRoIDJzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX2ZpZnRoIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgMjUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkzNSkgcm90YXRlKC00ZGVnKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43OCkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjc3NSkgcm90YXRlKDRkZWcpO1xcbiAgfVxcbn1cXG4uZmlmdGgucGlTcGVha2luZyB7XFxuICBhbmltYXRpb246IHNwZWFraW5nX2ZpZnRoIDJzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX2lubmVybW9zdCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDI1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45Mikgcm90YXRlKC01ZGVnKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43NSkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjc0NSkgcm90YXRlKDVkZWcpO1xcbiAgfVxcbn1cXG4uaW5uZXJtb3N0LnBpU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiBzcGVha2luZ19pbm5lcm1vc3QgMnMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbi8qIHdhdmUgYW5pbWF0aW9uIHRvIGluZGljYXRlIHVzZXIgaXMgc3BlYWtpbmcgKi9cXG5Aa2V5ZnJhbWVzIHVzZXJTcGVha2luZ0FuaW1hdGlvbiB7XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjA1KSBzY2FsZVgodmFyKC0td2lkdGgtZmFjdG9yKSlcXG4gICAgICB0cmFuc2xhdGVYKGNhbGMoLTUwJSArIHZhcigtLXNwcmVhZC1hbW91bnQpKSk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMSkgc2NhbGVYKHZhcigtLXdpZHRoLWZhY3RvcikpXFxuICAgICAgdHJhbnNsYXRlWChjYWxjKC01MCUgKyB2YXIoLS1zcHJlYWQtYW1vdW50KSkpO1xcbiAgfVxcbn1cXG4vKiB1c2VyIHNwZWFraW5nIG9zY2lsbGF0aW9uIGFuaW1hdGlvbiAqL1xcbkBrZXlmcmFtZXMgd2F2ZWZvcm1fb3V0ZXJtb3N0IHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDEpIHNjYWxlWCgxKTtcXG4gIH1cXG4gIDI1JSxcXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuOSkgc2NhbGVYKDAuOSk7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgd2F2ZWZvcm1fc2Vjb25kIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuOSkgc2NhbGVYKDAuOSk7XFxuICB9XFxuICAyNSUsXFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjgpIHNjYWxlWCgwLjgpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIHdhdmVmb3JtX3RoaXJkIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuOCkgc2NhbGVYKDAuOCk7XFxuICB9XFxuICAyNSUsXFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjcpIHNjYWxlWCgwLjcpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIHdhdmVmb3JtX2ZvdXJ0aCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjcpIHNjYWxlWCgwLjcpO1xcbiAgfVxcbiAgMjUlLFxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC42KSBzY2FsZVgoMC42KTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyB3YXZlZm9ybV9maWZ0aCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjYpIHNjYWxlWCgwLjYpO1xcbiAgfVxcbiAgMjUlLFxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC41KSBzY2FsZVgoMC41KTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyB3YXZlZm9ybV9pbm5lcm1vc3Qge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC41KSBzY2FsZVgoMC41KTtcXG4gIH1cXG4gIDI1JSxcXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNCkgc2NhbGVYKDAuNCk7XFxuICB9XFxufVxcblxcbi5vdXRlcm1vc3QudXNlclNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogd2F2ZWZvcm1fb3V0ZXJtb3N0IDAuN3MgaW5maW5pdGUgYWx0ZXJuYXRlO1xcbn1cXG5cXG4uc2Vjb25kLnVzZXJTcGVha2luZyB7XFxuICBhbmltYXRpb246IHdhdmVmb3JtX3NlY29uZCAwLjY1cyBpbmZpbml0ZSBhbHRlcm5hdGU7XFxufVxcblxcbi50aGlyZC51c2VyU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV90aGlyZCAwLjZzIGluZmluaXRlIGFsdGVybmF0ZTtcXG59XFxuXFxuLmZvdXJ0aC51c2VyU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV9mb3VydGggMC41NXMgaW5maW5pdGUgYWx0ZXJuYXRlO1xcbn1cXG5cXG4uZmlmdGgudXNlclNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogd2F2ZWZvcm1fZmlmdGggMC41cyBpbmZpbml0ZSBhbHRlcm5hdGU7XFxufVxcblxcbi5pbm5lcm1vc3QudXNlclNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogd2F2ZWZvcm1faW5uZXJtb3N0IDAuNDVzIGluZmluaXRlIGFsdGVybmF0ZTtcXG59XFxuXFxuLyogZmxpcGNhcmQgYW5pbWF0aW9uIHRvIGluZGljYXRlIFNheSwgUGkgaXMgdHJhbnNjcmliaW5nIGF1ZGlvIHRvIHRleHQgKi9cXG5Aa2V5ZnJhbWVzIHRyYW5zY3JpYmluZ0ZsaXAge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGVZKDBkZWcpO1xcbiAgICBmaWxsOiB2YXIoLS1vcmlnaW5hbC1jb2xvcik7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZVkoMTgwZGVnKTtcXG4gICAgZmlsbDogdmFyKC0tdHJhbnNjcmliaW5nLWNvbG9yKTtcXG4gIH1cXG59XFxuXFxuLm91dGVybW9zdC50cmFuc2NyaWJpbmcge1xcbiAgLS1vcmlnaW5hbC1jb2xvcjogI2U0ZjJkMTtcXG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjYjNlMGZlO1xcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDEuNXMgaW5maW5pdGU7XFxufVxcblxcbi5zZWNvbmQudHJhbnNjcmliaW5nIHtcXG4gIC0tb3JpZ2luYWwtY29sb3I6ICNjY2U4YjU7XFxuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogIzg5YzJmZjtcXG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAxLjZzIGluZmluaXRlO1xcbn1cXG5cXG4udGhpcmQudHJhbnNjcmliaW5nIHtcXG4gIC0tb3JpZ2luYWwtY29sb3I6ICNiM2RiOTU7XFxuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogIzVmYTRmZjtcXG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAxLjdzIGluZmluaXRlO1xcbn1cXG5cXG4uZm91cnRoLnRyYW5zY3JpYmluZyB7XFxuICAtLW9yaWdpbmFsLWNvbG9yOiAjOWJkMDc4O1xcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICMzNTg2ZmY7XFxuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMS44cyBpbmZpbml0ZTtcXG59XFxuXFxuLmZpZnRoLnRyYW5zY3JpYmluZyB7XFxuICAtLW9yaWdpbmFsLWNvbG9yOiAjODNjNTVjO1xcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICMwYjY5ZTM7XFxuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMS45cyBpbmZpbml0ZTtcXG59XFxuXFxuLmlubmVybW9zdC50cmFuc2NyaWJpbmcge1xcbiAgLS1vcmlnaW5hbC1jb2xvcjogIzQyOGEyZjtcXG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjMDA1M2JmO1xcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDJzIGluZmluaXRlO1xcbn1cXG5cXG4vKiBoZWFydGJlYXQgYW5pbWF0aW9uIHRvIGluZGljYXRlIFBpIGlzIHByZXBhcmluZyB0byBzcGVhayAqL1xcbkBrZXlmcmFtZXMgaGVhcnRiZWF0IHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIGZpbGw6IHZhcigtLW9yaWdpbmFsLWNvbG9yKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIG9wYWNpdHk6IDAuNTtcXG4gICAgZmlsbDogcmdiKDI0NSAyMzggMjIzKTsgLyogYmctY3JlYW0tNTUwICovXFxuICB9XFxufVxcblxcbi5vdXRlcm1vc3QubG9hZGluZyB7XFxuICAtLW9yaWdpbmFsLWNvbG9yOiAjZTRmMmQxO1xcbiAgYW5pbWF0aW9uOiBoZWFydGJlYXQgMnMgaW5maW5pdGU7XFxuICBhbmltYXRpb24tZGVsYXk6IDBzO1xcbn1cXG5cXG4uc2Vjb25kLmxvYWRpbmcge1xcbiAgLS1vcmlnaW5hbC1jb2xvcjogI2NjZThiNTtcXG4gIGFuaW1hdGlvbjogaGVhcnRiZWF0IDJzIGluZmluaXRlO1xcbiAgYW5pbWF0aW9uLWRlbGF5OiAwLjRzO1xcbn1cXG5cXG4udGhpcmQubG9hZGluZyB7XFxuICAtLW9yaWdpbmFsLWNvbG9yOiAjYjNkYjk1O1xcbiAgYW5pbWF0aW9uOiBoZWFydGJlYXQgMnMgaW5maW5pdGU7XFxuICBhbmltYXRpb24tZGVsYXk6IDAuOHM7XFxufVxcblxcbi5mb3VydGgubG9hZGluZyB7XFxuICAtLW9yaWdpbmFsLWNvbG9yOiAjOWJkMDc4O1xcbiAgYW5pbWF0aW9uOiBoZWFydGJlYXQgMnMgaW5maW5pdGU7XFxuICBhbmltYXRpb24tZGVsYXk6IDEuMnM7XFxufVxcblxcbi5maWZ0aC5sb2FkaW5nIHtcXG4gIC0tb3JpZ2luYWwtY29sb3I6ICM4M2M1NWM7XFxuICBhbmltYXRpb246IGhlYXJ0YmVhdCAycyBpbmZpbml0ZTtcXG4gIGFuaW1hdGlvbi1kZWxheTogMS42cztcXG59XFxuXFxuLmlubmVybW9zdC5sb2FkaW5nIHtcXG4gIC0tb3JpZ2luYWwtY29sb3I6ICM0MjhhMmY7XFxuICBhbmltYXRpb246IGhlYXJ0YmVhdCAycyBpbmZpbml0ZTtcXG4gIGFuaW1hdGlvbi1kZWxheTogMnM7XFxufVxcblxcbi8qIHRvbmVkLWRvd24gZGlzc2FyeSBhbmltYXRpb24gdG8gaW5kaWNhdGUgYW4gZXJyb3IgKi9cXG4vKiB0b25lZC1kb3duIGVycm9yIGFuaW1hdGlvbiB3aXRoIHJlZHVjZWQgb3BhY2l0eSAqL1xcbkBrZXlmcmFtZXMgZXJyb3JBbmltYXRpb24ge1xcbiAgMCUge1xcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKSB0cmFuc2xhdGUoMCUsIDAlKTtcXG4gIH1cXG4gIDI1JSB7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlKC01ZGVnKSB0cmFuc2xhdGUoLTUlLCA1JSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSg1ZGVnKSB0cmFuc2xhdGUoNSUsIC01JSk7XFxuICB9XFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgtNWRlZykgdHJhbnNsYXRlKC01JSwgNSUpO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpIHRyYW5zbGF0ZSgwJSwgMCUpO1xcbiAgfVxcbn1cXG5cXG4ub3V0ZXJtb3N0LmVycm9yIHtcXG4gIGFuaW1hdGlvbjogZXJyb3JBbmltYXRpb24gMjVzIDE7XFxuICBmaWxsOiAjZmYwMDAwO1xcbiAgZmlsbC1vcGFjaXR5OiAwLjc7XFxufVxcblxcbi5zZWNvbmQuZXJyb3Ige1xcbiAgYW5pbWF0aW9uOiBlcnJvckFuaW1hdGlvbiAyNXMgMTtcXG4gIGZpbGw6ICNmZjMzMDA7XFxuICBmaWxsLW9wYWNpdHk6IDAuNztcXG59XFxuXFxuLnRoaXJkLmVycm9yIHtcXG4gIGFuaW1hdGlvbjogZXJyb3JBbmltYXRpb24gMjVzIDE7XFxuICBmaWxsOiAjZmY2NjAwO1xcbiAgZmlsbC1vcGFjaXR5OiAwLjc7XFxufVxcblxcbi5mb3VydGguZXJyb3Ige1xcbiAgYW5pbWF0aW9uOiBlcnJvckFuaW1hdGlvbiAyNXMgMTtcXG4gIGZpbGw6ICNmZjk5MDA7XFxuICBmaWxsLW9wYWNpdHk6IDAuNztcXG59XFxuXFxuLmZpZnRoLmVycm9yIHtcXG4gIGFuaW1hdGlvbjogZXJyb3JBbmltYXRpb24gMjVzIDE7XFxuICBmaWxsOiAjZmZjYzAwO1xcbiAgZmlsbC1vcGFjaXR5OiAwLjc7XFxufVxcblxcbi5pbm5lcm1vc3QuZXJyb3Ige1xcbiAgYW5pbWF0aW9uOiBlcnJvckFuaW1hdGlvbiAyNXMgMTtcXG4gIGZpbGw6ICNmZmZmMDA7XFxuICBmaWxsLW9wYWNpdHk6IDAuNztcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAuaGlkZGVuIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuI3NheXBpLXBsYXlCdXR0b24ucGxheS1idXR0b24ge1xuICAvKiBwb3NpdGlvbiBvdmVyIHRoZSB0YWxrIGJ1dHRvbiwgYnV0IHVuZGVyIGFueSBjb250cm9scyAqL1xuICB6LWluZGV4OiA3MDsgLyogdGFsayBidXR0b24gei1pbmRleCBpcyA1OSBvciA2MCAqL1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDApOyAvKiB0cmFuc3BhcmVudCB3aXRob3V0IGhvbGVzICovXG4gIGJvcmRlcjogbm9uZTtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC8qIG1heGltaXplIChtb2JpbGUgdmlldykgYnV0dG9uIGlzIG9ubHkgZGlzcGxheWVkIG9uIGNvbXBhdGlibGUgZGV2aWNlcyAqL1xuICAjc2F5cGktZW50ZXJCdXR0b24sXG4gICNzYXlwaS1leGl0QnV0dG9uIHtcbiAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgdG9wOiA0cmVtO1xuICAgIGxlZnQ6IDEuMjVyZW07XG4gICAgd2lkdGg6IDNyZW07XG4gICAgaGVpZ2h0OiAzcmVtO1xuICAgIHBhZGRpbmc6IDZweDtcbiAgICBib3JkZXI6IDA7XG4gICAgei1pbmRleDogNjA7XG4gIH1cbn1gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvY29tbW9uLnNjc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRSxhQUFBO0FBQ0Y7O0FBQ0E7RUFDRSwwREFBQTtFQUNBLFdBQUEsRUFBQSxvQ0FBQTtFQUNBLGtDQUFBLEVBQUEsOEJBQUE7RUFDQSxZQUFBO0FBRUY7O0FBQ0E7RUFDRSwwRUFBQTtFQUNBOztJQUVFLGVBQUE7SUFDQSxTQUFBO0lBQ0EsYUFBQTtJQUNBLFdBQUE7SUFDQSxZQUFBO0lBQ0EsWUFBQTtJQUNBLFNBQUE7SUFDQSxXQUFBO0VBRUY7QUFDRlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIuaGlkZGVuIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcbiNzYXlwaS1wbGF5QnV0dG9uLnBsYXktYnV0dG9uIHtcXG4gIC8qIHBvc2l0aW9uIG92ZXIgdGhlIHRhbGsgYnV0dG9uLCBidXQgdW5kZXIgYW55IGNvbnRyb2xzICovXFxuICB6LWluZGV4OiA3MDsgLyogdGFsayBidXR0b24gei1pbmRleCBpcyA1OSBvciA2MCAqL1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwKTsgLyogdHJhbnNwYXJlbnQgd2l0aG91dCBob2xlcyAqL1xcbiAgYm9yZGVyOiBub25lO1xcbn1cXG5cXG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcXG4gIC8qIG1heGltaXplIChtb2JpbGUgdmlldykgYnV0dG9uIGlzIG9ubHkgZGlzcGxheWVkIG9uIGNvbXBhdGlibGUgZGV2aWNlcyAqL1xcbiAgI3NheXBpLWVudGVyQnV0dG9uLFxcbiAgI3NheXBpLWV4aXRCdXR0b24ge1xcbiAgICBwb3NpdGlvbjogZml4ZWQ7XFxuICAgIHRvcDogNHJlbTtcXG4gICAgbGVmdDogMS4yNXJlbTtcXG4gICAgd2lkdGg6IDNyZW07XFxuICAgIGhlaWdodDogM3JlbTtcXG4gICAgcGFkZGluZzogNnB4O1xcbiAgICBib3JkZXI6IDA7XFxuICAgIHotaW5kZXg6IDYwO1xcbiAgfVxcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYEBrZXlmcmFtZXMgcHVsc2Uge1xuICAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45KTtcbiAgfVxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICB9XG59XG5odG1sLmRlc2t0b3AtdmlldyAjc2F5cGktdGFsa0J1dHRvbixcbmh0bWwuZGVza3RvcC12aWV3IC5wbGF5LWJ1dHRvbiB7XG4gIG1hcmdpbjogMC41cmVtO1xuICBib3JkZXItcmFkaXVzOiAxOHB4O1xuICBoZWlnaHQ6IDIuMjVyZW07XG4gIHdpZHRoOiA1cmVtO1xuICBkaXNwbGF5OiBibG9jazsgLyogRm9yIFNhZmFyaSAqL1xufVxuaHRtbC5kZXNrdG9wLXZpZXcgaHRtbDpub3QoLmZpcmVmb3gtYW5kcm9pZCkgI3NheXBpLXRhbGtCdXR0b246YWN0aXZlIC53YXZlZm9ybSxcbmh0bWwuZGVza3RvcC12aWV3ICNzYXlwaS10YWxrQnV0dG9uLmFjdGl2ZSAud2F2ZWZvcm0ge1xuICBhbmltYXRpb246IHB1bHNlIDFzIGluZmluaXRlO1xufVxuaHRtbC5kZXNrdG9wLXZpZXcgI3NheXBpLXRhbGtCdXR0b24gLndhdmVmb3JtIHtcbiAgZmlsbDogIzc3NmQ2ZDtcbn1cbmh0bWwuZGVza3RvcC12aWV3ICNzYXlwaS10YWxrQnV0dG9uLmF1dG9TdWJtaXQgLndhdmVmb3JtIHtcbiAgZmlsbDogcmdiKDY1LCAxMzgsIDQ3KTsgLyogUGkncyB0ZXh0LWJyYW5kLWdyZWVuLTYwMCAqL1xufVxuaHRtbC5kZXNrdG9wLXZpZXcgI3NheXBpLW5vdGlmaWNhdGlvbiA+IHN2ZyB7XG4gIHdpZHRoOiAzcmVtO1xuICBoZWlnaHQ6IDNyZW07XG4gIGJvdHRvbTogNHJlbTtcbiAgcmlnaHQ6IDEycmVtO1xuICBwb3NpdGlvbjogZml4ZWQ7XG59XG5odG1sLmRlc2t0b3AtdmlldyAjc2F5cGktZXhpdEJ1dHRvbiB7XG4gIGRpc3BsYXk6IG5vbmU7XG59YCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGVzL2Rlc2t0b3Auc2Nzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFDRTtFQUNFO0lBQ0UsbUJBQUE7RUFBSjtFQUVFO0lBQ0UscUJBQUE7RUFBSjtFQUVFO0lBQ0UsbUJBQUE7RUFBSjtBQUNGO0FBRUU7O0VBRUUsY0FBQTtFQUNBLG1CQUFBO0VBQ0EsZUFBQTtFQUNBLFdBQUE7RUFDQSxjQUFBLEVBQUEsZUFBQTtBQUFKO0FBR0U7O0VBRUUsNEJBQUE7QUFESjtBQUdFO0VBQ0UsYUFBQTtBQURKO0FBR0U7RUFDRSxzQkFBQSxFQUFBLDhCQUFBO0FBREo7QUFJRTtFQUNFLFdBQUE7RUFDQSxZQUFBO0VBQ0EsWUFBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0FBRko7QUFLRTtFQUNFLGFBQUE7QUFISlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJodG1sLmRlc2t0b3AtdmlldyB7XFxuICBAa2V5ZnJhbWVzIHB1bHNlIHtcXG4gICAgMCUge1xcbiAgICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICAgIH1cXG4gICAgNTAlIHtcXG4gICAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOSk7XFxuICAgIH1cXG4gICAgMTAwJSB7XFxuICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gICAgfVxcbiAgfVxcbiAgI3NheXBpLXRhbGtCdXR0b24sXFxuICAucGxheS1idXR0b24ge1xcbiAgICBtYXJnaW46IDAuNXJlbTtcXG4gICAgYm9yZGVyLXJhZGl1czogMThweDtcXG4gICAgaGVpZ2h0OiAyLjI1cmVtO1xcbiAgICB3aWR0aDogNXJlbTtcXG4gICAgZGlzcGxheTogYmxvY2s7IC8qIEZvciBTYWZhcmkgKi9cXG4gIH1cXG5cXG4gIGh0bWw6bm90KC5maXJlZm94LWFuZHJvaWQpICNzYXlwaS10YWxrQnV0dG9uOmFjdGl2ZSAud2F2ZWZvcm0sXFxuICAjc2F5cGktdGFsa0J1dHRvbi5hY3RpdmUgLndhdmVmb3JtIHtcXG4gICAgYW5pbWF0aW9uOiBwdWxzZSAxcyBpbmZpbml0ZTtcXG4gIH1cXG4gICNzYXlwaS10YWxrQnV0dG9uIC53YXZlZm9ybSB7XFxuICAgIGZpbGw6ICM3NzZkNmQ7XFxuICB9XFxuICAjc2F5cGktdGFsa0J1dHRvbi5hdXRvU3VibWl0IC53YXZlZm9ybSB7XFxuICAgIGZpbGw6IHJnYig2NSAxMzggNDcpOyAvKiBQaSdzIHRleHQtYnJhbmQtZ3JlZW4tNjAwICovXFxuICB9XFxuXFxuICAjc2F5cGktbm90aWZpY2F0aW9uID4gc3ZnIHtcXG4gICAgd2lkdGg6IDNyZW07XFxuICAgIGhlaWdodDogM3JlbTtcXG4gICAgYm90dG9tOiA0cmVtO1xcbiAgICByaWdodDogMTJyZW07XFxuICAgIHBvc2l0aW9uOiBmaXhlZDtcXG4gIH1cXG5cXG4gICNzYXlwaS1leGl0QnV0dG9uIHtcXG4gICAgZGlzcGxheTogbm9uZTtcXG4gIH1cXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGBAbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgaHRtbC5tb2JpbGUtdmlldyB7XG4gICAgLyogUGkgY29udHJvbHM6IGVsbGlwc2lzLCBleHBlcmllbmNlcyAqL1xuICAgIC8qIFBpIGNvbnRyb2xzOiBtdXRlL3VubXV0ZSAqL1xuICAgIC8qIGZpeCBhbiBhbGlnbm1lbnQgaXNzdWUgd2l0aCB0aGUgXCJuZXcgdWkgbGF5b3V0XCIgKi9cbiAgfVxuICBodG1sLm1vYmlsZS12aWV3ICNzYXlwaS1wYW5lbCxcbiAgaHRtbC5tb2JpbGUtdmlldyAucGxheS1idXR0b24sXG4gIGh0bWwubW9iaWxlLXZpZXcgLm5vdGlmaWNhdGlvbiB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgcG9zaXRpb246IGZpeGVkO1xuICAgIGxlZnQ6IDA7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNDUsIDIzOCwgMjIzLCAwLjk4KTtcbiAgICBoZWlnaHQ6IDEwMHZoO1xuICAgIHRvcDogMDtcbiAgfVxuICBodG1sLm1vYmlsZS12aWV3ICNzYXlwaS10YWxrQnV0dG9uIHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgYm9yZGVyLXJhZGl1czogMDtcbiAgICBtYXJnaW46IDA7XG4gIH1cbiAgaHRtbC5tb2JpbGUtdmlldyAjc2F5cGktbm90aWZpY2F0aW9uIHtcbiAgICB6LWluZGV4OiAxMDA7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIH1cbiAgaHRtbC5tb2JpbGUtdmlldyAjc2F5cGktbm90aWZpY2F0aW9uIHN2ZyB7XG4gICAgd2lkdGg6IDc1JTtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gICAgbWFyZ2luOiBhdXRvO1xuICB9XG4gIGh0bWwubW9iaWxlLXZpZXcgI19fbmV4dCA+IG1haW4gPiBkaXYgPiBkaXYgPiBkaXYuZml4ZWQudG9wLTQucmlnaHQtNiA+IGJ1dHRvbixcbiAgaHRtbC5tb2JpbGUtdmlldyAjc2F5cGktZXhwZXJpZW5jZXMtYnV0dG9uIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEuNSk7XG4gIH1cbiAgaHRtbC5tb2JpbGUtdmlldyAjc2F5cGktYXVkaW8tY29udHJvbHMge1xuICAgIC8qIGhpZGUgdGhlIHZvaWNlIG9wdGlvbnMgKi9cbiAgICAvKiBzY2FsZSB0aGUgbXV0ZSBidXR0b24gKi9cbiAgfVxuICBodG1sLm1vYmlsZS12aWV3ICNzYXlwaS1hdWRpby1jb250cm9scyBkaXYucC0xIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG4gIGh0bWwubW9iaWxlLXZpZXcgI3NheXBpLWF1ZGlvLWNvbnRyb2xzIGJ1dHRvbi5ncm91cCB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgyKSAhaW1wb3J0YW50O1xuICAgIHotaW5kZXg6IDUwO1xuICAgIC8qIGhpZGUgdGhlIHZvaWNlIHNlbGVjdG9yIHR3aXN0eSAqL1xuICB9XG4gIGh0bWwubW9iaWxlLXZpZXcgI3NheXBpLWF1ZGlvLWNvbnRyb2xzIGJ1dHRvbi5ncm91cCArIGJ1dHRvbiB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxuICBodG1sLm1vYmlsZS12aWV3IC50ZXh0LWJvZHktY2hhdC1tIHtcbiAgICBwYWRkaW5nLXRvcDogMDtcbiAgfVxuICBodG1sLm1vYmlsZS12aWV3ICNzYXlwaS1lbnRlckJ1dHRvbiB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxuICBodG1sLm1vYmlsZS12aWV3ICNzYXlwaS1mb290ZXIge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gIH1cbiAgaHRtbC5tb2JpbGUtdmlldyAjc2F5cGktcHJvbXB0IHtcbiAgICAvKiBoaWRlcyB2aXJ0dWFsIGtleWJvYXJkIG9uIGFuZHJvaWQgKi9cbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG4gIGh0bWwubW9iaWxlLXZpZXcgI3NheXBpLXN1Ym1pdEJ1dHRvbiB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxufWAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlcy9tb2JpbGUuc2Nzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFO0lBK0JFLHVDQUFBO0lBTUEsNkJBQUE7SUFpQkEsb0RBQUE7RUFsREY7RUFIRTs7O0lBR0UsV0FBQTtJQUNBLGVBQUE7SUFDQSxPQUFBO0lBQ0EsMkNBQUE7SUFFQSxhQUFBO0lBQ0EsTUFBQTtFQUlKO0VBREU7SUFDRSxXQUFBO0lBQ0EsWUFBQTtJQUNBLDZCQUFBO0lBQ0EsZ0JBQUE7SUFDQSxTQUFBO0VBR0o7RUFBRTtJQUNFLFlBQUE7SUFDQSw2QkFBQTtFQUVKO0VBREk7SUFDRSxVQUFBO0lBQ0EsWUFBQTtJQUNBLFlBQUE7RUFHTjtFQUVFOztJQUVFLHFCQUFBO0VBQUo7RUFJRTtJQUNFLDJCQUFBO0lBSUEsMEJBQUE7RUFMSjtFQUVJO0lBQ0UsYUFBQTtFQUFOO0VBR0k7SUFDRSw4QkFBQTtJQUNBLFdBQUE7SUFDQSxtQ0FBQTtFQUROO0VBRU07SUFDRSxhQUFBO0VBQVI7RUFNRTtJQUNFLGNBQUE7RUFKSjtFQU9FO0lBQ0UsYUFBQTtFQUxKO0VBUUU7SUFDRSxhQUFBO0VBTko7RUFTRTtJQUNFLHNDQUFBO0lBQ0EsYUFBQTtFQVBKO0VBVUU7SUFDRSxhQUFBO0VBUko7QUFDRlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJAbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcXG4gIGh0bWwubW9iaWxlLXZpZXcge1xcbiAgICAjc2F5cGktcGFuZWwsXFxuICAgIC5wbGF5LWJ1dHRvbixcXG4gICAgLm5vdGlmaWNhdGlvbiB7XFxuICAgICAgd2lkdGg6IDEwMCU7XFxuICAgICAgcG9zaXRpb246IGZpeGVkO1xcbiAgICAgIGxlZnQ6IDA7XFxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNDUsIDIzOCwgMjIzLCAwLjk4KTtcXG5cXG4gICAgICBoZWlnaHQ6IDEwMHZoO1xcbiAgICAgIHRvcDogMDtcXG4gICAgfVxcblxcbiAgICAjc2F5cGktdGFsa0J1dHRvbiB7XFxuICAgICAgd2lkdGg6IDEwMCU7XFxuICAgICAgaGVpZ2h0OiAxMDAlO1xcbiAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgICAgIGJvcmRlci1yYWRpdXM6IDA7XFxuICAgICAgbWFyZ2luOiAwO1xcbiAgICB9XFxuXFxuICAgICNzYXlwaS1ub3RpZmljYXRpb24ge1xcbiAgICAgIHotaW5kZXg6IDEwMDtcXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gICAgICBzdmcge1xcbiAgICAgICAgd2lkdGg6IDc1JTtcXG4gICAgICAgIGhlaWdodDogMTAwJTtcXG4gICAgICAgIG1hcmdpbjogYXV0bztcXG4gICAgICB9XFxuICAgIH1cXG5cXG4gICAgLyogUGkgY29udHJvbHM6IGVsbGlwc2lzLCBleHBlcmllbmNlcyAqL1xcbiAgICAjX19uZXh0ID4gbWFpbiA+IGRpdiA+IGRpdiA+IGRpdi5maXhlZC50b3AtNC5yaWdodC02ID4gYnV0dG9uLFxcbiAgICAjc2F5cGktZXhwZXJpZW5jZXMtYnV0dG9uIHtcXG4gICAgICB0cmFuc2Zvcm06IHNjYWxlKDEuNSk7XFxuICAgIH1cXG5cXG4gICAgLyogUGkgY29udHJvbHM6IG11dGUvdW5tdXRlICovXFxuICAgICNzYXlwaS1hdWRpby1jb250cm9scyB7XFxuICAgICAgLyogaGlkZSB0aGUgdm9pY2Ugb3B0aW9ucyAqL1xcbiAgICAgIGRpdi5wLTEge1xcbiAgICAgICAgZGlzcGxheTogbm9uZTtcXG4gICAgICB9XFxuICAgICAgLyogc2NhbGUgdGhlIG11dGUgYnV0dG9uICovXFxuICAgICAgYnV0dG9uLmdyb3VwIHtcXG4gICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMikgIWltcG9ydGFudDtcXG4gICAgICAgIHotaW5kZXg6IDUwO1xcbiAgICAgICAgLyogaGlkZSB0aGUgdm9pY2Ugc2VsZWN0b3IgdHdpc3R5ICovXFxuICAgICAgICArIGJ1dHRvbiB7XFxuICAgICAgICAgIGRpc3BsYXk6IG5vbmU7XFxuICAgICAgICB9XFxuICAgICAgfVxcbiAgICB9XFxuXFxuICAgIC8qIGZpeCBhbiBhbGlnbm1lbnQgaXNzdWUgd2l0aCB0aGUgXFxcIm5ldyB1aSBsYXlvdXRcXFwiICovXFxuICAgIC50ZXh0LWJvZHktY2hhdC1tIHtcXG4gICAgICBwYWRkaW5nLXRvcDogMDtcXG4gICAgfVxcblxcbiAgICAjc2F5cGktZW50ZXJCdXR0b24ge1xcbiAgICAgIGRpc3BsYXk6IG5vbmU7XFxuICAgIH1cXG5cXG4gICAgI3NheXBpLWZvb3RlciB7XFxuICAgICAgZGlzcGxheTogbm9uZTtcXG4gICAgfVxcblxcbiAgICAjc2F5cGktcHJvbXB0IHtcXG4gICAgICAvKiBoaWRlcyB2aXJ0dWFsIGtleWJvYXJkIG9uIGFuZHJvaWQgKi9cXG4gICAgICBkaXNwbGF5OiBub25lO1xcbiAgICB9XFxuXFxuICAgICNzYXlwaS1zdWJtaXRCdXR0b24ge1xcbiAgICAgIGRpc3BsYXk6IG5vbmU7XFxuICAgIH1cXG4gIH1cXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUiA9IHR5cGVvZiBSZWZsZWN0ID09PSAnb2JqZWN0JyA/IFJlZmxlY3QgOiBudWxsXG52YXIgUmVmbGVjdEFwcGx5ID0gUiAmJiB0eXBlb2YgUi5hcHBseSA9PT0gJ2Z1bmN0aW9uJ1xuICA/IFIuYXBwbHlcbiAgOiBmdW5jdGlvbiBSZWZsZWN0QXBwbHkodGFyZ2V0LCByZWNlaXZlciwgYXJncykge1xuICAgIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHkuY2FsbCh0YXJnZXQsIHJlY2VpdmVyLCBhcmdzKTtcbiAgfVxuXG52YXIgUmVmbGVjdE93bktleXNcbmlmIChSICYmIHR5cGVvZiBSLm93bktleXMgPT09ICdmdW5jdGlvbicpIHtcbiAgUmVmbGVjdE93bktleXMgPSBSLm93bktleXNcbn0gZWxzZSBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuICBSZWZsZWN0T3duS2V5cyA9IGZ1bmN0aW9uIFJlZmxlY3RPd25LZXlzKHRhcmdldCkge1xuICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0YXJnZXQpXG4gICAgICAuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHModGFyZ2V0KSk7XG4gIH07XG59IGVsc2Uge1xuICBSZWZsZWN0T3duS2V5cyA9IGZ1bmN0aW9uIFJlZmxlY3RPd25LZXlzKHRhcmdldCkge1xuICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0YXJnZXQpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBQcm9jZXNzRW1pdFdhcm5pbmcod2FybmluZykge1xuICBpZiAoY29uc29sZSAmJiBjb25zb2xlLndhcm4pIGNvbnNvbGUud2Fybih3YXJuaW5nKTtcbn1cblxudmFyIE51bWJlcklzTmFOID0gTnVtYmVyLmlzTmFOIHx8IGZ1bmN0aW9uIE51bWJlcklzTmFOKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgRXZlbnRFbWl0dGVyLmluaXQuY2FsbCh0aGlzKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xubW9kdWxlLmV4cG9ydHMub25jZSA9IG9uY2U7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzQ291bnQgPSAwO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG52YXIgZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG5mdW5jdGlvbiBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKSB7XG4gIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJsaXN0ZW5lclwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBGdW5jdGlvbi4gUmVjZWl2ZWQgdHlwZSAnICsgdHlwZW9mIGxpc3RlbmVyKTtcbiAgfVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoRXZlbnRFbWl0dGVyLCAnZGVmYXVsdE1heExpc3RlbmVycycsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZGVmYXVsdE1heExpc3RlbmVycztcbiAgfSxcbiAgc2V0OiBmdW5jdGlvbihhcmcpIHtcbiAgICBpZiAodHlwZW9mIGFyZyAhPT0gJ251bWJlcicgfHwgYXJnIDwgMCB8fCBOdW1iZXJJc05hTihhcmcpKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVGhlIHZhbHVlIG9mIFwiZGVmYXVsdE1heExpc3RlbmVyc1wiIGlzIG91dCBvZiByYW5nZS4gSXQgbXVzdCBiZSBhIG5vbi1uZWdhdGl2ZSBudW1iZXIuIFJlY2VpdmVkICcgKyBhcmcgKyAnLicpO1xuICAgIH1cbiAgICBkZWZhdWx0TWF4TGlzdGVuZXJzID0gYXJnO1xuICB9XG59KTtcblxuRXZlbnRFbWl0dGVyLmluaXQgPSBmdW5jdGlvbigpIHtcblxuICBpZiAodGhpcy5fZXZlbnRzID09PSB1bmRlZmluZWQgfHxcbiAgICAgIHRoaXMuX2V2ZW50cyA9PT0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMpLl9ldmVudHMpIHtcbiAgICB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHRoaXMuX2V2ZW50c0NvdW50ID0gMDtcbiAgfVxuXG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59O1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbiBzZXRNYXhMaXN0ZW5lcnMobikge1xuICBpZiAodHlwZW9mIG4gIT09ICdudW1iZXInIHx8IG4gPCAwIHx8IE51bWJlcklzTmFOKG4pKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RoZSB2YWx1ZSBvZiBcIm5cIiBpcyBvdXQgb2YgcmFuZ2UuIEl0IG11c3QgYmUgYSBub24tbmVnYXRpdmUgbnVtYmVyLiBSZWNlaXZlZCAnICsgbiArICcuJyk7XG4gIH1cbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5mdW5jdGlvbiBfZ2V0TWF4TGlzdGVuZXJzKHRoYXQpIHtcbiAgaWYgKHRoYXQuX21heExpc3RlbmVycyA9PT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgcmV0dXJuIHRoYXQuX21heExpc3RlbmVycztcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5nZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbiBnZXRNYXhMaXN0ZW5lcnMoKSB7XG4gIHJldHVybiBfZ2V0TWF4TGlzdGVuZXJzKHRoaXMpO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gZW1pdCh0eXBlKSB7XG4gIHZhciBhcmdzID0gW107XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSBhcmdzLnB1c2goYXJndW1lbnRzW2ldKTtcbiAgdmFyIGRvRXJyb3IgPSAodHlwZSA9PT0gJ2Vycm9yJyk7XG5cbiAgdmFyIGV2ZW50cyA9IHRoaXMuX2V2ZW50cztcbiAgaWYgKGV2ZW50cyAhPT0gdW5kZWZpbmVkKVxuICAgIGRvRXJyb3IgPSAoZG9FcnJvciAmJiBldmVudHMuZXJyb3IgPT09IHVuZGVmaW5lZCk7XG4gIGVsc2UgaWYgKCFkb0Vycm9yKVxuICAgIHJldHVybiBmYWxzZTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmIChkb0Vycm9yKSB7XG4gICAgdmFyIGVyO1xuICAgIGlmIChhcmdzLmxlbmd0aCA+IDApXG4gICAgICBlciA9IGFyZ3NbMF07XG4gICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIC8vIE5vdGU6IFRoZSBjb21tZW50cyBvbiB0aGUgYHRocm93YCBsaW5lcyBhcmUgaW50ZW50aW9uYWwsIHRoZXkgc2hvd1xuICAgICAgLy8gdXAgaW4gTm9kZSdzIG91dHB1dCBpZiB0aGlzIHJlc3VsdHMgaW4gYW4gdW5oYW5kbGVkIGV4Y2VwdGlvbi5cbiAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgIH1cbiAgICAvLyBBdCBsZWFzdCBnaXZlIHNvbWUga2luZCBvZiBjb250ZXh0IHRvIHRoZSB1c2VyXG4gICAgdmFyIGVyciA9IG5ldyBFcnJvcignVW5oYW5kbGVkIGVycm9yLicgKyAoZXIgPyAnICgnICsgZXIubWVzc2FnZSArICcpJyA6ICcnKSk7XG4gICAgZXJyLmNvbnRleHQgPSBlcjtcbiAgICB0aHJvdyBlcnI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gIH1cblxuICB2YXIgaGFuZGxlciA9IGV2ZW50c1t0eXBlXTtcblxuICBpZiAoaGFuZGxlciA9PT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAodHlwZW9mIGhhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICBSZWZsZWN0QXBwbHkoaGFuZGxlciwgdGhpcywgYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGxlbiA9IGhhbmRsZXIubGVuZ3RoO1xuICAgIHZhciBsaXN0ZW5lcnMgPSBhcnJheUNsb25lKGhhbmRsZXIsIGxlbik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSlcbiAgICAgIFJlZmxlY3RBcHBseShsaXN0ZW5lcnNbaV0sIHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5mdW5jdGlvbiBfYWRkTGlzdGVuZXIodGFyZ2V0LCB0eXBlLCBsaXN0ZW5lciwgcHJlcGVuZCkge1xuICB2YXIgbTtcbiAgdmFyIGV2ZW50cztcbiAgdmFyIGV4aXN0aW5nO1xuXG4gIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpO1xuXG4gIGV2ZW50cyA9IHRhcmdldC5fZXZlbnRzO1xuICBpZiAoZXZlbnRzID09PSB1bmRlZmluZWQpIHtcbiAgICBldmVudHMgPSB0YXJnZXQuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgdGFyZ2V0Ll9ldmVudHNDb3VudCA9IDA7XG4gIH0gZWxzZSB7XG4gICAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gICAgaWYgKGV2ZW50cy5uZXdMaXN0ZW5lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0YXJnZXQuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgPyBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICAgICAgLy8gUmUtYXNzaWduIGBldmVudHNgIGJlY2F1c2UgYSBuZXdMaXN0ZW5lciBoYW5kbGVyIGNvdWxkIGhhdmUgY2F1c2VkIHRoZVxuICAgICAgLy8gdGhpcy5fZXZlbnRzIHRvIGJlIGFzc2lnbmVkIHRvIGEgbmV3IG9iamVjdFxuICAgICAgZXZlbnRzID0gdGFyZ2V0Ll9ldmVudHM7XG4gICAgfVxuICAgIGV4aXN0aW5nID0gZXZlbnRzW3R5cGVdO1xuICB9XG5cbiAgaWYgKGV4aXN0aW5nID09PSB1bmRlZmluZWQpIHtcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICBleGlzdGluZyA9IGV2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICAgICsrdGFyZ2V0Ll9ldmVudHNDb3VudDtcbiAgfSBlbHNlIHtcbiAgICBpZiAodHlwZW9mIGV4aXN0aW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICAgIGV4aXN0aW5nID0gZXZlbnRzW3R5cGVdID1cbiAgICAgICAgcHJlcGVuZCA/IFtsaXN0ZW5lciwgZXhpc3RpbmddIDogW2V4aXN0aW5nLCBsaXN0ZW5lcl07XG4gICAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgfSBlbHNlIGlmIChwcmVwZW5kKSB7XG4gICAgICBleGlzdGluZy51bnNoaWZ0KGxpc3RlbmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXhpc3RpbmcucHVzaChsaXN0ZW5lcik7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgICBtID0gX2dldE1heExpc3RlbmVycyh0YXJnZXQpO1xuICAgIGlmIChtID4gMCAmJiBleGlzdGluZy5sZW5ndGggPiBtICYmICFleGlzdGluZy53YXJuZWQpIHtcbiAgICAgIGV4aXN0aW5nLndhcm5lZCA9IHRydWU7XG4gICAgICAvLyBObyBlcnJvciBjb2RlIGZvciB0aGlzIHNpbmNlIGl0IGlzIGEgV2FybmluZ1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtc3ludGF4XG4gICAgICB2YXIgdyA9IG5ldyBFcnJvcignUG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSBsZWFrIGRldGVjdGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmcubGVuZ3RoICsgJyAnICsgU3RyaW5nKHR5cGUpICsgJyBsaXN0ZW5lcnMgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdhZGRlZC4gVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdpbmNyZWFzZSBsaW1pdCcpO1xuICAgICAgdy5uYW1lID0gJ01heExpc3RlbmVyc0V4Y2VlZGVkV2FybmluZyc7XG4gICAgICB3LmVtaXR0ZXIgPSB0YXJnZXQ7XG4gICAgICB3LnR5cGUgPSB0eXBlO1xuICAgICAgdy5jb3VudCA9IGV4aXN0aW5nLmxlbmd0aDtcbiAgICAgIFByb2Nlc3NFbWl0V2FybmluZyh3KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24gYWRkTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgcmV0dXJuIF9hZGRMaXN0ZW5lcih0aGlzLCB0eXBlLCBsaXN0ZW5lciwgZmFsc2UpO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucHJlcGVuZExpc3RlbmVyID1cbiAgICBmdW5jdGlvbiBwcmVwZW5kTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIHJldHVybiBfYWRkTGlzdGVuZXIodGhpcywgdHlwZSwgbGlzdGVuZXIsIHRydWUpO1xuICAgIH07XG5cbmZ1bmN0aW9uIG9uY2VXcmFwcGVyKCkge1xuICBpZiAoIXRoaXMuZmlyZWQpIHtcbiAgICB0aGlzLnRhcmdldC5yZW1vdmVMaXN0ZW5lcih0aGlzLnR5cGUsIHRoaXMud3JhcEZuKTtcbiAgICB0aGlzLmZpcmVkID0gdHJ1ZTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiB0aGlzLmxpc3RlbmVyLmNhbGwodGhpcy50YXJnZXQpO1xuICAgIHJldHVybiB0aGlzLmxpc3RlbmVyLmFwcGx5KHRoaXMudGFyZ2V0LCBhcmd1bWVudHMpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9vbmNlV3JhcCh0YXJnZXQsIHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBzdGF0ZSA9IHsgZmlyZWQ6IGZhbHNlLCB3cmFwRm46IHVuZGVmaW5lZCwgdGFyZ2V0OiB0YXJnZXQsIHR5cGU6IHR5cGUsIGxpc3RlbmVyOiBsaXN0ZW5lciB9O1xuICB2YXIgd3JhcHBlZCA9IG9uY2VXcmFwcGVyLmJpbmQoc3RhdGUpO1xuICB3cmFwcGVkLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHN0YXRlLndyYXBGbiA9IHdyYXBwZWQ7XG4gIHJldHVybiB3cmFwcGVkO1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbiBvbmNlKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpO1xuICB0aGlzLm9uKHR5cGUsIF9vbmNlV3JhcCh0aGlzLCB0eXBlLCBsaXN0ZW5lcikpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucHJlcGVuZE9uY2VMaXN0ZW5lciA9XG4gICAgZnVuY3Rpb24gcHJlcGVuZE9uY2VMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgY2hlY2tMaXN0ZW5lcihsaXN0ZW5lcik7XG4gICAgICB0aGlzLnByZXBlbmRMaXN0ZW5lcih0eXBlLCBfb25jZVdyYXAodGhpcywgdHlwZSwgbGlzdGVuZXIpKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbi8vIEVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZiBhbmQgb25seSBpZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cbiAgICBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgdmFyIGxpc3QsIGV2ZW50cywgcG9zaXRpb24sIGksIG9yaWdpbmFsTGlzdGVuZXI7XG5cbiAgICAgIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpO1xuXG4gICAgICBldmVudHMgPSB0aGlzLl9ldmVudHM7XG4gICAgICBpZiAoZXZlbnRzID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICBsaXN0ID0gZXZlbnRzW3R5cGVdO1xuICAgICAgaWYgKGxpc3QgPT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fCBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikge1xuICAgICAgICBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMClcbiAgICAgICAgICB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgZXZlbnRzW3R5cGVdO1xuICAgICAgICAgIGlmIChldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICAgICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdC5saXN0ZW5lciB8fCBsaXN0ZW5lcik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGxpc3QgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcG9zaXRpb24gPSAtMTtcblxuICAgICAgICBmb3IgKGkgPSBsaXN0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8IGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgICAgICBvcmlnaW5hbExpc3RlbmVyID0gbGlzdFtpXS5saXN0ZW5lcjtcbiAgICAgICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgaWYgKHBvc2l0aW9uID09PSAwKVxuICAgICAgICAgIGxpc3Quc2hpZnQoKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgc3BsaWNlT25lKGxpc3QsIHBvc2l0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSlcbiAgICAgICAgICBldmVudHNbdHlwZV0gPSBsaXN0WzBdO1xuXG4gICAgICAgIGlmIChldmVudHMucmVtb3ZlTGlzdGVuZXIgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgb3JpZ2luYWxMaXN0ZW5lciB8fCBsaXN0ZW5lcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub2ZmID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPVxuICAgIGZ1bmN0aW9uIHJlbW92ZUFsbExpc3RlbmVycyh0eXBlKSB7XG4gICAgICB2YXIgbGlzdGVuZXJzLCBldmVudHMsIGk7XG5cbiAgICAgIGV2ZW50cyA9IHRoaXMuX2V2ZW50cztcbiAgICAgIGlmIChldmVudHMgPT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgICAgIGlmIChldmVudHMucmVtb3ZlTGlzdGVuZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHRoaXMuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgICAgdGhpcy5fZXZlbnRzQ291bnQgPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50c1t0eXBlXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApXG4gICAgICAgICAgICB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGRlbGV0ZSBldmVudHNbdHlwZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhldmVudHMpO1xuICAgICAgICB2YXIga2V5O1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgIGtleSA9IGtleXNbaV07XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICAgICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgdGhpcy5fZXZlbnRzQ291bnQgPSAwO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgbGlzdGVuZXJzID0gZXZlbnRzW3R5cGVdO1xuXG4gICAgICBpZiAodHlwZW9mIGxpc3RlbmVycyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gICAgICB9IGVsc2UgaWYgKGxpc3RlbmVycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIExJRk8gb3JkZXJcbiAgICAgICAgZm9yIChpID0gbGlzdGVuZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbmZ1bmN0aW9uIF9saXN0ZW5lcnModGFyZ2V0LCB0eXBlLCB1bndyYXApIHtcbiAgdmFyIGV2ZW50cyA9IHRhcmdldC5fZXZlbnRzO1xuXG4gIGlmIChldmVudHMgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gW107XG5cbiAgdmFyIGV2bGlzdGVuZXIgPSBldmVudHNbdHlwZV07XG4gIGlmIChldmxpc3RlbmVyID09PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIFtdO1xuXG4gIGlmICh0eXBlb2YgZXZsaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJylcbiAgICByZXR1cm4gdW53cmFwID8gW2V2bGlzdGVuZXIubGlzdGVuZXIgfHwgZXZsaXN0ZW5lcl0gOiBbZXZsaXN0ZW5lcl07XG5cbiAgcmV0dXJuIHVud3JhcCA/XG4gICAgdW53cmFwTGlzdGVuZXJzKGV2bGlzdGVuZXIpIDogYXJyYXlDbG9uZShldmxpc3RlbmVyLCBldmxpc3RlbmVyLmxlbmd0aCk7XG59XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24gbGlzdGVuZXJzKHR5cGUpIHtcbiAgcmV0dXJuIF9saXN0ZW5lcnModGhpcywgdHlwZSwgdHJ1ZSk7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJhd0xpc3RlbmVycyA9IGZ1bmN0aW9uIHJhd0xpc3RlbmVycyh0eXBlKSB7XG4gIHJldHVybiBfbGlzdGVuZXJzKHRoaXMsIHR5cGUsIGZhbHNlKTtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICBpZiAodHlwZW9mIGVtaXR0ZXIubGlzdGVuZXJDb3VudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBlbWl0dGVyLmxpc3RlbmVyQ291bnQodHlwZSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGxpc3RlbmVyQ291bnQuY2FsbChlbWl0dGVyLCB0eXBlKTtcbiAgfVxufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lckNvdW50ID0gbGlzdGVuZXJDb3VudDtcbmZ1bmN0aW9uIGxpc3RlbmVyQ291bnQodHlwZSkge1xuICB2YXIgZXZlbnRzID0gdGhpcy5fZXZlbnRzO1xuXG4gIGlmIChldmVudHMgIT09IHVuZGVmaW5lZCkge1xuICAgIHZhciBldmxpc3RlbmVyID0gZXZlbnRzW3R5cGVdO1xuXG4gICAgaWYgKHR5cGVvZiBldmxpc3RlbmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9IGVsc2UgaWYgKGV2bGlzdGVuZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGV2bGlzdGVuZXIubGVuZ3RoO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAwO1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmV2ZW50TmFtZXMgPSBmdW5jdGlvbiBldmVudE5hbWVzKCkge1xuICByZXR1cm4gdGhpcy5fZXZlbnRzQ291bnQgPiAwID8gUmVmbGVjdE93bktleXModGhpcy5fZXZlbnRzKSA6IFtdO1xufTtcblxuZnVuY3Rpb24gYXJyYXlDbG9uZShhcnIsIG4pIHtcbiAgdmFyIGNvcHkgPSBuZXcgQXJyYXkobik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgKytpKVxuICAgIGNvcHlbaV0gPSBhcnJbaV07XG4gIHJldHVybiBjb3B5O1xufVxuXG5mdW5jdGlvbiBzcGxpY2VPbmUobGlzdCwgaW5kZXgpIHtcbiAgZm9yICg7IGluZGV4ICsgMSA8IGxpc3QubGVuZ3RoOyBpbmRleCsrKVxuICAgIGxpc3RbaW5kZXhdID0gbGlzdFtpbmRleCArIDFdO1xuICBsaXN0LnBvcCgpO1xufVxuXG5mdW5jdGlvbiB1bndyYXBMaXN0ZW5lcnMoYXJyKSB7XG4gIHZhciByZXQgPSBuZXcgQXJyYXkoYXJyLmxlbmd0aCk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcmV0Lmxlbmd0aDsgKytpKSB7XG4gICAgcmV0W2ldID0gYXJyW2ldLmxpc3RlbmVyIHx8IGFycltpXTtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG5mdW5jdGlvbiBvbmNlKGVtaXR0ZXIsIG5hbWUpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICBmdW5jdGlvbiBlcnJvckxpc3RlbmVyKGVycikge1xuICAgICAgZW1pdHRlci5yZW1vdmVMaXN0ZW5lcihuYW1lLCByZXNvbHZlcik7XG4gICAgICByZWplY3QoZXJyKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXNvbHZlcigpIHtcbiAgICAgIGlmICh0eXBlb2YgZW1pdHRlci5yZW1vdmVMaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBlbWl0dGVyLnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIGVycm9yTGlzdGVuZXIpO1xuICAgICAgfVxuICAgICAgcmVzb2x2ZShbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuICAgIH07XG5cbiAgICBldmVudFRhcmdldEFnbm9zdGljQWRkTGlzdGVuZXIoZW1pdHRlciwgbmFtZSwgcmVzb2x2ZXIsIHsgb25jZTogdHJ1ZSB9KTtcbiAgICBpZiAobmFtZSAhPT0gJ2Vycm9yJykge1xuICAgICAgYWRkRXJyb3JIYW5kbGVySWZFdmVudEVtaXR0ZXIoZW1pdHRlciwgZXJyb3JMaXN0ZW5lciwgeyBvbmNlOiB0cnVlIH0pO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZEVycm9ySGFuZGxlcklmRXZlbnRFbWl0dGVyKGVtaXR0ZXIsIGhhbmRsZXIsIGZsYWdzKSB7XG4gIGlmICh0eXBlb2YgZW1pdHRlci5vbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGV2ZW50VGFyZ2V0QWdub3N0aWNBZGRMaXN0ZW5lcihlbWl0dGVyLCAnZXJyb3InLCBoYW5kbGVyLCBmbGFncyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZXZlbnRUYXJnZXRBZ25vc3RpY0FkZExpc3RlbmVyKGVtaXR0ZXIsIG5hbWUsIGxpc3RlbmVyLCBmbGFncykge1xuICBpZiAodHlwZW9mIGVtaXR0ZXIub24gPT09ICdmdW5jdGlvbicpIHtcbiAgICBpZiAoZmxhZ3Mub25jZSkge1xuICAgICAgZW1pdHRlci5vbmNlKG5hbWUsIGxpc3RlbmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZW1pdHRlci5vbihuYW1lLCBsaXN0ZW5lcik7XG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiBlbWl0dGVyLmFkZEV2ZW50TGlzdGVuZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyBFdmVudFRhcmdldCBkb2VzIG5vdCBoYXZlIGBlcnJvcmAgZXZlbnQgc2VtYW50aWNzIGxpa2UgTm9kZVxuICAgIC8vIEV2ZW50RW1pdHRlcnMsIHdlIGRvIG5vdCBsaXN0ZW4gZm9yIGBlcnJvcmAgZXZlbnRzIGhlcmUuXG4gICAgZW1pdHRlci5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGZ1bmN0aW9uIHdyYXBMaXN0ZW5lcihhcmcpIHtcbiAgICAgIC8vIElFIGRvZXMgbm90IGhhdmUgYnVpbHRpbiBgeyBvbmNlOiB0cnVlIH1gIHN1cHBvcnQgc28gd2VcbiAgICAgIC8vIGhhdmUgdG8gZG8gaXQgbWFudWFsbHkuXG4gICAgICBpZiAoZmxhZ3Mub25jZSkge1xuICAgICAgICBlbWl0dGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIobmFtZSwgd3JhcExpc3RlbmVyKTtcbiAgICAgIH1cbiAgICAgIGxpc3RlbmVyKGFyZyk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiZW1pdHRlclwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBFdmVudEVtaXR0ZXIuIFJlY2VpdmVkIHR5cGUgJyArIHR5cGVvZiBlbWl0dGVyKTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgXCIvLyBkZXBlbmRzIG9uIHRoZSBpbmplY3Rpbmcgc2NyaXB0IChzYXlwaS5pbmRleC5qcykgZGVjbGFyaW5nIHRoZSBFdmVudEJ1cyBhcyBhIGdsb2JhbCB2YXJpYWJsZVxcbnZhciBFdmVudEJ1cyA9IHdpbmRvdy5FdmVudEJ1cztcXG5cXG4vLyBhdWRpbyBvdXRwdXQgKFBpKVxcbnZhciBhdWRpb0VsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxcXCJhdWRpb1xcXCIpO1xcbmlmICghYXVkaW9FbGVtZW50KSB7XFxuICBjb25zb2xlLmVycm9yKFxcXCJBdWRpbyBlbGVtZW50IG5vdCBmb3VuZCFcXFwiKTtcXG59XFxuXFxuLy8gVE9ETzogZGVkdXBlIHRoaXMgZnVuY3Rpb24gZnJvbSBFdmVudE1vZHVsZS5qc1xcbmZ1bmN0aW9uIGlzU2FmYXJpKCkge1xcbiAgcmV0dXJuIC9eKCg/IWNocm9tZXxhbmRyb2lkKS4pKnNhZmFyaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XFxufVxcbmF1ZGlvRWxlbWVudC5wcmVsb2FkID0gXFxcImF1dG9cXFwiOyAvLyBlbmFibGUgYWdncmVzc2l2ZSBwcmVsb2FkaW5nIG9mIGF1ZGlvXFxudmFyIHBpQXVkaW9NYW5hZ2VyID0ge1xcbiAgaXNTcGVha2luZzogZmFsc2UsXFxuICBhdWRpb0VsZW1lbnQ6IGF1ZGlvRWxlbWVudCxcXG4gIF91c2VyU3RhcnRlZDogdHJ1ZSxcXG4gIC8vIGZsYWcgdG8gaW5kaWNhdGUgcGxheWJhY2sgaGFzIGJlZW4gc3RhcnRlZCBieSB0aGUgdXNlciAodHJ1ZSBieSBkZWZhdWx0IGJlY2F1c2UgdXNlciBtdXN0IHJlcXVlc3QgaW5pdGlhbCBwbGF5YmFjaylcXG4gIF9pc0xvYWRDYWxsZWQ6IGZhbHNlLFxcbiAgLy8gZmxhZyB0byBpbmRpY2F0ZSBpZiB0aGUgbG9hZCgpIG1ldGhvZCBoYXMgYmVlbiBjYWxsZWQgb24gdGhlIGF1ZGlvIGVsZW1lbnRcXG5cXG4gIGlzTG9hZENhbGxlZDogZnVuY3Rpb24gaXNMb2FkQ2FsbGVkKCkge1xcbiAgICByZXR1cm4gdGhpcy5faXNMb2FkQ2FsbGVkO1xcbiAgfSxcXG4gIHNldElzTG9hZENhbGxlZDogZnVuY3Rpb24gc2V0SXNMb2FkQ2FsbGVkKHZhbHVlKSB7XFxuICAgIHRoaXMuX2lzTG9hZENhbGxlZCA9IHZhbHVlO1xcbiAgfSxcXG4gIHJlbG9hZDogZnVuY3Rpb24gcmVsb2FkKCkge1xcbiAgICBpZiAoIWlzU2FmYXJpKCkpIHtcXG4gICAgICByZXR1cm47XFxuICAgIH1cXG4gICAgdGhpcy5fdXNlclN0YXJ0ZWQgPSB0cnVlOyAvLyBzZXQgYSBmbGFnIHRvIGluZGljYXRlIHBsYXliYWNrIGhhcyBiZWVuIHN0YXJ0ZWQgYnkgdGhlIHVzZXJcXG4gICAgdGhpcy5hdWRpb0VsZW1lbnQubG9hZCgpOyAvLyByZXNldCBmb3IgU2FmYXJpXFxuICAgIHRoaXMuYXVkaW9FbGVtZW50LnBsYXkoKTtcXG4gIH0sXFxuICBhdXRvUGxheTogZnVuY3Rpb24gYXV0b1BsYXkoKSB7XFxuICAgIGlmICghdGhpcy5fdXNlclN0YXJ0ZWQpIHtcXG4gICAgICB0aGlzLmF1ZGlvRWxlbWVudC5wYXVzZSgpO1xcbiAgICAgIEV2ZW50QnVzLmVtaXQoXFxcInNheXBpOnBhdXNlXFxcIik7XFxuICAgIH1cXG4gIH0sXFxuICBzdG9wOiBmdW5jdGlvbiBzdG9wKCkge1xcbiAgICBpZiAodGhpcy5pc1NwZWFraW5nKSB7XFxuICAgICAgdGhpcy5hdWRpb0VsZW1lbnQucGF1c2UoKTtcXG4gICAgfVxcbiAgICBpZiAodGhpcy5hdWRpb0VsZW1lbnQuZHVyYXRpb24gJiYgIXRoaXMuYXVkaW9FbGVtZW50LmVuZGVkICYmIHRoaXMuYXVkaW9FbGVtZW50LmN1cnJlbnRUaW1lIDwgdGhpcy5hdWRpb0VsZW1lbnQuZHVyYXRpb24pIHtcXG4gICAgICB0aGlzLmF1ZGlvRWxlbWVudC5jdXJyZW50VGltZSA9IHRoaXMuYXVkaW9FbGVtZW50LmR1cmF0aW9uOyAvLyBzZWVrIHRoZSBhdWRpbyB0byB0aGUgZW5kXFxuICAgICAgdGhpcy5hdWRpb0VsZW1lbnQucGxheSgpOyAvLyB0cmlnZ2VyIHRoZSBlbmRlZCBldmVudFxcbiAgICB9XFxuICB9LFxcblxcbiAgcGF1c2U6IGZ1bmN0aW9uIHBhdXNlKCkge1xcbiAgICB0aGlzLmF1ZGlvRWxlbWVudC5wYXVzZSgpO1xcbiAgfSxcXG4gIHJlc3VtZTogZnVuY3Rpb24gcmVzdW1lKCkge1xcbiAgICB0aGlzLmF1ZGlvRWxlbWVudC5wbGF5KCk7XFxuICB9LFxcbiAgcGxheWluZzogZnVuY3Rpb24gcGxheWluZygpIHtcXG4gICAgdGhpcy5pc1NwZWFraW5nID0gdHJ1ZTtcXG4gIH0sXFxuICBzdG9wcGVkOiBmdW5jdGlvbiBzdG9wcGVkKCkge1xcbiAgICB0aGlzLmlzU3BlYWtpbmcgPSBmYWxzZTtcXG4gICAgdGhpcy5fdXNlclN0YXJ0ZWQgPSBmYWxzZTtcXG4gIH1cXG59O1xcblxcbi8vIEludGVyY2VwdCBBdXRvcGxheSBFdmVudHMgKGNhbid0IGF1dG9wbGF5IGZ1bGwgYXVkaW8gb24gU2FmYXJpKVxcbmF1ZGlvRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxcXCJwbGF5XFxcIiwgZnVuY3Rpb24gKCkge1xcbiAgaWYgKGlzU2FmYXJpKCkpIHtcXG4gICAgcGlBdWRpb01hbmFnZXIuYXV0b1BsYXkoKTtcXG4gIH1cXG59KTtcXG5hdWRpb0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcXFwibG9hZHN0YXJ0XFxcIiwgZnVuY3Rpb24gKCkge1xcbiAgaWYgKGlzU2FmYXJpKCkpIHtcXG4gICAgLy8gdGVsbCB0aGUgc3RhdGUgbWFjaGluZSB0aGF0IFBpIGlzIHJlYWR5IHRvIHNwZWFrICh3aGlsZSBwYXVzZWQpXFxuICAgIEV2ZW50QnVzLmVtaXQoXFxcInNheXBpOnJlYWR5XFxcIik7XFxuICB9XFxufSk7XFxuXFxuLy8gRXZlbnQgbGlzdGVuZXJzIGZvciBkZXRlY3Rpbmcgd2hlbiBQaSBpcyBzcGVha2luZ1xcbmF1ZGlvRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxcXCJwbGF5aW5nXFxcIiwgZnVuY3Rpb24gKCkge1xcbiAgcGlBdWRpb01hbmFnZXIucGxheWluZygpO1xcbiAgRXZlbnRCdXMuZW1pdChcXFwic2F5cGk6cGlTcGVha2luZ1xcXCIpO1xcbn0pO1xcbmF1ZGlvRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxcXCJwYXVzZVxcXCIsIGZ1bmN0aW9uICgpIHtcXG4gIHBpQXVkaW9NYW5hZ2VyLnN0b3BwZWQoKTtcXG4gIEV2ZW50QnVzLmVtaXQoXFxcInNheXBpOnBpU3RvcHBlZFNwZWFraW5nXFxcIik7XFxufSk7XFxuYXVkaW9FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXFxcImVuZGVkXFxcIiwgZnVuY3Rpb24gKCkge1xcbiAgcGlBdWRpb01hbmFnZXIuc3RvcHBlZCgpO1xcbiAgRXZlbnRCdXMuZW1pdChcXFwic2F5cGk6cGlGaW5pc2hlZFNwZWFraW5nXFxcIik7XFxufSk7XFxuXFxuLy8gYXVkaW8gaW5wdXQgKHVzZXIpXFxudmFyIGF1ZGlvRGF0YUNodW5rcyA9IFtdO1xcbnZhciBhdWRpb01pbWVUeXBlID0gXFxcImF1ZGlvL3dlYm07Y29kZWNzPW9wdXNcXFwiO1xcblxcbi8vIERlY2xhcmUgYSBnbG9iYWwgdmFyaWFibGUgZm9yIHRoZSBtZWRpYVJlY29yZGVyXFxudmFyIG1lZGlhUmVjb3JkZXI7XFxudmFyIHRocmVzaG9sZCA9IDEwMDA7IC8vIDEwMDAgbXMgPSAxIHNlY29uZCwgYWJvdXQgdGhlIGxlbmd0aCBvZiBcXFwiSGV5LCBQaVxcXCJcXG5cXG4vLyBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlICdkYXRhYXZhaWxhYmxlJyBldmVudCBmaXJlc1xcbmZ1bmN0aW9uIGhhbmRsZURhdGFBdmFpbGFibGUoZSkge1xcbiAgLy8gQWRkIHRoZSBhdWRpbyBkYXRhIGNodW5rIHRvIHRoZSBhcnJheVxcbiAgYXVkaW9EYXRhQ2h1bmtzLnB1c2goZS5kYXRhKTtcXG59XFxuXFxuLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSAnc3RvcCcgZXZlbnQgZmlyZXNcXG5mdW5jdGlvbiBoYW5kbGVTdG9wKCkge1xcbiAgLy8gQ3JlYXRlIGEgQmxvYiBmcm9tIHRoZSBhdWRpbyBkYXRhIGNodW5rc1xcbiAgdmFyIGF1ZGlvQmxvYiA9IG5ldyBCbG9iKGF1ZGlvRGF0YUNodW5rcywge1xcbiAgICB0eXBlOiBhdWRpb01pbWVUeXBlXFxuICB9KTtcXG5cXG4gIC8vIEdldCB0aGUgc3RvcCB0aW1lIGFuZCBjYWxjdWxhdGUgdGhlIGR1cmF0aW9uXFxuICB2YXIgc3RvcFRpbWUgPSBEYXRlLm5vdygpO1xcbiAgdmFyIGR1cmF0aW9uID0gc3RvcFRpbWUgLSB3aW5kb3cuc3RhcnRUaW1lO1xcblxcbiAgLy8gSWYgdGhlIGR1cmF0aW9uIGlzIGdyZWF0ZXIgdGhhbiB0aGUgdGhyZXNob2xkLCB1cGxvYWQgdGhlIGF1ZGlvIGZvciB0cmFuc2NyaXB0aW9uXFxuICBpZiAoZHVyYXRpb24gPj0gdGhyZXNob2xkKSB7XFxuICAgIC8vIFVwbG9hZCB0aGUgYXVkaW8gdG8gdGhlIHNlcnZlciBmb3IgdHJhbnNjcmlwdGlvblxcbiAgICBFdmVudEJ1cy5lbWl0KFxcXCJzYXlwaTp1c2VyRmluaXNoZWRTcGVha2luZ1xcXCIsIHtcXG4gICAgICBkdXJhdGlvbjogZHVyYXRpb24sXFxuICAgICAgYmxvYjogYXVkaW9CbG9iXFxuICAgIH0pO1xcbiAgfVxcblxcbiAgLy8gQ2xlYXIgdGhlIGFycmF5IGZvciB0aGUgbmV4dCByZWNvcmRpbmdcXG4gIGF1ZGlvRGF0YUNodW5rcyA9IFtdO1xcbn1cXG5mdW5jdGlvbiBzZXR1cFJlY29yZGluZyhjYWxsYmFjaykge1xcbiAgaWYgKG1lZGlhUmVjb3JkZXIpIHtcXG4gICAgcmV0dXJuO1xcbiAgfVxcblxcbiAgLy8gR2V0IGEgc3RyZWFtIGZyb20gdGhlIHVzZXIncyBtaWNyb3Bob25lXFxuICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSh7XFxuICAgIGF1ZGlvOiB0cnVlXFxuICB9KS50aGVuKGZ1bmN0aW9uIChzdHJlYW0pIHtcXG4gICAgaWYgKCFNZWRpYVJlY29yZGVyLmlzVHlwZVN1cHBvcnRlZChhdWRpb01pbWVUeXBlKSkge1xcbiAgICAgIC8vIHVzZSBNUDQgZm9yIFNhZmFyaVxcbiAgICAgIGF1ZGlvTWltZVR5cGUgPSBcXFwiYXVkaW8vbXA0XFxcIjtcXG4gICAgfVxcbiAgICAvLyBDcmVhdGUgYSBuZXcgTWVkaWFSZWNvcmRlciBvYmplY3QgdXNpbmcgdGhlIHN0cmVhbSBhbmQgc3BlY2lmeWluZyB0aGUgTUlNRSB0eXBlXFxuICAgIHZhciBvcHRpb25zID0ge1xcbiAgICAgIG1pbWVUeXBlOiBhdWRpb01pbWVUeXBlXFxuICAgIH07XFxuICAgIG1lZGlhUmVjb3JkZXIgPSBuZXcgTWVkaWFSZWNvcmRlcihzdHJlYW0sIG9wdGlvbnMpO1xcblxcbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSAnZGF0YWF2YWlsYWJsZScgZXZlbnRcXG4gICAgbWVkaWFSZWNvcmRlci5hZGRFdmVudExpc3RlbmVyKFxcXCJkYXRhYXZhaWxhYmxlXFxcIiwgaGFuZGxlRGF0YUF2YWlsYWJsZSk7XFxuXFxuICAgIC8vIExpc3RlbiBmb3IgdGhlICdzdG9wJyBldmVudFxcbiAgICBtZWRpYVJlY29yZGVyLmFkZEV2ZW50TGlzdGVuZXIoXFxcInN0b3BcXFwiLCBoYW5kbGVTdG9wKTtcXG4gIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xcbiAgICAvLyBJbnZva2UgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uXFxuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFxcXCJmdW5jdGlvblxcXCIpIHtcXG4gICAgICBjYWxsYmFjaygpO1xcbiAgICB9XFxuICB9KVtcXFwiY2F0Y2hcXFwiXShmdW5jdGlvbiAoZXJyKSB7XFxuICAgIGNvbnNvbGUuZXJyb3IoXFxcIkVycm9yIGdldHRpbmcgYXVkaW8gc3RyZWFtOiBcXFwiICsgZXJyKTtcXG4gIH0pO1xcbn1cXG5mdW5jdGlvbiB0ZWFyRG93blJlY29yZGluZygpIHtcXG4gIC8vIENoZWNrIGlmIHRoZSBNZWRpYVJlY29yZGVyIGlzIHNldCB1cFxcbiAgaWYgKCFtZWRpYVJlY29yZGVyKSB7XFxuICAgIHJldHVybjtcXG4gIH1cXG5cXG4gIC8vIFN0b3AgYW55IG9uZ29pbmcgcmVjb3JkaW5nXFxuICBpZiAobWVkaWFSZWNvcmRlci5zdGF0ZSA9PT0gXFxcInJlY29yZGluZ1xcXCIpIHtcXG4gICAgbWVkaWFSZWNvcmRlci5zdG9wKCk7XFxuICB9XFxuXFxuICAvLyBSZW1vdmUgdGhlIE1lZGlhUmVjb3JkZXIncyBldmVudCBsaXN0ZW5lcnNcXG4gIG1lZGlhUmVjb3JkZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihcXFwiZGF0YWF2YWlsYWJsZVxcXCIsIGhhbmRsZURhdGFBdmFpbGFibGUpO1xcbiAgbWVkaWFSZWNvcmRlci5yZW1vdmVFdmVudExpc3RlbmVyKFxcXCJzdG9wXFxcIiwgaGFuZGxlU3RvcCk7XFxuXFxuICAvLyBDbGVhciB0aGUgTWVkaWFSZWNvcmRlciB2YXJpYWJsZVxcbiAgbWVkaWFSZWNvcmRlciA9IG51bGw7XFxufVxcblxcbi8vIFRvIHJlcXVlc3QgcmVjb3JkaW5nLCBvdGhlciBtb2R1bGVzIGNhbiBkaXNwYXRjaCBhIGN1c3RvbSBldmVudCBhdWRpbzpzdGFydFJlY29yZGluZ1xcbmZ1bmN0aW9uIHN0YXJ0UmVjb3JkaW5nKCkge1xcbiAgLy8gQ2hlY2sgaWYgdGhlIE1lZGlhUmVjb3JkZXIgaXMgc2V0IHVwXFxuICBpZiAoIW1lZGlhUmVjb3JkZXIpIHtcXG4gICAgc2V0dXBSZWNvcmRpbmcoc3RhcnRSZWNvcmRpbmcpO1xcbiAgICByZXR1cm47XFxuICB9XFxuICAvLyBDaGVjayBpZiBQaSBpcyBjdXJyZW50bHkgc3BlYWtpbmcgYW5kIHN0b3AgaGVyIGF1ZGlvXFxuICBpZiAocGlBdWRpb01hbmFnZXIuaXNTcGVha2luZykge1xcbiAgICBwaUF1ZGlvTWFuYWdlci5wYXVzZSgpO1xcbiAgfVxcblxcbiAgLy8gU3RhcnQgcmVjb3JkaW5nXFxuICBtZWRpYVJlY29yZGVyLnN0YXJ0KCk7XFxuXFxuICAvLyBSZWNvcmQgdGhlIHN0YXJ0IHRpbWVcXG4gIHdpbmRvdy5zdGFydFRpbWUgPSBEYXRlLm5vdygpO1xcbiAgRXZlbnRCdXMuZW1pdChcXFwic2F5cGk6dXNlclNwZWFraW5nXFxcIik7XFxufVxcblxcbi8vIFRvIHN0b3AgcmVjb3JkaW5nLCBvdGhlciBtb2R1bGVzIGNhbiBkaXNwYXRjaCBhIGN1c3RvbSBldmVudCBhdWRpbzpzdG9wUmVjb3JkaW5nXFxuZnVuY3Rpb24gc3RvcFJlY29yZGluZygpIHtcXG4gIGlmIChtZWRpYVJlY29yZGVyICYmIG1lZGlhUmVjb3JkZXIuc3RhdGUgPT09IFxcXCJyZWNvcmRpbmdcXFwiKSB7XFxuICAgIC8vIFN0b3AgcmVjb3JkaW5nXFxuICAgIG1lZGlhUmVjb3JkZXIuc3RvcCgpO1xcblxcbiAgICAvLyBSZWNvcmQgdGhlIHN0b3AgdGltZSBhbmQgY2FsY3VsYXRlIHRoZSBkdXJhdGlvblxcbiAgICB2YXIgc3RvcFRpbWUgPSBEYXRlLm5vdygpO1xcbiAgICB2YXIgZHVyYXRpb24gPSBzdG9wVGltZSAtIHdpbmRvdy5zdGFydFRpbWU7XFxuXFxuICAgIC8vIElmIHRoZSBkdXJhdGlvbiBpcyBsZXNzIHRoYW4gdGhlIHRocmVzaG9sZCwgZG9uJ3QgdXBsb2FkIHRoZSBhdWRpbyBmb3IgdHJhbnNjcmlwdGlvblxcbiAgICBpZiAoZHVyYXRpb24gPCB0aHJlc2hvbGQpIHtcXG4gICAgICBjb25zb2xlLmxvZyhcXFwiUmVjb3JkaW5nIHdhcyB0b28gc2hvcnQsIG5vdCB1cGxvYWRpbmcgZm9yIHRyYW5zY3JpcHRpb25cXFwiKTtcXG4gICAgICBFdmVudEJ1cy5lbWl0KFxcXCJzYXlwaTp1c2VyU3RvcHBlZFNwZWFraW5nXFxcIiwge1xcbiAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uXFxuICAgICAgfSk7XFxuICAgICAgcGlBdWRpb01hbmFnZXIucmVzdW1lKCk7XFxuICAgIH0gZWxzZSB7XFxuICAgICAgcGlBdWRpb01hbmFnZXIuc3RvcCgpO1xcbiAgICB9XFxuICB9XFxufVxcblxcbi8qIFRoZXNlIGV2ZW50cyBhcmUgdXNlZCB0byBjb250cm9sL3Bhc3MgcmVxdWVzdHMgdG8gdGhlIGF1ZGlvIG1vZHVsZSBmcm9tIG90aGVyIG1vZHVsZXMgKi9cXG5mdW5jdGlvbiByZWdpc3RlckN1c3RvbUF1ZGlvRXZlbnRMaXN0ZW5lcnMoKSB7XFxuICBFdmVudEJ1cy5vbihcXFwiYXVkaW86c2V0dXBSZWNvcmRpbmdcXFwiLCBmdW5jdGlvbiAoZSkge1xcbiAgICBzZXR1cFJlY29yZGluZygpO1xcbiAgfSk7XFxuICBFdmVudEJ1cy5vbihcXFwiYXVkaW86dGVhckRvd25SZWNvcmRpbmdcXFwiLCBmdW5jdGlvbiAoZSkge1xcbiAgICB0ZWFyRG93blJlY29yZGluZygpO1xcbiAgfSk7XFxuICBFdmVudEJ1cy5vbihcXFwiYXVkaW86c3RhcnRSZWNvcmRpbmdcXFwiLCBmdW5jdGlvbiAoZSkge1xcbiAgICBzdGFydFJlY29yZGluZygpO1xcbiAgfSk7XFxuICBFdmVudEJ1cy5vbihcXFwiYXVkaW86c3RvcFJlY29yZGluZ1xcXCIsIGZ1bmN0aW9uIChlKSB7XFxuICAgIHN0b3BSZWNvcmRpbmcoKTtcXG4gIH0pO1xcbiAgRXZlbnRCdXMub24oXFxcImF1ZGlvOnJlbG9hZFxcXCIsIGZ1bmN0aW9uIChlKSB7XFxuICAgIHBpQXVkaW9NYW5hZ2VyLnJlbG9hZCgpO1xcbiAgfSk7XFxufVxcbnJlZ2lzdGVyQ3VzdG9tQXVkaW9FdmVudExpc3RlbmVycygpO1wiOyIsImV4cG9ydCBkZWZhdWx0IFwiPD94bWwgdmVyc2lvbj1cXFwiMS4wXFxcIiBlbmNvZGluZz1cXFwiVVRGLThcXFwiPz5cXG48c3ZnIGlkPVxcXCJMYXllcl8xXFxcIiBkYXRhLW5hbWU9XFxcIkxheWVyIDFcXFwiIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDY0LjA2IDY0LjMzXFxcIj5cXG4gIDxkZWZzPlxcbiAgICA8c3R5bGU+XFxuICAgICAgLmNscy0xIHtcXG4gICAgICAgIGZpbGw6ICMyNDM4MWI7XFxuICAgICAgfVxcblxcbiAgICAgIC5jbHMtMSwgLmNscy0yIHtcXG4gICAgICAgIHN0cm9rZS13aWR0aDogMHB4O1xcbiAgICAgIH1cXG5cXG4gICAgICAuY2xzLTIge1xcbiAgICAgICAgZmlsbDogI2RmZDdjMjtcXG4gICAgICB9XFxuICAgIDwvc3R5bGU+XFxuICA8L2RlZnM+XFxuICA8cGF0aCBjbGFzcz1cXFwiY2xzLTJcXFwiIGQ9XFxcIm0zMS43MSw2NC4zMkMxNC43Nyw2NC40Ni0uNDQsNDkuOTMsMCwzMS4zMy40MSwxNC40NywxNC4yOS0uMzIsMzIuNywwYzE2LjkxLjMsMzEuOCwxNC4zMiwzMS4zNiwzMy4xNC0uMzksMTYuNzYtMTQuNDksMzEuNTUtMzIuMzQsMzEuMThabTEwLjY3LTIzLjE5Yy4wNi0uNy0uNDEtMS4xMi0uODQtMS41NS0yLTItMy45NC00LjA3LTYuMDItNS45Ny0xLjE0LTEuMDQtMS4zMi0xLjY4LS4wNi0yLjgyLDIuMTMtMS45Myw0LjA3LTQuMDgsNi4xLTYuMTIuNzgtLjc5LDEuMzEtMS42NC4zNC0yLjU2LS45Mi0uODctMS43Mi0uMjgtMi40My40NS0yLjE3LDIuMjEtNC4zOSw0LjM5LTYuNTIsNi42NS0uNzIuNzctMS4xNi43LTEuODQtLjAyLTIuMDYtMi4xNy00LjE5LTQuMjgtNi4yOS02LjQxLS43Ni0uNzctMS41OS0xLjY4LTIuNjYtLjYzLTEuMTQsMS4xMi0uMTksMS45OC42MiwyLjc5LDIuMDcsMi4wOSw0LjA5LDQuMjIsNi4yLDYuMjYuNzcuNzUuODIsMS4yLjAyLDEuOTctMi4yMSwyLjEtNC4zMyw0LjMtNi40OSw2LjQ1LS43OS43OC0xLjMsMS42NS0uMzIsMi41Ni45Mi44NSwxLjcxLjI2LDIuNDMtLjQ3LDIuMTEtMi4xMiw0LjI4LTQuMTksNi4zMy02LjM4Ljg4LS45NCwxLjM3LS44NiwyLjIxLjAzLDIuMTMsMi4yNiw0LjM3LDQuNDEsNi41Nyw2LjYuNTEuNTEsMS4wOS43OCwxLjguNDguNTYtLjI0Ljg1LS42OC44Ny0xLjNaXFxcIi8+XFxuICA8cGF0aCBjbGFzcz1cXFwiY2xzLTFcXFwiIGQ9XFxcIm00Mi40Nyw0MS4yN2MtLjAyLjYyLS4zMiwxLjA2LS44NywxLjMtLjcxLjMxLTEuMjkuMDMtMS44LS40OC0yLjItMi4yLTQuNDQtNC4zNS02LjU3LTYuNi0uODQtLjg5LTEuMzMtLjk2LTIuMjEtLjAzLTIuMDQsMi4xOS00LjIyLDQuMjUtNi4zMyw2LjM4LS43Mi43Mi0xLjUxLDEuMzItMi40My40Ny0uOTgtLjkxLS40Ny0xLjc4LjMyLTIuNTYsMi4xNi0yLjE1LDQuMjgtNC4zNSw2LjQ5LTYuNDUuODEtLjc3Ljc2LTEuMjItLjAyLTEuOTctMi4xMS0yLjA0LTQuMTMtNC4xNy02LjItNi4yNi0uOC0uODEtMS43NS0xLjY3LS42Mi0yLjc5LDEuMDctMS4wNSwxLjktLjE0LDIuNjYuNjMsMi4xLDIuMTMsNC4yMyw0LjI0LDYuMjksNi40MS42OS43MywxLjEyLjc5LDEuODQuMDIsMi4xMy0yLjI2LDQuMzUtNC40Myw2LjUyLTYuNjUuNzItLjczLDEuNTEtMS4zMSwyLjQzLS40NS45Ny45Mi40NCwxLjc4LS4zNCwyLjU2LTIuMDMsMi4wNC0zLjk3LDQuMTktNi4xLDYuMTItMS4yNSwxLjE0LTEuMDgsMS43OC4wNiwyLjgyLDIuMDksMS45MSw0LjAyLDMuOTcsNi4wMiw1Ljk3LjQzLjQzLjkuODUuODQsMS41NVpcXFwiLz5cXG48L3N2Zz5cIjsiLCJleHBvcnQgZGVmYXVsdCBcIjxzdmcgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiB4bWxuczp4bGluaz1cXFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1xcXCIgem9vbUFuZFBhbj1cXFwibWFnbmlmeVxcXCIgdmlld0JveD1cXFwiMCAwIDc2OCA3NjcuOTk5OTk0XFxcIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPVxcXCJ4TWlkWU1pZCBtZWV0XFxcIiB2ZXJzaW9uPVxcXCIxLjBcXFwiPjxwYXRoIGZpbGw9XFxcIiNlNGQ4YzFcXFwiIGQ9XFxcIk0gNzY4LjEzMjgxMiAzNzkuNTM1MTU2IEMgNzY4LjEzMjgxMiAxNjkuMDg5ODQ0IDU5Ny41MjM0MzggLTEuNDk2MDk0IDM4Ny4wNTA3ODEgLTEuNDk2MDk0IEMgMTc2LjYwOTM3NSAtMS40OTYwOTQgNS45OTYwOTQgMTY5LjA4OTg0NCA1Ljk5NjA5NCAzNzkuNTM1MTU2IEMgNS45OTYwOTQgNTg5Ljk0OTIxOSAxNzYuNjA5Mzc1IDc2MC41MzkwNjIgMzg3LjA1MDc4MSA3NjAuNTM5MDYyIEMgNTk3LjUyMzQzOCA3NjAuNTM5MDYyIDc2OC4xMzI4MTIgNTg5Ljk0OTIxOSA3NjguMTMyODEyIDM3OS41MzUxNTYgXFxcIiBmaWxsLW9wYWNpdHk9XFxcIjFcXFwiIGZpbGwtcnVsZT1cXFwibm9uemVyb1xcXCIvPjxwYXRoIGZpbGw9XFxcIiM3NzZkNmRcXFwiIGQ9XFxcIk0gNTM4Ljk5NjA5NCAyMjMuMTUyMzQ0IEwgMzA2LjUzNTE1NiAyMjkuODU1NDY5IEwgNTM4Ljk5NjA5NCA0NTUuNjk1MzEyIFogTSA1MzguOTk2MDk0IDIyMy4xNTIzNDQgXFxcIiBmaWxsLW9wYWNpdHk9XFxcIjFcXFwiIGZpbGwtcnVsZT1cXFwibm9uemVyb1xcXCIvPjxwYXRoIGZpbGw9XFxcIiM3NzZkNmRcXFwiIGQ9XFxcIk0gMjM1LjEwNTQ2OSA1MzUuODkwNjI1IEwgNDY3LjU5NzY1NiA1MjkuMTg3NSBMIDIzNS4xMDU0NjkgMzAzLjM0Mzc1IFogTSAyMzUuMTA1NDY5IDUzNS44OTA2MjUgXFxcIiBmaWxsLW9wYWNpdHk9XFxcIjFcXFwiIGZpbGwtcnVsZT1cXFwibm9uemVyb1xcXCIvPjwvc3ZnPlwiOyIsImV4cG9ydCBkZWZhdWx0IFwiPHN2ZyB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHhtbG5zOnhsaW5rPVxcXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXFxcIiB3aWR0aD1cXFwiNTAwXFxcIiB6b29tQW5kUGFuPVxcXCJtYWduaWZ5XFxcIiB2aWV3Qm94PVxcXCIwIDAgMzc1IDM3NC45OTk5OTFcXFwiIGhlaWdodD1cXFwiNTAwXFxcIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPVxcXCJ4TWlkWU1pZCBtZWV0XFxcIiB2ZXJzaW9uPVxcXCIxLjBcXFwiPjxwYXRoIGZpbGw9XFxcIiM3NzZkNmRcXFwiIGQ9XFxcIk0gMjM5LjcyMjY1NiAxMjYuNDQxNDA2IEwgMjM5LjcyMjY1NiAxMjIuMzAwNzgxIEMgMjM5LjcyMjY1NiA5My41MDc4MTIgMjE2LjI5Njg3NSA3MC4wNzgxMjUgMTg3LjUgNzAuMDc4MTI1IEMgMTU4LjcwMzEyNSA3MC4wNzgxMjUgMTM1LjI3NzM0NCA5My41MDc4MTIgMTM1LjI3NzM0NCAxMjIuMzAwNzgxIEwgMTM1LjI3NzM0NCAxODcuOTUzMTI1IEMgMTM1LjI3NzM0NCAxOTkuOTg4MjgxIDEzOS40MTAxNTYgMjExLjA1MDc4MSAxNDYuMjczNDM4IDIxOS44OTA2MjUgWiBNIDIzOS43MjI2NTYgMTI2LjQ0MTQwNiBcXFwiIGZpbGwtb3BhY2l0eT1cXFwiMVxcXCIgZmlsbC1ydWxlPVxcXCJub256ZXJvXFxcIi8+PHBhdGggZmlsbD1cXFwiIzc3NmQ2ZFxcXCIgZD1cXFwiTSAxNTUuMDQ2ODc1IDIyOC43OTI5NjkgQyAxNjMuOTY0ODQ0IDIzNS44OTg0MzggMTc1LjIzNDM3NSAyNDAuMTc1NzgxIDE4Ny41IDI0MC4xNzU3ODEgQyAyMTYuMjk2ODc1IDI0MC4xNzU3ODEgMjM5LjcyMjY1NiAyMTYuNzUgMjM5LjcyMjY1NiAxODcuOTUzMTI1IEwgMjM5LjcyMjY1NiAxNDQuMTEzMjgxIFogTSAxNTUuMDQ2ODc1IDIyOC43OTI5NjkgXFxcIiBmaWxsLW9wYWNpdHk9XFxcIjFcXFwiIGZpbGwtcnVsZT1cXFwibm9uemVyb1xcXCIvPjxwYXRoIGZpbGw9XFxcIiM3NzZkNmRcXFwiIGQ9XFxcIk0gMTg3LjUgMCBDIDgzLjk0NTMxMiAwIDAgODMuOTQ1MzEyIDAgMTg3LjUgQyAwIDI5MS4wNTQ2ODggODMuOTQ1MzEyIDM3NSAxODcuNSAzNzUgQyAyOTEuMDU0Njg4IDM3NSAzNzUgMjkxLjA1NDY4OCAzNzUgMTg3LjUgQyAzNzUgODMuOTQ1MzEyIDI5MS4wNTQ2ODggMCAxODcuNSAwIFogTSAyODcuNDg0Mzc1IDk2LjM1NTQ2OSBMIDI1NC42NDA2MjUgMTI5LjE5NTMxMiBMIDI1NC42NDA2MjUgMTg3Ljk1MzEyNSBDIDI1NC42NDA2MjUgMjI0Ljk3NjU2MiAyMjQuNTIzNDM4IDI1NS4wOTc2NTYgMTg3LjUgMjU1LjA5NzY1NiBDIDE3MS4xMTcxODggMjU1LjA5NzY1NiAxNTYuMTA1NDY5IDI0OS4xODM1OTQgMTQ0LjQzNzUgMjM5LjQwMjM0NCBMIDEzOC4xMDkzNzUgMjQ1LjczMDQ2OSBDIDE1MS40MTc5NjkgMjU3LjEyMTA5NCAxNjguNjUyMzQ0IDI2NC4wNDY4NzUgMTg3LjUgMjY0LjA0Njg3NSBDIDIyOS40NTcwMzEgMjY0LjA0Njg3NSAyNjMuNTkzNzUgMjI5LjkxNDA2MiAyNjMuNTkzNzUgMTg3Ljk1MzEyNSBDIDI2My41OTM3NSAxODMuODMyMDMxIDI2Ni45MzM1OTQgMTgwLjQ5NjA5NCAyNzEuMDU0Njg4IDE4MC40OTYwOTQgQyAyNzUuMTc1NzgxIDE4MC40OTYwOTQgMjc4LjUxNTYyNSAxODMuODM1OTM4IDI3OC41MTU2MjUgMTg3Ljk1MzEyNSBDIDI3OC41MTU2MjUgMjM1LjYyNSAyNDEuNjY3OTY5IDI3NC44MjgxMjUgMTk0Ljk2MDkzOCAyNzguNjQwNjI1IEwgMTk0Ljk2MDkzOCAzMDQuOTIxODc1IEwgMjIwLjEyMTA5NCAzMDQuOTIxODc1IEMgMjI0LjI0MjE4OCAzMDQuOTIxODc1IDIyNy41ODIwMzEgMzA4LjI2MTcxOSAyMjcuNTgyMDMxIDMxMi4zODI4MTIgQyAyMjcuNTgyMDMxIDMxNi41IDIyNC4yNDIxODggMzE5LjgzOTg0NCAyMjAuMTIxMDk0IDMxOS44Mzk4NDQgTCAxNTQuODc1IDMxOS44Mzk4NDQgQyAxNTAuNzU3ODEyIDMxOS44Mzk4NDQgMTQ3LjQxNzk2OSAzMTYuNSAxNDcuNDE3OTY5IDMxMi4zODI4MTIgQyAxNDcuNDE3OTY5IDMwOC4yNjE3MTkgMTUwLjc1NzgxMiAzMDQuOTIxODc1IDE1NC44NzUgMzA0LjkyMTg3NSBMIDE4MC4wMzkwNjIgMzA0LjkyMTg3NSBMIDE4MC4wMzkwNjIgMjc4LjYzNjcxOSBDIDE2MC4wMDc4MTIgMjc3LjAwMzkwNiAxNDEuODE2NDA2IDI2OC44MjQyMTkgMTI3LjU0Mjk2OSAyNTYuMjk2ODc1IEwgOTYuMzUxNTYyIDI4Ny40ODQzNzUgQyA5NS4xMzI4MTIgMjg4LjcwMzEyNSA5My41MzEyNSAyODkuMzE2NDA2IDkxLjkzMzU5NCAyODkuMzE2NDA2IEMgOTAuMzM1OTM4IDI4OS4zMTY0MDYgODguNzM0Mzc1IDI4OC43MDMxMjUgODcuNTE1NjI1IDI4Ny40ODQzNzUgQyA4NS4wNzQyMTkgMjg1LjA0Mjk2OSA4NS4wNzQyMTkgMjgxLjA4NTkzOCA4Ny41MTU2MjUgMjc4LjY0NDUzMSBMIDExOC43NjE3MTkgMjQ3LjM5ODQzOCBDIDEwNC45Mjk2ODggMjMxLjQzNzUgOTYuNDg0Mzc1IDIxMC42ODc1IDk2LjQ4NDM3NSAxODcuOTUzMTI1IEMgOTYuNDg0Mzc1IDE4My44MzIwMzEgOTkuODI0MjE5IDE4MC40OTYwOTQgMTAzLjk0MTQwNiAxODAuNDk2MDk0IEMgMTA4LjA2MjUgMTgwLjQ5NjA5NCAxMTEuNDAyMzQ0IDE4My44MzU5MzggMTExLjQwMjM0NCAxODcuOTUzMTI1IEMgMTExLjQwMjM0NCAyMDYuNTc0MjE5IDExOC4xNDg0MzggMjIzLjYyODkwNiAxMjkuMjkyOTY5IDIzNi44NjcxODggTCAxMzUuNjI4OTA2IDIzMC41MzEyNSBDIDEyNi4wODk4NDQgMjE4LjkzNzUgMTIwLjM1NTQ2OSAyMDQuMTA1NDY5IDEyMC4zNTU0NjkgMTg3Ljk1MzEyNSBMIDEyMC4zNTU0NjkgMTIyLjMwMDc4MSBDIDEyMC4zNTU0NjkgODUuMjgxMjUgMTUwLjQ3NjU2MiA1NS4xNjAxNTYgMTg3LjQ5NjA5NCA1NS4xNjAxNTYgQyAyMjEuMTI4OTA2IDU1LjE2MDE1NiAyNDguOTgwNDY5IDgwLjAzOTA2MiAyNTMuODE2NDA2IDExMi4zNDM3NSBMIDI3OC42NDA2MjUgODcuNTE1NjI1IEMgMjgxLjA4MjAzMSA4NS4wNzgxMjUgMjg1LjAzOTA2MiA4NS4wNzgxMjUgMjg3LjQ4MDQ2OSA4Ny41MTU2MjUgQyAyODkuOTI1NzgxIDg5Ljk1NzAzMSAyODkuOTI1NzgxIDkzLjkxNDA2MiAyODcuNDg0Mzc1IDk2LjM1NTQ2OSBaIE0gMjg3LjQ4NDM3NSA5Ni4zNTU0NjkgXFxcIiBmaWxsLW9wYWNpdHk9XFxcIjFcXFwiIGZpbGwtcnVsZT1cXFwibm9uemVyb1xcXCIvPjwvc3ZnPlwiOyIsImV4cG9ydCBkZWZhdWx0IFwiPD94bWwgdmVyc2lvbj1cXFwiMS4wXFxcIiBlbmNvZGluZz1cXFwiVVRGLThcXFwiPz5cXG48c3ZnIGlkPVxcXCJMYXllcl8xXFxcIiBkYXRhLW5hbWU9XFxcIkxheWVyIDFcXFwiIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDMwNyA2NDBcXFwiPlxcbiAgPGRlZnM+XFxuICAgIDxzdHlsZT5cXG4gICAgICAuaW5uZXJtb3N0LCAuc2Vjb25kLCAudGhpcmQsIC5mb3VydGgsIC5maWZ0aCwgLm91dGVybW9zdCB7XFxuICAgICAgICBzdHJva2Utd2lkdGg6IDBweDtcXG4gICAgICB9XFxuICAgICAgXFxuICAgICAgLm91dGVybW9zdCB7XFxuICAgICAgICBmaWxsOiAjZTRmMmQxO1xcbiAgICAgIH1cXG5cXG4gICAgICAuc2Vjb25kIHtcXG4gICAgICAgIGZpbGw6ICNjY2U4YjU7XFxuICAgICAgfVxcblxcbiAgICAgIC50aGlyZCB7XFxuICAgICAgICBmaWxsOiAjYjNkYjk1O1xcbiAgICAgIH1cXG5cXG4gICAgICAuZm91cnRoIHtcXG4gICAgICAgIGZpbGw6ICM5YmQwNzg7XFxuICAgICAgfVxcblxcbiAgICAgIC5maWZ0aCB7XFxuICAgICAgICBmaWxsOiAjODNjNTVjO1xcbiAgICAgIH1cXG5cXG4gICAgICAuaW5uZXJtb3N0IHtcXG4gICAgICAgIGZpbGw6ICM0MjhhMmY7XFxuICAgICAgfVxcbiAgICA8L3N0eWxlPlxcbiAgPC9kZWZzPlxcbiAgPHBhdGggY2xhc3M9XFxcIm91dGVybW9zdFxcXCIgZD1cXFwibTMwNi45LDMyMGMwLDEwNS4zLS4wMiwyMTAuNi4xLDMxNS45MSwwLDMuNDItLjY3LDQuMS00LjA5LDQuMDktOTkuNi0uMTItMTk5LjIxLS4xMi0yOTguODEsMEMuNjcsNjQwLDAsNjM5LjMzLDAsNjM1LjkxLjExLDQyNS4zLjExLDIxNC43LDAsNC4wOSwwLC42Ny42NywwLDQuMDksMCwxMDMuNy4xMiwyMDMuMy4xMiwzMDIuOTEsMGMzLjQyLDAsNC4xLjY3LDQuMDksNC4wOS0uMTIsMTA1LjMtLjEsMjEwLjYtLjEsMzE1LjkxWlxcXCIvPlxcbiAgPHBhdGggY2xhc3M9XFxcInNlY29uZFxcXCIgZD1cXFwibTI3NS45MiwzMjNjMCw4Ny42MywwLDE3NS4yNywwLDI2Mi45LDAsNy4yNC0uNTUsNy45My03Ljg2LDcuOTgtMTQuNjYuMDktMjkuMzEuMDMtNDMuOTcuMDMtNjAuOTYsMC0xMjEuOTIsMC0xODIuODgsMHEtNy4xMywwLTcuMTQtNy4yNGMwLTE3Ni4xLDAtMzUyLjIxLDAtNTI4LjMxcTAtNy4yNiw3LjEyLTcuMjZjNzUuNzgsMCwxNTEuNTYsMCwyMjcuMzUsMHE3LjM4LDAsNy4zOCw3LjVjMCw4OC4xMywwLDE3Ni4yNywwLDI2NC40WlxcXCIvPlxcbiAgPHBhdGggY2xhc3M9XFxcInRoaXJkXFxcIiBkPVxcXCJtNjguMDYsMzIyLjI0YzAtNjkuNDcsMC0xMzguOTQsMC0yMDguNDEsMC04Ljk5LDEuMzMtMTAuMTMsMTAuNDktOS4xMiwxLjk4LjIyLDMuOTguMzIsNS45Ny4zMiw0Ni4xMy4wMiw5Mi4yNi4wMiwxMzguMzksMCwzLjQ4LDAsNi45Mi0uMjMsMTAuNDEtLjY3LDUuNS0uNyw4Ljc0LjQ2LDguNzMsNy4yNS0uMTgsMTM4Ljk0LS4xMywyNzcuODgtLjEzLDQxNi44MSwwLC4zMywwLC42NywwLDFxLS4xNCwxMC41MS0xMC4zOSwxMC41MWMtNTIuMTMsMC0xMDQuMjUsMC0xNTYuMzgsMHEtNy4wOSwwLTcuMDktNy4yOGMwLTcwLjE0LDAtMTQwLjI3LDAtMjEwLjQxWlxcXCIvPlxcbiAgPHBhdGggY2xhc3M9XFxcImZvdXJ0aFxcXCIgZD1cXFwibTEwMy4wMiwzMjIuNWMwLTUyLjQ2LDAtMTA0LjkxLDAtMTU3LjM3LDAtNi42OC4zNi03LjA2LDcuMDctNy4wNiwzMC4zLS4wMSw2MC42LjA3LDkwLjktLjA5LDQuNTQtLjAyLDYuMDgsMS4zMyw2LjA3LDUuOTgtLjEsMTA1LjU4LS4xLDIxMS4xNiwwLDMxNi43NCwwLDQuMTgtMS4yNyw1LjM3LTUuMzgsNS4zNS0yOS4zLS4xNS01OC42LS4wOC04Ny45LS4wOHEtMTAuNzYsMC0xMC43Ni0xMS4wOWMwLTUwLjc5LDAtMTAxLjU4LDAtMTUyLjM3WlxcXCIvPlxcbiAgPHBhdGggY2xhc3M9XFxcImZpZnRoXFxcIiBkPVxcXCJtMTczLDMyMi4yYzAsMzUuMjksMCw3MC41OCwwLDEwNS44OHEwLDYuODktNi45OSw2LjljLTguMTUsMC0xNi4zMS0uMTMtMjQuNDYuMDYtMy40Ny4wOC00LjY4LTEuMDktNC42MS00LjU5LjE4LTkuNjUuMDYtMTkuMzEuMDYtMjguOTYsMC01OC4yNi0uMDEtMTE2LjUzLjAyLTE3NC43OSwwLTQuNzYtMS4xMi05LjQ2LS4xNC0xNC4zLjUxLTIuNTQsMS4zOS0zLjM4LDMuOC0zLjM2LDguODIuMDYsMTcuNjQuMTQsMjYuNDYtLjAyLDQuNTktLjA5LDUuOTUsMS44NSw1Ljk0LDYuMzMtLjE0LDM1LjYyLS4wOCw3MS4yNS0uMDgsMTA2Ljg3WlxcXCIvPlxcbiAgPHBhdGggY2xhc3M9XFxcImlubmVybW9zdFxcXCIgZD1cXFwibTE1MS4wNCwzMjIuMDFjMC05Ljk5LjA3LTE5Ljk3LS4wNS0yOS45Ni0uMDQtMi45My44My00LjE4LDMuOTUtNC4xOCwzLjA2LDAsNC4wMywxLjEyLDQuMDIsNC4xMS0uMDksMTkuOTctLjA4LDM5Ljk0LjAxLDU5LjkxLjAxLDIuOTYtLjg0LDQuMTYtMy45Niw0LjE0LTMuMDMtLjAxLTQuMDgtMS4wNC00LjAzLTQuMDguMTQtOS45OC4wNS0xOS45Ny4wNS0yOS45NlpcXFwiLz5cXG48L3N2Zz5cIjsiLCJleHBvcnQgZGVmYXVsdCBcIjxzdmcgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiB2ZXJzaW9uPVxcXCIxLjBcXFwiIHZpZXdCb3g9XFxcIjAgMCA1Ni4yNSAzMFxcXCIgY2xhc3M9XFxcIndhdmVmb3JtXFxcIj5cXG4gICAgPGRlZnM+XFxuICAgICAgICA8Y2xpcFBhdGggaWQ9XFxcImFcXFwiPlxcbiAgICAgICAgICAgIDxwYXRoIGQ9XFxcIk0uNTQgMTJIM3Y1SC41NFptMCAwXFxcIi8+XFxuICAgICAgICA8L2NsaXBQYXRoPlxcbiAgICAgICAgPGNsaXBQYXRoIGlkPVxcXCJiXFxcIj5cXG4gICAgICAgICAgICA8cGF0aCBkPVxcXCJNMjUgMi4yaDJ2MjQuNjhoLTJabTAgMFxcXCIvPlxcbiAgICAgICAgPC9jbGlwUGF0aD5cXG4gICAgICAgIDxjbGlwUGF0aCBpZD1cXFwiY1xcXCI+XFxuICAgICAgICAgICAgPHBhdGggZD1cXFwiTTUzIDEyaDEuOTh2NUg1M1ptMCAwXFxcIi8+XFxuICAgICAgICA8L2NsaXBQYXRoPlxcbiAgICA8L2RlZnM+XFxuICAgIDxnIGNsaXAtcGF0aD1cXFwidXJsKCNhKVxcXCI+XFxuICAgICAgICA8cGF0aCBkPVxcXCJNMS40OCAxMi43MWMtLjUgMC0uOS40LS45Ljl2MS44NWEuOS45IDAgMCAwIDEuOCAwdi0xLjg0YzAtLjUtLjQtLjktLjktLjlabTAgMFxcXCIvPlxcbiAgICA8L2c+XFxuICAgIDxwYXRoIGQ9XFxcIk00Ljk4IDYuNjNjLS41IDAtLjkuNC0uOS45djE0LjAxYS45LjkgMCAwIDAgMS44MSAwdi0xNGMwLS41LS40LS45Mi0uOS0uOTJabTMuNTEgMy4xYS45LjkgMCAwIDAtLjkuOTF2Ny43OWEuOS45IDAgMCAwIDEuOCAwdi03Ljc5YzAtLjUtLjQtLjktLjktLjlaTTEyIDMuODNhLjkuOSAwIDAgMC0uOTEuOXYxOS42YS45LjkgMCAwIDAgMS44IDBWNC43NGMwLS41LS40LS45LS45LS45Wm0zLjUgOC4yOWEuOS45IDAgMCAwLS45MS45djMuMDNhLjkuOSAwIDAgMCAxLjgxIDB2LTMuMDNjMC0uNS0uNC0uOS0uOS0uOVpNMTkgNi44Yy0uNSAwLS45LjQtLjkuOXYxMy42OGEuOS45IDAgMCAwIDEuOCAwVjcuN2MwLS41LS40LS45LS45LS45Wm0zLjU4LTIuOTdoLS4wMWMtLjUgMC0uOS40LS45LjlsLS4xMyAxOS42YzAgLjUuNC45LjkuOTEuNSAwIC45LS40LjktLjlsLjE0LTE5LjZhLjkuOSAwIDAgMC0uOS0uOVptMCAwXFxcIi8+XFxuICAgIDxnIGNsaXAtcGF0aD1cXFwidXJsKCNiKVxcXCI+XFxuICAgICAgICA8cGF0aCBkPVxcXCJNMjYgMi4yYy0uNSAwLS45LjQtLjkuOXYyMi44NmEuOS45IDAgMSAwIDEuODEgMFYzLjExYS45LjkgMCAwIDAtLjktLjkxWm0wIDBcXFwiLz5cXG4gICAgPC9nPlxcbiAgICA8cGF0aCBkPVxcXCJNMjkuNTIgNy43MWEuOS45IDAgMCAwLS45MS45djExLjg1YS45LjkgMCAwIDAgMS44MSAwVjguNjJjMC0uNS0uNC0uOS0uOS0uOVptMy41IDIuOTNhLjkuOSAwIDAgMC0uOS45MXY1Ljk3YS45LjkgMCAwIDAgMS44IDB2LTUuOTdjMC0uNS0uNC0uOS0uOS0uOVptMy41LTUuNzhjLS41IDAtLjkuNC0uOS45djE3LjU1YS45LjkgMCAwIDAgMS44MSAwVjUuNzZjMC0uNS0uNC0uOS0uOS0uOVptMy41MSAzLjM0Yy0uNSAwLS45LjQtLjkuOXYxMC44N2EuOS45IDAgMCAwIDEuOCAwVjkuMWEuOS45IDAgMCAwLS45LS45MVptMy41IDMuMDhjLS41IDAtLjkuNC0uOS45MXY0LjdhLjkuOSAwIDEgMCAxLjggMHYtNC43YS45LjkgMCAwIDAtLjktLjlabTMuNTEtNy40NWEuOS45IDAgMCAwLS45MS45djE5LjZhLjkuOSAwIDAgMCAxLjgxIDBWNC43NGMwLS41LS40LS45LS45LS45Wm0zLjUgNS41N2EuOS45IDAgMCAwLS45LjkxdjguNDVhLjkuOSAwIDAgMCAxLjggMHYtOC40NWMwLS41LS40LS45LS45LS45Wm0wIDBcXFwiLz5cXG4gICAgPGcgY2xpcC1wYXRoPVxcXCJ1cmwoI2MpXFxcIj5cXG4gICAgICAgIDxwYXRoIGQ9XFxcIk01NC4wNCAxMi45NmEuOS45IDAgMCAwLS45LjkxdjEuMzNhLjkuOSAwIDEgMCAxLjggMHYtMS4zMmEuOS45IDAgMCAwLS45LS45MlptMCAwXFxcIi8+XFxuICAgIDwvZz5cXG48L3N2Zz5cIjsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vcmVjdGFuZ2xlcy5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3JlY3RhbmdsZXMuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cnVsZVNldFsxXS5ydWxlc1szXS51c2VbMV0hLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9ydWxlU2V0WzFdLnJ1bGVzWzNdLnVzZVsyXSEuL2NvbW1vbi5zY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3J1bGVTZXRbMV0ucnVsZXNbM10udXNlWzFdIS4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cnVsZVNldFsxXS5ydWxlc1szXS51c2VbMl0hLi9jb21tb24uc2Nzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3J1bGVTZXRbMV0ucnVsZXNbM10udXNlWzFdIS4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cnVsZVNldFsxXS5ydWxlc1szXS51c2VbMl0hLi9kZXNrdG9wLnNjc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cnVsZVNldFsxXS5ydWxlc1szXS51c2VbMV0hLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9ydWxlU2V0WzFdLnJ1bGVzWzNdLnVzZVsyXSEuL2Rlc2t0b3Auc2Nzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3J1bGVTZXRbMV0ucnVsZXNbM10udXNlWzFdIS4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cnVsZVNldFsxXS5ydWxlc1szXS51c2VbMl0hLi9tb2JpbGUuc2Nzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9ydWxlU2V0WzFdLnJ1bGVzWzNdLnVzZVsxXSEuLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvZGlzdC9janMuanM/P3J1bGVTZXRbMV0ucnVsZXNbM10udXNlWzJdIS4vbW9iaWxlLnNjc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsImltcG9ydCB7IF9fYXNzaWduIH0gZnJvbSAnLi9fdmlydHVhbC9fdHNsaWIuanMnO1xuaW1wb3J0IHsgc3ltYm9sT2JzZXJ2YWJsZSwgdG9JbnZva2VTb3VyY2UsIG1hcENvbnRleHQsIGlzTWFjaGluZSB9IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHsgcHJvdmlkZSB9IGZyb20gJy4vc2VydmljZVNjb3BlLmpzJztcblxuZnVuY3Rpb24gY3JlYXRlTnVsbEFjdG9yKGlkKSB7XG4gIHZhciBfYTtcblxuICByZXR1cm4gX2EgPSB7XG4gICAgaWQ6IGlkLFxuICAgIHNlbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfSxcbiAgICBzdWJzY3JpYmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIGdldFNuYXBzaG90OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0sXG4gICAgdG9KU09OOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogaWRcbiAgICAgIH07XG4gICAgfVxuICB9LCBfYVtzeW1ib2xPYnNlcnZhYmxlXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfSwgX2E7XG59XG4vKipcclxuICogQ3JlYXRlcyBhIGRlZmVycmVkIGFjdG9yIHRoYXQgaXMgYWJsZSB0byBiZSBpbnZva2VkIGdpdmVuIHRoZSBwcm92aWRlZFxyXG4gKiBpbnZvY2F0aW9uIGluZm9ybWF0aW9uIGluIGl0cyBgLm1ldGFgIHZhbHVlLlxyXG4gKlxyXG4gKiBAcGFyYW0gaW52b2tlRGVmaW5pdGlvbiBUaGUgbWV0YSBpbmZvcm1hdGlvbiBuZWVkZWQgdG8gaW52b2tlIHRoZSBhY3Rvci5cclxuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZUludm9jYWJsZUFjdG9yKGludm9rZURlZmluaXRpb24sIG1hY2hpbmUsIGNvbnRleHQsIF9ldmVudCkge1xuICB2YXIgX2E7XG5cbiAgdmFyIGludm9rZVNyYyA9IHRvSW52b2tlU291cmNlKGludm9rZURlZmluaXRpb24uc3JjKTtcbiAgdmFyIHNlcnZpY2VDcmVhdG9yID0gKF9hID0gbWFjaGluZSA9PT0gbnVsbCB8fCBtYWNoaW5lID09PSB2b2lkIDAgPyB2b2lkIDAgOiBtYWNoaW5lLm9wdGlvbnMuc2VydmljZXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYVtpbnZva2VTcmMudHlwZV07XG4gIHZhciByZXNvbHZlZERhdGEgPSBpbnZva2VEZWZpbml0aW9uLmRhdGEgPyBtYXBDb250ZXh0KGludm9rZURlZmluaXRpb24uZGF0YSwgY29udGV4dCwgX2V2ZW50KSA6IHVuZGVmaW5lZDtcbiAgdmFyIHRlbXBBY3RvciA9IHNlcnZpY2VDcmVhdG9yID8gY3JlYXRlRGVmZXJyZWRBY3RvcihzZXJ2aWNlQ3JlYXRvciwgaW52b2tlRGVmaW5pdGlvbi5pZCwgcmVzb2x2ZWREYXRhKSA6IGNyZWF0ZU51bGxBY3RvcihpbnZva2VEZWZpbml0aW9uLmlkKTsgLy8gQHRzLWlnbm9yZVxuXG4gIHRlbXBBY3Rvci5tZXRhID0gaW52b2tlRGVmaW5pdGlvbjtcbiAgcmV0dXJuIHRlbXBBY3Rvcjtcbn1cbmZ1bmN0aW9uIGNyZWF0ZURlZmVycmVkQWN0b3IoZW50aXR5LCBpZCwgZGF0YSkge1xuICB2YXIgdGVtcEFjdG9yID0gY3JlYXRlTnVsbEFjdG9yKGlkKTsgLy8gQHRzLWlnbm9yZVxuXG4gIHRlbXBBY3Rvci5kZWZlcnJlZCA9IHRydWU7XG5cbiAgaWYgKGlzTWFjaGluZShlbnRpdHkpKSB7XG4gICAgLy8gXCJtdXRlXCIgdGhlIGV4aXN0aW5nIHNlcnZpY2Ugc2NvcGUgc28gcG90ZW50aWFsIHNwYXduZWQgYWN0b3JzIHdpdGhpbiB0aGUgYC5pbml0aWFsU3RhdGVgIHN0YXkgZGVmZXJyZWQgaGVyZVxuICAgIHZhciBpbml0aWFsU3RhdGVfMSA9IHRlbXBBY3Rvci5zdGF0ZSA9IHByb3ZpZGUodW5kZWZpbmVkLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gKGRhdGEgPyBlbnRpdHkud2l0aENvbnRleHQoZGF0YSkgOiBlbnRpdHkpLmluaXRpYWxTdGF0ZTtcbiAgICB9KTtcblxuICAgIHRlbXBBY3Rvci5nZXRTbmFwc2hvdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBpbml0aWFsU3RhdGVfMTtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHRlbXBBY3Rvcjtcbn1cbmZ1bmN0aW9uIGlzQWN0b3IoaXRlbSkge1xuICB0cnkge1xuICAgIHJldHVybiB0eXBlb2YgaXRlbS5zZW5kID09PSAnZnVuY3Rpb24nO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5mdW5jdGlvbiBpc1NwYXduZWRBY3RvcihpdGVtKSB7XG4gIHJldHVybiBpc0FjdG9yKGl0ZW0pICYmICdpZCcgaW4gaXRlbTtcbn0gLy8gVE9ETzogcmVmYWN0b3IgdGhlIHJldHVybiB0eXBlLCB0aGlzIGNvdWxkIGJlIHdyaXR0ZW4gaW4gYSBiZXR0ZXIgd2F5IGJ1dCBpdCdzIGJlc3QgdG8gYXZvaWQgdW5uZWNjZXNzYXJ5IGJyZWFraW5nIGNoYW5nZXMgbm93XG5cbmZ1bmN0aW9uIHRvQWN0b3JSZWYoYWN0b3JSZWZMaWtlKSB7XG4gIHZhciBfYTtcblxuICByZXR1cm4gX19hc3NpZ24oKF9hID0ge1xuICAgIHN1YnNjcmliZTogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgaWQ6ICdhbm9ueW1vdXMnLFxuICAgIGdldFNuYXBzaG90OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSwgX2Fbc3ltYm9sT2JzZXJ2YWJsZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sIF9hKSwgYWN0b3JSZWZMaWtlKTtcbn1cblxuZXhwb3J0IHsgY3JlYXRlRGVmZXJyZWRBY3RvciwgY3JlYXRlSW52b2NhYmxlQWN0b3IsIGNyZWF0ZU51bGxBY3RvciwgaXNBY3RvciwgaXNTcGF3bmVkQWN0b3IsIHRvQWN0b3JSZWYgfTtcbiIsImltcG9ydCB7IFN0YXRlTm9kZSB9IGZyb20gJy4vU3RhdGVOb2RlLmpzJztcbmltcG9ydCB7IElTX1BST0RVQ1RJT04gfSBmcm9tICcuL2Vudmlyb25tZW50LmpzJztcblxudmFyIHdhcm5lZCA9IGZhbHNlO1xuZnVuY3Rpb24gTWFjaGluZShjb25maWcsIG9wdGlvbnMsIGluaXRpYWxDb250ZXh0KSB7XG4gIGlmIChpbml0aWFsQ29udGV4dCA9PT0gdm9pZCAwKSB7XG4gICAgaW5pdGlhbENvbnRleHQgPSBjb25maWcuY29udGV4dDtcbiAgfVxuXG4gIHJldHVybiBuZXcgU3RhdGVOb2RlKGNvbmZpZywgb3B0aW9ucywgaW5pdGlhbENvbnRleHQpO1xufVxuZnVuY3Rpb24gY3JlYXRlTWFjaGluZShjb25maWcsIG9wdGlvbnMpIHtcbiAgaWYgKCFJU19QUk9EVUNUSU9OICYmICEoJ3ByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzJyBpbiBjb25maWcpICYmICF3YXJuZWQpIHtcbiAgICB3YXJuZWQgPSB0cnVlO1xuICAgIGNvbnNvbGUud2FybignSXQgaXMgaGlnaGx5IHJlY29tbWVuZGVkIHRvIHNldCBgcHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHNgIHRvIGB0cnVlYCB3aGVuIHVzaW5nIGBjcmVhdGVNYWNoaW5lYC4gaHR0cHM6Ly94c3RhdGUuanMub3JnL2RvY3MvZ3VpZGVzL2FjdGlvbnMuaHRtbCcpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBTdGF0ZU5vZGUoY29uZmlnLCBvcHRpb25zKTtcbn1cblxuZXhwb3J0IHsgTWFjaGluZSwgY3JlYXRlTWFjaGluZSB9O1xuIiwiaW1wb3J0IHsgX19hc3NpZ24sIF9fc3ByZWFkQXJyYXksIF9fcmVhZCwgX19yZXN0IH0gZnJvbSAnLi9fdmlydHVhbC9fdHNsaWIuanMnO1xuaW1wb3J0IHsgRU1QVFlfQUNUSVZJVFlfTUFQIH0gZnJvbSAnLi9jb25zdGFudHMuanMnO1xuaW1wb3J0IHsgaXNTdHJpbmcsIG1hdGNoZXNTdGF0ZSwgd2FybiB9IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHsgZ2V0TWV0YSwgbmV4dEV2ZW50cyB9IGZyb20gJy4vc3RhdGVVdGlscy5qcyc7XG5pbXBvcnQgeyBpbml0RXZlbnQgfSBmcm9tICcuL2FjdGlvbnMuanMnO1xuaW1wb3J0IHsgSVNfUFJPRFVDVElPTiB9IGZyb20gJy4vZW52aXJvbm1lbnQuanMnO1xuXG5mdW5jdGlvbiBzdGF0ZVZhbHVlc0VxdWFsKGEsIGIpIHtcbiAgaWYgKGEgPT09IGIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmIChhID09PSB1bmRlZmluZWQgfHwgYiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKGlzU3RyaW5nKGEpIHx8IGlzU3RyaW5nKGIpKSB7XG4gICAgcmV0dXJuIGEgPT09IGI7XG4gIH1cblxuICB2YXIgYUtleXMgPSBPYmplY3Qua2V5cyhhKTtcbiAgdmFyIGJLZXlzID0gT2JqZWN0LmtleXMoYik7XG4gIHJldHVybiBhS2V5cy5sZW5ndGggPT09IGJLZXlzLmxlbmd0aCAmJiBhS2V5cy5ldmVyeShmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIHN0YXRlVmFsdWVzRXF1YWwoYVtrZXldLCBiW2tleV0pO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGlzU3RhdGVDb25maWcoc3RhdGUpIHtcbiAgaWYgKHR5cGVvZiBzdGF0ZSAhPT0gJ29iamVjdCcgfHwgc3RhdGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gJ3ZhbHVlJyBpbiBzdGF0ZSAmJiAnX2V2ZW50JyBpbiBzdGF0ZTtcbn1cbi8qKlxyXG4gKiBAZGVwcmVjYXRlZCBVc2UgYGlzU3RhdGVDb25maWcob2JqZWN0KWAgb3IgYHN0YXRlIGluc3RhbmNlb2YgU3RhdGVgIGluc3RlYWQuXHJcbiAqL1xuXG52YXIgaXNTdGF0ZSA9IGlzU3RhdGVDb25maWc7XG5mdW5jdGlvbiBiaW5kQWN0aW9uVG9TdGF0ZShhY3Rpb24sIHN0YXRlKSB7XG4gIHZhciBleGVjID0gYWN0aW9uLmV4ZWM7XG5cbiAgdmFyIGJvdW5kQWN0aW9uID0gX19hc3NpZ24oX19hc3NpZ24oe30sIGFjdGlvbiksIHtcbiAgICBleGVjOiBleGVjICE9PSB1bmRlZmluZWQgPyBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZXhlYyhzdGF0ZS5jb250ZXh0LCBzdGF0ZS5ldmVudCwge1xuICAgICAgICBhY3Rpb246IGFjdGlvbixcbiAgICAgICAgc3RhdGU6IHN0YXRlLFxuICAgICAgICBfZXZlbnQ6IHN0YXRlLl9ldmVudFxuICAgICAgfSk7XG4gICAgfSA6IHVuZGVmaW5lZFxuICB9KTtcblxuICByZXR1cm4gYm91bmRBY3Rpb247XG59XG5cbnZhciBTdGF0ZSA9XG4vKiNfX1BVUkVfXyovXG5cbi8qKiBAY2xhc3MgKi9cbmZ1bmN0aW9uICgpIHtcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhIG5ldyBTdGF0ZSBpbnN0YW5jZS5cclxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIHN0YXRlIHZhbHVlXHJcbiAgICogQHBhcmFtIGNvbnRleHQgVGhlIGV4dGVuZGVkIHN0YXRlXHJcbiAgICogQHBhcmFtIGhpc3RvcnlWYWx1ZSBUaGUgdHJlZSByZXByZXNlbnRpbmcgaGlzdG9yaWNhbCB2YWx1ZXMgb2YgdGhlIHN0YXRlIG5vZGVzXHJcbiAgICogQHBhcmFtIGhpc3RvcnkgVGhlIHByZXZpb3VzIHN0YXRlXHJcbiAgICogQHBhcmFtIGFjdGlvbnMgQW4gYXJyYXkgb2YgYWN0aW9uIG9iamVjdHMgdG8gZXhlY3V0ZSBhcyBzaWRlLWVmZmVjdHNcclxuICAgKiBAcGFyYW0gYWN0aXZpdGllcyBBIG1hcHBpbmcgb2YgYWN0aXZpdGllcyBhbmQgd2hldGhlciB0aGV5IGFyZSBzdGFydGVkIChgdHJ1ZWApIG9yIHN0b3BwZWQgKGBmYWxzZWApLlxyXG4gICAqIEBwYXJhbSBtZXRhXHJcbiAgICogQHBhcmFtIGV2ZW50cyBJbnRlcm5hbCBldmVudCBxdWV1ZS4gU2hvdWxkIGJlIGVtcHR5IHdpdGggcnVuLXRvLWNvbXBsZXRpb24gc2VtYW50aWNzLlxyXG4gICAqIEBwYXJhbSBjb25maWd1cmF0aW9uXHJcbiAgICovXG4gIGZ1bmN0aW9uIFN0YXRlKGNvbmZpZykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgX2E7XG5cbiAgICB0aGlzLmFjdGlvbnMgPSBbXTtcbiAgICB0aGlzLmFjdGl2aXRpZXMgPSBFTVBUWV9BQ1RJVklUWV9NQVA7XG4gICAgdGhpcy5tZXRhID0ge307XG4gICAgdGhpcy5ldmVudHMgPSBbXTtcbiAgICB0aGlzLnZhbHVlID0gY29uZmlnLnZhbHVlO1xuICAgIHRoaXMuY29udGV4dCA9IGNvbmZpZy5jb250ZXh0O1xuICAgIHRoaXMuX2V2ZW50ID0gY29uZmlnLl9ldmVudDtcbiAgICB0aGlzLl9zZXNzaW9uaWQgPSBjb25maWcuX3Nlc3Npb25pZDtcbiAgICB0aGlzLmV2ZW50ID0gdGhpcy5fZXZlbnQuZGF0YTtcbiAgICB0aGlzLmhpc3RvcnlWYWx1ZSA9IGNvbmZpZy5oaXN0b3J5VmFsdWU7XG4gICAgdGhpcy5oaXN0b3J5ID0gY29uZmlnLmhpc3Rvcnk7XG4gICAgdGhpcy5hY3Rpb25zID0gY29uZmlnLmFjdGlvbnMgfHwgW107XG4gICAgdGhpcy5hY3Rpdml0aWVzID0gY29uZmlnLmFjdGl2aXRpZXMgfHwgRU1QVFlfQUNUSVZJVFlfTUFQO1xuICAgIHRoaXMubWV0YSA9IGdldE1ldGEoY29uZmlnLmNvbmZpZ3VyYXRpb24pO1xuICAgIHRoaXMuZXZlbnRzID0gY29uZmlnLmV2ZW50cyB8fCBbXTtcbiAgICB0aGlzLm1hdGNoZXMgPSB0aGlzLm1hdGNoZXMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnRvU3RyaW5ncyA9IHRoaXMudG9TdHJpbmdzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jb25maWd1cmF0aW9uID0gY29uZmlnLmNvbmZpZ3VyYXRpb247XG4gICAgdGhpcy50cmFuc2l0aW9ucyA9IGNvbmZpZy50cmFuc2l0aW9ucztcbiAgICB0aGlzLmNoaWxkcmVuID0gY29uZmlnLmNoaWxkcmVuO1xuICAgIHRoaXMuZG9uZSA9ICEhY29uZmlnLmRvbmU7XG4gICAgdGhpcy50YWdzID0gKF9hID0gQXJyYXkuaXNBcnJheShjb25maWcudGFncykgPyBuZXcgU2V0KGNvbmZpZy50YWdzKSA6IGNvbmZpZy50YWdzKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBuZXcgU2V0KCk7XG4gICAgdGhpcy5tYWNoaW5lID0gY29uZmlnLm1hY2hpbmU7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICduZXh0RXZlbnRzJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXh0RXZlbnRzKF90aGlzLmNvbmZpZ3VyYXRpb24pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYSBuZXcgU3RhdGUgaW5zdGFuY2UgZm9yIHRoZSBnaXZlbiBgc3RhdGVWYWx1ZWAgYW5kIGBjb250ZXh0YC5cclxuICAgKiBAcGFyYW0gc3RhdGVWYWx1ZVxyXG4gICAqIEBwYXJhbSBjb250ZXh0XHJcbiAgICovXG5cblxuICBTdGF0ZS5mcm9tID0gZnVuY3Rpb24gKHN0YXRlVmFsdWUsIGNvbnRleHQpIHtcbiAgICBpZiAoc3RhdGVWYWx1ZSBpbnN0YW5jZW9mIFN0YXRlKSB7XG4gICAgICBpZiAoc3RhdGVWYWx1ZS5jb250ZXh0ICE9PSBjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiBuZXcgU3RhdGUoe1xuICAgICAgICAgIHZhbHVlOiBzdGF0ZVZhbHVlLnZhbHVlLFxuICAgICAgICAgIGNvbnRleHQ6IGNvbnRleHQsXG4gICAgICAgICAgX2V2ZW50OiBzdGF0ZVZhbHVlLl9ldmVudCxcbiAgICAgICAgICBfc2Vzc2lvbmlkOiBudWxsLFxuICAgICAgICAgIGhpc3RvcnlWYWx1ZTogc3RhdGVWYWx1ZS5oaXN0b3J5VmFsdWUsXG4gICAgICAgICAgaGlzdG9yeTogc3RhdGVWYWx1ZS5oaXN0b3J5LFxuICAgICAgICAgIGFjdGlvbnM6IFtdLFxuICAgICAgICAgIGFjdGl2aXRpZXM6IHN0YXRlVmFsdWUuYWN0aXZpdGllcyxcbiAgICAgICAgICBtZXRhOiB7fSxcbiAgICAgICAgICBldmVudHM6IFtdLFxuICAgICAgICAgIGNvbmZpZ3VyYXRpb246IFtdLFxuICAgICAgICAgIHRyYW5zaXRpb25zOiBbXSxcbiAgICAgICAgICBjaGlsZHJlbjoge31cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdGF0ZVZhbHVlO1xuICAgIH1cblxuICAgIHZhciBfZXZlbnQgPSBpbml0RXZlbnQ7XG4gICAgcmV0dXJuIG5ldyBTdGF0ZSh7XG4gICAgICB2YWx1ZTogc3RhdGVWYWx1ZSxcbiAgICAgIGNvbnRleHQ6IGNvbnRleHQsXG4gICAgICBfZXZlbnQ6IF9ldmVudCxcbiAgICAgIF9zZXNzaW9uaWQ6IG51bGwsXG4gICAgICBoaXN0b3J5VmFsdWU6IHVuZGVmaW5lZCxcbiAgICAgIGhpc3Rvcnk6IHVuZGVmaW5lZCxcbiAgICAgIGFjdGlvbnM6IFtdLFxuICAgICAgYWN0aXZpdGllczogdW5kZWZpbmVkLFxuICAgICAgbWV0YTogdW5kZWZpbmVkLFxuICAgICAgZXZlbnRzOiBbXSxcbiAgICAgIGNvbmZpZ3VyYXRpb246IFtdLFxuICAgICAgdHJhbnNpdGlvbnM6IFtdLFxuICAgICAgY2hpbGRyZW46IHt9XG4gICAgfSk7XG4gIH07XG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYSBuZXcgU3RhdGUgaW5zdGFuY2UgZm9yIHRoZSBnaXZlbiBgY29uZmlnYC5cclxuICAgKiBAcGFyYW0gY29uZmlnIFRoZSBzdGF0ZSBjb25maWdcclxuICAgKi9cblxuXG4gIFN0YXRlLmNyZWF0ZSA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICByZXR1cm4gbmV3IFN0YXRlKGNvbmZpZyk7XG4gIH07XG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYSBuZXcgYFN0YXRlYCBpbnN0YW5jZSBmb3IgdGhlIGdpdmVuIGBzdGF0ZVZhbHVlYCBhbmQgYGNvbnRleHRgIHdpdGggbm8gYWN0aW9ucyAoc2lkZS1lZmZlY3RzKS5cclxuICAgKiBAcGFyYW0gc3RhdGVWYWx1ZVxyXG4gICAqIEBwYXJhbSBjb250ZXh0XHJcbiAgICovXG5cblxuICBTdGF0ZS5pbmVydCA9IGZ1bmN0aW9uIChzdGF0ZVZhbHVlLCBjb250ZXh0KSB7XG4gICAgaWYgKHN0YXRlVmFsdWUgaW5zdGFuY2VvZiBTdGF0ZSkge1xuICAgICAgaWYgKCFzdGF0ZVZhbHVlLmFjdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZVZhbHVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgX2V2ZW50ID0gaW5pdEV2ZW50O1xuICAgICAgcmV0dXJuIG5ldyBTdGF0ZSh7XG4gICAgICAgIHZhbHVlOiBzdGF0ZVZhbHVlLnZhbHVlLFxuICAgICAgICBjb250ZXh0OiBjb250ZXh0LFxuICAgICAgICBfZXZlbnQ6IF9ldmVudCxcbiAgICAgICAgX3Nlc3Npb25pZDogbnVsbCxcbiAgICAgICAgaGlzdG9yeVZhbHVlOiBzdGF0ZVZhbHVlLmhpc3RvcnlWYWx1ZSxcbiAgICAgICAgaGlzdG9yeTogc3RhdGVWYWx1ZS5oaXN0b3J5LFxuICAgICAgICBhY3Rpdml0aWVzOiBzdGF0ZVZhbHVlLmFjdGl2aXRpZXMsXG4gICAgICAgIGNvbmZpZ3VyYXRpb246IHN0YXRlVmFsdWUuY29uZmlndXJhdGlvbixcbiAgICAgICAgdHJhbnNpdGlvbnM6IFtdLFxuICAgICAgICBjaGlsZHJlbjoge31cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBTdGF0ZS5mcm9tKHN0YXRlVmFsdWUsIGNvbnRleHQpO1xuICB9O1xuICAvKipcclxuICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGFsbCB0aGUgc3RyaW5nIGxlYWYgc3RhdGUgbm9kZSBwYXRocy5cclxuICAgKiBAcGFyYW0gc3RhdGVWYWx1ZVxyXG4gICAqIEBwYXJhbSBkZWxpbWl0ZXIgVGhlIGNoYXJhY3RlcihzKSB0aGF0IHNlcGFyYXRlIGVhY2ggc3VicGF0aCBpbiB0aGUgc3RyaW5nIHN0YXRlIG5vZGUgcGF0aC5cclxuICAgKi9cblxuXG4gIFN0YXRlLnByb3RvdHlwZS50b1N0cmluZ3MgPSBmdW5jdGlvbiAoc3RhdGVWYWx1ZSwgZGVsaW1pdGVyKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmIChzdGF0ZVZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgIHN0YXRlVmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgIH1cblxuICAgIGlmIChkZWxpbWl0ZXIgPT09IHZvaWQgMCkge1xuICAgICAgZGVsaW1pdGVyID0gJy4nO1xuICAgIH1cblxuICAgIGlmIChpc1N0cmluZyhzdGF0ZVZhbHVlKSkge1xuICAgICAgcmV0dXJuIFtzdGF0ZVZhbHVlXTtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWVLZXlzID0gT2JqZWN0LmtleXMoc3RhdGVWYWx1ZSk7XG4gICAgcmV0dXJuIHZhbHVlS2V5cy5jb25jYXQuYXBwbHkodmFsdWVLZXlzLCBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQodmFsdWVLZXlzLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gX3RoaXMudG9TdHJpbmdzKHN0YXRlVmFsdWVba2V5XSwgZGVsaW1pdGVyKS5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgcmV0dXJuIGtleSArIGRlbGltaXRlciArIHM7XG4gICAgICB9KTtcbiAgICB9KSksIGZhbHNlKSk7XG4gIH07XG5cbiAgU3RhdGUucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2EgPSB0aGlzO1xuICAgICAgICBfYS5jb25maWd1cmF0aW9uO1xuICAgICAgICBfYS50cmFuc2l0aW9ucztcbiAgICAgICAgdmFyIHRhZ3MgPSBfYS50YWdzO1xuICAgICAgICBfYS5tYWNoaW5lO1xuICAgICAgICB2YXIganNvblZhbHVlcyA9IF9fcmVzdChfYSwgW1wiY29uZmlndXJhdGlvblwiLCBcInRyYW5zaXRpb25zXCIsIFwidGFnc1wiLCBcIm1hY2hpbmVcIl0pO1xuXG4gICAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCBqc29uVmFsdWVzKSwge1xuICAgICAgdGFnczogQXJyYXkuZnJvbSh0YWdzKVxuICAgIH0pO1xuICB9O1xuXG4gIFN0YXRlLnByb3RvdHlwZS5tYXRjaGVzID0gZnVuY3Rpb24gKHBhcmVudFN0YXRlVmFsdWUpIHtcbiAgICByZXR1cm4gbWF0Y2hlc1N0YXRlKHBhcmVudFN0YXRlVmFsdWUsIHRoaXMudmFsdWUpO1xuICB9O1xuICAvKipcclxuICAgKiBXaGV0aGVyIHRoZSBjdXJyZW50IHN0YXRlIGNvbmZpZ3VyYXRpb24gaGFzIGEgc3RhdGUgbm9kZSB3aXRoIHRoZSBzcGVjaWZpZWQgYHRhZ2AuXHJcbiAgICogQHBhcmFtIHRhZ1xyXG4gICAqL1xuXG5cbiAgU3RhdGUucHJvdG90eXBlLmhhc1RhZyA9IGZ1bmN0aW9uICh0YWcpIHtcbiAgICByZXR1cm4gdGhpcy50YWdzLmhhcyh0YWcpO1xuICB9O1xuICAvKipcclxuICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgc2VuZGluZyB0aGUgYGV2ZW50YCB3aWxsIGNhdXNlIGEgbm9uLWZvcmJpZGRlbiB0cmFuc2l0aW9uXHJcbiAgICogdG8gYmUgc2VsZWN0ZWQsIGV2ZW4gaWYgdGhlIHRyYW5zaXRpb25zIGhhdmUgbm8gYWN0aW9ucyBub3JcclxuICAgKiBjaGFuZ2UgdGhlIHN0YXRlIHZhbHVlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCB0byB0ZXN0XHJcbiAgICogQHJldHVybnMgV2hldGhlciB0aGUgZXZlbnQgd2lsbCBjYXVzZSBhIHRyYW5zaXRpb25cclxuICAgKi9cblxuXG4gIFN0YXRlLnByb3RvdHlwZS5jYW4gPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgX2E7XG5cbiAgICBpZiAoSVNfUFJPRFVDVElPTikge1xuICAgICAgd2FybighIXRoaXMubWFjaGluZSwgXCJzdGF0ZS5jYW4oLi4uKSB1c2VkIG91dHNpZGUgb2YgYSBtYWNoaW5lLWNyZWF0ZWQgU3RhdGUgb2JqZWN0OyB0aGlzIHdpbGwgYWx3YXlzIHJldHVybiBmYWxzZS5cIik7XG4gICAgfVxuXG4gICAgdmFyIHRyYW5zaXRpb25EYXRhID0gKF9hID0gdGhpcy5tYWNoaW5lKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ2V0VHJhbnNpdGlvbkRhdGEodGhpcywgZXZlbnQpO1xuICAgIHJldHVybiAhISh0cmFuc2l0aW9uRGF0YSA9PT0gbnVsbCB8fCB0cmFuc2l0aW9uRGF0YSA9PT0gdm9pZCAwID8gdm9pZCAwIDogdHJhbnNpdGlvbkRhdGEudHJhbnNpdGlvbnMubGVuZ3RoKSAmJiAvLyBDaGVjayB0aGF0IGF0IGxlYXN0IG9uZSB0cmFuc2l0aW9uIGlzIG5vdCBmb3JiaWRkZW5cbiAgICB0cmFuc2l0aW9uRGF0YS50cmFuc2l0aW9ucy5zb21lKGZ1bmN0aW9uICh0KSB7XG4gICAgICByZXR1cm4gdC50YXJnZXQgIT09IHVuZGVmaW5lZCB8fCB0LmFjdGlvbnMubGVuZ3RoO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBTdGF0ZTtcbn0oKTtcblxuZXhwb3J0IHsgU3RhdGUsIGJpbmRBY3Rpb25Ub1N0YXRlLCBpc1N0YXRlLCBpc1N0YXRlQ29uZmlnLCBzdGF0ZVZhbHVlc0VxdWFsIH07XG4iLCJpbXBvcnQgeyBfX2Fzc2lnbiwgX19zcHJlYWRBcnJheSwgX19yZWFkLCBfX3ZhbHVlcywgX19yZXN0IH0gZnJvbSAnLi9fdmlydHVhbC9fdHNsaWIuanMnO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiwgbWFwVmFsdWVzLCBpc0FycmF5LCBmbGF0dGVuLCB0b0FycmF5LCB0b1N0YXRlVmFsdWUsIGlzU3RyaW5nLCBnZXRFdmVudFR5cGUsIHRvU0NYTUxFdmVudCwgbWF0Y2hlc1N0YXRlLCBwYXRoLCBldmFsdWF0ZUd1YXJkLCBtYXBDb250ZXh0LCBpc1JhaXNhYmxlQWN0aW9uLCBwYXRoVG9TdGF0ZVZhbHVlLCBpc0J1aWx0SW5FdmVudCwgcGFydGl0aW9uLCB1cGRhdGVIaXN0b3J5VmFsdWUsIHRvU3RhdGVQYXRoLCBtYXBGaWx0ZXJWYWx1ZXMsIHdhcm4sIHRvU3RhdGVQYXRocywgbmVzdGVkUGF0aCwgbm9ybWFsaXplVGFyZ2V0LCB0b0d1YXJkLCB0b1RyYW5zaXRpb25Db25maWdBcnJheSwgaXNNYWNoaW5lLCBjcmVhdGVJbnZva2VJZCB9IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHsgU3RhdGUsIHN0YXRlVmFsdWVzRXF1YWwgfSBmcm9tICcuL1N0YXRlLmpzJztcbmltcG9ydCB7IHN0YXJ0IGFzIHN0YXJ0JDEsIHN0b3AgYXMgc3RvcCQxLCBpbnZva2UsIHVwZGF0ZSwgbnVsbEV2ZW50IH0gZnJvbSAnLi9hY3Rpb25UeXBlcy5qcyc7XG5pbXBvcnQgeyBkb25lLCBzdGFydCwgdG9BY3Rpb25PYmplY3RzLCByYWlzZSwgc3RvcCwgcmVzb2x2ZUFjdGlvbnMsIGRvbmVJbnZva2UsIGVycm9yLCB0b0FjdGlvbk9iamVjdCwgdG9BY3Rpdml0eURlZmluaXRpb24sIGFmdGVyLCBzZW5kLCBjYW5jZWwsIGluaXRFdmVudCB9IGZyb20gJy4vYWN0aW9ucy5qcyc7XG5pbXBvcnQgeyBJU19QUk9EVUNUSU9OIH0gZnJvbSAnLi9lbnZpcm9ubWVudC5qcyc7XG5pbXBvcnQgeyBTVEFURV9ERUxJTUlURVIgfSBmcm9tICcuL2NvbnN0YW50cy5qcyc7XG5pbXBvcnQgeyBnZXRBbGxTdGF0ZU5vZGVzLCBnZXRDb25maWd1cmF0aW9uLCBpc0luRmluYWxTdGF0ZSwgZ2V0VGFnc0Zyb21Db25maWd1cmF0aW9uLCBoYXMsIGdldENoaWxkcmVuLCBnZXRWYWx1ZSwgaXNMZWFmTm9kZSwgZ2V0QWxsQ2hpbGRyZW4gfSBmcm9tICcuL3N0YXRlVXRpbHMuanMnO1xuaW1wb3J0IHsgY3JlYXRlSW52b2NhYmxlQWN0b3IgfSBmcm9tICcuL0FjdG9yLmpzJztcbmltcG9ydCB7IHRvSW52b2tlRGVmaW5pdGlvbiB9IGZyb20gJy4vaW52b2tlVXRpbHMuanMnO1xuXG52YXIgTlVMTF9FVkVOVCA9ICcnO1xudmFyIFNUQVRFX0lERU5USUZJRVIgPSAnIyc7XG52YXIgV0lMRENBUkQgPSAnKic7XG52YXIgRU1QVFlfT0JKRUNUID0ge307XG5cbnZhciBpc1N0YXRlSWQgPSBmdW5jdGlvbiAoc3RyKSB7XG4gIHJldHVybiBzdHJbMF0gPT09IFNUQVRFX0lERU5USUZJRVI7XG59O1xuXG52YXIgY3JlYXRlRGVmYXVsdE9wdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgYWN0aW9uczoge30sXG4gICAgZ3VhcmRzOiB7fSxcbiAgICBzZXJ2aWNlczoge30sXG4gICAgYWN0aXZpdGllczoge30sXG4gICAgZGVsYXlzOiB7fVxuICB9O1xufTtcblxudmFyIHZhbGlkYXRlQXJyYXlpZmllZFRyYW5zaXRpb25zID0gZnVuY3Rpb24gKHN0YXRlTm9kZSwgZXZlbnQsIHRyYW5zaXRpb25zKSB7XG4gIHZhciBoYXNOb25MYXN0VW5ndWFyZGVkVGFyZ2V0ID0gdHJhbnNpdGlvbnMuc2xpY2UoMCwgLTEpLnNvbWUoZnVuY3Rpb24gKHRyYW5zaXRpb24pIHtcbiAgICByZXR1cm4gISgnY29uZCcgaW4gdHJhbnNpdGlvbikgJiYgISgnaW4nIGluIHRyYW5zaXRpb24pICYmIChpc1N0cmluZyh0cmFuc2l0aW9uLnRhcmdldCkgfHwgaXNNYWNoaW5lKHRyYW5zaXRpb24udGFyZ2V0KSk7XG4gIH0pO1xuICB2YXIgZXZlbnRUZXh0ID0gZXZlbnQgPT09IE5VTExfRVZFTlQgPyAndGhlIHRyYW5zaWVudCBldmVudCcgOiBcImV2ZW50ICdcIi5jb25jYXQoZXZlbnQsIFwiJ1wiKTtcbiAgd2FybighaGFzTm9uTGFzdFVuZ3VhcmRlZFRhcmdldCwgXCJPbmUgb3IgbW9yZSB0cmFuc2l0aW9ucyBmb3IgXCIuY29uY2F0KGV2ZW50VGV4dCwgXCIgb24gc3RhdGUgJ1wiKS5jb25jYXQoc3RhdGVOb2RlLmlkLCBcIicgYXJlIHVucmVhY2hhYmxlLiBcIikgKyBcIk1ha2Ugc3VyZSB0aGF0IHRoZSBkZWZhdWx0IHRyYW5zaXRpb24gaXMgdGhlIGxhc3Qgb25lIGRlZmluZWQuXCIpO1xufTtcblxudmFyIFN0YXRlTm9kZSA9XG4vKiNfX1BVUkVfXyovXG5cbi8qKiBAY2xhc3MgKi9cbmZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gU3RhdGVOb2RlKFxuICAvKipcclxuICAgKiBUaGUgcmF3IGNvbmZpZyB1c2VkIHRvIGNyZWF0ZSB0aGUgbWFjaGluZS5cclxuICAgKi9cbiAgY29uZmlnLCBvcHRpb25zLFxuICAvKipcclxuICAgKiBUaGUgaW5pdGlhbCBleHRlbmRlZCBzdGF0ZVxyXG4gICAqL1xuICBfY29udGV4dCwgLy8gVE9ETzogdGhpcyBpcyB1bnNhZmUsIGJ1dCB3ZSdyZSByZW1vdmluZyBpdCBpbiB2NSBhbnl3YXlcbiAgX3N0YXRlSW5mbykge1xuICAgIGlmIChfY29udGV4dCA9PT0gdm9pZCAwKSB7XG4gICAgICBfY29udGV4dCA9ICdjb250ZXh0JyBpbiBjb25maWcgPyBjb25maWcuY29udGV4dCA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIF9hO1xuXG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5fY29udGV4dCA9IF9jb250ZXh0O1xuICAgIC8qKlxyXG4gICAgICogVGhlIG9yZGVyIHRoaXMgc3RhdGUgbm9kZSBhcHBlYXJzLiBDb3JyZXNwb25kcyB0byB0aGUgaW1wbGljaXQgU0NYTUwgZG9jdW1lbnQgb3JkZXIuXHJcbiAgICAgKi9cblxuICAgIHRoaXMub3JkZXIgPSAtMTtcbiAgICB0aGlzLl9feHN0YXRlbm9kZSA9IHRydWU7XG4gICAgdGhpcy5fX2NhY2hlID0ge1xuICAgICAgZXZlbnRzOiB1bmRlZmluZWQsXG4gICAgICByZWxhdGl2ZVZhbHVlOiBuZXcgTWFwKCksXG4gICAgICBpbml0aWFsU3RhdGVWYWx1ZTogdW5kZWZpbmVkLFxuICAgICAgaW5pdGlhbFN0YXRlOiB1bmRlZmluZWQsXG4gICAgICBvbjogdW5kZWZpbmVkLFxuICAgICAgdHJhbnNpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgIGNhbmRpZGF0ZXM6IHt9LFxuICAgICAgZGVsYXllZFRyYW5zaXRpb25zOiB1bmRlZmluZWRcbiAgICB9O1xuICAgIHRoaXMuaWRNYXAgPSB7fTtcbiAgICB0aGlzLnRhZ3MgPSBbXTtcbiAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKGNyZWF0ZURlZmF1bHRPcHRpb25zKCksIG9wdGlvbnMpO1xuICAgIHRoaXMucGFyZW50ID0gX3N0YXRlSW5mbyA9PT0gbnVsbCB8fCBfc3RhdGVJbmZvID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfc3RhdGVJbmZvLnBhcmVudDtcbiAgICB0aGlzLmtleSA9IHRoaXMuY29uZmlnLmtleSB8fCAoX3N0YXRlSW5mbyA9PT0gbnVsbCB8fCBfc3RhdGVJbmZvID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfc3RhdGVJbmZvLmtleSkgfHwgdGhpcy5jb25maWcuaWQgfHwgJyhtYWNoaW5lKSc7XG4gICAgdGhpcy5tYWNoaW5lID0gdGhpcy5wYXJlbnQgPyB0aGlzLnBhcmVudC5tYWNoaW5lIDogdGhpcztcbiAgICB0aGlzLnBhdGggPSB0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50LnBhdGguY29uY2F0KHRoaXMua2V5KSA6IFtdO1xuICAgIHRoaXMuZGVsaW1pdGVyID0gdGhpcy5jb25maWcuZGVsaW1pdGVyIHx8ICh0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50LmRlbGltaXRlciA6IFNUQVRFX0RFTElNSVRFUik7XG4gICAgdGhpcy5pZCA9IHRoaXMuY29uZmlnLmlkIHx8IF9fc3ByZWFkQXJyYXkoW3RoaXMubWFjaGluZS5rZXldLCBfX3JlYWQodGhpcy5wYXRoKSwgZmFsc2UpLmpvaW4odGhpcy5kZWxpbWl0ZXIpO1xuICAgIHRoaXMudmVyc2lvbiA9IHRoaXMucGFyZW50ID8gdGhpcy5wYXJlbnQudmVyc2lvbiA6IHRoaXMuY29uZmlnLnZlcnNpb247XG4gICAgdGhpcy50eXBlID0gdGhpcy5jb25maWcudHlwZSB8fCAodGhpcy5jb25maWcucGFyYWxsZWwgPyAncGFyYWxsZWwnIDogdGhpcy5jb25maWcuc3RhdGVzICYmIE9iamVjdC5rZXlzKHRoaXMuY29uZmlnLnN0YXRlcykubGVuZ3RoID8gJ2NvbXBvdW5kJyA6IHRoaXMuY29uZmlnLmhpc3RvcnkgPyAnaGlzdG9yeScgOiAnYXRvbWljJyk7XG4gICAgdGhpcy5zY2hlbWEgPSB0aGlzLnBhcmVudCA/IHRoaXMubWFjaGluZS5zY2hlbWEgOiAoX2EgPSB0aGlzLmNvbmZpZy5zY2hlbWEpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHt9O1xuICAgIHRoaXMuZGVzY3JpcHRpb24gPSB0aGlzLmNvbmZpZy5kZXNjcmlwdGlvbjtcblxuICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgd2FybighKCdwYXJhbGxlbCcgaW4gdGhpcy5jb25maWcpLCBcIlRoZSBcXFwicGFyYWxsZWxcXFwiIHByb3BlcnR5IGlzIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiB2ZXJzaW9uIDQuMS4gXCIuY29uY2F0KHRoaXMuY29uZmlnLnBhcmFsbGVsID8gXCJSZXBsYWNlIHdpdGggYHR5cGU6ICdwYXJhbGxlbCdgXCIgOiBcIlVzZSBgdHlwZTogJ1wiLmNvbmNhdCh0aGlzLnR5cGUsIFwiJ2BcIiksIFwiIGluIHRoZSBjb25maWcgZm9yIHN0YXRlIG5vZGUgJ1wiKS5jb25jYXQodGhpcy5pZCwgXCInIGluc3RlYWQuXCIpKTtcbiAgICB9XG5cbiAgICB0aGlzLmluaXRpYWwgPSB0aGlzLmNvbmZpZy5pbml0aWFsO1xuICAgIHRoaXMuc3RhdGVzID0gdGhpcy5jb25maWcuc3RhdGVzID8gbWFwVmFsdWVzKHRoaXMuY29uZmlnLnN0YXRlcywgZnVuY3Rpb24gKHN0YXRlQ29uZmlnLCBrZXkpIHtcbiAgICAgIHZhciBfYTtcblxuICAgICAgdmFyIHN0YXRlTm9kZSA9IG5ldyBTdGF0ZU5vZGUoc3RhdGVDb25maWcsIHt9LCB1bmRlZmluZWQsIHtcbiAgICAgICAgcGFyZW50OiBfdGhpcyxcbiAgICAgICAga2V5OiBrZXlcbiAgICAgIH0pO1xuICAgICAgT2JqZWN0LmFzc2lnbihfdGhpcy5pZE1hcCwgX19hc3NpZ24oKF9hID0ge30sIF9hW3N0YXRlTm9kZS5pZF0gPSBzdGF0ZU5vZGUsIF9hKSwgc3RhdGVOb2RlLmlkTWFwKSk7XG4gICAgICByZXR1cm4gc3RhdGVOb2RlO1xuICAgIH0pIDogRU1QVFlfT0JKRUNUOyAvLyBEb2N1bWVudCBvcmRlclxuXG4gICAgdmFyIG9yZGVyID0gMDtcblxuICAgIGZ1bmN0aW9uIGRmcyhzdGF0ZU5vZGUpIHtcbiAgICAgIHZhciBlXzEsIF9hO1xuXG4gICAgICBzdGF0ZU5vZGUub3JkZXIgPSBvcmRlcisrO1xuXG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciBfYiA9IF9fdmFsdWVzKGdldEFsbENoaWxkcmVuKHN0YXRlTm9kZSkpLCBfYyA9IF9iLm5leHQoKTsgIV9jLmRvbmU7IF9jID0gX2IubmV4dCgpKSB7XG4gICAgICAgICAgdmFyIGNoaWxkID0gX2MudmFsdWU7XG4gICAgICAgICAgZGZzKGNoaWxkKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZV8xXzEpIHtcbiAgICAgICAgZV8xID0ge1xuICAgICAgICAgIGVycm9yOiBlXzFfMVxuICAgICAgICB9O1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoX2MgJiYgIV9jLmRvbmUgJiYgKF9hID0gX2IucmV0dXJuKSkgX2EuY2FsbChfYik7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZGZzKHRoaXMpOyAvLyBIaXN0b3J5IGNvbmZpZ1xuXG4gICAgdGhpcy5oaXN0b3J5ID0gdGhpcy5jb25maWcuaGlzdG9yeSA9PT0gdHJ1ZSA/ICdzaGFsbG93JyA6IHRoaXMuY29uZmlnLmhpc3RvcnkgfHwgZmFsc2U7XG4gICAgdGhpcy5fdHJhbnNpZW50ID0gISF0aGlzLmNvbmZpZy5hbHdheXMgfHwgKCF0aGlzLmNvbmZpZy5vbiA/IGZhbHNlIDogQXJyYXkuaXNBcnJheSh0aGlzLmNvbmZpZy5vbikgPyB0aGlzLmNvbmZpZy5vbi5zb21lKGZ1bmN0aW9uIChfYSkge1xuICAgICAgdmFyIGV2ZW50ID0gX2EuZXZlbnQ7XG4gICAgICByZXR1cm4gZXZlbnQgPT09IE5VTExfRVZFTlQ7XG4gICAgfSkgOiBOVUxMX0VWRU5UIGluIHRoaXMuY29uZmlnLm9uKTtcbiAgICB0aGlzLnN0cmljdCA9ICEhdGhpcy5jb25maWcuc3RyaWN0OyAvLyBUT0RPOiBkZXByZWNhdGUgKGVudHJ5KVxuXG4gICAgdGhpcy5vbkVudHJ5ID0gdG9BcnJheSh0aGlzLmNvbmZpZy5lbnRyeSB8fCB0aGlzLmNvbmZpZy5vbkVudHJ5KS5tYXAoZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgcmV0dXJuIHRvQWN0aW9uT2JqZWN0KGFjdGlvbik7XG4gICAgfSk7IC8vIFRPRE86IGRlcHJlY2F0ZSAoZXhpdClcblxuICAgIHRoaXMub25FeGl0ID0gdG9BcnJheSh0aGlzLmNvbmZpZy5leGl0IHx8IHRoaXMuY29uZmlnLm9uRXhpdCkubWFwKGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgIHJldHVybiB0b0FjdGlvbk9iamVjdChhY3Rpb24pO1xuICAgIH0pO1xuICAgIHRoaXMubWV0YSA9IHRoaXMuY29uZmlnLm1ldGE7XG4gICAgdGhpcy5kb25lRGF0YSA9IHRoaXMudHlwZSA9PT0gJ2ZpbmFsJyA/IHRoaXMuY29uZmlnLmRhdGEgOiB1bmRlZmluZWQ7XG4gICAgdGhpcy5pbnZva2UgPSB0b0FycmF5KHRoaXMuY29uZmlnLmludm9rZSkubWFwKGZ1bmN0aW9uIChpbnZva2VDb25maWcsIGkpIHtcbiAgICAgIHZhciBfYSwgX2I7XG5cbiAgICAgIGlmIChpc01hY2hpbmUoaW52b2tlQ29uZmlnKSkge1xuICAgICAgICB2YXIgaW52b2tlSWQgPSBjcmVhdGVJbnZva2VJZChfdGhpcy5pZCwgaSk7XG4gICAgICAgIF90aGlzLm1hY2hpbmUub3B0aW9ucy5zZXJ2aWNlcyA9IF9fYXNzaWduKChfYSA9IHt9LCBfYVtpbnZva2VJZF0gPSBpbnZva2VDb25maWcsIF9hKSwgX3RoaXMubWFjaGluZS5vcHRpb25zLnNlcnZpY2VzKTtcbiAgICAgICAgcmV0dXJuIHRvSW52b2tlRGVmaW5pdGlvbih7XG4gICAgICAgICAgc3JjOiBpbnZva2VJZCxcbiAgICAgICAgICBpZDogaW52b2tlSWRcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKGlzU3RyaW5nKGludm9rZUNvbmZpZy5zcmMpKSB7XG4gICAgICAgIHZhciBpbnZva2VJZCA9IGludm9rZUNvbmZpZy5pZCB8fCBjcmVhdGVJbnZva2VJZChfdGhpcy5pZCwgaSk7XG4gICAgICAgIHJldHVybiB0b0ludm9rZURlZmluaXRpb24oX19hc3NpZ24oX19hc3NpZ24oe30sIGludm9rZUNvbmZpZyksIHtcbiAgICAgICAgICBpZDogaW52b2tlSWQsXG4gICAgICAgICAgc3JjOiBpbnZva2VDb25maWcuc3JjXG4gICAgICAgIH0pKTtcbiAgICAgIH0gZWxzZSBpZiAoaXNNYWNoaW5lKGludm9rZUNvbmZpZy5zcmMpIHx8IGlzRnVuY3Rpb24oaW52b2tlQ29uZmlnLnNyYykpIHtcbiAgICAgICAgdmFyIGludm9rZUlkID0gaW52b2tlQ29uZmlnLmlkIHx8IGNyZWF0ZUludm9rZUlkKF90aGlzLmlkLCBpKTtcbiAgICAgICAgX3RoaXMubWFjaGluZS5vcHRpb25zLnNlcnZpY2VzID0gX19hc3NpZ24oKF9iID0ge30sIF9iW2ludm9rZUlkXSA9IGludm9rZUNvbmZpZy5zcmMsIF9iKSwgX3RoaXMubWFjaGluZS5vcHRpb25zLnNlcnZpY2VzKTtcbiAgICAgICAgcmV0dXJuIHRvSW52b2tlRGVmaW5pdGlvbihfX2Fzc2lnbihfX2Fzc2lnbih7XG4gICAgICAgICAgaWQ6IGludm9rZUlkXG4gICAgICAgIH0sIGludm9rZUNvbmZpZyksIHtcbiAgICAgICAgICBzcmM6IGludm9rZUlkXG4gICAgICAgIH0pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBpbnZva2VTb3VyY2UgPSBpbnZva2VDb25maWcuc3JjO1xuICAgICAgICByZXR1cm4gdG9JbnZva2VEZWZpbml0aW9uKF9fYXNzaWduKF9fYXNzaWduKHtcbiAgICAgICAgICBpZDogY3JlYXRlSW52b2tlSWQoX3RoaXMuaWQsIGkpXG4gICAgICAgIH0sIGludm9rZUNvbmZpZyksIHtcbiAgICAgICAgICBzcmM6IGludm9rZVNvdXJjZVxuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5hY3Rpdml0aWVzID0gdG9BcnJheSh0aGlzLmNvbmZpZy5hY3Rpdml0aWVzKS5jb25jYXQodGhpcy5pbnZva2UpLm1hcChmdW5jdGlvbiAoYWN0aXZpdHkpIHtcbiAgICAgIHJldHVybiB0b0FjdGl2aXR5RGVmaW5pdGlvbihhY3Rpdml0eSk7XG4gICAgfSk7XG4gICAgdGhpcy50cmFuc2l0aW9uID0gdGhpcy50cmFuc2l0aW9uLmJpbmQodGhpcyk7XG4gICAgdGhpcy50YWdzID0gdG9BcnJheSh0aGlzLmNvbmZpZy50YWdzKTsgLy8gVE9ETzogdGhpcyBpcyB0aGUgcmVhbCBmaXggZm9yIGluaXRpYWxpemF0aW9uIG9uY2VcbiAgICAvLyBzdGF0ZSBub2RlIGdldHRlcnMgYXJlIGRlcHJlY2F0ZWRcbiAgICAvLyBpZiAoIXRoaXMucGFyZW50KSB7XG4gICAgLy8gICB0aGlzLl9pbml0KCk7XG4gICAgLy8gfVxuICB9XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5fX2NhY2hlLnRyYW5zaXRpb25zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZ2V0QWxsU3RhdGVOb2Rlcyh0aGlzKS5mb3JFYWNoKGZ1bmN0aW9uIChzdGF0ZU5vZGUpIHtcbiAgICAgIHJldHVybiBzdGF0ZU5vZGUub247XG4gICAgfSk7XG4gIH07XG4gIC8qKlxyXG4gICAqIENsb25lcyB0aGlzIHN0YXRlIG1hY2hpbmUgd2l0aCBjdXN0b20gb3B0aW9ucyBhbmQgY29udGV4dC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgKGFjdGlvbnMsIGd1YXJkcywgYWN0aXZpdGllcywgc2VydmljZXMpIHRvIHJlY3Vyc2l2ZWx5IG1lcmdlIHdpdGggdGhlIGV4aXN0aW5nIG9wdGlvbnMuXHJcbiAgICogQHBhcmFtIGNvbnRleHQgQ3VzdG9tIGNvbnRleHQgKHdpbGwgb3ZlcnJpZGUgcHJlZGVmaW5lZCBjb250ZXh0KVxyXG4gICAqL1xuXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS53aXRoQ29uZmlnID0gZnVuY3Rpb24gKG9wdGlvbnMsIGNvbnRleHQpIHtcbiAgICB2YXIgX2EgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgIGFjdGlvbnMgPSBfYS5hY3Rpb25zLFxuICAgICAgICBhY3Rpdml0aWVzID0gX2EuYWN0aXZpdGllcyxcbiAgICAgICAgZ3VhcmRzID0gX2EuZ3VhcmRzLFxuICAgICAgICBzZXJ2aWNlcyA9IF9hLnNlcnZpY2VzLFxuICAgICAgICBkZWxheXMgPSBfYS5kZWxheXM7XG4gICAgcmV0dXJuIG5ldyBTdGF0ZU5vZGUodGhpcy5jb25maWcsIHtcbiAgICAgIGFjdGlvbnM6IF9fYXNzaWduKF9fYXNzaWduKHt9LCBhY3Rpb25zKSwgb3B0aW9ucy5hY3Rpb25zKSxcbiAgICAgIGFjdGl2aXRpZXM6IF9fYXNzaWduKF9fYXNzaWduKHt9LCBhY3Rpdml0aWVzKSwgb3B0aW9ucy5hY3Rpdml0aWVzKSxcbiAgICAgIGd1YXJkczogX19hc3NpZ24oX19hc3NpZ24oe30sIGd1YXJkcyksIG9wdGlvbnMuZ3VhcmRzKSxcbiAgICAgIHNlcnZpY2VzOiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgc2VydmljZXMpLCBvcHRpb25zLnNlcnZpY2VzKSxcbiAgICAgIGRlbGF5czogX19hc3NpZ24oX19hc3NpZ24oe30sIGRlbGF5cyksIG9wdGlvbnMuZGVsYXlzKVxuICAgIH0sIGNvbnRleHQgIT09IG51bGwgJiYgY29udGV4dCAhPT0gdm9pZCAwID8gY29udGV4dCA6IHRoaXMuY29udGV4dCk7XG4gIH07XG4gIC8qKlxyXG4gICAqIENsb25lcyB0aGlzIHN0YXRlIG1hY2hpbmUgd2l0aCBjdXN0b20gY29udGV4dC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBjb250ZXh0IEN1c3RvbSBjb250ZXh0ICh3aWxsIG92ZXJyaWRlIHByZWRlZmluZWQgY29udGV4dCwgbm90IHJlY3Vyc2l2ZSlcclxuICAgKi9cblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUud2l0aENvbnRleHQgPSBmdW5jdGlvbiAoY29udGV4dCkge1xuICAgIHJldHVybiBuZXcgU3RhdGVOb2RlKHRoaXMuY29uZmlnLCB0aGlzLm9wdGlvbnMsIGNvbnRleHQpO1xuICB9O1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGF0ZU5vZGUucHJvdG90eXBlLCBcImNvbnRleHRcIiwge1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGlzRnVuY3Rpb24odGhpcy5fY29udGV4dCkgPyB0aGlzLl9jb250ZXh0KCkgOiB0aGlzLl9jb250ZXh0O1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RhdGVOb2RlLnByb3RvdHlwZSwgXCJkZWZpbml0aW9uXCIsIHtcbiAgICAvKipcclxuICAgICAqIFRoZSB3ZWxsLXN0cnVjdHVyZWQgc3RhdGUgbm9kZSBkZWZpbml0aW9uLlxyXG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogdGhpcy5pZCxcbiAgICAgICAga2V5OiB0aGlzLmtleSxcbiAgICAgICAgdmVyc2lvbjogdGhpcy52ZXJzaW9uLFxuICAgICAgICBjb250ZXh0OiB0aGlzLmNvbnRleHQsXG4gICAgICAgIHR5cGU6IHRoaXMudHlwZSxcbiAgICAgICAgaW5pdGlhbDogdGhpcy5pbml0aWFsLFxuICAgICAgICBoaXN0b3J5OiB0aGlzLmhpc3RvcnksXG4gICAgICAgIHN0YXRlczogbWFwVmFsdWVzKHRoaXMuc3RhdGVzLCBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgICByZXR1cm4gc3RhdGUuZGVmaW5pdGlvbjtcbiAgICAgICAgfSksXG4gICAgICAgIG9uOiB0aGlzLm9uLFxuICAgICAgICB0cmFuc2l0aW9uczogdGhpcy50cmFuc2l0aW9ucyxcbiAgICAgICAgZW50cnk6IHRoaXMub25FbnRyeSxcbiAgICAgICAgZXhpdDogdGhpcy5vbkV4aXQsXG4gICAgICAgIGFjdGl2aXRpZXM6IHRoaXMuYWN0aXZpdGllcyB8fCBbXSxcbiAgICAgICAgbWV0YTogdGhpcy5tZXRhLFxuICAgICAgICBvcmRlcjogdGhpcy5vcmRlciB8fCAtMSxcbiAgICAgICAgZGF0YTogdGhpcy5kb25lRGF0YSxcbiAgICAgICAgaW52b2tlOiB0aGlzLmludm9rZSxcbiAgICAgICAgZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXG4gICAgICAgIHRhZ3M6IHRoaXMudGFnc1xuICAgICAgfTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZpbml0aW9uO1xuICB9O1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGF0ZU5vZGUucHJvdG90eXBlLCBcIm9uXCIsIHtcbiAgICAvKipcclxuICAgICAqIFRoZSBtYXBwaW5nIG9mIGV2ZW50cyB0byB0cmFuc2l0aW9ucy5cclxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMuX19jYWNoZS5vbikge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2NhY2hlLm9uO1xuICAgICAgfVxuXG4gICAgICB2YXIgdHJhbnNpdGlvbnMgPSB0aGlzLnRyYW5zaXRpb25zO1xuICAgICAgcmV0dXJuIHRoaXMuX19jYWNoZS5vbiA9IHRyYW5zaXRpb25zLnJlZHVjZShmdW5jdGlvbiAobWFwLCB0cmFuc2l0aW9uKSB7XG4gICAgICAgIG1hcFt0cmFuc2l0aW9uLmV2ZW50VHlwZV0gPSBtYXBbdHJhbnNpdGlvbi5ldmVudFR5cGVdIHx8IFtdO1xuICAgICAgICBtYXBbdHJhbnNpdGlvbi5ldmVudFR5cGVdLnB1c2godHJhbnNpdGlvbik7XG4gICAgICAgIHJldHVybiBtYXA7XG4gICAgICB9LCB7fSk7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGF0ZU5vZGUucHJvdG90eXBlLCBcImFmdGVyXCIsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9fY2FjaGUuZGVsYXllZFRyYW5zaXRpb25zIHx8ICh0aGlzLl9fY2FjaGUuZGVsYXllZFRyYW5zaXRpb25zID0gdGhpcy5nZXREZWxheWVkVHJhbnNpdGlvbnMoKSwgdGhpcy5fX2NhY2hlLmRlbGF5ZWRUcmFuc2l0aW9ucyk7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGF0ZU5vZGUucHJvdG90eXBlLCBcInRyYW5zaXRpb25zXCIsIHtcbiAgICAvKipcclxuICAgICAqIEFsbCB0aGUgdHJhbnNpdGlvbnMgdGhhdCBjYW4gYmUgdGFrZW4gZnJvbSB0aGlzIHN0YXRlIG5vZGUuXHJcbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9fY2FjaGUudHJhbnNpdGlvbnMgfHwgKHRoaXMuX19jYWNoZS50cmFuc2l0aW9ucyA9IHRoaXMuZm9ybWF0VHJhbnNpdGlvbnMoKSwgdGhpcy5fX2NhY2hlLnRyYW5zaXRpb25zKTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldENhbmRpZGF0ZXMgPSBmdW5jdGlvbiAoZXZlbnROYW1lKSB7XG4gICAgaWYgKHRoaXMuX19jYWNoZS5jYW5kaWRhdGVzW2V2ZW50TmFtZV0pIHtcbiAgICAgIHJldHVybiB0aGlzLl9fY2FjaGUuY2FuZGlkYXRlc1tldmVudE5hbWVdO1xuICAgIH1cblxuICAgIHZhciB0cmFuc2llbnQgPSBldmVudE5hbWUgPT09IE5VTExfRVZFTlQ7XG4gICAgdmFyIGNhbmRpZGF0ZXMgPSB0aGlzLnRyYW5zaXRpb25zLmZpbHRlcihmdW5jdGlvbiAodHJhbnNpdGlvbikge1xuICAgICAgdmFyIHNhbWVFdmVudFR5cGUgPSB0cmFuc2l0aW9uLmV2ZW50VHlwZSA9PT0gZXZlbnROYW1lOyAvLyBudWxsIGV2ZW50cyBzaG91bGQgb25seSBtYXRjaCBhZ2FpbnN0IGV2ZW50bGVzcyB0cmFuc2l0aW9uc1xuXG4gICAgICByZXR1cm4gdHJhbnNpZW50ID8gc2FtZUV2ZW50VHlwZSA6IHNhbWVFdmVudFR5cGUgfHwgdHJhbnNpdGlvbi5ldmVudFR5cGUgPT09IFdJTERDQVJEO1xuICAgIH0pO1xuICAgIHRoaXMuX19jYWNoZS5jYW5kaWRhdGVzW2V2ZW50TmFtZV0gPSBjYW5kaWRhdGVzO1xuICAgIHJldHVybiBjYW5kaWRhdGVzO1xuICB9O1xuICAvKipcclxuICAgKiBBbGwgZGVsYXllZCB0cmFuc2l0aW9ucyBmcm9tIHRoZSBjb25maWcuXHJcbiAgICovXG5cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldERlbGF5ZWRUcmFuc2l0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIGFmdGVyQ29uZmlnID0gdGhpcy5jb25maWcuYWZ0ZXI7XG5cbiAgICBpZiAoIWFmdGVyQ29uZmlnKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgdmFyIG11dGF0ZUVudHJ5RXhpdCA9IGZ1bmN0aW9uIChkZWxheSwgaSkge1xuICAgICAgdmFyIGRlbGF5UmVmID0gaXNGdW5jdGlvbihkZWxheSkgPyBcIlwiLmNvbmNhdChfdGhpcy5pZCwgXCI6ZGVsYXlbXCIpLmNvbmNhdChpLCBcIl1cIikgOiBkZWxheTtcbiAgICAgIHZhciBldmVudFR5cGUgPSBhZnRlcihkZWxheVJlZiwgX3RoaXMuaWQpO1xuXG4gICAgICBfdGhpcy5vbkVudHJ5LnB1c2goc2VuZChldmVudFR5cGUsIHtcbiAgICAgICAgZGVsYXk6IGRlbGF5XG4gICAgICB9KSk7XG5cbiAgICAgIF90aGlzLm9uRXhpdC5wdXNoKGNhbmNlbChldmVudFR5cGUpKTtcblxuICAgICAgcmV0dXJuIGV2ZW50VHlwZTtcbiAgICB9O1xuXG4gICAgdmFyIGRlbGF5ZWRUcmFuc2l0aW9ucyA9IGlzQXJyYXkoYWZ0ZXJDb25maWcpID8gYWZ0ZXJDb25maWcubWFwKGZ1bmN0aW9uICh0cmFuc2l0aW9uLCBpKSB7XG4gICAgICB2YXIgZXZlbnRUeXBlID0gbXV0YXRlRW50cnlFeGl0KHRyYW5zaXRpb24uZGVsYXksIGkpO1xuICAgICAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCB0cmFuc2l0aW9uKSwge1xuICAgICAgICBldmVudDogZXZlbnRUeXBlXG4gICAgICB9KTtcbiAgICB9KSA6IGZsYXR0ZW4oT2JqZWN0LmtleXMoYWZ0ZXJDb25maWcpLm1hcChmdW5jdGlvbiAoZGVsYXksIGkpIHtcbiAgICAgIHZhciBjb25maWdUcmFuc2l0aW9uID0gYWZ0ZXJDb25maWdbZGVsYXldO1xuICAgICAgdmFyIHJlc29sdmVkVHJhbnNpdGlvbiA9IGlzU3RyaW5nKGNvbmZpZ1RyYW5zaXRpb24pID8ge1xuICAgICAgICB0YXJnZXQ6IGNvbmZpZ1RyYW5zaXRpb25cbiAgICAgIH0gOiBjb25maWdUcmFuc2l0aW9uO1xuICAgICAgdmFyIHJlc29sdmVkRGVsYXkgPSAhaXNOYU4oK2RlbGF5KSA/ICtkZWxheSA6IGRlbGF5O1xuICAgICAgdmFyIGV2ZW50VHlwZSA9IG11dGF0ZUVudHJ5RXhpdChyZXNvbHZlZERlbGF5LCBpKTtcbiAgICAgIHJldHVybiB0b0FycmF5KHJlc29sdmVkVHJhbnNpdGlvbikubWFwKGZ1bmN0aW9uICh0cmFuc2l0aW9uKSB7XG4gICAgICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgdHJhbnNpdGlvbiksIHtcbiAgICAgICAgICBldmVudDogZXZlbnRUeXBlLFxuICAgICAgICAgIGRlbGF5OiByZXNvbHZlZERlbGF5XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSkpO1xuICAgIHJldHVybiBkZWxheWVkVHJhbnNpdGlvbnMubWFwKGZ1bmN0aW9uIChkZWxheWVkVHJhbnNpdGlvbikge1xuICAgICAgdmFyIGRlbGF5ID0gZGVsYXllZFRyYW5zaXRpb24uZGVsYXk7XG4gICAgICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIF90aGlzLmZvcm1hdFRyYW5zaXRpb24oZGVsYXllZFRyYW5zaXRpb24pKSwge1xuICAgICAgICBkZWxheTogZGVsYXlcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBzdGF0ZSBub2RlcyByZXByZXNlbnRlZCBieSB0aGUgY3VycmVudCBzdGF0ZSB2YWx1ZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBzdGF0ZSBUaGUgc3RhdGUgdmFsdWUgb3IgU3RhdGUgaW5zdGFuY2VcclxuICAgKi9cblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZ2V0U3RhdGVOb2RlcyA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIHZhciBfYTtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoIXN0YXRlKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgdmFyIHN0YXRlVmFsdWUgPSBzdGF0ZSBpbnN0YW5jZW9mIFN0YXRlID8gc3RhdGUudmFsdWUgOiB0b1N0YXRlVmFsdWUoc3RhdGUsIHRoaXMuZGVsaW1pdGVyKTtcblxuICAgIGlmIChpc1N0cmluZyhzdGF0ZVZhbHVlKSkge1xuICAgICAgdmFyIGluaXRpYWxTdGF0ZVZhbHVlID0gdGhpcy5nZXRTdGF0ZU5vZGUoc3RhdGVWYWx1ZSkuaW5pdGlhbDtcbiAgICAgIHJldHVybiBpbml0aWFsU3RhdGVWYWx1ZSAhPT0gdW5kZWZpbmVkID8gdGhpcy5nZXRTdGF0ZU5vZGVzKChfYSA9IHt9LCBfYVtzdGF0ZVZhbHVlXSA9IGluaXRpYWxTdGF0ZVZhbHVlLCBfYSkpIDogW3RoaXMsIHRoaXMuc3RhdGVzW3N0YXRlVmFsdWVdXTtcbiAgICB9XG5cbiAgICB2YXIgc3ViU3RhdGVLZXlzID0gT2JqZWN0LmtleXMoc3RhdGVWYWx1ZSk7XG4gICAgdmFyIHN1YlN0YXRlTm9kZXMgPSBbdGhpc107XG4gICAgc3ViU3RhdGVOb2Rlcy5wdXNoLmFwcGx5KHN1YlN0YXRlTm9kZXMsIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChmbGF0dGVuKHN1YlN0YXRlS2V5cy5tYXAoZnVuY3Rpb24gKHN1YlN0YXRlS2V5KSB7XG4gICAgICByZXR1cm4gX3RoaXMuZ2V0U3RhdGVOb2RlKHN1YlN0YXRlS2V5KS5nZXRTdGF0ZU5vZGVzKHN0YXRlVmFsdWVbc3ViU3RhdGVLZXldKTtcbiAgICB9KSkpLCBmYWxzZSkpO1xuICAgIHJldHVybiBzdWJTdGF0ZU5vZGVzO1xuICB9O1xuICAvKipcclxuICAgKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGlzIHN0YXRlIG5vZGUgZXhwbGljaXRseSBoYW5kbGVzIHRoZSBnaXZlbiBldmVudC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgaW4gcXVlc3Rpb25cclxuICAgKi9cblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuaGFuZGxlcyA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBldmVudFR5cGUgPSBnZXRFdmVudFR5cGUoZXZlbnQpO1xuICAgIHJldHVybiB0aGlzLmV2ZW50cy5pbmNsdWRlcyhldmVudFR5cGUpO1xuICB9O1xuICAvKipcclxuICAgKiBSZXNvbHZlcyB0aGUgZ2l2ZW4gYHN0YXRlYCB0byBhIG5ldyBgU3RhdGVgIGluc3RhbmNlIHJlbGF0aXZlIHRvIHRoaXMgbWFjaGluZS5cclxuICAgKlxyXG4gICAqIFRoaXMgZW5zdXJlcyB0aGF0IGAuZXZlbnRzYCBhbmQgYC5uZXh0RXZlbnRzYCByZXByZXNlbnQgdGhlIGNvcnJlY3QgdmFsdWVzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHN0YXRlIFRoZSBzdGF0ZSB0byByZXNvbHZlXHJcbiAgICovXG5cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLnJlc29sdmVTdGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIHZhciBzdGF0ZUZyb21Db25maWcgPSBzdGF0ZSBpbnN0YW5jZW9mIFN0YXRlID8gc3RhdGUgOiBTdGF0ZS5jcmVhdGUoc3RhdGUpO1xuICAgIHZhciBjb25maWd1cmF0aW9uID0gQXJyYXkuZnJvbShnZXRDb25maWd1cmF0aW9uKFtdLCB0aGlzLmdldFN0YXRlTm9kZXMoc3RhdGVGcm9tQ29uZmlnLnZhbHVlKSkpO1xuICAgIHJldHVybiBuZXcgU3RhdGUoX19hc3NpZ24oX19hc3NpZ24oe30sIHN0YXRlRnJvbUNvbmZpZyksIHtcbiAgICAgIHZhbHVlOiB0aGlzLnJlc29sdmUoc3RhdGVGcm9tQ29uZmlnLnZhbHVlKSxcbiAgICAgIGNvbmZpZ3VyYXRpb246IGNvbmZpZ3VyYXRpb24sXG4gICAgICBkb25lOiBpc0luRmluYWxTdGF0ZShjb25maWd1cmF0aW9uLCB0aGlzKSxcbiAgICAgIHRhZ3M6IGdldFRhZ3NGcm9tQ29uZmlndXJhdGlvbihjb25maWd1cmF0aW9uKSxcbiAgICAgIG1hY2hpbmU6IHRoaXMubWFjaGluZVxuICAgIH0pKTtcbiAgfTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLnRyYW5zaXRpb25MZWFmTm9kZSA9IGZ1bmN0aW9uIChzdGF0ZVZhbHVlLCBzdGF0ZSwgX2V2ZW50KSB7XG4gICAgdmFyIHN0YXRlTm9kZSA9IHRoaXMuZ2V0U3RhdGVOb2RlKHN0YXRlVmFsdWUpO1xuICAgIHZhciBuZXh0ID0gc3RhdGVOb2RlLm5leHQoc3RhdGUsIF9ldmVudCk7XG5cbiAgICBpZiAoIW5leHQgfHwgIW5leHQudHJhbnNpdGlvbnMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdGhpcy5uZXh0KHN0YXRlLCBfZXZlbnQpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXh0O1xuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUudHJhbnNpdGlvbkNvbXBvdW5kTm9kZSA9IGZ1bmN0aW9uIChzdGF0ZVZhbHVlLCBzdGF0ZSwgX2V2ZW50KSB7XG4gICAgdmFyIHN1YlN0YXRlS2V5cyA9IE9iamVjdC5rZXlzKHN0YXRlVmFsdWUpO1xuICAgIHZhciBzdGF0ZU5vZGUgPSB0aGlzLmdldFN0YXRlTm9kZShzdWJTdGF0ZUtleXNbMF0pO1xuXG4gICAgdmFyIG5leHQgPSBzdGF0ZU5vZGUuX3RyYW5zaXRpb24oc3RhdGVWYWx1ZVtzdWJTdGF0ZUtleXNbMF1dLCBzdGF0ZSwgX2V2ZW50KTtcblxuICAgIGlmICghbmV4dCB8fCAhbmV4dC50cmFuc2l0aW9ucy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0aGlzLm5leHQoc3RhdGUsIF9ldmVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5leHQ7XG4gIH07XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS50cmFuc2l0aW9uUGFyYWxsZWxOb2RlID0gZnVuY3Rpb24gKHN0YXRlVmFsdWUsIHN0YXRlLCBfZXZlbnQpIHtcbiAgICB2YXIgZV8yLCBfYTtcblxuICAgIHZhciB0cmFuc2l0aW9uTWFwID0ge307XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2IgPSBfX3ZhbHVlcyhPYmplY3Qua2V5cyhzdGF0ZVZhbHVlKSksIF9jID0gX2IubmV4dCgpOyAhX2MuZG9uZTsgX2MgPSBfYi5uZXh0KCkpIHtcbiAgICAgICAgdmFyIHN1YlN0YXRlS2V5ID0gX2MudmFsdWU7XG4gICAgICAgIHZhciBzdWJTdGF0ZVZhbHVlID0gc3RhdGVWYWx1ZVtzdWJTdGF0ZUtleV07XG5cbiAgICAgICAgaWYgKCFzdWJTdGF0ZVZhbHVlKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3ViU3RhdGVOb2RlID0gdGhpcy5nZXRTdGF0ZU5vZGUoc3ViU3RhdGVLZXkpO1xuXG4gICAgICAgIHZhciBuZXh0ID0gc3ViU3RhdGVOb2RlLl90cmFuc2l0aW9uKHN1YlN0YXRlVmFsdWUsIHN0YXRlLCBfZXZlbnQpO1xuXG4gICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgdHJhbnNpdGlvbk1hcFtzdWJTdGF0ZUtleV0gPSBuZXh0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV8yXzEpIHtcbiAgICAgIGVfMiA9IHtcbiAgICAgICAgZXJyb3I6IGVfMl8xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoX2MgJiYgIV9jLmRvbmUgJiYgKF9hID0gX2IucmV0dXJuKSkgX2EuY2FsbChfYik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV8yKSB0aHJvdyBlXzIuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHN0YXRlVHJhbnNpdGlvbnMgPSBPYmplY3Qua2V5cyh0cmFuc2l0aW9uTWFwKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgcmV0dXJuIHRyYW5zaXRpb25NYXBba2V5XTtcbiAgICB9KTtcbiAgICB2YXIgZW5hYmxlZFRyYW5zaXRpb25zID0gZmxhdHRlbihzdGF0ZVRyYW5zaXRpb25zLm1hcChmdW5jdGlvbiAoc3QpIHtcbiAgICAgIHJldHVybiBzdC50cmFuc2l0aW9ucztcbiAgICB9KSk7XG4gICAgdmFyIHdpbGxUcmFuc2l0aW9uID0gc3RhdGVUcmFuc2l0aW9ucy5zb21lKGZ1bmN0aW9uIChzdCkge1xuICAgICAgcmV0dXJuIHN0LnRyYW5zaXRpb25zLmxlbmd0aCA+IDA7XG4gICAgfSk7XG5cbiAgICBpZiAoIXdpbGxUcmFuc2l0aW9uKSB7XG4gICAgICByZXR1cm4gdGhpcy5uZXh0KHN0YXRlLCBfZXZlbnQpO1xuICAgIH1cblxuICAgIHZhciBjb25maWd1cmF0aW9uID0gZmxhdHRlbihPYmplY3Qua2V5cyh0cmFuc2l0aW9uTWFwKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgcmV0dXJuIHRyYW5zaXRpb25NYXBba2V5XS5jb25maWd1cmF0aW9uO1xuICAgIH0pKTtcbiAgICByZXR1cm4ge1xuICAgICAgdHJhbnNpdGlvbnM6IGVuYWJsZWRUcmFuc2l0aW9ucyxcbiAgICAgIGV4aXRTZXQ6IGZsYXR0ZW4oc3RhdGVUcmFuc2l0aW9ucy5tYXAoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgcmV0dXJuIHQuZXhpdFNldDtcbiAgICAgIH0pKSxcbiAgICAgIGNvbmZpZ3VyYXRpb246IGNvbmZpZ3VyYXRpb24sXG4gICAgICBzb3VyY2U6IHN0YXRlLFxuICAgICAgYWN0aW9uczogZmxhdHRlbihPYmplY3Qua2V5cyh0cmFuc2l0aW9uTWFwKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4gdHJhbnNpdGlvbk1hcFtrZXldLmFjdGlvbnM7XG4gICAgICB9KSlcbiAgICB9O1xuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuX3RyYW5zaXRpb24gPSBmdW5jdGlvbiAoc3RhdGVWYWx1ZSwgc3RhdGUsIF9ldmVudCkge1xuICAgIC8vIGxlYWYgbm9kZVxuICAgIGlmIChpc1N0cmluZyhzdGF0ZVZhbHVlKSkge1xuICAgICAgcmV0dXJuIHRoaXMudHJhbnNpdGlvbkxlYWZOb2RlKHN0YXRlVmFsdWUsIHN0YXRlLCBfZXZlbnQpO1xuICAgIH0gLy8gaGllcmFyY2hpY2FsIG5vZGVcblxuXG4gICAgaWYgKE9iamVjdC5rZXlzKHN0YXRlVmFsdWUpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIHRoaXMudHJhbnNpdGlvbkNvbXBvdW5kTm9kZShzdGF0ZVZhbHVlLCBzdGF0ZSwgX2V2ZW50KTtcbiAgICB9IC8vIG9ydGhvZ29uYWwgbm9kZVxuXG5cbiAgICByZXR1cm4gdGhpcy50cmFuc2l0aW9uUGFyYWxsZWxOb2RlKHN0YXRlVmFsdWUsIHN0YXRlLCBfZXZlbnQpO1xuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZ2V0VHJhbnNpdGlvbkRhdGEgPSBmdW5jdGlvbiAoc3RhdGUsIGV2ZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuX3RyYW5zaXRpb24oc3RhdGUudmFsdWUsIHN0YXRlLCB0b1NDWE1MRXZlbnQoZXZlbnQpKTtcbiAgfTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoc3RhdGUsIF9ldmVudCkge1xuICAgIHZhciBlXzMsIF9hO1xuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBldmVudE5hbWUgPSBfZXZlbnQubmFtZTtcbiAgICB2YXIgYWN0aW9ucyA9IFtdO1xuICAgIHZhciBuZXh0U3RhdGVOb2RlcyA9IFtdO1xuICAgIHZhciBzZWxlY3RlZFRyYW5zaXRpb247XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2IgPSBfX3ZhbHVlcyh0aGlzLmdldENhbmRpZGF0ZXMoZXZlbnROYW1lKSksIF9jID0gX2IubmV4dCgpOyAhX2MuZG9uZTsgX2MgPSBfYi5uZXh0KCkpIHtcbiAgICAgICAgdmFyIGNhbmRpZGF0ZSA9IF9jLnZhbHVlO1xuICAgICAgICB2YXIgY29uZCA9IGNhbmRpZGF0ZS5jb25kLFxuICAgICAgICAgICAgc3RhdGVJbiA9IGNhbmRpZGF0ZS5pbjtcbiAgICAgICAgdmFyIHJlc29sdmVkQ29udGV4dCA9IHN0YXRlLmNvbnRleHQ7XG4gICAgICAgIHZhciBpc0luU3RhdGUgPSBzdGF0ZUluID8gaXNTdHJpbmcoc3RhdGVJbikgJiYgaXNTdGF0ZUlkKHN0YXRlSW4pID8gLy8gQ2hlY2sgaWYgaW4gc3RhdGUgYnkgSURcbiAgICAgICAgc3RhdGUubWF0Y2hlcyh0b1N0YXRlVmFsdWUodGhpcy5nZXRTdGF0ZU5vZGVCeUlkKHN0YXRlSW4pLnBhdGgsIHRoaXMuZGVsaW1pdGVyKSkgOiAvLyBDaGVjayBpZiBpbiBzdGF0ZSBieSByZWxhdGl2ZSBncmFuZHBhcmVudFxuICAgICAgICBtYXRjaGVzU3RhdGUodG9TdGF0ZVZhbHVlKHN0YXRlSW4sIHRoaXMuZGVsaW1pdGVyKSwgcGF0aCh0aGlzLnBhdGguc2xpY2UoMCwgLTIpKShzdGF0ZS52YWx1ZSkpIDogdHJ1ZTtcbiAgICAgICAgdmFyIGd1YXJkUGFzc2VkID0gZmFsc2U7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBndWFyZFBhc3NlZCA9ICFjb25kIHx8IGV2YWx1YXRlR3VhcmQodGhpcy5tYWNoaW5lLCBjb25kLCByZXNvbHZlZENvbnRleHQsIF9ldmVudCwgc3RhdGUpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmFibGUgdG8gZXZhbHVhdGUgZ3VhcmQgJ1wiLmNvbmNhdChjb25kLm5hbWUgfHwgY29uZC50eXBlLCBcIicgaW4gdHJhbnNpdGlvbiBmb3IgZXZlbnQgJ1wiKS5jb25jYXQoZXZlbnROYW1lLCBcIicgaW4gc3RhdGUgbm9kZSAnXCIpLmNvbmNhdCh0aGlzLmlkLCBcIic6XFxuXCIpLmNvbmNhdChlcnIubWVzc2FnZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGd1YXJkUGFzc2VkICYmIGlzSW5TdGF0ZSkge1xuICAgICAgICAgIGlmIChjYW5kaWRhdGUudGFyZ2V0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG5leHRTdGF0ZU5vZGVzID0gY2FuZGlkYXRlLnRhcmdldDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBhY3Rpb25zLnB1c2guYXBwbHkoYWN0aW9ucywgX19zcHJlYWRBcnJheShbXSwgX19yZWFkKGNhbmRpZGF0ZS5hY3Rpb25zKSwgZmFsc2UpKTtcbiAgICAgICAgICBzZWxlY3RlZFRyYW5zaXRpb24gPSBjYW5kaWRhdGU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzNfMSkge1xuICAgICAgZV8zID0ge1xuICAgICAgICBlcnJvcjogZV8zXzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfYyAmJiAhX2MuZG9uZSAmJiAoX2EgPSBfYi5yZXR1cm4pKSBfYS5jYWxsKF9iKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzMpIHRocm93IGVfMy5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXNlbGVjdGVkVHJhbnNpdGlvbikge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAoIW5leHRTdGF0ZU5vZGVzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHJhbnNpdGlvbnM6IFtzZWxlY3RlZFRyYW5zaXRpb25dLFxuICAgICAgICBleGl0U2V0OiBbXSxcbiAgICAgICAgY29uZmlndXJhdGlvbjogc3RhdGUudmFsdWUgPyBbdGhpc10gOiBbXSxcbiAgICAgICAgc291cmNlOiBzdGF0ZSxcbiAgICAgICAgYWN0aW9uczogYWN0aW9uc1xuICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgYWxsTmV4dFN0YXRlTm9kZXMgPSBmbGF0dGVuKG5leHRTdGF0ZU5vZGVzLm1hcChmdW5jdGlvbiAoc3RhdGVOb2RlKSB7XG4gICAgICByZXR1cm4gX3RoaXMuZ2V0UmVsYXRpdmVTdGF0ZU5vZGVzKHN0YXRlTm9kZSwgc3RhdGUuaGlzdG9yeVZhbHVlKTtcbiAgICB9KSk7XG4gICAgdmFyIGlzSW50ZXJuYWwgPSAhIXNlbGVjdGVkVHJhbnNpdGlvbi5pbnRlcm5hbDtcbiAgICByZXR1cm4ge1xuICAgICAgdHJhbnNpdGlvbnM6IFtzZWxlY3RlZFRyYW5zaXRpb25dLFxuICAgICAgZXhpdFNldDogaXNJbnRlcm5hbCA/IFtdIDogZmxhdHRlbihuZXh0U3RhdGVOb2Rlcy5tYXAoZnVuY3Rpb24gKHRhcmdldE5vZGUpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLmdldFBvdGVudGlhbGx5UmVlbnRlcmluZ05vZGVzKHRhcmdldE5vZGUpO1xuICAgICAgfSkpLFxuICAgICAgY29uZmlndXJhdGlvbjogYWxsTmV4dFN0YXRlTm9kZXMsXG4gICAgICBzb3VyY2U6IHN0YXRlLFxuICAgICAgYWN0aW9uczogYWN0aW9uc1xuICAgIH07XG4gIH07IC8vIGV2ZW4gdGhvdWdoIHRoZSBuYW1lIG9mIHRoaXMgZnVuY3Rpb24gbWVudGlvbnMgcmVlbnRyeSBub2Rlc1xuICAvLyB3ZSBhcmUgcHVzaGluZyBpdHMgcmVzdWx0IGludG8gYGV4aXRTZXRgXG4gIC8vIHRoYXQncyBiZWNhdXNlIHdoYXQgd2UgZXhpdCBtaWdodCBiZSByZWVudGVyZWQgKGl0J3MgYW4gaW52YXJpYW50IG9mIHJlZW50cmFuY3kpXG5cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldFBvdGVudGlhbGx5UmVlbnRlcmluZ05vZGVzID0gZnVuY3Rpb24gKHRhcmdldE5vZGUpIHtcbiAgICBpZiAodGhpcy5vcmRlciA8IHRhcmdldE5vZGUub3JkZXIpIHtcbiAgICAgIHJldHVybiBbdGhpc107XG4gICAgfVxuXG4gICAgdmFyIG5vZGVzID0gW107XG4gICAgdmFyIG1hcmtlciA9IHRoaXM7XG4gICAgdmFyIHBvc3NpYmxlQW5jZXN0b3IgPSB0YXJnZXROb2RlO1xuXG4gICAgd2hpbGUgKG1hcmtlciAmJiBtYXJrZXIgIT09IHBvc3NpYmxlQW5jZXN0b3IpIHtcbiAgICAgIG5vZGVzLnB1c2gobWFya2VyKTtcbiAgICAgIG1hcmtlciA9IG1hcmtlci5wYXJlbnQ7XG4gICAgfVxuXG4gICAgaWYgKG1hcmtlciAhPT0gcG9zc2libGVBbmNlc3Rvcikge1xuICAgICAgLy8gd2UgbmV2ZXIgZ290IHRvIGBwb3NzaWJsZUFuY2VzdG9yYCwgdGhlcmVmb3JlIHRoZSBpbml0aWFsIGBtYXJrZXJgIFwiZXNjYXBlc1wiIGl0XG4gICAgICAvLyBpdCdzIGluIGEgZGlmZmVyZW50IHBhcnQgb2YgdGhlIHRyZWUgc28gbm8gc3RhdGVzIHdpbGwgYmUgcmVlbnRlcmVkIGZvciBzdWNoIGFuIGV4dGVybmFsIHRyYW5zaXRpb25cbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBub2Rlcy5wdXNoKHBvc3NpYmxlQW5jZXN0b3IpO1xuICAgIHJldHVybiBub2RlcztcbiAgfTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldEFjdGlvbnMgPSBmdW5jdGlvbiAocmVzb2x2ZWRDb25maWcsIGlzRG9uZSwgdHJhbnNpdGlvbiwgY3VycmVudENvbnRleHQsIF9ldmVudCwgcHJldlN0YXRlLCBwcmVkaWN0YWJsZUV4ZWMpIHtcbiAgICB2YXIgZV80LCBfYSwgZV81LCBfYjtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgcHJldkNvbmZpZyA9IHByZXZTdGF0ZSA/IGdldENvbmZpZ3VyYXRpb24oW10sIHRoaXMuZ2V0U3RhdGVOb2RlcyhwcmV2U3RhdGUudmFsdWUpKSA6IFtdO1xuICAgIHZhciBlbnRyeVNldCA9IG5ldyBTZXQoKTtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBfYyA9IF9fdmFsdWVzKEFycmF5LmZyb20ocmVzb2x2ZWRDb25maWcpLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEub3JkZXIgLSBiLm9yZGVyO1xuICAgICAgfSkpLCBfZCA9IF9jLm5leHQoKTsgIV9kLmRvbmU7IF9kID0gX2MubmV4dCgpKSB7XG4gICAgICAgIHZhciBzbiA9IF9kLnZhbHVlO1xuXG4gICAgICAgIGlmICghaGFzKHByZXZDb25maWcsIHNuKSB8fCBoYXModHJhbnNpdGlvbi5leGl0U2V0LCBzbikgfHwgc24ucGFyZW50ICYmIGVudHJ5U2V0Lmhhcyhzbi5wYXJlbnQpKSB7XG4gICAgICAgICAgZW50cnlTZXQuYWRkKHNuKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfNF8xKSB7XG4gICAgICBlXzQgPSB7XG4gICAgICAgIGVycm9yOiBlXzRfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKF9kICYmICFfZC5kb25lICYmIChfYSA9IF9jLnJldHVybikpIF9hLmNhbGwoX2MpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfNCkgdGhyb3cgZV80LmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBwcmV2Q29uZmlnXzEgPSBfX3ZhbHVlcyhwcmV2Q29uZmlnKSwgcHJldkNvbmZpZ18xXzEgPSBwcmV2Q29uZmlnXzEubmV4dCgpOyAhcHJldkNvbmZpZ18xXzEuZG9uZTsgcHJldkNvbmZpZ18xXzEgPSBwcmV2Q29uZmlnXzEubmV4dCgpKSB7XG4gICAgICAgIHZhciBzbiA9IHByZXZDb25maWdfMV8xLnZhbHVlO1xuXG4gICAgICAgIGlmICghaGFzKHJlc29sdmVkQ29uZmlnLCBzbikgfHwgaGFzKHRyYW5zaXRpb24uZXhpdFNldCwgc24ucGFyZW50KSkge1xuICAgICAgICAgIHRyYW5zaXRpb24uZXhpdFNldC5wdXNoKHNuKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfNV8xKSB7XG4gICAgICBlXzUgPSB7XG4gICAgICAgIGVycm9yOiBlXzVfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHByZXZDb25maWdfMV8xICYmICFwcmV2Q29uZmlnXzFfMS5kb25lICYmIChfYiA9IHByZXZDb25maWdfMS5yZXR1cm4pKSBfYi5jYWxsKHByZXZDb25maWdfMSk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV81KSB0aHJvdyBlXzUuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdHJhbnNpdGlvbi5leGl0U2V0LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBiLm9yZGVyIC0gYS5vcmRlcjtcbiAgICB9KTtcbiAgICB2YXIgZW50cnlTdGF0ZXMgPSBBcnJheS5mcm9tKGVudHJ5U2V0KS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICByZXR1cm4gYS5vcmRlciAtIGIub3JkZXI7XG4gICAgfSk7XG4gICAgdmFyIGV4aXRTdGF0ZXMgPSBuZXcgU2V0KHRyYW5zaXRpb24uZXhpdFNldCk7XG4gICAgdmFyIGRvbmVFdmVudHMgPSBmbGF0dGVuKGVudHJ5U3RhdGVzLm1hcChmdW5jdGlvbiAoc24pIHtcbiAgICAgIHZhciBldmVudHMgPSBbXTtcblxuICAgICAgaWYgKHNuLnR5cGUgIT09ICdmaW5hbCcpIHtcbiAgICAgICAgcmV0dXJuIGV2ZW50cztcbiAgICAgIH1cblxuICAgICAgdmFyIHBhcmVudCA9IHNuLnBhcmVudDtcblxuICAgICAgaWYgKCFwYXJlbnQucGFyZW50KSB7XG4gICAgICAgIHJldHVybiBldmVudHM7XG4gICAgICB9XG5cbiAgICAgIGV2ZW50cy5wdXNoKGRvbmUoc24uaWQsIHNuLmRvbmVEYXRhKSwgLy8gVE9ETzogZGVwcmVjYXRlIC0gZmluYWwgc3RhdGVzIHNob3VsZCBub3QgZW1pdCBkb25lIGV2ZW50cyBmb3IgdGhlaXIgb3duIHN0YXRlLlxuICAgICAgZG9uZShwYXJlbnQuaWQsIHNuLmRvbmVEYXRhID8gbWFwQ29udGV4dChzbi5kb25lRGF0YSwgY3VycmVudENvbnRleHQsIF9ldmVudCkgOiB1bmRlZmluZWQpKTtcbiAgICAgIHZhciBncmFuZHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG5cbiAgICAgIGlmIChncmFuZHBhcmVudC50eXBlID09PSAncGFyYWxsZWwnKSB7XG4gICAgICAgIGlmIChnZXRDaGlsZHJlbihncmFuZHBhcmVudCkuZXZlcnkoZnVuY3Rpb24gKHBhcmVudE5vZGUpIHtcbiAgICAgICAgICByZXR1cm4gaXNJbkZpbmFsU3RhdGUodHJhbnNpdGlvbi5jb25maWd1cmF0aW9uLCBwYXJlbnROb2RlKTtcbiAgICAgICAgfSkpIHtcbiAgICAgICAgICBldmVudHMucHVzaChkb25lKGdyYW5kcGFyZW50LmlkKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGV2ZW50cztcbiAgICB9KSk7XG4gICAgdmFyIGVudHJ5QWN0aW9ucyA9IGVudHJ5U3RhdGVzLm1hcChmdW5jdGlvbiAoc3RhdGVOb2RlKSB7XG4gICAgICB2YXIgZW50cnlBY3Rpb25zID0gc3RhdGVOb2RlLm9uRW50cnk7XG4gICAgICB2YXIgaW52b2tlQWN0aW9ucyA9IHN0YXRlTm9kZS5hY3Rpdml0aWVzLm1hcChmdW5jdGlvbiAoYWN0aXZpdHkpIHtcbiAgICAgICAgcmV0dXJuIHN0YXJ0KGFjdGl2aXR5KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogJ2VudHJ5JyxcbiAgICAgICAgYWN0aW9uczogdG9BY3Rpb25PYmplY3RzKHByZWRpY3RhYmxlRXhlYyA/IF9fc3ByZWFkQXJyYXkoX19zcHJlYWRBcnJheShbXSwgX19yZWFkKGVudHJ5QWN0aW9ucyksIGZhbHNlKSwgX19yZWFkKGludm9rZUFjdGlvbnMpLCBmYWxzZSkgOiBfX3NwcmVhZEFycmF5KF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChpbnZva2VBY3Rpb25zKSwgZmFsc2UpLCBfX3JlYWQoZW50cnlBY3Rpb25zKSwgZmFsc2UpLCBfdGhpcy5tYWNoaW5lLm9wdGlvbnMuYWN0aW9ucylcbiAgICAgIH07XG4gICAgfSkuY29uY2F0KHtcbiAgICAgIHR5cGU6ICdzdGF0ZV9kb25lJyxcbiAgICAgIGFjdGlvbnM6IGRvbmVFdmVudHMubWFwKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICByZXR1cm4gcmFpc2UoZXZlbnQpO1xuICAgICAgfSlcbiAgICB9KTtcbiAgICB2YXIgZXhpdEFjdGlvbnMgPSBBcnJheS5mcm9tKGV4aXRTdGF0ZXMpLm1hcChmdW5jdGlvbiAoc3RhdGVOb2RlKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAnZXhpdCcsXG4gICAgICAgIGFjdGlvbnM6IHRvQWN0aW9uT2JqZWN0cyhfX3NwcmVhZEFycmF5KF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChzdGF0ZU5vZGUub25FeGl0KSwgZmFsc2UpLCBfX3JlYWQoc3RhdGVOb2RlLmFjdGl2aXRpZXMubWFwKGZ1bmN0aW9uIChhY3Rpdml0eSkge1xuICAgICAgICAgIHJldHVybiBzdG9wKGFjdGl2aXR5KTtcbiAgICAgICAgfSkpLCBmYWxzZSksIF90aGlzLm1hY2hpbmUub3B0aW9ucy5hY3Rpb25zKVxuICAgICAgfTtcbiAgICB9KTtcbiAgICB2YXIgYWN0aW9ucyA9IGV4aXRBY3Rpb25zLmNvbmNhdCh7XG4gICAgICB0eXBlOiAndHJhbnNpdGlvbicsXG4gICAgICBhY3Rpb25zOiB0b0FjdGlvbk9iamVjdHModHJhbnNpdGlvbi5hY3Rpb25zLCB0aGlzLm1hY2hpbmUub3B0aW9ucy5hY3Rpb25zKVxuICAgIH0pLmNvbmNhdChlbnRyeUFjdGlvbnMpO1xuXG4gICAgaWYgKGlzRG9uZSkge1xuICAgICAgdmFyIHN0b3BBY3Rpb25zID0gdG9BY3Rpb25PYmplY3RzKGZsYXR0ZW4oX19zcHJlYWRBcnJheShbXSwgX19yZWFkKHJlc29sdmVkQ29uZmlnKSwgZmFsc2UpLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGIub3JkZXIgLSBhLm9yZGVyO1xuICAgICAgfSkubWFwKGZ1bmN0aW9uIChzdGF0ZU5vZGUpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlTm9kZS5vbkV4aXQ7XG4gICAgICB9KSksIHRoaXMubWFjaGluZS5vcHRpb25zLmFjdGlvbnMpLmZpbHRlcihmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICAgIHJldHVybiAhaXNSYWlzYWJsZUFjdGlvbihhY3Rpb24pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gYWN0aW9ucy5jb25jYXQoe1xuICAgICAgICB0eXBlOiAnc3RvcCcsXG4gICAgICAgIGFjdGlvbnM6IHN0b3BBY3Rpb25zXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWN0aW9ucztcbiAgfTtcbiAgLyoqXHJcbiAgICogRGV0ZXJtaW5lcyB0aGUgbmV4dCBzdGF0ZSBnaXZlbiB0aGUgY3VycmVudCBgc3RhdGVgIGFuZCBzZW50IGBldmVudGAuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gc3RhdGUgVGhlIGN1cnJlbnQgU3RhdGUgaW5zdGFuY2Ugb3Igc3RhdGUgdmFsdWVcclxuICAgKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgd2FzIHNlbnQgYXQgdGhlIGN1cnJlbnQgc3RhdGVcclxuICAgKiBAcGFyYW0gY29udGV4dCBUaGUgY3VycmVudCBjb250ZXh0IChleHRlbmRlZCBzdGF0ZSkgb2YgdGhlIGN1cnJlbnQgc3RhdGVcclxuICAgKi9cblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUudHJhbnNpdGlvbiA9IGZ1bmN0aW9uIChzdGF0ZSwgZXZlbnQsIGNvbnRleHQsIGV4ZWMpIHtcbiAgICBpZiAoc3RhdGUgPT09IHZvaWQgMCkge1xuICAgICAgc3RhdGUgPSB0aGlzLmluaXRpYWxTdGF0ZTtcbiAgICB9XG5cbiAgICB2YXIgX2V2ZW50ID0gdG9TQ1hNTEV2ZW50KGV2ZW50KTtcblxuICAgIHZhciBjdXJyZW50U3RhdGU7XG5cbiAgICBpZiAoc3RhdGUgaW5zdGFuY2VvZiBTdGF0ZSkge1xuICAgICAgY3VycmVudFN0YXRlID0gY29udGV4dCA9PT0gdW5kZWZpbmVkID8gc3RhdGUgOiB0aGlzLnJlc29sdmVTdGF0ZShTdGF0ZS5mcm9tKHN0YXRlLCBjb250ZXh0KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciByZXNvbHZlZFN0YXRlVmFsdWUgPSBpc1N0cmluZyhzdGF0ZSkgPyB0aGlzLnJlc29sdmUocGF0aFRvU3RhdGVWYWx1ZSh0aGlzLmdldFJlc29sdmVkUGF0aChzdGF0ZSkpKSA6IHRoaXMucmVzb2x2ZShzdGF0ZSk7XG4gICAgICB2YXIgcmVzb2x2ZWRDb250ZXh0ID0gY29udGV4dCAhPT0gbnVsbCAmJiBjb250ZXh0ICE9PSB2b2lkIDAgPyBjb250ZXh0IDogdGhpcy5tYWNoaW5lLmNvbnRleHQ7XG4gICAgICBjdXJyZW50U3RhdGUgPSB0aGlzLnJlc29sdmVTdGF0ZShTdGF0ZS5mcm9tKHJlc29sdmVkU3RhdGVWYWx1ZSwgcmVzb2x2ZWRDb250ZXh0KSk7XG4gICAgfVxuXG4gICAgaWYgKCFJU19QUk9EVUNUSU9OICYmIF9ldmVudC5uYW1lID09PSBXSUxEQ0FSRCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQW4gZXZlbnQgY2Fubm90IGhhdmUgdGhlIHdpbGRjYXJkIHR5cGUgKCdcIi5jb25jYXQoV0lMRENBUkQsIFwiJylcIikpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnN0cmljdCkge1xuICAgICAgaWYgKCF0aGlzLmV2ZW50cy5pbmNsdWRlcyhfZXZlbnQubmFtZSkgJiYgIWlzQnVpbHRJbkV2ZW50KF9ldmVudC5uYW1lKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNYWNoaW5lICdcIi5jb25jYXQodGhpcy5pZCwgXCInIGRvZXMgbm90IGFjY2VwdCBldmVudCAnXCIpLmNvbmNhdChfZXZlbnQubmFtZSwgXCInXCIpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgc3RhdGVUcmFuc2l0aW9uID0gdGhpcy5fdHJhbnNpdGlvbihjdXJyZW50U3RhdGUudmFsdWUsIGN1cnJlbnRTdGF0ZSwgX2V2ZW50KSB8fCB7XG4gICAgICB0cmFuc2l0aW9uczogW10sXG4gICAgICBjb25maWd1cmF0aW9uOiBbXSxcbiAgICAgIGV4aXRTZXQ6IFtdLFxuICAgICAgc291cmNlOiBjdXJyZW50U3RhdGUsXG4gICAgICBhY3Rpb25zOiBbXVxuICAgIH07XG4gICAgdmFyIHByZXZDb25maWcgPSBnZXRDb25maWd1cmF0aW9uKFtdLCB0aGlzLmdldFN0YXRlTm9kZXMoY3VycmVudFN0YXRlLnZhbHVlKSk7XG4gICAgdmFyIHJlc29sdmVkQ29uZmlnID0gc3RhdGVUcmFuc2l0aW9uLmNvbmZpZ3VyYXRpb24ubGVuZ3RoID8gZ2V0Q29uZmlndXJhdGlvbihwcmV2Q29uZmlnLCBzdGF0ZVRyYW5zaXRpb24uY29uZmlndXJhdGlvbikgOiBwcmV2Q29uZmlnO1xuICAgIHN0YXRlVHJhbnNpdGlvbi5jb25maWd1cmF0aW9uID0gX19zcHJlYWRBcnJheShbXSwgX19yZWFkKHJlc29sdmVkQ29uZmlnKSwgZmFsc2UpO1xuICAgIHJldHVybiB0aGlzLnJlc29sdmVUcmFuc2l0aW9uKHN0YXRlVHJhbnNpdGlvbiwgY3VycmVudFN0YXRlLCBjdXJyZW50U3RhdGUuY29udGV4dCwgZXhlYywgX2V2ZW50KTtcbiAgfTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLnJlc29sdmVSYWlzZWRUcmFuc2l0aW9uID0gZnVuY3Rpb24gKHN0YXRlLCBfZXZlbnQsIG9yaWdpbmFsRXZlbnQsIHByZWRpY3RhYmxlRXhlYykge1xuICAgIHZhciBfYTtcblxuICAgIHZhciBjdXJyZW50QWN0aW9ucyA9IHN0YXRlLmFjdGlvbnM7XG4gICAgc3RhdGUgPSB0aGlzLnRyYW5zaXRpb24oc3RhdGUsIF9ldmVudCwgdW5kZWZpbmVkLCBwcmVkaWN0YWJsZUV4ZWMpOyAvLyBTYXZlIG9yaWdpbmFsIGV2ZW50IHRvIHN0YXRlXG4gICAgLy8gVE9ETzogdGhpcyBzaG91bGQgYmUgdGhlIHJhaXNlZCBldmVudCEgRGVsZXRlIGluIFY1IChicmVha2luZylcblxuICAgIHN0YXRlLl9ldmVudCA9IG9yaWdpbmFsRXZlbnQ7XG4gICAgc3RhdGUuZXZlbnQgPSBvcmlnaW5hbEV2ZW50LmRhdGE7XG5cbiAgICAoX2EgPSBzdGF0ZS5hY3Rpb25zKS51bnNoaWZ0LmFwcGx5KF9hLCBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoY3VycmVudEFjdGlvbnMpLCBmYWxzZSkpO1xuXG4gICAgcmV0dXJuIHN0YXRlO1xuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUucmVzb2x2ZVRyYW5zaXRpb24gPSBmdW5jdGlvbiAoc3RhdGVUcmFuc2l0aW9uLCBjdXJyZW50U3RhdGUsIGNvbnRleHQsIHByZWRpY3RhYmxlRXhlYywgX2V2ZW50KSB7XG4gICAgdmFyIGVfNiwgX2EsIGVfNywgX2I7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKF9ldmVudCA9PT0gdm9pZCAwKSB7XG4gICAgICBfZXZlbnQgPSBpbml0RXZlbnQ7XG4gICAgfVxuXG4gICAgdmFyIGNvbmZpZ3VyYXRpb24gPSBzdGF0ZVRyYW5zaXRpb24uY29uZmlndXJhdGlvbjsgLy8gVHJhbnNpdGlvbiB3aWxsIFwiYXBwbHlcIiBpZjpcbiAgICAvLyAtIHRoaXMgaXMgdGhlIGluaXRpYWwgc3RhdGUgKHRoZXJlIGlzIG5vIGN1cnJlbnQgc3RhdGUpXG4gICAgLy8gLSBPUiB0aGVyZSBhcmUgdHJhbnNpdGlvbnNcblxuICAgIHZhciB3aWxsVHJhbnNpdGlvbiA9ICFjdXJyZW50U3RhdGUgfHwgc3RhdGVUcmFuc2l0aW9uLnRyYW5zaXRpb25zLmxlbmd0aCA+IDA7XG4gICAgdmFyIHJlc29sdmVkQ29uZmlndXJhdGlvbiA9IHdpbGxUcmFuc2l0aW9uID8gc3RhdGVUcmFuc2l0aW9uLmNvbmZpZ3VyYXRpb24gOiBjdXJyZW50U3RhdGUgPyBjdXJyZW50U3RhdGUuY29uZmlndXJhdGlvbiA6IFtdO1xuICAgIHZhciBpc0RvbmUgPSBpc0luRmluYWxTdGF0ZShyZXNvbHZlZENvbmZpZ3VyYXRpb24sIHRoaXMpO1xuICAgIHZhciByZXNvbHZlZFN0YXRlVmFsdWUgPSB3aWxsVHJhbnNpdGlvbiA/IGdldFZhbHVlKHRoaXMubWFjaGluZSwgY29uZmlndXJhdGlvbikgOiB1bmRlZmluZWQ7XG4gICAgdmFyIGhpc3RvcnlWYWx1ZSA9IGN1cnJlbnRTdGF0ZSA/IGN1cnJlbnRTdGF0ZS5oaXN0b3J5VmFsdWUgPyBjdXJyZW50U3RhdGUuaGlzdG9yeVZhbHVlIDogc3RhdGVUcmFuc2l0aW9uLnNvdXJjZSA/IHRoaXMubWFjaGluZS5oaXN0b3J5VmFsdWUoY3VycmVudFN0YXRlLnZhbHVlKSA6IHVuZGVmaW5lZCA6IHVuZGVmaW5lZDtcbiAgICB2YXIgYWN0aW9uQmxvY2tzID0gdGhpcy5nZXRBY3Rpb25zKG5ldyBTZXQocmVzb2x2ZWRDb25maWd1cmF0aW9uKSwgaXNEb25lLCBzdGF0ZVRyYW5zaXRpb24sIGNvbnRleHQsIF9ldmVudCwgY3VycmVudFN0YXRlLCBwcmVkaWN0YWJsZUV4ZWMpO1xuICAgIHZhciBhY3Rpdml0aWVzID0gY3VycmVudFN0YXRlID8gX19hc3NpZ24oe30sIGN1cnJlbnRTdGF0ZS5hY3Rpdml0aWVzKSA6IHt9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIGFjdGlvbkJsb2Nrc18xID0gX192YWx1ZXMoYWN0aW9uQmxvY2tzKSwgYWN0aW9uQmxvY2tzXzFfMSA9IGFjdGlvbkJsb2Nrc18xLm5leHQoKTsgIWFjdGlvbkJsb2Nrc18xXzEuZG9uZTsgYWN0aW9uQmxvY2tzXzFfMSA9IGFjdGlvbkJsb2Nrc18xLm5leHQoKSkge1xuICAgICAgICB2YXIgYmxvY2sgPSBhY3Rpb25CbG9ja3NfMV8xLnZhbHVlO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZm9yICh2YXIgX2MgPSAoZV83ID0gdm9pZCAwLCBfX3ZhbHVlcyhibG9jay5hY3Rpb25zKSksIF9kID0gX2MubmV4dCgpOyAhX2QuZG9uZTsgX2QgPSBfYy5uZXh0KCkpIHtcbiAgICAgICAgICAgIHZhciBhY3Rpb24gPSBfZC52YWx1ZTtcblxuICAgICAgICAgICAgaWYgKGFjdGlvbi50eXBlID09PSBzdGFydCQxKSB7XG4gICAgICAgICAgICAgIGFjdGl2aXRpZXNbYWN0aW9uLmFjdGl2aXR5LmlkIHx8IGFjdGlvbi5hY3Rpdml0eS50eXBlXSA9IGFjdGlvbjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYWN0aW9uLnR5cGUgPT09IHN0b3AkMSkge1xuICAgICAgICAgICAgICBhY3Rpdml0aWVzW2FjdGlvbi5hY3Rpdml0eS5pZCB8fCBhY3Rpb24uYWN0aXZpdHkudHlwZV0gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVfN18xKSB7XG4gICAgICAgICAgZV83ID0ge1xuICAgICAgICAgICAgZXJyb3I6IGVfN18xXG4gICAgICAgICAgfTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKF9kICYmICFfZC5kb25lICYmIChfYiA9IF9jLnJldHVybikpIF9iLmNhbGwoX2MpO1xuICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBpZiAoZV83KSB0aHJvdyBlXzcuZXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV82XzEpIHtcbiAgICAgIGVfNiA9IHtcbiAgICAgICAgZXJyb3I6IGVfNl8xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoYWN0aW9uQmxvY2tzXzFfMSAmJiAhYWN0aW9uQmxvY2tzXzFfMS5kb25lICYmIChfYSA9IGFjdGlvbkJsb2Nrc18xLnJldHVybikpIF9hLmNhbGwoYWN0aW9uQmxvY2tzXzEpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfNikgdGhyb3cgZV82LmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBfZSA9IF9fcmVhZChyZXNvbHZlQWN0aW9ucyh0aGlzLCBjdXJyZW50U3RhdGUsIGNvbnRleHQsIF9ldmVudCwgYWN0aW9uQmxvY2tzLCBwcmVkaWN0YWJsZUV4ZWMsIHRoaXMubWFjaGluZS5jb25maWcucHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHMgfHwgdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVzZXJ2ZUFjdGlvbk9yZGVyKSwgMiksXG4gICAgICAgIHJlc29sdmVkQWN0aW9ucyA9IF9lWzBdLFxuICAgICAgICB1cGRhdGVkQ29udGV4dCA9IF9lWzFdO1xuXG4gICAgdmFyIF9mID0gX19yZWFkKHBhcnRpdGlvbihyZXNvbHZlZEFjdGlvbnMsIGlzUmFpc2FibGVBY3Rpb24pLCAyKSxcbiAgICAgICAgcmFpc2VkRXZlbnRzID0gX2ZbMF0sXG4gICAgICAgIG5vblJhaXNlZEFjdGlvbnMgPSBfZlsxXTtcblxuICAgIHZhciBpbnZva2VBY3Rpb25zID0gcmVzb2x2ZWRBY3Rpb25zLmZpbHRlcihmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICB2YXIgX2E7XG5cbiAgICAgIHJldHVybiBhY3Rpb24udHlwZSA9PT0gc3RhcnQkMSAmJiAoKF9hID0gYWN0aW9uLmFjdGl2aXR5KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EudHlwZSkgPT09IGludm9rZTtcbiAgICB9KTtcbiAgICB2YXIgY2hpbGRyZW4gPSBpbnZva2VBY3Rpb25zLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBhY3Rpb24pIHtcbiAgICAgIGFjY1thY3Rpb24uYWN0aXZpdHkuaWRdID0gY3JlYXRlSW52b2NhYmxlQWN0b3IoYWN0aW9uLmFjdGl2aXR5LCBfdGhpcy5tYWNoaW5lLCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50KTtcbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwgY3VycmVudFN0YXRlID8gX19hc3NpZ24oe30sIGN1cnJlbnRTdGF0ZS5jaGlsZHJlbikgOiB7fSk7XG4gICAgdmFyIG5leHRTdGF0ZSA9IG5ldyBTdGF0ZSh7XG4gICAgICB2YWx1ZTogcmVzb2x2ZWRTdGF0ZVZhbHVlIHx8IGN1cnJlbnRTdGF0ZS52YWx1ZSxcbiAgICAgIGNvbnRleHQ6IHVwZGF0ZWRDb250ZXh0LFxuICAgICAgX2V2ZW50OiBfZXZlbnQsXG4gICAgICAvLyBQZXJzaXN0IF9zZXNzaW9uaWQgYmV0d2VlbiBzdGF0ZXNcbiAgICAgIF9zZXNzaW9uaWQ6IGN1cnJlbnRTdGF0ZSA/IGN1cnJlbnRTdGF0ZS5fc2Vzc2lvbmlkIDogbnVsbCxcbiAgICAgIGhpc3RvcnlWYWx1ZTogcmVzb2x2ZWRTdGF0ZVZhbHVlID8gaGlzdG9yeVZhbHVlID8gdXBkYXRlSGlzdG9yeVZhbHVlKGhpc3RvcnlWYWx1ZSwgcmVzb2x2ZWRTdGF0ZVZhbHVlKSA6IHVuZGVmaW5lZCA6IGN1cnJlbnRTdGF0ZSA/IGN1cnJlbnRTdGF0ZS5oaXN0b3J5VmFsdWUgOiB1bmRlZmluZWQsXG4gICAgICBoaXN0b3J5OiAhcmVzb2x2ZWRTdGF0ZVZhbHVlIHx8IHN0YXRlVHJhbnNpdGlvbi5zb3VyY2UgPyBjdXJyZW50U3RhdGUgOiB1bmRlZmluZWQsXG4gICAgICBhY3Rpb25zOiByZXNvbHZlZFN0YXRlVmFsdWUgPyBub25SYWlzZWRBY3Rpb25zIDogW10sXG4gICAgICBhY3Rpdml0aWVzOiByZXNvbHZlZFN0YXRlVmFsdWUgPyBhY3Rpdml0aWVzIDogY3VycmVudFN0YXRlID8gY3VycmVudFN0YXRlLmFjdGl2aXRpZXMgOiB7fSxcbiAgICAgIGV2ZW50czogW10sXG4gICAgICBjb25maWd1cmF0aW9uOiByZXNvbHZlZENvbmZpZ3VyYXRpb24sXG4gICAgICB0cmFuc2l0aW9uczogc3RhdGVUcmFuc2l0aW9uLnRyYW5zaXRpb25zLFxuICAgICAgY2hpbGRyZW46IGNoaWxkcmVuLFxuICAgICAgZG9uZTogaXNEb25lLFxuICAgICAgdGFnczogZ2V0VGFnc0Zyb21Db25maWd1cmF0aW9uKHJlc29sdmVkQ29uZmlndXJhdGlvbiksXG4gICAgICBtYWNoaW5lOiB0aGlzXG4gICAgfSk7XG4gICAgdmFyIGRpZFVwZGF0ZUNvbnRleHQgPSBjb250ZXh0ICE9PSB1cGRhdGVkQ29udGV4dDtcbiAgICBuZXh0U3RhdGUuY2hhbmdlZCA9IF9ldmVudC5uYW1lID09PSB1cGRhdGUgfHwgZGlkVXBkYXRlQ29udGV4dDsgLy8gRGlzcG9zZSBvZiBwZW51bHRpbWF0ZSBoaXN0b3JpZXMgdG8gcHJldmVudCBtZW1vcnkgbGVha3NcblxuICAgIHZhciBoaXN0b3J5ID0gbmV4dFN0YXRlLmhpc3Rvcnk7XG5cbiAgICBpZiAoaGlzdG9yeSkge1xuICAgICAgZGVsZXRlIGhpc3RvcnkuaGlzdG9yeTtcbiAgICB9IC8vIFRoZXJlIGFyZSB0cmFuc2llbnQgdHJhbnNpdGlvbnMgaWYgdGhlIG1hY2hpbmUgaXMgbm90IGluIGEgZmluYWwgc3RhdGVcbiAgICAvLyBhbmQgaWYgc29tZSBvZiB0aGUgc3RhdGUgbm9kZXMgaGF2ZSB0cmFuc2llbnQgKFwiYWx3YXlzXCIpIHRyYW5zaXRpb25zLlxuXG5cbiAgICB2YXIgaGFzQWx3YXlzVHJhbnNpdGlvbnMgPSAhaXNEb25lICYmICh0aGlzLl90cmFuc2llbnQgfHwgY29uZmlndXJhdGlvbi5zb21lKGZ1bmN0aW9uIChzdGF0ZU5vZGUpIHtcbiAgICAgIHJldHVybiBzdGF0ZU5vZGUuX3RyYW5zaWVudDtcbiAgICB9KSk7IC8vIElmIHRoZXJlIGFyZSBubyBlbmFibGVkIHRyYW5zaXRpb25zLCBjaGVjayBpZiB0aGVyZSBhcmUgdHJhbnNpZW50IHRyYW5zaXRpb25zLlxuICAgIC8vIElmIHRoZXJlIGFyZSB0cmFuc2llbnQgdHJhbnNpdGlvbnMsIGNvbnRpbnVlIGNoZWNraW5nIGZvciBtb3JlIHRyYW5zaXRpb25zXG4gICAgLy8gYmVjYXVzZSBhbiB0cmFuc2llbnQgdHJhbnNpdGlvbiBzaG91bGQgYmUgdHJpZ2dlcmVkIGV2ZW4gaWYgdGhlcmUgYXJlIG5vXG4gICAgLy8gZW5hYmxlZCB0cmFuc2l0aW9ucy5cbiAgICAvL1xuICAgIC8vIElmIHdlJ3JlIGFscmVhZHkgd29ya2luZyBvbiBhbiB0cmFuc2llbnQgdHJhbnNpdGlvbiB0aGVuIHN0b3AgdG8gcHJldmVudCBhbiBpbmZpbml0ZSBsb29wLlxuICAgIC8vXG4gICAgLy8gT3RoZXJ3aXNlLCBpZiB0aGVyZSBhcmUgbm8gZW5hYmxlZCBub3IgdHJhbnNpZW50IHRyYW5zaXRpb25zLCB3ZSBhcmUgZG9uZS5cblxuICAgIGlmICghd2lsbFRyYW5zaXRpb24gJiYgKCFoYXNBbHdheXNUcmFuc2l0aW9ucyB8fCBfZXZlbnQubmFtZSA9PT0gTlVMTF9FVkVOVCkpIHtcbiAgICAgIHJldHVybiBuZXh0U3RhdGU7XG4gICAgfVxuXG4gICAgdmFyIG1heWJlTmV4dFN0YXRlID0gbmV4dFN0YXRlO1xuXG4gICAgaWYgKCFpc0RvbmUpIHtcbiAgICAgIGlmIChoYXNBbHdheXNUcmFuc2l0aW9ucykge1xuICAgICAgICBtYXliZU5leHRTdGF0ZSA9IHRoaXMucmVzb2x2ZVJhaXNlZFRyYW5zaXRpb24obWF5YmVOZXh0U3RhdGUsIHtcbiAgICAgICAgICB0eXBlOiBudWxsRXZlbnRcbiAgICAgICAgfSwgX2V2ZW50LCBwcmVkaWN0YWJsZUV4ZWMpO1xuICAgICAgfVxuXG4gICAgICB3aGlsZSAocmFpc2VkRXZlbnRzLmxlbmd0aCkge1xuICAgICAgICB2YXIgcmFpc2VkRXZlbnQgPSByYWlzZWRFdmVudHMuc2hpZnQoKTtcbiAgICAgICAgbWF5YmVOZXh0U3RhdGUgPSB0aGlzLnJlc29sdmVSYWlzZWRUcmFuc2l0aW9uKG1heWJlTmV4dFN0YXRlLCByYWlzZWRFdmVudC5fZXZlbnQsIF9ldmVudCwgcHJlZGljdGFibGVFeGVjKTtcbiAgICAgIH1cbiAgICB9IC8vIERldGVjdCBpZiBzdGF0ZSBjaGFuZ2VkXG5cblxuICAgIHZhciBjaGFuZ2VkID0gbWF5YmVOZXh0U3RhdGUuY2hhbmdlZCB8fCAoaGlzdG9yeSA/ICEhbWF5YmVOZXh0U3RhdGUuYWN0aW9ucy5sZW5ndGggfHwgZGlkVXBkYXRlQ29udGV4dCB8fCB0eXBlb2YgaGlzdG9yeS52YWx1ZSAhPT0gdHlwZW9mIG1heWJlTmV4dFN0YXRlLnZhbHVlIHx8ICFzdGF0ZVZhbHVlc0VxdWFsKG1heWJlTmV4dFN0YXRlLnZhbHVlLCBoaXN0b3J5LnZhbHVlKSA6IHVuZGVmaW5lZCk7XG4gICAgbWF5YmVOZXh0U3RhdGUuY2hhbmdlZCA9IGNoYW5nZWQ7IC8vIFByZXNlcnZlIG9yaWdpbmFsIGhpc3RvcnkgYWZ0ZXIgcmFpc2VkIGV2ZW50c1xuXG4gICAgbWF5YmVOZXh0U3RhdGUuaGlzdG9yeSA9IGhpc3Rvcnk7XG4gICAgcmV0dXJuIG1heWJlTmV4dFN0YXRlO1xuICB9O1xuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBjaGlsZCBzdGF0ZSBub2RlIGZyb20gaXRzIHJlbGF0aXZlIGBzdGF0ZUtleWAsIG9yIHRocm93cy5cclxuICAgKi9cblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZ2V0U3RhdGVOb2RlID0gZnVuY3Rpb24gKHN0YXRlS2V5KSB7XG4gICAgaWYgKGlzU3RhdGVJZChzdGF0ZUtleSkpIHtcbiAgICAgIHJldHVybiB0aGlzLm1hY2hpbmUuZ2V0U3RhdGVOb2RlQnlJZChzdGF0ZUtleSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnN0YXRlcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5hYmxlIHRvIHJldHJpZXZlIGNoaWxkIHN0YXRlICdcIi5jb25jYXQoc3RhdGVLZXksIFwiJyBmcm9tICdcIikuY29uY2F0KHRoaXMuaWQsIFwiJzsgbm8gY2hpbGQgc3RhdGVzIGV4aXN0LlwiKSk7XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IHRoaXMuc3RhdGVzW3N0YXRlS2V5XTtcblxuICAgIGlmICghcmVzdWx0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDaGlsZCBzdGF0ZSAnXCIuY29uY2F0KHN0YXRlS2V5LCBcIicgZG9lcyBub3QgZXhpc3Qgb24gJ1wiKS5jb25jYXQodGhpcy5pZCwgXCInXCIpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBzdGF0ZSBub2RlIHdpdGggdGhlIGdpdmVuIGBzdGF0ZUlkYCwgb3IgdGhyb3dzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHN0YXRlSWQgVGhlIHN0YXRlIElELiBUaGUgcHJlZml4IFwiI1wiIGlzIHJlbW92ZWQuXHJcbiAgICovXG5cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldFN0YXRlTm9kZUJ5SWQgPSBmdW5jdGlvbiAoc3RhdGVJZCkge1xuICAgIHZhciByZXNvbHZlZFN0YXRlSWQgPSBpc1N0YXRlSWQoc3RhdGVJZCkgPyBzdGF0ZUlkLnNsaWNlKFNUQVRFX0lERU5USUZJRVIubGVuZ3RoKSA6IHN0YXRlSWQ7XG5cbiAgICBpZiAocmVzb2x2ZWRTdGF0ZUlkID09PSB0aGlzLmlkKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB2YXIgc3RhdGVOb2RlID0gdGhpcy5tYWNoaW5lLmlkTWFwW3Jlc29sdmVkU3RhdGVJZF07XG5cbiAgICBpZiAoIXN0YXRlTm9kZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2hpbGQgc3RhdGUgbm9kZSAnI1wiLmNvbmNhdChyZXNvbHZlZFN0YXRlSWQsIFwiJyBkb2VzIG5vdCBleGlzdCBvbiBtYWNoaW5lICdcIikuY29uY2F0KHRoaXMuaWQsIFwiJ1wiKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXRlTm9kZTtcbiAgfTtcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgcmVsYXRpdmUgc3RhdGUgbm9kZSBmcm9tIHRoZSBnaXZlbiBgc3RhdGVQYXRoYCwgb3IgdGhyb3dzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHN0YXRlUGF0aCBUaGUgc3RyaW5nIG9yIHN0cmluZyBhcnJheSByZWxhdGl2ZSBwYXRoIHRvIHRoZSBzdGF0ZSBub2RlLlxyXG4gICAqL1xuXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5nZXRTdGF0ZU5vZGVCeVBhdGggPSBmdW5jdGlvbiAoc3RhdGVQYXRoKSB7XG4gICAgaWYgKHR5cGVvZiBzdGF0ZVBhdGggPT09ICdzdHJpbmcnICYmIGlzU3RhdGVJZChzdGF0ZVBhdGgpKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRTdGF0ZU5vZGVCeUlkKHN0YXRlUGF0aC5zbGljZSgxKSk7XG4gICAgICB9IGNhdGNoIChlKSB7Ly8gdHJ5IGluZGl2aWR1YWwgcGF0aHNcbiAgICAgICAgLy8gdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgYXJyYXlTdGF0ZVBhdGggPSB0b1N0YXRlUGF0aChzdGF0ZVBhdGgsIHRoaXMuZGVsaW1pdGVyKS5zbGljZSgpO1xuICAgIHZhciBjdXJyZW50U3RhdGVOb2RlID0gdGhpcztcblxuICAgIHdoaWxlIChhcnJheVN0YXRlUGF0aC5sZW5ndGgpIHtcbiAgICAgIHZhciBrZXkgPSBhcnJheVN0YXRlUGF0aC5zaGlmdCgpO1xuXG4gICAgICBpZiAoIWtleS5sZW5ndGgpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGN1cnJlbnRTdGF0ZU5vZGUgPSBjdXJyZW50U3RhdGVOb2RlLmdldFN0YXRlTm9kZShrZXkpO1xuICAgIH1cblxuICAgIHJldHVybiBjdXJyZW50U3RhdGVOb2RlO1xuICB9O1xuICAvKipcclxuICAgKiBSZXNvbHZlcyBhIHBhcnRpYWwgc3RhdGUgdmFsdWUgd2l0aCBpdHMgZnVsbCByZXByZXNlbnRhdGlvbiBpbiB0aGlzIG1hY2hpbmUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gc3RhdGVWYWx1ZSBUaGUgcGFydGlhbCBzdGF0ZSB2YWx1ZSB0byByZXNvbHZlLlxyXG4gICAqL1xuXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5yZXNvbHZlID0gZnVuY3Rpb24gKHN0YXRlVmFsdWUpIHtcbiAgICB2YXIgX2E7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKCFzdGF0ZVZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbml0aWFsU3RhdGVWYWx1ZSB8fCBFTVBUWV9PQkpFQ1Q7IC8vIFRPRE86IHR5cGUtc3BlY2lmaWMgcHJvcGVydGllc1xuICAgIH1cblxuICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICBjYXNlICdwYXJhbGxlbCc6XG4gICAgICAgIHJldHVybiBtYXBWYWx1ZXModGhpcy5pbml0aWFsU3RhdGVWYWx1ZSwgZnVuY3Rpb24gKHN1YlN0YXRlVmFsdWUsIHN1YlN0YXRlS2V5KSB7XG4gICAgICAgICAgcmV0dXJuIHN1YlN0YXRlVmFsdWUgPyBfdGhpcy5nZXRTdGF0ZU5vZGUoc3ViU3RhdGVLZXkpLnJlc29sdmUoc3RhdGVWYWx1ZVtzdWJTdGF0ZUtleV0gfHwgc3ViU3RhdGVWYWx1ZSkgOiBFTVBUWV9PQkpFQ1Q7XG4gICAgICAgIH0pO1xuXG4gICAgICBjYXNlICdjb21wb3VuZCc6XG4gICAgICAgIGlmIChpc1N0cmluZyhzdGF0ZVZhbHVlKSkge1xuICAgICAgICAgIHZhciBzdWJTdGF0ZU5vZGUgPSB0aGlzLmdldFN0YXRlTm9kZShzdGF0ZVZhbHVlKTtcblxuICAgICAgICAgIGlmIChzdWJTdGF0ZU5vZGUudHlwZSA9PT0gJ3BhcmFsbGVsJyB8fCBzdWJTdGF0ZU5vZGUudHlwZSA9PT0gJ2NvbXBvdW5kJykge1xuICAgICAgICAgICAgcmV0dXJuIF9hID0ge30sIF9hW3N0YXRlVmFsdWVdID0gc3ViU3RhdGVOb2RlLmluaXRpYWxTdGF0ZVZhbHVlLCBfYTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gc3RhdGVWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghT2JqZWN0LmtleXMoc3RhdGVWYWx1ZSkubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuaW5pdGlhbFN0YXRlVmFsdWUgfHwge307XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWFwVmFsdWVzKHN0YXRlVmFsdWUsIGZ1bmN0aW9uIChzdWJTdGF0ZVZhbHVlLCBzdWJTdGF0ZUtleSkge1xuICAgICAgICAgIHJldHVybiBzdWJTdGF0ZVZhbHVlID8gX3RoaXMuZ2V0U3RhdGVOb2RlKHN1YlN0YXRlS2V5KS5yZXNvbHZlKHN1YlN0YXRlVmFsdWUpIDogRU1QVFlfT0JKRUNUO1xuICAgICAgICB9KTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHN0YXRlVmFsdWUgfHwgRU1QVFlfT0JKRUNUO1xuICAgIH1cbiAgfTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldFJlc29sdmVkUGF0aCA9IGZ1bmN0aW9uIChzdGF0ZUlkZW50aWZpZXIpIHtcbiAgICBpZiAoaXNTdGF0ZUlkKHN0YXRlSWRlbnRpZmllcikpIHtcbiAgICAgIHZhciBzdGF0ZU5vZGUgPSB0aGlzLm1hY2hpbmUuaWRNYXBbc3RhdGVJZGVudGlmaWVyLnNsaWNlKFNUQVRFX0lERU5USUZJRVIubGVuZ3RoKV07XG5cbiAgICAgIGlmICghc3RhdGVOb2RlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuYWJsZSB0byBmaW5kIHN0YXRlIG5vZGUgJ1wiLmNvbmNhdChzdGF0ZUlkZW50aWZpZXIsIFwiJ1wiKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdGF0ZU5vZGUucGF0aDtcbiAgICB9XG5cbiAgICByZXR1cm4gdG9TdGF0ZVBhdGgoc3RhdGVJZGVudGlmaWVyLCB0aGlzLmRlbGltaXRlcik7XG4gIH07XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0YXRlTm9kZS5wcm90b3R5cGUsIFwiaW5pdGlhbFN0YXRlVmFsdWVcIiwge1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIF9hO1xuXG4gICAgICBpZiAodGhpcy5fX2NhY2hlLmluaXRpYWxTdGF0ZVZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fY2FjaGUuaW5pdGlhbFN0YXRlVmFsdWU7XG4gICAgICB9XG5cbiAgICAgIHZhciBpbml0aWFsU3RhdGVWYWx1ZTtcblxuICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ3BhcmFsbGVsJykge1xuICAgICAgICBpbml0aWFsU3RhdGVWYWx1ZSA9IG1hcEZpbHRlclZhbHVlcyh0aGlzLnN0YXRlcywgZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgICAgcmV0dXJuIHN0YXRlLmluaXRpYWxTdGF0ZVZhbHVlIHx8IEVNUFRZX09CSkVDVDtcbiAgICAgICAgfSwgZnVuY3Rpb24gKHN0YXRlTm9kZSkge1xuICAgICAgICAgIHJldHVybiAhKHN0YXRlTm9kZS50eXBlID09PSAnaGlzdG9yeScpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pbml0aWFsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlc1t0aGlzLmluaXRpYWxdKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW5pdGlhbCBzdGF0ZSAnXCIuY29uY2F0KHRoaXMuaW5pdGlhbCwgXCInIG5vdCBmb3VuZCBvbiAnXCIpLmNvbmNhdCh0aGlzLmtleSwgXCInXCIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXRpYWxTdGF0ZVZhbHVlID0gaXNMZWFmTm9kZSh0aGlzLnN0YXRlc1t0aGlzLmluaXRpYWxdKSA/IHRoaXMuaW5pdGlhbCA6IChfYSA9IHt9LCBfYVt0aGlzLmluaXRpYWxdID0gdGhpcy5zdGF0ZXNbdGhpcy5pbml0aWFsXS5pbml0aWFsU3RhdGVWYWx1ZSwgX2EpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVGhlIGZpbml0ZSBzdGF0ZSB2YWx1ZSBvZiBhIG1hY2hpbmUgd2l0aG91dCBjaGlsZCBzdGF0ZXMgaXMganVzdCBhbiBlbXB0eSBvYmplY3RcbiAgICAgICAgaW5pdGlhbFN0YXRlVmFsdWUgPSB7fTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fX2NhY2hlLmluaXRpYWxTdGF0ZVZhbHVlID0gaW5pdGlhbFN0YXRlVmFsdWU7XG4gICAgICByZXR1cm4gdGhpcy5fX2NhY2hlLmluaXRpYWxTdGF0ZVZhbHVlO1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZ2V0SW5pdGlhbFN0YXRlID0gZnVuY3Rpb24gKHN0YXRlVmFsdWUsIGNvbnRleHQpIHtcbiAgICB0aGlzLl9pbml0KCk7IC8vIFRPRE86IHRoaXMgc2hvdWxkIGJlIGluIHRoZSBjb25zdHJ1Y3RvciAoc2VlIG5vdGUgaW4gY29uc3RydWN0b3IpXG5cblxuICAgIHZhciBjb25maWd1cmF0aW9uID0gdGhpcy5nZXRTdGF0ZU5vZGVzKHN0YXRlVmFsdWUpO1xuICAgIHJldHVybiB0aGlzLnJlc29sdmVUcmFuc2l0aW9uKHtcbiAgICAgIGNvbmZpZ3VyYXRpb246IGNvbmZpZ3VyYXRpb24sXG4gICAgICBleGl0U2V0OiBbXSxcbiAgICAgIHRyYW5zaXRpb25zOiBbXSxcbiAgICAgIHNvdXJjZTogdW5kZWZpbmVkLFxuICAgICAgYWN0aW9uczogW11cbiAgICB9LCB1bmRlZmluZWQsIGNvbnRleHQgIT09IG51bGwgJiYgY29udGV4dCAhPT0gdm9pZCAwID8gY29udGV4dCA6IHRoaXMubWFjaGluZS5jb250ZXh0LCB1bmRlZmluZWQpO1xuICB9O1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGF0ZU5vZGUucHJvdG90eXBlLCBcImluaXRpYWxTdGF0ZVwiLCB7XG4gICAgLyoqXHJcbiAgICAgKiBUaGUgaW5pdGlhbCBTdGF0ZSBpbnN0YW5jZSwgd2hpY2ggaW5jbHVkZXMgYWxsIGFjdGlvbnMgdG8gYmUgZXhlY3V0ZWQgZnJvbVxyXG4gICAgICogZW50ZXJpbmcgdGhlIGluaXRpYWwgc3RhdGUuXHJcbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBpbml0aWFsU3RhdGVWYWx1ZSA9IHRoaXMuaW5pdGlhbFN0YXRlVmFsdWU7XG5cbiAgICAgIGlmICghaW5pdGlhbFN0YXRlVmFsdWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHJldHJpZXZlIGluaXRpYWwgc3RhdGUgZnJvbSBzaW1wbGUgc3RhdGUgJ1wiLmNvbmNhdCh0aGlzLmlkLCBcIicuXCIpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5pdGlhbFN0YXRlKGluaXRpYWxTdGF0ZVZhbHVlKTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0YXRlTm9kZS5wcm90b3R5cGUsIFwidGFyZ2V0XCIsIHtcbiAgICAvKipcclxuICAgICAqIFRoZSB0YXJnZXQgc3RhdGUgdmFsdWUgb2YgdGhlIGhpc3Rvcnkgc3RhdGUgbm9kZSwgaWYgaXQgZXhpc3RzLiBUaGlzIHJlcHJlc2VudHMgdGhlXHJcbiAgICAgKiBkZWZhdWx0IHN0YXRlIHZhbHVlIHRvIHRyYW5zaXRpb24gdG8gaWYgbm8gaGlzdG9yeSB2YWx1ZSBleGlzdHMgeWV0LlxyXG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdGFyZ2V0O1xuXG4gICAgICBpZiAodGhpcy50eXBlID09PSAnaGlzdG9yeScpIHtcbiAgICAgICAgdmFyIGhpc3RvcnlDb25maWcgPSB0aGlzLmNvbmZpZztcblxuICAgICAgICBpZiAoaXNTdHJpbmcoaGlzdG9yeUNvbmZpZy50YXJnZXQpKSB7XG4gICAgICAgICAgdGFyZ2V0ID0gaXNTdGF0ZUlkKGhpc3RvcnlDb25maWcudGFyZ2V0KSA/IHBhdGhUb1N0YXRlVmFsdWUodGhpcy5tYWNoaW5lLmdldFN0YXRlTm9kZUJ5SWQoaGlzdG9yeUNvbmZpZy50YXJnZXQpLnBhdGguc2xpY2UodGhpcy5wYXRoLmxlbmd0aCAtIDEpKSA6IGhpc3RvcnlDb25maWcudGFyZ2V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRhcmdldCA9IGhpc3RvcnlDb25maWcudGFyZ2V0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGxlYWYgbm9kZXMgZnJvbSBhIHN0YXRlIHBhdGggcmVsYXRpdmUgdG8gdGhpcyBzdGF0ZSBub2RlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHJlbGF0aXZlU3RhdGVJZCBUaGUgcmVsYXRpdmUgc3RhdGUgcGF0aCB0byByZXRyaWV2ZSB0aGUgc3RhdGUgbm9kZXNcclxuICAgKiBAcGFyYW0gaGlzdG9yeSBUaGUgcHJldmlvdXMgc3RhdGUgdG8gcmV0cmlldmUgaGlzdG9yeVxyXG4gICAqIEBwYXJhbSByZXNvbHZlIFdoZXRoZXIgc3RhdGUgbm9kZXMgc2hvdWxkIHJlc29sdmUgdG8gaW5pdGlhbCBjaGlsZCBzdGF0ZSBub2Rlc1xyXG4gICAqL1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZ2V0UmVsYXRpdmVTdGF0ZU5vZGVzID0gZnVuY3Rpb24gKHJlbGF0aXZlU3RhdGVJZCwgaGlzdG9yeVZhbHVlLCByZXNvbHZlKSB7XG4gICAgaWYgKHJlc29sdmUgPT09IHZvaWQgMCkge1xuICAgICAgcmVzb2x2ZSA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc29sdmUgPyByZWxhdGl2ZVN0YXRlSWQudHlwZSA9PT0gJ2hpc3RvcnknID8gcmVsYXRpdmVTdGF0ZUlkLnJlc29sdmVIaXN0b3J5KGhpc3RvcnlWYWx1ZSkgOiByZWxhdGl2ZVN0YXRlSWQuaW5pdGlhbFN0YXRlTm9kZXMgOiBbcmVsYXRpdmVTdGF0ZUlkXTtcbiAgfTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RhdGVOb2RlLnByb3RvdHlwZSwgXCJpbml0aWFsU3RhdGVOb2Rlc1wiLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICBpZiAoaXNMZWFmTm9kZSh0aGlzKSkge1xuICAgICAgICByZXR1cm4gW3RoaXNdO1xuICAgICAgfSAvLyBDYXNlIHdoZW4gc3RhdGUgbm9kZSBpcyBjb21wb3VuZCBidXQgbm8gaW5pdGlhbCBzdGF0ZSBpcyBkZWZpbmVkXG5cblxuICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ2NvbXBvdW5kJyAmJiAhdGhpcy5pbml0aWFsKSB7XG4gICAgICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgICAgIHdhcm4oZmFsc2UsIFwiQ29tcG91bmQgc3RhdGUgbm9kZSAnXCIuY29uY2F0KHRoaXMuaWQsIFwiJyBoYXMgbm8gaW5pdGlhbCBzdGF0ZS5cIikpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFt0aGlzXTtcbiAgICAgIH1cblxuICAgICAgdmFyIGluaXRpYWxTdGF0ZU5vZGVQYXRocyA9IHRvU3RhdGVQYXRocyh0aGlzLmluaXRpYWxTdGF0ZVZhbHVlKTtcbiAgICAgIHJldHVybiBmbGF0dGVuKGluaXRpYWxTdGF0ZU5vZGVQYXRocy5tYXAoZnVuY3Rpb24gKGluaXRpYWxQYXRoKSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5nZXRGcm9tUmVsYXRpdmVQYXRoKGluaXRpYWxQYXRoKTtcbiAgICAgIH0pKTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbiAgLyoqXHJcbiAgICogUmV0cmlldmVzIHN0YXRlIG5vZGVzIGZyb20gYSByZWxhdGl2ZSBwYXRoIHRvIHRoaXMgc3RhdGUgbm9kZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSByZWxhdGl2ZVBhdGggVGhlIHJlbGF0aXZlIHBhdGggZnJvbSB0aGlzIHN0YXRlIG5vZGVcclxuICAgKiBAcGFyYW0gaGlzdG9yeVZhbHVlXHJcbiAgICovXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5nZXRGcm9tUmVsYXRpdmVQYXRoID0gZnVuY3Rpb24gKHJlbGF0aXZlUGF0aCkge1xuICAgIGlmICghcmVsYXRpdmVQYXRoLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIFt0aGlzXTtcbiAgICB9XG5cbiAgICB2YXIgX2EgPSBfX3JlYWQocmVsYXRpdmVQYXRoKSxcbiAgICAgICAgc3RhdGVLZXkgPSBfYVswXSxcbiAgICAgICAgY2hpbGRTdGF0ZVBhdGggPSBfYS5zbGljZSgxKTtcblxuICAgIGlmICghdGhpcy5zdGF0ZXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCByZXRyaWV2ZSBzdWJQYXRoICdcIi5jb25jYXQoc3RhdGVLZXksIFwiJyBmcm9tIG5vZGUgd2l0aCBubyBzdGF0ZXNcIikpO1xuICAgIH1cblxuICAgIHZhciBjaGlsZFN0YXRlTm9kZSA9IHRoaXMuZ2V0U3RhdGVOb2RlKHN0YXRlS2V5KTtcblxuICAgIGlmIChjaGlsZFN0YXRlTm9kZS50eXBlID09PSAnaGlzdG9yeScpIHtcbiAgICAgIHJldHVybiBjaGlsZFN0YXRlTm9kZS5yZXNvbHZlSGlzdG9yeSgpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5zdGF0ZXNbc3RhdGVLZXldKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDaGlsZCBzdGF0ZSAnXCIuY29uY2F0KHN0YXRlS2V5LCBcIicgZG9lcyBub3QgZXhpc3Qgb24gJ1wiKS5jb25jYXQodGhpcy5pZCwgXCInXCIpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zdGF0ZXNbc3RhdGVLZXldLmdldEZyb21SZWxhdGl2ZVBhdGgoY2hpbGRTdGF0ZVBhdGgpO1xuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuaGlzdG9yeVZhbHVlID0gZnVuY3Rpb24gKHJlbGF0aXZlU3RhdGVWYWx1ZSkge1xuICAgIGlmICghT2JqZWN0LmtleXModGhpcy5zdGF0ZXMpLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgY3VycmVudDogcmVsYXRpdmVTdGF0ZVZhbHVlIHx8IHRoaXMuaW5pdGlhbFN0YXRlVmFsdWUsXG4gICAgICBzdGF0ZXM6IG1hcEZpbHRlclZhbHVlcyh0aGlzLnN0YXRlcywgZnVuY3Rpb24gKHN0YXRlTm9kZSwga2V5KSB7XG4gICAgICAgIGlmICghcmVsYXRpdmVTdGF0ZVZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIHN0YXRlTm9kZS5oaXN0b3J5VmFsdWUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzdWJTdGF0ZVZhbHVlID0gaXNTdHJpbmcocmVsYXRpdmVTdGF0ZVZhbHVlKSA/IHVuZGVmaW5lZCA6IHJlbGF0aXZlU3RhdGVWYWx1ZVtrZXldO1xuICAgICAgICByZXR1cm4gc3RhdGVOb2RlLmhpc3RvcnlWYWx1ZShzdWJTdGF0ZVZhbHVlIHx8IHN0YXRlTm9kZS5pbml0aWFsU3RhdGVWYWx1ZSk7XG4gICAgICB9LCBmdW5jdGlvbiAoc3RhdGVOb2RlKSB7XG4gICAgICAgIHJldHVybiAhc3RhdGVOb2RlLmhpc3Rvcnk7XG4gICAgICB9KVxuICAgIH07XG4gIH07XG4gIC8qKlxyXG4gICAqIFJlc29sdmVzIHRvIHRoZSBoaXN0b3JpY2FsIHZhbHVlKHMpIG9mIHRoZSBwYXJlbnQgc3RhdGUgbm9kZSxcclxuICAgKiByZXByZXNlbnRlZCBieSBzdGF0ZSBub2Rlcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBoaXN0b3J5VmFsdWVcclxuICAgKi9cblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUucmVzb2x2ZUhpc3RvcnkgPSBmdW5jdGlvbiAoaGlzdG9yeVZhbHVlKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmICh0aGlzLnR5cGUgIT09ICdoaXN0b3J5Jykge1xuICAgICAgcmV0dXJuIFt0aGlzXTtcbiAgICB9XG5cbiAgICB2YXIgcGFyZW50ID0gdGhpcy5wYXJlbnQ7XG5cbiAgICBpZiAoIWhpc3RvcnlWYWx1ZSkge1xuICAgICAgdmFyIGhpc3RvcnlUYXJnZXQgPSB0aGlzLnRhcmdldDtcbiAgICAgIHJldHVybiBoaXN0b3J5VGFyZ2V0ID8gZmxhdHRlbih0b1N0YXRlUGF0aHMoaGlzdG9yeVRhcmdldCkubWFwKGZ1bmN0aW9uIChyZWxhdGl2ZUNoaWxkUGF0aCkge1xuICAgICAgICByZXR1cm4gcGFyZW50LmdldEZyb21SZWxhdGl2ZVBhdGgocmVsYXRpdmVDaGlsZFBhdGgpO1xuICAgICAgfSkpIDogcGFyZW50LmluaXRpYWxTdGF0ZU5vZGVzO1xuICAgIH1cblxuICAgIHZhciBzdWJIaXN0b3J5VmFsdWUgPSBuZXN0ZWRQYXRoKHBhcmVudC5wYXRoLCAnc3RhdGVzJykoaGlzdG9yeVZhbHVlKS5jdXJyZW50O1xuXG4gICAgaWYgKGlzU3RyaW5nKHN1Ykhpc3RvcnlWYWx1ZSkpIHtcbiAgICAgIHJldHVybiBbcGFyZW50LmdldFN0YXRlTm9kZShzdWJIaXN0b3J5VmFsdWUpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmxhdHRlbih0b1N0YXRlUGF0aHMoc3ViSGlzdG9yeVZhbHVlKS5tYXAoZnVuY3Rpb24gKHN1YlN0YXRlUGF0aCkge1xuICAgICAgcmV0dXJuIF90aGlzLmhpc3RvcnkgPT09ICdkZWVwJyA/IHBhcmVudC5nZXRGcm9tUmVsYXRpdmVQYXRoKHN1YlN0YXRlUGF0aCkgOiBbcGFyZW50LnN0YXRlc1tzdWJTdGF0ZVBhdGhbMF1dXTtcbiAgICB9KSk7XG4gIH07XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0YXRlTm9kZS5wcm90b3R5cGUsIFwic3RhdGVJZHNcIiwge1xuICAgIC8qKlxyXG4gICAgICogQWxsIHRoZSBzdGF0ZSBub2RlIElEcyBvZiB0aGlzIHN0YXRlIG5vZGUgYW5kIGl0cyBkZXNjZW5kYW50IHN0YXRlIG5vZGVzLlxyXG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICB2YXIgY2hpbGRTdGF0ZUlkcyA9IGZsYXR0ZW4oT2JqZWN0LmtleXModGhpcy5zdGF0ZXMpLm1hcChmdW5jdGlvbiAoc3RhdGVLZXkpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLnN0YXRlc1tzdGF0ZUtleV0uc3RhdGVJZHM7XG4gICAgICB9KSk7XG4gICAgICByZXR1cm4gW3RoaXMuaWRdLmNvbmNhdChjaGlsZFN0YXRlSWRzKTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0YXRlTm9kZS5wcm90b3R5cGUsIFwiZXZlbnRzXCIsIHtcbiAgICAvKipcclxuICAgICAqIEFsbCB0aGUgZXZlbnQgdHlwZXMgYWNjZXB0ZWQgYnkgdGhpcyBzdGF0ZSBub2RlIGFuZCBpdHMgZGVzY2VuZGFudHMuXHJcbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBlXzgsIF9hLCBlXzksIF9iO1xuXG4gICAgICBpZiAodGhpcy5fX2NhY2hlLmV2ZW50cykge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2NhY2hlLmV2ZW50cztcbiAgICAgIH1cblxuICAgICAgdmFyIHN0YXRlcyA9IHRoaXMuc3RhdGVzO1xuICAgICAgdmFyIGV2ZW50cyA9IG5ldyBTZXQodGhpcy5vd25FdmVudHMpO1xuXG4gICAgICBpZiAoc3RhdGVzKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZm9yICh2YXIgX2MgPSBfX3ZhbHVlcyhPYmplY3Qua2V5cyhzdGF0ZXMpKSwgX2QgPSBfYy5uZXh0KCk7ICFfZC5kb25lOyBfZCA9IF9jLm5leHQoKSkge1xuICAgICAgICAgICAgdmFyIHN0YXRlSWQgPSBfZC52YWx1ZTtcbiAgICAgICAgICAgIHZhciBzdGF0ZSA9IHN0YXRlc1tzdGF0ZUlkXTtcblxuICAgICAgICAgICAgaWYgKHN0YXRlLnN0YXRlcykge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIF9lID0gKGVfOSA9IHZvaWQgMCwgX192YWx1ZXMoc3RhdGUuZXZlbnRzKSksIF9mID0gX2UubmV4dCgpOyAhX2YuZG9uZTsgX2YgPSBfZS5uZXh0KCkpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBldmVudF8xID0gX2YudmFsdWU7XG4gICAgICAgICAgICAgICAgICBldmVudHMuYWRkKFwiXCIuY29uY2F0KGV2ZW50XzEpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGVfOV8xKSB7XG4gICAgICAgICAgICAgICAgZV85ID0ge1xuICAgICAgICAgICAgICAgICAgZXJyb3I6IGVfOV8xXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgaWYgKF9mICYmICFfZi5kb25lICYmIChfYiA9IF9lLnJldHVybikpIF9iLmNhbGwoX2UpO1xuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICBpZiAoZV85KSB0aHJvdyBlXzkuZXJyb3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlXzhfMSkge1xuICAgICAgICAgIGVfOCA9IHtcbiAgICAgICAgICAgIGVycm9yOiBlXzhfMVxuICAgICAgICAgIH07XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChfZCAmJiAhX2QuZG9uZSAmJiAoX2EgPSBfYy5yZXR1cm4pKSBfYS5jYWxsKF9jKTtcbiAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgaWYgKGVfOCkgdGhyb3cgZV84LmVycm9yO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5fX2NhY2hlLmV2ZW50cyA9IEFycmF5LmZyb20oZXZlbnRzKTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0YXRlTm9kZS5wcm90b3R5cGUsIFwib3duRXZlbnRzXCIsIHtcbiAgICAvKipcclxuICAgICAqIEFsbCB0aGUgZXZlbnRzIHRoYXQgaGF2ZSB0cmFuc2l0aW9ucyBkaXJlY3RseSBmcm9tIHRoaXMgc3RhdGUgbm9kZS5cclxuICAgICAqXHJcbiAgICAgKiBFeGNsdWRlcyBhbnkgaW5lcnQgZXZlbnRzLlxyXG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgZXZlbnRzID0gbmV3IFNldCh0aGlzLnRyYW5zaXRpb25zLmZpbHRlcihmdW5jdGlvbiAodHJhbnNpdGlvbikge1xuICAgICAgICByZXR1cm4gISghdHJhbnNpdGlvbi50YXJnZXQgJiYgIXRyYW5zaXRpb24uYWN0aW9ucy5sZW5ndGggJiYgdHJhbnNpdGlvbi5pbnRlcm5hbCk7XG4gICAgICB9KS5tYXAoZnVuY3Rpb24gKHRyYW5zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuIHRyYW5zaXRpb24uZXZlbnRUeXBlO1xuICAgICAgfSkpO1xuICAgICAgcmV0dXJuIEFycmF5LmZyb20oZXZlbnRzKTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLnJlc29sdmVUYXJnZXQgPSBmdW5jdGlvbiAoX3RhcmdldCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoX3RhcmdldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBhbiB1bmRlZmluZWQgdGFyZ2V0IHNpZ25hbHMgdGhhdCB0aGUgc3RhdGUgbm9kZSBzaG91bGQgbm90IHRyYW5zaXRpb24gZnJvbSB0aGF0IHN0YXRlIHdoZW4gcmVjZWl2aW5nIHRoYXQgZXZlbnRcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIF90YXJnZXQubWFwKGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgIGlmICghaXNTdHJpbmcodGFyZ2V0KSkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgICAgfVxuXG4gICAgICB2YXIgaXNJbnRlcm5hbFRhcmdldCA9IHRhcmdldFswXSA9PT0gX3RoaXMuZGVsaW1pdGVyOyAvLyBJZiBpbnRlcm5hbCB0YXJnZXQgaXMgZGVmaW5lZCBvbiBtYWNoaW5lLFxuICAgICAgLy8gZG8gbm90IGluY2x1ZGUgbWFjaGluZSBrZXkgb24gdGFyZ2V0XG5cbiAgICAgIGlmIChpc0ludGVybmFsVGFyZ2V0ICYmICFfdGhpcy5wYXJlbnQpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLmdldFN0YXRlTm9kZUJ5UGF0aCh0YXJnZXQuc2xpY2UoMSkpO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVzb2x2ZWRUYXJnZXQgPSBpc0ludGVybmFsVGFyZ2V0ID8gX3RoaXMua2V5ICsgdGFyZ2V0IDogdGFyZ2V0O1xuXG4gICAgICBpZiAoX3RoaXMucGFyZW50KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIHRhcmdldFN0YXRlTm9kZSA9IF90aGlzLnBhcmVudC5nZXRTdGF0ZU5vZGVCeVBhdGgocmVzb2x2ZWRUYXJnZXQpO1xuXG4gICAgICAgICAgcmV0dXJuIHRhcmdldFN0YXRlTm9kZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB0cmFuc2l0aW9uIGRlZmluaXRpb24gZm9yIHN0YXRlIG5vZGUgJ1wiLmNvbmNhdChfdGhpcy5pZCwgXCInOlxcblwiKS5jb25jYXQoZXJyLm1lc3NhZ2UpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLmdldFN0YXRlTm9kZUJ5UGF0aChyZXNvbHZlZFRhcmdldCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5mb3JtYXRUcmFuc2l0aW9uID0gZnVuY3Rpb24gKHRyYW5zaXRpb25Db25maWcpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIG5vcm1hbGl6ZWRUYXJnZXQgPSBub3JtYWxpemVUYXJnZXQodHJhbnNpdGlvbkNvbmZpZy50YXJnZXQpO1xuICAgIHZhciBpbnRlcm5hbCA9ICdpbnRlcm5hbCcgaW4gdHJhbnNpdGlvbkNvbmZpZyA/IHRyYW5zaXRpb25Db25maWcuaW50ZXJuYWwgOiBub3JtYWxpemVkVGFyZ2V0ID8gbm9ybWFsaXplZFRhcmdldC5zb21lKGZ1bmN0aW9uIChfdGFyZ2V0KSB7XG4gICAgICByZXR1cm4gaXNTdHJpbmcoX3RhcmdldCkgJiYgX3RhcmdldFswXSA9PT0gX3RoaXMuZGVsaW1pdGVyO1xuICAgIH0pIDogdHJ1ZTtcbiAgICB2YXIgZ3VhcmRzID0gdGhpcy5tYWNoaW5lLm9wdGlvbnMuZ3VhcmRzO1xuICAgIHZhciB0YXJnZXQgPSB0aGlzLnJlc29sdmVUYXJnZXQobm9ybWFsaXplZFRhcmdldCk7XG5cbiAgICB2YXIgdHJhbnNpdGlvbiA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCB0cmFuc2l0aW9uQ29uZmlnKSwge1xuICAgICAgYWN0aW9uczogdG9BY3Rpb25PYmplY3RzKHRvQXJyYXkodHJhbnNpdGlvbkNvbmZpZy5hY3Rpb25zKSksXG4gICAgICBjb25kOiB0b0d1YXJkKHRyYW5zaXRpb25Db25maWcuY29uZCwgZ3VhcmRzKSxcbiAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgc291cmNlOiB0aGlzLFxuICAgICAgaW50ZXJuYWw6IGludGVybmFsLFxuICAgICAgZXZlbnRUeXBlOiB0cmFuc2l0aW9uQ29uZmlnLmV2ZW50LFxuICAgICAgdG9KU09OOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgdHJhbnNpdGlvbiksIHtcbiAgICAgICAgICB0YXJnZXQ6IHRyYW5zaXRpb24udGFyZ2V0ID8gdHJhbnNpdGlvbi50YXJnZXQubWFwKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICByZXR1cm4gXCIjXCIuY29uY2F0KHQuaWQpO1xuICAgICAgICAgIH0pIDogdW5kZWZpbmVkLFxuICAgICAgICAgIHNvdXJjZTogXCIjXCIuY29uY2F0KF90aGlzLmlkKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0cmFuc2l0aW9uO1xuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZm9ybWF0VHJhbnNpdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVfMTAsIF9hO1xuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBvbkNvbmZpZztcblxuICAgIGlmICghdGhpcy5jb25maWcub24pIHtcbiAgICAgIG9uQ29uZmlnID0gW107XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHRoaXMuY29uZmlnLm9uKSkge1xuICAgICAgb25Db25maWcgPSB0aGlzLmNvbmZpZy5vbjtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIF9iID0gdGhpcy5jb25maWcub24sXG4gICAgICAgICAgX2MgPSBXSUxEQ0FSRCxcbiAgICAgICAgICBfZCA9IF9iW19jXSxcbiAgICAgICAgICB3aWxkY2FyZENvbmZpZ3MgPSBfZCA9PT0gdm9pZCAwID8gW10gOiBfZCxcbiAgICAgICAgICBzdHJpY3RUcmFuc2l0aW9uQ29uZmlnc18xID0gX19yZXN0KF9iLCBbdHlwZW9mIF9jID09PSBcInN5bWJvbFwiID8gX2MgOiBfYyArIFwiXCJdKTtcblxuICAgICAgb25Db25maWcgPSBmbGF0dGVuKE9iamVjdC5rZXlzKHN0cmljdFRyYW5zaXRpb25Db25maWdzXzEpLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGlmICghSVNfUFJPRFVDVElPTiAmJiBrZXkgPT09IE5VTExfRVZFTlQpIHtcbiAgICAgICAgICB3YXJuKGZhbHNlLCBcIkVtcHR5IHN0cmluZyB0cmFuc2l0aW9uIGNvbmZpZ3MgKGUuZy4sIGB7IG9uOiB7ICcnOiAuLi4gfX1gKSBmb3IgdHJhbnNpZW50IHRyYW5zaXRpb25zIGFyZSBkZXByZWNhdGVkLiBTcGVjaWZ5IHRoZSB0cmFuc2l0aW9uIGluIHRoZSBgeyBhbHdheXM6IC4uLiB9YCBwcm9wZXJ0eSBpbnN0ZWFkLiBcIiArIFwiUGxlYXNlIGNoZWNrIHRoZSBgb25gIGNvbmZpZ3VyYXRpb24gZm9yIFxcXCIjXCIuY29uY2F0KF90aGlzLmlkLCBcIlxcXCIuXCIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0cmFuc2l0aW9uQ29uZmlnQXJyYXkgPSB0b1RyYW5zaXRpb25Db25maWdBcnJheShrZXksIHN0cmljdFRyYW5zaXRpb25Db25maWdzXzFba2V5XSk7XG5cbiAgICAgICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICAgICAgdmFsaWRhdGVBcnJheWlmaWVkVHJhbnNpdGlvbnMoX3RoaXMsIGtleSwgdHJhbnNpdGlvbkNvbmZpZ0FycmF5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cmFuc2l0aW9uQ29uZmlnQXJyYXk7XG4gICAgICB9KS5jb25jYXQodG9UcmFuc2l0aW9uQ29uZmlnQXJyYXkoV0lMRENBUkQsIHdpbGRjYXJkQ29uZmlncykpKTtcbiAgICB9XG5cbiAgICB2YXIgZXZlbnRsZXNzQ29uZmlnID0gdGhpcy5jb25maWcuYWx3YXlzID8gdG9UcmFuc2l0aW9uQ29uZmlnQXJyYXkoJycsIHRoaXMuY29uZmlnLmFsd2F5cykgOiBbXTtcbiAgICB2YXIgZG9uZUNvbmZpZyA9IHRoaXMuY29uZmlnLm9uRG9uZSA/IHRvVHJhbnNpdGlvbkNvbmZpZ0FycmF5KFN0cmluZyhkb25lKHRoaXMuaWQpKSwgdGhpcy5jb25maWcub25Eb25lKSA6IFtdO1xuXG4gICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICB3YXJuKCEodGhpcy5jb25maWcub25Eb25lICYmICF0aGlzLnBhcmVudCksIFwiUm9vdCBub2RlcyBjYW5ub3QgaGF2ZSBhbiBcXFwiLm9uRG9uZVxcXCIgdHJhbnNpdGlvbi4gUGxlYXNlIGNoZWNrIHRoZSBjb25maWcgb2YgXFxcIlwiLmNvbmNhdCh0aGlzLmlkLCBcIlxcXCIuXCIpKTtcbiAgICB9XG5cbiAgICB2YXIgaW52b2tlQ29uZmlnID0gZmxhdHRlbih0aGlzLmludm9rZS5tYXAoZnVuY3Rpb24gKGludm9rZURlZikge1xuICAgICAgdmFyIHNldHRsZVRyYW5zaXRpb25zID0gW107XG5cbiAgICAgIGlmIChpbnZva2VEZWYub25Eb25lKSB7XG4gICAgICAgIHNldHRsZVRyYW5zaXRpb25zLnB1c2guYXBwbHkoc2V0dGxlVHJhbnNpdGlvbnMsIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZCh0b1RyYW5zaXRpb25Db25maWdBcnJheShTdHJpbmcoZG9uZUludm9rZShpbnZva2VEZWYuaWQpKSwgaW52b2tlRGVmLm9uRG9uZSkpLCBmYWxzZSkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW52b2tlRGVmLm9uRXJyb3IpIHtcbiAgICAgICAgc2V0dGxlVHJhbnNpdGlvbnMucHVzaC5hcHBseShzZXR0bGVUcmFuc2l0aW9ucywgX19zcHJlYWRBcnJheShbXSwgX19yZWFkKHRvVHJhbnNpdGlvbkNvbmZpZ0FycmF5KFN0cmluZyhlcnJvcihpbnZva2VEZWYuaWQpKSwgaW52b2tlRGVmLm9uRXJyb3IpKSwgZmFsc2UpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHNldHRsZVRyYW5zaXRpb25zO1xuICAgIH0pKTtcbiAgICB2YXIgZGVsYXllZFRyYW5zaXRpb25zID0gdGhpcy5hZnRlcjtcbiAgICB2YXIgZm9ybWF0dGVkVHJhbnNpdGlvbnMgPSBmbGF0dGVuKF9fc3ByZWFkQXJyYXkoX19zcHJlYWRBcnJheShfX3NwcmVhZEFycmF5KF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChkb25lQ29uZmlnKSwgZmFsc2UpLCBfX3JlYWQoaW52b2tlQ29uZmlnKSwgZmFsc2UpLCBfX3JlYWQob25Db25maWcpLCBmYWxzZSksIF9fcmVhZChldmVudGxlc3NDb25maWcpLCBmYWxzZSkubWFwKGZ1bmN0aW9uICh0cmFuc2l0aW9uQ29uZmlnKSB7XG4gICAgICByZXR1cm4gdG9BcnJheSh0cmFuc2l0aW9uQ29uZmlnKS5tYXAoZnVuY3Rpb24gKHRyYW5zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLmZvcm1hdFRyYW5zaXRpb24odHJhbnNpdGlvbik7XG4gICAgICB9KTtcbiAgICB9KSk7XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgZGVsYXllZFRyYW5zaXRpb25zXzEgPSBfX3ZhbHVlcyhkZWxheWVkVHJhbnNpdGlvbnMpLCBkZWxheWVkVHJhbnNpdGlvbnNfMV8xID0gZGVsYXllZFRyYW5zaXRpb25zXzEubmV4dCgpOyAhZGVsYXllZFRyYW5zaXRpb25zXzFfMS5kb25lOyBkZWxheWVkVHJhbnNpdGlvbnNfMV8xID0gZGVsYXllZFRyYW5zaXRpb25zXzEubmV4dCgpKSB7XG4gICAgICAgIHZhciBkZWxheWVkVHJhbnNpdGlvbiA9IGRlbGF5ZWRUcmFuc2l0aW9uc18xXzEudmFsdWU7XG4gICAgICAgIGZvcm1hdHRlZFRyYW5zaXRpb25zLnB1c2goZGVsYXllZFRyYW5zaXRpb24pO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfMTBfMSkge1xuICAgICAgZV8xMCA9IHtcbiAgICAgICAgZXJyb3I6IGVfMTBfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKGRlbGF5ZWRUcmFuc2l0aW9uc18xXzEgJiYgIWRlbGF5ZWRUcmFuc2l0aW9uc18xXzEuZG9uZSAmJiAoX2EgPSBkZWxheWVkVHJhbnNpdGlvbnNfMS5yZXR1cm4pKSBfYS5jYWxsKGRlbGF5ZWRUcmFuc2l0aW9uc18xKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzEwKSB0aHJvdyBlXzEwLmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmb3JtYXR0ZWRUcmFuc2l0aW9ucztcbiAgfTtcblxuICByZXR1cm4gU3RhdGVOb2RlO1xufSgpO1xuXG5leHBvcnQgeyBTdGF0ZU5vZGUgfTtcbiIsIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcblxyXG52YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfTtcclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZnVuY3Rpb24gX19zcHJlYWRBcnJheSh0bywgZnJvbSwgcGFjaykge1xyXG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XHJcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XHJcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcclxufVxuXG5leHBvcnQgeyBfX2Fzc2lnbiwgX19yZWFkLCBfX3Jlc3QsIF9fc3ByZWFkQXJyYXksIF9fdmFsdWVzIH07XG4iLCJpbXBvcnQgeyBBY3Rpb25UeXBlcyB9IGZyb20gJy4vdHlwZXMuanMnO1xuXG52YXIgc3RhcnQgPSBBY3Rpb25UeXBlcy5TdGFydDtcbnZhciBzdG9wID0gQWN0aW9uVHlwZXMuU3RvcDtcbnZhciByYWlzZSA9IEFjdGlvblR5cGVzLlJhaXNlO1xudmFyIHNlbmQgPSBBY3Rpb25UeXBlcy5TZW5kO1xudmFyIGNhbmNlbCA9IEFjdGlvblR5cGVzLkNhbmNlbDtcbnZhciBudWxsRXZlbnQgPSBBY3Rpb25UeXBlcy5OdWxsRXZlbnQ7XG52YXIgYXNzaWduID0gQWN0aW9uVHlwZXMuQXNzaWduO1xudmFyIGFmdGVyID0gQWN0aW9uVHlwZXMuQWZ0ZXI7XG52YXIgZG9uZVN0YXRlID0gQWN0aW9uVHlwZXMuRG9uZVN0YXRlO1xudmFyIGxvZyA9IEFjdGlvblR5cGVzLkxvZztcbnZhciBpbml0ID0gQWN0aW9uVHlwZXMuSW5pdDtcbnZhciBpbnZva2UgPSBBY3Rpb25UeXBlcy5JbnZva2U7XG52YXIgZXJyb3JFeGVjdXRpb24gPSBBY3Rpb25UeXBlcy5FcnJvckV4ZWN1dGlvbjtcbnZhciBlcnJvclBsYXRmb3JtID0gQWN0aW9uVHlwZXMuRXJyb3JQbGF0Zm9ybTtcbnZhciBlcnJvciA9IEFjdGlvblR5cGVzLkVycm9yQ3VzdG9tO1xudmFyIHVwZGF0ZSA9IEFjdGlvblR5cGVzLlVwZGF0ZTtcbnZhciBjaG9vc2UgPSBBY3Rpb25UeXBlcy5DaG9vc2U7XG52YXIgcHVyZSA9IEFjdGlvblR5cGVzLlB1cmU7XG5cbmV4cG9ydCB7IGFmdGVyLCBhc3NpZ24sIGNhbmNlbCwgY2hvb3NlLCBkb25lU3RhdGUsIGVycm9yLCBlcnJvckV4ZWN1dGlvbiwgZXJyb3JQbGF0Zm9ybSwgaW5pdCwgaW52b2tlLCBsb2csIG51bGxFdmVudCwgcHVyZSwgcmFpc2UsIHNlbmQsIHN0YXJ0LCBzdG9wLCB1cGRhdGUgfTtcbiIsImltcG9ydCB7IF9fYXNzaWduLCBfX3NwcmVhZEFycmF5LCBfX3JlYWQsIF9fdmFsdWVzIH0gZnJvbSAnLi9fdmlydHVhbC9fdHNsaWIuanMnO1xuaW1wb3J0IHsgU3BlY2lhbFRhcmdldHMsIEFjdGlvblR5cGVzIH0gZnJvbSAnLi90eXBlcy5qcyc7XG5pbXBvcnQgeyBpbml0LCByYWlzZSBhcyByYWlzZSQxLCBzZW5kIGFzIHNlbmQkMSwgdXBkYXRlLCBsb2cgYXMgbG9nJDEsIGNhbmNlbCBhcyBjYW5jZWwkMSwgYXNzaWduIGFzIGFzc2lnbiQxLCBlcnJvciBhcyBlcnJvciQxLCBzdG9wIGFzIHN0b3AkMSwgcHVyZSBhcyBwdXJlJDEsIGNob29zZSBhcyBjaG9vc2UkMSB9IGZyb20gJy4vYWN0aW9uVHlwZXMuanMnO1xuaW1wb3J0ICogYXMgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcy5qcyc7XG5leHBvcnQgeyBhY3Rpb25UeXBlcyB9O1xuaW1wb3J0IHsgdG9TQ1hNTEV2ZW50LCBpc1N0cmluZywgaXNGdW5jdGlvbiwgdG9FdmVudE9iamVjdCwgZ2V0RXZlbnRUeXBlLCB1cGRhdGVDb250ZXh0LCBmbGF0dGVuLCBpc0FycmF5LCB0b0FycmF5LCB0b0d1YXJkLCBldmFsdWF0ZUd1YXJkLCB3YXJuIH0gZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQgeyBJU19QUk9EVUNUSU9OIH0gZnJvbSAnLi9lbnZpcm9ubWVudC5qcyc7XG5cbnZhciBpbml0RXZlbnQgPSAvKiNfX1BVUkVfXyovdG9TQ1hNTEV2ZW50KHtcbiAgdHlwZTogaW5pdFxufSk7XG5mdW5jdGlvbiBnZXRBY3Rpb25GdW5jdGlvbihhY3Rpb25UeXBlLCBhY3Rpb25GdW5jdGlvbk1hcCkge1xuICByZXR1cm4gYWN0aW9uRnVuY3Rpb25NYXAgPyBhY3Rpb25GdW5jdGlvbk1hcFthY3Rpb25UeXBlXSB8fCB1bmRlZmluZWQgOiB1bmRlZmluZWQ7XG59XG5mdW5jdGlvbiB0b0FjdGlvbk9iamVjdChhY3Rpb24sIGFjdGlvbkZ1bmN0aW9uTWFwKSB7XG4gIHZhciBhY3Rpb25PYmplY3Q7XG5cbiAgaWYgKGlzU3RyaW5nKGFjdGlvbikgfHwgdHlwZW9mIGFjdGlvbiA9PT0gJ251bWJlcicpIHtcbiAgICB2YXIgZXhlYyA9IGdldEFjdGlvbkZ1bmN0aW9uKGFjdGlvbiwgYWN0aW9uRnVuY3Rpb25NYXApO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oZXhlYykpIHtcbiAgICAgIGFjdGlvbk9iamVjdCA9IHtcbiAgICAgICAgdHlwZTogYWN0aW9uLFxuICAgICAgICBleGVjOiBleGVjXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoZXhlYykge1xuICAgICAgYWN0aW9uT2JqZWN0ID0gZXhlYztcbiAgICB9IGVsc2Uge1xuICAgICAgYWN0aW9uT2JqZWN0ID0ge1xuICAgICAgICB0eXBlOiBhY3Rpb24sXG4gICAgICAgIGV4ZWM6IHVuZGVmaW5lZFxuICAgICAgfTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNGdW5jdGlvbihhY3Rpb24pKSB7XG4gICAgYWN0aW9uT2JqZWN0ID0ge1xuICAgICAgLy8gQ29udmVydCBhY3Rpb24gdG8gc3RyaW5nIGlmIHVubmFtZWRcbiAgICAgIHR5cGU6IGFjdGlvbi5uYW1lIHx8IGFjdGlvbi50b1N0cmluZygpLFxuICAgICAgZXhlYzogYWN0aW9uXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgZXhlYyA9IGdldEFjdGlvbkZ1bmN0aW9uKGFjdGlvbi50eXBlLCBhY3Rpb25GdW5jdGlvbk1hcCk7XG5cbiAgICBpZiAoaXNGdW5jdGlvbihleGVjKSkge1xuICAgICAgYWN0aW9uT2JqZWN0ID0gX19hc3NpZ24oX19hc3NpZ24oe30sIGFjdGlvbiksIHtcbiAgICAgICAgZXhlYzogZXhlY1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChleGVjKSB7XG4gICAgICB2YXIgYWN0aW9uVHlwZSA9IGV4ZWMudHlwZSB8fCBhY3Rpb24udHlwZTtcbiAgICAgIGFjdGlvbk9iamVjdCA9IF9fYXNzaWduKF9fYXNzaWduKF9fYXNzaWduKHt9LCBleGVjKSwgYWN0aW9uKSwge1xuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWN0aW9uT2JqZWN0ID0gYWN0aW9uO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhY3Rpb25PYmplY3Q7XG59XG52YXIgdG9BY3Rpb25PYmplY3RzID0gZnVuY3Rpb24gKGFjdGlvbiwgYWN0aW9uRnVuY3Rpb25NYXApIHtcbiAgaWYgKCFhY3Rpb24pIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICB2YXIgYWN0aW9ucyA9IGlzQXJyYXkoYWN0aW9uKSA/IGFjdGlvbiA6IFthY3Rpb25dO1xuICByZXR1cm4gYWN0aW9ucy5tYXAoZnVuY3Rpb24gKHN1YkFjdGlvbikge1xuICAgIHJldHVybiB0b0FjdGlvbk9iamVjdChzdWJBY3Rpb24sIGFjdGlvbkZ1bmN0aW9uTWFwKTtcbiAgfSk7XG59O1xuZnVuY3Rpb24gdG9BY3Rpdml0eURlZmluaXRpb24oYWN0aW9uKSB7XG4gIHZhciBhY3Rpb25PYmplY3QgPSB0b0FjdGlvbk9iamVjdChhY3Rpb24pO1xuICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe1xuICAgIGlkOiBpc1N0cmluZyhhY3Rpb24pID8gYWN0aW9uIDogYWN0aW9uT2JqZWN0LmlkXG4gIH0sIGFjdGlvbk9iamVjdCksIHtcbiAgICB0eXBlOiBhY3Rpb25PYmplY3QudHlwZVxuICB9KTtcbn1cbi8qKlxyXG4gKiBSYWlzZXMgYW4gZXZlbnQuIFRoaXMgcGxhY2VzIHRoZSBldmVudCBpbiB0aGUgaW50ZXJuYWwgZXZlbnQgcXVldWUsIHNvIHRoYXRcclxuICogdGhlIGV2ZW50IGlzIGltbWVkaWF0ZWx5IGNvbnN1bWVkIGJ5IHRoZSBtYWNoaW5lIGluIHRoZSBjdXJyZW50IHN0ZXAuXHJcbiAqXHJcbiAqIEBwYXJhbSBldmVudFR5cGUgVGhlIGV2ZW50IHRvIHJhaXNlLlxyXG4gKi9cblxuZnVuY3Rpb24gcmFpc2UoZXZlbnQsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiByYWlzZSQxLFxuICAgIGV2ZW50OiB0eXBlb2YgZXZlbnQgPT09ICdmdW5jdGlvbicgPyBldmVudCA6IHRvRXZlbnRPYmplY3QoZXZlbnQpLFxuICAgIGRlbGF5OiBvcHRpb25zID8gb3B0aW9ucy5kZWxheSA6IHVuZGVmaW5lZCxcbiAgICBpZDogb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLmlkXG4gIH07XG59XG5mdW5jdGlvbiByZXNvbHZlUmFpc2UoYWN0aW9uLCBjdHgsIF9ldmVudCwgZGVsYXlzTWFwKSB7XG4gIHZhciBtZXRhID0ge1xuICAgIF9ldmVudDogX2V2ZW50XG4gIH07XG4gIHZhciByZXNvbHZlZEV2ZW50ID0gdG9TQ1hNTEV2ZW50KGlzRnVuY3Rpb24oYWN0aW9uLmV2ZW50KSA/IGFjdGlvbi5ldmVudChjdHgsIF9ldmVudC5kYXRhLCBtZXRhKSA6IGFjdGlvbi5ldmVudCk7XG4gIHZhciByZXNvbHZlZERlbGF5O1xuXG4gIGlmIChpc1N0cmluZyhhY3Rpb24uZGVsYXkpKSB7XG4gICAgdmFyIGNvbmZpZ0RlbGF5ID0gZGVsYXlzTWFwICYmIGRlbGF5c01hcFthY3Rpb24uZGVsYXldO1xuICAgIHJlc29sdmVkRGVsYXkgPSBpc0Z1bmN0aW9uKGNvbmZpZ0RlbGF5KSA/IGNvbmZpZ0RlbGF5KGN0eCwgX2V2ZW50LmRhdGEsIG1ldGEpIDogY29uZmlnRGVsYXk7XG4gIH0gZWxzZSB7XG4gICAgcmVzb2x2ZWREZWxheSA9IGlzRnVuY3Rpb24oYWN0aW9uLmRlbGF5KSA/IGFjdGlvbi5kZWxheShjdHgsIF9ldmVudC5kYXRhLCBtZXRhKSA6IGFjdGlvbi5kZWxheTtcbiAgfVxuXG4gIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgYWN0aW9uKSwge1xuICAgIHR5cGU6IHJhaXNlJDEsXG4gICAgX2V2ZW50OiByZXNvbHZlZEV2ZW50LFxuICAgIGRlbGF5OiByZXNvbHZlZERlbGF5XG4gIH0pO1xufVxuLyoqXHJcbiAqIFNlbmRzIGFuIGV2ZW50LiBUaGlzIHJldHVybnMgYW4gYWN0aW9uIHRoYXQgd2lsbCBiZSByZWFkIGJ5IGFuIGludGVycHJldGVyIHRvXHJcbiAqIHNlbmQgdGhlIGV2ZW50IGluIHRoZSBuZXh0IHN0ZXAsIGFmdGVyIHRoZSBjdXJyZW50IHN0ZXAgaXMgZmluaXNoZWQgZXhlY3V0aW5nLlxyXG4gKlxyXG4gKiBAZGVwcmVjYXRlZCBVc2UgdGhlIGBzZW5kVG8oLi4uKWAgYWN0aW9uIGNyZWF0b3IgaW5zdGVhZC5cclxuICpcclxuICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCB0byBzZW5kLlxyXG4gKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIHRvIHBhc3MgaW50byB0aGUgc2VuZCBldmVudDpcclxuICogIC0gYGlkYCAtIFRoZSB1bmlxdWUgc2VuZCBldmVudCBpZGVudGlmaWVyICh1c2VkIHdpdGggYGNhbmNlbCgpYCkuXHJcbiAqICAtIGBkZWxheWAgLSBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byBkZWxheSB0aGUgc2VuZGluZyBvZiB0aGUgZXZlbnQuXHJcbiAqICAtIGB0b2AgLSBUaGUgdGFyZ2V0IG9mIHRoaXMgZXZlbnQgKGJ5IGRlZmF1bHQsIHRoZSBtYWNoaW5lIHRoZSBldmVudCB3YXMgc2VudCBmcm9tKS5cclxuICovXG5cbmZ1bmN0aW9uIHNlbmQoZXZlbnQsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIHtcbiAgICB0bzogb3B0aW9ucyA/IG9wdGlvbnMudG8gOiB1bmRlZmluZWQsXG4gICAgdHlwZTogc2VuZCQxLFxuICAgIGV2ZW50OiBpc0Z1bmN0aW9uKGV2ZW50KSA/IGV2ZW50IDogdG9FdmVudE9iamVjdChldmVudCksXG4gICAgZGVsYXk6IG9wdGlvbnMgPyBvcHRpb25zLmRlbGF5IDogdW5kZWZpbmVkLFxuICAgIC8vIFRPRE86IGRvbid0IGF1dG8tZ2VuZXJhdGUgSURzIGhlcmUgbGlrZSB0aGF0XG4gICAgLy8gdGhlcmUgaXMgdG9vIGJpZyBjaGFuY2Ugb2YgdGhlIElEIGNvbGxpc2lvblxuICAgIGlkOiBvcHRpb25zICYmIG9wdGlvbnMuaWQgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuaWQgOiBpc0Z1bmN0aW9uKGV2ZW50KSA/IGV2ZW50Lm5hbWUgOiBnZXRFdmVudFR5cGUoZXZlbnQpXG4gIH07XG59XG5mdW5jdGlvbiByZXNvbHZlU2VuZChhY3Rpb24sIGN0eCwgX2V2ZW50LCBkZWxheXNNYXApIHtcbiAgdmFyIG1ldGEgPSB7XG4gICAgX2V2ZW50OiBfZXZlbnRcbiAgfTsgLy8gVE9ETzogaGVscGVyIGZ1bmN0aW9uIGZvciByZXNvbHZpbmcgRXhwclxuXG4gIHZhciByZXNvbHZlZEV2ZW50ID0gdG9TQ1hNTEV2ZW50KGlzRnVuY3Rpb24oYWN0aW9uLmV2ZW50KSA/IGFjdGlvbi5ldmVudChjdHgsIF9ldmVudC5kYXRhLCBtZXRhKSA6IGFjdGlvbi5ldmVudCk7XG4gIHZhciByZXNvbHZlZERlbGF5O1xuXG4gIGlmIChpc1N0cmluZyhhY3Rpb24uZGVsYXkpKSB7XG4gICAgdmFyIGNvbmZpZ0RlbGF5ID0gZGVsYXlzTWFwICYmIGRlbGF5c01hcFthY3Rpb24uZGVsYXldO1xuICAgIHJlc29sdmVkRGVsYXkgPSBpc0Z1bmN0aW9uKGNvbmZpZ0RlbGF5KSA/IGNvbmZpZ0RlbGF5KGN0eCwgX2V2ZW50LmRhdGEsIG1ldGEpIDogY29uZmlnRGVsYXk7XG4gIH0gZWxzZSB7XG4gICAgcmVzb2x2ZWREZWxheSA9IGlzRnVuY3Rpb24oYWN0aW9uLmRlbGF5KSA/IGFjdGlvbi5kZWxheShjdHgsIF9ldmVudC5kYXRhLCBtZXRhKSA6IGFjdGlvbi5kZWxheTtcbiAgfVxuXG4gIHZhciByZXNvbHZlZFRhcmdldCA9IGlzRnVuY3Rpb24oYWN0aW9uLnRvKSA/IGFjdGlvbi50byhjdHgsIF9ldmVudC5kYXRhLCBtZXRhKSA6IGFjdGlvbi50bztcbiAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCBhY3Rpb24pLCB7XG4gICAgdG86IHJlc29sdmVkVGFyZ2V0LFxuICAgIF9ldmVudDogcmVzb2x2ZWRFdmVudCxcbiAgICBldmVudDogcmVzb2x2ZWRFdmVudC5kYXRhLFxuICAgIGRlbGF5OiByZXNvbHZlZERlbGF5XG4gIH0pO1xufVxuLyoqXHJcbiAqIFNlbmRzIGFuIGV2ZW50IHRvIHRoaXMgbWFjaGluZSdzIHBhcmVudC5cclxuICpcclxuICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCB0byBzZW5kIHRvIHRoZSBwYXJlbnQgbWFjaGluZS5cclxuICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyB0byBwYXNzIGludG8gdGhlIHNlbmQgZXZlbnQuXHJcbiAqL1xuXG5mdW5jdGlvbiBzZW5kUGFyZW50KGV2ZW50LCBvcHRpb25zKSB7XG4gIHJldHVybiBzZW5kKGV2ZW50LCBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgb3B0aW9ucyksIHtcbiAgICB0bzogU3BlY2lhbFRhcmdldHMuUGFyZW50XG4gIH0pKTtcbn1cbi8qKlxyXG4gKiBTZW5kcyBhbiBldmVudCB0byBhbiBhY3Rvci5cclxuICpcclxuICogQHBhcmFtIGFjdG9yIFRoZSBgQWN0b3JSZWZgIHRvIHNlbmQgdGhlIGV2ZW50IHRvLlxyXG4gKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IHRvIHNlbmQsIG9yIGFuIGV4cHJlc3Npb24gdGhhdCBldmFsdWF0ZXMgdG8gdGhlIGV2ZW50IHRvIHNlbmRcclxuICogQHBhcmFtIG9wdGlvbnMgU2VuZCBhY3Rpb24gb3B0aW9uc1xyXG4gKiBAcmV0dXJucyBBbiBYU3RhdGUgc2VuZCBhY3Rpb24gb2JqZWN0XHJcbiAqL1xuXG5mdW5jdGlvbiBzZW5kVG8oYWN0b3IsIGV2ZW50LCBvcHRpb25zKSB7XG4gIHJldHVybiBzZW5kKGV2ZW50LCBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgb3B0aW9ucyksIHtcbiAgICB0bzogYWN0b3JcbiAgfSkpO1xufVxuLyoqXHJcbiAqIFNlbmRzIGFuIHVwZGF0ZSBldmVudCB0byB0aGlzIG1hY2hpbmUncyBwYXJlbnQuXHJcbiAqL1xuXG5mdW5jdGlvbiBzZW5kVXBkYXRlKCkge1xuICByZXR1cm4gc2VuZFBhcmVudCh1cGRhdGUpO1xufVxuLyoqXHJcbiAqIFNlbmRzIGFuIGV2ZW50IGJhY2sgdG8gdGhlIHNlbmRlciBvZiB0aGUgb3JpZ2luYWwgZXZlbnQuXHJcbiAqXHJcbiAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgdG8gc2VuZCBiYWNrIHRvIHRoZSBzZW5kZXJcclxuICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyB0byBwYXNzIGludG8gdGhlIHNlbmQgZXZlbnRcclxuICovXG5cbmZ1bmN0aW9uIHJlc3BvbmQoZXZlbnQsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIHNlbmQoZXZlbnQsIF9fYXNzaWduKF9fYXNzaWduKHt9LCBvcHRpb25zKSwge1xuICAgIHRvOiBmdW5jdGlvbiAoXywgX18sIF9hKSB7XG4gICAgICB2YXIgX2V2ZW50ID0gX2EuX2V2ZW50O1xuICAgICAgcmV0dXJuIF9ldmVudC5vcmlnaW47IC8vIFRPRE86IGhhbmRsZSB3aGVuIF9ldmVudC5vcmlnaW4gaXMgdW5kZWZpbmVkXG4gICAgfVxuICB9KSk7XG59XG5cbnZhciBkZWZhdWx0TG9nRXhwciA9IGZ1bmN0aW9uIChjb250ZXh0LCBldmVudCkge1xuICByZXR1cm4ge1xuICAgIGNvbnRleHQ6IGNvbnRleHQsXG4gICAgZXZlbnQ6IGV2ZW50XG4gIH07XG59O1xuLyoqXHJcbiAqXHJcbiAqIEBwYXJhbSBleHByIFRoZSBleHByZXNzaW9uIGZ1bmN0aW9uIHRvIGV2YWx1YXRlIHdoaWNoIHdpbGwgYmUgbG9nZ2VkLlxyXG4gKiAgVGFrZXMgaW4gMiBhcmd1bWVudHM6XHJcbiAqICAtIGBjdHhgIC0gdGhlIGN1cnJlbnQgc3RhdGUgY29udGV4dFxyXG4gKiAgLSBgZXZlbnRgIC0gdGhlIGV2ZW50IHRoYXQgY2F1c2VkIHRoaXMgYWN0aW9uIHRvIGJlIGV4ZWN1dGVkLlxyXG4gKiBAcGFyYW0gbGFiZWwgVGhlIGxhYmVsIHRvIGdpdmUgdG8gdGhlIGxvZ2dlZCBleHByZXNzaW9uLlxyXG4gKi9cblxuXG5mdW5jdGlvbiBsb2coZXhwciwgbGFiZWwpIHtcbiAgaWYgKGV4cHIgPT09IHZvaWQgMCkge1xuICAgIGV4cHIgPSBkZWZhdWx0TG9nRXhwcjtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdHlwZTogbG9nJDEsXG4gICAgbGFiZWw6IGxhYmVsLFxuICAgIGV4cHI6IGV4cHJcbiAgfTtcbn1cbnZhciByZXNvbHZlTG9nID0gZnVuY3Rpb24gKGFjdGlvbiwgY3R4LCBfZXZlbnQpIHtcbiAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCBhY3Rpb24pLCB7XG4gICAgdmFsdWU6IGlzU3RyaW5nKGFjdGlvbi5leHByKSA/IGFjdGlvbi5leHByIDogYWN0aW9uLmV4cHIoY3R4LCBfZXZlbnQuZGF0YSwge1xuICAgICAgX2V2ZW50OiBfZXZlbnRcbiAgICB9KVxuICB9KTtcbn07XG4vKipcclxuICogQ2FuY2VscyBhbiBpbi1mbGlnaHQgYHNlbmQoLi4uKWAgYWN0aW9uLiBBIGNhbmNlbGVkIHNlbnQgYWN0aW9uIHdpbGwgbm90XHJcbiAqIGJlIGV4ZWN1dGVkLCBub3Igd2lsbCBpdHMgZXZlbnQgYmUgc2VudCwgdW5sZXNzIGl0IGhhcyBhbHJlYWR5IGJlZW4gc2VudFxyXG4gKiAoZS5nLiwgaWYgYGNhbmNlbCguLi4pYCBpcyBjYWxsZWQgYWZ0ZXIgdGhlIGBzZW5kKC4uLilgIGFjdGlvbidzIGBkZWxheWApLlxyXG4gKlxyXG4gKiBAcGFyYW0gc2VuZElkIFRoZSBgaWRgIG9mIHRoZSBgc2VuZCguLi4pYCBhY3Rpb24gdG8gY2FuY2VsLlxyXG4gKi9cblxudmFyIGNhbmNlbCA9IGZ1bmN0aW9uIChzZW5kSWQpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBjYW5jZWwkMSxcbiAgICBzZW5kSWQ6IHNlbmRJZFxuICB9O1xufTtcbi8qKlxyXG4gKiBTdGFydHMgYW4gYWN0aXZpdHkuXHJcbiAqXHJcbiAqIEBwYXJhbSBhY3Rpdml0eSBUaGUgYWN0aXZpdHkgdG8gc3RhcnQuXHJcbiAqL1xuXG5mdW5jdGlvbiBzdGFydChhY3Rpdml0eSkge1xuICB2YXIgYWN0aXZpdHlEZWYgPSB0b0FjdGl2aXR5RGVmaW5pdGlvbihhY3Rpdml0eSk7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuU3RhcnQsXG4gICAgYWN0aXZpdHk6IGFjdGl2aXR5RGVmLFxuICAgIGV4ZWM6IHVuZGVmaW5lZFxuICB9O1xufVxuLyoqXHJcbiAqIFN0b3BzIGFuIGFjdGl2aXR5LlxyXG4gKlxyXG4gKiBAcGFyYW0gYWN0b3JSZWYgVGhlIGFjdGl2aXR5IHRvIHN0b3AuXHJcbiAqL1xuXG5mdW5jdGlvbiBzdG9wKGFjdG9yUmVmKSB7XG4gIHZhciBhY3Rpdml0eSA9IGlzRnVuY3Rpb24oYWN0b3JSZWYpID8gYWN0b3JSZWYgOiB0b0FjdGl2aXR5RGVmaW5pdGlvbihhY3RvclJlZik7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuU3RvcCxcbiAgICBhY3Rpdml0eTogYWN0aXZpdHksXG4gICAgZXhlYzogdW5kZWZpbmVkXG4gIH07XG59XG5mdW5jdGlvbiByZXNvbHZlU3RvcChhY3Rpb24sIGNvbnRleHQsIF9ldmVudCkge1xuICB2YXIgYWN0b3JSZWZPclN0cmluZyA9IGlzRnVuY3Rpb24oYWN0aW9uLmFjdGl2aXR5KSA/IGFjdGlvbi5hY3Rpdml0eShjb250ZXh0LCBfZXZlbnQuZGF0YSkgOiBhY3Rpb24uYWN0aXZpdHk7XG4gIHZhciByZXNvbHZlZEFjdG9yUmVmID0gdHlwZW9mIGFjdG9yUmVmT3JTdHJpbmcgPT09ICdzdHJpbmcnID8ge1xuICAgIGlkOiBhY3RvclJlZk9yU3RyaW5nXG4gIH0gOiBhY3RvclJlZk9yU3RyaW5nO1xuICB2YXIgYWN0aW9uT2JqZWN0ID0ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLlN0b3AsXG4gICAgYWN0aXZpdHk6IHJlc29sdmVkQWN0b3JSZWZcbiAgfTtcbiAgcmV0dXJuIGFjdGlvbk9iamVjdDtcbn1cbi8qKlxyXG4gKiBVcGRhdGVzIHRoZSBjdXJyZW50IGNvbnRleHQgb2YgdGhlIG1hY2hpbmUuXHJcbiAqXHJcbiAqIEBwYXJhbSBhc3NpZ25tZW50IEFuIG9iamVjdCB0aGF0IHJlcHJlc2VudHMgdGhlIHBhcnRpYWwgY29udGV4dCB0byB1cGRhdGUuXHJcbiAqL1xuXG52YXIgYXNzaWduID0gZnVuY3Rpb24gKGFzc2lnbm1lbnQpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBhc3NpZ24kMSxcbiAgICBhc3NpZ25tZW50OiBhc3NpZ25tZW50XG4gIH07XG59O1xuZnVuY3Rpb24gaXNBY3Rpb25PYmplY3QoYWN0aW9uKSB7XG4gIHJldHVybiB0eXBlb2YgYWN0aW9uID09PSAnb2JqZWN0JyAmJiAndHlwZScgaW4gYWN0aW9uO1xufVxuLyoqXHJcbiAqIFJldHVybnMgYW4gZXZlbnQgdHlwZSB0aGF0IHJlcHJlc2VudHMgYW4gaW1wbGljaXQgZXZlbnQgdGhhdFxyXG4gKiBpcyBzZW50IGFmdGVyIHRoZSBzcGVjaWZpZWQgYGRlbGF5YC5cclxuICpcclxuICogQHBhcmFtIGRlbGF5UmVmIFRoZSBkZWxheSBpbiBtaWxsaXNlY29uZHNcclxuICogQHBhcmFtIGlkIFRoZSBzdGF0ZSBub2RlIElEIHdoZXJlIHRoaXMgZXZlbnQgaXMgaGFuZGxlZFxyXG4gKi9cblxuZnVuY3Rpb24gYWZ0ZXIoZGVsYXlSZWYsIGlkKSB7XG4gIHZhciBpZFN1ZmZpeCA9IGlkID8gXCIjXCIuY29uY2F0KGlkKSA6ICcnO1xuICByZXR1cm4gXCJcIi5jb25jYXQoQWN0aW9uVHlwZXMuQWZ0ZXIsIFwiKFwiKS5jb25jYXQoZGVsYXlSZWYsIFwiKVwiKS5jb25jYXQoaWRTdWZmaXgpO1xufVxuLyoqXHJcbiAqIFJldHVybnMgYW4gZXZlbnQgdGhhdCByZXByZXNlbnRzIHRoYXQgYSBmaW5hbCBzdGF0ZSBub2RlXHJcbiAqIGhhcyBiZWVuIHJlYWNoZWQgaW4gdGhlIHBhcmVudCBzdGF0ZSBub2RlLlxyXG4gKlxyXG4gKiBAcGFyYW0gaWQgVGhlIGZpbmFsIHN0YXRlIG5vZGUncyBwYXJlbnQgc3RhdGUgbm9kZSBgaWRgXHJcbiAqIEBwYXJhbSBkYXRhIFRoZSBkYXRhIHRvIHBhc3MgaW50byB0aGUgZXZlbnRcclxuICovXG5cbmZ1bmN0aW9uIGRvbmUoaWQsIGRhdGEpIHtcbiAgdmFyIHR5cGUgPSBcIlwiLmNvbmNhdChBY3Rpb25UeXBlcy5Eb25lU3RhdGUsIFwiLlwiKS5jb25jYXQoaWQpO1xuICB2YXIgZXZlbnRPYmplY3QgPSB7XG4gICAgdHlwZTogdHlwZSxcbiAgICBkYXRhOiBkYXRhXG4gIH07XG5cbiAgZXZlbnRPYmplY3QudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHR5cGU7XG4gIH07XG5cbiAgcmV0dXJuIGV2ZW50T2JqZWN0O1xufVxuLyoqXHJcbiAqIFJldHVybnMgYW4gZXZlbnQgdGhhdCByZXByZXNlbnRzIHRoYXQgYW4gaW52b2tlZCBzZXJ2aWNlIGhhcyB0ZXJtaW5hdGVkLlxyXG4gKlxyXG4gKiBBbiBpbnZva2VkIHNlcnZpY2UgaXMgdGVybWluYXRlZCB3aGVuIGl0IGhhcyByZWFjaGVkIGEgdG9wLWxldmVsIGZpbmFsIHN0YXRlIG5vZGUsXHJcbiAqIGJ1dCBub3Qgd2hlbiBpdCBpcyBjYW5jZWxlZC5cclxuICpcclxuICogQHBhcmFtIGlkIFRoZSBmaW5hbCBzdGF0ZSBub2RlIElEXHJcbiAqIEBwYXJhbSBkYXRhIFRoZSBkYXRhIHRvIHBhc3MgaW50byB0aGUgZXZlbnRcclxuICovXG5cbmZ1bmN0aW9uIGRvbmVJbnZva2UoaWQsIGRhdGEpIHtcbiAgdmFyIHR5cGUgPSBcIlwiLmNvbmNhdChBY3Rpb25UeXBlcy5Eb25lSW52b2tlLCBcIi5cIikuY29uY2F0KGlkKTtcbiAgdmFyIGV2ZW50T2JqZWN0ID0ge1xuICAgIHR5cGU6IHR5cGUsXG4gICAgZGF0YTogZGF0YVxuICB9O1xuXG4gIGV2ZW50T2JqZWN0LnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0eXBlO1xuICB9O1xuXG4gIHJldHVybiBldmVudE9iamVjdDtcbn1cbmZ1bmN0aW9uIGVycm9yKGlkLCBkYXRhKSB7XG4gIHZhciB0eXBlID0gXCJcIi5jb25jYXQoQWN0aW9uVHlwZXMuRXJyb3JQbGF0Zm9ybSwgXCIuXCIpLmNvbmNhdChpZCk7XG4gIHZhciBldmVudE9iamVjdCA9IHtcbiAgICB0eXBlOiB0eXBlLFxuICAgIGRhdGE6IGRhdGFcbiAgfTtcblxuICBldmVudE9iamVjdC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdHlwZTtcbiAgfTtcblxuICByZXR1cm4gZXZlbnRPYmplY3Q7XG59XG5mdW5jdGlvbiBwdXJlKGdldEFjdGlvbnMpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5QdXJlLFxuICAgIGdldDogZ2V0QWN0aW9uc1xuICB9O1xufVxuLyoqXHJcbiAqIEZvcndhcmRzIChzZW5kcykgYW4gZXZlbnQgdG8gYSBzcGVjaWZpZWQgc2VydmljZS5cclxuICpcclxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IHNlcnZpY2UgdG8gZm9yd2FyZCB0aGUgZXZlbnQgdG8uXHJcbiAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgdG8gcGFzcyBpbnRvIHRoZSBzZW5kIGFjdGlvbiBjcmVhdG9yLlxyXG4gKi9cblxuZnVuY3Rpb24gZm9yd2FyZFRvKHRhcmdldCwgb3B0aW9ucykge1xuICBpZiAoIUlTX1BST0RVQ1RJT04gJiYgKCF0YXJnZXQgfHwgdHlwZW9mIHRhcmdldCA9PT0gJ2Z1bmN0aW9uJykpIHtcbiAgICB2YXIgb3JpZ2luYWxUYXJnZXRfMSA9IHRhcmdldDtcblxuICAgIHRhcmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBhcmdzID0gW107XG5cbiAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIGFyZ3NbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlc29sdmVkVGFyZ2V0ID0gdHlwZW9mIG9yaWdpbmFsVGFyZ2V0XzEgPT09ICdmdW5jdGlvbicgPyBvcmlnaW5hbFRhcmdldF8xLmFwcGx5KHZvaWQgMCwgX19zcHJlYWRBcnJheShbXSwgX19yZWFkKGFyZ3MpLCBmYWxzZSkpIDogb3JpZ2luYWxUYXJnZXRfMTtcblxuICAgICAgaWYgKCFyZXNvbHZlZFRhcmdldCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBdHRlbXB0ZWQgdG8gZm9yd2FyZCBldmVudCB0byB1bmRlZmluZWQgYWN0b3IuIFRoaXMgcmlza3MgYW4gaW5maW5pdGUgbG9vcCBpbiB0aGUgc2VuZGVyLlwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc29sdmVkVGFyZ2V0O1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gc2VuZChmdW5jdGlvbiAoXywgZXZlbnQpIHtcbiAgICByZXR1cm4gZXZlbnQ7XG4gIH0sIF9fYXNzaWduKF9fYXNzaWduKHt9LCBvcHRpb25zKSwge1xuICAgIHRvOiB0YXJnZXRcbiAgfSkpO1xufVxuLyoqXHJcbiAqIEVzY2FsYXRlcyBhbiBlcnJvciBieSBzZW5kaW5nIGl0IGFzIGFuIGV2ZW50IHRvIHRoaXMgbWFjaGluZSdzIHBhcmVudC5cclxuICpcclxuICogQHBhcmFtIGVycm9yRGF0YSBUaGUgZXJyb3IgZGF0YSB0byBzZW5kLCBvciB0aGUgZXhwcmVzc2lvbiBmdW5jdGlvbiB0aGF0XHJcbiAqIHRha2VzIGluIHRoZSBgY29udGV4dGAsIGBldmVudGAsIGFuZCBgbWV0YWAsIGFuZCByZXR1cm5zIHRoZSBlcnJvciBkYXRhIHRvIHNlbmQuXHJcbiAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgdG8gcGFzcyBpbnRvIHRoZSBzZW5kIGFjdGlvbiBjcmVhdG9yLlxyXG4gKi9cblxuZnVuY3Rpb24gZXNjYWxhdGUoZXJyb3JEYXRhLCBvcHRpb25zKSB7XG4gIHJldHVybiBzZW5kUGFyZW50KGZ1bmN0aW9uIChjb250ZXh0LCBldmVudCwgbWV0YSkge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiBlcnJvciQxLFxuICAgICAgZGF0YTogaXNGdW5jdGlvbihlcnJvckRhdGEpID8gZXJyb3JEYXRhKGNvbnRleHQsIGV2ZW50LCBtZXRhKSA6IGVycm9yRGF0YVxuICAgIH07XG4gIH0sIF9fYXNzaWduKF9fYXNzaWduKHt9LCBvcHRpb25zKSwge1xuICAgIHRvOiBTcGVjaWFsVGFyZ2V0cy5QYXJlbnRcbiAgfSkpO1xufVxuZnVuY3Rpb24gY2hvb3NlKGNvbmRzKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuQ2hvb3NlLFxuICAgIGNvbmRzOiBjb25kc1xuICB9O1xufVxuXG52YXIgcGx1Y2tBc3NpZ25zID0gZnVuY3Rpb24gKGFjdGlvbkJsb2Nrcykge1xuICB2YXIgZV8xLCBfYTtcblxuICB2YXIgYXNzaWduQWN0aW9ucyA9IFtdO1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgYWN0aW9uQmxvY2tzXzEgPSBfX3ZhbHVlcyhhY3Rpb25CbG9ja3MpLCBhY3Rpb25CbG9ja3NfMV8xID0gYWN0aW9uQmxvY2tzXzEubmV4dCgpOyAhYWN0aW9uQmxvY2tzXzFfMS5kb25lOyBhY3Rpb25CbG9ja3NfMV8xID0gYWN0aW9uQmxvY2tzXzEubmV4dCgpKSB7XG4gICAgICB2YXIgYmxvY2sgPSBhY3Rpb25CbG9ja3NfMV8xLnZhbHVlO1xuICAgICAgdmFyIGkgPSAwO1xuXG4gICAgICB3aGlsZSAoaSA8IGJsb2NrLmFjdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgIGlmIChibG9jay5hY3Rpb25zW2ldLnR5cGUgPT09IGFzc2lnbiQxKSB7XG4gICAgICAgICAgYXNzaWduQWN0aW9ucy5wdXNoKGJsb2NrLmFjdGlvbnNbaV0pO1xuICAgICAgICAgIGJsb2NrLmFjdGlvbnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZV8xXzEpIHtcbiAgICBlXzEgPSB7XG4gICAgICBlcnJvcjogZV8xXzFcbiAgICB9O1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoYWN0aW9uQmxvY2tzXzFfMSAmJiAhYWN0aW9uQmxvY2tzXzFfMS5kb25lICYmIChfYSA9IGFjdGlvbkJsb2Nrc18xLnJldHVybikpIF9hLmNhbGwoYWN0aW9uQmxvY2tzXzEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGFzc2lnbkFjdGlvbnM7XG59O1xuXG5mdW5jdGlvbiByZXNvbHZlQWN0aW9ucyhtYWNoaW5lLCBjdXJyZW50U3RhdGUsIGN1cnJlbnRDb250ZXh0LCBfZXZlbnQsIGFjdGlvbkJsb2NrcywgcHJlZGljdGFibGVFeGVjLCBwcmVzZXJ2ZUFjdGlvbk9yZGVyKSB7XG4gIGlmIChwcmVzZXJ2ZUFjdGlvbk9yZGVyID09PSB2b2lkIDApIHtcbiAgICBwcmVzZXJ2ZUFjdGlvbk9yZGVyID0gZmFsc2U7XG4gIH1cblxuICB2YXIgYXNzaWduQWN0aW9ucyA9IHByZXNlcnZlQWN0aW9uT3JkZXIgPyBbXSA6IHBsdWNrQXNzaWducyhhY3Rpb25CbG9ja3MpO1xuICB2YXIgdXBkYXRlZENvbnRleHQgPSBhc3NpZ25BY3Rpb25zLmxlbmd0aCA/IHVwZGF0ZUNvbnRleHQoY3VycmVudENvbnRleHQsIF9ldmVudCwgYXNzaWduQWN0aW9ucywgY3VycmVudFN0YXRlKSA6IGN1cnJlbnRDb250ZXh0O1xuICB2YXIgcHJlc2VydmVkQ29udGV4dHMgPSBwcmVzZXJ2ZUFjdGlvbk9yZGVyID8gW2N1cnJlbnRDb250ZXh0XSA6IHVuZGVmaW5lZDtcbiAgdmFyIGRlZmVycmVkVG9CbG9ja0VuZCA9IFtdO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUFjdGlvbihibG9ja1R5cGUsIGFjdGlvbk9iamVjdCkge1xuICAgIHZhciBfYTtcblxuICAgIHN3aXRjaCAoYWN0aW9uT2JqZWN0LnR5cGUpIHtcbiAgICAgIGNhc2UgcmFpc2UkMTpcbiAgICAgICAge1xuICAgICAgICAgIHZhciByYWlzZWRBY3Rpb24gPSByZXNvbHZlUmFpc2UoYWN0aW9uT2JqZWN0LCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50LCBtYWNoaW5lLm9wdGlvbnMuZGVsYXlzKTtcblxuICAgICAgICAgIGlmIChwcmVkaWN0YWJsZUV4ZWMgJiYgdHlwZW9mIHJhaXNlZEFjdGlvbi5kZWxheSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHByZWRpY3RhYmxlRXhlYyhyYWlzZWRBY3Rpb24sIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiByYWlzZWRBY3Rpb247XG4gICAgICAgIH1cblxuICAgICAgY2FzZSBzZW5kJDE6XG4gICAgICAgIHZhciBzZW5kQWN0aW9uID0gcmVzb2x2ZVNlbmQoYWN0aW9uT2JqZWN0LCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50LCBtYWNoaW5lLm9wdGlvbnMuZGVsYXlzKTsgLy8gVE9ETzogZml4IEFjdGlvblR5cGVzLkluaXRcblxuICAgICAgICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICAgICAgICB2YXIgY29uZmlndXJlZERlbGF5ID0gYWN0aW9uT2JqZWN0LmRlbGF5OyAvLyB3YXJuIGFmdGVyIHJlc29sdmluZyBhcyB3ZSBjYW4gY3JlYXRlIGJldHRlciBjb250ZXh0dWFsIG1lc3NhZ2UgaGVyZVxuXG4gICAgICAgICAgd2FybighaXNTdHJpbmcoY29uZmlndXJlZERlbGF5KSB8fCB0eXBlb2Ygc2VuZEFjdGlvbi5kZWxheSA9PT0gJ251bWJlcicsIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICAgICAgICBcIk5vIGRlbGF5IHJlZmVyZW5jZSBmb3IgZGVsYXkgZXhwcmVzc2lvbiAnXCIuY29uY2F0KGNvbmZpZ3VyZWREZWxheSwgXCInIHdhcyBmb3VuZCBvbiBtYWNoaW5lICdcIikuY29uY2F0KG1hY2hpbmUuaWQsIFwiJ1wiKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJlZGljdGFibGVFeGVjICYmIHNlbmRBY3Rpb24udG8gIT09IFNwZWNpYWxUYXJnZXRzLkludGVybmFsKSB7XG4gICAgICAgICAgaWYgKGJsb2NrVHlwZSA9PT0gJ2VudHJ5Jykge1xuICAgICAgICAgICAgZGVmZXJyZWRUb0Jsb2NrRW5kLnB1c2goc2VuZEFjdGlvbik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByZWRpY3RhYmxlRXhlYyhzZW5kQWN0aW9uLCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VuZEFjdGlvbjtcblxuICAgICAgY2FzZSBsb2ckMTpcbiAgICAgICAge1xuICAgICAgICAgIHZhciByZXNvbHZlZCA9IHJlc29sdmVMb2coYWN0aW9uT2JqZWN0LCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50KTtcbiAgICAgICAgICBwcmVkaWN0YWJsZUV4ZWMgPT09IG51bGwgfHwgcHJlZGljdGFibGVFeGVjID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwcmVkaWN0YWJsZUV4ZWMocmVzb2x2ZWQsIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQpO1xuICAgICAgICAgIHJldHVybiByZXNvbHZlZDtcbiAgICAgICAgfVxuXG4gICAgICBjYXNlIGNob29zZSQxOlxuICAgICAgICB7XG4gICAgICAgICAgdmFyIGNob29zZUFjdGlvbiA9IGFjdGlvbk9iamVjdDtcbiAgICAgICAgICB2YXIgbWF0Y2hlZEFjdGlvbnMgPSAoX2EgPSBjaG9vc2VBY3Rpb24uY29uZHMuZmluZChmdW5jdGlvbiAoY29uZGl0aW9uKSB7XG4gICAgICAgICAgICB2YXIgZ3VhcmQgPSB0b0d1YXJkKGNvbmRpdGlvbi5jb25kLCBtYWNoaW5lLm9wdGlvbnMuZ3VhcmRzKTtcbiAgICAgICAgICAgIHJldHVybiAhZ3VhcmQgfHwgZXZhbHVhdGVHdWFyZChtYWNoaW5lLCBndWFyZCwgdXBkYXRlZENvbnRleHQsIF9ldmVudCwgIXByZWRpY3RhYmxlRXhlYyA/IGN1cnJlbnRTdGF0ZSA6IHVuZGVmaW5lZCk7XG4gICAgICAgICAgfSkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5hY3Rpb25zO1xuXG4gICAgICAgICAgaWYgKCFtYXRjaGVkQWN0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBfYiA9IF9fcmVhZChyZXNvbHZlQWN0aW9ucyhtYWNoaW5lLCBjdXJyZW50U3RhdGUsIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQsIFt7XG4gICAgICAgICAgICB0eXBlOiBibG9ja1R5cGUsXG4gICAgICAgICAgICBhY3Rpb25zOiB0b0FjdGlvbk9iamVjdHModG9BcnJheShtYXRjaGVkQWN0aW9ucyksIG1hY2hpbmUub3B0aW9ucy5hY3Rpb25zKVxuICAgICAgICAgIH1dLCBwcmVkaWN0YWJsZUV4ZWMsIHByZXNlcnZlQWN0aW9uT3JkZXIpLCAyKSxcbiAgICAgICAgICAgICAgcmVzb2x2ZWRBY3Rpb25zRnJvbUNob29zZSA9IF9iWzBdLFxuICAgICAgICAgICAgICByZXNvbHZlZENvbnRleHRGcm9tQ2hvb3NlID0gX2JbMV07XG5cbiAgICAgICAgICB1cGRhdGVkQ29udGV4dCA9IHJlc29sdmVkQ29udGV4dEZyb21DaG9vc2U7XG4gICAgICAgICAgcHJlc2VydmVkQ29udGV4dHMgPT09IG51bGwgfHwgcHJlc2VydmVkQ29udGV4dHMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHByZXNlcnZlZENvbnRleHRzLnB1c2godXBkYXRlZENvbnRleHQpO1xuICAgICAgICAgIHJldHVybiByZXNvbHZlZEFjdGlvbnNGcm9tQ2hvb3NlO1xuICAgICAgICB9XG5cbiAgICAgIGNhc2UgcHVyZSQxOlxuICAgICAgICB7XG4gICAgICAgICAgdmFyIG1hdGNoZWRBY3Rpb25zID0gYWN0aW9uT2JqZWN0LmdldCh1cGRhdGVkQ29udGV4dCwgX2V2ZW50LmRhdGEpO1xuXG4gICAgICAgICAgaWYgKCFtYXRjaGVkQWN0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBfYyA9IF9fcmVhZChyZXNvbHZlQWN0aW9ucyhtYWNoaW5lLCBjdXJyZW50U3RhdGUsIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQsIFt7XG4gICAgICAgICAgICB0eXBlOiBibG9ja1R5cGUsXG4gICAgICAgICAgICBhY3Rpb25zOiB0b0FjdGlvbk9iamVjdHModG9BcnJheShtYXRjaGVkQWN0aW9ucyksIG1hY2hpbmUub3B0aW9ucy5hY3Rpb25zKVxuICAgICAgICAgIH1dLCBwcmVkaWN0YWJsZUV4ZWMsIHByZXNlcnZlQWN0aW9uT3JkZXIpLCAyKSxcbiAgICAgICAgICAgICAgcmVzb2x2ZWRBY3Rpb25zRnJvbVB1cmUgPSBfY1swXSxcbiAgICAgICAgICAgICAgcmVzb2x2ZWRDb250ZXh0ID0gX2NbMV07XG5cbiAgICAgICAgICB1cGRhdGVkQ29udGV4dCA9IHJlc29sdmVkQ29udGV4dDtcbiAgICAgICAgICBwcmVzZXJ2ZWRDb250ZXh0cyA9PT0gbnVsbCB8fCBwcmVzZXJ2ZWRDb250ZXh0cyA9PT0gdm9pZCAwID8gdm9pZCAwIDogcHJlc2VydmVkQ29udGV4dHMucHVzaCh1cGRhdGVkQ29udGV4dCk7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmVkQWN0aW9uc0Zyb21QdXJlO1xuICAgICAgICB9XG5cbiAgICAgIGNhc2Ugc3RvcCQxOlxuICAgICAgICB7XG4gICAgICAgICAgdmFyIHJlc29sdmVkID0gcmVzb2x2ZVN0b3AoYWN0aW9uT2JqZWN0LCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50KTtcbiAgICAgICAgICBwcmVkaWN0YWJsZUV4ZWMgPT09IG51bGwgfHwgcHJlZGljdGFibGVFeGVjID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwcmVkaWN0YWJsZUV4ZWMocmVzb2x2ZWQsIGN1cnJlbnRDb250ZXh0LCBfZXZlbnQpO1xuICAgICAgICAgIHJldHVybiByZXNvbHZlZDtcbiAgICAgICAgfVxuXG4gICAgICBjYXNlIGFzc2lnbiQxOlxuICAgICAgICB7XG4gICAgICAgICAgdXBkYXRlZENvbnRleHQgPSB1cGRhdGVDb250ZXh0KHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQsIFthY3Rpb25PYmplY3RdLCAhcHJlZGljdGFibGVFeGVjID8gY3VycmVudFN0YXRlIDogdW5kZWZpbmVkKTtcbiAgICAgICAgICBwcmVzZXJ2ZWRDb250ZXh0cyA9PT0gbnVsbCB8fCBwcmVzZXJ2ZWRDb250ZXh0cyA9PT0gdm9pZCAwID8gdm9pZCAwIDogcHJlc2VydmVkQ29udGV4dHMucHVzaCh1cGRhdGVkQ29udGV4dCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdmFyIHJlc29sdmVkQWN0aW9uT2JqZWN0ID0gdG9BY3Rpb25PYmplY3QoYWN0aW9uT2JqZWN0LCBtYWNoaW5lLm9wdGlvbnMuYWN0aW9ucyk7XG4gICAgICAgIHZhciBleGVjXzEgPSByZXNvbHZlZEFjdGlvbk9iamVjdC5leGVjO1xuXG4gICAgICAgIGlmIChwcmVkaWN0YWJsZUV4ZWMpIHtcbiAgICAgICAgICBwcmVkaWN0YWJsZUV4ZWMocmVzb2x2ZWRBY3Rpb25PYmplY3QsIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQpO1xuICAgICAgICB9IGVsc2UgaWYgKGV4ZWNfMSAmJiBwcmVzZXJ2ZWRDb250ZXh0cykge1xuICAgICAgICAgIHZhciBjb250ZXh0SW5kZXhfMSA9IHByZXNlcnZlZENvbnRleHRzLmxlbmd0aCAtIDE7XG5cbiAgICAgICAgICB2YXIgd3JhcHBlZCA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCByZXNvbHZlZEFjdGlvbk9iamVjdCksIHtcbiAgICAgICAgICAgIGV4ZWM6IGZ1bmN0aW9uIChfY3R4KSB7XG4gICAgICAgICAgICAgIHZhciBhcmdzID0gW107XG5cbiAgICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICBhcmdzW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgZXhlY18xLmFwcGx5KHZvaWQgMCwgX19zcHJlYWRBcnJheShbcHJlc2VydmVkQ29udGV4dHNbY29udGV4dEluZGV4XzFdXSwgX19yZWFkKGFyZ3MpLCBmYWxzZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmVzb2x2ZWRBY3Rpb25PYmplY3QgPSB3cmFwcGVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc29sdmVkQWN0aW9uT2JqZWN0O1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHByb2Nlc3NCbG9jayhibG9jaykge1xuICAgIHZhciBlXzIsIF9hO1xuXG4gICAgdmFyIHJlc29sdmVkQWN0aW9ucyA9IFtdO1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9iID0gX192YWx1ZXMoYmxvY2suYWN0aW9ucyksIF9jID0gX2IubmV4dCgpOyAhX2MuZG9uZTsgX2MgPSBfYi5uZXh0KCkpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IF9jLnZhbHVlO1xuICAgICAgICB2YXIgcmVzb2x2ZWQgPSBoYW5kbGVBY3Rpb24oYmxvY2sudHlwZSwgYWN0aW9uKTtcblxuICAgICAgICBpZiAocmVzb2x2ZWQpIHtcbiAgICAgICAgICByZXNvbHZlZEFjdGlvbnMgPSByZXNvbHZlZEFjdGlvbnMuY29uY2F0KHJlc29sdmVkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfMl8xKSB7XG4gICAgICBlXzIgPSB7XG4gICAgICAgIGVycm9yOiBlXzJfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKF9jICYmICFfYy5kb25lICYmIChfYSA9IF9iLnJldHVybikpIF9hLmNhbGwoX2IpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfMikgdGhyb3cgZV8yLmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIGRlZmVycmVkVG9CbG9ja0VuZC5mb3JFYWNoKGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgIHByZWRpY3RhYmxlRXhlYyhhY3Rpb24sIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQpO1xuICAgIH0pO1xuICAgIGRlZmVycmVkVG9CbG9ja0VuZC5sZW5ndGggPSAwO1xuICAgIHJldHVybiByZXNvbHZlZEFjdGlvbnM7XG4gIH1cblxuICB2YXIgcmVzb2x2ZWRBY3Rpb25zID0gZmxhdHRlbihhY3Rpb25CbG9ja3MubWFwKHByb2Nlc3NCbG9jaykpO1xuICByZXR1cm4gW3Jlc29sdmVkQWN0aW9ucywgdXBkYXRlZENvbnRleHRdO1xufVxuXG5leHBvcnQgeyBhZnRlciwgYXNzaWduLCBjYW5jZWwsIGNob29zZSwgZG9uZSwgZG9uZUludm9rZSwgZXJyb3IsIGVzY2FsYXRlLCBmb3J3YXJkVG8sIGdldEFjdGlvbkZ1bmN0aW9uLCBpbml0RXZlbnQsIGlzQWN0aW9uT2JqZWN0LCBsb2csIHB1cmUsIHJhaXNlLCByZXNvbHZlQWN0aW9ucywgcmVzb2x2ZUxvZywgcmVzb2x2ZVJhaXNlLCByZXNvbHZlU2VuZCwgcmVzb2x2ZVN0b3AsIHJlc3BvbmQsIHNlbmQsIHNlbmRQYXJlbnQsIHNlbmRUbywgc2VuZFVwZGF0ZSwgc3RhcnQsIHN0b3AsIHRvQWN0aW9uT2JqZWN0LCB0b0FjdGlvbk9iamVjdHMsIHRvQWN0aXZpdHlEZWZpbml0aW9uIH07XG4iLCJpbXBvcnQgeyBlcnJvciwgZG9uZUludm9rZSB9IGZyb20gJy4vYWN0aW9ucy5qcyc7XG5pbXBvcnQgeyB0b0FjdG9yUmVmIH0gZnJvbSAnLi9BY3Rvci5qcyc7XG5pbXBvcnQgeyB0b09ic2VydmVyIH0gZnJvbSAnLi91dGlscy5qcyc7XG5cbi8qKlxyXG4gKiBSZXR1cm5zIGFuIGFjdG9yIGJlaGF2aW9yIGZyb20gYSByZWR1Y2VyIGFuZCBpdHMgaW5pdGlhbCBzdGF0ZS5cclxuICpcclxuICogQHBhcmFtIHRyYW5zaXRpb24gVGhlIHB1cmUgcmVkdWNlciB0aGF0IHJldHVybnMgdGhlIG5leHQgc3RhdGUgZ2l2ZW4gdGhlIGN1cnJlbnQgc3RhdGUgYW5kIGV2ZW50LlxyXG4gKiBAcGFyYW0gaW5pdGlhbFN0YXRlIFRoZSBpbml0aWFsIHN0YXRlIG9mIHRoZSByZWR1Y2VyLlxyXG4gKiBAcmV0dXJucyBBbiBhY3RvciBiZWhhdmlvclxyXG4gKi9cblxuZnVuY3Rpb24gZnJvbVJlZHVjZXIodHJhbnNpdGlvbiwgaW5pdGlhbFN0YXRlKSB7XG4gIHJldHVybiB7XG4gICAgdHJhbnNpdGlvbjogdHJhbnNpdGlvbixcbiAgICBpbml0aWFsU3RhdGU6IGluaXRpYWxTdGF0ZVxuICB9O1xufVxuZnVuY3Rpb24gZnJvbVByb21pc2UocHJvbWlzZUZuKSB7XG4gIHZhciBpbml0aWFsU3RhdGUgPSB7XG4gICAgZXJyb3I6IHVuZGVmaW5lZCxcbiAgICBkYXRhOiB1bmRlZmluZWQsXG4gICAgc3RhdHVzOiAncGVuZGluZydcbiAgfTtcbiAgcmV0dXJuIHtcbiAgICB0cmFuc2l0aW9uOiBmdW5jdGlvbiAoc3RhdGUsIGV2ZW50LCBfYSkge1xuICAgICAgdmFyIHBhcmVudCA9IF9hLnBhcmVudCxcbiAgICAgICAgICBpZCA9IF9hLmlkLFxuICAgICAgICAgIG9ic2VydmVycyA9IF9hLm9ic2VydmVycztcblxuICAgICAgc3dpdGNoIChldmVudC50eXBlKSB7XG4gICAgICAgIGNhc2UgJ2Z1bGZpbGwnOlxuICAgICAgICAgIHBhcmVudCA9PT0gbnVsbCB8fCBwYXJlbnQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHBhcmVudC5zZW5kKGRvbmVJbnZva2UoaWQsIGV2ZW50LmRhdGEpKTtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZXJyb3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGRhdGE6IGV2ZW50LmRhdGEsXG4gICAgICAgICAgICBzdGF0dXM6ICdmdWxmaWxsZWQnXG4gICAgICAgICAgfTtcblxuICAgICAgICBjYXNlICdyZWplY3QnOlxuICAgICAgICAgIHBhcmVudCA9PT0gbnVsbCB8fCBwYXJlbnQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHBhcmVudC5zZW5kKGVycm9yKGlkLCBldmVudC5lcnJvcikpO1xuICAgICAgICAgIG9ic2VydmVycy5mb3JFYWNoKGZ1bmN0aW9uIChvYnNlcnZlcikge1xuICAgICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IoZXZlbnQuZXJyb3IpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlcnJvcjogZXZlbnQuZXJyb3IsXG4gICAgICAgICAgICBkYXRhOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBzdGF0dXM6ICdyZWplY3RlZCdcbiAgICAgICAgICB9O1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgfVxuICAgIH0sXG4gICAgaW5pdGlhbFN0YXRlOiBpbml0aWFsU3RhdGUsXG4gICAgc3RhcnQ6IGZ1bmN0aW9uIChfYSkge1xuICAgICAgdmFyIHNlbGYgPSBfYS5zZWxmO1xuICAgICAgcHJvbWlzZUZuKCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBzZWxmLnNlbmQoe1xuICAgICAgICAgIHR5cGU6ICdmdWxmaWxsJyxcbiAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgIH0pO1xuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICBzZWxmLnNlbmQoe1xuICAgICAgICAgIHR5cGU6ICdyZWplY3QnLFxuICAgICAgICAgIGVycm9yOiByZWFzb25cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBpbml0aWFsU3RhdGU7XG4gICAgfVxuICB9O1xufVxuZnVuY3Rpb24gc3Bhd25CZWhhdmlvcihiZWhhdmlvciwgb3B0aW9ucykge1xuICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgdmFyIHN0YXRlID0gYmVoYXZpb3IuaW5pdGlhbFN0YXRlO1xuICB2YXIgb2JzZXJ2ZXJzID0gbmV3IFNldCgpO1xuICB2YXIgbWFpbGJveCA9IFtdO1xuICB2YXIgZmx1c2hpbmcgPSBmYWxzZTtcblxuICB2YXIgZmx1c2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGZsdXNoaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZmx1c2hpbmcgPSB0cnVlO1xuXG4gICAgd2hpbGUgKG1haWxib3gubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIGV2ZW50XzEgPSBtYWlsYm94LnNoaWZ0KCk7XG4gICAgICBzdGF0ZSA9IGJlaGF2aW9yLnRyYW5zaXRpb24oc3RhdGUsIGV2ZW50XzEsIGFjdG9yQ3R4KTtcbiAgICAgIG9ic2VydmVycy5mb3JFYWNoKGZ1bmN0aW9uIChvYnNlcnZlcikge1xuICAgICAgICByZXR1cm4gb2JzZXJ2ZXIubmV4dChzdGF0ZSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmbHVzaGluZyA9IGZhbHNlO1xuICB9O1xuXG4gIHZhciBhY3RvciA9IHRvQWN0b3JSZWYoe1xuICAgIGlkOiBvcHRpb25zLmlkLFxuICAgIHNlbmQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbWFpbGJveC5wdXNoKGV2ZW50KTtcbiAgICAgIGZsdXNoKCk7XG4gICAgfSxcbiAgICBnZXRTbmFwc2hvdDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH0sXG4gICAgc3Vic2NyaWJlOiBmdW5jdGlvbiAobmV4dCwgaGFuZGxlRXJyb3IsIGNvbXBsZXRlKSB7XG4gICAgICB2YXIgb2JzZXJ2ZXIgPSB0b09ic2VydmVyKG5leHQsIGhhbmRsZUVycm9yLCBjb21wbGV0ZSk7XG4gICAgICBvYnNlcnZlcnMuYWRkKG9ic2VydmVyKTtcbiAgICAgIG9ic2VydmVyLm5leHQoc3RhdGUpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBvYnNlcnZlcnMuZGVsZXRlKG9ic2VydmVyKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH0pO1xuICB2YXIgYWN0b3JDdHggPSB7XG4gICAgcGFyZW50OiBvcHRpb25zLnBhcmVudCxcbiAgICBzZWxmOiBhY3RvcixcbiAgICBpZDogb3B0aW9ucy5pZCB8fCAnYW5vbnltb3VzJyxcbiAgICBvYnNlcnZlcnM6IG9ic2VydmVyc1xuICB9O1xuICBzdGF0ZSA9IGJlaGF2aW9yLnN0YXJ0ID8gYmVoYXZpb3Iuc3RhcnQoYWN0b3JDdHgpIDogc3RhdGU7XG4gIHJldHVybiBhY3Rvcjtcbn1cblxuZXhwb3J0IHsgZnJvbVByb21pc2UsIGZyb21SZWR1Y2VyLCBzcGF3bkJlaGF2aW9yIH07XG4iLCJ2YXIgU1RBVEVfREVMSU1JVEVSID0gJy4nO1xudmFyIEVNUFRZX0FDVElWSVRZX01BUCA9IHt9O1xudmFyIERFRkFVTFRfR1VBUkRfVFlQRSA9ICd4c3RhdGUuZ3VhcmQnO1xudmFyIFRBUkdFVExFU1NfS0VZID0gJyc7XG5cbmV4cG9ydCB7IERFRkFVTFRfR1VBUkRfVFlQRSwgRU1QVFlfQUNUSVZJVFlfTUFQLCBTVEFURV9ERUxJTUlURVIsIFRBUkdFVExFU1NfS0VZIH07XG4iLCJpbXBvcnQgeyBJU19QUk9EVUNUSU9OIH0gZnJvbSAnLi9lbnZpcm9ubWVudC5qcyc7XG5cbmZ1bmN0aW9uIGdldEdsb2JhbCgpIHtcbiAgaWYgKHR5cGVvZiBnbG9iYWxUaGlzICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBnbG9iYWxUaGlzO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBzZWxmO1xuICB9XG5cbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIHdpbmRvdztcbiAgfVxuXG4gIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBnbG9iYWw7XG4gIH1cblxuICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICBjb25zb2xlLndhcm4oJ1hTdGF0ZSBjb3VsZCBub3QgZmluZCBhIGdsb2JhbCBvYmplY3QgaW4gdGhpcyBlbnZpcm9ubWVudC4gUGxlYXNlIGxldCB0aGUgbWFpbnRhaW5lcnMga25vdyBhbmQgcmFpc2UgYW4gaXNzdWUgaGVyZTogaHR0cHM6Ly9naXRodWIuY29tL3N0YXRlbHlhaS94c3RhdGUvaXNzdWVzJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0RGV2VG9vbHMoKSB7XG4gIHZhciBnbG9iYWwgPSBnZXRHbG9iYWwoKTtcblxuICBpZiAoZ2xvYmFsICYmICdfX3hzdGF0ZV9fJyBpbiBnbG9iYWwpIHtcbiAgICByZXR1cm4gZ2xvYmFsLl9feHN0YXRlX187XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiByZWdpc3RlclNlcnZpY2Uoc2VydmljZSkge1xuICBpZiAoIWdldEdsb2JhbCgpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGRldlRvb2xzID0gZ2V0RGV2VG9vbHMoKTtcblxuICBpZiAoZGV2VG9vbHMpIHtcbiAgICBkZXZUb29scy5yZWdpc3RlcihzZXJ2aWNlKTtcbiAgfVxufVxuXG5leHBvcnQgeyBnZXRHbG9iYWwsIHJlZ2lzdGVyU2VydmljZSB9O1xuIiwidmFyIElTX1BST0RVQ1RJT04gPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nO1xuXG5leHBvcnQgeyBJU19QUk9EVUNUSU9OIH07XG4iLCJpbXBvcnQgeyBfX3ZhbHVlcywgX19zcHJlYWRBcnJheSwgX19yZWFkLCBfX2Fzc2lnbiB9IGZyb20gJy4vX3ZpcnR1YWwvX3RzbGliLmpzJztcbmltcG9ydCB7IFNwZWNpYWxUYXJnZXRzLCBBY3Rpb25UeXBlcyB9IGZyb20gJy4vdHlwZXMuanMnO1xuaW1wb3J0IHsgaXNTdGF0ZUNvbmZpZywgU3RhdGUsIGJpbmRBY3Rpb25Ub1N0YXRlIH0gZnJvbSAnLi9TdGF0ZS5qcyc7XG5pbXBvcnQgeyBlcnJvclBsYXRmb3JtLCB1cGRhdGUsIGVycm9yIGFzIGVycm9yJDEsIGxvZywgc3RvcCwgc3RhcnQsIGNhbmNlbCwgc2VuZCwgcmFpc2UgfSBmcm9tICcuL2FjdGlvblR5cGVzLmpzJztcbmltcG9ydCB7IGluaXRFdmVudCwgZG9uZUludm9rZSwgdG9BY3Rpb25PYmplY3RzLCByZXNvbHZlQWN0aW9ucywgZXJyb3IsIGdldEFjdGlvbkZ1bmN0aW9uIH0gZnJvbSAnLi9hY3Rpb25zLmpzJztcbmltcG9ydCB7IElTX1BST0RVQ1RJT04gfSBmcm9tICcuL2Vudmlyb25tZW50LmpzJztcbmltcG9ydCB7IHdhcm4sIG1hcENvbnRleHQsIHRvT2JzZXJ2ZXIsIGlzRnVuY3Rpb24sIHRvU0NYTUxFdmVudCwgZmxhdHRlbiwgaXNSYWlzYWJsZUFjdGlvbiwgaXNQcm9taXNlTGlrZSwgaXNPYnNlcnZhYmxlLCBpc01hY2hpbmUsIGlzQmVoYXZpb3IsIHJlcG9ydFVuaGFuZGxlZEV4Y2VwdGlvbk9uSW52b2NhdGlvbiwgc3ltYm9sT2JzZXJ2YWJsZSwgaXNBcnJheSwgdG9FdmVudE9iamVjdCwgaXNTdHJpbmcsIGlzQWN0b3IsIHRvSW52b2tlU291cmNlLCB1bmlxdWVJZCB9IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHsgU2NoZWR1bGVyIH0gZnJvbSAnLi9zY2hlZHVsZXIuanMnO1xuaW1wb3J0IHsgY3JlYXRlRGVmZXJyZWRBY3RvciwgaXNTcGF3bmVkQWN0b3IgfSBmcm9tICcuL0FjdG9yLmpzJztcbmltcG9ydCB7IHJlZ2lzdHJ5IH0gZnJvbSAnLi9yZWdpc3RyeS5qcyc7XG5pbXBvcnQgeyBnZXRHbG9iYWwsIHJlZ2lzdGVyU2VydmljZSB9IGZyb20gJy4vZGV2VG9vbHMuanMnO1xuaW1wb3J0IHsgcHJvdmlkZSwgY29uc3VtZSB9IGZyb20gJy4vc2VydmljZVNjb3BlLmpzJztcbmltcG9ydCB7IHNwYXduQmVoYXZpb3IgfSBmcm9tICcuL2JlaGF2aW9ycy5qcyc7XG5cbnZhciBERUZBVUxUX1NQQVdOX09QVElPTlMgPSB7XG4gIHN5bmM6IGZhbHNlLFxuICBhdXRvRm9yd2FyZDogZmFsc2Vcbn07XG52YXIgSW50ZXJwcmV0ZXJTdGF0dXM7XG5cbihmdW5jdGlvbiAoSW50ZXJwcmV0ZXJTdGF0dXMpIHtcbiAgSW50ZXJwcmV0ZXJTdGF0dXNbSW50ZXJwcmV0ZXJTdGF0dXNbXCJOb3RTdGFydGVkXCJdID0gMF0gPSBcIk5vdFN0YXJ0ZWRcIjtcbiAgSW50ZXJwcmV0ZXJTdGF0dXNbSW50ZXJwcmV0ZXJTdGF0dXNbXCJSdW5uaW5nXCJdID0gMV0gPSBcIlJ1bm5pbmdcIjtcbiAgSW50ZXJwcmV0ZXJTdGF0dXNbSW50ZXJwcmV0ZXJTdGF0dXNbXCJTdG9wcGVkXCJdID0gMl0gPSBcIlN0b3BwZWRcIjtcbn0pKEludGVycHJldGVyU3RhdHVzIHx8IChJbnRlcnByZXRlclN0YXR1cyA9IHt9KSk7XG5cbnZhciBJbnRlcnByZXRlciA9XG4vKiNfX1BVUkVfXyovXG5cbi8qKiBAY2xhc3MgKi9cbmZ1bmN0aW9uICgpIHtcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhIG5ldyBJbnRlcnByZXRlciBpbnN0YW5jZSAoaS5lLiwgc2VydmljZSkgZm9yIHRoZSBnaXZlbiBtYWNoaW5lIHdpdGggdGhlIHByb3ZpZGVkIG9wdGlvbnMsIGlmIGFueS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBtYWNoaW5lIFRoZSBtYWNoaW5lIHRvIGJlIGludGVycHJldGVkXHJcbiAgICogQHBhcmFtIG9wdGlvbnMgSW50ZXJwcmV0ZXIgb3B0aW9uc1xyXG4gICAqL1xuICBmdW5jdGlvbiBJbnRlcnByZXRlcihtYWNoaW5lLCBvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgICAgb3B0aW9ucyA9IEludGVycHJldGVyLmRlZmF1bHRPcHRpb25zO1xuICAgIH1cblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB0aGlzLm1hY2hpbmUgPSBtYWNoaW5lO1xuICAgIHRoaXMuZGVsYXllZEV2ZW50c01hcCA9IHt9O1xuICAgIHRoaXMubGlzdGVuZXJzID0gbmV3IFNldCgpO1xuICAgIHRoaXMuY29udGV4dExpc3RlbmVycyA9IG5ldyBTZXQoKTtcbiAgICB0aGlzLnN0b3BMaXN0ZW5lcnMgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5kb25lTGlzdGVuZXJzID0gbmV3IFNldCgpO1xuICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnMgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5zZW5kTGlzdGVuZXJzID0gbmV3IFNldCgpO1xuICAgIC8qKlxyXG4gICAgICogV2hldGhlciB0aGUgc2VydmljZSBpcyBzdGFydGVkLlxyXG4gICAgICovXG5cbiAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgdGhpcy5zdGF0dXMgPSBJbnRlcnByZXRlclN0YXR1cy5Ob3RTdGFydGVkO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5mb3J3YXJkVG8gPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5fb3V0Z29pbmdRdWV1ZSA9IFtdO1xuICAgIC8qKlxyXG4gICAgICogQWxpYXMgZm9yIEludGVycHJldGVyLnByb3RvdHlwZS5zdGFydFxyXG4gICAgICovXG5cbiAgICB0aGlzLmluaXQgPSB0aGlzLnN0YXJ0O1xuICAgIC8qKlxyXG4gICAgICogU2VuZHMgYW4gZXZlbnQgdG8gdGhlIHJ1bm5pbmcgaW50ZXJwcmV0ZXIgdG8gdHJpZ2dlciBhIHRyYW5zaXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQW4gYXJyYXkgb2YgZXZlbnRzIChiYXRjaGVkKSBjYW4gYmUgc2VudCBhcyB3ZWxsLCB3aGljaCB3aWxsIHNlbmQgYWxsXHJcbiAgICAgKiBiYXRjaGVkIGV2ZW50cyB0byB0aGUgcnVubmluZyBpbnRlcnByZXRlci4gVGhlIGxpc3RlbmVycyB3aWxsIGJlXHJcbiAgICAgKiBub3RpZmllZCBvbmx5ICoqb25jZSoqIHdoZW4gYWxsIGV2ZW50cyBhcmUgcHJvY2Vzc2VkLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQocykgdG8gc2VuZFxyXG4gICAgICovXG5cbiAgICB0aGlzLnNlbmQgPSBmdW5jdGlvbiAoZXZlbnQsIHBheWxvYWQpIHtcbiAgICAgIGlmIChpc0FycmF5KGV2ZW50KSkge1xuICAgICAgICBfdGhpcy5iYXRjaChldmVudCk7XG5cbiAgICAgICAgcmV0dXJuIF90aGlzLnN0YXRlO1xuICAgICAgfVxuXG4gICAgICB2YXIgX2V2ZW50ID0gdG9TQ1hNTEV2ZW50KHRvRXZlbnRPYmplY3QoZXZlbnQsIHBheWxvYWQpKTtcblxuICAgICAgaWYgKF90aGlzLnN0YXR1cyA9PT0gSW50ZXJwcmV0ZXJTdGF0dXMuU3RvcHBlZCkge1xuICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgICAgIHdhcm4oZmFsc2UsIFwiRXZlbnQgXFxcIlwiLmNvbmNhdChfZXZlbnQubmFtZSwgXCJcXFwiIHdhcyBzZW50IHRvIHN0b3BwZWQgc2VydmljZSBcXFwiXCIpLmNvbmNhdChfdGhpcy5tYWNoaW5lLmlkLCBcIlxcXCIuIFRoaXMgc2VydmljZSBoYXMgYWxyZWFkeSByZWFjaGVkIGl0cyBmaW5hbCBzdGF0ZSwgYW5kIHdpbGwgbm90IHRyYW5zaXRpb24uXFxuRXZlbnQ6IFwiKS5jb25jYXQoSlNPTi5zdHJpbmdpZnkoX2V2ZW50LmRhdGEpKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gX3RoaXMuc3RhdGU7XG4gICAgICB9XG5cbiAgICAgIGlmIChfdGhpcy5zdGF0dXMgIT09IEludGVycHJldGVyU3RhdHVzLlJ1bm5pbmcgJiYgIV90aGlzLm9wdGlvbnMuZGVmZXJFdmVudHMpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXZlbnQgXFxcIlwiLmNvbmNhdChfZXZlbnQubmFtZSwgXCJcXFwiIHdhcyBzZW50IHRvIHVuaW5pdGlhbGl6ZWQgc2VydmljZSBcXFwiXCIpLmNvbmNhdChfdGhpcy5tYWNoaW5lLmlkIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICAgICAgLCBcIlxcXCIuIE1ha2Ugc3VyZSAuc3RhcnQoKSBpcyBjYWxsZWQgZm9yIHRoaXMgc2VydmljZSwgb3Igc2V0IHsgZGVmZXJFdmVudHM6IHRydWUgfSBpbiB0aGUgc2VydmljZSBvcHRpb25zLlxcbkV2ZW50OiBcIikuY29uY2F0KEpTT04uc3RyaW5naWZ5KF9ldmVudC5kYXRhKSkpO1xuICAgICAgfVxuXG4gICAgICBfdGhpcy5zY2hlZHVsZXIuc2NoZWR1bGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBGb3J3YXJkIGNvcHkgb2YgZXZlbnQgdG8gY2hpbGQgYWN0b3JzXG4gICAgICAgIF90aGlzLmZvcndhcmQoX2V2ZW50KTtcblxuICAgICAgICB2YXIgbmV4dFN0YXRlID0gX3RoaXMuX25leHRTdGF0ZShfZXZlbnQpO1xuXG4gICAgICAgIF90aGlzLnVwZGF0ZShuZXh0U3RhdGUsIF9ldmVudCk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIF90aGlzLl9zdGF0ZTsgLy8gVE9ETzogZGVwcmVjYXRlIChzaG91bGQgcmV0dXJuIHZvaWQpXG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6c2VtaWNvbG9uXG4gICAgfTtcblxuICAgIHRoaXMuc2VuZFRvID0gZnVuY3Rpb24gKGV2ZW50LCB0bywgaW1tZWRpYXRlKSB7XG4gICAgICB2YXIgaXNQYXJlbnQgPSBfdGhpcy5wYXJlbnQgJiYgKHRvID09PSBTcGVjaWFsVGFyZ2V0cy5QYXJlbnQgfHwgX3RoaXMucGFyZW50LmlkID09PSB0byk7XG4gICAgICB2YXIgdGFyZ2V0ID0gaXNQYXJlbnQgPyBfdGhpcy5wYXJlbnQgOiBpc1N0cmluZyh0bykgPyB0byA9PT0gU3BlY2lhbFRhcmdldHMuSW50ZXJuYWwgPyBfdGhpcyA6IF90aGlzLmNoaWxkcmVuLmdldCh0bykgfHwgcmVnaXN0cnkuZ2V0KHRvKSA6IGlzQWN0b3IodG8pID8gdG8gOiB1bmRlZmluZWQ7XG5cbiAgICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICAgIGlmICghaXNQYXJlbnQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmFibGUgdG8gc2VuZCBldmVudCB0byBjaGlsZCAnXCIuY29uY2F0KHRvLCBcIicgZnJvbSBzZXJ2aWNlICdcIikuY29uY2F0KF90aGlzLmlkLCBcIicuXCIpKTtcbiAgICAgICAgfSAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tY29uc29sZVxuXG5cbiAgICAgICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICAgICAgd2FybihmYWxzZSwgXCJTZXJ2aWNlICdcIi5jb25jYXQoX3RoaXMuaWQsIFwiJyBoYXMgbm8gcGFyZW50OiB1bmFibGUgdG8gc2VuZCBldmVudCBcIikuY29uY2F0KGV2ZW50LnR5cGUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCdtYWNoaW5lJyBpbiB0YXJnZXQpIHtcbiAgICAgICAgLy8gcGVyaGFwcyB0aG9zZSBldmVudHMgc2hvdWxkIGJlIHJlamVjdGVkIGluIHRoZSBwYXJlbnRcbiAgICAgICAgLy8gYnV0IGF0bSBpdCBkb2Vzbid0IGhhdmUgZWFzeSBhY2Nlc3MgdG8gYWxsIG9mIHRoZSBpbmZvcm1hdGlvbiB0aGF0IGlzIHJlcXVpcmVkIHRvIGRvIGl0IHJlbGlhYmx5XG4gICAgICAgIGlmIChfdGhpcy5zdGF0dXMgIT09IEludGVycHJldGVyU3RhdHVzLlN0b3BwZWQgfHwgX3RoaXMucGFyZW50ICE9PSB0YXJnZXQgfHwgLy8gd2UgbmVlZCB0byBzZW5kIGV2ZW50cyB0byB0aGUgcGFyZW50IGZyb20gZXhpdCBoYW5kbGVycyBvZiBhIG1hY2hpbmUgdGhhdCByZWFjaGVkIGl0cyBmaW5hbCBzdGF0ZVxuICAgICAgICBfdGhpcy5zdGF0ZS5kb25lKSB7XG4gICAgICAgICAgLy8gU2VuZCBTQ1hNTCBldmVudHMgdG8gbWFjaGluZXNcbiAgICAgICAgICB2YXIgc2N4bWxFdmVudCA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCBldmVudCksIHtcbiAgICAgICAgICAgIG5hbWU6IGV2ZW50Lm5hbWUgPT09IGVycm9yJDEgPyBcIlwiLmNvbmNhdChlcnJvcihfdGhpcy5pZCkpIDogZXZlbnQubmFtZSxcbiAgICAgICAgICAgIG9yaWdpbjogX3RoaXMuc2Vzc2lvbklkXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpZiAoIWltbWVkaWF0ZSAmJiBfdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cykge1xuICAgICAgICAgICAgX3RoaXMuX291dGdvaW5nUXVldWUucHVzaChbdGFyZ2V0LCBzY3htbEV2ZW50XSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhcmdldC5zZW5kKHNjeG1sRXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gU2VuZCBub3JtYWwgZXZlbnRzIHRvIG90aGVyIHRhcmdldHNcbiAgICAgICAgaWYgKCFpbW1lZGlhdGUgJiYgX3RoaXMubWFjaGluZS5jb25maWcucHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHMpIHtcbiAgICAgICAgICBfdGhpcy5fb3V0Z29pbmdRdWV1ZS5wdXNoKFt0YXJnZXQsIGV2ZW50LmRhdGFdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0YXJnZXQuc2VuZChldmVudC5kYXRhKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLl9leGVjID0gZnVuY3Rpb24gKGFjdGlvbiwgY29udGV4dCwgX2V2ZW50LCBhY3Rpb25GdW5jdGlvbk1hcCkge1xuICAgICAgaWYgKGFjdGlvbkZ1bmN0aW9uTWFwID09PSB2b2lkIDApIHtcbiAgICAgICAgYWN0aW9uRnVuY3Rpb25NYXAgPSBfdGhpcy5tYWNoaW5lLm9wdGlvbnMuYWN0aW9ucztcbiAgICAgIH1cblxuICAgICAgdmFyIGFjdGlvbk9yRXhlYyA9IGFjdGlvbi5leGVjIHx8IGdldEFjdGlvbkZ1bmN0aW9uKGFjdGlvbi50eXBlLCBhY3Rpb25GdW5jdGlvbk1hcCk7XG4gICAgICB2YXIgZXhlYyA9IGlzRnVuY3Rpb24oYWN0aW9uT3JFeGVjKSA/IGFjdGlvbk9yRXhlYyA6IGFjdGlvbk9yRXhlYyA/IGFjdGlvbk9yRXhlYy5leGVjIDogYWN0aW9uLmV4ZWM7XG5cbiAgICAgIGlmIChleGVjKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIGV4ZWMoY29udGV4dCwgX2V2ZW50LmRhdGEsICFfdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cyA/IHtcbiAgICAgICAgICAgIGFjdGlvbjogYWN0aW9uLFxuICAgICAgICAgICAgc3RhdGU6IF90aGlzLnN0YXRlLFxuICAgICAgICAgICAgX2V2ZW50OiBfZXZlbnRcbiAgICAgICAgICB9IDoge1xuICAgICAgICAgICAgYWN0aW9uOiBhY3Rpb24sXG4gICAgICAgICAgICBfZXZlbnQ6IF9ldmVudFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBpZiAoX3RoaXMucGFyZW50KSB7XG4gICAgICAgICAgICBfdGhpcy5wYXJlbnQuc2VuZCh7XG4gICAgICAgICAgICAgIHR5cGU6ICd4c3RhdGUuZXJyb3InLFxuICAgICAgICAgICAgICBkYXRhOiBlcnJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgICAgIGNhc2UgcmFpc2U6XG4gICAgICAgICAge1xuICAgICAgICAgICAgLy8gaWYgcmFpc2UgYWN0aW9uIHJlYWNoZWQgdGhlIGludGVycHJldGVyIHRoZW4gaXQncyBhIGRlbGF5ZWQgb25lXG4gICAgICAgICAgICB2YXIgc2VuZEFjdGlvbl8xID0gYWN0aW9uO1xuXG4gICAgICAgICAgICBfdGhpcy5kZWZlcihzZW5kQWN0aW9uXzEpO1xuXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBzZW5kOlxuICAgICAgICAgIHZhciBzZW5kQWN0aW9uID0gYWN0aW9uO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiBzZW5kQWN0aW9uLmRlbGF5ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgX3RoaXMuZGVmZXIoc2VuZEFjdGlvbik7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHNlbmRBY3Rpb24udG8pIHtcbiAgICAgICAgICAgICAgX3RoaXMuc2VuZFRvKHNlbmRBY3Rpb24uX2V2ZW50LCBzZW5kQWN0aW9uLnRvLCBfZXZlbnQgPT09IGluaXRFdmVudCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfdGhpcy5zZW5kKHNlbmRBY3Rpb24uX2V2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIGNhbmNlbDpcbiAgICAgICAgICBfdGhpcy5jYW5jZWwoYWN0aW9uLnNlbmRJZCk7XG5cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIHN0YXJ0OlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5zdGF0dXMgIT09IEludGVycHJldGVyU3RhdHVzLlJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYWN0aXZpdHkgPSBhY3Rpb24uYWN0aXZpdHk7IC8vIElmIHRoZSBhY3Rpdml0eSB3aWxsIGJlIHN0b3BwZWQgcmlnaHQgYWZ0ZXIgaXQncyBzdGFydGVkXG4gICAgICAgICAgICAvLyAoc3VjaCBhcyBpbiB0cmFuc2llbnQgc3RhdGVzKVxuICAgICAgICAgICAgLy8gZG9uJ3QgYm90aGVyIHN0YXJ0aW5nIHRoZSBhY3Rpdml0eS5cblxuICAgICAgICAgICAgaWYgKCAvLyBpbiB2NCB3aXRoIGBwcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50c2AgaW52b2tlcyBhcmUgY2FsbGVkIGVhZ2VybHkgd2hlbiB0aGUgYHRoaXMuc3RhdGVgIHN0aWxsIHBvaW50cyB0byB0aGUgcHJldmlvdXMgc3RhdGVcbiAgICAgICAgICAgICFfdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cyAmJiAhX3RoaXMuc3RhdGUuYWN0aXZpdGllc1thY3Rpdml0eS5pZCB8fCBhY3Rpdml0eS50eXBlXSkge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gLy8gSW52b2tlZCBzZXJ2aWNlc1xuXG5cbiAgICAgICAgICAgIGlmIChhY3Rpdml0eS50eXBlID09PSBBY3Rpb25UeXBlcy5JbnZva2UpIHtcbiAgICAgICAgICAgICAgdmFyIGludm9rZVNvdXJjZSA9IHRvSW52b2tlU291cmNlKGFjdGl2aXR5LnNyYyk7XG4gICAgICAgICAgICAgIHZhciBzZXJ2aWNlQ3JlYXRvciA9IF90aGlzLm1hY2hpbmUub3B0aW9ucy5zZXJ2aWNlcyA/IF90aGlzLm1hY2hpbmUub3B0aW9ucy5zZXJ2aWNlc1tpbnZva2VTb3VyY2UudHlwZV0gOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgIHZhciBpZCA9IGFjdGl2aXR5LmlkLFxuICAgICAgICAgICAgICAgICAgZGF0YSA9IGFjdGl2aXR5LmRhdGE7XG5cbiAgICAgICAgICAgICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICAgICAgICAgICAgd2FybighKCdmb3J3YXJkJyBpbiBhY3Rpdml0eSksIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICAgICAgICAgICAgICBcImBmb3J3YXJkYCBwcm9wZXJ0eSBpcyBkZXByZWNhdGVkIChmb3VuZCBpbiBpbnZvY2F0aW9uIG9mICdcIi5jb25jYXQoYWN0aXZpdHkuc3JjLCBcIicgaW4gaW4gbWFjaGluZSAnXCIpLmNvbmNhdChfdGhpcy5tYWNoaW5lLmlkLCBcIicpLiBcIikgKyBcIlBsZWFzZSB1c2UgYGF1dG9Gb3J3YXJkYCBpbnN0ZWFkLlwiKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHZhciBhdXRvRm9yd2FyZCA9ICdhdXRvRm9yd2FyZCcgaW4gYWN0aXZpdHkgPyBhY3Rpdml0eS5hdXRvRm9yd2FyZCA6ICEhYWN0aXZpdHkuZm9yd2FyZDtcblxuICAgICAgICAgICAgICBpZiAoIXNlcnZpY2VDcmVhdG9yKSB7XG4gICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbnNvbGVcbiAgICAgICAgICAgICAgICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICAgICAgICAgICAgICAgIHdhcm4oZmFsc2UsIFwiTm8gc2VydmljZSBmb3VuZCBmb3IgaW52b2NhdGlvbiAnXCIuY29uY2F0KGFjdGl2aXR5LnNyYywgXCInIGluIG1hY2hpbmUgJ1wiKS5jb25jYXQoX3RoaXMubWFjaGluZS5pZCwgXCInLlwiKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdmFyIHJlc29sdmVkRGF0YSA9IGRhdGEgPyBtYXBDb250ZXh0KGRhdGEsIGNvbnRleHQsIF9ldmVudCkgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzZXJ2aWNlQ3JlYXRvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiB3YXJuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGlzRnVuY3Rpb24oc2VydmljZUNyZWF0b3IpID8gc2VydmljZUNyZWF0b3IoY29udGV4dCwgX2V2ZW50LmRhdGEsIHtcbiAgICAgICAgICAgICAgICBkYXRhOiByZXNvbHZlZERhdGEsXG4gICAgICAgICAgICAgICAgc3JjOiBpbnZva2VTb3VyY2UsXG4gICAgICAgICAgICAgICAgbWV0YTogYWN0aXZpdHkubWV0YVxuICAgICAgICAgICAgICB9KSA6IHNlcnZpY2VDcmVhdG9yO1xuXG4gICAgICAgICAgICAgIGlmICghc291cmNlKSB7XG4gICAgICAgICAgICAgICAgLy8gVE9ETzogd2Fybj9cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHZvaWQgMDtcblxuICAgICAgICAgICAgICBpZiAoaXNNYWNoaW5lKHNvdXJjZSkpIHtcbiAgICAgICAgICAgICAgICBzb3VyY2UgPSByZXNvbHZlZERhdGEgPyBzb3VyY2Uud2l0aENvbnRleHQocmVzb2x2ZWREYXRhKSA6IHNvdXJjZTtcbiAgICAgICAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgYXV0b0ZvcndhcmQ6IGF1dG9Gb3J3YXJkXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIF90aGlzLnNwYXduKHNvdXJjZSwgaWQsIG9wdGlvbnMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgX3RoaXMuc3Bhd25BY3Rpdml0eShhY3Rpdml0eSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICBjYXNlIHN0b3A6XG4gICAgICAgICAge1xuICAgICAgICAgICAgX3RoaXMuc3RvcENoaWxkKGFjdGlvbi5hY3Rpdml0eS5pZCk7XG5cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICBjYXNlIGxvZzpcbiAgICAgICAgICB2YXIgX2EgPSBhY3Rpb24sXG4gICAgICAgICAgICAgIGxhYmVsID0gX2EubGFiZWwsXG4gICAgICAgICAgICAgIHZhbHVlID0gX2EudmFsdWU7XG5cbiAgICAgICAgICBpZiAobGFiZWwpIHtcbiAgICAgICAgICAgIF90aGlzLmxvZ2dlcihsYWJlbCwgdmFsdWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfdGhpcy5sb2dnZXIodmFsdWUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICAgICAgICB3YXJuKGZhbHNlLCBcIk5vIGltcGxlbWVudGF0aW9uIGZvdW5kIGZvciBhY3Rpb24gdHlwZSAnXCIuY29uY2F0KGFjdGlvbi50eXBlLCBcIidcIikpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgcmVzb2x2ZWRPcHRpb25zID0gX19hc3NpZ24oX19hc3NpZ24oe30sIEludGVycHJldGVyLmRlZmF1bHRPcHRpb25zKSwgb3B0aW9ucyk7XG5cbiAgICB2YXIgY2xvY2sgPSByZXNvbHZlZE9wdGlvbnMuY2xvY2ssXG4gICAgICAgIGxvZ2dlciA9IHJlc29sdmVkT3B0aW9ucy5sb2dnZXIsXG4gICAgICAgIHBhcmVudCA9IHJlc29sdmVkT3B0aW9ucy5wYXJlbnQsXG4gICAgICAgIGlkID0gcmVzb2x2ZWRPcHRpb25zLmlkO1xuICAgIHZhciByZXNvbHZlZElkID0gaWQgIT09IHVuZGVmaW5lZCA/IGlkIDogbWFjaGluZS5pZDtcbiAgICB0aGlzLmlkID0gcmVzb2x2ZWRJZDtcbiAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlcjtcbiAgICB0aGlzLmNsb2NrID0gY2xvY2s7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy5vcHRpb25zID0gcmVzb2x2ZWRPcHRpb25zO1xuICAgIHRoaXMuc2NoZWR1bGVyID0gbmV3IFNjaGVkdWxlcih7XG4gICAgICBkZWZlckV2ZW50czogdGhpcy5vcHRpb25zLmRlZmVyRXZlbnRzXG4gICAgfSk7XG4gICAgdGhpcy5zZXNzaW9uSWQgPSByZWdpc3RyeS5ib29rSWQoKTtcbiAgfVxuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShJbnRlcnByZXRlci5wcm90b3R5cGUsIFwiaW5pdGlhbFN0YXRlXCIsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIGlmICh0aGlzLl9pbml0aWFsU3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2luaXRpYWxTdGF0ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb3ZpZGUodGhpcywgZnVuY3Rpb24gKCkge1xuICAgICAgICBfdGhpcy5faW5pdGlhbFN0YXRlID0gX3RoaXMubWFjaGluZS5pbml0aWFsU3RhdGU7XG4gICAgICAgIHJldHVybiBfdGhpcy5faW5pdGlhbFN0YXRlO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShJbnRlcnByZXRlci5wcm90b3R5cGUsIFwic3RhdGVcIiwge1xuICAgIC8qKlxyXG4gICAgICogQGRlcHJlY2F0ZWQgVXNlIGAuZ2V0U25hcHNob3QoKWAgaW5zdGVhZC5cclxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICAgIHdhcm4odGhpcy5zdGF0dXMgIT09IEludGVycHJldGVyU3RhdHVzLk5vdFN0YXJ0ZWQsIFwiQXR0ZW1wdGVkIHRvIHJlYWQgc3RhdGUgZnJvbSB1bmluaXRpYWxpemVkIHNlcnZpY2UgJ1wiLmNvbmNhdCh0aGlzLmlkLCBcIicuIE1ha2Ugc3VyZSB0aGUgc2VydmljZSBpcyBzdGFydGVkIGZpcnN0LlwiKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbiAgLyoqXHJcbiAgICogRXhlY3V0ZXMgdGhlIGFjdGlvbnMgb2YgdGhlIGdpdmVuIHN0YXRlLCB3aXRoIHRoYXQgc3RhdGUncyBgY29udGV4dGAgYW5kIGBldmVudGAuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gc3RhdGUgVGhlIHN0YXRlIHdob3NlIGFjdGlvbnMgd2lsbCBiZSBleGVjdXRlZFxyXG4gICAqIEBwYXJhbSBhY3Rpb25zQ29uZmlnIFRoZSBhY3Rpb24gaW1wbGVtZW50YXRpb25zIHRvIHVzZVxyXG4gICAqL1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24gKHN0YXRlLCBhY3Rpb25zQ29uZmlnKSB7XG4gICAgdmFyIGVfMSwgX2E7XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2IgPSBfX3ZhbHVlcyhzdGF0ZS5hY3Rpb25zKSwgX2MgPSBfYi5uZXh0KCk7ICFfYy5kb25lOyBfYyA9IF9iLm5leHQoKSkge1xuICAgICAgICB2YXIgYWN0aW9uID0gX2MudmFsdWU7XG4gICAgICAgIHRoaXMuZXhlYyhhY3Rpb24sIHN0YXRlLCBhY3Rpb25zQ29uZmlnKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzFfMSkge1xuICAgICAgZV8xID0ge1xuICAgICAgICBlcnJvcjogZV8xXzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfYyAmJiAhX2MuZG9uZSAmJiAoX2EgPSBfYi5yZXR1cm4pKSBfYS5jYWxsKF9iKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZSwgX2V2ZW50KSB7XG4gICAgdmFyIGVfMiwgX2EsIGVfMywgX2IsIGVfNCwgX2MsIGVfNSwgX2Q7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzOyAvLyBBdHRhY2ggc2Vzc2lvbiBJRCB0byBzdGF0ZVxuXG5cbiAgICBzdGF0ZS5fc2Vzc2lvbmlkID0gdGhpcy5zZXNzaW9uSWQ7IC8vIFVwZGF0ZSBzdGF0ZVxuXG4gICAgdGhpcy5fc3RhdGUgPSBzdGF0ZTsgLy8gRXhlY3V0ZSBhY3Rpb25zXG5cbiAgICBpZiAoKCF0aGlzLm1hY2hpbmUuY29uZmlnLnByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzIHx8IC8vIHRoaXMgaXMgY3VycmVudGx5IHJlcXVpcmVkIHRvIGV4ZWN1dGUgaW5pdGlhbCBhY3Rpb25zIGFzIHRoZSBgaW5pdGlhbFN0YXRlYCBnZXRzIGNhY2hlZFxuICAgIC8vIHdlIGNhbid0IGp1c3QgcmVjb21wdXRlIGl0IChhbmQgZXhlY3V0ZSBhY3Rpb25zIHdoaWxlIGRvaW5nIHNvKSBiZWNhdXNlIHdlIHRyeSB0byBwcmVzZXJ2ZSBpZGVudGl0eSBvZiBhY3RvcnMgY3JlYXRlZCB3aXRoaW4gaW5pdGlhbCBhc3NpZ25zXG4gICAgX2V2ZW50ID09PSBpbml0RXZlbnQpICYmIHRoaXMub3B0aW9ucy5leGVjdXRlKSB7XG4gICAgICB0aGlzLmV4ZWN1dGUodGhpcy5zdGF0ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBpdGVtID0gdm9pZCAwO1xuXG4gICAgICB3aGlsZSAoaXRlbSA9IHRoaXMuX291dGdvaW5nUXVldWUuc2hpZnQoKSkge1xuICAgICAgICBpdGVtWzBdLnNlbmQoaXRlbVsxXSk7XG4gICAgICB9XG4gICAgfSAvLyBVcGRhdGUgY2hpbGRyZW5cblxuXG4gICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgX3RoaXMuc3RhdGUuY2hpbGRyZW5bY2hpbGQuaWRdID0gY2hpbGQ7XG4gICAgfSk7IC8vIERldiB0b29sc1xuXG4gICAgaWYgKHRoaXMuZGV2VG9vbHMpIHtcbiAgICAgIHRoaXMuZGV2VG9vbHMuc2VuZChfZXZlbnQuZGF0YSwgc3RhdGUpO1xuICAgIH0gLy8gRXhlY3V0ZSBsaXN0ZW5lcnNcblxuXG4gICAgaWYgKHN0YXRlLmV2ZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciBfZSA9IF9fdmFsdWVzKHRoaXMuZXZlbnRMaXN0ZW5lcnMpLCBfZiA9IF9lLm5leHQoKTsgIV9mLmRvbmU7IF9mID0gX2UubmV4dCgpKSB7XG4gICAgICAgICAgdmFyIGxpc3RlbmVyID0gX2YudmFsdWU7XG4gICAgICAgICAgbGlzdGVuZXIoc3RhdGUuZXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlXzJfMSkge1xuICAgICAgICBlXzIgPSB7XG4gICAgICAgICAgZXJyb3I6IGVfMl8xXG4gICAgICAgIH07XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChfZiAmJiAhX2YuZG9uZSAmJiAoX2EgPSBfZS5yZXR1cm4pKSBfYS5jYWxsKF9lKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBpZiAoZV8yKSB0aHJvdyBlXzIuZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2cgPSBfX3ZhbHVlcyh0aGlzLmxpc3RlbmVycyksIF9oID0gX2cubmV4dCgpOyAhX2guZG9uZTsgX2ggPSBfZy5uZXh0KCkpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVyID0gX2gudmFsdWU7XG4gICAgICAgIGxpc3RlbmVyKHN0YXRlLCBzdGF0ZS5ldmVudCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV8zXzEpIHtcbiAgICAgIGVfMyA9IHtcbiAgICAgICAgZXJyb3I6IGVfM18xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoX2ggJiYgIV9oLmRvbmUgJiYgKF9iID0gX2cucmV0dXJuKSkgX2IuY2FsbChfZyk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV8zKSB0aHJvdyBlXzMuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9qID0gX192YWx1ZXModGhpcy5jb250ZXh0TGlzdGVuZXJzKSwgX2sgPSBfai5uZXh0KCk7ICFfay5kb25lOyBfayA9IF9qLm5leHQoKSkge1xuICAgICAgICB2YXIgY29udGV4dExpc3RlbmVyID0gX2sudmFsdWU7XG4gICAgICAgIGNvbnRleHRMaXN0ZW5lcih0aGlzLnN0YXRlLmNvbnRleHQsIHRoaXMuc3RhdGUuaGlzdG9yeSA/IHRoaXMuc3RhdGUuaGlzdG9yeS5jb250ZXh0IDogdW5kZWZpbmVkKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzRfMSkge1xuICAgICAgZV80ID0ge1xuICAgICAgICBlcnJvcjogZV80XzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfayAmJiAhX2suZG9uZSAmJiAoX2MgPSBfai5yZXR1cm4pKSBfYy5jYWxsKF9qKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzQpIHRocm93IGVfNC5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5kb25lKSB7XG4gICAgICAvLyBnZXQgZmluYWwgY2hpbGQgc3RhdGUgbm9kZVxuICAgICAgdmFyIGZpbmFsQ2hpbGRTdGF0ZU5vZGUgPSBzdGF0ZS5jb25maWd1cmF0aW9uLmZpbmQoZnVuY3Rpb24gKHNuKSB7XG4gICAgICAgIHJldHVybiBzbi50eXBlID09PSAnZmluYWwnICYmIHNuLnBhcmVudCA9PT0gX3RoaXMubWFjaGluZTtcbiAgICAgIH0pO1xuICAgICAgdmFyIGRvbmVEYXRhID0gZmluYWxDaGlsZFN0YXRlTm9kZSAmJiBmaW5hbENoaWxkU3RhdGVOb2RlLmRvbmVEYXRhID8gbWFwQ29udGV4dChmaW5hbENoaWxkU3RhdGVOb2RlLmRvbmVEYXRhLCBzdGF0ZS5jb250ZXh0LCBfZXZlbnQpIDogdW5kZWZpbmVkO1xuICAgICAgdGhpcy5fZG9uZUV2ZW50ID0gZG9uZUludm9rZSh0aGlzLmlkLCBkb25lRGF0YSk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIF9sID0gX192YWx1ZXModGhpcy5kb25lTGlzdGVuZXJzKSwgX20gPSBfbC5uZXh0KCk7ICFfbS5kb25lOyBfbSA9IF9sLm5leHQoKSkge1xuICAgICAgICAgIHZhciBsaXN0ZW5lciA9IF9tLnZhbHVlO1xuICAgICAgICAgIGxpc3RlbmVyKHRoaXMuX2RvbmVFdmVudCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVfNV8xKSB7XG4gICAgICAgIGVfNSA9IHtcbiAgICAgICAgICBlcnJvcjogZV81XzFcbiAgICAgICAgfTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKF9tICYmICFfbS5kb25lICYmIChfZCA9IF9sLnJldHVybikpIF9kLmNhbGwoX2wpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIGlmIChlXzUpIHRocm93IGVfNS5lcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLl9zdG9wKCk7XG5cbiAgICAgIHRoaXMuX3N0b3BDaGlsZHJlbigpO1xuXG4gICAgICByZWdpc3RyeS5mcmVlKHRoaXMuc2Vzc2lvbklkKTtcbiAgICB9XG4gIH07XG4gIC8qXHJcbiAgICogQWRkcyBhIGxpc3RlbmVyIHRoYXQgaXMgbm90aWZpZWQgd2hlbmV2ZXIgYSBzdGF0ZSB0cmFuc2l0aW9uIGhhcHBlbnMuIFRoZSBsaXN0ZW5lciBpcyBjYWxsZWQgd2l0aFxyXG4gICAqIHRoZSBuZXh0IHN0YXRlIGFuZCB0aGUgZXZlbnQgb2JqZWN0IHRoYXQgY2F1c2VkIHRoZSBzdGF0ZSB0cmFuc2l0aW9uLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGxpc3RlbmVyIFRoZSBzdGF0ZSBsaXN0ZW5lclxyXG4gICAqL1xuXG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLm9uVHJhbnNpdGlvbiA9IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgIHRoaXMubGlzdGVuZXJzLmFkZChsaXN0ZW5lcik7IC8vIFNlbmQgY3VycmVudCBzdGF0ZSB0byBsaXN0ZW5lclxuXG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBJbnRlcnByZXRlclN0YXR1cy5SdW5uaW5nKSB7XG4gICAgICBsaXN0ZW5lcih0aGlzLnN0YXRlLCB0aGlzLnN0YXRlLmV2ZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc3Vic2NyaWJlID0gZnVuY3Rpb24gKG5leHRMaXN0ZW5lck9yT2JzZXJ2ZXIsIF8sIC8vIFRPRE86IGVycm9yIGxpc3RlbmVyXG4gIGNvbXBsZXRlTGlzdGVuZXIpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIG9ic2VydmVyID0gdG9PYnNlcnZlcihuZXh0TGlzdGVuZXJPck9ic2VydmVyLCBfLCBjb21wbGV0ZUxpc3RlbmVyKTtcbiAgICB0aGlzLmxpc3RlbmVycy5hZGQob2JzZXJ2ZXIubmV4dCk7IC8vIFNlbmQgY3VycmVudCBzdGF0ZSB0byBsaXN0ZW5lclxuXG4gICAgaWYgKHRoaXMuc3RhdHVzICE9PSBJbnRlcnByZXRlclN0YXR1cy5Ob3RTdGFydGVkKSB7XG4gICAgICBvYnNlcnZlci5uZXh0KHRoaXMuc3RhdGUpO1xuICAgIH1cblxuICAgIHZhciBjb21wbGV0ZU9uY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBfdGhpcy5kb25lTGlzdGVuZXJzLmRlbGV0ZShjb21wbGV0ZU9uY2UpO1xuXG4gICAgICBfdGhpcy5zdG9wTGlzdGVuZXJzLmRlbGV0ZShjb21wbGV0ZU9uY2UpO1xuXG4gICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgIH07XG5cbiAgICBpZiAodGhpcy5zdGF0dXMgPT09IEludGVycHJldGVyU3RhdHVzLlN0b3BwZWQpIHtcbiAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub25Eb25lKGNvbXBsZXRlT25jZSk7XG4gICAgICB0aGlzLm9uU3RvcChjb21wbGV0ZU9uY2UpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBfdGhpcy5saXN0ZW5lcnMuZGVsZXRlKG9ic2VydmVyLm5leHQpO1xuXG4gICAgICAgIF90aGlzLmRvbmVMaXN0ZW5lcnMuZGVsZXRlKGNvbXBsZXRlT25jZSk7XG5cbiAgICAgICAgX3RoaXMuc3RvcExpc3RlbmVycy5kZWxldGUoY29tcGxldGVPbmNlKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuICAvKipcclxuICAgKiBBZGRzIGFuIGV2ZW50IGxpc3RlbmVyIHRoYXQgaXMgbm90aWZpZWQgd2hlbmV2ZXIgYW4gZXZlbnQgaXMgc2VudCB0byB0aGUgcnVubmluZyBpbnRlcnByZXRlci5cclxuICAgKiBAcGFyYW0gbGlzdGVuZXIgVGhlIGV2ZW50IGxpc3RlbmVyXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUub25FdmVudCA9IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnMuYWRkKGxpc3RlbmVyKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgLyoqXHJcbiAgICogQWRkcyBhbiBldmVudCBsaXN0ZW5lciB0aGF0IGlzIG5vdGlmaWVkIHdoZW5ldmVyIGEgYHNlbmRgIGV2ZW50IG9jY3Vycy5cclxuICAgKiBAcGFyYW0gbGlzdGVuZXIgVGhlIGV2ZW50IGxpc3RlbmVyXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUub25TZW5kID0gZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgdGhpcy5zZW5kTGlzdGVuZXJzLmFkZChsaXN0ZW5lcik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIC8qKlxyXG4gICAqIEFkZHMgYSBjb250ZXh0IGxpc3RlbmVyIHRoYXQgaXMgbm90aWZpZWQgd2hlbmV2ZXIgdGhlIHN0YXRlIGNvbnRleHQgY2hhbmdlcy5cclxuICAgKiBAcGFyYW0gbGlzdGVuZXIgVGhlIGNvbnRleHQgbGlzdGVuZXJcclxuICAgKi9cblxuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5vbkNoYW5nZSA9IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgIHRoaXMuY29udGV4dExpc3RlbmVycy5hZGQobGlzdGVuZXIpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICAvKipcclxuICAgKiBBZGRzIGEgbGlzdGVuZXIgdGhhdCBpcyBub3RpZmllZCB3aGVuIHRoZSBtYWNoaW5lIGlzIHN0b3BwZWQuXHJcbiAgICogQHBhcmFtIGxpc3RlbmVyIFRoZSBsaXN0ZW5lclxyXG4gICAqL1xuXG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLm9uU3RvcCA9IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgIHRoaXMuc3RvcExpc3RlbmVycy5hZGQobGlzdGVuZXIpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICAvKipcclxuICAgKiBBZGRzIGEgc3RhdGUgbGlzdGVuZXIgdGhhdCBpcyBub3RpZmllZCB3aGVuIHRoZSBzdGF0ZWNoYXJ0IGhhcyByZWFjaGVkIGl0cyBmaW5hbCBzdGF0ZS5cclxuICAgKiBAcGFyYW0gbGlzdGVuZXIgVGhlIHN0YXRlIGxpc3RlbmVyXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUub25Eb25lID0gZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBJbnRlcnByZXRlclN0YXR1cy5TdG9wcGVkICYmIHRoaXMuX2RvbmVFdmVudCkge1xuICAgICAgbGlzdGVuZXIodGhpcy5fZG9uZUV2ZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kb25lTGlzdGVuZXJzLmFkZChsaXN0ZW5lcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIC8qKlxyXG4gICAqIFJlbW92ZXMgYSBsaXN0ZW5lci5cclxuICAgKiBAcGFyYW0gbGlzdGVuZXIgVGhlIGxpc3RlbmVyIHRvIHJlbW92ZVxyXG4gICAqL1xuXG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgIHRoaXMubGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG4gICAgdGhpcy5ldmVudExpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICAgIHRoaXMuc2VuZExpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICAgIHRoaXMuc3RvcExpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICAgIHRoaXMuZG9uZUxpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICAgIHRoaXMuY29udGV4dExpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICAvKipcclxuICAgKiBTdGFydHMgdGhlIGludGVycHJldGVyIGZyb20gdGhlIGdpdmVuIHN0YXRlLCBvciB0aGUgaW5pdGlhbCBzdGF0ZS5cclxuICAgKiBAcGFyYW0gaW5pdGlhbFN0YXRlIFRoZSBzdGF0ZSB0byBzdGFydCB0aGUgc3RhdGVjaGFydCBmcm9tXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAoaW5pdGlhbFN0YXRlKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gSW50ZXJwcmV0ZXJTdGF0dXMuUnVubmluZykge1xuICAgICAgLy8gRG8gbm90IHJlc3RhcnQgdGhlIHNlcnZpY2UgaWYgaXQgaXMgYWxyZWFkeSBzdGFydGVkXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IC8vIHllcywgaXQncyBhIGhhY2sgYnV0IHdlIG5lZWQgdGhlIHJlbGF0ZWQgY2FjaGUgdG8gYmUgcG9wdWxhdGVkIGZvciBzb21lIHRoaW5ncyB0byB3b3JrIChsaWtlIGRlbGF5ZWQgdHJhbnNpdGlvbnMpXG4gICAgLy8gdGhpcyBpcyB1c3VhbGx5IGNhbGxlZCBieSBgbWFjaGluZS5nZXRJbml0aWFsU3RhdGVgIGJ1dCBpZiB3ZSByZWh5ZHJhdGUgZnJvbSBhIHN0YXRlIHdlIG1pZ2h0IGJ5cGFzcyB0aGlzIGNhbGxcbiAgICAvLyB3ZSBhbHNvIGRvbid0IHdhbnQgdG8gY2FsbCB0aGlzIG1ldGhvZCBoZXJlIGFzIGl0IHJlc29sdmVzIHRoZSBmdWxsIGluaXRpYWwgc3RhdGUgd2hpY2ggbWlnaHQgaW52b2x2ZSBjYWxsaW5nIGFzc2lnbiBhY3Rpb25zXG4gICAgLy8gYW5kIHRoYXQgY291bGQgcG90ZW50aWFsbHkgbGVhZCB0byBzb21lIHVud2FudGVkIHNpZGUtZWZmZWN0cyAoZXZlbiBzdWNoIGFzIGNyZWF0aW5nIHNvbWUgcm9ndWUgYWN0b3JzKVxuXG5cbiAgICB0aGlzLm1hY2hpbmUuX2luaXQoKTtcblxuICAgIHJlZ2lzdHJ5LnJlZ2lzdGVyKHRoaXMuc2Vzc2lvbklkLCB0aGlzKTtcbiAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB0aGlzLnN0YXR1cyA9IEludGVycHJldGVyU3RhdHVzLlJ1bm5pbmc7XG4gICAgdmFyIHJlc29sdmVkU3RhdGUgPSBpbml0aWFsU3RhdGUgPT09IHVuZGVmaW5lZCA/IHRoaXMuaW5pdGlhbFN0YXRlIDogcHJvdmlkZSh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gaXNTdGF0ZUNvbmZpZyhpbml0aWFsU3RhdGUpID8gX3RoaXMubWFjaGluZS5yZXNvbHZlU3RhdGUoaW5pdGlhbFN0YXRlKSA6IF90aGlzLm1hY2hpbmUucmVzb2x2ZVN0YXRlKFN0YXRlLmZyb20oaW5pdGlhbFN0YXRlLCBfdGhpcy5tYWNoaW5lLmNvbnRleHQpKTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuZGV2VG9vbHMpIHtcbiAgICAgIHRoaXMuYXR0YWNoRGV2KCk7XG4gICAgfVxuXG4gICAgdGhpcy5zY2hlZHVsZXIuaW5pdGlhbGl6ZShmdW5jdGlvbiAoKSB7XG4gICAgICBfdGhpcy51cGRhdGUocmVzb2x2ZWRTdGF0ZSwgaW5pdEV2ZW50KTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuX3N0b3BDaGlsZHJlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBUT0RPOiB0aGluayBhYm91dCBjb252ZXJ0aW5nIHRob3NlIHRvIGFjdGlvbnNcbiAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICBpZiAoaXNGdW5jdGlvbihjaGlsZC5zdG9wKSkge1xuICAgICAgICBjaGlsZC5zdG9wKCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5jaGlsZHJlbi5jbGVhcigpO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5fc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZV82LCBfYSwgZV83LCBfYiwgZV84LCBfYywgZV85LCBfZCwgZV8xMCwgX2U7XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2YgPSBfX3ZhbHVlcyh0aGlzLmxpc3RlbmVycyksIF9nID0gX2YubmV4dCgpOyAhX2cuZG9uZTsgX2cgPSBfZi5uZXh0KCkpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVyID0gX2cudmFsdWU7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV82XzEpIHtcbiAgICAgIGVfNiA9IHtcbiAgICAgICAgZXJyb3I6IGVfNl8xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoX2cgJiYgIV9nLmRvbmUgJiYgKF9hID0gX2YucmV0dXJuKSkgX2EuY2FsbChfZik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV82KSB0aHJvdyBlXzYuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9oID0gX192YWx1ZXModGhpcy5zdG9wTGlzdGVuZXJzKSwgX2ogPSBfaC5uZXh0KCk7ICFfai5kb25lOyBfaiA9IF9oLm5leHQoKSkge1xuICAgICAgICB2YXIgbGlzdGVuZXIgPSBfai52YWx1ZTsgLy8gY2FsbCBsaXN0ZW5lciwgdGhlbiByZW1vdmVcblxuICAgICAgICBsaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLnN0b3BMaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzdfMSkge1xuICAgICAgZV83ID0ge1xuICAgICAgICBlcnJvcjogZV83XzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfaiAmJiAhX2ouZG9uZSAmJiAoX2IgPSBfaC5yZXR1cm4pKSBfYi5jYWxsKF9oKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzcpIHRocm93IGVfNy5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2sgPSBfX3ZhbHVlcyh0aGlzLmNvbnRleHRMaXN0ZW5lcnMpLCBfbCA9IF9rLm5leHQoKTsgIV9sLmRvbmU7IF9sID0gX2submV4dCgpKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lciA9IF9sLnZhbHVlO1xuICAgICAgICB0aGlzLmNvbnRleHRMaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzhfMSkge1xuICAgICAgZV84ID0ge1xuICAgICAgICBlcnJvcjogZV84XzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfbCAmJiAhX2wuZG9uZSAmJiAoX2MgPSBfay5yZXR1cm4pKSBfYy5jYWxsKF9rKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzgpIHRocm93IGVfOC5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX20gPSBfX3ZhbHVlcyh0aGlzLmRvbmVMaXN0ZW5lcnMpLCBfbyA9IF9tLm5leHQoKTsgIV9vLmRvbmU7IF9vID0gX20ubmV4dCgpKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lciA9IF9vLnZhbHVlO1xuICAgICAgICB0aGlzLmRvbmVMaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzlfMSkge1xuICAgICAgZV85ID0ge1xuICAgICAgICBlcnJvcjogZV85XzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfbyAmJiAhX28uZG9uZSAmJiAoX2QgPSBfbS5yZXR1cm4pKSBfZC5jYWxsKF9tKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzkpIHRocm93IGVfOS5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgIC8vIEludGVycHJldGVyIGFscmVhZHkgc3RvcHBlZDsgZG8gbm90aGluZ1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIHRoaXMuc3RhdHVzID0gSW50ZXJwcmV0ZXJTdGF0dXMuU3RvcHBlZDtcbiAgICB0aGlzLl9pbml0aWFsU3RhdGUgPSB1bmRlZmluZWQ7XG5cbiAgICB0cnkge1xuICAgICAgLy8gd2UgYXJlIGdvaW5nIHRvIHN0b3Agd2l0aGluIHRoZSBjdXJyZW50IHN5bmMgZnJhbWVcbiAgICAgIC8vIHNvIHdlIGNhbiBzYWZlbHkganVzdCBjYW5jZWwgdGhpcyBoZXJlIGFzIG5vdGhpbmcgYXN5bmMgc2hvdWxkIGJlIGZpcmVkIGFueXdheVxuICAgICAgZm9yICh2YXIgX3AgPSBfX3ZhbHVlcyhPYmplY3Qua2V5cyh0aGlzLmRlbGF5ZWRFdmVudHNNYXApKSwgX3EgPSBfcC5uZXh0KCk7ICFfcS5kb25lOyBfcSA9IF9wLm5leHQoKSkge1xuICAgICAgICB2YXIga2V5ID0gX3EudmFsdWU7XG4gICAgICAgIHRoaXMuY2xvY2suY2xlYXJUaW1lb3V0KHRoaXMuZGVsYXllZEV2ZW50c01hcFtrZXldKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzEwXzEpIHtcbiAgICAgIGVfMTAgPSB7XG4gICAgICAgIGVycm9yOiBlXzEwXzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfcSAmJiAhX3EuZG9uZSAmJiAoX2UgPSBfcC5yZXR1cm4pKSBfZS5jYWxsKF9wKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzEwKSB0aHJvdyBlXzEwLmVycm9yO1xuICAgICAgfVxuICAgIH0gLy8gY2xlYXIgZXZlcnl0aGluZyB0aGF0IG1pZ2h0IGJlIGVucXVldWVkXG5cblxuICAgIHRoaXMuc2NoZWR1bGVyLmNsZWFyKCk7XG4gICAgdGhpcy5zY2hlZHVsZXIgPSBuZXcgU2NoZWR1bGVyKHtcbiAgICAgIGRlZmVyRXZlbnRzOiB0aGlzLm9wdGlvbnMuZGVmZXJFdmVudHNcbiAgICB9KTtcbiAgfTtcbiAgLyoqXHJcbiAgICogU3RvcHMgdGhlIGludGVycHJldGVyIGFuZCB1bnN1YnNjcmliZSBhbGwgbGlzdGVuZXJzLlxyXG4gICAqXHJcbiAgICogVGhpcyB3aWxsIGFsc28gbm90aWZ5IHRoZSBgb25TdG9wYCBsaXN0ZW5lcnMuXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBUT0RPOiBhZGQgd2FybmluZyBmb3Igc3RvcHBpbmcgbm9uLXJvb3QgaW50ZXJwcmV0ZXJzXG4gICAgdmFyIF90aGlzID0gdGhpczsgLy8gZ3JhYiB0aGUgY3VycmVudCBzY2hlZHVsZXIgYXMgaXQgd2lsbCBiZSByZXBsYWNlZCBpbiBfc3RvcFxuXG5cbiAgICB2YXIgc2NoZWR1bGVyID0gdGhpcy5zY2hlZHVsZXI7XG5cbiAgICB0aGlzLl9zdG9wKCk7IC8vIGxldCB3aGF0IGlzIGN1cnJlbnRseSBwcm9jZXNzZWQgdG8gYmUgZmluaXNoZWRcblxuXG4gICAgc2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIGl0IGZlZWxzIHdlaXJkIHRvIGhhbmRsZSB0aGlzIGhlcmUgYnV0IHdlIG5lZWQgdG8gaGFuZGxlIHRoaXMgZXZlbiBzbGlnaHRseSBcIm91dCBvZiBiYW5kXCJcbiAgICAgIHZhciBfZXZlbnQgPSB0b1NDWE1MRXZlbnQoe1xuICAgICAgICB0eXBlOiAneHN0YXRlLnN0b3AnXG4gICAgICB9KTtcblxuICAgICAgdmFyIG5leHRTdGF0ZSA9IHByb3ZpZGUoX3RoaXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGV4aXRBY3Rpb25zID0gZmxhdHRlbihfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoX3RoaXMuc3RhdGUuY29uZmlndXJhdGlvbiksIGZhbHNlKS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgcmV0dXJuIGIub3JkZXIgLSBhLm9yZGVyO1xuICAgICAgICB9KS5tYXAoZnVuY3Rpb24gKHN0YXRlTm9kZSkge1xuICAgICAgICAgIHJldHVybiB0b0FjdGlvbk9iamVjdHMoc3RhdGVOb2RlLm9uRXhpdCwgX3RoaXMubWFjaGluZS5vcHRpb25zLmFjdGlvbnMpO1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgdmFyIF9hID0gX19yZWFkKHJlc29sdmVBY3Rpb25zKF90aGlzLm1hY2hpbmUsIF90aGlzLnN0YXRlLCBfdGhpcy5zdGF0ZS5jb250ZXh0LCBfZXZlbnQsIFt7XG4gICAgICAgICAgdHlwZTogJ2V4aXQnLFxuICAgICAgICAgIGFjdGlvbnM6IGV4aXRBY3Rpb25zXG4gICAgICAgIH1dLCBfdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cyA/IF90aGlzLl9leGVjIDogdW5kZWZpbmVkLCBfdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cyB8fCBfdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVzZXJ2ZUFjdGlvbk9yZGVyKSwgMiksXG4gICAgICAgICAgICByZXNvbHZlZEFjdGlvbnMgPSBfYVswXSxcbiAgICAgICAgICAgIHVwZGF0ZWRDb250ZXh0ID0gX2FbMV07XG5cbiAgICAgICAgdmFyIG5ld1N0YXRlID0gbmV3IFN0YXRlKHtcbiAgICAgICAgICB2YWx1ZTogX3RoaXMuc3RhdGUudmFsdWUsXG4gICAgICAgICAgY29udGV4dDogdXBkYXRlZENvbnRleHQsXG4gICAgICAgICAgX2V2ZW50OiBfZXZlbnQsXG4gICAgICAgICAgX3Nlc3Npb25pZDogX3RoaXMuc2Vzc2lvbklkLFxuICAgICAgICAgIGhpc3RvcnlWYWx1ZTogdW5kZWZpbmVkLFxuICAgICAgICAgIGhpc3Rvcnk6IF90aGlzLnN0YXRlLFxuICAgICAgICAgIGFjdGlvbnM6IHJlc29sdmVkQWN0aW9ucy5maWx0ZXIoZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuICFpc1JhaXNhYmxlQWN0aW9uKGFjdGlvbik7XG4gICAgICAgICAgfSksXG4gICAgICAgICAgYWN0aXZpdGllczoge30sXG4gICAgICAgICAgZXZlbnRzOiBbXSxcbiAgICAgICAgICBjb25maWd1cmF0aW9uOiBbXSxcbiAgICAgICAgICB0cmFuc2l0aW9uczogW10sXG4gICAgICAgICAgY2hpbGRyZW46IHt9LFxuICAgICAgICAgIGRvbmU6IF90aGlzLnN0YXRlLmRvbmUsXG4gICAgICAgICAgdGFnczogX3RoaXMuc3RhdGUudGFncyxcbiAgICAgICAgICBtYWNoaW5lOiBfdGhpcy5tYWNoaW5lXG4gICAgICAgIH0pO1xuICAgICAgICBuZXdTdGF0ZS5jaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIG5ld1N0YXRlO1xuICAgICAgfSk7XG5cbiAgICAgIF90aGlzLnVwZGF0ZShuZXh0U3RhdGUsIF9ldmVudCk7XG5cbiAgICAgIF90aGlzLl9zdG9wQ2hpbGRyZW4oKTtcblxuICAgICAgcmVnaXN0cnkuZnJlZShfdGhpcy5zZXNzaW9uSWQpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5iYXRjaCA9IGZ1bmN0aW9uIChldmVudHMpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBJbnRlcnByZXRlclN0YXR1cy5Ob3RTdGFydGVkICYmIHRoaXMub3B0aW9ucy5kZWZlckV2ZW50cykge1xuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbnNvbGVcbiAgICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgICB3YXJuKGZhbHNlLCBcIlwiLmNvbmNhdChldmVudHMubGVuZ3RoLCBcIiBldmVudChzKSB3ZXJlIHNlbnQgdG8gdW5pbml0aWFsaXplZCBzZXJ2aWNlIFxcXCJcIikuY29uY2F0KHRoaXMubWFjaGluZS5pZCwgXCJcXFwiIGFuZCBhcmUgZGVmZXJyZWQuIE1ha2Ugc3VyZSAuc3RhcnQoKSBpcyBjYWxsZWQgZm9yIHRoaXMgc2VydmljZS5cXG5FdmVudDogXCIpLmNvbmNhdChKU09OLnN0cmluZ2lmeShldmVudCkpKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdHVzICE9PSBJbnRlcnByZXRlclN0YXR1cy5SdW5uaW5nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICAgIFwiXCIuY29uY2F0KGV2ZW50cy5sZW5ndGgsIFwiIGV2ZW50KHMpIHdlcmUgc2VudCB0byB1bmluaXRpYWxpemVkIHNlcnZpY2UgXFxcIlwiKS5jb25jYXQodGhpcy5tYWNoaW5lLmlkLCBcIlxcXCIuIE1ha2Ugc3VyZSAuc3RhcnQoKSBpcyBjYWxsZWQgZm9yIHRoaXMgc2VydmljZSwgb3Igc2V0IHsgZGVmZXJFdmVudHM6IHRydWUgfSBpbiB0aGUgc2VydmljZSBvcHRpb25zLlwiKSk7XG4gICAgfVxuXG4gICAgaWYgKCFldmVudHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGV4ZWMgPSAhIXRoaXMubWFjaGluZS5jb25maWcucHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHMgJiYgdGhpcy5fZXhlYztcbiAgICB0aGlzLnNjaGVkdWxlci5zY2hlZHVsZShmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgZV8xMSwgX2E7XG5cbiAgICAgIHZhciBuZXh0U3RhdGUgPSBfdGhpcy5zdGF0ZTtcbiAgICAgIHZhciBiYXRjaENoYW5nZWQgPSBmYWxzZTtcbiAgICAgIHZhciBiYXRjaGVkQWN0aW9ucyA9IFtdO1xuXG4gICAgICB2YXIgX2xvb3BfMSA9IGZ1bmN0aW9uIChldmVudF8xKSB7XG4gICAgICAgIHZhciBfZXZlbnQgPSB0b1NDWE1MRXZlbnQoZXZlbnRfMSk7XG5cbiAgICAgICAgX3RoaXMuZm9yd2FyZChfZXZlbnQpO1xuXG4gICAgICAgIG5leHRTdGF0ZSA9IHByb3ZpZGUoX3RoaXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMubWFjaGluZS50cmFuc2l0aW9uKG5leHRTdGF0ZSwgX2V2ZW50LCB1bmRlZmluZWQsIGV4ZWMgfHwgdW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGJhdGNoZWRBY3Rpb25zLnB1c2guYXBwbHkoYmF0Y2hlZEFjdGlvbnMsIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChfdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cyA/IG5leHRTdGF0ZS5hY3Rpb25zIDogbmV4dFN0YXRlLmFjdGlvbnMubWFwKGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgcmV0dXJuIGJpbmRBY3Rpb25Ub1N0YXRlKGEsIG5leHRTdGF0ZSk7XG4gICAgICAgIH0pKSwgZmFsc2UpKTtcbiAgICAgICAgYmF0Y2hDaGFuZ2VkID0gYmF0Y2hDaGFuZ2VkIHx8ICEhbmV4dFN0YXRlLmNoYW5nZWQ7XG4gICAgICB9O1xuXG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciBldmVudHNfMSA9IF9fdmFsdWVzKGV2ZW50cyksIGV2ZW50c18xXzEgPSBldmVudHNfMS5uZXh0KCk7ICFldmVudHNfMV8xLmRvbmU7IGV2ZW50c18xXzEgPSBldmVudHNfMS5uZXh0KCkpIHtcbiAgICAgICAgICB2YXIgZXZlbnRfMSA9IGV2ZW50c18xXzEudmFsdWU7XG5cbiAgICAgICAgICBfbG9vcF8xKGV2ZW50XzEpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlXzExXzEpIHtcbiAgICAgICAgZV8xMSA9IHtcbiAgICAgICAgICBlcnJvcjogZV8xMV8xXG4gICAgICAgIH07XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChldmVudHNfMV8xICYmICFldmVudHNfMV8xLmRvbmUgJiYgKF9hID0gZXZlbnRzXzEucmV0dXJuKSkgX2EuY2FsbChldmVudHNfMSk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgaWYgKGVfMTEpIHRocm93IGVfMTEuZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbmV4dFN0YXRlLmNoYW5nZWQgPSBiYXRjaENoYW5nZWQ7XG4gICAgICBuZXh0U3RhdGUuYWN0aW9ucyA9IGJhdGNoZWRBY3Rpb25zO1xuXG4gICAgICBfdGhpcy51cGRhdGUobmV4dFN0YXRlLCB0b1NDWE1MRXZlbnQoZXZlbnRzW2V2ZW50cy5sZW5ndGggLSAxXSkpO1xuICAgIH0pO1xuICB9O1xuICAvKipcclxuICAgKiBSZXR1cm5zIGEgc2VuZCBmdW5jdGlvbiBib3VuZCB0byB0aGlzIGludGVycHJldGVyIGluc3RhbmNlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCB0byBiZSBzZW50IGJ5IHRoZSBzZW5kZXIuXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc2VuZGVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuc2VuZC5iaW5kKHRoaXMsIGV2ZW50KTtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuX25leHRTdGF0ZSA9IGZ1bmN0aW9uIChldmVudCwgZXhlYykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoZXhlYyA9PT0gdm9pZCAwKSB7XG4gICAgICBleGVjID0gISF0aGlzLm1hY2hpbmUuY29uZmlnLnByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzICYmIHRoaXMuX2V4ZWM7XG4gICAgfVxuXG4gICAgdmFyIF9ldmVudCA9IHRvU0NYTUxFdmVudChldmVudCk7XG5cbiAgICBpZiAoX2V2ZW50Lm5hbWUuaW5kZXhPZihlcnJvclBsYXRmb3JtKSA9PT0gMCAmJiAhdGhpcy5zdGF0ZS5uZXh0RXZlbnRzLnNvbWUoZnVuY3Rpb24gKG5leHRFdmVudCkge1xuICAgICAgcmV0dXJuIG5leHRFdmVudC5pbmRleE9mKGVycm9yUGxhdGZvcm0pID09PSAwO1xuICAgIH0pKSB7XG4gICAgICB0aHJvdyBfZXZlbnQuZGF0YS5kYXRhO1xuICAgIH1cblxuICAgIHZhciBuZXh0U3RhdGUgPSBwcm92aWRlKHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBfdGhpcy5tYWNoaW5lLnRyYW5zaXRpb24oX3RoaXMuc3RhdGUsIF9ldmVudCwgdW5kZWZpbmVkLCBleGVjIHx8IHVuZGVmaW5lZCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG5leHRTdGF0ZTtcbiAgfTtcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgbmV4dCBzdGF0ZSBnaXZlbiB0aGUgaW50ZXJwcmV0ZXIncyBjdXJyZW50IHN0YXRlIGFuZCB0aGUgZXZlbnQuXHJcbiAgICpcclxuICAgKiBUaGlzIGlzIGEgcHVyZSBtZXRob2QgdGhhdCBkb2VzIF9ub3RfIHVwZGF0ZSB0aGUgaW50ZXJwcmV0ZXIncyBzdGF0ZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgdG8gZGV0ZXJtaW5lIHRoZSBuZXh0IHN0YXRlXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUubmV4dFN0YXRlID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuX25leHRTdGF0ZShldmVudCwgZmFsc2UpO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5mb3J3YXJkID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIGVfMTIsIF9hO1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9iID0gX192YWx1ZXModGhpcy5mb3J3YXJkVG8pLCBfYyA9IF9iLm5leHQoKTsgIV9jLmRvbmU7IF9jID0gX2IubmV4dCgpKSB7XG4gICAgICAgIHZhciBpZCA9IF9jLnZhbHVlO1xuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmNoaWxkcmVuLmdldChpZCk7XG5cbiAgICAgICAgaWYgKCFjaGlsZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuYWJsZSB0byBmb3J3YXJkIGV2ZW50ICdcIi5jb25jYXQoZXZlbnQsIFwiJyBmcm9tIGludGVycHJldGVyICdcIikuY29uY2F0KHRoaXMuaWQsIFwiJyB0byBub25leGlzdGFudCBjaGlsZCAnXCIpLmNvbmNhdChpZCwgXCInLlwiKSk7XG4gICAgICAgIH1cblxuICAgICAgICBjaGlsZC5zZW5kKGV2ZW50KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzEyXzEpIHtcbiAgICAgIGVfMTIgPSB7XG4gICAgICAgIGVycm9yOiBlXzEyXzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfYyAmJiAhX2MuZG9uZSAmJiAoX2EgPSBfYi5yZXR1cm4pKSBfYS5jYWxsKF9iKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzEyKSB0aHJvdyBlXzEyLmVycm9yO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuZGVmZXIgPSBmdW5jdGlvbiAoc2VuZEFjdGlvbikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgdGltZXJJZCA9IHRoaXMuY2xvY2suc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoJ3RvJyBpbiBzZW5kQWN0aW9uICYmIHNlbmRBY3Rpb24udG8pIHtcbiAgICAgICAgX3RoaXMuc2VuZFRvKHNlbmRBY3Rpb24uX2V2ZW50LCBzZW5kQWN0aW9uLnRvLCB0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF90aGlzLnNlbmQoc2VuZEFjdGlvbi5fZXZlbnQpO1xuICAgICAgfVxuICAgIH0sIHNlbmRBY3Rpb24uZGVsYXkpO1xuXG4gICAgaWYgKHNlbmRBY3Rpb24uaWQpIHtcbiAgICAgIHRoaXMuZGVsYXllZEV2ZW50c01hcFtzZW5kQWN0aW9uLmlkXSA9IHRpbWVySWQ7XG4gICAgfVxuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5jYW5jZWwgPSBmdW5jdGlvbiAoc2VuZElkKSB7XG4gICAgdGhpcy5jbG9jay5jbGVhclRpbWVvdXQodGhpcy5kZWxheWVkRXZlbnRzTWFwW3NlbmRJZF0pO1xuICAgIGRlbGV0ZSB0aGlzLmRlbGF5ZWRFdmVudHNNYXBbc2VuZElkXTtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuZXhlYyA9IGZ1bmN0aW9uIChhY3Rpb24sIHN0YXRlLCBhY3Rpb25GdW5jdGlvbk1hcCkge1xuICAgIGlmIChhY3Rpb25GdW5jdGlvbk1hcCA9PT0gdm9pZCAwKSB7XG4gICAgICBhY3Rpb25GdW5jdGlvbk1hcCA9IHRoaXMubWFjaGluZS5vcHRpb25zLmFjdGlvbnM7XG4gICAgfVxuXG4gICAgdGhpcy5fZXhlYyhhY3Rpb24sIHN0YXRlLmNvbnRleHQsIHN0YXRlLl9ldmVudCwgYWN0aW9uRnVuY3Rpb25NYXApO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5yZW1vdmVDaGlsZCA9IGZ1bmN0aW9uIChjaGlsZElkKSB7XG4gICAgdmFyIF9hO1xuXG4gICAgdGhpcy5jaGlsZHJlbi5kZWxldGUoY2hpbGRJZCk7XG4gICAgdGhpcy5mb3J3YXJkVG8uZGVsZXRlKGNoaWxkSWQpOyAvLyB0aGlzLnN0YXRlIG1pZ2h0IG5vdCBleGlzdCBhdCB0aGUgdGltZSB0aGlzIGlzIGNhbGxlZCxcbiAgICAvLyBzdWNoIGFzIHdoZW4gYSBjaGlsZCBpcyBhZGRlZCB0aGVuIHJlbW92ZWQgd2hpbGUgaW5pdGlhbGl6aW5nIHRoZSBzdGF0ZVxuXG4gICAgKF9hID0gdGhpcy5zdGF0ZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHRydWUgOiBkZWxldGUgX2EuY2hpbGRyZW5bY2hpbGRJZF07XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnN0b3BDaGlsZCA9IGZ1bmN0aW9uIChjaGlsZElkKSB7XG4gICAgdmFyIGNoaWxkID0gdGhpcy5jaGlsZHJlbi5nZXQoY2hpbGRJZCk7XG5cbiAgICBpZiAoIWNoaWxkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5yZW1vdmVDaGlsZChjaGlsZElkKTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGNoaWxkLnN0b3ApKSB7XG4gICAgICBjaGlsZC5zdG9wKCk7XG4gICAgfVxuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5zcGF3biA9IGZ1bmN0aW9uIChlbnRpdHksIG5hbWUsIG9wdGlvbnMpIHtcbiAgICBpZiAodGhpcy5zdGF0dXMgIT09IEludGVycHJldGVyU3RhdHVzLlJ1bm5pbmcpIHtcbiAgICAgIHJldHVybiBjcmVhdGVEZWZlcnJlZEFjdG9yKGVudGl0eSwgbmFtZSk7XG4gICAgfVxuXG4gICAgaWYgKGlzUHJvbWlzZUxpa2UoZW50aXR5KSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3Bhd25Qcm9taXNlKFByb21pc2UucmVzb2x2ZShlbnRpdHkpLCBuYW1lKTtcbiAgICB9IGVsc2UgaWYgKGlzRnVuY3Rpb24oZW50aXR5KSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3Bhd25DYWxsYmFjayhlbnRpdHksIG5hbWUpO1xuICAgIH0gZWxzZSBpZiAoaXNTcGF3bmVkQWN0b3IoZW50aXR5KSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3Bhd25BY3RvcihlbnRpdHksIG5hbWUpO1xuICAgIH0gZWxzZSBpZiAoaXNPYnNlcnZhYmxlKGVudGl0eSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnNwYXduT2JzZXJ2YWJsZShlbnRpdHksIG5hbWUpO1xuICAgIH0gZWxzZSBpZiAoaXNNYWNoaW5lKGVudGl0eSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnNwYXduTWFjaGluZShlbnRpdHksIF9fYXNzaWduKF9fYXNzaWduKHt9LCBvcHRpb25zKSwge1xuICAgICAgICBpZDogbmFtZVxuICAgICAgfSkpO1xuICAgIH0gZWxzZSBpZiAoaXNCZWhhdmlvcihlbnRpdHkpKSB7XG4gICAgICByZXR1cm4gdGhpcy5zcGF3bkJlaGF2aW9yKGVudGl0eSwgbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuYWJsZSB0byBzcGF3biBlbnRpdHkgXFxcIlwiLmNvbmNhdChuYW1lLCBcIlxcXCIgb2YgdHlwZSBcXFwiXCIpLmNvbmNhdCh0eXBlb2YgZW50aXR5LCBcIlxcXCIuXCIpKTtcbiAgICB9XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnNwYXduTWFjaGluZSA9IGZ1bmN0aW9uIChtYWNoaW5lLCBvcHRpb25zKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG5cbiAgICB2YXIgY2hpbGRTZXJ2aWNlID0gbmV3IEludGVycHJldGVyKG1hY2hpbmUsIF9fYXNzaWduKF9fYXNzaWduKHt9LCB0aGlzLm9wdGlvbnMpLCB7XG4gICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICBpZDogb3B0aW9ucy5pZCB8fCBtYWNoaW5lLmlkXG4gICAgfSkpO1xuXG4gICAgdmFyIHJlc29sdmVkT3B0aW9ucyA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCBERUZBVUxUX1NQQVdOX09QVElPTlMpLCBvcHRpb25zKTtcblxuICAgIGlmIChyZXNvbHZlZE9wdGlvbnMuc3luYykge1xuICAgICAgY2hpbGRTZXJ2aWNlLm9uVHJhbnNpdGlvbihmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgX3RoaXMuc2VuZCh1cGRhdGUsIHtcbiAgICAgICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICAgICAgaWQ6IGNoaWxkU2VydmljZS5pZFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHZhciBhY3RvciA9IGNoaWxkU2VydmljZTtcbiAgICB0aGlzLmNoaWxkcmVuLnNldChjaGlsZFNlcnZpY2UuaWQsIGFjdG9yKTtcblxuICAgIGlmIChyZXNvbHZlZE9wdGlvbnMuYXV0b0ZvcndhcmQpIHtcbiAgICAgIHRoaXMuZm9yd2FyZFRvLmFkZChjaGlsZFNlcnZpY2UuaWQpO1xuICAgIH1cblxuICAgIGNoaWxkU2VydmljZS5vbkRvbmUoZnVuY3Rpb24gKGRvbmVFdmVudCkge1xuICAgICAgX3RoaXMucmVtb3ZlQ2hpbGQoY2hpbGRTZXJ2aWNlLmlkKTtcblxuICAgICAgX3RoaXMuc2VuZCh0b1NDWE1MRXZlbnQoZG9uZUV2ZW50LCB7XG4gICAgICAgIG9yaWdpbjogY2hpbGRTZXJ2aWNlLmlkXG4gICAgICB9KSk7XG4gICAgfSkuc3RhcnQoKTtcbiAgICByZXR1cm4gYWN0b3I7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnNwYXduQmVoYXZpb3IgPSBmdW5jdGlvbiAoYmVoYXZpb3IsIGlkKSB7XG4gICAgdmFyIGFjdG9yUmVmID0gc3Bhd25CZWhhdmlvcihiZWhhdmlvciwge1xuICAgICAgaWQ6IGlkLFxuICAgICAgcGFyZW50OiB0aGlzXG4gICAgfSk7XG4gICAgdGhpcy5jaGlsZHJlbi5zZXQoaWQsIGFjdG9yUmVmKTtcbiAgICByZXR1cm4gYWN0b3JSZWY7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnNwYXduUHJvbWlzZSA9IGZ1bmN0aW9uIChwcm9taXNlLCBpZCkge1xuICAgIHZhciBfYTtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgY2FuY2VsZWQgPSBmYWxzZTtcbiAgICB2YXIgcmVzb2x2ZWREYXRhO1xuICAgIHByb21pc2UudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGlmICghY2FuY2VsZWQpIHtcbiAgICAgICAgcmVzb2x2ZWREYXRhID0gcmVzcG9uc2U7XG5cbiAgICAgICAgX3RoaXMucmVtb3ZlQ2hpbGQoaWQpO1xuXG4gICAgICAgIF90aGlzLnNlbmQodG9TQ1hNTEV2ZW50KGRvbmVJbnZva2UoaWQsIHJlc3BvbnNlKSwge1xuICAgICAgICAgIG9yaWdpbjogaWRcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgIH0sIGZ1bmN0aW9uIChlcnJvckRhdGEpIHtcbiAgICAgIGlmICghY2FuY2VsZWQpIHtcbiAgICAgICAgX3RoaXMucmVtb3ZlQ2hpbGQoaWQpO1xuXG4gICAgICAgIHZhciBlcnJvckV2ZW50ID0gZXJyb3IoaWQsIGVycm9yRGF0YSk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBTZW5kIFwiZXJyb3IucGxhdGZvcm0uaWRcIiB0byB0aGlzIChwYXJlbnQpLlxuICAgICAgICAgIF90aGlzLnNlbmQodG9TQ1hNTEV2ZW50KGVycm9yRXZlbnQsIHtcbiAgICAgICAgICAgIG9yaWdpbjogaWRcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgcmVwb3J0VW5oYW5kbGVkRXhjZXB0aW9uT25JbnZvY2F0aW9uKGVycm9yRGF0YSwgZXJyb3IsIGlkKTtcblxuICAgICAgICAgIGlmIChfdGhpcy5kZXZUb29scykge1xuICAgICAgICAgICAgX3RoaXMuZGV2VG9vbHMuc2VuZChlcnJvckV2ZW50LCBfdGhpcy5zdGF0ZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKF90aGlzLm1hY2hpbmUuc3RyaWN0KSB7XG4gICAgICAgICAgICAvLyBpdCB3b3VsZCBiZSBiZXR0ZXIgdG8gYWx3YXlzIHN0b3AgdGhlIHN0YXRlIG1hY2hpbmUgaWYgdW5oYW5kbGVkXG4gICAgICAgICAgICAvLyBleGNlcHRpb24vcHJvbWlzZSByZWplY3Rpb24gaGFwcGVucyBidXQgYmVjYXVzZSB3ZSBkb24ndCB3YW50IHRvXG4gICAgICAgICAgICAvLyBicmVhayBleGlzdGluZyBjb2RlIHNvIGVuZm9yY2UgaXQgb24gc3RyaWN0IG1vZGUgb25seSBlc3BlY2lhbGx5IHNvXG4gICAgICAgICAgICAvLyBiZWNhdXNlIGRvY3VtZW50YXRpb24gc2F5cyB0aGF0IG9uRXJyb3IgaXMgb3B0aW9uYWxcbiAgICAgICAgICAgIF90aGlzLnN0b3AoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICB2YXIgYWN0b3IgPSAoX2EgPSB7XG4gICAgICBpZDogaWQsXG4gICAgICBzZW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgICB9LFxuICAgICAgc3Vic2NyaWJlOiBmdW5jdGlvbiAobmV4dCwgaGFuZGxlRXJyb3IsIGNvbXBsZXRlKSB7XG4gICAgICAgIHZhciBvYnNlcnZlciA9IHRvT2JzZXJ2ZXIobmV4dCwgaGFuZGxlRXJyb3IsIGNvbXBsZXRlKTtcbiAgICAgICAgdmFyIHVuc3Vic2NyaWJlZCA9IGZhbHNlO1xuICAgICAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgaWYgKHVuc3Vic2NyaWJlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG9ic2VydmVyLm5leHQocmVzcG9uc2UpO1xuXG4gICAgICAgICAgaWYgKHVuc3Vic2NyaWJlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICBpZiAodW5zdWJzY3JpYmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB1bnN1YnNjcmliZWQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICBzdG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNhbmNlbGVkID0gdHJ1ZTtcbiAgICAgIH0sXG4gICAgICB0b0pTT046IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpZDogaWRcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICBnZXRTbmFwc2hvdDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZWREYXRhO1xuICAgICAgfVxuICAgIH0sIF9hW3N5bWJvbE9ic2VydmFibGVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSwgX2EpO1xuICAgIHRoaXMuY2hpbGRyZW4uc2V0KGlkLCBhY3Rvcik7XG4gICAgcmV0dXJuIGFjdG9yO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5zcGF3bkNhbGxiYWNrID0gZnVuY3Rpb24gKGNhbGxiYWNrLCBpZCkge1xuICAgIHZhciBfYTtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgY2FuY2VsZWQgPSBmYWxzZTtcbiAgICB2YXIgcmVjZWl2ZXJzID0gbmV3IFNldCgpO1xuICAgIHZhciBsaXN0ZW5lcnMgPSBuZXcgU2V0KCk7XG4gICAgdmFyIGVtaXR0ZWQ7XG5cbiAgICB2YXIgcmVjZWl2ZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICBlbWl0dGVkID0gZTtcbiAgICAgIGxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgICAgICByZXR1cm4gbGlzdGVuZXIoZSk7XG4gICAgICB9KTtcblxuICAgICAgaWYgKGNhbmNlbGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgX3RoaXMuc2VuZCh0b1NDWE1MRXZlbnQoZSwge1xuICAgICAgICBvcmlnaW46IGlkXG4gICAgICB9KSk7XG4gICAgfTtcblxuICAgIHZhciBjYWxsYmFja1N0b3A7XG5cbiAgICB0cnkge1xuICAgICAgY2FsbGJhY2tTdG9wID0gY2FsbGJhY2socmVjZWl2ZSwgZnVuY3Rpb24gKG5ld0xpc3RlbmVyKSB7XG4gICAgICAgIHJlY2VpdmVycy5hZGQobmV3TGlzdGVuZXIpO1xuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLnNlbmQoZXJyb3IoaWQsIGVycikpO1xuICAgIH1cblxuICAgIGlmIChpc1Byb21pc2VMaWtlKGNhbGxiYWNrU3RvcCkpIHtcbiAgICAgIC8vIGl0IHR1cm5lZCBvdXQgdG8gYmUgYW4gYXN5bmMgZnVuY3Rpb24sIGNhbid0IHJlbGlhYmx5IGNoZWNrIHRoaXMgYmVmb3JlIGNhbGxpbmcgYGNhbGxiYWNrYFxuICAgICAgLy8gYmVjYXVzZSB0cmFuc3BpbGVkIGFzeW5jIGZ1bmN0aW9ucyBhcmUgbm90IHJlY29nbml6YWJsZVxuICAgICAgcmV0dXJuIHRoaXMuc3Bhd25Qcm9taXNlKGNhbGxiYWNrU3RvcCwgaWQpO1xuICAgIH1cblxuICAgIHZhciBhY3RvciA9IChfYSA9IHtcbiAgICAgIGlkOiBpZCxcbiAgICAgIHNlbmQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICByZXR1cm4gcmVjZWl2ZXJzLmZvckVhY2goZnVuY3Rpb24gKHJlY2VpdmVyKSB7XG4gICAgICAgICAgcmV0dXJuIHJlY2VpdmVyKGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgc3Vic2NyaWJlOiBmdW5jdGlvbiAobmV4dCkge1xuICAgICAgICB2YXIgb2JzZXJ2ZXIgPSB0b09ic2VydmVyKG5leHQpO1xuICAgICAgICBsaXN0ZW5lcnMuYWRkKG9ic2VydmVyLm5leHQpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsaXN0ZW5lcnMuZGVsZXRlKG9ic2VydmVyLm5leHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICBzdG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNhbmNlbGVkID0gdHJ1ZTtcblxuICAgICAgICBpZiAoaXNGdW5jdGlvbihjYWxsYmFja1N0b3ApKSB7XG4gICAgICAgICAgY2FsbGJhY2tTdG9wKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB0b0pTT046IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpZDogaWRcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICBnZXRTbmFwc2hvdDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZW1pdHRlZDtcbiAgICAgIH1cbiAgICB9LCBfYVtzeW1ib2xPYnNlcnZhYmxlXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sIF9hKTtcbiAgICB0aGlzLmNoaWxkcmVuLnNldChpZCwgYWN0b3IpO1xuICAgIHJldHVybiBhY3RvcjtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc3Bhd25PYnNlcnZhYmxlID0gZnVuY3Rpb24gKHNvdXJjZSwgaWQpIHtcbiAgICB2YXIgX2E7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIGVtaXR0ZWQ7XG4gICAgdmFyIHN1YnNjcmlwdGlvbiA9IHNvdXJjZS5zdWJzY3JpYmUoZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICBlbWl0dGVkID0gdmFsdWU7XG5cbiAgICAgIF90aGlzLnNlbmQodG9TQ1hNTEV2ZW50KHZhbHVlLCB7XG4gICAgICAgIG9yaWdpbjogaWRcbiAgICAgIH0pKTtcbiAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICBfdGhpcy5yZW1vdmVDaGlsZChpZCk7XG5cbiAgICAgIF90aGlzLnNlbmQodG9TQ1hNTEV2ZW50KGVycm9yKGlkLCBlcnIpLCB7XG4gICAgICAgIG9yaWdpbjogaWRcbiAgICAgIH0pKTtcbiAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICBfdGhpcy5yZW1vdmVDaGlsZChpZCk7XG5cbiAgICAgIF90aGlzLnNlbmQodG9TQ1hNTEV2ZW50KGRvbmVJbnZva2UoaWQpLCB7XG4gICAgICAgIG9yaWdpbjogaWRcbiAgICAgIH0pKTtcbiAgICB9KTtcbiAgICB2YXIgYWN0b3IgPSAoX2EgPSB7XG4gICAgICBpZDogaWQsXG4gICAgICBzZW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgICB9LFxuICAgICAgc3Vic2NyaWJlOiBmdW5jdGlvbiAobmV4dCwgaGFuZGxlRXJyb3IsIGNvbXBsZXRlKSB7XG4gICAgICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5leHQsIGhhbmRsZUVycm9yLCBjb21wbGV0ZSk7XG4gICAgICB9LFxuICAgICAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9LFxuICAgICAgZ2V0U25hcHNob3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGVtaXR0ZWQ7XG4gICAgICB9LFxuICAgICAgdG9KU09OOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaWQ6IGlkXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSwgX2Fbc3ltYm9sT2JzZXJ2YWJsZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LCBfYSk7XG4gICAgdGhpcy5jaGlsZHJlbi5zZXQoaWQsIGFjdG9yKTtcbiAgICByZXR1cm4gYWN0b3I7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnNwYXduQWN0b3IgPSBmdW5jdGlvbiAoYWN0b3IsIG5hbWUpIHtcbiAgICB0aGlzLmNoaWxkcmVuLnNldChuYW1lLCBhY3Rvcik7XG4gICAgcmV0dXJuIGFjdG9yO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5zcGF3bkFjdGl2aXR5ID0gZnVuY3Rpb24gKGFjdGl2aXR5KSB7XG4gICAgdmFyIGltcGxlbWVudGF0aW9uID0gdGhpcy5tYWNoaW5lLm9wdGlvbnMgJiYgdGhpcy5tYWNoaW5lLm9wdGlvbnMuYWN0aXZpdGllcyA/IHRoaXMubWFjaGluZS5vcHRpb25zLmFjdGl2aXRpZXNbYWN0aXZpdHkudHlwZV0gOiB1bmRlZmluZWQ7XG5cbiAgICBpZiAoIWltcGxlbWVudGF0aW9uKSB7XG4gICAgICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICAgICAgd2FybihmYWxzZSwgXCJObyBpbXBsZW1lbnRhdGlvbiBmb3VuZCBmb3IgYWN0aXZpdHkgJ1wiLmNvbmNhdChhY3Rpdml0eS50eXBlLCBcIidcIikpO1xuICAgICAgfSAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tY29uc29sZVxuXG5cbiAgICAgIHJldHVybjtcbiAgICB9IC8vIFN0YXJ0IGltcGxlbWVudGF0aW9uXG5cblxuICAgIHZhciBkaXNwb3NlID0gaW1wbGVtZW50YXRpb24odGhpcy5zdGF0ZS5jb250ZXh0LCBhY3Rpdml0eSk7XG4gICAgdGhpcy5zcGF3bkVmZmVjdChhY3Rpdml0eS5pZCwgZGlzcG9zZSk7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnNwYXduRWZmZWN0ID0gZnVuY3Rpb24gKGlkLCBkaXNwb3NlKSB7XG4gICAgdmFyIF9hO1xuXG4gICAgdGhpcy5jaGlsZHJlbi5zZXQoaWQsIChfYSA9IHtcbiAgICAgIGlkOiBpZCxcbiAgICAgIHNlbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICAgIH0sXG4gICAgICBzdWJzY3JpYmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgc3RvcDogZGlzcG9zZSB8fCB1bmRlZmluZWQsXG4gICAgICBnZXRTbmFwc2hvdDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfSxcbiAgICAgIHRvSlNPTjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlkOiBpZFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0sIF9hW3N5bWJvbE9ic2VydmFibGVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSwgX2EpKTtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuYXR0YWNoRGV2ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBnbG9iYWwgPSBnZXRHbG9iYWwoKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuZGV2VG9vbHMgJiYgZ2xvYmFsKSB7XG4gICAgICBpZiAoZ2xvYmFsLl9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18pIHtcbiAgICAgICAgdmFyIGRldlRvb2xzT3B0aW9ucyA9IHR5cGVvZiB0aGlzLm9wdGlvbnMuZGV2VG9vbHMgPT09ICdvYmplY3QnID8gdGhpcy5vcHRpb25zLmRldlRvb2xzIDogdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLmRldlRvb2xzID0gZ2xvYmFsLl9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18uY29ubmVjdChfX2Fzc2lnbihfX2Fzc2lnbih7XG4gICAgICAgICAgbmFtZTogdGhpcy5pZCxcbiAgICAgICAgICBhdXRvUGF1c2U6IHRydWUsXG4gICAgICAgICAgc3RhdGVTYW5pdGl6ZXI6IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdmFsdWU6IHN0YXRlLnZhbHVlLFxuICAgICAgICAgICAgICBjb250ZXh0OiBzdGF0ZS5jb250ZXh0LFxuICAgICAgICAgICAgICBhY3Rpb25zOiBzdGF0ZS5hY3Rpb25zXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgZGV2VG9vbHNPcHRpb25zKSwge1xuICAgICAgICAgIGZlYXR1cmVzOiBfX2Fzc2lnbih7XG4gICAgICAgICAgICBqdW1wOiBmYWxzZSxcbiAgICAgICAgICAgIHNraXA6IGZhbHNlXG4gICAgICAgICAgfSwgZGV2VG9vbHNPcHRpb25zID8gZGV2VG9vbHNPcHRpb25zLmZlYXR1cmVzIDogdW5kZWZpbmVkKVxuICAgICAgICB9KSwgdGhpcy5tYWNoaW5lKTtcbiAgICAgICAgdGhpcy5kZXZUb29scy5pbml0KHRoaXMuc3RhdGUpO1xuICAgICAgfSAvLyBhZGQgWFN0YXRlLXNwZWNpZmljIGRldiB0b29saW5nIGhvb2tcblxuXG4gICAgICByZWdpc3RlclNlcnZpY2UodGhpcyk7XG4gICAgfVxuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiB0aGlzLmlkXG4gICAgfTtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGVbc3ltYm9sT2JzZXJ2YWJsZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLmdldFNuYXBzaG90ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gSW50ZXJwcmV0ZXJTdGF0dXMuTm90U3RhcnRlZCkge1xuICAgICAgcmV0dXJuIHRoaXMuaW5pdGlhbFN0YXRlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcbiAgfTtcbiAgLyoqXHJcbiAgICogVGhlIGRlZmF1bHQgaW50ZXJwcmV0ZXIgb3B0aW9uczpcclxuICAgKlxyXG4gICAqIC0gYGNsb2NrYCB1c2VzIHRoZSBnbG9iYWwgYHNldFRpbWVvdXRgIGFuZCBgY2xlYXJUaW1lb3V0YCBmdW5jdGlvbnNcclxuICAgKiAtIGBsb2dnZXJgIHVzZXMgdGhlIGdsb2JhbCBgY29uc29sZS5sb2coKWAgbWV0aG9kXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5kZWZhdWx0T3B0aW9ucyA9IHtcbiAgICBleGVjdXRlOiB0cnVlLFxuICAgIGRlZmVyRXZlbnRzOiB0cnVlLFxuICAgIGNsb2NrOiB7XG4gICAgICBzZXRUaW1lb3V0OiBmdW5jdGlvbiAoZm4sIG1zKSB7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZuLCBtcyk7XG4gICAgICB9LFxuICAgICAgY2xlYXJUaW1lb3V0OiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChpZCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBsb2dnZXI6IC8qI19fUFVSRV9fKi9jb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpLFxuICAgIGRldlRvb2xzOiBmYWxzZVxuICB9O1xuICBJbnRlcnByZXRlci5pbnRlcnByZXQgPSBpbnRlcnByZXQ7XG4gIHJldHVybiBJbnRlcnByZXRlcjtcbn0oKTtcblxudmFyIHJlc29sdmVTcGF3bk9wdGlvbnMgPSBmdW5jdGlvbiAobmFtZU9yT3B0aW9ucykge1xuICBpZiAoaXNTdHJpbmcobmFtZU9yT3B0aW9ucykpIHtcbiAgICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIERFRkFVTFRfU1BBV05fT1BUSU9OUyksIHtcbiAgICAgIG5hbWU6IG5hbWVPck9wdGlvbnNcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbihfX2Fzc2lnbih7fSwgREVGQVVMVF9TUEFXTl9PUFRJT05TKSwge1xuICAgIG5hbWU6IHVuaXF1ZUlkKClcbiAgfSksIG5hbWVPck9wdGlvbnMpO1xufTtcblxuZnVuY3Rpb24gc3Bhd24oZW50aXR5LCBuYW1lT3JPcHRpb25zKSB7XG4gIHZhciByZXNvbHZlZE9wdGlvbnMgPSByZXNvbHZlU3Bhd25PcHRpb25zKG5hbWVPck9wdGlvbnMpO1xuICByZXR1cm4gY29uc3VtZShmdW5jdGlvbiAoc2VydmljZSkge1xuICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgdmFyIGlzTGF6eUVudGl0eSA9IGlzTWFjaGluZShlbnRpdHkpIHx8IGlzRnVuY3Rpb24oZW50aXR5KTtcbiAgICAgIHdhcm4oISFzZXJ2aWNlIHx8IGlzTGF6eUVudGl0eSwgXCJBdHRlbXB0ZWQgdG8gc3Bhd24gYW4gQWN0b3IgKElEOiBcXFwiXCIuY29uY2F0KGlzTWFjaGluZShlbnRpdHkpID8gZW50aXR5LmlkIDogJ3VuZGVmaW5lZCcsIFwiXFxcIikgb3V0c2lkZSBvZiBhIHNlcnZpY2UuIFRoaXMgd2lsbCBoYXZlIG5vIGVmZmVjdC5cIikpO1xuICAgIH1cblxuICAgIGlmIChzZXJ2aWNlKSB7XG4gICAgICByZXR1cm4gc2VydmljZS5zcGF3bihlbnRpdHksIHJlc29sdmVkT3B0aW9ucy5uYW1lLCByZXNvbHZlZE9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY3JlYXRlRGVmZXJyZWRBY3RvcihlbnRpdHksIHJlc29sdmVkT3B0aW9ucy5uYW1lKTtcbiAgICB9XG4gIH0pO1xufVxuLyoqXHJcbiAqIENyZWF0ZXMgYSBuZXcgSW50ZXJwcmV0ZXIgaW5zdGFuY2UgZm9yIHRoZSBnaXZlbiBtYWNoaW5lIHdpdGggdGhlIHByb3ZpZGVkIG9wdGlvbnMsIGlmIGFueS5cclxuICpcclxuICogQHBhcmFtIG1hY2hpbmUgVGhlIG1hY2hpbmUgdG8gaW50ZXJwcmV0XHJcbiAqIEBwYXJhbSBvcHRpb25zIEludGVycHJldGVyIG9wdGlvbnNcclxuICovXG5cbmZ1bmN0aW9uIGludGVycHJldChtYWNoaW5lLCBvcHRpb25zKSB7XG4gIHZhciBpbnRlcnByZXRlciA9IG5ldyBJbnRlcnByZXRlcihtYWNoaW5lLCBvcHRpb25zKTtcbiAgcmV0dXJuIGludGVycHJldGVyO1xufVxuXG5leHBvcnQgeyBJbnRlcnByZXRlciwgSW50ZXJwcmV0ZXJTdGF0dXMsIGludGVycHJldCwgc3Bhd24gfTtcbiIsImltcG9ydCB7IF9fYXNzaWduLCBfX3Jlc3QgfSBmcm9tICcuL192aXJ0dWFsL190c2xpYi5qcyc7XG5pbXBvcnQgJy4vdHlwZXMuanMnO1xuaW1wb3J0IHsgaW52b2tlIH0gZnJvbSAnLi9hY3Rpb25UeXBlcy5qcyc7XG5pbXBvcnQgJy4vdXRpbHMuanMnO1xuaW1wb3J0ICcuL2Vudmlyb25tZW50LmpzJztcblxuZnVuY3Rpb24gdG9JbnZva2VTb3VyY2Uoc3JjKSB7XG4gIGlmICh0eXBlb2Ygc3JjID09PSAnc3RyaW5nJykge1xuICAgIHZhciBzaW1wbGVTcmMgPSB7XG4gICAgICB0eXBlOiBzcmNcbiAgICB9O1xuXG4gICAgc2ltcGxlU3JjLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHNyYztcbiAgICB9OyAvLyB2NCBjb21wYXQgLSBUT0RPOiByZW1vdmUgaW4gdjVcblxuXG4gICAgcmV0dXJuIHNpbXBsZVNyYztcbiAgfVxuXG4gIHJldHVybiBzcmM7XG59XG5mdW5jdGlvbiB0b0ludm9rZURlZmluaXRpb24oaW52b2tlQ29uZmlnKSB7XG4gIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7XG4gICAgdHlwZTogaW52b2tlXG4gIH0sIGludm9rZUNvbmZpZyksIHtcbiAgICB0b0pTT046IGZ1bmN0aW9uICgpIHtcbiAgICAgIGludm9rZUNvbmZpZy5vbkRvbmU7XG4gICAgICAgICAgaW52b2tlQ29uZmlnLm9uRXJyb3I7XG4gICAgICAgICAgdmFyIGludm9rZURlZiA9IF9fcmVzdChpbnZva2VDb25maWcsIFtcIm9uRG9uZVwiLCBcIm9uRXJyb3JcIl0pO1xuXG4gICAgICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIGludm9rZURlZiksIHtcbiAgICAgICAgdHlwZTogaW52b2tlLFxuICAgICAgICBzcmM6IHRvSW52b2tlU291cmNlKGludm9rZUNvbmZpZy5zcmMpXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgeyB0b0ludm9rZURlZmluaXRpb24sIHRvSW52b2tlU291cmNlIH07XG4iLCJ2YXIgY2hpbGRyZW4gPSAvKiNfX1BVUkVfXyovbmV3IE1hcCgpO1xudmFyIHNlc3Npb25JZEluZGV4ID0gMDtcbnZhciByZWdpc3RyeSA9IHtcbiAgYm9va0lkOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFwieDpcIi5jb25jYXQoc2Vzc2lvbklkSW5kZXgrKyk7XG4gIH0sXG4gIHJlZ2lzdGVyOiBmdW5jdGlvbiAoaWQsIGFjdG9yKSB7XG4gICAgY2hpbGRyZW4uc2V0KGlkLCBhY3Rvcik7XG4gICAgcmV0dXJuIGlkO1xuICB9LFxuICBnZXQ6IGZ1bmN0aW9uIChpZCkge1xuICAgIHJldHVybiBjaGlsZHJlbi5nZXQoaWQpO1xuICB9LFxuICBmcmVlOiBmdW5jdGlvbiAoaWQpIHtcbiAgICBjaGlsZHJlbi5kZWxldGUoaWQpO1xuICB9XG59O1xuXG5leHBvcnQgeyByZWdpc3RyeSB9O1xuIiwiaW1wb3J0IHsgX19hc3NpZ24gfSBmcm9tICcuL192aXJ0dWFsL190c2xpYi5qcyc7XG5cbnZhciBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgZGVmZXJFdmVudHM6IGZhbHNlXG59O1xuXG52YXIgU2NoZWR1bGVyID1cbi8qI19fUFVSRV9fKi9cblxuLyoqIEBjbGFzcyAqL1xuZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBTY2hlZHVsZXIob3B0aW9ucykge1xuICAgIHRoaXMucHJvY2Vzc2luZ0V2ZW50ID0gZmFsc2U7XG4gICAgdGhpcy5xdWV1ZSA9IFtdO1xuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICB0aGlzLm9wdGlvbnMgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgZGVmYXVsdE9wdGlvbnMpLCBvcHRpb25zKTtcbiAgfVxuXG4gIFNjaGVkdWxlci5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5kZWZlckV2ZW50cykge1xuICAgICAgICB0aGlzLnNjaGVkdWxlKGNhbGxiYWNrKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnByb2Nlc3MoY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHRoaXMuZmx1c2hFdmVudHMoKTtcbiAgfTtcblxuICBTY2hlZHVsZXIucHJvdG90eXBlLnNjaGVkdWxlID0gZnVuY3Rpb24gKHRhc2spIHtcbiAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZWQgfHwgdGhpcy5wcm9jZXNzaW5nRXZlbnQpIHtcbiAgICAgIHRoaXMucXVldWUucHVzaCh0YXNrKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5xdWV1ZS5sZW5ndGggIT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXZlbnQgcXVldWUgc2hvdWxkIGJlIGVtcHR5IHdoZW4gaXQgaXMgbm90IHByb2Nlc3NpbmcgZXZlbnRzJyk7XG4gICAgfVxuXG4gICAgdGhpcy5wcm9jZXNzKHRhc2spO1xuICAgIHRoaXMuZmx1c2hFdmVudHMoKTtcbiAgfTtcblxuICBTY2hlZHVsZXIucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucXVldWUgPSBbXTtcbiAgfTtcblxuICBTY2hlZHVsZXIucHJvdG90eXBlLmZsdXNoRXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBuZXh0Q2FsbGJhY2sgPSB0aGlzLnF1ZXVlLnNoaWZ0KCk7XG5cbiAgICB3aGlsZSAobmV4dENhbGxiYWNrKSB7XG4gICAgICB0aGlzLnByb2Nlc3MobmV4dENhbGxiYWNrKTtcbiAgICAgIG5leHRDYWxsYmFjayA9IHRoaXMucXVldWUuc2hpZnQoKTtcbiAgICB9XG4gIH07XG5cbiAgU2NoZWR1bGVyLnByb3RvdHlwZS5wcm9jZXNzID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5wcm9jZXNzaW5nRXZlbnQgPSB0cnVlO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gdGhlcmUgaXMgbm8gdXNlIHRvIGtlZXAgdGhlIGZ1dHVyZSBldmVudHNcbiAgICAgIC8vIGFzIHRoZSBzaXR1YXRpb24gaXMgbm90IGFueW1vcmUgdGhlIHNhbWVcbiAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgIHRocm93IGU7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMucHJvY2Vzc2luZ0V2ZW50ID0gZmFsc2U7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBTY2hlZHVsZXI7XG59KCk7XG5cbmV4cG9ydCB7IFNjaGVkdWxlciB9O1xuIiwiLyoqXHJcbiAqIE1haW50YWlucyBhIHN0YWNrIG9mIHRoZSBjdXJyZW50IHNlcnZpY2UgaW4gc2NvcGUuXHJcbiAqIFRoaXMgaXMgdXNlZCB0byBwcm92aWRlIHRoZSBjb3JyZWN0IHNlcnZpY2UgdG8gc3Bhd24oKS5cclxuICovXG52YXIgc2VydmljZVN0YWNrID0gW107XG52YXIgcHJvdmlkZSA9IGZ1bmN0aW9uIChzZXJ2aWNlLCBmbikge1xuICBzZXJ2aWNlU3RhY2sucHVzaChzZXJ2aWNlKTtcbiAgdmFyIHJlc3VsdCA9IGZuKHNlcnZpY2UpO1xuICBzZXJ2aWNlU3RhY2sucG9wKCk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xudmFyIGNvbnN1bWUgPSBmdW5jdGlvbiAoZm4pIHtcbiAgcmV0dXJuIGZuKHNlcnZpY2VTdGFja1tzZXJ2aWNlU3RhY2subGVuZ3RoIC0gMV0pO1xufTtcblxuZXhwb3J0IHsgY29uc3VtZSwgcHJvdmlkZSB9O1xuIiwiaW1wb3J0IHsgX192YWx1ZXMsIF9fc3ByZWFkQXJyYXksIF9fcmVhZCB9IGZyb20gJy4vX3ZpcnR1YWwvX3RzbGliLmpzJztcbmltcG9ydCB7IGZsYXR0ZW4gfSBmcm9tICcuL3V0aWxzLmpzJztcblxudmFyIGlzTGVhZk5vZGUgPSBmdW5jdGlvbiAoc3RhdGVOb2RlKSB7XG4gIHJldHVybiBzdGF0ZU5vZGUudHlwZSA9PT0gJ2F0b21pYycgfHwgc3RhdGVOb2RlLnR5cGUgPT09ICdmaW5hbCc7XG59O1xuZnVuY3Rpb24gZ2V0QWxsQ2hpbGRyZW4oc3RhdGVOb2RlKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhzdGF0ZU5vZGUuc3RhdGVzKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBzdGF0ZU5vZGUuc3RhdGVzW2tleV07XG4gIH0pO1xufVxuZnVuY3Rpb24gZ2V0Q2hpbGRyZW4oc3RhdGVOb2RlKSB7XG4gIHJldHVybiBnZXRBbGxDaGlsZHJlbihzdGF0ZU5vZGUpLmZpbHRlcihmdW5jdGlvbiAoc24pIHtcbiAgICByZXR1cm4gc24udHlwZSAhPT0gJ2hpc3RvcnknO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGdldEFsbFN0YXRlTm9kZXMoc3RhdGVOb2RlKSB7XG4gIHZhciBzdGF0ZU5vZGVzID0gW3N0YXRlTm9kZV07XG5cbiAgaWYgKGlzTGVhZk5vZGUoc3RhdGVOb2RlKSkge1xuICAgIHJldHVybiBzdGF0ZU5vZGVzO1xuICB9XG5cbiAgcmV0dXJuIHN0YXRlTm9kZXMuY29uY2F0KGZsYXR0ZW4oZ2V0Q2hpbGRyZW4oc3RhdGVOb2RlKS5tYXAoZ2V0QWxsU3RhdGVOb2RlcykpKTtcbn1cbmZ1bmN0aW9uIGdldENvbmZpZ3VyYXRpb24ocHJldlN0YXRlTm9kZXMsIHN0YXRlTm9kZXMpIHtcbiAgdmFyIGVfMSwgX2EsIGVfMiwgX2IsIGVfMywgX2MsIGVfNCwgX2Q7XG5cbiAgdmFyIHByZXZDb25maWd1cmF0aW9uID0gbmV3IFNldChwcmV2U3RhdGVOb2Rlcyk7XG4gIHZhciBwcmV2QWRqTGlzdCA9IGdldEFkakxpc3QocHJldkNvbmZpZ3VyYXRpb24pO1xuICB2YXIgY29uZmlndXJhdGlvbiA9IG5ldyBTZXQoc3RhdGVOb2Rlcyk7XG5cbiAgdHJ5IHtcbiAgICAvLyBhZGQgYWxsIGFuY2VzdG9yc1xuICAgIGZvciAodmFyIGNvbmZpZ3VyYXRpb25fMSA9IF9fdmFsdWVzKGNvbmZpZ3VyYXRpb24pLCBjb25maWd1cmF0aW9uXzFfMSA9IGNvbmZpZ3VyYXRpb25fMS5uZXh0KCk7ICFjb25maWd1cmF0aW9uXzFfMS5kb25lOyBjb25maWd1cmF0aW9uXzFfMSA9IGNvbmZpZ3VyYXRpb25fMS5uZXh0KCkpIHtcbiAgICAgIHZhciBzID0gY29uZmlndXJhdGlvbl8xXzEudmFsdWU7XG4gICAgICB2YXIgbSA9IHMucGFyZW50O1xuXG4gICAgICB3aGlsZSAobSAmJiAhY29uZmlndXJhdGlvbi5oYXMobSkpIHtcbiAgICAgICAgY29uZmlndXJhdGlvbi5hZGQobSk7XG4gICAgICAgIG0gPSBtLnBhcmVudDtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVfMV8xKSB7XG4gICAgZV8xID0ge1xuICAgICAgZXJyb3I6IGVfMV8xXG4gICAgfTtcbiAgfSBmaW5hbGx5IHtcbiAgICB0cnkge1xuICAgICAgaWYgKGNvbmZpZ3VyYXRpb25fMV8xICYmICFjb25maWd1cmF0aW9uXzFfMS5kb25lICYmIChfYSA9IGNvbmZpZ3VyYXRpb25fMS5yZXR1cm4pKSBfYS5jYWxsKGNvbmZpZ3VyYXRpb25fMSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjtcbiAgICB9XG4gIH1cblxuICB2YXIgYWRqTGlzdCA9IGdldEFkakxpc3QoY29uZmlndXJhdGlvbik7XG5cbiAgdHJ5IHtcbiAgICAvLyBhZGQgZGVzY2VuZGFudHNcbiAgICBmb3IgKHZhciBjb25maWd1cmF0aW9uXzIgPSBfX3ZhbHVlcyhjb25maWd1cmF0aW9uKSwgY29uZmlndXJhdGlvbl8yXzEgPSBjb25maWd1cmF0aW9uXzIubmV4dCgpOyAhY29uZmlndXJhdGlvbl8yXzEuZG9uZTsgY29uZmlndXJhdGlvbl8yXzEgPSBjb25maWd1cmF0aW9uXzIubmV4dCgpKSB7XG4gICAgICB2YXIgcyA9IGNvbmZpZ3VyYXRpb25fMl8xLnZhbHVlOyAvLyBpZiBwcmV2aW91c2x5IGFjdGl2ZSwgYWRkIGV4aXN0aW5nIGNoaWxkIG5vZGVzXG5cbiAgICAgIGlmIChzLnR5cGUgPT09ICdjb21wb3VuZCcgJiYgKCFhZGpMaXN0LmdldChzKSB8fCAhYWRqTGlzdC5nZXQocykubGVuZ3RoKSkge1xuICAgICAgICBpZiAocHJldkFkakxpc3QuZ2V0KHMpKSB7XG4gICAgICAgICAgcHJldkFkakxpc3QuZ2V0KHMpLmZvckVhY2goZnVuY3Rpb24gKHNuKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uZmlndXJhdGlvbi5hZGQoc24pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHMuaW5pdGlhbFN0YXRlTm9kZXMuZm9yRWFjaChmdW5jdGlvbiAoc24pIHtcbiAgICAgICAgICAgIHJldHVybiBjb25maWd1cmF0aW9uLmFkZChzbik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChzLnR5cGUgPT09ICdwYXJhbGxlbCcpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yICh2YXIgX2UgPSAoZV8zID0gdm9pZCAwLCBfX3ZhbHVlcyhnZXRDaGlsZHJlbihzKSkpLCBfZiA9IF9lLm5leHQoKTsgIV9mLmRvbmU7IF9mID0gX2UubmV4dCgpKSB7XG4gICAgICAgICAgICAgIHZhciBjaGlsZCA9IF9mLnZhbHVlO1xuXG4gICAgICAgICAgICAgIGlmICghY29uZmlndXJhdGlvbi5oYXMoY2hpbGQpKSB7XG4gICAgICAgICAgICAgICAgY29uZmlndXJhdGlvbi5hZGQoY2hpbGQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHByZXZBZGpMaXN0LmdldChjaGlsZCkpIHtcbiAgICAgICAgICAgICAgICAgIHByZXZBZGpMaXN0LmdldChjaGlsZCkuZm9yRWFjaChmdW5jdGlvbiAoc24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbmZpZ3VyYXRpb24uYWRkKHNuKTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBjaGlsZC5pbml0aWFsU3RhdGVOb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChzbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29uZmlndXJhdGlvbi5hZGQoc24pO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZV8zXzEpIHtcbiAgICAgICAgICAgIGVfMyA9IHtcbiAgICAgICAgICAgICAgZXJyb3I6IGVfM18xXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBpZiAoX2YgJiYgIV9mLmRvbmUgJiYgKF9jID0gX2UucmV0dXJuKSkgX2MuY2FsbChfZSk7XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICBpZiAoZV8zKSB0aHJvdyBlXzMuZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlXzJfMSkge1xuICAgIGVfMiA9IHtcbiAgICAgIGVycm9yOiBlXzJfMVxuICAgIH07XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChjb25maWd1cmF0aW9uXzJfMSAmJiAhY29uZmlndXJhdGlvbl8yXzEuZG9uZSAmJiAoX2IgPSBjb25maWd1cmF0aW9uXzIucmV0dXJuKSkgX2IuY2FsbChjb25maWd1cmF0aW9uXzIpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAoZV8yKSB0aHJvdyBlXzIuZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgdHJ5IHtcbiAgICAvLyBhZGQgYWxsIGFuY2VzdG9yc1xuICAgIGZvciAodmFyIGNvbmZpZ3VyYXRpb25fMyA9IF9fdmFsdWVzKGNvbmZpZ3VyYXRpb24pLCBjb25maWd1cmF0aW9uXzNfMSA9IGNvbmZpZ3VyYXRpb25fMy5uZXh0KCk7ICFjb25maWd1cmF0aW9uXzNfMS5kb25lOyBjb25maWd1cmF0aW9uXzNfMSA9IGNvbmZpZ3VyYXRpb25fMy5uZXh0KCkpIHtcbiAgICAgIHZhciBzID0gY29uZmlndXJhdGlvbl8zXzEudmFsdWU7XG4gICAgICB2YXIgbSA9IHMucGFyZW50O1xuXG4gICAgICB3aGlsZSAobSAmJiAhY29uZmlndXJhdGlvbi5oYXMobSkpIHtcbiAgICAgICAgY29uZmlndXJhdGlvbi5hZGQobSk7XG4gICAgICAgIG0gPSBtLnBhcmVudDtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVfNF8xKSB7XG4gICAgZV80ID0ge1xuICAgICAgZXJyb3I6IGVfNF8xXG4gICAgfTtcbiAgfSBmaW5hbGx5IHtcbiAgICB0cnkge1xuICAgICAgaWYgKGNvbmZpZ3VyYXRpb25fM18xICYmICFjb25maWd1cmF0aW9uXzNfMS5kb25lICYmIChfZCA9IGNvbmZpZ3VyYXRpb25fMy5yZXR1cm4pKSBfZC5jYWxsKGNvbmZpZ3VyYXRpb25fMyk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChlXzQpIHRocm93IGVfNC5lcnJvcjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY29uZmlndXJhdGlvbjtcbn1cblxuZnVuY3Rpb24gZ2V0VmFsdWVGcm9tQWRqKGJhc2VOb2RlLCBhZGpMaXN0KSB7XG4gIHZhciBjaGlsZFN0YXRlTm9kZXMgPSBhZGpMaXN0LmdldChiYXNlTm9kZSk7XG5cbiAgaWYgKCFjaGlsZFN0YXRlTm9kZXMpIHtcbiAgICByZXR1cm4ge307IC8vIHRvZG86IGZpeD9cbiAgfVxuXG4gIGlmIChiYXNlTm9kZS50eXBlID09PSAnY29tcG91bmQnKSB7XG4gICAgdmFyIGNoaWxkU3RhdGVOb2RlID0gY2hpbGRTdGF0ZU5vZGVzWzBdO1xuXG4gICAgaWYgKGNoaWxkU3RhdGVOb2RlKSB7XG4gICAgICBpZiAoaXNMZWFmTm9kZShjaGlsZFN0YXRlTm9kZSkpIHtcbiAgICAgICAgcmV0dXJuIGNoaWxkU3RhdGVOb2RlLmtleTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBzdGF0ZVZhbHVlID0ge307XG4gIGNoaWxkU3RhdGVOb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChjc24pIHtcbiAgICBzdGF0ZVZhbHVlW2Nzbi5rZXldID0gZ2V0VmFsdWVGcm9tQWRqKGNzbiwgYWRqTGlzdCk7XG4gIH0pO1xuICByZXR1cm4gc3RhdGVWYWx1ZTtcbn1cblxuZnVuY3Rpb24gZ2V0QWRqTGlzdChjb25maWd1cmF0aW9uKSB7XG4gIHZhciBlXzUsIF9hO1xuXG4gIHZhciBhZGpMaXN0ID0gbmV3IE1hcCgpO1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgY29uZmlndXJhdGlvbl80ID0gX192YWx1ZXMoY29uZmlndXJhdGlvbiksIGNvbmZpZ3VyYXRpb25fNF8xID0gY29uZmlndXJhdGlvbl80Lm5leHQoKTsgIWNvbmZpZ3VyYXRpb25fNF8xLmRvbmU7IGNvbmZpZ3VyYXRpb25fNF8xID0gY29uZmlndXJhdGlvbl80Lm5leHQoKSkge1xuICAgICAgdmFyIHMgPSBjb25maWd1cmF0aW9uXzRfMS52YWx1ZTtcblxuICAgICAgaWYgKCFhZGpMaXN0LmhhcyhzKSkge1xuICAgICAgICBhZGpMaXN0LnNldChzLCBbXSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzLnBhcmVudCkge1xuICAgICAgICBpZiAoIWFkakxpc3QuaGFzKHMucGFyZW50KSkge1xuICAgICAgICAgIGFkakxpc3Quc2V0KHMucGFyZW50LCBbXSk7XG4gICAgICAgIH1cblxuICAgICAgICBhZGpMaXN0LmdldChzLnBhcmVudCkucHVzaChzKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVfNV8xKSB7XG4gICAgZV81ID0ge1xuICAgICAgZXJyb3I6IGVfNV8xXG4gICAgfTtcbiAgfSBmaW5hbGx5IHtcbiAgICB0cnkge1xuICAgICAgaWYgKGNvbmZpZ3VyYXRpb25fNF8xICYmICFjb25maWd1cmF0aW9uXzRfMS5kb25lICYmIChfYSA9IGNvbmZpZ3VyYXRpb25fNC5yZXR1cm4pKSBfYS5jYWxsKGNvbmZpZ3VyYXRpb25fNCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChlXzUpIHRocm93IGVfNS5lcnJvcjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYWRqTGlzdDtcbn1cbmZ1bmN0aW9uIGdldFZhbHVlKHJvb3ROb2RlLCBjb25maWd1cmF0aW9uKSB7XG4gIHZhciBjb25maWcgPSBnZXRDb25maWd1cmF0aW9uKFtyb290Tm9kZV0sIGNvbmZpZ3VyYXRpb24pO1xuICByZXR1cm4gZ2V0VmFsdWVGcm9tQWRqKHJvb3ROb2RlLCBnZXRBZGpMaXN0KGNvbmZpZykpO1xufVxuZnVuY3Rpb24gaGFzKGl0ZXJhYmxlLCBpdGVtKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGl0ZXJhYmxlKSkge1xuICAgIHJldHVybiBpdGVyYWJsZS5zb21lKGZ1bmN0aW9uIChtZW1iZXIpIHtcbiAgICAgIHJldHVybiBtZW1iZXIgPT09IGl0ZW07XG4gICAgfSk7XG4gIH1cblxuICBpZiAoaXRlcmFibGUgaW5zdGFuY2VvZiBTZXQpIHtcbiAgICByZXR1cm4gaXRlcmFibGUuaGFzKGl0ZW0pO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlOyAvLyBUT0RPOiBmaXhcbn1cbmZ1bmN0aW9uIG5leHRFdmVudHMoY29uZmlndXJhdGlvbikge1xuICByZXR1cm4gX19zcHJlYWRBcnJheShbXSwgX19yZWFkKG5ldyBTZXQoZmxhdHRlbihfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoY29uZmlndXJhdGlvbi5tYXAoZnVuY3Rpb24gKHNuKSB7XG4gICAgcmV0dXJuIHNuLm93bkV2ZW50cztcbiAgfSkpLCBmYWxzZSkpKSksIGZhbHNlKTtcbn1cbmZ1bmN0aW9uIGlzSW5GaW5hbFN0YXRlKGNvbmZpZ3VyYXRpb24sIHN0YXRlTm9kZSkge1xuICBpZiAoc3RhdGVOb2RlLnR5cGUgPT09ICdjb21wb3VuZCcpIHtcbiAgICByZXR1cm4gZ2V0Q2hpbGRyZW4oc3RhdGVOb2RlKS5zb21lKGZ1bmN0aW9uIChzKSB7XG4gICAgICByZXR1cm4gcy50eXBlID09PSAnZmluYWwnICYmIGhhcyhjb25maWd1cmF0aW9uLCBzKTtcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChzdGF0ZU5vZGUudHlwZSA9PT0gJ3BhcmFsbGVsJykge1xuICAgIHJldHVybiBnZXRDaGlsZHJlbihzdGF0ZU5vZGUpLmV2ZXJ5KGZ1bmN0aW9uIChzbikge1xuICAgICAgcmV0dXJuIGlzSW5GaW5hbFN0YXRlKGNvbmZpZ3VyYXRpb24sIHNuKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cbmZ1bmN0aW9uIGdldE1ldGEoY29uZmlndXJhdGlvbikge1xuICBpZiAoY29uZmlndXJhdGlvbiA9PT0gdm9pZCAwKSB7XG4gICAgY29uZmlndXJhdGlvbiA9IFtdO1xuICB9XG5cbiAgcmV0dXJuIGNvbmZpZ3VyYXRpb24ucmVkdWNlKGZ1bmN0aW9uIChhY2MsIHN0YXRlTm9kZSkge1xuICAgIGlmIChzdGF0ZU5vZGUubWV0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBhY2Nbc3RhdGVOb2RlLmlkXSA9IHN0YXRlTm9kZS5tZXRhO1xuICAgIH1cblxuICAgIHJldHVybiBhY2M7XG4gIH0sIHt9KTtcbn1cbmZ1bmN0aW9uIGdldFRhZ3NGcm9tQ29uZmlndXJhdGlvbihjb25maWd1cmF0aW9uKSB7XG4gIHJldHVybiBuZXcgU2V0KGZsYXR0ZW4oY29uZmlndXJhdGlvbi5tYXAoZnVuY3Rpb24gKHNuKSB7XG4gICAgcmV0dXJuIHNuLnRhZ3M7XG4gIH0pKSk7XG59XG5cbmV4cG9ydCB7IGdldEFkakxpc3QsIGdldEFsbENoaWxkcmVuLCBnZXRBbGxTdGF0ZU5vZGVzLCBnZXRDaGlsZHJlbiwgZ2V0Q29uZmlndXJhdGlvbiwgZ2V0TWV0YSwgZ2V0VGFnc0Zyb21Db25maWd1cmF0aW9uLCBnZXRWYWx1ZSwgaGFzLCBpc0luRmluYWxTdGF0ZSwgaXNMZWFmTm9kZSwgbmV4dEV2ZW50cyB9O1xuIiwidmFyIEFjdGlvblR5cGVzO1xuXG4oZnVuY3Rpb24gKEFjdGlvblR5cGVzKSB7XG4gIEFjdGlvblR5cGVzW1wiU3RhcnRcIl0gPSBcInhzdGF0ZS5zdGFydFwiO1xuICBBY3Rpb25UeXBlc1tcIlN0b3BcIl0gPSBcInhzdGF0ZS5zdG9wXCI7XG4gIEFjdGlvblR5cGVzW1wiUmFpc2VcIl0gPSBcInhzdGF0ZS5yYWlzZVwiO1xuICBBY3Rpb25UeXBlc1tcIlNlbmRcIl0gPSBcInhzdGF0ZS5zZW5kXCI7XG4gIEFjdGlvblR5cGVzW1wiQ2FuY2VsXCJdID0gXCJ4c3RhdGUuY2FuY2VsXCI7XG4gIEFjdGlvblR5cGVzW1wiTnVsbEV2ZW50XCJdID0gXCJcIjtcbiAgQWN0aW9uVHlwZXNbXCJBc3NpZ25cIl0gPSBcInhzdGF0ZS5hc3NpZ25cIjtcbiAgQWN0aW9uVHlwZXNbXCJBZnRlclwiXSA9IFwieHN0YXRlLmFmdGVyXCI7XG4gIEFjdGlvblR5cGVzW1wiRG9uZVN0YXRlXCJdID0gXCJkb25lLnN0YXRlXCI7XG4gIEFjdGlvblR5cGVzW1wiRG9uZUludm9rZVwiXSA9IFwiZG9uZS5pbnZva2VcIjtcbiAgQWN0aW9uVHlwZXNbXCJMb2dcIl0gPSBcInhzdGF0ZS5sb2dcIjtcbiAgQWN0aW9uVHlwZXNbXCJJbml0XCJdID0gXCJ4c3RhdGUuaW5pdFwiO1xuICBBY3Rpb25UeXBlc1tcIkludm9rZVwiXSA9IFwieHN0YXRlLmludm9rZVwiO1xuICBBY3Rpb25UeXBlc1tcIkVycm9yRXhlY3V0aW9uXCJdID0gXCJlcnJvci5leGVjdXRpb25cIjtcbiAgQWN0aW9uVHlwZXNbXCJFcnJvckNvbW11bmljYXRpb25cIl0gPSBcImVycm9yLmNvbW11bmljYXRpb25cIjtcbiAgQWN0aW9uVHlwZXNbXCJFcnJvclBsYXRmb3JtXCJdID0gXCJlcnJvci5wbGF0Zm9ybVwiO1xuICBBY3Rpb25UeXBlc1tcIkVycm9yQ3VzdG9tXCJdID0gXCJ4c3RhdGUuZXJyb3JcIjtcbiAgQWN0aW9uVHlwZXNbXCJVcGRhdGVcIl0gPSBcInhzdGF0ZS51cGRhdGVcIjtcbiAgQWN0aW9uVHlwZXNbXCJQdXJlXCJdID0gXCJ4c3RhdGUucHVyZVwiO1xuICBBY3Rpb25UeXBlc1tcIkNob29zZVwiXSA9IFwieHN0YXRlLmNob29zZVwiO1xufSkoQWN0aW9uVHlwZXMgfHwgKEFjdGlvblR5cGVzID0ge30pKTtcblxudmFyIFNwZWNpYWxUYXJnZXRzO1xuXG4oZnVuY3Rpb24gKFNwZWNpYWxUYXJnZXRzKSB7XG4gIFNwZWNpYWxUYXJnZXRzW1wiUGFyZW50XCJdID0gXCIjX3BhcmVudFwiO1xuICBTcGVjaWFsVGFyZ2V0c1tcIkludGVybmFsXCJdID0gXCIjX2ludGVybmFsXCI7XG59KShTcGVjaWFsVGFyZ2V0cyB8fCAoU3BlY2lhbFRhcmdldHMgPSB7fSkpO1xuXG5leHBvcnQgeyBBY3Rpb25UeXBlcywgU3BlY2lhbFRhcmdldHMgfTtcbiIsImltcG9ydCB7IF9fdmFsdWVzLCBfX3NwcmVhZEFycmF5LCBfX3JlYWQsIF9fYXNzaWduIH0gZnJvbSAnLi9fdmlydHVhbC9fdHNsaWIuanMnO1xuaW1wb3J0IHsgU3BlY2lhbFRhcmdldHMgfSBmcm9tICcuL3R5cGVzLmpzJztcbmltcG9ydCB7IHJhaXNlLCBzZW5kIH0gZnJvbSAnLi9hY3Rpb25UeXBlcy5qcyc7XG5pbXBvcnQgeyBERUZBVUxUX0dVQVJEX1RZUEUsIFRBUkdFVExFU1NfS0VZLCBTVEFURV9ERUxJTUlURVIgfSBmcm9tICcuL2NvbnN0YW50cy5qcyc7XG5pbXBvcnQgeyBJU19QUk9EVUNUSU9OIH0gZnJvbSAnLi9lbnZpcm9ubWVudC5qcyc7XG5cbnZhciBfYTtcbmZ1bmN0aW9uIGtleXModmFsdWUpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHZhbHVlKTtcbn1cbmZ1bmN0aW9uIG1hdGNoZXNTdGF0ZShwYXJlbnRTdGF0ZUlkLCBjaGlsZFN0YXRlSWQsIGRlbGltaXRlcikge1xuICBpZiAoZGVsaW1pdGVyID09PSB2b2lkIDApIHtcbiAgICBkZWxpbWl0ZXIgPSBTVEFURV9ERUxJTUlURVI7XG4gIH1cblxuICB2YXIgcGFyZW50U3RhdGVWYWx1ZSA9IHRvU3RhdGVWYWx1ZShwYXJlbnRTdGF0ZUlkLCBkZWxpbWl0ZXIpO1xuICB2YXIgY2hpbGRTdGF0ZVZhbHVlID0gdG9TdGF0ZVZhbHVlKGNoaWxkU3RhdGVJZCwgZGVsaW1pdGVyKTtcblxuICBpZiAoaXNTdHJpbmcoY2hpbGRTdGF0ZVZhbHVlKSkge1xuICAgIGlmIChpc1N0cmluZyhwYXJlbnRTdGF0ZVZhbHVlKSkge1xuICAgICAgcmV0dXJuIGNoaWxkU3RhdGVWYWx1ZSA9PT0gcGFyZW50U3RhdGVWYWx1ZTtcbiAgICB9IC8vIFBhcmVudCBtb3JlIHNwZWNpZmljIHRoYW4gY2hpbGRcblxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKGlzU3RyaW5nKHBhcmVudFN0YXRlVmFsdWUpKSB7XG4gICAgcmV0dXJuIHBhcmVudFN0YXRlVmFsdWUgaW4gY2hpbGRTdGF0ZVZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIE9iamVjdC5rZXlzKHBhcmVudFN0YXRlVmFsdWUpLmV2ZXJ5KGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAoIShrZXkgaW4gY2hpbGRTdGF0ZVZhbHVlKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBtYXRjaGVzU3RhdGUocGFyZW50U3RhdGVWYWx1ZVtrZXldLCBjaGlsZFN0YXRlVmFsdWVba2V5XSk7XG4gIH0pO1xufVxuZnVuY3Rpb24gZ2V0RXZlbnRUeXBlKGV2ZW50KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGlzU3RyaW5nKGV2ZW50KSB8fCB0eXBlb2YgZXZlbnQgPT09ICdudW1iZXInID8gXCJcIi5jb25jYXQoZXZlbnQpIDogZXZlbnQudHlwZTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignRXZlbnRzIG11c3QgYmUgc3RyaW5ncyBvciBvYmplY3RzIHdpdGggYSBzdHJpbmcgZXZlbnQudHlwZSBwcm9wZXJ0eS4nKTtcbiAgfVxufVxuZnVuY3Rpb24gZ2V0QWN0aW9uVHlwZShhY3Rpb24pIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaXNTdHJpbmcoYWN0aW9uKSB8fCB0eXBlb2YgYWN0aW9uID09PSAnbnVtYmVyJyA/IFwiXCIuY29uY2F0KGFjdGlvbikgOiBpc0Z1bmN0aW9uKGFjdGlvbikgPyBhY3Rpb24ubmFtZSA6IGFjdGlvbi50eXBlO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdBY3Rpb25zIG11c3QgYmUgc3RyaW5ncyBvciBvYmplY3RzIHdpdGggYSBzdHJpbmcgYWN0aW9uLnR5cGUgcHJvcGVydHkuJyk7XG4gIH1cbn1cbmZ1bmN0aW9uIHRvU3RhdGVQYXRoKHN0YXRlSWQsIGRlbGltaXRlcikge1xuICB0cnkge1xuICAgIGlmIChpc0FycmF5KHN0YXRlSWQpKSB7XG4gICAgICByZXR1cm4gc3RhdGVJZDtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdGVJZC50b1N0cmluZygpLnNwbGl0KGRlbGltaXRlcik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCInXCIuY29uY2F0KHN0YXRlSWQsIFwiJyBpcyBub3QgYSB2YWxpZCBzdGF0ZSBwYXRoLlwiKSk7XG4gIH1cbn1cbmZ1bmN0aW9uIGlzU3RhdGVMaWtlKHN0YXRlKSB7XG4gIHJldHVybiB0eXBlb2Ygc3RhdGUgPT09ICdvYmplY3QnICYmICd2YWx1ZScgaW4gc3RhdGUgJiYgJ2NvbnRleHQnIGluIHN0YXRlICYmICdldmVudCcgaW4gc3RhdGUgJiYgJ19ldmVudCcgaW4gc3RhdGU7XG59XG5mdW5jdGlvbiB0b1N0YXRlVmFsdWUoc3RhdGVWYWx1ZSwgZGVsaW1pdGVyKSB7XG4gIGlmIChpc1N0YXRlTGlrZShzdGF0ZVZhbHVlKSkge1xuICAgIHJldHVybiBzdGF0ZVZhbHVlLnZhbHVlO1xuICB9XG5cbiAgaWYgKGlzQXJyYXkoc3RhdGVWYWx1ZSkpIHtcbiAgICByZXR1cm4gcGF0aFRvU3RhdGVWYWx1ZShzdGF0ZVZhbHVlKTtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygc3RhdGVWYWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gc3RhdGVWYWx1ZTtcbiAgfVxuXG4gIHZhciBzdGF0ZVBhdGggPSB0b1N0YXRlUGF0aChzdGF0ZVZhbHVlLCBkZWxpbWl0ZXIpO1xuICByZXR1cm4gcGF0aFRvU3RhdGVWYWx1ZShzdGF0ZVBhdGgpO1xufVxuZnVuY3Rpb24gcGF0aFRvU3RhdGVWYWx1ZShzdGF0ZVBhdGgpIHtcbiAgaWYgKHN0YXRlUGF0aC5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gc3RhdGVQYXRoWzBdO1xuICB9XG5cbiAgdmFyIHZhbHVlID0ge307XG4gIHZhciBtYXJrZXIgPSB2YWx1ZTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0YXRlUGF0aC5sZW5ndGggLSAxOyBpKyspIHtcbiAgICBpZiAoaSA9PT0gc3RhdGVQYXRoLmxlbmd0aCAtIDIpIHtcbiAgICAgIG1hcmtlcltzdGF0ZVBhdGhbaV1dID0gc3RhdGVQYXRoW2kgKyAxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWFya2VyW3N0YXRlUGF0aFtpXV0gPSB7fTtcbiAgICAgIG1hcmtlciA9IG1hcmtlcltzdGF0ZVBhdGhbaV1dO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIG1hcFZhbHVlcyhjb2xsZWN0aW9uLCBpdGVyYXRlZSkge1xuICB2YXIgcmVzdWx0ID0ge307XG4gIHZhciBjb2xsZWN0aW9uS2V5cyA9IE9iamVjdC5rZXlzKGNvbGxlY3Rpb24pO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY29sbGVjdGlvbktleXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIga2V5ID0gY29sbGVjdGlvbktleXNbaV07XG4gICAgcmVzdWx0W2tleV0gPSBpdGVyYXRlZShjb2xsZWN0aW9uW2tleV0sIGtleSwgY29sbGVjdGlvbiwgaSk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbWFwRmlsdGVyVmFsdWVzKGNvbGxlY3Rpb24sIGl0ZXJhdGVlLCBwcmVkaWNhdGUpIHtcbiAgdmFyIGVfMSwgX2E7XG5cbiAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgX2IgPSBfX3ZhbHVlcyhPYmplY3Qua2V5cyhjb2xsZWN0aW9uKSksIF9jID0gX2IubmV4dCgpOyAhX2MuZG9uZTsgX2MgPSBfYi5uZXh0KCkpIHtcbiAgICAgIHZhciBrZXkgPSBfYy52YWx1ZTtcbiAgICAgIHZhciBpdGVtID0gY29sbGVjdGlvbltrZXldO1xuXG4gICAgICBpZiAoIXByZWRpY2F0ZShpdGVtKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgcmVzdWx0W2tleV0gPSBpdGVyYXRlZShpdGVtLCBrZXksIGNvbGxlY3Rpb24pO1xuICAgIH1cbiAgfSBjYXRjaCAoZV8xXzEpIHtcbiAgICBlXzEgPSB7XG4gICAgICBlcnJvcjogZV8xXzFcbiAgICB9O1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoX2MgJiYgIV9jLmRvbmUgJiYgKF9hID0gX2IucmV0dXJuKSkgX2EuY2FsbChfYik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuLyoqXHJcbiAqIFJldHJpZXZlcyBhIHZhbHVlIGF0IHRoZSBnaXZlbiBwYXRoLlxyXG4gKiBAcGFyYW0gcHJvcHMgVGhlIGRlZXAgcGF0aCB0byB0aGUgcHJvcCBvZiB0aGUgZGVzaXJlZCB2YWx1ZVxyXG4gKi9cblxudmFyIHBhdGggPSBmdW5jdGlvbiAocHJvcHMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICB2YXIgZV8yLCBfYTtcblxuICAgIHZhciByZXN1bHQgPSBvYmplY3Q7XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgcHJvcHNfMSA9IF9fdmFsdWVzKHByb3BzKSwgcHJvcHNfMV8xID0gcHJvcHNfMS5uZXh0KCk7ICFwcm9wc18xXzEuZG9uZTsgcHJvcHNfMV8xID0gcHJvcHNfMS5uZXh0KCkpIHtcbiAgICAgICAgdmFyIHByb3AgPSBwcm9wc18xXzEudmFsdWU7XG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdFtwcm9wXTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzJfMSkge1xuICAgICAgZV8yID0ge1xuICAgICAgICBlcnJvcjogZV8yXzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChwcm9wc18xXzEgJiYgIXByb3BzXzFfMS5kb25lICYmIChfYSA9IHByb3BzXzEucmV0dXJuKSkgX2EuY2FsbChwcm9wc18xKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzIpIHRocm93IGVfMi5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufTtcbi8qKlxyXG4gKiBSZXRyaWV2ZXMgYSB2YWx1ZSBhdCB0aGUgZ2l2ZW4gcGF0aCB2aWEgdGhlIG5lc3RlZCBhY2Nlc3NvciBwcm9wLlxyXG4gKiBAcGFyYW0gcHJvcHMgVGhlIGRlZXAgcGF0aCB0byB0aGUgcHJvcCBvZiB0aGUgZGVzaXJlZCB2YWx1ZVxyXG4gKi9cblxuZnVuY3Rpb24gbmVzdGVkUGF0aChwcm9wcywgYWNjZXNzb3JQcm9wKSB7XG4gIHJldHVybiBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgdmFyIGVfMywgX2E7XG5cbiAgICB2YXIgcmVzdWx0ID0gb2JqZWN0O1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIHByb3BzXzIgPSBfX3ZhbHVlcyhwcm9wcyksIHByb3BzXzJfMSA9IHByb3BzXzIubmV4dCgpOyAhcHJvcHNfMl8xLmRvbmU7IHByb3BzXzJfMSA9IHByb3BzXzIubmV4dCgpKSB7XG4gICAgICAgIHZhciBwcm9wID0gcHJvcHNfMl8xLnZhbHVlO1xuICAgICAgICByZXN1bHQgPSByZXN1bHRbYWNjZXNzb3JQcm9wXVtwcm9wXTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzNfMSkge1xuICAgICAgZV8zID0ge1xuICAgICAgICBlcnJvcjogZV8zXzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChwcm9wc18yXzEgJiYgIXByb3BzXzJfMS5kb25lICYmIChfYSA9IHByb3BzXzIucmV0dXJuKSkgX2EuY2FsbChwcm9wc18yKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzMpIHRocm93IGVfMy5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuZnVuY3Rpb24gdG9TdGF0ZVBhdGhzKHN0YXRlVmFsdWUpIHtcbiAgaWYgKCFzdGF0ZVZhbHVlKSB7XG4gICAgcmV0dXJuIFtbXV07XG4gIH1cblxuICBpZiAoaXNTdHJpbmcoc3RhdGVWYWx1ZSkpIHtcbiAgICByZXR1cm4gW1tzdGF0ZVZhbHVlXV07XG4gIH1cblxuICB2YXIgcmVzdWx0ID0gZmxhdHRlbihPYmplY3Qua2V5cyhzdGF0ZVZhbHVlKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciBzdWJTdGF0ZVZhbHVlID0gc3RhdGVWYWx1ZVtrZXldO1xuXG4gICAgaWYgKHR5cGVvZiBzdWJTdGF0ZVZhbHVlICE9PSAnc3RyaW5nJyAmJiAoIXN1YlN0YXRlVmFsdWUgfHwgIU9iamVjdC5rZXlzKHN1YlN0YXRlVmFsdWUpLmxlbmd0aCkpIHtcbiAgICAgIHJldHVybiBbW2tleV1dO1xuICAgIH1cblxuICAgIHJldHVybiB0b1N0YXRlUGF0aHMoc3RhdGVWYWx1ZVtrZXldKS5tYXAoZnVuY3Rpb24gKHN1YlBhdGgpIHtcbiAgICAgIHJldHVybiBba2V5XS5jb25jYXQoc3ViUGF0aCk7XG4gICAgfSk7XG4gIH0pKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIHBhdGhzVG9TdGF0ZVZhbHVlKHBhdGhzKSB7XG4gIHZhciBlXzQsIF9hO1xuXG4gIHZhciByZXN1bHQgPSB7fTtcblxuICBpZiAocGF0aHMgJiYgcGF0aHMubGVuZ3RoID09PSAxICYmIHBhdGhzWzBdLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBwYXRoc1swXVswXTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgcGF0aHNfMSA9IF9fdmFsdWVzKHBhdGhzKSwgcGF0aHNfMV8xID0gcGF0aHNfMS5uZXh0KCk7ICFwYXRoc18xXzEuZG9uZTsgcGF0aHNfMV8xID0gcGF0aHNfMS5uZXh0KCkpIHtcbiAgICAgIHZhciBjdXJyZW50UGF0aCA9IHBhdGhzXzFfMS52YWx1ZTtcbiAgICAgIHZhciBtYXJrZXIgPSByZXN1bHQ7IC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpwcmVmZXItZm9yLW9mXG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3VycmVudFBhdGgubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHN1YlBhdGggPSBjdXJyZW50UGF0aFtpXTtcblxuICAgICAgICBpZiAoaSA9PT0gY3VycmVudFBhdGgubGVuZ3RoIC0gMikge1xuICAgICAgICAgIG1hcmtlcltzdWJQYXRoXSA9IGN1cnJlbnRQYXRoW2kgKyAxXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIG1hcmtlcltzdWJQYXRoXSA9IG1hcmtlcltzdWJQYXRoXSB8fCB7fTtcbiAgICAgICAgbWFya2VyID0gbWFya2VyW3N1YlBhdGhdO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZV80XzEpIHtcbiAgICBlXzQgPSB7XG4gICAgICBlcnJvcjogZV80XzFcbiAgICB9O1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAocGF0aHNfMV8xICYmICFwYXRoc18xXzEuZG9uZSAmJiAoX2EgPSBwYXRoc18xLnJldHVybikpIF9hLmNhbGwocGF0aHNfMSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChlXzQpIHRocm93IGVfNC5lcnJvcjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gZmxhdHRlbihhcnJheSkge1xuICB2YXIgX2E7XG5cbiAgcmV0dXJuIChfYSA9IFtdKS5jb25jYXQuYXBwbHkoX2EsIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChhcnJheSksIGZhbHNlKSk7XG59XG5mdW5jdGlvbiB0b0FycmF5U3RyaWN0KHZhbHVlKSB7XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiBbdmFsdWVdO1xufVxuZnVuY3Rpb24gdG9BcnJheSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHJldHVybiB0b0FycmF5U3RyaWN0KHZhbHVlKTtcbn1cbmZ1bmN0aW9uIG1hcENvbnRleHQobWFwcGVyLCBjb250ZXh0LCBfZXZlbnQpIHtcbiAgdmFyIGVfNSwgX2E7XG5cbiAgaWYgKGlzRnVuY3Rpb24obWFwcGVyKSkge1xuICAgIHJldHVybiBtYXBwZXIoY29udGV4dCwgX2V2ZW50LmRhdGEpO1xuICB9XG5cbiAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgX2IgPSBfX3ZhbHVlcyhPYmplY3Qua2V5cyhtYXBwZXIpKSwgX2MgPSBfYi5uZXh0KCk7ICFfYy5kb25lOyBfYyA9IF9iLm5leHQoKSkge1xuICAgICAgdmFyIGtleSA9IF9jLnZhbHVlO1xuICAgICAgdmFyIHN1Yk1hcHBlciA9IG1hcHBlcltrZXldO1xuXG4gICAgICBpZiAoaXNGdW5jdGlvbihzdWJNYXBwZXIpKSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gc3ViTWFwcGVyKGNvbnRleHQsIF9ldmVudC5kYXRhKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gc3ViTWFwcGVyO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZV81XzEpIHtcbiAgICBlXzUgPSB7XG4gICAgICBlcnJvcjogZV81XzFcbiAgICB9O1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoX2MgJiYgIV9jLmRvbmUgJiYgKF9hID0gX2IucmV0dXJuKSkgX2EuY2FsbChfYik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChlXzUpIHRocm93IGVfNS5lcnJvcjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gaXNCdWlsdEluRXZlbnQoZXZlbnRUeXBlKSB7XG4gIHJldHVybiAvXihkb25lfGVycm9yKVxcLi8udGVzdChldmVudFR5cGUpO1xufVxuZnVuY3Rpb24gaXNQcm9taXNlTGlrZSh2YWx1ZSkge1xuICBpZiAodmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gLy8gQ2hlY2sgaWYgc2hhcGUgbWF0Y2hlcyB0aGUgUHJvbWlzZS9BKyBzcGVjaWZpY2F0aW9uIGZvciBhIFwidGhlbmFibGVcIi5cblxuXG4gIGlmICh2YWx1ZSAhPT0gbnVsbCAmJiAoaXNGdW5jdGlvbih2YWx1ZSkgfHwgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JykgJiYgaXNGdW5jdGlvbih2YWx1ZS50aGVuKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gaXNCZWhhdmlvcih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT09IG51bGwgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiAndHJhbnNpdGlvbicgaW4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlLnRyYW5zaXRpb24gPT09ICdmdW5jdGlvbic7XG59XG5mdW5jdGlvbiBwYXJ0aXRpb24oaXRlbXMsIHByZWRpY2F0ZSkge1xuICB2YXIgZV82LCBfYTtcblxuICB2YXIgX2IgPSBfX3JlYWQoW1tdLCBbXV0sIDIpLFxuICAgICAgdHJ1dGh5ID0gX2JbMF0sXG4gICAgICBmYWxzeSA9IF9iWzFdO1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgaXRlbXNfMSA9IF9fdmFsdWVzKGl0ZW1zKSwgaXRlbXNfMV8xID0gaXRlbXNfMS5uZXh0KCk7ICFpdGVtc18xXzEuZG9uZTsgaXRlbXNfMV8xID0gaXRlbXNfMS5uZXh0KCkpIHtcbiAgICAgIHZhciBpdGVtID0gaXRlbXNfMV8xLnZhbHVlO1xuXG4gICAgICBpZiAocHJlZGljYXRlKGl0ZW0pKSB7XG4gICAgICAgIHRydXRoeS5wdXNoKGl0ZW0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmFsc3kucHVzaChpdGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVfNl8xKSB7XG4gICAgZV82ID0ge1xuICAgICAgZXJyb3I6IGVfNl8xXG4gICAgfTtcbiAgfSBmaW5hbGx5IHtcbiAgICB0cnkge1xuICAgICAgaWYgKGl0ZW1zXzFfMSAmJiAhaXRlbXNfMV8xLmRvbmUgJiYgKF9hID0gaXRlbXNfMS5yZXR1cm4pKSBfYS5jYWxsKGl0ZW1zXzEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAoZV82KSB0aHJvdyBlXzYuZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIFt0cnV0aHksIGZhbHN5XTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZUhpc3RvcnlTdGF0ZXMoaGlzdCwgc3RhdGVWYWx1ZSkge1xuICByZXR1cm4gbWFwVmFsdWVzKGhpc3Quc3RhdGVzLCBmdW5jdGlvbiAoc3ViSGlzdCwga2V5KSB7XG4gICAgaWYgKCFzdWJIaXN0KSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHZhciBzdWJTdGF0ZVZhbHVlID0gKGlzU3RyaW5nKHN0YXRlVmFsdWUpID8gdW5kZWZpbmVkIDogc3RhdGVWYWx1ZVtrZXldKSB8fCAoc3ViSGlzdCA/IHN1Ykhpc3QuY3VycmVudCA6IHVuZGVmaW5lZCk7XG5cbiAgICBpZiAoIXN1YlN0YXRlVmFsdWUpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGN1cnJlbnQ6IHN1YlN0YXRlVmFsdWUsXG4gICAgICBzdGF0ZXM6IHVwZGF0ZUhpc3RvcnlTdGF0ZXMoc3ViSGlzdCwgc3ViU3RhdGVWYWx1ZSlcbiAgICB9O1xuICB9KTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZUhpc3RvcnlWYWx1ZShoaXN0LCBzdGF0ZVZhbHVlKSB7XG4gIHJldHVybiB7XG4gICAgY3VycmVudDogc3RhdGVWYWx1ZSxcbiAgICBzdGF0ZXM6IHVwZGF0ZUhpc3RvcnlTdGF0ZXMoaGlzdCwgc3RhdGVWYWx1ZSlcbiAgfTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZUNvbnRleHQoY29udGV4dCwgX2V2ZW50LCBhc3NpZ25BY3Rpb25zLCBzdGF0ZSkge1xuICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICB3YXJuKCEhY29udGV4dCwgJ0F0dGVtcHRpbmcgdG8gdXBkYXRlIHVuZGVmaW5lZCBjb250ZXh0Jyk7XG4gIH1cblxuICB2YXIgdXBkYXRlZENvbnRleHQgPSBjb250ZXh0ID8gYXNzaWduQWN0aW9ucy5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgYXNzaWduQWN0aW9uKSB7XG4gICAgdmFyIGVfNywgX2E7XG5cbiAgICB2YXIgYXNzaWdubWVudCA9IGFzc2lnbkFjdGlvbi5hc3NpZ25tZW50O1xuICAgIHZhciBtZXRhID0ge1xuICAgICAgc3RhdGU6IHN0YXRlLFxuICAgICAgYWN0aW9uOiBhc3NpZ25BY3Rpb24sXG4gICAgICBfZXZlbnQ6IF9ldmVudFxuICAgIH07XG4gICAgdmFyIHBhcnRpYWxVcGRhdGUgPSB7fTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGFzc2lnbm1lbnQpKSB7XG4gICAgICBwYXJ0aWFsVXBkYXRlID0gYXNzaWdubWVudChhY2MsIF9ldmVudC5kYXRhLCBtZXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yICh2YXIgX2IgPSBfX3ZhbHVlcyhPYmplY3Qua2V5cyhhc3NpZ25tZW50KSksIF9jID0gX2IubmV4dCgpOyAhX2MuZG9uZTsgX2MgPSBfYi5uZXh0KCkpIHtcbiAgICAgICAgICB2YXIga2V5ID0gX2MudmFsdWU7XG4gICAgICAgICAgdmFyIHByb3BBc3NpZ25tZW50ID0gYXNzaWdubWVudFtrZXldO1xuICAgICAgICAgIHBhcnRpYWxVcGRhdGVba2V5XSA9IGlzRnVuY3Rpb24ocHJvcEFzc2lnbm1lbnQpID8gcHJvcEFzc2lnbm1lbnQoYWNjLCBfZXZlbnQuZGF0YSwgbWV0YSkgOiBwcm9wQXNzaWdubWVudDtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZV83XzEpIHtcbiAgICAgICAgZV83ID0ge1xuICAgICAgICAgIGVycm9yOiBlXzdfMVxuICAgICAgICB9O1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoX2MgJiYgIV9jLmRvbmUgJiYgKF9hID0gX2IucmV0dXJuKSkgX2EuY2FsbChfYik7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgaWYgKGVfNykgdGhyb3cgZV83LmVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGFjYywgcGFydGlhbFVwZGF0ZSk7XG4gIH0sIGNvbnRleHQpIDogY29udGV4dDtcbiAgcmV0dXJuIHVwZGF0ZWRDb250ZXh0O1xufSAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tZW1wdHlcblxudmFyIHdhcm4gPSBmdW5jdGlvbiAoKSB7fTtcblxuaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gIHdhcm4gPSBmdW5jdGlvbiAoY29uZGl0aW9uLCBtZXNzYWdlKSB7XG4gICAgdmFyIGVycm9yID0gY29uZGl0aW9uIGluc3RhbmNlb2YgRXJyb3IgPyBjb25kaXRpb24gOiB1bmRlZmluZWQ7XG5cbiAgICBpZiAoIWVycm9yICYmIGNvbmRpdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChjb25zb2xlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBhcmdzID0gW1wiV2FybmluZzogXCIuY29uY2F0KG1lc3NhZ2UpXTtcblxuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGFyZ3MucHVzaChlcnJvcik7XG4gICAgICB9IC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1jb25zb2xlXG5cblxuICAgICAgY29uc29sZS53YXJuLmFwcGx5KGNvbnNvbGUsIGFyZ3MpO1xuICAgIH1cbiAgfTtcbn1cbmZ1bmN0aW9uIGlzQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpO1xufSAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6YmFuLXR5cGVzXG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbn1cbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnO1xufVxuZnVuY3Rpb24gdG9HdWFyZChjb25kaXRpb24sIGd1YXJkTWFwKSB7XG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlmIChpc1N0cmluZyhjb25kaXRpb24pKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IERFRkFVTFRfR1VBUkRfVFlQRSxcbiAgICAgIG5hbWU6IGNvbmRpdGlvbixcbiAgICAgIHByZWRpY2F0ZTogZ3VhcmRNYXAgPyBndWFyZE1hcFtjb25kaXRpb25dIDogdW5kZWZpbmVkXG4gICAgfTtcbiAgfVxuXG4gIGlmIChpc0Z1bmN0aW9uKGNvbmRpdGlvbikpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogREVGQVVMVF9HVUFSRF9UWVBFLFxuICAgICAgbmFtZTogY29uZGl0aW9uLm5hbWUsXG4gICAgICBwcmVkaWNhdGU6IGNvbmRpdGlvblxuICAgIH07XG4gIH1cblxuICByZXR1cm4gY29uZGl0aW9uO1xufVxuZnVuY3Rpb24gaXNPYnNlcnZhYmxlKHZhbHVlKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuICdzdWJzY3JpYmUnIGluIHZhbHVlICYmIGlzRnVuY3Rpb24odmFsdWUuc3Vic2NyaWJlKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxudmFyIHN5bWJvbE9ic2VydmFibGUgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wub2JzZXJ2YWJsZSB8fCAnQEBvYnNlcnZhYmxlJztcbn0oKTsgLy8gVE9ETzogdG8gYmUgcmVtb3ZlZCBpbiB2NSwgbGVmdCBpdCBvdXQganVzdCB0byBtaW5pbWl6ZSB0aGUgc2NvcGUgb2YgdGhlIGNoYW5nZSBhbmQgbWFpbnRhaW4gY29tcGF0aWJpbGl0eSB3aXRoIG9sZGVyIHZlcnNpb25zIG9mIGludGVncmF0aW9uIHBhYWNrYWdlc1xuXG52YXIgaW50ZXJvcFN5bWJvbHMgPSAoX2EgPSB7fSwgX2Fbc3ltYm9sT2JzZXJ2YWJsZV0gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzO1xufSwgX2FbU3ltYm9sLm9ic2VydmFibGVdID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcztcbn0sIF9hKTtcbmZ1bmN0aW9uIGlzTWFjaGluZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiAnX194c3RhdGVub2RlJyBpbiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIGlzQWN0b3IodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlLnNlbmQgPT09ICdmdW5jdGlvbic7XG59XG52YXIgdW5pcXVlSWQgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICB2YXIgY3VycmVudElkID0gMDtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBjdXJyZW50SWQrKztcbiAgICByZXR1cm4gY3VycmVudElkLnRvU3RyaW5nKDE2KTtcbiAgfTtcbn0oKTtcbmZ1bmN0aW9uIHRvRXZlbnRPYmplY3QoZXZlbnQsIHBheWxvYWQgLy8gaWQ/OiBURXZlbnRbJ3R5cGUnXVxuKSB7XG4gIGlmIChpc1N0cmluZyhldmVudCkgfHwgdHlwZW9mIGV2ZW50ID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiBfX2Fzc2lnbih7XG4gICAgICB0eXBlOiBldmVudFxuICAgIH0sIHBheWxvYWQpO1xuICB9XG5cbiAgcmV0dXJuIGV2ZW50O1xufVxuZnVuY3Rpb24gdG9TQ1hNTEV2ZW50KGV2ZW50LCBzY3htbEV2ZW50KSB7XG4gIGlmICghaXNTdHJpbmcoZXZlbnQpICYmICckJHR5cGUnIGluIGV2ZW50ICYmIGV2ZW50LiQkdHlwZSA9PT0gJ3NjeG1sJykge1xuICAgIHJldHVybiBldmVudDtcbiAgfVxuXG4gIHZhciBldmVudE9iamVjdCA9IHRvRXZlbnRPYmplY3QoZXZlbnQpO1xuICByZXR1cm4gX19hc3NpZ24oe1xuICAgIG5hbWU6IGV2ZW50T2JqZWN0LnR5cGUsXG4gICAgZGF0YTogZXZlbnRPYmplY3QsXG4gICAgJCR0eXBlOiAnc2N4bWwnLFxuICAgIHR5cGU6ICdleHRlcm5hbCdcbiAgfSwgc2N4bWxFdmVudCk7XG59XG5mdW5jdGlvbiB0b1RyYW5zaXRpb25Db25maWdBcnJheShldmVudCwgY29uZmlnTGlrZSkge1xuICB2YXIgdHJhbnNpdGlvbnMgPSB0b0FycmF5U3RyaWN0KGNvbmZpZ0xpa2UpLm1hcChmdW5jdGlvbiAodHJhbnNpdGlvbkxpa2UpIHtcbiAgICBpZiAodHlwZW9mIHRyYW5zaXRpb25MaWtlID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgdHJhbnNpdGlvbkxpa2UgPT09ICdzdHJpbmcnIHx8IGlzTWFjaGluZSh0cmFuc2l0aW9uTGlrZSkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRhcmdldDogdHJhbnNpdGlvbkxpa2UsXG4gICAgICAgIGV2ZW50OiBldmVudFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIHRyYW5zaXRpb25MaWtlKSwge1xuICAgICAgZXZlbnQ6IGV2ZW50XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gdHJhbnNpdGlvbnM7XG59XG5mdW5jdGlvbiBub3JtYWxpemVUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0YXJnZXQgPT09IHVuZGVmaW5lZCB8fCB0YXJnZXQgPT09IFRBUkdFVExFU1NfS0VZKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiB0b0FycmF5KHRhcmdldCk7XG59XG5mdW5jdGlvbiByZXBvcnRVbmhhbmRsZWRFeGNlcHRpb25Pbkludm9jYXRpb24ob3JpZ2luYWxFcnJvciwgY3VycmVudEVycm9yLCBpZCkge1xuICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICB2YXIgb3JpZ2luYWxTdGFja1RyYWNlID0gb3JpZ2luYWxFcnJvci5zdGFjayA/IFwiIFN0YWNrdHJhY2Ugd2FzICdcIi5jb25jYXQob3JpZ2luYWxFcnJvci5zdGFjaywgXCInXCIpIDogJyc7XG5cbiAgICBpZiAob3JpZ2luYWxFcnJvciA9PT0gY3VycmVudEVycm9yKSB7XG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tY29uc29sZVxuICAgICAgY29uc29sZS5lcnJvcihcIk1pc3Npbmcgb25FcnJvciBoYW5kbGVyIGZvciBpbnZvY2F0aW9uICdcIi5jb25jYXQoaWQsIFwiJywgZXJyb3Igd2FzICdcIikuY29uY2F0KG9yaWdpbmFsRXJyb3IsIFwiJy5cIikuY29uY2F0KG9yaWdpbmFsU3RhY2tUcmFjZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgc3RhY2tUcmFjZSA9IGN1cnJlbnRFcnJvci5zdGFjayA/IFwiIFN0YWNrdHJhY2Ugd2FzICdcIi5jb25jYXQoY3VycmVudEVycm9yLnN0YWNrLCBcIidcIikgOiAnJzsgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbnNvbGVcblxuICAgICAgY29uc29sZS5lcnJvcihcIk1pc3Npbmcgb25FcnJvciBoYW5kbGVyIGFuZC9vciB1bmhhbmRsZWQgZXhjZXB0aW9uL3Byb21pc2UgcmVqZWN0aW9uIGZvciBpbnZvY2F0aW9uICdcIi5jb25jYXQoaWQsIFwiJy4gXCIpICsgXCJPcmlnaW5hbCBlcnJvcjogJ1wiLmNvbmNhdChvcmlnaW5hbEVycm9yLCBcIicuIFwiKS5jb25jYXQob3JpZ2luYWxTdGFja1RyYWNlLCBcIiBDdXJyZW50IGVycm9yIGlzICdcIikuY29uY2F0KGN1cnJlbnRFcnJvciwgXCInLlwiKS5jb25jYXQoc3RhY2tUcmFjZSkpO1xuICAgIH1cbiAgfVxufVxuZnVuY3Rpb24gZXZhbHVhdGVHdWFyZChtYWNoaW5lLCBndWFyZCwgY29udGV4dCwgX2V2ZW50LCBzdGF0ZSkge1xuICB2YXIgZ3VhcmRzID0gbWFjaGluZS5vcHRpb25zLmd1YXJkcztcbiAgdmFyIGd1YXJkTWV0YSA9IHtcbiAgICBzdGF0ZTogc3RhdGUsXG4gICAgY29uZDogZ3VhcmQsXG4gICAgX2V2ZW50OiBfZXZlbnRcbiAgfTsgLy8gVE9ETzogZG8gbm90IGhhcmRjb2RlIVxuXG4gIGlmIChndWFyZC50eXBlID09PSBERUZBVUxUX0dVQVJEX1RZUEUpIHtcbiAgICByZXR1cm4gKChndWFyZHMgPT09IG51bGwgfHwgZ3VhcmRzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBndWFyZHNbZ3VhcmQubmFtZV0pIHx8IGd1YXJkLnByZWRpY2F0ZSkoY29udGV4dCwgX2V2ZW50LmRhdGEsIGd1YXJkTWV0YSk7XG4gIH1cblxuICB2YXIgY29uZEZuID0gZ3VhcmRzID09PSBudWxsIHx8IGd1YXJkcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogZ3VhcmRzW2d1YXJkLnR5cGVdO1xuXG4gIGlmICghY29uZEZuKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiR3VhcmQgJ1wiLmNvbmNhdChndWFyZC50eXBlLCBcIicgaXMgbm90IGltcGxlbWVudGVkIG9uIG1hY2hpbmUgJ1wiKS5jb25jYXQobWFjaGluZS5pZCwgXCInLlwiKSk7XG4gIH1cblxuICByZXR1cm4gY29uZEZuKGNvbnRleHQsIF9ldmVudC5kYXRhLCBndWFyZE1ldGEpO1xufVxuZnVuY3Rpb24gdG9JbnZva2VTb3VyY2Uoc3JjKSB7XG4gIGlmICh0eXBlb2Ygc3JjID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiBzcmNcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHNyYztcbn1cbmZ1bmN0aW9uIHRvT2JzZXJ2ZXIobmV4dEhhbmRsZXIsIGVycm9ySGFuZGxlciwgY29tcGxldGlvbkhhbmRsZXIpIHtcbiAgdmFyIG5vb3AgPSBmdW5jdGlvbiAoKSB7fTtcblxuICB2YXIgaXNPYnNlcnZlciA9IHR5cGVvZiBuZXh0SGFuZGxlciA9PT0gJ29iamVjdCc7XG4gIHZhciBzZWxmID0gaXNPYnNlcnZlciA/IG5leHRIYW5kbGVyIDogbnVsbDtcbiAgcmV0dXJuIHtcbiAgICBuZXh0OiAoKGlzT2JzZXJ2ZXIgPyBuZXh0SGFuZGxlci5uZXh0IDogbmV4dEhhbmRsZXIpIHx8IG5vb3ApLmJpbmQoc2VsZiksXG4gICAgZXJyb3I6ICgoaXNPYnNlcnZlciA/IG5leHRIYW5kbGVyLmVycm9yIDogZXJyb3JIYW5kbGVyKSB8fCBub29wKS5iaW5kKHNlbGYpLFxuICAgIGNvbXBsZXRlOiAoKGlzT2JzZXJ2ZXIgPyBuZXh0SGFuZGxlci5jb21wbGV0ZSA6IGNvbXBsZXRpb25IYW5kbGVyKSB8fCBub29wKS5iaW5kKHNlbGYpXG4gIH07XG59XG5mdW5jdGlvbiBjcmVhdGVJbnZva2VJZChzdGF0ZU5vZGVJZCwgaW5kZXgpIHtcbiAgcmV0dXJuIFwiXCIuY29uY2F0KHN0YXRlTm9kZUlkLCBcIjppbnZvY2F0aW9uW1wiKS5jb25jYXQoaW5kZXgsIFwiXVwiKTtcbn1cbmZ1bmN0aW9uIGlzUmFpc2FibGVBY3Rpb24oYWN0aW9uKSB7XG4gIHJldHVybiAoYWN0aW9uLnR5cGUgPT09IHJhaXNlIHx8IGFjdGlvbi50eXBlID09PSBzZW5kICYmIGFjdGlvbi50byA9PT0gU3BlY2lhbFRhcmdldHMuSW50ZXJuYWwpICYmIHR5cGVvZiBhY3Rpb24uZGVsYXkgIT09ICdudW1iZXInO1xufVxuXG5leHBvcnQgeyBjcmVhdGVJbnZva2VJZCwgZXZhbHVhdGVHdWFyZCwgZmxhdHRlbiwgZ2V0QWN0aW9uVHlwZSwgZ2V0RXZlbnRUeXBlLCBpbnRlcm9wU3ltYm9scywgaXNBY3RvciwgaXNBcnJheSwgaXNCZWhhdmlvciwgaXNCdWlsdEluRXZlbnQsIGlzRnVuY3Rpb24sIGlzTWFjaGluZSwgaXNPYnNlcnZhYmxlLCBpc1Byb21pc2VMaWtlLCBpc1JhaXNhYmxlQWN0aW9uLCBpc1N0YXRlTGlrZSwgaXNTdHJpbmcsIGtleXMsIG1hcENvbnRleHQsIG1hcEZpbHRlclZhbHVlcywgbWFwVmFsdWVzLCBtYXRjaGVzU3RhdGUsIG5lc3RlZFBhdGgsIG5vcm1hbGl6ZVRhcmdldCwgcGFydGl0aW9uLCBwYXRoLCBwYXRoVG9TdGF0ZVZhbHVlLCBwYXRoc1RvU3RhdGVWYWx1ZSwgcmVwb3J0VW5oYW5kbGVkRXhjZXB0aW9uT25JbnZvY2F0aW9uLCBzeW1ib2xPYnNlcnZhYmxlLCB0b0FycmF5LCB0b0FycmF5U3RyaWN0LCB0b0V2ZW50T2JqZWN0LCB0b0d1YXJkLCB0b0ludm9rZVNvdXJjZSwgdG9PYnNlcnZlciwgdG9TQ1hNTEV2ZW50LCB0b1N0YXRlUGF0aCwgdG9TdGF0ZVBhdGhzLCB0b1N0YXRlVmFsdWUsIHRvVHJhbnNpdGlvbkNvbmZpZ0FycmF5LCB1bmlxdWVJZCwgdXBkYXRlQ29udGV4dCwgdXBkYXRlSGlzdG9yeVN0YXRlcywgdXBkYXRlSGlzdG9yeVZhbHVlLCB3YXJuIH07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCB7IGJ1dHRvbk1vZHVsZSB9IGZyb20gXCIuL0J1dHRvbk1vZHVsZS5qc1wiO1xuaW1wb3J0IEV2ZW50QnVzIGZyb20gXCIuL0V2ZW50QnVzLmpzXCI7XG5pbXBvcnQgRXZlbnRNb2R1bGUgZnJvbSBcIi4vRXZlbnRNb2R1bGUuanNcIjtcbmltcG9ydCB7IGFkZFVzZXJBZ2VudEZsYWdzIH0gZnJvbSBcIi4vVXNlckFnZW50TW9kdWxlLmpzXCI7XG5pbXBvcnQgXCIuL3N0eWxlcy9jb21tb24uc2Nzc1wiO1xuaW1wb3J0IFwiLi9zdHlsZXMvZGVza3RvcC5zY3NzXCI7XG5pbXBvcnQgXCIuL3N0eWxlcy9tb2JpbGUuc2Nzc1wiO1xuaW1wb3J0IFwiLi9zdHlsZXMvcmVjdGFuZ2xlcy5jc3NcIjtcbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGNvbnN0IHBhZ2VTY3JpcHQgPSByZXF1aXJlKFwicmF3LWxvYWRlciEuL0F1ZGlvTW9kdWxlLmpzXCIpLmRlZmF1bHQ7XG4gIGFkZFVzZXJBZ2VudEZsYWdzKCk7XG4gIEV2ZW50TW9kdWxlLmluaXQoKTtcbiAgc2V0dXBFdmVudEJ1cygpO1xuXG4gIC8vIENyZWF0ZSBhIE11dGF0aW9uT2JzZXJ2ZXIgdG8gbGlzdGVuIGZvciBjaGFuZ2VzIHRvIHRoZSBET01cbiAgLy8gdGV4dGFyZWFzIGFyZSBhZGRlZCB0byB0aGUgRE9NIGFmdGVyIHRoZSBwYWdlIGxvYWRzXG4gIGNvbnN0IGNhbGxiYWNrID0gZnVuY3Rpb24gKG11dGF0aW9uc0xpc3QsIG9ic2VydmVyKSB7XG4gICAgZm9yIChjb25zdCBtdXRhdGlvbiBvZiBtdXRhdGlvbnNMaXN0KSB7XG4gICAgICBpZiAobXV0YXRpb24udHlwZSA9PT0gXCJjaGlsZExpc3RcIikge1xuICAgICAgICAvLyBJdGVyYXRlIHRocm91Z2ggYWRkZWQgbm9kZXNcbiAgICAgICAgbXV0YXRpb24uYWRkZWROb2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgICAgLy8gQ2hlY2sgaWYgYWRkZWQgbm9kZSBpcyBhIHRleHRhcmVhIHdpdGggJ2VudGVya2V5aGludCcgYXR0cmlidXRlXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgbm9kZS5ub2RlTmFtZSA9PT0gXCJURVhUQVJFQVwiICYmXG4gICAgICAgICAgICBub2RlLmhhc0F0dHJpYnV0ZShcImVudGVya2V5aGludFwiKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgLy8gU3RvcCBvYnNlcnZpbmcgdG8gYXZvaWQgYW55IHBvdGVudGlhbCBpbmZpbml0ZSBsb29wc1xuICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuXG4gICAgICAgICAgICAvLyBEbyBzb21ldGhpbmcgd2l0aCB0aGUgdGV4dGFyZWEsIGxpa2UgYWRkIGFuIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgICAgICBhbm5vdGF0ZURPTShub2RlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBDaGVjayBpZiBhZGRlZCBub2RlIGNvbnRhaW5zIGEgdGV4dGFyZWEgd2l0aCAnZW50ZXJrZXloaW50JyBhdHRyaWJ1dGVcbiAgICAgICAgICBpZiAobm9kZS5xdWVyeVNlbGVjdG9yQWxsKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0YXJlYXMgPSBub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0ZXh0YXJlYVtlbnRlcmtleWhpbnRdXCIpO1xuICAgICAgICAgICAgaWYgKHRleHRhcmVhcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIC8vIFN0b3Agb2JzZXJ2aW5nXG4gICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcblxuICAgICAgICAgICAgICAvLyBEbyBzb21ldGhpbmcgd2l0aCB0aGUgZmlyc3QgdGV4dGFyZWEgdGhhdCBoYXMgJ2VudGVya2V5aGludCdcbiAgICAgICAgICAgICAgYW5ub3RhdGVET00odGV4dGFyZWFzWzBdKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8vIE9wdGlvbnMgZm9yIHRoZSBvYnNlcnZlciAod2hpY2ggbXV0YXRpb25zIHRvIG9ic2VydmUpXG4gIGNvbnN0IGNvbmZpZyA9IHsgYXR0cmlidXRlczogZmFsc2UsIGNoaWxkTGlzdDogdHJ1ZSwgc3VidHJlZTogdHJ1ZSB9O1xuXG4gIC8vIENyZWF0ZSBhbiBvYnNlcnZlciBpbnN0YW5jZSBsaW5rZWQgdG8gdGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoY2FsbGJhY2spO1xuXG4gIC8vIFN0YXJ0IG9ic2VydmluZyB0aGUgdGFyZ2V0IG5vZGUgZm9yIGNvbmZpZ3VyZWQgbXV0YXRpb25zXG4gIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSwgY29uZmlnKTtcblxuICBmdW5jdGlvbiBzZXR1cEV2ZW50QnVzKCkge1xuICAgIC8vIFNldHRpbmcgdGhlIGNvcnJlY3QgY29udGV4dFxuICAgIGxldCBjb250ZXh0ID0gd2luZG93O1xuICAgIGlmIChHTV9pbmZvLnNjcmlwdEhhbmRsZXIgIT09IFwiVXNlcnNjcmlwdHNcIikge1xuICAgICAgY29udGV4dCA9IHVuc2FmZVdpbmRvdztcbiAgICB9XG4gICAgY29udGV4dC5FdmVudEJ1cyA9IEV2ZW50QnVzOyAvLyBNYWtlIHRoZSBFdmVudEJ1cyBhdmFpbGFibGUgdG8gdGhlIHBhZ2Ugc2NyaXB0XG4gIH1cblxuICBmdW5jdGlvbiBhbm5vdGF0ZURPTShwcm9tcHQpIHtcbiAgICAvLyBBZGQgaWQgYXR0cmlidXRlcyB0byBpbXBvcnRhbnQgZWxlbWVudHNcbiAgICBwcm9tcHQuaWQgPSBcInNheXBpLXByb21wdFwiO1xuICAgIGNvbnN0IGZvdW5kRm9vdGVyID0gYWRkSWRGb290ZXIoKTtcbiAgICBjb25zdCBmb3VuZEF1ZGlvQ29udHJvbHMgPSBhZGRJZEF1ZGlvQ29udHJvbHMoKTtcbiAgICBjb25zdCBwcm9tcHRDb250cm9sc0NvbnRhaW5lciA9IHByb21wdC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgYWRkSWRTdWJtaXRCdXR0b24ocHJvbXB0Q29udHJvbHNDb250YWluZXIpO1xuICAgIGFkZFRhbGtCdXR0b24ocHJvbXB0Q29udHJvbHNDb250YWluZXIpO1xuICAgIGJ1dHRvbk1vZHVsZS5jcmVhdGVFbnRlckJ1dHRvbigpO1xuICAgIGJ1dHRvbk1vZHVsZS5jcmVhdGVFeGl0QnV0dG9uKCk7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRJZFN1Ym1pdEJ1dHRvbihjb250YWluZXIpIHtcbiAgICBjb25zdCBzdWJtaXRCdXR0b24gPSBjb250YWluZXIucXVlcnlTZWxlY3RvcihcImJ1dHRvblt0eXBlPWJ1dHRvbl1cIik7XG4gICAgaWYgKHN1Ym1pdEJ1dHRvbikge1xuICAgICAgc3VibWl0QnV0dG9uLmlkID0gXCJzYXlwaS1zdWJtaXRCdXR0b25cIjtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBhZGRJZEZvb3RlcigpIHtcbiAgICAvLyBGaW5kIGFsbCBhdWRpbyBlbGVtZW50cyBvbiB0aGUgcGFnZVxuICAgIHZhciBhdWRpb0VsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImF1ZGlvXCIpO1xuICAgIHZhciBmb3VuZCA9IGZhbHNlOyAvLyBkZWZhdWx0IHRvIG5vdCBmb3VuZFxuXG4gICAgYXVkaW9FbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChhdWRpbykge1xuICAgICAgdmFyIHByZWNlZGluZ0RpdiA9IGF1ZGlvLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG5cbiAgICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZm91bmQgYSBkaXYsIHdlIGNhbiBza2lwIGZ1cnRoZXIgaXRlcmF0aW9uc1xuICAgICAgaWYgKGZvdW5kKSByZXR1cm47XG5cbiAgICAgIC8vIENoZWNrIGlmIHRoZSBwcmVjZWRpbmcgZWxlbWVudCBpcyBhIGRpdlxuICAgICAgaWYgKHByZWNlZGluZ0RpdiAmJiBwcmVjZWRpbmdEaXYudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImRpdlwiKSB7XG4gICAgICAgIC8vIEFzc2lnbiBhbiBJRCB0byB0aGUgZGl2XG4gICAgICAgIHByZWNlZGluZ0Rpdi5sYXN0RWxlbWVudENoaWxkLmlkID0gXCJzYXlwaS1mb290ZXJcIjtcbiAgICAgICAgZm91bmQgPSB0cnVlOyAvLyBzZXQgdG8gZm91bmRcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBmb3VuZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZElkQXVkaW9Db250cm9scygpIHtcbiAgICAvLyBGaW5kIGFsbCBhdWRpbyBlbGVtZW50cyBvbiB0aGUgcGFnZVxuICAgIHZhciBhdWRpb0VsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImF1ZGlvXCIpO1xuICAgIHZhciBmb3VuZCA9IGZhbHNlOyAvLyBkZWZhdWx0IHRvIG5vdCBmb3VuZFxuXG4gICAgYXVkaW9FbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChhdWRpbykge1xuICAgICAgdmFyIG5leHREaXYgPSBhdWRpby5uZXh0RWxlbWVudFNpYmxpbmc7XG5cbiAgICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZm91bmQgYSBkaXYsIHdlIGNhbiBza2lwIGZ1cnRoZXIgaXRlcmF0aW9uc1xuICAgICAgaWYgKGZvdW5kKSByZXR1cm47XG5cbiAgICAgIC8vIENoZWNrIGlmIHRoZSBwcmVjZWRpbmcgZWxlbWVudCBpcyBhIGRpdlxuICAgICAgaWYgKG5leHREaXYgJiYgbmV4dERpdi50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiZGl2XCIpIHtcbiAgICAgICAgLy8gQXNzaWduIGFuIElEIHRvIHRoZSBkaXZcbiAgICAgICAgbmV4dERpdi5pZCA9IFwic2F5cGktYXVkaW8tY29udHJvbHNcIjtcbiAgICAgICAgZm91bmQgPSB0cnVlOyAvLyBzZXQgdG8gZm91bmRcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBmb3VuZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluamVjdFNjcmlwdChjYWxsYmFjaykge1xuICAgIHZhciBzY3JpcHRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICBzY3JpcHRFbGVtZW50LnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xuICAgIHNjcmlwdEVsZW1lbnQuaWQgPSBcInNheXBpLXNjcmlwdFwiO1xuICAgIHNjcmlwdEVsZW1lbnQudGV4dENvbnRlbnQgPSBwYWdlU2NyaXB0O1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0RWxlbWVudCk7XG5cbiAgICAvLyBDYWxsIHRoZSBjYWxsYmFjayBmdW5jdGlvbiBhZnRlciB0aGUgc2NyaXB0IGlzIGFkZGVkXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFRhbGtCdXR0b24oY29udGFpbmVyKSB7XG4gICAgLy8gQ3JlYXRlIGEgY29udGFpbmluZyBkaXZcbiAgICB2YXIgcGFuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHBhbmVsLmlkID0gXCJzYXlwaS1wYW5lbFwiO1xuXG4gICAgLy8gQ2hlY2sgaWYgdGhlIGNvbnRhaW5lciBoYXMgYW55IGNoaWxkIGVsZW1lbnRzXG4gICAgaWYgKGNvbnRhaW5lci5jaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIEluc2VydCB0aGUgcGFuZWwgYXMgdGhlIHNlY29uZC10by1sYXN0IGNoaWxkXG4gICAgICBjb250YWluZXIuaW5zZXJ0QmVmb3JlKHBhbmVsLCBjb250YWluZXIubGFzdENoaWxkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgdGhlIGNvbnRhaW5lciBoYXMgbm8gY2hpbGRyZW4sIGp1c3QgYXBwZW5kIHRoZSBwYW5lbFxuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHBhbmVsKTtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgdGhlIHRhbGsgYnV0dG9uIHVzaW5nIEJ1dHRvbk1vZHVsZVxuICAgIGNvbnN0IGxhYmVsID1cbiAgICAgIFwiVGFsayAoSG9sZCBDb250cm9sICsgU3BhY2UgdG8gdXNlIGhvdGtleS4gRG91YmxlIGNsaWNrIHRvIHRvZ2dsZSBhdXRvLXN1Ym1pdCBvbi9vZmYpXCI7XG4gICAgdmFyIGJ1dHRvbiA9IGJ1dHRvbk1vZHVsZS5jcmVhdGVCdXR0b24oXCJcIiwgKCkgPT4ge30pOyAvLyBUaGUgY2FsbGJhY2sgaXMgZW1wdHkgZm9yIG5vdywgYnV0IHlvdSBjYW4gYWRkIGZ1bmN0aW9uYWxpdGllcyBpZiBuZWVkZWQuXG5cbiAgICBidXR0b24uaWQgPSBcInNheXBpLXRhbGtCdXR0b25cIjtcbiAgICBidXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XG5cbiAgICAvLyBTZXQgQVJJQSBsYWJlbCBhbmQgdG9vbHRpcFxuICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIGxhYmVsKTtcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKFwidGl0bGVcIiwgbGFiZWwpO1xuXG4gICAgY29uc3QgY2xhc3NOYW1lcyA9XG4gICAgICBcInJlbGF0aXZlIGZsZXggbXQtMSBtYi0xIHJvdW5kZWQtZnVsbCBweC0yIHB5LTMgdGV4dC1jZW50ZXIgYmctY3JlYW0tNTUwIGhvdmVyOmJnLWNyZWFtLTY1MCBob3Zlcjp0ZXh0LWJyYW5kLWdyZWVuLTcwMCB0ZXh0LW11dGVkXCI7XG4gICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lcy5zcGxpdChcIiBcIikpO1xuXG4gICAgLy8gRW5hYmxlIGF1dG9zdWJtaXQgYnkgZGVmYXVsdFxuICAgIGJ1dHRvbi5kYXRhc2V0LmF1dG9zdWJtaXQgPSBcInRydWVcIjtcbiAgICBidXR0b24uY2xhc3NMaXN0LmFkZChcImF1dG9TdWJtaXRcIik7XG5cbiAgICBwYW5lbC5hcHBlbmRDaGlsZChidXR0b24pO1xuICAgIGJ1dHRvbk1vZHVsZS5hZGRUYWxrSWNvbihidXR0b24pO1xuXG4gICAgLy8gQ2FsbCB0aGUgZnVuY3Rpb24gdG8gaW5qZWN0IHRoZSBzY3JpcHQgYWZ0ZXIgdGhlIGJ1dHRvbiBoYXMgYmVlbiBhZGRlZFxuICAgIGluamVjdFNjcmlwdChyZWdpc3RlckF1ZGlvQnV0dG9uRXZlbnRzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlZ2lzdGVyQXVkaW9CdXR0b25FdmVudHMoKSB7XG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS10YWxrQnV0dG9uXCIpO1xuXG4gICAgLy8gQXR0YWNoIHRoZSBldmVudCBsaXN0ZW5lcnNcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwibW91c2Vkb3duXCIsXG4gICAgICBFdmVudE1vZHVsZS5oYW5kbGVUYWxrTW91c2VEb3duLmJpbmQoRXZlbnRNb2R1bGUpXG4gICAgKTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwibW91c2V1cFwiLFxuICAgICAgRXZlbnRNb2R1bGUuaGFuZGxlVGFsa01vdXNlVXAuYmluZChFdmVudE1vZHVsZSlcbiAgICApO1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiZGJsY2xpY2tcIiwgKCkgPT5cbiAgICAgIEV2ZW50TW9kdWxlLmhhbmRsZVRhbGtEb3VibGVDbGljayhidXR0b24pXG4gICAgKTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgKGUpID0+XG4gICAgICBFdmVudE1vZHVsZS5oYW5kbGVUYWxrVG91Y2hTdGFydChidXR0b24sIGUpXG4gICAgKTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsICgpID0+XG4gICAgICBFdmVudE1vZHVsZS5oYW5kbGVUYWxrVG91Y2hFbmQoYnV0dG9uKVxuICAgICk7XG5cbiAgICBFdmVudE1vZHVsZS5yZWdpc3Rlck90aGVyQXVkaW9CdXR0b25FdmVudHMoYnV0dG9uKTtcbiAgICBFdmVudE1vZHVsZS5yZWdpc3RlckhvdGtleSgpO1xuICB9XG5cbiAgLy8gU3RhcnQgb2JzZXJ2aW5nIHRoZSBlbnRpcmUgZG9jdW1lbnQgZm9yIGNoYW5nZXMgdG8gY2hpbGQgbm9kZXMgYW5kIHN1YnRyZWVcbiAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudCwgeyBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUgfSk7XG59KSgpO1xuIl0sIm5hbWVzIjpbIkFuaW1hdGlvbk1vZHVsZSIsIl9jbGFzc0NhbGxDaGVjayIsIl9jcmVhdGVDbGFzcyIsImtleSIsInZhbHVlIiwic3RhcnRBbmltYXRpb24iLCJhbmltYXRpb24iLCJzdG9wT3RoZXJBbmltYXRpb25zIiwicmVjdGFuZ2xlcyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsInJlY3RhbmdsZXNTZWxlY3RvciIsImZvckVhY2giLCJyZWN0IiwiY2xhc3NMaXN0IiwiYWRkIiwic3RvcEFuaW1hdGlvbiIsInJlbW92ZSIsInN0b3BBbGxBbmltYXRpb25zIiwiX3RoaXMiLCJ0YWxrQnV0dG9uQW5pbWF0aW9ucyIsImtlZXBBbmltYXRpb24iLCJfdGhpczIiLCJfZGVmaW5lUHJvcGVydHkiLCJkZWZhdWx0IiwiZW50ZXJNb2JpbGVNb2RlIiwiZXhpdE1vYmlsZU1vZGUiLCJpc01vYmlsZVZpZXciLCJFdmVudEJ1cyIsIlN0YXRlTWFjaGluZVNlcnZpY2UiLCJleGl0SWNvblNWRyIsIm1heGltaXplSWNvblNWRyIsInJlY3RhbmdsZXNTVkciLCJ0YWxrSWNvblNWRyIsIm11dGVkTWljSWNvblNWRyIsIkJ1dHRvbk1vZHVsZSIsInBsYXlCdXR0b24iLCJhY3RvciIsImhhbmRsZVBsYXlCdXR0b25DbGljayIsImJpbmQiLCJyZWdpc3Rlck90aGVyRXZlbnRzIiwib24iLCJoYW5kbGVBdXRvU3VibWl0IiwiY3JlYXRlQnV0dG9uIiwibGFiZWwiLCJjYWxsYmFjayIsImJ1dHRvbiIsImNyZWF0ZUVsZW1lbnQiLCJ0ZXh0Q29udGVudCIsIm9uY2xpY2siLCJzdHlsZUJ1dHRvbiIsInN0eWxlcyIsImhhc093blByb3BlcnR5Iiwic3R5bGUiLCJhZGRUYWxrSWNvbiIsInVwZGF0ZUljb25Db250ZW50Iiwid2luZG93IiwibWF0Y2hNZWRpYSIsImFkZExpc3RlbmVyIiwic2V0dXBDbGFzc09ic2VydmVyIiwiaWNvbkNvbnRhaW5lciIsImlubmVySFRNTCIsInRhcmdldE5vZGUiLCJkb2N1bWVudEVsZW1lbnQiLCJjb25maWciLCJhdHRyaWJ1dGVzIiwiYXR0cmlidXRlRmlsdGVyIiwibXV0YXRpb25zTGlzdCIsIm9ic2VydmVyIiwiX2l0ZXJhdG9yIiwiX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIiLCJfc3RlcCIsInMiLCJuIiwiZG9uZSIsIm11dGF0aW9uIiwidHlwZSIsImF0dHJpYnV0ZU5hbWUiLCJjb250YWlucyIsImVyciIsImUiLCJmIiwiTXV0YXRpb25PYnNlcnZlciIsIm9ic2VydmUiLCJjcmVhdGVFeGl0QnV0dG9uIiwiaWQiLCJjbGFzc05hbWUiLCJzZXRBdHRyaWJ1dGUiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJjcmVhdGVFbnRlckJ1dHRvbiIsImNyZWF0ZVBsYXlCdXR0b24iLCJhZGRFdmVudExpc3RlbmVyIiwic2hvd1BsYXlCdXR0b24iLCJoaWRlUGxheUJ1dHRvbiIsInNlbmQiLCJlbWl0Iiwic2hvd05vdGlmaWNhdGlvbiIsImRldGFpbHMiLCJpY29uIiwiaWNvblNWRyIsIm5vdGlmaWNhdGlvbiIsImdldEVsZW1lbnRCeUlkIiwiZGlzbWlzc05vdGlmaWNhdGlvbiIsInNpbXVsYXRlRm9ybVN1Ym1pdCIsInN1Ym1pdEJ1dHRvbiIsImNsaWNrIiwidGV4dGFyZWEiLCJlbnRlckV2ZW50IiwiS2V5Ym9hcmRFdmVudCIsImJ1YmJsZXMiLCJrZXlDb2RlIiwid2hpY2giLCJkaXNwYXRjaEV2ZW50IiwidGFsa0J1dHRvbiIsImRhdGFzZXQiLCJhdXRvc3VibWl0IiwiY29uc29sZSIsImxvZyIsImJ1dHRvbk1vZHVsZSIsIkV2ZW50RW1pdHRlciIsIlVTRVJfU1BFQUtJTkciLCJVU0VSX1NUT1BQRURfU1BFQUtJTkciLCJVU0VSX0ZJTklTSEVEX1NQRUFLSU5HIiwiVFJBTlNDUklCSU5HIiwiUElfU1BFQUtJTkciLCJQSV9TVE9QUEVEX1NQRUFLSU5HIiwiUElfRklOSVNIRURfU1BFQUtJTkciLCJQQVVTRSIsIlJFQURZIiwiUExBWSIsIkV2ZW50TW9kdWxlIiwiaW5pdCIsInJlZ2lzdGVyU3RhdGVNYWNoaW5lRXZlbnRzIiwiY2xlYW51cCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJoYW5kbGVUcmFuc2NyaXB0aW9uUmVzcG9uc2UiLCJzaW11bGF0ZVR5cGluZyIsImVsZW1lbnQiLCJ0ZXh0Iiwid29yZHMiLCJzcGxpdCIsImkiLCJ0eXBlV29yZCIsImxlbmd0aCIsInNldE5hdGl2ZVZhbHVlIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibGFzdFZhbHVlIiwiZXZlbnQiLCJFdmVudCIsInRhcmdldCIsInNpbXVsYXRlZCIsInRyYWNrZXIiLCJfdmFsdWVUcmFja2VyIiwic2V0VmFsdWUiLCJoYW5kbGVUYWxrTW91c2VEb3duIiwiaGFuZGxlVGFsa01vdXNlVXAiLCJoYW5kbGVUYWxrRG91YmxlQ2xpY2siLCJ0b2dnbGUiLCJnZXRBdHRyaWJ1dGUiLCJoYW5kbGVUYWxrVG91Y2hTdGFydCIsInByZXZlbnREZWZhdWx0IiwiaGFuZGxlVGFsa1RvdWNoRW5kIiwicmVnaXN0ZXJPdGhlckF1ZGlvQnV0dG9uRXZlbnRzIiwiZXZlbnROYW1lIiwiZGV0YWlsIiwiX29iamVjdFNwcmVhZCIsIndhcm4iLCJjb25jYXQiLCJyZWdpc3RlckhvdGtleSIsImN0cmxEb3duIiwiY3RybEtleSIsImNvZGUiLCJpbnRlcnByZXQiLCJtYWNoaW5lIiwib25UcmFuc2l0aW9uIiwic3RhdGUiLCJzdGFydCIsImFwcFNlcnZlclVybCIsInByb2Nlc3MiLCJlbnYiLCJBUFBfU0VSVkVSX1VSTCIsImFwaVNlcnZlclVybCIsIkFQSV9TRVJWRVJfVVJMIiwidXBsb2FkQXVkaW8iLCJhdWRpb0Jsb2IiLCJmb3JtRGF0YSIsIkZvcm1EYXRhIiwiYXVkaW9GaWxlbmFtZSIsImFwcGVuZCIsImxhbmd1YWdlIiwibmF2aWdhdG9yIiwiZmV0Y2giLCJtZXRob2QiLCJ0aGVuIiwicmVzcG9uc2UiLCJvayIsIkVycm9yIiwic3RhdHVzVGV4dCIsImpzb24iLCJyZXNwb25zZUpzb24iLCJlcnJvciIsInRyYW5zY3JpcHQiLCJzdWJzdHJpbmciLCJpc1NhZmFyaSIsInRlc3QiLCJ1c2VyQWdlbnQiLCJpc01vYmlsZURldmljZSIsIm1hdGNoZXMiLCJ1c2VyVmlld1ByZWZlcmVuY2UiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwic2V0SXRlbSIsImFkZFVzZXJBZ2VudEZsYWdzIiwiaXNGaXJlZm94QW5kcm9pZCIsImFkZERldmljZUZsYWdzIiwiYWRkVmlld0ZsYWdzIiwiY3JlYXRlTWFjaGluZSIsImluaXRpYWwiLCJzdGF0ZXMiLCJpZGxlIiwiZGVzY3JpcHRpb24iLCJlbnRyeSIsImNvbmQiLCJ1c2VyU3BlYWtpbmciLCJwYXJhbXMiLCJleGl0IiwicGF1c2VkIiwiYWN0aW9ucyIsImludGVybmFsIiwicGlTcGVha2luZyIsInRyYW5zY3JpYmluZyIsImxvYWRpbmciLCJlcnJvcnMiLCJhZnRlciIsInRyYW5zY3JpYmVGYWlsZWQiLCJtaWNFcnJvciIsInByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzIiwicHJlc2VydmVBY3Rpb25PcmRlciIsImNvbnRleHQiLCJfcmVmIiwiYWN0aW9uIiwiX3JlZjIiLCJ0cmFuc2NyaWJlQXVkaW8iLCJibG9iIiwidHJhbnNjcmlwdGlvbiIsImFjdGl2YXRlVGFsa0J1dHRvbiIsImRlYWN0aXZhdGVUYWxrQnV0dG9uIiwiYWNxdWlyZU1pY3JvcGhvbmUiLCJfcmVmMyIsIm1lc3NhZ2UiLCJzZXJ2aWNlcyIsImd1YXJkcyIsInRvb1Nob3J0Rm9yVXBsb2FkIiwiZHVyYXRpb24iLCJsb25nRW5vdWdoRm9yVXBsb2FkIiwiaXNTYWZhcmlNb2JpbGUiLCJkZWxheXMiLCJwYWdlU2NyaXB0IiwicmVxdWlyZSIsInNldHVwRXZlbnRCdXMiLCJhZGRlZE5vZGVzIiwibm9kZSIsIm5vZGVOYW1lIiwiaGFzQXR0cmlidXRlIiwiZGlzY29ubmVjdCIsImFubm90YXRlRE9NIiwidGV4dGFyZWFzIiwiY2hpbGRMaXN0Iiwic3VidHJlZSIsIkdNX2luZm8iLCJzY3JpcHRIYW5kbGVyIiwidW5zYWZlV2luZG93IiwicHJvbXB0IiwiZm91bmRGb290ZXIiLCJhZGRJZEZvb3RlciIsImZvdW5kQXVkaW9Db250cm9scyIsImFkZElkQXVkaW9Db250cm9scyIsInByb21wdENvbnRyb2xzQ29udGFpbmVyIiwicGFyZW50RWxlbWVudCIsImFkZElkU3VibWl0QnV0dG9uIiwiYWRkVGFsa0J1dHRvbiIsImNvbnRhaW5lciIsInF1ZXJ5U2VsZWN0b3IiLCJhdWRpb0VsZW1lbnRzIiwiZm91bmQiLCJhdWRpbyIsInByZWNlZGluZ0RpdiIsInByZXZpb3VzRWxlbWVudFNpYmxpbmciLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJsYXN0RWxlbWVudENoaWxkIiwibmV4dERpdiIsIm5leHRFbGVtZW50U2libGluZyIsImluamVjdFNjcmlwdCIsInNjcmlwdEVsZW1lbnQiLCJwYW5lbCIsImNoaWxkTm9kZXMiLCJpbnNlcnRCZWZvcmUiLCJsYXN0Q2hpbGQiLCJjbGFzc05hbWVzIiwicmVnaXN0ZXJBdWRpb0J1dHRvbkV2ZW50cyJdLCJzb3VyY2VSb290IjoiIn0=