// ==UserScript==
// @name         Say, Pi
// @namespace    http://www.saypi.ai/
// @version      1.2.1
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
    // ==UserScript==
    // @name         Say, Pi
    // @namespace    http://www.saypi.ai/
    // @version      1.2.1
    // @description  Speak to Pi with OpenAI's Whisper
    // @author       Ross Cadogan
    // @match        https://pi.ai/talk
    // @inject-into  page
    // @updateURL    https://www.saypi.ai/saypi.user.js
    // @downloadURL  https://www.saypi.ai/saypi.user.js
    // @license      MIT
    // ==/UserScript==

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
        var isFirefoxAndroid = /Firefox/.test(navigator.userAgent) && /Android/.test(navigator.userAgent);
        if (isFirefoxAndroid) {
          // hack for Firefox on Android, which doesn't support :active correctly
          document.documentElement.classList.add('firefox-android');
        }

        // button animation
        addStyles("\n            @keyframes pulse {\n                0% {\n                    transform: scale(1);\n                }\n                50% {\n                    transform: scale(0.9);\n                }\n                100% {\n                    transform: scale(1);\n                }\n            }\n            #talkButton {\n                margin-top: 0.25rem;\n                border-radius: 18px;\n                width: 120px;\n                display: block; /* For Safari */\n            }\n\n            html:not(.firefox-android) #talkButton:active .waveform,\n            #talkButton.active .waveform {\n                animation: pulse 1s infinite;\n            }            \n            #talkButton .waveform {\n                fill: #776d6d;\n            }\n            #talkButton.autoSubmit .waveform {\n                fill: rgb(65 138 47); /* Pi's text-brand-green-600 */\n            }\n        ");
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
          this.classList.add('active'); // Add the active class (for Firefox on Android)
        });

        button.addEventListener('touchend', function () {
          this.classList.remove('active'); // Remove the active class (for Firefox on Android
          context.stopRecording();
        });
        document.getElementById('talkButton').addEventListener('touchcancel', function () {
          this.classList.remove('active'); // Remove the active class (for Firefox on Android
          tearDownRecording();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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UUFDcENILFFBQVEsR0FBRyxLQUFLO1FBQ2hCO1FBQ0EsSUFBSVEsWUFBWSxHQUFHLElBQUlILEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDdkMxRCxRQUFRLENBQUNtQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUN3QixhQUFhLENBQUNFLFlBQVksQ0FBQztRQUNqRUQsVUFBVSxDQUFDeEUsU0FBUyxDQUFDZ0UsTUFBTSxDQUFDLFFBQVEsQ0FBQztNQUN6QztJQUNKLENBQUMsQ0FBQztFQUNOO0VBR0EsU0FBU1YsZ0JBQWdCQSxDQUFBLEVBQUc7SUFDeEIsSUFBSW9CLFFBQVEsR0FBRzlELFFBQVEsQ0FBQ21DLGNBQWMsQ0FBQyxRQUFRLENBQUM7SUFDaEQsSUFBSSxDQUFDMkIsUUFBUSxFQUFFO01BQ1g7TUFDQSxJQUFJQyxlQUFlLEdBQUcvRCxRQUFRLENBQUNSLGFBQWEsQ0FBQyxVQUFVLENBQUM7TUFDeEQsSUFBSXVFLGVBQWUsRUFBRTtRQUNqQkEsZUFBZSxDQUFDNUQsRUFBRSxHQUFHLFFBQVE7TUFDakMsQ0FBQyxNQUFNO1FBQ0hULE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLDZCQUE2QixDQUFDO01BQzlDO0lBQ0o7RUFDSjs7RUFFQTtFQUNBbEIsUUFBUSxDQUFDdUYsT0FBTyxDQUFDaEUsUUFBUSxFQUFFO0lBQUVpRSxTQUFTLEVBQUUsSUFBSTtJQUFFQyxPQUFPLEVBQUU7RUFBSyxDQUFDLENBQUM7QUFDbEUsQ0FBQyxFQUFFLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvdHJhbnNjcmliZXIuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvc2F5cGkuaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgXCJ2YXIgYXVkaW9EYXRhQ2h1bmtzID0gW107XFxudmFyIGF1ZGlvTWltZVR5cGUgPSAnYXVkaW8vd2VibTtjb2RlY3M9b3B1cyc7XFxuZnVuY3Rpb24gdXBsb2FkQXVkaW8oYXVkaW9CbG9iKSB7XFxuICAvLyBDcmVhdGUgYSBGb3JtRGF0YSBvYmplY3RcXG4gIHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xcbiAgdmFyIGF1ZGlvRmlsZW5hbWUgPSAnYXVkaW8ud2VibSc7XFxuICBpZiAoYXVkaW9CbG9iLnR5cGUgPT09ICdhdWRpby9tcDQnKSB7XFxuICAgIGF1ZGlvRmlsZW5hbWUgPSAnYXVkaW8ubXA0JztcXG4gIH1cXG4gIC8vIEFkZCB0aGUgYXVkaW8gYmxvYiB0byB0aGUgRm9ybURhdGEgb2JqZWN0XFxuICBmb3JtRGF0YS5hcHBlbmQoJ2F1ZGlvJywgYXVkaW9CbG9iLCBhdWRpb0ZpbGVuYW1lKTtcXG4gIC8vIEdldCB0aGUgdXNlcidzIHByZWZlcnJlZCBsYW5ndWFnZVxcbiAgdmFyIGxhbmd1YWdlID0gbmF2aWdhdG9yLmxhbmd1YWdlO1xcbiAgLy8gUG9zdCB0aGUgYXVkaW8gdG8gdGhlIHNlcnZlciBmb3IgdHJhbnNjcmlwdGlvblxcbiAgZmV0Y2goY29uZmlnLmFwaVNlcnZlclVybCArICcvdHJhbnNjcmliZT9sYW5ndWFnZT0nICsgbGFuZ3VhZ2UsIHtcXG4gICAgbWV0aG9kOiAnUE9TVCcsXFxuICAgIGJvZHk6IGZvcm1EYXRhXFxuICB9KS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xcbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XFxuICAgICAgdGhyb3cgRXJyb3IocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XFxuICAgIH1cXG4gICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcXG4gIH0pLnRoZW4oaGFuZGxlVHJhbnNjcmlwdGlvblJlc3BvbnNlKVtcXFwiY2F0Y2hcXFwiXShmdW5jdGlvbiAoZXJyb3IpIHtcXG4gICAgY29uc29sZS5lcnJvcignTG9va3MgbGlrZSB0aGVyZSB3YXMgYSBwcm9ibGVtOiAnLCBlcnJvcik7XFxuICAgIHZhciB0ZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9tcHQnKTtcXG4gICAgdGV4dGFyZWEudmFsdWUgPSAnU29ycnksIHRoZXJlIHdhcyBhIHByb2JsZW0gdHJhbnNjcmliaW5nIHlvdXIgYXVkaW8uIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuJztcXG4gIH0pO1xcbn1cXG5mdW5jdGlvbiBoYW5kbGVUcmFuc2NyaXB0aW9uUmVzcG9uc2UocmVzcG9uc2VKc29uKSB7XFxuICB2YXIgdGV4dGFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvbXB0Jyk7XFxuICBzaW11bGF0ZVR5cGluZyh0ZXh0YXJlYSwgcmVzcG9uc2VKc29uLnRleHQgKyBcXFwiIFxcXCIpO1xcbiAgY29uc29sZS5sb2coJ1NwZWFrZXI6ICcgKyByZXNwb25zZUpzb24udGV4dCk7XFxufVxcbmZ1bmN0aW9uIHNldE5hdGl2ZVZhbHVlKGVsZW1lbnQsIHZhbHVlKSB7XFxuICB2YXIgbGFzdFZhbHVlID0gZWxlbWVudC52YWx1ZTtcXG4gIGVsZW1lbnQudmFsdWUgPSB2YWx1ZTtcXG4gIHZhciBldmVudCA9IG5ldyBFdmVudChcXFwiaW5wdXRcXFwiLCB7XFxuICAgIHRhcmdldDogZWxlbWVudCxcXG4gICAgYnViYmxlczogdHJ1ZVxcbiAgfSk7XFxuICAvLyBSZWFjdCAxNVxcbiAgZXZlbnQuc2ltdWxhdGVkID0gdHJ1ZTtcXG4gIC8vIFJlYWN0IDE2LTE3XFxuICB2YXIgdHJhY2tlciA9IGVsZW1lbnQuX3ZhbHVlVHJhY2tlcjtcXG4gIGlmICh0cmFja2VyKSB7XFxuICAgIHRyYWNrZXIuc2V0VmFsdWUobGFzdFZhbHVlKTtcXG4gIH1cXG4gIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XFxufVxcbmZ1bmN0aW9uIHNpbXVsYXRlRm9ybVN1Ym1pdCh0ZXh0YXJlYSkge1xcbiAgdmFyIGVudGVyRXZlbnQgPSBuZXcgS2V5Ym9hcmRFdmVudCgna2V5ZG93bicsIHtcXG4gICAgYnViYmxlczogdHJ1ZSxcXG4gICAga2V5OiAnRW50ZXInLFxcbiAgICBrZXlDb2RlOiAxMyxcXG4gICAgd2hpY2g6IDEzXFxuICB9KTtcXG4gIHRleHRhcmVhLmRpc3BhdGNoRXZlbnQoZW50ZXJFdmVudCk7XFxufVxcbmZ1bmN0aW9uIHNpbXVsYXRlVHlwaW5nKGVsZW1lbnQsIHRleHQpIHtcXG4gIHZhciB3b3JkcyA9IHRleHQuc3BsaXQoJyAnKTsgLy8gU3BsaXQgdGhlIHRleHQgaW50byB3b3JkcyAobWF5IG5vdCBiZSBpZGVhbCBmb3IgYWxsIGxhbmd1YWdlcylcXG4gIHZhciBpID0gMDtcXG4gIGZ1bmN0aW9uIHR5cGVXb3JkKCkge1xcbiAgICBpZiAoaSA8IHdvcmRzLmxlbmd0aCkge1xcbiAgICAgIC8vIEFwcGVuZCB0aGUgbmV4dCB3b3JkIGFuZCBhIHNwYWNlLCB0aGVuIGluY3JlbWVudCBpXFxuICAgICAgc2V0TmF0aXZlVmFsdWUoZWxlbWVudCwgZWxlbWVudC52YWx1ZSArIHdvcmRzW2krK10gKyAnICcpO1xcbiAgICAgIC8vIENhbGwgdGhpcyBmdW5jdGlvbiBhZ2FpbiBiZWZvcmUgdGhlIG5leHQgcmVwYWludFxcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0eXBlV29yZCk7XFxuICAgIH0gZWxzZSB7XFxuICAgICAgLy8gQ2hlY2sgaWYgYXV0b3N1Ym1pdCBpcyBlbmFibGVkXFxuICAgICAgdmFyIHRhbGtCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFsa0J1dHRvbicpO1xcbiAgICAgIGlmICh0YWxrQnV0dG9uLmRhdGFzZXQuYXV0b3N1Ym1pdCA9PT0gJ2ZhbHNlJykge1xcbiAgICAgICAgY29uc29sZS5sb2coJ0F1dG9zdWJtaXQgaXMgZGlzYWJsZWQnKTtcXG4gICAgICB9IGVsc2Uge1xcbiAgICAgICAgLy8gU2ltdWxhdGUgYW4gXFxcIkVudGVyXFxcIiBrZXlwcmVzcyBldmVudFxcbiAgICAgICAgc2ltdWxhdGVGb3JtU3VibWl0KGVsZW1lbnQpO1xcbiAgICAgIH1cXG4gICAgfVxcbiAgfVxcbiAgLy8gU3RhcnQgdHlwaW5nXFxuICB0eXBlV29yZCgpO1xcbn1cXG5cXG4vLyBEZWNsYXJlIGEgZ2xvYmFsIHZhcmlhYmxlIGZvciB0aGUgbWVkaWFSZWNvcmRlclxcbnZhciBtZWRpYVJlY29yZGVyO1xcbnZhciB0aHJlc2hvbGQgPSAxMDAwOyAvLyAxMDAwIG1zID0gMSBzZWNvbmQsIGFib3V0IHRoZSBsZW5ndGggb2YgXFxcIkhleSwgUGlcXFwiXFxuXFxuLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSAnZGF0YWF2YWlsYWJsZScgZXZlbnQgZmlyZXNcXG5mdW5jdGlvbiBoYW5kbGVEYXRhQXZhaWxhYmxlKGUpIHtcXG4gIC8vIEFkZCB0aGUgYXVkaW8gZGF0YSBjaHVuayB0byB0aGUgYXJyYXlcXG4gIGF1ZGlvRGF0YUNodW5rcy5wdXNoKGUuZGF0YSk7XFxufVxcblxcbi8vIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgJ3N0b3AnIGV2ZW50IGZpcmVzXFxuZnVuY3Rpb24gaGFuZGxlU3RvcCgpIHtcXG4gIC8vIENyZWF0ZSBhIEJsb2IgZnJvbSB0aGUgYXVkaW8gZGF0YSBjaHVua3NcXG4gIHZhciBhdWRpb0Jsb2IgPSBuZXcgQmxvYihhdWRpb0RhdGFDaHVua3MsIHtcXG4gICAgdHlwZTogYXVkaW9NaW1lVHlwZVxcbiAgfSk7XFxuXFxuICAvLyBHZXQgdGhlIHN0b3AgdGltZSBhbmQgY2FsY3VsYXRlIHRoZSBkdXJhdGlvblxcbiAgdmFyIHN0b3BUaW1lID0gRGF0ZS5ub3coKTtcXG4gIHZhciBkdXJhdGlvbiA9IHN0b3BUaW1lIC0gd2luZG93LnN0YXJ0VGltZTtcXG5cXG4gIC8vIElmIHRoZSBkdXJhdGlvbiBpcyBncmVhdGVyIHRoYW4gdGhlIHRocmVzaG9sZCwgdXBsb2FkIHRoZSBhdWRpbyBmb3IgdHJhbnNjcmlwdGlvblxcbiAgaWYgKGR1cmF0aW9uID49IHRocmVzaG9sZCkge1xcbiAgICAvLyBkb3dubG9hZCB0aGUgYXVkaW9cXG4gICAgdmFyIHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYXVkaW9CbG9iKTtcXG4gICAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XFxuICAgIGEuc3R5bGUuZGlzcGxheSA9ICdub25lJztcXG4gICAgYS5ocmVmID0gdXJsO1xcbiAgICBhLmRvd25sb2FkID0gJ3NhZmFyaV9hdWRpby5tcDQnO1xcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpO1xcbiAgICAvLyBhLmNsaWNrKCk7XFxuICAgIC8vIFVwbG9hZCB0aGUgYXVkaW8gdG8gdGhlIHNlcnZlciBmb3IgdHJhbnNjcmlwdGlvblxcbiAgICB1cGxvYWRBdWRpbyhhdWRpb0Jsb2IpO1xcbiAgfVxcblxcbiAgLy8gQ2xlYXIgdGhlIGFycmF5IGZvciB0aGUgbmV4dCByZWNvcmRpbmdcXG4gIGF1ZGlvRGF0YUNodW5rcyA9IFtdO1xcbn1cXG5mdW5jdGlvbiBzZXR1cFJlY29yZGluZyhjYWxsYmFjaykge1xcbiAgaWYgKG1lZGlhUmVjb3JkZXIpIHtcXG4gICAgcmV0dXJuO1xcbiAgfVxcblxcbiAgLy8gR2V0IGEgc3RyZWFtIGZyb20gdGhlIHVzZXIncyBtaWNyb3Bob25lXFxuICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSh7XFxuICAgIGF1ZGlvOiB0cnVlXFxuICB9KS50aGVuKGZ1bmN0aW9uIChzdHJlYW0pIHtcXG4gICAgaWYgKCFNZWRpYVJlY29yZGVyLmlzVHlwZVN1cHBvcnRlZChhdWRpb01pbWVUeXBlKSkge1xcbiAgICAgIC8vIHVzZSBNUDQgZm9yIFNhZmFyaVxcbiAgICAgIGF1ZGlvTWltZVR5cGUgPSAnYXVkaW8vbXA0JztcXG4gICAgfVxcbiAgICAvLyBDcmVhdGUgYSBuZXcgTWVkaWFSZWNvcmRlciBvYmplY3QgdXNpbmcgdGhlIHN0cmVhbSBhbmQgc3BlY2lmeWluZyB0aGUgTUlNRSB0eXBlXFxuICAgIHZhciBvcHRpb25zID0ge1xcbiAgICAgIG1pbWVUeXBlOiBhdWRpb01pbWVUeXBlXFxuICAgIH07XFxuICAgIG1lZGlhUmVjb3JkZXIgPSBuZXcgTWVkaWFSZWNvcmRlcihzdHJlYW0sIG9wdGlvbnMpO1xcblxcbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSAnZGF0YWF2YWlsYWJsZScgZXZlbnRcXG4gICAgbWVkaWFSZWNvcmRlci5hZGRFdmVudExpc3RlbmVyKCdkYXRhYXZhaWxhYmxlJywgaGFuZGxlRGF0YUF2YWlsYWJsZSk7XFxuXFxuICAgIC8vIExpc3RlbiBmb3IgdGhlICdzdG9wJyBldmVudFxcbiAgICBtZWRpYVJlY29yZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ3N0b3AnLCBoYW5kbGVTdG9wKTtcXG4gIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xcbiAgICAvLyBJbnZva2UgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uXFxuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcXG4gICAgICBjYWxsYmFjaygpO1xcbiAgICB9XFxuICB9KVtcXFwiY2F0Y2hcXFwiXShmdW5jdGlvbiAoZXJyKSB7XFxuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGdldHRpbmcgYXVkaW8gc3RyZWFtOiAnICsgZXJyKTtcXG4gIH0pO1xcbn1cXG5mdW5jdGlvbiB0ZWFyRG93blJlY29yZGluZygpIHtcXG4gIC8vIENoZWNrIGlmIHRoZSBNZWRpYVJlY29yZGVyIGlzIHNldCB1cFxcbiAgaWYgKCFtZWRpYVJlY29yZGVyKSB7XFxuICAgIHJldHVybjtcXG4gIH1cXG5cXG4gIC8vIFN0b3AgYW55IG9uZ29pbmcgcmVjb3JkaW5nXFxuICBpZiAobWVkaWFSZWNvcmRlci5zdGF0ZSA9PT0gJ3JlY29yZGluZycpIHtcXG4gICAgbWVkaWFSZWNvcmRlci5zdG9wKCk7XFxuICB9XFxuXFxuICAvLyBSZW1vdmUgdGhlIE1lZGlhUmVjb3JkZXIncyBldmVudCBsaXN0ZW5lcnNcXG4gIG1lZGlhUmVjb3JkZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignZGF0YWF2YWlsYWJsZScsIGhhbmRsZURhdGFBdmFpbGFibGUpO1xcbiAgbWVkaWFSZWNvcmRlci5yZW1vdmVFdmVudExpc3RlbmVyKCdzdG9wJywgaGFuZGxlU3RvcCk7XFxuXFxuICAvLyBDbGVhciB0aGUgTWVkaWFSZWNvcmRlciB2YXJpYWJsZVxcbiAgbWVkaWFSZWNvcmRlciA9IG51bGw7XFxufVxcblxcbi8vIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgdXNlciBwcmVzc2VzIHRoZSByZWNvcmQgYnV0dG9uXFxuZnVuY3Rpb24gc3RhcnRSZWNvcmRpbmcoKSB7XFxuICAvLyBDaGVjayBpZiB0aGUgTWVkaWFSZWNvcmRlciBpcyBzZXQgdXBcXG4gIGlmICghbWVkaWFSZWNvcmRlcikge1xcbiAgICBzZXR1cFJlY29yZGluZyhzdGFydFJlY29yZGluZyk7XFxuICAgIHJldHVybjtcXG4gIH1cXG5cXG4gIC8vIFN0YXJ0IHJlY29yZGluZ1xcbiAgbWVkaWFSZWNvcmRlci5zdGFydCgpO1xcblxcbiAgLy8gUmVjb3JkIHRoZSBzdGFydCB0aW1lXFxuICB3aW5kb3cuc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcXG4gIGNvbnNvbGUubG9nKCdSZWNvcmRpbmcgc3RhcnRlZCcpO1xcblxcbiAgLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSB1c2VyIHJlbGVhc2VzIHRoZSByZWNvcmQgYnV0dG9uXFxuICB3aW5kb3cuc3RvcFJlY29yZGluZyA9IGZ1bmN0aW9uICgpIHtcXG4gICAgaWYgKG1lZGlhUmVjb3JkZXIgJiYgbWVkaWFSZWNvcmRlci5zdGF0ZSA9PT0gJ3JlY29yZGluZycpIHtcXG4gICAgICAvLyBTdG9wIHJlY29yZGluZ1xcbiAgICAgIG1lZGlhUmVjb3JkZXIuc3RvcCgpO1xcblxcbiAgICAgIC8vIFJlY29yZCB0aGUgc3RvcCB0aW1lIGFuZCBjYWxjdWxhdGUgdGhlIGR1cmF0aW9uXFxuICAgICAgdmFyIHN0b3BUaW1lID0gRGF0ZS5ub3coKTtcXG4gICAgICB2YXIgZHVyYXRpb24gPSBzdG9wVGltZSAtIHdpbmRvdy5zdGFydFRpbWU7XFxuXFxuICAgICAgLy8gSWYgdGhlIGR1cmF0aW9uIGlzIGxlc3MgdGhhbiB0aGUgdGhyZXNob2xkLCBkb24ndCB1cGxvYWQgdGhlIGF1ZGlvIGZvciB0cmFuc2NyaXB0aW9uXFxuICAgICAgaWYgKGR1cmF0aW9uIDwgdGhyZXNob2xkKSB7XFxuICAgICAgICBjb25zb2xlLmxvZygnUmVjb3JkaW5nIHdhcyB0b28gc2hvcnQsIG5vdCB1cGxvYWRpbmcgZm9yIHRyYW5zY3JpcHRpb24nKTtcXG4gICAgICB9IGVsc2Uge1xcbiAgICAgICAgY29uc29sZS5sb2coJ1JlY29yZGluZyBzdG9wcGVkJyk7XFxuICAgICAgfVxcbiAgICB9XFxuICAgIC8vIFJlbW92ZSB0aGUgc3RvcFJlY29yZGluZyBmdW5jdGlvblxcbiAgICBkZWxldGUgd2luZG93LnN0b3BSZWNvcmRpbmc7XFxuICB9O1xcbn1cXG5cXG4vLyBBZGQgdGhlIHN0YXJ0UmVjb3JkaW5nIGZ1bmN0aW9uIHRvIHRoZSB3aW5kb3cgb2JqZWN0IHNvIGl0IGNhbiBiZSBjYWxsZWQgZnJvbSBvdXRzaWRlIHRoaXMgc2NyaXB0XFxud2luZG93LnN0YXJ0UmVjb3JkaW5nID0gc3RhcnRSZWNvcmRpbmc7XCI7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyA9PVVzZXJTY3JpcHQ9PVxuLy8gQG5hbWUgICAgICAgICBTYXksIFBpXG4vLyBAbmFtZXNwYWNlICAgIGh0dHA6Ly93d3cuc2F5cGkuYWkvXG4vLyBAdmVyc2lvbiAgICAgIDEuMi4xXG4vLyBAZGVzY3JpcHRpb24gIFNwZWFrIHRvIFBpIHdpdGggT3BlbkFJJ3MgV2hpc3BlclxuLy8gQGF1dGhvciAgICAgICBSb3NzIENhZG9nYW5cbi8vIEBtYXRjaCAgICAgICAgaHR0cHM6Ly9waS5haS90YWxrXG4vLyBAaW5qZWN0LWludG8gIHBhZ2Vcbi8vIEB1cGRhdGVVUkwgICAgaHR0cHM6Ly93d3cuc2F5cGkuYWkvc2F5cGkudXNlci5qc1xuLy8gQGRvd25sb2FkVVJMICBodHRwczovL3d3dy5zYXlwaS5haS9zYXlwaS51c2VyLmpzXG4vLyBAbGljZW5zZSAgICAgIE1JVFxuLy8gPT0vVXNlclNjcmlwdD09XG5cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgY29uc3QgbG9jYWxDb25maWcgPSB7XG4gICAgICAgIGFwcFNlcnZlclVybDogXCJodHRwOi8vbG9jYWxob3N0OjMwMDBcIixcbiAgICAgICAgYXBpU2VydmVyVXJsOiBcImh0dHBzOi8vbG9jYWxob3N0OjUwMDBcIixcbiAgICAgICAgLy8gQWRkIG90aGVyIGNvbmZpZ3VyYXRpb24gcHJvcGVydGllcyBhcyBuZWVkZWRcbiAgICB9O1xuXG4gICAgLy8gRGVmaW5lIGEgZ2xvYmFsIGNvbmZpZ3VyYXRpb24gcHJvcGVydHlcbiAgICBjb25zdCBwcm9kdWN0aW9uQ29uZmlnID0ge1xuICAgICAgICBhcHBTZXJ2ZXJVcmw6IFwiaHR0cHM6Ly9hcHAuc2F5cGkuYWlcIixcbiAgICAgICAgYXBpU2VydmVyVXJsOiBcImh0dHBzOi8vYXBpLnNheXBpLmFpXCIsXG4gICAgICAgIC8vIEFkZCBvdGhlciBjb25maWd1cmF0aW9uIHByb3BlcnRpZXMgYXMgbmVlZGVkXG4gICAgfTtcbiAgICBjb25zdCBjb25maWcgPSBwcm9kdWN0aW9uQ29uZmlnO1xuXG4gICAgY29uc3QgcGFnZVNjcmlwdCA9IHJlcXVpcmUoJ3Jhdy1sb2FkZXIhLi90cmFuc2NyaWJlci5qcycpLmRlZmF1bHQ7XG5cbiAgICAvLyBDcmVhdGUgYSBNdXRhdGlvbk9ic2VydmVyIHRvIGxpc3RlbiBmb3IgY2hhbmdlcyB0byB0aGUgRE9NXG4gICAgdmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKG11dGF0aW9ucykge1xuICAgICAgICAvLyBDaGVjayBlYWNoIG11dGF0aW9uXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbXV0YXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbXV0YXRpb24gPSBtdXRhdGlvbnNbaV07XG5cbiAgICAgICAgICAgIC8vIElmIG5vZGVzIHdlcmUgYWRkZWQsIGNoZWNrIGVhY2ggb25lXG4gICAgICAgICAgICBpZiAobXV0YXRpb24uYWRkZWROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBtdXRhdGlvbi5hZGRlZE5vZGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBub2RlID0gbXV0YXRpb24uYWRkZWROb2Rlc1tqXTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgbm9kZSBpcyB0aGUgYXBwcm9wcmlhdGUgY29udGFpbmVyIGVsZW1lbnQsIGFkZCB0aGUgYnV0dG9uIGFuZCBzdG9wIG9ic2VydmluZ1xuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnZGl2JyAmJiBub2RlLmNsYXNzTGlzdC5jb250YWlucygnZml4ZWQnKSAmJiBub2RlLmNsYXNzTGlzdC5jb250YWlucygnYm90dG9tLTE2JykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmb290ZXIgPSBub2RlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGJ1dHRvbkNvbnRhaW5lciA9IGZvb3Rlci5xdWVyeVNlbGVjdG9yKCcucmVsYXRpdmUuZmxleC5mbGV4LWNvbCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJ1dHRvbkNvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZFRhbGtCdXR0b24oYnV0dG9uQ29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ05vIGJ1dHRvbiBjb250YWluZXIgZm91bmQgaW4gZm9vdGVyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgZnVuY3Rpb24gaW5qZWN0U2NyaXB0KGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBzY3JpcHRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICAgICAgc2NyaXB0RWxlbWVudC50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIjtcbiAgICAgICAgc2NyaXB0RWxlbWVudC5pZCA9ICdzYXlwaS1zY3JpcHQnO1xuICAgICAgICBjb25zdCBjb25maWdUZXh0ID0gJ3ZhciBjb25maWcgPSAnICsgSlNPTi5zdHJpbmdpZnkoY29uZmlnKSArICc7JztcbiAgICAgICAgc2NyaXB0RWxlbWVudC50ZXh0Q29udGVudCA9IGNvbmZpZ1RleHQgKyBwYWdlU2NyaXB0O1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdEVsZW1lbnQpO1xuXG4gICAgICAgIC8vIENhbGwgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIGFmdGVyIHRoZSBzY3JpcHQgaXMgYWRkZWRcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBhZGRUYWxrQnV0dG9uKGNvbnRhaW5lcikge1xuICAgICAgICB2YXIgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgIGJ1dHRvbi5pZCA9ICd0YWxrQnV0dG9uJztcbiAgICAgICAgYnV0dG9uLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgICAgYnV0dG9uLmNsYXNzTmFtZSA9ICdyZWxhdGl2ZSBmbGV4IG10LTEgbWItMSByb3VuZGVkLWZ1bGwgcHgtMiBweS0zIHRleHQtY2VudGVyIGJnLWNyZWFtLTU1MCBob3ZlcjpiZy1jcmVhbS02NTAgaG92ZXI6dGV4dC1icmFuZC1ncmVlbi03MDAgdGV4dC1tdXRlZCc7XG4gICAgICAgIC8vIFNldCBBUklBIGxhYmVsIGFuZCB0b29sdGlwXG4gICAgICAgIGNvbnN0IGxhYmVsID0gJ1RhbGsgKEhvbGQgQ29udHJvbCArIFNwYWNlIHRvIHVzZSBob3RrZXkuIERvdWJsZSBjbGljayB0byB0b2dnbGUgYXV0by1zdWJtaXQgb24vb2ZmKSdcbiAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGxhYmVsKTtcbiAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgndGl0bGUnLCBsYWJlbCk7XG4gICAgICAgIC8vIGVuYWJsZSBhdXRvc3VibWl0IGJ5IGRlZmF1bHRcbiAgICAgICAgYnV0dG9uLmRhdGFzZXQuYXV0b3N1Ym1pdCA9ICd0cnVlJztcbiAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2F1dG9TdWJtaXQnKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gICAgICAgIGFkZFRhbGtCdXR0b25TdHlsZXMoKTtcbiAgICAgICAgYWRkVGFsa0ljb24oYnV0dG9uKTtcblxuICAgICAgICAvLyBDYWxsIHRoZSBmdW5jdGlvbiB0byBpbmplY3QgdGhlIHNjcmlwdCBhZnRlciB0aGUgYnV0dG9uIGhhcyBiZWVuIGFkZGVkXG4gICAgICAgIGluamVjdFNjcmlwdChyZWdpc3RlckF1ZGlvQnV0dG9uRXZlbnRzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRUYWxrSWNvbihidXR0b24pIHtcbiAgICAgICAgdmFyIGljb25IdG1sID0gYFxuICAgICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2ZXJzaW9uPVwiMS4wXCIgdmlld0JveD1cIjAgMCA1Ni4yNSAzMFwiIGNsYXNzPVwid2F2ZWZvcm1cIj5cbiAgICAgICAgPGRlZnM+XG4gICAgICAgICAgICA8Y2xpcFBhdGggaWQ9XCJhXCI+XG4gICAgICAgICAgICAgICAgPHBhdGggZD1cIk0uNTQgMTJIM3Y1SC41NFptMCAwXCIvPlxuICAgICAgICAgICAgPC9jbGlwUGF0aD5cbiAgICAgICAgICAgIDxjbGlwUGF0aCBpZD1cImJcIj5cbiAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTI1IDIuMmgydjI0LjY4aC0yWm0wIDBcIi8+XG4gICAgICAgICAgICA8L2NsaXBQYXRoPlxuICAgICAgICAgICAgPGNsaXBQYXRoIGlkPVwiY1wiPlxuICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNNTMgMTJoMS45OHY1SDUzWm0wIDBcIi8+XG4gICAgICAgICAgICA8L2NsaXBQYXRoPlxuICAgICAgICA8L2RlZnM+XG4gICAgICAgIDxnIGNsaXAtcGF0aD1cInVybCgjYSlcIj5cbiAgICAgICAgICAgIDxwYXRoIGQ9XCJNMS40OCAxMi43MWMtLjUgMC0uOS40LS45Ljl2MS44NWEuOS45IDAgMCAwIDEuOCAwdi0xLjg0YzAtLjUtLjQtLjktLjktLjlabTAgMFwiLz5cbiAgICAgICAgPC9nPlxuICAgICAgICA8cGF0aCBkPVwiTTQuOTggNi42M2MtLjUgMC0uOS40LS45Ljl2MTQuMDFhLjkuOSAwIDAgMCAxLjgxIDB2LTE0YzAtLjUtLjQtLjkyLS45LS45MlptMy41MSAzLjFhLjkuOSAwIDAgMC0uOS45MXY3Ljc5YS45LjkgMCAwIDAgMS44IDB2LTcuNzljMC0uNS0uNC0uOS0uOS0uOVpNMTIgMy44M2EuOS45IDAgMCAwLS45MS45djE5LjZhLjkuOSAwIDAgMCAxLjggMFY0Ljc0YzAtLjUtLjQtLjktLjktLjlabTMuNSA4LjI5YS45LjkgMCAwIDAtLjkxLjl2My4wM2EuOS45IDAgMCAwIDEuODEgMHYtMy4wM2MwLS41LS40LS45LS45LS45Wk0xOSA2LjhjLS41IDAtLjkuNC0uOS45djEzLjY4YS45LjkgMCAwIDAgMS44IDBWNy43YzAtLjUtLjQtLjktLjktLjlabTMuNTgtMi45N2gtLjAxYy0uNSAwLS45LjQtLjkuOWwtLjEzIDE5LjZjMCAuNS40LjkuOS45MS41IDAgLjktLjQuOS0uOWwuMTQtMTkuNmEuOS45IDAgMCAwLS45LS45Wm0wIDBcIi8+XG4gICAgICAgIDxnIGNsaXAtcGF0aD1cInVybCgjYilcIj5cbiAgICAgICAgICAgIDxwYXRoIGQ9XCJNMjYgMi4yYy0uNSAwLS45LjQtLjkuOXYyMi44NmEuOS45IDAgMSAwIDEuODEgMFYzLjExYS45LjkgMCAwIDAtLjktLjkxWm0wIDBcIi8+XG4gICAgICAgIDwvZz5cbiAgICAgICAgPHBhdGggZD1cIk0yOS41MiA3LjcxYS45LjkgMCAwIDAtLjkxLjl2MTEuODVhLjkuOSAwIDAgMCAxLjgxIDBWOC42MmMwLS41LS40LS45LS45LS45Wm0zLjUgMi45M2EuOS45IDAgMCAwLS45LjkxdjUuOTdhLjkuOSAwIDAgMCAxLjggMHYtNS45N2MwLS41LS40LS45LS45LS45Wm0zLjUtNS43OGMtLjUgMC0uOS40LS45Ljl2MTcuNTVhLjkuOSAwIDAgMCAxLjgxIDBWNS43NmMwLS41LS40LS45LS45LS45Wm0zLjUxIDMuMzRjLS41IDAtLjkuNC0uOS45djEwLjg3YS45LjkgMCAwIDAgMS44IDBWOS4xYS45LjkgMCAwIDAtLjktLjkxWm0zLjUgMy4wOGMtLjUgMC0uOS40LS45LjkxdjQuN2EuOS45IDAgMSAwIDEuOCAwdi00LjdhLjkuOSAwIDAgMC0uOS0uOVptMy41MS03LjQ1YS45LjkgMCAwIDAtLjkxLjl2MTkuNmEuOS45IDAgMCAwIDEuODEgMFY0Ljc0YzAtLjUtLjQtLjktLjktLjlabTMuNSA1LjU3YS45LjkgMCAwIDAtLjkuOTF2OC40NWEuOS45IDAgMCAwIDEuOCAwdi04LjQ1YzAtLjUtLjQtLjktLjktLjlabTAgMFwiLz5cbiAgICAgICAgPGcgY2xpcC1wYXRoPVwidXJsKCNjKVwiPlxuICAgICAgICAgICAgPHBhdGggZD1cIk01NC4wNCAxMi45NmEuOS45IDAgMCAwLS45LjkxdjEuMzNhLjkuOSAwIDEgMCAxLjggMHYtMS4zMmEuOS45IDAgMCAwLS45LS45MlptMCAwXCIvPlxuICAgICAgICA8L2c+XG4gICAgPC9zdmc+XG4gICAgXG4gICAgICAgIGA7XG4gICAgICAgIHZhciBpY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdzdmcnKTtcbiAgICAgICAgYnV0dG9uLmFwcGVuZENoaWxkKGljb24pO1xuICAgICAgICBpY29uLm91dGVySFRNTCA9IGljb25IdG1sO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFN0eWxlcyhjc3MpIHtcbiAgICAgICAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgICAgICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFRhbGtCdXR0b25TdHlsZXMoKSB7XG4gICAgICAgIHZhciBpc0ZpcmVmb3hBbmRyb2lkID0gL0ZpcmVmb3gvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgJiYgL0FuZHJvaWQvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gICAgICAgIGlmIChpc0ZpcmVmb3hBbmRyb2lkKSB7XG4gICAgICAgICAgICAvLyBoYWNrIGZvciBGaXJlZm94IG9uIEFuZHJvaWQsIHdoaWNoIGRvZXNuJ3Qgc3VwcG9ydCA6YWN0aXZlIGNvcnJlY3RseVxuICAgICAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2ZpcmVmb3gtYW5kcm9pZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYnV0dG9uIGFuaW1hdGlvblxuICAgICAgICBhZGRTdHlsZXMoYFxuICAgICAgICAgICAgQGtleWZyYW1lcyBwdWxzZSB7XG4gICAgICAgICAgICAgICAgMCUge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA1MCUge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDEwMCUge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICN0YWxrQnV0dG9uIHtcbiAgICAgICAgICAgICAgICBtYXJnaW4tdG9wOiAwLjI1cmVtO1xuICAgICAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE4cHg7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDEyMHB4O1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrOyAvKiBGb3IgU2FmYXJpICovXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGh0bWw6bm90KC5maXJlZm94LWFuZHJvaWQpICN0YWxrQnV0dG9uOmFjdGl2ZSAud2F2ZWZvcm0sXG4gICAgICAgICAgICAjdGFsa0J1dHRvbi5hY3RpdmUgLndhdmVmb3JtIHtcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IHB1bHNlIDFzIGluZmluaXRlO1xuICAgICAgICAgICAgfSAgICAgICAgICAgIFxuICAgICAgICAgICAgI3RhbGtCdXR0b24gLndhdmVmb3JtIHtcbiAgICAgICAgICAgICAgICBmaWxsOiAjNzc2ZDZkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgI3RhbGtCdXR0b24uYXV0b1N1Ym1pdCAud2F2ZWZvcm0ge1xuICAgICAgICAgICAgICAgIGZpbGw6IHJnYig2NSAxMzggNDcpOyAvKiBQaSdzIHRleHQtYnJhbmQtZ3JlZW4tNjAwICovXG4gICAgICAgICAgICB9XG4gICAgICAgIGApO1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVnaXN0ZXJBdWRpb0J1dHRvbkV2ZW50cygpIHtcbiAgICAgICAgdmFyIGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWxrQnV0dG9uJyk7XG4gICAgICAgIHZhciBjb250ZXh0ID0gd2luZG93O1xuICAgICAgICBpZiAoR01faW5mby5zY3JpcHRIYW5kbGVyICE9PSAnVXNlcnNjcmlwdHMnKSB7XG4gICAgICAgICAgICBjb250ZXh0ID0gdW5zYWZlV2luZG93O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRm9yIGRlc2t0b3BcbiAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlkUHJvbXB0VGV4dEFyZWEoKTtcbiAgICAgICAgICAgIGNvbnRleHQuc3RhcnRSZWNvcmRpbmcoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29udGV4dC5zdG9wUmVjb3JkaW5nKCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZWdpc3RlckhvdGtleSgpO1xuXG4gICAgICAgIC8vIFwid2FybSB1cFwiIHRoZSBtaWNyb3Bob25lIGJ5IGFjcXVpcmluZyBpdCBiZWZvcmUgdGhlIHVzZXIgcHJlc3NlcyB0aGUgYnV0dG9uXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWxrQnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIHNldHVwUmVjb3JkaW5nKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhbGtCdXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgdGVhckRvd25SZWNvcmRpbmcpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmVmb3JldW5sb2FkJywgdGVhckRvd25SZWNvcmRpbmcpO1xuXG4gICAgICAgIC8vIEF0dGFjaCBhIGRvdWJsZSBjbGljayBldmVudCBsaXN0ZW5lciB0byB0aGUgdGFsayBidXR0b25cbiAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gVG9nZ2xlIHRoZSBDU1MgY2xhc3NlcyB0byBpbmRpY2F0ZSB0aGUgbW9kZVxuICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoJ2F1dG9TdWJtaXQnKTtcblxuICAgICAgICAgICAgLy8gU3RvcmUgdGhlIHN0YXRlIG9uIHRoZSBidXR0b24gZWxlbWVudCB1c2luZyBhIGN1c3RvbSBkYXRhIGF0dHJpYnV0ZVxuICAgICAgICAgICAgaWYgKGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXV0b3N1Ym1pdCcpID09PSAndHJ1ZScpIHtcbiAgICAgICAgICAgICAgICBidXR0b24uc2V0QXR0cmlidXRlKCdkYXRhLWF1dG9zdWJtaXQnLCAnZmFsc2UnKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnYXV0b3N1Ym1pdCBkaXNhYmxlZCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBidXR0b24uc2V0QXR0cmlidXRlKCdkYXRhLWF1dG9zdWJtaXQnLCAndHJ1ZScpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhdXRvc3VibWl0IGVuYWJsZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gRm9yIG1vYmlsZVxuICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7IC8vIFByZXZlbnQgdGhlIGRlZmF1bHQgY2xpY2sgYmVoYXZpb3IgZnJvbSBoYXBwZW5pbmdcbiAgICAgICAgICAgIGlkUHJvbXB0VGV4dEFyZWEoKTtcbiAgICAgICAgICAgIGNvbnRleHQuc3RhcnRSZWNvcmRpbmcoKTtcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7IC8vIEFkZCB0aGUgYWN0aXZlIGNsYXNzIChmb3IgRmlyZWZveCBvbiBBbmRyb2lkKVxuICAgICAgICB9KTtcbiAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTsgLy8gUmVtb3ZlIHRoZSBhY3RpdmUgY2xhc3MgKGZvciBGaXJlZm94IG9uIEFuZHJvaWRcbiAgICAgICAgICAgIGNvbnRleHQuc3RvcFJlY29yZGluZygpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhbGtCdXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7IC8vIFJlbW92ZSB0aGUgYWN0aXZlIGNsYXNzIChmb3IgRmlyZWZveCBvbiBBbmRyb2lkXG4gICAgICAgICAgICB0ZWFyRG93blJlY29yZGluZygpO1xuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIHJlZ2lzdGVySG90a2V5KCkge1xuICAgICAgICAvLyBSZWdpc3RlciBhIGhvdGtleSBmb3IgdGhlIGJ1dHRvblxuICAgICAgICBsZXQgY3RybERvd24gPSBmYWxzZTtcblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuY3RybEtleSAmJiBldmVudC5jb2RlID09PSAnU3BhY2UnICYmICFjdHJsRG93bikge1xuICAgICAgICAgICAgICAgIGN0cmxEb3duID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAvLyBTaW11bGF0ZSBtb3VzZWRvd24gZXZlbnRcbiAgICAgICAgICAgICAgICBsZXQgbW91c2VEb3duRXZlbnQgPSBuZXcgRXZlbnQoJ21vdXNlZG93bicpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWxrQnV0dG9uJykuZGlzcGF0Y2hFdmVudChtb3VzZURvd25FdmVudCk7XG4gICAgICAgICAgICAgICAgdGFsa0J1dHRvbi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTsgLy8gQWRkIHRoZSBhY3RpdmUgY2xhc3NcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChjdHJsRG93biAmJiBldmVudC5jb2RlID09PSAnU3BhY2UnKSB7XG4gICAgICAgICAgICAgICAgY3RybERvd24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAvLyBTaW11bGF0ZSBtb3VzZXVwIGV2ZW50XG4gICAgICAgICAgICAgICAgbGV0IG1vdXNlVXBFdmVudCA9IG5ldyBFdmVudCgnbW91c2V1cCcpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWxrQnV0dG9uJykuZGlzcGF0Y2hFdmVudChtb3VzZVVwRXZlbnQpO1xuICAgICAgICAgICAgICAgIHRhbGtCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gaWRQcm9tcHRUZXh0QXJlYSgpIHtcbiAgICAgICAgdmFyIHRleHRhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb21wdCcpO1xuICAgICAgICBpZiAoIXRleHRhcmVhKSB7XG4gICAgICAgICAgICAvLyBGaW5kIHRoZSBmaXJzdCA8dGV4dGFyZWE+IGVsZW1lbnQgYW5kIGdpdmUgaXQgYW4gaWRcbiAgICAgICAgICAgIHZhciB0ZXh0YXJlYUVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYScpO1xuICAgICAgICAgICAgaWYgKHRleHRhcmVhRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHRleHRhcmVhRWxlbWVudC5pZCA9ICdwcm9tcHQnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTm8gPHRleHRhcmVhPiBlbGVtZW50IGZvdW5kJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTdGFydCBvYnNlcnZpbmcgdGhlIGVudGlyZSBkb2N1bWVudCBmb3IgY2hhbmdlcyB0byBjaGlsZCBub2RlcyBhbmQgc3VidHJlZVxuICAgIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQsIHsgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH0pO1xufSkoKTtcbiJdLCJuYW1lcyI6WyJsb2NhbENvbmZpZyIsImFwcFNlcnZlclVybCIsImFwaVNlcnZlclVybCIsInByb2R1Y3Rpb25Db25maWciLCJjb25maWciLCJwYWdlU2NyaXB0IiwicmVxdWlyZSIsIm9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsIm11dGF0aW9ucyIsImkiLCJsZW5ndGgiLCJtdXRhdGlvbiIsImFkZGVkTm9kZXMiLCJqIiwibm9kZSIsIm5vZGVOYW1lIiwidG9Mb3dlckNhc2UiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsImZvb3RlciIsImJ1dHRvbkNvbnRhaW5lciIsInF1ZXJ5U2VsZWN0b3IiLCJhZGRUYWxrQnV0dG9uIiwiY29uc29sZSIsImxvZyIsImRpc2Nvbm5lY3QiLCJpbmplY3RTY3JpcHQiLCJjYWxsYmFjayIsInNjcmlwdEVsZW1lbnQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJ0eXBlIiwiaWQiLCJjb25maWdUZXh0IiwiSlNPTiIsInN0cmluZ2lmeSIsInRleHRDb250ZW50IiwiYm9keSIsImFwcGVuZENoaWxkIiwiY29udGFpbmVyIiwiYnV0dG9uIiwiY2xhc3NOYW1lIiwibGFiZWwiLCJzZXRBdHRyaWJ1dGUiLCJkYXRhc2V0IiwiYXV0b3N1Ym1pdCIsImFkZCIsImFkZFRhbGtCdXR0b25TdHlsZXMiLCJhZGRUYWxrSWNvbiIsInJlZ2lzdGVyQXVkaW9CdXR0b25FdmVudHMiLCJpY29uSHRtbCIsImljb24iLCJjcmVhdGVFbGVtZW50TlMiLCJvdXRlckhUTUwiLCJhZGRTdHlsZXMiLCJjc3MiLCJzdHlsZSIsImNyZWF0ZVRleHROb2RlIiwiaGVhZCIsImlzRmlyZWZveEFuZHJvaWQiLCJ0ZXN0IiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwiZG9jdW1lbnRFbGVtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJjb250ZXh0Iiwid2luZG93IiwiR01faW5mbyIsInNjcmlwdEhhbmRsZXIiLCJ1bnNhZmVXaW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwiaWRQcm9tcHRUZXh0QXJlYSIsInN0YXJ0UmVjb3JkaW5nIiwic3RvcFJlY29yZGluZyIsInJlZ2lzdGVySG90a2V5Iiwic2V0dXBSZWNvcmRpbmciLCJ0ZWFyRG93blJlY29yZGluZyIsInRvZ2dsZSIsImdldEF0dHJpYnV0ZSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInJlbW92ZSIsImN0cmxEb3duIiwiZXZlbnQiLCJjdHJsS2V5IiwiY29kZSIsIm1vdXNlRG93bkV2ZW50IiwiRXZlbnQiLCJkaXNwYXRjaEV2ZW50IiwidGFsa0J1dHRvbiIsIm1vdXNlVXBFdmVudCIsInRleHRhcmVhIiwidGV4dGFyZWFFbGVtZW50Iiwib2JzZXJ2ZSIsImNoaWxkTGlzdCIsInN1YnRyZWUiXSwic291cmNlUm9vdCI6IiJ9