import { describe, it, expect, vi } from "vitest";
import { createSyntheticSpeechStream } from "../../src/offscreen/synthetic-audio";

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
