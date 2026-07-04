import { describe, it, expect, vi, beforeEach } from "vitest";

// ConfigModule reads injected env at import time; stub it (mirrors other specs).
vi.mock("../../src/ConfigModule", () => ({
  config: {
    appServerUrl: "https://app.example.com",
    apiServerUrl: "https://api.saypi.ai",
    GA_MEASUREMENT_ID: "x",
    GA_API_SECRET: "x",
    GA_ENDPOINT: "x",
  },
}));

vi.mock("../../src/JwtManager", () => ({
  getJwtManagerSync: () => ({
    isAuthenticated: () => true,
    getClaims: () => ({ ttsQuotaRemaining: 1000 }),
  }),
}));

vi.mock("../../src/popup/popupopener", () => ({
  openSettings: vi.fn(),
}));

import { ClaudeVoiceMenu } from "../../src/chatbots/ClaudeVoiceMenu";
import { claudeMockVoices } from "../data/Voices";

// Bypass the heavy constructor; renderMenu only needs prototype methods
// plus the fields it reads (pattern from ClaudeVoiceMenu-curation.spec.ts).
function makeMenu(): any {
  const menu = Object.create(ClaudeVoiceMenu.prototype);
  menu.chatbot = {} as any;
  menu.userPreferences = {
    getVoice: vi.fn(async () => null),
    setVoice: vi.fn(async () => {}),
    unsetVoice: vi.fn(async () => {}),
  };
  menu.element = document.createElement("div");
  menu.element.id = "claude-voice-selector";
  document.body.appendChild(menu.element);
  menu.menuButton = document.createElement("button");
  menu.menuContent = document.createElement("div");
  return menu;
}

beforeEach(() => {
  document.body.innerHTML = "";
});

// Regression guard for the open-click self-close race (#494, introduced by
// #492): every open runs refreshMenu → renderMenu. With warm in-memory
// caches, that resolves in microtasks — which a REAL (trusted) click lets
// run BETWEEN the trigger's own click listener and the document-level
// outside-click listener. If renderMenu rebuilds the trigger, the click's
// event.target is a detached node by the time the document listener checks
// `this.element.contains(event.target)`, so it closes the menu in the same
// tick it opened. The invariant that makes the race harmless: renderMenu
// updates the existing trigger/menu nodes in place — it never replaces them.
describe("ClaudeVoiceMenu re-render node stability (open-click race)", () => {
  it("keeps the same trigger button node across re-renders", () => {
    const menu = makeMenu();
    menu.renderMenu(claudeMockVoices, null);
    const trigger = menu.element.querySelector(
      "button[data-voice-active]"
    ) as HTMLButtonElement;
    expect(trigger).not.toBeNull();

    // A second render — exactly what an open-click triggers via refreshMenu.
    menu.renderMenu(claudeMockVoices, null);

    expect(menu.menuButton).toBe(trigger);
    expect(trigger.isConnected).toBe(true);
    expect(
      menu.element.querySelectorAll("button[data-voice-active]").length
    ).toBe(1);
  });

  it("keeps the same menu container node, and an open menu stays open in body", () => {
    const menu = makeMenu();
    menu.renderMenu(claudeMockVoices, null);
    const content = menu.menuContent as HTMLDivElement;

    // Simulate the menu being open: parked in document.body, visible
    // (positionMenuAboveButton's arrangement).
    document.body.appendChild(content);
    content.style.display = "block";

    // A re-render lands while open (mid-click rebuild, or an auth/preference
    // refresh). It must refill the SAME node, not tear it down.
    const lucy = claudeMockVoices.find((v) => v.name === "Lucy")!;
    menu.renderMenu(claudeMockVoices, lucy);

    expect(menu.menuContent).toBe(content);
    expect(content.parentElement).toBe(document.body);
    expect(content.style.display).toBe("block");
    // …and the refill really happened: the stored voice is now checked.
    const lucyRow = content.querySelector(
      "[data-voice-name='Lucy'] .checkmark-container"
    );
    expect(lucyRow?.innerHTML).toContain("svg");
  });

  it("updates the trigger label and sign-in affordance in place", () => {
    const menu = makeMenu();
    menu.renderMenu(claudeMockVoices, null);
    const trigger = menu.element.querySelector(
      "button[data-voice-active]"
    ) as HTMLButtonElement;

    const lucy = claudeMockVoices.find((v) => v.name === "Lucy")!;
    menu.renderMenu(claudeMockVoices, lucy);
    expect(menu.element.querySelector(".voice-name")?.textContent).toBe("Lucy");
    expect(trigger.getAttribute("data-voice-active")).toBe("true");
    expect(trigger.classList.contains("saypi-voice-unavailable")).toBe(false);
  });
});
