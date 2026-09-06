import { describe, it, expect, vi } from "vitest";
import { retryTransient } from "../../scripts/release-lib.mjs";

// Pins the poll-retry semantics behind #628: an idempotent poll that hits a transient
// network error must be retried, not surfaced as a submission failure.

const noSleep = async () => {};

describe("retryTransient", () => {
  it("returns the first successful result without retrying", async () => {
    const fn = vi.fn(async () => "ok");
    const sleep = vi.fn(async (_ms: number) => {});
    await expect(retryTransient(fn, { attempts: 3, delayMs: 10, sleep })).resolves.toBe("ok");
    expect(fn).toHaveBeenCalledTimes(1);
    expect(sleep).not.toHaveBeenCalled();
  });

  it("retries a transient failure (fetch failed) and succeeds — the v1.14.0 Edge shape", async () => {
    let n = 0;
    const fn = vi.fn(async () => {
      if (++n === 1) throw new TypeError("fetch failed");
      return "Succeeded";
    });
    const onRetry = vi.fn();
    await expect(retryTransient(fn, { attempts: 4, delayMs: 5, sleep: noSleep, onRetry })).resolves.toBe("Succeeded");
    expect(fn).toHaveBeenCalledTimes(2);
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onRetry.mock.calls[0][0]).toBe(1);
    expect((onRetry.mock.calls[0][1] as Error).message).toBe("fetch failed");
  });

  it("backs off between attempts (delay grows, never before the first)", async () => {
    const fn = vi.fn(async () => {
      throw new Error("ECONNRESET");
    });
    const sleep = vi.fn(async (_ms: number) => {});
    await expect(retryTransient(fn, { attempts: 3, delayMs: 100, sleep })).rejects.toThrow("ECONNRESET");
    expect(fn).toHaveBeenCalledTimes(3);
    expect(sleep.mock.calls.map((c) => c[0])).toEqual([100, 200]);
  });

  it("rethrows the LAST error once attempts are exhausted", async () => {
    let n = 0;
    const fn = vi.fn(async () => {
      throw new Error(`boom ${++n}`);
    });
    await expect(retryTransient(fn, { attempts: 2, delayMs: 1, sleep: noSleep })).rejects.toThrow("boom 2");
  });

  it("does not retry when attempts is 1", async () => {
    const fn = vi.fn(async () => {
      throw new Error("once");
    });
    await expect(retryTransient(fn, { attempts: 1, delayMs: 1, sleep: noSleep })).rejects.toThrow("once");
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
