import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect, beforeEach } from "vitest";

const recorderSrc = readFileSync(
  resolve(__dirname, "../../scripts/dom-capture/recorder.js"),
  "utf8",
);

function loadRecorder() {
  // Evaluate the self-contained script in the jsdom global; installs window.__domCapture.
  new Function(recorderSrc)();
  return (window as any).__domCapture;
}

describe("dom recorder", () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="root"><span class="a b">hi</span></div>`;
  });

  it("summarizes an element node", () => {
    const rec = loadRecorder();
    const span = document.querySelector("span")!;
    expect(rec.summarizeNode(span)).toEqual({
      type: "element",
      tag: "span",
      classes: ["a", "b"],
    });
  });

  it("returns null for whitespace-only text nodes", () => {
    const rec = loadRecorder();
    expect(rec.summarizeNode(document.createTextNode("   "))).toBeNull();
  });

  it("summarizes non-element/non-text nodes as 'other'", () => {
    const rec = loadRecorder();
    expect(rec.summarizeNode(document.createComment("hi"))).toEqual({
      type: "other",
      nodeType: 8,
    });
  });

  it("throws if stop() is called without start()", () => {
    const rec = loadRecorder();
    expect(() => rec.stop()).toThrow(/not recording/);
  });

  it("captures a resting snapshot and an attribute mutation", async () => {
    const rec = loadRecorder();
    rec.start("#root");
    document.querySelector("span")!.setAttribute("data-x", "1");
    await new Promise((r) => setTimeout(r, 0)); // let MutationObserver flush
    const record = rec.stop();
    expect(record.rootSelector).toBe("#root");
    expect(record.restingSnapshot).toContain("<span");
    const attrMut = record.mutations.find((m: any) => m.type === "attributes");
    expect(attrMut).toBeTruthy();
    expect(attrMut.attributeName).toBe("data-x");
    expect(attrMut.value).toBe("1");
  });
});
