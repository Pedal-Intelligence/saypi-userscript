import { describe, expect, it, vi, beforeEach } from "vitest";

/**
 * Regression: Pi.ai sidebar menu buttons (Focus / Voice settings) rendered at
 * HALF the height of Pi's native nav items, leaving them cramped/overlapping
 * when the sidebar is expanded.
 *
 * Root cause (verified live on pi.ai 2026-06-20): createMenuButton used the
 * Tailwind ARBITRARY class `h-[2.5rem]`. Pi compiles its own Tailwind and never
 * emits a rule for that arbitrary value, so the class was a no-op and the button
 * collapsed to its content height (~22px) instead of the native 40px. Pi's own
 * nav items use the STANDARD utility `h-10` (which Pi does compile, = 40px).
 *
 * Contract: SayPi's sidebar menu buttons must use the host's standard `h-10`
 * height utility (matching native items), never the arbitrary `h-[2.5rem]`.
 */

// ButtonModule's constructor pulls in immersion/state-machine/call-button wiring
// that is irrelevant to the DOM a menu button produces — stub it all out so we
// exercise the real createMenuButton class string.
vi.mock("../../src/ImmersionService.js", () => ({
  ImmersionService: class {
    enterImmersiveMode() {}
    static exitImmersiveMode() {}
  },
}));
vi.mock("../../src/StateMachineService.js", () => ({
  default: { screenLockActor: { send: vi.fn() } },
}));
vi.mock("../../src/SubmitErrorHandler.ts", () => ({ submitErrorHandler: {} }));
vi.mock("../../src/buttons/CallButton.ts", () => ({
  initializeCallButton: vi.fn(),
  getCallButtonInstance: vi.fn(),
}));
vi.mock("../../src/chatbots/ChatbotService.ts", () => ({
  ChatbotService: { getChatbotSync: () => ({ getName: () => "Pi", getID: () => "pi" }) },
}));
vi.mock("../../src/prefs/PreferenceModule.ts", () => ({
  UserPreferenceModule: { getInstance: () => ({ getLanguage: vi.fn() }) },
}));
vi.mock("../../src/i18n.ts", () => ({ default: (key: string) => key }));

describe("Pi sidebar menu button height (#350 follow-up)", () => {
  let container: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = "";
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  it("Focus menu button uses the host's h-10 height utility, not h-[2.5rem]", async () => {
    const { buttonModule } = await import("../../src/ButtonModule.js");
    buttonModule.createImmersiveModeMenuButton(container, 0);

    const button = container.querySelector(".immersive-mode-button") as HTMLElement;
    expect(button).not.toBeNull();
    expect(button.classList.contains("h-10")).toBe(true);
    expect(button.classList.contains("h-[2.5rem]")).toBe(false);
  });

  it("Voice settings menu button uses the host's h-10 height utility, not h-[2.5rem]", async () => {
    const { buttonModule } = await import("../../src/ButtonModule.js");
    buttonModule.createSettingsMenuButton(container, 0);

    const button = container.querySelector(".settings-button") as HTMLElement;
    expect(button).not.toBeNull();
    expect(button.classList.contains("h-10")).toBe(true);
    expect(button.classList.contains("h-[2.5rem]")).toBe(false);
  });
});
