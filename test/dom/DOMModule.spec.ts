import { describe, it, expect } from "vitest";
import { createSVGElement } from "../../src/dom/DOMModule";
import { JSDOM } from "jsdom";

describe("createSVGElement", () => {
  beforeEach(() => {
    const dom = new JSDOM("<!DOCTYPE html>", {
      url: "http://localhost",
      pretendToBeVisual: true,
    });
    global.document = dom.window.document;
    global.DOMParser = dom.window.DOMParser;
    global.SVGElement = dom.window.SVGElement;
  });

  it("should create an SVG element from valid SVG string", () => {
    const svgString =
      '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"/></svg>';
    const svgElement = createSVGElement(svgString);

    expect(svgElement.tagName.toLowerCase()).toBe("svg");
    expect(svgElement.getAttribute("width")).toBe("24");
    expect(svgElement.getAttribute("height")).toBe("24");
  });

  it("should throw error for invalid SVG string", () => {
    const invalidSvgString = "<not-svg>Invalid</not-svg>";

    expect(() => createSVGElement(invalidSvgString)).toThrow(
      "Failed to create SVGElement"
    );
  });

  it("should throw error for malformed SVG string", () => {
    const malformedSvgString = "<svg><unclosed>";

    expect(() => createSVGElement(malformedSvgString)).toThrow(
      "Failed to create SVGElement"
    );
  });
});
