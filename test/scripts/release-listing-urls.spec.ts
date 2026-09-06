import { describe, it, expect, vi } from "vitest";
import { listingUrlsFrom, interpretUrlProbe, probeListingUrls } from "../../scripts/release-lib.mjs";
import stores from "../../doc/release/stores.json";

// Regression net for the v1.14.0 wet run: the Chrome Web Store refused the publish with an
// opaque INVALID_ARGUMENT because the support URL was intermittently 404ing. These pin the
// probe semantics that make preflight/submit catch that before any upload.

const resp = (status: number, url: string, redirected = false) =>
  ({ status, url, redirected }) as unknown as Response;

describe("listingUrlsFrom", () => {
  it("flattens the stores.json listingUrls block, skipping blanks", () => {
    expect(listingUrlsFrom({ listingUrls: { homepage: "https://a", support: "", video: undefined } })).toEqual([
      { label: "homepage", url: "https://a" },
    ]);
  });
  it("returns [] when the block is absent", () => {
    expect(listingUrlsFrom({})).toEqual([]);
  });
  it("the real stores.json carries every URL a store listing uses, all on the final host", () => {
    const urls = listingUrlsFrom(stores as any);
    const labels = urls.map((u) => u.label);
    expect(labels).toEqual(expect.arrayContaining(["homepage", "support", "privacyPolicy", "terms"]));
    for (const { url } of urls) expect(url).toMatch(/^https:\/\/www\.saypi\.ai(\/|$)/);
  });
});

describe("interpretUrlProbe", () => {
  it("accepts only a clean 200", () => {
    expect(interpretUrlProbe({ status: 200, url: "https://a" }).ok).toBe(true);
    expect(interpretUrlProbe({ status: 404, url: "https://a" })).toEqual({ ok: false, detail: "HTTP 404" });
    expect(interpretUrlProbe({ status: 500, url: "https://a" }).ok).toBe(false);
  });
  it("treats a followed redirect as a failure (store validators may not follow)", () => {
    const v = interpretUrlProbe({ status: 200, redirected: true, finalUrl: "https://www.a/x", url: "https://a/x" });
    expect(v.ok).toBe(false);
    expect(v.detail).toContain("redirects to https://www.a/x");
  });
  it("reports network errors", () => {
    expect(interpretUrlProbe({ url: "https://a", error: "ECONNRESET" })).toEqual({
      ok: false,
      detail: "network error: ECONNRESET",
    });
  });
});

describe("probeListingUrls", () => {
  const urls = [{ label: "support", url: "https://www.saypi.ai/docs" }];
  const noSleep = async () => {};

  it("requires a fetch implementation (no ambient network in tests)", async () => {
    await expect(probeListingUrls(urls, {} as any)).rejects.toThrow(/fetchImpl/);
  });

  it("passes a URL only when every attempt is a clean 200", async () => {
    const fetchImpl = vi.fn(async (u: string) => resp(200, u));
    const [r] = await probeListingUrls(urls, { fetchImpl, attempts: 3, sleep: noSleep });
    expect(r).toMatchObject({ label: "support", ok: true, attempts: 3, failures: [] });
    expect(fetchImpl).toHaveBeenCalledTimes(3);
  });

  it("fails on an INTERMITTENT 404 (the v1.14.0 shape) and names the bad attempt", async () => {
    let n = 0;
    const fetchImpl = vi.fn(async (u: string) => resp(++n === 2 ? 404 : 200, u));
    const [r] = await probeListingUrls(urls, { fetchImpl, attempts: 3, sleep: noSleep });
    expect(r.ok).toBe(false);
    expect(r.failures).toEqual(["attempt 2: HTTP 404"]);
  });

  it("captures thrown network errors instead of aborting the whole probe", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error("ENOTFOUND");
    });
    const [r] = await probeListingUrls(urls, { fetchImpl, attempts: 2, sleep: noSleep });
    expect(r.ok).toBe(false);
    expect(r.failures).toEqual(["attempt 1: network error: ENOTFOUND", "attempt 2: network error: ENOTFOUND"]);
  });

  it("sleeps between attempts but not before the first", async () => {
    const sleep = vi.fn(async () => {});
    await probeListingUrls(urls, { fetchImpl: async (u: string) => resp(200, u), attempts: 3, delayMs: 5, sleep });
    expect(sleep).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledWith(5);
  });
});
