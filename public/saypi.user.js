// ==UserScript==
// @name         Say, Pi
// @namespace    http://www.saypi.ai/
// @version      1.2.2
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("// audio output (Pi)\nvar audioElement = document.querySelector('audio');\nvar piAudioManager = {\n  isSpeaking: false,\n  audioElement: audioElement,\n  // Use the existing audio element\n\n  play: function play(src) {\n    this.audioElement.src = src;\n    this.audioElement.play();\n  },\n  stop: function stop() {\n    if (this.isSpeaking) {\n      this.audioElement.pause();\n    }\n    if (this.audioElement.duration && this.audioElement.currentTime < this.audioElement.duration && !this.audioElement.ended) {\n      this.audioElement.currentTime = this.audioElement.duration; // seek the audio to the end\n      this.audioElement.play(); // trigger the ended event\n    }\n  },\n\n  pause: function pause() {\n    this.audioElement.pause();\n  },\n  resume: function resume() {\n    this.audioElement.play();\n  }\n};\naudioElement.addEventListener('play', function () {\n  if (!audioElement.ended) {\n    console.log('Pi is speaking');\n    piAudioManager.isSpeaking = true;\n  }\n});\naudioElement.addEventListener('pause', function () {\n  console.log('Pi stopped speaking');\n  piAudioManager.isSpeaking = false;\n});\naudioElement.addEventListener('ended', function () {\n  console.log('Pi finished speaking');\n  piAudioManager.isSpeaking = false;\n});\n\n// audio input (user)\nvar audioDataChunks = [];\nvar audioMimeType = 'audio/webm;codecs=opus';\nfunction uploadAudio(audioBlob) {\n  // Create a FormData object\n  var formData = new FormData();\n  var audioFilename = 'audio.webm';\n  if (audioBlob.type === 'audio/mp4') {\n    audioFilename = 'audio.mp4';\n  }\n  // Add the audio blob to the FormData object\n  formData.append('audio', audioBlob, audioFilename);\n  // Get the user's preferred language\n  var language = navigator.language;\n  // Post the audio to the server for transcription\n  fetch(config.apiServerUrl + '/transcribe?language=' + language, {\n    method: 'POST',\n    body: formData\n  }).then(function (response) {\n    if (!response.ok) {\n      throw Error(response.statusText);\n    }\n    return response.json();\n  }).then(handleTranscriptionResponse)[\"catch\"](function (error) {\n    console.error('Looks like there was a problem: ', error);\n    var textarea = document.getElementById('prompt');\n    textarea.value = 'Sorry, there was a problem transcribing your audio. Please try again later.';\n  });\n}\nfunction handleTranscriptionResponse(responseJson) {\n  var textarea = document.getElementById('prompt');\n  simulateTyping(textarea, responseJson.text + \" \");\n  console.log('Transcript: ' + responseJson.text);\n}\nfunction setNativeValue(element, value) {\n  var lastValue = element.value;\n  element.value = value;\n  var event = new Event(\"input\", {\n    target: element,\n    bubbles: true\n  });\n  // React 15\n  event.simulated = true;\n  // React 16-17\n  var tracker = element._valueTracker;\n  if (tracker) {\n    tracker.setValue(lastValue);\n  }\n  element.dispatchEvent(event);\n}\nfunction simulateFormSubmit(textarea) {\n  var enterEvent = new KeyboardEvent('keydown', {\n    bubbles: true,\n    key: 'Enter',\n    keyCode: 13,\n    which: 13\n  });\n  textarea.dispatchEvent(enterEvent);\n}\nfunction simulateTyping(element, text) {\n  var words = text.split(' '); // Split the text into words (may not be ideal for all languages)\n  var i = 0;\n  function typeWord() {\n    if (i < words.length) {\n      // Append the next word and a space, then increment i\n      setNativeValue(element, element.value + words[i++] + ' ');\n      // Call this function again before the next repaint\n      requestAnimationFrame(typeWord);\n    } else {\n      // Check if autosubmit is enabled\n      var talkButton = document.getElementById('talkButton');\n      if (talkButton.dataset.autosubmit === 'false') {\n        console.log('Autosubmit is disabled');\n      } else {\n        // Simulate an \"Enter\" keypress event\n        simulateFormSubmit(element);\n      }\n    }\n  }\n  // Start typing\n  typeWord();\n}\n\n// Declare a global variable for the mediaRecorder\nvar mediaRecorder;\nvar threshold = 1000; // 1000 ms = 1 second, about the length of \"Hey, Pi\"\n\n// This function will be called when the 'dataavailable' event fires\nfunction handleDataAvailable(e) {\n  // Add the audio data chunk to the array\n  audioDataChunks.push(e.data);\n}\n\n// This function will be called when the 'stop' event fires\nfunction handleStop() {\n  // Create a Blob from the audio data chunks\n  var audioBlob = new Blob(audioDataChunks, {\n    type: audioMimeType\n  });\n\n  // Get the stop time and calculate the duration\n  var stopTime = Date.now();\n  var duration = stopTime - window.startTime;\n\n  // If the duration is greater than the threshold, upload the audio for transcription\n  if (duration >= threshold) {\n    // download the audio\n    var url = URL.createObjectURL(audioBlob);\n    var a = document.createElement('a');\n    a.style.display = 'none';\n    a.href = url;\n    a.download = 'safari_audio.mp4';\n    document.body.appendChild(a);\n    // a.click();\n    // Upload the audio to the server for transcription\n    uploadAudio(audioBlob);\n  }\n\n  // Clear the array for the next recording\n  audioDataChunks = [];\n}\nfunction setupRecording(callback) {\n  if (mediaRecorder) {\n    return;\n  }\n\n  // Get a stream from the user's microphone\n  navigator.mediaDevices.getUserMedia({\n    audio: true\n  }).then(function (stream) {\n    if (!MediaRecorder.isTypeSupported(audioMimeType)) {\n      // use MP4 for Safari\n      audioMimeType = 'audio/mp4';\n    }\n    // Create a new MediaRecorder object using the stream and specifying the MIME type\n    var options = {\n      mimeType: audioMimeType\n    };\n    mediaRecorder = new MediaRecorder(stream, options);\n\n    // Listen for the 'dataavailable' event\n    mediaRecorder.addEventListener('dataavailable', handleDataAvailable);\n\n    // Listen for the 'stop' event\n    mediaRecorder.addEventListener('stop', handleStop);\n  }).then(function () {\n    // Invoke the callback function\n    if (typeof callback === 'function') {\n      callback();\n    }\n  })[\"catch\"](function (err) {\n    console.error('Error getting audio stream: ' + err);\n  });\n}\nfunction tearDownRecording() {\n  // Check if the MediaRecorder is set up\n  if (!mediaRecorder) {\n    return;\n  }\n\n  // Stop any ongoing recording\n  if (mediaRecorder.state === 'recording') {\n    mediaRecorder.stop();\n  }\n\n  // Remove the MediaRecorder's event listeners\n  mediaRecorder.removeEventListener('dataavailable', handleDataAvailable);\n  mediaRecorder.removeEventListener('stop', handleStop);\n\n  // Clear the MediaRecorder variable\n  mediaRecorder = null;\n}\n\n// This function will be called when the user presses the record button\nfunction startRecording() {\n  // Check if the MediaRecorder is set up\n  if (!mediaRecorder) {\n    setupRecording(startRecording);\n    return;\n  }\n  // Check if Pi is currently speaking and stop her audio\n  if (piAudioManager.isSpeaking) {\n    piAudioManager.pause();\n  }\n\n  // Start recording\n  mediaRecorder.start();\n\n  // Record the start time\n  window.startTime = Date.now();\n  console.log('User is speaking');\n\n  // This function will be called when the user releases the record button\n  window.stopRecording = function () {\n    if (mediaRecorder && mediaRecorder.state === 'recording') {\n      // Stop recording\n      mediaRecorder.stop();\n\n      // Record the stop time and calculate the duration\n      var stopTime = Date.now();\n      var duration = stopTime - window.startTime;\n\n      // If the duration is less than the threshold, don't upload the audio for transcription\n      if (duration < threshold) {\n        console.log('User stopped speaking');\n        console.log('Recording was too short, not uploading for transcription');\n        piAudioManager.resume();\n      } else {\n        console.log('User finished speaking');\n        piAudioManager.stop();\n      }\n    }\n    // Remove the stopRecording function\n    delete window.stopRecording;\n  };\n}\n\n// Add the startRecording function to the window object so it can be called from outside this script\nwindow.startRecording = startRecording;");

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
    // @version      1.2.2
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUMsQ0FBQztBQUNsRSxDQUFDLEVBQUUsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy90cmFuc2NyaWJlci5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9zYXlwaS5pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBcIi8vIGF1ZGlvIG91dHB1dCAoUGkpXFxudmFyIGF1ZGlvRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2F1ZGlvJyk7XFxudmFyIHBpQXVkaW9NYW5hZ2VyID0ge1xcbiAgaXNTcGVha2luZzogZmFsc2UsXFxuICBhdWRpb0VsZW1lbnQ6IGF1ZGlvRWxlbWVudCxcXG4gIC8vIFVzZSB0aGUgZXhpc3RpbmcgYXVkaW8gZWxlbWVudFxcblxcbiAgcGxheTogZnVuY3Rpb24gcGxheShzcmMpIHtcXG4gICAgdGhpcy5hdWRpb0VsZW1lbnQuc3JjID0gc3JjO1xcbiAgICB0aGlzLmF1ZGlvRWxlbWVudC5wbGF5KCk7XFxuICB9LFxcbiAgc3RvcDogZnVuY3Rpb24gc3RvcCgpIHtcXG4gICAgaWYgKHRoaXMuaXNTcGVha2luZykge1xcbiAgICAgIHRoaXMuYXVkaW9FbGVtZW50LnBhdXNlKCk7XFxuICAgIH1cXG4gICAgaWYgKHRoaXMuYXVkaW9FbGVtZW50LmR1cmF0aW9uICYmIHRoaXMuYXVkaW9FbGVtZW50LmN1cnJlbnRUaW1lIDwgdGhpcy5hdWRpb0VsZW1lbnQuZHVyYXRpb24gJiYgIXRoaXMuYXVkaW9FbGVtZW50LmVuZGVkKSB7XFxuICAgICAgdGhpcy5hdWRpb0VsZW1lbnQuY3VycmVudFRpbWUgPSB0aGlzLmF1ZGlvRWxlbWVudC5kdXJhdGlvbjsgLy8gc2VlayB0aGUgYXVkaW8gdG8gdGhlIGVuZFxcbiAgICAgIHRoaXMuYXVkaW9FbGVtZW50LnBsYXkoKTsgLy8gdHJpZ2dlciB0aGUgZW5kZWQgZXZlbnRcXG4gICAgfVxcbiAgfSxcXG5cXG4gIHBhdXNlOiBmdW5jdGlvbiBwYXVzZSgpIHtcXG4gICAgdGhpcy5hdWRpb0VsZW1lbnQucGF1c2UoKTtcXG4gIH0sXFxuICByZXN1bWU6IGZ1bmN0aW9uIHJlc3VtZSgpIHtcXG4gICAgdGhpcy5hdWRpb0VsZW1lbnQucGxheSgpO1xcbiAgfVxcbn07XFxuYXVkaW9FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXknLCBmdW5jdGlvbiAoKSB7XFxuICBpZiAoIWF1ZGlvRWxlbWVudC5lbmRlZCkge1xcbiAgICBjb25zb2xlLmxvZygnUGkgaXMgc3BlYWtpbmcnKTtcXG4gICAgcGlBdWRpb01hbmFnZXIuaXNTcGVha2luZyA9IHRydWU7XFxuICB9XFxufSk7XFxuYXVkaW9FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BhdXNlJywgZnVuY3Rpb24gKCkge1xcbiAgY29uc29sZS5sb2coJ1BpIHN0b3BwZWQgc3BlYWtpbmcnKTtcXG4gIHBpQXVkaW9NYW5hZ2VyLmlzU3BlYWtpbmcgPSBmYWxzZTtcXG59KTtcXG5hdWRpb0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZW5kZWQnLCBmdW5jdGlvbiAoKSB7XFxuICBjb25zb2xlLmxvZygnUGkgZmluaXNoZWQgc3BlYWtpbmcnKTtcXG4gIHBpQXVkaW9NYW5hZ2VyLmlzU3BlYWtpbmcgPSBmYWxzZTtcXG59KTtcXG5cXG4vLyBhdWRpbyBpbnB1dCAodXNlcilcXG52YXIgYXVkaW9EYXRhQ2h1bmtzID0gW107XFxudmFyIGF1ZGlvTWltZVR5cGUgPSAnYXVkaW8vd2VibTtjb2RlY3M9b3B1cyc7XFxuZnVuY3Rpb24gdXBsb2FkQXVkaW8oYXVkaW9CbG9iKSB7XFxuICAvLyBDcmVhdGUgYSBGb3JtRGF0YSBvYmplY3RcXG4gIHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xcbiAgdmFyIGF1ZGlvRmlsZW5hbWUgPSAnYXVkaW8ud2VibSc7XFxuICBpZiAoYXVkaW9CbG9iLnR5cGUgPT09ICdhdWRpby9tcDQnKSB7XFxuICAgIGF1ZGlvRmlsZW5hbWUgPSAnYXVkaW8ubXA0JztcXG4gIH1cXG4gIC8vIEFkZCB0aGUgYXVkaW8gYmxvYiB0byB0aGUgRm9ybURhdGEgb2JqZWN0XFxuICBmb3JtRGF0YS5hcHBlbmQoJ2F1ZGlvJywgYXVkaW9CbG9iLCBhdWRpb0ZpbGVuYW1lKTtcXG4gIC8vIEdldCB0aGUgdXNlcidzIHByZWZlcnJlZCBsYW5ndWFnZVxcbiAgdmFyIGxhbmd1YWdlID0gbmF2aWdhdG9yLmxhbmd1YWdlO1xcbiAgLy8gUG9zdCB0aGUgYXVkaW8gdG8gdGhlIHNlcnZlciBmb3IgdHJhbnNjcmlwdGlvblxcbiAgZmV0Y2goY29uZmlnLmFwaVNlcnZlclVybCArICcvdHJhbnNjcmliZT9sYW5ndWFnZT0nICsgbGFuZ3VhZ2UsIHtcXG4gICAgbWV0aG9kOiAnUE9TVCcsXFxuICAgIGJvZHk6IGZvcm1EYXRhXFxuICB9KS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xcbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XFxuICAgICAgdGhyb3cgRXJyb3IocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XFxuICAgIH1cXG4gICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcXG4gIH0pLnRoZW4oaGFuZGxlVHJhbnNjcmlwdGlvblJlc3BvbnNlKVtcXFwiY2F0Y2hcXFwiXShmdW5jdGlvbiAoZXJyb3IpIHtcXG4gICAgY29uc29sZS5lcnJvcignTG9va3MgbGlrZSB0aGVyZSB3YXMgYSBwcm9ibGVtOiAnLCBlcnJvcik7XFxuICAgIHZhciB0ZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9tcHQnKTtcXG4gICAgdGV4dGFyZWEudmFsdWUgPSAnU29ycnksIHRoZXJlIHdhcyBhIHByb2JsZW0gdHJhbnNjcmliaW5nIHlvdXIgYXVkaW8uIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuJztcXG4gIH0pO1xcbn1cXG5mdW5jdGlvbiBoYW5kbGVUcmFuc2NyaXB0aW9uUmVzcG9uc2UocmVzcG9uc2VKc29uKSB7XFxuICB2YXIgdGV4dGFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvbXB0Jyk7XFxuICBzaW11bGF0ZVR5cGluZyh0ZXh0YXJlYSwgcmVzcG9uc2VKc29uLnRleHQgKyBcXFwiIFxcXCIpO1xcbiAgY29uc29sZS5sb2coJ1RyYW5zY3JpcHQ6ICcgKyByZXNwb25zZUpzb24udGV4dCk7XFxufVxcbmZ1bmN0aW9uIHNldE5hdGl2ZVZhbHVlKGVsZW1lbnQsIHZhbHVlKSB7XFxuICB2YXIgbGFzdFZhbHVlID0gZWxlbWVudC52YWx1ZTtcXG4gIGVsZW1lbnQudmFsdWUgPSB2YWx1ZTtcXG4gIHZhciBldmVudCA9IG5ldyBFdmVudChcXFwiaW5wdXRcXFwiLCB7XFxuICAgIHRhcmdldDogZWxlbWVudCxcXG4gICAgYnViYmxlczogdHJ1ZVxcbiAgfSk7XFxuICAvLyBSZWFjdCAxNVxcbiAgZXZlbnQuc2ltdWxhdGVkID0gdHJ1ZTtcXG4gIC8vIFJlYWN0IDE2LTE3XFxuICB2YXIgdHJhY2tlciA9IGVsZW1lbnQuX3ZhbHVlVHJhY2tlcjtcXG4gIGlmICh0cmFja2VyKSB7XFxuICAgIHRyYWNrZXIuc2V0VmFsdWUobGFzdFZhbHVlKTtcXG4gIH1cXG4gIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XFxufVxcbmZ1bmN0aW9uIHNpbXVsYXRlRm9ybVN1Ym1pdCh0ZXh0YXJlYSkge1xcbiAgdmFyIGVudGVyRXZlbnQgPSBuZXcgS2V5Ym9hcmRFdmVudCgna2V5ZG93bicsIHtcXG4gICAgYnViYmxlczogdHJ1ZSxcXG4gICAga2V5OiAnRW50ZXInLFxcbiAgICBrZXlDb2RlOiAxMyxcXG4gICAgd2hpY2g6IDEzXFxuICB9KTtcXG4gIHRleHRhcmVhLmRpc3BhdGNoRXZlbnQoZW50ZXJFdmVudCk7XFxufVxcbmZ1bmN0aW9uIHNpbXVsYXRlVHlwaW5nKGVsZW1lbnQsIHRleHQpIHtcXG4gIHZhciB3b3JkcyA9IHRleHQuc3BsaXQoJyAnKTsgLy8gU3BsaXQgdGhlIHRleHQgaW50byB3b3JkcyAobWF5IG5vdCBiZSBpZGVhbCBmb3IgYWxsIGxhbmd1YWdlcylcXG4gIHZhciBpID0gMDtcXG4gIGZ1bmN0aW9uIHR5cGVXb3JkKCkge1xcbiAgICBpZiAoaSA8IHdvcmRzLmxlbmd0aCkge1xcbiAgICAgIC8vIEFwcGVuZCB0aGUgbmV4dCB3b3JkIGFuZCBhIHNwYWNlLCB0aGVuIGluY3JlbWVudCBpXFxuICAgICAgc2V0TmF0aXZlVmFsdWUoZWxlbWVudCwgZWxlbWVudC52YWx1ZSArIHdvcmRzW2krK10gKyAnICcpO1xcbiAgICAgIC8vIENhbGwgdGhpcyBmdW5jdGlvbiBhZ2FpbiBiZWZvcmUgdGhlIG5leHQgcmVwYWludFxcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0eXBlV29yZCk7XFxuICAgIH0gZWxzZSB7XFxuICAgICAgLy8gQ2hlY2sgaWYgYXV0b3N1Ym1pdCBpcyBlbmFibGVkXFxuICAgICAgdmFyIHRhbGtCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFsa0J1dHRvbicpO1xcbiAgICAgIGlmICh0YWxrQnV0dG9uLmRhdGFzZXQuYXV0b3N1Ym1pdCA9PT0gJ2ZhbHNlJykge1xcbiAgICAgICAgY29uc29sZS5sb2coJ0F1dG9zdWJtaXQgaXMgZGlzYWJsZWQnKTtcXG4gICAgICB9IGVsc2Uge1xcbiAgICAgICAgLy8gU2ltdWxhdGUgYW4gXFxcIkVudGVyXFxcIiBrZXlwcmVzcyBldmVudFxcbiAgICAgICAgc2ltdWxhdGVGb3JtU3VibWl0KGVsZW1lbnQpO1xcbiAgICAgIH1cXG4gICAgfVxcbiAgfVxcbiAgLy8gU3RhcnQgdHlwaW5nXFxuICB0eXBlV29yZCgpO1xcbn1cXG5cXG4vLyBEZWNsYXJlIGEgZ2xvYmFsIHZhcmlhYmxlIGZvciB0aGUgbWVkaWFSZWNvcmRlclxcbnZhciBtZWRpYVJlY29yZGVyO1xcbnZhciB0aHJlc2hvbGQgPSAxMDAwOyAvLyAxMDAwIG1zID0gMSBzZWNvbmQsIGFib3V0IHRoZSBsZW5ndGggb2YgXFxcIkhleSwgUGlcXFwiXFxuXFxuLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSAnZGF0YWF2YWlsYWJsZScgZXZlbnQgZmlyZXNcXG5mdW5jdGlvbiBoYW5kbGVEYXRhQXZhaWxhYmxlKGUpIHtcXG4gIC8vIEFkZCB0aGUgYXVkaW8gZGF0YSBjaHVuayB0byB0aGUgYXJyYXlcXG4gIGF1ZGlvRGF0YUNodW5rcy5wdXNoKGUuZGF0YSk7XFxufVxcblxcbi8vIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgJ3N0b3AnIGV2ZW50IGZpcmVzXFxuZnVuY3Rpb24gaGFuZGxlU3RvcCgpIHtcXG4gIC8vIENyZWF0ZSBhIEJsb2IgZnJvbSB0aGUgYXVkaW8gZGF0YSBjaHVua3NcXG4gIHZhciBhdWRpb0Jsb2IgPSBuZXcgQmxvYihhdWRpb0RhdGFDaHVua3MsIHtcXG4gICAgdHlwZTogYXVkaW9NaW1lVHlwZVxcbiAgfSk7XFxuXFxuICAvLyBHZXQgdGhlIHN0b3AgdGltZSBhbmQgY2FsY3VsYXRlIHRoZSBkdXJhdGlvblxcbiAgdmFyIHN0b3BUaW1lID0gRGF0ZS5ub3coKTtcXG4gIHZhciBkdXJhdGlvbiA9IHN0b3BUaW1lIC0gd2luZG93LnN0YXJ0VGltZTtcXG5cXG4gIC8vIElmIHRoZSBkdXJhdGlvbiBpcyBncmVhdGVyIHRoYW4gdGhlIHRocmVzaG9sZCwgdXBsb2FkIHRoZSBhdWRpbyBmb3IgdHJhbnNjcmlwdGlvblxcbiAgaWYgKGR1cmF0aW9uID49IHRocmVzaG9sZCkge1xcbiAgICAvLyBkb3dubG9hZCB0aGUgYXVkaW9cXG4gICAgdmFyIHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYXVkaW9CbG9iKTtcXG4gICAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XFxuICAgIGEuc3R5bGUuZGlzcGxheSA9ICdub25lJztcXG4gICAgYS5ocmVmID0gdXJsO1xcbiAgICBhLmRvd25sb2FkID0gJ3NhZmFyaV9hdWRpby5tcDQnO1xcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpO1xcbiAgICAvLyBhLmNsaWNrKCk7XFxuICAgIC8vIFVwbG9hZCB0aGUgYXVkaW8gdG8gdGhlIHNlcnZlciBmb3IgdHJhbnNjcmlwdGlvblxcbiAgICB1cGxvYWRBdWRpbyhhdWRpb0Jsb2IpO1xcbiAgfVxcblxcbiAgLy8gQ2xlYXIgdGhlIGFycmF5IGZvciB0aGUgbmV4dCByZWNvcmRpbmdcXG4gIGF1ZGlvRGF0YUNodW5rcyA9IFtdO1xcbn1cXG5mdW5jdGlvbiBzZXR1cFJlY29yZGluZyhjYWxsYmFjaykge1xcbiAgaWYgKG1lZGlhUmVjb3JkZXIpIHtcXG4gICAgcmV0dXJuO1xcbiAgfVxcblxcbiAgLy8gR2V0IGEgc3RyZWFtIGZyb20gdGhlIHVzZXIncyBtaWNyb3Bob25lXFxuICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSh7XFxuICAgIGF1ZGlvOiB0cnVlXFxuICB9KS50aGVuKGZ1bmN0aW9uIChzdHJlYW0pIHtcXG4gICAgaWYgKCFNZWRpYVJlY29yZGVyLmlzVHlwZVN1cHBvcnRlZChhdWRpb01pbWVUeXBlKSkge1xcbiAgICAgIC8vIHVzZSBNUDQgZm9yIFNhZmFyaVxcbiAgICAgIGF1ZGlvTWltZVR5cGUgPSAnYXVkaW8vbXA0JztcXG4gICAgfVxcbiAgICAvLyBDcmVhdGUgYSBuZXcgTWVkaWFSZWNvcmRlciBvYmplY3QgdXNpbmcgdGhlIHN0cmVhbSBhbmQgc3BlY2lmeWluZyB0aGUgTUlNRSB0eXBlXFxuICAgIHZhciBvcHRpb25zID0ge1xcbiAgICAgIG1pbWVUeXBlOiBhdWRpb01pbWVUeXBlXFxuICAgIH07XFxuICAgIG1lZGlhUmVjb3JkZXIgPSBuZXcgTWVkaWFSZWNvcmRlcihzdHJlYW0sIG9wdGlvbnMpO1xcblxcbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSAnZGF0YWF2YWlsYWJsZScgZXZlbnRcXG4gICAgbWVkaWFSZWNvcmRlci5hZGRFdmVudExpc3RlbmVyKCdkYXRhYXZhaWxhYmxlJywgaGFuZGxlRGF0YUF2YWlsYWJsZSk7XFxuXFxuICAgIC8vIExpc3RlbiBmb3IgdGhlICdzdG9wJyBldmVudFxcbiAgICBtZWRpYVJlY29yZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ3N0b3AnLCBoYW5kbGVTdG9wKTtcXG4gIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xcbiAgICAvLyBJbnZva2UgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uXFxuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcXG4gICAgICBjYWxsYmFjaygpO1xcbiAgICB9XFxuICB9KVtcXFwiY2F0Y2hcXFwiXShmdW5jdGlvbiAoZXJyKSB7XFxuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGdldHRpbmcgYXVkaW8gc3RyZWFtOiAnICsgZXJyKTtcXG4gIH0pO1xcbn1cXG5mdW5jdGlvbiB0ZWFyRG93blJlY29yZGluZygpIHtcXG4gIC8vIENoZWNrIGlmIHRoZSBNZWRpYVJlY29yZGVyIGlzIHNldCB1cFxcbiAgaWYgKCFtZWRpYVJlY29yZGVyKSB7XFxuICAgIHJldHVybjtcXG4gIH1cXG5cXG4gIC8vIFN0b3AgYW55IG9uZ29pbmcgcmVjb3JkaW5nXFxuICBpZiAobWVkaWFSZWNvcmRlci5zdGF0ZSA9PT0gJ3JlY29yZGluZycpIHtcXG4gICAgbWVkaWFSZWNvcmRlci5zdG9wKCk7XFxuICB9XFxuXFxuICAvLyBSZW1vdmUgdGhlIE1lZGlhUmVjb3JkZXIncyBldmVudCBsaXN0ZW5lcnNcXG4gIG1lZGlhUmVjb3JkZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignZGF0YWF2YWlsYWJsZScsIGhhbmRsZURhdGFBdmFpbGFibGUpO1xcbiAgbWVkaWFSZWNvcmRlci5yZW1vdmVFdmVudExpc3RlbmVyKCdzdG9wJywgaGFuZGxlU3RvcCk7XFxuXFxuICAvLyBDbGVhciB0aGUgTWVkaWFSZWNvcmRlciB2YXJpYWJsZVxcbiAgbWVkaWFSZWNvcmRlciA9IG51bGw7XFxufVxcblxcbi8vIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgdXNlciBwcmVzc2VzIHRoZSByZWNvcmQgYnV0dG9uXFxuZnVuY3Rpb24gc3RhcnRSZWNvcmRpbmcoKSB7XFxuICAvLyBDaGVjayBpZiB0aGUgTWVkaWFSZWNvcmRlciBpcyBzZXQgdXBcXG4gIGlmICghbWVkaWFSZWNvcmRlcikge1xcbiAgICBzZXR1cFJlY29yZGluZyhzdGFydFJlY29yZGluZyk7XFxuICAgIHJldHVybjtcXG4gIH1cXG4gIC8vIENoZWNrIGlmIFBpIGlzIGN1cnJlbnRseSBzcGVha2luZyBhbmQgc3RvcCBoZXIgYXVkaW9cXG4gIGlmIChwaUF1ZGlvTWFuYWdlci5pc1NwZWFraW5nKSB7XFxuICAgIHBpQXVkaW9NYW5hZ2VyLnBhdXNlKCk7XFxuICB9XFxuXFxuICAvLyBTdGFydCByZWNvcmRpbmdcXG4gIG1lZGlhUmVjb3JkZXIuc3RhcnQoKTtcXG5cXG4gIC8vIFJlY29yZCB0aGUgc3RhcnQgdGltZVxcbiAgd2luZG93LnN0YXJ0VGltZSA9IERhdGUubm93KCk7XFxuICBjb25zb2xlLmxvZygnVXNlciBpcyBzcGVha2luZycpO1xcblxcbiAgLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSB1c2VyIHJlbGVhc2VzIHRoZSByZWNvcmQgYnV0dG9uXFxuICB3aW5kb3cuc3RvcFJlY29yZGluZyA9IGZ1bmN0aW9uICgpIHtcXG4gICAgaWYgKG1lZGlhUmVjb3JkZXIgJiYgbWVkaWFSZWNvcmRlci5zdGF0ZSA9PT0gJ3JlY29yZGluZycpIHtcXG4gICAgICAvLyBTdG9wIHJlY29yZGluZ1xcbiAgICAgIG1lZGlhUmVjb3JkZXIuc3RvcCgpO1xcblxcbiAgICAgIC8vIFJlY29yZCB0aGUgc3RvcCB0aW1lIGFuZCBjYWxjdWxhdGUgdGhlIGR1cmF0aW9uXFxuICAgICAgdmFyIHN0b3BUaW1lID0gRGF0ZS5ub3coKTtcXG4gICAgICB2YXIgZHVyYXRpb24gPSBzdG9wVGltZSAtIHdpbmRvdy5zdGFydFRpbWU7XFxuXFxuICAgICAgLy8gSWYgdGhlIGR1cmF0aW9uIGlzIGxlc3MgdGhhbiB0aGUgdGhyZXNob2xkLCBkb24ndCB1cGxvYWQgdGhlIGF1ZGlvIGZvciB0cmFuc2NyaXB0aW9uXFxuICAgICAgaWYgKGR1cmF0aW9uIDwgdGhyZXNob2xkKSB7XFxuICAgICAgICBjb25zb2xlLmxvZygnVXNlciBzdG9wcGVkIHNwZWFraW5nJyk7XFxuICAgICAgICBjb25zb2xlLmxvZygnUmVjb3JkaW5nIHdhcyB0b28gc2hvcnQsIG5vdCB1cGxvYWRpbmcgZm9yIHRyYW5zY3JpcHRpb24nKTtcXG4gICAgICAgIHBpQXVkaW9NYW5hZ2VyLnJlc3VtZSgpO1xcbiAgICAgIH0gZWxzZSB7XFxuICAgICAgICBjb25zb2xlLmxvZygnVXNlciBmaW5pc2hlZCBzcGVha2luZycpO1xcbiAgICAgICAgcGlBdWRpb01hbmFnZXIuc3RvcCgpO1xcbiAgICAgIH1cXG4gICAgfVxcbiAgICAvLyBSZW1vdmUgdGhlIHN0b3BSZWNvcmRpbmcgZnVuY3Rpb25cXG4gICAgZGVsZXRlIHdpbmRvdy5zdG9wUmVjb3JkaW5nO1xcbiAgfTtcXG59XFxuXFxuLy8gQWRkIHRoZSBzdGFydFJlY29yZGluZyBmdW5jdGlvbiB0byB0aGUgd2luZG93IG9iamVjdCBzbyBpdCBjYW4gYmUgY2FsbGVkIGZyb20gb3V0c2lkZSB0aGlzIHNjcmlwdFxcbndpbmRvdy5zdGFydFJlY29yZGluZyA9IHN0YXJ0UmVjb3JkaW5nO1wiOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gPT1Vc2VyU2NyaXB0PT1cbi8vIEBuYW1lICAgICAgICAgU2F5LCBQaVxuLy8gQG5hbWVzcGFjZSAgICBodHRwOi8vd3d3LnNheXBpLmFpL1xuLy8gQHZlcnNpb24gICAgICAxLjIuMlxuLy8gQGRlc2NyaXB0aW9uICBTcGVhayB0byBQaSB3aXRoIE9wZW5BSSdzIFdoaXNwZXJcbi8vIEBhdXRob3IgICAgICAgUm9zcyBDYWRvZ2FuXG4vLyBAbWF0Y2ggICAgICAgIGh0dHBzOi8vcGkuYWkvdGFsa1xuLy8gQGluamVjdC1pbnRvICBwYWdlXG4vLyBAdXBkYXRlVVJMICAgIGh0dHBzOi8vd3d3LnNheXBpLmFpL3NheXBpLnVzZXIuanNcbi8vIEBkb3dubG9hZFVSTCAgaHR0cHM6Ly93d3cuc2F5cGkuYWkvc2F5cGkudXNlci5qc1xuLy8gQGxpY2Vuc2UgICAgICBNSVRcbi8vID09L1VzZXJTY3JpcHQ9PVxuXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGNvbnN0IGxvY2FsQ29uZmlnID0ge1xuICAgICAgICBhcHBTZXJ2ZXJVcmw6IFwiaHR0cDovL2xvY2FsaG9zdDozMDAwXCIsXG4gICAgICAgIGFwaVNlcnZlclVybDogXCJodHRwczovL2xvY2FsaG9zdDo1MDAwXCIsXG4gICAgICAgIC8vIEFkZCBvdGhlciBjb25maWd1cmF0aW9uIHByb3BlcnRpZXMgYXMgbmVlZGVkXG4gICAgfTtcblxuICAgIC8vIERlZmluZSBhIGdsb2JhbCBjb25maWd1cmF0aW9uIHByb3BlcnR5XG4gICAgY29uc3QgcHJvZHVjdGlvbkNvbmZpZyA9IHtcbiAgICAgICAgYXBwU2VydmVyVXJsOiBcImh0dHBzOi8vYXBwLnNheXBpLmFpXCIsXG4gICAgICAgIGFwaVNlcnZlclVybDogXCJodHRwczovL2FwaS5zYXlwaS5haVwiLFxuICAgICAgICAvLyBBZGQgb3RoZXIgY29uZmlndXJhdGlvbiBwcm9wZXJ0aWVzIGFzIG5lZWRlZFxuICAgIH07XG4gICAgY29uc3QgY29uZmlnID0gcHJvZHVjdGlvbkNvbmZpZztcblxuICAgIGNvbnN0IHBhZ2VTY3JpcHQgPSByZXF1aXJlKCdyYXctbG9hZGVyIS4vdHJhbnNjcmliZXIuanMnKS5kZWZhdWx0O1xuXG4gICAgLy8gQ3JlYXRlIGEgTXV0YXRpb25PYnNlcnZlciB0byBsaXN0ZW4gZm9yIGNoYW5nZXMgdG8gdGhlIERPTVxuICAgIHZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uIChtdXRhdGlvbnMpIHtcbiAgICAgICAgLy8gQ2hlY2sgZWFjaCBtdXRhdGlvblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG11dGF0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIG11dGF0aW9uID0gbXV0YXRpb25zW2ldO1xuXG4gICAgICAgICAgICAvLyBJZiBub2RlcyB3ZXJlIGFkZGVkLCBjaGVjayBlYWNoIG9uZVxuICAgICAgICAgICAgaWYgKG11dGF0aW9uLmFkZGVkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbXV0YXRpb24uYWRkZWROb2Rlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IG11dGF0aW9uLmFkZGVkTm9kZXNbal07XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIG5vZGUgaXMgdGhlIGFwcHJvcHJpYXRlIGNvbnRhaW5lciBlbGVtZW50LCBhZGQgdGhlIGJ1dHRvbiBhbmQgc3RvcCBvYnNlcnZpbmdcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2RpdicgJiYgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2ZpeGVkJykgJiYgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2JvdHRvbS0xNicpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZm9vdGVyID0gbm9kZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBidXR0b25Db250YWluZXIgPSBmb290ZXIucXVlcnlTZWxlY3RvcignLnJlbGF0aXZlLmZsZXguZmxleC1jb2wnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChidXR0b25Db250YWluZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRUYWxrQnV0dG9uKGJ1dHRvbkNvbnRhaW5lcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdObyBidXR0b24gY29udGFpbmVyIGZvdW5kIGluIGZvb3RlcicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIGZ1bmN0aW9uIGluamVjdFNjcmlwdChjYWxsYmFjaykge1xuICAgICAgICB2YXIgc2NyaXB0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgIHNjcmlwdEVsZW1lbnQudHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCI7XG4gICAgICAgIHNjcmlwdEVsZW1lbnQuaWQgPSAnc2F5cGktc2NyaXB0JztcbiAgICAgICAgY29uc3QgY29uZmlnVGV4dCA9ICd2YXIgY29uZmlnID0gJyArIEpTT04uc3RyaW5naWZ5KGNvbmZpZykgKyAnOyc7XG4gICAgICAgIHNjcmlwdEVsZW1lbnQudGV4dENvbnRlbnQgPSBjb25maWdUZXh0ICsgcGFnZVNjcmlwdDtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHRFbGVtZW50KTtcblxuICAgICAgICAvLyBDYWxsIHRoZSBjYWxsYmFjayBmdW5jdGlvbiBhZnRlciB0aGUgc2NyaXB0IGlzIGFkZGVkXG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gYWRkVGFsa0J1dHRvbihjb250YWluZXIpIHtcbiAgICAgICAgdmFyIGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICBidXR0b24uaWQgPSAndGFsa0J1dHRvbic7XG4gICAgICAgIGJ1dHRvbi50eXBlID0gJ2J1dHRvbic7XG4gICAgICAgIGJ1dHRvbi5jbGFzc05hbWUgPSAncmVsYXRpdmUgZmxleCBtdC0xIG1iLTEgcm91bmRlZC1mdWxsIHB4LTIgcHktMyB0ZXh0LWNlbnRlciBiZy1jcmVhbS01NTAgaG92ZXI6YmctY3JlYW0tNjUwIGhvdmVyOnRleHQtYnJhbmQtZ3JlZW4tNzAwIHRleHQtbXV0ZWQnO1xuICAgICAgICAvLyBTZXQgQVJJQSBsYWJlbCBhbmQgdG9vbHRpcFxuICAgICAgICBjb25zdCBsYWJlbCA9ICdUYWxrIChIb2xkIENvbnRyb2wgKyBTcGFjZSB0byB1c2UgaG90a2V5LiBEb3VibGUgY2xpY2sgdG8gdG9nZ2xlIGF1dG8tc3VibWl0IG9uL29mZiknXG4gICAgICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBsYWJlbCk7XG4gICAgICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgbGFiZWwpO1xuICAgICAgICAvLyBlbmFibGUgYXV0b3N1Ym1pdCBieSBkZWZhdWx0XG4gICAgICAgIGJ1dHRvbi5kYXRhc2V0LmF1dG9zdWJtaXQgPSAndHJ1ZSc7XG4gICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdhdXRvU3VibWl0Jyk7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChidXR0b24pO1xuICAgICAgICBhZGRUYWxrQnV0dG9uU3R5bGVzKCk7XG4gICAgICAgIGFkZFRhbGtJY29uKGJ1dHRvbik7XG5cbiAgICAgICAgLy8gQ2FsbCB0aGUgZnVuY3Rpb24gdG8gaW5qZWN0IHRoZSBzY3JpcHQgYWZ0ZXIgdGhlIGJ1dHRvbiBoYXMgYmVlbiBhZGRlZFxuICAgICAgICBpbmplY3RTY3JpcHQocmVnaXN0ZXJBdWRpb0J1dHRvbkV2ZW50cyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkVGFsa0ljb24oYnV0dG9uKSB7XG4gICAgICAgIHZhciBpY29uSHRtbCA9IGBcbiAgICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmVyc2lvbj1cIjEuMFwiIHZpZXdCb3g9XCIwIDAgNTYuMjUgMzBcIiBjbGFzcz1cIndhdmVmb3JtXCI+XG4gICAgICAgIDxkZWZzPlxuICAgICAgICAgICAgPGNsaXBQYXRoIGlkPVwiYVwiPlxuICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNLjU0IDEySDN2NUguNTRabTAgMFwiLz5cbiAgICAgICAgICAgIDwvY2xpcFBhdGg+XG4gICAgICAgICAgICA8Y2xpcFBhdGggaWQ9XCJiXCI+XG4gICAgICAgICAgICAgICAgPHBhdGggZD1cIk0yNSAyLjJoMnYyNC42OGgtMlptMCAwXCIvPlxuICAgICAgICAgICAgPC9jbGlwUGF0aD5cbiAgICAgICAgICAgIDxjbGlwUGF0aCBpZD1cImNcIj5cbiAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTUzIDEyaDEuOTh2NUg1M1ptMCAwXCIvPlxuICAgICAgICAgICAgPC9jbGlwUGF0aD5cbiAgICAgICAgPC9kZWZzPlxuICAgICAgICA8ZyBjbGlwLXBhdGg9XCJ1cmwoI2EpXCI+XG4gICAgICAgICAgICA8cGF0aCBkPVwiTTEuNDggMTIuNzFjLS41IDAtLjkuNC0uOS45djEuODVhLjkuOSAwIDAgMCAxLjggMHYtMS44NGMwLS41LS40LS45LS45LS45Wm0wIDBcIi8+XG4gICAgICAgIDwvZz5cbiAgICAgICAgPHBhdGggZD1cIk00Ljk4IDYuNjNjLS41IDAtLjkuNC0uOS45djE0LjAxYS45LjkgMCAwIDAgMS44MSAwdi0xNGMwLS41LS40LS45Mi0uOS0uOTJabTMuNTEgMy4xYS45LjkgMCAwIDAtLjkuOTF2Ny43OWEuOS45IDAgMCAwIDEuOCAwdi03Ljc5YzAtLjUtLjQtLjktLjktLjlaTTEyIDMuODNhLjkuOSAwIDAgMC0uOTEuOXYxOS42YS45LjkgMCAwIDAgMS44IDBWNC43NGMwLS41LS40LS45LS45LS45Wm0zLjUgOC4yOWEuOS45IDAgMCAwLS45MS45djMuMDNhLjkuOSAwIDAgMCAxLjgxIDB2LTMuMDNjMC0uNS0uNC0uOS0uOS0uOVpNMTkgNi44Yy0uNSAwLS45LjQtLjkuOXYxMy42OGEuOS45IDAgMCAwIDEuOCAwVjcuN2MwLS41LS40LS45LS45LS45Wm0zLjU4LTIuOTdoLS4wMWMtLjUgMC0uOS40LS45LjlsLS4xMyAxOS42YzAgLjUuNC45LjkuOTEuNSAwIC45LS40LjktLjlsLjE0LTE5LjZhLjkuOSAwIDAgMC0uOS0uOVptMCAwXCIvPlxuICAgICAgICA8ZyBjbGlwLXBhdGg9XCJ1cmwoI2IpXCI+XG4gICAgICAgICAgICA8cGF0aCBkPVwiTTI2IDIuMmMtLjUgMC0uOS40LS45Ljl2MjIuODZhLjkuOSAwIDEgMCAxLjgxIDBWMy4xMWEuOS45IDAgMCAwLS45LS45MVptMCAwXCIvPlxuICAgICAgICA8L2c+XG4gICAgICAgIDxwYXRoIGQ9XCJNMjkuNTIgNy43MWEuOS45IDAgMCAwLS45MS45djExLjg1YS45LjkgMCAwIDAgMS44MSAwVjguNjJjMC0uNS0uNC0uOS0uOS0uOVptMy41IDIuOTNhLjkuOSAwIDAgMC0uOS45MXY1Ljk3YS45LjkgMCAwIDAgMS44IDB2LTUuOTdjMC0uNS0uNC0uOS0uOS0uOVptMy41LTUuNzhjLS41IDAtLjkuNC0uOS45djE3LjU1YS45LjkgMCAwIDAgMS44MSAwVjUuNzZjMC0uNS0uNC0uOS0uOS0uOVptMy41MSAzLjM0Yy0uNSAwLS45LjQtLjkuOXYxMC44N2EuOS45IDAgMCAwIDEuOCAwVjkuMWEuOS45IDAgMCAwLS45LS45MVptMy41IDMuMDhjLS41IDAtLjkuNC0uOS45MXY0LjdhLjkuOSAwIDEgMCAxLjggMHYtNC43YS45LjkgMCAwIDAtLjktLjlabTMuNTEtNy40NWEuOS45IDAgMCAwLS45MS45djE5LjZhLjkuOSAwIDAgMCAxLjgxIDBWNC43NGMwLS41LS40LS45LS45LS45Wm0zLjUgNS41N2EuOS45IDAgMCAwLS45LjkxdjguNDVhLjkuOSAwIDAgMCAxLjggMHYtOC40NWMwLS41LS40LS45LS45LS45Wm0wIDBcIi8+XG4gICAgICAgIDxnIGNsaXAtcGF0aD1cInVybCgjYylcIj5cbiAgICAgICAgICAgIDxwYXRoIGQ9XCJNNTQuMDQgMTIuOTZhLjkuOSAwIDAgMC0uOS45MXYxLjMzYS45LjkgMCAxIDAgMS44IDB2LTEuMzJhLjkuOSAwIDAgMC0uOS0uOTJabTAgMFwiLz5cbiAgICAgICAgPC9nPlxuICAgIDwvc3ZnPlxuICAgIFxuICAgICAgICBgO1xuICAgICAgICB2YXIgaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3ZnJyk7XG4gICAgICAgIGJ1dHRvbi5hcHBlbmRDaGlsZChpY29uKTtcbiAgICAgICAgaWNvbi5vdXRlckhUTUwgPSBpY29uSHRtbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRTdHlsZXMoY3NzKSB7XG4gICAgICAgIGNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRUYWxrQnV0dG9uU3R5bGVzKCkge1xuICAgICAgICB2YXIgaXNGaXJlZm94QW5kcm9pZCA9IC9GaXJlZm94Ly50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpICYmIC9BbmRyb2lkLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgICAgICBpZiAoaXNGaXJlZm94QW5kcm9pZCkge1xuICAgICAgICAgICAgLy8gaGFjayBmb3IgRmlyZWZveCBvbiBBbmRyb2lkLCB3aGljaCBkb2Vzbid0IHN1cHBvcnQgOmFjdGl2ZSBjb3JyZWN0bHlcbiAgICAgICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdmaXJlZm94LWFuZHJvaWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGJ1dHRvbiBhbmltYXRpb25cbiAgICAgICAgYWRkU3R5bGVzKGBcbiAgICAgICAgICAgIEBrZXlmcmFtZXMgcHVsc2Uge1xuICAgICAgICAgICAgICAgIDAlIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgNTAlIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAxMDAlIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAjdGFsa0J1dHRvbiB7XG4gICAgICAgICAgICAgICAgbWFyZ2luLXRvcDogMC4yNXJlbTtcbiAgICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiAxOHB4O1xuICAgICAgICAgICAgICAgIHdpZHRoOiAxMjBweDtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBibG9jazsgLyogRm9yIFNhZmFyaSAqL1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBodG1sOm5vdCguZmlyZWZveC1hbmRyb2lkKSAjdGFsa0J1dHRvbjphY3RpdmUgLndhdmVmb3JtLFxuICAgICAgICAgICAgI3RhbGtCdXR0b24uYWN0aXZlIC53YXZlZm9ybSB7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBwdWxzZSAxcyBpbmZpbml0ZTtcbiAgICAgICAgICAgIH0gICAgICAgICAgICBcbiAgICAgICAgICAgICN0YWxrQnV0dG9uIC53YXZlZm9ybSB7XG4gICAgICAgICAgICAgICAgZmlsbDogIzc3NmQ2ZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICN0YWxrQnV0dG9uLmF1dG9TdWJtaXQgLndhdmVmb3JtIHtcbiAgICAgICAgICAgICAgICBmaWxsOiByZ2IoNjUgMTM4IDQ3KTsgLyogUGkncyB0ZXh0LWJyYW5kLWdyZWVuLTYwMCAqL1xuICAgICAgICAgICAgfVxuICAgICAgICBgKTtcblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlZ2lzdGVyQXVkaW9CdXR0b25FdmVudHMoKSB7XG4gICAgICAgIHZhciBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFsa0J1dHRvbicpO1xuICAgICAgICB2YXIgY29udGV4dCA9IHdpbmRvdztcbiAgICAgICAgaWYgKEdNX2luZm8uc2NyaXB0SGFuZGxlciAhPT0gJ1VzZXJzY3JpcHRzJykge1xuICAgICAgICAgICAgY29udGV4dCA9IHVuc2FmZVdpbmRvdztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZvciBkZXNrdG9wXG4gICAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZFByb21wdFRleHRBcmVhKCk7XG4gICAgICAgICAgICBjb250ZXh0LnN0YXJ0UmVjb3JkaW5nKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnRleHQuc3RvcFJlY29yZGluZygpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmVnaXN0ZXJIb3RrZXkoKTtcblxuICAgICAgICAvLyBcIndhcm0gdXBcIiB0aGUgbWljcm9waG9uZSBieSBhY3F1aXJpbmcgaXQgYmVmb3JlIHRoZSB1c2VyIHByZXNzZXMgdGhlIGJ1dHRvblxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFsa0J1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBzZXR1cFJlY29yZGluZyk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWxrQnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIHRlYXJEb3duUmVjb3JkaW5nKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JlZm9yZXVubG9hZCcsIHRlYXJEb3duUmVjb3JkaW5nKTtcblxuICAgICAgICAvLyBBdHRhY2ggYSBkb3VibGUgY2xpY2sgZXZlbnQgbGlzdGVuZXIgdG8gdGhlIHRhbGsgYnV0dG9uXG4gICAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdkYmxjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIFRvZ2dsZSB0aGUgQ1NTIGNsYXNzZXMgdG8gaW5kaWNhdGUgdGhlIG1vZGVcbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QudG9nZ2xlKCdhdXRvU3VibWl0Jyk7XG5cbiAgICAgICAgICAgIC8vIFN0b3JlIHRoZSBzdGF0ZSBvbiB0aGUgYnV0dG9uIGVsZW1lbnQgdXNpbmcgYSBjdXN0b20gZGF0YSBhdHRyaWJ1dGVcbiAgICAgICAgICAgIGlmIChidXR0b24uZ2V0QXR0cmlidXRlKCdkYXRhLWF1dG9zdWJtaXQnKSA9PT0gJ3RydWUnKSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnZGF0YS1hdXRvc3VibWl0JywgJ2ZhbHNlJyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2F1dG9zdWJtaXQgZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnZGF0YS1hdXRvc3VibWl0JywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnYXV0b3N1Ym1pdCBlbmFibGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEZvciBtb2JpbGVcbiAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpOyAvLyBQcmV2ZW50IHRoZSBkZWZhdWx0IGNsaWNrIGJlaGF2aW9yIGZyb20gaGFwcGVuaW5nXG4gICAgICAgICAgICBpZFByb21wdFRleHRBcmVhKCk7XG4gICAgICAgICAgICBjb250ZXh0LnN0YXJ0UmVjb3JkaW5nKCk7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpOyAvLyBBZGQgdGhlIGFjdGl2ZSBjbGFzcyAoZm9yIEZpcmVmb3ggb24gQW5kcm9pZClcbiAgICAgICAgfSk7XG4gICAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7IC8vIFJlbW92ZSB0aGUgYWN0aXZlIGNsYXNzIChmb3IgRmlyZWZveCBvbiBBbmRyb2lkXG4gICAgICAgICAgICBjb250ZXh0LnN0b3BSZWNvcmRpbmcoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWxrQnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpOyAvLyBSZW1vdmUgdGhlIGFjdGl2ZSBjbGFzcyAoZm9yIEZpcmVmb3ggb24gQW5kcm9pZFxuICAgICAgICAgICAgdGVhckRvd25SZWNvcmRpbmcoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiByZWdpc3RlckhvdGtleSgpIHtcbiAgICAgICAgLy8gUmVnaXN0ZXIgYSBob3RrZXkgZm9yIHRoZSBidXR0b25cbiAgICAgICAgbGV0IGN0cmxEb3duID0gZmFsc2U7XG5cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LmN0cmxLZXkgJiYgZXZlbnQuY29kZSA9PT0gJ1NwYWNlJyAmJiAhY3RybERvd24pIHtcbiAgICAgICAgICAgICAgICBjdHJsRG93biA9IHRydWU7XG4gICAgICAgICAgICAgICAgLy8gU2ltdWxhdGUgbW91c2Vkb3duIGV2ZW50XG4gICAgICAgICAgICAgICAgbGV0IG1vdXNlRG93bkV2ZW50ID0gbmV3IEV2ZW50KCdtb3VzZWRvd24nKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFsa0J1dHRvbicpLmRpc3BhdGNoRXZlbnQobW91c2VEb3duRXZlbnQpO1xuICAgICAgICAgICAgICAgIHRhbGtCdXR0b24uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7IC8vIEFkZCB0aGUgYWN0aXZlIGNsYXNzXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoY3RybERvd24gJiYgZXZlbnQuY29kZSA9PT0gJ1NwYWNlJykge1xuICAgICAgICAgICAgICAgIGN0cmxEb3duID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgLy8gU2ltdWxhdGUgbW91c2V1cCBldmVudFxuICAgICAgICAgICAgICAgIGxldCBtb3VzZVVwRXZlbnQgPSBuZXcgRXZlbnQoJ21vdXNldXAnKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFsa0J1dHRvbicpLmRpc3BhdGNoRXZlbnQobW91c2VVcEV2ZW50KTtcbiAgICAgICAgICAgICAgICB0YWxrQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIGlkUHJvbXB0VGV4dEFyZWEoKSB7XG4gICAgICAgIHZhciB0ZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9tcHQnKTtcbiAgICAgICAgaWYgKCF0ZXh0YXJlYSkge1xuICAgICAgICAgICAgLy8gRmluZCB0aGUgZmlyc3QgPHRleHRhcmVhPiBlbGVtZW50IGFuZCBnaXZlIGl0IGFuIGlkXG4gICAgICAgICAgICB2YXIgdGV4dGFyZWFFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcigndGV4dGFyZWEnKTtcbiAgICAgICAgICAgIGlmICh0ZXh0YXJlYUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0ZXh0YXJlYUVsZW1lbnQuaWQgPSAncHJvbXB0JztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ05vIDx0ZXh0YXJlYT4gZWxlbWVudCBmb3VuZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gU3RhcnQgb2JzZXJ2aW5nIHRoZSBlbnRpcmUgZG9jdW1lbnQgZm9yIGNoYW5nZXMgdG8gY2hpbGQgbm9kZXMgYW5kIHN1YnRyZWVcbiAgICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LCB7IGNoaWxkTGlzdDogdHJ1ZSwgc3VidHJlZTogdHJ1ZSB9KTtcbn0pKCk7XG4iXSwibmFtZXMiOlsibG9jYWxDb25maWciLCJhcHBTZXJ2ZXJVcmwiLCJhcGlTZXJ2ZXJVcmwiLCJwcm9kdWN0aW9uQ29uZmlnIiwiY29uZmlnIiwicGFnZVNjcmlwdCIsInJlcXVpcmUiLCJvYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJtdXRhdGlvbnMiLCJpIiwibGVuZ3RoIiwibXV0YXRpb24iLCJhZGRlZE5vZGVzIiwiaiIsIm5vZGUiLCJub2RlTmFtZSIsInRvTG93ZXJDYXNlIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJmb290ZXIiLCJidXR0b25Db250YWluZXIiLCJxdWVyeVNlbGVjdG9yIiwiYWRkVGFsa0J1dHRvbiIsImNvbnNvbGUiLCJsb2ciLCJkaXNjb25uZWN0IiwiaW5qZWN0U2NyaXB0IiwiY2FsbGJhY2siLCJzY3JpcHRFbGVtZW50IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwidHlwZSIsImlkIiwiY29uZmlnVGV4dCIsIkpTT04iLCJzdHJpbmdpZnkiLCJ0ZXh0Q29udGVudCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsImNvbnRhaW5lciIsImJ1dHRvbiIsImNsYXNzTmFtZSIsImxhYmVsIiwic2V0QXR0cmlidXRlIiwiZGF0YXNldCIsImF1dG9zdWJtaXQiLCJhZGQiLCJhZGRUYWxrQnV0dG9uU3R5bGVzIiwiYWRkVGFsa0ljb24iLCJyZWdpc3RlckF1ZGlvQnV0dG9uRXZlbnRzIiwiaWNvbkh0bWwiLCJpY29uIiwiY3JlYXRlRWxlbWVudE5TIiwib3V0ZXJIVE1MIiwiYWRkU3R5bGVzIiwiY3NzIiwic3R5bGUiLCJjcmVhdGVUZXh0Tm9kZSIsImhlYWQiLCJpc0ZpcmVmb3hBbmRyb2lkIiwidGVzdCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsImRvY3VtZW50RWxlbWVudCIsImdldEVsZW1lbnRCeUlkIiwiY29udGV4dCIsIndpbmRvdyIsIkdNX2luZm8iLCJzY3JpcHRIYW5kbGVyIiwidW5zYWZlV2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsImlkUHJvbXB0VGV4dEFyZWEiLCJzdGFydFJlY29yZGluZyIsInN0b3BSZWNvcmRpbmciLCJyZWdpc3RlckhvdGtleSIsInNldHVwUmVjb3JkaW5nIiwidGVhckRvd25SZWNvcmRpbmciLCJ0b2dnbGUiLCJnZXRBdHRyaWJ1dGUiLCJlIiwicHJldmVudERlZmF1bHQiLCJyZW1vdmUiLCJjdHJsRG93biIsImV2ZW50IiwiY3RybEtleSIsImNvZGUiLCJtb3VzZURvd25FdmVudCIsIkV2ZW50IiwiZGlzcGF0Y2hFdmVudCIsInRhbGtCdXR0b24iLCJtb3VzZVVwRXZlbnQiLCJ0ZXh0YXJlYSIsInRleHRhcmVhRWxlbWVudCIsIm9ic2VydmUiLCJjaGlsZExpc3QiLCJzdWJ0cmVlIl0sInNvdXJjZVJvb3QiOiIifQ==