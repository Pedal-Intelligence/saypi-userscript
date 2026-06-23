// Minimal WAV (RIFF) read/write for the VAD benchmark corpus — pure Node, no deps.
// Supports the only formats the corpus uses: PCM16 and IEEE float32, mono or
// multi-channel (channel 0 is taken). Returns/accepts Float32Array in [-1, 1].

/**
 * Decode a WAV Buffer into { samples: Float32Array, sampleRate, channels }.
 * Multi-channel audio is downmixed to channel 0 (the corpus is mono anyway).
 */
export function decodeWav(buffer) {
  const view = new DataView(
    buffer.buffer,
    buffer.byteOffset,
    buffer.byteLength
  );
  const tag = (off) =>
    String.fromCharCode(
      view.getUint8(off),
      view.getUint8(off + 1),
      view.getUint8(off + 2),
      view.getUint8(off + 3)
    );

  if (tag(0) !== "RIFF" || tag(8) !== "WAVE") {
    throw new Error("Not a RIFF/WAVE file");
  }

  let offset = 12;
  let fmt = null;
  let dataOffset = -1;
  let dataLength = 0;
  while (offset + 8 <= view.byteLength) {
    const chunkId = tag(offset);
    const chunkSize = view.getUint32(offset + 4, true);
    const body = offset + 8;
    if (chunkId === "fmt ") {
      fmt = {
        audioFormat: view.getUint16(body, true),
        channels: view.getUint16(body + 2, true),
        sampleRate: view.getUint32(body + 4, true),
        bitsPerSample: view.getUint16(body + 14, true),
      };
    } else if (chunkId === "data") {
      dataOffset = body;
      dataLength = chunkSize;
    }
    // Chunks are word-aligned (pad to even length).
    offset = body + chunkSize + (chunkSize % 2);
  }

  if (!fmt) throw new Error("WAV missing fmt chunk");
  if (dataOffset < 0) throw new Error("WAV missing data chunk");

  const { audioFormat, channels, sampleRate, bitsPerSample } = fmt;
  const bytesPerSample = bitsPerSample / 8;
  const frameCount = Math.floor(dataLength / (bytesPerSample * channels));
  const samples = new Float32Array(frameCount);

  for (let i = 0; i < frameCount; i++) {
    const sampleOffset = dataOffset + i * bytesPerSample * channels; // channel 0
    if (audioFormat === 1 && bitsPerSample === 16) {
      samples[i] = view.getInt16(sampleOffset, true) / 32768;
    } else if (audioFormat === 3 && bitsPerSample === 32) {
      samples[i] = view.getFloat32(sampleOffset, true);
    } else if (audioFormat === 1 && bitsPerSample === 8) {
      samples[i] = (view.getUint8(sampleOffset) - 128) / 128;
    } else {
      throw new Error(
        `Unsupported WAV format: audioFormat=${audioFormat} bits=${bitsPerSample}`
      );
    }
  }

  return { samples, sampleRate, channels };
}

/**
 * Encode a mono Float32Array as a 16-bit PCM WAV Buffer.
 */
export function encodeWavPcm16(samples, sampleRate) {
  const dataLength = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataLength);
  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  const writeTag = (off, s) => {
    for (let i = 0; i < 4; i++) view.setUint8(off + i, s.charCodeAt(i));
  };

  writeTag(0, "RIFF");
  view.setUint32(4, 36 + dataLength, true);
  writeTag(8, "WAVE");
  writeTag(12, "fmt ");
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeTag(36, "data");
  view.setUint32(40, dataLength, true);

  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, Math.round(clamped * 32767), true);
  }
  return buffer;
}
