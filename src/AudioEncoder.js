import { encodeWAV } from "./WavEncoder";

/**
 * Convert a Float32Array of audio samples to a WAV Blob
 * @param {Float32Array} audioData - The audio samples
 * @returns {Blob} - The audio in WAV format
 */
export function convertToWavBlob(audioData) {
  const arrayBuffer = encodeWAV(audioData);
  return new Blob([arrayBuffer], { type: "audio/wav" });
}

/**
 * Convert a Float32Array of audio samples to a WAV Blob using WebM Opus encoding
 * This function is hella slow, so it's not recommended for real-time encoding
 * @param {Float32Array} audioData - The audio samples
 * @returns {Blob} - The audio in WebM format
 */
export function convertToWebMBlob(audioFloat32Array, callback) {
  // Create an offline audio context
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Create an empty stereo buffer at the sample rate of the audio you are working with
  const audioBuffer = audioContext.createBuffer(
    1,
    audioFloat32Array.length,
    16000
  );

  // Copy the samples to the buffer
  audioBuffer.copyToChannel(audioFloat32Array, 0);

  // Create a buffer source for our AudioContext
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;

  // Create a MediaStreamAudioDestinationNode
  const dest = audioContext.createMediaStreamDestination();

  // Connect the source to the destination
  source.connect(dest);

  // Create a new MediaRecorder
  const mediaRecorder = new MediaRecorder(dest.stream, {
    mimeType: "audio/webm;codecs=opus",
  });

  // Collect the recorded chunks
  const audioChunks = [];
  mediaRecorder.addEventListener("dataavailable", (event) => {
    audioChunks.push(event.data);
  });

  // Start and stop the recording to get the blob
  mediaRecorder.addEventListener("stop", () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/webm;codecs=opus" });
    // Invoke the callback with the audioBlob
    callback(audioBlob);
  });

  // Start the source buffer and MediaRecorder
  mediaRecorder.start();
  source.start(0);

  // When the buffer source ends, stop the MediaRecorder
  source.addEventListener("ended", () => {
    mediaRecorder.stop();
  });
}
