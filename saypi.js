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

                    // If the node is an <audio> element, add the button and stop observing
                    if (node.nodeName.toLowerCase() === 'audio') {
                        addAudioButton(node);
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
        var audioDataChunks = [];

        function uploadAudio(audioBlob) {
            // Create a FormData object
            var formData = new FormData();
            // Add the audio blob to the FormData object
            formData.append('audio', audioBlob, 'audio.webm');
            // Post the audio to the server for transcription
            fetch('http://localhost:5000/transcribe', {
                method: 'POST',
                body: formData
            })
                .then(function (response) {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    return response.json();
                })
                .then(function (responseJson) {
                    var textarea = document.getElementById('prompt');
                    textarea.value = responseJson.transcription;
                })
                .catch(function (error) {
                    console.log('Looks like there was a problem: ', error);
                    var textarea = document.getElementById('prompt');
                    textarea.value = 'Sorry, there was a problem transcribing your audio. Please try again later.';
                });
        }
        
        // This function will be called when the user presses the record button
        function startRecording() {
            // Get a stream from the user's microphone
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(function (stream) {
                    // Create a new MediaRecorder object using the stream and specifying the MIME type
                    var options = { mimeType: 'audio/webm;codecs=opus' };
                    var mediaRecorder = new MediaRecorder(stream, options);
        
                    // Listen for the 'dataavailable' event
                    mediaRecorder.addEventListener('dataavailable', function (e) {
                        // Add the audio data chunk to the array
                        audioDataChunks.push(e.data);
                    });
        
                    // Listen for the 'stop' event
                    mediaRecorder.addEventListener('stop', function () {
                        // Create a Blob from the audio data chunks
                        var audioBlob = new Blob(audioDataChunks, { type: 'audio/webm' });
        
                        // Upload the audio to the server for transcription
                        uploadAudio(audioBlob);
        
                        // Clear the array for the next recording
                        audioDataChunks = [];
                    });
        
                    // Start recording
                    mediaRecorder.start();
                    console.log('Recording started');
        
                    // This function will be called when the user releases the record button
                    window.stopRecording = function () {
                        // Stop recording
                        mediaRecorder.stop();
                        console.log('Recording stopped');
                        // Remove the stopRecording function
                        delete window.stopRecording;
                    }
                })
                .catch(function (err) {
                    console.error('Error getting audio stream: ' + err);
                });
        }
        
        // Add the startRecording function to the window object so it can be called from outside this script
        window.startRecording = startRecording;
        console.log('Recording functions registered (local)')
        `
        scriptElement.textContent = scriptText;
        document.body.appendChild(scriptElement);

        // Call the callback function after the script is added
        if (callback) {
            callback();
        }
    }

    function addAudioButton(node) {
        var divElement = node.previousElementSibling;
        if (divElement && divElement.nodeName.toLowerCase() === 'div') {
            divElement.insertAdjacentHTML('beforeend', '<button id="talkButton" type="button">Talk</button>');
            addAudioButtonStyles();

            // Call the function to inject the script after the button has been added
            injectScript(registerAudioButtonEvents);
        }
    }


    function addAudioButtonStyles() {
        // Get the button and register for mousedown and mouseup events
        var button = document.getElementById('talkButton');
        button.style.display = 'inline-block';
        button.style.float = 'right';
        button.style.width = '50px';
        button.style.height = '50px';
        button.style.marginRight = '100px';
        button.style.border = '1px solid';
    }

    function registerAudioButtonEvents() {
        var button = document.getElementById('talkButton');

        console.log('registering button event listeners')
        button.addEventListener('mousedown', function () {
            idPromptTextArea();
            var textarea = document.getElementById('prompt');
            console.log('Button pressed');
            textarea.value = 'Button pressed';
            unsafeWindow.startRecording();
        });
        button.addEventListener('mouseup', function () {
            var textarea = document.getElementById('prompt');
            console.log('Button released');
            textarea.value = 'Button released';
            unsafeWindow.stopRecording();
        });
        console.log('button event listeners registered')
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
