import { describe, it, expect, beforeEach } from "vitest";
import { getCaretContext } from "../../src/dom/DOMModule";

function setSelectionToEnd(el: HTMLElement) {
  el.focus();
  const selection = window.getSelection();
  if (!selection) return;
  const range = document.createRange();
  if (el.childNodes.length > 0) {
    const lastNode = el.childNodes[el.childNodes.length - 1];
    const len = lastNode.textContent?.length ?? 0;
    range.setStart(lastNode, len);
    range.setEnd(lastNode, len);
  } else {
    range.setStart(el, 0);
    range.setEnd(el, 0);
  }
  selection.removeAllRanges();
  selection.addRange(range);
}

describe("getCaretContext (DOMModule)", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("returns before/after/cursor for input elements using selectionStart", () => {
    const input = document.createElement("input");
    input.type = "text";
    input.value = "Hello world";
    document.body.appendChild(input);

    // Simulate caret after "Hello" (index 5)
    (input as any).selectionStart = 5;
    (input as any).selectionEnd = 5;

    const ctx = getCaretContext(input, 100);
    expect(ctx.cursorPosition).toBe(5);
    expect(ctx.fieldTextBefore).toBe("Hello");
    expect(ctx.fieldTextAfter).toBe(" world");
  });

  it("clips long before/after segments for input elements", () => {
    const input = document.createElement("textarea");
    const longBefore = "a".repeat(2000);
    const longAfter = "b".repeat(2000);
    input.value = longBefore + "|" + longAfter;
    document.body.appendChild(input);

    const caretIndex = longBefore.length; // before the '|'
    ;(input as any).selectionStart = caretIndex;
    ;(input as any).selectionEnd = caretIndex;

    const clip = 400;
    const ctx = getCaretContext(input, clip);
    expect(ctx.cursorPosition).toBe(caretIndex);
    expect(ctx.fieldTextBefore?.length).toBe(clip); // clipped to 400
    expect(ctx.fieldTextBefore).toBe("a".repeat(clip));
    // After should be clipped to first 400 chars of longAfter
    expect(ctx.fieldTextAfter).toBe("|" + "b".repeat(clip - 1));
  });

  it("approximates caret for contenteditable when selection is inside element", () => {
    const div = document.createElement("div");
    div.contentEditable = "true";
    div.textContent = "First line\nSecond line";
    document.body.appendChild(div);

    // Put a caret at end using DOM ranges
    setSelectionToEnd(div);

    const ctx = getCaretContext(div, 50);
    expect(ctx.cursorPosition).toBe(div.textContent!.length);
    expect(ctx.fieldTextBefore).toBe("First line\nSecond line");
    expect(ctx.fieldTextAfter).toBe("");
  });

  it("falls back to end-of-text for contenteditable when no selection is present", () => {
    const div = document.createElement("div");
    div.contentEditable = "true";
    div.textContent = "abc def";
    document.body.appendChild(div);

    // Do not set selection; function should fallback to end
    const ctx = getCaretContext(div, 10);
    expect(ctx.cursorPosition).toBe(7);
    expect(ctx.fieldTextBefore).toBe("abc def");
    expect(ctx.fieldTextAfter).toBe("");
  });
});
