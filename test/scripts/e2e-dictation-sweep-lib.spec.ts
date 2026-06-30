import { describe, it, expect } from "vitest";
import {
  TARGETS,
  flattenFields,
  parseSweepArgs,
  transcriptLanded,
  summarizeField,
} from "../../scripts/e2e-dictation-sweep-lib.mjs";

describe("TARGETS registry", () => {
  it("covers the v1 fixture + Mistral targets, each with at least one field", () => {
    expect(TARGETS.map((t) => t.key)).toEqual(["fixture", "mistral"]);
    for (const t of TARGETS) {
      expect(typeof t.label).toBe("string");
      expect(t.fields.length).toBeGreaterThan(0);
      for (const f of t.fields) {
        expect(typeof f.selector).toBe("string");
        expect(typeof f.label).toBe("string");
        expect(["input", "textarea", "contenteditable"]).toContain(f.type);
      }
    }
  });
  it("the fixture target has no URL (the harness serves it) and no modal to dismiss", () => {
    const fixture = TARGETS.find((t) => t.key === "fixture");
    expect(fixture?.url).toBeNull();
    expect(fixture?.dismissModal).toBeNull();
  });
  it("the mistral target is a real https URL with a ToS dismiss config", () => {
    const mistral = TARGETS.find((t) => t.key === "mistral");
    expect(mistral?.url).toMatch(/^https:\/\//);
    expect(mistral?.dismissModal).toMatchObject({ role: "button" });
  });
});

describe("flattenFields", () => {
  it("produces one flat entry per field, carrying the parent target's key/label/url/modal", () => {
    const items = flattenFields(TARGETS);
    const fixtureFieldCount = TARGETS.find((t) => t.key === "fixture")?.fields.length ?? 0;
    const mistralFieldCount = TARGETS.find((t) => t.key === "mistral")?.fields.length ?? 0;
    expect(items.length).toBe(fixtureFieldCount + mistralFieldCount);
    for (const item of items) {
      expect(item.targetKey).toBeDefined();
      expect(item.targetLabel).toBeDefined();
      expect(item.fieldSelector).toBeDefined();
      expect(item.fieldType).toBeDefined();
      expect(item.fieldLabel).toBeDefined();
    }
  });
  it("does not mutate the source TARGETS array", () => {
    const before = JSON.stringify(TARGETS);
    flattenFields(TARGETS);
    expect(JSON.stringify(TARGETS)).toBe(before);
  });
  it("is pure over a custom targets array (doesn't reach for the module-level TARGETS)", () => {
    const custom = [{ key: "x", label: "X", url: "https://x.example", dismissModal: null, fields: [{ selector: "#a", type: "input" as const, label: "A" }] }];
    expect(flattenFields(custom)).toEqual([
      { targetKey: "x", targetLabel: "X", url: "https://x.example", dismissModal: null, fieldSelector: "#a", fieldType: "input", fieldLabel: "A" },
    ]);
  });
});

describe("parseSweepArgs", () => {
  it("defaults to all targets, headed", () => {
    const a = parseSweepArgs([]);
    expect(a.targets).toEqual(["fixture", "mistral"]);
    expect(a.headed).toBe(true);
    expect(a.unknownTargets).toEqual([]);
  });
  it("selects a subset by target key, preserving the requested set", () => {
    expect(parseSweepArgs(["mistral"]).targets).toEqual(["mistral"]);
  });
  it("collects unknown target tokens instead of treating them as targets", () => {
    const a = parseSweepArgs(["gmail", "fixture"]);
    expect(a.targets).toEqual(["fixture"]);
    expect(a.unknownTargets).toEqual(["gmail"]);
  });
  it("honors --headless", () => {
    expect(parseSweepArgs(["--headless"]).headed).toBe(false);
  });
});

describe("transcriptLanded", () => {
  it("is true for any non-empty trimmed string", () => {
    expect(transcriptLanded("Hello there, this is a test.")).toBe(true);
    expect(transcriptLanded("  padded  ")).toBe(true);
  });
  it("is false for empty, whitespace-only, null, or non-string values", () => {
    expect(transcriptLanded("")).toBe(false);
    expect(transcriptLanded("   ")).toBe(false);
    expect(transcriptLanded(null)).toBe(false);
    expect(transcriptLanded(undefined)).toBe(false);
    expect(transcriptLanded(false)).toBe(false);
  });
});

describe("summarizeField", () => {
  it("separates SayPi-attributable errors/warnings from host noise, keyed on field-landed", () => {
    const s = summarizeField({
      target: "mistral",
      field: "Composer (ProseMirror)",
      decorated: true,
      buttonAppeared: true,
      transcriptLanded: true,
      console: [
        { t: "error", text: "[SayPi DEBUG] something broke" },
        { t: "error", text: "ProseMirror expects the CSS white-space property" },
        { t: "warning", text: "[SayPi] heads up" },
      ],
      pageErrors: [{ message: "x" }],
      requestFailed: [{ url: "https://api.saypi.ai/transcribe" }],
    });
    expect(s).toMatchObject({
      target: "mistral",
      field: "Composer (ProseMirror)",
      decorated: true,
      buttonAppeared: true,
      transcriptLanded: true,
      consoleErrors: 2,
      saypiErrors: 1,
      hostErrors: 1,
      saypiWarnings: 1,
      pageErrors: 1,
      netFailures: 1,
    });
  });
  it("is robust to an empty / partial evidence object", () => {
    const s = summarizeField({});
    expect(s.decorated).toBe(false);
    expect(s.buttonAppeared).toBe(false);
    expect(s.transcriptLanded).toBe(false);
    expect(s.consoleErrors).toBe(0);
    expect(s.saypiErrors).toBe(0);
  });
  it("flags a field whose button never appeared as not landed, regardless of decoration", () => {
    const s = summarizeField({ decorated: true, buttonAppeared: false, transcriptLanded: false });
    expect(s.decorated).toBe(true);
    expect(s.buttonAppeared).toBe(false);
    expect(s.transcriptLanded).toBe(false);
  });
});
