import { describe, expect, it, vi } from "vitest";
import { JSDOM } from "jsdom";
import { PiAIChatbot } from "../../src/chatbots/Pi";

describe("Pi Sidebar Selector (Issue #243)", () => {
  const chatbot = new PiAIChatbot();

  describe("Old selector (should fail - documenting the bug)", () => {
    const oldSelector = "div.hidden.w-22.flex-col.items-center.gap-1.border-r";

    it("should NOT match collapsed sidebar with old selector", () => {
      const collapsedSidebarHTML = `
        <div>
          <div class="absolute left-0 top-0 z-[999] flex h-screen flex-col overflow-hidden border-r border-neutral-300 bg-neutral-50 md:relative md:flex w-0 md:w-16">
            <div class="pt-[0.875rem] pb-3">
              <div class="mb-4 flex h-[40px] items-center justify-between">
                <!-- Logo and toggle -->
              </div>
            </div>
          </div>
        </div>
      `;

      const dom = new JSDOM(collapsedSidebarHTML);
      const sidebar = dom.window.document.querySelector(oldSelector);
      expect(sidebar).toBeNull(); // Old selector doesn't match anymore
    });

    it("should NOT match expanded sidebar with old selector", () => {
      const expandedSidebarHTML = `
        <div>
          <div class="absolute left-0 top-0 z-[999] flex h-screen flex-col overflow-hidden border-r border-neutral-300 bg-neutral-50 md:relative md:flex w-[280px]">
            <div class="pt-[0.875rem] px-3 pb-3 pt-2 md:pt-[0.875rem]">
              <div class="mb-4 flex h-[40px] items-center justify-between">
                <!-- Logo and toggle -->
              </div>
            </div>
          </div>
        </div>
      `;

      const dom = new JSDOM(expandedSidebarHTML);
      const sidebar = dom.window.document.querySelector(oldSelector);
      expect(sidebar).toBeNull(); // Old selector doesn't match anymore
    });
  });

  describe("New selector (should pass after fix)", () => {
    it("should match collapsed sidebar with new selector", () => {
      const collapsedSidebarHTML = `
        <div>
          <div class="absolute left-0 top-0 z-[999] flex h-screen flex-col overflow-hidden border-r border-neutral-300 bg-neutral-50 md:relative md:flex w-0 md:w-16">
            <div class="pt-[0.875rem] pb-3">
              <div class="mb-4 flex h-[40px] items-center justify-between">
                <!-- Logo and toggle -->
              </div>
            </div>
          </div>
        </div>
      `;

      const dom = new JSDOM(collapsedSidebarHTML);
      const newSelector = chatbot.getSidePanelSelector();
      const sidebar = dom.window.document.querySelector(newSelector);
      expect(sidebar).not.toBeNull(); // New selector should match
      expect(sidebar?.classList.contains("z-[999]")).toBe(true);
      expect(sidebar?.classList.contains("h-screen")).toBe(true);
    });

    it("should match expanded sidebar with new selector", () => {
      const expandedSidebarHTML = `
        <div>
          <div class="absolute left-0 top-0 z-[999] flex h-screen flex-col overflow-hidden border-r border-neutral-300 bg-neutral-50 md:relative md:flex w-[280px]">
            <div class="pt-[0.875rem] px-3 pb-3 pt-2 md:pt-[0.875rem]">
              <div class="mb-4 flex h-[40px] items-center justify-between">
                <!-- Logo and toggle -->
              </div>
            </div>
          </div>
        </div>
      `;

      const dom = new JSDOM(expandedSidebarHTML);
      const newSelector = chatbot.getSidePanelSelector();
      const sidebar = dom.window.document.querySelector(newSelector);
      expect(sidebar).not.toBeNull(); // New selector should match
      expect(sidebar?.classList.contains("z-[999]")).toBe(true);
      expect(sidebar?.classList.contains("h-screen")).toBe(true);
    });

    it("should work across viewport sizes (mobile and desktop)", () => {
      // Both collapsed and expanded sidebars share core classes
      // Width classes vary but aren't needed for matching
      const mobileHTML = `
        <div>
          <div class="absolute left-0 top-0 z-[999] flex h-screen flex-col overflow-hidden border-r border-neutral-300 bg-neutral-50 w-0">
            <!-- Mobile collapsed -->
          </div>
        </div>
      `;

      const desktopHTML = `
        <div>
          <div class="z-[999] flex h-screen flex-col overflow-hidden border-r border-neutral-300 bg-neutral-50 w-[280px]">
            <!-- Desktop expanded -->
          </div>
        </div>
      `;

      const newSelector = chatbot.getSidePanelSelector();

      const mobileDom = new JSDOM(mobileHTML);
      const mobileSidebar = mobileDom.window.document.querySelector(newSelector);
      expect(mobileSidebar).not.toBeNull();

      const desktopDom = new JSDOM(desktopHTML);
      const desktopSidebar = desktopDom.window.document.querySelector(newSelector);
      expect(desktopSidebar).not.toBeNull();
    });
  });

  describe("Sidebar configuration", () => {
    it("should return menu-style config with correct button container", () => {
      const expandedSidebarHTML = `
        <div>
          <div class="absolute left-0 top-0 z-[999] flex h-screen flex-col overflow-hidden border-r border-neutral-300 bg-neutral-50 md:relative md:flex w-[280px]">
            <div class="pt-[0.875rem] px-3 pb-3 pt-2 md:pt-[0.875rem]">
              <div class="mb-4 flex h-[40px] items-center justify-between">
                <!-- Logo and toggle -->
              </div>
              <div class="flex flex-col items-start">
                <div role="button" aria-label="New chat">Nav Button 1</div>
                <div role="button" aria-label="Discover">Nav Button 2</div>
                <div role="button" aria-label="Home chat">Nav Button 3</div>
              </div>
            </div>
          </div>
        </div>
      `;

      const dom = new JSDOM(expandedSidebarHTML, { url: 'https://pi.ai' });
      const newSelector = chatbot.getSidePanelSelector();
      const sidebar = dom.window.document.querySelector(newSelector) as HTMLElement;
      expect(sidebar).not.toBeNull();

      // Get sidebar config
      const config = chatbot.getSidebarConfig(sidebar);

      // Verify config is returned
      expect(config).not.toBeNull();
      expect(config?.buttonStyle).toBe('menu');
      expect(config?.insertPosition).toBe(2);  // Insert after Discover button

      // Verify button container is the menu element
      expect(config?.buttonContainer.classList.contains('flex')).toBe(true);
      expect(config?.buttonContainer.classList.contains('flex-col')).toBe(true);
      expect(config?.buttonContainer.classList.contains('items-start')).toBe(true);

      // Verify the sidebar itself got the ID and class
      expect(sidebar.id).toBe('saypi-side-panel');
      expect(sidebar.classList.contains('saypi-control-panel')).toBe(true);
    });

    it("should return null config when menu container not found", () => {
      const malformedSidebarHTML = `
        <div>
          <div class="z-[999] flex h-screen flex-col border-r border-neutral-300 bg-neutral-50">
            <!-- Missing the header and menu structure -->
          </div>
        </div>
      `;

      const dom = new JSDOM(malformedSidebarHTML);
      const newSelector = chatbot.getSidePanelSelector();
      const sidebar = dom.window.document.querySelector(newSelector) as HTMLElement;
      expect(sidebar).not.toBeNull();

      // Should return null config when menu container not found
      const config = chatbot.getSidebarConfig(sidebar);
      expect(config).toBeNull();
    });
  });
});
