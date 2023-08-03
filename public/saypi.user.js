// ==UserScript==
// @name         Say, Pi
// @namespace    http://www.saypi.ai/
// @version      1.2
// @description  Speak to Pi with OpenAI's Whisper
// @author       Ross Cadogan
// @match        https://pi.ai/talk
// @inject-into  page
// @updateURL    https://www.saypi.ai/saypi.user.js
// @downloadURL  https://www.saypi.ai/saypi.user.js
// @license      MIT
// ==/UserScript==
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("var audioDataChunks = [];\nvar audioMimeType = 'audio/webm;codecs=opus';\nfunction uploadAudio(audioBlob) {\n  // Create a FormData object\n  var formData = new FormData();\n  var audioFilename = 'audio.webm';\n  if (audioBlob.type === 'audio/mp4') {\n    audioFilename = 'audio.mp4';\n  }\n  // Add the audio blob to the FormData object\n  formData.append('audio', audioBlob, audioFilename);\n  // Get the user's preferred language\n  var language = navigator.language;\n  // Post the audio to the server for transcription\n  fetch(config.apiServerUrl + '/transcribe?language=' + language, {\n    method: 'POST',\n    body: formData\n  }).then(function (response) {\n    if (!response.ok) {\n      throw Error(response.statusText);\n    }\n    return response.json();\n  }).then(handleTranscriptionResponse)[\"catch\"](function (error) {\n    console.error('Looks like there was a problem: ', error);\n    var textarea = document.getElementById('prompt');\n    textarea.value = 'Sorry, there was a problem transcribing your audio. Please try again later.';\n  });\n}\nfunction handleTranscriptionResponse(responseJson) {\n  var textarea = document.getElementById('prompt');\n  simulateTyping(textarea, responseJson.text + \" \");\n  console.log('Speaker: ' + responseJson.text);\n}\nfunction setNativeValue(element, value) {\n  var lastValue = element.value;\n  element.value = value;\n  var event = new Event(\"input\", {\n    target: element,\n    bubbles: true\n  });\n  // React 15\n  event.simulated = true;\n  // React 16-17\n  var tracker = element._valueTracker;\n  if (tracker) {\n    tracker.setValue(lastValue);\n  }\n  element.dispatchEvent(event);\n}\nfunction simulateFormSubmit(textarea) {\n  var enterEvent = new KeyboardEvent('keydown', {\n    bubbles: true,\n    key: 'Enter',\n    keyCode: 13,\n    which: 13\n  });\n  textarea.dispatchEvent(enterEvent);\n}\nfunction simulateTyping(element, text) {\n  var words = text.split(' '); // Split the text into words (may not be ideal for all languages)\n  var i = 0;\n  function typeWord() {\n    if (i < words.length) {\n      // Append the next word and a space, then increment i\n      setNativeValue(element, element.value + words[i++] + ' ');\n      // Call this function again before the next repaint\n      requestAnimationFrame(typeWord);\n    } else {\n      // Check if autosubmit is enabled\n      var talkButton = document.getElementById('talkButton');\n      if (talkButton.dataset.autosubmit === 'false') {\n        console.log('Autosubmit is disabled');\n      } else {\n        // Simulate an \"Enter\" keypress event\n        simulateFormSubmit(element);\n      }\n    }\n  }\n  // Start typing\n  typeWord();\n}\n\n// Declare a global variable for the mediaRecorder\nvar mediaRecorder;\nvar threshold = 1000; // 1000 ms = 1 second, about the length of \"Hey, Pi\"\n\n// This function will be called when the 'dataavailable' event fires\nfunction handleDataAvailable(e) {\n  // Add the audio data chunk to the array\n  audioDataChunks.push(e.data);\n}\n\n// This function will be called when the 'stop' event fires\nfunction handleStop() {\n  // Create a Blob from the audio data chunks\n  var audioBlob = new Blob(audioDataChunks, {\n    type: audioMimeType\n  });\n\n  // Get the stop time and calculate the duration\n  var stopTime = Date.now();\n  var duration = stopTime - window.startTime;\n\n  // If the duration is greater than the threshold, upload the audio for transcription\n  if (duration >= threshold) {\n    // download the audio\n    var url = URL.createObjectURL(audioBlob);\n    var a = document.createElement('a');\n    a.style.display = 'none';\n    a.href = url;\n    a.download = 'safari_audio.mp4';\n    document.body.appendChild(a);\n    // a.click();\n    // Upload the audio to the server for transcription\n    uploadAudio(audioBlob);\n  }\n\n  // Clear the array for the next recording\n  audioDataChunks = [];\n}\nfunction setupRecording(callback) {\n  if (mediaRecorder) {\n    return;\n  }\n\n  // Get a stream from the user's microphone\n  navigator.mediaDevices.getUserMedia({\n    audio: true\n  }).then(function (stream) {\n    if (!MediaRecorder.isTypeSupported(audioMimeType)) {\n      // use MP4 for Safari\n      audioMimeType = 'audio/mp4';\n    }\n    // Create a new MediaRecorder object using the stream and specifying the MIME type\n    var options = {\n      mimeType: audioMimeType\n    };\n    mediaRecorder = new MediaRecorder(stream, options);\n\n    // Listen for the 'dataavailable' event\n    mediaRecorder.addEventListener('dataavailable', handleDataAvailable);\n\n    // Listen for the 'stop' event\n    mediaRecorder.addEventListener('stop', handleStop);\n  }).then(function () {\n    // Invoke the callback function\n    if (typeof callback === 'function') {\n      callback();\n    }\n  })[\"catch\"](function (err) {\n    console.error('Error getting audio stream: ' + err);\n  });\n}\nfunction tearDownRecording() {\n  // Check if the MediaRecorder is set up\n  if (!mediaRecorder) {\n    return;\n  }\n\n  // Stop any ongoing recording\n  if (mediaRecorder.state === 'recording') {\n    mediaRecorder.stop();\n  }\n\n  // Remove the MediaRecorder's event listeners\n  mediaRecorder.removeEventListener('dataavailable', handleDataAvailable);\n  mediaRecorder.removeEventListener('stop', handleStop);\n\n  // Clear the MediaRecorder variable\n  mediaRecorder = null;\n}\n\n// This function will be called when the user presses the record button\nfunction startRecording() {\n  // Check if the MediaRecorder is set up\n  if (!mediaRecorder) {\n    setupRecording(startRecording);\n    return;\n  }\n\n  // Start recording\n  mediaRecorder.start();\n\n  // Record the start time\n  window.startTime = Date.now();\n  console.log('Recording started');\n\n  // This function will be called when the user releases the record button\n  window.stopRecording = function () {\n    if (mediaRecorder && mediaRecorder.state === 'recording') {\n      // Stop recording\n      mediaRecorder.stop();\n\n      // Record the stop time and calculate the duration\n      var stopTime = Date.now();\n      var duration = stopTime - window.startTime;\n\n      // If the duration is less than the threshold, don't upload the audio for transcription\n      if (duration < threshold) {\n        console.log('Recording was too short, not uploading for transcription');\n      } else {\n        console.log('Recording stopped');\n      }\n    }\n    // Remove the stopRecording function\n    delete window.stopRecording;\n  };\n}\n\n// Add the startRecording function to the window object so it can be called from outside this script\nwindow.startRecording = startRecording;");

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


    (function () {
      'use strict';

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
        var context = window;
        if (GM_info.scriptHandler !== 'Userscripts') {
          context = unsafeWindow;
        }

        // For desktop
        button.addEventListener('mousedown', function () {
          idPromptTextArea();
          context.startRecording();
        });
        button.addEventListener('mouseup', function () {
          context.stopRecording();
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

        // For mobile
        button.addEventListener('touchstart', function (e) {
          e.preventDefault(); // Prevent the default click behavior from happening
          idPromptTextArea();
          context.startRecording();
        });
        button.addEventListener('touchend', function () {
          context.stopRecording();
        });
        document.getElementById('talkButton').addEventListener('touchcancel', tearDownRecording);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FBQ1IsYUFBYSxDQUFDLFVBQVUsQ0FBQztNQUN4RCxJQUFJa0UsZUFBZSxFQUFFO1FBQ2pCQSxlQUFlLENBQUN2RCxFQUFFLEdBQUcsUUFBUTtNQUNqQyxDQUFDLE1BQU07UUFDSFQsT0FBTyxDQUFDQyxHQUFHLENBQUMsNkJBQTZCLENBQUM7TUFDOUM7SUFDSjtFQUNKOztFQUVBO0VBQ0FsQixRQUFRLENBQUNrRixPQUFPLENBQUMzRCxRQUFRLEVBQUU7SUFBRTRELFNBQVMsRUFBRSxJQUFJO0lBQUVDLE9BQU8sRUFBRTtFQUFLLENBQUMsQ0FBQztBQUNsRSxDQUFDLEVBQUUsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy90cmFuc2NyaWJlci5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9zYXlwaS5pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBcInZhciBhdWRpb0RhdGFDaHVua3MgPSBbXTtcXG52YXIgYXVkaW9NaW1lVHlwZSA9ICdhdWRpby93ZWJtO2NvZGVjcz1vcHVzJztcXG5mdW5jdGlvbiB1cGxvYWRBdWRpbyhhdWRpb0Jsb2IpIHtcXG4gIC8vIENyZWF0ZSBhIEZvcm1EYXRhIG9iamVjdFxcbiAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XFxuICB2YXIgYXVkaW9GaWxlbmFtZSA9ICdhdWRpby53ZWJtJztcXG4gIGlmIChhdWRpb0Jsb2IudHlwZSA9PT0gJ2F1ZGlvL21wNCcpIHtcXG4gICAgYXVkaW9GaWxlbmFtZSA9ICdhdWRpby5tcDQnO1xcbiAgfVxcbiAgLy8gQWRkIHRoZSBhdWRpbyBibG9iIHRvIHRoZSBGb3JtRGF0YSBvYmplY3RcXG4gIGZvcm1EYXRhLmFwcGVuZCgnYXVkaW8nLCBhdWRpb0Jsb2IsIGF1ZGlvRmlsZW5hbWUpO1xcbiAgLy8gR2V0IHRoZSB1c2VyJ3MgcHJlZmVycmVkIGxhbmd1YWdlXFxuICB2YXIgbGFuZ3VhZ2UgPSBuYXZpZ2F0b3IubGFuZ3VhZ2U7XFxuICAvLyBQb3N0IHRoZSBhdWRpbyB0byB0aGUgc2VydmVyIGZvciB0cmFuc2NyaXB0aW9uXFxuICBmZXRjaChjb25maWcuYXBpU2VydmVyVXJsICsgJy90cmFuc2NyaWJlP2xhbmd1YWdlPScgKyBsYW5ndWFnZSwge1xcbiAgICBtZXRob2Q6ICdQT1NUJyxcXG4gICAgYm9keTogZm9ybURhdGFcXG4gIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XFxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcXG4gICAgICB0aHJvdyBFcnJvcihyZXNwb25zZS5zdGF0dXNUZXh0KTtcXG4gICAgfVxcbiAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xcbiAgfSkudGhlbihoYW5kbGVUcmFuc2NyaXB0aW9uUmVzcG9uc2UpW1xcXCJjYXRjaFxcXCJdKGZ1bmN0aW9uIChlcnJvcikge1xcbiAgICBjb25zb2xlLmVycm9yKCdMb29rcyBsaWtlIHRoZXJlIHdhcyBhIHByb2JsZW06ICcsIGVycm9yKTtcXG4gICAgdmFyIHRleHRhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb21wdCcpO1xcbiAgICB0ZXh0YXJlYS52YWx1ZSA9ICdTb3JyeSwgdGhlcmUgd2FzIGEgcHJvYmxlbSB0cmFuc2NyaWJpbmcgeW91ciBhdWRpby4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlci4nO1xcbiAgfSk7XFxufVxcbmZ1bmN0aW9uIGhhbmRsZVRyYW5zY3JpcHRpb25SZXNwb25zZShyZXNwb25zZUpzb24pIHtcXG4gIHZhciB0ZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9tcHQnKTtcXG4gIHNpbXVsYXRlVHlwaW5nKHRleHRhcmVhLCByZXNwb25zZUpzb24udGV4dCArIFxcXCIgXFxcIik7XFxuICBjb25zb2xlLmxvZygnU3BlYWtlcjogJyArIHJlc3BvbnNlSnNvbi50ZXh0KTtcXG59XFxuZnVuY3Rpb24gc2V0TmF0aXZlVmFsdWUoZWxlbWVudCwgdmFsdWUpIHtcXG4gIHZhciBsYXN0VmFsdWUgPSBlbGVtZW50LnZhbHVlO1xcbiAgZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xcbiAgdmFyIGV2ZW50ID0gbmV3IEV2ZW50KFxcXCJpbnB1dFxcXCIsIHtcXG4gICAgdGFyZ2V0OiBlbGVtZW50LFxcbiAgICBidWJibGVzOiB0cnVlXFxuICB9KTtcXG4gIC8vIFJlYWN0IDE1XFxuICBldmVudC5zaW11bGF0ZWQgPSB0cnVlO1xcbiAgLy8gUmVhY3QgMTYtMTdcXG4gIHZhciB0cmFja2VyID0gZWxlbWVudC5fdmFsdWVUcmFja2VyO1xcbiAgaWYgKHRyYWNrZXIpIHtcXG4gICAgdHJhY2tlci5zZXRWYWx1ZShsYXN0VmFsdWUpO1xcbiAgfVxcbiAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcXG59XFxuZnVuY3Rpb24gc2ltdWxhdGVGb3JtU3VibWl0KHRleHRhcmVhKSB7XFxuICB2YXIgZW50ZXJFdmVudCA9IG5ldyBLZXlib2FyZEV2ZW50KCdrZXlkb3duJywge1xcbiAgICBidWJibGVzOiB0cnVlLFxcbiAgICBrZXk6ICdFbnRlcicsXFxuICAgIGtleUNvZGU6IDEzLFxcbiAgICB3aGljaDogMTNcXG4gIH0pO1xcbiAgdGV4dGFyZWEuZGlzcGF0Y2hFdmVudChlbnRlckV2ZW50KTtcXG59XFxuZnVuY3Rpb24gc2ltdWxhdGVUeXBpbmcoZWxlbWVudCwgdGV4dCkge1xcbiAgdmFyIHdvcmRzID0gdGV4dC5zcGxpdCgnICcpOyAvLyBTcGxpdCB0aGUgdGV4dCBpbnRvIHdvcmRzIChtYXkgbm90IGJlIGlkZWFsIGZvciBhbGwgbGFuZ3VhZ2VzKVxcbiAgdmFyIGkgPSAwO1xcbiAgZnVuY3Rpb24gdHlwZVdvcmQoKSB7XFxuICAgIGlmIChpIDwgd29yZHMubGVuZ3RoKSB7XFxuICAgICAgLy8gQXBwZW5kIHRoZSBuZXh0IHdvcmQgYW5kIGEgc3BhY2UsIHRoZW4gaW5jcmVtZW50IGlcXG4gICAgICBzZXROYXRpdmVWYWx1ZShlbGVtZW50LCBlbGVtZW50LnZhbHVlICsgd29yZHNbaSsrXSArICcgJyk7XFxuICAgICAgLy8gQ2FsbCB0aGlzIGZ1bmN0aW9uIGFnYWluIGJlZm9yZSB0aGUgbmV4dCByZXBhaW50XFxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHR5cGVXb3JkKTtcXG4gICAgfSBlbHNlIHtcXG4gICAgICAvLyBDaGVjayBpZiBhdXRvc3VibWl0IGlzIGVuYWJsZWRcXG4gICAgICB2YXIgdGFsa0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWxrQnV0dG9uJyk7XFxuICAgICAgaWYgKHRhbGtCdXR0b24uZGF0YXNldC5hdXRvc3VibWl0ID09PSAnZmFsc2UnKSB7XFxuICAgICAgICBjb25zb2xlLmxvZygnQXV0b3N1Ym1pdCBpcyBkaXNhYmxlZCcpO1xcbiAgICAgIH0gZWxzZSB7XFxuICAgICAgICAvLyBTaW11bGF0ZSBhbiBcXFwiRW50ZXJcXFwiIGtleXByZXNzIGV2ZW50XFxuICAgICAgICBzaW11bGF0ZUZvcm1TdWJtaXQoZWxlbWVudCk7XFxuICAgICAgfVxcbiAgICB9XFxuICB9XFxuICAvLyBTdGFydCB0eXBpbmdcXG4gIHR5cGVXb3JkKCk7XFxufVxcblxcbi8vIERlY2xhcmUgYSBnbG9iYWwgdmFyaWFibGUgZm9yIHRoZSBtZWRpYVJlY29yZGVyXFxudmFyIG1lZGlhUmVjb3JkZXI7XFxudmFyIHRocmVzaG9sZCA9IDEwMDA7IC8vIDEwMDAgbXMgPSAxIHNlY29uZCwgYWJvdXQgdGhlIGxlbmd0aCBvZiBcXFwiSGV5LCBQaVxcXCJcXG5cXG4vLyBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlICdkYXRhYXZhaWxhYmxlJyBldmVudCBmaXJlc1xcbmZ1bmN0aW9uIGhhbmRsZURhdGFBdmFpbGFibGUoZSkge1xcbiAgLy8gQWRkIHRoZSBhdWRpbyBkYXRhIGNodW5rIHRvIHRoZSBhcnJheVxcbiAgYXVkaW9EYXRhQ2h1bmtzLnB1c2goZS5kYXRhKTtcXG59XFxuXFxuLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSAnc3RvcCcgZXZlbnQgZmlyZXNcXG5mdW5jdGlvbiBoYW5kbGVTdG9wKCkge1xcbiAgLy8gQ3JlYXRlIGEgQmxvYiBmcm9tIHRoZSBhdWRpbyBkYXRhIGNodW5rc1xcbiAgdmFyIGF1ZGlvQmxvYiA9IG5ldyBCbG9iKGF1ZGlvRGF0YUNodW5rcywge1xcbiAgICB0eXBlOiBhdWRpb01pbWVUeXBlXFxuICB9KTtcXG5cXG4gIC8vIEdldCB0aGUgc3RvcCB0aW1lIGFuZCBjYWxjdWxhdGUgdGhlIGR1cmF0aW9uXFxuICB2YXIgc3RvcFRpbWUgPSBEYXRlLm5vdygpO1xcbiAgdmFyIGR1cmF0aW9uID0gc3RvcFRpbWUgLSB3aW5kb3cuc3RhcnRUaW1lO1xcblxcbiAgLy8gSWYgdGhlIGR1cmF0aW9uIGlzIGdyZWF0ZXIgdGhhbiB0aGUgdGhyZXNob2xkLCB1cGxvYWQgdGhlIGF1ZGlvIGZvciB0cmFuc2NyaXB0aW9uXFxuICBpZiAoZHVyYXRpb24gPj0gdGhyZXNob2xkKSB7XFxuICAgIC8vIGRvd25sb2FkIHRoZSBhdWRpb1xcbiAgICB2YXIgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChhdWRpb0Jsb2IpO1xcbiAgICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcXG4gICAgYS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xcbiAgICBhLmhyZWYgPSB1cmw7XFxuICAgIGEuZG93bmxvYWQgPSAnc2FmYXJpX2F1ZGlvLm1wNCc7XFxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYSk7XFxuICAgIC8vIGEuY2xpY2soKTtcXG4gICAgLy8gVXBsb2FkIHRoZSBhdWRpbyB0byB0aGUgc2VydmVyIGZvciB0cmFuc2NyaXB0aW9uXFxuICAgIHVwbG9hZEF1ZGlvKGF1ZGlvQmxvYik7XFxuICB9XFxuXFxuICAvLyBDbGVhciB0aGUgYXJyYXkgZm9yIHRoZSBuZXh0IHJlY29yZGluZ1xcbiAgYXVkaW9EYXRhQ2h1bmtzID0gW107XFxufVxcbmZ1bmN0aW9uIHNldHVwUmVjb3JkaW5nKGNhbGxiYWNrKSB7XFxuICBpZiAobWVkaWFSZWNvcmRlcikge1xcbiAgICByZXR1cm47XFxuICB9XFxuXFxuICAvLyBHZXQgYSBzdHJlYW0gZnJvbSB0aGUgdXNlcidzIG1pY3JvcGhvbmVcXG4gIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKHtcXG4gICAgYXVkaW86IHRydWVcXG4gIH0pLnRoZW4oZnVuY3Rpb24gKHN0cmVhbSkge1xcbiAgICBpZiAoIU1lZGlhUmVjb3JkZXIuaXNUeXBlU3VwcG9ydGVkKGF1ZGlvTWltZVR5cGUpKSB7XFxuICAgICAgLy8gdXNlIE1QNCBmb3IgU2FmYXJpXFxuICAgICAgYXVkaW9NaW1lVHlwZSA9ICdhdWRpby9tcDQnO1xcbiAgICB9XFxuICAgIC8vIENyZWF0ZSBhIG5ldyBNZWRpYVJlY29yZGVyIG9iamVjdCB1c2luZyB0aGUgc3RyZWFtIGFuZCBzcGVjaWZ5aW5nIHRoZSBNSU1FIHR5cGVcXG4gICAgdmFyIG9wdGlvbnMgPSB7XFxuICAgICAgbWltZVR5cGU6IGF1ZGlvTWltZVR5cGVcXG4gICAgfTtcXG4gICAgbWVkaWFSZWNvcmRlciA9IG5ldyBNZWRpYVJlY29yZGVyKHN0cmVhbSwgb3B0aW9ucyk7XFxuXFxuICAgIC8vIExpc3RlbiBmb3IgdGhlICdkYXRhYXZhaWxhYmxlJyBldmVudFxcbiAgICBtZWRpYVJlY29yZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2RhdGFhdmFpbGFibGUnLCBoYW5kbGVEYXRhQXZhaWxhYmxlKTtcXG5cXG4gICAgLy8gTGlzdGVuIGZvciB0aGUgJ3N0b3AnIGV2ZW50XFxuICAgIG1lZGlhUmVjb3JkZXIuYWRkRXZlbnRMaXN0ZW5lcignc3RvcCcsIGhhbmRsZVN0b3ApO1xcbiAgfSkudGhlbihmdW5jdGlvbiAoKSB7XFxuICAgIC8vIEludm9rZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cXG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xcbiAgICAgIGNhbGxiYWNrKCk7XFxuICAgIH1cXG4gIH0pW1xcXCJjYXRjaFxcXCJdKGZ1bmN0aW9uIChlcnIpIHtcXG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgZ2V0dGluZyBhdWRpbyBzdHJlYW06ICcgKyBlcnIpO1xcbiAgfSk7XFxufVxcbmZ1bmN0aW9uIHRlYXJEb3duUmVjb3JkaW5nKCkge1xcbiAgLy8gQ2hlY2sgaWYgdGhlIE1lZGlhUmVjb3JkZXIgaXMgc2V0IHVwXFxuICBpZiAoIW1lZGlhUmVjb3JkZXIpIHtcXG4gICAgcmV0dXJuO1xcbiAgfVxcblxcbiAgLy8gU3RvcCBhbnkgb25nb2luZyByZWNvcmRpbmdcXG4gIGlmIChtZWRpYVJlY29yZGVyLnN0YXRlID09PSAncmVjb3JkaW5nJykge1xcbiAgICBtZWRpYVJlY29yZGVyLnN0b3AoKTtcXG4gIH1cXG5cXG4gIC8vIFJlbW92ZSB0aGUgTWVkaWFSZWNvcmRlcidzIGV2ZW50IGxpc3RlbmVyc1xcbiAgbWVkaWFSZWNvcmRlci5yZW1vdmVFdmVudExpc3RlbmVyKCdkYXRhYXZhaWxhYmxlJywgaGFuZGxlRGF0YUF2YWlsYWJsZSk7XFxuICBtZWRpYVJlY29yZGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3N0b3AnLCBoYW5kbGVTdG9wKTtcXG5cXG4gIC8vIENsZWFyIHRoZSBNZWRpYVJlY29yZGVyIHZhcmlhYmxlXFxuICBtZWRpYVJlY29yZGVyID0gbnVsbDtcXG59XFxuXFxuLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSB1c2VyIHByZXNzZXMgdGhlIHJlY29yZCBidXR0b25cXG5mdW5jdGlvbiBzdGFydFJlY29yZGluZygpIHtcXG4gIC8vIENoZWNrIGlmIHRoZSBNZWRpYVJlY29yZGVyIGlzIHNldCB1cFxcbiAgaWYgKCFtZWRpYVJlY29yZGVyKSB7XFxuICAgIHNldHVwUmVjb3JkaW5nKHN0YXJ0UmVjb3JkaW5nKTtcXG4gICAgcmV0dXJuO1xcbiAgfVxcblxcbiAgLy8gU3RhcnQgcmVjb3JkaW5nXFxuICBtZWRpYVJlY29yZGVyLnN0YXJ0KCk7XFxuXFxuICAvLyBSZWNvcmQgdGhlIHN0YXJ0IHRpbWVcXG4gIHdpbmRvdy5zdGFydFRpbWUgPSBEYXRlLm5vdygpO1xcbiAgY29uc29sZS5sb2coJ1JlY29yZGluZyBzdGFydGVkJyk7XFxuXFxuICAvLyBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlIHVzZXIgcmVsZWFzZXMgdGhlIHJlY29yZCBidXR0b25cXG4gIHdpbmRvdy5zdG9wUmVjb3JkaW5nID0gZnVuY3Rpb24gKCkge1xcbiAgICBpZiAobWVkaWFSZWNvcmRlciAmJiBtZWRpYVJlY29yZGVyLnN0YXRlID09PSAncmVjb3JkaW5nJykge1xcbiAgICAgIC8vIFN0b3AgcmVjb3JkaW5nXFxuICAgICAgbWVkaWFSZWNvcmRlci5zdG9wKCk7XFxuXFxuICAgICAgLy8gUmVjb3JkIHRoZSBzdG9wIHRpbWUgYW5kIGNhbGN1bGF0ZSB0aGUgZHVyYXRpb25cXG4gICAgICB2YXIgc3RvcFRpbWUgPSBEYXRlLm5vdygpO1xcbiAgICAgIHZhciBkdXJhdGlvbiA9IHN0b3BUaW1lIC0gd2luZG93LnN0YXJ0VGltZTtcXG5cXG4gICAgICAvLyBJZiB0aGUgZHVyYXRpb24gaXMgbGVzcyB0aGFuIHRoZSB0aHJlc2hvbGQsIGRvbid0IHVwbG9hZCB0aGUgYXVkaW8gZm9yIHRyYW5zY3JpcHRpb25cXG4gICAgICBpZiAoZHVyYXRpb24gPCB0aHJlc2hvbGQpIHtcXG4gICAgICAgIGNvbnNvbGUubG9nKCdSZWNvcmRpbmcgd2FzIHRvbyBzaG9ydCwgbm90IHVwbG9hZGluZyBmb3IgdHJhbnNjcmlwdGlvbicpO1xcbiAgICAgIH0gZWxzZSB7XFxuICAgICAgICBjb25zb2xlLmxvZygnUmVjb3JkaW5nIHN0b3BwZWQnKTtcXG4gICAgICB9XFxuICAgIH1cXG4gICAgLy8gUmVtb3ZlIHRoZSBzdG9wUmVjb3JkaW5nIGZ1bmN0aW9uXFxuICAgIGRlbGV0ZSB3aW5kb3cuc3RvcFJlY29yZGluZztcXG4gIH07XFxufVxcblxcbi8vIEFkZCB0aGUgc3RhcnRSZWNvcmRpbmcgZnVuY3Rpb24gdG8gdGhlIHdpbmRvdyBvYmplY3Qgc28gaXQgY2FuIGJlIGNhbGxlZCBmcm9tIG91dHNpZGUgdGhpcyBzY3JpcHRcXG53aW5kb3cuc3RhcnRSZWNvcmRpbmcgPSBzdGFydFJlY29yZGluZztcIjsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vID09VXNlclNjcmlwdD09XG4vLyBAbmFtZSAgICAgICAgIFNheSwgUGlcbi8vIEBuYW1lc3BhY2UgICAgaHR0cDovL3d3dy5zYXlwaS5haS9cbi8vIEB2ZXJzaW9uICAgICAgMS4xLjVcbi8vIEBkZXNjcmlwdGlvbiAgU3BlYWsgdG8gUGkgd2l0aCBPcGVuQUkncyBXaGlzcGVyXG4vLyBAYXV0aG9yICAgICAgIFJvc3MgQ2Fkb2dhblxuLy8gQG1hdGNoICAgICAgICBodHRwczovL3BpLmFpL3RhbGtcbi8vIEBpbmplY3QtaW50byAgcGFnZVxuLy8gQHVwZGF0ZVVSTCAgICBodHRwczovL3d3dy5zYXlwaS5haS9zYXlwaS51c2VyLmpzXG4vLyBAZG93bmxvYWRVUkwgIGh0dHBzOi8vd3d3LnNheXBpLmFpL3NheXBpLnVzZXIuanNcbi8vIEBsaWNlbnNlICAgICAgTUlUXG4vLyA9PS9Vc2VyU2NyaXB0PT1cblxuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBjb25zdCBsb2NhbENvbmZpZyA9IHtcbiAgICAgICAgYXBwU2VydmVyVXJsOiBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMFwiLFxuICAgICAgICBhcGlTZXJ2ZXJVcmw6IFwiaHR0cHM6Ly9sb2NhbGhvc3Q6NTAwMFwiLFxuICAgICAgICAvLyBBZGQgb3RoZXIgY29uZmlndXJhdGlvbiBwcm9wZXJ0aWVzIGFzIG5lZWRlZFxuICAgIH07XG5cbiAgICAvLyBEZWZpbmUgYSBnbG9iYWwgY29uZmlndXJhdGlvbiBwcm9wZXJ0eVxuICAgIGNvbnN0IHByb2R1Y3Rpb25Db25maWcgPSB7XG4gICAgICAgIGFwcFNlcnZlclVybDogXCJodHRwczovL2FwcC5zYXlwaS5haVwiLFxuICAgICAgICBhcGlTZXJ2ZXJVcmw6IFwiaHR0cHM6Ly9hcGkuc2F5cGkuYWlcIixcbiAgICAgICAgLy8gQWRkIG90aGVyIGNvbmZpZ3VyYXRpb24gcHJvcGVydGllcyBhcyBuZWVkZWRcbiAgICB9O1xuICAgIGNvbnN0IGNvbmZpZyA9IHByb2R1Y3Rpb25Db25maWc7XG5cbiAgICBjb25zdCBwYWdlU2NyaXB0ID0gcmVxdWlyZSgncmF3LWxvYWRlciEuL3RyYW5zY3JpYmVyLmpzJykuZGVmYXVsdDtcblxuICAgIC8vIENyZWF0ZSBhIE11dGF0aW9uT2JzZXJ2ZXIgdG8gbGlzdGVuIGZvciBjaGFuZ2VzIHRvIHRoZSBET01cbiAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAobXV0YXRpb25zKSB7XG4gICAgICAgIC8vIENoZWNrIGVhY2ggbXV0YXRpb25cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtdXRhdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBtdXRhdGlvbiA9IG11dGF0aW9uc1tpXTtcblxuICAgICAgICAgICAgLy8gSWYgbm9kZXMgd2VyZSBhZGRlZCwgY2hlY2sgZWFjaCBvbmVcbiAgICAgICAgICAgIGlmIChtdXRhdGlvbi5hZGRlZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG11dGF0aW9uLmFkZGVkTm9kZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5vZGUgPSBtdXRhdGlvbi5hZGRlZE5vZGVzW2pdO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSBub2RlIGlzIHRoZSBhcHByb3ByaWF0ZSBjb250YWluZXIgZWxlbWVudCwgYWRkIHRoZSBidXR0b24gYW5kIHN0b3Agb2JzZXJ2aW5nXG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdkaXYnICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdmaXhlZCcpICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdib3R0b20tMTYnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZvb3RlciA9IG5vZGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYnV0dG9uQ29udGFpbmVyID0gZm9vdGVyLnF1ZXJ5U2VsZWN0b3IoJy5yZWxhdGl2ZS5mbGV4LmZsZXgtY29sJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYnV0dG9uQ29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkVGFsa0J1dHRvbihidXR0b25Db250YWluZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTm8gYnV0dG9uIGNvbnRhaW5lciBmb3VuZCBpbiBmb290ZXInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBmdW5jdGlvbiBpbmplY3RTY3JpcHQoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHNjcmlwdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgICAgICBzY3JpcHRFbGVtZW50LnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xuICAgICAgICBzY3JpcHRFbGVtZW50LmlkID0gJ3NheXBpLXNjcmlwdCc7XG4gICAgICAgIGNvbnN0IGNvbmZpZ1RleHQgPSAndmFyIGNvbmZpZyA9ICcgKyBKU09OLnN0cmluZ2lmeShjb25maWcpICsgJzsnO1xuICAgICAgICBzY3JpcHRFbGVtZW50LnRleHRDb250ZW50ID0gY29uZmlnVGV4dCArIHBhZ2VTY3JpcHQ7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0RWxlbWVudCk7XG5cbiAgICAgICAgLy8gQ2FsbCB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gYWZ0ZXIgdGhlIHNjcmlwdCBpcyBhZGRlZFxuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIGFkZFRhbGtCdXR0b24oY29udGFpbmVyKSB7XG4gICAgICAgIHZhciBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgYnV0dG9uLmlkID0gJ3RhbGtCdXR0b24nO1xuICAgICAgICBidXR0b24udHlwZSA9ICdidXR0b24nO1xuICAgICAgICBidXR0b24uY2xhc3NOYW1lID0gJ3JlbGF0aXZlIGZsZXggbXQtMSBtYi0xIHJvdW5kZWQtZnVsbCBweC0yIHB5LTMgdGV4dC1jZW50ZXIgYmctY3JlYW0tNTUwIGhvdmVyOmJnLWNyZWFtLTY1MCBob3Zlcjp0ZXh0LWJyYW5kLWdyZWVuLTcwMCB0ZXh0LW11dGVkJztcbiAgICAgICAgLy8gU2V0IEFSSUEgbGFiZWwgYW5kIHRvb2x0aXBcbiAgICAgICAgY29uc3QgbGFiZWwgPSAnVGFsayAoSG9sZCBDb250cm9sICsgU3BhY2UgdG8gdXNlIGhvdGtleS4gRG91YmxlIGNsaWNrIHRvIHRvZ2dsZSBhdXRvLXN1Ym1pdCBvbi9vZmYpJ1xuICAgICAgICBidXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgbGFiZWwpO1xuICAgICAgICBidXR0b24uc2V0QXR0cmlidXRlKCd0aXRsZScsIGxhYmVsKTtcbiAgICAgICAgLy8gZW5hYmxlIGF1dG9zdWJtaXQgYnkgZGVmYXVsdFxuICAgICAgICBidXR0b24uZGF0YXNldC5hdXRvc3VibWl0ID0gJ3RydWUnO1xuICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnYXV0b1N1Ym1pdCcpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgICAgICAgYWRkVGFsa0J1dHRvblN0eWxlcygpO1xuICAgICAgICBhZGRUYWxrSWNvbihidXR0b24pO1xuXG4gICAgICAgIC8vIENhbGwgdGhlIGZ1bmN0aW9uIHRvIGluamVjdCB0aGUgc2NyaXB0IGFmdGVyIHRoZSBidXR0b24gaGFzIGJlZW4gYWRkZWRcbiAgICAgICAgaW5qZWN0U2NyaXB0KHJlZ2lzdGVyQXVkaW9CdXR0b25FdmVudHMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFRhbGtJY29uKGJ1dHRvbikge1xuICAgICAgICB2YXIgaWNvbkh0bWwgPSBgXG4gICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZlcnNpb249XCIxLjBcIiB2aWV3Qm94PVwiMCAwIDU2LjI1IDMwXCIgY2xhc3M9XCJ3YXZlZm9ybVwiPlxuICAgICAgICA8ZGVmcz5cbiAgICAgICAgICAgIDxjbGlwUGF0aCBpZD1cImFcIj5cbiAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTS41NCAxMkgzdjVILjU0Wm0wIDBcIi8+XG4gICAgICAgICAgICA8L2NsaXBQYXRoPlxuICAgICAgICAgICAgPGNsaXBQYXRoIGlkPVwiYlwiPlxuICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMjUgMi4yaDJ2MjQuNjhoLTJabTAgMFwiLz5cbiAgICAgICAgICAgIDwvY2xpcFBhdGg+XG4gICAgICAgICAgICA8Y2xpcFBhdGggaWQ9XCJjXCI+XG4gICAgICAgICAgICAgICAgPHBhdGggZD1cIk01MyAxMmgxLjk4djVINTNabTAgMFwiLz5cbiAgICAgICAgICAgIDwvY2xpcFBhdGg+XG4gICAgICAgIDwvZGVmcz5cbiAgICAgICAgPGcgY2xpcC1wYXRoPVwidXJsKCNhKVwiPlxuICAgICAgICAgICAgPHBhdGggZD1cIk0xLjQ4IDEyLjcxYy0uNSAwLS45LjQtLjkuOXYxLjg1YS45LjkgMCAwIDAgMS44IDB2LTEuODRjMC0uNS0uNC0uOS0uOS0uOVptMCAwXCIvPlxuICAgICAgICA8L2c+XG4gICAgICAgIDxwYXRoIGQ9XCJNNC45OCA2LjYzYy0uNSAwLS45LjQtLjkuOXYxNC4wMWEuOS45IDAgMCAwIDEuODEgMHYtMTRjMC0uNS0uNC0uOTItLjktLjkyWm0zLjUxIDMuMWEuOS45IDAgMCAwLS45LjkxdjcuNzlhLjkuOSAwIDAgMCAxLjggMHYtNy43OWMwLS41LS40LS45LS45LS45Wk0xMiAzLjgzYS45LjkgMCAwIDAtLjkxLjl2MTkuNmEuOS45IDAgMCAwIDEuOCAwVjQuNzRjMC0uNS0uNC0uOS0uOS0uOVptMy41IDguMjlhLjkuOSAwIDAgMC0uOTEuOXYzLjAzYS45LjkgMCAwIDAgMS44MSAwdi0zLjAzYzAtLjUtLjQtLjktLjktLjlaTTE5IDYuOGMtLjUgMC0uOS40LS45Ljl2MTMuNjhhLjkuOSAwIDAgMCAxLjggMFY3LjdjMC0uNS0uNC0uOS0uOS0uOVptMy41OC0yLjk3aC0uMDFjLS41IDAtLjkuNC0uOS45bC0uMTMgMTkuNmMwIC41LjQuOS45LjkxLjUgMCAuOS0uNC45LS45bC4xNC0xOS42YS45LjkgMCAwIDAtLjktLjlabTAgMFwiLz5cbiAgICAgICAgPGcgY2xpcC1wYXRoPVwidXJsKCNiKVwiPlxuICAgICAgICAgICAgPHBhdGggZD1cIk0yNiAyLjJjLS41IDAtLjkuNC0uOS45djIyLjg2YS45LjkgMCAxIDAgMS44MSAwVjMuMTFhLjkuOSAwIDAgMC0uOS0uOTFabTAgMFwiLz5cbiAgICAgICAgPC9nPlxuICAgICAgICA8cGF0aCBkPVwiTTI5LjUyIDcuNzFhLjkuOSAwIDAgMC0uOTEuOXYxMS44NWEuOS45IDAgMCAwIDEuODEgMFY4LjYyYzAtLjUtLjQtLjktLjktLjlabTMuNSAyLjkzYS45LjkgMCAwIDAtLjkuOTF2NS45N2EuOS45IDAgMCAwIDEuOCAwdi01Ljk3YzAtLjUtLjQtLjktLjktLjlabTMuNS01Ljc4Yy0uNSAwLS45LjQtLjkuOXYxNy41NWEuOS45IDAgMCAwIDEuODEgMFY1Ljc2YzAtLjUtLjQtLjktLjktLjlabTMuNTEgMy4zNGMtLjUgMC0uOS40LS45Ljl2MTAuODdhLjkuOSAwIDAgMCAxLjggMFY5LjFhLjkuOSAwIDAgMC0uOS0uOTFabTMuNSAzLjA4Yy0uNSAwLS45LjQtLjkuOTF2NC43YS45LjkgMCAxIDAgMS44IDB2LTQuN2EuOS45IDAgMCAwLS45LS45Wm0zLjUxLTcuNDVhLjkuOSAwIDAgMC0uOTEuOXYxOS42YS45LjkgMCAwIDAgMS44MSAwVjQuNzRjMC0uNS0uNC0uOS0uOS0uOVptMy41IDUuNTdhLjkuOSAwIDAgMC0uOS45MXY4LjQ1YS45LjkgMCAwIDAgMS44IDB2LTguNDVjMC0uNS0uNC0uOS0uOS0uOVptMCAwXCIvPlxuICAgICAgICA8ZyBjbGlwLXBhdGg9XCJ1cmwoI2MpXCI+XG4gICAgICAgICAgICA8cGF0aCBkPVwiTTU0LjA0IDEyLjk2YS45LjkgMCAwIDAtLjkuOTF2MS4zM2EuOS45IDAgMSAwIDEuOCAwdi0xLjMyYS45LjkgMCAwIDAtLjktLjkyWm0wIDBcIi8+XG4gICAgICAgIDwvZz5cbiAgICA8L3N2Zz5cbiAgICBcbiAgICAgICAgYDtcbiAgICAgICAgdmFyIGljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3N2ZycpO1xuICAgICAgICBidXR0b24uYXBwZW5kQ2hpbGQoaWNvbik7XG4gICAgICAgIGljb24ub3V0ZXJIVE1MID0gaWNvbkh0bWw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkU3R5bGVzKGNzcykge1xuICAgICAgICBjb25zdCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuICAgICAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkVGFsa0J1dHRvblN0eWxlcygpIHtcbiAgICAgICAgLy8gR2V0IHRoZSBidXR0b24gYW5kIHJlZ2lzdGVyIGZvciBtb3VzZWRvd24gYW5kIG1vdXNldXAgZXZlbnRzXG4gICAgICAgIHZhciBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFsa0J1dHRvbicpO1xuICAgICAgICAvLyBidXR0b24gYW5pbWF0aW9uXG4gICAgICAgIGFkZFN0eWxlcyhgXG4gICAgICAgICAgICBAa2V5ZnJhbWVzIHB1bHNlIHtcbiAgICAgICAgICAgICAgICAwJSB7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDUwJSB7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMC45KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgMTAwJSB7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgI3RhbGtCdXR0b24ge1xuICAgICAgICAgICAgICAgIG1hcmdpbi10b3A6IDAuMjVyZW07XG4gICAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMThweDtcbiAgICAgICAgICAgICAgICB3aWR0aDogMTIwcHg7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogYmxvY2s7IC8qIEZvciBTYWZhcmkgKi9cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgI3RhbGtCdXR0b246YWN0aXZlIC53YXZlZm9ybSwgI3RhbGtCdXR0b24uYWN0aXZlIC53YXZlZm9ybSB7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBwdWxzZSAxcyBpbmZpbml0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICN0YWxrQnV0dG9uIC53YXZlZm9ybSB7XG4gICAgICAgICAgICAgICAgZmlsbDogIzc3NmQ2ZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICN0YWxrQnV0dG9uLmF1dG9TdWJtaXQgLndhdmVmb3JtIHtcbiAgICAgICAgICAgICAgICBmaWxsOiByZ2IoNjUgMTM4IDQ3KTsgLyogUGkncyB0ZXh0LWJyYW5kLWdyZWVuLTYwMCAqL1xuICAgICAgICAgICAgfVxuICAgICAgICBgKTtcblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlZ2lzdGVyQXVkaW9CdXR0b25FdmVudHMoKSB7XG4gICAgICAgIHZhciBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFsa0J1dHRvbicpO1xuICAgICAgICB2YXIgY29udGV4dCA9IHdpbmRvdztcbiAgICAgICAgaWYgKEdNX2luZm8uc2NyaXB0SGFuZGxlciAhPT0gJ1VzZXJzY3JpcHRzJykge1xuICAgICAgICAgICAgY29udGV4dCA9IHVuc2FmZVdpbmRvdztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZvciBkZXNrdG9wXG4gICAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZFByb21wdFRleHRBcmVhKCk7XG4gICAgICAgICAgICBjb250ZXh0LnN0YXJ0UmVjb3JkaW5nKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnRleHQuc3RvcFJlY29yZGluZygpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmVnaXN0ZXJIb3RrZXkoKTtcblxuICAgICAgICAvLyBcIndhcm0gdXBcIiB0aGUgbWljcm9waG9uZSBieSBhY3F1aXJpbmcgaXQgYmVmb3JlIHRoZSB1c2VyIHByZXNzZXMgdGhlIGJ1dHRvblxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFsa0J1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBzZXR1cFJlY29yZGluZyk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWxrQnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIHRlYXJEb3duUmVjb3JkaW5nKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JlZm9yZXVubG9hZCcsIHRlYXJEb3duUmVjb3JkaW5nKTtcblxuICAgICAgICAvLyBBdHRhY2ggYSBkb3VibGUgY2xpY2sgZXZlbnQgbGlzdGVuZXIgdG8gdGhlIHRhbGsgYnV0dG9uXG4gICAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdkYmxjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIFRvZ2dsZSB0aGUgQ1NTIGNsYXNzZXMgdG8gaW5kaWNhdGUgdGhlIG1vZGVcbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QudG9nZ2xlKCdhdXRvU3VibWl0Jyk7XG5cbiAgICAgICAgICAgIC8vIFN0b3JlIHRoZSBzdGF0ZSBvbiB0aGUgYnV0dG9uIGVsZW1lbnQgdXNpbmcgYSBjdXN0b20gZGF0YSBhdHRyaWJ1dGVcbiAgICAgICAgICAgIGlmIChidXR0b24uZ2V0QXR0cmlidXRlKCdkYXRhLWF1dG9zdWJtaXQnKSA9PT0gJ3RydWUnKSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnZGF0YS1hdXRvc3VibWl0JywgJ2ZhbHNlJyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2F1dG9zdWJtaXQgZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnZGF0YS1hdXRvc3VibWl0JywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnYXV0b3N1Ym1pdCBlbmFibGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEZvciBtb2JpbGVcbiAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpOyAvLyBQcmV2ZW50IHRoZSBkZWZhdWx0IGNsaWNrIGJlaGF2aW9yIGZyb20gaGFwcGVuaW5nXG4gICAgICAgICAgICBpZFByb21wdFRleHRBcmVhKCk7XG4gICAgICAgICAgICBjb250ZXh0LnN0YXJ0UmVjb3JkaW5nKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb250ZXh0LnN0b3BSZWNvcmRpbmcoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWxrQnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCB0ZWFyRG93blJlY29yZGluZyk7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiByZWdpc3RlckhvdGtleSgpIHtcbiAgICAgICAgLy8gUmVnaXN0ZXIgYSBob3RrZXkgZm9yIHRoZSBidXR0b25cbiAgICAgICAgbGV0IGN0cmxEb3duID0gZmFsc2U7XG5cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LmN0cmxLZXkgJiYgZXZlbnQuY29kZSA9PT0gJ1NwYWNlJyAmJiAhY3RybERvd24pIHtcbiAgICAgICAgICAgICAgICBjdHJsRG93biA9IHRydWU7XG4gICAgICAgICAgICAgICAgLy8gU2ltdWxhdGUgbW91c2Vkb3duIGV2ZW50XG4gICAgICAgICAgICAgICAgbGV0IG1vdXNlRG93bkV2ZW50ID0gbmV3IEV2ZW50KCdtb3VzZWRvd24nKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFsa0J1dHRvbicpLmRpc3BhdGNoRXZlbnQobW91c2VEb3duRXZlbnQpO1xuICAgICAgICAgICAgICAgIHRhbGtCdXR0b24uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7IC8vIEFkZCB0aGUgYWN0aXZlIGNsYXNzXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoY3RybERvd24gJiYgZXZlbnQuY29kZSA9PT0gJ1NwYWNlJykge1xuICAgICAgICAgICAgICAgIGN0cmxEb3duID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgLy8gU2ltdWxhdGUgbW91c2V1cCBldmVudFxuICAgICAgICAgICAgICAgIGxldCBtb3VzZVVwRXZlbnQgPSBuZXcgRXZlbnQoJ21vdXNldXAnKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFsa0J1dHRvbicpLmRpc3BhdGNoRXZlbnQobW91c2VVcEV2ZW50KTtcbiAgICAgICAgICAgICAgICB0YWxrQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIGlkUHJvbXB0VGV4dEFyZWEoKSB7XG4gICAgICAgIHZhciB0ZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9tcHQnKTtcbiAgICAgICAgaWYgKCF0ZXh0YXJlYSkge1xuICAgICAgICAgICAgLy8gRmluZCB0aGUgZmlyc3QgPHRleHRhcmVhPiBlbGVtZW50IGFuZCBnaXZlIGl0IGFuIGlkXG4gICAgICAgICAgICB2YXIgdGV4dGFyZWFFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcigndGV4dGFyZWEnKTtcbiAgICAgICAgICAgIGlmICh0ZXh0YXJlYUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0ZXh0YXJlYUVsZW1lbnQuaWQgPSAncHJvbXB0JztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ05vIDx0ZXh0YXJlYT4gZWxlbWVudCBmb3VuZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gU3RhcnQgb2JzZXJ2aW5nIHRoZSBlbnRpcmUgZG9jdW1lbnQgZm9yIGNoYW5nZXMgdG8gY2hpbGQgbm9kZXMgYW5kIHN1YnRyZWVcbiAgICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LCB7IGNoaWxkTGlzdDogdHJ1ZSwgc3VidHJlZTogdHJ1ZSB9KTtcbn0pKCk7XG4iXSwibmFtZXMiOlsibG9jYWxDb25maWciLCJhcHBTZXJ2ZXJVcmwiLCJhcGlTZXJ2ZXJVcmwiLCJwcm9kdWN0aW9uQ29uZmlnIiwiY29uZmlnIiwicGFnZVNjcmlwdCIsInJlcXVpcmUiLCJvYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJtdXRhdGlvbnMiLCJpIiwibGVuZ3RoIiwibXV0YXRpb24iLCJhZGRlZE5vZGVzIiwiaiIsIm5vZGUiLCJub2RlTmFtZSIsInRvTG93ZXJDYXNlIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJmb290ZXIiLCJidXR0b25Db250YWluZXIiLCJxdWVyeVNlbGVjdG9yIiwiYWRkVGFsa0J1dHRvbiIsImNvbnNvbGUiLCJsb2ciLCJkaXNjb25uZWN0IiwiaW5qZWN0U2NyaXB0IiwiY2FsbGJhY2siLCJzY3JpcHRFbGVtZW50IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwidHlwZSIsImlkIiwiY29uZmlnVGV4dCIsIkpTT04iLCJzdHJpbmdpZnkiLCJ0ZXh0Q29udGVudCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsImNvbnRhaW5lciIsImJ1dHRvbiIsImNsYXNzTmFtZSIsImxhYmVsIiwic2V0QXR0cmlidXRlIiwiZGF0YXNldCIsImF1dG9zdWJtaXQiLCJhZGQiLCJhZGRUYWxrQnV0dG9uU3R5bGVzIiwiYWRkVGFsa0ljb24iLCJyZWdpc3RlckF1ZGlvQnV0dG9uRXZlbnRzIiwiaWNvbkh0bWwiLCJpY29uIiwiY3JlYXRlRWxlbWVudE5TIiwib3V0ZXJIVE1MIiwiYWRkU3R5bGVzIiwiY3NzIiwic3R5bGUiLCJjcmVhdGVUZXh0Tm9kZSIsImhlYWQiLCJnZXRFbGVtZW50QnlJZCIsImNvbnRleHQiLCJ3aW5kb3ciLCJHTV9pbmZvIiwic2NyaXB0SGFuZGxlciIsInVuc2FmZVdpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJpZFByb21wdFRleHRBcmVhIiwic3RhcnRSZWNvcmRpbmciLCJzdG9wUmVjb3JkaW5nIiwicmVnaXN0ZXJIb3RrZXkiLCJzZXR1cFJlY29yZGluZyIsInRlYXJEb3duUmVjb3JkaW5nIiwidG9nZ2xlIiwiZ2V0QXR0cmlidXRlIiwiZSIsInByZXZlbnREZWZhdWx0IiwiY3RybERvd24iLCJldmVudCIsImN0cmxLZXkiLCJjb2RlIiwibW91c2VEb3duRXZlbnQiLCJFdmVudCIsImRpc3BhdGNoRXZlbnQiLCJ0YWxrQnV0dG9uIiwibW91c2VVcEV2ZW50IiwicmVtb3ZlIiwidGV4dGFyZWEiLCJ0ZXh0YXJlYUVsZW1lbnQiLCJvYnNlcnZlIiwiY2hpbGRMaXN0Iiwic3VidHJlZSJdLCJzb3VyY2VSb290IjoiIn0=