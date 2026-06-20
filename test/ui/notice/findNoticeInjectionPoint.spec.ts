import { describe, it, expect, beforeEach } from "vitest";
import { findNoticeInjectionPoint } from "../../../src/ui/notice/findNoticeInjectionPoint";

/**
 * Contract for the shared injection-point finder previously duplicated
 * byte-for-byte in AgentModeNoticeModule and CompatibilityNotificationUI.
 */
describe("findNoticeInjectionPoint", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("prefers the universal #saypi-chat-ancestor when present", () => {
    const anchor = document.createElement("div");
    anchor.id = "saypi-chat-ancestor";
    document.body.appendChild(anchor);
    // Even with a host-specific element also present, the ancestor wins.
    const form = document.createElement("form");
    form.setAttribute("data-type", "unified-composer");
    document.body.appendChild(form);

    expect(findNoticeInjectionPoint("chatgpt")).toBe(anchor);
  });

  it("falls back to ChatGPT's unified composer form", () => {
    const form = document.createElement("form");
    form.setAttribute("data-type", "unified-composer");
    document.body.appendChild(form);
    expect(findNoticeInjectionPoint("chatgpt")).toBe(form);
  });

  it("falls back to Claude's prompt fieldset", () => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "w-full";
    document.body.appendChild(fieldset);
    expect(findNoticeInjectionPoint("claude")).toBe(fieldset);
  });

  it("falls back to Pi's prompt controls container parent", () => {
    const parent = document.createElement("div");
    const controls = document.createElement("div");
    controls.id = "saypi-prompt-controls-container";
    parent.appendChild(controls);
    document.body.appendChild(parent);
    expect(findNoticeInjectionPoint("pi")).toBe(parent);
  });

  it("returns null when nothing matches", () => {
    expect(findNoticeInjectionPoint("unknown")).toBeNull();
  });
});
