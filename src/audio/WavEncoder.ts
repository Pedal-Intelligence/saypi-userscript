// Most of the code here come from ricky0123/vad-web
// Who in turn copied it from linto-ai/WebVoiceSDK

export function minFramesForTargetMS(
  targetDuration: number,
  frameSamples: number,
  sr = 16000
): number {
  return Math.ceil((targetDuration * sr) / 1000 / frameSamples);
}

export function arrayBufferToBase64(buffer: ArrayBuffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i] as number);
  }
  return btoa(binary);
}

/*
  This rest of this was mostly copied from https://github.com/linto-ai/WebVoiceSDK
  */

// this function is used to encode the Float32Array audio data produced from a MicVAD
// as a WAV file audio buffer
export function encodeWAV(
  samples: Float32Array,
  format: number = 3,
  sampleRate: number = 16000,
  numChannels: number = 1,
  bitDepth: number = 32
) {
  var bytesPerSample = bitDepth / 8;
  var blockAlign = numChannels * bytesPerSample;
  var buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
  var view = new DataView(buffer);
  /* RIFF identifier */
  writeString(view, 0, "RIFF");
  /* RIFF chunk length */
  view.setUint32(4, 36 + samples.length * bytesPerSample, true);
  /* RIFF type */
  writeString(view, 8, "WAVE");
  /* format chunk identifier */
  writeString(view, 12, "fmt ");
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, format, true);
  /* channel count */
  view.setUint16(22, numChannels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * blockAlign, true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, blockAlign, true);
  /* bits per sample */
  view.setUint16(34, bitDepth, true);
  /* data chunk identifier */
  writeString(view, 36, "data");
  /* data chunk length */
  view.setUint32(40, samples.length * bytesPerSample, true);
  if (format === 1) {
    // Raw PCM
    floatTo16BitPCM(view, 44, samples);
  } else {
    writeFloat32(view, 44, samples);
  }
  return buffer;
}

/**
 * Decode a 16-bit PCM mono WAV (as produced by `encodeWAV(..., 1, 16000, 1, 16)`)
 * back to Float32 samples. Returns null if the bytes are not the expected
 * 16-bit-PCM layout, so callers can leave non-matching blobs untouched. Used to
 * transcode the upload to Opus at the network boundary (#414) without re-plumbing
 * the synchronous audio-event pipeline that carries the WAV blob.
 */
export function decodePcm16Wav(buffer: ArrayBuffer): Float32Array | null {
  if (buffer.byteLength < 44) return null;
  const view = new DataView(buffer);
  const isRiffWave =
    view.getUint32(0, false) === 0x52494646 /* "RIFF" */ &&
    view.getUint32(8, false) === 0x57415645 /* "WAVE" */;
  const audioFormat = view.getUint16(20, true);
  const bitsPerSample = view.getUint16(34, true);
  if (!isRiffWave || audioFormat !== 1 || bitsPerSample !== 16) return null;

  const declaredDataLength = view.getUint32(40, true);
  const available = buffer.byteLength - 44;
  const dataLength = Math.min(declaredDataLength, available);
  const sampleCount = Math.floor(dataLength / 2);
  const out = new Float32Array(sampleCount);
  for (let i = 0; i < sampleCount; i++) {
    out[i] = view.getInt16(44 + i * 2, true) / 0x8000;
  }
  return out;
}

function writeFloat32(output: DataView, offset: number, input: Float32Array) {
  for (var i = 0; i < input.length; i++, offset += 4) {
    output.setFloat32(offset, input[i] as number, true);
  }
}

function floatTo16BitPCM(
  output: DataView,
  offset: number,
  input: Float32Array
) {
  for (var i = 0; i < input.length; i++, offset += 2) {
    var s = Math.max(-1, Math.min(1, input[i] as number));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
}

function writeString(view: DataView, offset: number, string: string) {
  for (var i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
