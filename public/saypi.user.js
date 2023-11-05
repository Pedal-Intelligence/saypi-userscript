// ==UserScript==
// @name         Say, Pi
// @name:zh-CN   说，Pi 
// @namespace    http://www.saypi.ai/
// @version      1.4.7
// @description  Speak to Pi with accurate, hands-free conversations powered by OpenAI's Whisper
// @description:zh-CN  使用OpenAI的Whisper与Pi对话
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
`, "",{"version":3,"sources":["webpack://./src/styles/rectangles.css"],"names":[],"mappings":"AAAA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,sBAAsB;EACxB;AACF;AACA;EACE,sCAAsC;EACtC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,mCAAmC;EACnC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,kCAAkC;EAClC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,mCAAmC;EACnC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,kCAAkC;EAClC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,qBAAqB;EACvB;AACF;AACA;EACE,sCAAsC;EACtC,wBAAwB;AAC1B;;AAEA,iDAAiD;AACjD;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,uBAAuB;EACzB;EACA;IACE,qBAAqB;EACvB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,yCAAyC;EACzC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,oCAAoC;EACtC;EACA;IACE,mCAAmC;EACrC;EACA;IACE,oCAAoC;EACtC;AACF;AACA;EACE,sCAAsC;EACtC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,qCAAqC;EACvC;EACA;IACE,mCAAmC;EACrC;EACA;IACE,oCAAoC;EACtC;AACF;AACA;EACE,qCAAqC;EACrC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,oCAAoC;EACtC;EACA;IACE,mCAAmC;EACrC;EACA;IACE,oCAAoC;EACtC;AACF;AACA;EACE,sCAAsC;EACtC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,qCAAqC;EACvC;EACA;IACE,mCAAmC;EACrC;EACA;IACE,oCAAoC;EACtC;AACF;AACA;EACE,qCAAqC;EACrC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,oCAAoC;EACtC;EACA;IACE,mCAAmC;EACrC;EACA;IACE,oCAAoC;EACtC;AACF;AACA;EACE,yCAAyC;EACzC,wBAAwB;AAC1B;;AAEA,gDAAgD;AAChD;EACE;IACE;mDAC+C;EACjD;EACA;IACE;mDAC+C;EACjD;AACF;AACA,wCAAwC;AACxC;EACE;;IAEE,8BAA8B;EAChC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE;;IAEE,kCAAkC;EACpC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE;;IAEE,kCAAkC;EACpC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE;;IAEE,kCAAkC;EACpC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE;;IAEE,kCAAkC;EACpC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE;;IAEE,kCAAkC;EACpC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE,qDAAqD;AACvD;;AAEA;EACE,mDAAmD;AACrD;;AAEA;EACE,iDAAiD;AACnD;;AAEA;EACE,mDAAmD;AACrD;;AAEA;EACE,iDAAiD;AACnD;;AAEA;EACE,sDAAsD;AACxD;;AAEA,yEAAyE;AACzE;EACE;;IAEE,wBAAwB;IACxB,2BAA2B;EAC7B;EACA;IACE,0BAA0B;IAC1B,+BAA+B;EACjC;AACF;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,yCAAyC;AAC3C;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,yCAAyC;AAC3C;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,yCAAyC;AAC3C;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,yCAAyC;AAC3C;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,yCAAyC;AAC3C;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,uCAAuC;AACzC;;AAEA,6DAA6D;AAC7D;EACE;;IAEE,UAAU;IACV,2BAA2B;EAC7B;EACA;IACE,YAAY;IACZ,sBAAsB,EAAE,iBAAiB;EAC3C;AACF;;AAEA,sDAAsD;AACtD,oDAAoD;AACpD;EACE;IACE,yCAAyC;EAC3C;EACA;IACE,2CAA2C;EAC7C;EACA;IACE,0CAA0C;EAC5C;EACA;IACE,2CAA2C;EAC7C;EACA;IACE,yCAAyC;EAC3C;AACF;;AAEA;EACE,+BAA+B;EAC/B,aAAa;EACb,iBAAiB;AACnB;;AAEA;EACE,+BAA+B;EAC/B,aAAa;EACb,iBAAiB;AACnB;;AAEA;EACE,+BAA+B;EAC/B,aAAa;EACb,iBAAiB;AACnB;;AAEA;EACE,+BAA+B;EAC/B,aAAa;EACb,iBAAiB;AACnB;;AAEA;EACE,+BAA+B;EAC/B,aAAa;EACb,iBAAiB;AACnB;;AAEA;EACE,+BAA+B;EAC/B,aAAa;EACb,iBAAiB;AACnB","sourcesContent":["@keyframes pulse_outermost {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.92);\n  }\n}\n.outermost {\n  animation: pulse_outermost 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_second {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.856);\n  }\n}\n.second {\n  animation: pulse_second 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_third {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.792);\n  }\n}\n.third {\n  animation: pulse_third 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_fourth {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.728);\n  }\n}\n.fourth {\n  animation: pulse_fourth 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_fifth {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.664);\n  }\n}\n.fifth {\n  animation: pulse_fifth 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_innermost {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.6);\n  }\n}\n.innermost {\n  animation: pulse_innermost 5s infinite;\n  transform-origin: center;\n}\n\n/* playful animation to indicate Pi is speaking */\n@keyframes speaking_outermost {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.995);\n  }\n  50% {\n    transform: scale(0.9);\n  }\n  75% {\n    transform: scale(0.895);\n  }\n}\n.outermost.piSpeaking {\n  animation: speaking_outermost 2s infinite;\n  transform-origin: center;\n}\n\n@keyframes speaking_second {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.98) rotate(-1deg);\n  }\n  50% {\n    transform: scale(0.87) rotate(0deg);\n  }\n  75% {\n    transform: scale(0.865) rotate(1deg);\n  }\n}\n.second.piSpeaking {\n  animation: speaking_second 2s infinite;\n  transform-origin: center;\n}\n\n@keyframes speaking_third {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.965) rotate(-2deg);\n  }\n  50% {\n    transform: scale(0.84) rotate(0deg);\n  }\n  75% {\n    transform: scale(0.835) rotate(2deg);\n  }\n}\n.third.piSpeaking {\n  animation: speaking_third 2s infinite;\n  transform-origin: center;\n}\n\n@keyframes speaking_fourth {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.95) rotate(-3deg);\n  }\n  50% {\n    transform: scale(0.81) rotate(0deg);\n  }\n  75% {\n    transform: scale(0.805) rotate(3deg);\n  }\n}\n.fourth.piSpeaking {\n  animation: speaking_fourth 2s infinite;\n  transform-origin: center;\n}\n\n@keyframes speaking_fifth {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.935) rotate(-4deg);\n  }\n  50% {\n    transform: scale(0.78) rotate(0deg);\n  }\n  75% {\n    transform: scale(0.775) rotate(4deg);\n  }\n}\n.fifth.piSpeaking {\n  animation: speaking_fifth 2s infinite;\n  transform-origin: center;\n}\n\n@keyframes speaking_innermost {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.92) rotate(-5deg);\n  }\n  50% {\n    transform: scale(0.75) rotate(0deg);\n  }\n  75% {\n    transform: scale(0.745) rotate(5deg);\n  }\n}\n.innermost.piSpeaking {\n  animation: speaking_innermost 2s infinite;\n  transform-origin: center;\n}\n\n/* wave animation to indicate user is speaking */\n@keyframes userSpeakingAnimation {\n  50% {\n    transform: scaleY(0.05) scaleX(var(--width-factor))\n      translateX(calc(-50% + var(--spread-amount)));\n  }\n  100% {\n    transform: scaleY(1) scaleX(var(--width-factor))\n      translateX(calc(-50% + var(--spread-amount)));\n  }\n}\n/* user speaking oscillation animation */\n@keyframes waveform_outermost {\n  0%,\n  100% {\n    transform: scaleY(1) scaleX(1);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.9) scaleX(0.9);\n  }\n}\n\n@keyframes waveform_second {\n  0%,\n  100% {\n    transform: scaleY(0.9) scaleX(0.9);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.8) scaleX(0.8);\n  }\n}\n\n@keyframes waveform_third {\n  0%,\n  100% {\n    transform: scaleY(0.8) scaleX(0.8);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.7) scaleX(0.7);\n  }\n}\n\n@keyframes waveform_fourth {\n  0%,\n  100% {\n    transform: scaleY(0.7) scaleX(0.7);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.6) scaleX(0.6);\n  }\n}\n\n@keyframes waveform_fifth {\n  0%,\n  100% {\n    transform: scaleY(0.6) scaleX(0.6);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.5) scaleX(0.5);\n  }\n}\n\n@keyframes waveform_innermost {\n  0%,\n  100% {\n    transform: scaleY(0.5) scaleX(0.5);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.4) scaleX(0.4);\n  }\n}\n\n.outermost.userSpeaking {\n  animation: waveform_outermost 0.7s infinite alternate;\n}\n\n.second.userSpeaking {\n  animation: waveform_second 0.65s infinite alternate;\n}\n\n.third.userSpeaking {\n  animation: waveform_third 0.6s infinite alternate;\n}\n\n.fourth.userSpeaking {\n  animation: waveform_fourth 0.55s infinite alternate;\n}\n\n.fifth.userSpeaking {\n  animation: waveform_fifth 0.5s infinite alternate;\n}\n\n.innermost.userSpeaking {\n  animation: waveform_innermost 0.45s infinite alternate;\n}\n\n/* flipcard animation to indicate Say, Pi is transcribing audio to text */\n@keyframes transcribingFlip {\n  0%,\n  100% {\n    transform: rotateY(0deg);\n    fill: var(--original-color);\n  }\n  50% {\n    transform: rotateY(180deg);\n    fill: var(--transcribing-color);\n  }\n}\n\n.outermost.transcribing {\n  --original-color: #e4f2d1;\n  --transcribing-color: #b3e0fe;\n  animation: transcribingFlip 1.5s infinite;\n}\n\n.second.transcribing {\n  --original-color: #cce8b5;\n  --transcribing-color: #89c2ff;\n  animation: transcribingFlip 1.6s infinite;\n}\n\n.third.transcribing {\n  --original-color: #b3db95;\n  --transcribing-color: #5fa4ff;\n  animation: transcribingFlip 1.7s infinite;\n}\n\n.fourth.transcribing {\n  --original-color: #9bd078;\n  --transcribing-color: #3586ff;\n  animation: transcribingFlip 1.8s infinite;\n}\n\n.fifth.transcribing {\n  --original-color: #83c55c;\n  --transcribing-color: #0b69e3;\n  animation: transcribingFlip 1.9s infinite;\n}\n\n.innermost.transcribing {\n  --original-color: #428a2f;\n  --transcribing-color: #0053bf;\n  animation: transcribingFlip 2s infinite;\n}\n\n/* heartbeat animation to indicate Pi is preparing to speak */\n@keyframes heartbeat {\n  0%,\n  100% {\n    opacity: 1;\n    fill: var(--original-color);\n  }\n  50% {\n    opacity: 0.5;\n    fill: rgb(245 238 223); /* bg-cream-550 */\n  }\n}\n\n/* toned-down dissary animation to indicate an error */\n/* toned-down error animation with reduced opacity */\n@keyframes errorAnimation {\n  0% {\n    transform: rotate(0deg) translate(0%, 0%);\n  }\n  25% {\n    transform: rotate(-5deg) translate(-5%, 5%);\n  }\n  50% {\n    transform: rotate(5deg) translate(5%, -5%);\n  }\n  75% {\n    transform: rotate(-5deg) translate(-5%, 5%);\n  }\n  100% {\n    transform: rotate(0deg) translate(0%, 0%);\n  }\n}\n\n.outermost.error {\n  animation: errorAnimation 25s 1;\n  fill: #ff0000;\n  fill-opacity: 0.7;\n}\n\n.second.error {\n  animation: errorAnimation 25s 1;\n  fill: #ff3300;\n  fill-opacity: 0.7;\n}\n\n.third.error {\n  animation: errorAnimation 25s 1;\n  fill: #ff6600;\n  fill-opacity: 0.7;\n}\n\n.fourth.error {\n  animation: errorAnimation 25s 1;\n  fill: #ff9900;\n  fill-opacity: 0.7;\n}\n\n.fifth.error {\n  animation: errorAnimation 25s 1;\n  fill: #ffcc00;\n  fill-opacity: 0.7;\n}\n\n.innermost.error {\n  animation: errorAnimation 25s 1;\n  fill: #ffff00;\n  fill-opacity: 0.7;\n}\n"],"sourceRoot":""}]);
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
  display: none !important;
}

#saypi-callButton.disabled svg path.circle {
  fill: rgb(245, 238, 223); /* bg-cream-550 */
}

.mobile-device {
  /* maximize (mobile view) button is only displayed on compatible devices */
}
.mobile-device #saypi-enterButton,
.mobile-device #saypi-exitButton {
  position: fixed;
  top: 4rem;
  left: 1.25rem;
  width: 3rem;
  height: 3rem;
  padding: 6px;
  border: 0;
  z-index: 60;
}`, "",{"version":3,"sources":["webpack://./src/styles/common.scss"],"names":[],"mappings":"AAAA;EACE,wBAAA;AACF;;AAEA;EACE,wBAAA,EAAA,iBAAA;AACF;;AAEA;EACE,0EAAA;AACF;AAAE;;EAEE,eAAA;EACA,SAAA;EACA,aAAA;EACA,WAAA;EACA,YAAA;EACA,YAAA;EACA,SAAA;EACA,WAAA;AAEJ","sourcesContent":[".hidden {\n  display: none !important;\n}\n\n#saypi-callButton.disabled svg path.circle {\n  fill: rgb(245 238 223); /* bg-cream-550 */\n}\n\n.mobile-device {\n  /* maximize (mobile view) button is only displayed on compatible devices */\n  #saypi-enterButton,\n  #saypi-exitButton {\n    position: fixed;\n    top: 4rem;\n    left: 1.25rem;\n    width: 3rem;\n    height: 3rem;\n    padding: 6px;\n    border: 0;\n    z-index: 60;\n  }\n}\n"],"sourceRoot":""}]);
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
html.desktop-view #saypi-talkButton {
  /* not needed on desktop with call button */
  display: none;
}
html.desktop-view #saypi-callButton {
  height: 2.25rem;
  width: 2.25rem;
  position: relative;
  margin: 0.5rem 0 0.5rem 0;
}
html.desktop-view .saypi-prompt-container {
  /* make room in the prompt text area for the call button */
  padding-right: 0;
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
}`, "",{"version":3,"sources":["webpack://./src/styles/desktop.scss"],"names":[],"mappings":"AACE;EACE;IACE,mBAAA;EAAJ;EAEE;IACE,qBAAA;EAAJ;EAEE;IACE,mBAAA;EAAJ;AACF;AAGE;EACE,2CAAA;EACA,aAAA;AADJ;AAIE;EACE,eAAA;EACA,cAAA;EACA,kBAAA;EACA,yBAAA;AAFJ;AAKE;EACE,0DAAA;EACA,gBAAA;AAHJ;AAME;EACE,WAAA;EACA,YAAA;EACA,YAAA;EACA,YAAA;EACA,eAAA;AAJJ;AAOE;EACE,aAAA;AALJ","sourcesContent":["html.desktop-view {\n  @keyframes pulse {\n    0% {\n      transform: scale(1);\n    }\n    50% {\n      transform: scale(0.9);\n    }\n    100% {\n      transform: scale(1);\n    }\n  }\n\n  #saypi-talkButton {\n    /* not needed on desktop with call button */\n    display: none;\n  }\n\n  #saypi-callButton {\n    height: 2.25rem;\n    width: 2.25rem;\n    position: relative;\n    margin: 0.5rem 0 0.5rem 0;\n  }\n\n  .saypi-prompt-container {\n    /* make room in the prompt text area for the call button */\n    padding-right: 0;\n  }\n\n  #saypi-notification > svg {\n    width: 3rem;\n    height: 3rem;\n    bottom: 4rem;\n    right: 12rem;\n    position: fixed;\n  }\n\n  #saypi-exitButton {\n    display: none;\n  }\n}\n"],"sourceRoot":""}]);
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
___CSS_LOADER_EXPORT___.push([module.id, `html.mobile-view {
  /* Pi controls: ellipsis, experiences */
  /* hide an ugly artifact */
  /* Pi controls: mute/unmute */
  /* fix an alignment issue with the "new ui layout" */
}
html.mobile-view #saypi-panel,
html.mobile-view .notification {
  width: 100%;
  position: fixed;
  left: 0;
  background-color: rgba(245, 238, 223, 0.98);
  height: 100svh;
  top: 0;
}
html.mobile-view #saypi-talkButton {
  background-color: transparent;
  border-radius: 0;
  margin: 0;
}
html.mobile-view #saypi-talkButton svg {
  width: 100vw;
  height: 100svh;
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
html.mobile-view div.bg-gradient-to-b {
  display: none;
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
html.mobile-view #saypi-prompt-ancestor {
  /* hides the row containing the text area control */
  /* important: hides virtual keyboard on android */
  display: none;
  /* the call button, usually nested in the prompt, is detached while in mobile view */
}
html.mobile-view #saypi-submitButton {
  display: none;
}
html.mobile-view #saypi-callButton {
  position: fixed;
  bottom: 4rem;
  left: 0;
  right: 0;
  margin: auto;
  width: 4.5rem;
  height: 4.5rem;
  padding: 6px;
  border: 0;
  z-index: 80;
}`, "",{"version":3,"sources":["webpack://./src/styles/mobile.scss"],"names":[],"mappings":"AAAA;EAgCE,uCAAA;EAMA,0BAAA;EAKA,6BAAA;EAiBA,oDAAA;AAvDF;AAJE;;EAEE,WAAA;EACA,eAAA;EACA,OAAA;EACA,2CAAA;EAEA,cAAA;EACA,MAAA;AAKJ;AAFE;EACE,6BAAA;EACA,gBAAA;EACA,SAAA;AAIJ;AAHI;EACE,YAAA;EACA,cAAA;AAKN;AADE;EACE,YAAA;EACA,6BAAA;AAGJ;AAFI;EACE,UAAA;EACA,YAAA;EACA,YAAA;AAIN;AACE;;EAEE,qBAAA;AACJ;AAGE;EACE,aAAA;AADJ;AAKE;EACE,2BAAA;EAIA,0BAAA;AANJ;AAGI;EACE,aAAA;AADN;AAII;EACE,8BAAA;EACA,WAAA;EACA,mCAAA;AAFN;AAGM;EACE,aAAA;AADR;AAOE;EACE,cAAA;AALJ;AAQE;EACE,aAAA;AANJ;AASE;EACE,aAAA;AAPJ;AAUE;EACE,mDAAA;EACA,iDAAA;EACA,aAAA;EACA,oFAAA;AARJ;AAWE;EACE,aAAA;AATJ;AAYE;EACE,eAAA;EACA,YAAA;EACA,OAAA;EACA,QAAA;EACA,YAAA;EACA,aAAA;EACA,cAAA;EACA,YAAA;EACA,SAAA;EACA,WAAA;AAVJ","sourcesContent":["html.mobile-view {\n  #saypi-panel,\n  .notification {\n    width: 100%;\n    position: fixed;\n    left: 0;\n    background-color: rgba(245, 238, 223, 0.98);\n\n    height: 100svh;\n    top: 0;\n  }\n\n  #saypi-talkButton {\n    background-color: transparent;\n    border-radius: 0;\n    margin: 0;\n    svg {\n      width: 100vw;\n      height: 100svh;\n    }\n  }\n\n  #saypi-notification {\n    z-index: 100;\n    background-color: transparent;\n    svg {\n      width: 75%;\n      height: 100%;\n      margin: auto;\n    }\n  }\n\n  /* Pi controls: ellipsis, experiences */\n  #__next > main > div > div > div.fixed.top-4.right-6 > button,\n  #saypi-experiences-button {\n    transform: scale(1.5);\n  }\n\n  /* hide an ugly artifact */\n  div.bg-gradient-to-b {\n    display: none;\n  }\n\n  /* Pi controls: mute/unmute */\n  #saypi-audio-controls {\n    /* hide the voice options */\n    div.p-1 {\n      display: none;\n    }\n    /* scale the mute button */\n    button.group {\n      transform: scale(2) !important;\n      z-index: 50;\n      /* hide the voice selector twisty */\n      + button {\n        display: none;\n      }\n    }\n  }\n\n  /* fix an alignment issue with the \"new ui layout\" */\n  .text-body-chat-m {\n    padding-top: 0;\n  }\n\n  #saypi-enterButton {\n    display: none;\n  }\n\n  #saypi-footer {\n    display: none;\n  }\n\n  #saypi-prompt-ancestor {\n    /* hides the row containing the text area control */\n    /* important: hides virtual keyboard on android */\n    display: none;\n    /* the call button, usually nested in the prompt, is detached while in mobile view */\n  }\n\n  #saypi-submitButton {\n    display: none;\n  }\n\n  #saypi-callButton {\n    position: fixed;\n    bottom: 4rem;\n    left: 0;\n    right: 0;\n    margin: auto;\n    width: 4.5rem;\n    height: 4.5rem;\n    padding: 6px;\n    border: 0;\n    z-index: 80;\n  }\n}\n"],"sourceRoot":""}]);
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

/***/ "./src/icons/call.svg":
/*!****************************!*\
  !*** ./src/icons/call.svg ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n    zoomAndPan=\"magnify\" viewBox=\"0 0 768 767.999994\"\n    preserveAspectRatio=\"xMidYMid meet\" version=\"1.0\">\n    <path class=\"circle\" fill=\"#418a2f\"\n        d=\"M 767.988281 383.984375 C 767.988281 596.058594 596.066406 767.980469 383.996094 767.980469 C 171.921875 767.980469 0 596.058594 0 383.984375 C 0 171.910156 171.921875 -0.0078125 383.996094 -0.0078125 C 596.066406 -0.0078125 767.988281 171.910156 767.988281 383.984375 \"\n        fill-opacity=\"1\" fill-rule=\"nonzero\" />\n    <path class=\"phone-receiver\" fill=\"#ffffff\"\n        d=\"M 215.726562 199.773438 C 219.746094 194.835938 230.023438 183.625 243.644531 183.769531 C 244.40625 183.777344 245.300781 183.808594 246.34375 183.914062 C 246.34375 183.914062 248.492188 184.144531 250.613281 184.703125 C 268.292969 189.410156 299.921875 224.304688 299.921875 224.304688 C 326.925781 254.09375 334.722656 255.53125 334.636719 266.5 C 334.550781 276.777344 328.140625 284.71875 316.253906 296.566406 C 284.566406 328.148438 277.808594 330.53125 275.351562 340.421875 C 273.902344 346.234375 269.539062 357.511719 289.105469 379.355469 C 318.289062 411.929688 388.1875 478.4375 394.300781 482.515625 C 400.402344 486.585938 422.121094 500.832031 451.300781 474.371094 C 471.226562 456.304688 480.714844 435.066406 494.875 433.785156 C 502.363281 433.089844 507.878906 437.613281 519.167969 447.222656 C 585.886719 503.976562 586.871094 513.933594 586.3125 519.824219 C 585.355469 530.011719 580.75 539.210938 565.316406 550.382812 C 525.953125 578.878906 508.3125 603.992188 428.234375 570.742188 C 348.152344 537.484375 263.996094 453.335938 240.242188 417.359375 C 216.488281 381.390625 179.160156 326.421875 181.878906 288.414062 C 183.769531 261.980469 191.867188 238.863281 191.867188 238.863281 C 199.097656 220.882812 208.71875 207.878906 215.726562 199.773438 \"\n        fill-opacity=\"1\" fill-rule=\"nonzero\" />\n</svg>");

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

/***/ "./src/icons/hangup.svg":
/*!******************************!*\
  !*** ./src/icons/hangup.svg ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n    zoomAndPan=\"magnify\" viewBox=\"0 0 768 767.999994\"\n    preserveAspectRatio=\"xMidYMid meet\" version=\"1.0\">\n    <path fill=\"#776d6d\"\n        d=\"M 768 384 C 768 596.074219 596.074219 768 384 768 C 171.925781 768 0 596.074219 0 384 C 0 171.925781 171.925781 0 384 0 C 596.074219 0 768 171.925781 768 384 \"\n        fill-opacity=\"1\" fill-rule=\"nonzero\" />\n    <path fill=\"#ffffff\"\n        d=\"M 153.695312 418.96875 C 153.71875 418.972656 167.773438 455.105469 183.636719 464.507812 C 193.925781 470.585938 202.523438 467.320312 213.625 462.085938 C 235.234375 451.890625 257.347656 442.476562 280.480469 435.953125 C 286.855469 434.152344 290.832031 427.890625 289.265625 421.722656 C 286.402344 410.6875 283.480469 399.660156 280.507812 388.644531 C 278.808594 382.511719 283.523438 375.988281 291.148438 374.363281 C 320.28125 368.128906 350.152344 364.921875 380.039062 364.769531 C 381.359375 364.769531 386.640625 364.769531 387.960938 364.769531 C 417.847656 364.921875 447.714844 368.128906 476.851562 374.363281 C 484.476562 375.988281 489.191406 382.511719 487.492188 388.644531 C 484.519531 399.660156 481.597656 410.6875 478.734375 421.722656 C 477.167969 427.890625 481.144531 434.152344 487.519531 435.953125 C 510.652344 442.476562 532.765625 451.890625 554.375 462.085938 C 565.476562 467.320312 574.074219 470.585938 584.363281 464.507812 C 600.226562 455.105469 614.28125 418.972656 614.304688 418.96875 C 627.664062 390.730469 619.042969 359.117188 582.167969 342.550781 C 519.960938 314.839844 457.320312 300.640625 388.140625 300.203125 C 386.765625 300.203125 381.238281 300.203125 379.855469 300.203125 C 310.679688 300.640625 248.039062 314.839844 185.832031 342.550781 C 148.949219 359.117188 140.335938 390.730469 153.695312 418.96875 \"\n        fill-opacity=\"1\" fill-rule=\"nonzero\" />\n</svg>");

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

/***/ "./src/DOMModule.ts":
/*!**************************!*\
  !*** ./src/DOMModule.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.appendChild = void 0;
function appendChild(parent, child, position = 0) {
    // Check if a container is provided.
    if (parent) {
        // If position is 0, simply append the button as the last child.
        if (position === 0) {
            parent.appendChild(child);
        }
        else {
            // Calculate the index of the reference node for insertBefore().
            const referenceIndex = parent.children.length + position;
            const referenceNode = parent.children[referenceIndex];
            // If a reference node exists, insert the button before it.
            if (referenceNode) {
                parent.insertBefore(child, referenceNode);
            }
            else {
                // If not, append the button as the last child.
                parent.appendChild(child);
            }
        }
    }
    else {
        // If no container is provided, append the button to the body.
        document.body.appendChild(child);
    }
}
exports.appendChild = appendChild;


/***/ }),

/***/ "./src/SubmitErrorHandler.ts":
/*!***********************************!*\
  !*** ./src/SubmitErrorHandler.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.submitErrorHandler = void 0;
const TranscriptionModule_1 = __webpack_require__(/*! ./TranscriptionModule */ "./src/TranscriptionModule.ts");
class SubmitErrorHandler {
    constructor() {
        this.audioOutputStatus = false;
        // Initialise properties if needed
        this.restorePointKey = "restorePoint";
    }
    initAudioOutputListener() {
        const audioOutputButton = document.getElementById("saypi-audio-output-button");
        if (audioOutputButton) {
            audioOutputButton.addEventListener("click", this.handleAudioOutputClick.bind(this));
        }
    }
    // Event handler
    handleAudioOutputClick() {
        this.audioOutputStatus = !this.audioOutputStatus; // Toggle the state
    }
    // 1. Detect when a submit error occurs
    detectSubmitError() {
        const submitButton = document.getElementById("saypi-submitButton");
        const textarea = document.getElementById("saypi-prompt");
        if (submitButton && textarea) {
            if (submitButton.disabled && textarea.value.length > 0) {
                return true;
            }
        }
        return false;
    }
    // 2. Create a "restore point" capturing application state
    createRestorePoint({ prompt: message, audioInputEnabled: audioInputStatus, audioOutputEnabled: audioOutputStatus, }) {
        const restorePoint = {
            prompt: message,
            audioInputEnabled: audioInputStatus,
            audioOutputEnabled: audioOutputStatus,
            creationTime: new Date().toISOString(),
        };
        localStorage.setItem(this.restorePointKey, JSON.stringify(restorePoint));
    }
    // 3. Programmatically reload the page
    reloadPage() {
        window.location.reload();
    }
    handleSubmitError() {
        const textarea = document.getElementById("saypi-prompt");
        const prompt = textarea ? textarea.value : "";
        let audioInputStatus = true;
        const callButton = document.getElementById("saypi-callButton");
        if (callButton) {
            audioInputStatus = callButton.classList.contains("active");
        }
        console.log("Creating restore point");
        this.createRestorePoint({
            prompt: prompt,
            audioInputEnabled: audioInputStatus,
            audioOutputEnabled: this.audioOutputStatus,
        });
        console.log("Reloading page");
        this.reloadPage();
    }
    // 4. On load, check for a restore point
    checkForRestorePoint() {
        const storedData = localStorage.getItem(this.restorePointKey);
        if (storedData) {
            const restorePoint = JSON.parse(storedData);
            const currentTime = new Date();
            const restoreTime = new Date(restorePoint.creationTime);
            const timeDifference = (currentTime.getTime() - restoreTime.getTime()) / (1000 * 60); // in minutes
            if (timeDifference <= 5) {
                console.log("Restoring application state", restorePoint);
                (0, TranscriptionModule_1.setPromptText)(restorePoint.prompt);
                this.activateAudioInput(restorePoint.audioInputEnabled);
                this.activateAudioOutput(restorePoint.audioOutputEnabled);
                // Delete the executed restore point
                localStorage.removeItem(this.restorePointKey);
            }
        }
    }
    activateAudioInput(enable) {
        if (enable) {
            const callButton = document.getElementById("saypi-callButton");
            if (callButton) {
                callButton.click();
            }
        }
    }
    activateAudioOutput(enable) {
        if (enable) {
            const audioOutputButton = document.getElementById("saypi-audio-output-button");
            if (audioOutputButton) {
                audioOutputButton.click();
            }
        }
    }
}
exports["default"] = SubmitErrorHandler;
// Singleton
exports.submitErrorHandler = new SubmitErrorHandler();


/***/ }),

/***/ "./src/TranscriptionModule.ts":
/*!************************************!*\
  !*** ./src/TranscriptionModule.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mergeTranscripts = exports.setPromptText = exports.uploadAudioWithRetry = exports.clearPendingTranscriptions = exports.isTranscriptionPending = void 0;
const ConfigModule_js_1 = __webpack_require__(/*! ./ConfigModule.js */ "./src/ConfigModule.js");
const StateMachineService_js_1 = __importDefault(__webpack_require__(/*! ./StateMachineService.js */ "./src/StateMachineService.js"));
const UserAgentModule_js_1 = __webpack_require__(/*! ./UserAgentModule.js */ "./src/UserAgentModule.js");
const EventBus_js_1 = __importDefault(__webpack_require__(/*! ./EventBus.js */ "./src/EventBus.js"));
const EventModule_js_1 = __importDefault(__webpack_require__(/*! ./EventModule.js */ "./src/EventModule.js"));
const LoggingModule_js_1 = __webpack_require__(/*! ./LoggingModule.js */ "./src/LoggingModule.js");
const knownNetworkErrorMessages = [
    "Failed to fetch",
    "Load failed",
    "NetworkError when attempting to fetch resource.", // Firefox
    // Add more known error messages here
];
// timeout for transcription requests
const TIMEOUT_MS = 30000; // 30 seconds
// track sequence numbers for in-flight transcription requests
let sequenceNum = 0;
const sequenceNumsPendingTranscription = new Set();
function checkForExpiredEntries() {
    const now = Date.now();
    sequenceNumsPendingTranscription.forEach((entry) => {
        if (now - entry.timestamp > TIMEOUT_MS) {
            sequenceNumsPendingTranscription.delete(entry);
            LoggingModule_js_1.logger.info(`Transcription request ${entry.seq} timed out`);
        }
    });
}
function transcriptionSent() {
    sequenceNum++;
    sequenceNumsPendingTranscription.add({
        seq: sequenceNum,
        timestamp: Date.now(),
    });
}
function transcriptionReceived(seq) {
    // delete entry with matching sequence number
    sequenceNumsPendingTranscription.forEach((entry) => {
        if (entry.seq === seq) {
            sequenceNumsPendingTranscription.delete(entry);
            LoggingModule_js_1.logger.debug(`Transcription response ${seq} received after ${(Date.now() - entry.timestamp) / 1000}s`);
            return;
        }
    });
}
function isTranscriptionPending() {
    checkForExpiredEntries();
    return sequenceNumsPendingTranscription.size > 0;
}
exports.isTranscriptionPending = isTranscriptionPending;
// call after completed user input is submitted
function clearPendingTranscriptions() {
    sequenceNumsPendingTranscription.clear();
}
exports.clearPendingTranscriptions = clearPendingTranscriptions;
function uploadAudioWithRetry(audioBlob, audioDurationMillis, precedingTranscripts = {}, maxRetries = 3) {
    return __awaiter(this, void 0, void 0, function* () {
        let retryCount = 0;
        let delay = 1000; // initial delay of 1 second
        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        while (retryCount < maxRetries) {
            try {
                transcriptionSent();
                yield uploadAudio(audioBlob, audioDurationMillis, precedingTranscripts);
                return;
            }
            catch (error) {
                // check for timeout errors (30s on Heroku)
                if (error instanceof TypeError &&
                    knownNetworkErrorMessages.includes(error.message)) {
                    LoggingModule_js_1.logger.info(`Attempt ${retryCount + 1}/${maxRetries} failed. Retrying in ${delay / 1000} seconds...`);
                    yield sleep(delay);
                    // Exponential backoff
                    delay *= 2;
                    retryCount++;
                }
                else {
                    console.error("Unexpected error: ", error);
                    StateMachineService_js_1.default.actor.send("saypi:transcribeFailed", {
                        detail: error,
                    });
                    return;
                }
            }
        }
        console.error("Max retries reached. Giving up.");
        StateMachineService_js_1.default.actor.send("saypi:transcribeFailed", {
            detail: new Error("Max retries reached"),
        });
    });
}
exports.uploadAudioWithRetry = uploadAudioWithRetry;
function uploadAudio(audioBlob, audioDurationMillis, precedingTranscripts = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const messages = Object.entries(precedingTranscripts).map(([seq, content]) => {
                return {
                    role: "user",
                    content: content,
                    sequenceNumber: Number(seq), // Convert the string to a number
                };
            });
            const formData = constructTranscriptionFormData(audioBlob, audioDurationMillis / 1000, messages);
            const language = navigator.language;
            const controller = new AbortController();
            const { signal } = controller;
            setTimeout(() => controller.abort(), TIMEOUT_MS);
            const startTime = new Date().getTime();
            const response = yield fetch(`${ConfigModule_js_1.config.apiServerUrl}/transcribe?language=${language}`, {
                method: "POST",
                body: formData,
                signal,
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const responseJson = yield response.json();
            const seq = responseJson.sequenceNumber;
            if (seq !== undefined) {
                transcriptionReceived(seq);
            }
            const endTime = new Date().getTime();
            const transcriptionDurationMillis = endTime - startTime;
            const transcript = responseJson.text;
            const wc = transcript.split(" ").length;
            const payload = {
                text: transcript,
                sequenceNumber: seq,
            };
            if (responseJson.hasOwnProperty("pFinishedSpeaking")) {
                payload.pFinishedSpeaking = responseJson.pFinishedSpeaking;
            }
            if (responseJson.hasOwnProperty("tempo")) {
                payload.tempo = responseJson.tempo;
            }
            LoggingModule_js_1.logger.info(`Transcribed ${Math.round(audioDurationMillis / 1000)}s of audio into ${wc} words in ${Math.round(transcriptionDurationMillis / 1000)}s`);
            if (responseJson.text.length === 0) {
                StateMachineService_js_1.default.actor.send("saypi:transcribedEmpty");
            }
            else {
                StateMachineService_js_1.default.actor.send("saypi:transcribed", payload);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.name === "AbortError") {
                    console.error("Fetch aborted due to timeout", error);
                }
                else {
                    console.error("An unexpected error occurred:", error);
                }
            }
            else {
                console.error("Something thrown that is not an Error object:", error);
            }
            // re-throw the error if your logic requires it
            throw error;
        }
    });
}
function constructTranscriptionFormData(audioBlob, audioDurationSeconds, messages) {
    const formData = new FormData();
    let audioFilename = "audio.webm";
    if (audioBlob.type === "audio/mp4") {
        audioFilename = "audio.mp4";
    }
    else if (audioBlob.type === "audio/wav") {
        audioFilename = "audio.wav";
    }
    LoggingModule_js_1.logger.info(`Transcribing audio Blob with MIME type: ${audioBlob.type}, size: ${(audioBlob.size / 1024).toFixed(2)}kb`);
    // Add the audio blob to the FormData object
    formData.append("audio", audioBlob, audioFilename);
    formData.append("duration", audioDurationSeconds.toString());
    formData.append("sequenceNumber", sequenceNum.toString());
    formData.append("messages", JSON.stringify(messages));
    return formData;
}
function setPromptText(transcript) {
    LoggingModule_js_1.logger.info(`Merged transcript: ${transcript}`);
    const textarea = document.getElementById("saypi-prompt");
    if ((0, UserAgentModule_js_1.isMobileView)()) {
        // if transcript is > 1000 characters, truncate it to 999 characters plus an ellipsis
        if (transcript.length > 1000) {
            transcript = `${transcript.substring(0, 999)}…`;
            console.warn(`Transcript was too long for Pi. Truncated to 999 characters, losing the following text: ... ${transcript.substring(999)}`);
        }
        EventModule_js_1.default.setNativeValue(textarea, transcript);
        EventBus_js_1.default.emit("saypi:autoSubmit");
    }
    else {
        EventModule_js_1.default.simulateTyping(textarea, `${transcript} `);
    }
}
exports.setPromptText = setPromptText;
function mergeTranscripts(transcripts) {
    const sortedKeys = Object.keys(transcripts)
        .map(Number)
        .sort((a, b) => a - b);
    const sortedTranscripts = [];
    for (const key of sortedKeys) {
        sortedTranscripts.push(transcripts[key].trim());
    }
    return sortedTranscripts.join(" ");
}
exports.mergeTranscripts = mergeTranscripts;


/***/ }),

/***/ "./src/state-machines/SayPiMachine.ts":
/*!********************************************!*\
  !*** ./src/state-machines/SayPiMachine.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.machine = exports.calculateDelay = void 0;
const ButtonModule_js_1 = __webpack_require__(/*! ../ButtonModule.js */ "./src/ButtonModule.js");
const xstate_1 = __webpack_require__(/*! xstate */ "./node_modules/xstate/es/index.js");
const AnimationModule_js_1 = __importDefault(__webpack_require__(/*! ../AnimationModule.js */ "./src/AnimationModule.js"));
const UserAgentModule_js_1 = __webpack_require__(/*! ../UserAgentModule.js */ "./src/UserAgentModule.js");
const TranscriptionModule_1 = __webpack_require__(/*! ../TranscriptionModule */ "./src/TranscriptionModule.ts");
const EventBus_1 = __importDefault(__webpack_require__(/*! ../EventBus */ "./src/EventBus.js"));
/* helper functions */
function calculateDelay(timeUserStoppedSpeaking, probabilityFinished, tempo, maxDelay) {
    // Get the current time (in milliseconds)
    const currentTime = new Date().getTime();
    // Calculate the time elapsed since the user stopped speaking (in milliseconds)
    const timeElapsed = currentTime - timeUserStoppedSpeaking;
    // We invert the tempo because a faster speech (tempo approaching 1) should reduce the delay
    let tempoFactor = 1 - tempo;
    // Calculate the combined probability factor
    let combinedProbability = probabilityFinished * tempoFactor;
    // The combined factor influences the initial delay
    const initialDelay = combinedProbability * maxDelay;
    // Calculate the final delay after accounting for the time already elapsed
    const finalDelay = Math.max(initialDelay - timeElapsed, 0);
    return finalDelay;
}
exports.calculateDelay = calculateDelay;
/* external actions */
const clearTranscripts = (0, xstate_1.assign)({
    transcriptions: () => ({}),
});
exports.machine = (0, xstate_1.createMachine)({
    context: {
        transcriptions: {},
        lastState: "inactive",
        timeUserStoppedSpeaking: 0,
    },
    id: "sayPi",
    initial: "inactive",
    states: {
        inactive: {
            description: "Idle state, not listening or speaking. Privacy mode.",
            exit: (0, xstate_1.assign)({ lastState: "inactive" }),
            on: {
                "saypi:call": {
                    target: "#sayPi.listening.recording",
                    actions: [
                        {
                            type: "callStarted",
                        },
                        {
                            type: "startRecording",
                        },
                    ],
                    description: 'Enable the VAD microphone.\nAka "call" Pi.\nStarts active listening.',
                },
                "saypi:piSpeaking": {
                    target: "#sayPi.responding.piSpeaking",
                },
            },
        },
        errors: {
            description: "Error parent state.",
            after: {
                "10000": [
                    {
                        target: "#sayPi.listening",
                        actions: [],
                        description: "Reset to the idle state and clear errors.",
                    },
                    {
                        internal: false,
                    },
                ],
            },
            initial: "transcribeFailed",
            states: {
                transcribeFailed: {
                    description: "The /transcribe API responded with an error.",
                    entry: {
                        type: "startAnimation",
                        params: {
                            animation: "error",
                        },
                    },
                    exit: {
                        type: "stopAnimation",
                        params: {
                            animation: "error",
                        },
                    },
                    type: "final",
                },
                micError: {
                    description: "No audio input detected",
                    entry: {
                        type: "showNotification",
                        params: {
                            icon: "muted-microphone",
                        },
                    },
                    exit: {
                        type: "dismissNotification",
                    },
                    type: "final",
                },
            },
        },
        listening: {
            description: "Actively listening for user input. Simultaneously recording and transcribing user speech. Gentle pulsing animation.",
            entry: [
                {
                    type: "stopAllAnimations",
                },
                {
                    type: "acquireMicrophone",
                },
            ],
            exit: (0, xstate_1.assign)({ lastState: "listening" }),
            states: {
                recording: {
                    description: "Microphone is on and VAD is actively listening for user speech.",
                    initial: "notSpeaking",
                    states: {
                        notSpeaking: {
                            description: "Microphone is recording but no speech is detected.",
                            on: {
                                "saypi:userFinishedSpeaking": {
                                    target: "#sayPi.inactive",
                                },
                                "saypi:userSpeaking": {
                                    target: "userSpeaking",
                                },
                            },
                        },
                        userSpeaking: {
                            description: "User is speaking and being recorded by the microphone.\nWaveform animation.",
                            entry: {
                                type: "startAnimation",
                                params: {
                                    animation: "userSpeaking",
                                },
                            },
                            exit: {
                                type: "stopAnimation",
                                params: {
                                    animation: "userSpeaking",
                                },
                            },
                            on: {
                                "saypi:userStoppedSpeaking": [
                                    {
                                        target: [
                                            "notSpeaking",
                                            "#sayPi.listening.converting.transcribing",
                                        ],
                                        cond: "hasAudio",
                                        actions: [
                                            (0, xstate_1.assign)({
                                                timeUserStoppedSpeaking: () => new Date().getTime(),
                                            }),
                                            {
                                                type: "transcribeAudio",
                                            },
                                        ],
                                    },
                                    {
                                        target: "notSpeaking",
                                        cond: "hasNoAudio",
                                    },
                                ],
                            },
                        },
                    },
                    on: {
                        "saypi:hangup": {
                            target: "#sayPi.inactive",
                            actions: [
                                {
                                    type: "stopRecording",
                                },
                                {
                                    type: "releaseMicrophone",
                                },
                                {
                                    type: "callEnded",
                                },
                            ],
                            description: 'Disable the VAD microphone.\n    Aka "call" Pi.\n    Stops active listening.',
                        },
                    },
                },
                converting: {
                    initial: "accumulating",
                    states: {
                        accumulating: {
                            description: "Accumulating and assembling audio transcriptions into a cohesive prompt.\nSubmits a prompt when a threshold is reached.",
                            after: {
                                submissionDelay: {
                                    target: "submitting",
                                    cond: "submissionConditionsMet",
                                    description: "Submit combined transcript to Pi.",
                                },
                            },
                            on: {
                                "saypi:transcribed": {
                                    target: "accumulating",
                                    actions: {
                                        type: "handleTranscriptionResponse",
                                    },
                                    description: "Transcribed speech to text (out of sequence response).",
                                },
                                "saypi:transcribeFailed": {
                                    target: "#sayPi.errors.transcribeFailed",
                                    description: "Out of sequence error response from the /transcribe API",
                                },
                                "saypi:transcribedEmpty": {
                                    target: "#sayPi.errors.micError",
                                    description: "Out of sequence empty response from the /transcribe API",
                                },
                            },
                        },
                        submitting: {
                            description: "Submitting prompt to Pi.",
                            entry: {
                                type: "mergeAndSubmitTranscript",
                            },
                            exit: [clearTranscripts, TranscriptionModule_1.clearPendingTranscriptions],
                            always: {
                                target: "accumulating",
                            },
                        },
                        transcribing: {
                            description: "Transcribing audio to text.\nCard flip animation.",
                            entry: {
                                type: "startAnimation",
                                params: {
                                    animation: "transcribing",
                                },
                            },
                            exit: {
                                type: "stopAnimation",
                                params: {
                                    animation: "transcribing",
                                },
                            },
                            on: {
                                "saypi:transcribed": {
                                    target: "accumulating",
                                    actions: {
                                        type: "handleTranscriptionResponse",
                                    },
                                    description: "Successfully transcribed user audio to text.",
                                },
                                "saypi:transcribeFailed": {
                                    target: "#sayPi.errors.transcribeFailed",
                                    description: "Received an error response from the /transcribe API",
                                },
                                "saypi:transcribedEmpty": {
                                    target: "#sayPi.errors.micError",
                                    description: "Received an empty response from the /transcribe API (no speech detected)",
                                },
                            },
                        },
                    },
                },
            },
            on: {
                "saypi:piSpeaking": {
                    target: "#sayPi.responding.piSpeaking",
                },
            },
            type: "parallel",
        },
        responding: {
            description: "Pi is responding. Synthesised speech is playing or waiting to play.",
            entry: {
                type: "disableCallButton",
            },
            exit: {
                type: "enableCallButton",
            },
            initial: "piSpeaking",
            states: {
                piSpeaking: {
                    description: "Pi's synthesised speech audio is playing.\nPlayful animation.",
                    entry: {
                        type: "startAnimation",
                        params: {
                            animation: "piSpeaking",
                        },
                    },
                    exit: {
                        type: "stopAnimation",
                        params: {
                            animation: "piSpeaking",
                        },
                    },
                    on: {
                        "saypi:piStoppedSpeaking": [
                            {
                                target: "#sayPi.listening",
                                cond: "wasListening",
                            },
                            {
                                target: "#sayPi.inactive",
                                cond: "wasInactive",
                            },
                        ],
                        "saypi:userSpeaking": {
                            target: "#sayPi.listening.recording.userSpeaking",
                        },
                        "saypi:piFinishedSpeaking": {
                            target: "#sayPi.listening",
                        },
                    },
                },
            },
        },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
}, {
    actions: {
        stopAllAnimations: (context, event) => {
            AnimationModule_js_1.default.stopAllAnimations();
        },
        startAnimation: (context, event, { action }) => {
            AnimationModule_js_1.default.startAnimation(action.params.animation);
        },
        stopAnimation: (context, event, { action }) => {
            AnimationModule_js_1.default.stopAnimation(action.params.animation);
        },
        transcribeAudio: (context, event) => {
            const audioBlob = event.blob;
            if (audioBlob) {
                (0, TranscriptionModule_1.uploadAudioWithRetry)(audioBlob, event.duration, context.transcriptions);
            }
        },
        handleTranscriptionResponse: (SayPiContext, event) => {
            console.log("handleTranscriptionResponse", event);
            const transcription = event.text;
            const sequenceNumber = event.sequenceNumber;
            SayPiContext.transcriptions[sequenceNumber] = transcription;
        },
        acquireMicrophone: (context, event) => {
            // warmup the microphone on idle in mobile view,
            // since there's no mouseover event to trigger it
            if ((0, UserAgentModule_js_1.isMobileView)()) {
                EventBus_1.default.emit("audio:setupRecording");
            }
        },
        startRecording: (context, event) => {
            EventBus_1.default.emit("audio:startRecording");
        },
        stopRecording: (context, event) => {
            EventBus_1.default.emit("audio:stopRecording");
        },
        showNotification: (context, event, { action }) => {
            const icon = action.params.icon;
            const message = action.params.message;
            ButtonModule_js_1.buttonModule.showNotification({ icon, message });
        },
        dismissNotification: () => {
            ButtonModule_js_1.buttonModule.dismissNotification();
        },
        mergeAndSubmitTranscript: (context) => {
            const prompt = (0, TranscriptionModule_1.mergeTranscripts)(context.transcriptions).trim();
            if (prompt)
                (0, TranscriptionModule_1.setPromptText)(prompt);
        },
        callStarted: () => {
            ButtonModule_js_1.buttonModule.callActive();
        },
        callEnded: () => {
            ButtonModule_js_1.buttonModule.callInactive();
        },
        disableCallButton: () => {
            ButtonModule_js_1.buttonModule.disableCallButton();
        },
        enableCallButton: () => {
            ButtonModule_js_1.buttonModule.enableCallButton();
        },
    },
    services: {},
    guards: {
        hasAudio: (context, event) => {
            if (event.type === "saypi:userStoppedSpeaking") {
                event = event;
                return event.blob !== undefined && event.duration > 0;
            }
            return false;
        },
        hasNoAudio: (context, event) => {
            if (event.type === "saypi:userStoppedSpeaking") {
                event = event;
                return (event.blob === undefined ||
                    event.blob.size === 0 ||
                    event.duration === 0);
            }
            return false;
        },
        submissionConditionsMet: (context, event, meta) => {
            const { state } = meta;
            const allowedState = !(state.matches("listening.recording.userSpeaking") ||
                state.matches("listening.converting.transcribing"));
            const empty = Object.keys(context.transcriptions).length === 0;
            const pending = (0, TranscriptionModule_1.isTranscriptionPending)();
            const ready = allowedState && !empty && !pending;
            return ready;
        },
        wasListening: (context) => {
            return context.lastState === "listening";
        },
        wasInactive: (context) => {
            return context.lastState === "inactive";
        },
    },
    delays: {
        submissionDelay: (context, event) => {
            // check if the event is a transcription event
            if (event.type !== "saypi:transcribed") {
                return 0;
            }
            else {
                event = event;
            }
            const maxDelay = 10000; // 10 seconds in milliseconds
            // Calculate the initial delay based on pFinishedSpeaking
            let probabilityFinished = 1;
            if (event.pFinishedSpeaking !== undefined) {
                probabilityFinished = event.pFinishedSpeaking;
            }
            // Incorporate the tempo into the delay, defaulting to 0.5 (average tempo) if undefined
            let tempo = event.tempo !== undefined ? event.tempo : 0.5;
            const finalDelay = calculateDelay(context.timeUserStoppedSpeaking, probabilityFinished, tempo, maxDelay);
            console.log("Waiting for", (finalDelay / 1000).toFixed(1), "seconds before submitting");
            return finalDelay;
        },
    },
});


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

/***/ "./node_modules/xstate/es/index.js":
/*!*****************************************!*\
  !*** ./node_modules/xstate/es/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ActionTypes: () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_10__.ActionTypes),
/* harmony export */   Interpreter: () => (/* reexport safe */ _interpreter_js__WEBPACK_IMPORTED_MODULE_2__.Interpreter),
/* harmony export */   InterpreterStatus: () => (/* reexport safe */ _interpreter_js__WEBPACK_IMPORTED_MODULE_2__.InterpreterStatus),
/* harmony export */   Machine: () => (/* reexport safe */ _Machine_js__WEBPACK_IMPORTED_MODULE_3__.Machine),
/* harmony export */   SpecialTargets: () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_10__.SpecialTargets),
/* harmony export */   State: () => (/* reexport safe */ _State_js__WEBPACK_IMPORTED_MODULE_7__.State),
/* harmony export */   StateNode: () => (/* reexport safe */ _StateNode_js__WEBPACK_IMPORTED_MODULE_8__.StateNode),
/* harmony export */   actions: () => (/* reexport module object */ _actions_js__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   assign: () => (/* binding */ assign),
/* harmony export */   cancel: () => (/* binding */ cancel),
/* harmony export */   choose: () => (/* binding */ choose),
/* harmony export */   createMachine: () => (/* reexport safe */ _Machine_js__WEBPACK_IMPORTED_MODULE_3__.createMachine),
/* harmony export */   createSchema: () => (/* reexport safe */ _schema_js__WEBPACK_IMPORTED_MODULE_6__.createSchema),
/* harmony export */   doneInvoke: () => (/* binding */ doneInvoke),
/* harmony export */   forwardTo: () => (/* binding */ forwardTo),
/* harmony export */   interpret: () => (/* reexport safe */ _interpreter_js__WEBPACK_IMPORTED_MODULE_2__.interpret),
/* harmony export */   log: () => (/* binding */ log),
/* harmony export */   mapState: () => (/* reexport safe */ _mapState_js__WEBPACK_IMPORTED_MODULE_4__.mapState),
/* harmony export */   matchState: () => (/* reexport safe */ _match_js__WEBPACK_IMPORTED_MODULE_5__.matchState),
/* harmony export */   matchesState: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_11__.matchesState),
/* harmony export */   pure: () => (/* binding */ pure),
/* harmony export */   raise: () => (/* binding */ raise),
/* harmony export */   send: () => (/* binding */ send),
/* harmony export */   sendParent: () => (/* binding */ sendParent),
/* harmony export */   sendTo: () => (/* binding */ sendTo),
/* harmony export */   sendUpdate: () => (/* binding */ sendUpdate),
/* harmony export */   spawn: () => (/* reexport safe */ _interpreter_js__WEBPACK_IMPORTED_MODULE_2__.spawn),
/* harmony export */   spawnBehavior: () => (/* reexport safe */ _behaviors_js__WEBPACK_IMPORTED_MODULE_9__.spawnBehavior),
/* harmony export */   stop: () => (/* binding */ stop),
/* harmony export */   t: () => (/* reexport safe */ _schema_js__WEBPACK_IMPORTED_MODULE_6__.t),
/* harmony export */   toActorRef: () => (/* reexport safe */ _Actor_js__WEBPACK_IMPORTED_MODULE_1__.toActorRef),
/* harmony export */   toEventObject: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_11__.toEventObject),
/* harmony export */   toObserver: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_11__.toObserver),
/* harmony export */   toSCXMLEvent: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_11__.toSCXMLEvent)
/* harmony export */ });
/* harmony import */ var _actions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./actions.js */ "./node_modules/xstate/es/actions.js");
/* harmony import */ var _Actor_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Actor.js */ "./node_modules/xstate/es/Actor.js");
/* harmony import */ var _interpreter_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./interpreter.js */ "./node_modules/xstate/es/interpreter.js");
/* harmony import */ var _Machine_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Machine.js */ "./node_modules/xstate/es/Machine.js");
/* harmony import */ var _mapState_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mapState.js */ "./node_modules/xstate/es/mapState.js");
/* harmony import */ var _match_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./match.js */ "./node_modules/xstate/es/match.js");
/* harmony import */ var _schema_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./schema.js */ "./node_modules/xstate/es/schema.js");
/* harmony import */ var _State_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./State.js */ "./node_modules/xstate/es/State.js");
/* harmony import */ var _StateNode_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./StateNode.js */ "./node_modules/xstate/es/StateNode.js");
/* harmony import */ var _behaviors_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./behaviors.js */ "./node_modules/xstate/es/behaviors.js");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./types.js */ "./node_modules/xstate/es/types.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./utils.js */ "./node_modules/xstate/es/utils.js");















var assign = _actions_js__WEBPACK_IMPORTED_MODULE_0__.assign,
    cancel = _actions_js__WEBPACK_IMPORTED_MODULE_0__.cancel,
    send = _actions_js__WEBPACK_IMPORTED_MODULE_0__.send,
    sendTo = _actions_js__WEBPACK_IMPORTED_MODULE_0__.sendTo,
    sendParent = _actions_js__WEBPACK_IMPORTED_MODULE_0__.sendParent,
    sendUpdate = _actions_js__WEBPACK_IMPORTED_MODULE_0__.sendUpdate,
    forwardTo = _actions_js__WEBPACK_IMPORTED_MODULE_0__.forwardTo,
    doneInvoke = _actions_js__WEBPACK_IMPORTED_MODULE_0__.doneInvoke,
    raise = _actions_js__WEBPACK_IMPORTED_MODULE_0__.raise,
    log = _actions_js__WEBPACK_IMPORTED_MODULE_0__.log,
    pure = _actions_js__WEBPACK_IMPORTED_MODULE_0__.pure,
    choose = _actions_js__WEBPACK_IMPORTED_MODULE_0__.choose,
    stop = _actions_js__WEBPACK_IMPORTED_MODULE_0__.stop;




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

/***/ "./node_modules/xstate/es/mapState.js":
/*!********************************************!*\
  !*** ./node_modules/xstate/es/mapState.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mapState: () => (/* binding */ mapState)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "./node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./node_modules/xstate/es/utils.js");



function mapState(stateMap, stateId) {
  var e_1, _a;

  var foundStateId;

  try {
    for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(Object.keys(stateMap)), _c = _b.next(); !_c.done; _c = _b.next()) {
      var mappedStateId = _c.value;

      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.matchesState)(mappedStateId, stateId) && (!foundStateId || stateId.length > foundStateId.length)) {
        foundStateId = mappedStateId;
      }
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

  return stateMap[foundStateId];
}




/***/ }),

/***/ "./node_modules/xstate/es/match.js":
/*!*****************************************!*\
  !*** ./node_modules/xstate/es/match.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   matchState: () => (/* binding */ matchState)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "./node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _State_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./State.js */ "./node_modules/xstate/es/State.js");



function matchState(state, patterns, defaultValue) {
  var e_1, _a;

  var resolvedState = _State_js__WEBPACK_IMPORTED_MODULE_0__.State.from(state, state instanceof _State_js__WEBPACK_IMPORTED_MODULE_0__.State ? state.context : undefined);

  try {
    for (var patterns_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__values)(patterns), patterns_1_1 = patterns_1.next(); !patterns_1_1.done; patterns_1_1 = patterns_1.next()) {
      var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__read)(patterns_1_1.value, 2),
          stateValue = _b[0],
          getValue = _b[1];

      if (resolvedState.matches(stateValue)) {
        return getValue(resolvedState);
      }
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (patterns_1_1 && !patterns_1_1.done && (_a = patterns_1.return)) _a.call(patterns_1);
    } finally {
      if (e_1) throw e_1.error;
    }
  }

  return defaultValue(resolvedState);
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

/***/ "./node_modules/xstate/es/schema.js":
/*!******************************************!*\
  !*** ./node_modules/xstate/es/schema.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createSchema: () => (/* binding */ createSchema),
/* harmony export */   t: () => (/* binding */ t)
/* harmony export */ });
function createSchema(schema) {
  return schema;
}
var t = createSchema;




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




/***/ }),

/***/ "./src/AnimationModule.js":
/*!********************************!*\
  !*** ./src/AnimationModule.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

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
_defineProperty(AnimationModule, "talkButtonAnimations", ["piSpeaking", "userSpeaking", "transcribing"]);


/***/ }),

/***/ "./src/ButtonModule.js":
/*!*****************************!*\
  !*** ./src/ButtonModule.js ***!
  \*****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buttonModule: () => (/* binding */ buttonModule),
/* harmony export */   "default": () => (/* binding */ ButtonModule)
/* harmony export */ });
/* harmony import */ var _UserAgentModule_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UserAgentModule.js */ "./src/UserAgentModule.js");
/* harmony import */ var _DOMModule_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DOMModule.ts */ "./src/DOMModule.ts");
/* harmony import */ var _EventBus_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./EventBus.js */ "./src/EventBus.js");
/* harmony import */ var _StateMachineService_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./StateMachineService.js */ "./src/StateMachineService.js");
/* harmony import */ var _SubmitErrorHandler_ts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SubmitErrorHandler.ts */ "./src/SubmitErrorHandler.ts");
/* harmony import */ var _icons_exit_svg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./icons/exit.svg */ "./src/icons/exit.svg");
/* harmony import */ var _icons_maximize_svg__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./icons/maximize.svg */ "./src/icons/maximize.svg");
/* harmony import */ var _icons_rectangles_svg__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./icons/rectangles.svg */ "./src/icons/rectangles.svg");
/* harmony import */ var _icons_waveform_svg__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./icons/waveform.svg */ "./src/icons/waveform.svg");
/* harmony import */ var _icons_muted_microphone_svg__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./icons/muted_microphone.svg */ "./src/icons/muted_microphone.svg");
/* harmony import */ var _icons_call_svg__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./icons/call.svg */ "./src/icons/call.svg");
/* harmony import */ var _icons_hangup_svg__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./icons/hangup.svg */ "./src/icons/hangup.svg");
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
    this.actor = _StateMachineService_js__WEBPACK_IMPORTED_MODULE_3__["default"].actor;
    // Binding methods to the current instance
    this.registerOtherEvents();

    // track the frequency of bug #26
    this.submissionsWithoutAnError = 0;
  }
  _createClass(ButtonModule, [{
    key: "registerOtherEvents",
    value: function registerOtherEvents() {
      var _this = this;
      _EventBus_js__WEBPACK_IMPORTED_MODULE_2__["default"].on("saypi:autoSubmit", function () {
        _this.handleAutoSubmit();
      });
    }

    // Function to create a new button
  }, {
    key: "createButton",
    value: function createButton(label, callback) {
      var button = document.createElement("button");
      if (label) {
        button.textContent = label;
      }
      if (callback) {
        button.onclick = callback;
      }
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
      if ((0,_UserAgentModule_js__WEBPACK_IMPORTED_MODULE_0__.isMobileView)()) {
        iconContainer.innerHTML = _icons_rectangles_svg__WEBPACK_IMPORTED_MODULE_7__["default"];
      } else {
        iconContainer.innerHTML = _icons_waveform_svg__WEBPACK_IMPORTED_MODULE_8__["default"];
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
    key: "simulateFormSubmit",
    value: function simulateFormSubmit() {
      var submitButton = document.getElementById("saypi-submitButton");
      if (submitButton) {
        if (_SubmitErrorHandler_ts__WEBPACK_IMPORTED_MODULE_4__.submitErrorHandler.detectSubmitError()) {
          // track how often this happens
          console.error("Autosubmit failed after ".concat(this.submissionsWithoutAnError, " turns."));
          this.submissionsWithoutAnError = 0;
          _SubmitErrorHandler_ts__WEBPACK_IMPORTED_MODULE_4__.submitErrorHandler.handleSubmitError();
        } else {
          this.submissionsWithoutAnError++;
          submitButton.click();
        }
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
        console.log("Autosubmit is off");
      } else {
        this.simulateFormSubmit();
      }
    }
  }, {
    key: "createExitButton",
    value: function createExitButton() {
      var label = "Exit Voice-Controlled Mobile Mode";
      var button = this.createButton("", function () {
        (0,_UserAgentModule_js__WEBPACK_IMPORTED_MODULE_0__.exitMobileMode)();
      });
      button.id = "saypi-exitButton";
      button.type = "button";
      button.className = "exit-button fixed rounded-full bg-cream-550 enabled:hover:bg-cream-650";
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
      button.innerHTML = _icons_exit_svg__WEBPACK_IMPORTED_MODULE_5__["default"];
      document.body.appendChild(button);
      return button;
    }
  }, {
    key: "createEnterButton",
    value: function createEnterButton() {
      var label = "Enter Voice-Controlled Mobile Mode";
      var button = this.createButton("", function () {
        (0,_UserAgentModule_js__WEBPACK_IMPORTED_MODULE_0__.enterMobileMode)();
      });
      button.id = "saypi-enterButton";
      button.type = "button";
      button.className = "enter-button fixed rounded-full bg-cream-550 enabled:hover:bg-cream-650";
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
      button.innerHTML = _icons_maximize_svg__WEBPACK_IMPORTED_MODULE_6__["default"];
      document.body.appendChild(button);
      return button;
    }
  }, {
    key: "showNotification",
    value: function showNotification(details) {
      var icon = details.icon;
      var iconSVG;
      if (icon === "muted-microphone") {
        iconSVG = _icons_muted_microphone_svg__WEBPACK_IMPORTED_MODULE_9__["default"];
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
  }, {
    key: "createCallButton",
    value: function createCallButton(container) {
      var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var button = this.createButton();
      button.id = "saypi-callButton";
      button.type = "button";
      button.className = "call-button fixed rounded-full bg-cream-550 enabled:hover:bg-cream-650";
      this.callInactive(button); // mic is off by default

      (0,_DOMModule_ts__WEBPACK_IMPORTED_MODULE_1__.appendChild)(container, button, position);
      return button;
    }
  }, {
    key: "callActive",
    value: function callActive(callButton) {
      var _this4 = this;
      if (!callButton) {
        callButton = document.getElementById("saypi-callButton");
      }
      if (callButton) {
        var label = "Active continuous listening. Click to stop.";
        callButton.innerHTML = _icons_hangup_svg__WEBPACK_IMPORTED_MODULE_11__["default"];
        callButton.setAttribute("aria-label", label);
        callButton.setAttribute("title", label);
        callButton.onclick = function () {
          _this4.actor.send("saypi:hangup");
        };
        callButton.classList.add("active");
      }
    }
  }, {
    key: "callInactive",
    value: function callInactive(callButton) {
      var _this5 = this;
      if (!callButton) {
        callButton = document.getElementById("saypi-callButton");
      }
      if (callButton) {
        callButton.innerHTML = _icons_call_svg__WEBPACK_IMPORTED_MODULE_10__["default"];
        callButton.setAttribute("aria-label", "Click to start continuous listening.");
        callButton.setAttribute("title", "Not listening. Click to start.");
        callButton.onclick = function () {
          _this5.actor.send("saypi:call");
        };
        callButton.classList.remove("active");
      }
    }
  }, {
    key: "disableCallButton",
    value: function disableCallButton() {
      var callButton = document.getElementById("saypi-callButton");
      if (callButton) {
        callButton.classList.add("disabled");
        // disable the call action, but always allow hangup
        if (!callButton.classList.contains("active")) {
          callButton.disabled = true;
        }
      }
    }
  }, {
    key: "enableCallButton",
    value: function enableCallButton() {
      var callButton = document.getElementById("saypi-callButton");
      if (callButton) {
        callButton.classList.remove("disabled");
        callButton.disabled = false;
      }
    }
  }]);
  return ButtonModule;
}(); // Singleton

var buttonModule = new ButtonModule();

/***/ }),

/***/ "./src/ConfigModule.js":
/*!*****************************!*\
  !*** ./src/ConfigModule.js ***!
  \*****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   config: () => (/* binding */ config)
/* harmony export */ });
var config = {
  appServerUrl: "https://127.0.0.1:4443",
  apiServerUrl: "http://127.0.0.1:5001"
};

/***/ }),

/***/ "./src/EventBus.js":
/*!*************************!*\
  !*** ./src/EventBus.js ***!
  \*************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "./node_modules/events/events.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new events__WEBPACK_IMPORTED_MODULE_0__());

/***/ }),

/***/ "./src/EventModule.js":
/*!****************************!*\
  !*** ./src/EventModule.js ***!
  \****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

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
var PI_SPEAKING = "saypi:piSpeaking";
var PI_STOPPED_SPEAKING = "saypi:piStoppedSpeaking";
var PI_FINISHED_SPEAKING = "saypi:piFinishedSpeaking";
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
      element.focus();

      // Define a regular expression to match sentence terminators, capturing them
      var sentenceRegex = /([.!?。？！]+)/g;
      var tokens = text.split(sentenceRegex).filter(Boolean);

      // Reassemble sentences with their terminators
      var sentences = [];
      for (var _i = 0; _i < tokens.length; _i += 2) {
        var sentence = tokens[_i] + (tokens[_i + 1] || "");
        sentences.push(sentence);
      }
      var i = 0;
      var typeSentence = function typeSentence() {
        if (i < sentences.length) {
          // Type the sentence and its immediate following terminator
          EventModule.setNativeValue(element, element.value + sentences[i++]);
          requestAnimationFrame(typeSentence);
        } else {
          _EventBus_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("saypi:autoSubmit");
        }
      };
      if (sentences.length > 1) {
        // If there are multiple sentences, proceed with sentence-wise typing
        typeSentence();
      } else {
        // If text does not contain recognisable sentence terminators, type it all at once
        EventModule.setNativeValue(element, text);
        _EventBus_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("saypi:autoSubmit");
      }
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
      [PI_SPEAKING, PI_STOPPED_SPEAKING, PI_FINISHED_SPEAKING].forEach(function (eventName) {
        _EventBus_js__WEBPACK_IMPORTED_MODULE_0__["default"].on(eventName, function () {
          actor.send(eventName);
        });
      });
    }
  }]);
  return EventModule;
}();


/***/ }),

/***/ "./src/LoggingModule.js":
/*!******************************!*\
  !*** ./src/LoggingModule.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   logger: () => (/* binding */ logger),
/* harmony export */   serializeStateValue: () => (/* binding */ serializeStateValue)
/* harmony export */ });
function serializeStateValue(stateValue) {
  if (typeof stateValue === "string") {
    return stateValue;
  }
  return Object.keys(stateValue).map(function (key) {
    return "".concat(key, ":").concat(serializeStateValue(stateValue[key]));
  }).join(",");
}
var DEBUG = false; // Consider using config and .env to set the DEBUG flag

var logger = {
  debug: function debug() {
    if (DEBUG) {
      var _console;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      (_console = console).log.apply(_console, ["DEBUG:"].concat(args));
    }
  },
  info: function info() {
    var _console2;
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    (_console2 = console).log.apply(_console2, ["INFO:"].concat(args));
  },
  error: function error() {
    var _console3;
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    (_console3 = console).error.apply(_console3, ["ERROR:"].concat(args));
  }
};

/***/ }),

/***/ "./src/StateMachineService.js":
/*!************************************!*\
  !*** ./src/StateMachineService.js ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var xstate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! xstate */ "./node_modules/xstate/es/interpreter.js");
/* harmony import */ var _state_machines_SayPiMachine_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./state-machines/SayPiMachine.ts */ "./src/state-machines/SayPiMachine.ts");
/* harmony import */ var _LoggingModule_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LoggingModule.js */ "./src/LoggingModule.js");
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
  this.actor = (0,xstate__WEBPACK_IMPORTED_MODULE_2__.interpret)(_state_machines_SayPiMachine_ts__WEBPACK_IMPORTED_MODULE_0__.machine).onTransition(function (state) {
    if (state.changed) {
      var fromState = state.history ? (0,_LoggingModule_js__WEBPACK_IMPORTED_MODULE_1__.serializeStateValue)(state.history.value) : "N/A";
      var toState = (0,_LoggingModule_js__WEBPACK_IMPORTED_MODULE_1__.serializeStateValue)(state.value);
      _LoggingModule_js__WEBPACK_IMPORTED_MODULE_1__.logger.debug("Say, Pi Machine transitioned from ".concat(fromState, " to ").concat(toState, " with ").concat(state.event.type));
    }
  });
  this.actor.start();
}); // Singleton
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new StateMachineService());

/***/ }),

/***/ "./src/UserAgentModule.js":
/*!********************************!*\
  !*** ./src/UserAgentModule.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addDeviceFlags: () => (/* binding */ addDeviceFlags),
/* harmony export */   addUserAgentFlags: () => (/* binding */ addUserAgentFlags),
/* harmony export */   addViewFlags: () => (/* binding */ addViewFlags),
/* harmony export */   enterMobileMode: () => (/* binding */ enterMobileMode),
/* harmony export */   exitMobileMode: () => (/* binding */ exitMobileMode),
/* harmony export */   initMode: () => (/* binding */ initMode),
/* harmony export */   isMobileDevice: () => (/* binding */ isMobileDevice),
/* harmony export */   isMobileView: () => (/* binding */ isMobileView)
/* harmony export */ });
/* harmony import */ var _DOMModule_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DOMModule.ts */ "./src/DOMModule.ts");

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.matchMedia("(max-width: 768px)").matches;
}

// this function determines whether to show the mobile view or not
function isMobileView() {
  var userViewPreference = null;
  try {
    userViewPreference = localStorage.getItem("userViewPreference");
  } catch (e) {
    console.warn("Could not access localStorage: ", e);
  }
  var prefersMobile = false;
  if (userViewPreference) {
    prefersMobile = userViewPreference === "mobile";
  }

  // Make sure isMobileDevice is defined or imported
  return isMobileDevice() && prefersMobile;
}
function exitMobileMode() {
  localStorage.setItem("userViewPreference", "desktop"); // Save preference

  var element = document.documentElement;
  element.classList.remove("mobile-view");
  element.classList.add("desktop-view");
  attachCallButton();
}
function enterMobileMode() {
  localStorage.setItem("userViewPreference", "mobile"); // Save preference

  var element = document.documentElement;
  element.classList.remove("desktop-view");
  element.classList.add("mobile-view");
  detachCallButton();
}
function attachCallButton() {
  // move the call button back into the text prompt container for desktop view
  var container = document.getElementById("saypi-prompt-controls-container");
  var callButton = document.getElementById("saypi-callButton");
  if (container && callButton) {
    (0,_DOMModule_ts__WEBPACK_IMPORTED_MODULE_0__.appendChild)(container, callButton, -1);
  }
}
function detachCallButton() {
  // remove the call button from the text prompt container while in mobile view
  var callButton = document.getElementById("saypi-callButton");
  if (callButton) {
    (0,_DOMModule_ts__WEBPACK_IMPORTED_MODULE_0__.appendChild)(document.body, callButton);
  }
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
    element.classList.remove("desktop-view");
    element.classList.add("mobile-view");
  } else {
    element.classList.remove("mobile-view");
    element.classList.add("desktop-view");
  }
}

/**
 * Perform initial setup of the UI based on the user's device and view preferences
 */
function initMode() {
  if (isMobileView()) {
    enterMobileMode();
  } else {
    exitMobileMode();
  }
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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/* harmony import */ var _SubmitErrorHandler_ts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SubmitErrorHandler.ts */ "./src/SubmitErrorHandler.ts");
/* harmony import */ var _ConfigModule_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ConfigModule.js */ "./src/ConfigModule.js");
/* harmony import */ var _styles_common_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./styles/common.scss */ "./src/styles/common.scss");
/* harmony import */ var _styles_desktop_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./styles/desktop.scss */ "./src/styles/desktop.scss");
/* harmony import */ var _styles_mobile_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./styles/mobile.scss */ "./src/styles/mobile.scss");
/* harmony import */ var _styles_rectangles_css__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./styles/rectangles.css */ "./src/styles/rectangles.css");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return { value: void 0, done: !0 }; } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable || "" === iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } throw new TypeError(_typeof(iterable) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }










_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
  "use strict";

  var audioModuleUrl, pageScript, response, injectScript, callback, config, observer, setupEventBus, annotateDOM, addIdPromptAncestor, addIdSubmitButton, addIdFooter, addIdAudioControls, addIdAudioOutputButton, addTalkButton;
  return _regeneratorRuntime().wrap(function _callee$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        addTalkButton = function _addTalkButton(container) {
          // Create a containing div
          var panel = document.createElement("div");
          panel.id = "saypi-panel";
          if (container) {
            container.appendChild(panel);
          } else {
            document.body.appendChild(panel);
          }

          // talk "button" is no longer a button, but a div
          var button = document.createElement("div");
          button.id = "saypi-talkButton";
          var classNames = "relative flex mt-1 mb-1 rounded-full px-2 py-3 text-center bg-cream-550 hover:bg-cream-650 hover:text-brand-green-700 text-muted";
          button.classList.add(classNames.split(" "));

          // Enable autosubmit by default
          button.dataset.autosubmit = "true";
          button.classList.add("autoSubmit");
          panel.appendChild(button);
          _ButtonModule_js__WEBPACK_IMPORTED_MODULE_0__.buttonModule.addTalkIcon(button);

          // Call the function to inject the script after the button has been added
          injectScript();
        };
        addIdAudioOutputButton = function _addIdAudioOutputButt() {
          // audio button is the last button element in the audio controls container
          var audioButton = document.querySelector("#saypi-audio-controls > div > div.relative.flex.items-center.justify-end.self-end.p-2 > button");
          if (!audioButton) {
            return false;
          } else {
            audioButton.id = "saypi-audio-output-button";
          }
          return true;
        };
        addIdAudioControls = function _addIdAudioControls() {
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
        };
        addIdFooter = function _addIdFooter() {
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
        };
        addIdSubmitButton = function _addIdSubmitButton(container) {
          var submitButtons = container.querySelectorAll("button[type=button]");
          if (submitButtons.length > 0) {
            var lastSubmitButton = submitButtons[submitButtons.length - 1];
            lastSubmitButton.id = "saypi-submitButton";
          }
        };
        addIdPromptAncestor = function _addIdPromptAncestor(container) {
          // climb up the DOM tree until we find a div with class 'w-full'
          var parent = container.parentElement;
          while (parent) {
            if (parent.classList.contains("w-full")) {
              parent.id = "saypi-prompt-ancestor";
              return true;
            }
            parent = parent.parentElement;
          }
          return false;
        };
        annotateDOM = function _annotateDOM(prompt) {
          // Add id attributes to important elements
          prompt.id = "saypi-prompt";
          prompt.parentElement.classList.add("saypi-prompt-container");
          var foundFooter = addIdFooter();
          var foundAudioControls = addIdAudioControls();
          var promptControlsContainer = prompt.parentElement.parentElement;
          promptControlsContainer.id = "saypi-prompt-controls-container";
          var foundPromptAncestor = addIdPromptAncestor(promptControlsContainer);
          var foundAudioOutputButton = addIdAudioOutputButton();
          addIdSubmitButton(promptControlsContainer);
          addTalkButton(document.body);
          _ButtonModule_js__WEBPACK_IMPORTED_MODULE_0__.buttonModule.createCallButton(promptControlsContainer, -1);
          _ButtonModule_js__WEBPACK_IMPORTED_MODULE_0__.buttonModule.createEnterButton();
          _ButtonModule_js__WEBPACK_IMPORTED_MODULE_0__.buttonModule.createExitButton();
          (0,_UserAgentModule_js__WEBPACK_IMPORTED_MODULE_3__.initMode)();
        };
        setupEventBus = function _setupEventBus() {
          // Setting the correct context
          var context = window;
          if (GM_info.scriptHandler !== "Userscripts") {
            context = unsafeWindow;
          }
          context.EventBus = _EventBus_js__WEBPACK_IMPORTED_MODULE_1__["default"]; // Make the EventBus available to the page script
        };
        injectScript = function _injectScript(callback) {
          var scriptElement = document.createElement("script");
          scriptElement.type = "text/javascript";
          scriptElement.id = "saypi-script";
          scriptElement.textContent = pageScript;
          document.body.appendChild(scriptElement);

          // Call the callback function after the script is added
          if (callback) {
            callback();
          }
        };
        audioModuleUrl = "".concat(_ConfigModule_js__WEBPACK_IMPORTED_MODULE_5__.config.appServerUrl, "/audioModule.bundle.js");
        _context.prev = 10;
        _context.next = 13;
        return fetch(audioModuleUrl);
      case 13:
        response = _context.sent;
        if (response.ok) {
          _context.next = 16;
          break;
        }
        throw new Error("Network response was not ok " + response.statusText);
      case 16:
        _context.next = 18;
        return response.text();
      case 18:
        pageScript = _context.sent;
        _context.next = 25;
        break;
      case 21:
        _context.prev = 21;
        _context.t0 = _context["catch"](10);
        console.error("There has been a problem with your fetch operation:", _context.t0);
        return _context.abrupt("return");
      case 25:
        (0,_UserAgentModule_js__WEBPACK_IMPORTED_MODULE_3__.addUserAgentFlags)();
        _EventModule_js__WEBPACK_IMPORTED_MODULE_2__["default"].init();
        setupEventBus();

        // Create a MutationObserver to listen for changes to the DOM
        // textareas are added to the DOM after the page loads
        callback = function callback(mutationsList, observer) {
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
                      _SubmitErrorHandler_ts__WEBPACK_IMPORTED_MODULE_4__.submitErrorHandler.initAudioOutputListener();
                      _SubmitErrorHandler_ts__WEBPACK_IMPORTED_MODULE_4__.submitErrorHandler.checkForRestorePoint();
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
        }; // Options for the observer (which mutations to observe)
        config = {
          attributes: false,
          childList: true,
          subtree: true
        }; // Create an observer instance linked to the callback function
        observer = new MutationObserver(callback); // Start observing the target node for configured mutations
        observer.observe(document.body, config);
        // Start observing the entire document for changes to child nodes and subtree
        observer.observe(document, {
          childList: true,
          subtree: true
        });
      case 33:
      case "end":
        return _context.stop();
    }
  }, _callee, null, [[10, 21]]);
}))();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2F5cGkudXNlci5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUM2RztBQUNqQjtBQUM1Riw4QkFBOEIsbUZBQTJCLENBQUMsNEZBQXFDO0FBQy9GO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLDRGQUE0RixNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sWUFBWSxNQUFNLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxZQUFZLE1BQU0sS0FBSyxLQUFLLE9BQU8sTUFBTSxLQUFLLEtBQUssT0FBTyxNQUFNLEtBQUssWUFBWSxNQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sS0FBSyxNQUFNLFlBQVksTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLEtBQUssTUFBTSxZQUFZLE1BQU0sTUFBTSxZQUFZLE1BQU0sTUFBTSxLQUFLLE1BQU0sWUFBWSxNQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sS0FBSyxNQUFNLFlBQVksTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLEtBQUssTUFBTSxZQUFZLE1BQU0sTUFBTSxZQUFZLE1BQU0sTUFBTSxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxZQUFZLE1BQU0sTUFBTSxZQUFZLGFBQWEsTUFBTSxLQUFLLFlBQVksYUFBYSxNQUFNLE1BQU0sS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sWUFBWSxNQUFNLE1BQU0sVUFBVSxZQUFZLE1BQU0sS0FBSyxVQUFVLHdCQUF3QixNQUFNLE1BQU0sWUFBWSxhQUFhLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sTUFBTSxLQUFLLFlBQVksV0FBVyxZQUFZLE9BQU8sS0FBSyxZQUFZLFdBQVcsWUFBWSxPQUFPLEtBQUssWUFBWSxXQUFXLFlBQVksT0FBTyxLQUFLLFlBQVksV0FBVyxZQUFZLE9BQU8sS0FBSyxZQUFZLFdBQVcsWUFBWSxPQUFPLEtBQUssWUFBWSxXQUFXLFlBQVksc0RBQXNELGlCQUFpQiwwQkFBMEIsS0FBSyxTQUFTLDZCQUE2QixLQUFLLEdBQUcsY0FBYywyQ0FBMkMsNkJBQTZCLEdBQUcsNkJBQTZCLGlCQUFpQiwwQkFBMEIsS0FBSyxTQUFTLDhCQUE4QixLQUFLLEdBQUcsV0FBVyx3Q0FBd0MsNkJBQTZCLEdBQUcsNEJBQTRCLGlCQUFpQiwwQkFBMEIsS0FBSyxTQUFTLDhCQUE4QixLQUFLLEdBQUcsVUFBVSx1Q0FBdUMsNkJBQTZCLEdBQUcsNkJBQTZCLGlCQUFpQiwwQkFBMEIsS0FBSyxTQUFTLDhCQUE4QixLQUFLLEdBQUcsV0FBVyx3Q0FBd0MsNkJBQTZCLEdBQUcsNEJBQTRCLGlCQUFpQiwwQkFBMEIsS0FBSyxTQUFTLDhCQUE4QixLQUFLLEdBQUcsVUFBVSx1Q0FBdUMsNkJBQTZCLEdBQUcsZ0NBQWdDLGlCQUFpQiwwQkFBMEIsS0FBSyxTQUFTLDRCQUE0QixLQUFLLEdBQUcsY0FBYywyQ0FBMkMsNkJBQTZCLEdBQUcsdUZBQXVGLGlCQUFpQix1Q0FBdUMsS0FBSyxTQUFTLDhCQUE4QixLQUFLLFNBQVMsNEJBQTRCLEtBQUssU0FBUyw4QkFBOEIsS0FBSyxHQUFHLHlCQUF5Qiw4Q0FBOEMsNkJBQTZCLEdBQUcsZ0NBQWdDLGlCQUFpQix1Q0FBdUMsS0FBSyxTQUFTLDJDQUEyQyxLQUFLLFNBQVMsMENBQTBDLEtBQUssU0FBUywyQ0FBMkMsS0FBSyxHQUFHLHNCQUFzQiwyQ0FBMkMsNkJBQTZCLEdBQUcsK0JBQStCLGlCQUFpQix1Q0FBdUMsS0FBSyxTQUFTLDRDQUE0QyxLQUFLLFNBQVMsMENBQTBDLEtBQUssU0FBUywyQ0FBMkMsS0FBSyxHQUFHLHFCQUFxQiwwQ0FBMEMsNkJBQTZCLEdBQUcsZ0NBQWdDLGlCQUFpQix1Q0FBdUMsS0FBSyxTQUFTLDJDQUEyQyxLQUFLLFNBQVMsMENBQTBDLEtBQUssU0FBUywyQ0FBMkMsS0FBSyxHQUFHLHNCQUFzQiwyQ0FBMkMsNkJBQTZCLEdBQUcsK0JBQStCLGlCQUFpQix1Q0FBdUMsS0FBSyxTQUFTLDRDQUE0QyxLQUFLLFNBQVMsMENBQTBDLEtBQUssU0FBUywyQ0FBMkMsS0FBSyxHQUFHLHFCQUFxQiwwQ0FBMEMsNkJBQTZCLEdBQUcsbUNBQW1DLGlCQUFpQix1Q0FBdUMsS0FBSyxTQUFTLDJDQUEyQyxLQUFLLFNBQVMsMENBQTBDLEtBQUssU0FBUywyQ0FBMkMsS0FBSyxHQUFHLHlCQUF5Qiw4Q0FBOEMsNkJBQTZCLEdBQUcseUZBQXlGLFNBQVMsK0dBQStHLEtBQUssVUFBVSw0R0FBNEcsS0FBSyxHQUFHLDRFQUE0RSxpQkFBaUIscUNBQXFDLEtBQUssaUJBQWlCLHlDQUF5QyxLQUFLLEdBQUcsZ0NBQWdDLGlCQUFpQix5Q0FBeUMsS0FBSyxpQkFBaUIseUNBQXlDLEtBQUssR0FBRywrQkFBK0IsaUJBQWlCLHlDQUF5QyxLQUFLLGlCQUFpQix5Q0FBeUMsS0FBSyxHQUFHLGdDQUFnQyxpQkFBaUIseUNBQXlDLEtBQUssaUJBQWlCLHlDQUF5QyxLQUFLLEdBQUcsK0JBQStCLGlCQUFpQix5Q0FBeUMsS0FBSyxpQkFBaUIseUNBQXlDLEtBQUssR0FBRyxtQ0FBbUMsaUJBQWlCLHlDQUF5QyxLQUFLLGlCQUFpQix5Q0FBeUMsS0FBSyxHQUFHLDZCQUE2QiwwREFBMEQsR0FBRywwQkFBMEIsd0RBQXdELEdBQUcseUJBQXlCLHNEQUFzRCxHQUFHLDBCQUEwQix3REFBd0QsR0FBRyx5QkFBeUIsc0RBQXNELEdBQUcsNkJBQTZCLDJEQUEyRCxHQUFHLDZHQUE2RyxpQkFBaUIsK0JBQStCLGtDQUFrQyxLQUFLLFNBQVMsaUNBQWlDLHNDQUFzQyxLQUFLLEdBQUcsNkJBQTZCLDhCQUE4QixrQ0FBa0MsOENBQThDLEdBQUcsMEJBQTBCLDhCQUE4QixrQ0FBa0MsOENBQThDLEdBQUcseUJBQXlCLDhCQUE4QixrQ0FBa0MsOENBQThDLEdBQUcsMEJBQTBCLDhCQUE4QixrQ0FBa0MsOENBQThDLEdBQUcseUJBQXlCLDhCQUE4QixrQ0FBa0MsOENBQThDLEdBQUcsNkJBQTZCLDhCQUE4QixrQ0FBa0MsNENBQTRDLEdBQUcsMEZBQTBGLGlCQUFpQixpQkFBaUIsa0NBQWtDLEtBQUssU0FBUyxtQkFBbUIsOEJBQThCLHVCQUF1QixHQUFHLCtJQUErSSxRQUFRLGdEQUFnRCxLQUFLLFNBQVMsa0RBQWtELEtBQUssU0FBUyxpREFBaUQsS0FBSyxTQUFTLGtEQUFrRCxLQUFLLFVBQVUsZ0RBQWdELEtBQUssR0FBRyxzQkFBc0Isb0NBQW9DLGtCQUFrQixzQkFBc0IsR0FBRyxtQkFBbUIsb0NBQW9DLGtCQUFrQixzQkFBc0IsR0FBRyxrQkFBa0Isb0NBQW9DLGtCQUFrQixzQkFBc0IsR0FBRyxtQkFBbUIsb0NBQW9DLGtCQUFrQixzQkFBc0IsR0FBRyxrQkFBa0Isb0NBQW9DLGtCQUFrQixzQkFBc0IsR0FBRyxzQkFBc0Isb0NBQW9DLGtCQUFrQixzQkFBc0IsR0FBRyxxQkFBcUI7QUFDOWlWO0FBQ0EsaUVBQWUsdUJBQXVCLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvYXZDO0FBQzZHO0FBQ2pCO0FBQzVGLDhCQUE4QixtRkFBMkIsQ0FBQyw0RkFBcUM7QUFDL0Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw0QkFBNEI7QUFDNUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLE9BQU8seUZBQXlGLFdBQVcsTUFBTSxLQUFLLHNCQUFzQixNQUFNLEtBQUssV0FBVyxLQUFLLE1BQU0sVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUFVLGtDQUFrQyw2QkFBNkIsR0FBRyxnREFBZ0QsNEJBQTRCLHFCQUFxQixvQkFBb0IsNkhBQTZILHNCQUFzQixnQkFBZ0Isb0JBQW9CLGtCQUFrQixtQkFBbUIsbUJBQW1CLGdCQUFnQixrQkFBa0IsS0FBSyxHQUFHLHFCQUFxQjtBQUNudUI7QUFDQSxpRUFBZSx1QkFBdUIsRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVCdkM7QUFDNkc7QUFDakI7QUFDNUYsOEJBQThCLG1GQUEyQixDQUFDLDRGQUFxQztBQUMvRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxPQUFPLDBGQUEwRixLQUFLLFdBQVcsS0FBSyxLQUFLLFdBQVcsS0FBSyxLQUFLLFdBQVcsS0FBSyxLQUFLLEtBQUssV0FBVyxVQUFVLEtBQUssS0FBSyxVQUFVLFVBQVUsV0FBVyxXQUFXLEtBQUssS0FBSyxXQUFXLFdBQVcsS0FBSyxLQUFLLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxLQUFLLEtBQUssVUFBVSw0Q0FBNEMsc0JBQXNCLFVBQVUsNEJBQTRCLE9BQU8sV0FBVyw4QkFBOEIsT0FBTyxZQUFZLDRCQUE0QixPQUFPLEtBQUsseUJBQXlCLHNFQUFzRSxLQUFLLHlCQUF5QixzQkFBc0IscUJBQXFCLHlCQUF5QixnQ0FBZ0MsS0FBSywrQkFBK0Isd0ZBQXdGLEtBQUssaUNBQWlDLGtCQUFrQixtQkFBbUIsbUJBQW1CLG1CQUFtQixzQkFBc0IsS0FBSyx5QkFBeUIsb0JBQW9CLEtBQUssR0FBRyxxQkFBcUI7QUFDMW1DO0FBQ0EsaUVBQWUsdUJBQXVCLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6Q3ZDO0FBQzZHO0FBQ2pCO0FBQzVGLDhCQUE4QixtRkFBMkIsQ0FBQyw0RkFBcUM7QUFDL0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLE9BQU8seUZBQXlGLFlBQVksV0FBVyxXQUFXLFlBQVksTUFBTSxNQUFNLFVBQVUsVUFBVSxVQUFVLFdBQVcsVUFBVSxVQUFVLEtBQUssS0FBSyxXQUFXLFdBQVcsVUFBVSxLQUFLLEtBQUssVUFBVSxVQUFVLEtBQUssS0FBSyxVQUFVLFdBQVcsS0FBSyxLQUFLLFVBQVUsVUFBVSxVQUFVLEtBQUssTUFBTSxXQUFXLEtBQUssS0FBSyxVQUFVLEtBQUssS0FBSyxXQUFXLFdBQVcsS0FBSyxLQUFLLFVBQVUsS0FBSyxLQUFLLFdBQVcsVUFBVSxXQUFXLEtBQUssS0FBSyxVQUFVLEtBQUssS0FBSyxVQUFVLEtBQUssS0FBSyxVQUFVLEtBQUssS0FBSyxVQUFVLEtBQUssS0FBSyxXQUFXLFdBQVcsVUFBVSxXQUFXLEtBQUssS0FBSyxVQUFVLEtBQUssS0FBSyxVQUFVLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUFVLDJDQUEyQyxvQ0FBb0Msa0JBQWtCLHNCQUFzQixjQUFjLGtEQUFrRCx1QkFBdUIsYUFBYSxLQUFLLHlCQUF5QixvQ0FBb0MsdUJBQXVCLGdCQUFnQixXQUFXLHFCQUFxQix1QkFBdUIsT0FBTyxLQUFLLDJCQUEyQixtQkFBbUIsb0NBQW9DLFdBQVcsbUJBQW1CLHFCQUFxQixxQkFBcUIsT0FBTyxLQUFLLCtJQUErSSw0QkFBNEIsS0FBSywyREFBMkQsb0JBQW9CLEtBQUssK0RBQStELGlEQUFpRCxzQkFBc0IsT0FBTyxxREFBcUQsdUNBQXVDLG9CQUFvQiw4REFBOEQsd0JBQXdCLFNBQVMsT0FBTyxLQUFLLG9GQUFvRixxQkFBcUIsS0FBSywwQkFBMEIsb0JBQW9CLEtBQUsscUJBQXFCLG9CQUFvQixLQUFLLDhCQUE4QixzSUFBc0ksZ0dBQWdHLDJCQUEyQixvQkFBb0IsS0FBSyx5QkFBeUIsc0JBQXNCLG1CQUFtQixjQUFjLGVBQWUsbUJBQW1CLG9CQUFvQixxQkFBcUIsbUJBQW1CLGdCQUFnQixrQkFBa0IsS0FBSyxHQUFHLHFCQUFxQjtBQUNub0Y7QUFDQSxpRUFBZSx1QkFBdUIsRUFBQzs7Ozs7Ozs7Ozs7QUMzRjFCOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQ7QUFDckQ7QUFDQTtBQUNBLGdEQUFnRDtBQUNoRDtBQUNBO0FBQ0EscUZBQXFGO0FBQ3JGO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixpQkFBaUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHFCQUFxQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVixzRkFBc0YscUJBQXFCO0FBQzNHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVixpREFBaUQscUJBQXFCO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVixzREFBc0QscUJBQXFCO0FBQzNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNwRmE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RCxjQUFjO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjs7QUFFbkI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQkFBa0Isc0JBQXNCO0FBQ3hDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLG9CQUFvQixTQUFTO0FBQzdCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7O0FBRUEsa0NBQWtDLFFBQVE7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixpQkFBaUI7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSx1Q0FBdUMsUUFBUTtBQUMvQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCLE9BQU87QUFDekI7QUFDQTtBQUNBOztBQUVBO0FBQ0EsU0FBUyx5QkFBeUI7QUFDbEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQkFBa0IsZ0JBQWdCO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsOERBQThELFlBQVk7QUFDMUU7QUFDQSw4REFBOEQsWUFBWTtBQUMxRTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLFlBQVk7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxJQUFJO0FBQ0o7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUNoZkEsaUVBQWUscTlEQUFxOUQ7Ozs7Ozs7Ozs7Ozs7O0FDQXArRCxpRUFBZSwrTEFBK0wsd0JBQXdCLFNBQVMsMEJBQTBCLDRCQUE0QixTQUFTLGtCQUFrQix3QkFBd0IsU0FBUywrMENBQSswQzs7Ozs7Ozs7Ozs7Ozs7QUNBaHJELGlFQUFlLCs0REFBKzREOzs7Ozs7Ozs7Ozs7OztBQ0E5NUQsaUVBQWUsbTRCQUFtNEI7Ozs7Ozs7Ozs7Ozs7O0FDQWw1QixpRUFBZSxpOUZBQWk5Rjs7Ozs7Ozs7Ozs7Ozs7QUNBaCtGLGlFQUFlLDZPQUE2Tyw0QkFBNEIsU0FBUyw0QkFBNEIsd0JBQXdCLFNBQVMsbUJBQW1CLHdCQUF3QixTQUFTLGtCQUFrQix3QkFBd0IsU0FBUyxtQkFBbUIsd0JBQXdCLFNBQVMsa0JBQWtCLHdCQUF3QixTQUFTLHNCQUFzQix3QkFBd0IsU0FBUyw2d0RBQTZ3RDs7Ozs7Ozs7Ozs7Ozs7QUNBaDNFLGlFQUFlLDgwREFBODBEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQzcxRCxNQUFrRztBQUNsRyxNQUF3RjtBQUN4RixNQUErRjtBQUMvRixNQUFrSDtBQUNsSCxNQUEyRztBQUMzRyxNQUEyRztBQUMzRyxNQUEyRztBQUMzRztBQUNBOztBQUVBOztBQUVBLDRCQUE0QixxR0FBbUI7QUFDL0Msd0JBQXdCLGtIQUFhOztBQUVyQyx1QkFBdUIsdUdBQWE7QUFDcEM7QUFDQSxpQkFBaUIsK0ZBQU07QUFDdkIsNkJBQTZCLHNHQUFrQjs7QUFFL0MsYUFBYSwwR0FBRyxDQUFDLDJGQUFPOzs7O0FBSXFEO0FBQzdFLE9BQU8saUVBQWUsMkZBQU8sSUFBSSwyRkFBTyxVQUFVLDJGQUFPLG1CQUFtQixFQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3pCN0UsTUFBa0c7QUFDbEcsTUFBd0Y7QUFDeEYsTUFBK0Y7QUFDL0YsTUFBa0g7QUFDbEgsTUFBMkc7QUFDM0csTUFBMkc7QUFDM0csTUFBMk07QUFDM007QUFDQTs7QUFFQTs7QUFFQSw0QkFBNEIscUdBQW1CO0FBQy9DLHdCQUF3QixrSEFBYTs7QUFFckMsdUJBQXVCLHVHQUFhO0FBQ3BDO0FBQ0EsaUJBQWlCLCtGQUFNO0FBQ3ZCLDZCQUE2QixzR0FBa0I7O0FBRS9DLGFBQWEsMEdBQUcsQ0FBQyw2S0FBTzs7OztBQUlxSjtBQUM3SyxPQUFPLGlFQUFlLDZLQUFPLElBQUksNktBQU8sVUFBVSw2S0FBTyxtQkFBbUIsRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6QjdFLE1BQWtHO0FBQ2xHLE1BQXdGO0FBQ3hGLE1BQStGO0FBQy9GLE1BQWtIO0FBQ2xILE1BQTJHO0FBQzNHLE1BQTJHO0FBQzNHLE1BQTRNO0FBQzVNO0FBQ0E7O0FBRUE7O0FBRUEsNEJBQTRCLHFHQUFtQjtBQUMvQyx3QkFBd0Isa0hBQWE7O0FBRXJDLHVCQUF1Qix1R0FBYTtBQUNwQztBQUNBLGlCQUFpQiwrRkFBTTtBQUN2Qiw2QkFBNkIsc0dBQWtCOztBQUUvQyxhQUFhLDBHQUFHLENBQUMsOEtBQU87Ozs7QUFJc0o7QUFDOUssT0FBTyxpRUFBZSw4S0FBTyxJQUFJLDhLQUFPLFVBQVUsOEtBQU8sbUJBQW1CLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDekI3RSxNQUFrRztBQUNsRyxNQUF3RjtBQUN4RixNQUErRjtBQUMvRixNQUFrSDtBQUNsSCxNQUEyRztBQUMzRyxNQUEyRztBQUMzRyxNQUEyTTtBQUMzTTtBQUNBOztBQUVBOztBQUVBLDRCQUE0QixxR0FBbUI7QUFDL0Msd0JBQXdCLGtIQUFhOztBQUVyQyx1QkFBdUIsdUdBQWE7QUFDcEM7QUFDQSxpQkFBaUIsK0ZBQU07QUFDdkIsNkJBQTZCLHNHQUFrQjs7QUFFL0MsYUFBYSwwR0FBRyxDQUFDLDZLQUFPOzs7O0FBSXFKO0FBQzdLLE9BQU8saUVBQWUsNktBQU8sSUFBSSw2S0FBTyxVQUFVLDZLQUFPLG1CQUFtQixFQUFDOzs7Ozs7Ozs7OztBQzFCaEU7O0FBRWI7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLHdCQUF3QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixpQkFBaUI7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQiw0QkFBNEI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQiw2QkFBNkI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNuRmE7O0FBRWI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDakNhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNUYTs7QUFFYjtBQUNBO0FBQ0EsY0FBYyxLQUF3QyxHQUFHLHNCQUFpQixHQUFHLENBQUk7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ1RhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtEO0FBQ2xEO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0EsaUZBQWlGO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EseURBQXlEO0FBQ3pEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDNURhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDYkEsU0FBZ0IsV0FBVyxDQUN6QixNQUFlLEVBQ2YsS0FBVyxFQUNYLFdBQW1CLENBQUM7SUFFcEIsb0NBQW9DO0lBQ3BDLElBQUksTUFBTSxFQUFFO1FBQ1YsZ0VBQWdFO1FBQ2hFLElBQUksUUFBUSxLQUFLLENBQUMsRUFBRTtZQUNsQixNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzNCO2FBQU07WUFDTCxnRUFBZ0U7WUFDaEUsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO1lBQ3pELE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7WUFFdEQsMkRBQTJEO1lBQzNELElBQUksYUFBYSxFQUFFO2dCQUNqQixNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQzthQUMzQztpQkFBTTtnQkFDTCwrQ0FBK0M7Z0JBQy9DLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDM0I7U0FDRjtLQUNGO1NBQU07UUFDTCw4REFBOEQ7UUFDOUQsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDbEM7QUFDSCxDQUFDO0FBM0JELGtDQTJCQzs7Ozs7Ozs7Ozs7Ozs7QUMzQkQsK0dBQXNEO0FBZXRELE1BQXFCLGtCQUFrQjtJQUlyQztRQUZRLHNCQUFpQixHQUFZLEtBQUssQ0FBQztRQUd6QyxrQ0FBa0M7UUFDbEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7SUFDeEMsQ0FBQztJQUVELHVCQUF1QjtRQUNyQixNQUFNLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQy9DLDJCQUEyQixDQUM1QixDQUFDO1FBQ0YsSUFBSSxpQkFBaUIsRUFBRTtZQUNyQixpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FDaEMsT0FBTyxFQUNQLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQ3ZDLENBQUM7U0FDSDtJQUNILENBQUM7SUFFRCxnQkFBZ0I7SUFDUixzQkFBc0I7UUFDNUIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsbUJBQW1CO0lBQ3ZFLENBQUM7SUFFRCx1Q0FBdUM7SUFDdkMsaUJBQWlCO1FBQ2YsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FDMUMsb0JBQW9CLENBQ08sQ0FBQztRQUM5QixNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUN0QyxjQUFjLENBQ2UsQ0FBQztRQUNoQyxJQUFJLFlBQVksSUFBSSxRQUFRLEVBQUU7WUFDNUIsSUFBSSxZQUFZLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDdEQsT0FBTyxJQUFJLENBQUM7YUFDYjtTQUNGO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsMERBQTBEO0lBQzFELGtCQUFrQixDQUFDLEVBQ2pCLE1BQU0sRUFBRSxPQUFPLEVBQ2YsaUJBQWlCLEVBQUUsZ0JBQWdCLEVBQ25DLGtCQUFrQixFQUFFLGlCQUFpQixHQUNoQjtRQUNyQixNQUFNLFlBQVksR0FBaUI7WUFDakMsTUFBTSxFQUFFLE9BQU87WUFDZixpQkFBaUIsRUFBRSxnQkFBZ0I7WUFDbkMsa0JBQWtCLEVBQUUsaUJBQWlCO1lBQ3JDLFlBQVksRUFBRSxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRTtTQUN2QyxDQUFDO1FBQ0YsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBRUQsc0NBQXNDO0lBQ3RDLFVBQVU7UUFDUixNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxpQkFBaUI7UUFDZixNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUN0QyxjQUFjLENBQ2UsQ0FBQztRQUNoQyxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUU5QyxJQUFJLGdCQUFnQixHQUFHLElBQUksQ0FBQztRQUM1QixNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDL0QsSUFBSSxVQUFVLEVBQUU7WUFDZCxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUM1RDtRQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsa0JBQWtCLENBQUM7WUFDdEIsTUFBTSxFQUFFLE1BQU07WUFDZCxpQkFBaUIsRUFBRSxnQkFBZ0I7WUFDbkMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQjtTQUMzQyxDQUFDLENBQUM7UUFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRCx3Q0FBd0M7SUFDeEMsb0JBQW9CO1FBQ2xCLE1BQU0sVUFBVSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzlELElBQUksVUFBVSxFQUFFO1lBQ2QsTUFBTSxZQUFZLEdBQWlCLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDMUQsTUFBTSxXQUFXLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUMvQixNQUFNLFdBQVcsR0FBRyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFeEQsTUFBTSxjQUFjLEdBQ2xCLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxHQUFHLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYTtZQUU5RSxJQUFJLGNBQWMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBQ3pELHVDQUFhLEVBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNuQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQ3hELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUMsQ0FBQztnQkFDMUQsb0NBQW9DO2dCQUNwQyxZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQzthQUMvQztTQUNGO0lBQ0gsQ0FBQztJQUVELGtCQUFrQixDQUFDLE1BQWU7UUFDaEMsSUFBSSxNQUFNLEVBQUU7WUFDVixNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDL0QsSUFBSSxVQUFVLEVBQUU7Z0JBQ2QsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQ3BCO1NBQ0Y7SUFDSCxDQUFDO0lBRUQsbUJBQW1CLENBQUMsTUFBZTtRQUNqQyxJQUFJLE1BQU0sRUFBRTtZQUNWLE1BQU0saUJBQWlCLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FDL0MsMkJBQTJCLENBQzVCLENBQUM7WUFDRixJQUFJLGlCQUFpQixFQUFFO2dCQUNyQixpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUMzQjtTQUNGO0lBQ0gsQ0FBQztDQUNGO0FBN0hELHdDQTZIQztBQUVELFlBQVk7QUFDQywwQkFBa0IsR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDL0kzRCxnR0FBMkM7QUFDM0Msc0lBQTJEO0FBQzNELHlHQUFvRDtBQUNwRCxxR0FBcUM7QUFDckMsOEdBQTJDO0FBQzNDLG1HQUE0QztBQVU1QyxNQUFNLHlCQUF5QixHQUFHO0lBQ2hDLGlCQUFpQjtJQUNqQixhQUFhO0lBQ2IsaURBQWlELEVBQUUsVUFBVTtJQUM3RCxxQ0FBcUM7Q0FDdEMsQ0FBQztBQUVGLHFDQUFxQztBQUNyQyxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQyxhQUFhO0FBRXZDLDhEQUE4RDtBQUM5RCxJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7QUFDcEIsTUFBTSxnQ0FBZ0MsR0FHakMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUVmLFNBQVMsc0JBQXNCO0lBQzdCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUN2QixnQ0FBZ0MsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtRQUNqRCxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsU0FBUyxHQUFHLFVBQVUsRUFBRTtZQUN0QyxnQ0FBZ0MsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDL0MseUJBQU0sQ0FBQyxJQUFJLENBQUMseUJBQXlCLEtBQUssQ0FBQyxHQUFHLFlBQVksQ0FBQyxDQUFDO1NBQzdEO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsU0FBUyxpQkFBaUI7SUFDeEIsV0FBVyxFQUFFLENBQUM7SUFDZCxnQ0FBZ0MsQ0FBQyxHQUFHLENBQUM7UUFDbkMsR0FBRyxFQUFFLFdBQVc7UUFDaEIsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7S0FDdEIsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELFNBQVMscUJBQXFCLENBQUMsR0FBVztJQUN4Qyw2Q0FBNkM7SUFDN0MsZ0NBQWdDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7UUFDakQsSUFBSSxLQUFLLENBQUMsR0FBRyxLQUFLLEdBQUcsRUFBRTtZQUNyQixnQ0FBZ0MsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDL0MseUJBQU0sQ0FBQyxLQUFLLENBQ1YsMEJBQTBCLEdBQUcsbUJBQzNCLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUNuQyxHQUFHLENBQ0osQ0FBQztZQUNGLE9BQU87U0FDUjtJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELFNBQWdCLHNCQUFzQjtJQUNwQyxzQkFBc0IsRUFBRSxDQUFDO0lBQ3pCLE9BQU8sZ0NBQWdDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUNuRCxDQUFDO0FBSEQsd0RBR0M7QUFFRCwrQ0FBK0M7QUFDL0MsU0FBZ0IsMEJBQTBCO0lBQ3hDLGdDQUFnQyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQzNDLENBQUM7QUFGRCxnRUFFQztBQUVELFNBQXNCLG9CQUFvQixDQUN4QyxTQUFlLEVBQ2YsbUJBQTJCLEVBQzNCLHVCQUErQyxFQUFFLEVBQ2pELGFBQXFCLENBQUM7O1FBRXRCLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNuQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyw0QkFBNEI7UUFFOUMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxFQUFVLEVBQUUsRUFBRSxDQUMzQixJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRXBELE9BQU8sVUFBVSxHQUFHLFVBQVUsRUFBRTtZQUM5QixJQUFJO2dCQUNGLGlCQUFpQixFQUFFLENBQUM7Z0JBQ3BCLE1BQU0sV0FBVyxDQUFDLFNBQVMsRUFBRSxtQkFBbUIsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO2dCQUN4RSxPQUFPO2FBQ1I7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCwyQ0FBMkM7Z0JBQzNDLElBQ0UsS0FBSyxZQUFZLFNBQVM7b0JBQzFCLHlCQUF5QixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQ2pEO29CQUNBLHlCQUFNLENBQUMsSUFBSSxDQUNULFdBQVcsVUFBVSxHQUFHLENBQUMsSUFBSSxVQUFVLHdCQUNyQyxLQUFLLEdBQUcsSUFDVixhQUFhLENBQ2QsQ0FBQztvQkFDRixNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFFbkIsc0JBQXNCO29CQUN0QixLQUFLLElBQUksQ0FBQyxDQUFDO29CQUVYLFVBQVUsRUFBRSxDQUFDO2lCQUNkO3FCQUFNO29CQUNMLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQzNDLGdDQUFtQixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQUU7d0JBQ3ZELE1BQU0sRUFBRSxLQUFLO3FCQUNkLENBQUMsQ0FBQztvQkFDSCxPQUFPO2lCQUNSO2FBQ0Y7U0FDRjtRQUVELE9BQU8sQ0FBQyxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQztRQUNqRCxnQ0FBbUIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLHdCQUF3QixFQUFFO1lBQ3ZELE1BQU0sRUFBRSxJQUFJLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQztTQUN6QyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQUE7QUFoREQsb0RBZ0RDO0FBRUQsU0FBZSxXQUFXLENBQ3hCLFNBQWUsRUFDZixtQkFBMkIsRUFDM0IsdUJBQStDLEVBQUU7O1FBRWpELElBQUk7WUFDRixNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUMsR0FBRyxDQUN2RCxDQUFDLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxFQUFFLEVBQUU7Z0JBQ2pCLE9BQU87b0JBQ0wsSUFBSSxFQUFFLE1BQU07b0JBQ1osT0FBTyxFQUFFLE9BQU87b0JBQ2hCLGNBQWMsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsaUNBQWlDO2lCQUMvRCxDQUFDO1lBQ0osQ0FBQyxDQUNGLENBQUM7WUFFRixNQUFNLFFBQVEsR0FBRyw4QkFBOEIsQ0FDN0MsU0FBUyxFQUNULG1CQUFtQixHQUFHLElBQUksRUFDMUIsUUFBUSxDQUNULENBQUM7WUFDRixNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDO1lBRXBDLE1BQU0sVUFBVSxHQUFHLElBQUksZUFBZSxFQUFFLENBQUM7WUFDekMsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLFVBQVUsQ0FBQztZQUU5QixVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBRWpELE1BQU0sU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDdkMsTUFBTSxRQUFRLEdBQWEsTUFBTSxLQUFLLENBQ3BDLEdBQUcsd0JBQU0sQ0FBQyxZQUFZLHdCQUF3QixRQUFRLEVBQUUsRUFDeEQ7Z0JBQ0UsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsTUFBTTthQUNQLENBQ0YsQ0FBQztZQUVGLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFO2dCQUNoQixNQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsUUFBUSxDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQzthQUNwRTtZQUVELE1BQU0sWUFBWSxHQUEwQixNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNsRSxNQUFNLEdBQUcsR0FBRyxZQUFZLENBQUMsY0FBYyxDQUFDO1lBQ3hDLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtnQkFDckIscUJBQXFCLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDNUI7WUFDRCxNQUFNLE9BQU8sR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3JDLE1BQU0sMkJBQTJCLEdBQUcsT0FBTyxHQUFHLFNBQVMsQ0FBQztZQUN4RCxNQUFNLFVBQVUsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDO1lBQ3JDLE1BQU0sRUFBRSxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO1lBQ3hDLE1BQU0sT0FBTyxHQUEwQjtnQkFDckMsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLGNBQWMsRUFBRSxHQUFHO2FBQ3BCLENBQUM7WUFDRixJQUFJLFlBQVksQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsRUFBRTtnQkFDcEQsT0FBTyxDQUFDLGlCQUFpQixHQUFHLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQzthQUM1RDtZQUNELElBQUksWUFBWSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDeEMsT0FBTyxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDO2FBQ3BDO1lBRUQseUJBQU0sQ0FBQyxJQUFJLENBQ1QsZUFBZSxJQUFJLENBQUMsS0FBSyxDQUN2QixtQkFBbUIsR0FBRyxJQUFJLENBQzNCLG1CQUFtQixFQUFFLGFBQWEsSUFBSSxDQUFDLEtBQUssQ0FDM0MsMkJBQTJCLEdBQUcsSUFBSSxDQUNuQyxHQUFHLENBQ0wsQ0FBQztZQUVGLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUNsQyxnQ0FBbUIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUM7YUFDMUQ7aUJBQU07Z0JBQ0wsZ0NBQW1CLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxPQUFPLENBQUMsQ0FBQzthQUM5RDtTQUNGO1FBQUMsT0FBTyxLQUFjLEVBQUU7WUFDdkIsSUFBSSxLQUFLLFlBQVksS0FBSyxFQUFFO2dCQUMxQixJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssWUFBWSxFQUFFO29CQUMvQixPQUFPLENBQUMsS0FBSyxDQUFDLDhCQUE4QixFQUFFLEtBQUssQ0FBQyxDQUFDO2lCQUN0RDtxQkFBTTtvQkFDTCxPQUFPLENBQUMsS0FBSyxDQUFDLCtCQUErQixFQUFFLEtBQUssQ0FBQyxDQUFDO2lCQUN2RDthQUNGO2lCQUFNO2dCQUNMLE9BQU8sQ0FBQyxLQUFLLENBQUMsK0NBQStDLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDdkU7WUFFRCwrQ0FBK0M7WUFDL0MsTUFBTSxLQUFLLENBQUM7U0FDYjtJQUNILENBQUM7Q0FBQTtBQUVELFNBQVMsOEJBQThCLENBQ3JDLFNBQWUsRUFDZixvQkFBNEIsRUFDNUIsUUFBc0U7SUFFdEUsTUFBTSxRQUFRLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQztJQUNoQyxJQUFJLGFBQWEsR0FBRyxZQUFZLENBQUM7SUFFakMsSUFBSSxTQUFTLENBQUMsSUFBSSxLQUFLLFdBQVcsRUFBRTtRQUNsQyxhQUFhLEdBQUcsV0FBVyxDQUFDO0tBQzdCO1NBQU0sSUFBSSxTQUFTLENBQUMsSUFBSSxLQUFLLFdBQVcsRUFBRTtRQUN6QyxhQUFhLEdBQUcsV0FBVyxDQUFDO0tBQzdCO0lBRUQseUJBQU0sQ0FBQyxJQUFJLENBQ1QsMkNBQTJDLFNBQVMsQ0FBQyxJQUFJLFdBQVcsQ0FDbEUsU0FBUyxDQUFDLElBQUksR0FBRyxJQUFJLENBQ3RCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQ2pCLENBQUM7SUFFRiw0Q0FBNEM7SUFDNUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ25ELFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLG9CQUFvQixDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFDN0QsUUFBUSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztJQUMxRCxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDdEQsT0FBTyxRQUFRLENBQUM7QUFDbEIsQ0FBQztBQUVELFNBQWdCLGFBQWEsQ0FBQyxVQUFrQjtJQUM5Qyx5QkFBTSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsVUFBVSxFQUFFLENBQUMsQ0FBQztJQUNoRCxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUN0QyxjQUFjLENBQ1EsQ0FBQztJQUN6QixJQUFJLHFDQUFZLEdBQUUsRUFBRTtRQUNsQixxRkFBcUY7UUFDckYsSUFBSSxVQUFVLENBQUMsTUFBTSxHQUFHLElBQUksRUFBRTtZQUM1QixVQUFVLEdBQUcsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDO1lBQ2hELE9BQU8sQ0FBQyxJQUFJLENBQ1YsK0ZBQStGLFVBQVUsQ0FBQyxTQUFTLENBQ2pILEdBQUcsQ0FDSixFQUFFLENBQ0osQ0FBQztTQUNIO1FBQ0Qsd0JBQVcsQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ2pELHFCQUFRLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7S0FDbkM7U0FBTTtRQUNMLHdCQUFXLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxHQUFHLFVBQVUsR0FBRyxDQUFDLENBQUM7S0FDeEQ7QUFDSCxDQUFDO0FBcEJELHNDQW9CQztBQUVELFNBQWdCLGdCQUFnQixDQUFDLFdBQW1DO0lBQ2xFLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1NBQ3hDLEdBQUcsQ0FBQyxNQUFNLENBQUM7U0FDWCxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFFekIsTUFBTSxpQkFBaUIsR0FBYSxFQUFFLENBQUM7SUFFdkMsS0FBSyxNQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUU7UUFDNUIsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0tBQ2pEO0lBRUQsT0FBTyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDckMsQ0FBQztBQVpELDRDQVlDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3RSRCxpR0FBa0Q7QUFDbEQsd0ZBQTBEO0FBQzFELDJIQUFvRDtBQUNwRCwwR0FBcUQ7QUFDckQsZ0hBTWdDO0FBQ2hDLGdHQUFtQztBQTRFbkMsc0JBQXNCO0FBQ3RCLFNBQWdCLGNBQWMsQ0FDNUIsdUJBQStCLEVBQy9CLG1CQUEyQixFQUMzQixLQUFhLEVBQ2IsUUFBZ0I7SUFFaEIseUNBQXlDO0lBQ3pDLE1BQU0sV0FBVyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7SUFFekMsK0VBQStFO0lBQy9FLE1BQU0sV0FBVyxHQUFHLFdBQVcsR0FBRyx1QkFBdUIsQ0FBQztJQUUxRCw0RkFBNEY7SUFDNUYsSUFBSSxXQUFXLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztJQUU1Qiw0Q0FBNEM7SUFDNUMsSUFBSSxtQkFBbUIsR0FBRyxtQkFBbUIsR0FBRyxXQUFXLENBQUM7SUFFNUQsbURBQW1EO0lBQ25ELE1BQU0sWUFBWSxHQUFHLG1CQUFtQixHQUFHLFFBQVEsQ0FBQztJQUVwRCwwRUFBMEU7SUFDMUUsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzNELE9BQU8sVUFBVSxDQUFDO0FBQ3BCLENBQUM7QUF4QkQsd0NBd0JDO0FBRUQsc0JBQXNCO0FBQ3RCLE1BQU0sZ0JBQWdCLEdBQUcsbUJBQU0sRUFBQztJQUM5QixjQUFjLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7Q0FDM0IsQ0FBQyxDQUFDO0FBRVUsZUFBTyxHQUFHLDBCQUFhLEVBQ2xDO0lBQ0UsT0FBTyxFQUFFO1FBQ1AsY0FBYyxFQUFFLEVBQUU7UUFDbEIsU0FBUyxFQUFFLFVBQVU7UUFDckIsdUJBQXVCLEVBQUUsQ0FBQztLQUMzQjtJQUNELEVBQUUsRUFBRSxPQUFPO0lBQ1gsT0FBTyxFQUFFLFVBQVU7SUFDbkIsTUFBTSxFQUFFO1FBQ04sUUFBUSxFQUFFO1lBQ1IsV0FBVyxFQUFFLHNEQUFzRDtZQUNuRSxJQUFJLEVBQUUsbUJBQU0sRUFBQyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsQ0FBQztZQUN2QyxFQUFFLEVBQUU7Z0JBQ0YsWUFBWSxFQUFFO29CQUNaLE1BQU0sRUFBRSw0QkFBNEI7b0JBQ3BDLE9BQU8sRUFBRTt3QkFDUDs0QkFDRSxJQUFJLEVBQUUsYUFBYTt5QkFDcEI7d0JBQ0Q7NEJBQ0UsSUFBSSxFQUFFLGdCQUFnQjt5QkFDdkI7cUJBQ0Y7b0JBQ0QsV0FBVyxFQUNULHNFQUFzRTtpQkFDekU7Z0JBQ0Qsa0JBQWtCLEVBQUU7b0JBQ2xCLE1BQU0sRUFBRSw4QkFBOEI7aUJBQ3ZDO2FBQ0Y7U0FDRjtRQUNELE1BQU0sRUFBRTtZQUNOLFdBQVcsRUFBRSxxQkFBcUI7WUFDbEMsS0FBSyxFQUFFO2dCQUNMLE9BQU8sRUFBRTtvQkFDUDt3QkFDRSxNQUFNLEVBQUUsa0JBQWtCO3dCQUMxQixPQUFPLEVBQUUsRUFBRTt3QkFDWCxXQUFXLEVBQUUsMkNBQTJDO3FCQUN6RDtvQkFDRDt3QkFDRSxRQUFRLEVBQUUsS0FBSztxQkFDaEI7aUJBQ0Y7YUFDRjtZQUNELE9BQU8sRUFBRSxrQkFBa0I7WUFDM0IsTUFBTSxFQUFFO2dCQUNOLGdCQUFnQixFQUFFO29CQUNoQixXQUFXLEVBQUUsOENBQThDO29CQUMzRCxLQUFLLEVBQUU7d0JBQ0wsSUFBSSxFQUFFLGdCQUFnQjt3QkFDdEIsTUFBTSxFQUFFOzRCQUNOLFNBQVMsRUFBRSxPQUFPO3lCQUNuQjtxQkFDRjtvQkFDRCxJQUFJLEVBQUU7d0JBQ0osSUFBSSxFQUFFLGVBQWU7d0JBQ3JCLE1BQU0sRUFBRTs0QkFDTixTQUFTLEVBQUUsT0FBTzt5QkFDbkI7cUJBQ0Y7b0JBQ0QsSUFBSSxFQUFFLE9BQU87aUJBQ2Q7Z0JBQ0QsUUFBUSxFQUFFO29CQUNSLFdBQVcsRUFBRSx5QkFBeUI7b0JBQ3RDLEtBQUssRUFBRTt3QkFDTCxJQUFJLEVBQUUsa0JBQWtCO3dCQUN4QixNQUFNLEVBQUU7NEJBQ04sSUFBSSxFQUFFLGtCQUFrQjt5QkFDekI7cUJBQ0Y7b0JBQ0QsSUFBSSxFQUFFO3dCQUNKLElBQUksRUFBRSxxQkFBcUI7cUJBQzVCO29CQUNELElBQUksRUFBRSxPQUFPO2lCQUNkO2FBQ0Y7U0FDRjtRQUNELFNBQVMsRUFBRTtZQUNULFdBQVcsRUFDVCxxSEFBcUg7WUFDdkgsS0FBSyxFQUFFO2dCQUNMO29CQUNFLElBQUksRUFBRSxtQkFBbUI7aUJBQzFCO2dCQUNEO29CQUNFLElBQUksRUFBRSxtQkFBbUI7aUJBQzFCO2FBQ0Y7WUFDRCxJQUFJLEVBQUUsbUJBQU0sRUFBQyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsQ0FBQztZQUN4QyxNQUFNLEVBQUU7Z0JBQ04sU0FBUyxFQUFFO29CQUNULFdBQVcsRUFDVCxpRUFBaUU7b0JBQ25FLE9BQU8sRUFBRSxhQUFhO29CQUN0QixNQUFNLEVBQUU7d0JBQ04sV0FBVyxFQUFFOzRCQUNYLFdBQVcsRUFDVCxvREFBb0Q7NEJBQ3RELEVBQUUsRUFBRTtnQ0FDRiw0QkFBNEIsRUFBRTtvQ0FDNUIsTUFBTSxFQUFFLGlCQUFpQjtpQ0FDMUI7Z0NBQ0Qsb0JBQW9CLEVBQUU7b0NBQ3BCLE1BQU0sRUFBRSxjQUFjO2lDQUN2Qjs2QkFDRjt5QkFDRjt3QkFDRCxZQUFZLEVBQUU7NEJBQ1osV0FBVyxFQUNULDZFQUE2RTs0QkFDL0UsS0FBSyxFQUFFO2dDQUNMLElBQUksRUFBRSxnQkFBZ0I7Z0NBQ3RCLE1BQU0sRUFBRTtvQ0FDTixTQUFTLEVBQUUsY0FBYztpQ0FDMUI7NkJBQ0Y7NEJBQ0QsSUFBSSxFQUFFO2dDQUNKLElBQUksRUFBRSxlQUFlO2dDQUNyQixNQUFNLEVBQUU7b0NBQ04sU0FBUyxFQUFFLGNBQWM7aUNBQzFCOzZCQUNGOzRCQUNELEVBQUUsRUFBRTtnQ0FDRiwyQkFBMkIsRUFBRTtvQ0FDM0I7d0NBQ0UsTUFBTSxFQUFFOzRDQUNOLGFBQWE7NENBQ2IsMENBQTBDO3lDQUMzQzt3Q0FDRCxJQUFJLEVBQUUsVUFBVTt3Q0FDaEIsT0FBTyxFQUFFOzRDQUNQLG1CQUFNLEVBQUM7Z0RBQ0wsdUJBQXVCLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUU7NkNBQ3BELENBQUM7NENBQ0Y7Z0RBQ0UsSUFBSSxFQUFFLGlCQUFpQjs2Q0FDeEI7eUNBQ0Y7cUNBQ0Y7b0NBQ0Q7d0NBQ0UsTUFBTSxFQUFFLGFBQWE7d0NBQ3JCLElBQUksRUFBRSxZQUFZO3FDQUNuQjtpQ0FDRjs2QkFDRjt5QkFDRjtxQkFDRjtvQkFDRCxFQUFFLEVBQUU7d0JBQ0YsY0FBYyxFQUFFOzRCQUNkLE1BQU0sRUFBRSxpQkFBaUI7NEJBQ3pCLE9BQU8sRUFBRTtnQ0FDUDtvQ0FDRSxJQUFJLEVBQUUsZUFBZTtpQ0FDdEI7Z0NBQ0Q7b0NBQ0UsSUFBSSxFQUFFLG1CQUFtQjtpQ0FDMUI7Z0NBQ0Q7b0NBQ0UsSUFBSSxFQUFFLFdBQVc7aUNBQ2xCOzZCQUNGOzRCQUNELFdBQVcsRUFDVCw4RUFBOEU7eUJBQ2pGO3FCQUNGO2lCQUNGO2dCQUNELFVBQVUsRUFBRTtvQkFDVixPQUFPLEVBQUUsY0FBYztvQkFDdkIsTUFBTSxFQUFFO3dCQUNOLFlBQVksRUFBRTs0QkFDWixXQUFXLEVBQ1QseUhBQXlIOzRCQUMzSCxLQUFLLEVBQUU7Z0NBQ0wsZUFBZSxFQUFFO29DQUNmLE1BQU0sRUFBRSxZQUFZO29DQUNwQixJQUFJLEVBQUUseUJBQXlCO29DQUMvQixXQUFXLEVBQUUsbUNBQW1DO2lDQUNqRDs2QkFDRjs0QkFDRCxFQUFFLEVBQUU7Z0NBQ0YsbUJBQW1CLEVBQUU7b0NBQ25CLE1BQU0sRUFBRSxjQUFjO29DQUN0QixPQUFPLEVBQUU7d0NBQ1AsSUFBSSxFQUFFLDZCQUE2QjtxQ0FDcEM7b0NBQ0QsV0FBVyxFQUNULHdEQUF3RDtpQ0FDM0Q7Z0NBQ0Qsd0JBQXdCLEVBQUU7b0NBQ3hCLE1BQU0sRUFBRSxnQ0FBZ0M7b0NBQ3hDLFdBQVcsRUFDVCx5REFBeUQ7aUNBQzVEO2dDQUNELHdCQUF3QixFQUFFO29DQUN4QixNQUFNLEVBQUUsd0JBQXdCO29DQUNoQyxXQUFXLEVBQ1QseURBQXlEO2lDQUM1RDs2QkFDRjt5QkFDRjt3QkFDRCxVQUFVLEVBQUU7NEJBQ1YsV0FBVyxFQUFFLDBCQUEwQjs0QkFDdkMsS0FBSyxFQUFFO2dDQUNMLElBQUksRUFBRSwwQkFBMEI7NkJBQ2pDOzRCQUNELElBQUksRUFBRSxDQUFDLGdCQUFnQixFQUFFLGdEQUEwQixDQUFDOzRCQUNwRCxNQUFNLEVBQUU7Z0NBQ04sTUFBTSxFQUFFLGNBQWM7NkJBQ3ZCO3lCQUNGO3dCQUNELFlBQVksRUFBRTs0QkFDWixXQUFXLEVBQ1QsbURBQW1EOzRCQUNyRCxLQUFLLEVBQUU7Z0NBQ0wsSUFBSSxFQUFFLGdCQUFnQjtnQ0FDdEIsTUFBTSxFQUFFO29DQUNOLFNBQVMsRUFBRSxjQUFjO2lDQUMxQjs2QkFDRjs0QkFDRCxJQUFJLEVBQUU7Z0NBQ0osSUFBSSxFQUFFLGVBQWU7Z0NBQ3JCLE1BQU0sRUFBRTtvQ0FDTixTQUFTLEVBQUUsY0FBYztpQ0FDMUI7NkJBQ0Y7NEJBQ0QsRUFBRSxFQUFFO2dDQUNGLG1CQUFtQixFQUFFO29DQUNuQixNQUFNLEVBQUUsY0FBYztvQ0FDdEIsT0FBTyxFQUFFO3dDQUNQLElBQUksRUFBRSw2QkFBNkI7cUNBQ3BDO29DQUNELFdBQVcsRUFBRSw4Q0FBOEM7aUNBQzVEO2dDQUNELHdCQUF3QixFQUFFO29DQUN4QixNQUFNLEVBQUUsZ0NBQWdDO29DQUN4QyxXQUFXLEVBQ1QscURBQXFEO2lDQUN4RDtnQ0FDRCx3QkFBd0IsRUFBRTtvQ0FDeEIsTUFBTSxFQUFFLHdCQUF3QjtvQ0FDaEMsV0FBVyxFQUNULDBFQUEwRTtpQ0FDN0U7NkJBQ0Y7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7YUFDRjtZQUNELEVBQUUsRUFBRTtnQkFDRixrQkFBa0IsRUFBRTtvQkFDbEIsTUFBTSxFQUFFLDhCQUE4QjtpQkFDdkM7YUFDRjtZQUNELElBQUksRUFBRSxVQUFVO1NBQ2pCO1FBQ0QsVUFBVSxFQUFFO1lBQ1YsV0FBVyxFQUNULHFFQUFxRTtZQUN2RSxLQUFLLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFLG1CQUFtQjthQUMxQjtZQUNELElBQUksRUFBRTtnQkFDSixJQUFJLEVBQUUsa0JBQWtCO2FBQ3pCO1lBQ0QsT0FBTyxFQUFFLFlBQVk7WUFDckIsTUFBTSxFQUFFO2dCQUNOLFVBQVUsRUFBRTtvQkFDVixXQUFXLEVBQ1QsK0RBQStEO29CQUNqRSxLQUFLLEVBQUU7d0JBQ0wsSUFBSSxFQUFFLGdCQUFnQjt3QkFDdEIsTUFBTSxFQUFFOzRCQUNOLFNBQVMsRUFBRSxZQUFZO3lCQUN4QjtxQkFDRjtvQkFDRCxJQUFJLEVBQUU7d0JBQ0osSUFBSSxFQUFFLGVBQWU7d0JBQ3JCLE1BQU0sRUFBRTs0QkFDTixTQUFTLEVBQUUsWUFBWTt5QkFDeEI7cUJBQ0Y7b0JBQ0QsRUFBRSxFQUFFO3dCQUNGLHlCQUF5QixFQUFFOzRCQUN6QjtnQ0FDRSxNQUFNLEVBQUUsa0JBQWtCO2dDQUMxQixJQUFJLEVBQUUsY0FBYzs2QkFDckI7NEJBQ0Q7Z0NBQ0UsTUFBTSxFQUFFLGlCQUFpQjtnQ0FDekIsSUFBSSxFQUFFLGFBQWE7NkJBQ3BCO3lCQUNGO3dCQUNELG9CQUFvQixFQUFFOzRCQUNwQixNQUFNLEVBQUUseUNBQXlDO3lCQUNsRDt3QkFDRCwwQkFBMEIsRUFBRTs0QkFDMUIsTUFBTSxFQUFFLGtCQUFrQjt5QkFDM0I7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0Y7SUFDRCwwQkFBMEIsRUFBRSxJQUFJO0lBQ2hDLG1CQUFtQixFQUFFLElBQUk7Q0FDMUIsRUFDRDtJQUNFLE9BQU8sRUFBRTtRQUNQLGlCQUFpQixFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ3BDLDRCQUFlLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUN0QyxDQUFDO1FBRUQsY0FBYyxFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUU7WUFDN0MsNEJBQWUsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMxRCxDQUFDO1FBRUQsYUFBYSxFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUU7WUFDNUMsNEJBQWUsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN6RCxDQUFDO1FBRUQsZUFBZSxFQUFFLENBQ2YsT0FBcUIsRUFDckIsS0FBOEIsRUFDOUIsRUFBRTtZQUNGLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDN0IsSUFBSSxTQUFTLEVBQUU7Z0JBQ2IsOENBQW9CLEVBQ2xCLFNBQVMsRUFDVCxLQUFLLENBQUMsUUFBUSxFQUNkLE9BQU8sQ0FBQyxjQUFjLENBQ3ZCLENBQUM7YUFDSDtRQUNILENBQUM7UUFFRCwyQkFBMkIsRUFBRSxDQUMzQixZQUFZLEVBQ1osS0FBNEIsRUFDNUIsRUFBRTtZQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDbEQsTUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztZQUNqQyxNQUFNLGNBQWMsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDO1lBQzVDLFlBQVksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLEdBQUcsYUFBYSxDQUFDO1FBQzlELENBQUM7UUFFRCxpQkFBaUIsRUFBRSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUNwQyxnREFBZ0Q7WUFDaEQsaURBQWlEO1lBQ2pELElBQUkscUNBQVksR0FBRSxFQUFFO2dCQUNsQixrQkFBUSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO2FBQ3ZDO1FBQ0gsQ0FBQztRQUVELGNBQWMsRUFBRSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUNqQyxrQkFBUSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQ3hDLENBQUM7UUFFRCxhQUFhLEVBQUUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDaEMsa0JBQVEsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUN2QyxDQUFDO1FBRUQsZ0JBQWdCLEVBQUUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRTtZQUMvQyxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNoQyxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztZQUN0Qyw4QkFBWSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDbkQsQ0FBQztRQUVELG1CQUFtQixFQUFFLEdBQUcsRUFBRTtZQUN4Qiw4QkFBWSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDckMsQ0FBQztRQUVELHdCQUF3QixFQUFFLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDcEMsTUFBTSxNQUFNLEdBQUcsMENBQWdCLEVBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQy9ELElBQUksTUFBTTtnQkFBRSx1Q0FBYSxFQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFFRCxXQUFXLEVBQUUsR0FBRyxFQUFFO1lBQ2hCLDhCQUFZLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDNUIsQ0FBQztRQUNELFNBQVMsRUFBRSxHQUFHLEVBQUU7WUFDZCw4QkFBWSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQzlCLENBQUM7UUFDRCxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7WUFDdEIsOEJBQVksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQ25DLENBQUM7UUFDRCxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7WUFDckIsOEJBQVksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQ2xDLENBQUM7S0FDRjtJQUNELFFBQVEsRUFBRSxFQUFFO0lBQ1osTUFBTSxFQUFFO1FBQ04sUUFBUSxFQUFFLENBQUMsT0FBcUIsRUFBRSxLQUFpQixFQUFFLEVBQUU7WUFDckQsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLDJCQUEyQixFQUFFO2dCQUM5QyxLQUFLLEdBQUcsS0FBZ0MsQ0FBQztnQkFDekMsT0FBTyxLQUFLLENBQUMsSUFBSSxLQUFLLFNBQVMsSUFBSSxLQUFLLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQzthQUN2RDtZQUNELE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUNELFVBQVUsRUFBRSxDQUFDLE9BQXFCLEVBQUUsS0FBaUIsRUFBRSxFQUFFO1lBQ3ZELElBQUksS0FBSyxDQUFDLElBQUksS0FBSywyQkFBMkIsRUFBRTtnQkFDOUMsS0FBSyxHQUFHLEtBQWdDLENBQUM7Z0JBQ3pDLE9BQU8sQ0FDTCxLQUFLLENBQUMsSUFBSSxLQUFLLFNBQVM7b0JBQ3hCLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUM7b0JBQ3JCLEtBQUssQ0FBQyxRQUFRLEtBQUssQ0FBQyxDQUNyQixDQUFDO2FBQ0g7WUFDRCxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7UUFDRCx1QkFBdUIsRUFBRSxDQUN2QixPQUFxQixFQUNyQixLQUFpQixFQUNqQixJQUFJLEVBQ0osRUFBRTtZQUNGLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUM7WUFDdkIsTUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUNwQixLQUFLLENBQUMsT0FBTyxDQUFDLGtDQUFrQyxDQUFDO2dCQUNqRCxLQUFLLENBQUMsT0FBTyxDQUFDLG1DQUFtQyxDQUFDLENBQ25ELENBQUM7WUFDRixNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO1lBQy9ELE1BQU0sT0FBTyxHQUFHLGdEQUFzQixHQUFFLENBQUM7WUFDekMsTUFBTSxLQUFLLEdBQUcsWUFBWSxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ2pELE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUNELFlBQVksRUFBRSxDQUFDLE9BQXFCLEVBQUUsRUFBRTtZQUN0QyxPQUFPLE9BQU8sQ0FBQyxTQUFTLEtBQUssV0FBVyxDQUFDO1FBQzNDLENBQUM7UUFDRCxXQUFXLEVBQUUsQ0FBQyxPQUFxQixFQUFFLEVBQUU7WUFDckMsT0FBTyxPQUFPLENBQUMsU0FBUyxLQUFLLFVBQVUsQ0FBQztRQUMxQyxDQUFDO0tBQ0Y7SUFDRCxNQUFNLEVBQUU7UUFDTixlQUFlLEVBQUUsQ0FBQyxPQUFxQixFQUFFLEtBQWlCLEVBQUUsRUFBRTtZQUM1RCw4Q0FBOEM7WUFDOUMsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLG1CQUFtQixFQUFFO2dCQUN0QyxPQUFPLENBQUMsQ0FBQzthQUNWO2lCQUFNO2dCQUNMLEtBQUssR0FBRyxLQUE4QixDQUFDO2FBQ3hDO1lBRUQsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUMsNkJBQTZCO1lBRXJELHlEQUF5RDtZQUN6RCxJQUFJLG1CQUFtQixHQUFHLENBQUMsQ0FBQztZQUM1QixJQUFJLEtBQUssQ0FBQyxpQkFBaUIsS0FBSyxTQUFTLEVBQUU7Z0JBQ3pDLG1CQUFtQixHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQzthQUMvQztZQUVELHVGQUF1RjtZQUN2RixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1lBRTFELE1BQU0sVUFBVSxHQUFHLGNBQWMsQ0FDL0IsT0FBTyxDQUFDLHVCQUF1QixFQUMvQixtQkFBbUIsRUFDbkIsS0FBSyxFQUNMLFFBQVEsQ0FDVCxDQUFDO1lBRUYsT0FBTyxDQUFDLEdBQUcsQ0FDVCxhQUFhLEVBQ2IsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUM5QiwyQkFBMkIsQ0FDNUIsQ0FBQztZQUVGLE9BQU8sVUFBVSxDQUFDO1FBQ3BCLENBQUM7S0FDRjtDQUNGLENBQ0YsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1a0I4QztBQUNxQztBQUN6Qzs7QUFFNUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRyxLQUFLLHVEQUFnQjtBQUN4QjtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGtCQUFrQix5REFBYztBQUNoQztBQUNBLDZDQUE2QyxxREFBVTtBQUN2RCxrSkFBa0o7O0FBRWxKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDOztBQUV2Qzs7QUFFQSxNQUFNLG9EQUFTO0FBQ2Y7QUFDQSwyQ0FBMkMseURBQU87QUFDbEQ7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTs7QUFFQSxTQUFTLDJEQUFRO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUcsS0FBSyx1REFBZ0I7QUFDeEI7QUFDQSxHQUFHO0FBQ0g7O0FBRTJHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsR2hFO0FBQ007O0FBRWpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsYUFBYSxvREFBUztBQUN0QjtBQUNBO0FBQ0EsT0FBTywwREFBYTtBQUNwQjtBQUNBO0FBQ0E7O0FBRUEsYUFBYSxvREFBUztBQUN0Qjs7QUFFa0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwQjZDO0FBQzNCO0FBQ007QUFDSjtBQUNiO0FBQ1E7O0FBRWpEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxNQUFNLG1EQUFRLE9BQU8sbURBQVE7QUFDN0I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLG9CQUFvQiwyREFBUSxDQUFDLDJEQUFRLEdBQUc7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxNQUFNO0FBQ04sR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxzQkFBc0IsNkRBQWtCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLDZEQUFrQjtBQUM3RCxnQkFBZ0IsdURBQU87QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsMERBQVU7QUFDekI7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTs7QUFFQSxpQkFBaUIsa0RBQVM7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1CQUFtQixrREFBUztBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsUUFBUSxtREFBUTtBQUNoQjtBQUNBOztBQUVBO0FBQ0EsNkNBQTZDLGdFQUFhLEtBQUsseURBQU07QUFDckU7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLHlEQUFNOztBQUUvQixXQUFXLDJEQUFRLENBQUMsMkRBQVEsR0FBRztBQUMvQjtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBLFdBQVcsdURBQVk7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQSxRQUFRLDBEQUFhO0FBQ3JCLE1BQU0sK0NBQUksaUZBQWlGO0FBQzNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0EsQ0FBQzs7QUFFNkU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqUlc7QUFDdVQ7QUFDM1Y7QUFDMEM7QUFDbUY7QUFDakk7QUFDQTtBQUNzSDtBQUNySDtBQUNJOztBQUV0RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWU7QUFDZixjQUFjO0FBQ2QsZ0JBQWdCO0FBQ2hCLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdFQUFnRSxtREFBUSx1QkFBdUIsb0RBQVM7QUFDeEcsR0FBRztBQUNIO0FBQ0EsRUFBRSwrQ0FBSTtBQUNOOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFGQUFxRiwwREFBZTtBQUNwRyxnQ0FBZ0MsZ0VBQWEscUJBQXFCLHlEQUFNO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQVMsMERBQWE7QUFDdEIsTUFBTSwrQ0FBSTtBQUNWOztBQUVBO0FBQ0EsdUNBQXVDLG9EQUFTO0FBQ2hEOztBQUVBLG1EQUFtRDtBQUNuRDtBQUNBO0FBQ0EsT0FBTztBQUNQLGlDQUFpQywyREFBUSxTQUFTO0FBQ2xEO0FBQ0EsS0FBSyxrQkFBa0I7O0FBRXZCOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxzQkFBc0IsMkRBQVEsQ0FBQyw4REFBYyw4QkFBOEIsVUFBVTtBQUNyRjtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZUFBZTs7QUFFZjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCx3Q0FBd0M7O0FBRXhDLG1CQUFtQixrREFBTztBQUMxQixhQUFhLDJEQUFjO0FBQzNCLEtBQUssR0FBRzs7QUFFUixrQkFBa0Isa0RBQU87QUFDekIsYUFBYSwyREFBYztBQUMzQixLQUFLO0FBQ0w7QUFDQTtBQUNBLGtCQUFrQixrREFBTztBQUN6Qjs7QUFFQSxVQUFVLG9EQUFTO0FBQ25CLHVCQUF1Qix5REFBYztBQUNyQyx5Q0FBeUMsMkRBQVEsU0FBUztBQUMxRCxlQUFlLG1FQUFrQjtBQUNqQztBQUNBO0FBQ0EsU0FBUztBQUNULFFBQVEsU0FBUyxtREFBUTtBQUN6QiwwQ0FBMEMseURBQWM7QUFDeEQsZUFBZSxtRUFBa0IsQ0FBQywyREFBUSxDQUFDLDJEQUFRLEdBQUc7QUFDdEQ7QUFDQTtBQUNBLFNBQVM7QUFDVCxRQUFRLFNBQVMsb0RBQVMsc0JBQXNCLHFEQUFVO0FBQzFELDBDQUEwQyx5REFBYztBQUN4RCx5Q0FBeUMsMkRBQVEsU0FBUztBQUMxRCxlQUFlLG1FQUFrQixDQUFDLDJEQUFRLENBQUMsMkRBQVE7QUFDbkQ7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1QsUUFBUTtBQUNSO0FBQ0EsZUFBZSxtRUFBa0IsQ0FBQywyREFBUSxDQUFDLDJEQUFRO0FBQ25ELGNBQWMseURBQWM7QUFDNUIsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMLHNCQUFzQixrREFBTztBQUM3QixhQUFhLGlFQUFvQjtBQUNqQyxLQUFLO0FBQ0w7QUFDQSxnQkFBZ0Isa0RBQU8sb0JBQW9CO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSSxnRUFBZ0I7QUFDcEI7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLDJEQUFRLENBQUMsMkRBQVEsR0FBRztBQUNuQyxrQkFBa0IsMkRBQVEsQ0FBQywyREFBUSxHQUFHO0FBQ3RDLGNBQWMsMkRBQVEsQ0FBQywyREFBUSxHQUFHO0FBQ2xDLGdCQUFnQiwyREFBUSxDQUFDLDJEQUFRLEdBQUc7QUFDcEMsY0FBYywyREFBUSxDQUFDLDJEQUFRLEdBQUc7QUFDbEMsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLHFEQUFVO0FBQ3ZCLEtBQUs7QUFDTDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLG9EQUFTO0FBQ3pCO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxJQUFJO0FBQ1gsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw4REFBOEQ7O0FBRTlEO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBcUIscURBQVU7QUFDL0Isc0JBQXNCLGtEQUFLOztBQUUzQix5QkFBeUIsaURBQUk7QUFDN0I7QUFDQSxPQUFPOztBQUVQLHdCQUF3QixtREFBTTs7QUFFOUI7QUFDQTs7QUFFQSw2QkFBNkIsa0RBQU87QUFDcEM7QUFDQSxhQUFhLDJEQUFRLENBQUMsMkRBQVEsR0FBRztBQUNqQztBQUNBLE9BQU87QUFDUCxLQUFLLElBQUksa0RBQU87QUFDaEI7QUFDQSwrQkFBK0IsbURBQVE7QUFDdkM7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLGFBQWEsa0RBQU87QUFDcEIsZUFBZSwyREFBUSxDQUFDLDJEQUFRLEdBQUc7QUFDbkM7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQSxhQUFhLDJEQUFRLENBQUMsMkRBQVEsR0FBRztBQUNqQztBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxzQ0FBc0MsNENBQUssaUJBQWlCLHVEQUFZOztBQUV4RSxRQUFRLG1EQUFRO0FBQ2hCO0FBQ0EsMEVBQTBFO0FBQzFFOztBQUVBO0FBQ0E7QUFDQSw0Q0FBNEMsZ0VBQWEsS0FBSyx5REFBTSxDQUFDLGtEQUFPO0FBQzVFO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBLG9CQUFvQix1REFBWTtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0EsMkNBQTJDLDRDQUFLLFdBQVcsNENBQUs7QUFDaEUsbUNBQW1DLGdFQUFnQjtBQUNuRCxlQUFlLDRDQUFLLENBQUMsMkRBQVEsQ0FBQywyREFBUSxHQUFHO0FBQ3pDO0FBQ0E7QUFDQSxZQUFZLDhEQUFjO0FBQzFCLFlBQVksd0VBQXdCO0FBQ3BDO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLG9CQUFvQiwyREFBUSwyQ0FBMkMsVUFBVTtBQUNqRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTCw2QkFBNkIsa0RBQU87QUFDcEM7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBLHdCQUF3QixrREFBTztBQUMvQjtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsZUFBZSxrREFBTztBQUN0QjtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsZUFBZSxrREFBTztBQUN0QjtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxRQUFRLG1EQUFRO0FBQ2hCO0FBQ0EsTUFBTTs7O0FBR047QUFDQTtBQUNBLE1BQU07OztBQUdOO0FBQ0E7O0FBRUE7QUFDQSxnREFBZ0QsdURBQVk7QUFDNUQ7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQiwyREFBUSxpREFBaUQsVUFBVTtBQUN2RjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyxtREFBUTtBQUMxQyxzQkFBc0IsdURBQVk7QUFDbEMsUUFBUSx1REFBWSxDQUFDLHVEQUFZLDJCQUEyQiwrQ0FBSTtBQUNoRTs7QUFFQTtBQUNBLGlDQUFpQyx3REFBYTtBQUM5QyxVQUFVO0FBQ1Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxzQ0FBc0MsZ0VBQWEsS0FBSyx5REFBTTtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw0QkFBNEIsa0RBQU87QUFDbkM7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLGtEQUFPO0FBQ3hDO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBLGlDQUFpQyxnRUFBZ0I7QUFDakQ7O0FBRUE7QUFDQSxvQkFBb0IsMkRBQVE7QUFDNUI7QUFDQSxPQUFPLG9CQUFvQixVQUFVO0FBQ3JDOztBQUVBLGFBQWEsbURBQUcsb0JBQW9CLG1EQUFHO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4QkFBOEIsMkRBQVEsb0RBQW9ELHNCQUFzQjtBQUNoSDs7QUFFQSxhQUFhLG1EQUFHLHdCQUF3QixtREFBRztBQUMzQztBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLHFCQUFxQixrREFBTztBQUM1Qjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGtCQUFrQixpREFBSTtBQUN0QixNQUFNLGlEQUFJLDBCQUEwQixxREFBVTtBQUM5Qzs7QUFFQTtBQUNBLFlBQVksMkRBQVc7QUFDdkIsaUJBQWlCLDhEQUFjO0FBQy9CLFNBQVM7QUFDVCxzQkFBc0IsaURBQUk7QUFDMUI7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxlQUFlLGtEQUFLO0FBQ3BCLE9BQU87QUFDUDtBQUNBO0FBQ0EsaUJBQWlCLDREQUFlLG1CQUFtQixnRUFBYSxDQUFDLGdFQUFhLEtBQUsseURBQU0sd0JBQXdCLHlEQUFNLDBCQUEwQixnRUFBYSxDQUFDLGdFQUFhLEtBQUsseURBQU0seUJBQXlCLHlEQUFNO0FBQ3ROO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxlQUFlLGtEQUFLO0FBQ3BCLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLDREQUFlLENBQUMsZ0VBQWEsQ0FBQyxnRUFBYSxLQUFLLHlEQUFNLDRCQUE0Qix5REFBTTtBQUN6RyxpQkFBaUIsaURBQUk7QUFDckIsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxlQUFlLDREQUFlO0FBQzlCLEtBQUs7O0FBRUw7QUFDQSx3QkFBd0IsNERBQWUsQ0FBQyxrREFBTyxDQUFDLGdFQUFhLEtBQUsseURBQU07QUFDeEU7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1AsZ0JBQWdCLDJEQUFnQjtBQUNoQyxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCLHVEQUFZOztBQUU3Qjs7QUFFQSx5QkFBeUIsNENBQUs7QUFDOUIsdUVBQXVFLDRDQUFLO0FBQzVFLE1BQU07QUFDTiwrQkFBK0IsbURBQVEsdUJBQXVCLDJEQUFnQjtBQUM5RTtBQUNBLHVDQUF1Qyw0Q0FBSztBQUM1Qzs7QUFFQSxTQUFTLDBEQUFhO0FBQ3RCO0FBQ0E7O0FBRUE7QUFDQSxpREFBaUQseURBQWM7QUFDL0Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLGdFQUFnQjtBQUNyQyxnRUFBZ0UsZ0VBQWdCO0FBQ2hGLG9DQUFvQyxnRUFBYSxLQUFLLHlEQUFNO0FBQzVEO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHdFQUF3RTtBQUN4RTs7QUFFQTtBQUNBOztBQUVBLDJDQUEyQyxnRUFBYSxLQUFLLHlEQUFNOztBQUVuRTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxlQUFlLGtEQUFTO0FBQ3hCOztBQUVBLHVEQUF1RDtBQUN2RDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsOERBQWM7QUFDL0IsOENBQThDLHdEQUFRO0FBQ3REO0FBQ0E7QUFDQSxvQ0FBb0MsMkRBQVEsR0FBRzs7QUFFL0M7QUFDQSxnQ0FBZ0MsMkRBQVEsMERBQTBELHdCQUF3QjtBQUMxSDs7QUFFQTtBQUNBLHVDQUF1QywyREFBUSxrQ0FBa0MsVUFBVTtBQUMzRjs7QUFFQSxnQ0FBZ0Msa0RBQU87QUFDdkM7QUFDQSxjQUFjLHlCQUF5QixpREFBTTtBQUM3QztBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBOztBQUVBLGFBQWEseURBQU0sQ0FBQywyREFBYztBQUNsQztBQUNBOztBQUVBLGFBQWEseURBQU0sQ0FBQyxvREFBUyxrQkFBa0IsdURBQWdCO0FBQy9EO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSw2QkFBNkIsa0RBQU8sOEVBQThFLG1EQUFNO0FBQ3hILEtBQUs7QUFDTDtBQUNBLGdDQUFnQywrREFBb0I7QUFDcEQ7QUFDQSxLQUFLLGlCQUFpQiwyREFBUSxHQUFHLDZCQUE2QjtBQUM5RCx3QkFBd0IsNENBQUs7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdEQUF3RCw2REFBa0I7QUFDMUU7QUFDQTtBQUNBLCtGQUErRjtBQUMvRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSx3RUFBd0I7QUFDcEM7QUFDQSxLQUFLO0FBQ0w7QUFDQSx3Q0FBd0MsbURBQU0sc0JBQXNCOztBQUVwRTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOOzs7QUFHQTtBQUNBO0FBQ0EsS0FBSyxJQUFJO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixzREFBUztBQUN6QixTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOzs7QUFHTix1S0FBdUssMkRBQWdCO0FBQ3ZMLHNDQUFzQzs7QUFFdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDBHQUEwRztBQUMxRzs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLFdBQVc7QUFDbkI7QUFDQTtBQUNBOztBQUVBLHlCQUF5QixzREFBVztBQUNwQzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EscURBQXFEO0FBQ3JEOztBQUVBO0FBQ0E7QUFDQSxlQUFlLG9EQUFTO0FBQ3hCO0FBQ0EsU0FBUzs7QUFFVDtBQUNBLFlBQVksbURBQVE7QUFDcEI7O0FBRUE7QUFDQSwwQkFBMEI7QUFDMUI7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsZUFBZSxvREFBUztBQUN4QjtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLFdBQVcsc0RBQVc7QUFDdEI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLDRCQUE0QiwwREFBZTtBQUMzQztBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVCxRQUFRO0FBQ1I7QUFDQTtBQUNBOztBQUVBLDRCQUE0QiwwREFBVSxxREFBcUQ7QUFDM0YsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0Esa0JBQWtCOzs7QUFHbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxZQUFZLG1EQUFRO0FBQ3BCLHFEQUFxRCwyREFBZ0I7QUFDckUsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLFVBQVUsMERBQVU7QUFDcEI7QUFDQSxRQUFROzs7QUFHUjtBQUNBLGFBQWEsMERBQWE7QUFDMUIsVUFBVSwrQ0FBSTtBQUNkOztBQUVBO0FBQ0E7O0FBRUEsa0NBQWtDLHVEQUFZO0FBQzlDLGFBQWEsa0RBQU87QUFDcEI7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGFBQWEseURBQU07QUFDbkI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjLDBEQUFlO0FBQzdCO0FBQ0E7QUFDQTs7QUFFQSw0QkFBNEIsbURBQVE7QUFDcEM7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLDZCQUE2QixrREFBTyxDQUFDLHVEQUFZO0FBQ2pEO0FBQ0EsT0FBTztBQUNQOztBQUVBLDBCQUEwQixxREFBVTs7QUFFcEMsUUFBUSxtREFBUTtBQUNoQjtBQUNBOztBQUVBLFdBQVcsa0RBQU8sQ0FBQyx1REFBWTtBQUMvQjtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMEJBQTBCLGtEQUFPO0FBQ2pDO0FBQ0EsT0FBTztBQUNQO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3QkFBd0IsMkRBQVEsdUNBQXVDLFVBQVU7QUFDakY7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNkNBQTZDLDJEQUFRLGlDQUFpQyxVQUFVO0FBQ2hHO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxXQUFXLG1EQUFRO0FBQ25CO0FBQ0E7O0FBRUEsNERBQTREO0FBQzVEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7O0FBRUEsMkJBQTJCLDBEQUFlO0FBQzFDO0FBQ0EsYUFBYSxtREFBUTtBQUNyQixLQUFLO0FBQ0w7QUFDQTs7QUFFQSxxQkFBcUIsMkRBQVEsQ0FBQywyREFBUSxHQUFHO0FBQ3pDLGVBQWUsNERBQWUsQ0FBQyxrREFBTztBQUN0QyxZQUFZLGtEQUFPO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLDJEQUFRLENBQUMsMkRBQVEsR0FBRztBQUNuQztBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyx5REFBTTs7QUFFNUMsaUJBQWlCLGtEQUFPO0FBQ3hCLGFBQWEsMERBQWE7QUFDMUIsVUFBVSwrQ0FBSSxtREFBbUQsTUFBTSxVQUFVLDhFQUE4RSxhQUFhO0FBQzVLOztBQUVBLG9DQUFvQyxrRUFBdUI7O0FBRTNELGFBQWEsMERBQWE7QUFDMUI7QUFDQTs7QUFFQTtBQUNBLE9BQU8sU0FBUyxrRUFBdUI7QUFDdkM7O0FBRUEsK0NBQStDLGtFQUF1QjtBQUN0RSwwQ0FBMEMsa0VBQXVCLFFBQVEsaURBQUk7O0FBRTdFLFNBQVMsMERBQWE7QUFDdEIsTUFBTSwrQ0FBSTtBQUNWOztBQUVBLHVCQUF1QixrREFBTztBQUM5Qjs7QUFFQTtBQUNBLHdEQUF3RCxnRUFBYSxLQUFLLHlEQUFNLENBQUMsa0VBQXVCLFFBQVEsdURBQVU7QUFDMUg7O0FBRUE7QUFDQSx3REFBd0QsZ0VBQWEsS0FBSyx5REFBTSxDQUFDLGtFQUF1QixRQUFRLGtEQUFLO0FBQ3JIOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsK0JBQStCLGtEQUFPLENBQUMsZ0VBQWEsQ0FBQyxnRUFBYSxDQUFDLGdFQUFhLENBQUMsZ0VBQWEsS0FBSyx5REFBTSxzQkFBc0IseURBQU0sd0JBQXdCLHlEQUFNLG9CQUFvQix5REFBTTtBQUM3TCxhQUFhLGtEQUFPO0FBQ3BCO0FBQ0EsT0FBTztBQUNQLEtBQUs7O0FBRUw7QUFDQSxzQ0FBc0MsMkRBQVEsNEVBQTRFLDhCQUE4QjtBQUN4SjtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxDQUFDOztBQUVvQjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pqRHJCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQsT0FBTztBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZEQUE2RCxjQUFjO0FBQzNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsTUFBTTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkVBQTZFLE9BQU87QUFDcEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRTZEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3RXBCOztBQUV6QyxZQUFZLGtEQUFXO0FBQ3ZCLFdBQVcsa0RBQVc7QUFDdEIsWUFBWSxrREFBVztBQUN2QixXQUFXLGtEQUFXO0FBQ3RCLGFBQWEsa0RBQVc7QUFDeEIsZ0JBQWdCLGtEQUFXO0FBQzNCLGFBQWEsa0RBQVc7QUFDeEIsWUFBWSxrREFBVztBQUN2QixnQkFBZ0Isa0RBQVc7QUFDM0IsVUFBVSxrREFBVztBQUNyQixXQUFXLGtEQUFXO0FBQ3RCLGFBQWEsa0RBQVc7QUFDeEIscUJBQXFCLGtEQUFXO0FBQ2hDLG9CQUFvQixrREFBVztBQUMvQixZQUFZLGtEQUFXO0FBQ3ZCLGFBQWEsa0RBQVc7QUFDeEIsYUFBYSxrREFBVztBQUN4QixXQUFXLGtEQUFXOztBQUUwSTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyQi9FO0FBQ3hCO0FBQ3FKO0FBQzlKO0FBQ3pCO0FBQzhJO0FBQ3BIOztBQUVqRCw2QkFBNkIsdURBQVk7QUFDekMsUUFBUSxpREFBSTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQU0sbURBQVE7QUFDZDs7QUFFQSxRQUFRLHFEQUFVO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLFNBQVMscURBQVU7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjs7QUFFQSxRQUFRLHFEQUFVO0FBQ2xCLHFCQUFxQiwyREFBUSxDQUFDLDJEQUFRLEdBQUc7QUFDekM7QUFDQSxPQUFPO0FBQ1AsTUFBTTtBQUNOO0FBQ0EscUJBQXFCLDJEQUFRLENBQUMsMkRBQVEsQ0FBQywyREFBUSxHQUFHO0FBQ2xEO0FBQ0EsT0FBTztBQUNQLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGdCQUFnQixrREFBTztBQUN2QjtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLFNBQVMsMkRBQVEsQ0FBQywyREFBUTtBQUMxQixRQUFRLG1EQUFRO0FBQ2hCLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVSxrREFBTztBQUNqQixpREFBaUQsd0RBQWE7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQix1REFBWSxDQUFDLHFEQUFVO0FBQzdDOztBQUVBLE1BQU0sbURBQVE7QUFDZDtBQUNBLG9CQUFvQixxREFBVTtBQUM5QixJQUFJO0FBQ0osb0JBQW9CLHFEQUFVO0FBQzlCOztBQUVBLFNBQVMsMkRBQVEsQ0FBQywyREFBUSxHQUFHO0FBQzdCLFVBQVUsa0RBQU87QUFDakI7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLGlEQUFNO0FBQ2hCLFdBQVcscURBQVUsa0JBQWtCLHdEQUFhO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBLDJEQUEyRCxxREFBVSx1QkFBdUIsdURBQVk7QUFDeEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsc0JBQXNCLHVEQUFZLENBQUMscURBQVU7QUFDN0M7O0FBRUEsTUFBTSxtREFBUTtBQUNkO0FBQ0Esb0JBQW9CLHFEQUFVO0FBQzlCLElBQUk7QUFDSixvQkFBb0IscURBQVU7QUFDOUI7O0FBRUEsdUJBQXVCLHFEQUFVO0FBQ2pDLFNBQVMsMkRBQVEsQ0FBQywyREFBUSxHQUFHO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUJBQXFCLDJEQUFRLENBQUMsMkRBQVEsR0FBRztBQUN6QyxRQUFRLHFEQUFjO0FBQ3RCLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBcUIsMkRBQVEsQ0FBQywyREFBUSxHQUFHO0FBQ3pDO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CLG1EQUFNO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUJBQXFCLDJEQUFRLENBQUMsMkRBQVEsR0FBRztBQUN6QztBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBVSxnREFBSztBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLDJEQUFRLENBQUMsMkRBQVEsR0FBRztBQUM3QixXQUFXLG1EQUFRO0FBQ25CO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFVLG1EQUFRO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBVSxrREFBVztBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIscURBQVU7QUFDM0I7QUFDQSxVQUFVLGtEQUFXO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIscURBQVU7QUFDbkM7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLFVBQVUsa0RBQVc7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFVLG1EQUFRO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUIsa0RBQVc7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHVCQUF1QixrREFBVztBQUNsQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHVCQUF1QixrREFBVztBQUNsQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGtEQUFXO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsa0RBQVc7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsT0FBTywwREFBYTtBQUNwQjs7QUFFQTtBQUNBOztBQUVBLHVCQUF1Qix1QkFBdUI7QUFDOUM7QUFDQTs7QUFFQSxtR0FBbUcsZ0VBQWEsS0FBSyx5REFBTTs7QUFFM0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRyxFQUFFLDJEQUFRLENBQUMsMkRBQVEsR0FBRztBQUN6QjtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVksa0RBQU87QUFDbkIsWUFBWSxxREFBVTtBQUN0QjtBQUNBLEdBQUcsRUFBRSwyREFBUSxDQUFDLDJEQUFRLEdBQUc7QUFDekIsUUFBUSxxREFBYztBQUN0QixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsVUFBVSxrREFBVztBQUNyQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLDhCQUE4QiwyREFBUSwwREFBMEQsd0JBQXdCO0FBQ3hIO0FBQ0E7O0FBRUE7QUFDQSxzQ0FBc0MsbURBQVE7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOENBQThDLHdEQUFhO0FBQzNEO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLFdBQVcsa0RBQU87QUFDbEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxXQUFXLGlEQUFNO0FBQ2pCLG9HQUFvRzs7QUFFcEcsYUFBYSwwREFBYTtBQUMxQixvREFBb0Q7O0FBRXBELFVBQVUsK0NBQUksRUFBRSxtREFBUTtBQUN4QjtBQUNBOztBQUVBLGlEQUFpRCxxREFBYztBQUMvRDtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxXQUFXLGdEQUFLO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVyxtREFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQSx3QkFBd0Isa0RBQU87QUFDL0IsNkJBQTZCLHdEQUFhO0FBQzFDLFdBQVc7O0FBRVg7QUFDQTtBQUNBOztBQUVBLG1CQUFtQix5REFBTTtBQUN6QjtBQUNBLHFDQUFxQyxrREFBTztBQUM1QyxXQUFXO0FBQ1g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXLGlEQUFNO0FBQ2pCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLG1CQUFtQix5REFBTTtBQUN6QjtBQUNBLHFDQUFxQyxrREFBTztBQUM1QyxXQUFXO0FBQ1g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXLGlEQUFNO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVyxtREFBUTtBQUNuQjtBQUNBLDJCQUEyQix3REFBYTtBQUN4QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7O0FBRUEsd0JBQXdCLDJEQUFRLENBQUMsMkRBQVEsR0FBRztBQUM1QztBQUNBOztBQUVBLCtCQUErQix1QkFBdUI7QUFDdEQ7QUFDQTs7QUFFQSxtQ0FBbUMsZ0VBQWEsc0NBQXNDLHlEQUFNO0FBQzVGO0FBQ0EsV0FBVzs7QUFFWDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0Esb0JBQW9CLDJEQUFRLGlDQUFpQyxVQUFVO0FBQ3ZFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBLHdCQUF3QixrREFBTztBQUMvQjtBQUNBOztBQUU4VTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3b0I3UjtBQUNUO0FBQ0E7O0FBRXhDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNFQUFzRSx1REFBVTtBQUNoRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0VBQXNFLGtEQUFLO0FBQzNFO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7O0FBRUEsY0FBYyxxREFBVTtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EscUJBQXFCLHFEQUFVO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVtRDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEluRDtBQUNBO0FBQ0E7QUFDQTs7QUFFbUY7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTGxDOztBQUVqRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGFBQWEscUJBQU07QUFDbkIsV0FBVyxxQkFBTTtBQUNqQjs7QUFFQSxPQUFPLDBEQUFhO0FBQ3BCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVzQzs7Ozs7Ozs7Ozs7Ozs7O0FDOUN0QyxvQkFBb0IsYUFBb0I7O0FBRWY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0ZtUjtBQUNwUTtBQUNyQjtBQUNxQjtBQUM0QztBQUM5QjtBQUNiO0FBQ0Q7QUFDTTtBQUNYO0FBQ1E7QUFDSTtBQUNVO0FBQzBCOztBQUVuRixhQUFhLCtDQUFRO0FBQ3JCLGFBQWEsK0NBQVE7QUFDckIsV0FBVyw2Q0FBTTtBQUNqQixhQUFhLCtDQUFRO0FBQ3JCLGlCQUFpQixtREFBWTtBQUM3QixpQkFBaUIsbURBQVk7QUFDN0IsZ0JBQWdCLGtEQUFXO0FBQzNCLGlCQUFpQixtREFBWTtBQUM3QixZQUFZLDhDQUFPO0FBQ25CLFVBQVUsNENBQUs7QUFDZixXQUFXLDZDQUFNO0FBQ2pCLGFBQWEsK0NBQVE7QUFDckIsV0FBVyw2Q0FBTTs7QUFFc0c7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3QnRDO0FBQ3hCO0FBQ1k7QUFDNkM7QUFDRjtBQUMvRDtBQUMrTztBQUNyUDtBQUNzQjtBQUN4QjtBQUNrQjtBQUNOO0FBQ047O0FBRS9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLDhDQUE4Qzs7QUFFL0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBVSxrREFBTztBQUNqQjs7QUFFQTtBQUNBOztBQUVBLG1CQUFtQix1REFBWSxDQUFDLHdEQUFhOztBQUU3QztBQUNBO0FBQ0EsYUFBYSwwREFBYTtBQUMxQixVQUFVLCtDQUFJO0FBQ2Q7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUVBQXVFLG9CQUFvQjtBQUMzRjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxPQUFPOztBQUVQLDJCQUEyQjtBQUMzQjtBQUNBOztBQUVBO0FBQ0EsNkNBQTZDLHFEQUFjO0FBQzNELDZDQUE2QyxtREFBUSxjQUFjLHFEQUFjLDhDQUE4QyxrREFBUSxXQUFXLGtEQUFPOztBQUV6SjtBQUNBO0FBQ0E7QUFDQSxVQUFVOzs7QUFHVixhQUFhLDBEQUFhO0FBQzFCLFVBQVUsK0NBQUk7QUFDZDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQiwyREFBUSxDQUFDLDJEQUFRLEdBQUc7QUFDL0MsaUNBQWlDLGtEQUFPLGFBQWEsa0RBQUs7QUFDMUQ7QUFDQSxXQUFXOztBQUVYO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx3Q0FBd0MsOERBQWlCO0FBQ3pELGlCQUFpQixxREFBVTs7QUFFM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsa0RBQUs7QUFDbEI7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsYUFBYSxpREFBSTtBQUNqQjs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsWUFBWTtBQUNaO0FBQ0Esd0VBQXdFLGtEQUFTO0FBQ2pGLGNBQWM7QUFDZDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsYUFBYSxtREFBTTtBQUNuQjs7QUFFQTs7QUFFQSxhQUFhLGtEQUFLO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDRDQUE0QztBQUM1QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7OztBQUdkLGtDQUFrQyxrREFBVztBQUM3QyxpQ0FBaUMseURBQWM7QUFDL0M7QUFDQTtBQUNBOztBQUVBLG1CQUFtQiwwREFBYTtBQUNoQyxnQkFBZ0IsK0NBQUk7QUFDcEI7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCLDBEQUFhO0FBQ2xDLGtCQUFrQiwrQ0FBSTtBQUN0Qjs7QUFFQTtBQUNBOztBQUVBLHdDQUF3QyxxREFBVTs7QUFFbEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMkJBQTJCLHFEQUFVO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBLGVBQWU7O0FBRWY7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsa0JBQWtCLG9EQUFTO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjO0FBQ2Q7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGFBQWEsaURBQUk7QUFDakI7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGFBQWEsZ0RBQUc7QUFDaEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLGVBQWUsMERBQWE7QUFDNUIsWUFBWSwrQ0FBSTtBQUNoQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsMEJBQTBCLDJEQUFRLENBQUMsMkRBQVEsR0FBRzs7QUFFOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsb0RBQVM7QUFDbEM7QUFDQSxLQUFLO0FBQ0wscUJBQXFCLGtEQUFRO0FBQzdCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsYUFBYSx5REFBTztBQUNwQjtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLDBEQUFhO0FBQ3hCLFFBQVEsK0NBQUk7QUFDWjs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CLDJEQUFRLGlDQUFpQyxVQUFVO0FBQ3ZFO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHNCQUFzQjs7O0FBR3RCLHVDQUF1Qzs7QUFFdkMseUJBQXlCOztBQUV6QjtBQUNBO0FBQ0EsZUFBZSxrREFBUztBQUN4QjtBQUNBLE1BQU07QUFDTjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOzs7QUFHTjtBQUNBO0FBQ0EsS0FBSyxHQUFHOztBQUVSO0FBQ0E7QUFDQSxNQUFNOzs7QUFHTjtBQUNBO0FBQ0Esc0JBQXNCLDJEQUFRLHVDQUF1QyxVQUFVO0FBQy9FO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQiwyREFBUSxrQ0FBa0MsVUFBVTtBQUN4RTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CLDJEQUFRLHlDQUF5QyxVQUFVO0FBQy9FO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsMkVBQTJFLHFEQUFVO0FBQ3JGLHdCQUF3Qix1REFBVTs7QUFFbEM7QUFDQSxzQkFBc0IsMkRBQVEsc0NBQXNDLFVBQVU7QUFDOUU7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSxNQUFNLGtEQUFRO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQSxrQ0FBa0M7O0FBRWxDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUIscURBQVU7QUFDN0IsdUNBQXVDOztBQUV2QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7OztBQUdBOztBQUVBLElBQUksa0RBQVE7QUFDWjtBQUNBO0FBQ0EseUVBQXlFLHlEQUFPO0FBQ2hGLGFBQWEsd0RBQWEsdUZBQXVGLDRDQUFLO0FBQ3RILEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0NBQWtDLGtEQUFTO0FBQzNDLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVUscURBQVU7QUFDcEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxvQkFBb0IsMkRBQVEsa0NBQWtDLFVBQVU7QUFDeEU7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQiwyREFBUSxzQ0FBc0MsVUFBVTtBQUM1RSxpQ0FBaUM7O0FBRWpDO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQkFBb0IsMkRBQVEseUNBQXlDLFVBQVU7QUFDL0U7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQiwyREFBUSxzQ0FBc0MsVUFBVTtBQUM1RTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQiwyREFBUSxzREFBc0QsVUFBVTtBQUM1RjtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLE1BQU07OztBQUdOO0FBQ0EseUJBQXlCLG9EQUFTO0FBQ2xDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLHNCQUFzQjs7O0FBR3RCOztBQUVBLGtCQUFrQjs7O0FBR2xCO0FBQ0E7QUFDQSxtQkFBbUIsdURBQVk7QUFDL0I7QUFDQSxPQUFPOztBQUVQLHNCQUFzQix5REFBTztBQUM3QiwwQkFBMEIsa0RBQU8sQ0FBQyxnRUFBYSxLQUFLLHlEQUFNO0FBQzFEO0FBQ0EsU0FBUztBQUNULGlCQUFpQiw0REFBZTtBQUNoQyxTQUFTOztBQUVULGlCQUFpQix5REFBTSxDQUFDLDJEQUFjO0FBQ3RDO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQSwyQkFBMkIsNENBQUs7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsMkRBQWdCO0FBQ3BDLFdBQVc7QUFDWCx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsT0FBTzs7QUFFUDs7QUFFQTs7QUFFQSxNQUFNLGtEQUFRO0FBQ2QsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVywwREFBYTtBQUN4QixRQUFRLCtDQUFJO0FBQ1o7QUFDQSxNQUFNO0FBQ047QUFDQSx1S0FBdUssb0JBQW9CO0FBQzNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUJBQXFCLHVEQUFZOztBQUVqQzs7QUFFQSxvQkFBb0IseURBQU87QUFDM0I7QUFDQSxTQUFTO0FBQ1Qsa0RBQWtELGdFQUFhLEtBQUsseURBQU07QUFDMUUsaUJBQWlCLDREQUFpQjtBQUNsQyxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBLDRCQUE0QiwyREFBUSx3Q0FBd0Msa0JBQWtCO0FBQzlGOztBQUVBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsOEJBQThCLHVEQUFZO0FBQzFDLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxpQkFBaUIsdURBQVk7O0FBRTdCLDRCQUE0QiwwREFBYTtBQUN6QywrQkFBK0IsMERBQWE7QUFDNUMsS0FBSztBQUNMO0FBQ0E7O0FBRUEsb0JBQW9CLHlEQUFPO0FBQzNCO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxvQkFBb0IsMkRBQVEsa0NBQWtDLFVBQVU7QUFDeEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxvQ0FBb0M7QUFDcEM7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxRQUFRLHFEQUFVO0FBQ2xCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSwrREFBbUI7QUFDaEM7O0FBRUEsUUFBUSx3REFBYTtBQUNyQjtBQUNBLE1BQU0sU0FBUyxxREFBVTtBQUN6QjtBQUNBLE1BQU0sU0FBUywwREFBYztBQUM3QjtBQUNBLE1BQU0sU0FBUyx1REFBWTtBQUMzQjtBQUNBLE1BQU0sU0FBUyxvREFBUztBQUN4Qix1Q0FBdUMsMkRBQVEsQ0FBQywyREFBUSxHQUFHO0FBQzNEO0FBQ0EsT0FBTztBQUNQLE1BQU0sU0FBUyxxREFBVTtBQUN6QjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsZ0RBQWdELDJEQUFRLENBQUMsMkRBQVEsR0FBRztBQUNwRTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCwwQkFBMEIsMkRBQVEsQ0FBQywyREFBUSxHQUFHOztBQUU5QztBQUNBO0FBQ0EsbUJBQW1CLG1EQUFNO0FBQ3pCO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsT0FBTztBQUNQOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUJBQWlCLHVEQUFZO0FBQzdCO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLDZEQUFhO0FBQ2hDO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxtQkFBbUIsdURBQVksQ0FBQyx1REFBVTtBQUMxQztBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBLHlCQUF5QixrREFBSzs7QUFFOUI7QUFDQTtBQUNBLHFCQUFxQix1REFBWTtBQUNqQztBQUNBLFdBQVc7QUFDWCxVQUFVO0FBQ1YsVUFBVSwrRUFBb0M7O0FBRTlDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSx1QkFBdUIscURBQVU7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxLQUFLLEtBQUssdURBQWdCO0FBQzFCO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCLHVEQUFZO0FBQzdCO0FBQ0EsT0FBTztBQUNQOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxNQUFNO0FBQ04sZ0JBQWdCLGtEQUFLO0FBQ3JCOztBQUVBLFFBQVEsd0RBQWE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQSx1QkFBdUIscURBQVU7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUEsWUFBWSxxREFBVTtBQUN0QjtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLEtBQUssS0FBSyx1REFBZ0I7QUFDMUI7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGlCQUFpQix1REFBWTtBQUM3QjtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7O0FBRUEsaUJBQWlCLHVEQUFZLENBQUMsa0RBQUs7QUFDbkM7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMOztBQUVBLGlCQUFpQix1REFBWSxDQUFDLHVEQUFVO0FBQ3hDO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSyxLQUFLLHVEQUFnQjtBQUMxQjtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLFdBQVcsMERBQWE7QUFDeEIsUUFBUSwrQ0FBSTtBQUNaLFFBQVE7OztBQUdSO0FBQ0EsTUFBTTs7O0FBR047QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSyxLQUFLLHVEQUFnQjtBQUMxQjtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBLGlCQUFpQix3REFBUzs7QUFFMUI7QUFDQTtBQUNBO0FBQ0Esb0VBQW9FLDJEQUFRLENBQUMsMkRBQVE7QUFDckY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULG9CQUFvQiwyREFBUTtBQUM1QjtBQUNBO0FBQ0EsV0FBVztBQUNYLFNBQVM7QUFDVDtBQUNBLFFBQVE7OztBQUdSLE1BQU0sOERBQWU7QUFDckI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdCQUF3Qix1REFBZ0I7QUFDeEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0EsTUFBTSxtREFBUTtBQUNkLFdBQVcsMkRBQVEsQ0FBQywyREFBUSxHQUFHO0FBQy9CO0FBQ0EsS0FBSztBQUNMOztBQUVBLFNBQVMsMkRBQVEsQ0FBQywyREFBUSxDQUFDLDJEQUFRLEdBQUc7QUFDdEMsVUFBVSxtREFBUTtBQUNsQixHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBLFNBQVMseURBQU87QUFDaEIsU0FBUywwREFBYTtBQUN0Qix5QkFBeUIsb0RBQVMsWUFBWSxxREFBVTtBQUN4RCxNQUFNLCtDQUFJLHlFQUF5RSxvREFBUztBQUM1Rjs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLGFBQWEsK0RBQW1CO0FBQ2hDO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUU0RDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdCtDSjtBQUNwQztBQUNzQjtBQUN0QjtBQUNNOztBQUUxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPOzs7QUFHUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsMkRBQVEsQ0FBQywyREFBUTtBQUMxQixVQUFVLG1EQUFNO0FBQ2hCLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIseURBQU07O0FBRWhDLGFBQWEsMkRBQVEsQ0FBQywyREFBUSxHQUFHO0FBQ2pDLGNBQWMsbURBQU07QUFDcEI7QUFDQSxPQUFPO0FBQ1A7QUFDQSxHQUFHO0FBQ0g7O0FBRThDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZDRTtBQUNOOztBQUUxQztBQUNBOztBQUVBOztBQUVBO0FBQ0Esa0JBQWtCLDJEQUFRLHlDQUF5QyxVQUFVO0FBQzdFOztBQUVBLFVBQVUsdURBQVk7QUFDdEI7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVvQjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvQm9DO0FBQ3JCOztBQUVuQztBQUNBOztBQUVBLHNCQUFzQiw0Q0FBSyw4QkFBOEIsNENBQUs7O0FBRTlEO0FBQ0EsMEJBQTBCLDJEQUFRLDhDQUE4QyxvQkFBb0I7QUFDcEcsZUFBZSx5REFBTTtBQUNyQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVzQjs7Ozs7Ozs7Ozs7Ozs7O0FDakN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVvQjs7Ozs7Ozs7Ozs7Ozs7OztBQ2xCNEI7O0FBRWhEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQiwyREFBUSxDQUFDLDJEQUFRLEdBQUc7QUFDdkM7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQzs7QUFFb0I7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5RXJCO0FBQ0E7QUFDQTtBQUNBOztBQUUyQjs7Ozs7Ozs7Ozs7Ozs7OztBQ0wzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUU0Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2YyQztBQUNsQzs7QUFFckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsMkJBQTJCLGtEQUFPO0FBQ2xDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLCtCQUErQiwyREFBUSw2REFBNkQseUJBQXlCO0FBQzdIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLCtCQUErQiwyREFBUSw2REFBNkQseUJBQXlCO0FBQzdILHVDQUF1Qzs7QUFFdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsVUFBVTtBQUNWO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLHlDQUF5QywyREFBUSxtQ0FBbUMsVUFBVTtBQUM5Rjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQixrQkFBa0I7QUFDbEI7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsK0JBQStCLDJEQUFRLDZEQUE2RCx5QkFBeUI7QUFDN0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxlQUFlO0FBQ2Y7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLCtCQUErQiwyREFBUSw2REFBNkQseUJBQXlCO0FBQzdIOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBLFNBQVMsZ0VBQWEsS0FBSyx5REFBTSxTQUFTLGtEQUFPLENBQUMsZ0VBQWEsS0FBSyx5REFBTTtBQUMxRTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHLElBQUk7QUFDUDtBQUNBO0FBQ0EsaUJBQWlCLGtEQUFPO0FBQ3hCO0FBQ0EsR0FBRztBQUNIOztBQUVpTDs7Ozs7Ozs7Ozs7Ozs7OztBQ3JRakw7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxrQ0FBa0M7O0FBRW5DOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUMsd0NBQXdDOztBQUVGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hDMEM7QUFDckM7QUFDRztBQUNzQztBQUNwQzs7QUFFakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLDBEQUFlO0FBQy9COztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7O0FBR047QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGtCQUFrQiwwQkFBMEI7QUFDNUM7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtCQUFrQiwyQkFBMkI7QUFDN0M7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0Esa0JBQWtCLDJEQUFRLDJDQUEyQyxVQUFVO0FBQy9FO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSx5QkFBeUIsMkRBQVEscUNBQXFDLGlCQUFpQjtBQUN2RjtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLHlCQUF5QiwyREFBUSxxQ0FBcUMsaUJBQWlCO0FBQ3ZGO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHVCQUF1QiwyREFBUSxxQ0FBcUMsaUJBQWlCO0FBQ3JGO0FBQ0EsMkJBQTJCOztBQUUzQixzQkFBc0Isd0JBQXdCO0FBQzlDOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQ0FBb0MsZ0VBQWEsS0FBSyx5REFBTTtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxrQkFBa0IsMkRBQVEsdUNBQXVDLFVBQVU7QUFDM0U7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7OztBQUdKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXLHlEQUFNO0FBQ2pCO0FBQ0E7O0FBRUE7QUFDQSx1QkFBdUIsMkRBQVEscUNBQXFDLGlCQUFpQjtBQUNyRjs7QUFFQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLDBEQUFhO0FBQ3BCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0Esc0JBQXNCLDJEQUFRLDJDQUEyQyxVQUFVO0FBQ25GO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDJCQUEyQjtBQUMzQixHQUFHO0FBQ0g7QUFDQSxFQUFFOztBQUVGOztBQUVBLEtBQUssMERBQWE7QUFDbEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsUUFBUTs7O0FBR1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSw2REFBa0I7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVksNkRBQWtCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsSUFBSTs7QUFFTCw2QkFBNkI7QUFDN0I7QUFDQSxDQUFDO0FBQ0Q7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFdBQVcsMkRBQVE7QUFDbkI7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsU0FBUywyREFBUTtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVywyREFBUSxDQUFDLDJEQUFRLEdBQUc7QUFDL0I7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLHlDQUF5Qyx5REFBYztBQUN2RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sMERBQWE7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLHNHQUFzRzs7QUFFdEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLHFCQUFxQiw2REFBa0I7QUFDdkM7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsa0RBQUssb0JBQW9CLGlEQUFJLGtCQUFrQixxREFBYztBQUN2Rjs7QUFFcXBCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDbG5CaG9CQSxlQUFlO0VBQUEsU0FBQUEsZ0JBQUE7SUFBQUMsZUFBQSxPQUFBRCxlQUFBO0VBQUE7RUFBQUUsWUFBQSxDQUFBRixlQUFBO0lBQUFHLEdBQUE7SUFBQUMsS0FBQSxFQUtsQyxTQUFBQyxlQUFzQkMsU0FBUyxFQUFFO01BQy9CLElBQUksQ0FBQ0MsbUJBQW1CLENBQUNELFNBQVMsQ0FBQztNQUVuQyxJQUFJRSxVQUFVLEdBQUdDLFFBQVEsQ0FBQ0MsZ0JBQWdCLENBQUMsSUFBSSxDQUFDQyxrQkFBa0IsQ0FBQztNQUNuRUgsVUFBVSxDQUFDSSxPQUFPLENBQUMsVUFBQ0MsSUFBSTtRQUFBLE9BQUtBLElBQUksQ0FBQ0MsU0FBUyxDQUFDQyxHQUFHLENBQUNULFNBQVMsQ0FBQztNQUFBLEVBQUM7SUFDN0Q7RUFBQztJQUFBSCxHQUFBO0lBQUFDLEtBQUEsRUFFRCxTQUFBWSxjQUFxQlYsU0FBUyxFQUFFO01BQzlCLElBQUlFLFVBQVUsR0FBR0MsUUFBUSxDQUFDQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUNDLGtCQUFrQixDQUFDO01BQ25FSCxVQUFVLENBQUNJLE9BQU8sQ0FBQyxVQUFDQyxJQUFJO1FBQUEsT0FBS0EsSUFBSSxDQUFDQyxTQUFTLENBQUNHLE1BQU0sQ0FBQ1gsU0FBUyxDQUFDO01BQUEsRUFBQztJQUNoRTtFQUFDO0lBQUFILEdBQUE7SUFBQUMsS0FBQSxFQUVELFNBQUFjLGtCQUFBLEVBQTJCO01BQUEsSUFBQUMsS0FBQTtNQUN6QixJQUFJLENBQUNDLG9CQUFvQixDQUFDUixPQUFPLENBQUMsVUFBQ04sU0FBUztRQUFBLE9BQzFDYSxLQUFJLENBQUNILGFBQWEsQ0FBQ1YsU0FBUyxDQUFDO01BQUEsQ0FDL0IsQ0FBQztJQUNIO0VBQUM7SUFBQUgsR0FBQTtJQUFBQyxLQUFBLEVBRUQsU0FBQUcsb0JBQTJCYyxhQUFhLEVBQUU7TUFBQSxJQUFBQyxNQUFBO01BQ3hDLElBQUksQ0FBQ0Ysb0JBQW9CLENBQUNSLE9BQU8sQ0FBQyxVQUFDTixTQUFTLEVBQUs7UUFDL0MsSUFBSUEsU0FBUyxLQUFLZSxhQUFhLEVBQUU7VUFDL0JDLE1BQUksQ0FBQ04sYUFBYSxDQUFDVixTQUFTLENBQUM7UUFDL0I7TUFDRixDQUFDLENBQUM7SUFDSjtFQUFDO0VBQUEsT0FBQU4sZUFBQTtBQUFBO0FBQUF1QixlQUFBLENBN0JrQnZCLGVBQWUsd0JBRWhDLDBEQUEwRDtBQUFBdUIsZUFBQSxDQUZ6Q3ZCLGVBQWUsMEJBR0osQ0FBQyxZQUFZLEVBQUUsY0FBYyxFQUFFLGNBQWMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0NoRDtBQUNlO0FBQ1I7QUFDc0I7QUFDRTtBQUNsQjtBQUNRO0FBQ0E7QUFDSjtBQUNZO0FBQ2hCO0FBQ0k7QUFBQSxJQUMxQnVDLFlBQVk7RUFDL0IsU0FBQUEsYUFBQSxFQUFjO0lBQUF0QyxlQUFBLE9BQUFzQyxZQUFBO0lBQ1osSUFBSSxDQUFDQyxLQUFLLEdBQUdWLCtEQUFtQixDQUFDVSxLQUFLO0lBQ3RDO0lBQ0EsSUFBSSxDQUFDQyxtQkFBbUIsQ0FBQyxDQUFDOztJQUUxQjtJQUNBLElBQUksQ0FBQ0MseUJBQXlCLEdBQUcsQ0FBQztFQUNwQztFQUFDeEMsWUFBQSxDQUFBcUMsWUFBQTtJQUFBcEMsR0FBQTtJQUFBQyxLQUFBLEVBRUQsU0FBQXFDLG9CQUFBLEVBQXNCO01BQUEsSUFBQXRCLEtBQUE7TUFDcEJVLG9EQUFRLENBQUNjLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxZQUFNO1FBQ3BDeEIsS0FBSSxDQUFDeUIsZ0JBQWdCLENBQUMsQ0FBQztNQUN6QixDQUFDLENBQUM7SUFDSjs7SUFFQTtFQUFBO0lBQUF6QyxHQUFBO0lBQUFDLEtBQUEsRUFDQSxTQUFBeUMsYUFBYUMsS0FBSyxFQUFFQyxRQUFRLEVBQUU7TUFDNUIsSUFBTUMsTUFBTSxHQUFHdkMsUUFBUSxDQUFDd0MsYUFBYSxDQUFDLFFBQVEsQ0FBQztNQUMvQyxJQUFJSCxLQUFLLEVBQUU7UUFDVEUsTUFBTSxDQUFDRSxXQUFXLEdBQUdKLEtBQUs7TUFDNUI7TUFDQSxJQUFJQyxRQUFRLEVBQUU7UUFDWkMsTUFBTSxDQUFDRyxPQUFPLEdBQUdKLFFBQVE7TUFDM0I7TUFDQSxPQUFPQyxNQUFNO0lBQ2Y7O0lBRUE7RUFBQTtJQUFBN0MsR0FBQTtJQUFBQyxLQUFBLEVBQ0EsU0FBQWdELFlBQVlKLE1BQU0sRUFBRUssTUFBTSxFQUFFO01BQzFCLEtBQUssSUFBSWxELEdBQUcsSUFBSWtELE1BQU0sRUFBRTtRQUN0QixJQUFJQSxNQUFNLENBQUNDLGNBQWMsQ0FBQ25ELEdBQUcsQ0FBQyxFQUFFO1VBQzlCNkMsTUFBTSxDQUFDTyxLQUFLLENBQUNwRCxHQUFHLENBQUMsR0FBR2tELE1BQU0sQ0FBQ2xELEdBQUcsQ0FBQztRQUNqQztNQUNGO0lBQ0Y7RUFBQztJQUFBQSxHQUFBO0lBQUFDLEtBQUEsRUFFRCxTQUFBb0QsWUFBWVIsTUFBTSxFQUFFO01BQUEsSUFBQTFCLE1BQUE7TUFDbEIsSUFBSSxDQUFDbUMsaUJBQWlCLENBQUNULE1BQU0sQ0FBQztNQUU5QlUsTUFBTSxDQUFDQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQ0MsV0FBVyxDQUFDLFlBQU07UUFDeER0QyxNQUFJLENBQUNtQyxpQkFBaUIsQ0FBQ1QsTUFBTSxDQUFDO01BQ2hDLENBQUMsQ0FBQztNQUNGLElBQUksQ0FBQ2Esa0JBQWtCLENBQUNiLE1BQU0sQ0FBQztJQUNqQztFQUFDO0lBQUE3QyxHQUFBO0lBQUFDLEtBQUEsRUFFRCxTQUFBcUQsa0JBQWtCSyxhQUFhLEVBQUU7TUFDL0IsSUFBSW5DLGlFQUFZLENBQUMsQ0FBQyxFQUFFO1FBQ2xCbUMsYUFBYSxDQUFDQyxTQUFTLEdBQUc3Qiw2REFBYTtNQUN6QyxDQUFDLE1BQU07UUFDTDRCLGFBQWEsQ0FBQ0MsU0FBUyxHQUFHNUIsMkRBQVc7TUFDdkM7SUFDRjtFQUFDO0lBQUFoQyxHQUFBO0lBQUFDLEtBQUEsRUFFRCxTQUFBeUQsbUJBQW1CYixNQUFNLEVBQUU7TUFBQSxJQUFBZ0IsTUFBQTtNQUN6QixJQUFNQyxVQUFVLEdBQUd4RCxRQUFRLENBQUN5RCxlQUFlLENBQUMsQ0FBQzs7TUFFN0MsSUFBTUMsTUFBTSxHQUFHO1FBQUVDLFVBQVUsRUFBRSxJQUFJO1FBQUVDLGVBQWUsRUFBRSxDQUFDLE9BQU87TUFBRSxDQUFDO01BRS9ELElBQU10QixRQUFRLEdBQUcsU0FBWEEsUUFBUUEsQ0FBSXVCLGFBQWEsRUFBRUMsUUFBUSxFQUFLO1FBQUEsSUFBQUMsU0FBQSxHQUFBQywwQkFBQSxDQUN2QkgsYUFBYTtVQUFBSSxLQUFBO1FBQUE7VUFBbEMsS0FBQUYsU0FBQSxDQUFBRyxDQUFBLE1BQUFELEtBQUEsR0FBQUYsU0FBQSxDQUFBSSxDQUFBLElBQUFDLElBQUEsR0FBb0M7WUFBQSxJQUEzQkMsUUFBUSxHQUFBSixLQUFBLENBQUF0RSxLQUFBO1lBQ2YsSUFBSTBFLFFBQVEsQ0FBQ0MsSUFBSSxLQUFLLFlBQVksRUFBRTtjQUNsQyxJQUFJRCxRQUFRLENBQUNFLGFBQWEsS0FBSyxPQUFPLEVBQUU7Z0JBQ3RDLElBQUl2RSxRQUFRLENBQUN5RCxlQUFlLENBQUNwRCxTQUFTLENBQUNtRSxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQUU7a0JBQzlEO2tCQUNBakIsTUFBSSxDQUFDUCxpQkFBaUIsQ0FBQ1QsTUFBTSxDQUFDO2dCQUNoQyxDQUFDLE1BQU07a0JBQ0w7a0JBQ0FnQixNQUFJLENBQUNQLGlCQUFpQixDQUFDVCxNQUFNLENBQUM7Z0JBQ2hDO2NBQ0Y7WUFDRjtVQUNGO1FBQUMsU0FBQWtDLEdBQUE7VUFBQVYsU0FBQSxDQUFBVyxDQUFBLENBQUFELEdBQUE7UUFBQTtVQUFBVixTQUFBLENBQUFZLENBQUE7UUFBQTtNQUNILENBQUM7TUFFRCxJQUFNYixRQUFRLEdBQUcsSUFBSWMsZ0JBQWdCLENBQUN0QyxRQUFRLENBQUM7O01BRS9DO01BQ0F3QixRQUFRLENBQUNlLE9BQU8sQ0FBQ3JCLFVBQVUsRUFBRUUsTUFBTSxDQUFDOztNQUVwQztNQUNBO0lBQ0Y7O0lBRUE7RUFBQTtJQUFBaEUsR0FBQTtJQUFBQyxLQUFBLEVBQ0EsU0FBQW1GLG1CQUFBLEVBQXFCO01BQ25CLElBQU1DLFlBQVksR0FBRy9FLFFBQVEsQ0FBQ2dGLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQztNQUVsRSxJQUFJRCxZQUFZLEVBQUU7UUFDaEIsSUFBSXpELHNFQUFrQixDQUFDMkQsaUJBQWlCLENBQUMsQ0FBQyxFQUFFO1VBQzFDO1VBQ0FDLE9BQU8sQ0FBQ0MsS0FBSyw0QkFBQUMsTUFBQSxDQUNnQixJQUFJLENBQUNuRCx5QkFBeUIsWUFDM0QsQ0FBQztVQUNELElBQUksQ0FBQ0EseUJBQXlCLEdBQUcsQ0FBQztVQUNsQ1gsc0VBQWtCLENBQUMrRCxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3hDLENBQUMsTUFBTTtVQUNMLElBQUksQ0FBQ3BELHlCQUF5QixFQUFFO1VBQ2hDOEMsWUFBWSxDQUFDTyxLQUFLLENBQUMsQ0FBQztRQUN0QjtNQUNGLENBQUMsTUFBTTtRQUNMO1FBQ0EsSUFBTUMsUUFBUSxHQUFHdkYsUUFBUSxDQUFDZ0YsY0FBYyxDQUFDLGNBQWMsQ0FBQztRQUV4RCxJQUFNUSxVQUFVLEdBQUcsSUFBSUMsYUFBYSxDQUFDLFNBQVMsRUFBRTtVQUM5Q0MsT0FBTyxFQUFFLElBQUk7VUFDYmhHLEdBQUcsRUFBRSxPQUFPO1VBQ1ppRyxPQUFPLEVBQUUsRUFBRTtVQUNYQyxLQUFLLEVBQUU7UUFDVCxDQUFDLENBQUM7UUFFRkwsUUFBUSxDQUFDTSxhQUFhLENBQUNMLFVBQVUsQ0FBQztNQUNwQztJQUNGOztJQUVBO0VBQUE7SUFBQTlGLEdBQUE7SUFBQUMsS0FBQSxFQUNBLFNBQUF3QyxpQkFBQSxFQUFtQjtNQUNqQixJQUFNMkQsVUFBVSxHQUFHOUYsUUFBUSxDQUFDZ0YsY0FBYyxDQUFDLGtCQUFrQixDQUFDO01BRTlELElBQUljLFVBQVUsQ0FBQ0MsT0FBTyxDQUFDQyxVQUFVLEtBQUssT0FBTyxFQUFFO1FBQzdDZCxPQUFPLENBQUNlLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQztNQUNsQyxDQUFDLE1BQU07UUFDTCxJQUFJLENBQUNuQixrQkFBa0IsQ0FBQyxDQUFDO01BQzNCO0lBQ0Y7RUFBQztJQUFBcEYsR0FBQTtJQUFBQyxLQUFBLEVBRUQsU0FBQXVHLGlCQUFBLEVBQW1CO01BQ2pCLElBQU03RCxLQUFLLEdBQUcsbUNBQW1DO01BQ2pELElBQU1FLE1BQU0sR0FBRyxJQUFJLENBQUNILFlBQVksQ0FBQyxFQUFFLEVBQUUsWUFBTTtRQUN6Q25CLG1FQUFjLENBQUMsQ0FBQztNQUNsQixDQUFDLENBQUM7TUFDRnNCLE1BQU0sQ0FBQzRELEVBQUUsR0FBRyxrQkFBa0I7TUFDOUI1RCxNQUFNLENBQUMrQixJQUFJLEdBQUcsUUFBUTtNQUN0Qi9CLE1BQU0sQ0FBQzZELFNBQVMsR0FDZCx3RUFBd0U7TUFDMUU3RCxNQUFNLENBQUM4RCxZQUFZLENBQUMsWUFBWSxFQUFFaEUsS0FBSyxDQUFDO01BQ3hDRSxNQUFNLENBQUM4RCxZQUFZLENBQUMsT0FBTyxFQUFFaEUsS0FBSyxDQUFDO01BQ25DRSxNQUFNLENBQUNlLFNBQVMsR0FBRy9CLHVEQUFXO01BQzlCdkIsUUFBUSxDQUFDc0csSUFBSSxDQUFDbkYsV0FBVyxDQUFDb0IsTUFBTSxDQUFDO01BQ2pDLE9BQU9BLE1BQU07SUFDZjtFQUFDO0lBQUE3QyxHQUFBO0lBQUFDLEtBQUEsRUFFRCxTQUFBNEcsa0JBQUEsRUFBb0I7TUFDbEIsSUFBTWxFLEtBQUssR0FBRyxvQ0FBb0M7TUFDbEQsSUFBTUUsTUFBTSxHQUFHLElBQUksQ0FBQ0gsWUFBWSxDQUFDLEVBQUUsRUFBRSxZQUFNO1FBQ3pDcEIsb0VBQWUsQ0FBQyxDQUFDO01BQ25CLENBQUMsQ0FBQztNQUNGdUIsTUFBTSxDQUFDNEQsRUFBRSxHQUFHLG1CQUFtQjtNQUMvQjVELE1BQU0sQ0FBQytCLElBQUksR0FBRyxRQUFRO01BQ3RCL0IsTUFBTSxDQUFDNkQsU0FBUyxHQUNkLHlFQUF5RTtNQUMzRTdELE1BQU0sQ0FBQzhELFlBQVksQ0FBQyxZQUFZLEVBQUVoRSxLQUFLLENBQUM7TUFDeENFLE1BQU0sQ0FBQzhELFlBQVksQ0FBQyxPQUFPLEVBQUVoRSxLQUFLLENBQUM7TUFDbkNFLE1BQU0sQ0FBQ2UsU0FBUyxHQUFHOUIsMkRBQWU7TUFDbEN4QixRQUFRLENBQUNzRyxJQUFJLENBQUNuRixXQUFXLENBQUNvQixNQUFNLENBQUM7TUFDakMsT0FBT0EsTUFBTTtJQUNmO0VBQUM7SUFBQTdDLEdBQUE7SUFBQUMsS0FBQSxFQUVELFNBQUE2RyxpQkFBaUJDLE9BQU8sRUFBRTtNQUN4QixJQUFNQyxJQUFJLEdBQUdELE9BQU8sQ0FBQ0MsSUFBSTtNQUN6QixJQUFJQyxPQUFPO01BQ1gsSUFBSUQsSUFBSSxLQUFLLGtCQUFrQixFQUFFO1FBQy9CQyxPQUFPLEdBQUdoRixtRUFBZTtNQUMzQjtNQUVBLElBQU1pRixZQUFZLEdBQUc1RyxRQUFRLENBQUNnRixjQUFjLENBQUMsb0JBQW9CLENBQUM7TUFDbEUsSUFBSTRCLFlBQVksRUFBRTtRQUNoQkEsWUFBWSxDQUFDdkcsU0FBUyxDQUFDRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ3ZDb0csWUFBWSxDQUFDdEQsU0FBUyxHQUFHcUQsT0FBTztNQUNsQyxDQUFDLE1BQU07UUFDTCxJQUFNQyxhQUFZLEdBQUc1RyxRQUFRLENBQUN3QyxhQUFhLENBQUMsS0FBSyxDQUFDO1FBQ2xEb0UsYUFBWSxDQUFDVCxFQUFFLEdBQUcsb0JBQW9CO1FBQ3RDUyxhQUFZLENBQUNSLFNBQVMsR0FBRyxjQUFjO1FBQ3ZDUSxhQUFZLENBQUN0RCxTQUFTLEdBQUdxRCxPQUFPO1FBQ2hDM0csUUFBUSxDQUFDc0csSUFBSSxDQUFDbkYsV0FBVyxDQUFDeUYsYUFBWSxDQUFDO01BQ3pDO0lBQ0Y7RUFBQztJQUFBbEgsR0FBQTtJQUFBQyxLQUFBLEVBRUQsU0FBQWtILG9CQUFBLEVBQXNCO01BQ3BCLElBQU1ELFlBQVksR0FBRzVHLFFBQVEsQ0FBQ2dGLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQztNQUNsRSxJQUFJNEIsWUFBWSxFQUFFO1FBQ2hCQSxZQUFZLENBQUN2RyxTQUFTLENBQUNDLEdBQUcsQ0FBQyxRQUFRLENBQUM7TUFDdEM7SUFDRjtFQUFDO0lBQUFaLEdBQUE7SUFBQUMsS0FBQSxFQUVELFNBQUFtSCxpQkFBaUJDLFNBQVMsRUFBZ0I7TUFBQSxJQUFkQyxRQUFRLEdBQUFDLFNBQUEsQ0FBQUMsTUFBQSxRQUFBRCxTQUFBLFFBQUFFLFNBQUEsR0FBQUYsU0FBQSxNQUFHLENBQUM7TUFDdEMsSUFBTTFFLE1BQU0sR0FBRyxJQUFJLENBQUNILFlBQVksQ0FBQyxDQUFDO01BQ2xDRyxNQUFNLENBQUM0RCxFQUFFLEdBQUcsa0JBQWtCO01BQzlCNUQsTUFBTSxDQUFDK0IsSUFBSSxHQUFHLFFBQVE7TUFDdEIvQixNQUFNLENBQUM2RCxTQUFTLEdBQ2Qsd0VBQXdFO01BQzFFLElBQUksQ0FBQ2dCLFlBQVksQ0FBQzdFLE1BQU0sQ0FBQyxDQUFDLENBQUM7O01BRTNCcEIsMERBQVcsQ0FBQzRGLFNBQVMsRUFBRXhFLE1BQU0sRUFBRXlFLFFBQVEsQ0FBQztNQUN4QyxPQUFPekUsTUFBTTtJQUNmO0VBQUM7SUFBQTdDLEdBQUE7SUFBQUMsS0FBQSxFQUVELFNBQUEwSCxXQUFXQyxVQUFVLEVBQUU7TUFBQSxJQUFBQyxNQUFBO01BQ3JCLElBQUksQ0FBQ0QsVUFBVSxFQUFFO1FBQ2ZBLFVBQVUsR0FBR3RILFFBQVEsQ0FBQ2dGLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQztNQUMxRDtNQUNBLElBQUlzQyxVQUFVLEVBQUU7UUFDZCxJQUFNakYsS0FBSyxHQUFHLDZDQUE2QztRQUMzRGlGLFVBQVUsQ0FBQ2hFLFNBQVMsR0FBR3pCLDBEQUFhO1FBQ3BDeUYsVUFBVSxDQUFDakIsWUFBWSxDQUFDLFlBQVksRUFBRWhFLEtBQUssQ0FBQztRQUM1Q2lGLFVBQVUsQ0FBQ2pCLFlBQVksQ0FBQyxPQUFPLEVBQUVoRSxLQUFLLENBQUM7UUFDdkNpRixVQUFVLENBQUM1RSxPQUFPLEdBQUcsWUFBTTtVQUN6QjZFLE1BQUksQ0FBQ3hGLEtBQUssQ0FBQ3lGLElBQUksQ0FBQyxjQUFjLENBQUM7UUFDakMsQ0FBQztRQUNERixVQUFVLENBQUNqSCxTQUFTLENBQUNDLEdBQUcsQ0FBQyxRQUFRLENBQUM7TUFDcEM7SUFDRjtFQUFDO0lBQUFaLEdBQUE7SUFBQUMsS0FBQSxFQUVELFNBQUF5SCxhQUFhRSxVQUFVLEVBQUU7TUFBQSxJQUFBRyxNQUFBO01BQ3ZCLElBQUksQ0FBQ0gsVUFBVSxFQUFFO1FBQ2ZBLFVBQVUsR0FBR3RILFFBQVEsQ0FBQ2dGLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQztNQUMxRDtNQUNBLElBQUlzQyxVQUFVLEVBQUU7UUFDZEEsVUFBVSxDQUFDaEUsU0FBUyxHQUFHMUIsd0RBQVc7UUFDbEMwRixVQUFVLENBQUNqQixZQUFZLENBQ3JCLFlBQVksRUFDWixzQ0FDRixDQUFDO1FBQ0RpQixVQUFVLENBQUNqQixZQUFZLENBQUMsT0FBTyxFQUFFLGdDQUFnQyxDQUFDO1FBQ2xFaUIsVUFBVSxDQUFDNUUsT0FBTyxHQUFHLFlBQU07VUFDekIrRSxNQUFJLENBQUMxRixLQUFLLENBQUN5RixJQUFJLENBQUMsWUFBWSxDQUFDO1FBQy9CLENBQUM7UUFDREYsVUFBVSxDQUFDakgsU0FBUyxDQUFDRyxNQUFNLENBQUMsUUFBUSxDQUFDO01BQ3ZDO0lBQ0Y7RUFBQztJQUFBZCxHQUFBO0lBQUFDLEtBQUEsRUFFRCxTQUFBK0gsa0JBQUEsRUFBb0I7TUFDbEIsSUFBTUosVUFBVSxHQUFHdEgsUUFBUSxDQUFDZ0YsY0FBYyxDQUFDLGtCQUFrQixDQUFDO01BQzlELElBQUlzQyxVQUFVLEVBQUU7UUFDZEEsVUFBVSxDQUFDakgsU0FBUyxDQUFDQyxHQUFHLENBQUMsVUFBVSxDQUFDO1FBQ3BDO1FBQ0EsSUFBSSxDQUFDZ0gsVUFBVSxDQUFDakgsU0FBUyxDQUFDbUUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1VBQzVDOEMsVUFBVSxDQUFDSyxRQUFRLEdBQUcsSUFBSTtRQUM1QjtNQUNGO0lBQ0Y7RUFBQztJQUFBakksR0FBQTtJQUFBQyxLQUFBLEVBRUQsU0FBQWlJLGlCQUFBLEVBQW1CO01BQ2pCLElBQU1OLFVBQVUsR0FBR3RILFFBQVEsQ0FBQ2dGLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQztNQUM5RCxJQUFJc0MsVUFBVSxFQUFFO1FBQ2RBLFVBQVUsQ0FBQ2pILFNBQVMsQ0FBQ0csTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUN2QzhHLFVBQVUsQ0FBQ0ssUUFBUSxHQUFHLEtBQUs7TUFDN0I7SUFDRjtFQUFDO0VBQUEsT0FBQTdGLFlBQUE7QUFBQSxLQUdIO0FBM1BpQztBQTRQMUIsSUFBTStGLFlBQVksR0FBRyxJQUFJL0YsWUFBWSxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDNVF2QyxJQUFNNEIsTUFBTSxHQUFHO0VBQ3BCb0UsWUFBWSxFQUFFQyx3QkFBMEI7RUFDeENHLFlBQVksRUFBRUgsdUJBQTBCSTtBQUMxQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUNIaUM7QUFFbEMsaUVBQWUsSUFBSUMsbUNBQVksQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDRkk7QUFDc0I7QUFFM0QsSUFBTUMsYUFBYSxHQUFHLG9CQUFvQjtBQUMxQyxJQUFNQyxxQkFBcUIsR0FBRywyQkFBMkI7QUFDekQsSUFBTUMsc0JBQXNCLEdBQUcsNEJBQTRCO0FBQzNELElBQU1DLFdBQVcsR0FBRyxrQkFBa0I7QUFDdEMsSUFBTUMsbUJBQW1CLEdBQUcseUJBQXlCO0FBQ3JELElBQU1DLG9CQUFvQixHQUFHLDBCQUEwQjtBQUFDLElBRW5DQyxXQUFXO0VBQUEsU0FBQUEsWUFBQTtJQUFBbkosZUFBQSxPQUFBbUosV0FBQTtFQUFBO0VBQUFsSixZQUFBLENBQUFrSixXQUFBO0lBQUFqSixHQUFBO0lBQUFDLEtBQUEsRUFDOUIsU0FBQWlKLEtBQUEsRUFBYztNQUNaO01BQ0EsSUFBSSxDQUFDQywwQkFBMEIsQ0FBQ3hILCtEQUFtQixDQUFDVSxLQUFLLENBQUM7TUFDMUQ7SUFDRjtFQUFDO0lBQUFyQyxHQUFBO0lBQUFDLEtBQUEsRUFFRCxTQUFBbUosUUFBQSxFQUFpQjtNQUNmO01BQ0E3RixNQUFNLENBQUM4RixtQkFBbUIsQ0FDeEIsbUJBQW1CLEVBQ25CLElBQUksQ0FBQ0MsMkJBQ1AsQ0FBQztJQUNIO0VBQUM7SUFBQXRKLEdBQUE7SUFBQUMsS0FBQSxFQUVELFNBQUFzSixlQUFzQkMsT0FBTyxFQUFFQyxJQUFJLEVBQUU7TUFDbkNELE9BQU8sQ0FBQ0UsS0FBSyxDQUFDLENBQUM7O01BRWY7TUFDQSxJQUFNQyxhQUFhLEdBQUcsY0FBYztNQUNwQyxJQUFNQyxNQUFNLEdBQUdILElBQUksQ0FBQ0ksS0FBSyxDQUFDRixhQUFhLENBQUMsQ0FBQ0csTUFBTSxDQUFDQyxPQUFPLENBQUM7O01BRXhEO01BQ0EsSUFBTUMsU0FBUyxHQUFHLEVBQUU7TUFDcEIsS0FBSyxJQUFJQyxFQUFDLEdBQUcsQ0FBQyxFQUFFQSxFQUFDLEdBQUdMLE1BQU0sQ0FBQ3BDLE1BQU0sRUFBRXlDLEVBQUMsSUFBSSxDQUFDLEVBQUU7UUFDekMsSUFBTUMsUUFBUSxHQUFHTixNQUFNLENBQUNLLEVBQUMsQ0FBQyxJQUFJTCxNQUFNLENBQUNLLEVBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbERELFNBQVMsQ0FBQ0csSUFBSSxDQUFDRCxRQUFRLENBQUM7TUFDMUI7TUFFQSxJQUFJRCxDQUFDLEdBQUcsQ0FBQztNQUVULElBQU1HLFlBQVksR0FBRyxTQUFmQSxZQUFZQSxDQUFBLEVBQVM7UUFDekIsSUFBSUgsQ0FBQyxHQUFHRCxTQUFTLENBQUN4QyxNQUFNLEVBQUU7VUFDeEI7VUFDQXlCLFdBQVcsQ0FBQ29CLGNBQWMsQ0FBQ2IsT0FBTyxFQUFFQSxPQUFPLENBQUN2SixLQUFLLEdBQUcrSixTQUFTLENBQUNDLENBQUMsRUFBRSxDQUFDLENBQUM7VUFDbkVLLHFCQUFxQixDQUFDRixZQUFZLENBQUM7UUFDckMsQ0FBQyxNQUFNO1VBQ0wxSSxvREFBUSxDQUFDNkksSUFBSSxDQUFDLGtCQUFrQixDQUFDO1FBQ25DO01BQ0YsQ0FBQztNQUVELElBQUlQLFNBQVMsQ0FBQ3hDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDeEI7UUFDQTRDLFlBQVksQ0FBQyxDQUFDO01BQ2hCLENBQUMsTUFBTTtRQUNMO1FBQ0FuQixXQUFXLENBQUNvQixjQUFjLENBQUNiLE9BQU8sRUFBRUMsSUFBSSxDQUFDO1FBQ3pDL0gsb0RBQVEsQ0FBQzZJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztNQUNuQztJQUNGO0VBQUM7SUFBQXZLLEdBQUE7SUFBQUMsS0FBQSxFQUVELFNBQUFvSyxlQUFzQmIsT0FBTyxFQUFFdkosS0FBSyxFQUFFO01BQ3BDLElBQUl1SyxTQUFTLEdBQUdoQixPQUFPLENBQUN2SixLQUFLO01BQzdCdUosT0FBTyxDQUFDdkosS0FBSyxHQUFHQSxLQUFLO01BQ3JCLElBQUl3SyxLQUFLLEdBQUcsSUFBSUMsS0FBSyxDQUFDLE9BQU8sRUFBRTtRQUFFQyxNQUFNLEVBQUVuQixPQUFPO1FBQUV4RCxPQUFPLEVBQUU7TUFBSyxDQUFDLENBQUM7TUFDbEU7TUFDQXlFLEtBQUssQ0FBQ0csU0FBUyxHQUFHLElBQUk7TUFDdEI7TUFDQSxJQUFJQyxPQUFPLEdBQUdyQixPQUFPLENBQUNzQixhQUFhO01BQ25DLElBQUlELE9BQU8sRUFBRTtRQUNYQSxPQUFPLENBQUNFLFFBQVEsQ0FBQ1AsU0FBUyxDQUFDO01BQzdCO01BQ0FoQixPQUFPLENBQUNyRCxhQUFhLENBQUNzRSxLQUFLLENBQUM7SUFDOUI7RUFBQztJQUFBekssR0FBQTtJQUFBQyxLQUFBLEVBRUQsU0FBQWtKLDJCQUFrQzlHLEtBQUssRUFBRTtNQUN2Q1gsb0RBQVEsQ0FBQ2MsRUFBRSxDQUFDbUcsYUFBYSxFQUFFLFlBQU07UUFDL0J0RyxLQUFLLENBQUN5RixJQUFJLENBQUNhLGFBQWEsQ0FBQztNQUMzQixDQUFDLENBQUM7TUFFRixDQUFDQyxxQkFBcUIsRUFBRUMsc0JBQXNCLENBQUMsQ0FBQ3BJLE9BQU8sQ0FBQyxVQUFDdUssU0FBUyxFQUFLO1FBQ3JFdEosb0RBQVEsQ0FBQ2MsRUFBRSxDQUFDd0ksU0FBUyxFQUFFLFVBQUNDLE1BQU0sRUFBSztVQUNqQyxJQUFJQSxNQUFNLEVBQUU7WUFDVjVJLEtBQUssQ0FBQ3lGLElBQUksQ0FBQW9ELGFBQUE7Y0FBR3RHLElBQUksRUFBRW9HO1lBQVMsR0FBS0MsTUFBTSxDQUFFLENBQUM7VUFDNUMsQ0FBQyxNQUFNO1lBQ0x6RixPQUFPLENBQUMyRixJQUFJLGFBQUF6RixNQUFBLENBQWFzRixTQUFTLHNCQUFtQixDQUFDO1VBQ3hEO1FBQ0YsQ0FBQyxDQUFDO01BQ0osQ0FBQyxDQUFDO01BRUYsQ0FBQ2xDLFdBQVcsRUFBRUMsbUJBQW1CLEVBQUVDLG9CQUFvQixDQUFDLENBQUN2SSxPQUFPLENBQzlELFVBQUN1SyxTQUFTLEVBQUs7UUFDYnRKLG9EQUFRLENBQUNjLEVBQUUsQ0FBQ3dJLFNBQVMsRUFBRSxZQUFNO1VBQzNCM0ksS0FBSyxDQUFDeUYsSUFBSSxDQUFDa0QsU0FBUyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQztNQUNKLENBQ0YsQ0FBQztJQUNIO0VBQUM7RUFBQSxPQUFBL0IsV0FBQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0FDakdJLFNBQVNtQyxtQkFBbUJBLENBQUNDLFVBQVUsRUFBRTtFQUM5QyxJQUFJLE9BQU9BLFVBQVUsS0FBSyxRQUFRLEVBQUU7SUFDbEMsT0FBT0EsVUFBVTtFQUNuQjtFQUVBLE9BQU9DLE1BQU0sQ0FBQ0MsSUFBSSxDQUFDRixVQUFVLENBQUMsQ0FDM0JHLEdBQUcsQ0FBQyxVQUFDeEwsR0FBRztJQUFBLFVBQUEwRixNQUFBLENBQVExRixHQUFHLE9BQUEwRixNQUFBLENBQUkwRixtQkFBbUIsQ0FBQ0MsVUFBVSxDQUFDckwsR0FBRyxDQUFDLENBQUM7RUFBQSxDQUFFLENBQUMsQ0FDOUR5TCxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ2Q7QUFFQSxJQUFNQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUM7O0FBRWQsSUFBTUMsTUFBTSxHQUFHO0VBQ3BCQyxLQUFLLEVBQUUsU0FBQUEsTUFBQSxFQUFhO0lBQ2xCLElBQUlGLEtBQUssRUFBRTtNQUFBLElBQUFHLFFBQUE7TUFBQSxTQUFBQyxJQUFBLEdBQUF2RSxTQUFBLENBQUFDLE1BQUEsRUFERnVFLElBQUksT0FBQUMsS0FBQSxDQUFBRixJQUFBLEdBQUFHLElBQUEsTUFBQUEsSUFBQSxHQUFBSCxJQUFBLEVBQUFHLElBQUE7UUFBSkYsSUFBSSxDQUFBRSxJQUFBLElBQUExRSxTQUFBLENBQUEwRSxJQUFBO01BQUE7TUFFWCxDQUFBSixRQUFBLEdBQUFyRyxPQUFPLEVBQUNlLEdBQUcsQ0FBQTJGLEtBQUEsQ0FBQUwsUUFBQSxHQUFDLFFBQVEsRUFBQW5HLE1BQUEsQ0FBS3FHLElBQUksRUFBQztJQUNoQztFQUNGLENBQUM7RUFDREksSUFBSSxFQUFFLFNBQUFBLEtBQUEsRUFBYTtJQUFBLElBQUFDLFNBQUE7SUFBQSxTQUFBQyxLQUFBLEdBQUE5RSxTQUFBLENBQUFDLE1BQUEsRUFBVHVFLElBQUksT0FBQUMsS0FBQSxDQUFBSyxLQUFBLEdBQUFDLEtBQUEsTUFBQUEsS0FBQSxHQUFBRCxLQUFBLEVBQUFDLEtBQUE7TUFBSlAsSUFBSSxDQUFBTyxLQUFBLElBQUEvRSxTQUFBLENBQUErRSxLQUFBO0lBQUE7SUFDWixDQUFBRixTQUFBLEdBQUE1RyxPQUFPLEVBQUNlLEdBQUcsQ0FBQTJGLEtBQUEsQ0FBQUUsU0FBQSxHQUFDLE9BQU8sRUFBQTFHLE1BQUEsQ0FBS3FHLElBQUksRUFBQztFQUMvQixDQUFDO0VBQ0R0RyxLQUFLLEVBQUUsU0FBQUEsTUFBQSxFQUFhO0lBQUEsSUFBQThHLFNBQUE7SUFBQSxTQUFBQyxLQUFBLEdBQUFqRixTQUFBLENBQUFDLE1BQUEsRUFBVHVFLElBQUksT0FBQUMsS0FBQSxDQUFBUSxLQUFBLEdBQUFDLEtBQUEsTUFBQUEsS0FBQSxHQUFBRCxLQUFBLEVBQUFDLEtBQUE7TUFBSlYsSUFBSSxDQUFBVSxLQUFBLElBQUFsRixTQUFBLENBQUFrRixLQUFBO0lBQUE7SUFDYixDQUFBRixTQUFBLEdBQUEvRyxPQUFPLEVBQUNDLEtBQUssQ0FBQXlHLEtBQUEsQ0FBQUssU0FBQSxHQUFDLFFBQVEsRUFBQTdHLE1BQUEsQ0FBS3FHLElBQUksRUFBQztFQUNsQztBQUNGLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeEJrQztBQUN3QjtBQUNNOztBQUVqRTtBQUNBO0FBQ0E7QUFGQSxJQUdNcEssbUJBQW1CLGdCQUFBNUIsWUFBQSxDQUN2QixTQUFBNEIsb0JBQUEsRUFBYztFQUFBN0IsZUFBQSxPQUFBNkIsbUJBQUE7RUFDWixJQUFJLENBQUNVLEtBQUssR0FBR3FLLGlEQUFTLENBQUNDLG9FQUFPLENBQUMsQ0FBQ0MsWUFBWSxDQUFDLFVBQUNDLEtBQUssRUFBSztJQUN0RCxJQUFJQSxLQUFLLENBQUNDLE9BQU8sRUFBRTtNQUNqQixJQUFNQyxTQUFTLEdBQUdGLEtBQUssQ0FBQ0csT0FBTyxHQUMzQjVCLHNFQUFtQixDQUFDeUIsS0FBSyxDQUFDRyxPQUFPLENBQUMvTSxLQUFLLENBQUMsR0FDeEMsS0FBSztNQUNULElBQU1nTixPQUFPLEdBQUc3QixzRUFBbUIsQ0FBQ3lCLEtBQUssQ0FBQzVNLEtBQUssQ0FBQztNQUNoRDBMLHFEQUFNLENBQUNDLEtBQUssc0NBQUFsRyxNQUFBLENBQzJCcUgsU0FBUyxVQUFBckgsTUFBQSxDQUFPdUgsT0FBTyxZQUFBdkgsTUFBQSxDQUFTbUgsS0FBSyxDQUFDcEMsS0FBSyxDQUFDN0YsSUFBSSxDQUN2RixDQUFDO0lBQ0g7RUFDRixDQUFDLENBQUM7RUFDRixJQUFJLENBQUN2QyxLQUFLLENBQUM2SyxLQUFLLENBQUMsQ0FBQztBQUNwQixDQUFDLEdBR0g7QUFDQSxpRUFBZSxJQUFJdkwsbUJBQW1CLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3pCSztBQUV0QyxTQUFTd0wsY0FBY0EsQ0FBQSxFQUFHO0VBQy9CLE9BQ0UsZ0VBQWdFLENBQUNDLElBQUksQ0FDbkVDLFNBQVMsQ0FBQ0MsU0FDWixDQUFDLElBQUkvSixNQUFNLENBQUNDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDK0osT0FBTztBQUV4RDs7QUFFQTtBQUNPLFNBQVMvTCxZQUFZQSxDQUFBLEVBQUc7RUFDN0IsSUFBSWdNLGtCQUFrQixHQUFHLElBQUk7RUFFN0IsSUFBSTtJQUNGQSxrQkFBa0IsR0FBR0MsWUFBWSxDQUFDQyxPQUFPLENBQUMsb0JBQW9CLENBQUM7RUFDakUsQ0FBQyxDQUFDLE9BQU8xSSxDQUFDLEVBQUU7SUFDVlEsT0FBTyxDQUFDMkYsSUFBSSxDQUFDLGlDQUFpQyxFQUFFbkcsQ0FBQyxDQUFDO0VBQ3BEO0VBRUEsSUFBSTJJLGFBQWEsR0FBRyxLQUFLO0VBQ3pCLElBQUlILGtCQUFrQixFQUFFO0lBQ3RCRyxhQUFhLEdBQUdILGtCQUFrQixLQUFLLFFBQVE7RUFDakQ7O0VBRUE7RUFDQSxPQUFPTCxjQUFjLENBQUMsQ0FBQyxJQUFJUSxhQUFhO0FBQzFDO0FBRU8sU0FBU3BNLGNBQWNBLENBQUEsRUFBRztFQUMvQmtNLFlBQVksQ0FBQ0csT0FBTyxDQUFDLG9CQUFvQixFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7O0VBRXZELElBQU1wRSxPQUFPLEdBQUdsSixRQUFRLENBQUN5RCxlQUFlO0VBQ3hDeUYsT0FBTyxDQUFDN0ksU0FBUyxDQUFDRyxNQUFNLENBQUMsYUFBYSxDQUFDO0VBQ3ZDMEksT0FBTyxDQUFDN0ksU0FBUyxDQUFDQyxHQUFHLENBQUMsY0FBYyxDQUFDO0VBRXJDaU4sZ0JBQWdCLENBQUMsQ0FBQztBQUNwQjtBQUVPLFNBQVN2TSxlQUFlQSxDQUFBLEVBQUc7RUFDaENtTSxZQUFZLENBQUNHLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDOztFQUV0RCxJQUFNcEUsT0FBTyxHQUFHbEosUUFBUSxDQUFDeUQsZUFBZTtFQUN4Q3lGLE9BQU8sQ0FBQzdJLFNBQVMsQ0FBQ0csTUFBTSxDQUFDLGNBQWMsQ0FBQztFQUN4QzBJLE9BQU8sQ0FBQzdJLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLGFBQWEsQ0FBQztFQUVwQ2tOLGdCQUFnQixDQUFDLENBQUM7QUFDcEI7QUFFQSxTQUFTRCxnQkFBZ0JBLENBQUEsRUFBRztFQUMxQjtFQUNBLElBQU14RyxTQUFTLEdBQUcvRyxRQUFRLENBQUNnRixjQUFjLENBQUMsaUNBQWlDLENBQUM7RUFDNUUsSUFBTXNDLFVBQVUsR0FBR3RILFFBQVEsQ0FBQ2dGLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQztFQUM5RCxJQUFJK0IsU0FBUyxJQUFJTyxVQUFVLEVBQUU7SUFDM0JuRywwREFBVyxDQUFDNEYsU0FBUyxFQUFFTyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7RUFDeEM7QUFDRjtBQUVBLFNBQVNrRyxnQkFBZ0JBLENBQUEsRUFBRztFQUMxQjtFQUNBLElBQU1sRyxVQUFVLEdBQUd0SCxRQUFRLENBQUNnRixjQUFjLENBQUMsa0JBQWtCLENBQUM7RUFDOUQsSUFBSXNDLFVBQVUsRUFBRTtJQUNkbkcsMERBQVcsQ0FBQ25CLFFBQVEsQ0FBQ3NHLElBQUksRUFBRWdCLFVBQVUsQ0FBQztFQUN4QztBQUNGO0FBRU8sU0FBU21HLGlCQUFpQkEsQ0FBQSxFQUFHO0VBQ2xDLElBQU1DLGdCQUFnQixHQUNwQixTQUFTLENBQUNaLElBQUksQ0FBQ0MsU0FBUyxDQUFDQyxTQUFTLENBQUMsSUFBSSxTQUFTLENBQUNGLElBQUksQ0FBQ0MsU0FBUyxDQUFDQyxTQUFTLENBQUM7RUFDNUUsSUFBTTlELE9BQU8sR0FBR2xKLFFBQVEsQ0FBQ3lELGVBQWU7RUFFeEMsSUFBSWlLLGdCQUFnQixFQUFFO0lBQ3BCeEUsT0FBTyxDQUFDN0ksU0FBUyxDQUFDQyxHQUFHLENBQUMsaUJBQWlCLENBQUM7RUFDMUM7RUFFQXFOLGNBQWMsQ0FBQ3pFLE9BQU8sQ0FBQztFQUN2QjBFLFlBQVksQ0FBQzFFLE9BQU8sQ0FBQztBQUN2QjtBQUVPLFNBQVN5RSxjQUFjQSxDQUFDekUsT0FBTyxFQUFFO0VBQ3RDLElBQUkyRCxjQUFjLENBQUMsQ0FBQyxFQUFFO0lBQ3BCM0QsT0FBTyxDQUFDN0ksU0FBUyxDQUFDQyxHQUFHLENBQUMsZUFBZSxDQUFDO0VBQ3hDO0FBQ0Y7QUFFTyxTQUFTc04sWUFBWUEsQ0FBQzFFLE9BQU8sRUFBRTtFQUNwQyxJQUFJaEksWUFBWSxDQUFDLENBQUMsRUFBRTtJQUNsQmdJLE9BQU8sQ0FBQzdJLFNBQVMsQ0FBQ0csTUFBTSxDQUFDLGNBQWMsQ0FBQztJQUN4QzBJLE9BQU8sQ0FBQzdJLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLGFBQWEsQ0FBQztFQUN0QyxDQUFDLE1BQU07SUFDTDRJLE9BQU8sQ0FBQzdJLFNBQVMsQ0FBQ0csTUFBTSxDQUFDLGFBQWEsQ0FBQztJQUN2QzBJLE9BQU8sQ0FBQzdJLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLGNBQWMsQ0FBQztFQUN2QztBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNPLFNBQVN1TixRQUFRQSxDQUFBLEVBQUc7RUFDekIsSUFBSTNNLFlBQVksQ0FBQyxDQUFDLEVBQUU7SUFDbEJGLGVBQWUsQ0FBQyxDQUFDO0VBQ25CLENBQUMsTUFBTTtJQUNMQyxjQUFjLENBQUMsQ0FBQztFQUNsQjtBQUNGOzs7Ozs7VUN4R0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRDs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7K0NDQ0EscUpBQUE2TSxtQkFBQSxZQUFBQSxvQkFBQSxXQUFBQyxPQUFBLFNBQUFBLE9BQUEsT0FBQUMsRUFBQSxHQUFBaEQsTUFBQSxDQUFBaUQsU0FBQSxFQUFBQyxNQUFBLEdBQUFGLEVBQUEsQ0FBQW5MLGNBQUEsRUFBQXNMLGNBQUEsR0FBQW5ELE1BQUEsQ0FBQW1ELGNBQUEsY0FBQUMsR0FBQSxFQUFBMU8sR0FBQSxFQUFBMk8sSUFBQSxJQUFBRCxHQUFBLENBQUExTyxHQUFBLElBQUEyTyxJQUFBLENBQUExTyxLQUFBLEtBQUEyTyxPQUFBLHdCQUFBQyxNQUFBLEdBQUFBLE1BQUEsT0FBQUMsY0FBQSxHQUFBRixPQUFBLENBQUFHLFFBQUEsa0JBQUFDLG1CQUFBLEdBQUFKLE9BQUEsQ0FBQUssYUFBQSx1QkFBQUMsaUJBQUEsR0FBQU4sT0FBQSxDQUFBTyxXQUFBLDhCQUFBQyxPQUFBVixHQUFBLEVBQUExTyxHQUFBLEVBQUFDLEtBQUEsV0FBQXFMLE1BQUEsQ0FBQW1ELGNBQUEsQ0FBQUMsR0FBQSxFQUFBMU8sR0FBQSxJQUFBQyxLQUFBLEVBQUFBLEtBQUEsRUFBQW9QLFVBQUEsTUFBQUMsWUFBQSxNQUFBQyxRQUFBLFNBQUFiLEdBQUEsQ0FBQTFPLEdBQUEsV0FBQW9QLE1BQUEsbUJBQUFySyxHQUFBLElBQUFxSyxNQUFBLFlBQUFBLE9BQUFWLEdBQUEsRUFBQTFPLEdBQUEsRUFBQUMsS0FBQSxXQUFBeU8sR0FBQSxDQUFBMU8sR0FBQSxJQUFBQyxLQUFBLGdCQUFBdVAsS0FBQUMsT0FBQSxFQUFBQyxPQUFBLEVBQUFDLElBQUEsRUFBQUMsV0FBQSxRQUFBQyxjQUFBLEdBQUFILE9BQUEsSUFBQUEsT0FBQSxDQUFBbkIsU0FBQSxZQUFBdUIsU0FBQSxHQUFBSixPQUFBLEdBQUFJLFNBQUEsRUFBQUMsU0FBQSxHQUFBekUsTUFBQSxDQUFBMEUsTUFBQSxDQUFBSCxjQUFBLENBQUF0QixTQUFBLEdBQUEwQixPQUFBLE9BQUFDLE9BQUEsQ0FBQU4sV0FBQSxnQkFBQW5CLGNBQUEsQ0FBQXNCLFNBQUEsZUFBQTlQLEtBQUEsRUFBQWtRLGdCQUFBLENBQUFWLE9BQUEsRUFBQUUsSUFBQSxFQUFBTSxPQUFBLE1BQUFGLFNBQUEsYUFBQUssU0FBQUMsRUFBQSxFQUFBM0IsR0FBQSxFQUFBNEIsR0FBQSxtQkFBQTFMLElBQUEsWUFBQTBMLEdBQUEsRUFBQUQsRUFBQSxDQUFBRSxJQUFBLENBQUE3QixHQUFBLEVBQUE0QixHQUFBLGNBQUF2TCxHQUFBLGFBQUFILElBQUEsV0FBQTBMLEdBQUEsRUFBQXZMLEdBQUEsUUFBQXNKLE9BQUEsQ0FBQW1CLElBQUEsR0FBQUEsSUFBQSxNQUFBZ0IsZ0JBQUEsZ0JBQUFWLFVBQUEsY0FBQVcsa0JBQUEsY0FBQUMsMkJBQUEsU0FBQUMsaUJBQUEsT0FBQXZCLE1BQUEsQ0FBQXVCLGlCQUFBLEVBQUE3QixjQUFBLHFDQUFBOEIsUUFBQSxHQUFBdEYsTUFBQSxDQUFBdUYsY0FBQSxFQUFBQyx1QkFBQSxHQUFBRixRQUFBLElBQUFBLFFBQUEsQ0FBQUEsUUFBQSxDQUFBRyxNQUFBLFFBQUFELHVCQUFBLElBQUFBLHVCQUFBLEtBQUF4QyxFQUFBLElBQUFFLE1BQUEsQ0FBQStCLElBQUEsQ0FBQU8sdUJBQUEsRUFBQWhDLGNBQUEsTUFBQTZCLGlCQUFBLEdBQUFHLHVCQUFBLE9BQUFFLEVBQUEsR0FBQU4sMEJBQUEsQ0FBQW5DLFNBQUEsR0FBQXVCLFNBQUEsQ0FBQXZCLFNBQUEsR0FBQWpELE1BQUEsQ0FBQTBFLE1BQUEsQ0FBQVcsaUJBQUEsWUFBQU0sc0JBQUExQyxTQUFBLGdDQUFBOU4sT0FBQSxXQUFBeVEsTUFBQSxJQUFBOUIsTUFBQSxDQUFBYixTQUFBLEVBQUEyQyxNQUFBLFlBQUFaLEdBQUEsZ0JBQUFhLE9BQUEsQ0FBQUQsTUFBQSxFQUFBWixHQUFBLHNCQUFBYyxjQUFBckIsU0FBQSxFQUFBc0IsV0FBQSxhQUFBQyxPQUFBSixNQUFBLEVBQUFaLEdBQUEsRUFBQWlCLE9BQUEsRUFBQUMsTUFBQSxRQUFBQyxNQUFBLEdBQUFyQixRQUFBLENBQUFMLFNBQUEsQ0FBQW1CLE1BQUEsR0FBQW5CLFNBQUEsRUFBQU8sR0FBQSxtQkFBQW1CLE1BQUEsQ0FBQTdNLElBQUEsUUFBQThNLE1BQUEsR0FBQUQsTUFBQSxDQUFBbkIsR0FBQSxFQUFBclEsS0FBQSxHQUFBeVIsTUFBQSxDQUFBelIsS0FBQSxTQUFBQSxLQUFBLGdCQUFBMFIsT0FBQSxDQUFBMVIsS0FBQSxLQUFBdU8sTUFBQSxDQUFBK0IsSUFBQSxDQUFBdFEsS0FBQSxlQUFBb1IsV0FBQSxDQUFBRSxPQUFBLENBQUF0UixLQUFBLENBQUEyUixPQUFBLEVBQUFDLElBQUEsV0FBQTVSLEtBQUEsSUFBQXFSLE1BQUEsU0FBQXJSLEtBQUEsRUFBQXNSLE9BQUEsRUFBQUMsTUFBQSxnQkFBQXpNLEdBQUEsSUFBQXVNLE1BQUEsVUFBQXZNLEdBQUEsRUFBQXdNLE9BQUEsRUFBQUMsTUFBQSxRQUFBSCxXQUFBLENBQUFFLE9BQUEsQ0FBQXRSLEtBQUEsRUFBQTRSLElBQUEsV0FBQUMsU0FBQSxJQUFBSixNQUFBLENBQUF6UixLQUFBLEdBQUE2UixTQUFBLEVBQUFQLE9BQUEsQ0FBQUcsTUFBQSxnQkFBQWpNLEtBQUEsV0FBQTZMLE1BQUEsVUFBQTdMLEtBQUEsRUFBQThMLE9BQUEsRUFBQUMsTUFBQSxTQUFBQSxNQUFBLENBQUFDLE1BQUEsQ0FBQW5CLEdBQUEsU0FBQXlCLGVBQUEsRUFBQXRELGNBQUEsb0JBQUF4TyxLQUFBLFdBQUFBLE1BQUFpUixNQUFBLEVBQUFaLEdBQUEsYUFBQTBCLDJCQUFBLGVBQUFYLFdBQUEsV0FBQUUsT0FBQSxFQUFBQyxNQUFBLElBQUFGLE1BQUEsQ0FBQUosTUFBQSxFQUFBWixHQUFBLEVBQUFpQixPQUFBLEVBQUFDLE1BQUEsZ0JBQUFPLGVBQUEsR0FBQUEsZUFBQSxHQUFBQSxlQUFBLENBQUFGLElBQUEsQ0FBQUcsMEJBQUEsRUFBQUEsMEJBQUEsSUFBQUEsMEJBQUEscUJBQUE3QixpQkFBQVYsT0FBQSxFQUFBRSxJQUFBLEVBQUFNLE9BQUEsUUFBQXBELEtBQUEsc0NBQUFxRSxNQUFBLEVBQUFaLEdBQUEsd0JBQUF6RCxLQUFBLFlBQUFvRixLQUFBLHNEQUFBcEYsS0FBQSxvQkFBQXFFLE1BQUEsUUFBQVosR0FBQSxXQUFBclEsS0FBQSxVQUFBeUUsSUFBQSxlQUFBdUwsT0FBQSxDQUFBaUIsTUFBQSxHQUFBQSxNQUFBLEVBQUFqQixPQUFBLENBQUFLLEdBQUEsR0FBQUEsR0FBQSxVQUFBNEIsUUFBQSxHQUFBakMsT0FBQSxDQUFBaUMsUUFBQSxNQUFBQSxRQUFBLFFBQUFDLGNBQUEsR0FBQUMsbUJBQUEsQ0FBQUYsUUFBQSxFQUFBakMsT0FBQSxPQUFBa0MsY0FBQSxRQUFBQSxjQUFBLEtBQUEzQixnQkFBQSxtQkFBQTJCLGNBQUEscUJBQUFsQyxPQUFBLENBQUFpQixNQUFBLEVBQUFqQixPQUFBLENBQUFvQyxJQUFBLEdBQUFwQyxPQUFBLENBQUFxQyxLQUFBLEdBQUFyQyxPQUFBLENBQUFLLEdBQUEsc0JBQUFMLE9BQUEsQ0FBQWlCLE1BQUEsNkJBQUFyRSxLQUFBLFFBQUFBLEtBQUEsZ0JBQUFvRCxPQUFBLENBQUFLLEdBQUEsRUFBQUwsT0FBQSxDQUFBc0MsaUJBQUEsQ0FBQXRDLE9BQUEsQ0FBQUssR0FBQSx1QkFBQUwsT0FBQSxDQUFBaUIsTUFBQSxJQUFBakIsT0FBQSxDQUFBdUMsTUFBQSxXQUFBdkMsT0FBQSxDQUFBSyxHQUFBLEdBQUF6RCxLQUFBLG9CQUFBNEUsTUFBQSxHQUFBckIsUUFBQSxDQUFBWCxPQUFBLEVBQUFFLElBQUEsRUFBQU0sT0FBQSxvQkFBQXdCLE1BQUEsQ0FBQTdNLElBQUEsUUFBQWlJLEtBQUEsR0FBQW9ELE9BQUEsQ0FBQXZMLElBQUEsbUNBQUErTSxNQUFBLENBQUFuQixHQUFBLEtBQUFFLGdCQUFBLHFCQUFBdlEsS0FBQSxFQUFBd1IsTUFBQSxDQUFBbkIsR0FBQSxFQUFBNUwsSUFBQSxFQUFBdUwsT0FBQSxDQUFBdkwsSUFBQSxrQkFBQStNLE1BQUEsQ0FBQTdNLElBQUEsS0FBQWlJLEtBQUEsZ0JBQUFvRCxPQUFBLENBQUFpQixNQUFBLFlBQUFqQixPQUFBLENBQUFLLEdBQUEsR0FBQW1CLE1BQUEsQ0FBQW5CLEdBQUEsbUJBQUE4QixvQkFBQUYsUUFBQSxFQUFBakMsT0FBQSxRQUFBd0MsVUFBQSxHQUFBeEMsT0FBQSxDQUFBaUIsTUFBQSxFQUFBQSxNQUFBLEdBQUFnQixRQUFBLENBQUFuRCxRQUFBLENBQUEwRCxVQUFBLE9BQUFoTCxTQUFBLEtBQUF5SixNQUFBLFNBQUFqQixPQUFBLENBQUFpQyxRQUFBLHFCQUFBTyxVQUFBLElBQUFQLFFBQUEsQ0FBQW5ELFFBQUEsZUFBQWtCLE9BQUEsQ0FBQWlCLE1BQUEsYUFBQWpCLE9BQUEsQ0FBQUssR0FBQSxHQUFBN0ksU0FBQSxFQUFBMkssbUJBQUEsQ0FBQUYsUUFBQSxFQUFBakMsT0FBQSxlQUFBQSxPQUFBLENBQUFpQixNQUFBLGtCQUFBdUIsVUFBQSxLQUFBeEMsT0FBQSxDQUFBaUIsTUFBQSxZQUFBakIsT0FBQSxDQUFBSyxHQUFBLE9BQUFvQyxTQUFBLHVDQUFBRCxVQUFBLGlCQUFBakMsZ0JBQUEsTUFBQWlCLE1BQUEsR0FBQXJCLFFBQUEsQ0FBQWMsTUFBQSxFQUFBZ0IsUUFBQSxDQUFBbkQsUUFBQSxFQUFBa0IsT0FBQSxDQUFBSyxHQUFBLG1CQUFBbUIsTUFBQSxDQUFBN00sSUFBQSxTQUFBcUwsT0FBQSxDQUFBaUIsTUFBQSxZQUFBakIsT0FBQSxDQUFBSyxHQUFBLEdBQUFtQixNQUFBLENBQUFuQixHQUFBLEVBQUFMLE9BQUEsQ0FBQWlDLFFBQUEsU0FBQTFCLGdCQUFBLE1BQUFyRSxJQUFBLEdBQUFzRixNQUFBLENBQUFuQixHQUFBLFNBQUFuRSxJQUFBLEdBQUFBLElBQUEsQ0FBQXpILElBQUEsSUFBQXVMLE9BQUEsQ0FBQWlDLFFBQUEsQ0FBQVMsVUFBQSxJQUFBeEcsSUFBQSxDQUFBbE0sS0FBQSxFQUFBZ1EsT0FBQSxDQUFBMkMsSUFBQSxHQUFBVixRQUFBLENBQUFXLE9BQUEsZUFBQTVDLE9BQUEsQ0FBQWlCLE1BQUEsS0FBQWpCLE9BQUEsQ0FBQWlCLE1BQUEsV0FBQWpCLE9BQUEsQ0FBQUssR0FBQSxHQUFBN0ksU0FBQSxHQUFBd0ksT0FBQSxDQUFBaUMsUUFBQSxTQUFBMUIsZ0JBQUEsSUFBQXJFLElBQUEsSUFBQThELE9BQUEsQ0FBQWlCLE1BQUEsWUFBQWpCLE9BQUEsQ0FBQUssR0FBQSxPQUFBb0MsU0FBQSxzQ0FBQXpDLE9BQUEsQ0FBQWlDLFFBQUEsU0FBQTFCLGdCQUFBLGNBQUFzQyxhQUFBQyxJQUFBLFFBQUFDLEtBQUEsS0FBQUMsTUFBQSxFQUFBRixJQUFBLFlBQUFBLElBQUEsS0FBQUMsS0FBQSxDQUFBRSxRQUFBLEdBQUFILElBQUEsV0FBQUEsSUFBQSxLQUFBQyxLQUFBLENBQUFHLFVBQUEsR0FBQUosSUFBQSxLQUFBQyxLQUFBLENBQUFJLFFBQUEsR0FBQUwsSUFBQSxXQUFBTSxVQUFBLENBQUFsSixJQUFBLENBQUE2SSxLQUFBLGNBQUFNLGNBQUFOLEtBQUEsUUFBQXZCLE1BQUEsR0FBQXVCLEtBQUEsQ0FBQU8sVUFBQSxRQUFBOUIsTUFBQSxDQUFBN00sSUFBQSxvQkFBQTZNLE1BQUEsQ0FBQW5CLEdBQUEsRUFBQTBDLEtBQUEsQ0FBQU8sVUFBQSxHQUFBOUIsTUFBQSxhQUFBdkIsUUFBQU4sV0FBQSxTQUFBeUQsVUFBQSxNQUFBSixNQUFBLGFBQUFyRCxXQUFBLENBQUFuUCxPQUFBLENBQUFxUyxZQUFBLGNBQUFVLEtBQUEsaUJBQUF6QyxPQUFBMEMsUUFBQSxRQUFBQSxRQUFBLFdBQUFBLFFBQUEsUUFBQUMsY0FBQSxHQUFBRCxRQUFBLENBQUEzRSxjQUFBLE9BQUE0RSxjQUFBLFNBQUFBLGNBQUEsQ0FBQW5ELElBQUEsQ0FBQWtELFFBQUEsNEJBQUFBLFFBQUEsQ0FBQWIsSUFBQSxTQUFBYSxRQUFBLE9BQUFFLEtBQUEsQ0FBQUYsUUFBQSxDQUFBak0sTUFBQSxTQUFBeUMsQ0FBQSxPQUFBMkksSUFBQSxZQUFBQSxLQUFBLGFBQUEzSSxDQUFBLEdBQUF3SixRQUFBLENBQUFqTSxNQUFBLE9BQUFnSCxNQUFBLENBQUErQixJQUFBLENBQUFrRCxRQUFBLEVBQUF4SixDQUFBLFVBQUEySSxJQUFBLENBQUEzUyxLQUFBLEdBQUF3VCxRQUFBLENBQUF4SixDQUFBLEdBQUEySSxJQUFBLENBQUFsTyxJQUFBLE9BQUFrTyxJQUFBLFNBQUFBLElBQUEsQ0FBQTNTLEtBQUEsR0FBQXdILFNBQUEsRUFBQW1MLElBQUEsQ0FBQWxPLElBQUEsT0FBQWtPLElBQUEsWUFBQUEsSUFBQSxDQUFBQSxJQUFBLEdBQUFBLElBQUEsZ0JBQUFGLFNBQUEsQ0FBQWYsT0FBQSxDQUFBOEIsUUFBQSxrQ0FBQWhELGlCQUFBLENBQUFsQyxTQUFBLEdBQUFtQywwQkFBQSxFQUFBakMsY0FBQSxDQUFBdUMsRUFBQSxtQkFBQS9RLEtBQUEsRUFBQXlRLDBCQUFBLEVBQUFwQixZQUFBLFNBQUFiLGNBQUEsQ0FBQWlDLDBCQUFBLG1CQUFBelEsS0FBQSxFQUFBd1EsaUJBQUEsRUFBQW5CLFlBQUEsU0FBQW1CLGlCQUFBLENBQUFtRCxXQUFBLEdBQUF4RSxNQUFBLENBQUFzQiwwQkFBQSxFQUFBeEIsaUJBQUEsd0JBQUFiLE9BQUEsQ0FBQXdGLG1CQUFBLGFBQUFDLE1BQUEsUUFBQUMsSUFBQSx3QkFBQUQsTUFBQSxJQUFBQSxNQUFBLENBQUFFLFdBQUEsV0FBQUQsSUFBQSxLQUFBQSxJQUFBLEtBQUF0RCxpQkFBQSw2QkFBQXNELElBQUEsQ0FBQUgsV0FBQSxJQUFBRyxJQUFBLENBQUFFLElBQUEsT0FBQTVGLE9BQUEsQ0FBQTZGLElBQUEsYUFBQUosTUFBQSxXQUFBeEksTUFBQSxDQUFBNkksY0FBQSxHQUFBN0ksTUFBQSxDQUFBNkksY0FBQSxDQUFBTCxNQUFBLEVBQUFwRCwwQkFBQSxLQUFBb0QsTUFBQSxDQUFBTSxTQUFBLEdBQUExRCwwQkFBQSxFQUFBdEIsTUFBQSxDQUFBMEUsTUFBQSxFQUFBNUUsaUJBQUEseUJBQUE0RSxNQUFBLENBQUF2RixTQUFBLEdBQUFqRCxNQUFBLENBQUEwRSxNQUFBLENBQUFnQixFQUFBLEdBQUE4QyxNQUFBLEtBQUF6RixPQUFBLENBQUFnRyxLQUFBLGFBQUEvRCxHQUFBLGFBQUFzQixPQUFBLEVBQUF0QixHQUFBLE9BQUFXLHFCQUFBLENBQUFHLGFBQUEsQ0FBQTdDLFNBQUEsR0FBQWEsTUFBQSxDQUFBZ0MsYUFBQSxDQUFBN0MsU0FBQSxFQUFBUyxtQkFBQSxpQ0FBQVgsT0FBQSxDQUFBK0MsYUFBQSxHQUFBQSxhQUFBLEVBQUEvQyxPQUFBLENBQUFpRyxLQUFBLGFBQUE3RSxPQUFBLEVBQUFDLE9BQUEsRUFBQUMsSUFBQSxFQUFBQyxXQUFBLEVBQUF5QixXQUFBLGVBQUFBLFdBQUEsS0FBQUEsV0FBQSxHQUFBa0QsT0FBQSxPQUFBQyxJQUFBLE9BQUFwRCxhQUFBLENBQUE1QixJQUFBLENBQUFDLE9BQUEsRUFBQUMsT0FBQSxFQUFBQyxJQUFBLEVBQUFDLFdBQUEsR0FBQXlCLFdBQUEsVUFBQWhELE9BQUEsQ0FBQXdGLG1CQUFBLENBQUFuRSxPQUFBLElBQUE4RSxJQUFBLEdBQUFBLElBQUEsQ0FBQTVCLElBQUEsR0FBQWYsSUFBQSxXQUFBSCxNQUFBLFdBQUFBLE1BQUEsQ0FBQWhOLElBQUEsR0FBQWdOLE1BQUEsQ0FBQXpSLEtBQUEsR0FBQXVVLElBQUEsQ0FBQTVCLElBQUEsV0FBQTNCLHFCQUFBLENBQUFELEVBQUEsR0FBQTVCLE1BQUEsQ0FBQTRCLEVBQUEsRUFBQTlCLGlCQUFBLGdCQUFBRSxNQUFBLENBQUE0QixFQUFBLEVBQUFsQyxjQUFBLGlDQUFBTSxNQUFBLENBQUE0QixFQUFBLDZEQUFBM0MsT0FBQSxDQUFBOUMsSUFBQSxhQUFBa0osR0FBQSxRQUFBQyxNQUFBLEdBQUFwSixNQUFBLENBQUFtSixHQUFBLEdBQUFsSixJQUFBLGdCQUFBdkwsR0FBQSxJQUFBMFUsTUFBQSxFQUFBbkosSUFBQSxDQUFBcEIsSUFBQSxDQUFBbkssR0FBQSxVQUFBdUwsSUFBQSxDQUFBb0osT0FBQSxhQUFBL0IsS0FBQSxXQUFBckgsSUFBQSxDQUFBL0QsTUFBQSxTQUFBeEgsR0FBQSxHQUFBdUwsSUFBQSxDQUFBcUosR0FBQSxRQUFBNVUsR0FBQSxJQUFBMFUsTUFBQSxTQUFBOUIsSUFBQSxDQUFBM1MsS0FBQSxHQUFBRCxHQUFBLEVBQUE0UyxJQUFBLENBQUFsTyxJQUFBLE9BQUFrTyxJQUFBLFdBQUFBLElBQUEsQ0FBQWxPLElBQUEsT0FBQWtPLElBQUEsUUFBQXZFLE9BQUEsQ0FBQTBDLE1BQUEsR0FBQUEsTUFBQSxFQUFBYixPQUFBLENBQUEzQixTQUFBLEtBQUF5RixXQUFBLEVBQUE5RCxPQUFBLEVBQUFzRCxLQUFBLFdBQUFBLE1BQUFxQixhQUFBLGFBQUFDLElBQUEsV0FBQWxDLElBQUEsV0FBQVAsSUFBQSxRQUFBQyxLQUFBLEdBQUE3SyxTQUFBLE9BQUEvQyxJQUFBLFlBQUF3TixRQUFBLGNBQUFoQixNQUFBLGdCQUFBWixHQUFBLEdBQUE3SSxTQUFBLE9BQUE0TCxVQUFBLENBQUE1UyxPQUFBLENBQUE2UyxhQUFBLElBQUF1QixhQUFBLFdBQUFaLElBQUEsa0JBQUFBLElBQUEsQ0FBQWMsTUFBQSxPQUFBdkcsTUFBQSxDQUFBK0IsSUFBQSxPQUFBMEQsSUFBQSxNQUFBTixLQUFBLEVBQUFNLElBQUEsQ0FBQWUsS0FBQSxjQUFBZixJQUFBLElBQUF4TSxTQUFBLE1BQUF3TixJQUFBLFdBQUFBLEtBQUEsU0FBQXZRLElBQUEsV0FBQXdRLFVBQUEsUUFBQTdCLFVBQUEsSUFBQUUsVUFBQSxrQkFBQTJCLFVBQUEsQ0FBQXRRLElBQUEsUUFBQXNRLFVBQUEsQ0FBQTVFLEdBQUEsY0FBQTZFLElBQUEsS0FBQTVDLGlCQUFBLFdBQUFBLGtCQUFBNkMsU0FBQSxhQUFBMVEsSUFBQSxRQUFBMFEsU0FBQSxNQUFBbkYsT0FBQSxrQkFBQW9GLE9BQUFDLEdBQUEsRUFBQUMsTUFBQSxXQUFBOUQsTUFBQSxDQUFBN00sSUFBQSxZQUFBNk0sTUFBQSxDQUFBbkIsR0FBQSxHQUFBOEUsU0FBQSxFQUFBbkYsT0FBQSxDQUFBMkMsSUFBQSxHQUFBMEMsR0FBQSxFQUFBQyxNQUFBLEtBQUF0RixPQUFBLENBQUFpQixNQUFBLFdBQUFqQixPQUFBLENBQUFLLEdBQUEsR0FBQTdJLFNBQUEsS0FBQThOLE1BQUEsYUFBQXRMLENBQUEsUUFBQW9KLFVBQUEsQ0FBQTdMLE1BQUEsTUFBQXlDLENBQUEsU0FBQUEsQ0FBQSxRQUFBK0ksS0FBQSxRQUFBSyxVQUFBLENBQUFwSixDQUFBLEdBQUF3SCxNQUFBLEdBQUF1QixLQUFBLENBQUFPLFVBQUEsaUJBQUFQLEtBQUEsQ0FBQUMsTUFBQSxTQUFBb0MsTUFBQSxhQUFBckMsS0FBQSxDQUFBQyxNQUFBLFNBQUE2QixJQUFBLFFBQUFVLFFBQUEsR0FBQWhILE1BQUEsQ0FBQStCLElBQUEsQ0FBQXlDLEtBQUEsZUFBQXlDLFVBQUEsR0FBQWpILE1BQUEsQ0FBQStCLElBQUEsQ0FBQXlDLEtBQUEscUJBQUF3QyxRQUFBLElBQUFDLFVBQUEsYUFBQVgsSUFBQSxHQUFBOUIsS0FBQSxDQUFBRSxRQUFBLFNBQUFtQyxNQUFBLENBQUFyQyxLQUFBLENBQUFFLFFBQUEsZ0JBQUE0QixJQUFBLEdBQUE5QixLQUFBLENBQUFHLFVBQUEsU0FBQWtDLE1BQUEsQ0FBQXJDLEtBQUEsQ0FBQUcsVUFBQSxjQUFBcUMsUUFBQSxhQUFBVixJQUFBLEdBQUE5QixLQUFBLENBQUFFLFFBQUEsU0FBQW1DLE1BQUEsQ0FBQXJDLEtBQUEsQ0FBQUUsUUFBQSxxQkFBQXVDLFVBQUEsWUFBQXhELEtBQUEscURBQUE2QyxJQUFBLEdBQUE5QixLQUFBLENBQUFHLFVBQUEsU0FBQWtDLE1BQUEsQ0FBQXJDLEtBQUEsQ0FBQUcsVUFBQSxZQUFBWCxNQUFBLFdBQUFBLE9BQUE1TixJQUFBLEVBQUEwTCxHQUFBLGFBQUFyRyxDQUFBLFFBQUFvSixVQUFBLENBQUE3TCxNQUFBLE1BQUF5QyxDQUFBLFNBQUFBLENBQUEsUUFBQStJLEtBQUEsUUFBQUssVUFBQSxDQUFBcEosQ0FBQSxPQUFBK0ksS0FBQSxDQUFBQyxNQUFBLFNBQUE2QixJQUFBLElBQUF0RyxNQUFBLENBQUErQixJQUFBLENBQUF5QyxLQUFBLHdCQUFBOEIsSUFBQSxHQUFBOUIsS0FBQSxDQUFBRyxVQUFBLFFBQUF1QyxZQUFBLEdBQUExQyxLQUFBLGFBQUEwQyxZQUFBLGlCQUFBOVEsSUFBQSxtQkFBQUEsSUFBQSxLQUFBOFEsWUFBQSxDQUFBekMsTUFBQSxJQUFBM0MsR0FBQSxJQUFBQSxHQUFBLElBQUFvRixZQUFBLENBQUF2QyxVQUFBLEtBQUF1QyxZQUFBLGNBQUFqRSxNQUFBLEdBQUFpRSxZQUFBLEdBQUFBLFlBQUEsQ0FBQW5DLFVBQUEsY0FBQTlCLE1BQUEsQ0FBQTdNLElBQUEsR0FBQUEsSUFBQSxFQUFBNk0sTUFBQSxDQUFBbkIsR0FBQSxHQUFBQSxHQUFBLEVBQUFvRixZQUFBLFNBQUF4RSxNQUFBLGdCQUFBMEIsSUFBQSxHQUFBOEMsWUFBQSxDQUFBdkMsVUFBQSxFQUFBM0MsZ0JBQUEsU0FBQW1GLFFBQUEsQ0FBQWxFLE1BQUEsTUFBQWtFLFFBQUEsV0FBQUEsU0FBQWxFLE1BQUEsRUFBQTJCLFFBQUEsb0JBQUEzQixNQUFBLENBQUE3TSxJQUFBLFFBQUE2TSxNQUFBLENBQUFuQixHQUFBLHFCQUFBbUIsTUFBQSxDQUFBN00sSUFBQSxtQkFBQTZNLE1BQUEsQ0FBQTdNLElBQUEsUUFBQWdPLElBQUEsR0FBQW5CLE1BQUEsQ0FBQW5CLEdBQUEsZ0JBQUFtQixNQUFBLENBQUE3TSxJQUFBLFNBQUF1USxJQUFBLFFBQUE3RSxHQUFBLEdBQUFtQixNQUFBLENBQUFuQixHQUFBLE9BQUFZLE1BQUEsa0JBQUEwQixJQUFBLHlCQUFBbkIsTUFBQSxDQUFBN00sSUFBQSxJQUFBd08sUUFBQSxVQUFBUixJQUFBLEdBQUFRLFFBQUEsR0FBQTVDLGdCQUFBLEtBQUFvRixNQUFBLFdBQUFBLE9BQUF6QyxVQUFBLGFBQUFsSixDQUFBLFFBQUFvSixVQUFBLENBQUE3TCxNQUFBLE1BQUF5QyxDQUFBLFNBQUFBLENBQUEsUUFBQStJLEtBQUEsUUFBQUssVUFBQSxDQUFBcEosQ0FBQSxPQUFBK0ksS0FBQSxDQUFBRyxVQUFBLEtBQUFBLFVBQUEsY0FBQXdDLFFBQUEsQ0FBQTNDLEtBQUEsQ0FBQU8sVUFBQSxFQUFBUCxLQUFBLENBQUFJLFFBQUEsR0FBQUUsYUFBQSxDQUFBTixLQUFBLEdBQUF4QyxnQkFBQSx5QkFBQXFGLE9BQUE1QyxNQUFBLGFBQUFoSixDQUFBLFFBQUFvSixVQUFBLENBQUE3TCxNQUFBLE1BQUF5QyxDQUFBLFNBQUFBLENBQUEsUUFBQStJLEtBQUEsUUFBQUssVUFBQSxDQUFBcEosQ0FBQSxPQUFBK0ksS0FBQSxDQUFBQyxNQUFBLEtBQUFBLE1BQUEsUUFBQXhCLE1BQUEsR0FBQXVCLEtBQUEsQ0FBQU8sVUFBQSxrQkFBQTlCLE1BQUEsQ0FBQTdNLElBQUEsUUFBQWtSLE1BQUEsR0FBQXJFLE1BQUEsQ0FBQW5CLEdBQUEsRUFBQWdELGFBQUEsQ0FBQU4sS0FBQSxZQUFBOEMsTUFBQSxnQkFBQTdELEtBQUEsOEJBQUE4RCxhQUFBLFdBQUFBLGNBQUF0QyxRQUFBLEVBQUFkLFVBQUEsRUFBQUUsT0FBQSxnQkFBQVgsUUFBQSxLQUFBbkQsUUFBQSxFQUFBZ0MsTUFBQSxDQUFBMEMsUUFBQSxHQUFBZCxVQUFBLEVBQUFBLFVBQUEsRUFBQUUsT0FBQSxFQUFBQSxPQUFBLG9CQUFBM0IsTUFBQSxVQUFBWixHQUFBLEdBQUE3SSxTQUFBLEdBQUErSSxnQkFBQSxPQUFBbkMsT0FBQTtBQUFBLFNBQUEvSiwyQkFBQTBSLENBQUEsRUFBQUMsY0FBQSxRQUFBQyxFQUFBLFVBQUFySCxNQUFBLG9CQUFBbUgsQ0FBQSxDQUFBbkgsTUFBQSxDQUFBRSxRQUFBLEtBQUFpSCxDQUFBLHFCQUFBRSxFQUFBLFFBQUFsSyxLQUFBLENBQUFtSyxPQUFBLENBQUFILENBQUEsTUFBQUUsRUFBQSxHQUFBRSwyQkFBQSxDQUFBSixDQUFBLE1BQUFDLGNBQUEsSUFBQUQsQ0FBQSxXQUFBQSxDQUFBLENBQUF4TyxNQUFBLHFCQUFBME8sRUFBQSxFQUFBRixDQUFBLEdBQUFFLEVBQUEsTUFBQWpNLENBQUEsVUFBQW9NLENBQUEsWUFBQUEsRUFBQSxlQUFBN1IsQ0FBQSxFQUFBNlIsQ0FBQSxFQUFBNVIsQ0FBQSxXQUFBQSxFQUFBLFFBQUF3RixDQUFBLElBQUErTCxDQUFBLENBQUF4TyxNQUFBLFdBQUE5QyxJQUFBLG1CQUFBQSxJQUFBLFNBQUF6RSxLQUFBLEVBQUErVixDQUFBLENBQUEvTCxDQUFBLFVBQUFqRixDQUFBLFdBQUFBLEVBQUFzUixFQUFBLFVBQUFBLEVBQUEsS0FBQXJSLENBQUEsRUFBQW9SLENBQUEsZ0JBQUEzRCxTQUFBLGlKQUFBNkQsZ0JBQUEsU0FBQUMsTUFBQSxVQUFBelIsR0FBQSxXQUFBUCxDQUFBLFdBQUFBLEVBQUEsSUFBQTBSLEVBQUEsR0FBQUEsRUFBQSxDQUFBM0YsSUFBQSxDQUFBeUYsQ0FBQSxNQUFBdlIsQ0FBQSxXQUFBQSxFQUFBLFFBQUFnUyxJQUFBLEdBQUFQLEVBQUEsQ0FBQXRELElBQUEsSUFBQTJELGdCQUFBLEdBQUFFLElBQUEsQ0FBQS9SLElBQUEsU0FBQStSLElBQUEsS0FBQXpSLENBQUEsV0FBQUEsRUFBQTBSLEdBQUEsSUFBQUYsTUFBQSxTQUFBelIsR0FBQSxHQUFBMlIsR0FBQSxLQUFBelIsQ0FBQSxXQUFBQSxFQUFBLGVBQUFzUixnQkFBQSxJQUFBTCxFQUFBLG9CQUFBQSxFQUFBLDhCQUFBTSxNQUFBLFFBQUF6UixHQUFBO0FBQUEsU0FBQXFSLDRCQUFBSixDQUFBLEVBQUFXLE1BQUEsU0FBQVgsQ0FBQSxxQkFBQUEsQ0FBQSxzQkFBQVksaUJBQUEsQ0FBQVosQ0FBQSxFQUFBVyxNQUFBLE9BQUFsUyxDQUFBLEdBQUE2RyxNQUFBLENBQUFpRCxTQUFBLENBQUFzSSxRQUFBLENBQUF0RyxJQUFBLENBQUF5RixDQUFBLEVBQUFoQixLQUFBLGFBQUF2USxDQUFBLGlCQUFBdVIsQ0FBQSxDQUFBaEMsV0FBQSxFQUFBdlAsQ0FBQSxHQUFBdVIsQ0FBQSxDQUFBaEMsV0FBQSxDQUFBQyxJQUFBLE1BQUF4UCxDQUFBLGNBQUFBLENBQUEsbUJBQUF1SCxLQUFBLENBQUE4SyxJQUFBLENBQUFkLENBQUEsT0FBQXZSLENBQUEsK0RBQUEySSxJQUFBLENBQUEzSSxDQUFBLFVBQUFtUyxpQkFBQSxDQUFBWixDQUFBLEVBQUFXLE1BQUE7QUFBQSxTQUFBQyxrQkFBQUcsR0FBQSxFQUFBQyxHQUFBLFFBQUFBLEdBQUEsWUFBQUEsR0FBQSxHQUFBRCxHQUFBLENBQUF2UCxNQUFBLEVBQUF3UCxHQUFBLEdBQUFELEdBQUEsQ0FBQXZQLE1BQUEsV0FBQXlDLENBQUEsTUFBQWdOLElBQUEsT0FBQWpMLEtBQUEsQ0FBQWdMLEdBQUEsR0FBQS9NLENBQUEsR0FBQStNLEdBQUEsRUFBQS9NLENBQUEsSUFBQWdOLElBQUEsQ0FBQWhOLENBQUEsSUFBQThNLEdBQUEsQ0FBQTlNLENBQUEsVUFBQWdOLElBQUE7QUFBQSxTQUFBQyxtQkFBQUMsR0FBQSxFQUFBNUYsT0FBQSxFQUFBQyxNQUFBLEVBQUE0RixLQUFBLEVBQUFDLE1BQUEsRUFBQXJYLEdBQUEsRUFBQXNRLEdBQUEsY0FBQW5FLElBQUEsR0FBQWdMLEdBQUEsQ0FBQW5YLEdBQUEsRUFBQXNRLEdBQUEsT0FBQXJRLEtBQUEsR0FBQWtNLElBQUEsQ0FBQWxNLEtBQUEsV0FBQXdGLEtBQUEsSUFBQStMLE1BQUEsQ0FBQS9MLEtBQUEsaUJBQUEwRyxJQUFBLENBQUF6SCxJQUFBLElBQUE2TSxPQUFBLENBQUF0UixLQUFBLFlBQUFzVSxPQUFBLENBQUFoRCxPQUFBLENBQUF0UixLQUFBLEVBQUE0UixJQUFBLENBQUF1RixLQUFBLEVBQUFDLE1BQUE7QUFBQSxTQUFBQyxrQkFBQWpILEVBQUEsNkJBQUFWLElBQUEsU0FBQTVELElBQUEsR0FBQXhFLFNBQUEsYUFBQWdOLE9BQUEsV0FBQWhELE9BQUEsRUFBQUMsTUFBQSxRQUFBMkYsR0FBQSxHQUFBOUcsRUFBQSxDQUFBbkUsS0FBQSxDQUFBeUQsSUFBQSxFQUFBNUQsSUFBQSxZQUFBcUwsTUFBQW5YLEtBQUEsSUFBQWlYLGtCQUFBLENBQUFDLEdBQUEsRUFBQTVGLE9BQUEsRUFBQUMsTUFBQSxFQUFBNEYsS0FBQSxFQUFBQyxNQUFBLFVBQUFwWCxLQUFBLGNBQUFvWCxPQUFBdFMsR0FBQSxJQUFBbVMsa0JBQUEsQ0FBQUMsR0FBQSxFQUFBNUYsT0FBQSxFQUFBQyxNQUFBLEVBQUE0RixLQUFBLEVBQUFDLE1BQUEsV0FBQXRTLEdBQUEsS0FBQXFTLEtBQUEsQ0FBQTNQLFNBQUE7QUFEaUQ7QUFDWjtBQUNNO0FBQ3dCO0FBQ047QUFDRjtBQUU3QjtBQUNDO0FBQ0Q7QUFDRztBQUVqQzZQLGlCQUFBLGVBQUFsSixtQkFBQSxHQUFBOEYsSUFBQSxDQUFDLFNBQUFzRCxRQUFBO0VBQ0MsWUFBWTs7RUFBQyxJQUFBQyxjQUFBLEVBQUFDLFVBQUEsRUFBQUMsUUFBQSxFQWdCSkMsWUFBWSxFQUFBaFYsUUFBQSxFQUFBb0IsTUFBQSxFQUFBSSxRQUFBLEVBaUVaeVQsYUFBYSxFQVNiQyxXQUFXLEVBa0JYQyxtQkFBbUIsRUFhbkJDLGlCQUFpQixFQVFqQkMsV0FBVyxFQXNCWEMsa0JBQWtCLEVBc0JsQkMsc0JBQXNCLEVBYXRCQyxhQUFhO0VBQUEsT0FBQWhLLG1CQUFBLEdBQUFvQixJQUFBLFVBQUE2SSxTQUFBQyxRQUFBO0lBQUEsa0JBQUFBLFFBQUEsQ0FBQXhELElBQUEsR0FBQXdELFFBQUEsQ0FBQTFGLElBQUE7TUFBQTtRQUFid0YsYUFBYSxZQUFBRyxlQUFDbFIsU0FBUyxFQUFFO1VBQ2hDO1VBQ0EsSUFBSW1SLEtBQUssR0FBR2xZLFFBQVEsQ0FBQ3dDLGFBQWEsQ0FBQyxLQUFLLENBQUM7VUFDekMwVixLQUFLLENBQUMvUixFQUFFLEdBQUcsYUFBYTtVQUV4QixJQUFJWSxTQUFTLEVBQUU7WUFDYkEsU0FBUyxDQUFDNUYsV0FBVyxDQUFDK1csS0FBSyxDQUFDO1VBQzlCLENBQUMsTUFBTTtZQUNMbFksUUFBUSxDQUFDc0csSUFBSSxDQUFDbkYsV0FBVyxDQUFDK1csS0FBSyxDQUFDO1VBQ2xDOztVQUVBO1VBQ0EsSUFBSTNWLE1BQU0sR0FBR3ZDLFFBQVEsQ0FBQ3dDLGFBQWEsQ0FBQyxLQUFLLENBQUM7VUFDMUNELE1BQU0sQ0FBQzRELEVBQUUsR0FBRyxrQkFBa0I7VUFFOUIsSUFBTWdTLFVBQVUsR0FDZCxrSUFBa0k7VUFDcEk1VixNQUFNLENBQUNsQyxTQUFTLENBQUNDLEdBQUcsQ0FBQzZYLFVBQVUsQ0FBQzVPLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzs7VUFFM0M7VUFDQWhILE1BQU0sQ0FBQ3dELE9BQU8sQ0FBQ0MsVUFBVSxHQUFHLE1BQU07VUFDbEN6RCxNQUFNLENBQUNsQyxTQUFTLENBQUNDLEdBQUcsQ0FBQyxZQUFZLENBQUM7VUFFbEM0WCxLQUFLLENBQUMvVyxXQUFXLENBQUNvQixNQUFNLENBQUM7VUFDekJzRiwwREFBWSxDQUFDOUUsV0FBVyxDQUFDUixNQUFNLENBQUM7O1VBRWhDO1VBQ0ErVSxZQUFZLENBQUMsQ0FBQztRQUNoQixDQUFDO1FBekNRTyxzQkFBc0IsWUFBQU8sc0JBQUEsRUFBRztVQUNoQztVQUNBLElBQU1DLFdBQVcsR0FBR3JZLFFBQVEsQ0FBQ3NZLGFBQWEsQ0FDeEMsZ0dBQ0YsQ0FBQztVQUNELElBQUksQ0FBQ0QsV0FBVyxFQUFFO1lBQ2hCLE9BQU8sS0FBSztVQUNkLENBQUMsTUFBTTtZQUNMQSxXQUFXLENBQUNsUyxFQUFFLEdBQUcsMkJBQTJCO1VBQzlDO1VBQ0EsT0FBTyxJQUFJO1FBQ2IsQ0FBQztRQWpDUXlSLGtCQUFrQixZQUFBVyxvQkFBQSxFQUFHO1VBQzVCO1VBQ0EsSUFBSUMsYUFBYSxHQUFHeFksUUFBUSxDQUFDQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUM7VUFDdEQsSUFBSXdZLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQzs7VUFFbkJELGFBQWEsQ0FBQ3JZLE9BQU8sQ0FBQyxVQUFVdVksS0FBSyxFQUFFO1lBQ3JDLElBQUlDLE9BQU8sR0FBR0QsS0FBSyxDQUFDRSxrQkFBa0I7O1lBRXRDO1lBQ0EsSUFBSUgsS0FBSyxFQUFFOztZQUVYO1lBQ0EsSUFBSUUsT0FBTyxJQUFJQSxPQUFPLENBQUNFLE9BQU8sQ0FBQ0MsV0FBVyxDQUFDLENBQUMsS0FBSyxLQUFLLEVBQUU7Y0FDdEQ7Y0FDQUgsT0FBTyxDQUFDeFMsRUFBRSxHQUFHLHNCQUFzQjtjQUNuQ3NTLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQztZQUNoQjtVQUNGLENBQUMsQ0FBQzs7VUFFRixPQUFPQSxLQUFLO1FBQ2QsQ0FBQztRQTFDUWQsV0FBVyxZQUFBb0IsYUFBQSxFQUFHO1VBQ3JCO1VBQ0EsSUFBSVAsYUFBYSxHQUFHeFksUUFBUSxDQUFDQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUM7VUFDdEQsSUFBSXdZLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQzs7VUFFbkJELGFBQWEsQ0FBQ3JZLE9BQU8sQ0FBQyxVQUFVdVksS0FBSyxFQUFFO1lBQ3JDLElBQUlNLFlBQVksR0FBR04sS0FBSyxDQUFDTyxzQkFBc0I7O1lBRS9DO1lBQ0EsSUFBSVIsS0FBSyxFQUFFOztZQUVYO1lBQ0EsSUFBSU8sWUFBWSxJQUFJQSxZQUFZLENBQUNILE9BQU8sQ0FBQ0MsV0FBVyxDQUFDLENBQUMsS0FBSyxLQUFLLEVBQUU7Y0FDaEU7Y0FDQUUsWUFBWSxDQUFDRSxnQkFBZ0IsQ0FBQy9TLEVBQUUsR0FBRyxjQUFjO2NBQ2pEc1MsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDO1lBQ2hCO1VBQ0YsQ0FBQyxDQUFDOztVQUVGLE9BQU9BLEtBQUs7UUFDZCxDQUFDO1FBNUJRZixpQkFBaUIsWUFBQXlCLG1CQUFDcFMsU0FBUyxFQUFFO1VBQ3BDLElBQU1xUyxhQUFhLEdBQUdyUyxTQUFTLENBQUM5RyxnQkFBZ0IsQ0FBQyxxQkFBcUIsQ0FBQztVQUN2RSxJQUFJbVosYUFBYSxDQUFDbFMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUM1QixJQUFNbVMsZ0JBQWdCLEdBQUdELGFBQWEsQ0FBQ0EsYUFBYSxDQUFDbFMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUNoRW1TLGdCQUFnQixDQUFDbFQsRUFBRSxHQUFHLG9CQUFvQjtVQUM1QztRQUNGLENBQUM7UUFuQlFzUixtQkFBbUIsWUFBQTZCLHFCQUFDdlMsU0FBUyxFQUFFO1VBQ3RDO1VBQ0EsSUFBSXdTLE1BQU0sR0FBR3hTLFNBQVMsQ0FBQ3lTLGFBQWE7VUFDcEMsT0FBT0QsTUFBTSxFQUFFO1lBQ2IsSUFBSUEsTUFBTSxDQUFDbFosU0FBUyxDQUFDbUUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFO2NBQ3ZDK1UsTUFBTSxDQUFDcFQsRUFBRSxHQUFHLHVCQUF1QjtjQUNuQyxPQUFPLElBQUk7WUFDYjtZQUNBb1QsTUFBTSxHQUFHQSxNQUFNLENBQUNDLGFBQWE7VUFDL0I7VUFDQSxPQUFPLEtBQUs7UUFDZCxDQUFDO1FBN0JRaEMsV0FBVyxZQUFBaUMsYUFBQ0MsTUFBTSxFQUFFO1VBQzNCO1VBQ0FBLE1BQU0sQ0FBQ3ZULEVBQUUsR0FBRyxjQUFjO1VBQzFCdVQsTUFBTSxDQUFDRixhQUFhLENBQUNuWixTQUFTLENBQUNDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQztVQUM1RCxJQUFNcVosV0FBVyxHQUFHaEMsV0FBVyxDQUFDLENBQUM7VUFDakMsSUFBTWlDLGtCQUFrQixHQUFHaEMsa0JBQWtCLENBQUMsQ0FBQztVQUMvQyxJQUFNaUMsdUJBQXVCLEdBQUdILE1BQU0sQ0FBQ0YsYUFBYSxDQUFDQSxhQUFhO1VBQ2xFSyx1QkFBdUIsQ0FBQzFULEVBQUUsR0FBRyxpQ0FBaUM7VUFDOUQsSUFBTTJULG1CQUFtQixHQUFHckMsbUJBQW1CLENBQUNvQyx1QkFBdUIsQ0FBQztVQUN4RSxJQUFNRSxzQkFBc0IsR0FBR2xDLHNCQUFzQixDQUFDLENBQUM7VUFDdkRILGlCQUFpQixDQUFDbUMsdUJBQXVCLENBQUM7VUFDMUMvQixhQUFhLENBQUM5WCxRQUFRLENBQUNzRyxJQUFJLENBQUM7VUFDNUJ1QiwwREFBWSxDQUFDZixnQkFBZ0IsQ0FBQytTLHVCQUF1QixFQUFFLENBQUMsQ0FBQyxDQUFDO1VBQzFEaFMsMERBQVksQ0FBQ3RCLGlCQUFpQixDQUFDLENBQUM7VUFDaENzQiwwREFBWSxDQUFDM0IsZ0JBQWdCLENBQUMsQ0FBQztVQUMvQjJILDZEQUFRLENBQUMsQ0FBQztRQUNaLENBQUM7UUF6QlEwSixhQUFhLFlBQUF5QyxlQUFBLEVBQUc7VUFDdkI7VUFDQSxJQUFJckssT0FBTyxHQUFHMU0sTUFBTTtVQUNwQixJQUFJZ1gsT0FBTyxDQUFDQyxhQUFhLEtBQUssYUFBYSxFQUFFO1lBQzNDdkssT0FBTyxHQUFHd0ssWUFBWTtVQUN4QjtVQUNBeEssT0FBTyxDQUFDdk8sUUFBUSxHQUFHQSxvREFBUSxDQUFDLENBQUM7UUFDL0IsQ0FBQztRQXhFUWtXLFlBQVksWUFBQThDLGNBQUM5WCxRQUFRLEVBQUU7VUFDOUIsSUFBSStYLGFBQWEsR0FBR3JhLFFBQVEsQ0FBQ3dDLGFBQWEsQ0FBQyxRQUFRLENBQUM7VUFDcEQ2WCxhQUFhLENBQUMvVixJQUFJLEdBQUcsaUJBQWlCO1VBQ3RDK1YsYUFBYSxDQUFDbFUsRUFBRSxHQUFHLGNBQWM7VUFDakNrVSxhQUFhLENBQUM1WCxXQUFXLEdBQUcyVSxVQUFVO1VBQ3RDcFgsUUFBUSxDQUFDc0csSUFBSSxDQUFDbkYsV0FBVyxDQUFDa1osYUFBYSxDQUFDOztVQUV4QztVQUNBLElBQUkvWCxRQUFRLEVBQUU7WUFDWkEsUUFBUSxDQUFDLENBQUM7VUFDWjtRQUNGLENBQUM7UUF6Qks2VSxjQUFjLE1BQUEvUixNQUFBLENBQU02UixvREFBWSxDQUFDblAsWUFBWTtRQUFBa1EsUUFBQSxDQUFBeEQsSUFBQTtRQUFBd0QsUUFBQSxDQUFBMUYsSUFBQTtRQUFBLE9BSTFCZ0ksS0FBSyxDQUFDbkQsY0FBYyxDQUFDO01BQUE7UUFBdENFLFFBQVEsR0FBQVcsUUFBQSxDQUFBakcsSUFBQTtRQUFBLElBQ1RzRixRQUFRLENBQUNrRCxFQUFFO1VBQUF2QyxRQUFBLENBQUExRixJQUFBO1VBQUE7UUFBQTtRQUFBLE1BQ1IsSUFBSVgsS0FBSyxDQUFDLDhCQUE4QixHQUFHMEYsUUFBUSxDQUFDbUQsVUFBVSxDQUFDO01BQUE7UUFBQXhDLFFBQUEsQ0FBQTFGLElBQUE7UUFBQSxPQUVwRCtFLFFBQVEsQ0FBQ2xPLElBQUksQ0FBQyxDQUFDO01BQUE7UUFBbENpTyxVQUFVLEdBQUFZLFFBQUEsQ0FBQWpHLElBQUE7UUFBQWlHLFFBQUEsQ0FBQTFGLElBQUE7UUFBQTtNQUFBO1FBQUEwRixRQUFBLENBQUF4RCxJQUFBO1FBQUF3RCxRQUFBLENBQUF5QyxFQUFBLEdBQUF6QyxRQUFBO1FBRVY5UyxPQUFPLENBQUNDLEtBQUssQ0FBQyxxREFBcUQsRUFBQTZTLFFBQUEsQ0FBQXlDLEVBQU8sQ0FBQztRQUFDLE9BQUF6QyxRQUFBLENBQUE5RixNQUFBO01BQUE7UUFpQjlFekUsc0VBQWlCLENBQUMsQ0FBQztRQUNuQjlFLHVEQUFXLENBQUNDLElBQUksQ0FBQyxDQUFDO1FBQ2xCMk8sYUFBYSxDQUFDLENBQUM7O1FBRWY7UUFDQTtRQUNNalYsUUFBUSxHQUFHLFNBQVhBLFFBQVFBLENBQWF1QixhQUFhLEVBQUVDLFFBQVEsRUFBRTtVQUFBLElBQUFDLFNBQUEsR0FBQUMsMEJBQUEsQ0FDM0JILGFBQWE7WUFBQUksS0FBQTtVQUFBO1lBQXBDLEtBQUFGLFNBQUEsQ0FBQUcsQ0FBQSxNQUFBRCxLQUFBLEdBQUFGLFNBQUEsQ0FBQUksQ0FBQSxJQUFBQyxJQUFBLEdBQXNDO2NBQUEsSUFBM0JDLFFBQVEsR0FBQUosS0FBQSxDQUFBdEUsS0FBQTtjQUNqQixJQUFJMEUsUUFBUSxDQUFDQyxJQUFJLEtBQUssV0FBVyxFQUFFO2dCQUNqQztnQkFDQUQsUUFBUSxDQUFDcVcsVUFBVSxDQUFDdmEsT0FBTyxDQUFDLFVBQUN3YSxJQUFJLEVBQUs7a0JBQ3BDO2tCQUNBLElBQ0VBLElBQUksQ0FBQ0MsUUFBUSxLQUFLLFVBQVUsSUFDNUJELElBQUksQ0FBQ0UsWUFBWSxDQUFDLGNBQWMsQ0FBQyxFQUNqQztvQkFDQTtvQkFDQS9XLFFBQVEsQ0FBQ2dYLFVBQVUsQ0FBQyxDQUFDOztvQkFFckI7b0JBQ0F0RCxXQUFXLENBQUNtRCxJQUFJLENBQUM7b0JBQ2pCO2tCQUNGOztrQkFFQTtrQkFDQSxJQUFJQSxJQUFJLENBQUMxYSxnQkFBZ0IsRUFBRTtvQkFDekIsSUFBTThhLFNBQVMsR0FBR0osSUFBSSxDQUFDMWEsZ0JBQWdCLENBQUMsd0JBQXdCLENBQUM7b0JBQ2pFLElBQUk4YSxTQUFTLENBQUM3VCxNQUFNLEdBQUcsQ0FBQyxFQUFFO3NCQUN4QjtzQkFDQXBELFFBQVEsQ0FBQ2dYLFVBQVUsQ0FBQyxDQUFDOztzQkFFckI7c0JBQ0F0RCxXQUFXLENBQUN1RCxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7c0JBQ3pCelosc0VBQWtCLENBQUMwWix1QkFBdUIsQ0FBQyxDQUFDO3NCQUM1QzFaLHNFQUFrQixDQUFDMlosb0JBQW9CLENBQUMsQ0FBQztzQkFDekM7b0JBQ0Y7a0JBQ0Y7Z0JBQ0YsQ0FBQyxDQUFDO2NBQ0o7WUFDRjtVQUFDLFNBQUF4VyxHQUFBO1lBQUFWLFNBQUEsQ0FBQVcsQ0FBQSxDQUFBRCxHQUFBO1VBQUE7WUFBQVYsU0FBQSxDQUFBWSxDQUFBO1VBQUE7UUFDSCxDQUFDLEVBRUQ7UUFDTWpCLE1BQU0sR0FBRztVQUFFQyxVQUFVLEVBQUUsS0FBSztVQUFFdVgsU0FBUyxFQUFFLElBQUk7VUFBRUMsT0FBTyxFQUFFO1FBQUssQ0FBQyxFQUVwRTtRQUNNclgsUUFBUSxHQUFHLElBQUljLGdCQUFnQixDQUFDdEMsUUFBUSxDQUFDLEVBRS9DO1FBQ0F3QixRQUFRLENBQUNlLE9BQU8sQ0FBQzdFLFFBQVEsQ0FBQ3NHLElBQUksRUFBRTVDLE1BQU0sQ0FBQztRQXlJdkM7UUFDQUksUUFBUSxDQUFDZSxPQUFPLENBQUM3RSxRQUFRLEVBQUU7VUFBRWtiLFNBQVMsRUFBRSxJQUFJO1VBQUVDLE9BQU8sRUFBRTtRQUFLLENBQUMsQ0FBQztNQUFDO01BQUE7UUFBQSxPQUFBbkQsUUFBQSxDQUFBckQsSUFBQTtJQUFBO0VBQUEsR0FBQXVDLE9BQUE7QUFBQSxDQUNoRSxHQUFFLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3N0eWxlcy9yZWN0YW5nbGVzLmNzcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3N0eWxlcy9jb21tb24uc2NzcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3N0eWxlcy9kZXNrdG9wLnNjc3MiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9zdHlsZXMvbW9iaWxlLnNjc3MiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL2ljb25zL2NhbGwuc3ZnIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvaWNvbnMvZXhpdC5zdmciLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9pY29ucy9oYW5ndXAuc3ZnIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvaWNvbnMvbWF4aW1pemUuc3ZnIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvaWNvbnMvbXV0ZWRfbWljcm9waG9uZS5zdmciLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9pY29ucy9yZWN0YW5nbGVzLnN2ZyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL2ljb25zL3dhdmVmb3JtLnN2ZyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3N0eWxlcy9yZWN0YW5nbGVzLmNzcz85NzQ1Iiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvc3R5bGVzL2NvbW1vbi5zY3NzPzA0YzMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9zdHlsZXMvZGVza3RvcC5zY3NzP2RhZDciLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9zdHlsZXMvbW9iaWxlLnNjc3M/MWM4MyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvRE9NTW9kdWxlLnRzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvU3VibWl0RXJyb3JIYW5kbGVyLnRzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvVHJhbnNjcmlwdGlvbk1vZHVsZS50cyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3N0YXRlLW1hY2hpbmVzL1NheVBpTWFjaGluZS50cyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9BY3Rvci5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9NYWNoaW5lLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL1N0YXRlLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL1N0YXRlTm9kZS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9fdmlydHVhbC9fdHNsaWIuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvYWN0aW9uVHlwZXMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvYWN0aW9ucy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9iZWhhdmlvcnMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvY29uc3RhbnRzLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL2RldlRvb2xzLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL2Vudmlyb25tZW50LmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL2luZGV4LmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL2ludGVycHJldGVyLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL2ludm9rZVV0aWxzLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL21hcFN0YXRlLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL21hdGNoLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL3JlZ2lzdHJ5LmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL3NjaGVkdWxlci5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9zY2hlbWEuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvc2VydmljZVNjb3BlLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL3N0YXRlVXRpbHMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvdHlwZXMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9BbmltYXRpb25Nb2R1bGUuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9CdXR0b25Nb2R1bGUuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9Db25maWdNb2R1bGUuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9FdmVudEJ1cy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL0V2ZW50TW9kdWxlLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvTG9nZ2luZ01vZHVsZS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL1N0YXRlTWFjaGluZVNlcnZpY2UuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9Vc2VyQWdlbnRNb2R1bGUuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvc2F5cGkuaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYEBrZXlmcmFtZXMgcHVsc2Vfb3V0ZXJtb3N0IHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTIpO1xuICB9XG59XG4ub3V0ZXJtb3N0IHtcbiAgYW5pbWF0aW9uOiBwdWxzZV9vdXRlcm1vc3QgNXMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBwdWxzZV9zZWNvbmQge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44NTYpO1xuICB9XG59XG4uc2Vjb25kIHtcbiAgYW5pbWF0aW9uOiBwdWxzZV9zZWNvbmQgNXMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBwdWxzZV90aGlyZCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjc5Mik7XG4gIH1cbn1cbi50aGlyZCB7XG4gIGFuaW1hdGlvbjogcHVsc2VfdGhpcmQgNXMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBwdWxzZV9mb3VydGgge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43MjgpO1xuICB9XG59XG4uZm91cnRoIHtcbiAgYW5pbWF0aW9uOiBwdWxzZV9mb3VydGggNXMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBwdWxzZV9maWZ0aCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjY2NCk7XG4gIH1cbn1cbi5maWZ0aCB7XG4gIGFuaW1hdGlvbjogcHVsc2VfZmlmdGggNXMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBwdWxzZV9pbm5lcm1vc3Qge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC42KTtcbiAgfVxufVxuLmlubmVybW9zdCB7XG4gIGFuaW1hdGlvbjogcHVsc2VfaW5uZXJtb3N0IDVzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbi8qIHBsYXlmdWwgYW5pbWF0aW9uIHRvIGluZGljYXRlIFBpIGlzIHNwZWFraW5nICovXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX291dGVybW9zdCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcbiAgfVxuICAyNSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45OTUpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkpO1xuICB9XG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjg5NSk7XG4gIH1cbn1cbi5vdXRlcm1vc3QucGlTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfb3V0ZXJtb3N0IDJzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgc3BlYWtpbmdfc2Vjb25kIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xuICB9XG4gIDI1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjk4KSByb3RhdGUoLTFkZWcpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjg3KSByb3RhdGUoMGRlZyk7XG4gIH1cbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODY1KSByb3RhdGUoMWRlZyk7XG4gIH1cbn1cbi5zZWNvbmQucGlTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfc2Vjb25kIDJzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgc3BlYWtpbmdfdGhpcmQge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XG4gIH1cbiAgMjUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTY1KSByb3RhdGUoLTJkZWcpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjg0KSByb3RhdGUoMGRlZyk7XG4gIH1cbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODM1KSByb3RhdGUoMmRlZyk7XG4gIH1cbn1cbi50aGlyZC5waVNwZWFraW5nIHtcbiAgYW5pbWF0aW9uOiBzcGVha2luZ190aGlyZCAycyBpbmZpbml0ZTtcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xufVxuXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX2ZvdXJ0aCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcbiAgfVxuICAyNSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45NSkgcm90YXRlKC0zZGVnKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44MSkgcm90YXRlKDBkZWcpO1xuICB9XG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjgwNSkgcm90YXRlKDNkZWcpO1xuICB9XG59XG4uZm91cnRoLnBpU3BlYWtpbmcge1xuICBhbmltYXRpb246IHNwZWFraW5nX2ZvdXJ0aCAycyBpbmZpbml0ZTtcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xufVxuXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX2ZpZnRoIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xuICB9XG4gIDI1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkzNSkgcm90YXRlKC00ZGVnKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43OCkgcm90YXRlKDBkZWcpO1xuICB9XG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjc3NSkgcm90YXRlKDRkZWcpO1xuICB9XG59XG4uZmlmdGgucGlTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfZmlmdGggMnMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBzcGVha2luZ19pbm5lcm1vc3Qge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XG4gIH1cbiAgMjUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTIpIHJvdGF0ZSgtNWRlZyk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzUpIHJvdGF0ZSgwZGVnKTtcbiAgfVxuICA3NSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43NDUpIHJvdGF0ZSg1ZGVnKTtcbiAgfVxufVxuLmlubmVybW9zdC5waVNwZWFraW5nIHtcbiAgYW5pbWF0aW9uOiBzcGVha2luZ19pbm5lcm1vc3QgMnMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuLyogd2F2ZSBhbmltYXRpb24gdG8gaW5kaWNhdGUgdXNlciBpcyBzcGVha2luZyAqL1xuQGtleWZyYW1lcyB1c2VyU3BlYWtpbmdBbmltYXRpb24ge1xuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuMDUpIHNjYWxlWCh2YXIoLS13aWR0aC1mYWN0b3IpKVxuICAgICAgdHJhbnNsYXRlWChjYWxjKC01MCUgKyB2YXIoLS1zcHJlYWQtYW1vdW50KSkpO1xuICB9XG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDEpIHNjYWxlWCh2YXIoLS13aWR0aC1mYWN0b3IpKVxuICAgICAgdHJhbnNsYXRlWChjYWxjKC01MCUgKyB2YXIoLS1zcHJlYWQtYW1vdW50KSkpO1xuICB9XG59XG4vKiB1c2VyIHNwZWFraW5nIG9zY2lsbGF0aW9uIGFuaW1hdGlvbiAqL1xuQGtleWZyYW1lcyB3YXZlZm9ybV9vdXRlcm1vc3Qge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMSkgc2NhbGVYKDEpO1xuICB9XG4gIDI1JSxcbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjkpIHNjYWxlWCgwLjkpO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgd2F2ZWZvcm1fc2Vjb25kIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuOSkgc2NhbGVYKDAuOSk7XG4gIH1cbiAgMjUlLFxuICA3NSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuOCkgc2NhbGVYKDAuOCk7XG4gIH1cbn1cblxuQGtleWZyYW1lcyB3YXZlZm9ybV90aGlyZCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjgpIHNjYWxlWCgwLjgpO1xuICB9XG4gIDI1JSxcbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjcpIHNjYWxlWCgwLjcpO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgd2F2ZWZvcm1fZm91cnRoIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNykgc2NhbGVYKDAuNyk7XG4gIH1cbiAgMjUlLFxuICA3NSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNikgc2NhbGVYKDAuNik7XG4gIH1cbn1cblxuQGtleWZyYW1lcyB3YXZlZm9ybV9maWZ0aCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjYpIHNjYWxlWCgwLjYpO1xuICB9XG4gIDI1JSxcbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjUpIHNjYWxlWCgwLjUpO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgd2F2ZWZvcm1faW5uZXJtb3N0IHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNSkgc2NhbGVYKDAuNSk7XG4gIH1cbiAgMjUlLFxuICA3NSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNCkgc2NhbGVYKDAuNCk7XG4gIH1cbn1cblxuLm91dGVybW9zdC51c2VyU3BlYWtpbmcge1xuICBhbmltYXRpb246IHdhdmVmb3JtX291dGVybW9zdCAwLjdzIGluZmluaXRlIGFsdGVybmF0ZTtcbn1cblxuLnNlY29uZC51c2VyU3BlYWtpbmcge1xuICBhbmltYXRpb246IHdhdmVmb3JtX3NlY29uZCAwLjY1cyBpbmZpbml0ZSBhbHRlcm5hdGU7XG59XG5cbi50aGlyZC51c2VyU3BlYWtpbmcge1xuICBhbmltYXRpb246IHdhdmVmb3JtX3RoaXJkIDAuNnMgaW5maW5pdGUgYWx0ZXJuYXRlO1xufVxuXG4uZm91cnRoLnVzZXJTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogd2F2ZWZvcm1fZm91cnRoIDAuNTVzIGluZmluaXRlIGFsdGVybmF0ZTtcbn1cblxuLmZpZnRoLnVzZXJTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogd2F2ZWZvcm1fZmlmdGggMC41cyBpbmZpbml0ZSBhbHRlcm5hdGU7XG59XG5cbi5pbm5lcm1vc3QudXNlclNwZWFraW5nIHtcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV9pbm5lcm1vc3QgMC40NXMgaW5maW5pdGUgYWx0ZXJuYXRlO1xufVxuXG4vKiBmbGlwY2FyZCBhbmltYXRpb24gdG8gaW5kaWNhdGUgU2F5LCBQaSBpcyB0cmFuc2NyaWJpbmcgYXVkaW8gdG8gdGV4dCAqL1xuQGtleWZyYW1lcyB0cmFuc2NyaWJpbmdGbGlwIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogcm90YXRlWSgwZGVnKTtcbiAgICBmaWxsOiB2YXIoLS1vcmlnaW5hbC1jb2xvcik7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZVkoMTgwZGVnKTtcbiAgICBmaWxsOiB2YXIoLS10cmFuc2NyaWJpbmctY29sb3IpO1xuICB9XG59XG5cbi5vdXRlcm1vc3QudHJhbnNjcmliaW5nIHtcbiAgLS1vcmlnaW5hbC1jb2xvcjogI2U0ZjJkMTtcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICNiM2UwZmU7XG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAxLjVzIGluZmluaXRlO1xufVxuXG4uc2Vjb25kLnRyYW5zY3JpYmluZyB7XG4gIC0tb3JpZ2luYWwtY29sb3I6ICNjY2U4YjU7XG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjODljMmZmO1xuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMS42cyBpbmZpbml0ZTtcbn1cblxuLnRoaXJkLnRyYW5zY3JpYmluZyB7XG4gIC0tb3JpZ2luYWwtY29sb3I6ICNiM2RiOTU7XG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjNWZhNGZmO1xuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMS43cyBpbmZpbml0ZTtcbn1cblxuLmZvdXJ0aC50cmFuc2NyaWJpbmcge1xuICAtLW9yaWdpbmFsLWNvbG9yOiAjOWJkMDc4O1xuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogIzM1ODZmZjtcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDEuOHMgaW5maW5pdGU7XG59XG5cbi5maWZ0aC50cmFuc2NyaWJpbmcge1xuICAtLW9yaWdpbmFsLWNvbG9yOiAjODNjNTVjO1xuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogIzBiNjllMztcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDEuOXMgaW5maW5pdGU7XG59XG5cbi5pbm5lcm1vc3QudHJhbnNjcmliaW5nIHtcbiAgLS1vcmlnaW5hbC1jb2xvcjogIzQyOGEyZjtcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICMwMDUzYmY7XG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAycyBpbmZpbml0ZTtcbn1cblxuLyogaGVhcnRiZWF0IGFuaW1hdGlvbiB0byBpbmRpY2F0ZSBQaSBpcyBwcmVwYXJpbmcgdG8gc3BlYWsgKi9cbkBrZXlmcmFtZXMgaGVhcnRiZWF0IHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIG9wYWNpdHk6IDE7XG4gICAgZmlsbDogdmFyKC0tb3JpZ2luYWwtY29sb3IpO1xuICB9XG4gIDUwJSB7XG4gICAgb3BhY2l0eTogMC41O1xuICAgIGZpbGw6IHJnYigyNDUgMjM4IDIyMyk7IC8qIGJnLWNyZWFtLTU1MCAqL1xuICB9XG59XG5cbi8qIHRvbmVkLWRvd24gZGlzc2FyeSBhbmltYXRpb24gdG8gaW5kaWNhdGUgYW4gZXJyb3IgKi9cbi8qIHRvbmVkLWRvd24gZXJyb3IgYW5pbWF0aW9uIHdpdGggcmVkdWNlZCBvcGFjaXR5ICovXG5Aa2V5ZnJhbWVzIGVycm9yQW5pbWF0aW9uIHtcbiAgMCUge1xuICAgIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpIHRyYW5zbGF0ZSgwJSwgMCUpO1xuICB9XG4gIDI1JSB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoLTVkZWcpIHRyYW5zbGF0ZSgtNSUsIDUlKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogcm90YXRlKDVkZWcpIHRyYW5zbGF0ZSg1JSwgLTUlKTtcbiAgfVxuICA3NSUge1xuICAgIHRyYW5zZm9ybTogcm90YXRlKC01ZGVnKSB0cmFuc2xhdGUoLTUlLCA1JSk7XG4gIH1cbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZykgdHJhbnNsYXRlKDAlLCAwJSk7XG4gIH1cbn1cblxuLm91dGVybW9zdC5lcnJvciB7XG4gIGFuaW1hdGlvbjogZXJyb3JBbmltYXRpb24gMjVzIDE7XG4gIGZpbGw6ICNmZjAwMDA7XG4gIGZpbGwtb3BhY2l0eTogMC43O1xufVxuXG4uc2Vjb25kLmVycm9yIHtcbiAgYW5pbWF0aW9uOiBlcnJvckFuaW1hdGlvbiAyNXMgMTtcbiAgZmlsbDogI2ZmMzMwMDtcbiAgZmlsbC1vcGFjaXR5OiAwLjc7XG59XG5cbi50aGlyZC5lcnJvciB7XG4gIGFuaW1hdGlvbjogZXJyb3JBbmltYXRpb24gMjVzIDE7XG4gIGZpbGw6ICNmZjY2MDA7XG4gIGZpbGwtb3BhY2l0eTogMC43O1xufVxuXG4uZm91cnRoLmVycm9yIHtcbiAgYW5pbWF0aW9uOiBlcnJvckFuaW1hdGlvbiAyNXMgMTtcbiAgZmlsbDogI2ZmOTkwMDtcbiAgZmlsbC1vcGFjaXR5OiAwLjc7XG59XG5cbi5maWZ0aC5lcnJvciB7XG4gIGFuaW1hdGlvbjogZXJyb3JBbmltYXRpb24gMjVzIDE7XG4gIGZpbGw6ICNmZmNjMDA7XG4gIGZpbGwtb3BhY2l0eTogMC43O1xufVxuXG4uaW5uZXJtb3N0LmVycm9yIHtcbiAgYW5pbWF0aW9uOiBlcnJvckFuaW1hdGlvbiAyNXMgMTtcbiAgZmlsbDogI2ZmZmYwMDtcbiAgZmlsbC1vcGFjaXR5OiAwLjc7XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvcmVjdGFuZ2xlcy5jc3NcIl0sXCJuYW1l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QUNiLGlCQUFpQjtBQUNuQjs7QUFFQTtFQUNFLCtCQUErQjtFQUMvQixhQUFhO0VBQ2IsaUJBQWlCO0FBQ25COztBQUVBO0VBQ0UsK0JBQStCO0VBQy9CLGFBQWE7RUFDYixpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSwrQkFBK0I7RUFDL0IsYUFBYTtFQUNiLGlCQUFpQjtBQUNuQjs7QUFFQTtFQUNFLCtCQUErQjtFQUMvQixhQUFhO0VBQ2IsaUJBQWlCO0FBQ25COztBQUVBO0VBQ0UsK0JBQStCO0VBQy9CLGFBQWE7RUFDYixpQkFBaUI7QUFDbkJcIixcInNvdXJjZXNDb250ZW50XCI6W1wiQGtleWZyYW1lcyBwdWxzZV9vdXRlcm1vc3Qge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45Mik7XFxuICB9XFxufVxcbi5vdXRlcm1vc3Qge1xcbiAgYW5pbWF0aW9uOiBwdWxzZV9vdXRlcm1vc3QgNXMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbkBrZXlmcmFtZXMgcHVsc2Vfc2Vjb25kIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODU2KTtcXG4gIH1cXG59XFxuLnNlY29uZCB7XFxuICBhbmltYXRpb246IHB1bHNlX3NlY29uZCA1cyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBwdWxzZV90aGlyZCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjc5Mik7XFxuICB9XFxufVxcbi50aGlyZCB7XFxuICBhbmltYXRpb246IHB1bHNlX3RoaXJkIDVzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHB1bHNlX2ZvdXJ0aCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjcyOCk7XFxuICB9XFxufVxcbi5mb3VydGgge1xcbiAgYW5pbWF0aW9uOiBwdWxzZV9mb3VydGggNXMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbkBrZXlmcmFtZXMgcHVsc2VfZmlmdGgge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC42NjQpO1xcbiAgfVxcbn1cXG4uZmlmdGgge1xcbiAgYW5pbWF0aW9uOiBwdWxzZV9maWZ0aCA1cyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBwdWxzZV9pbm5lcm1vc3Qge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC42KTtcXG4gIH1cXG59XFxuLmlubmVybW9zdCB7XFxuICBhbmltYXRpb246IHB1bHNlX2lubmVybW9zdCA1cyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuLyogcGxheWZ1bCBhbmltYXRpb24gdG8gaW5kaWNhdGUgUGkgaXMgc3BlYWtpbmcgKi9cXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX291dGVybW9zdCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDI1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45OTUpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkpO1xcbiAgfVxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjg5NSk7XFxuICB9XFxufVxcbi5vdXRlcm1vc3QucGlTcGVha2luZyB7XFxuICBhbmltYXRpb246IHNwZWFraW5nX291dGVybW9zdCAycyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBzcGVha2luZ19zZWNvbmQge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XFxuICB9XFxuICAyNSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTgpIHJvdGF0ZSgtMWRlZyk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODcpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44NjUpIHJvdGF0ZSgxZGVnKTtcXG4gIH1cXG59XFxuLnNlY29uZC5waVNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfc2Vjb25kIDJzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX3RoaXJkIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgMjUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjk2NSkgcm90YXRlKC0yZGVnKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44NCkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjgzNSkgcm90YXRlKDJkZWcpO1xcbiAgfVxcbn1cXG4udGhpcmQucGlTcGVha2luZyB7XFxuICBhbmltYXRpb246IHNwZWFraW5nX3RoaXJkIDJzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX2ZvdXJ0aCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDI1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45NSkgcm90YXRlKC0zZGVnKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44MSkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjgwNSkgcm90YXRlKDNkZWcpO1xcbiAgfVxcbn1cXG4uZm91cnRoLnBpU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiBzcGVha2luZ19mb3VydGggMnMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbkBrZXlmcmFtZXMgc3BlYWtpbmdfZmlmdGgge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XFxuICB9XFxuICAyNSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTM1KSByb3RhdGUoLTRkZWcpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjc4KSByb3RhdGUoMGRlZyk7XFxuICB9XFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzc1KSByb3RhdGUoNGRlZyk7XFxuICB9XFxufVxcbi5maWZ0aC5waVNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfZmlmdGggMnMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbkBrZXlmcmFtZXMgc3BlYWtpbmdfaW5uZXJtb3N0IHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgMjUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkyKSByb3RhdGUoLTVkZWcpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjc1KSByb3RhdGUoMGRlZyk7XFxuICB9XFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzQ1KSByb3RhdGUoNWRlZyk7XFxuICB9XFxufVxcbi5pbm5lcm1vc3QucGlTcGVha2luZyB7XFxuICBhbmltYXRpb246IHNwZWFraW5nX2lubmVybW9zdCAycyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuLyogd2F2ZSBhbmltYXRpb24gdG8gaW5kaWNhdGUgdXNlciBpcyBzcGVha2luZyAqL1xcbkBrZXlmcmFtZXMgdXNlclNwZWFraW5nQW5pbWF0aW9uIHtcXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuMDUpIHNjYWxlWCh2YXIoLS13aWR0aC1mYWN0b3IpKVxcbiAgICAgIHRyYW5zbGF0ZVgoY2FsYygtNTAlICsgdmFyKC0tc3ByZWFkLWFtb3VudCkpKTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgxKSBzY2FsZVgodmFyKC0td2lkdGgtZmFjdG9yKSlcXG4gICAgICB0cmFuc2xhdGVYKGNhbGMoLTUwJSArIHZhcigtLXNwcmVhZC1hbW91bnQpKSk7XFxuICB9XFxufVxcbi8qIHVzZXIgc3BlYWtpbmcgb3NjaWxsYXRpb24gYW5pbWF0aW9uICovXFxuQGtleWZyYW1lcyB3YXZlZm9ybV9vdXRlcm1vc3Qge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMSkgc2NhbGVYKDEpO1xcbiAgfVxcbiAgMjUlLFxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC45KSBzY2FsZVgoMC45KTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyB3YXZlZm9ybV9zZWNvbmQge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC45KSBzY2FsZVgoMC45KTtcXG4gIH1cXG4gIDI1JSxcXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuOCkgc2NhbGVYKDAuOCk7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgd2F2ZWZvcm1fdGhpcmQge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC44KSBzY2FsZVgoMC44KTtcXG4gIH1cXG4gIDI1JSxcXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNykgc2NhbGVYKDAuNyk7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgd2F2ZWZvcm1fZm91cnRoIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNykgc2NhbGVYKDAuNyk7XFxuICB9XFxuICAyNSUsXFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjYpIHNjYWxlWCgwLjYpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIHdhdmVmb3JtX2ZpZnRoIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNikgc2NhbGVYKDAuNik7XFxuICB9XFxuICAyNSUsXFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjUpIHNjYWxlWCgwLjUpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIHdhdmVmb3JtX2lubmVybW9zdCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjUpIHNjYWxlWCgwLjUpO1xcbiAgfVxcbiAgMjUlLFxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC40KSBzY2FsZVgoMC40KTtcXG4gIH1cXG59XFxuXFxuLm91dGVybW9zdC51c2VyU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV9vdXRlcm1vc3QgMC43cyBpbmZpbml0ZSBhbHRlcm5hdGU7XFxufVxcblxcbi5zZWNvbmQudXNlclNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogd2F2ZWZvcm1fc2Vjb25kIDAuNjVzIGluZmluaXRlIGFsdGVybmF0ZTtcXG59XFxuXFxuLnRoaXJkLnVzZXJTcGVha2luZyB7XFxuICBhbmltYXRpb246IHdhdmVmb3JtX3RoaXJkIDAuNnMgaW5maW5pdGUgYWx0ZXJuYXRlO1xcbn1cXG5cXG4uZm91cnRoLnVzZXJTcGVha2luZyB7XFxuICBhbmltYXRpb246IHdhdmVmb3JtX2ZvdXJ0aCAwLjU1cyBpbmZpbml0ZSBhbHRlcm5hdGU7XFxufVxcblxcbi5maWZ0aC51c2VyU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV9maWZ0aCAwLjVzIGluZmluaXRlIGFsdGVybmF0ZTtcXG59XFxuXFxuLmlubmVybW9zdC51c2VyU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV9pbm5lcm1vc3QgMC40NXMgaW5maW5pdGUgYWx0ZXJuYXRlO1xcbn1cXG5cXG4vKiBmbGlwY2FyZCBhbmltYXRpb24gdG8gaW5kaWNhdGUgU2F5LCBQaSBpcyB0cmFuc2NyaWJpbmcgYXVkaW8gdG8gdGV4dCAqL1xcbkBrZXlmcmFtZXMgdHJhbnNjcmliaW5nRmxpcCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZVkoMGRlZyk7XFxuICAgIGZpbGw6IHZhcigtLW9yaWdpbmFsLWNvbG9yKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlWSgxODBkZWcpO1xcbiAgICBmaWxsOiB2YXIoLS10cmFuc2NyaWJpbmctY29sb3IpO1xcbiAgfVxcbn1cXG5cXG4ub3V0ZXJtb3N0LnRyYW5zY3JpYmluZyB7XFxuICAtLW9yaWdpbmFsLWNvbG9yOiAjZTRmMmQxO1xcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICNiM2UwZmU7XFxuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMS41cyBpbmZpbml0ZTtcXG59XFxuXFxuLnNlY29uZC50cmFuc2NyaWJpbmcge1xcbiAgLS1vcmlnaW5hbC1jb2xvcjogI2NjZThiNTtcXG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjODljMmZmO1xcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDEuNnMgaW5maW5pdGU7XFxufVxcblxcbi50aGlyZC50cmFuc2NyaWJpbmcge1xcbiAgLS1vcmlnaW5hbC1jb2xvcjogI2IzZGI5NTtcXG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjNWZhNGZmO1xcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDEuN3MgaW5maW5pdGU7XFxufVxcblxcbi5mb3VydGgudHJhbnNjcmliaW5nIHtcXG4gIC0tb3JpZ2luYWwtY29sb3I6ICM5YmQwNzg7XFxuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogIzM1ODZmZjtcXG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAxLjhzIGluZmluaXRlO1xcbn1cXG5cXG4uZmlmdGgudHJhbnNjcmliaW5nIHtcXG4gIC0tb3JpZ2luYWwtY29sb3I6ICM4M2M1NWM7XFxuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogIzBiNjllMztcXG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAxLjlzIGluZmluaXRlO1xcbn1cXG5cXG4uaW5uZXJtb3N0LnRyYW5zY3JpYmluZyB7XFxuICAtLW9yaWdpbmFsLWNvbG9yOiAjNDI4YTJmO1xcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICMwMDUzYmY7XFxuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMnMgaW5maW5pdGU7XFxufVxcblxcbi8qIGhlYXJ0YmVhdCBhbmltYXRpb24gdG8gaW5kaWNhdGUgUGkgaXMgcHJlcGFyaW5nIHRvIHNwZWFrICovXFxuQGtleWZyYW1lcyBoZWFydGJlYXQge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgb3BhY2l0eTogMTtcXG4gICAgZmlsbDogdmFyKC0tb3JpZ2luYWwtY29sb3IpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgb3BhY2l0eTogMC41O1xcbiAgICBmaWxsOiByZ2IoMjQ1IDIzOCAyMjMpOyAvKiBiZy1jcmVhbS01NTAgKi9cXG4gIH1cXG59XFxuXFxuLyogdG9uZWQtZG93biBkaXNzYXJ5IGFuaW1hdGlvbiB0byBpbmRpY2F0ZSBhbiBlcnJvciAqL1xcbi8qIHRvbmVkLWRvd24gZXJyb3IgYW5pbWF0aW9uIHdpdGggcmVkdWNlZCBvcGFjaXR5ICovXFxuQGtleWZyYW1lcyBlcnJvckFuaW1hdGlvbiB7XFxuICAwJSB7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpIHRyYW5zbGF0ZSgwJSwgMCUpO1xcbiAgfVxcbiAgMjUlIHtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGUoLTVkZWcpIHRyYW5zbGF0ZSgtNSUsIDUlKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlKDVkZWcpIHRyYW5zbGF0ZSg1JSwgLTUlKTtcXG4gIH1cXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlKC01ZGVnKSB0cmFuc2xhdGUoLTUlLCA1JSk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZykgdHJhbnNsYXRlKDAlLCAwJSk7XFxuICB9XFxufVxcblxcbi5vdXRlcm1vc3QuZXJyb3Ige1xcbiAgYW5pbWF0aW9uOiBlcnJvckFuaW1hdGlvbiAyNXMgMTtcXG4gIGZpbGw6ICNmZjAwMDA7XFxuICBmaWxsLW9wYWNpdHk6IDAuNztcXG59XFxuXFxuLnNlY29uZC5lcnJvciB7XFxuICBhbmltYXRpb246IGVycm9yQW5pbWF0aW9uIDI1cyAxO1xcbiAgZmlsbDogI2ZmMzMwMDtcXG4gIGZpbGwtb3BhY2l0eTogMC43O1xcbn1cXG5cXG4udGhpcmQuZXJyb3Ige1xcbiAgYW5pbWF0aW9uOiBlcnJvckFuaW1hdGlvbiAyNXMgMTtcXG4gIGZpbGw6ICNmZjY2MDA7XFxuICBmaWxsLW9wYWNpdHk6IDAuNztcXG59XFxuXFxuLmZvdXJ0aC5lcnJvciB7XFxuICBhbmltYXRpb246IGVycm9yQW5pbWF0aW9uIDI1cyAxO1xcbiAgZmlsbDogI2ZmOTkwMDtcXG4gIGZpbGwtb3BhY2l0eTogMC43O1xcbn1cXG5cXG4uZmlmdGguZXJyb3Ige1xcbiAgYW5pbWF0aW9uOiBlcnJvckFuaW1hdGlvbiAyNXMgMTtcXG4gIGZpbGw6ICNmZmNjMDA7XFxuICBmaWxsLW9wYWNpdHk6IDAuNztcXG59XFxuXFxuLmlubmVybW9zdC5lcnJvciB7XFxuICBhbmltYXRpb246IGVycm9yQW5pbWF0aW9uIDI1cyAxO1xcbiAgZmlsbDogI2ZmZmYwMDtcXG4gIGZpbGwtb3BhY2l0eTogMC43O1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYC5oaWRkZW4ge1xuICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG59XG5cbiNzYXlwaS1jYWxsQnV0dG9uLmRpc2FibGVkIHN2ZyBwYXRoLmNpcmNsZSB7XG4gIGZpbGw6IHJnYigyNDUsIDIzOCwgMjIzKTsgLyogYmctY3JlYW0tNTUwICovXG59XG5cbi5tb2JpbGUtZGV2aWNlIHtcbiAgLyogbWF4aW1pemUgKG1vYmlsZSB2aWV3KSBidXR0b24gaXMgb25seSBkaXNwbGF5ZWQgb24gY29tcGF0aWJsZSBkZXZpY2VzICovXG59XG4ubW9iaWxlLWRldmljZSAjc2F5cGktZW50ZXJCdXR0b24sXG4ubW9iaWxlLWRldmljZSAjc2F5cGktZXhpdEJ1dHRvbiB7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgdG9wOiA0cmVtO1xuICBsZWZ0OiAxLjI1cmVtO1xuICB3aWR0aDogM3JlbTtcbiAgaGVpZ2h0OiAzcmVtO1xuICBwYWRkaW5nOiA2cHg7XG4gIGJvcmRlcjogMDtcbiAgei1pbmRleDogNjA7XG59YCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGVzL2NvbW1vbi5zY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0Usd0JBQUE7QUFDRjs7QUFFQTtFQUNFLHdCQUFBLEVBQUEsaUJBQUE7QUFDRjs7QUFFQTtFQUNFLDBFQUFBO0FBQ0Y7QUFBRTs7RUFFRSxlQUFBO0VBQ0EsU0FBQTtFQUNBLGFBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtFQUNBLFlBQUE7RUFDQSxTQUFBO0VBQ0EsV0FBQTtBQUVKXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi5oaWRkZW4ge1xcbiAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xcbn1cXG5cXG4jc2F5cGktY2FsbEJ1dHRvbi5kaXNhYmxlZCBzdmcgcGF0aC5jaXJjbGUge1xcbiAgZmlsbDogcmdiKDI0NSAyMzggMjIzKTsgLyogYmctY3JlYW0tNTUwICovXFxufVxcblxcbi5tb2JpbGUtZGV2aWNlIHtcXG4gIC8qIG1heGltaXplIChtb2JpbGUgdmlldykgYnV0dG9uIGlzIG9ubHkgZGlzcGxheWVkIG9uIGNvbXBhdGlibGUgZGV2aWNlcyAqL1xcbiAgI3NheXBpLWVudGVyQnV0dG9uLFxcbiAgI3NheXBpLWV4aXRCdXR0b24ge1xcbiAgICBwb3NpdGlvbjogZml4ZWQ7XFxuICAgIHRvcDogNHJlbTtcXG4gICAgbGVmdDogMS4yNXJlbTtcXG4gICAgd2lkdGg6IDNyZW07XFxuICAgIGhlaWdodDogM3JlbTtcXG4gICAgcGFkZGluZzogNnB4O1xcbiAgICBib3JkZXI6IDA7XFxuICAgIHotaW5kZXg6IDYwO1xcbiAgfVxcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYEBrZXlmcmFtZXMgcHVsc2Uge1xuICAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45KTtcbiAgfVxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICB9XG59XG5odG1sLmRlc2t0b3AtdmlldyAjc2F5cGktdGFsa0J1dHRvbiB7XG4gIC8qIG5vdCBuZWVkZWQgb24gZGVza3RvcCB3aXRoIGNhbGwgYnV0dG9uICovXG4gIGRpc3BsYXk6IG5vbmU7XG59XG5odG1sLmRlc2t0b3AtdmlldyAjc2F5cGktY2FsbEJ1dHRvbiB7XG4gIGhlaWdodDogMi4yNXJlbTtcbiAgd2lkdGg6IDIuMjVyZW07XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgbWFyZ2luOiAwLjVyZW0gMCAwLjVyZW0gMDtcbn1cbmh0bWwuZGVza3RvcC12aWV3IC5zYXlwaS1wcm9tcHQtY29udGFpbmVyIHtcbiAgLyogbWFrZSByb29tIGluIHRoZSBwcm9tcHQgdGV4dCBhcmVhIGZvciB0aGUgY2FsbCBidXR0b24gKi9cbiAgcGFkZGluZy1yaWdodDogMDtcbn1cbmh0bWwuZGVza3RvcC12aWV3ICNzYXlwaS1ub3RpZmljYXRpb24gPiBzdmcge1xuICB3aWR0aDogM3JlbTtcbiAgaGVpZ2h0OiAzcmVtO1xuICBib3R0b206IDRyZW07XG4gIHJpZ2h0OiAxMnJlbTtcbiAgcG9zaXRpb246IGZpeGVkO1xufVxuaHRtbC5kZXNrdG9wLXZpZXcgI3NheXBpLWV4aXRCdXR0b24ge1xuICBkaXNwbGF5OiBub25lO1xufWAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlcy9kZXNrdG9wLnNjc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQ0U7RUFDRTtJQUNFLG1CQUFBO0VBQUo7RUFFRTtJQUNFLHFCQUFBO0VBQUo7RUFFRTtJQUNFLG1CQUFBO0VBQUo7QUFDRjtBQUdFO0VBQ0UsMkNBQUE7RUFDQSxhQUFBO0FBREo7QUFJRTtFQUNFLGVBQUE7RUFDQSxjQUFBO0VBQ0Esa0JBQUE7RUFDQSx5QkFBQTtBQUZKO0FBS0U7RUFDRSwwREFBQTtFQUNBLGdCQUFBO0FBSEo7QUFNRTtFQUNFLFdBQUE7RUFDQSxZQUFBO0VBQ0EsWUFBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0FBSko7QUFPRTtFQUNFLGFBQUE7QUFMSlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJodG1sLmRlc2t0b3AtdmlldyB7XFxuICBAa2V5ZnJhbWVzIHB1bHNlIHtcXG4gICAgMCUge1xcbiAgICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICAgIH1cXG4gICAgNTAlIHtcXG4gICAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOSk7XFxuICAgIH1cXG4gICAgMTAwJSB7XFxuICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gICAgfVxcbiAgfVxcblxcbiAgI3NheXBpLXRhbGtCdXR0b24ge1xcbiAgICAvKiBub3QgbmVlZGVkIG9uIGRlc2t0b3Agd2l0aCBjYWxsIGJ1dHRvbiAqL1xcbiAgICBkaXNwbGF5OiBub25lO1xcbiAgfVxcblxcbiAgI3NheXBpLWNhbGxCdXR0b24ge1xcbiAgICBoZWlnaHQ6IDIuMjVyZW07XFxuICAgIHdpZHRoOiAyLjI1cmVtO1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICAgIG1hcmdpbjogMC41cmVtIDAgMC41cmVtIDA7XFxuICB9XFxuXFxuICAuc2F5cGktcHJvbXB0LWNvbnRhaW5lciB7XFxuICAgIC8qIG1ha2Ugcm9vbSBpbiB0aGUgcHJvbXB0IHRleHQgYXJlYSBmb3IgdGhlIGNhbGwgYnV0dG9uICovXFxuICAgIHBhZGRpbmctcmlnaHQ6IDA7XFxuICB9XFxuXFxuICAjc2F5cGktbm90aWZpY2F0aW9uID4gc3ZnIHtcXG4gICAgd2lkdGg6IDNyZW07XFxuICAgIGhlaWdodDogM3JlbTtcXG4gICAgYm90dG9tOiA0cmVtO1xcbiAgICByaWdodDogMTJyZW07XFxuICAgIHBvc2l0aW9uOiBmaXhlZDtcXG4gIH1cXG5cXG4gICNzYXlwaS1leGl0QnV0dG9uIHtcXG4gICAgZGlzcGxheTogbm9uZTtcXG4gIH1cXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGBodG1sLm1vYmlsZS12aWV3IHtcbiAgLyogUGkgY29udHJvbHM6IGVsbGlwc2lzLCBleHBlcmllbmNlcyAqL1xuICAvKiBoaWRlIGFuIHVnbHkgYXJ0aWZhY3QgKi9cbiAgLyogUGkgY29udHJvbHM6IG11dGUvdW5tdXRlICovXG4gIC8qIGZpeCBhbiBhbGlnbm1lbnQgaXNzdWUgd2l0aCB0aGUgXCJuZXcgdWkgbGF5b3V0XCIgKi9cbn1cbmh0bWwubW9iaWxlLXZpZXcgI3NheXBpLXBhbmVsLFxuaHRtbC5tb2JpbGUtdmlldyAubm90aWZpY2F0aW9uIHtcbiAgd2lkdGg6IDEwMCU7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgbGVmdDogMDtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNDUsIDIzOCwgMjIzLCAwLjk4KTtcbiAgaGVpZ2h0OiAxMDBzdmg7XG4gIHRvcDogMDtcbn1cbmh0bWwubW9iaWxlLXZpZXcgI3NheXBpLXRhbGtCdXR0b24ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgYm9yZGVyLXJhZGl1czogMDtcbiAgbWFyZ2luOiAwO1xufVxuaHRtbC5tb2JpbGUtdmlldyAjc2F5cGktdGFsa0J1dHRvbiBzdmcge1xuICB3aWR0aDogMTAwdnc7XG4gIGhlaWdodDogMTAwc3ZoO1xufVxuaHRtbC5tb2JpbGUtdmlldyAjc2F5cGktbm90aWZpY2F0aW9uIHtcbiAgei1pbmRleDogMTAwO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbn1cbmh0bWwubW9iaWxlLXZpZXcgI3NheXBpLW5vdGlmaWNhdGlvbiBzdmcge1xuICB3aWR0aDogNzUlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIG1hcmdpbjogYXV0bztcbn1cbmh0bWwubW9iaWxlLXZpZXcgI19fbmV4dCA+IG1haW4gPiBkaXYgPiBkaXYgPiBkaXYuZml4ZWQudG9wLTQucmlnaHQtNiA+IGJ1dHRvbixcbmh0bWwubW9iaWxlLXZpZXcgI3NheXBpLWV4cGVyaWVuY2VzLWJ1dHRvbiB7XG4gIHRyYW5zZm9ybTogc2NhbGUoMS41KTtcbn1cbmh0bWwubW9iaWxlLXZpZXcgZGl2LmJnLWdyYWRpZW50LXRvLWIge1xuICBkaXNwbGF5OiBub25lO1xufVxuaHRtbC5tb2JpbGUtdmlldyAjc2F5cGktYXVkaW8tY29udHJvbHMge1xuICAvKiBoaWRlIHRoZSB2b2ljZSBvcHRpb25zICovXG4gIC8qIHNjYWxlIHRoZSBtdXRlIGJ1dHRvbiAqL1xufVxuaHRtbC5tb2JpbGUtdmlldyAjc2F5cGktYXVkaW8tY29udHJvbHMgZGl2LnAtMSB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5odG1sLm1vYmlsZS12aWV3ICNzYXlwaS1hdWRpby1jb250cm9scyBidXR0b24uZ3JvdXAge1xuICB0cmFuc2Zvcm06IHNjYWxlKDIpICFpbXBvcnRhbnQ7XG4gIHotaW5kZXg6IDUwO1xuICAvKiBoaWRlIHRoZSB2b2ljZSBzZWxlY3RvciB0d2lzdHkgKi9cbn1cbmh0bWwubW9iaWxlLXZpZXcgI3NheXBpLWF1ZGlvLWNvbnRyb2xzIGJ1dHRvbi5ncm91cCArIGJ1dHRvbiB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5odG1sLm1vYmlsZS12aWV3IC50ZXh0LWJvZHktY2hhdC1tIHtcbiAgcGFkZGluZy10b3A6IDA7XG59XG5odG1sLm1vYmlsZS12aWV3ICNzYXlwaS1lbnRlckJ1dHRvbiB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5odG1sLm1vYmlsZS12aWV3ICNzYXlwaS1mb290ZXIge1xuICBkaXNwbGF5OiBub25lO1xufVxuaHRtbC5tb2JpbGUtdmlldyAjc2F5cGktcHJvbXB0LWFuY2VzdG9yIHtcbiAgLyogaGlkZXMgdGhlIHJvdyBjb250YWluaW5nIHRoZSB0ZXh0IGFyZWEgY29udHJvbCAqL1xuICAvKiBpbXBvcnRhbnQ6IGhpZGVzIHZpcnR1YWwga2V5Ym9hcmQgb24gYW5kcm9pZCAqL1xuICBkaXNwbGF5OiBub25lO1xuICAvKiB0aGUgY2FsbCBidXR0b24sIHVzdWFsbHkgbmVzdGVkIGluIHRoZSBwcm9tcHQsIGlzIGRldGFjaGVkIHdoaWxlIGluIG1vYmlsZSB2aWV3ICovXG59XG5odG1sLm1vYmlsZS12aWV3ICNzYXlwaS1zdWJtaXRCdXR0b24ge1xuICBkaXNwbGF5OiBub25lO1xufVxuaHRtbC5tb2JpbGUtdmlldyAjc2F5cGktY2FsbEJ1dHRvbiB7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgYm90dG9tOiA0cmVtO1xuICBsZWZ0OiAwO1xuICByaWdodDogMDtcbiAgbWFyZ2luOiBhdXRvO1xuICB3aWR0aDogNC41cmVtO1xuICBoZWlnaHQ6IDQuNXJlbTtcbiAgcGFkZGluZzogNnB4O1xuICBib3JkZXI6IDA7XG4gIHotaW5kZXg6IDgwO1xufWAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlcy9tb2JpbGUuc2Nzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQWdDRSx1Q0FBQTtFQU1BLDBCQUFBO0VBS0EsNkJBQUE7RUFpQkEsb0RBQUE7QUF2REY7QUFKRTs7RUFFRSxXQUFBO0VBQ0EsZUFBQTtFQUNBLE9BQUE7RUFDQSwyQ0FBQTtFQUVBLGNBQUE7RUFDQSxNQUFBO0FBS0o7QUFGRTtFQUNFLDZCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxTQUFBO0FBSUo7QUFISTtFQUNFLFlBQUE7RUFDQSxjQUFBO0FBS047QUFERTtFQUNFLFlBQUE7RUFDQSw2QkFBQTtBQUdKO0FBRkk7RUFDRSxVQUFBO0VBQ0EsWUFBQTtFQUNBLFlBQUE7QUFJTjtBQUNFOztFQUVFLHFCQUFBO0FBQ0o7QUFHRTtFQUNFLGFBQUE7QUFESjtBQUtFO0VBQ0UsMkJBQUE7RUFJQSwwQkFBQTtBQU5KO0FBR0k7RUFDRSxhQUFBO0FBRE47QUFJSTtFQUNFLDhCQUFBO0VBQ0EsV0FBQTtFQUNBLG1DQUFBO0FBRk47QUFHTTtFQUNFLGFBQUE7QUFEUjtBQU9FO0VBQ0UsY0FBQTtBQUxKO0FBUUU7RUFDRSxhQUFBO0FBTko7QUFTRTtFQUNFLGFBQUE7QUFQSjtBQVVFO0VBQ0UsbURBQUE7RUFDQSxpREFBQTtFQUNBLGFBQUE7RUFDQSxvRkFBQTtBQVJKO0FBV0U7RUFDRSxhQUFBO0FBVEo7QUFZRTtFQUNFLGVBQUE7RUFDQSxZQUFBO0VBQ0EsT0FBQTtFQUNBLFFBQUE7RUFDQSxZQUFBO0VBQ0EsYUFBQTtFQUNBLGNBQUE7RUFDQSxZQUFBO0VBQ0EsU0FBQTtFQUNBLFdBQUE7QUFWSlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJodG1sLm1vYmlsZS12aWV3IHtcXG4gICNzYXlwaS1wYW5lbCxcXG4gIC5ub3RpZmljYXRpb24ge1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgcG9zaXRpb246IGZpeGVkO1xcbiAgICBsZWZ0OiAwO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI0NSwgMjM4LCAyMjMsIDAuOTgpO1xcblxcbiAgICBoZWlnaHQ6IDEwMHN2aDtcXG4gICAgdG9wOiAwO1xcbiAgfVxcblxcbiAgI3NheXBpLXRhbGtCdXR0b24ge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gICAgYm9yZGVyLXJhZGl1czogMDtcXG4gICAgbWFyZ2luOiAwO1xcbiAgICBzdmcge1xcbiAgICAgIHdpZHRoOiAxMDB2dztcXG4gICAgICBoZWlnaHQ6IDEwMHN2aDtcXG4gICAgfVxcbiAgfVxcblxcbiAgI3NheXBpLW5vdGlmaWNhdGlvbiB7XFxuICAgIHotaW5kZXg6IDEwMDtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICAgIHN2ZyB7XFxuICAgICAgd2lkdGg6IDc1JTtcXG4gICAgICBoZWlnaHQ6IDEwMCU7XFxuICAgICAgbWFyZ2luOiBhdXRvO1xcbiAgICB9XFxuICB9XFxuXFxuICAvKiBQaSBjb250cm9sczogZWxsaXBzaXMsIGV4cGVyaWVuY2VzICovXFxuICAjX19uZXh0ID4gbWFpbiA+IGRpdiA+IGRpdiA+IGRpdi5maXhlZC50b3AtNC5yaWdodC02ID4gYnV0dG9uLFxcbiAgI3NheXBpLWV4cGVyaWVuY2VzLWJ1dHRvbiB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMS41KTtcXG4gIH1cXG5cXG4gIC8qIGhpZGUgYW4gdWdseSBhcnRpZmFjdCAqL1xcbiAgZGl2LmJnLWdyYWRpZW50LXRvLWIge1xcbiAgICBkaXNwbGF5OiBub25lO1xcbiAgfVxcblxcbiAgLyogUGkgY29udHJvbHM6IG11dGUvdW5tdXRlICovXFxuICAjc2F5cGktYXVkaW8tY29udHJvbHMge1xcbiAgICAvKiBoaWRlIHRoZSB2b2ljZSBvcHRpb25zICovXFxuICAgIGRpdi5wLTEge1xcbiAgICAgIGRpc3BsYXk6IG5vbmU7XFxuICAgIH1cXG4gICAgLyogc2NhbGUgdGhlIG11dGUgYnV0dG9uICovXFxuICAgIGJ1dHRvbi5ncm91cCB7XFxuICAgICAgdHJhbnNmb3JtOiBzY2FsZSgyKSAhaW1wb3J0YW50O1xcbiAgICAgIHotaW5kZXg6IDUwO1xcbiAgICAgIC8qIGhpZGUgdGhlIHZvaWNlIHNlbGVjdG9yIHR3aXN0eSAqL1xcbiAgICAgICsgYnV0dG9uIHtcXG4gICAgICAgIGRpc3BsYXk6IG5vbmU7XFxuICAgICAgfVxcbiAgICB9XFxuICB9XFxuXFxuICAvKiBmaXggYW4gYWxpZ25tZW50IGlzc3VlIHdpdGggdGhlIFxcXCJuZXcgdWkgbGF5b3V0XFxcIiAqL1xcbiAgLnRleHQtYm9keS1jaGF0LW0ge1xcbiAgICBwYWRkaW5nLXRvcDogMDtcXG4gIH1cXG5cXG4gICNzYXlwaS1lbnRlckJ1dHRvbiB7XFxuICAgIGRpc3BsYXk6IG5vbmU7XFxuICB9XFxuXFxuICAjc2F5cGktZm9vdGVyIHtcXG4gICAgZGlzcGxheTogbm9uZTtcXG4gIH1cXG5cXG4gICNzYXlwaS1wcm9tcHQtYW5jZXN0b3Ige1xcbiAgICAvKiBoaWRlcyB0aGUgcm93IGNvbnRhaW5pbmcgdGhlIHRleHQgYXJlYSBjb250cm9sICovXFxuICAgIC8qIGltcG9ydGFudDogaGlkZXMgdmlydHVhbCBrZXlib2FyZCBvbiBhbmRyb2lkICovXFxuICAgIGRpc3BsYXk6IG5vbmU7XFxuICAgIC8qIHRoZSBjYWxsIGJ1dHRvbiwgdXN1YWxseSBuZXN0ZWQgaW4gdGhlIHByb21wdCwgaXMgZGV0YWNoZWQgd2hpbGUgaW4gbW9iaWxlIHZpZXcgKi9cXG4gIH1cXG5cXG4gICNzYXlwaS1zdWJtaXRCdXR0b24ge1xcbiAgICBkaXNwbGF5OiBub25lO1xcbiAgfVxcblxcbiAgI3NheXBpLWNhbGxCdXR0b24ge1xcbiAgICBwb3NpdGlvbjogZml4ZWQ7XFxuICAgIGJvdHRvbTogNHJlbTtcXG4gICAgbGVmdDogMDtcXG4gICAgcmlnaHQ6IDA7XFxuICAgIG1hcmdpbjogYXV0bztcXG4gICAgd2lkdGg6IDQuNXJlbTtcXG4gICAgaGVpZ2h0OiA0LjVyZW07XFxuICAgIHBhZGRpbmc6IDZweDtcXG4gICAgYm9yZGVyOiAwO1xcbiAgICB6LWluZGV4OiA4MDtcXG4gIH1cXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUiA9IHR5cGVvZiBSZWZsZWN0ID09PSAnb2JqZWN0JyA/IFJlZmxlY3QgOiBudWxsXG52YXIgUmVmbGVjdEFwcGx5ID0gUiAmJiB0eXBlb2YgUi5hcHBseSA9PT0gJ2Z1bmN0aW9uJ1xuICA/IFIuYXBwbHlcbiAgOiBmdW5jdGlvbiBSZWZsZWN0QXBwbHkodGFyZ2V0LCByZWNlaXZlciwgYXJncykge1xuICAgIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHkuY2FsbCh0YXJnZXQsIHJlY2VpdmVyLCBhcmdzKTtcbiAgfVxuXG52YXIgUmVmbGVjdE93bktleXNcbmlmIChSICYmIHR5cGVvZiBSLm93bktleXMgPT09ICdmdW5jdGlvbicpIHtcbiAgUmVmbGVjdE93bktleXMgPSBSLm93bktleXNcbn0gZWxzZSBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuICBSZWZsZWN0T3duS2V5cyA9IGZ1bmN0aW9uIFJlZmxlY3RPd25LZXlzKHRhcmdldCkge1xuICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0YXJnZXQpXG4gICAgICAuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHModGFyZ2V0KSk7XG4gIH07XG59IGVsc2Uge1xuICBSZWZsZWN0T3duS2V5cyA9IGZ1bmN0aW9uIFJlZmxlY3RPd25LZXlzKHRhcmdldCkge1xuICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0YXJnZXQpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBQcm9jZXNzRW1pdFdhcm5pbmcod2FybmluZykge1xuICBpZiAoY29uc29sZSAmJiBjb25zb2xlLndhcm4pIGNvbnNvbGUud2Fybih3YXJuaW5nKTtcbn1cblxudmFyIE51bWJlcklzTmFOID0gTnVtYmVyLmlzTmFOIHx8IGZ1bmN0aW9uIE51bWJlcklzTmFOKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgRXZlbnRFbWl0dGVyLmluaXQuY2FsbCh0aGlzKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xubW9kdWxlLmV4cG9ydHMub25jZSA9IG9uY2U7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzQ291bnQgPSAwO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG52YXIgZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG5mdW5jdGlvbiBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKSB7XG4gIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJsaXN0ZW5lclwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBGdW5jdGlvbi4gUmVjZWl2ZWQgdHlwZSAnICsgdHlwZW9mIGxpc3RlbmVyKTtcbiAgfVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoRXZlbnRFbWl0dGVyLCAnZGVmYXVsdE1heExpc3RlbmVycycsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZGVmYXVsdE1heExpc3RlbmVycztcbiAgfSxcbiAgc2V0OiBmdW5jdGlvbihhcmcpIHtcbiAgICBpZiAodHlwZW9mIGFyZyAhPT0gJ251bWJlcicgfHwgYXJnIDwgMCB8fCBOdW1iZXJJc05hTihhcmcpKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVGhlIHZhbHVlIG9mIFwiZGVmYXVsdE1heExpc3RlbmVyc1wiIGlzIG91dCBvZiByYW5nZS4gSXQgbXVzdCBiZSBhIG5vbi1uZWdhdGl2ZSBudW1iZXIuIFJlY2VpdmVkICcgKyBhcmcgKyAnLicpO1xuICAgIH1cbiAgICBkZWZhdWx0TWF4TGlzdGVuZXJzID0gYXJnO1xuICB9XG59KTtcblxuRXZlbnRFbWl0dGVyLmluaXQgPSBmdW5jdGlvbigpIHtcblxuICBpZiAodGhpcy5fZXZlbnRzID09PSB1bmRlZmluZWQgfHxcbiAgICAgIHRoaXMuX2V2ZW50cyA9PT0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMpLl9ldmVudHMpIHtcbiAgICB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHRoaXMuX2V2ZW50c0NvdW50ID0gMDtcbiAgfVxuXG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59O1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbiBzZXRNYXhMaXN0ZW5lcnMobikge1xuICBpZiAodHlwZW9mIG4gIT09ICdudW1iZXInIHx8IG4gPCAwIHx8IE51bWJlcklzTmFOKG4pKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RoZSB2YWx1ZSBvZiBcIm5cIiBpcyBvdXQgb2YgcmFuZ2UuIEl0IG11c3QgYmUgYSBub24tbmVnYXRpdmUgbnVtYmVyLiBSZWNlaXZlZCAnICsgbiArICcuJyk7XG4gIH1cbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5mdW5jdGlvbiBfZ2V0TWF4TGlzdGVuZXJzKHRoYXQpIHtcbiAgaWYgKHRoYXQuX21heExpc3RlbmVycyA9PT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgcmV0dXJuIHRoYXQuX21heExpc3RlbmVycztcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5nZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbiBnZXRNYXhMaXN0ZW5lcnMoKSB7XG4gIHJldHVybiBfZ2V0TWF4TGlzdGVuZXJzKHRoaXMpO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gZW1pdCh0eXBlKSB7XG4gIHZhciBhcmdzID0gW107XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSBhcmdzLnB1c2goYXJndW1lbnRzW2ldKTtcbiAgdmFyIGRvRXJyb3IgPSAodHlwZSA9PT0gJ2Vycm9yJyk7XG5cbiAgdmFyIGV2ZW50cyA9IHRoaXMuX2V2ZW50cztcbiAgaWYgKGV2ZW50cyAhPT0gdW5kZWZpbmVkKVxuICAgIGRvRXJyb3IgPSAoZG9FcnJvciAmJiBldmVudHMuZXJyb3IgPT09IHVuZGVmaW5lZCk7XG4gIGVsc2UgaWYgKCFkb0Vycm9yKVxuICAgIHJldHVybiBmYWxzZTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmIChkb0Vycm9yKSB7XG4gICAgdmFyIGVyO1xuICAgIGlmIChhcmdzLmxlbmd0aCA+IDApXG4gICAgICBlciA9IGFyZ3NbMF07XG4gICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIC8vIE5vdGU6IFRoZSBjb21tZW50cyBvbiB0aGUgYHRocm93YCBsaW5lcyBhcmUgaW50ZW50aW9uYWwsIHRoZXkgc2hvd1xuICAgICAgLy8gdXAgaW4gTm9kZSdzIG91dHB1dCBpZiB0aGlzIHJlc3VsdHMgaW4gYW4gdW5oYW5kbGVkIGV4Y2VwdGlvbi5cbiAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgIH1cbiAgICAvLyBBdCBsZWFzdCBnaXZlIHNvbWUga2luZCBvZiBjb250ZXh0IHRvIHRoZSB1c2VyXG4gICAgdmFyIGVyciA9IG5ldyBFcnJvcignVW5oYW5kbGVkIGVycm9yLicgKyAoZXIgPyAnICgnICsgZXIubWVzc2FnZSArICcpJyA6ICcnKSk7XG4gICAgZXJyLmNvbnRleHQgPSBlcjtcbiAgICB0aHJvdyBlcnI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gIH1cblxuICB2YXIgaGFuZGxlciA9IGV2ZW50c1t0eXBlXTtcblxuICBpZiAoaGFuZGxlciA9PT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAodHlwZW9mIGhhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICBSZWZsZWN0QXBwbHkoaGFuZGxlciwgdGhpcywgYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGxlbiA9IGhhbmRsZXIubGVuZ3RoO1xuICAgIHZhciBsaXN0ZW5lcnMgPSBhcnJheUNsb25lKGhhbmRsZXIsIGxlbik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSlcbiAgICAgIFJlZmxlY3RBcHBseShsaXN0ZW5lcnNbaV0sIHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5mdW5jdGlvbiBfYWRkTGlzdGVuZXIodGFyZ2V0LCB0eXBlLCBsaXN0ZW5lciwgcHJlcGVuZCkge1xuICB2YXIgbTtcbiAgdmFyIGV2ZW50cztcbiAgdmFyIGV4aXN0aW5nO1xuXG4gIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpO1xuXG4gIGV2ZW50cyA9IHRhcmdldC5fZXZlbnRzO1xuICBpZiAoZXZlbnRzID09PSB1bmRlZmluZWQpIHtcbiAgICBldmVudHMgPSB0YXJnZXQuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgdGFyZ2V0Ll9ldmVudHNDb3VudCA9IDA7XG4gIH0gZWxzZSB7XG4gICAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gICAgaWYgKGV2ZW50cy5uZXdMaXN0ZW5lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0YXJnZXQuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgPyBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICAgICAgLy8gUmUtYXNzaWduIGBldmVudHNgIGJlY2F1c2UgYSBuZXdMaXN0ZW5lciBoYW5kbGVyIGNvdWxkIGhhdmUgY2F1c2VkIHRoZVxuICAgICAgLy8gdGhpcy5fZXZlbnRzIHRvIGJlIGFzc2lnbmVkIHRvIGEgbmV3IG9iamVjdFxuICAgICAgZXZlbnRzID0gdGFyZ2V0Ll9ldmVudHM7XG4gICAgfVxuICAgIGV4aXN0aW5nID0gZXZlbnRzW3R5cGVdO1xuICB9XG5cbiAgaWYgKGV4aXN0aW5nID09PSB1bmRlZmluZWQpIHtcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICBleGlzdGluZyA9IGV2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICAgICsrdGFyZ2V0Ll9ldmVudHNDb3VudDtcbiAgfSBlbHNlIHtcbiAgICBpZiAodHlwZW9mIGV4aXN0aW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICAgIGV4aXN0aW5nID0gZXZlbnRzW3R5cGVdID1cbiAgICAgICAgcHJlcGVuZCA/IFtsaXN0ZW5lciwgZXhpc3RpbmddIDogW2V4aXN0aW5nLCBsaXN0ZW5lcl07XG4gICAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgfSBlbHNlIGlmIChwcmVwZW5kKSB7XG4gICAgICBleGlzdGluZy51bnNoaWZ0KGxpc3RlbmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXhpc3RpbmcucHVzaChsaXN0ZW5lcik7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgICBtID0gX2dldE1heExpc3RlbmVycyh0YXJnZXQpO1xuICAgIGlmIChtID4gMCAmJiBleGlzdGluZy5sZW5ndGggPiBtICYmICFleGlzdGluZy53YXJuZWQpIHtcbiAgICAgIGV4aXN0aW5nLndhcm5lZCA9IHRydWU7XG4gICAgICAvLyBObyBlcnJvciBjb2RlIGZvciB0aGlzIHNpbmNlIGl0IGlzIGEgV2FybmluZ1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtc3ludGF4XG4gICAgICB2YXIgdyA9IG5ldyBFcnJvcignUG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSBsZWFrIGRldGVjdGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmcubGVuZ3RoICsgJyAnICsgU3RyaW5nKHR5cGUpICsgJyBsaXN0ZW5lcnMgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdhZGRlZC4gVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdpbmNyZWFzZSBsaW1pdCcpO1xuICAgICAgdy5uYW1lID0gJ01heExpc3RlbmVyc0V4Y2VlZGVkV2FybmluZyc7XG4gICAgICB3LmVtaXR0ZXIgPSB0YXJnZXQ7XG4gICAgICB3LnR5cGUgPSB0eXBlO1xuICAgICAgdy5jb3VudCA9IGV4aXN0aW5nLmxlbmd0aDtcbiAgICAgIFByb2Nlc3NFbWl0V2FybmluZyh3KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24gYWRkTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgcmV0dXJuIF9hZGRMaXN0ZW5lcih0aGlzLCB0eXBlLCBsaXN0ZW5lciwgZmFsc2UpO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucHJlcGVuZExpc3RlbmVyID1cbiAgICBmdW5jdGlvbiBwcmVwZW5kTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIHJldHVybiBfYWRkTGlzdGVuZXIodGhpcywgdHlwZSwgbGlzdGVuZXIsIHRydWUpO1xuICAgIH07XG5cbmZ1bmN0aW9uIG9uY2VXcmFwcGVyKCkge1xuICBpZiAoIXRoaXMuZmlyZWQpIHtcbiAgICB0aGlzLnRhcmdldC5yZW1vdmVMaXN0ZW5lcih0aGlzLnR5cGUsIHRoaXMud3JhcEZuKTtcbiAgICB0aGlzLmZpcmVkID0gdHJ1ZTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiB0aGlzLmxpc3RlbmVyLmNhbGwodGhpcy50YXJnZXQpO1xuICAgIHJldHVybiB0aGlzLmxpc3RlbmVyLmFwcGx5KHRoaXMudGFyZ2V0LCBhcmd1bWVudHMpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9vbmNlV3JhcCh0YXJnZXQsIHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBzdGF0ZSA9IHsgZmlyZWQ6IGZhbHNlLCB3cmFwRm46IHVuZGVmaW5lZCwgdGFyZ2V0OiB0YXJnZXQsIHR5cGU6IHR5cGUsIGxpc3RlbmVyOiBsaXN0ZW5lciB9O1xuICB2YXIgd3JhcHBlZCA9IG9uY2VXcmFwcGVyLmJpbmQoc3RhdGUpO1xuICB3cmFwcGVkLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHN0YXRlLndyYXBGbiA9IHdyYXBwZWQ7XG4gIHJldHVybiB3cmFwcGVkO1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbiBvbmNlKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpO1xuICB0aGlzLm9uKHR5cGUsIF9vbmNlV3JhcCh0aGlzLCB0eXBlLCBsaXN0ZW5lcikpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucHJlcGVuZE9uY2VMaXN0ZW5lciA9XG4gICAgZnVuY3Rpb24gcHJlcGVuZE9uY2VMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgY2hlY2tMaXN0ZW5lcihsaXN0ZW5lcik7XG4gICAgICB0aGlzLnByZXBlbmRMaXN0ZW5lcih0eXBlLCBfb25jZVdyYXAodGhpcywgdHlwZSwgbGlzdGVuZXIpKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbi8vIEVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZiBhbmQgb25seSBpZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cbiAgICBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgdmFyIGxpc3QsIGV2ZW50cywgcG9zaXRpb24sIGksIG9yaWdpbmFsTGlzdGVuZXI7XG5cbiAgICAgIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpO1xuXG4gICAgICBldmVudHMgPSB0aGlzLl9ldmVudHM7XG4gICAgICBpZiAoZXZlbnRzID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICBsaXN0ID0gZXZlbnRzW3R5cGVdO1xuICAgICAgaWYgKGxpc3QgPT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fCBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikge1xuICAgICAgICBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMClcbiAgICAgICAgICB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgZXZlbnRzW3R5cGVdO1xuICAgICAgICAgIGlmIChldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICAgICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdC5saXN0ZW5lciB8fCBsaXN0ZW5lcik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGxpc3QgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcG9zaXRpb24gPSAtMTtcblxuICAgICAgICBmb3IgKGkgPSBsaXN0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8IGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgICAgICBvcmlnaW5hbExpc3RlbmVyID0gbGlzdFtpXS5saXN0ZW5lcjtcbiAgICAgICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgaWYgKHBvc2l0aW9uID09PSAwKVxuICAgICAgICAgIGxpc3Quc2hpZnQoKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgc3BsaWNlT25lKGxpc3QsIHBvc2l0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSlcbiAgICAgICAgICBldmVudHNbdHlwZV0gPSBsaXN0WzBdO1xuXG4gICAgICAgIGlmIChldmVudHMucmVtb3ZlTGlzdGVuZXIgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgb3JpZ2luYWxMaXN0ZW5lciB8fCBsaXN0ZW5lcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub2ZmID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPVxuICAgIGZ1bmN0aW9uIHJlbW92ZUFsbExpc3RlbmVycyh0eXBlKSB7XG4gICAgICB2YXIgbGlzdGVuZXJzLCBldmVudHMsIGk7XG5cbiAgICAgIGV2ZW50cyA9IHRoaXMuX2V2ZW50cztcbiAgICAgIGlmIChldmVudHMgPT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgICAgIGlmIChldmVudHMucmVtb3ZlTGlzdGVuZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHRoaXMuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgICAgdGhpcy5fZXZlbnRzQ291bnQgPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50c1t0eXBlXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApXG4gICAgICAgICAgICB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGRlbGV0ZSBldmVudHNbdHlwZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhldmVudHMpO1xuICAgICAgICB2YXIga2V5O1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgIGtleSA9IGtleXNbaV07XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICAgICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgdGhpcy5fZXZlbnRzQ291bnQgPSAwO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgbGlzdGVuZXJzID0gZXZlbnRzW3R5cGVdO1xuXG4gICAgICBpZiAodHlwZW9mIGxpc3RlbmVycyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gICAgICB9IGVsc2UgaWYgKGxpc3RlbmVycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIExJRk8gb3JkZXJcbiAgICAgICAgZm9yIChpID0gbGlzdGVuZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbmZ1bmN0aW9uIF9saXN0ZW5lcnModGFyZ2V0LCB0eXBlLCB1bndyYXApIHtcbiAgdmFyIGV2ZW50cyA9IHRhcmdldC5fZXZlbnRzO1xuXG4gIGlmIChldmVudHMgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gW107XG5cbiAgdmFyIGV2bGlzdGVuZXIgPSBldmVudHNbdHlwZV07XG4gIGlmIChldmxpc3RlbmVyID09PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIFtdO1xuXG4gIGlmICh0eXBlb2YgZXZsaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJylcbiAgICByZXR1cm4gdW53cmFwID8gW2V2bGlzdGVuZXIubGlzdGVuZXIgfHwgZXZsaXN0ZW5lcl0gOiBbZXZsaXN0ZW5lcl07XG5cbiAgcmV0dXJuIHVud3JhcCA/XG4gICAgdW53cmFwTGlzdGVuZXJzKGV2bGlzdGVuZXIpIDogYXJyYXlDbG9uZShldmxpc3RlbmVyLCBldmxpc3RlbmVyLmxlbmd0aCk7XG59XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24gbGlzdGVuZXJzKHR5cGUpIHtcbiAgcmV0dXJuIF9saXN0ZW5lcnModGhpcywgdHlwZSwgdHJ1ZSk7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJhd0xpc3RlbmVycyA9IGZ1bmN0aW9uIHJhd0xpc3RlbmVycyh0eXBlKSB7XG4gIHJldHVybiBfbGlzdGVuZXJzKHRoaXMsIHR5cGUsIGZhbHNlKTtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICBpZiAodHlwZW9mIGVtaXR0ZXIubGlzdGVuZXJDb3VudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBlbWl0dGVyLmxpc3RlbmVyQ291bnQodHlwZSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGxpc3RlbmVyQ291bnQuY2FsbChlbWl0dGVyLCB0eXBlKTtcbiAgfVxufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lckNvdW50ID0gbGlzdGVuZXJDb3VudDtcbmZ1bmN0aW9uIGxpc3RlbmVyQ291bnQodHlwZSkge1xuICB2YXIgZXZlbnRzID0gdGhpcy5fZXZlbnRzO1xuXG4gIGlmIChldmVudHMgIT09IHVuZGVmaW5lZCkge1xuICAgIHZhciBldmxpc3RlbmVyID0gZXZlbnRzW3R5cGVdO1xuXG4gICAgaWYgKHR5cGVvZiBldmxpc3RlbmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9IGVsc2UgaWYgKGV2bGlzdGVuZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGV2bGlzdGVuZXIubGVuZ3RoO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAwO1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmV2ZW50TmFtZXMgPSBmdW5jdGlvbiBldmVudE5hbWVzKCkge1xuICByZXR1cm4gdGhpcy5fZXZlbnRzQ291bnQgPiAwID8gUmVmbGVjdE93bktleXModGhpcy5fZXZlbnRzKSA6IFtdO1xufTtcblxuZnVuY3Rpb24gYXJyYXlDbG9uZShhcnIsIG4pIHtcbiAgdmFyIGNvcHkgPSBuZXcgQXJyYXkobik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgKytpKVxuICAgIGNvcHlbaV0gPSBhcnJbaV07XG4gIHJldHVybiBjb3B5O1xufVxuXG5mdW5jdGlvbiBzcGxpY2VPbmUobGlzdCwgaW5kZXgpIHtcbiAgZm9yICg7IGluZGV4ICsgMSA8IGxpc3QubGVuZ3RoOyBpbmRleCsrKVxuICAgIGxpc3RbaW5kZXhdID0gbGlzdFtpbmRleCArIDFdO1xuICBsaXN0LnBvcCgpO1xufVxuXG5mdW5jdGlvbiB1bndyYXBMaXN0ZW5lcnMoYXJyKSB7XG4gIHZhciByZXQgPSBuZXcgQXJyYXkoYXJyLmxlbmd0aCk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcmV0Lmxlbmd0aDsgKytpKSB7XG4gICAgcmV0W2ldID0gYXJyW2ldLmxpc3RlbmVyIHx8IGFycltpXTtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG5mdW5jdGlvbiBvbmNlKGVtaXR0ZXIsIG5hbWUpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICBmdW5jdGlvbiBlcnJvckxpc3RlbmVyKGVycikge1xuICAgICAgZW1pdHRlci5yZW1vdmVMaXN0ZW5lcihuYW1lLCByZXNvbHZlcik7XG4gICAgICByZWplY3QoZXJyKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXNvbHZlcigpIHtcbiAgICAgIGlmICh0eXBlb2YgZW1pdHRlci5yZW1vdmVMaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBlbWl0dGVyLnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIGVycm9yTGlzdGVuZXIpO1xuICAgICAgfVxuICAgICAgcmVzb2x2ZShbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuICAgIH07XG5cbiAgICBldmVudFRhcmdldEFnbm9zdGljQWRkTGlzdGVuZXIoZW1pdHRlciwgbmFtZSwgcmVzb2x2ZXIsIHsgb25jZTogdHJ1ZSB9KTtcbiAgICBpZiAobmFtZSAhPT0gJ2Vycm9yJykge1xuICAgICAgYWRkRXJyb3JIYW5kbGVySWZFdmVudEVtaXR0ZXIoZW1pdHRlciwgZXJyb3JMaXN0ZW5lciwgeyBvbmNlOiB0cnVlIH0pO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZEVycm9ySGFuZGxlcklmRXZlbnRFbWl0dGVyKGVtaXR0ZXIsIGhhbmRsZXIsIGZsYWdzKSB7XG4gIGlmICh0eXBlb2YgZW1pdHRlci5vbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGV2ZW50VGFyZ2V0QWdub3N0aWNBZGRMaXN0ZW5lcihlbWl0dGVyLCAnZXJyb3InLCBoYW5kbGVyLCBmbGFncyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZXZlbnRUYXJnZXRBZ25vc3RpY0FkZExpc3RlbmVyKGVtaXR0ZXIsIG5hbWUsIGxpc3RlbmVyLCBmbGFncykge1xuICBpZiAodHlwZW9mIGVtaXR0ZXIub24gPT09ICdmdW5jdGlvbicpIHtcbiAgICBpZiAoZmxhZ3Mub25jZSkge1xuICAgICAgZW1pdHRlci5vbmNlKG5hbWUsIGxpc3RlbmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZW1pdHRlci5vbihuYW1lLCBsaXN0ZW5lcik7XG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiBlbWl0dGVyLmFkZEV2ZW50TGlzdGVuZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyBFdmVudFRhcmdldCBkb2VzIG5vdCBoYXZlIGBlcnJvcmAgZXZlbnQgc2VtYW50aWNzIGxpa2UgTm9kZVxuICAgIC8vIEV2ZW50RW1pdHRlcnMsIHdlIGRvIG5vdCBsaXN0ZW4gZm9yIGBlcnJvcmAgZXZlbnRzIGhlcmUuXG4gICAgZW1pdHRlci5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGZ1bmN0aW9uIHdyYXBMaXN0ZW5lcihhcmcpIHtcbiAgICAgIC8vIElFIGRvZXMgbm90IGhhdmUgYnVpbHRpbiBgeyBvbmNlOiB0cnVlIH1gIHN1cHBvcnQgc28gd2VcbiAgICAgIC8vIGhhdmUgdG8gZG8gaXQgbWFudWFsbHkuXG4gICAgICBpZiAoZmxhZ3Mub25jZSkge1xuICAgICAgICBlbWl0dGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIobmFtZSwgd3JhcExpc3RlbmVyKTtcbiAgICAgIH1cbiAgICAgIGxpc3RlbmVyKGFyZyk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiZW1pdHRlclwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBFdmVudEVtaXR0ZXIuIFJlY2VpdmVkIHR5cGUgJyArIHR5cGVvZiBlbWl0dGVyKTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgXCI8c3ZnIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgeG1sbnM6eGxpbms9XFxcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcXFwiXFxuICAgIHpvb21BbmRQYW49XFxcIm1hZ25pZnlcXFwiIHZpZXdCb3g9XFxcIjAgMCA3NjggNzY3Ljk5OTk5NFxcXCJcXG4gICAgcHJlc2VydmVBc3BlY3RSYXRpbz1cXFwieE1pZFlNaWQgbWVldFxcXCIgdmVyc2lvbj1cXFwiMS4wXFxcIj5cXG4gICAgPHBhdGggY2xhc3M9XFxcImNpcmNsZVxcXCIgZmlsbD1cXFwiIzQxOGEyZlxcXCJcXG4gICAgICAgIGQ9XFxcIk0gNzY3Ljk4ODI4MSAzODMuOTg0Mzc1IEMgNzY3Ljk4ODI4MSA1OTYuMDU4NTk0IDU5Ni4wNjY0MDYgNzY3Ljk4MDQ2OSAzODMuOTk2MDk0IDc2Ny45ODA0NjkgQyAxNzEuOTIxODc1IDc2Ny45ODA0NjkgMCA1OTYuMDU4NTk0IDAgMzgzLjk4NDM3NSBDIDAgMTcxLjkxMDE1NiAxNzEuOTIxODc1IC0wLjAwNzgxMjUgMzgzLjk5NjA5NCAtMC4wMDc4MTI1IEMgNTk2LjA2NjQwNiAtMC4wMDc4MTI1IDc2Ny45ODgyODEgMTcxLjkxMDE1NiA3NjcuOTg4MjgxIDM4My45ODQzNzUgXFxcIlxcbiAgICAgICAgZmlsbC1vcGFjaXR5PVxcXCIxXFxcIiBmaWxsLXJ1bGU9XFxcIm5vbnplcm9cXFwiIC8+XFxuICAgIDxwYXRoIGNsYXNzPVxcXCJwaG9uZS1yZWNlaXZlclxcXCIgZmlsbD1cXFwiI2ZmZmZmZlxcXCJcXG4gICAgICAgIGQ9XFxcIk0gMjE1LjcyNjU2MiAxOTkuNzczNDM4IEMgMjE5Ljc0NjA5NCAxOTQuODM1OTM4IDIzMC4wMjM0MzggMTgzLjYyNSAyNDMuNjQ0NTMxIDE4My43Njk1MzEgQyAyNDQuNDA2MjUgMTgzLjc3NzM0NCAyNDUuMzAwNzgxIDE4My44MDg1OTQgMjQ2LjM0Mzc1IDE4My45MTQwNjIgQyAyNDYuMzQzNzUgMTgzLjkxNDA2MiAyNDguNDkyMTg4IDE4NC4xNDQ1MzEgMjUwLjYxMzI4MSAxODQuNzAzMTI1IEMgMjY4LjI5Mjk2OSAxODkuNDEwMTU2IDI5OS45MjE4NzUgMjI0LjMwNDY4OCAyOTkuOTIxODc1IDIyNC4zMDQ2ODggQyAzMjYuOTI1NzgxIDI1NC4wOTM3NSAzMzQuNzIyNjU2IDI1NS41MzEyNSAzMzQuNjM2NzE5IDI2Ni41IEMgMzM0LjU1MDc4MSAyNzYuNzc3MzQ0IDMyOC4xNDA2MjUgMjg0LjcxODc1IDMxNi4yNTM5MDYgMjk2LjU2NjQwNiBDIDI4NC41NjY0MDYgMzI4LjE0ODQzOCAyNzcuODA4NTk0IDMzMC41MzEyNSAyNzUuMzUxNTYyIDM0MC40MjE4NzUgQyAyNzMuOTAyMzQ0IDM0Ni4yMzQzNzUgMjY5LjUzOTA2MiAzNTcuNTExNzE5IDI4OS4xMDU0NjkgMzc5LjM1NTQ2OSBDIDMxOC4yODkwNjIgNDExLjkyOTY4OCAzODguMTg3NSA0NzguNDM3NSAzOTQuMzAwNzgxIDQ4Mi41MTU2MjUgQyA0MDAuNDAyMzQ0IDQ4Ni41ODU5MzggNDIyLjEyMTA5NCA1MDAuODMyMDMxIDQ1MS4zMDA3ODEgNDc0LjM3MTA5NCBDIDQ3MS4yMjY1NjIgNDU2LjMwNDY4OCA0ODAuNzE0ODQ0IDQzNS4wNjY0MDYgNDk0Ljg3NSA0MzMuNzg1MTU2IEMgNTAyLjM2MzI4MSA0MzMuMDg5ODQ0IDUwNy44Nzg5MDYgNDM3LjYxMzI4MSA1MTkuMTY3OTY5IDQ0Ny4yMjI2NTYgQyA1ODUuODg2NzE5IDUwMy45NzY1NjIgNTg2Ljg3MTA5NCA1MTMuOTMzNTk0IDU4Ni4zMTI1IDUxOS44MjQyMTkgQyA1ODUuMzU1NDY5IDUzMC4wMTE3MTkgNTgwLjc1IDUzOS4yMTA5MzggNTY1LjMxNjQwNiA1NTAuMzgyODEyIEMgNTI1Ljk1MzEyNSA1NzguODc4OTA2IDUwOC4zMTI1IDYwMy45OTIxODggNDI4LjIzNDM3NSA1NzAuNzQyMTg4IEMgMzQ4LjE1MjM0NCA1MzcuNDg0Mzc1IDI2My45OTYwOTQgNDUzLjMzNTkzOCAyNDAuMjQyMTg4IDQxNy4zNTkzNzUgQyAyMTYuNDg4MjgxIDM4MS4zOTA2MjUgMTc5LjE2MDE1NiAzMjYuNDIxODc1IDE4MS44Nzg5MDYgMjg4LjQxNDA2MiBDIDE4My43Njk1MzEgMjYxLjk4MDQ2OSAxOTEuODY3MTg4IDIzOC44NjMyODEgMTkxLjg2NzE4OCAyMzguODYzMjgxIEMgMTk5LjA5NzY1NiAyMjAuODgyODEyIDIwOC43MTg3NSAyMDcuODc4OTA2IDIxNS43MjY1NjIgMTk5Ljc3MzQzOCBcXFwiXFxuICAgICAgICBmaWxsLW9wYWNpdHk9XFxcIjFcXFwiIGZpbGwtcnVsZT1cXFwibm9uemVyb1xcXCIgLz5cXG48L3N2Zz5cIjsiLCJleHBvcnQgZGVmYXVsdCBcIjw/eG1sIHZlcnNpb249XFxcIjEuMFxcXCIgZW5jb2Rpbmc9XFxcIlVURi04XFxcIj8+XFxuPHN2ZyBpZD1cXFwiTGF5ZXJfMVxcXCIgZGF0YS1uYW1lPVxcXCJMYXllciAxXFxcIiB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCA2NC4wNiA2NC4zM1xcXCI+XFxuICA8ZGVmcz5cXG4gICAgPHN0eWxlPlxcbiAgICAgIC5jbHMtMSB7XFxuICAgICAgICBmaWxsOiAjMjQzODFiO1xcbiAgICAgIH1cXG5cXG4gICAgICAuY2xzLTEsIC5jbHMtMiB7XFxuICAgICAgICBzdHJva2Utd2lkdGg6IDBweDtcXG4gICAgICB9XFxuXFxuICAgICAgLmNscy0yIHtcXG4gICAgICAgIGZpbGw6ICNkZmQ3YzI7XFxuICAgICAgfVxcbiAgICA8L3N0eWxlPlxcbiAgPC9kZWZzPlxcbiAgPHBhdGggY2xhc3M9XFxcImNscy0yXFxcIiBkPVxcXCJtMzEuNzEsNjQuMzJDMTQuNzcsNjQuNDYtLjQ0LDQ5LjkzLDAsMzEuMzMuNDEsMTQuNDcsMTQuMjktLjMyLDMyLjcsMGMxNi45MS4zLDMxLjgsMTQuMzIsMzEuMzYsMzMuMTQtLjM5LDE2Ljc2LTE0LjQ5LDMxLjU1LTMyLjM0LDMxLjE4Wm0xMC42Ny0yMy4xOWMuMDYtLjctLjQxLTEuMTItLjg0LTEuNTUtMi0yLTMuOTQtNC4wNy02LjAyLTUuOTctMS4xNC0xLjA0LTEuMzItMS42OC0uMDYtMi44MiwyLjEzLTEuOTMsNC4wNy00LjA4LDYuMS02LjEyLjc4LS43OSwxLjMxLTEuNjQuMzQtMi41Ni0uOTItLjg3LTEuNzItLjI4LTIuNDMuNDUtMi4xNywyLjIxLTQuMzksNC4zOS02LjUyLDYuNjUtLjcyLjc3LTEuMTYuNy0xLjg0LS4wMi0yLjA2LTIuMTctNC4xOS00LjI4LTYuMjktNi40MS0uNzYtLjc3LTEuNTktMS42OC0yLjY2LS42My0xLjE0LDEuMTItLjE5LDEuOTguNjIsMi43OSwyLjA3LDIuMDksNC4wOSw0LjIyLDYuMiw2LjI2Ljc3Ljc1LjgyLDEuMi4wMiwxLjk3LTIuMjEsMi4xLTQuMzMsNC4zLTYuNDksNi40NS0uNzkuNzgtMS4zLDEuNjUtLjMyLDIuNTYuOTIuODUsMS43MS4yNiwyLjQzLS40NywyLjExLTIuMTIsNC4yOC00LjE5LDYuMzMtNi4zOC44OC0uOTQsMS4zNy0uODYsMi4yMS4wMywyLjEzLDIuMjYsNC4zNyw0LjQxLDYuNTcsNi42LjUxLjUxLDEuMDkuNzgsMS44LjQ4LjU2LS4yNC44NS0uNjguODctMS4zWlxcXCIvPlxcbiAgPHBhdGggY2xhc3M9XFxcImNscy0xXFxcIiBkPVxcXCJtNDIuNDcsNDEuMjdjLS4wMi42Mi0uMzIsMS4wNi0uODcsMS4zLS43MS4zMS0xLjI5LjAzLTEuOC0uNDgtMi4yLTIuMi00LjQ0LTQuMzUtNi41Ny02LjYtLjg0LS44OS0xLjMzLS45Ni0yLjIxLS4wMy0yLjA0LDIuMTktNC4yMiw0LjI1LTYuMzMsNi4zOC0uNzIuNzItMS41MSwxLjMyLTIuNDMuNDctLjk4LS45MS0uNDctMS43OC4zMi0yLjU2LDIuMTYtMi4xNSw0LjI4LTQuMzUsNi40OS02LjQ1LjgxLS43Ny43Ni0xLjIyLS4wMi0xLjk3LTIuMTEtMi4wNC00LjEzLTQuMTctNi4yLTYuMjYtLjgtLjgxLTEuNzUtMS42Ny0uNjItMi43OSwxLjA3LTEuMDUsMS45LS4xNCwyLjY2LjYzLDIuMSwyLjEzLDQuMjMsNC4yNCw2LjI5LDYuNDEuNjkuNzMsMS4xMi43OSwxLjg0LjAyLDIuMTMtMi4yNiw0LjM1LTQuNDMsNi41Mi02LjY1LjcyLS43MywxLjUxLTEuMzEsMi40My0uNDUuOTcuOTIuNDQsMS43OC0uMzQsMi41Ni0yLjAzLDIuMDQtMy45Nyw0LjE5LTYuMSw2LjEyLTEuMjUsMS4xNC0xLjA4LDEuNzguMDYsMi44MiwyLjA5LDEuOTEsNC4wMiwzLjk3LDYuMDIsNS45Ny40My40My45Ljg1Ljg0LDEuNTVaXFxcIi8+XFxuPC9zdmc+XCI7IiwiZXhwb3J0IGRlZmF1bHQgXCI8c3ZnIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgeG1sbnM6eGxpbms9XFxcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcXFwiXFxuICAgIHpvb21BbmRQYW49XFxcIm1hZ25pZnlcXFwiIHZpZXdCb3g9XFxcIjAgMCA3NjggNzY3Ljk5OTk5NFxcXCJcXG4gICAgcHJlc2VydmVBc3BlY3RSYXRpbz1cXFwieE1pZFlNaWQgbWVldFxcXCIgdmVyc2lvbj1cXFwiMS4wXFxcIj5cXG4gICAgPHBhdGggZmlsbD1cXFwiIzc3NmQ2ZFxcXCJcXG4gICAgICAgIGQ9XFxcIk0gNzY4IDM4NCBDIDc2OCA1OTYuMDc0MjE5IDU5Ni4wNzQyMTkgNzY4IDM4NCA3NjggQyAxNzEuOTI1NzgxIDc2OCAwIDU5Ni4wNzQyMTkgMCAzODQgQyAwIDE3MS45MjU3ODEgMTcxLjkyNTc4MSAwIDM4NCAwIEMgNTk2LjA3NDIxOSAwIDc2OCAxNzEuOTI1NzgxIDc2OCAzODQgXFxcIlxcbiAgICAgICAgZmlsbC1vcGFjaXR5PVxcXCIxXFxcIiBmaWxsLXJ1bGU9XFxcIm5vbnplcm9cXFwiIC8+XFxuICAgIDxwYXRoIGZpbGw9XFxcIiNmZmZmZmZcXFwiXFxuICAgICAgICBkPVxcXCJNIDE1My42OTUzMTIgNDE4Ljk2ODc1IEMgMTUzLjcxODc1IDQxOC45NzI2NTYgMTY3Ljc3MzQzOCA0NTUuMTA1NDY5IDE4My42MzY3MTkgNDY0LjUwNzgxMiBDIDE5My45MjU3ODEgNDcwLjU4NTkzOCAyMDIuNTIzNDM4IDQ2Ny4zMjAzMTIgMjEzLjYyNSA0NjIuMDg1OTM4IEMgMjM1LjIzNDM3NSA0NTEuODkwNjI1IDI1Ny4zNDc2NTYgNDQyLjQ3NjU2MiAyODAuNDgwNDY5IDQzNS45NTMxMjUgQyAyODYuODU1NDY5IDQzNC4xNTIzNDQgMjkwLjgzMjAzMSA0MjcuODkwNjI1IDI4OS4yNjU2MjUgNDIxLjcyMjY1NiBDIDI4Ni40MDIzNDQgNDEwLjY4NzUgMjgzLjQ4MDQ2OSAzOTkuNjYwMTU2IDI4MC41MDc4MTIgMzg4LjY0NDUzMSBDIDI3OC44MDg1OTQgMzgyLjUxMTcxOSAyODMuNTIzNDM4IDM3NS45ODgyODEgMjkxLjE0ODQzOCAzNzQuMzYzMjgxIEMgMzIwLjI4MTI1IDM2OC4xMjg5MDYgMzUwLjE1MjM0NCAzNjQuOTIxODc1IDM4MC4wMzkwNjIgMzY0Ljc2OTUzMSBDIDM4MS4zNTkzNzUgMzY0Ljc2OTUzMSAzODYuNjQwNjI1IDM2NC43Njk1MzEgMzg3Ljk2MDkzOCAzNjQuNzY5NTMxIEMgNDE3Ljg0NzY1NiAzNjQuOTIxODc1IDQ0Ny43MTQ4NDQgMzY4LjEyODkwNiA0NzYuODUxNTYyIDM3NC4zNjMyODEgQyA0ODQuNDc2NTYyIDM3NS45ODgyODEgNDg5LjE5MTQwNiAzODIuNTExNzE5IDQ4Ny40OTIxODggMzg4LjY0NDUzMSBDIDQ4NC41MTk1MzEgMzk5LjY2MDE1NiA0ODEuNTk3NjU2IDQxMC42ODc1IDQ3OC43MzQzNzUgNDIxLjcyMjY1NiBDIDQ3Ny4xNjc5NjkgNDI3Ljg5MDYyNSA0ODEuMTQ0NTMxIDQzNC4xNTIzNDQgNDg3LjUxOTUzMSA0MzUuOTUzMTI1IEMgNTEwLjY1MjM0NCA0NDIuNDc2NTYyIDUzMi43NjU2MjUgNDUxLjg5MDYyNSA1NTQuMzc1IDQ2Mi4wODU5MzggQyA1NjUuNDc2NTYyIDQ2Ny4zMjAzMTIgNTc0LjA3NDIxOSA0NzAuNTg1OTM4IDU4NC4zNjMyODEgNDY0LjUwNzgxMiBDIDYwMC4yMjY1NjIgNDU1LjEwNTQ2OSA2MTQuMjgxMjUgNDE4Ljk3MjY1NiA2MTQuMzA0Njg4IDQxOC45Njg3NSBDIDYyNy42NjQwNjIgMzkwLjczMDQ2OSA2MTkuMDQyOTY5IDM1OS4xMTcxODggNTgyLjE2Nzk2OSAzNDIuNTUwNzgxIEMgNTE5Ljk2MDkzOCAzMTQuODM5ODQ0IDQ1Ny4zMjAzMTIgMzAwLjY0MDYyNSAzODguMTQwNjI1IDMwMC4yMDMxMjUgQyAzODYuNzY1NjI1IDMwMC4yMDMxMjUgMzgxLjIzODI4MSAzMDAuMjAzMTI1IDM3OS44NTU0NjkgMzAwLjIwMzEyNSBDIDMxMC42Nzk2ODggMzAwLjY0MDYyNSAyNDguMDM5MDYyIDMxNC44Mzk4NDQgMTg1LjgzMjAzMSAzNDIuNTUwNzgxIEMgMTQ4Ljk0OTIxOSAzNTkuMTE3MTg4IDE0MC4zMzU5MzggMzkwLjczMDQ2OSAxNTMuNjk1MzEyIDQxOC45Njg3NSBcXFwiXFxuICAgICAgICBmaWxsLW9wYWNpdHk9XFxcIjFcXFwiIGZpbGwtcnVsZT1cXFwibm9uemVyb1xcXCIgLz5cXG48L3N2Zz5cIjsiLCJleHBvcnQgZGVmYXVsdCBcIjxzdmcgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiB4bWxuczp4bGluaz1cXFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1xcXCIgem9vbUFuZFBhbj1cXFwibWFnbmlmeVxcXCIgdmlld0JveD1cXFwiMCAwIDc2OCA3NjcuOTk5OTk0XFxcIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPVxcXCJ4TWlkWU1pZCBtZWV0XFxcIiB2ZXJzaW9uPVxcXCIxLjBcXFwiPjxwYXRoIGZpbGw9XFxcIiNlNGQ4YzFcXFwiIGQ9XFxcIk0gNzY4LjEzMjgxMiAzNzkuNTM1MTU2IEMgNzY4LjEzMjgxMiAxNjkuMDg5ODQ0IDU5Ny41MjM0MzggLTEuNDk2MDk0IDM4Ny4wNTA3ODEgLTEuNDk2MDk0IEMgMTc2LjYwOTM3NSAtMS40OTYwOTQgNS45OTYwOTQgMTY5LjA4OTg0NCA1Ljk5NjA5NCAzNzkuNTM1MTU2IEMgNS45OTYwOTQgNTg5Ljk0OTIxOSAxNzYuNjA5Mzc1IDc2MC41MzkwNjIgMzg3LjA1MDc4MSA3NjAuNTM5MDYyIEMgNTk3LjUyMzQzOCA3NjAuNTM5MDYyIDc2OC4xMzI4MTIgNTg5Ljk0OTIxOSA3NjguMTMyODEyIDM3OS41MzUxNTYgXFxcIiBmaWxsLW9wYWNpdHk9XFxcIjFcXFwiIGZpbGwtcnVsZT1cXFwibm9uemVyb1xcXCIvPjxwYXRoIGZpbGw9XFxcIiM3NzZkNmRcXFwiIGQ9XFxcIk0gNTM4Ljk5NjA5NCAyMjMuMTUyMzQ0IEwgMzA2LjUzNTE1NiAyMjkuODU1NDY5IEwgNTM4Ljk5NjA5NCA0NTUuNjk1MzEyIFogTSA1MzguOTk2MDk0IDIyMy4xNTIzNDQgXFxcIiBmaWxsLW9wYWNpdHk9XFxcIjFcXFwiIGZpbGwtcnVsZT1cXFwibm9uemVyb1xcXCIvPjxwYXRoIGZpbGw9XFxcIiM3NzZkNmRcXFwiIGQ9XFxcIk0gMjM1LjEwNTQ2OSA1MzUuODkwNjI1IEwgNDY3LjU5NzY1NiA1MjkuMTg3NSBMIDIzNS4xMDU0NjkgMzAzLjM0Mzc1IFogTSAyMzUuMTA1NDY5IDUzNS44OTA2MjUgXFxcIiBmaWxsLW9wYWNpdHk9XFxcIjFcXFwiIGZpbGwtcnVsZT1cXFwibm9uemVyb1xcXCIvPjwvc3ZnPlwiOyIsImV4cG9ydCBkZWZhdWx0IFwiPHN2ZyB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHhtbG5zOnhsaW5rPVxcXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXFxcIiB3aWR0aD1cXFwiNTAwXFxcIiB6b29tQW5kUGFuPVxcXCJtYWduaWZ5XFxcIiB2aWV3Qm94PVxcXCIwIDAgMzc1IDM3NC45OTk5OTFcXFwiIGhlaWdodD1cXFwiNTAwXFxcIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPVxcXCJ4TWlkWU1pZCBtZWV0XFxcIiB2ZXJzaW9uPVxcXCIxLjBcXFwiPjxwYXRoIGZpbGw9XFxcIiM3NzZkNmRcXFwiIGQ9XFxcIk0gMjM5LjcyMjY1NiAxMjYuNDQxNDA2IEwgMjM5LjcyMjY1NiAxMjIuMzAwNzgxIEMgMjM5LjcyMjY1NiA5My41MDc4MTIgMjE2LjI5Njg3NSA3MC4wNzgxMjUgMTg3LjUgNzAuMDc4MTI1IEMgMTU4LjcwMzEyNSA3MC4wNzgxMjUgMTM1LjI3NzM0NCA5My41MDc4MTIgMTM1LjI3NzM0NCAxMjIuMzAwNzgxIEwgMTM1LjI3NzM0NCAxODcuOTUzMTI1IEMgMTM1LjI3NzM0NCAxOTkuOTg4MjgxIDEzOS40MTAxNTYgMjExLjA1MDc4MSAxNDYuMjczNDM4IDIxOS44OTA2MjUgWiBNIDIzOS43MjI2NTYgMTI2LjQ0MTQwNiBcXFwiIGZpbGwtb3BhY2l0eT1cXFwiMVxcXCIgZmlsbC1ydWxlPVxcXCJub256ZXJvXFxcIi8+PHBhdGggZmlsbD1cXFwiIzc3NmQ2ZFxcXCIgZD1cXFwiTSAxNTUuMDQ2ODc1IDIyOC43OTI5NjkgQyAxNjMuOTY0ODQ0IDIzNS44OTg0MzggMTc1LjIzNDM3NSAyNDAuMTc1NzgxIDE4Ny41IDI0MC4xNzU3ODEgQyAyMTYuMjk2ODc1IDI0MC4xNzU3ODEgMjM5LjcyMjY1NiAyMTYuNzUgMjM5LjcyMjY1NiAxODcuOTUzMTI1IEwgMjM5LjcyMjY1NiAxNDQuMTEzMjgxIFogTSAxNTUuMDQ2ODc1IDIyOC43OTI5NjkgXFxcIiBmaWxsLW9wYWNpdHk9XFxcIjFcXFwiIGZpbGwtcnVsZT1cXFwibm9uemVyb1xcXCIvPjxwYXRoIGZpbGw9XFxcIiM3NzZkNmRcXFwiIGQ9XFxcIk0gMTg3LjUgMCBDIDgzLjk0NTMxMiAwIDAgODMuOTQ1MzEyIDAgMTg3LjUgQyAwIDI5MS4wNTQ2ODggODMuOTQ1MzEyIDM3NSAxODcuNSAzNzUgQyAyOTEuMDU0Njg4IDM3NSAzNzUgMjkxLjA1NDY4OCAzNzUgMTg3LjUgQyAzNzUgODMuOTQ1MzEyIDI5MS4wNTQ2ODggMCAxODcuNSAwIFogTSAyODcuNDg0Mzc1IDk2LjM1NTQ2OSBMIDI1NC42NDA2MjUgMTI5LjE5NTMxMiBMIDI1NC42NDA2MjUgMTg3Ljk1MzEyNSBDIDI1NC42NDA2MjUgMjI0Ljk3NjU2MiAyMjQuNTIzNDM4IDI1NS4wOTc2NTYgMTg3LjUgMjU1LjA5NzY1NiBDIDE3MS4xMTcxODggMjU1LjA5NzY1NiAxNTYuMTA1NDY5IDI0OS4xODM1OTQgMTQ0LjQzNzUgMjM5LjQwMjM0NCBMIDEzOC4xMDkzNzUgMjQ1LjczMDQ2OSBDIDE1MS40MTc5NjkgMjU3LjEyMTA5NCAxNjguNjUyMzQ0IDI2NC4wNDY4NzUgMTg3LjUgMjY0LjA0Njg3NSBDIDIyOS40NTcwMzEgMjY0LjA0Njg3NSAyNjMuNTkzNzUgMjI5LjkxNDA2MiAyNjMuNTkzNzUgMTg3Ljk1MzEyNSBDIDI2My41OTM3NSAxODMuODMyMDMxIDI2Ni45MzM1OTQgMTgwLjQ5NjA5NCAyNzEuMDU0Njg4IDE4MC40OTYwOTQgQyAyNzUuMTc1NzgxIDE4MC40OTYwOTQgMjc4LjUxNTYyNSAxODMuODM1OTM4IDI3OC41MTU2MjUgMTg3Ljk1MzEyNSBDIDI3OC41MTU2MjUgMjM1LjYyNSAyNDEuNjY3OTY5IDI3NC44MjgxMjUgMTk0Ljk2MDkzOCAyNzguNjQwNjI1IEwgMTk0Ljk2MDkzOCAzMDQuOTIxODc1IEwgMjIwLjEyMTA5NCAzMDQuOTIxODc1IEMgMjI0LjI0MjE4OCAzMDQuOTIxODc1IDIyNy41ODIwMzEgMzA4LjI2MTcxOSAyMjcuNTgyMDMxIDMxMi4zODI4MTIgQyAyMjcuNTgyMDMxIDMxNi41IDIyNC4yNDIxODggMzE5LjgzOTg0NCAyMjAuMTIxMDk0IDMxOS44Mzk4NDQgTCAxNTQuODc1IDMxOS44Mzk4NDQgQyAxNTAuNzU3ODEyIDMxOS44Mzk4NDQgMTQ3LjQxNzk2OSAzMTYuNSAxNDcuNDE3OTY5IDMxMi4zODI4MTIgQyAxNDcuNDE3OTY5IDMwOC4yNjE3MTkgMTUwLjc1NzgxMiAzMDQuOTIxODc1IDE1NC44NzUgMzA0LjkyMTg3NSBMIDE4MC4wMzkwNjIgMzA0LjkyMTg3NSBMIDE4MC4wMzkwNjIgMjc4LjYzNjcxOSBDIDE2MC4wMDc4MTIgMjc3LjAwMzkwNiAxNDEuODE2NDA2IDI2OC44MjQyMTkgMTI3LjU0Mjk2OSAyNTYuMjk2ODc1IEwgOTYuMzUxNTYyIDI4Ny40ODQzNzUgQyA5NS4xMzI4MTIgMjg4LjcwMzEyNSA5My41MzEyNSAyODkuMzE2NDA2IDkxLjkzMzU5NCAyODkuMzE2NDA2IEMgOTAuMzM1OTM4IDI4OS4zMTY0MDYgODguNzM0Mzc1IDI4OC43MDMxMjUgODcuNTE1NjI1IDI4Ny40ODQzNzUgQyA4NS4wNzQyMTkgMjg1LjA0Mjk2OSA4NS4wNzQyMTkgMjgxLjA4NTkzOCA4Ny41MTU2MjUgMjc4LjY0NDUzMSBMIDExOC43NjE3MTkgMjQ3LjM5ODQzOCBDIDEwNC45Mjk2ODggMjMxLjQzNzUgOTYuNDg0Mzc1IDIxMC42ODc1IDk2LjQ4NDM3NSAxODcuOTUzMTI1IEMgOTYuNDg0Mzc1IDE4My44MzIwMzEgOTkuODI0MjE5IDE4MC40OTYwOTQgMTAzLjk0MTQwNiAxODAuNDk2MDk0IEMgMTA4LjA2MjUgMTgwLjQ5NjA5NCAxMTEuNDAyMzQ0IDE4My44MzU5MzggMTExLjQwMjM0NCAxODcuOTUzMTI1IEMgMTExLjQwMjM0NCAyMDYuNTc0MjE5IDExOC4xNDg0MzggMjIzLjYyODkwNiAxMjkuMjkyOTY5IDIzNi44NjcxODggTCAxMzUuNjI4OTA2IDIzMC41MzEyNSBDIDEyNi4wODk4NDQgMjE4LjkzNzUgMTIwLjM1NTQ2OSAyMDQuMTA1NDY5IDEyMC4zNTU0NjkgMTg3Ljk1MzEyNSBMIDEyMC4zNTU0NjkgMTIyLjMwMDc4MSBDIDEyMC4zNTU0NjkgODUuMjgxMjUgMTUwLjQ3NjU2MiA1NS4xNjAxNTYgMTg3LjQ5NjA5NCA1NS4xNjAxNTYgQyAyMjEuMTI4OTA2IDU1LjE2MDE1NiAyNDguOTgwNDY5IDgwLjAzOTA2MiAyNTMuODE2NDA2IDExMi4zNDM3NSBMIDI3OC42NDA2MjUgODcuNTE1NjI1IEMgMjgxLjA4MjAzMSA4NS4wNzgxMjUgMjg1LjAzOTA2MiA4NS4wNzgxMjUgMjg3LjQ4MDQ2OSA4Ny41MTU2MjUgQyAyODkuOTI1NzgxIDg5Ljk1NzAzMSAyODkuOTI1NzgxIDkzLjkxNDA2MiAyODcuNDg0Mzc1IDk2LjM1NTQ2OSBaIE0gMjg3LjQ4NDM3NSA5Ni4zNTU0NjkgXFxcIiBmaWxsLW9wYWNpdHk9XFxcIjFcXFwiIGZpbGwtcnVsZT1cXFwibm9uemVyb1xcXCIvPjwvc3ZnPlwiOyIsImV4cG9ydCBkZWZhdWx0IFwiPD94bWwgdmVyc2lvbj1cXFwiMS4wXFxcIiBlbmNvZGluZz1cXFwiVVRGLThcXFwiPz5cXG48c3ZnIGlkPVxcXCJMYXllcl8xXFxcIiBkYXRhLW5hbWU9XFxcIkxheWVyIDFcXFwiIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDMwNyA2NDBcXFwiPlxcbiAgPGRlZnM+XFxuICAgIDxzdHlsZT5cXG4gICAgICAuaW5uZXJtb3N0LCAuc2Vjb25kLCAudGhpcmQsIC5mb3VydGgsIC5maWZ0aCwgLm91dGVybW9zdCB7XFxuICAgICAgICBzdHJva2Utd2lkdGg6IDBweDtcXG4gICAgICB9XFxuICAgICAgXFxuICAgICAgLm91dGVybW9zdCB7XFxuICAgICAgICBmaWxsOiAjZTRmMmQxO1xcbiAgICAgIH1cXG5cXG4gICAgICAuc2Vjb25kIHtcXG4gICAgICAgIGZpbGw6ICNjY2U4YjU7XFxuICAgICAgfVxcblxcbiAgICAgIC50aGlyZCB7XFxuICAgICAgICBmaWxsOiAjYjNkYjk1O1xcbiAgICAgIH1cXG5cXG4gICAgICAuZm91cnRoIHtcXG4gICAgICAgIGZpbGw6ICM5YmQwNzg7XFxuICAgICAgfVxcblxcbiAgICAgIC5maWZ0aCB7XFxuICAgICAgICBmaWxsOiAjODNjNTVjO1xcbiAgICAgIH1cXG5cXG4gICAgICAuaW5uZXJtb3N0IHtcXG4gICAgICAgIGZpbGw6ICM0MjhhMmY7XFxuICAgICAgfVxcbiAgICA8L3N0eWxlPlxcbiAgPC9kZWZzPlxcbiAgPHBhdGggY2xhc3M9XFxcIm91dGVybW9zdFxcXCIgZD1cXFwibTMwNi45LDMyMGMwLDEwNS4zLS4wMiwyMTAuNi4xLDMxNS45MSwwLDMuNDItLjY3LDQuMS00LjA5LDQuMDktOTkuNi0uMTItMTk5LjIxLS4xMi0yOTguODEsMEMuNjcsNjQwLDAsNjM5LjMzLDAsNjM1LjkxLjExLDQyNS4zLjExLDIxNC43LDAsNC4wOSwwLC42Ny42NywwLDQuMDksMCwxMDMuNy4xMiwyMDMuMy4xMiwzMDIuOTEsMGMzLjQyLDAsNC4xLjY3LDQuMDksNC4wOS0uMTIsMTA1LjMtLjEsMjEwLjYtLjEsMzE1LjkxWlxcXCIvPlxcbiAgPHBhdGggY2xhc3M9XFxcInNlY29uZFxcXCIgZD1cXFwibTI3NS45MiwzMjNjMCw4Ny42MywwLDE3NS4yNywwLDI2Mi45LDAsNy4yNC0uNTUsNy45My03Ljg2LDcuOTgtMTQuNjYuMDktMjkuMzEuMDMtNDMuOTcuMDMtNjAuOTYsMC0xMjEuOTIsMC0xODIuODgsMHEtNy4xMywwLTcuMTQtNy4yNGMwLTE3Ni4xLDAtMzUyLjIxLDAtNTI4LjMxcTAtNy4yNiw3LjEyLTcuMjZjNzUuNzgsMCwxNTEuNTYsMCwyMjcuMzUsMHE3LjM4LDAsNy4zOCw3LjVjMCw4OC4xMywwLDE3Ni4yNywwLDI2NC40WlxcXCIvPlxcbiAgPHBhdGggY2xhc3M9XFxcInRoaXJkXFxcIiBkPVxcXCJtNjguMDYsMzIyLjI0YzAtNjkuNDcsMC0xMzguOTQsMC0yMDguNDEsMC04Ljk5LDEuMzMtMTAuMTMsMTAuNDktOS4xMiwxLjk4LjIyLDMuOTguMzIsNS45Ny4zMiw0Ni4xMy4wMiw5Mi4yNi4wMiwxMzguMzksMCwzLjQ4LDAsNi45Mi0uMjMsMTAuNDEtLjY3LDUuNS0uNyw4Ljc0LjQ2LDguNzMsNy4yNS0uMTgsMTM4Ljk0LS4xMywyNzcuODgtLjEzLDQxNi44MSwwLC4zMywwLC42NywwLDFxLS4xNCwxMC41MS0xMC4zOSwxMC41MWMtNTIuMTMsMC0xMDQuMjUsMC0xNTYuMzgsMHEtNy4wOSwwLTcuMDktNy4yOGMwLTcwLjE0LDAtMTQwLjI3LDAtMjEwLjQxWlxcXCIvPlxcbiAgPHBhdGggY2xhc3M9XFxcImZvdXJ0aFxcXCIgZD1cXFwibTEwMy4wMiwzMjIuNWMwLTUyLjQ2LDAtMTA0LjkxLDAtMTU3LjM3LDAtNi42OC4zNi03LjA2LDcuMDctNy4wNiwzMC4zLS4wMSw2MC42LjA3LDkwLjktLjA5LDQuNTQtLjAyLDYuMDgsMS4zMyw2LjA3LDUuOTgtLjEsMTA1LjU4LS4xLDIxMS4xNiwwLDMxNi43NCwwLDQuMTgtMS4yNyw1LjM3LTUuMzgsNS4zNS0yOS4zLS4xNS01OC42LS4wOC04Ny45LS4wOHEtMTAuNzYsMC0xMC43Ni0xMS4wOWMwLTUwLjc5LDAtMTAxLjU4LDAtMTUyLjM3WlxcXCIvPlxcbiAgPHBhdGggY2xhc3M9XFxcImZpZnRoXFxcIiBkPVxcXCJtMTczLDMyMi4yYzAsMzUuMjksMCw3MC41OCwwLDEwNS44OHEwLDYuODktNi45OSw2LjljLTguMTUsMC0xNi4zMS0uMTMtMjQuNDYuMDYtMy40Ny4wOC00LjY4LTEuMDktNC42MS00LjU5LjE4LTkuNjUuMDYtMTkuMzEuMDYtMjguOTYsMC01OC4yNi0uMDEtMTE2LjUzLjAyLTE3NC43OSwwLTQuNzYtMS4xMi05LjQ2LS4xNC0xNC4zLjUxLTIuNTQsMS4zOS0zLjM4LDMuOC0zLjM2LDguODIuMDYsMTcuNjQuMTQsMjYuNDYtLjAyLDQuNTktLjA5LDUuOTUsMS44NSw1Ljk0LDYuMzMtLjE0LDM1LjYyLS4wOCw3MS4yNS0uMDgsMTA2Ljg3WlxcXCIvPlxcbiAgPHBhdGggY2xhc3M9XFxcImlubmVybW9zdFxcXCIgZD1cXFwibTE1MS4wNCwzMjIuMDFjMC05Ljk5LjA3LTE5Ljk3LS4wNS0yOS45Ni0uMDQtMi45My44My00LjE4LDMuOTUtNC4xOCwzLjA2LDAsNC4wMywxLjEyLDQuMDIsNC4xMS0uMDksMTkuOTctLjA4LDM5Ljk0LjAxLDU5LjkxLjAxLDIuOTYtLjg0LDQuMTYtMy45Niw0LjE0LTMuMDMtLjAxLTQuMDgtMS4wNC00LjAzLTQuMDguMTQtOS45OC4wNS0xOS45Ny4wNS0yOS45NlpcXFwiLz5cXG48L3N2Zz5cIjsiLCJleHBvcnQgZGVmYXVsdCBcIjxzdmcgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiB2ZXJzaW9uPVxcXCIxLjBcXFwiIHZpZXdCb3g9XFxcIjAgMCA1Ni4yNSAzMFxcXCIgY2xhc3M9XFxcIndhdmVmb3JtXFxcIj5cXG4gICAgPGRlZnM+XFxuICAgICAgICA8Y2xpcFBhdGggaWQ9XFxcImFcXFwiPlxcbiAgICAgICAgICAgIDxwYXRoIGQ9XFxcIk0uNTQgMTJIM3Y1SC41NFptMCAwXFxcIi8+XFxuICAgICAgICA8L2NsaXBQYXRoPlxcbiAgICAgICAgPGNsaXBQYXRoIGlkPVxcXCJiXFxcIj5cXG4gICAgICAgICAgICA8cGF0aCBkPVxcXCJNMjUgMi4yaDJ2MjQuNjhoLTJabTAgMFxcXCIvPlxcbiAgICAgICAgPC9jbGlwUGF0aD5cXG4gICAgICAgIDxjbGlwUGF0aCBpZD1cXFwiY1xcXCI+XFxuICAgICAgICAgICAgPHBhdGggZD1cXFwiTTUzIDEyaDEuOTh2NUg1M1ptMCAwXFxcIi8+XFxuICAgICAgICA8L2NsaXBQYXRoPlxcbiAgICA8L2RlZnM+XFxuICAgIDxnIGNsaXAtcGF0aD1cXFwidXJsKCNhKVxcXCI+XFxuICAgICAgICA8cGF0aCBkPVxcXCJNMS40OCAxMi43MWMtLjUgMC0uOS40LS45Ljl2MS44NWEuOS45IDAgMCAwIDEuOCAwdi0xLjg0YzAtLjUtLjQtLjktLjktLjlabTAgMFxcXCIvPlxcbiAgICA8L2c+XFxuICAgIDxwYXRoIGQ9XFxcIk00Ljk4IDYuNjNjLS41IDAtLjkuNC0uOS45djE0LjAxYS45LjkgMCAwIDAgMS44MSAwdi0xNGMwLS41LS40LS45Mi0uOS0uOTJabTMuNTEgMy4xYS45LjkgMCAwIDAtLjkuOTF2Ny43OWEuOS45IDAgMCAwIDEuOCAwdi03Ljc5YzAtLjUtLjQtLjktLjktLjlaTTEyIDMuODNhLjkuOSAwIDAgMC0uOTEuOXYxOS42YS45LjkgMCAwIDAgMS44IDBWNC43NGMwLS41LS40LS45LS45LS45Wm0zLjUgOC4yOWEuOS45IDAgMCAwLS45MS45djMuMDNhLjkuOSAwIDAgMCAxLjgxIDB2LTMuMDNjMC0uNS0uNC0uOS0uOS0uOVpNMTkgNi44Yy0uNSAwLS45LjQtLjkuOXYxMy42OGEuOS45IDAgMCAwIDEuOCAwVjcuN2MwLS41LS40LS45LS45LS45Wm0zLjU4LTIuOTdoLS4wMWMtLjUgMC0uOS40LS45LjlsLS4xMyAxOS42YzAgLjUuNC45LjkuOTEuNSAwIC45LS40LjktLjlsLjE0LTE5LjZhLjkuOSAwIDAgMC0uOS0uOVptMCAwXFxcIi8+XFxuICAgIDxnIGNsaXAtcGF0aD1cXFwidXJsKCNiKVxcXCI+XFxuICAgICAgICA8cGF0aCBkPVxcXCJNMjYgMi4yYy0uNSAwLS45LjQtLjkuOXYyMi44NmEuOS45IDAgMSAwIDEuODEgMFYzLjExYS45LjkgMCAwIDAtLjktLjkxWm0wIDBcXFwiLz5cXG4gICAgPC9nPlxcbiAgICA8cGF0aCBkPVxcXCJNMjkuNTIgNy43MWEuOS45IDAgMCAwLS45MS45djExLjg1YS45LjkgMCAwIDAgMS44MSAwVjguNjJjMC0uNS0uNC0uOS0uOS0uOVptMy41IDIuOTNhLjkuOSAwIDAgMC0uOS45MXY1Ljk3YS45LjkgMCAwIDAgMS44IDB2LTUuOTdjMC0uNS0uNC0uOS0uOS0uOVptMy41LTUuNzhjLS41IDAtLjkuNC0uOS45djE3LjU1YS45LjkgMCAwIDAgMS44MSAwVjUuNzZjMC0uNS0uNC0uOS0uOS0uOVptMy41MSAzLjM0Yy0uNSAwLS45LjQtLjkuOXYxMC44N2EuOS45IDAgMCAwIDEuOCAwVjkuMWEuOS45IDAgMCAwLS45LS45MVptMy41IDMuMDhjLS41IDAtLjkuNC0uOS45MXY0LjdhLjkuOSAwIDEgMCAxLjggMHYtNC43YS45LjkgMCAwIDAtLjktLjlabTMuNTEtNy40NWEuOS45IDAgMCAwLS45MS45djE5LjZhLjkuOSAwIDAgMCAxLjgxIDBWNC43NGMwLS41LS40LS45LS45LS45Wm0zLjUgNS41N2EuOS45IDAgMCAwLS45LjkxdjguNDVhLjkuOSAwIDAgMCAxLjggMHYtOC40NWMwLS41LS40LS45LS45LS45Wm0wIDBcXFwiLz5cXG4gICAgPGcgY2xpcC1wYXRoPVxcXCJ1cmwoI2MpXFxcIj5cXG4gICAgICAgIDxwYXRoIGQ9XFxcIk01NC4wNCAxMi45NmEuOS45IDAgMCAwLS45LjkxdjEuMzNhLjkuOSAwIDEgMCAxLjggMHYtMS4zMmEuOS45IDAgMCAwLS45LS45MlptMCAwXFxcIi8+XFxuICAgIDwvZz5cXG48L3N2Zz5cIjsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vcmVjdGFuZ2xlcy5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3JlY3RhbmdsZXMuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cnVsZVNldFsxXS5ydWxlc1szXS51c2VbMV0hLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9ydWxlU2V0WzFdLnJ1bGVzWzNdLnVzZVsyXSEuL2NvbW1vbi5zY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3J1bGVTZXRbMV0ucnVsZXNbM10udXNlWzFdIS4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cnVsZVNldFsxXS5ydWxlc1szXS51c2VbMl0hLi9jb21tb24uc2Nzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3J1bGVTZXRbMV0ucnVsZXNbM10udXNlWzFdIS4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cnVsZVNldFsxXS5ydWxlc1szXS51c2VbMl0hLi9kZXNrdG9wLnNjc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cnVsZVNldFsxXS5ydWxlc1szXS51c2VbMV0hLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9ydWxlU2V0WzFdLnJ1bGVzWzNdLnVzZVsyXSEuL2Rlc2t0b3Auc2Nzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3J1bGVTZXRbMV0ucnVsZXNbM10udXNlWzFdIS4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cnVsZVNldFsxXS5ydWxlc1szXS51c2VbMl0hLi9tb2JpbGUuc2Nzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9ydWxlU2V0WzFdLnJ1bGVzWzNdLnVzZVsxXSEuLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvZGlzdC9janMuanM/P3J1bGVTZXRbMV0ucnVsZXNbM10udXNlWzJdIS4vbW9iaWxlLnNjc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsImV4cG9ydCBmdW5jdGlvbiBhcHBlbmRDaGlsZChcbiAgcGFyZW50OiBFbGVtZW50LFxuICBjaGlsZDogTm9kZSxcbiAgcG9zaXRpb246IG51bWJlciA9IDBcbik6IHZvaWQge1xuICAvLyBDaGVjayBpZiBhIGNvbnRhaW5lciBpcyBwcm92aWRlZC5cbiAgaWYgKHBhcmVudCkge1xuICAgIC8vIElmIHBvc2l0aW9uIGlzIDAsIHNpbXBseSBhcHBlbmQgdGhlIGJ1dHRvbiBhcyB0aGUgbGFzdCBjaGlsZC5cbiAgICBpZiAocG9zaXRpb24gPT09IDApIHtcbiAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIENhbGN1bGF0ZSB0aGUgaW5kZXggb2YgdGhlIHJlZmVyZW5jZSBub2RlIGZvciBpbnNlcnRCZWZvcmUoKS5cbiAgICAgIGNvbnN0IHJlZmVyZW5jZUluZGV4ID0gcGFyZW50LmNoaWxkcmVuLmxlbmd0aCArIHBvc2l0aW9uO1xuICAgICAgY29uc3QgcmVmZXJlbmNlTm9kZSA9IHBhcmVudC5jaGlsZHJlbltyZWZlcmVuY2VJbmRleF07XG5cbiAgICAgIC8vIElmIGEgcmVmZXJlbmNlIG5vZGUgZXhpc3RzLCBpbnNlcnQgdGhlIGJ1dHRvbiBiZWZvcmUgaXQuXG4gICAgICBpZiAocmVmZXJlbmNlTm9kZSkge1xuICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKGNoaWxkLCByZWZlcmVuY2VOb2RlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIElmIG5vdCwgYXBwZW5kIHRoZSBidXR0b24gYXMgdGhlIGxhc3QgY2hpbGQuXG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIElmIG5vIGNvbnRhaW5lciBpcyBwcm92aWRlZCwgYXBwZW5kIHRoZSBidXR0b24gdG8gdGhlIGJvZHkuXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjaGlsZCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IHNldFByb21wdFRleHQgfSBmcm9tIFwiLi9UcmFuc2NyaXB0aW9uTW9kdWxlXCI7XG5cbmludGVyZmFjZSBSZXN0b3JlUG9pbnQge1xuICBwcm9tcHQ6IHN0cmluZztcbiAgYXVkaW9JbnB1dEVuYWJsZWQ6IGJvb2xlYW47XG4gIGF1ZGlvT3V0cHV0RW5hYmxlZDogYm9vbGVhbjtcbiAgY3JlYXRpb25UaW1lOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBSZXN0b3JlUG9pbnRBdXRvRGF0ZSB7XG4gIHByb21wdDogc3RyaW5nO1xuICBhdWRpb0lucHV0RW5hYmxlZDogYm9vbGVhbjtcbiAgYXVkaW9PdXRwdXRFbmFibGVkOiBib29sZWFuO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdWJtaXRFcnJvckhhbmRsZXIge1xuICBwcml2YXRlIHJlc3RvcmVQb2ludEtleTogc3RyaW5nO1xuICBwcml2YXRlIGF1ZGlvT3V0cHV0U3RhdHVzOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgLy8gSW5pdGlhbGlzZSBwcm9wZXJ0aWVzIGlmIG5lZWRlZFxuICAgIHRoaXMucmVzdG9yZVBvaW50S2V5ID0gXCJyZXN0b3JlUG9pbnRcIjtcbiAgfVxuXG4gIGluaXRBdWRpb091dHB1dExpc3RlbmVyKCk6IHZvaWQge1xuICAgIGNvbnN0IGF1ZGlvT3V0cHV0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICBcInNheXBpLWF1ZGlvLW91dHB1dC1idXR0b25cIlxuICAgICk7XG4gICAgaWYgKGF1ZGlvT3V0cHV0QnV0dG9uKSB7XG4gICAgICBhdWRpb091dHB1dEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgIHRoaXMuaGFuZGxlQXVkaW9PdXRwdXRDbGljay5iaW5kKHRoaXMpXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8vIEV2ZW50IGhhbmRsZXJcbiAgcHJpdmF0ZSBoYW5kbGVBdWRpb091dHB1dENsaWNrKCk6IHZvaWQge1xuICAgIHRoaXMuYXVkaW9PdXRwdXRTdGF0dXMgPSAhdGhpcy5hdWRpb091dHB1dFN0YXR1czsgLy8gVG9nZ2xlIHRoZSBzdGF0ZVxuICB9XG5cbiAgLy8gMS4gRGV0ZWN0IHdoZW4gYSBzdWJtaXQgZXJyb3Igb2NjdXJzXG4gIGRldGVjdFN1Ym1pdEVycm9yKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHN1Ym1pdEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgXCJzYXlwaS1zdWJtaXRCdXR0b25cIlxuICAgICkgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsO1xuICAgIGNvbnN0IHRleHRhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICBcInNheXBpLXByb21wdFwiXG4gICAgKSBhcyBIVE1MVGV4dEFyZWFFbGVtZW50IHwgbnVsbDtcbiAgICBpZiAoc3VibWl0QnV0dG9uICYmIHRleHRhcmVhKSB7XG4gICAgICBpZiAoc3VibWl0QnV0dG9uLmRpc2FibGVkICYmIHRleHRhcmVhLnZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIDIuIENyZWF0ZSBhIFwicmVzdG9yZSBwb2ludFwiIGNhcHR1cmluZyBhcHBsaWNhdGlvbiBzdGF0ZVxuICBjcmVhdGVSZXN0b3JlUG9pbnQoe1xuICAgIHByb21wdDogbWVzc2FnZSxcbiAgICBhdWRpb0lucHV0RW5hYmxlZDogYXVkaW9JbnB1dFN0YXR1cyxcbiAgICBhdWRpb091dHB1dEVuYWJsZWQ6IGF1ZGlvT3V0cHV0U3RhdHVzLFxuICB9OiBSZXN0b3JlUG9pbnRBdXRvRGF0ZSk6IHZvaWQge1xuICAgIGNvbnN0IHJlc3RvcmVQb2ludDogUmVzdG9yZVBvaW50ID0ge1xuICAgICAgcHJvbXB0OiBtZXNzYWdlLFxuICAgICAgYXVkaW9JbnB1dEVuYWJsZWQ6IGF1ZGlvSW5wdXRTdGF0dXMsXG4gICAgICBhdWRpb091dHB1dEVuYWJsZWQ6IGF1ZGlvT3V0cHV0U3RhdHVzLFxuICAgICAgY3JlYXRpb25UaW1lOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgfTtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLnJlc3RvcmVQb2ludEtleSwgSlNPTi5zdHJpbmdpZnkocmVzdG9yZVBvaW50KSk7XG4gIH1cblxuICAvLyAzLiBQcm9ncmFtbWF0aWNhbGx5IHJlbG9hZCB0aGUgcGFnZVxuICByZWxvYWRQYWdlKCk6IHZvaWQge1xuICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgfVxuXG4gIGhhbmRsZVN1Ym1pdEVycm9yKCk6IHZvaWQge1xuICAgIGNvbnN0IHRleHRhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICBcInNheXBpLXByb21wdFwiXG4gICAgKSBhcyBIVE1MVGV4dEFyZWFFbGVtZW50IHwgbnVsbDtcbiAgICBjb25zdCBwcm9tcHQgPSB0ZXh0YXJlYSA/IHRleHRhcmVhLnZhbHVlIDogXCJcIjtcblxuICAgIGxldCBhdWRpb0lucHV0U3RhdHVzID0gdHJ1ZTtcbiAgICBjb25zdCBjYWxsQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS1jYWxsQnV0dG9uXCIpO1xuICAgIGlmIChjYWxsQnV0dG9uKSB7XG4gICAgICBhdWRpb0lucHV0U3RhdHVzID0gY2FsbEJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmVcIik7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coXCJDcmVhdGluZyByZXN0b3JlIHBvaW50XCIpO1xuICAgIHRoaXMuY3JlYXRlUmVzdG9yZVBvaW50KHtcbiAgICAgIHByb21wdDogcHJvbXB0LFxuICAgICAgYXVkaW9JbnB1dEVuYWJsZWQ6IGF1ZGlvSW5wdXRTdGF0dXMsXG4gICAgICBhdWRpb091dHB1dEVuYWJsZWQ6IHRoaXMuYXVkaW9PdXRwdXRTdGF0dXMsXG4gICAgfSk7XG4gICAgY29uc29sZS5sb2coXCJSZWxvYWRpbmcgcGFnZVwiKTtcbiAgICB0aGlzLnJlbG9hZFBhZ2UoKTtcbiAgfVxuXG4gIC8vIDQuIE9uIGxvYWQsIGNoZWNrIGZvciBhIHJlc3RvcmUgcG9pbnRcbiAgY2hlY2tGb3JSZXN0b3JlUG9pbnQoKTogdm9pZCB7XG4gICAgY29uc3Qgc3RvcmVkRGF0YSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMucmVzdG9yZVBvaW50S2V5KTtcbiAgICBpZiAoc3RvcmVkRGF0YSkge1xuICAgICAgY29uc3QgcmVzdG9yZVBvaW50OiBSZXN0b3JlUG9pbnQgPSBKU09OLnBhcnNlKHN0b3JlZERhdGEpO1xuICAgICAgY29uc3QgY3VycmVudFRpbWUgPSBuZXcgRGF0ZSgpO1xuICAgICAgY29uc3QgcmVzdG9yZVRpbWUgPSBuZXcgRGF0ZShyZXN0b3JlUG9pbnQuY3JlYXRpb25UaW1lKTtcblxuICAgICAgY29uc3QgdGltZURpZmZlcmVuY2UgPVxuICAgICAgICAoY3VycmVudFRpbWUuZ2V0VGltZSgpIC0gcmVzdG9yZVRpbWUuZ2V0VGltZSgpKSAvICgxMDAwICogNjApOyAvLyBpbiBtaW51dGVzXG5cbiAgICAgIGlmICh0aW1lRGlmZmVyZW5jZSA8PSA1KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVzdG9yaW5nIGFwcGxpY2F0aW9uIHN0YXRlXCIsIHJlc3RvcmVQb2ludCk7XG4gICAgICAgIHNldFByb21wdFRleHQocmVzdG9yZVBvaW50LnByb21wdCk7XG4gICAgICAgIHRoaXMuYWN0aXZhdGVBdWRpb0lucHV0KHJlc3RvcmVQb2ludC5hdWRpb0lucHV0RW5hYmxlZCk7XG4gICAgICAgIHRoaXMuYWN0aXZhdGVBdWRpb091dHB1dChyZXN0b3JlUG9pbnQuYXVkaW9PdXRwdXRFbmFibGVkKTtcbiAgICAgICAgLy8gRGVsZXRlIHRoZSBleGVjdXRlZCByZXN0b3JlIHBvaW50XG4gICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMucmVzdG9yZVBvaW50S2V5KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhY3RpdmF0ZUF1ZGlvSW5wdXQoZW5hYmxlOiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKGVuYWJsZSkge1xuICAgICAgY29uc3QgY2FsbEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F5cGktY2FsbEJ1dHRvblwiKTtcbiAgICAgIGlmIChjYWxsQnV0dG9uKSB7XG4gICAgICAgIGNhbGxCdXR0b24uY2xpY2soKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhY3RpdmF0ZUF1ZGlvT3V0cHV0KGVuYWJsZTogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmIChlbmFibGUpIHtcbiAgICAgIGNvbnN0IGF1ZGlvT3V0cHV0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgIFwic2F5cGktYXVkaW8tb3V0cHV0LWJ1dHRvblwiXG4gICAgICApO1xuICAgICAgaWYgKGF1ZGlvT3V0cHV0QnV0dG9uKSB7XG4gICAgICAgIGF1ZGlvT3V0cHV0QnV0dG9uLmNsaWNrKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8vIFNpbmdsZXRvblxuZXhwb3J0IGNvbnN0IHN1Ym1pdEVycm9ySGFuZGxlciA9IG5ldyBTdWJtaXRFcnJvckhhbmRsZXIoKTtcbiIsImltcG9ydCB7IGNvbmZpZyB9IGZyb20gXCIuL0NvbmZpZ01vZHVsZS5qc1wiO1xuaW1wb3J0IFN0YXRlTWFjaGluZVNlcnZpY2UgZnJvbSBcIi4vU3RhdGVNYWNoaW5lU2VydmljZS5qc1wiO1xuaW1wb3J0IHsgaXNNb2JpbGVWaWV3IH0gZnJvbSBcIi4vVXNlckFnZW50TW9kdWxlLmpzXCI7XG5pbXBvcnQgRXZlbnRCdXMgZnJvbSBcIi4vRXZlbnRCdXMuanNcIjtcbmltcG9ydCBFdmVudE1vZHVsZSBmcm9tIFwiLi9FdmVudE1vZHVsZS5qc1wiO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSBcIi4vTG9nZ2luZ01vZHVsZS5qc1wiO1xuXG4vLyBEZWZpbmUgdGhlIHNoYXBlIG9mIHRoZSByZXNwb25zZSBKU09OIG9iamVjdFxuaW50ZXJmYWNlIFRyYW5zY3JpcHRpb25SZXNwb25zZSB7XG4gIHRleHQ6IHN0cmluZztcbiAgc2VxdWVuY2VOdW1iZXI6IG51bWJlcjtcbiAgcEZpbmlzaGVkU3BlYWtpbmc/OiBudW1iZXI7XG4gIHRlbXBvPzogbnVtYmVyO1xufVxuXG5jb25zdCBrbm93bk5ldHdvcmtFcnJvck1lc3NhZ2VzID0gW1xuICBcIkZhaWxlZCB0byBmZXRjaFwiLCAvLyBDaHJvbWl1bS1iYXNlZCBicm93c2Vyc1xuICBcIkxvYWQgZmFpbGVkXCIsIC8vIFNhZmFyaVxuICBcIk5ldHdvcmtFcnJvciB3aGVuIGF0dGVtcHRpbmcgdG8gZmV0Y2ggcmVzb3VyY2UuXCIsIC8vIEZpcmVmb3hcbiAgLy8gQWRkIG1vcmUga25vd24gZXJyb3IgbWVzc2FnZXMgaGVyZVxuXTtcblxuLy8gdGltZW91dCBmb3IgdHJhbnNjcmlwdGlvbiByZXF1ZXN0c1xuY29uc3QgVElNRU9VVF9NUyA9IDMwMDAwOyAvLyAzMCBzZWNvbmRzXG5cbi8vIHRyYWNrIHNlcXVlbmNlIG51bWJlcnMgZm9yIGluLWZsaWdodCB0cmFuc2NyaXB0aW9uIHJlcXVlc3RzXG5sZXQgc2VxdWVuY2VOdW0gPSAwO1xuY29uc3Qgc2VxdWVuY2VOdW1zUGVuZGluZ1RyYW5zY3JpcHRpb246IFNldDx7XG4gIHNlcTogbnVtYmVyO1xuICB0aW1lc3RhbXA6IG51bWJlcjtcbn0+ID0gbmV3IFNldCgpO1xuXG5mdW5jdGlvbiBjaGVja0ZvckV4cGlyZWRFbnRyaWVzKCkge1xuICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICBzZXF1ZW5jZU51bXNQZW5kaW5nVHJhbnNjcmlwdGlvbi5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgIGlmIChub3cgLSBlbnRyeS50aW1lc3RhbXAgPiBUSU1FT1VUX01TKSB7XG4gICAgICBzZXF1ZW5jZU51bXNQZW5kaW5nVHJhbnNjcmlwdGlvbi5kZWxldGUoZW50cnkpO1xuICAgICAgbG9nZ2VyLmluZm8oYFRyYW5zY3JpcHRpb24gcmVxdWVzdCAke2VudHJ5LnNlcX0gdGltZWQgb3V0YCk7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gdHJhbnNjcmlwdGlvblNlbnQoKTogdm9pZCB7XG4gIHNlcXVlbmNlTnVtKys7XG4gIHNlcXVlbmNlTnVtc1BlbmRpbmdUcmFuc2NyaXB0aW9uLmFkZCh7XG4gICAgc2VxOiBzZXF1ZW5jZU51bSxcbiAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gIH0pO1xufVxuXG5mdW5jdGlvbiB0cmFuc2NyaXB0aW9uUmVjZWl2ZWQoc2VxOiBudW1iZXIpOiB2b2lkIHtcbiAgLy8gZGVsZXRlIGVudHJ5IHdpdGggbWF0Y2hpbmcgc2VxdWVuY2UgbnVtYmVyXG4gIHNlcXVlbmNlTnVtc1BlbmRpbmdUcmFuc2NyaXB0aW9uLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgaWYgKGVudHJ5LnNlcSA9PT0gc2VxKSB7XG4gICAgICBzZXF1ZW5jZU51bXNQZW5kaW5nVHJhbnNjcmlwdGlvbi5kZWxldGUoZW50cnkpO1xuICAgICAgbG9nZ2VyLmRlYnVnKFxuICAgICAgICBgVHJhbnNjcmlwdGlvbiByZXNwb25zZSAke3NlcX0gcmVjZWl2ZWQgYWZ0ZXIgJHtcbiAgICAgICAgICAoRGF0ZS5ub3coKSAtIGVudHJ5LnRpbWVzdGFtcCkgLyAxMDAwXG4gICAgICAgIH1zYFxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNUcmFuc2NyaXB0aW9uUGVuZGluZygpOiBib29sZWFuIHtcbiAgY2hlY2tGb3JFeHBpcmVkRW50cmllcygpO1xuICByZXR1cm4gc2VxdWVuY2VOdW1zUGVuZGluZ1RyYW5zY3JpcHRpb24uc2l6ZSA+IDA7XG59XG5cbi8vIGNhbGwgYWZ0ZXIgY29tcGxldGVkIHVzZXIgaW5wdXQgaXMgc3VibWl0dGVkXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJQZW5kaW5nVHJhbnNjcmlwdGlvbnMoKTogdm9pZCB7XG4gIHNlcXVlbmNlTnVtc1BlbmRpbmdUcmFuc2NyaXB0aW9uLmNsZWFyKCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGxvYWRBdWRpb1dpdGhSZXRyeShcbiAgYXVkaW9CbG9iOiBCbG9iLFxuICBhdWRpb0R1cmF0aW9uTWlsbGlzOiBudW1iZXIsXG4gIHByZWNlZGluZ1RyYW5zY3JpcHRzOiBSZWNvcmQ8bnVtYmVyLCBzdHJpbmc+ID0ge30sXG4gIG1heFJldHJpZXM6IG51bWJlciA9IDNcbik6IFByb21pc2U8dm9pZD4ge1xuICBsZXQgcmV0cnlDb3VudCA9IDA7XG4gIGxldCBkZWxheSA9IDEwMDA7IC8vIGluaXRpYWwgZGVsYXkgb2YgMSBzZWNvbmRcblxuICBjb25zdCBzbGVlcCA9IChtczogbnVtYmVyKSA9PlxuICAgIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG5cbiAgd2hpbGUgKHJldHJ5Q291bnQgPCBtYXhSZXRyaWVzKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRyYW5zY3JpcHRpb25TZW50KCk7XG4gICAgICBhd2FpdCB1cGxvYWRBdWRpbyhhdWRpb0Jsb2IsIGF1ZGlvRHVyYXRpb25NaWxsaXMsIHByZWNlZGluZ1RyYW5zY3JpcHRzKTtcbiAgICAgIHJldHVybjtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgLy8gY2hlY2sgZm9yIHRpbWVvdXQgZXJyb3JzICgzMHMgb24gSGVyb2t1KVxuICAgICAgaWYgKFxuICAgICAgICBlcnJvciBpbnN0YW5jZW9mIFR5cGVFcnJvciAmJlxuICAgICAgICBrbm93bk5ldHdvcmtFcnJvck1lc3NhZ2VzLmluY2x1ZGVzKGVycm9yLm1lc3NhZ2UpXG4gICAgICApIHtcbiAgICAgICAgbG9nZ2VyLmluZm8oXG4gICAgICAgICAgYEF0dGVtcHQgJHtyZXRyeUNvdW50ICsgMX0vJHttYXhSZXRyaWVzfSBmYWlsZWQuIFJldHJ5aW5nIGluICR7XG4gICAgICAgICAgICBkZWxheSAvIDEwMDBcbiAgICAgICAgICB9IHNlY29uZHMuLi5gXG4gICAgICAgICk7XG4gICAgICAgIGF3YWl0IHNsZWVwKGRlbGF5KTtcblxuICAgICAgICAvLyBFeHBvbmVudGlhbCBiYWNrb2ZmXG4gICAgICAgIGRlbGF5ICo9IDI7XG5cbiAgICAgICAgcmV0cnlDb3VudCsrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIlVuZXhwZWN0ZWQgZXJyb3I6IFwiLCBlcnJvcik7XG4gICAgICAgIFN0YXRlTWFjaGluZVNlcnZpY2UuYWN0b3Iuc2VuZChcInNheXBpOnRyYW5zY3JpYmVGYWlsZWRcIiwge1xuICAgICAgICAgIGRldGFpbDogZXJyb3IsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc29sZS5lcnJvcihcIk1heCByZXRyaWVzIHJlYWNoZWQuIEdpdmluZyB1cC5cIik7XG4gIFN0YXRlTWFjaGluZVNlcnZpY2UuYWN0b3Iuc2VuZChcInNheXBpOnRyYW5zY3JpYmVGYWlsZWRcIiwge1xuICAgIGRldGFpbDogbmV3IEVycm9yKFwiTWF4IHJldHJpZXMgcmVhY2hlZFwiKSxcbiAgfSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHVwbG9hZEF1ZGlvKFxuICBhdWRpb0Jsb2I6IEJsb2IsXG4gIGF1ZGlvRHVyYXRpb25NaWxsaXM6IG51bWJlcixcbiAgcHJlY2VkaW5nVHJhbnNjcmlwdHM6IFJlY29yZDxudW1iZXIsIHN0cmluZz4gPSB7fVxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIHRyeSB7XG4gICAgY29uc3QgbWVzc2FnZXMgPSBPYmplY3QuZW50cmllcyhwcmVjZWRpbmdUcmFuc2NyaXB0cykubWFwKFxuICAgICAgKFtzZXEsIGNvbnRlbnRdKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcm9sZTogXCJ1c2VyXCIsXG4gICAgICAgICAgY29udGVudDogY29udGVudCxcbiAgICAgICAgICBzZXF1ZW5jZU51bWJlcjogTnVtYmVyKHNlcSksIC8vIENvbnZlcnQgdGhlIHN0cmluZyB0byBhIG51bWJlclxuICAgICAgICB9O1xuICAgICAgfVxuICAgICk7XG5cbiAgICBjb25zdCBmb3JtRGF0YSA9IGNvbnN0cnVjdFRyYW5zY3JpcHRpb25Gb3JtRGF0YShcbiAgICAgIGF1ZGlvQmxvYixcbiAgICAgIGF1ZGlvRHVyYXRpb25NaWxsaXMgLyAxMDAwLFxuICAgICAgbWVzc2FnZXNcbiAgICApO1xuICAgIGNvbnN0IGxhbmd1YWdlID0gbmF2aWdhdG9yLmxhbmd1YWdlO1xuXG4gICAgY29uc3QgY29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICBjb25zdCB7IHNpZ25hbCB9ID0gY29udHJvbGxlcjtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4gY29udHJvbGxlci5hYm9ydCgpLCBUSU1FT1VUX01TKTtcblxuICAgIGNvbnN0IHN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIGNvbnN0IHJlc3BvbnNlOiBSZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgYCR7Y29uZmlnLmFwaVNlcnZlclVybH0vdHJhbnNjcmliZT9sYW5ndWFnZT0ke2xhbmd1YWdlfWAsXG4gICAgICB7XG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIGJvZHk6IGZvcm1EYXRhLFxuICAgICAgICBzaWduYWwsXG4gICAgICB9XG4gICAgKTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlc3BvbnNlLnN0YXR1c306ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNwb25zZUpzb246IFRyYW5zY3JpcHRpb25SZXNwb25zZSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICBjb25zdCBzZXEgPSByZXNwb25zZUpzb24uc2VxdWVuY2VOdW1iZXI7XG4gICAgaWYgKHNlcSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0cmFuc2NyaXB0aW9uUmVjZWl2ZWQoc2VxKTtcbiAgICB9XG4gICAgY29uc3QgZW5kVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIGNvbnN0IHRyYW5zY3JpcHRpb25EdXJhdGlvbk1pbGxpcyA9IGVuZFRpbWUgLSBzdGFydFRpbWU7XG4gICAgY29uc3QgdHJhbnNjcmlwdCA9IHJlc3BvbnNlSnNvbi50ZXh0O1xuICAgIGNvbnN0IHdjID0gdHJhbnNjcmlwdC5zcGxpdChcIiBcIikubGVuZ3RoO1xuICAgIGNvbnN0IHBheWxvYWQ6IFRyYW5zY3JpcHRpb25SZXNwb25zZSA9IHtcbiAgICAgIHRleHQ6IHRyYW5zY3JpcHQsXG4gICAgICBzZXF1ZW5jZU51bWJlcjogc2VxLFxuICAgIH07XG4gICAgaWYgKHJlc3BvbnNlSnNvbi5oYXNPd25Qcm9wZXJ0eShcInBGaW5pc2hlZFNwZWFraW5nXCIpKSB7XG4gICAgICBwYXlsb2FkLnBGaW5pc2hlZFNwZWFraW5nID0gcmVzcG9uc2VKc29uLnBGaW5pc2hlZFNwZWFraW5nO1xuICAgIH1cbiAgICBpZiAocmVzcG9uc2VKc29uLmhhc093blByb3BlcnR5KFwidGVtcG9cIikpIHtcbiAgICAgIHBheWxvYWQudGVtcG8gPSByZXNwb25zZUpzb24udGVtcG87XG4gICAgfVxuXG4gICAgbG9nZ2VyLmluZm8oXG4gICAgICBgVHJhbnNjcmliZWQgJHtNYXRoLnJvdW5kKFxuICAgICAgICBhdWRpb0R1cmF0aW9uTWlsbGlzIC8gMTAwMFxuICAgICAgKX1zIG9mIGF1ZGlvIGludG8gJHt3Y30gd29yZHMgaW4gJHtNYXRoLnJvdW5kKFxuICAgICAgICB0cmFuc2NyaXB0aW9uRHVyYXRpb25NaWxsaXMgLyAxMDAwXG4gICAgICApfXNgXG4gICAgKTtcblxuICAgIGlmIChyZXNwb25zZUpzb24udGV4dC5sZW5ndGggPT09IDApIHtcbiAgICAgIFN0YXRlTWFjaGluZVNlcnZpY2UuYWN0b3Iuc2VuZChcInNheXBpOnRyYW5zY3JpYmVkRW1wdHlcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIFN0YXRlTWFjaGluZVNlcnZpY2UuYWN0b3Iuc2VuZChcInNheXBpOnRyYW5zY3JpYmVkXCIsIHBheWxvYWQpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3I6IHVua25vd24pIHtcbiAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgaWYgKGVycm9yLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGZXRjaCBhYm9ydGVkIGR1ZSB0byB0aW1lb3V0XCIsIGVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJBbiB1bmV4cGVjdGVkIGVycm9yIG9jY3VycmVkOlwiLCBlcnJvcik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJTb21ldGhpbmcgdGhyb3duIHRoYXQgaXMgbm90IGFuIEVycm9yIG9iamVjdDpcIiwgZXJyb3IpO1xuICAgIH1cblxuICAgIC8vIHJlLXRocm93IHRoZSBlcnJvciBpZiB5b3VyIGxvZ2ljIHJlcXVpcmVzIGl0XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn1cblxuZnVuY3Rpb24gY29uc3RydWN0VHJhbnNjcmlwdGlvbkZvcm1EYXRhKFxuICBhdWRpb0Jsb2I6IEJsb2IsXG4gIGF1ZGlvRHVyYXRpb25TZWNvbmRzOiBudW1iZXIsXG4gIG1lc3NhZ2VzOiB7IHJvbGU6IHN0cmluZzsgY29udGVudDogc3RyaW5nOyBzZXF1ZW5jZU51bWJlcj86IG51bWJlciB9W11cbikge1xuICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICBsZXQgYXVkaW9GaWxlbmFtZSA9IFwiYXVkaW8ud2VibVwiO1xuXG4gIGlmIChhdWRpb0Jsb2IudHlwZSA9PT0gXCJhdWRpby9tcDRcIikge1xuICAgIGF1ZGlvRmlsZW5hbWUgPSBcImF1ZGlvLm1wNFwiO1xuICB9IGVsc2UgaWYgKGF1ZGlvQmxvYi50eXBlID09PSBcImF1ZGlvL3dhdlwiKSB7XG4gICAgYXVkaW9GaWxlbmFtZSA9IFwiYXVkaW8ud2F2XCI7XG4gIH1cblxuICBsb2dnZXIuaW5mbyhcbiAgICBgVHJhbnNjcmliaW5nIGF1ZGlvIEJsb2Igd2l0aCBNSU1FIHR5cGU6ICR7YXVkaW9CbG9iLnR5cGV9LCBzaXplOiAkeyhcbiAgICAgIGF1ZGlvQmxvYi5zaXplIC8gMTAyNFxuICAgICkudG9GaXhlZCgyKX1rYmBcbiAgKTtcblxuICAvLyBBZGQgdGhlIGF1ZGlvIGJsb2IgdG8gdGhlIEZvcm1EYXRhIG9iamVjdFxuICBmb3JtRGF0YS5hcHBlbmQoXCJhdWRpb1wiLCBhdWRpb0Jsb2IsIGF1ZGlvRmlsZW5hbWUpO1xuICBmb3JtRGF0YS5hcHBlbmQoXCJkdXJhdGlvblwiLCBhdWRpb0R1cmF0aW9uU2Vjb25kcy50b1N0cmluZygpKTtcbiAgZm9ybURhdGEuYXBwZW5kKFwic2VxdWVuY2VOdW1iZXJcIiwgc2VxdWVuY2VOdW0udG9TdHJpbmcoKSk7XG4gIGZvcm1EYXRhLmFwcGVuZChcIm1lc3NhZ2VzXCIsIEpTT04uc3RyaW5naWZ5KG1lc3NhZ2VzKSk7XG4gIHJldHVybiBmb3JtRGF0YTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldFByb21wdFRleHQodHJhbnNjcmlwdDogc3RyaW5nKTogdm9pZCB7XG4gIGxvZ2dlci5pbmZvKGBNZXJnZWQgdHJhbnNjcmlwdDogJHt0cmFuc2NyaXB0fWApO1xuICBjb25zdCB0ZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgIFwic2F5cGktcHJvbXB0XCJcbiAgKSBhcyBIVE1MVGV4dEFyZWFFbGVtZW50O1xuICBpZiAoaXNNb2JpbGVWaWV3KCkpIHtcbiAgICAvLyBpZiB0cmFuc2NyaXB0IGlzID4gMTAwMCBjaGFyYWN0ZXJzLCB0cnVuY2F0ZSBpdCB0byA5OTkgY2hhcmFjdGVycyBwbHVzIGFuIGVsbGlwc2lzXG4gICAgaWYgKHRyYW5zY3JpcHQubGVuZ3RoID4gMTAwMCkge1xuICAgICAgdHJhbnNjcmlwdCA9IGAke3RyYW5zY3JpcHQuc3Vic3RyaW5nKDAsIDk5OSl94oCmYDtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgYFRyYW5zY3JpcHQgd2FzIHRvbyBsb25nIGZvciBQaS4gVHJ1bmNhdGVkIHRvIDk5OSBjaGFyYWN0ZXJzLCBsb3NpbmcgdGhlIGZvbGxvd2luZyB0ZXh0OiAuLi4gJHt0cmFuc2NyaXB0LnN1YnN0cmluZyhcbiAgICAgICAgICA5OTlcbiAgICAgICAgKX1gXG4gICAgICApO1xuICAgIH1cbiAgICBFdmVudE1vZHVsZS5zZXROYXRpdmVWYWx1ZSh0ZXh0YXJlYSwgdHJhbnNjcmlwdCk7XG4gICAgRXZlbnRCdXMuZW1pdChcInNheXBpOmF1dG9TdWJtaXRcIik7XG4gIH0gZWxzZSB7XG4gICAgRXZlbnRNb2R1bGUuc2ltdWxhdGVUeXBpbmcodGV4dGFyZWEsIGAke3RyYW5zY3JpcHR9IGApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVRyYW5zY3JpcHRzKHRyYW5zY3JpcHRzOiBSZWNvcmQ8bnVtYmVyLCBzdHJpbmc+KTogc3RyaW5nIHtcbiAgY29uc3Qgc29ydGVkS2V5cyA9IE9iamVjdC5rZXlzKHRyYW5zY3JpcHRzKVxuICAgIC5tYXAoTnVtYmVyKVxuICAgIC5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG5cbiAgY29uc3Qgc29ydGVkVHJhbnNjcmlwdHM6IHN0cmluZ1tdID0gW107XG5cbiAgZm9yIChjb25zdCBrZXkgb2Ygc29ydGVkS2V5cykge1xuICAgIHNvcnRlZFRyYW5zY3JpcHRzLnB1c2godHJhbnNjcmlwdHNba2V5XS50cmltKCkpO1xuICB9XG5cbiAgcmV0dXJuIHNvcnRlZFRyYW5zY3JpcHRzLmpvaW4oXCIgXCIpO1xufVxuIiwiaW1wb3J0IHsgYnV0dG9uTW9kdWxlIH0gZnJvbSBcIi4uL0J1dHRvbk1vZHVsZS5qc1wiO1xuaW1wb3J0IHsgY3JlYXRlTWFjaGluZSwgVHlwZXN0YXRlLCBhc3NpZ24gfSBmcm9tIFwieHN0YXRlXCI7XG5pbXBvcnQgQW5pbWF0aW9uTW9kdWxlIGZyb20gXCIuLi9BbmltYXRpb25Nb2R1bGUuanNcIjtcbmltcG9ydCB7IGlzTW9iaWxlVmlldyB9IGZyb20gXCIuLi9Vc2VyQWdlbnRNb2R1bGUuanNcIjtcbmltcG9ydCB7XG4gIHVwbG9hZEF1ZGlvV2l0aFJldHJ5LFxuICBzZXRQcm9tcHRUZXh0LFxuICBpc1RyYW5zY3JpcHRpb25QZW5kaW5nLFxuICBjbGVhclBlbmRpbmdUcmFuc2NyaXB0aW9ucyxcbiAgbWVyZ2VUcmFuc2NyaXB0cyxcbn0gZnJvbSBcIi4uL1RyYW5zY3JpcHRpb25Nb2R1bGVcIjtcbmltcG9ydCBFdmVudEJ1cyBmcm9tIFwiLi4vRXZlbnRCdXNcIjtcblxudHlwZSBTYXlQaVRyYW5zY3JpYmVkRXZlbnQgPSB7XG4gIHR5cGU6IFwic2F5cGk6dHJhbnNjcmliZWRcIjtcbiAgdGV4dDogc3RyaW5nO1xuICBzZXF1ZW5jZU51bWJlcjogbnVtYmVyO1xuICBwRmluaXNoZWRTcGVha2luZz86IG51bWJlcjtcbiAgdGVtcG8/OiBudW1iZXI7XG59O1xuXG50eXBlIFNheVBpU3BlZWNoU3RvcHBlZEV2ZW50ID0ge1xuICB0eXBlOiBcInNheXBpOnVzZXJTdG9wcGVkU3BlYWtpbmdcIjtcbiAgZHVyYXRpb246IG51bWJlcjtcbiAgYmxvYj86IEJsb2I7XG59O1xuXG50eXBlIFNheVBpRXZlbnQgPVxuICB8IHsgdHlwZTogXCJzYXlwaTp1c2VyU3BlYWtpbmdcIiB9XG4gIHwgU2F5UGlTcGVlY2hTdG9wcGVkRXZlbnRcbiAgfCB7IHR5cGU6IFwic2F5cGk6dXNlckZpbmlzaGVkU3BlYWtpbmdcIiB9XG4gIHwgU2F5UGlUcmFuc2NyaWJlZEV2ZW50XG4gIHwgeyB0eXBlOiBcInNheXBpOnRyYW5zY3JpYmVGYWlsZWRcIiB9XG4gIHwgeyB0eXBlOiBcInNheXBpOnRyYW5zY3JpYmVkRW1wdHlcIiB9XG4gIHwgeyB0eXBlOiBcInNheXBpOnBpU3BlYWtpbmdcIiB9XG4gIHwgeyB0eXBlOiBcInNheXBpOnBpU3RvcHBlZFNwZWFraW5nXCIgfVxuICB8IHsgdHlwZTogXCJzYXlwaTpwaUZpbmlzaGVkU3BlYWtpbmdcIiB9XG4gIHwgeyB0eXBlOiBcInNheXBpOnN1Ym1pdFwiIH1cbiAgfCB7IHR5cGU6IFwic2F5cGk6Y2FsbFwiIH1cbiAgfCB7IHR5cGU6IFwic2F5cGk6aGFuZ3VwXCIgfTtcblxuaW50ZXJmYWNlIFNheVBpQ29udGV4dCB7XG4gIHRyYW5zY3JpcHRpb25zOiBSZWNvcmQ8bnVtYmVyLCBzdHJpbmc+O1xuICBsYXN0U3RhdGU6IFwiaW5hY3RpdmVcIiB8IFwibGlzdGVuaW5nXCI7XG4gIHRpbWVVc2VyU3RvcHBlZFNwZWFraW5nOiBudW1iZXI7XG59XG5cbi8vIERlZmluZSB0aGUgc3RhdGUgc2NoZW1hXG50eXBlIFNheVBpU3RhdGVTY2hlbWEgPSB7XG4gIHN0YXRlczoge1xuICAgIGluYWN0aXZlOiB7fTtcbiAgICBlcnJvcnM6IHtcbiAgICAgIHN0YXRlczoge1xuICAgICAgICB0cmFuc2NyaWJlRmFpbGVkOiB7fTtcbiAgICAgICAgbWljRXJyb3I6IHt9O1xuICAgICAgfTtcbiAgICB9O1xuICAgIGxpc3RlbmluZzoge1xuICAgICAgc3RhdGVzOiB7XG4gICAgICAgIHJlY29yZGluZzoge1xuICAgICAgICAgIHN0YXRlczoge1xuICAgICAgICAgICAgdXNlclNwZWFraW5nOiB7fTtcbiAgICAgICAgICAgIG5vdFNwZWFraW5nOiB7fTtcbiAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgICAgICBjb252ZXJ0aW5nOiB7XG4gICAgICAgICAgc3RhdGVzOiB7XG4gICAgICAgICAgICB0cmFuc2NyaWJpbmc6IHt9O1xuICAgICAgICAgICAgYWNjdW11bGF0aW5nOiB7fTtcbiAgICAgICAgICAgIHN1Ym1pdHRpbmc6IHt9O1xuICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgICB9O1xuICAgIH07XG4gICAgcmVzcG9uZGluZzoge1xuICAgICAgc3RhdGVzOiB7XG4gICAgICAgIHBpU3BlYWtpbmc6IHt9O1xuICAgICAgfTtcbiAgICB9O1xuICB9O1xufTtcblxuaW50ZXJmYWNlIFNheVBpVHlwZXN0YXRlIGV4dGVuZHMgVHlwZXN0YXRlPFNheVBpQ29udGV4dD4ge1xuICB2YWx1ZTogXCJsaXN0ZW5pbmdcIiB8IFwiaW5hY3RpdmVcIiB8IFwiZXJyb3JzXCIgfCBcInJlc3BvbmRpbmdcIjtcbiAgY29udGV4dDogU2F5UGlDb250ZXh0O1xufVxuXG4vKiBoZWxwZXIgZnVuY3Rpb25zICovXG5leHBvcnQgZnVuY3Rpb24gY2FsY3VsYXRlRGVsYXkoXG4gIHRpbWVVc2VyU3RvcHBlZFNwZWFraW5nOiBudW1iZXIsXG4gIHByb2JhYmlsaXR5RmluaXNoZWQ6IG51bWJlcixcbiAgdGVtcG86IG51bWJlcixcbiAgbWF4RGVsYXk6IG51bWJlclxuKTogbnVtYmVyIHtcbiAgLy8gR2V0IHRoZSBjdXJyZW50IHRpbWUgKGluIG1pbGxpc2Vjb25kcylcbiAgY29uc3QgY3VycmVudFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAvLyBDYWxjdWxhdGUgdGhlIHRpbWUgZWxhcHNlZCBzaW5jZSB0aGUgdXNlciBzdG9wcGVkIHNwZWFraW5nIChpbiBtaWxsaXNlY29uZHMpXG4gIGNvbnN0IHRpbWVFbGFwc2VkID0gY3VycmVudFRpbWUgLSB0aW1lVXNlclN0b3BwZWRTcGVha2luZztcblxuICAvLyBXZSBpbnZlcnQgdGhlIHRlbXBvIGJlY2F1c2UgYSBmYXN0ZXIgc3BlZWNoICh0ZW1wbyBhcHByb2FjaGluZyAxKSBzaG91bGQgcmVkdWNlIHRoZSBkZWxheVxuICBsZXQgdGVtcG9GYWN0b3IgPSAxIC0gdGVtcG87XG5cbiAgLy8gQ2FsY3VsYXRlIHRoZSBjb21iaW5lZCBwcm9iYWJpbGl0eSBmYWN0b3JcbiAgbGV0IGNvbWJpbmVkUHJvYmFiaWxpdHkgPSBwcm9iYWJpbGl0eUZpbmlzaGVkICogdGVtcG9GYWN0b3I7XG5cbiAgLy8gVGhlIGNvbWJpbmVkIGZhY3RvciBpbmZsdWVuY2VzIHRoZSBpbml0aWFsIGRlbGF5XG4gIGNvbnN0IGluaXRpYWxEZWxheSA9IGNvbWJpbmVkUHJvYmFiaWxpdHkgKiBtYXhEZWxheTtcblxuICAvLyBDYWxjdWxhdGUgdGhlIGZpbmFsIGRlbGF5IGFmdGVyIGFjY291bnRpbmcgZm9yIHRoZSB0aW1lIGFscmVhZHkgZWxhcHNlZFxuICBjb25zdCBmaW5hbERlbGF5ID0gTWF0aC5tYXgoaW5pdGlhbERlbGF5IC0gdGltZUVsYXBzZWQsIDApO1xuICByZXR1cm4gZmluYWxEZWxheTtcbn1cblxuLyogZXh0ZXJuYWwgYWN0aW9ucyAqL1xuY29uc3QgY2xlYXJUcmFuc2NyaXB0cyA9IGFzc2lnbih7XG4gIHRyYW5zY3JpcHRpb25zOiAoKSA9PiAoe30pLFxufSk7XG5cbmV4cG9ydCBjb25zdCBtYWNoaW5lID0gY3JlYXRlTWFjaGluZTxTYXlQaUNvbnRleHQsIFNheVBpRXZlbnQsIFNheVBpVHlwZXN0YXRlPihcbiAge1xuICAgIGNvbnRleHQ6IHtcbiAgICAgIHRyYW5zY3JpcHRpb25zOiB7fSxcbiAgICAgIGxhc3RTdGF0ZTogXCJpbmFjdGl2ZVwiLFxuICAgICAgdGltZVVzZXJTdG9wcGVkU3BlYWtpbmc6IDAsXG4gICAgfSxcbiAgICBpZDogXCJzYXlQaVwiLFxuICAgIGluaXRpYWw6IFwiaW5hY3RpdmVcIixcbiAgICBzdGF0ZXM6IHtcbiAgICAgIGluYWN0aXZlOiB7XG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIklkbGUgc3RhdGUsIG5vdCBsaXN0ZW5pbmcgb3Igc3BlYWtpbmcuIFByaXZhY3kgbW9kZS5cIixcbiAgICAgICAgZXhpdDogYXNzaWduKHsgbGFzdFN0YXRlOiBcImluYWN0aXZlXCIgfSksXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgXCJzYXlwaTpjYWxsXCI6IHtcbiAgICAgICAgICAgIHRhcmdldDogXCIjc2F5UGkubGlzdGVuaW5nLnJlY29yZGluZ1wiLFxuICAgICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJjYWxsU3RhcnRlZFwiLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJzdGFydFJlY29yZGluZ1wiLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgICAgICAnRW5hYmxlIHRoZSBWQUQgbWljcm9waG9uZS5cXG5Ba2EgXCJjYWxsXCIgUGkuXFxuU3RhcnRzIGFjdGl2ZSBsaXN0ZW5pbmcuJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2F5cGk6cGlTcGVha2luZ1wiOiB7XG4gICAgICAgICAgICB0YXJnZXQ6IFwiI3NheVBpLnJlc3BvbmRpbmcucGlTcGVha2luZ1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgZXJyb3JzOiB7XG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIkVycm9yIHBhcmVudCBzdGF0ZS5cIixcbiAgICAgICAgYWZ0ZXI6IHtcbiAgICAgICAgICBcIjEwMDAwXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdGFyZ2V0OiBcIiNzYXlQaS5saXN0ZW5pbmdcIixcbiAgICAgICAgICAgICAgYWN0aW9uczogW10sXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlJlc2V0IHRvIHRoZSBpZGxlIHN0YXRlIGFuZCBjbGVhciBlcnJvcnMuXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpbnRlcm5hbDogZmFsc2UsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIGluaXRpYWw6IFwidHJhbnNjcmliZUZhaWxlZFwiLFxuICAgICAgICBzdGF0ZXM6IHtcbiAgICAgICAgICB0cmFuc2NyaWJlRmFpbGVkOiB7XG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgL3RyYW5zY3JpYmUgQVBJIHJlc3BvbmRlZCB3aXRoIGFuIGVycm9yLlwiLFxuICAgICAgICAgICAgZW50cnk6IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJzdGFydEFuaW1hdGlvblwiLFxuICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IFwiZXJyb3JcIixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBleGl0OiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwic3RvcEFuaW1hdGlvblwiLFxuICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IFwiZXJyb3JcIixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiBcImZpbmFsXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBtaWNFcnJvcjoge1xuICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiTm8gYXVkaW8gaW5wdXQgZGV0ZWN0ZWRcIixcbiAgICAgICAgICAgIGVudHJ5OiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwic2hvd05vdGlmaWNhdGlvblwiLFxuICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICBpY29uOiBcIm11dGVkLW1pY3JvcGhvbmVcIixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBleGl0OiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZGlzbWlzc05vdGlmaWNhdGlvblwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR5cGU6IFwiZmluYWxcIixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGxpc3RlbmluZzoge1xuICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICBcIkFjdGl2ZWx5IGxpc3RlbmluZyBmb3IgdXNlciBpbnB1dC4gU2ltdWx0YW5lb3VzbHkgcmVjb3JkaW5nIGFuZCB0cmFuc2NyaWJpbmcgdXNlciBzcGVlY2guIEdlbnRsZSBwdWxzaW5nIGFuaW1hdGlvbi5cIixcbiAgICAgICAgZW50cnk6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiBcInN0b3BBbGxBbmltYXRpb25zXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiBcImFjcXVpcmVNaWNyb3Bob25lXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgZXhpdDogYXNzaWduKHsgbGFzdFN0YXRlOiBcImxpc3RlbmluZ1wiIH0pLFxuICAgICAgICBzdGF0ZXM6IHtcbiAgICAgICAgICByZWNvcmRpbmc6IHtcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgICAgICBcIk1pY3JvcGhvbmUgaXMgb24gYW5kIFZBRCBpcyBhY3RpdmVseSBsaXN0ZW5pbmcgZm9yIHVzZXIgc3BlZWNoLlwiLFxuICAgICAgICAgICAgaW5pdGlhbDogXCJub3RTcGVha2luZ1wiLFxuICAgICAgICAgICAgc3RhdGVzOiB7XG4gICAgICAgICAgICAgIG5vdFNwZWFraW5nOiB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgICAgICAgICBcIk1pY3JvcGhvbmUgaXMgcmVjb3JkaW5nIGJ1dCBubyBzcGVlY2ggaXMgZGV0ZWN0ZWQuXCIsXG4gICAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICAgIFwic2F5cGk6dXNlckZpbmlzaGVkU3BlYWtpbmdcIjoge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IFwiI3NheVBpLmluYWN0aXZlXCIsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXCJzYXlwaTp1c2VyU3BlYWtpbmdcIjoge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IFwidXNlclNwZWFraW5nXCIsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHVzZXJTcGVha2luZzoge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgICAgICAgICAgXCJVc2VyIGlzIHNwZWFraW5nIGFuZCBiZWluZyByZWNvcmRlZCBieSB0aGUgbWljcm9waG9uZS5cXG5XYXZlZm9ybSBhbmltYXRpb24uXCIsXG4gICAgICAgICAgICAgICAgZW50cnk6IHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6IFwic3RhcnRBbmltYXRpb25cIixcbiAgICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb246IFwidXNlclNwZWFraW5nXCIsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXhpdDoge1xuICAgICAgICAgICAgICAgICAgdHlwZTogXCJzdG9wQW5pbWF0aW9uXCIsXG4gICAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBcInVzZXJTcGVha2luZ1wiLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgICAgICBcInNheXBpOnVzZXJTdG9wcGVkU3BlYWtpbmdcIjogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBbXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5vdFNwZWFraW5nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiNzYXlQaS5saXN0ZW5pbmcuY29udmVydGluZy50cmFuc2NyaWJpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgIGNvbmQ6IFwiaGFzQXVkaW9cIixcbiAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICBhc3NpZ24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lVXNlclN0b3BwZWRTcGVha2luZzogKCkgPT4gbmV3IERhdGUoKS5nZXRUaW1lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ0cmFuc2NyaWJlQXVkaW9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogXCJub3RTcGVha2luZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgIGNvbmQ6IFwiaGFzTm9BdWRpb1wiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgIFwic2F5cGk6aGFuZ3VwXCI6IHtcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IFwiI3NheVBpLmluYWN0aXZlXCIsXG4gICAgICAgICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInN0b3BSZWNvcmRpbmdcIixcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwicmVsZWFzZU1pY3JvcGhvbmVcIixcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY2FsbEVuZGVkXCIsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgICAgICAgICAnRGlzYWJsZSB0aGUgVkFEIG1pY3JvcGhvbmUuXFxuICAgIEFrYSBcImNhbGxcIiBQaS5cXG4gICAgU3RvcHMgYWN0aXZlIGxpc3RlbmluZy4nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNvbnZlcnRpbmc6IHtcbiAgICAgICAgICAgIGluaXRpYWw6IFwiYWNjdW11bGF0aW5nXCIsXG4gICAgICAgICAgICBzdGF0ZXM6IHtcbiAgICAgICAgICAgICAgYWNjdW11bGF0aW5nOiB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgICAgICAgICBcIkFjY3VtdWxhdGluZyBhbmQgYXNzZW1ibGluZyBhdWRpbyB0cmFuc2NyaXB0aW9ucyBpbnRvIGEgY29oZXNpdmUgcHJvbXB0LlxcblN1Ym1pdHMgYSBwcm9tcHQgd2hlbiBhIHRocmVzaG9sZCBpcyByZWFjaGVkLlwiLFxuICAgICAgICAgICAgICAgIGFmdGVyOiB7XG4gICAgICAgICAgICAgICAgICBzdWJtaXNzaW9uRGVsYXk6IHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBcInN1Ym1pdHRpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgY29uZDogXCJzdWJtaXNzaW9uQ29uZGl0aW9uc01ldFwiLFxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJTdWJtaXQgY29tYmluZWQgdHJhbnNjcmlwdCB0byBQaS5cIixcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgICAgXCJzYXlwaTp0cmFuc2NyaWJlZFwiOiB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldDogXCJhY2N1bXVsYXRpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiaGFuZGxlVHJhbnNjcmlwdGlvblJlc3BvbnNlXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgICAgICAgICAgICAgIFwiVHJhbnNjcmliZWQgc3BlZWNoIHRvIHRleHQgKG91dCBvZiBzZXF1ZW5jZSByZXNwb25zZSkuXCIsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXCJzYXlwaTp0cmFuc2NyaWJlRmFpbGVkXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBcIiNzYXlQaS5lcnJvcnMudHJhbnNjcmliZUZhaWxlZFwiLFxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICAgICAgICAgICAgICBcIk91dCBvZiBzZXF1ZW5jZSBlcnJvciByZXNwb25zZSBmcm9tIHRoZSAvdHJhbnNjcmliZSBBUElcIixcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBcInNheXBpOnRyYW5zY3JpYmVkRW1wdHlcIjoge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IFwiI3NheVBpLmVycm9ycy5taWNFcnJvclwiLFxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICAgICAgICAgICAgICBcIk91dCBvZiBzZXF1ZW5jZSBlbXB0eSByZXNwb25zZSBmcm9tIHRoZSAvdHJhbnNjcmliZSBBUElcIixcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgc3VibWl0dGluZzoge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlN1Ym1pdHRpbmcgcHJvbXB0IHRvIFBpLlwiLFxuICAgICAgICAgICAgICAgIGVudHJ5OiB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiBcIm1lcmdlQW5kU3VibWl0VHJhbnNjcmlwdFwiLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXhpdDogW2NsZWFyVHJhbnNjcmlwdHMsIGNsZWFyUGVuZGluZ1RyYW5zY3JpcHRpb25zXSxcbiAgICAgICAgICAgICAgICBhbHdheXM6IHtcbiAgICAgICAgICAgICAgICAgIHRhcmdldDogXCJhY2N1bXVsYXRpbmdcIixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB0cmFuc2NyaWJpbmc6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICAgICAgICAgIFwiVHJhbnNjcmliaW5nIGF1ZGlvIHRvIHRleHQuXFxuQ2FyZCBmbGlwIGFuaW1hdGlvbi5cIixcbiAgICAgICAgICAgICAgICBlbnRyeToge1xuICAgICAgICAgICAgICAgICAgdHlwZTogXCJzdGFydEFuaW1hdGlvblwiLFxuICAgICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogXCJ0cmFuc2NyaWJpbmdcIixcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBleGl0OiB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiBcInN0b3BBbmltYXRpb25cIixcbiAgICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb246IFwidHJhbnNjcmliaW5nXCIsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICAgIFwic2F5cGk6dHJhbnNjcmliZWRcIjoge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IFwiYWNjdW11bGF0aW5nXCIsXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImhhbmRsZVRyYW5zY3JpcHRpb25SZXNwb25zZVwiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJTdWNjZXNzZnVsbHkgdHJhbnNjcmliZWQgdXNlciBhdWRpbyB0byB0ZXh0LlwiLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIFwic2F5cGk6dHJhbnNjcmliZUZhaWxlZFwiOiB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldDogXCIjc2F5UGkuZXJyb3JzLnRyYW5zY3JpYmVGYWlsZWRcIixcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgICAgICAgICAgICAgXCJSZWNlaXZlZCBhbiBlcnJvciByZXNwb25zZSBmcm9tIHRoZSAvdHJhbnNjcmliZSBBUElcIixcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBcInNheXBpOnRyYW5zY3JpYmVkRW1wdHlcIjoge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IFwiI3NheVBpLmVycm9ycy5taWNFcnJvclwiLFxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICAgICAgICAgICAgICBcIlJlY2VpdmVkIGFuIGVtcHR5IHJlc3BvbnNlIGZyb20gdGhlIC90cmFuc2NyaWJlIEFQSSAobm8gc3BlZWNoIGRldGVjdGVkKVwiLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBvbjoge1xuICAgICAgICAgIFwic2F5cGk6cGlTcGVha2luZ1wiOiB7XG4gICAgICAgICAgICB0YXJnZXQ6IFwiI3NheVBpLnJlc3BvbmRpbmcucGlTcGVha2luZ1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHR5cGU6IFwicGFyYWxsZWxcIixcbiAgICAgIH0sXG4gICAgICByZXNwb25kaW5nOiB7XG4gICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgIFwiUGkgaXMgcmVzcG9uZGluZy4gU3ludGhlc2lzZWQgc3BlZWNoIGlzIHBsYXlpbmcgb3Igd2FpdGluZyB0byBwbGF5LlwiLFxuICAgICAgICBlbnRyeToge1xuICAgICAgICAgIHR5cGU6IFwiZGlzYWJsZUNhbGxCdXR0b25cIixcbiAgICAgICAgfSxcbiAgICAgICAgZXhpdDoge1xuICAgICAgICAgIHR5cGU6IFwiZW5hYmxlQ2FsbEJ1dHRvblwiLFxuICAgICAgICB9LFxuICAgICAgICBpbml0aWFsOiBcInBpU3BlYWtpbmdcIixcbiAgICAgICAgc3RhdGVzOiB7XG4gICAgICAgICAgcGlTcGVha2luZzoge1xuICAgICAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgICAgIFwiUGkncyBzeW50aGVzaXNlZCBzcGVlY2ggYXVkaW8gaXMgcGxheWluZy5cXG5QbGF5ZnVsIGFuaW1hdGlvbi5cIixcbiAgICAgICAgICAgIGVudHJ5OiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwic3RhcnRBbmltYXRpb25cIixcbiAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBcInBpU3BlYWtpbmdcIixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBleGl0OiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwic3RvcEFuaW1hdGlvblwiLFxuICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IFwicGlTcGVha2luZ1wiLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgIFwic2F5cGk6cGlTdG9wcGVkU3BlYWtpbmdcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHRhcmdldDogXCIjc2F5UGkubGlzdGVuaW5nXCIsXG4gICAgICAgICAgICAgICAgICBjb25kOiBcIndhc0xpc3RlbmluZ1wiLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBcIiNzYXlQaS5pbmFjdGl2ZVwiLFxuICAgICAgICAgICAgICAgICAgY29uZDogXCJ3YXNJbmFjdGl2ZVwiLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIFwic2F5cGk6dXNlclNwZWFraW5nXCI6IHtcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IFwiI3NheVBpLmxpc3RlbmluZy5yZWNvcmRpbmcudXNlclNwZWFraW5nXCIsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwic2F5cGk6cGlGaW5pc2hlZFNwZWFraW5nXCI6IHtcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IFwiI3NheVBpLmxpc3RlbmluZ1wiLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIHByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzOiB0cnVlLFxuICAgIHByZXNlcnZlQWN0aW9uT3JkZXI6IHRydWUsXG4gIH0sXG4gIHtcbiAgICBhY3Rpb25zOiB7XG4gICAgICBzdG9wQWxsQW5pbWF0aW9uczogKGNvbnRleHQsIGV2ZW50KSA9PiB7XG4gICAgICAgIEFuaW1hdGlvbk1vZHVsZS5zdG9wQWxsQW5pbWF0aW9ucygpO1xuICAgICAgfSxcblxuICAgICAgc3RhcnRBbmltYXRpb246IChjb250ZXh0LCBldmVudCwgeyBhY3Rpb24gfSkgPT4ge1xuICAgICAgICBBbmltYXRpb25Nb2R1bGUuc3RhcnRBbmltYXRpb24oYWN0aW9uLnBhcmFtcy5hbmltYXRpb24pO1xuICAgICAgfSxcblxuICAgICAgc3RvcEFuaW1hdGlvbjogKGNvbnRleHQsIGV2ZW50LCB7IGFjdGlvbiB9KSA9PiB7XG4gICAgICAgIEFuaW1hdGlvbk1vZHVsZS5zdG9wQW5pbWF0aW9uKGFjdGlvbi5wYXJhbXMuYW5pbWF0aW9uKTtcbiAgICAgIH0sXG5cbiAgICAgIHRyYW5zY3JpYmVBdWRpbzogKFxuICAgICAgICBjb250ZXh0OiBTYXlQaUNvbnRleHQsXG4gICAgICAgIGV2ZW50OiBTYXlQaVNwZWVjaFN0b3BwZWRFdmVudFxuICAgICAgKSA9PiB7XG4gICAgICAgIGNvbnN0IGF1ZGlvQmxvYiA9IGV2ZW50LmJsb2I7XG4gICAgICAgIGlmIChhdWRpb0Jsb2IpIHtcbiAgICAgICAgICB1cGxvYWRBdWRpb1dpdGhSZXRyeShcbiAgICAgICAgICAgIGF1ZGlvQmxvYixcbiAgICAgICAgICAgIGV2ZW50LmR1cmF0aW9uLFxuICAgICAgICAgICAgY29udGV4dC50cmFuc2NyaXB0aW9uc1xuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIGhhbmRsZVRyYW5zY3JpcHRpb25SZXNwb25zZTogKFxuICAgICAgICBTYXlQaUNvbnRleHQsXG4gICAgICAgIGV2ZW50OiBTYXlQaVRyYW5zY3JpYmVkRXZlbnRcbiAgICAgICkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcImhhbmRsZVRyYW5zY3JpcHRpb25SZXNwb25zZVwiLCBldmVudCk7XG4gICAgICAgIGNvbnN0IHRyYW5zY3JpcHRpb24gPSBldmVudC50ZXh0O1xuICAgICAgICBjb25zdCBzZXF1ZW5jZU51bWJlciA9IGV2ZW50LnNlcXVlbmNlTnVtYmVyO1xuICAgICAgICBTYXlQaUNvbnRleHQudHJhbnNjcmlwdGlvbnNbc2VxdWVuY2VOdW1iZXJdID0gdHJhbnNjcmlwdGlvbjtcbiAgICAgIH0sXG5cbiAgICAgIGFjcXVpcmVNaWNyb3Bob25lOiAoY29udGV4dCwgZXZlbnQpID0+IHtcbiAgICAgICAgLy8gd2FybXVwIHRoZSBtaWNyb3Bob25lIG9uIGlkbGUgaW4gbW9iaWxlIHZpZXcsXG4gICAgICAgIC8vIHNpbmNlIHRoZXJlJ3Mgbm8gbW91c2VvdmVyIGV2ZW50IHRvIHRyaWdnZXIgaXRcbiAgICAgICAgaWYgKGlzTW9iaWxlVmlldygpKSB7XG4gICAgICAgICAgRXZlbnRCdXMuZW1pdChcImF1ZGlvOnNldHVwUmVjb3JkaW5nXCIpO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICBzdGFydFJlY29yZGluZzogKGNvbnRleHQsIGV2ZW50KSA9PiB7XG4gICAgICAgIEV2ZW50QnVzLmVtaXQoXCJhdWRpbzpzdGFydFJlY29yZGluZ1wiKTtcbiAgICAgIH0sXG5cbiAgICAgIHN0b3BSZWNvcmRpbmc6IChjb250ZXh0LCBldmVudCkgPT4ge1xuICAgICAgICBFdmVudEJ1cy5lbWl0KFwiYXVkaW86c3RvcFJlY29yZGluZ1wiKTtcbiAgICAgIH0sXG5cbiAgICAgIHNob3dOb3RpZmljYXRpb246IChjb250ZXh0LCBldmVudCwgeyBhY3Rpb24gfSkgPT4ge1xuICAgICAgICBjb25zdCBpY29uID0gYWN0aW9uLnBhcmFtcy5pY29uO1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gYWN0aW9uLnBhcmFtcy5tZXNzYWdlO1xuICAgICAgICBidXR0b25Nb2R1bGUuc2hvd05vdGlmaWNhdGlvbih7IGljb24sIG1lc3NhZ2UgfSk7XG4gICAgICB9LFxuXG4gICAgICBkaXNtaXNzTm90aWZpY2F0aW9uOiAoKSA9PiB7XG4gICAgICAgIGJ1dHRvbk1vZHVsZS5kaXNtaXNzTm90aWZpY2F0aW9uKCk7XG4gICAgICB9LFxuXG4gICAgICBtZXJnZUFuZFN1Ym1pdFRyYW5zY3JpcHQ6IChjb250ZXh0KSA9PiB7XG4gICAgICAgIGNvbnN0IHByb21wdCA9IG1lcmdlVHJhbnNjcmlwdHMoY29udGV4dC50cmFuc2NyaXB0aW9ucykudHJpbSgpO1xuICAgICAgICBpZiAocHJvbXB0KSBzZXRQcm9tcHRUZXh0KHByb21wdCk7XG4gICAgICB9LFxuXG4gICAgICBjYWxsU3RhcnRlZDogKCkgPT4ge1xuICAgICAgICBidXR0b25Nb2R1bGUuY2FsbEFjdGl2ZSgpO1xuICAgICAgfSxcbiAgICAgIGNhbGxFbmRlZDogKCkgPT4ge1xuICAgICAgICBidXR0b25Nb2R1bGUuY2FsbEluYWN0aXZlKCk7XG4gICAgICB9LFxuICAgICAgZGlzYWJsZUNhbGxCdXR0b246ICgpID0+IHtcbiAgICAgICAgYnV0dG9uTW9kdWxlLmRpc2FibGVDYWxsQnV0dG9uKCk7XG4gICAgICB9LFxuICAgICAgZW5hYmxlQ2FsbEJ1dHRvbjogKCkgPT4ge1xuICAgICAgICBidXR0b25Nb2R1bGUuZW5hYmxlQ2FsbEJ1dHRvbigpO1xuICAgICAgfSxcbiAgICB9LFxuICAgIHNlcnZpY2VzOiB7fSxcbiAgICBndWFyZHM6IHtcbiAgICAgIGhhc0F1ZGlvOiAoY29udGV4dDogU2F5UGlDb250ZXh0LCBldmVudDogU2F5UGlFdmVudCkgPT4ge1xuICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gXCJzYXlwaTp1c2VyU3RvcHBlZFNwZWFraW5nXCIpIHtcbiAgICAgICAgICBldmVudCA9IGV2ZW50IGFzIFNheVBpU3BlZWNoU3RvcHBlZEV2ZW50O1xuICAgICAgICAgIHJldHVybiBldmVudC5ibG9iICE9PSB1bmRlZmluZWQgJiYgZXZlbnQuZHVyYXRpb24gPiAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0sXG4gICAgICBoYXNOb0F1ZGlvOiAoY29udGV4dDogU2F5UGlDb250ZXh0LCBldmVudDogU2F5UGlFdmVudCkgPT4ge1xuICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gXCJzYXlwaTp1c2VyU3RvcHBlZFNwZWFraW5nXCIpIHtcbiAgICAgICAgICBldmVudCA9IGV2ZW50IGFzIFNheVBpU3BlZWNoU3RvcHBlZEV2ZW50O1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBldmVudC5ibG9iID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICAgIGV2ZW50LmJsb2Iuc2l6ZSA9PT0gMCB8fFxuICAgICAgICAgICAgZXZlbnQuZHVyYXRpb24gPT09IDBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0sXG4gICAgICBzdWJtaXNzaW9uQ29uZGl0aW9uc01ldDogKFxuICAgICAgICBjb250ZXh0OiBTYXlQaUNvbnRleHQsXG4gICAgICAgIGV2ZW50OiBTYXlQaUV2ZW50LFxuICAgICAgICBtZXRhXG4gICAgICApID0+IHtcbiAgICAgICAgY29uc3QgeyBzdGF0ZSB9ID0gbWV0YTtcbiAgICAgICAgY29uc3QgYWxsb3dlZFN0YXRlID0gIShcbiAgICAgICAgICBzdGF0ZS5tYXRjaGVzKFwibGlzdGVuaW5nLnJlY29yZGluZy51c2VyU3BlYWtpbmdcIikgfHxcbiAgICAgICAgICBzdGF0ZS5tYXRjaGVzKFwibGlzdGVuaW5nLmNvbnZlcnRpbmcudHJhbnNjcmliaW5nXCIpXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGVtcHR5ID0gT2JqZWN0LmtleXMoY29udGV4dC50cmFuc2NyaXB0aW9ucykubGVuZ3RoID09PSAwO1xuICAgICAgICBjb25zdCBwZW5kaW5nID0gaXNUcmFuc2NyaXB0aW9uUGVuZGluZygpO1xuICAgICAgICBjb25zdCByZWFkeSA9IGFsbG93ZWRTdGF0ZSAmJiAhZW1wdHkgJiYgIXBlbmRpbmc7XG4gICAgICAgIHJldHVybiByZWFkeTtcbiAgICAgIH0sXG4gICAgICB3YXNMaXN0ZW5pbmc6IChjb250ZXh0OiBTYXlQaUNvbnRleHQpID0+IHtcbiAgICAgICAgcmV0dXJuIGNvbnRleHQubGFzdFN0YXRlID09PSBcImxpc3RlbmluZ1wiO1xuICAgICAgfSxcbiAgICAgIHdhc0luYWN0aXZlOiAoY29udGV4dDogU2F5UGlDb250ZXh0KSA9PiB7XG4gICAgICAgIHJldHVybiBjb250ZXh0Lmxhc3RTdGF0ZSA9PT0gXCJpbmFjdGl2ZVwiO1xuICAgICAgfSxcbiAgICB9LFxuICAgIGRlbGF5czoge1xuICAgICAgc3VibWlzc2lvbkRlbGF5OiAoY29udGV4dDogU2F5UGlDb250ZXh0LCBldmVudDogU2F5UGlFdmVudCkgPT4ge1xuICAgICAgICAvLyBjaGVjayBpZiB0aGUgZXZlbnQgaXMgYSB0cmFuc2NyaXB0aW9uIGV2ZW50XG4gICAgICAgIGlmIChldmVudC50eXBlICE9PSBcInNheXBpOnRyYW5zY3JpYmVkXCIpIHtcbiAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBldmVudCA9IGV2ZW50IGFzIFNheVBpVHJhbnNjcmliZWRFdmVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1heERlbGF5ID0gMTAwMDA7IC8vIDEwIHNlY29uZHMgaW4gbWlsbGlzZWNvbmRzXG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBpbml0aWFsIGRlbGF5IGJhc2VkIG9uIHBGaW5pc2hlZFNwZWFraW5nXG4gICAgICAgIGxldCBwcm9iYWJpbGl0eUZpbmlzaGVkID0gMTtcbiAgICAgICAgaWYgKGV2ZW50LnBGaW5pc2hlZFNwZWFraW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBwcm9iYWJpbGl0eUZpbmlzaGVkID0gZXZlbnQucEZpbmlzaGVkU3BlYWtpbmc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbmNvcnBvcmF0ZSB0aGUgdGVtcG8gaW50byB0aGUgZGVsYXksIGRlZmF1bHRpbmcgdG8gMC41IChhdmVyYWdlIHRlbXBvKSBpZiB1bmRlZmluZWRcbiAgICAgICAgbGV0IHRlbXBvID0gZXZlbnQudGVtcG8gIT09IHVuZGVmaW5lZCA/IGV2ZW50LnRlbXBvIDogMC41O1xuXG4gICAgICAgIGNvbnN0IGZpbmFsRGVsYXkgPSBjYWxjdWxhdGVEZWxheShcbiAgICAgICAgICBjb250ZXh0LnRpbWVVc2VyU3RvcHBlZFNwZWFraW5nLFxuICAgICAgICAgIHByb2JhYmlsaXR5RmluaXNoZWQsXG4gICAgICAgICAgdGVtcG8sXG4gICAgICAgICAgbWF4RGVsYXlcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICBcIldhaXRpbmcgZm9yXCIsXG4gICAgICAgICAgKGZpbmFsRGVsYXkgLyAxMDAwKS50b0ZpeGVkKDEpLFxuICAgICAgICAgIFwic2Vjb25kcyBiZWZvcmUgc3VibWl0dGluZ1wiXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIGZpbmFsRGVsYXk7XG4gICAgICB9LFxuICAgIH0sXG4gIH1cbik7XG4iLCJpbXBvcnQgeyBfX2Fzc2lnbiB9IGZyb20gJy4vX3ZpcnR1YWwvX3RzbGliLmpzJztcbmltcG9ydCB7IHN5bWJvbE9ic2VydmFibGUsIHRvSW52b2tlU291cmNlLCBtYXBDb250ZXh0LCBpc01hY2hpbmUgfSBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7IHByb3ZpZGUgfSBmcm9tICcuL3NlcnZpY2VTY29wZS5qcyc7XG5cbmZ1bmN0aW9uIGNyZWF0ZU51bGxBY3RvcihpZCkge1xuICB2YXIgX2E7XG5cbiAgcmV0dXJuIF9hID0ge1xuICAgIGlkOiBpZCxcbiAgICBzZW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH0sXG4gICAgc3Vic2NyaWJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBnZXRTbmFwc2hvdDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9LFxuICAgIHRvSlNPTjogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6IGlkXG4gICAgICB9O1xuICAgIH1cbiAgfSwgX2Fbc3ltYm9sT2JzZXJ2YWJsZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sIF9hO1xufVxuLyoqXHJcbiAqIENyZWF0ZXMgYSBkZWZlcnJlZCBhY3RvciB0aGF0IGlzIGFibGUgdG8gYmUgaW52b2tlZCBnaXZlbiB0aGUgcHJvdmlkZWRcclxuICogaW52b2NhdGlvbiBpbmZvcm1hdGlvbiBpbiBpdHMgYC5tZXRhYCB2YWx1ZS5cclxuICpcclxuICogQHBhcmFtIGludm9rZURlZmluaXRpb24gVGhlIG1ldGEgaW5mb3JtYXRpb24gbmVlZGVkIHRvIGludm9rZSB0aGUgYWN0b3IuXHJcbiAqL1xuXG5mdW5jdGlvbiBjcmVhdGVJbnZvY2FibGVBY3RvcihpbnZva2VEZWZpbml0aW9uLCBtYWNoaW5lLCBjb250ZXh0LCBfZXZlbnQpIHtcbiAgdmFyIF9hO1xuXG4gIHZhciBpbnZva2VTcmMgPSB0b0ludm9rZVNvdXJjZShpbnZva2VEZWZpbml0aW9uLnNyYyk7XG4gIHZhciBzZXJ2aWNlQ3JlYXRvciA9IChfYSA9IG1hY2hpbmUgPT09IG51bGwgfHwgbWFjaGluZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogbWFjaGluZS5vcHRpb25zLnNlcnZpY2VzKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2FbaW52b2tlU3JjLnR5cGVdO1xuICB2YXIgcmVzb2x2ZWREYXRhID0gaW52b2tlRGVmaW5pdGlvbi5kYXRhID8gbWFwQ29udGV4dChpbnZva2VEZWZpbml0aW9uLmRhdGEsIGNvbnRleHQsIF9ldmVudCkgOiB1bmRlZmluZWQ7XG4gIHZhciB0ZW1wQWN0b3IgPSBzZXJ2aWNlQ3JlYXRvciA/IGNyZWF0ZURlZmVycmVkQWN0b3Ioc2VydmljZUNyZWF0b3IsIGludm9rZURlZmluaXRpb24uaWQsIHJlc29sdmVkRGF0YSkgOiBjcmVhdGVOdWxsQWN0b3IoaW52b2tlRGVmaW5pdGlvbi5pZCk7IC8vIEB0cy1pZ25vcmVcblxuICB0ZW1wQWN0b3IubWV0YSA9IGludm9rZURlZmluaXRpb247XG4gIHJldHVybiB0ZW1wQWN0b3I7XG59XG5mdW5jdGlvbiBjcmVhdGVEZWZlcnJlZEFjdG9yKGVudGl0eSwgaWQsIGRhdGEpIHtcbiAgdmFyIHRlbXBBY3RvciA9IGNyZWF0ZU51bGxBY3RvcihpZCk7IC8vIEB0cy1pZ25vcmVcblxuICB0ZW1wQWN0b3IuZGVmZXJyZWQgPSB0cnVlO1xuXG4gIGlmIChpc01hY2hpbmUoZW50aXR5KSkge1xuICAgIC8vIFwibXV0ZVwiIHRoZSBleGlzdGluZyBzZXJ2aWNlIHNjb3BlIHNvIHBvdGVudGlhbCBzcGF3bmVkIGFjdG9ycyB3aXRoaW4gdGhlIGAuaW5pdGlhbFN0YXRlYCBzdGF5IGRlZmVycmVkIGhlcmVcbiAgICB2YXIgaW5pdGlhbFN0YXRlXzEgPSB0ZW1wQWN0b3Iuc3RhdGUgPSBwcm92aWRlKHVuZGVmaW5lZCwgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIChkYXRhID8gZW50aXR5LndpdGhDb250ZXh0KGRhdGEpIDogZW50aXR5KS5pbml0aWFsU3RhdGU7XG4gICAgfSk7XG5cbiAgICB0ZW1wQWN0b3IuZ2V0U25hcHNob3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gaW5pdGlhbFN0YXRlXzE7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB0ZW1wQWN0b3I7XG59XG5mdW5jdGlvbiBpc0FjdG9yKGl0ZW0pIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gdHlwZW9mIGl0ZW0uc2VuZCA9PT0gJ2Z1bmN0aW9uJztcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuZnVuY3Rpb24gaXNTcGF3bmVkQWN0b3IoaXRlbSkge1xuICByZXR1cm4gaXNBY3RvcihpdGVtKSAmJiAnaWQnIGluIGl0ZW07XG59IC8vIFRPRE86IHJlZmFjdG9yIHRoZSByZXR1cm4gdHlwZSwgdGhpcyBjb3VsZCBiZSB3cml0dGVuIGluIGEgYmV0dGVyIHdheSBidXQgaXQncyBiZXN0IHRvIGF2b2lkIHVubmVjY2Vzc2FyeSBicmVha2luZyBjaGFuZ2VzIG5vd1xuXG5mdW5jdGlvbiB0b0FjdG9yUmVmKGFjdG9yUmVmTGlrZSkge1xuICB2YXIgX2E7XG5cbiAgcmV0dXJuIF9fYXNzaWduKChfYSA9IHtcbiAgICBzdWJzY3JpYmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIGlkOiAnYW5vbnltb3VzJyxcbiAgICBnZXRTbmFwc2hvdDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH0sIF9hW3N5bWJvbE9ic2VydmFibGVdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9LCBfYSksIGFjdG9yUmVmTGlrZSk7XG59XG5cbmV4cG9ydCB7IGNyZWF0ZURlZmVycmVkQWN0b3IsIGNyZWF0ZUludm9jYWJsZUFjdG9yLCBjcmVhdGVOdWxsQWN0b3IsIGlzQWN0b3IsIGlzU3Bhd25lZEFjdG9yLCB0b0FjdG9yUmVmIH07XG4iLCJpbXBvcnQgeyBTdGF0ZU5vZGUgfSBmcm9tICcuL1N0YXRlTm9kZS5qcyc7XG5pbXBvcnQgeyBJU19QUk9EVUNUSU9OIH0gZnJvbSAnLi9lbnZpcm9ubWVudC5qcyc7XG5cbnZhciB3YXJuZWQgPSBmYWxzZTtcbmZ1bmN0aW9uIE1hY2hpbmUoY29uZmlnLCBvcHRpb25zLCBpbml0aWFsQ29udGV4dCkge1xuICBpZiAoaW5pdGlhbENvbnRleHQgPT09IHZvaWQgMCkge1xuICAgIGluaXRpYWxDb250ZXh0ID0gY29uZmlnLmNvbnRleHQ7XG4gIH1cblxuICByZXR1cm4gbmV3IFN0YXRlTm9kZShjb25maWcsIG9wdGlvbnMsIGluaXRpYWxDb250ZXh0KTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZU1hY2hpbmUoY29uZmlnLCBvcHRpb25zKSB7XG4gIGlmICghSVNfUFJPRFVDVElPTiAmJiAhKCdwcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cycgaW4gY29uZmlnKSAmJiAhd2FybmVkKSB7XG4gICAgd2FybmVkID0gdHJ1ZTtcbiAgICBjb25zb2xlLndhcm4oJ0l0IGlzIGhpZ2hseSByZWNvbW1lbmRlZCB0byBzZXQgYHByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzYCB0byBgdHJ1ZWAgd2hlbiB1c2luZyBgY3JlYXRlTWFjaGluZWAuIGh0dHBzOi8veHN0YXRlLmpzLm9yZy9kb2NzL2d1aWRlcy9hY3Rpb25zLmh0bWwnKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgU3RhdGVOb2RlKGNvbmZpZywgb3B0aW9ucyk7XG59XG5cbmV4cG9ydCB7IE1hY2hpbmUsIGNyZWF0ZU1hY2hpbmUgfTtcbiIsImltcG9ydCB7IF9fYXNzaWduLCBfX3NwcmVhZEFycmF5LCBfX3JlYWQsIF9fcmVzdCB9IGZyb20gJy4vX3ZpcnR1YWwvX3RzbGliLmpzJztcbmltcG9ydCB7IEVNUFRZX0FDVElWSVRZX01BUCB9IGZyb20gJy4vY29uc3RhbnRzLmpzJztcbmltcG9ydCB7IGlzU3RyaW5nLCBtYXRjaGVzU3RhdGUsIHdhcm4gfSBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7IGdldE1ldGEsIG5leHRFdmVudHMgfSBmcm9tICcuL3N0YXRlVXRpbHMuanMnO1xuaW1wb3J0IHsgaW5pdEV2ZW50IH0gZnJvbSAnLi9hY3Rpb25zLmpzJztcbmltcG9ydCB7IElTX1BST0RVQ1RJT04gfSBmcm9tICcuL2Vudmlyb25tZW50LmpzJztcblxuZnVuY3Rpb24gc3RhdGVWYWx1ZXNFcXVhbChhLCBiKSB7XG4gIGlmIChhID09PSBiKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAoYSA9PT0gdW5kZWZpbmVkIHx8IGIgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChpc1N0cmluZyhhKSB8fCBpc1N0cmluZyhiKSkge1xuICAgIHJldHVybiBhID09PSBiO1xuICB9XG5cbiAgdmFyIGFLZXlzID0gT2JqZWN0LmtleXMoYSk7XG4gIHZhciBiS2V5cyA9IE9iamVjdC5rZXlzKGIpO1xuICByZXR1cm4gYUtleXMubGVuZ3RoID09PSBiS2V5cy5sZW5ndGggJiYgYUtleXMuZXZlcnkoZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBzdGF0ZVZhbHVlc0VxdWFsKGFba2V5XSwgYltrZXldKTtcbiAgfSk7XG59XG5mdW5jdGlvbiBpc1N0YXRlQ29uZmlnKHN0YXRlKSB7XG4gIGlmICh0eXBlb2Ygc3RhdGUgIT09ICdvYmplY3QnIHx8IHN0YXRlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuICd2YWx1ZScgaW4gc3RhdGUgJiYgJ19ldmVudCcgaW4gc3RhdGU7XG59XG4vKipcclxuICogQGRlcHJlY2F0ZWQgVXNlIGBpc1N0YXRlQ29uZmlnKG9iamVjdClgIG9yIGBzdGF0ZSBpbnN0YW5jZW9mIFN0YXRlYCBpbnN0ZWFkLlxyXG4gKi9cblxudmFyIGlzU3RhdGUgPSBpc1N0YXRlQ29uZmlnO1xuZnVuY3Rpb24gYmluZEFjdGlvblRvU3RhdGUoYWN0aW9uLCBzdGF0ZSkge1xuICB2YXIgZXhlYyA9IGFjdGlvbi5leGVjO1xuXG4gIHZhciBib3VuZEFjdGlvbiA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCBhY3Rpb24pLCB7XG4gICAgZXhlYzogZXhlYyAhPT0gdW5kZWZpbmVkID8gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGV4ZWMoc3RhdGUuY29udGV4dCwgc3RhdGUuZXZlbnQsIHtcbiAgICAgICAgYWN0aW9uOiBhY3Rpb24sXG4gICAgICAgIHN0YXRlOiBzdGF0ZSxcbiAgICAgICAgX2V2ZW50OiBzdGF0ZS5fZXZlbnRcbiAgICAgIH0pO1xuICAgIH0gOiB1bmRlZmluZWRcbiAgfSk7XG5cbiAgcmV0dXJuIGJvdW5kQWN0aW9uO1xufVxuXG52YXIgU3RhdGUgPVxuLyojX19QVVJFX18qL1xuXG4vKiogQGNsYXNzICovXG5mdW5jdGlvbiAoKSB7XG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYSBuZXcgU3RhdGUgaW5zdGFuY2UuXHJcbiAgICogQHBhcmFtIHZhbHVlIFRoZSBzdGF0ZSB2YWx1ZVxyXG4gICAqIEBwYXJhbSBjb250ZXh0IFRoZSBleHRlbmRlZCBzdGF0ZVxyXG4gICAqIEBwYXJhbSBoaXN0b3J5VmFsdWUgVGhlIHRyZWUgcmVwcmVzZW50aW5nIGhpc3RvcmljYWwgdmFsdWVzIG9mIHRoZSBzdGF0ZSBub2Rlc1xyXG4gICAqIEBwYXJhbSBoaXN0b3J5IFRoZSBwcmV2aW91cyBzdGF0ZVxyXG4gICAqIEBwYXJhbSBhY3Rpb25zIEFuIGFycmF5IG9mIGFjdGlvbiBvYmplY3RzIHRvIGV4ZWN1dGUgYXMgc2lkZS1lZmZlY3RzXHJcbiAgICogQHBhcmFtIGFjdGl2aXRpZXMgQSBtYXBwaW5nIG9mIGFjdGl2aXRpZXMgYW5kIHdoZXRoZXIgdGhleSBhcmUgc3RhcnRlZCAoYHRydWVgKSBvciBzdG9wcGVkIChgZmFsc2VgKS5cclxuICAgKiBAcGFyYW0gbWV0YVxyXG4gICAqIEBwYXJhbSBldmVudHMgSW50ZXJuYWwgZXZlbnQgcXVldWUuIFNob3VsZCBiZSBlbXB0eSB3aXRoIHJ1bi10by1jb21wbGV0aW9uIHNlbWFudGljcy5cclxuICAgKiBAcGFyYW0gY29uZmlndXJhdGlvblxyXG4gICAqL1xuICBmdW5jdGlvbiBTdGF0ZShjb25maWcpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIF9hO1xuXG4gICAgdGhpcy5hY3Rpb25zID0gW107XG4gICAgdGhpcy5hY3Rpdml0aWVzID0gRU1QVFlfQUNUSVZJVFlfTUFQO1xuICAgIHRoaXMubWV0YSA9IHt9O1xuICAgIHRoaXMuZXZlbnRzID0gW107XG4gICAgdGhpcy52YWx1ZSA9IGNvbmZpZy52YWx1ZTtcbiAgICB0aGlzLmNvbnRleHQgPSBjb25maWcuY29udGV4dDtcbiAgICB0aGlzLl9ldmVudCA9IGNvbmZpZy5fZXZlbnQ7XG4gICAgdGhpcy5fc2Vzc2lvbmlkID0gY29uZmlnLl9zZXNzaW9uaWQ7XG4gICAgdGhpcy5ldmVudCA9IHRoaXMuX2V2ZW50LmRhdGE7XG4gICAgdGhpcy5oaXN0b3J5VmFsdWUgPSBjb25maWcuaGlzdG9yeVZhbHVlO1xuICAgIHRoaXMuaGlzdG9yeSA9IGNvbmZpZy5oaXN0b3J5O1xuICAgIHRoaXMuYWN0aW9ucyA9IGNvbmZpZy5hY3Rpb25zIHx8IFtdO1xuICAgIHRoaXMuYWN0aXZpdGllcyA9IGNvbmZpZy5hY3Rpdml0aWVzIHx8IEVNUFRZX0FDVElWSVRZX01BUDtcbiAgICB0aGlzLm1ldGEgPSBnZXRNZXRhKGNvbmZpZy5jb25maWd1cmF0aW9uKTtcbiAgICB0aGlzLmV2ZW50cyA9IGNvbmZpZy5ldmVudHMgfHwgW107XG4gICAgdGhpcy5tYXRjaGVzID0gdGhpcy5tYXRjaGVzLmJpbmQodGhpcyk7XG4gICAgdGhpcy50b1N0cmluZ3MgPSB0aGlzLnRvU3RyaW5ncy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY29uZmlndXJhdGlvbiA9IGNvbmZpZy5jb25maWd1cmF0aW9uO1xuICAgIHRoaXMudHJhbnNpdGlvbnMgPSBjb25maWcudHJhbnNpdGlvbnM7XG4gICAgdGhpcy5jaGlsZHJlbiA9IGNvbmZpZy5jaGlsZHJlbjtcbiAgICB0aGlzLmRvbmUgPSAhIWNvbmZpZy5kb25lO1xuICAgIHRoaXMudGFncyA9IChfYSA9IEFycmF5LmlzQXJyYXkoY29uZmlnLnRhZ3MpID8gbmV3IFNldChjb25maWcudGFncykgOiBjb25maWcudGFncykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogbmV3IFNldCgpO1xuICAgIHRoaXMubWFjaGluZSA9IGNvbmZpZy5tYWNoaW5lO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbmV4dEV2ZW50cycsIHtcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV4dEV2ZW50cyhfdGhpcy5jb25maWd1cmF0aW9uKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICAvKipcclxuICAgKiBDcmVhdGVzIGEgbmV3IFN0YXRlIGluc3RhbmNlIGZvciB0aGUgZ2l2ZW4gYHN0YXRlVmFsdWVgIGFuZCBgY29udGV4dGAuXHJcbiAgICogQHBhcmFtIHN0YXRlVmFsdWVcclxuICAgKiBAcGFyYW0gY29udGV4dFxyXG4gICAqL1xuXG5cbiAgU3RhdGUuZnJvbSA9IGZ1bmN0aW9uIChzdGF0ZVZhbHVlLCBjb250ZXh0KSB7XG4gICAgaWYgKHN0YXRlVmFsdWUgaW5zdGFuY2VvZiBTdGF0ZSkge1xuICAgICAgaWYgKHN0YXRlVmFsdWUuY29udGV4dCAhPT0gY29udGV4dCkge1xuICAgICAgICByZXR1cm4gbmV3IFN0YXRlKHtcbiAgICAgICAgICB2YWx1ZTogc3RhdGVWYWx1ZS52YWx1ZSxcbiAgICAgICAgICBjb250ZXh0OiBjb250ZXh0LFxuICAgICAgICAgIF9ldmVudDogc3RhdGVWYWx1ZS5fZXZlbnQsXG4gICAgICAgICAgX3Nlc3Npb25pZDogbnVsbCxcbiAgICAgICAgICBoaXN0b3J5VmFsdWU6IHN0YXRlVmFsdWUuaGlzdG9yeVZhbHVlLFxuICAgICAgICAgIGhpc3Rvcnk6IHN0YXRlVmFsdWUuaGlzdG9yeSxcbiAgICAgICAgICBhY3Rpb25zOiBbXSxcbiAgICAgICAgICBhY3Rpdml0aWVzOiBzdGF0ZVZhbHVlLmFjdGl2aXRpZXMsXG4gICAgICAgICAgbWV0YToge30sXG4gICAgICAgICAgZXZlbnRzOiBbXSxcbiAgICAgICAgICBjb25maWd1cmF0aW9uOiBbXSxcbiAgICAgICAgICB0cmFuc2l0aW9uczogW10sXG4gICAgICAgICAgY2hpbGRyZW46IHt9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RhdGVWYWx1ZTtcbiAgICB9XG5cbiAgICB2YXIgX2V2ZW50ID0gaW5pdEV2ZW50O1xuICAgIHJldHVybiBuZXcgU3RhdGUoe1xuICAgICAgdmFsdWU6IHN0YXRlVmFsdWUsXG4gICAgICBjb250ZXh0OiBjb250ZXh0LFxuICAgICAgX2V2ZW50OiBfZXZlbnQsXG4gICAgICBfc2Vzc2lvbmlkOiBudWxsLFxuICAgICAgaGlzdG9yeVZhbHVlOiB1bmRlZmluZWQsXG4gICAgICBoaXN0b3J5OiB1bmRlZmluZWQsXG4gICAgICBhY3Rpb25zOiBbXSxcbiAgICAgIGFjdGl2aXRpZXM6IHVuZGVmaW5lZCxcbiAgICAgIG1ldGE6IHVuZGVmaW5lZCxcbiAgICAgIGV2ZW50czogW10sXG4gICAgICBjb25maWd1cmF0aW9uOiBbXSxcbiAgICAgIHRyYW5zaXRpb25zOiBbXSxcbiAgICAgIGNoaWxkcmVuOiB7fVxuICAgIH0pO1xuICB9O1xuICAvKipcclxuICAgKiBDcmVhdGVzIGEgbmV3IFN0YXRlIGluc3RhbmNlIGZvciB0aGUgZ2l2ZW4gYGNvbmZpZ2AuXHJcbiAgICogQHBhcmFtIGNvbmZpZyBUaGUgc3RhdGUgY29uZmlnXHJcbiAgICovXG5cblxuICBTdGF0ZS5jcmVhdGUgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgcmV0dXJuIG5ldyBTdGF0ZShjb25maWcpO1xuICB9O1xuICAvKipcclxuICAgKiBDcmVhdGVzIGEgbmV3IGBTdGF0ZWAgaW5zdGFuY2UgZm9yIHRoZSBnaXZlbiBgc3RhdGVWYWx1ZWAgYW5kIGBjb250ZXh0YCB3aXRoIG5vIGFjdGlvbnMgKHNpZGUtZWZmZWN0cykuXHJcbiAgICogQHBhcmFtIHN0YXRlVmFsdWVcclxuICAgKiBAcGFyYW0gY29udGV4dFxyXG4gICAqL1xuXG5cbiAgU3RhdGUuaW5lcnQgPSBmdW5jdGlvbiAoc3RhdGVWYWx1ZSwgY29udGV4dCkge1xuICAgIGlmIChzdGF0ZVZhbHVlIGluc3RhbmNlb2YgU3RhdGUpIHtcbiAgICAgIGlmICghc3RhdGVWYWx1ZS5hY3Rpb25zLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gc3RhdGVWYWx1ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIF9ldmVudCA9IGluaXRFdmVudDtcbiAgICAgIHJldHVybiBuZXcgU3RhdGUoe1xuICAgICAgICB2YWx1ZTogc3RhdGVWYWx1ZS52YWx1ZSxcbiAgICAgICAgY29udGV4dDogY29udGV4dCxcbiAgICAgICAgX2V2ZW50OiBfZXZlbnQsXG4gICAgICAgIF9zZXNzaW9uaWQ6IG51bGwsXG4gICAgICAgIGhpc3RvcnlWYWx1ZTogc3RhdGVWYWx1ZS5oaXN0b3J5VmFsdWUsXG4gICAgICAgIGhpc3Rvcnk6IHN0YXRlVmFsdWUuaGlzdG9yeSxcbiAgICAgICAgYWN0aXZpdGllczogc3RhdGVWYWx1ZS5hY3Rpdml0aWVzLFxuICAgICAgICBjb25maWd1cmF0aW9uOiBzdGF0ZVZhbHVlLmNvbmZpZ3VyYXRpb24sXG4gICAgICAgIHRyYW5zaXRpb25zOiBbXSxcbiAgICAgICAgY2hpbGRyZW46IHt9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gU3RhdGUuZnJvbShzdGF0ZVZhbHVlLCBjb250ZXh0KTtcbiAgfTtcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBhbGwgdGhlIHN0cmluZyBsZWFmIHN0YXRlIG5vZGUgcGF0aHMuXHJcbiAgICogQHBhcmFtIHN0YXRlVmFsdWVcclxuICAgKiBAcGFyYW0gZGVsaW1pdGVyIFRoZSBjaGFyYWN0ZXIocykgdGhhdCBzZXBhcmF0ZSBlYWNoIHN1YnBhdGggaW4gdGhlIHN0cmluZyBzdGF0ZSBub2RlIHBhdGguXHJcbiAgICovXG5cblxuICBTdGF0ZS5wcm90b3R5cGUudG9TdHJpbmdzID0gZnVuY3Rpb24gKHN0YXRlVmFsdWUsIGRlbGltaXRlcikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoc3RhdGVWYWx1ZSA9PT0gdm9pZCAwKSB7XG4gICAgICBzdGF0ZVZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAoZGVsaW1pdGVyID09PSB2b2lkIDApIHtcbiAgICAgIGRlbGltaXRlciA9ICcuJztcbiAgICB9XG5cbiAgICBpZiAoaXNTdHJpbmcoc3RhdGVWYWx1ZSkpIHtcbiAgICAgIHJldHVybiBbc3RhdGVWYWx1ZV07XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlS2V5cyA9IE9iamVjdC5rZXlzKHN0YXRlVmFsdWUpO1xuICAgIHJldHVybiB2YWx1ZUtleXMuY29uY2F0LmFwcGx5KHZhbHVlS2V5cywgX19zcHJlYWRBcnJheShbXSwgX19yZWFkKHZhbHVlS2V5cy5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgcmV0dXJuIF90aGlzLnRvU3RyaW5ncyhzdGF0ZVZhbHVlW2tleV0sIGRlbGltaXRlcikubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIHJldHVybiBrZXkgKyBkZWxpbWl0ZXIgKyBzO1xuICAgICAgfSk7XG4gICAgfSkpLCBmYWxzZSkpO1xuICB9O1xuXG4gIFN0YXRlLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9hID0gdGhpcztcbiAgICAgICAgX2EuY29uZmlndXJhdGlvbjtcbiAgICAgICAgX2EudHJhbnNpdGlvbnM7XG4gICAgICAgIHZhciB0YWdzID0gX2EudGFncztcbiAgICAgICAgX2EubWFjaGluZTtcbiAgICAgICAgdmFyIGpzb25WYWx1ZXMgPSBfX3Jlc3QoX2EsIFtcImNvbmZpZ3VyYXRpb25cIiwgXCJ0cmFuc2l0aW9uc1wiLCBcInRhZ3NcIiwgXCJtYWNoaW5lXCJdKTtcblxuICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwganNvblZhbHVlcyksIHtcbiAgICAgIHRhZ3M6IEFycmF5LmZyb20odGFncylcbiAgICB9KTtcbiAgfTtcblxuICBTdGF0ZS5wcm90b3R5cGUubWF0Y2hlcyA9IGZ1bmN0aW9uIChwYXJlbnRTdGF0ZVZhbHVlKSB7XG4gICAgcmV0dXJuIG1hdGNoZXNTdGF0ZShwYXJlbnRTdGF0ZVZhbHVlLCB0aGlzLnZhbHVlKTtcbiAgfTtcbiAgLyoqXHJcbiAgICogV2hldGhlciB0aGUgY3VycmVudCBzdGF0ZSBjb25maWd1cmF0aW9uIGhhcyBhIHN0YXRlIG5vZGUgd2l0aCB0aGUgc3BlY2lmaWVkIGB0YWdgLlxyXG4gICAqIEBwYXJhbSB0YWdcclxuICAgKi9cblxuXG4gIFN0YXRlLnByb3RvdHlwZS5oYXNUYWcgPSBmdW5jdGlvbiAodGFnKSB7XG4gICAgcmV0dXJuIHRoaXMudGFncy5oYXModGFnKTtcbiAgfTtcbiAgLyoqXHJcbiAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIHNlbmRpbmcgdGhlIGBldmVudGAgd2lsbCBjYXVzZSBhIG5vbi1mb3JiaWRkZW4gdHJhbnNpdGlvblxyXG4gICAqIHRvIGJlIHNlbGVjdGVkLCBldmVuIGlmIHRoZSB0cmFuc2l0aW9ucyBoYXZlIG5vIGFjdGlvbnMgbm9yXHJcbiAgICogY2hhbmdlIHRoZSBzdGF0ZSB2YWx1ZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgdG8gdGVzdFxyXG4gICAqIEByZXR1cm5zIFdoZXRoZXIgdGhlIGV2ZW50IHdpbGwgY2F1c2UgYSB0cmFuc2l0aW9uXHJcbiAgICovXG5cblxuICBTdGF0ZS5wcm90b3R5cGUuY2FuID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIF9hO1xuXG4gICAgaWYgKElTX1BST0RVQ1RJT04pIHtcbiAgICAgIHdhcm4oISF0aGlzLm1hY2hpbmUsIFwic3RhdGUuY2FuKC4uLikgdXNlZCBvdXRzaWRlIG9mIGEgbWFjaGluZS1jcmVhdGVkIFN0YXRlIG9iamVjdDsgdGhpcyB3aWxsIGFsd2F5cyByZXR1cm4gZmFsc2UuXCIpO1xuICAgIH1cblxuICAgIHZhciB0cmFuc2l0aW9uRGF0YSA9IChfYSA9IHRoaXMubWFjaGluZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdldFRyYW5zaXRpb25EYXRhKHRoaXMsIGV2ZW50KTtcbiAgICByZXR1cm4gISEodHJhbnNpdGlvbkRhdGEgPT09IG51bGwgfHwgdHJhbnNpdGlvbkRhdGEgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHRyYW5zaXRpb25EYXRhLnRyYW5zaXRpb25zLmxlbmd0aCkgJiYgLy8gQ2hlY2sgdGhhdCBhdCBsZWFzdCBvbmUgdHJhbnNpdGlvbiBpcyBub3QgZm9yYmlkZGVuXG4gICAgdHJhbnNpdGlvbkRhdGEudHJhbnNpdGlvbnMuc29tZShmdW5jdGlvbiAodCkge1xuICAgICAgcmV0dXJuIHQudGFyZ2V0ICE9PSB1bmRlZmluZWQgfHwgdC5hY3Rpb25zLmxlbmd0aDtcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gU3RhdGU7XG59KCk7XG5cbmV4cG9ydCB7IFN0YXRlLCBiaW5kQWN0aW9uVG9TdGF0ZSwgaXNTdGF0ZSwgaXNTdGF0ZUNvbmZpZywgc3RhdGVWYWx1ZXNFcXVhbCB9O1xuIiwiaW1wb3J0IHsgX19hc3NpZ24sIF9fc3ByZWFkQXJyYXksIF9fcmVhZCwgX192YWx1ZXMsIF9fcmVzdCB9IGZyb20gJy4vX3ZpcnR1YWwvX3RzbGliLmpzJztcbmltcG9ydCB7IGlzRnVuY3Rpb24sIG1hcFZhbHVlcywgaXNBcnJheSwgZmxhdHRlbiwgdG9BcnJheSwgdG9TdGF0ZVZhbHVlLCBpc1N0cmluZywgZ2V0RXZlbnRUeXBlLCB0b1NDWE1MRXZlbnQsIG1hdGNoZXNTdGF0ZSwgcGF0aCwgZXZhbHVhdGVHdWFyZCwgbWFwQ29udGV4dCwgaXNSYWlzYWJsZUFjdGlvbiwgcGF0aFRvU3RhdGVWYWx1ZSwgaXNCdWlsdEluRXZlbnQsIHBhcnRpdGlvbiwgdXBkYXRlSGlzdG9yeVZhbHVlLCB0b1N0YXRlUGF0aCwgbWFwRmlsdGVyVmFsdWVzLCB3YXJuLCB0b1N0YXRlUGF0aHMsIG5lc3RlZFBhdGgsIG5vcm1hbGl6ZVRhcmdldCwgdG9HdWFyZCwgdG9UcmFuc2l0aW9uQ29uZmlnQXJyYXksIGlzTWFjaGluZSwgY3JlYXRlSW52b2tlSWQgfSBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7IFN0YXRlLCBzdGF0ZVZhbHVlc0VxdWFsIH0gZnJvbSAnLi9TdGF0ZS5qcyc7XG5pbXBvcnQgeyBzdGFydCBhcyBzdGFydCQxLCBzdG9wIGFzIHN0b3AkMSwgaW52b2tlLCB1cGRhdGUsIG51bGxFdmVudCB9IGZyb20gJy4vYWN0aW9uVHlwZXMuanMnO1xuaW1wb3J0IHsgZG9uZSwgc3RhcnQsIHRvQWN0aW9uT2JqZWN0cywgcmFpc2UsIHN0b3AsIHJlc29sdmVBY3Rpb25zLCBkb25lSW52b2tlLCBlcnJvciwgdG9BY3Rpb25PYmplY3QsIHRvQWN0aXZpdHlEZWZpbml0aW9uLCBhZnRlciwgc2VuZCwgY2FuY2VsLCBpbml0RXZlbnQgfSBmcm9tICcuL2FjdGlvbnMuanMnO1xuaW1wb3J0IHsgSVNfUFJPRFVDVElPTiB9IGZyb20gJy4vZW52aXJvbm1lbnQuanMnO1xuaW1wb3J0IHsgU1RBVEVfREVMSU1JVEVSIH0gZnJvbSAnLi9jb25zdGFudHMuanMnO1xuaW1wb3J0IHsgZ2V0QWxsU3RhdGVOb2RlcywgZ2V0Q29uZmlndXJhdGlvbiwgaXNJbkZpbmFsU3RhdGUsIGdldFRhZ3NGcm9tQ29uZmlndXJhdGlvbiwgaGFzLCBnZXRDaGlsZHJlbiwgZ2V0VmFsdWUsIGlzTGVhZk5vZGUsIGdldEFsbENoaWxkcmVuIH0gZnJvbSAnLi9zdGF0ZVV0aWxzLmpzJztcbmltcG9ydCB7IGNyZWF0ZUludm9jYWJsZUFjdG9yIH0gZnJvbSAnLi9BY3Rvci5qcyc7XG5pbXBvcnQgeyB0b0ludm9rZURlZmluaXRpb24gfSBmcm9tICcuL2ludm9rZVV0aWxzLmpzJztcblxudmFyIE5VTExfRVZFTlQgPSAnJztcbnZhciBTVEFURV9JREVOVElGSUVSID0gJyMnO1xudmFyIFdJTERDQVJEID0gJyonO1xudmFyIEVNUFRZX09CSkVDVCA9IHt9O1xuXG52YXIgaXNTdGF0ZUlkID0gZnVuY3Rpb24gKHN0cikge1xuICByZXR1cm4gc3RyWzBdID09PSBTVEFURV9JREVOVElGSUVSO1xufTtcblxudmFyIGNyZWF0ZURlZmF1bHRPcHRpb25zID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIGFjdGlvbnM6IHt9LFxuICAgIGd1YXJkczoge30sXG4gICAgc2VydmljZXM6IHt9LFxuICAgIGFjdGl2aXRpZXM6IHt9LFxuICAgIGRlbGF5czoge31cbiAgfTtcbn07XG5cbnZhciB2YWxpZGF0ZUFycmF5aWZpZWRUcmFuc2l0aW9ucyA9IGZ1bmN0aW9uIChzdGF0ZU5vZGUsIGV2ZW50LCB0cmFuc2l0aW9ucykge1xuICB2YXIgaGFzTm9uTGFzdFVuZ3VhcmRlZFRhcmdldCA9IHRyYW5zaXRpb25zLnNsaWNlKDAsIC0xKS5zb21lKGZ1bmN0aW9uICh0cmFuc2l0aW9uKSB7XG4gICAgcmV0dXJuICEoJ2NvbmQnIGluIHRyYW5zaXRpb24pICYmICEoJ2luJyBpbiB0cmFuc2l0aW9uKSAmJiAoaXNTdHJpbmcodHJhbnNpdGlvbi50YXJnZXQpIHx8IGlzTWFjaGluZSh0cmFuc2l0aW9uLnRhcmdldCkpO1xuICB9KTtcbiAgdmFyIGV2ZW50VGV4dCA9IGV2ZW50ID09PSBOVUxMX0VWRU5UID8gJ3RoZSB0cmFuc2llbnQgZXZlbnQnIDogXCJldmVudCAnXCIuY29uY2F0KGV2ZW50LCBcIidcIik7XG4gIHdhcm4oIWhhc05vbkxhc3RVbmd1YXJkZWRUYXJnZXQsIFwiT25lIG9yIG1vcmUgdHJhbnNpdGlvbnMgZm9yIFwiLmNvbmNhdChldmVudFRleHQsIFwiIG9uIHN0YXRlICdcIikuY29uY2F0KHN0YXRlTm9kZS5pZCwgXCInIGFyZSB1bnJlYWNoYWJsZS4gXCIpICsgXCJNYWtlIHN1cmUgdGhhdCB0aGUgZGVmYXVsdCB0cmFuc2l0aW9uIGlzIHRoZSBsYXN0IG9uZSBkZWZpbmVkLlwiKTtcbn07XG5cbnZhciBTdGF0ZU5vZGUgPVxuLyojX19QVVJFX18qL1xuXG4vKiogQGNsYXNzICovXG5mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFN0YXRlTm9kZShcbiAgLyoqXHJcbiAgICogVGhlIHJhdyBjb25maWcgdXNlZCB0byBjcmVhdGUgdGhlIG1hY2hpbmUuXHJcbiAgICovXG4gIGNvbmZpZywgb3B0aW9ucyxcbiAgLyoqXHJcbiAgICogVGhlIGluaXRpYWwgZXh0ZW5kZWQgc3RhdGVcclxuICAgKi9cbiAgX2NvbnRleHQsIC8vIFRPRE86IHRoaXMgaXMgdW5zYWZlLCBidXQgd2UncmUgcmVtb3ZpbmcgaXQgaW4gdjUgYW55d2F5XG4gIF9zdGF0ZUluZm8pIHtcbiAgICBpZiAoX2NvbnRleHQgPT09IHZvaWQgMCkge1xuICAgICAgX2NvbnRleHQgPSAnY29udGV4dCcgaW4gY29uZmlnID8gY29uZmlnLmNvbnRleHQgOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBfYTtcblxuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMuX2NvbnRleHQgPSBfY29udGV4dDtcbiAgICAvKipcclxuICAgICAqIFRoZSBvcmRlciB0aGlzIHN0YXRlIG5vZGUgYXBwZWFycy4gQ29ycmVzcG9uZHMgdG8gdGhlIGltcGxpY2l0IFNDWE1MIGRvY3VtZW50IG9yZGVyLlxyXG4gICAgICovXG5cbiAgICB0aGlzLm9yZGVyID0gLTE7XG4gICAgdGhpcy5fX3hzdGF0ZW5vZGUgPSB0cnVlO1xuICAgIHRoaXMuX19jYWNoZSA9IHtcbiAgICAgIGV2ZW50czogdW5kZWZpbmVkLFxuICAgICAgcmVsYXRpdmVWYWx1ZTogbmV3IE1hcCgpLFxuICAgICAgaW5pdGlhbFN0YXRlVmFsdWU6IHVuZGVmaW5lZCxcbiAgICAgIGluaXRpYWxTdGF0ZTogdW5kZWZpbmVkLFxuICAgICAgb246IHVuZGVmaW5lZCxcbiAgICAgIHRyYW5zaXRpb25zOiB1bmRlZmluZWQsXG4gICAgICBjYW5kaWRhdGVzOiB7fSxcbiAgICAgIGRlbGF5ZWRUcmFuc2l0aW9uczogdW5kZWZpbmVkXG4gICAgfTtcbiAgICB0aGlzLmlkTWFwID0ge307XG4gICAgdGhpcy50YWdzID0gW107XG4gICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbihjcmVhdGVEZWZhdWx0T3B0aW9ucygpLCBvcHRpb25zKTtcbiAgICB0aGlzLnBhcmVudCA9IF9zdGF0ZUluZm8gPT09IG51bGwgfHwgX3N0YXRlSW5mbyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX3N0YXRlSW5mby5wYXJlbnQ7XG4gICAgdGhpcy5rZXkgPSB0aGlzLmNvbmZpZy5rZXkgfHwgKF9zdGF0ZUluZm8gPT09IG51bGwgfHwgX3N0YXRlSW5mbyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX3N0YXRlSW5mby5rZXkpIHx8IHRoaXMuY29uZmlnLmlkIHx8ICcobWFjaGluZSknO1xuICAgIHRoaXMubWFjaGluZSA9IHRoaXMucGFyZW50ID8gdGhpcy5wYXJlbnQubWFjaGluZSA6IHRoaXM7XG4gICAgdGhpcy5wYXRoID0gdGhpcy5wYXJlbnQgPyB0aGlzLnBhcmVudC5wYXRoLmNvbmNhdCh0aGlzLmtleSkgOiBbXTtcbiAgICB0aGlzLmRlbGltaXRlciA9IHRoaXMuY29uZmlnLmRlbGltaXRlciB8fCAodGhpcy5wYXJlbnQgPyB0aGlzLnBhcmVudC5kZWxpbWl0ZXIgOiBTVEFURV9ERUxJTUlURVIpO1xuICAgIHRoaXMuaWQgPSB0aGlzLmNvbmZpZy5pZCB8fCBfX3NwcmVhZEFycmF5KFt0aGlzLm1hY2hpbmUua2V5XSwgX19yZWFkKHRoaXMucGF0aCksIGZhbHNlKS5qb2luKHRoaXMuZGVsaW1pdGVyKTtcbiAgICB0aGlzLnZlcnNpb24gPSB0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50LnZlcnNpb24gOiB0aGlzLmNvbmZpZy52ZXJzaW9uO1xuICAgIHRoaXMudHlwZSA9IHRoaXMuY29uZmlnLnR5cGUgfHwgKHRoaXMuY29uZmlnLnBhcmFsbGVsID8gJ3BhcmFsbGVsJyA6IHRoaXMuY29uZmlnLnN0YXRlcyAmJiBPYmplY3Qua2V5cyh0aGlzLmNvbmZpZy5zdGF0ZXMpLmxlbmd0aCA/ICdjb21wb3VuZCcgOiB0aGlzLmNvbmZpZy5oaXN0b3J5ID8gJ2hpc3RvcnknIDogJ2F0b21pYycpO1xuICAgIHRoaXMuc2NoZW1hID0gdGhpcy5wYXJlbnQgPyB0aGlzLm1hY2hpbmUuc2NoZW1hIDogKF9hID0gdGhpcy5jb25maWcuc2NoZW1hKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiB7fTtcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gdGhpcy5jb25maWcuZGVzY3JpcHRpb247XG5cbiAgICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICAgIHdhcm4oISgncGFyYWxsZWwnIGluIHRoaXMuY29uZmlnKSwgXCJUaGUgXFxcInBhcmFsbGVsXFxcIiBwcm9wZXJ0eSBpcyBkZXByZWNhdGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gdmVyc2lvbiA0LjEuIFwiLmNvbmNhdCh0aGlzLmNvbmZpZy5wYXJhbGxlbCA/IFwiUmVwbGFjZSB3aXRoIGB0eXBlOiAncGFyYWxsZWwnYFwiIDogXCJVc2UgYHR5cGU6ICdcIi5jb25jYXQodGhpcy50eXBlLCBcIidgXCIpLCBcIiBpbiB0aGUgY29uZmlnIGZvciBzdGF0ZSBub2RlICdcIikuY29uY2F0KHRoaXMuaWQsIFwiJyBpbnN0ZWFkLlwiKSk7XG4gICAgfVxuXG4gICAgdGhpcy5pbml0aWFsID0gdGhpcy5jb25maWcuaW5pdGlhbDtcbiAgICB0aGlzLnN0YXRlcyA9IHRoaXMuY29uZmlnLnN0YXRlcyA/IG1hcFZhbHVlcyh0aGlzLmNvbmZpZy5zdGF0ZXMsIGZ1bmN0aW9uIChzdGF0ZUNvbmZpZywga2V5KSB7XG4gICAgICB2YXIgX2E7XG5cbiAgICAgIHZhciBzdGF0ZU5vZGUgPSBuZXcgU3RhdGVOb2RlKHN0YXRlQ29uZmlnLCB7fSwgdW5kZWZpbmVkLCB7XG4gICAgICAgIHBhcmVudDogX3RoaXMsXG4gICAgICAgIGtleToga2V5XG4gICAgICB9KTtcbiAgICAgIE9iamVjdC5hc3NpZ24oX3RoaXMuaWRNYXAsIF9fYXNzaWduKChfYSA9IHt9LCBfYVtzdGF0ZU5vZGUuaWRdID0gc3RhdGVOb2RlLCBfYSksIHN0YXRlTm9kZS5pZE1hcCkpO1xuICAgICAgcmV0dXJuIHN0YXRlTm9kZTtcbiAgICB9KSA6IEVNUFRZX09CSkVDVDsgLy8gRG9jdW1lbnQgb3JkZXJcblxuICAgIHZhciBvcmRlciA9IDA7XG5cbiAgICBmdW5jdGlvbiBkZnMoc3RhdGVOb2RlKSB7XG4gICAgICB2YXIgZV8xLCBfYTtcblxuICAgICAgc3RhdGVOb2RlLm9yZGVyID0gb3JkZXIrKztcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yICh2YXIgX2IgPSBfX3ZhbHVlcyhnZXRBbGxDaGlsZHJlbihzdGF0ZU5vZGUpKSwgX2MgPSBfYi5uZXh0KCk7ICFfYy5kb25lOyBfYyA9IF9iLm5leHQoKSkge1xuICAgICAgICAgIHZhciBjaGlsZCA9IF9jLnZhbHVlO1xuICAgICAgICAgIGRmcyhjaGlsZCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVfMV8xKSB7XG4gICAgICAgIGVfMSA9IHtcbiAgICAgICAgICBlcnJvcjogZV8xXzFcbiAgICAgICAgfTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKF9jICYmICFfYy5kb25lICYmIChfYSA9IF9iLnJldHVybikpIF9hLmNhbGwoX2IpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGRmcyh0aGlzKTsgLy8gSGlzdG9yeSBjb25maWdcblxuICAgIHRoaXMuaGlzdG9yeSA9IHRoaXMuY29uZmlnLmhpc3RvcnkgPT09IHRydWUgPyAnc2hhbGxvdycgOiB0aGlzLmNvbmZpZy5oaXN0b3J5IHx8IGZhbHNlO1xuICAgIHRoaXMuX3RyYW5zaWVudCA9ICEhdGhpcy5jb25maWcuYWx3YXlzIHx8ICghdGhpcy5jb25maWcub24gPyBmYWxzZSA6IEFycmF5LmlzQXJyYXkodGhpcy5jb25maWcub24pID8gdGhpcy5jb25maWcub24uc29tZShmdW5jdGlvbiAoX2EpIHtcbiAgICAgIHZhciBldmVudCA9IF9hLmV2ZW50O1xuICAgICAgcmV0dXJuIGV2ZW50ID09PSBOVUxMX0VWRU5UO1xuICAgIH0pIDogTlVMTF9FVkVOVCBpbiB0aGlzLmNvbmZpZy5vbik7XG4gICAgdGhpcy5zdHJpY3QgPSAhIXRoaXMuY29uZmlnLnN0cmljdDsgLy8gVE9ETzogZGVwcmVjYXRlIChlbnRyeSlcblxuICAgIHRoaXMub25FbnRyeSA9IHRvQXJyYXkodGhpcy5jb25maWcuZW50cnkgfHwgdGhpcy5jb25maWcub25FbnRyeSkubWFwKGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgIHJldHVybiB0b0FjdGlvbk9iamVjdChhY3Rpb24pO1xuICAgIH0pOyAvLyBUT0RPOiBkZXByZWNhdGUgKGV4aXQpXG5cbiAgICB0aGlzLm9uRXhpdCA9IHRvQXJyYXkodGhpcy5jb25maWcuZXhpdCB8fCB0aGlzLmNvbmZpZy5vbkV4aXQpLm1hcChmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICByZXR1cm4gdG9BY3Rpb25PYmplY3QoYWN0aW9uKTtcbiAgICB9KTtcbiAgICB0aGlzLm1ldGEgPSB0aGlzLmNvbmZpZy5tZXRhO1xuICAgIHRoaXMuZG9uZURhdGEgPSB0aGlzLnR5cGUgPT09ICdmaW5hbCcgPyB0aGlzLmNvbmZpZy5kYXRhIDogdW5kZWZpbmVkO1xuICAgIHRoaXMuaW52b2tlID0gdG9BcnJheSh0aGlzLmNvbmZpZy5pbnZva2UpLm1hcChmdW5jdGlvbiAoaW52b2tlQ29uZmlnLCBpKSB7XG4gICAgICB2YXIgX2EsIF9iO1xuXG4gICAgICBpZiAoaXNNYWNoaW5lKGludm9rZUNvbmZpZykpIHtcbiAgICAgICAgdmFyIGludm9rZUlkID0gY3JlYXRlSW52b2tlSWQoX3RoaXMuaWQsIGkpO1xuICAgICAgICBfdGhpcy5tYWNoaW5lLm9wdGlvbnMuc2VydmljZXMgPSBfX2Fzc2lnbigoX2EgPSB7fSwgX2FbaW52b2tlSWRdID0gaW52b2tlQ29uZmlnLCBfYSksIF90aGlzLm1hY2hpbmUub3B0aW9ucy5zZXJ2aWNlcyk7XG4gICAgICAgIHJldHVybiB0b0ludm9rZURlZmluaXRpb24oe1xuICAgICAgICAgIHNyYzogaW52b2tlSWQsXG4gICAgICAgICAgaWQ6IGludm9rZUlkXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChpc1N0cmluZyhpbnZva2VDb25maWcuc3JjKSkge1xuICAgICAgICB2YXIgaW52b2tlSWQgPSBpbnZva2VDb25maWcuaWQgfHwgY3JlYXRlSW52b2tlSWQoX3RoaXMuaWQsIGkpO1xuICAgICAgICByZXR1cm4gdG9JbnZva2VEZWZpbml0aW9uKF9fYXNzaWduKF9fYXNzaWduKHt9LCBpbnZva2VDb25maWcpLCB7XG4gICAgICAgICAgaWQ6IGludm9rZUlkLFxuICAgICAgICAgIHNyYzogaW52b2tlQ29uZmlnLnNyY1xuICAgICAgICB9KSk7XG4gICAgICB9IGVsc2UgaWYgKGlzTWFjaGluZShpbnZva2VDb25maWcuc3JjKSB8fCBpc0Z1bmN0aW9uKGludm9rZUNvbmZpZy5zcmMpKSB7XG4gICAgICAgIHZhciBpbnZva2VJZCA9IGludm9rZUNvbmZpZy5pZCB8fCBjcmVhdGVJbnZva2VJZChfdGhpcy5pZCwgaSk7XG4gICAgICAgIF90aGlzLm1hY2hpbmUub3B0aW9ucy5zZXJ2aWNlcyA9IF9fYXNzaWduKChfYiA9IHt9LCBfYltpbnZva2VJZF0gPSBpbnZva2VDb25maWcuc3JjLCBfYiksIF90aGlzLm1hY2hpbmUub3B0aW9ucy5zZXJ2aWNlcyk7XG4gICAgICAgIHJldHVybiB0b0ludm9rZURlZmluaXRpb24oX19hc3NpZ24oX19hc3NpZ24oe1xuICAgICAgICAgIGlkOiBpbnZva2VJZFxuICAgICAgICB9LCBpbnZva2VDb25maWcpLCB7XG4gICAgICAgICAgc3JjOiBpbnZva2VJZFxuICAgICAgICB9KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgaW52b2tlU291cmNlID0gaW52b2tlQ29uZmlnLnNyYztcbiAgICAgICAgcmV0dXJuIHRvSW52b2tlRGVmaW5pdGlvbihfX2Fzc2lnbihfX2Fzc2lnbih7XG4gICAgICAgICAgaWQ6IGNyZWF0ZUludm9rZUlkKF90aGlzLmlkLCBpKVxuICAgICAgICB9LCBpbnZva2VDb25maWcpLCB7XG4gICAgICAgICAgc3JjOiBpbnZva2VTb3VyY2VcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuYWN0aXZpdGllcyA9IHRvQXJyYXkodGhpcy5jb25maWcuYWN0aXZpdGllcykuY29uY2F0KHRoaXMuaW52b2tlKS5tYXAoZnVuY3Rpb24gKGFjdGl2aXR5KSB7XG4gICAgICByZXR1cm4gdG9BY3Rpdml0eURlZmluaXRpb24oYWN0aXZpdHkpO1xuICAgIH0pO1xuICAgIHRoaXMudHJhbnNpdGlvbiA9IHRoaXMudHJhbnNpdGlvbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMudGFncyA9IHRvQXJyYXkodGhpcy5jb25maWcudGFncyk7IC8vIFRPRE86IHRoaXMgaXMgdGhlIHJlYWwgZml4IGZvciBpbml0aWFsaXphdGlvbiBvbmNlXG4gICAgLy8gc3RhdGUgbm9kZSBnZXR0ZXJzIGFyZSBkZXByZWNhdGVkXG4gICAgLy8gaWYgKCF0aGlzLnBhcmVudCkge1xuICAgIC8vICAgdGhpcy5faW5pdCgpO1xuICAgIC8vIH1cbiAgfVxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuX19jYWNoZS50cmFuc2l0aW9ucykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGdldEFsbFN0YXRlTm9kZXModGhpcykuZm9yRWFjaChmdW5jdGlvbiAoc3RhdGVOb2RlKSB7XG4gICAgICByZXR1cm4gc3RhdGVOb2RlLm9uO1xuICAgIH0pO1xuICB9O1xuICAvKipcclxuICAgKiBDbG9uZXMgdGhpcyBzdGF0ZSBtYWNoaW5lIHdpdGggY3VzdG9tIG9wdGlvbnMgYW5kIGNvbnRleHQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIChhY3Rpb25zLCBndWFyZHMsIGFjdGl2aXRpZXMsIHNlcnZpY2VzKSB0byByZWN1cnNpdmVseSBtZXJnZSB3aXRoIHRoZSBleGlzdGluZyBvcHRpb25zLlxyXG4gICAqIEBwYXJhbSBjb250ZXh0IEN1c3RvbSBjb250ZXh0ICh3aWxsIG92ZXJyaWRlIHByZWRlZmluZWQgY29udGV4dClcclxuICAgKi9cblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUud2l0aENvbmZpZyA9IGZ1bmN0aW9uIChvcHRpb25zLCBjb250ZXh0KSB7XG4gICAgdmFyIF9hID0gdGhpcy5vcHRpb25zLFxuICAgICAgICBhY3Rpb25zID0gX2EuYWN0aW9ucyxcbiAgICAgICAgYWN0aXZpdGllcyA9IF9hLmFjdGl2aXRpZXMsXG4gICAgICAgIGd1YXJkcyA9IF9hLmd1YXJkcyxcbiAgICAgICAgc2VydmljZXMgPSBfYS5zZXJ2aWNlcyxcbiAgICAgICAgZGVsYXlzID0gX2EuZGVsYXlzO1xuICAgIHJldHVybiBuZXcgU3RhdGVOb2RlKHRoaXMuY29uZmlnLCB7XG4gICAgICBhY3Rpb25zOiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgYWN0aW9ucyksIG9wdGlvbnMuYWN0aW9ucyksXG4gICAgICBhY3Rpdml0aWVzOiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgYWN0aXZpdGllcyksIG9wdGlvbnMuYWN0aXZpdGllcyksXG4gICAgICBndWFyZHM6IF9fYXNzaWduKF9fYXNzaWduKHt9LCBndWFyZHMpLCBvcHRpb25zLmd1YXJkcyksXG4gICAgICBzZXJ2aWNlczogX19hc3NpZ24oX19hc3NpZ24oe30sIHNlcnZpY2VzKSwgb3B0aW9ucy5zZXJ2aWNlcyksXG4gICAgICBkZWxheXM6IF9fYXNzaWduKF9fYXNzaWduKHt9LCBkZWxheXMpLCBvcHRpb25zLmRlbGF5cylcbiAgICB9LCBjb250ZXh0ICE9PSBudWxsICYmIGNvbnRleHQgIT09IHZvaWQgMCA/IGNvbnRleHQgOiB0aGlzLmNvbnRleHQpO1xuICB9O1xuICAvKipcclxuICAgKiBDbG9uZXMgdGhpcyBzdGF0ZSBtYWNoaW5lIHdpdGggY3VzdG9tIGNvbnRleHQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gY29udGV4dCBDdXN0b20gY29udGV4dCAod2lsbCBvdmVycmlkZSBwcmVkZWZpbmVkIGNvbnRleHQsIG5vdCByZWN1cnNpdmUpXHJcbiAgICovXG5cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLndpdGhDb250ZXh0ID0gZnVuY3Rpb24gKGNvbnRleHQpIHtcbiAgICByZXR1cm4gbmV3IFN0YXRlTm9kZSh0aGlzLmNvbmZpZywgdGhpcy5vcHRpb25zLCBjb250ZXh0KTtcbiAgfTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RhdGVOb2RlLnByb3RvdHlwZSwgXCJjb250ZXh0XCIsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBpc0Z1bmN0aW9uKHRoaXMuX2NvbnRleHQpID8gdGhpcy5fY29udGV4dCgpIDogdGhpcy5fY29udGV4dDtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0YXRlTm9kZS5wcm90b3R5cGUsIFwiZGVmaW5pdGlvblwiLCB7XG4gICAgLyoqXHJcbiAgICAgKiBUaGUgd2VsbC1zdHJ1Y3R1cmVkIHN0YXRlIG5vZGUgZGVmaW5pdGlvbi5cclxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgIGtleTogdGhpcy5rZXksXG4gICAgICAgIHZlcnNpb246IHRoaXMudmVyc2lvbixcbiAgICAgICAgY29udGV4dDogdGhpcy5jb250ZXh0LFxuICAgICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICAgIGluaXRpYWw6IHRoaXMuaW5pdGlhbCxcbiAgICAgICAgaGlzdG9yeTogdGhpcy5oaXN0b3J5LFxuICAgICAgICBzdGF0ZXM6IG1hcFZhbHVlcyh0aGlzLnN0YXRlcywgZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgICAgcmV0dXJuIHN0YXRlLmRlZmluaXRpb247XG4gICAgICAgIH0pLFxuICAgICAgICBvbjogdGhpcy5vbixcbiAgICAgICAgdHJhbnNpdGlvbnM6IHRoaXMudHJhbnNpdGlvbnMsXG4gICAgICAgIGVudHJ5OiB0aGlzLm9uRW50cnksXG4gICAgICAgIGV4aXQ6IHRoaXMub25FeGl0LFxuICAgICAgICBhY3Rpdml0aWVzOiB0aGlzLmFjdGl2aXRpZXMgfHwgW10sXG4gICAgICAgIG1ldGE6IHRoaXMubWV0YSxcbiAgICAgICAgb3JkZXI6IHRoaXMub3JkZXIgfHwgLTEsXG4gICAgICAgIGRhdGE6IHRoaXMuZG9uZURhdGEsXG4gICAgICAgIGludm9rZTogdGhpcy5pbnZva2UsXG4gICAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uLFxuICAgICAgICB0YWdzOiB0aGlzLnRhZ3NcbiAgICAgIH07XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVmaW5pdGlvbjtcbiAgfTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RhdGVOb2RlLnByb3RvdHlwZSwgXCJvblwiLCB7XG4gICAgLyoqXHJcbiAgICAgKiBUaGUgbWFwcGluZyBvZiBldmVudHMgdG8gdHJhbnNpdGlvbnMuXHJcbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLl9fY2FjaGUub24pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19jYWNoZS5vbjtcbiAgICAgIH1cblxuICAgICAgdmFyIHRyYW5zaXRpb25zID0gdGhpcy50cmFuc2l0aW9ucztcbiAgICAgIHJldHVybiB0aGlzLl9fY2FjaGUub24gPSB0cmFuc2l0aW9ucy5yZWR1Y2UoZnVuY3Rpb24gKG1hcCwgdHJhbnNpdGlvbikge1xuICAgICAgICBtYXBbdHJhbnNpdGlvbi5ldmVudFR5cGVdID0gbWFwW3RyYW5zaXRpb24uZXZlbnRUeXBlXSB8fCBbXTtcbiAgICAgICAgbWFwW3RyYW5zaXRpb24uZXZlbnRUeXBlXS5wdXNoKHRyYW5zaXRpb24pO1xuICAgICAgICByZXR1cm4gbWFwO1xuICAgICAgfSwge30pO1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RhdGVOb2RlLnByb3RvdHlwZSwgXCJhZnRlclwiLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX2NhY2hlLmRlbGF5ZWRUcmFuc2l0aW9ucyB8fCAodGhpcy5fX2NhY2hlLmRlbGF5ZWRUcmFuc2l0aW9ucyA9IHRoaXMuZ2V0RGVsYXllZFRyYW5zaXRpb25zKCksIHRoaXMuX19jYWNoZS5kZWxheWVkVHJhbnNpdGlvbnMpO1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RhdGVOb2RlLnByb3RvdHlwZSwgXCJ0cmFuc2l0aW9uc1wiLCB7XG4gICAgLyoqXHJcbiAgICAgKiBBbGwgdGhlIHRyYW5zaXRpb25zIHRoYXQgY2FuIGJlIHRha2VuIGZyb20gdGhpcyBzdGF0ZSBub2RlLlxyXG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX2NhY2hlLnRyYW5zaXRpb25zIHx8ICh0aGlzLl9fY2FjaGUudHJhbnNpdGlvbnMgPSB0aGlzLmZvcm1hdFRyYW5zaXRpb25zKCksIHRoaXMuX19jYWNoZS50cmFuc2l0aW9ucyk7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5nZXRDYW5kaWRhdGVzID0gZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuICAgIGlmICh0aGlzLl9fY2FjaGUuY2FuZGlkYXRlc1tldmVudE5hbWVdKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX2NhY2hlLmNhbmRpZGF0ZXNbZXZlbnROYW1lXTtcbiAgICB9XG5cbiAgICB2YXIgdHJhbnNpZW50ID0gZXZlbnROYW1lID09PSBOVUxMX0VWRU5UO1xuICAgIHZhciBjYW5kaWRhdGVzID0gdGhpcy50cmFuc2l0aW9ucy5maWx0ZXIoZnVuY3Rpb24gKHRyYW5zaXRpb24pIHtcbiAgICAgIHZhciBzYW1lRXZlbnRUeXBlID0gdHJhbnNpdGlvbi5ldmVudFR5cGUgPT09IGV2ZW50TmFtZTsgLy8gbnVsbCBldmVudHMgc2hvdWxkIG9ubHkgbWF0Y2ggYWdhaW5zdCBldmVudGxlc3MgdHJhbnNpdGlvbnNcblxuICAgICAgcmV0dXJuIHRyYW5zaWVudCA/IHNhbWVFdmVudFR5cGUgOiBzYW1lRXZlbnRUeXBlIHx8IHRyYW5zaXRpb24uZXZlbnRUeXBlID09PSBXSUxEQ0FSRDtcbiAgICB9KTtcbiAgICB0aGlzLl9fY2FjaGUuY2FuZGlkYXRlc1tldmVudE5hbWVdID0gY2FuZGlkYXRlcztcbiAgICByZXR1cm4gY2FuZGlkYXRlcztcbiAgfTtcbiAgLyoqXHJcbiAgICogQWxsIGRlbGF5ZWQgdHJhbnNpdGlvbnMgZnJvbSB0aGUgY29uZmlnLlxyXG4gICAqL1xuXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5nZXREZWxheWVkVHJhbnNpdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBhZnRlckNvbmZpZyA9IHRoaXMuY29uZmlnLmFmdGVyO1xuXG4gICAgaWYgKCFhZnRlckNvbmZpZykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIHZhciBtdXRhdGVFbnRyeUV4aXQgPSBmdW5jdGlvbiAoZGVsYXksIGkpIHtcbiAgICAgIHZhciBkZWxheVJlZiA9IGlzRnVuY3Rpb24oZGVsYXkpID8gXCJcIi5jb25jYXQoX3RoaXMuaWQsIFwiOmRlbGF5W1wiKS5jb25jYXQoaSwgXCJdXCIpIDogZGVsYXk7XG4gICAgICB2YXIgZXZlbnRUeXBlID0gYWZ0ZXIoZGVsYXlSZWYsIF90aGlzLmlkKTtcblxuICAgICAgX3RoaXMub25FbnRyeS5wdXNoKHNlbmQoZXZlbnRUeXBlLCB7XG4gICAgICAgIGRlbGF5OiBkZWxheVxuICAgICAgfSkpO1xuXG4gICAgICBfdGhpcy5vbkV4aXQucHVzaChjYW5jZWwoZXZlbnRUeXBlKSk7XG5cbiAgICAgIHJldHVybiBldmVudFR5cGU7XG4gICAgfTtcblxuICAgIHZhciBkZWxheWVkVHJhbnNpdGlvbnMgPSBpc0FycmF5KGFmdGVyQ29uZmlnKSA/IGFmdGVyQ29uZmlnLm1hcChmdW5jdGlvbiAodHJhbnNpdGlvbiwgaSkge1xuICAgICAgdmFyIGV2ZW50VHlwZSA9IG11dGF0ZUVudHJ5RXhpdCh0cmFuc2l0aW9uLmRlbGF5LCBpKTtcbiAgICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgdHJhbnNpdGlvbiksIHtcbiAgICAgICAgZXZlbnQ6IGV2ZW50VHlwZVxuICAgICAgfSk7XG4gICAgfSkgOiBmbGF0dGVuKE9iamVjdC5rZXlzKGFmdGVyQ29uZmlnKS5tYXAoZnVuY3Rpb24gKGRlbGF5LCBpKSB7XG4gICAgICB2YXIgY29uZmlnVHJhbnNpdGlvbiA9IGFmdGVyQ29uZmlnW2RlbGF5XTtcbiAgICAgIHZhciByZXNvbHZlZFRyYW5zaXRpb24gPSBpc1N0cmluZyhjb25maWdUcmFuc2l0aW9uKSA/IHtcbiAgICAgICAgdGFyZ2V0OiBjb25maWdUcmFuc2l0aW9uXG4gICAgICB9IDogY29uZmlnVHJhbnNpdGlvbjtcbiAgICAgIHZhciByZXNvbHZlZERlbGF5ID0gIWlzTmFOKCtkZWxheSkgPyArZGVsYXkgOiBkZWxheTtcbiAgICAgIHZhciBldmVudFR5cGUgPSBtdXRhdGVFbnRyeUV4aXQocmVzb2x2ZWREZWxheSwgaSk7XG4gICAgICByZXR1cm4gdG9BcnJheShyZXNvbHZlZFRyYW5zaXRpb24pLm1hcChmdW5jdGlvbiAodHJhbnNpdGlvbikge1xuICAgICAgICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIHRyYW5zaXRpb24pLCB7XG4gICAgICAgICAgZXZlbnQ6IGV2ZW50VHlwZSxcbiAgICAgICAgICBkZWxheTogcmVzb2x2ZWREZWxheVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pKTtcbiAgICByZXR1cm4gZGVsYXllZFRyYW5zaXRpb25zLm1hcChmdW5jdGlvbiAoZGVsYXllZFRyYW5zaXRpb24pIHtcbiAgICAgIHZhciBkZWxheSA9IGRlbGF5ZWRUcmFuc2l0aW9uLmRlbGF5O1xuICAgICAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCBfdGhpcy5mb3JtYXRUcmFuc2l0aW9uKGRlbGF5ZWRUcmFuc2l0aW9uKSksIHtcbiAgICAgICAgZGVsYXk6IGRlbGF5XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgc3RhdGUgbm9kZXMgcmVwcmVzZW50ZWQgYnkgdGhlIGN1cnJlbnQgc3RhdGUgdmFsdWUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gc3RhdGUgVGhlIHN0YXRlIHZhbHVlIG9yIFN0YXRlIGluc3RhbmNlXHJcbiAgICovXG5cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldFN0YXRlTm9kZXMgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICB2YXIgX2E7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKCFzdGF0ZSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIHZhciBzdGF0ZVZhbHVlID0gc3RhdGUgaW5zdGFuY2VvZiBTdGF0ZSA/IHN0YXRlLnZhbHVlIDogdG9TdGF0ZVZhbHVlKHN0YXRlLCB0aGlzLmRlbGltaXRlcik7XG5cbiAgICBpZiAoaXNTdHJpbmcoc3RhdGVWYWx1ZSkpIHtcbiAgICAgIHZhciBpbml0aWFsU3RhdGVWYWx1ZSA9IHRoaXMuZ2V0U3RhdGVOb2RlKHN0YXRlVmFsdWUpLmluaXRpYWw7XG4gICAgICByZXR1cm4gaW5pdGlhbFN0YXRlVmFsdWUgIT09IHVuZGVmaW5lZCA/IHRoaXMuZ2V0U3RhdGVOb2RlcygoX2EgPSB7fSwgX2Fbc3RhdGVWYWx1ZV0gPSBpbml0aWFsU3RhdGVWYWx1ZSwgX2EpKSA6IFt0aGlzLCB0aGlzLnN0YXRlc1tzdGF0ZVZhbHVlXV07XG4gICAgfVxuXG4gICAgdmFyIHN1YlN0YXRlS2V5cyA9IE9iamVjdC5rZXlzKHN0YXRlVmFsdWUpO1xuICAgIHZhciBzdWJTdGF0ZU5vZGVzID0gW3RoaXNdO1xuICAgIHN1YlN0YXRlTm9kZXMucHVzaC5hcHBseShzdWJTdGF0ZU5vZGVzLCBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoZmxhdHRlbihzdWJTdGF0ZUtleXMubWFwKGZ1bmN0aW9uIChzdWJTdGF0ZUtleSkge1xuICAgICAgcmV0dXJuIF90aGlzLmdldFN0YXRlTm9kZShzdWJTdGF0ZUtleSkuZ2V0U3RhdGVOb2RlcyhzdGF0ZVZhbHVlW3N1YlN0YXRlS2V5XSk7XG4gICAgfSkpKSwgZmFsc2UpKTtcbiAgICByZXR1cm4gc3ViU3RhdGVOb2RlcztcbiAgfTtcbiAgLyoqXHJcbiAgICogUmV0dXJucyBgdHJ1ZWAgaWYgdGhpcyBzdGF0ZSBub2RlIGV4cGxpY2l0bHkgaGFuZGxlcyB0aGUgZ2l2ZW4gZXZlbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IGluIHF1ZXN0aW9uXHJcbiAgICovXG5cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmhhbmRsZXMgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgZXZlbnRUeXBlID0gZ2V0RXZlbnRUeXBlKGV2ZW50KTtcbiAgICByZXR1cm4gdGhpcy5ldmVudHMuaW5jbHVkZXMoZXZlbnRUeXBlKTtcbiAgfTtcbiAgLyoqXHJcbiAgICogUmVzb2x2ZXMgdGhlIGdpdmVuIGBzdGF0ZWAgdG8gYSBuZXcgYFN0YXRlYCBpbnN0YW5jZSByZWxhdGl2ZSB0byB0aGlzIG1hY2hpbmUuXHJcbiAgICpcclxuICAgKiBUaGlzIGVuc3VyZXMgdGhhdCBgLmV2ZW50c2AgYW5kIGAubmV4dEV2ZW50c2AgcmVwcmVzZW50IHRoZSBjb3JyZWN0IHZhbHVlcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBzdGF0ZSBUaGUgc3RhdGUgdG8gcmVzb2x2ZVxyXG4gICAqL1xuXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5yZXNvbHZlU3RhdGUgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICB2YXIgc3RhdGVGcm9tQ29uZmlnID0gc3RhdGUgaW5zdGFuY2VvZiBTdGF0ZSA/IHN0YXRlIDogU3RhdGUuY3JlYXRlKHN0YXRlKTtcbiAgICB2YXIgY29uZmlndXJhdGlvbiA9IEFycmF5LmZyb20oZ2V0Q29uZmlndXJhdGlvbihbXSwgdGhpcy5nZXRTdGF0ZU5vZGVzKHN0YXRlRnJvbUNvbmZpZy52YWx1ZSkpKTtcbiAgICByZXR1cm4gbmV3IFN0YXRlKF9fYXNzaWduKF9fYXNzaWduKHt9LCBzdGF0ZUZyb21Db25maWcpLCB7XG4gICAgICB2YWx1ZTogdGhpcy5yZXNvbHZlKHN0YXRlRnJvbUNvbmZpZy52YWx1ZSksXG4gICAgICBjb25maWd1cmF0aW9uOiBjb25maWd1cmF0aW9uLFxuICAgICAgZG9uZTogaXNJbkZpbmFsU3RhdGUoY29uZmlndXJhdGlvbiwgdGhpcyksXG4gICAgICB0YWdzOiBnZXRUYWdzRnJvbUNvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbiksXG4gICAgICBtYWNoaW5lOiB0aGlzLm1hY2hpbmVcbiAgICB9KSk7XG4gIH07XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS50cmFuc2l0aW9uTGVhZk5vZGUgPSBmdW5jdGlvbiAoc3RhdGVWYWx1ZSwgc3RhdGUsIF9ldmVudCkge1xuICAgIHZhciBzdGF0ZU5vZGUgPSB0aGlzLmdldFN0YXRlTm9kZShzdGF0ZVZhbHVlKTtcbiAgICB2YXIgbmV4dCA9IHN0YXRlTm9kZS5uZXh0KHN0YXRlLCBfZXZlbnQpO1xuXG4gICAgaWYgKCFuZXh0IHx8ICFuZXh0LnRyYW5zaXRpb25zLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRoaXMubmV4dChzdGF0ZSwgX2V2ZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV4dDtcbiAgfTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLnRyYW5zaXRpb25Db21wb3VuZE5vZGUgPSBmdW5jdGlvbiAoc3RhdGVWYWx1ZSwgc3RhdGUsIF9ldmVudCkge1xuICAgIHZhciBzdWJTdGF0ZUtleXMgPSBPYmplY3Qua2V5cyhzdGF0ZVZhbHVlKTtcbiAgICB2YXIgc3RhdGVOb2RlID0gdGhpcy5nZXRTdGF0ZU5vZGUoc3ViU3RhdGVLZXlzWzBdKTtcblxuICAgIHZhciBuZXh0ID0gc3RhdGVOb2RlLl90cmFuc2l0aW9uKHN0YXRlVmFsdWVbc3ViU3RhdGVLZXlzWzBdXSwgc3RhdGUsIF9ldmVudCk7XG5cbiAgICBpZiAoIW5leHQgfHwgIW5leHQudHJhbnNpdGlvbnMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdGhpcy5uZXh0KHN0YXRlLCBfZXZlbnQpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXh0O1xuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUudHJhbnNpdGlvblBhcmFsbGVsTm9kZSA9IGZ1bmN0aW9uIChzdGF0ZVZhbHVlLCBzdGF0ZSwgX2V2ZW50KSB7XG4gICAgdmFyIGVfMiwgX2E7XG5cbiAgICB2YXIgdHJhbnNpdGlvbk1hcCA9IHt9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9iID0gX192YWx1ZXMoT2JqZWN0LmtleXMoc3RhdGVWYWx1ZSkpLCBfYyA9IF9iLm5leHQoKTsgIV9jLmRvbmU7IF9jID0gX2IubmV4dCgpKSB7XG4gICAgICAgIHZhciBzdWJTdGF0ZUtleSA9IF9jLnZhbHVlO1xuICAgICAgICB2YXIgc3ViU3RhdGVWYWx1ZSA9IHN0YXRlVmFsdWVbc3ViU3RhdGVLZXldO1xuXG4gICAgICAgIGlmICghc3ViU3RhdGVWYWx1ZSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHN1YlN0YXRlTm9kZSA9IHRoaXMuZ2V0U3RhdGVOb2RlKHN1YlN0YXRlS2V5KTtcblxuICAgICAgICB2YXIgbmV4dCA9IHN1YlN0YXRlTm9kZS5fdHJhbnNpdGlvbihzdWJTdGF0ZVZhbHVlLCBzdGF0ZSwgX2V2ZW50KTtcblxuICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgIHRyYW5zaXRpb25NYXBbc3ViU3RhdGVLZXldID0gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfMl8xKSB7XG4gICAgICBlXzIgPSB7XG4gICAgICAgIGVycm9yOiBlXzJfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKF9jICYmICFfYy5kb25lICYmIChfYSA9IF9iLnJldHVybikpIF9hLmNhbGwoX2IpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfMikgdGhyb3cgZV8yLmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBzdGF0ZVRyYW5zaXRpb25zID0gT2JqZWN0LmtleXModHJhbnNpdGlvbk1hcCkubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHJldHVybiB0cmFuc2l0aW9uTWFwW2tleV07XG4gICAgfSk7XG4gICAgdmFyIGVuYWJsZWRUcmFuc2l0aW9ucyA9IGZsYXR0ZW4oc3RhdGVUcmFuc2l0aW9ucy5tYXAoZnVuY3Rpb24gKHN0KSB7XG4gICAgICByZXR1cm4gc3QudHJhbnNpdGlvbnM7XG4gICAgfSkpO1xuICAgIHZhciB3aWxsVHJhbnNpdGlvbiA9IHN0YXRlVHJhbnNpdGlvbnMuc29tZShmdW5jdGlvbiAoc3QpIHtcbiAgICAgIHJldHVybiBzdC50cmFuc2l0aW9ucy5sZW5ndGggPiAwO1xuICAgIH0pO1xuXG4gICAgaWYgKCF3aWxsVHJhbnNpdGlvbikge1xuICAgICAgcmV0dXJuIHRoaXMubmV4dChzdGF0ZSwgX2V2ZW50KTtcbiAgICB9XG5cbiAgICB2YXIgY29uZmlndXJhdGlvbiA9IGZsYXR0ZW4oT2JqZWN0LmtleXModHJhbnNpdGlvbk1hcCkubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHJldHVybiB0cmFuc2l0aW9uTWFwW2tleV0uY29uZmlndXJhdGlvbjtcbiAgICB9KSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRyYW5zaXRpb25zOiBlbmFibGVkVHJhbnNpdGlvbnMsXG4gICAgICBleGl0U2V0OiBmbGF0dGVuKHN0YXRlVHJhbnNpdGlvbnMubWFwKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHJldHVybiB0LmV4aXRTZXQ7XG4gICAgICB9KSksXG4gICAgICBjb25maWd1cmF0aW9uOiBjb25maWd1cmF0aW9uLFxuICAgICAgc291cmNlOiBzdGF0ZSxcbiAgICAgIGFjdGlvbnM6IGZsYXR0ZW4oT2JqZWN0LmtleXModHJhbnNpdGlvbk1hcCkubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRyYW5zaXRpb25NYXBba2V5XS5hY3Rpb25zO1xuICAgICAgfSkpXG4gICAgfTtcbiAgfTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLl90cmFuc2l0aW9uID0gZnVuY3Rpb24gKHN0YXRlVmFsdWUsIHN0YXRlLCBfZXZlbnQpIHtcbiAgICAvLyBsZWFmIG5vZGVcbiAgICBpZiAoaXNTdHJpbmcoc3RhdGVWYWx1ZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnRyYW5zaXRpb25MZWFmTm9kZShzdGF0ZVZhbHVlLCBzdGF0ZSwgX2V2ZW50KTtcbiAgICB9IC8vIGhpZXJhcmNoaWNhbCBub2RlXG5cblxuICAgIGlmIChPYmplY3Qua2V5cyhzdGF0ZVZhbHVlKS5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiB0aGlzLnRyYW5zaXRpb25Db21wb3VuZE5vZGUoc3RhdGVWYWx1ZSwgc3RhdGUsIF9ldmVudCk7XG4gICAgfSAvLyBvcnRob2dvbmFsIG5vZGVcblxuXG4gICAgcmV0dXJuIHRoaXMudHJhbnNpdGlvblBhcmFsbGVsTm9kZShzdGF0ZVZhbHVlLCBzdGF0ZSwgX2V2ZW50KTtcbiAgfTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldFRyYW5zaXRpb25EYXRhID0gZnVuY3Rpb24gKHN0YXRlLCBldmVudCkge1xuICAgIHJldHVybiB0aGlzLl90cmFuc2l0aW9uKHN0YXRlLnZhbHVlLCBzdGF0ZSwgdG9TQ1hNTEV2ZW50KGV2ZW50KSk7XG4gIH07XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKHN0YXRlLCBfZXZlbnQpIHtcbiAgICB2YXIgZV8zLCBfYTtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgZXZlbnROYW1lID0gX2V2ZW50Lm5hbWU7XG4gICAgdmFyIGFjdGlvbnMgPSBbXTtcbiAgICB2YXIgbmV4dFN0YXRlTm9kZXMgPSBbXTtcbiAgICB2YXIgc2VsZWN0ZWRUcmFuc2l0aW9uO1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9iID0gX192YWx1ZXModGhpcy5nZXRDYW5kaWRhdGVzKGV2ZW50TmFtZSkpLCBfYyA9IF9iLm5leHQoKTsgIV9jLmRvbmU7IF9jID0gX2IubmV4dCgpKSB7XG4gICAgICAgIHZhciBjYW5kaWRhdGUgPSBfYy52YWx1ZTtcbiAgICAgICAgdmFyIGNvbmQgPSBjYW5kaWRhdGUuY29uZCxcbiAgICAgICAgICAgIHN0YXRlSW4gPSBjYW5kaWRhdGUuaW47XG4gICAgICAgIHZhciByZXNvbHZlZENvbnRleHQgPSBzdGF0ZS5jb250ZXh0O1xuICAgICAgICB2YXIgaXNJblN0YXRlID0gc3RhdGVJbiA/IGlzU3RyaW5nKHN0YXRlSW4pICYmIGlzU3RhdGVJZChzdGF0ZUluKSA/IC8vIENoZWNrIGlmIGluIHN0YXRlIGJ5IElEXG4gICAgICAgIHN0YXRlLm1hdGNoZXModG9TdGF0ZVZhbHVlKHRoaXMuZ2V0U3RhdGVOb2RlQnlJZChzdGF0ZUluKS5wYXRoLCB0aGlzLmRlbGltaXRlcikpIDogLy8gQ2hlY2sgaWYgaW4gc3RhdGUgYnkgcmVsYXRpdmUgZ3JhbmRwYXJlbnRcbiAgICAgICAgbWF0Y2hlc1N0YXRlKHRvU3RhdGVWYWx1ZShzdGF0ZUluLCB0aGlzLmRlbGltaXRlciksIHBhdGgodGhpcy5wYXRoLnNsaWNlKDAsIC0yKSkoc3RhdGUudmFsdWUpKSA6IHRydWU7XG4gICAgICAgIHZhciBndWFyZFBhc3NlZCA9IGZhbHNlO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZ3VhcmRQYXNzZWQgPSAhY29uZCB8fCBldmFsdWF0ZUd1YXJkKHRoaXMubWFjaGluZSwgY29uZCwgcmVzb2x2ZWRDb250ZXh0LCBfZXZlbnQsIHN0YXRlKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5hYmxlIHRvIGV2YWx1YXRlIGd1YXJkICdcIi5jb25jYXQoY29uZC5uYW1lIHx8IGNvbmQudHlwZSwgXCInIGluIHRyYW5zaXRpb24gZm9yIGV2ZW50ICdcIikuY29uY2F0KGV2ZW50TmFtZSwgXCInIGluIHN0YXRlIG5vZGUgJ1wiKS5jb25jYXQodGhpcy5pZCwgXCInOlxcblwiKS5jb25jYXQoZXJyLm1lc3NhZ2UpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChndWFyZFBhc3NlZCAmJiBpc0luU3RhdGUpIHtcbiAgICAgICAgICBpZiAoY2FuZGlkYXRlLnRhcmdldCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBuZXh0U3RhdGVOb2RlcyA9IGNhbmRpZGF0ZS50YXJnZXQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYWN0aW9ucy5wdXNoLmFwcGx5KGFjdGlvbnMsIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChjYW5kaWRhdGUuYWN0aW9ucyksIGZhbHNlKSk7XG4gICAgICAgICAgc2VsZWN0ZWRUcmFuc2l0aW9uID0gY2FuZGlkYXRlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV8zXzEpIHtcbiAgICAgIGVfMyA9IHtcbiAgICAgICAgZXJyb3I6IGVfM18xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoX2MgJiYgIV9jLmRvbmUgJiYgKF9hID0gX2IucmV0dXJuKSkgX2EuY2FsbChfYik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV8zKSB0aHJvdyBlXzMuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFzZWxlY3RlZFRyYW5zaXRpb24pIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKCFuZXh0U3RhdGVOb2Rlcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRyYW5zaXRpb25zOiBbc2VsZWN0ZWRUcmFuc2l0aW9uXSxcbiAgICAgICAgZXhpdFNldDogW10sXG4gICAgICAgIGNvbmZpZ3VyYXRpb246IHN0YXRlLnZhbHVlID8gW3RoaXNdIDogW10sXG4gICAgICAgIHNvdXJjZTogc3RhdGUsXG4gICAgICAgIGFjdGlvbnM6IGFjdGlvbnNcbiAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIGFsbE5leHRTdGF0ZU5vZGVzID0gZmxhdHRlbihuZXh0U3RhdGVOb2Rlcy5tYXAoZnVuY3Rpb24gKHN0YXRlTm9kZSkge1xuICAgICAgcmV0dXJuIF90aGlzLmdldFJlbGF0aXZlU3RhdGVOb2RlcyhzdGF0ZU5vZGUsIHN0YXRlLmhpc3RvcnlWYWx1ZSk7XG4gICAgfSkpO1xuICAgIHZhciBpc0ludGVybmFsID0gISFzZWxlY3RlZFRyYW5zaXRpb24uaW50ZXJuYWw7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRyYW5zaXRpb25zOiBbc2VsZWN0ZWRUcmFuc2l0aW9uXSxcbiAgICAgIGV4aXRTZXQ6IGlzSW50ZXJuYWwgPyBbXSA6IGZsYXR0ZW4obmV4dFN0YXRlTm9kZXMubWFwKGZ1bmN0aW9uICh0YXJnZXROb2RlKSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5nZXRQb3RlbnRpYWxseVJlZW50ZXJpbmdOb2Rlcyh0YXJnZXROb2RlKTtcbiAgICAgIH0pKSxcbiAgICAgIGNvbmZpZ3VyYXRpb246IGFsbE5leHRTdGF0ZU5vZGVzLFxuICAgICAgc291cmNlOiBzdGF0ZSxcbiAgICAgIGFjdGlvbnM6IGFjdGlvbnNcbiAgICB9O1xuICB9OyAvLyBldmVuIHRob3VnaCB0aGUgbmFtZSBvZiB0aGlzIGZ1bmN0aW9uIG1lbnRpb25zIHJlZW50cnkgbm9kZXNcbiAgLy8gd2UgYXJlIHB1c2hpbmcgaXRzIHJlc3VsdCBpbnRvIGBleGl0U2V0YFxuICAvLyB0aGF0J3MgYmVjYXVzZSB3aGF0IHdlIGV4aXQgbWlnaHQgYmUgcmVlbnRlcmVkIChpdCdzIGFuIGludmFyaWFudCBvZiByZWVudHJhbmN5KVxuXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5nZXRQb3RlbnRpYWxseVJlZW50ZXJpbmdOb2RlcyA9IGZ1bmN0aW9uICh0YXJnZXROb2RlKSB7XG4gICAgaWYgKHRoaXMub3JkZXIgPCB0YXJnZXROb2RlLm9yZGVyKSB7XG4gICAgICByZXR1cm4gW3RoaXNdO1xuICAgIH1cblxuICAgIHZhciBub2RlcyA9IFtdO1xuICAgIHZhciBtYXJrZXIgPSB0aGlzO1xuICAgIHZhciBwb3NzaWJsZUFuY2VzdG9yID0gdGFyZ2V0Tm9kZTtcblxuICAgIHdoaWxlIChtYXJrZXIgJiYgbWFya2VyICE9PSBwb3NzaWJsZUFuY2VzdG9yKSB7XG4gICAgICBub2Rlcy5wdXNoKG1hcmtlcik7XG4gICAgICBtYXJrZXIgPSBtYXJrZXIucGFyZW50O1xuICAgIH1cblxuICAgIGlmIChtYXJrZXIgIT09IHBvc3NpYmxlQW5jZXN0b3IpIHtcbiAgICAgIC8vIHdlIG5ldmVyIGdvdCB0byBgcG9zc2libGVBbmNlc3RvcmAsIHRoZXJlZm9yZSB0aGUgaW5pdGlhbCBgbWFya2VyYCBcImVzY2FwZXNcIiBpdFxuICAgICAgLy8gaXQncyBpbiBhIGRpZmZlcmVudCBwYXJ0IG9mIHRoZSB0cmVlIHNvIG5vIHN0YXRlcyB3aWxsIGJlIHJlZW50ZXJlZCBmb3Igc3VjaCBhbiBleHRlcm5hbCB0cmFuc2l0aW9uXG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgbm9kZXMucHVzaChwb3NzaWJsZUFuY2VzdG9yKTtcbiAgICByZXR1cm4gbm9kZXM7XG4gIH07XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5nZXRBY3Rpb25zID0gZnVuY3Rpb24gKHJlc29sdmVkQ29uZmlnLCBpc0RvbmUsIHRyYW5zaXRpb24sIGN1cnJlbnRDb250ZXh0LCBfZXZlbnQsIHByZXZTdGF0ZSwgcHJlZGljdGFibGVFeGVjKSB7XG4gICAgdmFyIGVfNCwgX2EsIGVfNSwgX2I7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIHByZXZDb25maWcgPSBwcmV2U3RhdGUgPyBnZXRDb25maWd1cmF0aW9uKFtdLCB0aGlzLmdldFN0YXRlTm9kZXMocHJldlN0YXRlLnZhbHVlKSkgOiBbXTtcbiAgICB2YXIgZW50cnlTZXQgPSBuZXcgU2V0KCk7XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2MgPSBfX3ZhbHVlcyhBcnJheS5mcm9tKHJlc29sdmVkQ29uZmlnKS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIHJldHVybiBhLm9yZGVyIC0gYi5vcmRlcjtcbiAgICAgIH0pKSwgX2QgPSBfYy5uZXh0KCk7ICFfZC5kb25lOyBfZCA9IF9jLm5leHQoKSkge1xuICAgICAgICB2YXIgc24gPSBfZC52YWx1ZTtcblxuICAgICAgICBpZiAoIWhhcyhwcmV2Q29uZmlnLCBzbikgfHwgaGFzKHRyYW5zaXRpb24uZXhpdFNldCwgc24pIHx8IHNuLnBhcmVudCAmJiBlbnRyeVNldC5oYXMoc24ucGFyZW50KSkge1xuICAgICAgICAgIGVudHJ5U2V0LmFkZChzbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzRfMSkge1xuICAgICAgZV80ID0ge1xuICAgICAgICBlcnJvcjogZV80XzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfZCAmJiAhX2QuZG9uZSAmJiAoX2EgPSBfYy5yZXR1cm4pKSBfYS5jYWxsKF9jKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzQpIHRocm93IGVfNC5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgcHJldkNvbmZpZ18xID0gX192YWx1ZXMocHJldkNvbmZpZyksIHByZXZDb25maWdfMV8xID0gcHJldkNvbmZpZ18xLm5leHQoKTsgIXByZXZDb25maWdfMV8xLmRvbmU7IHByZXZDb25maWdfMV8xID0gcHJldkNvbmZpZ18xLm5leHQoKSkge1xuICAgICAgICB2YXIgc24gPSBwcmV2Q29uZmlnXzFfMS52YWx1ZTtcblxuICAgICAgICBpZiAoIWhhcyhyZXNvbHZlZENvbmZpZywgc24pIHx8IGhhcyh0cmFuc2l0aW9uLmV4aXRTZXQsIHNuLnBhcmVudCkpIHtcbiAgICAgICAgICB0cmFuc2l0aW9uLmV4aXRTZXQucHVzaChzbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzVfMSkge1xuICAgICAgZV81ID0ge1xuICAgICAgICBlcnJvcjogZV81XzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChwcmV2Q29uZmlnXzFfMSAmJiAhcHJldkNvbmZpZ18xXzEuZG9uZSAmJiAoX2IgPSBwcmV2Q29uZmlnXzEucmV0dXJuKSkgX2IuY2FsbChwcmV2Q29uZmlnXzEpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfNSkgdGhyb3cgZV81LmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRyYW5zaXRpb24uZXhpdFNldC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICByZXR1cm4gYi5vcmRlciAtIGEub3JkZXI7XG4gICAgfSk7XG4gICAgdmFyIGVudHJ5U3RhdGVzID0gQXJyYXkuZnJvbShlbnRyeVNldCkuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIGEub3JkZXIgLSBiLm9yZGVyO1xuICAgIH0pO1xuICAgIHZhciBleGl0U3RhdGVzID0gbmV3IFNldCh0cmFuc2l0aW9uLmV4aXRTZXQpO1xuICAgIHZhciBkb25lRXZlbnRzID0gZmxhdHRlbihlbnRyeVN0YXRlcy5tYXAoZnVuY3Rpb24gKHNuKSB7XG4gICAgICB2YXIgZXZlbnRzID0gW107XG5cbiAgICAgIGlmIChzbi50eXBlICE9PSAnZmluYWwnKSB7XG4gICAgICAgIHJldHVybiBldmVudHM7XG4gICAgICB9XG5cbiAgICAgIHZhciBwYXJlbnQgPSBzbi5wYXJlbnQ7XG5cbiAgICAgIGlmICghcGFyZW50LnBhcmVudCkge1xuICAgICAgICByZXR1cm4gZXZlbnRzO1xuICAgICAgfVxuXG4gICAgICBldmVudHMucHVzaChkb25lKHNuLmlkLCBzbi5kb25lRGF0YSksIC8vIFRPRE86IGRlcHJlY2F0ZSAtIGZpbmFsIHN0YXRlcyBzaG91bGQgbm90IGVtaXQgZG9uZSBldmVudHMgZm9yIHRoZWlyIG93biBzdGF0ZS5cbiAgICAgIGRvbmUocGFyZW50LmlkLCBzbi5kb25lRGF0YSA/IG1hcENvbnRleHQoc24uZG9uZURhdGEsIGN1cnJlbnRDb250ZXh0LCBfZXZlbnQpIDogdW5kZWZpbmVkKSk7XG4gICAgICB2YXIgZ3JhbmRwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuXG4gICAgICBpZiAoZ3JhbmRwYXJlbnQudHlwZSA9PT0gJ3BhcmFsbGVsJykge1xuICAgICAgICBpZiAoZ2V0Q2hpbGRyZW4oZ3JhbmRwYXJlbnQpLmV2ZXJ5KGZ1bmN0aW9uIChwYXJlbnROb2RlKSB7XG4gICAgICAgICAgcmV0dXJuIGlzSW5GaW5hbFN0YXRlKHRyYW5zaXRpb24uY29uZmlndXJhdGlvbiwgcGFyZW50Tm9kZSk7XG4gICAgICAgIH0pKSB7XG4gICAgICAgICAgZXZlbnRzLnB1c2goZG9uZShncmFuZHBhcmVudC5pZCkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBldmVudHM7XG4gICAgfSkpO1xuICAgIHZhciBlbnRyeUFjdGlvbnMgPSBlbnRyeVN0YXRlcy5tYXAoZnVuY3Rpb24gKHN0YXRlTm9kZSkge1xuICAgICAgdmFyIGVudHJ5QWN0aW9ucyA9IHN0YXRlTm9kZS5vbkVudHJ5O1xuICAgICAgdmFyIGludm9rZUFjdGlvbnMgPSBzdGF0ZU5vZGUuYWN0aXZpdGllcy5tYXAoZnVuY3Rpb24gKGFjdGl2aXR5KSB7XG4gICAgICAgIHJldHVybiBzdGFydChhY3Rpdml0eSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6ICdlbnRyeScsXG4gICAgICAgIGFjdGlvbnM6IHRvQWN0aW9uT2JqZWN0cyhwcmVkaWN0YWJsZUV4ZWMgPyBfX3NwcmVhZEFycmF5KF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChlbnRyeUFjdGlvbnMpLCBmYWxzZSksIF9fcmVhZChpbnZva2VBY3Rpb25zKSwgZmFsc2UpIDogX19zcHJlYWRBcnJheShfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoaW52b2tlQWN0aW9ucyksIGZhbHNlKSwgX19yZWFkKGVudHJ5QWN0aW9ucyksIGZhbHNlKSwgX3RoaXMubWFjaGluZS5vcHRpb25zLmFjdGlvbnMpXG4gICAgICB9O1xuICAgIH0pLmNvbmNhdCh7XG4gICAgICB0eXBlOiAnc3RhdGVfZG9uZScsXG4gICAgICBhY3Rpb25zOiBkb25lRXZlbnRzLm1hcChmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIHJhaXNlKGV2ZW50KTtcbiAgICAgIH0pXG4gICAgfSk7XG4gICAgdmFyIGV4aXRBY3Rpb25zID0gQXJyYXkuZnJvbShleGl0U3RhdGVzKS5tYXAoZnVuY3Rpb24gKHN0YXRlTm9kZSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogJ2V4aXQnLFxuICAgICAgICBhY3Rpb25zOiB0b0FjdGlvbk9iamVjdHMoX19zcHJlYWRBcnJheShfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoc3RhdGVOb2RlLm9uRXhpdCksIGZhbHNlKSwgX19yZWFkKHN0YXRlTm9kZS5hY3Rpdml0aWVzLm1hcChmdW5jdGlvbiAoYWN0aXZpdHkpIHtcbiAgICAgICAgICByZXR1cm4gc3RvcChhY3Rpdml0eSk7XG4gICAgICAgIH0pKSwgZmFsc2UpLCBfdGhpcy5tYWNoaW5lLm9wdGlvbnMuYWN0aW9ucylcbiAgICAgIH07XG4gICAgfSk7XG4gICAgdmFyIGFjdGlvbnMgPSBleGl0QWN0aW9ucy5jb25jYXQoe1xuICAgICAgdHlwZTogJ3RyYW5zaXRpb24nLFxuICAgICAgYWN0aW9uczogdG9BY3Rpb25PYmplY3RzKHRyYW5zaXRpb24uYWN0aW9ucywgdGhpcy5tYWNoaW5lLm9wdGlvbnMuYWN0aW9ucylcbiAgICB9KS5jb25jYXQoZW50cnlBY3Rpb25zKTtcblxuICAgIGlmIChpc0RvbmUpIHtcbiAgICAgIHZhciBzdG9wQWN0aW9ucyA9IHRvQWN0aW9uT2JqZWN0cyhmbGF0dGVuKF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChyZXNvbHZlZENvbmZpZyksIGZhbHNlKS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIHJldHVybiBiLm9yZGVyIC0gYS5vcmRlcjtcbiAgICAgIH0pLm1hcChmdW5jdGlvbiAoc3RhdGVOb2RlKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZU5vZGUub25FeGl0O1xuICAgICAgfSkpLCB0aGlzLm1hY2hpbmUub3B0aW9ucy5hY3Rpb25zKS5maWx0ZXIoZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgICByZXR1cm4gIWlzUmFpc2FibGVBY3Rpb24oYWN0aW9uKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGFjdGlvbnMuY29uY2F0KHtcbiAgICAgICAgdHlwZTogJ3N0b3AnLFxuICAgICAgICBhY3Rpb25zOiBzdG9wQWN0aW9uc1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFjdGlvbnM7XG4gIH07XG4gIC8qKlxyXG4gICAqIERldGVybWluZXMgdGhlIG5leHQgc3RhdGUgZ2l2ZW4gdGhlIGN1cnJlbnQgYHN0YXRlYCBhbmQgc2VudCBgZXZlbnRgLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHN0YXRlIFRoZSBjdXJyZW50IFN0YXRlIGluc3RhbmNlIG9yIHN0YXRlIHZhbHVlXHJcbiAgICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCB0aGF0IHdhcyBzZW50IGF0IHRoZSBjdXJyZW50IHN0YXRlXHJcbiAgICogQHBhcmFtIGNvbnRleHQgVGhlIGN1cnJlbnQgY29udGV4dCAoZXh0ZW5kZWQgc3RhdGUpIG9mIHRoZSBjdXJyZW50IHN0YXRlXHJcbiAgICovXG5cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLnRyYW5zaXRpb24gPSBmdW5jdGlvbiAoc3RhdGUsIGV2ZW50LCBjb250ZXh0LCBleGVjKSB7XG4gICAgaWYgKHN0YXRlID09PSB2b2lkIDApIHtcbiAgICAgIHN0YXRlID0gdGhpcy5pbml0aWFsU3RhdGU7XG4gICAgfVxuXG4gICAgdmFyIF9ldmVudCA9IHRvU0NYTUxFdmVudChldmVudCk7XG5cbiAgICB2YXIgY3VycmVudFN0YXRlO1xuXG4gICAgaWYgKHN0YXRlIGluc3RhbmNlb2YgU3RhdGUpIHtcbiAgICAgIGN1cnJlbnRTdGF0ZSA9IGNvbnRleHQgPT09IHVuZGVmaW5lZCA/IHN0YXRlIDogdGhpcy5yZXNvbHZlU3RhdGUoU3RhdGUuZnJvbShzdGF0ZSwgY29udGV4dCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcmVzb2x2ZWRTdGF0ZVZhbHVlID0gaXNTdHJpbmcoc3RhdGUpID8gdGhpcy5yZXNvbHZlKHBhdGhUb1N0YXRlVmFsdWUodGhpcy5nZXRSZXNvbHZlZFBhdGgoc3RhdGUpKSkgOiB0aGlzLnJlc29sdmUoc3RhdGUpO1xuICAgICAgdmFyIHJlc29sdmVkQ29udGV4dCA9IGNvbnRleHQgIT09IG51bGwgJiYgY29udGV4dCAhPT0gdm9pZCAwID8gY29udGV4dCA6IHRoaXMubWFjaGluZS5jb250ZXh0O1xuICAgICAgY3VycmVudFN0YXRlID0gdGhpcy5yZXNvbHZlU3RhdGUoU3RhdGUuZnJvbShyZXNvbHZlZFN0YXRlVmFsdWUsIHJlc29sdmVkQ29udGV4dCkpO1xuICAgIH1cblxuICAgIGlmICghSVNfUFJPRFVDVElPTiAmJiBfZXZlbnQubmFtZSA9PT0gV0lMRENBUkQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkFuIGV2ZW50IGNhbm5vdCBoYXZlIHRoZSB3aWxkY2FyZCB0eXBlICgnXCIuY29uY2F0KFdJTERDQVJELCBcIicpXCIpKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zdHJpY3QpIHtcbiAgICAgIGlmICghdGhpcy5ldmVudHMuaW5jbHVkZXMoX2V2ZW50Lm5hbWUpICYmICFpc0J1aWx0SW5FdmVudChfZXZlbnQubmFtZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWFjaGluZSAnXCIuY29uY2F0KHRoaXMuaWQsIFwiJyBkb2VzIG5vdCBhY2NlcHQgZXZlbnQgJ1wiKS5jb25jYXQoX2V2ZW50Lm5hbWUsIFwiJ1wiKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHN0YXRlVHJhbnNpdGlvbiA9IHRoaXMuX3RyYW5zaXRpb24oY3VycmVudFN0YXRlLnZhbHVlLCBjdXJyZW50U3RhdGUsIF9ldmVudCkgfHwge1xuICAgICAgdHJhbnNpdGlvbnM6IFtdLFxuICAgICAgY29uZmlndXJhdGlvbjogW10sXG4gICAgICBleGl0U2V0OiBbXSxcbiAgICAgIHNvdXJjZTogY3VycmVudFN0YXRlLFxuICAgICAgYWN0aW9uczogW11cbiAgICB9O1xuICAgIHZhciBwcmV2Q29uZmlnID0gZ2V0Q29uZmlndXJhdGlvbihbXSwgdGhpcy5nZXRTdGF0ZU5vZGVzKGN1cnJlbnRTdGF0ZS52YWx1ZSkpO1xuICAgIHZhciByZXNvbHZlZENvbmZpZyA9IHN0YXRlVHJhbnNpdGlvbi5jb25maWd1cmF0aW9uLmxlbmd0aCA/IGdldENvbmZpZ3VyYXRpb24ocHJldkNvbmZpZywgc3RhdGVUcmFuc2l0aW9uLmNvbmZpZ3VyYXRpb24pIDogcHJldkNvbmZpZztcbiAgICBzdGF0ZVRyYW5zaXRpb24uY29uZmlndXJhdGlvbiA9IF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChyZXNvbHZlZENvbmZpZyksIGZhbHNlKTtcbiAgICByZXR1cm4gdGhpcy5yZXNvbHZlVHJhbnNpdGlvbihzdGF0ZVRyYW5zaXRpb24sIGN1cnJlbnRTdGF0ZSwgY3VycmVudFN0YXRlLmNvbnRleHQsIGV4ZWMsIF9ldmVudCk7XG4gIH07XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5yZXNvbHZlUmFpc2VkVHJhbnNpdGlvbiA9IGZ1bmN0aW9uIChzdGF0ZSwgX2V2ZW50LCBvcmlnaW5hbEV2ZW50LCBwcmVkaWN0YWJsZUV4ZWMpIHtcbiAgICB2YXIgX2E7XG5cbiAgICB2YXIgY3VycmVudEFjdGlvbnMgPSBzdGF0ZS5hY3Rpb25zO1xuICAgIHN0YXRlID0gdGhpcy50cmFuc2l0aW9uKHN0YXRlLCBfZXZlbnQsIHVuZGVmaW5lZCwgcHJlZGljdGFibGVFeGVjKTsgLy8gU2F2ZSBvcmlnaW5hbCBldmVudCB0byBzdGF0ZVxuICAgIC8vIFRPRE86IHRoaXMgc2hvdWxkIGJlIHRoZSByYWlzZWQgZXZlbnQhIERlbGV0ZSBpbiBWNSAoYnJlYWtpbmcpXG5cbiAgICBzdGF0ZS5fZXZlbnQgPSBvcmlnaW5hbEV2ZW50O1xuICAgIHN0YXRlLmV2ZW50ID0gb3JpZ2luYWxFdmVudC5kYXRhO1xuXG4gICAgKF9hID0gc3RhdGUuYWN0aW9ucykudW5zaGlmdC5hcHBseShfYSwgX19zcHJlYWRBcnJheShbXSwgX19yZWFkKGN1cnJlbnRBY3Rpb25zKSwgZmFsc2UpKTtcblxuICAgIHJldHVybiBzdGF0ZTtcbiAgfTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLnJlc29sdmVUcmFuc2l0aW9uID0gZnVuY3Rpb24gKHN0YXRlVHJhbnNpdGlvbiwgY3VycmVudFN0YXRlLCBjb250ZXh0LCBwcmVkaWN0YWJsZUV4ZWMsIF9ldmVudCkge1xuICAgIHZhciBlXzYsIF9hLCBlXzcsIF9iO1xuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmIChfZXZlbnQgPT09IHZvaWQgMCkge1xuICAgICAgX2V2ZW50ID0gaW5pdEV2ZW50O1xuICAgIH1cblxuICAgIHZhciBjb25maWd1cmF0aW9uID0gc3RhdGVUcmFuc2l0aW9uLmNvbmZpZ3VyYXRpb247IC8vIFRyYW5zaXRpb24gd2lsbCBcImFwcGx5XCIgaWY6XG4gICAgLy8gLSB0aGlzIGlzIHRoZSBpbml0aWFsIHN0YXRlICh0aGVyZSBpcyBubyBjdXJyZW50IHN0YXRlKVxuICAgIC8vIC0gT1IgdGhlcmUgYXJlIHRyYW5zaXRpb25zXG5cbiAgICB2YXIgd2lsbFRyYW5zaXRpb24gPSAhY3VycmVudFN0YXRlIHx8IHN0YXRlVHJhbnNpdGlvbi50cmFuc2l0aW9ucy5sZW5ndGggPiAwO1xuICAgIHZhciByZXNvbHZlZENvbmZpZ3VyYXRpb24gPSB3aWxsVHJhbnNpdGlvbiA/IHN0YXRlVHJhbnNpdGlvbi5jb25maWd1cmF0aW9uIDogY3VycmVudFN0YXRlID8gY3VycmVudFN0YXRlLmNvbmZpZ3VyYXRpb24gOiBbXTtcbiAgICB2YXIgaXNEb25lID0gaXNJbkZpbmFsU3RhdGUocmVzb2x2ZWRDb25maWd1cmF0aW9uLCB0aGlzKTtcbiAgICB2YXIgcmVzb2x2ZWRTdGF0ZVZhbHVlID0gd2lsbFRyYW5zaXRpb24gPyBnZXRWYWx1ZSh0aGlzLm1hY2hpbmUsIGNvbmZpZ3VyYXRpb24pIDogdW5kZWZpbmVkO1xuICAgIHZhciBoaXN0b3J5VmFsdWUgPSBjdXJyZW50U3RhdGUgPyBjdXJyZW50U3RhdGUuaGlzdG9yeVZhbHVlID8gY3VycmVudFN0YXRlLmhpc3RvcnlWYWx1ZSA6IHN0YXRlVHJhbnNpdGlvbi5zb3VyY2UgPyB0aGlzLm1hY2hpbmUuaGlzdG9yeVZhbHVlKGN1cnJlbnRTdGF0ZS52YWx1ZSkgOiB1bmRlZmluZWQgOiB1bmRlZmluZWQ7XG4gICAgdmFyIGFjdGlvbkJsb2NrcyA9IHRoaXMuZ2V0QWN0aW9ucyhuZXcgU2V0KHJlc29sdmVkQ29uZmlndXJhdGlvbiksIGlzRG9uZSwgc3RhdGVUcmFuc2l0aW9uLCBjb250ZXh0LCBfZXZlbnQsIGN1cnJlbnRTdGF0ZSwgcHJlZGljdGFibGVFeGVjKTtcbiAgICB2YXIgYWN0aXZpdGllcyA9IGN1cnJlbnRTdGF0ZSA/IF9fYXNzaWduKHt9LCBjdXJyZW50U3RhdGUuYWN0aXZpdGllcykgOiB7fTtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBhY3Rpb25CbG9ja3NfMSA9IF9fdmFsdWVzKGFjdGlvbkJsb2NrcyksIGFjdGlvbkJsb2Nrc18xXzEgPSBhY3Rpb25CbG9ja3NfMS5uZXh0KCk7ICFhY3Rpb25CbG9ja3NfMV8xLmRvbmU7IGFjdGlvbkJsb2Nrc18xXzEgPSBhY3Rpb25CbG9ja3NfMS5uZXh0KCkpIHtcbiAgICAgICAgdmFyIGJsb2NrID0gYWN0aW9uQmxvY2tzXzFfMS52YWx1ZTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGZvciAodmFyIF9jID0gKGVfNyA9IHZvaWQgMCwgX192YWx1ZXMoYmxvY2suYWN0aW9ucykpLCBfZCA9IF9jLm5leHQoKTsgIV9kLmRvbmU7IF9kID0gX2MubmV4dCgpKSB7XG4gICAgICAgICAgICB2YXIgYWN0aW9uID0gX2QudmFsdWU7XG5cbiAgICAgICAgICAgIGlmIChhY3Rpb24udHlwZSA9PT0gc3RhcnQkMSkge1xuICAgICAgICAgICAgICBhY3Rpdml0aWVzW2FjdGlvbi5hY3Rpdml0eS5pZCB8fCBhY3Rpb24uYWN0aXZpdHkudHlwZV0gPSBhY3Rpb247XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFjdGlvbi50eXBlID09PSBzdG9wJDEpIHtcbiAgICAgICAgICAgICAgYWN0aXZpdGllc1thY3Rpb24uYWN0aXZpdHkuaWQgfHwgYWN0aW9uLmFjdGl2aXR5LnR5cGVdID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlXzdfMSkge1xuICAgICAgICAgIGVfNyA9IHtcbiAgICAgICAgICAgIGVycm9yOiBlXzdfMVxuICAgICAgICAgIH07XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChfZCAmJiAhX2QuZG9uZSAmJiAoX2IgPSBfYy5yZXR1cm4pKSBfYi5jYWxsKF9jKTtcbiAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgaWYgKGVfNykgdGhyb3cgZV83LmVycm9yO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfNl8xKSB7XG4gICAgICBlXzYgPSB7XG4gICAgICAgIGVycm9yOiBlXzZfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKGFjdGlvbkJsb2Nrc18xXzEgJiYgIWFjdGlvbkJsb2Nrc18xXzEuZG9uZSAmJiAoX2EgPSBhY3Rpb25CbG9ja3NfMS5yZXR1cm4pKSBfYS5jYWxsKGFjdGlvbkJsb2Nrc18xKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzYpIHRocm93IGVfNi5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgX2UgPSBfX3JlYWQocmVzb2x2ZUFjdGlvbnModGhpcywgY3VycmVudFN0YXRlLCBjb250ZXh0LCBfZXZlbnQsIGFjdGlvbkJsb2NrcywgcHJlZGljdGFibGVFeGVjLCB0aGlzLm1hY2hpbmUuY29uZmlnLnByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzIHx8IHRoaXMubWFjaGluZS5jb25maWcucHJlc2VydmVBY3Rpb25PcmRlciksIDIpLFxuICAgICAgICByZXNvbHZlZEFjdGlvbnMgPSBfZVswXSxcbiAgICAgICAgdXBkYXRlZENvbnRleHQgPSBfZVsxXTtcblxuICAgIHZhciBfZiA9IF9fcmVhZChwYXJ0aXRpb24ocmVzb2x2ZWRBY3Rpb25zLCBpc1JhaXNhYmxlQWN0aW9uKSwgMiksXG4gICAgICAgIHJhaXNlZEV2ZW50cyA9IF9mWzBdLFxuICAgICAgICBub25SYWlzZWRBY3Rpb25zID0gX2ZbMV07XG5cbiAgICB2YXIgaW52b2tlQWN0aW9ucyA9IHJlc29sdmVkQWN0aW9ucy5maWx0ZXIoZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgdmFyIF9hO1xuXG4gICAgICByZXR1cm4gYWN0aW9uLnR5cGUgPT09IHN0YXJ0JDEgJiYgKChfYSA9IGFjdGlvbi5hY3Rpdml0eSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnR5cGUpID09PSBpbnZva2U7XG4gICAgfSk7XG4gICAgdmFyIGNoaWxkcmVuID0gaW52b2tlQWN0aW9ucy5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgYWN0aW9uKSB7XG4gICAgICBhY2NbYWN0aW9uLmFjdGl2aXR5LmlkXSA9IGNyZWF0ZUludm9jYWJsZUFjdG9yKGFjdGlvbi5hY3Rpdml0eSwgX3RoaXMubWFjaGluZSwgdXBkYXRlZENvbnRleHQsIF9ldmVudCk7XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIGN1cnJlbnRTdGF0ZSA/IF9fYXNzaWduKHt9LCBjdXJyZW50U3RhdGUuY2hpbGRyZW4pIDoge30pO1xuICAgIHZhciBuZXh0U3RhdGUgPSBuZXcgU3RhdGUoe1xuICAgICAgdmFsdWU6IHJlc29sdmVkU3RhdGVWYWx1ZSB8fCBjdXJyZW50U3RhdGUudmFsdWUsXG4gICAgICBjb250ZXh0OiB1cGRhdGVkQ29udGV4dCxcbiAgICAgIF9ldmVudDogX2V2ZW50LFxuICAgICAgLy8gUGVyc2lzdCBfc2Vzc2lvbmlkIGJldHdlZW4gc3RhdGVzXG4gICAgICBfc2Vzc2lvbmlkOiBjdXJyZW50U3RhdGUgPyBjdXJyZW50U3RhdGUuX3Nlc3Npb25pZCA6IG51bGwsXG4gICAgICBoaXN0b3J5VmFsdWU6IHJlc29sdmVkU3RhdGVWYWx1ZSA/IGhpc3RvcnlWYWx1ZSA/IHVwZGF0ZUhpc3RvcnlWYWx1ZShoaXN0b3J5VmFsdWUsIHJlc29sdmVkU3RhdGVWYWx1ZSkgOiB1bmRlZmluZWQgOiBjdXJyZW50U3RhdGUgPyBjdXJyZW50U3RhdGUuaGlzdG9yeVZhbHVlIDogdW5kZWZpbmVkLFxuICAgICAgaGlzdG9yeTogIXJlc29sdmVkU3RhdGVWYWx1ZSB8fCBzdGF0ZVRyYW5zaXRpb24uc291cmNlID8gY3VycmVudFN0YXRlIDogdW5kZWZpbmVkLFxuICAgICAgYWN0aW9uczogcmVzb2x2ZWRTdGF0ZVZhbHVlID8gbm9uUmFpc2VkQWN0aW9ucyA6IFtdLFxuICAgICAgYWN0aXZpdGllczogcmVzb2x2ZWRTdGF0ZVZhbHVlID8gYWN0aXZpdGllcyA6IGN1cnJlbnRTdGF0ZSA/IGN1cnJlbnRTdGF0ZS5hY3Rpdml0aWVzIDoge30sXG4gICAgICBldmVudHM6IFtdLFxuICAgICAgY29uZmlndXJhdGlvbjogcmVzb2x2ZWRDb25maWd1cmF0aW9uLFxuICAgICAgdHJhbnNpdGlvbnM6IHN0YXRlVHJhbnNpdGlvbi50cmFuc2l0aW9ucyxcbiAgICAgIGNoaWxkcmVuOiBjaGlsZHJlbixcbiAgICAgIGRvbmU6IGlzRG9uZSxcbiAgICAgIHRhZ3M6IGdldFRhZ3NGcm9tQ29uZmlndXJhdGlvbihyZXNvbHZlZENvbmZpZ3VyYXRpb24pLFxuICAgICAgbWFjaGluZTogdGhpc1xuICAgIH0pO1xuICAgIHZhciBkaWRVcGRhdGVDb250ZXh0ID0gY29udGV4dCAhPT0gdXBkYXRlZENvbnRleHQ7XG4gICAgbmV4dFN0YXRlLmNoYW5nZWQgPSBfZXZlbnQubmFtZSA9PT0gdXBkYXRlIHx8IGRpZFVwZGF0ZUNvbnRleHQ7IC8vIERpc3Bvc2Ugb2YgcGVudWx0aW1hdGUgaGlzdG9yaWVzIHRvIHByZXZlbnQgbWVtb3J5IGxlYWtzXG5cbiAgICB2YXIgaGlzdG9yeSA9IG5leHRTdGF0ZS5oaXN0b3J5O1xuXG4gICAgaWYgKGhpc3RvcnkpIHtcbiAgICAgIGRlbGV0ZSBoaXN0b3J5Lmhpc3Rvcnk7XG4gICAgfSAvLyBUaGVyZSBhcmUgdHJhbnNpZW50IHRyYW5zaXRpb25zIGlmIHRoZSBtYWNoaW5lIGlzIG5vdCBpbiBhIGZpbmFsIHN0YXRlXG4gICAgLy8gYW5kIGlmIHNvbWUgb2YgdGhlIHN0YXRlIG5vZGVzIGhhdmUgdHJhbnNpZW50IChcImFsd2F5c1wiKSB0cmFuc2l0aW9ucy5cblxuXG4gICAgdmFyIGhhc0Fsd2F5c1RyYW5zaXRpb25zID0gIWlzRG9uZSAmJiAodGhpcy5fdHJhbnNpZW50IHx8IGNvbmZpZ3VyYXRpb24uc29tZShmdW5jdGlvbiAoc3RhdGVOb2RlKSB7XG4gICAgICByZXR1cm4gc3RhdGVOb2RlLl90cmFuc2llbnQ7XG4gICAgfSkpOyAvLyBJZiB0aGVyZSBhcmUgbm8gZW5hYmxlZCB0cmFuc2l0aW9ucywgY2hlY2sgaWYgdGhlcmUgYXJlIHRyYW5zaWVudCB0cmFuc2l0aW9ucy5cbiAgICAvLyBJZiB0aGVyZSBhcmUgdHJhbnNpZW50IHRyYW5zaXRpb25zLCBjb250aW51ZSBjaGVja2luZyBmb3IgbW9yZSB0cmFuc2l0aW9uc1xuICAgIC8vIGJlY2F1c2UgYW4gdHJhbnNpZW50IHRyYW5zaXRpb24gc2hvdWxkIGJlIHRyaWdnZXJlZCBldmVuIGlmIHRoZXJlIGFyZSBub1xuICAgIC8vIGVuYWJsZWQgdHJhbnNpdGlvbnMuXG4gICAgLy9cbiAgICAvLyBJZiB3ZSdyZSBhbHJlYWR5IHdvcmtpbmcgb24gYW4gdHJhbnNpZW50IHRyYW5zaXRpb24gdGhlbiBzdG9wIHRvIHByZXZlbnQgYW4gaW5maW5pdGUgbG9vcC5cbiAgICAvL1xuICAgIC8vIE90aGVyd2lzZSwgaWYgdGhlcmUgYXJlIG5vIGVuYWJsZWQgbm9yIHRyYW5zaWVudCB0cmFuc2l0aW9ucywgd2UgYXJlIGRvbmUuXG5cbiAgICBpZiAoIXdpbGxUcmFuc2l0aW9uICYmICghaGFzQWx3YXlzVHJhbnNpdGlvbnMgfHwgX2V2ZW50Lm5hbWUgPT09IE5VTExfRVZFTlQpKSB7XG4gICAgICByZXR1cm4gbmV4dFN0YXRlO1xuICAgIH1cblxuICAgIHZhciBtYXliZU5leHRTdGF0ZSA9IG5leHRTdGF0ZTtcblxuICAgIGlmICghaXNEb25lKSB7XG4gICAgICBpZiAoaGFzQWx3YXlzVHJhbnNpdGlvbnMpIHtcbiAgICAgICAgbWF5YmVOZXh0U3RhdGUgPSB0aGlzLnJlc29sdmVSYWlzZWRUcmFuc2l0aW9uKG1heWJlTmV4dFN0YXRlLCB7XG4gICAgICAgICAgdHlwZTogbnVsbEV2ZW50XG4gICAgICAgIH0sIF9ldmVudCwgcHJlZGljdGFibGVFeGVjKTtcbiAgICAgIH1cblxuICAgICAgd2hpbGUgKHJhaXNlZEV2ZW50cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIHJhaXNlZEV2ZW50ID0gcmFpc2VkRXZlbnRzLnNoaWZ0KCk7XG4gICAgICAgIG1heWJlTmV4dFN0YXRlID0gdGhpcy5yZXNvbHZlUmFpc2VkVHJhbnNpdGlvbihtYXliZU5leHRTdGF0ZSwgcmFpc2VkRXZlbnQuX2V2ZW50LCBfZXZlbnQsIHByZWRpY3RhYmxlRXhlYyk7XG4gICAgICB9XG4gICAgfSAvLyBEZXRlY3QgaWYgc3RhdGUgY2hhbmdlZFxuXG5cbiAgICB2YXIgY2hhbmdlZCA9IG1heWJlTmV4dFN0YXRlLmNoYW5nZWQgfHwgKGhpc3RvcnkgPyAhIW1heWJlTmV4dFN0YXRlLmFjdGlvbnMubGVuZ3RoIHx8IGRpZFVwZGF0ZUNvbnRleHQgfHwgdHlwZW9mIGhpc3RvcnkudmFsdWUgIT09IHR5cGVvZiBtYXliZU5leHRTdGF0ZS52YWx1ZSB8fCAhc3RhdGVWYWx1ZXNFcXVhbChtYXliZU5leHRTdGF0ZS52YWx1ZSwgaGlzdG9yeS52YWx1ZSkgOiB1bmRlZmluZWQpO1xuICAgIG1heWJlTmV4dFN0YXRlLmNoYW5nZWQgPSBjaGFuZ2VkOyAvLyBQcmVzZXJ2ZSBvcmlnaW5hbCBoaXN0b3J5IGFmdGVyIHJhaXNlZCBldmVudHNcblxuICAgIG1heWJlTmV4dFN0YXRlLmhpc3RvcnkgPSBoaXN0b3J5O1xuICAgIHJldHVybiBtYXliZU5leHRTdGF0ZTtcbiAgfTtcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgY2hpbGQgc3RhdGUgbm9kZSBmcm9tIGl0cyByZWxhdGl2ZSBgc3RhdGVLZXlgLCBvciB0aHJvd3MuXHJcbiAgICovXG5cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldFN0YXRlTm9kZSA9IGZ1bmN0aW9uIChzdGF0ZUtleSkge1xuICAgIGlmIChpc1N0YXRlSWQoc3RhdGVLZXkpKSB7XG4gICAgICByZXR1cm4gdGhpcy5tYWNoaW5lLmdldFN0YXRlTm9kZUJ5SWQoc3RhdGVLZXkpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5zdGF0ZXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuYWJsZSB0byByZXRyaWV2ZSBjaGlsZCBzdGF0ZSAnXCIuY29uY2F0KHN0YXRlS2V5LCBcIicgZnJvbSAnXCIpLmNvbmNhdCh0aGlzLmlkLCBcIic7IG5vIGNoaWxkIHN0YXRlcyBleGlzdC5cIikpO1xuICAgIH1cblxuICAgIHZhciByZXN1bHQgPSB0aGlzLnN0YXRlc1tzdGF0ZUtleV07XG5cbiAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2hpbGQgc3RhdGUgJ1wiLmNvbmNhdChzdGF0ZUtleSwgXCInIGRvZXMgbm90IGV4aXN0IG9uICdcIikuY29uY2F0KHRoaXMuaWQsIFwiJ1wiKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgc3RhdGUgbm9kZSB3aXRoIHRoZSBnaXZlbiBgc3RhdGVJZGAsIG9yIHRocm93cy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBzdGF0ZUlkIFRoZSBzdGF0ZSBJRC4gVGhlIHByZWZpeCBcIiNcIiBpcyByZW1vdmVkLlxyXG4gICAqL1xuXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5nZXRTdGF0ZU5vZGVCeUlkID0gZnVuY3Rpb24gKHN0YXRlSWQpIHtcbiAgICB2YXIgcmVzb2x2ZWRTdGF0ZUlkID0gaXNTdGF0ZUlkKHN0YXRlSWQpID8gc3RhdGVJZC5zbGljZShTVEFURV9JREVOVElGSUVSLmxlbmd0aCkgOiBzdGF0ZUlkO1xuXG4gICAgaWYgKHJlc29sdmVkU3RhdGVJZCA9PT0gdGhpcy5pZCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdmFyIHN0YXRlTm9kZSA9IHRoaXMubWFjaGluZS5pZE1hcFtyZXNvbHZlZFN0YXRlSWRdO1xuXG4gICAgaWYgKCFzdGF0ZU5vZGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNoaWxkIHN0YXRlIG5vZGUgJyNcIi5jb25jYXQocmVzb2x2ZWRTdGF0ZUlkLCBcIicgZG9lcyBub3QgZXhpc3Qgb24gbWFjaGluZSAnXCIpLmNvbmNhdCh0aGlzLmlkLCBcIidcIikpO1xuICAgIH1cblxuICAgIHJldHVybiBzdGF0ZU5vZGU7XG4gIH07XG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIHJlbGF0aXZlIHN0YXRlIG5vZGUgZnJvbSB0aGUgZ2l2ZW4gYHN0YXRlUGF0aGAsIG9yIHRocm93cy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBzdGF0ZVBhdGggVGhlIHN0cmluZyBvciBzdHJpbmcgYXJyYXkgcmVsYXRpdmUgcGF0aCB0byB0aGUgc3RhdGUgbm9kZS5cclxuICAgKi9cblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZ2V0U3RhdGVOb2RlQnlQYXRoID0gZnVuY3Rpb24gKHN0YXRlUGF0aCkge1xuICAgIGlmICh0eXBlb2Ygc3RhdGVQYXRoID09PSAnc3RyaW5nJyAmJiBpc1N0YXRlSWQoc3RhdGVQYXRoKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RhdGVOb2RlQnlJZChzdGF0ZVBhdGguc2xpY2UoMSkpO1xuICAgICAgfSBjYXRjaCAoZSkgey8vIHRyeSBpbmRpdmlkdWFsIHBhdGhzXG4gICAgICAgIC8vIHRocm93IGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGFycmF5U3RhdGVQYXRoID0gdG9TdGF0ZVBhdGgoc3RhdGVQYXRoLCB0aGlzLmRlbGltaXRlcikuc2xpY2UoKTtcbiAgICB2YXIgY3VycmVudFN0YXRlTm9kZSA9IHRoaXM7XG5cbiAgICB3aGlsZSAoYXJyYXlTdGF0ZVBhdGgubGVuZ3RoKSB7XG4gICAgICB2YXIga2V5ID0gYXJyYXlTdGF0ZVBhdGguc2hpZnQoKTtcblxuICAgICAgaWYgKCFrZXkubGVuZ3RoKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBjdXJyZW50U3RhdGVOb2RlID0gY3VycmVudFN0YXRlTm9kZS5nZXRTdGF0ZU5vZGUoa2V5KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY3VycmVudFN0YXRlTm9kZTtcbiAgfTtcbiAgLyoqXHJcbiAgICogUmVzb2x2ZXMgYSBwYXJ0aWFsIHN0YXRlIHZhbHVlIHdpdGggaXRzIGZ1bGwgcmVwcmVzZW50YXRpb24gaW4gdGhpcyBtYWNoaW5lLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHN0YXRlVmFsdWUgVGhlIHBhcnRpYWwgc3RhdGUgdmFsdWUgdG8gcmVzb2x2ZS5cclxuICAgKi9cblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUucmVzb2x2ZSA9IGZ1bmN0aW9uIChzdGF0ZVZhbHVlKSB7XG4gICAgdmFyIF9hO1xuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmICghc3RhdGVWYWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMuaW5pdGlhbFN0YXRlVmFsdWUgfHwgRU1QVFlfT0JKRUNUOyAvLyBUT0RPOiB0eXBlLXNwZWNpZmljIHByb3BlcnRpZXNcbiAgICB9XG5cbiAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgY2FzZSAncGFyYWxsZWwnOlxuICAgICAgICByZXR1cm4gbWFwVmFsdWVzKHRoaXMuaW5pdGlhbFN0YXRlVmFsdWUsIGZ1bmN0aW9uIChzdWJTdGF0ZVZhbHVlLCBzdWJTdGF0ZUtleSkge1xuICAgICAgICAgIHJldHVybiBzdWJTdGF0ZVZhbHVlID8gX3RoaXMuZ2V0U3RhdGVOb2RlKHN1YlN0YXRlS2V5KS5yZXNvbHZlKHN0YXRlVmFsdWVbc3ViU3RhdGVLZXldIHx8IHN1YlN0YXRlVmFsdWUpIDogRU1QVFlfT0JKRUNUO1xuICAgICAgICB9KTtcblxuICAgICAgY2FzZSAnY29tcG91bmQnOlxuICAgICAgICBpZiAoaXNTdHJpbmcoc3RhdGVWYWx1ZSkpIHtcbiAgICAgICAgICB2YXIgc3ViU3RhdGVOb2RlID0gdGhpcy5nZXRTdGF0ZU5vZGUoc3RhdGVWYWx1ZSk7XG5cbiAgICAgICAgICBpZiAoc3ViU3RhdGVOb2RlLnR5cGUgPT09ICdwYXJhbGxlbCcgfHwgc3ViU3RhdGVOb2RlLnR5cGUgPT09ICdjb21wb3VuZCcpIHtcbiAgICAgICAgICAgIHJldHVybiBfYSA9IHt9LCBfYVtzdGF0ZVZhbHVlXSA9IHN1YlN0YXRlTm9kZS5pbml0aWFsU3RhdGVWYWx1ZSwgX2E7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHN0YXRlVmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIU9iamVjdC5rZXlzKHN0YXRlVmFsdWUpLmxlbmd0aCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmluaXRpYWxTdGF0ZVZhbHVlIHx8IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1hcFZhbHVlcyhzdGF0ZVZhbHVlLCBmdW5jdGlvbiAoc3ViU3RhdGVWYWx1ZSwgc3ViU3RhdGVLZXkpIHtcbiAgICAgICAgICByZXR1cm4gc3ViU3RhdGVWYWx1ZSA/IF90aGlzLmdldFN0YXRlTm9kZShzdWJTdGF0ZUtleSkucmVzb2x2ZShzdWJTdGF0ZVZhbHVlKSA6IEVNUFRZX09CSkVDVDtcbiAgICAgICAgfSk7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBzdGF0ZVZhbHVlIHx8IEVNUFRZX09CSkVDVDtcbiAgICB9XG4gIH07XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5nZXRSZXNvbHZlZFBhdGggPSBmdW5jdGlvbiAoc3RhdGVJZGVudGlmaWVyKSB7XG4gICAgaWYgKGlzU3RhdGVJZChzdGF0ZUlkZW50aWZpZXIpKSB7XG4gICAgICB2YXIgc3RhdGVOb2RlID0gdGhpcy5tYWNoaW5lLmlkTWFwW3N0YXRlSWRlbnRpZmllci5zbGljZShTVEFURV9JREVOVElGSUVSLmxlbmd0aCldO1xuXG4gICAgICBpZiAoIXN0YXRlTm9kZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmFibGUgdG8gZmluZCBzdGF0ZSBub2RlICdcIi5jb25jYXQoc3RhdGVJZGVudGlmaWVyLCBcIidcIikpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RhdGVOb2RlLnBhdGg7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRvU3RhdGVQYXRoKHN0YXRlSWRlbnRpZmllciwgdGhpcy5kZWxpbWl0ZXIpO1xuICB9O1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGF0ZU5vZGUucHJvdG90eXBlLCBcImluaXRpYWxTdGF0ZVZhbHVlXCIsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBfYTtcblxuICAgICAgaWYgKHRoaXMuX19jYWNoZS5pbml0aWFsU3RhdGVWYWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2NhY2hlLmluaXRpYWxTdGF0ZVZhbHVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgaW5pdGlhbFN0YXRlVmFsdWU7XG5cbiAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdwYXJhbGxlbCcpIHtcbiAgICAgICAgaW5pdGlhbFN0YXRlVmFsdWUgPSBtYXBGaWx0ZXJWYWx1ZXModGhpcy5zdGF0ZXMsIGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICAgIHJldHVybiBzdGF0ZS5pbml0aWFsU3RhdGVWYWx1ZSB8fCBFTVBUWV9PQkpFQ1Q7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChzdGF0ZU5vZGUpIHtcbiAgICAgICAgICByZXR1cm4gIShzdGF0ZU5vZGUudHlwZSA9PT0gJ2hpc3RvcnknKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaW5pdGlhbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZXNbdGhpcy5pbml0aWFsXSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkluaXRpYWwgc3RhdGUgJ1wiLmNvbmNhdCh0aGlzLmluaXRpYWwsIFwiJyBub3QgZm91bmQgb24gJ1wiKS5jb25jYXQodGhpcy5rZXksIFwiJ1wiKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0aWFsU3RhdGVWYWx1ZSA9IGlzTGVhZk5vZGUodGhpcy5zdGF0ZXNbdGhpcy5pbml0aWFsXSkgPyB0aGlzLmluaXRpYWwgOiAoX2EgPSB7fSwgX2FbdGhpcy5pbml0aWFsXSA9IHRoaXMuc3RhdGVzW3RoaXMuaW5pdGlhbF0uaW5pdGlhbFN0YXRlVmFsdWUsIF9hKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRoZSBmaW5pdGUgc3RhdGUgdmFsdWUgb2YgYSBtYWNoaW5lIHdpdGhvdXQgY2hpbGQgc3RhdGVzIGlzIGp1c3QgYW4gZW1wdHkgb2JqZWN0XG4gICAgICAgIGluaXRpYWxTdGF0ZVZhbHVlID0ge307XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX19jYWNoZS5pbml0aWFsU3RhdGVWYWx1ZSA9IGluaXRpYWxTdGF0ZVZhbHVlO1xuICAgICAgcmV0dXJuIHRoaXMuX19jYWNoZS5pbml0aWFsU3RhdGVWYWx1ZTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldEluaXRpYWxTdGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZVZhbHVlLCBjb250ZXh0KSB7XG4gICAgdGhpcy5faW5pdCgpOyAvLyBUT0RPOiB0aGlzIHNob3VsZCBiZSBpbiB0aGUgY29uc3RydWN0b3IgKHNlZSBub3RlIGluIGNvbnN0cnVjdG9yKVxuXG5cbiAgICB2YXIgY29uZmlndXJhdGlvbiA9IHRoaXMuZ2V0U3RhdGVOb2RlcyhzdGF0ZVZhbHVlKTtcbiAgICByZXR1cm4gdGhpcy5yZXNvbHZlVHJhbnNpdGlvbih7XG4gICAgICBjb25maWd1cmF0aW9uOiBjb25maWd1cmF0aW9uLFxuICAgICAgZXhpdFNldDogW10sXG4gICAgICB0cmFuc2l0aW9uczogW10sXG4gICAgICBzb3VyY2U6IHVuZGVmaW5lZCxcbiAgICAgIGFjdGlvbnM6IFtdXG4gICAgfSwgdW5kZWZpbmVkLCBjb250ZXh0ICE9PSBudWxsICYmIGNvbnRleHQgIT09IHZvaWQgMCA/IGNvbnRleHQgOiB0aGlzLm1hY2hpbmUuY29udGV4dCwgdW5kZWZpbmVkKTtcbiAgfTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RhdGVOb2RlLnByb3RvdHlwZSwgXCJpbml0aWFsU3RhdGVcIiwge1xuICAgIC8qKlxyXG4gICAgICogVGhlIGluaXRpYWwgU3RhdGUgaW5zdGFuY2UsIHdoaWNoIGluY2x1ZGVzIGFsbCBhY3Rpb25zIHRvIGJlIGV4ZWN1dGVkIGZyb21cclxuICAgICAqIGVudGVyaW5nIHRoZSBpbml0aWFsIHN0YXRlLlxyXG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgaW5pdGlhbFN0YXRlVmFsdWUgPSB0aGlzLmluaXRpYWxTdGF0ZVZhbHVlO1xuXG4gICAgICBpZiAoIWluaXRpYWxTdGF0ZVZhbHVlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCByZXRyaWV2ZSBpbml0aWFsIHN0YXRlIGZyb20gc2ltcGxlIHN0YXRlICdcIi5jb25jYXQodGhpcy5pZCwgXCInLlwiKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmdldEluaXRpYWxTdGF0ZShpbml0aWFsU3RhdGVWYWx1ZSk7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGF0ZU5vZGUucHJvdG90eXBlLCBcInRhcmdldFwiLCB7XG4gICAgLyoqXHJcbiAgICAgKiBUaGUgdGFyZ2V0IHN0YXRlIHZhbHVlIG9mIHRoZSBoaXN0b3J5IHN0YXRlIG5vZGUsIGlmIGl0IGV4aXN0cy4gVGhpcyByZXByZXNlbnRzIHRoZVxyXG4gICAgICogZGVmYXVsdCBzdGF0ZSB2YWx1ZSB0byB0cmFuc2l0aW9uIHRvIGlmIG5vIGhpc3RvcnkgdmFsdWUgZXhpc3RzIHlldC5cclxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHRhcmdldDtcblxuICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ2hpc3RvcnknKSB7XG4gICAgICAgIHZhciBoaXN0b3J5Q29uZmlnID0gdGhpcy5jb25maWc7XG5cbiAgICAgICAgaWYgKGlzU3RyaW5nKGhpc3RvcnlDb25maWcudGFyZ2V0KSkge1xuICAgICAgICAgIHRhcmdldCA9IGlzU3RhdGVJZChoaXN0b3J5Q29uZmlnLnRhcmdldCkgPyBwYXRoVG9TdGF0ZVZhbHVlKHRoaXMubWFjaGluZS5nZXRTdGF0ZU5vZGVCeUlkKGhpc3RvcnlDb25maWcudGFyZ2V0KS5wYXRoLnNsaWNlKHRoaXMucGF0aC5sZW5ndGggLSAxKSkgOiBoaXN0b3J5Q29uZmlnLnRhcmdldDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0YXJnZXQgPSBoaXN0b3J5Q29uZmlnLnRhcmdldDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBsZWFmIG5vZGVzIGZyb20gYSBzdGF0ZSBwYXRoIHJlbGF0aXZlIHRvIHRoaXMgc3RhdGUgbm9kZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSByZWxhdGl2ZVN0YXRlSWQgVGhlIHJlbGF0aXZlIHN0YXRlIHBhdGggdG8gcmV0cmlldmUgdGhlIHN0YXRlIG5vZGVzXHJcbiAgICogQHBhcmFtIGhpc3RvcnkgVGhlIHByZXZpb3VzIHN0YXRlIHRvIHJldHJpZXZlIGhpc3RvcnlcclxuICAgKiBAcGFyYW0gcmVzb2x2ZSBXaGV0aGVyIHN0YXRlIG5vZGVzIHNob3VsZCByZXNvbHZlIHRvIGluaXRpYWwgY2hpbGQgc3RhdGUgbm9kZXNcclxuICAgKi9cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldFJlbGF0aXZlU3RhdGVOb2RlcyA9IGZ1bmN0aW9uIChyZWxhdGl2ZVN0YXRlSWQsIGhpc3RvcnlWYWx1ZSwgcmVzb2x2ZSkge1xuICAgIGlmIChyZXNvbHZlID09PSB2b2lkIDApIHtcbiAgICAgIHJlc29sdmUgPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiByZXNvbHZlID8gcmVsYXRpdmVTdGF0ZUlkLnR5cGUgPT09ICdoaXN0b3J5JyA/IHJlbGF0aXZlU3RhdGVJZC5yZXNvbHZlSGlzdG9yeShoaXN0b3J5VmFsdWUpIDogcmVsYXRpdmVTdGF0ZUlkLmluaXRpYWxTdGF0ZU5vZGVzIDogW3JlbGF0aXZlU3RhdGVJZF07XG4gIH07XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0YXRlTm9kZS5wcm90b3R5cGUsIFwiaW5pdGlhbFN0YXRlTm9kZXNcIiwge1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgaWYgKGlzTGVhZk5vZGUodGhpcykpIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzXTtcbiAgICAgIH0gLy8gQ2FzZSB3aGVuIHN0YXRlIG5vZGUgaXMgY29tcG91bmQgYnV0IG5vIGluaXRpYWwgc3RhdGUgaXMgZGVmaW5lZFxuXG5cbiAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdjb21wb3VuZCcgJiYgIXRoaXMuaW5pdGlhbCkge1xuICAgICAgICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICAgICAgICB3YXJuKGZhbHNlLCBcIkNvbXBvdW5kIHN0YXRlIG5vZGUgJ1wiLmNvbmNhdCh0aGlzLmlkLCBcIicgaGFzIG5vIGluaXRpYWwgc3RhdGUuXCIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbdGhpc107XG4gICAgICB9XG5cbiAgICAgIHZhciBpbml0aWFsU3RhdGVOb2RlUGF0aHMgPSB0b1N0YXRlUGF0aHModGhpcy5pbml0aWFsU3RhdGVWYWx1ZSk7XG4gICAgICByZXR1cm4gZmxhdHRlbihpbml0aWFsU3RhdGVOb2RlUGF0aHMubWFwKGZ1bmN0aW9uIChpbml0aWFsUGF0aCkge1xuICAgICAgICByZXR1cm4gX3RoaXMuZ2V0RnJvbVJlbGF0aXZlUGF0aChpbml0aWFsUGF0aCk7XG4gICAgICB9KSk7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG4gIC8qKlxyXG4gICAqIFJldHJpZXZlcyBzdGF0ZSBub2RlcyBmcm9tIGEgcmVsYXRpdmUgcGF0aCB0byB0aGlzIHN0YXRlIG5vZGUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gcmVsYXRpdmVQYXRoIFRoZSByZWxhdGl2ZSBwYXRoIGZyb20gdGhpcyBzdGF0ZSBub2RlXHJcbiAgICogQHBhcmFtIGhpc3RvcnlWYWx1ZVxyXG4gICAqL1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZ2V0RnJvbVJlbGF0aXZlUGF0aCA9IGZ1bmN0aW9uIChyZWxhdGl2ZVBhdGgpIHtcbiAgICBpZiAoIXJlbGF0aXZlUGF0aC5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBbdGhpc107XG4gICAgfVxuXG4gICAgdmFyIF9hID0gX19yZWFkKHJlbGF0aXZlUGF0aCksXG4gICAgICAgIHN0YXRlS2V5ID0gX2FbMF0sXG4gICAgICAgIGNoaWxkU3RhdGVQYXRoID0gX2Euc2xpY2UoMSk7XG5cbiAgICBpZiAoIXRoaXMuc3RhdGVzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgcmV0cmlldmUgc3ViUGF0aCAnXCIuY29uY2F0KHN0YXRlS2V5LCBcIicgZnJvbSBub2RlIHdpdGggbm8gc3RhdGVzXCIpKTtcbiAgICB9XG5cbiAgICB2YXIgY2hpbGRTdGF0ZU5vZGUgPSB0aGlzLmdldFN0YXRlTm9kZShzdGF0ZUtleSk7XG5cbiAgICBpZiAoY2hpbGRTdGF0ZU5vZGUudHlwZSA9PT0gJ2hpc3RvcnknKSB7XG4gICAgICByZXR1cm4gY2hpbGRTdGF0ZU5vZGUucmVzb2x2ZUhpc3RvcnkoKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuc3RhdGVzW3N0YXRlS2V5XSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2hpbGQgc3RhdGUgJ1wiLmNvbmNhdChzdGF0ZUtleSwgXCInIGRvZXMgbm90IGV4aXN0IG9uICdcIikuY29uY2F0KHRoaXMuaWQsIFwiJ1wiKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc3RhdGVzW3N0YXRlS2V5XS5nZXRGcm9tUmVsYXRpdmVQYXRoKGNoaWxkU3RhdGVQYXRoKTtcbiAgfTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmhpc3RvcnlWYWx1ZSA9IGZ1bmN0aW9uIChyZWxhdGl2ZVN0YXRlVmFsdWUpIHtcbiAgICBpZiAoIU9iamVjdC5rZXlzKHRoaXMuc3RhdGVzKS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGN1cnJlbnQ6IHJlbGF0aXZlU3RhdGVWYWx1ZSB8fCB0aGlzLmluaXRpYWxTdGF0ZVZhbHVlLFxuICAgICAgc3RhdGVzOiBtYXBGaWx0ZXJWYWx1ZXModGhpcy5zdGF0ZXMsIGZ1bmN0aW9uIChzdGF0ZU5vZGUsIGtleSkge1xuICAgICAgICBpZiAoIXJlbGF0aXZlU3RhdGVWYWx1ZSkge1xuICAgICAgICAgIHJldHVybiBzdGF0ZU5vZGUuaGlzdG9yeVZhbHVlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3ViU3RhdGVWYWx1ZSA9IGlzU3RyaW5nKHJlbGF0aXZlU3RhdGVWYWx1ZSkgPyB1bmRlZmluZWQgOiByZWxhdGl2ZVN0YXRlVmFsdWVba2V5XTtcbiAgICAgICAgcmV0dXJuIHN0YXRlTm9kZS5oaXN0b3J5VmFsdWUoc3ViU3RhdGVWYWx1ZSB8fCBzdGF0ZU5vZGUuaW5pdGlhbFN0YXRlVmFsdWUpO1xuICAgICAgfSwgZnVuY3Rpb24gKHN0YXRlTm9kZSkge1xuICAgICAgICByZXR1cm4gIXN0YXRlTm9kZS5oaXN0b3J5O1xuICAgICAgfSlcbiAgICB9O1xuICB9O1xuICAvKipcclxuICAgKiBSZXNvbHZlcyB0byB0aGUgaGlzdG9yaWNhbCB2YWx1ZShzKSBvZiB0aGUgcGFyZW50IHN0YXRlIG5vZGUsXHJcbiAgICogcmVwcmVzZW50ZWQgYnkgc3RhdGUgbm9kZXMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gaGlzdG9yeVZhbHVlXHJcbiAgICovXG5cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLnJlc29sdmVIaXN0b3J5ID0gZnVuY3Rpb24gKGhpc3RvcnlWYWx1ZSkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAodGhpcy50eXBlICE9PSAnaGlzdG9yeScpIHtcbiAgICAgIHJldHVybiBbdGhpc107XG4gICAgfVxuXG4gICAgdmFyIHBhcmVudCA9IHRoaXMucGFyZW50O1xuXG4gICAgaWYgKCFoaXN0b3J5VmFsdWUpIHtcbiAgICAgIHZhciBoaXN0b3J5VGFyZ2V0ID0gdGhpcy50YXJnZXQ7XG4gICAgICByZXR1cm4gaGlzdG9yeVRhcmdldCA/IGZsYXR0ZW4odG9TdGF0ZVBhdGhzKGhpc3RvcnlUYXJnZXQpLm1hcChmdW5jdGlvbiAocmVsYXRpdmVDaGlsZFBhdGgpIHtcbiAgICAgICAgcmV0dXJuIHBhcmVudC5nZXRGcm9tUmVsYXRpdmVQYXRoKHJlbGF0aXZlQ2hpbGRQYXRoKTtcbiAgICAgIH0pKSA6IHBhcmVudC5pbml0aWFsU3RhdGVOb2RlcztcbiAgICB9XG5cbiAgICB2YXIgc3ViSGlzdG9yeVZhbHVlID0gbmVzdGVkUGF0aChwYXJlbnQucGF0aCwgJ3N0YXRlcycpKGhpc3RvcnlWYWx1ZSkuY3VycmVudDtcblxuICAgIGlmIChpc1N0cmluZyhzdWJIaXN0b3J5VmFsdWUpKSB7XG4gICAgICByZXR1cm4gW3BhcmVudC5nZXRTdGF0ZU5vZGUoc3ViSGlzdG9yeVZhbHVlKV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZsYXR0ZW4odG9TdGF0ZVBhdGhzKHN1Ykhpc3RvcnlWYWx1ZSkubWFwKGZ1bmN0aW9uIChzdWJTdGF0ZVBhdGgpIHtcbiAgICAgIHJldHVybiBfdGhpcy5oaXN0b3J5ID09PSAnZGVlcCcgPyBwYXJlbnQuZ2V0RnJvbVJlbGF0aXZlUGF0aChzdWJTdGF0ZVBhdGgpIDogW3BhcmVudC5zdGF0ZXNbc3ViU3RhdGVQYXRoWzBdXV07XG4gICAgfSkpO1xuICB9O1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGF0ZU5vZGUucHJvdG90eXBlLCBcInN0YXRlSWRzXCIsIHtcbiAgICAvKipcclxuICAgICAqIEFsbCB0aGUgc3RhdGUgbm9kZSBJRHMgb2YgdGhpcyBzdGF0ZSBub2RlIGFuZCBpdHMgZGVzY2VuZGFudCBzdGF0ZSBub2Rlcy5cclxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgdmFyIGNoaWxkU3RhdGVJZHMgPSBmbGF0dGVuKE9iamVjdC5rZXlzKHRoaXMuc3RhdGVzKS5tYXAoZnVuY3Rpb24gKHN0YXRlS2V5KSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5zdGF0ZXNbc3RhdGVLZXldLnN0YXRlSWRzO1xuICAgICAgfSkpO1xuICAgICAgcmV0dXJuIFt0aGlzLmlkXS5jb25jYXQoY2hpbGRTdGF0ZUlkcyk7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGF0ZU5vZGUucHJvdG90eXBlLCBcImV2ZW50c1wiLCB7XG4gICAgLyoqXHJcbiAgICAgKiBBbGwgdGhlIGV2ZW50IHR5cGVzIGFjY2VwdGVkIGJ5IHRoaXMgc3RhdGUgbm9kZSBhbmQgaXRzIGRlc2NlbmRhbnRzLlxyXG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgZV84LCBfYSwgZV85LCBfYjtcblxuICAgICAgaWYgKHRoaXMuX19jYWNoZS5ldmVudHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19jYWNoZS5ldmVudHM7XG4gICAgICB9XG5cbiAgICAgIHZhciBzdGF0ZXMgPSB0aGlzLnN0YXRlcztcbiAgICAgIHZhciBldmVudHMgPSBuZXcgU2V0KHRoaXMub3duRXZlbnRzKTtcblxuICAgICAgaWYgKHN0YXRlcykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZvciAodmFyIF9jID0gX192YWx1ZXMoT2JqZWN0LmtleXMoc3RhdGVzKSksIF9kID0gX2MubmV4dCgpOyAhX2QuZG9uZTsgX2QgPSBfYy5uZXh0KCkpIHtcbiAgICAgICAgICAgIHZhciBzdGF0ZUlkID0gX2QudmFsdWU7XG4gICAgICAgICAgICB2YXIgc3RhdGUgPSBzdGF0ZXNbc3RhdGVJZF07XG5cbiAgICAgICAgICAgIGlmIChzdGF0ZS5zdGF0ZXMpIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfZSA9IChlXzkgPSB2b2lkIDAsIF9fdmFsdWVzKHN0YXRlLmV2ZW50cykpLCBfZiA9IF9lLm5leHQoKTsgIV9mLmRvbmU7IF9mID0gX2UubmV4dCgpKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgZXZlbnRfMSA9IF9mLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgZXZlbnRzLmFkZChcIlwiLmNvbmNhdChldmVudF8xKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGNhdGNoIChlXzlfMSkge1xuICAgICAgICAgICAgICAgIGVfOSA9IHtcbiAgICAgICAgICAgICAgICAgIGVycm9yOiBlXzlfMVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIGlmIChfZiAmJiAhX2YuZG9uZSAmJiAoX2IgPSBfZS5yZXR1cm4pKSBfYi5jYWxsKF9lKTtcbiAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgaWYgKGVfOSkgdGhyb3cgZV85LmVycm9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZV84XzEpIHtcbiAgICAgICAgICBlXzggPSB7XG4gICAgICAgICAgICBlcnJvcjogZV84XzFcbiAgICAgICAgICB9O1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoX2QgJiYgIV9kLmRvbmUgJiYgKF9hID0gX2MucmV0dXJuKSkgX2EuY2FsbChfYyk7XG4gICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIGlmIChlXzgpIHRocm93IGVfOC5lcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuX19jYWNoZS5ldmVudHMgPSBBcnJheS5mcm9tKGV2ZW50cyk7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGF0ZU5vZGUucHJvdG90eXBlLCBcIm93bkV2ZW50c1wiLCB7XG4gICAgLyoqXHJcbiAgICAgKiBBbGwgdGhlIGV2ZW50cyB0aGF0IGhhdmUgdHJhbnNpdGlvbnMgZGlyZWN0bHkgZnJvbSB0aGlzIHN0YXRlIG5vZGUuXHJcbiAgICAgKlxyXG4gICAgICogRXhjbHVkZXMgYW55IGluZXJ0IGV2ZW50cy5cclxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGV2ZW50cyA9IG5ldyBTZXQodGhpcy50cmFuc2l0aW9ucy5maWx0ZXIoZnVuY3Rpb24gKHRyYW5zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuICEoIXRyYW5zaXRpb24udGFyZ2V0ICYmICF0cmFuc2l0aW9uLmFjdGlvbnMubGVuZ3RoICYmIHRyYW5zaXRpb24uaW50ZXJuYWwpO1xuICAgICAgfSkubWFwKGZ1bmN0aW9uICh0cmFuc2l0aW9uKSB7XG4gICAgICAgIHJldHVybiB0cmFuc2l0aW9uLmV2ZW50VHlwZTtcbiAgICAgIH0pKTtcbiAgICAgIHJldHVybiBBcnJheS5mcm9tKGV2ZW50cyk7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5yZXNvbHZlVGFyZ2V0ID0gZnVuY3Rpb24gKF90YXJnZXQpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKF90YXJnZXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gYW4gdW5kZWZpbmVkIHRhcmdldCBzaWduYWxzIHRoYXQgdGhlIHN0YXRlIG5vZGUgc2hvdWxkIG5vdCB0cmFuc2l0aW9uIGZyb20gdGhhdCBzdGF0ZSB3aGVuIHJlY2VpdmluZyB0aGF0IGV2ZW50XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiBfdGFyZ2V0Lm1hcChmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICBpZiAoIWlzU3RyaW5nKHRhcmdldCkpIHtcbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICAgIH1cblxuICAgICAgdmFyIGlzSW50ZXJuYWxUYXJnZXQgPSB0YXJnZXRbMF0gPT09IF90aGlzLmRlbGltaXRlcjsgLy8gSWYgaW50ZXJuYWwgdGFyZ2V0IGlzIGRlZmluZWQgb24gbWFjaGluZSxcbiAgICAgIC8vIGRvIG5vdCBpbmNsdWRlIG1hY2hpbmUga2V5IG9uIHRhcmdldFxuXG4gICAgICBpZiAoaXNJbnRlcm5hbFRhcmdldCAmJiAhX3RoaXMucGFyZW50KSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5nZXRTdGF0ZU5vZGVCeVBhdGgodGFyZ2V0LnNsaWNlKDEpKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlc29sdmVkVGFyZ2V0ID0gaXNJbnRlcm5hbFRhcmdldCA/IF90aGlzLmtleSArIHRhcmdldCA6IHRhcmdldDtcblxuICAgICAgaWYgKF90aGlzLnBhcmVudCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhciB0YXJnZXRTdGF0ZU5vZGUgPSBfdGhpcy5wYXJlbnQuZ2V0U3RhdGVOb2RlQnlQYXRoKHJlc29sdmVkVGFyZ2V0KTtcblxuICAgICAgICAgIHJldHVybiB0YXJnZXRTdGF0ZU5vZGU7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdHJhbnNpdGlvbiBkZWZpbml0aW9uIGZvciBzdGF0ZSBub2RlICdcIi5jb25jYXQoX3RoaXMuaWQsIFwiJzpcXG5cIikuY29uY2F0KGVyci5tZXNzYWdlKSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5nZXRTdGF0ZU5vZGVCeVBhdGgocmVzb2x2ZWRUYXJnZXQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZm9ybWF0VHJhbnNpdGlvbiA9IGZ1bmN0aW9uICh0cmFuc2l0aW9uQ29uZmlnKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBub3JtYWxpemVkVGFyZ2V0ID0gbm9ybWFsaXplVGFyZ2V0KHRyYW5zaXRpb25Db25maWcudGFyZ2V0KTtcbiAgICB2YXIgaW50ZXJuYWwgPSAnaW50ZXJuYWwnIGluIHRyYW5zaXRpb25Db25maWcgPyB0cmFuc2l0aW9uQ29uZmlnLmludGVybmFsIDogbm9ybWFsaXplZFRhcmdldCA/IG5vcm1hbGl6ZWRUYXJnZXQuc29tZShmdW5jdGlvbiAoX3RhcmdldCkge1xuICAgICAgcmV0dXJuIGlzU3RyaW5nKF90YXJnZXQpICYmIF90YXJnZXRbMF0gPT09IF90aGlzLmRlbGltaXRlcjtcbiAgICB9KSA6IHRydWU7XG4gICAgdmFyIGd1YXJkcyA9IHRoaXMubWFjaGluZS5vcHRpb25zLmd1YXJkcztcbiAgICB2YXIgdGFyZ2V0ID0gdGhpcy5yZXNvbHZlVGFyZ2V0KG5vcm1hbGl6ZWRUYXJnZXQpO1xuXG4gICAgdmFyIHRyYW5zaXRpb24gPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgdHJhbnNpdGlvbkNvbmZpZyksIHtcbiAgICAgIGFjdGlvbnM6IHRvQWN0aW9uT2JqZWN0cyh0b0FycmF5KHRyYW5zaXRpb25Db25maWcuYWN0aW9ucykpLFxuICAgICAgY29uZDogdG9HdWFyZCh0cmFuc2l0aW9uQ29uZmlnLmNvbmQsIGd1YXJkcyksXG4gICAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICAgIHNvdXJjZTogdGhpcyxcbiAgICAgIGludGVybmFsOiBpbnRlcm5hbCxcbiAgICAgIGV2ZW50VHlwZTogdHJhbnNpdGlvbkNvbmZpZy5ldmVudCxcbiAgICAgIHRvSlNPTjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIHRyYW5zaXRpb24pLCB7XG4gICAgICAgICAgdGFyZ2V0OiB0cmFuc2l0aW9uLnRhcmdldCA/IHRyYW5zaXRpb24udGFyZ2V0Lm1hcChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiI1wiLmNvbmNhdCh0LmlkKTtcbiAgICAgICAgICB9KSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICBzb3VyY2U6IFwiI1wiLmNvbmNhdChfdGhpcy5pZClcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdHJhbnNpdGlvbjtcbiAgfTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmZvcm1hdFRyYW5zaXRpb25zID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBlXzEwLCBfYTtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgb25Db25maWc7XG5cbiAgICBpZiAoIXRoaXMuY29uZmlnLm9uKSB7XG4gICAgICBvbkNvbmZpZyA9IFtdO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLmNvbmZpZy5vbikpIHtcbiAgICAgIG9uQ29uZmlnID0gdGhpcy5jb25maWcub247XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBfYiA9IHRoaXMuY29uZmlnLm9uLFxuICAgICAgICAgIF9jID0gV0lMRENBUkQsXG4gICAgICAgICAgX2QgPSBfYltfY10sXG4gICAgICAgICAgd2lsZGNhcmRDb25maWdzID0gX2QgPT09IHZvaWQgMCA/IFtdIDogX2QsXG4gICAgICAgICAgc3RyaWN0VHJhbnNpdGlvbkNvbmZpZ3NfMSA9IF9fcmVzdChfYiwgW3R5cGVvZiBfYyA9PT0gXCJzeW1ib2xcIiA/IF9jIDogX2MgKyBcIlwiXSk7XG5cbiAgICAgIG9uQ29uZmlnID0gZmxhdHRlbihPYmplY3Qua2V5cyhzdHJpY3RUcmFuc2l0aW9uQ29uZmlnc18xKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBpZiAoIUlTX1BST0RVQ1RJT04gJiYga2V5ID09PSBOVUxMX0VWRU5UKSB7XG4gICAgICAgICAgd2FybihmYWxzZSwgXCJFbXB0eSBzdHJpbmcgdHJhbnNpdGlvbiBjb25maWdzIChlLmcuLCBgeyBvbjogeyAnJzogLi4uIH19YCkgZm9yIHRyYW5zaWVudCB0cmFuc2l0aW9ucyBhcmUgZGVwcmVjYXRlZC4gU3BlY2lmeSB0aGUgdHJhbnNpdGlvbiBpbiB0aGUgYHsgYWx3YXlzOiAuLi4gfWAgcHJvcGVydHkgaW5zdGVhZC4gXCIgKyBcIlBsZWFzZSBjaGVjayB0aGUgYG9uYCBjb25maWd1cmF0aW9uIGZvciBcXFwiI1wiLmNvbmNhdChfdGhpcy5pZCwgXCJcXFwiLlwiKSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdHJhbnNpdGlvbkNvbmZpZ0FycmF5ID0gdG9UcmFuc2l0aW9uQ29uZmlnQXJyYXkoa2V5LCBzdHJpY3RUcmFuc2l0aW9uQ29uZmlnc18xW2tleV0pO1xuXG4gICAgICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgICAgIHZhbGlkYXRlQXJyYXlpZmllZFRyYW5zaXRpb25zKF90aGlzLCBrZXksIHRyYW5zaXRpb25Db25maWdBcnJheSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJhbnNpdGlvbkNvbmZpZ0FycmF5O1xuICAgICAgfSkuY29uY2F0KHRvVHJhbnNpdGlvbkNvbmZpZ0FycmF5KFdJTERDQVJELCB3aWxkY2FyZENvbmZpZ3MpKSk7XG4gICAgfVxuXG4gICAgdmFyIGV2ZW50bGVzc0NvbmZpZyA9IHRoaXMuY29uZmlnLmFsd2F5cyA/IHRvVHJhbnNpdGlvbkNvbmZpZ0FycmF5KCcnLCB0aGlzLmNvbmZpZy5hbHdheXMpIDogW107XG4gICAgdmFyIGRvbmVDb25maWcgPSB0aGlzLmNvbmZpZy5vbkRvbmUgPyB0b1RyYW5zaXRpb25Db25maWdBcnJheShTdHJpbmcoZG9uZSh0aGlzLmlkKSksIHRoaXMuY29uZmlnLm9uRG9uZSkgOiBbXTtcblxuICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgd2FybighKHRoaXMuY29uZmlnLm9uRG9uZSAmJiAhdGhpcy5wYXJlbnQpLCBcIlJvb3Qgbm9kZXMgY2Fubm90IGhhdmUgYW4gXFxcIi5vbkRvbmVcXFwiIHRyYW5zaXRpb24uIFBsZWFzZSBjaGVjayB0aGUgY29uZmlnIG9mIFxcXCJcIi5jb25jYXQodGhpcy5pZCwgXCJcXFwiLlwiKSk7XG4gICAgfVxuXG4gICAgdmFyIGludm9rZUNvbmZpZyA9IGZsYXR0ZW4odGhpcy5pbnZva2UubWFwKGZ1bmN0aW9uIChpbnZva2VEZWYpIHtcbiAgICAgIHZhciBzZXR0bGVUcmFuc2l0aW9ucyA9IFtdO1xuXG4gICAgICBpZiAoaW52b2tlRGVmLm9uRG9uZSkge1xuICAgICAgICBzZXR0bGVUcmFuc2l0aW9ucy5wdXNoLmFwcGx5KHNldHRsZVRyYW5zaXRpb25zLCBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQodG9UcmFuc2l0aW9uQ29uZmlnQXJyYXkoU3RyaW5nKGRvbmVJbnZva2UoaW52b2tlRGVmLmlkKSksIGludm9rZURlZi5vbkRvbmUpKSwgZmFsc2UpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGludm9rZURlZi5vbkVycm9yKSB7XG4gICAgICAgIHNldHRsZVRyYW5zaXRpb25zLnB1c2guYXBwbHkoc2V0dGxlVHJhbnNpdGlvbnMsIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZCh0b1RyYW5zaXRpb25Db25maWdBcnJheShTdHJpbmcoZXJyb3IoaW52b2tlRGVmLmlkKSksIGludm9rZURlZi5vbkVycm9yKSksIGZhbHNlKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzZXR0bGVUcmFuc2l0aW9ucztcbiAgICB9KSk7XG4gICAgdmFyIGRlbGF5ZWRUcmFuc2l0aW9ucyA9IHRoaXMuYWZ0ZXI7XG4gICAgdmFyIGZvcm1hdHRlZFRyYW5zaXRpb25zID0gZmxhdHRlbihfX3NwcmVhZEFycmF5KF9fc3ByZWFkQXJyYXkoX19zcHJlYWRBcnJheShfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoZG9uZUNvbmZpZyksIGZhbHNlKSwgX19yZWFkKGludm9rZUNvbmZpZyksIGZhbHNlKSwgX19yZWFkKG9uQ29uZmlnKSwgZmFsc2UpLCBfX3JlYWQoZXZlbnRsZXNzQ29uZmlnKSwgZmFsc2UpLm1hcChmdW5jdGlvbiAodHJhbnNpdGlvbkNvbmZpZykge1xuICAgICAgcmV0dXJuIHRvQXJyYXkodHJhbnNpdGlvbkNvbmZpZykubWFwKGZ1bmN0aW9uICh0cmFuc2l0aW9uKSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5mb3JtYXRUcmFuc2l0aW9uKHRyYW5zaXRpb24pO1xuICAgICAgfSk7XG4gICAgfSkpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIGRlbGF5ZWRUcmFuc2l0aW9uc18xID0gX192YWx1ZXMoZGVsYXllZFRyYW5zaXRpb25zKSwgZGVsYXllZFRyYW5zaXRpb25zXzFfMSA9IGRlbGF5ZWRUcmFuc2l0aW9uc18xLm5leHQoKTsgIWRlbGF5ZWRUcmFuc2l0aW9uc18xXzEuZG9uZTsgZGVsYXllZFRyYW5zaXRpb25zXzFfMSA9IGRlbGF5ZWRUcmFuc2l0aW9uc18xLm5leHQoKSkge1xuICAgICAgICB2YXIgZGVsYXllZFRyYW5zaXRpb24gPSBkZWxheWVkVHJhbnNpdGlvbnNfMV8xLnZhbHVlO1xuICAgICAgICBmb3JtYXR0ZWRUcmFuc2l0aW9ucy5wdXNoKGRlbGF5ZWRUcmFuc2l0aW9uKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzEwXzEpIHtcbiAgICAgIGVfMTAgPSB7XG4gICAgICAgIGVycm9yOiBlXzEwXzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChkZWxheWVkVHJhbnNpdGlvbnNfMV8xICYmICFkZWxheWVkVHJhbnNpdGlvbnNfMV8xLmRvbmUgJiYgKF9hID0gZGVsYXllZFRyYW5zaXRpb25zXzEucmV0dXJuKSkgX2EuY2FsbChkZWxheWVkVHJhbnNpdGlvbnNfMSk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV8xMCkgdGhyb3cgZV8xMC5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZm9ybWF0dGVkVHJhbnNpdGlvbnM7XG4gIH07XG5cbiAgcmV0dXJuIFN0YXRlTm9kZTtcbn0oKTtcblxuZXhwb3J0IHsgU3RhdGVOb2RlIH07XG4iLCIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXHJcblxyXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcclxucHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxyXG5cclxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxyXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcclxuQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxyXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cclxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1JcclxuT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxyXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG5cclxudmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH07XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufTtcclxuXHJcbmZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20sIHBhY2spIHtcclxuICAgIGlmIChwYWNrIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIGZvciAodmFyIGkgPSAwLCBsID0gZnJvbS5sZW5ndGgsIGFyOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGFyIHx8ICEoaSBpbiBmcm9tKSkge1xyXG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xyXG4gICAgICAgICAgICBhcltpXSA9IGZyb21baV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRvLmNvbmNhdChhciB8fCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tKSk7XHJcbn1cblxuZXhwb3J0IHsgX19hc3NpZ24sIF9fcmVhZCwgX19yZXN0LCBfX3NwcmVhZEFycmF5LCBfX3ZhbHVlcyB9O1xuIiwiaW1wb3J0IHsgQWN0aW9uVHlwZXMgfSBmcm9tICcuL3R5cGVzLmpzJztcblxudmFyIHN0YXJ0ID0gQWN0aW9uVHlwZXMuU3RhcnQ7XG52YXIgc3RvcCA9IEFjdGlvblR5cGVzLlN0b3A7XG52YXIgcmFpc2UgPSBBY3Rpb25UeXBlcy5SYWlzZTtcbnZhciBzZW5kID0gQWN0aW9uVHlwZXMuU2VuZDtcbnZhciBjYW5jZWwgPSBBY3Rpb25UeXBlcy5DYW5jZWw7XG52YXIgbnVsbEV2ZW50ID0gQWN0aW9uVHlwZXMuTnVsbEV2ZW50O1xudmFyIGFzc2lnbiA9IEFjdGlvblR5cGVzLkFzc2lnbjtcbnZhciBhZnRlciA9IEFjdGlvblR5cGVzLkFmdGVyO1xudmFyIGRvbmVTdGF0ZSA9IEFjdGlvblR5cGVzLkRvbmVTdGF0ZTtcbnZhciBsb2cgPSBBY3Rpb25UeXBlcy5Mb2c7XG52YXIgaW5pdCA9IEFjdGlvblR5cGVzLkluaXQ7XG52YXIgaW52b2tlID0gQWN0aW9uVHlwZXMuSW52b2tlO1xudmFyIGVycm9yRXhlY3V0aW9uID0gQWN0aW9uVHlwZXMuRXJyb3JFeGVjdXRpb247XG52YXIgZXJyb3JQbGF0Zm9ybSA9IEFjdGlvblR5cGVzLkVycm9yUGxhdGZvcm07XG52YXIgZXJyb3IgPSBBY3Rpb25UeXBlcy5FcnJvckN1c3RvbTtcbnZhciB1cGRhdGUgPSBBY3Rpb25UeXBlcy5VcGRhdGU7XG52YXIgY2hvb3NlID0gQWN0aW9uVHlwZXMuQ2hvb3NlO1xudmFyIHB1cmUgPSBBY3Rpb25UeXBlcy5QdXJlO1xuXG5leHBvcnQgeyBhZnRlciwgYXNzaWduLCBjYW5jZWwsIGNob29zZSwgZG9uZVN0YXRlLCBlcnJvciwgZXJyb3JFeGVjdXRpb24sIGVycm9yUGxhdGZvcm0sIGluaXQsIGludm9rZSwgbG9nLCBudWxsRXZlbnQsIHB1cmUsIHJhaXNlLCBzZW5kLCBzdGFydCwgc3RvcCwgdXBkYXRlIH07XG4iLCJpbXBvcnQgeyBfX2Fzc2lnbiwgX19zcHJlYWRBcnJheSwgX19yZWFkLCBfX3ZhbHVlcyB9IGZyb20gJy4vX3ZpcnR1YWwvX3RzbGliLmpzJztcbmltcG9ydCB7IFNwZWNpYWxUYXJnZXRzLCBBY3Rpb25UeXBlcyB9IGZyb20gJy4vdHlwZXMuanMnO1xuaW1wb3J0IHsgaW5pdCwgcmFpc2UgYXMgcmFpc2UkMSwgc2VuZCBhcyBzZW5kJDEsIHVwZGF0ZSwgbG9nIGFzIGxvZyQxLCBjYW5jZWwgYXMgY2FuY2VsJDEsIGFzc2lnbiBhcyBhc3NpZ24kMSwgZXJyb3IgYXMgZXJyb3IkMSwgc3RvcCBhcyBzdG9wJDEsIHB1cmUgYXMgcHVyZSQxLCBjaG9vc2UgYXMgY2hvb3NlJDEgfSBmcm9tICcuL2FjdGlvblR5cGVzLmpzJztcbmltcG9ydCAqIGFzIGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMuanMnO1xuZXhwb3J0IHsgYWN0aW9uVHlwZXMgfTtcbmltcG9ydCB7IHRvU0NYTUxFdmVudCwgaXNTdHJpbmcsIGlzRnVuY3Rpb24sIHRvRXZlbnRPYmplY3QsIGdldEV2ZW50VHlwZSwgdXBkYXRlQ29udGV4dCwgZmxhdHRlbiwgaXNBcnJheSwgdG9BcnJheSwgdG9HdWFyZCwgZXZhbHVhdGVHdWFyZCwgd2FybiB9IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHsgSVNfUFJPRFVDVElPTiB9IGZyb20gJy4vZW52aXJvbm1lbnQuanMnO1xuXG52YXIgaW5pdEV2ZW50ID0gLyojX19QVVJFX18qL3RvU0NYTUxFdmVudCh7XG4gIHR5cGU6IGluaXRcbn0pO1xuZnVuY3Rpb24gZ2V0QWN0aW9uRnVuY3Rpb24oYWN0aW9uVHlwZSwgYWN0aW9uRnVuY3Rpb25NYXApIHtcbiAgcmV0dXJuIGFjdGlvbkZ1bmN0aW9uTWFwID8gYWN0aW9uRnVuY3Rpb25NYXBbYWN0aW9uVHlwZV0gfHwgdW5kZWZpbmVkIDogdW5kZWZpbmVkO1xufVxuZnVuY3Rpb24gdG9BY3Rpb25PYmplY3QoYWN0aW9uLCBhY3Rpb25GdW5jdGlvbk1hcCkge1xuICB2YXIgYWN0aW9uT2JqZWN0O1xuXG4gIGlmIChpc1N0cmluZyhhY3Rpb24pIHx8IHR5cGVvZiBhY3Rpb24gPT09ICdudW1iZXInKSB7XG4gICAgdmFyIGV4ZWMgPSBnZXRBY3Rpb25GdW5jdGlvbihhY3Rpb24sIGFjdGlvbkZ1bmN0aW9uTWFwKTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGV4ZWMpKSB7XG4gICAgICBhY3Rpb25PYmplY3QgPSB7XG4gICAgICAgIHR5cGU6IGFjdGlvbixcbiAgICAgICAgZXhlYzogZXhlY1xuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGV4ZWMpIHtcbiAgICAgIGFjdGlvbk9iamVjdCA9IGV4ZWM7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFjdGlvbk9iamVjdCA9IHtcbiAgICAgICAgdHlwZTogYWN0aW9uLFxuICAgICAgICBleGVjOiB1bmRlZmluZWRcbiAgICAgIH07XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzRnVuY3Rpb24oYWN0aW9uKSkge1xuICAgIGFjdGlvbk9iamVjdCA9IHtcbiAgICAgIC8vIENvbnZlcnQgYWN0aW9uIHRvIHN0cmluZyBpZiB1bm5hbWVkXG4gICAgICB0eXBlOiBhY3Rpb24ubmFtZSB8fCBhY3Rpb24udG9TdHJpbmcoKSxcbiAgICAgIGV4ZWM6IGFjdGlvblxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgdmFyIGV4ZWMgPSBnZXRBY3Rpb25GdW5jdGlvbihhY3Rpb24udHlwZSwgYWN0aW9uRnVuY3Rpb25NYXApO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oZXhlYykpIHtcbiAgICAgIGFjdGlvbk9iamVjdCA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCBhY3Rpb24pLCB7XG4gICAgICAgIGV4ZWM6IGV4ZWNcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoZXhlYykge1xuICAgICAgdmFyIGFjdGlvblR5cGUgPSBleGVjLnR5cGUgfHwgYWN0aW9uLnR5cGU7XG4gICAgICBhY3Rpb25PYmplY3QgPSBfX2Fzc2lnbihfX2Fzc2lnbihfX2Fzc2lnbih7fSwgZXhlYyksIGFjdGlvbiksIHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFjdGlvbk9iamVjdCA9IGFjdGlvbjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYWN0aW9uT2JqZWN0O1xufVxudmFyIHRvQWN0aW9uT2JqZWN0cyA9IGZ1bmN0aW9uIChhY3Rpb24sIGFjdGlvbkZ1bmN0aW9uTWFwKSB7XG4gIGlmICghYWN0aW9uKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgdmFyIGFjdGlvbnMgPSBpc0FycmF5KGFjdGlvbikgPyBhY3Rpb24gOiBbYWN0aW9uXTtcbiAgcmV0dXJuIGFjdGlvbnMubWFwKGZ1bmN0aW9uIChzdWJBY3Rpb24pIHtcbiAgICByZXR1cm4gdG9BY3Rpb25PYmplY3Qoc3ViQWN0aW9uLCBhY3Rpb25GdW5jdGlvbk1hcCk7XG4gIH0pO1xufTtcbmZ1bmN0aW9uIHRvQWN0aXZpdHlEZWZpbml0aW9uKGFjdGlvbikge1xuICB2YXIgYWN0aW9uT2JqZWN0ID0gdG9BY3Rpb25PYmplY3QoYWN0aW9uKTtcbiAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHtcbiAgICBpZDogaXNTdHJpbmcoYWN0aW9uKSA/IGFjdGlvbiA6IGFjdGlvbk9iamVjdC5pZFxuICB9LCBhY3Rpb25PYmplY3QpLCB7XG4gICAgdHlwZTogYWN0aW9uT2JqZWN0LnR5cGVcbiAgfSk7XG59XG4vKipcclxuICogUmFpc2VzIGFuIGV2ZW50LiBUaGlzIHBsYWNlcyB0aGUgZXZlbnQgaW4gdGhlIGludGVybmFsIGV2ZW50IHF1ZXVlLCBzbyB0aGF0XHJcbiAqIHRoZSBldmVudCBpcyBpbW1lZGlhdGVseSBjb25zdW1lZCBieSB0aGUgbWFjaGluZSBpbiB0aGUgY3VycmVudCBzdGVwLlxyXG4gKlxyXG4gKiBAcGFyYW0gZXZlbnRUeXBlIFRoZSBldmVudCB0byByYWlzZS5cclxuICovXG5cbmZ1bmN0aW9uIHJhaXNlKGV2ZW50LCBvcHRpb25zKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogcmFpc2UkMSxcbiAgICBldmVudDogdHlwZW9mIGV2ZW50ID09PSAnZnVuY3Rpb24nID8gZXZlbnQgOiB0b0V2ZW50T2JqZWN0KGV2ZW50KSxcbiAgICBkZWxheTogb3B0aW9ucyA/IG9wdGlvbnMuZGVsYXkgOiB1bmRlZmluZWQsXG4gICAgaWQ6IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5pZFxuICB9O1xufVxuZnVuY3Rpb24gcmVzb2x2ZVJhaXNlKGFjdGlvbiwgY3R4LCBfZXZlbnQsIGRlbGF5c01hcCkge1xuICB2YXIgbWV0YSA9IHtcbiAgICBfZXZlbnQ6IF9ldmVudFxuICB9O1xuICB2YXIgcmVzb2x2ZWRFdmVudCA9IHRvU0NYTUxFdmVudChpc0Z1bmN0aW9uKGFjdGlvbi5ldmVudCkgPyBhY3Rpb24uZXZlbnQoY3R4LCBfZXZlbnQuZGF0YSwgbWV0YSkgOiBhY3Rpb24uZXZlbnQpO1xuICB2YXIgcmVzb2x2ZWREZWxheTtcblxuICBpZiAoaXNTdHJpbmcoYWN0aW9uLmRlbGF5KSkge1xuICAgIHZhciBjb25maWdEZWxheSA9IGRlbGF5c01hcCAmJiBkZWxheXNNYXBbYWN0aW9uLmRlbGF5XTtcbiAgICByZXNvbHZlZERlbGF5ID0gaXNGdW5jdGlvbihjb25maWdEZWxheSkgPyBjb25maWdEZWxheShjdHgsIF9ldmVudC5kYXRhLCBtZXRhKSA6IGNvbmZpZ0RlbGF5O1xuICB9IGVsc2Uge1xuICAgIHJlc29sdmVkRGVsYXkgPSBpc0Z1bmN0aW9uKGFjdGlvbi5kZWxheSkgPyBhY3Rpb24uZGVsYXkoY3R4LCBfZXZlbnQuZGF0YSwgbWV0YSkgOiBhY3Rpb24uZGVsYXk7XG4gIH1cblxuICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIGFjdGlvbiksIHtcbiAgICB0eXBlOiByYWlzZSQxLFxuICAgIF9ldmVudDogcmVzb2x2ZWRFdmVudCxcbiAgICBkZWxheTogcmVzb2x2ZWREZWxheVxuICB9KTtcbn1cbi8qKlxyXG4gKiBTZW5kcyBhbiBldmVudC4gVGhpcyByZXR1cm5zIGFuIGFjdGlvbiB0aGF0IHdpbGwgYmUgcmVhZCBieSBhbiBpbnRlcnByZXRlciB0b1xyXG4gKiBzZW5kIHRoZSBldmVudCBpbiB0aGUgbmV4dCBzdGVwLCBhZnRlciB0aGUgY3VycmVudCBzdGVwIGlzIGZpbmlzaGVkIGV4ZWN1dGluZy5cclxuICpcclxuICogQGRlcHJlY2F0ZWQgVXNlIHRoZSBgc2VuZFRvKC4uLilgIGFjdGlvbiBjcmVhdG9yIGluc3RlYWQuXHJcbiAqXHJcbiAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgdG8gc2VuZC5cclxuICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyB0byBwYXNzIGludG8gdGhlIHNlbmQgZXZlbnQ6XHJcbiAqICAtIGBpZGAgLSBUaGUgdW5pcXVlIHNlbmQgZXZlbnQgaWRlbnRpZmllciAodXNlZCB3aXRoIGBjYW5jZWwoKWApLlxyXG4gKiAgLSBgZGVsYXlgIC0gVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gZGVsYXkgdGhlIHNlbmRpbmcgb2YgdGhlIGV2ZW50LlxyXG4gKiAgLSBgdG9gIC0gVGhlIHRhcmdldCBvZiB0aGlzIGV2ZW50IChieSBkZWZhdWx0LCB0aGUgbWFjaGluZSB0aGUgZXZlbnQgd2FzIHNlbnQgZnJvbSkuXHJcbiAqL1xuXG5mdW5jdGlvbiBzZW5kKGV2ZW50LCBvcHRpb25zKSB7XG4gIHJldHVybiB7XG4gICAgdG86IG9wdGlvbnMgPyBvcHRpb25zLnRvIDogdW5kZWZpbmVkLFxuICAgIHR5cGU6IHNlbmQkMSxcbiAgICBldmVudDogaXNGdW5jdGlvbihldmVudCkgPyBldmVudCA6IHRvRXZlbnRPYmplY3QoZXZlbnQpLFxuICAgIGRlbGF5OiBvcHRpb25zID8gb3B0aW9ucy5kZWxheSA6IHVuZGVmaW5lZCxcbiAgICAvLyBUT0RPOiBkb24ndCBhdXRvLWdlbmVyYXRlIElEcyBoZXJlIGxpa2UgdGhhdFxuICAgIC8vIHRoZXJlIGlzIHRvbyBiaWcgY2hhbmNlIG9mIHRoZSBJRCBjb2xsaXNpb25cbiAgICBpZDogb3B0aW9ucyAmJiBvcHRpb25zLmlkICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmlkIDogaXNGdW5jdGlvbihldmVudCkgPyBldmVudC5uYW1lIDogZ2V0RXZlbnRUeXBlKGV2ZW50KVxuICB9O1xufVxuZnVuY3Rpb24gcmVzb2x2ZVNlbmQoYWN0aW9uLCBjdHgsIF9ldmVudCwgZGVsYXlzTWFwKSB7XG4gIHZhciBtZXRhID0ge1xuICAgIF9ldmVudDogX2V2ZW50XG4gIH07IC8vIFRPRE86IGhlbHBlciBmdW5jdGlvbiBmb3IgcmVzb2x2aW5nIEV4cHJcblxuICB2YXIgcmVzb2x2ZWRFdmVudCA9IHRvU0NYTUxFdmVudChpc0Z1bmN0aW9uKGFjdGlvbi5ldmVudCkgPyBhY3Rpb24uZXZlbnQoY3R4LCBfZXZlbnQuZGF0YSwgbWV0YSkgOiBhY3Rpb24uZXZlbnQpO1xuICB2YXIgcmVzb2x2ZWREZWxheTtcblxuICBpZiAoaXNTdHJpbmcoYWN0aW9uLmRlbGF5KSkge1xuICAgIHZhciBjb25maWdEZWxheSA9IGRlbGF5c01hcCAmJiBkZWxheXNNYXBbYWN0aW9uLmRlbGF5XTtcbiAgICByZXNvbHZlZERlbGF5ID0gaXNGdW5jdGlvbihjb25maWdEZWxheSkgPyBjb25maWdEZWxheShjdHgsIF9ldmVudC5kYXRhLCBtZXRhKSA6IGNvbmZpZ0RlbGF5O1xuICB9IGVsc2Uge1xuICAgIHJlc29sdmVkRGVsYXkgPSBpc0Z1bmN0aW9uKGFjdGlvbi5kZWxheSkgPyBhY3Rpb24uZGVsYXkoY3R4LCBfZXZlbnQuZGF0YSwgbWV0YSkgOiBhY3Rpb24uZGVsYXk7XG4gIH1cblxuICB2YXIgcmVzb2x2ZWRUYXJnZXQgPSBpc0Z1bmN0aW9uKGFjdGlvbi50bykgPyBhY3Rpb24udG8oY3R4LCBfZXZlbnQuZGF0YSwgbWV0YSkgOiBhY3Rpb24udG87XG4gIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgYWN0aW9uKSwge1xuICAgIHRvOiByZXNvbHZlZFRhcmdldCxcbiAgICBfZXZlbnQ6IHJlc29sdmVkRXZlbnQsXG4gICAgZXZlbnQ6IHJlc29sdmVkRXZlbnQuZGF0YSxcbiAgICBkZWxheTogcmVzb2x2ZWREZWxheVxuICB9KTtcbn1cbi8qKlxyXG4gKiBTZW5kcyBhbiBldmVudCB0byB0aGlzIG1hY2hpbmUncyBwYXJlbnQuXHJcbiAqXHJcbiAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgdG8gc2VuZCB0byB0aGUgcGFyZW50IG1hY2hpbmUuXHJcbiAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgdG8gcGFzcyBpbnRvIHRoZSBzZW5kIGV2ZW50LlxyXG4gKi9cblxuZnVuY3Rpb24gc2VuZFBhcmVudChldmVudCwgb3B0aW9ucykge1xuICByZXR1cm4gc2VuZChldmVudCwgX19hc3NpZ24oX19hc3NpZ24oe30sIG9wdGlvbnMpLCB7XG4gICAgdG86IFNwZWNpYWxUYXJnZXRzLlBhcmVudFxuICB9KSk7XG59XG4vKipcclxuICogU2VuZHMgYW4gZXZlbnQgdG8gYW4gYWN0b3IuXHJcbiAqXHJcbiAqIEBwYXJhbSBhY3RvciBUaGUgYEFjdG9yUmVmYCB0byBzZW5kIHRoZSBldmVudCB0by5cclxuICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCB0byBzZW5kLCBvciBhbiBleHByZXNzaW9uIHRoYXQgZXZhbHVhdGVzIHRvIHRoZSBldmVudCB0byBzZW5kXHJcbiAqIEBwYXJhbSBvcHRpb25zIFNlbmQgYWN0aW9uIG9wdGlvbnNcclxuICogQHJldHVybnMgQW4gWFN0YXRlIHNlbmQgYWN0aW9uIG9iamVjdFxyXG4gKi9cblxuZnVuY3Rpb24gc2VuZFRvKGFjdG9yLCBldmVudCwgb3B0aW9ucykge1xuICByZXR1cm4gc2VuZChldmVudCwgX19hc3NpZ24oX19hc3NpZ24oe30sIG9wdGlvbnMpLCB7XG4gICAgdG86IGFjdG9yXG4gIH0pKTtcbn1cbi8qKlxyXG4gKiBTZW5kcyBhbiB1cGRhdGUgZXZlbnQgdG8gdGhpcyBtYWNoaW5lJ3MgcGFyZW50LlxyXG4gKi9cblxuZnVuY3Rpb24gc2VuZFVwZGF0ZSgpIHtcbiAgcmV0dXJuIHNlbmRQYXJlbnQodXBkYXRlKTtcbn1cbi8qKlxyXG4gKiBTZW5kcyBhbiBldmVudCBiYWNrIHRvIHRoZSBzZW5kZXIgb2YgdGhlIG9yaWdpbmFsIGV2ZW50LlxyXG4gKlxyXG4gKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IHRvIHNlbmQgYmFjayB0byB0aGUgc2VuZGVyXHJcbiAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgdG8gcGFzcyBpbnRvIHRoZSBzZW5kIGV2ZW50XHJcbiAqL1xuXG5mdW5jdGlvbiByZXNwb25kKGV2ZW50LCBvcHRpb25zKSB7XG4gIHJldHVybiBzZW5kKGV2ZW50LCBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgb3B0aW9ucyksIHtcbiAgICB0bzogZnVuY3Rpb24gKF8sIF9fLCBfYSkge1xuICAgICAgdmFyIF9ldmVudCA9IF9hLl9ldmVudDtcbiAgICAgIHJldHVybiBfZXZlbnQub3JpZ2luOyAvLyBUT0RPOiBoYW5kbGUgd2hlbiBfZXZlbnQub3JpZ2luIGlzIHVuZGVmaW5lZFxuICAgIH1cbiAgfSkpO1xufVxuXG52YXIgZGVmYXVsdExvZ0V4cHIgPSBmdW5jdGlvbiAoY29udGV4dCwgZXZlbnQpIHtcbiAgcmV0dXJuIHtcbiAgICBjb250ZXh0OiBjb250ZXh0LFxuICAgIGV2ZW50OiBldmVudFxuICB9O1xufTtcbi8qKlxyXG4gKlxyXG4gKiBAcGFyYW0gZXhwciBUaGUgZXhwcmVzc2lvbiBmdW5jdGlvbiB0byBldmFsdWF0ZSB3aGljaCB3aWxsIGJlIGxvZ2dlZC5cclxuICogIFRha2VzIGluIDIgYXJndW1lbnRzOlxyXG4gKiAgLSBgY3R4YCAtIHRoZSBjdXJyZW50IHN0YXRlIGNvbnRleHRcclxuICogIC0gYGV2ZW50YCAtIHRoZSBldmVudCB0aGF0IGNhdXNlZCB0aGlzIGFjdGlvbiB0byBiZSBleGVjdXRlZC5cclxuICogQHBhcmFtIGxhYmVsIFRoZSBsYWJlbCB0byBnaXZlIHRvIHRoZSBsb2dnZWQgZXhwcmVzc2lvbi5cclxuICovXG5cblxuZnVuY3Rpb24gbG9nKGV4cHIsIGxhYmVsKSB7XG4gIGlmIChleHByID09PSB2b2lkIDApIHtcbiAgICBleHByID0gZGVmYXVsdExvZ0V4cHI7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHR5cGU6IGxvZyQxLFxuICAgIGxhYmVsOiBsYWJlbCxcbiAgICBleHByOiBleHByXG4gIH07XG59XG52YXIgcmVzb2x2ZUxvZyA9IGZ1bmN0aW9uIChhY3Rpb24sIGN0eCwgX2V2ZW50KSB7XG4gIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgYWN0aW9uKSwge1xuICAgIHZhbHVlOiBpc1N0cmluZyhhY3Rpb24uZXhwcikgPyBhY3Rpb24uZXhwciA6IGFjdGlvbi5leHByKGN0eCwgX2V2ZW50LmRhdGEsIHtcbiAgICAgIF9ldmVudDogX2V2ZW50XG4gICAgfSlcbiAgfSk7XG59O1xuLyoqXHJcbiAqIENhbmNlbHMgYW4gaW4tZmxpZ2h0IGBzZW5kKC4uLilgIGFjdGlvbi4gQSBjYW5jZWxlZCBzZW50IGFjdGlvbiB3aWxsIG5vdFxyXG4gKiBiZSBleGVjdXRlZCwgbm9yIHdpbGwgaXRzIGV2ZW50IGJlIHNlbnQsIHVubGVzcyBpdCBoYXMgYWxyZWFkeSBiZWVuIHNlbnRcclxuICogKGUuZy4sIGlmIGBjYW5jZWwoLi4uKWAgaXMgY2FsbGVkIGFmdGVyIHRoZSBgc2VuZCguLi4pYCBhY3Rpb24ncyBgZGVsYXlgKS5cclxuICpcclxuICogQHBhcmFtIHNlbmRJZCBUaGUgYGlkYCBvZiB0aGUgYHNlbmQoLi4uKWAgYWN0aW9uIHRvIGNhbmNlbC5cclxuICovXG5cbnZhciBjYW5jZWwgPSBmdW5jdGlvbiAoc2VuZElkKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogY2FuY2VsJDEsXG4gICAgc2VuZElkOiBzZW5kSWRcbiAgfTtcbn07XG4vKipcclxuICogU3RhcnRzIGFuIGFjdGl2aXR5LlxyXG4gKlxyXG4gKiBAcGFyYW0gYWN0aXZpdHkgVGhlIGFjdGl2aXR5IHRvIHN0YXJ0LlxyXG4gKi9cblxuZnVuY3Rpb24gc3RhcnQoYWN0aXZpdHkpIHtcbiAgdmFyIGFjdGl2aXR5RGVmID0gdG9BY3Rpdml0eURlZmluaXRpb24oYWN0aXZpdHkpO1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLlN0YXJ0LFxuICAgIGFjdGl2aXR5OiBhY3Rpdml0eURlZixcbiAgICBleGVjOiB1bmRlZmluZWRcbiAgfTtcbn1cbi8qKlxyXG4gKiBTdG9wcyBhbiBhY3Rpdml0eS5cclxuICpcclxuICogQHBhcmFtIGFjdG9yUmVmIFRoZSBhY3Rpdml0eSB0byBzdG9wLlxyXG4gKi9cblxuZnVuY3Rpb24gc3RvcChhY3RvclJlZikge1xuICB2YXIgYWN0aXZpdHkgPSBpc0Z1bmN0aW9uKGFjdG9yUmVmKSA/IGFjdG9yUmVmIDogdG9BY3Rpdml0eURlZmluaXRpb24oYWN0b3JSZWYpO1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLlN0b3AsXG4gICAgYWN0aXZpdHk6IGFjdGl2aXR5LFxuICAgIGV4ZWM6IHVuZGVmaW5lZFxuICB9O1xufVxuZnVuY3Rpb24gcmVzb2x2ZVN0b3AoYWN0aW9uLCBjb250ZXh0LCBfZXZlbnQpIHtcbiAgdmFyIGFjdG9yUmVmT3JTdHJpbmcgPSBpc0Z1bmN0aW9uKGFjdGlvbi5hY3Rpdml0eSkgPyBhY3Rpb24uYWN0aXZpdHkoY29udGV4dCwgX2V2ZW50LmRhdGEpIDogYWN0aW9uLmFjdGl2aXR5O1xuICB2YXIgcmVzb2x2ZWRBY3RvclJlZiA9IHR5cGVvZiBhY3RvclJlZk9yU3RyaW5nID09PSAnc3RyaW5nJyA/IHtcbiAgICBpZDogYWN0b3JSZWZPclN0cmluZ1xuICB9IDogYWN0b3JSZWZPclN0cmluZztcbiAgdmFyIGFjdGlvbk9iamVjdCA9IHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5TdG9wLFxuICAgIGFjdGl2aXR5OiByZXNvbHZlZEFjdG9yUmVmXG4gIH07XG4gIHJldHVybiBhY3Rpb25PYmplY3Q7XG59XG4vKipcclxuICogVXBkYXRlcyB0aGUgY3VycmVudCBjb250ZXh0IG9mIHRoZSBtYWNoaW5lLlxyXG4gKlxyXG4gKiBAcGFyYW0gYXNzaWdubWVudCBBbiBvYmplY3QgdGhhdCByZXByZXNlbnRzIHRoZSBwYXJ0aWFsIGNvbnRleHQgdG8gdXBkYXRlLlxyXG4gKi9cblxudmFyIGFzc2lnbiA9IGZ1bmN0aW9uIChhc3NpZ25tZW50KSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogYXNzaWduJDEsXG4gICAgYXNzaWdubWVudDogYXNzaWdubWVudFxuICB9O1xufTtcbmZ1bmN0aW9uIGlzQWN0aW9uT2JqZWN0KGFjdGlvbikge1xuICByZXR1cm4gdHlwZW9mIGFjdGlvbiA9PT0gJ29iamVjdCcgJiYgJ3R5cGUnIGluIGFjdGlvbjtcbn1cbi8qKlxyXG4gKiBSZXR1cm5zIGFuIGV2ZW50IHR5cGUgdGhhdCByZXByZXNlbnRzIGFuIGltcGxpY2l0IGV2ZW50IHRoYXRcclxuICogaXMgc2VudCBhZnRlciB0aGUgc3BlY2lmaWVkIGBkZWxheWAuXHJcbiAqXHJcbiAqIEBwYXJhbSBkZWxheVJlZiBUaGUgZGVsYXkgaW4gbWlsbGlzZWNvbmRzXHJcbiAqIEBwYXJhbSBpZCBUaGUgc3RhdGUgbm9kZSBJRCB3aGVyZSB0aGlzIGV2ZW50IGlzIGhhbmRsZWRcclxuICovXG5cbmZ1bmN0aW9uIGFmdGVyKGRlbGF5UmVmLCBpZCkge1xuICB2YXIgaWRTdWZmaXggPSBpZCA/IFwiI1wiLmNvbmNhdChpZCkgOiAnJztcbiAgcmV0dXJuIFwiXCIuY29uY2F0KEFjdGlvblR5cGVzLkFmdGVyLCBcIihcIikuY29uY2F0KGRlbGF5UmVmLCBcIilcIikuY29uY2F0KGlkU3VmZml4KTtcbn1cbi8qKlxyXG4gKiBSZXR1cm5zIGFuIGV2ZW50IHRoYXQgcmVwcmVzZW50cyB0aGF0IGEgZmluYWwgc3RhdGUgbm9kZVxyXG4gKiBoYXMgYmVlbiByZWFjaGVkIGluIHRoZSBwYXJlbnQgc3RhdGUgbm9kZS5cclxuICpcclxuICogQHBhcmFtIGlkIFRoZSBmaW5hbCBzdGF0ZSBub2RlJ3MgcGFyZW50IHN0YXRlIG5vZGUgYGlkYFxyXG4gKiBAcGFyYW0gZGF0YSBUaGUgZGF0YSB0byBwYXNzIGludG8gdGhlIGV2ZW50XHJcbiAqL1xuXG5mdW5jdGlvbiBkb25lKGlkLCBkYXRhKSB7XG4gIHZhciB0eXBlID0gXCJcIi5jb25jYXQoQWN0aW9uVHlwZXMuRG9uZVN0YXRlLCBcIi5cIikuY29uY2F0KGlkKTtcbiAgdmFyIGV2ZW50T2JqZWN0ID0ge1xuICAgIHR5cGU6IHR5cGUsXG4gICAgZGF0YTogZGF0YVxuICB9O1xuXG4gIGV2ZW50T2JqZWN0LnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0eXBlO1xuICB9O1xuXG4gIHJldHVybiBldmVudE9iamVjdDtcbn1cbi8qKlxyXG4gKiBSZXR1cm5zIGFuIGV2ZW50IHRoYXQgcmVwcmVzZW50cyB0aGF0IGFuIGludm9rZWQgc2VydmljZSBoYXMgdGVybWluYXRlZC5cclxuICpcclxuICogQW4gaW52b2tlZCBzZXJ2aWNlIGlzIHRlcm1pbmF0ZWQgd2hlbiBpdCBoYXMgcmVhY2hlZCBhIHRvcC1sZXZlbCBmaW5hbCBzdGF0ZSBub2RlLFxyXG4gKiBidXQgbm90IHdoZW4gaXQgaXMgY2FuY2VsZWQuXHJcbiAqXHJcbiAqIEBwYXJhbSBpZCBUaGUgZmluYWwgc3RhdGUgbm9kZSBJRFxyXG4gKiBAcGFyYW0gZGF0YSBUaGUgZGF0YSB0byBwYXNzIGludG8gdGhlIGV2ZW50XHJcbiAqL1xuXG5mdW5jdGlvbiBkb25lSW52b2tlKGlkLCBkYXRhKSB7XG4gIHZhciB0eXBlID0gXCJcIi5jb25jYXQoQWN0aW9uVHlwZXMuRG9uZUludm9rZSwgXCIuXCIpLmNvbmNhdChpZCk7XG4gIHZhciBldmVudE9iamVjdCA9IHtcbiAgICB0eXBlOiB0eXBlLFxuICAgIGRhdGE6IGRhdGFcbiAgfTtcblxuICBldmVudE9iamVjdC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdHlwZTtcbiAgfTtcblxuICByZXR1cm4gZXZlbnRPYmplY3Q7XG59XG5mdW5jdGlvbiBlcnJvcihpZCwgZGF0YSkge1xuICB2YXIgdHlwZSA9IFwiXCIuY29uY2F0KEFjdGlvblR5cGVzLkVycm9yUGxhdGZvcm0sIFwiLlwiKS5jb25jYXQoaWQpO1xuICB2YXIgZXZlbnRPYmplY3QgPSB7XG4gICAgdHlwZTogdHlwZSxcbiAgICBkYXRhOiBkYXRhXG4gIH07XG5cbiAgZXZlbnRPYmplY3QudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHR5cGU7XG4gIH07XG5cbiAgcmV0dXJuIGV2ZW50T2JqZWN0O1xufVxuZnVuY3Rpb24gcHVyZShnZXRBY3Rpb25zKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuUHVyZSxcbiAgICBnZXQ6IGdldEFjdGlvbnNcbiAgfTtcbn1cbi8qKlxyXG4gKiBGb3J3YXJkcyAoc2VuZHMpIGFuIGV2ZW50IHRvIGEgc3BlY2lmaWVkIHNlcnZpY2UuXHJcbiAqXHJcbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBzZXJ2aWNlIHRvIGZvcndhcmQgdGhlIGV2ZW50IHRvLlxyXG4gKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIHRvIHBhc3MgaW50byB0aGUgc2VuZCBhY3Rpb24gY3JlYXRvci5cclxuICovXG5cbmZ1bmN0aW9uIGZvcndhcmRUbyh0YXJnZXQsIG9wdGlvbnMpIHtcbiAgaWYgKCFJU19QUk9EVUNUSU9OICYmICghdGFyZ2V0IHx8IHR5cGVvZiB0YXJnZXQgPT09ICdmdW5jdGlvbicpKSB7XG4gICAgdmFyIG9yaWdpbmFsVGFyZ2V0XzEgPSB0YXJnZXQ7XG5cbiAgICB0YXJnZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYXJncyA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICB9XG5cbiAgICAgIHZhciByZXNvbHZlZFRhcmdldCA9IHR5cGVvZiBvcmlnaW5hbFRhcmdldF8xID09PSAnZnVuY3Rpb24nID8gb3JpZ2luYWxUYXJnZXRfMS5hcHBseSh2b2lkIDAsIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChhcmdzKSwgZmFsc2UpKSA6IG9yaWdpbmFsVGFyZ2V0XzE7XG5cbiAgICAgIGlmICghcmVzb2x2ZWRUYXJnZXQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQXR0ZW1wdGVkIHRvIGZvcndhcmQgZXZlbnQgdG8gdW5kZWZpbmVkIGFjdG9yLiBUaGlzIHJpc2tzIGFuIGluZmluaXRlIGxvb3AgaW4gdGhlIHNlbmRlci5cIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXNvbHZlZFRhcmdldDtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHNlbmQoZnVuY3Rpb24gKF8sIGV2ZW50KSB7XG4gICAgcmV0dXJuIGV2ZW50O1xuICB9LCBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgb3B0aW9ucyksIHtcbiAgICB0bzogdGFyZ2V0XG4gIH0pKTtcbn1cbi8qKlxyXG4gKiBFc2NhbGF0ZXMgYW4gZXJyb3IgYnkgc2VuZGluZyBpdCBhcyBhbiBldmVudCB0byB0aGlzIG1hY2hpbmUncyBwYXJlbnQuXHJcbiAqXHJcbiAqIEBwYXJhbSBlcnJvckRhdGEgVGhlIGVycm9yIGRhdGEgdG8gc2VuZCwgb3IgdGhlIGV4cHJlc3Npb24gZnVuY3Rpb24gdGhhdFxyXG4gKiB0YWtlcyBpbiB0aGUgYGNvbnRleHRgLCBgZXZlbnRgLCBhbmQgYG1ldGFgLCBhbmQgcmV0dXJucyB0aGUgZXJyb3IgZGF0YSB0byBzZW5kLlxyXG4gKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIHRvIHBhc3MgaW50byB0aGUgc2VuZCBhY3Rpb24gY3JlYXRvci5cclxuICovXG5cbmZ1bmN0aW9uIGVzY2FsYXRlKGVycm9yRGF0YSwgb3B0aW9ucykge1xuICByZXR1cm4gc2VuZFBhcmVudChmdW5jdGlvbiAoY29udGV4dCwgZXZlbnQsIG1ldGEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogZXJyb3IkMSxcbiAgICAgIGRhdGE6IGlzRnVuY3Rpb24oZXJyb3JEYXRhKSA/IGVycm9yRGF0YShjb250ZXh0LCBldmVudCwgbWV0YSkgOiBlcnJvckRhdGFcbiAgICB9O1xuICB9LCBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgb3B0aW9ucyksIHtcbiAgICB0bzogU3BlY2lhbFRhcmdldHMuUGFyZW50XG4gIH0pKTtcbn1cbmZ1bmN0aW9uIGNob29zZShjb25kcykge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLkNob29zZSxcbiAgICBjb25kczogY29uZHNcbiAgfTtcbn1cblxudmFyIHBsdWNrQXNzaWducyA9IGZ1bmN0aW9uIChhY3Rpb25CbG9ja3MpIHtcbiAgdmFyIGVfMSwgX2E7XG5cbiAgdmFyIGFzc2lnbkFjdGlvbnMgPSBbXTtcblxuICB0cnkge1xuICAgIGZvciAodmFyIGFjdGlvbkJsb2Nrc18xID0gX192YWx1ZXMoYWN0aW9uQmxvY2tzKSwgYWN0aW9uQmxvY2tzXzFfMSA9IGFjdGlvbkJsb2Nrc18xLm5leHQoKTsgIWFjdGlvbkJsb2Nrc18xXzEuZG9uZTsgYWN0aW9uQmxvY2tzXzFfMSA9IGFjdGlvbkJsb2Nrc18xLm5leHQoKSkge1xuICAgICAgdmFyIGJsb2NrID0gYWN0aW9uQmxvY2tzXzFfMS52YWx1ZTtcbiAgICAgIHZhciBpID0gMDtcblxuICAgICAgd2hpbGUgKGkgPCBibG9jay5hY3Rpb25zLmxlbmd0aCkge1xuICAgICAgICBpZiAoYmxvY2suYWN0aW9uc1tpXS50eXBlID09PSBhc3NpZ24kMSkge1xuICAgICAgICAgIGFzc2lnbkFjdGlvbnMucHVzaChibG9jay5hY3Rpb25zW2ldKTtcbiAgICAgICAgICBibG9jay5hY3Rpb25zLnNwbGljZShpLCAxKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGkrKztcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVfMV8xKSB7XG4gICAgZV8xID0ge1xuICAgICAgZXJyb3I6IGVfMV8xXG4gICAgfTtcbiAgfSBmaW5hbGx5IHtcbiAgICB0cnkge1xuICAgICAgaWYgKGFjdGlvbkJsb2Nrc18xXzEgJiYgIWFjdGlvbkJsb2Nrc18xXzEuZG9uZSAmJiAoX2EgPSBhY3Rpb25CbG9ja3NfMS5yZXR1cm4pKSBfYS5jYWxsKGFjdGlvbkJsb2Nrc18xKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhc3NpZ25BY3Rpb25zO1xufTtcblxuZnVuY3Rpb24gcmVzb2x2ZUFjdGlvbnMobWFjaGluZSwgY3VycmVudFN0YXRlLCBjdXJyZW50Q29udGV4dCwgX2V2ZW50LCBhY3Rpb25CbG9ja3MsIHByZWRpY3RhYmxlRXhlYywgcHJlc2VydmVBY3Rpb25PcmRlcikge1xuICBpZiAocHJlc2VydmVBY3Rpb25PcmRlciA9PT0gdm9pZCAwKSB7XG4gICAgcHJlc2VydmVBY3Rpb25PcmRlciA9IGZhbHNlO1xuICB9XG5cbiAgdmFyIGFzc2lnbkFjdGlvbnMgPSBwcmVzZXJ2ZUFjdGlvbk9yZGVyID8gW10gOiBwbHVja0Fzc2lnbnMoYWN0aW9uQmxvY2tzKTtcbiAgdmFyIHVwZGF0ZWRDb250ZXh0ID0gYXNzaWduQWN0aW9ucy5sZW5ndGggPyB1cGRhdGVDb250ZXh0KGN1cnJlbnRDb250ZXh0LCBfZXZlbnQsIGFzc2lnbkFjdGlvbnMsIGN1cnJlbnRTdGF0ZSkgOiBjdXJyZW50Q29udGV4dDtcbiAgdmFyIHByZXNlcnZlZENvbnRleHRzID0gcHJlc2VydmVBY3Rpb25PcmRlciA/IFtjdXJyZW50Q29udGV4dF0gOiB1bmRlZmluZWQ7XG4gIHZhciBkZWZlcnJlZFRvQmxvY2tFbmQgPSBbXTtcblxuICBmdW5jdGlvbiBoYW5kbGVBY3Rpb24oYmxvY2tUeXBlLCBhY3Rpb25PYmplY3QpIHtcbiAgICB2YXIgX2E7XG5cbiAgICBzd2l0Y2ggKGFjdGlvbk9iamVjdC50eXBlKSB7XG4gICAgICBjYXNlIHJhaXNlJDE6XG4gICAgICAgIHtcbiAgICAgICAgICB2YXIgcmFpc2VkQWN0aW9uID0gcmVzb2x2ZVJhaXNlKGFjdGlvbk9iamVjdCwgdXBkYXRlZENvbnRleHQsIF9ldmVudCwgbWFjaGluZS5vcHRpb25zLmRlbGF5cyk7XG5cbiAgICAgICAgICBpZiAocHJlZGljdGFibGVFeGVjICYmIHR5cGVvZiByYWlzZWRBY3Rpb24uZGVsYXkgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBwcmVkaWN0YWJsZUV4ZWMocmFpc2VkQWN0aW9uLCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gcmFpc2VkQWN0aW9uO1xuICAgICAgICB9XG5cbiAgICAgIGNhc2Ugc2VuZCQxOlxuICAgICAgICB2YXIgc2VuZEFjdGlvbiA9IHJlc29sdmVTZW5kKGFjdGlvbk9iamVjdCwgdXBkYXRlZENvbnRleHQsIF9ldmVudCwgbWFjaGluZS5vcHRpb25zLmRlbGF5cyk7IC8vIFRPRE86IGZpeCBBY3Rpb25UeXBlcy5Jbml0XG5cbiAgICAgICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICAgICAgdmFyIGNvbmZpZ3VyZWREZWxheSA9IGFjdGlvbk9iamVjdC5kZWxheTsgLy8gd2FybiBhZnRlciByZXNvbHZpbmcgYXMgd2UgY2FuIGNyZWF0ZSBiZXR0ZXIgY29udGV4dHVhbCBtZXNzYWdlIGhlcmVcblxuICAgICAgICAgIHdhcm4oIWlzU3RyaW5nKGNvbmZpZ3VyZWREZWxheSkgfHwgdHlwZW9mIHNlbmRBY3Rpb24uZGVsYXkgPT09ICdudW1iZXInLCAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICAgICAgXCJObyBkZWxheSByZWZlcmVuY2UgZm9yIGRlbGF5IGV4cHJlc3Npb24gJ1wiLmNvbmNhdChjb25maWd1cmVkRGVsYXksIFwiJyB3YXMgZm91bmQgb24gbWFjaGluZSAnXCIpLmNvbmNhdChtYWNoaW5lLmlkLCBcIidcIikpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByZWRpY3RhYmxlRXhlYyAmJiBzZW5kQWN0aW9uLnRvICE9PSBTcGVjaWFsVGFyZ2V0cy5JbnRlcm5hbCkge1xuICAgICAgICAgIGlmIChibG9ja1R5cGUgPT09ICdlbnRyeScpIHtcbiAgICAgICAgICAgIGRlZmVycmVkVG9CbG9ja0VuZC5wdXNoKHNlbmRBY3Rpb24pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcmVkaWN0YWJsZUV4ZWMoc2VuZEFjdGlvbiwgdXBkYXRlZENvbnRleHQsIF9ldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbmRBY3Rpb247XG5cbiAgICAgIGNhc2UgbG9nJDE6XG4gICAgICAgIHtcbiAgICAgICAgICB2YXIgcmVzb2x2ZWQgPSByZXNvbHZlTG9nKGFjdGlvbk9iamVjdCwgdXBkYXRlZENvbnRleHQsIF9ldmVudCk7XG4gICAgICAgICAgcHJlZGljdGFibGVFeGVjID09PSBudWxsIHx8IHByZWRpY3RhYmxlRXhlYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogcHJlZGljdGFibGVFeGVjKHJlc29sdmVkLCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50KTtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZWQ7XG4gICAgICAgIH1cblxuICAgICAgY2FzZSBjaG9vc2UkMTpcbiAgICAgICAge1xuICAgICAgICAgIHZhciBjaG9vc2VBY3Rpb24gPSBhY3Rpb25PYmplY3Q7XG4gICAgICAgICAgdmFyIG1hdGNoZWRBY3Rpb25zID0gKF9hID0gY2hvb3NlQWN0aW9uLmNvbmRzLmZpbmQoZnVuY3Rpb24gKGNvbmRpdGlvbikge1xuICAgICAgICAgICAgdmFyIGd1YXJkID0gdG9HdWFyZChjb25kaXRpb24uY29uZCwgbWFjaGluZS5vcHRpb25zLmd1YXJkcyk7XG4gICAgICAgICAgICByZXR1cm4gIWd1YXJkIHx8IGV2YWx1YXRlR3VhcmQobWFjaGluZSwgZ3VhcmQsIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQsICFwcmVkaWN0YWJsZUV4ZWMgPyBjdXJyZW50U3RhdGUgOiB1bmRlZmluZWQpO1xuICAgICAgICAgIH0pKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuYWN0aW9ucztcblxuICAgICAgICAgIGlmICghbWF0Y2hlZEFjdGlvbnMpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgX2IgPSBfX3JlYWQocmVzb2x2ZUFjdGlvbnMobWFjaGluZSwgY3VycmVudFN0YXRlLCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50LCBbe1xuICAgICAgICAgICAgdHlwZTogYmxvY2tUeXBlLFxuICAgICAgICAgICAgYWN0aW9uczogdG9BY3Rpb25PYmplY3RzKHRvQXJyYXkobWF0Y2hlZEFjdGlvbnMpLCBtYWNoaW5lLm9wdGlvbnMuYWN0aW9ucylcbiAgICAgICAgICB9XSwgcHJlZGljdGFibGVFeGVjLCBwcmVzZXJ2ZUFjdGlvbk9yZGVyKSwgMiksXG4gICAgICAgICAgICAgIHJlc29sdmVkQWN0aW9uc0Zyb21DaG9vc2UgPSBfYlswXSxcbiAgICAgICAgICAgICAgcmVzb2x2ZWRDb250ZXh0RnJvbUNob29zZSA9IF9iWzFdO1xuXG4gICAgICAgICAgdXBkYXRlZENvbnRleHQgPSByZXNvbHZlZENvbnRleHRGcm9tQ2hvb3NlO1xuICAgICAgICAgIHByZXNlcnZlZENvbnRleHRzID09PSBudWxsIHx8IHByZXNlcnZlZENvbnRleHRzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwcmVzZXJ2ZWRDb250ZXh0cy5wdXNoKHVwZGF0ZWRDb250ZXh0KTtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZWRBY3Rpb25zRnJvbUNob29zZTtcbiAgICAgICAgfVxuXG4gICAgICBjYXNlIHB1cmUkMTpcbiAgICAgICAge1xuICAgICAgICAgIHZhciBtYXRjaGVkQWN0aW9ucyA9IGFjdGlvbk9iamVjdC5nZXQodXBkYXRlZENvbnRleHQsIF9ldmVudC5kYXRhKTtcblxuICAgICAgICAgIGlmICghbWF0Y2hlZEFjdGlvbnMpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgX2MgPSBfX3JlYWQocmVzb2x2ZUFjdGlvbnMobWFjaGluZSwgY3VycmVudFN0YXRlLCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50LCBbe1xuICAgICAgICAgICAgdHlwZTogYmxvY2tUeXBlLFxuICAgICAgICAgICAgYWN0aW9uczogdG9BY3Rpb25PYmplY3RzKHRvQXJyYXkobWF0Y2hlZEFjdGlvbnMpLCBtYWNoaW5lLm9wdGlvbnMuYWN0aW9ucylcbiAgICAgICAgICB9XSwgcHJlZGljdGFibGVFeGVjLCBwcmVzZXJ2ZUFjdGlvbk9yZGVyKSwgMiksXG4gICAgICAgICAgICAgIHJlc29sdmVkQWN0aW9uc0Zyb21QdXJlID0gX2NbMF0sXG4gICAgICAgICAgICAgIHJlc29sdmVkQ29udGV4dCA9IF9jWzFdO1xuXG4gICAgICAgICAgdXBkYXRlZENvbnRleHQgPSByZXNvbHZlZENvbnRleHQ7XG4gICAgICAgICAgcHJlc2VydmVkQ29udGV4dHMgPT09IG51bGwgfHwgcHJlc2VydmVkQ29udGV4dHMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHByZXNlcnZlZENvbnRleHRzLnB1c2godXBkYXRlZENvbnRleHQpO1xuICAgICAgICAgIHJldHVybiByZXNvbHZlZEFjdGlvbnNGcm9tUHVyZTtcbiAgICAgICAgfVxuXG4gICAgICBjYXNlIHN0b3AkMTpcbiAgICAgICAge1xuICAgICAgICAgIHZhciByZXNvbHZlZCA9IHJlc29sdmVTdG9wKGFjdGlvbk9iamVjdCwgdXBkYXRlZENvbnRleHQsIF9ldmVudCk7XG4gICAgICAgICAgcHJlZGljdGFibGVFeGVjID09PSBudWxsIHx8IHByZWRpY3RhYmxlRXhlYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogcHJlZGljdGFibGVFeGVjKHJlc29sdmVkLCBjdXJyZW50Q29udGV4dCwgX2V2ZW50KTtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZWQ7XG4gICAgICAgIH1cblxuICAgICAgY2FzZSBhc3NpZ24kMTpcbiAgICAgICAge1xuICAgICAgICAgIHVwZGF0ZWRDb250ZXh0ID0gdXBkYXRlQ29udGV4dCh1cGRhdGVkQ29udGV4dCwgX2V2ZW50LCBbYWN0aW9uT2JqZWN0XSwgIXByZWRpY3RhYmxlRXhlYyA/IGN1cnJlbnRTdGF0ZSA6IHVuZGVmaW5lZCk7XG4gICAgICAgICAgcHJlc2VydmVkQ29udGV4dHMgPT09IG51bGwgfHwgcHJlc2VydmVkQ29udGV4dHMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHByZXNlcnZlZENvbnRleHRzLnB1c2godXBkYXRlZENvbnRleHQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHZhciByZXNvbHZlZEFjdGlvbk9iamVjdCA9IHRvQWN0aW9uT2JqZWN0KGFjdGlvbk9iamVjdCwgbWFjaGluZS5vcHRpb25zLmFjdGlvbnMpO1xuICAgICAgICB2YXIgZXhlY18xID0gcmVzb2x2ZWRBY3Rpb25PYmplY3QuZXhlYztcblxuICAgICAgICBpZiAocHJlZGljdGFibGVFeGVjKSB7XG4gICAgICAgICAgcHJlZGljdGFibGVFeGVjKHJlc29sdmVkQWN0aW9uT2JqZWN0LCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50KTtcbiAgICAgICAgfSBlbHNlIGlmIChleGVjXzEgJiYgcHJlc2VydmVkQ29udGV4dHMpIHtcbiAgICAgICAgICB2YXIgY29udGV4dEluZGV4XzEgPSBwcmVzZXJ2ZWRDb250ZXh0cy5sZW5ndGggLSAxO1xuXG4gICAgICAgICAgdmFyIHdyYXBwZWQgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgcmVzb2x2ZWRBY3Rpb25PYmplY3QpLCB7XG4gICAgICAgICAgICBleGVjOiBmdW5jdGlvbiAoX2N0eCkge1xuICAgICAgICAgICAgICB2YXIgYXJncyA9IFtdO1xuXG4gICAgICAgICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgYXJnc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGV4ZWNfMS5hcHBseSh2b2lkIDAsIF9fc3ByZWFkQXJyYXkoW3ByZXNlcnZlZENvbnRleHRzW2NvbnRleHRJbmRleF8xXV0sIF9fcmVhZChhcmdzKSwgZmFsc2UpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJlc29sdmVkQWN0aW9uT2JqZWN0ID0gd3JhcHBlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXNvbHZlZEFjdGlvbk9iamVjdDtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwcm9jZXNzQmxvY2soYmxvY2spIHtcbiAgICB2YXIgZV8yLCBfYTtcblxuICAgIHZhciByZXNvbHZlZEFjdGlvbnMgPSBbXTtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBfYiA9IF9fdmFsdWVzKGJsb2NrLmFjdGlvbnMpLCBfYyA9IF9iLm5leHQoKTsgIV9jLmRvbmU7IF9jID0gX2IubmV4dCgpKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBfYy52YWx1ZTtcbiAgICAgICAgdmFyIHJlc29sdmVkID0gaGFuZGxlQWN0aW9uKGJsb2NrLnR5cGUsIGFjdGlvbik7XG5cbiAgICAgICAgaWYgKHJlc29sdmVkKSB7XG4gICAgICAgICAgcmVzb2x2ZWRBY3Rpb25zID0gcmVzb2x2ZWRBY3Rpb25zLmNvbmNhdChyZXNvbHZlZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzJfMSkge1xuICAgICAgZV8yID0ge1xuICAgICAgICBlcnJvcjogZV8yXzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfYyAmJiAhX2MuZG9uZSAmJiAoX2EgPSBfYi5yZXR1cm4pKSBfYS5jYWxsKF9iKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzIpIHRocm93IGVfMi5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkZWZlcnJlZFRvQmxvY2tFbmQuZm9yRWFjaChmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICBwcmVkaWN0YWJsZUV4ZWMoYWN0aW9uLCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50KTtcbiAgICB9KTtcbiAgICBkZWZlcnJlZFRvQmxvY2tFbmQubGVuZ3RoID0gMDtcbiAgICByZXR1cm4gcmVzb2x2ZWRBY3Rpb25zO1xuICB9XG5cbiAgdmFyIHJlc29sdmVkQWN0aW9ucyA9IGZsYXR0ZW4oYWN0aW9uQmxvY2tzLm1hcChwcm9jZXNzQmxvY2spKTtcbiAgcmV0dXJuIFtyZXNvbHZlZEFjdGlvbnMsIHVwZGF0ZWRDb250ZXh0XTtcbn1cblxuZXhwb3J0IHsgYWZ0ZXIsIGFzc2lnbiwgY2FuY2VsLCBjaG9vc2UsIGRvbmUsIGRvbmVJbnZva2UsIGVycm9yLCBlc2NhbGF0ZSwgZm9yd2FyZFRvLCBnZXRBY3Rpb25GdW5jdGlvbiwgaW5pdEV2ZW50LCBpc0FjdGlvbk9iamVjdCwgbG9nLCBwdXJlLCByYWlzZSwgcmVzb2x2ZUFjdGlvbnMsIHJlc29sdmVMb2csIHJlc29sdmVSYWlzZSwgcmVzb2x2ZVNlbmQsIHJlc29sdmVTdG9wLCByZXNwb25kLCBzZW5kLCBzZW5kUGFyZW50LCBzZW5kVG8sIHNlbmRVcGRhdGUsIHN0YXJ0LCBzdG9wLCB0b0FjdGlvbk9iamVjdCwgdG9BY3Rpb25PYmplY3RzLCB0b0FjdGl2aXR5RGVmaW5pdGlvbiB9O1xuIiwiaW1wb3J0IHsgZXJyb3IsIGRvbmVJbnZva2UgfSBmcm9tICcuL2FjdGlvbnMuanMnO1xuaW1wb3J0IHsgdG9BY3RvclJlZiB9IGZyb20gJy4vQWN0b3IuanMnO1xuaW1wb3J0IHsgdG9PYnNlcnZlciB9IGZyb20gJy4vdXRpbHMuanMnO1xuXG4vKipcclxuICogUmV0dXJucyBhbiBhY3RvciBiZWhhdmlvciBmcm9tIGEgcmVkdWNlciBhbmQgaXRzIGluaXRpYWwgc3RhdGUuXHJcbiAqXHJcbiAqIEBwYXJhbSB0cmFuc2l0aW9uIFRoZSBwdXJlIHJlZHVjZXIgdGhhdCByZXR1cm5zIHRoZSBuZXh0IHN0YXRlIGdpdmVuIHRoZSBjdXJyZW50IHN0YXRlIGFuZCBldmVudC5cclxuICogQHBhcmFtIGluaXRpYWxTdGF0ZSBUaGUgaW5pdGlhbCBzdGF0ZSBvZiB0aGUgcmVkdWNlci5cclxuICogQHJldHVybnMgQW4gYWN0b3IgYmVoYXZpb3JcclxuICovXG5cbmZ1bmN0aW9uIGZyb21SZWR1Y2VyKHRyYW5zaXRpb24sIGluaXRpYWxTdGF0ZSkge1xuICByZXR1cm4ge1xuICAgIHRyYW5zaXRpb246IHRyYW5zaXRpb24sXG4gICAgaW5pdGlhbFN0YXRlOiBpbml0aWFsU3RhdGVcbiAgfTtcbn1cbmZ1bmN0aW9uIGZyb21Qcm9taXNlKHByb21pc2VGbikge1xuICB2YXIgaW5pdGlhbFN0YXRlID0ge1xuICAgIGVycm9yOiB1bmRlZmluZWQsXG4gICAgZGF0YTogdW5kZWZpbmVkLFxuICAgIHN0YXR1czogJ3BlbmRpbmcnXG4gIH07XG4gIHJldHVybiB7XG4gICAgdHJhbnNpdGlvbjogZnVuY3Rpb24gKHN0YXRlLCBldmVudCwgX2EpIHtcbiAgICAgIHZhciBwYXJlbnQgPSBfYS5wYXJlbnQsXG4gICAgICAgICAgaWQgPSBfYS5pZCxcbiAgICAgICAgICBvYnNlcnZlcnMgPSBfYS5vYnNlcnZlcnM7XG5cbiAgICAgIHN3aXRjaCAoZXZlbnQudHlwZSkge1xuICAgICAgICBjYXNlICdmdWxmaWxsJzpcbiAgICAgICAgICBwYXJlbnQgPT09IG51bGwgfHwgcGFyZW50ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwYXJlbnQuc2VuZChkb25lSW52b2tlKGlkLCBldmVudC5kYXRhKSk7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVycm9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBkYXRhOiBldmVudC5kYXRhLFxuICAgICAgICAgICAgc3RhdHVzOiAnZnVsZmlsbGVkJ1xuICAgICAgICAgIH07XG5cbiAgICAgICAgY2FzZSAncmVqZWN0JzpcbiAgICAgICAgICBwYXJlbnQgPT09IG51bGwgfHwgcGFyZW50ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwYXJlbnQuc2VuZChlcnJvcihpZCwgZXZlbnQuZXJyb3IpKTtcbiAgICAgICAgICBvYnNlcnZlcnMuZm9yRWFjaChmdW5jdGlvbiAob2JzZXJ2ZXIpIHtcbiAgICAgICAgICAgIG9ic2VydmVyLmVycm9yKGV2ZW50LmVycm9yKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZXJyb3I6IGV2ZW50LmVycm9yLFxuICAgICAgICAgICAgZGF0YTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgc3RhdHVzOiAncmVqZWN0ZWQnXG4gICAgICAgICAgfTtcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGluaXRpYWxTdGF0ZTogaW5pdGlhbFN0YXRlLFxuICAgIHN0YXJ0OiBmdW5jdGlvbiAoX2EpIHtcbiAgICAgIHZhciBzZWxmID0gX2Euc2VsZjtcbiAgICAgIHByb21pc2VGbigpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgc2VsZi5zZW5kKHtcbiAgICAgICAgICB0eXBlOiAnZnVsZmlsbCcsXG4gICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICB9KTtcbiAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgc2VsZi5zZW5kKHtcbiAgICAgICAgICB0eXBlOiAncmVqZWN0JyxcbiAgICAgICAgICBlcnJvcjogcmVhc29uXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gaW5pdGlhbFN0YXRlO1xuICAgIH1cbiAgfTtcbn1cbmZ1bmN0aW9uIHNwYXduQmVoYXZpb3IoYmVoYXZpb3IsIG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIHZhciBzdGF0ZSA9IGJlaGF2aW9yLmluaXRpYWxTdGF0ZTtcbiAgdmFyIG9ic2VydmVycyA9IG5ldyBTZXQoKTtcbiAgdmFyIG1haWxib3ggPSBbXTtcbiAgdmFyIGZsdXNoaW5nID0gZmFsc2U7XG5cbiAgdmFyIGZsdXNoID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChmbHVzaGluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZsdXNoaW5nID0gdHJ1ZTtcblxuICAgIHdoaWxlIChtYWlsYm94Lmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciBldmVudF8xID0gbWFpbGJveC5zaGlmdCgpO1xuICAgICAgc3RhdGUgPSBiZWhhdmlvci50cmFuc2l0aW9uKHN0YXRlLCBldmVudF8xLCBhY3RvckN0eCk7XG4gICAgICBvYnNlcnZlcnMuZm9yRWFjaChmdW5jdGlvbiAob2JzZXJ2ZXIpIHtcbiAgICAgICAgcmV0dXJuIG9ic2VydmVyLm5leHQoc3RhdGUpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZmx1c2hpbmcgPSBmYWxzZTtcbiAgfTtcblxuICB2YXIgYWN0b3IgPSB0b0FjdG9yUmVmKHtcbiAgICBpZDogb3B0aW9ucy5pZCxcbiAgICBzZW5kOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIG1haWxib3gucHVzaChldmVudCk7XG4gICAgICBmbHVzaCgpO1xuICAgIH0sXG4gICAgZ2V0U25hcHNob3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9LFxuICAgIHN1YnNjcmliZTogZnVuY3Rpb24gKG5leHQsIGhhbmRsZUVycm9yLCBjb21wbGV0ZSkge1xuICAgICAgdmFyIG9ic2VydmVyID0gdG9PYnNlcnZlcihuZXh0LCBoYW5kbGVFcnJvciwgY29tcGxldGUpO1xuICAgICAgb2JzZXJ2ZXJzLmFkZChvYnNlcnZlcik7XG4gICAgICBvYnNlcnZlci5uZXh0KHN0YXRlKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgb2JzZXJ2ZXJzLmRlbGV0ZShvYnNlcnZlcik7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9KTtcbiAgdmFyIGFjdG9yQ3R4ID0ge1xuICAgIHBhcmVudDogb3B0aW9ucy5wYXJlbnQsXG4gICAgc2VsZjogYWN0b3IsXG4gICAgaWQ6IG9wdGlvbnMuaWQgfHwgJ2Fub255bW91cycsXG4gICAgb2JzZXJ2ZXJzOiBvYnNlcnZlcnNcbiAgfTtcbiAgc3RhdGUgPSBiZWhhdmlvci5zdGFydCA/IGJlaGF2aW9yLnN0YXJ0KGFjdG9yQ3R4KSA6IHN0YXRlO1xuICByZXR1cm4gYWN0b3I7XG59XG5cbmV4cG9ydCB7IGZyb21Qcm9taXNlLCBmcm9tUmVkdWNlciwgc3Bhd25CZWhhdmlvciB9O1xuIiwidmFyIFNUQVRFX0RFTElNSVRFUiA9ICcuJztcbnZhciBFTVBUWV9BQ1RJVklUWV9NQVAgPSB7fTtcbnZhciBERUZBVUxUX0dVQVJEX1RZUEUgPSAneHN0YXRlLmd1YXJkJztcbnZhciBUQVJHRVRMRVNTX0tFWSA9ICcnO1xuXG5leHBvcnQgeyBERUZBVUxUX0dVQVJEX1RZUEUsIEVNUFRZX0FDVElWSVRZX01BUCwgU1RBVEVfREVMSU1JVEVSLCBUQVJHRVRMRVNTX0tFWSB9O1xuIiwiaW1wb3J0IHsgSVNfUFJPRFVDVElPTiB9IGZyb20gJy4vZW52aXJvbm1lbnQuanMnO1xuXG5mdW5jdGlvbiBnZXRHbG9iYWwoKSB7XG4gIGlmICh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZ2xvYmFsVGhpcztcbiAgfVxuXG4gIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gc2VsZjtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiB3aW5kb3c7XG4gIH1cblxuICBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZ2xvYmFsO1xuICB9XG5cbiAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgY29uc29sZS53YXJuKCdYU3RhdGUgY291bGQgbm90IGZpbmQgYSBnbG9iYWwgb2JqZWN0IGluIHRoaXMgZW52aXJvbm1lbnQuIFBsZWFzZSBsZXQgdGhlIG1haW50YWluZXJzIGtub3cgYW5kIHJhaXNlIGFuIGlzc3VlIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9zdGF0ZWx5YWkveHN0YXRlL2lzc3VlcycpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldERldlRvb2xzKCkge1xuICB2YXIgZ2xvYmFsID0gZ2V0R2xvYmFsKCk7XG5cbiAgaWYgKGdsb2JhbCAmJiAnX194c3RhdGVfXycgaW4gZ2xvYmFsKSB7XG4gICAgcmV0dXJuIGdsb2JhbC5fX3hzdGF0ZV9fO1xuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gcmVnaXN0ZXJTZXJ2aWNlKHNlcnZpY2UpIHtcbiAgaWYgKCFnZXRHbG9iYWwoKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBkZXZUb29scyA9IGdldERldlRvb2xzKCk7XG5cbiAgaWYgKGRldlRvb2xzKSB7XG4gICAgZGV2VG9vbHMucmVnaXN0ZXIoc2VydmljZSk7XG4gIH1cbn1cblxuZXhwb3J0IHsgZ2V0R2xvYmFsLCByZWdpc3RlclNlcnZpY2UgfTtcbiIsInZhciBJU19QUk9EVUNUSU9OID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJztcblxuZXhwb3J0IHsgSVNfUFJPRFVDVElPTiB9O1xuIiwiaW1wb3J0IHsgYXNzaWduIGFzIGFzc2lnbiQxLCBjYW5jZWwgYXMgY2FuY2VsJDEsIHNlbmQgYXMgc2VuZCQxLCBzZW5kVG8gYXMgc2VuZFRvJDEsIHNlbmRQYXJlbnQgYXMgc2VuZFBhcmVudCQxLCBzZW5kVXBkYXRlIGFzIHNlbmRVcGRhdGUkMSwgZm9yd2FyZFRvIGFzIGZvcndhcmRUbyQxLCBkb25lSW52b2tlIGFzIGRvbmVJbnZva2UkMSwgcmFpc2UgYXMgcmFpc2UkMSwgbG9nIGFzIGxvZyQxLCBwdXJlIGFzIHB1cmUkMSwgY2hvb3NlIGFzIGNob29zZSQxLCBzdG9wIGFzIHN0b3AkMSB9IGZyb20gJy4vYWN0aW9ucy5qcyc7XG5pbXBvcnQgKiBhcyBhY3Rpb25zIGZyb20gJy4vYWN0aW9ucy5qcyc7XG5leHBvcnQgeyBhY3Rpb25zIH07XG5leHBvcnQgeyB0b0FjdG9yUmVmIH0gZnJvbSAnLi9BY3Rvci5qcyc7XG5leHBvcnQgeyBJbnRlcnByZXRlciwgSW50ZXJwcmV0ZXJTdGF0dXMsIGludGVycHJldCwgc3Bhd24gfSBmcm9tICcuL2ludGVycHJldGVyLmpzJztcbmV4cG9ydCB7IE1hY2hpbmUsIGNyZWF0ZU1hY2hpbmUgfSBmcm9tICcuL01hY2hpbmUuanMnO1xuZXhwb3J0IHsgbWFwU3RhdGUgfSBmcm9tICcuL21hcFN0YXRlLmpzJztcbmV4cG9ydCB7IG1hdGNoU3RhdGUgfSBmcm9tICcuL21hdGNoLmpzJztcbmV4cG9ydCB7IGNyZWF0ZVNjaGVtYSwgdCB9IGZyb20gJy4vc2NoZW1hLmpzJztcbmV4cG9ydCB7IFN0YXRlIH0gZnJvbSAnLi9TdGF0ZS5qcyc7XG5leHBvcnQgeyBTdGF0ZU5vZGUgfSBmcm9tICcuL1N0YXRlTm9kZS5qcyc7XG5leHBvcnQgeyBzcGF3bkJlaGF2aW9yIH0gZnJvbSAnLi9iZWhhdmlvcnMuanMnO1xuZXhwb3J0IHsgQWN0aW9uVHlwZXMsIFNwZWNpYWxUYXJnZXRzIH0gZnJvbSAnLi90eXBlcy5qcyc7XG5leHBvcnQgeyBtYXRjaGVzU3RhdGUsIHRvRXZlbnRPYmplY3QsIHRvT2JzZXJ2ZXIsIHRvU0NYTUxFdmVudCB9IGZyb20gJy4vdXRpbHMuanMnO1xuXG52YXIgYXNzaWduID0gYXNzaWduJDEsXG4gICAgY2FuY2VsID0gY2FuY2VsJDEsXG4gICAgc2VuZCA9IHNlbmQkMSxcbiAgICBzZW5kVG8gPSBzZW5kVG8kMSxcbiAgICBzZW5kUGFyZW50ID0gc2VuZFBhcmVudCQxLFxuICAgIHNlbmRVcGRhdGUgPSBzZW5kVXBkYXRlJDEsXG4gICAgZm9yd2FyZFRvID0gZm9yd2FyZFRvJDEsXG4gICAgZG9uZUludm9rZSA9IGRvbmVJbnZva2UkMSxcbiAgICByYWlzZSA9IHJhaXNlJDEsXG4gICAgbG9nID0gbG9nJDEsXG4gICAgcHVyZSA9IHB1cmUkMSxcbiAgICBjaG9vc2UgPSBjaG9vc2UkMSxcbiAgICBzdG9wID0gc3RvcCQxO1xuXG5leHBvcnQgeyBhc3NpZ24sIGNhbmNlbCwgY2hvb3NlLCBkb25lSW52b2tlLCBmb3J3YXJkVG8sIGxvZywgcHVyZSwgcmFpc2UsIHNlbmQsIHNlbmRQYXJlbnQsIHNlbmRUbywgc2VuZFVwZGF0ZSwgc3RvcCB9O1xuIiwiaW1wb3J0IHsgX192YWx1ZXMsIF9fc3ByZWFkQXJyYXksIF9fcmVhZCwgX19hc3NpZ24gfSBmcm9tICcuL192aXJ0dWFsL190c2xpYi5qcyc7XG5pbXBvcnQgeyBTcGVjaWFsVGFyZ2V0cywgQWN0aW9uVHlwZXMgfSBmcm9tICcuL3R5cGVzLmpzJztcbmltcG9ydCB7IGlzU3RhdGVDb25maWcsIFN0YXRlLCBiaW5kQWN0aW9uVG9TdGF0ZSB9IGZyb20gJy4vU3RhdGUuanMnO1xuaW1wb3J0IHsgZXJyb3JQbGF0Zm9ybSwgdXBkYXRlLCBlcnJvciBhcyBlcnJvciQxLCBsb2csIHN0b3AsIHN0YXJ0LCBjYW5jZWwsIHNlbmQsIHJhaXNlIH0gZnJvbSAnLi9hY3Rpb25UeXBlcy5qcyc7XG5pbXBvcnQgeyBpbml0RXZlbnQsIGRvbmVJbnZva2UsIHRvQWN0aW9uT2JqZWN0cywgcmVzb2x2ZUFjdGlvbnMsIGVycm9yLCBnZXRBY3Rpb25GdW5jdGlvbiB9IGZyb20gJy4vYWN0aW9ucy5qcyc7XG5pbXBvcnQgeyBJU19QUk9EVUNUSU9OIH0gZnJvbSAnLi9lbnZpcm9ubWVudC5qcyc7XG5pbXBvcnQgeyB3YXJuLCBtYXBDb250ZXh0LCB0b09ic2VydmVyLCBpc0Z1bmN0aW9uLCB0b1NDWE1MRXZlbnQsIGZsYXR0ZW4sIGlzUmFpc2FibGVBY3Rpb24sIGlzUHJvbWlzZUxpa2UsIGlzT2JzZXJ2YWJsZSwgaXNNYWNoaW5lLCBpc0JlaGF2aW9yLCByZXBvcnRVbmhhbmRsZWRFeGNlcHRpb25Pbkludm9jYXRpb24sIHN5bWJvbE9ic2VydmFibGUsIGlzQXJyYXksIHRvRXZlbnRPYmplY3QsIGlzU3RyaW5nLCBpc0FjdG9yLCB0b0ludm9rZVNvdXJjZSwgdW5pcXVlSWQgfSBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7IFNjaGVkdWxlciB9IGZyb20gJy4vc2NoZWR1bGVyLmpzJztcbmltcG9ydCB7IGNyZWF0ZURlZmVycmVkQWN0b3IsIGlzU3Bhd25lZEFjdG9yIH0gZnJvbSAnLi9BY3Rvci5qcyc7XG5pbXBvcnQgeyByZWdpc3RyeSB9IGZyb20gJy4vcmVnaXN0cnkuanMnO1xuaW1wb3J0IHsgZ2V0R2xvYmFsLCByZWdpc3RlclNlcnZpY2UgfSBmcm9tICcuL2RldlRvb2xzLmpzJztcbmltcG9ydCB7IHByb3ZpZGUsIGNvbnN1bWUgfSBmcm9tICcuL3NlcnZpY2VTY29wZS5qcyc7XG5pbXBvcnQgeyBzcGF3bkJlaGF2aW9yIH0gZnJvbSAnLi9iZWhhdmlvcnMuanMnO1xuXG52YXIgREVGQVVMVF9TUEFXTl9PUFRJT05TID0ge1xuICBzeW5jOiBmYWxzZSxcbiAgYXV0b0ZvcndhcmQ6IGZhbHNlXG59O1xudmFyIEludGVycHJldGVyU3RhdHVzO1xuXG4oZnVuY3Rpb24gKEludGVycHJldGVyU3RhdHVzKSB7XG4gIEludGVycHJldGVyU3RhdHVzW0ludGVycHJldGVyU3RhdHVzW1wiTm90U3RhcnRlZFwiXSA9IDBdID0gXCJOb3RTdGFydGVkXCI7XG4gIEludGVycHJldGVyU3RhdHVzW0ludGVycHJldGVyU3RhdHVzW1wiUnVubmluZ1wiXSA9IDFdID0gXCJSdW5uaW5nXCI7XG4gIEludGVycHJldGVyU3RhdHVzW0ludGVycHJldGVyU3RhdHVzW1wiU3RvcHBlZFwiXSA9IDJdID0gXCJTdG9wcGVkXCI7XG59KShJbnRlcnByZXRlclN0YXR1cyB8fCAoSW50ZXJwcmV0ZXJTdGF0dXMgPSB7fSkpO1xuXG52YXIgSW50ZXJwcmV0ZXIgPVxuLyojX19QVVJFX18qL1xuXG4vKiogQGNsYXNzICovXG5mdW5jdGlvbiAoKSB7XG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYSBuZXcgSW50ZXJwcmV0ZXIgaW5zdGFuY2UgKGkuZS4sIHNlcnZpY2UpIGZvciB0aGUgZ2l2ZW4gbWFjaGluZSB3aXRoIHRoZSBwcm92aWRlZCBvcHRpb25zLCBpZiBhbnkuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gbWFjaGluZSBUaGUgbWFjaGluZSB0byBiZSBpbnRlcnByZXRlZFxyXG4gICAqIEBwYXJhbSBvcHRpb25zIEludGVycHJldGVyIG9wdGlvbnNcclxuICAgKi9cbiAgZnVuY3Rpb24gSW50ZXJwcmV0ZXIobWFjaGluZSwgb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICAgIG9wdGlvbnMgPSBJbnRlcnByZXRlci5kZWZhdWx0T3B0aW9ucztcbiAgICB9XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdGhpcy5tYWNoaW5lID0gbWFjaGluZTtcbiAgICB0aGlzLmRlbGF5ZWRFdmVudHNNYXAgPSB7fTtcbiAgICB0aGlzLmxpc3RlbmVycyA9IG5ldyBTZXQoKTtcbiAgICB0aGlzLmNvbnRleHRMaXN0ZW5lcnMgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5zdG9wTGlzdGVuZXJzID0gbmV3IFNldCgpO1xuICAgIHRoaXMuZG9uZUxpc3RlbmVycyA9IG5ldyBTZXQoKTtcbiAgICB0aGlzLmV2ZW50TGlzdGVuZXJzID0gbmV3IFNldCgpO1xuICAgIHRoaXMuc2VuZExpc3RlbmVycyA9IG5ldyBTZXQoKTtcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgdGhlIHNlcnZpY2UgaXMgc3RhcnRlZC5cclxuICAgICAqL1xuXG4gICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIHRoaXMuc3RhdHVzID0gSW50ZXJwcmV0ZXJTdGF0dXMuTm90U3RhcnRlZDtcbiAgICB0aGlzLmNoaWxkcmVuID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuZm9yd2FyZFRvID0gbmV3IFNldCgpO1xuICAgIHRoaXMuX291dGdvaW5nUXVldWUgPSBbXTtcbiAgICAvKipcclxuICAgICAqIEFsaWFzIGZvciBJbnRlcnByZXRlci5wcm90b3R5cGUuc3RhcnRcclxuICAgICAqL1xuXG4gICAgdGhpcy5pbml0ID0gdGhpcy5zdGFydDtcbiAgICAvKipcclxuICAgICAqIFNlbmRzIGFuIGV2ZW50IHRvIHRoZSBydW5uaW5nIGludGVycHJldGVyIHRvIHRyaWdnZXIgYSB0cmFuc2l0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEFuIGFycmF5IG9mIGV2ZW50cyAoYmF0Y2hlZCkgY2FuIGJlIHNlbnQgYXMgd2VsbCwgd2hpY2ggd2lsbCBzZW5kIGFsbFxyXG4gICAgICogYmF0Y2hlZCBldmVudHMgdG8gdGhlIHJ1bm5pbmcgaW50ZXJwcmV0ZXIuIFRoZSBsaXN0ZW5lcnMgd2lsbCBiZVxyXG4gICAgICogbm90aWZpZWQgb25seSAqKm9uY2UqKiB3aGVuIGFsbCBldmVudHMgYXJlIHByb2Nlc3NlZC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50KHMpIHRvIHNlbmRcclxuICAgICAqL1xuXG4gICAgdGhpcy5zZW5kID0gZnVuY3Rpb24gKGV2ZW50LCBwYXlsb2FkKSB7XG4gICAgICBpZiAoaXNBcnJheShldmVudCkpIHtcbiAgICAgICAgX3RoaXMuYmF0Y2goZXZlbnQpO1xuXG4gICAgICAgIHJldHVybiBfdGhpcy5zdGF0ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIF9ldmVudCA9IHRvU0NYTUxFdmVudCh0b0V2ZW50T2JqZWN0KGV2ZW50LCBwYXlsb2FkKSk7XG5cbiAgICAgIGlmIChfdGhpcy5zdGF0dXMgPT09IEludGVycHJldGVyU3RhdHVzLlN0b3BwZWQpIHtcbiAgICAgICAgLy8gZG8gbm90aGluZ1xuICAgICAgICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICAgICAgICB3YXJuKGZhbHNlLCBcIkV2ZW50IFxcXCJcIi5jb25jYXQoX2V2ZW50Lm5hbWUsIFwiXFxcIiB3YXMgc2VudCB0byBzdG9wcGVkIHNlcnZpY2UgXFxcIlwiKS5jb25jYXQoX3RoaXMubWFjaGluZS5pZCwgXCJcXFwiLiBUaGlzIHNlcnZpY2UgaGFzIGFscmVhZHkgcmVhY2hlZCBpdHMgZmluYWwgc3RhdGUsIGFuZCB3aWxsIG5vdCB0cmFuc2l0aW9uLlxcbkV2ZW50OiBcIikuY29uY2F0KEpTT04uc3RyaW5naWZ5KF9ldmVudC5kYXRhKSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF90aGlzLnN0YXRlO1xuICAgICAgfVxuXG4gICAgICBpZiAoX3RoaXMuc3RhdHVzICE9PSBJbnRlcnByZXRlclN0YXR1cy5SdW5uaW5nICYmICFfdGhpcy5vcHRpb25zLmRlZmVyRXZlbnRzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkV2ZW50IFxcXCJcIi5jb25jYXQoX2V2ZW50Lm5hbWUsIFwiXFxcIiB3YXMgc2VudCB0byB1bmluaXRpYWxpemVkIHNlcnZpY2UgXFxcIlwiKS5jb25jYXQoX3RoaXMubWFjaGluZS5pZCAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICAgICwgXCJcXFwiLiBNYWtlIHN1cmUgLnN0YXJ0KCkgaXMgY2FsbGVkIGZvciB0aGlzIHNlcnZpY2UsIG9yIHNldCB7IGRlZmVyRXZlbnRzOiB0cnVlIH0gaW4gdGhlIHNlcnZpY2Ugb3B0aW9ucy5cXG5FdmVudDogXCIpLmNvbmNhdChKU09OLnN0cmluZ2lmeShfZXZlbnQuZGF0YSkpKTtcbiAgICAgIH1cblxuICAgICAgX3RoaXMuc2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gRm9yd2FyZCBjb3B5IG9mIGV2ZW50IHRvIGNoaWxkIGFjdG9yc1xuICAgICAgICBfdGhpcy5mb3J3YXJkKF9ldmVudCk7XG5cbiAgICAgICAgdmFyIG5leHRTdGF0ZSA9IF90aGlzLl9uZXh0U3RhdGUoX2V2ZW50KTtcblxuICAgICAgICBfdGhpcy51cGRhdGUobmV4dFN0YXRlLCBfZXZlbnQpO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBfdGhpcy5fc3RhdGU7IC8vIFRPRE86IGRlcHJlY2F0ZSAoc2hvdWxkIHJldHVybiB2b2lkKVxuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnNlbWljb2xvblxuICAgIH07XG5cbiAgICB0aGlzLnNlbmRUbyA9IGZ1bmN0aW9uIChldmVudCwgdG8sIGltbWVkaWF0ZSkge1xuICAgICAgdmFyIGlzUGFyZW50ID0gX3RoaXMucGFyZW50ICYmICh0byA9PT0gU3BlY2lhbFRhcmdldHMuUGFyZW50IHx8IF90aGlzLnBhcmVudC5pZCA9PT0gdG8pO1xuICAgICAgdmFyIHRhcmdldCA9IGlzUGFyZW50ID8gX3RoaXMucGFyZW50IDogaXNTdHJpbmcodG8pID8gdG8gPT09IFNwZWNpYWxUYXJnZXRzLkludGVybmFsID8gX3RoaXMgOiBfdGhpcy5jaGlsZHJlbi5nZXQodG8pIHx8IHJlZ2lzdHJ5LmdldCh0bykgOiBpc0FjdG9yKHRvKSA/IHRvIDogdW5kZWZpbmVkO1xuXG4gICAgICBpZiAoIXRhcmdldCkge1xuICAgICAgICBpZiAoIWlzUGFyZW50KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5hYmxlIHRvIHNlbmQgZXZlbnQgdG8gY2hpbGQgJ1wiLmNvbmNhdCh0bywgXCInIGZyb20gc2VydmljZSAnXCIpLmNvbmNhdChfdGhpcy5pZCwgXCInLlwiKSk7XG4gICAgICAgIH0gLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbnNvbGVcblxuXG4gICAgICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgICAgIHdhcm4oZmFsc2UsIFwiU2VydmljZSAnXCIuY29uY2F0KF90aGlzLmlkLCBcIicgaGFzIG5vIHBhcmVudDogdW5hYmxlIHRvIHNlbmQgZXZlbnQgXCIpLmNvbmNhdChldmVudC50eXBlKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICgnbWFjaGluZScgaW4gdGFyZ2V0KSB7XG4gICAgICAgIC8vIHBlcmhhcHMgdGhvc2UgZXZlbnRzIHNob3VsZCBiZSByZWplY3RlZCBpbiB0aGUgcGFyZW50XG4gICAgICAgIC8vIGJ1dCBhdG0gaXQgZG9lc24ndCBoYXZlIGVhc3kgYWNjZXNzIHRvIGFsbCBvZiB0aGUgaW5mb3JtYXRpb24gdGhhdCBpcyByZXF1aXJlZCB0byBkbyBpdCByZWxpYWJseVxuICAgICAgICBpZiAoX3RoaXMuc3RhdHVzICE9PSBJbnRlcnByZXRlclN0YXR1cy5TdG9wcGVkIHx8IF90aGlzLnBhcmVudCAhPT0gdGFyZ2V0IHx8IC8vIHdlIG5lZWQgdG8gc2VuZCBldmVudHMgdG8gdGhlIHBhcmVudCBmcm9tIGV4aXQgaGFuZGxlcnMgb2YgYSBtYWNoaW5lIHRoYXQgcmVhY2hlZCBpdHMgZmluYWwgc3RhdGVcbiAgICAgICAgX3RoaXMuc3RhdGUuZG9uZSkge1xuICAgICAgICAgIC8vIFNlbmQgU0NYTUwgZXZlbnRzIHRvIG1hY2hpbmVzXG4gICAgICAgICAgdmFyIHNjeG1sRXZlbnQgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgZXZlbnQpLCB7XG4gICAgICAgICAgICBuYW1lOiBldmVudC5uYW1lID09PSBlcnJvciQxID8gXCJcIi5jb25jYXQoZXJyb3IoX3RoaXMuaWQpKSA6IGV2ZW50Lm5hbWUsXG4gICAgICAgICAgICBvcmlnaW46IF90aGlzLnNlc3Npb25JZFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaWYgKCFpbW1lZGlhdGUgJiYgX3RoaXMubWFjaGluZS5jb25maWcucHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHMpIHtcbiAgICAgICAgICAgIF90aGlzLl9vdXRnb2luZ1F1ZXVlLnB1c2goW3RhcmdldCwgc2N4bWxFdmVudF0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YXJnZXQuc2VuZChzY3htbEV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFNlbmQgbm9ybWFsIGV2ZW50cyB0byBvdGhlciB0YXJnZXRzXG4gICAgICAgIGlmICghaW1tZWRpYXRlICYmIF90aGlzLm1hY2hpbmUuY29uZmlnLnByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzKSB7XG4gICAgICAgICAgX3RoaXMuX291dGdvaW5nUXVldWUucHVzaChbdGFyZ2V0LCBldmVudC5kYXRhXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGFyZ2V0LnNlbmQoZXZlbnQuZGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5fZXhlYyA9IGZ1bmN0aW9uIChhY3Rpb24sIGNvbnRleHQsIF9ldmVudCwgYWN0aW9uRnVuY3Rpb25NYXApIHtcbiAgICAgIGlmIChhY3Rpb25GdW5jdGlvbk1hcCA9PT0gdm9pZCAwKSB7XG4gICAgICAgIGFjdGlvbkZ1bmN0aW9uTWFwID0gX3RoaXMubWFjaGluZS5vcHRpb25zLmFjdGlvbnM7XG4gICAgICB9XG5cbiAgICAgIHZhciBhY3Rpb25PckV4ZWMgPSBhY3Rpb24uZXhlYyB8fCBnZXRBY3Rpb25GdW5jdGlvbihhY3Rpb24udHlwZSwgYWN0aW9uRnVuY3Rpb25NYXApO1xuICAgICAgdmFyIGV4ZWMgPSBpc0Z1bmN0aW9uKGFjdGlvbk9yRXhlYykgPyBhY3Rpb25PckV4ZWMgOiBhY3Rpb25PckV4ZWMgPyBhY3Rpb25PckV4ZWMuZXhlYyA6IGFjdGlvbi5leGVjO1xuXG4gICAgICBpZiAoZXhlYykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBleGVjKGNvbnRleHQsIF9ldmVudC5kYXRhLCAhX3RoaXMubWFjaGluZS5jb25maWcucHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHMgPyB7XG4gICAgICAgICAgICBhY3Rpb246IGFjdGlvbixcbiAgICAgICAgICAgIHN0YXRlOiBfdGhpcy5zdGF0ZSxcbiAgICAgICAgICAgIF9ldmVudDogX2V2ZW50XG4gICAgICAgICAgfSA6IHtcbiAgICAgICAgICAgIGFjdGlvbjogYWN0aW9uLFxuICAgICAgICAgICAgX2V2ZW50OiBfZXZlbnRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgaWYgKF90aGlzLnBhcmVudCkge1xuICAgICAgICAgICAgX3RoaXMucGFyZW50LnNlbmQoe1xuICAgICAgICAgICAgICB0eXBlOiAneHN0YXRlLmVycm9yJyxcbiAgICAgICAgICAgICAgZGF0YTogZXJyXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgICAgICBjYXNlIHJhaXNlOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIC8vIGlmIHJhaXNlIGFjdGlvbiByZWFjaGVkIHRoZSBpbnRlcnByZXRlciB0aGVuIGl0J3MgYSBkZWxheWVkIG9uZVxuICAgICAgICAgICAgdmFyIHNlbmRBY3Rpb25fMSA9IGFjdGlvbjtcblxuICAgICAgICAgICAgX3RoaXMuZGVmZXIoc2VuZEFjdGlvbl8xKTtcblxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgIGNhc2Ugc2VuZDpcbiAgICAgICAgICB2YXIgc2VuZEFjdGlvbiA9IGFjdGlvbjtcblxuICAgICAgICAgIGlmICh0eXBlb2Ygc2VuZEFjdGlvbi5kZWxheSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIF90aGlzLmRlZmVyKHNlbmRBY3Rpb24pO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzZW5kQWN0aW9uLnRvKSB7XG4gICAgICAgICAgICAgIF90aGlzLnNlbmRUbyhzZW5kQWN0aW9uLl9ldmVudCwgc2VuZEFjdGlvbi50bywgX2V2ZW50ID09PSBpbml0RXZlbnQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgX3RoaXMuc2VuZChzZW5kQWN0aW9uLl9ldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBjYW5jZWw6XG4gICAgICAgICAgX3RoaXMuY2FuY2VsKGFjdGlvbi5zZW5kSWQpO1xuXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBzdGFydDpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpZiAoX3RoaXMuc3RhdHVzICE9PSBJbnRlcnByZXRlclN0YXR1cy5SdW5uaW5nKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGFjdGl2aXR5ID0gYWN0aW9uLmFjdGl2aXR5OyAvLyBJZiB0aGUgYWN0aXZpdHkgd2lsbCBiZSBzdG9wcGVkIHJpZ2h0IGFmdGVyIGl0J3Mgc3RhcnRlZFxuICAgICAgICAgICAgLy8gKHN1Y2ggYXMgaW4gdHJhbnNpZW50IHN0YXRlcylcbiAgICAgICAgICAgIC8vIGRvbid0IGJvdGhlciBzdGFydGluZyB0aGUgYWN0aXZpdHkuXG5cbiAgICAgICAgICAgIGlmICggLy8gaW4gdjQgd2l0aCBgcHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHNgIGludm9rZXMgYXJlIGNhbGxlZCBlYWdlcmx5IHdoZW4gdGhlIGB0aGlzLnN0YXRlYCBzdGlsbCBwb2ludHMgdG8gdGhlIHByZXZpb3VzIHN0YXRlXG4gICAgICAgICAgICAhX3RoaXMubWFjaGluZS5jb25maWcucHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHMgJiYgIV90aGlzLnN0YXRlLmFjdGl2aXRpZXNbYWN0aXZpdHkuaWQgfHwgYWN0aXZpdHkudHlwZV0pIHtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9IC8vIEludm9rZWQgc2VydmljZXNcblxuXG4gICAgICAgICAgICBpZiAoYWN0aXZpdHkudHlwZSA9PT0gQWN0aW9uVHlwZXMuSW52b2tlKSB7XG4gICAgICAgICAgICAgIHZhciBpbnZva2VTb3VyY2UgPSB0b0ludm9rZVNvdXJjZShhY3Rpdml0eS5zcmMpO1xuICAgICAgICAgICAgICB2YXIgc2VydmljZUNyZWF0b3IgPSBfdGhpcy5tYWNoaW5lLm9wdGlvbnMuc2VydmljZXMgPyBfdGhpcy5tYWNoaW5lLm9wdGlvbnMuc2VydmljZXNbaW52b2tlU291cmNlLnR5cGVdIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICB2YXIgaWQgPSBhY3Rpdml0eS5pZCxcbiAgICAgICAgICAgICAgICAgIGRhdGEgPSBhY3Rpdml0eS5kYXRhO1xuXG4gICAgICAgICAgICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgICAgICAgICAgIHdhcm4oISgnZm9yd2FyZCcgaW4gYWN0aXZpdHkpLCAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICAgICAgICAgICAgXCJgZm9yd2FyZGAgcHJvcGVydHkgaXMgZGVwcmVjYXRlZCAoZm91bmQgaW4gaW52b2NhdGlvbiBvZiAnXCIuY29uY2F0KGFjdGl2aXR5LnNyYywgXCInIGluIGluIG1hY2hpbmUgJ1wiKS5jb25jYXQoX3RoaXMubWFjaGluZS5pZCwgXCInKS4gXCIpICsgXCJQbGVhc2UgdXNlIGBhdXRvRm9yd2FyZGAgaW5zdGVhZC5cIik7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB2YXIgYXV0b0ZvcndhcmQgPSAnYXV0b0ZvcndhcmQnIGluIGFjdGl2aXR5ID8gYWN0aXZpdHkuYXV0b0ZvcndhcmQgOiAhIWFjdGl2aXR5LmZvcndhcmQ7XG5cbiAgICAgICAgICAgICAgaWYgKCFzZXJ2aWNlQ3JlYXRvcikge1xuICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1jb25zb2xlXG4gICAgICAgICAgICAgICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICAgICAgICAgICAgICB3YXJuKGZhbHNlLCBcIk5vIHNlcnZpY2UgZm91bmQgZm9yIGludm9jYXRpb24gJ1wiLmNvbmNhdChhY3Rpdml0eS5zcmMsIFwiJyBpbiBtYWNoaW5lICdcIikuY29uY2F0KF90aGlzLm1hY2hpbmUuaWQsIFwiJy5cIikpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHZhciByZXNvbHZlZERhdGEgPSBkYXRhID8gbWFwQ29udGV4dChkYXRhLCBjb250ZXh0LCBfZXZlbnQpIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgIGlmICh0eXBlb2Ygc2VydmljZUNyZWF0b3IgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgLy8gVE9ETzogd2FyblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHZhciBzb3VyY2UgPSBpc0Z1bmN0aW9uKHNlcnZpY2VDcmVhdG9yKSA/IHNlcnZpY2VDcmVhdG9yKGNvbnRleHQsIF9ldmVudC5kYXRhLCB7XG4gICAgICAgICAgICAgICAgZGF0YTogcmVzb2x2ZWREYXRhLFxuICAgICAgICAgICAgICAgIHNyYzogaW52b2tlU291cmNlLFxuICAgICAgICAgICAgICAgIG1ldGE6IGFjdGl2aXR5Lm1ldGFcbiAgICAgICAgICAgICAgfSkgOiBzZXJ2aWNlQ3JlYXRvcjtcblxuICAgICAgICAgICAgICBpZiAoIXNvdXJjZSkge1xuICAgICAgICAgICAgICAgIC8vIFRPRE86IHdhcm4/XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB2b2lkIDA7XG5cbiAgICAgICAgICAgICAgaWYgKGlzTWFjaGluZShzb3VyY2UpKSB7XG4gICAgICAgICAgICAgICAgc291cmNlID0gcmVzb2x2ZWREYXRhID8gc291cmNlLndpdGhDb250ZXh0KHJlc29sdmVkRGF0YSkgOiBzb3VyY2U7XG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgIGF1dG9Gb3J3YXJkOiBhdXRvRm9yd2FyZFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBfdGhpcy5zcGF3bihzb3VyY2UsIGlkLCBvcHRpb25zKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIF90aGlzLnNwYXduQWN0aXZpdHkoYWN0aXZpdHkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBzdG9wOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIF90aGlzLnN0b3BDaGlsZChhY3Rpb24uYWN0aXZpdHkuaWQpO1xuXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBsb2c6XG4gICAgICAgICAgdmFyIF9hID0gYWN0aW9uLFxuICAgICAgICAgICAgICBsYWJlbCA9IF9hLmxhYmVsLFxuICAgICAgICAgICAgICB2YWx1ZSA9IF9hLnZhbHVlO1xuXG4gICAgICAgICAgaWYgKGxhYmVsKSB7XG4gICAgICAgICAgICBfdGhpcy5sb2dnZXIobGFiZWwsIHZhbHVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX3RoaXMubG9nZ2VyKHZhbHVlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgICAgICAgd2FybihmYWxzZSwgXCJObyBpbXBsZW1lbnRhdGlvbiBmb3VuZCBmb3IgYWN0aW9uIHR5cGUgJ1wiLmNvbmNhdChhY3Rpb24udHlwZSwgXCInXCIpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIHJlc29sdmVkT3B0aW9ucyA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCBJbnRlcnByZXRlci5kZWZhdWx0T3B0aW9ucyksIG9wdGlvbnMpO1xuXG4gICAgdmFyIGNsb2NrID0gcmVzb2x2ZWRPcHRpb25zLmNsb2NrLFxuICAgICAgICBsb2dnZXIgPSByZXNvbHZlZE9wdGlvbnMubG9nZ2VyLFxuICAgICAgICBwYXJlbnQgPSByZXNvbHZlZE9wdGlvbnMucGFyZW50LFxuICAgICAgICBpZCA9IHJlc29sdmVkT3B0aW9ucy5pZDtcbiAgICB2YXIgcmVzb2x2ZWRJZCA9IGlkICE9PSB1bmRlZmluZWQgPyBpZCA6IG1hY2hpbmUuaWQ7XG4gICAgdGhpcy5pZCA9IHJlc29sdmVkSWQ7XG4gICAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XG4gICAgdGhpcy5jbG9jayA9IGNsb2NrO1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMub3B0aW9ucyA9IHJlc29sdmVkT3B0aW9ucztcbiAgICB0aGlzLnNjaGVkdWxlciA9IG5ldyBTY2hlZHVsZXIoe1xuICAgICAgZGVmZXJFdmVudHM6IHRoaXMub3B0aW9ucy5kZWZlckV2ZW50c1xuICAgIH0pO1xuICAgIHRoaXMuc2Vzc2lvbklkID0gcmVnaXN0cnkuYm9va0lkKCk7XG4gIH1cblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoSW50ZXJwcmV0ZXIucHJvdG90eXBlLCBcImluaXRpYWxTdGF0ZVwiLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICBpZiAodGhpcy5faW5pdGlhbFN0YXRlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbml0aWFsU3RhdGU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm92aWRlKHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgX3RoaXMuX2luaXRpYWxTdGF0ZSA9IF90aGlzLm1hY2hpbmUuaW5pdGlhbFN0YXRlO1xuICAgICAgICByZXR1cm4gX3RoaXMuX2luaXRpYWxTdGF0ZTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoSW50ZXJwcmV0ZXIucHJvdG90eXBlLCBcInN0YXRlXCIsIHtcbiAgICAvKipcclxuICAgICAqIEBkZXByZWNhdGVkIFVzZSBgLmdldFNuYXBzaG90KClgIGluc3RlYWQuXHJcbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgICB3YXJuKHRoaXMuc3RhdHVzICE9PSBJbnRlcnByZXRlclN0YXR1cy5Ob3RTdGFydGVkLCBcIkF0dGVtcHRlZCB0byByZWFkIHN0YXRlIGZyb20gdW5pbml0aWFsaXplZCBzZXJ2aWNlICdcIi5jb25jYXQodGhpcy5pZCwgXCInLiBNYWtlIHN1cmUgdGhlIHNlcnZpY2UgaXMgc3RhcnRlZCBmaXJzdC5cIikpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5fc3RhdGU7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG4gIC8qKlxyXG4gICAqIEV4ZWN1dGVzIHRoZSBhY3Rpb25zIG9mIHRoZSBnaXZlbiBzdGF0ZSwgd2l0aCB0aGF0IHN0YXRlJ3MgYGNvbnRleHRgIGFuZCBgZXZlbnRgLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHN0YXRlIFRoZSBzdGF0ZSB3aG9zZSBhY3Rpb25zIHdpbGwgYmUgZXhlY3V0ZWRcclxuICAgKiBAcGFyYW0gYWN0aW9uc0NvbmZpZyBUaGUgYWN0aW9uIGltcGxlbWVudGF0aW9ucyB0byB1c2VcclxuICAgKi9cblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuZXhlY3V0ZSA9IGZ1bmN0aW9uIChzdGF0ZSwgYWN0aW9uc0NvbmZpZykge1xuICAgIHZhciBlXzEsIF9hO1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9iID0gX192YWx1ZXMoc3RhdGUuYWN0aW9ucyksIF9jID0gX2IubmV4dCgpOyAhX2MuZG9uZTsgX2MgPSBfYi5uZXh0KCkpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IF9jLnZhbHVlO1xuICAgICAgICB0aGlzLmV4ZWMoYWN0aW9uLCBzdGF0ZSwgYWN0aW9uc0NvbmZpZyk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV8xXzEpIHtcbiAgICAgIGVfMSA9IHtcbiAgICAgICAgZXJyb3I6IGVfMV8xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoX2MgJiYgIV9jLmRvbmUgJiYgKF9hID0gX2IucmV0dXJuKSkgX2EuY2FsbChfYik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoc3RhdGUsIF9ldmVudCkge1xuICAgIHZhciBlXzIsIF9hLCBlXzMsIF9iLCBlXzQsIF9jLCBlXzUsIF9kO1xuXG4gICAgdmFyIF90aGlzID0gdGhpczsgLy8gQXR0YWNoIHNlc3Npb24gSUQgdG8gc3RhdGVcblxuXG4gICAgc3RhdGUuX3Nlc3Npb25pZCA9IHRoaXMuc2Vzc2lvbklkOyAvLyBVcGRhdGUgc3RhdGVcblxuICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7IC8vIEV4ZWN1dGUgYWN0aW9uc1xuXG4gICAgaWYgKCghdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cyB8fCAvLyB0aGlzIGlzIGN1cnJlbnRseSByZXF1aXJlZCB0byBleGVjdXRlIGluaXRpYWwgYWN0aW9ucyBhcyB0aGUgYGluaXRpYWxTdGF0ZWAgZ2V0cyBjYWNoZWRcbiAgICAvLyB3ZSBjYW4ndCBqdXN0IHJlY29tcHV0ZSBpdCAoYW5kIGV4ZWN1dGUgYWN0aW9ucyB3aGlsZSBkb2luZyBzbykgYmVjYXVzZSB3ZSB0cnkgdG8gcHJlc2VydmUgaWRlbnRpdHkgb2YgYWN0b3JzIGNyZWF0ZWQgd2l0aGluIGluaXRpYWwgYXNzaWduc1xuICAgIF9ldmVudCA9PT0gaW5pdEV2ZW50KSAmJiB0aGlzLm9wdGlvbnMuZXhlY3V0ZSkge1xuICAgICAgdGhpcy5leGVjdXRlKHRoaXMuc3RhdGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgaXRlbSA9IHZvaWQgMDtcblxuICAgICAgd2hpbGUgKGl0ZW0gPSB0aGlzLl9vdXRnb2luZ1F1ZXVlLnNoaWZ0KCkpIHtcbiAgICAgICAgaXRlbVswXS5zZW5kKGl0ZW1bMV0pO1xuICAgICAgfVxuICAgIH0gLy8gVXBkYXRlIGNoaWxkcmVuXG5cblxuICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgIF90aGlzLnN0YXRlLmNoaWxkcmVuW2NoaWxkLmlkXSA9IGNoaWxkO1xuICAgIH0pOyAvLyBEZXYgdG9vbHNcblxuICAgIGlmICh0aGlzLmRldlRvb2xzKSB7XG4gICAgICB0aGlzLmRldlRvb2xzLnNlbmQoX2V2ZW50LmRhdGEsIHN0YXRlKTtcbiAgICB9IC8vIEV4ZWN1dGUgbGlzdGVuZXJzXG5cblxuICAgIGlmIChzdGF0ZS5ldmVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yICh2YXIgX2UgPSBfX3ZhbHVlcyh0aGlzLmV2ZW50TGlzdGVuZXJzKSwgX2YgPSBfZS5uZXh0KCk7ICFfZi5kb25lOyBfZiA9IF9lLm5leHQoKSkge1xuICAgICAgICAgIHZhciBsaXN0ZW5lciA9IF9mLnZhbHVlO1xuICAgICAgICAgIGxpc3RlbmVyKHN0YXRlLmV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZV8yXzEpIHtcbiAgICAgICAgZV8yID0ge1xuICAgICAgICAgIGVycm9yOiBlXzJfMVxuICAgICAgICB9O1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoX2YgJiYgIV9mLmRvbmUgJiYgKF9hID0gX2UucmV0dXJuKSkgX2EuY2FsbChfZSk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgaWYgKGVfMikgdGhyb3cgZV8yLmVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9nID0gX192YWx1ZXModGhpcy5saXN0ZW5lcnMpLCBfaCA9IF9nLm5leHQoKTsgIV9oLmRvbmU7IF9oID0gX2cubmV4dCgpKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lciA9IF9oLnZhbHVlO1xuICAgICAgICBsaXN0ZW5lcihzdGF0ZSwgc3RhdGUuZXZlbnQpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfM18xKSB7XG4gICAgICBlXzMgPSB7XG4gICAgICAgIGVycm9yOiBlXzNfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKF9oICYmICFfaC5kb25lICYmIChfYiA9IF9nLnJldHVybikpIF9iLmNhbGwoX2cpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfMykgdGhyb3cgZV8zLmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBfaiA9IF9fdmFsdWVzKHRoaXMuY29udGV4dExpc3RlbmVycyksIF9rID0gX2oubmV4dCgpOyAhX2suZG9uZTsgX2sgPSBfai5uZXh0KCkpIHtcbiAgICAgICAgdmFyIGNvbnRleHRMaXN0ZW5lciA9IF9rLnZhbHVlO1xuICAgICAgICBjb250ZXh0TGlzdGVuZXIodGhpcy5zdGF0ZS5jb250ZXh0LCB0aGlzLnN0YXRlLmhpc3RvcnkgPyB0aGlzLnN0YXRlLmhpc3RvcnkuY29udGV4dCA6IHVuZGVmaW5lZCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV80XzEpIHtcbiAgICAgIGVfNCA9IHtcbiAgICAgICAgZXJyb3I6IGVfNF8xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoX2sgJiYgIV9rLmRvbmUgJiYgKF9jID0gX2oucmV0dXJuKSkgX2MuY2FsbChfaik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV80KSB0aHJvdyBlXzQuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc3RhdGUuZG9uZSkge1xuICAgICAgLy8gZ2V0IGZpbmFsIGNoaWxkIHN0YXRlIG5vZGVcbiAgICAgIHZhciBmaW5hbENoaWxkU3RhdGVOb2RlID0gc3RhdGUuY29uZmlndXJhdGlvbi5maW5kKGZ1bmN0aW9uIChzbikge1xuICAgICAgICByZXR1cm4gc24udHlwZSA9PT0gJ2ZpbmFsJyAmJiBzbi5wYXJlbnQgPT09IF90aGlzLm1hY2hpbmU7XG4gICAgICB9KTtcbiAgICAgIHZhciBkb25lRGF0YSA9IGZpbmFsQ2hpbGRTdGF0ZU5vZGUgJiYgZmluYWxDaGlsZFN0YXRlTm9kZS5kb25lRGF0YSA/IG1hcENvbnRleHQoZmluYWxDaGlsZFN0YXRlTm9kZS5kb25lRGF0YSwgc3RhdGUuY29udGV4dCwgX2V2ZW50KSA6IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX2RvbmVFdmVudCA9IGRvbmVJbnZva2UodGhpcy5pZCwgZG9uZURhdGEpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciBfbCA9IF9fdmFsdWVzKHRoaXMuZG9uZUxpc3RlbmVycyksIF9tID0gX2wubmV4dCgpOyAhX20uZG9uZTsgX20gPSBfbC5uZXh0KCkpIHtcbiAgICAgICAgICB2YXIgbGlzdGVuZXIgPSBfbS52YWx1ZTtcbiAgICAgICAgICBsaXN0ZW5lcih0aGlzLl9kb25lRXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlXzVfMSkge1xuICAgICAgICBlXzUgPSB7XG4gICAgICAgICAgZXJyb3I6IGVfNV8xXG4gICAgICAgIH07XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChfbSAmJiAhX20uZG9uZSAmJiAoX2QgPSBfbC5yZXR1cm4pKSBfZC5jYWxsKF9sKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBpZiAoZV81KSB0aHJvdyBlXzUuZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5fc3RvcCgpO1xuXG4gICAgICB0aGlzLl9zdG9wQ2hpbGRyZW4oKTtcblxuICAgICAgcmVnaXN0cnkuZnJlZSh0aGlzLnNlc3Npb25JZCk7XG4gICAgfVxuICB9O1xuICAvKlxyXG4gICAqIEFkZHMgYSBsaXN0ZW5lciB0aGF0IGlzIG5vdGlmaWVkIHdoZW5ldmVyIGEgc3RhdGUgdHJhbnNpdGlvbiBoYXBwZW5zLiBUaGUgbGlzdGVuZXIgaXMgY2FsbGVkIHdpdGhcclxuICAgKiB0aGUgbmV4dCBzdGF0ZSBhbmQgdGhlIGV2ZW50IG9iamVjdCB0aGF0IGNhdXNlZCB0aGUgc3RhdGUgdHJhbnNpdGlvbi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBsaXN0ZW5lciBUaGUgc3RhdGUgbGlzdGVuZXJcclxuICAgKi9cblxuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5vblRyYW5zaXRpb24gPSBmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICB0aGlzLmxpc3RlbmVycy5hZGQobGlzdGVuZXIpOyAvLyBTZW5kIGN1cnJlbnQgc3RhdGUgdG8gbGlzdGVuZXJcblxuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gSW50ZXJwcmV0ZXJTdGF0dXMuUnVubmluZykge1xuICAgICAgbGlzdGVuZXIodGhpcy5zdGF0ZSwgdGhpcy5zdGF0ZS5ldmVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnN1YnNjcmliZSA9IGZ1bmN0aW9uIChuZXh0TGlzdGVuZXJPck9ic2VydmVyLCBfLCAvLyBUT0RPOiBlcnJvciBsaXN0ZW5lclxuICBjb21wbGV0ZUxpc3RlbmVyKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBvYnNlcnZlciA9IHRvT2JzZXJ2ZXIobmV4dExpc3RlbmVyT3JPYnNlcnZlciwgXywgY29tcGxldGVMaXN0ZW5lcik7XG4gICAgdGhpcy5saXN0ZW5lcnMuYWRkKG9ic2VydmVyLm5leHQpOyAvLyBTZW5kIGN1cnJlbnQgc3RhdGUgdG8gbGlzdGVuZXJcblxuICAgIGlmICh0aGlzLnN0YXR1cyAhPT0gSW50ZXJwcmV0ZXJTdGF0dXMuTm90U3RhcnRlZCkge1xuICAgICAgb2JzZXJ2ZXIubmV4dCh0aGlzLnN0YXRlKTtcbiAgICB9XG5cbiAgICB2YXIgY29tcGxldGVPbmNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgX3RoaXMuZG9uZUxpc3RlbmVycy5kZWxldGUoY29tcGxldGVPbmNlKTtcblxuICAgICAgX3RoaXMuc3RvcExpc3RlbmVycy5kZWxldGUoY29tcGxldGVPbmNlKTtcblxuICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBJbnRlcnByZXRlclN0YXR1cy5TdG9wcGVkKSB7XG4gICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9uRG9uZShjb21wbGV0ZU9uY2UpO1xuICAgICAgdGhpcy5vblN0b3AoY29tcGxldGVPbmNlKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgX3RoaXMubGlzdGVuZXJzLmRlbGV0ZShvYnNlcnZlci5uZXh0KTtcblxuICAgICAgICBfdGhpcy5kb25lTGlzdGVuZXJzLmRlbGV0ZShjb21wbGV0ZU9uY2UpO1xuXG4gICAgICAgIF90aGlzLnN0b3BMaXN0ZW5lcnMuZGVsZXRlKGNvbXBsZXRlT25jZSk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcbiAgLyoqXHJcbiAgICogQWRkcyBhbiBldmVudCBsaXN0ZW5lciB0aGF0IGlzIG5vdGlmaWVkIHdoZW5ldmVyIGFuIGV2ZW50IGlzIHNlbnQgdG8gdGhlIHJ1bm5pbmcgaW50ZXJwcmV0ZXIuXHJcbiAgICogQHBhcmFtIGxpc3RlbmVyIFRoZSBldmVudCBsaXN0ZW5lclxyXG4gICAqL1xuXG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLm9uRXZlbnQgPSBmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICB0aGlzLmV2ZW50TGlzdGVuZXJzLmFkZChsaXN0ZW5lcik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIC8qKlxyXG4gICAqIEFkZHMgYW4gZXZlbnQgbGlzdGVuZXIgdGhhdCBpcyBub3RpZmllZCB3aGVuZXZlciBhIGBzZW5kYCBldmVudCBvY2N1cnMuXHJcbiAgICogQHBhcmFtIGxpc3RlbmVyIFRoZSBldmVudCBsaXN0ZW5lclxyXG4gICAqL1xuXG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLm9uU2VuZCA9IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgIHRoaXMuc2VuZExpc3RlbmVycy5hZGQobGlzdGVuZXIpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICAvKipcclxuICAgKiBBZGRzIGEgY29udGV4dCBsaXN0ZW5lciB0aGF0IGlzIG5vdGlmaWVkIHdoZW5ldmVyIHRoZSBzdGF0ZSBjb250ZXh0IGNoYW5nZXMuXHJcbiAgICogQHBhcmFtIGxpc3RlbmVyIFRoZSBjb250ZXh0IGxpc3RlbmVyXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUub25DaGFuZ2UgPSBmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICB0aGlzLmNvbnRleHRMaXN0ZW5lcnMuYWRkKGxpc3RlbmVyKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgLyoqXHJcbiAgICogQWRkcyBhIGxpc3RlbmVyIHRoYXQgaXMgbm90aWZpZWQgd2hlbiB0aGUgbWFjaGluZSBpcyBzdG9wcGVkLlxyXG4gICAqIEBwYXJhbSBsaXN0ZW5lciBUaGUgbGlzdGVuZXJcclxuICAgKi9cblxuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5vblN0b3AgPSBmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICB0aGlzLnN0b3BMaXN0ZW5lcnMuYWRkKGxpc3RlbmVyKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgLyoqXHJcbiAgICogQWRkcyBhIHN0YXRlIGxpc3RlbmVyIHRoYXQgaXMgbm90aWZpZWQgd2hlbiB0aGUgc3RhdGVjaGFydCBoYXMgcmVhY2hlZCBpdHMgZmluYWwgc3RhdGUuXHJcbiAgICogQHBhcmFtIGxpc3RlbmVyIFRoZSBzdGF0ZSBsaXN0ZW5lclxyXG4gICAqL1xuXG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLm9uRG9uZSA9IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gSW50ZXJwcmV0ZXJTdGF0dXMuU3RvcHBlZCAmJiB0aGlzLl9kb25lRXZlbnQpIHtcbiAgICAgIGxpc3RlbmVyKHRoaXMuX2RvbmVFdmVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZG9uZUxpc3RlbmVycy5hZGQobGlzdGVuZXIpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICAvKipcclxuICAgKiBSZW1vdmVzIGEgbGlzdGVuZXIuXHJcbiAgICogQHBhcmFtIGxpc3RlbmVyIFRoZSBsaXN0ZW5lciB0byByZW1vdmVcclxuICAgKi9cblxuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5vZmYgPSBmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICB0aGlzLmxpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgICB0aGlzLnNlbmRMaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgICB0aGlzLnN0b3BMaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgICB0aGlzLmRvbmVMaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgICB0aGlzLmNvbnRleHRMaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgLyoqXHJcbiAgICogU3RhcnRzIHRoZSBpbnRlcnByZXRlciBmcm9tIHRoZSBnaXZlbiBzdGF0ZSwgb3IgdGhlIGluaXRpYWwgc3RhdGUuXHJcbiAgICogQHBhcmFtIGluaXRpYWxTdGF0ZSBUaGUgc3RhdGUgdG8gc3RhcnQgdGhlIHN0YXRlY2hhcnQgZnJvbVxyXG4gICAqL1xuXG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKGluaXRpYWxTdGF0ZSkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAodGhpcy5zdGF0dXMgPT09IEludGVycHJldGVyU3RhdHVzLlJ1bm5pbmcpIHtcbiAgICAgIC8vIERvIG5vdCByZXN0YXJ0IHRoZSBzZXJ2aWNlIGlmIGl0IGlzIGFscmVhZHkgc3RhcnRlZFxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSAvLyB5ZXMsIGl0J3MgYSBoYWNrIGJ1dCB3ZSBuZWVkIHRoZSByZWxhdGVkIGNhY2hlIHRvIGJlIHBvcHVsYXRlZCBmb3Igc29tZSB0aGluZ3MgdG8gd29yayAobGlrZSBkZWxheWVkIHRyYW5zaXRpb25zKVxuICAgIC8vIHRoaXMgaXMgdXN1YWxseSBjYWxsZWQgYnkgYG1hY2hpbmUuZ2V0SW5pdGlhbFN0YXRlYCBidXQgaWYgd2UgcmVoeWRyYXRlIGZyb20gYSBzdGF0ZSB3ZSBtaWdodCBieXBhc3MgdGhpcyBjYWxsXG4gICAgLy8gd2UgYWxzbyBkb24ndCB3YW50IHRvIGNhbGwgdGhpcyBtZXRob2QgaGVyZSBhcyBpdCByZXNvbHZlcyB0aGUgZnVsbCBpbml0aWFsIHN0YXRlIHdoaWNoIG1pZ2h0IGludm9sdmUgY2FsbGluZyBhc3NpZ24gYWN0aW9uc1xuICAgIC8vIGFuZCB0aGF0IGNvdWxkIHBvdGVudGlhbGx5IGxlYWQgdG8gc29tZSB1bndhbnRlZCBzaWRlLWVmZmVjdHMgKGV2ZW4gc3VjaCBhcyBjcmVhdGluZyBzb21lIHJvZ3VlIGFjdG9ycylcblxuXG4gICAgdGhpcy5tYWNoaW5lLl9pbml0KCk7XG5cbiAgICByZWdpc3RyeS5yZWdpc3Rlcih0aGlzLnNlc3Npb25JZCwgdGhpcyk7XG4gICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgdGhpcy5zdGF0dXMgPSBJbnRlcnByZXRlclN0YXR1cy5SdW5uaW5nO1xuICAgIHZhciByZXNvbHZlZFN0YXRlID0gaW5pdGlhbFN0YXRlID09PSB1bmRlZmluZWQgPyB0aGlzLmluaXRpYWxTdGF0ZSA6IHByb3ZpZGUodGhpcywgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGlzU3RhdGVDb25maWcoaW5pdGlhbFN0YXRlKSA/IF90aGlzLm1hY2hpbmUucmVzb2x2ZVN0YXRlKGluaXRpYWxTdGF0ZSkgOiBfdGhpcy5tYWNoaW5lLnJlc29sdmVTdGF0ZShTdGF0ZS5mcm9tKGluaXRpYWxTdGF0ZSwgX3RoaXMubWFjaGluZS5jb250ZXh0KSk7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmRldlRvb2xzKSB7XG4gICAgICB0aGlzLmF0dGFjaERldigpO1xuICAgIH1cblxuICAgIHRoaXMuc2NoZWR1bGVyLmluaXRpYWxpemUoZnVuY3Rpb24gKCkge1xuICAgICAgX3RoaXMudXBkYXRlKHJlc29sdmVkU3RhdGUsIGluaXRFdmVudCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLl9zdG9wQ2hpbGRyZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gVE9ETzogdGhpbmsgYWJvdXQgY29udmVydGluZyB0aG9zZSB0byBhY3Rpb25zXG4gICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgaWYgKGlzRnVuY3Rpb24oY2hpbGQuc3RvcCkpIHtcbiAgICAgICAgY2hpbGQuc3RvcCgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuY2hpbGRyZW4uY2xlYXIoKTtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuX3N0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVfNiwgX2EsIGVfNywgX2IsIGVfOCwgX2MsIGVfOSwgX2QsIGVfMTAsIF9lO1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9mID0gX192YWx1ZXModGhpcy5saXN0ZW5lcnMpLCBfZyA9IF9mLm5leHQoKTsgIV9nLmRvbmU7IF9nID0gX2YubmV4dCgpKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lciA9IF9nLnZhbHVlO1xuICAgICAgICB0aGlzLmxpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfNl8xKSB7XG4gICAgICBlXzYgPSB7XG4gICAgICAgIGVycm9yOiBlXzZfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKF9nICYmICFfZy5kb25lICYmIChfYSA9IF9mLnJldHVybikpIF9hLmNhbGwoX2YpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfNikgdGhyb3cgZV82LmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBfaCA9IF9fdmFsdWVzKHRoaXMuc3RvcExpc3RlbmVycyksIF9qID0gX2gubmV4dCgpOyAhX2ouZG9uZTsgX2ogPSBfaC5uZXh0KCkpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVyID0gX2oudmFsdWU7IC8vIGNhbGwgbGlzdGVuZXIsIHRoZW4gcmVtb3ZlXG5cbiAgICAgICAgbGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5zdG9wTGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV83XzEpIHtcbiAgICAgIGVfNyA9IHtcbiAgICAgICAgZXJyb3I6IGVfN18xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoX2ogJiYgIV9qLmRvbmUgJiYgKF9iID0gX2gucmV0dXJuKSkgX2IuY2FsbChfaCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV83KSB0aHJvdyBlXzcuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9rID0gX192YWx1ZXModGhpcy5jb250ZXh0TGlzdGVuZXJzKSwgX2wgPSBfay5uZXh0KCk7ICFfbC5kb25lOyBfbCA9IF9rLm5leHQoKSkge1xuICAgICAgICB2YXIgbGlzdGVuZXIgPSBfbC52YWx1ZTtcbiAgICAgICAgdGhpcy5jb250ZXh0TGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV84XzEpIHtcbiAgICAgIGVfOCA9IHtcbiAgICAgICAgZXJyb3I6IGVfOF8xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoX2wgJiYgIV9sLmRvbmUgJiYgKF9jID0gX2sucmV0dXJuKSkgX2MuY2FsbChfayk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV84KSB0aHJvdyBlXzguZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9tID0gX192YWx1ZXModGhpcy5kb25lTGlzdGVuZXJzKSwgX28gPSBfbS5uZXh0KCk7ICFfby5kb25lOyBfbyA9IF9tLm5leHQoKSkge1xuICAgICAgICB2YXIgbGlzdGVuZXIgPSBfby52YWx1ZTtcbiAgICAgICAgdGhpcy5kb25lTGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV85XzEpIHtcbiAgICAgIGVfOSA9IHtcbiAgICAgICAgZXJyb3I6IGVfOV8xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoX28gJiYgIV9vLmRvbmUgJiYgKF9kID0gX20ucmV0dXJuKSkgX2QuY2FsbChfbSk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV85KSB0aHJvdyBlXzkuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICAvLyBJbnRlcnByZXRlciBhbHJlYWR5IHN0b3BwZWQ7IGRvIG5vdGhpbmdcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICB0aGlzLnN0YXR1cyA9IEludGVycHJldGVyU3RhdHVzLlN0b3BwZWQ7XG4gICAgdGhpcy5faW5pdGlhbFN0YXRlID0gdW5kZWZpbmVkO1xuXG4gICAgdHJ5IHtcbiAgICAgIC8vIHdlIGFyZSBnb2luZyB0byBzdG9wIHdpdGhpbiB0aGUgY3VycmVudCBzeW5jIGZyYW1lXG4gICAgICAvLyBzbyB3ZSBjYW4gc2FmZWx5IGp1c3QgY2FuY2VsIHRoaXMgaGVyZSBhcyBub3RoaW5nIGFzeW5jIHNob3VsZCBiZSBmaXJlZCBhbnl3YXlcbiAgICAgIGZvciAodmFyIF9wID0gX192YWx1ZXMoT2JqZWN0LmtleXModGhpcy5kZWxheWVkRXZlbnRzTWFwKSksIF9xID0gX3AubmV4dCgpOyAhX3EuZG9uZTsgX3EgPSBfcC5uZXh0KCkpIHtcbiAgICAgICAgdmFyIGtleSA9IF9xLnZhbHVlO1xuICAgICAgICB0aGlzLmNsb2NrLmNsZWFyVGltZW91dCh0aGlzLmRlbGF5ZWRFdmVudHNNYXBba2V5XSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV8xMF8xKSB7XG4gICAgICBlXzEwID0ge1xuICAgICAgICBlcnJvcjogZV8xMF8xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoX3EgJiYgIV9xLmRvbmUgJiYgKF9lID0gX3AucmV0dXJuKSkgX2UuY2FsbChfcCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV8xMCkgdGhyb3cgZV8xMC5lcnJvcjtcbiAgICAgIH1cbiAgICB9IC8vIGNsZWFyIGV2ZXJ5dGhpbmcgdGhhdCBtaWdodCBiZSBlbnF1ZXVlZFxuXG5cbiAgICB0aGlzLnNjaGVkdWxlci5jbGVhcigpO1xuICAgIHRoaXMuc2NoZWR1bGVyID0gbmV3IFNjaGVkdWxlcih7XG4gICAgICBkZWZlckV2ZW50czogdGhpcy5vcHRpb25zLmRlZmVyRXZlbnRzXG4gICAgfSk7XG4gIH07XG4gIC8qKlxyXG4gICAqIFN0b3BzIHRoZSBpbnRlcnByZXRlciBhbmQgdW5zdWJzY3JpYmUgYWxsIGxpc3RlbmVycy5cclxuICAgKlxyXG4gICAqIFRoaXMgd2lsbCBhbHNvIG5vdGlmeSB0aGUgYG9uU3RvcGAgbGlzdGVuZXJzLlxyXG4gICAqL1xuXG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gVE9ETzogYWRkIHdhcm5pbmcgZm9yIHN0b3BwaW5nIG5vbi1yb290IGludGVycHJldGVyc1xuICAgIHZhciBfdGhpcyA9IHRoaXM7IC8vIGdyYWIgdGhlIGN1cnJlbnQgc2NoZWR1bGVyIGFzIGl0IHdpbGwgYmUgcmVwbGFjZWQgaW4gX3N0b3BcblxuXG4gICAgdmFyIHNjaGVkdWxlciA9IHRoaXMuc2NoZWR1bGVyO1xuXG4gICAgdGhpcy5fc3RvcCgpOyAvLyBsZXQgd2hhdCBpcyBjdXJyZW50bHkgcHJvY2Vzc2VkIHRvIGJlIGZpbmlzaGVkXG5cblxuICAgIHNjaGVkdWxlci5zY2hlZHVsZShmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBpdCBmZWVscyB3ZWlyZCB0byBoYW5kbGUgdGhpcyBoZXJlIGJ1dCB3ZSBuZWVkIHRvIGhhbmRsZSB0aGlzIGV2ZW4gc2xpZ2h0bHkgXCJvdXQgb2YgYmFuZFwiXG4gICAgICB2YXIgX2V2ZW50ID0gdG9TQ1hNTEV2ZW50KHtcbiAgICAgICAgdHlwZTogJ3hzdGF0ZS5zdG9wJ1xuICAgICAgfSk7XG5cbiAgICAgIHZhciBuZXh0U3RhdGUgPSBwcm92aWRlKF90aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBleGl0QWN0aW9ucyA9IGZsYXR0ZW4oX19zcHJlYWRBcnJheShbXSwgX19yZWFkKF90aGlzLnN0YXRlLmNvbmZpZ3VyYXRpb24pLCBmYWxzZSkuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgIHJldHVybiBiLm9yZGVyIC0gYS5vcmRlcjtcbiAgICAgICAgfSkubWFwKGZ1bmN0aW9uIChzdGF0ZU5vZGUpIHtcbiAgICAgICAgICByZXR1cm4gdG9BY3Rpb25PYmplY3RzKHN0YXRlTm9kZS5vbkV4aXQsIF90aGlzLm1hY2hpbmUub3B0aW9ucy5hY3Rpb25zKTtcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIHZhciBfYSA9IF9fcmVhZChyZXNvbHZlQWN0aW9ucyhfdGhpcy5tYWNoaW5lLCBfdGhpcy5zdGF0ZSwgX3RoaXMuc3RhdGUuY29udGV4dCwgX2V2ZW50LCBbe1xuICAgICAgICAgIHR5cGU6ICdleGl0JyxcbiAgICAgICAgICBhY3Rpb25zOiBleGl0QWN0aW9uc1xuICAgICAgICB9XSwgX3RoaXMubWFjaGluZS5jb25maWcucHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHMgPyBfdGhpcy5fZXhlYyA6IHVuZGVmaW5lZCwgX3RoaXMubWFjaGluZS5jb25maWcucHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHMgfHwgX3RoaXMubWFjaGluZS5jb25maWcucHJlc2VydmVBY3Rpb25PcmRlciksIDIpLFxuICAgICAgICAgICAgcmVzb2x2ZWRBY3Rpb25zID0gX2FbMF0sXG4gICAgICAgICAgICB1cGRhdGVkQ29udGV4dCA9IF9hWzFdO1xuXG4gICAgICAgIHZhciBuZXdTdGF0ZSA9IG5ldyBTdGF0ZSh7XG4gICAgICAgICAgdmFsdWU6IF90aGlzLnN0YXRlLnZhbHVlLFxuICAgICAgICAgIGNvbnRleHQ6IHVwZGF0ZWRDb250ZXh0LFxuICAgICAgICAgIF9ldmVudDogX2V2ZW50LFxuICAgICAgICAgIF9zZXNzaW9uaWQ6IF90aGlzLnNlc3Npb25JZCxcbiAgICAgICAgICBoaXN0b3J5VmFsdWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICBoaXN0b3J5OiBfdGhpcy5zdGF0ZSxcbiAgICAgICAgICBhY3Rpb25zOiByZXNvbHZlZEFjdGlvbnMuZmlsdGVyKGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgICAgICAgIHJldHVybiAhaXNSYWlzYWJsZUFjdGlvbihhY3Rpb24pO1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIGFjdGl2aXRpZXM6IHt9LFxuICAgICAgICAgIGV2ZW50czogW10sXG4gICAgICAgICAgY29uZmlndXJhdGlvbjogW10sXG4gICAgICAgICAgdHJhbnNpdGlvbnM6IFtdLFxuICAgICAgICAgIGNoaWxkcmVuOiB7fSxcbiAgICAgICAgICBkb25lOiBfdGhpcy5zdGF0ZS5kb25lLFxuICAgICAgICAgIHRhZ3M6IF90aGlzLnN0YXRlLnRhZ3MsXG4gICAgICAgICAgbWFjaGluZTogX3RoaXMubWFjaGluZVxuICAgICAgICB9KTtcbiAgICAgICAgbmV3U3RhdGUuY2hhbmdlZCA9IHRydWU7XG4gICAgICAgIHJldHVybiBuZXdTdGF0ZTtcbiAgICAgIH0pO1xuXG4gICAgICBfdGhpcy51cGRhdGUobmV4dFN0YXRlLCBfZXZlbnQpO1xuXG4gICAgICBfdGhpcy5fc3RvcENoaWxkcmVuKCk7XG5cbiAgICAgIHJlZ2lzdHJ5LmZyZWUoX3RoaXMuc2Vzc2lvbklkKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuYmF0Y2ggPSBmdW5jdGlvbiAoZXZlbnRzKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gSW50ZXJwcmV0ZXJTdGF0dXMuTm90U3RhcnRlZCAmJiB0aGlzLm9wdGlvbnMuZGVmZXJFdmVudHMpIHtcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1jb25zb2xlXG4gICAgICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICAgICAgd2FybihmYWxzZSwgXCJcIi5jb25jYXQoZXZlbnRzLmxlbmd0aCwgXCIgZXZlbnQocykgd2VyZSBzZW50IHRvIHVuaW5pdGlhbGl6ZWQgc2VydmljZSBcXFwiXCIpLmNvbmNhdCh0aGlzLm1hY2hpbmUuaWQsIFwiXFxcIiBhbmQgYXJlIGRlZmVycmVkLiBNYWtlIHN1cmUgLnN0YXJ0KCkgaXMgY2FsbGVkIGZvciB0aGlzIHNlcnZpY2UuXFxuRXZlbnQ6IFwiKS5jb25jYXQoSlNPTi5zdHJpbmdpZnkoZXZlbnQpKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXR1cyAhPT0gSW50ZXJwcmV0ZXJTdGF0dXMuUnVubmluZykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICBcIlwiLmNvbmNhdChldmVudHMubGVuZ3RoLCBcIiBldmVudChzKSB3ZXJlIHNlbnQgdG8gdW5pbml0aWFsaXplZCBzZXJ2aWNlIFxcXCJcIikuY29uY2F0KHRoaXMubWFjaGluZS5pZCwgXCJcXFwiLiBNYWtlIHN1cmUgLnN0YXJ0KCkgaXMgY2FsbGVkIGZvciB0aGlzIHNlcnZpY2UsIG9yIHNldCB7IGRlZmVyRXZlbnRzOiB0cnVlIH0gaW4gdGhlIHNlcnZpY2Ugb3B0aW9ucy5cIikpO1xuICAgIH1cblxuICAgIGlmICghZXZlbnRzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBleGVjID0gISF0aGlzLm1hY2hpbmUuY29uZmlnLnByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzICYmIHRoaXMuX2V4ZWM7XG4gICAgdGhpcy5zY2hlZHVsZXIuc2NoZWR1bGUoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGVfMTEsIF9hO1xuXG4gICAgICB2YXIgbmV4dFN0YXRlID0gX3RoaXMuc3RhdGU7XG4gICAgICB2YXIgYmF0Y2hDaGFuZ2VkID0gZmFsc2U7XG4gICAgICB2YXIgYmF0Y2hlZEFjdGlvbnMgPSBbXTtcblxuICAgICAgdmFyIF9sb29wXzEgPSBmdW5jdGlvbiAoZXZlbnRfMSkge1xuICAgICAgICB2YXIgX2V2ZW50ID0gdG9TQ1hNTEV2ZW50KGV2ZW50XzEpO1xuXG4gICAgICAgIF90aGlzLmZvcndhcmQoX2V2ZW50KTtcblxuICAgICAgICBuZXh0U3RhdGUgPSBwcm92aWRlKF90aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLm1hY2hpbmUudHJhbnNpdGlvbihuZXh0U3RhdGUsIF9ldmVudCwgdW5kZWZpbmVkLCBleGVjIHx8IHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuICAgICAgICBiYXRjaGVkQWN0aW9ucy5wdXNoLmFwcGx5KGJhdGNoZWRBY3Rpb25zLCBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoX3RoaXMubWFjaGluZS5jb25maWcucHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHMgPyBuZXh0U3RhdGUuYWN0aW9ucyA6IG5leHRTdGF0ZS5hY3Rpb25zLm1hcChmdW5jdGlvbiAoYSkge1xuICAgICAgICAgIHJldHVybiBiaW5kQWN0aW9uVG9TdGF0ZShhLCBuZXh0U3RhdGUpO1xuICAgICAgICB9KSksIGZhbHNlKSk7XG4gICAgICAgIGJhdGNoQ2hhbmdlZCA9IGJhdGNoQ2hhbmdlZCB8fCAhIW5leHRTdGF0ZS5jaGFuZ2VkO1xuICAgICAgfTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yICh2YXIgZXZlbnRzXzEgPSBfX3ZhbHVlcyhldmVudHMpLCBldmVudHNfMV8xID0gZXZlbnRzXzEubmV4dCgpOyAhZXZlbnRzXzFfMS5kb25lOyBldmVudHNfMV8xID0gZXZlbnRzXzEubmV4dCgpKSB7XG4gICAgICAgICAgdmFyIGV2ZW50XzEgPSBldmVudHNfMV8xLnZhbHVlO1xuXG4gICAgICAgICAgX2xvb3BfMShldmVudF8xKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZV8xMV8xKSB7XG4gICAgICAgIGVfMTEgPSB7XG4gICAgICAgICAgZXJyb3I6IGVfMTFfMVxuICAgICAgICB9O1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoZXZlbnRzXzFfMSAmJiAhZXZlbnRzXzFfMS5kb25lICYmIChfYSA9IGV2ZW50c18xLnJldHVybikpIF9hLmNhbGwoZXZlbnRzXzEpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIGlmIChlXzExKSB0aHJvdyBlXzExLmVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIG5leHRTdGF0ZS5jaGFuZ2VkID0gYmF0Y2hDaGFuZ2VkO1xuICAgICAgbmV4dFN0YXRlLmFjdGlvbnMgPSBiYXRjaGVkQWN0aW9ucztcblxuICAgICAgX3RoaXMudXBkYXRlKG5leHRTdGF0ZSwgdG9TQ1hNTEV2ZW50KGV2ZW50c1tldmVudHMubGVuZ3RoIC0gMV0pKTtcbiAgICB9KTtcbiAgfTtcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhIHNlbmQgZnVuY3Rpb24gYm91bmQgdG8gdGhpcyBpbnRlcnByZXRlciBpbnN0YW5jZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgdG8gYmUgc2VudCBieSB0aGUgc2VuZGVyLlxyXG4gICAqL1xuXG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnNlbmRlciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHJldHVybiB0aGlzLnNlbmQuYmluZCh0aGlzLCBldmVudCk7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLl9uZXh0U3RhdGUgPSBmdW5jdGlvbiAoZXZlbnQsIGV4ZWMpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKGV4ZWMgPT09IHZvaWQgMCkge1xuICAgICAgZXhlYyA9ICEhdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cyAmJiB0aGlzLl9leGVjO1xuICAgIH1cblxuICAgIHZhciBfZXZlbnQgPSB0b1NDWE1MRXZlbnQoZXZlbnQpO1xuXG4gICAgaWYgKF9ldmVudC5uYW1lLmluZGV4T2YoZXJyb3JQbGF0Zm9ybSkgPT09IDAgJiYgIXRoaXMuc3RhdGUubmV4dEV2ZW50cy5zb21lKGZ1bmN0aW9uIChuZXh0RXZlbnQpIHtcbiAgICAgIHJldHVybiBuZXh0RXZlbnQuaW5kZXhPZihlcnJvclBsYXRmb3JtKSA9PT0gMDtcbiAgICB9KSkge1xuICAgICAgdGhyb3cgX2V2ZW50LmRhdGEuZGF0YTtcbiAgICB9XG5cbiAgICB2YXIgbmV4dFN0YXRlID0gcHJvdmlkZSh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gX3RoaXMubWFjaGluZS50cmFuc2l0aW9uKF90aGlzLnN0YXRlLCBfZXZlbnQsIHVuZGVmaW5lZCwgZXhlYyB8fCB1bmRlZmluZWQpO1xuICAgIH0pO1xuICAgIHJldHVybiBuZXh0U3RhdGU7XG4gIH07XG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIG5leHQgc3RhdGUgZ2l2ZW4gdGhlIGludGVycHJldGVyJ3MgY3VycmVudCBzdGF0ZSBhbmQgdGhlIGV2ZW50LlxyXG4gICAqXHJcbiAgICogVGhpcyBpcyBhIHB1cmUgbWV0aG9kIHRoYXQgZG9lcyBfbm90XyB1cGRhdGUgdGhlIGludGVycHJldGVyJ3Mgc3RhdGUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IHRvIGRldGVybWluZSB0aGUgbmV4dCBzdGF0ZVxyXG4gICAqL1xuXG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLm5leHRTdGF0ZSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHJldHVybiB0aGlzLl9uZXh0U3RhdGUoZXZlbnQsIGZhbHNlKTtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuZm9yd2FyZCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBlXzEyLCBfYTtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBfYiA9IF9fdmFsdWVzKHRoaXMuZm9yd2FyZFRvKSwgX2MgPSBfYi5uZXh0KCk7ICFfYy5kb25lOyBfYyA9IF9iLm5leHQoKSkge1xuICAgICAgICB2YXIgaWQgPSBfYy52YWx1ZTtcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5jaGlsZHJlbi5nZXQoaWQpO1xuXG4gICAgICAgIGlmICghY2hpbGQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmFibGUgdG8gZm9yd2FyZCBldmVudCAnXCIuY29uY2F0KGV2ZW50LCBcIicgZnJvbSBpbnRlcnByZXRlciAnXCIpLmNvbmNhdCh0aGlzLmlkLCBcIicgdG8gbm9uZXhpc3RhbnQgY2hpbGQgJ1wiKS5jb25jYXQoaWQsIFwiJy5cIikpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2hpbGQuc2VuZChldmVudCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV8xMl8xKSB7XG4gICAgICBlXzEyID0ge1xuICAgICAgICBlcnJvcjogZV8xMl8xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoX2MgJiYgIV9jLmRvbmUgJiYgKF9hID0gX2IucmV0dXJuKSkgX2EuY2FsbChfYik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV8xMikgdGhyb3cgZV8xMi5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLmRlZmVyID0gZnVuY3Rpb24gKHNlbmRBY3Rpb24pIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIHRpbWVySWQgPSB0aGlzLmNsb2NrLnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCd0bycgaW4gc2VuZEFjdGlvbiAmJiBzZW5kQWN0aW9uLnRvKSB7XG4gICAgICAgIF90aGlzLnNlbmRUbyhzZW5kQWN0aW9uLl9ldmVudCwgc2VuZEFjdGlvbi50bywgdHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfdGhpcy5zZW5kKHNlbmRBY3Rpb24uX2V2ZW50KTtcbiAgICAgIH1cbiAgICB9LCBzZW5kQWN0aW9uLmRlbGF5KTtcblxuICAgIGlmIChzZW5kQWN0aW9uLmlkKSB7XG4gICAgICB0aGlzLmRlbGF5ZWRFdmVudHNNYXBbc2VuZEFjdGlvbi5pZF0gPSB0aW1lcklkO1xuICAgIH1cbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuY2FuY2VsID0gZnVuY3Rpb24gKHNlbmRJZCkge1xuICAgIHRoaXMuY2xvY2suY2xlYXJUaW1lb3V0KHRoaXMuZGVsYXllZEV2ZW50c01hcFtzZW5kSWRdKTtcbiAgICBkZWxldGUgdGhpcy5kZWxheWVkRXZlbnRzTWFwW3NlbmRJZF07XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLmV4ZWMgPSBmdW5jdGlvbiAoYWN0aW9uLCBzdGF0ZSwgYWN0aW9uRnVuY3Rpb25NYXApIHtcbiAgICBpZiAoYWN0aW9uRnVuY3Rpb25NYXAgPT09IHZvaWQgMCkge1xuICAgICAgYWN0aW9uRnVuY3Rpb25NYXAgPSB0aGlzLm1hY2hpbmUub3B0aW9ucy5hY3Rpb25zO1xuICAgIH1cblxuICAgIHRoaXMuX2V4ZWMoYWN0aW9uLCBzdGF0ZS5jb250ZXh0LCBzdGF0ZS5fZXZlbnQsIGFjdGlvbkZ1bmN0aW9uTWFwKTtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUucmVtb3ZlQ2hpbGQgPSBmdW5jdGlvbiAoY2hpbGRJZCkge1xuICAgIHZhciBfYTtcblxuICAgIHRoaXMuY2hpbGRyZW4uZGVsZXRlKGNoaWxkSWQpO1xuICAgIHRoaXMuZm9yd2FyZFRvLmRlbGV0ZShjaGlsZElkKTsgLy8gdGhpcy5zdGF0ZSBtaWdodCBub3QgZXhpc3QgYXQgdGhlIHRpbWUgdGhpcyBpcyBjYWxsZWQsXG4gICAgLy8gc3VjaCBhcyB3aGVuIGEgY2hpbGQgaXMgYWRkZWQgdGhlbiByZW1vdmVkIHdoaWxlIGluaXRpYWxpemluZyB0aGUgc3RhdGVcblxuICAgIChfYSA9IHRoaXMuc3RhdGUpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB0cnVlIDogZGVsZXRlIF9hLmNoaWxkcmVuW2NoaWxkSWRdO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5zdG9wQ2hpbGQgPSBmdW5jdGlvbiAoY2hpbGRJZCkge1xuICAgIHZhciBjaGlsZCA9IHRoaXMuY2hpbGRyZW4uZ2V0KGNoaWxkSWQpO1xuXG4gICAgaWYgKCFjaGlsZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucmVtb3ZlQ2hpbGQoY2hpbGRJZCk7XG5cbiAgICBpZiAoaXNGdW5jdGlvbihjaGlsZC5zdG9wKSkge1xuICAgICAgY2hpbGQuc3RvcCgpO1xuICAgIH1cbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc3Bhd24gPSBmdW5jdGlvbiAoZW50aXR5LCBuYW1lLCBvcHRpb25zKSB7XG4gICAgaWYgKHRoaXMuc3RhdHVzICE9PSBJbnRlcnByZXRlclN0YXR1cy5SdW5uaW5nKSB7XG4gICAgICByZXR1cm4gY3JlYXRlRGVmZXJyZWRBY3RvcihlbnRpdHksIG5hbWUpO1xuICAgIH1cblxuICAgIGlmIChpc1Byb21pc2VMaWtlKGVudGl0eSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnNwYXduUHJvbWlzZShQcm9taXNlLnJlc29sdmUoZW50aXR5KSwgbmFtZSk7XG4gICAgfSBlbHNlIGlmIChpc0Z1bmN0aW9uKGVudGl0eSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnNwYXduQ2FsbGJhY2soZW50aXR5LCBuYW1lKTtcbiAgICB9IGVsc2UgaWYgKGlzU3Bhd25lZEFjdG9yKGVudGl0eSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnNwYXduQWN0b3IoZW50aXR5LCBuYW1lKTtcbiAgICB9IGVsc2UgaWYgKGlzT2JzZXJ2YWJsZShlbnRpdHkpKSB7XG4gICAgICByZXR1cm4gdGhpcy5zcGF3bk9ic2VydmFibGUoZW50aXR5LCBuYW1lKTtcbiAgICB9IGVsc2UgaWYgKGlzTWFjaGluZShlbnRpdHkpKSB7XG4gICAgICByZXR1cm4gdGhpcy5zcGF3bk1hY2hpbmUoZW50aXR5LCBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgb3B0aW9ucyksIHtcbiAgICAgICAgaWQ6IG5hbWVcbiAgICAgIH0pKTtcbiAgICB9IGVsc2UgaWYgKGlzQmVoYXZpb3IoZW50aXR5KSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3Bhd25CZWhhdmlvcihlbnRpdHksIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmFibGUgdG8gc3Bhd24gZW50aXR5IFxcXCJcIi5jb25jYXQobmFtZSwgXCJcXFwiIG9mIHR5cGUgXFxcIlwiKS5jb25jYXQodHlwZW9mIGVudGl0eSwgXCJcXFwiLlwiKSk7XG4gICAgfVxuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5zcGF3bk1hY2hpbmUgPSBmdW5jdGlvbiAobWFjaGluZSwgb3B0aW9ucykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuXG4gICAgdmFyIGNoaWxkU2VydmljZSA9IG5ldyBJbnRlcnByZXRlcihtYWNoaW5lLCBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgdGhpcy5vcHRpb25zKSwge1xuICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgaWQ6IG9wdGlvbnMuaWQgfHwgbWFjaGluZS5pZFxuICAgIH0pKTtcblxuICAgIHZhciByZXNvbHZlZE9wdGlvbnMgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgREVGQVVMVF9TUEFXTl9PUFRJT05TKSwgb3B0aW9ucyk7XG5cbiAgICBpZiAocmVzb2x2ZWRPcHRpb25zLnN5bmMpIHtcbiAgICAgIGNoaWxkU2VydmljZS5vblRyYW5zaXRpb24oZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgIF90aGlzLnNlbmQodXBkYXRlLCB7XG4gICAgICAgICAgc3RhdGU6IHN0YXRlLFxuICAgICAgICAgIGlkOiBjaGlsZFNlcnZpY2UuaWRcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB2YXIgYWN0b3IgPSBjaGlsZFNlcnZpY2U7XG4gICAgdGhpcy5jaGlsZHJlbi5zZXQoY2hpbGRTZXJ2aWNlLmlkLCBhY3Rvcik7XG5cbiAgICBpZiAocmVzb2x2ZWRPcHRpb25zLmF1dG9Gb3J3YXJkKSB7XG4gICAgICB0aGlzLmZvcndhcmRUby5hZGQoY2hpbGRTZXJ2aWNlLmlkKTtcbiAgICB9XG5cbiAgICBjaGlsZFNlcnZpY2Uub25Eb25lKGZ1bmN0aW9uIChkb25lRXZlbnQpIHtcbiAgICAgIF90aGlzLnJlbW92ZUNoaWxkKGNoaWxkU2VydmljZS5pZCk7XG5cbiAgICAgIF90aGlzLnNlbmQodG9TQ1hNTEV2ZW50KGRvbmVFdmVudCwge1xuICAgICAgICBvcmlnaW46IGNoaWxkU2VydmljZS5pZFxuICAgICAgfSkpO1xuICAgIH0pLnN0YXJ0KCk7XG4gICAgcmV0dXJuIGFjdG9yO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5zcGF3bkJlaGF2aW9yID0gZnVuY3Rpb24gKGJlaGF2aW9yLCBpZCkge1xuICAgIHZhciBhY3RvclJlZiA9IHNwYXduQmVoYXZpb3IoYmVoYXZpb3IsIHtcbiAgICAgIGlkOiBpZCxcbiAgICAgIHBhcmVudDogdGhpc1xuICAgIH0pO1xuICAgIHRoaXMuY2hpbGRyZW4uc2V0KGlkLCBhY3RvclJlZik7XG4gICAgcmV0dXJuIGFjdG9yUmVmO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5zcGF3blByb21pc2UgPSBmdW5jdGlvbiAocHJvbWlzZSwgaWQpIHtcbiAgICB2YXIgX2E7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIGNhbmNlbGVkID0gZmFsc2U7XG4gICAgdmFyIHJlc29sdmVkRGF0YTtcbiAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBpZiAoIWNhbmNlbGVkKSB7XG4gICAgICAgIHJlc29sdmVkRGF0YSA9IHJlc3BvbnNlO1xuXG4gICAgICAgIF90aGlzLnJlbW92ZUNoaWxkKGlkKTtcblxuICAgICAgICBfdGhpcy5zZW5kKHRvU0NYTUxFdmVudChkb25lSW52b2tlKGlkLCByZXNwb25zZSksIHtcbiAgICAgICAgICBvcmlnaW46IGlkXG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICB9LCBmdW5jdGlvbiAoZXJyb3JEYXRhKSB7XG4gICAgICBpZiAoIWNhbmNlbGVkKSB7XG4gICAgICAgIF90aGlzLnJlbW92ZUNoaWxkKGlkKTtcblxuICAgICAgICB2YXIgZXJyb3JFdmVudCA9IGVycm9yKGlkLCBlcnJvckRhdGEpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gU2VuZCBcImVycm9yLnBsYXRmb3JtLmlkXCIgdG8gdGhpcyAocGFyZW50KS5cbiAgICAgICAgICBfdGhpcy5zZW5kKHRvU0NYTUxFdmVudChlcnJvckV2ZW50LCB7XG4gICAgICAgICAgICBvcmlnaW46IGlkXG4gICAgICAgICAgfSkpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIHJlcG9ydFVuaGFuZGxlZEV4Y2VwdGlvbk9uSW52b2NhdGlvbihlcnJvckRhdGEsIGVycm9yLCBpZCk7XG5cbiAgICAgICAgICBpZiAoX3RoaXMuZGV2VG9vbHMpIHtcbiAgICAgICAgICAgIF90aGlzLmRldlRvb2xzLnNlbmQoZXJyb3JFdmVudCwgX3RoaXMuc3RhdGUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChfdGhpcy5tYWNoaW5lLnN0cmljdCkge1xuICAgICAgICAgICAgLy8gaXQgd291bGQgYmUgYmV0dGVyIHRvIGFsd2F5cyBzdG9wIHRoZSBzdGF0ZSBtYWNoaW5lIGlmIHVuaGFuZGxlZFxuICAgICAgICAgICAgLy8gZXhjZXB0aW9uL3Byb21pc2UgcmVqZWN0aW9uIGhhcHBlbnMgYnV0IGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCB0b1xuICAgICAgICAgICAgLy8gYnJlYWsgZXhpc3RpbmcgY29kZSBzbyBlbmZvcmNlIGl0IG9uIHN0cmljdCBtb2RlIG9ubHkgZXNwZWNpYWxseSBzb1xuICAgICAgICAgICAgLy8gYmVjYXVzZSBkb2N1bWVudGF0aW9uIHNheXMgdGhhdCBvbkVycm9yIGlzIG9wdGlvbmFsXG4gICAgICAgICAgICBfdGhpcy5zdG9wKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGFjdG9yID0gKF9hID0ge1xuICAgICAgaWQ6IGlkLFxuICAgICAgc2VuZDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgICAgfSxcbiAgICAgIHN1YnNjcmliZTogZnVuY3Rpb24gKG5leHQsIGhhbmRsZUVycm9yLCBjb21wbGV0ZSkge1xuICAgICAgICB2YXIgb2JzZXJ2ZXIgPSB0b09ic2VydmVyKG5leHQsIGhhbmRsZUVycm9yLCBjb21wbGV0ZSk7XG4gICAgICAgIHZhciB1bnN1YnNjcmliZWQgPSBmYWxzZTtcbiAgICAgICAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgIGlmICh1bnN1YnNjcmliZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBvYnNlcnZlci5uZXh0KHJlc3BvbnNlKTtcblxuICAgICAgICAgIGlmICh1bnN1YnNjcmliZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgaWYgKHVuc3Vic2NyaWJlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG9ic2VydmVyLmVycm9yKGVycik7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5zdWJzY3JpYmVkID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYW5jZWxlZCA9IHRydWU7XG4gICAgICB9LFxuICAgICAgdG9KU09OOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaWQ6IGlkXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgZ2V0U25hcHNob3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmVkRGF0YTtcbiAgICAgIH1cbiAgICB9LCBfYVtzeW1ib2xPYnNlcnZhYmxlXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sIF9hKTtcbiAgICB0aGlzLmNoaWxkcmVuLnNldChpZCwgYWN0b3IpO1xuICAgIHJldHVybiBhY3RvcjtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc3Bhd25DYWxsYmFjayA9IGZ1bmN0aW9uIChjYWxsYmFjaywgaWQpIHtcbiAgICB2YXIgX2E7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIGNhbmNlbGVkID0gZmFsc2U7XG4gICAgdmFyIHJlY2VpdmVycyA9IG5ldyBTZXQoKTtcbiAgICB2YXIgbGlzdGVuZXJzID0gbmV3IFNldCgpO1xuICAgIHZhciBlbWl0dGVkO1xuXG4gICAgdmFyIHJlY2VpdmUgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgZW1pdHRlZCA9IGU7XG4gICAgICBsaXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICAgICAgcmV0dXJuIGxpc3RlbmVyKGUpO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChjYW5jZWxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIF90aGlzLnNlbmQodG9TQ1hNTEV2ZW50KGUsIHtcbiAgICAgICAgb3JpZ2luOiBpZFxuICAgICAgfSkpO1xuICAgIH07XG5cbiAgICB2YXIgY2FsbGJhY2tTdG9wO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNhbGxiYWNrU3RvcCA9IGNhbGxiYWNrKHJlY2VpdmUsIGZ1bmN0aW9uIChuZXdMaXN0ZW5lcikge1xuICAgICAgICByZWNlaXZlcnMuYWRkKG5ld0xpc3RlbmVyKTtcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5zZW5kKGVycm9yKGlkLCBlcnIpKTtcbiAgICB9XG5cbiAgICBpZiAoaXNQcm9taXNlTGlrZShjYWxsYmFja1N0b3ApKSB7XG4gICAgICAvLyBpdCB0dXJuZWQgb3V0IHRvIGJlIGFuIGFzeW5jIGZ1bmN0aW9uLCBjYW4ndCByZWxpYWJseSBjaGVjayB0aGlzIGJlZm9yZSBjYWxsaW5nIGBjYWxsYmFja2BcbiAgICAgIC8vIGJlY2F1c2UgdHJhbnNwaWxlZCBhc3luYyBmdW5jdGlvbnMgYXJlIG5vdCByZWNvZ25pemFibGVcbiAgICAgIHJldHVybiB0aGlzLnNwYXduUHJvbWlzZShjYWxsYmFja1N0b3AsIGlkKTtcbiAgICB9XG5cbiAgICB2YXIgYWN0b3IgPSAoX2EgPSB7XG4gICAgICBpZDogaWQsXG4gICAgICBzZW5kOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIHJlY2VpdmVycy5mb3JFYWNoKGZ1bmN0aW9uIChyZWNlaXZlcikge1xuICAgICAgICAgIHJldHVybiByZWNlaXZlcihldmVudCk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIHN1YnNjcmliZTogZnVuY3Rpb24gKG5leHQpIHtcbiAgICAgICAgdmFyIG9ic2VydmVyID0gdG9PYnNlcnZlcihuZXh0KTtcbiAgICAgICAgbGlzdGVuZXJzLmFkZChvYnNlcnZlci5uZXh0KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbGlzdGVuZXJzLmRlbGV0ZShvYnNlcnZlci5uZXh0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYW5jZWxlZCA9IHRydWU7XG5cbiAgICAgICAgaWYgKGlzRnVuY3Rpb24oY2FsbGJhY2tTdG9wKSkge1xuICAgICAgICAgIGNhbGxiYWNrU3RvcCgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdG9KU09OOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaWQ6IGlkXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgZ2V0U25hcHNob3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGVtaXR0ZWQ7XG4gICAgICB9XG4gICAgfSwgX2Fbc3ltYm9sT2JzZXJ2YWJsZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LCBfYSk7XG4gICAgdGhpcy5jaGlsZHJlbi5zZXQoaWQsIGFjdG9yKTtcbiAgICByZXR1cm4gYWN0b3I7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnNwYXduT2JzZXJ2YWJsZSA9IGZ1bmN0aW9uIChzb3VyY2UsIGlkKSB7XG4gICAgdmFyIF9hO1xuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBlbWl0dGVkO1xuICAgIHZhciBzdWJzY3JpcHRpb24gPSBzb3VyY2Uuc3Vic2NyaWJlKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgZW1pdHRlZCA9IHZhbHVlO1xuXG4gICAgICBfdGhpcy5zZW5kKHRvU0NYTUxFdmVudCh2YWx1ZSwge1xuICAgICAgICBvcmlnaW46IGlkXG4gICAgICB9KSk7XG4gICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgX3RoaXMucmVtb3ZlQ2hpbGQoaWQpO1xuXG4gICAgICBfdGhpcy5zZW5kKHRvU0NYTUxFdmVudChlcnJvcihpZCwgZXJyKSwge1xuICAgICAgICBvcmlnaW46IGlkXG4gICAgICB9KSk7XG4gICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgX3RoaXMucmVtb3ZlQ2hpbGQoaWQpO1xuXG4gICAgICBfdGhpcy5zZW5kKHRvU0NYTUxFdmVudChkb25lSW52b2tlKGlkKSwge1xuICAgICAgICBvcmlnaW46IGlkXG4gICAgICB9KSk7XG4gICAgfSk7XG4gICAgdmFyIGFjdG9yID0gKF9hID0ge1xuICAgICAgaWQ6IGlkLFxuICAgICAgc2VuZDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgICAgfSxcbiAgICAgIHN1YnNjcmliZTogZnVuY3Rpb24gKG5leHQsIGhhbmRsZUVycm9yLCBjb21wbGV0ZSkge1xuICAgICAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXh0LCBoYW5kbGVFcnJvciwgY29tcGxldGUpO1xuICAgICAgfSxcbiAgICAgIHN0b3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgfSxcbiAgICAgIGdldFNuYXBzaG90OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBlbWl0dGVkO1xuICAgICAgfSxcbiAgICAgIHRvSlNPTjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlkOiBpZFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0sIF9hW3N5bWJvbE9ic2VydmFibGVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSwgX2EpO1xuICAgIHRoaXMuY2hpbGRyZW4uc2V0KGlkLCBhY3Rvcik7XG4gICAgcmV0dXJuIGFjdG9yO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5zcGF3bkFjdG9yID0gZnVuY3Rpb24gKGFjdG9yLCBuYW1lKSB7XG4gICAgdGhpcy5jaGlsZHJlbi5zZXQobmFtZSwgYWN0b3IpO1xuICAgIHJldHVybiBhY3RvcjtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc3Bhd25BY3Rpdml0eSA9IGZ1bmN0aW9uIChhY3Rpdml0eSkge1xuICAgIHZhciBpbXBsZW1lbnRhdGlvbiA9IHRoaXMubWFjaGluZS5vcHRpb25zICYmIHRoaXMubWFjaGluZS5vcHRpb25zLmFjdGl2aXRpZXMgPyB0aGlzLm1hY2hpbmUub3B0aW9ucy5hY3Rpdml0aWVzW2FjdGl2aXR5LnR5cGVdIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKCFpbXBsZW1lbnRhdGlvbikge1xuICAgICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICAgIHdhcm4oZmFsc2UsIFwiTm8gaW1wbGVtZW50YXRpb24gZm91bmQgZm9yIGFjdGl2aXR5ICdcIi5jb25jYXQoYWN0aXZpdHkudHlwZSwgXCInXCIpKTtcbiAgICAgIH0gLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbnNvbGVcblxuXG4gICAgICByZXR1cm47XG4gICAgfSAvLyBTdGFydCBpbXBsZW1lbnRhdGlvblxuXG5cbiAgICB2YXIgZGlzcG9zZSA9IGltcGxlbWVudGF0aW9uKHRoaXMuc3RhdGUuY29udGV4dCwgYWN0aXZpdHkpO1xuICAgIHRoaXMuc3Bhd25FZmZlY3QoYWN0aXZpdHkuaWQsIGRpc3Bvc2UpO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5zcGF3bkVmZmVjdCA9IGZ1bmN0aW9uIChpZCwgZGlzcG9zZSkge1xuICAgIHZhciBfYTtcblxuICAgIHRoaXMuY2hpbGRyZW4uc2V0KGlkLCAoX2EgPSB7XG4gICAgICBpZDogaWQsXG4gICAgICBzZW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgICB9LFxuICAgICAgc3Vic2NyaWJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIHN0b3A6IGRpc3Bvc2UgfHwgdW5kZWZpbmVkLFxuICAgICAgZ2V0U25hcHNob3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH0sXG4gICAgICB0b0pTT046IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpZDogaWRcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9LCBfYVtzeW1ib2xPYnNlcnZhYmxlXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sIF9hKSk7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLmF0dGFjaERldiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZ2xvYmFsID0gZ2V0R2xvYmFsKCk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmRldlRvb2xzICYmIGdsb2JhbCkge1xuICAgICAgaWYgKGdsb2JhbC5fX1JFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTl9fKSB7XG4gICAgICAgIHZhciBkZXZUb29sc09wdGlvbnMgPSB0eXBlb2YgdGhpcy5vcHRpb25zLmRldlRvb2xzID09PSAnb2JqZWN0JyA/IHRoaXMub3B0aW9ucy5kZXZUb29scyA6IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5kZXZUb29scyA9IGdsb2JhbC5fX1JFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTl9fLmNvbm5lY3QoX19hc3NpZ24oX19hc3NpZ24oe1xuICAgICAgICAgIG5hbWU6IHRoaXMuaWQsXG4gICAgICAgICAgYXV0b1BhdXNlOiB0cnVlLFxuICAgICAgICAgIHN0YXRlU2FuaXRpemVyOiBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHZhbHVlOiBzdGF0ZS52YWx1ZSxcbiAgICAgICAgICAgICAgY29udGV4dDogc3RhdGUuY29udGV4dCxcbiAgICAgICAgICAgICAgYWN0aW9uczogc3RhdGUuYWN0aW9uc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIGRldlRvb2xzT3B0aW9ucyksIHtcbiAgICAgICAgICBmZWF0dXJlczogX19hc3NpZ24oe1xuICAgICAgICAgICAganVtcDogZmFsc2UsXG4gICAgICAgICAgICBza2lwOiBmYWxzZVxuICAgICAgICAgIH0sIGRldlRvb2xzT3B0aW9ucyA/IGRldlRvb2xzT3B0aW9ucy5mZWF0dXJlcyA6IHVuZGVmaW5lZClcbiAgICAgICAgfSksIHRoaXMubWFjaGluZSk7XG4gICAgICAgIHRoaXMuZGV2VG9vbHMuaW5pdCh0aGlzLnN0YXRlKTtcbiAgICAgIH0gLy8gYWRkIFhTdGF0ZS1zcGVjaWZpYyBkZXYgdG9vbGluZyBob29rXG5cblxuICAgICAgcmVnaXN0ZXJTZXJ2aWNlKHRoaXMpO1xuICAgIH1cbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogdGhpcy5pZFxuICAgIH07XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlW3N5bWJvbE9ic2VydmFibGVdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5nZXRTbmFwc2hvdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5zdGF0dXMgPT09IEludGVycHJldGVyU3RhdHVzLk5vdFN0YXJ0ZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmluaXRpYWxTdGF0ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fc3RhdGU7XG4gIH07XG4gIC8qKlxyXG4gICAqIFRoZSBkZWZhdWx0IGludGVycHJldGVyIG9wdGlvbnM6XHJcbiAgICpcclxuICAgKiAtIGBjbG9ja2AgdXNlcyB0aGUgZ2xvYmFsIGBzZXRUaW1lb3V0YCBhbmQgYGNsZWFyVGltZW91dGAgZnVuY3Rpb25zXHJcbiAgICogLSBgbG9nZ2VyYCB1c2VzIHRoZSBnbG9iYWwgYGNvbnNvbGUubG9nKClgIG1ldGhvZFxyXG4gICAqL1xuXG5cbiAgSW50ZXJwcmV0ZXIuZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgZXhlY3V0ZTogdHJ1ZSxcbiAgICBkZWZlckV2ZW50czogdHJ1ZSxcbiAgICBjbG9jazoge1xuICAgICAgc2V0VGltZW91dDogZnVuY3Rpb24gKGZuLCBtcykge1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmbiwgbXMpO1xuICAgICAgfSxcbiAgICAgIGNsZWFyVGltZW91dDogZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQoaWQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgbG9nZ2VyOiAvKiNfX1BVUkVfXyovY29uc29sZS5sb2cuYmluZChjb25zb2xlKSxcbiAgICBkZXZUb29sczogZmFsc2VcbiAgfTtcbiAgSW50ZXJwcmV0ZXIuaW50ZXJwcmV0ID0gaW50ZXJwcmV0O1xuICByZXR1cm4gSW50ZXJwcmV0ZXI7XG59KCk7XG5cbnZhciByZXNvbHZlU3Bhd25PcHRpb25zID0gZnVuY3Rpb24gKG5hbWVPck9wdGlvbnMpIHtcbiAgaWYgKGlzU3RyaW5nKG5hbWVPck9wdGlvbnMpKSB7XG4gICAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCBERUZBVUxUX1NQQVdOX09QVElPTlMpLCB7XG4gICAgICBuYW1lOiBuYW1lT3JPcHRpb25zXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oX19hc3NpZ24oe30sIERFRkFVTFRfU1BBV05fT1BUSU9OUyksIHtcbiAgICBuYW1lOiB1bmlxdWVJZCgpXG4gIH0pLCBuYW1lT3JPcHRpb25zKTtcbn07XG5cbmZ1bmN0aW9uIHNwYXduKGVudGl0eSwgbmFtZU9yT3B0aW9ucykge1xuICB2YXIgcmVzb2x2ZWRPcHRpb25zID0gcmVzb2x2ZVNwYXduT3B0aW9ucyhuYW1lT3JPcHRpb25zKTtcbiAgcmV0dXJuIGNvbnN1bWUoZnVuY3Rpb24gKHNlcnZpY2UpIHtcbiAgICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICAgIHZhciBpc0xhenlFbnRpdHkgPSBpc01hY2hpbmUoZW50aXR5KSB8fCBpc0Z1bmN0aW9uKGVudGl0eSk7XG4gICAgICB3YXJuKCEhc2VydmljZSB8fCBpc0xhenlFbnRpdHksIFwiQXR0ZW1wdGVkIHRvIHNwYXduIGFuIEFjdG9yIChJRDogXFxcIlwiLmNvbmNhdChpc01hY2hpbmUoZW50aXR5KSA/IGVudGl0eS5pZCA6ICd1bmRlZmluZWQnLCBcIlxcXCIpIG91dHNpZGUgb2YgYSBzZXJ2aWNlLiBUaGlzIHdpbGwgaGF2ZSBubyBlZmZlY3QuXCIpKTtcbiAgICB9XG5cbiAgICBpZiAoc2VydmljZSkge1xuICAgICAgcmV0dXJuIHNlcnZpY2Uuc3Bhd24oZW50aXR5LCByZXNvbHZlZE9wdGlvbnMubmFtZSwgcmVzb2x2ZWRPcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNyZWF0ZURlZmVycmVkQWN0b3IoZW50aXR5LCByZXNvbHZlZE9wdGlvbnMubmFtZSk7XG4gICAgfVxuICB9KTtcbn1cbi8qKlxyXG4gKiBDcmVhdGVzIGEgbmV3IEludGVycHJldGVyIGluc3RhbmNlIGZvciB0aGUgZ2l2ZW4gbWFjaGluZSB3aXRoIHRoZSBwcm92aWRlZCBvcHRpb25zLCBpZiBhbnkuXHJcbiAqXHJcbiAqIEBwYXJhbSBtYWNoaW5lIFRoZSBtYWNoaW5lIHRvIGludGVycHJldFxyXG4gKiBAcGFyYW0gb3B0aW9ucyBJbnRlcnByZXRlciBvcHRpb25zXHJcbiAqL1xuXG5mdW5jdGlvbiBpbnRlcnByZXQobWFjaGluZSwgb3B0aW9ucykge1xuICB2YXIgaW50ZXJwcmV0ZXIgPSBuZXcgSW50ZXJwcmV0ZXIobWFjaGluZSwgb3B0aW9ucyk7XG4gIHJldHVybiBpbnRlcnByZXRlcjtcbn1cblxuZXhwb3J0IHsgSW50ZXJwcmV0ZXIsIEludGVycHJldGVyU3RhdHVzLCBpbnRlcnByZXQsIHNwYXduIH07XG4iLCJpbXBvcnQgeyBfX2Fzc2lnbiwgX19yZXN0IH0gZnJvbSAnLi9fdmlydHVhbC9fdHNsaWIuanMnO1xuaW1wb3J0ICcuL3R5cGVzLmpzJztcbmltcG9ydCB7IGludm9rZSB9IGZyb20gJy4vYWN0aW9uVHlwZXMuanMnO1xuaW1wb3J0ICcuL3V0aWxzLmpzJztcbmltcG9ydCAnLi9lbnZpcm9ubWVudC5qcyc7XG5cbmZ1bmN0aW9uIHRvSW52b2tlU291cmNlKHNyYykge1xuICBpZiAodHlwZW9mIHNyYyA9PT0gJ3N0cmluZycpIHtcbiAgICB2YXIgc2ltcGxlU3JjID0ge1xuICAgICAgdHlwZTogc3JjXG4gICAgfTtcblxuICAgIHNpbXBsZVNyYy50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBzcmM7XG4gICAgfTsgLy8gdjQgY29tcGF0IC0gVE9ETzogcmVtb3ZlIGluIHY1XG5cblxuICAgIHJldHVybiBzaW1wbGVTcmM7XG4gIH1cblxuICByZXR1cm4gc3JjO1xufVxuZnVuY3Rpb24gdG9JbnZva2VEZWZpbml0aW9uKGludm9rZUNvbmZpZykge1xuICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe1xuICAgIHR5cGU6IGludm9rZVxuICB9LCBpbnZva2VDb25maWcpLCB7XG4gICAgdG9KU09OOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpbnZva2VDb25maWcub25Eb25lO1xuICAgICAgICAgIGludm9rZUNvbmZpZy5vbkVycm9yO1xuICAgICAgICAgIHZhciBpbnZva2VEZWYgPSBfX3Jlc3QoaW52b2tlQ29uZmlnLCBbXCJvbkRvbmVcIiwgXCJvbkVycm9yXCJdKTtcblxuICAgICAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCBpbnZva2VEZWYpLCB7XG4gICAgICAgIHR5cGU6IGludm9rZSxcbiAgICAgICAgc3JjOiB0b0ludm9rZVNvdXJjZShpbnZva2VDb25maWcuc3JjKVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IHsgdG9JbnZva2VEZWZpbml0aW9uLCB0b0ludm9rZVNvdXJjZSB9O1xuIiwiaW1wb3J0IHsgX192YWx1ZXMgfSBmcm9tICcuL192aXJ0dWFsL190c2xpYi5qcyc7XG5pbXBvcnQgeyBtYXRjaGVzU3RhdGUgfSBmcm9tICcuL3V0aWxzLmpzJztcblxuZnVuY3Rpb24gbWFwU3RhdGUoc3RhdGVNYXAsIHN0YXRlSWQpIHtcbiAgdmFyIGVfMSwgX2E7XG5cbiAgdmFyIGZvdW5kU3RhdGVJZDtcblxuICB0cnkge1xuICAgIGZvciAodmFyIF9iID0gX192YWx1ZXMoT2JqZWN0LmtleXMoc3RhdGVNYXApKSwgX2MgPSBfYi5uZXh0KCk7ICFfYy5kb25lOyBfYyA9IF9iLm5leHQoKSkge1xuICAgICAgdmFyIG1hcHBlZFN0YXRlSWQgPSBfYy52YWx1ZTtcblxuICAgICAgaWYgKG1hdGNoZXNTdGF0ZShtYXBwZWRTdGF0ZUlkLCBzdGF0ZUlkKSAmJiAoIWZvdW5kU3RhdGVJZCB8fCBzdGF0ZUlkLmxlbmd0aCA+IGZvdW5kU3RhdGVJZC5sZW5ndGgpKSB7XG4gICAgICAgIGZvdW5kU3RhdGVJZCA9IG1hcHBlZFN0YXRlSWQ7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlXzFfMSkge1xuICAgIGVfMSA9IHtcbiAgICAgIGVycm9yOiBlXzFfMVxuICAgIH07XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChfYyAmJiAhX2MuZG9uZSAmJiAoX2EgPSBfYi5yZXR1cm4pKSBfYS5jYWxsKF9iKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzdGF0ZU1hcFtmb3VuZFN0YXRlSWRdO1xufVxuXG5leHBvcnQgeyBtYXBTdGF0ZSB9O1xuIiwiaW1wb3J0IHsgX192YWx1ZXMsIF9fcmVhZCB9IGZyb20gJy4vX3ZpcnR1YWwvX3RzbGliLmpzJztcbmltcG9ydCB7IFN0YXRlIH0gZnJvbSAnLi9TdGF0ZS5qcyc7XG5cbmZ1bmN0aW9uIG1hdGNoU3RhdGUoc3RhdGUsIHBhdHRlcm5zLCBkZWZhdWx0VmFsdWUpIHtcbiAgdmFyIGVfMSwgX2E7XG5cbiAgdmFyIHJlc29sdmVkU3RhdGUgPSBTdGF0ZS5mcm9tKHN0YXRlLCBzdGF0ZSBpbnN0YW5jZW9mIFN0YXRlID8gc3RhdGUuY29udGV4dCA6IHVuZGVmaW5lZCk7XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBwYXR0ZXJuc18xID0gX192YWx1ZXMocGF0dGVybnMpLCBwYXR0ZXJuc18xXzEgPSBwYXR0ZXJuc18xLm5leHQoKTsgIXBhdHRlcm5zXzFfMS5kb25lOyBwYXR0ZXJuc18xXzEgPSBwYXR0ZXJuc18xLm5leHQoKSkge1xuICAgICAgdmFyIF9iID0gX19yZWFkKHBhdHRlcm5zXzFfMS52YWx1ZSwgMiksXG4gICAgICAgICAgc3RhdGVWYWx1ZSA9IF9iWzBdLFxuICAgICAgICAgIGdldFZhbHVlID0gX2JbMV07XG5cbiAgICAgIGlmIChyZXNvbHZlZFN0YXRlLm1hdGNoZXMoc3RhdGVWYWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIGdldFZhbHVlKHJlc29sdmVkU3RhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZV8xXzEpIHtcbiAgICBlXzEgPSB7XG4gICAgICBlcnJvcjogZV8xXzFcbiAgICB9O1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAocGF0dGVybnNfMV8xICYmICFwYXR0ZXJuc18xXzEuZG9uZSAmJiAoX2EgPSBwYXR0ZXJuc18xLnJldHVybikpIF9hLmNhbGwocGF0dGVybnNfMSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGVmYXVsdFZhbHVlKHJlc29sdmVkU3RhdGUpO1xufVxuXG5leHBvcnQgeyBtYXRjaFN0YXRlIH07XG4iLCJ2YXIgY2hpbGRyZW4gPSAvKiNfX1BVUkVfXyovbmV3IE1hcCgpO1xudmFyIHNlc3Npb25JZEluZGV4ID0gMDtcbnZhciByZWdpc3RyeSA9IHtcbiAgYm9va0lkOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFwieDpcIi5jb25jYXQoc2Vzc2lvbklkSW5kZXgrKyk7XG4gIH0sXG4gIHJlZ2lzdGVyOiBmdW5jdGlvbiAoaWQsIGFjdG9yKSB7XG4gICAgY2hpbGRyZW4uc2V0KGlkLCBhY3Rvcik7XG4gICAgcmV0dXJuIGlkO1xuICB9LFxuICBnZXQ6IGZ1bmN0aW9uIChpZCkge1xuICAgIHJldHVybiBjaGlsZHJlbi5nZXQoaWQpO1xuICB9LFxuICBmcmVlOiBmdW5jdGlvbiAoaWQpIHtcbiAgICBjaGlsZHJlbi5kZWxldGUoaWQpO1xuICB9XG59O1xuXG5leHBvcnQgeyByZWdpc3RyeSB9O1xuIiwiaW1wb3J0IHsgX19hc3NpZ24gfSBmcm9tICcuL192aXJ0dWFsL190c2xpYi5qcyc7XG5cbnZhciBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgZGVmZXJFdmVudHM6IGZhbHNlXG59O1xuXG52YXIgU2NoZWR1bGVyID1cbi8qI19fUFVSRV9fKi9cblxuLyoqIEBjbGFzcyAqL1xuZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBTY2hlZHVsZXIob3B0aW9ucykge1xuICAgIHRoaXMucHJvY2Vzc2luZ0V2ZW50ID0gZmFsc2U7XG4gICAgdGhpcy5xdWV1ZSA9IFtdO1xuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICB0aGlzLm9wdGlvbnMgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgZGVmYXVsdE9wdGlvbnMpLCBvcHRpb25zKTtcbiAgfVxuXG4gIFNjaGVkdWxlci5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5kZWZlckV2ZW50cykge1xuICAgICAgICB0aGlzLnNjaGVkdWxlKGNhbGxiYWNrKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnByb2Nlc3MoY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHRoaXMuZmx1c2hFdmVudHMoKTtcbiAgfTtcblxuICBTY2hlZHVsZXIucHJvdG90eXBlLnNjaGVkdWxlID0gZnVuY3Rpb24gKHRhc2spIHtcbiAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZWQgfHwgdGhpcy5wcm9jZXNzaW5nRXZlbnQpIHtcbiAgICAgIHRoaXMucXVldWUucHVzaCh0YXNrKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5xdWV1ZS5sZW5ndGggIT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXZlbnQgcXVldWUgc2hvdWxkIGJlIGVtcHR5IHdoZW4gaXQgaXMgbm90IHByb2Nlc3NpbmcgZXZlbnRzJyk7XG4gICAgfVxuXG4gICAgdGhpcy5wcm9jZXNzKHRhc2spO1xuICAgIHRoaXMuZmx1c2hFdmVudHMoKTtcbiAgfTtcblxuICBTY2hlZHVsZXIucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucXVldWUgPSBbXTtcbiAgfTtcblxuICBTY2hlZHVsZXIucHJvdG90eXBlLmZsdXNoRXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBuZXh0Q2FsbGJhY2sgPSB0aGlzLnF1ZXVlLnNoaWZ0KCk7XG5cbiAgICB3aGlsZSAobmV4dENhbGxiYWNrKSB7XG4gICAgICB0aGlzLnByb2Nlc3MobmV4dENhbGxiYWNrKTtcbiAgICAgIG5leHRDYWxsYmFjayA9IHRoaXMucXVldWUuc2hpZnQoKTtcbiAgICB9XG4gIH07XG5cbiAgU2NoZWR1bGVyLnByb3RvdHlwZS5wcm9jZXNzID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5wcm9jZXNzaW5nRXZlbnQgPSB0cnVlO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gdGhlcmUgaXMgbm8gdXNlIHRvIGtlZXAgdGhlIGZ1dHVyZSBldmVudHNcbiAgICAgIC8vIGFzIHRoZSBzaXR1YXRpb24gaXMgbm90IGFueW1vcmUgdGhlIHNhbWVcbiAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgIHRocm93IGU7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMucHJvY2Vzc2luZ0V2ZW50ID0gZmFsc2U7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBTY2hlZHVsZXI7XG59KCk7XG5cbmV4cG9ydCB7IFNjaGVkdWxlciB9O1xuIiwiZnVuY3Rpb24gY3JlYXRlU2NoZW1hKHNjaGVtYSkge1xuICByZXR1cm4gc2NoZW1hO1xufVxudmFyIHQgPSBjcmVhdGVTY2hlbWE7XG5cbmV4cG9ydCB7IGNyZWF0ZVNjaGVtYSwgdCB9O1xuIiwiLyoqXHJcbiAqIE1haW50YWlucyBhIHN0YWNrIG9mIHRoZSBjdXJyZW50IHNlcnZpY2UgaW4gc2NvcGUuXHJcbiAqIFRoaXMgaXMgdXNlZCB0byBwcm92aWRlIHRoZSBjb3JyZWN0IHNlcnZpY2UgdG8gc3Bhd24oKS5cclxuICovXG52YXIgc2VydmljZVN0YWNrID0gW107XG52YXIgcHJvdmlkZSA9IGZ1bmN0aW9uIChzZXJ2aWNlLCBmbikge1xuICBzZXJ2aWNlU3RhY2sucHVzaChzZXJ2aWNlKTtcbiAgdmFyIHJlc3VsdCA9IGZuKHNlcnZpY2UpO1xuICBzZXJ2aWNlU3RhY2sucG9wKCk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xudmFyIGNvbnN1bWUgPSBmdW5jdGlvbiAoZm4pIHtcbiAgcmV0dXJuIGZuKHNlcnZpY2VTdGFja1tzZXJ2aWNlU3RhY2subGVuZ3RoIC0gMV0pO1xufTtcblxuZXhwb3J0IHsgY29uc3VtZSwgcHJvdmlkZSB9O1xuIiwiaW1wb3J0IHsgX192YWx1ZXMsIF9fc3ByZWFkQXJyYXksIF9fcmVhZCB9IGZyb20gJy4vX3ZpcnR1YWwvX3RzbGliLmpzJztcbmltcG9ydCB7IGZsYXR0ZW4gfSBmcm9tICcuL3V0aWxzLmpzJztcblxudmFyIGlzTGVhZk5vZGUgPSBmdW5jdGlvbiAoc3RhdGVOb2RlKSB7XG4gIHJldHVybiBzdGF0ZU5vZGUudHlwZSA9PT0gJ2F0b21pYycgfHwgc3RhdGVOb2RlLnR5cGUgPT09ICdmaW5hbCc7XG59O1xuZnVuY3Rpb24gZ2V0QWxsQ2hpbGRyZW4oc3RhdGVOb2RlKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhzdGF0ZU5vZGUuc3RhdGVzKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBzdGF0ZU5vZGUuc3RhdGVzW2tleV07XG4gIH0pO1xufVxuZnVuY3Rpb24gZ2V0Q2hpbGRyZW4oc3RhdGVOb2RlKSB7XG4gIHJldHVybiBnZXRBbGxDaGlsZHJlbihzdGF0ZU5vZGUpLmZpbHRlcihmdW5jdGlvbiAoc24pIHtcbiAgICByZXR1cm4gc24udHlwZSAhPT0gJ2hpc3RvcnknO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGdldEFsbFN0YXRlTm9kZXMoc3RhdGVOb2RlKSB7XG4gIHZhciBzdGF0ZU5vZGVzID0gW3N0YXRlTm9kZV07XG5cbiAgaWYgKGlzTGVhZk5vZGUoc3RhdGVOb2RlKSkge1xuICAgIHJldHVybiBzdGF0ZU5vZGVzO1xuICB9XG5cbiAgcmV0dXJuIHN0YXRlTm9kZXMuY29uY2F0KGZsYXR0ZW4oZ2V0Q2hpbGRyZW4oc3RhdGVOb2RlKS5tYXAoZ2V0QWxsU3RhdGVOb2RlcykpKTtcbn1cbmZ1bmN0aW9uIGdldENvbmZpZ3VyYXRpb24ocHJldlN0YXRlTm9kZXMsIHN0YXRlTm9kZXMpIHtcbiAgdmFyIGVfMSwgX2EsIGVfMiwgX2IsIGVfMywgX2MsIGVfNCwgX2Q7XG5cbiAgdmFyIHByZXZDb25maWd1cmF0aW9uID0gbmV3IFNldChwcmV2U3RhdGVOb2Rlcyk7XG4gIHZhciBwcmV2QWRqTGlzdCA9IGdldEFkakxpc3QocHJldkNvbmZpZ3VyYXRpb24pO1xuICB2YXIgY29uZmlndXJhdGlvbiA9IG5ldyBTZXQoc3RhdGVOb2Rlcyk7XG5cbiAgdHJ5IHtcbiAgICAvLyBhZGQgYWxsIGFuY2VzdG9yc1xuICAgIGZvciAodmFyIGNvbmZpZ3VyYXRpb25fMSA9IF9fdmFsdWVzKGNvbmZpZ3VyYXRpb24pLCBjb25maWd1cmF0aW9uXzFfMSA9IGNvbmZpZ3VyYXRpb25fMS5uZXh0KCk7ICFjb25maWd1cmF0aW9uXzFfMS5kb25lOyBjb25maWd1cmF0aW9uXzFfMSA9IGNvbmZpZ3VyYXRpb25fMS5uZXh0KCkpIHtcbiAgICAgIHZhciBzID0gY29uZmlndXJhdGlvbl8xXzEudmFsdWU7XG4gICAgICB2YXIgbSA9IHMucGFyZW50O1xuXG4gICAgICB3aGlsZSAobSAmJiAhY29uZmlndXJhdGlvbi5oYXMobSkpIHtcbiAgICAgICAgY29uZmlndXJhdGlvbi5hZGQobSk7XG4gICAgICAgIG0gPSBtLnBhcmVudDtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVfMV8xKSB7XG4gICAgZV8xID0ge1xuICAgICAgZXJyb3I6IGVfMV8xXG4gICAgfTtcbiAgfSBmaW5hbGx5IHtcbiAgICB0cnkge1xuICAgICAgaWYgKGNvbmZpZ3VyYXRpb25fMV8xICYmICFjb25maWd1cmF0aW9uXzFfMS5kb25lICYmIChfYSA9IGNvbmZpZ3VyYXRpb25fMS5yZXR1cm4pKSBfYS5jYWxsKGNvbmZpZ3VyYXRpb25fMSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjtcbiAgICB9XG4gIH1cblxuICB2YXIgYWRqTGlzdCA9IGdldEFkakxpc3QoY29uZmlndXJhdGlvbik7XG5cbiAgdHJ5IHtcbiAgICAvLyBhZGQgZGVzY2VuZGFudHNcbiAgICBmb3IgKHZhciBjb25maWd1cmF0aW9uXzIgPSBfX3ZhbHVlcyhjb25maWd1cmF0aW9uKSwgY29uZmlndXJhdGlvbl8yXzEgPSBjb25maWd1cmF0aW9uXzIubmV4dCgpOyAhY29uZmlndXJhdGlvbl8yXzEuZG9uZTsgY29uZmlndXJhdGlvbl8yXzEgPSBjb25maWd1cmF0aW9uXzIubmV4dCgpKSB7XG4gICAgICB2YXIgcyA9IGNvbmZpZ3VyYXRpb25fMl8xLnZhbHVlOyAvLyBpZiBwcmV2aW91c2x5IGFjdGl2ZSwgYWRkIGV4aXN0aW5nIGNoaWxkIG5vZGVzXG5cbiAgICAgIGlmIChzLnR5cGUgPT09ICdjb21wb3VuZCcgJiYgKCFhZGpMaXN0LmdldChzKSB8fCAhYWRqTGlzdC5nZXQocykubGVuZ3RoKSkge1xuICAgICAgICBpZiAocHJldkFkakxpc3QuZ2V0KHMpKSB7XG4gICAgICAgICAgcHJldkFkakxpc3QuZ2V0KHMpLmZvckVhY2goZnVuY3Rpb24gKHNuKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uZmlndXJhdGlvbi5hZGQoc24pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHMuaW5pdGlhbFN0YXRlTm9kZXMuZm9yRWFjaChmdW5jdGlvbiAoc24pIHtcbiAgICAgICAgICAgIHJldHVybiBjb25maWd1cmF0aW9uLmFkZChzbik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChzLnR5cGUgPT09ICdwYXJhbGxlbCcpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yICh2YXIgX2UgPSAoZV8zID0gdm9pZCAwLCBfX3ZhbHVlcyhnZXRDaGlsZHJlbihzKSkpLCBfZiA9IF9lLm5leHQoKTsgIV9mLmRvbmU7IF9mID0gX2UubmV4dCgpKSB7XG4gICAgICAgICAgICAgIHZhciBjaGlsZCA9IF9mLnZhbHVlO1xuXG4gICAgICAgICAgICAgIGlmICghY29uZmlndXJhdGlvbi5oYXMoY2hpbGQpKSB7XG4gICAgICAgICAgICAgICAgY29uZmlndXJhdGlvbi5hZGQoY2hpbGQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHByZXZBZGpMaXN0LmdldChjaGlsZCkpIHtcbiAgICAgICAgICAgICAgICAgIHByZXZBZGpMaXN0LmdldChjaGlsZCkuZm9yRWFjaChmdW5jdGlvbiAoc24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbmZpZ3VyYXRpb24uYWRkKHNuKTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBjaGlsZC5pbml0aWFsU3RhdGVOb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChzbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29uZmlndXJhdGlvbi5hZGQoc24pO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZV8zXzEpIHtcbiAgICAgICAgICAgIGVfMyA9IHtcbiAgICAgICAgICAgICAgZXJyb3I6IGVfM18xXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBpZiAoX2YgJiYgIV9mLmRvbmUgJiYgKF9jID0gX2UucmV0dXJuKSkgX2MuY2FsbChfZSk7XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICBpZiAoZV8zKSB0aHJvdyBlXzMuZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlXzJfMSkge1xuICAgIGVfMiA9IHtcbiAgICAgIGVycm9yOiBlXzJfMVxuICAgIH07XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChjb25maWd1cmF0aW9uXzJfMSAmJiAhY29uZmlndXJhdGlvbl8yXzEuZG9uZSAmJiAoX2IgPSBjb25maWd1cmF0aW9uXzIucmV0dXJuKSkgX2IuY2FsbChjb25maWd1cmF0aW9uXzIpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAoZV8yKSB0aHJvdyBlXzIuZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgdHJ5IHtcbiAgICAvLyBhZGQgYWxsIGFuY2VzdG9yc1xuICAgIGZvciAodmFyIGNvbmZpZ3VyYXRpb25fMyA9IF9fdmFsdWVzKGNvbmZpZ3VyYXRpb24pLCBjb25maWd1cmF0aW9uXzNfMSA9IGNvbmZpZ3VyYXRpb25fMy5uZXh0KCk7ICFjb25maWd1cmF0aW9uXzNfMS5kb25lOyBjb25maWd1cmF0aW9uXzNfMSA9IGNvbmZpZ3VyYXRpb25fMy5uZXh0KCkpIHtcbiAgICAgIHZhciBzID0gY29uZmlndXJhdGlvbl8zXzEudmFsdWU7XG4gICAgICB2YXIgbSA9IHMucGFyZW50O1xuXG4gICAgICB3aGlsZSAobSAmJiAhY29uZmlndXJhdGlvbi5oYXMobSkpIHtcbiAgICAgICAgY29uZmlndXJhdGlvbi5hZGQobSk7XG4gICAgICAgIG0gPSBtLnBhcmVudDtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVfNF8xKSB7XG4gICAgZV80ID0ge1xuICAgICAgZXJyb3I6IGVfNF8xXG4gICAgfTtcbiAgfSBmaW5hbGx5IHtcbiAgICB0cnkge1xuICAgICAgaWYgKGNvbmZpZ3VyYXRpb25fM18xICYmICFjb25maWd1cmF0aW9uXzNfMS5kb25lICYmIChfZCA9IGNvbmZpZ3VyYXRpb25fMy5yZXR1cm4pKSBfZC5jYWxsKGNvbmZpZ3VyYXRpb25fMyk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChlXzQpIHRocm93IGVfNC5lcnJvcjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY29uZmlndXJhdGlvbjtcbn1cblxuZnVuY3Rpb24gZ2V0VmFsdWVGcm9tQWRqKGJhc2VOb2RlLCBhZGpMaXN0KSB7XG4gIHZhciBjaGlsZFN0YXRlTm9kZXMgPSBhZGpMaXN0LmdldChiYXNlTm9kZSk7XG5cbiAgaWYgKCFjaGlsZFN0YXRlTm9kZXMpIHtcbiAgICByZXR1cm4ge307IC8vIHRvZG86IGZpeD9cbiAgfVxuXG4gIGlmIChiYXNlTm9kZS50eXBlID09PSAnY29tcG91bmQnKSB7XG4gICAgdmFyIGNoaWxkU3RhdGVOb2RlID0gY2hpbGRTdGF0ZU5vZGVzWzBdO1xuXG4gICAgaWYgKGNoaWxkU3RhdGVOb2RlKSB7XG4gICAgICBpZiAoaXNMZWFmTm9kZShjaGlsZFN0YXRlTm9kZSkpIHtcbiAgICAgICAgcmV0dXJuIGNoaWxkU3RhdGVOb2RlLmtleTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBzdGF0ZVZhbHVlID0ge307XG4gIGNoaWxkU3RhdGVOb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChjc24pIHtcbiAgICBzdGF0ZVZhbHVlW2Nzbi5rZXldID0gZ2V0VmFsdWVGcm9tQWRqKGNzbiwgYWRqTGlzdCk7XG4gIH0pO1xuICByZXR1cm4gc3RhdGVWYWx1ZTtcbn1cblxuZnVuY3Rpb24gZ2V0QWRqTGlzdChjb25maWd1cmF0aW9uKSB7XG4gIHZhciBlXzUsIF9hO1xuXG4gIHZhciBhZGpMaXN0ID0gbmV3IE1hcCgpO1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgY29uZmlndXJhdGlvbl80ID0gX192YWx1ZXMoY29uZmlndXJhdGlvbiksIGNvbmZpZ3VyYXRpb25fNF8xID0gY29uZmlndXJhdGlvbl80Lm5leHQoKTsgIWNvbmZpZ3VyYXRpb25fNF8xLmRvbmU7IGNvbmZpZ3VyYXRpb25fNF8xID0gY29uZmlndXJhdGlvbl80Lm5leHQoKSkge1xuICAgICAgdmFyIHMgPSBjb25maWd1cmF0aW9uXzRfMS52YWx1ZTtcblxuICAgICAgaWYgKCFhZGpMaXN0LmhhcyhzKSkge1xuICAgICAgICBhZGpMaXN0LnNldChzLCBbXSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzLnBhcmVudCkge1xuICAgICAgICBpZiAoIWFkakxpc3QuaGFzKHMucGFyZW50KSkge1xuICAgICAgICAgIGFkakxpc3Quc2V0KHMucGFyZW50LCBbXSk7XG4gICAgICAgIH1cblxuICAgICAgICBhZGpMaXN0LmdldChzLnBhcmVudCkucHVzaChzKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVfNV8xKSB7XG4gICAgZV81ID0ge1xuICAgICAgZXJyb3I6IGVfNV8xXG4gICAgfTtcbiAgfSBmaW5hbGx5IHtcbiAgICB0cnkge1xuICAgICAgaWYgKGNvbmZpZ3VyYXRpb25fNF8xICYmICFjb25maWd1cmF0aW9uXzRfMS5kb25lICYmIChfYSA9IGNvbmZpZ3VyYXRpb25fNC5yZXR1cm4pKSBfYS5jYWxsKGNvbmZpZ3VyYXRpb25fNCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChlXzUpIHRocm93IGVfNS5lcnJvcjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYWRqTGlzdDtcbn1cbmZ1bmN0aW9uIGdldFZhbHVlKHJvb3ROb2RlLCBjb25maWd1cmF0aW9uKSB7XG4gIHZhciBjb25maWcgPSBnZXRDb25maWd1cmF0aW9uKFtyb290Tm9kZV0sIGNvbmZpZ3VyYXRpb24pO1xuICByZXR1cm4gZ2V0VmFsdWVGcm9tQWRqKHJvb3ROb2RlLCBnZXRBZGpMaXN0KGNvbmZpZykpO1xufVxuZnVuY3Rpb24gaGFzKGl0ZXJhYmxlLCBpdGVtKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGl0ZXJhYmxlKSkge1xuICAgIHJldHVybiBpdGVyYWJsZS5zb21lKGZ1bmN0aW9uIChtZW1iZXIpIHtcbiAgICAgIHJldHVybiBtZW1iZXIgPT09IGl0ZW07XG4gICAgfSk7XG4gIH1cblxuICBpZiAoaXRlcmFibGUgaW5zdGFuY2VvZiBTZXQpIHtcbiAgICByZXR1cm4gaXRlcmFibGUuaGFzKGl0ZW0pO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlOyAvLyBUT0RPOiBmaXhcbn1cbmZ1bmN0aW9uIG5leHRFdmVudHMoY29uZmlndXJhdGlvbikge1xuICByZXR1cm4gX19zcHJlYWRBcnJheShbXSwgX19yZWFkKG5ldyBTZXQoZmxhdHRlbihfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoY29uZmlndXJhdGlvbi5tYXAoZnVuY3Rpb24gKHNuKSB7XG4gICAgcmV0dXJuIHNuLm93bkV2ZW50cztcbiAgfSkpLCBmYWxzZSkpKSksIGZhbHNlKTtcbn1cbmZ1bmN0aW9uIGlzSW5GaW5hbFN0YXRlKGNvbmZpZ3VyYXRpb24sIHN0YXRlTm9kZSkge1xuICBpZiAoc3RhdGVOb2RlLnR5cGUgPT09ICdjb21wb3VuZCcpIHtcbiAgICByZXR1cm4gZ2V0Q2hpbGRyZW4oc3RhdGVOb2RlKS5zb21lKGZ1bmN0aW9uIChzKSB7XG4gICAgICByZXR1cm4gcy50eXBlID09PSAnZmluYWwnICYmIGhhcyhjb25maWd1cmF0aW9uLCBzKTtcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChzdGF0ZU5vZGUudHlwZSA9PT0gJ3BhcmFsbGVsJykge1xuICAgIHJldHVybiBnZXRDaGlsZHJlbihzdGF0ZU5vZGUpLmV2ZXJ5KGZ1bmN0aW9uIChzbikge1xuICAgICAgcmV0dXJuIGlzSW5GaW5hbFN0YXRlKGNvbmZpZ3VyYXRpb24sIHNuKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cbmZ1bmN0aW9uIGdldE1ldGEoY29uZmlndXJhdGlvbikge1xuICBpZiAoY29uZmlndXJhdGlvbiA9PT0gdm9pZCAwKSB7XG4gICAgY29uZmlndXJhdGlvbiA9IFtdO1xuICB9XG5cbiAgcmV0dXJuIGNvbmZpZ3VyYXRpb24ucmVkdWNlKGZ1bmN0aW9uIChhY2MsIHN0YXRlTm9kZSkge1xuICAgIGlmIChzdGF0ZU5vZGUubWV0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBhY2Nbc3RhdGVOb2RlLmlkXSA9IHN0YXRlTm9kZS5tZXRhO1xuICAgIH1cblxuICAgIHJldHVybiBhY2M7XG4gIH0sIHt9KTtcbn1cbmZ1bmN0aW9uIGdldFRhZ3NGcm9tQ29uZmlndXJhdGlvbihjb25maWd1cmF0aW9uKSB7XG4gIHJldHVybiBuZXcgU2V0KGZsYXR0ZW4oY29uZmlndXJhdGlvbi5tYXAoZnVuY3Rpb24gKHNuKSB7XG4gICAgcmV0dXJuIHNuLnRhZ3M7XG4gIH0pKSk7XG59XG5cbmV4cG9ydCB7IGdldEFkakxpc3QsIGdldEFsbENoaWxkcmVuLCBnZXRBbGxTdGF0ZU5vZGVzLCBnZXRDaGlsZHJlbiwgZ2V0Q29uZmlndXJhdGlvbiwgZ2V0TWV0YSwgZ2V0VGFnc0Zyb21Db25maWd1cmF0aW9uLCBnZXRWYWx1ZSwgaGFzLCBpc0luRmluYWxTdGF0ZSwgaXNMZWFmTm9kZSwgbmV4dEV2ZW50cyB9O1xuIiwidmFyIEFjdGlvblR5cGVzO1xuXG4oZnVuY3Rpb24gKEFjdGlvblR5cGVzKSB7XG4gIEFjdGlvblR5cGVzW1wiU3RhcnRcIl0gPSBcInhzdGF0ZS5zdGFydFwiO1xuICBBY3Rpb25UeXBlc1tcIlN0b3BcIl0gPSBcInhzdGF0ZS5zdG9wXCI7XG4gIEFjdGlvblR5cGVzW1wiUmFpc2VcIl0gPSBcInhzdGF0ZS5yYWlzZVwiO1xuICBBY3Rpb25UeXBlc1tcIlNlbmRcIl0gPSBcInhzdGF0ZS5zZW5kXCI7XG4gIEFjdGlvblR5cGVzW1wiQ2FuY2VsXCJdID0gXCJ4c3RhdGUuY2FuY2VsXCI7XG4gIEFjdGlvblR5cGVzW1wiTnVsbEV2ZW50XCJdID0gXCJcIjtcbiAgQWN0aW9uVHlwZXNbXCJBc3NpZ25cIl0gPSBcInhzdGF0ZS5hc3NpZ25cIjtcbiAgQWN0aW9uVHlwZXNbXCJBZnRlclwiXSA9IFwieHN0YXRlLmFmdGVyXCI7XG4gIEFjdGlvblR5cGVzW1wiRG9uZVN0YXRlXCJdID0gXCJkb25lLnN0YXRlXCI7XG4gIEFjdGlvblR5cGVzW1wiRG9uZUludm9rZVwiXSA9IFwiZG9uZS5pbnZva2VcIjtcbiAgQWN0aW9uVHlwZXNbXCJMb2dcIl0gPSBcInhzdGF0ZS5sb2dcIjtcbiAgQWN0aW9uVHlwZXNbXCJJbml0XCJdID0gXCJ4c3RhdGUuaW5pdFwiO1xuICBBY3Rpb25UeXBlc1tcIkludm9rZVwiXSA9IFwieHN0YXRlLmludm9rZVwiO1xuICBBY3Rpb25UeXBlc1tcIkVycm9yRXhlY3V0aW9uXCJdID0gXCJlcnJvci5leGVjdXRpb25cIjtcbiAgQWN0aW9uVHlwZXNbXCJFcnJvckNvbW11bmljYXRpb25cIl0gPSBcImVycm9yLmNvbW11bmljYXRpb25cIjtcbiAgQWN0aW9uVHlwZXNbXCJFcnJvclBsYXRmb3JtXCJdID0gXCJlcnJvci5wbGF0Zm9ybVwiO1xuICBBY3Rpb25UeXBlc1tcIkVycm9yQ3VzdG9tXCJdID0gXCJ4c3RhdGUuZXJyb3JcIjtcbiAgQWN0aW9uVHlwZXNbXCJVcGRhdGVcIl0gPSBcInhzdGF0ZS51cGRhdGVcIjtcbiAgQWN0aW9uVHlwZXNbXCJQdXJlXCJdID0gXCJ4c3RhdGUucHVyZVwiO1xuICBBY3Rpb25UeXBlc1tcIkNob29zZVwiXSA9IFwieHN0YXRlLmNob29zZVwiO1xufSkoQWN0aW9uVHlwZXMgfHwgKEFjdGlvblR5cGVzID0ge30pKTtcblxudmFyIFNwZWNpYWxUYXJnZXRzO1xuXG4oZnVuY3Rpb24gKFNwZWNpYWxUYXJnZXRzKSB7XG4gIFNwZWNpYWxUYXJnZXRzW1wiUGFyZW50XCJdID0gXCIjX3BhcmVudFwiO1xuICBTcGVjaWFsVGFyZ2V0c1tcIkludGVybmFsXCJdID0gXCIjX2ludGVybmFsXCI7XG59KShTcGVjaWFsVGFyZ2V0cyB8fCAoU3BlY2lhbFRhcmdldHMgPSB7fSkpO1xuXG5leHBvcnQgeyBBY3Rpb25UeXBlcywgU3BlY2lhbFRhcmdldHMgfTtcbiIsImltcG9ydCB7IF9fdmFsdWVzLCBfX3NwcmVhZEFycmF5LCBfX3JlYWQsIF9fYXNzaWduIH0gZnJvbSAnLi9fdmlydHVhbC9fdHNsaWIuanMnO1xuaW1wb3J0IHsgU3BlY2lhbFRhcmdldHMgfSBmcm9tICcuL3R5cGVzLmpzJztcbmltcG9ydCB7IHJhaXNlLCBzZW5kIH0gZnJvbSAnLi9hY3Rpb25UeXBlcy5qcyc7XG5pbXBvcnQgeyBERUZBVUxUX0dVQVJEX1RZUEUsIFRBUkdFVExFU1NfS0VZLCBTVEFURV9ERUxJTUlURVIgfSBmcm9tICcuL2NvbnN0YW50cy5qcyc7XG5pbXBvcnQgeyBJU19QUk9EVUNUSU9OIH0gZnJvbSAnLi9lbnZpcm9ubWVudC5qcyc7XG5cbnZhciBfYTtcbmZ1bmN0aW9uIGtleXModmFsdWUpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHZhbHVlKTtcbn1cbmZ1bmN0aW9uIG1hdGNoZXNTdGF0ZShwYXJlbnRTdGF0ZUlkLCBjaGlsZFN0YXRlSWQsIGRlbGltaXRlcikge1xuICBpZiAoZGVsaW1pdGVyID09PSB2b2lkIDApIHtcbiAgICBkZWxpbWl0ZXIgPSBTVEFURV9ERUxJTUlURVI7XG4gIH1cblxuICB2YXIgcGFyZW50U3RhdGVWYWx1ZSA9IHRvU3RhdGVWYWx1ZShwYXJlbnRTdGF0ZUlkLCBkZWxpbWl0ZXIpO1xuICB2YXIgY2hpbGRTdGF0ZVZhbHVlID0gdG9TdGF0ZVZhbHVlKGNoaWxkU3RhdGVJZCwgZGVsaW1pdGVyKTtcblxuICBpZiAoaXNTdHJpbmcoY2hpbGRTdGF0ZVZhbHVlKSkge1xuICAgIGlmIChpc1N0cmluZyhwYXJlbnRTdGF0ZVZhbHVlKSkge1xuICAgICAgcmV0dXJuIGNoaWxkU3RhdGVWYWx1ZSA9PT0gcGFyZW50U3RhdGVWYWx1ZTtcbiAgICB9IC8vIFBhcmVudCBtb3JlIHNwZWNpZmljIHRoYW4gY2hpbGRcblxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKGlzU3RyaW5nKHBhcmVudFN0YXRlVmFsdWUpKSB7XG4gICAgcmV0dXJuIHBhcmVudFN0YXRlVmFsdWUgaW4gY2hpbGRTdGF0ZVZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIE9iamVjdC5rZXlzKHBhcmVudFN0YXRlVmFsdWUpLmV2ZXJ5KGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAoIShrZXkgaW4gY2hpbGRTdGF0ZVZhbHVlKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBtYXRjaGVzU3RhdGUocGFyZW50U3RhdGVWYWx1ZVtrZXldLCBjaGlsZFN0YXRlVmFsdWVba2V5XSk7XG4gIH0pO1xufVxuZnVuY3Rpb24gZ2V0RXZlbnRUeXBlKGV2ZW50KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGlzU3RyaW5nKGV2ZW50KSB8fCB0eXBlb2YgZXZlbnQgPT09ICdudW1iZXInID8gXCJcIi5jb25jYXQoZXZlbnQpIDogZXZlbnQudHlwZTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignRXZlbnRzIG11c3QgYmUgc3RyaW5ncyBvciBvYmplY3RzIHdpdGggYSBzdHJpbmcgZXZlbnQudHlwZSBwcm9wZXJ0eS4nKTtcbiAgfVxufVxuZnVuY3Rpb24gZ2V0QWN0aW9uVHlwZShhY3Rpb24pIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaXNTdHJpbmcoYWN0aW9uKSB8fCB0eXBlb2YgYWN0aW9uID09PSAnbnVtYmVyJyA/IFwiXCIuY29uY2F0KGFjdGlvbikgOiBpc0Z1bmN0aW9uKGFjdGlvbikgPyBhY3Rpb24ubmFtZSA6IGFjdGlvbi50eXBlO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdBY3Rpb25zIG11c3QgYmUgc3RyaW5ncyBvciBvYmplY3RzIHdpdGggYSBzdHJpbmcgYWN0aW9uLnR5cGUgcHJvcGVydHkuJyk7XG4gIH1cbn1cbmZ1bmN0aW9uIHRvU3RhdGVQYXRoKHN0YXRlSWQsIGRlbGltaXRlcikge1xuICB0cnkge1xuICAgIGlmIChpc0FycmF5KHN0YXRlSWQpKSB7XG4gICAgICByZXR1cm4gc3RhdGVJZDtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdGVJZC50b1N0cmluZygpLnNwbGl0KGRlbGltaXRlcik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCInXCIuY29uY2F0KHN0YXRlSWQsIFwiJyBpcyBub3QgYSB2YWxpZCBzdGF0ZSBwYXRoLlwiKSk7XG4gIH1cbn1cbmZ1bmN0aW9uIGlzU3RhdGVMaWtlKHN0YXRlKSB7XG4gIHJldHVybiB0eXBlb2Ygc3RhdGUgPT09ICdvYmplY3QnICYmICd2YWx1ZScgaW4gc3RhdGUgJiYgJ2NvbnRleHQnIGluIHN0YXRlICYmICdldmVudCcgaW4gc3RhdGUgJiYgJ19ldmVudCcgaW4gc3RhdGU7XG59XG5mdW5jdGlvbiB0b1N0YXRlVmFsdWUoc3RhdGVWYWx1ZSwgZGVsaW1pdGVyKSB7XG4gIGlmIChpc1N0YXRlTGlrZShzdGF0ZVZhbHVlKSkge1xuICAgIHJldHVybiBzdGF0ZVZhbHVlLnZhbHVlO1xuICB9XG5cbiAgaWYgKGlzQXJyYXkoc3RhdGVWYWx1ZSkpIHtcbiAgICByZXR1cm4gcGF0aFRvU3RhdGVWYWx1ZShzdGF0ZVZhbHVlKTtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygc3RhdGVWYWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gc3RhdGVWYWx1ZTtcbiAgfVxuXG4gIHZhciBzdGF0ZVBhdGggPSB0b1N0YXRlUGF0aChzdGF0ZVZhbHVlLCBkZWxpbWl0ZXIpO1xuICByZXR1cm4gcGF0aFRvU3RhdGVWYWx1ZShzdGF0ZVBhdGgpO1xufVxuZnVuY3Rpb24gcGF0aFRvU3RhdGVWYWx1ZShzdGF0ZVBhdGgpIHtcbiAgaWYgKHN0YXRlUGF0aC5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gc3RhdGVQYXRoWzBdO1xuICB9XG5cbiAgdmFyIHZhbHVlID0ge307XG4gIHZhciBtYXJrZXIgPSB2YWx1ZTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0YXRlUGF0aC5sZW5ndGggLSAxOyBpKyspIHtcbiAgICBpZiAoaSA9PT0gc3RhdGVQYXRoLmxlbmd0aCAtIDIpIHtcbiAgICAgIG1hcmtlcltzdGF0ZVBhdGhbaV1dID0gc3RhdGVQYXRoW2kgKyAxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWFya2VyW3N0YXRlUGF0aFtpXV0gPSB7fTtcbiAgICAgIG1hcmtlciA9IG1hcmtlcltzdGF0ZVBhdGhbaV1dO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIG1hcFZhbHVlcyhjb2xsZWN0aW9uLCBpdGVyYXRlZSkge1xuICB2YXIgcmVzdWx0ID0ge307XG4gIHZhciBjb2xsZWN0aW9uS2V5cyA9IE9iamVjdC5rZXlzKGNvbGxlY3Rpb24pO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY29sbGVjdGlvbktleXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIga2V5ID0gY29sbGVjdGlvbktleXNbaV07XG4gICAgcmVzdWx0W2tleV0gPSBpdGVyYXRlZShjb2xsZWN0aW9uW2tleV0sIGtleSwgY29sbGVjdGlvbiwgaSk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbWFwRmlsdGVyVmFsdWVzKGNvbGxlY3Rpb24sIGl0ZXJhdGVlLCBwcmVkaWNhdGUpIHtcbiAgdmFyIGVfMSwgX2E7XG5cbiAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgX2IgPSBfX3ZhbHVlcyhPYmplY3Qua2V5cyhjb2xsZWN0aW9uKSksIF9jID0gX2IubmV4dCgpOyAhX2MuZG9uZTsgX2MgPSBfYi5uZXh0KCkpIHtcbiAgICAgIHZhciBrZXkgPSBfYy52YWx1ZTtcbiAgICAgIHZhciBpdGVtID0gY29sbGVjdGlvbltrZXldO1xuXG4gICAgICBpZiAoIXByZWRpY2F0ZShpdGVtKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgcmVzdWx0W2tleV0gPSBpdGVyYXRlZShpdGVtLCBrZXksIGNvbGxlY3Rpb24pO1xuICAgIH1cbiAgfSBjYXRjaCAoZV8xXzEpIHtcbiAgICBlXzEgPSB7XG4gICAgICBlcnJvcjogZV8xXzFcbiAgICB9O1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoX2MgJiYgIV9jLmRvbmUgJiYgKF9hID0gX2IucmV0dXJuKSkgX2EuY2FsbChfYik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuLyoqXHJcbiAqIFJldHJpZXZlcyBhIHZhbHVlIGF0IHRoZSBnaXZlbiBwYXRoLlxyXG4gKiBAcGFyYW0gcHJvcHMgVGhlIGRlZXAgcGF0aCB0byB0aGUgcHJvcCBvZiB0aGUgZGVzaXJlZCB2YWx1ZVxyXG4gKi9cblxudmFyIHBhdGggPSBmdW5jdGlvbiAocHJvcHMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICB2YXIgZV8yLCBfYTtcblxuICAgIHZhciByZXN1bHQgPSBvYmplY3Q7XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgcHJvcHNfMSA9IF9fdmFsdWVzKHByb3BzKSwgcHJvcHNfMV8xID0gcHJvcHNfMS5uZXh0KCk7ICFwcm9wc18xXzEuZG9uZTsgcHJvcHNfMV8xID0gcHJvcHNfMS5uZXh0KCkpIHtcbiAgICAgICAgdmFyIHByb3AgPSBwcm9wc18xXzEudmFsdWU7XG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdFtwcm9wXTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzJfMSkge1xuICAgICAgZV8yID0ge1xuICAgICAgICBlcnJvcjogZV8yXzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChwcm9wc18xXzEgJiYgIXByb3BzXzFfMS5kb25lICYmIChfYSA9IHByb3BzXzEucmV0dXJuKSkgX2EuY2FsbChwcm9wc18xKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzIpIHRocm93IGVfMi5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufTtcbi8qKlxyXG4gKiBSZXRyaWV2ZXMgYSB2YWx1ZSBhdCB0aGUgZ2l2ZW4gcGF0aCB2aWEgdGhlIG5lc3RlZCBhY2Nlc3NvciBwcm9wLlxyXG4gKiBAcGFyYW0gcHJvcHMgVGhlIGRlZXAgcGF0aCB0byB0aGUgcHJvcCBvZiB0aGUgZGVzaXJlZCB2YWx1ZVxyXG4gKi9cblxuZnVuY3Rpb24gbmVzdGVkUGF0aChwcm9wcywgYWNjZXNzb3JQcm9wKSB7XG4gIHJldHVybiBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgdmFyIGVfMywgX2E7XG5cbiAgICB2YXIgcmVzdWx0ID0gb2JqZWN0O1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIHByb3BzXzIgPSBfX3ZhbHVlcyhwcm9wcyksIHByb3BzXzJfMSA9IHByb3BzXzIubmV4dCgpOyAhcHJvcHNfMl8xLmRvbmU7IHByb3BzXzJfMSA9IHByb3BzXzIubmV4dCgpKSB7XG4gICAgICAgIHZhciBwcm9wID0gcHJvcHNfMl8xLnZhbHVlO1xuICAgICAgICByZXN1bHQgPSByZXN1bHRbYWNjZXNzb3JQcm9wXVtwcm9wXTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzNfMSkge1xuICAgICAgZV8zID0ge1xuICAgICAgICBlcnJvcjogZV8zXzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChwcm9wc18yXzEgJiYgIXByb3BzXzJfMS5kb25lICYmIChfYSA9IHByb3BzXzIucmV0dXJuKSkgX2EuY2FsbChwcm9wc18yKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzMpIHRocm93IGVfMy5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuZnVuY3Rpb24gdG9TdGF0ZVBhdGhzKHN0YXRlVmFsdWUpIHtcbiAgaWYgKCFzdGF0ZVZhbHVlKSB7XG4gICAgcmV0dXJuIFtbXV07XG4gIH1cblxuICBpZiAoaXNTdHJpbmcoc3RhdGVWYWx1ZSkpIHtcbiAgICByZXR1cm4gW1tzdGF0ZVZhbHVlXV07XG4gIH1cblxuICB2YXIgcmVzdWx0ID0gZmxhdHRlbihPYmplY3Qua2V5cyhzdGF0ZVZhbHVlKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciBzdWJTdGF0ZVZhbHVlID0gc3RhdGVWYWx1ZVtrZXldO1xuXG4gICAgaWYgKHR5cGVvZiBzdWJTdGF0ZVZhbHVlICE9PSAnc3RyaW5nJyAmJiAoIXN1YlN0YXRlVmFsdWUgfHwgIU9iamVjdC5rZXlzKHN1YlN0YXRlVmFsdWUpLmxlbmd0aCkpIHtcbiAgICAgIHJldHVybiBbW2tleV1dO1xuICAgIH1cblxuICAgIHJldHVybiB0b1N0YXRlUGF0aHMoc3RhdGVWYWx1ZVtrZXldKS5tYXAoZnVuY3Rpb24gKHN1YlBhdGgpIHtcbiAgICAgIHJldHVybiBba2V5XS5jb25jYXQoc3ViUGF0aCk7XG4gICAgfSk7XG4gIH0pKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIHBhdGhzVG9TdGF0ZVZhbHVlKHBhdGhzKSB7XG4gIHZhciBlXzQsIF9hO1xuXG4gIHZhciByZXN1bHQgPSB7fTtcblxuICBpZiAocGF0aHMgJiYgcGF0aHMubGVuZ3RoID09PSAxICYmIHBhdGhzWzBdLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBwYXRoc1swXVswXTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgcGF0aHNfMSA9IF9fdmFsdWVzKHBhdGhzKSwgcGF0aHNfMV8xID0gcGF0aHNfMS5uZXh0KCk7ICFwYXRoc18xXzEuZG9uZTsgcGF0aHNfMV8xID0gcGF0aHNfMS5uZXh0KCkpIHtcbiAgICAgIHZhciBjdXJyZW50UGF0aCA9IHBhdGhzXzFfMS52YWx1ZTtcbiAgICAgIHZhciBtYXJrZXIgPSByZXN1bHQ7IC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpwcmVmZXItZm9yLW9mXG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3VycmVudFBhdGgubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHN1YlBhdGggPSBjdXJyZW50UGF0aFtpXTtcblxuICAgICAgICBpZiAoaSA9PT0gY3VycmVudFBhdGgubGVuZ3RoIC0gMikge1xuICAgICAgICAgIG1hcmtlcltzdWJQYXRoXSA9IGN1cnJlbnRQYXRoW2kgKyAxXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIG1hcmtlcltzdWJQYXRoXSA9IG1hcmtlcltzdWJQYXRoXSB8fCB7fTtcbiAgICAgICAgbWFya2VyID0gbWFya2VyW3N1YlBhdGhdO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZV80XzEpIHtcbiAgICBlXzQgPSB7XG4gICAgICBlcnJvcjogZV80XzFcbiAgICB9O1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAocGF0aHNfMV8xICYmICFwYXRoc18xXzEuZG9uZSAmJiAoX2EgPSBwYXRoc18xLnJldHVybikpIF9hLmNhbGwocGF0aHNfMSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChlXzQpIHRocm93IGVfNC5lcnJvcjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gZmxhdHRlbihhcnJheSkge1xuICB2YXIgX2E7XG5cbiAgcmV0dXJuIChfYSA9IFtdKS5jb25jYXQuYXBwbHkoX2EsIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChhcnJheSksIGZhbHNlKSk7XG59XG5mdW5jdGlvbiB0b0FycmF5U3RyaWN0KHZhbHVlKSB7XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiBbdmFsdWVdO1xufVxuZnVuY3Rpb24gdG9BcnJheSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHJldHVybiB0b0FycmF5U3RyaWN0KHZhbHVlKTtcbn1cbmZ1bmN0aW9uIG1hcENvbnRleHQobWFwcGVyLCBjb250ZXh0LCBfZXZlbnQpIHtcbiAgdmFyIGVfNSwgX2E7XG5cbiAgaWYgKGlzRnVuY3Rpb24obWFwcGVyKSkge1xuICAgIHJldHVybiBtYXBwZXIoY29udGV4dCwgX2V2ZW50LmRhdGEpO1xuICB9XG5cbiAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgX2IgPSBfX3ZhbHVlcyhPYmplY3Qua2V5cyhtYXBwZXIpKSwgX2MgPSBfYi5uZXh0KCk7ICFfYy5kb25lOyBfYyA9IF9iLm5leHQoKSkge1xuICAgICAgdmFyIGtleSA9IF9jLnZhbHVlO1xuICAgICAgdmFyIHN1Yk1hcHBlciA9IG1hcHBlcltrZXldO1xuXG4gICAgICBpZiAoaXNGdW5jdGlvbihzdWJNYXBwZXIpKSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gc3ViTWFwcGVyKGNvbnRleHQsIF9ldmVudC5kYXRhKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gc3ViTWFwcGVyO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZV81XzEpIHtcbiAgICBlXzUgPSB7XG4gICAgICBlcnJvcjogZV81XzFcbiAgICB9O1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoX2MgJiYgIV9jLmRvbmUgJiYgKF9hID0gX2IucmV0dXJuKSkgX2EuY2FsbChfYik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChlXzUpIHRocm93IGVfNS5lcnJvcjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gaXNCdWlsdEluRXZlbnQoZXZlbnRUeXBlKSB7XG4gIHJldHVybiAvXihkb25lfGVycm9yKVxcLi8udGVzdChldmVudFR5cGUpO1xufVxuZnVuY3Rpb24gaXNQcm9taXNlTGlrZSh2YWx1ZSkge1xuICBpZiAodmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gLy8gQ2hlY2sgaWYgc2hhcGUgbWF0Y2hlcyB0aGUgUHJvbWlzZS9BKyBzcGVjaWZpY2F0aW9uIGZvciBhIFwidGhlbmFibGVcIi5cblxuXG4gIGlmICh2YWx1ZSAhPT0gbnVsbCAmJiAoaXNGdW5jdGlvbih2YWx1ZSkgfHwgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JykgJiYgaXNGdW5jdGlvbih2YWx1ZS50aGVuKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gaXNCZWhhdmlvcih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT09IG51bGwgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiAndHJhbnNpdGlvbicgaW4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlLnRyYW5zaXRpb24gPT09ICdmdW5jdGlvbic7XG59XG5mdW5jdGlvbiBwYXJ0aXRpb24oaXRlbXMsIHByZWRpY2F0ZSkge1xuICB2YXIgZV82LCBfYTtcblxuICB2YXIgX2IgPSBfX3JlYWQoW1tdLCBbXV0sIDIpLFxuICAgICAgdHJ1dGh5ID0gX2JbMF0sXG4gICAgICBmYWxzeSA9IF9iWzFdO1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgaXRlbXNfMSA9IF9fdmFsdWVzKGl0ZW1zKSwgaXRlbXNfMV8xID0gaXRlbXNfMS5uZXh0KCk7ICFpdGVtc18xXzEuZG9uZTsgaXRlbXNfMV8xID0gaXRlbXNfMS5uZXh0KCkpIHtcbiAgICAgIHZhciBpdGVtID0gaXRlbXNfMV8xLnZhbHVlO1xuXG4gICAgICBpZiAocHJlZGljYXRlKGl0ZW0pKSB7XG4gICAgICAgIHRydXRoeS5wdXNoKGl0ZW0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmFsc3kucHVzaChpdGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVfNl8xKSB7XG4gICAgZV82ID0ge1xuICAgICAgZXJyb3I6IGVfNl8xXG4gICAgfTtcbiAgfSBmaW5hbGx5IHtcbiAgICB0cnkge1xuICAgICAgaWYgKGl0ZW1zXzFfMSAmJiAhaXRlbXNfMV8xLmRvbmUgJiYgKF9hID0gaXRlbXNfMS5yZXR1cm4pKSBfYS5jYWxsKGl0ZW1zXzEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAoZV82KSB0aHJvdyBlXzYuZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIFt0cnV0aHksIGZhbHN5XTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZUhpc3RvcnlTdGF0ZXMoaGlzdCwgc3RhdGVWYWx1ZSkge1xuICByZXR1cm4gbWFwVmFsdWVzKGhpc3Quc3RhdGVzLCBmdW5jdGlvbiAoc3ViSGlzdCwga2V5KSB7XG4gICAgaWYgKCFzdWJIaXN0KSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHZhciBzdWJTdGF0ZVZhbHVlID0gKGlzU3RyaW5nKHN0YXRlVmFsdWUpID8gdW5kZWZpbmVkIDogc3RhdGVWYWx1ZVtrZXldKSB8fCAoc3ViSGlzdCA/IHN1Ykhpc3QuY3VycmVudCA6IHVuZGVmaW5lZCk7XG5cbiAgICBpZiAoIXN1YlN0YXRlVmFsdWUpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGN1cnJlbnQ6IHN1YlN0YXRlVmFsdWUsXG4gICAgICBzdGF0ZXM6IHVwZGF0ZUhpc3RvcnlTdGF0ZXMoc3ViSGlzdCwgc3ViU3RhdGVWYWx1ZSlcbiAgICB9O1xuICB9KTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZUhpc3RvcnlWYWx1ZShoaXN0LCBzdGF0ZVZhbHVlKSB7XG4gIHJldHVybiB7XG4gICAgY3VycmVudDogc3RhdGVWYWx1ZSxcbiAgICBzdGF0ZXM6IHVwZGF0ZUhpc3RvcnlTdGF0ZXMoaGlzdCwgc3RhdGVWYWx1ZSlcbiAgfTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZUNvbnRleHQoY29udGV4dCwgX2V2ZW50LCBhc3NpZ25BY3Rpb25zLCBzdGF0ZSkge1xuICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICB3YXJuKCEhY29udGV4dCwgJ0F0dGVtcHRpbmcgdG8gdXBkYXRlIHVuZGVmaW5lZCBjb250ZXh0Jyk7XG4gIH1cblxuICB2YXIgdXBkYXRlZENvbnRleHQgPSBjb250ZXh0ID8gYXNzaWduQWN0aW9ucy5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgYXNzaWduQWN0aW9uKSB7XG4gICAgdmFyIGVfNywgX2E7XG5cbiAgICB2YXIgYXNzaWdubWVudCA9IGFzc2lnbkFjdGlvbi5hc3NpZ25tZW50O1xuICAgIHZhciBtZXRhID0ge1xuICAgICAgc3RhdGU6IHN0YXRlLFxuICAgICAgYWN0aW9uOiBhc3NpZ25BY3Rpb24sXG4gICAgICBfZXZlbnQ6IF9ldmVudFxuICAgIH07XG4gICAgdmFyIHBhcnRpYWxVcGRhdGUgPSB7fTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGFzc2lnbm1lbnQpKSB7XG4gICAgICBwYXJ0aWFsVXBkYXRlID0gYXNzaWdubWVudChhY2MsIF9ldmVudC5kYXRhLCBtZXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yICh2YXIgX2IgPSBfX3ZhbHVlcyhPYmplY3Qua2V5cyhhc3NpZ25tZW50KSksIF9jID0gX2IubmV4dCgpOyAhX2MuZG9uZTsgX2MgPSBfYi5uZXh0KCkpIHtcbiAgICAgICAgICB2YXIga2V5ID0gX2MudmFsdWU7XG4gICAgICAgICAgdmFyIHByb3BBc3NpZ25tZW50ID0gYXNzaWdubWVudFtrZXldO1xuICAgICAgICAgIHBhcnRpYWxVcGRhdGVba2V5XSA9IGlzRnVuY3Rpb24ocHJvcEFzc2lnbm1lbnQpID8gcHJvcEFzc2lnbm1lbnQoYWNjLCBfZXZlbnQuZGF0YSwgbWV0YSkgOiBwcm9wQXNzaWdubWVudDtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZV83XzEpIHtcbiAgICAgICAgZV83ID0ge1xuICAgICAgICAgIGVycm9yOiBlXzdfMVxuICAgICAgICB9O1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoX2MgJiYgIV9jLmRvbmUgJiYgKF9hID0gX2IucmV0dXJuKSkgX2EuY2FsbChfYik7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgaWYgKGVfNykgdGhyb3cgZV83LmVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGFjYywgcGFydGlhbFVwZGF0ZSk7XG4gIH0sIGNvbnRleHQpIDogY29udGV4dDtcbiAgcmV0dXJuIHVwZGF0ZWRDb250ZXh0O1xufSAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tZW1wdHlcblxudmFyIHdhcm4gPSBmdW5jdGlvbiAoKSB7fTtcblxuaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gIHdhcm4gPSBmdW5jdGlvbiAoY29uZGl0aW9uLCBtZXNzYWdlKSB7XG4gICAgdmFyIGVycm9yID0gY29uZGl0aW9uIGluc3RhbmNlb2YgRXJyb3IgPyBjb25kaXRpb24gOiB1bmRlZmluZWQ7XG5cbiAgICBpZiAoIWVycm9yICYmIGNvbmRpdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChjb25zb2xlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBhcmdzID0gW1wiV2FybmluZzogXCIuY29uY2F0KG1lc3NhZ2UpXTtcblxuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGFyZ3MucHVzaChlcnJvcik7XG4gICAgICB9IC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1jb25zb2xlXG5cblxuICAgICAgY29uc29sZS53YXJuLmFwcGx5KGNvbnNvbGUsIGFyZ3MpO1xuICAgIH1cbiAgfTtcbn1cbmZ1bmN0aW9uIGlzQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpO1xufSAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6YmFuLXR5cGVzXG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbn1cbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnO1xufVxuZnVuY3Rpb24gdG9HdWFyZChjb25kaXRpb24sIGd1YXJkTWFwKSB7XG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlmIChpc1N0cmluZyhjb25kaXRpb24pKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IERFRkFVTFRfR1VBUkRfVFlQRSxcbiAgICAgIG5hbWU6IGNvbmRpdGlvbixcbiAgICAgIHByZWRpY2F0ZTogZ3VhcmRNYXAgPyBndWFyZE1hcFtjb25kaXRpb25dIDogdW5kZWZpbmVkXG4gICAgfTtcbiAgfVxuXG4gIGlmIChpc0Z1bmN0aW9uKGNvbmRpdGlvbikpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogREVGQVVMVF9HVUFSRF9UWVBFLFxuICAgICAgbmFtZTogY29uZGl0aW9uLm5hbWUsXG4gICAgICBwcmVkaWNhdGU6IGNvbmRpdGlvblxuICAgIH07XG4gIH1cblxuICByZXR1cm4gY29uZGl0aW9uO1xufVxuZnVuY3Rpb24gaXNPYnNlcnZhYmxlKHZhbHVlKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuICdzdWJzY3JpYmUnIGluIHZhbHVlICYmIGlzRnVuY3Rpb24odmFsdWUuc3Vic2NyaWJlKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxudmFyIHN5bWJvbE9ic2VydmFibGUgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wub2JzZXJ2YWJsZSB8fCAnQEBvYnNlcnZhYmxlJztcbn0oKTsgLy8gVE9ETzogdG8gYmUgcmVtb3ZlZCBpbiB2NSwgbGVmdCBpdCBvdXQganVzdCB0byBtaW5pbWl6ZSB0aGUgc2NvcGUgb2YgdGhlIGNoYW5nZSBhbmQgbWFpbnRhaW4gY29tcGF0aWJpbGl0eSB3aXRoIG9sZGVyIHZlcnNpb25zIG9mIGludGVncmF0aW9uIHBhYWNrYWdlc1xuXG52YXIgaW50ZXJvcFN5bWJvbHMgPSAoX2EgPSB7fSwgX2Fbc3ltYm9sT2JzZXJ2YWJsZV0gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzO1xufSwgX2FbU3ltYm9sLm9ic2VydmFibGVdID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcztcbn0sIF9hKTtcbmZ1bmN0aW9uIGlzTWFjaGluZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiAnX194c3RhdGVub2RlJyBpbiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIGlzQWN0b3IodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlLnNlbmQgPT09ICdmdW5jdGlvbic7XG59XG52YXIgdW5pcXVlSWQgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICB2YXIgY3VycmVudElkID0gMDtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBjdXJyZW50SWQrKztcbiAgICByZXR1cm4gY3VycmVudElkLnRvU3RyaW5nKDE2KTtcbiAgfTtcbn0oKTtcbmZ1bmN0aW9uIHRvRXZlbnRPYmplY3QoZXZlbnQsIHBheWxvYWQgLy8gaWQ/OiBURXZlbnRbJ3R5cGUnXVxuKSB7XG4gIGlmIChpc1N0cmluZyhldmVudCkgfHwgdHlwZW9mIGV2ZW50ID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiBfX2Fzc2lnbih7XG4gICAgICB0eXBlOiBldmVudFxuICAgIH0sIHBheWxvYWQpO1xuICB9XG5cbiAgcmV0dXJuIGV2ZW50O1xufVxuZnVuY3Rpb24gdG9TQ1hNTEV2ZW50KGV2ZW50LCBzY3htbEV2ZW50KSB7XG4gIGlmICghaXNTdHJpbmcoZXZlbnQpICYmICckJHR5cGUnIGluIGV2ZW50ICYmIGV2ZW50LiQkdHlwZSA9PT0gJ3NjeG1sJykge1xuICAgIHJldHVybiBldmVudDtcbiAgfVxuXG4gIHZhciBldmVudE9iamVjdCA9IHRvRXZlbnRPYmplY3QoZXZlbnQpO1xuICByZXR1cm4gX19hc3NpZ24oe1xuICAgIG5hbWU6IGV2ZW50T2JqZWN0LnR5cGUsXG4gICAgZGF0YTogZXZlbnRPYmplY3QsXG4gICAgJCR0eXBlOiAnc2N4bWwnLFxuICAgIHR5cGU6ICdleHRlcm5hbCdcbiAgfSwgc2N4bWxFdmVudCk7XG59XG5mdW5jdGlvbiB0b1RyYW5zaXRpb25Db25maWdBcnJheShldmVudCwgY29uZmlnTGlrZSkge1xuICB2YXIgdHJhbnNpdGlvbnMgPSB0b0FycmF5U3RyaWN0KGNvbmZpZ0xpa2UpLm1hcChmdW5jdGlvbiAodHJhbnNpdGlvbkxpa2UpIHtcbiAgICBpZiAodHlwZW9mIHRyYW5zaXRpb25MaWtlID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgdHJhbnNpdGlvbkxpa2UgPT09ICdzdHJpbmcnIHx8IGlzTWFjaGluZSh0cmFuc2l0aW9uTGlrZSkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRhcmdldDogdHJhbnNpdGlvbkxpa2UsXG4gICAgICAgIGV2ZW50OiBldmVudFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIHRyYW5zaXRpb25MaWtlKSwge1xuICAgICAgZXZlbnQ6IGV2ZW50XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gdHJhbnNpdGlvbnM7XG59XG5mdW5jdGlvbiBub3JtYWxpemVUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0YXJnZXQgPT09IHVuZGVmaW5lZCB8fCB0YXJnZXQgPT09IFRBUkdFVExFU1NfS0VZKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiB0b0FycmF5KHRhcmdldCk7XG59XG5mdW5jdGlvbiByZXBvcnRVbmhhbmRsZWRFeGNlcHRpb25Pbkludm9jYXRpb24ob3JpZ2luYWxFcnJvciwgY3VycmVudEVycm9yLCBpZCkge1xuICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICB2YXIgb3JpZ2luYWxTdGFja1RyYWNlID0gb3JpZ2luYWxFcnJvci5zdGFjayA/IFwiIFN0YWNrdHJhY2Ugd2FzICdcIi5jb25jYXQob3JpZ2luYWxFcnJvci5zdGFjaywgXCInXCIpIDogJyc7XG5cbiAgICBpZiAob3JpZ2luYWxFcnJvciA9PT0gY3VycmVudEVycm9yKSB7XG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tY29uc29sZVxuICAgICAgY29uc29sZS5lcnJvcihcIk1pc3Npbmcgb25FcnJvciBoYW5kbGVyIGZvciBpbnZvY2F0aW9uICdcIi5jb25jYXQoaWQsIFwiJywgZXJyb3Igd2FzICdcIikuY29uY2F0KG9yaWdpbmFsRXJyb3IsIFwiJy5cIikuY29uY2F0KG9yaWdpbmFsU3RhY2tUcmFjZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgc3RhY2tUcmFjZSA9IGN1cnJlbnRFcnJvci5zdGFjayA/IFwiIFN0YWNrdHJhY2Ugd2FzICdcIi5jb25jYXQoY3VycmVudEVycm9yLnN0YWNrLCBcIidcIikgOiAnJzsgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbnNvbGVcblxuICAgICAgY29uc29sZS5lcnJvcihcIk1pc3Npbmcgb25FcnJvciBoYW5kbGVyIGFuZC9vciB1bmhhbmRsZWQgZXhjZXB0aW9uL3Byb21pc2UgcmVqZWN0aW9uIGZvciBpbnZvY2F0aW9uICdcIi5jb25jYXQoaWQsIFwiJy4gXCIpICsgXCJPcmlnaW5hbCBlcnJvcjogJ1wiLmNvbmNhdChvcmlnaW5hbEVycm9yLCBcIicuIFwiKS5jb25jYXQob3JpZ2luYWxTdGFja1RyYWNlLCBcIiBDdXJyZW50IGVycm9yIGlzICdcIikuY29uY2F0KGN1cnJlbnRFcnJvciwgXCInLlwiKS5jb25jYXQoc3RhY2tUcmFjZSkpO1xuICAgIH1cbiAgfVxufVxuZnVuY3Rpb24gZXZhbHVhdGVHdWFyZChtYWNoaW5lLCBndWFyZCwgY29udGV4dCwgX2V2ZW50LCBzdGF0ZSkge1xuICB2YXIgZ3VhcmRzID0gbWFjaGluZS5vcHRpb25zLmd1YXJkcztcbiAgdmFyIGd1YXJkTWV0YSA9IHtcbiAgICBzdGF0ZTogc3RhdGUsXG4gICAgY29uZDogZ3VhcmQsXG4gICAgX2V2ZW50OiBfZXZlbnRcbiAgfTsgLy8gVE9ETzogZG8gbm90IGhhcmRjb2RlIVxuXG4gIGlmIChndWFyZC50eXBlID09PSBERUZBVUxUX0dVQVJEX1RZUEUpIHtcbiAgICByZXR1cm4gKChndWFyZHMgPT09IG51bGwgfHwgZ3VhcmRzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBndWFyZHNbZ3VhcmQubmFtZV0pIHx8IGd1YXJkLnByZWRpY2F0ZSkoY29udGV4dCwgX2V2ZW50LmRhdGEsIGd1YXJkTWV0YSk7XG4gIH1cblxuICB2YXIgY29uZEZuID0gZ3VhcmRzID09PSBudWxsIHx8IGd1YXJkcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogZ3VhcmRzW2d1YXJkLnR5cGVdO1xuXG4gIGlmICghY29uZEZuKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiR3VhcmQgJ1wiLmNvbmNhdChndWFyZC50eXBlLCBcIicgaXMgbm90IGltcGxlbWVudGVkIG9uIG1hY2hpbmUgJ1wiKS5jb25jYXQobWFjaGluZS5pZCwgXCInLlwiKSk7XG4gIH1cblxuICByZXR1cm4gY29uZEZuKGNvbnRleHQsIF9ldmVudC5kYXRhLCBndWFyZE1ldGEpO1xufVxuZnVuY3Rpb24gdG9JbnZva2VTb3VyY2Uoc3JjKSB7XG4gIGlmICh0eXBlb2Ygc3JjID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiBzcmNcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHNyYztcbn1cbmZ1bmN0aW9uIHRvT2JzZXJ2ZXIobmV4dEhhbmRsZXIsIGVycm9ySGFuZGxlciwgY29tcGxldGlvbkhhbmRsZXIpIHtcbiAgdmFyIG5vb3AgPSBmdW5jdGlvbiAoKSB7fTtcblxuICB2YXIgaXNPYnNlcnZlciA9IHR5cGVvZiBuZXh0SGFuZGxlciA9PT0gJ29iamVjdCc7XG4gIHZhciBzZWxmID0gaXNPYnNlcnZlciA/IG5leHRIYW5kbGVyIDogbnVsbDtcbiAgcmV0dXJuIHtcbiAgICBuZXh0OiAoKGlzT2JzZXJ2ZXIgPyBuZXh0SGFuZGxlci5uZXh0IDogbmV4dEhhbmRsZXIpIHx8IG5vb3ApLmJpbmQoc2VsZiksXG4gICAgZXJyb3I6ICgoaXNPYnNlcnZlciA/IG5leHRIYW5kbGVyLmVycm9yIDogZXJyb3JIYW5kbGVyKSB8fCBub29wKS5iaW5kKHNlbGYpLFxuICAgIGNvbXBsZXRlOiAoKGlzT2JzZXJ2ZXIgPyBuZXh0SGFuZGxlci5jb21wbGV0ZSA6IGNvbXBsZXRpb25IYW5kbGVyKSB8fCBub29wKS5iaW5kKHNlbGYpXG4gIH07XG59XG5mdW5jdGlvbiBjcmVhdGVJbnZva2VJZChzdGF0ZU5vZGVJZCwgaW5kZXgpIHtcbiAgcmV0dXJuIFwiXCIuY29uY2F0KHN0YXRlTm9kZUlkLCBcIjppbnZvY2F0aW9uW1wiKS5jb25jYXQoaW5kZXgsIFwiXVwiKTtcbn1cbmZ1bmN0aW9uIGlzUmFpc2FibGVBY3Rpb24oYWN0aW9uKSB7XG4gIHJldHVybiAoYWN0aW9uLnR5cGUgPT09IHJhaXNlIHx8IGFjdGlvbi50eXBlID09PSBzZW5kICYmIGFjdGlvbi50byA9PT0gU3BlY2lhbFRhcmdldHMuSW50ZXJuYWwpICYmIHR5cGVvZiBhY3Rpb24uZGVsYXkgIT09ICdudW1iZXInO1xufVxuXG5leHBvcnQgeyBjcmVhdGVJbnZva2VJZCwgZXZhbHVhdGVHdWFyZCwgZmxhdHRlbiwgZ2V0QWN0aW9uVHlwZSwgZ2V0RXZlbnRUeXBlLCBpbnRlcm9wU3ltYm9scywgaXNBY3RvciwgaXNBcnJheSwgaXNCZWhhdmlvciwgaXNCdWlsdEluRXZlbnQsIGlzRnVuY3Rpb24sIGlzTWFjaGluZSwgaXNPYnNlcnZhYmxlLCBpc1Byb21pc2VMaWtlLCBpc1JhaXNhYmxlQWN0aW9uLCBpc1N0YXRlTGlrZSwgaXNTdHJpbmcsIGtleXMsIG1hcENvbnRleHQsIG1hcEZpbHRlclZhbHVlcywgbWFwVmFsdWVzLCBtYXRjaGVzU3RhdGUsIG5lc3RlZFBhdGgsIG5vcm1hbGl6ZVRhcmdldCwgcGFydGl0aW9uLCBwYXRoLCBwYXRoVG9TdGF0ZVZhbHVlLCBwYXRoc1RvU3RhdGVWYWx1ZSwgcmVwb3J0VW5oYW5kbGVkRXhjZXB0aW9uT25JbnZvY2F0aW9uLCBzeW1ib2xPYnNlcnZhYmxlLCB0b0FycmF5LCB0b0FycmF5U3RyaWN0LCB0b0V2ZW50T2JqZWN0LCB0b0d1YXJkLCB0b0ludm9rZVNvdXJjZSwgdG9PYnNlcnZlciwgdG9TQ1hNTEV2ZW50LCB0b1N0YXRlUGF0aCwgdG9TdGF0ZVBhdGhzLCB0b1N0YXRlVmFsdWUsIHRvVHJhbnNpdGlvbkNvbmZpZ0FycmF5LCB1bmlxdWVJZCwgdXBkYXRlQ29udGV4dCwgdXBkYXRlSGlzdG9yeVN0YXRlcywgdXBkYXRlSGlzdG9yeVZhbHVlLCB3YXJuIH07XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBBbmltYXRpb25Nb2R1bGUge1xuICBzdGF0aWMgcmVjdGFuZ2xlc1NlbGVjdG9yID1cbiAgICBcIi5vdXRlcm1vc3QsIC5zZWNvbmQsIC50aGlyZCwgLmZvdXJ0aCwgLmZpZnRoLCAuaW5uZXJtb3N0XCI7XG4gIHN0YXRpYyB0YWxrQnV0dG9uQW5pbWF0aW9ucyA9IFtcInBpU3BlYWtpbmdcIiwgXCJ1c2VyU3BlYWtpbmdcIiwgXCJ0cmFuc2NyaWJpbmdcIl07XG5cbiAgc3RhdGljIHN0YXJ0QW5pbWF0aW9uKGFuaW1hdGlvbikge1xuICAgIHRoaXMuc3RvcE90aGVyQW5pbWF0aW9ucyhhbmltYXRpb24pO1xuXG4gICAgbGV0IHJlY3RhbmdsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMucmVjdGFuZ2xlc1NlbGVjdG9yKTtcbiAgICByZWN0YW5nbGVzLmZvckVhY2goKHJlY3QpID0+IHJlY3QuY2xhc3NMaXN0LmFkZChhbmltYXRpb24pKTtcbiAgfVxuXG4gIHN0YXRpYyBzdG9wQW5pbWF0aW9uKGFuaW1hdGlvbikge1xuICAgIGxldCByZWN0YW5nbGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLnJlY3RhbmdsZXNTZWxlY3Rvcik7XG4gICAgcmVjdGFuZ2xlcy5mb3JFYWNoKChyZWN0KSA9PiByZWN0LmNsYXNzTGlzdC5yZW1vdmUoYW5pbWF0aW9uKSk7XG4gIH1cblxuICBzdGF0aWMgc3RvcEFsbEFuaW1hdGlvbnMoKSB7XG4gICAgdGhpcy50YWxrQnV0dG9uQW5pbWF0aW9ucy5mb3JFYWNoKChhbmltYXRpb24pID0+XG4gICAgICB0aGlzLnN0b3BBbmltYXRpb24oYW5pbWF0aW9uKVxuICAgICk7XG4gIH1cblxuICBzdGF0aWMgc3RvcE90aGVyQW5pbWF0aW9ucyhrZWVwQW5pbWF0aW9uKSB7XG4gICAgdGhpcy50YWxrQnV0dG9uQW5pbWF0aW9ucy5mb3JFYWNoKChhbmltYXRpb24pID0+IHtcbiAgICAgIGlmIChhbmltYXRpb24gIT09IGtlZXBBbmltYXRpb24pIHtcbiAgICAgICAgdGhpcy5zdG9wQW5pbWF0aW9uKGFuaW1hdGlvbik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7XG4gIGVudGVyTW9iaWxlTW9kZSxcbiAgZXhpdE1vYmlsZU1vZGUsXG4gIGlzTW9iaWxlVmlldyxcbn0gZnJvbSBcIi4vVXNlckFnZW50TW9kdWxlLmpzXCI7XG5pbXBvcnQgeyBhcHBlbmRDaGlsZCB9IGZyb20gXCIuL0RPTU1vZHVsZS50c1wiO1xuaW1wb3J0IEV2ZW50QnVzIGZyb20gXCIuL0V2ZW50QnVzLmpzXCI7XG5pbXBvcnQgU3RhdGVNYWNoaW5lU2VydmljZSBmcm9tIFwiLi9TdGF0ZU1hY2hpbmVTZXJ2aWNlLmpzXCI7XG5pbXBvcnQgeyBzdWJtaXRFcnJvckhhbmRsZXIgfSBmcm9tIFwiLi9TdWJtaXRFcnJvckhhbmRsZXIudHNcIjtcbmltcG9ydCBleGl0SWNvblNWRyBmcm9tIFwiLi9pY29ucy9leGl0LnN2Z1wiO1xuaW1wb3J0IG1heGltaXplSWNvblNWRyBmcm9tIFwiLi9pY29ucy9tYXhpbWl6ZS5zdmdcIjtcbmltcG9ydCByZWN0YW5nbGVzU1ZHIGZyb20gXCIuL2ljb25zL3JlY3RhbmdsZXMuc3ZnXCI7XG5pbXBvcnQgdGFsa0ljb25TVkcgZnJvbSBcIi4vaWNvbnMvd2F2ZWZvcm0uc3ZnXCI7XG5pbXBvcnQgbXV0ZWRNaWNJY29uU1ZHIGZyb20gXCIuL2ljb25zL211dGVkX21pY3JvcGhvbmUuc3ZnXCI7XG5pbXBvcnQgY2FsbEljb25TVkcgZnJvbSBcIi4vaWNvbnMvY2FsbC5zdmdcIjtcbmltcG9ydCBoYW5ndXBJY29uU1ZHIGZyb20gXCIuL2ljb25zL2hhbmd1cC5zdmdcIjtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1dHRvbk1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYWN0b3IgPSBTdGF0ZU1hY2hpbmVTZXJ2aWNlLmFjdG9yO1xuICAgIC8vIEJpbmRpbmcgbWV0aG9kcyB0byB0aGUgY3VycmVudCBpbnN0YW5jZVxuICAgIHRoaXMucmVnaXN0ZXJPdGhlckV2ZW50cygpO1xuXG4gICAgLy8gdHJhY2sgdGhlIGZyZXF1ZW5jeSBvZiBidWcgIzI2XG4gICAgdGhpcy5zdWJtaXNzaW9uc1dpdGhvdXRBbkVycm9yID0gMDtcbiAgfVxuXG4gIHJlZ2lzdGVyT3RoZXJFdmVudHMoKSB7XG4gICAgRXZlbnRCdXMub24oXCJzYXlwaTphdXRvU3VibWl0XCIsICgpID0+IHtcbiAgICAgIHRoaXMuaGFuZGxlQXV0b1N1Ym1pdCgpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gRnVuY3Rpb24gdG8gY3JlYXRlIGEgbmV3IGJ1dHRvblxuICBjcmVhdGVCdXR0b24obGFiZWwsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICBpZiAobGFiZWwpIHtcbiAgICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9IGxhYmVsO1xuICAgIH1cbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGJ1dHRvbi5vbmNsaWNrID0gY2FsbGJhY2s7XG4gICAgfVxuICAgIHJldHVybiBidXR0b247XG4gIH1cblxuICAvLyBGdW5jdGlvbiB0byBzdHlsZSBhIGdpdmVuIGJ1dHRvblxuICBzdHlsZUJ1dHRvbihidXR0b24sIHN0eWxlcykge1xuICAgIGZvciAobGV0IGtleSBpbiBzdHlsZXMpIHtcbiAgICAgIGlmIChzdHlsZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBidXR0b24uc3R5bGVba2V5XSA9IHN0eWxlc1trZXldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFkZFRhbGtJY29uKGJ1dHRvbikge1xuICAgIHRoaXMudXBkYXRlSWNvbkNvbnRlbnQoYnV0dG9uKTtcblxuICAgIHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1heC13aWR0aDogNzY4cHgpXCIpLmFkZExpc3RlbmVyKCgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlSWNvbkNvbnRlbnQoYnV0dG9uKTtcbiAgICB9KTtcbiAgICB0aGlzLnNldHVwQ2xhc3NPYnNlcnZlcihidXR0b24pO1xuICB9XG5cbiAgdXBkYXRlSWNvbkNvbnRlbnQoaWNvbkNvbnRhaW5lcikge1xuICAgIGlmIChpc01vYmlsZVZpZXcoKSkge1xuICAgICAgaWNvbkNvbnRhaW5lci5pbm5lckhUTUwgPSByZWN0YW5nbGVzU1ZHO1xuICAgIH0gZWxzZSB7XG4gICAgICBpY29uQ29udGFpbmVyLmlubmVySFRNTCA9IHRhbGtJY29uU1ZHO1xuICAgIH1cbiAgfVxuXG4gIHNldHVwQ2xhc3NPYnNlcnZlcihidXR0b24pIHtcbiAgICBjb25zdCB0YXJnZXROb2RlID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50OyAvLyBUaGUgPGh0bWw+IGVsZW1lbnRcblxuICAgIGNvbnN0IGNvbmZpZyA9IHsgYXR0cmlidXRlczogdHJ1ZSwgYXR0cmlidXRlRmlsdGVyOiBbXCJjbGFzc1wiXSB9O1xuXG4gICAgY29uc3QgY2FsbGJhY2sgPSAobXV0YXRpb25zTGlzdCwgb2JzZXJ2ZXIpID0+IHtcbiAgICAgIGZvciAobGV0IG11dGF0aW9uIG9mIG11dGF0aW9uc0xpc3QpIHtcbiAgICAgICAgaWYgKG11dGF0aW9uLnR5cGUgPT09IFwiYXR0cmlidXRlc1wiKSB7XG4gICAgICAgICAgaWYgKG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUgPT09IFwiY2xhc3NcIikge1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJtb2JpbGUtdmlld1wiKSkge1xuICAgICAgICAgICAgICAvLyAnbW9iaWxlLXZpZXcnIGNsYXNzIHdhcyBhZGRlZFxuICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUljb25Db250ZW50KGJ1dHRvbik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyAnbW9iaWxlLXZpZXcnIGNsYXNzIHdhcyByZW1vdmVkXG4gICAgICAgICAgICAgIHRoaXMudXBkYXRlSWNvbkNvbnRlbnQoYnV0dG9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihjYWxsYmFjayk7XG5cbiAgICAvLyBTdGFydCBvYnNlcnZpbmcgdGhlIHRhcmdldCBub2RlIGZvciBjb25maWd1cmVkIG11dGF0aW9uc1xuICAgIG9ic2VydmVyLm9ic2VydmUodGFyZ2V0Tm9kZSwgY29uZmlnKTtcblxuICAgIC8vIExhdGVyLCB5b3UgY2FuIHN0b3Agb2JzZXJ2aW5nIGJ5IGNhbGxpbmc6XG4gICAgLy8gb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICB9XG5cbiAgLy8gU2ltdWxhdGUgYW4gXCJFbnRlclwiIGtleXByZXNzIGV2ZW50IG9uIGEgZm9ybVxuICBzaW11bGF0ZUZvcm1TdWJtaXQoKSB7XG4gICAgY29uc3Qgc3VibWl0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS1zdWJtaXRCdXR0b25cIik7XG5cbiAgICBpZiAoc3VibWl0QnV0dG9uKSB7XG4gICAgICBpZiAoc3VibWl0RXJyb3JIYW5kbGVyLmRldGVjdFN1Ym1pdEVycm9yKCkpIHtcbiAgICAgICAgLy8gdHJhY2sgaG93IG9mdGVuIHRoaXMgaGFwcGVuc1xuICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgIGBBdXRvc3VibWl0IGZhaWxlZCBhZnRlciAke3RoaXMuc3VibWlzc2lvbnNXaXRob3V0QW5FcnJvcn0gdHVybnMuYFxuICAgICAgICApO1xuICAgICAgICB0aGlzLnN1Ym1pc3Npb25zV2l0aG91dEFuRXJyb3IgPSAwO1xuICAgICAgICBzdWJtaXRFcnJvckhhbmRsZXIuaGFuZGxlU3VibWl0RXJyb3IoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3VibWlzc2lvbnNXaXRob3V0QW5FcnJvcisrO1xuICAgICAgICBzdWJtaXRCdXR0b24uY2xpY2soKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLyogaGl0IGVudGVyIGtleSBpbiB0aGUgcHJvbXB0IHRleHRhcmVhLCBtaWdodCBub3Qgd29yayBhcyBleHBlY3RlZCBvbiBcIm5ldyB1aSBsYXlvdXRcIiAqL1xuICAgICAgY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNheXBpLXByb21wdFwiKTtcblxuICAgICAgY29uc3QgZW50ZXJFdmVudCA9IG5ldyBLZXlib2FyZEV2ZW50KFwia2V5ZG93blwiLCB7XG4gICAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgICAgIGtleTogXCJFbnRlclwiLFxuICAgICAgICBrZXlDb2RlOiAxMyxcbiAgICAgICAgd2hpY2g6IDEzLFxuICAgICAgfSk7XG5cbiAgICAgIHRleHRhcmVhLmRpc3BhdGNoRXZlbnQoZW50ZXJFdmVudCk7XG4gICAgfVxuICB9XG5cbiAgLy8gRnVuY3Rpb24gdG8gaGFuZGxlIGF1dG8tc3VibWl0IGJhc2VkIG9uIHRoZSBidXR0b24ncyBkYXRhIGF0dHJpYnV0ZVxuICBoYW5kbGVBdXRvU3VibWl0KCkge1xuICAgIGNvbnN0IHRhbGtCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNheXBpLXRhbGtCdXR0b25cIik7XG5cbiAgICBpZiAodGFsa0J1dHRvbi5kYXRhc2V0LmF1dG9zdWJtaXQgPT09IFwiZmFsc2VcIikge1xuICAgICAgY29uc29sZS5sb2coXCJBdXRvc3VibWl0IGlzIG9mZlwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaW11bGF0ZUZvcm1TdWJtaXQoKTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVFeGl0QnV0dG9uKCkge1xuICAgIGNvbnN0IGxhYmVsID0gXCJFeGl0IFZvaWNlLUNvbnRyb2xsZWQgTW9iaWxlIE1vZGVcIjtcbiAgICBjb25zdCBidXR0b24gPSB0aGlzLmNyZWF0ZUJ1dHRvbihcIlwiLCAoKSA9PiB7XG4gICAgICBleGl0TW9iaWxlTW9kZSgpO1xuICAgIH0pO1xuICAgIGJ1dHRvbi5pZCA9IFwic2F5cGktZXhpdEJ1dHRvblwiO1xuICAgIGJ1dHRvbi50eXBlID0gXCJidXR0b25cIjtcbiAgICBidXR0b24uY2xhc3NOYW1lID1cbiAgICAgIFwiZXhpdC1idXR0b24gZml4ZWQgcm91bmRlZC1mdWxsIGJnLWNyZWFtLTU1MCBlbmFibGVkOmhvdmVyOmJnLWNyZWFtLTY1MFwiO1xuICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIGxhYmVsKTtcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKFwidGl0bGVcIiwgbGFiZWwpO1xuICAgIGJ1dHRvbi5pbm5lckhUTUwgPSBleGl0SWNvblNWRztcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gICAgcmV0dXJuIGJ1dHRvbjtcbiAgfVxuXG4gIGNyZWF0ZUVudGVyQnV0dG9uKCkge1xuICAgIGNvbnN0IGxhYmVsID0gXCJFbnRlciBWb2ljZS1Db250cm9sbGVkIE1vYmlsZSBNb2RlXCI7XG4gICAgY29uc3QgYnV0dG9uID0gdGhpcy5jcmVhdGVCdXR0b24oXCJcIiwgKCkgPT4ge1xuICAgICAgZW50ZXJNb2JpbGVNb2RlKCk7XG4gICAgfSk7XG4gICAgYnV0dG9uLmlkID0gXCJzYXlwaS1lbnRlckJ1dHRvblwiO1xuICAgIGJ1dHRvbi50eXBlID0gXCJidXR0b25cIjtcbiAgICBidXR0b24uY2xhc3NOYW1lID1cbiAgICAgIFwiZW50ZXItYnV0dG9uIGZpeGVkIHJvdW5kZWQtZnVsbCBiZy1jcmVhbS01NTAgZW5hYmxlZDpob3ZlcjpiZy1jcmVhbS02NTBcIjtcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBsYWJlbCk7XG4gICAgYnV0dG9uLnNldEF0dHJpYnV0ZShcInRpdGxlXCIsIGxhYmVsKTtcbiAgICBidXR0b24uaW5uZXJIVE1MID0gbWF4aW1pemVJY29uU1ZHO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgICByZXR1cm4gYnV0dG9uO1xuICB9XG5cbiAgc2hvd05vdGlmaWNhdGlvbihkZXRhaWxzKSB7XG4gICAgY29uc3QgaWNvbiA9IGRldGFpbHMuaWNvbjtcbiAgICBsZXQgaWNvblNWRztcbiAgICBpZiAoaWNvbiA9PT0gXCJtdXRlZC1taWNyb3Bob25lXCIpIHtcbiAgICAgIGljb25TVkcgPSBtdXRlZE1pY0ljb25TVkc7XG4gICAgfVxuXG4gICAgY29uc3Qgbm90aWZpY2F0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS1ub3RpZmljYXRpb25cIik7XG4gICAgaWYgKG5vdGlmaWNhdGlvbikge1xuICAgICAgbm90aWZpY2F0aW9uLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgICBub3RpZmljYXRpb24uaW5uZXJIVE1MID0gaWNvblNWRztcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgbm90aWZpY2F0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIG5vdGlmaWNhdGlvbi5pZCA9IFwic2F5cGktbm90aWZpY2F0aW9uXCI7XG4gICAgICBub3RpZmljYXRpb24uY2xhc3NOYW1lID0gXCJub3RpZmljYXRpb25cIjtcbiAgICAgIG5vdGlmaWNhdGlvbi5pbm5lckhUTUwgPSBpY29uU1ZHO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChub3RpZmljYXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIGRpc21pc3NOb3RpZmljYXRpb24oKSB7XG4gICAgY29uc3Qgbm90aWZpY2F0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS1ub3RpZmljYXRpb25cIik7XG4gICAgaWYgKG5vdGlmaWNhdGlvbikge1xuICAgICAgbm90aWZpY2F0aW9uLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlQ2FsbEJ1dHRvbihjb250YWluZXIsIHBvc2l0aW9uID0gMCkge1xuICAgIGNvbnN0IGJ1dHRvbiA9IHRoaXMuY3JlYXRlQnV0dG9uKCk7XG4gICAgYnV0dG9uLmlkID0gXCJzYXlwaS1jYWxsQnV0dG9uXCI7XG4gICAgYnV0dG9uLnR5cGUgPSBcImJ1dHRvblwiO1xuICAgIGJ1dHRvbi5jbGFzc05hbWUgPVxuICAgICAgXCJjYWxsLWJ1dHRvbiBmaXhlZCByb3VuZGVkLWZ1bGwgYmctY3JlYW0tNTUwIGVuYWJsZWQ6aG92ZXI6YmctY3JlYW0tNjUwXCI7XG4gICAgdGhpcy5jYWxsSW5hY3RpdmUoYnV0dG9uKTsgLy8gbWljIGlzIG9mZiBieSBkZWZhdWx0XG5cbiAgICBhcHBlbmRDaGlsZChjb250YWluZXIsIGJ1dHRvbiwgcG9zaXRpb24pO1xuICAgIHJldHVybiBidXR0b247XG4gIH1cblxuICBjYWxsQWN0aXZlKGNhbGxCdXR0b24pIHtcbiAgICBpZiAoIWNhbGxCdXR0b24pIHtcbiAgICAgIGNhbGxCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNheXBpLWNhbGxCdXR0b25cIik7XG4gICAgfVxuICAgIGlmIChjYWxsQnV0dG9uKSB7XG4gICAgICBjb25zdCBsYWJlbCA9IFwiQWN0aXZlIGNvbnRpbnVvdXMgbGlzdGVuaW5nLiBDbGljayB0byBzdG9wLlwiO1xuICAgICAgY2FsbEJ1dHRvbi5pbm5lckhUTUwgPSBoYW5ndXBJY29uU1ZHO1xuICAgICAgY2FsbEJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIGxhYmVsKTtcbiAgICAgIGNhbGxCdXR0b24uc2V0QXR0cmlidXRlKFwidGl0bGVcIiwgbGFiZWwpO1xuICAgICAgY2FsbEJ1dHRvbi5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmFjdG9yLnNlbmQoXCJzYXlwaTpoYW5ndXBcIik7XG4gICAgICB9O1xuICAgICAgY2FsbEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICAgIH1cbiAgfVxuXG4gIGNhbGxJbmFjdGl2ZShjYWxsQnV0dG9uKSB7XG4gICAgaWYgKCFjYWxsQnV0dG9uKSB7XG4gICAgICBjYWxsQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS1jYWxsQnV0dG9uXCIpO1xuICAgIH1cbiAgICBpZiAoY2FsbEJ1dHRvbikge1xuICAgICAgY2FsbEJ1dHRvbi5pbm5lckhUTUwgPSBjYWxsSWNvblNWRztcbiAgICAgIGNhbGxCdXR0b24uc2V0QXR0cmlidXRlKFxuICAgICAgICBcImFyaWEtbGFiZWxcIixcbiAgICAgICAgXCJDbGljayB0byBzdGFydCBjb250aW51b3VzIGxpc3RlbmluZy5cIlxuICAgICAgKTtcbiAgICAgIGNhbGxCdXR0b24uc2V0QXR0cmlidXRlKFwidGl0bGVcIiwgXCJOb3QgbGlzdGVuaW5nLiBDbGljayB0byBzdGFydC5cIik7XG4gICAgICBjYWxsQnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuYWN0b3Iuc2VuZChcInNheXBpOmNhbGxcIik7XG4gICAgICB9O1xuICAgICAgY2FsbEJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuICAgIH1cbiAgfVxuXG4gIGRpc2FibGVDYWxsQnV0dG9uKCkge1xuICAgIGNvbnN0IGNhbGxCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNheXBpLWNhbGxCdXR0b25cIik7XG4gICAgaWYgKGNhbGxCdXR0b24pIHtcbiAgICAgIGNhbGxCdXR0b24uY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpO1xuICAgICAgLy8gZGlzYWJsZSB0aGUgY2FsbCBhY3Rpb24sIGJ1dCBhbHdheXMgYWxsb3cgaGFuZ3VwXG4gICAgICBpZiAoIWNhbGxCdXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlXCIpKSB7XG4gICAgICAgIGNhbGxCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGVuYWJsZUNhbGxCdXR0b24oKSB7XG4gICAgY29uc3QgY2FsbEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F5cGktY2FsbEJ1dHRvblwiKTtcbiAgICBpZiAoY2FsbEJ1dHRvbikge1xuICAgICAgY2FsbEJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKFwiZGlzYWJsZWRcIik7XG4gICAgICBjYWxsQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfVxuICB9XG59XG5cbi8vIFNpbmdsZXRvblxuZXhwb3J0IGNvbnN0IGJ1dHRvbk1vZHVsZSA9IG5ldyBCdXR0b25Nb2R1bGUoKTtcbiIsImV4cG9ydCBjb25zdCBjb25maWcgPSB7XG4gIGFwcFNlcnZlclVybDogcHJvY2Vzcy5lbnYuQVBQX1NFUlZFUl9VUkwsXG4gIGFwaVNlcnZlclVybDogcHJvY2Vzcy5lbnYuQVBJX1NFUlZFUl9VUkwsXG59O1xuIiwiaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tIFwiZXZlbnRzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiIsImltcG9ydCBFdmVudEJ1cyBmcm9tIFwiLi9FdmVudEJ1cy5qc1wiO1xuaW1wb3J0IFN0YXRlTWFjaGluZVNlcnZpY2UgZnJvbSBcIi4vU3RhdGVNYWNoaW5lU2VydmljZS5qc1wiO1xuXG5jb25zdCBVU0VSX1NQRUFLSU5HID0gXCJzYXlwaTp1c2VyU3BlYWtpbmdcIjtcbmNvbnN0IFVTRVJfU1RPUFBFRF9TUEVBS0lORyA9IFwic2F5cGk6dXNlclN0b3BwZWRTcGVha2luZ1wiO1xuY29uc3QgVVNFUl9GSU5JU0hFRF9TUEVBS0lORyA9IFwic2F5cGk6dXNlckZpbmlzaGVkU3BlYWtpbmdcIjtcbmNvbnN0IFBJX1NQRUFLSU5HID0gXCJzYXlwaTpwaVNwZWFraW5nXCI7XG5jb25zdCBQSV9TVE9QUEVEX1NQRUFLSU5HID0gXCJzYXlwaTpwaVN0b3BwZWRTcGVha2luZ1wiO1xuY29uc3QgUElfRklOSVNIRURfU1BFQUtJTkcgPSBcInNheXBpOnBpRmluaXNoZWRTcGVha2luZ1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFdmVudE1vZHVsZSB7XG4gIHN0YXRpYyBpbml0KCkge1xuICAgIC8vIEFsbCB0aGUgZXZlbnQgbGlzdGVuZXJzIGNhbiBiZSBhZGRlZCBoZXJlXG4gICAgdGhpcy5yZWdpc3RlclN0YXRlTWFjaGluZUV2ZW50cyhTdGF0ZU1hY2hpbmVTZXJ2aWNlLmFjdG9yKTtcbiAgICAvLyBBbnkgb3RoZXIgaW5pdGlhbGl6YXRpb25zLi4uXG4gIH1cblxuICBzdGF0aWMgY2xlYW51cCgpIHtcbiAgICAvLyBSZW1vdmUgZXZlbnQgbGlzdGVuZXJzIGlmIG5lZWRlZCwgb3IgYW55IG90aGVyIGNsZWFudXAgb3BlcmF0aW9uc1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgXCJzYXlwaTp0cmFuc2NyaWJlZFwiLFxuICAgICAgdGhpcy5oYW5kbGVUcmFuc2NyaXB0aW9uUmVzcG9uc2VcbiAgICApO1xuICB9XG5cbiAgc3RhdGljIHNpbXVsYXRlVHlwaW5nKGVsZW1lbnQsIHRleHQpIHtcbiAgICBlbGVtZW50LmZvY3VzKCk7XG5cbiAgICAvLyBEZWZpbmUgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gbWF0Y2ggc2VudGVuY2UgdGVybWluYXRvcnMsIGNhcHR1cmluZyB0aGVtXG4gICAgY29uc3Qgc2VudGVuY2VSZWdleCA9IC8oWy4hP+OAgu+8n++8gV0rKS9nO1xuICAgIGNvbnN0IHRva2VucyA9IHRleHQuc3BsaXQoc2VudGVuY2VSZWdleCkuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgLy8gUmVhc3NlbWJsZSBzZW50ZW5jZXMgd2l0aCB0aGVpciB0ZXJtaW5hdG9yc1xuICAgIGNvbnN0IHNlbnRlbmNlcyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICBjb25zdCBzZW50ZW5jZSA9IHRva2Vuc1tpXSArICh0b2tlbnNbaSArIDFdIHx8IFwiXCIpO1xuICAgICAgc2VudGVuY2VzLnB1c2goc2VudGVuY2UpO1xuICAgIH1cblxuICAgIGxldCBpID0gMDtcblxuICAgIGNvbnN0IHR5cGVTZW50ZW5jZSA9ICgpID0+IHtcbiAgICAgIGlmIChpIDwgc2VudGVuY2VzLmxlbmd0aCkge1xuICAgICAgICAvLyBUeXBlIHRoZSBzZW50ZW5jZSBhbmQgaXRzIGltbWVkaWF0ZSBmb2xsb3dpbmcgdGVybWluYXRvclxuICAgICAgICBFdmVudE1vZHVsZS5zZXROYXRpdmVWYWx1ZShlbGVtZW50LCBlbGVtZW50LnZhbHVlICsgc2VudGVuY2VzW2krK10pO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodHlwZVNlbnRlbmNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEV2ZW50QnVzLmVtaXQoXCJzYXlwaTphdXRvU3VibWl0XCIpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoc2VudGVuY2VzLmxlbmd0aCA+IDEpIHtcbiAgICAgIC8vIElmIHRoZXJlIGFyZSBtdWx0aXBsZSBzZW50ZW5jZXMsIHByb2NlZWQgd2l0aCBzZW50ZW5jZS13aXNlIHR5cGluZ1xuICAgICAgdHlwZVNlbnRlbmNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIHRleHQgZG9lcyBub3QgY29udGFpbiByZWNvZ25pc2FibGUgc2VudGVuY2UgdGVybWluYXRvcnMsIHR5cGUgaXQgYWxsIGF0IG9uY2VcbiAgICAgIEV2ZW50TW9kdWxlLnNldE5hdGl2ZVZhbHVlKGVsZW1lbnQsIHRleHQpO1xuICAgICAgRXZlbnRCdXMuZW1pdChcInNheXBpOmF1dG9TdWJtaXRcIik7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHNldE5hdGl2ZVZhbHVlKGVsZW1lbnQsIHZhbHVlKSB7XG4gICAgbGV0IGxhc3RWYWx1ZSA9IGVsZW1lbnQudmFsdWU7XG4gICAgZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xuICAgIGxldCBldmVudCA9IG5ldyBFdmVudChcImlucHV0XCIsIHsgdGFyZ2V0OiBlbGVtZW50LCBidWJibGVzOiB0cnVlIH0pO1xuICAgIC8vIFJlYWN0IDE1XG4gICAgZXZlbnQuc2ltdWxhdGVkID0gdHJ1ZTtcbiAgICAvLyBSZWFjdCAxNi0xN1xuICAgIGxldCB0cmFja2VyID0gZWxlbWVudC5fdmFsdWVUcmFja2VyO1xuICAgIGlmICh0cmFja2VyKSB7XG4gICAgICB0cmFja2VyLnNldFZhbHVlKGxhc3RWYWx1ZSk7XG4gICAgfVxuICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gIH1cblxuICBzdGF0aWMgcmVnaXN0ZXJTdGF0ZU1hY2hpbmVFdmVudHMoYWN0b3IpIHtcbiAgICBFdmVudEJ1cy5vbihVU0VSX1NQRUFLSU5HLCAoKSA9PiB7XG4gICAgICBhY3Rvci5zZW5kKFVTRVJfU1BFQUtJTkcpO1xuICAgIH0pO1xuXG4gICAgW1VTRVJfU1RPUFBFRF9TUEVBS0lORywgVVNFUl9GSU5JU0hFRF9TUEVBS0lOR10uZm9yRWFjaCgoZXZlbnROYW1lKSA9PiB7XG4gICAgICBFdmVudEJ1cy5vbihldmVudE5hbWUsIChkZXRhaWwpID0+IHtcbiAgICAgICAgaWYgKGRldGFpbCkge1xuICAgICAgICAgIGFjdG9yLnNlbmQoeyB0eXBlOiBldmVudE5hbWUsIC4uLmRldGFpbCB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oYFJlY2VpdmVkICR7ZXZlbnROYW1lfSB3aXRob3V0IGRldGFpbHMuYCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgW1BJX1NQRUFLSU5HLCBQSV9TVE9QUEVEX1NQRUFLSU5HLCBQSV9GSU5JU0hFRF9TUEVBS0lOR10uZm9yRWFjaChcbiAgICAgIChldmVudE5hbWUpID0+IHtcbiAgICAgICAgRXZlbnRCdXMub24oZXZlbnROYW1lLCAoKSA9PiB7XG4gICAgICAgICAgYWN0b3Iuc2VuZChldmVudE5hbWUpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICApO1xuICB9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gc2VyaWFsaXplU3RhdGVWYWx1ZShzdGF0ZVZhbHVlKSB7XG4gIGlmICh0eXBlb2Ygc3RhdGVWYWx1ZSA9PT0gXCJzdHJpbmdcIikge1xuICAgIHJldHVybiBzdGF0ZVZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIE9iamVjdC5rZXlzKHN0YXRlVmFsdWUpXG4gICAgLm1hcCgoa2V5KSA9PiBgJHtrZXl9OiR7c2VyaWFsaXplU3RhdGVWYWx1ZShzdGF0ZVZhbHVlW2tleV0pfWApXG4gICAgLmpvaW4oXCIsXCIpO1xufVxuXG5jb25zdCBERUJVRyA9IGZhbHNlOyAvLyBDb25zaWRlciB1c2luZyBjb25maWcgYW5kIC5lbnYgdG8gc2V0IHRoZSBERUJVRyBmbGFnXG5cbmV4cG9ydCBjb25zdCBsb2dnZXIgPSB7XG4gIGRlYnVnOiAoLi4uYXJncykgPT4ge1xuICAgIGlmIChERUJVRykge1xuICAgICAgY29uc29sZS5sb2coXCJERUJVRzpcIiwgLi4uYXJncyk7XG4gICAgfVxuICB9LFxuICBpbmZvOiAoLi4uYXJncykgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiSU5GTzpcIiwgLi4uYXJncyk7XG4gIH0sXG4gIGVycm9yOiAoLi4uYXJncykgPT4ge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJFUlJPUjpcIiwgLi4uYXJncyk7XG4gIH0sXG59O1xuIiwiaW1wb3J0IHsgaW50ZXJwcmV0IH0gZnJvbSBcInhzdGF0ZVwiO1xuaW1wb3J0IHsgbWFjaGluZSB9IGZyb20gXCIuL3N0YXRlLW1hY2hpbmVzL1NheVBpTWFjaGluZS50c1wiO1xuaW1wb3J0IHsgbG9nZ2VyLCBzZXJpYWxpemVTdGF0ZVZhbHVlIH0gZnJvbSBcIi4vTG9nZ2luZ01vZHVsZS5qc1wiO1xuXG4vKipcbiAqIEEgc2luZ2xldG9uIHNlcnZpY2UgdGhhdCBtYW5hZ2VzIHRoZSBzdGF0ZSBtYWNoaW5lLlxuICovXG5jbGFzcyBTdGF0ZU1hY2hpbmVTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hY3RvciA9IGludGVycHJldChtYWNoaW5lKS5vblRyYW5zaXRpb24oKHN0YXRlKSA9PiB7XG4gICAgICBpZiAoc3RhdGUuY2hhbmdlZCkge1xuICAgICAgICBjb25zdCBmcm9tU3RhdGUgPSBzdGF0ZS5oaXN0b3J5XG4gICAgICAgICAgPyBzZXJpYWxpemVTdGF0ZVZhbHVlKHN0YXRlLmhpc3RvcnkudmFsdWUpXG4gICAgICAgICAgOiBcIk4vQVwiO1xuICAgICAgICBjb25zdCB0b1N0YXRlID0gc2VyaWFsaXplU3RhdGVWYWx1ZShzdGF0ZS52YWx1ZSk7XG4gICAgICAgIGxvZ2dlci5kZWJ1ZyhcbiAgICAgICAgICBgU2F5LCBQaSBNYWNoaW5lIHRyYW5zaXRpb25lZCBmcm9tICR7ZnJvbVN0YXRlfSB0byAke3RvU3RhdGV9IHdpdGggJHtzdGF0ZS5ldmVudC50eXBlfWBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmFjdG9yLnN0YXJ0KCk7XG4gIH1cbn1cblxuLy8gU2luZ2xldG9uXG5leHBvcnQgZGVmYXVsdCBuZXcgU3RhdGVNYWNoaW5lU2VydmljZSgpO1xuIiwiaW1wb3J0IHsgYXBwZW5kQ2hpbGQgfSBmcm9tIFwiLi9ET01Nb2R1bGUudHNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzTW9iaWxlRGV2aWNlKCkge1xuICByZXR1cm4gKFxuICAgIC9BbmRyb2lkfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeXxJRU1vYmlsZXxPcGVyYSBNaW5pL2kudGVzdChcbiAgICAgIG5hdmlnYXRvci51c2VyQWdlbnRcbiAgICApIHx8IHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1heC13aWR0aDogNzY4cHgpXCIpLm1hdGNoZXNcbiAgKTtcbn1cblxuLy8gdGhpcyBmdW5jdGlvbiBkZXRlcm1pbmVzIHdoZXRoZXIgdG8gc2hvdyB0aGUgbW9iaWxlIHZpZXcgb3Igbm90XG5leHBvcnQgZnVuY3Rpb24gaXNNb2JpbGVWaWV3KCkge1xuICBsZXQgdXNlclZpZXdQcmVmZXJlbmNlID0gbnVsbDtcblxuICB0cnkge1xuICAgIHVzZXJWaWV3UHJlZmVyZW5jZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidXNlclZpZXdQcmVmZXJlbmNlXCIpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwiQ291bGQgbm90IGFjY2VzcyBsb2NhbFN0b3JhZ2U6IFwiLCBlKTtcbiAgfVxuXG4gIGxldCBwcmVmZXJzTW9iaWxlID0gZmFsc2U7XG4gIGlmICh1c2VyVmlld1ByZWZlcmVuY2UpIHtcbiAgICBwcmVmZXJzTW9iaWxlID0gdXNlclZpZXdQcmVmZXJlbmNlID09PSBcIm1vYmlsZVwiO1xuICB9XG5cbiAgLy8gTWFrZSBzdXJlIGlzTW9iaWxlRGV2aWNlIGlzIGRlZmluZWQgb3IgaW1wb3J0ZWRcbiAgcmV0dXJuIGlzTW9iaWxlRGV2aWNlKCkgJiYgcHJlZmVyc01vYmlsZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4aXRNb2JpbGVNb2RlKCkge1xuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInVzZXJWaWV3UHJlZmVyZW5jZVwiLCBcImRlc2t0b3BcIik7IC8vIFNhdmUgcHJlZmVyZW5jZVxuXG4gIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcIm1vYmlsZS12aWV3XCIpO1xuICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJkZXNrdG9wLXZpZXdcIik7XG5cbiAgYXR0YWNoQ2FsbEJ1dHRvbigpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW50ZXJNb2JpbGVNb2RlKCkge1xuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInVzZXJWaWV3UHJlZmVyZW5jZVwiLCBcIm1vYmlsZVwiKTsgLy8gU2F2ZSBwcmVmZXJlbmNlXG5cbiAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiZGVza3RvcC12aWV3XCIpO1xuICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJtb2JpbGUtdmlld1wiKTtcblxuICBkZXRhY2hDYWxsQnV0dG9uKCk7XG59XG5cbmZ1bmN0aW9uIGF0dGFjaENhbGxCdXR0b24oKSB7XG4gIC8vIG1vdmUgdGhlIGNhbGwgYnV0dG9uIGJhY2sgaW50byB0aGUgdGV4dCBwcm9tcHQgY29udGFpbmVyIGZvciBkZXNrdG9wIHZpZXdcbiAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS1wcm9tcHQtY29udHJvbHMtY29udGFpbmVyXCIpO1xuICBjb25zdCBjYWxsQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS1jYWxsQnV0dG9uXCIpO1xuICBpZiAoY29udGFpbmVyICYmIGNhbGxCdXR0b24pIHtcbiAgICBhcHBlbmRDaGlsZChjb250YWluZXIsIGNhbGxCdXR0b24sIC0xKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBkZXRhY2hDYWxsQnV0dG9uKCkge1xuICAvLyByZW1vdmUgdGhlIGNhbGwgYnV0dG9uIGZyb20gdGhlIHRleHQgcHJvbXB0IGNvbnRhaW5lciB3aGlsZSBpbiBtb2JpbGUgdmlld1xuICBjb25zdCBjYWxsQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS1jYWxsQnV0dG9uXCIpO1xuICBpZiAoY2FsbEJ1dHRvbikge1xuICAgIGFwcGVuZENoaWxkKGRvY3VtZW50LmJvZHksIGNhbGxCdXR0b24pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRVc2VyQWdlbnRGbGFncygpIHtcbiAgY29uc3QgaXNGaXJlZm94QW5kcm9pZCA9XG4gICAgL0ZpcmVmb3gvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgJiYgL0FuZHJvaWQvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cbiAgaWYgKGlzRmlyZWZveEFuZHJvaWQpIHtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJmaXJlZm94LWFuZHJvaWRcIik7XG4gIH1cblxuICBhZGREZXZpY2VGbGFncyhlbGVtZW50KTtcbiAgYWRkVmlld0ZsYWdzKGVsZW1lbnQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkRGV2aWNlRmxhZ3MoZWxlbWVudCkge1xuICBpZiAoaXNNb2JpbGVEZXZpY2UoKSkge1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcIm1vYmlsZS1kZXZpY2VcIik7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFZpZXdGbGFncyhlbGVtZW50KSB7XG4gIGlmIChpc01vYmlsZVZpZXcoKSkge1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImRlc2t0b3Atdmlld1wiKTtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJtb2JpbGUtdmlld1wiKTtcbiAgfSBlbHNlIHtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJtb2JpbGUtdmlld1wiKTtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJkZXNrdG9wLXZpZXdcIik7XG4gIH1cbn1cblxuLyoqXG4gKiBQZXJmb3JtIGluaXRpYWwgc2V0dXAgb2YgdGhlIFVJIGJhc2VkIG9uIHRoZSB1c2VyJ3MgZGV2aWNlIGFuZCB2aWV3IHByZWZlcmVuY2VzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0TW9kZSgpIHtcbiAgaWYgKGlzTW9iaWxlVmlldygpKSB7XG4gICAgZW50ZXJNb2JpbGVNb2RlKCk7XG4gIH0gZWxzZSB7XG4gICAgZXhpdE1vYmlsZU1vZGUoKTtcbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgeyBidXR0b25Nb2R1bGUgfSBmcm9tIFwiLi9CdXR0b25Nb2R1bGUuanNcIjtcbmltcG9ydCBFdmVudEJ1cyBmcm9tIFwiLi9FdmVudEJ1cy5qc1wiO1xuaW1wb3J0IEV2ZW50TW9kdWxlIGZyb20gXCIuL0V2ZW50TW9kdWxlLmpzXCI7XG5pbXBvcnQgeyBhZGRVc2VyQWdlbnRGbGFncywgaW5pdE1vZGUgfSBmcm9tIFwiLi9Vc2VyQWdlbnRNb2R1bGUuanNcIjtcbmltcG9ydCB7IHN1Ym1pdEVycm9ySGFuZGxlciB9IGZyb20gXCIuL1N1Ym1pdEVycm9ySGFuZGxlci50c1wiO1xuaW1wb3J0IHsgY29uZmlnIGFzIHNlcnZlckNvbmZpZyB9IGZyb20gXCIuL0NvbmZpZ01vZHVsZS5qc1wiO1xuXG5pbXBvcnQgXCIuL3N0eWxlcy9jb21tb24uc2Nzc1wiO1xuaW1wb3J0IFwiLi9zdHlsZXMvZGVza3RvcC5zY3NzXCI7XG5pbXBvcnQgXCIuL3N0eWxlcy9tb2JpbGUuc2Nzc1wiO1xuaW1wb3J0IFwiLi9zdHlsZXMvcmVjdGFuZ2xlcy5jc3NcIjtcblxuKGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgY29uc3QgYXVkaW9Nb2R1bGVVcmwgPSBgJHtzZXJ2ZXJDb25maWcuYXBwU2VydmVyVXJsfS9hdWRpb01vZHVsZS5idW5kbGUuanNgO1xuXG4gIGxldCBwYWdlU2NyaXB0O1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYXVkaW9Nb2R1bGVVcmwpO1xuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIk5ldHdvcmsgcmVzcG9uc2Ugd2FzIG5vdCBvayBcIiArIHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgIH1cbiAgICBwYWdlU2NyaXB0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJUaGVyZSBoYXMgYmVlbiBhIHByb2JsZW0gd2l0aCB5b3VyIGZldGNoIG9wZXJhdGlvbjpcIiwgZXJyb3IpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluamVjdFNjcmlwdChjYWxsYmFjaykge1xuICAgIHZhciBzY3JpcHRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICBzY3JpcHRFbGVtZW50LnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xuICAgIHNjcmlwdEVsZW1lbnQuaWQgPSBcInNheXBpLXNjcmlwdFwiO1xuICAgIHNjcmlwdEVsZW1lbnQudGV4dENvbnRlbnQgPSBwYWdlU2NyaXB0O1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0RWxlbWVudCk7XG5cbiAgICAvLyBDYWxsIHRoZSBjYWxsYmFjayBmdW5jdGlvbiBhZnRlciB0aGUgc2NyaXB0IGlzIGFkZGVkXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgfVxuXG4gIGFkZFVzZXJBZ2VudEZsYWdzKCk7XG4gIEV2ZW50TW9kdWxlLmluaXQoKTtcbiAgc2V0dXBFdmVudEJ1cygpO1xuXG4gIC8vIENyZWF0ZSBhIE11dGF0aW9uT2JzZXJ2ZXIgdG8gbGlzdGVuIGZvciBjaGFuZ2VzIHRvIHRoZSBET01cbiAgLy8gdGV4dGFyZWFzIGFyZSBhZGRlZCB0byB0aGUgRE9NIGFmdGVyIHRoZSBwYWdlIGxvYWRzXG4gIGNvbnN0IGNhbGxiYWNrID0gZnVuY3Rpb24gKG11dGF0aW9uc0xpc3QsIG9ic2VydmVyKSB7XG4gICAgZm9yIChjb25zdCBtdXRhdGlvbiBvZiBtdXRhdGlvbnNMaXN0KSB7XG4gICAgICBpZiAobXV0YXRpb24udHlwZSA9PT0gXCJjaGlsZExpc3RcIikge1xuICAgICAgICAvLyBJdGVyYXRlIHRocm91Z2ggYWRkZWQgbm9kZXNcbiAgICAgICAgbXV0YXRpb24uYWRkZWROb2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgICAgLy8gQ2hlY2sgaWYgYWRkZWQgbm9kZSBpcyBhIHRleHRhcmVhIHdpdGggJ2VudGVya2V5aGludCcgYXR0cmlidXRlXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgbm9kZS5ub2RlTmFtZSA9PT0gXCJURVhUQVJFQVwiICYmXG4gICAgICAgICAgICBub2RlLmhhc0F0dHJpYnV0ZShcImVudGVya2V5aGludFwiKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgLy8gU3RvcCBvYnNlcnZpbmcgdG8gYXZvaWQgYW55IHBvdGVudGlhbCBpbmZpbml0ZSBsb29wc1xuICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuXG4gICAgICAgICAgICAvLyBEbyBzb21ldGhpbmcgd2l0aCB0aGUgdGV4dGFyZWEsIGxpa2UgYWRkIGFuIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgICAgICBhbm5vdGF0ZURPTShub2RlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBDaGVjayBpZiBhZGRlZCBub2RlIGNvbnRhaW5zIGEgdGV4dGFyZWEgd2l0aCAnZW50ZXJrZXloaW50JyBhdHRyaWJ1dGVcbiAgICAgICAgICBpZiAobm9kZS5xdWVyeVNlbGVjdG9yQWxsKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0YXJlYXMgPSBub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0ZXh0YXJlYVtlbnRlcmtleWhpbnRdXCIpO1xuICAgICAgICAgICAgaWYgKHRleHRhcmVhcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIC8vIFN0b3Agb2JzZXJ2aW5nXG4gICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcblxuICAgICAgICAgICAgICAvLyBEbyBzb21ldGhpbmcgd2l0aCB0aGUgZmlyc3QgdGV4dGFyZWEgdGhhdCBoYXMgJ2VudGVya2V5aGludCdcbiAgICAgICAgICAgICAgYW5ub3RhdGVET00odGV4dGFyZWFzWzBdKTtcbiAgICAgICAgICAgICAgc3VibWl0RXJyb3JIYW5kbGVyLmluaXRBdWRpb091dHB1dExpc3RlbmVyKCk7XG4gICAgICAgICAgICAgIHN1Ym1pdEVycm9ySGFuZGxlci5jaGVja0ZvclJlc3RvcmVQb2ludCgpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLy8gT3B0aW9ucyBmb3IgdGhlIG9ic2VydmVyICh3aGljaCBtdXRhdGlvbnMgdG8gb2JzZXJ2ZSlcbiAgY29uc3QgY29uZmlnID0geyBhdHRyaWJ1dGVzOiBmYWxzZSwgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH07XG5cbiAgLy8gQ3JlYXRlIGFuIG9ic2VydmVyIGluc3RhbmNlIGxpbmtlZCB0byB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihjYWxsYmFjayk7XG5cbiAgLy8gU3RhcnQgb2JzZXJ2aW5nIHRoZSB0YXJnZXQgbm9kZSBmb3IgY29uZmlndXJlZCBtdXRhdGlvbnNcbiAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCBjb25maWcpO1xuXG4gIGZ1bmN0aW9uIHNldHVwRXZlbnRCdXMoKSB7XG4gICAgLy8gU2V0dGluZyB0aGUgY29ycmVjdCBjb250ZXh0XG4gICAgbGV0IGNvbnRleHQgPSB3aW5kb3c7XG4gICAgaWYgKEdNX2luZm8uc2NyaXB0SGFuZGxlciAhPT0gXCJVc2Vyc2NyaXB0c1wiKSB7XG4gICAgICBjb250ZXh0ID0gdW5zYWZlV2luZG93O1xuICAgIH1cbiAgICBjb250ZXh0LkV2ZW50QnVzID0gRXZlbnRCdXM7IC8vIE1ha2UgdGhlIEV2ZW50QnVzIGF2YWlsYWJsZSB0byB0aGUgcGFnZSBzY3JpcHRcbiAgfVxuXG4gIGZ1bmN0aW9uIGFubm90YXRlRE9NKHByb21wdCkge1xuICAgIC8vIEFkZCBpZCBhdHRyaWJ1dGVzIHRvIGltcG9ydGFudCBlbGVtZW50c1xuICAgIHByb21wdC5pZCA9IFwic2F5cGktcHJvbXB0XCI7XG4gICAgcHJvbXB0LnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZChcInNheXBpLXByb21wdC1jb250YWluZXJcIik7XG4gICAgY29uc3QgZm91bmRGb290ZXIgPSBhZGRJZEZvb3RlcigpO1xuICAgIGNvbnN0IGZvdW5kQXVkaW9Db250cm9scyA9IGFkZElkQXVkaW9Db250cm9scygpO1xuICAgIGNvbnN0IHByb21wdENvbnRyb2xzQ29udGFpbmVyID0gcHJvbXB0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICBwcm9tcHRDb250cm9sc0NvbnRhaW5lci5pZCA9IFwic2F5cGktcHJvbXB0LWNvbnRyb2xzLWNvbnRhaW5lclwiO1xuICAgIGNvbnN0IGZvdW5kUHJvbXB0QW5jZXN0b3IgPSBhZGRJZFByb21wdEFuY2VzdG9yKHByb21wdENvbnRyb2xzQ29udGFpbmVyKTtcbiAgICBjb25zdCBmb3VuZEF1ZGlvT3V0cHV0QnV0dG9uID0gYWRkSWRBdWRpb091dHB1dEJ1dHRvbigpO1xuICAgIGFkZElkU3VibWl0QnV0dG9uKHByb21wdENvbnRyb2xzQ29udGFpbmVyKTtcbiAgICBhZGRUYWxrQnV0dG9uKGRvY3VtZW50LmJvZHkpO1xuICAgIGJ1dHRvbk1vZHVsZS5jcmVhdGVDYWxsQnV0dG9uKHByb21wdENvbnRyb2xzQ29udGFpbmVyLCAtMSk7XG4gICAgYnV0dG9uTW9kdWxlLmNyZWF0ZUVudGVyQnV0dG9uKCk7XG4gICAgYnV0dG9uTW9kdWxlLmNyZWF0ZUV4aXRCdXR0b24oKTtcbiAgICBpbml0TW9kZSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkSWRQcm9tcHRBbmNlc3Rvcihjb250YWluZXIpIHtcbiAgICAvLyBjbGltYiB1cCB0aGUgRE9NIHRyZWUgdW50aWwgd2UgZmluZCBhIGRpdiB3aXRoIGNsYXNzICd3LWZ1bGwnXG4gICAgbGV0IHBhcmVudCA9IGNvbnRhaW5lci5wYXJlbnRFbGVtZW50O1xuICAgIHdoaWxlIChwYXJlbnQpIHtcbiAgICAgIGlmIChwYXJlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwidy1mdWxsXCIpKSB7XG4gICAgICAgIHBhcmVudC5pZCA9IFwic2F5cGktcHJvbXB0LWFuY2VzdG9yXCI7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZElkU3VibWl0QnV0dG9uKGNvbnRhaW5lcikge1xuICAgIGNvbnN0IHN1Ym1pdEJ1dHRvbnMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbChcImJ1dHRvblt0eXBlPWJ1dHRvbl1cIik7XG4gICAgaWYgKHN1Ym1pdEJ1dHRvbnMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgbGFzdFN1Ym1pdEJ1dHRvbiA9IHN1Ym1pdEJ1dHRvbnNbc3VibWl0QnV0dG9ucy5sZW5ndGggLSAxXTtcbiAgICAgIGxhc3RTdWJtaXRCdXR0b24uaWQgPSBcInNheXBpLXN1Ym1pdEJ1dHRvblwiO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZElkRm9vdGVyKCkge1xuICAgIC8vIEZpbmQgYWxsIGF1ZGlvIGVsZW1lbnRzIG9uIHRoZSBwYWdlXG4gICAgdmFyIGF1ZGlvRWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiYXVkaW9cIik7XG4gICAgdmFyIGZvdW5kID0gZmFsc2U7IC8vIGRlZmF1bHQgdG8gbm90IGZvdW5kXG5cbiAgICBhdWRpb0VsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGF1ZGlvKSB7XG4gICAgICB2YXIgcHJlY2VkaW5nRGl2ID0gYXVkaW8ucHJldmlvdXNFbGVtZW50U2libGluZztcblxuICAgICAgLy8gSWYgd2UndmUgYWxyZWFkeSBmb3VuZCBhIGRpdiwgd2UgY2FuIHNraXAgZnVydGhlciBpdGVyYXRpb25zXG4gICAgICBpZiAoZm91bmQpIHJldHVybjtcblxuICAgICAgLy8gQ2hlY2sgaWYgdGhlIHByZWNlZGluZyBlbGVtZW50IGlzIGEgZGl2XG4gICAgICBpZiAocHJlY2VkaW5nRGl2ICYmIHByZWNlZGluZ0Rpdi50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiZGl2XCIpIHtcbiAgICAgICAgLy8gQXNzaWduIGFuIElEIHRvIHRoZSBkaXZcbiAgICAgICAgcHJlY2VkaW5nRGl2Lmxhc3RFbGVtZW50Q2hpbGQuaWQgPSBcInNheXBpLWZvb3RlclwiO1xuICAgICAgICBmb3VuZCA9IHRydWU7IC8vIHNldCB0byBmb3VuZFxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGZvdW5kO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkSWRBdWRpb0NvbnRyb2xzKCkge1xuICAgIC8vIEZpbmQgYWxsIGF1ZGlvIGVsZW1lbnRzIG9uIHRoZSBwYWdlXG4gICAgdmFyIGF1ZGlvRWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiYXVkaW9cIik7XG4gICAgdmFyIGZvdW5kID0gZmFsc2U7IC8vIGRlZmF1bHQgdG8gbm90IGZvdW5kXG5cbiAgICBhdWRpb0VsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGF1ZGlvKSB7XG4gICAgICB2YXIgbmV4dERpdiA9IGF1ZGlvLm5leHRFbGVtZW50U2libGluZztcblxuICAgICAgLy8gSWYgd2UndmUgYWxyZWFkeSBmb3VuZCBhIGRpdiwgd2UgY2FuIHNraXAgZnVydGhlciBpdGVyYXRpb25zXG4gICAgICBpZiAoZm91bmQpIHJldHVybjtcblxuICAgICAgLy8gQ2hlY2sgaWYgdGhlIHByZWNlZGluZyBlbGVtZW50IGlzIGEgZGl2XG4gICAgICBpZiAobmV4dERpdiAmJiBuZXh0RGl2LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJkaXZcIikge1xuICAgICAgICAvLyBBc3NpZ24gYW4gSUQgdG8gdGhlIGRpdlxuICAgICAgICBuZXh0RGl2LmlkID0gXCJzYXlwaS1hdWRpby1jb250cm9sc1wiO1xuICAgICAgICBmb3VuZCA9IHRydWU7IC8vIHNldCB0byBmb3VuZFxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGZvdW5kO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkSWRBdWRpb091dHB1dEJ1dHRvbigpIHtcbiAgICAvLyBhdWRpbyBidXR0b24gaXMgdGhlIGxhc3QgYnV0dG9uIGVsZW1lbnQgaW4gdGhlIGF1ZGlvIGNvbnRyb2xzIGNvbnRhaW5lclxuICAgIGNvbnN0IGF1ZGlvQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgIFwiI3NheXBpLWF1ZGlvLWNvbnRyb2xzID4gZGl2ID4gZGl2LnJlbGF0aXZlLmZsZXguaXRlbXMtY2VudGVyLmp1c3RpZnktZW5kLnNlbGYtZW5kLnAtMiA+IGJ1dHRvblwiXG4gICAgKTtcbiAgICBpZiAoIWF1ZGlvQnV0dG9uKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF1ZGlvQnV0dG9uLmlkID0gXCJzYXlwaS1hdWRpby1vdXRwdXQtYnV0dG9uXCI7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkVGFsa0J1dHRvbihjb250YWluZXIpIHtcbiAgICAvLyBDcmVhdGUgYSBjb250YWluaW5nIGRpdlxuICAgIHZhciBwYW5lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgcGFuZWwuaWQgPSBcInNheXBpLXBhbmVsXCI7XG5cbiAgICBpZiAoY29udGFpbmVyKSB7XG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQocGFuZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHBhbmVsKTtcbiAgICB9XG5cbiAgICAvLyB0YWxrIFwiYnV0dG9uXCIgaXMgbm8gbG9uZ2VyIGEgYnV0dG9uLCBidXQgYSBkaXZcbiAgICB2YXIgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBidXR0b24uaWQgPSBcInNheXBpLXRhbGtCdXR0b25cIjtcblxuICAgIGNvbnN0IGNsYXNzTmFtZXMgPVxuICAgICAgXCJyZWxhdGl2ZSBmbGV4IG10LTEgbWItMSByb3VuZGVkLWZ1bGwgcHgtMiBweS0zIHRleHQtY2VudGVyIGJnLWNyZWFtLTU1MCBob3ZlcjpiZy1jcmVhbS02NTAgaG92ZXI6dGV4dC1icmFuZC1ncmVlbi03MDAgdGV4dC1tdXRlZFwiO1xuICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZXMuc3BsaXQoXCIgXCIpKTtcblxuICAgIC8vIEVuYWJsZSBhdXRvc3VibWl0IGJ5IGRlZmF1bHRcbiAgICBidXR0b24uZGF0YXNldC5hdXRvc3VibWl0ID0gXCJ0cnVlXCI7XG4gICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJhdXRvU3VibWl0XCIpO1xuXG4gICAgcGFuZWwuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgICBidXR0b25Nb2R1bGUuYWRkVGFsa0ljb24oYnV0dG9uKTtcblxuICAgIC8vIENhbGwgdGhlIGZ1bmN0aW9uIHRvIGluamVjdCB0aGUgc2NyaXB0IGFmdGVyIHRoZSBidXR0b24gaGFzIGJlZW4gYWRkZWRcbiAgICBpbmplY3RTY3JpcHQoKTtcbiAgfVxuXG4gIC8vIFN0YXJ0IG9ic2VydmluZyB0aGUgZW50aXJlIGRvY3VtZW50IGZvciBjaGFuZ2VzIHRvIGNoaWxkIG5vZGVzIGFuZCBzdWJ0cmVlXG4gIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQsIHsgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH0pO1xufSkoKTtcbiJdLCJuYW1lcyI6WyJBbmltYXRpb25Nb2R1bGUiLCJfY2xhc3NDYWxsQ2hlY2siLCJfY3JlYXRlQ2xhc3MiLCJrZXkiLCJ2YWx1ZSIsInN0YXJ0QW5pbWF0aW9uIiwiYW5pbWF0aW9uIiwic3RvcE90aGVyQW5pbWF0aW9ucyIsInJlY3RhbmdsZXMiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJyZWN0YW5nbGVzU2VsZWN0b3IiLCJmb3JFYWNoIiwicmVjdCIsImNsYXNzTGlzdCIsImFkZCIsInN0b3BBbmltYXRpb24iLCJyZW1vdmUiLCJzdG9wQWxsQW5pbWF0aW9ucyIsIl90aGlzIiwidGFsa0J1dHRvbkFuaW1hdGlvbnMiLCJrZWVwQW5pbWF0aW9uIiwiX3RoaXMyIiwiX2RlZmluZVByb3BlcnR5IiwiZGVmYXVsdCIsImVudGVyTW9iaWxlTW9kZSIsImV4aXRNb2JpbGVNb2RlIiwiaXNNb2JpbGVWaWV3IiwiYXBwZW5kQ2hpbGQiLCJFdmVudEJ1cyIsIlN0YXRlTWFjaGluZVNlcnZpY2UiLCJzdWJtaXRFcnJvckhhbmRsZXIiLCJleGl0SWNvblNWRyIsIm1heGltaXplSWNvblNWRyIsInJlY3RhbmdsZXNTVkciLCJ0YWxrSWNvblNWRyIsIm11dGVkTWljSWNvblNWRyIsImNhbGxJY29uU1ZHIiwiaGFuZ3VwSWNvblNWRyIsIkJ1dHRvbk1vZHVsZSIsImFjdG9yIiwicmVnaXN0ZXJPdGhlckV2ZW50cyIsInN1Ym1pc3Npb25zV2l0aG91dEFuRXJyb3IiLCJvbiIsImhhbmRsZUF1dG9TdWJtaXQiLCJjcmVhdGVCdXR0b24iLCJsYWJlbCIsImNhbGxiYWNrIiwiYnV0dG9uIiwiY3JlYXRlRWxlbWVudCIsInRleHRDb250ZW50Iiwib25jbGljayIsInN0eWxlQnV0dG9uIiwic3R5bGVzIiwiaGFzT3duUHJvcGVydHkiLCJzdHlsZSIsImFkZFRhbGtJY29uIiwidXBkYXRlSWNvbkNvbnRlbnQiLCJ3aW5kb3ciLCJtYXRjaE1lZGlhIiwiYWRkTGlzdGVuZXIiLCJzZXR1cENsYXNzT2JzZXJ2ZXIiLCJpY29uQ29udGFpbmVyIiwiaW5uZXJIVE1MIiwiX3RoaXMzIiwidGFyZ2V0Tm9kZSIsImRvY3VtZW50RWxlbWVudCIsImNvbmZpZyIsImF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVGaWx0ZXIiLCJtdXRhdGlvbnNMaXN0Iiwib2JzZXJ2ZXIiLCJfaXRlcmF0b3IiLCJfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlciIsIl9zdGVwIiwicyIsIm4iLCJkb25lIiwibXV0YXRpb24iLCJ0eXBlIiwiYXR0cmlidXRlTmFtZSIsImNvbnRhaW5zIiwiZXJyIiwiZSIsImYiLCJNdXRhdGlvbk9ic2VydmVyIiwib2JzZXJ2ZSIsInNpbXVsYXRlRm9ybVN1Ym1pdCIsInN1Ym1pdEJ1dHRvbiIsImdldEVsZW1lbnRCeUlkIiwiZGV0ZWN0U3VibWl0RXJyb3IiLCJjb25zb2xlIiwiZXJyb3IiLCJjb25jYXQiLCJoYW5kbGVTdWJtaXRFcnJvciIsImNsaWNrIiwidGV4dGFyZWEiLCJlbnRlckV2ZW50IiwiS2V5Ym9hcmRFdmVudCIsImJ1YmJsZXMiLCJrZXlDb2RlIiwid2hpY2giLCJkaXNwYXRjaEV2ZW50IiwidGFsa0J1dHRvbiIsImRhdGFzZXQiLCJhdXRvc3VibWl0IiwibG9nIiwiY3JlYXRlRXhpdEJ1dHRvbiIsImlkIiwiY2xhc3NOYW1lIiwic2V0QXR0cmlidXRlIiwiYm9keSIsImNyZWF0ZUVudGVyQnV0dG9uIiwic2hvd05vdGlmaWNhdGlvbiIsImRldGFpbHMiLCJpY29uIiwiaWNvblNWRyIsIm5vdGlmaWNhdGlvbiIsImRpc21pc3NOb3RpZmljYXRpb24iLCJjcmVhdGVDYWxsQnV0dG9uIiwiY29udGFpbmVyIiwicG9zaXRpb24iLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJjYWxsSW5hY3RpdmUiLCJjYWxsQWN0aXZlIiwiY2FsbEJ1dHRvbiIsIl90aGlzNCIsInNlbmQiLCJfdGhpczUiLCJkaXNhYmxlQ2FsbEJ1dHRvbiIsImRpc2FibGVkIiwiZW5hYmxlQ2FsbEJ1dHRvbiIsImJ1dHRvbk1vZHVsZSIsImFwcFNlcnZlclVybCIsInByb2Nlc3MiLCJlbnYiLCJBUFBfU0VSVkVSX1VSTCIsImFwaVNlcnZlclVybCIsIkFQSV9TRVJWRVJfVVJMIiwiRXZlbnRFbWl0dGVyIiwiVVNFUl9TUEVBS0lORyIsIlVTRVJfU1RPUFBFRF9TUEVBS0lORyIsIlVTRVJfRklOSVNIRURfU1BFQUtJTkciLCJQSV9TUEVBS0lORyIsIlBJX1NUT1BQRURfU1BFQUtJTkciLCJQSV9GSU5JU0hFRF9TUEVBS0lORyIsIkV2ZW50TW9kdWxlIiwiaW5pdCIsInJlZ2lzdGVyU3RhdGVNYWNoaW5lRXZlbnRzIiwiY2xlYW51cCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJoYW5kbGVUcmFuc2NyaXB0aW9uUmVzcG9uc2UiLCJzaW11bGF0ZVR5cGluZyIsImVsZW1lbnQiLCJ0ZXh0IiwiZm9jdXMiLCJzZW50ZW5jZVJlZ2V4IiwidG9rZW5zIiwic3BsaXQiLCJmaWx0ZXIiLCJCb29sZWFuIiwic2VudGVuY2VzIiwiaSIsInNlbnRlbmNlIiwicHVzaCIsInR5cGVTZW50ZW5jZSIsInNldE5hdGl2ZVZhbHVlIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiZW1pdCIsImxhc3RWYWx1ZSIsImV2ZW50IiwiRXZlbnQiLCJ0YXJnZXQiLCJzaW11bGF0ZWQiLCJ0cmFja2VyIiwiX3ZhbHVlVHJhY2tlciIsInNldFZhbHVlIiwiZXZlbnROYW1lIiwiZGV0YWlsIiwiX29iamVjdFNwcmVhZCIsIndhcm4iLCJzZXJpYWxpemVTdGF0ZVZhbHVlIiwic3RhdGVWYWx1ZSIsIk9iamVjdCIsImtleXMiLCJtYXAiLCJqb2luIiwiREVCVUciLCJsb2dnZXIiLCJkZWJ1ZyIsIl9jb25zb2xlIiwiX2xlbiIsImFyZ3MiLCJBcnJheSIsIl9rZXkiLCJhcHBseSIsImluZm8iLCJfY29uc29sZTIiLCJfbGVuMiIsIl9rZXkyIiwiX2NvbnNvbGUzIiwiX2xlbjMiLCJfa2V5MyIsImludGVycHJldCIsIm1hY2hpbmUiLCJvblRyYW5zaXRpb24iLCJzdGF0ZSIsImNoYW5nZWQiLCJmcm9tU3RhdGUiLCJoaXN0b3J5IiwidG9TdGF0ZSIsInN0YXJ0IiwiaXNNb2JpbGVEZXZpY2UiLCJ0ZXN0IiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwibWF0Y2hlcyIsInVzZXJWaWV3UHJlZmVyZW5jZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJwcmVmZXJzTW9iaWxlIiwic2V0SXRlbSIsImF0dGFjaENhbGxCdXR0b24iLCJkZXRhY2hDYWxsQnV0dG9uIiwiYWRkVXNlckFnZW50RmxhZ3MiLCJpc0ZpcmVmb3hBbmRyb2lkIiwiYWRkRGV2aWNlRmxhZ3MiLCJhZGRWaWV3RmxhZ3MiLCJpbml0TW9kZSIsIl9yZWdlbmVyYXRvclJ1bnRpbWUiLCJleHBvcnRzIiwiT3AiLCJwcm90b3R5cGUiLCJoYXNPd24iLCJkZWZpbmVQcm9wZXJ0eSIsIm9iaiIsImRlc2MiLCIkU3ltYm9sIiwiU3ltYm9sIiwiaXRlcmF0b3JTeW1ib2wiLCJpdGVyYXRvciIsImFzeW5jSXRlcmF0b3JTeW1ib2wiLCJhc3luY0l0ZXJhdG9yIiwidG9TdHJpbmdUYWdTeW1ib2wiLCJ0b1N0cmluZ1RhZyIsImRlZmluZSIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsIndyYXAiLCJpbm5lckZuIiwib3V0ZXJGbiIsInNlbGYiLCJ0cnlMb2NzTGlzdCIsInByb3RvR2VuZXJhdG9yIiwiR2VuZXJhdG9yIiwiZ2VuZXJhdG9yIiwiY3JlYXRlIiwiY29udGV4dCIsIkNvbnRleHQiLCJtYWtlSW52b2tlTWV0aG9kIiwidHJ5Q2F0Y2giLCJmbiIsImFyZyIsImNhbGwiLCJDb250aW51ZVNlbnRpbmVsIiwiR2VuZXJhdG9yRnVuY3Rpb24iLCJHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSIsIkl0ZXJhdG9yUHJvdG90eXBlIiwiZ2V0UHJvdG8iLCJnZXRQcm90b3R5cGVPZiIsIk5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlIiwidmFsdWVzIiwiR3AiLCJkZWZpbmVJdGVyYXRvck1ldGhvZHMiLCJtZXRob2QiLCJfaW52b2tlIiwiQXN5bmNJdGVyYXRvciIsIlByb21pc2VJbXBsIiwiaW52b2tlIiwicmVzb2x2ZSIsInJlamVjdCIsInJlY29yZCIsInJlc3VsdCIsIl90eXBlb2YiLCJfX2F3YWl0IiwidGhlbiIsInVud3JhcHBlZCIsInByZXZpb3VzUHJvbWlzZSIsImNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnIiwiRXJyb3IiLCJkZWxlZ2F0ZSIsImRlbGVnYXRlUmVzdWx0IiwibWF5YmVJbnZva2VEZWxlZ2F0ZSIsInNlbnQiLCJfc2VudCIsImRpc3BhdGNoRXhjZXB0aW9uIiwiYWJydXB0IiwibWV0aG9kTmFtZSIsIlR5cGVFcnJvciIsInJlc3VsdE5hbWUiLCJuZXh0IiwibmV4dExvYyIsInB1c2hUcnlFbnRyeSIsImxvY3MiLCJlbnRyeSIsInRyeUxvYyIsImNhdGNoTG9jIiwiZmluYWxseUxvYyIsImFmdGVyTG9jIiwidHJ5RW50cmllcyIsInJlc2V0VHJ5RW50cnkiLCJjb21wbGV0aW9uIiwicmVzZXQiLCJpdGVyYWJsZSIsIml0ZXJhdG9yTWV0aG9kIiwiaXNOYU4iLCJkaXNwbGF5TmFtZSIsImlzR2VuZXJhdG9yRnVuY3Rpb24iLCJnZW5GdW4iLCJjdG9yIiwiY29uc3RydWN0b3IiLCJuYW1lIiwibWFyayIsInNldFByb3RvdHlwZU9mIiwiX19wcm90b19fIiwiYXdyYXAiLCJhc3luYyIsIlByb21pc2UiLCJpdGVyIiwidmFsIiwib2JqZWN0IiwicmV2ZXJzZSIsInBvcCIsInNraXBUZW1wUmVzZXQiLCJwcmV2IiwiY2hhckF0Iiwic2xpY2UiLCJzdG9wIiwicm9vdFJlY29yZCIsInJ2YWwiLCJleGNlcHRpb24iLCJoYW5kbGUiLCJsb2MiLCJjYXVnaHQiLCJoYXNDYXRjaCIsImhhc0ZpbmFsbHkiLCJmaW5hbGx5RW50cnkiLCJjb21wbGV0ZSIsImZpbmlzaCIsIl9jYXRjaCIsInRocm93biIsImRlbGVnYXRlWWllbGQiLCJvIiwiYWxsb3dBcnJheUxpa2UiLCJpdCIsImlzQXJyYXkiLCJfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkiLCJGIiwiX2UiLCJub3JtYWxDb21wbGV0aW9uIiwiZGlkRXJyIiwic3RlcCIsIl9lMiIsIm1pbkxlbiIsIl9hcnJheUxpa2VUb0FycmF5IiwidG9TdHJpbmciLCJmcm9tIiwiYXJyIiwibGVuIiwiYXJyMiIsImFzeW5jR2VuZXJhdG9yU3RlcCIsImdlbiIsIl9uZXh0IiwiX3Rocm93IiwiX2FzeW5jVG9HZW5lcmF0b3IiLCJzZXJ2ZXJDb25maWciLCJfY2FsbGVlIiwiYXVkaW9Nb2R1bGVVcmwiLCJwYWdlU2NyaXB0IiwicmVzcG9uc2UiLCJpbmplY3RTY3JpcHQiLCJzZXR1cEV2ZW50QnVzIiwiYW5ub3RhdGVET00iLCJhZGRJZFByb21wdEFuY2VzdG9yIiwiYWRkSWRTdWJtaXRCdXR0b24iLCJhZGRJZEZvb3RlciIsImFkZElkQXVkaW9Db250cm9scyIsImFkZElkQXVkaW9PdXRwdXRCdXR0b24iLCJhZGRUYWxrQnV0dG9uIiwiX2NhbGxlZSQiLCJfY29udGV4dCIsIl9hZGRUYWxrQnV0dG9uIiwicGFuZWwiLCJjbGFzc05hbWVzIiwiX2FkZElkQXVkaW9PdXRwdXRCdXR0IiwiYXVkaW9CdXR0b24iLCJxdWVyeVNlbGVjdG9yIiwiX2FkZElkQXVkaW9Db250cm9scyIsImF1ZGlvRWxlbWVudHMiLCJmb3VuZCIsImF1ZGlvIiwibmV4dERpdiIsIm5leHRFbGVtZW50U2libGluZyIsInRhZ05hbWUiLCJ0b0xvd2VyQ2FzZSIsIl9hZGRJZEZvb3RlciIsInByZWNlZGluZ0RpdiIsInByZXZpb3VzRWxlbWVudFNpYmxpbmciLCJsYXN0RWxlbWVudENoaWxkIiwiX2FkZElkU3VibWl0QnV0dG9uIiwic3VibWl0QnV0dG9ucyIsImxhc3RTdWJtaXRCdXR0b24iLCJfYWRkSWRQcm9tcHRBbmNlc3RvciIsInBhcmVudCIsInBhcmVudEVsZW1lbnQiLCJfYW5ub3RhdGVET00iLCJwcm9tcHQiLCJmb3VuZEZvb3RlciIsImZvdW5kQXVkaW9Db250cm9scyIsInByb21wdENvbnRyb2xzQ29udGFpbmVyIiwiZm91bmRQcm9tcHRBbmNlc3RvciIsImZvdW5kQXVkaW9PdXRwdXRCdXR0b24iLCJfc2V0dXBFdmVudEJ1cyIsIkdNX2luZm8iLCJzY3JpcHRIYW5kbGVyIiwidW5zYWZlV2luZG93IiwiX2luamVjdFNjcmlwdCIsInNjcmlwdEVsZW1lbnQiLCJmZXRjaCIsIm9rIiwic3RhdHVzVGV4dCIsInQwIiwiYWRkZWROb2RlcyIsIm5vZGUiLCJub2RlTmFtZSIsImhhc0F0dHJpYnV0ZSIsImRpc2Nvbm5lY3QiLCJ0ZXh0YXJlYXMiLCJpbml0QXVkaW9PdXRwdXRMaXN0ZW5lciIsImNoZWNrRm9yUmVzdG9yZVBvaW50IiwiY2hpbGRMaXN0Iiwic3VidHJlZSJdLCJzb3VyY2VSb290IjoiIn0=