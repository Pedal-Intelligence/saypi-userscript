/**
 * Regression cover for #557: a background-routed API call that comes back with a
 * null-body status (204/205/304) used to throw inside the chrome.runtime.sendMessage
 * response callback — where the throw escapes the Promise executor entirely, so the
 * promise never settled and the caller hung forever.
 *
 * These tests use the REAL global Response (unlike test/BackgroundApiHandler.spec.ts,
 * which stubs it with a plain object) — the null-body-status rule is enforced by the
 * real constructor, so a stub cannot reproduce the defect.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const SAYPI_URL = "https://api.saypi.ai/turn-outcome";

/** Fails fast and legibly instead of as an opaque suite timeout when the promise hangs. */
async function settlesWithin<T>(promise: Promise<T>, ms = 1000): Promise<T> {
  const hang = Symbol("hang");
  const result = await Promise.race([
    promise.then(
      (value) => ({ ok: true as const, value }),
      (error) => ({ ok: false as const, error })
    ),
    new Promise<typeof hang>((resolve) => setTimeout(() => resolve(hang), ms)),
  ]);
  if (result === hang) throw new Error(`promise did not settle within ${ms}ms`);
  if (!result.ok) throw result.error;
  return result.value;
}

describe("callApi() — background-routed null-body statuses (#557)", () => {
  let sendMessage: ReturnType<typeof vi.fn>;
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    sendMessage = vi.fn();
    (globalThis as any).chrome = {
      runtime: { lastError: null, sendMessage, onMessage: { addListener: vi.fn() } },
    };
    // callApi falls back to a direct fetch when the background path rejects; stub it
    // so a fallback is observable and no test ever reaches the real network.
    fetchSpy = vi.fn().mockResolvedValue(new Response("fallback", { status: 200 }));
    (globalThis as any).fetch = fetchSpy;
  });

  afterEach(() => {
    vi.resetModules();
    delete (globalThis as any).chrome;
    delete (globalThis as any).fetch;
  });

  /**
   * Makes the background reply with the given status/body for the next request.
   * The callback is invoked ASYNCHRONOUSLY, as Chrome does — that is what lets a
   * throw inside it escape the Promise executor and hang the caller (#557).
   */
  const backgroundReplies = (status: number, body: unknown, statusText = "") => {
    sendMessage.mockImplementation((_msg: unknown, callback: (r: unknown) => void) => {
      setTimeout(() => callback({ success: true, response: { status, statusText, headers: {}, body } }), 0);
    });
  };

  it.each([
    [204, "No Content"],
    [205, "Reset Content"],
    [304, "Not Modified"],
  ])("resolves a %i response instead of hanging", async (status, statusText) => {
    backgroundReplies(status, undefined, statusText);
    const { callApi } = await import("../src/ApiClient");

    const response = await settlesWithin(callApi(SAYPI_URL, { method: "POST" }));

    expect(response.status).toBe(status);
    expect(await response.text()).toBe("");
  });

  it("resolves a 204 requested as JSON without inventing a body", async () => {
    backgroundReplies(204, undefined, "No Content");
    const { callApi } = await import("../src/ApiClient");

    const response = await settlesWithin(
      callApi(SAYPI_URL, { method: "POST", responseType: "json" } as any)
    );

    expect(response.status).toBe(204);
    expect(await response.text()).toBe("");
  });

  it("still carries the body for a normal 200", async () => {
    backgroundReplies(200, '{"ok":true}', "OK");
    const { callApi } = await import("../src/ApiClient");

    const response = await settlesWithin(callApi(SAYPI_URL, { method: "POST" }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });

  it("rejects — never hangs — when the response cannot be reconstructed", async () => {
    // An out-of-range status is rejected by the Response constructor, standing in for
    // any unforeseen reconstruction failure inside the sendMessage callback.
    backgroundReplies(9999, "boom");
    const { callApi } = await import("../src/ApiClient");

    const response = await settlesWithin(callApi(SAYPI_URL, { method: "POST" }));

    expect(fetchSpy).toHaveBeenCalled();
    expect(await response.text()).toBe("fallback");
  });
});
