// ==UserScript==
// @name         Say, Pi
// @namespace    http://www.saypi.ai/
// @version      1.4.5
// @description  Speak to Pi with accurate, hands-free conversations powered by OpenAI's Whisper
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
  /* Pi controls: mute/unmute */
  /* fix an alignment issue with the "new ui layout" */
}
html.mobile-view #saypi-panel,
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
}`, "",{"version":3,"sources":["webpack://./src/styles/mobile.scss"],"names":[],"mappings":"AAAA;EA8BE,uCAAA;EAMA,6BAAA;EAiBA,oDAAA;AAjDF;AAHE;;EAEE,WAAA;EACA,eAAA;EACA,OAAA;EACA,2CAAA;EAEA,aAAA;EACA,MAAA;AAIJ;AADE;EACE,WAAA;EACA,YAAA;EACA,6BAAA;EACA,gBAAA;EACA,SAAA;AAGJ;AAAE;EACE,YAAA;EACA,6BAAA;AAEJ;AADI;EACE,UAAA;EACA,YAAA;EACA,YAAA;AAGN;AAEE;;EAEE,qBAAA;AAAJ;AAIE;EACE,2BAAA;EAIA,0BAAA;AALJ;AAEI;EACE,aAAA;AAAN;AAGI;EACE,8BAAA;EACA,WAAA;EACA,mCAAA;AADN;AAEM;EACE,aAAA;AAAR;AAME;EACE,cAAA;AAJJ;AAOE;EACE,aAAA;AALJ;AAQE;EACE,aAAA;AANJ;AASE;EACE,mDAAA;EACA,iDAAA;EACA,aAAA;EACA,oFAAA;AAPJ;AAUE;EACE,aAAA;AARJ;AAWE;EACE,eAAA;EACA,YAAA;EACA,OAAA;EACA,QAAA;EACA,YAAA;EACA,aAAA;EACA,cAAA;EACA,YAAA;EACA,SAAA;EACA,WAAA;AATJ","sourcesContent":["html.mobile-view {\n  #saypi-panel,\n  .notification {\n    width: 100%;\n    position: fixed;\n    left: 0;\n    background-color: rgba(245, 238, 223, 0.98);\n\n    height: 100vh;\n    top: 0;\n  }\n\n  #saypi-talkButton {\n    width: 100%;\n    height: 100%;\n    background-color: transparent;\n    border-radius: 0;\n    margin: 0;\n  }\n\n  #saypi-notification {\n    z-index: 100;\n    background-color: transparent;\n    svg {\n      width: 75%;\n      height: 100%;\n      margin: auto;\n    }\n  }\n\n  /* Pi controls: ellipsis, experiences */\n  #__next > main > div > div > div.fixed.top-4.right-6 > button,\n  #saypi-experiences-button {\n    transform: scale(1.5);\n  }\n\n  /* Pi controls: mute/unmute */\n  #saypi-audio-controls {\n    /* hide the voice options */\n    div.p-1 {\n      display: none;\n    }\n    /* scale the mute button */\n    button.group {\n      transform: scale(2) !important;\n      z-index: 50;\n      /* hide the voice selector twisty */\n      + button {\n        display: none;\n      }\n    }\n  }\n\n  /* fix an alignment issue with the \"new ui layout\" */\n  .text-body-chat-m {\n    padding-top: 0;\n  }\n\n  #saypi-enterButton {\n    display: none;\n  }\n\n  #saypi-footer {\n    display: none;\n  }\n\n  #saypi-prompt-ancestor {\n    /* hides the row containing the text area control */\n    /* important: hides virtual keyboard on android */\n    display: none;\n    /* the call button, usually nested in the prompt, is detached while in mobile view */\n  }\n\n  #saypi-submitButton {\n    display: none;\n  }\n\n  #saypi-callButton {\n    position: fixed;\n    bottom: 4rem;\n    left: 0;\n    right: 0;\n    margin: auto;\n    width: 4.5rem;\n    height: 4.5rem;\n    padding: 6px;\n    border: 0;\n    z-index: 80;\n  }\n}\n"],"sourceRoot":""}]);
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
function uploadAudioWithRetry(audioBlob, audioDurationMillis, maxRetries = 3) {
    return __awaiter(this, void 0, void 0, function* () {
        let retryCount = 0;
        let delay = 1000; // initial delay of 1 second
        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        while (retryCount < maxRetries) {
            try {
                transcriptionSent();
                yield uploadAudio(audioBlob, audioDurationMillis);
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
function uploadAudio(audioBlob, audioDurationMillis) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const formData = constructTranscriptionFormData(audioBlob);
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
            if (responseJson.pFinishedSpeaking) {
                payload.pFinishedSpeaking = responseJson.pFinishedSpeaking;
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
function constructTranscriptionFormData(audioBlob) {
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
    formData.append("sequenceNumber", sequenceNum.toString());
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
exports.machine = void 0;
const ButtonModule_js_1 = __webpack_require__(/*! ../ButtonModule.js */ "./src/ButtonModule.js");
const xstate_1 = __webpack_require__(/*! xstate */ "./node_modules/xstate/es/index.js");
const AnimationModule_js_1 = __importDefault(__webpack_require__(/*! ../AnimationModule.js */ "./src/AnimationModule.js"));
const UserAgentModule_js_1 = __webpack_require__(/*! ../UserAgentModule.js */ "./src/UserAgentModule.js");
const TranscriptionModule_1 = __webpack_require__(/*! ../TranscriptionModule */ "./src/TranscriptionModule.ts");
const EventBus_1 = __importDefault(__webpack_require__(/*! ../EventBus */ "./src/EventBus.js"));
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
            (0, TranscriptionModule_1.uploadAudioWithRetry)(audioBlob, event.duration);
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
                return event.blob !== undefined && event.duration > 0;
            }
            return false;
        },
        hasNoAudio: (context, event) => {
            if (event.type === "saypi:userStoppedSpeaking") {
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
            if (event.type !== "saypi:transcribed") {
                return 0;
            }
            const maxDelay = 10000; // 10 seconds in milliseconds
            // Get the current time (in milliseconds)
            const currentTime = new Date().getTime();
            // Calculate the time elapsed since the user stopped speaking (in milliseconds)
            const timeElapsed = currentTime - context.timeUserStoppedSpeaking;
            // Calculate the initial delay based on pFinishedSpeaking
            let probability = 1;
            if (event.pFinishedSpeaking !== undefined) {
                probability = event.pFinishedSpeaking;
            }
            const initialDelay = (1 - probability) * maxDelay;
            // Calculate the final delay after accounting for the time already elapsed
            const finalDelay = Math.max(initialDelay - timeElapsed, 0);
            console.log("Waiting for", finalDelay / 1000, "seconds before submitting");
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
  apiServerUrl: "https://api.saypi.ai"
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2F5cGkudXNlci5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDNkc7QUFDakI7QUFDNUYsOEJBQThCLG1GQUEyQixDQUFDLDRGQUFxQztBQUMvRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyw0RkFBNEYsTUFBTSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssTUFBTSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssTUFBTSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssTUFBTSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssTUFBTSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssTUFBTSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxPQUFPLFlBQVksTUFBTSxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sWUFBWSxNQUFNLEtBQUssS0FBSyxPQUFPLE1BQU0sS0FBSyxLQUFLLE9BQU8sTUFBTSxLQUFLLFlBQVksTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLEtBQUssTUFBTSxZQUFZLE1BQU0sTUFBTSxZQUFZLE1BQU0sTUFBTSxLQUFLLE1BQU0sWUFBWSxNQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sS0FBSyxNQUFNLFlBQVksTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLEtBQUssTUFBTSxZQUFZLE1BQU0sTUFBTSxZQUFZLE1BQU0sTUFBTSxLQUFLLE1BQU0sWUFBWSxNQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sWUFBWSxNQUFNLE1BQU0sWUFBWSxhQUFhLE1BQU0sS0FBSyxZQUFZLGFBQWEsTUFBTSxNQUFNLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FB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dUJBQXVCLENBQUMsQ0FBQztzQkFDNUMxWixzRUFBa0IsQ0FBQzJaLG9CQUFvQixDQUFDLENBQUM7c0JBQ3pDO29CQUNGO2tCQUNGO2dCQUNGLENBQUMsQ0FBQztjQUNKO1lBQ0Y7VUFBQyxTQUFBeFcsR0FBQTtZQUFBVixTQUFBLENBQUFXLENBQUEsQ0FBQUQsR0FBQTtVQUFBO1lBQUFWLFNBQUEsQ0FBQVksQ0FBQTtVQUFBO1FBQ0gsQ0FBQyxFQUVEO1FBQ01qQixNQUFNLEdBQUc7VUFBRUMsVUFBVSxFQUFFLEtBQUs7VUFBRXVYLFNBQVMsRUFBRSxJQUFJO1VBQUVDLE9BQU8sRUFBRTtRQUFLLENBQUMsRUFFcEU7UUFDTXJYLFFBQVEsR0FBRyxJQUFJYyxnQkFBZ0IsQ0FBQ3RDLFFBQVEsQ0FBQyxFQUUvQztRQUNBd0IsUUFBUSxDQUFDZSxPQUFPLENBQUM3RSxRQUFRLENBQUNzRyxJQUFJLEVBQUU1QyxNQUFNLENBQUM7UUF5SXZDO1FBQ0FJLFFBQVEsQ0FBQ2UsT0FBTyxDQUFDN0UsUUFBUSxFQUFFO1VBQUVrYixTQUFTLEVBQUUsSUFBSTtVQUFFQyxPQUFPLEVBQUU7UUFBSyxDQUFDLENBQUM7TUFBQztNQUFBO1FBQUEsT0FBQW5ELFFBQUEsQ0FBQXJELElBQUE7SUFBQTtFQUFBLEdBQUF1QyxPQUFBO0FBQUEsQ0FDaEUsR0FBRSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9zdHlsZXMvcmVjdGFuZ2xlcy5jc3MiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9zdHlsZXMvY29tbW9uLnNjc3MiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9zdHlsZXMvZGVza3RvcC5zY3NzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvc3R5bGVzL21vYmlsZS5zY3NzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9pY29ucy9jYWxsLnN2ZyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL2ljb25zL2V4aXQuc3ZnIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvaWNvbnMvaGFuZ3VwLnN2ZyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL2ljb25zL21heGltaXplLnN2ZyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL2ljb25zL211dGVkX21pY3JvcGhvbmUuc3ZnIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvaWNvbnMvcmVjdGFuZ2xlcy5zdmciLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9pY29ucy93YXZlZm9ybS5zdmciLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9zdHlsZXMvcmVjdGFuZ2xlcy5jc3M/OTc0NSIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3N0eWxlcy9jb21tb24uc2Nzcz8wNGMzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvc3R5bGVzL2Rlc2t0b3Auc2Nzcz9kYWQ3Iiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvc3R5bGVzL21vYmlsZS5zY3NzPzFjODMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL0RPTU1vZHVsZS50cyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL1N1Ym1pdEVycm9ySGFuZGxlci50cyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL1RyYW5zY3JpcHRpb25Nb2R1bGUudHMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9zdGF0ZS1tYWNoaW5lcy9TYXlQaU1hY2hpbmUudHMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvQWN0b3IuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvTWFjaGluZS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9TdGF0ZS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9TdGF0ZU5vZGUuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvX3ZpcnR1YWwvX3RzbGliLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL2FjdGlvblR5cGVzLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL2FjdGlvbnMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvYmVoYXZpb3JzLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL2NvbnN0YW50cy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9kZXZUb29scy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9lbnZpcm9ubWVudC5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9pbmRleC5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9pbnRlcnByZXRlci5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9pbnZva2VVdGlscy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9tYXBTdGF0ZS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9tYXRjaC5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9yZWdpc3RyeS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9zY2hlZHVsZXIuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvc2NoZW1hLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL3NlcnZpY2VTY29wZS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9zdGF0ZVV0aWxzLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL3R5cGVzLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL3V0aWxzLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvQW5pbWF0aW9uTW9kdWxlLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvQnV0dG9uTW9kdWxlLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvQ29uZmlnTW9kdWxlLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvRXZlbnRCdXMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9FdmVudE1vZHVsZS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL0xvZ2dpbmdNb2R1bGUuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9TdGF0ZU1hY2hpbmVTZXJ2aWNlLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvVXNlckFnZW50TW9kdWxlLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3NheXBpLmluZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGBAa2V5ZnJhbWVzIHB1bHNlX291dGVybW9zdCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkyKTtcbiAgfVxufVxuLm91dGVybW9zdCB7XG4gIGFuaW1hdGlvbjogcHVsc2Vfb3V0ZXJtb3N0IDVzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgcHVsc2Vfc2Vjb25kIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODU2KTtcbiAgfVxufVxuLnNlY29uZCB7XG4gIGFuaW1hdGlvbjogcHVsc2Vfc2Vjb25kIDVzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgcHVsc2VfdGhpcmQge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43OTIpO1xuICB9XG59XG4udGhpcmQge1xuICBhbmltYXRpb246IHB1bHNlX3RoaXJkIDVzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgcHVsc2VfZm91cnRoIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzI4KTtcbiAgfVxufVxuLmZvdXJ0aCB7XG4gIGFuaW1hdGlvbjogcHVsc2VfZm91cnRoIDVzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgcHVsc2VfZmlmdGgge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC42NjQpO1xuICB9XG59XG4uZmlmdGgge1xuICBhbmltYXRpb246IHB1bHNlX2ZpZnRoIDVzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgcHVsc2VfaW5uZXJtb3N0IHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNik7XG4gIH1cbn1cbi5pbm5lcm1vc3Qge1xuICBhbmltYXRpb246IHB1bHNlX2lubmVybW9zdCA1cyBpbmZpbml0ZTtcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xufVxuXG4vKiBwbGF5ZnVsIGFuaW1hdGlvbiB0byBpbmRpY2F0ZSBQaSBpcyBzcGVha2luZyAqL1xuQGtleWZyYW1lcyBzcGVha2luZ19vdXRlcm1vc3Qge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XG4gIH1cbiAgMjUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTk1KTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45KTtcbiAgfVxuICA3NSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44OTUpO1xuICB9XG59XG4ub3V0ZXJtb3N0LnBpU3BlYWtpbmcge1xuICBhbmltYXRpb246IHNwZWFraW5nX291dGVybW9zdCAycyBpbmZpbml0ZTtcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xufVxuXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX3NlY29uZCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcbiAgfVxuICAyNSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45OCkgcm90YXRlKC0xZGVnKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44Nykgcm90YXRlKDBkZWcpO1xuICB9XG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjg2NSkgcm90YXRlKDFkZWcpO1xuICB9XG59XG4uc2Vjb25kLnBpU3BlYWtpbmcge1xuICBhbmltYXRpb246IHNwZWFraW5nX3NlY29uZCAycyBpbmZpbml0ZTtcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xufVxuXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX3RoaXJkIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xuICB9XG4gIDI1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjk2NSkgcm90YXRlKC0yZGVnKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44NCkgcm90YXRlKDBkZWcpO1xuICB9XG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjgzNSkgcm90YXRlKDJkZWcpO1xuICB9XG59XG4udGhpcmQucGlTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfdGhpcmQgMnMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBzcGVha2luZ19mb3VydGgge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XG4gIH1cbiAgMjUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTUpIHJvdGF0ZSgtM2RlZyk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODEpIHJvdGF0ZSgwZGVnKTtcbiAgfVxuICA3NSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44MDUpIHJvdGF0ZSgzZGVnKTtcbiAgfVxufVxuLmZvdXJ0aC5waVNwZWFraW5nIHtcbiAgYW5pbWF0aW9uOiBzcGVha2luZ19mb3VydGggMnMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBzcGVha2luZ19maWZ0aCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcbiAgfVxuICAyNSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45MzUpIHJvdGF0ZSgtNGRlZyk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzgpIHJvdGF0ZSgwZGVnKTtcbiAgfVxuICA3NSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43NzUpIHJvdGF0ZSg0ZGVnKTtcbiAgfVxufVxuLmZpZnRoLnBpU3BlYWtpbmcge1xuICBhbmltYXRpb246IHNwZWFraW5nX2ZpZnRoIDJzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgc3BlYWtpbmdfaW5uZXJtb3N0IHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xuICB9XG4gIDI1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkyKSByb3RhdGUoLTVkZWcpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjc1KSByb3RhdGUoMGRlZyk7XG4gIH1cbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzQ1KSByb3RhdGUoNWRlZyk7XG4gIH1cbn1cbi5pbm5lcm1vc3QucGlTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfaW5uZXJtb3N0IDJzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbi8qIHdhdmUgYW5pbWF0aW9uIHRvIGluZGljYXRlIHVzZXIgaXMgc3BlYWtpbmcgKi9cbkBrZXlmcmFtZXMgdXNlclNwZWFraW5nQW5pbWF0aW9uIHtcbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjA1KSBzY2FsZVgodmFyKC0td2lkdGgtZmFjdG9yKSlcbiAgICAgIHRyYW5zbGF0ZVgoY2FsYygtNTAlICsgdmFyKC0tc3ByZWFkLWFtb3VudCkpKTtcbiAgfVxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgxKSBzY2FsZVgodmFyKC0td2lkdGgtZmFjdG9yKSlcbiAgICAgIHRyYW5zbGF0ZVgoY2FsYygtNTAlICsgdmFyKC0tc3ByZWFkLWFtb3VudCkpKTtcbiAgfVxufVxuLyogdXNlciBzcGVha2luZyBvc2NpbGxhdGlvbiBhbmltYXRpb24gKi9cbkBrZXlmcmFtZXMgd2F2ZWZvcm1fb3V0ZXJtb3N0IHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDEpIHNjYWxlWCgxKTtcbiAgfVxuICAyNSUsXG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC45KSBzY2FsZVgoMC45KTtcbiAgfVxufVxuXG5Aa2V5ZnJhbWVzIHdhdmVmb3JtX3NlY29uZCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjkpIHNjYWxlWCgwLjkpO1xuICB9XG4gIDI1JSxcbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjgpIHNjYWxlWCgwLjgpO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgd2F2ZWZvcm1fdGhpcmQge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC44KSBzY2FsZVgoMC44KTtcbiAgfVxuICAyNSUsXG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC43KSBzY2FsZVgoMC43KTtcbiAgfVxufVxuXG5Aa2V5ZnJhbWVzIHdhdmVmb3JtX2ZvdXJ0aCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjcpIHNjYWxlWCgwLjcpO1xuICB9XG4gIDI1JSxcbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjYpIHNjYWxlWCgwLjYpO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgd2F2ZWZvcm1fZmlmdGgge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC42KSBzY2FsZVgoMC42KTtcbiAgfVxuICAyNSUsXG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC41KSBzY2FsZVgoMC41KTtcbiAgfVxufVxuXG5Aa2V5ZnJhbWVzIHdhdmVmb3JtX2lubmVybW9zdCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjUpIHNjYWxlWCgwLjUpO1xuICB9XG4gIDI1JSxcbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjQpIHNjYWxlWCgwLjQpO1xuICB9XG59XG5cbi5vdXRlcm1vc3QudXNlclNwZWFraW5nIHtcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV9vdXRlcm1vc3QgMC43cyBpbmZpbml0ZSBhbHRlcm5hdGU7XG59XG5cbi5zZWNvbmQudXNlclNwZWFraW5nIHtcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV9zZWNvbmQgMC42NXMgaW5maW5pdGUgYWx0ZXJuYXRlO1xufVxuXG4udGhpcmQudXNlclNwZWFraW5nIHtcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV90aGlyZCAwLjZzIGluZmluaXRlIGFsdGVybmF0ZTtcbn1cblxuLmZvdXJ0aC51c2VyU3BlYWtpbmcge1xuICBhbmltYXRpb246IHdhdmVmb3JtX2ZvdXJ0aCAwLjU1cyBpbmZpbml0ZSBhbHRlcm5hdGU7XG59XG5cbi5maWZ0aC51c2VyU3BlYWtpbmcge1xuICBhbmltYXRpb246IHdhdmVmb3JtX2ZpZnRoIDAuNXMgaW5maW5pdGUgYWx0ZXJuYXRlO1xufVxuXG4uaW5uZXJtb3N0LnVzZXJTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogd2F2ZWZvcm1faW5uZXJtb3N0IDAuNDVzIGluZmluaXRlIGFsdGVybmF0ZTtcbn1cblxuLyogZmxpcGNhcmQgYW5pbWF0aW9uIHRvIGluZGljYXRlIFNheSwgUGkgaXMgdHJhbnNjcmliaW5nIGF1ZGlvIHRvIHRleHQgKi9cbkBrZXlmcmFtZXMgdHJhbnNjcmliaW5nRmxpcCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZVkoMGRlZyk7XG4gICAgZmlsbDogdmFyKC0tb3JpZ2luYWwtY29sb3IpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGVZKDE4MGRlZyk7XG4gICAgZmlsbDogdmFyKC0tdHJhbnNjcmliaW5nLWNvbG9yKTtcbiAgfVxufVxuXG4ub3V0ZXJtb3N0LnRyYW5zY3JpYmluZyB7XG4gIC0tb3JpZ2luYWwtY29sb3I6ICNlNGYyZDE7XG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjYjNlMGZlO1xuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMS41cyBpbmZpbml0ZTtcbn1cblxuLnNlY29uZC50cmFuc2NyaWJpbmcge1xuICAtLW9yaWdpbmFsLWNvbG9yOiAjY2NlOGI1O1xuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogIzg5YzJmZjtcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDEuNnMgaW5maW5pdGU7XG59XG5cbi50aGlyZC50cmFuc2NyaWJpbmcge1xuICAtLW9yaWdpbmFsLWNvbG9yOiAjYjNkYjk1O1xuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogIzVmYTRmZjtcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDEuN3MgaW5maW5pdGU7XG59XG5cbi5mb3VydGgudHJhbnNjcmliaW5nIHtcbiAgLS1vcmlnaW5hbC1jb2xvcjogIzliZDA3ODtcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICMzNTg2ZmY7XG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAxLjhzIGluZmluaXRlO1xufVxuXG4uZmlmdGgudHJhbnNjcmliaW5nIHtcbiAgLS1vcmlnaW5hbC1jb2xvcjogIzgzYzU1YztcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICMwYjY5ZTM7XG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAxLjlzIGluZmluaXRlO1xufVxuXG4uaW5uZXJtb3N0LnRyYW5zY3JpYmluZyB7XG4gIC0tb3JpZ2luYWwtY29sb3I6ICM0MjhhMmY7XG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjMDA1M2JmO1xuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMnMgaW5maW5pdGU7XG59XG5cbi8qIGhlYXJ0YmVhdCBhbmltYXRpb24gdG8gaW5kaWNhdGUgUGkgaXMgcHJlcGFyaW5nIHRvIHNwZWFrICovXG5Aa2V5ZnJhbWVzIGhlYXJ0YmVhdCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICBvcGFjaXR5OiAxO1xuICAgIGZpbGw6IHZhcigtLW9yaWdpbmFsLWNvbG9yKTtcbiAgfVxuICA1MCUge1xuICAgIG9wYWNpdHk6IDAuNTtcbiAgICBmaWxsOiByZ2IoMjQ1IDIzOCAyMjMpOyAvKiBiZy1jcmVhbS01NTAgKi9cbiAgfVxufVxuXG4vKiB0b25lZC1kb3duIGRpc3NhcnkgYW5pbWF0aW9uIHRvIGluZGljYXRlIGFuIGVycm9yICovXG4vKiB0b25lZC1kb3duIGVycm9yIGFuaW1hdGlvbiB3aXRoIHJlZHVjZWQgb3BhY2l0eSAqL1xuQGtleWZyYW1lcyBlcnJvckFuaW1hdGlvbiB7XG4gIDAlIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKSB0cmFuc2xhdGUoMCUsIDAlKTtcbiAgfVxuICAyNSUge1xuICAgIHRyYW5zZm9ybTogcm90YXRlKC01ZGVnKSB0cmFuc2xhdGUoLTUlLCA1JSk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSg1ZGVnKSB0cmFuc2xhdGUoNSUsIC01JSk7XG4gIH1cbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgtNWRlZykgdHJhbnNsYXRlKC01JSwgNSUpO1xuICB9XG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpIHRyYW5zbGF0ZSgwJSwgMCUpO1xuICB9XG59XG5cbi5vdXRlcm1vc3QuZXJyb3Ige1xuICBhbmltYXRpb246IGVycm9yQW5pbWF0aW9uIDI1cyAxO1xuICBmaWxsOiAjZmYwMDAwO1xuICBmaWxsLW9wYWNpdHk6IDAuNztcbn1cblxuLnNlY29uZC5lcnJvciB7XG4gIGFuaW1hdGlvbjogZXJyb3JBbmltYXRpb24gMjVzIDE7XG4gIGZpbGw6ICNmZjMzMDA7XG4gIGZpbGwtb3BhY2l0eTogMC43O1xufVxuXG4udGhpcmQuZXJyb3Ige1xuICBhbmltYXRpb246IGVycm9yQW5pbWF0aW9uIDI1cyAxO1xuICBmaWxsOiAjZmY2NjAwO1xuICBmaWxsLW9wYWNpdHk6IDAuNztcbn1cblxuLmZvdXJ0aC5lcnJvciB7XG4gIGFuaW1hdGlvbjogZXJyb3JBbmltYXRpb24gMjVzIDE7XG4gIGZpbGw6ICNmZjk5MDA7XG4gIGZpbGwtb3BhY2l0eTogMC43O1xufVxuXG4uZmlmdGguZXJyb3Ige1xuICBhbmltYXRpb246IGVycm9yQW5pbWF0aW9uIDI1cyAxO1xuICBmaWxsOiAjZmZjYzAwO1xuICBmaWxsLW9wYWNpdHk6IDAuNztcbn1cblxuLmlubmVybW9zdC5lcnJvciB7XG4gIGFuaW1hdGlvbjogZXJyb3JBbmltYXRpb24gMjVzIDE7XG4gIGZpbGw6ICNmZmZmMDA7XG4gIGZpbGwtb3BhY2l0eTogMC43O1xufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGVzL3JlY3RhbmdsZXMuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0U7O0lBRUUsbUJBQW1CO0VBQ3JCO0VBQ0E7SUFDRSxzQkFBc0I7RUFDeEI7QUFDRjtBQUNBO0VBQ0Usc0NBQXNDO0VBQ3RDLHdCQUF3QjtBQUMxQjs7QUFFQTtFQUNFOztJQUVFLG1CQUFtQjtFQUNyQjtFQUNBO0lBQ0UsdUJBQXVCO0VBQ3pCO0FBQ0Y7QUFDQTtFQUNFLG1DQUFtQztFQUNuQyx3QkFBd0I7QUFDMUI7O0FBRUE7RUFDRTs7SUFFRSxtQkFBbUI7RUFDckI7RUFDQTtJQUNFLHVCQUF1QjtFQUN6QjtBQUNGO0FBQ0E7RUFDRSxrQ0FBa0M7RUFDbEMsd0JBQXdCO0FBQzFCOztBQUVBO0VBQ0U7O0lBRUUsbUJBQW1CO0VBQ3JCO0VBQ0E7SUFDRSx1QkFBdUI7RUFDekI7QUFDRjtBQUNBO0VBQ0UsbUNBQW1DO0VBQ25DLHdCQUF3QjtBQUMxQjs7QUFFQTtFQUNFOztJQUVFLG1CQUFtQjtF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QUNFLHlCQUF5QjtFQUN6Qiw2QkFBNkI7RUFDN0IseUNBQXlDO0FBQzNDOztBQUVBO0VBQ0UseUJBQXlCO0VBQ3pCLDZCQUE2QjtFQUM3Qix5Q0FBeUM7QUFDM0M7O0FBRUE7RUFDRSx5QkFBeUI7RUFDekIsNkJBQTZCO0VBQzdCLHlDQUF5QztBQUMzQzs7QUFFQTtFQUNFLHlCQUF5QjtFQUN6Qiw2QkFBNkI7RUFDN0IsdUNBQXVDO0FBQ3pDOztBQUVBLDZEQUE2RDtBQUM3RDtFQUNFOztJQUVFLFVBQVU7SUFDViwyQkFBMkI7RUFDN0I7RUFDQTtJQUNFLFlBQVk7SUFDWixzQkFBc0IsRUFBRSxpQkFBaUI7RUFDM0M7QUFDRjs7QUFFQSxzREFBc0Q7QUFDdEQsb0RBQW9EO0FBQ3BEO0VBQ0U7SUFDRSx5Q0FBeUM7RUFDM0M7RUFDQTtJQUNFLDJDQUEyQztFQUM3QztFQUNBO0lBQ0UsMENBQTBDO0VBQzVDO0VBQ0E7SUFDRSwyQ0FBMkM7RUFDN0M7RUFDQTtJQUNFLHlDQUF5QztFQUMzQztBQUNGOztBQUVBO0VBQ0UsK0JBQStCO0VBQy9CLGFBQWE7RUFDYixpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSwrQkFBK0I7RUFDL0IsYUFBYTtFQUNiLGlCQUFpQjtBQUNuQjs7QUFFQTtFQUNFLCtCQUErQjtFQUMvQixhQUFhO0VBQ2IsaUJBQWlCO0FBQ25COztBQUVBO0VBQ0UsK0JBQStCO0VBQy9CLGFBQWE7RUFDYixpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSwrQkFBK0I7RUFDL0IsYUFBYTtFQUNiLGlCQUFpQjtBQUNuQjs7QUFFQTtFQUNFLCtCQUErQjtFQUMvQixhQUFhO0VBQ2IsaUJBQWlCO0FBQ25CXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIkBrZXlmcmFtZXMgcHVsc2Vfb3V0ZXJtb3N0IHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTIpO1xcbiAgfVxcbn1cXG4ub3V0ZXJtb3N0IHtcXG4gIGFuaW1hdGlvbjogcHVsc2Vfb3V0ZXJtb3N0IDVzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHB1bHNlX3NlY29uZCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjg1Nik7XFxuICB9XFxufVxcbi5zZWNvbmQge1xcbiAgYW5pbWF0aW9uOiBwdWxzZV9zZWNvbmQgNXMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbkBrZXlmcmFtZXMgcHVsc2VfdGhpcmQge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43OTIpO1xcbiAgfVxcbn1cXG4udGhpcmQge1xcbiAgYW5pbWF0aW9uOiBwdWxzZV90aGlyZCA1cyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBwdWxzZV9mb3VydGgge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43MjgpO1xcbiAgfVxcbn1cXG4uZm91cnRoIHtcXG4gIGFuaW1hdGlvbjogcHVsc2VfZm91cnRoIDVzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHB1bHNlX2ZpZnRoIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNjY0KTtcXG4gIH1cXG59XFxuLmZpZnRoIHtcXG4gIGFuaW1hdGlvbjogcHVsc2VfZmlmdGggNXMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbkBrZXlmcmFtZXMgcHVsc2VfaW5uZXJtb3N0IHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNik7XFxuICB9XFxufVxcbi5pbm5lcm1vc3Qge1xcbiAgYW5pbWF0aW9uOiBwdWxzZV9pbm5lcm1vc3QgNXMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbi8qIHBsYXlmdWwgYW5pbWF0aW9uIHRvIGluZGljYXRlIFBpIGlzIHNwZWFraW5nICovXFxuQGtleWZyYW1lcyBzcGVha2luZ19vdXRlcm1vc3Qge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XFxuICB9XFxuICAyNSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTk1KTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45KTtcXG4gIH1cXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44OTUpO1xcbiAgfVxcbn1cXG4ub3V0ZXJtb3N0LnBpU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiBzcGVha2luZ19vdXRlcm1vc3QgMnMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbkBrZXlmcmFtZXMgc3BlYWtpbmdfc2Vjb25kIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgMjUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjk4KSByb3RhdGUoLTFkZWcpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjg3KSByb3RhdGUoMGRlZyk7XFxuICB9XFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODY1KSByb3RhdGUoMWRlZyk7XFxuICB9XFxufVxcbi5zZWNvbmQucGlTcGVha2luZyB7XFxuICBhbmltYXRpb246IHNwZWFraW5nX3NlY29uZCAycyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBzcGVha2luZ190aGlyZCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDI1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45NjUpIHJvdGF0ZSgtMmRlZyk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODQpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44MzUpIHJvdGF0ZSgyZGVnKTtcXG4gIH1cXG59XFxuLnRoaXJkLnBpU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiBzcGVha2luZ190aGlyZCAycyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBzcGVha2luZ19mb3VydGgge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XFxuICB9XFxuICAyNSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTUpIHJvdGF0ZSgtM2RlZyk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODEpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44MDUpIHJvdGF0ZSgzZGVnKTtcXG4gIH1cXG59XFxuLmZvdXJ0aC5waVNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfZm91cnRoIDJzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX2ZpZnRoIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgMjUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkzNSkgcm90YXRlKC00ZGVnKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43OCkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjc3NSkgcm90YXRlKDRkZWcpO1xcbiAgfVxcbn1cXG4uZmlmdGgucGlTcGVha2luZyB7XFxuICBhbmltYXRpb246IHNwZWFraW5nX2ZpZnRoIDJzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX2lubmVybW9zdCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDI1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45Mikgcm90YXRlKC01ZGVnKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43NSkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjc0NSkgcm90YXRlKDVkZWcpO1xcbiAgfVxcbn1cXG4uaW5uZXJtb3N0LnBpU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiBzcGVha2luZ19pbm5lcm1vc3QgMnMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbi8qIHdhdmUgYW5pbWF0aW9uIHRvIGluZGljYXRlIHVzZXIgaXMgc3BlYWtpbmcgKi9cXG5Aa2V5ZnJhbWVzIHVzZXJTcGVha2luZ0FuaW1hdGlvbiB7XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjA1KSBzY2FsZVgodmFyKC0td2lkdGgtZmFjdG9yKSlcXG4gICAgICB0cmFuc2xhdGVYKGNhbGMoLTUwJSArIHZhcigtLXNwcmVhZC1hbW91bnQpKSk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMSkgc2NhbGVYKHZhcigtLXdpZHRoLWZhY3RvcikpXFxuICAgICAgdHJhbnNsYXRlWChjYWxjKC01MCUgKyB2YXIoLS1zcHJlYWQtYW1vdW50KSkpO1xcbiAgfVxcbn1cXG4vKiB1c2VyIHNwZWFraW5nIG9zY2lsbGF0aW9uIGFuaW1hdGlvbiAqL1xcbkBrZXlmcmFtZXMgd2F2ZWZvcm1fb3V0ZXJtb3N0IHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDEpIHNjYWxlWCgxKTtcXG4gIH1cXG4gIDI1JSxcXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuOSkgc2NhbGVYKDAuOSk7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgd2F2ZWZvcm1fc2Vjb25kIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuOSkgc2NhbGVYKDAuOSk7XFxuICB9XFxuICAyNSUsXFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjgpIHNjYWxlWCgwLjgpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIHdhdmVmb3JtX3RoaXJkIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuOCkgc2NhbGVYKDAuOCk7XFxuICB9XFxuICAyNSUsXFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjcpIHNjYWxlWCgwLjcpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIHdhdmVmb3JtX2ZvdXJ0aCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjcpIHNjYWxlWCgwLjcpO1xcbiAgfVxcbiAgMjUlLFxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC42KSBzY2FsZVgoMC42KTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyB3YXZlZm9ybV9maWZ0aCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjYpIHNjYWxlWCgwLjYpO1xcbiAgfVxcbiAgMjUlLFxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC41KSBzY2FsZVgoMC41KTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyB3YXZlZm9ybV9pbm5lcm1vc3Qge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC41KSBzY2FsZVgoMC41KTtcXG4gIH1cXG4gIDI1JSxcXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNCkgc2NhbGVYKDAuNCk7XFxuICB9XFxufVxcblxcbi5vdXRlcm1vc3QudXNlclNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogd2F2ZWZvcm1fb3V0ZXJtb3N0IDAuN3MgaW5maW5pdGUgYWx0ZXJuYXRlO1xcbn1cXG5cXG4uc2Vjb25kLnVzZXJTcGVha2luZyB7XFxuICBhbmltYXRpb246IHdhdmVmb3JtX3NlY29uZCAwLjY1cyBpbmZpbml0ZSBhbHRlcm5hdGU7XFxufVxcblxcbi50aGlyZC51c2VyU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV90aGlyZCAwLjZzIGluZmluaXRlIGFsdGVybmF0ZTtcXG59XFxuXFxuLmZvdXJ0aC51c2VyU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV9mb3VydGggMC41NXMgaW5maW5pdGUgYWx0ZXJuYXRlO1xcbn1cXG5cXG4uZmlmdGgudXNlclNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogd2F2ZWZvcm1fZmlmdGggMC41cyBpbmZpbml0ZSBhbHRlcm5hdGU7XFxufVxcblxcbi5pbm5lcm1vc3QudXNlclNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogd2F2ZWZvcm1faW5uZXJtb3N0IDAuNDVzIGluZmluaXRlIGFsdGVybmF0ZTtcXG59XFxuXFxuLyogZmxpcGNhcmQgYW5pbWF0aW9uIHRvIGluZGljYXRlIFNheSwgUGkgaXMgdHJhbnNjcmliaW5nIGF1ZGlvIHRvIHRleHQgKi9cXG5Aa2V5ZnJhbWVzIHRyYW5zY3JpYmluZ0ZsaXAge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGVZKDBkZWcpO1xcbiAgICBmaWxsOiB2YXIoLS1vcmlnaW5hbC1jb2xvcik7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZVkoMTgwZGVnKTtcXG4gICAgZmlsbDogdmFyKC0tdHJhbnNjcmliaW5nLWNvbG9yKTtcXG4gIH1cXG59XFxuXFxuLm91dGVybW9zdC50cmFuc2NyaWJpbmcge1xcbiAgLS1vcmlnaW5hbC1jb2xvcjogI2U0ZjJkMTtcXG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjYjNlMGZlO1xcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDEuNXMgaW5maW5pdGU7XFxufVxcblxcbi5zZWNvbmQudHJhbnNjcmliaW5nIHtcXG4gIC0tb3JpZ2luYWwtY29sb3I6ICNjY2U4YjU7XFxuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogIzg5YzJmZjtcXG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAxLjZzIGluZmluaXRlO1xcbn1cXG5cXG4udGhpcmQudHJhbnNjcmliaW5nIHtcXG4gIC0tb3JpZ2luYWwtY29sb3I6ICNiM2RiOTU7XFxuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogIzVmYTRmZjtcXG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAxLjdzIGluZmluaXRlO1xcbn1cXG5cXG4uZm91cnRoLnRyYW5zY3JpYmluZyB7XFxuICAtLW9yaWdpbmFsLWNvbG9yOiAjOWJkMDc4O1xcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICMzNTg2ZmY7XFxuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMS44cyBpbmZpbml0ZTtcXG59XFxuXFxuLmZpZnRoLnRyYW5zY3JpYmluZyB7XFxuICAtLW9yaWdpbmFsLWNvbG9yOiAjODNjNTVjO1xcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICMwYjY5ZTM7XFxuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMS45cyBpbmZpbml0ZTtcXG59XFxuXFxuLmlubmVybW9zdC50cmFuc2NyaWJpbmcge1xcbiAgLS1vcmlnaW5hbC1jb2xvcjogIzQyOGEyZjtcXG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjMDA1M2JmO1xcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDJzIGluZmluaXRlO1xcbn1cXG5cXG4vKiBoZWFydGJlYXQgYW5pbWF0aW9uIHRvIGluZGljYXRlIFBpIGlzIHByZXBhcmluZyB0byBzcGVhayAqL1xcbkBrZXlmcmFtZXMgaGVhcnRiZWF0IHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIGZpbGw6IHZhcigtLW9yaWdpbmFsLWNvbG9yKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIG9wYWNpdHk6IDAuNTtcXG4gICAgZmlsbDogcmdiKDI0NSAyMzggMjIzKTsgLyogYmctY3JlYW0tNTUwICovXFxuICB9XFxufVxcblxcbi8qIHRvbmVkLWRvd24gZGlzc2FyeSBhbmltYXRpb24gdG8gaW5kaWNhdGUgYW4gZXJyb3IgKi9cXG4vKiB0b25lZC1kb3duIGVycm9yIGFuaW1hdGlvbiB3aXRoIHJlZHVjZWQgb3BhY2l0eSAqL1xcbkBrZXlmcmFtZXMgZXJyb3JBbmltYXRpb24ge1xcbiAgMCUge1xcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKSB0cmFuc2xhdGUoMCUsIDAlKTtcXG4gIH1cXG4gIDI1JSB7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlKC01ZGVnKSB0cmFuc2xhdGUoLTUlLCA1JSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSg1ZGVnKSB0cmFuc2xhdGUoNSUsIC01JSk7XFxuICB9XFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgtNWRlZykgdHJhbnNsYXRlKC01JSwgNSUpO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpIHRyYW5zbGF0ZSgwJSwgMCUpO1xcbiAgfVxcbn1cXG5cXG4ub3V0ZXJtb3N0LmVycm9yIHtcXG4gIGFuaW1hdGlvbjogZXJyb3JBbmltYXRpb24gMjVzIDE7XFxuICBmaWxsOiAjZmYwMDAwO1xcbiAgZmlsbC1vcGFjaXR5OiAwLjc7XFxufVxcblxcbi5zZWNvbmQuZXJyb3Ige1xcbiAgYW5pbWF0aW9uOiBlcnJvckFuaW1hdGlvbiAyNXMgMTtcXG4gIGZpbGw6ICNmZjMzMDA7XFxuICBmaWxsLW9wYWNpdHk6IDAuNztcXG59XFxuXFxuLnRoaXJkLmVycm9yIHtcXG4gIGFuaW1hdGlvbjogZXJyb3JBbmltYXRpb24gMjVzIDE7XFxuICBmaWxsOiAjZmY2NjAwO1xcbiAgZmlsbC1vcGFjaXR5OiAwLjc7XFxufVxcblxcbi5mb3VydGguZXJyb3Ige1xcbiAgYW5pbWF0aW9uOiBlcnJvckFuaW1hdGlvbiAyNXMgMTtcXG4gIGZpbGw6ICNmZjk5MDA7XFxuICBmaWxsLW9wYWNpdHk6IDAuNztcXG59XFxuXFxuLmZpZnRoLmVycm9yIHtcXG4gIGFuaW1hdGlvbjogZXJyb3JBbmltYXRpb24gMjVzIDE7XFxuICBmaWxsOiAjZmZjYzAwO1xcbiAgZmlsbC1vcGFjaXR5OiAwLjc7XFxufVxcblxcbi5pbm5lcm1vc3QuZXJyb3Ige1xcbiAgYW5pbWF0aW9uOiBlcnJvckFuaW1hdGlvbiAyNXMgMTtcXG4gIGZpbGw6ICNmZmZmMDA7XFxuICBmaWxsLW9wYWNpdHk6IDAuNztcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAuaGlkZGVuIHtcbiAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xufVxuXG4jc2F5cGktY2FsbEJ1dHRvbi5kaXNhYmxlZCBzdmcgcGF0aC5jaXJjbGUge1xuICBmaWxsOiByZ2IoMjQ1LCAyMzgsIDIyMyk7IC8qIGJnLWNyZWFtLTU1MCAqL1xufVxuXG4ubW9iaWxlLWRldmljZSB7XG4gIC8qIG1heGltaXplIChtb2JpbGUgdmlldykgYnV0dG9uIGlzIG9ubHkgZGlzcGxheWVkIG9uIGNvbXBhdGlibGUgZGV2aWNlcyAqL1xufVxuLm1vYmlsZS1kZXZpY2UgI3NheXBpLWVudGVyQnV0dG9uLFxuLm1vYmlsZS1kZXZpY2UgI3NheXBpLWV4aXRCdXR0b24ge1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHRvcDogNHJlbTtcbiAgbGVmdDogMS4yNXJlbTtcbiAgd2lkdGg6IDNyZW07XG4gIGhlaWdodDogM3JlbTtcbiAgcGFkZGluZzogNnB4O1xuICBib3JkZXI6IDA7XG4gIHotaW5kZXg6IDYwO1xufWAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlcy9jb21tb24uc2Nzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFLHdCQUFBO0FBQ0Y7O0FBRUE7RUFDRSx3QkFBQSxFQUFBLGlCQUFBO0FBQ0Y7O0FBRUE7RUFDRSwwRUFBQTtBQUNGO0FBQUU7O0VBRUUsZUFBQTtFQUNBLFNBQUE7RUFDQSxhQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7RUFDQSxZQUFBO0VBQ0EsU0FBQTtFQUNBLFdBQUE7QUFFSlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIuaGlkZGVuIHtcXG4gIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcXG59XFxuXFxuI3NheXBpLWNhbGxCdXR0b24uZGlzYWJsZWQgc3ZnIHBhdGguY2lyY2xlIHtcXG4gIGZpbGw6IHJnYigyNDUgMjM4IDIyMyk7IC8qIGJnLWNyZWFtLTU1MCAqL1xcbn1cXG5cXG4ubW9iaWxlLWRldmljZSB7XFxuICAvKiBtYXhpbWl6ZSAobW9iaWxlIHZpZXcpIGJ1dHRvbiBpcyBvbmx5IGRpc3BsYXllZCBvbiBjb21wYXRpYmxlIGRldmljZXMgKi9cXG4gICNzYXlwaS1lbnRlckJ1dHRvbixcXG4gICNzYXlwaS1leGl0QnV0dG9uIHtcXG4gICAgcG9zaXRpb246IGZpeGVkO1xcbiAgICB0b3A6IDRyZW07XFxuICAgIGxlZnQ6IDEuMjVyZW07XFxuICAgIHdpZHRoOiAzcmVtO1xcbiAgICBoZWlnaHQ6IDNyZW07XFxuICAgIHBhZGRpbmc6IDZweDtcXG4gICAgYm9yZGVyOiAwO1xcbiAgICB6LWluZGV4OiA2MDtcXG4gIH1cXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGBAa2V5ZnJhbWVzIHB1bHNlIHtcbiAgMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOSk7XG4gIH1cbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxufVxuaHRtbC5kZXNrdG9wLXZpZXcgI3NheXBpLXRhbGtCdXR0b24ge1xuICAvKiBub3QgbmVlZGVkIG9uIGRlc2t0b3Agd2l0aCBjYWxsIGJ1dHRvbiAqL1xuICBkaXNwbGF5OiBub25lO1xufVxuaHRtbC5kZXNrdG9wLXZpZXcgI3NheXBpLWNhbGxCdXR0b24ge1xuICBoZWlnaHQ6IDIuMjVyZW07XG4gIHdpZHRoOiAyLjI1cmVtO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIG1hcmdpbjogMC41cmVtIDAgMC41cmVtIDA7XG59XG5odG1sLmRlc2t0b3AtdmlldyAuc2F5cGktcHJvbXB0LWNvbnRhaW5lciB7XG4gIC8qIG1ha2Ugcm9vbSBpbiB0aGUgcHJvbXB0IHRleHQgYXJlYSBmb3IgdGhlIGNhbGwgYnV0dG9uICovXG4gIHBhZGRpbmctcmlnaHQ6IDA7XG59XG5odG1sLmRlc2t0b3AtdmlldyAjc2F5cGktbm90aWZpY2F0aW9uID4gc3ZnIHtcbiAgd2lkdGg6IDNyZW07XG4gIGhlaWdodDogM3JlbTtcbiAgYm90dG9tOiA0cmVtO1xuICByaWdodDogMTJyZW07XG4gIHBvc2l0aW9uOiBmaXhlZDtcbn1cbmh0bWwuZGVza3RvcC12aWV3ICNzYXlwaS1leGl0QnV0dG9uIHtcbiAgZGlzcGxheTogbm9uZTtcbn1gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvZGVza3RvcC5zY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUNFO0VBQ0U7SUFDRSxtQkFBQTtFQUFKO0VBRUU7SUFDRSxxQkFBQTtFQUFKO0VBRUU7SUFDRSxtQkFBQTtFQUFKO0FBQ0Y7QUFHRTtFQUNFLDJDQUFBO0VBQ0EsYUFBQTtBQURKO0FBSUU7RUFDRSxlQUFBO0VBQ0EsY0FBQTtFQUNBLGtCQUFBO0VBQ0EseUJBQUE7QUFGSjtBQUtFO0VBQ0UsMERBQUE7RUFDQSxnQkFBQTtBQUhKO0FBTUU7RUFDRSxXQUFBO0VBQ0EsWUFBQTtFQUNBLFlBQUE7RUFDQSxZQUFBO0VBQ0EsZUFBQTtBQUpKO0FBT0U7RUFDRSxhQUFBO0FBTEpcIixcInNvdXJjZXNDb250ZW50XCI6W1wiaHRtbC5kZXNrdG9wLXZpZXcge1xcbiAgQGtleWZyYW1lcyBwdWxzZSB7XFxuICAgIDAlIHtcXG4gICAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgICB9XFxuICAgIDUwJSB7XFxuICAgICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkpO1xcbiAgICB9XFxuICAgIDEwMCUge1xcbiAgICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICAgIH1cXG4gIH1cXG5cXG4gICNzYXlwaS10YWxrQnV0dG9uIHtcXG4gICAgLyogbm90IG5lZWRlZCBvbiBkZXNrdG9wIHdpdGggY2FsbCBidXR0b24gKi9cXG4gICAgZGlzcGxheTogbm9uZTtcXG4gIH1cXG5cXG4gICNzYXlwaS1jYWxsQnV0dG9uIHtcXG4gICAgaGVpZ2h0OiAyLjI1cmVtO1xcbiAgICB3aWR0aDogMi4yNXJlbTtcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgICBtYXJnaW46IDAuNXJlbSAwIDAuNXJlbSAwO1xcbiAgfVxcblxcbiAgLnNheXBpLXByb21wdC1jb250YWluZXIge1xcbiAgICAvKiBtYWtlIHJvb20gaW4gdGhlIHByb21wdCB0ZXh0IGFyZWEgZm9yIHRoZSBjYWxsIGJ1dHRvbiAqL1xcbiAgICBwYWRkaW5nLXJpZ2h0OiAwO1xcbiAgfVxcblxcbiAgI3NheXBpLW5vdGlmaWNhdGlvbiA+IHN2ZyB7XFxuICAgIHdpZHRoOiAzcmVtO1xcbiAgICBoZWlnaHQ6IDNyZW07XFxuICAgIGJvdHRvbTogNHJlbTtcXG4gICAgcmlnaHQ6IDEycmVtO1xcbiAgICBwb3NpdGlvbjogZml4ZWQ7XFxuICB9XFxuXFxuICAjc2F5cGktZXhpdEJ1dHRvbiB7XFxuICAgIGRpc3BsYXk6IG5vbmU7XFxuICB9XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgaHRtbC5tb2JpbGUtdmlldyB7XG4gIC8qIFBpIGNvbnRyb2xzOiBlbGxpcHNpcywgZXhwZXJpZW5jZXMgKi9cbiAgLyogUGkgY29udHJvbHM6IG11dGUvdW5tdXRlICovXG4gIC8qIGZpeCBhbiBhbGlnbm1lbnQgaXNzdWUgd2l0aCB0aGUgXCJuZXcgdWkgbGF5b3V0XCIgKi9cbn1cbmh0bWwubW9iaWxlLXZpZXcgI3NheXBpLXBhbmVsLFxuaHRtbC5tb2JpbGUtdmlldyAubm90aWZpY2F0aW9uIHtcbiAgd2lkdGg6IDEwMCU7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgbGVmdDogMDtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNDUsIDIzOCwgMjIzLCAwLjk4KTtcbiAgaGVpZ2h0OiAxMDB2aDtcbiAgdG9wOiAwO1xufVxuaHRtbC5tb2JpbGUtdmlldyAjc2F5cGktdGFsa0J1dHRvbiB7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICBib3JkZXItcmFkaXVzOiAwO1xuICBtYXJnaW46IDA7XG59XG5odG1sLm1vYmlsZS12aWV3ICNzYXlwaS1ub3RpZmljYXRpb24ge1xuICB6LWluZGV4OiAxMDA7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xufVxuaHRtbC5tb2JpbGUtdmlldyAjc2F5cGktbm90aWZpY2F0aW9uIHN2ZyB7XG4gIHdpZHRoOiA3NSU7XG4gIGhlaWdodDogMTAwJTtcbiAgbWFyZ2luOiBhdXRvO1xufVxuaHRtbC5tb2JpbGUtdmlldyAjX19uZXh0ID4gbWFpbiA+IGRpdiA+IGRpdiA+IGRpdi5maXhlZC50b3AtNC5yaWdodC02ID4gYnV0dG9uLFxuaHRtbC5tb2JpbGUtdmlldyAjc2F5cGktZXhwZXJpZW5jZXMtYnV0dG9uIHtcbiAgdHJhbnNmb3JtOiBzY2FsZSgxLjUpO1xufVxuaHRtbC5tb2JpbGUtdmlldyAjc2F5cGktYXVkaW8tY29udHJvbHMge1xuICAvKiBoaWRlIHRoZSB2b2ljZSBvcHRpb25zICovXG4gIC8qIHNjYWxlIHRoZSBtdXRlIGJ1dHRvbiAqL1xufVxuaHRtbC5tb2JpbGUtdmlldyAjc2F5cGktYXVkaW8tY29udHJvbHMgZGl2LnAtMSB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5odG1sLm1vYmlsZS12aWV3ICNzYXlwaS1hdWRpby1jb250cm9scyBidXR0b24uZ3JvdXAge1xuICB0cmFuc2Zvcm06IHNjYWxlKDIpICFpbXBvcnRhbnQ7XG4gIHotaW5kZXg6IDUwO1xuICAvKiBoaWRlIHRoZSB2b2ljZSBzZWxlY3RvciB0d2lzdHkgKi9cbn1cbmh0bWwubW9iaWxlLXZpZXcgI3NheXBpLWF1ZGlvLWNvbnRyb2xzIGJ1dHRvbi5ncm91cCArIGJ1dHRvbiB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5odG1sLm1vYmlsZS12aWV3IC50ZXh0LWJvZHktY2hhdC1tIHtcbiAgcGFkZGluZy10b3A6IDA7XG59XG5odG1sLm1vYmlsZS12aWV3ICNzYXlwaS1lbnRlckJ1dHRvbiB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5odG1sLm1vYmlsZS12aWV3ICNzYXlwaS1mb290ZXIge1xuICBkaXNwbGF5OiBub25lO1xufVxuaHRtbC5tb2JpbGUtdmlldyAjc2F5cGktcHJvbXB0LWFuY2VzdG9yIHtcbiAgLyogaGlkZXMgdGhlIHJvdyBjb250YWluaW5nIHRoZSB0ZXh0IGFyZWEgY29udHJvbCAqL1xuICAvKiBpbXBvcnRhbnQ6IGhpZGVzIHZpcnR1YWwga2V5Ym9hcmQgb24gYW5kcm9pZCAqL1xuICBkaXNwbGF5OiBub25lO1xuICAvKiB0aGUgY2FsbCBidXR0b24sIHVzdWFsbHkgbmVzdGVkIGluIHRoZSBwcm9tcHQsIGlzIGRldGFjaGVkIHdoaWxlIGluIG1vYmlsZSB2aWV3ICovXG59XG5odG1sLm1vYmlsZS12aWV3ICNzYXlwaS1zdWJtaXRCdXR0b24ge1xuICBkaXNwbGF5OiBub25lO1xufVxuaHRtbC5tb2JpbGUtdmlldyAjc2F5cGktY2FsbEJ1dHRvbiB7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgYm90dG9tOiA0cmVtO1xuICBsZWZ0OiAwO1xuICByaWdodDogMDtcbiAgbWFyZ2luOiBhdXRvO1xuICB3aWR0aDogNC41cmVtO1xuICBoZWlnaHQ6IDQuNXJlbTtcbiAgcGFkZGluZzogNnB4O1xuICBib3JkZXI6IDA7XG4gIHotaW5kZXg6IDgwO1xufWAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlcy9tb2JpbGUuc2Nzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQThCRSx1Q0FBQTtFQU1BLDZCQUFBO0VBaUJBLG9EQUFBO0FBakRGO0FBSEU7O0VBRUUsV0FBQTtFQUNBLGVBQUE7RUFDQSxPQUFBO0VBQ0EsMkNBQUE7RUFFQSxhQUFBO0VBQ0EsTUFBQTtBQUlKO0FBREU7RUFDRSxXQUFBO0VBQ0EsWUFBQTtFQUNBLDZCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxTQUFBO0FBR0o7QUFBRTtFQUNFLFlBQUE7RUFDQSw2QkFBQTtBQUVKO0FBREk7RUFDRSxVQUFBO0VBQ0EsWUFBQTtFQUNBLFlBQUE7QUFHTjtBQUVFOztFQUVFLHFCQUFBO0FBQUo7QUFJRTtFQUNFLDJCQUFBO0VBSUEsMEJBQUE7QUFMSjtBQUVJO0VBQ0UsYUFBQTtBQUFOO0FBR0k7RUFDRSw4QkFBQTtFQUNBLFdBQUE7RUFDQSxtQ0FBQTtBQUROO0FBRU07RUFDRSxhQUFBO0FBQVI7QUFNRTtFQUNFLGNBQUE7QUFKSjtBQU9FO0VBQ0UsYUFBQTtBQUxKO0FBUUU7RUFDRSxhQUFBO0FBTko7QUFTRTtFQUNFLG1EQUFBO0VBQ0EsaURBQUE7RUFDQSxhQUFBO0VBQ0Esb0ZBQUE7QUFQSjtBQVVFO0VBQ0UsYUFBQTtBQVJKO0FBV0U7RUFDRSxlQUFBO0VBQ0EsWUFBQTtFQUNBLE9BQUE7RUFDQSxRQUFBO0VBQ0EsWUFBQTtFQUNBLGFBQUE7RUFDQSxjQUFBO0VBQ0EsWUFBQTtFQUNBLFNBQUE7RUFDQSxXQUFBO0FBVEpcIixcInNvdXJjZXNDb250ZW50XCI6W1wiaHRtbC5tb2JpbGUtdmlldyB7XFxuICAjc2F5cGktcGFuZWwsXFxuICAubm90aWZpY2F0aW9uIHtcXG4gICAgd2lkdGg6IDEwMCU7XFxuICAgIHBvc2l0aW9uOiBmaXhlZDtcXG4gICAgbGVmdDogMDtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNDUsIDIzOCwgMjIzLCAwLjk4KTtcXG5cXG4gICAgaGVpZ2h0OiAxMDB2aDtcXG4gICAgdG9wOiAwO1xcbiAgfVxcblxcbiAgI3NheXBpLXRhbGtCdXR0b24ge1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgaGVpZ2h0OiAxMDAlO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gICAgYm9yZGVyLXJhZGl1czogMDtcXG4gICAgbWFyZ2luOiAwO1xcbiAgfVxcblxcbiAgI3NheXBpLW5vdGlmaWNhdGlvbiB7XFxuICAgIHotaW5kZXg6IDEwMDtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICAgIHN2ZyB7XFxuICAgICAgd2lkdGg6IDc1JTtcXG4gICAgICBoZWlnaHQ6IDEwMCU7XFxuICAgICAgbWFyZ2luOiBhdXRvO1xcbiAgICB9XFxuICB9XFxuXFxuICAvKiBQaSBjb250cm9sczogZWxsaXBzaXMsIGV4cGVyaWVuY2VzICovXFxuICAjX19uZXh0ID4gbWFpbiA+IGRpdiA+IGRpdiA+IGRpdi5maXhlZC50b3AtNC5yaWdodC02ID4gYnV0dG9uLFxcbiAgI3NheXBpLWV4cGVyaWVuY2VzLWJ1dHRvbiB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMS41KTtcXG4gIH1cXG5cXG4gIC8qIFBpIGNvbnRyb2xzOiBtdXRlL3VubXV0ZSAqL1xcbiAgI3NheXBpLWF1ZGlvLWNvbnRyb2xzIHtcXG4gICAgLyogaGlkZSB0aGUgdm9pY2Ugb3B0aW9ucyAqL1xcbiAgICBkaXYucC0xIHtcXG4gICAgICBkaXNwbGF5OiBub25lO1xcbiAgICB9XFxuICAgIC8qIHNjYWxlIHRoZSBtdXRlIGJ1dHRvbiAqL1xcbiAgICBidXR0b24uZ3JvdXAge1xcbiAgICAgIHRyYW5zZm9ybTogc2NhbGUoMikgIWltcG9ydGFudDtcXG4gICAgICB6LWluZGV4OiA1MDtcXG4gICAgICAvKiBoaWRlIHRoZSB2b2ljZSBzZWxlY3RvciB0d2lzdHkgKi9cXG4gICAgICArIGJ1dHRvbiB7XFxuICAgICAgICBkaXNwbGF5OiBub25lO1xcbiAgICAgIH1cXG4gICAgfVxcbiAgfVxcblxcbiAgLyogZml4IGFuIGFsaWdubWVudCBpc3N1ZSB3aXRoIHRoZSBcXFwibmV3IHVpIGxheW91dFxcXCIgKi9cXG4gIC50ZXh0LWJvZHktY2hhdC1tIHtcXG4gICAgcGFkZGluZy10b3A6IDA7XFxuICB9XFxuXFxuICAjc2F5cGktZW50ZXJCdXR0b24ge1xcbiAgICBkaXNwbGF5OiBub25lO1xcbiAgfVxcblxcbiAgI3NheXBpLWZvb3RlciB7XFxuICAgIGRpc3BsYXk6IG5vbmU7XFxuICB9XFxuXFxuICAjc2F5cGktcHJvbXB0LWFuY2VzdG9yIHtcXG4gICAgLyogaGlkZXMgdGhlIHJvdyBjb250YWluaW5nIHRoZSB0ZXh0IGFyZWEgY29udHJvbCAqL1xcbiAgICAvKiBpbXBvcnRhbnQ6IGhpZGVzIHZpcnR1YWwga2V5Ym9hcmQgb24gYW5kcm9pZCAqL1xcbiAgICBkaXNwbGF5OiBub25lO1xcbiAgICAvKiB0aGUgY2FsbCBidXR0b24sIHVzdWFsbHkgbmVzdGVkIGluIHRoZSBwcm9tcHQsIGlzIGRldGFjaGVkIHdoaWxlIGluIG1vYmlsZSB2aWV3ICovXFxuICB9XFxuXFxuICAjc2F5cGktc3VibWl0QnV0dG9uIHtcXG4gICAgZGlzcGxheTogbm9uZTtcXG4gIH1cXG5cXG4gICNzYXlwaS1jYWxsQnV0dG9uIHtcXG4gICAgcG9zaXRpb246IGZpeGVkO1xcbiAgICBib3R0b206IDRyZW07XFxuICAgIGxlZnQ6IDA7XFxuICAgIHJpZ2h0OiAwO1xcbiAgICBtYXJnaW46IGF1dG87XFxuICAgIHdpZHRoOiA0LjVyZW07XFxuICAgIGhlaWdodDogNC41cmVtO1xcbiAgICBwYWRkaW5nOiA2cHg7XFxuICAgIGJvcmRlcjogMDtcXG4gICAgei1pbmRleDogODA7XFxuICB9XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFIgPSB0eXBlb2YgUmVmbGVjdCA9PT0gJ29iamVjdCcgPyBSZWZsZWN0IDogbnVsbFxudmFyIFJlZmxlY3RBcHBseSA9IFIgJiYgdHlwZW9mIFIuYXBwbHkgPT09ICdmdW5jdGlvbidcbiAgPyBSLmFwcGx5XG4gIDogZnVuY3Rpb24gUmVmbGVjdEFwcGx5KHRhcmdldCwgcmVjZWl2ZXIsIGFyZ3MpIHtcbiAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwodGFyZ2V0LCByZWNlaXZlciwgYXJncyk7XG4gIH1cblxudmFyIFJlZmxlY3RPd25LZXlzXG5pZiAoUiAmJiB0eXBlb2YgUi5vd25LZXlzID09PSAnZnVuY3Rpb24nKSB7XG4gIFJlZmxlY3RPd25LZXlzID0gUi5vd25LZXlzXG59IGVsc2UgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcbiAgUmVmbGVjdE93bktleXMgPSBmdW5jdGlvbiBSZWZsZWN0T3duS2V5cyh0YXJnZXQpIHtcbiAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGFyZ2V0KVxuICAgICAgLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHRhcmdldCkpO1xuICB9O1xufSBlbHNlIHtcbiAgUmVmbGVjdE93bktleXMgPSBmdW5jdGlvbiBSZWZsZWN0T3duS2V5cyh0YXJnZXQpIHtcbiAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGFyZ2V0KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gUHJvY2Vzc0VtaXRXYXJuaW5nKHdhcm5pbmcpIHtcbiAgaWYgKGNvbnNvbGUgJiYgY29uc29sZS53YXJuKSBjb25zb2xlLndhcm4od2FybmluZyk7XG59XG5cbnZhciBOdW1iZXJJc05hTiA9IE51bWJlci5pc05hTiB8fCBmdW5jdGlvbiBOdW1iZXJJc05hTih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT09IHZhbHVlO1xufVxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIEV2ZW50RW1pdHRlci5pbml0LmNhbGwodGhpcyk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcbm1vZHVsZS5leHBvcnRzLm9uY2UgPSBvbmNlO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50c0NvdW50ID0gMDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxudmFyIGRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuZnVuY3Rpb24gY2hlY2tMaXN0ZW5lcihsaXN0ZW5lcikge1xuICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwibGlzdGVuZXJcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgRnVuY3Rpb24uIFJlY2VpdmVkIHR5cGUgJyArIHR5cGVvZiBsaXN0ZW5lcik7XG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KEV2ZW50RW1pdHRlciwgJ2RlZmF1bHRNYXhMaXN0ZW5lcnMnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gIH0sXG4gIHNldDogZnVuY3Rpb24oYXJnKSB7XG4gICAgaWYgKHR5cGVvZiBhcmcgIT09ICdudW1iZXInIHx8IGFyZyA8IDAgfHwgTnVtYmVySXNOYU4oYXJnKSkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RoZSB2YWx1ZSBvZiBcImRlZmF1bHRNYXhMaXN0ZW5lcnNcIiBpcyBvdXQgb2YgcmFuZ2UuIEl0IG11c3QgYmUgYSBub24tbmVnYXRpdmUgbnVtYmVyLiBSZWNlaXZlZCAnICsgYXJnICsgJy4nKTtcbiAgICB9XG4gICAgZGVmYXVsdE1heExpc3RlbmVycyA9IGFyZztcbiAgfVxufSk7XG5cbkV2ZW50RW1pdHRlci5pbml0ID0gZnVuY3Rpb24oKSB7XG5cbiAgaWYgKHRoaXMuX2V2ZW50cyA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICB0aGlzLl9ldmVudHMgPT09IE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKS5fZXZlbnRzKSB7XG4gICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG4gIH1cblxuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufTtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24gc2V0TWF4TGlzdGVuZXJzKG4pIHtcbiAgaWYgKHR5cGVvZiBuICE9PSAnbnVtYmVyJyB8fCBuIDwgMCB8fCBOdW1iZXJJc05hTihuKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgdmFsdWUgb2YgXCJuXCIgaXMgb3V0IG9mIHJhbmdlLiBJdCBtdXN0IGJlIGEgbm9uLW5lZ2F0aXZlIG51bWJlci4gUmVjZWl2ZWQgJyArIG4gKyAnLicpO1xuICB9XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuZnVuY3Rpb24gX2dldE1heExpc3RlbmVycyh0aGF0KSB7XG4gIGlmICh0aGF0Ll9tYXhMaXN0ZW5lcnMgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gIHJldHVybiB0aGF0Ll9tYXhMaXN0ZW5lcnM7XG59XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZ2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24gZ2V0TWF4TGlzdGVuZXJzKCkge1xuICByZXR1cm4gX2dldE1heExpc3RlbmVycyh0aGlzKTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIGVtaXQodHlwZSkge1xuICB2YXIgYXJncyA9IFtdO1xuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gIHZhciBkb0Vycm9yID0gKHR5cGUgPT09ICdlcnJvcicpO1xuXG4gIHZhciBldmVudHMgPSB0aGlzLl9ldmVudHM7XG4gIGlmIChldmVudHMgIT09IHVuZGVmaW5lZClcbiAgICBkb0Vycm9yID0gKGRvRXJyb3IgJiYgZXZlbnRzLmVycm9yID09PSB1bmRlZmluZWQpO1xuICBlbHNlIGlmICghZG9FcnJvcilcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAoZG9FcnJvcikge1xuICAgIHZhciBlcjtcbiAgICBpZiAoYXJncy5sZW5ndGggPiAwKVxuICAgICAgZXIgPSBhcmdzWzBdO1xuICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAvLyBOb3RlOiBUaGUgY29tbWVudHMgb24gdGhlIGB0aHJvd2AgbGluZXMgYXJlIGludGVudGlvbmFsLCB0aGV5IHNob3dcbiAgICAgIC8vIHVwIGluIE5vZGUncyBvdXRwdXQgaWYgdGhpcyByZXN1bHRzIGluIGFuIHVuaGFuZGxlZCBleGNlcHRpb24uXG4gICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICB9XG4gICAgLy8gQXQgbGVhc3QgZ2l2ZSBzb21lIGtpbmQgb2YgY29udGV4dCB0byB0aGUgdXNlclxuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ1VuaGFuZGxlZCBlcnJvci4nICsgKGVyID8gJyAoJyArIGVyLm1lc3NhZ2UgKyAnKScgOiAnJykpO1xuICAgIGVyci5jb250ZXh0ID0gZXI7XG4gICAgdGhyb3cgZXJyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICB9XG5cbiAgdmFyIGhhbmRsZXIgPSBldmVudHNbdHlwZV07XG5cbiAgaWYgKGhhbmRsZXIgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHR5cGVvZiBoYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgUmVmbGVjdEFwcGx5KGhhbmRsZXIsIHRoaXMsIGFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIHZhciBsZW4gPSBoYW5kbGVyLmxlbmd0aDtcbiAgICB2YXIgbGlzdGVuZXJzID0gYXJyYXlDbG9uZShoYW5kbGVyLCBsZW4pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpXG4gICAgICBSZWZsZWN0QXBwbHkobGlzdGVuZXJzW2ldLCB0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuZnVuY3Rpb24gX2FkZExpc3RlbmVyKHRhcmdldCwgdHlwZSwgbGlzdGVuZXIsIHByZXBlbmQpIHtcbiAgdmFyIG07XG4gIHZhciBldmVudHM7XG4gIHZhciBleGlzdGluZztcblxuICBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKTtcblxuICBldmVudHMgPSB0YXJnZXQuX2V2ZW50cztcbiAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZXZlbnRzID0gdGFyZ2V0Ll9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHRhcmdldC5fZXZlbnRzQ291bnQgPSAwO1xuICB9IGVsc2Uge1xuICAgIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gICAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICAgIGlmIChldmVudHMubmV3TGlzdGVuZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGFyZ2V0LmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyID8gbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgICAgIC8vIFJlLWFzc2lnbiBgZXZlbnRzYCBiZWNhdXNlIGEgbmV3TGlzdGVuZXIgaGFuZGxlciBjb3VsZCBoYXZlIGNhdXNlZCB0aGVcbiAgICAgIC8vIHRoaXMuX2V2ZW50cyB0byBiZSBhc3NpZ25lZCB0byBhIG5ldyBvYmplY3RcbiAgICAgIGV2ZW50cyA9IHRhcmdldC5fZXZlbnRzO1xuICAgIH1cbiAgICBleGlzdGluZyA9IGV2ZW50c1t0eXBlXTtcbiAgfVxuXG4gIGlmIChleGlzdGluZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgZXhpc3RpbmcgPSBldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgICArK3RhcmdldC5fZXZlbnRzQ291bnQ7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHR5cGVvZiBleGlzdGluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgICBleGlzdGluZyA9IGV2ZW50c1t0eXBlXSA9XG4gICAgICAgIHByZXBlbmQgPyBbbGlzdGVuZXIsIGV4aXN0aW5nXSA6IFtleGlzdGluZywgbGlzdGVuZXJdO1xuICAgICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIH0gZWxzZSBpZiAocHJlcGVuZCkge1xuICAgICAgZXhpc3RpbmcudW5zaGlmdChsaXN0ZW5lcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV4aXN0aW5nLnB1c2gobGlzdGVuZXIpO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gICAgbSA9IF9nZXRNYXhMaXN0ZW5lcnModGFyZ2V0KTtcbiAgICBpZiAobSA+IDAgJiYgZXhpc3RpbmcubGVuZ3RoID4gbSAmJiAhZXhpc3Rpbmcud2FybmVkKSB7XG4gICAgICBleGlzdGluZy53YXJuZWQgPSB0cnVlO1xuICAgICAgLy8gTm8gZXJyb3IgY29kZSBmb3IgdGhpcyBzaW5jZSBpdCBpcyBhIFdhcm5pbmdcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheFxuICAgICAgdmFyIHcgPSBuZXcgRXJyb3IoJ1Bvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgbGVhayBkZXRlY3RlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nLmxlbmd0aCArICcgJyArIFN0cmluZyh0eXBlKSArICcgbGlzdGVuZXJzICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnYWRkZWQuIFVzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnaW5jcmVhc2UgbGltaXQnKTtcbiAgICAgIHcubmFtZSA9ICdNYXhMaXN0ZW5lcnNFeGNlZWRlZFdhcm5pbmcnO1xuICAgICAgdy5lbWl0dGVyID0gdGFyZ2V0O1xuICAgICAgdy50eXBlID0gdHlwZTtcbiAgICAgIHcuY291bnQgPSBleGlzdGluZy5sZW5ndGg7XG4gICAgICBQcm9jZXNzRW1pdFdhcm5pbmcodyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uIGFkZExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHJldHVybiBfYWRkTGlzdGVuZXIodGhpcywgdHlwZSwgbGlzdGVuZXIsIGZhbHNlKTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnByZXBlbmRMaXN0ZW5lciA9XG4gICAgZnVuY3Rpb24gcHJlcGVuZExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICByZXR1cm4gX2FkZExpc3RlbmVyKHRoaXMsIHR5cGUsIGxpc3RlbmVyLCB0cnVlKTtcbiAgICB9O1xuXG5mdW5jdGlvbiBvbmNlV3JhcHBlcigpIHtcbiAgaWYgKCF0aGlzLmZpcmVkKSB7XG4gICAgdGhpcy50YXJnZXQucmVtb3ZlTGlzdGVuZXIodGhpcy50eXBlLCB0aGlzLndyYXBGbik7XG4gICAgdGhpcy5maXJlZCA9IHRydWU7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm4gdGhpcy5saXN0ZW5lci5jYWxsKHRoaXMudGFyZ2V0KTtcbiAgICByZXR1cm4gdGhpcy5saXN0ZW5lci5hcHBseSh0aGlzLnRhcmdldCwgYXJndW1lbnRzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfb25jZVdyYXAodGFyZ2V0LCB0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgc3RhdGUgPSB7IGZpcmVkOiBmYWxzZSwgd3JhcEZuOiB1bmRlZmluZWQsIHRhcmdldDogdGFyZ2V0LCB0eXBlOiB0eXBlLCBsaXN0ZW5lcjogbGlzdGVuZXIgfTtcbiAgdmFyIHdyYXBwZWQgPSBvbmNlV3JhcHBlci5iaW5kKHN0YXRlKTtcbiAgd3JhcHBlZC5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICBzdGF0ZS53cmFwRm4gPSB3cmFwcGVkO1xuICByZXR1cm4gd3JhcHBlZDtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24gb25jZSh0eXBlLCBsaXN0ZW5lcikge1xuICBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKTtcbiAgdGhpcy5vbih0eXBlLCBfb25jZVdyYXAodGhpcywgdHlwZSwgbGlzdGVuZXIpKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnByZXBlbmRPbmNlTGlzdGVuZXIgPVxuICAgIGZ1bmN0aW9uIHByZXBlbmRPbmNlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpO1xuICAgICAgdGhpcy5wcmVwZW5kTGlzdGVuZXIodHlwZSwgX29uY2VXcmFwKHRoaXMsIHR5cGUsIGxpc3RlbmVyKSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4vLyBFbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWYgYW5kIG9ubHkgaWYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9XG4gICAgZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIHZhciBsaXN0LCBldmVudHMsIHBvc2l0aW9uLCBpLCBvcmlnaW5hbExpc3RlbmVyO1xuXG4gICAgICBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKTtcblxuICAgICAgZXZlbnRzID0gdGhpcy5fZXZlbnRzO1xuICAgICAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgbGlzdCA9IGV2ZW50c1t0eXBlXTtcbiAgICAgIGlmIChsaXN0ID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHwgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpIHtcbiAgICAgICAgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApXG4gICAgICAgICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZGVsZXRlIGV2ZW50c1t0eXBlXTtcbiAgICAgICAgICBpZiAoZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3QubGlzdGVuZXIgfHwgbGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBsaXN0ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHBvc2l0aW9uID0gLTE7XG5cbiAgICAgICAgZm9yIChpID0gbGlzdC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fCBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikge1xuICAgICAgICAgICAgb3JpZ2luYWxMaXN0ZW5lciA9IGxpc3RbaV0ubGlzdGVuZXI7XG4gICAgICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICAgIGlmIChwb3NpdGlvbiA9PT0gMClcbiAgICAgICAgICBsaXN0LnNoaWZ0KCk7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHNwbGljZU9uZShsaXN0LCBwb3NpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpXG4gICAgICAgICAgZXZlbnRzW3R5cGVdID0gbGlzdFswXTtcblxuICAgICAgICBpZiAoZXZlbnRzLnJlbW92ZUxpc3RlbmVyICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIG9yaWdpbmFsTGlzdGVuZXIgfHwgbGlzdGVuZXIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9mZiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID1cbiAgICBmdW5jdGlvbiByZW1vdmVBbGxMaXN0ZW5lcnModHlwZSkge1xuICAgICAgdmFyIGxpc3RlbmVycywgZXZlbnRzLCBpO1xuXG4gICAgICBldmVudHMgPSB0aGlzLl9ldmVudHM7XG4gICAgICBpZiAoZXZlbnRzID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gICAgICBpZiAoZXZlbnRzLnJlbW92ZUxpc3RlbmVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICAgIHRoaXMuX2V2ZW50c0NvdW50ID0gMDtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudHNbdHlwZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmICgtLXRoaXMuX2V2ZW50c0NvdW50ID09PSAwKVxuICAgICAgICAgICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBkZWxldGUgZXZlbnRzW3R5cGVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZXZlbnRzKTtcbiAgICAgICAgdmFyIGtleTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGtleXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgICAgIHRoaXMuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIHRoaXMuX2V2ZW50c0NvdW50ID0gMDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIGxpc3RlbmVycyA9IGV2ZW50c1t0eXBlXTtcblxuICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lcnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICAgICAgfSBlbHNlIGlmIChsaXN0ZW5lcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBMSUZPIG9yZGVyXG4gICAgICAgIGZvciAoaSA9IGxpc3RlbmVycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG5mdW5jdGlvbiBfbGlzdGVuZXJzKHRhcmdldCwgdHlwZSwgdW53cmFwKSB7XG4gIHZhciBldmVudHMgPSB0YXJnZXQuX2V2ZW50cztcblxuICBpZiAoZXZlbnRzID09PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIFtdO1xuXG4gIHZhciBldmxpc3RlbmVyID0gZXZlbnRzW3R5cGVdO1xuICBpZiAoZXZsaXN0ZW5lciA9PT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiBbXTtcblxuICBpZiAodHlwZW9mIGV2bGlzdGVuZXIgPT09ICdmdW5jdGlvbicpXG4gICAgcmV0dXJuIHVud3JhcCA/IFtldmxpc3RlbmVyLmxpc3RlbmVyIHx8IGV2bGlzdGVuZXJdIDogW2V2bGlzdGVuZXJdO1xuXG4gIHJldHVybiB1bndyYXAgP1xuICAgIHVud3JhcExpc3RlbmVycyhldmxpc3RlbmVyKSA6IGFycmF5Q2xvbmUoZXZsaXN0ZW5lciwgZXZsaXN0ZW5lci5sZW5ndGgpO1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uIGxpc3RlbmVycyh0eXBlKSB7XG4gIHJldHVybiBfbGlzdGVuZXJzKHRoaXMsIHR5cGUsIHRydWUpO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yYXdMaXN0ZW5lcnMgPSBmdW5jdGlvbiByYXdMaXN0ZW5lcnModHlwZSkge1xuICByZXR1cm4gX2xpc3RlbmVycyh0aGlzLCB0eXBlLCBmYWxzZSk7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgaWYgKHR5cGVvZiBlbWl0dGVyLmxpc3RlbmVyQ291bnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBsaXN0ZW5lckNvdW50LmNhbGwoZW1pdHRlciwgdHlwZSk7XG4gIH1cbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJDb3VudCA9IGxpc3RlbmVyQ291bnQ7XG5mdW5jdGlvbiBsaXN0ZW5lckNvdW50KHR5cGUpIHtcbiAgdmFyIGV2ZW50cyA9IHRoaXMuX2V2ZW50cztcblxuICBpZiAoZXZlbnRzICE9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IGV2ZW50c1t0eXBlXTtcblxuICAgIGlmICh0eXBlb2YgZXZsaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfSBlbHNlIGlmIChldmxpc3RlbmVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gMDtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5ldmVudE5hbWVzID0gZnVuY3Rpb24gZXZlbnROYW1lcygpIHtcbiAgcmV0dXJuIHRoaXMuX2V2ZW50c0NvdW50ID4gMCA/IFJlZmxlY3RPd25LZXlzKHRoaXMuX2V2ZW50cykgOiBbXTtcbn07XG5cbmZ1bmN0aW9uIGFycmF5Q2xvbmUoYXJyLCBuKSB7XG4gIHZhciBjb3B5ID0gbmV3IEFycmF5KG4pO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG47ICsraSlcbiAgICBjb3B5W2ldID0gYXJyW2ldO1xuICByZXR1cm4gY29weTtcbn1cblxuZnVuY3Rpb24gc3BsaWNlT25lKGxpc3QsIGluZGV4KSB7XG4gIGZvciAoOyBpbmRleCArIDEgPCBsaXN0Lmxlbmd0aDsgaW5kZXgrKylcbiAgICBsaXN0W2luZGV4XSA9IGxpc3RbaW5kZXggKyAxXTtcbiAgbGlzdC5wb3AoKTtcbn1cblxuZnVuY3Rpb24gdW53cmFwTGlzdGVuZXJzKGFycikge1xuICB2YXIgcmV0ID0gbmV3IEFycmF5KGFyci5sZW5ndGgpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHJldC5sZW5ndGg7ICsraSkge1xuICAgIHJldFtpXSA9IGFycltpXS5saXN0ZW5lciB8fCBhcnJbaV07XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxuZnVuY3Rpb24gb25jZShlbWl0dGVyLCBuYW1lKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgZnVuY3Rpb24gZXJyb3JMaXN0ZW5lcihlcnIpIHtcbiAgICAgIGVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIobmFtZSwgcmVzb2x2ZXIpO1xuICAgICAgcmVqZWN0KGVycik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzb2x2ZXIoKSB7XG4gICAgICBpZiAodHlwZW9mIGVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZW1pdHRlci5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBlcnJvckxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICAgIHJlc29sdmUoW10uc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcbiAgICB9O1xuXG4gICAgZXZlbnRUYXJnZXRBZ25vc3RpY0FkZExpc3RlbmVyKGVtaXR0ZXIsIG5hbWUsIHJlc29sdmVyLCB7IG9uY2U6IHRydWUgfSk7XG4gICAgaWYgKG5hbWUgIT09ICdlcnJvcicpIHtcbiAgICAgIGFkZEVycm9ySGFuZGxlcklmRXZlbnRFbWl0dGVyKGVtaXR0ZXIsIGVycm9yTGlzdGVuZXIsIHsgb25jZTogdHJ1ZSB9KTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRFcnJvckhhbmRsZXJJZkV2ZW50RW1pdHRlcihlbWl0dGVyLCBoYW5kbGVyLCBmbGFncykge1xuICBpZiAodHlwZW9mIGVtaXR0ZXIub24gPT09ICdmdW5jdGlvbicpIHtcbiAgICBldmVudFRhcmdldEFnbm9zdGljQWRkTGlzdGVuZXIoZW1pdHRlciwgJ2Vycm9yJywgaGFuZGxlciwgZmxhZ3MpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGV2ZW50VGFyZ2V0QWdub3N0aWNBZGRMaXN0ZW5lcihlbWl0dGVyLCBuYW1lLCBsaXN0ZW5lciwgZmxhZ3MpIHtcbiAgaWYgKHR5cGVvZiBlbWl0dGVyLm9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgaWYgKGZsYWdzLm9uY2UpIHtcbiAgICAgIGVtaXR0ZXIub25jZShuYW1lLCBsaXN0ZW5lcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVtaXR0ZXIub24obmFtZSwgbGlzdGVuZXIpO1xuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgZW1pdHRlci5hZGRFdmVudExpc3RlbmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gRXZlbnRUYXJnZXQgZG9lcyBub3QgaGF2ZSBgZXJyb3JgIGV2ZW50IHNlbWFudGljcyBsaWtlIE5vZGVcbiAgICAvLyBFdmVudEVtaXR0ZXJzLCB3ZSBkbyBub3QgbGlzdGVuIGZvciBgZXJyb3JgIGV2ZW50cyBoZXJlLlxuICAgIGVtaXR0ZXIuYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBmdW5jdGlvbiB3cmFwTGlzdGVuZXIoYXJnKSB7XG4gICAgICAvLyBJRSBkb2VzIG5vdCBoYXZlIGJ1aWx0aW4gYHsgb25jZTogdHJ1ZSB9YCBzdXBwb3J0IHNvIHdlXG4gICAgICAvLyBoYXZlIHRvIGRvIGl0IG1hbnVhbGx5LlxuICAgICAgaWYgKGZsYWdzLm9uY2UpIHtcbiAgICAgICAgZW1pdHRlci5yZW1vdmVFdmVudExpc3RlbmVyKG5hbWUsIHdyYXBMaXN0ZW5lcik7XG4gICAgICB9XG4gICAgICBsaXN0ZW5lcihhcmcpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImVtaXR0ZXJcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgRXZlbnRFbWl0dGVyLiBSZWNlaXZlZCB0eXBlICcgKyB0eXBlb2YgZW1pdHRlcik7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IFwiPHN2ZyB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHhtbG5zOnhsaW5rPVxcXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXFxcIlxcbiAgICB6b29tQW5kUGFuPVxcXCJtYWduaWZ5XFxcIiB2aWV3Qm94PVxcXCIwIDAgNzY4IDc2Ny45OTk5OTRcXFwiXFxuICAgIHByZXNlcnZlQXNwZWN0UmF0aW89XFxcInhNaWRZTWlkIG1lZXRcXFwiIHZlcnNpb249XFxcIjEuMFxcXCI+XFxuICAgIDxwYXRoIGNsYXNzPVxcXCJjaXJjbGVcXFwiIGZpbGw9XFxcIiM0MThhMmZcXFwiXFxuICAgICAgICBkPVxcXCJNIDc2Ny45ODgyODEgMzgzLjk4NDM3NSBDIDc2Ny45ODgyODEgNTk2LjA1ODU5NCA1OTYuMDY2NDA2IDc2Ny45ODA0NjkgMzgzLjk5NjA5NCA3NjcuOTgwNDY5IEMgMTcxLjkyMTg3NSA3NjcuOTgwNDY5IDAgNTk2LjA1ODU5NCAwIDM4My45ODQzNzUgQyAwIDE3MS45MTAxNTYgMTcxLjkyMTg3NSAtMC4wMDc4MTI1IDM4My45OTYwOTQgLTAuMDA3ODEyNSBDIDU5Ni4wNjY0MDYgLTAuMDA3ODEyNSA3NjcuOTg4MjgxIDE3MS45MTAxNTYgNzY3Ljk4ODI4MSAzODMuOTg0Mzc1IFxcXCJcXG4gICAgICAgIGZpbGwtb3BhY2l0eT1cXFwiMVxcXCIgZmlsbC1ydWxlPVxcXCJub256ZXJvXFxcIiAvPlxcbiAgICA8cGF0aCBjbGFzcz1cXFwicGhvbmUtcmVjZWl2ZXJcXFwiIGZpbGw9XFxcIiNmZmZmZmZcXFwiXFxuICAgICAgICBkPVxcXCJNIDIxNS43MjY1NjIgMTk5Ljc3MzQzOCBDIDIxOS43NDYwOTQgMTk0LjgzNTkzOCAyMzAuMDIzNDM4IDE4My42MjUgMjQzLjY0NDUzMSAxODMuNzY5NTMxIEMgMjQ0LjQwNjI1IDE4My43NzczNDQgMjQ1LjMwMDc4MSAxODMuODA4NTk0IDI0Ni4zNDM3NSAxODMuOTE0MDYyIEMgMjQ2LjM0Mzc1IDE4My45MTQwNjIgMjQ4LjQ5MjE4OCAxODQuMTQ0NTMxIDI1MC42MTMyODEgMTg0LjcwMzEyNSBDIDI2OC4yOTI5NjkgMTg5LjQxMDE1NiAyOTkuOTIxODc1IDIyNC4zMDQ2ODggMjk5LjkyMTg3NSAyMjQuMzA0Njg4IEMgMzI2LjkyNTc4MSAyNTQuMDkzNzUgMzM0LjcyMjY1NiAyNTUuNTMxMjUgMzM0LjYzNjcxOSAyNjYuNSBDIDMzNC41NTA3ODEgMjc2Ljc3NzM0NCAzMjguMTQwNjI1IDI4NC43MTg3NSAzMTYuMjUzOTA2IDI5Ni41NjY0MDYgQyAyODQuNTY2NDA2IDMyOC4xNDg0MzggMjc3LjgwODU5NCAzMzAuNTMxMjUgMjc1LjM1MTU2MiAzNDAuNDIxODc1IEMgMjczLjkwMjM0NCAzNDYuMjM0Mzc1IDI2OS41MzkwNjIgMzU3LjUxMTcxOSAyODkuMTA1NDY5IDM3OS4zNTU0NjkgQyAzMTguMjg5MDYyIDQxMS45Mjk2ODggMzg4LjE4NzUgNDc4LjQzNzUgMzk0LjMwMDc4MSA0ODIuNTE1NjI1IEMgNDAwLjQwMjM0NCA0ODYuNTg1OTM4IDQyMi4xMjEwOTQgNTAwLjgzMjAzMSA0NTEuMzAwNzgxIDQ3NC4zNzEwOTQgQyA0NzEuMjI2NTYyIDQ1Ni4zMDQ2ODggNDgwLjcxNDg0NCA0MzUuMDY2NDA2IDQ5NC44NzUgNDMzLjc4NTE1NiBDIDUwMi4zNjMyODEgNDMzLjA4OTg0NCA1MDcuODc4OTA2IDQzNy42MTMyODEgNTE5LjE2Nzk2OSA0NDcuMjIyNjU2IEMgNTg1Ljg4NjcxOSA1MDMuOTc2NTYyIDU4Ni44NzEwOTQgNTEzLjkzMzU5NCA1ODYuMzEyNSA1MTkuODI0MjE5IEMgNTg1LjM1NTQ2OSA1MzAuMDExNzE5IDU4MC43NSA1MzkuMjEwOTM4IDU2NS4zMTY0MDYgNTUwLjM4MjgxMiBDIDUyNS45NTMxMjUgNTc4Ljg3ODkwNiA1MDguMzEyNSA2MDMuOTkyMTg4IDQyOC4yMzQzNzUgNTcwLjc0MjE4OCBDIDM0OC4xNTIzNDQgNTM3LjQ4NDM3NSAyNjMuOTk2MDk0IDQ1My4zMzU5MzggMjQwLjI0MjE4OCA0MTcuMzU5Mzc1IEMgMjE2LjQ4ODI4MSAzODEuMzkwNjI1IDE3OS4xNjAxNTYgMzI2LjQyMTg3NSAxODEuODc4OTA2IDI4OC40MTQwNjIgQyAxODMuNzY5NTMxIDI2MS45ODA0NjkgMTkxLjg2NzE4OCAyMzguODYzMjgxIDE5MS44NjcxODggMjM4Ljg2MzI4MSBDIDE5OS4wOTc2NTYgMjIwLjg4MjgxMiAyMDguNzE4NzUgMjA3Ljg3ODkwNiAyMTUuNzI2NTYyIDE5OS43NzM0MzggXFxcIlxcbiAgICAgICAgZmlsbC1vcGFjaXR5PVxcXCIxXFxcIiBmaWxsLXJ1bGU9XFxcIm5vbnplcm9cXFwiIC8+XFxuPC9zdmc+XCI7IiwiZXhwb3J0IGRlZmF1bHQgXCI8P3htbCB2ZXJzaW9uPVxcXCIxLjBcXFwiIGVuY29kaW5nPVxcXCJVVEYtOFxcXCI/PlxcbjxzdmcgaWQ9XFxcIkxheWVyXzFcXFwiIGRhdGEtbmFtZT1cXFwiTGF5ZXIgMVxcXCIgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgNjQuMDYgNjQuMzNcXFwiPlxcbiAgPGRlZnM+XFxuICAgIDxzdHlsZT5cXG4gICAgICAuY2xzLTEge1xcbiAgICAgICAgZmlsbDogIzI0MzgxYjtcXG4gICAgICB9XFxuXFxuICAgICAgLmNscy0xLCAuY2xzLTIge1xcbiAgICAgICAgc3Ryb2tlLXdpZHRoOiAwcHg7XFxuICAgICAgfVxcblxcbiAgICAgIC5jbHMtMiB7XFxuICAgICAgICBmaWxsOiAjZGZkN2MyO1xcbiAgICAgIH1cXG4gICAgPC9zdHlsZT5cXG4gIDwvZGVmcz5cXG4gIDxwYXRoIGNsYXNzPVxcXCJjbHMtMlxcXCIgZD1cXFwibTMxLjcxLDY0LjMyQzE0Ljc3LDY0LjQ2LS40NCw0OS45MywwLDMxLjMzLjQxLDE0LjQ3LDE0LjI5LS4zMiwzMi43LDBjMTYuOTEuMywzMS44LDE0LjMyLDMxLjM2LDMzLjE0LS4zOSwxNi43Ni0xNC40OSwzMS41NS0zMi4zNCwzMS4xOFptMTAuNjctMjMuMTljLjA2LS43LS40MS0xLjEyLS44NC0xLjU1LTItMi0zLjk0LTQuMDctNi4wMi01Ljk3LTEuMTQtMS4wNC0xLjMyLTEuNjgtLjA2LTIuODIsMi4xMy0xLjkzLDQuMDctNC4wOCw2LjEtNi4xMi43OC0uNzksMS4zMS0xLjY0LjM0LTIuNTYtLjkyLS44Ny0xLjcyLS4yOC0yLjQzLjQ1LTIuMTcsMi4yMS00LjM5LDQuMzktNi41Miw2LjY1LS43Mi43Ny0xLjE2LjctMS44NC0uMDItMi4wNi0yLjE3LTQuMTktNC4yOC02LjI5LTYuNDEtLjc2LS43Ny0xLjU5LTEuNjgtMi42Ni0uNjMtMS4xNCwxLjEyLS4xOSwxLjk4LjYyLDIuNzksMi4wNywyLjA5LDQuMDksNC4yMiw2LjIsNi4yNi43Ny43NS44MiwxLjIuMDIsMS45Ny0yLjIxLDIuMS00LjMzLDQuMy02LjQ5LDYuNDUtLjc5Ljc4LTEuMywxLjY1LS4zMiwyLjU2LjkyLjg1LDEuNzEuMjYsMi40My0uNDcsMi4xMS0yLjEyLDQuMjgtNC4xOSw2LjMzLTYuMzguODgtLjk0LDEuMzctLjg2LDIuMjEuMDMsMi4xMywyLjI2LDQuMzcsNC40MSw2LjU3LDYuNi41MS41MSwxLjA5Ljc4LDEuOC40OC41Ni0uMjQuODUtLjY4Ljg3LTEuM1pcXFwiLz5cXG4gIDxwYXRoIGNsYXNzPVxcXCJjbHMtMVxcXCIgZD1cXFwibTQyLjQ3LDQxLjI3Yy0uMDIuNjItLjMyLDEuMDYtLjg3LDEuMy0uNzEuMzEtMS4yOS4wMy0xLjgtLjQ4LTIuMi0yLjItNC40NC00LjM1LTYuNTctNi42LS44NC0uODktMS4zMy0uOTYtMi4yMS0uMDMtMi4wNCwyLjE5LTQuMjIsNC4yNS02LjMzLDYuMzgtLjcyLjcyLTEuNTEsMS4zMi0yLjQzLjQ3LS45OC0uOTEtLjQ3LTEuNzguMzItMi41NiwyLjE2LTIuMTUsNC4yOC00LjM1LDYuNDktNi40NS44MS0uNzcuNzYtMS4yMi0uMDItMS45Ny0yLjExLTIuMDQtNC4xMy00LjE3LTYuMi02LjI2LS44LS44MS0xLjc1LTEuNjctLjYyLTIuNzksMS4wNy0xLjA1LDEuOS0uMTQsMi42Ni42MywyLjEsMi4xMyw0LjIzLDQuMjQsNi4yOSw2LjQxLjY5LjczLDEuMTIuNzksMS44NC4wMiwyLjEzLTIuMjYsNC4zNS00LjQzLDYuNTItNi42NS43Mi0uNzMsMS41MS0xLjMxLDIuNDMtLjQ1Ljk3LjkyLjQ0LDEuNzgtLjM0LDIuNTYtMi4wMywyLjA0LTMuOTcsNC4xOS02LjEsNi4xMi0xLjI1LDEuMTQtMS4wOCwxLjc4LjA2LDIuODIsMi4wOSwxLjkxLDQuMDIsMy45Nyw2LjAyLDUuOTcuNDMuNDMuOS44NS44NCwxLjU1WlxcXCIvPlxcbjwvc3ZnPlwiOyIsImV4cG9ydCBkZWZhdWx0IFwiPHN2ZyB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHhtbG5zOnhsaW5rPVxcXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXFxcIlxcbiAgICB6b29tQW5kUGFuPVxcXCJtYWduaWZ5XFxcIiB2aWV3Qm94PVxcXCIwIDAgNzY4IDc2Ny45OTk5OTRcXFwiXFxuICAgIHByZXNlcnZlQXNwZWN0UmF0aW89XFxcInhNaWRZTWlkIG1lZXRcXFwiIHZlcnNpb249XFxcIjEuMFxcXCI+XFxuICAgIDxwYXRoIGZpbGw9XFxcIiM3NzZkNmRcXFwiXFxuICAgICAgICBkPVxcXCJNIDc2OCAzODQgQyA3NjggNTk2LjA3NDIxOSA1OTYuMDc0MjE5IDc2OCAzODQgNzY4IEMgMTcxLjkyNTc4MSA3NjggMCA1OTYuMDc0MjE5IDAgMzg0IEMgMCAxNzEuOTI1NzgxIDE3MS45MjU3ODEgMCAzODQgMCBDIDU5Ni4wNzQyMTkgMCA3NjggMTcxLjkyNTc4MSA3NjggMzg0IFxcXCJcXG4gICAgICAgIGZpbGwtb3BhY2l0eT1cXFwiMVxcXCIgZmlsbC1ydWxlPVxcXCJub256ZXJvXFxcIiAvPlxcbiAgICA8cGF0aCBmaWxsPVxcXCIjZmZmZmZmXFxcIlxcbiAgICAgICAgZD1cXFwiTSAxNTMuNjk1MzEyIDQxOC45Njg3NSBDIDE1My43MTg3NSA0MTguOTcyNjU2IDE2Ny43NzM0MzggNDU1LjEwNTQ2OSAxODMuNjM2NzE5IDQ2NC41MDc4MTIgQyAxOTMuOTI1NzgxIDQ3MC41ODU5MzggMjAyLjUyMzQzOCA0NjcuMzIwMzEyIDIxMy42MjUgNDYyLjA4NTkzOCBDIDIzNS4yMzQzNzUgNDUxLjg5MDYyNSAyNTcuMzQ3NjU2IDQ0Mi40NzY1NjIgMjgwLjQ4MDQ2OSA0MzUuOTUzMTI1IEMgMjg2Ljg1NTQ2OSA0MzQuMTUyMzQ0IDI5MC44MzIwMzEgNDI3Ljg5MDYyNSAyODkuMjY1NjI1IDQyMS43MjI2NTYgQyAyODYuNDAyMzQ0IDQxMC42ODc1IDI4My40ODA0NjkgMzk5LjY2MDE1NiAyODAuNTA3ODEyIDM4OC42NDQ1MzEgQyAyNzguODA4NTk0IDM4Mi41MTE3MTkgMjgzLjUyMzQzOCAzNzUuOTg4MjgxIDI5MS4xNDg0MzggMzc0LjM2MzI4MSBDIDMyMC4yODEyNSAzNjguMTI4OTA2IDM1MC4xNTIzNDQgMzY0LjkyMTg3NSAzODAuMDM5MDYyIDM2NC43Njk1MzEgQyAzODEuMzU5Mzc1IDM2NC43Njk1MzEgMzg2LjY0MDYyNSAzNjQuNzY5NTMxIDM4Ny45NjA5MzggMzY0Ljc2OTUzMSBDIDQxNy44NDc2NTYgMzY0LjkyMTg3NSA0NDcuNzE0ODQ0IDM2OC4xMjg5MDYgNDc2Ljg1MTU2MiAzNzQuMzYzMjgxIEMgNDg0LjQ3NjU2MiAzNzUuOTg4MjgxIDQ4OS4xOTE0MDYgMzgyLjUxMTcxOSA0ODcuNDkyMTg4IDM4OC42NDQ1MzEgQyA0ODQuNTE5NTMxIDM5OS42NjAxNTYgNDgxLjU5NzY1NiA0MTAuNjg3NSA0NzguNzM0Mzc1IDQyMS43MjI2NTYgQyA0NzcuMTY3OTY5IDQyNy44OTA2MjUgNDgxLjE0NDUzMSA0MzQuMTUyMzQ0IDQ4Ny41MTk1MzEgNDM1Ljk1MzEyNSBDIDUxMC42NTIzNDQgNDQyLjQ3NjU2MiA1MzIuNzY1NjI1IDQ1MS44OTA2MjUgNTU0LjM3NSA0NjIuMDg1OTM4IEMgNTY1LjQ3NjU2MiA0NjcuMzIwMzEyIDU3NC4wNzQyMTkgNDcwLjU4NTkzOCA1ODQuMzYzMjgxIDQ2NC41MDc4MTIgQyA2MDAuMjI2NTYyIDQ1NS4xMDU0NjkgNjE0LjI4MTI1IDQxOC45NzI2NTYgNjE0LjMwNDY4OCA0MTguOTY4NzUgQyA2MjcuNjY0MDYyIDM5MC43MzA0NjkgNjE5LjA0Mjk2OSAzNTkuMTE3MTg4IDU4Mi4xNjc5NjkgMzQyLjU1MDc4MSBDIDUxOS45NjA5MzggMzE0LjgzOTg0NCA0NTcuMzIwMzEyIDMwMC42NDA2MjUgMzg4LjE0MDYyNSAzMDAuMjAzMTI1IEMgMzg2Ljc2NTYyNSAzMDAuMjAzMTI1IDM4MS4yMzgyODEgMzAwLjIwMzEyNSAzNzkuODU1NDY5IDMwMC4yMDMxMjUgQyAzMTAuNjc5Njg4IDMwMC42NDA2MjUgMjQ4LjAzOTA2MiAzMTQuODM5ODQ0IDE4NS44MzIwMzEgMzQyLjU1MDc4MSBDIDE0OC45NDkyMTkgMzU5LjExNzE4OCAxNDAuMzM1OTM4IDM5MC43MzA0NjkgMTUzLjY5NTMxMiA0MTguOTY4NzUgXFxcIlxcbiAgICAgICAgZmlsbC1vcGFjaXR5PVxcXCIxXFxcIiBmaWxsLXJ1bGU9XFxcIm5vbnplcm9cXFwiIC8+XFxuPC9zdmc+XCI7IiwiZXhwb3J0IGRlZmF1bHQgXCI8c3ZnIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgeG1sbnM6eGxpbms9XFxcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcXFwiIHpvb21BbmRQYW49XFxcIm1hZ25pZnlcXFwiIHZpZXdCb3g9XFxcIjAgMCA3NjggNzY3Ljk5OTk5NFxcXCIgcHJlc2VydmVBc3BlY3RSYXRpbz1cXFwieE1pZFlNaWQgbWVldFxcXCIgdmVyc2lvbj1cXFwiMS4wXFxcIj48cGF0aCBmaWxsPVxcXCIjZTRkOGMxXFxcIiBkPVxcXCJNIDc2OC4xMzI4MTIgMzc5LjUzNTE1NiBDIDc2OC4xMzI4MTIgMTY5LjA4OTg0NCA1OTcuNTIzNDM4IC0xLjQ5NjA5NCAzODcuMDUwNzgxIC0xLjQ5NjA5NCBDIDE3Ni42MDkzNzUgLTEuNDk2MDk0IDUuOTk2MDk0IDE2OS4wODk4NDQgNS45OTYwOTQgMzc5LjUzNTE1NiBDIDUuOTk2MDk0IDU4OS45NDkyMTkgMTc2LjYwOTM3NSA3NjAuNTM5MDYyIDM4Ny4wNTA3ODEgNzYwLjUzOTA2MiBDIDU5Ny41MjM0MzggNzYwLjUzOTA2MiA3NjguMTMyODEyIDU4OS45NDkyMTkgNzY4LjEzMjgxMiAzNzkuNTM1MTU2IFxcXCIgZmlsbC1vcGFjaXR5PVxcXCIxXFxcIiBmaWxsLXJ1bGU9XFxcIm5vbnplcm9cXFwiLz48cGF0aCBmaWxsPVxcXCIjNzc2ZDZkXFxcIiBkPVxcXCJNIDUzOC45OTYwOTQgMjIzLjE1MjM0NCBMIDMwNi41MzUxNTYgMjI5Ljg1NTQ2OSBMIDUzOC45OTYwOTQgNDU1LjY5NTMxMiBaIE0gNTM4Ljk5NjA5NCAyMjMuMTUyMzQ0IFxcXCIgZmlsbC1vcGFjaXR5PVxcXCIxXFxcIiBmaWxsLXJ1bGU9XFxcIm5vbnplcm9cXFwiLz48cGF0aCBmaWxsPVxcXCIjNzc2ZDZkXFxcIiBkPVxcXCJNIDIzNS4xMDU0NjkgNTM1Ljg5MDYyNSBMIDQ2Ny41OTc2NTYgNTI5LjE4NzUgTCAyMzUuMTA1NDY5IDMwMy4zNDM3NSBaIE0gMjM1LjEwNTQ2OSA1MzUuODkwNjI1IFxcXCIgZmlsbC1vcGFjaXR5PVxcXCIxXFxcIiBmaWxsLXJ1bGU9XFxcIm5vbnplcm9cXFwiLz48L3N2Zz5cIjsiLCJleHBvcnQgZGVmYXVsdCBcIjxzdmcgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiB4bWxuczp4bGluaz1cXFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1xcXCIgd2lkdGg9XFxcIjUwMFxcXCIgem9vbUFuZFBhbj1cXFwibWFnbmlmeVxcXCIgdmlld0JveD1cXFwiMCAwIDM3NSAzNzQuOTk5OTkxXFxcIiBoZWlnaHQ9XFxcIjUwMFxcXCIgcHJlc2VydmVBc3BlY3RSYXRpbz1cXFwieE1pZFlNaWQgbWVldFxcXCIgdmVyc2lvbj1cXFwiMS4wXFxcIj48cGF0aCBmaWxsPVxcXCIjNzc2ZDZkXFxcIiBkPVxcXCJNIDIzOS43MjI2NTYgMTI2LjQ0MTQwNiBMIDIzOS43MjI2NTYgMTIyLjMwMDc4MSBDIDIzOS43MjI2NTYgOTMuNTA3ODEyIDIxNi4yOTY4NzUgNzAuMDc4MTI1IDE4Ny41IDcwLjA3ODEyNSBDIDE1OC43MDMxMjUgNzAuMDc4MTI1IDEzNS4yNzczNDQgOTMuNTA3ODEyIDEzNS4yNzczNDQgMTIyLjMwMDc4MSBMIDEzNS4yNzczNDQgMTg3Ljk1MzEyNSBDIDEzNS4yNzczNDQgMTk5Ljk4ODI4MSAxMzkuNDEwMTU2IDIxMS4wNTA3ODEgMTQ2LjI3MzQzOCAyMTkuODkwNjI1IFogTSAyMzkuNzIyNjU2IDEyNi40NDE0MDYgXFxcIiBmaWxsLW9wYWNpdHk9XFxcIjFcXFwiIGZpbGwtcnVsZT1cXFwibm9uemVyb1xcXCIvPjxwYXRoIGZpbGw9XFxcIiM3NzZkNmRcXFwiIGQ9XFxcIk0gMTU1LjA0Njg3NSAyMjguNzkyOTY5IEMgMTYzLjk2NDg0NCAyMzUuODk4NDM4IDE3NS4yMzQzNzUgMjQwLjE3NTc4MSAxODcuNSAyNDAuMTc1NzgxIEMgMjE2LjI5Njg3NSAyNDAuMTc1NzgxIDIzOS43MjI2NTYgMjE2Ljc1IDIzOS43MjI2NTYgMTg3Ljk1MzEyNSBMIDIzOS43MjI2NTYgMTQ0LjExMzI4MSBaIE0gMTU1LjA0Njg3NSAyMjguNzkyOTY5IFxcXCIgZmlsbC1vcGFjaXR5PVxcXCIxXFxcIiBmaWxsLXJ1bGU9XFxcIm5vbnplcm9cXFwiLz48cGF0aCBmaWxsPVxcXCIjNzc2ZDZkXFxcIiBkPVxcXCJNIDE4Ny41IDAgQyA4My45NDUzMTIgMCAwIDgzLjk0NTMxMiAwIDE4Ny41IEMgMCAyOTEuMDU0Njg4IDgzLjk0NTMxMiAzNzUgMTg3LjUgMzc1IEMgMjkxLjA1NDY4OCAzNzUgMzc1IDI5MS4wNTQ2ODggMzc1IDE4Ny41IEMgMzc1IDgzLjk0NTMxMiAyOTEuMDU0Njg4IDAgMTg3LjUgMCBaIE0gMjg3LjQ4NDM3NSA5Ni4zNTU0NjkgTCAyNTQuNjQwNjI1IDEyOS4xOTUzMTIgTCAyNTQuNjQwNjI1IDE4Ny45NTMxMjUgQyAyNTQuNjQwNjI1IDIyNC45NzY1NjIgMjI0LjUyMzQzOCAyNTUuMDk3NjU2IDE4Ny41IDI1NS4wOTc2NTYgQyAxNzEuMTE3MTg4IDI1NS4wOTc2NTYgMTU2LjEwNTQ2OSAyNDkuMTgzNTk0IDE0NC40Mzc1IDIzOS40MDIzNDQgTCAxMzguMTA5Mzc1IDI0NS43MzA0NjkgQyAxNTEuNDE3OTY5IDI1Ny4xMjEwOTQgMTY4LjY1MjM0NCAyNjQuMDQ2ODc1IDE4Ny41IDI2NC4wNDY4NzUgQyAyMjkuNDU3MDMxIDI2NC4wNDY4NzUgMjYzLjU5Mzc1IDIyOS45MTQwNjIgMjYzLjU5Mzc1IDE4Ny45NTMxMjUgQyAyNjMuNTkzNzUgMTgzLjgzMjAzMSAyNjYuOTMzNTk0IDE4MC40OTYwOTQgMjcxLjA1NDY4OCAxODAuNDk2MDk0IEMgMjc1LjE3NTc4MSAxODAuNDk2MDk0IDI3OC41MTU2MjUgMTgzLjgzNTkzOCAyNzguNTE1NjI1IDE4Ny45NTMxMjUgQyAyNzguNTE1NjI1IDIzNS42MjUgMjQxLjY2Nzk2OSAyNzQuODI4MTI1IDE5NC45NjA5MzggMjc4LjY0MDYyNSBMIDE5NC45NjA5MzggMzA0LjkyMTg3NSBMIDIyMC4xMjEwOTQgMzA0LjkyMTg3NSBDIDIyNC4yNDIxODggMzA0LjkyMTg3NSAyMjcuNTgyMDMxIDMwOC4yNjE3MTkgMjI3LjU4MjAzMSAzMTIuMzgyODEyIEMgMjI3LjU4MjAzMSAzMTYuNSAyMjQuMjQyMTg4IDMxOS44Mzk4NDQgMjIwLjEyMTA5NCAzMTkuODM5ODQ0IEwgMTU0Ljg3NSAzMTkuODM5ODQ0IEMgMTUwLjc1NzgxMiAzMTkuODM5ODQ0IDE0Ny40MTc5NjkgMzE2LjUgMTQ3LjQxNzk2OSAzMTIuMzgyODEyIEMgMTQ3LjQxNzk2OSAzMDguMjYxNzE5IDE1MC43NTc4MTIgMzA0LjkyMTg3NSAxNTQuODc1IDMwNC45MjE4NzUgTCAxODAuMDM5MDYyIDMwNC45MjE4NzUgTCAxODAuMDM5MDYyIDI3OC42MzY3MTkgQyAxNjAuMDA3ODEyIDI3Ny4wMDM5MDYgMTQxLjgxNjQwNiAyNjguODI0MjE5IDEyNy41NDI5NjkgMjU2LjI5Njg3NSBMIDk2LjM1MTU2MiAyODcuNDg0Mzc1IEMgOTUuMTMyODEyIDI4OC43MDMxMjUgOTMuNTMxMjUgMjg5LjMxNjQwNiA5MS45MzM1OTQgMjg5LjMxNjQwNiBDIDkwLjMzNTkzOCAyODkuMzE2NDA2IDg4LjczNDM3NSAyODguNzAzMTI1IDg3LjUxNTYyNSAyODcuNDg0Mzc1IEMgODUuMDc0MjE5IDI4NS4wNDI5NjkgODUuMDc0MjE5IDI4MS4wODU5MzggODcuNTE1NjI1IDI3OC42NDQ1MzEgTCAxMTguNzYxNzE5IDI0Ny4zOTg0MzggQyAxMDQuOTI5Njg4IDIzMS40Mzc1IDk2LjQ4NDM3NSAyMTAuNjg3NSA5Ni40ODQzNzUgMTg3Ljk1MzEyNSBDIDk2LjQ4NDM3NSAxODMuODMyMDMxIDk5LjgyNDIxOSAxODAuNDk2MDk0IDEwMy45NDE0MDYgMTgwLjQ5NjA5NCBDIDEwOC4wNjI1IDE4MC40OTYwOTQgMTExLjQwMjM0NCAxODMuODM1OTM4IDExMS40MDIzNDQgMTg3Ljk1MzEyNSBDIDExMS40MDIzNDQgMjA2LjU3NDIxOSAxMTguMTQ4NDM4IDIyMy42Mjg5MDYgMTI5LjI5Mjk2OSAyMzYuODY3MTg4IEwgMTM1LjYyODkwNiAyMzAuNTMxMjUgQyAxMjYuMDg5ODQ0IDIxOC45Mzc1IDEyMC4zNTU0NjkgMjA0LjEwNTQ2OSAxMjAuMzU1NDY5IDE4Ny45NTMxMjUgTCAxMjAuMzU1NDY5IDEyMi4zMDA3ODEgQyAxMjAuMzU1NDY5IDg1LjI4MTI1IDE1MC40NzY1NjIgNTUuMTYwMTU2IDE4Ny40OTYwOTQgNTUuMTYwMTU2IEMgMjIxLjEyODkwNiA1NS4xNjAxNTYgMjQ4Ljk4MDQ2OSA4MC4wMzkwNjIgMjUzLjgxNjQwNiAxMTIuMzQzNzUgTCAyNzguNjQwNjI1IDg3LjUxNTYyNSBDIDI4MS4wODIwMzEgODUuMDc4MTI1IDI4NS4wMzkwNjIgODUuMDc4MTI1IDI4Ny40ODA0NjkgODcuNTE1NjI1IEMgMjg5LjkyNTc4MSA4OS45NTcwMzEgMjg5LjkyNTc4MSA5My45MTQwNjIgMjg3LjQ4NDM3NSA5Ni4zNTU0NjkgWiBNIDI4Ny40ODQzNzUgOTYuMzU1NDY5IFxcXCIgZmlsbC1vcGFjaXR5PVxcXCIxXFxcIiBmaWxsLXJ1bGU9XFxcIm5vbnplcm9cXFwiLz48L3N2Zz5cIjsiLCJleHBvcnQgZGVmYXVsdCBcIjw/eG1sIHZlcnNpb249XFxcIjEuMFxcXCIgZW5jb2Rpbmc9XFxcIlVURi04XFxcIj8+XFxuPHN2ZyBpZD1cXFwiTGF5ZXJfMVxcXCIgZGF0YS1uYW1lPVxcXCJMYXllciAxXFxcIiB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAzMDcgNjQwXFxcIj5cXG4gIDxkZWZzPlxcbiAgICA8c3R5bGU+XFxuICAgICAgLmlubmVybW9zdCwgLnNlY29uZCwgLnRoaXJkLCAuZm91cnRoLCAuZmlmdGgsIC5vdXRlcm1vc3Qge1xcbiAgICAgICAgc3Ryb2tlLXdpZHRoOiAwcHg7XFxuICAgICAgfVxcbiAgICAgIFxcbiAgICAgIC5vdXRlcm1vc3Qge1xcbiAgICAgICAgZmlsbDogI2U0ZjJkMTtcXG4gICAgICB9XFxuXFxuICAgICAgLnNlY29uZCB7XFxuICAgICAgICBmaWxsOiAjY2NlOGI1O1xcbiAgICAgIH1cXG5cXG4gICAgICAudGhpcmQge1xcbiAgICAgICAgZmlsbDogI2IzZGI5NTtcXG4gICAgICB9XFxuXFxuICAgICAgLmZvdXJ0aCB7XFxuICAgICAgICBmaWxsOiAjOWJkMDc4O1xcbiAgICAgIH1cXG5cXG4gICAgICAuZmlmdGgge1xcbiAgICAgICAgZmlsbDogIzgzYzU1YztcXG4gICAgICB9XFxuXFxuICAgICAgLmlubmVybW9zdCB7XFxuICAgICAgICBmaWxsOiAjNDI4YTJmO1xcbiAgICAgIH1cXG4gICAgPC9zdHlsZT5cXG4gIDwvZGVmcz5cXG4gIDxwYXRoIGNsYXNzPVxcXCJvdXRlcm1vc3RcXFwiIGQ9XFxcIm0zMDYuOSwzMjBjMCwxMDUuMy0uMDIsMjEwLjYuMSwzMTUuOTEsMCwzLjQyLS42Nyw0LjEtNC4wOSw0LjA5LTk5LjYtLjEyLTE5OS4yMS0uMTItMjk4LjgxLDBDLjY3LDY0MCwwLDYzOS4zMywwLDYzNS45MS4xMSw0MjUuMy4xMSwyMTQuNywwLDQuMDksMCwuNjcuNjcsMCw0LjA5LDAsMTAzLjcuMTIsMjAzLjMuMTIsMzAyLjkxLDBjMy40MiwwLDQuMS42Nyw0LjA5LDQuMDktLjEyLDEwNS4zLS4xLDIxMC42LS4xLDMxNS45MVpcXFwiLz5cXG4gIDxwYXRoIGNsYXNzPVxcXCJzZWNvbmRcXFwiIGQ9XFxcIm0yNzUuOTIsMzIzYzAsODcuNjMsMCwxNzUuMjcsMCwyNjIuOSwwLDcuMjQtLjU1LDcuOTMtNy44Niw3Ljk4LTE0LjY2LjA5LTI5LjMxLjAzLTQzLjk3LjAzLTYwLjk2LDAtMTIxLjkyLDAtMTgyLjg4LDBxLTcuMTMsMC03LjE0LTcuMjRjMC0xNzYuMSwwLTM1Mi4yMSwwLTUyOC4zMXEwLTcuMjYsNy4xMi03LjI2Yzc1Ljc4LDAsMTUxLjU2LDAsMjI3LjM1LDBxNy4zOCwwLDcuMzgsNy41YzAsODguMTMsMCwxNzYuMjcsMCwyNjQuNFpcXFwiLz5cXG4gIDxwYXRoIGNsYXNzPVxcXCJ0aGlyZFxcXCIgZD1cXFwibTY4LjA2LDMyMi4yNGMwLTY5LjQ3LDAtMTM4Ljk0LDAtMjA4LjQxLDAtOC45OSwxLjMzLTEwLjEzLDEwLjQ5LTkuMTIsMS45OC4yMiwzLjk4LjMyLDUuOTcuMzIsNDYuMTMuMDIsOTIuMjYuMDIsMTM4LjM5LDAsMy40OCwwLDYuOTItLjIzLDEwLjQxLS42Nyw1LjUtLjcsOC43NC40Niw4LjczLDcuMjUtLjE4LDEzOC45NC0uMTMsMjc3Ljg4LS4xMyw0MTYuODEsMCwuMzMsMCwuNjcsMCwxcS0uMTQsMTAuNTEtMTAuMzksMTAuNTFjLTUyLjEzLDAtMTA0LjI1LDAtMTU2LjM4LDBxLTcuMDksMC03LjA5LTcuMjhjMC03MC4xNCwwLTE0MC4yNywwLTIxMC40MVpcXFwiLz5cXG4gIDxwYXRoIGNsYXNzPVxcXCJmb3VydGhcXFwiIGQ9XFxcIm0xMDMuMDIsMzIyLjVjMC01Mi40NiwwLTEwNC45MSwwLTE1Ny4zNywwLTYuNjguMzYtNy4wNiw3LjA3LTcuMDYsMzAuMy0uMDEsNjAuNi4wNyw5MC45LS4wOSw0LjU0LS4wMiw2LjA4LDEuMzMsNi4wNyw1Ljk4LS4xLDEwNS41OC0uMSwyMTEuMTYsMCwzMTYuNzQsMCw0LjE4LTEuMjcsNS4zNy01LjM4LDUuMzUtMjkuMy0uMTUtNTguNi0uMDgtODcuOS0uMDhxLTEwLjc2LDAtMTAuNzYtMTEuMDljMC01MC43OSwwLTEwMS41OCwwLTE1Mi4zN1pcXFwiLz5cXG4gIDxwYXRoIGNsYXNzPVxcXCJmaWZ0aFxcXCIgZD1cXFwibTE3MywzMjIuMmMwLDM1LjI5LDAsNzAuNTgsMCwxMDUuODhxMCw2Ljg5LTYuOTksNi45Yy04LjE1LDAtMTYuMzEtLjEzLTI0LjQ2LjA2LTMuNDcuMDgtNC42OC0xLjA5LTQuNjEtNC41OS4xOC05LjY1LjA2LTE5LjMxLjA2LTI4Ljk2LDAtNTguMjYtLjAxLTExNi41My4wMi0xNzQuNzksMC00Ljc2LTEuMTItOS40Ni0uMTQtMTQuMy41MS0yLjU0LDEuMzktMy4zOCwzLjgtMy4zNiw4LjgyLjA2LDE3LjY0LjE0LDI2LjQ2LS4wMiw0LjU5LS4wOSw1Ljk1LDEuODUsNS45NCw2LjMzLS4xNCwzNS42Mi0uMDgsNzEuMjUtLjA4LDEwNi44N1pcXFwiLz5cXG4gIDxwYXRoIGNsYXNzPVxcXCJpbm5lcm1vc3RcXFwiIGQ9XFxcIm0xNTEuMDQsMzIyLjAxYzAtOS45OS4wNy0xOS45Ny0uMDUtMjkuOTYtLjA0LTIuOTMuODMtNC4xOCwzLjk1LTQuMTgsMy4wNiwwLDQuMDMsMS4xMiw0LjAyLDQuMTEtLjA5LDE5Ljk3LS4wOCwzOS45NC4wMSw1OS45MS4wMSwyLjk2LS44NCw0LjE2LTMuOTYsNC4xNC0zLjAzLS4wMS00LjA4LTEuMDQtNC4wMy00LjA4LjE0LTkuOTguMDUtMTkuOTcuMDUtMjkuOTZaXFxcIi8+XFxuPC9zdmc+XCI7IiwiZXhwb3J0IGRlZmF1bHQgXCI8c3ZnIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgdmVyc2lvbj1cXFwiMS4wXFxcIiB2aWV3Qm94PVxcXCIwIDAgNTYuMjUgMzBcXFwiIGNsYXNzPVxcXCJ3YXZlZm9ybVxcXCI+XFxuICAgIDxkZWZzPlxcbiAgICAgICAgPGNsaXBQYXRoIGlkPVxcXCJhXFxcIj5cXG4gICAgICAgICAgICA8cGF0aCBkPVxcXCJNLjU0IDEySDN2NUguNTRabTAgMFxcXCIvPlxcbiAgICAgICAgPC9jbGlwUGF0aD5cXG4gICAgICAgIDxjbGlwUGF0aCBpZD1cXFwiYlxcXCI+XFxuICAgICAgICAgICAgPHBhdGggZD1cXFwiTTI1IDIuMmgydjI0LjY4aC0yWm0wIDBcXFwiLz5cXG4gICAgICAgIDwvY2xpcFBhdGg+XFxuICAgICAgICA8Y2xpcFBhdGggaWQ9XFxcImNcXFwiPlxcbiAgICAgICAgICAgIDxwYXRoIGQ9XFxcIk01MyAxMmgxLjk4djVINTNabTAgMFxcXCIvPlxcbiAgICAgICAgPC9jbGlwUGF0aD5cXG4gICAgPC9kZWZzPlxcbiAgICA8ZyBjbGlwLXBhdGg9XFxcInVybCgjYSlcXFwiPlxcbiAgICAgICAgPHBhdGggZD1cXFwiTTEuNDggMTIuNzFjLS41IDAtLjkuNC0uOS45djEuODVhLjkuOSAwIDAgMCAxLjggMHYtMS44NGMwLS41LS40LS45LS45LS45Wm0wIDBcXFwiLz5cXG4gICAgPC9nPlxcbiAgICA8cGF0aCBkPVxcXCJNNC45OCA2LjYzYy0uNSAwLS45LjQtLjkuOXYxNC4wMWEuOS45IDAgMCAwIDEuODEgMHYtMTRjMC0uNS0uNC0uOTItLjktLjkyWm0zLjUxIDMuMWEuOS45IDAgMCAwLS45LjkxdjcuNzlhLjkuOSAwIDAgMCAxLjggMHYtNy43OWMwLS41LS40LS45LS45LS45Wk0xMiAzLjgzYS45LjkgMCAwIDAtLjkxLjl2MTkuNmEuOS45IDAgMCAwIDEuOCAwVjQuNzRjMC0uNS0uNC0uOS0uOS0uOVptMy41IDguMjlhLjkuOSAwIDAgMC0uOTEuOXYzLjAzYS45LjkgMCAwIDAgMS44MSAwdi0zLjAzYzAtLjUtLjQtLjktLjktLjlaTTE5IDYuOGMtLjUgMC0uOS40LS45Ljl2MTMuNjhhLjkuOSAwIDAgMCAxLjggMFY3LjdjMC0uNS0uNC0uOS0uOS0uOVptMy41OC0yLjk3aC0uMDFjLS41IDAtLjkuNC0uOS45bC0uMTMgMTkuNmMwIC41LjQuOS45LjkxLjUgMCAuOS0uNC45LS45bC4xNC0xOS42YS45LjkgMCAwIDAtLjktLjlabTAgMFxcXCIvPlxcbiAgICA8ZyBjbGlwLXBhdGg9XFxcInVybCgjYilcXFwiPlxcbiAgICAgICAgPHBhdGggZD1cXFwiTTI2IDIuMmMtLjUgMC0uOS40LS45Ljl2MjIuODZhLjkuOSAwIDEgMCAxLjgxIDBWMy4xMWEuOS45IDAgMCAwLS45LS45MVptMCAwXFxcIi8+XFxuICAgIDwvZz5cXG4gICAgPHBhdGggZD1cXFwiTTI5LjUyIDcuNzFhLjkuOSAwIDAgMC0uOTEuOXYxMS44NWEuOS45IDAgMCAwIDEuODEgMFY4LjYyYzAtLjUtLjQtLjktLjktLjlabTMuNSAyLjkzYS45LjkgMCAwIDAtLjkuOTF2NS45N2EuOS45IDAgMCAwIDEuOCAwdi01Ljk3YzAtLjUtLjQtLjktLjktLjlabTMuNS01Ljc4Yy0uNSAwLS45LjQtLjkuOXYxNy41NWEuOS45IDAgMCAwIDEuODEgMFY1Ljc2YzAtLjUtLjQtLjktLjktLjlabTMuNTEgMy4zNGMtLjUgMC0uOS40LS45Ljl2MTAuODdhLjkuOSAwIDAgMCAxLjggMFY5LjFhLjkuOSAwIDAgMC0uOS0uOTFabTMuNSAzLjA4Yy0uNSAwLS45LjQtLjkuOTF2NC43YS45LjkgMCAxIDAgMS44IDB2LTQuN2EuOS45IDAgMCAwLS45LS45Wm0zLjUxLTcuNDVhLjkuOSAwIDAgMC0uOTEuOXYxOS42YS45LjkgMCAwIDAgMS44MSAwVjQuNzRjMC0uNS0uNC0uOS0uOS0uOVptMy41IDUuNTdhLjkuOSAwIDAgMC0uOS45MXY4LjQ1YS45LjkgMCAwIDAgMS44IDB2LTguNDVjMC0uNS0uNC0uOS0uOS0uOVptMCAwXFxcIi8+XFxuICAgIDxnIGNsaXAtcGF0aD1cXFwidXJsKCNjKVxcXCI+XFxuICAgICAgICA8cGF0aCBkPVxcXCJNNTQuMDQgMTIuOTZhLjkuOSAwIDAgMC0uOS45MXYxLjMzYS45LjkgMCAxIDAgMS44IDB2LTEuMzJhLjkuOSAwIDAgMC0uOS0uOTJabTAgMFxcXCIvPlxcbiAgICA8L2c+XFxuPC9zdmc+XCI7IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3JlY3RhbmdsZXMuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9yZWN0YW5nbGVzLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3J1bGVTZXRbMV0ucnVsZXNbM10udXNlWzFdIS4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cnVsZVNldFsxXS5ydWxlc1szXS51c2VbMl0hLi9jb21tb24uc2Nzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9ydWxlU2V0WzFdLnJ1bGVzWzNdLnVzZVsxXSEuLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvZGlzdC9janMuanM/P3J1bGVTZXRbMV0ucnVsZXNbM10udXNlWzJdIS4vY29tbW9uLnNjc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9ydWxlU2V0WzFdLnJ1bGVzWzNdLnVzZVsxXSEuLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvZGlzdC9janMuanM/P3J1bGVTZXRbMV0ucnVsZXNbM10udXNlWzJdIS4vZGVza3RvcC5zY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3J1bGVTZXRbMV0ucnVsZXNbM10udXNlWzFdIS4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cnVsZVNldFsxXS5ydWxlc1szXS51c2VbMl0hLi9kZXNrdG9wLnNjc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9ydWxlU2V0WzFdLnJ1bGVzWzNdLnVzZVsxXSEuLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvZGlzdC9janMuanM/P3J1bGVTZXRbMV0ucnVsZXNbM10udXNlWzJdIS4vbW9iaWxlLnNjc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cnVsZVNldFsxXS5ydWxlc1szXS51c2VbMV0hLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9ydWxlU2V0WzFdLnJ1bGVzWzNdLnVzZVsyXSEuL21vYmlsZS5zY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCJleHBvcnQgZnVuY3Rpb24gYXBwZW5kQ2hpbGQoXG4gIHBhcmVudDogRWxlbWVudCxcbiAgY2hpbGQ6IE5vZGUsXG4gIHBvc2l0aW9uOiBudW1iZXIgPSAwXG4pOiB2b2lkIHtcbiAgLy8gQ2hlY2sgaWYgYSBjb250YWluZXIgaXMgcHJvdmlkZWQuXG4gIGlmIChwYXJlbnQpIHtcbiAgICAvLyBJZiBwb3NpdGlvbiBpcyAwLCBzaW1wbHkgYXBwZW5kIHRoZSBidXR0b24gYXMgdGhlIGxhc3QgY2hpbGQuXG4gICAgaWYgKHBvc2l0aW9uID09PSAwKSB7XG4gICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBDYWxjdWxhdGUgdGhlIGluZGV4IG9mIHRoZSByZWZlcmVuY2Ugbm9kZSBmb3IgaW5zZXJ0QmVmb3JlKCkuXG4gICAgICBjb25zdCByZWZlcmVuY2VJbmRleCA9IHBhcmVudC5jaGlsZHJlbi5sZW5ndGggKyBwb3NpdGlvbjtcbiAgICAgIGNvbnN0IHJlZmVyZW5jZU5vZGUgPSBwYXJlbnQuY2hpbGRyZW5bcmVmZXJlbmNlSW5kZXhdO1xuXG4gICAgICAvLyBJZiBhIHJlZmVyZW5jZSBub2RlIGV4aXN0cywgaW5zZXJ0IHRoZSBidXR0b24gYmVmb3JlIGl0LlxuICAgICAgaWYgKHJlZmVyZW5jZU5vZGUpIHtcbiAgICAgICAgcGFyZW50Lmluc2VydEJlZm9yZShjaGlsZCwgcmVmZXJlbmNlTm9kZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBJZiBub3QsIGFwcGVuZCB0aGUgYnV0dG9uIGFzIHRoZSBsYXN0IGNoaWxkLlxuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBJZiBubyBjb250YWluZXIgaXMgcHJvdmlkZWQsIGFwcGVuZCB0aGUgYnV0dG9uIHRvIHRoZSBib2R5LlxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBzZXRQcm9tcHRUZXh0IH0gZnJvbSBcIi4vVHJhbnNjcmlwdGlvbk1vZHVsZVwiO1xuXG5pbnRlcmZhY2UgUmVzdG9yZVBvaW50IHtcbiAgcHJvbXB0OiBzdHJpbmc7XG4gIGF1ZGlvSW5wdXRFbmFibGVkOiBib29sZWFuO1xuICBhdWRpb091dHB1dEVuYWJsZWQ6IGJvb2xlYW47XG4gIGNyZWF0aW9uVGltZTogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgUmVzdG9yZVBvaW50QXV0b0RhdGUge1xuICBwcm9tcHQ6IHN0cmluZztcbiAgYXVkaW9JbnB1dEVuYWJsZWQ6IGJvb2xlYW47XG4gIGF1ZGlvT3V0cHV0RW5hYmxlZDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3VibWl0RXJyb3JIYW5kbGVyIHtcbiAgcHJpdmF0ZSByZXN0b3JlUG9pbnRLZXk6IHN0cmluZztcbiAgcHJpdmF0ZSBhdWRpb091dHB1dFN0YXR1czogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8vIEluaXRpYWxpc2UgcHJvcGVydGllcyBpZiBuZWVkZWRcbiAgICB0aGlzLnJlc3RvcmVQb2ludEtleSA9IFwicmVzdG9yZVBvaW50XCI7XG4gIH1cblxuICBpbml0QXVkaW9PdXRwdXRMaXN0ZW5lcigpOiB2b2lkIHtcbiAgICBjb25zdCBhdWRpb091dHB1dEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgXCJzYXlwaS1hdWRpby1vdXRwdXQtYnV0dG9uXCJcbiAgICApO1xuICAgIGlmIChhdWRpb091dHB1dEJ1dHRvbikge1xuICAgICAgYXVkaW9PdXRwdXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICB0aGlzLmhhbmRsZUF1ZGlvT3V0cHV0Q2xpY2suYmluZCh0aGlzKVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICAvLyBFdmVudCBoYW5kbGVyXG4gIHByaXZhdGUgaGFuZGxlQXVkaW9PdXRwdXRDbGljaygpOiB2b2lkIHtcbiAgICB0aGlzLmF1ZGlvT3V0cHV0U3RhdHVzID0gIXRoaXMuYXVkaW9PdXRwdXRTdGF0dXM7IC8vIFRvZ2dsZSB0aGUgc3RhdGVcbiAgfVxuXG4gIC8vIDEuIERldGVjdCB3aGVuIGEgc3VibWl0IGVycm9yIG9jY3Vyc1xuICBkZXRlY3RTdWJtaXRFcnJvcigpOiBib29sZWFuIHtcbiAgICBjb25zdCBzdWJtaXRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgIFwic2F5cGktc3VibWl0QnV0dG9uXCJcbiAgICApIGFzIEhUTUxCdXR0b25FbGVtZW50IHwgbnVsbDtcbiAgICBjb25zdCB0ZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgXCJzYXlwaS1wcm9tcHRcIlxuICAgICkgYXMgSFRNTFRleHRBcmVhRWxlbWVudCB8IG51bGw7XG4gICAgaWYgKHN1Ym1pdEJ1dHRvbiAmJiB0ZXh0YXJlYSkge1xuICAgICAgaWYgKHN1Ym1pdEJ1dHRvbi5kaXNhYmxlZCAmJiB0ZXh0YXJlYS52YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyAyLiBDcmVhdGUgYSBcInJlc3RvcmUgcG9pbnRcIiBjYXB0dXJpbmcgYXBwbGljYXRpb24gc3RhdGVcbiAgY3JlYXRlUmVzdG9yZVBvaW50KHtcbiAgICBwcm9tcHQ6IG1lc3NhZ2UsXG4gICAgYXVkaW9JbnB1dEVuYWJsZWQ6IGF1ZGlvSW5wdXRTdGF0dXMsXG4gICAgYXVkaW9PdXRwdXRFbmFibGVkOiBhdWRpb091dHB1dFN0YXR1cyxcbiAgfTogUmVzdG9yZVBvaW50QXV0b0RhdGUpOiB2b2lkIHtcbiAgICBjb25zdCByZXN0b3JlUG9pbnQ6IFJlc3RvcmVQb2ludCA9IHtcbiAgICAgIHByb21wdDogbWVzc2FnZSxcbiAgICAgIGF1ZGlvSW5wdXRFbmFibGVkOiBhdWRpb0lucHV0U3RhdHVzLFxuICAgICAgYXVkaW9PdXRwdXRFbmFibGVkOiBhdWRpb091dHB1dFN0YXR1cyxcbiAgICAgIGNyZWF0aW9uVGltZTogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIH07XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5yZXN0b3JlUG9pbnRLZXksIEpTT04uc3RyaW5naWZ5KHJlc3RvcmVQb2ludCkpO1xuICB9XG5cbiAgLy8gMy4gUHJvZ3JhbW1hdGljYWxseSByZWxvYWQgdGhlIHBhZ2VcbiAgcmVsb2FkUGFnZSgpOiB2b2lkIHtcbiAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gIH1cblxuICBoYW5kbGVTdWJtaXRFcnJvcigpOiB2b2lkIHtcbiAgICBjb25zdCB0ZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgXCJzYXlwaS1wcm9tcHRcIlxuICAgICkgYXMgSFRNTFRleHRBcmVhRWxlbWVudCB8IG51bGw7XG4gICAgY29uc3QgcHJvbXB0ID0gdGV4dGFyZWEgPyB0ZXh0YXJlYS52YWx1ZSA6IFwiXCI7XG5cbiAgICBsZXQgYXVkaW9JbnB1dFN0YXR1cyA9IHRydWU7XG4gICAgY29uc3QgY2FsbEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F5cGktY2FsbEJ1dHRvblwiKTtcbiAgICBpZiAoY2FsbEJ1dHRvbikge1xuICAgICAgYXVkaW9JbnB1dFN0YXR1cyA9IGNhbGxCdXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlXCIpO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKFwiQ3JlYXRpbmcgcmVzdG9yZSBwb2ludFwiKTtcbiAgICB0aGlzLmNyZWF0ZVJlc3RvcmVQb2ludCh7XG4gICAgICBwcm9tcHQ6IHByb21wdCxcbiAgICAgIGF1ZGlvSW5wdXRFbmFibGVkOiBhdWRpb0lucHV0U3RhdHVzLFxuICAgICAgYXVkaW9PdXRwdXRFbmFibGVkOiB0aGlzLmF1ZGlvT3V0cHV0U3RhdHVzLFxuICAgIH0pO1xuICAgIGNvbnNvbGUubG9nKFwiUmVsb2FkaW5nIHBhZ2VcIik7XG4gICAgdGhpcy5yZWxvYWRQYWdlKCk7XG4gIH1cblxuICAvLyA0LiBPbiBsb2FkLCBjaGVjayBmb3IgYSByZXN0b3JlIHBvaW50XG4gIGNoZWNrRm9yUmVzdG9yZVBvaW50KCk6IHZvaWQge1xuICAgIGNvbnN0IHN0b3JlZERhdGEgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLnJlc3RvcmVQb2ludEtleSk7XG4gICAgaWYgKHN0b3JlZERhdGEpIHtcbiAgICAgIGNvbnN0IHJlc3RvcmVQb2ludDogUmVzdG9yZVBvaW50ID0gSlNPTi5wYXJzZShzdG9yZWREYXRhKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gbmV3IERhdGUoKTtcbiAgICAgIGNvbnN0IHJlc3RvcmVUaW1lID0gbmV3IERhdGUocmVzdG9yZVBvaW50LmNyZWF0aW9uVGltZSk7XG5cbiAgICAgIGNvbnN0IHRpbWVEaWZmZXJlbmNlID1cbiAgICAgICAgKGN1cnJlbnRUaW1lLmdldFRpbWUoKSAtIHJlc3RvcmVUaW1lLmdldFRpbWUoKSkgLyAoMTAwMCAqIDYwKTsgLy8gaW4gbWludXRlc1xuXG4gICAgICBpZiAodGltZURpZmZlcmVuY2UgPD0gNSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlJlc3RvcmluZyBhcHBsaWNhdGlvbiBzdGF0ZVwiLCByZXN0b3JlUG9pbnQpO1xuICAgICAgICBzZXRQcm9tcHRUZXh0KHJlc3RvcmVQb2ludC5wcm9tcHQpO1xuICAgICAgICB0aGlzLmFjdGl2YXRlQXVkaW9JbnB1dChyZXN0b3JlUG9pbnQuYXVkaW9JbnB1dEVuYWJsZWQpO1xuICAgICAgICB0aGlzLmFjdGl2YXRlQXVkaW9PdXRwdXQocmVzdG9yZVBvaW50LmF1ZGlvT3V0cHV0RW5hYmxlZCk7XG4gICAgICAgIC8vIERlbGV0ZSB0aGUgZXhlY3V0ZWQgcmVzdG9yZSBwb2ludFxuICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLnJlc3RvcmVQb2ludEtleSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYWN0aXZhdGVBdWRpb0lucHV0KGVuYWJsZTogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmIChlbmFibGUpIHtcbiAgICAgIGNvbnN0IGNhbGxCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNheXBpLWNhbGxCdXR0b25cIik7XG4gICAgICBpZiAoY2FsbEJ1dHRvbikge1xuICAgICAgICBjYWxsQnV0dG9uLmNsaWNrKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYWN0aXZhdGVBdWRpb091dHB1dChlbmFibGU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAoZW5hYmxlKSB7XG4gICAgICBjb25zdCBhdWRpb091dHB1dEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgICBcInNheXBpLWF1ZGlvLW91dHB1dC1idXR0b25cIlxuICAgICAgKTtcbiAgICAgIGlmIChhdWRpb091dHB1dEJ1dHRvbikge1xuICAgICAgICBhdWRpb091dHB1dEJ1dHRvbi5jbGljaygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vLyBTaW5nbGV0b25cbmV4cG9ydCBjb25zdCBzdWJtaXRFcnJvckhhbmRsZXIgPSBuZXcgU3VibWl0RXJyb3JIYW5kbGVyKCk7XG4iLCJpbXBvcnQgeyBjb25maWcgfSBmcm9tIFwiLi9Db25maWdNb2R1bGUuanNcIjtcbmltcG9ydCBTdGF0ZU1hY2hpbmVTZXJ2aWNlIGZyb20gXCIuL1N0YXRlTWFjaGluZVNlcnZpY2UuanNcIjtcbmltcG9ydCB7IGlzTW9iaWxlVmlldyB9IGZyb20gXCIuL1VzZXJBZ2VudE1vZHVsZS5qc1wiO1xuaW1wb3J0IEV2ZW50QnVzIGZyb20gXCIuL0V2ZW50QnVzLmpzXCI7XG5pbXBvcnQgRXZlbnRNb2R1bGUgZnJvbSBcIi4vRXZlbnRNb2R1bGUuanNcIjtcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gXCIuL0xvZ2dpbmdNb2R1bGUuanNcIjtcblxuLy8gRGVmaW5lIHRoZSBzaGFwZSBvZiB0aGUgcmVzcG9uc2UgSlNPTiBvYmplY3RcbmludGVyZmFjZSBUcmFuc2NyaXB0aW9uUmVzcG9uc2Uge1xuICB0ZXh0OiBzdHJpbmc7XG4gIHNlcXVlbmNlTnVtYmVyOiBudW1iZXI7XG4gIHBGaW5pc2hlZFNwZWFraW5nPzogbnVtYmVyO1xufVxuXG5jb25zdCBrbm93bk5ldHdvcmtFcnJvck1lc3NhZ2VzID0gW1xuICBcIkZhaWxlZCB0byBmZXRjaFwiLCAvLyBDaHJvbWl1bS1iYXNlZCBicm93c2Vyc1xuICBcIkxvYWQgZmFpbGVkXCIsIC8vIFNhZmFyaVxuICBcIk5ldHdvcmtFcnJvciB3aGVuIGF0dGVtcHRpbmcgdG8gZmV0Y2ggcmVzb3VyY2UuXCIsIC8vIEZpcmVmb3hcbiAgLy8gQWRkIG1vcmUga25vd24gZXJyb3IgbWVzc2FnZXMgaGVyZVxuXTtcblxuLy8gdGltZW91dCBmb3IgdHJhbnNjcmlwdGlvbiByZXF1ZXN0c1xuY29uc3QgVElNRU9VVF9NUyA9IDMwMDAwOyAvLyAzMCBzZWNvbmRzXG5cbi8vIHRyYWNrIHNlcXVlbmNlIG51bWJlcnMgZm9yIGluLWZsaWdodCB0cmFuc2NyaXB0aW9uIHJlcXVlc3RzXG5sZXQgc2VxdWVuY2VOdW0gPSAwO1xuY29uc3Qgc2VxdWVuY2VOdW1zUGVuZGluZ1RyYW5zY3JpcHRpb246IFNldDx7XG4gIHNlcTogbnVtYmVyO1xuICB0aW1lc3RhbXA6IG51bWJlcjtcbn0+ID0gbmV3IFNldCgpO1xuXG5mdW5jdGlvbiBjaGVja0ZvckV4cGlyZWRFbnRyaWVzKCkge1xuICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICBzZXF1ZW5jZU51bXNQZW5kaW5nVHJhbnNjcmlwdGlvbi5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgIGlmIChub3cgLSBlbnRyeS50aW1lc3RhbXAgPiBUSU1FT1VUX01TKSB7XG4gICAgICBzZXF1ZW5jZU51bXNQZW5kaW5nVHJhbnNjcmlwdGlvbi5kZWxldGUoZW50cnkpO1xuICAgICAgbG9nZ2VyLmluZm8oYFRyYW5zY3JpcHRpb24gcmVxdWVzdCAke2VudHJ5LnNlcX0gdGltZWQgb3V0YCk7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gdHJhbnNjcmlwdGlvblNlbnQoKTogdm9pZCB7XG4gIHNlcXVlbmNlTnVtKys7XG4gIHNlcXVlbmNlTnVtc1BlbmRpbmdUcmFuc2NyaXB0aW9uLmFkZCh7XG4gICAgc2VxOiBzZXF1ZW5jZU51bSxcbiAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gIH0pO1xufVxuXG5mdW5jdGlvbiB0cmFuc2NyaXB0aW9uUmVjZWl2ZWQoc2VxOiBudW1iZXIpOiB2b2lkIHtcbiAgLy8gZGVsZXRlIGVudHJ5IHdpdGggbWF0Y2hpbmcgc2VxdWVuY2UgbnVtYmVyXG4gIHNlcXVlbmNlTnVtc1BlbmRpbmdUcmFuc2NyaXB0aW9uLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgaWYgKGVudHJ5LnNlcSA9PT0gc2VxKSB7XG4gICAgICBzZXF1ZW5jZU51bXNQZW5kaW5nVHJhbnNjcmlwdGlvbi5kZWxldGUoZW50cnkpO1xuICAgICAgbG9nZ2VyLmRlYnVnKFxuICAgICAgICBgVHJhbnNjcmlwdGlvbiByZXNwb25zZSAke3NlcX0gcmVjZWl2ZWQgYWZ0ZXIgJHtcbiAgICAgICAgICAoRGF0ZS5ub3coKSAtIGVudHJ5LnRpbWVzdGFtcCkgLyAxMDAwXG4gICAgICAgIH1zYFxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNUcmFuc2NyaXB0aW9uUGVuZGluZygpOiBib29sZWFuIHtcbiAgY2hlY2tGb3JFeHBpcmVkRW50cmllcygpO1xuICByZXR1cm4gc2VxdWVuY2VOdW1zUGVuZGluZ1RyYW5zY3JpcHRpb24uc2l6ZSA+IDA7XG59XG5cbi8vIGNhbGwgYWZ0ZXIgY29tcGxldGVkIHVzZXIgaW5wdXQgaXMgc3VibWl0dGVkXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJQZW5kaW5nVHJhbnNjcmlwdGlvbnMoKTogdm9pZCB7XG4gIHNlcXVlbmNlTnVtc1BlbmRpbmdUcmFuc2NyaXB0aW9uLmNsZWFyKCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGxvYWRBdWRpb1dpdGhSZXRyeShcbiAgYXVkaW9CbG9iOiBCbG9iLFxuICBhdWRpb0R1cmF0aW9uTWlsbGlzOiBudW1iZXIsXG4gIG1heFJldHJpZXM6IG51bWJlciA9IDNcbik6IFByb21pc2U8dm9pZD4ge1xuICBsZXQgcmV0cnlDb3VudCA9IDA7XG4gIGxldCBkZWxheSA9IDEwMDA7IC8vIGluaXRpYWwgZGVsYXkgb2YgMSBzZWNvbmRcblxuICBjb25zdCBzbGVlcCA9IChtczogbnVtYmVyKSA9PlxuICAgIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG5cbiAgd2hpbGUgKHJldHJ5Q291bnQgPCBtYXhSZXRyaWVzKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRyYW5zY3JpcHRpb25TZW50KCk7XG4gICAgICBhd2FpdCB1cGxvYWRBdWRpbyhhdWRpb0Jsb2IsIGF1ZGlvRHVyYXRpb25NaWxsaXMpO1xuICAgICAgcmV0dXJuO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAvLyBjaGVjayBmb3IgdGltZW91dCBlcnJvcnMgKDMwcyBvbiBIZXJva3UpXG4gICAgICBpZiAoXG4gICAgICAgIGVycm9yIGluc3RhbmNlb2YgVHlwZUVycm9yICYmXG4gICAgICAgIGtub3duTmV0d29ya0Vycm9yTWVzc2FnZXMuaW5jbHVkZXMoZXJyb3IubWVzc2FnZSlcbiAgICAgICkge1xuICAgICAgICBsb2dnZXIuaW5mbyhcbiAgICAgICAgICBgQXR0ZW1wdCAke3JldHJ5Q291bnQgKyAxfS8ke21heFJldHJpZXN9IGZhaWxlZC4gUmV0cnlpbmcgaW4gJHtcbiAgICAgICAgICAgIGRlbGF5IC8gMTAwMFxuICAgICAgICAgIH0gc2Vjb25kcy4uLmBcbiAgICAgICAgKTtcbiAgICAgICAgYXdhaXQgc2xlZXAoZGVsYXkpO1xuXG4gICAgICAgIC8vIEV4cG9uZW50aWFsIGJhY2tvZmZcbiAgICAgICAgZGVsYXkgKj0gMjtcblxuICAgICAgICByZXRyeUNvdW50Kys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiVW5leHBlY3RlZCBlcnJvcjogXCIsIGVycm9yKTtcbiAgICAgICAgU3RhdGVNYWNoaW5lU2VydmljZS5hY3Rvci5zZW5kKFwic2F5cGk6dHJhbnNjcmliZUZhaWxlZFwiLCB7XG4gICAgICAgICAgZGV0YWlsOiBlcnJvcixcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zb2xlLmVycm9yKFwiTWF4IHJldHJpZXMgcmVhY2hlZC4gR2l2aW5nIHVwLlwiKTtcbiAgU3RhdGVNYWNoaW5lU2VydmljZS5hY3Rvci5zZW5kKFwic2F5cGk6dHJhbnNjcmliZUZhaWxlZFwiLCB7XG4gICAgZGV0YWlsOiBuZXcgRXJyb3IoXCJNYXggcmV0cmllcyByZWFjaGVkXCIpLFxuICB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gdXBsb2FkQXVkaW8oXG4gIGF1ZGlvQmxvYjogQmxvYixcbiAgYXVkaW9EdXJhdGlvbk1pbGxpczogbnVtYmVyXG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBmb3JtRGF0YSA9IGNvbnN0cnVjdFRyYW5zY3JpcHRpb25Gb3JtRGF0YShhdWRpb0Jsb2IpO1xuICAgIGNvbnN0IGxhbmd1YWdlID0gbmF2aWdhdG9yLmxhbmd1YWdlO1xuXG4gICAgY29uc3QgY29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICBjb25zdCB7IHNpZ25hbCB9ID0gY29udHJvbGxlcjtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4gY29udHJvbGxlci5hYm9ydCgpLCBUSU1FT1VUX01TKTtcblxuICAgIGNvbnN0IHN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIGNvbnN0IHJlc3BvbnNlOiBSZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgYCR7Y29uZmlnLmFwaVNlcnZlclVybH0vdHJhbnNjcmliZT9sYW5ndWFnZT0ke2xhbmd1YWdlfWAsXG4gICAgICB7XG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIGJvZHk6IGZvcm1EYXRhLFxuICAgICAgICBzaWduYWwsXG4gICAgICB9XG4gICAgKTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlc3BvbnNlLnN0YXR1c306ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNwb25zZUpzb246IFRyYW5zY3JpcHRpb25SZXNwb25zZSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICBjb25zdCBzZXEgPSByZXNwb25zZUpzb24uc2VxdWVuY2VOdW1iZXI7XG4gICAgaWYgKHNlcSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0cmFuc2NyaXB0aW9uUmVjZWl2ZWQoc2VxKTtcbiAgICB9XG4gICAgY29uc3QgZW5kVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIGNvbnN0IHRyYW5zY3JpcHRpb25EdXJhdGlvbk1pbGxpcyA9IGVuZFRpbWUgLSBzdGFydFRpbWU7XG4gICAgY29uc3QgdHJhbnNjcmlwdCA9IHJlc3BvbnNlSnNvbi50ZXh0O1xuICAgIGNvbnN0IHdjID0gdHJhbnNjcmlwdC5zcGxpdChcIiBcIikubGVuZ3RoO1xuICAgIGNvbnN0IHBheWxvYWQ6IFRyYW5zY3JpcHRpb25SZXNwb25zZSA9IHtcbiAgICAgIHRleHQ6IHRyYW5zY3JpcHQsXG4gICAgICBzZXF1ZW5jZU51bWJlcjogc2VxLFxuICAgIH07XG4gICAgaWYgKHJlc3BvbnNlSnNvbi5wRmluaXNoZWRTcGVha2luZykge1xuICAgICAgcGF5bG9hZC5wRmluaXNoZWRTcGVha2luZyA9IHJlc3BvbnNlSnNvbi5wRmluaXNoZWRTcGVha2luZztcbiAgICB9XG5cbiAgICBsb2dnZXIuaW5mbyhcbiAgICAgIGBUcmFuc2NyaWJlZCAke01hdGgucm91bmQoXG4gICAgICAgIGF1ZGlvRHVyYXRpb25NaWxsaXMgLyAxMDAwXG4gICAgICApfXMgb2YgYXVkaW8gaW50byAke3djfSB3b3JkcyBpbiAke01hdGgucm91bmQoXG4gICAgICAgIHRyYW5zY3JpcHRpb25EdXJhdGlvbk1pbGxpcyAvIDEwMDBcbiAgICAgICl9c2BcbiAgICApO1xuXG4gICAgaWYgKHJlc3BvbnNlSnNvbi50ZXh0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgU3RhdGVNYWNoaW5lU2VydmljZS5hY3Rvci5zZW5kKFwic2F5cGk6dHJhbnNjcmliZWRFbXB0eVwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgU3RhdGVNYWNoaW5lU2VydmljZS5hY3Rvci5zZW5kKFwic2F5cGk6dHJhbnNjcmliZWRcIiwgcGF5bG9hZCk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcjogdW5rbm93bikge1xuICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICBpZiAoZXJyb3IubmFtZSA9PT0gXCJBYm9ydEVycm9yXCIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkZldGNoIGFib3J0ZWQgZHVlIHRvIHRpbWVvdXRcIiwgZXJyb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkFuIHVuZXhwZWN0ZWQgZXJyb3Igb2NjdXJyZWQ6XCIsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcihcIlNvbWV0aGluZyB0aHJvd24gdGhhdCBpcyBub3QgYW4gRXJyb3Igb2JqZWN0OlwiLCBlcnJvcik7XG4gICAgfVxuXG4gICAgLy8gcmUtdGhyb3cgdGhlIGVycm9yIGlmIHlvdXIgbG9naWMgcmVxdWlyZXMgaXRcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG5mdW5jdGlvbiBjb25zdHJ1Y3RUcmFuc2NyaXB0aW9uRm9ybURhdGEoYXVkaW9CbG9iOiBCbG9iKSB7XG4gIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gIGxldCBhdWRpb0ZpbGVuYW1lID0gXCJhdWRpby53ZWJtXCI7XG5cbiAgaWYgKGF1ZGlvQmxvYi50eXBlID09PSBcImF1ZGlvL21wNFwiKSB7XG4gICAgYXVkaW9GaWxlbmFtZSA9IFwiYXVkaW8ubXA0XCI7XG4gIH0gZWxzZSBpZiAoYXVkaW9CbG9iLnR5cGUgPT09IFwiYXVkaW8vd2F2XCIpIHtcbiAgICBhdWRpb0ZpbGVuYW1lID0gXCJhdWRpby53YXZcIjtcbiAgfVxuXG4gIGxvZ2dlci5pbmZvKFxuICAgIGBUcmFuc2NyaWJpbmcgYXVkaW8gQmxvYiB3aXRoIE1JTUUgdHlwZTogJHthdWRpb0Jsb2IudHlwZX0sIHNpemU6ICR7KFxuICAgICAgYXVkaW9CbG9iLnNpemUgLyAxMDI0XG4gICAgKS50b0ZpeGVkKDIpfWtiYFxuICApO1xuXG4gIC8vIEFkZCB0aGUgYXVkaW8gYmxvYiB0byB0aGUgRm9ybURhdGEgb2JqZWN0XG4gIGZvcm1EYXRhLmFwcGVuZChcImF1ZGlvXCIsIGF1ZGlvQmxvYiwgYXVkaW9GaWxlbmFtZSk7XG4gIGZvcm1EYXRhLmFwcGVuZChcInNlcXVlbmNlTnVtYmVyXCIsIHNlcXVlbmNlTnVtLnRvU3RyaW5nKCkpO1xuICByZXR1cm4gZm9ybURhdGE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRQcm9tcHRUZXh0KHRyYW5zY3JpcHQ6IHN0cmluZyk6IHZvaWQge1xuICBsb2dnZXIuaW5mbyhgTWVyZ2VkIHRyYW5zY3JpcHQ6ICR7dHJhbnNjcmlwdH1gKTtcbiAgY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICBcInNheXBpLXByb21wdFwiXG4gICkgYXMgSFRNTFRleHRBcmVhRWxlbWVudDtcbiAgaWYgKGlzTW9iaWxlVmlldygpKSB7XG4gICAgLy8gaWYgdHJhbnNjcmlwdCBpcyA+IDEwMDAgY2hhcmFjdGVycywgdHJ1bmNhdGUgaXQgdG8gOTk5IGNoYXJhY3RlcnMgcGx1cyBhbiBlbGxpcHNpc1xuICAgIGlmICh0cmFuc2NyaXB0Lmxlbmd0aCA+IDEwMDApIHtcbiAgICAgIHRyYW5zY3JpcHQgPSBgJHt0cmFuc2NyaXB0LnN1YnN0cmluZygwLCA5OTkpfeKApmA7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgIGBUcmFuc2NyaXB0IHdhcyB0b28gbG9uZyBmb3IgUGkuIFRydW5jYXRlZCB0byA5OTkgY2hhcmFjdGVycywgbG9zaW5nIHRoZSBmb2xsb3dpbmcgdGV4dDogLi4uICR7dHJhbnNjcmlwdC5zdWJzdHJpbmcoXG4gICAgICAgICAgOTk5XG4gICAgICAgICl9YFxuICAgICAgKTtcbiAgICB9XG4gICAgRXZlbnRNb2R1bGUuc2V0TmF0aXZlVmFsdWUodGV4dGFyZWEsIHRyYW5zY3JpcHQpO1xuICAgIEV2ZW50QnVzLmVtaXQoXCJzYXlwaTphdXRvU3VibWl0XCIpO1xuICB9IGVsc2Uge1xuICAgIEV2ZW50TW9kdWxlLnNpbXVsYXRlVHlwaW5nKHRleHRhcmVhLCBgJHt0cmFuc2NyaXB0fSBgKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VUcmFuc2NyaXB0cyh0cmFuc2NyaXB0czogUmVjb3JkPG51bWJlciwgc3RyaW5nPik6IHN0cmluZyB7XG4gIGNvbnN0IHNvcnRlZEtleXMgPSBPYmplY3Qua2V5cyh0cmFuc2NyaXB0cylcbiAgICAubWFwKE51bWJlcilcbiAgICAuc29ydCgoYSwgYikgPT4gYSAtIGIpO1xuXG4gIGNvbnN0IHNvcnRlZFRyYW5zY3JpcHRzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIGZvciAoY29uc3Qga2V5IG9mIHNvcnRlZEtleXMpIHtcbiAgICBzb3J0ZWRUcmFuc2NyaXB0cy5wdXNoKHRyYW5zY3JpcHRzW2tleV0udHJpbSgpKTtcbiAgfVxuXG4gIHJldHVybiBzb3J0ZWRUcmFuc2NyaXB0cy5qb2luKFwiIFwiKTtcbn1cbiIsImltcG9ydCB7IGJ1dHRvbk1vZHVsZSB9IGZyb20gXCIuLi9CdXR0b25Nb2R1bGUuanNcIjtcbmltcG9ydCB7IGNyZWF0ZU1hY2hpbmUsIFR5cGVzdGF0ZSwgYXNzaWduIH0gZnJvbSBcInhzdGF0ZVwiO1xuaW1wb3J0IEFuaW1hdGlvbk1vZHVsZSBmcm9tIFwiLi4vQW5pbWF0aW9uTW9kdWxlLmpzXCI7XG5pbXBvcnQgeyBpc01vYmlsZVZpZXcgfSBmcm9tIFwiLi4vVXNlckFnZW50TW9kdWxlLmpzXCI7XG5pbXBvcnQge1xuICB1cGxvYWRBdWRpb1dpdGhSZXRyeSxcbiAgc2V0UHJvbXB0VGV4dCxcbiAgaXNUcmFuc2NyaXB0aW9uUGVuZGluZyxcbiAgY2xlYXJQZW5kaW5nVHJhbnNjcmlwdGlvbnMsXG4gIG1lcmdlVHJhbnNjcmlwdHMsXG59IGZyb20gXCIuLi9UcmFuc2NyaXB0aW9uTW9kdWxlXCI7XG5pbXBvcnQgRXZlbnRCdXMgZnJvbSBcIi4uL0V2ZW50QnVzXCI7XG5cbnR5cGUgU2F5UGlFdmVudCA9XG4gIHwgeyB0eXBlOiBcInNheXBpOnVzZXJTcGVha2luZ1wiIH1cbiAgfCB7IHR5cGU6IFwic2F5cGk6dXNlclN0b3BwZWRTcGVha2luZ1wiOyBkdXJhdGlvbjogbnVtYmVyOyBibG9iPzogQmxvYiB9XG4gIHwgeyB0eXBlOiBcInNheXBpOnVzZXJGaW5pc2hlZFNwZWFraW5nXCIgfVxuICB8IHsgdHlwZTogXCJzYXlwaTp0cmFuc2NyaWJlZFwiOyB0ZXh0OiBzdHJpbmc7IHBGaW5pc2hlZFNwZWFraW5nPzogbnVtYmVyIH1cbiAgfCB7IHR5cGU6IFwic2F5cGk6dHJhbnNjcmliZUZhaWxlZFwiIH1cbiAgfCB7IHR5cGU6IFwic2F5cGk6dHJhbnNjcmliZWRFbXB0eVwiIH1cbiAgfCB7IHR5cGU6IFwic2F5cGk6cGlTcGVha2luZ1wiIH1cbiAgfCB7IHR5cGU6IFwic2F5cGk6cGlTdG9wcGVkU3BlYWtpbmdcIiB9XG4gIHwgeyB0eXBlOiBcInNheXBpOnBpRmluaXNoZWRTcGVha2luZ1wiIH1cbiAgfCB7IHR5cGU6IFwic2F5cGk6c3VibWl0XCIgfVxuICB8IHsgdHlwZTogXCJzYXlwaTpjYWxsXCIgfVxuICB8IHsgdHlwZTogXCJzYXlwaTpoYW5ndXBcIiB9O1xuXG5pbnRlcmZhY2UgU2F5UGlDb250ZXh0IHtcbiAgdHJhbnNjcmlwdGlvbnM6IFJlY29yZDxudW1iZXIsIHN0cmluZz47XG4gIGxhc3RTdGF0ZTogXCJpbmFjdGl2ZVwiIHwgXCJsaXN0ZW5pbmdcIjtcbiAgdGltZVVzZXJTdG9wcGVkU3BlYWtpbmc6IG51bWJlcjtcbn1cblxuLy8gRGVmaW5lIHRoZSBzdGF0ZSBzY2hlbWFcbnR5cGUgU2F5UGlTdGF0ZVNjaGVtYSA9IHtcbiAgc3RhdGVzOiB7XG4gICAgaW5hY3RpdmU6IHt9O1xuICAgIGVycm9yczoge1xuICAgICAgc3RhdGVzOiB7XG4gICAgICAgIHRyYW5zY3JpYmVGYWlsZWQ6IHt9O1xuICAgICAgICBtaWNFcnJvcjoge307XG4gICAgICB9O1xuICAgIH07XG4gICAgbGlzdGVuaW5nOiB7XG4gICAgICBzdGF0ZXM6IHtcbiAgICAgICAgcmVjb3JkaW5nOiB7XG4gICAgICAgICAgc3RhdGVzOiB7XG4gICAgICAgICAgICB1c2VyU3BlYWtpbmc6IHt9O1xuICAgICAgICAgICAgbm90U3BlYWtpbmc6IHt9O1xuICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgICAgIGNvbnZlcnRpbmc6IHtcbiAgICAgICAgICBzdGF0ZXM6IHtcbiAgICAgICAgICAgIHRyYW5zY3JpYmluZzoge307XG4gICAgICAgICAgICBhY2N1bXVsYXRpbmc6IHt9O1xuICAgICAgICAgICAgc3VibWl0dGluZzoge307XG4gICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICAgIH07XG4gICAgfTtcbiAgICByZXNwb25kaW5nOiB7XG4gICAgICBzdGF0ZXM6IHtcbiAgICAgICAgcGlTcGVha2luZzoge307XG4gICAgICB9O1xuICAgIH07XG4gIH07XG59O1xuXG5pbnRlcmZhY2UgU2F5UGlUeXBlc3RhdGUgZXh0ZW5kcyBUeXBlc3RhdGU8U2F5UGlDb250ZXh0PiB7XG4gIHZhbHVlOiBcImxpc3RlbmluZ1wiIHwgXCJpbmFjdGl2ZVwiIHwgXCJlcnJvcnNcIiB8IFwicmVzcG9uZGluZ1wiO1xuICBjb250ZXh0OiBTYXlQaUNvbnRleHQ7XG59XG5cbi8qIGV4dGVybmFsIGFjdGlvbnMgKi9cbmNvbnN0IGNsZWFyVHJhbnNjcmlwdHMgPSBhc3NpZ24oe1xuICB0cmFuc2NyaXB0aW9uczogKCkgPT4gKHt9KSxcbn0pO1xuXG5leHBvcnQgY29uc3QgbWFjaGluZSA9IGNyZWF0ZU1hY2hpbmU8U2F5UGlDb250ZXh0LCBTYXlQaUV2ZW50LCBTYXlQaVR5cGVzdGF0ZT4oXG4gIHtcbiAgICBjb250ZXh0OiB7XG4gICAgICB0cmFuc2NyaXB0aW9uczoge30sXG4gICAgICBsYXN0U3RhdGU6IFwiaW5hY3RpdmVcIixcbiAgICAgIHRpbWVVc2VyU3RvcHBlZFNwZWFraW5nOiAwLFxuICAgIH0sXG4gICAgaWQ6IFwic2F5UGlcIixcbiAgICBpbml0aWFsOiBcImluYWN0aXZlXCIsXG4gICAgc3RhdGVzOiB7XG4gICAgICBpbmFjdGl2ZToge1xuICAgICAgICBkZXNjcmlwdGlvbjogXCJJZGxlIHN0YXRlLCBub3QgbGlzdGVuaW5nIG9yIHNwZWFraW5nLiBQcml2YWN5IG1vZGUuXCIsXG4gICAgICAgIGV4aXQ6IGFzc2lnbih7IGxhc3RTdGF0ZTogXCJpbmFjdGl2ZVwiIH0pLFxuICAgICAgICBvbjoge1xuICAgICAgICAgIFwic2F5cGk6Y2FsbFwiOiB7XG4gICAgICAgICAgICB0YXJnZXQ6IFwiI3NheVBpLmxpc3RlbmluZy5yZWNvcmRpbmdcIixcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiY2FsbFN0YXJ0ZWRcIixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwic3RhcnRSZWNvcmRpbmdcIixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICAgICAgJ0VuYWJsZSB0aGUgVkFEIG1pY3JvcGhvbmUuXFxuQWthIFwiY2FsbFwiIFBpLlxcblN0YXJ0cyBhY3RpdmUgbGlzdGVuaW5nLicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNheXBpOnBpU3BlYWtpbmdcIjoge1xuICAgICAgICAgICAgdGFyZ2V0OiBcIiNzYXlQaS5yZXNwb25kaW5nLnBpU3BlYWtpbmdcIixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGVycm9yczoge1xuICAgICAgICBkZXNjcmlwdGlvbjogXCJFcnJvciBwYXJlbnQgc3RhdGUuXCIsXG4gICAgICAgIGFmdGVyOiB7XG4gICAgICAgICAgXCIxMDAwMFwiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRhcmdldDogXCIjc2F5UGkubGlzdGVuaW5nXCIsXG4gICAgICAgICAgICAgIGFjdGlvbnM6IFtdLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJSZXNldCB0byB0aGUgaWRsZSBzdGF0ZSBhbmQgY2xlYXIgZXJyb3JzLlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaW50ZXJuYWw6IGZhbHNlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBpbml0aWFsOiBcInRyYW5zY3JpYmVGYWlsZWRcIixcbiAgICAgICAgc3RhdGVzOiB7XG4gICAgICAgICAgdHJhbnNjcmliZUZhaWxlZDoge1xuICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIC90cmFuc2NyaWJlIEFQSSByZXNwb25kZWQgd2l0aCBhbiBlcnJvci5cIixcbiAgICAgICAgICAgIGVudHJ5OiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwic3RhcnRBbmltYXRpb25cIixcbiAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBcImVycm9yXCIsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXhpdDoge1xuICAgICAgICAgICAgICB0eXBlOiBcInN0b3BBbmltYXRpb25cIixcbiAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBcImVycm9yXCIsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHlwZTogXCJmaW5hbFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgbWljRXJyb3I6IHtcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIk5vIGF1ZGlvIGlucHV0IGRldGVjdGVkXCIsXG4gICAgICAgICAgICBlbnRyeToge1xuICAgICAgICAgICAgICB0eXBlOiBcInNob3dOb3RpZmljYXRpb25cIixcbiAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgaWNvbjogXCJtdXRlZC1taWNyb3Bob25lXCIsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXhpdDoge1xuICAgICAgICAgICAgICB0eXBlOiBcImRpc21pc3NOb3RpZmljYXRpb25cIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiBcImZpbmFsXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBsaXN0ZW5pbmc6IHtcbiAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgXCJBY3RpdmVseSBsaXN0ZW5pbmcgZm9yIHVzZXIgaW5wdXQuIFNpbXVsdGFuZW91c2x5IHJlY29yZGluZyBhbmQgdHJhbnNjcmliaW5nIHVzZXIgc3BlZWNoLiBHZW50bGUgcHVsc2luZyBhbmltYXRpb24uXCIsXG4gICAgICAgIGVudHJ5OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogXCJzdG9wQWxsQW5pbWF0aW9uc1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogXCJhY3F1aXJlTWljcm9waG9uZVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGV4aXQ6IGFzc2lnbih7IGxhc3RTdGF0ZTogXCJsaXN0ZW5pbmdcIiB9KSxcbiAgICAgICAgc3RhdGVzOiB7XG4gICAgICAgICAgcmVjb3JkaW5nOiB7XG4gICAgICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICAgICAgXCJNaWNyb3Bob25lIGlzIG9uIGFuZCBWQUQgaXMgYWN0aXZlbHkgbGlzdGVuaW5nIGZvciB1c2VyIHNwZWVjaC5cIixcbiAgICAgICAgICAgIGluaXRpYWw6IFwibm90U3BlYWtpbmdcIixcbiAgICAgICAgICAgIHN0YXRlczoge1xuICAgICAgICAgICAgICBub3RTcGVha2luZzoge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgICAgICAgICAgXCJNaWNyb3Bob25lIGlzIHJlY29yZGluZyBidXQgbm8gc3BlZWNoIGlzIGRldGVjdGVkLlwiLFxuICAgICAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgICAgICBcInNheXBpOnVzZXJGaW5pc2hlZFNwZWFraW5nXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBcIiNzYXlQaS5pbmFjdGl2ZVwiLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIFwic2F5cGk6dXNlclNwZWFraW5nXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBcInVzZXJTcGVha2luZ1wiLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB1c2VyU3BlYWtpbmc6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICAgICAgICAgIFwiVXNlciBpcyBzcGVha2luZyBhbmQgYmVpbmcgcmVjb3JkZWQgYnkgdGhlIG1pY3JvcGhvbmUuXFxuV2F2ZWZvcm0gYW5pbWF0aW9uLlwiLFxuICAgICAgICAgICAgICAgIGVudHJ5OiB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiBcInN0YXJ0QW5pbWF0aW9uXCIsXG4gICAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBcInVzZXJTcGVha2luZ1wiLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGV4aXQ6IHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6IFwic3RvcEFuaW1hdGlvblwiLFxuICAgICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogXCJ1c2VyU3BlYWtpbmdcIixcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgICAgXCJzYXlwaTp1c2VyU3RvcHBlZFNwZWFraW5nXCI6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJub3RTcGVha2luZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCIjc2F5UGkubGlzdGVuaW5nLmNvbnZlcnRpbmcudHJhbnNjcmliaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICBjb25kOiBcImhhc0F1ZGlvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgICAgICAgICAgICAgYXNzaWduKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZVVzZXJTdG9wcGVkU3BlYWtpbmc6ICgpID0+IG5ldyBEYXRlKCkuZ2V0VGltZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwidHJhbnNjcmliZUF1ZGlvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IFwibm90U3BlYWtpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICBjb25kOiBcImhhc05vQXVkaW9cIixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICBcInNheXBpOmhhbmd1cFwiOiB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0OiBcIiNzYXlQaS5pbmFjdGl2ZVwiLFxuICAgICAgICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzdG9wUmVjb3JkaW5nXCIsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInJlbGVhc2VNaWNyb3Bob25lXCIsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImNhbGxFbmRlZFwiLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgICAgICAgICAgJ0Rpc2FibGUgdGhlIFZBRCBtaWNyb3Bob25lLlxcbiAgICBBa2EgXCJjYWxsXCIgUGkuXFxuICAgIFN0b3BzIGFjdGl2ZSBsaXN0ZW5pbmcuJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb252ZXJ0aW5nOiB7XG4gICAgICAgICAgICBpbml0aWFsOiBcImFjY3VtdWxhdGluZ1wiLFxuICAgICAgICAgICAgc3RhdGVzOiB7XG4gICAgICAgICAgICAgIGFjY3VtdWxhdGluZzoge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgICAgICAgICAgXCJBY2N1bXVsYXRpbmcgYW5kIGFzc2VtYmxpbmcgYXVkaW8gdHJhbnNjcmlwdGlvbnMgaW50byBhIGNvaGVzaXZlIHByb21wdC5cXG5TdWJtaXRzIGEgcHJvbXB0IHdoZW4gYSB0aHJlc2hvbGQgaXMgcmVhY2hlZC5cIixcbiAgICAgICAgICAgICAgICBhZnRlcjoge1xuICAgICAgICAgICAgICAgICAgc3VibWlzc2lvbkRlbGF5OiB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldDogXCJzdWJtaXR0aW5nXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbmQ6IFwic3VibWlzc2lvbkNvbmRpdGlvbnNNZXRcIixcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiU3VibWl0IGNvbWJpbmVkIHRyYW5zY3JpcHQgdG8gUGkuXCIsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICAgIFwic2F5cGk6dHJhbnNjcmliZWRcIjoge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IFwiYWNjdW11bGF0aW5nXCIsXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImhhbmRsZVRyYW5zY3JpcHRpb25SZXNwb25zZVwiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICAgICAgICAgICAgICBcIlRyYW5zY3JpYmVkIHNwZWVjaCB0byB0ZXh0IChvdXQgb2Ygc2VxdWVuY2UgcmVzcG9uc2UpLlwiLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIFwic2F5cGk6dHJhbnNjcmliZUZhaWxlZFwiOiB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldDogXCIjc2F5UGkuZXJyb3JzLnRyYW5zY3JpYmVGYWlsZWRcIixcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgICAgICAgICAgICAgXCJPdXQgb2Ygc2VxdWVuY2UgZXJyb3IgcmVzcG9uc2UgZnJvbSB0aGUgL3RyYW5zY3JpYmUgQVBJXCIsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXCJzYXlwaTp0cmFuc2NyaWJlZEVtcHR5XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBcIiNzYXlQaS5lcnJvcnMubWljRXJyb3JcIixcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgICAgICAgICAgICAgXCJPdXQgb2Ygc2VxdWVuY2UgZW1wdHkgcmVzcG9uc2UgZnJvbSB0aGUgL3RyYW5zY3JpYmUgQVBJXCIsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHN1Ym1pdHRpbmc6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJTdWJtaXR0aW5nIHByb21wdCB0byBQaS5cIixcbiAgICAgICAgICAgICAgICBlbnRyeToge1xuICAgICAgICAgICAgICAgICAgdHlwZTogXCJtZXJnZUFuZFN1Ym1pdFRyYW5zY3JpcHRcIixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGV4aXQ6IFtjbGVhclRyYW5zY3JpcHRzLCBjbGVhclBlbmRpbmdUcmFuc2NyaXB0aW9uc10sXG4gICAgICAgICAgICAgICAgYWx3YXlzOiB7XG4gICAgICAgICAgICAgICAgICB0YXJnZXQ6IFwiYWNjdW11bGF0aW5nXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgdHJhbnNjcmliaW5nOiB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgICAgICAgICBcIlRyYW5zY3JpYmluZyBhdWRpbyB0byB0ZXh0LlxcbkNhcmQgZmxpcCBhbmltYXRpb24uXCIsXG4gICAgICAgICAgICAgICAgZW50cnk6IHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6IFwic3RhcnRBbmltYXRpb25cIixcbiAgICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb246IFwidHJhbnNjcmliaW5nXCIsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXhpdDoge1xuICAgICAgICAgICAgICAgICAgdHlwZTogXCJzdG9wQW5pbWF0aW9uXCIsXG4gICAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBcInRyYW5zY3JpYmluZ1wiLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgICAgICBcInNheXBpOnRyYW5zY3JpYmVkXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBcImFjY3VtdWxhdGluZ1wiLFxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJoYW5kbGVUcmFuc2NyaXB0aW9uUmVzcG9uc2VcIixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiU3VjY2Vzc2Z1bGx5IHRyYW5zY3JpYmVkIHVzZXIgYXVkaW8gdG8gdGV4dC5cIixcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBcInNheXBpOnRyYW5zY3JpYmVGYWlsZWRcIjoge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IFwiI3NheVBpLmVycm9ycy50cmFuc2NyaWJlRmFpbGVkXCIsXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgICAgICAgICAgICAgIFwiUmVjZWl2ZWQgYW4gZXJyb3IgcmVzcG9uc2UgZnJvbSB0aGUgL3RyYW5zY3JpYmUgQVBJXCIsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXCJzYXlwaTp0cmFuc2NyaWJlZEVtcHR5XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBcIiNzYXlQaS5lcnJvcnMubWljRXJyb3JcIixcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgICAgICAgICAgICAgXCJSZWNlaXZlZCBhbiBlbXB0eSByZXNwb25zZSBmcm9tIHRoZSAvdHJhbnNjcmliZSBBUEkgKG5vIHNwZWVjaCBkZXRlY3RlZClcIixcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgb246IHtcbiAgICAgICAgICBcInNheXBpOnBpU3BlYWtpbmdcIjoge1xuICAgICAgICAgICAgdGFyZ2V0OiBcIiNzYXlQaS5yZXNwb25kaW5nLnBpU3BlYWtpbmdcIixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB0eXBlOiBcInBhcmFsbGVsXCIsXG4gICAgICB9LFxuICAgICAgcmVzcG9uZGluZzoge1xuICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICBcIlBpIGlzIHJlc3BvbmRpbmcuIFN5bnRoZXNpc2VkIHNwZWVjaCBpcyBwbGF5aW5nIG9yIHdhaXRpbmcgdG8gcGxheS5cIixcbiAgICAgICAgZW50cnk6IHtcbiAgICAgICAgICB0eXBlOiBcImRpc2FibGVDYWxsQnV0dG9uXCIsXG4gICAgICAgIH0sXG4gICAgICAgIGV4aXQ6IHtcbiAgICAgICAgICB0eXBlOiBcImVuYWJsZUNhbGxCdXR0b25cIixcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdGlhbDogXCJwaVNwZWFraW5nXCIsXG4gICAgICAgIHN0YXRlczoge1xuICAgICAgICAgIHBpU3BlYWtpbmc6IHtcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgICAgICBcIlBpJ3Mgc3ludGhlc2lzZWQgc3BlZWNoIGF1ZGlvIGlzIHBsYXlpbmcuXFxuUGxheWZ1bCBhbmltYXRpb24uXCIsXG4gICAgICAgICAgICBlbnRyeToge1xuICAgICAgICAgICAgICB0eXBlOiBcInN0YXJ0QW5pbWF0aW9uXCIsXG4gICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogXCJwaVNwZWFraW5nXCIsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXhpdDoge1xuICAgICAgICAgICAgICB0eXBlOiBcInN0b3BBbmltYXRpb25cIixcbiAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBcInBpU3BlYWtpbmdcIixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICBcInNheXBpOnBpU3RvcHBlZFNwZWFraW5nXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0YXJnZXQ6IFwiI3NheVBpLmxpc3RlbmluZ1wiLFxuICAgICAgICAgICAgICAgICAgY29uZDogXCJ3YXNMaXN0ZW5pbmdcIixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHRhcmdldDogXCIjc2F5UGkuaW5hY3RpdmVcIixcbiAgICAgICAgICAgICAgICAgIGNvbmQ6IFwid2FzSW5hY3RpdmVcIixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBcInNheXBpOnVzZXJTcGVha2luZ1wiOiB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0OiBcIiNzYXlQaS5saXN0ZW5pbmcucmVjb3JkaW5nLnVzZXJTcGVha2luZ1wiLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcInNheXBpOnBpRmluaXNoZWRTcGVha2luZ1wiOiB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0OiBcIiNzYXlQaS5saXN0ZW5pbmdcIixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBwcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50czogdHJ1ZSxcbiAgICBwcmVzZXJ2ZUFjdGlvbk9yZGVyOiB0cnVlLFxuICB9LFxuICB7XG4gICAgYWN0aW9uczoge1xuICAgICAgc3RvcEFsbEFuaW1hdGlvbnM6IChjb250ZXh0LCBldmVudCkgPT4ge1xuICAgICAgICBBbmltYXRpb25Nb2R1bGUuc3RvcEFsbEFuaW1hdGlvbnMoKTtcbiAgICAgIH0sXG5cbiAgICAgIHN0YXJ0QW5pbWF0aW9uOiAoY29udGV4dCwgZXZlbnQsIHsgYWN0aW9uIH0pID0+IHtcbiAgICAgICAgQW5pbWF0aW9uTW9kdWxlLnN0YXJ0QW5pbWF0aW9uKGFjdGlvbi5wYXJhbXMuYW5pbWF0aW9uKTtcbiAgICAgIH0sXG5cbiAgICAgIHN0b3BBbmltYXRpb246IChjb250ZXh0LCBldmVudCwgeyBhY3Rpb24gfSkgPT4ge1xuICAgICAgICBBbmltYXRpb25Nb2R1bGUuc3RvcEFuaW1hdGlvbihhY3Rpb24ucGFyYW1zLmFuaW1hdGlvbik7XG4gICAgICB9LFxuXG4gICAgICB0cmFuc2NyaWJlQXVkaW86IChcbiAgICAgICAgY29udGV4dCxcbiAgICAgICAgZXZlbnQ6IHtcbiAgICAgICAgICB0eXBlOiBcInNheXBpOnVzZXJTdG9wcGVkU3BlYWtpbmdcIjtcbiAgICAgICAgICBkdXJhdGlvbjogbnVtYmVyO1xuICAgICAgICAgIGJsb2I6IEJsb2I7XG4gICAgICAgIH1cbiAgICAgICkgPT4ge1xuICAgICAgICBjb25zdCBhdWRpb0Jsb2IgPSBldmVudC5ibG9iO1xuICAgICAgICB1cGxvYWRBdWRpb1dpdGhSZXRyeShhdWRpb0Jsb2IsIGV2ZW50LmR1cmF0aW9uKTtcbiAgICAgIH0sXG5cbiAgICAgIGhhbmRsZVRyYW5zY3JpcHRpb25SZXNwb25zZTogKFxuICAgICAgICBTYXlQaUNvbnRleHQsXG4gICAgICAgIGV2ZW50OiB7XG4gICAgICAgICAgdHlwZTogXCJzYXlwaTp0cmFuc2NyaWJlZFwiO1xuICAgICAgICAgIHRleHQ6IHN0cmluZztcbiAgICAgICAgICBzZXF1ZW5jZU51bWJlcjogbnVtYmVyO1xuICAgICAgICAgIHBGaW5pc2hlZFNwZWFraW5nPzogbnVtYmVyO1xuICAgICAgICB9XG4gICAgICApID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJoYW5kbGVUcmFuc2NyaXB0aW9uUmVzcG9uc2VcIiwgZXZlbnQpO1xuICAgICAgICBjb25zdCB0cmFuc2NyaXB0aW9uID0gZXZlbnQudGV4dDtcbiAgICAgICAgY29uc3Qgc2VxdWVuY2VOdW1iZXIgPSBldmVudC5zZXF1ZW5jZU51bWJlcjtcbiAgICAgICAgU2F5UGlDb250ZXh0LnRyYW5zY3JpcHRpb25zW3NlcXVlbmNlTnVtYmVyXSA9IHRyYW5zY3JpcHRpb247XG4gICAgICB9LFxuXG4gICAgICBhY3F1aXJlTWljcm9waG9uZTogKGNvbnRleHQsIGV2ZW50KSA9PiB7XG4gICAgICAgIC8vIHdhcm11cCB0aGUgbWljcm9waG9uZSBvbiBpZGxlIGluIG1vYmlsZSB2aWV3LFxuICAgICAgICAvLyBzaW5jZSB0aGVyZSdzIG5vIG1vdXNlb3ZlciBldmVudCB0byB0cmlnZ2VyIGl0XG4gICAgICAgIGlmIChpc01vYmlsZVZpZXcoKSkge1xuICAgICAgICAgIEV2ZW50QnVzLmVtaXQoXCJhdWRpbzpzZXR1cFJlY29yZGluZ1wiKTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgc3RhcnRSZWNvcmRpbmc6IChjb250ZXh0LCBldmVudCkgPT4ge1xuICAgICAgICBFdmVudEJ1cy5lbWl0KFwiYXVkaW86c3RhcnRSZWNvcmRpbmdcIik7XG4gICAgICB9LFxuXG4gICAgICBzdG9wUmVjb3JkaW5nOiAoY29udGV4dCwgZXZlbnQpID0+IHtcbiAgICAgICAgRXZlbnRCdXMuZW1pdChcImF1ZGlvOnN0b3BSZWNvcmRpbmdcIik7XG4gICAgICB9LFxuXG4gICAgICBzaG93Tm90aWZpY2F0aW9uOiAoY29udGV4dCwgZXZlbnQsIHsgYWN0aW9uIH0pID0+IHtcbiAgICAgICAgY29uc3QgaWNvbiA9IGFjdGlvbi5wYXJhbXMuaWNvbjtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IGFjdGlvbi5wYXJhbXMubWVzc2FnZTtcbiAgICAgICAgYnV0dG9uTW9kdWxlLnNob3dOb3RpZmljYXRpb24oeyBpY29uLCBtZXNzYWdlIH0pO1xuICAgICAgfSxcblxuICAgICAgZGlzbWlzc05vdGlmaWNhdGlvbjogKCkgPT4ge1xuICAgICAgICBidXR0b25Nb2R1bGUuZGlzbWlzc05vdGlmaWNhdGlvbigpO1xuICAgICAgfSxcblxuICAgICAgbWVyZ2VBbmRTdWJtaXRUcmFuc2NyaXB0OiAoY29udGV4dCkgPT4ge1xuICAgICAgICBjb25zdCBwcm9tcHQgPSBtZXJnZVRyYW5zY3JpcHRzKGNvbnRleHQudHJhbnNjcmlwdGlvbnMpLnRyaW0oKTtcbiAgICAgICAgaWYgKHByb21wdCkgc2V0UHJvbXB0VGV4dChwcm9tcHQpO1xuICAgICAgfSxcblxuICAgICAgY2FsbFN0YXJ0ZWQ6ICgpID0+IHtcbiAgICAgICAgYnV0dG9uTW9kdWxlLmNhbGxBY3RpdmUoKTtcbiAgICAgIH0sXG4gICAgICBjYWxsRW5kZWQ6ICgpID0+IHtcbiAgICAgICAgYnV0dG9uTW9kdWxlLmNhbGxJbmFjdGl2ZSgpO1xuICAgICAgfSxcbiAgICAgIGRpc2FibGVDYWxsQnV0dG9uOiAoKSA9PiB7XG4gICAgICAgIGJ1dHRvbk1vZHVsZS5kaXNhYmxlQ2FsbEJ1dHRvbigpO1xuICAgICAgfSxcbiAgICAgIGVuYWJsZUNhbGxCdXR0b246ICgpID0+IHtcbiAgICAgICAgYnV0dG9uTW9kdWxlLmVuYWJsZUNhbGxCdXR0b24oKTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBzZXJ2aWNlczoge30sXG4gICAgZ3VhcmRzOiB7XG4gICAgICBoYXNBdWRpbzogKGNvbnRleHQ6IFNheVBpQ29udGV4dCwgZXZlbnQ6IFNheVBpRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09IFwic2F5cGk6dXNlclN0b3BwZWRTcGVha2luZ1wiKSB7XG4gICAgICAgICAgcmV0dXJuIGV2ZW50LmJsb2IgIT09IHVuZGVmaW5lZCAmJiBldmVudC5kdXJhdGlvbiA+IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSxcbiAgICAgIGhhc05vQXVkaW86IChjb250ZXh0OiBTYXlQaUNvbnRleHQsIGV2ZW50OiBTYXlQaUV2ZW50KSA9PiB7XG4gICAgICAgIGlmIChldmVudC50eXBlID09PSBcInNheXBpOnVzZXJTdG9wcGVkU3BlYWtpbmdcIikge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBldmVudC5ibG9iID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICAgIGV2ZW50LmJsb2Iuc2l6ZSA9PT0gMCB8fFxuICAgICAgICAgICAgZXZlbnQuZHVyYXRpb24gPT09IDBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0sXG4gICAgICBzdWJtaXNzaW9uQ29uZGl0aW9uc01ldDogKFxuICAgICAgICBjb250ZXh0OiBTYXlQaUNvbnRleHQsXG4gICAgICAgIGV2ZW50OiBTYXlQaUV2ZW50LFxuICAgICAgICBtZXRhXG4gICAgICApID0+IHtcbiAgICAgICAgY29uc3QgeyBzdGF0ZSB9ID0gbWV0YTtcbiAgICAgICAgY29uc3QgYWxsb3dlZFN0YXRlID0gIShcbiAgICAgICAgICBzdGF0ZS5tYXRjaGVzKFwibGlzdGVuaW5nLnJlY29yZGluZy51c2VyU3BlYWtpbmdcIikgfHxcbiAgICAgICAgICBzdGF0ZS5tYXRjaGVzKFwibGlzdGVuaW5nLmNvbnZlcnRpbmcudHJhbnNjcmliaW5nXCIpXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGVtcHR5ID0gT2JqZWN0LmtleXMoY29udGV4dC50cmFuc2NyaXB0aW9ucykubGVuZ3RoID09PSAwO1xuICAgICAgICBjb25zdCBwZW5kaW5nID0gaXNUcmFuc2NyaXB0aW9uUGVuZGluZygpO1xuICAgICAgICBjb25zdCByZWFkeSA9IGFsbG93ZWRTdGF0ZSAmJiAhZW1wdHkgJiYgIXBlbmRpbmc7XG4gICAgICAgIHJldHVybiByZWFkeTtcbiAgICAgIH0sXG4gICAgICB3YXNMaXN0ZW5pbmc6IChjb250ZXh0OiBTYXlQaUNvbnRleHQpID0+IHtcbiAgICAgICAgcmV0dXJuIGNvbnRleHQubGFzdFN0YXRlID09PSBcImxpc3RlbmluZ1wiO1xuICAgICAgfSxcbiAgICAgIHdhc0luYWN0aXZlOiAoY29udGV4dDogU2F5UGlDb250ZXh0KSA9PiB7XG4gICAgICAgIHJldHVybiBjb250ZXh0Lmxhc3RTdGF0ZSA9PT0gXCJpbmFjdGl2ZVwiO1xuICAgICAgfSxcbiAgICB9LFxuICAgIGRlbGF5czoge1xuICAgICAgc3VibWlzc2lvbkRlbGF5OiAoY29udGV4dDogU2F5UGlDb250ZXh0LCBldmVudDogU2F5UGlFdmVudCkgPT4ge1xuICAgICAgICBpZiAoZXZlbnQudHlwZSAhPT0gXCJzYXlwaTp0cmFuc2NyaWJlZFwiKSB7XG4gICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtYXhEZWxheSA9IDEwMDAwOyAvLyAxMCBzZWNvbmRzIGluIG1pbGxpc2Vjb25kc1xuXG4gICAgICAgIC8vIEdldCB0aGUgY3VycmVudCB0aW1lIChpbiBtaWxsaXNlY29uZHMpXG4gICAgICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSB0aW1lIGVsYXBzZWQgc2luY2UgdGhlIHVzZXIgc3RvcHBlZCBzcGVha2luZyAoaW4gbWlsbGlzZWNvbmRzKVxuICAgICAgICBjb25zdCB0aW1lRWxhcHNlZCA9IGN1cnJlbnRUaW1lIC0gY29udGV4dC50aW1lVXNlclN0b3BwZWRTcGVha2luZztcblxuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGluaXRpYWwgZGVsYXkgYmFzZWQgb24gcEZpbmlzaGVkU3BlYWtpbmdcbiAgICAgICAgbGV0IHByb2JhYmlsaXR5ID0gMTtcbiAgICAgICAgaWYgKGV2ZW50LnBGaW5pc2hlZFNwZWFraW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBwcm9iYWJpbGl0eSA9IGV2ZW50LnBGaW5pc2hlZFNwZWFraW5nO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGluaXRpYWxEZWxheSA9ICgxIC0gcHJvYmFiaWxpdHkpICogbWF4RGVsYXk7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBmaW5hbCBkZWxheSBhZnRlciBhY2NvdW50aW5nIGZvciB0aGUgdGltZSBhbHJlYWR5IGVsYXBzZWRcbiAgICAgICAgY29uc3QgZmluYWxEZWxheSA9IE1hdGgubWF4KGluaXRpYWxEZWxheSAtIHRpbWVFbGFwc2VkLCAwKTtcblxuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICBcIldhaXRpbmcgZm9yXCIsXG4gICAgICAgICAgZmluYWxEZWxheSAvIDEwMDAsXG4gICAgICAgICAgXCJzZWNvbmRzIGJlZm9yZSBzdWJtaXR0aW5nXCJcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gZmluYWxEZWxheTtcbiAgICAgIH0sXG4gICAgfSxcbiAgfVxuKTtcbiIsImltcG9ydCB7IF9fYXNzaWduIH0gZnJvbSAnLi9fdmlydHVhbC9fdHNsaWIuanMnO1xuaW1wb3J0IHsgc3ltYm9sT2JzZXJ2YWJsZSwgdG9JbnZva2VTb3VyY2UsIG1hcENvbnRleHQsIGlzTWFjaGluZSB9IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHsgcHJvdmlkZSB9IGZyb20gJy4vc2VydmljZVNjb3BlLmpzJztcblxuZnVuY3Rpb24gY3JlYXRlTnVsbEFjdG9yKGlkKSB7XG4gIHZhciBfYTtcblxuICByZXR1cm4gX2EgPSB7XG4gICAgaWQ6IGlkLFxuICAgIHNlbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfSxcbiAgICBzdWJzY3JpYmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIGdldFNuYXBzaG90OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0sXG4gICAgdG9KU09OOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogaWRcbiAgICAgIH07XG4gICAgfVxuICB9LCBfYVtzeW1ib2xPYnNlcnZhYmxlXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfSwgX2E7XG59XG4vKipcclxuICogQ3JlYXRlcyBhIGRlZmVycmVkIGFjdG9yIHRoYXQgaXMgYWJsZSB0byBiZSBpbnZva2VkIGdpdmVuIHRoZSBwcm92aWRlZFxyXG4gKiBpbnZvY2F0aW9uIGluZm9ybWF0aW9uIGluIGl0cyBgLm1ldGFgIHZhbHVlLlxyXG4gKlxyXG4gKiBAcGFyYW0gaW52b2tlRGVmaW5pdGlvbiBUaGUgbWV0YSBpbmZvcm1hdGlvbiBuZWVkZWQgdG8gaW52b2tlIHRoZSBhY3Rvci5cclxuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZUludm9jYWJsZUFjdG9yKGludm9rZURlZmluaXRpb24sIG1hY2hpbmUsIGNvbnRleHQsIF9ldmVudCkge1xuICB2YXIgX2E7XG5cbiAgdmFyIGludm9rZVNyYyA9IHRvSW52b2tlU291cmNlKGludm9rZURlZmluaXRpb24uc3JjKTtcbiAgdmFyIHNlcnZpY2VDcmVhdG9yID0gKF9hID0gbWFjaGluZSA9PT0gbnVsbCB8fCBtYWNoaW5lID09PSB2b2lkIDAgPyB2b2lkIDAgOiBtYWNoaW5lLm9wdGlvbnMuc2VydmljZXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYVtpbnZva2VTcmMudHlwZV07XG4gIHZhciByZXNvbHZlZERhdGEgPSBpbnZva2VEZWZpbml0aW9uLmRhdGEgPyBtYXBDb250ZXh0KGludm9rZURlZmluaXRpb24uZGF0YSwgY29udGV4dCwgX2V2ZW50KSA6IHVuZGVmaW5lZDtcbiAgdmFyIHRlbXBBY3RvciA9IHNlcnZpY2VDcmVhdG9yID8gY3JlYXRlRGVmZXJyZWRBY3RvcihzZXJ2aWNlQ3JlYXRvciwgaW52b2tlRGVmaW5pdGlvbi5pZCwgcmVzb2x2ZWREYXRhKSA6IGNyZWF0ZU51bGxBY3RvcihpbnZva2VEZWZpbml0aW9uLmlkKTsgLy8gQHRzLWlnbm9yZVxuXG4gIHRlbXBBY3Rvci5tZXRhID0gaW52b2tlRGVmaW5pdGlvbjtcbiAgcmV0dXJuIHRlbXBBY3Rvcjtcbn1cbmZ1bmN0aW9uIGNyZWF0ZURlZmVycmVkQWN0b3IoZW50aXR5LCBpZCwgZGF0YSkge1xuICB2YXIgdGVtcEFjdG9yID0gY3JlYXRlTnVsbEFjdG9yKGlkKTsgLy8gQHRzLWlnbm9yZVxuXG4gIHRlbXBBY3Rvci5kZWZlcnJlZCA9IHRydWU7XG5cbiAgaWYgKGlzTWFjaGluZShlbnRpdHkpKSB7XG4gICAgLy8gXCJtdXRlXCIgdGhlIGV4aXN0aW5nIHNlcnZpY2Ugc2NvcGUgc28gcG90ZW50aWFsIHNwYXduZWQgYWN0b3JzIHdpdGhpbiB0aGUgYC5pbml0aWFsU3RhdGVgIHN0YXkgZGVmZXJyZWQgaGVyZVxuICAgIHZhciBpbml0aWFsU3RhdGVfMSA9IHRlbXBBY3Rvci5zdGF0ZSA9IHByb3ZpZGUodW5kZWZpbmVkLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gKGRhdGEgPyBlbnRpdHkud2l0aENvbnRleHQoZGF0YSkgOiBlbnRpdHkpLmluaXRpYWxTdGF0ZTtcbiAgICB9KTtcblxuICAgIHRlbXBBY3Rvci5nZXRTbmFwc2hvdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBpbml0aWFsU3RhdGVfMTtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHRlbXBBY3Rvcjtcbn1cbmZ1bmN0aW9uIGlzQWN0b3IoaXRlbSkge1xuICB0cnkge1xuICAgIHJldHVybiB0eXBlb2YgaXRlbS5zZW5kID09PSAnZnVuY3Rpb24nO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5mdW5jdGlvbiBpc1NwYXduZWRBY3RvcihpdGVtKSB7XG4gIHJldHVybiBpc0FjdG9yKGl0ZW0pICYmICdpZCcgaW4gaXRlbTtcbn0gLy8gVE9ETzogcmVmYWN0b3IgdGhlIHJldHVybiB0eXBlLCB0aGlzIGNvdWxkIGJlIHdyaXR0ZW4gaW4gYSBiZXR0ZXIgd2F5IGJ1dCBpdCdzIGJlc3QgdG8gYXZvaWQgdW5uZWNjZXNzYXJ5IGJyZWFraW5nIGNoYW5nZXMgbm93XG5cbmZ1bmN0aW9uIHRvQWN0b3JSZWYoYWN0b3JSZWZMaWtlKSB7XG4gIHZhciBfYTtcblxuICByZXR1cm4gX19hc3NpZ24oKF9hID0ge1xuICAgIHN1YnNjcmliZTogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgaWQ6ICdhbm9ueW1vdXMnLFxuICAgIGdldFNuYXBzaG90OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSwgX2Fbc3ltYm9sT2JzZXJ2YWJsZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sIF9hKSwgYWN0b3JSZWZMaWtlKTtcbn1cblxuZXhwb3J0IHsgY3JlYXRlRGVmZXJyZWRBY3RvciwgY3JlYXRlSW52b2NhYmxlQWN0b3IsIGNyZWF0ZU51bGxBY3RvciwgaXNBY3RvciwgaXNTcGF3bmVkQWN0b3IsIHRvQWN0b3JSZWYgfTtcbiIsImltcG9ydCB7IFN0YXRlTm9kZSB9IGZyb20gJy4vU3RhdGVOb2RlLmpzJztcbmltcG9ydCB7IElTX1BST0RVQ1RJT04gfSBmcm9tICcuL2Vudmlyb25tZW50LmpzJztcblxudmFyIHdhcm5lZCA9IGZhbHNlO1xuZnVuY3Rpb24gTWFjaGluZShjb25maWcsIG9wdGlvbnMsIGluaXRpYWxDb250ZXh0KSB7XG4gIGlmIChpbml0aWFsQ29udGV4dCA9PT0gdm9pZCAwKSB7XG4gICAgaW5pdGlhbENvbnRleHQgPSBjb25maWcuY29udGV4dDtcbiAgfVxuXG4gIHJldHVybiBuZXcgU3RhdGVOb2RlKGNvbmZpZywgb3B0aW9ucywgaW5pdGlhbENvbnRleHQpO1xufVxuZnVuY3Rpb24gY3JlYXRlTWFjaGluZShjb25maWcsIG9wdGlvbnMpIHtcbiAgaWYgKCFJU19QUk9EVUNUSU9OICYmICEoJ3ByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzJyBpbiBjb25maWcpICYmICF3YXJuZWQpIHtcbiAgICB3YXJuZWQgPSB0cnVlO1xuICAgIGNvbnNvbGUud2FybignSXQgaXMgaGlnaGx5IHJlY29tbWVuZGVkIHRvIHNldCBgcHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHNgIHRvIGB0cnVlYCB3aGVuIHVzaW5nIGBjcmVhdGVNYWNoaW5lYC4gaHR0cHM6Ly94c3RhdGUuanMub3JnL2RvY3MvZ3VpZGVzL2FjdGlvbnMuaHRtbCcpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBTdGF0ZU5vZGUoY29uZmlnLCBvcHRpb25zKTtcbn1cblxuZXhwb3J0IHsgTWFjaGluZSwgY3JlYXRlTWFjaGluZSB9O1xuIiwiaW1wb3J0IHsgX19hc3NpZ24sIF9fc3ByZWFkQXJyYXksIF9fcmVhZCwgX19yZXN0IH0gZnJvbSAnLi9fdmlydHVhbC9fdHNsaWIuanMnO1xuaW1wb3J0IHsgRU1QVFlfQUNUSVZJVFlfTUFQIH0gZnJvbSAnLi9jb25zdGFudHMuanMnO1xuaW1wb3J0IHsgaXNTdHJpbmcsIG1hdGNoZXNTdGF0ZSwgd2FybiB9IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHsgZ2V0TWV0YSwgbmV4dEV2ZW50cyB9IGZyb20gJy4vc3RhdGVVdGlscy5qcyc7XG5pbXBvcnQgeyBpbml0RXZlbnQgfSBmcm9tICcuL2FjdGlvbnMuanMnO1xuaW1wb3J0IHsgSVNfUFJPRFVDVElPTiB9IGZyb20gJy4vZW52aXJvbm1lbnQuanMnO1xuXG5mdW5jdGlvbiBzdGF0ZVZhbHVlc0VxdWFsKGEsIGIpIHtcbiAgaWYgKGEgPT09IGIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmIChhID09PSB1bmRlZmluZWQgfHwgYiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKGlzU3RyaW5nKGEpIHx8IGlzU3RyaW5nKGIpKSB7XG4gICAgcmV0dXJuIGEgPT09IGI7XG4gIH1cblxuICB2YXIgYUtleXMgPSBPYmplY3Qua2V5cyhhKTtcbiAgdmFyIGJLZXlzID0gT2JqZWN0LmtleXMoYik7XG4gIHJldHVybiBhS2V5cy5sZW5ndGggPT09IGJLZXlzLmxlbmd0aCAmJiBhS2V5cy5ldmVyeShmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIHN0YXRlVmFsdWVzRXF1YWwoYVtrZXldLCBiW2tleV0pO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGlzU3RhdGVDb25maWcoc3RhdGUpIHtcbiAgaWYgKHR5cGVvZiBzdGF0ZSAhPT0gJ29iamVjdCcgfHwgc3RhdGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gJ3ZhbHVlJyBpbiBzdGF0ZSAmJiAnX2V2ZW50JyBpbiBzdGF0ZTtcbn1cbi8qKlxyXG4gKiBAZGVwcmVjYXRlZCBVc2UgYGlzU3RhdGVDb25maWcob2JqZWN0KWAgb3IgYHN0YXRlIGluc3RhbmNlb2YgU3RhdGVgIGluc3RlYWQuXHJcbiAqL1xuXG52YXIgaXNTdGF0ZSA9IGlzU3RhdGVDb25maWc7XG5mdW5jdGlvbiBiaW5kQWN0aW9uVG9TdGF0ZShhY3Rpb24sIHN0YXRlKSB7XG4gIHZhciBleGVjID0gYWN0aW9uLmV4ZWM7XG5cbiAgdmFyIGJvdW5kQWN0aW9uID0gX19hc3NpZ24oX19hc3NpZ24oe30sIGFjdGlvbiksIHtcbiAgICBleGVjOiBleGVjICE9PSB1bmRlZmluZWQgPyBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZXhlYyhzdGF0ZS5jb250ZXh0LCBzdGF0ZS5ldmVudCwge1xuICAgICAgICBhY3Rpb246IGFjdGlvbixcbiAgICAgICAgc3RhdGU6IHN0YXRlLFxuICAgICAgICBfZXZlbnQ6IHN0YXRlLl9ldmVudFxuICAgICAgfSk7XG4gICAgfSA6IHVuZGVmaW5lZFxuICB9KTtcblxuICByZXR1cm4gYm91bmRBY3Rpb247XG59XG5cbnZhciBTdGF0ZSA9XG4vKiNfX1BVUkVfXyovXG5cbi8qKiBAY2xhc3MgKi9cbmZ1bmN0aW9uICgpIHtcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhIG5ldyBTdGF0ZSBpbnN0YW5jZS5cclxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIHN0YXRlIHZhbHVlXHJcbiAgICogQHBhcmFtIGNvbnRleHQgVGhlIGV4dGVuZGVkIHN0YXRlXHJcbiAgICogQHBhcmFtIGhpc3RvcnlWYWx1ZSBUaGUgdHJlZSByZXByZXNlbnRpbmcgaGlzdG9yaWNhbCB2YWx1ZXMgb2YgdGhlIHN0YXRlIG5vZGVzXHJcbiAgICogQHBhcmFtIGhpc3RvcnkgVGhlIHByZXZpb3VzIHN0YXRlXHJcbiAgICogQHBhcmFtIGFjdGlvbnMgQW4gYXJyYXkgb2YgYWN0aW9uIG9iamVjdHMgdG8gZXhlY3V0ZSBhcyBzaWRlLWVmZmVjdHNcclxuICAgKiBAcGFyYW0gYWN0aXZpdGllcyBBIG1hcHBpbmcgb2YgYWN0aXZpdGllcyBhbmQgd2hldGhlciB0aGV5IGFyZSBzdGFydGVkIChgdHJ1ZWApIG9yIHN0b3BwZWQgKGBmYWxzZWApLlxyXG4gICAqIEBwYXJhbSBtZXRhXHJcbiAgICogQHBhcmFtIGV2ZW50cyBJbnRlcm5hbCBldmVudCBxdWV1ZS4gU2hvdWxkIGJlIGVtcHR5IHdpdGggcnVuLXRvLWNvbXBsZXRpb24gc2VtYW50aWNzLlxyXG4gICAqIEBwYXJhbSBjb25maWd1cmF0aW9uXHJcbiAgICovXG4gIGZ1bmN0aW9uIFN0YXRlKGNvbmZpZykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgX2E7XG5cbiAgICB0aGlzLmFjdGlvbnMgPSBbXTtcbiAgICB0aGlzLmFjdGl2aXRpZXMgPSBFTVBUWV9BQ1RJVklUWV9NQVA7XG4gICAgdGhpcy5tZXRhID0ge307XG4gICAgdGhpcy5ldmVudHMgPSBbXTtcbiAgICB0aGlzLnZhbHVlID0gY29uZmlnLnZhbHVlO1xuICAgIHRoaXMuY29udGV4dCA9IGNvbmZpZy5jb250ZXh0O1xuICAgIHRoaXMuX2V2ZW50ID0gY29uZmlnLl9ldmVudDtcbiAgICB0aGlzLl9zZXNzaW9uaWQgPSBjb25maWcuX3Nlc3Npb25pZDtcbiAgICB0aGlzLmV2ZW50ID0gdGhpcy5fZXZlbnQuZGF0YTtcbiAgICB0aGlzLmhpc3RvcnlWYWx1ZSA9IGNvbmZpZy5oaXN0b3J5VmFsdWU7XG4gICAgdGhpcy5oaXN0b3J5ID0gY29uZmlnLmhpc3Rvcnk7XG4gICAgdGhpcy5hY3Rpb25zID0gY29uZmlnLmFjdGlvbnMgfHwgW107XG4gICAgdGhpcy5hY3Rpdml0aWVzID0gY29uZmlnLmFjdGl2aXRpZXMgfHwgRU1QVFlfQUNUSVZJVFlfTUFQO1xuICAgIHRoaXMubWV0YSA9IGdldE1ldGEoY29uZmlnLmNvbmZpZ3VyYXRpb24pO1xuICAgIHRoaXMuZXZlbnRzID0gY29uZmlnLmV2ZW50cyB8fCBbXTtcbiAgICB0aGlzLm1hdGNoZXMgPSB0aGlzLm1hdGNoZXMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnRvU3RyaW5ncyA9IHRoaXMudG9TdHJpbmdzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jb25maWd1cmF0aW9uID0gY29uZmlnLmNvbmZpZ3VyYXRpb247XG4gICAgdGhpcy50cmFuc2l0aW9ucyA9IGNvbmZpZy50cmFuc2l0aW9ucztcbiAgICB0aGlzLmNoaWxkcmVuID0gY29uZmlnLmNoaWxkcmVuO1xuICAgIHRoaXMuZG9uZSA9ICEhY29uZmlnLmRvbmU7XG4gICAgdGhpcy50YWdzID0gKF9hID0gQXJyYXkuaXNBcnJheShjb25maWcudGFncykgPyBuZXcgU2V0KGNvbmZpZy50YWdzKSA6IGNvbmZpZy50YWdzKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBuZXcgU2V0KCk7XG4gICAgdGhpcy5tYWNoaW5lID0gY29uZmlnLm1hY2hpbmU7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICduZXh0RXZlbnRzJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXh0RXZlbnRzKF90aGlzLmNvbmZpZ3VyYXRpb24pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYSBuZXcgU3RhdGUgaW5zdGFuY2UgZm9yIHRoZSBnaXZlbiBgc3RhdGVWYWx1ZWAgYW5kIGBjb250ZXh0YC5cclxuICAgKiBAcGFyYW0gc3RhdGVWYWx1ZVxyXG4gICAqIEBwYXJhbSBjb250ZXh0XHJcbiAgICovXG5cblxuICBTdGF0ZS5mcm9tID0gZnVuY3Rpb24gKHN0YXRlVmFsdWUsIGNvbnRleHQpIHtcbiAgICBpZiAoc3RhdGVWYWx1ZSBpbnN0YW5jZW9mIFN0YXRlKSB7XG4gICAgICBpZiAoc3RhdGVWYWx1ZS5jb250ZXh0ICE9PSBjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiBuZXcgU3RhdGUoe1xuICAgICAgICAgIHZhbHVlOiBzdGF0ZVZhbHVlLnZhbHVlLFxuICAgICAgICAgIGNvbnRleHQ6IGNvbnRleHQsXG4gICAgICAgICAgX2V2ZW50OiBzdGF0ZVZhbHVlLl9ldmVudCxcbiAgICAgICAgICBfc2Vzc2lvbmlkOiBudWxsLFxuICAgICAgICAgIGhpc3RvcnlWYWx1ZTogc3RhdGVWYWx1ZS5oaXN0b3J5VmFsdWUsXG4gICAgICAgICAgaGlzdG9yeTogc3RhdGVWYWx1ZS5oaXN0b3J5LFxuICAgICAgICAgIGFjdGlvbnM6IFtdLFxuICAgICAgICAgIGFjdGl2aXRpZXM6IHN0YXRlVmFsdWUuYWN0aXZpdGllcyxcbiAgICAgICAgICBtZXRhOiB7fSxcbiAgICAgICAgICBldmVudHM6IFtdLFxuICAgICAgICAgIGNvbmZpZ3VyYXRpb246IFtdLFxuICAgICAgICAgIHRyYW5zaXRpb25zOiBbXSxcbiAgICAgICAgICBjaGlsZHJlbjoge31cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdGF0ZVZhbHVlO1xuICAgIH1cblxuICAgIHZhciBfZXZlbnQgPSBpbml0RXZlbnQ7XG4gICAgcmV0dXJuIG5ldyBTdGF0ZSh7XG4gICAgICB2YWx1ZTogc3RhdGVWYWx1ZSxcbiAgICAgIGNvbnRleHQ6IGNvbnRleHQsXG4gICAgICBfZXZlbnQ6IF9ldmVudCxcbiAgICAgIF9zZXNzaW9uaWQ6IG51bGwsXG4gICAgICBoaXN0b3J5VmFsdWU6IHVuZGVmaW5lZCxcbiAgICAgIGhpc3Rvcnk6IHVuZGVmaW5lZCxcbiAgICAgIGFjdGlvbnM6IFtdLFxuICAgICAgYWN0aXZpdGllczogdW5kZWZpbmVkLFxuICAgICAgbWV0YTogdW5kZWZpbmVkLFxuICAgICAgZXZlbnRzOiBbXSxcbiAgICAgIGNvbmZpZ3VyYXRpb246IFtdLFxuICAgICAgdHJhbnNpdGlvbnM6IFtdLFxuICAgICAgY2hpbGRyZW46IHt9XG4gICAgfSk7XG4gIH07XG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYSBuZXcgU3RhdGUgaW5zdGFuY2UgZm9yIHRoZSBnaXZlbiBgY29uZmlnYC5cclxuICAgKiBAcGFyYW0gY29uZmlnIFRoZSBzdGF0ZSBjb25maWdcclxuICAgKi9cblxuXG4gIFN0YXRlLmNyZWF0ZSA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICByZXR1cm4gbmV3IFN0YXRlKGNvbmZpZyk7XG4gIH07XG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYSBuZXcgYFN0YXRlYCBpbnN0YW5jZSBmb3IgdGhlIGdpdmVuIGBzdGF0ZVZhbHVlYCBhbmQgYGNvbnRleHRgIHdpdGggbm8gYWN0aW9ucyAoc2lkZS1lZmZlY3RzKS5cclxuICAgKiBAcGFyYW0gc3RhdGVWYWx1ZVxyXG4gICAqIEBwYXJhbSBjb250ZXh0XHJcbiAgICovXG5cblxuICBTdGF0ZS5pbmVydCA9IGZ1bmN0aW9uIChzdGF0ZVZhbHVlLCBjb250ZXh0KSB7XG4gICAgaWYgKHN0YXRlVmFsdWUgaW5zdGFuY2VvZiBTdGF0ZSkge1xuICAgICAgaWYgKCFzdGF0ZVZhbHVlLmFjdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZVZhbHVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgX2V2ZW50ID0gaW5pdEV2ZW50O1xuICAgICAgcmV0dXJuIG5ldyBTdGF0ZSh7XG4gICAgICAgIHZhbHVlOiBzdGF0ZVZhbHVlLnZhbHVlLFxuICAgICAgICBjb250ZXh0OiBjb250ZXh0LFxuICAgICAgICBfZXZlbnQ6IF9ldmVudCxcbiAgICAgICAgX3Nlc3Npb25pZDogbnVsbCxcbiAgICAgICAgaGlzdG9yeVZhbHVlOiBzdGF0ZVZhbHVlLmhpc3RvcnlWYWx1ZSxcbiAgICAgICAgaGlzdG9yeTogc3RhdGVWYWx1ZS5oaXN0b3J5LFxuICAgICAgICBhY3Rpdml0aWVzOiBzdGF0ZVZhbHVlLmFjdGl2aXRpZXMsXG4gICAgICAgIGNvbmZpZ3VyYXRpb246IHN0YXRlVmFsdWUuY29uZmlndXJhdGlvbixcbiAgICAgICAgdHJhbnNpdGlvbnM6IFtdLFxuICAgICAgICBjaGlsZHJlbjoge31cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBTdGF0ZS5mcm9tKHN0YXRlVmFsdWUsIGNvbnRleHQpO1xuICB9O1xuICAvKipcclxuICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGFsbCB0aGUgc3RyaW5nIGxlYWYgc3RhdGUgbm9kZSBwYXRocy5cclxuICAgKiBAcGFyYW0gc3RhdGVWYWx1ZVxyXG4gICAqIEBwYXJhbSBkZWxpbWl0ZXIgVGhlIGNoYXJhY3RlcihzKSB0aGF0IHNlcGFyYXRlIGVhY2ggc3VicGF0aCBpbiB0aGUgc3RyaW5nIHN0YXRlIG5vZGUgcGF0aC5cclxuICAgKi9cblxuXG4gIFN0YXRlLnByb3RvdHlwZS50b1N0cmluZ3MgPSBmdW5jdGlvbiAoc3RhdGVWYWx1ZSwgZGVsaW1pdGVyKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmIChzdGF0ZVZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgIHN0YXRlVmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgIH1cblxuICAgIGlmIChkZWxpbWl0ZXIgPT09IHZvaWQgMCkge1xuICAgICAgZGVsaW1pdGVyID0gJy4nO1xuICAgIH1cblxuICAgIGlmIChpc1N0cmluZyhzdGF0ZVZhbHVlKSkge1xuICAgICAgcmV0dXJuIFtzdGF0ZVZhbHVlXTtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWVLZXlzID0gT2JqZWN0LmtleXMoc3RhdGVWYWx1ZSk7XG4gICAgcmV0dXJuIHZhbHVlS2V5cy5jb25jYXQuYXBwbHkodmFsdWVLZXlzLCBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQodmFsdWVLZXlzLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gX3RoaXMudG9TdHJpbmdzKHN0YXRlVmFsdWVba2V5XSwgZGVsaW1pdGVyKS5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgcmV0dXJuIGtleSArIGRlbGltaXRlciArIHM7XG4gICAgICB9KTtcbiAgICB9KSksIGZhbHNlKSk7XG4gIH07XG5cbiAgU3RhdGUucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2EgPSB0aGlzO1xuICAgICAgICBfYS5jb25maWd1cmF0aW9uO1xuICAgICAgICBfYS50cmFuc2l0aW9ucztcbiAgICAgICAgdmFyIHRhZ3MgPSBfYS50YWdzO1xuICAgICAgICBfYS5tYWNoaW5lO1xuICAgICAgICB2YXIganNvblZhbHVlcyA9IF9fcmVzdChfYSwgW1wiY29uZmlndXJhdGlvblwiLCBcInRyYW5zaXRpb25zXCIsIFwidGFnc1wiLCBcIm1hY2hpbmVcIl0pO1xuXG4gICAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCBqc29uVmFsdWVzKSwge1xuICAgICAgdGFnczogQXJyYXkuZnJvbSh0YWdzKVxuICAgIH0pO1xuICB9O1xuXG4gIFN0YXRlLnByb3RvdHlwZS5tYXRjaGVzID0gZnVuY3Rpb24gKHBhcmVudFN0YXRlVmFsdWUpIHtcbiAgICByZXR1cm4gbWF0Y2hlc1N0YXRlKHBhcmVudFN0YXRlVmFsdWUsIHRoaXMudmFsdWUpO1xuICB9O1xuICAvKipcclxuICAgKiBXaGV0aGVyIHRoZSBjdXJyZW50IHN0YXRlIGNvbmZpZ3VyYXRpb24gaGFzIGEgc3RhdGUgbm9kZSB3aXRoIHRoZSBzcGVjaWZpZWQgYHRhZ2AuXHJcbiAgICogQHBhcmFtIHRhZ1xyXG4gICAqL1xuXG5cbiAgU3RhdGUucHJvdG90eXBlLmhhc1RhZyA9IGZ1bmN0aW9uICh0YWcpIHtcbiAgICByZXR1cm4gdGhpcy50YWdzLmhhcyh0YWcpO1xuICB9O1xuICAvKipcclxuICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgc2VuZGluZyB0aGUgYGV2ZW50YCB3aWxsIGNhdXNlIGEgbm9uLWZvcmJpZGRlbiB0cmFuc2l0aW9uXHJcbiAgICogdG8gYmUgc2VsZWN0ZWQsIGV2ZW4gaWYgdGhlIHRyYW5zaXRpb25zIGhhdmUgbm8gYWN0aW9ucyBub3JcclxuICAgKiBjaGFuZ2UgdGhlIHN0YXRlIHZhbHVlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCB0byB0ZXN0XHJcbiAgICogQHJldHVybnMgV2hldGhlciB0aGUgZXZlbnQgd2lsbCBjYXVzZSBhIHRyYW5zaXRpb25cclxuICAgKi9cblxuXG4gIFN0YXRlLnByb3RvdHlwZS5jYW4gPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgX2E7XG5cbiAgICBpZiAoSVNfUFJPRFVDVElPTikge1xuICAgICAgd2FybighIXRoaXMubWFjaGluZSwgXCJzdGF0ZS5jYW4oLi4uKSB1c2VkIG91dHNpZGUgb2YgYSBtYWNoaW5lLWNyZWF0ZWQgU3RhdGUgb2JqZWN0OyB0aGlzIHdpbGwgYWx3YXlzIHJldHVybiBmYWxzZS5cIik7XG4gICAgfVxuXG4gICAgdmFyIHRyYW5zaXRpb25EYXRhID0gKF9hID0gdGhpcy5tYWNoaW5lKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ2V0VHJhbnNpdGlvbkRhdGEodGhpcywgZXZlbnQpO1xuICAgIHJldHVybiAhISh0cmFuc2l0aW9uRGF0YSA9PT0gbnVsbCB8fCB0cmFuc2l0aW9uRGF0YSA9PT0gdm9pZCAwID8gdm9pZCAwIDogdHJhbnNpdGlvbkRhdGEudHJhbnNpdGlvbnMubGVuZ3RoKSAmJiAvLyBDaGVjayB0aGF0IGF0IGxlYXN0IG9uZSB0cmFuc2l0aW9uIGlzIG5vdCBmb3JiaWRkZW5cbiAgICB0cmFuc2l0aW9uRGF0YS50cmFuc2l0aW9ucy5zb21lKGZ1bmN0aW9uICh0KSB7XG4gICAgICByZXR1cm4gdC50YXJnZXQgIT09IHVuZGVmaW5lZCB8fCB0LmFjdGlvbnMubGVuZ3RoO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBTdGF0ZTtcbn0oKTtcblxuZXhwb3J0IHsgU3RhdGUsIGJpbmRBY3Rpb25Ub1N0YXRlLCBpc1N0YXRlLCBpc1N0YXRlQ29uZmlnLCBzdGF0ZVZhbHVlc0VxdWFsIH07XG4iLCJpbXBvcnQgeyBfX2Fzc2lnbiwgX19zcHJlYWRBcnJheSwgX19yZWFkLCBfX3ZhbHVlcywgX19yZXN0IH0gZnJvbSAnLi9fdmlydHVhbC9fdHNsaWIuanMnO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiwgbWFwVmFsdWVzLCBpc0FycmF5LCBmbGF0dGVuLCB0b0FycmF5LCB0b1N0YXRlVmFsdWUsIGlzU3RyaW5nLCBnZXRFdmVudFR5cGUsIHRvU0NYTUxFdmVudCwgbWF0Y2hlc1N0YXRlLCBwYXRoLCBldmFsdWF0ZUd1YXJkLCBtYXBDb250ZXh0LCBpc1JhaXNhYmxlQWN0aW9uLCBwYXRoVG9TdGF0ZVZhbHVlLCBpc0J1aWx0SW5FdmVudCwgcGFydGl0aW9uLCB1cGRhdGVIaXN0b3J5VmFsdWUsIHRvU3RhdGVQYXRoLCBtYXBGaWx0ZXJWYWx1ZXMsIHdhcm4sIHRvU3RhdGVQYXRocywgbmVzdGVkUGF0aCwgbm9ybWFsaXplVGFyZ2V0LCB0b0d1YXJkLCB0b1RyYW5zaXRpb25Db25maWdBcnJheSwgaXNNYWNoaW5lLCBjcmVhdGVJbnZva2VJZCB9IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHsgU3RhdGUsIHN0YXRlVmFsdWVzRXF1YWwgfSBmcm9tICcuL1N0YXRlLmpzJztcbmltcG9ydCB7IHN0YXJ0IGFzIHN0YXJ0JDEsIHN0b3AgYXMgc3RvcCQxLCBpbnZva2UsIHVwZGF0ZSwgbnVsbEV2ZW50IH0gZnJvbSAnLi9hY3Rpb25UeXBlcy5qcyc7XG5pbXBvcnQgeyBkb25lLCBzdGFydCwgdG9BY3Rpb25PYmplY3RzLCByYWlzZSwgc3RvcCwgcmVzb2x2ZUFjdGlvbnMsIGRvbmVJbnZva2UsIGVycm9yLCB0b0FjdGlvbk9iamVjdCwgdG9BY3Rpdml0eURlZmluaXRpb24sIGFmdGVyLCBzZW5kLCBjYW5jZWwsIGluaXRFdmVudCB9IGZyb20gJy4vYWN0aW9ucy5qcyc7XG5pbXBvcnQgeyBJU19QUk9EVUNUSU9OIH0gZnJvbSAnLi9lbnZpcm9ubWVudC5qcyc7XG5pbXBvcnQgeyBTVEFURV9ERUxJTUlURVIgfSBmcm9tICcuL2NvbnN0YW50cy5qcyc7XG5pbXBvcnQgeyBnZXRBbGxTdGF0ZU5vZGVzLCBnZXRDb25maWd1cmF0aW9uLCBpc0luRmluYWxTdGF0ZSwgZ2V0VGFnc0Zyb21Db25maWd1cmF0aW9uLCBoYXMsIGdldENoaWxkcmVuLCBnZXRWYWx1ZSwgaXNMZWFmTm9kZSwgZ2V0QWxsQ2hpbGRyZW4gfSBmcm9tICcuL3N0YXRlVXRpbHMuanMnO1xuaW1wb3J0IHsgY3JlYXRlSW52b2NhYmxlQWN0b3IgfSBmcm9tICcuL0FjdG9yLmpzJztcbmltcG9ydCB7IHRvSW52b2tlRGVmaW5pdGlvbiB9IGZyb20gJy4vaW52b2tlVXRpbHMuanMnO1xuXG52YXIgTlVMTF9FVkVOVCA9ICcnO1xudmFyIFNUQVRFX0lERU5USUZJRVIgPSAnIyc7XG52YXIgV0lMRENBUkQgPSAnKic7XG52YXIgRU1QVFlfT0JKRUNUID0ge307XG5cbnZhciBpc1N0YXRlSWQgPSBmdW5jdGlvbiAoc3RyKSB7XG4gIHJldHVybiBzdHJbMF0gPT09IFNUQVRFX0lERU5USUZJRVI7XG59O1xuXG52YXIgY3JlYXRlRGVmYXVsdE9wdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgYWN0aW9uczoge30sXG4gICAgZ3VhcmRzOiB7fSxcbiAgICBzZXJ2aWNlczoge30sXG4gICAgYWN0aXZpdGllczoge30sXG4gICAgZGVsYXlzOiB7fVxuICB9O1xufTtcblxudmFyIHZhbGlkYXRlQXJyYXlpZmllZFRyYW5zaXRpb25zID0gZnVuY3Rpb24gKHN0YXRlTm9kZSwgZXZlbnQsIHRyYW5zaXRpb25zKSB7XG4gIHZhciBoYXNOb25MYXN0VW5ndWFyZGVkVGFyZ2V0ID0gdHJhbnNpdGlvbnMuc2xpY2UoMCwgLTEpLnNvbWUoZnVuY3Rpb24gKHRyYW5zaXRpb24pIHtcbiAgICByZXR1cm4gISgnY29uZCcgaW4gdHJhbnNpdGlvbikgJiYgISgnaW4nIGluIHRyYW5zaXRpb24pICYmIChpc1N0cmluZyh0cmFuc2l0aW9uLnRhcmdldCkgfHwgaXNNYWNoaW5lKHRyYW5zaXRpb24udGFyZ2V0KSk7XG4gIH0pO1xuICB2YXIgZXZlbnRUZXh0ID0gZXZlbnQgPT09IE5VTExfRVZFTlQgPyAndGhlIHRyYW5zaWVudCBldmVudCcgOiBcImV2ZW50ICdcIi5jb25jYXQoZXZlbnQsIFwiJ1wiKTtcbiAgd2FybighaGFzTm9uTGFzdFVuZ3VhcmRlZFRhcmdldCwgXCJPbmUgb3IgbW9yZSB0cmFuc2l0aW9ucyBmb3IgXCIuY29uY2F0KGV2ZW50VGV4dCwgXCIgb24gc3RhdGUgJ1wiKS5jb25jYXQoc3RhdGVOb2RlLmlkLCBcIicgYXJlIHVucmVhY2hhYmxlLiBcIikgKyBcIk1ha2Ugc3VyZSB0aGF0IHRoZSBkZWZhdWx0IHRyYW5zaXRpb24gaXMgdGhlIGxhc3Qgb25lIGRlZmluZWQuXCIpO1xufTtcblxudmFyIFN0YXRlTm9kZSA9XG4vKiNfX1BVUkVfXyovXG5cbi8qKiBAY2xhc3MgKi9cbmZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gU3RhdGVOb2RlKFxuICAvKipcclxuICAgKiBUaGUgcmF3IGNvbmZpZyB1c2VkIHRvIGNyZWF0ZSB0aGUgbWFjaGluZS5cclxuICAgKi9cbiAgY29uZmlnLCBvcHRpb25zLFxuICAvKipcclxuICAgKiBUaGUgaW5pdGlhbCBleHRlbmRlZCBzdGF0ZVxyXG4gICAqL1xuICBfY29udGV4dCwgLy8gVE9ETzogdGhpcyBpcyB1bnNhZmUsIGJ1dCB3ZSdyZSByZW1vdmluZyBpdCBpbiB2NSBhbnl3YXlcbiAgX3N0YXRlSW5mbykge1xuICAgIGlmIChfY29udGV4dCA9PT0gdm9pZCAwKSB7XG4gICAgICBfY29udGV4dCA9ICdjb250ZXh0JyBpbiBjb25maWcgPyBjb25maWcuY29udGV4dCA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIF9hO1xuXG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5fY29udGV4dCA9IF9jb250ZXh0O1xuICAgIC8qKlxyXG4gICAgICogVGhlIG9yZGVyIHRoaXMgc3RhdGUgbm9kZSBhcHBlYXJzLiBDb3JyZXNwb25kcyB0byB0aGUgaW1wbGljaXQgU0NYTUwgZG9jdW1lbnQgb3JkZXIuXHJcbiAgICAgKi9cblxuICAgIHRoaXMub3JkZXIgPSAtMTtcbiAgICB0aGlzLl9feHN0YXRlbm9kZSA9IHRydWU7XG4gICAgdGhpcy5fX2NhY2hlID0ge1xuICAgICAgZXZlbnRzOiB1bmRlZmluZWQsXG4gICAgICByZWxhdGl2ZVZhbHVlOiBuZXcgTWFwKCksXG4gICAgICBpbml0aWFsU3RhdGVWYWx1ZTogdW5kZWZpbmVkLFxuICAgICAgaW5pdGlhbFN0YXRlOiB1bmRlZmluZWQsXG4gICAgICBvbjogdW5kZWZpbmVkLFxuICAgICAgdHJhbnNpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgIGNhbmRpZGF0ZXM6IHt9LFxuICAgICAgZGVsYXllZFRyYW5zaXRpb25zOiB1bmRlZmluZWRcbiAgICB9O1xuICAgIHRoaXMuaWRNYXAgPSB7fTtcbiAgICB0aGlzLnRhZ3MgPSBbXTtcbiAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKGNyZWF0ZURlZmF1bHRPcHRpb25zKCksIG9wdGlvbnMpO1xuICAgIHRoaXMucGFyZW50ID0gX3N0YXRlSW5mbyA9PT0gbnVsbCB8fCBfc3RhdGVJbmZvID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfc3RhdGVJbmZvLnBhcmVudDtcbiAgICB0aGlzLmtleSA9IHRoaXMuY29uZmlnLmtleSB8fCAoX3N0YXRlSW5mbyA9PT0gbnVsbCB8fCBfc3RhdGVJbmZvID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfc3RhdGVJbmZvLmtleSkgfHwgdGhpcy5jb25maWcuaWQgfHwgJyhtYWNoaW5lKSc7XG4gICAgdGhpcy5tYWNoaW5lID0gdGhpcy5wYXJlbnQgPyB0aGlzLnBhcmVudC5tYWNoaW5lIDogdGhpcztcbiAgICB0aGlzLnBhdGggPSB0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50LnBhdGguY29uY2F0KHRoaXMua2V5KSA6IFtdO1xuICAgIHRoaXMuZGVsaW1pdGVyID0gdGhpcy5jb25maWcuZGVsaW1pdGVyIHx8ICh0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50LmRlbGltaXRlciA6IFNUQVRFX0RFTElNSVRFUik7XG4gICAgdGhpcy5pZCA9IHRoaXMuY29uZmlnLmlkIHx8IF9fc3ByZWFkQXJyYXkoW3RoaXMubWFjaGluZS5rZXldLCBfX3JlYWQodGhpcy5wYXRoKSwgZmFsc2UpLmpvaW4odGhpcy5kZWxpbWl0ZXIpO1xuICAgIHRoaXMudmVyc2lvbiA9IHRoaXMucGFyZW50ID8gdGhpcy5wYXJlbnQudmVyc2lvbiA6IHRoaXMuY29uZmlnLnZlcnNpb247XG4gICAgdGhpcy50eXBlID0gdGhpcy5jb25maWcudHlwZSB8fCAodGhpcy5jb25maWcucGFyYWxsZWwgPyAncGFyYWxsZWwnIDogdGhpcy5jb25maWcuc3RhdGVzICYmIE9iamVjdC5rZXlzKHRoaXMuY29uZmlnLnN0YXRlcykubGVuZ3RoID8gJ2NvbXBvdW5kJyA6IHRoaXMuY29uZmlnLmhpc3RvcnkgPyAnaGlzdG9yeScgOiAnYXRvbWljJyk7XG4gICAgdGhpcy5zY2hlbWEgPSB0aGlzLnBhcmVudCA/IHRoaXMubWFjaGluZS5zY2hlbWEgOiAoX2EgPSB0aGlzLmNvbmZpZy5zY2hlbWEpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHt9O1xuICAgIHRoaXMuZGVzY3JpcHRpb24gPSB0aGlzLmNvbmZpZy5kZXNjcmlwdGlvbjtcblxuICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgd2FybighKCdwYXJhbGxlbCcgaW4gdGhpcy5jb25maWcpLCBcIlRoZSBcXFwicGFyYWxsZWxcXFwiIHByb3BlcnR5IGlzIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiB2ZXJzaW9uIDQuMS4gXCIuY29uY2F0KHRoaXMuY29uZmlnLnBhcmFsbGVsID8gXCJSZXBsYWNlIHdpdGggYHR5cGU6ICdwYXJhbGxlbCdgXCIgOiBcIlVzZSBgdHlwZTogJ1wiLmNvbmNhdCh0aGlzLnR5cGUsIFwiJ2BcIiksIFwiIGluIHRoZSBjb25maWcgZm9yIHN0YXRlIG5vZGUgJ1wiKS5jb25jYXQodGhpcy5pZCwgXCInIGluc3RlYWQuXCIpKTtcbiAgICB9XG5cbiAgICB0aGlzLmluaXRpYWwgPSB0aGlzLmNvbmZpZy5pbml0aWFsO1xuICAgIHRoaXMuc3RhdGVzID0gdGhpcy5jb25maWcuc3RhdGVzID8gbWFwVmFsdWVzKHRoaXMuY29uZmlnLnN0YXRlcywgZnVuY3Rpb24gKHN0YXRlQ29uZmlnLCBrZXkpIHtcbiAgICAgIHZhciBfYTtcblxuICAgICAgdmFyIHN0YXRlTm9kZSA9IG5ldyBTdGF0ZU5vZGUoc3RhdGVDb25maWcsIHt9LCB1bmRlZmluZWQsIHtcbiAgICAgICAgcGFyZW50OiBfdGhpcyxcbiAgICAgICAga2V5OiBrZXlcbiAgICAgIH0pO1xuICAgICAgT2JqZWN0LmFzc2lnbihfdGhpcy5pZE1hcCwgX19hc3NpZ24oKF9hID0ge30sIF9hW3N0YXRlTm9kZS5pZF0gPSBzdGF0ZU5vZGUsIF9hKSwgc3RhdGVOb2RlLmlkTWFwKSk7XG4gICAgICByZXR1cm4gc3RhdGVOb2RlO1xuICAgIH0pIDogRU1QVFlfT0JKRUNUOyAvLyBEb2N1bWVudCBvcmRlclxuXG4gICAgdmFyIG9yZGVyID0gMDtcblxuICAgIGZ1bmN0aW9uIGRmcyhzdGF0ZU5vZGUpIHtcbiAgICAgIHZhciBlXzEsIF9hO1xuXG4gICAgICBzdGF0ZU5vZGUub3JkZXIgPSBvcmRlcisrO1xuXG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciBfYiA9IF9fdmFsdWVzKGdldEFsbENoaWxkcmVuKHN0YXRlTm9kZSkpLCBfYyA9IF9iLm5leHQoKTsgIV9jLmRvbmU7IF9jID0gX2IubmV4dCgpKSB7XG4gICAgICAgICAgdmFyIGNoaWxkID0gX2MudmFsdWU7XG4gICAgICAgICAgZGZzKGNoaWxkKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZV8xXzEpIHtcbiAgICAgICAgZV8xID0ge1xuICAgICAgICAgIGVycm9yOiBlXzFfMVxuICAgICAgICB9O1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoX2MgJiYgIV9jLmRvbmUgJiYgKF9hID0gX2IucmV0dXJuKSkgX2EuY2FsbChfYik7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZGZzKHRoaXMpOyAvLyBIaXN0b3J5IGNvbmZpZ1xuXG4gICAgdGhpcy5oaXN0b3J5ID0gdGhpcy5jb25maWcuaGlzdG9yeSA9PT0gdHJ1ZSA/ICdzaGFsbG93JyA6IHRoaXMuY29uZmlnLmhpc3RvcnkgfHwgZmFsc2U7XG4gICAgdGhpcy5fdHJhbnNpZW50ID0gISF0aGlzLmNvbmZpZy5hbHdheXMgfHwgKCF0aGlzLmNvbmZpZy5vbiA/IGZhbHNlIDogQXJyYXkuaXNBcnJheSh0aGlzLmNvbmZpZy5vbikgPyB0aGlzLmNvbmZpZy5vbi5zb21lKGZ1bmN0aW9uIChfYSkge1xuICAgICAgdmFyIGV2ZW50ID0gX2EuZXZlbnQ7XG4gICAgICByZXR1cm4gZXZlbnQgPT09IE5VTExfRVZFTlQ7XG4gICAgfSkgOiBOVUxMX0VWRU5UIGluIHRoaXMuY29uZmlnLm9uKTtcbiAgICB0aGlzLnN0cmljdCA9ICEhdGhpcy5jb25maWcuc3RyaWN0OyAvLyBUT0RPOiBkZXByZWNhdGUgKGVudHJ5KVxuXG4gICAgdGhpcy5vbkVudHJ5ID0gdG9BcnJheSh0aGlzLmNvbmZpZy5lbnRyeSB8fCB0aGlzLmNvbmZpZy5vbkVudHJ5KS5tYXAoZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgcmV0dXJuIHRvQWN0aW9uT2JqZWN0KGFjdGlvbik7XG4gICAgfSk7IC8vIFRPRE86IGRlcHJlY2F0ZSAoZXhpdClcblxuICAgIHRoaXMub25FeGl0ID0gdG9BcnJheSh0aGlzLmNvbmZpZy5leGl0IHx8IHRoaXMuY29uZmlnLm9uRXhpdCkubWFwKGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgIHJldHVybiB0b0FjdGlvbk9iamVjdChhY3Rpb24pO1xuICAgIH0pO1xuICAgIHRoaXMubWV0YSA9IHRoaXMuY29uZmlnLm1ldGE7XG4gICAgdGhpcy5kb25lRGF0YSA9IHRoaXMudHlwZSA9PT0gJ2ZpbmFsJyA/IHRoaXMuY29uZmlnLmRhdGEgOiB1bmRlZmluZWQ7XG4gICAgdGhpcy5pbnZva2UgPSB0b0FycmF5KHRoaXMuY29uZmlnLmludm9rZSkubWFwKGZ1bmN0aW9uIChpbnZva2VDb25maWcsIGkpIHtcbiAgICAgIHZhciBfYSwgX2I7XG5cbiAgICAgIGlmIChpc01hY2hpbmUoaW52b2tlQ29uZmlnKSkge1xuICAgICAgICB2YXIgaW52b2tlSWQgPSBjcmVhdGVJbnZva2VJZChfdGhpcy5pZCwgaSk7XG4gICAgICAgIF90aGlzLm1hY2hpbmUub3B0aW9ucy5zZXJ2aWNlcyA9IF9fYXNzaWduKChfYSA9IHt9LCBfYVtpbnZva2VJZF0gPSBpbnZva2VDb25maWcsIF9hKSwgX3RoaXMubWFjaGluZS5vcHRpb25zLnNlcnZpY2VzKTtcbiAgICAgICAgcmV0dXJuIHRvSW52b2tlRGVmaW5pdGlvbih7XG4gICAgICAgICAgc3JjOiBpbnZva2VJZCxcbiAgICAgICAgICBpZDogaW52b2tlSWRcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKGlzU3RyaW5nKGludm9rZUNvbmZpZy5zcmMpKSB7XG4gICAgICAgIHZhciBpbnZva2VJZCA9IGludm9rZUNvbmZpZy5pZCB8fCBjcmVhdGVJbnZva2VJZChfdGhpcy5pZCwgaSk7XG4gICAgICAgIHJldHVybiB0b0ludm9rZURlZmluaXRpb24oX19hc3NpZ24oX19hc3NpZ24oe30sIGludm9rZUNvbmZpZyksIHtcbiAgICAgICAgICBpZDogaW52b2tlSWQsXG4gICAgICAgICAgc3JjOiBpbnZva2VDb25maWcuc3JjXG4gICAgICAgIH0pKTtcbiAgICAgIH0gZWxzZSBpZiAoaXNNYWNoaW5lKGludm9rZUNvbmZpZy5zcmMpIHx8IGlzRnVuY3Rpb24oaW52b2tlQ29uZmlnLnNyYykpIHtcbiAgICAgICAgdmFyIGludm9rZUlkID0gaW52b2tlQ29uZmlnLmlkIHx8IGNyZWF0ZUludm9rZUlkKF90aGlzLmlkLCBpKTtcbiAgICAgICAgX3RoaXMubWFjaGluZS5vcHRpb25zLnNlcnZpY2VzID0gX19hc3NpZ24oKF9iID0ge30sIF9iW2ludm9rZUlkXSA9IGludm9rZUNvbmZpZy5zcmMsIF9iKSwgX3RoaXMubWFjaGluZS5vcHRpb25zLnNlcnZpY2VzKTtcbiAgICAgICAgcmV0dXJuIHRvSW52b2tlRGVmaW5pdGlvbihfX2Fzc2lnbihfX2Fzc2lnbih7XG4gICAgICAgICAgaWQ6IGludm9rZUlkXG4gICAgICAgIH0sIGludm9rZUNvbmZpZyksIHtcbiAgICAgICAgICBzcmM6IGludm9rZUlkXG4gICAgICAgIH0pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBpbnZva2VTb3VyY2UgPSBpbnZva2VDb25maWcuc3JjO1xuICAgICAgICByZXR1cm4gdG9JbnZva2VEZWZpbml0aW9uKF9fYXNzaWduKF9fYXNzaWduKHtcbiAgICAgICAgICBpZDogY3JlYXRlSW52b2tlSWQoX3RoaXMuaWQsIGkpXG4gICAgICAgIH0sIGludm9rZUNvbmZpZyksIHtcbiAgICAgICAgICBzcmM6IGludm9rZVNvdXJjZVxuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5hY3Rpdml0aWVzID0gdG9BcnJheSh0aGlzLmNvbmZpZy5hY3Rpdml0aWVzKS5jb25jYXQodGhpcy5pbnZva2UpLm1hcChmdW5jdGlvbiAoYWN0aXZpdHkpIHtcbiAgICAgIHJldHVybiB0b0FjdGl2aXR5RGVmaW5pdGlvbihhY3Rpdml0eSk7XG4gICAgfSk7XG4gICAgdGhpcy50cmFuc2l0aW9uID0gdGhpcy50cmFuc2l0aW9uLmJpbmQodGhpcyk7XG4gICAgdGhpcy50YWdzID0gdG9BcnJheSh0aGlzLmNvbmZpZy50YWdzKTsgLy8gVE9ETzogdGhpcyBpcyB0aGUgcmVhbCBmaXggZm9yIGluaXRpYWxpemF0aW9uIG9uY2VcbiAgICAvLyBzdGF0ZSBub2RlIGdldHRlcnMgYXJlIGRlcHJlY2F0ZWRcbiAgICAvLyBpZiAoIXRoaXMucGFyZW50KSB7XG4gICAgLy8gICB0aGlzLl9pbml0KCk7XG4gICAgLy8gfVxuICB9XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5fX2NhY2hlLnRyYW5zaXRpb25zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZ2V0QWxsU3RhdGVOb2Rlcyh0aGlzKS5mb3JFYWNoKGZ1bmN0aW9uIChzdGF0ZU5vZGUpIHtcbiAgICAgIHJldHVybiBzdGF0ZU5vZGUub247XG4gICAgfSk7XG4gIH07XG4gIC8qKlxyXG4gICAqIENsb25lcyB0aGlzIHN0YXRlIG1hY2hpbmUgd2l0aCBjdXN0b20gb3B0aW9ucyBhbmQgY29udGV4dC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgKGFjdGlvbnMsIGd1YXJkcywgYWN0aXZpdGllcywgc2VydmljZXMpIHRvIHJlY3Vyc2l2ZWx5IG1lcmdlIHdpdGggdGhlIGV4aXN0aW5nIG9wdGlvbnMuXHJcbiAgICogQHBhcmFtIGNvbnRleHQgQ3VzdG9tIGNvbnRleHQgKHdpbGwgb3ZlcnJpZGUgcHJlZGVmaW5lZCBjb250ZXh0KVxyXG4gICAqL1xuXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS53aXRoQ29uZmlnID0gZnVuY3Rpb24gKG9wdGlvbnMsIGNvbnRleHQpIHtcbiAgICB2YXIgX2EgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgIGFjdGlvbnMgPSBfYS5hY3Rpb25zLFxuICAgICAgICBhY3Rpdml0aWVzID0gX2EuYWN0aXZpdGllcyxcbiAgICAgICAgZ3VhcmRzID0gX2EuZ3VhcmRzLFxuICAgICAgICBzZXJ2aWNlcyA9IF9hLnNlcnZpY2VzLFxuICAgICAgICBkZWxheXMgPSBfYS5kZWxheXM7XG4gICAgcmV0dXJuIG5ldyBTdGF0ZU5vZGUodGhpcy5jb25maWcsIHtcbiAgICAgIGFjdGlvbnM6IF9fYXNzaWduKF9fYXNzaWduKHt9LCBhY3Rpb25zKSwgb3B0aW9ucy5hY3Rpb25zKSxcbiAgICAgIGFjdGl2aXRpZXM6IF9fYXNzaWduKF9fYXNzaWduKHt9LCBhY3Rpdml0aWVzKSwgb3B0aW9ucy5hY3Rpdml0aWVzKSxcbiAgICAgIGd1YXJkczogX19hc3NpZ24oX19hc3NpZ24oe30sIGd1YXJkcyksIG9wdGlvbnMuZ3VhcmRzKSxcbiAgICAgIHNlcnZpY2VzOiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgc2VydmljZXMpLCBvcHRpb25zLnNlcnZpY2VzKSxcbiAgICAgIGRlbGF5czogX19hc3NpZ24oX19hc3NpZ24oe30sIGRlbGF5cyksIG9wdGlvbnMuZGVsYXlzKVxuICAgIH0sIGNvbnRleHQgIT09IG51bGwgJiYgY29udGV4dCAhPT0gdm9pZCAwID8gY29udGV4dCA6IHRoaXMuY29udGV4dCk7XG4gIH07XG4gIC8qKlxyXG4gICAqIENsb25lcyB0aGlzIHN0YXRlIG1hY2hpbmUgd2l0aCBjdXN0b20gY29udGV4dC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBjb250ZXh0IEN1c3RvbSBjb250ZXh0ICh3aWxsIG92ZXJyaWRlIHByZWRlZmluZWQgY29udGV4dCwgbm90IHJlY3Vyc2l2ZSlcclxuICAgKi9cblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUud2l0aENvbnRleHQgPSBmdW5jdGlvbiAoY29udGV4dCkge1xuICAgIHJldHVybiBuZXcgU3RhdGVOb2RlKHRoaXMuY29uZmlnLCB0aGlzLm9wdGlvbnMsIGNvbnRleHQpO1xuICB9O1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGF0ZU5vZGUucHJvdG90eXBlLCBcImNvbnRleHRcIiwge1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGlzRnVuY3Rpb24odGhpcy5fY29udGV4dCkgPyB0aGlzLl9jb250ZXh0KCkgOiB0aGlzLl9jb250ZXh0O1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RhdGVOb2RlLnByb3RvdHlwZSwgXCJkZWZpbml0aW9uXCIsIHtcbiAgICAvKipcclxuICAgICAqIFRoZSB3ZWxsLXN0cnVjdHVyZWQgc3RhdGUgbm9kZSBkZWZpbml0aW9uLlxyXG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogdGhpcy5pZCxcbiAgICAgICAga2V5OiB0aGlzLmtleSxcbiAgICAgICAgdmVyc2lvbjogdGhpcy52ZXJzaW9uLFxuICAgICAgICBjb250ZXh0OiB0aGlzLmNvbnRleHQsXG4gICAgICAgIHR5cGU6IHRoaXMudHlwZSxcbiAgICAgICAgaW5pdGlhbDogdGhpcy5pbml0aWFsLFxuICAgICAgICBoaXN0b3J5OiB0aGlzLmhpc3RvcnksXG4gICAgICAgIHN0YXRlczogbWFwVmFsdWVzKHRoaXMuc3RhdGVzLCBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgICByZXR1cm4gc3RhdGUuZGVmaW5pdGlvbjtcbiAgICAgICAgfSksXG4gICAgICAgIG9uOiB0aGlzLm9uLFxuICAgICAgICB0cmFuc2l0aW9uczogdGhpcy50cmFuc2l0aW9ucyxcbiAgICAgICAgZW50cnk6IHRoaXMub25FbnRyeSxcbiAgICAgICAgZXhpdDogdGhpcy5vbkV4aXQsXG4gICAgICAgIGFjdGl2aXRpZXM6IHRoaXMuYWN0aXZpdGllcyB8fCBbXSxcbiAgICAgICAgbWV0YTogdGhpcy5tZXRhLFxuICAgICAgICBvcmRlcjogdGhpcy5vcmRlciB8fCAtMSxcbiAgICAgICAgZGF0YTogdGhpcy5kb25lRGF0YSxcbiAgICAgICAgaW52b2tlOiB0aGlzLmludm9rZSxcbiAgICAgICAgZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXG4gICAgICAgIHRhZ3M6IHRoaXMudGFnc1xuICAgICAgfTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZpbml0aW9uO1xuICB9O1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGF0ZU5vZGUucHJvdG90eXBlLCBcIm9uXCIsIHtcbiAgICAvKipcclxuICAgICAqIFRoZSBtYXBwaW5nIG9mIGV2ZW50cyB0byB0cmFuc2l0aW9ucy5cclxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMuX19jYWNoZS5vbikge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2NhY2hlLm9uO1xuICAgICAgfVxuXG4gICAgICB2YXIgdHJhbnNpdGlvbnMgPSB0aGlzLnRyYW5zaXRpb25zO1xuICAgICAgcmV0dXJuIHRoaXMuX19jYWNoZS5vbiA9IHRyYW5zaXRpb25zLnJlZHVjZShmdW5jdGlvbiAobWFwLCB0cmFuc2l0aW9uKSB7XG4gICAgICAgIG1hcFt0cmFuc2l0aW9uLmV2ZW50VHlwZV0gPSBtYXBbdHJhbnNpdGlvbi5ldmVudFR5cGVdIHx8IFtdO1xuICAgICAgICBtYXBbdHJhbnNpdGlvbi5ldmVudFR5cGVdLnB1c2godHJhbnNpdGlvbik7XG4gICAgICAgIHJldHVybiBtYXA7XG4gICAgICB9LCB7fSk7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGF0ZU5vZGUucHJvdG90eXBlLCBcImFmdGVyXCIsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9fY2FjaGUuZGVsYXllZFRyYW5zaXRpb25zIHx8ICh0aGlzLl9fY2FjaGUuZGVsYXllZFRyYW5zaXRpb25zID0gdGhpcy5nZXREZWxheWVkVHJhbnNpdGlvbnMoKSwgdGhpcy5fX2NhY2hlLmRlbGF5ZWRUcmFuc2l0aW9ucyk7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGF0ZU5vZGUucHJvdG90eXBlLCBcInRyYW5zaXRpb25zXCIsIHtcbiAgICAvKipcclxuICAgICAqIEFsbCB0aGUgdHJhbnNpdGlvbnMgdGhhdCBjYW4gYmUgdGFrZW4gZnJvbSB0aGlzIHN0YXRlIG5vZGUuXHJcbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9fY2FjaGUudHJhbnNpdGlvbnMgfHwgKHRoaXMuX19jYWNoZS50cmFuc2l0aW9ucyA9IHRoaXMuZm9ybWF0VHJhbnNpdGlvbnMoKSwgdGhpcy5fX2NhY2hlLnRyYW5zaXRpb25zKTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldENhbmRpZGF0ZXMgPSBmdW5jdGlvbiAoZXZlbnROYW1lKSB7XG4gICAgaWYgKHRoaXMuX19jYWNoZS5jYW5kaWRhdGVzW2V2ZW50TmFtZV0pIHtcbiAgICAgIHJldHVybiB0aGlzLl9fY2FjaGUuY2FuZGlkYXRlc1tldmVudE5hbWVdO1xuICAgIH1cblxuICAgIHZhciB0cmFuc2llbnQgPSBldmVudE5hbWUgPT09IE5VTExfRVZFTlQ7XG4gICAgdmFyIGNhbmRpZGF0ZXMgPSB0aGlzLnRyYW5zaXRpb25zLmZpbHRlcihmdW5jdGlvbiAodHJhbnNpdGlvbikge1xuICAgICAgdmFyIHNhbWVFdmVudFR5cGUgPSB0cmFuc2l0aW9uLmV2ZW50VHlwZSA9PT0gZXZlbnROYW1lOyAvLyBudWxsIGV2ZW50cyBzaG91bGQgb25seSBtYXRjaCBhZ2FpbnN0IGV2ZW50bGVzcyB0cmFuc2l0aW9uc1xuXG4gICAgICByZXR1cm4gdHJhbnNpZW50ID8gc2FtZUV2ZW50VHlwZSA6IHNhbWVFdmVudFR5cGUgfHwgdHJhbnNpdGlvbi5ldmVudFR5cGUgPT09IFdJTERDQVJEO1xuICAgIH0pO1xuICAgIHRoaXMuX19jYWNoZS5jYW5kaWRhdGVzW2V2ZW50TmFtZV0gPSBjYW5kaWRhdGVzO1xuICAgIHJldHVybiBjYW5kaWRhdGVzO1xuICB9O1xuICAvKipcclxuICAgKiBBbGwgZGVsYXllZCB0cmFuc2l0aW9ucyBmcm9tIHRoZSBjb25maWcuXHJcbiAgICovXG5cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldERlbGF5ZWRUcmFuc2l0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIGFmdGVyQ29uZmlnID0gdGhpcy5jb25maWcuYWZ0ZXI7XG5cbiAgICBpZiAoIWFmdGVyQ29uZmlnKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgdmFyIG11dGF0ZUVudHJ5RXhpdCA9IGZ1bmN0aW9uIChkZWxheSwgaSkge1xuICAgICAgdmFyIGRlbGF5UmVmID0gaXNGdW5jdGlvbihkZWxheSkgPyBcIlwiLmNvbmNhdChfdGhpcy5pZCwgXCI6ZGVsYXlbXCIpLmNvbmNhdChpLCBcIl1cIikgOiBkZWxheTtcbiAgICAgIHZhciBldmVudFR5cGUgPSBhZnRlcihkZWxheVJlZiwgX3RoaXMuaWQpO1xuXG4gICAgICBfdGhpcy5vbkVudHJ5LnB1c2goc2VuZChldmVudFR5cGUsIHtcbiAgICAgICAgZGVsYXk6IGRlbGF5XG4gICAgICB9KSk7XG5cbiAgICAgIF90aGlzLm9uRXhpdC5wdXNoKGNhbmNlbChldmVudFR5cGUpKTtcblxuICAgICAgcmV0dXJuIGV2ZW50VHlwZTtcbiAgICB9O1xuXG4gICAgdmFyIGRlbGF5ZWRUcmFuc2l0aW9ucyA9IGlzQXJyYXkoYWZ0ZXJDb25maWcpID8gYWZ0ZXJDb25maWcubWFwKGZ1bmN0aW9uICh0cmFuc2l0aW9uLCBpKSB7XG4gICAgICB2YXIgZXZlbnRUeXBlID0gbXV0YXRlRW50cnlFeGl0KHRyYW5zaXRpb24uZGVsYXksIGkpO1xuICAgICAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCB0cmFuc2l0aW9uKSwge1xuICAgICAgICBldmVudDogZXZlbnRUeXBlXG4gICAgICB9KTtcbiAgICB9KSA6IGZsYXR0ZW4oT2JqZWN0LmtleXMoYWZ0ZXJDb25maWcpLm1hcChmdW5jdGlvbiAoZGVsYXksIGkpIHtcbiAgICAgIHZhciBjb25maWdUcmFuc2l0aW9uID0gYWZ0ZXJDb25maWdbZGVsYXldO1xuICAgICAgdmFyIHJlc29sdmVkVHJhbnNpdGlvbiA9IGlzU3RyaW5nKGNvbmZpZ1RyYW5zaXRpb24pID8ge1xuICAgICAgICB0YXJnZXQ6IGNvbmZpZ1RyYW5zaXRpb25cbiAgICAgIH0gOiBjb25maWdUcmFuc2l0aW9uO1xuICAgICAgdmFyIHJlc29sdmVkRGVsYXkgPSAhaXNOYU4oK2RlbGF5KSA/ICtkZWxheSA6IGRlbGF5O1xuICAgICAgdmFyIGV2ZW50VHlwZSA9IG11dGF0ZUVudHJ5RXhpdChyZXNvbHZlZERlbGF5LCBpKTtcbiAgICAgIHJldHVybiB0b0FycmF5KHJlc29sdmVkVHJhbnNpdGlvbikubWFwKGZ1bmN0aW9uICh0cmFuc2l0aW9uKSB7XG4gICAgICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgdHJhbnNpdGlvbiksIHtcbiAgICAgICAgICBldmVudDogZXZlbnRUeXBlLFxuICAgICAgICAgIGRlbGF5OiByZXNvbHZlZERlbGF5XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSkpO1xuICAgIHJldHVybiBkZWxheWVkVHJhbnNpdGlvbnMubWFwKGZ1bmN0aW9uIChkZWxheWVkVHJhbnNpdGlvbikge1xuICAgICAgdmFyIGRlbGF5ID0gZGVsYXllZFRyYW5zaXRpb24uZGVsYXk7XG4gICAgICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIF90aGlzLmZvcm1hdFRyYW5zaXRpb24oZGVsYXllZFRyYW5zaXRpb24pKSwge1xuICAgICAgICBkZWxheTogZGVsYXlcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBzdGF0ZSBub2RlcyByZXByZXNlbnRlZCBieSB0aGUgY3VycmVudCBzdGF0ZSB2YWx1ZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBzdGF0ZSBUaGUgc3RhdGUgdmFsdWUgb3IgU3RhdGUgaW5zdGFuY2VcclxuICAgKi9cblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZ2V0U3RhdGVOb2RlcyA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIHZhciBfYTtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoIXN0YXRlKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgdmFyIHN0YXRlVmFsdWUgPSBzdGF0ZSBpbnN0YW5jZW9mIFN0YXRlID8gc3RhdGUudmFsdWUgOiB0b1N0YXRlVmFsdWUoc3RhdGUsIHRoaXMuZGVsaW1pdGVyKTtcblxuICAgIGlmIChpc1N0cmluZyhzdGF0ZVZhbHVlKSkge1xuICAgICAgdmFyIGluaXRpYWxTdGF0ZVZhbHVlID0gdGhpcy5nZXRTdGF0ZU5vZGUoc3RhdGVWYWx1ZSkuaW5pdGlhbDtcbiAgICAgIHJldHVybiBpbml0aWFsU3RhdGVWYWx1ZSAhPT0gdW5kZWZpbmVkID8gdGhpcy5nZXRTdGF0ZU5vZGVzKChfYSA9IHt9LCBfYVtzdGF0ZVZhbHVlXSA9IGluaXRpYWxTdGF0ZVZhbHVlLCBfYSkpIDogW3RoaXMsIHRoaXMuc3RhdGVzW3N0YXRlVmFsdWVdXTtcbiAgICB9XG5cbiAgICB2YXIgc3ViU3RhdGVLZXlzID0gT2JqZWN0LmtleXMoc3RhdGVWYWx1ZSk7XG4gICAgdmFyIHN1YlN0YXRlTm9kZXMgPSBbdGhpc107XG4gICAgc3ViU3RhdGVOb2Rlcy5wdXNoLmFwcGx5KHN1YlN0YXRlTm9kZXMsIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChmbGF0dGVuKHN1YlN0YXRlS2V5cy5tYXAoZnVuY3Rpb24gKHN1YlN0YXRlS2V5KSB7XG4gICAgICByZXR1cm4gX3RoaXMuZ2V0U3RhdGVOb2RlKHN1YlN0YXRlS2V5KS5nZXRTdGF0ZU5vZGVzKHN0YXRlVmFsdWVbc3ViU3RhdGVLZXldKTtcbiAgICB9KSkpLCBmYWxzZSkpO1xuICAgIHJldHVybiBzdWJTdGF0ZU5vZGVzO1xuICB9O1xuICAvKipcclxuICAgKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGlzIHN0YXRlIG5vZGUgZXhwbGljaXRseSBoYW5kbGVzIHRoZSBnaXZlbiBldmVudC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgaW4gcXVlc3Rpb25cclxuICAgKi9cblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuaGFuZGxlcyA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBldmVudFR5cGUgPSBnZXRFdmVudFR5cGUoZXZlbnQpO1xuICAgIHJldHVybiB0aGlzLmV2ZW50cy5pbmNsdWRlcyhldmVudFR5cGUpO1xuICB9O1xuICAvKipcclxuICAgKiBSZXNvbHZlcyB0aGUgZ2l2ZW4gYHN0YXRlYCB0byBhIG5ldyBgU3RhdGVgIGluc3RhbmNlIHJlbGF0aXZlIHRvIHRoaXMgbWFjaGluZS5cclxuICAgKlxyXG4gICAqIFRoaXMgZW5zdXJlcyB0aGF0IGAuZXZlbnRzYCBhbmQgYC5uZXh0RXZlbnRzYCByZXByZXNlbnQgdGhlIGNvcnJlY3QgdmFsdWVzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHN0YXRlIFRoZSBzdGF0ZSB0byByZXNvbHZlXHJcbiAgICovXG5cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLnJlc29sdmVTdGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIHZhciBzdGF0ZUZyb21Db25maWcgPSBzdGF0ZSBpbnN0YW5jZW9mIFN0YXRlID8gc3RhdGUgOiBTdGF0ZS5jcmVhdGUoc3RhdGUpO1xuICAgIHZhciBjb25maWd1cmF0aW9uID0gQXJyYXkuZnJvbShnZXRDb25maWd1cmF0aW9uKFtdLCB0aGlzLmdldFN0YXRlTm9kZXMoc3RhdGVGcm9tQ29uZmlnLnZhbHVlKSkpO1xuICAgIHJldHVybiBuZXcgU3RhdGUoX19hc3NpZ24oX19hc3NpZ24oe30sIHN0YXRlRnJvbUNvbmZpZyksIHtcbiAgICAgIHZhbHVlOiB0aGlzLnJlc29sdmUoc3RhdGVGcm9tQ29uZmlnLnZhbHVlKSxcbiAgICAgIGNvbmZpZ3VyYXRpb246IGNvbmZpZ3VyYXRpb24sXG4gICAgICBkb25lOiBpc0luRmluYWxTdGF0ZShjb25maWd1cmF0aW9uLCB0aGlzKSxcbiAgICAgIHRhZ3M6IGdldFRhZ3NGcm9tQ29uZmlndXJhdGlvbihjb25maWd1cmF0aW9uKSxcbiAgICAgIG1hY2hpbmU6IHRoaXMubWFjaGluZVxuICAgIH0pKTtcbiAgfTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLnRyYW5zaXRpb25MZWFmTm9kZSA9IGZ1bmN0aW9uIChzdGF0ZVZhbHVlLCBzdGF0ZSwgX2V2ZW50KSB7XG4gICAgdmFyIHN0YXRlTm9kZSA9IHRoaXMuZ2V0U3RhdGVOb2RlKHN0YXRlVmFsdWUpO1xuICAgIHZhciBuZXh0ID0gc3RhdGVOb2RlLm5leHQoc3RhdGUsIF9ldmVudCk7XG5cbiAgICBpZiAoIW5leHQgfHwgIW5leHQudHJhbnNpdGlvbnMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdGhpcy5uZXh0KHN0YXRlLCBfZXZlbnQpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXh0O1xuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUudHJhbnNpdGlvbkNvbXBvdW5kTm9kZSA9IGZ1bmN0aW9uIChzdGF0ZVZhbHVlLCBzdGF0ZSwgX2V2ZW50KSB7XG4gICAgdmFyIHN1YlN0YXRlS2V5cyA9IE9iamVjdC5rZXlzKHN0YXRlVmFsdWUpO1xuICAgIHZhciBzdGF0ZU5vZGUgPSB0aGlzLmdldFN0YXRlTm9kZShzdWJTdGF0ZUtleXNbMF0pO1xuXG4gICAgdmFyIG5leHQgPSBzdGF0ZU5vZGUuX3RyYW5zaXRpb24oc3RhdGVWYWx1ZVtzdWJTdGF0ZUtleXNbMF1dLCBzdGF0ZSwgX2V2ZW50KTtcblxuICAgIGlmICghbmV4dCB8fCAhbmV4dC50cmFuc2l0aW9ucy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0aGlzLm5leHQoc3RhdGUsIF9ldmVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5leHQ7XG4gIH07XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS50cmFuc2l0aW9uUGFyYWxsZWxOb2RlID0gZnVuY3Rpb24gKHN0YXRlVmFsdWUsIHN0YXRlLCBfZXZlbnQpIHtcbiAgICB2YXIgZV8yLCBfYTtcblxuICAgIHZhciB0cmFuc2l0aW9uTWFwID0ge307XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2IgPSBfX3ZhbHVlcyhPYmplY3Qua2V5cyhzdGF0ZVZhbHVlKSksIF9jID0gX2IubmV4dCgpOyAhX2MuZG9uZTsgX2MgPSBfYi5uZXh0KCkpIHtcbiAgICAgICAgdmFyIHN1YlN0YXRlS2V5ID0gX2MudmFsdWU7XG4gICAgICAgIHZhciBzdWJTdGF0ZVZhbHVlID0gc3RhdGVWYWx1ZVtzdWJTdGF0ZUtleV07XG5cbiAgICAgICAgaWYgKCFzdWJTdGF0ZVZhbHVlKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3ViU3RhdGVOb2RlID0gdGhpcy5nZXRTdGF0ZU5vZGUoc3ViU3RhdGVLZXkpO1xuXG4gICAgICAgIHZhciBuZXh0ID0gc3ViU3RhdGVOb2RlLl90cmFuc2l0aW9uKHN1YlN0YXRlVmFsdWUsIHN0YXRlLCBfZXZlbnQpO1xuXG4gICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgdHJhbnNpdGlvbk1hcFtzdWJTdGF0ZUtleV0gPSBuZXh0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV8yXzEpIHtcbiAgICAgIGVfMiA9IHtcbiAgICAgICAgZXJyb3I6IGVfMl8xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoX2MgJiYgIV9jLmRvbmUgJiYgKF9hID0gX2IucmV0dXJuKSkgX2EuY2FsbChfYik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV8yKSB0aHJvdyBlXzIuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHN0YXRlVHJhbnNpdGlvbnMgPSBPYmplY3Qua2V5cyh0cmFuc2l0aW9uTWFwKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgcmV0dXJuIHRyYW5zaXRpb25NYXBba2V5XTtcbiAgICB9KTtcbiAgICB2YXIgZW5hYmxlZFRyYW5zaXRpb25zID0gZmxhdHRlbihzdGF0ZVRyYW5zaXRpb25zLm1hcChmdW5jdGlvbiAoc3QpIHtcbiAgICAgIHJldHVybiBzdC50cmFuc2l0aW9ucztcbiAgICB9KSk7XG4gICAgdmFyIHdpbGxUcmFuc2l0aW9uID0gc3RhdGVUcmFuc2l0aW9ucy5zb21lKGZ1bmN0aW9uIChzdCkge1xuICAgICAgcmV0dXJuIHN0LnRyYW5zaXRpb25zLmxlbmd0aCA+IDA7XG4gICAgfSk7XG5cbiAgICBpZiAoIXdpbGxUcmFuc2l0aW9uKSB7XG4gICAgICByZXR1cm4gdGhpcy5uZXh0KHN0YXRlLCBfZXZlbnQpO1xuICAgIH1cblxuICAgIHZhciBjb25maWd1cmF0aW9uID0gZmxhdHRlbihPYmplY3Qua2V5cyh0cmFuc2l0aW9uTWFwKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgcmV0dXJuIHRyYW5zaXRpb25NYXBba2V5XS5jb25maWd1cmF0aW9uO1xuICAgIH0pKTtcbiAgICByZXR1cm4ge1xuICAgICAgdHJhbnNpdGlvbnM6IGVuYWJsZWRUcmFuc2l0aW9ucyxcbiAgICAgIGV4aXRTZXQ6IGZsYXR0ZW4oc3RhdGVUcmFuc2l0aW9ucy5tYXAoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgcmV0dXJuIHQuZXhpdFNldDtcbiAgICAgIH0pKSxcbiAgICAgIGNvbmZpZ3VyYXRpb246IGNvbmZpZ3VyYXRpb24sXG4gICAgICBzb3VyY2U6IHN0YXRlLFxuICAgICAgYWN0aW9uczogZmxhdHRlbihPYmplY3Qua2V5cyh0cmFuc2l0aW9uTWFwKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4gdHJhbnNpdGlvbk1hcFtrZXldLmFjdGlvbnM7XG4gICAgICB9KSlcbiAgICB9O1xuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuX3RyYW5zaXRpb24gPSBmdW5jdGlvbiAoc3RhdGVWYWx1ZSwgc3RhdGUsIF9ldmVudCkge1xuICAgIC8vIGxlYWYgbm9kZVxuICAgIGlmIChpc1N0cmluZyhzdGF0ZVZhbHVlKSkge1xuICAgICAgcmV0dXJuIHRoaXMudHJhbnNpdGlvbkxlYWZOb2RlKHN0YXRlVmFsdWUsIHN0YXRlLCBfZXZlbnQpO1xuICAgIH0gLy8gaGllcmFyY2hpY2FsIG5vZGVcblxuXG4gICAgaWYgKE9iamVjdC5rZXlzKHN0YXRlVmFsdWUpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIHRoaXMudHJhbnNpdGlvbkNvbXBvdW5kTm9kZShzdGF0ZVZhbHVlLCBzdGF0ZSwgX2V2ZW50KTtcbiAgICB9IC8vIG9ydGhvZ29uYWwgbm9kZVxuXG5cbiAgICByZXR1cm4gdGhpcy50cmFuc2l0aW9uUGFyYWxsZWxOb2RlKHN0YXRlVmFsdWUsIHN0YXRlLCBfZXZlbnQpO1xuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZ2V0VHJhbnNpdGlvbkRhdGEgPSBmdW5jdGlvbiAoc3RhdGUsIGV2ZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuX3RyYW5zaXRpb24oc3RhdGUudmFsdWUsIHN0YXRlLCB0b1NDWE1MRXZlbnQoZXZlbnQpKTtcbiAgfTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoc3RhdGUsIF9ldmVudCkge1xuICAgIHZhciBlXzMsIF9hO1xuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBldmVudE5hbWUgPSBfZXZlbnQubmFtZTtcbiAgICB2YXIgYWN0aW9ucyA9IFtdO1xuICAgIHZhciBuZXh0U3RhdGVOb2RlcyA9IFtdO1xuICAgIHZhciBzZWxlY3RlZFRyYW5zaXRpb247XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2IgPSBfX3ZhbHVlcyh0aGlzLmdldENhbmRpZGF0ZXMoZXZlbnROYW1lKSksIF9jID0gX2IubmV4dCgpOyAhX2MuZG9uZTsgX2MgPSBfYi5uZXh0KCkpIHtcbiAgICAgICAgdmFyIGNhbmRpZGF0ZSA9IF9jLnZhbHVlO1xuICAgICAgICB2YXIgY29uZCA9IGNhbmRpZGF0ZS5jb25kLFxuICAgICAgICAgICAgc3RhdGVJbiA9IGNhbmRpZGF0ZS5pbjtcbiAgICAgICAgdmFyIHJlc29sdmVkQ29udGV4dCA9IHN0YXRlLmNvbnRleHQ7XG4gICAgICAgIHZhciBpc0luU3RhdGUgPSBzdGF0ZUluID8gaXNTdHJpbmcoc3RhdGVJbikgJiYgaXNTdGF0ZUlkKHN0YXRlSW4pID8gLy8gQ2hlY2sgaWYgaW4gc3RhdGUgYnkgSURcbiAgICAgICAgc3RhdGUubWF0Y2hlcyh0b1N0YXRlVmFsdWUodGhpcy5nZXRTdGF0ZU5vZGVCeUlkKHN0YXRlSW4pLnBhdGgsIHRoaXMuZGVsaW1pdGVyKSkgOiAvLyBDaGVjayBpZiBpbiBzdGF0ZSBieSByZWxhdGl2ZSBncmFuZHBhcmVudFxuICAgICAgICBtYXRjaGVzU3RhdGUodG9TdGF0ZVZhbHVlKHN0YXRlSW4sIHRoaXMuZGVsaW1pdGVyKSwgcGF0aCh0aGlzLnBhdGguc2xpY2UoMCwgLTIpKShzdGF0ZS52YWx1ZSkpIDogdHJ1ZTtcbiAgICAgICAgdmFyIGd1YXJkUGFzc2VkID0gZmFsc2U7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBndWFyZFBhc3NlZCA9ICFjb25kIHx8IGV2YWx1YXRlR3VhcmQodGhpcy5tYWNoaW5lLCBjb25kLCByZXNvbHZlZENvbnRleHQsIF9ldmVudCwgc3RhdGUpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmFibGUgdG8gZXZhbHVhdGUgZ3VhcmQgJ1wiLmNvbmNhdChjb25kLm5hbWUgfHwgY29uZC50eXBlLCBcIicgaW4gdHJhbnNpdGlvbiBmb3IgZXZlbnQgJ1wiKS5jb25jYXQoZXZlbnROYW1lLCBcIicgaW4gc3RhdGUgbm9kZSAnXCIpLmNvbmNhdCh0aGlzLmlkLCBcIic6XFxuXCIpLmNvbmNhdChlcnIubWVzc2FnZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGd1YXJkUGFzc2VkICYmIGlzSW5TdGF0ZSkge1xuICAgICAgICAgIGlmIChjYW5kaWRhdGUudGFyZ2V0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG5leHRTdGF0ZU5vZGVzID0gY2FuZGlkYXRlLnRhcmdldDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBhY3Rpb25zLnB1c2guYXBwbHkoYWN0aW9ucywgX19zcHJlYWRBcnJheShbXSwgX19yZWFkKGNhbmRpZGF0ZS5hY3Rpb25zKSwgZmFsc2UpKTtcbiAgICAgICAgICBzZWxlY3RlZFRyYW5zaXRpb24gPSBjYW5kaWRhdGU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzNfMSkge1xuICAgICAgZV8zID0ge1xuICAgICAgICBlcnJvcjogZV8zXzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfYyAmJiAhX2MuZG9uZSAmJiAoX2EgPSBfYi5yZXR1cm4pKSBfYS5jYWxsKF9iKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzMpIHRocm93IGVfMy5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXNlbGVjdGVkVHJhbnNpdGlvbikge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAoIW5leHRTdGF0ZU5vZGVzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHJhbnNpdGlvbnM6IFtzZWxlY3RlZFRyYW5zaXRpb25dLFxuICAgICAgICBleGl0U2V0OiBbXSxcbiAgICAgICAgY29uZmlndXJhdGlvbjogc3RhdGUudmFsdWUgPyBbdGhpc10gOiBbXSxcbiAgICAgICAgc291cmNlOiBzdGF0ZSxcbiAgICAgICAgYWN0aW9uczogYWN0aW9uc1xuICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgYWxsTmV4dFN0YXRlTm9kZXMgPSBmbGF0dGVuKG5leHRTdGF0ZU5vZGVzLm1hcChmdW5jdGlvbiAoc3RhdGVOb2RlKSB7XG4gICAgICByZXR1cm4gX3RoaXMuZ2V0UmVsYXRpdmVTdGF0ZU5vZGVzKHN0YXRlTm9kZSwgc3RhdGUuaGlzdG9yeVZhbHVlKTtcbiAgICB9KSk7XG4gICAgdmFyIGlzSW50ZXJuYWwgPSAhIXNlbGVjdGVkVHJhbnNpdGlvbi5pbnRlcm5hbDtcbiAgICByZXR1cm4ge1xuICAgICAgdHJhbnNpdGlvbnM6IFtzZWxlY3RlZFRyYW5zaXRpb25dLFxuICAgICAgZXhpdFNldDogaXNJbnRlcm5hbCA/IFtdIDogZmxhdHRlbihuZXh0U3RhdGVOb2Rlcy5tYXAoZnVuY3Rpb24gKHRhcmdldE5vZGUpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLmdldFBvdGVudGlhbGx5UmVlbnRlcmluZ05vZGVzKHRhcmdldE5vZGUpO1xuICAgICAgfSkpLFxuICAgICAgY29uZmlndXJhdGlvbjogYWxsTmV4dFN0YXRlTm9kZXMsXG4gICAgICBzb3VyY2U6IHN0YXRlLFxuICAgICAgYWN0aW9uczogYWN0aW9uc1xuICAgIH07XG4gIH07IC8vIGV2ZW4gdGhvdWdoIHRoZSBuYW1lIG9mIHRoaXMgZnVuY3Rpb24gbWVudGlvbnMgcmVlbnRyeSBub2Rlc1xuICAvLyB3ZSBhcmUgcHVzaGluZyBpdHMgcmVzdWx0IGludG8gYGV4aXRTZXRgXG4gIC8vIHRoYXQncyBiZWNhdXNlIHdoYXQgd2UgZXhpdCBtaWdodCBiZSByZWVudGVyZWQgKGl0J3MgYW4gaW52YXJpYW50IG9mIHJlZW50cmFuY3kpXG5cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldFBvdGVudGlhbGx5UmVlbnRlcmluZ05vZGVzID0gZnVuY3Rpb24gKHRhcmdldE5vZGUpIHtcbiAgICBpZiAodGhpcy5vcmRlciA8IHRhcmdldE5vZGUub3JkZXIpIHtcbiAgICAgIHJldHVybiBbdGhpc107XG4gICAgfVxuXG4gICAgdmFyIG5vZGVzID0gW107XG4gICAgdmFyIG1hcmtlciA9IHRoaXM7XG4gICAgdmFyIHBvc3NpYmxlQW5jZXN0b3IgPSB0YXJnZXROb2RlO1xuXG4gICAgd2hpbGUgKG1hcmtlciAmJiBtYXJrZXIgIT09IHBvc3NpYmxlQW5jZXN0b3IpIHtcbiAgICAgIG5vZGVzLnB1c2gobWFya2VyKTtcbiAgICAgIG1hcmtlciA9IG1hcmtlci5wYXJlbnQ7XG4gICAgfVxuXG4gICAgaWYgKG1hcmtlciAhPT0gcG9zc2libGVBbmNlc3Rvcikge1xuICAgICAgLy8gd2UgbmV2ZXIgZ290IHRvIGBwb3NzaWJsZUFuY2VzdG9yYCwgdGhlcmVmb3JlIHRoZSBpbml0aWFsIGBtYXJrZXJgIFwiZXNjYXBlc1wiIGl0XG4gICAgICAvLyBpdCdzIGluIGEgZGlmZmVyZW50IHBhcnQgb2YgdGhlIHRyZWUgc28gbm8gc3RhdGVzIHdpbGwgYmUgcmVlbnRlcmVkIGZvciBzdWNoIGFuIGV4dGVybmFsIHRyYW5zaXRpb25cbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBub2Rlcy5wdXNoKHBvc3NpYmxlQW5jZXN0b3IpO1xuICAgIHJldHVybiBub2RlcztcbiAgfTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldEFjdGlvbnMgPSBmdW5jdGlvbiAocmVzb2x2ZWRDb25maWcsIGlzRG9uZSwgdHJhbnNpdGlvbiwgY3VycmVudENvbnRleHQsIF9ldmVudCwgcHJldlN0YXRlLCBwcmVkaWN0YWJsZUV4ZWMpIHtcbiAgICB2YXIgZV80LCBfYSwgZV81LCBfYjtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgcHJldkNvbmZpZyA9IHByZXZTdGF0ZSA/IGdldENvbmZpZ3VyYXRpb24oW10sIHRoaXMuZ2V0U3RhdGVOb2RlcyhwcmV2U3RhdGUudmFsdWUpKSA6IFtdO1xuICAgIHZhciBlbnRyeVNldCA9IG5ldyBTZXQoKTtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBfYyA9IF9fdmFsdWVzKEFycmF5LmZyb20ocmVzb2x2ZWRDb25maWcpLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEub3JkZXIgLSBiLm9yZGVyO1xuICAgICAgfSkpLCBfZCA9IF9jLm5leHQoKTsgIV9kLmRvbmU7IF9kID0gX2MubmV4dCgpKSB7XG4gICAgICAgIHZhciBzbiA9IF9kLnZhbHVlO1xuXG4gICAgICAgIGlmICghaGFzKHByZXZDb25maWcsIHNuKSB8fCBoYXModHJhbnNpdGlvbi5leGl0U2V0LCBzbikgfHwgc24ucGFyZW50ICYmIGVudHJ5U2V0Lmhhcyhzbi5wYXJlbnQpKSB7XG4gICAgICAgICAgZW50cnlTZXQuYWRkKHNuKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfNF8xKSB7XG4gICAgICBlXzQgPSB7XG4gICAgICAgIGVycm9yOiBlXzRfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKF9kICYmICFfZC5kb25lICYmIChfYSA9IF9jLnJldHVybikpIF9hLmNhbGwoX2MpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfNCkgdGhyb3cgZV80LmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBwcmV2Q29uZmlnXzEgPSBfX3ZhbHVlcyhwcmV2Q29uZmlnKSwgcHJldkNvbmZpZ18xXzEgPSBwcmV2Q29uZmlnXzEubmV4dCgpOyAhcHJldkNvbmZpZ18xXzEuZG9uZTsgcHJldkNvbmZpZ18xXzEgPSBwcmV2Q29uZmlnXzEubmV4dCgpKSB7XG4gICAgICAgIHZhciBzbiA9IHByZXZDb25maWdfMV8xLnZhbHVlO1xuXG4gICAgICAgIGlmICghaGFzKHJlc29sdmVkQ29uZmlnLCBzbikgfHwgaGFzKHRyYW5zaXRpb24uZXhpdFNldCwgc24ucGFyZW50KSkge1xuICAgICAgICAgIHRyYW5zaXRpb24uZXhpdFNldC5wdXNoKHNuKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfNV8xKSB7XG4gICAgICBlXzUgPSB7XG4gICAgICAgIGVycm9yOiBlXzVfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHByZXZDb25maWdfMV8xICYmICFwcmV2Q29uZmlnXzFfMS5kb25lICYmIChfYiA9IHByZXZDb25maWdfMS5yZXR1cm4pKSBfYi5jYWxsKHByZXZDb25maWdfMSk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV81KSB0aHJvdyBlXzUuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdHJhbnNpdGlvbi5leGl0U2V0LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBiLm9yZGVyIC0gYS5vcmRlcjtcbiAgICB9KTtcbiAgICB2YXIgZW50cnlTdGF0ZXMgPSBBcnJheS5mcm9tKGVudHJ5U2V0KS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICByZXR1cm4gYS5vcmRlciAtIGIub3JkZXI7XG4gICAgfSk7XG4gICAgdmFyIGV4aXRTdGF0ZXMgPSBuZXcgU2V0KHRyYW5zaXRpb24uZXhpdFNldCk7XG4gICAgdmFyIGRvbmVFdmVudHMgPSBmbGF0dGVuKGVudHJ5U3RhdGVzLm1hcChmdW5jdGlvbiAoc24pIHtcbiAgICAgIHZhciBldmVudHMgPSBbXTtcblxuICAgICAgaWYgKHNuLnR5cGUgIT09ICdmaW5hbCcpIHtcbiAgICAgICAgcmV0dXJuIGV2ZW50cztcbiAgICAgIH1cblxuICAgICAgdmFyIHBhcmVudCA9IHNuLnBhcmVudDtcblxuICAgICAgaWYgKCFwYXJlbnQucGFyZW50KSB7XG4gICAgICAgIHJldHVybiBldmVudHM7XG4gICAgICB9XG5cbiAgICAgIGV2ZW50cy5wdXNoKGRvbmUoc24uaWQsIHNuLmRvbmVEYXRhKSwgLy8gVE9ETzogZGVwcmVjYXRlIC0gZmluYWwgc3RhdGVzIHNob3VsZCBub3QgZW1pdCBkb25lIGV2ZW50cyBmb3IgdGhlaXIgb3duIHN0YXRlLlxuICAgICAgZG9uZShwYXJlbnQuaWQsIHNuLmRvbmVEYXRhID8gbWFwQ29udGV4dChzbi5kb25lRGF0YSwgY3VycmVudENvbnRleHQsIF9ldmVudCkgOiB1bmRlZmluZWQpKTtcbiAgICAgIHZhciBncmFuZHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG5cbiAgICAgIGlmIChncmFuZHBhcmVudC50eXBlID09PSAncGFyYWxsZWwnKSB7XG4gICAgICAgIGlmIChnZXRDaGlsZHJlbihncmFuZHBhcmVudCkuZXZlcnkoZnVuY3Rpb24gKHBhcmVudE5vZGUpIHtcbiAgICAgICAgICByZXR1cm4gaXNJbkZpbmFsU3RhdGUodHJhbnNpdGlvbi5jb25maWd1cmF0aW9uLCBwYXJlbnROb2RlKTtcbiAgICAgICAgfSkpIHtcbiAgICAgICAgICBldmVudHMucHVzaChkb25lKGdyYW5kcGFyZW50LmlkKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGV2ZW50cztcbiAgICB9KSk7XG4gICAgdmFyIGVudHJ5QWN0aW9ucyA9IGVudHJ5U3RhdGVzLm1hcChmdW5jdGlvbiAoc3RhdGVOb2RlKSB7XG4gICAgICB2YXIgZW50cnlBY3Rpb25zID0gc3RhdGVOb2RlLm9uRW50cnk7XG4gICAgICB2YXIgaW52b2tlQWN0aW9ucyA9IHN0YXRlTm9kZS5hY3Rpdml0aWVzLm1hcChmdW5jdGlvbiAoYWN0aXZpdHkpIHtcbiAgICAgICAgcmV0dXJuIHN0YXJ0KGFjdGl2aXR5KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogJ2VudHJ5JyxcbiAgICAgICAgYWN0aW9uczogdG9BY3Rpb25PYmplY3RzKHByZWRpY3RhYmxlRXhlYyA/IF9fc3ByZWFkQXJyYXkoX19zcHJlYWRBcnJheShbXSwgX19yZWFkKGVudHJ5QWN0aW9ucyksIGZhbHNlKSwgX19yZWFkKGludm9rZUFjdGlvbnMpLCBmYWxzZSkgOiBfX3NwcmVhZEFycmF5KF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChpbnZva2VBY3Rpb25zKSwgZmFsc2UpLCBfX3JlYWQoZW50cnlBY3Rpb25zKSwgZmFsc2UpLCBfdGhpcy5tYWNoaW5lLm9wdGlvbnMuYWN0aW9ucylcbiAgICAgIH07XG4gICAgfSkuY29uY2F0KHtcbiAgICAgIHR5cGU6ICdzdGF0ZV9kb25lJyxcbiAgICAgIGFjdGlvbnM6IGRvbmVFdmVudHMubWFwKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICByZXR1cm4gcmFpc2UoZXZlbnQpO1xuICAgICAgfSlcbiAgICB9KTtcbiAgICB2YXIgZXhpdEFjdGlvbnMgPSBBcnJheS5mcm9tKGV4aXRTdGF0ZXMpLm1hcChmdW5jdGlvbiAoc3RhdGVOb2RlKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAnZXhpdCcsXG4gICAgICAgIGFjdGlvbnM6IHRvQWN0aW9uT2JqZWN0cyhfX3NwcmVhZEFycmF5KF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChzdGF0ZU5vZGUub25FeGl0KSwgZmFsc2UpLCBfX3JlYWQoc3RhdGVOb2RlLmFjdGl2aXRpZXMubWFwKGZ1bmN0aW9uIChhY3Rpdml0eSkge1xuICAgICAgICAgIHJldHVybiBzdG9wKGFjdGl2aXR5KTtcbiAgICAgICAgfSkpLCBmYWxzZSksIF90aGlzLm1hY2hpbmUub3B0aW9ucy5hY3Rpb25zKVxuICAgICAgfTtcbiAgICB9KTtcbiAgICB2YXIgYWN0aW9ucyA9IGV4aXRBY3Rpb25zLmNvbmNhdCh7XG4gICAgICB0eXBlOiAndHJhbnNpdGlvbicsXG4gICAgICBhY3Rpb25zOiB0b0FjdGlvbk9iamVjdHModHJhbnNpdGlvbi5hY3Rpb25zLCB0aGlzLm1hY2hpbmUub3B0aW9ucy5hY3Rpb25zKVxuICAgIH0pLmNvbmNhdChlbnRyeUFjdGlvbnMpO1xuXG4gICAgaWYgKGlzRG9uZSkge1xuICAgICAgdmFyIHN0b3BBY3Rpb25zID0gdG9BY3Rpb25PYmplY3RzKGZsYXR0ZW4oX19zcHJlYWRBcnJheShbXSwgX19yZWFkKHJlc29sdmVkQ29uZmlnKSwgZmFsc2UpLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGIub3JkZXIgLSBhLm9yZGVyO1xuICAgICAgfSkubWFwKGZ1bmN0aW9uIChzdGF0ZU5vZGUpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlTm9kZS5vbkV4aXQ7XG4gICAgICB9KSksIHRoaXMubWFjaGluZS5vcHRpb25zLmFjdGlvbnMpLmZpbHRlcihmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICAgIHJldHVybiAhaXNSYWlzYWJsZUFjdGlvbihhY3Rpb24pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gYWN0aW9ucy5jb25jYXQoe1xuICAgICAgICB0eXBlOiAnc3RvcCcsXG4gICAgICAgIGFjdGlvbnM6IHN0b3BBY3Rpb25zXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWN0aW9ucztcbiAgfTtcbiAgLyoqXHJcbiAgICogRGV0ZXJtaW5lcyB0aGUgbmV4dCBzdGF0ZSBnaXZlbiB0aGUgY3VycmVudCBgc3RhdGVgIGFuZCBzZW50IGBldmVudGAuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gc3RhdGUgVGhlIGN1cnJlbnQgU3RhdGUgaW5zdGFuY2Ugb3Igc3RhdGUgdmFsdWVcclxuICAgKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgd2FzIHNlbnQgYXQgdGhlIGN1cnJlbnQgc3RhdGVcclxuICAgKiBAcGFyYW0gY29udGV4dCBUaGUgY3VycmVudCBjb250ZXh0IChleHRlbmRlZCBzdGF0ZSkgb2YgdGhlIGN1cnJlbnQgc3RhdGVcclxuICAgKi9cblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUudHJhbnNpdGlvbiA9IGZ1bmN0aW9uIChzdGF0ZSwgZXZlbnQsIGNvbnRleHQsIGV4ZWMpIHtcbiAgICBpZiAoc3RhdGUgPT09IHZvaWQgMCkge1xuICAgICAgc3RhdGUgPSB0aGlzLmluaXRpYWxTdGF0ZTtcbiAgICB9XG5cbiAgICB2YXIgX2V2ZW50ID0gdG9TQ1hNTEV2ZW50KGV2ZW50KTtcblxuICAgIHZhciBjdXJyZW50U3RhdGU7XG5cbiAgICBpZiAoc3RhdGUgaW5zdGFuY2VvZiBTdGF0ZSkge1xuICAgICAgY3VycmVudFN0YXRlID0gY29udGV4dCA9PT0gdW5kZWZpbmVkID8gc3RhdGUgOiB0aGlzLnJlc29sdmVTdGF0ZShTdGF0ZS5mcm9tKHN0YXRlLCBjb250ZXh0KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciByZXNvbHZlZFN0YXRlVmFsdWUgPSBpc1N0cmluZyhzdGF0ZSkgPyB0aGlzLnJlc29sdmUocGF0aFRvU3RhdGVWYWx1ZSh0aGlzLmdldFJlc29sdmVkUGF0aChzdGF0ZSkpKSA6IHRoaXMucmVzb2x2ZShzdGF0ZSk7XG4gICAgICB2YXIgcmVzb2x2ZWRDb250ZXh0ID0gY29udGV4dCAhPT0gbnVsbCAmJiBjb250ZXh0ICE9PSB2b2lkIDAgPyBjb250ZXh0IDogdGhpcy5tYWNoaW5lLmNvbnRleHQ7XG4gICAgICBjdXJyZW50U3RhdGUgPSB0aGlzLnJlc29sdmVTdGF0ZShTdGF0ZS5mcm9tKHJlc29sdmVkU3RhdGVWYWx1ZSwgcmVzb2x2ZWRDb250ZXh0KSk7XG4gICAgfVxuXG4gICAgaWYgKCFJU19QUk9EVUNUSU9OICYmIF9ldmVudC5uYW1lID09PSBXSUxEQ0FSRCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQW4gZXZlbnQgY2Fubm90IGhhdmUgdGhlIHdpbGRjYXJkIHR5cGUgKCdcIi5jb25jYXQoV0lMRENBUkQsIFwiJylcIikpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnN0cmljdCkge1xuICAgICAgaWYgKCF0aGlzLmV2ZW50cy5pbmNsdWRlcyhfZXZlbnQubmFtZSkgJiYgIWlzQnVpbHRJbkV2ZW50KF9ldmVudC5uYW1lKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNYWNoaW5lICdcIi5jb25jYXQodGhpcy5pZCwgXCInIGRvZXMgbm90IGFjY2VwdCBldmVudCAnXCIpLmNvbmNhdChfZXZlbnQubmFtZSwgXCInXCIpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgc3RhdGVUcmFuc2l0aW9uID0gdGhpcy5fdHJhbnNpdGlvbihjdXJyZW50U3RhdGUudmFsdWUsIGN1cnJlbnRTdGF0ZSwgX2V2ZW50KSB8fCB7XG4gICAgICB0cmFuc2l0aW9uczogW10sXG4gICAgICBjb25maWd1cmF0aW9uOiBbXSxcbiAgICAgIGV4aXRTZXQ6IFtdLFxuICAgICAgc291cmNlOiBjdXJyZW50U3RhdGUsXG4gICAgICBhY3Rpb25zOiBbXVxuICAgIH07XG4gICAgdmFyIHByZXZDb25maWcgPSBnZXRDb25maWd1cmF0aW9uKFtdLCB0aGlzLmdldFN0YXRlTm9kZXMoY3VycmVudFN0YXRlLnZhbHVlKSk7XG4gICAgdmFyIHJlc29sdmVkQ29uZmlnID0gc3RhdGVUcmFuc2l0aW9uLmNvbmZpZ3VyYXRpb24ubGVuZ3RoID8gZ2V0Q29uZmlndXJhdGlvbihwcmV2Q29uZmlnLCBzdGF0ZVRyYW5zaXRpb24uY29uZmlndXJhdGlvbikgOiBwcmV2Q29uZmlnO1xuICAgIHN0YXRlVHJhbnNpdGlvbi5jb25maWd1cmF0aW9uID0gX19zcHJlYWRBcnJheShbXSwgX19yZWFkKHJlc29sdmVkQ29uZmlnKSwgZmFsc2UpO1xuICAgIHJldHVybiB0aGlzLnJlc29sdmVUcmFuc2l0aW9uKHN0YXRlVHJhbnNpdGlvbiwgY3VycmVudFN0YXRlLCBjdXJyZW50U3RhdGUuY29udGV4dCwgZXhlYywgX2V2ZW50KTtcbiAgfTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLnJlc29sdmVSYWlzZWRUcmFuc2l0aW9uID0gZnVuY3Rpb24gKHN0YXRlLCBfZXZlbnQsIG9yaWdpbmFsRXZlbnQsIHByZWRpY3RhYmxlRXhlYykge1xuICAgIHZhciBfYTtcblxuICAgIHZhciBjdXJyZW50QWN0aW9ucyA9IHN0YXRlLmFjdGlvbnM7XG4gICAgc3RhdGUgPSB0aGlzLnRyYW5zaXRpb24oc3RhdGUsIF9ldmVudCwgdW5kZWZpbmVkLCBwcmVkaWN0YWJsZUV4ZWMpOyAvLyBTYXZlIG9yaWdpbmFsIGV2ZW50IHRvIHN0YXRlXG4gICAgLy8gVE9ETzogdGhpcyBzaG91bGQgYmUgdGhlIHJhaXNlZCBldmVudCEgRGVsZXRlIGluIFY1IChicmVha2luZylcblxuICAgIHN0YXRlLl9ldmVudCA9IG9yaWdpbmFsRXZlbnQ7XG4gICAgc3RhdGUuZXZlbnQgPSBvcmlnaW5hbEV2ZW50LmRhdGE7XG5cbiAgICAoX2EgPSBzdGF0ZS5hY3Rpb25zKS51bnNoaWZ0LmFwcGx5KF9hLCBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoY3VycmVudEFjdGlvbnMpLCBmYWxzZSkpO1xuXG4gICAgcmV0dXJuIHN0YXRlO1xuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUucmVzb2x2ZVRyYW5zaXRpb24gPSBmdW5jdGlvbiAoc3RhdGVUcmFuc2l0aW9uLCBjdXJyZW50U3RhdGUsIGNvbnRleHQsIHByZWRpY3RhYmxlRXhlYywgX2V2ZW50KSB7XG4gICAgdmFyIGVfNiwgX2EsIGVfNywgX2I7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKF9ldmVudCA9PT0gdm9pZCAwKSB7XG4gICAgICBfZXZlbnQgPSBpbml0RXZlbnQ7XG4gICAgfVxuXG4gICAgdmFyIGNvbmZpZ3VyYXRpb24gPSBzdGF0ZVRyYW5zaXRpb24uY29uZmlndXJhdGlvbjsgLy8gVHJhbnNpdGlvbiB3aWxsIFwiYXBwbHlcIiBpZjpcbiAgICAvLyAtIHRoaXMgaXMgdGhlIGluaXRpYWwgc3RhdGUgKHRoZXJlIGlzIG5vIGN1cnJlbnQgc3RhdGUpXG4gICAgLy8gLSBPUiB0aGVyZSBhcmUgdHJhbnNpdGlvbnNcblxuICAgIHZhciB3aWxsVHJhbnNpdGlvbiA9ICFjdXJyZW50U3RhdGUgfHwgc3RhdGVUcmFuc2l0aW9uLnRyYW5zaXRpb25zLmxlbmd0aCA+IDA7XG4gICAgdmFyIHJlc29sdmVkQ29uZmlndXJhdGlvbiA9IHdpbGxUcmFuc2l0aW9uID8gc3RhdGVUcmFuc2l0aW9uLmNvbmZpZ3VyYXRpb24gOiBjdXJyZW50U3RhdGUgPyBjdXJyZW50U3RhdGUuY29uZmlndXJhdGlvbiA6IFtdO1xuICAgIHZhciBpc0RvbmUgPSBpc0luRmluYWxTdGF0ZShyZXNvbHZlZENvbmZpZ3VyYXRpb24sIHRoaXMpO1xuICAgIHZhciByZXNvbHZlZFN0YXRlVmFsdWUgPSB3aWxsVHJhbnNpdGlvbiA/IGdldFZhbHVlKHRoaXMubWFjaGluZSwgY29uZmlndXJhdGlvbikgOiB1bmRlZmluZWQ7XG4gICAgdmFyIGhpc3RvcnlWYWx1ZSA9IGN1cnJlbnRTdGF0ZSA/IGN1cnJlbnRTdGF0ZS5oaXN0b3J5VmFsdWUgPyBjdXJyZW50U3RhdGUuaGlzdG9yeVZhbHVlIDogc3RhdGVUcmFuc2l0aW9uLnNvdXJjZSA/IHRoaXMubWFjaGluZS5oaXN0b3J5VmFsdWUoY3VycmVudFN0YXRlLnZhbHVlKSA6IHVuZGVmaW5lZCA6IHVuZGVmaW5lZDtcbiAgICB2YXIgYWN0aW9uQmxvY2tzID0gdGhpcy5nZXRBY3Rpb25zKG5ldyBTZXQocmVzb2x2ZWRDb25maWd1cmF0aW9uKSwgaXNEb25lLCBzdGF0ZVRyYW5zaXRpb24sIGNvbnRleHQsIF9ldmVudCwgY3VycmVudFN0YXRlLCBwcmVkaWN0YWJsZUV4ZWMpO1xuICAgIHZhciBhY3Rpdml0aWVzID0gY3VycmVudFN0YXRlID8gX19hc3NpZ24oe30sIGN1cnJlbnRTdGF0ZS5hY3Rpdml0aWVzKSA6IHt9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIGFjdGlvbkJsb2Nrc18xID0gX192YWx1ZXMoYWN0aW9uQmxvY2tzKSwgYWN0aW9uQmxvY2tzXzFfMSA9IGFjdGlvbkJsb2Nrc18xLm5leHQoKTsgIWFjdGlvbkJsb2Nrc18xXzEuZG9uZTsgYWN0aW9uQmxvY2tzXzFfMSA9IGFjdGlvbkJsb2Nrc18xLm5leHQoKSkge1xuICAgICAgICB2YXIgYmxvY2sgPSBhY3Rpb25CbG9ja3NfMV8xLnZhbHVlO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZm9yICh2YXIgX2MgPSAoZV83ID0gdm9pZCAwLCBfX3ZhbHVlcyhibG9jay5hY3Rpb25zKSksIF9kID0gX2MubmV4dCgpOyAhX2QuZG9uZTsgX2QgPSBfYy5uZXh0KCkpIHtcbiAgICAgICAgICAgIHZhciBhY3Rpb24gPSBfZC52YWx1ZTtcblxuICAgICAgICAgICAgaWYgKGFjdGlvbi50eXBlID09PSBzdGFydCQxKSB7XG4gICAgICAgICAgICAgIGFjdGl2aXRpZXNbYWN0aW9uLmFjdGl2aXR5LmlkIHx8IGFjdGlvbi5hY3Rpdml0eS50eXBlXSA9IGFjdGlvbjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYWN0aW9uLnR5cGUgPT09IHN0b3AkMSkge1xuICAgICAgICAgICAgICBhY3Rpdml0aWVzW2FjdGlvbi5hY3Rpdml0eS5pZCB8fCBhY3Rpb24uYWN0aXZpdHkudHlwZV0gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVfN18xKSB7XG4gICAgICAgICAgZV83ID0ge1xuICAgICAgICAgICAgZXJyb3I6IGVfN18xXG4gICAgICAgICAgfTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKF9kICYmICFfZC5kb25lICYmIChfYiA9IF9jLnJldHVybikpIF9iLmNhbGwoX2MpO1xuICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBpZiAoZV83KSB0aHJvdyBlXzcuZXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV82XzEpIHtcbiAgICAgIGVfNiA9IHtcbiAgICAgICAgZXJyb3I6IGVfNl8xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoYWN0aW9uQmxvY2tzXzFfMSAmJiAhYWN0aW9uQmxvY2tzXzFfMS5kb25lICYmIChfYSA9IGFjdGlvbkJsb2Nrc18xLnJldHVybikpIF9hLmNhbGwoYWN0aW9uQmxvY2tzXzEpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfNikgdGhyb3cgZV82LmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBfZSA9IF9fcmVhZChyZXNvbHZlQWN0aW9ucyh0aGlzLCBjdXJyZW50U3RhdGUsIGNvbnRleHQsIF9ldmVudCwgYWN0aW9uQmxvY2tzLCBwcmVkaWN0YWJsZUV4ZWMsIHRoaXMubWFjaGluZS5jb25maWcucHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHMgfHwgdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVzZXJ2ZUFjdGlvbk9yZGVyKSwgMiksXG4gICAgICAgIHJlc29sdmVkQWN0aW9ucyA9IF9lWzBdLFxuICAgICAgICB1cGRhdGVkQ29udGV4dCA9IF9lWzFdO1xuXG4gICAgdmFyIF9mID0gX19yZWFkKHBhcnRpdGlvbihyZXNvbHZlZEFjdGlvbnMsIGlzUmFpc2FibGVBY3Rpb24pLCAyKSxcbiAgICAgICAgcmFpc2VkRXZlbnRzID0gX2ZbMF0sXG4gICAgICAgIG5vblJhaXNlZEFjdGlvbnMgPSBfZlsxXTtcblxuICAgIHZhciBpbnZva2VBY3Rpb25zID0gcmVzb2x2ZWRBY3Rpb25zLmZpbHRlcihmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICB2YXIgX2E7XG5cbiAgICAgIHJldHVybiBhY3Rpb24udHlwZSA9PT0gc3RhcnQkMSAmJiAoKF9hID0gYWN0aW9uLmFjdGl2aXR5KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EudHlwZSkgPT09IGludm9rZTtcbiAgICB9KTtcbiAgICB2YXIgY2hpbGRyZW4gPSBpbnZva2VBY3Rpb25zLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBhY3Rpb24pIHtcbiAgICAgIGFjY1thY3Rpb24uYWN0aXZpdHkuaWRdID0gY3JlYXRlSW52b2NhYmxlQWN0b3IoYWN0aW9uLmFjdGl2aXR5LCBfdGhpcy5tYWNoaW5lLCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50KTtcbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwgY3VycmVudFN0YXRlID8gX19hc3NpZ24oe30sIGN1cnJlbnRTdGF0ZS5jaGlsZHJlbikgOiB7fSk7XG4gICAgdmFyIG5leHRTdGF0ZSA9IG5ldyBTdGF0ZSh7XG4gICAgICB2YWx1ZTogcmVzb2x2ZWRTdGF0ZVZhbHVlIHx8IGN1cnJlbnRTdGF0ZS52YWx1ZSxcbiAgICAgIGNvbnRleHQ6IHVwZGF0ZWRDb250ZXh0LFxuICAgICAgX2V2ZW50OiBfZXZlbnQsXG4gICAgICAvLyBQZXJzaXN0IF9zZXNzaW9uaWQgYmV0d2VlbiBzdGF0ZXNcbiAgICAgIF9zZXNzaW9uaWQ6IGN1cnJlbnRTdGF0ZSA/IGN1cnJlbnRTdGF0ZS5fc2Vzc2lvbmlkIDogbnVsbCxcbiAgICAgIGhpc3RvcnlWYWx1ZTogcmVzb2x2ZWRTdGF0ZVZhbHVlID8gaGlzdG9yeVZhbHVlID8gdXBkYXRlSGlzdG9yeVZhbHVlKGhpc3RvcnlWYWx1ZSwgcmVzb2x2ZWRTdGF0ZVZhbHVlKSA6IHVuZGVmaW5lZCA6IGN1cnJlbnRTdGF0ZSA/IGN1cnJlbnRTdGF0ZS5oaXN0b3J5VmFsdWUgOiB1bmRlZmluZWQsXG4gICAgICBoaXN0b3J5OiAhcmVzb2x2ZWRTdGF0ZVZhbHVlIHx8IHN0YXRlVHJhbnNpdGlvbi5zb3VyY2UgPyBjdXJyZW50U3RhdGUgOiB1bmRlZmluZWQsXG4gICAgICBhY3Rpb25zOiByZXNvbHZlZFN0YXRlVmFsdWUgPyBub25SYWlzZWRBY3Rpb25zIDogW10sXG4gICAgICBhY3Rpdml0aWVzOiByZXNvbHZlZFN0YXRlVmFsdWUgPyBhY3Rpdml0aWVzIDogY3VycmVudFN0YXRlID8gY3VycmVudFN0YXRlLmFjdGl2aXRpZXMgOiB7fSxcbiAgICAgIGV2ZW50czogW10sXG4gICAgICBjb25maWd1cmF0aW9uOiByZXNvbHZlZENvbmZpZ3VyYXRpb24sXG4gICAgICB0cmFuc2l0aW9uczogc3RhdGVUcmFuc2l0aW9uLnRyYW5zaXRpb25zLFxuICAgICAgY2hpbGRyZW46IGNoaWxkcmVuLFxuICAgICAgZG9uZTogaXNEb25lLFxuICAgICAgdGFnczogZ2V0VGFnc0Zyb21Db25maWd1cmF0aW9uKHJlc29sdmVkQ29uZmlndXJhdGlvbiksXG4gICAgICBtYWNoaW5lOiB0aGlzXG4gICAgfSk7XG4gICAgdmFyIGRpZFVwZGF0ZUNvbnRleHQgPSBjb250ZXh0ICE9PSB1cGRhdGVkQ29udGV4dDtcbiAgICBuZXh0U3RhdGUuY2hhbmdlZCA9IF9ldmVudC5uYW1lID09PSB1cGRhdGUgfHwgZGlkVXBkYXRlQ29udGV4dDsgLy8gRGlzcG9zZSBvZiBwZW51bHRpbWF0ZSBoaXN0b3JpZXMgdG8gcHJldmVudCBtZW1vcnkgbGVha3NcblxuICAgIHZhciBoaXN0b3J5ID0gbmV4dFN0YXRlLmhpc3Rvcnk7XG5cbiAgICBpZiAoaGlzdG9yeSkge1xuICAgICAgZGVsZXRlIGhpc3RvcnkuaGlzdG9yeTtcbiAgICB9IC8vIFRoZXJlIGFyZSB0cmFuc2llbnQgdHJhbnNpdGlvbnMgaWYgdGhlIG1hY2hpbmUgaXMgbm90IGluIGEgZmluYWwgc3RhdGVcbiAgICAvLyBhbmQgaWYgc29tZSBvZiB0aGUgc3RhdGUgbm9kZXMgaGF2ZSB0cmFuc2llbnQgKFwiYWx3YXlzXCIpIHRyYW5zaXRpb25zLlxuXG5cbiAgICB2YXIgaGFzQWx3YXlzVHJhbnNpdGlvbnMgPSAhaXNEb25lICYmICh0aGlzLl90cmFuc2llbnQgfHwgY29uZmlndXJhdGlvbi5zb21lKGZ1bmN0aW9uIChzdGF0ZU5vZGUpIHtcbiAgICAgIHJldHVybiBzdGF0ZU5vZGUuX3RyYW5zaWVudDtcbiAgICB9KSk7IC8vIElmIHRoZXJlIGFyZSBubyBlbmFibGVkIHRyYW5zaXRpb25zLCBjaGVjayBpZiB0aGVyZSBhcmUgdHJhbnNpZW50IHRyYW5zaXRpb25zLlxuICAgIC8vIElmIHRoZXJlIGFyZSB0cmFuc2llbnQgdHJhbnNpdGlvbnMsIGNvbnRpbnVlIGNoZWNraW5nIGZvciBtb3JlIHRyYW5zaXRpb25zXG4gICAgLy8gYmVjYXVzZSBhbiB0cmFuc2llbnQgdHJhbnNpdGlvbiBzaG91bGQgYmUgdHJpZ2dlcmVkIGV2ZW4gaWYgdGhlcmUgYXJlIG5vXG4gICAgLy8gZW5hYmxlZCB0cmFuc2l0aW9ucy5cbiAgICAvL1xuICAgIC8vIElmIHdlJ3JlIGFscmVhZHkgd29ya2luZyBvbiBhbiB0cmFuc2llbnQgdHJhbnNpdGlvbiB0aGVuIHN0b3AgdG8gcHJldmVudCBhbiBpbmZpbml0ZSBsb29wLlxuICAgIC8vXG4gICAgLy8gT3RoZXJ3aXNlLCBpZiB0aGVyZSBhcmUgbm8gZW5hYmxlZCBub3IgdHJhbnNpZW50IHRyYW5zaXRpb25zLCB3ZSBhcmUgZG9uZS5cblxuICAgIGlmICghd2lsbFRyYW5zaXRpb24gJiYgKCFoYXNBbHdheXNUcmFuc2l0aW9ucyB8fCBfZXZlbnQubmFtZSA9PT0gTlVMTF9FVkVOVCkpIHtcbiAgICAgIHJldHVybiBuZXh0U3RhdGU7XG4gICAgfVxuXG4gICAgdmFyIG1heWJlTmV4dFN0YXRlID0gbmV4dFN0YXRlO1xuXG4gICAgaWYgKCFpc0RvbmUpIHtcbiAgICAgIGlmIChoYXNBbHdheXNUcmFuc2l0aW9ucykge1xuICAgICAgICBtYXliZU5leHRTdGF0ZSA9IHRoaXMucmVzb2x2ZVJhaXNlZFRyYW5zaXRpb24obWF5YmVOZXh0U3RhdGUsIHtcbiAgICAgICAgICB0eXBlOiBudWxsRXZlbnRcbiAgICAgICAgfSwgX2V2ZW50LCBwcmVkaWN0YWJsZUV4ZWMpO1xuICAgICAgfVxuXG4gICAgICB3aGlsZSAocmFpc2VkRXZlbnRzLmxlbmd0aCkge1xuICAgICAgICB2YXIgcmFpc2VkRXZlbnQgPSByYWlzZWRFdmVudHMuc2hpZnQoKTtcbiAgICAgICAgbWF5YmVOZXh0U3RhdGUgPSB0aGlzLnJlc29sdmVSYWlzZWRUcmFuc2l0aW9uKG1heWJlTmV4dFN0YXRlLCByYWlzZWRFdmVudC5fZXZlbnQsIF9ldmVudCwgcHJlZGljdGFibGVFeGVjKTtcbiAgICAgIH1cbiAgICB9IC8vIERldGVjdCBpZiBzdGF0ZSBjaGFuZ2VkXG5cblxuICAgIHZhciBjaGFuZ2VkID0gbWF5YmVOZXh0U3RhdGUuY2hhbmdlZCB8fCAoaGlzdG9yeSA/ICEhbWF5YmVOZXh0U3RhdGUuYWN0aW9ucy5sZW5ndGggfHwgZGlkVXBkYXRlQ29udGV4dCB8fCB0eXBlb2YgaGlzdG9yeS52YWx1ZSAhPT0gdHlwZW9mIG1heWJlTmV4dFN0YXRlLnZhbHVlIHx8ICFzdGF0ZVZhbHVlc0VxdWFsKG1heWJlTmV4dFN0YXRlLnZhbHVlLCBoaXN0b3J5LnZhbHVlKSA6IHVuZGVmaW5lZCk7XG4gICAgbWF5YmVOZXh0U3RhdGUuY2hhbmdlZCA9IGNoYW5nZWQ7IC8vIFByZXNlcnZlIG9yaWdpbmFsIGhpc3RvcnkgYWZ0ZXIgcmFpc2VkIGV2ZW50c1xuXG4gICAgbWF5YmVOZXh0U3RhdGUuaGlzdG9yeSA9IGhpc3Rvcnk7XG4gICAgcmV0dXJuIG1heWJlTmV4dFN0YXRlO1xuICB9O1xuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBjaGlsZCBzdGF0ZSBub2RlIGZyb20gaXRzIHJlbGF0aXZlIGBzdGF0ZUtleWAsIG9yIHRocm93cy5cclxuICAgKi9cblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZ2V0U3RhdGVOb2RlID0gZnVuY3Rpb24gKHN0YXRlS2V5KSB7XG4gICAgaWYgKGlzU3RhdGVJZChzdGF0ZUtleSkpIHtcbiAgICAgIHJldHVybiB0aGlzLm1hY2hpbmUuZ2V0U3RhdGVOb2RlQnlJZChzdGF0ZUtleSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnN0YXRlcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5hYmxlIHRvIHJldHJpZXZlIGNoaWxkIHN0YXRlICdcIi5jb25jYXQoc3RhdGVLZXksIFwiJyBmcm9tICdcIikuY29uY2F0KHRoaXMuaWQsIFwiJzsgbm8gY2hpbGQgc3RhdGVzIGV4aXN0LlwiKSk7XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IHRoaXMuc3RhdGVzW3N0YXRlS2V5XTtcblxuICAgIGlmICghcmVzdWx0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDaGlsZCBzdGF0ZSAnXCIuY29uY2F0KHN0YXRlS2V5LCBcIicgZG9lcyBub3QgZXhpc3Qgb24gJ1wiKS5jb25jYXQodGhpcy5pZCwgXCInXCIpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBzdGF0ZSBub2RlIHdpdGggdGhlIGdpdmVuIGBzdGF0ZUlkYCwgb3IgdGhyb3dzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHN0YXRlSWQgVGhlIHN0YXRlIElELiBUaGUgcHJlZml4IFwiI1wiIGlzIHJlbW92ZWQuXHJcbiAgICovXG5cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldFN0YXRlTm9kZUJ5SWQgPSBmdW5jdGlvbiAoc3RhdGVJZCkge1xuICAgIHZhciByZXNvbHZlZFN0YXRlSWQgPSBpc1N0YXRlSWQoc3RhdGVJZCkgPyBzdGF0ZUlkLnNsaWNlKFNUQVRFX0lERU5USUZJRVIubGVuZ3RoKSA6IHN0YXRlSWQ7XG5cbiAgICBpZiAocmVzb2x2ZWRTdGF0ZUlkID09PSB0aGlzLmlkKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB2YXIgc3RhdGVOb2RlID0gdGhpcy5tYWNoaW5lLmlkTWFwW3Jlc29sdmVkU3RhdGVJZF07XG5cbiAgICBpZiAoIXN0YXRlTm9kZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2hpbGQgc3RhdGUgbm9kZSAnI1wiLmNvbmNhdChyZXNvbHZlZFN0YXRlSWQsIFwiJyBkb2VzIG5vdCBleGlzdCBvbiBtYWNoaW5lICdcIikuY29uY2F0KHRoaXMuaWQsIFwiJ1wiKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXRlTm9kZTtcbiAgfTtcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgcmVsYXRpdmUgc3RhdGUgbm9kZSBmcm9tIHRoZSBnaXZlbiBgc3RhdGVQYXRoYCwgb3IgdGhyb3dzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHN0YXRlUGF0aCBUaGUgc3RyaW5nIG9yIHN0cmluZyBhcnJheSByZWxhdGl2ZSBwYXRoIHRvIHRoZSBzdGF0ZSBub2RlLlxyXG4gICAqL1xuXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5nZXRTdGF0ZU5vZGVCeVBhdGggPSBmdW5jdGlvbiAoc3RhdGVQYXRoKSB7XG4gICAgaWYgKHR5cGVvZiBzdGF0ZVBhdGggPT09ICdzdHJpbmcnICYmIGlzU3RhdGVJZChzdGF0ZVBhdGgpKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRTdGF0ZU5vZGVCeUlkKHN0YXRlUGF0aC5zbGljZSgxKSk7XG4gICAgICB9IGNhdGNoIChlKSB7Ly8gdHJ5IGluZGl2aWR1YWwgcGF0aHNcbiAgICAgICAgLy8gdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgYXJyYXlTdGF0ZVBhdGggPSB0b1N0YXRlUGF0aChzdGF0ZVBhdGgsIHRoaXMuZGVsaW1pdGVyKS5zbGljZSgpO1xuICAgIHZhciBjdXJyZW50U3RhdGVOb2RlID0gdGhpcztcblxuICAgIHdoaWxlIChhcnJheVN0YXRlUGF0aC5sZW5ndGgpIHtcbiAgICAgIHZhciBrZXkgPSBhcnJheVN0YXRlUGF0aC5zaGlmdCgpO1xuXG4gICAgICBpZiAoIWtleS5sZW5ndGgpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGN1cnJlbnRTdGF0ZU5vZGUgPSBjdXJyZW50U3RhdGVOb2RlLmdldFN0YXRlTm9kZShrZXkpO1xuICAgIH1cblxuICAgIHJldHVybiBjdXJyZW50U3RhdGVOb2RlO1xuICB9O1xuICAvKipcclxuICAgKiBSZXNvbHZlcyBhIHBhcnRpYWwgc3RhdGUgdmFsdWUgd2l0aCBpdHMgZnVsbCByZXByZXNlbnRhdGlvbiBpbiB0aGlzIG1hY2hpbmUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gc3RhdGVWYWx1ZSBUaGUgcGFydGlhbCBzdGF0ZSB2YWx1ZSB0byByZXNvbHZlLlxyXG4gICAqL1xuXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5yZXNvbHZlID0gZnVuY3Rpb24gKHN0YXRlVmFsdWUpIHtcbiAgICB2YXIgX2E7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKCFzdGF0ZVZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbml0aWFsU3RhdGVWYWx1ZSB8fCBFTVBUWV9PQkpFQ1Q7IC8vIFRPRE86IHR5cGUtc3BlY2lmaWMgcHJvcGVydGllc1xuICAgIH1cblxuICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICBjYXNlICdwYXJhbGxlbCc6XG4gICAgICAgIHJldHVybiBtYXBWYWx1ZXModGhpcy5pbml0aWFsU3RhdGVWYWx1ZSwgZnVuY3Rpb24gKHN1YlN0YXRlVmFsdWUsIHN1YlN0YXRlS2V5KSB7XG4gICAgICAgICAgcmV0dXJuIHN1YlN0YXRlVmFsdWUgPyBfdGhpcy5nZXRTdGF0ZU5vZGUoc3ViU3RhdGVLZXkpLnJlc29sdmUoc3RhdGVWYWx1ZVtzdWJTdGF0ZUtleV0gfHwgc3ViU3RhdGVWYWx1ZSkgOiBFTVBUWV9PQkpFQ1Q7XG4gICAgICAgIH0pO1xuXG4gICAgICBjYXNlICdjb21wb3VuZCc6XG4gICAgICAgIGlmIChpc1N0cmluZyhzdGF0ZVZhbHVlKSkge1xuICAgICAgICAgIHZhciBzdWJTdGF0ZU5vZGUgPSB0aGlzLmdldFN0YXRlTm9kZShzdGF0ZVZhbHVlKTtcblxuICAgICAgICAgIGlmIChzdWJTdGF0ZU5vZGUudHlwZSA9PT0gJ3BhcmFsbGVsJyB8fCBzdWJTdGF0ZU5vZGUudHlwZSA9PT0gJ2NvbXBvdW5kJykge1xuICAgICAgICAgICAgcmV0dXJuIF9hID0ge30sIF9hW3N0YXRlVmFsdWVdID0gc3ViU3RhdGVOb2RlLmluaXRpYWxTdGF0ZVZhbHVlLCBfYTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gc3RhdGVWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghT2JqZWN0LmtleXMoc3RhdGVWYWx1ZSkubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuaW5pdGlhbFN0YXRlVmFsdWUgfHwge307XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWFwVmFsdWVzKHN0YXRlVmFsdWUsIGZ1bmN0aW9uIChzdWJTdGF0ZVZhbHVlLCBzdWJTdGF0ZUtleSkge1xuICAgICAgICAgIHJldHVybiBzdWJTdGF0ZVZhbHVlID8gX3RoaXMuZ2V0U3RhdGVOb2RlKHN1YlN0YXRlS2V5KS5yZXNvbHZlKHN1YlN0YXRlVmFsdWUpIDogRU1QVFlfT0JKRUNUO1xuICAgICAgICB9KTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHN0YXRlVmFsdWUgfHwgRU1QVFlfT0JKRUNUO1xuICAgIH1cbiAgfTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldFJlc29sdmVkUGF0aCA9IGZ1bmN0aW9uIChzdGF0ZUlkZW50aWZpZXIpIHtcbiAgICBpZiAoaXNTdGF0ZUlkKHN0YXRlSWRlbnRpZmllcikpIHtcbiAgICAgIHZhciBzdGF0ZU5vZGUgPSB0aGlzLm1hY2hpbmUuaWRNYXBbc3RhdGVJZGVudGlmaWVyLnNsaWNlKFNUQVRFX0lERU5USUZJRVIubGVuZ3RoKV07XG5cbiAgICAgIGlmICghc3RhdGVOb2RlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuYWJsZSB0byBmaW5kIHN0YXRlIG5vZGUgJ1wiLmNvbmNhdChzdGF0ZUlkZW50aWZpZXIsIFwiJ1wiKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdGF0ZU5vZGUucGF0aDtcbiAgICB9XG5cbiAgICByZXR1cm4gdG9TdGF0ZVBhdGgoc3RhdGVJZGVudGlmaWVyLCB0aGlzLmRlbGltaXRlcik7XG4gIH07XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0YXRlTm9kZS5wcm90b3R5cGUsIFwiaW5pdGlhbFN0YXRlVmFsdWVcIiwge1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIF9hO1xuXG4gICAgICBpZiAodGhpcy5fX2NhY2hlLmluaXRpYWxTdGF0ZVZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fY2FjaGUuaW5pdGlhbFN0YXRlVmFsdWU7XG4gICAgICB9XG5cbiAgICAgIHZhciBpbml0aWFsU3RhdGVWYWx1ZTtcblxuICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ3BhcmFsbGVsJykge1xuICAgICAgICBpbml0aWFsU3RhdGVWYWx1ZSA9IG1hcEZpbHRlclZhbHVlcyh0aGlzLnN0YXRlcywgZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgICAgcmV0dXJuIHN0YXRlLmluaXRpYWxTdGF0ZVZhbHVlIHx8IEVNUFRZX09CSkVDVDtcbiAgICAgICAgfSwgZnVuY3Rpb24gKHN0YXRlTm9kZSkge1xuICAgICAgICAgIHJldHVybiAhKHN0YXRlTm9kZS50eXBlID09PSAnaGlzdG9yeScpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pbml0aWFsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlc1t0aGlzLmluaXRpYWxdKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW5pdGlhbCBzdGF0ZSAnXCIuY29uY2F0KHRoaXMuaW5pdGlhbCwgXCInIG5vdCBmb3VuZCBvbiAnXCIpLmNvbmNhdCh0aGlzLmtleSwgXCInXCIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXRpYWxTdGF0ZVZhbHVlID0gaXNMZWFmTm9kZSh0aGlzLnN0YXRlc1t0aGlzLmluaXRpYWxdKSA/IHRoaXMuaW5pdGlhbCA6IChfYSA9IHt9LCBfYVt0aGlzLmluaXRpYWxdID0gdGhpcy5zdGF0ZXNbdGhpcy5pbml0aWFsXS5pbml0aWFsU3RhdGVWYWx1ZSwgX2EpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVGhlIGZpbml0ZSBzdGF0ZSB2YWx1ZSBvZiBhIG1hY2hpbmUgd2l0aG91dCBjaGlsZCBzdGF0ZXMgaXMganVzdCBhbiBlbXB0eSBvYmplY3RcbiAgICAgICAgaW5pdGlhbFN0YXRlVmFsdWUgPSB7fTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fX2NhY2hlLmluaXRpYWxTdGF0ZVZhbHVlID0gaW5pdGlhbFN0YXRlVmFsdWU7XG4gICAgICByZXR1cm4gdGhpcy5fX2NhY2hlLmluaXRpYWxTdGF0ZVZhbHVlO1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZ2V0SW5pdGlhbFN0YXRlID0gZnVuY3Rpb24gKHN0YXRlVmFsdWUsIGNvbnRleHQpIHtcbiAgICB0aGlzLl9pbml0KCk7IC8vIFRPRE86IHRoaXMgc2hvdWxkIGJlIGluIHRoZSBjb25zdHJ1Y3RvciAoc2VlIG5vdGUgaW4gY29uc3RydWN0b3IpXG5cblxuICAgIHZhciBjb25maWd1cmF0aW9uID0gdGhpcy5nZXRTdGF0ZU5vZGVzKHN0YXRlVmFsdWUpO1xuICAgIHJldHVybiB0aGlzLnJlc29sdmVUcmFuc2l0aW9uKHtcbiAgICAgIGNvbmZpZ3VyYXRpb246IGNvbmZpZ3VyYXRpb24sXG4gICAgICBleGl0U2V0OiBbXSxcbiAgICAgIHRyYW5zaXRpb25zOiBbXSxcbiAgICAgIHNvdXJjZTogdW5kZWZpbmVkLFxuICAgICAgYWN0aW9uczogW11cbiAgICB9LCB1bmRlZmluZWQsIGNvbnRleHQgIT09IG51bGwgJiYgY29udGV4dCAhPT0gdm9pZCAwID8gY29udGV4dCA6IHRoaXMubWFjaGluZS5jb250ZXh0LCB1bmRlZmluZWQpO1xuICB9O1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGF0ZU5vZGUucHJvdG90eXBlLCBcImluaXRpYWxTdGF0ZVwiLCB7XG4gICAgLyoqXHJcbiAgICAgKiBUaGUgaW5pdGlhbCBTdGF0ZSBpbnN0YW5jZSwgd2hpY2ggaW5jbHVkZXMgYWxsIGFjdGlvbnMgdG8gYmUgZXhlY3V0ZWQgZnJvbVxyXG4gICAgICogZW50ZXJpbmcgdGhlIGluaXRpYWwgc3RhdGUuXHJcbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBpbml0aWFsU3RhdGVWYWx1ZSA9IHRoaXMuaW5pdGlhbFN0YXRlVmFsdWU7XG5cbiAgICAgIGlmICghaW5pdGlhbFN0YXRlVmFsdWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHJldHJpZXZlIGluaXRpYWwgc3RhdGUgZnJvbSBzaW1wbGUgc3RhdGUgJ1wiLmNvbmNhdCh0aGlzLmlkLCBcIicuXCIpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5pdGlhbFN0YXRlKGluaXRpYWxTdGF0ZVZhbHVlKTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0YXRlTm9kZS5wcm90b3R5cGUsIFwidGFyZ2V0XCIsIHtcbiAgICAvKipcclxuICAgICAqIFRoZSB0YXJnZXQgc3RhdGUgdmFsdWUgb2YgdGhlIGhpc3Rvcnkgc3RhdGUgbm9kZSwgaWYgaXQgZXhpc3RzLiBUaGlzIHJlcHJlc2VudHMgdGhlXHJcbiAgICAgKiBkZWZhdWx0IHN0YXRlIHZhbHVlIHRvIHRyYW5zaXRpb24gdG8gaWYgbm8gaGlzdG9yeSB2YWx1ZSBleGlzdHMgeWV0LlxyXG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdGFyZ2V0O1xuXG4gICAgICBpZiAodGhpcy50eXBlID09PSAnaGlzdG9yeScpIHtcbiAgICAgICAgdmFyIGhpc3RvcnlDb25maWcgPSB0aGlzLmNvbmZpZztcblxuICAgICAgICBpZiAoaXNTdHJpbmcoaGlzdG9yeUNvbmZpZy50YXJnZXQpKSB7XG4gICAgICAgICAgdGFyZ2V0ID0gaXNTdGF0ZUlkKGhpc3RvcnlDb25maWcudGFyZ2V0KSA/IHBhdGhUb1N0YXRlVmFsdWUodGhpcy5tYWNoaW5lLmdldFN0YXRlTm9kZUJ5SWQoaGlzdG9yeUNvbmZpZy50YXJnZXQpLnBhdGguc2xpY2UodGhpcy5wYXRoLmxlbmd0aCAtIDEpKSA6IGhpc3RvcnlDb25maWcudGFyZ2V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRhcmdldCA9IGhpc3RvcnlDb25maWcudGFyZ2V0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGxlYWYgbm9kZXMgZnJvbSBhIHN0YXRlIHBhdGggcmVsYXRpdmUgdG8gdGhpcyBzdGF0ZSBub2RlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHJlbGF0aXZlU3RhdGVJZCBUaGUgcmVsYXRpdmUgc3RhdGUgcGF0aCB0byByZXRyaWV2ZSB0aGUgc3RhdGUgbm9kZXNcclxuICAgKiBAcGFyYW0gaGlzdG9yeSBUaGUgcHJldmlvdXMgc3RhdGUgdG8gcmV0cmlldmUgaGlzdG9yeVxyXG4gICAqIEBwYXJhbSByZXNvbHZlIFdoZXRoZXIgc3RhdGUgbm9kZXMgc2hvdWxkIHJlc29sdmUgdG8gaW5pdGlhbCBjaGlsZCBzdGF0ZSBub2Rlc1xyXG4gICAqL1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZ2V0UmVsYXRpdmVTdGF0ZU5vZGVzID0gZnVuY3Rpb24gKHJlbGF0aXZlU3RhdGVJZCwgaGlzdG9yeVZhbHVlLCByZXNvbHZlKSB7XG4gICAgaWYgKHJlc29sdmUgPT09IHZvaWQgMCkge1xuICAgICAgcmVzb2x2ZSA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc29sdmUgPyByZWxhdGl2ZVN0YXRlSWQudHlwZSA9PT0gJ2hpc3RvcnknID8gcmVsYXRpdmVTdGF0ZUlkLnJlc29sdmVIaXN0b3J5KGhpc3RvcnlWYWx1ZSkgOiByZWxhdGl2ZVN0YXRlSWQuaW5pdGlhbFN0YXRlTm9kZXMgOiBbcmVsYXRpdmVTdGF0ZUlkXTtcbiAgfTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RhdGVOb2RlLnByb3RvdHlwZSwgXCJpbml0aWFsU3RhdGVOb2Rlc1wiLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICBpZiAoaXNMZWFmTm9kZSh0aGlzKSkge1xuICAgICAgICByZXR1cm4gW3RoaXNdO1xuICAgICAgfSAvLyBDYXNlIHdoZW4gc3RhdGUgbm9kZSBpcyBjb21wb3VuZCBidXQgbm8gaW5pdGlhbCBzdGF0ZSBpcyBkZWZpbmVkXG5cblxuICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ2NvbXBvdW5kJyAmJiAhdGhpcy5pbml0aWFsKSB7XG4gICAgICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgICAgIHdhcm4oZmFsc2UsIFwiQ29tcG91bmQgc3RhdGUgbm9kZSAnXCIuY29uY2F0KHRoaXMuaWQsIFwiJyBoYXMgbm8gaW5pdGlhbCBzdGF0ZS5cIikpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFt0aGlzXTtcbiAgICAgIH1cblxuICAgICAgdmFyIGluaXRpYWxTdGF0ZU5vZGVQYXRocyA9IHRvU3RhdGVQYXRocyh0aGlzLmluaXRpYWxTdGF0ZVZhbHVlKTtcbiAgICAgIHJldHVybiBmbGF0dGVuKGluaXRpYWxTdGF0ZU5vZGVQYXRocy5tYXAoZnVuY3Rpb24gKGluaXRpYWxQYXRoKSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5nZXRGcm9tUmVsYXRpdmVQYXRoKGluaXRpYWxQYXRoKTtcbiAgICAgIH0pKTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbiAgLyoqXHJcbiAgICogUmV0cmlldmVzIHN0YXRlIG5vZGVzIGZyb20gYSByZWxhdGl2ZSBwYXRoIHRvIHRoaXMgc3RhdGUgbm9kZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSByZWxhdGl2ZVBhdGggVGhlIHJlbGF0aXZlIHBhdGggZnJvbSB0aGlzIHN0YXRlIG5vZGVcclxuICAgKiBAcGFyYW0gaGlzdG9yeVZhbHVlXHJcbiAgICovXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5nZXRGcm9tUmVsYXRpdmVQYXRoID0gZnVuY3Rpb24gKHJlbGF0aXZlUGF0aCkge1xuICAgIGlmICghcmVsYXRpdmVQYXRoLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIFt0aGlzXTtcbiAgICB9XG5cbiAgICB2YXIgX2EgPSBfX3JlYWQocmVsYXRpdmVQYXRoKSxcbiAgICAgICAgc3RhdGVLZXkgPSBfYVswXSxcbiAgICAgICAgY2hpbGRTdGF0ZVBhdGggPSBfYS5zbGljZSgxKTtcblxuICAgIGlmICghdGhpcy5zdGF0ZXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCByZXRyaWV2ZSBzdWJQYXRoICdcIi5jb25jYXQoc3RhdGVLZXksIFwiJyBmcm9tIG5vZGUgd2l0aCBubyBzdGF0ZXNcIikpO1xuICAgIH1cblxuICAgIHZhciBjaGlsZFN0YXRlTm9kZSA9IHRoaXMuZ2V0U3RhdGVOb2RlKHN0YXRlS2V5KTtcblxuICAgIGlmIChjaGlsZFN0YXRlTm9kZS50eXBlID09PSAnaGlzdG9yeScpIHtcbiAgICAgIHJldHVybiBjaGlsZFN0YXRlTm9kZS5yZXNvbHZlSGlzdG9yeSgpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5zdGF0ZXNbc3RhdGVLZXldKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDaGlsZCBzdGF0ZSAnXCIuY29uY2F0KHN0YXRlS2V5LCBcIicgZG9lcyBub3QgZXhpc3Qgb24gJ1wiKS5jb25jYXQodGhpcy5pZCwgXCInXCIpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zdGF0ZXNbc3RhdGVLZXldLmdldEZyb21SZWxhdGl2ZVBhdGgoY2hpbGRTdGF0ZVBhdGgpO1xuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuaGlzdG9yeVZhbHVlID0gZnVuY3Rpb24gKHJlbGF0aXZlU3RhdGVWYWx1ZSkge1xuICAgIGlmICghT2JqZWN0LmtleXModGhpcy5zdGF0ZXMpLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgY3VycmVudDogcmVsYXRpdmVTdGF0ZVZhbHVlIHx8IHRoaXMuaW5pdGlhbFN0YXRlVmFsdWUsXG4gICAgICBzdGF0ZXM6IG1hcEZpbHRlclZhbHVlcyh0aGlzLnN0YXRlcywgZnVuY3Rpb24gKHN0YXRlTm9kZSwga2V5KSB7XG4gICAgICAgIGlmICghcmVsYXRpdmVTdGF0ZVZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIHN0YXRlTm9kZS5oaXN0b3J5VmFsdWUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzdWJTdGF0ZVZhbHVlID0gaXNTdHJpbmcocmVsYXRpdmVTdGF0ZVZhbHVlKSA/IHVuZGVmaW5lZCA6IHJlbGF0aXZlU3RhdGVWYWx1ZVtrZXldO1xuICAgICAgICByZXR1cm4gc3RhdGVOb2RlLmhpc3RvcnlWYWx1ZShzdWJTdGF0ZVZhbHVlIHx8IHN0YXRlTm9kZS5pbml0aWFsU3RhdGVWYWx1ZSk7XG4gICAgICB9LCBmdW5jdGlvbiAoc3RhdGVOb2RlKSB7XG4gICAgICAgIHJldHVybiAhc3RhdGVOb2RlLmhpc3Rvcnk7XG4gICAgICB9KVxuICAgIH07XG4gIH07XG4gIC8qKlxyXG4gICAqIFJlc29sdmVzIHRvIHRoZSBoaXN0b3JpY2FsIHZhbHVlKHMpIG9mIHRoZSBwYXJlbnQgc3RhdGUgbm9kZSxcclxuICAgKiByZXByZXNlbnRlZCBieSBzdGF0ZSBub2Rlcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBoaXN0b3J5VmFsdWVcclxuICAgKi9cblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUucmVzb2x2ZUhpc3RvcnkgPSBmdW5jdGlvbiAoaGlzdG9yeVZhbHVlKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmICh0aGlzLnR5cGUgIT09ICdoaXN0b3J5Jykge1xuICAgICAgcmV0dXJuIFt0aGlzXTtcbiAgICB9XG5cbiAgICB2YXIgcGFyZW50ID0gdGhpcy5wYXJlbnQ7XG5cbiAgICBpZiAoIWhpc3RvcnlWYWx1ZSkge1xuICAgICAgdmFyIGhpc3RvcnlUYXJnZXQgPSB0aGlzLnRhcmdldDtcbiAgICAgIHJldHVybiBoaXN0b3J5VGFyZ2V0ID8gZmxhdHRlbih0b1N0YXRlUGF0aHMoaGlzdG9yeVRhcmdldCkubWFwKGZ1bmN0aW9uIChyZWxhdGl2ZUNoaWxkUGF0aCkge1xuICAgICAgICByZXR1cm4gcGFyZW50LmdldEZyb21SZWxhdGl2ZVBhdGgocmVsYXRpdmVDaGlsZFBhdGgpO1xuICAgICAgfSkpIDogcGFyZW50LmluaXRpYWxTdGF0ZU5vZGVzO1xuICAgIH1cblxuICAgIHZhciBzdWJIaXN0b3J5VmFsdWUgPSBuZXN0ZWRQYXRoKHBhcmVudC5wYXRoLCAnc3RhdGVzJykoaGlzdG9yeVZhbHVlKS5jdXJyZW50O1xuXG4gICAgaWYgKGlzU3RyaW5nKHN1Ykhpc3RvcnlWYWx1ZSkpIHtcbiAgICAgIHJldHVybiBbcGFyZW50LmdldFN0YXRlTm9kZShzdWJIaXN0b3J5VmFsdWUpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmxhdHRlbih0b1N0YXRlUGF0aHMoc3ViSGlzdG9yeVZhbHVlKS5tYXAoZnVuY3Rpb24gKHN1YlN0YXRlUGF0aCkge1xuICAgICAgcmV0dXJuIF90aGlzLmhpc3RvcnkgPT09ICdkZWVwJyA/IHBhcmVudC5nZXRGcm9tUmVsYXRpdmVQYXRoKHN1YlN0YXRlUGF0aCkgOiBbcGFyZW50LnN0YXRlc1tzdWJTdGF0ZVBhdGhbMF1dXTtcbiAgICB9KSk7XG4gIH07XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0YXRlTm9kZS5wcm90b3R5cGUsIFwic3RhdGVJZHNcIiwge1xuICAgIC8qKlxyXG4gICAgICogQWxsIHRoZSBzdGF0ZSBub2RlIElEcyBvZiB0aGlzIHN0YXRlIG5vZGUgYW5kIGl0cyBkZXNjZW5kYW50IHN0YXRlIG5vZGVzLlxyXG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICB2YXIgY2hpbGRTdGF0ZUlkcyA9IGZsYXR0ZW4oT2JqZWN0LmtleXModGhpcy5zdGF0ZXMpLm1hcChmdW5jdGlvbiAoc3RhdGVLZXkpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLnN0YXRlc1tzdGF0ZUtleV0uc3RhdGVJZHM7XG4gICAgICB9KSk7XG4gICAgICByZXR1cm4gW3RoaXMuaWRdLmNvbmNhdChjaGlsZFN0YXRlSWRzKTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0YXRlTm9kZS5wcm90b3R5cGUsIFwiZXZlbnRzXCIsIHtcbiAgICAvKipcclxuICAgICAqIEFsbCB0aGUgZXZlbnQgdHlwZXMgYWNjZXB0ZWQgYnkgdGhpcyBzdGF0ZSBub2RlIGFuZCBpdHMgZGVzY2VuZGFudHMuXHJcbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBlXzgsIF9hLCBlXzksIF9iO1xuXG4gICAgICBpZiAodGhpcy5fX2NhY2hlLmV2ZW50cykge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2NhY2hlLmV2ZW50cztcbiAgICAgIH1cblxuICAgICAgdmFyIHN0YXRlcyA9IHRoaXMuc3RhdGVzO1xuICAgICAgdmFyIGV2ZW50cyA9IG5ldyBTZXQodGhpcy5vd25FdmVudHMpO1xuXG4gICAgICBpZiAoc3RhdGVzKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZm9yICh2YXIgX2MgPSBfX3ZhbHVlcyhPYmplY3Qua2V5cyhzdGF0ZXMpKSwgX2QgPSBfYy5uZXh0KCk7ICFfZC5kb25lOyBfZCA9IF9jLm5leHQoKSkge1xuICAgICAgICAgICAgdmFyIHN0YXRlSWQgPSBfZC52YWx1ZTtcbiAgICAgICAgICAgIHZhciBzdGF0ZSA9IHN0YXRlc1tzdGF0ZUlkXTtcblxuICAgICAgICAgICAgaWYgKHN0YXRlLnN0YXRlcykge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIF9lID0gKGVfOSA9IHZvaWQgMCwgX192YWx1ZXMoc3RhdGUuZXZlbnRzKSksIF9mID0gX2UubmV4dCgpOyAhX2YuZG9uZTsgX2YgPSBfZS5uZXh0KCkpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBldmVudF8xID0gX2YudmFsdWU7XG4gICAgICAgICAgICAgICAgICBldmVudHMuYWRkKFwiXCIuY29uY2F0KGV2ZW50XzEpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGVfOV8xKSB7XG4gICAgICAgICAgICAgICAgZV85ID0ge1xuICAgICAgICAgICAgICAgICAgZXJyb3I6IGVfOV8xXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgaWYgKF9mICYmICFfZi5kb25lICYmIChfYiA9IF9lLnJldHVybikpIF9iLmNhbGwoX2UpO1xuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICBpZiAoZV85KSB0aHJvdyBlXzkuZXJyb3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlXzhfMSkge1xuICAgICAgICAgIGVfOCA9IHtcbiAgICAgICAgICAgIGVycm9yOiBlXzhfMVxuICAgICAgICAgIH07XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChfZCAmJiAhX2QuZG9uZSAmJiAoX2EgPSBfYy5yZXR1cm4pKSBfYS5jYWxsKF9jKTtcbiAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgaWYgKGVfOCkgdGhyb3cgZV84LmVycm9yO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5fX2NhY2hlLmV2ZW50cyA9IEFycmF5LmZyb20oZXZlbnRzKTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0YXRlTm9kZS5wcm90b3R5cGUsIFwib3duRXZlbnRzXCIsIHtcbiAgICAvKipcclxuICAgICAqIEFsbCB0aGUgZXZlbnRzIHRoYXQgaGF2ZSB0cmFuc2l0aW9ucyBkaXJlY3RseSBmcm9tIHRoaXMgc3RhdGUgbm9kZS5cclxuICAgICAqXHJcbiAgICAgKiBFeGNsdWRlcyBhbnkgaW5lcnQgZXZlbnRzLlxyXG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgZXZlbnRzID0gbmV3IFNldCh0aGlzLnRyYW5zaXRpb25zLmZpbHRlcihmdW5jdGlvbiAodHJhbnNpdGlvbikge1xuICAgICAgICByZXR1cm4gISghdHJhbnNpdGlvbi50YXJnZXQgJiYgIXRyYW5zaXRpb24uYWN0aW9ucy5sZW5ndGggJiYgdHJhbnNpdGlvbi5pbnRlcm5hbCk7XG4gICAgICB9KS5tYXAoZnVuY3Rpb24gKHRyYW5zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuIHRyYW5zaXRpb24uZXZlbnRUeXBlO1xuICAgICAgfSkpO1xuICAgICAgcmV0dXJuIEFycmF5LmZyb20oZXZlbnRzKTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLnJlc29sdmVUYXJnZXQgPSBmdW5jdGlvbiAoX3RhcmdldCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoX3RhcmdldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBhbiB1bmRlZmluZWQgdGFyZ2V0IHNpZ25hbHMgdGhhdCB0aGUgc3RhdGUgbm9kZSBzaG91bGQgbm90IHRyYW5zaXRpb24gZnJvbSB0aGF0IHN0YXRlIHdoZW4gcmVjZWl2aW5nIHRoYXQgZXZlbnRcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIF90YXJnZXQubWFwKGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgIGlmICghaXNTdHJpbmcodGFyZ2V0KSkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgICAgfVxuXG4gICAgICB2YXIgaXNJbnRlcm5hbFRhcmdldCA9IHRhcmdldFswXSA9PT0gX3RoaXMuZGVsaW1pdGVyOyAvLyBJZiBpbnRlcm5hbCB0YXJnZXQgaXMgZGVmaW5lZCBvbiBtYWNoaW5lLFxuICAgICAgLy8gZG8gbm90IGluY2x1ZGUgbWFjaGluZSBrZXkgb24gdGFyZ2V0XG5cbiAgICAgIGlmIChpc0ludGVybmFsVGFyZ2V0ICYmICFfdGhpcy5wYXJlbnQpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLmdldFN0YXRlTm9kZUJ5UGF0aCh0YXJnZXQuc2xpY2UoMSkpO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVzb2x2ZWRUYXJnZXQgPSBpc0ludGVybmFsVGFyZ2V0ID8gX3RoaXMua2V5ICsgdGFyZ2V0IDogdGFyZ2V0O1xuXG4gICAgICBpZiAoX3RoaXMucGFyZW50KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIHRhcmdldFN0YXRlTm9kZSA9IF90aGlzLnBhcmVudC5nZXRTdGF0ZU5vZGVCeVBhdGgocmVzb2x2ZWRUYXJnZXQpO1xuXG4gICAgICAgICAgcmV0dXJuIHRhcmdldFN0YXRlTm9kZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB0cmFuc2l0aW9uIGRlZmluaXRpb24gZm9yIHN0YXRlIG5vZGUgJ1wiLmNvbmNhdChfdGhpcy5pZCwgXCInOlxcblwiKS5jb25jYXQoZXJyLm1lc3NhZ2UpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLmdldFN0YXRlTm9kZUJ5UGF0aChyZXNvbHZlZFRhcmdldCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5mb3JtYXRUcmFuc2l0aW9uID0gZnVuY3Rpb24gKHRyYW5zaXRpb25Db25maWcpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIG5vcm1hbGl6ZWRUYXJnZXQgPSBub3JtYWxpemVUYXJnZXQodHJhbnNpdGlvbkNvbmZpZy50YXJnZXQpO1xuICAgIHZhciBpbnRlcm5hbCA9ICdpbnRlcm5hbCcgaW4gdHJhbnNpdGlvbkNvbmZpZyA/IHRyYW5zaXRpb25Db25maWcuaW50ZXJuYWwgOiBub3JtYWxpemVkVGFyZ2V0ID8gbm9ybWFsaXplZFRhcmdldC5zb21lKGZ1bmN0aW9uIChfdGFyZ2V0KSB7XG4gICAgICByZXR1cm4gaXNTdHJpbmcoX3RhcmdldCkgJiYgX3RhcmdldFswXSA9PT0gX3RoaXMuZGVsaW1pdGVyO1xuICAgIH0pIDogdHJ1ZTtcbiAgICB2YXIgZ3VhcmRzID0gdGhpcy5tYWNoaW5lLm9wdGlvbnMuZ3VhcmRzO1xuICAgIHZhciB0YXJnZXQgPSB0aGlzLnJlc29sdmVUYXJnZXQobm9ybWFsaXplZFRhcmdldCk7XG5cbiAgICB2YXIgdHJhbnNpdGlvbiA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCB0cmFuc2l0aW9uQ29uZmlnKSwge1xuICAgICAgYWN0aW9uczogdG9BY3Rpb25PYmplY3RzKHRvQXJyYXkodHJhbnNpdGlvbkNvbmZpZy5hY3Rpb25zKSksXG4gICAgICBjb25kOiB0b0d1YXJkKHRyYW5zaXRpb25Db25maWcuY29uZCwgZ3VhcmRzKSxcbiAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgc291cmNlOiB0aGlzLFxuICAgICAgaW50ZXJuYWw6IGludGVybmFsLFxuICAgICAgZXZlbnRUeXBlOiB0cmFuc2l0aW9uQ29uZmlnLmV2ZW50LFxuICAgICAgdG9KU09OOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgdHJhbnNpdGlvbiksIHtcbiAgICAgICAgICB0YXJnZXQ6IHRyYW5zaXRpb24udGFyZ2V0ID8gdHJhbnNpdGlvbi50YXJnZXQubWFwKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICByZXR1cm4gXCIjXCIuY29uY2F0KHQuaWQpO1xuICAgICAgICAgIH0pIDogdW5kZWZpbmVkLFxuICAgICAgICAgIHNvdXJjZTogXCIjXCIuY29uY2F0KF90aGlzLmlkKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0cmFuc2l0aW9uO1xuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZm9ybWF0VHJhbnNpdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVfMTAsIF9hO1xuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBvbkNvbmZpZztcblxuICAgIGlmICghdGhpcy5jb25maWcub24pIHtcbiAgICAgIG9uQ29uZmlnID0gW107XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHRoaXMuY29uZmlnLm9uKSkge1xuICAgICAgb25Db25maWcgPSB0aGlzLmNvbmZpZy5vbjtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIF9iID0gdGhpcy5jb25maWcub24sXG4gICAgICAgICAgX2MgPSBXSUxEQ0FSRCxcbiAgICAgICAgICBfZCA9IF9iW19jXSxcbiAgICAgICAgICB3aWxkY2FyZENvbmZpZ3MgPSBfZCA9PT0gdm9pZCAwID8gW10gOiBfZCxcbiAgICAgICAgICBzdHJpY3RUcmFuc2l0aW9uQ29uZmlnc18xID0gX19yZXN0KF9iLCBbdHlwZW9mIF9jID09PSBcInN5bWJvbFwiID8gX2MgOiBfYyArIFwiXCJdKTtcblxuICAgICAgb25Db25maWcgPSBmbGF0dGVuKE9iamVjdC5rZXlzKHN0cmljdFRyYW5zaXRpb25Db25maWdzXzEpLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGlmICghSVNfUFJPRFVDVElPTiAmJiBrZXkgPT09IE5VTExfRVZFTlQpIHtcbiAgICAgICAgICB3YXJuKGZhbHNlLCBcIkVtcHR5IHN0cmluZyB0cmFuc2l0aW9uIGNvbmZpZ3MgKGUuZy4sIGB7IG9uOiB7ICcnOiAuLi4gfX1gKSBmb3IgdHJhbnNpZW50IHRyYW5zaXRpb25zIGFyZSBkZXByZWNhdGVkLiBTcGVjaWZ5IHRoZSB0cmFuc2l0aW9uIGluIHRoZSBgeyBhbHdheXM6IC4uLiB9YCBwcm9wZXJ0eSBpbnN0ZWFkLiBcIiArIFwiUGxlYXNlIGNoZWNrIHRoZSBgb25gIGNvbmZpZ3VyYXRpb24gZm9yIFxcXCIjXCIuY29uY2F0KF90aGlzLmlkLCBcIlxcXCIuXCIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0cmFuc2l0aW9uQ29uZmlnQXJyYXkgPSB0b1RyYW5zaXRpb25Db25maWdBcnJheShrZXksIHN0cmljdFRyYW5zaXRpb25Db25maWdzXzFba2V5XSk7XG5cbiAgICAgICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICAgICAgdmFsaWRhdGVBcnJheWlmaWVkVHJhbnNpdGlvbnMoX3RoaXMsIGtleSwgdHJhbnNpdGlvbkNvbmZpZ0FycmF5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cmFuc2l0aW9uQ29uZmlnQXJyYXk7XG4gICAgICB9KS5jb25jYXQodG9UcmFuc2l0aW9uQ29uZmlnQXJyYXkoV0lMRENBUkQsIHdpbGRjYXJkQ29uZmlncykpKTtcbiAgICB9XG5cbiAgICB2YXIgZXZlbnRsZXNzQ29uZmlnID0gdGhpcy5jb25maWcuYWx3YXlzID8gdG9UcmFuc2l0aW9uQ29uZmlnQXJyYXkoJycsIHRoaXMuY29uZmlnLmFsd2F5cykgOiBbXTtcbiAgICB2YXIgZG9uZUNvbmZpZyA9IHRoaXMuY29uZmlnLm9uRG9uZSA/IHRvVHJhbnNpdGlvbkNvbmZpZ0FycmF5KFN0cmluZyhkb25lKHRoaXMuaWQpKSwgdGhpcy5jb25maWcub25Eb25lKSA6IFtdO1xuXG4gICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICB3YXJuKCEodGhpcy5jb25maWcub25Eb25lICYmICF0aGlzLnBhcmVudCksIFwiUm9vdCBub2RlcyBjYW5ub3QgaGF2ZSBhbiBcXFwiLm9uRG9uZVxcXCIgdHJhbnNpdGlvbi4gUGxlYXNlIGNoZWNrIHRoZSBjb25maWcgb2YgXFxcIlwiLmNvbmNhdCh0aGlzLmlkLCBcIlxcXCIuXCIpKTtcbiAgICB9XG5cbiAgICB2YXIgaW52b2tlQ29uZmlnID0gZmxhdHRlbih0aGlzLmludm9rZS5tYXAoZnVuY3Rpb24gKGludm9rZURlZikge1xuICAgICAgdmFyIHNldHRsZVRyYW5zaXRpb25zID0gW107XG5cbiAgICAgIGlmIChpbnZva2VEZWYub25Eb25lKSB7XG4gICAgICAgIHNldHRsZVRyYW5zaXRpb25zLnB1c2guYXBwbHkoc2V0dGxlVHJhbnNpdGlvbnMsIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZCh0b1RyYW5zaXRpb25Db25maWdBcnJheShTdHJpbmcoZG9uZUludm9rZShpbnZva2VEZWYuaWQpKSwgaW52b2tlRGVmLm9uRG9uZSkpLCBmYWxzZSkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW52b2tlRGVmLm9uRXJyb3IpIHtcbiAgICAgICAgc2V0dGxlVHJhbnNpdGlvbnMucHVzaC5hcHBseShzZXR0bGVUcmFuc2l0aW9ucywgX19zcHJlYWRBcnJheShbXSwgX19yZWFkKHRvVHJhbnNpdGlvbkNvbmZpZ0FycmF5KFN0cmluZyhlcnJvcihpbnZva2VEZWYuaWQpKSwgaW52b2tlRGVmLm9uRXJyb3IpKSwgZmFsc2UpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHNldHRsZVRyYW5zaXRpb25zO1xuICAgIH0pKTtcbiAgICB2YXIgZGVsYXllZFRyYW5zaXRpb25zID0gdGhpcy5hZnRlcjtcbiAgICB2YXIgZm9ybWF0dGVkVHJhbnNpdGlvbnMgPSBmbGF0dGVuKF9fc3ByZWFkQXJyYXkoX19zcHJlYWRBcnJheShfX3NwcmVhZEFycmF5KF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChkb25lQ29uZmlnKSwgZmFsc2UpLCBfX3JlYWQoaW52b2tlQ29uZmlnKSwgZmFsc2UpLCBfX3JlYWQob25Db25maWcpLCBmYWxzZSksIF9fcmVhZChldmVudGxlc3NDb25maWcpLCBmYWxzZSkubWFwKGZ1bmN0aW9uICh0cmFuc2l0aW9uQ29uZmlnKSB7XG4gICAgICByZXR1cm4gdG9BcnJheSh0cmFuc2l0aW9uQ29uZmlnKS5tYXAoZnVuY3Rpb24gKHRyYW5zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLmZvcm1hdFRyYW5zaXRpb24odHJhbnNpdGlvbik7XG4gICAgICB9KTtcbiAgICB9KSk7XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgZGVsYXllZFRyYW5zaXRpb25zXzEgPSBfX3ZhbHVlcyhkZWxheWVkVHJhbnNpdGlvbnMpLCBkZWxheWVkVHJhbnNpdGlvbnNfMV8xID0gZGVsYXllZFRyYW5zaXRpb25zXzEubmV4dCgpOyAhZGVsYXllZFRyYW5zaXRpb25zXzFfMS5kb25lOyBkZWxheWVkVHJhbnNpdGlvbnNfMV8xID0gZGVsYXllZFRyYW5zaXRpb25zXzEubmV4dCgpKSB7XG4gICAgICAgIHZhciBkZWxheWVkVHJhbnNpdGlvbiA9IGRlbGF5ZWRUcmFuc2l0aW9uc18xXzEudmFsdWU7XG4gICAgICAgIGZvcm1hdHRlZFRyYW5zaXRpb25zLnB1c2goZGVsYXllZFRyYW5zaXRpb24pO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfMTBfMSkge1xuICAgICAgZV8xMCA9IHtcbiAgICAgICAgZXJyb3I6IGVfMTBfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKGRlbGF5ZWRUcmFuc2l0aW9uc18xXzEgJiYgIWRlbGF5ZWRUcmFuc2l0aW9uc18xXzEuZG9uZSAmJiAoX2EgPSBkZWxheWVkVHJhbnNpdGlvbnNfMS5yZXR1cm4pKSBfYS5jYWxsKGRlbGF5ZWRUcmFuc2l0aW9uc18xKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzEwKSB0aHJvdyBlXzEwLmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmb3JtYXR0ZWRUcmFuc2l0aW9ucztcbiAgfTtcblxuICByZXR1cm4gU3RhdGVOb2RlO1xufSgpO1xuXG5leHBvcnQgeyBTdGF0ZU5vZGUgfTtcbiIsIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcblxyXG52YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfTtcclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZnVuY3Rpb24gX19zcHJlYWRBcnJheSh0bywgZnJvbSwgcGFjaykge1xyXG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XHJcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XHJcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcclxufVxuXG5leHBvcnQgeyBfX2Fzc2lnbiwgX19yZWFkLCBfX3Jlc3QsIF9fc3ByZWFkQXJyYXksIF9fdmFsdWVzIH07XG4iLCJpbXBvcnQgeyBBY3Rpb25UeXBlcyB9IGZyb20gJy4vdHlwZXMuanMnO1xuXG52YXIgc3RhcnQgPSBBY3Rpb25UeXBlcy5TdGFydDtcbnZhciBzdG9wID0gQWN0aW9uVHlwZXMuU3RvcDtcbnZhciByYWlzZSA9IEFjdGlvblR5cGVzLlJhaXNlO1xudmFyIHNlbmQgPSBBY3Rpb25UeXBlcy5TZW5kO1xudmFyIGNhbmNlbCA9IEFjdGlvblR5cGVzLkNhbmNlbDtcbnZhciBudWxsRXZlbnQgPSBBY3Rpb25UeXBlcy5OdWxsRXZlbnQ7XG52YXIgYXNzaWduID0gQWN0aW9uVHlwZXMuQXNzaWduO1xudmFyIGFmdGVyID0gQWN0aW9uVHlwZXMuQWZ0ZXI7XG52YXIgZG9uZVN0YXRlID0gQWN0aW9uVHlwZXMuRG9uZVN0YXRlO1xudmFyIGxvZyA9IEFjdGlvblR5cGVzLkxvZztcbnZhciBpbml0ID0gQWN0aW9uVHlwZXMuSW5pdDtcbnZhciBpbnZva2UgPSBBY3Rpb25UeXBlcy5JbnZva2U7XG52YXIgZXJyb3JFeGVjdXRpb24gPSBBY3Rpb25UeXBlcy5FcnJvckV4ZWN1dGlvbjtcbnZhciBlcnJvclBsYXRmb3JtID0gQWN0aW9uVHlwZXMuRXJyb3JQbGF0Zm9ybTtcbnZhciBlcnJvciA9IEFjdGlvblR5cGVzLkVycm9yQ3VzdG9tO1xudmFyIHVwZGF0ZSA9IEFjdGlvblR5cGVzLlVwZGF0ZTtcbnZhciBjaG9vc2UgPSBBY3Rpb25UeXBlcy5DaG9vc2U7XG52YXIgcHVyZSA9IEFjdGlvblR5cGVzLlB1cmU7XG5cbmV4cG9ydCB7IGFmdGVyLCBhc3NpZ24sIGNhbmNlbCwgY2hvb3NlLCBkb25lU3RhdGUsIGVycm9yLCBlcnJvckV4ZWN1dGlvbiwgZXJyb3JQbGF0Zm9ybSwgaW5pdCwgaW52b2tlLCBsb2csIG51bGxFdmVudCwgcHVyZSwgcmFpc2UsIHNlbmQsIHN0YXJ0LCBzdG9wLCB1cGRhdGUgfTtcbiIsImltcG9ydCB7IF9fYXNzaWduLCBfX3NwcmVhZEFycmF5LCBfX3JlYWQsIF9fdmFsdWVzIH0gZnJvbSAnLi9fdmlydHVhbC9fdHNsaWIuanMnO1xuaW1wb3J0IHsgU3BlY2lhbFRhcmdldHMsIEFjdGlvblR5cGVzIH0gZnJvbSAnLi90eXBlcy5qcyc7XG5pbXBvcnQgeyBpbml0LCByYWlzZSBhcyByYWlzZSQxLCBzZW5kIGFzIHNlbmQkMSwgdXBkYXRlLCBsb2cgYXMgbG9nJDEsIGNhbmNlbCBhcyBjYW5jZWwkMSwgYXNzaWduIGFzIGFzc2lnbiQxLCBlcnJvciBhcyBlcnJvciQxLCBzdG9wIGFzIHN0b3AkMSwgcHVyZSBhcyBwdXJlJDEsIGNob29zZSBhcyBjaG9vc2UkMSB9IGZyb20gJy4vYWN0aW9uVHlwZXMuanMnO1xuaW1wb3J0ICogYXMgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcy5qcyc7XG5leHBvcnQgeyBhY3Rpb25UeXBlcyB9O1xuaW1wb3J0IHsgdG9TQ1hNTEV2ZW50LCBpc1N0cmluZywgaXNGdW5jdGlvbiwgdG9FdmVudE9iamVjdCwgZ2V0RXZlbnRUeXBlLCB1cGRhdGVDb250ZXh0LCBmbGF0dGVuLCBpc0FycmF5LCB0b0FycmF5LCB0b0d1YXJkLCBldmFsdWF0ZUd1YXJkLCB3YXJuIH0gZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQgeyBJU19QUk9EVUNUSU9OIH0gZnJvbSAnLi9lbnZpcm9ubWVudC5qcyc7XG5cbnZhciBpbml0RXZlbnQgPSAvKiNfX1BVUkVfXyovdG9TQ1hNTEV2ZW50KHtcbiAgdHlwZTogaW5pdFxufSk7XG5mdW5jdGlvbiBnZXRBY3Rpb25GdW5jdGlvbihhY3Rpb25UeXBlLCBhY3Rpb25GdW5jdGlvbk1hcCkge1xuICByZXR1cm4gYWN0aW9uRnVuY3Rpb25NYXAgPyBhY3Rpb25GdW5jdGlvbk1hcFthY3Rpb25UeXBlXSB8fCB1bmRlZmluZWQgOiB1bmRlZmluZWQ7XG59XG5mdW5jdGlvbiB0b0FjdGlvbk9iamVjdChhY3Rpb24sIGFjdGlvbkZ1bmN0aW9uTWFwKSB7XG4gIHZhciBhY3Rpb25PYmplY3Q7XG5cbiAgaWYgKGlzU3RyaW5nKGFjdGlvbikgfHwgdHlwZW9mIGFjdGlvbiA9PT0gJ251bWJlcicpIHtcbiAgICB2YXIgZXhlYyA9IGdldEFjdGlvbkZ1bmN0aW9uKGFjdGlvbiwgYWN0aW9uRnVuY3Rpb25NYXApO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oZXhlYykpIHtcbiAgICAgIGFjdGlvbk9iamVjdCA9IHtcbiAgICAgICAgdHlwZTogYWN0aW9uLFxuICAgICAgICBleGVjOiBleGVjXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoZXhlYykge1xuICAgICAgYWN0aW9uT2JqZWN0ID0gZXhlYztcbiAgICB9IGVsc2Uge1xuICAgICAgYWN0aW9uT2JqZWN0ID0ge1xuICAgICAgICB0eXBlOiBhY3Rpb24sXG4gICAgICAgIGV4ZWM6IHVuZGVmaW5lZFxuICAgICAgfTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNGdW5jdGlvbihhY3Rpb24pKSB7XG4gICAgYWN0aW9uT2JqZWN0ID0ge1xuICAgICAgLy8gQ29udmVydCBhY3Rpb24gdG8gc3RyaW5nIGlmIHVubmFtZWRcbiAgICAgIHR5cGU6IGFjdGlvbi5uYW1lIHx8IGFjdGlvbi50b1N0cmluZygpLFxuICAgICAgZXhlYzogYWN0aW9uXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgZXhlYyA9IGdldEFjdGlvbkZ1bmN0aW9uKGFjdGlvbi50eXBlLCBhY3Rpb25GdW5jdGlvbk1hcCk7XG5cbiAgICBpZiAoaXNGdW5jdGlvbihleGVjKSkge1xuICAgICAgYWN0aW9uT2JqZWN0ID0gX19hc3NpZ24oX19hc3NpZ24oe30sIGFjdGlvbiksIHtcbiAgICAgICAgZXhlYzogZXhlY1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChleGVjKSB7XG4gICAgICB2YXIgYWN0aW9uVHlwZSA9IGV4ZWMudHlwZSB8fCBhY3Rpb24udHlwZTtcbiAgICAgIGFjdGlvbk9iamVjdCA9IF9fYXNzaWduKF9fYXNzaWduKF9fYXNzaWduKHt9LCBleGVjKSwgYWN0aW9uKSwge1xuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWN0aW9uT2JqZWN0ID0gYWN0aW9uO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhY3Rpb25PYmplY3Q7XG59XG52YXIgdG9BY3Rpb25PYmplY3RzID0gZnVuY3Rpb24gKGFjdGlvbiwgYWN0aW9uRnVuY3Rpb25NYXApIHtcbiAgaWYgKCFhY3Rpb24pIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICB2YXIgYWN0aW9ucyA9IGlzQXJyYXkoYWN0aW9uKSA/IGFjdGlvbiA6IFthY3Rpb25dO1xuICByZXR1cm4gYWN0aW9ucy5tYXAoZnVuY3Rpb24gKHN1YkFjdGlvbikge1xuICAgIHJldHVybiB0b0FjdGlvbk9iamVjdChzdWJBY3Rpb24sIGFjdGlvbkZ1bmN0aW9uTWFwKTtcbiAgfSk7XG59O1xuZnVuY3Rpb24gdG9BY3Rpdml0eURlZmluaXRpb24oYWN0aW9uKSB7XG4gIHZhciBhY3Rpb25PYmplY3QgPSB0b0FjdGlvbk9iamVjdChhY3Rpb24pO1xuICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe1xuICAgIGlkOiBpc1N0cmluZyhhY3Rpb24pID8gYWN0aW9uIDogYWN0aW9uT2JqZWN0LmlkXG4gIH0sIGFjdGlvbk9iamVjdCksIHtcbiAgICB0eXBlOiBhY3Rpb25PYmplY3QudHlwZVxuICB9KTtcbn1cbi8qKlxyXG4gKiBSYWlzZXMgYW4gZXZlbnQuIFRoaXMgcGxhY2VzIHRoZSBldmVudCBpbiB0aGUgaW50ZXJuYWwgZXZlbnQgcXVldWUsIHNvIHRoYXRcclxuICogdGhlIGV2ZW50IGlzIGltbWVkaWF0ZWx5IGNvbnN1bWVkIGJ5IHRoZSBtYWNoaW5lIGluIHRoZSBjdXJyZW50IHN0ZXAuXHJcbiAqXHJcbiAqIEBwYXJhbSBldmVudFR5cGUgVGhlIGV2ZW50IHRvIHJhaXNlLlxyXG4gKi9cblxuZnVuY3Rpb24gcmFpc2UoZXZlbnQsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiByYWlzZSQxLFxuICAgIGV2ZW50OiB0eXBlb2YgZXZlbnQgPT09ICdmdW5jdGlvbicgPyBldmVudCA6IHRvRXZlbnRPYmplY3QoZXZlbnQpLFxuICAgIGRlbGF5OiBvcHRpb25zID8gb3B0aW9ucy5kZWxheSA6IHVuZGVmaW5lZCxcbiAgICBpZDogb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLmlkXG4gIH07XG59XG5mdW5jdGlvbiByZXNvbHZlUmFpc2UoYWN0aW9uLCBjdHgsIF9ldmVudCwgZGVsYXlzTWFwKSB7XG4gIHZhciBtZXRhID0ge1xuICAgIF9ldmVudDogX2V2ZW50XG4gIH07XG4gIHZhciByZXNvbHZlZEV2ZW50ID0gdG9TQ1hNTEV2ZW50KGlzRnVuY3Rpb24oYWN0aW9uLmV2ZW50KSA/IGFjdGlvbi5ldmVudChjdHgsIF9ldmVudC5kYXRhLCBtZXRhKSA6IGFjdGlvbi5ldmVudCk7XG4gIHZhciByZXNvbHZlZERlbGF5O1xuXG4gIGlmIChpc1N0cmluZyhhY3Rpb24uZGVsYXkpKSB7XG4gICAgdmFyIGNvbmZpZ0RlbGF5ID0gZGVsYXlzTWFwICYmIGRlbGF5c01hcFthY3Rpb24uZGVsYXldO1xuICAgIHJlc29sdmVkRGVsYXkgPSBpc0Z1bmN0aW9uKGNvbmZpZ0RlbGF5KSA/IGNvbmZpZ0RlbGF5KGN0eCwgX2V2ZW50LmRhdGEsIG1ldGEpIDogY29uZmlnRGVsYXk7XG4gIH0gZWxzZSB7XG4gICAgcmVzb2x2ZWREZWxheSA9IGlzRnVuY3Rpb24oYWN0aW9uLmRlbGF5KSA/IGFjdGlvbi5kZWxheShjdHgsIF9ldmVudC5kYXRhLCBtZXRhKSA6IGFjdGlvbi5kZWxheTtcbiAgfVxuXG4gIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgYWN0aW9uKSwge1xuICAgIHR5cGU6IHJhaXNlJDEsXG4gICAgX2V2ZW50OiByZXNvbHZlZEV2ZW50LFxuICAgIGRlbGF5OiByZXNvbHZlZERlbGF5XG4gIH0pO1xufVxuLyoqXHJcbiAqIFNlbmRzIGFuIGV2ZW50LiBUaGlzIHJldHVybnMgYW4gYWN0aW9uIHRoYXQgd2lsbCBiZSByZWFkIGJ5IGFuIGludGVycHJldGVyIHRvXHJcbiAqIHNlbmQgdGhlIGV2ZW50IGluIHRoZSBuZXh0IHN0ZXAsIGFmdGVyIHRoZSBjdXJyZW50IHN0ZXAgaXMgZmluaXNoZWQgZXhlY3V0aW5nLlxyXG4gKlxyXG4gKiBAZGVwcmVjYXRlZCBVc2UgdGhlIGBzZW5kVG8oLi4uKWAgYWN0aW9uIGNyZWF0b3IgaW5zdGVhZC5cclxuICpcclxuICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCB0byBzZW5kLlxyXG4gKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIHRvIHBhc3MgaW50byB0aGUgc2VuZCBldmVudDpcclxuICogIC0gYGlkYCAtIFRoZSB1bmlxdWUgc2VuZCBldmVudCBpZGVudGlmaWVyICh1c2VkIHdpdGggYGNhbmNlbCgpYCkuXHJcbiAqICAtIGBkZWxheWAgLSBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byBkZWxheSB0aGUgc2VuZGluZyBvZiB0aGUgZXZlbnQuXHJcbiAqICAtIGB0b2AgLSBUaGUgdGFyZ2V0IG9mIHRoaXMgZXZlbnQgKGJ5IGRlZmF1bHQsIHRoZSBtYWNoaW5lIHRoZSBldmVudCB3YXMgc2VudCBmcm9tKS5cclxuICovXG5cbmZ1bmN0aW9uIHNlbmQoZXZlbnQsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIHtcbiAgICB0bzogb3B0aW9ucyA/IG9wdGlvbnMudG8gOiB1bmRlZmluZWQsXG4gICAgdHlwZTogc2VuZCQxLFxuICAgIGV2ZW50OiBpc0Z1bmN0aW9uKGV2ZW50KSA/IGV2ZW50IDogdG9FdmVudE9iamVjdChldmVudCksXG4gICAgZGVsYXk6IG9wdGlvbnMgPyBvcHRpb25zLmRlbGF5IDogdW5kZWZpbmVkLFxuICAgIC8vIFRPRE86IGRvbid0IGF1dG8tZ2VuZXJhdGUgSURzIGhlcmUgbGlrZSB0aGF0XG4gICAgLy8gdGhlcmUgaXMgdG9vIGJpZyBjaGFuY2Ugb2YgdGhlIElEIGNvbGxpc2lvblxuICAgIGlkOiBvcHRpb25zICYmIG9wdGlvbnMuaWQgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuaWQgOiBpc0Z1bmN0aW9uKGV2ZW50KSA/IGV2ZW50Lm5hbWUgOiBnZXRFdmVudFR5cGUoZXZlbnQpXG4gIH07XG59XG5mdW5jdGlvbiByZXNvbHZlU2VuZChhY3Rpb24sIGN0eCwgX2V2ZW50LCBkZWxheXNNYXApIHtcbiAgdmFyIG1ldGEgPSB7XG4gICAgX2V2ZW50OiBfZXZlbnRcbiAgfTsgLy8gVE9ETzogaGVscGVyIGZ1bmN0aW9uIGZvciByZXNvbHZpbmcgRXhwclxuXG4gIHZhciByZXNvbHZlZEV2ZW50ID0gdG9TQ1hNTEV2ZW50KGlzRnVuY3Rpb24oYWN0aW9uLmV2ZW50KSA/IGFjdGlvbi5ldmVudChjdHgsIF9ldmVudC5kYXRhLCBtZXRhKSA6IGFjdGlvbi5ldmVudCk7XG4gIHZhciByZXNvbHZlZERlbGF5O1xuXG4gIGlmIChpc1N0cmluZyhhY3Rpb24uZGVsYXkpKSB7XG4gICAgdmFyIGNvbmZpZ0RlbGF5ID0gZGVsYXlzTWFwICYmIGRlbGF5c01hcFthY3Rpb24uZGVsYXldO1xuICAgIHJlc29sdmVkRGVsYXkgPSBpc0Z1bmN0aW9uKGNvbmZpZ0RlbGF5KSA/IGNvbmZpZ0RlbGF5KGN0eCwgX2V2ZW50LmRhdGEsIG1ldGEpIDogY29uZmlnRGVsYXk7XG4gIH0gZWxzZSB7XG4gICAgcmVzb2x2ZWREZWxheSA9IGlzRnVuY3Rpb24oYWN0aW9uLmRlbGF5KSA/IGFjdGlvbi5kZWxheShjdHgsIF9ldmVudC5kYXRhLCBtZXRhKSA6IGFjdGlvbi5kZWxheTtcbiAgfVxuXG4gIHZhciByZXNvbHZlZFRhcmdldCA9IGlzRnVuY3Rpb24oYWN0aW9uLnRvKSA/IGFjdGlvbi50byhjdHgsIF9ldmVudC5kYXRhLCBtZXRhKSA6IGFjdGlvbi50bztcbiAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCBhY3Rpb24pLCB7XG4gICAgdG86IHJlc29sdmVkVGFyZ2V0LFxuICAgIF9ldmVudDogcmVzb2x2ZWRFdmVudCxcbiAgICBldmVudDogcmVzb2x2ZWRFdmVudC5kYXRhLFxuICAgIGRlbGF5OiByZXNvbHZlZERlbGF5XG4gIH0pO1xufVxuLyoqXHJcbiAqIFNlbmRzIGFuIGV2ZW50IHRvIHRoaXMgbWFjaGluZSdzIHBhcmVudC5cclxuICpcclxuICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCB0byBzZW5kIHRvIHRoZSBwYXJlbnQgbWFjaGluZS5cclxuICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyB0byBwYXNzIGludG8gdGhlIHNlbmQgZXZlbnQuXHJcbiAqL1xuXG5mdW5jdGlvbiBzZW5kUGFyZW50KGV2ZW50LCBvcHRpb25zKSB7XG4gIHJldHVybiBzZW5kKGV2ZW50LCBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgb3B0aW9ucyksIHtcbiAgICB0bzogU3BlY2lhbFRhcmdldHMuUGFyZW50XG4gIH0pKTtcbn1cbi8qKlxyXG4gKiBTZW5kcyBhbiBldmVudCB0byBhbiBhY3Rvci5cclxuICpcclxuICogQHBhcmFtIGFjdG9yIFRoZSBgQWN0b3JSZWZgIHRvIHNlbmQgdGhlIGV2ZW50IHRvLlxyXG4gKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IHRvIHNlbmQsIG9yIGFuIGV4cHJlc3Npb24gdGhhdCBldmFsdWF0ZXMgdG8gdGhlIGV2ZW50IHRvIHNlbmRcclxuICogQHBhcmFtIG9wdGlvbnMgU2VuZCBhY3Rpb24gb3B0aW9uc1xyXG4gKiBAcmV0dXJucyBBbiBYU3RhdGUgc2VuZCBhY3Rpb24gb2JqZWN0XHJcbiAqL1xuXG5mdW5jdGlvbiBzZW5kVG8oYWN0b3IsIGV2ZW50LCBvcHRpb25zKSB7XG4gIHJldHVybiBzZW5kKGV2ZW50LCBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgb3B0aW9ucyksIHtcbiAgICB0bzogYWN0b3JcbiAgfSkpO1xufVxuLyoqXHJcbiAqIFNlbmRzIGFuIHVwZGF0ZSBldmVudCB0byB0aGlzIG1hY2hpbmUncyBwYXJlbnQuXHJcbiAqL1xuXG5mdW5jdGlvbiBzZW5kVXBkYXRlKCkge1xuICByZXR1cm4gc2VuZFBhcmVudCh1cGRhdGUpO1xufVxuLyoqXHJcbiAqIFNlbmRzIGFuIGV2ZW50IGJhY2sgdG8gdGhlIHNlbmRlciBvZiB0aGUgb3JpZ2luYWwgZXZlbnQuXHJcbiAqXHJcbiAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgdG8gc2VuZCBiYWNrIHRvIHRoZSBzZW5kZXJcclxuICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyB0byBwYXNzIGludG8gdGhlIHNlbmQgZXZlbnRcclxuICovXG5cbmZ1bmN0aW9uIHJlc3BvbmQoZXZlbnQsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIHNlbmQoZXZlbnQsIF9fYXNzaWduKF9fYXNzaWduKHt9LCBvcHRpb25zKSwge1xuICAgIHRvOiBmdW5jdGlvbiAoXywgX18sIF9hKSB7XG4gICAgICB2YXIgX2V2ZW50ID0gX2EuX2V2ZW50O1xuICAgICAgcmV0dXJuIF9ldmVudC5vcmlnaW47IC8vIFRPRE86IGhhbmRsZSB3aGVuIF9ldmVudC5vcmlnaW4gaXMgdW5kZWZpbmVkXG4gICAgfVxuICB9KSk7XG59XG5cbnZhciBkZWZhdWx0TG9nRXhwciA9IGZ1bmN0aW9uIChjb250ZXh0LCBldmVudCkge1xuICByZXR1cm4ge1xuICAgIGNvbnRleHQ6IGNvbnRleHQsXG4gICAgZXZlbnQ6IGV2ZW50XG4gIH07XG59O1xuLyoqXHJcbiAqXHJcbiAqIEBwYXJhbSBleHByIFRoZSBleHByZXNzaW9uIGZ1bmN0aW9uIHRvIGV2YWx1YXRlIHdoaWNoIHdpbGwgYmUgbG9nZ2VkLlxyXG4gKiAgVGFrZXMgaW4gMiBhcmd1bWVudHM6XHJcbiAqICAtIGBjdHhgIC0gdGhlIGN1cnJlbnQgc3RhdGUgY29udGV4dFxyXG4gKiAgLSBgZXZlbnRgIC0gdGhlIGV2ZW50IHRoYXQgY2F1c2VkIHRoaXMgYWN0aW9uIHRvIGJlIGV4ZWN1dGVkLlxyXG4gKiBAcGFyYW0gbGFiZWwgVGhlIGxhYmVsIHRvIGdpdmUgdG8gdGhlIGxvZ2dlZCBleHByZXNzaW9uLlxyXG4gKi9cblxuXG5mdW5jdGlvbiBsb2coZXhwciwgbGFiZWwpIHtcbiAgaWYgKGV4cHIgPT09IHZvaWQgMCkge1xuICAgIGV4cHIgPSBkZWZhdWx0TG9nRXhwcjtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdHlwZTogbG9nJDEsXG4gICAgbGFiZWw6IGxhYmVsLFxuICAgIGV4cHI6IGV4cHJcbiAgfTtcbn1cbnZhciByZXNvbHZlTG9nID0gZnVuY3Rpb24gKGFjdGlvbiwgY3R4LCBfZXZlbnQpIHtcbiAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCBhY3Rpb24pLCB7XG4gICAgdmFsdWU6IGlzU3RyaW5nKGFjdGlvbi5leHByKSA/IGFjdGlvbi5leHByIDogYWN0aW9uLmV4cHIoY3R4LCBfZXZlbnQuZGF0YSwge1xuICAgICAgX2V2ZW50OiBfZXZlbnRcbiAgICB9KVxuICB9KTtcbn07XG4vKipcclxuICogQ2FuY2VscyBhbiBpbi1mbGlnaHQgYHNlbmQoLi4uKWAgYWN0aW9uLiBBIGNhbmNlbGVkIHNlbnQgYWN0aW9uIHdpbGwgbm90XHJcbiAqIGJlIGV4ZWN1dGVkLCBub3Igd2lsbCBpdHMgZXZlbnQgYmUgc2VudCwgdW5sZXNzIGl0IGhhcyBhbHJlYWR5IGJlZW4gc2VudFxyXG4gKiAoZS5nLiwgaWYgYGNhbmNlbCguLi4pYCBpcyBjYWxsZWQgYWZ0ZXIgdGhlIGBzZW5kKC4uLilgIGFjdGlvbidzIGBkZWxheWApLlxyXG4gKlxyXG4gKiBAcGFyYW0gc2VuZElkIFRoZSBgaWRgIG9mIHRoZSBgc2VuZCguLi4pYCBhY3Rpb24gdG8gY2FuY2VsLlxyXG4gKi9cblxudmFyIGNhbmNlbCA9IGZ1bmN0aW9uIChzZW5kSWQpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBjYW5jZWwkMSxcbiAgICBzZW5kSWQ6IHNlbmRJZFxuICB9O1xufTtcbi8qKlxyXG4gKiBTdGFydHMgYW4gYWN0aXZpdHkuXHJcbiAqXHJcbiAqIEBwYXJhbSBhY3Rpdml0eSBUaGUgYWN0aXZpdHkgdG8gc3RhcnQuXHJcbiAqL1xuXG5mdW5jdGlvbiBzdGFydChhY3Rpdml0eSkge1xuICB2YXIgYWN0aXZpdHlEZWYgPSB0b0FjdGl2aXR5RGVmaW5pdGlvbihhY3Rpdml0eSk7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuU3RhcnQsXG4gICAgYWN0aXZpdHk6IGFjdGl2aXR5RGVmLFxuICAgIGV4ZWM6IHVuZGVmaW5lZFxuICB9O1xufVxuLyoqXHJcbiAqIFN0b3BzIGFuIGFjdGl2aXR5LlxyXG4gKlxyXG4gKiBAcGFyYW0gYWN0b3JSZWYgVGhlIGFjdGl2aXR5IHRvIHN0b3AuXHJcbiAqL1xuXG5mdW5jdGlvbiBzdG9wKGFjdG9yUmVmKSB7XG4gIHZhciBhY3Rpdml0eSA9IGlzRnVuY3Rpb24oYWN0b3JSZWYpID8gYWN0b3JSZWYgOiB0b0FjdGl2aXR5RGVmaW5pdGlvbihhY3RvclJlZik7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuU3RvcCxcbiAgICBhY3Rpdml0eTogYWN0aXZpdHksXG4gICAgZXhlYzogdW5kZWZpbmVkXG4gIH07XG59XG5mdW5jdGlvbiByZXNvbHZlU3RvcChhY3Rpb24sIGNvbnRleHQsIF9ldmVudCkge1xuICB2YXIgYWN0b3JSZWZPclN0cmluZyA9IGlzRnVuY3Rpb24oYWN0aW9uLmFjdGl2aXR5KSA/IGFjdGlvbi5hY3Rpdml0eShjb250ZXh0LCBfZXZlbnQuZGF0YSkgOiBhY3Rpb24uYWN0aXZpdHk7XG4gIHZhciByZXNvbHZlZEFjdG9yUmVmID0gdHlwZW9mIGFjdG9yUmVmT3JTdHJpbmcgPT09ICdzdHJpbmcnID8ge1xuICAgIGlkOiBhY3RvclJlZk9yU3RyaW5nXG4gIH0gOiBhY3RvclJlZk9yU3RyaW5nO1xuICB2YXIgYWN0aW9uT2JqZWN0ID0ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLlN0b3AsXG4gICAgYWN0aXZpdHk6IHJlc29sdmVkQWN0b3JSZWZcbiAgfTtcbiAgcmV0dXJuIGFjdGlvbk9iamVjdDtcbn1cbi8qKlxyXG4gKiBVcGRhdGVzIHRoZSBjdXJyZW50IGNvbnRleHQgb2YgdGhlIG1hY2hpbmUuXHJcbiAqXHJcbiAqIEBwYXJhbSBhc3NpZ25tZW50IEFuIG9iamVjdCB0aGF0IHJlcHJlc2VudHMgdGhlIHBhcnRpYWwgY29udGV4dCB0byB1cGRhdGUuXHJcbiAqL1xuXG52YXIgYXNzaWduID0gZnVuY3Rpb24gKGFzc2lnbm1lbnQpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBhc3NpZ24kMSxcbiAgICBhc3NpZ25tZW50OiBhc3NpZ25tZW50XG4gIH07XG59O1xuZnVuY3Rpb24gaXNBY3Rpb25PYmplY3QoYWN0aW9uKSB7XG4gIHJldHVybiB0eXBlb2YgYWN0aW9uID09PSAnb2JqZWN0JyAmJiAndHlwZScgaW4gYWN0aW9uO1xufVxuLyoqXHJcbiAqIFJldHVybnMgYW4gZXZlbnQgdHlwZSB0aGF0IHJlcHJlc2VudHMgYW4gaW1wbGljaXQgZXZlbnQgdGhhdFxyXG4gKiBpcyBzZW50IGFmdGVyIHRoZSBzcGVjaWZpZWQgYGRlbGF5YC5cclxuICpcclxuICogQHBhcmFtIGRlbGF5UmVmIFRoZSBkZWxheSBpbiBtaWxsaXNlY29uZHNcclxuICogQHBhcmFtIGlkIFRoZSBzdGF0ZSBub2RlIElEIHdoZXJlIHRoaXMgZXZlbnQgaXMgaGFuZGxlZFxyXG4gKi9cblxuZnVuY3Rpb24gYWZ0ZXIoZGVsYXlSZWYsIGlkKSB7XG4gIHZhciBpZFN1ZmZpeCA9IGlkID8gXCIjXCIuY29uY2F0KGlkKSA6ICcnO1xuICByZXR1cm4gXCJcIi5jb25jYXQoQWN0aW9uVHlwZXMuQWZ0ZXIsIFwiKFwiKS5jb25jYXQoZGVsYXlSZWYsIFwiKVwiKS5jb25jYXQoaWRTdWZmaXgpO1xufVxuLyoqXHJcbiAqIFJldHVybnMgYW4gZXZlbnQgdGhhdCByZXByZXNlbnRzIHRoYXQgYSBmaW5hbCBzdGF0ZSBub2RlXHJcbiAqIGhhcyBiZWVuIHJlYWNoZWQgaW4gdGhlIHBhcmVudCBzdGF0ZSBub2RlLlxyXG4gKlxyXG4gKiBAcGFyYW0gaWQgVGhlIGZpbmFsIHN0YXRlIG5vZGUncyBwYXJlbnQgc3RhdGUgbm9kZSBgaWRgXHJcbiAqIEBwYXJhbSBkYXRhIFRoZSBkYXRhIHRvIHBhc3MgaW50byB0aGUgZXZlbnRcclxuICovXG5cbmZ1bmN0aW9uIGRvbmUoaWQsIGRhdGEpIHtcbiAgdmFyIHR5cGUgPSBcIlwiLmNvbmNhdChBY3Rpb25UeXBlcy5Eb25lU3RhdGUsIFwiLlwiKS5jb25jYXQoaWQpO1xuICB2YXIgZXZlbnRPYmplY3QgPSB7XG4gICAgdHlwZTogdHlwZSxcbiAgICBkYXRhOiBkYXRhXG4gIH07XG5cbiAgZXZlbnRPYmplY3QudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHR5cGU7XG4gIH07XG5cbiAgcmV0dXJuIGV2ZW50T2JqZWN0O1xufVxuLyoqXHJcbiAqIFJldHVybnMgYW4gZXZlbnQgdGhhdCByZXByZXNlbnRzIHRoYXQgYW4gaW52b2tlZCBzZXJ2aWNlIGhhcyB0ZXJtaW5hdGVkLlxyXG4gKlxyXG4gKiBBbiBpbnZva2VkIHNlcnZpY2UgaXMgdGVybWluYXRlZCB3aGVuIGl0IGhhcyByZWFjaGVkIGEgdG9wLWxldmVsIGZpbmFsIHN0YXRlIG5vZGUsXHJcbiAqIGJ1dCBub3Qgd2hlbiBpdCBpcyBjYW5jZWxlZC5cclxuICpcclxuICogQHBhcmFtIGlkIFRoZSBmaW5hbCBzdGF0ZSBub2RlIElEXHJcbiAqIEBwYXJhbSBkYXRhIFRoZSBkYXRhIHRvIHBhc3MgaW50byB0aGUgZXZlbnRcclxuICovXG5cbmZ1bmN0aW9uIGRvbmVJbnZva2UoaWQsIGRhdGEpIHtcbiAgdmFyIHR5cGUgPSBcIlwiLmNvbmNhdChBY3Rpb25UeXBlcy5Eb25lSW52b2tlLCBcIi5cIikuY29uY2F0KGlkKTtcbiAgdmFyIGV2ZW50T2JqZWN0ID0ge1xuICAgIHR5cGU6IHR5cGUsXG4gICAgZGF0YTogZGF0YVxuICB9O1xuXG4gIGV2ZW50T2JqZWN0LnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0eXBlO1xuICB9O1xuXG4gIHJldHVybiBldmVudE9iamVjdDtcbn1cbmZ1bmN0aW9uIGVycm9yKGlkLCBkYXRhKSB7XG4gIHZhciB0eXBlID0gXCJcIi5jb25jYXQoQWN0aW9uVHlwZXMuRXJyb3JQbGF0Zm9ybSwgXCIuXCIpLmNvbmNhdChpZCk7XG4gIHZhciBldmVudE9iamVjdCA9IHtcbiAgICB0eXBlOiB0eXBlLFxuICAgIGRhdGE6IGRhdGFcbiAgfTtcblxuICBldmVudE9iamVjdC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdHlwZTtcbiAgfTtcblxuICByZXR1cm4gZXZlbnRPYmplY3Q7XG59XG5mdW5jdGlvbiBwdXJlKGdldEFjdGlvbnMpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5QdXJlLFxuICAgIGdldDogZ2V0QWN0aW9uc1xuICB9O1xufVxuLyoqXHJcbiAqIEZvcndhcmRzIChzZW5kcykgYW4gZXZlbnQgdG8gYSBzcGVjaWZpZWQgc2VydmljZS5cclxuICpcclxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IHNlcnZpY2UgdG8gZm9yd2FyZCB0aGUgZXZlbnQgdG8uXHJcbiAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgdG8gcGFzcyBpbnRvIHRoZSBzZW5kIGFjdGlvbiBjcmVhdG9yLlxyXG4gKi9cblxuZnVuY3Rpb24gZm9yd2FyZFRvKHRhcmdldCwgb3B0aW9ucykge1xuICBpZiAoIUlTX1BST0RVQ1RJT04gJiYgKCF0YXJnZXQgfHwgdHlwZW9mIHRhcmdldCA9PT0gJ2Z1bmN0aW9uJykpIHtcbiAgICB2YXIgb3JpZ2luYWxUYXJnZXRfMSA9IHRhcmdldDtcblxuICAgIHRhcmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBhcmdzID0gW107XG5cbiAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIGFyZ3NbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlc29sdmVkVGFyZ2V0ID0gdHlwZW9mIG9yaWdpbmFsVGFyZ2V0XzEgPT09ICdmdW5jdGlvbicgPyBvcmlnaW5hbFRhcmdldF8xLmFwcGx5KHZvaWQgMCwgX19zcHJlYWRBcnJheShbXSwgX19yZWFkKGFyZ3MpLCBmYWxzZSkpIDogb3JpZ2luYWxUYXJnZXRfMTtcblxuICAgICAgaWYgKCFyZXNvbHZlZFRhcmdldCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBdHRlbXB0ZWQgdG8gZm9yd2FyZCBldmVudCB0byB1bmRlZmluZWQgYWN0b3IuIFRoaXMgcmlza3MgYW4gaW5maW5pdGUgbG9vcCBpbiB0aGUgc2VuZGVyLlwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc29sdmVkVGFyZ2V0O1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gc2VuZChmdW5jdGlvbiAoXywgZXZlbnQpIHtcbiAgICByZXR1cm4gZXZlbnQ7XG4gIH0sIF9fYXNzaWduKF9fYXNzaWduKHt9LCBvcHRpb25zKSwge1xuICAgIHRvOiB0YXJnZXRcbiAgfSkpO1xufVxuLyoqXHJcbiAqIEVzY2FsYXRlcyBhbiBlcnJvciBieSBzZW5kaW5nIGl0IGFzIGFuIGV2ZW50IHRvIHRoaXMgbWFjaGluZSdzIHBhcmVudC5cclxuICpcclxuICogQHBhcmFtIGVycm9yRGF0YSBUaGUgZXJyb3IgZGF0YSB0byBzZW5kLCBvciB0aGUgZXhwcmVzc2lvbiBmdW5jdGlvbiB0aGF0XHJcbiAqIHRha2VzIGluIHRoZSBgY29udGV4dGAsIGBldmVudGAsIGFuZCBgbWV0YWAsIGFuZCByZXR1cm5zIHRoZSBlcnJvciBkYXRhIHRvIHNlbmQuXHJcbiAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgdG8gcGFzcyBpbnRvIHRoZSBzZW5kIGFjdGlvbiBjcmVhdG9yLlxyXG4gKi9cblxuZnVuY3Rpb24gZXNjYWxhdGUoZXJyb3JEYXRhLCBvcHRpb25zKSB7XG4gIHJldHVybiBzZW5kUGFyZW50KGZ1bmN0aW9uIChjb250ZXh0LCBldmVudCwgbWV0YSkge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiBlcnJvciQxLFxuICAgICAgZGF0YTogaXNGdW5jdGlvbihlcnJvckRhdGEpID8gZXJyb3JEYXRhKGNvbnRleHQsIGV2ZW50LCBtZXRhKSA6IGVycm9yRGF0YVxuICAgIH07XG4gIH0sIF9fYXNzaWduKF9fYXNzaWduKHt9LCBvcHRpb25zKSwge1xuICAgIHRvOiBTcGVjaWFsVGFyZ2V0cy5QYXJlbnRcbiAgfSkpO1xufVxuZnVuY3Rpb24gY2hvb3NlKGNvbmRzKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuQ2hvb3NlLFxuICAgIGNvbmRzOiBjb25kc1xuICB9O1xufVxuXG52YXIgcGx1Y2tBc3NpZ25zID0gZnVuY3Rpb24gKGFjdGlvbkJsb2Nrcykge1xuICB2YXIgZV8xLCBfYTtcblxuICB2YXIgYXNzaWduQWN0aW9ucyA9IFtdO1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgYWN0aW9uQmxvY2tzXzEgPSBfX3ZhbHVlcyhhY3Rpb25CbG9ja3MpLCBhY3Rpb25CbG9ja3NfMV8xID0gYWN0aW9uQmxvY2tzXzEubmV4dCgpOyAhYWN0aW9uQmxvY2tzXzFfMS5kb25lOyBhY3Rpb25CbG9ja3NfMV8xID0gYWN0aW9uQmxvY2tzXzEubmV4dCgpKSB7XG4gICAgICB2YXIgYmxvY2sgPSBhY3Rpb25CbG9ja3NfMV8xLnZhbHVlO1xuICAgICAgdmFyIGkgPSAwO1xuXG4gICAgICB3aGlsZSAoaSA8IGJsb2NrLmFjdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgIGlmIChibG9jay5hY3Rpb25zW2ldLnR5cGUgPT09IGFzc2lnbiQxKSB7XG4gICAgICAgICAgYXNzaWduQWN0aW9ucy5wdXNoKGJsb2NrLmFjdGlvbnNbaV0pO1xuICAgICAgICAgIGJsb2NrLmFjdGlvbnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZV8xXzEpIHtcbiAgICBlXzEgPSB7XG4gICAgICBlcnJvcjogZV8xXzFcbiAgICB9O1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoYWN0aW9uQmxvY2tzXzFfMSAmJiAhYWN0aW9uQmxvY2tzXzFfMS5kb25lICYmIChfYSA9IGFjdGlvbkJsb2Nrc18xLnJldHVybikpIF9hLmNhbGwoYWN0aW9uQmxvY2tzXzEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGFzc2lnbkFjdGlvbnM7XG59O1xuXG5mdW5jdGlvbiByZXNvbHZlQWN0aW9ucyhtYWNoaW5lLCBjdXJyZW50U3RhdGUsIGN1cnJlbnRDb250ZXh0LCBfZXZlbnQsIGFjdGlvbkJsb2NrcywgcHJlZGljdGFibGVFeGVjLCBwcmVzZXJ2ZUFjdGlvbk9yZGVyKSB7XG4gIGlmIChwcmVzZXJ2ZUFjdGlvbk9yZGVyID09PSB2b2lkIDApIHtcbiAgICBwcmVzZXJ2ZUFjdGlvbk9yZGVyID0gZmFsc2U7XG4gIH1cblxuICB2YXIgYXNzaWduQWN0aW9ucyA9IHByZXNlcnZlQWN0aW9uT3JkZXIgPyBbXSA6IHBsdWNrQXNzaWducyhhY3Rpb25CbG9ja3MpO1xuICB2YXIgdXBkYXRlZENvbnRleHQgPSBhc3NpZ25BY3Rpb25zLmxlbmd0aCA/IHVwZGF0ZUNvbnRleHQoY3VycmVudENvbnRleHQsIF9ldmVudCwgYXNzaWduQWN0aW9ucywgY3VycmVudFN0YXRlKSA6IGN1cnJlbnRDb250ZXh0O1xuICB2YXIgcHJlc2VydmVkQ29udGV4dHMgPSBwcmVzZXJ2ZUFjdGlvbk9yZGVyID8gW2N1cnJlbnRDb250ZXh0XSA6IHVuZGVmaW5lZDtcbiAgdmFyIGRlZmVycmVkVG9CbG9ja0VuZCA9IFtdO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUFjdGlvbihibG9ja1R5cGUsIGFjdGlvbk9iamVjdCkge1xuICAgIHZhciBfYTtcblxuICAgIHN3aXRjaCAoYWN0aW9uT2JqZWN0LnR5cGUpIHtcbiAgICAgIGNhc2UgcmFpc2UkMTpcbiAgICAgICAge1xuICAgICAgICAgIHZhciByYWlzZWRBY3Rpb24gPSByZXNvbHZlUmFpc2UoYWN0aW9uT2JqZWN0LCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50LCBtYWNoaW5lLm9wdGlvbnMuZGVsYXlzKTtcblxuICAgICAgICAgIGlmIChwcmVkaWN0YWJsZUV4ZWMgJiYgdHlwZW9mIHJhaXNlZEFjdGlvbi5kZWxheSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHByZWRpY3RhYmxlRXhlYyhyYWlzZWRBY3Rpb24sIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiByYWlzZWRBY3Rpb247XG4gICAgICAgIH1cblxuICAgICAgY2FzZSBzZW5kJDE6XG4gICAgICAgIHZhciBzZW5kQWN0aW9uID0gcmVzb2x2ZVNlbmQoYWN0aW9uT2JqZWN0LCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50LCBtYWNoaW5lLm9wdGlvbnMuZGVsYXlzKTsgLy8gVE9ETzogZml4IEFjdGlvblR5cGVzLkluaXRcblxuICAgICAgICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICAgICAgICB2YXIgY29uZmlndXJlZERlbGF5ID0gYWN0aW9uT2JqZWN0LmRlbGF5OyAvLyB3YXJuIGFmdGVyIHJlc29sdmluZyBhcyB3ZSBjYW4gY3JlYXRlIGJldHRlciBjb250ZXh0dWFsIG1lc3NhZ2UgaGVyZVxuXG4gICAgICAgICAgd2FybighaXNTdHJpbmcoY29uZmlndXJlZERlbGF5KSB8fCB0eXBlb2Ygc2VuZEFjdGlvbi5kZWxheSA9PT0gJ251bWJlcicsIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICAgICAgICBcIk5vIGRlbGF5IHJlZmVyZW5jZSBmb3IgZGVsYXkgZXhwcmVzc2lvbiAnXCIuY29uY2F0KGNvbmZpZ3VyZWREZWxheSwgXCInIHdhcyBmb3VuZCBvbiBtYWNoaW5lICdcIikuY29uY2F0KG1hY2hpbmUuaWQsIFwiJ1wiKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJlZGljdGFibGVFeGVjICYmIHNlbmRBY3Rpb24udG8gIT09IFNwZWNpYWxUYXJnZXRzLkludGVybmFsKSB7XG4gICAgICAgICAgaWYgKGJsb2NrVHlwZSA9PT0gJ2VudHJ5Jykge1xuICAgICAgICAgICAgZGVmZXJyZWRUb0Jsb2NrRW5kLnB1c2goc2VuZEFjdGlvbik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByZWRpY3RhYmxlRXhlYyhzZW5kQWN0aW9uLCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VuZEFjdGlvbjtcblxuICAgICAgY2FzZSBsb2ckMTpcbiAgICAgICAge1xuICAgICAgICAgIHZhciByZXNvbHZlZCA9IHJlc29sdmVMb2coYWN0aW9uT2JqZWN0LCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50KTtcbiAgICAgICAgICBwcmVkaWN0YWJsZUV4ZWMgPT09IG51bGwgfHwgcHJlZGljdGFibGVFeGVjID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwcmVkaWN0YWJsZUV4ZWMocmVzb2x2ZWQsIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQpO1xuICAgICAgICAgIHJldHVybiByZXNvbHZlZDtcbiAgICAgICAgfVxuXG4gICAgICBjYXNlIGNob29zZSQxOlxuICAgICAgICB7XG4gICAgICAgICAgdmFyIGNob29zZUFjdGlvbiA9IGFjdGlvbk9iamVjdDtcbiAgICAgICAgICB2YXIgbWF0Y2hlZEFjdGlvbnMgPSAoX2EgPSBjaG9vc2VBY3Rpb24uY29uZHMuZmluZChmdW5jdGlvbiAoY29uZGl0aW9uKSB7XG4gICAgICAgICAgICB2YXIgZ3VhcmQgPSB0b0d1YXJkKGNvbmRpdGlvbi5jb25kLCBtYWNoaW5lLm9wdGlvbnMuZ3VhcmRzKTtcbiAgICAgICAgICAgIHJldHVybiAhZ3VhcmQgfHwgZXZhbHVhdGVHdWFyZChtYWNoaW5lLCBndWFyZCwgdXBkYXRlZENvbnRleHQsIF9ldmVudCwgIXByZWRpY3RhYmxlRXhlYyA/IGN1cnJlbnRTdGF0ZSA6IHVuZGVmaW5lZCk7XG4gICAgICAgICAgfSkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5hY3Rpb25zO1xuXG4gICAgICAgICAgaWYgKCFtYXRjaGVkQWN0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBfYiA9IF9fcmVhZChyZXNvbHZlQWN0aW9ucyhtYWNoaW5lLCBjdXJyZW50U3RhdGUsIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQsIFt7XG4gICAgICAgICAgICB0eXBlOiBibG9ja1R5cGUsXG4gICAgICAgICAgICBhY3Rpb25zOiB0b0FjdGlvbk9iamVjdHModG9BcnJheShtYXRjaGVkQWN0aW9ucyksIG1hY2hpbmUub3B0aW9ucy5hY3Rpb25zKVxuICAgICAgICAgIH1dLCBwcmVkaWN0YWJsZUV4ZWMsIHByZXNlcnZlQWN0aW9uT3JkZXIpLCAyKSxcbiAgICAgICAgICAgICAgcmVzb2x2ZWRBY3Rpb25zRnJvbUNob29zZSA9IF9iWzBdLFxuICAgICAgICAgICAgICByZXNvbHZlZENvbnRleHRGcm9tQ2hvb3NlID0gX2JbMV07XG5cbiAgICAgICAgICB1cGRhdGVkQ29udGV4dCA9IHJlc29sdmVkQ29udGV4dEZyb21DaG9vc2U7XG4gICAgICAgICAgcHJlc2VydmVkQ29udGV4dHMgPT09IG51bGwgfHwgcHJlc2VydmVkQ29udGV4dHMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHByZXNlcnZlZENvbnRleHRzLnB1c2godXBkYXRlZENvbnRleHQpO1xuICAgICAgICAgIHJldHVybiByZXNvbHZlZEFjdGlvbnNGcm9tQ2hvb3NlO1xuICAgICAgICB9XG5cbiAgICAgIGNhc2UgcHVyZSQxOlxuICAgICAgICB7XG4gICAgICAgICAgdmFyIG1hdGNoZWRBY3Rpb25zID0gYWN0aW9uT2JqZWN0LmdldCh1cGRhdGVkQ29udGV4dCwgX2V2ZW50LmRhdGEpO1xuXG4gICAgICAgICAgaWYgKCFtYXRjaGVkQWN0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBfYyA9IF9fcmVhZChyZXNvbHZlQWN0aW9ucyhtYWNoaW5lLCBjdXJyZW50U3RhdGUsIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQsIFt7XG4gICAgICAgICAgICB0eXBlOiBibG9ja1R5cGUsXG4gICAgICAgICAgICBhY3Rpb25zOiB0b0FjdGlvbk9iamVjdHModG9BcnJheShtYXRjaGVkQWN0aW9ucyksIG1hY2hpbmUub3B0aW9ucy5hY3Rpb25zKVxuICAgICAgICAgIH1dLCBwcmVkaWN0YWJsZUV4ZWMsIHByZXNlcnZlQWN0aW9uT3JkZXIpLCAyKSxcbiAgICAgICAgICAgICAgcmVzb2x2ZWRBY3Rpb25zRnJvbVB1cmUgPSBfY1swXSxcbiAgICAgICAgICAgICAgcmVzb2x2ZWRDb250ZXh0ID0gX2NbMV07XG5cbiAgICAgICAgICB1cGRhdGVkQ29udGV4dCA9IHJlc29sdmVkQ29udGV4dDtcbiAgICAgICAgICBwcmVzZXJ2ZWRDb250ZXh0cyA9PT0gbnVsbCB8fCBwcmVzZXJ2ZWRDb250ZXh0cyA9PT0gdm9pZCAwID8gdm9pZCAwIDogcHJlc2VydmVkQ29udGV4dHMucHVzaCh1cGRhdGVkQ29udGV4dCk7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmVkQWN0aW9uc0Zyb21QdXJlO1xuICAgICAgICB9XG5cbiAgICAgIGNhc2Ugc3RvcCQxOlxuICAgICAgICB7XG4gICAgICAgICAgdmFyIHJlc29sdmVkID0gcmVzb2x2ZVN0b3AoYWN0aW9uT2JqZWN0LCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50KTtcbiAgICAgICAgICBwcmVkaWN0YWJsZUV4ZWMgPT09IG51bGwgfHwgcHJlZGljdGFibGVFeGVjID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwcmVkaWN0YWJsZUV4ZWMocmVzb2x2ZWQsIGN1cnJlbnRDb250ZXh0LCBfZXZlbnQpO1xuICAgICAgICAgIHJldHVybiByZXNvbHZlZDtcbiAgICAgICAgfVxuXG4gICAgICBjYXNlIGFzc2lnbiQxOlxuICAgICAgICB7XG4gICAgICAgICAgdXBkYXRlZENvbnRleHQgPSB1cGRhdGVDb250ZXh0KHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQsIFthY3Rpb25PYmplY3RdLCAhcHJlZGljdGFibGVFeGVjID8gY3VycmVudFN0YXRlIDogdW5kZWZpbmVkKTtcbiAgICAgICAgICBwcmVzZXJ2ZWRDb250ZXh0cyA9PT0gbnVsbCB8fCBwcmVzZXJ2ZWRDb250ZXh0cyA9PT0gdm9pZCAwID8gdm9pZCAwIDogcHJlc2VydmVkQ29udGV4dHMucHVzaCh1cGRhdGVkQ29udGV4dCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdmFyIHJlc29sdmVkQWN0aW9uT2JqZWN0ID0gdG9BY3Rpb25PYmplY3QoYWN0aW9uT2JqZWN0LCBtYWNoaW5lLm9wdGlvbnMuYWN0aW9ucyk7XG4gICAgICAgIHZhciBleGVjXzEgPSByZXNvbHZlZEFjdGlvbk9iamVjdC5leGVjO1xuXG4gICAgICAgIGlmIChwcmVkaWN0YWJsZUV4ZWMpIHtcbiAgICAgICAgICBwcmVkaWN0YWJsZUV4ZWMocmVzb2x2ZWRBY3Rpb25PYmplY3QsIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQpO1xuICAgICAgICB9IGVsc2UgaWYgKGV4ZWNfMSAmJiBwcmVzZXJ2ZWRDb250ZXh0cykge1xuICAgICAgICAgIHZhciBjb250ZXh0SW5kZXhfMSA9IHByZXNlcnZlZENvbnRleHRzLmxlbmd0aCAtIDE7XG5cbiAgICAgICAgICB2YXIgd3JhcHBlZCA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCByZXNvbHZlZEFjdGlvbk9iamVjdCksIHtcbiAgICAgICAgICAgIGV4ZWM6IGZ1bmN0aW9uIChfY3R4KSB7XG4gICAgICAgICAgICAgIHZhciBhcmdzID0gW107XG5cbiAgICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICBhcmdzW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgZXhlY18xLmFwcGx5KHZvaWQgMCwgX19zcHJlYWRBcnJheShbcHJlc2VydmVkQ29udGV4dHNbY29udGV4dEluZGV4XzFdXSwgX19yZWFkKGFyZ3MpLCBmYWxzZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmVzb2x2ZWRBY3Rpb25PYmplY3QgPSB3cmFwcGVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc29sdmVkQWN0aW9uT2JqZWN0O1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHByb2Nlc3NCbG9jayhibG9jaykge1xuICAgIHZhciBlXzIsIF9hO1xuXG4gICAgdmFyIHJlc29sdmVkQWN0aW9ucyA9IFtdO1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9iID0gX192YWx1ZXMoYmxvY2suYWN0aW9ucyksIF9jID0gX2IubmV4dCgpOyAhX2MuZG9uZTsgX2MgPSBfYi5uZXh0KCkpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IF9jLnZhbHVlO1xuICAgICAgICB2YXIgcmVzb2x2ZWQgPSBoYW5kbGVBY3Rpb24oYmxvY2sudHlwZSwgYWN0aW9uKTtcblxuICAgICAgICBpZiAocmVzb2x2ZWQpIHtcbiAgICAgICAgICByZXNvbHZlZEFjdGlvbnMgPSByZXNvbHZlZEFjdGlvbnMuY29uY2F0KHJlc29sdmVkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfMl8xKSB7XG4gICAgICBlXzIgPSB7XG4gICAgICAgIGVycm9yOiBlXzJfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKF9jICYmICFfYy5kb25lICYmIChfYSA9IF9iLnJldHVybikpIF9hLmNhbGwoX2IpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfMikgdGhyb3cgZV8yLmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIGRlZmVycmVkVG9CbG9ja0VuZC5mb3JFYWNoKGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgIHByZWRpY3RhYmxlRXhlYyhhY3Rpb24sIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQpO1xuICAgIH0pO1xuICAgIGRlZmVycmVkVG9CbG9ja0VuZC5sZW5ndGggPSAwO1xuICAgIHJldHVybiByZXNvbHZlZEFjdGlvbnM7XG4gIH1cblxuICB2YXIgcmVzb2x2ZWRBY3Rpb25zID0gZmxhdHRlbihhY3Rpb25CbG9ja3MubWFwKHByb2Nlc3NCbG9jaykpO1xuICByZXR1cm4gW3Jlc29sdmVkQWN0aW9ucywgdXBkYXRlZENvbnRleHRdO1xufVxuXG5leHBvcnQgeyBhZnRlciwgYXNzaWduLCBjYW5jZWwsIGNob29zZSwgZG9uZSwgZG9uZUludm9rZSwgZXJyb3IsIGVzY2FsYXRlLCBmb3J3YXJkVG8sIGdldEFjdGlvbkZ1bmN0aW9uLCBpbml0RXZlbnQsIGlzQWN0aW9uT2JqZWN0LCBsb2csIHB1cmUsIHJhaXNlLCByZXNvbHZlQWN0aW9ucywgcmVzb2x2ZUxvZywgcmVzb2x2ZVJhaXNlLCByZXNvbHZlU2VuZCwgcmVzb2x2ZVN0b3AsIHJlc3BvbmQsIHNlbmQsIHNlbmRQYXJlbnQsIHNlbmRUbywgc2VuZFVwZGF0ZSwgc3RhcnQsIHN0b3AsIHRvQWN0aW9uT2JqZWN0LCB0b0FjdGlvbk9iamVjdHMsIHRvQWN0aXZpdHlEZWZpbml0aW9uIH07XG4iLCJpbXBvcnQgeyBlcnJvciwgZG9uZUludm9rZSB9IGZyb20gJy4vYWN0aW9ucy5qcyc7XG5pbXBvcnQgeyB0b0FjdG9yUmVmIH0gZnJvbSAnLi9BY3Rvci5qcyc7XG5pbXBvcnQgeyB0b09ic2VydmVyIH0gZnJvbSAnLi91dGlscy5qcyc7XG5cbi8qKlxyXG4gKiBSZXR1cm5zIGFuIGFjdG9yIGJlaGF2aW9yIGZyb20gYSByZWR1Y2VyIGFuZCBpdHMgaW5pdGlhbCBzdGF0ZS5cclxuICpcclxuICogQHBhcmFtIHRyYW5zaXRpb24gVGhlIHB1cmUgcmVkdWNlciB0aGF0IHJldHVybnMgdGhlIG5leHQgc3RhdGUgZ2l2ZW4gdGhlIGN1cnJlbnQgc3RhdGUgYW5kIGV2ZW50LlxyXG4gKiBAcGFyYW0gaW5pdGlhbFN0YXRlIFRoZSBpbml0aWFsIHN0YXRlIG9mIHRoZSByZWR1Y2VyLlxyXG4gKiBAcmV0dXJucyBBbiBhY3RvciBiZWhhdmlvclxyXG4gKi9cblxuZnVuY3Rpb24gZnJvbVJlZHVjZXIodHJhbnNpdGlvbiwgaW5pdGlhbFN0YXRlKSB7XG4gIHJldHVybiB7XG4gICAgdHJhbnNpdGlvbjogdHJhbnNpdGlvbixcbiAgICBpbml0aWFsU3RhdGU6IGluaXRpYWxTdGF0ZVxuICB9O1xufVxuZnVuY3Rpb24gZnJvbVByb21pc2UocHJvbWlzZUZuKSB7XG4gIHZhciBpbml0aWFsU3RhdGUgPSB7XG4gICAgZXJyb3I6IHVuZGVmaW5lZCxcbiAgICBkYXRhOiB1bmRlZmluZWQsXG4gICAgc3RhdHVzOiAncGVuZGluZydcbiAgfTtcbiAgcmV0dXJuIHtcbiAgICB0cmFuc2l0aW9uOiBmdW5jdGlvbiAoc3RhdGUsIGV2ZW50LCBfYSkge1xuICAgICAgdmFyIHBhcmVudCA9IF9hLnBhcmVudCxcbiAgICAgICAgICBpZCA9IF9hLmlkLFxuICAgICAgICAgIG9ic2VydmVycyA9IF9hLm9ic2VydmVycztcblxuICAgICAgc3dpdGNoIChldmVudC50eXBlKSB7XG4gICAgICAgIGNhc2UgJ2Z1bGZpbGwnOlxuICAgICAgICAgIHBhcmVudCA9PT0gbnVsbCB8fCBwYXJlbnQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHBhcmVudC5zZW5kKGRvbmVJbnZva2UoaWQsIGV2ZW50LmRhdGEpKTtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZXJyb3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGRhdGE6IGV2ZW50LmRhdGEsXG4gICAgICAgICAgICBzdGF0dXM6ICdmdWxmaWxsZWQnXG4gICAgICAgICAgfTtcblxuICAgICAgICBjYXNlICdyZWplY3QnOlxuICAgICAgICAgIHBhcmVudCA9PT0gbnVsbCB8fCBwYXJlbnQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHBhcmVudC5zZW5kKGVycm9yKGlkLCBldmVudC5lcnJvcikpO1xuICAgICAgICAgIG9ic2VydmVycy5mb3JFYWNoKGZ1bmN0aW9uIChvYnNlcnZlcikge1xuICAgICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IoZXZlbnQuZXJyb3IpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlcnJvcjogZXZlbnQuZXJyb3IsXG4gICAgICAgICAgICBkYXRhOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBzdGF0dXM6ICdyZWplY3RlZCdcbiAgICAgICAgICB9O1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgfVxuICAgIH0sXG4gICAgaW5pdGlhbFN0YXRlOiBpbml0aWFsU3RhdGUsXG4gICAgc3RhcnQ6IGZ1bmN0aW9uIChfYSkge1xuICAgICAgdmFyIHNlbGYgPSBfYS5zZWxmO1xuICAgICAgcHJvbWlzZUZuKCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBzZWxmLnNlbmQoe1xuICAgICAgICAgIHR5cGU6ICdmdWxmaWxsJyxcbiAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgIH0pO1xuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICBzZWxmLnNlbmQoe1xuICAgICAgICAgIHR5cGU6ICdyZWplY3QnLFxuICAgICAgICAgIGVycm9yOiByZWFzb25cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBpbml0aWFsU3RhdGU7XG4gICAgfVxuICB9O1xufVxuZnVuY3Rpb24gc3Bhd25CZWhhdmlvcihiZWhhdmlvciwgb3B0aW9ucykge1xuICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgdmFyIHN0YXRlID0gYmVoYXZpb3IuaW5pdGlhbFN0YXRlO1xuICB2YXIgb2JzZXJ2ZXJzID0gbmV3IFNldCgpO1xuICB2YXIgbWFpbGJveCA9IFtdO1xuICB2YXIgZmx1c2hpbmcgPSBmYWxzZTtcblxuICB2YXIgZmx1c2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGZsdXNoaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZmx1c2hpbmcgPSB0cnVlO1xuXG4gICAgd2hpbGUgKG1haWxib3gubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIGV2ZW50XzEgPSBtYWlsYm94LnNoaWZ0KCk7XG4gICAgICBzdGF0ZSA9IGJlaGF2aW9yLnRyYW5zaXRpb24oc3RhdGUsIGV2ZW50XzEsIGFjdG9yQ3R4KTtcbiAgICAgIG9ic2VydmVycy5mb3JFYWNoKGZ1bmN0aW9uIChvYnNlcnZlcikge1xuICAgICAgICByZXR1cm4gb2JzZXJ2ZXIubmV4dChzdGF0ZSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmbHVzaGluZyA9IGZhbHNlO1xuICB9O1xuXG4gIHZhciBhY3RvciA9IHRvQWN0b3JSZWYoe1xuICAgIGlkOiBvcHRpb25zLmlkLFxuICAgIHNlbmQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbWFpbGJveC5wdXNoKGV2ZW50KTtcbiAgICAgIGZsdXNoKCk7XG4gICAgfSxcbiAgICBnZXRTbmFwc2hvdDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH0sXG4gICAgc3Vic2NyaWJlOiBmdW5jdGlvbiAobmV4dCwgaGFuZGxlRXJyb3IsIGNvbXBsZXRlKSB7XG4gICAgICB2YXIgb2JzZXJ2ZXIgPSB0b09ic2VydmVyKG5leHQsIGhhbmRsZUVycm9yLCBjb21wbGV0ZSk7XG4gICAgICBvYnNlcnZlcnMuYWRkKG9ic2VydmVyKTtcbiAgICAgIG9ic2VydmVyLm5leHQoc3RhdGUpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBvYnNlcnZlcnMuZGVsZXRlKG9ic2VydmVyKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH0pO1xuICB2YXIgYWN0b3JDdHggPSB7XG4gICAgcGFyZW50OiBvcHRpb25zLnBhcmVudCxcbiAgICBzZWxmOiBhY3RvcixcbiAgICBpZDogb3B0aW9ucy5pZCB8fCAnYW5vbnltb3VzJyxcbiAgICBvYnNlcnZlcnM6IG9ic2VydmVyc1xuICB9O1xuICBzdGF0ZSA9IGJlaGF2aW9yLnN0YXJ0ID8gYmVoYXZpb3Iuc3RhcnQoYWN0b3JDdHgpIDogc3RhdGU7XG4gIHJldHVybiBhY3Rvcjtcbn1cblxuZXhwb3J0IHsgZnJvbVByb21pc2UsIGZyb21SZWR1Y2VyLCBzcGF3bkJlaGF2aW9yIH07XG4iLCJ2YXIgU1RBVEVfREVMSU1JVEVSID0gJy4nO1xudmFyIEVNUFRZX0FDVElWSVRZX01BUCA9IHt9O1xudmFyIERFRkFVTFRfR1VBUkRfVFlQRSA9ICd4c3RhdGUuZ3VhcmQnO1xudmFyIFRBUkdFVExFU1NfS0VZID0gJyc7XG5cbmV4cG9ydCB7IERFRkFVTFRfR1VBUkRfVFlQRSwgRU1QVFlfQUNUSVZJVFlfTUFQLCBTVEFURV9ERUxJTUlURVIsIFRBUkdFVExFU1NfS0VZIH07XG4iLCJpbXBvcnQgeyBJU19QUk9EVUNUSU9OIH0gZnJvbSAnLi9lbnZpcm9ubWVudC5qcyc7XG5cbmZ1bmN0aW9uIGdldEdsb2JhbCgpIHtcbiAgaWYgKHR5cGVvZiBnbG9iYWxUaGlzICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBnbG9iYWxUaGlzO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBzZWxmO1xuICB9XG5cbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIHdpbmRvdztcbiAgfVxuXG4gIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBnbG9iYWw7XG4gIH1cblxuICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICBjb25zb2xlLndhcm4oJ1hTdGF0ZSBjb3VsZCBub3QgZmluZCBhIGdsb2JhbCBvYmplY3QgaW4gdGhpcyBlbnZpcm9ubWVudC4gUGxlYXNlIGxldCB0aGUgbWFpbnRhaW5lcnMga25vdyBhbmQgcmFpc2UgYW4gaXNzdWUgaGVyZTogaHR0cHM6Ly9naXRodWIuY29tL3N0YXRlbHlhaS94c3RhdGUvaXNzdWVzJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0RGV2VG9vbHMoKSB7XG4gIHZhciBnbG9iYWwgPSBnZXRHbG9iYWwoKTtcblxuICBpZiAoZ2xvYmFsICYmICdfX3hzdGF0ZV9fJyBpbiBnbG9iYWwpIHtcbiAgICByZXR1cm4gZ2xvYmFsLl9feHN0YXRlX187XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiByZWdpc3RlclNlcnZpY2Uoc2VydmljZSkge1xuICBpZiAoIWdldEdsb2JhbCgpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGRldlRvb2xzID0gZ2V0RGV2VG9vbHMoKTtcblxuICBpZiAoZGV2VG9vbHMpIHtcbiAgICBkZXZUb29scy5yZWdpc3RlcihzZXJ2aWNlKTtcbiAgfVxufVxuXG5leHBvcnQgeyBnZXRHbG9iYWwsIHJlZ2lzdGVyU2VydmljZSB9O1xuIiwidmFyIElTX1BST0RVQ1RJT04gPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nO1xuXG5leHBvcnQgeyBJU19QUk9EVUNUSU9OIH07XG4iLCJpbXBvcnQgeyBhc3NpZ24gYXMgYXNzaWduJDEsIGNhbmNlbCBhcyBjYW5jZWwkMSwgc2VuZCBhcyBzZW5kJDEsIHNlbmRUbyBhcyBzZW5kVG8kMSwgc2VuZFBhcmVudCBhcyBzZW5kUGFyZW50JDEsIHNlbmRVcGRhdGUgYXMgc2VuZFVwZGF0ZSQxLCBmb3J3YXJkVG8gYXMgZm9yd2FyZFRvJDEsIGRvbmVJbnZva2UgYXMgZG9uZUludm9rZSQxLCByYWlzZSBhcyByYWlzZSQxLCBsb2cgYXMgbG9nJDEsIHB1cmUgYXMgcHVyZSQxLCBjaG9vc2UgYXMgY2hvb3NlJDEsIHN0b3AgYXMgc3RvcCQxIH0gZnJvbSAnLi9hY3Rpb25zLmpzJztcbmltcG9ydCAqIGFzIGFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zLmpzJztcbmV4cG9ydCB7IGFjdGlvbnMgfTtcbmV4cG9ydCB7IHRvQWN0b3JSZWYgfSBmcm9tICcuL0FjdG9yLmpzJztcbmV4cG9ydCB7IEludGVycHJldGVyLCBJbnRlcnByZXRlclN0YXR1cywgaW50ZXJwcmV0LCBzcGF3biB9IGZyb20gJy4vaW50ZXJwcmV0ZXIuanMnO1xuZXhwb3J0IHsgTWFjaGluZSwgY3JlYXRlTWFjaGluZSB9IGZyb20gJy4vTWFjaGluZS5qcyc7XG5leHBvcnQgeyBtYXBTdGF0ZSB9IGZyb20gJy4vbWFwU3RhdGUuanMnO1xuZXhwb3J0IHsgbWF0Y2hTdGF0ZSB9IGZyb20gJy4vbWF0Y2guanMnO1xuZXhwb3J0IHsgY3JlYXRlU2NoZW1hLCB0IH0gZnJvbSAnLi9zY2hlbWEuanMnO1xuZXhwb3J0IHsgU3RhdGUgfSBmcm9tICcuL1N0YXRlLmpzJztcbmV4cG9ydCB7IFN0YXRlTm9kZSB9IGZyb20gJy4vU3RhdGVOb2RlLmpzJztcbmV4cG9ydCB7IHNwYXduQmVoYXZpb3IgfSBmcm9tICcuL2JlaGF2aW9ycy5qcyc7XG5leHBvcnQgeyBBY3Rpb25UeXBlcywgU3BlY2lhbFRhcmdldHMgfSBmcm9tICcuL3R5cGVzLmpzJztcbmV4cG9ydCB7IG1hdGNoZXNTdGF0ZSwgdG9FdmVudE9iamVjdCwgdG9PYnNlcnZlciwgdG9TQ1hNTEV2ZW50IH0gZnJvbSAnLi91dGlscy5qcyc7XG5cbnZhciBhc3NpZ24gPSBhc3NpZ24kMSxcbiAgICBjYW5jZWwgPSBjYW5jZWwkMSxcbiAgICBzZW5kID0gc2VuZCQxLFxuICAgIHNlbmRUbyA9IHNlbmRUbyQxLFxuICAgIHNlbmRQYXJlbnQgPSBzZW5kUGFyZW50JDEsXG4gICAgc2VuZFVwZGF0ZSA9IHNlbmRVcGRhdGUkMSxcbiAgICBmb3J3YXJkVG8gPSBmb3J3YXJkVG8kMSxcbiAgICBkb25lSW52b2tlID0gZG9uZUludm9rZSQxLFxuICAgIHJhaXNlID0gcmFpc2UkMSxcbiAgICBsb2cgPSBsb2ckMSxcbiAgICBwdXJlID0gcHVyZSQxLFxuICAgIGNob29zZSA9IGNob29zZSQxLFxuICAgIHN0b3AgPSBzdG9wJDE7XG5cbmV4cG9ydCB7IGFzc2lnbiwgY2FuY2VsLCBjaG9vc2UsIGRvbmVJbnZva2UsIGZvcndhcmRUbywgbG9nLCBwdXJlLCByYWlzZSwgc2VuZCwgc2VuZFBhcmVudCwgc2VuZFRvLCBzZW5kVXBkYXRlLCBzdG9wIH07XG4iLCJpbXBvcnQgeyBfX3ZhbHVlcywgX19zcHJlYWRBcnJheSwgX19yZWFkLCBfX2Fzc2lnbiB9IGZyb20gJy4vX3ZpcnR1YWwvX3RzbGliLmpzJztcbmltcG9ydCB7IFNwZWNpYWxUYXJnZXRzLCBBY3Rpb25UeXBlcyB9IGZyb20gJy4vdHlwZXMuanMnO1xuaW1wb3J0IHsgaXNTdGF0ZUNvbmZpZywgU3RhdGUsIGJpbmRBY3Rpb25Ub1N0YXRlIH0gZnJvbSAnLi9TdGF0ZS5qcyc7XG5pbXBvcnQgeyBlcnJvclBsYXRmb3JtLCB1cGRhdGUsIGVycm9yIGFzIGVycm9yJDEsIGxvZywgc3RvcCwgc3RhcnQsIGNhbmNlbCwgc2VuZCwgcmFpc2UgfSBmcm9tICcuL2FjdGlvblR5cGVzLmpzJztcbmltcG9ydCB7IGluaXRFdmVudCwgZG9uZUludm9rZSwgdG9BY3Rpb25PYmplY3RzLCByZXNvbHZlQWN0aW9ucywgZXJyb3IsIGdldEFjdGlvbkZ1bmN0aW9uIH0gZnJvbSAnLi9hY3Rpb25zLmpzJztcbmltcG9ydCB7IElTX1BST0RVQ1RJT04gfSBmcm9tICcuL2Vudmlyb25tZW50LmpzJztcbmltcG9ydCB7IHdhcm4sIG1hcENvbnRleHQsIHRvT2JzZXJ2ZXIsIGlzRnVuY3Rpb24sIHRvU0NYTUxFdmVudCwgZmxhdHRlbiwgaXNSYWlzYWJsZUFjdGlvbiwgaXNQcm9taXNlTGlrZSwgaXNPYnNlcnZhYmxlLCBpc01hY2hpbmUsIGlzQmVoYXZpb3IsIHJlcG9ydFVuaGFuZGxlZEV4Y2VwdGlvbk9uSW52b2NhdGlvbiwgc3ltYm9sT2JzZXJ2YWJsZSwgaXNBcnJheSwgdG9FdmVudE9iamVjdCwgaXNTdHJpbmcsIGlzQWN0b3IsIHRvSW52b2tlU291cmNlLCB1bmlxdWVJZCB9IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHsgU2NoZWR1bGVyIH0gZnJvbSAnLi9zY2hlZHVsZXIuanMnO1xuaW1wb3J0IHsgY3JlYXRlRGVmZXJyZWRBY3RvciwgaXNTcGF3bmVkQWN0b3IgfSBmcm9tICcuL0FjdG9yLmpzJztcbmltcG9ydCB7IHJlZ2lzdHJ5IH0gZnJvbSAnLi9yZWdpc3RyeS5qcyc7XG5pbXBvcnQgeyBnZXRHbG9iYWwsIHJlZ2lzdGVyU2VydmljZSB9IGZyb20gJy4vZGV2VG9vbHMuanMnO1xuaW1wb3J0IHsgcHJvdmlkZSwgY29uc3VtZSB9IGZyb20gJy4vc2VydmljZVNjb3BlLmpzJztcbmltcG9ydCB7IHNwYXduQmVoYXZpb3IgfSBmcm9tICcuL2JlaGF2aW9ycy5qcyc7XG5cbnZhciBERUZBVUxUX1NQQVdOX09QVElPTlMgPSB7XG4gIHN5bmM6IGZhbHNlLFxuICBhdXRvRm9yd2FyZDogZmFsc2Vcbn07XG52YXIgSW50ZXJwcmV0ZXJTdGF0dXM7XG5cbihmdW5jdGlvbiAoSW50ZXJwcmV0ZXJTdGF0dXMpIHtcbiAgSW50ZXJwcmV0ZXJTdGF0dXNbSW50ZXJwcmV0ZXJTdGF0dXNbXCJOb3RTdGFydGVkXCJdID0gMF0gPSBcIk5vdFN0YXJ0ZWRcIjtcbiAgSW50ZXJwcmV0ZXJTdGF0dXNbSW50ZXJwcmV0ZXJTdGF0dXNbXCJSdW5uaW5nXCJdID0gMV0gPSBcIlJ1bm5pbmdcIjtcbiAgSW50ZXJwcmV0ZXJTdGF0dXNbSW50ZXJwcmV0ZXJTdGF0dXNbXCJTdG9wcGVkXCJdID0gMl0gPSBcIlN0b3BwZWRcIjtcbn0pKEludGVycHJldGVyU3RhdHVzIHx8IChJbnRlcnByZXRlclN0YXR1cyA9IHt9KSk7XG5cbnZhciBJbnRlcnByZXRlciA9XG4vKiNfX1BVUkVfXyovXG5cbi8qKiBAY2xhc3MgKi9cbmZ1bmN0aW9uICgpIHtcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhIG5ldyBJbnRlcnByZXRlciBpbnN0YW5jZSAoaS5lLiwgc2VydmljZSkgZm9yIHRoZSBnaXZlbiBtYWNoaW5lIHdpdGggdGhlIHByb3ZpZGVkIG9wdGlvbnMsIGlmIGFueS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBtYWNoaW5lIFRoZSBtYWNoaW5lIHRvIGJlIGludGVycHJldGVkXHJcbiAgICogQHBhcmFtIG9wdGlvbnMgSW50ZXJwcmV0ZXIgb3B0aW9uc1xyXG4gICAqL1xuICBmdW5jdGlvbiBJbnRlcnByZXRlcihtYWNoaW5lLCBvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgICAgb3B0aW9ucyA9IEludGVycHJldGVyLmRlZmF1bHRPcHRpb25zO1xuICAgIH1cblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB0aGlzLm1hY2hpbmUgPSBtYWNoaW5lO1xuICAgIHRoaXMuZGVsYXllZEV2ZW50c01hcCA9IHt9O1xuICAgIHRoaXMubGlzdGVuZXJzID0gbmV3IFNldCgpO1xuICAgIHRoaXMuY29udGV4dExpc3RlbmVycyA9IG5ldyBTZXQoKTtcbiAgICB0aGlzLnN0b3BMaXN0ZW5lcnMgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5kb25lTGlzdGVuZXJzID0gbmV3IFNldCgpO1xuICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnMgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5zZW5kTGlzdGVuZXJzID0gbmV3IFNldCgpO1xuICAgIC8qKlxyXG4gICAgICogV2hldGhlciB0aGUgc2VydmljZSBpcyBzdGFydGVkLlxyXG4gICAgICovXG5cbiAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgdGhpcy5zdGF0dXMgPSBJbnRlcnByZXRlclN0YXR1cy5Ob3RTdGFydGVkO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5mb3J3YXJkVG8gPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5fb3V0Z29pbmdRdWV1ZSA9IFtdO1xuICAgIC8qKlxyXG4gICAgICogQWxpYXMgZm9yIEludGVycHJldGVyLnByb3RvdHlwZS5zdGFydFxyXG4gICAgICovXG5cbiAgICB0aGlzLmluaXQgPSB0aGlzLnN0YXJ0O1xuICAgIC8qKlxyXG4gICAgICogU2VuZHMgYW4gZXZlbnQgdG8gdGhlIHJ1bm5pbmcgaW50ZXJwcmV0ZXIgdG8gdHJpZ2dlciBhIHRyYW5zaXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQW4gYXJyYXkgb2YgZXZlbnRzIChiYXRjaGVkKSBjYW4gYmUgc2VudCBhcyB3ZWxsLCB3aGljaCB3aWxsIHNlbmQgYWxsXHJcbiAgICAgKiBiYXRjaGVkIGV2ZW50cyB0byB0aGUgcnVubmluZyBpbnRlcnByZXRlci4gVGhlIGxpc3RlbmVycyB3aWxsIGJlXHJcbiAgICAgKiBub3RpZmllZCBvbmx5ICoqb25jZSoqIHdoZW4gYWxsIGV2ZW50cyBhcmUgcHJvY2Vzc2VkLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQocykgdG8gc2VuZFxyXG4gICAgICovXG5cbiAgICB0aGlzLnNlbmQgPSBmdW5jdGlvbiAoZXZlbnQsIHBheWxvYWQpIHtcbiAgICAgIGlmIChpc0FycmF5KGV2ZW50KSkge1xuICAgICAgICBfdGhpcy5iYXRjaChldmVudCk7XG5cbiAgICAgICAgcmV0dXJuIF90aGlzLnN0YXRlO1xuICAgICAgfVxuXG4gICAgICB2YXIgX2V2ZW50ID0gdG9TQ1hNTEV2ZW50KHRvRXZlbnRPYmplY3QoZXZlbnQsIHBheWxvYWQpKTtcblxuICAgICAgaWYgKF90aGlzLnN0YXR1cyA9PT0gSW50ZXJwcmV0ZXJTdGF0dXMuU3RvcHBlZCkge1xuICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgICAgIHdhcm4oZmFsc2UsIFwiRXZlbnQgXFxcIlwiLmNvbmNhdChfZXZlbnQubmFtZSwgXCJcXFwiIHdhcyBzZW50IHRvIHN0b3BwZWQgc2VydmljZSBcXFwiXCIpLmNvbmNhdChfdGhpcy5tYWNoaW5lLmlkLCBcIlxcXCIuIFRoaXMgc2VydmljZSBoYXMgYWxyZWFkeSByZWFjaGVkIGl0cyBmaW5hbCBzdGF0ZSwgYW5kIHdpbGwgbm90IHRyYW5zaXRpb24uXFxuRXZlbnQ6IFwiKS5jb25jYXQoSlNPTi5zdHJpbmdpZnkoX2V2ZW50LmRhdGEpKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gX3RoaXMuc3RhdGU7XG4gICAgICB9XG5cbiAgICAgIGlmIChfdGhpcy5zdGF0dXMgIT09IEludGVycHJldGVyU3RhdHVzLlJ1bm5pbmcgJiYgIV90aGlzLm9wdGlvbnMuZGVmZXJFdmVudHMpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXZlbnQgXFxcIlwiLmNvbmNhdChfZXZlbnQubmFtZSwgXCJcXFwiIHdhcyBzZW50IHRvIHVuaW5pdGlhbGl6ZWQgc2VydmljZSBcXFwiXCIpLmNvbmNhdChfdGhpcy5tYWNoaW5lLmlkIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICAgICAgLCBcIlxcXCIuIE1ha2Ugc3VyZSAuc3RhcnQoKSBpcyBjYWxsZWQgZm9yIHRoaXMgc2VydmljZSwgb3Igc2V0IHsgZGVmZXJFdmVudHM6IHRydWUgfSBpbiB0aGUgc2VydmljZSBvcHRpb25zLlxcbkV2ZW50OiBcIikuY29uY2F0KEpTT04uc3RyaW5naWZ5KF9ldmVudC5kYXRhKSkpO1xuICAgICAgfVxuXG4gICAgICBfdGhpcy5zY2hlZHVsZXIuc2NoZWR1bGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBGb3J3YXJkIGNvcHkgb2YgZXZlbnQgdG8gY2hpbGQgYWN0b3JzXG4gICAgICAgIF90aGlzLmZvcndhcmQoX2V2ZW50KTtcblxuICAgICAgICB2YXIgbmV4dFN0YXRlID0gX3RoaXMuX25leHRTdGF0ZShfZXZlbnQpO1xuXG4gICAgICAgIF90aGlzLnVwZGF0ZShuZXh0U3RhdGUsIF9ldmVudCk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIF90aGlzLl9zdGF0ZTsgLy8gVE9ETzogZGVwcmVjYXRlIChzaG91bGQgcmV0dXJuIHZvaWQpXG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6c2VtaWNvbG9uXG4gICAgfTtcblxuICAgIHRoaXMuc2VuZFRvID0gZnVuY3Rpb24gKGV2ZW50LCB0bywgaW1tZWRpYXRlKSB7XG4gICAgICB2YXIgaXNQYXJlbnQgPSBfdGhpcy5wYXJlbnQgJiYgKHRvID09PSBTcGVjaWFsVGFyZ2V0cy5QYXJlbnQgfHwgX3RoaXMucGFyZW50LmlkID09PSB0byk7XG4gICAgICB2YXIgdGFyZ2V0ID0gaXNQYXJlbnQgPyBfdGhpcy5wYXJlbnQgOiBpc1N0cmluZyh0bykgPyB0byA9PT0gU3BlY2lhbFRhcmdldHMuSW50ZXJuYWwgPyBfdGhpcyA6IF90aGlzLmNoaWxkcmVuLmdldCh0bykgfHwgcmVnaXN0cnkuZ2V0KHRvKSA6IGlzQWN0b3IodG8pID8gdG8gOiB1bmRlZmluZWQ7XG5cbiAgICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICAgIGlmICghaXNQYXJlbnQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmFibGUgdG8gc2VuZCBldmVudCB0byBjaGlsZCAnXCIuY29uY2F0KHRvLCBcIicgZnJvbSBzZXJ2aWNlICdcIikuY29uY2F0KF90aGlzLmlkLCBcIicuXCIpKTtcbiAgICAgICAgfSAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tY29uc29sZVxuXG5cbiAgICAgICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICAgICAgd2FybihmYWxzZSwgXCJTZXJ2aWNlICdcIi5jb25jYXQoX3RoaXMuaWQsIFwiJyBoYXMgbm8gcGFyZW50OiB1bmFibGUgdG8gc2VuZCBldmVudCBcIikuY29uY2F0KGV2ZW50LnR5cGUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCdtYWNoaW5lJyBpbiB0YXJnZXQpIHtcbiAgICAgICAgLy8gcGVyaGFwcyB0aG9zZSBldmVudHMgc2hvdWxkIGJlIHJlamVjdGVkIGluIHRoZSBwYXJlbnRcbiAgICAgICAgLy8gYnV0IGF0bSBpdCBkb2Vzbid0IGhhdmUgZWFzeSBhY2Nlc3MgdG8gYWxsIG9mIHRoZSBpbmZvcm1hdGlvbiB0aGF0IGlzIHJlcXVpcmVkIHRvIGRvIGl0IHJlbGlhYmx5XG4gICAgICAgIGlmIChfdGhpcy5zdGF0dXMgIT09IEludGVycHJldGVyU3RhdHVzLlN0b3BwZWQgfHwgX3RoaXMucGFyZW50ICE9PSB0YXJnZXQgfHwgLy8gd2UgbmVlZCB0byBzZW5kIGV2ZW50cyB0byB0aGUgcGFyZW50IGZyb20gZXhpdCBoYW5kbGVycyBvZiBhIG1hY2hpbmUgdGhhdCByZWFjaGVkIGl0cyBmaW5hbCBzdGF0ZVxuICAgICAgICBfdGhpcy5zdGF0ZS5kb25lKSB7XG4gICAgICAgICAgLy8gU2VuZCBTQ1hNTCBldmVudHMgdG8gbWFjaGluZXNcbiAgICAgICAgICB2YXIgc2N4bWxFdmVudCA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCBldmVudCksIHtcbiAgICAgICAgICAgIG5hbWU6IGV2ZW50Lm5hbWUgPT09IGVycm9yJDEgPyBcIlwiLmNvbmNhdChlcnJvcihfdGhpcy5pZCkpIDogZXZlbnQubmFtZSxcbiAgICAgICAgICAgIG9yaWdpbjogX3RoaXMuc2Vzc2lvbklkXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpZiAoIWltbWVkaWF0ZSAmJiBfdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cykge1xuICAgICAgICAgICAgX3RoaXMuX291dGdvaW5nUXVldWUucHVzaChbdGFyZ2V0LCBzY3htbEV2ZW50XSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhcmdldC5zZW5kKHNjeG1sRXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gU2VuZCBub3JtYWwgZXZlbnRzIHRvIG90aGVyIHRhcmdldHNcbiAgICAgICAgaWYgKCFpbW1lZGlhdGUgJiYgX3RoaXMubWFjaGluZS5jb25maWcucHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHMpIHtcbiAgICAgICAgICBfdGhpcy5fb3V0Z29pbmdRdWV1ZS5wdXNoKFt0YXJnZXQsIGV2ZW50LmRhdGFdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0YXJnZXQuc2VuZChldmVudC5kYXRhKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLl9leGVjID0gZnVuY3Rpb24gKGFjdGlvbiwgY29udGV4dCwgX2V2ZW50LCBhY3Rpb25GdW5jdGlvbk1hcCkge1xuICAgICAgaWYgKGFjdGlvbkZ1bmN0aW9uTWFwID09PSB2b2lkIDApIHtcbiAgICAgICAgYWN0aW9uRnVuY3Rpb25NYXAgPSBfdGhpcy5tYWNoaW5lLm9wdGlvbnMuYWN0aW9ucztcbiAgICAgIH1cblxuICAgICAgdmFyIGFjdGlvbk9yRXhlYyA9IGFjdGlvbi5leGVjIHx8IGdldEFjdGlvbkZ1bmN0aW9uKGFjdGlvbi50eXBlLCBhY3Rpb25GdW5jdGlvbk1hcCk7XG4gICAgICB2YXIgZXhlYyA9IGlzRnVuY3Rpb24oYWN0aW9uT3JFeGVjKSA/IGFjdGlvbk9yRXhlYyA6IGFjdGlvbk9yRXhlYyA/IGFjdGlvbk9yRXhlYy5leGVjIDogYWN0aW9uLmV4ZWM7XG5cbiAgICAgIGlmIChleGVjKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIGV4ZWMoY29udGV4dCwgX2V2ZW50LmRhdGEsICFfdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cyA/IHtcbiAgICAgICAgICAgIGFjdGlvbjogYWN0aW9uLFxuICAgICAgICAgICAgc3RhdGU6IF90aGlzLnN0YXRlLFxuICAgICAgICAgICAgX2V2ZW50OiBfZXZlbnRcbiAgICAgICAgICB9IDoge1xuICAgICAgICAgICAgYWN0aW9uOiBhY3Rpb24sXG4gICAgICAgICAgICBfZXZlbnQ6IF9ldmVudFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBpZiAoX3RoaXMucGFyZW50KSB7XG4gICAgICAgICAgICBfdGhpcy5wYXJlbnQuc2VuZCh7XG4gICAgICAgICAgICAgIHR5cGU6ICd4c3RhdGUuZXJyb3InLFxuICAgICAgICAgICAgICBkYXRhOiBlcnJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgICAgIGNhc2UgcmFpc2U6XG4gICAgICAgICAge1xuICAgICAgICAgICAgLy8gaWYgcmFpc2UgYWN0aW9uIHJlYWNoZWQgdGhlIGludGVycHJldGVyIHRoZW4gaXQncyBhIGRlbGF5ZWQgb25lXG4gICAgICAgICAgICB2YXIgc2VuZEFjdGlvbl8xID0gYWN0aW9uO1xuXG4gICAgICAgICAgICBfdGhpcy5kZWZlcihzZW5kQWN0aW9uXzEpO1xuXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBzZW5kOlxuICAgICAgICAgIHZhciBzZW5kQWN0aW9uID0gYWN0aW9uO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiBzZW5kQWN0aW9uLmRlbGF5ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgX3RoaXMuZGVmZXIoc2VuZEFjdGlvbik7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHNlbmRBY3Rpb24udG8pIHtcbiAgICAgICAgICAgICAgX3RoaXMuc2VuZFRvKHNlbmRBY3Rpb24uX2V2ZW50LCBzZW5kQWN0aW9uLnRvLCBfZXZlbnQgPT09IGluaXRFdmVudCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfdGhpcy5zZW5kKHNlbmRBY3Rpb24uX2V2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIGNhbmNlbDpcbiAgICAgICAgICBfdGhpcy5jYW5jZWwoYWN0aW9uLnNlbmRJZCk7XG5cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIHN0YXJ0OlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5zdGF0dXMgIT09IEludGVycHJldGVyU3RhdHVzLlJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYWN0aXZpdHkgPSBhY3Rpb24uYWN0aXZpdHk7IC8vIElmIHRoZSBhY3Rpdml0eSB3aWxsIGJlIHN0b3BwZWQgcmlnaHQgYWZ0ZXIgaXQncyBzdGFydGVkXG4gICAgICAgICAgICAvLyAoc3VjaCBhcyBpbiB0cmFuc2llbnQgc3RhdGVzKVxuICAgICAgICAgICAgLy8gZG9uJ3QgYm90aGVyIHN0YXJ0aW5nIHRoZSBhY3Rpdml0eS5cblxuICAgICAgICAgICAgaWYgKCAvLyBpbiB2NCB3aXRoIGBwcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50c2AgaW52b2tlcyBhcmUgY2FsbGVkIGVhZ2VybHkgd2hlbiB0aGUgYHRoaXMuc3RhdGVgIHN0aWxsIHBvaW50cyB0byB0aGUgcHJldmlvdXMgc3RhdGVcbiAgICAgICAgICAgICFfdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cyAmJiAhX3RoaXMuc3RhdGUuYWN0aXZpdGllc1thY3Rpdml0eS5pZCB8fCBhY3Rpdml0eS50eXBlXSkge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gLy8gSW52b2tlZCBzZXJ2aWNlc1xuXG5cbiAgICAgICAgICAgIGlmIChhY3Rpdml0eS50eXBlID09PSBBY3Rpb25UeXBlcy5JbnZva2UpIHtcbiAgICAgICAgICAgICAgdmFyIGludm9rZVNvdXJjZSA9IHRvSW52b2tlU291cmNlKGFjdGl2aXR5LnNyYyk7XG4gICAgICAgICAgICAgIHZhciBzZXJ2aWNlQ3JlYXRvciA9IF90aGlzLm1hY2hpbmUub3B0aW9ucy5zZXJ2aWNlcyA/IF90aGlzLm1hY2hpbmUub3B0aW9ucy5zZXJ2aWNlc1tpbnZva2VTb3VyY2UudHlwZV0gOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgIHZhciBpZCA9IGFjdGl2aXR5LmlkLFxuICAgICAgICAgICAgICAgICAgZGF0YSA9IGFjdGl2aXR5LmRhdGE7XG5cbiAgICAgICAgICAgICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICAgICAgICAgICAgd2FybighKCdmb3J3YXJkJyBpbiBhY3Rpdml0eSksIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICAgICAgICAgICAgICBcImBmb3J3YXJkYCBwcm9wZXJ0eSBpcyBkZXByZWNhdGVkIChmb3VuZCBpbiBpbnZvY2F0aW9uIG9mICdcIi5jb25jYXQoYWN0aXZpdHkuc3JjLCBcIicgaW4gaW4gbWFjaGluZSAnXCIpLmNvbmNhdChfdGhpcy5tYWNoaW5lLmlkLCBcIicpLiBcIikgKyBcIlBsZWFzZSB1c2UgYGF1dG9Gb3J3YXJkYCBpbnN0ZWFkLlwiKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHZhciBhdXRvRm9yd2FyZCA9ICdhdXRvRm9yd2FyZCcgaW4gYWN0aXZpdHkgPyBhY3Rpdml0eS5hdXRvRm9yd2FyZCA6ICEhYWN0aXZpdHkuZm9yd2FyZDtcblxuICAgICAgICAgICAgICBpZiAoIXNlcnZpY2VDcmVhdG9yKSB7XG4gICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbnNvbGVcbiAgICAgICAgICAgICAgICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICAgICAgICAgICAgICAgIHdhcm4oZmFsc2UsIFwiTm8gc2VydmljZSBmb3VuZCBmb3IgaW52b2NhdGlvbiAnXCIuY29uY2F0KGFjdGl2aXR5LnNyYywgXCInIGluIG1hY2hpbmUgJ1wiKS5jb25jYXQoX3RoaXMubWFjaGluZS5pZCwgXCInLlwiKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdmFyIHJlc29sdmVkRGF0YSA9IGRhdGEgPyBtYXBDb250ZXh0KGRhdGEsIGNvbnRleHQsIF9ldmVudCkgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzZXJ2aWNlQ3JlYXRvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiB3YXJuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGlzRnVuY3Rpb24oc2VydmljZUNyZWF0b3IpID8gc2VydmljZUNyZWF0b3IoY29udGV4dCwgX2V2ZW50LmRhdGEsIHtcbiAgICAgICAgICAgICAgICBkYXRhOiByZXNvbHZlZERhdGEsXG4gICAgICAgICAgICAgICAgc3JjOiBpbnZva2VTb3VyY2UsXG4gICAgICAgICAgICAgICAgbWV0YTogYWN0aXZpdHkubWV0YVxuICAgICAgICAgICAgICB9KSA6IHNlcnZpY2VDcmVhdG9yO1xuXG4gICAgICAgICAgICAgIGlmICghc291cmNlKSB7XG4gICAgICAgICAgICAgICAgLy8gVE9ETzogd2Fybj9cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHZvaWQgMDtcblxuICAgICAgICAgICAgICBpZiAoaXNNYWNoaW5lKHNvdXJjZSkpIHtcbiAgICAgICAgICAgICAgICBzb3VyY2UgPSByZXNvbHZlZERhdGEgPyBzb3VyY2Uud2l0aENvbnRleHQocmVzb2x2ZWREYXRhKSA6IHNvdXJjZTtcbiAgICAgICAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgYXV0b0ZvcndhcmQ6IGF1dG9Gb3J3YXJkXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIF90aGlzLnNwYXduKHNvdXJjZSwgaWQsIG9wdGlvbnMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgX3RoaXMuc3Bhd25BY3Rpdml0eShhY3Rpdml0eSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICBjYXNlIHN0b3A6XG4gICAgICAgICAge1xuICAgICAgICAgICAgX3RoaXMuc3RvcENoaWxkKGFjdGlvbi5hY3Rpdml0eS5pZCk7XG5cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICBjYXNlIGxvZzpcbiAgICAgICAgICB2YXIgX2EgPSBhY3Rpb24sXG4gICAgICAgICAgICAgIGxhYmVsID0gX2EubGFiZWwsXG4gICAgICAgICAgICAgIHZhbHVlID0gX2EudmFsdWU7XG5cbiAgICAgICAgICBpZiAobGFiZWwpIHtcbiAgICAgICAgICAgIF90aGlzLmxvZ2dlcihsYWJlbCwgdmFsdWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfdGhpcy5sb2dnZXIodmFsdWUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICAgICAgICB3YXJuKGZhbHNlLCBcIk5vIGltcGxlbWVudGF0aW9uIGZvdW5kIGZvciBhY3Rpb24gdHlwZSAnXCIuY29uY2F0KGFjdGlvbi50eXBlLCBcIidcIikpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgcmVzb2x2ZWRPcHRpb25zID0gX19hc3NpZ24oX19hc3NpZ24oe30sIEludGVycHJldGVyLmRlZmF1bHRPcHRpb25zKSwgb3B0aW9ucyk7XG5cbiAgICB2YXIgY2xvY2sgPSByZXNvbHZlZE9wdGlvbnMuY2xvY2ssXG4gICAgICAgIGxvZ2dlciA9IHJlc29sdmVkT3B0aW9ucy5sb2dnZXIsXG4gICAgICAgIHBhcmVudCA9IHJlc29sdmVkT3B0aW9ucy5wYXJlbnQsXG4gICAgICAgIGlkID0gcmVzb2x2ZWRPcHRpb25zLmlkO1xuICAgIHZhciByZXNvbHZlZElkID0gaWQgIT09IHVuZGVmaW5lZCA/IGlkIDogbWFjaGluZS5pZDtcbiAgICB0aGlzLmlkID0gcmVzb2x2ZWRJZDtcbiAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlcjtcbiAgICB0aGlzLmNsb2NrID0gY2xvY2s7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy5vcHRpb25zID0gcmVzb2x2ZWRPcHRpb25zO1xuICAgIHRoaXMuc2NoZWR1bGVyID0gbmV3IFNjaGVkdWxlcih7XG4gICAgICBkZWZlckV2ZW50czogdGhpcy5vcHRpb25zLmRlZmVyRXZlbnRzXG4gICAgfSk7XG4gICAgdGhpcy5zZXNzaW9uSWQgPSByZWdpc3RyeS5ib29rSWQoKTtcbiAgfVxuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShJbnRlcnByZXRlci5wcm90b3R5cGUsIFwiaW5pdGlhbFN0YXRlXCIsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIGlmICh0aGlzLl9pbml0aWFsU3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2luaXRpYWxTdGF0ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb3ZpZGUodGhpcywgZnVuY3Rpb24gKCkge1xuICAgICAgICBfdGhpcy5faW5pdGlhbFN0YXRlID0gX3RoaXMubWFjaGluZS5pbml0aWFsU3RhdGU7XG4gICAgICAgIHJldHVybiBfdGhpcy5faW5pdGlhbFN0YXRlO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShJbnRlcnByZXRlci5wcm90b3R5cGUsIFwic3RhdGVcIiwge1xuICAgIC8qKlxyXG4gICAgICogQGRlcHJlY2F0ZWQgVXNlIGAuZ2V0U25hcHNob3QoKWAgaW5zdGVhZC5cclxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICAgIHdhcm4odGhpcy5zdGF0dXMgIT09IEludGVycHJldGVyU3RhdHVzLk5vdFN0YXJ0ZWQsIFwiQXR0ZW1wdGVkIHRvIHJlYWQgc3RhdGUgZnJvbSB1bmluaXRpYWxpemVkIHNlcnZpY2UgJ1wiLmNvbmNhdCh0aGlzLmlkLCBcIicuIE1ha2Ugc3VyZSB0aGUgc2VydmljZSBpcyBzdGFydGVkIGZpcnN0LlwiKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbiAgLyoqXHJcbiAgICogRXhlY3V0ZXMgdGhlIGFjdGlvbnMgb2YgdGhlIGdpdmVuIHN0YXRlLCB3aXRoIHRoYXQgc3RhdGUncyBgY29udGV4dGAgYW5kIGBldmVudGAuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gc3RhdGUgVGhlIHN0YXRlIHdob3NlIGFjdGlvbnMgd2lsbCBiZSBleGVjdXRlZFxyXG4gICAqIEBwYXJhbSBhY3Rpb25zQ29uZmlnIFRoZSBhY3Rpb24gaW1wbGVtZW50YXRpb25zIHRvIHVzZVxyXG4gICAqL1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24gKHN0YXRlLCBhY3Rpb25zQ29uZmlnKSB7XG4gICAgdmFyIGVfMSwgX2E7XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2IgPSBfX3ZhbHVlcyhzdGF0ZS5hY3Rpb25zKSwgX2MgPSBfYi5uZXh0KCk7ICFfYy5kb25lOyBfYyA9IF9iLm5leHQoKSkge1xuICAgICAgICB2YXIgYWN0aW9uID0gX2MudmFsdWU7XG4gICAgICAgIHRoaXMuZXhlYyhhY3Rpb24sIHN0YXRlLCBhY3Rpb25zQ29uZmlnKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzFfMSkge1xuICAgICAgZV8xID0ge1xuICAgICAgICBlcnJvcjogZV8xXzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfYyAmJiAhX2MuZG9uZSAmJiAoX2EgPSBfYi5yZXR1cm4pKSBfYS5jYWxsKF9iKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZSwgX2V2ZW50KSB7XG4gICAgdmFyIGVfMiwgX2EsIGVfMywgX2IsIGVfNCwgX2MsIGVfNSwgX2Q7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzOyAvLyBBdHRhY2ggc2Vzc2lvbiBJRCB0byBzdGF0ZVxuXG5cbiAgICBzdGF0ZS5fc2Vzc2lvbmlkID0gdGhpcy5zZXNzaW9uSWQ7IC8vIFVwZGF0ZSBzdGF0ZVxuXG4gICAgdGhpcy5fc3RhdGUgPSBzdGF0ZTsgLy8gRXhlY3V0ZSBhY3Rpb25zXG5cbiAgICBpZiAoKCF0aGlzLm1hY2hpbmUuY29uZmlnLnByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzIHx8IC8vIHRoaXMgaXMgY3VycmVudGx5IHJlcXVpcmVkIHRvIGV4ZWN1dGUgaW5pdGlhbCBhY3Rpb25zIGFzIHRoZSBgaW5pdGlhbFN0YXRlYCBnZXRzIGNhY2hlZFxuICAgIC8vIHdlIGNhbid0IGp1c3QgcmVjb21wdXRlIGl0IChhbmQgZXhlY3V0ZSBhY3Rpb25zIHdoaWxlIGRvaW5nIHNvKSBiZWNhdXNlIHdlIHRyeSB0byBwcmVzZXJ2ZSBpZGVudGl0eSBvZiBhY3RvcnMgY3JlYXRlZCB3aXRoaW4gaW5pdGlhbCBhc3NpZ25zXG4gICAgX2V2ZW50ID09PSBpbml0RXZlbnQpICYmIHRoaXMub3B0aW9ucy5leGVjdXRlKSB7XG4gICAgICB0aGlzLmV4ZWN1dGUodGhpcy5zdGF0ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBpdGVtID0gdm9pZCAwO1xuXG4gICAgICB3aGlsZSAoaXRlbSA9IHRoaXMuX291dGdvaW5nUXVldWUuc2hpZnQoKSkge1xuICAgICAgICBpdGVtWzBdLnNlbmQoaXRlbVsxXSk7XG4gICAgICB9XG4gICAgfSAvLyBVcGRhdGUgY2hpbGRyZW5cblxuXG4gICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgX3RoaXMuc3RhdGUuY2hpbGRyZW5bY2hpbGQuaWRdID0gY2hpbGQ7XG4gICAgfSk7IC8vIERldiB0b29sc1xuXG4gICAgaWYgKHRoaXMuZGV2VG9vbHMpIHtcbiAgICAgIHRoaXMuZGV2VG9vbHMuc2VuZChfZXZlbnQuZGF0YSwgc3RhdGUpO1xuICAgIH0gLy8gRXhlY3V0ZSBsaXN0ZW5lcnNcblxuXG4gICAgaWYgKHN0YXRlLmV2ZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciBfZSA9IF9fdmFsdWVzKHRoaXMuZXZlbnRMaXN0ZW5lcnMpLCBfZiA9IF9lLm5leHQoKTsgIV9mLmRvbmU7IF9mID0gX2UubmV4dCgpKSB7XG4gICAgICAgICAgdmFyIGxpc3RlbmVyID0gX2YudmFsdWU7XG4gICAgICAgICAgbGlzdGVuZXIoc3RhdGUuZXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlXzJfMSkge1xuICAgICAgICBlXzIgPSB7XG4gICAgICAgICAgZXJyb3I6IGVfMl8xXG4gICAgICAgIH07XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChfZiAmJiAhX2YuZG9uZSAmJiAoX2EgPSBfZS5yZXR1cm4pKSBfYS5jYWxsKF9lKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBpZiAoZV8yKSB0aHJvdyBlXzIuZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2cgPSBfX3ZhbHVlcyh0aGlzLmxpc3RlbmVycyksIF9oID0gX2cubmV4dCgpOyAhX2guZG9uZTsgX2ggPSBfZy5uZXh0KCkpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVyID0gX2gudmFsdWU7XG4gICAgICAgIGxpc3RlbmVyKHN0YXRlLCBzdGF0ZS5ldmVudCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV8zXzEpIHtcbiAgICAgIGVfMyA9IHtcbiAgICAgICAgZXJyb3I6IGVfM18xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoX2ggJiYgIV9oLmRvbmUgJiYgKF9iID0gX2cucmV0dXJuKSkgX2IuY2FsbChfZyk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV8zKSB0aHJvdyBlXzMuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9qID0gX192YWx1ZXModGhpcy5jb250ZXh0TGlzdGVuZXJzKSwgX2sgPSBfai5uZXh0KCk7ICFfay5kb25lOyBfayA9IF9qLm5leHQoKSkge1xuICAgICAgICB2YXIgY29udGV4dExpc3RlbmVyID0gX2sudmFsdWU7XG4gICAgICAgIGNvbnRleHRMaXN0ZW5lcih0aGlzLnN0YXRlLmNvbnRleHQsIHRoaXMuc3RhdGUuaGlzdG9yeSA/IHRoaXMuc3RhdGUuaGlzdG9yeS5jb250ZXh0IDogdW5kZWZpbmVkKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzRfMSkge1xuICAgICAgZV80ID0ge1xuICAgICAgICBlcnJvcjogZV80XzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfayAmJiAhX2suZG9uZSAmJiAoX2MgPSBfai5yZXR1cm4pKSBfYy5jYWxsKF9qKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzQpIHRocm93IGVfNC5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5kb25lKSB7XG4gICAgICAvLyBnZXQgZmluYWwgY2hpbGQgc3RhdGUgbm9kZVxuICAgICAgdmFyIGZpbmFsQ2hpbGRTdGF0ZU5vZGUgPSBzdGF0ZS5jb25maWd1cmF0aW9uLmZpbmQoZnVuY3Rpb24gKHNuKSB7XG4gICAgICAgIHJldHVybiBzbi50eXBlID09PSAnZmluYWwnICYmIHNuLnBhcmVudCA9PT0gX3RoaXMubWFjaGluZTtcbiAgICAgIH0pO1xuICAgICAgdmFyIGRvbmVEYXRhID0gZmluYWxDaGlsZFN0YXRlTm9kZSAmJiBmaW5hbENoaWxkU3RhdGVOb2RlLmRvbmVEYXRhID8gbWFwQ29udGV4dChmaW5hbENoaWxkU3RhdGVOb2RlLmRvbmVEYXRhLCBzdGF0ZS5jb250ZXh0LCBfZXZlbnQpIDogdW5kZWZpbmVkO1xuICAgICAgdGhpcy5fZG9uZUV2ZW50ID0gZG9uZUludm9rZSh0aGlzLmlkLCBkb25lRGF0YSk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIF9sID0gX192YWx1ZXModGhpcy5kb25lTGlzdGVuZXJzKSwgX20gPSBfbC5uZXh0KCk7ICFfbS5kb25lOyBfbSA9IF9sLm5leHQoKSkge1xuICAgICAgICAgIHZhciBsaXN0ZW5lciA9IF9tLnZhbHVlO1xuICAgICAgICAgIGxpc3RlbmVyKHRoaXMuX2RvbmVFdmVudCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVfNV8xKSB7XG4gICAgICAgIGVfNSA9IHtcbiAgICAgICAgICBlcnJvcjogZV81XzFcbiAgICAgICAgfTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKF9tICYmICFfbS5kb25lICYmIChfZCA9IF9sLnJldHVybikpIF9kLmNhbGwoX2wpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIGlmIChlXzUpIHRocm93IGVfNS5lcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLl9zdG9wKCk7XG5cbiAgICAgIHRoaXMuX3N0b3BDaGlsZHJlbigpO1xuXG4gICAgICByZWdpc3RyeS5mcmVlKHRoaXMuc2Vzc2lvbklkKTtcbiAgICB9XG4gIH07XG4gIC8qXHJcbiAgICogQWRkcyBhIGxpc3RlbmVyIHRoYXQgaXMgbm90aWZpZWQgd2hlbmV2ZXIgYSBzdGF0ZSB0cmFuc2l0aW9uIGhhcHBlbnMuIFRoZSBsaXN0ZW5lciBpcyBjYWxsZWQgd2l0aFxyXG4gICAqIHRoZSBuZXh0IHN0YXRlIGFuZCB0aGUgZXZlbnQgb2JqZWN0IHRoYXQgY2F1c2VkIHRoZSBzdGF0ZSB0cmFuc2l0aW9uLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGxpc3RlbmVyIFRoZSBzdGF0ZSBsaXN0ZW5lclxyXG4gICAqL1xuXG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLm9uVHJhbnNpdGlvbiA9IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgIHRoaXMubGlzdGVuZXJzLmFkZChsaXN0ZW5lcik7IC8vIFNlbmQgY3VycmVudCBzdGF0ZSB0byBsaXN0ZW5lclxuXG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBJbnRlcnByZXRlclN0YXR1cy5SdW5uaW5nKSB7XG4gICAgICBsaXN0ZW5lcih0aGlzLnN0YXRlLCB0aGlzLnN0YXRlLmV2ZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc3Vic2NyaWJlID0gZnVuY3Rpb24gKG5leHRMaXN0ZW5lck9yT2JzZXJ2ZXIsIF8sIC8vIFRPRE86IGVycm9yIGxpc3RlbmVyXG4gIGNvbXBsZXRlTGlzdGVuZXIpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIG9ic2VydmVyID0gdG9PYnNlcnZlcihuZXh0TGlzdGVuZXJPck9ic2VydmVyLCBfLCBjb21wbGV0ZUxpc3RlbmVyKTtcbiAgICB0aGlzLmxpc3RlbmVycy5hZGQob2JzZXJ2ZXIubmV4dCk7IC8vIFNlbmQgY3VycmVudCBzdGF0ZSB0byBsaXN0ZW5lclxuXG4gICAgaWYgKHRoaXMuc3RhdHVzICE9PSBJbnRlcnByZXRlclN0YXR1cy5Ob3RTdGFydGVkKSB7XG4gICAgICBvYnNlcnZlci5uZXh0KHRoaXMuc3RhdGUpO1xuICAgIH1cblxuICAgIHZhciBjb21wbGV0ZU9uY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBfdGhpcy5kb25lTGlzdGVuZXJzLmRlbGV0ZShjb21wbGV0ZU9uY2UpO1xuXG4gICAgICBfdGhpcy5zdG9wTGlzdGVuZXJzLmRlbGV0ZShjb21wbGV0ZU9uY2UpO1xuXG4gICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgIH07XG5cbiAgICBpZiAodGhpcy5zdGF0dXMgPT09IEludGVycHJldGVyU3RhdHVzLlN0b3BwZWQpIHtcbiAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub25Eb25lKGNvbXBsZXRlT25jZSk7XG4gICAgICB0aGlzLm9uU3RvcChjb21wbGV0ZU9uY2UpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBfdGhpcy5saXN0ZW5lcnMuZGVsZXRlKG9ic2VydmVyLm5leHQpO1xuXG4gICAgICAgIF90aGlzLmRvbmVMaXN0ZW5lcnMuZGVsZXRlKGNvbXBsZXRlT25jZSk7XG5cbiAgICAgICAgX3RoaXMuc3RvcExpc3RlbmVycy5kZWxldGUoY29tcGxldGVPbmNlKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuICAvKipcclxuICAgKiBBZGRzIGFuIGV2ZW50IGxpc3RlbmVyIHRoYXQgaXMgbm90aWZpZWQgd2hlbmV2ZXIgYW4gZXZlbnQgaXMgc2VudCB0byB0aGUgcnVubmluZyBpbnRlcnByZXRlci5cclxuICAgKiBAcGFyYW0gbGlzdGVuZXIgVGhlIGV2ZW50IGxpc3RlbmVyXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUub25FdmVudCA9IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnMuYWRkKGxpc3RlbmVyKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgLyoqXHJcbiAgICogQWRkcyBhbiBldmVudCBsaXN0ZW5lciB0aGF0IGlzIG5vdGlmaWVkIHdoZW5ldmVyIGEgYHNlbmRgIGV2ZW50IG9jY3Vycy5cclxuICAgKiBAcGFyYW0gbGlzdGVuZXIgVGhlIGV2ZW50IGxpc3RlbmVyXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUub25TZW5kID0gZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgdGhpcy5zZW5kTGlzdGVuZXJzLmFkZChsaXN0ZW5lcik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIC8qKlxyXG4gICAqIEFkZHMgYSBjb250ZXh0IGxpc3RlbmVyIHRoYXQgaXMgbm90aWZpZWQgd2hlbmV2ZXIgdGhlIHN0YXRlIGNvbnRleHQgY2hhbmdlcy5cclxuICAgKiBAcGFyYW0gbGlzdGVuZXIgVGhlIGNvbnRleHQgbGlzdGVuZXJcclxuICAgKi9cblxuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5vbkNoYW5nZSA9IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgIHRoaXMuY29udGV4dExpc3RlbmVycy5hZGQobGlzdGVuZXIpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICAvKipcclxuICAgKiBBZGRzIGEgbGlzdGVuZXIgdGhhdCBpcyBub3RpZmllZCB3aGVuIHRoZSBtYWNoaW5lIGlzIHN0b3BwZWQuXHJcbiAgICogQHBhcmFtIGxpc3RlbmVyIFRoZSBsaXN0ZW5lclxyXG4gICAqL1xuXG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLm9uU3RvcCA9IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgIHRoaXMuc3RvcExpc3RlbmVycy5hZGQobGlzdGVuZXIpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICAvKipcclxuICAgKiBBZGRzIGEgc3RhdGUgbGlzdGVuZXIgdGhhdCBpcyBub3RpZmllZCB3aGVuIHRoZSBzdGF0ZWNoYXJ0IGhhcyByZWFjaGVkIGl0cyBmaW5hbCBzdGF0ZS5cclxuICAgKiBAcGFyYW0gbGlzdGVuZXIgVGhlIHN0YXRlIGxpc3RlbmVyXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUub25Eb25lID0gZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBJbnRlcnByZXRlclN0YXR1cy5TdG9wcGVkICYmIHRoaXMuX2RvbmVFdmVudCkge1xuICAgICAgbGlzdGVuZXIodGhpcy5fZG9uZUV2ZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kb25lTGlzdGVuZXJzLmFkZChsaXN0ZW5lcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIC8qKlxyXG4gICAqIFJlbW92ZXMgYSBsaXN0ZW5lci5cclxuICAgKiBAcGFyYW0gbGlzdGVuZXIgVGhlIGxpc3RlbmVyIHRvIHJlbW92ZVxyXG4gICAqL1xuXG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgIHRoaXMubGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG4gICAgdGhpcy5ldmVudExpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICAgIHRoaXMuc2VuZExpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICAgIHRoaXMuc3RvcExpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICAgIHRoaXMuZG9uZUxpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICAgIHRoaXMuY29udGV4dExpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICAvKipcclxuICAgKiBTdGFydHMgdGhlIGludGVycHJldGVyIGZyb20gdGhlIGdpdmVuIHN0YXRlLCBvciB0aGUgaW5pdGlhbCBzdGF0ZS5cclxuICAgKiBAcGFyYW0gaW5pdGlhbFN0YXRlIFRoZSBzdGF0ZSB0byBzdGFydCB0aGUgc3RhdGVjaGFydCBmcm9tXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAoaW5pdGlhbFN0YXRlKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gSW50ZXJwcmV0ZXJTdGF0dXMuUnVubmluZykge1xuICAgICAgLy8gRG8gbm90IHJlc3RhcnQgdGhlIHNlcnZpY2UgaWYgaXQgaXMgYWxyZWFkeSBzdGFydGVkXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IC8vIHllcywgaXQncyBhIGhhY2sgYnV0IHdlIG5lZWQgdGhlIHJlbGF0ZWQgY2FjaGUgdG8gYmUgcG9wdWxhdGVkIGZvciBzb21lIHRoaW5ncyB0byB3b3JrIChsaWtlIGRlbGF5ZWQgdHJhbnNpdGlvbnMpXG4gICAgLy8gdGhpcyBpcyB1c3VhbGx5IGNhbGxlZCBieSBgbWFjaGluZS5nZXRJbml0aWFsU3RhdGVgIGJ1dCBpZiB3ZSByZWh5ZHJhdGUgZnJvbSBhIHN0YXRlIHdlIG1pZ2h0IGJ5cGFzcyB0aGlzIGNhbGxcbiAgICAvLyB3ZSBhbHNvIGRvbid0IHdhbnQgdG8gY2FsbCB0aGlzIG1ldGhvZCBoZXJlIGFzIGl0IHJlc29sdmVzIHRoZSBmdWxsIGluaXRpYWwgc3RhdGUgd2hpY2ggbWlnaHQgaW52b2x2ZSBjYWxsaW5nIGFzc2lnbiBhY3Rpb25zXG4gICAgLy8gYW5kIHRoYXQgY291bGQgcG90ZW50aWFsbHkgbGVhZCB0byBzb21lIHVud2FudGVkIHNpZGUtZWZmZWN0cyAoZXZlbiBzdWNoIGFzIGNyZWF0aW5nIHNvbWUgcm9ndWUgYWN0b3JzKVxuXG5cbiAgICB0aGlzLm1hY2hpbmUuX2luaXQoKTtcblxuICAgIHJlZ2lzdHJ5LnJlZ2lzdGVyKHRoaXMuc2Vzc2lvbklkLCB0aGlzKTtcbiAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB0aGlzLnN0YXR1cyA9IEludGVycHJldGVyU3RhdHVzLlJ1bm5pbmc7XG4gICAgdmFyIHJlc29sdmVkU3RhdGUgPSBpbml0aWFsU3RhdGUgPT09IHVuZGVmaW5lZCA/IHRoaXMuaW5pdGlhbFN0YXRlIDogcHJvdmlkZSh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gaXNTdGF0ZUNvbmZpZyhpbml0aWFsU3RhdGUpID8gX3RoaXMubWFjaGluZS5yZXNvbHZlU3RhdGUoaW5pdGlhbFN0YXRlKSA6IF90aGlzLm1hY2hpbmUucmVzb2x2ZVN0YXRlKFN0YXRlLmZyb20oaW5pdGlhbFN0YXRlLCBfdGhpcy5tYWNoaW5lLmNvbnRleHQpKTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuZGV2VG9vbHMpIHtcbiAgICAgIHRoaXMuYXR0YWNoRGV2KCk7XG4gICAgfVxuXG4gICAgdGhpcy5zY2hlZHVsZXIuaW5pdGlhbGl6ZShmdW5jdGlvbiAoKSB7XG4gICAgICBfdGhpcy51cGRhdGUocmVzb2x2ZWRTdGF0ZSwgaW5pdEV2ZW50KTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuX3N0b3BDaGlsZHJlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBUT0RPOiB0aGluayBhYm91dCBjb252ZXJ0aW5nIHRob3NlIHRvIGFjdGlvbnNcbiAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICBpZiAoaXNGdW5jdGlvbihjaGlsZC5zdG9wKSkge1xuICAgICAgICBjaGlsZC5zdG9wKCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5jaGlsZHJlbi5jbGVhcigpO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5fc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZV82LCBfYSwgZV83LCBfYiwgZV84LCBfYywgZV85LCBfZCwgZV8xMCwgX2U7XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2YgPSBfX3ZhbHVlcyh0aGlzLmxpc3RlbmVycyksIF9nID0gX2YubmV4dCgpOyAhX2cuZG9uZTsgX2cgPSBfZi5uZXh0KCkpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVyID0gX2cudmFsdWU7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV82XzEpIHtcbiAgICAgIGVfNiA9IHtcbiAgICAgICAgZXJyb3I6IGVfNl8xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoX2cgJiYgIV9nLmRvbmUgJiYgKF9hID0gX2YucmV0dXJuKSkgX2EuY2FsbChfZik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV82KSB0aHJvdyBlXzYuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9oID0gX192YWx1ZXModGhpcy5zdG9wTGlzdGVuZXJzKSwgX2ogPSBfaC5uZXh0KCk7ICFfai5kb25lOyBfaiA9IF9oLm5leHQoKSkge1xuICAgICAgICB2YXIgbGlzdGVuZXIgPSBfai52YWx1ZTsgLy8gY2FsbCBsaXN0ZW5lciwgdGhlbiByZW1vdmVcblxuICAgICAgICBsaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLnN0b3BMaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzdfMSkge1xuICAgICAgZV83ID0ge1xuICAgICAgICBlcnJvcjogZV83XzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfaiAmJiAhX2ouZG9uZSAmJiAoX2IgPSBfaC5yZXR1cm4pKSBfYi5jYWxsKF9oKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzcpIHRocm93IGVfNy5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2sgPSBfX3ZhbHVlcyh0aGlzLmNvbnRleHRMaXN0ZW5lcnMpLCBfbCA9IF9rLm5leHQoKTsgIV9sLmRvbmU7IF9sID0gX2submV4dCgpKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lciA9IF9sLnZhbHVlO1xuICAgICAgICB0aGlzLmNvbnRleHRMaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzhfMSkge1xuICAgICAgZV84ID0ge1xuICAgICAgICBlcnJvcjogZV84XzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfbCAmJiAhX2wuZG9uZSAmJiAoX2MgPSBfay5yZXR1cm4pKSBfYy5jYWxsKF9rKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzgpIHRocm93IGVfOC5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX20gPSBfX3ZhbHVlcyh0aGlzLmRvbmVMaXN0ZW5lcnMpLCBfbyA9IF9tLm5leHQoKTsgIV9vLmRvbmU7IF9vID0gX20ubmV4dCgpKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lciA9IF9vLnZhbHVlO1xuICAgICAgICB0aGlzLmRvbmVMaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzlfMSkge1xuICAgICAgZV85ID0ge1xuICAgICAgICBlcnJvcjogZV85XzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfbyAmJiAhX28uZG9uZSAmJiAoX2QgPSBfbS5yZXR1cm4pKSBfZC5jYWxsKF9tKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzkpIHRocm93IGVfOS5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgIC8vIEludGVycHJldGVyIGFscmVhZHkgc3RvcHBlZDsgZG8gbm90aGluZ1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIHRoaXMuc3RhdHVzID0gSW50ZXJwcmV0ZXJTdGF0dXMuU3RvcHBlZDtcbiAgICB0aGlzLl9pbml0aWFsU3RhdGUgPSB1bmRlZmluZWQ7XG5cbiAgICB0cnkge1xuICAgICAgLy8gd2UgYXJlIGdvaW5nIHRvIHN0b3Agd2l0aGluIHRoZSBjdXJyZW50IHN5bmMgZnJhbWVcbiAgICAgIC8vIHNvIHdlIGNhbiBzYWZlbHkganVzdCBjYW5jZWwgdGhpcyBoZXJlIGFzIG5vdGhpbmcgYXN5bmMgc2hvdWxkIGJlIGZpcmVkIGFueXdheVxuICAgICAgZm9yICh2YXIgX3AgPSBfX3ZhbHVlcyhPYmplY3Qua2V5cyh0aGlzLmRlbGF5ZWRFdmVudHNNYXApKSwgX3EgPSBfcC5uZXh0KCk7ICFfcS5kb25lOyBfcSA9IF9wLm5leHQoKSkge1xuICAgICAgICB2YXIga2V5ID0gX3EudmFsdWU7XG4gICAgICAgIHRoaXMuY2xvY2suY2xlYXJUaW1lb3V0KHRoaXMuZGVsYXllZEV2ZW50c01hcFtrZXldKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzEwXzEpIHtcbiAgICAgIGVfMTAgPSB7XG4gICAgICAgIGVycm9yOiBlXzEwXzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfcSAmJiAhX3EuZG9uZSAmJiAoX2UgPSBfcC5yZXR1cm4pKSBfZS5jYWxsKF9wKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzEwKSB0aHJvdyBlXzEwLmVycm9yO1xuICAgICAgfVxuICAgIH0gLy8gY2xlYXIgZXZlcnl0aGluZyB0aGF0IG1pZ2h0IGJlIGVucXVldWVkXG5cblxuICAgIHRoaXMuc2NoZWR1bGVyLmNsZWFyKCk7XG4gICAgdGhpcy5zY2hlZHVsZXIgPSBuZXcgU2NoZWR1bGVyKHtcbiAgICAgIGRlZmVyRXZlbnRzOiB0aGlzLm9wdGlvbnMuZGVmZXJFdmVudHNcbiAgICB9KTtcbiAgfTtcbiAgLyoqXHJcbiAgICogU3RvcHMgdGhlIGludGVycHJldGVyIGFuZCB1bnN1YnNjcmliZSBhbGwgbGlzdGVuZXJzLlxyXG4gICAqXHJcbiAgICogVGhpcyB3aWxsIGFsc28gbm90aWZ5IHRoZSBgb25TdG9wYCBsaXN0ZW5lcnMuXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBUT0RPOiBhZGQgd2FybmluZyBmb3Igc3RvcHBpbmcgbm9uLXJvb3QgaW50ZXJwcmV0ZXJzXG4gICAgdmFyIF90aGlzID0gdGhpczsgLy8gZ3JhYiB0aGUgY3VycmVudCBzY2hlZHVsZXIgYXMgaXQgd2lsbCBiZSByZXBsYWNlZCBpbiBfc3RvcFxuXG5cbiAgICB2YXIgc2NoZWR1bGVyID0gdGhpcy5zY2hlZHVsZXI7XG5cbiAgICB0aGlzLl9zdG9wKCk7IC8vIGxldCB3aGF0IGlzIGN1cnJlbnRseSBwcm9jZXNzZWQgdG8gYmUgZmluaXNoZWRcblxuXG4gICAgc2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIGl0IGZlZWxzIHdlaXJkIHRvIGhhbmRsZSB0aGlzIGhlcmUgYnV0IHdlIG5lZWQgdG8gaGFuZGxlIHRoaXMgZXZlbiBzbGlnaHRseSBcIm91dCBvZiBiYW5kXCJcbiAgICAgIHZhciBfZXZlbnQgPSB0b1NDWE1MRXZlbnQoe1xuICAgICAgICB0eXBlOiAneHN0YXRlLnN0b3AnXG4gICAgICB9KTtcblxuICAgICAgdmFyIG5leHRTdGF0ZSA9IHByb3ZpZGUoX3RoaXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGV4aXRBY3Rpb25zID0gZmxhdHRlbihfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoX3RoaXMuc3RhdGUuY29uZmlndXJhdGlvbiksIGZhbHNlKS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgcmV0dXJuIGIub3JkZXIgLSBhLm9yZGVyO1xuICAgICAgICB9KS5tYXAoZnVuY3Rpb24gKHN0YXRlTm9kZSkge1xuICAgICAgICAgIHJldHVybiB0b0FjdGlvbk9iamVjdHMoc3RhdGVOb2RlLm9uRXhpdCwgX3RoaXMubWFjaGluZS5vcHRpb25zLmFjdGlvbnMpO1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgdmFyIF9hID0gX19yZWFkKHJlc29sdmVBY3Rpb25zKF90aGlzLm1hY2hpbmUsIF90aGlzLnN0YXRlLCBfdGhpcy5zdGF0ZS5jb250ZXh0LCBfZXZlbnQsIFt7XG4gICAgICAgICAgdHlwZTogJ2V4aXQnLFxuICAgICAgICAgIGFjdGlvbnM6IGV4aXRBY3Rpb25zXG4gICAgICAgIH1dLCBfdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cyA/IF90aGlzLl9leGVjIDogdW5kZWZpbmVkLCBfdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cyB8fCBfdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVzZXJ2ZUFjdGlvbk9yZGVyKSwgMiksXG4gICAgICAgICAgICByZXNvbHZlZEFjdGlvbnMgPSBfYVswXSxcbiAgICAgICAgICAgIHVwZGF0ZWRDb250ZXh0ID0gX2FbMV07XG5cbiAgICAgICAgdmFyIG5ld1N0YXRlID0gbmV3IFN0YXRlKHtcbiAgICAgICAgICB2YWx1ZTogX3RoaXMuc3RhdGUudmFsdWUsXG4gICAgICAgICAgY29udGV4dDogdXBkYXRlZENvbnRleHQsXG4gICAgICAgICAgX2V2ZW50OiBfZXZlbnQsXG4gICAgICAgICAgX3Nlc3Npb25pZDogX3RoaXMuc2Vzc2lvbklkLFxuICAgICAgICAgIGhpc3RvcnlWYWx1ZTogdW5kZWZpbmVkLFxuICAgICAgICAgIGhpc3Rvcnk6IF90aGlzLnN0YXRlLFxuICAgICAgICAgIGFjdGlvbnM6IHJlc29sdmVkQWN0aW9ucy5maWx0ZXIoZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuICFpc1JhaXNhYmxlQWN0aW9uKGFjdGlvbik7XG4gICAgICAgICAgfSksXG4gICAgICAgICAgYWN0aXZpdGllczoge30sXG4gICAgICAgICAgZXZlbnRzOiBbXSxcbiAgICAgICAgICBjb25maWd1cmF0aW9uOiBbXSxcbiAgICAgICAgICB0cmFuc2l0aW9uczogW10sXG4gICAgICAgICAgY2hpbGRyZW46IHt9LFxuICAgICAgICAgIGRvbmU6IF90aGlzLnN0YXRlLmRvbmUsXG4gICAgICAgICAgdGFnczogX3RoaXMuc3RhdGUudGFncyxcbiAgICAgICAgICBtYWNoaW5lOiBfdGhpcy5tYWNoaW5lXG4gICAgICAgIH0pO1xuICAgICAgICBuZXdTdGF0ZS5jaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIG5ld1N0YXRlO1xuICAgICAgfSk7XG5cbiAgICAgIF90aGlzLnVwZGF0ZShuZXh0U3RhdGUsIF9ldmVudCk7XG5cbiAgICAgIF90aGlzLl9zdG9wQ2hpbGRyZW4oKTtcblxuICAgICAgcmVnaXN0cnkuZnJlZShfdGhpcy5zZXNzaW9uSWQpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5iYXRjaCA9IGZ1bmN0aW9uIChldmVudHMpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBJbnRlcnByZXRlclN0YXR1cy5Ob3RTdGFydGVkICYmIHRoaXMub3B0aW9ucy5kZWZlckV2ZW50cykge1xuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbnNvbGVcbiAgICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgICB3YXJuKGZhbHNlLCBcIlwiLmNvbmNhdChldmVudHMubGVuZ3RoLCBcIiBldmVudChzKSB3ZXJlIHNlbnQgdG8gdW5pbml0aWFsaXplZCBzZXJ2aWNlIFxcXCJcIikuY29uY2F0KHRoaXMubWFjaGluZS5pZCwgXCJcXFwiIGFuZCBhcmUgZGVmZXJyZWQuIE1ha2Ugc3VyZSAuc3RhcnQoKSBpcyBjYWxsZWQgZm9yIHRoaXMgc2VydmljZS5cXG5FdmVudDogXCIpLmNvbmNhdChKU09OLnN0cmluZ2lmeShldmVudCkpKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdHVzICE9PSBJbnRlcnByZXRlclN0YXR1cy5SdW5uaW5nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICAgIFwiXCIuY29uY2F0KGV2ZW50cy5sZW5ndGgsIFwiIGV2ZW50KHMpIHdlcmUgc2VudCB0byB1bmluaXRpYWxpemVkIHNlcnZpY2UgXFxcIlwiKS5jb25jYXQodGhpcy5tYWNoaW5lLmlkLCBcIlxcXCIuIE1ha2Ugc3VyZSAuc3RhcnQoKSBpcyBjYWxsZWQgZm9yIHRoaXMgc2VydmljZSwgb3Igc2V0IHsgZGVmZXJFdmVudHM6IHRydWUgfSBpbiB0aGUgc2VydmljZSBvcHRpb25zLlwiKSk7XG4gICAgfVxuXG4gICAgaWYgKCFldmVudHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGV4ZWMgPSAhIXRoaXMubWFjaGluZS5jb25maWcucHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHMgJiYgdGhpcy5fZXhlYztcbiAgICB0aGlzLnNjaGVkdWxlci5zY2hlZHVsZShmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgZV8xMSwgX2E7XG5cbiAgICAgIHZhciBuZXh0U3RhdGUgPSBfdGhpcy5zdGF0ZTtcbiAgICAgIHZhciBiYXRjaENoYW5nZWQgPSBmYWxzZTtcbiAgICAgIHZhciBiYXRjaGVkQWN0aW9ucyA9IFtdO1xuXG4gICAgICB2YXIgX2xvb3BfMSA9IGZ1bmN0aW9uIChldmVudF8xKSB7XG4gICAgICAgIHZhciBfZXZlbnQgPSB0b1NDWE1MRXZlbnQoZXZlbnRfMSk7XG5cbiAgICAgICAgX3RoaXMuZm9yd2FyZChfZXZlbnQpO1xuXG4gICAgICAgIG5leHRTdGF0ZSA9IHByb3ZpZGUoX3RoaXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMubWFjaGluZS50cmFuc2l0aW9uKG5leHRTdGF0ZSwgX2V2ZW50LCB1bmRlZmluZWQsIGV4ZWMgfHwgdW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGJhdGNoZWRBY3Rpb25zLnB1c2guYXBwbHkoYmF0Y2hlZEFjdGlvbnMsIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChfdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cyA/IG5leHRTdGF0ZS5hY3Rpb25zIDogbmV4dFN0YXRlLmFjdGlvbnMubWFwKGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgcmV0dXJuIGJpbmRBY3Rpb25Ub1N0YXRlKGEsIG5leHRTdGF0ZSk7XG4gICAgICAgIH0pKSwgZmFsc2UpKTtcbiAgICAgICAgYmF0Y2hDaGFuZ2VkID0gYmF0Y2hDaGFuZ2VkIHx8ICEhbmV4dFN0YXRlLmNoYW5nZWQ7XG4gICAgICB9O1xuXG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciBldmVudHNfMSA9IF9fdmFsdWVzKGV2ZW50cyksIGV2ZW50c18xXzEgPSBldmVudHNfMS5uZXh0KCk7ICFldmVudHNfMV8xLmRvbmU7IGV2ZW50c18xXzEgPSBldmVudHNfMS5uZXh0KCkpIHtcbiAgICAgICAgICB2YXIgZXZlbnRfMSA9IGV2ZW50c18xXzEudmFsdWU7XG5cbiAgICAgICAgICBfbG9vcF8xKGV2ZW50XzEpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlXzExXzEpIHtcbiAgICAgICAgZV8xMSA9IHtcbiAgICAgICAgICBlcnJvcjogZV8xMV8xXG4gICAgICAgIH07XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChldmVudHNfMV8xICYmICFldmVudHNfMV8xLmRvbmUgJiYgKF9hID0gZXZlbnRzXzEucmV0dXJuKSkgX2EuY2FsbChldmVudHNfMSk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgaWYgKGVfMTEpIHRocm93IGVfMTEuZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbmV4dFN0YXRlLmNoYW5nZWQgPSBiYXRjaENoYW5nZWQ7XG4gICAgICBuZXh0U3RhdGUuYWN0aW9ucyA9IGJhdGNoZWRBY3Rpb25zO1xuXG4gICAgICBfdGhpcy51cGRhdGUobmV4dFN0YXRlLCB0b1NDWE1MRXZlbnQoZXZlbnRzW2V2ZW50cy5sZW5ndGggLSAxXSkpO1xuICAgIH0pO1xuICB9O1xuICAvKipcclxuICAgKiBSZXR1cm5zIGEgc2VuZCBmdW5jdGlvbiBib3VuZCB0byB0aGlzIGludGVycHJldGVyIGluc3RhbmNlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCB0byBiZSBzZW50IGJ5IHRoZSBzZW5kZXIuXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc2VuZGVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuc2VuZC5iaW5kKHRoaXMsIGV2ZW50KTtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuX25leHRTdGF0ZSA9IGZ1bmN0aW9uIChldmVudCwgZXhlYykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoZXhlYyA9PT0gdm9pZCAwKSB7XG4gICAgICBleGVjID0gISF0aGlzLm1hY2hpbmUuY29uZmlnLnByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzICYmIHRoaXMuX2V4ZWM7XG4gICAgfVxuXG4gICAgdmFyIF9ldmVudCA9IHRvU0NYTUxFdmVudChldmVudCk7XG5cbiAgICBpZiAoX2V2ZW50Lm5hbWUuaW5kZXhPZihlcnJvclBsYXRmb3JtKSA9PT0gMCAmJiAhdGhpcy5zdGF0ZS5uZXh0RXZlbnRzLnNvbWUoZnVuY3Rpb24gKG5leHRFdmVudCkge1xuICAgICAgcmV0dXJuIG5leHRFdmVudC5pbmRleE9mKGVycm9yUGxhdGZvcm0pID09PSAwO1xuICAgIH0pKSB7XG4gICAgICB0aHJvdyBfZXZlbnQuZGF0YS5kYXRhO1xuICAgIH1cblxuICAgIHZhciBuZXh0U3RhdGUgPSBwcm92aWRlKHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBfdGhpcy5tYWNoaW5lLnRyYW5zaXRpb24oX3RoaXMuc3RhdGUsIF9ldmVudCwgdW5kZWZpbmVkLCBleGVjIHx8IHVuZGVmaW5lZCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG5leHRTdGF0ZTtcbiAgfTtcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgbmV4dCBzdGF0ZSBnaXZlbiB0aGUgaW50ZXJwcmV0ZXIncyBjdXJyZW50IHN0YXRlIGFuZCB0aGUgZXZlbnQuXHJcbiAgICpcclxuICAgKiBUaGlzIGlzIGEgcHVyZSBtZXRob2QgdGhhdCBkb2VzIF9ub3RfIHVwZGF0ZSB0aGUgaW50ZXJwcmV0ZXIncyBzdGF0ZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgdG8gZGV0ZXJtaW5lIHRoZSBuZXh0IHN0YXRlXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUubmV4dFN0YXRlID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuX25leHRTdGF0ZShldmVudCwgZmFsc2UpO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5mb3J3YXJkID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIGVfMTIsIF9hO1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9iID0gX192YWx1ZXModGhpcy5mb3J3YXJkVG8pLCBfYyA9IF9iLm5leHQoKTsgIV9jLmRvbmU7IF9jID0gX2IubmV4dCgpKSB7XG4gICAgICAgIHZhciBpZCA9IF9jLnZhbHVlO1xuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmNoaWxkcmVuLmdldChpZCk7XG5cbiAgICAgICAgaWYgKCFjaGlsZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuYWJsZSB0byBmb3J3YXJkIGV2ZW50ICdcIi5jb25jYXQoZXZlbnQsIFwiJyBmcm9tIGludGVycHJldGVyICdcIikuY29uY2F0KHRoaXMuaWQsIFwiJyB0byBub25leGlzdGFudCBjaGlsZCAnXCIpLmNvbmNhdChpZCwgXCInLlwiKSk7XG4gICAgICAgIH1cblxuICAgICAgICBjaGlsZC5zZW5kKGV2ZW50KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzEyXzEpIHtcbiAgICAgIGVfMTIgPSB7XG4gICAgICAgIGVycm9yOiBlXzEyXzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfYyAmJiAhX2MuZG9uZSAmJiAoX2EgPSBfYi5yZXR1cm4pKSBfYS5jYWxsKF9iKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzEyKSB0aHJvdyBlXzEyLmVycm9yO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuZGVmZXIgPSBmdW5jdGlvbiAoc2VuZEFjdGlvbikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgdGltZXJJZCA9IHRoaXMuY2xvY2suc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoJ3RvJyBpbiBzZW5kQWN0aW9uICYmIHNlbmRBY3Rpb24udG8pIHtcbiAgICAgICAgX3RoaXMuc2VuZFRvKHNlbmRBY3Rpb24uX2V2ZW50LCBzZW5kQWN0aW9uLnRvLCB0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF90aGlzLnNlbmQoc2VuZEFjdGlvbi5fZXZlbnQpO1xuICAgICAgfVxuICAgIH0sIHNlbmRBY3Rpb24uZGVsYXkpO1xuXG4gICAgaWYgKHNlbmRBY3Rpb24uaWQpIHtcbiAgICAgIHRoaXMuZGVsYXllZEV2ZW50c01hcFtzZW5kQWN0aW9uLmlkXSA9IHRpbWVySWQ7XG4gICAgfVxuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5jYW5jZWwgPSBmdW5jdGlvbiAoc2VuZElkKSB7XG4gICAgdGhpcy5jbG9jay5jbGVhclRpbWVvdXQodGhpcy5kZWxheWVkRXZlbnRzTWFwW3NlbmRJZF0pO1xuICAgIGRlbGV0ZSB0aGlzLmRlbGF5ZWRFdmVudHNNYXBbc2VuZElkXTtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuZXhlYyA9IGZ1bmN0aW9uIChhY3Rpb24sIHN0YXRlLCBhY3Rpb25GdW5jdGlvbk1hcCkge1xuICAgIGlmIChhY3Rpb25GdW5jdGlvbk1hcCA9PT0gdm9pZCAwKSB7XG4gICAgICBhY3Rpb25GdW5jdGlvbk1hcCA9IHRoaXMubWFjaGluZS5vcHRpb25zLmFjdGlvbnM7XG4gICAgfVxuXG4gICAgdGhpcy5fZXhlYyhhY3Rpb24sIHN0YXRlLmNvbnRleHQsIHN0YXRlLl9ldmVudCwgYWN0aW9uRnVuY3Rpb25NYXApO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5yZW1vdmVDaGlsZCA9IGZ1bmN0aW9uIChjaGlsZElkKSB7XG4gICAgdmFyIF9hO1xuXG4gICAgdGhpcy5jaGlsZHJlbi5kZWxldGUoY2hpbGRJZCk7XG4gICAgdGhpcy5mb3J3YXJkVG8uZGVsZXRlKGNoaWxkSWQpOyAvLyB0aGlzLnN0YXRlIG1pZ2h0IG5vdCBleGlzdCBhdCB0aGUgdGltZSB0aGlzIGlzIGNhbGxlZCxcbiAgICAvLyBzdWNoIGFzIHdoZW4gYSBjaGlsZCBpcyBhZGRlZCB0aGVuIHJlbW92ZWQgd2hpbGUgaW5pdGlhbGl6aW5nIHRoZSBzdGF0ZVxuXG4gICAgKF9hID0gdGhpcy5zdGF0ZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHRydWUgOiBkZWxldGUgX2EuY2hpbGRyZW5bY2hpbGRJZF07XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnN0b3BDaGlsZCA9IGZ1bmN0aW9uIChjaGlsZElkKSB7XG4gICAgdmFyIGNoaWxkID0gdGhpcy5jaGlsZHJlbi5nZXQoY2hpbGRJZCk7XG5cbiAgICBpZiAoIWNoaWxkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5yZW1vdmVDaGlsZChjaGlsZElkKTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGNoaWxkLnN0b3ApKSB7XG4gICAgICBjaGlsZC5zdG9wKCk7XG4gICAgfVxuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5zcGF3biA9IGZ1bmN0aW9uIChlbnRpdHksIG5hbWUsIG9wdGlvbnMpIHtcbiAgICBpZiAodGhpcy5zdGF0dXMgIT09IEludGVycHJldGVyU3RhdHVzLlJ1bm5pbmcpIHtcbiAgICAgIHJldHVybiBjcmVhdGVEZWZlcnJlZEFjdG9yKGVudGl0eSwgbmFtZSk7XG4gICAgfVxuXG4gICAgaWYgKGlzUHJvbWlzZUxpa2UoZW50aXR5KSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3Bhd25Qcm9taXNlKFByb21pc2UucmVzb2x2ZShlbnRpdHkpLCBuYW1lKTtcbiAgICB9IGVsc2UgaWYgKGlzRnVuY3Rpb24oZW50aXR5KSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3Bhd25DYWxsYmFjayhlbnRpdHksIG5hbWUpO1xuICAgIH0gZWxzZSBpZiAoaXNTcGF3bmVkQWN0b3IoZW50aXR5KSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3Bhd25BY3RvcihlbnRpdHksIG5hbWUpO1xuICAgIH0gZWxzZSBpZiAoaXNPYnNlcnZhYmxlKGVudGl0eSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnNwYXduT2JzZXJ2YWJsZShlbnRpdHksIG5hbWUpO1xuICAgIH0gZWxzZSBpZiAoaXNNYWNoaW5lKGVudGl0eSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnNwYXduTWFjaGluZShlbnRpdHksIF9fYXNzaWduKF9fYXNzaWduKHt9LCBvcHRpb25zKSwge1xuICAgICAgICBpZDogbmFtZVxuICAgICAgfSkpO1xuICAgIH0gZWxzZSBpZiAoaXNCZWhhdmlvcihlbnRpdHkpKSB7XG4gICAgICByZXR1cm4gdGhpcy5zcGF3bkJlaGF2aW9yKGVudGl0eSwgbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuYWJsZSB0byBzcGF3biBlbnRpdHkgXFxcIlwiLmNvbmNhdChuYW1lLCBcIlxcXCIgb2YgdHlwZSBcXFwiXCIpLmNvbmNhdCh0eXBlb2YgZW50aXR5LCBcIlxcXCIuXCIpKTtcbiAgICB9XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnNwYXduTWFjaGluZSA9IGZ1bmN0aW9uIChtYWNoaW5lLCBvcHRpb25zKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG5cbiAgICB2YXIgY2hpbGRTZXJ2aWNlID0gbmV3IEludGVycHJldGVyKG1hY2hpbmUsIF9fYXNzaWduKF9fYXNzaWduKHt9LCB0aGlzLm9wdGlvbnMpLCB7XG4gICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICBpZDogb3B0aW9ucy5pZCB8fCBtYWNoaW5lLmlkXG4gICAgfSkpO1xuXG4gICAgdmFyIHJlc29sdmVkT3B0aW9ucyA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCBERUZBVUxUX1NQQVdOX09QVElPTlMpLCBvcHRpb25zKTtcblxuICAgIGlmIChyZXNvbHZlZE9wdGlvbnMuc3luYykge1xuICAgICAgY2hpbGRTZXJ2aWNlLm9uVHJhbnNpdGlvbihmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgX3RoaXMuc2VuZCh1cGRhdGUsIHtcbiAgICAgICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICAgICAgaWQ6IGNoaWxkU2VydmljZS5pZFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHZhciBhY3RvciA9IGNoaWxkU2VydmljZTtcbiAgICB0aGlzLmNoaWxkcmVuLnNldChjaGlsZFNlcnZpY2UuaWQsIGFjdG9yKTtcblxuICAgIGlmIChyZXNvbHZlZE9wdGlvbnMuYXV0b0ZvcndhcmQpIHtcbiAgICAgIHRoaXMuZm9yd2FyZFRvLmFkZChjaGlsZFNlcnZpY2UuaWQpO1xuICAgIH1cblxuICAgIGNoaWxkU2VydmljZS5vbkRvbmUoZnVuY3Rpb24gKGRvbmVFdmVudCkge1xuICAgICAgX3RoaXMucmVtb3ZlQ2hpbGQoY2hpbGRTZXJ2aWNlLmlkKTtcblxuICAgICAgX3RoaXMuc2VuZCh0b1NDWE1MRXZlbnQoZG9uZUV2ZW50LCB7XG4gICAgICAgIG9yaWdpbjogY2hpbGRTZXJ2aWNlLmlkXG4gICAgICB9KSk7XG4gICAgfSkuc3RhcnQoKTtcbiAgICByZXR1cm4gYWN0b3I7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnNwYXduQmVoYXZpb3IgPSBmdW5jdGlvbiAoYmVoYXZpb3IsIGlkKSB7XG4gICAgdmFyIGFjdG9yUmVmID0gc3Bhd25CZWhhdmlvcihiZWhhdmlvciwge1xuICAgICAgaWQ6IGlkLFxuICAgICAgcGFyZW50OiB0aGlzXG4gICAgfSk7XG4gICAgdGhpcy5jaGlsZHJlbi5zZXQoaWQsIGFjdG9yUmVmKTtcbiAgICByZXR1cm4gYWN0b3JSZWY7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnNwYXduUHJvbWlzZSA9IGZ1bmN0aW9uIChwcm9taXNlLCBpZCkge1xuICAgIHZhciBfYTtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgY2FuY2VsZWQgPSBmYWxzZTtcbiAgICB2YXIgcmVzb2x2ZWREYXRhO1xuICAgIHByb21pc2UudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGlmICghY2FuY2VsZWQpIHtcbiAgICAgICAgcmVzb2x2ZWREYXRhID0gcmVzcG9uc2U7XG5cbiAgICAgICAgX3RoaXMucmVtb3ZlQ2hpbGQoaWQpO1xuXG4gICAgICAgIF90aGlzLnNlbmQodG9TQ1hNTEV2ZW50KGRvbmVJbnZva2UoaWQsIHJlc3BvbnNlKSwge1xuICAgICAgICAgIG9yaWdpbjogaWRcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgIH0sIGZ1bmN0aW9uIChlcnJvckRhdGEpIHtcbiAgICAgIGlmICghY2FuY2VsZWQpIHtcbiAgICAgICAgX3RoaXMucmVtb3ZlQ2hpbGQoaWQpO1xuXG4gICAgICAgIHZhciBlcnJvckV2ZW50ID0gZXJyb3IoaWQsIGVycm9yRGF0YSk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBTZW5kIFwiZXJyb3IucGxhdGZvcm0uaWRcIiB0byB0aGlzIChwYXJlbnQpLlxuICAgICAgICAgIF90aGlzLnNlbmQodG9TQ1hNTEV2ZW50KGVycm9yRXZlbnQsIHtcbiAgICAgICAgICAgIG9yaWdpbjogaWRcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgcmVwb3J0VW5oYW5kbGVkRXhjZXB0aW9uT25JbnZvY2F0aW9uKGVycm9yRGF0YSwgZXJyb3IsIGlkKTtcblxuICAgICAgICAgIGlmIChfdGhpcy5kZXZUb29scykge1xuICAgICAgICAgICAgX3RoaXMuZGV2VG9vbHMuc2VuZChlcnJvckV2ZW50LCBfdGhpcy5zdGF0ZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKF90aGlzLm1hY2hpbmUuc3RyaWN0KSB7XG4gICAgICAgICAgICAvLyBpdCB3b3VsZCBiZSBiZXR0ZXIgdG8gYWx3YXlzIHN0b3AgdGhlIHN0YXRlIG1hY2hpbmUgaWYgdW5oYW5kbGVkXG4gICAgICAgICAgICAvLyBleGNlcHRpb24vcHJvbWlzZSByZWplY3Rpb24gaGFwcGVucyBidXQgYmVjYXVzZSB3ZSBkb24ndCB3YW50IHRvXG4gICAgICAgICAgICAvLyBicmVhayBleGlzdGluZyBjb2RlIHNvIGVuZm9yY2UgaXQgb24gc3RyaWN0IG1vZGUgb25seSBlc3BlY2lhbGx5IHNvXG4gICAgICAgICAgICAvLyBiZWNhdXNlIGRvY3VtZW50YXRpb24gc2F5cyB0aGF0IG9uRXJyb3IgaXMgb3B0aW9uYWxcbiAgICAgICAgICAgIF90aGlzLnN0b3AoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICB2YXIgYWN0b3IgPSAoX2EgPSB7XG4gICAgICBpZDogaWQsXG4gICAgICBzZW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgICB9LFxuICAgICAgc3Vic2NyaWJlOiBmdW5jdGlvbiAobmV4dCwgaGFuZGxlRXJyb3IsIGNvbXBsZXRlKSB7XG4gICAgICAgIHZhciBvYnNlcnZlciA9IHRvT2JzZXJ2ZXIobmV4dCwgaGFuZGxlRXJyb3IsIGNvbXBsZXRlKTtcbiAgICAgICAgdmFyIHVuc3Vic2NyaWJlZCA9IGZhbHNlO1xuICAgICAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgaWYgKHVuc3Vic2NyaWJlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG9ic2VydmVyLm5leHQocmVzcG9uc2UpO1xuXG4gICAgICAgICAgaWYgKHVuc3Vic2NyaWJlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICBpZiAodW5zdWJzY3JpYmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB1bnN1YnNjcmliZWQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICBzdG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNhbmNlbGVkID0gdHJ1ZTtcbiAgICAgIH0sXG4gICAgICB0b0pTT046IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpZDogaWRcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICBnZXRTbmFwc2hvdDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZWREYXRhO1xuICAgICAgfVxuICAgIH0sIF9hW3N5bWJvbE9ic2VydmFibGVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSwgX2EpO1xuICAgIHRoaXMuY2hpbGRyZW4uc2V0KGlkLCBhY3Rvcik7XG4gICAgcmV0dXJuIGFjdG9yO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5zcGF3bkNhbGxiYWNrID0gZnVuY3Rpb24gKGNhbGxiYWNrLCBpZCkge1xuICAgIHZhciBfYTtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgY2FuY2VsZWQgPSBmYWxzZTtcbiAgICB2YXIgcmVjZWl2ZXJzID0gbmV3IFNldCgpO1xuICAgIHZhciBsaXN0ZW5lcnMgPSBuZXcgU2V0KCk7XG4gICAgdmFyIGVtaXR0ZWQ7XG5cbiAgICB2YXIgcmVjZWl2ZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICBlbWl0dGVkID0gZTtcbiAgICAgIGxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgICAgICByZXR1cm4gbGlzdGVuZXIoZSk7XG4gICAgICB9KTtcblxuICAgICAgaWYgKGNhbmNlbGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgX3RoaXMuc2VuZCh0b1NDWE1MRXZlbnQoZSwge1xuICAgICAgICBvcmlnaW46IGlkXG4gICAgICB9KSk7XG4gICAgfTtcblxuICAgIHZhciBjYWxsYmFja1N0b3A7XG5cbiAgICB0cnkge1xuICAgICAgY2FsbGJhY2tTdG9wID0gY2FsbGJhY2socmVjZWl2ZSwgZnVuY3Rpb24gKG5ld0xpc3RlbmVyKSB7XG4gICAgICAgIHJlY2VpdmVycy5hZGQobmV3TGlzdGVuZXIpO1xuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLnNlbmQoZXJyb3IoaWQsIGVycikpO1xuICAgIH1cblxuICAgIGlmIChpc1Byb21pc2VMaWtlKGNhbGxiYWNrU3RvcCkpIHtcbiAgICAgIC8vIGl0IHR1cm5lZCBvdXQgdG8gYmUgYW4gYXN5bmMgZnVuY3Rpb24sIGNhbid0IHJlbGlhYmx5IGNoZWNrIHRoaXMgYmVmb3JlIGNhbGxpbmcgYGNhbGxiYWNrYFxuICAgICAgLy8gYmVjYXVzZSB0cmFuc3BpbGVkIGFzeW5jIGZ1bmN0aW9ucyBhcmUgbm90IHJlY29nbml6YWJsZVxuICAgICAgcmV0dXJuIHRoaXMuc3Bhd25Qcm9taXNlKGNhbGxiYWNrU3RvcCwgaWQpO1xuICAgIH1cblxuICAgIHZhciBhY3RvciA9IChfYSA9IHtcbiAgICAgIGlkOiBpZCxcbiAgICAgIHNlbmQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICByZXR1cm4gcmVjZWl2ZXJzLmZvckVhY2goZnVuY3Rpb24gKHJlY2VpdmVyKSB7XG4gICAgICAgICAgcmV0dXJuIHJlY2VpdmVyKGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgc3Vic2NyaWJlOiBmdW5jdGlvbiAobmV4dCkge1xuICAgICAgICB2YXIgb2JzZXJ2ZXIgPSB0b09ic2VydmVyKG5leHQpO1xuICAgICAgICBsaXN0ZW5lcnMuYWRkKG9ic2VydmVyLm5leHQpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsaXN0ZW5lcnMuZGVsZXRlKG9ic2VydmVyLm5leHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICBzdG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNhbmNlbGVkID0gdHJ1ZTtcblxuICAgICAgICBpZiAoaXNGdW5jdGlvbihjYWxsYmFja1N0b3ApKSB7XG4gICAgICAgICAgY2FsbGJhY2tTdG9wKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB0b0pTT046IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpZDogaWRcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICBnZXRTbmFwc2hvdDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZW1pdHRlZDtcbiAgICAgIH1cbiAgICB9LCBfYVtzeW1ib2xPYnNlcnZhYmxlXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sIF9hKTtcbiAgICB0aGlzLmNoaWxkcmVuLnNldChpZCwgYWN0b3IpO1xuICAgIHJldHVybiBhY3RvcjtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc3Bhd25PYnNlcnZhYmxlID0gZnVuY3Rpb24gKHNvdXJjZSwgaWQpIHtcbiAgICB2YXIgX2E7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIGVtaXR0ZWQ7XG4gICAgdmFyIHN1YnNjcmlwdGlvbiA9IHNvdXJjZS5zdWJzY3JpYmUoZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICBlbWl0dGVkID0gdmFsdWU7XG5cbiAgICAgIF90aGlzLnNlbmQodG9TQ1hNTEV2ZW50KHZhbHVlLCB7XG4gICAgICAgIG9yaWdpbjogaWRcbiAgICAgIH0pKTtcbiAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICBfdGhpcy5yZW1vdmVDaGlsZChpZCk7XG5cbiAgICAgIF90aGlzLnNlbmQodG9TQ1hNTEV2ZW50KGVycm9yKGlkLCBlcnIpLCB7XG4gICAgICAgIG9yaWdpbjogaWRcbiAgICAgIH0pKTtcbiAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICBfdGhpcy5yZW1vdmVDaGlsZChpZCk7XG5cbiAgICAgIF90aGlzLnNlbmQodG9TQ1hNTEV2ZW50KGRvbmVJbnZva2UoaWQpLCB7XG4gICAgICAgIG9yaWdpbjogaWRcbiAgICAgIH0pKTtcbiAgICB9KTtcbiAgICB2YXIgYWN0b3IgPSAoX2EgPSB7XG4gICAgICBpZDogaWQsXG4gICAgICBzZW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgICB9LFxuICAgICAgc3Vic2NyaWJlOiBmdW5jdGlvbiAobmV4dCwgaGFuZGxlRXJyb3IsIGNvbXBsZXRlKSB7XG4gICAgICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5leHQsIGhhbmRsZUVycm9yLCBjb21wbGV0ZSk7XG4gICAgICB9LFxuICAgICAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9LFxuICAgICAgZ2V0U25hcHNob3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGVtaXR0ZWQ7XG4gICAgICB9LFxuICAgICAgdG9KU09OOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaWQ6IGlkXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSwgX2Fbc3ltYm9sT2JzZXJ2YWJsZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LCBfYSk7XG4gICAgdGhpcy5jaGlsZHJlbi5zZXQoaWQsIGFjdG9yKTtcbiAgICByZXR1cm4gYWN0b3I7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnNwYXduQWN0b3IgPSBmdW5jdGlvbiAoYWN0b3IsIG5hbWUpIHtcbiAgICB0aGlzLmNoaWxkcmVuLnNldChuYW1lLCBhY3Rvcik7XG4gICAgcmV0dXJuIGFjdG9yO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5zcGF3bkFjdGl2aXR5ID0gZnVuY3Rpb24gKGFjdGl2aXR5KSB7XG4gICAgdmFyIGltcGxlbWVudGF0aW9uID0gdGhpcy5tYWNoaW5lLm9wdGlvbnMgJiYgdGhpcy5tYWNoaW5lLm9wdGlvbnMuYWN0aXZpdGllcyA/IHRoaXMubWFjaGluZS5vcHRpb25zLmFjdGl2aXRpZXNbYWN0aXZpdHkudHlwZV0gOiB1bmRlZmluZWQ7XG5cbiAgICBpZiAoIWltcGxlbWVudGF0aW9uKSB7XG4gICAgICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICAgICAgd2FybihmYWxzZSwgXCJObyBpbXBsZW1lbnRhdGlvbiBmb3VuZCBmb3IgYWN0aXZpdHkgJ1wiLmNvbmNhdChhY3Rpdml0eS50eXBlLCBcIidcIikpO1xuICAgICAgfSAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tY29uc29sZVxuXG5cbiAgICAgIHJldHVybjtcbiAgICB9IC8vIFN0YXJ0IGltcGxlbWVudGF0aW9uXG5cblxuICAgIHZhciBkaXNwb3NlID0gaW1wbGVtZW50YXRpb24odGhpcy5zdGF0ZS5jb250ZXh0LCBhY3Rpdml0eSk7XG4gICAgdGhpcy5zcGF3bkVmZmVjdChhY3Rpdml0eS5pZCwgZGlzcG9zZSk7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnNwYXduRWZmZWN0ID0gZnVuY3Rpb24gKGlkLCBkaXNwb3NlKSB7XG4gICAgdmFyIF9hO1xuXG4gICAgdGhpcy5jaGlsZHJlbi5zZXQoaWQsIChfYSA9IHtcbiAgICAgIGlkOiBpZCxcbiAgICAgIHNlbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICAgIH0sXG4gICAgICBzdWJzY3JpYmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgc3RvcDogZGlzcG9zZSB8fCB1bmRlZmluZWQsXG4gICAgICBnZXRTbmFwc2hvdDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfSxcbiAgICAgIHRvSlNPTjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlkOiBpZFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0sIF9hW3N5bWJvbE9ic2VydmFibGVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSwgX2EpKTtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuYXR0YWNoRGV2ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBnbG9iYWwgPSBnZXRHbG9iYWwoKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuZGV2VG9vbHMgJiYgZ2xvYmFsKSB7XG4gICAgICBpZiAoZ2xvYmFsLl9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18pIHtcbiAgICAgICAgdmFyIGRldlRvb2xzT3B0aW9ucyA9IHR5cGVvZiB0aGlzLm9wdGlvbnMuZGV2VG9vbHMgPT09ICdvYmplY3QnID8gdGhpcy5vcHRpb25zLmRldlRvb2xzIDogdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLmRldlRvb2xzID0gZ2xvYmFsLl9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18uY29ubmVjdChfX2Fzc2lnbihfX2Fzc2lnbih7XG4gICAgICAgICAgbmFtZTogdGhpcy5pZCxcbiAgICAgICAgICBhdXRvUGF1c2U6IHRydWUsXG4gICAgICAgICAgc3RhdGVTYW5pdGl6ZXI6IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdmFsdWU6IHN0YXRlLnZhbHVlLFxuICAgICAgICAgICAgICBjb250ZXh0OiBzdGF0ZS5jb250ZXh0LFxuICAgICAgICAgICAgICBhY3Rpb25zOiBzdGF0ZS5hY3Rpb25zXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgZGV2VG9vbHNPcHRpb25zKSwge1xuICAgICAgICAgIGZlYXR1cmVzOiBfX2Fzc2lnbih7XG4gICAgICAgICAgICBqdW1wOiBmYWxzZSxcbiAgICAgICAgICAgIHNraXA6IGZhbHNlXG4gICAgICAgICAgfSwgZGV2VG9vbHNPcHRpb25zID8gZGV2VG9vbHNPcHRpb25zLmZlYXR1cmVzIDogdW5kZWZpbmVkKVxuICAgICAgICB9KSwgdGhpcy5tYWNoaW5lKTtcbiAgICAgICAgdGhpcy5kZXZUb29scy5pbml0KHRoaXMuc3RhdGUpO1xuICAgICAgfSAvLyBhZGQgWFN0YXRlLXNwZWNpZmljIGRldiB0b29saW5nIGhvb2tcblxuXG4gICAgICByZWdpc3RlclNlcnZpY2UodGhpcyk7XG4gICAgfVxuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiB0aGlzLmlkXG4gICAgfTtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGVbc3ltYm9sT2JzZXJ2YWJsZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLmdldFNuYXBzaG90ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gSW50ZXJwcmV0ZXJTdGF0dXMuTm90U3RhcnRlZCkge1xuICAgICAgcmV0dXJuIHRoaXMuaW5pdGlhbFN0YXRlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcbiAgfTtcbiAgLyoqXHJcbiAgICogVGhlIGRlZmF1bHQgaW50ZXJwcmV0ZXIgb3B0aW9uczpcclxuICAgKlxyXG4gICAqIC0gYGNsb2NrYCB1c2VzIHRoZSBnbG9iYWwgYHNldFRpbWVvdXRgIGFuZCBgY2xlYXJUaW1lb3V0YCBmdW5jdGlvbnNcclxuICAgKiAtIGBsb2dnZXJgIHVzZXMgdGhlIGdsb2JhbCBgY29uc29sZS5sb2coKWAgbWV0aG9kXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5kZWZhdWx0T3B0aW9ucyA9IHtcbiAgICBleGVjdXRlOiB0cnVlLFxuICAgIGRlZmVyRXZlbnRzOiB0cnVlLFxuICAgIGNsb2NrOiB7XG4gICAgICBzZXRUaW1lb3V0OiBmdW5jdGlvbiAoZm4sIG1zKSB7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZuLCBtcyk7XG4gICAgICB9LFxuICAgICAgY2xlYXJUaW1lb3V0OiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChpZCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBsb2dnZXI6IC8qI19fUFVSRV9fKi9jb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpLFxuICAgIGRldlRvb2xzOiBmYWxzZVxuICB9O1xuICBJbnRlcnByZXRlci5pbnRlcnByZXQgPSBpbnRlcnByZXQ7XG4gIHJldHVybiBJbnRlcnByZXRlcjtcbn0oKTtcblxudmFyIHJlc29sdmVTcGF3bk9wdGlvbnMgPSBmdW5jdGlvbiAobmFtZU9yT3B0aW9ucykge1xuICBpZiAoaXNTdHJpbmcobmFtZU9yT3B0aW9ucykpIHtcbiAgICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIERFRkFVTFRfU1BBV05fT1BUSU9OUyksIHtcbiAgICAgIG5hbWU6IG5hbWVPck9wdGlvbnNcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbihfX2Fzc2lnbih7fSwgREVGQVVMVF9TUEFXTl9PUFRJT05TKSwge1xuICAgIG5hbWU6IHVuaXF1ZUlkKClcbiAgfSksIG5hbWVPck9wdGlvbnMpO1xufTtcblxuZnVuY3Rpb24gc3Bhd24oZW50aXR5LCBuYW1lT3JPcHRpb25zKSB7XG4gIHZhciByZXNvbHZlZE9wdGlvbnMgPSByZXNvbHZlU3Bhd25PcHRpb25zKG5hbWVPck9wdGlvbnMpO1xuICByZXR1cm4gY29uc3VtZShmdW5jdGlvbiAoc2VydmljZSkge1xuICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgdmFyIGlzTGF6eUVudGl0eSA9IGlzTWFjaGluZShlbnRpdHkpIHx8IGlzRnVuY3Rpb24oZW50aXR5KTtcbiAgICAgIHdhcm4oISFzZXJ2aWNlIHx8IGlzTGF6eUVudGl0eSwgXCJBdHRlbXB0ZWQgdG8gc3Bhd24gYW4gQWN0b3IgKElEOiBcXFwiXCIuY29uY2F0KGlzTWFjaGluZShlbnRpdHkpID8gZW50aXR5LmlkIDogJ3VuZGVmaW5lZCcsIFwiXFxcIikgb3V0c2lkZSBvZiBhIHNlcnZpY2UuIFRoaXMgd2lsbCBoYXZlIG5vIGVmZmVjdC5cIikpO1xuICAgIH1cblxuICAgIGlmIChzZXJ2aWNlKSB7XG4gICAgICByZXR1cm4gc2VydmljZS5zcGF3bihlbnRpdHksIHJlc29sdmVkT3B0aW9ucy5uYW1lLCByZXNvbHZlZE9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY3JlYXRlRGVmZXJyZWRBY3RvcihlbnRpdHksIHJlc29sdmVkT3B0aW9ucy5uYW1lKTtcbiAgICB9XG4gIH0pO1xufVxuLyoqXHJcbiAqIENyZWF0ZXMgYSBuZXcgSW50ZXJwcmV0ZXIgaW5zdGFuY2UgZm9yIHRoZSBnaXZlbiBtYWNoaW5lIHdpdGggdGhlIHByb3ZpZGVkIG9wdGlvbnMsIGlmIGFueS5cclxuICpcclxuICogQHBhcmFtIG1hY2hpbmUgVGhlIG1hY2hpbmUgdG8gaW50ZXJwcmV0XHJcbiAqIEBwYXJhbSBvcHRpb25zIEludGVycHJldGVyIG9wdGlvbnNcclxuICovXG5cbmZ1bmN0aW9uIGludGVycHJldChtYWNoaW5lLCBvcHRpb25zKSB7XG4gIHZhciBpbnRlcnByZXRlciA9IG5ldyBJbnRlcnByZXRlcihtYWNoaW5lLCBvcHRpb25zKTtcbiAgcmV0dXJuIGludGVycHJldGVyO1xufVxuXG5leHBvcnQgeyBJbnRlcnByZXRlciwgSW50ZXJwcmV0ZXJTdGF0dXMsIGludGVycHJldCwgc3Bhd24gfTtcbiIsImltcG9ydCB7IF9fYXNzaWduLCBfX3Jlc3QgfSBmcm9tICcuL192aXJ0dWFsL190c2xpYi5qcyc7XG5pbXBvcnQgJy4vdHlwZXMuanMnO1xuaW1wb3J0IHsgaW52b2tlIH0gZnJvbSAnLi9hY3Rpb25UeXBlcy5qcyc7XG5pbXBvcnQgJy4vdXRpbHMuanMnO1xuaW1wb3J0ICcuL2Vudmlyb25tZW50LmpzJztcblxuZnVuY3Rpb24gdG9JbnZva2VTb3VyY2Uoc3JjKSB7XG4gIGlmICh0eXBlb2Ygc3JjID09PSAnc3RyaW5nJykge1xuICAgIHZhciBzaW1wbGVTcmMgPSB7XG4gICAgICB0eXBlOiBzcmNcbiAgICB9O1xuXG4gICAgc2ltcGxlU3JjLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHNyYztcbiAgICB9OyAvLyB2NCBjb21wYXQgLSBUT0RPOiByZW1vdmUgaW4gdjVcblxuXG4gICAgcmV0dXJuIHNpbXBsZVNyYztcbiAgfVxuXG4gIHJldHVybiBzcmM7XG59XG5mdW5jdGlvbiB0b0ludm9rZURlZmluaXRpb24oaW52b2tlQ29uZmlnKSB7XG4gIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7XG4gICAgdHlwZTogaW52b2tlXG4gIH0sIGludm9rZUNvbmZpZyksIHtcbiAgICB0b0pTT046IGZ1bmN0aW9uICgpIHtcbiAgICAgIGludm9rZUNvbmZpZy5vbkRvbmU7XG4gICAgICAgICAgaW52b2tlQ29uZmlnLm9uRXJyb3I7XG4gICAgICAgICAgdmFyIGludm9rZURlZiA9IF9fcmVzdChpbnZva2VDb25maWcsIFtcIm9uRG9uZVwiLCBcIm9uRXJyb3JcIl0pO1xuXG4gICAgICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIGludm9rZURlZiksIHtcbiAgICAgICAgdHlwZTogaW52b2tlLFxuICAgICAgICBzcmM6IHRvSW52b2tlU291cmNlKGludm9rZUNvbmZpZy5zcmMpXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgeyB0b0ludm9rZURlZmluaXRpb24sIHRvSW52b2tlU291cmNlIH07XG4iLCJpbXBvcnQgeyBfX3ZhbHVlcyB9IGZyb20gJy4vX3ZpcnR1YWwvX3RzbGliLmpzJztcbmltcG9ydCB7IG1hdGNoZXNTdGF0ZSB9IGZyb20gJy4vdXRpbHMuanMnO1xuXG5mdW5jdGlvbiBtYXBTdGF0ZShzdGF0ZU1hcCwgc3RhdGVJZCkge1xuICB2YXIgZV8xLCBfYTtcblxuICB2YXIgZm91bmRTdGF0ZUlkO1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgX2IgPSBfX3ZhbHVlcyhPYmplY3Qua2V5cyhzdGF0ZU1hcCkpLCBfYyA9IF9iLm5leHQoKTsgIV9jLmRvbmU7IF9jID0gX2IubmV4dCgpKSB7XG4gICAgICB2YXIgbWFwcGVkU3RhdGVJZCA9IF9jLnZhbHVlO1xuXG4gICAgICBpZiAobWF0Y2hlc1N0YXRlKG1hcHBlZFN0YXRlSWQsIHN0YXRlSWQpICYmICghZm91bmRTdGF0ZUlkIHx8IHN0YXRlSWQubGVuZ3RoID4gZm91bmRTdGF0ZUlkLmxlbmd0aCkpIHtcbiAgICAgICAgZm91bmRTdGF0ZUlkID0gbWFwcGVkU3RhdGVJZDtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVfMV8xKSB7XG4gICAgZV8xID0ge1xuICAgICAgZXJyb3I6IGVfMV8xXG4gICAgfTtcbiAgfSBmaW5hbGx5IHtcbiAgICB0cnkge1xuICAgICAgaWYgKF9jICYmICFfYy5kb25lICYmIChfYSA9IF9iLnJldHVybikpIF9hLmNhbGwoX2IpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHN0YXRlTWFwW2ZvdW5kU3RhdGVJZF07XG59XG5cbmV4cG9ydCB7IG1hcFN0YXRlIH07XG4iLCJpbXBvcnQgeyBfX3ZhbHVlcywgX19yZWFkIH0gZnJvbSAnLi9fdmlydHVhbC9fdHNsaWIuanMnO1xuaW1wb3J0IHsgU3RhdGUgfSBmcm9tICcuL1N0YXRlLmpzJztcblxuZnVuY3Rpb24gbWF0Y2hTdGF0ZShzdGF0ZSwgcGF0dGVybnMsIGRlZmF1bHRWYWx1ZSkge1xuICB2YXIgZV8xLCBfYTtcblxuICB2YXIgcmVzb2x2ZWRTdGF0ZSA9IFN0YXRlLmZyb20oc3RhdGUsIHN0YXRlIGluc3RhbmNlb2YgU3RhdGUgPyBzdGF0ZS5jb250ZXh0IDogdW5kZWZpbmVkKTtcblxuICB0cnkge1xuICAgIGZvciAodmFyIHBhdHRlcm5zXzEgPSBfX3ZhbHVlcyhwYXR0ZXJucyksIHBhdHRlcm5zXzFfMSA9IHBhdHRlcm5zXzEubmV4dCgpOyAhcGF0dGVybnNfMV8xLmRvbmU7IHBhdHRlcm5zXzFfMSA9IHBhdHRlcm5zXzEubmV4dCgpKSB7XG4gICAgICB2YXIgX2IgPSBfX3JlYWQocGF0dGVybnNfMV8xLnZhbHVlLCAyKSxcbiAgICAgICAgICBzdGF0ZVZhbHVlID0gX2JbMF0sXG4gICAgICAgICAgZ2V0VmFsdWUgPSBfYlsxXTtcblxuICAgICAgaWYgKHJlc29sdmVkU3RhdGUubWF0Y2hlcyhzdGF0ZVZhbHVlKSkge1xuICAgICAgICByZXR1cm4gZ2V0VmFsdWUocmVzb2x2ZWRTdGF0ZSk7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlXzFfMSkge1xuICAgIGVfMSA9IHtcbiAgICAgIGVycm9yOiBlXzFfMVxuICAgIH07XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChwYXR0ZXJuc18xXzEgJiYgIXBhdHRlcm5zXzFfMS5kb25lICYmIChfYSA9IHBhdHRlcm5zXzEucmV0dXJuKSkgX2EuY2FsbChwYXR0ZXJuc18xKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkZWZhdWx0VmFsdWUocmVzb2x2ZWRTdGF0ZSk7XG59XG5cbmV4cG9ydCB7IG1hdGNoU3RhdGUgfTtcbiIsInZhciBjaGlsZHJlbiA9IC8qI19fUFVSRV9fKi9uZXcgTWFwKCk7XG52YXIgc2Vzc2lvbklkSW5kZXggPSAwO1xudmFyIHJlZ2lzdHJ5ID0ge1xuICBib29rSWQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gXCJ4OlwiLmNvbmNhdChzZXNzaW9uSWRJbmRleCsrKTtcbiAgfSxcbiAgcmVnaXN0ZXI6IGZ1bmN0aW9uIChpZCwgYWN0b3IpIHtcbiAgICBjaGlsZHJlbi5zZXQoaWQsIGFjdG9yKTtcbiAgICByZXR1cm4gaWQ7XG4gIH0sXG4gIGdldDogZnVuY3Rpb24gKGlkKSB7XG4gICAgcmV0dXJuIGNoaWxkcmVuLmdldChpZCk7XG4gIH0sXG4gIGZyZWU6IGZ1bmN0aW9uIChpZCkge1xuICAgIGNoaWxkcmVuLmRlbGV0ZShpZCk7XG4gIH1cbn07XG5cbmV4cG9ydCB7IHJlZ2lzdHJ5IH07XG4iLCJpbXBvcnQgeyBfX2Fzc2lnbiB9IGZyb20gJy4vX3ZpcnR1YWwvX3RzbGliLmpzJztcblxudmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICBkZWZlckV2ZW50czogZmFsc2Vcbn07XG5cbnZhciBTY2hlZHVsZXIgPVxuLyojX19QVVJFX18qL1xuXG4vKiogQGNsYXNzICovXG5mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFNjaGVkdWxlcihvcHRpb25zKSB7XG4gICAgdGhpcy5wcm9jZXNzaW5nRXZlbnQgPSBmYWxzZTtcbiAgICB0aGlzLnF1ZXVlID0gW107XG4gICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIHRoaXMub3B0aW9ucyA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCBkZWZhdWx0T3B0aW9ucyksIG9wdGlvbnMpO1xuICB9XG5cbiAgU2NoZWR1bGVyLnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG5cbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmRlZmVyRXZlbnRzKSB7XG4gICAgICAgIHRoaXMuc2NoZWR1bGUoY2FsbGJhY2spO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMucHJvY2VzcyhjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgdGhpcy5mbHVzaEV2ZW50cygpO1xuICB9O1xuXG4gIFNjaGVkdWxlci5wcm90b3R5cGUuc2NoZWR1bGUgPSBmdW5jdGlvbiAodGFzaykge1xuICAgIGlmICghdGhpcy5pbml0aWFsaXplZCB8fCB0aGlzLnByb2Nlc3NpbmdFdmVudCkge1xuICAgICAgdGhpcy5xdWV1ZS5wdXNoKHRhc2spO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnF1ZXVlLmxlbmd0aCAhPT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFdmVudCBxdWV1ZSBzaG91bGQgYmUgZW1wdHkgd2hlbiBpdCBpcyBub3QgcHJvY2Vzc2luZyBldmVudHMnKTtcbiAgICB9XG5cbiAgICB0aGlzLnByb2Nlc3ModGFzayk7XG4gICAgdGhpcy5mbHVzaEV2ZW50cygpO1xuICB9O1xuXG4gIFNjaGVkdWxlci5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5xdWV1ZSA9IFtdO1xuICB9O1xuXG4gIFNjaGVkdWxlci5wcm90b3R5cGUuZmx1c2hFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG5leHRDYWxsYmFjayA9IHRoaXMucXVldWUuc2hpZnQoKTtcblxuICAgIHdoaWxlIChuZXh0Q2FsbGJhY2spIHtcbiAgICAgIHRoaXMucHJvY2VzcyhuZXh0Q2FsbGJhY2spO1xuICAgICAgbmV4dENhbGxiYWNrID0gdGhpcy5xdWV1ZS5zaGlmdCgpO1xuICAgIH1cbiAgfTtcblxuICBTY2hlZHVsZXIucHJvdG90eXBlLnByb2Nlc3MgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICB0aGlzLnByb2Nlc3NpbmdFdmVudCA9IHRydWU7XG5cbiAgICB0cnkge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyB0aGVyZSBpcyBubyB1c2UgdG8ga2VlcCB0aGUgZnV0dXJlIGV2ZW50c1xuICAgICAgLy8gYXMgdGhlIHNpdHVhdGlvbiBpcyBub3QgYW55bW9yZSB0aGUgc2FtZVxuICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgdGhyb3cgZTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5wcm9jZXNzaW5nRXZlbnQgPSBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIFNjaGVkdWxlcjtcbn0oKTtcblxuZXhwb3J0IHsgU2NoZWR1bGVyIH07XG4iLCJmdW5jdGlvbiBjcmVhdGVTY2hlbWEoc2NoZW1hKSB7XG4gIHJldHVybiBzY2hlbWE7XG59XG52YXIgdCA9IGNyZWF0ZVNjaGVtYTtcblxuZXhwb3J0IHsgY3JlYXRlU2NoZW1hLCB0IH07XG4iLCIvKipcclxuICogTWFpbnRhaW5zIGEgc3RhY2sgb2YgdGhlIGN1cnJlbnQgc2VydmljZSBpbiBzY29wZS5cclxuICogVGhpcyBpcyB1c2VkIHRvIHByb3ZpZGUgdGhlIGNvcnJlY3Qgc2VydmljZSB0byBzcGF3bigpLlxyXG4gKi9cbnZhciBzZXJ2aWNlU3RhY2sgPSBbXTtcbnZhciBwcm92aWRlID0gZnVuY3Rpb24gKHNlcnZpY2UsIGZuKSB7XG4gIHNlcnZpY2VTdGFjay5wdXNoKHNlcnZpY2UpO1xuICB2YXIgcmVzdWx0ID0gZm4oc2VydmljZSk7XG4gIHNlcnZpY2VTdGFjay5wb3AoKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgY29uc3VtZSA9IGZ1bmN0aW9uIChmbikge1xuICByZXR1cm4gZm4oc2VydmljZVN0YWNrW3NlcnZpY2VTdGFjay5sZW5ndGggLSAxXSk7XG59O1xuXG5leHBvcnQgeyBjb25zdW1lLCBwcm92aWRlIH07XG4iLCJpbXBvcnQgeyBfX3ZhbHVlcywgX19zcHJlYWRBcnJheSwgX19yZWFkIH0gZnJvbSAnLi9fdmlydHVhbC9fdHNsaWIuanMnO1xuaW1wb3J0IHsgZmxhdHRlbiB9IGZyb20gJy4vdXRpbHMuanMnO1xuXG52YXIgaXNMZWFmTm9kZSA9IGZ1bmN0aW9uIChzdGF0ZU5vZGUpIHtcbiAgcmV0dXJuIHN0YXRlTm9kZS50eXBlID09PSAnYXRvbWljJyB8fCBzdGF0ZU5vZGUudHlwZSA9PT0gJ2ZpbmFsJztcbn07XG5mdW5jdGlvbiBnZXRBbGxDaGlsZHJlbihzdGF0ZU5vZGUpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHN0YXRlTm9kZS5zdGF0ZXMpLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIHN0YXRlTm9kZS5zdGF0ZXNba2V5XTtcbiAgfSk7XG59XG5mdW5jdGlvbiBnZXRDaGlsZHJlbihzdGF0ZU5vZGUpIHtcbiAgcmV0dXJuIGdldEFsbENoaWxkcmVuKHN0YXRlTm9kZSkuZmlsdGVyKGZ1bmN0aW9uIChzbikge1xuICAgIHJldHVybiBzbi50eXBlICE9PSAnaGlzdG9yeSc7XG4gIH0pO1xufVxuZnVuY3Rpb24gZ2V0QWxsU3RhdGVOb2RlcyhzdGF0ZU5vZGUpIHtcbiAgdmFyIHN0YXRlTm9kZXMgPSBbc3RhdGVOb2RlXTtcblxuICBpZiAoaXNMZWFmTm9kZShzdGF0ZU5vZGUpKSB7XG4gICAgcmV0dXJuIHN0YXRlTm9kZXM7XG4gIH1cblxuICByZXR1cm4gc3RhdGVOb2Rlcy5jb25jYXQoZmxhdHRlbihnZXRDaGlsZHJlbihzdGF0ZU5vZGUpLm1hcChnZXRBbGxTdGF0ZU5vZGVzKSkpO1xufVxuZnVuY3Rpb24gZ2V0Q29uZmlndXJhdGlvbihwcmV2U3RhdGVOb2Rlcywgc3RhdGVOb2Rlcykge1xuICB2YXIgZV8xLCBfYSwgZV8yLCBfYiwgZV8zLCBfYywgZV80LCBfZDtcblxuICB2YXIgcHJldkNvbmZpZ3VyYXRpb24gPSBuZXcgU2V0KHByZXZTdGF0ZU5vZGVzKTtcbiAgdmFyIHByZXZBZGpMaXN0ID0gZ2V0QWRqTGlzdChwcmV2Q29uZmlndXJhdGlvbik7XG4gIHZhciBjb25maWd1cmF0aW9uID0gbmV3IFNldChzdGF0ZU5vZGVzKTtcblxuICB0cnkge1xuICAgIC8vIGFkZCBhbGwgYW5jZXN0b3JzXG4gICAgZm9yICh2YXIgY29uZmlndXJhdGlvbl8xID0gX192YWx1ZXMoY29uZmlndXJhdGlvbiksIGNvbmZpZ3VyYXRpb25fMV8xID0gY29uZmlndXJhdGlvbl8xLm5leHQoKTsgIWNvbmZpZ3VyYXRpb25fMV8xLmRvbmU7IGNvbmZpZ3VyYXRpb25fMV8xID0gY29uZmlndXJhdGlvbl8xLm5leHQoKSkge1xuICAgICAgdmFyIHMgPSBjb25maWd1cmF0aW9uXzFfMS52YWx1ZTtcbiAgICAgIHZhciBtID0gcy5wYXJlbnQ7XG5cbiAgICAgIHdoaWxlIChtICYmICFjb25maWd1cmF0aW9uLmhhcyhtKSkge1xuICAgICAgICBjb25maWd1cmF0aW9uLmFkZChtKTtcbiAgICAgICAgbSA9IG0ucGFyZW50O1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZV8xXzEpIHtcbiAgICBlXzEgPSB7XG4gICAgICBlcnJvcjogZV8xXzFcbiAgICB9O1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoY29uZmlndXJhdGlvbl8xXzEgJiYgIWNvbmZpZ3VyYXRpb25fMV8xLmRvbmUgJiYgKF9hID0gY29uZmlndXJhdGlvbl8xLnJldHVybikpIF9hLmNhbGwoY29uZmlndXJhdGlvbl8xKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHZhciBhZGpMaXN0ID0gZ2V0QWRqTGlzdChjb25maWd1cmF0aW9uKTtcblxuICB0cnkge1xuICAgIC8vIGFkZCBkZXNjZW5kYW50c1xuICAgIGZvciAodmFyIGNvbmZpZ3VyYXRpb25fMiA9IF9fdmFsdWVzKGNvbmZpZ3VyYXRpb24pLCBjb25maWd1cmF0aW9uXzJfMSA9IGNvbmZpZ3VyYXRpb25fMi5uZXh0KCk7ICFjb25maWd1cmF0aW9uXzJfMS5kb25lOyBjb25maWd1cmF0aW9uXzJfMSA9IGNvbmZpZ3VyYXRpb25fMi5uZXh0KCkpIHtcbiAgICAgIHZhciBzID0gY29uZmlndXJhdGlvbl8yXzEudmFsdWU7IC8vIGlmIHByZXZpb3VzbHkgYWN0aXZlLCBhZGQgZXhpc3RpbmcgY2hpbGQgbm9kZXNcblxuICAgICAgaWYgKHMudHlwZSA9PT0gJ2NvbXBvdW5kJyAmJiAoIWFkakxpc3QuZ2V0KHMpIHx8ICFhZGpMaXN0LmdldChzKS5sZW5ndGgpKSB7XG4gICAgICAgIGlmIChwcmV2QWRqTGlzdC5nZXQocykpIHtcbiAgICAgICAgICBwcmV2QWRqTGlzdC5nZXQocykuZm9yRWFjaChmdW5jdGlvbiAoc24pIHtcbiAgICAgICAgICAgIHJldHVybiBjb25maWd1cmF0aW9uLmFkZChzbik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcy5pbml0aWFsU3RhdGVOb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChzbikge1xuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZ3VyYXRpb24uYWRkKHNuKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHMudHlwZSA9PT0gJ3BhcmFsbGVsJykge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmb3IgKHZhciBfZSA9IChlXzMgPSB2b2lkIDAsIF9fdmFsdWVzKGdldENoaWxkcmVuKHMpKSksIF9mID0gX2UubmV4dCgpOyAhX2YuZG9uZTsgX2YgPSBfZS5uZXh0KCkpIHtcbiAgICAgICAgICAgICAgdmFyIGNoaWxkID0gX2YudmFsdWU7XG5cbiAgICAgICAgICAgICAgaWYgKCFjb25maWd1cmF0aW9uLmhhcyhjaGlsZCkpIHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uLmFkZChjaGlsZCk7XG5cbiAgICAgICAgICAgICAgICBpZiAocHJldkFkakxpc3QuZ2V0KGNoaWxkKSkge1xuICAgICAgICAgICAgICAgICAgcHJldkFkakxpc3QuZ2V0KGNoaWxkKS5mb3JFYWNoKGZ1bmN0aW9uIChzbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29uZmlndXJhdGlvbi5hZGQoc24pO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGNoaWxkLmluaXRpYWxTdGF0ZU5vZGVzLmZvckVhY2goZnVuY3Rpb24gKHNuKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb25maWd1cmF0aW9uLmFkZChzbik7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlXzNfMSkge1xuICAgICAgICAgICAgZV8zID0ge1xuICAgICAgICAgICAgICBlcnJvcjogZV8zXzFcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGlmIChfZiAmJiAhX2YuZG9uZSAmJiAoX2MgPSBfZS5yZXR1cm4pKSBfYy5jYWxsKF9lKTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIGlmIChlXzMpIHRocm93IGVfMy5lcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVfMl8xKSB7XG4gICAgZV8yID0ge1xuICAgICAgZXJyb3I6IGVfMl8xXG4gICAgfTtcbiAgfSBmaW5hbGx5IHtcbiAgICB0cnkge1xuICAgICAgaWYgKGNvbmZpZ3VyYXRpb25fMl8xICYmICFjb25maWd1cmF0aW9uXzJfMS5kb25lICYmIChfYiA9IGNvbmZpZ3VyYXRpb25fMi5yZXR1cm4pKSBfYi5jYWxsKGNvbmZpZ3VyYXRpb25fMik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChlXzIpIHRocm93IGVfMi5lcnJvcjtcbiAgICB9XG4gIH1cblxuICB0cnkge1xuICAgIC8vIGFkZCBhbGwgYW5jZXN0b3JzXG4gICAgZm9yICh2YXIgY29uZmlndXJhdGlvbl8zID0gX192YWx1ZXMoY29uZmlndXJhdGlvbiksIGNvbmZpZ3VyYXRpb25fM18xID0gY29uZmlndXJhdGlvbl8zLm5leHQoKTsgIWNvbmZpZ3VyYXRpb25fM18xLmRvbmU7IGNvbmZpZ3VyYXRpb25fM18xID0gY29uZmlndXJhdGlvbl8zLm5leHQoKSkge1xuICAgICAgdmFyIHMgPSBjb25maWd1cmF0aW9uXzNfMS52YWx1ZTtcbiAgICAgIHZhciBtID0gcy5wYXJlbnQ7XG5cbiAgICAgIHdoaWxlIChtICYmICFjb25maWd1cmF0aW9uLmhhcyhtKSkge1xuICAgICAgICBjb25maWd1cmF0aW9uLmFkZChtKTtcbiAgICAgICAgbSA9IG0ucGFyZW50O1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZV80XzEpIHtcbiAgICBlXzQgPSB7XG4gICAgICBlcnJvcjogZV80XzFcbiAgICB9O1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoY29uZmlndXJhdGlvbl8zXzEgJiYgIWNvbmZpZ3VyYXRpb25fM18xLmRvbmUgJiYgKF9kID0gY29uZmlndXJhdGlvbl8zLnJldHVybikpIF9kLmNhbGwoY29uZmlndXJhdGlvbl8zKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKGVfNCkgdGhyb3cgZV80LmVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjb25maWd1cmF0aW9uO1xufVxuXG5mdW5jdGlvbiBnZXRWYWx1ZUZyb21BZGooYmFzZU5vZGUsIGFkakxpc3QpIHtcbiAgdmFyIGNoaWxkU3RhdGVOb2RlcyA9IGFkakxpc3QuZ2V0KGJhc2VOb2RlKTtcblxuICBpZiAoIWNoaWxkU3RhdGVOb2Rlcykge1xuICAgIHJldHVybiB7fTsgLy8gdG9kbzogZml4P1xuICB9XG5cbiAgaWYgKGJhc2VOb2RlLnR5cGUgPT09ICdjb21wb3VuZCcpIHtcbiAgICB2YXIgY2hpbGRTdGF0ZU5vZGUgPSBjaGlsZFN0YXRlTm9kZXNbMF07XG5cbiAgICBpZiAoY2hpbGRTdGF0ZU5vZGUpIHtcbiAgICAgIGlmIChpc0xlYWZOb2RlKGNoaWxkU3RhdGVOb2RlKSkge1xuICAgICAgICByZXR1cm4gY2hpbGRTdGF0ZU5vZGUua2V5O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9XG5cbiAgdmFyIHN0YXRlVmFsdWUgPSB7fTtcbiAgY2hpbGRTdGF0ZU5vZGVzLmZvckVhY2goZnVuY3Rpb24gKGNzbikge1xuICAgIHN0YXRlVmFsdWVbY3NuLmtleV0gPSBnZXRWYWx1ZUZyb21BZGooY3NuLCBhZGpMaXN0KTtcbiAgfSk7XG4gIHJldHVybiBzdGF0ZVZhbHVlO1xufVxuXG5mdW5jdGlvbiBnZXRBZGpMaXN0KGNvbmZpZ3VyYXRpb24pIHtcbiAgdmFyIGVfNSwgX2E7XG5cbiAgdmFyIGFkakxpc3QgPSBuZXcgTWFwKCk7XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBjb25maWd1cmF0aW9uXzQgPSBfX3ZhbHVlcyhjb25maWd1cmF0aW9uKSwgY29uZmlndXJhdGlvbl80XzEgPSBjb25maWd1cmF0aW9uXzQubmV4dCgpOyAhY29uZmlndXJhdGlvbl80XzEuZG9uZTsgY29uZmlndXJhdGlvbl80XzEgPSBjb25maWd1cmF0aW9uXzQubmV4dCgpKSB7XG4gICAgICB2YXIgcyA9IGNvbmZpZ3VyYXRpb25fNF8xLnZhbHVlO1xuXG4gICAgICBpZiAoIWFkakxpc3QuaGFzKHMpKSB7XG4gICAgICAgIGFkakxpc3Quc2V0KHMsIFtdKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHMucGFyZW50KSB7XG4gICAgICAgIGlmICghYWRqTGlzdC5oYXMocy5wYXJlbnQpKSB7XG4gICAgICAgICAgYWRqTGlzdC5zZXQocy5wYXJlbnQsIFtdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkakxpc3QuZ2V0KHMucGFyZW50KS5wdXNoKHMpO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZV81XzEpIHtcbiAgICBlXzUgPSB7XG4gICAgICBlcnJvcjogZV81XzFcbiAgICB9O1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoY29uZmlndXJhdGlvbl80XzEgJiYgIWNvbmZpZ3VyYXRpb25fNF8xLmRvbmUgJiYgKF9hID0gY29uZmlndXJhdGlvbl80LnJldHVybikpIF9hLmNhbGwoY29uZmlndXJhdGlvbl80KTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKGVfNSkgdGhyb3cgZV81LmVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhZGpMaXN0O1xufVxuZnVuY3Rpb24gZ2V0VmFsdWUocm9vdE5vZGUsIGNvbmZpZ3VyYXRpb24pIHtcbiAgdmFyIGNvbmZpZyA9IGdldENvbmZpZ3VyYXRpb24oW3Jvb3ROb2RlXSwgY29uZmlndXJhdGlvbik7XG4gIHJldHVybiBnZXRWYWx1ZUZyb21BZGoocm9vdE5vZGUsIGdldEFkakxpc3QoY29uZmlnKSk7XG59XG5mdW5jdGlvbiBoYXMoaXRlcmFibGUsIGl0ZW0pIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoaXRlcmFibGUpKSB7XG4gICAgcmV0dXJuIGl0ZXJhYmxlLnNvbWUoZnVuY3Rpb24gKG1lbWJlcikge1xuICAgICAgcmV0dXJuIG1lbWJlciA9PT0gaXRlbTtcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChpdGVyYWJsZSBpbnN0YW5jZW9mIFNldCkge1xuICAgIHJldHVybiBpdGVyYWJsZS5oYXMoaXRlbSk7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7IC8vIFRPRE86IGZpeFxufVxuZnVuY3Rpb24gbmV4dEV2ZW50cyhjb25maWd1cmF0aW9uKSB7XG4gIHJldHVybiBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQobmV3IFNldChmbGF0dGVuKF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChjb25maWd1cmF0aW9uLm1hcChmdW5jdGlvbiAoc24pIHtcbiAgICByZXR1cm4gc24ub3duRXZlbnRzO1xuICB9KSksIGZhbHNlKSkpKSwgZmFsc2UpO1xufVxuZnVuY3Rpb24gaXNJbkZpbmFsU3RhdGUoY29uZmlndXJhdGlvbiwgc3RhdGVOb2RlKSB7XG4gIGlmIChzdGF0ZU5vZGUudHlwZSA9PT0gJ2NvbXBvdW5kJykge1xuICAgIHJldHVybiBnZXRDaGlsZHJlbihzdGF0ZU5vZGUpLnNvbWUoZnVuY3Rpb24gKHMpIHtcbiAgICAgIHJldHVybiBzLnR5cGUgPT09ICdmaW5hbCcgJiYgaGFzKGNvbmZpZ3VyYXRpb24sIHMpO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKHN0YXRlTm9kZS50eXBlID09PSAncGFyYWxsZWwnKSB7XG4gICAgcmV0dXJuIGdldENoaWxkcmVuKHN0YXRlTm9kZSkuZXZlcnkoZnVuY3Rpb24gKHNuKSB7XG4gICAgICByZXR1cm4gaXNJbkZpbmFsU3RhdGUoY29uZmlndXJhdGlvbiwgc24pO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gZ2V0TWV0YShjb25maWd1cmF0aW9uKSB7XG4gIGlmIChjb25maWd1cmF0aW9uID09PSB2b2lkIDApIHtcbiAgICBjb25maWd1cmF0aW9uID0gW107XG4gIH1cblxuICByZXR1cm4gY29uZmlndXJhdGlvbi5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgc3RhdGVOb2RlKSB7XG4gICAgaWYgKHN0YXRlTm9kZS5tZXRhICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGFjY1tzdGF0ZU5vZGUuaWRdID0gc3RhdGVOb2RlLm1ldGE7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFjYztcbiAgfSwge30pO1xufVxuZnVuY3Rpb24gZ2V0VGFnc0Zyb21Db25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb24pIHtcbiAgcmV0dXJuIG5ldyBTZXQoZmxhdHRlbihjb25maWd1cmF0aW9uLm1hcChmdW5jdGlvbiAoc24pIHtcbiAgICByZXR1cm4gc24udGFncztcbiAgfSkpKTtcbn1cblxuZXhwb3J0IHsgZ2V0QWRqTGlzdCwgZ2V0QWxsQ2hpbGRyZW4sIGdldEFsbFN0YXRlTm9kZXMsIGdldENoaWxkcmVuLCBnZXRDb25maWd1cmF0aW9uLCBnZXRNZXRhLCBnZXRUYWdzRnJvbUNvbmZpZ3VyYXRpb24sIGdldFZhbHVlLCBoYXMsIGlzSW5GaW5hbFN0YXRlLCBpc0xlYWZOb2RlLCBuZXh0RXZlbnRzIH07XG4iLCJ2YXIgQWN0aW9uVHlwZXM7XG5cbihmdW5jdGlvbiAoQWN0aW9uVHlwZXMpIHtcbiAgQWN0aW9uVHlwZXNbXCJTdGFydFwiXSA9IFwieHN0YXRlLnN0YXJ0XCI7XG4gIEFjdGlvblR5cGVzW1wiU3RvcFwiXSA9IFwieHN0YXRlLnN0b3BcIjtcbiAgQWN0aW9uVHlwZXNbXCJSYWlzZVwiXSA9IFwieHN0YXRlLnJhaXNlXCI7XG4gIEFjdGlvblR5cGVzW1wiU2VuZFwiXSA9IFwieHN0YXRlLnNlbmRcIjtcbiAgQWN0aW9uVHlwZXNbXCJDYW5jZWxcIl0gPSBcInhzdGF0ZS5jYW5jZWxcIjtcbiAgQWN0aW9uVHlwZXNbXCJOdWxsRXZlbnRcIl0gPSBcIlwiO1xuICBBY3Rpb25UeXBlc1tcIkFzc2lnblwiXSA9IFwieHN0YXRlLmFzc2lnblwiO1xuICBBY3Rpb25UeXBlc1tcIkFmdGVyXCJdID0gXCJ4c3RhdGUuYWZ0ZXJcIjtcbiAgQWN0aW9uVHlwZXNbXCJEb25lU3RhdGVcIl0gPSBcImRvbmUuc3RhdGVcIjtcbiAgQWN0aW9uVHlwZXNbXCJEb25lSW52b2tlXCJdID0gXCJkb25lLmludm9rZVwiO1xuICBBY3Rpb25UeXBlc1tcIkxvZ1wiXSA9IFwieHN0YXRlLmxvZ1wiO1xuICBBY3Rpb25UeXBlc1tcIkluaXRcIl0gPSBcInhzdGF0ZS5pbml0XCI7XG4gIEFjdGlvblR5cGVzW1wiSW52b2tlXCJdID0gXCJ4c3RhdGUuaW52b2tlXCI7XG4gIEFjdGlvblR5cGVzW1wiRXJyb3JFeGVjdXRpb25cIl0gPSBcImVycm9yLmV4ZWN1dGlvblwiO1xuICBBY3Rpb25UeXBlc1tcIkVycm9yQ29tbXVuaWNhdGlvblwiXSA9IFwiZXJyb3IuY29tbXVuaWNhdGlvblwiO1xuICBBY3Rpb25UeXBlc1tcIkVycm9yUGxhdGZvcm1cIl0gPSBcImVycm9yLnBsYXRmb3JtXCI7XG4gIEFjdGlvblR5cGVzW1wiRXJyb3JDdXN0b21cIl0gPSBcInhzdGF0ZS5lcnJvclwiO1xuICBBY3Rpb25UeXBlc1tcIlVwZGF0ZVwiXSA9IFwieHN0YXRlLnVwZGF0ZVwiO1xuICBBY3Rpb25UeXBlc1tcIlB1cmVcIl0gPSBcInhzdGF0ZS5wdXJlXCI7XG4gIEFjdGlvblR5cGVzW1wiQ2hvb3NlXCJdID0gXCJ4c3RhdGUuY2hvb3NlXCI7XG59KShBY3Rpb25UeXBlcyB8fCAoQWN0aW9uVHlwZXMgPSB7fSkpO1xuXG52YXIgU3BlY2lhbFRhcmdldHM7XG5cbihmdW5jdGlvbiAoU3BlY2lhbFRhcmdldHMpIHtcbiAgU3BlY2lhbFRhcmdldHNbXCJQYXJlbnRcIl0gPSBcIiNfcGFyZW50XCI7XG4gIFNwZWNpYWxUYXJnZXRzW1wiSW50ZXJuYWxcIl0gPSBcIiNfaW50ZXJuYWxcIjtcbn0pKFNwZWNpYWxUYXJnZXRzIHx8IChTcGVjaWFsVGFyZ2V0cyA9IHt9KSk7XG5cbmV4cG9ydCB7IEFjdGlvblR5cGVzLCBTcGVjaWFsVGFyZ2V0cyB9O1xuIiwiaW1wb3J0IHsgX192YWx1ZXMsIF9fc3ByZWFkQXJyYXksIF9fcmVhZCwgX19hc3NpZ24gfSBmcm9tICcuL192aXJ0dWFsL190c2xpYi5qcyc7XG5pbXBvcnQgeyBTcGVjaWFsVGFyZ2V0cyB9IGZyb20gJy4vdHlwZXMuanMnO1xuaW1wb3J0IHsgcmFpc2UsIHNlbmQgfSBmcm9tICcuL2FjdGlvblR5cGVzLmpzJztcbmltcG9ydCB7IERFRkFVTFRfR1VBUkRfVFlQRSwgVEFSR0VUTEVTU19LRVksIFNUQVRFX0RFTElNSVRFUiB9IGZyb20gJy4vY29uc3RhbnRzLmpzJztcbmltcG9ydCB7IElTX1BST0RVQ1RJT04gfSBmcm9tICcuL2Vudmlyb25tZW50LmpzJztcblxudmFyIF9hO1xuZnVuY3Rpb24ga2V5cyh2YWx1ZSkge1xuICByZXR1cm4gT2JqZWN0LmtleXModmFsdWUpO1xufVxuZnVuY3Rpb24gbWF0Y2hlc1N0YXRlKHBhcmVudFN0YXRlSWQsIGNoaWxkU3RhdGVJZCwgZGVsaW1pdGVyKSB7XG4gIGlmIChkZWxpbWl0ZXIgPT09IHZvaWQgMCkge1xuICAgIGRlbGltaXRlciA9IFNUQVRFX0RFTElNSVRFUjtcbiAgfVxuXG4gIHZhciBwYXJlbnRTdGF0ZVZhbHVlID0gdG9TdGF0ZVZhbHVlKHBhcmVudFN0YXRlSWQsIGRlbGltaXRlcik7XG4gIHZhciBjaGlsZFN0YXRlVmFsdWUgPSB0b1N0YXRlVmFsdWUoY2hpbGRTdGF0ZUlkLCBkZWxpbWl0ZXIpO1xuXG4gIGlmIChpc1N0cmluZyhjaGlsZFN0YXRlVmFsdWUpKSB7XG4gICAgaWYgKGlzU3RyaW5nKHBhcmVudFN0YXRlVmFsdWUpKSB7XG4gICAgICByZXR1cm4gY2hpbGRTdGF0ZVZhbHVlID09PSBwYXJlbnRTdGF0ZVZhbHVlO1xuICAgIH0gLy8gUGFyZW50IG1vcmUgc3BlY2lmaWMgdGhhbiBjaGlsZFxuXG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoaXNTdHJpbmcocGFyZW50U3RhdGVWYWx1ZSkpIHtcbiAgICByZXR1cm4gcGFyZW50U3RhdGVWYWx1ZSBpbiBjaGlsZFN0YXRlVmFsdWU7XG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmtleXMocGFyZW50U3RhdGVWYWx1ZSkuZXZlcnkoZnVuY3Rpb24gKGtleSkge1xuICAgIGlmICghKGtleSBpbiBjaGlsZFN0YXRlVmFsdWUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hdGNoZXNTdGF0ZShwYXJlbnRTdGF0ZVZhbHVlW2tleV0sIGNoaWxkU3RhdGVWYWx1ZVtrZXldKTtcbiAgfSk7XG59XG5mdW5jdGlvbiBnZXRFdmVudFR5cGUoZXZlbnQpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaXNTdHJpbmcoZXZlbnQpIHx8IHR5cGVvZiBldmVudCA9PT0gJ251bWJlcicgPyBcIlwiLmNvbmNhdChldmVudCkgOiBldmVudC50eXBlO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFdmVudHMgbXVzdCBiZSBzdHJpbmdzIG9yIG9iamVjdHMgd2l0aCBhIHN0cmluZyBldmVudC50eXBlIHByb3BlcnR5LicpO1xuICB9XG59XG5mdW5jdGlvbiBnZXRBY3Rpb25UeXBlKGFjdGlvbikge1xuICB0cnkge1xuICAgIHJldHVybiBpc1N0cmluZyhhY3Rpb24pIHx8IHR5cGVvZiBhY3Rpb24gPT09ICdudW1iZXInID8gXCJcIi5jb25jYXQoYWN0aW9uKSA6IGlzRnVuY3Rpb24oYWN0aW9uKSA/IGFjdGlvbi5uYW1lIDogYWN0aW9uLnR5cGU7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0FjdGlvbnMgbXVzdCBiZSBzdHJpbmdzIG9yIG9iamVjdHMgd2l0aCBhIHN0cmluZyBhY3Rpb24udHlwZSBwcm9wZXJ0eS4nKTtcbiAgfVxufVxuZnVuY3Rpb24gdG9TdGF0ZVBhdGgoc3RhdGVJZCwgZGVsaW1pdGVyKSB7XG4gIHRyeSB7XG4gICAgaWYgKGlzQXJyYXkoc3RhdGVJZCkpIHtcbiAgICAgIHJldHVybiBzdGF0ZUlkO1xuICAgIH1cblxuICAgIHJldHVybiBzdGF0ZUlkLnRvU3RyaW5nKCkuc3BsaXQoZGVsaW1pdGVyKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIidcIi5jb25jYXQoc3RhdGVJZCwgXCInIGlzIG5vdCBhIHZhbGlkIHN0YXRlIHBhdGguXCIpKTtcbiAgfVxufVxuZnVuY3Rpb24gaXNTdGF0ZUxpa2Uoc3RhdGUpIHtcbiAgcmV0dXJuIHR5cGVvZiBzdGF0ZSA9PT0gJ29iamVjdCcgJiYgJ3ZhbHVlJyBpbiBzdGF0ZSAmJiAnY29udGV4dCcgaW4gc3RhdGUgJiYgJ2V2ZW50JyBpbiBzdGF0ZSAmJiAnX2V2ZW50JyBpbiBzdGF0ZTtcbn1cbmZ1bmN0aW9uIHRvU3RhdGVWYWx1ZShzdGF0ZVZhbHVlLCBkZWxpbWl0ZXIpIHtcbiAgaWYgKGlzU3RhdGVMaWtlKHN0YXRlVmFsdWUpKSB7XG4gICAgcmV0dXJuIHN0YXRlVmFsdWUudmFsdWU7XG4gIH1cblxuICBpZiAoaXNBcnJheShzdGF0ZVZhbHVlKSkge1xuICAgIHJldHVybiBwYXRoVG9TdGF0ZVZhbHVlKHN0YXRlVmFsdWUpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBzdGF0ZVZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBzdGF0ZVZhbHVlO1xuICB9XG5cbiAgdmFyIHN0YXRlUGF0aCA9IHRvU3RhdGVQYXRoKHN0YXRlVmFsdWUsIGRlbGltaXRlcik7XG4gIHJldHVybiBwYXRoVG9TdGF0ZVZhbHVlKHN0YXRlUGF0aCk7XG59XG5mdW5jdGlvbiBwYXRoVG9TdGF0ZVZhbHVlKHN0YXRlUGF0aCkge1xuICBpZiAoc3RhdGVQYXRoLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBzdGF0ZVBhdGhbMF07XG4gIH1cblxuICB2YXIgdmFsdWUgPSB7fTtcbiAgdmFyIG1hcmtlciA9IHZhbHVlO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGVQYXRoLmxlbmd0aCAtIDE7IGkrKykge1xuICAgIGlmIChpID09PSBzdGF0ZVBhdGgubGVuZ3RoIC0gMikge1xuICAgICAgbWFya2VyW3N0YXRlUGF0aFtpXV0gPSBzdGF0ZVBhdGhbaSArIDFdO1xuICAgIH0gZWxzZSB7XG4gICAgICBtYXJrZXJbc3RhdGVQYXRoW2ldXSA9IHt9O1xuICAgICAgbWFya2VyID0gbWFya2VyW3N0YXRlUGF0aFtpXV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufVxuZnVuY3Rpb24gbWFwVmFsdWVzKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcbiAgdmFyIGNvbGxlY3Rpb25LZXlzID0gT2JqZWN0LmtleXMoY29sbGVjdGlvbik7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2xsZWN0aW9uS2V5cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBrZXkgPSBjb2xsZWN0aW9uS2V5c1tpXTtcbiAgICByZXN1bHRba2V5XSA9IGl0ZXJhdGVlKGNvbGxlY3Rpb25ba2V5XSwga2V5LCBjb2xsZWN0aW9uLCBpKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtYXBGaWx0ZXJWYWx1ZXMoY29sbGVjdGlvbiwgaXRlcmF0ZWUsIHByZWRpY2F0ZSkge1xuICB2YXIgZV8xLCBfYTtcblxuICB2YXIgcmVzdWx0ID0ge307XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBfYiA9IF9fdmFsdWVzKE9iamVjdC5rZXlzKGNvbGxlY3Rpb24pKSwgX2MgPSBfYi5uZXh0KCk7ICFfYy5kb25lOyBfYyA9IF9iLm5leHQoKSkge1xuICAgICAgdmFyIGtleSA9IF9jLnZhbHVlO1xuICAgICAgdmFyIGl0ZW0gPSBjb2xsZWN0aW9uW2tleV07XG5cbiAgICAgIGlmICghcHJlZGljYXRlKGl0ZW0pKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICByZXN1bHRba2V5XSA9IGl0ZXJhdGVlKGl0ZW0sIGtleSwgY29sbGVjdGlvbik7XG4gICAgfVxuICB9IGNhdGNoIChlXzFfMSkge1xuICAgIGVfMSA9IHtcbiAgICAgIGVycm9yOiBlXzFfMVxuICAgIH07XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChfYyAmJiAhX2MuZG9uZSAmJiAoX2EgPSBfYi5yZXR1cm4pKSBfYS5jYWxsKF9iKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG4vKipcclxuICogUmV0cmlldmVzIGEgdmFsdWUgYXQgdGhlIGdpdmVuIHBhdGguXHJcbiAqIEBwYXJhbSBwcm9wcyBUaGUgZGVlcCBwYXRoIHRvIHRoZSBwcm9wIG9mIHRoZSBkZXNpcmVkIHZhbHVlXHJcbiAqL1xuXG52YXIgcGF0aCA9IGZ1bmN0aW9uIChwcm9wcykge1xuICByZXR1cm4gZnVuY3Rpb24gKG9iamVjdCkge1xuICAgIHZhciBlXzIsIF9hO1xuXG4gICAgdmFyIHJlc3VsdCA9IG9iamVjdDtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBwcm9wc18xID0gX192YWx1ZXMocHJvcHMpLCBwcm9wc18xXzEgPSBwcm9wc18xLm5leHQoKTsgIXByb3BzXzFfMS5kb25lOyBwcm9wc18xXzEgPSBwcm9wc18xLm5leHQoKSkge1xuICAgICAgICB2YXIgcHJvcCA9IHByb3BzXzFfMS52YWx1ZTtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0W3Byb3BdO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfMl8xKSB7XG4gICAgICBlXzIgPSB7XG4gICAgICAgIGVycm9yOiBlXzJfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHByb3BzXzFfMSAmJiAhcHJvcHNfMV8xLmRvbmUgJiYgKF9hID0gcHJvcHNfMS5yZXR1cm4pKSBfYS5jYWxsKHByb3BzXzEpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfMikgdGhyb3cgZV8yLmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59O1xuLyoqXHJcbiAqIFJldHJpZXZlcyBhIHZhbHVlIGF0IHRoZSBnaXZlbiBwYXRoIHZpYSB0aGUgbmVzdGVkIGFjY2Vzc29yIHByb3AuXHJcbiAqIEBwYXJhbSBwcm9wcyBUaGUgZGVlcCBwYXRoIHRvIHRoZSBwcm9wIG9mIHRoZSBkZXNpcmVkIHZhbHVlXHJcbiAqL1xuXG5mdW5jdGlvbiBuZXN0ZWRQYXRoKHByb3BzLCBhY2Nlc3NvclByb3ApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICB2YXIgZV8zLCBfYTtcblxuICAgIHZhciByZXN1bHQgPSBvYmplY3Q7XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgcHJvcHNfMiA9IF9fdmFsdWVzKHByb3BzKSwgcHJvcHNfMl8xID0gcHJvcHNfMi5uZXh0KCk7ICFwcm9wc18yXzEuZG9uZTsgcHJvcHNfMl8xID0gcHJvcHNfMi5uZXh0KCkpIHtcbiAgICAgICAgdmFyIHByb3AgPSBwcm9wc18yXzEudmFsdWU7XG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdFthY2Nlc3NvclByb3BdW3Byb3BdO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfM18xKSB7XG4gICAgICBlXzMgPSB7XG4gICAgICAgIGVycm9yOiBlXzNfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHByb3BzXzJfMSAmJiAhcHJvcHNfMl8xLmRvbmUgJiYgKF9hID0gcHJvcHNfMi5yZXR1cm4pKSBfYS5jYWxsKHByb3BzXzIpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfMykgdGhyb3cgZV8zLmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5mdW5jdGlvbiB0b1N0YXRlUGF0aHMoc3RhdGVWYWx1ZSkge1xuICBpZiAoIXN0YXRlVmFsdWUpIHtcbiAgICByZXR1cm4gW1tdXTtcbiAgfVxuXG4gIGlmIChpc1N0cmluZyhzdGF0ZVZhbHVlKSkge1xuICAgIHJldHVybiBbW3N0YXRlVmFsdWVdXTtcbiAgfVxuXG4gIHZhciByZXN1bHQgPSBmbGF0dGVuKE9iamVjdC5rZXlzKHN0YXRlVmFsdWUpLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgdmFyIHN1YlN0YXRlVmFsdWUgPSBzdGF0ZVZhbHVlW2tleV07XG5cbiAgICBpZiAodHlwZW9mIHN1YlN0YXRlVmFsdWUgIT09ICdzdHJpbmcnICYmICghc3ViU3RhdGVWYWx1ZSB8fCAhT2JqZWN0LmtleXMoc3ViU3RhdGVWYWx1ZSkubGVuZ3RoKSkge1xuICAgICAgcmV0dXJuIFtba2V5XV07XG4gICAgfVxuXG4gICAgcmV0dXJuIHRvU3RhdGVQYXRocyhzdGF0ZVZhbHVlW2tleV0pLm1hcChmdW5jdGlvbiAoc3ViUGF0aCkge1xuICAgICAgcmV0dXJuIFtrZXldLmNvbmNhdChzdWJQYXRoKTtcbiAgICB9KTtcbiAgfSkpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gcGF0aHNUb1N0YXRlVmFsdWUocGF0aHMpIHtcbiAgdmFyIGVfNCwgX2E7XG5cbiAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gIGlmIChwYXRocyAmJiBwYXRocy5sZW5ndGggPT09IDEgJiYgcGF0aHNbMF0ubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIHBhdGhzWzBdWzBdO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBwYXRoc18xID0gX192YWx1ZXMocGF0aHMpLCBwYXRoc18xXzEgPSBwYXRoc18xLm5leHQoKTsgIXBhdGhzXzFfMS5kb25lOyBwYXRoc18xXzEgPSBwYXRoc18xLm5leHQoKSkge1xuICAgICAgdmFyIGN1cnJlbnRQYXRoID0gcGF0aHNfMV8xLnZhbHVlO1xuICAgICAgdmFyIG1hcmtlciA9IHJlc3VsdDsgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnByZWZlci1mb3Itb2ZcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW50UGF0aC5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgc3ViUGF0aCA9IGN1cnJlbnRQYXRoW2ldO1xuXG4gICAgICAgIGlmIChpID09PSBjdXJyZW50UGF0aC5sZW5ndGggLSAyKSB7XG4gICAgICAgICAgbWFya2VyW3N1YlBhdGhdID0gY3VycmVudFBhdGhbaSArIDFdO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgbWFya2VyW3N1YlBhdGhdID0gbWFya2VyW3N1YlBhdGhdIHx8IHt9O1xuICAgICAgICBtYXJrZXIgPSBtYXJrZXJbc3ViUGF0aF07XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlXzRfMSkge1xuICAgIGVfNCA9IHtcbiAgICAgIGVycm9yOiBlXzRfMVxuICAgIH07XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChwYXRoc18xXzEgJiYgIXBhdGhzXzFfMS5kb25lICYmIChfYSA9IHBhdGhzXzEucmV0dXJuKSkgX2EuY2FsbChwYXRoc18xKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKGVfNCkgdGhyb3cgZV80LmVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBmbGF0dGVuKGFycmF5KSB7XG4gIHZhciBfYTtcblxuICByZXR1cm4gKF9hID0gW10pLmNvbmNhdC5hcHBseShfYSwgX19zcHJlYWRBcnJheShbXSwgX19yZWFkKGFycmF5KSwgZmFsc2UpKTtcbn1cbmZ1bmN0aW9uIHRvQXJyYXlTdHJpY3QodmFsdWUpIHtcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIFt2YWx1ZV07XG59XG5mdW5jdGlvbiB0b0FycmF5KHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgcmV0dXJuIHRvQXJyYXlTdHJpY3QodmFsdWUpO1xufVxuZnVuY3Rpb24gbWFwQ29udGV4dChtYXBwZXIsIGNvbnRleHQsIF9ldmVudCkge1xuICB2YXIgZV81LCBfYTtcblxuICBpZiAoaXNGdW5jdGlvbihtYXBwZXIpKSB7XG4gICAgcmV0dXJuIG1hcHBlcihjb250ZXh0LCBfZXZlbnQuZGF0YSk7XG4gIH1cblxuICB2YXIgcmVzdWx0ID0ge307XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBfYiA9IF9fdmFsdWVzKE9iamVjdC5rZXlzKG1hcHBlcikpLCBfYyA9IF9iLm5leHQoKTsgIV9jLmRvbmU7IF9jID0gX2IubmV4dCgpKSB7XG4gICAgICB2YXIga2V5ID0gX2MudmFsdWU7XG4gICAgICB2YXIgc3ViTWFwcGVyID0gbWFwcGVyW2tleV07XG5cbiAgICAgIGlmIChpc0Z1bmN0aW9uKHN1Yk1hcHBlcikpIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSBzdWJNYXBwZXIoY29udGV4dCwgX2V2ZW50LmRhdGEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSBzdWJNYXBwZXI7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlXzVfMSkge1xuICAgIGVfNSA9IHtcbiAgICAgIGVycm9yOiBlXzVfMVxuICAgIH07XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChfYyAmJiAhX2MuZG9uZSAmJiAoX2EgPSBfYi5yZXR1cm4pKSBfYS5jYWxsKF9iKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKGVfNSkgdGhyb3cgZV81LmVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBpc0J1aWx0SW5FdmVudChldmVudFR5cGUpIHtcbiAgcmV0dXJuIC9eKGRvbmV8ZXJyb3IpXFwuLy50ZXN0KGV2ZW50VHlwZSk7XG59XG5mdW5jdGlvbiBpc1Byb21pc2VMaWtlKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSAvLyBDaGVjayBpZiBzaGFwZSBtYXRjaGVzIHRoZSBQcm9taXNlL0ErIHNwZWNpZmljYXRpb24gZm9yIGEgXCJ0aGVuYWJsZVwiLlxuXG5cbiAgaWYgKHZhbHVlICE9PSBudWxsICYmIChpc0Z1bmN0aW9uKHZhbHVlKSB8fCB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSAmJiBpc0Z1bmN0aW9uKHZhbHVlLnRoZW4pKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5mdW5jdGlvbiBpc0JlaGF2aW9yKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmICd0cmFuc2l0aW9uJyBpbiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUudHJhbnNpdGlvbiA9PT0gJ2Z1bmN0aW9uJztcbn1cbmZ1bmN0aW9uIHBhcnRpdGlvbihpdGVtcywgcHJlZGljYXRlKSB7XG4gIHZhciBlXzYsIF9hO1xuXG4gIHZhciBfYiA9IF9fcmVhZChbW10sIFtdXSwgMiksXG4gICAgICB0cnV0aHkgPSBfYlswXSxcbiAgICAgIGZhbHN5ID0gX2JbMV07XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBpdGVtc18xID0gX192YWx1ZXMoaXRlbXMpLCBpdGVtc18xXzEgPSBpdGVtc18xLm5leHQoKTsgIWl0ZW1zXzFfMS5kb25lOyBpdGVtc18xXzEgPSBpdGVtc18xLm5leHQoKSkge1xuICAgICAgdmFyIGl0ZW0gPSBpdGVtc18xXzEudmFsdWU7XG5cbiAgICAgIGlmIChwcmVkaWNhdGUoaXRlbSkpIHtcbiAgICAgICAgdHJ1dGh5LnB1c2goaXRlbSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmYWxzeS5wdXNoKGl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZV82XzEpIHtcbiAgICBlXzYgPSB7XG4gICAgICBlcnJvcjogZV82XzFcbiAgICB9O1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoaXRlbXNfMV8xICYmICFpdGVtc18xXzEuZG9uZSAmJiAoX2EgPSBpdGVtc18xLnJldHVybikpIF9hLmNhbGwoaXRlbXNfMSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChlXzYpIHRocm93IGVfNi5lcnJvcjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gW3RydXRoeSwgZmFsc3ldO1xufVxuZnVuY3Rpb24gdXBkYXRlSGlzdG9yeVN0YXRlcyhoaXN0LCBzdGF0ZVZhbHVlKSB7XG4gIHJldHVybiBtYXBWYWx1ZXMoaGlzdC5zdGF0ZXMsIGZ1bmN0aW9uIChzdWJIaXN0LCBrZXkpIHtcbiAgICBpZiAoIXN1Ykhpc3QpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdmFyIHN1YlN0YXRlVmFsdWUgPSAoaXNTdHJpbmcoc3RhdGVWYWx1ZSkgPyB1bmRlZmluZWQgOiBzdGF0ZVZhbHVlW2tleV0pIHx8IChzdWJIaXN0ID8gc3ViSGlzdC5jdXJyZW50IDogdW5kZWZpbmVkKTtcblxuICAgIGlmICghc3ViU3RhdGVWYWx1ZSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgY3VycmVudDogc3ViU3RhdGVWYWx1ZSxcbiAgICAgIHN0YXRlczogdXBkYXRlSGlzdG9yeVN0YXRlcyhzdWJIaXN0LCBzdWJTdGF0ZVZhbHVlKVxuICAgIH07XG4gIH0pO1xufVxuZnVuY3Rpb24gdXBkYXRlSGlzdG9yeVZhbHVlKGhpc3QsIHN0YXRlVmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICBjdXJyZW50OiBzdGF0ZVZhbHVlLFxuICAgIHN0YXRlczogdXBkYXRlSGlzdG9yeVN0YXRlcyhoaXN0LCBzdGF0ZVZhbHVlKVxuICB9O1xufVxuZnVuY3Rpb24gdXBkYXRlQ29udGV4dChjb250ZXh0LCBfZXZlbnQsIGFzc2lnbkFjdGlvbnMsIHN0YXRlKSB7XG4gIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgIHdhcm4oISFjb250ZXh0LCAnQXR0ZW1wdGluZyB0byB1cGRhdGUgdW5kZWZpbmVkIGNvbnRleHQnKTtcbiAgfVxuXG4gIHZhciB1cGRhdGVkQ29udGV4dCA9IGNvbnRleHQgPyBhc3NpZ25BY3Rpb25zLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBhc3NpZ25BY3Rpb24pIHtcbiAgICB2YXIgZV83LCBfYTtcblxuICAgIHZhciBhc3NpZ25tZW50ID0gYXNzaWduQWN0aW9uLmFzc2lnbm1lbnQ7XG4gICAgdmFyIG1ldGEgPSB7XG4gICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICBhY3Rpb246IGFzc2lnbkFjdGlvbixcbiAgICAgIF9ldmVudDogX2V2ZW50XG4gICAgfTtcbiAgICB2YXIgcGFydGlhbFVwZGF0ZSA9IHt9O1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oYXNzaWdubWVudCkpIHtcbiAgICAgIHBhcnRpYWxVcGRhdGUgPSBhc3NpZ25tZW50KGFjYywgX2V2ZW50LmRhdGEsIG1ldGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciBfYiA9IF9fdmFsdWVzKE9iamVjdC5rZXlzKGFzc2lnbm1lbnQpKSwgX2MgPSBfYi5uZXh0KCk7ICFfYy5kb25lOyBfYyA9IF9iLm5leHQoKSkge1xuICAgICAgICAgIHZhciBrZXkgPSBfYy52YWx1ZTtcbiAgICAgICAgICB2YXIgcHJvcEFzc2lnbm1lbnQgPSBhc3NpZ25tZW50W2tleV07XG4gICAgICAgICAgcGFydGlhbFVwZGF0ZVtrZXldID0gaXNGdW5jdGlvbihwcm9wQXNzaWdubWVudCkgPyBwcm9wQXNzaWdubWVudChhY2MsIF9ldmVudC5kYXRhLCBtZXRhKSA6IHByb3BBc3NpZ25tZW50O1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlXzdfMSkge1xuICAgICAgICBlXzcgPSB7XG4gICAgICAgICAgZXJyb3I6IGVfN18xXG4gICAgICAgIH07XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChfYyAmJiAhX2MuZG9uZSAmJiAoX2EgPSBfYi5yZXR1cm4pKSBfYS5jYWxsKF9iKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBpZiAoZV83KSB0aHJvdyBlXzcuZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgYWNjLCBwYXJ0aWFsVXBkYXRlKTtcbiAgfSwgY29udGV4dCkgOiBjb250ZXh0O1xuICByZXR1cm4gdXBkYXRlZENvbnRleHQ7XG59IC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1lbXB0eVxuXG52YXIgd2FybiA9IGZ1bmN0aW9uICgpIHt9O1xuXG5pZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgd2FybiA9IGZ1bmN0aW9uIChjb25kaXRpb24sIG1lc3NhZ2UpIHtcbiAgICB2YXIgZXJyb3IgPSBjb25kaXRpb24gaW5zdGFuY2VvZiBFcnJvciA/IGNvbmRpdGlvbiA6IHVuZGVmaW5lZDtcblxuICAgIGlmICghZXJyb3IgJiYgY29uZGl0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGNvbnNvbGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIGFyZ3MgPSBbXCJXYXJuaW5nOiBcIi5jb25jYXQobWVzc2FnZSldO1xuXG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgYXJncy5wdXNoKGVycm9yKTtcbiAgICAgIH0gLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbnNvbGVcblxuXG4gICAgICBjb25zb2xlLndhcm4uYXBwbHkoY29uc29sZSwgYXJncyk7XG4gICAgfVxuICB9O1xufVxuZnVuY3Rpb24gaXNBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWx1ZSk7XG59IC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpiYW4tdHlwZXNcblxuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xufVxuZnVuY3Rpb24gaXNTdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZyc7XG59XG5mdW5jdGlvbiB0b0d1YXJkKGNvbmRpdGlvbiwgZ3VhcmRNYXApIHtcbiAgaWYgKCFjb25kaXRpb24pIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgaWYgKGlzU3RyaW5nKGNvbmRpdGlvbikpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogREVGQVVMVF9HVUFSRF9UWVBFLFxuICAgICAgbmFtZTogY29uZGl0aW9uLFxuICAgICAgcHJlZGljYXRlOiBndWFyZE1hcCA/IGd1YXJkTWFwW2NvbmRpdGlvbl0gOiB1bmRlZmluZWRcbiAgICB9O1xuICB9XG5cbiAgaWYgKGlzRnVuY3Rpb24oY29uZGl0aW9uKSkge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiBERUZBVUxUX0dVQVJEX1RZUEUsXG4gICAgICBuYW1lOiBjb25kaXRpb24ubmFtZSxcbiAgICAgIHByZWRpY2F0ZTogY29uZGl0aW9uXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBjb25kaXRpb247XG59XG5mdW5jdGlvbiBpc09ic2VydmFibGUodmFsdWUpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gJ3N1YnNjcmliZScgaW4gdmFsdWUgJiYgaXNGdW5jdGlvbih2YWx1ZS5zdWJzY3JpYmUpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG52YXIgc3ltYm9sT2JzZXJ2YWJsZSA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5vYnNlcnZhYmxlIHx8ICdAQG9ic2VydmFibGUnO1xufSgpOyAvLyBUT0RPOiB0byBiZSByZW1vdmVkIGluIHY1LCBsZWZ0IGl0IG91dCBqdXN0IHRvIG1pbmltaXplIHRoZSBzY29wZSBvZiB0aGUgY2hhbmdlIGFuZCBtYWludGFpbiBjb21wYXRpYmlsaXR5IHdpdGggb2xkZXIgdmVyc2lvbnMgb2YgaW50ZWdyYXRpb24gcGFhY2thZ2VzXG5cbnZhciBpbnRlcm9wU3ltYm9scyA9IChfYSA9IHt9LCBfYVtzeW1ib2xPYnNlcnZhYmxlXSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXM7XG59LCBfYVtTeW1ib2wub2JzZXJ2YWJsZV0gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzO1xufSwgX2EpO1xuZnVuY3Rpb24gaXNNYWNoaW5lKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmICdfX3hzdGF0ZW5vZGUnIGluIHZhbHVlO1xufVxuZnVuY3Rpb24gaXNBY3Rvcih2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUuc2VuZCA9PT0gJ2Z1bmN0aW9uJztcbn1cbnZhciB1bmlxdWVJZCA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIHZhciBjdXJyZW50SWQgPSAwO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGN1cnJlbnRJZCsrO1xuICAgIHJldHVybiBjdXJyZW50SWQudG9TdHJpbmcoMTYpO1xuICB9O1xufSgpO1xuZnVuY3Rpb24gdG9FdmVudE9iamVjdChldmVudCwgcGF5bG9hZCAvLyBpZD86IFRFdmVudFsndHlwZSddXG4pIHtcbiAgaWYgKGlzU3RyaW5nKGV2ZW50KSB8fCB0eXBlb2YgZXZlbnQgPT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIF9fYXNzaWduKHtcbiAgICAgIHR5cGU6IGV2ZW50XG4gICAgfSwgcGF5bG9hZCk7XG4gIH1cblxuICByZXR1cm4gZXZlbnQ7XG59XG5mdW5jdGlvbiB0b1NDWE1MRXZlbnQoZXZlbnQsIHNjeG1sRXZlbnQpIHtcbiAgaWYgKCFpc1N0cmluZyhldmVudCkgJiYgJyQkdHlwZScgaW4gZXZlbnQgJiYgZXZlbnQuJCR0eXBlID09PSAnc2N4bWwnKSB7XG4gICAgcmV0dXJuIGV2ZW50O1xuICB9XG5cbiAgdmFyIGV2ZW50T2JqZWN0ID0gdG9FdmVudE9iamVjdChldmVudCk7XG4gIHJldHVybiBfX2Fzc2lnbih7XG4gICAgbmFtZTogZXZlbnRPYmplY3QudHlwZSxcbiAgICBkYXRhOiBldmVudE9iamVjdCxcbiAgICAkJHR5cGU6ICdzY3htbCcsXG4gICAgdHlwZTogJ2V4dGVybmFsJ1xuICB9LCBzY3htbEV2ZW50KTtcbn1cbmZ1bmN0aW9uIHRvVHJhbnNpdGlvbkNvbmZpZ0FycmF5KGV2ZW50LCBjb25maWdMaWtlKSB7XG4gIHZhciB0cmFuc2l0aW9ucyA9IHRvQXJyYXlTdHJpY3QoY29uZmlnTGlrZSkubWFwKGZ1bmN0aW9uICh0cmFuc2l0aW9uTGlrZSkge1xuICAgIGlmICh0eXBlb2YgdHJhbnNpdGlvbkxpa2UgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiB0cmFuc2l0aW9uTGlrZSA9PT0gJ3N0cmluZycgfHwgaXNNYWNoaW5lKHRyYW5zaXRpb25MaWtlKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGFyZ2V0OiB0cmFuc2l0aW9uTGlrZSxcbiAgICAgICAgZXZlbnQ6IGV2ZW50XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgdHJhbnNpdGlvbkxpa2UpLCB7XG4gICAgICBldmVudDogZXZlbnRcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiB0cmFuc2l0aW9ucztcbn1cbmZ1bmN0aW9uIG5vcm1hbGl6ZVRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHRhcmdldCA9PT0gdW5kZWZpbmVkIHx8IHRhcmdldCA9PT0gVEFSR0VUTEVTU19LRVkpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcmV0dXJuIHRvQXJyYXkodGFyZ2V0KTtcbn1cbmZ1bmN0aW9uIHJlcG9ydFVuaGFuZGxlZEV4Y2VwdGlvbk9uSW52b2NhdGlvbihvcmlnaW5hbEVycm9yLCBjdXJyZW50RXJyb3IsIGlkKSB7XG4gIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgIHZhciBvcmlnaW5hbFN0YWNrVHJhY2UgPSBvcmlnaW5hbEVycm9yLnN0YWNrID8gXCIgU3RhY2t0cmFjZSB3YXMgJ1wiLmNvbmNhdChvcmlnaW5hbEVycm9yLnN0YWNrLCBcIidcIikgOiAnJztcblxuICAgIGlmIChvcmlnaW5hbEVycm9yID09PSBjdXJyZW50RXJyb3IpIHtcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1jb25zb2xlXG4gICAgICBjb25zb2xlLmVycm9yKFwiTWlzc2luZyBvbkVycm9yIGhhbmRsZXIgZm9yIGludm9jYXRpb24gJ1wiLmNvbmNhdChpZCwgXCInLCBlcnJvciB3YXMgJ1wiKS5jb25jYXQob3JpZ2luYWxFcnJvciwgXCInLlwiKS5jb25jYXQob3JpZ2luYWxTdGFja1RyYWNlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBzdGFja1RyYWNlID0gY3VycmVudEVycm9yLnN0YWNrID8gXCIgU3RhY2t0cmFjZSB3YXMgJ1wiLmNvbmNhdChjdXJyZW50RXJyb3Iuc3RhY2ssIFwiJ1wiKSA6ICcnOyAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tY29uc29sZVxuXG4gICAgICBjb25zb2xlLmVycm9yKFwiTWlzc2luZyBvbkVycm9yIGhhbmRsZXIgYW5kL29yIHVuaGFuZGxlZCBleGNlcHRpb24vcHJvbWlzZSByZWplY3Rpb24gZm9yIGludm9jYXRpb24gJ1wiLmNvbmNhdChpZCwgXCInLiBcIikgKyBcIk9yaWdpbmFsIGVycm9yOiAnXCIuY29uY2F0KG9yaWdpbmFsRXJyb3IsIFwiJy4gXCIpLmNvbmNhdChvcmlnaW5hbFN0YWNrVHJhY2UsIFwiIEN1cnJlbnQgZXJyb3IgaXMgJ1wiKS5jb25jYXQoY3VycmVudEVycm9yLCBcIicuXCIpLmNvbmNhdChzdGFja1RyYWNlKSk7XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiBldmFsdWF0ZUd1YXJkKG1hY2hpbmUsIGd1YXJkLCBjb250ZXh0LCBfZXZlbnQsIHN0YXRlKSB7XG4gIHZhciBndWFyZHMgPSBtYWNoaW5lLm9wdGlvbnMuZ3VhcmRzO1xuICB2YXIgZ3VhcmRNZXRhID0ge1xuICAgIHN0YXRlOiBzdGF0ZSxcbiAgICBjb25kOiBndWFyZCxcbiAgICBfZXZlbnQ6IF9ldmVudFxuICB9OyAvLyBUT0RPOiBkbyBub3QgaGFyZGNvZGUhXG5cbiAgaWYgKGd1YXJkLnR5cGUgPT09IERFRkFVTFRfR1VBUkRfVFlQRSkge1xuICAgIHJldHVybiAoKGd1YXJkcyA9PT0gbnVsbCB8fCBndWFyZHMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGd1YXJkc1tndWFyZC5uYW1lXSkgfHwgZ3VhcmQucHJlZGljYXRlKShjb250ZXh0LCBfZXZlbnQuZGF0YSwgZ3VhcmRNZXRhKTtcbiAgfVxuXG4gIHZhciBjb25kRm4gPSBndWFyZHMgPT09IG51bGwgfHwgZ3VhcmRzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBndWFyZHNbZ3VhcmQudHlwZV07XG5cbiAgaWYgKCFjb25kRm4pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJHdWFyZCAnXCIuY29uY2F0KGd1YXJkLnR5cGUsIFwiJyBpcyBub3QgaW1wbGVtZW50ZWQgb24gbWFjaGluZSAnXCIpLmNvbmNhdChtYWNoaW5lLmlkLCBcIicuXCIpKTtcbiAgfVxuXG4gIHJldHVybiBjb25kRm4oY29udGV4dCwgX2V2ZW50LmRhdGEsIGd1YXJkTWV0YSk7XG59XG5mdW5jdGlvbiB0b0ludm9rZVNvdXJjZShzcmMpIHtcbiAgaWYgKHR5cGVvZiBzcmMgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IHNyY1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gc3JjO1xufVxuZnVuY3Rpb24gdG9PYnNlcnZlcihuZXh0SGFuZGxlciwgZXJyb3JIYW5kbGVyLCBjb21wbGV0aW9uSGFuZGxlcikge1xuICB2YXIgbm9vcCA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gIHZhciBpc09ic2VydmVyID0gdHlwZW9mIG5leHRIYW5kbGVyID09PSAnb2JqZWN0JztcbiAgdmFyIHNlbGYgPSBpc09ic2VydmVyID8gbmV4dEhhbmRsZXIgOiBudWxsO1xuICByZXR1cm4ge1xuICAgIG5leHQ6ICgoaXNPYnNlcnZlciA/IG5leHRIYW5kbGVyLm5leHQgOiBuZXh0SGFuZGxlcikgfHwgbm9vcCkuYmluZChzZWxmKSxcbiAgICBlcnJvcjogKChpc09ic2VydmVyID8gbmV4dEhhbmRsZXIuZXJyb3IgOiBlcnJvckhhbmRsZXIpIHx8IG5vb3ApLmJpbmQoc2VsZiksXG4gICAgY29tcGxldGU6ICgoaXNPYnNlcnZlciA/IG5leHRIYW5kbGVyLmNvbXBsZXRlIDogY29tcGxldGlvbkhhbmRsZXIpIHx8IG5vb3ApLmJpbmQoc2VsZilcbiAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUludm9rZUlkKHN0YXRlTm9kZUlkLCBpbmRleCkge1xuICByZXR1cm4gXCJcIi5jb25jYXQoc3RhdGVOb2RlSWQsIFwiOmludm9jYXRpb25bXCIpLmNvbmNhdChpbmRleCwgXCJdXCIpO1xufVxuZnVuY3Rpb24gaXNSYWlzYWJsZUFjdGlvbihhY3Rpb24pIHtcbiAgcmV0dXJuIChhY3Rpb24udHlwZSA9PT0gcmFpc2UgfHwgYWN0aW9uLnR5cGUgPT09IHNlbmQgJiYgYWN0aW9uLnRvID09PSBTcGVjaWFsVGFyZ2V0cy5JbnRlcm5hbCkgJiYgdHlwZW9mIGFjdGlvbi5kZWxheSAhPT0gJ251bWJlcic7XG59XG5cbmV4cG9ydCB7IGNyZWF0ZUludm9rZUlkLCBldmFsdWF0ZUd1YXJkLCBmbGF0dGVuLCBnZXRBY3Rpb25UeXBlLCBnZXRFdmVudFR5cGUsIGludGVyb3BTeW1ib2xzLCBpc0FjdG9yLCBpc0FycmF5LCBpc0JlaGF2aW9yLCBpc0J1aWx0SW5FdmVudCwgaXNGdW5jdGlvbiwgaXNNYWNoaW5lLCBpc09ic2VydmFibGUsIGlzUHJvbWlzZUxpa2UsIGlzUmFpc2FibGVBY3Rpb24sIGlzU3RhdGVMaWtlLCBpc1N0cmluZywga2V5cywgbWFwQ29udGV4dCwgbWFwRmlsdGVyVmFsdWVzLCBtYXBWYWx1ZXMsIG1hdGNoZXNTdGF0ZSwgbmVzdGVkUGF0aCwgbm9ybWFsaXplVGFyZ2V0LCBwYXJ0aXRpb24sIHBhdGgsIHBhdGhUb1N0YXRlVmFsdWUsIHBhdGhzVG9TdGF0ZVZhbHVlLCByZXBvcnRVbmhhbmRsZWRFeGNlcHRpb25Pbkludm9jYXRpb24sIHN5bWJvbE9ic2VydmFibGUsIHRvQXJyYXksIHRvQXJyYXlTdHJpY3QsIHRvRXZlbnRPYmplY3QsIHRvR3VhcmQsIHRvSW52b2tlU291cmNlLCB0b09ic2VydmVyLCB0b1NDWE1MRXZlbnQsIHRvU3RhdGVQYXRoLCB0b1N0YXRlUGF0aHMsIHRvU3RhdGVWYWx1ZSwgdG9UcmFuc2l0aW9uQ29uZmlnQXJyYXksIHVuaXF1ZUlkLCB1cGRhdGVDb250ZXh0LCB1cGRhdGVIaXN0b3J5U3RhdGVzLCB1cGRhdGVIaXN0b3J5VmFsdWUsIHdhcm4gfTtcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEFuaW1hdGlvbk1vZHVsZSB7XG4gIHN0YXRpYyByZWN0YW5nbGVzU2VsZWN0b3IgPVxuICAgIFwiLm91dGVybW9zdCwgLnNlY29uZCwgLnRoaXJkLCAuZm91cnRoLCAuZmlmdGgsIC5pbm5lcm1vc3RcIjtcbiAgc3RhdGljIHRhbGtCdXR0b25BbmltYXRpb25zID0gW1wicGlTcGVha2luZ1wiLCBcInVzZXJTcGVha2luZ1wiLCBcInRyYW5zY3JpYmluZ1wiXTtcblxuICBzdGF0aWMgc3RhcnRBbmltYXRpb24oYW5pbWF0aW9uKSB7XG4gICAgdGhpcy5zdG9wT3RoZXJBbmltYXRpb25zKGFuaW1hdGlvbik7XG5cbiAgICBsZXQgcmVjdGFuZ2xlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5yZWN0YW5nbGVzU2VsZWN0b3IpO1xuICAgIHJlY3RhbmdsZXMuZm9yRWFjaCgocmVjdCkgPT4gcmVjdC5jbGFzc0xpc3QuYWRkKGFuaW1hdGlvbikpO1xuICB9XG5cbiAgc3RhdGljIHN0b3BBbmltYXRpb24oYW5pbWF0aW9uKSB7XG4gICAgbGV0IHJlY3RhbmdsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMucmVjdGFuZ2xlc1NlbGVjdG9yKTtcbiAgICByZWN0YW5nbGVzLmZvckVhY2goKHJlY3QpID0+IHJlY3QuY2xhc3NMaXN0LnJlbW92ZShhbmltYXRpb24pKTtcbiAgfVxuXG4gIHN0YXRpYyBzdG9wQWxsQW5pbWF0aW9ucygpIHtcbiAgICB0aGlzLnRhbGtCdXR0b25BbmltYXRpb25zLmZvckVhY2goKGFuaW1hdGlvbikgPT5cbiAgICAgIHRoaXMuc3RvcEFuaW1hdGlvbihhbmltYXRpb24pXG4gICAgKTtcbiAgfVxuXG4gIHN0YXRpYyBzdG9wT3RoZXJBbmltYXRpb25zKGtlZXBBbmltYXRpb24pIHtcbiAgICB0aGlzLnRhbGtCdXR0b25BbmltYXRpb25zLmZvckVhY2goKGFuaW1hdGlvbikgPT4ge1xuICAgICAgaWYgKGFuaW1hdGlvbiAhPT0ga2VlcEFuaW1hdGlvbikge1xuICAgICAgICB0aGlzLnN0b3BBbmltYXRpb24oYW5pbWF0aW9uKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgZW50ZXJNb2JpbGVNb2RlLFxuICBleGl0TW9iaWxlTW9kZSxcbiAgaXNNb2JpbGVWaWV3LFxufSBmcm9tIFwiLi9Vc2VyQWdlbnRNb2R1bGUuanNcIjtcbmltcG9ydCB7IGFwcGVuZENoaWxkIH0gZnJvbSBcIi4vRE9NTW9kdWxlLnRzXCI7XG5pbXBvcnQgRXZlbnRCdXMgZnJvbSBcIi4vRXZlbnRCdXMuanNcIjtcbmltcG9ydCBTdGF0ZU1hY2hpbmVTZXJ2aWNlIGZyb20gXCIuL1N0YXRlTWFjaGluZVNlcnZpY2UuanNcIjtcbmltcG9ydCB7IHN1Ym1pdEVycm9ySGFuZGxlciB9IGZyb20gXCIuL1N1Ym1pdEVycm9ySGFuZGxlci50c1wiO1xuaW1wb3J0IGV4aXRJY29uU1ZHIGZyb20gXCIuL2ljb25zL2V4aXQuc3ZnXCI7XG5pbXBvcnQgbWF4aW1pemVJY29uU1ZHIGZyb20gXCIuL2ljb25zL21heGltaXplLnN2Z1wiO1xuaW1wb3J0IHJlY3RhbmdsZXNTVkcgZnJvbSBcIi4vaWNvbnMvcmVjdGFuZ2xlcy5zdmdcIjtcbmltcG9ydCB0YWxrSWNvblNWRyBmcm9tIFwiLi9pY29ucy93YXZlZm9ybS5zdmdcIjtcbmltcG9ydCBtdXRlZE1pY0ljb25TVkcgZnJvbSBcIi4vaWNvbnMvbXV0ZWRfbWljcm9waG9uZS5zdmdcIjtcbmltcG9ydCBjYWxsSWNvblNWRyBmcm9tIFwiLi9pY29ucy9jYWxsLnN2Z1wiO1xuaW1wb3J0IGhhbmd1cEljb25TVkcgZnJvbSBcIi4vaWNvbnMvaGFuZ3VwLnN2Z1wiO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnV0dG9uTW9kdWxlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hY3RvciA9IFN0YXRlTWFjaGluZVNlcnZpY2UuYWN0b3I7XG4gICAgLy8gQmluZGluZyBtZXRob2RzIHRvIHRoZSBjdXJyZW50IGluc3RhbmNlXG4gICAgdGhpcy5yZWdpc3Rlck90aGVyRXZlbnRzKCk7XG5cbiAgICAvLyB0cmFjayB0aGUgZnJlcXVlbmN5IG9mIGJ1ZyAjMjZcbiAgICB0aGlzLnN1Ym1pc3Npb25zV2l0aG91dEFuRXJyb3IgPSAwO1xuICB9XG5cbiAgcmVnaXN0ZXJPdGhlckV2ZW50cygpIHtcbiAgICBFdmVudEJ1cy5vbihcInNheXBpOmF1dG9TdWJtaXRcIiwgKCkgPT4ge1xuICAgICAgdGhpcy5oYW5kbGVBdXRvU3VibWl0KCk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBGdW5jdGlvbiB0byBjcmVhdGUgYSBuZXcgYnV0dG9uXG4gIGNyZWF0ZUJ1dHRvbihsYWJlbCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgIGlmIChsYWJlbCkge1xuICAgICAgYnV0dG9uLnRleHRDb250ZW50ID0gbGFiZWw7XG4gICAgfVxuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgYnV0dG9uLm9uY2xpY2sgPSBjYWxsYmFjaztcbiAgICB9XG4gICAgcmV0dXJuIGJ1dHRvbjtcbiAgfVxuXG4gIC8vIEZ1bmN0aW9uIHRvIHN0eWxlIGEgZ2l2ZW4gYnV0dG9uXG4gIHN0eWxlQnV0dG9uKGJ1dHRvbiwgc3R5bGVzKSB7XG4gICAgZm9yIChsZXQga2V5IGluIHN0eWxlcykge1xuICAgICAgaWYgKHN0eWxlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGJ1dHRvbi5zdHlsZVtrZXldID0gc3R5bGVzW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYWRkVGFsa0ljb24oYnV0dG9uKSB7XG4gICAgdGhpcy51cGRhdGVJY29uQ29udGVudChidXR0b24pO1xuXG4gICAgd2luZG93Lm1hdGNoTWVkaWEoXCIobWF4LXdpZHRoOiA3NjhweClcIikuYWRkTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVJY29uQ29udGVudChidXR0b24pO1xuICAgIH0pO1xuICAgIHRoaXMuc2V0dXBDbGFzc09ic2VydmVyKGJ1dHRvbik7XG4gIH1cblxuICB1cGRhdGVJY29uQ29udGVudChpY29uQ29udGFpbmVyKSB7XG4gICAgaWYgKGlzTW9iaWxlVmlldygpKSB7XG4gICAgICBpY29uQ29udGFpbmVyLmlubmVySFRNTCA9IHJlY3RhbmdsZXNTVkc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGljb25Db250YWluZXIuaW5uZXJIVE1MID0gdGFsa0ljb25TVkc7XG4gICAgfVxuICB9XG5cbiAgc2V0dXBDbGFzc09ic2VydmVyKGJ1dHRvbikge1xuICAgIGNvbnN0IHRhcmdldE5vZGUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7IC8vIFRoZSA8aHRtbD4gZWxlbWVudFxuXG4gICAgY29uc3QgY29uZmlnID0geyBhdHRyaWJ1dGVzOiB0cnVlLCBhdHRyaWJ1dGVGaWx0ZXI6IFtcImNsYXNzXCJdIH07XG5cbiAgICBjb25zdCBjYWxsYmFjayA9IChtdXRhdGlvbnNMaXN0LCBvYnNlcnZlcikgPT4ge1xuICAgICAgZm9yIChsZXQgbXV0YXRpb24gb2YgbXV0YXRpb25zTGlzdCkge1xuICAgICAgICBpZiAobXV0YXRpb24udHlwZSA9PT0gXCJhdHRyaWJ1dGVzXCIpIHtcbiAgICAgICAgICBpZiAobXV0YXRpb24uYXR0cmlidXRlTmFtZSA9PT0gXCJjbGFzc1wiKSB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcIm1vYmlsZS12aWV3XCIpKSB7XG4gICAgICAgICAgICAgIC8vICdtb2JpbGUtdmlldycgY2xhc3Mgd2FzIGFkZGVkXG4gICAgICAgICAgICAgIHRoaXMudXBkYXRlSWNvbkNvbnRlbnQoYnV0dG9uKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vICdtb2JpbGUtdmlldycgY2xhc3Mgd2FzIHJlbW92ZWRcbiAgICAgICAgICAgICAgdGhpcy51cGRhdGVJY29uQ29udGVudChidXR0b24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGNhbGxiYWNrKTtcblxuICAgIC8vIFN0YXJ0IG9ic2VydmluZyB0aGUgdGFyZ2V0IG5vZGUgZm9yIGNvbmZpZ3VyZWQgbXV0YXRpb25zXG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZSh0YXJnZXROb2RlLCBjb25maWcpO1xuXG4gICAgLy8gTGF0ZXIsIHlvdSBjYW4gc3RvcCBvYnNlcnZpbmcgYnkgY2FsbGluZzpcbiAgICAvLyBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gIH1cblxuICAvLyBTaW11bGF0ZSBhbiBcIkVudGVyXCIga2V5cHJlc3MgZXZlbnQgb24gYSBmb3JtXG4gIHNpbXVsYXRlRm9ybVN1Ym1pdCgpIHtcbiAgICBjb25zdCBzdWJtaXRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNheXBpLXN1Ym1pdEJ1dHRvblwiKTtcblxuICAgIGlmIChzdWJtaXRCdXR0b24pIHtcbiAgICAgIGlmIChzdWJtaXRFcnJvckhhbmRsZXIuZGV0ZWN0U3VibWl0RXJyb3IoKSkge1xuICAgICAgICAvLyB0cmFjayBob3cgb2Z0ZW4gdGhpcyBoYXBwZW5zXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgYEF1dG9zdWJtaXQgZmFpbGVkIGFmdGVyICR7dGhpcy5zdWJtaXNzaW9uc1dpdGhvdXRBbkVycm9yfSB0dXJucy5gXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuc3VibWlzc2lvbnNXaXRob3V0QW5FcnJvciA9IDA7XG4gICAgICAgIHN1Ym1pdEVycm9ySGFuZGxlci5oYW5kbGVTdWJtaXRFcnJvcigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdWJtaXNzaW9uc1dpdGhvdXRBbkVycm9yKys7XG4gICAgICAgIHN1Ym1pdEJ1dHRvbi5jbGljaygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvKiBoaXQgZW50ZXIga2V5IGluIHRoZSBwcm9tcHQgdGV4dGFyZWEsIG1pZ2h0IG5vdCB3b3JrIGFzIGV4cGVjdGVkIG9uIFwibmV3IHVpIGxheW91dFwiICovXG4gICAgICBjb25zdCB0ZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F5cGktcHJvbXB0XCIpO1xuXG4gICAgICBjb25zdCBlbnRlckV2ZW50ID0gbmV3IEtleWJvYXJkRXZlbnQoXCJrZXlkb3duXCIsIHtcbiAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAga2V5OiBcIkVudGVyXCIsXG4gICAgICAgIGtleUNvZGU6IDEzLFxuICAgICAgICB3aGljaDogMTMsXG4gICAgICB9KTtcblxuICAgICAgdGV4dGFyZWEuZGlzcGF0Y2hFdmVudChlbnRlckV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvLyBGdW5jdGlvbiB0byBoYW5kbGUgYXV0by1zdWJtaXQgYmFzZWQgb24gdGhlIGJ1dHRvbidzIGRhdGEgYXR0cmlidXRlXG4gIGhhbmRsZUF1dG9TdWJtaXQoKSB7XG4gICAgY29uc3QgdGFsa0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F5cGktdGFsa0J1dHRvblwiKTtcblxuICAgIGlmICh0YWxrQnV0dG9uLmRhdGFzZXQuYXV0b3N1Ym1pdCA9PT0gXCJmYWxzZVwiKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkF1dG9zdWJtaXQgaXMgb2ZmXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNpbXVsYXRlRm9ybVN1Ym1pdCgpO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZUV4aXRCdXR0b24oKSB7XG4gICAgY29uc3QgbGFiZWwgPSBcIkV4aXQgVm9pY2UtQ29udHJvbGxlZCBNb2JpbGUgTW9kZVwiO1xuICAgIGNvbnN0IGJ1dHRvbiA9IHRoaXMuY3JlYXRlQnV0dG9uKFwiXCIsICgpID0+IHtcbiAgICAgIGV4aXRNb2JpbGVNb2RlKCk7XG4gICAgfSk7XG4gICAgYnV0dG9uLmlkID0gXCJzYXlwaS1leGl0QnV0dG9uXCI7XG4gICAgYnV0dG9uLnR5cGUgPSBcImJ1dHRvblwiO1xuICAgIGJ1dHRvbi5jbGFzc05hbWUgPVxuICAgICAgXCJleGl0LWJ1dHRvbiBmaXhlZCByb3VuZGVkLWZ1bGwgYmctY3JlYW0tNTUwIGVuYWJsZWQ6aG92ZXI6YmctY3JlYW0tNjUwXCI7XG4gICAgYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgbGFiZWwpO1xuICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiLCBsYWJlbCk7XG4gICAgYnV0dG9uLmlubmVySFRNTCA9IGV4aXRJY29uU1ZHO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgICByZXR1cm4gYnV0dG9uO1xuICB9XG5cbiAgY3JlYXRlRW50ZXJCdXR0b24oKSB7XG4gICAgY29uc3QgbGFiZWwgPSBcIkVudGVyIFZvaWNlLUNvbnRyb2xsZWQgTW9iaWxlIE1vZGVcIjtcbiAgICBjb25zdCBidXR0b24gPSB0aGlzLmNyZWF0ZUJ1dHRvbihcIlwiLCAoKSA9PiB7XG4gICAgICBlbnRlck1vYmlsZU1vZGUoKTtcbiAgICB9KTtcbiAgICBidXR0b24uaWQgPSBcInNheXBpLWVudGVyQnV0dG9uXCI7XG4gICAgYnV0dG9uLnR5cGUgPSBcImJ1dHRvblwiO1xuICAgIGJ1dHRvbi5jbGFzc05hbWUgPVxuICAgICAgXCJlbnRlci1idXR0b24gZml4ZWQgcm91bmRlZC1mdWxsIGJnLWNyZWFtLTU1MCBlbmFibGVkOmhvdmVyOmJnLWNyZWFtLTY1MFwiO1xuICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIGxhYmVsKTtcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKFwidGl0bGVcIiwgbGFiZWwpO1xuICAgIGJ1dHRvbi5pbm5lckhUTUwgPSBtYXhpbWl6ZUljb25TVkc7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChidXR0b24pO1xuICAgIHJldHVybiBidXR0b247XG4gIH1cblxuICBzaG93Tm90aWZpY2F0aW9uKGRldGFpbHMpIHtcbiAgICBjb25zdCBpY29uID0gZGV0YWlscy5pY29uO1xuICAgIGxldCBpY29uU1ZHO1xuICAgIGlmIChpY29uID09PSBcIm11dGVkLW1pY3JvcGhvbmVcIikge1xuICAgICAgaWNvblNWRyA9IG11dGVkTWljSWNvblNWRztcbiAgICB9XG5cbiAgICBjb25zdCBub3RpZmljYXRpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNheXBpLW5vdGlmaWNhdGlvblwiKTtcbiAgICBpZiAobm90aWZpY2F0aW9uKSB7XG4gICAgICBub3RpZmljYXRpb24uY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICAgIG5vdGlmaWNhdGlvbi5pbm5lckhUTUwgPSBpY29uU1ZHO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBub3RpZmljYXRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgbm90aWZpY2F0aW9uLmlkID0gXCJzYXlwaS1ub3RpZmljYXRpb25cIjtcbiAgICAgIG5vdGlmaWNhdGlvbi5jbGFzc05hbWUgPSBcIm5vdGlmaWNhdGlvblwiO1xuICAgICAgbm90aWZpY2F0aW9uLmlubmVySFRNTCA9IGljb25TVkc7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG5vdGlmaWNhdGlvbik7XG4gICAgfVxuICB9XG5cbiAgZGlzbWlzc05vdGlmaWNhdGlvbigpIHtcbiAgICBjb25zdCBub3RpZmljYXRpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNheXBpLW5vdGlmaWNhdGlvblwiKTtcbiAgICBpZiAobm90aWZpY2F0aW9uKSB7XG4gICAgICBub3RpZmljYXRpb24uY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVDYWxsQnV0dG9uKGNvbnRhaW5lciwgcG9zaXRpb24gPSAwKSB7XG4gICAgY29uc3QgYnV0dG9uID0gdGhpcy5jcmVhdGVCdXR0b24oKTtcbiAgICBidXR0b24uaWQgPSBcInNheXBpLWNhbGxCdXR0b25cIjtcbiAgICBidXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgYnV0dG9uLmNsYXNzTmFtZSA9XG4gICAgICBcImNhbGwtYnV0dG9uIGZpeGVkIHJvdW5kZWQtZnVsbCBiZy1jcmVhbS01NTAgZW5hYmxlZDpob3ZlcjpiZy1jcmVhbS02NTBcIjtcbiAgICB0aGlzLmNhbGxJbmFjdGl2ZShidXR0b24pOyAvLyBtaWMgaXMgb2ZmIGJ5IGRlZmF1bHRcblxuICAgIGFwcGVuZENoaWxkKGNvbnRhaW5lciwgYnV0dG9uLCBwb3NpdGlvbik7XG4gICAgcmV0dXJuIGJ1dHRvbjtcbiAgfVxuXG4gIGNhbGxBY3RpdmUoY2FsbEJ1dHRvbikge1xuICAgIGlmICghY2FsbEJ1dHRvbikge1xuICAgICAgY2FsbEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F5cGktY2FsbEJ1dHRvblwiKTtcbiAgICB9XG4gICAgaWYgKGNhbGxCdXR0b24pIHtcbiAgICAgIGNvbnN0IGxhYmVsID0gXCJBY3RpdmUgY29udGludW91cyBsaXN0ZW5pbmcuIENsaWNrIHRvIHN0b3AuXCI7XG4gICAgICBjYWxsQnV0dG9uLmlubmVySFRNTCA9IGhhbmd1cEljb25TVkc7XG4gICAgICBjYWxsQnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgbGFiZWwpO1xuICAgICAgY2FsbEJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiLCBsYWJlbCk7XG4gICAgICBjYWxsQnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuYWN0b3Iuc2VuZChcInNheXBpOmhhbmd1cFwiKTtcbiAgICAgIH07XG4gICAgICBjYWxsQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgfVxuICB9XG5cbiAgY2FsbEluYWN0aXZlKGNhbGxCdXR0b24pIHtcbiAgICBpZiAoIWNhbGxCdXR0b24pIHtcbiAgICAgIGNhbGxCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNheXBpLWNhbGxCdXR0b25cIik7XG4gICAgfVxuICAgIGlmIChjYWxsQnV0dG9uKSB7XG4gICAgICBjYWxsQnV0dG9uLmlubmVySFRNTCA9IGNhbGxJY29uU1ZHO1xuICAgICAgY2FsbEJ1dHRvbi5zZXRBdHRyaWJ1dGUoXG4gICAgICAgIFwiYXJpYS1sYWJlbFwiLFxuICAgICAgICBcIkNsaWNrIHRvIHN0YXJ0IGNvbnRpbnVvdXMgbGlzdGVuaW5nLlwiXG4gICAgICApO1xuICAgICAgY2FsbEJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiLCBcIk5vdCBsaXN0ZW5pbmcuIENsaWNrIHRvIHN0YXJ0LlwiKTtcbiAgICAgIGNhbGxCdXR0b24ub25jbGljayA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5hY3Rvci5zZW5kKFwic2F5cGk6Y2FsbFwiKTtcbiAgICAgIH07XG4gICAgICBjYWxsQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG4gICAgfVxuICB9XG5cbiAgZGlzYWJsZUNhbGxCdXR0b24oKSB7XG4gICAgY29uc3QgY2FsbEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F5cGktY2FsbEJ1dHRvblwiKTtcbiAgICBpZiAoY2FsbEJ1dHRvbikge1xuICAgICAgY2FsbEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiZGlzYWJsZWRcIik7XG4gICAgICAvLyBkaXNhYmxlIHRoZSBjYWxsIGFjdGlvbiwgYnV0IGFsd2F5cyBhbGxvdyBoYW5ndXBcbiAgICAgIGlmICghY2FsbEJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmVcIikpIHtcbiAgICAgICAgY2FsbEJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZW5hYmxlQ2FsbEJ1dHRvbigpIHtcbiAgICBjb25zdCBjYWxsQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS1jYWxsQnV0dG9uXCIpO1xuICAgIGlmIChjYWxsQnV0dG9uKSB7XG4gICAgICBjYWxsQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNhYmxlZFwiKTtcbiAgICAgIGNhbGxCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cbn1cblxuLy8gU2luZ2xldG9uXG5leHBvcnQgY29uc3QgYnV0dG9uTW9kdWxlID0gbmV3IEJ1dHRvbk1vZHVsZSgpO1xuIiwiZXhwb3J0IGNvbnN0IGNvbmZpZyA9IHtcbiAgYXBwU2VydmVyVXJsOiBwcm9jZXNzLmVudi5BUFBfU0VSVkVSX1VSTCxcbiAgYXBpU2VydmVyVXJsOiBwcm9jZXNzLmVudi5BUElfU0VSVkVSX1VSTCxcbn07XG4iLCJpbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gXCJldmVudHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgbmV3IEV2ZW50RW1pdHRlcigpO1xuIiwiaW1wb3J0IEV2ZW50QnVzIGZyb20gXCIuL0V2ZW50QnVzLmpzXCI7XG5pbXBvcnQgU3RhdGVNYWNoaW5lU2VydmljZSBmcm9tIFwiLi9TdGF0ZU1hY2hpbmVTZXJ2aWNlLmpzXCI7XG5cbmNvbnN0IFVTRVJfU1BFQUtJTkcgPSBcInNheXBpOnVzZXJTcGVha2luZ1wiO1xuY29uc3QgVVNFUl9TVE9QUEVEX1NQRUFLSU5HID0gXCJzYXlwaTp1c2VyU3RvcHBlZFNwZWFraW5nXCI7XG5jb25zdCBVU0VSX0ZJTklTSEVEX1NQRUFLSU5HID0gXCJzYXlwaTp1c2VyRmluaXNoZWRTcGVha2luZ1wiO1xuY29uc3QgUElfU1BFQUtJTkcgPSBcInNheXBpOnBpU3BlYWtpbmdcIjtcbmNvbnN0IFBJX1NUT1BQRURfU1BFQUtJTkcgPSBcInNheXBpOnBpU3RvcHBlZFNwZWFraW5nXCI7XG5jb25zdCBQSV9GSU5JU0hFRF9TUEVBS0lORyA9IFwic2F5cGk6cGlGaW5pc2hlZFNwZWFraW5nXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50TW9kdWxlIHtcbiAgc3RhdGljIGluaXQoKSB7XG4gICAgLy8gQWxsIHRoZSBldmVudCBsaXN0ZW5lcnMgY2FuIGJlIGFkZGVkIGhlcmVcbiAgICB0aGlzLnJlZ2lzdGVyU3RhdGVNYWNoaW5lRXZlbnRzKFN0YXRlTWFjaGluZVNlcnZpY2UuYWN0b3IpO1xuICAgIC8vIEFueSBvdGhlciBpbml0aWFsaXphdGlvbnMuLi5cbiAgfVxuXG4gIHN0YXRpYyBjbGVhbnVwKCkge1xuICAgIC8vIFJlbW92ZSBldmVudCBsaXN0ZW5lcnMgaWYgbmVlZGVkLCBvciBhbnkgb3RoZXIgY2xlYW51cCBvcGVyYXRpb25zXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICBcInNheXBpOnRyYW5zY3JpYmVkXCIsXG4gICAgICB0aGlzLmhhbmRsZVRyYW5zY3JpcHRpb25SZXNwb25zZVxuICAgICk7XG4gIH1cblxuICBzdGF0aWMgc2ltdWxhdGVUeXBpbmcoZWxlbWVudCwgdGV4dCkge1xuICAgIGVsZW1lbnQuZm9jdXMoKTtcblxuICAgIC8vIERlZmluZSBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBtYXRjaCBzZW50ZW5jZSB0ZXJtaW5hdG9ycywgY2FwdHVyaW5nIHRoZW1cbiAgICBjb25zdCBzZW50ZW5jZVJlZ2V4ID0gLyhbLiE/44CC77yf77yBXSspL2c7XG4gICAgY29uc3QgdG9rZW5zID0gdGV4dC5zcGxpdChzZW50ZW5jZVJlZ2V4KS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICAvLyBSZWFzc2VtYmxlIHNlbnRlbmNlcyB3aXRoIHRoZWlyIHRlcm1pbmF0b3JzXG4gICAgY29uc3Qgc2VudGVuY2VzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIGNvbnN0IHNlbnRlbmNlID0gdG9rZW5zW2ldICsgKHRva2Vuc1tpICsgMV0gfHwgXCJcIik7XG4gICAgICBzZW50ZW5jZXMucHVzaChzZW50ZW5jZSk7XG4gICAgfVxuXG4gICAgbGV0IGkgPSAwO1xuXG4gICAgY29uc3QgdHlwZVNlbnRlbmNlID0gKCkgPT4ge1xuICAgICAgaWYgKGkgPCBzZW50ZW5jZXMubGVuZ3RoKSB7XG4gICAgICAgIC8vIFR5cGUgdGhlIHNlbnRlbmNlIGFuZCBpdHMgaW1tZWRpYXRlIGZvbGxvd2luZyB0ZXJtaW5hdG9yXG4gICAgICAgIEV2ZW50TW9kdWxlLnNldE5hdGl2ZVZhbHVlKGVsZW1lbnQsIGVsZW1lbnQudmFsdWUgKyBzZW50ZW5jZXNbaSsrXSk7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0eXBlU2VudGVuY2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRXZlbnRCdXMuZW1pdChcInNheXBpOmF1dG9TdWJtaXRcIik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmIChzZW50ZW5jZXMubGVuZ3RoID4gMSkge1xuICAgICAgLy8gSWYgdGhlcmUgYXJlIG11bHRpcGxlIHNlbnRlbmNlcywgcHJvY2VlZCB3aXRoIHNlbnRlbmNlLXdpc2UgdHlwaW5nXG4gICAgICB0eXBlU2VudGVuY2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgdGV4dCBkb2VzIG5vdCBjb250YWluIHJlY29nbmlzYWJsZSBzZW50ZW5jZSB0ZXJtaW5hdG9ycywgdHlwZSBpdCBhbGwgYXQgb25jZVxuICAgICAgRXZlbnRNb2R1bGUuc2V0TmF0aXZlVmFsdWUoZWxlbWVudCwgdGV4dCk7XG4gICAgICBFdmVudEJ1cy5lbWl0KFwic2F5cGk6YXV0b1N1Ym1pdFwiKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgc2V0TmF0aXZlVmFsdWUoZWxlbWVudCwgdmFsdWUpIHtcbiAgICBsZXQgbGFzdFZhbHVlID0gZWxlbWVudC52YWx1ZTtcbiAgICBlbGVtZW50LnZhbHVlID0gdmFsdWU7XG4gICAgbGV0IGV2ZW50ID0gbmV3IEV2ZW50KFwiaW5wdXRcIiwgeyB0YXJnZXQ6IGVsZW1lbnQsIGJ1YmJsZXM6IHRydWUgfSk7XG4gICAgLy8gUmVhY3QgMTVcbiAgICBldmVudC5zaW11bGF0ZWQgPSB0cnVlO1xuICAgIC8vIFJlYWN0IDE2LTE3XG4gICAgbGV0IHRyYWNrZXIgPSBlbGVtZW50Ll92YWx1ZVRyYWNrZXI7XG4gICAgaWYgKHRyYWNrZXIpIHtcbiAgICAgIHRyYWNrZXIuc2V0VmFsdWUobGFzdFZhbHVlKTtcbiAgICB9XG4gICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgfVxuXG4gIHN0YXRpYyByZWdpc3RlclN0YXRlTWFjaGluZUV2ZW50cyhhY3Rvcikge1xuICAgIEV2ZW50QnVzLm9uKFVTRVJfU1BFQUtJTkcsICgpID0+IHtcbiAgICAgIGFjdG9yLnNlbmQoVVNFUl9TUEVBS0lORyk7XG4gICAgfSk7XG5cbiAgICBbVVNFUl9TVE9QUEVEX1NQRUFLSU5HLCBVU0VSX0ZJTklTSEVEX1NQRUFLSU5HXS5mb3JFYWNoKChldmVudE5hbWUpID0+IHtcbiAgICAgIEV2ZW50QnVzLm9uKGV2ZW50TmFtZSwgKGRldGFpbCkgPT4ge1xuICAgICAgICBpZiAoZGV0YWlsKSB7XG4gICAgICAgICAgYWN0b3Iuc2VuZCh7IHR5cGU6IGV2ZW50TmFtZSwgLi4uZGV0YWlsIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUud2FybihgUmVjZWl2ZWQgJHtldmVudE5hbWV9IHdpdGhvdXQgZGV0YWlscy5gKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBbUElfU1BFQUtJTkcsIFBJX1NUT1BQRURfU1BFQUtJTkcsIFBJX0ZJTklTSEVEX1NQRUFLSU5HXS5mb3JFYWNoKFxuICAgICAgKGV2ZW50TmFtZSkgPT4ge1xuICAgICAgICBFdmVudEJ1cy5vbihldmVudE5hbWUsICgpID0+IHtcbiAgICAgICAgICBhY3Rvci5zZW5kKGV2ZW50TmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICk7XG4gIH1cbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBzZXJpYWxpemVTdGF0ZVZhbHVlKHN0YXRlVmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBzdGF0ZVZhbHVlID09PSBcInN0cmluZ1wiKSB7XG4gICAgcmV0dXJuIHN0YXRlVmFsdWU7XG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmtleXMoc3RhdGVWYWx1ZSlcbiAgICAubWFwKChrZXkpID0+IGAke2tleX06JHtzZXJpYWxpemVTdGF0ZVZhbHVlKHN0YXRlVmFsdWVba2V5XSl9YClcbiAgICAuam9pbihcIixcIik7XG59XG5cbmNvbnN0IERFQlVHID0gZmFsc2U7IC8vIENvbnNpZGVyIHVzaW5nIGNvbmZpZyBhbmQgLmVudiB0byBzZXQgdGhlIERFQlVHIGZsYWdcblxuZXhwb3J0IGNvbnN0IGxvZ2dlciA9IHtcbiAgZGVidWc6ICguLi5hcmdzKSA9PiB7XG4gICAgaWYgKERFQlVHKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkRFQlVHOlwiLCAuLi5hcmdzKTtcbiAgICB9XG4gIH0sXG4gIGluZm86ICguLi5hcmdzKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJJTkZPOlwiLCAuLi5hcmdzKTtcbiAgfSxcbiAgZXJyb3I6ICguLi5hcmdzKSA9PiB7XG4gICAgY29uc29sZS5lcnJvcihcIkVSUk9SOlwiLCAuLi5hcmdzKTtcbiAgfSxcbn07XG4iLCJpbXBvcnQgeyBpbnRlcnByZXQgfSBmcm9tIFwieHN0YXRlXCI7XG5pbXBvcnQgeyBtYWNoaW5lIH0gZnJvbSBcIi4vc3RhdGUtbWFjaGluZXMvU2F5UGlNYWNoaW5lLnRzXCI7XG5pbXBvcnQgeyBsb2dnZXIsIHNlcmlhbGl6ZVN0YXRlVmFsdWUgfSBmcm9tIFwiLi9Mb2dnaW5nTW9kdWxlLmpzXCI7XG5cbi8qKlxuICogQSBzaW5nbGV0b24gc2VydmljZSB0aGF0IG1hbmFnZXMgdGhlIHN0YXRlIG1hY2hpbmUuXG4gKi9cbmNsYXNzIFN0YXRlTWFjaGluZVNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmFjdG9yID0gaW50ZXJwcmV0KG1hY2hpbmUpLm9uVHJhbnNpdGlvbigoc3RhdGUpID0+IHtcbiAgICAgIGlmIChzdGF0ZS5jaGFuZ2VkKSB7XG4gICAgICAgIGNvbnN0IGZyb21TdGF0ZSA9IHN0YXRlLmhpc3RvcnlcbiAgICAgICAgICA/IHNlcmlhbGl6ZVN0YXRlVmFsdWUoc3RhdGUuaGlzdG9yeS52YWx1ZSlcbiAgICAgICAgICA6IFwiTi9BXCI7XG4gICAgICAgIGNvbnN0IHRvU3RhdGUgPSBzZXJpYWxpemVTdGF0ZVZhbHVlKHN0YXRlLnZhbHVlKTtcbiAgICAgICAgbG9nZ2VyLmRlYnVnKFxuICAgICAgICAgIGBTYXksIFBpIE1hY2hpbmUgdHJhbnNpdGlvbmVkIGZyb20gJHtmcm9tU3RhdGV9IHRvICR7dG9TdGF0ZX0gd2l0aCAke3N0YXRlLmV2ZW50LnR5cGV9YFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuYWN0b3Iuc3RhcnQoKTtcbiAgfVxufVxuXG4vLyBTaW5nbGV0b25cbmV4cG9ydCBkZWZhdWx0IG5ldyBTdGF0ZU1hY2hpbmVTZXJ2aWNlKCk7XG4iLCJpbXBvcnQgeyBhcHBlbmRDaGlsZCB9IGZyb20gXCIuL0RPTU1vZHVsZS50c1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNNb2JpbGVEZXZpY2UoKSB7XG4gIHJldHVybiAoXG4gICAgL0FuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fElFTW9iaWxlfE9wZXJhIE1pbmkvaS50ZXN0KFxuICAgICAgbmF2aWdhdG9yLnVzZXJBZ2VudFxuICAgICkgfHwgd2luZG93Lm1hdGNoTWVkaWEoXCIobWF4LXdpZHRoOiA3NjhweClcIikubWF0Y2hlc1xuICApO1xufVxuXG4vLyB0aGlzIGZ1bmN0aW9uIGRldGVybWluZXMgd2hldGhlciB0byBzaG93IHRoZSBtb2JpbGUgdmlldyBvciBub3RcbmV4cG9ydCBmdW5jdGlvbiBpc01vYmlsZVZpZXcoKSB7XG4gIGxldCB1c2VyVmlld1ByZWZlcmVuY2UgPSBudWxsO1xuXG4gIHRyeSB7XG4gICAgdXNlclZpZXdQcmVmZXJlbmNlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ1c2VyVmlld1ByZWZlcmVuY2VcIik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCJDb3VsZCBub3QgYWNjZXNzIGxvY2FsU3RvcmFnZTogXCIsIGUpO1xuICB9XG5cbiAgbGV0IHByZWZlcnNNb2JpbGUgPSBmYWxzZTtcbiAgaWYgKHVzZXJWaWV3UHJlZmVyZW5jZSkge1xuICAgIHByZWZlcnNNb2JpbGUgPSB1c2VyVmlld1ByZWZlcmVuY2UgPT09IFwibW9iaWxlXCI7XG4gIH1cblxuICAvLyBNYWtlIHN1cmUgaXNNb2JpbGVEZXZpY2UgaXMgZGVmaW5lZCBvciBpbXBvcnRlZFxuICByZXR1cm4gaXNNb2JpbGVEZXZpY2UoKSAmJiBwcmVmZXJzTW9iaWxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXhpdE1vYmlsZU1vZGUoKSB7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidXNlclZpZXdQcmVmZXJlbmNlXCIsIFwiZGVza3RvcFwiKTsgLy8gU2F2ZSBwcmVmZXJlbmNlXG5cbiAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwibW9iaWxlLXZpZXdcIik7XG4gIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImRlc2t0b3Atdmlld1wiKTtcblxuICBhdHRhY2hDYWxsQnV0dG9uKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbnRlck1vYmlsZU1vZGUoKSB7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidXNlclZpZXdQcmVmZXJlbmNlXCIsIFwibW9iaWxlXCIpOyAvLyBTYXZlIHByZWZlcmVuY2VcblxuICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJkZXNrdG9wLXZpZXdcIik7XG4gIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcIm1vYmlsZS12aWV3XCIpO1xuXG4gIGRldGFjaENhbGxCdXR0b24oKTtcbn1cblxuZnVuY3Rpb24gYXR0YWNoQ2FsbEJ1dHRvbigpIHtcbiAgLy8gbW92ZSB0aGUgY2FsbCBidXR0b24gYmFjayBpbnRvIHRoZSB0ZXh0IHByb21wdCBjb250YWluZXIgZm9yIGRlc2t0b3Agdmlld1xuICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNheXBpLXByb21wdC1jb250cm9scy1jb250YWluZXJcIik7XG4gIGNvbnN0IGNhbGxCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNheXBpLWNhbGxCdXR0b25cIik7XG4gIGlmIChjb250YWluZXIgJiYgY2FsbEJ1dHRvbikge1xuICAgIGFwcGVuZENoaWxkKGNvbnRhaW5lciwgY2FsbEJ1dHRvbiwgLTEpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGRldGFjaENhbGxCdXR0b24oKSB7XG4gIC8vIHJlbW92ZSB0aGUgY2FsbCBidXR0b24gZnJvbSB0aGUgdGV4dCBwcm9tcHQgY29udGFpbmVyIHdoaWxlIGluIG1vYmlsZSB2aWV3XG4gIGNvbnN0IGNhbGxCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNheXBpLWNhbGxCdXR0b25cIik7XG4gIGlmIChjYWxsQnV0dG9uKSB7XG4gICAgYXBwZW5kQ2hpbGQoZG9jdW1lbnQuYm9keSwgY2FsbEJ1dHRvbik7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFVzZXJBZ2VudEZsYWdzKCkge1xuICBjb25zdCBpc0ZpcmVmb3hBbmRyb2lkID1cbiAgICAvRmlyZWZveC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSAmJiAvQW5kcm9pZC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcblxuICBpZiAoaXNGaXJlZm94QW5kcm9pZCkge1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImZpcmVmb3gtYW5kcm9pZFwiKTtcbiAgfVxuXG4gIGFkZERldmljZUZsYWdzKGVsZW1lbnQpO1xuICBhZGRWaWV3RmxhZ3MoZWxlbWVudCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGREZXZpY2VGbGFncyhlbGVtZW50KSB7XG4gIGlmIChpc01vYmlsZURldmljZSgpKSB7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwibW9iaWxlLWRldmljZVwiKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkVmlld0ZsYWdzKGVsZW1lbnQpIHtcbiAgaWYgKGlzTW9iaWxlVmlldygpKSB7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiZGVza3RvcC12aWV3XCIpO1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcIm1vYmlsZS12aWV3XCIpO1xuICB9IGVsc2Uge1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcIm1vYmlsZS12aWV3XCIpO1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImRlc2t0b3Atdmlld1wiKTtcbiAgfVxufVxuXG4vKipcbiAqIFBlcmZvcm0gaW5pdGlhbCBzZXR1cCBvZiB0aGUgVUkgYmFzZWQgb24gdGhlIHVzZXIncyBkZXZpY2UgYW5kIHZpZXcgcHJlZmVyZW5jZXNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXRNb2RlKCkge1xuICBpZiAoaXNNb2JpbGVWaWV3KCkpIHtcbiAgICBlbnRlck1vYmlsZU1vZGUoKTtcbiAgfSBlbHNlIHtcbiAgICBleGl0TW9iaWxlTW9kZSgpO1xuICB9XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCB7IGJ1dHRvbk1vZHVsZSB9IGZyb20gXCIuL0J1dHRvbk1vZHVsZS5qc1wiO1xuaW1wb3J0IEV2ZW50QnVzIGZyb20gXCIuL0V2ZW50QnVzLmpzXCI7XG5pbXBvcnQgRXZlbnRNb2R1bGUgZnJvbSBcIi4vRXZlbnRNb2R1bGUuanNcIjtcbmltcG9ydCB7IGFkZFVzZXJBZ2VudEZsYWdzLCBpbml0TW9kZSB9IGZyb20gXCIuL1VzZXJBZ2VudE1vZHVsZS5qc1wiO1xuaW1wb3J0IHsgc3VibWl0RXJyb3JIYW5kbGVyIH0gZnJvbSBcIi4vU3VibWl0RXJyb3JIYW5kbGVyLnRzXCI7XG5pbXBvcnQgeyBjb25maWcgYXMgc2VydmVyQ29uZmlnIH0gZnJvbSBcIi4vQ29uZmlnTW9kdWxlLmpzXCI7XG5cbmltcG9ydCBcIi4vc3R5bGVzL2NvbW1vbi5zY3NzXCI7XG5pbXBvcnQgXCIuL3N0eWxlcy9kZXNrdG9wLnNjc3NcIjtcbmltcG9ydCBcIi4vc3R5bGVzL21vYmlsZS5zY3NzXCI7XG5pbXBvcnQgXCIuL3N0eWxlcy9yZWN0YW5nbGVzLmNzc1wiO1xuXG4oYXN5bmMgZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBjb25zdCBhdWRpb01vZHVsZVVybCA9IGAke3NlcnZlckNvbmZpZy5hcHBTZXJ2ZXJVcmx9L2F1ZGlvTW9kdWxlLmJ1bmRsZS5qc2A7XG5cbiAgbGV0IHBhZ2VTY3JpcHQ7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChhdWRpb01vZHVsZVVybCk7XG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTmV0d29yayByZXNwb25zZSB3YXMgbm90IG9rIFwiICsgcmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgfVxuICAgIHBhZ2VTY3JpcHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIlRoZXJlIGhhcyBiZWVuIGEgcHJvYmxlbSB3aXRoIHlvdXIgZmV0Y2ggb3BlcmF0aW9uOlwiLCBlcnJvcik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5qZWN0U2NyaXB0KGNhbGxiYWNrKSB7XG4gICAgdmFyIHNjcmlwdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgIHNjcmlwdEVsZW1lbnQudHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCI7XG4gICAgc2NyaXB0RWxlbWVudC5pZCA9IFwic2F5cGktc2NyaXB0XCI7XG4gICAgc2NyaXB0RWxlbWVudC50ZXh0Q29udGVudCA9IHBhZ2VTY3JpcHQ7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHRFbGVtZW50KTtcblxuICAgIC8vIENhbGwgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIGFmdGVyIHRoZSBzY3JpcHQgaXMgYWRkZWRcbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuICB9XG5cbiAgYWRkVXNlckFnZW50RmxhZ3MoKTtcbiAgRXZlbnRNb2R1bGUuaW5pdCgpO1xuICBzZXR1cEV2ZW50QnVzKCk7XG5cbiAgLy8gQ3JlYXRlIGEgTXV0YXRpb25PYnNlcnZlciB0byBsaXN0ZW4gZm9yIGNoYW5nZXMgdG8gdGhlIERPTVxuICAvLyB0ZXh0YXJlYXMgYXJlIGFkZGVkIHRvIHRoZSBET00gYWZ0ZXIgdGhlIHBhZ2UgbG9hZHNcbiAgY29uc3QgY2FsbGJhY2sgPSBmdW5jdGlvbiAobXV0YXRpb25zTGlzdCwgb2JzZXJ2ZXIpIHtcbiAgICBmb3IgKGNvbnN0IG11dGF0aW9uIG9mIG11dGF0aW9uc0xpc3QpIHtcbiAgICAgIGlmIChtdXRhdGlvbi50eXBlID09PSBcImNoaWxkTGlzdFwiKSB7XG4gICAgICAgIC8vIEl0ZXJhdGUgdGhyb3VnaCBhZGRlZCBub2Rlc1xuICAgICAgICBtdXRhdGlvbi5hZGRlZE5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgICAvLyBDaGVjayBpZiBhZGRlZCBub2RlIGlzIGEgdGV4dGFyZWEgd2l0aCAnZW50ZXJrZXloaW50JyBhdHRyaWJ1dGVcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBub2RlLm5vZGVOYW1lID09PSBcIlRFWFRBUkVBXCIgJiZcbiAgICAgICAgICAgIG5vZGUuaGFzQXR0cmlidXRlKFwiZW50ZXJrZXloaW50XCIpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyBTdG9wIG9ic2VydmluZyB0byBhdm9pZCBhbnkgcG90ZW50aWFsIGluZmluaXRlIGxvb3BzXG4gICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG5cbiAgICAgICAgICAgIC8vIERvIHNvbWV0aGluZyB3aXRoIHRoZSB0ZXh0YXJlYSwgbGlrZSBhZGQgYW4gZXZlbnQgbGlzdGVuZXJcbiAgICAgICAgICAgIGFubm90YXRlRE9NKG5vZGUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIENoZWNrIGlmIGFkZGVkIG5vZGUgY29udGFpbnMgYSB0ZXh0YXJlYSB3aXRoICdlbnRlcmtleWhpbnQnIGF0dHJpYnV0ZVxuICAgICAgICAgIGlmIChub2RlLnF1ZXJ5U2VsZWN0b3JBbGwpIHtcbiAgICAgICAgICAgIGNvbnN0IHRleHRhcmVhcyA9IG5vZGUucXVlcnlTZWxlY3RvckFsbChcInRleHRhcmVhW2VudGVya2V5aGludF1cIik7XG4gICAgICAgICAgICBpZiAodGV4dGFyZWFzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgLy8gU3RvcCBvYnNlcnZpbmdcbiAgICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuXG4gICAgICAgICAgICAgIC8vIERvIHNvbWV0aGluZyB3aXRoIHRoZSBmaXJzdCB0ZXh0YXJlYSB0aGF0IGhhcyAnZW50ZXJrZXloaW50J1xuICAgICAgICAgICAgICBhbm5vdGF0ZURPTSh0ZXh0YXJlYXNbMF0pO1xuICAgICAgICAgICAgICBzdWJtaXRFcnJvckhhbmRsZXIuaW5pdEF1ZGlvT3V0cHV0TGlzdGVuZXIoKTtcbiAgICAgICAgICAgICAgc3VibWl0RXJyb3JIYW5kbGVyLmNoZWNrRm9yUmVzdG9yZVBvaW50KCk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvLyBPcHRpb25zIGZvciB0aGUgb2JzZXJ2ZXIgKHdoaWNoIG11dGF0aW9ucyB0byBvYnNlcnZlKVxuICBjb25zdCBjb25maWcgPSB7IGF0dHJpYnV0ZXM6IGZhbHNlLCBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUgfTtcblxuICAvLyBDcmVhdGUgYW4gb2JzZXJ2ZXIgaW5zdGFuY2UgbGlua2VkIHRvIHRoZSBjYWxsYmFjayBmdW5jdGlvblxuICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGNhbGxiYWNrKTtcblxuICAvLyBTdGFydCBvYnNlcnZpbmcgdGhlIHRhcmdldCBub2RlIGZvciBjb25maWd1cmVkIG11dGF0aW9uc1xuICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmJvZHksIGNvbmZpZyk7XG5cbiAgZnVuY3Rpb24gc2V0dXBFdmVudEJ1cygpIHtcbiAgICAvLyBTZXR0aW5nIHRoZSBjb3JyZWN0IGNvbnRleHRcbiAgICBsZXQgY29udGV4dCA9IHdpbmRvdztcbiAgICBpZiAoR01faW5mby5zY3JpcHRIYW5kbGVyICE9PSBcIlVzZXJzY3JpcHRzXCIpIHtcbiAgICAgIGNvbnRleHQgPSB1bnNhZmVXaW5kb3c7XG4gICAgfVxuICAgIGNvbnRleHQuRXZlbnRCdXMgPSBFdmVudEJ1czsgLy8gTWFrZSB0aGUgRXZlbnRCdXMgYXZhaWxhYmxlIHRvIHRoZSBwYWdlIHNjcmlwdFxuICB9XG5cbiAgZnVuY3Rpb24gYW5ub3RhdGVET00ocHJvbXB0KSB7XG4gICAgLy8gQWRkIGlkIGF0dHJpYnV0ZXMgdG8gaW1wb3J0YW50IGVsZW1lbnRzXG4gICAgcHJvbXB0LmlkID0gXCJzYXlwaS1wcm9tcHRcIjtcbiAgICBwcm9tcHQucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwic2F5cGktcHJvbXB0LWNvbnRhaW5lclwiKTtcbiAgICBjb25zdCBmb3VuZEZvb3RlciA9IGFkZElkRm9vdGVyKCk7XG4gICAgY29uc3QgZm91bmRBdWRpb0NvbnRyb2xzID0gYWRkSWRBdWRpb0NvbnRyb2xzKCk7XG4gICAgY29uc3QgcHJvbXB0Q29udHJvbHNDb250YWluZXIgPSBwcm9tcHQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgIHByb21wdENvbnRyb2xzQ29udGFpbmVyLmlkID0gXCJzYXlwaS1wcm9tcHQtY29udHJvbHMtY29udGFpbmVyXCI7XG4gICAgY29uc3QgZm91bmRQcm9tcHRBbmNlc3RvciA9IGFkZElkUHJvbXB0QW5jZXN0b3IocHJvbXB0Q29udHJvbHNDb250YWluZXIpO1xuICAgIGNvbnN0IGZvdW5kQXVkaW9PdXRwdXRCdXR0b24gPSBhZGRJZEF1ZGlvT3V0cHV0QnV0dG9uKCk7XG4gICAgYWRkSWRTdWJtaXRCdXR0b24ocHJvbXB0Q29udHJvbHNDb250YWluZXIpO1xuICAgIGFkZFRhbGtCdXR0b24oZG9jdW1lbnQuYm9keSk7XG4gICAgYnV0dG9uTW9kdWxlLmNyZWF0ZUNhbGxCdXR0b24ocHJvbXB0Q29udHJvbHNDb250YWluZXIsIC0xKTtcbiAgICBidXR0b25Nb2R1bGUuY3JlYXRlRW50ZXJCdXR0b24oKTtcbiAgICBidXR0b25Nb2R1bGUuY3JlYXRlRXhpdEJ1dHRvbigpO1xuICAgIGluaXRNb2RlKCk7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRJZFByb21wdEFuY2VzdG9yKGNvbnRhaW5lcikge1xuICAgIC8vIGNsaW1iIHVwIHRoZSBET00gdHJlZSB1bnRpbCB3ZSBmaW5kIGEgZGl2IHdpdGggY2xhc3MgJ3ctZnVsbCdcbiAgICBsZXQgcGFyZW50ID0gY29udGFpbmVyLnBhcmVudEVsZW1lbnQ7XG4gICAgd2hpbGUgKHBhcmVudCkge1xuICAgICAgaWYgKHBhcmVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJ3LWZ1bGxcIikpIHtcbiAgICAgICAgcGFyZW50LmlkID0gXCJzYXlwaS1wcm9tcHQtYW5jZXN0b3JcIjtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50RWxlbWVudDtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkSWRTdWJtaXRCdXR0b24oY29udGFpbmVyKSB7XG4gICAgY29uc3Qgc3VibWl0QnV0dG9ucyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKFwiYnV0dG9uW3R5cGU9YnV0dG9uXVwiKTtcbiAgICBpZiAoc3VibWl0QnV0dG9ucy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBsYXN0U3VibWl0QnV0dG9uID0gc3VibWl0QnV0dG9uc1tzdWJtaXRCdXR0b25zLmxlbmd0aCAtIDFdO1xuICAgICAgbGFzdFN1Ym1pdEJ1dHRvbi5pZCA9IFwic2F5cGktc3VibWl0QnV0dG9uXCI7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYWRkSWRGb290ZXIoKSB7XG4gICAgLy8gRmluZCBhbGwgYXVkaW8gZWxlbWVudHMgb24gdGhlIHBhZ2VcbiAgICB2YXIgYXVkaW9FbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJhdWRpb1wiKTtcbiAgICB2YXIgZm91bmQgPSBmYWxzZTsgLy8gZGVmYXVsdCB0byBub3QgZm91bmRcblxuICAgIGF1ZGlvRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoYXVkaW8pIHtcbiAgICAgIHZhciBwcmVjZWRpbmdEaXYgPSBhdWRpby5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuXG4gICAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGZvdW5kIGEgZGl2LCB3ZSBjYW4gc2tpcCBmdXJ0aGVyIGl0ZXJhdGlvbnNcbiAgICAgIGlmIChmb3VuZCkgcmV0dXJuO1xuXG4gICAgICAvLyBDaGVjayBpZiB0aGUgcHJlY2VkaW5nIGVsZW1lbnQgaXMgYSBkaXZcbiAgICAgIGlmIChwcmVjZWRpbmdEaXYgJiYgcHJlY2VkaW5nRGl2LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJkaXZcIikge1xuICAgICAgICAvLyBBc3NpZ24gYW4gSUQgdG8gdGhlIGRpdlxuICAgICAgICBwcmVjZWRpbmdEaXYubGFzdEVsZW1lbnRDaGlsZC5pZCA9IFwic2F5cGktZm9vdGVyXCI7XG4gICAgICAgIGZvdW5kID0gdHJ1ZTsgLy8gc2V0IHRvIGZvdW5kXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZm91bmQ7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRJZEF1ZGlvQ29udHJvbHMoKSB7XG4gICAgLy8gRmluZCBhbGwgYXVkaW8gZWxlbWVudHMgb24gdGhlIHBhZ2VcbiAgICB2YXIgYXVkaW9FbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJhdWRpb1wiKTtcbiAgICB2YXIgZm91bmQgPSBmYWxzZTsgLy8gZGVmYXVsdCB0byBub3QgZm91bmRcblxuICAgIGF1ZGlvRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoYXVkaW8pIHtcbiAgICAgIHZhciBuZXh0RGl2ID0gYXVkaW8ubmV4dEVsZW1lbnRTaWJsaW5nO1xuXG4gICAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGZvdW5kIGEgZGl2LCB3ZSBjYW4gc2tpcCBmdXJ0aGVyIGl0ZXJhdGlvbnNcbiAgICAgIGlmIChmb3VuZCkgcmV0dXJuO1xuXG4gICAgICAvLyBDaGVjayBpZiB0aGUgcHJlY2VkaW5nIGVsZW1lbnQgaXMgYSBkaXZcbiAgICAgIGlmIChuZXh0RGl2ICYmIG5leHREaXYudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImRpdlwiKSB7XG4gICAgICAgIC8vIEFzc2lnbiBhbiBJRCB0byB0aGUgZGl2XG4gICAgICAgIG5leHREaXYuaWQgPSBcInNheXBpLWF1ZGlvLWNvbnRyb2xzXCI7XG4gICAgICAgIGZvdW5kID0gdHJ1ZTsgLy8gc2V0IHRvIGZvdW5kXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZm91bmQ7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRJZEF1ZGlvT3V0cHV0QnV0dG9uKCkge1xuICAgIC8vIGF1ZGlvIGJ1dHRvbiBpcyB0aGUgbGFzdCBidXR0b24gZWxlbWVudCBpbiB0aGUgYXVkaW8gY29udHJvbHMgY29udGFpbmVyXG4gICAgY29uc3QgYXVkaW9CdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgXCIjc2F5cGktYXVkaW8tY29udHJvbHMgPiBkaXYgPiBkaXYucmVsYXRpdmUuZmxleC5pdGVtcy1jZW50ZXIuanVzdGlmeS1lbmQuc2VsZi1lbmQucC0yID4gYnV0dG9uXCJcbiAgICApO1xuICAgIGlmICghYXVkaW9CdXR0b24pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXVkaW9CdXR0b24uaWQgPSBcInNheXBpLWF1ZGlvLW91dHB1dC1idXR0b25cIjtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRUYWxrQnV0dG9uKGNvbnRhaW5lcikge1xuICAgIC8vIENyZWF0ZSBhIGNvbnRhaW5pbmcgZGl2XG4gICAgdmFyIHBhbmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBwYW5lbC5pZCA9IFwic2F5cGktcGFuZWxcIjtcblxuICAgIGlmIChjb250YWluZXIpIHtcbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChwYW5lbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocGFuZWwpO1xuICAgIH1cblxuICAgIC8vIHRhbGsgXCJidXR0b25cIiBpcyBubyBsb25nZXIgYSBidXR0b24sIGJ1dCBhIGRpdlxuICAgIHZhciBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGJ1dHRvbi5pZCA9IFwic2F5cGktdGFsa0J1dHRvblwiO1xuXG4gICAgY29uc3QgY2xhc3NOYW1lcyA9XG4gICAgICBcInJlbGF0aXZlIGZsZXggbXQtMSBtYi0xIHJvdW5kZWQtZnVsbCBweC0yIHB5LTMgdGV4dC1jZW50ZXIgYmctY3JlYW0tNTUwIGhvdmVyOmJnLWNyZWFtLTY1MCBob3Zlcjp0ZXh0LWJyYW5kLWdyZWVuLTcwMCB0ZXh0LW11dGVkXCI7XG4gICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lcy5zcGxpdChcIiBcIikpO1xuXG4gICAgLy8gRW5hYmxlIGF1dG9zdWJtaXQgYnkgZGVmYXVsdFxuICAgIGJ1dHRvbi5kYXRhc2V0LmF1dG9zdWJtaXQgPSBcInRydWVcIjtcbiAgICBidXR0b24uY2xhc3NMaXN0LmFkZChcImF1dG9TdWJtaXRcIik7XG5cbiAgICBwYW5lbC5hcHBlbmRDaGlsZChidXR0b24pO1xuICAgIGJ1dHRvbk1vZHVsZS5hZGRUYWxrSWNvbihidXR0b24pO1xuXG4gICAgLy8gQ2FsbCB0aGUgZnVuY3Rpb24gdG8gaW5qZWN0IHRoZSBzY3JpcHQgYWZ0ZXIgdGhlIGJ1dHRvbiBoYXMgYmVlbiBhZGRlZFxuICAgIGluamVjdFNjcmlwdCgpO1xuICB9XG5cbiAgLy8gU3RhcnQgb2JzZXJ2aW5nIHRoZSBlbnRpcmUgZG9jdW1lbnQgZm9yIGNoYW5nZXMgdG8gY2hpbGQgbm9kZXMgYW5kIHN1YnRyZWVcbiAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudCwgeyBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUgfSk7XG59KSgpO1xuIl0sIm5hbWVzIjpbIkFuaW1hdGlvbk1vZHVsZSIsIl9jbGFzc0NhbGxDaGVjayIsIl9jcmVhdGVDbGFzcyIsImtleSIsInZhbHVlIiwic3RhcnRBbmltYXRpb24iLCJhbmltYXRpb24iLCJzdG9wT3RoZXJBbmltYXRpb25zIiwicmVjdGFuZ2xlcyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsInJlY3RhbmdsZXNTZWxlY3RvciIsImZvckVhY2giLCJyZWN0IiwiY2xhc3NMaXN0IiwiYWRkIiwic3RvcEFuaW1hdGlvbiIsInJlbW92ZSIsInN0b3BBbGxBbmltYXRpb25zIiwiX3RoaXMiLCJ0YWxrQnV0dG9uQW5pbWF0aW9ucyIsImtlZXBBbmltYXRpb24iLCJfdGhpczIiLCJfZGVmaW5lUHJvcGVydHkiLCJkZWZhdWx0IiwiZW50ZXJNb2JpbGVNb2RlIiwiZXhpdE1vYmlsZU1vZGUiLCJpc01vYmlsZVZpZXciLCJhcHBlbmRDaGlsZCIsIkV2ZW50QnVzIiwiU3RhdGVNYWNoaW5lU2VydmljZSIsInN1Ym1pdEVycm9ySGFuZGxlciIsImV4aXRJY29uU1ZHIiwibWF4aW1pemVJY29uU1ZHIiwicmVjdGFuZ2xlc1NWRyIsInRhbGtJY29uU1ZHIiwibXV0ZWRNaWNJY29uU1ZHIiwiY2FsbEljb25TVkciLCJoYW5ndXBJY29uU1ZHIiwiQnV0dG9uTW9kdWxlIiwiYWN0b3IiLCJyZWdpc3Rlck90aGVyRXZlbnRzIiwic3VibWlzc2lvbnNXaXRob3V0QW5FcnJvciIsIm9uIiwiaGFuZGxlQXV0b1N1Ym1pdCIsImNyZWF0ZUJ1dHRvbiIsImxhYmVsIiwiY2FsbGJhY2siLCJidXR0b24iLCJjcmVhdGVFbGVtZW50IiwidGV4dENvbnRlbnQiLCJvbmNsaWNrIiwic3R5bGVCdXR0b24iLCJzdHlsZXMiLCJoYXNPd25Qcm9wZXJ0eSIsInN0eWxlIiwiYWRkVGFsa0ljb24iLCJ1cGRhdGVJY29uQ29udGVudCIsIndpbmRvdyIsIm1hdGNoTWVkaWEiLCJhZGRMaXN0ZW5lciIsInNldHVwQ2xhc3NPYnNlcnZlciIsImljb25Db250YWluZXIiLCJpbm5lckhUTUwiLCJfdGhpczMiLCJ0YXJnZXROb2RlIiwiZG9jdW1lbnRFbGVtZW50IiwiY29uZmlnIiwiYXR0cmlidXRlcyIsImF0dHJpYnV0ZUZpbHRlciIsIm11dGF0aW9uc0xpc3QiLCJvYnNlcnZlciIsIl9pdGVyYXRvciIsIl9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyIiwiX3N0ZXAiLCJzIiwibiIsImRvbmUiLCJtdXRhdGlvbiIsInR5cGUiLCJhdHRyaWJ1dGVOYW1lIiwiY29udGFpbnMiLCJlcnIiLCJlIiwiZiIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJvYnNlcnZlIiwic2ltdWxhdGVGb3JtU3VibWl0Iiwic3VibWl0QnV0dG9uIiwiZ2V0RWxlbWVudEJ5SWQiLCJkZXRlY3RTdWJtaXRFcnJvciIsImNvbnNvbGUiLCJlcnJvciIsImNvbmNhdCIsImhhbmRsZVN1Ym1pdEVycm9yIiwiY2xpY2siLCJ0ZXh0YXJlYSIsImVudGVyRXZlbnQiLCJLZXlib2FyZEV2ZW50IiwiYnViYmxlcyIsImtleUNvZGUiLCJ3aGljaCIsImRpc3BhdGNoRXZlbnQiLCJ0YWxrQnV0dG9uIiwiZGF0YXNldCIsImF1dG9zdWJtaXQiLCJsb2ciLCJjcmVhdGVFeGl0QnV0dG9uIiwiaWQiLCJjbGFzc05hbWUiLCJzZXRBdHRyaWJ1dGUiLCJib2R5IiwiY3JlYXRlRW50ZXJCdXR0b24iLCJzaG93Tm90aWZpY2F0aW9uIiwiZGV0YWlscyIsImljb24iLCJpY29uU1ZHIiwibm90aWZpY2F0aW9uIiwiZGlzbWlzc05vdGlmaWNhdGlvbiIsImNyZWF0ZUNhbGxCdXR0b24iLCJjb250YWluZXIiLCJwb3NpdGlvbiIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsImNhbGxJbmFjdGl2ZSIsImNhbGxBY3RpdmUiLCJjYWxsQnV0dG9uIiwiX3RoaXM0Iiwic2VuZCIsIl90aGlzNSIsImRpc2FibGVDYWxsQnV0dG9uIiwiZGlzYWJsZWQiLCJlbmFibGVDYWxsQnV0dG9uIiwiYnV0dG9uTW9kdWxlIiwiYXBwU2VydmVyVXJsIiwicHJvY2VzcyIsImVudiIsIkFQUF9TRVJWRVJfVVJMIiwiYXBpU2VydmVyVXJsIiwiQVBJX1NFUlZFUl9VUkwiLCJFdmVudEVtaXR0ZXIiLCJVU0VSX1NQRUFLSU5HIiwiVVNFUl9TVE9QUEVEX1NQRUFLSU5HIiwiVVNFUl9GSU5JU0hFRF9TUEVBS0lORyIsIlBJX1NQRUFLSU5HIiwiUElfU1RPUFBFRF9TUEVBS0lORyIsIlBJX0ZJTklTSEVEX1NQRUFLSU5HIiwiRXZlbnRNb2R1bGUiLCJpbml0IiwicmVnaXN0ZXJTdGF0ZU1hY2hpbmVFdmVudHMiLCJjbGVhbnVwIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImhhbmRsZVRyYW5zY3JpcHRpb25SZXNwb25zZSIsInNpbXVsYXRlVHlwaW5nIiwiZWxlbWVudCIsInRleHQiLCJmb2N1cyIsInNlbnRlbmNlUmVnZXgiLCJ0b2tlbnMiLCJzcGxpdCIsImZpbHRlciIsIkJvb2xlYW4iLCJzZW50ZW5jZXMiLCJpIiwic2VudGVuY2UiLCJwdXNoIiwidHlwZVNlbnRlbmNlIiwic2V0TmF0aXZlVmFsdWUiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJlbWl0IiwibGFzdFZhbHVlIiwiZXZlbnQiLCJFdmVudCIsInRhcmdldCIsInNpbXVsYXRlZCIsInRyYWNrZXIiLCJfdmFsdWVUcmFja2VyIiwic2V0VmFsdWUiLCJldmVudE5hbWUiLCJkZXRhaWwiLCJfb2JqZWN0U3ByZWFkIiwid2FybiIsInNlcmlhbGl6ZVN0YXRlVmFsdWUiLCJzdGF0ZVZhbHVlIiwiT2JqZWN0Iiwia2V5cyIsIm1hcCIsImpvaW4iLCJERUJVRyIsImxvZ2dlciIsImRlYnVnIiwiX2NvbnNvbGUiLCJfbGVuIiwiYXJncyIsIkFycmF5IiwiX2tleSIsImFwcGx5IiwiaW5mbyIsIl9jb25zb2xlMiIsIl9sZW4yIiwiX2tleTIiLCJfY29uc29sZTMiLCJfbGVuMyIsIl9rZXkzIiwiaW50ZXJwcmV0IiwibWFjaGluZSIsIm9uVHJhbnNpdGlvbiIsInN0YXRlIiwiY2hhbmdlZCIsImZyb21TdGF0ZSIsImhpc3RvcnkiLCJ0b1N0YXRlIiwic3RhcnQiLCJpc01vYmlsZURldmljZSIsInRlc3QiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJtYXRjaGVzIiwidXNlclZpZXdQcmVmZXJlbmNlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInByZWZlcnNNb2JpbGUiLCJzZXRJdGVtIiwiYXR0YWNoQ2FsbEJ1dHRvbiIsImRldGFjaENhbGxCdXR0b24iLCJhZGRVc2VyQWdlbnRGbGFncyIsImlzRmlyZWZveEFuZHJvaWQiLCJhZGREZXZpY2VGbGFncyIsImFkZFZpZXdGbGFncyIsImluaXRNb2RlIiwiX3JlZ2VuZXJhdG9yUnVudGltZSIsImV4cG9ydHMiLCJPcCIsInByb3RvdHlwZSIsImhhc093biIsImRlZmluZVByb3BlcnR5Iiwib2JqIiwiZGVzYyIsIiRTeW1ib2wiLCJTeW1ib2wiLCJpdGVyYXRvclN5bWJvbCIsIml0ZXJhdG9yIiwiYXN5bmNJdGVyYXRvclN5bWJvbCIsImFzeW5jSXRlcmF0b3IiLCJ0b1N0cmluZ1RhZ1N5bWJvbCIsInRvU3RyaW5nVGFnIiwiZGVmaW5lIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwid3JhcCIsImlubmVyRm4iLCJvdXRlckZuIiwic2VsZiIsInRyeUxvY3NMaXN0IiwicHJvdG9HZW5lcmF0b3IiLCJHZW5lcmF0b3IiLCJnZW5lcmF0b3IiLCJjcmVhdGUiLCJjb250ZXh0IiwiQ29udGV4dCIsIm1ha2VJbnZva2VNZXRob2QiLCJ0cnlDYXRjaCIsImZuIiwiYXJnIiwiY2FsbCIsIkNvbnRpbnVlU2VudGluZWwiLCJHZW5lcmF0b3JGdW5jdGlvbiIsIkdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlIiwiSXRlcmF0b3JQcm90b3R5cGUiLCJnZXRQcm90byIsImdldFByb3RvdHlwZU9mIiwiTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUiLCJ2YWx1ZXMiLCJHcCIsImRlZmluZUl0ZXJhdG9yTWV0aG9kcyIsIm1ldGhvZCIsIl9pbnZva2UiLCJBc3luY0l0ZXJhdG9yIiwiUHJvbWlzZUltcGwiLCJpbnZva2UiLCJyZXNvbHZlIiwicmVqZWN0IiwicmVjb3JkIiwicmVzdWx0IiwiX3R5cGVvZiIsIl9fYXdhaXQiLCJ0aGVuIiwidW53cmFwcGVkIiwicHJldmlvdXNQcm9taXNlIiwiY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmciLCJFcnJvciIsImRlbGVnYXRlIiwiZGVsZWdhdGVSZXN1bHQiLCJtYXliZUludm9rZURlbGVnYXRlIiwic2VudCIsIl9zZW50IiwiZGlzcGF0Y2hFeGNlcHRpb24iLCJhYnJ1cHQiLCJtZXRob2ROYW1lIiwiVHlwZUVycm9yIiwicmVzdWx0TmFtZSIsIm5leHQiLCJuZXh0TG9jIiwicHVzaFRyeUVudHJ5IiwibG9jcyIsImVudHJ5IiwidHJ5TG9jIiwiY2F0Y2hMb2MiLCJmaW5hbGx5TG9jIiwiYWZ0ZXJMb2MiLCJ0cnlFbnRyaWVzIiwicmVzZXRUcnlFbnRyeSIsImNvbXBsZXRpb24iLCJyZXNldCIsIml0ZXJhYmxlIiwiaXRlcmF0b3JNZXRob2QiLCJpc05hTiIsImRpc3BsYXlOYW1lIiwiaXNHZW5lcmF0b3JGdW5jdGlvbiIsImdlbkZ1biIsImN0b3IiLCJjb25zdHJ1Y3RvciIsIm5hbWUiLCJtYXJrIiwic2V0UHJvdG90eXBlT2YiLCJfX3Byb3RvX18iLCJhd3JhcCIsImFzeW5jIiwiUHJvbWlzZSIsIml0ZXIiLCJ2YWwiLCJvYmplY3QiLCJyZXZlcnNlIiwicG9wIiwic2tpcFRlbXBSZXNldCIsInByZXYiLCJjaGFyQXQiLCJzbGljZSIsInN0b3AiLCJyb290UmVjb3JkIiwicnZhbCIsImV4Y2VwdGlvbiIsImhhbmRsZSIsImxvYyIsImNhdWdodCIsImhhc0NhdGNoIiwiaGFzRmluYWxseSIsImZpbmFsbHlFbnRyeSIsImNvbXBsZXRlIiwiZmluaXNoIiwiX2NhdGNoIiwidGhyb3duIiwiZGVsZWdhdGVZaWVsZCIsIm8iLCJhbGxvd0FycmF5TGlrZSIsIml0IiwiaXNBcnJheSIsIl91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheSIsIkYiLCJfZSIsIm5vcm1hbENvbXBsZXRpb24iLCJkaWRFcnIiLCJzdGVwIiwiX2UyIiwibWluTGVuIiwiX2FycmF5TGlrZVRvQXJyYXkiLCJ0b1N0cmluZyIsImZyb20iLCJhcnIiLCJsZW4iLCJhcnIyIiwiYXN5bmNHZW5lcmF0b3JTdGVwIiwiZ2VuIiwiX25leHQiLCJfdGhyb3ciLCJfYXN5bmNUb0dlbmVyYXRvciIsInNlcnZlckNvbmZpZyIsIl9jYWxsZWUiLCJhdWRpb01vZHVsZVVybCIsInBhZ2VTY3JpcHQiLCJyZXNwb25zZSIsImluamVjdFNjcmlwdCIsInNldHVwRXZlbnRCdXMiLCJhbm5vdGF0ZURPTSIsImFkZElkUHJvbXB0QW5jZXN0b3IiLCJhZGRJZFN1Ym1pdEJ1dHRvbiIsImFkZElkRm9vdGVyIiwiYWRkSWRBdWRpb0NvbnRyb2xzIiwiYWRkSWRBdWRpb091dHB1dEJ1dHRvbiIsImFkZFRhbGtCdXR0b24iLCJfY2FsbGVlJCIsIl9jb250ZXh0IiwiX2FkZFRhbGtCdXR0b24iLCJwYW5lbCIsImNsYXNzTmFtZXMiLCJfYWRkSWRBdWRpb091dHB1dEJ1dHQiLCJhdWRpb0J1dHRvbiIsInF1ZXJ5U2VsZWN0b3IiLCJfYWRkSWRBdWRpb0NvbnRyb2xzIiwiYXVkaW9FbGVtZW50cyIsImZvdW5kIiwiYXVkaW8iLCJuZXh0RGl2IiwibmV4dEVsZW1lbnRTaWJsaW5nIiwidGFnTmFtZSIsInRvTG93ZXJDYXNlIiwiX2FkZElkRm9vdGVyIiwicHJlY2VkaW5nRGl2IiwicHJldmlvdXNFbGVtZW50U2libGluZyIsImxhc3RFbGVtZW50Q2hpbGQiLCJfYWRkSWRTdWJtaXRCdXR0b24iLCJzdWJtaXRCdXR0b25zIiwibGFzdFN1Ym1pdEJ1dHRvbiIsIl9hZGRJZFByb21wdEFuY2VzdG9yIiwicGFyZW50IiwicGFyZW50RWxlbWVudCIsIl9hbm5vdGF0ZURPTSIsInByb21wdCIsImZvdW5kRm9vdGVyIiwiZm91bmRBdWRpb0NvbnRyb2xzIiwicHJvbXB0Q29udHJvbHNDb250YWluZXIiLCJmb3VuZFByb21wdEFuY2VzdG9yIiwiZm91bmRBdWRpb091dHB1dEJ1dHRvbiIsIl9zZXR1cEV2ZW50QnVzIiwiR01faW5mbyIsInNjcmlwdEhhbmRsZXIiLCJ1bnNhZmVXaW5kb3ciLCJfaW5qZWN0U2NyaXB0Iiwic2NyaXB0RWxlbWVudCIsImZldGNoIiwib2siLCJzdGF0dXNUZXh0IiwidDAiLCJhZGRlZE5vZGVzIiwibm9kZSIsIm5vZGVOYW1lIiwiaGFzQXR0cmlidXRlIiwiZGlzY29ubmVjdCIsInRleHRhcmVhcyIsImluaXRBdWRpb091dHB1dExpc3RlbmVyIiwiY2hlY2tGb3JSZXN0b3JlUG9pbnQiLCJjaGlsZExpc3QiLCJzdWJ0cmVlIl0sInNvdXJjZVJvb3QiOiIifQ==