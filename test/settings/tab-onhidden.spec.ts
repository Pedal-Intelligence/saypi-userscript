import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { TabController } from "../../entrypoints/settings/shared/types";

/**
 * `TabController.onHidden` — the ONE piece of slice 3 that touches
 * infrastructure shared by all five settings tabs, and therefore the one that
 * has to justify itself.
 *
 * Why it exists: tabs are never destroyed. `SettingsApp` mounts each one on
 * first visit and leaves it mounted for the life of the page, so a tab that
 * owns something ongoing has, until now, had no way to learn that nobody is
 * looking at it. Four of the five tabs are forms and do not care — a form
 * off-screen is simply a form. Voices runs a media player, and `Play all`
 * walks a whole catalog: without this hook a sweep started on Voices goes on
 * sounding while you read About, with its Stop button no longer on screen.
 *
 * Why it is shaped like this: optional, no arguments, no return, called for the
 * OUTGOING tab only, and wrapped so one tab's teardown cannot stop the next
 * tab from opening. Nothing about it is Voices-specific, and nothing else had
 * to move.
 *
 * What this file proves: the hook is declared, the shell calls it for the tab
 * that is leaving, Voices implements it, and nothing else does. It is a source
 * contract for `entrypoints/settings/index.ts` because that module bootstraps
 * itself on import — the *behaviour* it wires up (the rail actually going
 * quiet) is proved on the real DOM in voices-controller.spec.tsx.
 */
const root = resolve(__dirname, "../..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

const shellSrc = read("entrypoints/settings/index.ts");
const typesSrc = read("entrypoints/settings/shared/types.ts");

const TABS = {
  general: "entrypoints/settings/tabs/general/index.ts",
  chat: "entrypoints/settings/tabs/chat/index.ts",
  dictation: "entrypoints/settings/tabs/dictation/index.ts",
  voices: "entrypoints/settings/tabs/voices/index.ts",
  about: "entrypoints/settings/tabs/about/index.ts",
} as const;

describe("TabController.onHidden", () => {
  it("is declared optional, so four of five tabs need no opinion", () => {
    expect(typesSrc).toMatch(/onHidden\?\(\):\s*void;/);
    // Type-level: a controller with no onHidden is still a TabController.
    const formTab: TabController = {
      container: document.createElement("div"),
      init: async () => {},
    };
    expect(formTab.onHidden).toBeUndefined();
  });

  it("is called for the tab that is LEAVING, not the one arriving", () => {
    const body = shellSrc.slice(
      shellSrc.indexOf("private async switchToTab"),
      shellSrc.indexOf("private async ensureRoomFor")
    );
    // The outgoing tab is read from the remembered id, and only when it is
    // genuinely a different tab — re-selecting the current one must not stop
    // its own audio.
    expect(body).toMatch(
      /this\.activeTabId !== null && this\.activeTabId !== tabId/
    );
    expect(body).toMatch(/this\.tabs\.get\(this\.activeTabId\)\?\.onHidden\?\.\(\)/);
    // …and it happens BEFORE the incoming tab is loaded, so the two never
    // overlap on screen.
    expect(body.indexOf("onHidden")).toBeLessThan(body.indexOf("loadTab"));
  });

  it("cannot let one tab's teardown block the next tab from opening", () => {
    const body = shellSrc.slice(
      shellSrc.indexOf("private async switchToTab"),
      shellSrc.indexOf("private async ensureRoomFor")
    );
    expect(body).toMatch(/try\s*\{[\s\S]*onHidden[\s\S]*\}\s*catch/);
  });

  it("remembers which tab is on screen, including the very first one", () => {
    // `navigator.selectTab(initialTab)` fires onTabChange during bootstrap, so
    // the first pass through switchToTab has no outgoing tab — which is
    // exactly what `activeTabId === null` means.
    expect(shellSrc).toMatch(/private activeTabId: string \| null = null;/);
    expect(shellSrc).toMatch(/this\.activeTabId = tabId;/);
  });
});

describe("only the tab that needed it implements it", () => {
  it("is implemented by Voices, and delegates straight to the player", () => {
    const voices = read(TABS.voices);
    expect(voices).toMatch(/onHidden\(\):\s*void\s*\{/);
    expect(voices).toMatch(/this\.voicesController\?\.onHidden\(\)/);
  });

  it.each(["general", "chat", "dictation", "about"] as const)(
    "leaves the %s tab untouched — a form off-screen is simply a form",
    (tab) => {
      expect(read(TABS[tab])).not.toMatch(/onHidden/);
    }
  );
});
