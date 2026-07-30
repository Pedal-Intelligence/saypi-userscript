import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { piAutoRead } from "../../src/chatbots/pi/PiAutoRead";
import { getAudioOutputToggle } from "../../src/chatbots/AudioOutputToggle";

/**
 * Pi retired its in-chat voice menu (verified live 2026-07-30). The audio
 * on/off control is now a single `menuitemcheckbox` inside a "Chat options"
 * kebab popover that Pi mounts on open and tears down on close — so the old
 * `getAudioOutputButtonSelector()` contract ("one always-present element whose
 * SVG path encodes its state") no longer describes this host at all, and
 * `#saypi-audio-output-button` was never being assigned. Pi supplies an
 * AudioOutputToggle instead.
 *
 * The fixture below reproduces the three behaviours that make this awkward and
 * that the implementation has to survive:
 *   1. the auto-read item exists ONLY while the popover is open,
 *   2. `aria-checked` (not the label, which reads "Turn off auto-read" when on
 *      and "Auto-read" when off) is the state signal,
 *   3. clicking the item leaves the popover OPEN — closing needs a second
 *      click on the kebab.
 */
function mountPiAudioControls(options: {
  autoRead: boolean;
  /** Set false to simulate a popover that never mounts (Pi churn / slow React). */
  popoverMounts?: boolean;
}): {
  kebab: HTMLButtonElement;
  isOpen: () => boolean;
  /** The fixture's TRUE auto-read state, independent of the storage mirror. */
  autoReadState: () => boolean;
} {
  const { autoRead, popoverMounts = true } = options;

  const controls = document.createElement("div");
  controls.className = "order-2 w-auto saypi-audio-controls";

  const kebab = document.createElement("button");
  kebab.setAttribute("aria-label", "Chat options");
  kebab.type = "button";
  controls.appendChild(kebab);
  document.body.appendChild(controls);

  let checked = autoRead;
  localStorage.setItem("isVoiceEnabled", String(autoRead));

  const buildPopover = (): HTMLElement => {
    const menu = document.createElement("div");
    menu.setAttribute("role", "menu");
    menu.setAttribute("aria-label", "Chat options");

    const item = document.createElement("div");
    item.setAttribute("role", "menuitemcheckbox");
    item.setAttribute("data-testid", "chat-options-auto-read");
    item.setAttribute("aria-checked", String(checked));
    item.textContent = checked ? "Turn off auto-read" : "Auto-read";
    item.addEventListener("click", () => {
      checked = !checked;
      item.setAttribute("aria-checked", String(checked));
      item.textContent = checked ? "Turn off auto-read" : "Auto-read";
      localStorage.setItem("isVoiceEnabled", String(checked));
      // Pi leaves the popover open after a toggle — deliberately not removed.
    });

    menu.appendChild(item);
    return menu;
  };

  const isOpen = () => !!controls.querySelector('[role="menu"]');

  kebab.addEventListener("click", () => {
    const open = controls.querySelector('[role="menu"]');
    if (open) {
      open.remove();
    } else if (popoverMounts) {
      controls.appendChild(buildPopover());
    }
  });

  return { kebab, isOpen, autoReadState: () => checked };
}

