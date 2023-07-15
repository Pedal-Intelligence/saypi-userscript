// ==UserScript==
// @name         Say, Pi
// @namespace    http://veloware.com/
// @version      0.1
// @description  Speak to Pi with OpenAI's Whisper
// @author       Ross Cadogan
// @match        https://heypi.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Create a MutationObserver to listen for changes to the DOM
    var observer = new MutationObserver(function(mutations) {
        // Check each mutation
        for (var i = 0; i < mutations.length; i++) {
            var mutation = mutations[i];

            // If nodes were added, check each one
            if (mutation.addedNodes.length > 0) {
                for (var j = 0; j < mutation.addedNodes.length; j++) {
                    var node = mutation.addedNodes[j];

                    // If the node is an <audio> element, add the button and stop observing
                    if (node.nodeName.toLowerCase() === 'audio') {
                        node.insertAdjacentHTML('beforebegin', '<button id="talkButton" type="button">Talk</button>');

                        // Get the button and register for mousedown and mouseup events
                        var button = document.getElementById('talkButton');
                        button.addEventListener('mousedown', function() {
                            console.log('Button pressed');
                        });
                        button.addEventListener('mouseup', function() {
                            console.log('Button released');
                        });

                        // Add styles to the button
                        button.style.display = 'inline-block';
                        button.style.float = 'right';
                        button.style.width = '50px';
                        button.style.height = '50px';
                        button.style.marginRight = '75px';
                        button.style.border = '1px solid';

                        observer.disconnect();
                        return;
                    }
                }
            }
        }
    });

    // Start observing the entire document for changes to child nodes and subtree
    observer.observe(document, { childList: true, subtree: true });
})();
