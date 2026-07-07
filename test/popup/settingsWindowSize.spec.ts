import { describe, it, expect } from "vitest";
import {
  settingsWindowGrowthFor,
  STUDIO_WINDOW,
} from "../../src/popup/settingsWindowSize";

// The settings popup opens compact (right for the form tabs) and grows —
// macOS System Settings style — when the Voices studio needs the room.

const SCREEN = { availWidth: 1728, availHeight: 1079 };

describe("settingsWindowGrowthFor", () => {
  it("grows the compact popup to the studio size for the voices tab", () => {
    const growth = settingsWindowGrowthFor(
      "voices",
      { width: 742, height: 512 },
      SCREEN
    );
    expect(growth).toEqual({
      width: STUDIO_WINDOW.width,
      height: STUDIO_WINDOW.height,
    });
  });

  it("asks nothing for the compact tabs", () => {
    for (const tab of ["general", "chat", "dictation", "about"]) {
      expect(
        settingsWindowGrowthFor(tab, { width: 742, height: 512 }, SCREEN)
      ).toBeNull();
    }
  });

  it("clamps to the available screen", () => {
    const growth = settingsWindowGrowthFor(
      "voices",
      { width: 742, height: 512 },
      { availWidth: 1024, availHeight: 700 }
    );
    expect(growth).toEqual({ width: 1024, height: 700 });
  });

  it("never shrinks a window the user has made larger", () => {
    expect(
      settingsWindowGrowthFor(
        "voices",
        { width: 1500, height: 1000 },
        SCREEN
      )
    ).toBeNull();
  });

  it("grows only the deficient dimension", () => {
    const growth = settingsWindowGrowthFor(
      "voices",
      { width: 1500, height: 512 },
      SCREEN
    );
    expect(growth).toEqual({ width: 1500, height: STUDIO_WINDOW.height });
  });
});
