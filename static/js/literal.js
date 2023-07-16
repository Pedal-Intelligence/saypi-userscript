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

                // Log the size of the Blob
                console.log(`Blob size: ${audioBlob.size} bytes`);
                // Create a URL from the Blob
                var audioUrl = URL.createObjectURL(audioBlob);
                // Create a new audio element and set the source to the audio URL
                var audioElement = new Audio(audioUrl);
                // Append the audio element to the body of the document
                document.body.appendChild(audioElement);
                // Play the audio
                audioElement.play();

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
console.log('Recording functions registered (remote)')