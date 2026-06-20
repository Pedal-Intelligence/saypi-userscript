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
      return {
        buffer: null as any,
        loop: false,
        connect: vi.fn(),
        start: vi.fn(function (this: any) {
          captured.started = true;
        }),
      };
    }
    createMediaStreamDestination() {
      return { stream: this.destinationStream };
    }
    decodeAudioData(_buf: ArrayBuffer) {
      captured.decoded = true;
      return Promise.resolve({ duration: 1 });
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
    expect((stream as any).id).toBe("synthetic-stream");
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
