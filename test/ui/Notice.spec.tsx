import { describe, it, expect, afterEach, vi } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/preact";
import { Notice } from "../../src/ui/Notice";

afterEach(() => cleanup());

describe("Notice", () => {
  it("renders the agent variant's templated class names", () => {
    const { container } = render(
      <Notice
        variant="agent"
        iconSvg={null}
        iconFallback="🤖"
        bodyText="hello"
        dismissLabel="Dismiss"
        onDismiss={() => {}}
      />,
    );
    expect(container.querySelector(".saypi-agent-notice")).toBeTruthy();
    expect(container.querySelector(".saypi-agent-notice-content")).toBeTruthy();
    expect(container.querySelector(".saypi-agent-notice-icon")).toBeTruthy();
    expect(container.querySelector(".saypi-agent-notice-text")).toBeTruthy();
    expect(container.querySelector(".saypi-agent-notice-close")).toBeTruthy();
  });

  it("renders the compat variant's templated class names", () => {
    const { container } = render(
      <Notice
        variant="compat"
        iconSvg={null}
        iconFallback="ℹ️"
        bodyText="x"
        dismissLabel="Dismiss"
        onDismiss={() => {}}
      />,
    );
    expect(container.querySelector(".saypi-compat-notice")).toBeTruthy();
    expect(container.querySelector(".saypi-compat-notice-close")).toBeTruthy();
  });

  it("applies the root data attribute", () => {
    const { container } = render(
      <Notice
        variant="agent"
        dataAttr={{ name: "data-chatbot", value: "pi" }}
        iconSvg={null}
        iconFallback="🤖"
        bodyText="x"
        dismissLabel="d"
        onDismiss={() => {}}
      />,
    );
    expect(
      container.querySelector(".saypi-agent-notice")?.getAttribute("data-chatbot"),
    ).toBe("pi");
  });

  it("renders bodyHtml as live markup (links)", () => {
    const { container } = render(
      <Notice
        variant="agent"
        iconSvg={null}
        iconFallback="🤖"
        bodyHtml={'before <a class="saypi-settings-link" href="#">settings</a> after'}
        dismissLabel="d"
        onDismiss={() => {}}
      />,
    );
    const link = container.querySelector(
      ".saypi-agent-notice-text .saypi-settings-link",
    );
    expect(link).toBeTruthy();
    expect(link?.tagName).toBe("A");
  });

  it("renders bodyText as escaped plain text (no markup parsed)", () => {
    const { container } = render(
      <Notice
        variant="compat"
        iconSvg={null}
        iconFallback="ℹ️"
        bodyText={"<b>not bold</b>"}
        dismissLabel="d"
        onDismiss={() => {}}
      />,
    );
    const text = container.querySelector(".saypi-compat-notice-text");
    expect(text?.querySelector("b")).toBeNull();
    expect(text?.textContent).toContain("<b>not bold</b>");
  });

  it("renders the icon svg (with its class) when iconSvg is provided", () => {
    const { container } = render(
      <Notice
        variant="agent"
        iconSvg={'<svg class="saypi-agent-notice-robot-icon" width="20" height="20"></svg>'}
        iconFallback="🤖"
        bodyText="x"
        dismissLabel="d"
        onDismiss={() => {}}
      />,
    );
    expect(
      container.querySelector(
        ".saypi-agent-notice-icon svg.saypi-agent-notice-robot-icon",
      ),
    ).toBeTruthy();
  });

  it("renders the emoji fallback when iconSvg is null", () => {
    const { container } = render(
      <Notice
        variant="agent"
        iconSvg={null}
        iconFallback="🤖"
        bodyText="x"
        dismissLabel="d"
        onDismiss={() => {}}
      />,
    );
    expect(
      container.querySelector(".saypi-agent-notice-icon")?.textContent,
    ).toContain("🤖");
  });

  it("calls onDismiss when the close button is clicked", () => {
    const onDismiss = vi.fn();
    const { container } = render(
      <Notice
        variant="agent"
        iconSvg={null}
        iconFallback="🤖"
        bodyText="x"
        dismissLabel="Dismiss"
        onDismiss={onDismiss}
      />,
    );
    fireEvent.click(
      container.querySelector(".saypi-agent-notice-close") as HTMLElement,
    );
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("sets aria-label on the close button", () => {
    const { container } = render(
      <Notice
        variant="agent"
        iconSvg={null}
        iconFallback="🤖"
        bodyText="x"
        dismissLabel="Dismiss notice"
        onDismiss={() => {}}
      />,
    );
    expect(
      container
        .querySelector(".saypi-agent-notice-close")
        ?.getAttribute("aria-label"),
    ).toBe("Dismiss notice");
  });
});
