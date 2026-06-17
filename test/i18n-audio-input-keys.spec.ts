import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Regression guard for #318: three keys referenced via getMessage(...) in
 * AudioInputMachine had no entry in _locales/en/messages.json, so
 * chrome.i18n.getMessage returned "" — producing `throw new Error("")` for the
 * two WebAssembly checks and an English-only `|| fallback` for the mic
 * permission error.
 *
 * Rather than enumerate just those three, this scans EVERY string-literal
 * getMessage("…") key referenced in the file and asserts each one is defined in
 * the en locale. That catches this whole class of dangling-key bug for this
 * file going forward (including the #310 keys).
 */
const root = resolve(__dirname, "..");
const en = JSON.parse(
  readFileSync(resolve(root, "_locales/en/messages.json"), "utf8")
);
const src = readFileSync(
  resolve(root, "src/state-machines/AudioInputMachine.ts"),
  "utf8"
);

// Collect getMessage("literal" …) keys (ignore dynamic getMessage(variable) calls).
const referencedKeys = Array.from(
  src.matchAll(/getMessage\(\s*["'`]([A-Za-z0-9_]+)["'`]/g),
  (m) => m[1]
);
const uniqueKeys = [...new Set(referencedKeys)];

describe("#318 AudioInputMachine getMessage keys all exist in en locale", () => {
  it("found getMessage(...) literal keys to check", () => {
    expect(uniqueKeys.length).toBeGreaterThan(0);
  });

  it.each(["webAssemblyMemoryUnavailable", "webAssemblyInsufficientMemory", "microphonePermissionDeniedError"])(
    "the previously-missing key %s now exists in en",
    (key) => {
      expect(en[key]?.message).toBeTruthy();
    }
  );

  it("every literal getMessage key referenced in AudioInputMachine exists in en", () => {
    const missing = uniqueKeys.filter((k) => !en[k]?.message);
    expect(missing).toEqual([]);
  });

  it("webAssemblyInsufficientMemory carries the detail placeholder it is called with", () => {
    // Called as getMessage("webAssemblyInsufficientMemory", `Required: …, Available: …`)
    expect(en.webAssemblyInsufficientMemory?.placeholders).toBeTruthy();
    expect(en.webAssemblyInsufficientMemory.message).toMatch(/\$\w+\$/);
  });
});
