import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { readFileSync } from "node:fs";

const { exitFullscreenMock, enterFullscreenMock } = vi.hoisted(() => ({
  exitFullscreenMock: vi.fn(() => Promise.resolve()),
  enterFullscreenMock: vi.fn(),
}));

vi.mock("../../src/FullscreenModule.ts", () => ({
  exitFullscreen: exitFullscreenMock,
  enterFullscreen: enterFullscreenMock,
}));

const { mockPreferences } = vi.hoisted(() => ({
  mockPreferences: {
    getPrefersImmersiveView: vi.fn(),
    setPrefersImmersiveView: vi.fn(),
    getTheme: vi.fn(),
  } as {
    getPrefersImmersiveView: ReturnType<typeof vi.fn>;
    setPrefersImmersiveView: ReturnType<typeof vi.fn>;
    getTheme: ReturnType<typeof vi.fn>;
  },
}));

vi.mock("../../src/prefs/PreferenceModule.ts", () => ({
  UserPreferenceModule: { getInstance: () => mockPreferences },
  Preference: {},
  VoicePreference: {},
}));

const { applyThemeMock } = vi.hoisted(() => ({
  applyThemeMock: vi.fn(),
}));

vi.mock("../../src/themes/ThemeManagerModule.ts", () => ({
  ThemeManager: { getInstance: () => ({ applyTheme: applyThemeMock }) },
}));

import { ImmersionService } from "../../src/ImmersionService.js";
import { ImmersionStateChecker } from "../../src/ImmersionServiceLite.ts";

function setHost(host: string) {
  (globalThis as any).__SAYPI_HOST_OVERRIDE__ = host;
}

function clearHostOverride() {
  delete (globalThis as any).__SAYPI_HOST_OVERRIDE__;
}

function createChatbot(host: string) {
  return {
    isChatablePath: () => true,
    getChatPath: () => "/",
    getID: () => host,
  };
}

describe("Immersive emergency escape", () => {
  beforeEach(() => {
    const storage = new Map<string, string>();
    const localStorageMock = {
      getItem: vi.fn((key: string) => (storage.has(key) ? storage.get(key)! : null)),
      setItem: vi.fn((key: string, value: string) => {
        storage.set(key, String(value));
      }),
      removeItem: vi.fn((key: string) => {
        storage.delete(key);
      }),
      clear: vi.fn(() => {
        storage.clear();
      }),
    } as Storage;
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(global, "localStorage", {
      value: localStorageMock,
      configurable: true,
      writable: true,
    });
    localStorage.clear();
    document.documentElement.className = "";
    document.body.className = "";
    document.body.innerHTML = "";

    exitFullscreenMock.mockClear();
    enterFullscreenMock.mockClear();
    applyThemeMock.mockClear();

    mockPreferences.getPrefersImmersiveView.mockReset();
    mockPreferences.setPrefersImmersiveView.mockReset();
    mockPreferences.getTheme.mockReset();
    mockPreferences.getTheme.mockResolvedValue("light");

    Object.defineProperty(document, "fullscreenElement", {
      configurable: true,
      writable: true,
      value: null,
    });

    setHost("chatgpt.com");
    document.body.classList.add("chatgpt");
  });

  afterEach(() => {
    clearHostOverride();
  });

  it("exits immersive mode after a double Escape press", async () => {
    const chatbot = createChatbot("chatgpt");
    const service = new ImmersionService(chatbot as any);

    service.enterImmersiveMode();
    await Promise.resolve();

    expect(ImmersionStateChecker.isViewImmersive()).toBe(true);

    document.body.classList.add("focus");
    document.documentElement.classList.add("immersive-view");
    (document as any).fullscreenElement = {};

    exitFullscreenMock.mockImplementation(() => {
      (document as any).fullscreenElement = null;
      return Promise.resolve();
    });

    const firstEsc = new window.KeyboardEvent("keydown", { key: "Escape" });
    document.dispatchEvent(firstEsc);
    expect(exitFullscreenMock).toHaveBeenCalledTimes(1);

    const secondEsc = new window.KeyboardEvent("keydown", { key: "Escape" });
    document.dispatchEvent(secondEsc);

    expect(localStorage.getItem("userViewPreference")).toBe("standard");
    expect(ImmersionStateChecker.isViewImmersive()).toBe(false);
    expect(document.body.classList.contains("focus")).toBe(false);
    expect(document.fullscreenElement).toBeNull();
  });

  it("clears legacy immersive preference on ChatGPT during init", async () => {
    mockPreferences.getPrefersImmersiveView.mockResolvedValue(true);
    const chatbot = createChatbot("chatgpt");
    document.documentElement.classList.add("immersive-view");
    document.body.classList.add("focus");
    localStorage.setItem("userViewPreference", "immersive");

    const service = new ImmersionService(chatbot as any);
    await service.initMode();

    expect(mockPreferences.setPrefersImmersiveView).toHaveBeenCalledWith(false);
    expect(localStorage.getItem("userViewPreference")).toBe("standard");
    expect(ImmersionStateChecker.isViewImmersive()).toBe(false);
    expect(document.body.classList.contains("focus")).toBe(false);
  });

  it("preserves immersive mode on Pi hosts", async () => {
    setHost("pi.ai");
    document.body.classList.remove("chatgpt");
    mockPreferences.getPrefersImmersiveView.mockResolvedValue(true);
    const chatbot = createChatbot("pi");

    const service = new ImmersionService(chatbot as any);
    await service.initMode();

    expect(localStorage.getItem("userViewPreference")).toBe("immersive");
    expect(ImmersionStateChecker.isViewImmersive()).toBe(true);
  });

  it("defines a ChatGPT-specific exit button override", () => {
    const css = readFileSync(new URL("../../src/styles/chatgpt.scss", import.meta.url));
    const cssText = css.toString();
    expect(cssText).toContain("html.immersive-view body.chatgpt #saypi-exit-button");
    expect(cssText).toContain("right: 16px;");
  });
});
