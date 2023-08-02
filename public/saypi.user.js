/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/transcriber.js":
/*!******************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/transcriber.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("var audioDataChunks = [];\nfunction uploadAudio(audioBlob) {\n  // Create a FormData object\n  var formData = new FormData();\n  var audioFilename = 'audio.webm';\n  if (audioBlob.type === 'audio/mp4') {\n    audioFilename = 'audio.mp4';\n  }\n  // Add the audio blob to the FormData object\n  formData.append('audio', audioBlob, audioFilename);\n  // Get the user's preferred language\n  var language = navigator.language;\n  // Post the audio to the server for transcription\n  fetch(config.apiServerUrl + '/transcribe?language=' + language, {\n    method: 'POST',\n    body: formData\n  }).then(function (response) {\n    if (!response.ok) {\n      throw Error(response.statusText);\n    }\n    return response.json();\n  }).then(handleTranscriptionResponse)[\"catch\"](function (error) {\n    console.error('Looks like there was a problem: ', error);\n    var textarea = document.getElementById('prompt');\n    textarea.value = 'Sorry, there was a problem transcribing your audio. Please try again later.';\n  });\n}\nfunction handleTranscriptionResponse(responseJson) {\n  var textarea = document.getElementById('prompt');\n  simulateTyping(textarea, responseJson.text + \" \");\n  console.log('Speaker: ' + responseJson.text);\n}\nfunction setNativeValue(element, value) {\n  var lastValue = element.value;\n  element.value = value;\n  var event = new Event(\"input\", {\n    target: element,\n    bubbles: true\n  });\n  // React 15\n  event.simulated = true;\n  // React 16-17\n  var tracker = element._valueTracker;\n  if (tracker) {\n    tracker.setValue(lastValue);\n  }\n  element.dispatchEvent(event);\n}\nfunction simulateFormSubmit(textarea) {\n  var enterEvent = new KeyboardEvent('keydown', {\n    bubbles: true,\n    key: 'Enter',\n    keyCode: 13,\n    which: 13\n  });\n  textarea.dispatchEvent(enterEvent);\n}\nfunction simulateTyping(element, text) {\n  var words = text.split(' '); // Split the text into words (may not be ideal for all languages)\n  var i = 0;\n  function typeWord() {\n    if (i < words.length) {\n      // Append the next word and a space, then increment i\n      setNativeValue(element, element.value + words[i++] + ' ');\n      // Call this function again before the next repaint\n      requestAnimationFrame(typeWord);\n    } else {\n      // Check if autosubmit is enabled\n      var talkButton = document.getElementById('talkButton');\n      if (talkButton.dataset.autosubmit === 'false') {\n        console.log('Autosubmit is disabled');\n      } else {\n        // Simulate an \"Enter\" keypress event\n        simulateFormSubmit(element);\n        console.log('Message autosubmitted');\n      }\n    }\n  }\n  // Start typing\n  typeWord();\n}\n\n// Declare a global variable for the mediaRecorder\nvar mediaRecorder;\nvar threshold = 1000; // 1000 ms = 1 second, about the length of \"Hey, Pi\"\n\n// This function will be called when the 'dataavailable' event fires\nfunction handleDataAvailable(e) {\n  // Add the audio data chunk to the array\n  audioDataChunks.push(e.data);\n}\n\n// This function will be called when the 'stop' event fires\nfunction handleStop() {\n  // Create a Blob from the audio data chunks\n  var audioBlob = new Blob(audioDataChunks, {\n    type: 'audio/webm'\n  });\n\n  // Get the stop time and calculate the duration\n  var stopTime = Date.now();\n  var duration = stopTime - window.startTime;\n\n  // If the duration is greater than the threshold, upload the audio for transcription\n  if (duration >= threshold) {\n    // Upload the audio to the server for transcription\n    uploadAudio(audioBlob);\n  }\n\n  // Clear the array for the next recording\n  audioDataChunks = [];\n}\nfunction setupRecording(callback) {\n  if (mediaRecorder) {\n    return;\n  }\n\n  // Get a stream from the user's microphone\n  navigator.mediaDevices.getUserMedia({\n    audio: true\n  }).then(function (stream) {\n    var audioMimeType = 'audio/webm;codecs=opus';\n    if (!MediaRecorder.isTypeSupported(audioMimeType)) {\n      // use MP4 for Safari\n      audioMimeType = 'audio/mp4';\n    }\n    // Create a new MediaRecorder object using the stream and specifying the MIME type\n    var options = {\n      mimeType: audioMimeType\n    };\n    mediaRecorder = new MediaRecorder(stream, options);\n\n    // Listen for the 'dataavailable' event\n    mediaRecorder.addEventListener('dataavailable', handleDataAvailable);\n\n    // Listen for the 'stop' event\n    mediaRecorder.addEventListener('stop', handleStop);\n  }).then(function () {\n    // Invoke the callback function\n    if (typeof callback === 'function') {\n      callback();\n    }\n  })[\"catch\"](function (err) {\n    console.error('Error getting audio stream: ' + err);\n  });\n}\nfunction tearDownRecording() {\n  // Check if the MediaRecorder is set up\n  if (!mediaRecorder) {\n    return;\n  }\n\n  // Stop any ongoing recording\n  if (mediaRecorder.state === 'recording') {\n    mediaRecorder.stop();\n  }\n\n  // Remove the MediaRecorder's event listeners\n  mediaRecorder.removeEventListener('dataavailable', handleDataAvailable);\n  mediaRecorder.removeEventListener('stop', handleStop);\n\n  // Clear the MediaRecorder variable\n  mediaRecorder = null;\n}\n\n// This function will be called when the user presses the record button\nfunction startRecording() {\n  // Check if the MediaRecorder is set up\n  if (!mediaRecorder) {\n    setupRecording(startRecording);\n    return;\n  }\n\n  // Start recording\n  mediaRecorder.start();\n\n  // Record the start time\n  window.startTime = Date.now();\n  console.log('Recording started');\n\n  // This function will be called when the user releases the record button\n  window.stopRecording = function () {\n    if (mediaRecorder && mediaRecorder.state === 'recording') {\n      // Stop recording\n      mediaRecorder.stop();\n\n      // Record the stop time and calculate the duration\n      var stopTime = Date.now();\n      var duration = stopTime - window.startTime;\n\n      // If the duration is less than the threshold, don't upload the audio for transcription\n      if (duration < threshold) {\n        console.log('Recording was too short, not uploading for transcription');\n      } else {\n        console.log('Recording stopped');\n      }\n    }\n    // Remove the stopRecording function\n    delete window.stopRecording;\n  };\n}\n\n// Add the startRecording function to the window object so it can be called from outside this script\nwindow.startRecording = startRecording;");

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
/******/ 			// no module.id needed
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
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!****************************!*\
  !*** ./src/saypi.index.js ***!
  \****************************/
