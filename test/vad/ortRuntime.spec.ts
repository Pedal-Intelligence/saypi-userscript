import { describe, it, expect, vi } from "vitest";

vi.mock("../../src/LoggingModule", () => ({ logger: { warn: vi.fn() } }));

import { configureSingleThreadedOrt } from "../../src/vad/ortRuntime";

/**
 * #655 — both VAD clients hand this to MicVAD as `ortConfig`. Threading or the proxy would
 * spawn a blob-backed worker, which MV3's CSP (offscreen) and host-page CSPs (in-page
 * Firefox client) forbid; ORT threads whenever SharedArrayBuffer exists, i.e. on any
 * cross-origin-isolated host.
 */
describe("#655 configureSingleThreadedOrt", () => {
  it("forces single-threaded, in-thread WASM and quiets ORT's logging", () => {
    const runtime = { env: { logLevel: "warning", wasm: { proxy: true, numThreads: 4 } } };

    configureSingleThreadedOrt(runtime as any);

    expect(runtime.env).toEqual({ logLevel: "error", wasm: { proxy: false, numThreads: 1 } });
  });
});
