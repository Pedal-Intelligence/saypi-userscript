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
                    /* harmony export */
                });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("var audioDataChunks = [];\nvar audioMimeType = 'audio/webm;codecs=opus';\nfunction uploadAudio(audioBlob) {\n  // Create a FormData object\n  var formData = new FormData();\n  var audioFilename = 'audio.webm';\n  if (audioBlob.type === 'audio/mp4') {\n    audioFilename = 'audio.mp4';\n  }\n  // Add the audio blob to the FormData object\n  formData.append('audio', audioBlob, audioFilename);\n  // Get the user's preferred language\n  var language = navigator.language;\n  // Post the audio to the server for transcription\n  fetch(config.apiServerUrl + '/transcribe?language=' + language, {\n    method: 'POST',\n    body: formData\n  }).then(function (response) {\n    if (!response.ok) {\n      throw Error(response.statusText);\n    }\n    return response.json();\n  }).then(handleTranscriptionResponse)[\"catch\"](function (error) {\n    console.error('Looks like there was a problem: ', error);\n    var textarea = document.getElementById('prompt');\n    textarea.value = 'Sorry, there was a problem transcribing your audio. Please try again later.';\n  });\n}\nfunction handleTranscriptionResponse(responseJson) {\n  var textarea = document.getElementById('prompt');\n  simulateTyping(textarea, responseJson.text + \" \");\n  console.log('Speaker: ' + responseJson.text);\n}\nfunction setNativeValue(element, value) {\n  var lastValue = element.value;\n  element.value = value;\n  var event = new Event(\"input\", {\n    target: element,\n    bubbles: true\n  });\n  // React 15\n  event.simulated = true;\n  // React 16-17\n  var tracker = element._valueTracker;\n  if (tracker) {\n    tracker.setValue(lastValue);\n  }\n  element.dispatchEvent(event);\n}\nfunction simulateFormSubmit(textarea) {\n  var enterEvent = new KeyboardEvent('keydown', {\n    bubbles: true,\n    key: 'Enter',\n    keyCode: 13,\n    which: 13\n  });\n  textarea.dispatchEvent(enterEvent);\n}\nfunction simulateTyping(element, text) {\n  var words = text.split(' '); // Split the text into words (may not be ideal for all languages)\n  var i = 0;\n  function typeWord() {\n    if (i < words.length) {\n      // Append the next word and a space, then increment i\n      setNativeValue(element, element.value + words[i++] + ' ');\n      // Call this function again before the next repaint\n      requestAnimationFrame(typeWord);\n    } else {\n      // Check if autosubmit is enabled\n      var talkButton = document.getElementById('talkButton');\n      if (talkButton.dataset.autosubmit === 'false') {\n        console.log('Autosubmit is disabled');\n      } else {\n        // Simulate an \"Enter\" keypress event\n        simulateFormSubmit(element);\n        console.log('Message autosubmitted');\n      }\n    }\n  }\n  // Start typing\n  typeWord();\n}\n\n// Declare a global variable for the mediaRecorder\nvar mediaRecorder;\nvar threshold = 1000; // 1000 ms = 1 second, about the length of \"Hey, Pi\"\n\n// This function will be called when the 'dataavailable' event fires\nfunction handleDataAvailable(e) {\n  // Add the audio data chunk to the array\n  audioDataChunks.push(e.data);\n}\n\n// This function will be called when the 'stop' event fires\nfunction handleStop() {\n  // Create a Blob from the audio data chunks\n  var audioBlob = new Blob(audioDataChunks, {\n    type: audioMimeType\n  });\n\n  // Get the stop time and calculate the duration\n  var stopTime = Date.now();\n  var duration = stopTime - window.startTime;\n\n  // If the duration is greater than the threshold, upload the audio for transcription\n  if (duration >= threshold) {\n    // download the audio\n    var url = URL.createObjectURL(audioBlob);\n    var a = document.createElement('a');\n    a.style.display = 'none';\n    a.href = url;\n    a.download = 'safari_audio.mp4';\n    document.body.appendChild(a);\n    // a.click();\n    // Upload the audio to the server for transcription\n    uploadAudio(audioBlob);\n  }\n\n  // Clear the array for the next recording\n  audioDataChunks = [];\n}\nfunction setupRecording(callback) {\n  if (mediaRecorder) {\n    return;\n  }\n\n  // Get a stream from the user's microphone\n  navigator.mediaDevices.getUserMedia({\n    audio: true\n  }).then(function (stream) {\n    if (!MediaRecorder.isTypeSupported(audioMimeType)) {\n      // use MP4 for Safari\n      audioMimeType = 'audio/mp4';\n    }\n    // Create a new MediaRecorder object using the stream and specifying the MIME type\n    var options = {\n      mimeType: audioMimeType\n    };\n    mediaRecorder = new MediaRecorder(stream, options);\n\n    // Listen for the 'dataavailable' event\n    mediaRecorder.addEventListener('dataavailable', handleDataAvailable);\n\n    // Listen for the 'stop' event\n    mediaRecorder.addEventListener('stop', handleStop);\n  }).then(function () {\n    // Invoke the callback function\n    if (typeof callback === 'function') {\n      callback();\n    }\n  })[\"catch\"](function (err) {\n    console.error('Error getting audio stream: ' + err);\n  });\n}\nfunction tearDownRecording() {\n  // Check if the MediaRecorder is set up\n  if (!mediaRecorder) {\n    return;\n  }\n\n  // Stop any ongoing recording\n  if (mediaRecorder.state === 'recording') {\n    mediaRecorder.stop();\n  }\n\n  // Remove the MediaRecorder's event listeners\n  mediaRecorder.removeEventListener('dataavailable', handleDataAvailable);\n  mediaRecorder.removeEventListener('stop', handleStop);\n\n  // Clear the MediaRecorder variable\n  mediaRecorder = null;\n}\n\n// This function will be called when the user presses the record button\nfunction startRecording() {\n  // Check if the MediaRecorder is set up\n  if (!mediaRecorder) {\n    setupRecording(startRecording);\n    return;\n  }\n\n  // Start recording\n  mediaRecorder.start();\n\n  // Record the start time\n  window.startTime = Date.now();\n  console.log('Recording started');\n\n  // This function will be called when the user releases the record button\n  window.stopRecording = function () {\n    if (mediaRecorder && mediaRecorder.state === 'recording') {\n      // Stop recording\n      mediaRecorder.stop();\n\n      // Record the stop time and calculate the duration\n      var stopTime = Date.now();\n      var duration = stopTime - window.startTime;\n\n      // If the duration is less than the threshold, don't upload the audio for transcription\n      if (duration < threshold) {\n        console.log('Recording was too short, not uploading for transcription');\n      } else {\n        console.log('Recording stopped');\n      }\n    }\n    // Remove the stopRecording function\n    delete window.stopRecording;\n  };\n}\n\n// Add the startRecording function to the window object so it can be called from outside this script\nwindow.startRecording = startRecording;");

                /***/
            })

        /******/
    });
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
            /******/
        }
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
            /******/
        };
