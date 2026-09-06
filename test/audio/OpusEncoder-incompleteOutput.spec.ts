import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * Guard against a WebM/Opus upload the server cannot correctly decode (#630).
 *
 * One Firefox 154 install shipped 47 consecutive uploads whose container had a
 * valid EBML header and no audio blocks at all — every transcription from it
 * failed. `encodeToOpusWebM` awaited `flush()` and finalized the muxer without
 * ever checking what had reached it, so an encoder that emitted nothing still
 * produced a well-formed, empty file.
 *
 * These tests pin the three ways a stream can arrive incomplete: `output` never
 * fires; `output` fires but the muxer throws inside it (a throw the browser
 * swallows, since it owns the callback); and `output` fires twice, the first
 * chunk muxing and the second throwing — which finalizes a truncated file that
 * transcribes to a plausible wrong answer rather than failing outright.
 */
describe("OpusEncoder — incomplete-output guard (#630)", () => {
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
    const { encodeToOpusWebM, OpusIncompleteOutputError } = await import(
      "../../src/audio/OpusEncoder"
    );

    const samples = new Float32Array(1600); // 100ms @ 16 kHz
    await expect(encodeToOpusWebM(samples)).rejects.toBeInstanceOf(OpusIncompleteOutputError);
  });

  it("reports the input sample count so the affected installs are visible in logs", async () => {
    stubEncoder(() => {});
    const { encodeToOpusWebM } = await import("../../src/audio/OpusEncoder");
    const { logger } = await import("../../src/LoggingModule");
    const warn = vi.spyOn(logger, "warn").mockImplementation(() => {});

    await expect(encodeToOpusWebM(new Float32Array(4321))).rejects.toThrow();

    expect(warn).toHaveBeenCalledTimes(1);
    const [message, detail] = warn.mock.calls[0];
    expect(String(message)).toMatch(/complete stream/i);
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

  it("rejects a partial encode where one chunk muxed and the next threw", async () => {
    // The swallow is per-invocation: an encoder can deliver chunk 1 fine and
    // throw on chunk 2. Finalizing then yields a TRUNCATED file that decodes
    // to a partial transcript — a wrong answer is worse than no answer, and
    // the user is billed for it either way.
    stubEncoder((output) => {
      const meta = { decoderConfig: { description: new Uint8Array([1, 2, 3]) } };
      const bytes = new Uint8Array([1, 2, 3, 4]);
      output(
        new g.EncodedAudioChunk({
          type: "key",
          timestamp: 0,
          duration: 20000,
          byteLength: bytes.byteLength,
          copyTo(dest: Uint8Array) {
            dest.set(bytes);
          },
        }),
        meta
      );
      try {
        output(
          new g.EncodedAudioChunk({
            type: "delta",
            timestamp: 20000,
            duration: 20000,
            byteLength: 4,
            copyTo() {
              throw new Error("detached buffer");
            },
          }),
          meta
        );
      } catch {
        /* swallowed, exactly as the browser does */
      }
    });
    const { encodeToOpusWebM } = await import("../../src/audio/OpusEncoder");

    await expect(encodeToOpusWebM(new Float32Array(1600))).rejects.toThrow(/detached buffer/);
  });

  it("reports how many chunks did land, so partial and total failures are distinguishable", async () => {
    stubEncoder((output) => {
      const bytes = new Uint8Array([1, 2, 3, 4]);
      const meta = { decoderConfig: { description: new Uint8Array([1, 2, 3]) } };
      output(
        new g.EncodedAudioChunk({
          type: "key",
          timestamp: 0,
          duration: 20000,
          byteLength: bytes.byteLength,
          copyTo(dest: Uint8Array) {
            dest.set(bytes);
          },
        }),
        meta
      );
      try {
        output(
          new g.EncodedAudioChunk({
            type: "delta",
            timestamp: 20000,
            duration: 20000,
            byteLength: 4,
            copyTo() {
              throw new Error("detached buffer");
            },
          }),
          meta
        );
      } catch {
        /* swallowed */
      }
    });
    const { encodeToOpusWebM } = await import("../../src/audio/OpusEncoder");
    const { logger } = await import("../../src/LoggingModule");
    const warn = vi.spyOn(logger, "warn").mockImplementation(() => {});

    await expect(encodeToOpusWebM(new Float32Array(1600))).rejects.toThrow();

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][1]).toMatchObject({ samples: 1600, chunks: 1 });
  });

  it("closes the codec resources before rejecting", async () => {
    const closed: string[] = [];
    g.AudioEncoder = class {
      static isConfigSupported = vi.fn().mockResolvedValue({ supported: true });
      constructor(_init: unknown) {}
      configure() {}
      encode() {}
      async flush() {}
      close() {
        closed.push("encoder");
      }
    };
    g.AudioData = class {
      close() {
        closed.push("frame");
      }
    };
    const { encodeToOpusWebM } = await import("../../src/audio/OpusEncoder");

    await expect(encodeToOpusWebM(new Float32Array(1600))).rejects.toThrow();
    expect(closed).toEqual(expect.arrayContaining(["encoder", "frame"]));
  });
});
