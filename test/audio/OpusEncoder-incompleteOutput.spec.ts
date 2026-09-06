import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * Guard against a WebM/Opus upload that carries no audio (#630).
 *
 * One Firefox 154 install shipped 47 consecutive uploads whose container had a
 * valid EBML header and no audio blocks at all — every transcription from it
 * failed. `encodeToOpusWebM` awaited `flush()` and finalized the muxer without
 * ever checking that a chunk had reached it, so an encoder that emitted nothing
 * still produced a well-formed, empty file. These tests pin the two ways that
 * happens: `output` never fires, and `output` fires but the muxer throws inside
 * it (a throw the browser swallows, since it owns the callback).
 */
describe("OpusEncoder — empty-output guard (#630)", () => {
  const g = globalThis as any;
  const originalAudioEncoder = g.AudioEncoder;
  const originalAudioData = g.AudioData;
  const originalEncodedAudioChunk = g.EncodedAudioChunk;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    g.AudioEncoder = originalAudioEncoder;
    g.AudioData = originalAudioData;
    g.EncodedAudioChunk = originalEncodedAudioChunk;
    vi.restoreAllMocks();
  });

  /** Stubs WebCodecs with an encoder that hands `output` whatever `emit` yields. */
  function stubEncoder(emit: (output: (chunk: any, meta: any) => void) => void) {
    g.AudioEncoder = class {
      static isConfigSupported = vi.fn().mockResolvedValue({ supported: true });
      private output: (chunk: any, meta: any) => void;
      constructor(init: { output: (chunk: any, meta: any) => void; error: (e: any) => void }) {
        this.output = init.output;
      }
      configure() {}
      encode() {}
      async flush() {
        emit(this.output);
      }
      close() {}
    };
    g.AudioData = class {
      close() {}
    };
    // webm-muxer type-checks the chunk; JSDOM has no WebCodecs classes.
    g.EncodedAudioChunk = class {
      constructor(props: Record<string, unknown>) {
        Object.assign(this, props);
      }
    };
  }

  it("rejects instead of returning an audio-less WebM when the encoder emits nothing", async () => {
    stubEncoder(() => {
      /* flush resolves without ever invoking output — the Firefox 154 signature */
    });
    const { encodeToOpusWebM, OpusEmptyOutputError } = await import(
      "../../src/audio/OpusEncoder"
    );

    const samples = new Float32Array(1600); // 100ms @ 16 kHz
    await expect(encodeToOpusWebM(samples)).rejects.toBeInstanceOf(OpusEmptyOutputError);
  });

  it("reports the input sample count so the affected installs are visible in logs", async () => {
    stubEncoder(() => {});
    const { encodeToOpusWebM } = await import("../../src/audio/OpusEncoder");
    const { logger } = await import("../../src/LoggingModule");
    const warn = vi.spyOn(logger, "warn").mockImplementation(() => {});

    await expect(encodeToOpusWebM(new Float32Array(4321))).rejects.toThrow();

    expect(warn).toHaveBeenCalledTimes(1);
    const [message, detail] = warn.mock.calls[0];
    expect(String(message)).toMatch(/no audio/i);
    expect(detail).toMatchObject({ samples: 4321, chunks: 0 });
  });

  it("rejects when the muxer throws inside the output callback (browser swallows it)", async () => {
    stubEncoder((output) => {
      // A chunk whose copyTo throws. The browser owns the `output` callback, so
      // a throw inside it is swallowed and never reaches our promise — the muxer
      // then finalizes an audio-less file. Model that by swallowing it here too.
      try {
        output(
          new g.EncodedAudioChunk({
            type: "key",
            timestamp: 0,
            duration: 20000,
            byteLength: 4,
            copyTo() {
              throw new Error("detached buffer");
            },
          }),
          { decoderConfig: { description: new Uint8Array([1, 2, 3]) } }
        );
      } catch {
        /* swallowed, exactly as the browser does */
      }
    });
    const { encodeToOpusWebM } = await import("../../src/audio/OpusEncoder");

    await expect(encodeToOpusWebM(new Float32Array(1600))).rejects.toThrow(/detached buffer/);
  });
});
