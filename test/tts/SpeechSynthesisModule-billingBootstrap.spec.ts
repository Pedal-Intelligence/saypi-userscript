import { describe, it, expect, vi, beforeEach } from "vitest";

// Regression guard for the billing listener registration timing.
//
// SpeechSynthesisModule.getInstance() runs early at bootstrap (via
// ChatHistoryManager / TTSControlsModule / AudioOutputMachine). It must
// eagerly construct the BillingModule singleton there, because BillingModule's
// constructor registers the `saypi:piStoppedWriting` -> charge listener that is
// the primary billing path for streamed voice turns. The only other
// BillingModule.getInstance() calls live inside MessageElements quote/charge
// methods, which run too late for the first turn. If the eager construction is
// dropped, early utterance charges are silently lost.
//
// (This test exists because a dead-code sweep once removed the eager call,
// having mis-judged BillingModule.getInstance() as a pure, side-effect-free
// expression. It is not — do not remove the eager call in getInstance().)

vi.mock("../../src/ConfigModule", () => ({
  config: {
    apiServerUrl: "https://api.saypi.ai",
    appServerUrl: "https://app.example.com",
  },
}));

// getInstance() constructs these for real; stub them so construction is
// side-effect-free in JSDOM and the test isolates the BillingModule wiring.
vi.mock("../../src/tts/TextToSpeechService", () => ({
  TextToSpeechService: vi.fn().mockImplementation(() => ({})),
}));
vi.mock("../../src/tts/AudioStreamManager", () => ({
  AudioStreamManager: vi.fn().mockImplementation(() => ({})),
}));

const { billingGetInstance } = vi.hoisted(() => ({
  billingGetInstance: vi.fn(() => ({})),
}));
vi.mock("../../src/billing/BillingModule", () => ({
  BillingModule: { getInstance: billingGetInstance },
}));

import { SpeechSynthesisModule } from "../../src/tts/SpeechSynthesisModule";

describe("SpeechSynthesisModule bootstrap registers the billing listener", () => {
  beforeEach(() => {
    billingGetInstance.mockClear();
    // Reset the singleton so getInstance() re-runs its construction block.
    (SpeechSynthesisModule as unknown as { instance?: unknown }).instance =
      undefined;
  });

  it("eagerly constructs the BillingModule singleton on first getInstance", () => {
    SpeechSynthesisModule.getInstance();
    expect(billingGetInstance).toHaveBeenCalled();
  });
});
