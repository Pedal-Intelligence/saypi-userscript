import { describe, it, expect } from "vitest";
import { BaseObserver } from "../../src/dom/BaseObserver";

/**
 * Regression test for the uncaught SyntaxError on pi.ai thread load:
 *
 *   Failed to execute 'matches' on 'Element':
 *   'DIV.pb-6.lg:pb-8.min-h-[calc(100%-60px)]...' is not a valid selector.
 *
 * ChatHistory built an observer selector by joining an element's full class list,
 * including Pi's Tailwind classes (`lg:pb-8`, `min-h-[calc(100%-60px)]`) whose
 * `:` `[` `]` `(` `)` `%` are invalid in an unescaped selector. The construction
 * is fixed to use stable classes; BaseObserver is also hardened so an invalid
 * selector can never throw (defense-in-depth).
 */
class TestObserver extends BaseObserver {
  protected callback(): void {}
  get resolvedTarget(): Element | null {
    return (this as unknown as { target: Element | null }).target;
  }
}

describe("BaseObserver invalid-selector handling", () => {
  it("does not throw on a CSS-invalid selector built from host Tailwind classes", () => {
    const root = document.createElement("div");
    const invalid =
      "DIV.pb-6.lg:pb-8.min-h-[calc(100%-60px)].sm:min-h-[calc(100%-120px)].chat-history.past-messages";
    expect(() => new TestObserver(root, invalid)).not.toThrow();
    expect(new TestObserver(root, invalid).resolvedTarget).toBeNull();
  });

  it("still resolves a valid selector", () => {
    const root = document.createElement("div");
    const child = document.createElement("div");
    child.className = "chat-history past-messages";
    root.appendChild(child);
    const obs = new TestObserver(root, "div.chat-history.past-messages");
    expect(obs.resolvedTarget).toBe(child);
  });
});
