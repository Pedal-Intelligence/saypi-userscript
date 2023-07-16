// ==UserScript==
// @name         Say, Pi
// @namespace    http://veloware.com/saypi
// @version      0.1
// @description  Speak to Pi with OpenAI's Whisper
// @author       Ross Cadogan
// @match        https://heypi.com/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';

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
                    if (node.nodeName.toLowerCase() === 'div' && node.classList.contains('fixed-bottom')) {
                        var footer = node;
                        console.log('Found footer');
                        var buttonContainer = footer.querySelector('.relative.flex.flex-col');
                        if (buttonContainer) {
                            addAudioButton(buttonContainer);
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
        return injectScriptRemote(callback);
    }

    function injectScriptRemote(callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://localhost:5000/static/js/literal.js",
            onload: function (response) {
                var scriptElement = document.createElement("script");
                scriptElement.textContent = response.responseText;
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
        const scriptText = `
        // Paste the contents of static/js/literal.js here to avoid CORS issues
        `
        scriptElement.textContent = scriptText;
        document.body.appendChild(scriptElement);

        // Call the callback function after the script is added
        if (callback) {
            callback();
        }
    }

    function addAudioButton(container) {
        var button = document.createElement('button');
        button.id = 'talkButton';
        button.type = 'button';
        button.className = 'relative flex mt-1 mb-1 rounded-full px-2 py-3 text-center hover:bg-cream-650 hover:text-brand-green-700';
        button.textContent = 'Talk';
        container.appendChild(button);
        addAudioButtonStyles();

        // Call the function to inject the script after the button has been added
        injectScript(registerAudioButtonEvents);
    }


    function addAudioButtonStyles() {
        // Get the button and register for mousedown and mouseup events
        var button = document.getElementById('talkButton');
        button.style.marginTop = '0.25rem;'
    }

    function registerAudioButtonEvents() {
        var button = document.getElementById('talkButton');

        button.addEventListener('mousedown', function () {
            idPromptTextArea();
            console.log('Button pressed');
            unsafeWindow.startRecording();
        });
        button.addEventListener('mouseup', function () {
            console.log('Button released');
            unsafeWindow.stopRecording();
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
