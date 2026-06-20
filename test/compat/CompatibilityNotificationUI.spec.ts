import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { CompatibilityNotificationUI } from "../../src/compat/CompatibilityNotificationUI";

// Characterization tests: written against the imperative implementation and
// kept green across the migration to the shared <Notice> Preact component.

vi.mock("../../src/events/EventBus", () => ({
  default: { on: vi.fn(), emit: vi.fn() },
}));

vi.mock("../../src/LoggingModule", () => ({
  logger: { debug: vi.fn(), warn: vi.fn(), info: vi.fn(), error: vi.fn() },
}));

vi.mock("../../src/i18n", () => ({
  default: vi.fn((key: string, params?: string[]) => {
    const messages: Record<string, string> = {
      ttsUnavailableBrowserChatbot: "TTS is unavailable on $1 with $2.",
      dismissNotice: "Dismiss",
    };
    let message = messages[key] || key;
    if (params && params.length >= 2) {
      message = message.replace("$1", params[0]).replace("$2", params[1]);
    }
    return message;
  }),
}));

vi.mock("../../src/icons/IconModule", () => ({
  IconModule: {
    info: {
      cloneNode: vi.fn(() => {
        const icon = document.createElement("div");
        icon.className = "mock-info-icon";
        return icon;
      }),
    },
  },
}));

vi.mock("../../src/chatbots/ChatbotService", () => ({
  ChatbotService: {
    getChatbot: vi.fn().mockResolvedValue({
      getID: () => "pi",
      getName: () => "Pi",
    }),
  },
}));

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
  configurable: true,
});
Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

const issue = {
  feature: "tts",
  browserName: "Firefox",
  chatbotType: "claude",
  chatbotName: "Claude",
} as any;

describe("CompatibilityNotificationUI", () => {
  let ui: CompatibilityNotificationUI;

  beforeEach(() => {
    document.body.innerHTML = "";
    localStorageMock.clear();
    vi.clearAllMocks();
    (CompatibilityNotificationUI as any).instance = null;
    ui = CompatibilityNotificationUI.getInstance();
    ui.resetDismissedState();
  });

  afterEach(() => {
    document
      .querySelectorAll(".saypi-compat-notice")
      .forEach((n) => n.remove());
  });

  it("renders a structurally-correct compat notice (icon + plain text + close)", async () => {
    await ui.forceShowNotice(issue);

    const notice = document.querySelector(".saypi-compat-notice") as HTMLElement;
    expect(notice).toBeTruthy();
    expect(notice.getAttribute("data-issue-key")).toBe("tts:Firefox:claude");
    expect(notice.querySelector(".saypi-compat-notice-content")).toBeTruthy();
    expect(notice.querySelector(".saypi-compat-notice-icon")).toBeTruthy();

    const text = notice.querySelector(".saypi-compat-notice-text") as HTMLElement;
    expect(text).toBeTruthy();
    expect(text.textContent).toContain("Firefox");
    expect(text.textContent).toContain("Claude");
    // Compat body is plain text — no parsed child elements.
    expect(text.children.length).toBe(0);

    expect(notice.querySelector(".saypi-compat-notice-close")).toBeTruthy();
  });

  it("persists the dismissed issue key when the close button is clicked", async () => {
    await ui.forceShowNotice(issue);

    const close = document.querySelector(
      ".saypi-compat-notice-close",
    ) as HTMLElement;
    expect(close).toBeTruthy();
    close.click();

    const stored = localStorageMock.getItem("saypi-compat-notice-dismissed");
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!)["tts:Firefox:claude"]).toBe(true);
  });

  it("does not show a notice for an already-dismissed issue", async () => {
    (ui as any).dismissedState.set("tts:Firefox:claude", true);
    await (ui as any).handleCompatibilityIssue(issue);
    expect(document.querySelector(".saypi-compat-notice")).toBeNull();
  });
});
