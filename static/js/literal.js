var audioDataChunks = [];

function uploadAudio(audioBlob) {
    // Create a FormData object
    var formData = new FormData();
    // Add the audio blob to the FormData object
    formData.append('audio', audioBlob, 'audio.webm');
    // Get the user's preferred language
    var language = navigator.language;
    // Post the audio to the server for transcription
    fetch(config.apiServerUrl + '/transcribe?language=' + language, {
        method: 'POST',
        body: formData
    })
        .then(function (response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(handleTranscriptionResponse)
        .catch(function (error) {
            console.error('Looks like there was a problem: ', error);
            var textarea = document.getElementById('prompt');
            textarea.value = 'Sorry, there was a problem transcribing your audio. Please try again later.';
        });
}

function handleTranscriptionResponse(responseJson) {
    var textarea = document.getElementById('prompt');
    simulateTyping(textarea, responseJson.text + " ");
    console.log('Speaker: ' + responseJson.text);
}


function setNativeValue(element, value) {
    let lastValue = element.value;
    element.value = value;
    let event = new Event("input", { target: element, bubbles: true });
    // React 15
    event.simulated = true;
    // React 16-17
    let tracker = element._valueTracker;
    if (tracker) {
        tracker.setValue(lastValue);
    }
    element.dispatchEvent(event);
}

function simulateFormSubmit(textarea) {
    var enterEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        key: 'Enter',
        keyCode: 13,
        which: 13,
    });

    textarea.dispatchEvent(enterEvent);
}

function simulateTyping(element, text) {
    var words = text.split(' ');  // Split the text into words (may not be ideal for all languages)
    var i = 0;
    function typeWord() {
        if (i < words.length) {
            // Append the next word and a space, then increment i
            setNativeValue(element, element.value + words[i++] + ' ');
            // Call this function again before the next repaint
            requestAnimationFrame(typeWord);
        } else {
            // Check if autosubmit is enabled
            var talkButton = document.getElementById('talkButton');
            if (talkButton.dataset.autosubmit === 'false') {
                console.log('Autosubmit is disabled');
            }
            else {
                // Simulate an "Enter" keypress event
                simulateFormSubmit(element);
                console.log('Message autosubmitted');
            }
        }
    }
    // Start typing
    typeWord();
}


// Declare a global variable for the mediaRecorder
var mediaRecorder;
const threshold = 1000; // 1000 ms = 1 second, about the length of "Hey, Pi"

// This function will be called when the 'dataavailable' event fires
function handleDataAvailable(e) {
    // Add the audio data chunk to the array
    audioDataChunks.push(e.data);
}

// This function will be called when the 'stop' event fires
function handleStop() {
    // Create a Blob from the audio data chunks
    var audioBlob = new Blob(audioDataChunks, { type: 'audio/webm' });

    // Get the stop time and calculate the duration
    var stopTime = Date.now();
    var duration = stopTime - window.startTime;

    // If the duration is greater than the threshold, upload the audio for transcription
    if (duration >= threshold) {
        // Upload the audio to the server for transcription
        uploadAudio(audioBlob);
    }

    // Clear the array for the next recording
    audioDataChunks = [];
}


function setupRecording(callback) {
    if (mediaRecorder) {
        return;
    }

    // Get a stream from the user's microphone
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
            // Create a new MediaRecorder object using the stream and specifying the MIME type
            var options = { mimeType: 'audio/webm;codecs=opus' };
            mediaRecorder = new MediaRecorder(stream, options);

            // Listen for the 'dataavailable' event
            mediaRecorder.addEventListener('dataavailable', handleDataAvailable);

            // Listen for the 'stop' event
            mediaRecorder.addEventListener('stop', handleStop);
        })
        .then(function () {
            // Invoke the callback function
            if (typeof callback === 'function') {
                callback();
            }
        })
        .catch(function (err) {
            console.error('Error getting audio stream: ' + err);
        });
}

function tearDownRecording() {
    // Check if the MediaRecorder is set up
    if (!mediaRecorder) {
        return;
    }

    // Stop any ongoing recording
    if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
    }

    // Remove the MediaRecorder's event listeners
    mediaRecorder.removeEventListener('dataavailable', handleDataAvailable);
    mediaRecorder.removeEventListener('stop', handleStop);

    // Clear the MediaRecorder variable
    mediaRecorder = null;
}


// This function will be called when the user presses the record button
function startRecording() {
    // Check if the MediaRecorder is set up
    if (!mediaRecorder) {
        setupRecording(startRecording);
        return;
    }

    // Start recording
    mediaRecorder.start();

    // Record the start time
    window.startTime = Date.now();

    console.log('Recording started');

    // This function will be called when the user releases the record button
    window.stopRecording = function () {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            // Stop recording
            mediaRecorder.stop();

            // Record the stop time and calculate the duration
            var stopTime = Date.now();
            var duration = stopTime - window.startTime;

            // If the duration is less than the threshold, don't upload the audio for transcription
            if (duration < threshold) {
                console.log('Recording was too short, not uploading for transcription');
            } else {
                console.log('Recording stopped');
            }
        }
        // Remove the stopRecording function
        delete window.stopRecording;
    }
}



// Add the startRecording function to the window object so it can be called from outside this script
window.startRecording = startRecording;
