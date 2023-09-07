// import state machines for audio input and output
const { interpret } = require("xstate");
//const audioInputMachine = require("./state-machines/AudioInputMachine");
//const createAudioOutputMachine = require("./state-machines/AudioOutputMachine");

// depends on the injecting script (saypi.index.js) declaring the EventBus as a global variable
const EventBus = window.EventBus;

// audio output (Pi)
const audioElement = document.querySelector("audio");
if (!audioElement) {
  console.error("Audio element not found!");
} else {
  audioElement.preload = "auto"; // enable aggressive preloading of audio
}

const initialContext = { userStarted: true, audioElement: audioElement };
const audioOutputActor = interpret(audioInputMachine).start();

function registerAudioPlaybackEvents(audio, actor) {
  audio.addEventListener("loadstart", function () {
    actor.send("loadStart");
  });

  // Intercept Autoplay Events (can't autoplay full audio on Safari)
  audio.addEventListener("play", function () {
    actor.send("play");
  });

  // Event listeners for detecting when Pi is speaking
  audio.addEventListener("playing", () => {
    actor.send("play");
  });

  audio.addEventListener("pause", () => {
    actor.send("pause");
  });

  audio.addEventListener("ended", () => {
    actor.send("ended");
  });
}
registerAudioPlaybackEvents(audioElement, audioOutputActor);

// audio input (user)
var audioDataChunks = [];
var audioMimeType = "audio/webm;codecs=opus";

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
    // Upload the audio to the server for transcription
    EventBus.emit("saypi:userFinishedSpeaking", {
      duration: duration,
      blob: audioBlob,
    });
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

// To request recording, other modules can dispatch a custom event audio:startRecording
function startRecording() {
  // Check if the MediaRecorder is set up
  if (!mediaRecorder) {
    setupRecording(startRecording);
    return;
  }
  // Check if Pi is currently speaking and stop her audio
  audioOutputActor.send("pause");

  // Start recording
  mediaRecorder.start();

  // Record the start time
  window.startTime = Date.now();

  EventBus.emit("saypi:userSpeaking");
}

// To stop recording, other modules can dispatch a custom event audio:stopRecording
function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    // Stop recording
    mediaRecorder.stop();

    // Record the stop time and calculate the duration
    var stopTime = Date.now();
    var duration = stopTime - window.startTime;

    // If the duration is less than the threshold, don't upload the audio for transcription
    if (duration < threshold) {
      console.log("Recording was too short, not uploading for transcription");
      EventBus.emit("saypi:userStoppedSpeaking", { duration: duration });
      audioOutputActor.send("play"); // resume Pi's audio
    } else {
      audioOutputActor.send("stop"); // cancel Pi's audio
    }
  }
}

/* These events are used to control/pass requests to the audio module from other modules */
function registerAudioCommands() {
  EventBus.on("audio:setupRecording", function (e) {
    setupRecording();
  });

  EventBus.on("audio:tearDownRecording", function (e) {
    tearDownRecording();
  });

  EventBus.on("audio:startRecording", function (e) {
    startRecording();
  });
  EventBus.on("audio:stopRecording", function (e) {
    stopRecording();
  });
  EventBus.on("audio:reload", function (e) {
    audioOutputActor.send("reload");
  });
}
registerAudioCommands();
