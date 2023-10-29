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
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
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
/************************************************************************/
var __webpack_exports__ = {};
/*!****************************!*\
  !*** ./src/AudioModule.js ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
// import state machines for audio input and output
var _require = require("xstate"),
  interpret = _require.interpret;
var _require2 = require("./state-machines/AudioInputMachine"),
  audioInputMachine = _require2.audioInputMachine;
var _require3 = require("./state-machines/AudioOutputMachine"),
  audioOutputMachine = _require3.audioOutputMachine;
var _require4 = require("./LoggingModule"),
  logger = _require4.logger,
  serializeStateValue = _require4.serializeStateValue;

// depends on the injecting script (saypi.index.js) declaring the EventBus as a global variable
var EventBus = window.EventBus;

// audio output (Pi)
var audioElement = document.querySelector("audio");
if (!audioElement) {
  console.error("Audio element not found!");
} else {
  audioElement.preload = "auto"; // enable aggressive preloading of audio
}

var audioOutputActor = interpret(audioOutputMachine).onTransition(function (state) {
  if (state.changed) {
    var fromState = state.history ? serializeStateValue(state.history.value) : "N/A";
    var toState = serializeStateValue(state.value);
    logger.debug("Audio Output Machine transitioned from ".concat(fromState, " to ").concat(toState, " with ").concat(state.event.type));
  }
}).start();
function registerAudioPlaybackEvents(audio, actor) {
  var events = ["loadstart", "loadedmetadata", "canplaythrough", "play", "pause", "ended", "seeked", "emptied"];
  events.forEach(function (event) {
    audio.addEventListener(event, function () {
      return actor.send(event);
    });
  });
  audio.addEventListener("playing", function () {
    actor.send("play");
  });
}
registerAudioPlaybackEvents(audioElement, audioOutputActor);

// audio input (user)
var audioInputActor = interpret(audioInputMachine).onTransition(function (state) {
  if (state.changed) {
    var fromState = state.history ? serializeStateValue(state.history.value) : "N/A";
    var toState = serializeStateValue(state.value);
    logger.debug("Audio Input Machine transitioned from ".concat(fromState, " to ").concat(toState, " with ").concat(state.event.type));
  }
}).start();

/* These events are used to control/pass requests to the audio module from other modules */
function registerAudioCommands() {
  // audio input (recording) commands
  EventBus.on("audio:setupRecording", function (e) {
    audioInputActor.send("acquire");
  });
  EventBus.on("audio:tearDownRecording", function (e) {
    audioInputActor.send("release");
  });
  EventBus.on("audio:startRecording", function (e) {
    // Check if Pi is currently speaking and stop her audio
    audioOutputActor.send("pause");

    // Check if the MediaRecorder is acquired before starting?
    audioInputActor.send(["acquire", "start"]);
  });
  EventBus.on("audio:stopRecording", function (e) {
    audioInputActor.send("stopRequested");
    /* resume or cancel Pi's audio */
    /* TODO: reassess how to handle interruptions
    audioOutputActor.send("play"); // resume Pi's audio
    audioOutputActor.send("stop"); // cancel Pi's audio
    */
  });
  // audio input (recording) events (pass media recorder events -> audio input machine actor)
  EventBus.on("audio:dataavailable", function (detail) {
    audioInputActor.send(_objectSpread({
      type: "dataAvailable"
    }, detail));
  });
  EventBus.on("audio:input:stop", function (e) {
    audioInputActor.send("stop");
  });

  // audio output (playback) commands
  EventBus.on("audio:reload", function (e) {
    audioOutputActor.send("reload");
  });
}
registerAudioCommands();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0VBQ0EzQixRQUFRLENBQUM4QixFQUFFLENBQUMscUJBQXFCLEVBQUUsVUFBQ0UsTUFBTSxFQUFLO0lBQzdDSixlQUFlLENBQUNELElBQUksQ0FBQU0sYUFBQTtNQUFHZCxJQUFJLEVBQUU7SUFBZSxHQUFLYSxNQUFNLENBQUUsQ0FBQztFQUM1RCxDQUFDLENBQUM7RUFDRmhDLFFBQVEsQ0FBQzhCLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxVQUFVQyxDQUFDLEVBQUU7SUFDM0NILGVBQWUsQ0FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQztFQUM5QixDQUFDLENBQUM7O0VBRUY7RUFDQTNCLFFBQVEsQ0FBQzhCLEVBQUUsQ0FBQyxjQUFjLEVBQUUsVUFBVUMsQ0FBQyxFQUFFO0lBQ3ZDdkIsZ0JBQWdCLENBQUNtQixJQUFJLENBQUMsUUFBUSxDQUFDO0VBQ2pDLENBQUMsQ0FBQztBQUNKO0FBQ0FFLHFCQUFxQixDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL0F1ZGlvTW9kdWxlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSByZXF1aXJlIHNjb3BlXG52YXIgX193ZWJwYWNrX3JlcXVpcmVfXyA9IHt9O1xuXG4iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBpbXBvcnQgc3RhdGUgbWFjaGluZXMgZm9yIGF1ZGlvIGlucHV0IGFuZCBvdXRwdXRcbmNvbnN0IHsgaW50ZXJwcmV0IH0gPSByZXF1aXJlKFwieHN0YXRlXCIpO1xuY29uc3QgeyBhdWRpb0lucHV0TWFjaGluZSB9ID0gcmVxdWlyZShcIi4vc3RhdGUtbWFjaGluZXMvQXVkaW9JbnB1dE1hY2hpbmVcIik7XG5jb25zdCB7IGF1ZGlvT3V0cHV0TWFjaGluZSB9ID0gcmVxdWlyZShcIi4vc3RhdGUtbWFjaGluZXMvQXVkaW9PdXRwdXRNYWNoaW5lXCIpO1xuY29uc3QgeyBsb2dnZXIsIHNlcmlhbGl6ZVN0YXRlVmFsdWUgfSA9IHJlcXVpcmUoXCIuL0xvZ2dpbmdNb2R1bGVcIik7XG5cbi8vIGRlcGVuZHMgb24gdGhlIGluamVjdGluZyBzY3JpcHQgKHNheXBpLmluZGV4LmpzKSBkZWNsYXJpbmcgdGhlIEV2ZW50QnVzIGFzIGEgZ2xvYmFsIHZhcmlhYmxlXG5jb25zdCBFdmVudEJ1cyA9IHdpbmRvdy5FdmVudEJ1cztcblxuLy8gYXVkaW8gb3V0cHV0IChQaSlcbmNvbnN0IGF1ZGlvRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJhdWRpb1wiKTtcbmlmICghYXVkaW9FbGVtZW50KSB7XG4gIGNvbnNvbGUuZXJyb3IoXCJBdWRpbyBlbGVtZW50IG5vdCBmb3VuZCFcIik7XG59IGVsc2Uge1xuICBhdWRpb0VsZW1lbnQucHJlbG9hZCA9IFwiYXV0b1wiOyAvLyBlbmFibGUgYWdncmVzc2l2ZSBwcmVsb2FkaW5nIG9mIGF1ZGlvXG59XG5cbmNvbnN0IGF1ZGlvT3V0cHV0QWN0b3IgPSBpbnRlcnByZXQoYXVkaW9PdXRwdXRNYWNoaW5lKVxuICAub25UcmFuc2l0aW9uKChzdGF0ZSkgPT4ge1xuICAgIGlmIChzdGF0ZS5jaGFuZ2VkKSB7XG4gICAgICBjb25zdCBmcm9tU3RhdGUgPSBzdGF0ZS5oaXN0b3J5XG4gICAgICAgID8gc2VyaWFsaXplU3RhdGVWYWx1ZShzdGF0ZS5oaXN0b3J5LnZhbHVlKVxuICAgICAgICA6IFwiTi9BXCI7XG4gICAgICBjb25zdCB0b1N0YXRlID0gc2VyaWFsaXplU3RhdGVWYWx1ZShzdGF0ZS52YWx1ZSk7XG4gICAgICBsb2dnZXIuZGVidWcoXG4gICAgICAgIGBBdWRpbyBPdXRwdXQgTWFjaGluZSB0cmFuc2l0aW9uZWQgZnJvbSAke2Zyb21TdGF0ZX0gdG8gJHt0b1N0YXRlfSB3aXRoICR7c3RhdGUuZXZlbnQudHlwZX1gXG4gICAgICApO1xuICAgIH1cbiAgfSlcbiAgLnN0YXJ0KCk7XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyQXVkaW9QbGF5YmFja0V2ZW50cyhhdWRpbywgYWN0b3IpIHtcbiAgY29uc3QgZXZlbnRzID0gW1xuICAgIFwibG9hZHN0YXJ0XCIsXG4gICAgXCJsb2FkZWRtZXRhZGF0YVwiLFxuICAgIFwiY2FucGxheXRocm91Z2hcIixcbiAgICBcInBsYXlcIixcbiAgICBcInBhdXNlXCIsXG4gICAgXCJlbmRlZFwiLFxuICAgIFwic2Vla2VkXCIsXG4gICAgXCJlbXB0aWVkXCIsXG4gIF07XG5cbiAgZXZlbnRzLmZvckVhY2goKGV2ZW50KSA9PiB7XG4gICAgYXVkaW8uYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgKCkgPT4gYWN0b3Iuc2VuZChldmVudCkpO1xuICB9KTtcblxuICBhdWRpby5hZGRFdmVudExpc3RlbmVyKFwicGxheWluZ1wiLCAoKSA9PiB7XG4gICAgYWN0b3Iuc2VuZChcInBsYXlcIik7XG4gIH0pO1xufVxucmVnaXN0ZXJBdWRpb1BsYXliYWNrRXZlbnRzKGF1ZGlvRWxlbWVudCwgYXVkaW9PdXRwdXRBY3Rvcik7XG5cbi8vIGF1ZGlvIGlucHV0ICh1c2VyKVxuY29uc3QgYXVkaW9JbnB1dEFjdG9yID0gaW50ZXJwcmV0KGF1ZGlvSW5wdXRNYWNoaW5lKVxuICAub25UcmFuc2l0aW9uKChzdGF0ZSkgPT4ge1xuICAgIGlmIChzdGF0ZS5jaGFuZ2VkKSB7XG4gICAgICBjb25zdCBmcm9tU3RhdGUgPSBzdGF0ZS5oaXN0b3J5XG4gICAgICAgID8gc2VyaWFsaXplU3RhdGVWYWx1ZShzdGF0ZS5oaXN0b3J5LnZhbHVlKVxuICAgICAgICA6IFwiTi9BXCI7XG4gICAgICBjb25zdCB0b1N0YXRlID0gc2VyaWFsaXplU3RhdGVWYWx1ZShzdGF0ZS52YWx1ZSk7XG4gICAgICBsb2dnZXIuZGVidWcoXG4gICAgICAgIGBBdWRpbyBJbnB1dCBNYWNoaW5lIHRyYW5zaXRpb25lZCBmcm9tICR7ZnJvbVN0YXRlfSB0byAke3RvU3RhdGV9IHdpdGggJHtzdGF0ZS5ldmVudC50eXBlfWBcbiAgICAgICk7XG4gICAgfVxuICB9KVxuICAuc3RhcnQoKTtcblxuLyogVGhlc2UgZXZlbnRzIGFyZSB1c2VkIHRvIGNvbnRyb2wvcGFzcyByZXF1ZXN0cyB0byB0aGUgYXVkaW8gbW9kdWxlIGZyb20gb3RoZXIgbW9kdWxlcyAqL1xuZnVuY3Rpb24gcmVnaXN0ZXJBdWRpb0NvbW1hbmRzKCkge1xuICAvLyBhdWRpbyBpbnB1dCAocmVjb3JkaW5nKSBjb21tYW5kc1xuICBFdmVudEJ1cy5vbihcImF1ZGlvOnNldHVwUmVjb3JkaW5nXCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgYXVkaW9JbnB1dEFjdG9yLnNlbmQoXCJhY3F1aXJlXCIpO1xuICB9KTtcblxuICBFdmVudEJ1cy5vbihcImF1ZGlvOnRlYXJEb3duUmVjb3JkaW5nXCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgYXVkaW9JbnB1dEFjdG9yLnNlbmQoXCJyZWxlYXNlXCIpO1xuICB9KTtcblxuICBFdmVudEJ1cy5vbihcImF1ZGlvOnN0YXJ0UmVjb3JkaW5nXCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgLy8gQ2hlY2sgaWYgUGkgaXMgY3VycmVudGx5IHNwZWFraW5nIGFuZCBzdG9wIGhlciBhdWRpb1xuICAgIGF1ZGlvT3V0cHV0QWN0b3Iuc2VuZChcInBhdXNlXCIpO1xuXG4gICAgLy8gQ2hlY2sgaWYgdGhlIE1lZGlhUmVjb3JkZXIgaXMgYWNxdWlyZWQgYmVmb3JlIHN0YXJ0aW5nP1xuICAgIGF1ZGlvSW5wdXRBY3Rvci5zZW5kKFtcImFjcXVpcmVcIiwgXCJzdGFydFwiXSk7XG4gIH0pO1xuICBFdmVudEJ1cy5vbihcImF1ZGlvOnN0b3BSZWNvcmRpbmdcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICBhdWRpb0lucHV0QWN0b3Iuc2VuZChcInN0b3BSZXF1ZXN0ZWRcIik7XG4gICAgLyogcmVzdW1lIG9yIGNhbmNlbCBQaSdzIGF1ZGlvICovXG4gICAgLyogVE9ETzogcmVhc3Nlc3MgaG93IHRvIGhhbmRsZSBpbnRlcnJ1cHRpb25zXG4gICAgYXVkaW9PdXRwdXRBY3Rvci5zZW5kKFwicGxheVwiKTsgLy8gcmVzdW1lIFBpJ3MgYXVkaW9cbiAgICBhdWRpb091dHB1dEFjdG9yLnNlbmQoXCJzdG9wXCIpOyAvLyBjYW5jZWwgUGkncyBhdWRpb1xuICAgICovXG4gIH0pO1xuICAvLyBhdWRpbyBpbnB1dCAocmVjb3JkaW5nKSBldmVudHMgKHBhc3MgbWVkaWEgcmVjb3JkZXIgZXZlbnRzIC0+IGF1ZGlvIGlucHV0IG1hY2hpbmUgYWN0b3IpXG4gIEV2ZW50QnVzLm9uKFwiYXVkaW86ZGF0YWF2YWlsYWJsZVwiLCAoZGV0YWlsKSA9PiB7XG4gICAgYXVkaW9JbnB1dEFjdG9yLnNlbmQoeyB0eXBlOiBcImRhdGFBdmFpbGFibGVcIiwgLi4uZGV0YWlsIH0pO1xuICB9KTtcbiAgRXZlbnRCdXMub24oXCJhdWRpbzppbnB1dDpzdG9wXCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgYXVkaW9JbnB1dEFjdG9yLnNlbmQoXCJzdG9wXCIpO1xuICB9KTtcblxuICAvLyBhdWRpbyBvdXRwdXQgKHBsYXliYWNrKSBjb21tYW5kc1xuICBFdmVudEJ1cy5vbihcImF1ZGlvOnJlbG9hZFwiLCBmdW5jdGlvbiAoZSkge1xuICAgIGF1ZGlvT3V0cHV0QWN0b3Iuc2VuZChcInJlbG9hZFwiKTtcbiAgfSk7XG59XG5yZWdpc3RlckF1ZGlvQ29tbWFuZHMoKTtcbiJdLCJuYW1lcyI6WyJfcmVxdWlyZSIsInJlcXVpcmUiLCJpbnRlcnByZXQiLCJfcmVxdWlyZTIiLCJhdWRpb0lucHV0TWFjaGluZSIsIl9yZXF1aXJlMyIsImF1ZGlvT3V0cHV0TWFjaGluZSIsIl9yZXF1aXJlNCIsImxvZ2dlciIsInNlcmlhbGl6ZVN0YXRlVmFsdWUiLCJFdmVudEJ1cyIsIndpbmRvdyIsImF1ZGlvRWxlbWVudCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImNvbnNvbGUiLCJlcnJvciIsInByZWxvYWQiLCJhdWRpb091dHB1dEFjdG9yIiwib25UcmFuc2l0aW9uIiwic3RhdGUiLCJjaGFuZ2VkIiwiZnJvbVN0YXRlIiwiaGlzdG9yeSIsInZhbHVlIiwidG9TdGF0ZSIsImRlYnVnIiwiY29uY2F0IiwiZXZlbnQiLCJ0eXBlIiwic3RhcnQiLCJyZWdpc3RlckF1ZGlvUGxheWJhY2tFdmVudHMiLCJhdWRpbyIsImFjdG9yIiwiZXZlbnRzIiwiZm9yRWFjaCIsImFkZEV2ZW50TGlzdGVuZXIiLCJzZW5kIiwiYXVkaW9JbnB1dEFjdG9yIiwicmVnaXN0ZXJBdWRpb0NvbW1hbmRzIiwib24iLCJlIiwiZGV0YWlsIiwiX29iamVjdFNwcmVhZCJdLCJzb3VyY2VSb290IjoiIn0=