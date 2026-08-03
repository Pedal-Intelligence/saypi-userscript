import { describe, it, expect } from "vitest";
import { ApiError, apiErrorFromResponse } from "../src/ApiError";

function jsonResponse(
  status: number,
  body: unknown,
  headers: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    statusText: status === 429 ? "Too Many Requests" : "Error",
    headers: { "Content-Type": "application/json", ...headers },
  });
}

describe("apiErrorFromResponse", () => {
  it("reads the server's own explanation instead of discarding it", async () => {
    const error = await apiErrorFromResponse(
      jsonResponse(429, {
        detail: {
          error: "rate_limited",
          message: "Too many transcription requests; retry after 30 seconds.",
          retry_after_seconds: 30,
        },
      }),
    );

    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(429);
    expect(error.code).toBe("rate_limited");
    expect(error.detail).toBe(
      "Too many transcription requests; retry after 30 seconds.",
    );
    expect(error.retryAfterSeconds).toBe(30);
  });

  it("falls back to the Retry-After header when the body has no hint", async () => {
    const error = await apiErrorFromResponse(
      jsonResponse(429, { detail: { error: "rate_limited" } }, { "Retry-After": "45" }),
    );
    expect(error.retryAfterSeconds).toBe(45);
  });

  it("prefers the body's value over the header when both are present", async () => {
    const error = await apiErrorFromResponse(
      jsonResponse(
        429,
        { detail: { error: "rate_limited", retry_after_seconds: 30 } },
        { "Retry-After": "999" },
      ),
    );
    expect(error.retryAfterSeconds).toBe(30);
  });

  it("accepts an HTTP-date Retry-After", async () => {
    const future = new Date(Date.now() + 60_000).toUTCString();
    const error = await apiErrorFromResponse(
      jsonResponse(429, {}, { "Retry-After": future }),
    );
    expect(error.retryAfterSeconds).toBeGreaterThan(50);
    expect(error.retryAfterSeconds).toBeLessThanOrEqual(60);
  });

  it("handles a plain-string detail (FastAPI's own default shape)", async () => {
    const error = await apiErrorFromResponse(jsonResponse(404, { detail: "Not found" }));
    expect(error.detail).toBe("Not found");
    expect(error.code).toBe("unknown");
  });

  it("degrades to the status line when the body is not JSON", async () => {
    const response = new Response("<html>502</html>", {
      status: 502,
      statusText: "Bad Gateway",
    });
    const error = await apiErrorFromResponse(response);
    expect(error.status).toBe(502);
    expect(error.detail).toBeNull();
    expect(error.message).toBe("HTTP 502: Bad Gateway");
  });

  it("degrades gracefully when there is no body at all", async () => {
    const error = await apiErrorFromResponse(new Response(null, { status: 403 }));
    expect(error.status).toBe(403);
    expect(error.code).toBe("unknown");
  });

  it("ignores an unrecognised error code rather than trusting it", async () => {
    const error = await apiErrorFromResponse(
      jsonResponse(400, { detail: { error: "something_new_we_do_not_know" } }),
    );
    expect(error.code).toBe("unknown");
  });

  it("never throws, whatever the response looks like", async () => {
    const hostile = {
      status: 500,
      statusText: "Server Error",
      headers: {
        get() {
          throw new Error("boom");
        },
      },
      json() {
        throw new Error("boom");
      },
    } as unknown as Response;
    await expect(apiErrorFromResponse(hostile)).resolves.toBeInstanceOf(ApiError);
  });
});

describe("ApiError classification", () => {
  it("treats 429 and 5xx as retryable", () => {
    expect(new ApiError(429, "Too Many Requests").isRetryable).toBe(true);
    expect(new ApiError(503, "Unavailable").isRetryable).toBe(true);
  });

  it("does not treat a 413 as retryable — the same body will fail again", () => {
    expect(new ApiError(413, "Payload Too Large").isRetryable).toBe(false);
  });

  it("flags the statuses where signing in is the remedy", () => {
    expect(new ApiError(429, "Too Many Requests").isResolvedBySigningIn).toBe(true);
    expect(new ApiError(403, "Forbidden").isResolvedBySigningIn).toBe(true);
    expect(new ApiError(500, "Server Error").isResolvedBySigningIn).toBe(false);
  });

  it("puts the server's message in the thrown Error message when present", () => {
    const error = new ApiError(429, "Too Many Requests", "rate_limited", "Slow down.");
    expect(error.message).toBe("HTTP 429: Slow down.");
  });
});
