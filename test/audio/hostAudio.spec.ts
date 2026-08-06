import { describe, it, expect, beforeEach } from "vitest";
import {
  findHostAudioElement,
  shouldMuteHostAudio,
} from "../../src/audio/hostAudio";

const ID = "saypi-audio-main";

describe("finding the host's audio element again after losing it", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("finds a replacement that is ALREADY in the document", () => {
    // The #602 case: pi.ai replaces its player rather than reusing it, so by
    // the time we notice ours is gone the new one has already been inserted —
    // and an observer waiting for an insertion waits forever.
    const replacement = document.createElement("audio");
    document.body.appendChild(replacement);
    expect(findHostAudioElement(document, ID)).toBe(replacement);
  });

  it("prefers the element we had already decorated", () => {
    const stranger = document.createElement("audio");
    const ours = document.createElement("audio");
    ours.id = ID;
    document.body.append(stranger, ours);
    expect(findHostAudioElement(document, ID)).toBe(ours);
  });

  it("reports nothing when the host has no player yet — the one case worth waiting for", () => {
    expect(findHostAudioElement(document, ID)).toBeNull();
  });

  it("never throws on a missing root", () => {
    expect(findHostAudioElement(null, ID)).toBeNull();
    expect(findHostAudioElement(undefined, ID)).toBeNull();
  });
});

describe("holding the host's audio muted while SayPi is the provider", () => {
  it("mutes the host when we are speaking from the offscreen document", () => {
    expect(
      shouldMuteHostAudio({ providerIsSayPi: true, playbackIsOffscreen: true })
    ).toBe(true);
  });

  it("leaves the host audible when its own voice is the one selected", () => {
    expect(
      shouldMuteHostAudio({ providerIsSayPi: false, playbackIsOffscreen: true })
    ).toBe(false);
  });

  it("never mutes the element WE play through (no offscreen document)", () => {
    // Firefox/Safari: SayPi shares the page's audio element with the host, so
    // muting it would mute us. Skip-on-loadstart stays the whole mechanism.
    expect(
      shouldMuteHostAudio({ providerIsSayPi: true, playbackIsOffscreen: false })
    ).toBe(false);
  });
});
