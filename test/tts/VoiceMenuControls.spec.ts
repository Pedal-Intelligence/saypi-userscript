import { describe, it, expect } from "vitest";
import {
  classifyControl,
  markAdopted,
  HOST_VOICE_ATTR,
} from "../../src/tts/VoiceMenuControls";

function button(...classes: string[]): HTMLButtonElement {
  const b = document.createElement("button");
  b.classList.add(...classes);
  return b;
}

describe("VoiceMenuControls.classifyControl — positive, exhaustive taxonomy", () => {
  it("classifies each SayPi control kind by its positive marker", () => {
    expect(
      classifyControl(button("saypi-voice-button", "saypi-custom-voice"))
    ).toBe("custom-voice");
    expect(
      classifyControl(button("saypi-voice-button", "saypi-restored-voice"))
    ).toBe("restored-voice");
    expect(
      classifyControl(button("saypi-voice-button", "saypi-more-voices"))
    ).toBe("door");
    expect(classifyControl(button("saypi-voice-preview"))).toBe("preview");
  });

  it("classifies an adopted host button as host-voice", () => {
    const b = button();
    markAdopted(b);
    expect(b.getAttribute(HOST_VOICE_ATTR)).toBe("true");
    expect(classifyControl(b)).toBe("host-voice");
  });

  it("returns unknown for anything unmarked — new elements are inert until opted in", () => {
    expect(classifyControl(button())).toBe("unknown");
    expect(classifyControl(button("some-host-class"))).toBe("unknown");
    expect(classifyControl(document.createElement("div"))).toBe("unknown");
  });

  it("gives the ▶ preview priority over row-level markers (a preview inside a marked row is still a preview)", () => {
    expect(
      classifyControl(button("saypi-voice-preview", "saypi-voice-button"))
    ).toBe("preview");
  });
});
