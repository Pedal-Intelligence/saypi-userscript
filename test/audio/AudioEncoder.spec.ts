import { describe, it, expect } from "vitest";
import { convertToWavBuffer, convertToWavBlob } from "../../src/audio/AudioEncoder";
import { encodeWAV, decodePcm16Wav } from "../../src/audio/WavEncoder";

/**
 * Minimal WAV header reader so the tests can assert the on-the-wire format
 * the server receives (see #414 — we switched the upload from 32-bit float to
 * 16-bit PCM to halve the transcribe upload size).
 */
function readWavHeader(buffer: ArrayBuffer) {
  const view = new DataView(buffer);
  const ascii = (offset: number, length: number) =>
    String.fromCharCode(
      ...Array.from({ length }, (_, i) => view.getUint8(offset + i))
    );
  return {
    riff: ascii(0, 4),
    wave: ascii(8, 4),
    fmt: ascii(12, 4),
    audioFormat: view.getUint16(20, true), // 1 = PCM, 3 = IEEE float
    numChannels: view.getUint16(22, true),
    sampleRate: view.getUint32(24, true),
    byteRate: view.getUint32(28, true),
    blockAlign: view.getUint16(32, true),
    bitsPerSample: view.getUint16(34, true),
    data: ascii(36, 4),
    dataLength: view.getUint32(40, true),
  };
}

describe("AudioEncoder — transcribe upload format (#414)", () => {
  const samples = new Float32Array([0, 1, -1, 0.5, -0.5]);

  describe("convertToWavBuffer", () => {
    it("encodes 16-bit PCM, not 32-bit float", () => {
      const header = readWavHeader(convertToWavBuffer(samples));
      expect(header.audioFormat).toBe(1); // PCM, not 3 (float)
      expect(header.bitsPerSample).toBe(16);
    });

    it("keeps the 16 kHz mono shape the ASR pipeline expects", () => {
      const header = readWavHeader(convertToWavBuffer(samples));
      expect(header.numChannels).toBe(1);
      expect(header.sampleRate).toBe(16000);
      expect(header.blockAlign).toBe(2); // 1 channel * 2 bytes
      expect(header.byteRate).toBe(32000); // 16000 * 2 — half the old float rate
    });

    it("produces a well-formed RIFF/WAVE container", () => {
      const header = readWavHeader(convertToWavBuffer(samples));
      expect(header.riff).toBe("RIFF");
      expect(header.wave).toBe("WAVE");
      expect(header.fmt).toBe("fmt ");
      expect(header.data).toBe("data");
    });

    it("halves the byte size versus 32-bit float", () => {
      const buffer = convertToWavBuffer(samples);
      // 44-byte header + 2 bytes/sample (vs 4 bytes/sample for float)
      expect(buffer.byteLength).toBe(44 + samples.length * 2);
      const header = readWavHeader(buffer);
      expect(header.dataLength).toBe(samples.length * 2);
    });

    it("converts float samples to the expected int16 values", () => {
      const buffer = convertToWavBuffer(samples);
      const view = new DataView(buffer);
      const pcm = Array.from({ length: samples.length }, (_, i) =>
        view.getInt16(44 + i * 2, true)
      );
      // floatTo16BitPCM: negatives scale by 0x8000, non-negatives by 0x7fff
      expect(pcm).toEqual([0, 32767, -32768, 16383, -16384]);
    });
  });

  describe("convertToWavBlob", () => {
    it("returns an audio/wav blob of the 16-bit PCM size", () => {
      const blob = convertToWavBlob(samples);
      expect(blob.type).toBe("audio/wav");
      expect(blob.size).toBe(44 + samples.length * 2);
    });
  });

  describe("edge cases", () => {
    const pcmValues = (buffer: ArrayBuffer) => {
      const view = new DataView(buffer);
      const count = (buffer.byteLength - 44) / 2;
      return Array.from({ length: count }, (_, i) => view.getInt16(44 + i * 2, true));
    };

    it("emits a valid header-only WAV for a zero-length clip (VAD misfire)", () => {
      const buffer = convertToWavBuffer(new Float32Array([]));
      expect(buffer.byteLength).toBe(44);
      const header = readWavHeader(buffer);
      expect(header.audioFormat).toBe(1);
      expect(header.dataLength).toBe(0);
    });

    it("clamps out-of-range samples to the int16 extremes", () => {
      // floatTo16BitPCM clamps to [-1, 1] before scaling
      expect(pcmValues(convertToWavBuffer(new Float32Array([2, -2])))).toEqual([
        32767, -32768,
      ]);
    });

    it("coerces non-finite samples safely (NaN → 0, ±Infinity → extremes)", () => {
      expect(
        pcmValues(convertToWavBuffer(new Float32Array([NaN, Infinity, -Infinity])))
      ).toEqual([0, 32767, -32768]);
    });
  });

  describe("encodeWAV low-level encoder", () => {
    it("still supports explicit 32-bit float output (format 3)", () => {
      const header = readWavHeader(encodeWAV(samples, 3, 16000, 1, 32));
      expect(header.audioFormat).toBe(3);
      expect(header.bitsPerSample).toBe(32);
    });
  });

  // decodePcm16Wav is the inverse used to transcode the WAV upload to Opus (#414).
  describe("decodePcm16Wav", () => {
    it("round-trips 16-bit PCM WAV samples back to ~Float32", () => {
      const src = new Float32Array([0, 0.5, -0.5, 1, -1]);
      const decoded = decodePcm16Wav(convertToWavBuffer(src));
      expect(decoded).not.toBeNull();
      expect(decoded!.length).toBe(src.length);
      expect(decoded![0]).toBeCloseTo(0, 4);
      expect(decoded![1]).toBeCloseTo(0.5, 3);
      expect(decoded![2]).toBeCloseTo(-0.5, 4);
      expect(decoded![3]).toBeCloseTo(1, 3); // 32767/32768 ≈ 0.99997
      expect(decoded![4]).toBeCloseTo(-1, 4);
    });

    it("returns null for a 32-bit float WAV (not 16-bit PCM)", () => {
      const floatWav = encodeWAV(new Float32Array([0.1, 0.2]), 3, 16000, 1, 32);
      expect(decodePcm16Wav(floatWav)).toBeNull();
    });

    it("returns null for non-RIFF / too-short bytes", () => {
      expect(decodePcm16Wav(new ArrayBuffer(8))).toBeNull();
      expect(decodePcm16Wav(new ArrayBuffer(64))).toBeNull(); // 64 zero bytes: not RIFF
    });
  });
});