// ==UserScript==
// @name         Say, Pi
// @namespace    http://www.saypi.ai/
// @version      1.1.3
// @description  Speak to Pi with OpenAI's Whisper
// @author       Ross Cadogan
// @match        https://pi.ai/talk
// @grant        GM_xmlhttpRequest
// @updateURL    https://app.saypi.ai/saypi.user.js
// @downloadURL  https://app.saypi.ai/saypi.user.js
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  var localConfig = {
    appServerUrl: "http://localhost:3000",
    apiServerUrl: "http://localhost:5000"
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
          if (node.nodeName.toLowerCase() === 'div' && node.classList.contains('fixed') && node.classList.contains('bottom-16')) {
            var footer = node;
            var buttonContainer = footer.querySelector('.relative.flex.flex-col');
            if (buttonContainer) {
              addTalkButton(buttonContainer);
            } else {
              console.log('No button container found in footer');
            }
            observer.disconnect();
            return;
          }
        }
      }
    }
  });
  function injectScript(callback) {
    return injectScriptLocal(callback);
  }
  function injectScriptRemote(callback) {
    // Get the URL of the remote script
    var remoteScriptUrl = config.appServerUrl + 'transcriber.js';
    GM_xmlhttpRequest({
      method: "GET",
      url: remoteScriptUrl,
      onload: function onload(response) {
        var scriptElement = document.createElement("script");
        scriptElement.type = "text/javascript";
        scriptElement.id = 'saypi-script';
        var configText = 'var config = ' + JSON.stringify(config) + ';';
        scriptElement.textContent = configText + response.responseText;
        document.body.appendChild(scriptElement);

        // Call the callback function after the script is added
        if (callback) {
          callback();
        }
      }
    });
  }
  function injectScriptLocal(callback) {
    var scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    scriptElement.id = 'saypi-script';
    var configText = 'var config = ' + JSON.stringify(config) + ';';
    scriptElement.textContent = configText + pageScript;
    document.body.appendChild(scriptElement);

    // Call the callback function after the script is added
    if (callback) {
      callback();
    }
  }
  function addTalkButton(container) {
    var button = document.createElement('button');
    button.id = 'talkButton';
    button.type = 'button';
    button.className = 'relative flex mt-1 mb-1 rounded-full px-2 py-3 text-center bg-cream-550 hover:bg-cream-650 hover:text-brand-green-700 text-muted';
    // Set ARIA label and tooltip
    var label = 'Talk (Hold Control + Space to use hotkey. Double click to toggle auto-submit on/off)';
    button.setAttribute('aria-label', label);
    button.setAttribute('title', label);
    // enable autosubmit by default
    button.dataset.autosubmit = 'true';
    button.classList.add('autoSubmit');
    container.appendChild(button);
    addTalkButtonStyles();
    addTalkIcon(button);

    // Call the function to inject the script after the button has been added
    injectScript(registerAudioButtonEvents);
  }
  function addTalkIcon(button) {
    var iconHtml = "\n        <svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.0\" viewBox=\"0 0 56.25 30\" class=\"waveform\">\n        <defs>\n            <clipPath id=\"a\">\n                <path d=\"M.54 12H3v5H.54Zm0 0\"/>\n            </clipPath>\n            <clipPath id=\"b\">\n                <path d=\"M25 2.2h2v24.68h-2Zm0 0\"/>\n            </clipPath>\n            <clipPath id=\"c\">\n                <path d=\"M53 12h1.98v5H53Zm0 0\"/>\n            </clipPath>\n        </defs>\n        <g clip-path=\"url(#a)\">\n            <path d=\"M1.48 12.71c-.5 0-.9.4-.9.9v1.85a.9.9 0 0 0 1.8 0v-1.84c0-.5-.4-.9-.9-.9Zm0 0\"/>\n        </g>\n        <path d=\"M4.98 6.63c-.5 0-.9.4-.9.9v14.01a.9.9 0 0 0 1.81 0v-14c0-.5-.4-.92-.9-.92Zm3.51 3.1a.9.9 0 0 0-.9.91v7.79a.9.9 0 0 0 1.8 0v-7.79c0-.5-.4-.9-.9-.9ZM12 3.83a.9.9 0 0 0-.91.9v19.6a.9.9 0 0 0 1.8 0V4.74c0-.5-.4-.9-.9-.9Zm3.5 8.29a.9.9 0 0 0-.91.9v3.03a.9.9 0 0 0 1.81 0v-3.03c0-.5-.4-.9-.9-.9ZM19 6.8c-.5 0-.9.4-.9.9v13.68a.9.9 0 0 0 1.8 0V7.7c0-.5-.4-.9-.9-.9Zm3.58-2.97h-.01c-.5 0-.9.4-.9.9l-.13 19.6c0 .5.4.9.9.91.5 0 .9-.4.9-.9l.14-19.6a.9.9 0 0 0-.9-.9Zm0 0\"/>\n        <g clip-path=\"url(#b)\">\n            <path d=\"M26 2.2c-.5 0-.9.4-.9.9v22.86a.9.9 0 1 0 1.81 0V3.11a.9.9 0 0 0-.9-.91Zm0 0\"/>\n        </g>\n        <path d=\"M29.52 7.71a.9.9 0 0 0-.91.9v11.85a.9.9 0 0 0 1.81 0V8.62c0-.5-.4-.9-.9-.9Zm3.5 2.93a.9.9 0 0 0-.9.91v5.97a.9.9 0 0 0 1.8 0v-5.97c0-.5-.4-.9-.9-.9Zm3.5-5.78c-.5 0-.9.4-.9.9v17.55a.9.9 0 0 0 1.81 0V5.76c0-.5-.4-.9-.9-.9Zm3.51 3.34c-.5 0-.9.4-.9.9v10.87a.9.9 0 0 0 1.8 0V9.1a.9.9 0 0 0-.9-.91Zm3.5 3.08c-.5 0-.9.4-.9.91v4.7a.9.9 0 1 0 1.8 0v-4.7a.9.9 0 0 0-.9-.9Zm3.51-7.45a.9.9 0 0 0-.91.9v19.6a.9.9 0 0 0 1.81 0V4.74c0-.5-.4-.9-.9-.9Zm3.5 5.57a.9.9 0 0 0-.9.91v8.45a.9.9 0 0 0 1.8 0v-8.45c0-.5-.4-.9-.9-.9Zm0 0\"/>\n        <g clip-path=\"url(#c)\">\n            <path d=\"M54.04 12.96a.9.9 0 0 0-.9.91v1.33a.9.9 0 1 0 1.8 0v-1.32a.9.9 0 0 0-.9-.92Zm0 0\"/>\n        </g>\n    </svg>\n    \n        ";
    var icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    button.appendChild(icon);
    icon.outerHTML = iconHtml;
  }
  function addStyles(css) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }
  function addTalkButtonStyles() {
    // Get the button and register for mousedown and mouseup events
    var button = document.getElementById('talkButton');
    // button animation
    addStyles("\n            @keyframes pulse {\n                0% {\n                    transform: scale(1);\n                }\n                50% {\n                    transform: scale(0.9);\n                }\n                100% {\n                    transform: scale(1);\n                }\n            }\n            #talkButton {\n                margin-top: 0.25rem;\n                border-radius: 18px;\n                width: 120px;\n                display: block; /* For Safari */\n            }\n\n            #talkButton:active .waveform, #talkButton.active .waveform {\n                animation: pulse 1s infinite;\n            }\n            #talkButton .waveform {\n                fill: #776d6d;\n            }\n            #talkButton.autoSubmit .waveform {\n                fill: rgb(65 138 47); /* Pi's text-brand-green-600 */\n            }\n        ");
  }
  function registerAudioButtonEvents() {
    var button = document.getElementById('talkButton');
    button.addEventListener('mousedown', function () {
      idPromptTextArea();
      unsafeWindow.startRecording();
    });
    button.addEventListener('mouseup', function () {
      unsafeWindow.stopRecording();
    });
    registerHotkey();

    // "warm up" the microphone by acquiring it before the user presses the button
    document.getElementById('talkButton').addEventListener('mouseenter', setupRecording);
    document.getElementById('talkButton').addEventListener('mouseleave', tearDownRecording);
    window.addEventListener('beforeunload', tearDownRecording);

    // Attach a double click event listener to the talk button
    button.addEventListener('dblclick', function () {
      // Toggle the CSS classes to indicate the mode
      button.classList.toggle('autoSubmit');

      // Store the state on the button element using a custom data attribute
      if (button.getAttribute('data-autosubmit') === 'true') {
        button.setAttribute('data-autosubmit', 'false');
        console.log('autosubmit disabled');
      } else {
        button.setAttribute('data-autosubmit', 'true');
        console.log('autosubmit enabled');
      }
    });
  }
  function registerHotkey() {
    // Register a hotkey for the button
    var ctrlDown = false;
    document.addEventListener('keydown', function (event) {
      if (event.ctrlKey && event.code === 'Space' && !ctrlDown) {
        ctrlDown = true;
        // Simulate mousedown event
        var mouseDownEvent = new Event('mousedown');
        document.getElementById('talkButton').dispatchEvent(mouseDownEvent);
        talkButton.classList.add('active'); // Add the active class
      }
    });

    document.addEventListener('keyup', function (event) {
      if (ctrlDown && event.code === 'Space') {
        ctrlDown = false;
        // Simulate mouseup event
        var mouseUpEvent = new Event('mouseup');
        document.getElementById('talkButton').dispatchEvent(mouseUpEvent);
        talkButton.classList.remove('active');
      }
    });
  }
  function idPromptTextArea() {
    var textarea = document.getElementById('prompt');
    if (!textarea) {
      // Find the first <textarea> element and give it an id
      var textareaElement = document.querySelector('textarea');
      if (textareaElement) {
        textareaElement.id = 'prompt';
      } else {
        console.log('No <textarea> element found');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0VBQ047RUFHQSxTQUFTbkIsZ0JBQWdCQSxDQUFBLEVBQUc7SUFDeEIsSUFBSW9CLFFBQVEsR0FBR3JELFFBQVEsQ0FBQytCLGNBQWMsQ0FBQyxRQUFRLENBQUM7SUFDaEQsSUFBSSxDQUFDc0IsUUFBUSxFQUFFO01BQ1g7TUFDQSxJQUFJQyxlQUFlLEdBQUd0RCxRQUFRLENBQUNoQixhQUFhLENBQUMsVUFBVSxDQUFDO01BQ3hELElBQUlzRSxlQUFlLEVBQUU7UUFDakJBLGVBQWUsQ0FBQ25ELEVBQUUsR0FBRyxRQUFRO01BQ2pDLENBQUMsTUFBTTtRQUNIakIsT0FBTyxDQUFDQyxHQUFHLENBQUMsNkJBQTZCLENBQUM7TUFDOUM7SUFDSjtFQUNKOztFQUVBO0VBQ0FsQixRQUFRLENBQUNzRixPQUFPLENBQUN2RCxRQUFRLEVBQUU7SUFBRXdELFNBQVMsRUFBRSxJQUFJO0lBQUVDLE9BQU8sRUFBRTtFQUFLLENBQUMsQ0FBQztBQUNsRSxDQUFDLEVBQUUsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy90cmFuc2NyaWJlci5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9zYXlwaS5pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBcInZhciBhdWRpb0RhdGFDaHVua3MgPSBbXTtcXG5mdW5jdGlvbiB1cGxvYWRBdWRpbyhhdWRpb0Jsb2IpIHtcXG4gIC8vIENyZWF0ZSBhIEZvcm1EYXRhIG9iamVjdFxcbiAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XFxuICB2YXIgYXVkaW9GaWxlbmFtZSA9ICdhdWRpby53ZWJtJztcXG4gIGlmIChhdWRpb0Jsb2IudHlwZSA9PT0gJ2F1ZGlvL21wNCcpIHtcXG4gICAgYXVkaW9GaWxlbmFtZSA9ICdhdWRpby5tcDQnO1xcbiAgfVxcbiAgLy8gQWRkIHRoZSBhdWRpbyBibG9iIHRvIHRoZSBGb3JtRGF0YSBvYmplY3RcXG4gIGZvcm1EYXRhLmFwcGVuZCgnYXVkaW8nLCBhdWRpb0Jsb2IsIGF1ZGlvRmlsZW5hbWUpO1xcbiAgLy8gR2V0IHRoZSB1c2VyJ3MgcHJlZmVycmVkIGxhbmd1YWdlXFxuICB2YXIgbGFuZ3VhZ2UgPSBuYXZpZ2F0b3IubGFuZ3VhZ2U7XFxuICAvLyBQb3N0IHRoZSBhdWRpbyB0byB0aGUgc2VydmVyIGZvciB0cmFuc2NyaXB0aW9uXFxuICBmZXRjaChjb25maWcuYXBpU2VydmVyVXJsICsgJy90cmFuc2NyaWJlP2xhbmd1YWdlPScgKyBsYW5ndWFnZSwge1xcbiAgICBtZXRob2Q6ICdQT1NUJyxcXG4gICAgYm9keTogZm9ybURhdGFcXG4gIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XFxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcXG4gICAgICB0aHJvdyBFcnJvcihyZXNwb25zZS5zdGF0dXNUZXh0KTtcXG4gICAgfVxcbiAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xcbiAgfSkudGhlbihoYW5kbGVUcmFuc2NyaXB0aW9uUmVzcG9uc2UpW1xcXCJjYXRjaFxcXCJdKGZ1bmN0aW9uIChlcnJvcikge1xcbiAgICBjb25zb2xlLmVycm9yKCdMb29rcyBsaWtlIHRoZXJlIHdhcyBhIHByb2JsZW06ICcsIGVycm9yKTtcXG4gICAgdmFyIHRleHRhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb21wdCcpO1xcbiAgICB0ZXh0YXJlYS52YWx1ZSA9ICdTb3JyeSwgdGhlcmUgd2FzIGEgcHJvYmxlbSB0cmFuc2NyaWJpbmcgeW91ciBhdWRpby4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlci4nO1xcbiAgfSk7XFxufVxcbmZ1bmN0aW9uIGhhbmRsZVRyYW5zY3JpcHRpb25SZXNwb25zZShyZXNwb25zZUpzb24pIHtcXG4gIHZhciB0ZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9tcHQnKTtcXG4gIHNpbXVsYXRlVHlwaW5nKHRleHRhcmVhLCByZXNwb25zZUpzb24udGV4dCArIFxcXCIgXFxcIik7XFxuICBjb25zb2xlLmxvZygnU3BlYWtlcjogJyArIHJlc3BvbnNlSnNvbi50ZXh0KTtcXG59XFxuZnVuY3Rpb24gc2V0TmF0aXZlVmFsdWUoZWxlbWVudCwgdmFsdWUpIHtcXG4gIHZhciBsYXN0VmFsdWUgPSBlbGVtZW50LnZhbHVlO1xcbiAgZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xcbiAgdmFyIGV2ZW50ID0gbmV3IEV2ZW50KFxcXCJpbnB1dFxcXCIsIHtcXG4gICAgdGFyZ2V0OiBlbGVtZW50LFxcbiAgICBidWJibGVzOiB0cnVlXFxuICB9KTtcXG4gIC8vIFJlYWN0IDE1XFxuICBldmVudC5zaW11bGF0ZWQgPSB0cnVlO1xcbiAgLy8gUmVhY3QgMTYtMTdcXG4gIHZhciB0cmFja2VyID0gZWxlbWVudC5fdmFsdWVUcmFja2VyO1xcbiAgaWYgKHRyYWNrZXIpIHtcXG4gICAgdHJhY2tlci5zZXRWYWx1ZShsYXN0VmFsdWUpO1xcbiAgfVxcbiAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcXG59XFxuZnVuY3Rpb24gc2ltdWxhdGVGb3JtU3VibWl0KHRleHRhcmVhKSB7XFxuICB2YXIgZW50ZXJFdmVudCA9IG5ldyBLZXlib2FyZEV2ZW50KCdrZXlkb3duJywge1xcbiAgICBidWJibGVzOiB0cnVlLFxcbiAgICBrZXk6ICdFbnRlcicsXFxuICAgIGtleUNvZGU6IDEzLFxcbiAgICB3aGljaDogMTNcXG4gIH0pO1xcbiAgdGV4dGFyZWEuZGlzcGF0Y2hFdmVudChlbnRlckV2ZW50KTtcXG59XFxuZnVuY3Rpb24gc2ltdWxhdGVUeXBpbmcoZWxlbWVudCwgdGV4dCkge1xcbiAgdmFyIHdvcmRzID0gdGV4dC5zcGxpdCgnICcpOyAvLyBTcGxpdCB0aGUgdGV4dCBpbnRvIHdvcmRzIChtYXkgbm90IGJlIGlkZWFsIGZvciBhbGwgbGFuZ3VhZ2VzKVxcbiAgdmFyIGkgPSAwO1xcbiAgZnVuY3Rpb24gdHlwZVdvcmQoKSB7XFxuICAgIGlmIChpIDwgd29yZHMubGVuZ3RoKSB7XFxuICAgICAgLy8gQXBwZW5kIHRoZSBuZXh0IHdvcmQgYW5kIGEgc3BhY2UsIHRoZW4gaW5jcmVtZW50IGlcXG4gICAgICBzZXROYXRpdmVWYWx1ZShlbGVtZW50LCBlbGVtZW50LnZhbHVlICsgd29yZHNbaSsrXSArICcgJyk7XFxuICAgICAgLy8gQ2FsbCB0aGlzIGZ1bmN0aW9uIGFnYWluIGJlZm9yZSB0aGUgbmV4dCByZXBhaW50XFxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHR5cGVXb3JkKTtcXG4gICAgfSBlbHNlIHtcXG4gICAgICAvLyBDaGVjayBpZiBhdXRvc3VibWl0IGlzIGVuYWJsZWRcXG4gICAgICB2YXIgdGFsa0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWxrQnV0dG9uJyk7XFxuICAgICAgaWYgKHRhbGtCdXR0b24uZGF0YXNldC5hdXRvc3VibWl0ID09PSAnZmFsc2UnKSB7XFxuICAgICAgICBjb25zb2xlLmxvZygnQXV0b3N1Ym1pdCBpcyBkaXNhYmxlZCcpO1xcbiAgICAgIH0gZWxzZSB7XFxuICAgICAgICAvLyBTaW11bGF0ZSBhbiBcXFwiRW50ZXJcXFwiIGtleXByZXNzIGV2ZW50XFxuICAgICAgICBzaW11bGF0ZUZvcm1TdWJtaXQoZWxlbWVudCk7XFxuICAgICAgICBjb25zb2xlLmxvZygnTWVzc2FnZSBhdXRvc3VibWl0dGVkJyk7XFxuICAgICAgfVxcbiAgICB9XFxuICB9XFxuICAvLyBTdGFydCB0eXBpbmdcXG4gIHR5cGVXb3JkKCk7XFxufVxcblxcbi8vIERlY2xhcmUgYSBnbG9iYWwgdmFyaWFibGUgZm9yIHRoZSBtZWRpYVJlY29yZGVyXFxudmFyIG1lZGlhUmVjb3JkZXI7XFxudmFyIHRocmVzaG9sZCA9IDEwMDA7IC8vIDEwMDAgbXMgPSAxIHNlY29uZCwgYWJvdXQgdGhlIGxlbmd0aCBvZiBcXFwiSGV5LCBQaVxcXCJcXG5cXG4vLyBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlICdkYXRhYXZhaWxhYmxlJyBldmVudCBmaXJlc1xcbmZ1bmN0aW9uIGhhbmRsZURhdGFBdmFpbGFibGUoZSkge1xcbiAgLy8gQWRkIHRoZSBhdWRpbyBkYXRhIGNodW5rIHRvIHRoZSBhcnJheVxcbiAgYXVkaW9EYXRhQ2h1bmtzLnB1c2goZS5kYXRhKTtcXG59XFxuXFxuLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSAnc3RvcCcgZXZlbnQgZmlyZXNcXG5mdW5jdGlvbiBoYW5kbGVTdG9wKCkge1xcbiAgLy8gQ3JlYXRlIGEgQmxvYiBmcm9tIHRoZSBhdWRpbyBkYXRhIGNodW5rc1xcbiAgdmFyIGF1ZGlvQmxvYiA9IG5ldyBCbG9iKGF1ZGlvRGF0YUNodW5rcywge1xcbiAgICB0eXBlOiAnYXVkaW8vd2VibSdcXG4gIH0pO1xcblxcbiAgLy8gR2V0IHRoZSBzdG9wIHRpbWUgYW5kIGNhbGN1bGF0ZSB0aGUgZHVyYXRpb25cXG4gIHZhciBzdG9wVGltZSA9IERhdGUubm93KCk7XFxuICB2YXIgZHVyYXRpb24gPSBzdG9wVGltZSAtIHdpbmRvdy5zdGFydFRpbWU7XFxuXFxuICAvLyBJZiB0aGUgZHVyYXRpb24gaXMgZ3JlYXRlciB0aGFuIHRoZSB0aHJlc2hvbGQsIHVwbG9hZCB0aGUgYXVkaW8gZm9yIHRyYW5zY3JpcHRpb25cXG4gIGlmIChkdXJhdGlvbiA+PSB0aHJlc2hvbGQpIHtcXG4gICAgLy8gVXBsb2FkIHRoZSBhdWRpbyB0byB0aGUgc2VydmVyIGZvciB0cmFuc2NyaXB0aW9uXFxuICAgIHVwbG9hZEF1ZGlvKGF1ZGlvQmxvYik7XFxuICB9XFxuXFxuICAvLyBDbGVhciB0aGUgYXJyYXkgZm9yIHRoZSBuZXh0IHJlY29yZGluZ1xcbiAgYXVkaW9EYXRhQ2h1bmtzID0gW107XFxufVxcbmZ1bmN0aW9uIHNldHVwUmVjb3JkaW5nKGNhbGxiYWNrKSB7XFxuICBpZiAobWVkaWFSZWNvcmRlcikge1xcbiAgICByZXR1cm47XFxuICB9XFxuXFxuICAvLyBHZXQgYSBzdHJlYW0gZnJvbSB0aGUgdXNlcidzIG1pY3JvcGhvbmVcXG4gIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKHtcXG4gICAgYXVkaW86IHRydWVcXG4gIH0pLnRoZW4oZnVuY3Rpb24gKHN0cmVhbSkge1xcbiAgICB2YXIgYXVkaW9NaW1lVHlwZSA9ICdhdWRpby93ZWJtO2NvZGVjcz1vcHVzJztcXG4gICAgaWYgKCFNZWRpYVJlY29yZGVyLmlzVHlwZVN1cHBvcnRlZChhdWRpb01pbWVUeXBlKSkge1xcbiAgICAgIC8vIHVzZSBNUDQgZm9yIFNhZmFyaVxcbiAgICAgIGF1ZGlvTWltZVR5cGUgPSAnYXVkaW8vbXA0JztcXG4gICAgfVxcbiAgICAvLyBDcmVhdGUgYSBuZXcgTWVkaWFSZWNvcmRlciBvYmplY3QgdXNpbmcgdGhlIHN0cmVhbSBhbmQgc3BlY2lmeWluZyB0aGUgTUlNRSB0eXBlXFxuICAgIHZhciBvcHRpb25zID0ge1xcbiAgICAgIG1pbWVUeXBlOiBhdWRpb01pbWVUeXBlXFxuICAgIH07XFxuICAgIG1lZGlhUmVjb3JkZXIgPSBuZXcgTWVkaWFSZWNvcmRlcihzdHJlYW0sIG9wdGlvbnMpO1xcblxcbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSAnZGF0YWF2YWlsYWJsZScgZXZlbnRcXG4gICAgbWVkaWFSZWNvcmRlci5hZGRFdmVudExpc3RlbmVyKCdkYXRhYXZhaWxhYmxlJywgaGFuZGxlRGF0YUF2YWlsYWJsZSk7XFxuXFxuICAgIC8vIExpc3RlbiBmb3IgdGhlICdzdG9wJyBldmVudFxcbiAgICBtZWRpYVJlY29yZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ3N0b3AnLCBoYW5kbGVTdG9wKTtcXG4gIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xcbiAgICAvLyBJbnZva2UgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uXFxuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcXG4gICAgICBjYWxsYmFjaygpO1xcbiAgICB9XFxuICB9KVtcXFwiY2F0Y2hcXFwiXShmdW5jdGlvbiAoZXJyKSB7XFxuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGdldHRpbmcgYXVkaW8gc3RyZWFtOiAnICsgZXJyKTtcXG4gIH0pO1xcbn1cXG5mdW5jdGlvbiB0ZWFyRG93blJlY29yZGluZygpIHtcXG4gIC8vIENoZWNrIGlmIHRoZSBNZWRpYVJlY29yZGVyIGlzIHNldCB1cFxcbiAgaWYgKCFtZWRpYVJlY29yZGVyKSB7XFxuICAgIHJldHVybjtcXG4gIH1cXG5cXG4gIC8vIFN0b3AgYW55IG9uZ29pbmcgcmVjb3JkaW5nXFxuICBpZiAobWVkaWFSZWNvcmRlci5zdGF0ZSA9PT0gJ3JlY29yZGluZycpIHtcXG4gICAgbWVkaWFSZWNvcmRlci5zdG9wKCk7XFxuICB9XFxuXFxuICAvLyBSZW1vdmUgdGhlIE1lZGlhUmVjb3JkZXIncyBldmVudCBsaXN0ZW5lcnNcXG4gIG1lZGlhUmVjb3JkZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignZGF0YWF2YWlsYWJsZScsIGhhbmRsZURhdGFBdmFpbGFibGUpO1xcbiAgbWVkaWFSZWNvcmRlci5yZW1vdmVFdmVudExpc3RlbmVyKCdzdG9wJywgaGFuZGxlU3RvcCk7XFxuXFxuICAvLyBDbGVhciB0aGUgTWVkaWFSZWNvcmRlciB2YXJpYWJsZVxcbiAgbWVkaWFSZWNvcmRlciA9IG51bGw7XFxufVxcblxcbi8vIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgdXNlciBwcmVzc2VzIHRoZSByZWNvcmQgYnV0dG9uXFxuZnVuY3Rpb24gc3RhcnRSZWNvcmRpbmcoKSB7XFxuICAvLyBDaGVjayBpZiB0aGUgTWVkaWFSZWNvcmRlciBpcyBzZXQgdXBcXG4gIGlmICghbWVkaWFSZWNvcmRlcikge1xcbiAgICBzZXR1cFJlY29yZGluZyhzdGFydFJlY29yZGluZyk7XFxuICAgIHJldHVybjtcXG4gIH1cXG5cXG4gIC8vIFN0YXJ0IHJlY29yZGluZ1xcbiAgbWVkaWFSZWNvcmRlci5zdGFydCgpO1xcblxcbiAgLy8gUmVjb3JkIHRoZSBzdGFydCB0aW1lXFxuICB3aW5kb3cuc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcXG4gIGNvbnNvbGUubG9nKCdSZWNvcmRpbmcgc3RhcnRlZCcpO1xcblxcbiAgLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSB1c2VyIHJlbGVhc2VzIHRoZSByZWNvcmQgYnV0dG9uXFxuICB3aW5kb3cuc3RvcFJlY29yZGluZyA9IGZ1bmN0aW9uICgpIHtcXG4gICAgaWYgKG1lZGlhUmVjb3JkZXIgJiYgbWVkaWFSZWNvcmRlci5zdGF0ZSA9PT0gJ3JlY29yZGluZycpIHtcXG4gICAgICAvLyBTdG9wIHJlY29yZGluZ1xcbiAgICAgIG1lZGlhUmVjb3JkZXIuc3RvcCgpO1xcblxcbiAgICAgIC8vIFJlY29yZCB0aGUgc3RvcCB0aW1lIGFuZCBjYWxjdWxhdGUgdGhlIGR1cmF0aW9uXFxuICAgICAgdmFyIHN0b3BUaW1lID0gRGF0ZS5ub3coKTtcXG4gICAgICB2YXIgZHVyYXRpb24gPSBzdG9wVGltZSAtIHdpbmRvdy5zdGFydFRpbWU7XFxuXFxuICAgICAgLy8gSWYgdGhlIGR1cmF0aW9uIGlzIGxlc3MgdGhhbiB0aGUgdGhyZXNob2xkLCBkb24ndCB1cGxvYWQgdGhlIGF1ZGlvIGZvciB0cmFuc2NyaXB0aW9uXFxuICAgICAgaWYgKGR1cmF0aW9uIDwgdGhyZXNob2xkKSB7XFxuICAgICAgICBjb25zb2xlLmxvZygnUmVjb3JkaW5nIHdhcyB0b28gc2hvcnQsIG5vdCB1cGxvYWRpbmcgZm9yIHRyYW5zY3JpcHRpb24nKTtcXG4gICAgICB9IGVsc2Uge1xcbiAgICAgICAgY29uc29sZS5sb2coJ1JlY29yZGluZyBzdG9wcGVkJyk7XFxuICAgICAgfVxcbiAgICB9XFxuICAgIC8vIFJlbW92ZSB0aGUgc3RvcFJlY29yZGluZyBmdW5jdGlvblxcbiAgICBkZWxldGUgd2luZG93LnN0b3BSZWNvcmRpbmc7XFxuICB9O1xcbn1cXG5cXG4vLyBBZGQgdGhlIHN0YXJ0UmVjb3JkaW5nIGZ1bmN0aW9uIHRvIHRoZSB3aW5kb3cgb2JqZWN0IHNvIGl0IGNhbiBiZSBjYWxsZWQgZnJvbSBvdXRzaWRlIHRoaXMgc2NyaXB0XFxud2luZG93LnN0YXJ0UmVjb3JkaW5nID0gc3RhcnRSZWNvcmRpbmc7XCI7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyA9PVVzZXJTY3JpcHQ9PVxuLy8gQG5hbWUgICAgICAgICBTYXksIFBpXG4vLyBAbmFtZXNwYWNlICAgIGh0dHA6Ly93d3cuc2F5cGkuYWkvXG4vLyBAdmVyc2lvbiAgICAgIDEuMS4zXG4vLyBAZGVzY3JpcHRpb24gIFNwZWFrIHRvIFBpIHdpdGggT3BlbkFJJ3MgV2hpc3BlclxuLy8gQGF1dGhvciAgICAgICBSb3NzIENhZG9nYW5cbi8vIEBtYXRjaCAgICAgICAgaHR0cHM6Ly9waS5haS90YWxrXG4vLyBAZ3JhbnQgICAgICAgIEdNX3htbGh0dHBSZXF1ZXN0XG4vLyBAdXBkYXRlVVJMICAgIGh0dHBzOi8vYXBwLnNheXBpLmFpL3NheXBpLnVzZXIuanNcbi8vIEBkb3dubG9hZFVSTCAgaHR0cHM6Ly9hcHAuc2F5cGkuYWkvc2F5cGkudXNlci5qc1xuLy8gQGxpY2Vuc2UgICAgICBNSVRcbi8vID09L1VzZXJTY3JpcHQ9PVxuXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGNvbnN0IGxvY2FsQ29uZmlnID0ge1xuICAgICAgICBhcHBTZXJ2ZXJVcmw6IFwiaHR0cDovL2xvY2FsaG9zdDozMDAwXCIsXG4gICAgICAgIGFwaVNlcnZlclVybDogXCJodHRwOi8vbG9jYWxob3N0OjUwMDBcIixcbiAgICAgICAgLy8gQWRkIG90aGVyIGNvbmZpZ3VyYXRpb24gcHJvcGVydGllcyBhcyBuZWVkZWRcbiAgICB9O1xuXG4gICAgLy8gRGVmaW5lIGEgZ2xvYmFsIGNvbmZpZ3VyYXRpb24gcHJvcGVydHlcbiAgICBjb25zdCBwcm9kdWN0aW9uQ29uZmlnID0ge1xuICAgICAgICBhcHBTZXJ2ZXJVcmw6IFwiaHR0cHM6Ly9hcHAuc2F5cGkuYWlcIixcbiAgICAgICAgYXBpU2VydmVyVXJsOiBcImh0dHBzOi8vYXBpLnNheXBpLmFpXCIsXG4gICAgICAgIC8vIEFkZCBvdGhlciBjb25maWd1cmF0aW9uIHByb3BlcnRpZXMgYXMgbmVlZGVkXG4gICAgfTtcbiAgICBjb25zdCBjb25maWcgPSBwcm9kdWN0aW9uQ29uZmlnO1xuXG4gICAgY29uc3QgcGFnZVNjcmlwdCA9IHJlcXVpcmUoJ3Jhdy1sb2FkZXIhLi90cmFuc2NyaWJlci5qcycpLmRlZmF1bHQ7XG5cbiAgICAvLyBDcmVhdGUgYSBNdXRhdGlvbk9ic2VydmVyIHRvIGxpc3RlbiBmb3IgY2hhbmdlcyB0byB0aGUgRE9NXG4gICAgdmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKG11dGF0aW9ucykge1xuICAgICAgICAvLyBDaGVjayBlYWNoIG11dGF0aW9uXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbXV0YXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbXV0YXRpb24gPSBtdXRhdGlvbnNbaV07XG5cbiAgICAgICAgICAgIC8vIElmIG5vZGVzIHdlcmUgYWRkZWQsIGNoZWNrIGVhY2ggb25lXG4gICAgICAgICAgICBpZiAobXV0YXRpb24uYWRkZWROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBtdXRhdGlvbi5hZGRlZE5vZGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBub2RlID0gbXV0YXRpb24uYWRkZWROb2Rlc1tqXTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgbm9kZSBpcyB0aGUgYXBwcm9wcmlhdGUgY29udGFpbmVyIGVsZW1lbnQsIGFkZCB0aGUgYnV0dG9uIGFuZCBzdG9wIG9ic2VydmluZ1xuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnZGl2JyAmJiBub2RlLmNsYXNzTGlzdC5jb250YWlucygnZml4ZWQnKSAmJiBub2RlLmNsYXNzTGlzdC5jb250YWlucygnYm90dG9tLTE2JykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmb290ZXIgPSBub2RlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGJ1dHRvbkNvbnRhaW5lciA9IGZvb3Rlci5xdWVyeVNlbGVjdG9yKCcucmVsYXRpdmUuZmxleC5mbGV4LWNvbCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJ1dHRvbkNvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZFRhbGtCdXR0b24oYnV0dG9uQ29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ05vIGJ1dHRvbiBjb250YWluZXIgZm91bmQgaW4gZm9vdGVyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGluamVjdFNjcmlwdChjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gaW5qZWN0U2NyaXB0TG9jYWwoY2FsbGJhY2spO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluamVjdFNjcmlwdFJlbW90ZShjYWxsYmFjaykge1xuICAgICAgICAvLyBHZXQgdGhlIFVSTCBvZiB0aGUgcmVtb3RlIHNjcmlwdFxuICAgICAgICB2YXIgcmVtb3RlU2NyaXB0VXJsID0gY29uZmlnLmFwcFNlcnZlclVybCArICd0cmFuc2NyaWJlci5qcyc7XG4gICAgICAgIEdNX3htbGh0dHBSZXF1ZXN0KHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgICAgICAgIHVybDogcmVtb3RlU2NyaXB0VXJsLFxuICAgICAgICAgICAgb25sb2FkOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2NyaXB0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgICAgICAgICAgc2NyaXB0RWxlbWVudC50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIjtcbiAgICAgICAgICAgICAgICBzY3JpcHRFbGVtZW50LmlkID0gJ3NheXBpLXNjcmlwdCc7XG4gICAgICAgICAgICAgICAgY29uc3QgY29uZmlnVGV4dCA9ICd2YXIgY29uZmlnID0gJyArIEpTT04uc3RyaW5naWZ5KGNvbmZpZykgKyAnOyc7XG4gICAgICAgICAgICAgICAgc2NyaXB0RWxlbWVudC50ZXh0Q29udGVudCA9IGNvbmZpZ1RleHQgKyByZXNwb25zZS5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHRFbGVtZW50KTtcblxuICAgICAgICAgICAgICAgIC8vIENhbGwgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIGFmdGVyIHRoZSBzY3JpcHQgaXMgYWRkZWRcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluamVjdFNjcmlwdExvY2FsKGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBzY3JpcHRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICAgICAgc2NyaXB0RWxlbWVudC50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIjtcbiAgICAgICAgc2NyaXB0RWxlbWVudC5pZCA9ICdzYXlwaS1zY3JpcHQnO1xuICAgICAgICBjb25zdCBjb25maWdUZXh0ID0gJ3ZhciBjb25maWcgPSAnICsgSlNPTi5zdHJpbmdpZnkoY29uZmlnKSArICc7JztcbiAgICAgICAgc2NyaXB0RWxlbWVudC50ZXh0Q29udGVudCA9IGNvbmZpZ1RleHQgKyBwYWdlU2NyaXB0O1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdEVsZW1lbnQpO1xuXG4gICAgICAgIC8vIENhbGwgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIGFmdGVyIHRoZSBzY3JpcHQgaXMgYWRkZWRcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBhZGRUYWxrQnV0dG9uKGNvbnRhaW5lcikge1xuICAgICAgICB2YXIgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgIGJ1dHRvbi5pZCA9ICd0YWxrQnV0dG9uJztcbiAgICAgICAgYnV0dG9uLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgICAgYnV0dG9uLmNsYXNzTmFtZSA9ICdyZWxhdGl2ZSBmbGV4IG10LTEgbWItMSByb3VuZGVkLWZ1bGwgcHgtMiBweS0zIHRleHQtY2VudGVyIGJnLWNyZWFtLTU1MCBob3ZlcjpiZy1jcmVhbS02NTAgaG92ZXI6dGV4dC1icmFuZC1ncmVlbi03MDAgdGV4dC1tdXRlZCc7XG4gICAgICAgIC8vIFNldCBBUklBIGxhYmVsIGFuZCB0b29sdGlwXG4gICAgICAgIGNvbnN0IGxhYmVsID0gJ1RhbGsgKEhvbGQgQ29udHJvbCArIFNwYWNlIHRvIHVzZSBob3RrZXkuIERvdWJsZSBjbGljayB0byB0b2dnbGUgYXV0by1zdWJtaXQgb24vb2ZmKSdcbiAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGxhYmVsKTtcbiAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgndGl0bGUnLCBsYWJlbCk7XG4gICAgICAgIC8vIGVuYWJsZSBhdXRvc3VibWl0IGJ5IGRlZmF1bHRcbiAgICAgICAgYnV0dG9uLmRhdGFzZXQuYXV0b3N1Ym1pdCA9ICd0cnVlJztcbiAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2F1dG9TdWJtaXQnKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gICAgICAgIGFkZFRhbGtCdXR0b25TdHlsZXMoKTtcbiAgICAgICAgYWRkVGFsa0ljb24oYnV0dG9uKTtcblxuICAgICAgICAvLyBDYWxsIHRoZSBmdW5jdGlvbiB0byBpbmplY3QgdGhlIHNjcmlwdCBhZnRlciB0aGUgYnV0dG9uIGhhcyBiZWVuIGFkZGVkXG4gICAgICAgIGluamVjdFNjcmlwdChyZWdpc3RlckF1ZGlvQnV0dG9uRXZlbnRzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRUYWxrSWNvbihidXR0b24pIHtcbiAgICAgICAgdmFyIGljb25IdG1sID0gYFxuICAgICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2ZXJzaW9uPVwiMS4wXCIgdmlld0JveD1cIjAgMCA1Ni4yNSAzMFwiIGNsYXNzPVwid2F2ZWZvcm1cIj5cbiAgICAgICAgPGRlZnM+XG4gICAgICAgICAgICA8Y2xpcFBhdGggaWQ9XCJhXCI+XG4gICAgICAgICAgICAgICAgPHBhdGggZD1cIk0uNTQgMTJIM3Y1SC41NFptMCAwXCIvPlxuICAgICAgICAgICAgPC9jbGlwUGF0aD5cbiAgICAgICAgICAgIDxjbGlwUGF0aCBpZD1cImJcIj5cbiAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTI1IDIuMmgydjI0LjY4aC0yWm0wIDBcIi8+XG4gICAgICAgICAgICA8L2NsaXBQYXRoPlxuICAgICAgICAgICAgPGNsaXBQYXRoIGlkPVwiY1wiPlxuICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNNTMgMTJoMS45OHY1SDUzWm0wIDBcIi8+XG4gICAgICAgICAgICA8L2NsaXBQYXRoPlxuICAgICAgICA8L2RlZnM+XG4gICAgICAgIDxnIGNsaXAtcGF0aD1cInVybCgjYSlcIj5cbiAgICAgICAgICAgIDxwYXRoIGQ9XCJNMS40OCAxMi43MWMtLjUgMC0uOS40LS45Ljl2MS44NWEuOS45IDAgMCAwIDEuOCAwdi0xLjg0YzAtLjUtLjQtLjktLjktLjlabTAgMFwiLz5cbiAgICAgICAgPC9nPlxuICAgICAgICA8cGF0aCBkPVwiTTQuOTggNi42M2MtLjUgMC0uOS40LS45Ljl2MTQuMDFhLjkuOSAwIDAgMCAxLjgxIDB2LTE0YzAtLjUtLjQtLjkyLS45LS45MlptMy41MSAzLjFhLjkuOSAwIDAgMC0uOS45MXY3Ljc5YS45LjkgMCAwIDAgMS44IDB2LTcuNzljMC0uNS0uNC0uOS0uOS0uOVpNMTIgMy44M2EuOS45IDAgMCAwLS45MS45djE5LjZhLjkuOSAwIDAgMCAxLjggMFY0Ljc0YzAtLjUtLjQtLjktLjktLjlabTMuNSA4LjI5YS45LjkgMCAwIDAtLjkxLjl2My4wM2EuOS45IDAgMCAwIDEuODEgMHYtMy4wM2MwLS41LS40LS45LS45LS45Wk0xOSA2LjhjLS41IDAtLjkuNC0uOS45djEzLjY4YS45LjkgMCAwIDAgMS44IDBWNy43YzAtLjUtLjQtLjktLjktLjlabTMuNTgtMi45N2gtLjAxYy0uNSAwLS45LjQtLjkuOWwtLjEzIDE5LjZjMCAuNS40LjkuOS45MS41IDAgLjktLjQuOS0uOWwuMTQtMTkuNmEuOS45IDAgMCAwLS45LS45Wm0wIDBcIi8+XG4gICAgICAgIDxnIGNsaXAtcGF0aD1cInVybCgjYilcIj5cbiAgICAgICAgICAgIDxwYXRoIGQ9XCJNMjYgMi4yYy0uNSAwLS45LjQtLjkuOXYyMi44NmEuOS45IDAgMSAwIDEuODEgMFYzLjExYS45LjkgMCAwIDAtLjktLjkxWm0wIDBcIi8+XG4gICAgICAgIDwvZz5cbiAgICAgICAgPHBhdGggZD1cIk0yOS41MiA3LjcxYS45LjkgMCAwIDAtLjkxLjl2MTEuODVhLjkuOSAwIDAgMCAxLjgxIDBWOC42MmMwLS41LS40LS45LS45LS45Wm0zLjUgMi45M2EuOS45IDAgMCAwLS45LjkxdjUuOTdhLjkuOSAwIDAgMCAxLjggMHYtNS45N2MwLS41LS40LS45LS45LS45Wm0zLjUtNS43OGMtLjUgMC0uOS40LS45Ljl2MTcuNTVhLjkuOSAwIDAgMCAxLjgxIDBWNS43NmMwLS41LS40LS45LS45LS45Wm0zLjUxIDMuMzRjLS41IDAtLjkuNC0uOS45djEwLjg3YS45LjkgMCAwIDAgMS44IDBWOS4xYS45LjkgMCAwIDAtLjktLjkxWm0zLjUgMy4wOGMtLjUgMC0uOS40LS45LjkxdjQuN2EuOS45IDAgMSAwIDEuOCAwdi00LjdhLjkuOSAwIDAgMC0uOS0uOVptMy41MS03LjQ1YS45LjkgMCAwIDAtLjkxLjl2MTkuNmEuOS45IDAgMCAwIDEuODEgMFY0Ljc0YzAtLjUtLjQtLjktLjktLjlabTMuNSA1LjU3YS45LjkgMCAwIDAtLjkuOTF2OC40NWEuOS45IDAgMCAwIDEuOCAwdi04LjQ1YzAtLjUtLjQtLjktLjktLjlabTAgMFwiLz5cbiAgICAgICAgPGcgY2xpcC1wYXRoPVwidXJsKCNjKVwiPlxuICAgICAgICAgICAgPHBhdGggZD1cIk01NC4wNCAxMi45NmEuOS45IDAgMCAwLS45LjkxdjEuMzNhLjkuOSAwIDEgMCAxLjggMHYtMS4zMmEuOS45IDAgMCAwLS45LS45MlptMCAwXCIvPlxuICAgICAgICA8L2c+XG4gICAgPC9zdmc+XG4gICAgXG4gICAgICAgIGA7XG4gICAgICAgIHZhciBpY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdzdmcnKTtcbiAgICAgICAgYnV0dG9uLmFwcGVuZENoaWxkKGljb24pO1xuICAgICAgICBpY29uLm91dGVySFRNTCA9IGljb25IdG1sO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFN0eWxlcyhjc3MpIHtcbiAgICAgICAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgICAgICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFRhbGtCdXR0b25TdHlsZXMoKSB7XG4gICAgICAgIC8vIEdldCB0aGUgYnV0dG9uIGFuZCByZWdpc3RlciBmb3IgbW91c2Vkb3duIGFuZCBtb3VzZXVwIGV2ZW50c1xuICAgICAgICB2YXIgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhbGtCdXR0b24nKTtcbiAgICAgICAgLy8gYnV0dG9uIGFuaW1hdGlvblxuICAgICAgICBhZGRTdHlsZXMoYFxuICAgICAgICAgICAgQGtleWZyYW1lcyBwdWxzZSB7XG4gICAgICAgICAgICAgICAgMCUge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA1MCUge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDEwMCUge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICN0YWxrQnV0dG9uIHtcbiAgICAgICAgICAgICAgICBtYXJnaW4tdG9wOiAwLjI1cmVtO1xuICAgICAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE4cHg7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDEyMHB4O1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrOyAvKiBGb3IgU2FmYXJpICovXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICN0YWxrQnV0dG9uOmFjdGl2ZSAud2F2ZWZvcm0sICN0YWxrQnV0dG9uLmFjdGl2ZSAud2F2ZWZvcm0ge1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogcHVsc2UgMXMgaW5maW5pdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAjdGFsa0J1dHRvbiAud2F2ZWZvcm0ge1xuICAgICAgICAgICAgICAgIGZpbGw6ICM3NzZkNmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAjdGFsa0J1dHRvbi5hdXRvU3VibWl0IC53YXZlZm9ybSB7XG4gICAgICAgICAgICAgICAgZmlsbDogcmdiKDY1IDEzOCA0Nyk7IC8qIFBpJ3MgdGV4dC1icmFuZC1ncmVlbi02MDAgKi9cbiAgICAgICAgICAgIH1cbiAgICAgICAgYCk7XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWdpc3RlckF1ZGlvQnV0dG9uRXZlbnRzKCkge1xuICAgICAgICB2YXIgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhbGtCdXR0b24nKTtcblxuICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWRQcm9tcHRUZXh0QXJlYSgpO1xuICAgICAgICAgICAgdW5zYWZlV2luZG93LnN0YXJ0UmVjb3JkaW5nKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHVuc2FmZVdpbmRvdy5zdG9wUmVjb3JkaW5nKCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZWdpc3RlckhvdGtleSgpO1xuXG4gICAgICAgIC8vIFwid2FybSB1cFwiIHRoZSBtaWNyb3Bob25lIGJ5IGFjcXVpcmluZyBpdCBiZWZvcmUgdGhlIHVzZXIgcHJlc3NlcyB0aGUgYnV0dG9uXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWxrQnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIHNldHVwUmVjb3JkaW5nKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhbGtCdXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgdGVhckRvd25SZWNvcmRpbmcpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmVmb3JldW5sb2FkJywgdGVhckRvd25SZWNvcmRpbmcpO1xuXG4gICAgICAgIC8vIEF0dGFjaCBhIGRvdWJsZSBjbGljayBldmVudCBsaXN0ZW5lciB0byB0aGUgdGFsayBidXR0b25cbiAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gVG9nZ2xlIHRoZSBDU1MgY2xhc3NlcyB0byBpbmRpY2F0ZSB0aGUgbW9kZVxuICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoJ2F1dG9TdWJtaXQnKTtcblxuICAgICAgICAgICAgLy8gU3RvcmUgdGhlIHN0YXRlIG9uIHRoZSBidXR0b24gZWxlbWVudCB1c2luZyBhIGN1c3RvbSBkYXRhIGF0dHJpYnV0ZVxuICAgICAgICAgICAgaWYgKGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXV0b3N1Ym1pdCcpID09PSAndHJ1ZScpIHtcbiAgICAgICAgICAgICAgICBidXR0b24uc2V0QXR0cmlidXRlKCdkYXRhLWF1dG9zdWJtaXQnLCAnZmFsc2UnKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnYXV0b3N1Ym1pdCBkaXNhYmxlZCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBidXR0b24uc2V0QXR0cmlidXRlKCdkYXRhLWF1dG9zdWJtaXQnLCAndHJ1ZScpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhdXRvc3VibWl0IGVuYWJsZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWdpc3RlckhvdGtleSgpIHtcbiAgICAgICAgLy8gUmVnaXN0ZXIgYSBob3RrZXkgZm9yIHRoZSBidXR0b25cbiAgICAgICAgbGV0IGN0cmxEb3duID0gZmFsc2U7XG5cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LmN0cmxLZXkgJiYgZXZlbnQuY29kZSA9PT0gJ1NwYWNlJyAmJiAhY3RybERvd24pIHtcbiAgICAgICAgICAgICAgICBjdHJsRG93biA9IHRydWU7XG4gICAgICAgICAgICAgICAgLy8gU2ltdWxhdGUgbW91c2Vkb3duIGV2ZW50XG4gICAgICAgICAgICAgICAgbGV0IG1vdXNlRG93bkV2ZW50ID0gbmV3IEV2ZW50KCdtb3VzZWRvd24nKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFsa0J1dHRvbicpLmRpc3BhdGNoRXZlbnQobW91c2VEb3duRXZlbnQpO1xuICAgICAgICAgICAgICAgIHRhbGtCdXR0b24uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7IC8vIEFkZCB0aGUgYWN0aXZlIGNsYXNzXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoY3RybERvd24gJiYgZXZlbnQuY29kZSA9PT0gJ1NwYWNlJykge1xuICAgICAgICAgICAgICAgIGN0cmxEb3duID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgLy8gU2ltdWxhdGUgbW91c2V1cCBldmVudFxuICAgICAgICAgICAgICAgIGxldCBtb3VzZVVwRXZlbnQgPSBuZXcgRXZlbnQoJ21vdXNldXAnKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFsa0J1dHRvbicpLmRpc3BhdGNoRXZlbnQobW91c2VVcEV2ZW50KTtcbiAgICAgICAgICAgICAgICB0YWxrQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIGlkUHJvbXB0VGV4dEFyZWEoKSB7XG4gICAgICAgIHZhciB0ZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9tcHQnKTtcbiAgICAgICAgaWYgKCF0ZXh0YXJlYSkge1xuICAgICAgICAgICAgLy8gRmluZCB0aGUgZmlyc3QgPHRleHRhcmVhPiBlbGVtZW50IGFuZCBnaXZlIGl0IGFuIGlkXG4gICAgICAgICAgICB2YXIgdGV4dGFyZWFFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcigndGV4dGFyZWEnKTtcbiAgICAgICAgICAgIGlmICh0ZXh0YXJlYUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0ZXh0YXJlYUVsZW1lbnQuaWQgPSAncHJvbXB0JztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ05vIDx0ZXh0YXJlYT4gZWxlbWVudCBmb3VuZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gU3RhcnQgb2JzZXJ2aW5nIHRoZSBlbnRpcmUgZG9jdW1lbnQgZm9yIGNoYW5nZXMgdG8gY2hpbGQgbm9kZXMgYW5kIHN1YnRyZWVcbiAgICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LCB7IGNoaWxkTGlzdDogdHJ1ZSwgc3VidHJlZTogdHJ1ZSB9KTtcbn0pKCk7XG4iXSwibmFtZXMiOlsibG9jYWxDb25maWciLCJhcHBTZXJ2ZXJVcmwiLCJhcGlTZXJ2ZXJVcmwiLCJwcm9kdWN0aW9uQ29uZmlnIiwiY29uZmlnIiwicGFnZVNjcmlwdCIsInJlcXVpcmUiLCJvYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJtdXRhdGlvbnMiLCJpIiwibGVuZ3RoIiwibXV0YXRpb24iLCJhZGRlZE5vZGVzIiwiaiIsIm5vZGUiLCJub2RlTmFtZSIsInRvTG93ZXJDYXNlIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJmb290ZXIiLCJidXR0b25Db250YWluZXIiLCJxdWVyeVNlbGVjdG9yIiwiYWRkVGFsa0J1dHRvbiIsImNvbnNvbGUiLCJsb2ciLCJkaXNjb25uZWN0IiwiaW5qZWN0U2NyaXB0IiwiY2FsbGJhY2siLCJpbmplY3RTY3JpcHRMb2NhbCIsImluamVjdFNjcmlwdFJlbW90ZSIsInJlbW90ZVNjcmlwdFVybCIsIkdNX3htbGh0dHBSZXF1ZXN0IiwibWV0aG9kIiwidXJsIiwib25sb2FkIiwicmVzcG9uc2UiLCJzY3JpcHRFbGVtZW50IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwidHlwZSIsImlkIiwiY29uZmlnVGV4dCIsIkpTT04iLCJzdHJpbmdpZnkiLCJ0ZXh0Q29udGVudCIsInJlc3BvbnNlVGV4dCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsImNvbnRhaW5lciIsImJ1dHRvbiIsImNsYXNzTmFtZSIsImxhYmVsIiwic2V0QXR0cmlidXRlIiwiZGF0YXNldCIsImF1dG9zdWJtaXQiLCJhZGQiLCJhZGRUYWxrQnV0dG9uU3R5bGVzIiwiYWRkVGFsa0ljb24iLCJyZWdpc3RlckF1ZGlvQnV0dG9uRXZlbnRzIiwiaWNvbkh0bWwiLCJpY29uIiwiY3JlYXRlRWxlbWVudE5TIiwib3V0ZXJIVE1MIiwiYWRkU3R5bGVzIiwiY3NzIiwic3R5bGUiLCJjcmVhdGVUZXh0Tm9kZSIsImhlYWQiLCJnZXRFbGVtZW50QnlJZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJpZFByb21wdFRleHRBcmVhIiwidW5zYWZlV2luZG93Iiwic3RhcnRSZWNvcmRpbmciLCJzdG9wUmVjb3JkaW5nIiwicmVnaXN0ZXJIb3RrZXkiLCJzZXR1cFJlY29yZGluZyIsInRlYXJEb3duUmVjb3JkaW5nIiwid2luZG93IiwidG9nZ2xlIiwiZ2V0QXR0cmlidXRlIiwiY3RybERvd24iLCJldmVudCIsImN0cmxLZXkiLCJjb2RlIiwibW91c2VEb3duRXZlbnQiLCJFdmVudCIsImRpc3BhdGNoRXZlbnQiLCJ0YWxrQnV0dG9uIiwibW91c2VVcEV2ZW50IiwicmVtb3ZlIiwidGV4dGFyZWEiLCJ0ZXh0YXJlYUVsZW1lbnQiLCJvYnNlcnZlIiwiY2hpbGRMaXN0Iiwic3VidHJlZSJdLCJzb3VyY2VSb290IjoiIn0=