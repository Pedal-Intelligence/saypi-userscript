import { describe, it, expect } from "vitest";
import {
  environmentToQuietMode,
  VOICE_ENVIRONMENTS,
} from "../../src/onboarding/environmentQuietMode";

describe("environmentToQuietMode (#437)", () => {
  it("enables quiet mode only when the user is around others", () => {
    expect(environmentToQuietMode("around-others")).toBe(true);
  });

  it("leaves quiet mode off for private and mixed spaces", () => {
    expect(environmentToQuietMode("private")).toBe(false);
    expect(environmentToQuietMode("mixed")).toBe(false);
  });

  it("covers exactly the three offered environments", () => {
    expect(VOICE_ENVIRONMENTS).toEqual(["private", "mixed", "around-others"]);
    // every offered environment yields a boolean (no undefined branches)
    for (const env of VOICE_ENVIRONMENTS) {
      expect(typeof environmentToQuietMode(env)).toBe("boolean");
    }
  });
});
