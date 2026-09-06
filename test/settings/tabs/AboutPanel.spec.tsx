import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/preact";
import { AboutPanel } from "../../../entrypoints/settings/tabs/about/AboutPanel";

afterEach(() => cleanup());

describe("AboutPanel", () => {
  it("renders the heading and the status placeholders StatusService targets", () => {
    const { container } = render(<AboutPanel />);
    expect(
      container.querySelector("h2.panel-heading[data-i18n='sectionHeadingAbout']"),
    ).toBeTruthy();
    // StatusService polls these by id/class — they must exist after render.
    expect(container.querySelector("#application-status .message")).toBeTruthy();
    expect(
      container.querySelector("#application-status-detail.hidden.issue"),
    ).toBeTruthy();
  });

  it("renders the description and the about links in order", () => {
    const { container } = render(<AboutPanel />);
    expect(
      container.querySelector("p[data-i18n='aboutSayPiDescription']"),
    ).toBeTruthy();
    const hrefs = [...container.querySelectorAll(".about-links a")].map((a) =>
      a.getAttribute("href"),
    );
    // The setup guide leads the row and carries no href in the markup: it
    // points at an extension page, so AboutTab resolves it at runtime (#613).
    expect(hrefs).toEqual([
      null,
      "https://www.saypi.ai",
      "https://www.saypi.ai/blog",
      "https://www.saypi.ai/support",
    ]);
  });

  it("offers the setup guide as a link the controller can resolve (#613)", () => {
    const { container } = render(<AboutPanel />);
    const link = container.querySelector<HTMLAnchorElement>("#about-setup-guide");
    expect(link, "the About tab carries a setup-guide link").not.toBeNull();
    expect(link!.tagName).toBe("A");
    expect(link!.getAttribute("data-i18n")).toBe("aboutSayPiSetupGuide");
    expect(link!.closest(".about-links")).not.toBeNull();
  });

  it("renders the five social links with their lucide icon placeholders", () => {
    const { container } = render(<AboutPanel />);
    const icons = [
      ...container.querySelectorAll(".social-links a i[data-lucide]"),
    ].map((i) => i.getAttribute("data-lucide"));
    expect(icons).toEqual(["mail", "twitter", "facebook", "instagram", "youtube"]);
  });
});
