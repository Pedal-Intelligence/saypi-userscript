import { describe, it, expect, beforeEach } from "vitest";
import EventBus from "../../../src/events/EventBus";
import {
  captureMessagesPresentAtCallStart,
  clearMessagesPresentAtCallStart,
  isMessageNewSinceCallStart,
  initCallStartTracking,
} from "../../../src/chatbots/chatgpt/readAloudGating";

describe("ChatGPT read-aloud call-start gating", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    clearMessagesPresentAtCallStart();
  });

  it("treats nothing as new when no call snapshot is active", () => {
    // Outside a call there is no snapshot, so a message can never be "new" — this
    // is what keeps page-load decoration (#245) from marking existing messages.
    expect(isMessageNewSinceCallStart("turn-1")).toBe(false);
  });

  it("treats a message absent from the call-start snapshot as new (new chat → #408)", () => {
    captureMessagesPresentAtCallStart(); // empty: brand-new chat at call start
    expect(isMessageNewSinceCallStart("turn-new")).toBe(true);
  });

  it("treats a message present at call start as not new (#245)", () => {
    const existing = document.createElement("article");
    existing.setAttribute("data-turn-id", "turn-old");
    document.body.appendChild(existing);

    captureMessagesPresentAtCallStart();

    expect(isMessageNewSinceCallStart("turn-old")).toBe(false);
    expect(isMessageNewSinceCallStart("turn-new")).toBe(true);
  });

  it("is conservative when the message has no usable id", () => {
    captureMessagesPresentAtCallStart();
    expect(isMessageNewSinceCallStart(null)).toBe(false);
    expect(isMessageNewSinceCallStart(undefined)).toBe(false);
    expect(isMessageNewSinceCallStart("")).toBe(false);
    expect(isMessageNewSinceCallStart("   ")).toBe(false);
  });

  it("does not consider a thread navigated-to mid-call as new (avoids #245 on cross-thread nav)", () => {
    // Call starts in an existing thread A (its turns are snapshotted).
    const a = document.createElement("article");
    a.setAttribute("data-turn-id", "turn-A");
    document.body.appendChild(a);
    captureMessagesPresentAtCallStart(document, "/c/threadA");

    // Same thread: a freshly-arrived reply is still new.
    expect(isMessageNewSinceCallStart("turn-A-reply", "/c/threadA")).toBe(true);

    // Navigated to a DIFFERENT existing thread mid-call: its last message predates
    // this call and must not be treated as new (it would otherwise be re-read).
    expect(isMessageNewSinceCallStart("turn-B-last", "/c/threadB")).toBe(false);
  });

  it("still treats the first reply as new across the new-chat → /c/<id> route change (#408/#200)", () => {
    // Call starts on a brand-new chat (no thread id) → empty snapshot.
    captureMessagesPresentAtCallStart(document, "/");
    // The reply is decorated AFTER the SPA assigns the thread id; it must stay new.
    expect(isMessageNewSinceCallStart("turn-first-reply", "/c/brand-new")).toBe(true);
    // Same for the project → thread route change in #200.
    captureMessagesPresentAtCallStart(document, "/g/g-p-abc/project");
    expect(isMessageNewSinceCallStart("turn-first-reply", "/g/g-p-abc/c/xyz")).toBe(true);
  });

  it("clears the snapshot when the call ends so nothing is considered new again", () => {
    captureMessagesPresentAtCallStart();
    expect(isMessageNewSinceCallStart("x")).toBe(true);
    clearMessagesPresentAtCallStart();
    expect(isMessageNewSinceCallStart("x")).toBe(false);
  });

  it("captures on session:started and clears on session:ended", () => {
    const present = document.createElement("article");
    present.setAttribute("data-turn-id", "turn-present");
    document.body.appendChild(present);

    initCallStartTracking();

    EventBus.emit("session:started");
    expect(isMessageNewSinceCallStart("turn-present")).toBe(false);
    expect(isMessageNewSinceCallStart("turn-later")).toBe(true);

    EventBus.emit("session:ended");
    expect(isMessageNewSinceCallStart("turn-later")).toBe(false);
  });
});
