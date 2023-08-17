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
.play-button {
  /* position over the talk button, but under any controls */
  z-index: 10;
  background-color: transparent;
  border: none;
}
`, "",{"version":3,"sources":["webpack://./src/talkButton.css"],"names":[],"mappings":"AAAA;EACE;IACE,mBAAmB;EACrB;EACA;IACE,qBAAqB;EACvB;EACA;IACE,mBAAmB;EACrB;AACF;AACA;;EAEE,mBAAmB;EACnB,mBAAmB;EACnB,YAAY;EACZ,cAAc,EAAE,eAAe;AACjC;;AAEA;;EAEE,4BAA4B;AAC9B;AACA;EACE,aAAa;AACf;AACA;EACE,oBAAoB,EAAE,8BAA8B;AACtD;AACA;EACE,aAAa;AACf;AACA;EACE,0DAA0D;EAC1D,WAAW;EACX,6BAA6B;EAC7B,YAAY;AACd","sourcesContent":["@keyframes pulse {\n  0% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.9);\n  }\n  100% {\n    transform: scale(1);\n  }\n}\n#saypi-talkButton,\n.play-button {\n  margin-top: 0.25rem;\n  border-radius: 18px;\n  width: 120px;\n  display: block; /* For Safari */\n}\n\nhtml:not(.firefox-android) #saypi-talkButton:active .waveform,\n#saypi-talkButton.active .waveform {\n  animation: pulse 1s infinite;\n}\n#saypi-talkButton .waveform {\n  fill: #776d6d;\n}\n#saypi-talkButton.autoSubmit .waveform {\n  fill: rgb(65 138 47); /* Pi's text-brand-green-600 */\n}\n.hidden {\n  display: none;\n}\n.play-button {\n  /* position over the talk button, but under any controls */\n  z-index: 10;\n  background-color: transparent;\n  border: none;\n}\n"],"sourceRoot":""}]);
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("// Dispatch Custom Event\nfunction dispatchCustomEvent(eventName) {\n  var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n  var event = new CustomEvent(eventName, {\n    detail: detail\n  });\n  window.dispatchEvent(event);\n}\n\n// audio output (Pi)\nvar audioElement = document.querySelector(\"audio\");\nif (!audioElement) {\n  console.error(\"Audio element not found!\");\n}\nfunction isSafari() {\n  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);\n}\naudioElement.preload = \"auto\"; // enable aggressive preloading of audio\nvar piAudioManager = {\n  isSpeaking: false,\n  audioElement: audioElement,\n  _userStarted: true,\n  // flag to indicate playback has been started by the user (true by default because user must request initial playback)\n  _isLoadCalled: false,\n  // flag to indicate if the load() method has been called on the audio element\n\n  isLoadCalled: function isLoadCalled() {\n    return this._isLoadCalled;\n  },\n  setIsLoadCalled: function setIsLoadCalled(value) {\n    this._isLoadCalled = value;\n  },\n  userPlay: function userPlay() {\n    if (!isSafari()) {\n      return;\n    }\n    this._userStarted = true; // set a flag to indicate playback has been started by the user\n    this.audioElement.load(); // reset for Safari\n    this.audioElement.play();\n    console.log(\"User started playback\");\n  },\n  autoPlay: function autoPlay() {\n    if (!isSafari()) {\n      return;\n    }\n    if (!this._userStarted) {\n      this.audioElement.pause();\n      console.log(\"Autoplay prevented\");\n    }\n  },\n  stop: function stop() {\n    if (this.isSpeaking) {\n      this.audioElement.pause();\n    }\n    if (this.audioElement.duration && !this.audioElement.ended && this.audioElement.currentTime < this.audioElement.duration) {\n      this.audioElement.currentTime = this.audioElement.duration; // seek the audio to the end\n      this.audioElement.play(); // trigger the ended event\n    }\n  },\n\n  pause: function pause() {\n    this.audioElement.pause();\n  },\n  resume: function resume() {\n    this.audioElement.play();\n  },\n  playing: function playing() {\n    this.isSpeaking = true;\n  },\n  stopped: function stopped() {\n    this.isSpeaking = false;\n    this._userStarted = false;\n  }\n};\n\n// Intercept Autoplay Events (autoplay doesn't work on Safari)\naudioElement.addEventListener(\"play\", function () {\n  piAudioManager.autoPlay();\n});\naudioElement.addEventListener(\"loadstart\", function () {\n  console.log(\"loadstart event fired\");\n  if (!piAudioManager.isLoadCalled()) {\n    console.log(\"load() method was called\");\n    piAudioManager.setIsLoadCalled(true); // Set the flag to true\n    dispatchCustomEvent(\"saypi:piReadyToRespond\");\n  } else {\n    console.log(\"load() method was not called\");\n    piAudioManager.setIsLoadCalled(false); // Reset the flag\n  }\n});\n\n// Event listeners for detecting when Pi is speaking\naudioElement.addEventListener(\"playing\", function () {\n  console.log(\"Pi is speaking\");\n  piAudioManager.playing();\n  dispatchCustomEvent(\"saypi:piSpeaking\");\n});\naudioElement.addEventListener(\"pause\", function () {\n  console.log(\"Pi stopped speaking\");\n  piAudioManager.stopped();\n  dispatchCustomEvent(\"saypi:piStoppedSpeaking\");\n});\naudioElement.addEventListener(\"ended\", function () {\n  console.log(\"Pi finished speaking\");\n  piAudioManager.stopped();\n  dispatchCustomEvent(\"saypi:piFinishedSpeaking\");\n});\n\n// audio input (user)\nvar audioDataChunks = [];\nvar audioMimeType = \"audio/webm;codecs=opus\";\nfunction uploadAudio(audioBlob) {\n  // Create a FormData object\n  var formData = new FormData();\n  var audioFilename = \"audio.webm\";\n  if (audioBlob.type === \"audio/mp4\") {\n    audioFilename = \"audio.mp4\";\n  }\n  // Add the audio blob to the FormData object\n  formData.append(\"audio\", audioBlob, audioFilename);\n  // Get the user's preferred language\n  var language = navigator.language;\n  // Post the audio to the server for transcription\n  fetch(config.apiServerUrl + \"/transcribe?language=\" + language, {\n    method: \"POST\",\n    body: formData\n  }).then(function (response) {\n    if (!response.ok) {\n      throw Error(response.statusText);\n    }\n    return response.json();\n  }).then(handleTranscriptionResponse)[\"catch\"](function (error) {\n    console.error(\"Looks like there was a problem: \", error);\n    var textarea = document.getElementById(\"prompt\");\n    textarea.value = \"Sorry, there was a problem transcribing your audio. Please try again later.\";\n  });\n}\nfunction handleTranscriptionResponse(responseJson) {\n  var textarea = document.getElementById(\"prompt\");\n  simulateTyping(textarea, responseJson.text + \" \");\n  console.log(\"Transcript: \" + responseJson.text);\n}\nfunction setNativeValue(element, value) {\n  var lastValue = element.value;\n  element.value = value;\n  var event = new Event(\"input\", {\n    target: element,\n    bubbles: true\n  });\n  // React 15\n  event.simulated = true;\n  // React 16-17\n  var tracker = element._valueTracker;\n  if (tracker) {\n    tracker.setValue(lastValue);\n  }\n  element.dispatchEvent(event);\n}\nfunction simulateFormSubmit(textarea) {\n  var enterEvent = new KeyboardEvent(\"keydown\", {\n    bubbles: true,\n    key: \"Enter\",\n    keyCode: 13,\n    which: 13\n  });\n  textarea.dispatchEvent(enterEvent);\n}\nfunction simulateTyping(element, text) {\n  var words = text.split(\" \"); // Split the text into words (may not be ideal for all languages)\n  var i = 0;\n  function typeWord() {\n    if (i < words.length) {\n      // Append the next word and a space, then increment i\n      setNativeValue(element, element.value + words[i++] + \" \");\n      // Call this function again before the next repaint\n      requestAnimationFrame(typeWord);\n    } else {\n      // Check if autosubmit is enabled\n      var talkButton = document.getElementById(\"saypi-talkButton\");\n      if (talkButton.dataset.autosubmit === \"false\") {\n        console.log(\"Autosubmit is disabled\");\n      } else {\n        // Simulate an \"Enter\" keypress event\n        simulateFormSubmit(element);\n      }\n    }\n  }\n  // Start typing\n  typeWord();\n}\n\n// Declare a global variable for the mediaRecorder\nvar mediaRecorder;\nvar threshold = 1000; // 1000 ms = 1 second, about the length of \"Hey, Pi\"\n\n// This function will be called when the 'dataavailable' event fires\nfunction handleDataAvailable(e) {\n  // Add the audio data chunk to the array\n  audioDataChunks.push(e.data);\n}\n\n// This function will be called when the 'stop' event fires\nfunction handleStop() {\n  // Create a Blob from the audio data chunks\n  var audioBlob = new Blob(audioDataChunks, {\n    type: audioMimeType\n  });\n\n  // Get the stop time and calculate the duration\n  var stopTime = Date.now();\n  var duration = stopTime - window.startTime;\n\n  // If the duration is greater than the threshold, upload the audio for transcription\n  if (duration >= threshold) {\n    // download the audio\n    var url = URL.createObjectURL(audioBlob);\n    var a = document.createElement(\"a\");\n    a.style.display = \"none\";\n    a.href = url;\n    a.download = \"safari_audio.mp4\";\n    document.body.appendChild(a);\n    // a.click();\n    // Upload the audio to the server for transcription\n    uploadAudio(audioBlob);\n  }\n\n  // Clear the array for the next recording\n  audioDataChunks = [];\n}\nfunction setupRecording(callback) {\n  if (mediaRecorder) {\n    return;\n  }\n\n  // Get a stream from the user's microphone\n  navigator.mediaDevices.getUserMedia({\n    audio: true\n  }).then(function (stream) {\n    if (!MediaRecorder.isTypeSupported(audioMimeType)) {\n      // use MP4 for Safari\n      audioMimeType = \"audio/mp4\";\n    }\n    // Create a new MediaRecorder object using the stream and specifying the MIME type\n    var options = {\n      mimeType: audioMimeType\n    };\n    mediaRecorder = new MediaRecorder(stream, options);\n\n    // Listen for the 'dataavailable' event\n    mediaRecorder.addEventListener(\"dataavailable\", handleDataAvailable);\n\n    // Listen for the 'stop' event\n    mediaRecorder.addEventListener(\"stop\", handleStop);\n  }).then(function () {\n    // Invoke the callback function\n    if (typeof callback === \"function\") {\n      callback();\n    }\n  })[\"catch\"](function (err) {\n    console.error(\"Error getting audio stream: \" + err);\n  });\n}\nfunction tearDownRecording() {\n  // Check if the MediaRecorder is set up\n  if (!mediaRecorder) {\n    return;\n  }\n\n  // Stop any ongoing recording\n  if (mediaRecorder.state === \"recording\") {\n    mediaRecorder.stop();\n  }\n\n  // Remove the MediaRecorder's event listeners\n  mediaRecorder.removeEventListener(\"dataavailable\", handleDataAvailable);\n  mediaRecorder.removeEventListener(\"stop\", handleStop);\n\n  // Clear the MediaRecorder variable\n  mediaRecorder = null;\n}\n\n// This function will be called when the user presses the record button\nfunction startRecording() {\n  // Check if the MediaRecorder is set up\n  if (!mediaRecorder) {\n    setupRecording(startRecording);\n    return;\n  }\n  // Check if Pi is currently speaking and stop her audio\n  if (piAudioManager.isSpeaking) {\n    piAudioManager.pause();\n  }\n\n  // Start recording\n  mediaRecorder.start();\n\n  // Record the start time\n  window.startTime = Date.now();\n  console.log(\"User is speaking\");\n\n  // This function will be called when the user releases the record button\n  window.stopRecording = function () {\n    if (mediaRecorder && mediaRecorder.state === \"recording\") {\n      // Stop recording\n      mediaRecorder.stop();\n\n      // Record the stop time and calculate the duration\n      var stopTime = Date.now();\n      var duration = stopTime - window.startTime;\n\n      // If the duration is less than the threshold, don't upload the audio for transcription\n      if (duration < threshold) {\n        console.log(\"User stopped speaking\");\n        console.log(\"Recording was too short, not uploading for transcription\");\n        piAudioManager.resume();\n      } else {\n        console.log(\"User finished speaking\");\n        piAudioManager.stop();\n      }\n    }\n    // Remove the stopRecording function\n    delete window.stopRecording;\n  };\n}\n\n// Add the startRecording function to the window object so it can be called from outside this script\nwindow.startRecording = startRecording;");

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
    var talkHandlers = {
      mousedown: function mousedown() {
        idPromptTextArea();
        context.startRecording();
      },
      mouseup: function mouseup() {
        var _context;
        if (typeof ((_context = context) === null || _context === void 0 ? void 0 : _context.stopRecording) === "function") {
          context.stopRecording();
        }
      },
      dblclick: function dblclick() {
        // Toggle the CSS classes to indicate the mode
        button.classList.toggle("autoSubmit");
        if (button.getAttribute("data-autosubmit") === "true") {
          button.setAttribute("data-autosubmit", "false");
          console.log("autosubmit disabled");
        } else {
          button.setAttribute("data-autosubmit", "true");
          console.log("autosubmit enabled");
        }
      },
      touchstart: function touchstart(e) {
        e.preventDefault();
        idPromptTextArea();
        context.startRecording();
        button.classList.add("active");
      },
      touchend: function touchend() {
        button.classList.remove("active");
        context.stopRecording();
      }
    };
    for (var eventType in talkHandlers) {
      button.addEventListener(eventType, talkHandlers[eventType]);
    }
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
    var playButton = document.createElement("button");
    playButton.id = "saypi-playButton";
    playButton.type = "button";
    playButton.className = "hidden play-button";
    playButton.setAttribute("aria-label", "Hear Pi's response");
    playButton.setAttribute("title", "Hear Pi's response");
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
    animate("readyToRespond");
    showPlayButton();
  }
  function unpokeUser() {
    inanimate("readyToRespond");
    hidePlayButton();
  }
  function handlePlayButtonClick() {
    piAudioManager.userPlay();
    unpokeUser();
  }

  /* begin animation functions */
  function animate(animation) {
    stopOtherAnimations(animation);
    var rectangles = document.querySelectorAll(".outermost, .second, .third, .fourth, .fifth, .innermost");

    // To activate the animation
    rectangles.forEach(function (rect) {
      return rect.classList.add(animation);
    });
  }
  function inanimate(animation) {
    var rectangles = document.querySelectorAll(".outermost, .second, .third, .fourth, .fifth, .innermost");

    // To revert to the default pulse animation
    rectangles.forEach(function (rect) {
      return rect.classList.remove(animation);
    });
  }
  function stopAllAnimations() {
    var talkButtonAnimations = ["readyToRespond"];
    talkButtonAnimations.forEach(function (animation) {
      return inanimate(animation);
    });
  }
  function stopOtherAnimations(keepAnimation) {
    var talkButtonAnimations = ["readyToRespond"];
    talkButtonAnimations.forEach(function (animation) {
      if (animation !== keepAnimation) {
        inanimate(animation);
      }
    });
  }
  /* end animation functions */

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2F5cGkudXNlci5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDMEc7QUFDakI7QUFDekYsOEJBQThCLG1GQUEyQixDQUFDLDRGQUFxQztBQUMvRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLGlGQUFpRixZQUFZLE1BQU0sVUFBVSxVQUFVLFVBQVUsWUFBWSxNQUFNLEtBQUssVUFBVSxVQUFVLFVBQVUsS0FBSyxZQUFZLE1BQU0sVUFBVSxVQUFVLFlBQVksYUFBYSxXQUFXLEtBQUssWUFBWSxPQUFPLFlBQVksV0FBVyxLQUFLLFlBQVksT0FBTyxZQUFZLFdBQVcsS0FBSyxZQUFZLE1BQU0sVUFBVSxLQUFLLG9EQUFvRCxpREFBaUQsa0JBQWtCLHNCQUFzQixjQUFjLGlEQUFpRCxLQUFLLGtCQUFrQixvQkFBb0IsYUFBYSxrQkFBa0IsS0FBSyxpRUFBaUUsa0JBQWtCLG1CQUFtQixvQ0FBb0MsdUJBQXVCLGdCQUFnQixLQUFLLDRMQUE0TCwwQkFBMEIsa0JBQWtCLEtBQUssK0xBQStMLHFDQUFxQyxrQkFBa0IsS0FBSyx3Q0FBd0Msb0JBQW9CLEtBQUssR0FBRyxxQkFBcUI7QUFDbDZDO0FBQ0EsaUVBQWUsdUJBQXVCLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3Q3ZDO0FBQzBHO0FBQ2pCO0FBQ3pGLDhCQUE4QixtRkFBMkIsQ0FBQyw0RkFBcUM7QUFDL0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxxRkFBcUYsTUFBTSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssTUFBTSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssTUFBTSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssTUFBTSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssTUFBTSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssTUFBTSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxPQUFPLFlBQVksTUFBTSxTQUFTLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFNBQVMsWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssU0FBUyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxTQUFTLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFNBQVMsWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssU0FBUyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxhQUFhLHNEQUFzRCxpQkFBaUIsMEJBQTBC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Q0FBQztRQUN2RW5CLFVBQVUsQ0FBQ2pHLFNBQVMsQ0FBQ2lGLE1BQU0sQ0FBQyxRQUFRLENBQUM7TUFDdkM7SUFDRixDQUFDLENBQUM7RUFDSjtFQUVBLFNBQVNiLGdCQUFnQkEsQ0FBQSxFQUFHO0lBQzFCLElBQUlpRCxRQUFRLEdBQUcxRyxRQUFRLENBQUNrRCxjQUFjLENBQUMsUUFBUSxDQUFDO0lBQ2hELElBQUksQ0FBQ3dELFFBQVEsRUFBRTtNQUNiO01BQ0EsSUFBSUMsZUFBZSxHQUFHM0csUUFBUSxDQUFDUCxhQUFhLENBQUMsVUFBVSxDQUFDO01BQ3hELElBQUlrSCxlQUFlLEVBQUU7UUFDbkJBLGVBQWUsQ0FBQ25HLEVBQUUsR0FBRyxRQUFRO01BQy9CLENBQUMsTUFBTTtRQUNMYixPQUFPLENBQUNzRSxHQUFHLENBQUMsNkJBQTZCLENBQUM7TUFDNUM7SUFDRjtFQUNGOztFQUVBO0VBQ0F2RixRQUFRLENBQUNrSSxPQUFPLENBQUM1RyxRQUFRLEVBQUU7SUFBRTZHLFNBQVMsRUFBRSxJQUFJO0lBQUVDLE9BQU8sRUFBRTtFQUFLLENBQUMsQ0FBQztBQUNoRSxDQUFDLEVBQUUsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvbW9iaWxlLmNzcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3JlY3RhbmdsZXMuY3NzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvdGFsa0J1dHRvbi5jc3MiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvdHJhbnNjcmliZXIuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9yZWN0YW5nbGVzLnN2ZyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3dhdmVmb3JtLnN2ZyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL21vYmlsZS5jc3M/ZjZmZiIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3JlY3RhbmdsZXMuY3NzPzAzNjIiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy90YWxrQnV0dG9uLmNzcz8wN2Y1Iiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9zYXlwaS5pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC8qIG1vYmlsZSBzdHlsZXMgZ28gaGVyZSAqL1xuICAjc2F5cGktcGFuZWwge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICBsZWZ0OiAwO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjQ1LCAyMzgsIDIyMywgMC45KTtcbiAgfVxuICAjc2F5cGktcGFuZWwge1xuICAgIGhlaWdodDogMTAwdmg7XG4gICAgdG9wOiAwO1xuICAgIHBhZGRpbmc6IDUlO1xuICB9XG4gIC8qIG1ha2UgdGhlIGJ1dHRvbnMgZmlsbCB0aGUgcGFuZWxzICovXG4gICNzYXlwaS10YWxrQnV0dG9uIHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgYm9yZGVyLXJhZGl1czogMDtcbiAgICBtYXJnaW46IDA7XG4gIH1cbiAgLyogc3VyZmFjZSBwcmltYXJ5IGNvbnRyb2xzOiBcIi4uLlwiLCBcImV4cGVyaWVuY2VzXCIsIFwidW5tdXRlL211dGVcIiAqL1xuICAjX19uZXh0ID4gbWFpbiA+IGRpdiA+IGRpdiA+IGRpdi5maXhlZC50b3AtNC5yaWdodC02ID4gYnV0dG9uLFxuICBkaXZbZGF0YS1wcm9qZWN0aW9uLWlkPVwiMTJcIl0gPiBidXR0b24ge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMik7XG4gICAgei1pbmRleDogNTA7XG4gIH1cbiAgLyogb3ZlcnJpZGUgUmVhY3QgY2hhbmdlcyBvbiBhdWRpbyBidXR0b24gKi9cbiAgYnV0dG9uW2RhdGEtcHJvamVjdGlvbi1pZD1cIjE2XCJdID4gZGl2W2RhdGEtcHJvamVjdGlvbi1pZD1cIjE3XCJdLFxuICBidXR0b25bZGF0YS1wcm9qZWN0aW9uLWlkPVwiMTZcIl0gPiBkaXZbZGF0YS1wcm9qZWN0aW9uLWlkPVwiMThcIl0ge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMikgIWltcG9ydGFudDtcbiAgICB6LWluZGV4OiA1MDtcbiAgfVxuICAvKiBoaWRlIGZvb3RlciAqL1xuICAjc2F5cGktZm9vdGVyIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9tb2JpbGUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0UsMEJBQTBCO0VBQzFCO0lBQ0UsV0FBVztJQUNYLGVBQWU7SUFDZixPQUFPO0lBQ1AsMENBQTBDO0VBQzVDO0VBQ0E7SUFDRSxhQUFhO0lBQ2IsTUFBTTtJQUNOLFdBQVc7RUFDYjtFQUNBLHFDQUFxQztFQUNyQztJQUNFLFdBQVc7SUFDWCxZQUFZO0lBQ1osNkJBQTZCO0lBQzdCLGdCQUFnQjtJQUNoQixTQUFTO0VBQ1g7RUFDQSxrRUFBa0U7RUFDbEU7O0lBRUUsbUJBQW1CO0lBQ25CLFdBQVc7RUFDYjtFQUNBLDJDQUEyQztFQUMzQzs7SUFFRSw4QkFBOEI7SUFDOUIsV0FBVztFQUNiO0VBQ0EsZ0JBQWdCO0VBQ2hCO0lBQ0UsYUFBYTtFQUNmO0FBQ0ZcIixcInNvdXJjZXNDb250ZW50XCI6W1wiQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XFxuICAvKiBtb2JpbGUgc3R5bGVzIGdvIGhlcmUgKi9cXG4gICNzYXlwaS1wYW5lbCB7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBwb3NpdGlvbjogZml4ZWQ7XFxuICAgIGxlZnQ6IDA7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjQ1LCAyMzgsIDIyMywgMC45KTtcXG4gIH1cXG4gICNzYXlwaS1wYW5lbCB7XFxuICAgIGhlaWdodDogMTAwdmg7XFxuICAgIHRvcDogMDtcXG4gICAgcGFkZGluZzogNSU7XFxuICB9XFxuICAvKiBtYWtlIHRoZSBidXR0b25zIGZpbGwgdGhlIHBhbmVscyAqL1xcbiAgI3NheXBpLXRhbGtCdXR0b24ge1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgaGVpZ2h0OiAxMDAlO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gICAgYm9yZGVyLXJhZGl1czogMDtcXG4gICAgbWFyZ2luOiAwO1xcbiAgfVxcbiAgLyogc3VyZmFjZSBwcmltYXJ5IGNvbnRyb2xzOiBcXFwiLi4uXFxcIiwgXFxcImV4cGVyaWVuY2VzXFxcIiwgXFxcInVubXV0ZS9tdXRlXFxcIiAqL1xcbiAgI19fbmV4dCA+IG1haW4gPiBkaXYgPiBkaXYgPiBkaXYuZml4ZWQudG9wLTQucmlnaHQtNiA+IGJ1dHRvbixcXG4gIGRpdltkYXRhLXByb2plY3Rpb24taWQ9XFxcIjEyXFxcIl0gPiBidXR0b24ge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDIpO1xcbiAgICB6LWluZGV4OiA1MDtcXG4gIH1cXG4gIC8qIG92ZXJyaWRlIFJlYWN0IGNoYW5nZXMgb24gYXVkaW8gYnV0dG9uICovXFxuICBidXR0b25bZGF0YS1wcm9qZWN0aW9uLWlkPVxcXCIxNlxcXCJdID4gZGl2W2RhdGEtcHJvamVjdGlvbi1pZD1cXFwiMTdcXFwiXSxcXG4gIGJ1dHRvbltkYXRhLXByb2plY3Rpb24taWQ9XFxcIjE2XFxcIl0gPiBkaXZbZGF0YS1wcm9qZWN0aW9uLWlkPVxcXCIxOFxcXCJdIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgyKSAhaW1wb3J0YW50O1xcbiAgICB6LWluZGV4OiA1MDtcXG4gIH1cXG4gIC8qIGhpZGUgZm9vdGVyICovXFxuICAjc2F5cGktZm9vdGVyIHtcXG4gICAgZGlzcGxheTogbm9uZTtcXG4gIH1cXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGBAa2V5ZnJhbWVzIHB1bHNlX291dGVybW9zdCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkyKTtcbiAgfVxufVxuLm91dGVybW9zdCB7XG4gIGFuaW1hdGlvbjogcHVsc2Vfb3V0ZXJtb3N0IDVzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgcHVsc2Vfc2Vjb25kIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODU2KTtcbiAgfVxufVxuLnNlY29uZCB7XG4gIGFuaW1hdGlvbjogcHVsc2Vfc2Vjb25kIDVzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgcHVsc2VfdGhpcmQge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43OTIpO1xuICB9XG59XG4udGhpcmQge1xuICBhbmltYXRpb246IHB1bHNlX3RoaXJkIDVzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgcHVsc2VfZm91cnRoIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzI4KTtcbiAgfVxufVxuLmZvdXJ0aCB7XG4gIGFuaW1hdGlvbjogcHVsc2VfZm91cnRoIDVzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgcHVsc2VfZmlmdGgge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC42NjQpO1xuICB9XG59XG4uZmlmdGgge1xuICBhbmltYXRpb246IHB1bHNlX2ZpZnRoIDVzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgcHVsc2VfaW5uZXJtb3N0IHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNik7XG4gIH1cbn1cbi5pbm5lcm1vc3Qge1xuICBhbmltYXRpb246IHB1bHNlX2lubmVybW9zdCA1cyBpbmZpbml0ZTtcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xufVxuXG4vKiBib3VuY2UgYW5pbWF0aW9uIHRvIGluZGljYXRlIFBpIGlzIHdhaXRpbmcgdG8gc3BlYWsgKi9cbkBrZXlmcmFtZXMgYm91bmNlX291dGVybW9zdCB7XG4gIDAlLFxuICAyMCUsXG4gIDUwJSxcbiAgODAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gIH1cbiAgNDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUlKTtcbiAgfVxuICA2MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMyUpO1xuICB9XG59XG4ub3V0ZXJtb3N0LnJlYWR5VG9SZXNwb25kIHtcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV9vdXRlcm1vc3Q7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xufVxuXG5Aa2V5ZnJhbWVzIGJvdW5jZV9zZWNvbmQge1xuICAwJSxcbiAgMjAlLFxuICA1MCUsXG4gIDgwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xuICB9XG4gIDQwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01LjglKTtcbiAgfVxuICA2MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMy40OCUpO1xuICB9XG59XG4uc2Vjb25kLnJlYWR5VG9SZXNwb25kIHtcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV9zZWNvbmQ7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xufVxuXG5Aa2V5ZnJhbWVzIGJvdW5jZV90aGlyZCB7XG4gIDAlLFxuICAyMCUsXG4gIDUwJSxcbiAgODAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gIH1cbiAgNDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTYuNiUpO1xuICB9XG4gIDYwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0zLjk2JSk7XG4gIH1cbn1cbi50aGlyZC5yZWFkeVRvUmVzcG9uZCB7XG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2VfdGhpcmQ7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xufVxuXG5Aa2V5ZnJhbWVzIGJvdW5jZV9mb3VydGgge1xuICAwJSxcbiAgMjAlLFxuICA1MCUsXG4gIDgwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xuICB9XG4gIDQwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC03LjQlKTtcbiAgfVxuICA2MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNC40NCUpO1xuICB9XG59XG4uZm91cnRoLnJlYWR5VG9SZXNwb25kIHtcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV9mb3VydGg7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xufVxuXG5Aa2V5ZnJhbWVzIGJvdW5jZV9maWZ0aCB7XG4gIDAlLFxuICAyMCUsXG4gIDUwJSxcbiAgODAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gIH1cbiAgNDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTguMiUpO1xuICB9XG4gIDYwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC00LjkyJSk7XG4gIH1cbn1cbi5maWZ0aC5yZWFkeVRvUmVzcG9uZCB7XG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2VfZmlmdGg7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xufVxuXG5Aa2V5ZnJhbWVzIGJvdW5jZV9pbm5lcm1vc3Qge1xuICAwJSxcbiAgMjAlLFxuICA1MCUsXG4gIDgwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xuICB9XG4gIDQwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC05JSk7XG4gIH1cbiAgNjAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUuNCUpO1xuICB9XG59XG4uaW5uZXJtb3N0LnJlYWR5VG9SZXNwb25kIHtcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV9pbm5lcm1vc3Q7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvcmVjdGFuZ2xlcy5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRTs7SUFFRSxtQkFBbUI7RUFDckI7RUFDQTtJQUNFLHNCQUFzQjtFQUN4QjtBQUNGO0FBQ0E7RUFDRSxzQ0FBc0M7RUFDdEMsd0JBQXdCO0FBQzFCOztBQUVBO0VBQ0U7O0lBRUUsbUJBQW1CO0VBQ3JCO0VBQ0E7SUFDRSx1QkFBdUI7RUFDekI7QUFDRjtBQUNBO0VBQ0UsbUNBQW1DO0VBQ25DLHdCQUF3QjtBQUMxQjs7QUFFQTtFQUNFOztJQUVFLG1CQUFtQjtFQUNyQjtFQUNBO0lBQ0UsdUJBQXVCO0VBQ3pCO0FBQ0Y7QUFDQTtFQUNFLGtDQUFrQztFQUNsQyx3QkFBd0I7QUFDMUI7O0FBRUE7RUFDRTs7SUFFRSxtQkFBbUI7RUFDckI7RUFDQTtJQUNFLHVCQUF1QjtFQUN6QjtBQUNGO0FBQ0E7RUFDRSxtQ0FBbUM7RUFDbkMsd0JBQXdCO0FBQzFCOztBQUVBO0VBQ0U7O0lBRUUsbUJBQW1CO0VBQ3JCO0VBQ0E7SUFDRSx1QkFBdUI7RUFDekI7QUFDRjtBQUNBO0VBQ0Usa0NBQWtDO0VBQ2xDLHdCQUF3QjtBQUMxQjs7QUFFQTtFQUNFOztJQUVFLG1CQUFtQjtFQUNyQjtFQUNBO0lBQ0UscUJBQXFCO0VBQ3ZCO0FBQ0Y7QUFDQTtFQUNFLHNDQUFzQztFQUN0Qyx3QkFBd0I7QUFDMUI7O0FBRUEsd0RBQXdEO0FBQ3hEO0VBQ0U7Ozs7O0lBS0Usd0JBQXdCO0VBQzFCO0VBQ0E7SUFDRSwwQkFBMEI7RUFDNUI7RUFDQTtJQUNFLDBCQUEwQjtFQUM1QjtBQUNGO0FBQ0E7RUFDRSxnQ0FBZ0M7RUFDaEMsc0JBQXNCO0VBQ3RCLG1DQUFtQztBQUNyQzs7QUFFQTtFQUNFOzs7OztJQUtFLHdCQUF3QjtFQUMxQjtFQUNBO0lBQ0UsNEJBQTRCO0VBQzlCO0VBQ0E7SUFDRSw2QkFBNkI7RUFDL0I7QUFDRjtBQUNBO0VBQ0UsNkJBQTZCO0VBQzdCLHNCQUFzQjtFQUN0QixtQ0FBbUM7QUFDckM7O0FBRUE7RUFDRTs7Ozs7SUFLRSx3QkFBd0I7RUFDMUI7RUFDQTtJQUNFLDRCQUE0QjtFQUM5QjtFQUNBO0lBQ0UsNkJBQTZCO0VBQy9CO0FBQ0Y7QUFDQTtFQUNFLDRCQUE0QjtFQUM1QixzQkFBc0I7RUFDdEIsbUNBQW1DO0FBQ3JDOztBQUVBO0VBQ0U7Ozs7O0lBS0Usd0JBQXdCO0VBQzFCO0VBQ0E7SUFDRSw0QkFBNEI7RUFDOUI7RUFDQTtJQUNFLDZCQUE2QjtFQUMvQjtBQUNGO0FBQ0E7RUFDRSw2QkFBNkI7RUFDN0Isc0JBQXNCO0VBQ3RCLG1DQUFtQztBQUNyQzs7QUFFQTtFQUNFOzs7OztJQUtFLHdCQUF3QjtFQUMxQjtFQUNBO0lBQ0UsNEJBQTRCO0VBQzlCO0VBQ0E7SUFDRSw2QkFBNkI7RUFDL0I7QUFDRjtBQUNBO0VBQ0UsNEJBQTRCO0VBQzVCLHNCQUFzQjtFQUN0QixtQ0FBbUM7QUFDckM7O0FBRUE7RUFDRTs7Ozs7SUFLRSx3QkFBd0I7RUFDMUI7RUFDQTtJQUNFLDBCQUEwQjtFQUM1QjtFQUNBO0lBQ0UsNEJBQTRCO0VBQzlCO0FBQ0Y7QUFDQTtFQUNFLGdDQUFnQztFQUNoQyxzQkFBc0I7RUFDdEIsbUNBQW1DO0FBQ3JDXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIkBrZXlmcmFtZXMgcHVsc2Vfb3V0ZXJtb3N0IHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTIpO1xcbiAgfVxcbn1cXG4ub3V0ZXJtb3N0IHtcXG4gIGFuaW1hdGlvbjogcHVsc2Vfb3V0ZXJtb3N0IDVzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHB1bHNlX3NlY29uZCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjg1Nik7XFxuICB9XFxufVxcbi5zZWNvbmQge1xcbiAgYW5pbWF0aW9uOiBwdWxzZV9zZWNvbmQgNXMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbkBrZXlmcmFtZXMgcHVsc2VfdGhpcmQge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43OTIpO1xcbiAgfVxcbn1cXG4udGhpcmQge1xcbiAgYW5pbWF0aW9uOiBwdWxzZV90aGlyZCA1cyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBwdWxzZV9mb3VydGgge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43MjgpO1xcbiAgfVxcbn1cXG4uZm91cnRoIHtcXG4gIGFuaW1hdGlvbjogcHVsc2VfZm91cnRoIDVzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHB1bHNlX2ZpZnRoIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNjY0KTtcXG4gIH1cXG59XFxuLmZpZnRoIHtcXG4gIGFuaW1hdGlvbjogcHVsc2VfZmlmdGggNXMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbkBrZXlmcmFtZXMgcHVsc2VfaW5uZXJtb3N0IHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNik7XFxuICB9XFxufVxcbi5pbm5lcm1vc3Qge1xcbiAgYW5pbWF0aW9uOiBwdWxzZV9pbm5lcm1vc3QgNXMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbi8qIGJvdW5jZSBhbmltYXRpb24gdG8gaW5kaWNhdGUgUGkgaXMgd2FpdGluZyB0byBzcGVhayAqL1xcbkBrZXlmcmFtZXMgYm91bmNlX291dGVybW9zdCB7XFxuICAwJSxcXG4gIDIwJSxcXG4gIDUwJSxcXG4gIDgwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XFxuICB9XFxuICA0MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUlKTtcXG4gIH1cXG4gIDYwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMyUpO1xcbiAgfVxcbn1cXG4ub3V0ZXJtb3N0LnJlYWR5VG9SZXNwb25kIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2Vfb3V0ZXJtb3N0O1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcXG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIGJvdW5jZV9zZWNvbmQge1xcbiAgMCUsXFxuICAyMCUsXFxuICA1MCUsXFxuICA4MCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xcbiAgfVxcbiAgNDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01LjglKTtcXG4gIH1cXG4gIDYwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMy40OCUpO1xcbiAgfVxcbn1cXG4uc2Vjb25kLnJlYWR5VG9SZXNwb25kIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2Vfc2Vjb25kO1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcXG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIGJvdW5jZV90aGlyZCB7XFxuICAwJSxcXG4gIDIwJSxcXG4gIDUwJSxcXG4gIDgwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XFxuICB9XFxuICA0MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTYuNiUpO1xcbiAgfVxcbiAgNjAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0zLjk2JSk7XFxuICB9XFxufVxcbi50aGlyZC5yZWFkeVRvUmVzcG9uZCB7XFxuICBhbmltYXRpb24tbmFtZTogYm91bmNlX3RoaXJkO1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcXG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIGJvdW5jZV9mb3VydGgge1xcbiAgMCUsXFxuICAyMCUsXFxuICA1MCUsXFxuICA4MCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xcbiAgfVxcbiAgNDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC03LjQlKTtcXG4gIH1cXG4gIDYwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNC40NCUpO1xcbiAgfVxcbn1cXG4uZm91cnRoLnJlYWR5VG9SZXNwb25kIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2VfZm91cnRoO1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcXG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIGJvdW5jZV9maWZ0aCB7XFxuICAwJSxcXG4gIDIwJSxcXG4gIDUwJSxcXG4gIDgwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XFxuICB9XFxuICA0MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTguMiUpO1xcbiAgfVxcbiAgNjAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC00LjkyJSk7XFxuICB9XFxufVxcbi5maWZ0aC5yZWFkeVRvUmVzcG9uZCB7XFxuICBhbmltYXRpb24tbmFtZTogYm91bmNlX2ZpZnRoO1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcXG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIGJvdW5jZV9pbm5lcm1vc3Qge1xcbiAgMCUsXFxuICAyMCUsXFxuICA1MCUsXFxuICA4MCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xcbiAgfVxcbiAgNDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC05JSk7XFxuICB9XFxuICA2MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUuNCUpO1xcbiAgfVxcbn1cXG4uaW5uZXJtb3N0LnJlYWR5VG9SZXNwb25kIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2VfaW5uZXJtb3N0O1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcXG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYEBrZXlmcmFtZXMgcHVsc2Uge1xuICAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45KTtcbiAgfVxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICB9XG59XG4jc2F5cGktdGFsa0J1dHRvbixcbi5wbGF5LWJ1dHRvbiB7XG4gIG1hcmdpbi10b3A6IDAuMjVyZW07XG4gIGJvcmRlci1yYWRpdXM6IDE4cHg7XG4gIHdpZHRoOiAxMjBweDtcbiAgZGlzcGxheTogYmxvY2s7IC8qIEZvciBTYWZhcmkgKi9cbn1cblxuaHRtbDpub3QoLmZpcmVmb3gtYW5kcm9pZCkgI3NheXBpLXRhbGtCdXR0b246YWN0aXZlIC53YXZlZm9ybSxcbiNzYXlwaS10YWxrQnV0dG9uLmFjdGl2ZSAud2F2ZWZvcm0ge1xuICBhbmltYXRpb246IHB1bHNlIDFzIGluZmluaXRlO1xufVxuI3NheXBpLXRhbGtCdXR0b24gLndhdmVmb3JtIHtcbiAgZmlsbDogIzc3NmQ2ZDtcbn1cbiNzYXlwaS10YWxrQnV0dG9uLmF1dG9TdWJtaXQgLndhdmVmb3JtIHtcbiAgZmlsbDogcmdiKDY1IDEzOCA0Nyk7IC8qIFBpJ3MgdGV4dC1icmFuZC1ncmVlbi02MDAgKi9cbn1cbi5oaWRkZW4ge1xuICBkaXNwbGF5OiBub25lO1xufVxuLnBsYXktYnV0dG9uIHtcbiAgLyogcG9zaXRpb24gb3ZlciB0aGUgdGFsayBidXR0b24sIGJ1dCB1bmRlciBhbnkgY29udHJvbHMgKi9cbiAgei1pbmRleDogMTA7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICBib3JkZXI6IG5vbmU7XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy90YWxrQnV0dG9uLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFO0lBQ0UsbUJBQW1CO0VBQ3JCO0VBQ0E7SUFDRSxxQkFBcUI7RUFDdkI7RUFDQTtJQUNFLG1CQUFtQjtFQUNyQjtBQUNGO0FBQ0E7O0VBRUUsbUJBQW1CO0VBQ25CLG1CQUFtQjtFQUNuQixZQUFZO0VBQ1osY0FBYyxFQUFFLGVBQWU7QUFDakM7O0FBRUE7O0VBRUUsNEJBQTRCO0FBQzlCO0FBQ0E7RUFDRSxhQUFhO0FBQ2Y7QUFDQTtFQUNFLG9CQUFvQixFQUFFLDhCQUE4QjtBQUN0RDtBQUNBO0VBQ0UsYUFBYTtBQUNmO0FBQ0E7RUFDRSwwREFBMEQ7RUFDMUQsV0FBVztFQUNYLDZCQUE2QjtFQUM3QixZQUFZO0FBQ2RcIixcInNvdXJjZXNDb250ZW50XCI6W1wiQGtleWZyYW1lcyBwdWxzZSB7XFxuICAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOSk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG59XFxuI3NheXBpLXRhbGtCdXR0b24sXFxuLnBsYXktYnV0dG9uIHtcXG4gIG1hcmdpbi10b3A6IDAuMjVyZW07XFxuICBib3JkZXItcmFkaXVzOiAxOHB4O1xcbiAgd2lkdGg6IDEyMHB4O1xcbiAgZGlzcGxheTogYmxvY2s7IC8qIEZvciBTYWZhcmkgKi9cXG59XFxuXFxuaHRtbDpub3QoLmZpcmVmb3gtYW5kcm9pZCkgI3NheXBpLXRhbGtCdXR0b246YWN0aXZlIC53YXZlZm9ybSxcXG4jc2F5cGktdGFsa0J1dHRvbi5hY3RpdmUgLndhdmVmb3JtIHtcXG4gIGFuaW1hdGlvbjogcHVsc2UgMXMgaW5maW5pdGU7XFxufVxcbiNzYXlwaS10YWxrQnV0dG9uIC53YXZlZm9ybSB7XFxuICBmaWxsOiAjNzc2ZDZkO1xcbn1cXG4jc2F5cGktdGFsa0J1dHRvbi5hdXRvU3VibWl0IC53YXZlZm9ybSB7XFxuICBmaWxsOiByZ2IoNjUgMTM4IDQ3KTsgLyogUGkncyB0ZXh0LWJyYW5kLWdyZWVuLTYwMCAqL1xcbn1cXG4uaGlkZGVuIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcbi5wbGF5LWJ1dHRvbiB7XFxuICAvKiBwb3NpdGlvbiBvdmVyIHRoZSB0YWxrIGJ1dHRvbiwgYnV0IHVuZGVyIGFueSBjb250cm9scyAqL1xcbiAgei1pbmRleDogMTA7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIGJvcmRlcjogbm9uZTtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJleHBvcnQgZGVmYXVsdCBcIi8vIERpc3BhdGNoIEN1c3RvbSBFdmVudFxcbmZ1bmN0aW9uIGRpc3BhdGNoQ3VzdG9tRXZlbnQoZXZlbnROYW1lKSB7XFxuICB2YXIgZGV0YWlsID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcXG4gIHZhciBldmVudCA9IG5ldyBDdXN0b21FdmVudChldmVudE5hbWUsIHtcXG4gICAgZGV0YWlsOiBkZXRhaWxcXG4gIH0pO1xcbiAgd2luZG93LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xcbn1cXG5cXG4vLyBhdWRpbyBvdXRwdXQgKFBpKVxcbnZhciBhdWRpb0VsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxcXCJhdWRpb1xcXCIpO1xcbmlmICghYXVkaW9FbGVtZW50KSB7XFxuICBjb25zb2xlLmVycm9yKFxcXCJBdWRpbyBlbGVtZW50IG5vdCBmb3VuZCFcXFwiKTtcXG59XFxuZnVuY3Rpb24gaXNTYWZhcmkoKSB7XFxuICByZXR1cm4gL14oKD8hY2hyb21lfGFuZHJvaWQpLikqc2FmYXJpL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcXG59XFxuYXVkaW9FbGVtZW50LnByZWxvYWQgPSBcXFwiYXV0b1xcXCI7IC8vIGVuYWJsZSBhZ2dyZXNzaXZlIHByZWxvYWRpbmcgb2YgYXVkaW9cXG52YXIgcGlBdWRpb01hbmFnZXIgPSB7XFxuICBpc1NwZWFraW5nOiBmYWxzZSxcXG4gIGF1ZGlvRWxlbWVudDogYXVkaW9FbGVtZW50LFxcbiAgX3VzZXJTdGFydGVkOiB0cnVlLFxcbiAgLy8gZmxhZyB0byBpbmRpY2F0ZSBwbGF5YmFjayBoYXMgYmVlbiBzdGFydGVkIGJ5IHRoZSB1c2VyICh0cnVlIGJ5IGRlZmF1bHQgYmVjYXVzZSB1c2VyIG11c3QgcmVxdWVzdCBpbml0aWFsIHBsYXliYWNrKVxcbiAgX2lzTG9hZENhbGxlZDogZmFsc2UsXFxuICAvLyBmbGFnIHRvIGluZGljYXRlIGlmIHRoZSBsb2FkKCkgbWV0aG9kIGhhcyBiZWVuIGNhbGxlZCBvbiB0aGUgYXVkaW8gZWxlbWVudFxcblxcbiAgaXNMb2FkQ2FsbGVkOiBmdW5jdGlvbiBpc0xvYWRDYWxsZWQoKSB7XFxuICAgIHJldHVybiB0aGlzLl9pc0xvYWRDYWxsZWQ7XFxuICB9LFxcbiAgc2V0SXNMb2FkQ2FsbGVkOiBmdW5jdGlvbiBzZXRJc0xvYWRDYWxsZWQodmFsdWUpIHtcXG4gICAgdGhpcy5faXNMb2FkQ2FsbGVkID0gdmFsdWU7XFxuICB9LFxcbiAgdXNlclBsYXk6IGZ1bmN0aW9uIHVzZXJQbGF5KCkge1xcbiAgICBpZiAoIWlzU2FmYXJpKCkpIHtcXG4gICAgICByZXR1cm47XFxuICAgIH1cXG4gICAgdGhpcy5fdXNlclN0YXJ0ZWQgPSB0cnVlOyAvLyBzZXQgYSBmbGFnIHRvIGluZGljYXRlIHBsYXliYWNrIGhhcyBiZWVuIHN0YXJ0ZWQgYnkgdGhlIHVzZXJcXG4gICAgdGhpcy5hdWRpb0VsZW1lbnQubG9hZCgpOyAvLyByZXNldCBmb3IgU2FmYXJpXFxuICAgIHRoaXMuYXVkaW9FbGVtZW50LnBsYXkoKTtcXG4gICAgY29uc29sZS5sb2coXFxcIlVzZXIgc3RhcnRlZCBwbGF5YmFja1xcXCIpO1xcbiAgfSxcXG4gIGF1dG9QbGF5OiBmdW5jdGlvbiBhdXRvUGxheSgpIHtcXG4gICAgaWYgKCFpc1NhZmFyaSgpKSB7XFxuICAgICAgcmV0dXJuO1xcbiAgICB9XFxuICAgIGlmICghdGhpcy5fdXNlclN0YXJ0ZWQpIHtcXG4gICAgICB0aGlzLmF1ZGlvRWxlbWVudC5wYXVzZSgpO1xcbiAgICAgIGNvbnNvbGUubG9nKFxcXCJBdXRvcGxheSBwcmV2ZW50ZWRcXFwiKTtcXG4gICAgfVxcbiAgfSxcXG4gIHN0b3A6IGZ1bmN0aW9uIHN0b3AoKSB7XFxuICAgIGlmICh0aGlzLmlzU3BlYWtpbmcpIHtcXG4gICAgICB0aGlzLmF1ZGlvRWxlbWVudC5wYXVzZSgpO1xcbiAgICB9XFxuICAgIGlmICh0aGlzLmF1ZGlvRWxlbWVudC5kdXJhdGlvbiAmJiAhdGhpcy5hdWRpb0VsZW1lbnQuZW5kZWQgJiYgdGhpcy5hdWRpb0VsZW1lbnQuY3VycmVudFRpbWUgPCB0aGlzLmF1ZGlvRWxlbWVudC5kdXJhdGlvbikge1xcbiAgICAgIHRoaXMuYXVkaW9FbGVtZW50LmN1cnJlbnRUaW1lID0gdGhpcy5hdWRpb0VsZW1lbnQuZHVyYXRpb247IC8vIHNlZWsgdGhlIGF1ZGlvIHRvIHRoZSBlbmRcXG4gICAgICB0aGlzLmF1ZGlvRWxlbWVudC5wbGF5KCk7IC8vIHRyaWdnZXIgdGhlIGVuZGVkIGV2ZW50XFxuICAgIH1cXG4gIH0sXFxuXFxuICBwYXVzZTogZnVuY3Rpb24gcGF1c2UoKSB7XFxuICAgIHRoaXMuYXVkaW9FbGVtZW50LnBhdXNlKCk7XFxuICB9LFxcbiAgcmVzdW1lOiBmdW5jdGlvbiByZXN1bWUoKSB7XFxuICAgIHRoaXMuYXVkaW9FbGVtZW50LnBsYXkoKTtcXG4gIH0sXFxuICBwbGF5aW5nOiBmdW5jdGlvbiBwbGF5aW5nKCkge1xcbiAgICB0aGlzLmlzU3BlYWtpbmcgPSB0cnVlO1xcbiAgfSxcXG4gIHN0b3BwZWQ6IGZ1bmN0aW9uIHN0b3BwZWQoKSB7XFxuICAgIHRoaXMuaXNTcGVha2luZyA9IGZhbHNlO1xcbiAgICB0aGlzLl91c2VyU3RhcnRlZCA9IGZhbHNlO1xcbiAgfVxcbn07XFxuXFxuLy8gSW50ZXJjZXB0IEF1dG9wbGF5IEV2ZW50cyAoYXV0b3BsYXkgZG9lc24ndCB3b3JrIG9uIFNhZmFyaSlcXG5hdWRpb0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcXFwicGxheVxcXCIsIGZ1bmN0aW9uICgpIHtcXG4gIHBpQXVkaW9NYW5hZ2VyLmF1dG9QbGF5KCk7XFxufSk7XFxuYXVkaW9FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXFxcImxvYWRzdGFydFxcXCIsIGZ1bmN0aW9uICgpIHtcXG4gIGNvbnNvbGUubG9nKFxcXCJsb2Fkc3RhcnQgZXZlbnQgZmlyZWRcXFwiKTtcXG4gIGlmICghcGlBdWRpb01hbmFnZXIuaXNMb2FkQ2FsbGVkKCkpIHtcXG4gICAgY29uc29sZS5sb2coXFxcImxvYWQoKSBtZXRob2Qgd2FzIGNhbGxlZFxcXCIpO1xcbiAgICBwaUF1ZGlvTWFuYWdlci5zZXRJc0xvYWRDYWxsZWQodHJ1ZSk7IC8vIFNldCB0aGUgZmxhZyB0byB0cnVlXFxuICAgIGRpc3BhdGNoQ3VzdG9tRXZlbnQoXFxcInNheXBpOnBpUmVhZHlUb1Jlc3BvbmRcXFwiKTtcXG4gIH0gZWxzZSB7XFxuICAgIGNvbnNvbGUubG9nKFxcXCJsb2FkKCkgbWV0aG9kIHdhcyBub3QgY2FsbGVkXFxcIik7XFxuICAgIHBpQXVkaW9NYW5hZ2VyLnNldElzTG9hZENhbGxlZChmYWxzZSk7IC8vIFJlc2V0IHRoZSBmbGFnXFxuICB9XFxufSk7XFxuXFxuLy8gRXZlbnQgbGlzdGVuZXJzIGZvciBkZXRlY3Rpbmcgd2hlbiBQaSBpcyBzcGVha2luZ1xcbmF1ZGlvRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxcXCJwbGF5aW5nXFxcIiwgZnVuY3Rpb24gKCkge1xcbiAgY29uc29sZS5sb2coXFxcIlBpIGlzIHNwZWFraW5nXFxcIik7XFxuICBwaUF1ZGlvTWFuYWdlci5wbGF5aW5nKCk7XFxuICBkaXNwYXRjaEN1c3RvbUV2ZW50KFxcXCJzYXlwaTpwaVNwZWFraW5nXFxcIik7XFxufSk7XFxuYXVkaW9FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXFxcInBhdXNlXFxcIiwgZnVuY3Rpb24gKCkge1xcbiAgY29uc29sZS5sb2coXFxcIlBpIHN0b3BwZWQgc3BlYWtpbmdcXFwiKTtcXG4gIHBpQXVkaW9NYW5hZ2VyLnN0b3BwZWQoKTtcXG4gIGRpc3BhdGNoQ3VzdG9tRXZlbnQoXFxcInNheXBpOnBpU3RvcHBlZFNwZWFraW5nXFxcIik7XFxufSk7XFxuYXVkaW9FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXFxcImVuZGVkXFxcIiwgZnVuY3Rpb24gKCkge1xcbiAgY29uc29sZS5sb2coXFxcIlBpIGZpbmlzaGVkIHNwZWFraW5nXFxcIik7XFxuICBwaUF1ZGlvTWFuYWdlci5zdG9wcGVkKCk7XFxuICBkaXNwYXRjaEN1c3RvbUV2ZW50KFxcXCJzYXlwaTpwaUZpbmlzaGVkU3BlYWtpbmdcXFwiKTtcXG59KTtcXG5cXG4vLyBhdWRpbyBpbnB1dCAodXNlcilcXG52YXIgYXVkaW9EYXRhQ2h1bmtzID0gW107XFxudmFyIGF1ZGlvTWltZVR5cGUgPSBcXFwiYXVkaW8vd2VibTtjb2RlY3M9b3B1c1xcXCI7XFxuZnVuY3Rpb24gdXBsb2FkQXVkaW8oYXVkaW9CbG9iKSB7XFxuICAvLyBDcmVhdGUgYSBGb3JtRGF0YSBvYmplY3RcXG4gIHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xcbiAgdmFyIGF1ZGlvRmlsZW5hbWUgPSBcXFwiYXVkaW8ud2VibVxcXCI7XFxuICBpZiAoYXVkaW9CbG9iLnR5cGUgPT09IFxcXCJhdWRpby9tcDRcXFwiKSB7XFxuICAgIGF1ZGlvRmlsZW5hbWUgPSBcXFwiYXVkaW8ubXA0XFxcIjtcXG4gIH1cXG4gIC8vIEFkZCB0aGUgYXVkaW8gYmxvYiB0byB0aGUgRm9ybURhdGEgb2JqZWN0XFxuICBmb3JtRGF0YS5hcHBlbmQoXFxcImF1ZGlvXFxcIiwgYXVkaW9CbG9iLCBhdWRpb0ZpbGVuYW1lKTtcXG4gIC8vIEdldCB0aGUgdXNlcidzIHByZWZlcnJlZCBsYW5ndWFnZVxcbiAgdmFyIGxhbmd1YWdlID0gbmF2aWdhdG9yLmxhbmd1YWdlO1xcbiAgLy8gUG9zdCB0aGUgYXVkaW8gdG8gdGhlIHNlcnZlciBmb3IgdHJhbnNjcmlwdGlvblxcbiAgZmV0Y2goY29uZmlnLmFwaVNlcnZlclVybCArIFxcXCIvdHJhbnNjcmliZT9sYW5ndWFnZT1cXFwiICsgbGFuZ3VhZ2UsIHtcXG4gICAgbWV0aG9kOiBcXFwiUE9TVFxcXCIsXFxuICAgIGJvZHk6IGZvcm1EYXRhXFxuICB9KS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xcbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XFxuICAgICAgdGhyb3cgRXJyb3IocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XFxuICAgIH1cXG4gICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcXG4gIH0pLnRoZW4oaGFuZGxlVHJhbnNjcmlwdGlvblJlc3BvbnNlKVtcXFwiY2F0Y2hcXFwiXShmdW5jdGlvbiAoZXJyb3IpIHtcXG4gICAgY29uc29sZS5lcnJvcihcXFwiTG9va3MgbGlrZSB0aGVyZSB3YXMgYSBwcm9ibGVtOiBcXFwiLCBlcnJvcik7XFxuICAgIHZhciB0ZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxcXCJwcm9tcHRcXFwiKTtcXG4gICAgdGV4dGFyZWEudmFsdWUgPSBcXFwiU29ycnksIHRoZXJlIHdhcyBhIHByb2JsZW0gdHJhbnNjcmliaW5nIHlvdXIgYXVkaW8uIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuXFxcIjtcXG4gIH0pO1xcbn1cXG5mdW5jdGlvbiBoYW5kbGVUcmFuc2NyaXB0aW9uUmVzcG9uc2UocmVzcG9uc2VKc29uKSB7XFxuICB2YXIgdGV4dGFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcXFwicHJvbXB0XFxcIik7XFxuICBzaW11bGF0ZVR5cGluZyh0ZXh0YXJlYSwgcmVzcG9uc2VKc29uLnRleHQgKyBcXFwiIFxcXCIpO1xcbiAgY29uc29sZS5sb2coXFxcIlRyYW5zY3JpcHQ6IFxcXCIgKyByZXNwb25zZUpzb24udGV4dCk7XFxufVxcbmZ1bmN0aW9uIHNldE5hdGl2ZVZhbHVlKGVsZW1lbnQsIHZhbHVlKSB7XFxuICB2YXIgbGFzdFZhbHVlID0gZWxlbWVudC52YWx1ZTtcXG4gIGVsZW1lbnQudmFsdWUgPSB2YWx1ZTtcXG4gIHZhciBldmVudCA9IG5ldyBFdmVudChcXFwiaW5wdXRcXFwiLCB7XFxuICAgIHRhcmdldDogZWxlbWVudCxcXG4gICAgYnViYmxlczogdHJ1ZVxcbiAgfSk7XFxuICAvLyBSZWFjdCAxNVxcbiAgZXZlbnQuc2ltdWxhdGVkID0gdHJ1ZTtcXG4gIC8vIFJlYWN0IDE2LTE3XFxuICB2YXIgdHJhY2tlciA9IGVsZW1lbnQuX3ZhbHVlVHJhY2tlcjtcXG4gIGlmICh0cmFja2VyKSB7XFxuICAgIHRyYWNrZXIuc2V0VmFsdWUobGFzdFZhbHVlKTtcXG4gIH1cXG4gIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XFxufVxcbmZ1bmN0aW9uIHNpbXVsYXRlRm9ybVN1Ym1pdCh0ZXh0YXJlYSkge1xcbiAgdmFyIGVudGVyRXZlbnQgPSBuZXcgS2V5Ym9hcmRFdmVudChcXFwia2V5ZG93blxcXCIsIHtcXG4gICAgYnViYmxlczogdHJ1ZSxcXG4gICAga2V5OiBcXFwiRW50ZXJcXFwiLFxcbiAgICBrZXlDb2RlOiAxMyxcXG4gICAgd2hpY2g6IDEzXFxuICB9KTtcXG4gIHRleHRhcmVhLmRpc3BhdGNoRXZlbnQoZW50ZXJFdmVudCk7XFxufVxcbmZ1bmN0aW9uIHNpbXVsYXRlVHlwaW5nKGVsZW1lbnQsIHRleHQpIHtcXG4gIHZhciB3b3JkcyA9IHRleHQuc3BsaXQoXFxcIiBcXFwiKTsgLy8gU3BsaXQgdGhlIHRleHQgaW50byB3b3JkcyAobWF5IG5vdCBiZSBpZGVhbCBmb3IgYWxsIGxhbmd1YWdlcylcXG4gIHZhciBpID0gMDtcXG4gIGZ1bmN0aW9uIHR5cGVXb3JkKCkge1xcbiAgICBpZiAoaSA8IHdvcmRzLmxlbmd0aCkge1xcbiAgICAgIC8vIEFwcGVuZCB0aGUgbmV4dCB3b3JkIGFuZCBhIHNwYWNlLCB0aGVuIGluY3JlbWVudCBpXFxuICAgICAgc2V0TmF0aXZlVmFsdWUoZWxlbWVudCwgZWxlbWVudC52YWx1ZSArIHdvcmRzW2krK10gKyBcXFwiIFxcXCIpO1xcbiAgICAgIC8vIENhbGwgdGhpcyBmdW5jdGlvbiBhZ2FpbiBiZWZvcmUgdGhlIG5leHQgcmVwYWludFxcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0eXBlV29yZCk7XFxuICAgIH0gZWxzZSB7XFxuICAgICAgLy8gQ2hlY2sgaWYgYXV0b3N1Ym1pdCBpcyBlbmFibGVkXFxuICAgICAgdmFyIHRhbGtCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcXFwic2F5cGktdGFsa0J1dHRvblxcXCIpO1xcbiAgICAgIGlmICh0YWxrQnV0dG9uLmRhdGFzZXQuYXV0b3N1Ym1pdCA9PT0gXFxcImZhbHNlXFxcIikge1xcbiAgICAgICAgY29uc29sZS5sb2coXFxcIkF1dG9zdWJtaXQgaXMgZGlzYWJsZWRcXFwiKTtcXG4gICAgICB9IGVsc2Uge1xcbiAgICAgICAgLy8gU2ltdWxhdGUgYW4gXFxcIkVudGVyXFxcIiBrZXlwcmVzcyBldmVudFxcbiAgICAgICAgc2ltdWxhdGVGb3JtU3VibWl0KGVsZW1lbnQpO1xcbiAgICAgIH1cXG4gICAgfVxcbiAgfVxcbiAgLy8gU3RhcnQgdHlwaW5nXFxuICB0eXBlV29yZCgpO1xcbn1cXG5cXG4vLyBEZWNsYXJlIGEgZ2xvYmFsIHZhcmlhYmxlIGZvciB0aGUgbWVkaWFSZWNvcmRlclxcbnZhciBtZWRpYVJlY29yZGVyO1xcbnZhciB0aHJlc2hvbGQgPSAxMDAwOyAvLyAxMDAwIG1zID0gMSBzZWNvbmQsIGFib3V0IHRoZSBsZW5ndGggb2YgXFxcIkhleSwgUGlcXFwiXFxuXFxuLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSAnZGF0YWF2YWlsYWJsZScgZXZlbnQgZmlyZXNcXG5mdW5jdGlvbiBoYW5kbGVEYXRhQXZhaWxhYmxlKGUpIHtcXG4gIC8vIEFkZCB0aGUgYXVkaW8gZGF0YSBjaHVuayB0byB0aGUgYXJyYXlcXG4gIGF1ZGlvRGF0YUNodW5rcy5wdXNoKGUuZGF0YSk7XFxufVxcblxcbi8vIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgJ3N0b3AnIGV2ZW50IGZpcmVzXFxuZnVuY3Rpb24gaGFuZGxlU3RvcCgpIHtcXG4gIC8vIENyZWF0ZSBhIEJsb2IgZnJvbSB0aGUgYXVkaW8gZGF0YSBjaHVua3NcXG4gIHZhciBhdWRpb0Jsb2IgPSBuZXcgQmxvYihhdWRpb0RhdGFDaHVua3MsIHtcXG4gICAgdHlwZTogYXVkaW9NaW1lVHlwZVxcbiAgfSk7XFxuXFxuICAvLyBHZXQgdGhlIHN0b3AgdGltZSBhbmQgY2FsY3VsYXRlIHRoZSBkdXJhdGlvblxcbiAgdmFyIHN0b3BUaW1lID0gRGF0ZS5ub3coKTtcXG4gIHZhciBkdXJhdGlvbiA9IHN0b3BUaW1lIC0gd2luZG93LnN0YXJ0VGltZTtcXG5cXG4gIC8vIElmIHRoZSBkdXJhdGlvbiBpcyBncmVhdGVyIHRoYW4gdGhlIHRocmVzaG9sZCwgdXBsb2FkIHRoZSBhdWRpbyBmb3IgdHJhbnNjcmlwdGlvblxcbiAgaWYgKGR1cmF0aW9uID49IHRocmVzaG9sZCkge1xcbiAgICAvLyBkb3dubG9hZCB0aGUgYXVkaW9cXG4gICAgdmFyIHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYXVkaW9CbG9iKTtcXG4gICAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFxcXCJhXFxcIik7XFxuICAgIGEuc3R5bGUuZGlzcGxheSA9IFxcXCJub25lXFxcIjtcXG4gICAgYS5ocmVmID0gdXJsO1xcbiAgICBhLmRvd25sb2FkID0gXFxcInNhZmFyaV9hdWRpby5tcDRcXFwiO1xcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpO1xcbiAgICAvLyBhLmNsaWNrKCk7XFxuICAgIC8vIFVwbG9hZCB0aGUgYXVkaW8gdG8gdGhlIHNlcnZlciBmb3IgdHJhbnNjcmlwdGlvblxcbiAgICB1cGxvYWRBdWRpbyhhdWRpb0Jsb2IpO1xcbiAgfVxcblxcbiAgLy8gQ2xlYXIgdGhlIGFycmF5IGZvciB0aGUgbmV4dCByZWNvcmRpbmdcXG4gIGF1ZGlvRGF0YUNodW5rcyA9IFtdO1xcbn1cXG5mdW5jdGlvbiBzZXR1cFJlY29yZGluZyhjYWxsYmFjaykge1xcbiAgaWYgKG1lZGlhUmVjb3JkZXIpIHtcXG4gICAgcmV0dXJuO1xcbiAgfVxcblxcbiAgLy8gR2V0IGEgc3RyZWFtIGZyb20gdGhlIHVzZXIncyBtaWNyb3Bob25lXFxuICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSh7XFxuICAgIGF1ZGlvOiB0cnVlXFxuICB9KS50aGVuKGZ1bmN0aW9uIChzdHJlYW0pIHtcXG4gICAgaWYgKCFNZWRpYVJlY29yZGVyLmlzVHlwZVN1cHBvcnRlZChhdWRpb01pbWVUeXBlKSkge1xcbiAgICAgIC8vIHVzZSBNUDQgZm9yIFNhZmFyaVxcbiAgICAgIGF1ZGlvTWltZVR5cGUgPSBcXFwiYXVkaW8vbXA0XFxcIjtcXG4gICAgfVxcbiAgICAvLyBDcmVhdGUgYSBuZXcgTWVkaWFSZWNvcmRlciBvYmplY3QgdXNpbmcgdGhlIHN0cmVhbSBhbmQgc3BlY2lmeWluZyB0aGUgTUlNRSB0eXBlXFxuICAgIHZhciBvcHRpb25zID0ge1xcbiAgICAgIG1pbWVUeXBlOiBhdWRpb01pbWVUeXBlXFxuICAgIH07XFxuICAgIG1lZGlhUmVjb3JkZXIgPSBuZXcgTWVkaWFSZWNvcmRlcihzdHJlYW0sIG9wdGlvbnMpO1xcblxcbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSAnZGF0YWF2YWlsYWJsZScgZXZlbnRcXG4gICAgbWVkaWFSZWNvcmRlci5hZGRFdmVudExpc3RlbmVyKFxcXCJkYXRhYXZhaWxhYmxlXFxcIiwgaGFuZGxlRGF0YUF2YWlsYWJsZSk7XFxuXFxuICAgIC8vIExpc3RlbiBmb3IgdGhlICdzdG9wJyBldmVudFxcbiAgICBtZWRpYVJlY29yZGVyLmFkZEV2ZW50TGlzdGVuZXIoXFxcInN0b3BcXFwiLCBoYW5kbGVTdG9wKTtcXG4gIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xcbiAgICAvLyBJbnZva2UgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uXFxuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFxcXCJmdW5jdGlvblxcXCIpIHtcXG4gICAgICBjYWxsYmFjaygpO1xcbiAgICB9XFxuICB9KVtcXFwiY2F0Y2hcXFwiXShmdW5jdGlvbiAoZXJyKSB7XFxuICAgIGNvbnNvbGUuZXJyb3IoXFxcIkVycm9yIGdldHRpbmcgYXVkaW8gc3RyZWFtOiBcXFwiICsgZXJyKTtcXG4gIH0pO1xcbn1cXG5mdW5jdGlvbiB0ZWFyRG93blJlY29yZGluZygpIHtcXG4gIC8vIENoZWNrIGlmIHRoZSBNZWRpYVJlY29yZGVyIGlzIHNldCB1cFxcbiAgaWYgKCFtZWRpYVJlY29yZGVyKSB7XFxuICAgIHJldHVybjtcXG4gIH1cXG5cXG4gIC8vIFN0b3AgYW55IG9uZ29pbmcgcmVjb3JkaW5nXFxuICBpZiAobWVkaWFSZWNvcmRlci5zdGF0ZSA9PT0gXFxcInJlY29yZGluZ1xcXCIpIHtcXG4gICAgbWVkaWFSZWNvcmRlci5zdG9wKCk7XFxuICB9XFxuXFxuICAvLyBSZW1vdmUgdGhlIE1lZGlhUmVjb3JkZXIncyBldmVudCBsaXN0ZW5lcnNcXG4gIG1lZGlhUmVjb3JkZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihcXFwiZGF0YWF2YWlsYWJsZVxcXCIsIGhhbmRsZURhdGFBdmFpbGFibGUpO1xcbiAgbWVkaWFSZWNvcmRlci5yZW1vdmVFdmVudExpc3RlbmVyKFxcXCJzdG9wXFxcIiwgaGFuZGxlU3RvcCk7XFxuXFxuICAvLyBDbGVhciB0aGUgTWVkaWFSZWNvcmRlciB2YXJpYWJsZVxcbiAgbWVkaWFSZWNvcmRlciA9IG51bGw7XFxufVxcblxcbi8vIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgdXNlciBwcmVzc2VzIHRoZSByZWNvcmQgYnV0dG9uXFxuZnVuY3Rpb24gc3RhcnRSZWNvcmRpbmcoKSB7XFxuICAvLyBDaGVjayBpZiB0aGUgTWVkaWFSZWNvcmRlciBpcyBzZXQgdXBcXG4gIGlmICghbWVkaWFSZWNvcmRlcikge1xcbiAgICBzZXR1cFJlY29yZGluZyhzdGFydFJlY29yZGluZyk7XFxuICAgIHJldHVybjtcXG4gIH1cXG4gIC8vIENoZWNrIGlmIFBpIGlzIGN1cnJlbnRseSBzcGVha2luZyBhbmQgc3RvcCBoZXIgYXVkaW9cXG4gIGlmIChwaUF1ZGlvTWFuYWdlci5pc1NwZWFraW5nKSB7XFxuICAgIHBpQXVkaW9NYW5hZ2VyLnBhdXNlKCk7XFxuICB9XFxuXFxuICAvLyBTdGFydCByZWNvcmRpbmdcXG4gIG1lZGlhUmVjb3JkZXIuc3RhcnQoKTtcXG5cXG4gIC8vIFJlY29yZCB0aGUgc3RhcnQgdGltZVxcbiAgd2luZG93LnN0YXJ0VGltZSA9IERhdGUubm93KCk7XFxuICBjb25zb2xlLmxvZyhcXFwiVXNlciBpcyBzcGVha2luZ1xcXCIpO1xcblxcbiAgLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSB1c2VyIHJlbGVhc2VzIHRoZSByZWNvcmQgYnV0dG9uXFxuICB3aW5kb3cuc3RvcFJlY29yZGluZyA9IGZ1bmN0aW9uICgpIHtcXG4gICAgaWYgKG1lZGlhUmVjb3JkZXIgJiYgbWVkaWFSZWNvcmRlci5zdGF0ZSA9PT0gXFxcInJlY29yZGluZ1xcXCIpIHtcXG4gICAgICAvLyBTdG9wIHJlY29yZGluZ1xcbiAgICAgIG1lZGlhUmVjb3JkZXIuc3RvcCgpO1xcblxcbiAgICAgIC8vIFJlY29yZCB0aGUgc3RvcCB0aW1lIGFuZCBjYWxjdWxhdGUgdGhlIGR1cmF0aW9uXFxuICAgICAgdmFyIHN0b3BUaW1lID0gRGF0ZS5ub3coKTtcXG4gICAgICB2YXIgZHVyYXRpb24gPSBzdG9wVGltZSAtIHdpbmRvdy5zdGFydFRpbWU7XFxuXFxuICAgICAgLy8gSWYgdGhlIGR1cmF0aW9uIGlzIGxlc3MgdGhhbiB0aGUgdGhyZXNob2xkLCBkb24ndCB1cGxvYWQgdGhlIGF1ZGlvIGZvciB0cmFuc2NyaXB0aW9uXFxuICAgICAgaWYgKGR1cmF0aW9uIDwgdGhyZXNob2xkKSB7XFxuICAgICAgICBjb25zb2xlLmxvZyhcXFwiVXNlciBzdG9wcGVkIHNwZWFraW5nXFxcIik7XFxuICAgICAgICBjb25zb2xlLmxvZyhcXFwiUmVjb3JkaW5nIHdhcyB0b28gc2hvcnQsIG5vdCB1cGxvYWRpbmcgZm9yIHRyYW5zY3JpcHRpb25cXFwiKTtcXG4gICAgICAgIHBpQXVkaW9NYW5hZ2VyLnJlc3VtZSgpO1xcbiAgICAgIH0gZWxzZSB7XFxuICAgICAgICBjb25zb2xlLmxvZyhcXFwiVXNlciBmaW5pc2hlZCBzcGVha2luZ1xcXCIpO1xcbiAgICAgICAgcGlBdWRpb01hbmFnZXIuc3RvcCgpO1xcbiAgICAgIH1cXG4gICAgfVxcbiAgICAvLyBSZW1vdmUgdGhlIHN0b3BSZWNvcmRpbmcgZnVuY3Rpb25cXG4gICAgZGVsZXRlIHdpbmRvdy5zdG9wUmVjb3JkaW5nO1xcbiAgfTtcXG59XFxuXFxuLy8gQWRkIHRoZSBzdGFydFJlY29yZGluZyBmdW5jdGlvbiB0byB0aGUgd2luZG93IG9iamVjdCBzbyBpdCBjYW4gYmUgY2FsbGVkIGZyb20gb3V0c2lkZSB0aGlzIHNjcmlwdFxcbndpbmRvdy5zdGFydFJlY29yZGluZyA9IHN0YXJ0UmVjb3JkaW5nO1wiOyIsImV4cG9ydCBkZWZhdWx0IFwiPD94bWwgdmVyc2lvbj1cXFwiMS4wXFxcIiBlbmNvZGluZz1cXFwiVVRGLThcXFwiPz5cXG48c3ZnIGlkPVxcXCJMYXllcl8xXFxcIiBkYXRhLW5hbWU9XFxcIkxheWVyIDFcXFwiIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDMwNyA2NDBcXFwiPlxcbiAgPGRlZnM+XFxuICAgIDxzdHlsZT5cXG4gICAgICAuaW5uZXJtb3N0LCAuc2Vjb25kLCAudGhpcmQsIC5mb3VydGgsIC5maWZ0aCwgLm91dGVybW9zdCB7XFxuICAgICAgICBzdHJva2Utd2lkdGg6IDBweDtcXG4gICAgICB9XFxuICAgICAgXFxuICAgICAgLm91dGVybW9zdCB7XFxuICAgICAgICBmaWxsOiAjZTRmMmQxO1xcbiAgICAgIH1cXG5cXG4gICAgICAuc2Vjb25kIHtcXG4gICAgICAgIGZpbGw6ICNjY2U4YjU7XFxuICAgICAgfVxcblxcbiAgICAgIC50aGlyZCB7XFxuICAgICAgICBmaWxsOiAjYjNkYjk1O1xcbiAgICAgIH1cXG5cXG4gICAgICAuZm91cnRoIHtcXG4gICAgICAgIGZpbGw6ICM5YmQwNzg7XFxuICAgICAgfVxcblxcbiAgICAgIC5maWZ0aCB7XFxuICAgICAgICBmaWxsOiAjODNjNTVjO1xcbiAgICAgIH1cXG5cXG4gICAgICAuaW5uZXJtb3N0IHtcXG4gICAgICAgIGZpbGw6ICM0MjhhMmY7XFxuICAgICAgfVxcbiAgICA8L3N0eWxlPlxcbiAgPC9kZWZzPlxcbiAgPHBhdGggY2xhc3M9XFxcIm91dGVybW9zdFxcXCIgZD1cXFwibTMwNi45LDMyMGMwLDEwNS4zLS4wMiwyMTAuNi4xLDMxNS45MSwwLDMuNDItLjY3LDQuMS00LjA5LDQuMDktOTkuNi0uMTItMTk5LjIxLS4xMi0yOTguODEsMEMuNjcsNjQwLDAsNjM5LjMzLDAsNjM1LjkxLjExLDQyNS4zLjExLDIxNC43LDAsNC4wOSwwLC42Ny42NywwLDQuMDksMCwxMDMuNy4xMiwyMDMuMy4xMiwzMDIuOTEsMGMzLjQyLDAsNC4xLjY3LDQuMDksNC4wOS0uMTIsMTA1LjMtLjEsMjEwLjYtLjEsMzE1LjkxWlxcXCIvPlxcbiAgPHBhdGggY2xhc3M9XFxcInNlY29uZFxcXCIgZD1cXFwibTI3NS45MiwzMjNjMCw4Ny42MywwLDE3NS4yNywwLDI2Mi45LDAsNy4yNC0uNTUsNy45My03Ljg2LDcuOTgtMTQuNjYuMDktMjkuMzEuMDMtNDMuOTcuMDMtNjAuOTYsMC0xMjEuOTIsMC0xODIuODgsMHEtNy4xMywwLTcuMTQtNy4yNGMwLTE3Ni4xLDAtMzUyLjIxLDAtNTI4LjMxcTAtNy4yNiw3LjEyLTcuMjZjNzUuNzgsMCwxNTEuNTYsMCwyMjcuMzUsMHE3LjM4LDAsNy4zOCw3LjVjMCw4OC4xMywwLDE3Ni4yNywwLDI2NC40WlxcXCIvPlxcbiAgPHBhdGggY2xhc3M9XFxcInRoaXJkXFxcIiBkPVxcXCJtNjguMDYsMzIyLjI0YzAtNjkuNDcsMC0xMzguOTQsMC0yMDguNDEsMC04Ljk5LDEuMzMtMTAuMTMsMTAuNDktOS4xMiwxLjk4LjIyLDMuOTguMzIsNS45Ny4zMiw0Ni4xMy4wMiw5Mi4yNi4wMiwxMzguMzksMCwzLjQ4LDAsNi45Mi0uMjMsMTAuNDEtLjY3LDUuNS0uNyw4Ljc0LjQ2LDguNzMsNy4yNS0uMTgsMTM4Ljk0LS4xMywyNzcuODgtLjEzLDQxNi44MSwwLC4zMywwLC42NywwLDFxLS4xNCwxMC41MS0xMC4zOSwxMC41MWMtNTIuMTMsMC0xMDQuMjUsMC0xNTYuMzgsMHEtNy4wOSwwLTcuMDktNy4yOGMwLTcwLjE0LDAtMTQwLjI3LDAtMjEwLjQxWlxcXCIvPlxcbiAgPHBhdGggY2xhc3M9XFxcImZvdXJ0aFxcXCIgZD1cXFwibTEwMy4wMiwzMjIuNWMwLTUyLjQ2LDAtMTA0LjkxLDAtMTU3LjM3LDAtNi42OC4zNi03LjA2LDcuMDctNy4wNiwzMC4zLS4wMSw2MC42LjA3LDkwLjktLjA5LDQuNTQtLjAyLDYuMDgsMS4zMyw2LjA3LDUuOTgtLjEsMTA1LjU4LS4xLDIxMS4xNiwwLDMxNi43NCwwLDQuMTgtMS4yNyw1LjM3LTUuMzgsNS4zNS0yOS4zLS4xNS01OC42LS4wOC04Ny45LS4wOHEtMTAuNzYsMC0xMC43Ni0xMS4wOWMwLTUwLjc5LDAtMTAxLjU4LDAtMTUyLjM3WlxcXCIvPlxcbiAgPHBhdGggY2xhc3M9XFxcImZpZnRoXFxcIiBkPVxcXCJtMTczLDMyMi4yYzAsMzUuMjksMCw3MC41OCwwLDEwNS44OHEwLDYuODktNi45OSw2LjljLTguMTUsMC0xNi4zMS0uMTMtMjQuNDYuMDYtMy40Ny4wOC00LjY4LTEuMDktNC42MS00LjU5LjE4LTkuNjUuMDYtMTkuMzEuMDYtMjguOTYsMC01OC4yNi0uMDEtMTE2LjUzLjAyLTE3NC43OSwwLTQuNzYtMS4xMi05LjQ2LS4xNC0xNC4zLjUxLTIuNTQsMS4zOS0zLjM4LDMuOC0zLjM2LDguODIuMDYsMTcuNjQuMTQsMjYuNDYtLjAyLDQuNTktLjA5LDUuOTUsMS44NSw1Ljk0LDYuMzMtLjE0LDM1LjYyLS4wOCw3MS4yNS0uMDgsMTA2Ljg3WlxcXCIvPlxcbiAgPHBhdGggY2xhc3M9XFxcImlubmVybW9zdFxcXCIgZD1cXFwibTE1MS4wNCwzMjIuMDFjMC05Ljk5LjA3LTE5Ljk3LS4wNS0yOS45Ni0uMDQtMi45My44My00LjE4LDMuOTUtNC4xOCwzLjA2LDAsNC4wMywxLjEyLDQuMDIsNC4xMS0uMDksMTkuOTctLjA4LDM5Ljk0LjAxLDU5LjkxLjAxLDIuOTYtLjg0LDQuMTYtMy45Niw0LjE0LTMuMDMtLjAxLTQuMDgtMS4wNC00LjAzLTQuMDguMTQtOS45OC4wNS0xOS45Ny4wNS0yOS45NlpcXFwiLz5cXG48L3N2Zz5cIjsiLCJleHBvcnQgZGVmYXVsdCBcIjxzdmcgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiB2ZXJzaW9uPVxcXCIxLjBcXFwiIHZpZXdCb3g9XFxcIjAgMCA1Ni4yNSAzMFxcXCIgY2xhc3M9XFxcIndhdmVmb3JtXFxcIj5cXG4gICAgPGRlZnM+XFxuICAgICAgICA8Y2xpcFBhdGggaWQ9XFxcImFcXFwiPlxcbiAgICAgICAgICAgIDxwYXRoIGQ9XFxcIk0uNTQgMTJIM3Y1SC41NFptMCAwXFxcIi8+XFxuICAgICAgICA8L2NsaXBQYXRoPlxcbiAgICAgICAgPGNsaXBQYXRoIGlkPVxcXCJiXFxcIj5cXG4gICAgICAgICAgICA8cGF0aCBkPVxcXCJNMjUgMi4yaDJ2MjQuNjhoLTJabTAgMFxcXCIvPlxcbiAgICAgICAgPC9jbGlwUGF0aD5cXG4gICAgICAgIDxjbGlwUGF0aCBpZD1cXFwiY1xcXCI+XFxuICAgICAgICAgICAgPHBhdGggZD1cXFwiTTUzIDEyaDEuOTh2NUg1M1ptMCAwXFxcIi8+XFxuICAgICAgICA8L2NsaXBQYXRoPlxcbiAgICA8L2RlZnM+XFxuICAgIDxnIGNsaXAtcGF0aD1cXFwidXJsKCNhKVxcXCI+XFxuICAgICAgICA8cGF0aCBkPVxcXCJNMS40OCAxMi43MWMtLjUgMC0uOS40LS45Ljl2MS44NWEuOS45IDAgMCAwIDEuOCAwdi0xLjg0YzAtLjUtLjQtLjktLjktLjlabTAgMFxcXCIvPlxcbiAgICA8L2c+XFxuICAgIDxwYXRoIGQ9XFxcIk00Ljk4IDYuNjNjLS41IDAtLjkuNC0uOS45djE0LjAxYS45LjkgMCAwIDAgMS44MSAwdi0xNGMwLS41LS40LS45Mi0uOS0uOTJabTMuNTEgMy4xYS45LjkgMCAwIDAtLjkuOTF2Ny43OWEuOS45IDAgMCAwIDEuOCAwdi03Ljc5YzAtLjUtLjQtLjktLjktLjlaTTEyIDMuODNhLjkuOSAwIDAgMC0uOTEuOXYxOS42YS45LjkgMCAwIDAgMS44IDBWNC43NGMwLS41LS40LS45LS45LS45Wm0zLjUgOC4yOWEuOS45IDAgMCAwLS45MS45djMuMDNhLjkuOSAwIDAgMCAxLjgxIDB2LTMuMDNjMC0uNS0uNC0uOS0uOS0uOVpNMTkgNi44Yy0uNSAwLS45LjQtLjkuOXYxMy42OGEuOS45IDAgMCAwIDEuOCAwVjcuN2MwLS41LS40LS45LS45LS45Wm0zLjU4LTIuOTdoLS4wMWMtLjUgMC0uOS40LS45LjlsLS4xMyAxOS42YzAgLjUuNC45LjkuOTEuNSAwIC45LS40LjktLjlsLjE0LTE5LjZhLjkuOSAwIDAgMC0uOS0uOVptMCAwXFxcIi8+XFxuICAgIDxnIGNsaXAtcGF0aD1cXFwidXJsKCNiKVxcXCI+XFxuICAgICAgICA8cGF0aCBkPVxcXCJNMjYgMi4yYy0uNSAwLS45LjQtLjkuOXYyMi44NmEuOS45IDAgMSAwIDEuODEgMFYzLjExYS45LjkgMCAwIDAtLjktLjkxWm0wIDBcXFwiLz5cXG4gICAgPC9nPlxcbiAgICA8cGF0aCBkPVxcXCJNMjkuNTIgNy43MWEuOS45IDAgMCAwLS45MS45djExLjg1YS45LjkgMCAwIDAgMS44MSAwVjguNjJjMC0uNS0uNC0uOS0uOS0uOVptMy41IDIuOTNhLjkuOSAwIDAgMC0uOS45MXY1Ljk3YS45LjkgMCAwIDAgMS44IDB2LTUuOTdjMC0uNS0uNC0uOS0uOS0uOVptMy41LTUuNzhjLS41IDAtLjkuNC0uOS45djE3LjU1YS45LjkgMCAwIDAgMS44MSAwVjUuNzZjMC0uNS0uNC0uOS0uOS0uOVptMy41MSAzLjM0Yy0uNSAwLS45LjQtLjkuOXYxMC44N2EuOS45IDAgMCAwIDEuOCAwVjkuMWEuOS45IDAgMCAwLS45LS45MVptMy41IDMuMDhjLS41IDAtLjkuNC0uOS45MXY0LjdhLjkuOSAwIDEgMCAxLjggMHYtNC43YS45LjkgMCAwIDAtLjktLjlabTMuNTEtNy40NWEuOS45IDAgMCAwLS45MS45djE5LjZhLjkuOSAwIDAgMCAxLjgxIDBWNC43NGMwLS41LS40LS45LS45LS45Wm0zLjUgNS41N2EuOS45IDAgMCAwLS45LjkxdjguNDVhLjkuOSAwIDAgMCAxLjggMHYtOC40NWMwLS41LS40LS45LS45LS45Wm0wIDBcXFwiLz5cXG4gICAgPGcgY2xpcC1wYXRoPVxcXCJ1cmwoI2MpXFxcIj5cXG4gICAgICAgIDxwYXRoIGQ9XFxcIk01NC4wNCAxMi45NmEuOS45IDAgMCAwLS45LjkxdjEuMzNhLjkuOSAwIDEgMCAxLjggMHYtMS4zMmEuOS45IDAgMCAwLS45LS45MlptMCAwXFxcIi8+XFxuICAgIDwvZz5cXG48L3N2Zz5cIjsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vbW9iaWxlLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vbW9iaWxlLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9yZWN0YW5nbGVzLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vcmVjdGFuZ2xlcy5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vdGFsa0J1dHRvbi5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3RhbGtCdXR0b24uY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgXCIuL3RhbGtCdXR0b24uY3NzXCI7XG5pbXBvcnQgXCIuL21vYmlsZS5jc3NcIjtcbmltcG9ydCBcIi4vcmVjdGFuZ2xlcy5jc3NcIjtcbmltcG9ydCB0YWxrSWNvblNWRyBmcm9tIFwiLi93YXZlZm9ybS5zdmdcIjtcbmltcG9ydCByZWN0YW5nbGVzU1ZHIGZyb20gXCIuL3JlY3RhbmdsZXMuc3ZnXCI7XG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBjb25zdCBsb2NhbENvbmZpZyA9IHtcbiAgICBhcHBTZXJ2ZXJVcmw6IFwiaHR0cDovL2xvY2FsaG9zdDozMDAwXCIsXG4gICAgYXBpU2VydmVyVXJsOiBcImh0dHBzOi8vbG9jYWxob3N0OjUwMDBcIixcbiAgICAvLyBBZGQgb3RoZXIgY29uZmlndXJhdGlvbiBwcm9wZXJ0aWVzIGFzIG5lZWRlZFxuICB9O1xuXG4gIC8vIERlZmluZSBhIGdsb2JhbCBjb25maWd1cmF0aW9uIHByb3BlcnR5XG4gIGNvbnN0IHByb2R1Y3Rpb25Db25maWcgPSB7XG4gICAgYXBwU2VydmVyVXJsOiBcImh0dHBzOi8vYXBwLnNheXBpLmFpXCIsXG4gICAgYXBpU2VydmVyVXJsOiBcImh0dHBzOi8vYXBpLnNheXBpLmFpXCIsXG4gICAgLy8gQWRkIG90aGVyIGNvbmZpZ3VyYXRpb24gcHJvcGVydGllcyBhcyBuZWVkZWRcbiAgfTtcbiAgY29uc3QgY29uZmlnID0gcHJvZHVjdGlvbkNvbmZpZztcblxuICBjb25zdCBwYWdlU2NyaXB0ID0gcmVxdWlyZShcInJhdy1sb2FkZXIhLi90cmFuc2NyaWJlci5qc1wiKS5kZWZhdWx0O1xuXG4gIC8vIENyZWF0ZSBhIE11dGF0aW9uT2JzZXJ2ZXIgdG8gbGlzdGVuIGZvciBjaGFuZ2VzIHRvIHRoZSBET01cbiAgdmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKG11dGF0aW9ucykge1xuICAgIC8vIENoZWNrIGVhY2ggbXV0YXRpb25cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG11dGF0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG11dGF0aW9uID0gbXV0YXRpb25zW2ldO1xuXG4gICAgICAvLyBJZiBub2RlcyB3ZXJlIGFkZGVkLCBjaGVjayBlYWNoIG9uZVxuICAgICAgaWYgKG11dGF0aW9uLmFkZGVkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG11dGF0aW9uLmFkZGVkTm9kZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICB2YXIgbm9kZSA9IG11dGF0aW9uLmFkZGVkTm9kZXNbal07XG5cbiAgICAgICAgICAvLyBJZiB0aGUgbm9kZSBpcyB0aGUgYXBwcm9wcmlhdGUgY29udGFpbmVyIGVsZW1lbnQsIGFkZCB0aGUgYnV0dG9uIGFuZCBzdG9wIG9ic2VydmluZ1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJkaXZcIiAmJlxuICAgICAgICAgICAgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoXCJmaXhlZFwiKSAmJlxuICAgICAgICAgICAgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoXCJib3R0b20tMTZcIilcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHZhciBmb290ZXIgPSBub2RlO1xuICAgICAgICAgICAgdmFyIGJ1dHRvbkNvbnRhaW5lciA9IGZvb3Rlci5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgICBcIi5yZWxhdGl2ZS5mbGV4LmZsZXgtY29sXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoYnV0dG9uQ29udGFpbmVyKSB7XG4gICAgICAgICAgICAgIGFkZFRhbGtCdXR0b24oYnV0dG9uQ29udGFpbmVyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIk5vIGJ1dHRvbiBjb250YWluZXIgZm91bmQgaW4gZm9vdGVyXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpZGVudGlmeUZvb3RlcigpKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkZvb3RlciBub3QgZm91bmRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgZnVuY3Rpb24gaWRlbnRpZnlGb290ZXIoKSB7XG4gICAgLy8gRmluZCBhbGwgYXVkaW8gZWxlbWVudHMgb24gdGhlIHBhZ2VcbiAgICB2YXIgYXVkaW9FbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJhdWRpb1wiKTtcbiAgICB2YXIgZm91bmQgPSBmYWxzZTsgLy8gZGVmYXVsdCB0byBub3QgZm91bmRcblxuICAgIGF1ZGlvRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoYXVkaW8pIHtcbiAgICAgIHZhciBwcmVjZWRpbmdEaXYgPSBhdWRpby5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuXG4gICAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGZvdW5kIGEgZGl2LCB3ZSBjYW4gc2tpcCBmdXJ0aGVyIGl0ZXJhdGlvbnNcbiAgICAgIGlmIChmb3VuZCkgcmV0dXJuO1xuXG4gICAgICAvLyBDaGVjayBpZiB0aGUgcHJlY2VkaW5nIGVsZW1lbnQgaXMgYSBkaXZcbiAgICAgIGlmIChwcmVjZWRpbmdEaXYgJiYgcHJlY2VkaW5nRGl2LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJkaXZcIikge1xuICAgICAgICAvLyBBc3NpZ24gYW4gSUQgdG8gdGhlIGRpdlxuICAgICAgICBwcmVjZWRpbmdEaXYuaWQgPSBcInNheXBpLWZvb3RlclwiO1xuICAgICAgICBmb3VuZCA9IHRydWU7IC8vIHNldCB0byBmb3VuZFxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGZvdW5kO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5qZWN0U2NyaXB0KGNhbGxiYWNrKSB7XG4gICAgdmFyIHNjcmlwdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgIHNjcmlwdEVsZW1lbnQudHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCI7XG4gICAgc2NyaXB0RWxlbWVudC5pZCA9IFwic2F5cGktc2NyaXB0XCI7XG4gICAgY29uc3QgY29uZmlnVGV4dCA9IFwidmFyIGNvbmZpZyA9IFwiICsgSlNPTi5zdHJpbmdpZnkoY29uZmlnKSArIFwiO1wiO1xuICAgIHNjcmlwdEVsZW1lbnQudGV4dENvbnRlbnQgPSBjb25maWdUZXh0ICsgcGFnZVNjcmlwdDtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdEVsZW1lbnQpO1xuXG4gICAgLy8gQ2FsbCB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gYWZ0ZXIgdGhlIHNjcmlwdCBpcyBhZGRlZFxuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpc01vYmlsZVZpZXcoKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1heC13aWR0aDogNzY4cHgpXCIpLm1hdGNoZXM7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRUYWxrQnV0dG9uKGNvbnRhaW5lcikge1xuICAgIC8vIGNyZWF0ZSBhIGNvbnRhaW5pbmcgZGl2XG4gICAgdmFyIHBhbmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBwYW5lbC5pZCA9IFwic2F5cGktcGFuZWxcIjtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQocGFuZWwpO1xuXG4gICAgdmFyIGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgYnV0dG9uLmlkID0gXCJzYXlwaS10YWxrQnV0dG9uXCI7XG4gICAgYnV0dG9uLnR5cGUgPSBcImJ1dHRvblwiO1xuICAgIGJ1dHRvbi5jbGFzc05hbWUgPVxuICAgICAgXCJyZWxhdGl2ZSBmbGV4IG10LTEgbWItMSByb3VuZGVkLWZ1bGwgcHgtMiBweS0zIHRleHQtY2VudGVyIGJnLWNyZWFtLTU1MCBob3ZlcjpiZy1jcmVhbS02NTAgaG92ZXI6dGV4dC1icmFuZC1ncmVlbi03MDAgdGV4dC1tdXRlZFwiO1xuICAgIC8vIFNldCBBUklBIGxhYmVsIGFuZCB0b29sdGlwXG4gICAgY29uc3QgbGFiZWwgPVxuICAgICAgXCJUYWxrIChIb2xkIENvbnRyb2wgKyBTcGFjZSB0byB1c2UgaG90a2V5LiBEb3VibGUgY2xpY2sgdG8gdG9nZ2xlIGF1dG8tc3VibWl0IG9uL29mZilcIjtcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBsYWJlbCk7XG4gICAgYnV0dG9uLnNldEF0dHJpYnV0ZShcInRpdGxlXCIsIGxhYmVsKTtcbiAgICAvLyBlbmFibGUgYXV0b3N1Ym1pdCBieSBkZWZhdWx0XG4gICAgYnV0dG9uLmRhdGFzZXQuYXV0b3N1Ym1pdCA9IFwidHJ1ZVwiO1xuICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiYXV0b1N1Ym1pdFwiKTtcbiAgICBwYW5lbC5hcHBlbmRDaGlsZChidXR0b24pO1xuICAgIGFkZFRhbGtCdXR0b25TdHlsZXMoKTtcbiAgICBhZGRUYWxrSWNvbihidXR0b24pO1xuXG4gICAgLy8gQ2FsbCB0aGUgZnVuY3Rpb24gdG8gaW5qZWN0IHRoZSBzY3JpcHQgYWZ0ZXIgdGhlIGJ1dHRvbiBoYXMgYmVlbiBhZGRlZFxuICAgIGluamVjdFNjcmlwdChyZWdpc3RlckF1ZGlvQnV0dG9uRXZlbnRzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFRhbGtJY29uKGJ1dHRvbikge1xuICAgIHVwZGF0ZUljb25Db250ZW50KGJ1dHRvbik7XG5cbiAgICB3aW5kb3cubWF0Y2hNZWRpYShcIihtYXgtd2lkdGg6IDc2OHB4KVwiKS5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICB1cGRhdGVJY29uQ29udGVudChidXR0b24pO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlSWNvbkNvbnRlbnQoaWNvbkNvbnRhaW5lcikge1xuICAgIGlmIChpc01vYmlsZVZpZXcoKSkge1xuICAgICAgaWNvbkNvbnRhaW5lci5pbm5lckhUTUwgPSByZWN0YW5nbGVzU1ZHO1xuICAgIH0gZWxzZSB7XG4gICAgICBpY29uQ29udGFpbmVyLmlubmVySFRNTCA9IHRhbGtJY29uU1ZHO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFN0eWxlcyhjc3MpIHtcbiAgICBjb25zdCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgICBzdHlsZS50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkVGFsa0J1dHRvblN0eWxlcygpIHtcbiAgICB2YXIgaXNGaXJlZm94QW5kcm9pZCA9XG4gICAgICAvRmlyZWZveC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSAmJlxuICAgICAgL0FuZHJvaWQvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gICAgaWYgKGlzRmlyZWZveEFuZHJvaWQpIHtcbiAgICAgIC8vIGhhY2sgZm9yIEZpcmVmb3ggb24gQW5kcm9pZCwgd2hpY2ggZG9lc24ndCBzdXBwb3J0IDphY3RpdmUgY29ycmVjdGx5XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImZpcmVmb3gtYW5kcm9pZFwiKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZWdpc3RlckF1ZGlvQnV0dG9uRXZlbnRzKCkge1xuICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F5cGktdGFsa0J1dHRvblwiKTtcbiAgICBsZXQgY29udGV4dCA9IHdpbmRvdztcbiAgICBpZiAoR01faW5mby5zY3JpcHRIYW5kbGVyICE9PSBcIlVzZXJzY3JpcHRzXCIpIHtcbiAgICAgIGNvbnRleHQgPSB1bnNhZmVXaW5kb3c7XG4gICAgfVxuXG4gICAgY29uc3QgdGFsa0hhbmRsZXJzID0ge1xuICAgICAgbW91c2Vkb3duOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlkUHJvbXB0VGV4dEFyZWEoKTtcbiAgICAgICAgY29udGV4dC5zdGFydFJlY29yZGluZygpO1xuICAgICAgfSxcbiAgICAgIG1vdXNldXA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb250ZXh0Py5zdG9wUmVjb3JkaW5nID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBjb250ZXh0LnN0b3BSZWNvcmRpbmcoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGRibGNsaWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFRvZ2dsZSB0aGUgQ1NTIGNsYXNzZXMgdG8gaW5kaWNhdGUgdGhlIG1vZGVcbiAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoXCJhdXRvU3VibWl0XCIpO1xuICAgICAgICBpZiAoYnV0dG9uLmdldEF0dHJpYnV0ZShcImRhdGEtYXV0b3N1Ym1pdFwiKSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICBidXR0b24uc2V0QXR0cmlidXRlKFwiZGF0YS1hdXRvc3VibWl0XCIsIFwiZmFsc2VcIik7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJhdXRvc3VibWl0IGRpc2FibGVkXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJkYXRhLWF1dG9zdWJtaXRcIiwgXCJ0cnVlXCIpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiYXV0b3N1Ym1pdCBlbmFibGVkXCIpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdG91Y2hzdGFydDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZFByb21wdFRleHRBcmVhKCk7XG4gICAgICAgIGNvbnRleHQuc3RhcnRSZWNvcmRpbmcoKTtcbiAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgICB9LFxuICAgICAgdG91Y2hlbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG4gICAgICAgIGNvbnRleHQuc3RvcFJlY29yZGluZygpO1xuICAgICAgfSxcbiAgICB9O1xuXG4gICAgZm9yIChjb25zdCBldmVudFR5cGUgaW4gdGFsa0hhbmRsZXJzKSB7XG4gICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIHRhbGtIYW5kbGVyc1tldmVudFR5cGVdKTtcbiAgICB9XG5cbiAgICByZWdpc3Rlck90aGVyQXVkaW9CdXR0b25FdmVudHMoYnV0dG9uKTtcbiAgICByZWdpc3RlckN1c3RvbUF1ZGlvRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICByZWdpc3RlckhvdGtleSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVnaXN0ZXJPdGhlckF1ZGlvQnV0dG9uRXZlbnRzKGJ1dHRvbikge1xuICAgIC8qIG90aGVyIGhhbmRsZXJzIGZvciB0aGUgdGFsayBidXR0b24sIGJ1dCBub3QgJ3ByZXNzIHRvIHRhbGsnICovXG5cbiAgICAvLyBcIndhcm0gdXBcIiB0aGUgbWljcm9waG9uZSBieSBhY3F1aXJpbmcgaXQgYmVmb3JlIHRoZSB1c2VyIHByZXNzZXMgdGhlIGJ1dHRvblxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCBzZXR1cFJlY29yZGluZyk7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsIHRlYXJEb3duUmVjb3JkaW5nKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImJlZm9yZXVubG9hZFwiLCB0ZWFyRG93blJlY29yZGluZyk7XG5cbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoY2FuY2VsXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTsgLy8gUmVtb3ZlIHRoZSBhY3RpdmUgY2xhc3MgKGZvciBGaXJlZm94IG9uIEFuZHJvaWQpXG4gICAgICB0ZWFyRG93blJlY29yZGluZygpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVnaXN0ZXJDdXN0b21BdWRpb0V2ZW50TGlzdGVuZXJzKCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2F5cGk6cGlSZWFkeVRvUmVzcG9uZFwiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgY29uc29sZS5sb2coXCJwaVJlYWR5VG9SZXNwb25kIGV2ZW50IHJlY2VpdmVkIGJ5IFVJIHNjcmlwdFwiKTtcbiAgICAgIGlmIChpc1NhZmFyaSgpKSB7XG4gICAgICAgIHBva2VVc2VyKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNheXBpOnBpU3BlYWtpbmdcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgIC8vIEhhbmRsZSB0aGUgcGlTcGVha2luZyBldmVudCwgZS5nLiwgc3RhcnQgYW4gYW5pbWF0aW9uIG9yIHNob3cgYSBVSSBlbGVtZW50LlxuICAgICAgY29uc29sZS5sb2coXCJwaVNwZWFraW5nIGV2ZW50IHJlY2VpdmVkIGJ5IFVJIHNjcmlwdFwiKTtcbiAgICAgIGlmIChpc1NhZmFyaSgpKSB7XG4gICAgICAgIHVucG9rZVVzZXIoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVBsYXlCdXR0b24oKSB7XG4gICAgbGV0IHBsYXlCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgIHBsYXlCdXR0b24uaWQgPSBcInNheXBpLXBsYXlCdXR0b25cIjtcbiAgICBwbGF5QnV0dG9uLnR5cGUgPSBcImJ1dHRvblwiO1xuICAgIHBsYXlCdXR0b24uY2xhc3NOYW1lID0gXCJoaWRkZW4gcGxheS1idXR0b25cIjtcbiAgICBwbGF5QnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJIZWFyIFBpJ3MgcmVzcG9uc2VcIik7XG4gICAgcGxheUJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiLCBcIkhlYXIgUGkncyByZXNwb25zZVwiKTtcbiAgICBwbGF5QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVQbGF5QnV0dG9uQ2xpY2spO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocGxheUJ1dHRvbik7XG4gICAgcmV0dXJuIHBsYXlCdXR0b247XG4gIH1cblxuICBmdW5jdGlvbiBzaG93UGxheUJ1dHRvbigpIHtcbiAgICBsZXQgcGxheUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F5cGktcGxheUJ1dHRvblwiKTtcbiAgICBpZiAoIXBsYXlCdXR0b24pIHtcbiAgICAgIHBsYXlCdXR0b24gPSBjcmVhdGVQbGF5QnV0dG9uKCk7XG4gICAgfVxuICAgIHBsYXlCdXR0b24uY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhpZGVQbGF5QnV0dG9uKCkge1xuICAgIGxldCBwbGF5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS1wbGF5QnV0dG9uXCIpO1xuICAgIGlmIChwbGF5QnV0dG9uKSB7XG4gICAgICBwbGF5QnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgfVxuICB9XG5cbiAgbGV0IHRhbGtCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNheXBpLXRhbGtCdXR0b25cIik7XG4gIGZ1bmN0aW9uIHBva2VVc2VyKCkge1xuICAgIGFuaW1hdGUoXCJyZWFkeVRvUmVzcG9uZFwiKTtcbiAgICBzaG93UGxheUJ1dHRvbigpO1xuICB9XG5cbiAgZnVuY3Rpb24gdW5wb2tlVXNlcigpIHtcbiAgICBpbmFuaW1hdGUoXCJyZWFkeVRvUmVzcG9uZFwiKTtcbiAgICBoaWRlUGxheUJ1dHRvbigpO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlUGxheUJ1dHRvbkNsaWNrKCkge1xuICAgIHBpQXVkaW9NYW5hZ2VyLnVzZXJQbGF5KCk7XG4gICAgdW5wb2tlVXNlcigpO1xuICB9XG5cbiAgLyogYmVnaW4gYW5pbWF0aW9uIGZ1bmN0aW9ucyAqL1xuICBmdW5jdGlvbiBhbmltYXRlKGFuaW1hdGlvbikge1xuICAgIHN0b3BPdGhlckFuaW1hdGlvbnMoYW5pbWF0aW9uKTtcblxuICAgIGxldCByZWN0YW5nbGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgIFwiLm91dGVybW9zdCwgLnNlY29uZCwgLnRoaXJkLCAuZm91cnRoLCAuZmlmdGgsIC5pbm5lcm1vc3RcIlxuICAgICk7XG5cbiAgICAvLyBUbyBhY3RpdmF0ZSB0aGUgYW5pbWF0aW9uXG4gICAgcmVjdGFuZ2xlcy5mb3JFYWNoKChyZWN0KSA9PiByZWN0LmNsYXNzTGlzdC5hZGQoYW5pbWF0aW9uKSk7XG4gIH1cblxuICBmdW5jdGlvbiBpbmFuaW1hdGUoYW5pbWF0aW9uKSB7XG4gICAgbGV0IHJlY3RhbmdsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgXCIub3V0ZXJtb3N0LCAuc2Vjb25kLCAudGhpcmQsIC5mb3VydGgsIC5maWZ0aCwgLmlubmVybW9zdFwiXG4gICAgKTtcblxuICAgIC8vIFRvIHJldmVydCB0byB0aGUgZGVmYXVsdCBwdWxzZSBhbmltYXRpb25cbiAgICByZWN0YW5nbGVzLmZvckVhY2goKHJlY3QpID0+IHJlY3QuY2xhc3NMaXN0LnJlbW92ZShhbmltYXRpb24pKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0b3BBbGxBbmltYXRpb25zKCkge1xuICAgIGNvbnN0IHRhbGtCdXR0b25BbmltYXRpb25zID0gW1wicmVhZHlUb1Jlc3BvbmRcIl07XG4gICAgdGFsa0J1dHRvbkFuaW1hdGlvbnMuZm9yRWFjaCgoYW5pbWF0aW9uKSA9PiBpbmFuaW1hdGUoYW5pbWF0aW9uKSk7XG4gIH1cblxuICBmdW5jdGlvbiBzdG9wT3RoZXJBbmltYXRpb25zKGtlZXBBbmltYXRpb24pIHtcbiAgICBjb25zdCB0YWxrQnV0dG9uQW5pbWF0aW9ucyA9IFtcInJlYWR5VG9SZXNwb25kXCJdO1xuICAgIHRhbGtCdXR0b25BbmltYXRpb25zLmZvckVhY2goKGFuaW1hdGlvbikgPT4ge1xuICAgICAgaWYgKGFuaW1hdGlvbiAhPT0ga2VlcEFuaW1hdGlvbikge1xuICAgICAgICBpbmFuaW1hdGUoYW5pbWF0aW9uKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICAvKiBlbmQgYW5pbWF0aW9uIGZ1bmN0aW9ucyAqL1xuXG4gIGZ1bmN0aW9uIHJlZ2lzdGVySG90a2V5KCkge1xuICAgIC8vIFJlZ2lzdGVyIGEgaG90a2V5IGZvciB0aGUgYnV0dG9uXG4gICAgbGV0IGN0cmxEb3duID0gZmFsc2U7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmIChldmVudC5jdHJsS2V5ICYmIGV2ZW50LmNvZGUgPT09IFwiU3BhY2VcIiAmJiAhY3RybERvd24pIHtcbiAgICAgICAgY3RybERvd24gPSB0cnVlO1xuICAgICAgICAvLyBTaW11bGF0ZSBtb3VzZWRvd24gZXZlbnRcbiAgICAgICAgbGV0IG1vdXNlRG93bkV2ZW50ID0gbmV3IEV2ZW50KFwibW91c2Vkb3duXCIpO1xuICAgICAgICBkb2N1bWVudFxuICAgICAgICAgIC5nZXRFbGVtZW50QnlJZChcInNheXBpLXRhbGtCdXR0b25cIilcbiAgICAgICAgICAuZGlzcGF0Y2hFdmVudChtb3VzZURvd25FdmVudCk7XG4gICAgICAgIHRhbGtCdXR0b24uY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTsgLy8gQWRkIHRoZSBhY3RpdmUgY2xhc3NcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmIChjdHJsRG93biAmJiBldmVudC5jb2RlID09PSBcIlNwYWNlXCIpIHtcbiAgICAgICAgY3RybERvd24gPSBmYWxzZTtcbiAgICAgICAgLy8gU2ltdWxhdGUgbW91c2V1cCBldmVudFxuICAgICAgICBsZXQgbW91c2VVcEV2ZW50ID0gbmV3IEV2ZW50KFwibW91c2V1cFwiKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS10YWxrQnV0dG9uXCIpLmRpc3BhdGNoRXZlbnQobW91c2VVcEV2ZW50KTtcbiAgICAgICAgdGFsa0J1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gaWRQcm9tcHRUZXh0QXJlYSgpIHtcbiAgICB2YXIgdGV4dGFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByb21wdFwiKTtcbiAgICBpZiAoIXRleHRhcmVhKSB7XG4gICAgICAvLyBGaW5kIHRoZSBmaXJzdCA8dGV4dGFyZWE+IGVsZW1lbnQgYW5kIGdpdmUgaXQgYW4gaWRcbiAgICAgIHZhciB0ZXh0YXJlYUVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidGV4dGFyZWFcIik7XG4gICAgICBpZiAodGV4dGFyZWFFbGVtZW50KSB7XG4gICAgICAgIHRleHRhcmVhRWxlbWVudC5pZCA9IFwicHJvbXB0XCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZyhcIk5vIDx0ZXh0YXJlYT4gZWxlbWVudCBmb3VuZFwiKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBTdGFydCBvYnNlcnZpbmcgdGhlIGVudGlyZSBkb2N1bWVudCBmb3IgY2hhbmdlcyB0byBjaGlsZCBub2RlcyBhbmQgc3VidHJlZVxuICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LCB7IGNoaWxkTGlzdDogdHJ1ZSwgc3VidHJlZTogdHJ1ZSB9KTtcbn0pKCk7XG4iXSwibmFtZXMiOlsidGFsa0ljb25TVkciLCJyZWN0YW5nbGVzU1ZHIiwibG9jYWxDb25maWciLCJhcHBTZXJ2ZXJVcmwiLCJhcGlTZXJ2ZXJVcmwiLCJwcm9kdWN0aW9uQ29uZmlnIiwiY29uZmlnIiwicGFnZVNjcmlwdCIsInJlcXVpcmUiLCJvYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJtdXRhdGlvbnMiLCJpIiwibGVuZ3RoIiwibXV0YXRpb24iLCJhZGRlZE5vZGVzIiwiaiIsIm5vZGUiLCJub2RlTmFtZSIsInRvTG93ZXJDYXNlIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJmb290ZXIiLCJidXR0b25Db250YWluZXIiLCJxdWVyeVNlbGVjdG9yIiwiYWRkVGFsa0J1dHRvbiIsImNvbnNvbGUiLCJ3YXJuIiwiaWRlbnRpZnlGb290ZXIiLCJkaXNjb25uZWN0IiwiYXVkaW9FbGVtZW50cyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsImZvdW5kIiwiZm9yRWFjaCIsImF1ZGlvIiwicHJlY2VkaW5nRGl2IiwicHJldmlvdXNFbGVtZW50U2libGluZyIsInRhZ05hbWUiLCJpZCIsImluamVjdFNjcmlwdCIsImNhbGxiYWNrIiwic2NyaXB0RWxlbWVudCIsImNyZWF0ZUVsZW1lbnQiLCJ0eXBlIiwiY29uZmlnVGV4dCIsIkpTT04iLCJzdHJpbmdpZnkiLCJ0ZXh0Q29udGVudCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsImlzTW9iaWxlVmlldyIsIndpbmRvdyIsIm1hdGNoTWVkaWEiLCJtYXRjaGVzIiwiY29udGFpbmVyIiwicGFuZWwiLCJidXR0b24iLCJjbGFzc05hbWUiLCJsYWJlbCIsInNldEF0dHJpYnV0ZSIsImRhdGFzZXQiLCJhdXRvc3VibWl0IiwiYWRkIiwiYWRkVGFsa0J1dHRvblN0eWxlcyIsImFkZFRhbGtJY29uIiwicmVnaXN0ZXJBdWRpb0J1dHRvbkV2ZW50cyIsInVwZGF0ZUljb25Db250ZW50IiwiYWRkTGlzdGVuZXIiLCJpY29uQ29udGFpbmVyIiwiaW5uZXJIVE1MIiwiYWRkU3R5bGVzIiwiY3NzIiwic3R5bGUiLCJjcmVhdGVUZXh0Tm9kZSIsImhlYWQiLCJpc0ZpcmVmb3hBbmRyb2lkIiwidGVzdCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsImRvY3VtZW50RWxlbWVudCIsImdldEVsZW1lbnRCeUlkIiwiY29udGV4dCIsIkdNX2luZm8iLCJzY3JpcHRIYW5kbGVyIiwidW5zYWZlV2luZG93IiwidGFsa0hhbmRsZXJzIiwibW91c2Vkb3duIiwiaWRQcm9tcHRUZXh0QXJlYSIsInN0YXJ0UmVjb3JkaW5nIiwibW91c2V1cCIsIl9jb250ZXh0Iiwic3RvcFJlY29yZGluZyIsImRibGNsaWNrIiwidG9nZ2xlIiwiZ2V0QXR0cmlidXRlIiwibG9nIiwidG91Y2hzdGFydCIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInRvdWNoZW5kIiwicmVtb3ZlIiwiZXZlbnRUeXBlIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlZ2lzdGVyT3RoZXJBdWRpb0J1dHRvbkV2ZW50cyIsInJlZ2lzdGVyQ3VzdG9tQXVkaW9FdmVudExpc3RlbmVycyIsInJlZ2lzdGVySG90a2V5Iiwic2V0dXBSZWNvcmRpbmciLCJ0ZWFyRG93blJlY29yZGluZyIsImlzU2FmYXJpIiwicG9rZVVzZXIiLCJ1bnBva2VVc2VyIiwiY3JlYXRlUGxheUJ1dHRvbiIsInBsYXlCdXR0b24iLCJoYW5kbGVQbGF5QnV0dG9uQ2xpY2siLCJzaG93UGxheUJ1dHRvbiIsImhpZGVQbGF5QnV0dG9uIiwidGFsa0J1dHRvbiIsImFuaW1hdGUiLCJpbmFuaW1hdGUiLCJwaUF1ZGlvTWFuYWdlciIsInVzZXJQbGF5IiwiYW5pbWF0aW9uIiwic3RvcE90aGVyQW5pbWF0aW9ucyIsInJlY3RhbmdsZXMiLCJyZWN0Iiwic3RvcEFsbEFuaW1hdGlvbnMiLCJ0YWxrQnV0dG9uQW5pbWF0aW9ucyIsImtlZXBBbmltYXRpb24iLCJjdHJsRG93biIsImV2ZW50IiwiY3RybEtleSIsImNvZGUiLCJtb3VzZURvd25FdmVudCIsIkV2ZW50IiwiZGlzcGF0Y2hFdmVudCIsIm1vdXNlVXBFdmVudCIsInRleHRhcmVhIiwidGV4dGFyZWFFbGVtZW50Iiwib2JzZXJ2ZSIsImNoaWxkTGlzdCIsInN1YnRyZWUiXSwic291cmNlUm9vdCI6IiJ9