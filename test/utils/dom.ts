import { JSDOM } from "jsdom";

export function setupTestDOM() {
  const dom = new JSDOM('<!DOCTYPE html>', {
    url: 'http://localhost',
    pretendToBeVisual: true,
  });

  // Clear and update the existing document
  document.documentElement.innerHTML = dom.window.document.documentElement.innerHTML;

  // Add any missing properties to the existing document
  if (!global.SVGElement) {
    global.SVGElement = dom.window.SVGElement;
  }
  if (!global.DOMParser) {
    global.DOMParser = dom.window.DOMParser;
  }

  return document;
}
