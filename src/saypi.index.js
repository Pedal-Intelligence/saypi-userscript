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

    const localConfig = {
        appServerUrl: "http://localhost:3000",
        apiServerUrl: "https://localhost:5000",
        // Add other configuration properties as needed
    };

    // Define a global configuration property
    const productionConfig = {
        appServerUrl: "https://app.saypi.ai",
        apiServerUrl: "https://api.saypi.ai",
        // Add other configuration properties as needed
    };
    const config = localConfig;

    const pageScript = require('raw-loader!./transcriber.js').default;

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
            onload: function (response) {
                var scriptElement = document.createElement("script");
                scriptElement.type = "text/javascript";
                scriptElement.id = 'saypi-script';
                const configText = 'var config = ' + JSON.stringify(config) + ';';
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
        const configText = 'var config = ' + JSON.stringify(config) + ';';
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
        const label = 'Talk (Hold Control + Space to use hotkey. Double click to toggle auto-submit on/off)'
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
        var iconHtml = `
        <svg xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 56.25 30" class="waveform">
        <defs>
            <clipPath id="a">
                <path d="M.54 12H3v5H.54Zm0 0"/>
            </clipPath>
            <clipPath id="b">
                <path d="M25 2.2h2v24.68h-2Zm0 0"/>
            </clipPath>
            <clipPath id="c">
                <path d="M53 12h1.98v5H53Zm0 0"/>
            </clipPath>
        </defs>
        <g clip-path="url(#a)">
            <path d="M1.48 12.71c-.5 0-.9.4-.9.9v1.85a.9.9 0 0 0 1.8 0v-1.84c0-.5-.4-.9-.9-.9Zm0 0"/>
        </g>
        <path d="M4.98 6.63c-.5 0-.9.4-.9.9v14.01a.9.9 0 0 0 1.81 0v-14c0-.5-.4-.92-.9-.92Zm3.51 3.1a.9.9 0 0 0-.9.91v7.79a.9.9 0 0 0 1.8 0v-7.79c0-.5-.4-.9-.9-.9ZM12 3.83a.9.9 0 0 0-.91.9v19.6a.9.9 0 0 0 1.8 0V4.74c0-.5-.4-.9-.9-.9Zm3.5 8.29a.9.9 0 0 0-.91.9v3.03a.9.9 0 0 0 1.81 0v-3.03c0-.5-.4-.9-.9-.9ZM19 6.8c-.5 0-.9.4-.9.9v13.68a.9.9 0 0 0 1.8 0V7.7c0-.5-.4-.9-.9-.9Zm3.58-2.97h-.01c-.5 0-.9.4-.9.9l-.13 19.6c0 .5.4.9.9.91.5 0 .9-.4.9-.9l.14-19.6a.9.9 0 0 0-.9-.9Zm0 0"/>
        <g clip-path="url(#b)">
            <path d="M26 2.2c-.5 0-.9.4-.9.9v22.86a.9.9 0 1 0 1.81 0V3.11a.9.9 0 0 0-.9-.91Zm0 0"/>
        </g>
        <path d="M29.52 7.71a.9.9 0 0 0-.91.9v11.85a.9.9 0 0 0 1.81 0V8.62c0-.5-.4-.9-.9-.9Zm3.5 2.93a.9.9 0 0 0-.9.91v5.97a.9.9 0 0 0 1.8 0v-5.97c0-.5-.4-.9-.9-.9Zm3.5-5.78c-.5 0-.9.4-.9.9v17.55a.9.9 0 0 0 1.81 0V5.76c0-.5-.4-.9-.9-.9Zm3.51 3.34c-.5 0-.9.4-.9.9v10.87a.9.9 0 0 0 1.8 0V9.1a.9.9 0 0 0-.9-.91Zm3.5 3.08c-.5 0-.9.4-.9.91v4.7a.9.9 0 1 0 1.8 0v-4.7a.9.9 0 0 0-.9-.9Zm3.51-7.45a.9.9 0 0 0-.91.9v19.6a.9.9 0 0 0 1.81 0V4.74c0-.5-.4-.9-.9-.9Zm3.5 5.57a.9.9 0 0 0-.9.91v8.45a.9.9 0 0 0 1.8 0v-8.45c0-.5-.4-.9-.9-.9Zm0 0"/>
        <g clip-path="url(#c)">
            <path d="M54.04 12.96a.9.9 0 0 0-.9.91v1.33a.9.9 0 1 0 1.8 0v-1.32a.9.9 0 0 0-.9-.92Zm0 0"/>
        </g>
    </svg>
    
        `;
        var icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        button.appendChild(icon);
        icon.outerHTML = iconHtml;
    }

    function addStyles(css) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    function addTalkButtonStyles() {
        // Get the button and register for mousedown and mouseup events
        var button = document.getElementById('talkButton');
        // button animation
        addStyles(`
            @keyframes pulse {
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
            #talkButton {
                margin-top: 0.25rem;
                border-radius: 18px;
                width: 120px;
                display: block; /* For Safari */
            }

            #talkButton:active .waveform, #talkButton.active .waveform {
                animation: pulse 1s infinite;
            }
            #talkButton .waveform {
                fill: #776d6d;
            }
            #talkButton.autoSubmit .waveform {
                fill: rgb(65 138 47); /* Pi's text-brand-green-600 */
            }
        `);

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
        let ctrlDown = false;

        document.addEventListener('keydown', function (event) {
            if (event.ctrlKey && event.code === 'Space' && !ctrlDown) {
                ctrlDown = true;
                // Simulate mousedown event
                let mouseDownEvent = new Event('mousedown');
                document.getElementById('talkButton').dispatchEvent(mouseDownEvent);
                talkButton.classList.add('active'); // Add the active class
            }
        });

        document.addEventListener('keyup', function (event) {
            if (ctrlDown && event.code === 'Space') {
                ctrlDown = false;
                // Simulate mouseup event
                let mouseUpEvent = new Event('mouseup');
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
    observer.observe(document, { childList: true, subtree: true });
})();
