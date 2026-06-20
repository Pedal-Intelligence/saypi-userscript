import { describe, it, expect, afterEach, vi } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/preact";
import { AuthToastContent } from "../../src/auth/AuthToastContent";
import { AuthModalContent } from "../../src/auth/AuthModalContent";

afterEach(() => cleanup());

describe("AuthToastContent", () => {
  const base = {
    iconSvg: null,
    text: "Sign in to track usage",
    signInLabel: "Sign In",
    dismissLabel: "Dismiss",
    onSignIn: () => {},
    onDismiss: () => {},
  };

  it("renders the content structure (icon + text + sign-in + close)", () => {
    const { container } = render(<AuthToastContent {...base} />);
    expect(container.querySelector(".saypi-auth-prompt-content")).toBeTruthy();
    expect(container.querySelector(".saypi-auth-prompt-icon.saypi-brand-icon")).toBeTruthy();
    expect(container.querySelector(".saypi-auth-prompt-text")?.textContent).toBe(
      "Sign in to track usage",
    );
    expect(container.querySelector(".saypi-auth-prompt-signin")?.textContent).toBe("Sign In");
    expect(
      container.querySelector(".saypi-auth-prompt-close")?.getAttribute("aria-label"),
    ).toBe("Dismiss");
  });

  it("renders the brand SVG when provided, else the emoji fallback", () => {
    const withSvg = render(
      <AuthToastContent {...base} iconSvg='<svg class="bubble"></svg>' />,
    );
    expect(withSvg.container.querySelector(".saypi-auth-prompt-icon svg.bubble")).toBeTruthy();
    cleanup();
    const fallback = render(<AuthToastContent {...base} iconSvg={null} />);
    expect(fallback.container.querySelector(".saypi-auth-prompt-icon")?.textContent).toContain("🗣️");
  });

  it("fires onSignIn / onDismiss on click", () => {
    const onSignIn = vi.fn();
    const onDismiss = vi.fn();
    const { container } = render(
      <AuthToastContent {...base} onSignIn={onSignIn} onDismiss={onDismiss} />,
    );
    fireEvent.click(container.querySelector(".saypi-auth-prompt-signin") as HTMLElement);
    fireEvent.click(container.querySelector(".saypi-auth-prompt-close") as HTMLElement);
    expect(onSignIn).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});

describe("AuthModalContent", () => {
  const base = {
    iconSvg: null,
    title: "Unlock More",
    description: "desc",
    benefits: ["a", "b", "c"],
    signInLabel: "Sign In",
    laterLabel: "Maybe Later",
    dismissLabel: "Dismiss",
    onSignIn: () => {},
    onDismiss: () => {},
  };

  it("renders the common modal structure with the aria-labelledby title id", () => {
    const { container } = render(<AuthModalContent {...base} variant="soft" />);
    expect(container.querySelector(".saypi-auth-modal-content")).toBeTruthy();
    expect(container.querySelector(".saypi-auth-modal-close")).toBeTruthy();
    expect(container.querySelector(".saypi-auth-modal-brand")?.textContent).toBe("Say, Pi");
    expect(container.querySelector("h2#saypi-auth-title.saypi-auth-modal-title")?.textContent).toBe(
      "Unlock More",
    );
    expect(container.querySelector(".saypi-auth-modal-signin")?.textContent).toBe("Sign In");
    expect(container.querySelector(".saypi-auth-modal-later")?.textContent).toBe("Maybe Later");
  });

  it("omits the benefits list for the soft variant, includes it for full", () => {
    const soft = render(<AuthModalContent {...base} variant="soft" />);
    expect(soft.container.querySelector(".saypi-auth-modal-benefits")).toBeNull();
    cleanup();
    const full = render(<AuthModalContent {...base} variant="full" />);
    const items = [...full.container.querySelectorAll(".saypi-auth-modal-benefits li")];
    expect(items.map((li) => li.textContent)).toEqual(["a", "b", "c"]);
  });

  it("fires onSignIn / onDismiss (sign-in, maybe-later, close)", () => {
    const onSignIn = vi.fn();
    const onDismiss = vi.fn();
    const { container } = render(
      <AuthModalContent {...base} variant="full" onSignIn={onSignIn} onDismiss={onDismiss} />,
    );
    fireEvent.click(container.querySelector(".saypi-auth-modal-signin") as HTMLElement);
    fireEvent.click(container.querySelector(".saypi-auth-modal-later") as HTMLElement);
    fireEvent.click(container.querySelector(".saypi-auth-modal-close") as HTMLElement);
    expect(onSignIn).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledTimes(2); // later + close
  });
});
