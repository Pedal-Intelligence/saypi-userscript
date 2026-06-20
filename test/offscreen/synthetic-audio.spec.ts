import { describe, it, expect, vi } from "vitest";
import {
  createSyntheticSpeechStream,
  resolveVadStream,
  type SyntheticAudioLatch,
} from "../../src/offscreen/synthetic-audio";

function fakeAudioContextClass(captured: any) {
  return class {
    destinationStream = { id: "synthetic-stream" };
    createBufferSource() {
      const source = {
        buffer: null as any,
        loop: false,
        connect: vi.fn(),
        start: vi.fn(function (this: any) {
          captured.started = true;
          // start() before resume() would queue against a suspended context and
          // produce silence — assert resume happened first.
          captured.startedBeforeResume = !captured.resumed;
        }),
      };
      captured.source = source;
      return source;
    }
    createMediaStreamDestination() {
      return { stream: this.destinationStream };
    }
    decodeAudioData(_buf: ArrayBuffer) {
      captured.decoded = true;
      return Promise.resolve({ duration: 1 });
    }
    resume() {
      captured.resumed = true;
      return Promise.resolve();
    }
  };
}

describe("createSyntheticSpeechStream", () => {
  it("fetches + decodes the clip and returns a looping MediaStream", async () => {
    const captured: any = {};
    const fetchImpl = vi
      .fn()
      .mockResolvedValue({ arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)) });
    const stream = await createSyntheticSpeechStream("blob:clip", {
      loop: true,
      AudioContextClass: fakeAudioContextClass(captured) as any,
      fetchImpl: fetchImpl as any,
    });
    expect(fetchImpl).toHaveBeenCalledWith("blob:clip");
    expect(captured.decoded).toBe(true);
    expect(captured.started).toBe(true);
    // The context must be resumed (it can start suspended in an offscreen doc with
    // no user gesture — e.g. the real Layer-4 browser — which would yield silence).
    expect(captured.resumed).toBe(true);
    expect(captured.startedBeforeResume).toBe(false);
    expect(captured.source.loop).toBe(true);
    expect((stream as any).id).toBe("synthetic-stream");
  });

  it("defaults to ONE-SHOT (loop:false) so end-of-speech fires → STT submits (#349)", async () => {
    const captured: any = {};
    await createSyntheticSpeechStream("blob:clip", {
      // loop omitted → default
      AudioContextClass: fakeAudioContextClass(captured) as any,
      fetchImpl: vi.fn().mockResolvedValue({ arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)) }) as any,
    });
    expect(captured.source.loop).toBe(false);
  });
});

describe("resolveVadStream", () => {
  it("returns undefined when the latch is disabled (mic path)", async () => {
    const latch: SyntheticAudioLatch = { enabled: false, clipUrl: "x", loop: true };
    const factory = vi.fn();
    expect(await resolveVadStream(latch, factory as any)).toBeUndefined();
    expect(factory).not.toHaveBeenCalled();
  });

  it("returns the synthetic stream when the latch is enabled", async () => {
    const latch: SyntheticAudioLatch = { enabled: true, clipUrl: "blob:x", loop: true };
    const factory = vi.fn().mockResolvedValue({ id: "s" });
    const stream = await resolveVadStream(latch, factory as any);
    expect(factory).toHaveBeenCalledWith("blob:x", { loop: true });
    expect((stream as any).id).toBe("s");
  });
});
