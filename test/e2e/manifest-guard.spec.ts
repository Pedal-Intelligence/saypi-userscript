import { describe, it, expect } from "vitest";
import { assertDevManifest } from "../../e2e/support/manifest-guard";

const goodManifest = {
  manifest_version: 3,
  content_security_policy: { extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'" },
  content_scripts: [
    { js: ["content-scripts/saypi-universal.js"], matches: ["http://*/*", "https://*/*"] },
    { js: ["content-scripts/saypi.js"], matches: ["https://pi.ai/*", "https://claude.ai/*"] },
  ],
};

describe("assertDevManifest", () => {
  it("accepts a valid development build manifest", () => {
    expect(() => assertDevManifest(goodManifest)).not.toThrow();
  });

  it("rejects a manifest with no content_scripts (dev-server output)", () => {
    expect(() => assertDevManifest({ ...goodManifest, content_scripts: undefined }))
      .toThrow(/content_scripts/i);
  });

  it("rejects when no content script matches pi.ai", () => {
    const m = { ...goodManifest, content_scripts: [{ js: ["x.js"], matches: ["https://claude.ai/*"] }] };
    expect(() => assertDevManifest(m)).toThrow(/pi\.ai/i);
  });

  it("rejects a dev-server CSP containing localhost:3001", () => {
    const m = { ...goodManifest, content_security_policy: { extension_pages: "script-src 'self' http://localhost:3001" } };
    expect(() => assertDevManifest(m)).toThrow(/localhost:3001/i);
  });

  it("rejects a CSP missing wasm-unsafe-eval", () => {
    const m = { ...goodManifest, content_security_policy: { extension_pages: "script-src 'self'; object-src 'self'" } };
    expect(() => assertDevManifest(m)).toThrow(/wasm-unsafe-eval/i);
  });
});
