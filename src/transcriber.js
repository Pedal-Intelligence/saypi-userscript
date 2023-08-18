// Dispatch Custom Event
function dispatchCustomEvent(eventName, detail = {}) {
  const event = new CustomEvent(eventName, { detail });
  window.dispatchEvent(event);
}

// audio output (Pi)
const audioElement = document.querySelector("audio");
if (!audioElement) {
  console.error("Audio element not found!");
}

// TODO: dedupe this function from EventModule.js
function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

audioElement.preload = "auto"; // enable aggressive preloading of audio
const piAudioManager = {
  isSpeaking: false,
  audioElement: audioElement,
  _userStarted: true, // flag to indicate playback has been started by the user (true by default because user must request initial playback)
  _isLoadCalled: false, // flag to indicate if the load() method has been called on the audio element

  isLoadCalled: function () {
    return this._isLoadCalled;
  },

  setIsLoadCalled: function (value) {
    this._isLoadCalled = value;
  },

  userPlay: function () {
    if (!isSafari()) {
      return;
    }

    this._userStarted = true; // set a flag to indicate playback has been started by the user
    this.audioElement.load(); // reset for Safari
    this.audioElement.play();
    console.log("User started playback");
  },

  autoPlay: function () {
    if (!this._userStarted) {
      this.audioElement.pause();
      console.log("Autoplay prevented");
    }
  },

  stop: function () {
    if (this.isSpeaking) {
      this.audioElement.pause();
    }
    if (
      this.audioElement.duration &&
      !this.audioElement.ended &&
      this.audioElement.currentTime < this.audioElement.duration
    ) {
      this.audioElement.currentTime = this.audioElement.duration; // seek the audio to the end
      this.audioElement.play(); // trigger the ended event
    }
  },

  pause: function () {
    this.audioElement.pause();
  },

  resume: function () {
    this.audioElement.play();
  },

  playing: function () {
    this.isSpeaking = true;
  },

  stopped: function () {
    this.isSpeaking = false;
    this._userStarted = false;
  },
};

// Intercept Autoplay Events (autoplay doesn't work on Safari)
audioElement.addEventListener("play", function () {
  if (isSafari()) {
    piAudioManager.autoPlay();
  }
});

audioElement.addEventListener("loadstart", function () {
  if (isSafari()) {
    console.log("Pi is waiting to speak");
    dispatchCustomEvent("saypi:piReadyToRespond");
  }
});

// Event listeners for detecting when Pi is speaking
audioElement.addEventListener("playing", () => {
  console.log("Pi is speaking");
  piAudioManager.playing();
  dispatchCustomEvent("saypi:piSpeaking");
});

audioElement.addEventListener("pause", () => {
  console.log("Pi stopped speaking");
  piAudioManager.stopped();
  dispatchCustomEvent("saypi:piStoppedSpeaking");
});

audioElement.addEventListener("ended", () => {
  console.log("Pi finished speaking");
  piAudioManager.stopped();
  dispatchCustomEvent("saypi:piFinishedSpeaking");
});

// audio input (user)
var audioDataChunks = [];
var audioMimeType = "audio/webm;codecs=opus";

function uploadAudio(audioBlob) {
  // Create a FormData object
  var formData = new FormData();
  var audioFilename = "audio.webm";
  if (audioBlob.type === "audio/mp4") {
    audioFilename = "audio.mp4";
  }
  // Add the audio blob to the FormData object
  formData.append("audio", audioBlob, audioFilename);
  // Get the user's preferred language
  var language = navigator.language;
  // Post the audio to the server for transcription
  fetch(config.apiServerUrl + "/transcribe?language=" + language, {
    method: "POST",
    body: formData,
  })
    .then(function (response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .then(function (responseJson) {
      dispatchCustomEvent("saypi:transcribed", { text: responseJson.text });
    })
    .catch(function (error) {
      console.error("Looks like there was a problem: ", error);
      var textarea = document.getElementById("prompt");
      textarea.value =
        "Sorry, there was a problem transcribing your audio. Please try again later.";
    });
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
  var audioBlob = new Blob(audioDataChunks, { type: audioMimeType });

  // Get the stop time and calculate the duration
  var stopTime = Date.now();
  var duration = stopTime - window.startTime;

  // If the duration is greater than the threshold, upload the audio for transcription
  if (duration >= threshold) {
    // download the audio
    var url = URL.createObjectURL(audioBlob);
    var a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "safari_audio.mp4";
    document.body.appendChild(a);
    // a.click();
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
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(function (stream) {
      if (!MediaRecorder.isTypeSupported(audioMimeType)) {
        // use MP4 for Safari
        audioMimeType = "audio/mp4";
      }
      // Create a new MediaRecorder object using the stream and specifying the MIME type
      var options = { mimeType: audioMimeType };
      mediaRecorder = new MediaRecorder(stream, options);

      // Listen for the 'dataavailable' event
      mediaRecorder.addEventListener("dataavailable", handleDataAvailable);

      // Listen for the 'stop' event
      mediaRecorder.addEventListener("stop", handleStop);
    })
    .then(function () {
      // Invoke the callback function
      if (typeof callback === "function") {
        callback();
      }
    })
    .catch(function (err) {
      console.error("Error getting audio stream: " + err);
    });
}

function tearDownRecording() {
  // Check if the MediaRecorder is set up
  if (!mediaRecorder) {
    return;
  }

  // Stop any ongoing recording
  if (mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }

  // Remove the MediaRecorder's event listeners
  mediaRecorder.removeEventListener("dataavailable", handleDataAvailable);
  mediaRecorder.removeEventListener("stop", handleStop);

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
  // Check if Pi is currently speaking and stop her audio
  if (piAudioManager.isSpeaking) {
    piAudioManager.pause();
  }

  // Start recording
  mediaRecorder.start();

  // Record the start time
  window.startTime = Date.now();

  console.log("User is speaking");

  // This function will be called when the user releases the record button
  window.stopRecording = function () {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      // Stop recording
      mediaRecorder.stop();

      // Record the stop time and calculate the duration
      var stopTime = Date.now();
      var duration = stopTime - window.startTime;

      // If the duration is less than the threshold, don't upload the audio for transcription
      if (duration < threshold) {
        console.log("User stopped speaking");
        console.log("Recording was too short, not uploading for transcription");
        piAudioManager.resume();
      } else {
        console.log("User finished speaking");
        piAudioManager.stop();
      }
    }
    // Remove the stopRecording function
    delete window.stopRecording;
  };
}

// Add the startRecording function to the window object so it can be called from outside this script
window.startRecording = startRecording;