/******/
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
        /******/
    }
/******/
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for (var key in definition) {
/******/ 				if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
                    /******/
                }
                /******/
            }
            /******/
        };
        /******/
    })();
/******/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
        /******/
    })();
/******/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
                /******/
            }
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
            /******/
        };
        /******/
    })();
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
        // @version      1.1.4
        // @description  Speak to Pi with OpenAI's Whisper
        // @author       Ross Cadogan
        // @match        https://pi.ai/talk
        // @grant        GM_xmlhttpRequest
        // @updateURL    https://www.saypi.ai/saypi.user.js
        // @downloadURL  https://www.saypi.ai/saypi.user.js
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
                appServerUrl: "https://www.saypi.ai",
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

    /******/
})()
    ;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FBQ3dFLE1BQU0sQ0FBQyxRQUFRLENBQUM7TUFDekM7SUFDSixDQUFDLENBQUM7RUFDTjtFQUdBLFNBQVNuQixnQkFBZ0JBLENBQUEsRUFBRztJQUN4QixJQUFJb0IsUUFBUSxHQUFHckQsUUFBUSxDQUFDK0IsY0FBYyxDQUFDLFFBQVEsQ0FBQztJQUNoRCxJQUFJLENBQUNzQixRQUFRLEVBQUU7TUFDWDtNQUNBLElBQUlDLGVBQWUsR0FBR3RELFFBQVEsQ0FBQ2hCLGFBQWEsQ0FBQyxVQUFVLENBQUM7TUFDeEQsSUFBSXNFLGVBQWUsRUFBRTtRQUNqQkEsZUFBZSxDQUFDbkQsRUFBRSxHQUFHLFFBQVE7TUFDakMsQ0FBQyxNQUFNO1FBQ0hqQixPQUFPLENBQUNDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQztNQUM5QztJQUNKO0VBQ0o7O0VBRUE7RUFDQWxCLFFBQVEsQ0FBQ3NGLE9BQU8sQ0FBQ3ZELFFBQVEsRUFBRTtJQUFFd0QsU0FBUyxFQUFFLElBQUk7SUFBRUMsT0FBTyxFQUFFO0VBQUssQ0FBQyxDQUFDO0FBQ2xFLENBQUMsRUFBRSxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3RyYW5zY3JpYmVyLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3NheXBpLmluZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IFwidmFyIGF1ZGlvRGF0YUNodW5rcyA9IFtdO1xcbnZhciBhdWRpb01pbWVUeXBlID0gJ2F1ZGlvL3dlYm07Y29kZWNzPW9wdXMnO1xcbmZ1bmN0aW9uIHVwbG9hZEF1ZGlvKGF1ZGlvQmxvYikge1xcbiAgLy8gQ3JlYXRlIGEgRm9ybURhdGEgb2JqZWN0XFxuICB2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcXG4gIHZhciBhdWRpb0ZpbGVuYW1lID0gJ2F1ZGlvLndlYm0nO1xcbiAgaWYgKGF1ZGlvQmxvYi50eXBlID09PSAnYXVkaW8vbXA0Jykge1xcbiAgICBhdWRpb0ZpbGVuYW1lID0gJ2F1ZGlvLm1wNCc7XFxuICB9XFxuICAvLyBBZGQgdGhlIGF1ZGlvIGJsb2IgdG8gdGhlIEZvcm1EYXRhIG9iamVjdFxcbiAgZm9ybURhdGEuYXBwZW5kKCdhdWRpbycsIGF1ZGlvQmxvYiwgYXVkaW9GaWxlbmFtZSk7XFxuICAvLyBHZXQgdGhlIHVzZXIncyBwcmVmZXJyZWQgbGFuZ3VhZ2VcXG4gIHZhciBsYW5ndWFnZSA9IG5hdmlnYXRvci5sYW5ndWFnZTtcXG4gIC8vIFBvc3QgdGhlIGF1ZGlvIHRvIHRoZSBzZXJ2ZXIgZm9yIHRyYW5zY3JpcHRpb25cXG4gIGZldGNoKGNvbmZpZy5hcGlTZXJ2ZXJVcmwgKyAnL3RyYW5zY3JpYmU/bGFuZ3VhZ2U9JyArIGxhbmd1YWdlLCB7XFxuICAgIG1ldGhvZDogJ1BPU1QnLFxcbiAgICBib2R5OiBmb3JtRGF0YVxcbiAgfSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcXG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xcbiAgICAgIHRocm93IEVycm9yKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xcbiAgICB9XFxuICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XFxuICB9KS50aGVuKGhhbmRsZVRyYW5zY3JpcHRpb25SZXNwb25zZSlbXFxcImNhdGNoXFxcIl0oZnVuY3Rpb24gKGVycm9yKSB7XFxuICAgIGNvbnNvbGUuZXJyb3IoJ0xvb2tzIGxpa2UgdGhlcmUgd2FzIGEgcHJvYmxlbTogJywgZXJyb3IpO1xcbiAgICB2YXIgdGV4dGFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvbXB0Jyk7XFxuICAgIHRleHRhcmVhLnZhbHVlID0gJ1NvcnJ5LCB0aGVyZSB3YXMgYSBwcm9ibGVtIHRyYW5zY3JpYmluZyB5b3VyIGF1ZGlvLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyLic7XFxuICB9KTtcXG59XFxuZnVuY3Rpb24gaGFuZGxlVHJhbnNjcmlwdGlvblJlc3BvbnNlKHJlc3BvbnNlSnNvbikge1xcbiAgdmFyIHRleHRhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb21wdCcpO1xcbiAgc2ltdWxhdGVUeXBpbmcodGV4dGFyZWEsIHJlc3BvbnNlSnNvbi50ZXh0ICsgXFxcIiBcXFwiKTtcXG4gIGNvbnNvbGUubG9nKCdTcGVha2VyOiAnICsgcmVzcG9uc2VKc29uLnRleHQpO1xcbn1cXG5mdW5jdGlvbiBzZXROYXRpdmVWYWx1ZShlbGVtZW50LCB2YWx1ZSkge1xcbiAgdmFyIGxhc3RWYWx1ZSA9IGVsZW1lbnQudmFsdWU7XFxuICBlbGVtZW50LnZhbHVlID0gdmFsdWU7XFxuICB2YXIgZXZlbnQgPSBuZXcgRXZlbnQoXFxcImlucHV0XFxcIiwge1xcbiAgICB0YXJnZXQ6IGVsZW1lbnQsXFxuICAgIGJ1YmJsZXM6IHRydWVcXG4gIH0pO1xcbiAgLy8gUmVhY3QgMTVcXG4gIGV2ZW50LnNpbXVsYXRlZCA9IHRydWU7XFxuICAvLyBSZWFjdCAxNi0xN1xcbiAgdmFyIHRyYWNrZXIgPSBlbGVtZW50Ll92YWx1ZVRyYWNrZXI7XFxuICBpZiAodHJhY2tlcikge1xcbiAgICB0cmFja2VyLnNldFZhbHVlKGxhc3RWYWx1ZSk7XFxuICB9XFxuICBlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xcbn1cXG5mdW5jdGlvbiBzaW11bGF0ZUZvcm1TdWJtaXQodGV4dGFyZWEpIHtcXG4gIHZhciBlbnRlckV2ZW50ID0gbmV3IEtleWJvYXJkRXZlbnQoJ2tleWRvd24nLCB7XFxuICAgIGJ1YmJsZXM6IHRydWUsXFxuICAgIGtleTogJ0VudGVyJyxcXG4gICAga2V5Q29kZTogMTMsXFxuICAgIHdoaWNoOiAxM1xcbiAgfSk7XFxuICB0ZXh0YXJlYS5kaXNwYXRjaEV2ZW50KGVudGVyRXZlbnQpO1xcbn1cXG5mdW5jdGlvbiBzaW11bGF0ZVR5cGluZyhlbGVtZW50LCB0ZXh0KSB7XFxuICB2YXIgd29yZHMgPSB0ZXh0LnNwbGl0KCcgJyk7IC8vIFNwbGl0IHRoZSB0ZXh0IGludG8gd29yZHMgKG1heSBub3QgYmUgaWRlYWwgZm9yIGFsbCBsYW5ndWFnZXMpXFxuICB2YXIgaSA9IDA7XFxuICBmdW5jdGlvbiB0eXBlV29yZCgpIHtcXG4gICAgaWYgKGkgPCB3b3Jkcy5sZW5ndGgpIHtcXG4gICAgICAvLyBBcHBlbmQgdGhlIG5leHQgd29yZCBhbmQgYSBzcGFjZSwgdGhlbiBpbmNyZW1lbnQgaVxcbiAgICAgIHNldE5hdGl2ZVZhbHVlKGVsZW1lbnQsIGVsZW1lbnQudmFsdWUgKyB3b3Jkc1tpKytdICsgJyAnKTtcXG4gICAgICAvLyBDYWxsIHRoaXMgZnVuY3Rpb24gYWdhaW4gYmVmb3JlIHRoZSBuZXh0IHJlcGFpbnRcXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodHlwZVdvcmQpO1xcbiAgICB9IGVsc2Uge1xcbiAgICAgIC8vIENoZWNrIGlmIGF1dG9zdWJtaXQgaXMgZW5hYmxlZFxcbiAgICAgIHZhciB0YWxrQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhbGtCdXR0b24nKTtcXG4gICAgICBpZiAodGFsa0J1dHRvbi5kYXRhc2V0LmF1dG9zdWJtaXQgPT09ICdmYWxzZScpIHtcXG4gICAgICAgIGNvbnNvbGUubG9nKCdBdXRvc3VibWl0IGlzIGRpc2FibGVkJyk7XFxuICAgICAgfSBlbHNlIHtcXG4gICAgICAgIC8vIFNpbXVsYXRlIGFuIFxcXCJFbnRlclxcXCIga2V5cHJlc3MgZXZlbnRcXG4gICAgICAgIHNpbXVsYXRlRm9ybVN1Ym1pdChlbGVtZW50KTtcXG4gICAgICAgIGNvbnNvbGUubG9nKCdNZXNzYWdlIGF1dG9zdWJtaXR0ZWQnKTtcXG4gICAgICB9XFxuICAgIH1cXG4gIH1cXG4gIC8vIFN0YXJ0IHR5cGluZ1xcbiAgdHlwZVdvcmQoKTtcXG59XFxuXFxuLy8gRGVjbGFyZSBhIGdsb2JhbCB2YXJpYWJsZSBmb3IgdGhlIG1lZGlhUmVjb3JkZXJcXG52YXIgbWVkaWFSZWNvcmRlcjtcXG52YXIgdGhyZXNob2xkID0gMTAwMDsgLy8gMTAwMCBtcyA9IDEgc2Vjb25kLCBhYm91dCB0aGUgbGVuZ3RoIG9mIFxcXCJIZXksIFBpXFxcIlxcblxcbi8vIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgJ2RhdGFhdmFpbGFibGUnIGV2ZW50IGZpcmVzXFxuZnVuY3Rpb24gaGFuZGxlRGF0YUF2YWlsYWJsZShlKSB7XFxuICAvLyBBZGQgdGhlIGF1ZGlvIGRhdGEgY2h1bmsgdG8gdGhlIGFycmF5XFxuICBhdWRpb0RhdGFDaHVua3MucHVzaChlLmRhdGEpO1xcbn1cXG5cXG4vLyBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlICdzdG9wJyBldmVudCBmaXJlc1xcbmZ1bmN0aW9uIGhhbmRsZVN0b3AoKSB7XFxuICAvLyBDcmVhdGUgYSBCbG9iIGZyb20gdGhlIGF1ZGlvIGRhdGEgY2h1bmtzXFxuICB2YXIgYXVkaW9CbG9iID0gbmV3IEJsb2IoYXVkaW9EYXRhQ2h1bmtzLCB7XFxuICAgIHR5cGU6IGF1ZGlvTWltZVR5cGVcXG4gIH0pO1xcblxcbiAgLy8gR2V0IHRoZSBzdG9wIHRpbWUgYW5kIGNhbGN1bGF0ZSB0aGUgZHVyYXRpb25cXG4gIHZhciBzdG9wVGltZSA9IERhdGUubm93KCk7XFxuICB2YXIgZHVyYXRpb24gPSBzdG9wVGltZSAtIHdpbmRvdy5zdGFydFRpbWU7XFxuXFxuICAvLyBJZiB0aGUgZHVyYXRpb24gaXMgZ3JlYXRlciB0aGFuIHRoZSB0aHJlc2hvbGQsIHVwbG9hZCB0aGUgYXVkaW8gZm9yIHRyYW5zY3JpcHRpb25cXG4gIGlmIChkdXJhdGlvbiA+PSB0aHJlc2hvbGQpIHtcXG4gICAgLy8gZG93bmxvYWQgdGhlIGF1ZGlvXFxuICAgIHZhciB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGF1ZGlvQmxvYik7XFxuICAgIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xcbiAgICBhLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XFxuICAgIGEuaHJlZiA9IHVybDtcXG4gICAgYS5kb3dubG9hZCA9ICdzYWZhcmlfYXVkaW8ubXA0JztcXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTtcXG4gICAgLy8gYS5jbGljaygpO1xcbiAgICAvLyBVcGxvYWQgdGhlIGF1ZGlvIHRvIHRoZSBzZXJ2ZXIgZm9yIHRyYW5zY3JpcHRpb25cXG4gICAgdXBsb2FkQXVkaW8oYXVkaW9CbG9iKTtcXG4gIH1cXG5cXG4gIC8vIENsZWFyIHRoZSBhcnJheSBmb3IgdGhlIG5leHQgcmVjb3JkaW5nXFxuICBhdWRpb0RhdGFDaHVua3MgPSBbXTtcXG59XFxuZnVuY3Rpb24gc2V0dXBSZWNvcmRpbmcoY2FsbGJhY2spIHtcXG4gIGlmIChtZWRpYVJlY29yZGVyKSB7XFxuICAgIHJldHVybjtcXG4gIH1cXG5cXG4gIC8vIEdldCBhIHN0cmVhbSBmcm9tIHRoZSB1c2VyJ3MgbWljcm9waG9uZVxcbiAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEoe1xcbiAgICBhdWRpbzogdHJ1ZVxcbiAgfSkudGhlbihmdW5jdGlvbiAoc3RyZWFtKSB7XFxuICAgIGlmICghTWVkaWFSZWNvcmRlci5pc1R5cGVTdXBwb3J0ZWQoYXVkaW9NaW1lVHlwZSkpIHtcXG4gICAgICAvLyB1c2UgTVA0IGZvciBTYWZhcmlcXG4gICAgICBhdWRpb01pbWVUeXBlID0gJ2F1ZGlvL21wNCc7XFxuICAgIH1cXG4gICAgLy8gQ3JlYXRlIGEgbmV3IE1lZGlhUmVjb3JkZXIgb2JqZWN0IHVzaW5nIHRoZSBzdHJlYW0gYW5kIHNwZWNpZnlpbmcgdGhlIE1JTUUgdHlwZVxcbiAgICB2YXIgb3B0aW9ucyA9IHtcXG4gICAgICBtaW1lVHlwZTogYXVkaW9NaW1lVHlwZVxcbiAgICB9O1xcbiAgICBtZWRpYVJlY29yZGVyID0gbmV3IE1lZGlhUmVjb3JkZXIoc3RyZWFtLCBvcHRpb25zKTtcXG5cXG4gICAgLy8gTGlzdGVuIGZvciB0aGUgJ2RhdGFhdmFpbGFibGUnIGV2ZW50XFxuICAgIG1lZGlhUmVjb3JkZXIuYWRkRXZlbnRMaXN0ZW5lcignZGF0YWF2YWlsYWJsZScsIGhhbmRsZURhdGFBdmFpbGFibGUpO1xcblxcbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSAnc3RvcCcgZXZlbnRcXG4gICAgbWVkaWFSZWNvcmRlci5hZGRFdmVudExpc3RlbmVyKCdzdG9wJywgaGFuZGxlU3RvcCk7XFxuICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcXG4gICAgLy8gSW52b2tlIHRoZSBjYWxsYmFjayBmdW5jdGlvblxcbiAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XFxuICAgICAgY2FsbGJhY2soKTtcXG4gICAgfVxcbiAgfSlbXFxcImNhdGNoXFxcIl0oZnVuY3Rpb24gKGVycikge1xcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBnZXR0aW5nIGF1ZGlvIHN0cmVhbTogJyArIGVycik7XFxuICB9KTtcXG59XFxuZnVuY3Rpb24gdGVhckRvd25SZWNvcmRpbmcoKSB7XFxuICAvLyBDaGVjayBpZiB0aGUgTWVkaWFSZWNvcmRlciBpcyBzZXQgdXBcXG4gIGlmICghbWVkaWFSZWNvcmRlcikge1xcbiAgICByZXR1cm47XFxuICB9XFxuXFxuICAvLyBTdG9wIGFueSBvbmdvaW5nIHJlY29yZGluZ1xcbiAgaWYgKG1lZGlhUmVjb3JkZXIuc3RhdGUgPT09ICdyZWNvcmRpbmcnKSB7XFxuICAgIG1lZGlhUmVjb3JkZXIuc3RvcCgpO1xcbiAgfVxcblxcbiAgLy8gUmVtb3ZlIHRoZSBNZWRpYVJlY29yZGVyJ3MgZXZlbnQgbGlzdGVuZXJzXFxuICBtZWRpYVJlY29yZGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RhdGFhdmFpbGFibGUnLCBoYW5kbGVEYXRhQXZhaWxhYmxlKTtcXG4gIG1lZGlhUmVjb3JkZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignc3RvcCcsIGhhbmRsZVN0b3ApO1xcblxcbiAgLy8gQ2xlYXIgdGhlIE1lZGlhUmVjb3JkZXIgdmFyaWFibGVcXG4gIG1lZGlhUmVjb3JkZXIgPSBudWxsO1xcbn1cXG5cXG4vLyBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlIHVzZXIgcHJlc3NlcyB0aGUgcmVjb3JkIGJ1dHRvblxcbmZ1bmN0aW9uIHN0YXJ0UmVjb3JkaW5nKCkge1xcbiAgLy8gQ2hlY2sgaWYgdGhlIE1lZGlhUmVjb3JkZXIgaXMgc2V0IHVwXFxuICBpZiAoIW1lZGlhUmVjb3JkZXIpIHtcXG4gICAgc2V0dXBSZWNvcmRpbmcoc3RhcnRSZWNvcmRpbmcpO1xcbiAgICByZXR1cm47XFxuICB9XFxuXFxuICAvLyBTdGFydCByZWNvcmRpbmdcXG4gIG1lZGlhUmVjb3JkZXIuc3RhcnQoKTtcXG5cXG4gIC8vIFJlY29yZCB0aGUgc3RhcnQgdGltZVxcbiAgd2luZG93LnN0YXJ0VGltZSA9IERhdGUubm93KCk7XFxuICBjb25zb2xlLmxvZygnUmVjb3JkaW5nIHN0YXJ0ZWQnKTtcXG5cXG4gIC8vIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgdXNlciByZWxlYXNlcyB0aGUgcmVjb3JkIGJ1dHRvblxcbiAgd2luZG93LnN0b3BSZWNvcmRpbmcgPSBmdW5jdGlvbiAoKSB7XFxuICAgIGlmIChtZWRpYVJlY29yZGVyICYmIG1lZGlhUmVjb3JkZXIuc3RhdGUgPT09ICdyZWNvcmRpbmcnKSB7XFxuICAgICAgLy8gU3RvcCByZWNvcmRpbmdcXG4gICAgICBtZWRpYVJlY29yZGVyLnN0b3AoKTtcXG5cXG4gICAgICAvLyBSZWNvcmQgdGhlIHN0b3AgdGltZSBhbmQgY2FsY3VsYXRlIHRoZSBkdXJhdGlvblxcbiAgICAgIHZhciBzdG9wVGltZSA9IERhdGUubm93KCk7XFxuICAgICAgdmFyIGR1cmF0aW9uID0gc3RvcFRpbWUgLSB3aW5kb3cuc3RhcnRUaW1lO1xcblxcbiAgICAgIC8vIElmIHRoZSBkdXJhdGlvbiBpcyBsZXNzIHRoYW4gdGhlIHRocmVzaG9sZCwgZG9uJ3QgdXBsb2FkIHRoZSBhdWRpbyBmb3IgdHJhbnNjcmlwdGlvblxcbiAgICAgIGlmIChkdXJhdGlvbiA8IHRocmVzaG9sZCkge1xcbiAgICAgICAgY29uc29sZS5sb2coJ1JlY29yZGluZyB3YXMgdG9vIHNob3J0LCBub3QgdXBsb2FkaW5nIGZvciB0cmFuc2NyaXB0aW9uJyk7XFxuICAgICAgfSBlbHNlIHtcXG4gICAgICAgIGNvbnNvbGUubG9nKCdSZWNvcmRpbmcgc3RvcHBlZCcpO1xcbiAgICAgIH1cXG4gICAgfVxcbiAgICAvLyBSZW1vdmUgdGhlIHN0b3BSZWNvcmRpbmcgZnVuY3Rpb25cXG4gICAgZGVsZXRlIHdpbmRvdy5zdG9wUmVjb3JkaW5nO1xcbiAgfTtcXG59XFxuXFxuLy8gQWRkIHRoZSBzdGFydFJlY29yZGluZyBmdW5jdGlvbiB0byB0aGUgd2luZG93IG9iamVjdCBzbyBpdCBjYW4gYmUgY2FsbGVkIGZyb20gb3V0c2lkZSB0aGlzIHNjcmlwdFxcbndpbmRvdy5zdGFydFJlY29yZGluZyA9IHN0YXJ0UmVjb3JkaW5nO1wiOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gPT1Vc2VyU2NyaXB0PT1cbi8vIEBuYW1lICAgICAgICAgU2F5LCBQaVxuLy8gQG5hbWVzcGFjZSAgICBodHRwOi8vd3d3LnNheXBpLmFpL1xuLy8gQHZlcnNpb24gICAgICAxLjEuM1xuLy8gQGRlc2NyaXB0aW9uICBTcGVhayB0byBQaSB3aXRoIE9wZW5BSSdzIFdoaXNwZXJcbi8vIEBhdXRob3IgICAgICAgUm9zcyBDYWRvZ2FuXG4vLyBAbWF0Y2ggICAgICAgIGh0dHBzOi8vcGkuYWkvdGFsa1xuLy8gQGdyYW50ICAgICAgICBHTV94bWxodHRwUmVxdWVzdFxuLy8gQHVwZGF0ZVVSTCAgICBodHRwczovL2FwcC5zYXlwaS5haS9zYXlwaS51c2VyLmpzXG4vLyBAZG93bmxvYWRVUkwgIGh0dHBzOi8vYXBwLnNheXBpLmFpL3NheXBpLnVzZXIuanNcbi8vIEBsaWNlbnNlICAgICAgTUlUXG4vLyA9PS9Vc2VyU2NyaXB0PT1cblxuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBjb25zdCBsb2NhbENvbmZpZyA9IHtcbiAgICAgICAgYXBwU2VydmVyVXJsOiBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMFwiLFxuICAgICAgICBhcGlTZXJ2ZXJVcmw6IFwiaHR0cHM6Ly9sb2NhbGhvc3Q6NTAwMFwiLFxuICAgICAgICAvLyBBZGQgb3RoZXIgY29uZmlndXJhdGlvbiBwcm9wZXJ0aWVzIGFzIG5lZWRlZFxuICAgIH07XG5cbiAgICAvLyBEZWZpbmUgYSBnbG9iYWwgY29uZmlndXJhdGlvbiBwcm9wZXJ0eVxuICAgIGNvbnN0IHByb2R1Y3Rpb25Db25maWcgPSB7XG4gICAgICAgIGFwcFNlcnZlclVybDogXCJodHRwczovL2FwcC5zYXlwaS5haVwiLFxuICAgICAgICBhcGlTZXJ2ZXJVcmw6IFwiaHR0cHM6Ly9hcGkuc2F5cGkuYWlcIixcbiAgICAgICAgLy8gQWRkIG90aGVyIGNvbmZpZ3VyYXRpb24gcHJvcGVydGllcyBhcyBuZWVkZWRcbiAgICB9O1xuICAgIGNvbnN0IGNvbmZpZyA9IGxvY2FsQ29uZmlnO1xuXG4gICAgY29uc3QgcGFnZVNjcmlwdCA9IHJlcXVpcmUoJ3Jhdy1sb2FkZXIhLi90cmFuc2NyaWJlci5qcycpLmRlZmF1bHQ7XG5cbiAgICAvLyBDcmVhdGUgYSBNdXRhdGlvbk9ic2VydmVyIHRvIGxpc3RlbiBmb3IgY2hhbmdlcyB0byB0aGUgRE9NXG4gICAgdmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKG11dGF0aW9ucykge1xuICAgICAgICAvLyBDaGVjayBlYWNoIG11dGF0aW9uXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbXV0YXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbXV0YXRpb24gPSBtdXRhdGlvbnNbaV07XG5cbiAgICAgICAgICAgIC8vIElmIG5vZGVzIHdlcmUgYWRkZWQsIGNoZWNrIGVhY2ggb25lXG4gICAgICAgICAgICBpZiAobXV0YXRpb24uYWRkZWROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBtdXRhdGlvbi5hZGRlZE5vZGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBub2RlID0gbXV0YXRpb24uYWRkZWROb2Rlc1tqXTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgbm9kZSBpcyB0aGUgYXBwcm9wcmlhdGUgY29udGFpbmVyIGVsZW1lbnQsIGFkZCB0aGUgYnV0dG9uIGFuZCBzdG9wIG9ic2VydmluZ1xuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnZGl2JyAmJiBub2RlLmNsYXNzTGlzdC5jb250YWlucygnZml4ZWQnKSAmJiBub2RlLmNsYXNzTGlzdC5jb250YWlucygnYm90dG9tLTE2JykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmb290ZXIgPSBub2RlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGJ1dHRvbkNvbnRhaW5lciA9IGZvb3Rlci5xdWVyeVNlbGVjdG9yKCcucmVsYXRpdmUuZmxleC5mbGV4LWNvbCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJ1dHRvbkNvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZFRhbGtCdXR0b24oYnV0dG9uQ29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ05vIGJ1dHRvbiBjb250YWluZXIgZm91bmQgaW4gZm9vdGVyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGluamVjdFNjcmlwdChjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gaW5qZWN0U2NyaXB0TG9jYWwoY2FsbGJhY2spO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluamVjdFNjcmlwdFJlbW90ZShjYWxsYmFjaykge1xuICAgICAgICAvLyBHZXQgdGhlIFVSTCBvZiB0aGUgcmVtb3RlIHNjcmlwdFxuICAgICAgICB2YXIgcmVtb3RlU2NyaXB0VXJsID0gY29uZmlnLmFwcFNlcnZlclVybCArICd0cmFuc2NyaWJlci5qcyc7XG4gICAgICAgIEdNX3htbGh0dHBSZXF1ZXN0KHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgICAgICAgIHVybDogcmVtb3RlU2NyaXB0VXJsLFxuICAgICAgICAgICAgb25sb2FkOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2NyaXB0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgICAgICAgICAgc2NyaXB0RWxlbWVudC50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIjtcbiAgICAgICAgICAgICAgICBzY3JpcHRFbGVtZW50LmlkID0gJ3NheXBpLXNjcmlwdCc7XG4gICAgICAgICAgICAgICAgY29uc3QgY29uZmlnVGV4dCA9ICd2YXIgY29uZmlnID0gJyArIEpTT04uc3RyaW5naWZ5KGNvbmZpZykgKyAnOyc7XG4gICAgICAgICAgICAgICAgc2NyaXB0RWxlbWVudC50ZXh0Q29udGVudCA9IGNvbmZpZ1RleHQgKyByZXNwb25zZS5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHRFbGVtZW50KTtcblxuICAgICAgICAgICAgICAgIC8vIENhbGwgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIGFmdGVyIHRoZSBzY3JpcHQgaXMgYWRkZWRcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluamVjdFNjcmlwdExvY2FsKGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBzY3JpcHRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICAgICAgc2NyaXB0RWxlbWVudC50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIjtcbiAgICAgICAgc2NyaXB0RWxlbWVudC5pZCA9ICdzYXlwaS1zY3JpcHQnO1xuICAgICAgICBjb25zdCBjb25maWdUZXh0ID0gJ3ZhciBjb25maWcgPSAnICsgSlNPTi5zdHJpbmdpZnkoY29uZmlnKSArICc7JztcbiAgICAgICAgc2NyaXB0RWxlbWVudC50ZXh0Q29udGVudCA9IGNvbmZpZ1RleHQgKyBwYWdlU2NyaXB0O1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdEVsZW1lbnQpO1xuXG4gICAgICAgIC8vIENhbGwgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIGFmdGVyIHRoZSBzY3JpcHQgaXMgYWRkZWRcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBhZGRUYWxrQnV0dG9uKGNvbnRhaW5lcikge1xuICAgICAgICB2YXIgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgIGJ1dHRvbi5pZCA9ICd0YWxrQnV0dG9uJztcbiAgICAgICAgYnV0dG9uLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgICAgYnV0dG9uLmNsYXNzTmFtZSA9ICdyZWxhdGl2ZSBmbGV4IG10LTEgbWItMSByb3VuZGVkLWZ1bGwgcHgtMiBweS0zIHRleHQtY2VudGVyIGJnLWNyZWFtLTU1MCBob3ZlcjpiZy1jcmVhbS02NTAgaG92ZXI6dGV4dC1icmFuZC1ncmVlbi03MDAgdGV4dC1tdXRlZCc7XG4gICAgICAgIC8vIFNldCBBUklBIGxhYmVsIGFuZCB0b29sdGlwXG4gICAgICAgIGNvbnN0IGxhYmVsID0gJ1RhbGsgKEhvbGQgQ29udHJvbCArIFNwYWNlIHRvIHVzZSBob3RrZXkuIERvdWJsZSBjbGljayB0byB0b2dnbGUgYXV0by1zdWJtaXQgb24vb2ZmKSdcbiAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGxhYmVsKTtcbiAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgndGl0bGUnLCBsYWJlbCk7XG4gICAgICAgIC8vIGVuYWJsZSBhdXRvc3VibWl0IGJ5IGRlZmF1bHRcbiAgICAgICAgYnV0dG9uLmRhdGFzZXQuYXV0b3N1Ym1pdCA9ICd0cnVlJztcbiAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2F1dG9TdWJtaXQnKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gICAgICAgIGFkZFRhbGtCdXR0b25TdHlsZXMoKTtcbiAgICAgICAgYWRkVGFsa0ljb24oYnV0dG9uKTtcblxuICAgICAgICAvLyBDYWxsIHRoZSBmdW5jdGlvbiB0byBpbmplY3QgdGhlIHNjcmlwdCBhZnRlciB0aGUgYnV0dG9uIGhhcyBiZWVuIGFkZGVkXG4gICAgICAgIGluamVjdFNjcmlwdChyZWdpc3RlckF1ZGlvQnV0dG9uRXZlbnRzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRUYWxrSWNvbihidXR0b24pIHtcbiAgICAgICAgdmFyIGljb25IdG1sID0gYFxuICAgICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2ZXJzaW9uPVwiMS4wXCIgdmlld0JveD1cIjAgMCA1Ni4yNSAzMFwiIGNsYXNzPVwid2F2ZWZvcm1cIj5cbiAgICAgICAgPGRlZnM+XG4gICAgICAgICAgICA8Y2xpcFBhdGggaWQ9XCJhXCI+XG4gICAgICAgICAgICAgICAgPHBhdGggZD1cIk0uNTQgMTJIM3Y1SC41NFptMCAwXCIvPlxuICAgICAgICAgICAgPC9jbGlwUGF0aD5cbiAgICAgICAgICAgIDxjbGlwUGF0aCBpZD1cImJcIj5cbiAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTI1IDIuMmgydjI0LjY4aC0yWm0wIDBcIi8+XG4gICAgICAgICAgICA8L2NsaXBQYXRoPlxuICAgICAgICAgICAgPGNsaXBQYXRoIGlkPVwiY1wiPlxuICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNNTMgMTJoMS45OHY1SDUzWm0wIDBcIi8+XG4gICAgICAgICAgICA8L2NsaXBQYXRoPlxuICAgICAgICA8L2RlZnM+XG4gICAgICAgIDxnIGNsaXAtcGF0aD1cInVybCgjYSlcIj5cbiAgICAgICAgICAgIDxwYXRoIGQ9XCJNMS40OCAxMi43MWMtLjUgMC0uOS40LS45Ljl2MS44NWEuOS45IDAgMCAwIDEuOCAwdi0xLjg0YzAtLjUtLjQtLjktLjktLjlabTAgMFwiLz5cbiAgICAgICAgPC9nPlxuICAgICAgICA8cGF0aCBkPVwiTTQuOTggNi42M2MtLjUgMC0uOS40LS45Ljl2MTQuMDFhLjkuOSAwIDAgMCAxLjgxIDB2LTE0YzAtLjUtLjQtLjkyLS45LS45MlptMy41MSAzLjFhLjkuOSAwIDAgMC0uOS45MXY3Ljc5YS45LjkgMCAwIDAgMS44IDB2LTcuNzljMC0uNS0uNC0uOS0uOS0uOVpNMTIgMy44M2EuOS45IDAgMCAwLS45MS45djE5LjZhLjkuOSAwIDAgMCAxLjggMFY0Ljc0YzAtLjUtLjQtLjktLjktLjlabTMuNSA4LjI5YS45LjkgMCAwIDAtLjkxLjl2My4wM2EuOS45IDAgMCAwIDEuODEgMHYtMy4wM2MwLS41LS40LS45LS45LS45Wk0xOSA2LjhjLS41IDAtLjkuNC0uOS45djEzLjY4YS45LjkgMCAwIDAgMS44IDBWNy43YzAtLjUtLjQtLjktLjktLjlabTMuNTgtMi45N2gtLjAxYy0uNSAwLS45LjQtLjkuOWwtLjEzIDE5LjZjMCAuNS40LjkuOS45MS41IDAgLjktLjQuOS0uOWwuMTQtMTkuNmEuOS45IDAgMCAwLS45LS45Wm0wIDBcIi8+XG4gICAgICAgIDxnIGNsaXAtcGF0aD1cInVybCgjYilcIj5cbiAgICAgICAgICAgIDxwYXRoIGQ9XCJNMjYgMi4yYy0uNSAwLS45LjQtLjkuOXYyMi44NmEuOS45IDAgMSAwIDEuODEgMFYzLjExYS45LjkgMCAwIDAtLjktLjkxWm0wIDBcIi8+XG4gICAgICAgIDwvZz5cbiAgICAgICAgPHBhdGggZD1cIk0yOS41MiA3LjcxYS45LjkgMCAwIDAtLjkxLjl2MTEuODVhLjkuOSAwIDAgMCAxLjgxIDBWOC42MmMwLS41LS40LS45LS45LS45Wm0zLjUgMi45M2EuOS45IDAgMCAwLS45LjkxdjUuOTdhLjkuOSAwIDAgMCAxLjggMHYtNS45N2MwLS41LS40LS45LS45LS45Wm0zLjUtNS43OGMtLjUgMC0uOS40LS45Ljl2MTcuNTVhLjkuOSAwIDAgMCAxLjgxIDBWNS43NmMwLS41LS40LS45LS45LS45Wm0zLjUxIDMuMzRjLS41IDAtLjkuNC0uOS45djEwLjg3YS45LjkgMCAwIDAgMS44IDBWOS4xYS45LjkgMCAwIDAtLjktLjkxWm0zLjUgMy4wOGMtLjUgMC0uOS40LS45LjkxdjQuN2EuOS45IDAgMSAwIDEuOCAwdi00LjdhLjkuOSAwIDAgMC0uOS0uOVptMy41MS03LjQ1YS45LjkgMCAwIDAtLjkxLjl2MTkuNmEuOS45IDAgMCAwIDEuODEgMFY0Ljc0YzAtLjUtLjQtLjktLjktLjlabTMuNSA1LjU3YS45LjkgMCAwIDAtLjkuOTF2OC40NWEuOS45IDAgMCAwIDEuOCAwdi04LjQ1YzAtLjUtLjQtLjktLjktLjlabTAgMFwiLz5cbiAgICAgICAgPGcgY2xpcC1wYXRoPVwidXJsKCNjKVwiPlxuICAgICAgICAgICAgPHBhdGggZD1cIk01NC4wNCAxMi45NmEuOS45IDAgMCAwLS45LjkxdjEuMzNhLjkuOSAwIDEgMCAxLjggMHYtMS4zMmEuOS45IDAgMCAwLS45LS45MlptMCAwXCIvPlxuICAgICAgICA8L2c+XG4gICAgPC9zdmc+XG4gICAgXG4gICAgICAgIGA7XG4gICAgICAgIHZhciBpY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdzdmcnKTtcbiAgICAgICAgYnV0dG9uLmFwcGVuZENoaWxkKGljb24pO1xuICAgICAgICBpY29uLm91dGVySFRNTCA9IGljb25IdG1sO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFN0eWxlcyhjc3MpIHtcbiAgICAgICAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgICAgICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFRhbGtCdXR0b25TdHlsZXMoKSB7XG4gICAgICAgIC8vIEdldCB0aGUgYnV0dG9uIGFuZCByZWdpc3RlciBmb3IgbW91c2Vkb3duIGFuZCBtb3VzZXVwIGV2ZW50c1xuICAgICAgICB2YXIgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhbGtCdXR0b24nKTtcbiAgICAgICAgLy8gYnV0dG9uIGFuaW1hdGlvblxuICAgICAgICBhZGRTdHlsZXMoYFxuICAgICAgICAgICAgQGtleWZyYW1lcyBwdWxzZSB7XG4gICAgICAgICAgICAgICAgMCUge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA1MCUge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDEwMCUge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICN0YWxrQnV0dG9uIHtcbiAgICAgICAgICAgICAgICBtYXJnaW4tdG9wOiAwLjI1cmVtO1xuICAgICAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE4cHg7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDEyMHB4O1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrOyAvKiBGb3IgU2FmYXJpICovXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICN0YWxrQnV0dG9uOmFjdGl2ZSAud2F2ZWZvcm0sICN0YWxrQnV0dG9uLmFjdGl2ZSAud2F2ZWZvcm0ge1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogcHVsc2UgMXMgaW5maW5pdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAjdGFsa0J1dHRvbiAud2F2ZWZvcm0ge1xuICAgICAgICAgICAgICAgIGZpbGw6ICM3NzZkNmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAjdGFsa0J1dHRvbi5hdXRvU3VibWl0IC53YXZlZm9ybSB7XG4gICAgICAgICAgICAgICAgZmlsbDogcmdiKDY1IDEzOCA0Nyk7IC8qIFBpJ3MgdGV4dC1icmFuZC1ncmVlbi02MDAgKi9cbiAgICAgICAgICAgIH1cbiAgICAgICAgYCk7XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWdpc3RlckF1ZGlvQnV0dG9uRXZlbnRzKCkge1xuICAgICAgICB2YXIgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhbGtCdXR0b24nKTtcblxuICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWRQcm9tcHRUZXh0QXJlYSgpO1xuICAgICAgICAgICAgdW5zYWZlV2luZG93LnN0YXJ0UmVjb3JkaW5nKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHVuc2FmZVdpbmRvdy5zdG9wUmVjb3JkaW5nKCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZWdpc3RlckhvdGtleSgpO1xuXG4gICAgICAgIC8vIFwid2FybSB1cFwiIHRoZSBtaWNyb3Bob25lIGJ5IGFjcXVpcmluZyBpdCBiZWZvcmUgdGhlIHVzZXIgcHJlc3NlcyB0aGUgYnV0dG9uXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWxrQnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIHNldHVwUmVjb3JkaW5nKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhbGtCdXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgdGVhckRvd25SZWNvcmRpbmcpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmVmb3JldW5sb2FkJywgdGVhckRvd25SZWNvcmRpbmcpO1xuXG4gICAgICAgIC8vIEF0dGFjaCBhIGRvdWJsZSBjbGljayBldmVudCBsaXN0ZW5lciB0byB0aGUgdGFsayBidXR0b25cbiAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gVG9nZ2xlIHRoZSBDU1MgY2xhc3NlcyB0byBpbmRpY2F0ZSB0aGUgbW9kZVxuICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoJ2F1dG9TdWJtaXQnKTtcblxuICAgICAgICAgICAgLy8gU3RvcmUgdGhlIHN0YXRlIG9uIHRoZSBidXR0b24gZWxlbWVudCB1c2luZyBhIGN1c3RvbSBkYXRhIGF0dHJpYnV0ZVxuICAgICAgICAgICAgaWYgKGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXV0b3N1Ym1pdCcpID09PSAndHJ1ZScpIHtcbiAgICAgICAgICAgICAgICBidXR0b24uc2V0QXR0cmlidXRlKCdkYXRhLWF1dG9zdWJtaXQnLCAnZmFsc2UnKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnYXV0b3N1Ym1pdCBkaXNhYmxlZCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBidXR0b24uc2V0QXR0cmlidXRlKCdkYXRhLWF1dG9zdWJtaXQnLCAndHJ1ZScpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhdXRvc3VibWl0IGVuYWJsZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWdpc3RlckhvdGtleSgpIHtcbiAgICAgICAgLy8gUmVnaXN0ZXIgYSBob3RrZXkgZm9yIHRoZSBidXR0b25cbiAgICAgICAgbGV0IGN0cmxEb3duID0gZmFsc2U7XG5cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LmN0cmxLZXkgJiYgZXZlbnQuY29kZSA9PT0gJ1NwYWNlJyAmJiAhY3RybERvd24pIHtcbiAgICAgICAgICAgICAgICBjdHJsRG93biA9IHRydWU7XG4gICAgICAgICAgICAgICAgLy8gU2ltdWxhdGUgbW91c2Vkb3duIGV2ZW50XG4gICAgICAgICAgICAgICAgbGV0IG1vdXNlRG93bkV2ZW50ID0gbmV3IEV2ZW50KCdtb3VzZWRvd24nKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFsa0J1dHRvbicpLmRpc3BhdGNoRXZlbnQobW91c2VEb3duRXZlbnQpO1xuICAgICAgICAgICAgICAgIHRhbGtCdXR0b24uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7IC8vIEFkZCB0aGUgYWN0aXZlIGNsYXNzXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoY3RybERvd24gJiYgZXZlbnQuY29kZSA9PT0gJ1NwYWNlJykge1xuICAgICAgICAgICAgICAgIGN0cmxEb3duID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgLy8gU2ltdWxhdGUgbW91c2V1cCBldmVudFxuICAgICAgICAgICAgICAgIGxldCBtb3VzZVVwRXZlbnQgPSBuZXcgRXZlbnQoJ21vdXNldXAnKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFsa0J1dHRvbicpLmRpc3BhdGNoRXZlbnQobW91c2VVcEV2ZW50KTtcbiAgICAgICAgICAgICAgICB0YWxrQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIGlkUHJvbXB0VGV4dEFyZWEoKSB7XG4gICAgICAgIHZhciB0ZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9tcHQnKTtcbiAgICAgICAgaWYgKCF0ZXh0YXJlYSkge1xuICAgICAgICAgICAgLy8gRmluZCB0aGUgZmlyc3QgPHRleHRhcmVhPiBlbGVtZW50IGFuZCBnaXZlIGl0IGFuIGlkXG4gICAgICAgICAgICB2YXIgdGV4dGFyZWFFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcigndGV4dGFyZWEnKTtcbiAgICAgICAgICAgIGlmICh0ZXh0YXJlYUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0ZXh0YXJlYUVsZW1lbnQuaWQgPSAncHJvbXB0JztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ05vIDx0ZXh0YXJlYT4gZWxlbWVudCBmb3VuZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gU3RhcnQgb2JzZXJ2aW5nIHRoZSBlbnRpcmUgZG9jdW1lbnQgZm9yIGNoYW5nZXMgdG8gY2hpbGQgbm9kZXMgYW5kIHN1YnRyZWVcbiAgICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LCB7IGNoaWxkTGlzdDogdHJ1ZSwgc3VidHJlZTogdHJ1ZSB9KTtcbn0pKCk7XG4iXSwibmFtZXMiOlsibG9jYWxDb25maWciLCJhcHBTZXJ2ZXJVcmwiLCJhcGlTZXJ2ZXJVcmwiLCJwcm9kdWN0aW9uQ29uZmlnIiwiY29uZmlnIiwicGFnZVNjcmlwdCIsInJlcXVpcmUiLCJvYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJtdXRhdGlvbnMiLCJpIiwibGVuZ3RoIiwibXV0YXRpb24iLCJhZGRlZE5vZGVzIiwiaiIsIm5vZGUiLCJub2RlTmFtZSIsInRvTG93ZXJDYXNlIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJmb290ZXIiLCJidXR0b25Db250YWluZXIiLCJxdWVyeVNlbGVjdG9yIiwiYWRkVGFsa0J1dHRvbiIsImNvbnNvbGUiLCJsb2ciLCJkaXNjb25uZWN0IiwiaW5qZWN0U2NyaXB0IiwiY2FsbGJhY2siLCJpbmplY3RTY3JpcHRMb2NhbCIsImluamVjdFNjcmlwdFJlbW90ZSIsInJlbW90ZVNjcmlwdFVybCIsIkdNX3htbGh0dHBSZXF1ZXN0IiwibWV0aG9kIiwidXJsIiwib25sb2FkIiwicmVzcG9uc2UiLCJzY3JpcHRFbGVtZW50IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwidHlwZSIsImlkIiwiY29uZmlnVGV4dCIsIkpTT04iLCJzdHJpbmdpZnkiLCJ0ZXh0Q29udGVudCIsInJlc3BvbnNlVGV4dCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsImNvbnRhaW5lciIsImJ1dHRvbiIsImNsYXNzTmFtZSIsImxhYmVsIiwic2V0QXR0cmlidXRlIiwiZGF0YXNldCIsImF1dG9zdWJtaXQiLCJhZGQiLCJhZGRUYWxrQnV0dG9uU3R5bGVzIiwiYWRkVGFsa0ljb24iLCJyZWdpc3RlckF1ZGlvQnV0dG9uRXZlbnRzIiwiaWNvbkh0bWwiLCJpY29uIiwiY3JlYXRlRWxlbWVudE5TIiwib3V0ZXJIVE1MIiwiYWRkU3R5bGVzIiwiY3NzIiwic3R5bGUiLCJjcmVhdGVUZXh0Tm9kZSIsImhlYWQiLCJnZXRFbGVtZW50QnlJZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJpZFByb21wdFRleHRBcmVhIiwidW5zYWZlV2luZG93Iiwic3RhcnRSZWNvcmRpbmciLCJzdG9wUmVjb3JkaW5nIiwicmVnaXN0ZXJIb3RrZXkiLCJzZXR1cFJlY29yZGluZyIsInRlYXJEb3duUmVjb3JkaW5nIiwid2luZG93IiwidG9nZ2xlIiwiZ2V0QXR0cmlidXRlIiwiY3RybERvd24iLCJldmVudCIsImN0cmxLZXkiLCJjb2RlIiwibW91c2VEb3duRXZlbnQiLCJFdmVudCIsImRpc3BhdGNoRXZlbnQiLCJ0YWxrQnV0dG9uIiwibW91c2VVcEV2ZW50IiwicmVtb3ZlIiwidGV4dGFyZWEiLCJ0ZXh0YXJlYUVsZW1lbnQiLCJvYnNlcnZlIiwiY2hpbGRMaXN0Iiwic3VidHJlZSJdLCJzb3VyY2VSb290IjoiIn0=