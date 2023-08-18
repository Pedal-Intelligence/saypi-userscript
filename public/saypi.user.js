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
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var ButtonModule = /*#__PURE__*/function () {
  function ButtonModule() {
    _classCallCheck(this, ButtonModule);
    this.textarea = document.getElementById("prompt");
    this.talkButton = document.getElementById("saypi-talkButton");
  }

  // Function to create a new button
  _createClass(ButtonModule, [{
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
    key: "simulateFormSubmit",
    value: function simulateFormSubmit() {
      if (!this.textarea) {
        this.textarea = document.getElementById("prompt");
      }
      var enterEvent = new KeyboardEvent("keydown", {
        bubbles: true,
        key: "Enter",
        keyCode: 13,
        which: 13
      });
      this.textarea.dispatchEvent(enterEvent);
    }

    // Function to handle auto-submit based on the button's data attribute
  }, {
    key: "handleAutoSubmit",
    value: function handleAutoSubmit() {
      if (!this.talkButton) {
        this.talkButton = document.getElementById("saypi-talkButton");
      }
      if (this.talkButton.dataset.autosubmit === "false") {
        console.log("Autosubmit is disabled");
      } else {
        this.simulateFormSubmit();
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
/* harmony import */ var _ButtonModule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ButtonModule */ "./src/ButtonModule.js");
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
  }, {
    key: "handleAudioEvents",
    value: function handleAudioEvents() {
      window.addEventListener("saypi:transcribed", EventModule.handleTranscriptionResponse);
    }
  }, {
    key: "handleTranscriptionResponse",
    value: function handleTranscriptionResponse(transcriptionEvent) {
      var transcript = transcriptionEvent.detail.text;
      var textarea = document.getElementById("prompt");
      EventModule.simulateTyping(textarea, transcript + " ");
      console.log("Transcript: " + transcript);
    }
  }, {
    key: "simulateTyping",
    value: function simulateTyping(element, text) {
      var buttonModule = new _ButtonModule__WEBPACK_IMPORTED_MODULE_0__["default"]();
      var words = text.split(" ");
      var i = 0;
      var typeWord = function typeWord() {
        if (i < words.length) {
          EventModule.setNativeValue(element, element.value + words[i++] + " ");
          requestAnimationFrame(typeWord);
        } else {
          buttonModule.handleAutoSubmit();
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
      EventModule.idPromptTextArea();
      this.context.startRecording();
    }
  }, {
    key: "handleTalkMouseUp",
    value: function handleTalkMouseUp() {
      var _this$context;
      if (typeof ((_this$context = this.context) === null || _this$context === void 0 ? void 0 : _this$context.stopRecording) === "function") {
        this.context.stopRecording();
      }
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
      EventModule.idPromptTextArea();
      this.context.startRecording();
      button.classList.add("active");
    }
  }, {
    key: "handleTalkTouchEnd",
    value: function handleTalkTouchEnd(button) {
      button.classList.remove("active");
      this.context.stopRecording();
    }
  }, {
    key: "setContext",
    value: function setContext(ctx) {
      this.context = ctx;
    }
  }, {
    key: "idPromptTextArea",
    value: function idPromptTextArea() {
      var textarea = document.getElementById("prompt");
      if (!textarea) {
        // Find the first <textarea> element and give it an id
        var textareaElement = document.querySelector("textarea");
        if (textareaElement) {
          textareaElement.id = "prompt";
        } else {
          console.warn("No <textarea> element found");
        }
      }
    }
  }]);
  return EventModule;
}();
_defineProperty(EventModule, "context", window);


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
    background-color: rgba(245, 238, 223, 0.9);
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
`, "",{"version":3,"sources":["webpack://./src/mobile.css"],"names":[],"mappings":"AAAA;EACE,0BAA0B;EAC1B;;IAEE,WAAW;IACX,eAAe;IACf,OAAO;IACP,0CAA0C;EAC5C;EACA;;IAEE,aAAa;IACb,MAAM;IACN,WAAW;EACb;EACA,qCAAqC;EACrC;IACE,WAAW;IACX,YAAY;IACZ,6BAA6B;IAC7B,gBAAgB;IAChB,SAAS;EACX;EACA,kEAAkE;EAClE;;IAEE,mBAAmB;IACnB,WAAW;EACb;EACA,2CAA2C;EAC3C;;IAEE,8BAA8B;IAC9B,WAAW;EACb;EACA,gBAAgB;EAChB;IACE,aAAa;EACf;AACF","sourcesContent":["@media (max-width: 768px) {\n  /* mobile styles go here */\n  #saypi-panel,\n  .play-button {\n    width: 100%;\n    position: fixed;\n    left: 0;\n    background-color: rgba(245, 238, 223, 0.9);\n  }\n  #saypi-panel,\n  .play-button {\n    height: 100vh;\n    top: 0;\n    padding: 5%;\n  }\n  /* make the buttons fill the panels */\n  #saypi-talkButton {\n    width: 100%;\n    height: 100%;\n    background-color: transparent;\n    border-radius: 0;\n    margin: 0;\n  }\n  /* surface primary controls: \"...\", \"experiences\", \"unmute/mute\" */\n  #__next > main > div > div > div.fixed.top-4.right-6 > button,\n  div[data-projection-id=\"12\"] > button {\n    transform: scale(2);\n    z-index: 50;\n  }\n  /* override React changes on audio button */\n  button[data-projection-id=\"16\"] > div[data-projection-id=\"17\"],\n  button[data-projection-id=\"16\"] > div[data-projection-id=\"18\"] {\n    transform: scale(2) !important;\n    z-index: 50;\n  }\n  /* hide footer */\n  #saypi-footer {\n    display: none;\n  }\n}\n"],"sourceRoot":""}]);
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
`, "",{"version":3,"sources":["webpack://./src/rectangles.css"],"names":[],"mappings":"AAAA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,sBAAsB;EACxB;AACF;AACA;EACE,sCAAsC;EACtC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,mCAAmC;EACnC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,kCAAkC;EAClC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,mCAAmC;EACnC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,kCAAkC;EAClC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,qBAAqB;EACvB;AACF;AACA;EACE,sCAAsC;EACtC,wBAAwB;AAC1B;;AAEA,wDAAwD;AACxD;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,0BAA0B;EAC5B;EACA;IACE,0BAA0B;EAC5B;AACF;AACA;EACE,gCAAgC;EAChC,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,4BAA4B;EAC9B;EACA;IACE,6BAA6B;EAC/B;AACF;AACA;EACE,6BAA6B;EAC7B,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,4BAA4B;EAC9B;EACA;IACE,6BAA6B;EAC/B;AACF;AACA;EACE,4BAA4B;EAC5B,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,4BAA4B;EAC9B;EACA;IACE,6BAA6B;EAC/B;AACF;AACA;EACE,6BAA6B;EAC7B,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,4BAA4B;EAC9B;EACA;IACE,6BAA6B;EAC/B;AACF;AACA;EACE,4BAA4B;EAC5B,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,0BAA0B;EAC5B;EACA;IACE,4BAA4B;EAC9B;AACF;AACA;EACE,gCAAgC;EAChC,sBAAsB;EACtB,mCAAmC;AACrC","sourcesContent":["@keyframes pulse_outermost {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.92);\n  }\n}\n.outermost {\n  animation: pulse_outermost 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_second {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.856);\n  }\n}\n.second {\n  animation: pulse_second 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_third {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.792);\n  }\n}\n.third {\n  animation: pulse_third 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_fourth {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.728);\n  }\n}\n.fourth {\n  animation: pulse_fourth 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_fifth {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.664);\n  }\n}\n.fifth {\n  animation: pulse_fifth 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_innermost {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.6);\n  }\n}\n.innermost {\n  animation: pulse_innermost 5s infinite;\n  transform-origin: center;\n}\n\n/* bounce animation to indicate Pi is waiting to speak */\n@keyframes bounce_outermost {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-5%);\n  }\n  60% {\n    transform: translateY(-3%);\n  }\n}\n.outermost.readyToRespond {\n  animation-name: bounce_outermost;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes bounce_second {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-5.8%);\n  }\n  60% {\n    transform: translateY(-3.48%);\n  }\n}\n.second.readyToRespond {\n  animation-name: bounce_second;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes bounce_third {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-6.6%);\n  }\n  60% {\n    transform: translateY(-3.96%);\n  }\n}\n.third.readyToRespond {\n  animation-name: bounce_third;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes bounce_fourth {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-7.4%);\n  }\n  60% {\n    transform: translateY(-4.44%);\n  }\n}\n.fourth.readyToRespond {\n  animation-name: bounce_fourth;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes bounce_fifth {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-8.2%);\n  }\n  60% {\n    transform: translateY(-4.92%);\n  }\n}\n.fifth.readyToRespond {\n  animation-name: bounce_fifth;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes bounce_innermost {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-9%);\n  }\n  60% {\n    transform: translateY(-5.4%);\n  }\n}\n.innermost.readyToRespond {\n  animation-name: bounce_innermost;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n"],"sourceRoot":""}]);
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("// Dispatch Custom Event\nfunction dispatchCustomEvent(eventName) {\n  var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n  var event = new CustomEvent(eventName, {\n    detail: detail\n  });\n  window.dispatchEvent(event);\n}\n\n// audio output (Pi)\nvar audioElement = document.querySelector(\"audio\");\nif (!audioElement) {\n  console.error(\"Audio element not found!\");\n}\nfunction isSafari() {\n  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);\n}\naudioElement.preload = \"auto\"; // enable aggressive preloading of audio\nvar piAudioManager = {\n  isSpeaking: false,\n  audioElement: audioElement,\n  _userStarted: true,\n  // flag to indicate playback has been started by the user (true by default because user must request initial playback)\n  _isLoadCalled: false,\n  // flag to indicate if the load() method has been called on the audio element\n\n  isLoadCalled: function isLoadCalled() {\n    return this._isLoadCalled;\n  },\n  setIsLoadCalled: function setIsLoadCalled(value) {\n    this._isLoadCalled = value;\n  },\n  userPlay: function userPlay() {\n    if (!isSafari()) {\n      return;\n    }\n    this._userStarted = true; // set a flag to indicate playback has been started by the user\n    this.audioElement.load(); // reset for Safari\n    this.audioElement.play();\n    console.log(\"User started playback\");\n  },\n  autoPlay: function autoPlay() {\n    if (!this._userStarted) {\n      this.audioElement.pause();\n      console.log(\"Autoplay prevented\");\n    }\n  },\n  stop: function stop() {\n    if (this.isSpeaking) {\n      this.audioElement.pause();\n    }\n    if (this.audioElement.duration && !this.audioElement.ended && this.audioElement.currentTime < this.audioElement.duration) {\n      this.audioElement.currentTime = this.audioElement.duration; // seek the audio to the end\n      this.audioElement.play(); // trigger the ended event\n    }\n  },\n\n  pause: function pause() {\n    this.audioElement.pause();\n  },\n  resume: function resume() {\n    this.audioElement.play();\n  },\n  playing: function playing() {\n    this.isSpeaking = true;\n  },\n  stopped: function stopped() {\n    this.isSpeaking = false;\n    this._userStarted = false;\n  }\n};\n\n// Intercept Autoplay Events (autoplay doesn't work on Safari)\naudioElement.addEventListener(\"play\", function () {\n  if (isSafari()) {\n    piAudioManager.autoPlay();\n  }\n});\naudioElement.addEventListener(\"loadstart\", function () {\n  if (isSafari()) {\n    console.log(\"Pi is waiting to speak\");\n    dispatchCustomEvent(\"saypi:piReadyToRespond\");\n  }\n});\n\n// Event listeners for detecting when Pi is speaking\naudioElement.addEventListener(\"playing\", function () {\n  console.log(\"Pi is speaking\");\n  piAudioManager.playing();\n  dispatchCustomEvent(\"saypi:piSpeaking\");\n});\naudioElement.addEventListener(\"pause\", function () {\n  console.log(\"Pi stopped speaking\");\n  piAudioManager.stopped();\n  dispatchCustomEvent(\"saypi:piStoppedSpeaking\");\n});\naudioElement.addEventListener(\"ended\", function () {\n  console.log(\"Pi finished speaking\");\n  piAudioManager.stopped();\n  dispatchCustomEvent(\"saypi:piFinishedSpeaking\");\n});\n\n// audio input (user)\nvar audioDataChunks = [];\nvar audioMimeType = \"audio/webm;codecs=opus\";\nfunction uploadAudio(audioBlob) {\n  // Create a FormData object\n  var formData = new FormData();\n  var audioFilename = \"audio.webm\";\n  if (audioBlob.type === \"audio/mp4\") {\n    audioFilename = \"audio.mp4\";\n  }\n  // Add the audio blob to the FormData object\n  formData.append(\"audio\", audioBlob, audioFilename);\n  // Get the user's preferred language\n  var language = navigator.language;\n  // Post the audio to the server for transcription\n  fetch(config.apiServerUrl + \"/transcribe?language=\" + language, {\n    method: \"POST\",\n    body: formData\n  }).then(function (response) {\n    if (!response.ok) {\n      throw Error(response.statusText);\n    }\n    return response.json();\n  }).then(function (responseJson) {\n    dispatchCustomEvent(\"saypi:transcribed\", {\n      text: responseJson.text\n    });\n  })[\"catch\"](function (error) {\n    console.error(\"Looks like there was a problem: \", error);\n    var textarea = document.getElementById(\"prompt\");\n    textarea.value = \"Sorry, there was a problem transcribing your audio. Please try again later.\";\n  });\n}\n\n// Declare a global variable for the mediaRecorder\nvar mediaRecorder;\nvar threshold = 1000; // 1000 ms = 1 second, about the length of \"Hey, Pi\"\n\n// This function will be called when the 'dataavailable' event fires\nfunction handleDataAvailable(e) {\n  // Add the audio data chunk to the array\n  audioDataChunks.push(e.data);\n}\n\n// This function will be called when the 'stop' event fires\nfunction handleStop() {\n  // Create a Blob from the audio data chunks\n  var audioBlob = new Blob(audioDataChunks, {\n    type: audioMimeType\n  });\n\n  // Get the stop time and calculate the duration\n  var stopTime = Date.now();\n  var duration = stopTime - window.startTime;\n\n  // If the duration is greater than the threshold, upload the audio for transcription\n  if (duration >= threshold) {\n    // download the audio\n    var url = URL.createObjectURL(audioBlob);\n    var a = document.createElement(\"a\");\n    a.style.display = \"none\";\n    a.href = url;\n    a.download = \"safari_audio.mp4\";\n    document.body.appendChild(a);\n    // a.click();\n    // Upload the audio to the server for transcription\n    uploadAudio(audioBlob);\n  }\n\n  // Clear the array for the next recording\n  audioDataChunks = [];\n}\nfunction setupRecording(callback) {\n  if (mediaRecorder) {\n    return;\n  }\n\n  // Get a stream from the user's microphone\n  navigator.mediaDevices.getUserMedia({\n    audio: true\n  }).then(function (stream) {\n    if (!MediaRecorder.isTypeSupported(audioMimeType)) {\n      // use MP4 for Safari\n      audioMimeType = \"audio/mp4\";\n    }\n    // Create a new MediaRecorder object using the stream and specifying the MIME type\n    var options = {\n      mimeType: audioMimeType\n    };\n    mediaRecorder = new MediaRecorder(stream, options);\n\n    // Listen for the 'dataavailable' event\n    mediaRecorder.addEventListener(\"dataavailable\", handleDataAvailable);\n\n    // Listen for the 'stop' event\n    mediaRecorder.addEventListener(\"stop\", handleStop);\n  }).then(function () {\n    // Invoke the callback function\n    if (typeof callback === \"function\") {\n      callback();\n    }\n  })[\"catch\"](function (err) {\n    console.error(\"Error getting audio stream: \" + err);\n  });\n}\nfunction tearDownRecording() {\n  // Check if the MediaRecorder is set up\n  if (!mediaRecorder) {\n    return;\n  }\n\n  // Stop any ongoing recording\n  if (mediaRecorder.state === \"recording\") {\n    mediaRecorder.stop();\n  }\n\n  // Remove the MediaRecorder's event listeners\n  mediaRecorder.removeEventListener(\"dataavailable\", handleDataAvailable);\n  mediaRecorder.removeEventListener(\"stop\", handleStop);\n\n  // Clear the MediaRecorder variable\n  mediaRecorder = null;\n}\n\n// This function will be called when the user presses the record button\nfunction startRecording() {\n  // Check if the MediaRecorder is set up\n  if (!mediaRecorder) {\n    setupRecording(startRecording);\n    return;\n  }\n  // Check if Pi is currently speaking and stop her audio\n  if (piAudioManager.isSpeaking) {\n    piAudioManager.pause();\n  }\n\n  // Start recording\n  mediaRecorder.start();\n\n  // Record the start time\n  window.startTime = Date.now();\n  console.log(\"User is speaking\");\n\n  // This function will be called when the user releases the record button\n  window.stopRecording = function () {\n    if (mediaRecorder && mediaRecorder.state === \"recording\") {\n      // Stop recording\n      mediaRecorder.stop();\n\n      // Record the stop time and calculate the duration\n      var stopTime = Date.now();\n      var duration = stopTime - window.startTime;\n\n      // If the duration is less than the threshold, don't upload the audio for transcription\n      if (duration < threshold) {\n        console.log(\"User stopped speaking\");\n        console.log(\"Recording was too short, not uploading for transcription\");\n        piAudioManager.resume();\n      } else {\n        console.log(\"User finished speaking\");\n        piAudioManager.stop();\n      }\n    }\n    // Remove the stopRecording function\n    delete window.stopRecording;\n  };\n}\n\n// Add the startRecording function to the window object so it can be called from outside this script\nwindow.startRecording = startRecording;");

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
    registerOtherAudioButtonEvents(button);
    registerCustomAudioEventListeners();
    registerHotkey();
  }
  function registerOtherAudioButtonEvents(button) {
    /* other handlers for the talk button, but not 'press to talk' */

    // "warm up" the microphone by acquiring it before the user presses the button
    button.addEventListener("mouseenter", setupRecording);
    button.addEventListener("mouseleave", tearDownRecording);
    window.addEventListener("beforeunload", tearDownRecording);
    button.addEventListener("touchcancel", function () {
      this.classList.remove("active"); // Remove the active class (for Firefox on Android)
      tearDownRecording();
    });
  }
  function registerCustomAudioEventListeners() {
    window.addEventListener("saypi:piReadyToRespond", function (e) {
      console.log("piReadyToRespond event received by UI script");
      if (isSafari()) {
        pokeUser();
      }
    });
    window.addEventListener("saypi:piSpeaking", function (e) {
      // Handle the piSpeaking event, e.g., start an animation or show a UI element.
      console.log("piSpeaking event received by UI script");
      if (isSafari()) {
        unpokeUser();
      }
    });
  }
  function createPlayButton() {
    var label = "Hear Pi's response";
    var playButton = buttonModule.createButton("", function () {});
    playButton.id = "saypi-playButton";
    playButton.type = "button";
    playButton.className = "hidden play-button";
    playButton.setAttribute("aria-label", label);
    playButton.setAttribute("title", label);
    playButton.addEventListener("click", handlePlayButtonClick);
    document.body.appendChild(playButton);
    return playButton;
  }
  function showPlayButton() {
    var playButton = document.getElementById("saypi-playButton");
    if (!playButton) {
      playButton = createPlayButton();
    }
    playButton.classList.remove("hidden");
  }
  function hidePlayButton() {
    var playButton = document.getElementById("saypi-playButton");
    if (playButton) {
      playButton.classList.add("hidden");
    }
  }
  var talkButton = document.getElementById("saypi-talkButton");
  function pokeUser() {
    _AnimationModule_js__WEBPACK_IMPORTED_MODULE_0__["default"].animate("readyToRespond");
    showPlayButton();
  }
  function unpokeUser() {
    _AnimationModule_js__WEBPACK_IMPORTED_MODULE_0__["default"].inanimate("readyToRespond");
    hidePlayButton();
  }
  function handlePlayButtonClick() {
    unpokeUser();
    piAudioManager.userPlay();
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

  // Start observing the entire document for changes to child nodes and subtree
  observer.observe(document, {
    childList: true,
    subtree: true
  });
})();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxxRkFBcUYsTUFBTSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssTUFBTSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssTUFBTSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssTUFBTSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssTUFBTSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssTUFBTSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxPQUFPLFlBQVksTUFBTSxTQUFTLFlBQVksTUFBTSxLQUFLLFlB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SUFBSTtJQUFFQyxPQUFPLEVBQUU7RUFBSyxDQUFDLENBQUM7QUFDaEUsQ0FBQyxFQUFFLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL0FuaW1hdGlvbk1vZHVsZS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL0J1dHRvbk1vZHVsZS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL0V2ZW50TW9kdWxlLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvbW9iaWxlLmNzcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3JlY3RhbmdsZXMuY3NzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvdGFsa0J1dHRvbi5jc3MiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvdHJhbnNjcmliZXIuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9yZWN0YW5nbGVzLnN2ZyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3dhdmVmb3JtLnN2ZyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL21vYmlsZS5jc3M/ZjZmZiIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3JlY3RhbmdsZXMuY3NzPzAzNjIiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy90YWxrQnV0dG9uLmNzcz8wN2Y1Iiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9zYXlwaS5pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBBbmltYXRpb25Nb2R1bGUge1xuICBzdGF0aWMgcmVjdGFuZ2xlc1NlbGVjdG9yID1cbiAgICBcIi5vdXRlcm1vc3QsIC5zZWNvbmQsIC50aGlyZCwgLmZvdXJ0aCwgLmZpZnRoLCAuaW5uZXJtb3N0XCI7XG4gIHN0YXRpYyB0YWxrQnV0dG9uQW5pbWF0aW9ucyA9IFtcInJlYWR5VG9SZXNwb25kXCJdO1xuXG4gIHN0YXRpYyBhbmltYXRlKGFuaW1hdGlvbikge1xuICAgIHRoaXMuc3RvcE90aGVyQW5pbWF0aW9ucyhhbmltYXRpb24pO1xuXG4gICAgbGV0IHJlY3RhbmdsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMucmVjdGFuZ2xlc1NlbGVjdG9yKTtcbiAgICByZWN0YW5nbGVzLmZvckVhY2goKHJlY3QpID0+IHJlY3QuY2xhc3NMaXN0LmFkZChhbmltYXRpb24pKTtcbiAgfVxuXG4gIHN0YXRpYyBpbmFuaW1hdGUoYW5pbWF0aW9uKSB7XG4gICAgbGV0IHJlY3RhbmdsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMucmVjdGFuZ2xlc1NlbGVjdG9yKTtcbiAgICByZWN0YW5nbGVzLmZvckVhY2goKHJlY3QpID0+IHJlY3QuY2xhc3NMaXN0LnJlbW92ZShhbmltYXRpb24pKTtcbiAgfVxuXG4gIHN0YXRpYyBzdG9wQWxsQW5pbWF0aW9ucygpIHtcbiAgICB0aGlzLnRhbGtCdXR0b25BbmltYXRpb25zLmZvckVhY2goKGFuaW1hdGlvbikgPT4gdGhpcy5pbmFuaW1hdGUoYW5pbWF0aW9uKSk7XG4gIH1cblxuICBzdGF0aWMgc3RvcE90aGVyQW5pbWF0aW9ucyhrZWVwQW5pbWF0aW9uKSB7XG4gICAgdGhpcy50YWxrQnV0dG9uQW5pbWF0aW9ucy5mb3JFYWNoKChhbmltYXRpb24pID0+IHtcbiAgICAgIGlmIChhbmltYXRpb24gIT09IGtlZXBBbmltYXRpb24pIHtcbiAgICAgICAgdGhpcy5pbmFuaW1hdGUoYW5pbWF0aW9uKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnV0dG9uTW9kdWxlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50ZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJvbXB0XCIpO1xuICAgIHRoaXMudGFsa0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F5cGktdGFsa0J1dHRvblwiKTtcbiAgfVxuXG4gIC8vIEZ1bmN0aW9uIHRvIGNyZWF0ZSBhIG5ldyBidXR0b25cbiAgY3JlYXRlQnV0dG9uKGxhYmVsLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgYnV0dG9uLnRleHRDb250ZW50ID0gbGFiZWw7XG4gICAgYnV0dG9uLm9uY2xpY2sgPSBjYWxsYmFjaztcbiAgICByZXR1cm4gYnV0dG9uO1xuICB9XG5cbiAgLy8gRnVuY3Rpb24gdG8gc3R5bGUgYSBnaXZlbiBidXR0b25cbiAgc3R5bGVCdXR0b24oYnV0dG9uLCBzdHlsZXMpIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gc3R5bGVzKSB7XG4gICAgICBpZiAoc3R5bGVzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgYnV0dG9uLnN0eWxlW2tleV0gPSBzdHlsZXNba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBTaW11bGF0ZSBhbiBcIkVudGVyXCIga2V5cHJlc3MgZXZlbnQgb24gYSBmb3JtXG4gIHNpbXVsYXRlRm9ybVN1Ym1pdCgpIHtcbiAgICBpZiAoIXRoaXMudGV4dGFyZWEpIHtcbiAgICAgIHRoaXMudGV4dGFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByb21wdFwiKTtcbiAgICB9XG4gICAgY29uc3QgZW50ZXJFdmVudCA9IG5ldyBLZXlib2FyZEV2ZW50KFwia2V5ZG93blwiLCB7XG4gICAgICBidWJibGVzOiB0cnVlLFxuICAgICAga2V5OiBcIkVudGVyXCIsXG4gICAgICBrZXlDb2RlOiAxMyxcbiAgICAgIHdoaWNoOiAxMyxcbiAgICB9KTtcblxuICAgIHRoaXMudGV4dGFyZWEuZGlzcGF0Y2hFdmVudChlbnRlckV2ZW50KTtcbiAgfVxuXG4gIC8vIEZ1bmN0aW9uIHRvIGhhbmRsZSBhdXRvLXN1Ym1pdCBiYXNlZCBvbiB0aGUgYnV0dG9uJ3MgZGF0YSBhdHRyaWJ1dGVcbiAgaGFuZGxlQXV0b1N1Ym1pdCgpIHtcbiAgICBpZiAoIXRoaXMudGFsa0J1dHRvbikge1xuICAgICAgdGhpcy50YWxrQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS10YWxrQnV0dG9uXCIpO1xuICAgIH1cbiAgICBpZiAodGhpcy50YWxrQnV0dG9uLmRhdGFzZXQuYXV0b3N1Ym1pdCA9PT0gXCJmYWxzZVwiKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkF1dG9zdWJtaXQgaXMgZGlzYWJsZWRcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2ltdWxhdGVGb3JtU3VibWl0KCk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgQnV0dG9uTW9kdWxlIGZyb20gXCIuL0J1dHRvbk1vZHVsZVwiO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRNb2R1bGUge1xuICBzdGF0aWMgY29udGV4dCA9IHdpbmRvdztcbiAgc3RhdGljIGluaXQoKSB7XG4gICAgLy8gQWxsIHRoZSBldmVudCBsaXN0ZW5lcnMgY2FuIGJlIGFkZGVkIGhlcmVcbiAgICB0aGlzLmhhbmRsZUF1ZGlvRXZlbnRzKCk7XG4gICAgLy8gQW55IG90aGVyIGluaXRpYWxpemF0aW9ucy4uLlxuICB9XG5cbiAgc3RhdGljIGNsZWFudXAoKSB7XG4gICAgLy8gUmVtb3ZlIGV2ZW50IGxpc3RlbmVycyBpZiBuZWVkZWQsIG9yIGFueSBvdGhlciBjbGVhbnVwIG9wZXJhdGlvbnNcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwic2F5cGk6dHJhbnNjcmliZWRcIixcbiAgICAgIHRoaXMuaGFuZGxlVHJhbnNjcmlwdGlvblJlc3BvbnNlXG4gICAgKTtcbiAgfVxuXG4gIHN0YXRpYyBoYW5kbGVBdWRpb0V2ZW50cygpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwic2F5cGk6dHJhbnNjcmliZWRcIixcbiAgICAgIEV2ZW50TW9kdWxlLmhhbmRsZVRyYW5zY3JpcHRpb25SZXNwb25zZVxuICAgICk7XG4gIH1cblxuICBzdGF0aWMgaGFuZGxlVHJhbnNjcmlwdGlvblJlc3BvbnNlKHRyYW5zY3JpcHRpb25FdmVudCkge1xuICAgIHZhciB0cmFuc2NyaXB0ID0gdHJhbnNjcmlwdGlvbkV2ZW50LmRldGFpbC50ZXh0O1xuICAgIHZhciB0ZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJvbXB0XCIpO1xuICAgIEV2ZW50TW9kdWxlLnNpbXVsYXRlVHlwaW5nKHRleHRhcmVhLCB0cmFuc2NyaXB0ICsgXCIgXCIpO1xuICAgIGNvbnNvbGUubG9nKFwiVHJhbnNjcmlwdDogXCIgKyB0cmFuc2NyaXB0KTtcbiAgfVxuXG4gIHN0YXRpYyBzaW11bGF0ZVR5cGluZyhlbGVtZW50LCB0ZXh0KSB7XG4gICAgY29uc3QgYnV0dG9uTW9kdWxlID0gbmV3IEJ1dHRvbk1vZHVsZSgpO1xuICAgIHZhciB3b3JkcyA9IHRleHQuc3BsaXQoXCIgXCIpO1xuICAgIHZhciBpID0gMDtcblxuICAgIGNvbnN0IHR5cGVXb3JkID0gKCkgPT4ge1xuICAgICAgaWYgKGkgPCB3b3Jkcy5sZW5ndGgpIHtcbiAgICAgICAgRXZlbnRNb2R1bGUuc2V0TmF0aXZlVmFsdWUoZWxlbWVudCwgZWxlbWVudC52YWx1ZSArIHdvcmRzW2krK10gKyBcIiBcIik7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0eXBlV29yZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBidXR0b25Nb2R1bGUuaGFuZGxlQXV0b1N1Ym1pdCgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0eXBlV29yZCgpO1xuICB9XG5cbiAgc3RhdGljIHNldE5hdGl2ZVZhbHVlKGVsZW1lbnQsIHZhbHVlKSB7XG4gICAgbGV0IGxhc3RWYWx1ZSA9IGVsZW1lbnQudmFsdWU7XG4gICAgZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xuICAgIGxldCBldmVudCA9IG5ldyBFdmVudChcImlucHV0XCIsIHsgdGFyZ2V0OiBlbGVtZW50LCBidWJibGVzOiB0cnVlIH0pO1xuICAgIC8vIFJlYWN0IDE1XG4gICAgZXZlbnQuc2ltdWxhdGVkID0gdHJ1ZTtcbiAgICAvLyBSZWFjdCAxNi0xN1xuICAgIGxldCB0cmFja2VyID0gZWxlbWVudC5fdmFsdWVUcmFja2VyO1xuICAgIGlmICh0cmFja2VyKSB7XG4gICAgICB0cmFja2VyLnNldFZhbHVlKGxhc3RWYWx1ZSk7XG4gICAgfVxuICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gIH1cblxuICBzdGF0aWMgaGFuZGxlVGFsa01vdXNlRG93bigpIHtcbiAgICBFdmVudE1vZHVsZS5pZFByb21wdFRleHRBcmVhKCk7XG4gICAgdGhpcy5jb250ZXh0LnN0YXJ0UmVjb3JkaW5nKCk7XG4gIH1cblxuICBzdGF0aWMgaGFuZGxlVGFsa01vdXNlVXAoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmNvbnRleHQ/LnN0b3BSZWNvcmRpbmcgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhpcy5jb250ZXh0LnN0b3BSZWNvcmRpbmcoKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgaGFuZGxlVGFsa0RvdWJsZUNsaWNrKGJ1dHRvbikge1xuICAgIC8vIFRvZ2dsZSB0aGUgQ1NTIGNsYXNzZXMgdG8gaW5kaWNhdGUgdGhlIG1vZGVcbiAgICBidXR0b24uY2xhc3NMaXN0LnRvZ2dsZShcImF1dG9TdWJtaXRcIik7XG4gICAgaWYgKGJ1dHRvbi5nZXRBdHRyaWJ1dGUoXCJkYXRhLWF1dG9zdWJtaXRcIikgPT09IFwidHJ1ZVwiKSB7XG4gICAgICBidXR0b24uc2V0QXR0cmlidXRlKFwiZGF0YS1hdXRvc3VibWl0XCIsIFwiZmFsc2VcIik7XG4gICAgICBjb25zb2xlLmxvZyhcImF1dG9zdWJtaXQgZGlzYWJsZWRcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJkYXRhLWF1dG9zdWJtaXRcIiwgXCJ0cnVlXCIpO1xuICAgICAgY29uc29sZS5sb2coXCJhdXRvc3VibWl0IGVuYWJsZWRcIik7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGhhbmRsZVRhbGtUb3VjaFN0YXJ0KGJ1dHRvbiwgZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBFdmVudE1vZHVsZS5pZFByb21wdFRleHRBcmVhKCk7XG4gICAgdGhpcy5jb250ZXh0LnN0YXJ0UmVjb3JkaW5nKCk7XG4gICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gIH1cblxuICBzdGF0aWMgaGFuZGxlVGFsa1RvdWNoRW5kKGJ1dHRvbikge1xuICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuICAgIHRoaXMuY29udGV4dC5zdG9wUmVjb3JkaW5nKCk7XG4gIH1cblxuICBzdGF0aWMgc2V0Q29udGV4dChjdHgpIHtcbiAgICB0aGlzLmNvbnRleHQgPSBjdHg7XG4gIH1cblxuICBzdGF0aWMgaWRQcm9tcHRUZXh0QXJlYSgpIHtcbiAgICB2YXIgdGV4dGFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByb21wdFwiKTtcbiAgICBpZiAoIXRleHRhcmVhKSB7XG4gICAgICAvLyBGaW5kIHRoZSBmaXJzdCA8dGV4dGFyZWE+IGVsZW1lbnQgYW5kIGdpdmUgaXQgYW4gaWRcbiAgICAgIHZhciB0ZXh0YXJlYUVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidGV4dGFyZWFcIik7XG4gICAgICBpZiAodGV4dGFyZWFFbGVtZW50KSB7XG4gICAgICAgIHRleHRhcmVhRWxlbWVudC5pZCA9IFwicHJvbXB0XCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJObyA8dGV4dGFyZWE+IGVsZW1lbnQgZm91bmRcIik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC8qIG1vYmlsZSBzdHlsZXMgZ28gaGVyZSAqL1xuICAjc2F5cGktcGFuZWwsXG4gIC5wbGF5LWJ1dHRvbiB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgcG9zaXRpb246IGZpeGVkO1xuICAgIGxlZnQ6IDA7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNDUsIDIzOCwgMjIzLCAwLjkpO1xuICB9XG4gICNzYXlwaS1wYW5lbCxcbiAgLnBsYXktYnV0dG9uIHtcbiAgICBoZWlnaHQ6IDEwMHZoO1xuICAgIHRvcDogMDtcbiAgICBwYWRkaW5nOiA1JTtcbiAgfVxuICAvKiBtYWtlIHRoZSBidXR0b25zIGZpbGwgdGhlIHBhbmVscyAqL1xuICAjc2F5cGktdGFsa0J1dHRvbiB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgaGVpZ2h0OiAxMDAlO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgIGJvcmRlci1yYWRpdXM6IDA7XG4gICAgbWFyZ2luOiAwO1xuICB9XG4gIC8qIHN1cmZhY2UgcHJpbWFyeSBjb250cm9sczogXCIuLi5cIiwgXCJleHBlcmllbmNlc1wiLCBcInVubXV0ZS9tdXRlXCIgKi9cbiAgI19fbmV4dCA+IG1haW4gPiBkaXYgPiBkaXYgPiBkaXYuZml4ZWQudG9wLTQucmlnaHQtNiA+IGJ1dHRvbixcbiAgZGl2W2RhdGEtcHJvamVjdGlvbi1pZD1cIjEyXCJdID4gYnV0dG9uIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDIpO1xuICAgIHotaW5kZXg6IDUwO1xuICB9XG4gIC8qIG92ZXJyaWRlIFJlYWN0IGNoYW5nZXMgb24gYXVkaW8gYnV0dG9uICovXG4gIGJ1dHRvbltkYXRhLXByb2plY3Rpb24taWQ9XCIxNlwiXSA+IGRpdltkYXRhLXByb2plY3Rpb24taWQ9XCIxN1wiXSxcbiAgYnV0dG9uW2RhdGEtcHJvamVjdGlvbi1pZD1cIjE2XCJdID4gZGl2W2RhdGEtcHJvamVjdGlvbi1pZD1cIjE4XCJdIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDIpICFpbXBvcnRhbnQ7XG4gICAgei1pbmRleDogNTA7XG4gIH1cbiAgLyogaGlkZSBmb290ZXIgKi9cbiAgI3NheXBpLWZvb3RlciB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvbW9iaWxlLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFLDBCQUEwQjtFQUMxQjs7SUFFRSxXQUFXO0lBQ1gsZUFBZTtJQUNmLE9BQU87SUFDUCwwQ0FBMEM7RUFDNUM7RUFDQTs7SUFFRSxhQUFhO0lBQ2IsTUFBTTtJQUNOLFdBQVc7RUFDYjtFQUNBLHFDQUFxQztFQUNyQztJQUNFLFdBQVc7SUFDWCxZQUFZO0lBQ1osNkJBQTZCO0lBQzdCLGdCQUFnQjtJQUNoQixTQUFTO0VBQ1g7RUFDQSxrRUFBa0U7RUFDbEU7O0lBRUUsbUJBQW1CO0lBQ25CLFdBQVc7RUFDYjtFQUNBLDJDQUEyQztFQUMzQzs7SUFFRSw4QkFBOEI7SUFDOUIsV0FBVztFQUNiO0VBQ0EsZ0JBQWdCO0VBQ2hCO0lBQ0UsYUFBYTtFQUNmO0FBQ0ZcIixcInNvdXJjZXNDb250ZW50XCI6W1wiQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XFxuICAvKiBtb2JpbGUgc3R5bGVzIGdvIGhlcmUgKi9cXG4gICNzYXlwaS1wYW5lbCxcXG4gIC5wbGF5LWJ1dHRvbiB7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBwb3NpdGlvbjogZml4ZWQ7XFxuICAgIGxlZnQ6IDA7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjQ1LCAyMzgsIDIyMywgMC45KTtcXG4gIH1cXG4gICNzYXlwaS1wYW5lbCxcXG4gIC5wbGF5LWJ1dHRvbiB7XFxuICAgIGhlaWdodDogMTAwdmg7XFxuICAgIHRvcDogMDtcXG4gICAgcGFkZGluZzogNSU7XFxuICB9XFxuICAvKiBtYWtlIHRoZSBidXR0b25zIGZpbGwgdGhlIHBhbmVscyAqL1xcbiAgI3NheXBpLXRhbGtCdXR0b24ge1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgaGVpZ2h0OiAxMDAlO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gICAgYm9yZGVyLXJhZGl1czogMDtcXG4gICAgbWFyZ2luOiAwO1xcbiAgfVxcbiAgLyogc3VyZmFjZSBwcmltYXJ5IGNvbnRyb2xzOiBcXFwiLi4uXFxcIiwgXFxcImV4cGVyaWVuY2VzXFxcIiwgXFxcInVubXV0ZS9tdXRlXFxcIiAqL1xcbiAgI19fbmV4dCA+IG1haW4gPiBkaXYgPiBkaXYgPiBkaXYuZml4ZWQudG9wLTQucmlnaHQtNiA+IGJ1dHRvbixcXG4gIGRpdltkYXRhLXByb2plY3Rpb24taWQ9XFxcIjEyXFxcIl0gPiBidXR0b24ge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDIpO1xcbiAgICB6LWluZGV4OiA1MDtcXG4gIH1cXG4gIC8qIG92ZXJyaWRlIFJlYWN0IGNoYW5nZXMgb24gYXVkaW8gYnV0dG9uICovXFxuICBidXR0b25bZGF0YS1wcm9qZWN0aW9uLWlkPVxcXCIxNlxcXCJdID4gZGl2W2RhdGEtcHJvamVjdGlvbi1pZD1cXFwiMTdcXFwiXSxcXG4gIGJ1dHRvbltkYXRhLXByb2plY3Rpb24taWQ9XFxcIjE2XFxcIl0gPiBkaXZbZGF0YS1wcm9qZWN0aW9uLWlkPVxcXCIxOFxcXCJdIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgyKSAhaW1wb3J0YW50O1xcbiAgICB6LWluZGV4OiA1MDtcXG4gIH1cXG4gIC8qIGhpZGUgZm9vdGVyICovXFxuICAjc2F5cGktZm9vdGVyIHtcXG4gICAgZGlzcGxheTogbm9uZTtcXG4gIH1cXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGBAa2V5ZnJhbWVzIHB1bHNlX291dGVybW9zdCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkyKTtcbiAgfVxufVxuLm91dGVybW9zdCB7XG4gIGFuaW1hdGlvbjogcHVsc2Vfb3V0ZXJtb3N0IDVzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgcHVsc2Vfc2Vjb25kIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODU2KTtcbiAgfVxufVxuLnNlY29uZCB7XG4gIGFuaW1hdGlvbjogcHVsc2Vfc2Vjb25kIDVzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgcHVsc2VfdGhpcmQge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43OTIpO1xuICB9XG59XG4udGhpcmQge1xuICBhbmltYXRpb246IHB1bHNlX3RoaXJkIDVzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgcHVsc2VfZm91cnRoIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzI4KTtcbiAgfVxufVxuLmZvdXJ0aCB7XG4gIGFuaW1hdGlvbjogcHVsc2VfZm91cnRoIDVzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgcHVsc2VfZmlmdGgge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC42NjQpO1xuICB9XG59XG4uZmlmdGgge1xuICBhbmltYXRpb246IHB1bHNlX2ZpZnRoIDVzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgcHVsc2VfaW5uZXJtb3N0IHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNik7XG4gIH1cbn1cbi5pbm5lcm1vc3Qge1xuICBhbmltYXRpb246IHB1bHNlX2lubmVybW9zdCA1cyBpbmZpbml0ZTtcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xufVxuXG4vKiBib3VuY2UgYW5pbWF0aW9uIHRvIGluZGljYXRlIFBpIGlzIHdhaXRpbmcgdG8gc3BlYWsgKi9cbkBrZXlmcmFtZXMgYm91bmNlX291dGVybW9zdCB7XG4gIDAlLFxuICAyMCUsXG4gIDUwJSxcbiAgODAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gIH1cbiAgNDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUlKTtcbiAgfVxuICA2MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMyUpO1xuICB9XG59XG4ub3V0ZXJtb3N0LnJlYWR5VG9SZXNwb25kIHtcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV9vdXRlcm1vc3Q7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xufVxuXG5Aa2V5ZnJhbWVzIGJvdW5jZV9zZWNvbmQge1xuICAwJSxcbiAgMjAlLFxuICA1MCUsXG4gIDgwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xuICB9XG4gIDQwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01LjglKTtcbiAgfVxuICA2MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMy40OCUpO1xuICB9XG59XG4uc2Vjb25kLnJlYWR5VG9SZXNwb25kIHtcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV9zZWNvbmQ7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xufVxuXG5Aa2V5ZnJhbWVzIGJvdW5jZV90aGlyZCB7XG4gIDAlLFxuICAyMCUsXG4gIDUwJSxcbiAgODAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gIH1cbiAgNDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTYuNiUpO1xuICB9XG4gIDYwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0zLjk2JSk7XG4gIH1cbn1cbi50aGlyZC5yZWFkeVRvUmVzcG9uZCB7XG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2VfdGhpcmQ7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xufVxuXG5Aa2V5ZnJhbWVzIGJvdW5jZV9mb3VydGgge1xuICAwJSxcbiAgMjAlLFxuICA1MCUsXG4gIDgwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xuICB9XG4gIDQwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC03LjQlKTtcbiAgfVxuICA2MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNC40NCUpO1xuICB9XG59XG4uZm91cnRoLnJlYWR5VG9SZXNwb25kIHtcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV9mb3VydGg7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xufVxuXG5Aa2V5ZnJhbWVzIGJvdW5jZV9maWZ0aCB7XG4gIDAlLFxuICAyMCUsXG4gIDUwJSxcbiAgODAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gIH1cbiAgNDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTguMiUpO1xuICB9XG4gIDYwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC00LjkyJSk7XG4gIH1cbn1cbi5maWZ0aC5yZWFkeVRvUmVzcG9uZCB7XG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2VfZmlmdGg7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xufVxuXG5Aa2V5ZnJhbWVzIGJvdW5jZV9pbm5lcm1vc3Qge1xuICAwJSxcbiAgMjAlLFxuICA1MCUsXG4gIDgwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xuICB9XG4gIDQwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC05JSk7XG4gIH1cbiAgNjAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUuNCUpO1xuICB9XG59XG4uaW5uZXJtb3N0LnJlYWR5VG9SZXNwb25kIHtcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV9pbm5lcm1vc3Q7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvcmVjdGFuZ2xlcy5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRTs7SUFFRSxtQkFBbUI7RUFDckI7RUFDQTtJQUNFLHNCQUFzQjtFQUN4QjtBQUNGO0FBQ0E7RUFDRSxzQ0FBc0M7RUFDdEMsd0JBQXdCO0FBQzFCOztBQUVBO0VBQ0U7O0lBRUUsbUJBQW1CO0VBQ3JCO0VBQ0E7SUFDRSx1QkFBdUI7RUFDekI7QUFDRjtBQUNBO0VBQ0UsbUNBQW1DO0VBQ25DLHdCQUF3QjtBQUMxQjs7QUFFQTtFQUNFOztJQUVFLG1CQUFtQjtFQUNyQjtFQUNBO0lBQ0UsdUJBQXVCO0VBQ3pCO0FBQ0Y7QUFDQTtFQUNFLGtDQUFrQztFQUNsQyx3QkFBd0I7QUFDMUI7O0FBRUE7RUFDRTs7SUFFRSxtQkFBbUI7RUFDckI7RUFDQTtJQUNFLHVCQUF1QjtFQUN6QjtBQUNGO0FBQ0E7RUFDRSxtQ0FBbUM7RUFDbkMsd0JBQXdCO0FBQzFCOztBQUVBO0VBQ0U7O0lBRUUsbUJBQW1CO0VBQ3JCO0VBQ0E7SUFDRSx1QkFBdUI7RUFDekI7QUFDRjtBQUNBO0VBQ0Usa0NBQWtDO0VBQ2xDLHdCQUF3QjtBQUMxQjs7QUFFQTtFQUNFOztJQUVFLG1CQUFtQjtFQUNyQjtFQUNBO0lBQ0UscUJBQXFCO0VBQ3ZCO0FBQ0Y7QUFDQTtFQUNFLHNDQUFzQztFQUN0Qyx3QkFBd0I7QUFDMUI7O0FBRUEsd0RBQXdEO0FBQ3hEO0VBQ0U7Ozs7O0lBS0Usd0JBQXdCO0VBQzFCO0VBQ0E7SUFDRSwwQkFBMEI7RUFDNUI7RUFDQTtJQUNFLDBCQUEwQjtFQUM1QjtBQUNGO0FBQ0E7RUFDRSxnQ0FBZ0M7RUFDaEMsc0JBQXNCO0VBQ3RCLG1DQUFtQztBQUNyQzs7QUFFQTtFQUNFOzs7OztJQUtFLHdCQUF3QjtFQUMxQjtFQUNBO0lBQ0UsNEJBQTRCO0VBQzlCO0VBQ0E7SUFDRSw2QkFBNkI7RUFDL0I7QUFDRjtBQUNBO0VBQ0UsNkJBQTZCO0VBQzdCLHNCQUFzQjtFQUN0QixtQ0FBbUM7QUFDckM7O0FBRUE7RUFDRTs7Ozs7SUFLRSx3QkFBd0I7RUFDMUI7RUFDQTtJQUNFLDRCQUE0QjtFQUM5QjtFQUNBO0lBQ0UsNkJBQTZCO0VBQy9CO0FBQ0Y7QUFDQTtFQUNFLDRCQUE0QjtFQUM1QixzQkFBc0I7RUFDdEIsbUNBQW1DO0FBQ3JDOztBQUVBO0VBQ0U7Ozs7O0lBS0Usd0JBQXdCO0VBQzFCO0VBQ0E7SUFDRSw0QkFBNEI7RUFDOUI7RUFDQTtJQUNFLDZCQUE2QjtFQUMvQjtBQUNGO0FBQ0E7RUFDRSw2QkFBNkI7RUFDN0Isc0JBQXNCO0VBQ3RCLG1DQUFtQztBQUNyQzs7QUFFQTtFQUNFOzs7OztJQUtFLHdCQUF3QjtFQUMxQjtFQUNBO0lBQ0UsNEJBQTRCO0VBQzlCO0VBQ0E7SUFDRSw2QkFBNkI7RUFDL0I7QUFDRjtBQUNBO0VBQ0UsNEJBQTRCO0VBQzVCLHNCQUFzQjtFQUN0QixtQ0FBbUM7QUFDckM7O0FBRUE7RUFDRTs7Ozs7SUFLRSx3QkFBd0I7RUFDMUI7RUFDQTtJQUNFLDBCQUEwQjtFQUM1QjtFQUNBO0lBQ0UsNEJBQTRCO0VBQzlCO0FBQ0Y7QUFDQTtFQUNFLGdDQUFnQztFQUNoQyxzQkFBc0I7RUFDdEIsbUNBQW1DO0FBQ3JDXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIkBrZXlmcmFtZXMgcHVsc2Vfb3V0ZXJtb3N0IHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTIpO1xcbiAgfVxcbn1cXG4ub3V0ZXJtb3N0IHtcXG4gIGFuaW1hdGlvbjogcHVsc2Vfb3V0ZXJtb3N0IDVzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHB1bHNlX3NlY29uZCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjg1Nik7XFxuICB9XFxufVxcbi5zZWNvbmQge1xcbiAgYW5pbWF0aW9uOiBwdWxzZV9zZWNvbmQgNXMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbkBrZXlmcmFtZXMgcHVsc2VfdGhpcmQge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43OTIpO1xcbiAgfVxcbn1cXG4udGhpcmQge1xcbiAgYW5pbWF0aW9uOiBwdWxzZV90aGlyZCA1cyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBwdWxzZV9mb3VydGgge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43MjgpO1xcbiAgfVxcbn1cXG4uZm91cnRoIHtcXG4gIGFuaW1hdGlvbjogcHVsc2VfZm91cnRoIDVzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHB1bHNlX2ZpZnRoIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNjY0KTtcXG4gIH1cXG59XFxuLmZpZnRoIHtcXG4gIGFuaW1hdGlvbjogcHVsc2VfZmlmdGggNXMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbkBrZXlmcmFtZXMgcHVsc2VfaW5uZXJtb3N0IHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNik7XFxuICB9XFxufVxcbi5pbm5lcm1vc3Qge1xcbiAgYW5pbWF0aW9uOiBwdWxzZV9pbm5lcm1vc3QgNXMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbi8qIGJvdW5jZSBhbmltYXRpb24gdG8gaW5kaWNhdGUgUGkgaXMgd2FpdGluZyB0byBzcGVhayAqL1xcbkBrZXlmcmFtZXMgYm91bmNlX291dGVybW9zdCB7XFxuICAwJSxcXG4gIDIwJSxcXG4gIDUwJSxcXG4gIDgwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XFxuICB9XFxuICA0MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUlKTtcXG4gIH1cXG4gIDYwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMyUpO1xcbiAgfVxcbn1cXG4ub3V0ZXJtb3N0LnJlYWR5VG9SZXNwb25kIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2Vfb3V0ZXJtb3N0O1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcXG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIGJvdW5jZV9zZWNvbmQge1xcbiAgMCUsXFxuICAyMCUsXFxuICA1MCUsXFxuICA4MCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xcbiAgfVxcbiAgNDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01LjglKTtcXG4gIH1cXG4gIDYwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMy40OCUpO1xcbiAgfVxcbn1cXG4uc2Vjb25kLnJlYWR5VG9SZXNwb25kIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2Vfc2Vjb25kO1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcXG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIGJvdW5jZV90aGlyZCB7XFxuICAwJSxcXG4gIDIwJSxcXG4gIDUwJSxcXG4gIDgwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XFxuICB9XFxuICA0MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTYuNiUpO1xcbiAgfVxcbiAgNjAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0zLjk2JSk7XFxuICB9XFxufVxcbi50aGlyZC5yZWFkeVRvUmVzcG9uZCB7XFxuICBhbmltYXRpb24tbmFtZTogYm91bmNlX3RoaXJkO1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcXG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIGJvdW5jZV9mb3VydGgge1xcbiAgMCUsXFxuICAyMCUsXFxuICA1MCUsXFxuICA4MCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xcbiAgfVxcbiAgNDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC03LjQlKTtcXG4gIH1cXG4gIDYwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNC40NCUpO1xcbiAgfVxcbn1cXG4uZm91cnRoLnJlYWR5VG9SZXNwb25kIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2VfZm91cnRoO1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcXG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIGJvdW5jZV9maWZ0aCB7XFxuICAwJSxcXG4gIDIwJSxcXG4gIDUwJSxcXG4gIDgwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XFxuICB9XFxuICA0MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTguMiUpO1xcbiAgfVxcbiAgNjAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC00LjkyJSk7XFxuICB9XFxufVxcbi5maWZ0aC5yZWFkeVRvUmVzcG9uZCB7XFxuICBhbmltYXRpb24tbmFtZTogYm91bmNlX2ZpZnRoO1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcXG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIGJvdW5jZV9pbm5lcm1vc3Qge1xcbiAgMCUsXFxuICAyMCUsXFxuICA1MCUsXFxuICA4MCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xcbiAgfVxcbiAgNDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC05JSk7XFxuICB9XFxuICA2MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUuNCUpO1xcbiAgfVxcbn1cXG4uaW5uZXJtb3N0LnJlYWR5VG9SZXNwb25kIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2VfaW5uZXJtb3N0O1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcXG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYEBrZXlmcmFtZXMgcHVsc2Uge1xuICAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45KTtcbiAgfVxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICB9XG59XG4jc2F5cGktdGFsa0J1dHRvbixcbi5wbGF5LWJ1dHRvbiB7XG4gIG1hcmdpbi10b3A6IDAuMjVyZW07XG4gIGJvcmRlci1yYWRpdXM6IDE4cHg7XG4gIHdpZHRoOiAxMjBweDtcbiAgZGlzcGxheTogYmxvY2s7IC8qIEZvciBTYWZhcmkgKi9cbn1cblxuaHRtbDpub3QoLmZpcmVmb3gtYW5kcm9pZCkgI3NheXBpLXRhbGtCdXR0b246YWN0aXZlIC53YXZlZm9ybSxcbiNzYXlwaS10YWxrQnV0dG9uLmFjdGl2ZSAud2F2ZWZvcm0ge1xuICBhbmltYXRpb246IHB1bHNlIDFzIGluZmluaXRlO1xufVxuI3NheXBpLXRhbGtCdXR0b24gLndhdmVmb3JtIHtcbiAgZmlsbDogIzc3NmQ2ZDtcbn1cbiNzYXlwaS10YWxrQnV0dG9uLmF1dG9TdWJtaXQgLndhdmVmb3JtIHtcbiAgZmlsbDogcmdiKDY1IDEzOCA0Nyk7IC8qIFBpJ3MgdGV4dC1icmFuZC1ncmVlbi02MDAgKi9cbn1cbi5oaWRkZW4ge1xuICBkaXNwbGF5OiBub25lO1xufVxuI3NheXBpLXBsYXlCdXR0b24ucGxheS1idXR0b24ge1xuICAvKiBwb3NpdGlvbiBvdmVyIHRoZSB0YWxrIGJ1dHRvbiwgYnV0IHVuZGVyIGFueSBjb250cm9scyAqL1xuICB6LWluZGV4OiA3MDsgLyogdGFsayBidXR0b24gei1pbmRleCBpcyA1OSBvciA2MCAqL1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDApOyAvKiB0cmFuc3BhcmVudCB3aXRob3V0IGhvbGVzICovXG4gIGJvcmRlcjogbm9uZTtcbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3RhbGtCdXR0b24uY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0U7SUFDRSxtQkFBbUI7RUFDckI7RUFDQTtJQUNFLHFCQUFxQjtFQUN2QjtFQUNBO0lBQ0UsbUJBQW1CO0VBQ3JCO0FBQ0Y7QUFDQTs7RUFFRSxtQkFBbUI7RUFDbkIsbUJBQW1CO0VBQ25CLFlBQVk7RUFDWixjQUFjLEVBQUUsZUFBZTtBQUNqQzs7QUFFQTs7RUFFRSw0QkFBNEI7QUFDOUI7QUFDQTtFQUNFLGFBQWE7QUFDZjtBQUNBO0VBQ0Usb0JBQW9CLEVBQUUsOEJBQThCO0FBQ3REO0FBQ0E7RUFDRSxhQUFhO0FBQ2Y7QUFDQTtFQUNFLDBEQUEwRDtFQUMxRCxXQUFXLEVBQUUsb0NBQW9DO0VBQ2pELGtDQUFrQyxFQUFFLDhCQUE4QjtFQUNsRSxZQUFZO0FBQ2RcIixcInNvdXJjZXNDb250ZW50XCI6W1wiQGtleWZyYW1lcyBwdWxzZSB7XFxuICAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOSk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG59XFxuI3NheXBpLXRhbGtCdXR0b24sXFxuLnBsYXktYnV0dG9uIHtcXG4gIG1hcmdpbi10b3A6IDAuMjVyZW07XFxuICBib3JkZXItcmFkaXVzOiAxOHB4O1xcbiAgd2lkdGg6IDEyMHB4O1xcbiAgZGlzcGxheTogYmxvY2s7IC8qIEZvciBTYWZhcmkgKi9cXG59XFxuXFxuaHRtbDpub3QoLmZpcmVmb3gtYW5kcm9pZCkgI3NheXBpLXRhbGtCdXR0b246YWN0aXZlIC53YXZlZm9ybSxcXG4jc2F5cGktdGFsa0J1dHRvbi5hY3RpdmUgLndhdmVmb3JtIHtcXG4gIGFuaW1hdGlvbjogcHVsc2UgMXMgaW5maW5pdGU7XFxufVxcbiNzYXlwaS10YWxrQnV0dG9uIC53YXZlZm9ybSB7XFxuICBmaWxsOiAjNzc2ZDZkO1xcbn1cXG4jc2F5cGktdGFsa0J1dHRvbi5hdXRvU3VibWl0IC53YXZlZm9ybSB7XFxuICBmaWxsOiByZ2IoNjUgMTM4IDQ3KTsgLyogUGkncyB0ZXh0LWJyYW5kLWdyZWVuLTYwMCAqL1xcbn1cXG4uaGlkZGVuIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcbiNzYXlwaS1wbGF5QnV0dG9uLnBsYXktYnV0dG9uIHtcXG4gIC8qIHBvc2l0aW9uIG92ZXIgdGhlIHRhbGsgYnV0dG9uLCBidXQgdW5kZXIgYW55IGNvbnRyb2xzICovXFxuICB6LWluZGV4OiA3MDsgLyogdGFsayBidXR0b24gei1pbmRleCBpcyA1OSBvciA2MCAqL1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwKTsgLyogdHJhbnNwYXJlbnQgd2l0aG91dCBob2xlcyAqL1xcbiAgYm9yZGVyOiBub25lO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsImV4cG9ydCBkZWZhdWx0IFwiLy8gRGlzcGF0Y2ggQ3VzdG9tIEV2ZW50XFxuZnVuY3Rpb24gZGlzcGF0Y2hDdXN0b21FdmVudChldmVudE5hbWUpIHtcXG4gIHZhciBkZXRhaWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xcbiAgdmFyIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwge1xcbiAgICBkZXRhaWw6IGRldGFpbFxcbiAgfSk7XFxuICB3aW5kb3cuZGlzcGF0Y2hFdmVudChldmVudCk7XFxufVxcblxcbi8vIGF1ZGlvIG91dHB1dCAoUGkpXFxudmFyIGF1ZGlvRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXFxcImF1ZGlvXFxcIik7XFxuaWYgKCFhdWRpb0VsZW1lbnQpIHtcXG4gIGNvbnNvbGUuZXJyb3IoXFxcIkF1ZGlvIGVsZW1lbnQgbm90IGZvdW5kIVxcXCIpO1xcbn1cXG5mdW5jdGlvbiBpc1NhZmFyaSgpIHtcXG4gIHJldHVybiAvXigoPyFjaHJvbWV8YW5kcm9pZCkuKSpzYWZhcmkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xcbn1cXG5hdWRpb0VsZW1lbnQucHJlbG9hZCA9IFxcXCJhdXRvXFxcIjsgLy8gZW5hYmxlIGFnZ3Jlc3NpdmUgcHJlbG9hZGluZyBvZiBhdWRpb1xcbnZhciBwaUF1ZGlvTWFuYWdlciA9IHtcXG4gIGlzU3BlYWtpbmc6IGZhbHNlLFxcbiAgYXVkaW9FbGVtZW50OiBhdWRpb0VsZW1lbnQsXFxuICBfdXNlclN0YXJ0ZWQ6IHRydWUsXFxuICAvLyBmbGFnIHRvIGluZGljYXRlIHBsYXliYWNrIGhhcyBiZWVuIHN0YXJ0ZWQgYnkgdGhlIHVzZXIgKHRydWUgYnkgZGVmYXVsdCBiZWNhdXNlIHVzZXIgbXVzdCByZXF1ZXN0IGluaXRpYWwgcGxheWJhY2spXFxuICBfaXNMb2FkQ2FsbGVkOiBmYWxzZSxcXG4gIC8vIGZsYWcgdG8gaW5kaWNhdGUgaWYgdGhlIGxvYWQoKSBtZXRob2QgaGFzIGJlZW4gY2FsbGVkIG9uIHRoZSBhdWRpbyBlbGVtZW50XFxuXFxuICBpc0xvYWRDYWxsZWQ6IGZ1bmN0aW9uIGlzTG9hZENhbGxlZCgpIHtcXG4gICAgcmV0dXJuIHRoaXMuX2lzTG9hZENhbGxlZDtcXG4gIH0sXFxuICBzZXRJc0xvYWRDYWxsZWQ6IGZ1bmN0aW9uIHNldElzTG9hZENhbGxlZCh2YWx1ZSkge1xcbiAgICB0aGlzLl9pc0xvYWRDYWxsZWQgPSB2YWx1ZTtcXG4gIH0sXFxuICB1c2VyUGxheTogZnVuY3Rpb24gdXNlclBsYXkoKSB7XFxuICAgIGlmICghaXNTYWZhcmkoKSkge1xcbiAgICAgIHJldHVybjtcXG4gICAgfVxcbiAgICB0aGlzLl91c2VyU3RhcnRlZCA9IHRydWU7IC8vIHNldCBhIGZsYWcgdG8gaW5kaWNhdGUgcGxheWJhY2sgaGFzIGJlZW4gc3RhcnRlZCBieSB0aGUgdXNlclxcbiAgICB0aGlzLmF1ZGlvRWxlbWVudC5sb2FkKCk7IC8vIHJlc2V0IGZvciBTYWZhcmlcXG4gICAgdGhpcy5hdWRpb0VsZW1lbnQucGxheSgpO1xcbiAgICBjb25zb2xlLmxvZyhcXFwiVXNlciBzdGFydGVkIHBsYXliYWNrXFxcIik7XFxuICB9LFxcbiAgYXV0b1BsYXk6IGZ1bmN0aW9uIGF1dG9QbGF5KCkge1xcbiAgICBpZiAoIXRoaXMuX3VzZXJTdGFydGVkKSB7XFxuICAgICAgdGhpcy5hdWRpb0VsZW1lbnQucGF1c2UoKTtcXG4gICAgICBjb25zb2xlLmxvZyhcXFwiQXV0b3BsYXkgcHJldmVudGVkXFxcIik7XFxuICAgIH1cXG4gIH0sXFxuICBzdG9wOiBmdW5jdGlvbiBzdG9wKCkge1xcbiAgICBpZiAodGhpcy5pc1NwZWFraW5nKSB7XFxuICAgICAgdGhpcy5hdWRpb0VsZW1lbnQucGF1c2UoKTtcXG4gICAgfVxcbiAgICBpZiAodGhpcy5hdWRpb0VsZW1lbnQuZHVyYXRpb24gJiYgIXRoaXMuYXVkaW9FbGVtZW50LmVuZGVkICYmIHRoaXMuYXVkaW9FbGVtZW50LmN1cnJlbnRUaW1lIDwgdGhpcy5hdWRpb0VsZW1lbnQuZHVyYXRpb24pIHtcXG4gICAgICB0aGlzLmF1ZGlvRWxlbWVudC5jdXJyZW50VGltZSA9IHRoaXMuYXVkaW9FbGVtZW50LmR1cmF0aW9uOyAvLyBzZWVrIHRoZSBhdWRpbyB0byB0aGUgZW5kXFxuICAgICAgdGhpcy5hdWRpb0VsZW1lbnQucGxheSgpOyAvLyB0cmlnZ2VyIHRoZSBlbmRlZCBldmVudFxcbiAgICB9XFxuICB9LFxcblxcbiAgcGF1c2U6IGZ1bmN0aW9uIHBhdXNlKCkge1xcbiAgICB0aGlzLmF1ZGlvRWxlbWVudC5wYXVzZSgpO1xcbiAgfSxcXG4gIHJlc3VtZTogZnVuY3Rpb24gcmVzdW1lKCkge1xcbiAgICB0aGlzLmF1ZGlvRWxlbWVudC5wbGF5KCk7XFxuICB9LFxcbiAgcGxheWluZzogZnVuY3Rpb24gcGxheWluZygpIHtcXG4gICAgdGhpcy5pc1NwZWFraW5nID0gdHJ1ZTtcXG4gIH0sXFxuICBzdG9wcGVkOiBmdW5jdGlvbiBzdG9wcGVkKCkge1xcbiAgICB0aGlzLmlzU3BlYWtpbmcgPSBmYWxzZTtcXG4gICAgdGhpcy5fdXNlclN0YXJ0ZWQgPSBmYWxzZTtcXG4gIH1cXG59O1xcblxcbi8vIEludGVyY2VwdCBBdXRvcGxheSBFdmVudHMgKGF1dG9wbGF5IGRvZXNuJ3Qgd29yayBvbiBTYWZhcmkpXFxuYXVkaW9FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXFxcInBsYXlcXFwiLCBmdW5jdGlvbiAoKSB7XFxuICBpZiAoaXNTYWZhcmkoKSkge1xcbiAgICBwaUF1ZGlvTWFuYWdlci5hdXRvUGxheSgpO1xcbiAgfVxcbn0pO1xcbmF1ZGlvRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxcXCJsb2Fkc3RhcnRcXFwiLCBmdW5jdGlvbiAoKSB7XFxuICBpZiAoaXNTYWZhcmkoKSkge1xcbiAgICBjb25zb2xlLmxvZyhcXFwiUGkgaXMgd2FpdGluZyB0byBzcGVha1xcXCIpO1xcbiAgICBkaXNwYXRjaEN1c3RvbUV2ZW50KFxcXCJzYXlwaTpwaVJlYWR5VG9SZXNwb25kXFxcIik7XFxuICB9XFxufSk7XFxuXFxuLy8gRXZlbnQgbGlzdGVuZXJzIGZvciBkZXRlY3Rpbmcgd2hlbiBQaSBpcyBzcGVha2luZ1xcbmF1ZGlvRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxcXCJwbGF5aW5nXFxcIiwgZnVuY3Rpb24gKCkge1xcbiAgY29uc29sZS5sb2coXFxcIlBpIGlzIHNwZWFraW5nXFxcIik7XFxuICBwaUF1ZGlvTWFuYWdlci5wbGF5aW5nKCk7XFxuICBkaXNwYXRjaEN1c3RvbUV2ZW50KFxcXCJzYXlwaTpwaVNwZWFraW5nXFxcIik7XFxufSk7XFxuYXVkaW9FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXFxcInBhdXNlXFxcIiwgZnVuY3Rpb24gKCkge1xcbiAgY29uc29sZS5sb2coXFxcIlBpIHN0b3BwZWQgc3BlYWtpbmdcXFwiKTtcXG4gIHBpQXVkaW9NYW5hZ2VyLnN0b3BwZWQoKTtcXG4gIGRpc3BhdGNoQ3VzdG9tRXZlbnQoXFxcInNheXBpOnBpU3RvcHBlZFNwZWFraW5nXFxcIik7XFxufSk7XFxuYXVkaW9FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXFxcImVuZGVkXFxcIiwgZnVuY3Rpb24gKCkge1xcbiAgY29uc29sZS5sb2coXFxcIlBpIGZpbmlzaGVkIHNwZWFraW5nXFxcIik7XFxuICBwaUF1ZGlvTWFuYWdlci5zdG9wcGVkKCk7XFxuICBkaXNwYXRjaEN1c3RvbUV2ZW50KFxcXCJzYXlwaTpwaUZpbmlzaGVkU3BlYWtpbmdcXFwiKTtcXG59KTtcXG5cXG4vLyBhdWRpbyBpbnB1dCAodXNlcilcXG52YXIgYXVkaW9EYXRhQ2h1bmtzID0gW107XFxudmFyIGF1ZGlvTWltZVR5cGUgPSBcXFwiYXVkaW8vd2VibTtjb2RlY3M9b3B1c1xcXCI7XFxuZnVuY3Rpb24gdXBsb2FkQXVkaW8oYXVkaW9CbG9iKSB7XFxuICAvLyBDcmVhdGUgYSBGb3JtRGF0YSBvYmplY3RcXG4gIHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xcbiAgdmFyIGF1ZGlvRmlsZW5hbWUgPSBcXFwiYXVkaW8ud2VibVxcXCI7XFxuICBpZiAoYXVkaW9CbG9iLnR5cGUgPT09IFxcXCJhdWRpby9tcDRcXFwiKSB7XFxuICAgIGF1ZGlvRmlsZW5hbWUgPSBcXFwiYXVkaW8ubXA0XFxcIjtcXG4gIH1cXG4gIC8vIEFkZCB0aGUgYXVkaW8gYmxvYiB0byB0aGUgRm9ybURhdGEgb2JqZWN0XFxuICBmb3JtRGF0YS5hcHBlbmQoXFxcImF1ZGlvXFxcIiwgYXVkaW9CbG9iLCBhdWRpb0ZpbGVuYW1lKTtcXG4gIC8vIEdldCB0aGUgdXNlcidzIHByZWZlcnJlZCBsYW5ndWFnZVxcbiAgdmFyIGxhbmd1YWdlID0gbmF2aWdhdG9yLmxhbmd1YWdlO1xcbiAgLy8gUG9zdCB0aGUgYXVkaW8gdG8gdGhlIHNlcnZlciBmb3IgdHJhbnNjcmlwdGlvblxcbiAgZmV0Y2goY29uZmlnLmFwaVNlcnZlclVybCArIFxcXCIvdHJhbnNjcmliZT9sYW5ndWFnZT1cXFwiICsgbGFuZ3VhZ2UsIHtcXG4gICAgbWV0aG9kOiBcXFwiUE9TVFxcXCIsXFxuICAgIGJvZHk6IGZvcm1EYXRhXFxuICB9KS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xcbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XFxuICAgICAgdGhyb3cgRXJyb3IocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XFxuICAgIH1cXG4gICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcXG4gIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlSnNvbikge1xcbiAgICBkaXNwYXRjaEN1c3RvbUV2ZW50KFxcXCJzYXlwaTp0cmFuc2NyaWJlZFxcXCIsIHtcXG4gICAgICB0ZXh0OiByZXNwb25zZUpzb24udGV4dFxcbiAgICB9KTtcXG4gIH0pW1xcXCJjYXRjaFxcXCJdKGZ1bmN0aW9uIChlcnJvcikge1xcbiAgICBjb25zb2xlLmVycm9yKFxcXCJMb29rcyBsaWtlIHRoZXJlIHdhcyBhIHByb2JsZW06IFxcXCIsIGVycm9yKTtcXG4gICAgdmFyIHRleHRhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXFxcInByb21wdFxcXCIpO1xcbiAgICB0ZXh0YXJlYS52YWx1ZSA9IFxcXCJTb3JyeSwgdGhlcmUgd2FzIGEgcHJvYmxlbSB0cmFuc2NyaWJpbmcgeW91ciBhdWRpby4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlci5cXFwiO1xcbiAgfSk7XFxufVxcblxcbi8vIERlY2xhcmUgYSBnbG9iYWwgdmFyaWFibGUgZm9yIHRoZSBtZWRpYVJlY29yZGVyXFxudmFyIG1lZGlhUmVjb3JkZXI7XFxudmFyIHRocmVzaG9sZCA9IDEwMDA7IC8vIDEwMDAgbXMgPSAxIHNlY29uZCwgYWJvdXQgdGhlIGxlbmd0aCBvZiBcXFwiSGV5LCBQaVxcXCJcXG5cXG4vLyBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlICdkYXRhYXZhaWxhYmxlJyBldmVudCBmaXJlc1xcbmZ1bmN0aW9uIGhhbmRsZURhdGFBdmFpbGFibGUoZSkge1xcbiAgLy8gQWRkIHRoZSBhdWRpbyBkYXRhIGNodW5rIHRvIHRoZSBhcnJheVxcbiAgYXVkaW9EYXRhQ2h1bmtzLnB1c2goZS5kYXRhKTtcXG59XFxuXFxuLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSAnc3RvcCcgZXZlbnQgZmlyZXNcXG5mdW5jdGlvbiBoYW5kbGVTdG9wKCkge1xcbiAgLy8gQ3JlYXRlIGEgQmxvYiBmcm9tIHRoZSBhdWRpbyBkYXRhIGNodW5rc1xcbiAgdmFyIGF1ZGlvQmxvYiA9IG5ldyBCbG9iKGF1ZGlvRGF0YUNodW5rcywge1xcbiAgICB0eXBlOiBhdWRpb01pbWVUeXBlXFxuICB9KTtcXG5cXG4gIC8vIEdldCB0aGUgc3RvcCB0aW1lIGFuZCBjYWxjdWxhdGUgdGhlIGR1cmF0aW9uXFxuICB2YXIgc3RvcFRpbWUgPSBEYXRlLm5vdygpO1xcbiAgdmFyIGR1cmF0aW9uID0gc3RvcFRpbWUgLSB3aW5kb3cuc3RhcnRUaW1lO1xcblxcbiAgLy8gSWYgdGhlIGR1cmF0aW9uIGlzIGdyZWF0ZXIgdGhhbiB0aGUgdGhyZXNob2xkLCB1cGxvYWQgdGhlIGF1ZGlvIGZvciB0cmFuc2NyaXB0aW9uXFxuICBpZiAoZHVyYXRpb24gPj0gdGhyZXNob2xkKSB7XFxuICAgIC8vIGRvd25sb2FkIHRoZSBhdWRpb1xcbiAgICB2YXIgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChhdWRpb0Jsb2IpO1xcbiAgICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXFxcImFcXFwiKTtcXG4gICAgYS5zdHlsZS5kaXNwbGF5ID0gXFxcIm5vbmVcXFwiO1xcbiAgICBhLmhyZWYgPSB1cmw7XFxuICAgIGEuZG93bmxvYWQgPSBcXFwic2FmYXJpX2F1ZGlvLm1wNFxcXCI7XFxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYSk7XFxuICAgIC8vIGEuY2xpY2soKTtcXG4gICAgLy8gVXBsb2FkIHRoZSBhdWRpbyB0byB0aGUgc2VydmVyIGZvciB0cmFuc2NyaXB0aW9uXFxuICAgIHVwbG9hZEF1ZGlvKGF1ZGlvQmxvYik7XFxuICB9XFxuXFxuICAvLyBDbGVhciB0aGUgYXJyYXkgZm9yIHRoZSBuZXh0IHJlY29yZGluZ1xcbiAgYXVkaW9EYXRhQ2h1bmtzID0gW107XFxufVxcbmZ1bmN0aW9uIHNldHVwUmVjb3JkaW5nKGNhbGxiYWNrKSB7XFxuICBpZiAobWVkaWFSZWNvcmRlcikge1xcbiAgICByZXR1cm47XFxuICB9XFxuXFxuICAvLyBHZXQgYSBzdHJlYW0gZnJvbSB0aGUgdXNlcidzIG1pY3JvcGhvbmVcXG4gIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKHtcXG4gICAgYXVkaW86IHRydWVcXG4gIH0pLnRoZW4oZnVuY3Rpb24gKHN0cmVhbSkge1xcbiAgICBpZiAoIU1lZGlhUmVjb3JkZXIuaXNUeXBlU3VwcG9ydGVkKGF1ZGlvTWltZVR5cGUpKSB7XFxuICAgICAgLy8gdXNlIE1QNCBmb3IgU2FmYXJpXFxuICAgICAgYXVkaW9NaW1lVHlwZSA9IFxcXCJhdWRpby9tcDRcXFwiO1xcbiAgICB9XFxuICAgIC8vIENyZWF0ZSBhIG5ldyBNZWRpYVJlY29yZGVyIG9iamVjdCB1c2luZyB0aGUgc3RyZWFtIGFuZCBzcGVjaWZ5aW5nIHRoZSBNSU1FIHR5cGVcXG4gICAgdmFyIG9wdGlvbnMgPSB7XFxuICAgICAgbWltZVR5cGU6IGF1ZGlvTWltZVR5cGVcXG4gICAgfTtcXG4gICAgbWVkaWFSZWNvcmRlciA9IG5ldyBNZWRpYVJlY29yZGVyKHN0cmVhbSwgb3B0aW9ucyk7XFxuXFxuICAgIC8vIExpc3RlbiBmb3IgdGhlICdkYXRhYXZhaWxhYmxlJyBldmVudFxcbiAgICBtZWRpYVJlY29yZGVyLmFkZEV2ZW50TGlzdGVuZXIoXFxcImRhdGFhdmFpbGFibGVcXFwiLCBoYW5kbGVEYXRhQXZhaWxhYmxlKTtcXG5cXG4gICAgLy8gTGlzdGVuIGZvciB0aGUgJ3N0b3AnIGV2ZW50XFxuICAgIG1lZGlhUmVjb3JkZXIuYWRkRXZlbnRMaXN0ZW5lcihcXFwic3RvcFxcXCIsIGhhbmRsZVN0b3ApO1xcbiAgfSkudGhlbihmdW5jdGlvbiAoKSB7XFxuICAgIC8vIEludm9rZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cXG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXFxcImZ1bmN0aW9uXFxcIikge1xcbiAgICAgIGNhbGxiYWNrKCk7XFxuICAgIH1cXG4gIH0pW1xcXCJjYXRjaFxcXCJdKGZ1bmN0aW9uIChlcnIpIHtcXG4gICAgY29uc29sZS5lcnJvcihcXFwiRXJyb3IgZ2V0dGluZyBhdWRpbyBzdHJlYW06IFxcXCIgKyBlcnIpO1xcbiAgfSk7XFxufVxcbmZ1bmN0aW9uIHRlYXJEb3duUmVjb3JkaW5nKCkge1xcbiAgLy8gQ2hlY2sgaWYgdGhlIE1lZGlhUmVjb3JkZXIgaXMgc2V0IHVwXFxuICBpZiAoIW1lZGlhUmVjb3JkZXIpIHtcXG4gICAgcmV0dXJuO1xcbiAgfVxcblxcbiAgLy8gU3RvcCBhbnkgb25nb2luZyByZWNvcmRpbmdcXG4gIGlmIChtZWRpYVJlY29yZGVyLnN0YXRlID09PSBcXFwicmVjb3JkaW5nXFxcIikge1xcbiAgICBtZWRpYVJlY29yZGVyLnN0b3AoKTtcXG4gIH1cXG5cXG4gIC8vIFJlbW92ZSB0aGUgTWVkaWFSZWNvcmRlcidzIGV2ZW50IGxpc3RlbmVyc1xcbiAgbWVkaWFSZWNvcmRlci5yZW1vdmVFdmVudExpc3RlbmVyKFxcXCJkYXRhYXZhaWxhYmxlXFxcIiwgaGFuZGxlRGF0YUF2YWlsYWJsZSk7XFxuICBtZWRpYVJlY29yZGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoXFxcInN0b3BcXFwiLCBoYW5kbGVTdG9wKTtcXG5cXG4gIC8vIENsZWFyIHRoZSBNZWRpYVJlY29yZGVyIHZhcmlhYmxlXFxuICBtZWRpYVJlY29yZGVyID0gbnVsbDtcXG59XFxuXFxuLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSB1c2VyIHByZXNzZXMgdGhlIHJlY29yZCBidXR0b25cXG5mdW5jdGlvbiBzdGFydFJlY29yZGluZygpIHtcXG4gIC8vIENoZWNrIGlmIHRoZSBNZWRpYVJlY29yZGVyIGlzIHNldCB1cFxcbiAgaWYgKCFtZWRpYVJlY29yZGVyKSB7XFxuICAgIHNldHVwUmVjb3JkaW5nKHN0YXJ0UmVjb3JkaW5nKTtcXG4gICAgcmV0dXJuO1xcbiAgfVxcbiAgLy8gQ2hlY2sgaWYgUGkgaXMgY3VycmVudGx5IHNwZWFraW5nIGFuZCBzdG9wIGhlciBhdWRpb1xcbiAgaWYgKHBpQXVkaW9NYW5hZ2VyLmlzU3BlYWtpbmcpIHtcXG4gICAgcGlBdWRpb01hbmFnZXIucGF1c2UoKTtcXG4gIH1cXG5cXG4gIC8vIFN0YXJ0IHJlY29yZGluZ1xcbiAgbWVkaWFSZWNvcmRlci5zdGFydCgpO1xcblxcbiAgLy8gUmVjb3JkIHRoZSBzdGFydCB0aW1lXFxuICB3aW5kb3cuc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcXG4gIGNvbnNvbGUubG9nKFxcXCJVc2VyIGlzIHNwZWFraW5nXFxcIik7XFxuXFxuICAvLyBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlIHVzZXIgcmVsZWFzZXMgdGhlIHJlY29yZCBidXR0b25cXG4gIHdpbmRvdy5zdG9wUmVjb3JkaW5nID0gZnVuY3Rpb24gKCkge1xcbiAgICBpZiAobWVkaWFSZWNvcmRlciAmJiBtZWRpYVJlY29yZGVyLnN0YXRlID09PSBcXFwicmVjb3JkaW5nXFxcIikge1xcbiAgICAgIC8vIFN0b3AgcmVjb3JkaW5nXFxuICAgICAgbWVkaWFSZWNvcmRlci5zdG9wKCk7XFxuXFxuICAgICAgLy8gUmVjb3JkIHRoZSBzdG9wIHRpbWUgYW5kIGNhbGN1bGF0ZSB0aGUgZHVyYXRpb25cXG4gICAgICB2YXIgc3RvcFRpbWUgPSBEYXRlLm5vdygpO1xcbiAgICAgIHZhciBkdXJhdGlvbiA9IHN0b3BUaW1lIC0gd2luZG93LnN0YXJ0VGltZTtcXG5cXG4gICAgICAvLyBJZiB0aGUgZHVyYXRpb24gaXMgbGVzcyB0aGFuIHRoZSB0aHJlc2hvbGQsIGRvbid0IHVwbG9hZCB0aGUgYXVkaW8gZm9yIHRyYW5zY3JpcHRpb25cXG4gICAgICBpZiAoZHVyYXRpb24gPCB0aHJlc2hvbGQpIHtcXG4gICAgICAgIGNvbnNvbGUubG9nKFxcXCJVc2VyIHN0b3BwZWQgc3BlYWtpbmdcXFwiKTtcXG4gICAgICAgIGNvbnNvbGUubG9nKFxcXCJSZWNvcmRpbmcgd2FzIHRvbyBzaG9ydCwgbm90IHVwbG9hZGluZyBmb3IgdHJhbnNjcmlwdGlvblxcXCIpO1xcbiAgICAgICAgcGlBdWRpb01hbmFnZXIucmVzdW1lKCk7XFxuICAgICAgfSBlbHNlIHtcXG4gICAgICAgIGNvbnNvbGUubG9nKFxcXCJVc2VyIGZpbmlzaGVkIHNwZWFraW5nXFxcIik7XFxuICAgICAgICBwaUF1ZGlvTWFuYWdlci5zdG9wKCk7XFxuICAgICAgfVxcbiAgICB9XFxuICAgIC8vIFJlbW92ZSB0aGUgc3RvcFJlY29yZGluZyBmdW5jdGlvblxcbiAgICBkZWxldGUgd2luZG93LnN0b3BSZWNvcmRpbmc7XFxuICB9O1xcbn1cXG5cXG4vLyBBZGQgdGhlIHN0YXJ0UmVjb3JkaW5nIGZ1bmN0aW9uIHRvIHRoZSB3aW5kb3cgb2JqZWN0IHNvIGl0IGNhbiBiZSBjYWxsZWQgZnJvbSBvdXRzaWRlIHRoaXMgc2NyaXB0XFxud2luZG93LnN0YXJ0UmVjb3JkaW5nID0gc3RhcnRSZWNvcmRpbmc7XCI7IiwiZXhwb3J0IGRlZmF1bHQgXCI8P3htbCB2ZXJzaW9uPVxcXCIxLjBcXFwiIGVuY29kaW5nPVxcXCJVVEYtOFxcXCI/PlxcbjxzdmcgaWQ9XFxcIkxheWVyXzFcXFwiIGRhdGEtbmFtZT1cXFwiTGF5ZXIgMVxcXCIgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMzA3IDY0MFxcXCI+XFxuICA8ZGVmcz5cXG4gICAgPHN0eWxlPlxcbiAgICAgIC5pbm5lcm1vc3QsIC5zZWNvbmQsIC50aGlyZCwgLmZvdXJ0aCwgLmZpZnRoLCAub3V0ZXJtb3N0IHtcXG4gICAgICAgIHN0cm9rZS13aWR0aDogMHB4O1xcbiAgICAgIH1cXG4gICAgICBcXG4gICAgICAub3V0ZXJtb3N0IHtcXG4gICAgICAgIGZpbGw6ICNlNGYyZDE7XFxuICAgICAgfVxcblxcbiAgICAgIC5zZWNvbmQge1xcbiAgICAgICAgZmlsbDogI2NjZThiNTtcXG4gICAgICB9XFxuXFxuICAgICAgLnRoaXJkIHtcXG4gICAgICAgIGZpbGw6ICNiM2RiOTU7XFxuICAgICAgfVxcblxcbiAgICAgIC5mb3VydGgge1xcbiAgICAgICAgZmlsbDogIzliZDA3ODtcXG4gICAgICB9XFxuXFxuICAgICAgLmZpZnRoIHtcXG4gICAgICAgIGZpbGw6ICM4M2M1NWM7XFxuICAgICAgfVxcblxcbiAgICAgIC5pbm5lcm1vc3Qge1xcbiAgICAgICAgZmlsbDogIzQyOGEyZjtcXG4gICAgICB9XFxuICAgIDwvc3R5bGU+XFxuICA8L2RlZnM+XFxuICA8cGF0aCBjbGFzcz1cXFwib3V0ZXJtb3N0XFxcIiBkPVxcXCJtMzA2LjksMzIwYzAsMTA1LjMtLjAyLDIxMC42LjEsMzE1LjkxLDAsMy40Mi0uNjcsNC4xLTQuMDksNC4wOS05OS42LS4xMi0xOTkuMjEtLjEyLTI5OC44MSwwQy42Nyw2NDAsMCw2MzkuMzMsMCw2MzUuOTEuMTEsNDI1LjMuMTEsMjE0LjcsMCw0LjA5LDAsLjY3LjY3LDAsNC4wOSwwLDEwMy43LjEyLDIwMy4zLjEyLDMwMi45MSwwYzMuNDIsMCw0LjEuNjcsNC4wOSw0LjA5LS4xMiwxMDUuMy0uMSwyMTAuNi0uMSwzMTUuOTFaXFxcIi8+XFxuICA8cGF0aCBjbGFzcz1cXFwic2Vjb25kXFxcIiBkPVxcXCJtMjc1LjkyLDMyM2MwLDg3LjYzLDAsMTc1LjI3LDAsMjYyLjksMCw3LjI0LS41NSw3LjkzLTcuODYsNy45OC0xNC42Ni4wOS0yOS4zMS4wMy00My45Ny4wMy02MC45NiwwLTEyMS45MiwwLTE4Mi44OCwwcS03LjEzLDAtNy4xNC03LjI0YzAtMTc2LjEsMC0zNTIuMjEsMC01MjguMzFxMC03LjI2LDcuMTItNy4yNmM3NS43OCwwLDE1MS41NiwwLDIyNy4zNSwwcTcuMzgsMCw3LjM4LDcuNWMwLDg4LjEzLDAsMTc2LjI3LDAsMjY0LjRaXFxcIi8+XFxuICA8cGF0aCBjbGFzcz1cXFwidGhpcmRcXFwiIGQ9XFxcIm02OC4wNiwzMjIuMjRjMC02OS40NywwLTEzOC45NCwwLTIwOC40MSwwLTguOTksMS4zMy0xMC4xMywxMC40OS05LjEyLDEuOTguMjIsMy45OC4zMiw1Ljk3LjMyLDQ2LjEzLjAyLDkyLjI2LjAyLDEzOC4zOSwwLDMuNDgsMCw2LjkyLS4yMywxMC40MS0uNjcsNS41LS43LDguNzQuNDYsOC43Myw3LjI1LS4xOCwxMzguOTQtLjEzLDI3Ny44OC0uMTMsNDE2LjgxLDAsLjMzLDAsLjY3LDAsMXEtLjE0LDEwLjUxLTEwLjM5LDEwLjUxYy01Mi4xMywwLTEwNC4yNSwwLTE1Ni4zOCwwcS03LjA5LDAtNy4wOS03LjI4YzAtNzAuMTQsMC0xNDAuMjcsMC0yMTAuNDFaXFxcIi8+XFxuICA8cGF0aCBjbGFzcz1cXFwiZm91cnRoXFxcIiBkPVxcXCJtMTAzLjAyLDMyMi41YzAtNTIuNDYsMC0xMDQuOTEsMC0xNTcuMzcsMC02LjY4LjM2LTcuMDYsNy4wNy03LjA2LDMwLjMtLjAxLDYwLjYuMDcsOTAuOS0uMDksNC41NC0uMDIsNi4wOCwxLjMzLDYuMDcsNS45OC0uMSwxMDUuNTgtLjEsMjExLjE2LDAsMzE2Ljc0LDAsNC4xOC0xLjI3LDUuMzctNS4zOCw1LjM1LTI5LjMtLjE1LTU4LjYtLjA4LTg3LjktLjA4cS0xMC43NiwwLTEwLjc2LTExLjA5YzAtNTAuNzksMC0xMDEuNTgsMC0xNTIuMzdaXFxcIi8+XFxuICA8cGF0aCBjbGFzcz1cXFwiZmlmdGhcXFwiIGQ9XFxcIm0xNzMsMzIyLjJjMCwzNS4yOSwwLDcwLjU4LDAsMTA1Ljg4cTAsNi44OS02Ljk5LDYuOWMtOC4xNSwwLTE2LjMxLS4xMy0yNC40Ni4wNi0zLjQ3LjA4LTQuNjgtMS4wOS00LjYxLTQuNTkuMTgtOS42NS4wNi0xOS4zMS4wNi0yOC45NiwwLTU4LjI2LS4wMS0xMTYuNTMuMDItMTc0Ljc5LDAtNC43Ni0xLjEyLTkuNDYtLjE0LTE0LjMuNTEtMi41NCwxLjM5LTMuMzgsMy44LTMuMzYsOC44Mi4wNiwxNy42NC4xNCwyNi40Ni0uMDIsNC41OS0uMDksNS45NSwxLjg1LDUuOTQsNi4zMy0uMTQsMzUuNjItLjA4LDcxLjI1LS4wOCwxMDYuODdaXFxcIi8+XFxuICA8cGF0aCBjbGFzcz1cXFwiaW5uZXJtb3N0XFxcIiBkPVxcXCJtMTUxLjA0LDMyMi4wMWMwLTkuOTkuMDctMTkuOTctLjA1LTI5Ljk2LS4wNC0yLjkzLjgzLTQuMTgsMy45NS00LjE4LDMuMDYsMCw0LjAzLDEuMTIsNC4wMiw0LjExLS4wOSwxOS45Ny0uMDgsMzkuOTQuMDEsNTkuOTEuMDEsMi45Ni0uODQsNC4xNi0zLjk2LDQuMTQtMy4wMy0uMDEtNC4wOC0xLjA0LTQuMDMtNC4wOC4xNC05Ljk4LjA1LTE5Ljk3LjA1LTI5Ljk2WlxcXCIvPlxcbjwvc3ZnPlwiOyIsImV4cG9ydCBkZWZhdWx0IFwiPHN2ZyB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHZlcnNpb249XFxcIjEuMFxcXCIgdmlld0JveD1cXFwiMCAwIDU2LjI1IDMwXFxcIiBjbGFzcz1cXFwid2F2ZWZvcm1cXFwiPlxcbiAgICA8ZGVmcz5cXG4gICAgICAgIDxjbGlwUGF0aCBpZD1cXFwiYVxcXCI+XFxuICAgICAgICAgICAgPHBhdGggZD1cXFwiTS41NCAxMkgzdjVILjU0Wm0wIDBcXFwiLz5cXG4gICAgICAgIDwvY2xpcFBhdGg+XFxuICAgICAgICA8Y2xpcFBhdGggaWQ9XFxcImJcXFwiPlxcbiAgICAgICAgICAgIDxwYXRoIGQ9XFxcIk0yNSAyLjJoMnYyNC42OGgtMlptMCAwXFxcIi8+XFxuICAgICAgICA8L2NsaXBQYXRoPlxcbiAgICAgICAgPGNsaXBQYXRoIGlkPVxcXCJjXFxcIj5cXG4gICAgICAgICAgICA8cGF0aCBkPVxcXCJNNTMgMTJoMS45OHY1SDUzWm0wIDBcXFwiLz5cXG4gICAgICAgIDwvY2xpcFBhdGg+XFxuICAgIDwvZGVmcz5cXG4gICAgPGcgY2xpcC1wYXRoPVxcXCJ1cmwoI2EpXFxcIj5cXG4gICAgICAgIDxwYXRoIGQ9XFxcIk0xLjQ4IDEyLjcxYy0uNSAwLS45LjQtLjkuOXYxLjg1YS45LjkgMCAwIDAgMS44IDB2LTEuODRjMC0uNS0uNC0uOS0uOS0uOVptMCAwXFxcIi8+XFxuICAgIDwvZz5cXG4gICAgPHBhdGggZD1cXFwiTTQuOTggNi42M2MtLjUgMC0uOS40LS45Ljl2MTQuMDFhLjkuOSAwIDAgMCAxLjgxIDB2LTE0YzAtLjUtLjQtLjkyLS45LS45MlptMy41MSAzLjFhLjkuOSAwIDAgMC0uOS45MXY3Ljc5YS45LjkgMCAwIDAgMS44IDB2LTcuNzljMC0uNS0uNC0uOS0uOS0uOVpNMTIgMy44M2EuOS45IDAgMCAwLS45MS45djE5LjZhLjkuOSAwIDAgMCAxLjggMFY0Ljc0YzAtLjUtLjQtLjktLjktLjlabTMuNSA4LjI5YS45LjkgMCAwIDAtLjkxLjl2My4wM2EuOS45IDAgMCAwIDEuODEgMHYtMy4wM2MwLS41LS40LS45LS45LS45Wk0xOSA2LjhjLS41IDAtLjkuNC0uOS45djEzLjY4YS45LjkgMCAwIDAgMS44IDBWNy43YzAtLjUtLjQtLjktLjktLjlabTMuNTgtMi45N2gtLjAxYy0uNSAwLS45LjQtLjkuOWwtLjEzIDE5LjZjMCAuNS40LjkuOS45MS41IDAgLjktLjQuOS0uOWwuMTQtMTkuNmEuOS45IDAgMCAwLS45LS45Wm0wIDBcXFwiLz5cXG4gICAgPGcgY2xpcC1wYXRoPVxcXCJ1cmwoI2IpXFxcIj5cXG4gICAgICAgIDxwYXRoIGQ9XFxcIk0yNiAyLjJjLS41IDAtLjkuNC0uOS45djIyLjg2YS45LjkgMCAxIDAgMS44MSAwVjMuMTFhLjkuOSAwIDAgMC0uOS0uOTFabTAgMFxcXCIvPlxcbiAgICA8L2c+XFxuICAgIDxwYXRoIGQ9XFxcIk0yOS41MiA3LjcxYS45LjkgMCAwIDAtLjkxLjl2MTEuODVhLjkuOSAwIDAgMCAxLjgxIDBWOC42MmMwLS41LS40LS45LS45LS45Wm0zLjUgMi45M2EuOS45IDAgMCAwLS45LjkxdjUuOTdhLjkuOSAwIDAgMCAxLjggMHYtNS45N2MwLS41LS40LS45LS45LS45Wm0zLjUtNS43OGMtLjUgMC0uOS40LS45Ljl2MTcuNTVhLjkuOSAwIDAgMCAxLjgxIDBWNS43NmMwLS41LS40LS45LS45LS45Wm0zLjUxIDMuMzRjLS41IDAtLjkuNC0uOS45djEwLjg3YS45LjkgMCAwIDAgMS44IDBWOS4xYS45LjkgMCAwIDAtLjktLjkxWm0zLjUgMy4wOGMtLjUgMC0uOS40LS45LjkxdjQuN2EuOS45IDAgMSAwIDEuOCAwdi00LjdhLjkuOSAwIDAgMC0uOS0uOVptMy41MS03LjQ1YS45LjkgMCAwIDAtLjkxLjl2MTkuNmEuOS45IDAgMCAwIDEuODEgMFY0Ljc0YzAtLjUtLjQtLjktLjktLjlabTMuNSA1LjU3YS45LjkgMCAwIDAtLjkuOTF2OC40NWEuOS45IDAgMCAwIDEuOCAwdi04LjQ1YzAtLjUtLjQtLjktLjktLjlabTAgMFxcXCIvPlxcbiAgICA8ZyBjbGlwLXBhdGg9XFxcInVybCgjYylcXFwiPlxcbiAgICAgICAgPHBhdGggZD1cXFwiTTU0LjA0IDEyLjk2YS45LjkgMCAwIDAtLjkuOTF2MS4zM2EuOS45IDAgMSAwIDEuOCAwdi0xLjMyYS45LjkgMCAwIDAtLjktLjkyWm0wIDBcXFwiLz5cXG4gICAgPC9nPlxcbjwvc3ZnPlwiOyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9tb2JpbGUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9tb2JpbGUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3JlY3RhbmdsZXMuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9yZWN0YW5nbGVzLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi90YWxrQnV0dG9uLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vdGFsa0J1dHRvbi5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCBBbmltYXRpb25Nb2R1bGUgZnJvbSBcIi4vQW5pbWF0aW9uTW9kdWxlLmpzXCI7XG5pbXBvcnQgQnV0dG9uTW9kdWxlIGZyb20gXCIuL0J1dHRvbk1vZHVsZS5qc1wiO1xuaW1wb3J0IEV2ZW50TW9kdWxlIGZyb20gXCIuL0V2ZW50TW9kdWxlLmpzXCI7XG5pbXBvcnQgXCIuL3RhbGtCdXR0b24uY3NzXCI7XG5pbXBvcnQgXCIuL21vYmlsZS5jc3NcIjtcbmltcG9ydCBcIi4vcmVjdGFuZ2xlcy5jc3NcIjtcbmltcG9ydCB0YWxrSWNvblNWRyBmcm9tIFwiLi93YXZlZm9ybS5zdmdcIjtcbmltcG9ydCByZWN0YW5nbGVzU1ZHIGZyb20gXCIuL3JlY3RhbmdsZXMuc3ZnXCI7XG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBjb25zdCBidXR0b25Nb2R1bGUgPSBuZXcgQnV0dG9uTW9kdWxlKCk7XG5cbiAgY29uc3QgbG9jYWxDb25maWcgPSB7XG4gICAgYXBwU2VydmVyVXJsOiBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMFwiLFxuICAgIGFwaVNlcnZlclVybDogXCJodHRwczovL2xvY2FsaG9zdDo1MDAwXCIsXG4gICAgLy8gQWRkIG90aGVyIGNvbmZpZ3VyYXRpb24gcHJvcGVydGllcyBhcyBuZWVkZWRcbiAgfTtcblxuICAvLyBEZWZpbmUgYSBnbG9iYWwgY29uZmlndXJhdGlvbiBwcm9wZXJ0eVxuICBjb25zdCBwcm9kdWN0aW9uQ29uZmlnID0ge1xuICAgIGFwcFNlcnZlclVybDogXCJodHRwczovL2FwcC5zYXlwaS5haVwiLFxuICAgIGFwaVNlcnZlclVybDogXCJodHRwczovL2FwaS5zYXlwaS5haVwiLFxuICAgIC8vIEFkZCBvdGhlciBjb25maWd1cmF0aW9uIHByb3BlcnRpZXMgYXMgbmVlZGVkXG4gIH07XG4gIGNvbnN0IGNvbmZpZyA9IHByb2R1Y3Rpb25Db25maWc7XG5cbiAgY29uc3QgcGFnZVNjcmlwdCA9IHJlcXVpcmUoXCJyYXctbG9hZGVyIS4vdHJhbnNjcmliZXIuanNcIikuZGVmYXVsdDtcbiAgYWRkVXNlckFnZW50RmxhZ3MoKTtcbiAgRXZlbnRNb2R1bGUuaW5pdCgpO1xuXG4gIC8vIENyZWF0ZSBhIE11dGF0aW9uT2JzZXJ2ZXIgdG8gbGlzdGVuIGZvciBjaGFuZ2VzIHRvIHRoZSBET01cbiAgdmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKG11dGF0aW9ucykge1xuICAgIC8vIENoZWNrIGVhY2ggbXV0YXRpb25cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG11dGF0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG11dGF0aW9uID0gbXV0YXRpb25zW2ldO1xuXG4gICAgICAvLyBJZiBub2RlcyB3ZXJlIGFkZGVkLCBjaGVjayBlYWNoIG9uZVxuICAgICAgaWYgKG11dGF0aW9uLmFkZGVkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG11dGF0aW9uLmFkZGVkTm9kZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICB2YXIgbm9kZSA9IG11dGF0aW9uLmFkZGVkTm9kZXNbal07XG5cbiAgICAgICAgICAvLyBJZiB0aGUgbm9kZSBpcyB0aGUgYXBwcm9wcmlhdGUgY29udGFpbmVyIGVsZW1lbnQsIGFkZCB0aGUgYnV0dG9uIGFuZCBzdG9wIG9ic2VydmluZ1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJkaXZcIiAmJlxuICAgICAgICAgICAgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoXCJmaXhlZFwiKSAmJlxuICAgICAgICAgICAgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoXCJib3R0b20tMTZcIilcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHZhciBmb290ZXIgPSBub2RlO1xuICAgICAgICAgICAgdmFyIGJ1dHRvbkNvbnRhaW5lciA9IGZvb3Rlci5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgICBcIi5yZWxhdGl2ZS5mbGV4LmZsZXgtY29sXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoYnV0dG9uQ29udGFpbmVyKSB7XG4gICAgICAgICAgICAgIGFkZFRhbGtCdXR0b24oYnV0dG9uQ29udGFpbmVyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIk5vIGJ1dHRvbiBjb250YWluZXIgZm91bmQgaW4gZm9vdGVyXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpZGVudGlmeUZvb3RlcigpKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkZvb3RlciBub3QgZm91bmRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgZnVuY3Rpb24gaWRlbnRpZnlGb290ZXIoKSB7XG4gICAgLy8gRmluZCBhbGwgYXVkaW8gZWxlbWVudHMgb24gdGhlIHBhZ2VcbiAgICB2YXIgYXVkaW9FbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJhdWRpb1wiKTtcbiAgICB2YXIgZm91bmQgPSBmYWxzZTsgLy8gZGVmYXVsdCB0byBub3QgZm91bmRcblxuICAgIGF1ZGlvRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoYXVkaW8pIHtcbiAgICAgIHZhciBwcmVjZWRpbmdEaXYgPSBhdWRpby5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuXG4gICAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGZvdW5kIGEgZGl2LCB3ZSBjYW4gc2tpcCBmdXJ0aGVyIGl0ZXJhdGlvbnNcbiAgICAgIGlmIChmb3VuZCkgcmV0dXJuO1xuXG4gICAgICAvLyBDaGVjayBpZiB0aGUgcHJlY2VkaW5nIGVsZW1lbnQgaXMgYSBkaXZcbiAgICAgIGlmIChwcmVjZWRpbmdEaXYgJiYgcHJlY2VkaW5nRGl2LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJkaXZcIikge1xuICAgICAgICAvLyBBc3NpZ24gYW4gSUQgdG8gdGhlIGRpdlxuICAgICAgICBwcmVjZWRpbmdEaXYuaWQgPSBcInNheXBpLWZvb3RlclwiO1xuICAgICAgICBmb3VuZCA9IHRydWU7IC8vIHNldCB0byBmb3VuZFxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGZvdW5kO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5qZWN0U2NyaXB0KGNhbGxiYWNrKSB7XG4gICAgdmFyIHNjcmlwdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgIHNjcmlwdEVsZW1lbnQudHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCI7XG4gICAgc2NyaXB0RWxlbWVudC5pZCA9IFwic2F5cGktc2NyaXB0XCI7XG4gICAgY29uc3QgY29uZmlnVGV4dCA9IFwidmFyIGNvbmZpZyA9IFwiICsgSlNPTi5zdHJpbmdpZnkoY29uZmlnKSArIFwiO1wiO1xuICAgIHNjcmlwdEVsZW1lbnQudGV4dENvbnRlbnQgPSBjb25maWdUZXh0ICsgcGFnZVNjcmlwdDtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdEVsZW1lbnQpO1xuXG4gICAgLy8gQ2FsbCB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gYWZ0ZXIgdGhlIHNjcmlwdCBpcyBhZGRlZFxuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpc01vYmlsZVZpZXcoKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1heC13aWR0aDogNzY4cHgpXCIpLm1hdGNoZXM7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRUYWxrQnV0dG9uKGNvbnRhaW5lcikge1xuICAgIC8vIGNyZWF0ZSBhIGNvbnRhaW5pbmcgZGl2XG4gICAgdmFyIHBhbmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBwYW5lbC5pZCA9IFwic2F5cGktcGFuZWxcIjtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQocGFuZWwpO1xuXG4gICAgLy8gQ3JlYXRlIHRoZSB0YWxrIGJ1dHRvbiB1c2luZyBCdXR0b25Nb2R1bGVcbiAgICBjb25zdCBsYWJlbCA9XG4gICAgICBcIlRhbGsgKEhvbGQgQ29udHJvbCArIFNwYWNlIHRvIHVzZSBob3RrZXkuIERvdWJsZSBjbGljayB0byB0b2dnbGUgYXV0by1zdWJtaXQgb24vb2ZmKVwiO1xuICAgIHZhciBidXR0b24gPSBidXR0b25Nb2R1bGUuY3JlYXRlQnV0dG9uKFwiXCIsICgpID0+IHt9KTsgLy8gVGhlIGNhbGxiYWNrIGlzIGVtcHR5IGZvciBub3csIGJ1dCB5b3UgY2FuIGFkZCBmdW5jdGlvbmFsaXRpZXMgaWYgbmVlZGVkLlxuXG4gICAgYnV0dG9uLmlkID0gXCJzYXlwaS10YWxrQnV0dG9uXCI7XG4gICAgYnV0dG9uLnR5cGUgPSBcImJ1dHRvblwiO1xuXG4gICAgLy8gU2V0IEFSSUEgbGFiZWwgYW5kIHRvb2x0aXBcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBsYWJlbCk7XG4gICAgYnV0dG9uLnNldEF0dHJpYnV0ZShcInRpdGxlXCIsIGxhYmVsKTtcblxuICAgIGNvbnN0IGNsYXNzTmFtZXMgPVxuICAgICAgXCJyZWxhdGl2ZSBmbGV4IG10LTEgbWItMSByb3VuZGVkLWZ1bGwgcHgtMiBweS0zIHRleHQtY2VudGVyIGJnLWNyZWFtLTU1MCBob3ZlcjpiZy1jcmVhbS02NTAgaG92ZXI6dGV4dC1icmFuZC1ncmVlbi03MDAgdGV4dC1tdXRlZFwiO1xuICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZXMuc3BsaXQoXCIgXCIpKTtcblxuICAgIC8vIEVuYWJsZSBhdXRvc3VibWl0IGJ5IGRlZmF1bHRcbiAgICBidXR0b24uZGF0YXNldC5hdXRvc3VibWl0ID0gXCJ0cnVlXCI7XG4gICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJhdXRvU3VibWl0XCIpO1xuXG4gICAgcGFuZWwuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgICBhZGRUYWxrSWNvbihidXR0b24pO1xuXG4gICAgLy8gQ2FsbCB0aGUgZnVuY3Rpb24gdG8gaW5qZWN0IHRoZSBzY3JpcHQgYWZ0ZXIgdGhlIGJ1dHRvbiBoYXMgYmVlbiBhZGRlZFxuICAgIGluamVjdFNjcmlwdChyZWdpc3RlckF1ZGlvQnV0dG9uRXZlbnRzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFRhbGtJY29uKGJ1dHRvbikge1xuICAgIHVwZGF0ZUljb25Db250ZW50KGJ1dHRvbik7XG5cbiAgICB3aW5kb3cubWF0Y2hNZWRpYShcIihtYXgtd2lkdGg6IDc2OHB4KVwiKS5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICB1cGRhdGVJY29uQ29udGVudChidXR0b24pO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlSWNvbkNvbnRlbnQoaWNvbkNvbnRhaW5lcikge1xuICAgIGlmIChpc01vYmlsZVZpZXcoKSkge1xuICAgICAgaWNvbkNvbnRhaW5lci5pbm5lckhUTUwgPSByZWN0YW5nbGVzU1ZHO1xuICAgIH0gZWxzZSB7XG4gICAgICBpY29uQ29udGFpbmVyLmlubmVySFRNTCA9IHRhbGtJY29uU1ZHO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFVzZXJBZ2VudEZsYWdzKCkge1xuICAgIHZhciBpc0ZpcmVmb3hBbmRyb2lkID1cbiAgICAgIC9GaXJlZm94Ly50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpICYmXG4gICAgICAvQW5kcm9pZC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICBpZiAoaXNGaXJlZm94QW5kcm9pZCkge1xuICAgICAgLy8gaGFjayBmb3IgRmlyZWZveCBvbiBBbmRyb2lkLCB3aGljaCBkb2Vzbid0IHN1cHBvcnQgOmFjdGl2ZSBjb3JyZWN0bHlcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZmlyZWZveC1hbmRyb2lkXCIpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlZ2lzdGVyQXVkaW9CdXR0b25FdmVudHMoKSB7XG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS10YWxrQnV0dG9uXCIpO1xuXG4gICAgLy8gU2V0dGluZyB0aGUgY29ycmVjdCBjb250ZXh0XG4gICAgbGV0IGNvbnRleHQgPSB3aW5kb3c7XG4gICAgaWYgKEdNX2luZm8uc2NyaXB0SGFuZGxlciAhPT0gXCJVc2Vyc2NyaXB0c1wiKSB7XG4gICAgICBjb250ZXh0ID0gdW5zYWZlV2luZG93O1xuICAgIH1cbiAgICBFdmVudE1vZHVsZS5zZXRDb250ZXh0KGNvbnRleHQpOyAvLyBTZXQgdGhlIGNvbnRleHQgZm9yIEV2ZW50TW9kdWxlXG5cbiAgICAvLyBBdHRhY2ggdGhlIGV2ZW50IGxpc3RlbmVyc1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJtb3VzZWRvd25cIixcbiAgICAgIEV2ZW50TW9kdWxlLmhhbmRsZVRhbGtNb3VzZURvd24uYmluZChFdmVudE1vZHVsZSlcbiAgICApO1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJtb3VzZXVwXCIsXG4gICAgICBFdmVudE1vZHVsZS5oYW5kbGVUYWxrTW91c2VVcC5iaW5kKEV2ZW50TW9kdWxlKVxuICAgICk7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJkYmxjbGlja1wiLCAoKSA9PlxuICAgICAgRXZlbnRNb2R1bGUuaGFuZGxlVGFsa0RvdWJsZUNsaWNrKGJ1dHRvbilcbiAgICApO1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCAoZSkgPT5cbiAgICAgIEV2ZW50TW9kdWxlLmhhbmRsZVRhbGtUb3VjaFN0YXJ0KGJ1dHRvbiwgZSlcbiAgICApO1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgKCkgPT5cbiAgICAgIEV2ZW50TW9kdWxlLmhhbmRsZVRhbGtUb3VjaEVuZChidXR0b24pXG4gICAgKTtcblxuICAgIHJlZ2lzdGVyT3RoZXJBdWRpb0J1dHRvbkV2ZW50cyhidXR0b24pO1xuICAgIHJlZ2lzdGVyQ3VzdG9tQXVkaW9FdmVudExpc3RlbmVycygpO1xuICAgIHJlZ2lzdGVySG90a2V5KCk7XG4gIH1cblxuICBmdW5jdGlvbiByZWdpc3Rlck90aGVyQXVkaW9CdXR0b25FdmVudHMoYnV0dG9uKSB7XG4gICAgLyogb3RoZXIgaGFuZGxlcnMgZm9yIHRoZSB0YWxrIGJ1dHRvbiwgYnV0IG5vdCAncHJlc3MgdG8gdGFsaycgKi9cblxuICAgIC8vIFwid2FybSB1cFwiIHRoZSBtaWNyb3Bob25lIGJ5IGFjcXVpcmluZyBpdCBiZWZvcmUgdGhlIHVzZXIgcHJlc3NlcyB0aGUgYnV0dG9uXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsIHNldHVwUmVjb3JkaW5nKTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgdGVhckRvd25SZWNvcmRpbmcpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiYmVmb3JldW5sb2FkXCIsIHRlYXJEb3duUmVjb3JkaW5nKTtcblxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hjYW5jZWxcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpOyAvLyBSZW1vdmUgdGhlIGFjdGl2ZSBjbGFzcyAoZm9yIEZpcmVmb3ggb24gQW5kcm9pZClcbiAgICAgIHRlYXJEb3duUmVjb3JkaW5nKCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiByZWdpc3RlckN1c3RvbUF1ZGlvRXZlbnRMaXN0ZW5lcnMoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzYXlwaTpwaVJlYWR5VG9SZXNwb25kXCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhcInBpUmVhZHlUb1Jlc3BvbmQgZXZlbnQgcmVjZWl2ZWQgYnkgVUkgc2NyaXB0XCIpO1xuICAgICAgaWYgKGlzU2FmYXJpKCkpIHtcbiAgICAgICAgcG9rZVVzZXIoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2F5cGk6cGlTcGVha2luZ1wiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgLy8gSGFuZGxlIHRoZSBwaVNwZWFraW5nIGV2ZW50LCBlLmcuLCBzdGFydCBhbiBhbmltYXRpb24gb3Igc2hvdyBhIFVJIGVsZW1lbnQuXG4gICAgICBjb25zb2xlLmxvZyhcInBpU3BlYWtpbmcgZXZlbnQgcmVjZWl2ZWQgYnkgVUkgc2NyaXB0XCIpO1xuICAgICAgaWYgKGlzU2FmYXJpKCkpIHtcbiAgICAgICAgdW5wb2tlVXNlcigpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlUGxheUJ1dHRvbigpIHtcbiAgICBjb25zdCBsYWJlbCA9IFwiSGVhciBQaSdzIHJlc3BvbnNlXCI7XG4gICAgbGV0IHBsYXlCdXR0b24gPSBidXR0b25Nb2R1bGUuY3JlYXRlQnV0dG9uKFwiXCIsICgpID0+IHt9KTtcbiAgICBwbGF5QnV0dG9uLmlkID0gXCJzYXlwaS1wbGF5QnV0dG9uXCI7XG4gICAgcGxheUJ1dHRvbi50eXBlID0gXCJidXR0b25cIjtcbiAgICBwbGF5QnV0dG9uLmNsYXNzTmFtZSA9IFwiaGlkZGVuIHBsYXktYnV0dG9uXCI7XG4gICAgcGxheUJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIGxhYmVsKTtcbiAgICBwbGF5QnV0dG9uLnNldEF0dHJpYnV0ZShcInRpdGxlXCIsIGxhYmVsKTtcbiAgICBwbGF5QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVQbGF5QnV0dG9uQ2xpY2spO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocGxheUJ1dHRvbik7XG4gICAgcmV0dXJuIHBsYXlCdXR0b247XG4gIH1cblxuICBmdW5jdGlvbiBzaG93UGxheUJ1dHRvbigpIHtcbiAgICBsZXQgcGxheUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F5cGktcGxheUJ1dHRvblwiKTtcbiAgICBpZiAoIXBsYXlCdXR0b24pIHtcbiAgICAgIHBsYXlCdXR0b24gPSBjcmVhdGVQbGF5QnV0dG9uKCk7XG4gICAgfVxuICAgIHBsYXlCdXR0b24uY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhpZGVQbGF5QnV0dG9uKCkge1xuICAgIGxldCBwbGF5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS1wbGF5QnV0dG9uXCIpO1xuICAgIGlmIChwbGF5QnV0dG9uKSB7XG4gICAgICBwbGF5QnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgfVxuICB9XG5cbiAgbGV0IHRhbGtCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNheXBpLXRhbGtCdXR0b25cIik7XG4gIGZ1bmN0aW9uIHBva2VVc2VyKCkge1xuICAgIEFuaW1hdGlvbk1vZHVsZS5hbmltYXRlKFwicmVhZHlUb1Jlc3BvbmRcIik7XG4gICAgc2hvd1BsYXlCdXR0b24oKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVucG9rZVVzZXIoKSB7XG4gICAgQW5pbWF0aW9uTW9kdWxlLmluYW5pbWF0ZShcInJlYWR5VG9SZXNwb25kXCIpO1xuICAgIGhpZGVQbGF5QnV0dG9uKCk7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVQbGF5QnV0dG9uQ2xpY2soKSB7XG4gICAgdW5wb2tlVXNlcigpO1xuICAgIHBpQXVkaW9NYW5hZ2VyLnVzZXJQbGF5KCk7XG4gIH1cblxuICBmdW5jdGlvbiByZWdpc3RlckhvdGtleSgpIHtcbiAgICAvLyBSZWdpc3RlciBhIGhvdGtleSBmb3IgdGhlIGJ1dHRvblxuICAgIGxldCBjdHJsRG93biA9IGZhbHNlO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBpZiAoZXZlbnQuY3RybEtleSAmJiBldmVudC5jb2RlID09PSBcIlNwYWNlXCIgJiYgIWN0cmxEb3duKSB7XG4gICAgICAgIGN0cmxEb3duID0gdHJ1ZTtcbiAgICAgICAgLy8gU2ltdWxhdGUgbW91c2Vkb3duIGV2ZW50XG4gICAgICAgIGxldCBtb3VzZURvd25FdmVudCA9IG5ldyBFdmVudChcIm1vdXNlZG93blwiKTtcbiAgICAgICAgZG9jdW1lbnRcbiAgICAgICAgICAuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS10YWxrQnV0dG9uXCIpXG4gICAgICAgICAgLmRpc3BhdGNoRXZlbnQobW91c2VEb3duRXZlbnQpO1xuICAgICAgICB0YWxrQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7IC8vIEFkZCB0aGUgYWN0aXZlIGNsYXNzXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBpZiAoY3RybERvd24gJiYgZXZlbnQuY29kZSA9PT0gXCJTcGFjZVwiKSB7XG4gICAgICAgIGN0cmxEb3duID0gZmFsc2U7XG4gICAgICAgIC8vIFNpbXVsYXRlIG1vdXNldXAgZXZlbnRcbiAgICAgICAgbGV0IG1vdXNlVXBFdmVudCA9IG5ldyBFdmVudChcIm1vdXNldXBcIik7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F5cGktdGFsa0J1dHRvblwiKS5kaXNwYXRjaEV2ZW50KG1vdXNlVXBFdmVudCk7XG4gICAgICAgIHRhbGtCdXR0b24uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vIFN0YXJ0IG9ic2VydmluZyB0aGUgZW50aXJlIGRvY3VtZW50IGZvciBjaGFuZ2VzIHRvIGNoaWxkIG5vZGVzIGFuZCBzdWJ0cmVlXG4gIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQsIHsgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH0pO1xufSkoKTtcbiJdLCJuYW1lcyI6WyJBbmltYXRpb25Nb2R1bGUiLCJfY2xhc3NDYWxsQ2hlY2siLCJfY3JlYXRlQ2xhc3MiLCJrZXkiLCJ2YWx1ZSIsImFuaW1hdGUiLCJhbmltYXRpb24iLCJzdG9wT3RoZXJBbmltYXRpb25zIiwicmVjdGFuZ2xlcyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsInJlY3RhbmdsZXNTZWxlY3RvciIsImZvckVhY2giLCJyZWN0IiwiY2xhc3NMaXN0IiwiYWRkIiwiaW5hbmltYXRlIiwicmVtb3ZlIiwic3RvcEFsbEFuaW1hdGlvbnMiLCJfdGhpcyIsInRhbGtCdXR0b25BbmltYXRpb25zIiwia2VlcEFuaW1hdGlvbiIsIl90aGlzMiIsIl9kZWZpbmVQcm9wZXJ0eSIsImRlZmF1bHQiLCJCdXR0b25Nb2R1bGUiLCJ0ZXh0YXJlYSIsImdldEVsZW1lbnRCeUlkIiwidGFsa0J1dHRvbiIsImNyZWF0ZUJ1dHRvbiIsImxhYmVsIiwiY2FsbGJhY2siLCJidXR0b24iLCJjcmVhdGVFbGVtZW50IiwidGV4dENvbnRlbnQiLCJvbmNsaWNrIiwic3R5bGVCdXR0b24iLCJzdHlsZXMiLCJoYXNPd25Qcm9wZXJ0eSIsInN0eWxlIiwic2ltdWxhdGVGb3JtU3VibWl0IiwiZW50ZXJFdmVudCIsIktleWJvYXJkRXZlbnQiLCJidWJibGVzIiwia2V5Q29kZSIsIndoaWNoIiwiZGlzcGF0Y2hFdmVudCIsImhhbmRsZUF1dG9TdWJtaXQiLCJkYXRhc2V0IiwiYXV0b3N1Ym1pdCIsImNvbnNvbGUiLCJsb2ciLCJFdmVudE1vZHVsZSIsImluaXQiLCJoYW5kbGVBdWRpb0V2ZW50cyIsImNsZWFudXAiLCJ3aW5kb3ciLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiaGFuZGxlVHJhbnNjcmlwdGlvblJlc3BvbnNlIiwiYWRkRXZlbnRMaXN0ZW5lciIsInRyYW5zY3JpcHRpb25FdmVudCIsInRyYW5zY3JpcHQiLCJkZXRhaWwiLCJ0ZXh0Iiwic2ltdWxhdGVUeXBpbmciLCJlbGVtZW50IiwiYnV0dG9uTW9kdWxlIiwid29yZHMiLCJzcGxpdCIsImkiLCJ0eXBlV29yZCIsImxlbmd0aCIsInNldE5hdGl2ZVZhbHVlIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibGFzdFZhbHVlIiwiZXZlbnQiLCJFdmVudCIsInRhcmdldCIsInNpbXVsYXRlZCIsInRyYWNrZXIiLCJfdmFsdWVUcmFja2VyIiwic2V0VmFsdWUiLCJoYW5kbGVUYWxrTW91c2VEb3duIiwiaWRQcm9tcHRUZXh0QXJlYSIsImNvbnRleHQiLCJzdGFydFJlY29yZGluZyIsImhhbmRsZVRhbGtNb3VzZVVwIiwiX3RoaXMkY29udGV4dCIsInN0b3BSZWNvcmRpbmciLCJoYW5kbGVUYWxrRG91YmxlQ2xpY2siLCJ0b2dnbGUiLCJnZXRBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJoYW5kbGVUYWxrVG91Y2hTdGFydCIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImhhbmRsZVRhbGtUb3VjaEVuZCIsInNldENvbnRleHQiLCJjdHgiLCJ0ZXh0YXJlYUVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiaWQiLCJ3YXJuIiwidGFsa0ljb25TVkciLCJyZWN0YW5nbGVzU1ZHIiwibG9jYWxDb25maWciLCJhcHBTZXJ2ZXJVcmwiLCJhcGlTZXJ2ZXJVcmwiLCJwcm9kdWN0aW9uQ29uZmlnIiwiY29uZmlnIiwicGFnZVNjcmlwdCIsInJlcXVpcmUiLCJhZGRVc2VyQWdlbnRGbGFncyIsIm9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsIm11dGF0aW9ucyIsIm11dGF0aW9uIiwiYWRkZWROb2RlcyIsImoiLCJub2RlIiwibm9kZU5hbWUiLCJ0b0xvd2VyQ2FzZSIsImNvbnRhaW5zIiwiZm9vdGVyIiwiYnV0dG9uQ29udGFpbmVyIiwiYWRkVGFsa0J1dHRvbiIsImlkZW50aWZ5Rm9vdGVyIiwiZGlzY29ubmVjdCIsImF1ZGlvRWxlbWVudHMiLCJmb3VuZCIsImF1ZGlvIiwicHJlY2VkaW5nRGl2IiwicHJldmlvdXNFbGVtZW50U2libGluZyIsInRhZ05hbWUiLCJpbmplY3RTY3JpcHQiLCJzY3JpcHRFbGVtZW50IiwidHlwZSIsImNvbmZpZ1RleHQiLCJKU09OIiwic3RyaW5naWZ5IiwiYm9keSIsImFwcGVuZENoaWxkIiwiaXNNb2JpbGVWaWV3IiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJjb250YWluZXIiLCJwYW5lbCIsImNsYXNzTmFtZXMiLCJhZGRUYWxrSWNvbiIsInJlZ2lzdGVyQXVkaW9CdXR0b25FdmVudHMiLCJ1cGRhdGVJY29uQ29udGVudCIsImFkZExpc3RlbmVyIiwiaWNvbkNvbnRhaW5lciIsImlubmVySFRNTCIsImlzRmlyZWZveEFuZHJvaWQiLCJ0ZXN0IiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwiZG9jdW1lbnRFbGVtZW50IiwiR01faW5mbyIsInNjcmlwdEhhbmRsZXIiLCJ1bnNhZmVXaW5kb3ciLCJiaW5kIiwicmVnaXN0ZXJPdGhlckF1ZGlvQnV0dG9uRXZlbnRzIiwicmVnaXN0ZXJDdXN0b21BdWRpb0V2ZW50TGlzdGVuZXJzIiwicmVnaXN0ZXJIb3RrZXkiLCJzZXR1cFJlY29yZGluZyIsInRlYXJEb3duUmVjb3JkaW5nIiwiaXNTYWZhcmkiLCJwb2tlVXNlciIsInVucG9rZVVzZXIiLCJjcmVhdGVQbGF5QnV0dG9uIiwicGxheUJ1dHRvbiIsImNsYXNzTmFtZSIsImhhbmRsZVBsYXlCdXR0b25DbGljayIsInNob3dQbGF5QnV0dG9uIiwiaGlkZVBsYXlCdXR0b24iLCJwaUF1ZGlvTWFuYWdlciIsInVzZXJQbGF5IiwiY3RybERvd24iLCJjdHJsS2V5IiwiY29kZSIsIm1vdXNlRG93bkV2ZW50IiwibW91c2VVcEV2ZW50Iiwib2JzZXJ2ZSIsImNoaWxkTGlzdCIsInN1YnRyZWUiXSwic291cmNlUm9vdCI6IiJ9