describe("piAutoRead — Pi's AudioOutputToggle", () => {
  const chatbot = piAutoRead;

  beforeEach(() => {
    document.body.innerHTML = "";
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  it("is the toggle SayPi resolves for the pi host, and no other", () => {
    expect(getAudioOutputToggle("pi")).toBe(piAutoRead);
    // Claude and ChatGPT keep the decoratable-button path.
    expect(getAudioOutputToggle("claude")).toBeNull();
    expect(getAudioOutputToggle("chatgpt")).toBeNull();
    expect(getAudioOutputToggle(null)).toBeNull();
  });

  describe("isAudioOutputEnabled", () => {
    it("reads aria-checked off the live item when the popover is open", () => {
      const { kebab } = mountPiAudioControls({ autoRead: false });
      kebab.click(); // open the popover

      // The live element disagrees with a deliberately stale mirror; the live
      // element must win.
      localStorage.setItem("isVoiceEnabled", "true");

      expect(chatbot.isAudioOutputEnabled()).toBe(false);
    });

    it("falls back to Pi's localStorage mirror when the popover is closed", () => {
      mountPiAudioControls({ autoRead: true });
      expect(chatbot.isAudioOutputEnabled()).toBe(true);

      localStorage.setItem("isVoiceEnabled", "false");
      expect(chatbot.isAudioOutputEnabled()).toBe(false);
    });

    it("does not open the popover just to read state", () => {
      const { isOpen } = mountPiAudioControls({ autoRead: true });
      chatbot.isAudioOutputEnabled();
      expect(isOpen()).toBe(false);
    });

    it("reports disabled rather than throwing when Pi's surface is absent", () => {
      expect(chatbot.isAudioOutputEnabled()).toBe(false);
    });
  });

  describe("setAudioOutputEnabled", () => {
    it("turns auto-read on by driving Pi's kebab, and leaves the menu closed", async () => {
      const { isOpen, autoReadState } = mountPiAudioControls({ autoRead: false });

      await chatbot.setAudioOutputEnabled(true);

      expect(autoReadState()).toBe(true);
      expect(localStorage.getItem("isVoiceEnabled")).toBe("true");
      expect(isOpen()).toBe(false);
    });

    it("turns auto-read off symmetrically", async () => {
      const { isOpen, autoReadState } = mountPiAudioControls({ autoRead: true });

      await chatbot.setAudioOutputEnabled(false);

      expect(autoReadState()).toBe(false);
      expect(localStorage.getItem("isVoiceEnabled")).toBe("false");
      expect(isOpen()).toBe(false);
    });

    it("is a no-op — and never opens the menu — when already in the target state", async () => {
      const { kebab, isOpen } = mountPiAudioControls({ autoRead: true });
      const kebabClicks = vi.spyOn(kebab, "click");

      await chatbot.setAudioOutputEnabled(true);

      expect(kebabClicks).not.toHaveBeenCalled();
      expect(isOpen()).toBe(false);
      expect(localStorage.getItem("isVoiceEnabled")).toBe("true");
    });

    it("trusts the live aria-checked over a stale localStorage mirror", async () => {
      // Auto-read is really ON, but Pi's mirror wrongly says off. The stale
      // mirror may cost us an unnecessary popover open; it must NEVER cause a
      // wrong toggle. Without a read-before-write this turns auto-read OFF.
      const { isOpen, autoReadState } = mountPiAudioControls({ autoRead: true });
      localStorage.setItem("isVoiceEnabled", "false");

      await chatbot.setAudioOutputEnabled(true);

      // Already on: the live element said so, so nothing was clicked. (The
      // mirror stays stale here only because the fixture desynced it by hand —
      // Pi keeps it in step. What matters is that auto-read is still ON.)
      expect(autoReadState()).toBe(true);
      expect(isOpen()).toBe(false);
    });

    it("leaves a popover the user already had open exactly as it found it", async () => {
      const { kebab, isOpen } = mountPiAudioControls({ autoRead: false });
      kebab.click();
      expect(isOpen()).toBe(true);

      await chatbot.setAudioOutputEnabled(true);

      expect(localStorage.getItem("isVoiceEnabled")).toBe("true");
      expect(isOpen()).toBe(true); // we didn't open it, so we don't close it
    });

    it("degrades without throwing, and closes up, when the popover never mounts", async () => {
      vi.useFakeTimers();
      const { isOpen } = mountPiAudioControls({
        autoRead: false,
        popoverMounts: false,
      });

      const pending = chatbot.setAudioOutputEnabled(true);
      await vi.advanceTimersByTimeAsync(5000);
      await expect(pending).resolves.toBeUndefined();

      expect(isOpen()).toBe(false);
      expect(localStorage.getItem("isVoiceEnabled")).toBe("false");
    });

    it("degrades without throwing when Pi's kebab is absent entirely", async () => {
      localStorage.setItem("isVoiceEnabled", "false");
      await expect(chatbot.setAudioOutputEnabled(true)).resolves.toBeUndefined();
    });
  });
});
