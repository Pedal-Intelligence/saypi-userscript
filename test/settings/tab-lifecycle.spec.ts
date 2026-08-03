import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { TabController } from "../../entrypoints/settings/shared/types";

/**
 * `TabController.onHidden` / `onShown` — the ONE piece of the Voices work that
 * touches infrastructure shared by all five settings tabs, and therefore the
 * one that has to justify itself.
 *
 * Why they exist: tabs are never destroyed. `SettingsApp` mounts each one on
 * first visit and leaves it mounted for the life of the page, so a tab that
 * owns something ongoing has, until now, had no way to learn whether anybody
 * is looking at it. Four of the five tabs are forms and do not care — a form
 * off-screen is simply a form. Voices is the exception at both ends:
 *
 *  - `onHidden` — it runs a media player, and `Play all` walks a whole catalog.
 *    Without it a sweep started on Voices goes on sounding while you read
 *    About, with its Stop button no longer on screen.
 *  - `onShown` — its rail is a `role="listbox"` whose whole interaction model
 *    is the keyboard. `display: none` on an inactive panel means the rail
 *    cannot hold DOM focus until its tab is on screen, and nothing in a
 *    class-toggling tab switcher hands focus anywhere. So the rail set
 *    tabIndex=0 and painted an active descendant while focus sat on the
 *    sidebar button — it looked focused and could not be typed at.
 *
 * Why they are shaped like this: optional, no arguments, no return, `onHidden`
 * for the OUTGOING tab and `onShown` for the incoming one, both wrapped so one
 * tab cannot stop the other from doing its job. Nothing about either is
 * Voices-specific, and nothing else had to move.
 *
 * What this file proves: the hooks are declared, the shell calls each for the
 * right tab at the right moment, Voices implements both, and nothing else does.
 * It is a source contract for `entrypoints/settings/index.ts` because that
 * module bootstraps itself on import — the *behaviour* they wire up (the rail
 * going quiet, and the rail taking the keyboard) is proved on the real DOM in
 * voices-controller.spec.tsx.
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

/**
 * `switchToTab`'s body, from its signature to the closing brace of the class.
 * It is the last method in `SettingsApp`, and pinning the end to a marker that
 * a later refactor could delete is how this file would silently start asserting
 * against an empty string.
 */
const switchToTabBody = shellSrc.slice(
  shellSrc.indexOf("private async switchToTab")
);

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
    // The outgoing tab is read from the remembered id, and only when it is
    // genuinely a different tab — re-selecting the current one must not stop
    // its own audio.
    expect(switchToTabBody).toMatch(
      /this\.activeTabId !== null && this\.activeTabId !== tabId/
    );
    expect(switchToTabBody).toMatch(
      /this\.tabs\.get\(this\.activeTabId\)\?\.onHidden\?\.\(\)/
    );
    // …and it happens BEFORE the incoming tab is loaded, so the two never
    // overlap on screen.
    expect(switchToTabBody.indexOf("onHidden")).toBeLessThan(
      switchToTabBody.indexOf("loadTab")
    );
  });

  it("cannot let one tab's teardown block the next tab from opening", () => {
    expect(switchToTabBody).toMatch(/try\s*\{[\s\S]*onHidden[\s\S]*\}\s*catch/);
  });

  it("remembers which tab is on screen, including the very first one", () => {
    // `navigator.selectTab(initialTab)` fires onTabChange during bootstrap, so
    // the first pass through switchToTab has no outgoing tab — which is
    // exactly what `activeTabId === null` means.
    expect(shellSrc).toMatch(/private activeTabId: string \| null = null;/);
    expect(shellSrc).toMatch(/this\.activeTabId = tabId;/);
  });
});

describe("TabController.onShown", () => {
  it("is declared optional, exactly like its sibling", () => {
    expect(typesSrc).toMatch(/onShown\?\(\):\s*void;/);
    const formTab: TabController = {
      container: document.createElement("div"),
      init: async () => {},
    };
    expect(formTab.onShown).toBeUndefined();
  });

  it("is called for the tab that ARRIVED, once it has actually loaded", () => {
    expect(switchToTabBody).toMatch(/this\.tabs\.get\(tabId\)\?\.onShown\?\.\(\)/);
    // After loadTab, not before: a tab that has never been initialised has no
    // DOM yet, so a hook fired ahead of it would have nothing to focus.
    expect(switchToTabBody.indexOf("loadTab")).toBeLessThan(
      switchToTabBody.indexOf("onShown")
    );
    // …and after the outgoing tab has been told it is leaving, so a stale
    // pending focus claim is cancelled before a fresh one is made.
    expect(switchToTabBody.indexOf("onHidden")).toBeLessThan(
      switchToTabBody.indexOf("onShown")
    );
  });

  it("cannot let the arriving tab's hook break the tab switch", () => {
    const after = switchToTabBody.slice(switchToTabBody.indexOf("loadTab"));
    expect(after).toMatch(/try\s*\{[\s\S]*onShown[\s\S]*\}\s*catch/);
  });

  it("fires for the tab the page opens on, deep link included", () => {
    // `navigator.selectTab(initialTab)` runs switchToTab during bootstrap, so
    // opening settings straight onto Voices — the in-chat menus' "More
    // voices…" door — goes through exactly the same path as clicking the tab.
    expect(shellSrc).toMatch(/this\.navigator\.selectTab\(initialTab\)/);
  });
});

describe("only the tab that needed them implements them", () => {
  it("is implemented by Voices, and delegates straight to the player", () => {
    const voices = read(TABS.voices);
    expect(voices).toMatch(/onHidden\(\):\s*void\s*\{/);
    expect(voices).toMatch(/this\.voicesController\?\.onHidden\(\)/);
    expect(voices).toMatch(/onShown\(\):\s*void\s*\{/);
    expect(voices).toMatch(/this\.voicesController\?\.onShown\(\)/);
  });

  it.each(["general", "chat", "dictation", "about"] as const)(
    "leaves the %s tab untouched — a form off-screen is simply a form",
    (tab) => {
      expect(read(TABS[tab])).not.toMatch(/onHidden|onShown/);
    }
  );
});
