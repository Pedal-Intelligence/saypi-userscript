// ==UserScript==
// @name         Say, Pi
// @namespace    http://veloware.com/
// @version      0.1
// @description  Speak to Pi with OpenAI's Whisper
// @author       Ross Cadogan
// @match        https://heypi.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Find the first <audio> element
    var audioElement = document.querySelector('audio');
    if (audioElement) {
        // Insert a new <button> element just before the <audio> element
        audioElement.insertAdjacentHTML('beforebegin', '<button id="talkButton">Talk</button>');
    } else {
        console.log('No <audio> element found');
    }
})();
