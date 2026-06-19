import { describe, it, expect } from "vitest";
import { isPiNavigationAwayFromConversation } from "../../src/chatbots/piRouteUtils";

/**
 * Regression guard: the telemetry route-reset must NOT fire when the current
 * conversation is merely assigned its thread id on the first message
 * (`/talk` -> `/talk/<id>`). Firing there wiped the first voice turn's
 * just-recorded metrics, so its telemetry button only appeared from turn 2 on.
 */
describe("isPiNavigationAwayFromConversation", () => {
  it("is FALSE when the current conversation gets its thread id on first message", () => {
    expect(isPiNavigationAwayFromConversation("/talk", "/talk/abc123")).toBe(false);
  });

  it("is TRUE when starting a new chat (back to /talk)", () => {
    expect(isPiNavigationAwayFromConversation("/talk/abc123", "/talk")).toBe(true);
  });

  it("is TRUE when switching to a different thread", () => {
    expect(isPiNavigationAwayFromConversation("/talk/abc123", "/talk/def456")).toBe(true);
  });

  it("is FALSE for a no-op same-thread change (e.g. query/hash)", () => {
    expect(isPiNavigationAwayFromConversation("/talk/abc123", "/talk/abc123")).toBe(false);
  });

  it("is TRUE when navigating to a non-conversation page", () => {
    expect(isPiNavigationAwayFromConversation("/talk/abc123", "/discover")).toBe(true);
  });
});
