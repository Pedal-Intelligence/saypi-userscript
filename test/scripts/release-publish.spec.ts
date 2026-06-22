import { describe, it, expect, vi, afterEach } from "vitest";

// Mock fs + child_process so the submit flows never touch disk or spawn web-ext.
vi.mock("node:fs", () => ({
  readFileSync: vi.fn(() => Buffer.from("zip-bytes")),
  writeFileSync: vi.fn(),
  existsSync: vi.fn(() => true),
  mkdirSync: vi.fn(),
}));
vi.mock("node:child_process", () => ({ spawnSync: vi.fn(() => ({ status: 0, stdout: "8.5.0" })) }));

import { chromeSubmit, edgeSubmit, firefoxSubmit, submitToStore } from "../../scripts/release-publish.mjs";

const CWS_ENV = { CWS_CLIENT_ID: "c", CWS_CLIENT_SECRET: "s", CWS_REFRESH_TOKEN: "r", CWS_PUBLISHER_ID: "p", CWS_EXTENSION_ID: "e" };
const EDGE_ENV = { EDGE_PRODUCT_ID: "p", EDGE_API_KEY: "k", EDGE_CLIENT_ID: "c" };
const AMO_ENV = { WEB_EXT_API_KEY: "issuer", WEB_EXT_API_SECRET: "secret" };
const noop = () => {};

/** Build a fetch mock that returns the given responses in order. */
function fetchSequence(responses: any[]) {
  const fn = vi.fn();
  for (const r of responses) {
    fn.mockResolvedValueOnce({
      ok: r.ok ?? true,
      status: r.status ?? 200,
      json: async () => r.json ?? {},
      headers: { get: (k: string) => (r.headers || {})[k.toLowerCase()] ?? null },
    });
  }
  return fn;
}

afterEach(() => vi.unstubAllGlobals());

describe("chromeSubmit (CWS V2 orchestration)", () => {
  it("dry-run: authenticates + reads status, never uploads or publishes", async () => {
    const fetch = fetchSequence([
      { json: { access_token: "tok" } },
      { json: { publishedItemRevisionStatus: { distributionChannels: [{ crxVersion: "1.10.7" }] } } },
    ]);
    vi.stubGlobal("fetch", fetch);
    const r = await chromeSubmit({ zipPath: "x.zip", env: CWS_ENV, dryRun: true, log: noop });
    expect(r).toMatch(/dry-run OK/i);
    expect(fetch).toHaveBeenCalledTimes(2); // token + status only
  });

  it("throws (and never uploads) when auth fails", async () => {
    const fetch = fetchSequence([{ ok: false, json: { error_description: "bad refresh token" } }]);
    vi.stubGlobal("fetch", fetch);
    await expect(chromeSubmit({ zipPath: "x.zip", env: CWS_ENV, dryRun: false, log: noop })).rejects.toThrow(/auth failed/i);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("full flow: token → status → upload(SUCCEEDED) → publish(PENDING_REVIEW)", async () => {
    const fetch = fetchSequence([
      { json: { access_token: "tok" } },
      { json: {} },
      { json: { uploadState: "SUCCEEDED" } },
      { json: { state: "PENDING_REVIEW" } },
    ]);
    vi.stubGlobal("fetch", fetch);
    const r = await chromeSubmit({ zipPath: "x.zip", env: CWS_ENV, dryRun: false, log: noop });
    expect(r).toMatch(/PENDING_REVIEW/);
    expect(fetch).toHaveBeenCalledTimes(4);
    // publish was a POST with a JSON body
    const publishCall = fetch.mock.calls[3];
    expect(publishCall[0]).toMatch(/:publish$/);
    expect(publishCall[1].method).toBe("POST");
  });

  it("fails the run when upload reports FAILED (never publishes)", async () => {
    const fetch = fetchSequence([
      { json: { access_token: "tok" } },
      { json: {} },
      { json: { uploadState: "FAILED" } },
    ]);
    vi.stubGlobal("fetch", fetch);
    await expect(chromeSubmit({ zipPath: "x.zip", env: CWS_ENV, dryRun: false, log: noop })).rejects.toThrow(/did not succeed/i);
    expect(fetch).toHaveBeenCalledTimes(3); // no publish
  });
});

describe("edgeSubmit (Edge v1.1 orchestration)", () => {
  it("dry-run: a credentials probe (non-401) passes without uploading", async () => {
    const fetch = fetchSequence([{ status: 404, json: {} }]); // 404 = creds accepted, op not found
    vi.stubGlobal("fetch", fetch);
    const r = await edgeSubmit({ zipPath: "x.zip", env: EDGE_ENV, dryRun: true, log: noop });
    expect(r).toMatch(/dry-run OK/i);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("dry-run: a 401 probe throws (bad key)", async () => {
    vi.stubGlobal("fetch", fetchSequence([{ status: 401, json: {} }]));
    await expect(edgeSubmit({ zipPath: "x.zip", env: EDGE_ENV, dryRun: true, log: noop })).rejects.toThrow(/auth failed/i);
  });

  it("full flow: upload(202)→poll(Succeeded)→publish(202)→poll(Succeeded), plain-text notes", async () => {
    const fetch = fetchSequence([
      { status: 202, headers: { location: "op-upload" } },
      { json: { status: "Succeeded" } },
      { status: 202, headers: { location: "/v1/products/p/submissions/operations/op-pub" } },
      { json: { status: "Succeeded" } },
    ]);
    vi.stubGlobal("fetch", fetch);
    const r = await edgeSubmit({ zipPath: "x.zip", notes: "notes", env: EDGE_ENV, dryRun: false, log: noop });
    expect(r).toMatch(/submitted to certification/i);
    // the publish call body is the raw notes string (NOT JSON)
    const publishCall = fetch.mock.calls[2];
    expect(publishCall[1].body).toBe("notes");
    expect(publishCall[1].headers["Content-Type"]).toBeUndefined();
  });

  it("surfaces a Failed operation with its errorCode", async () => {
    const fetch = fetchSequence([
      { status: 202, headers: { location: "op-upload" } },
      { json: { status: "Failed", errorCode: "NoModulesUpdated", message: "no updates" } },
    ]);
    vi.stubGlobal("fetch", fetch);
    await expect(edgeSubmit({ zipPath: "x.zip", env: EDGE_ENV, dryRun: false, log: noop })).rejects.toThrow(/NoModulesUpdated/);
  });
});

describe("firefoxSubmit (web-ext) + dispatcher", () => {
  it("dry-run validates env + web-ext without submitting", () => {
    const r = firefoxSubmit({ sourceDir: ".output/firefox-mv2", sourceCode: "source-code.zip", env: AMO_ENV, dryRun: true, log: noop });
    expect(r).toMatch(/dry-run OK/i);
  });

  it("submitToStore rejects an unknown store", () => {
    expect(() => submitToStore("safari", {})).toThrow(/Unknown store/i);
  });
});
