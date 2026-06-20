import { describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import { PiAIChatbot } from "../../src/chatbots/Pi";

/**
 * Pi.ai sidebar selector — originally #243 (Oct 2025 redesign), updated for the
 * 2026-06-20 redesign (#350): the sidebar is now a
 *   <nav data-testid="side-navbar" aria-label="Side menu"
 *        class="absolute left-0 top-0 z-[999] flex h-[100dvh] flex-col overflow-hidden
 *               border-r border-divider-stroke bg-background-alt md:relative md:flex w-[280px]">
 * (was a <div> with h-screen / border-neutral-300 / bg-neutral-50). Class strings
 * below are taken verbatim from the live logged-out DOM.
 */

// Expanded (md, 280px) — verbatim live class string + the real inner header/menu.
const expandedNavHTML = `
  <div>
    <nav data-testid="side-navbar" aria-label="Side menu"
         class="absolute left-0 top-0 z-[999] flex h-[100dvh] flex-col overflow-hidden border-r border-divider-stroke bg-background-alt md:relative md:flex  w-[280px]">
      <div class="pt-[0.875rem]  px-3 pb-3 pt-2 md:pt-[0.875rem]">
        <div class="mb-4 flex h-[40px] items-center justify-between"><!-- logo + toggle --></div>
        <div class="flex flex-col items-start">
          <div role="button" aria-label="New chat">Nav Button 1</div>
          <div role="button" aria-label="Discover">Nav Button 2</div>
          <div role="button" aria-label="Threads">Nav Button 3</div>
        </div>
      </div>
    </nav>
  </div>`;

// Collapsed (w-0 md:w-16) — same nav, narrower.
const collapsedNavHTML = `
  <div>
    <nav data-testid="side-navbar" aria-label="Side menu"
         class="absolute left-0 top-0 z-[999] flex h-[100dvh] flex-col overflow-hidden border-r border-divider-stroke bg-background-alt md:relative md:flex w-0 md:w-16">
      <div class="pt-[0.875rem] pb-3"><div class="mb-4 flex h-[40px] items-center justify-between"></div></div>
    </nav>
  </div>`;

describe("Pi Sidebar Selector (#350 — div→nav redesign)", () => {
  const chatbot = new PiAIChatbot();

  describe("Old class-literal selector no longer matches (documents the bug)", () => {
    const oldSelector =
      "div.z-\\[999\\].flex.h-screen.flex-col.border-r.border-neutral-300.bg-neutral-50";

    it("does NOT match the redesigned <nav> sidebar", () => {
      const dom = new JSDOM(expandedNavHTML);
      expect(dom.window.document.querySelector(oldSelector)).toBeNull();
    });
  });

  describe("New selector matches the redesigned sidebar", () => {
    it("matches the expanded <nav> via data-testid", () => {
      const dom = new JSDOM(expandedNavHTML);
      const sidebar = dom.window.document.querySelector(chatbot.getSidebarSelector());
      expect(sidebar).not.toBeNull();
      expect(sidebar?.tagName.toLowerCase()).toBe("nav");
      expect(sidebar?.getAttribute("data-testid")).toBe("side-navbar");
    });

    it("matches the collapsed <nav>", () => {
      const dom = new JSDOM(collapsedNavHTML);
      expect(dom.window.document.querySelector(chatbot.getSidebarSelector())).not.toBeNull();
    });

    it("structural fallback matches even without the test id (colour-token agnostic)", () => {
      // Drop data-testid; keep the structural classes (incl. the NEW colour tokens).
      const noTestId = expandedNavHTML.replace('data-testid="side-navbar"', "");
      const dom = new JSDOM(noTestId);
      const sidebar = dom.window.document.querySelector(chatbot.getSidebarSelector());
      expect(sidebar).not.toBeNull();
      expect(sidebar?.classList.contains("border-divider-stroke")).toBe(true);
      expect(sidebar?.classList.contains("bg-background-alt")).toBe(true);
    });
  });

  describe("Sidebar configuration (inner header/menu anchors unchanged)", () => {
    it("returns menu-style config; getSidebarConfig still resolves header + menu", () => {
      const dom = new JSDOM(expandedNavHTML, { url: "https://pi.ai" });
      const sidebar = dom.window.document.querySelector(chatbot.getSidebarSelector()) as HTMLElement;
      expect(sidebar).not.toBeNull();

      const config = chatbot.getSidebarConfig(sidebar);
      expect(config).not.toBeNull();
      expect(config?.buttonStyle).toBe("menu");
      expect(config?.insertPosition).toBe(2); // after Discover
      // The button container is the inner menu column (div.flex.flex-col.items-start).
      expect(config?.buttonContainer.classList.contains("items-start")).toBe(true);
      expect(config?.buttonContainer.children.length).toBe(3);

      // decorateSidebar-equivalent identification still applies.
      expect(sidebar.id).toBe("saypi-sidebar");
      expect(sidebar.classList.contains("saypi-side-panel")).toBe(true);
    });

    it("returns null config when the inner menu structure is absent", () => {
      const malformed = `
        <div>
          <nav data-testid="side-navbar" class="z-[999] flex h-[100dvh] flex-col overflow-hidden border-r border-divider-stroke bg-background-alt"></nav>
        </div>`;
      const dom = new JSDOM(malformed);
      const sidebar = dom.window.document.querySelector(chatbot.getSidebarSelector()) as HTMLElement;
      expect(sidebar).not.toBeNull();
      expect(chatbot.getSidebarConfig(sidebar)).toBeNull();
    });
  });
});
