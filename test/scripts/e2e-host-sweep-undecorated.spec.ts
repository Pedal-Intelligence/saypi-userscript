import { describe, it, expect, beforeEach } from "vitest";
import {
  classifyUndecorated,
  UNDECORATED_KINDS,
  SIGN_IN_PROBE,
  summarize,
} from "../../scripts/e2e-host-sweep-lib.mjs";

/**
 * When the sweep waits 25s for #saypi-callButton and never sees it, the note it
 * records is the whole story a human gets. Until #559 that note was a single
 * string — "not decorated — selector drift or logged out" — which conflates the
 * two things a reader most needs to tell apart:
 *
 *   - the harness never reached the chat app (redirect / sign-in wall) → an
 *     automation/seeding problem, nothing to hunt in SayPi;
 *   - the chat app rendered and SayPi failed to decorate it → real DOM drift,
 *     the highest-signal defect class this sweep exists to find.
 *
 * Real case that motivated it (2026-07-26): pi.ai now bounces signed-out
 * visitors from https://pi.ai/talk to the https://hey.pi.ai/ marketing splash.
 */

describe("classifyUndecorated — the real pi.ai redirect (#559)", () => {
  it("calls the pi.ai → hey.pi.ai bounce a redirect, not drift", () => {
    const c = classifyUndecorated({
      requestedUrl: "https://pi.ai/talk",
      finalUrl: "https://hey.pi.ai/",
      title: "Pi, your personal AI",
    });

    expect(c.kind).toBe(UNDECORATED_KINDS.REDIRECTED);
    expect(c.owner).toBe("automation");
    expect(c.redirected).toBe(true);
    expect(c.requestedOrigin).toBe("pi.ai");
    expect(c.finalOrigin).toBe("hey.pi.ai");
    // The note must state the observation before the verdict, and must not
    // leave "selector drift" hanging as a live possibility.
    expect(c.note).toContain("https://pi.ai/talk");
    expect(c.note).toContain("https://hey.pi.ai/");
    expect(c.note).not.toMatch(/selector drift or logged out/);
  });

  it("keeps calling it a redirect even though hey.pi.ai shows sign-up CTAs", () => {
    // The splash page has "Get started"/"Sign up" affordances, so the sign-in
    // probe fires too. Origin wins: we never reached the chat app at all.
    const c = classifyUndecorated({
      requestedUrl: "https://pi.ai/talk",
      finalUrl: "https://hey.pi.ai/",
      signInVisible: true,
    });
    expect(c.kind).toBe(UNDECORATED_KINDS.REDIRECTED);
  });
});

describe("classifyUndecorated — the genuine-drift case", () => {
  it("reports drift when we are on the requested page with no redirect or wall", () => {
    const c = classifyUndecorated({
      requestedUrl: "https://claude.ai/new",
      finalUrl: "https://claude.ai/new",
      title: "Claude",
    });

    expect(c.kind).toBe(UNDECORATED_KINDS.DRIFT);
    expect(c.owner).toBe("saypi");
    expect(c.redirected).toBe(false);
    expect(c.note).toMatch(/drift/i);
  });

  it("reports drift after an in-app navigation that stays on the chat origin", () => {
    // claude.ai/new → claude.ai/chat/<uuid> is normal app behaviour, not a bounce.
    const c = classifyUndecorated({
      requestedUrl: "https://claude.ai/new",
      finalUrl: "https://claude.ai/chat/2f0c1b1e-0000-4000-8000-000000000000",
    });
    expect(c.kind).toBe(UNDECORATED_KINDS.DRIFT);
    expect(c.redirected).toBe(false);
  });

  it("does NOT let a bare sign-in affordance suppress a drift finding", () => {
    // Bias: a false "drift" costs one investigation; a false "signed out"
    // silently buries the defect class the sweep exists to find. A sign-in
    // button on the right page is a caveat in the note, not a verdict.
    const c = classifyUndecorated({
      requestedUrl: "https://chatgpt.com/",
      finalUrl: "https://chatgpt.com/",
      signInVisible: true,
    });
    expect(c.kind).toBe(UNDECORATED_KINDS.DRIFT);
    expect(c.signInAffordance).toBe(true);
    expect(c.note).toMatch(/sign-in/i); // surfaced as a caveat, so the reader can rule it out
  });
});

describe("classifyUndecorated — the signed-out boundary", () => {
  it("reads a same-origin bounce to a login route as a sign-in wall", () => {
    const c = classifyUndecorated({
      requestedUrl: "https://claude.ai/new",
      finalUrl: "https://claude.ai/login?returnTo=%2Fnew",
      signInVisible: true,
    });

    expect(c.kind).toBe(UNDECORATED_KINDS.SIGNED_OUT);
    expect(c.owner).toBe("automation");
    expect(c.redirected).toBe(false);
    expect(c.note).toContain("https://claude.ai/login?returnTo=%2Fnew");
  });

  it("recognises the other auth route shapes the hosts use", () => {
    const kinds = [
      "https://chatgpt.com/auth/login",
      "https://chatgpt.com/api/auth/signin",
      "https://pi.ai/sign-in",
    ].map((finalUrl) => classifyUndecorated({ requestedUrl: new URL(finalUrl).origin + "/", finalUrl }).kind);
    expect(kinds).toEqual([
      UNDECORATED_KINDS.SIGNED_OUT,
      UNDECORATED_KINDS.SIGNED_OUT,
      UNDECORATED_KINDS.SIGNED_OUT,
    ]);
  });

  it("treats a sign-in page title as corroboration on the requested route", () => {
    const c = classifyUndecorated({
      requestedUrl: "https://chatgpt.com/",
      finalUrl: "https://chatgpt.com/",
      title: "Log in | OpenAI",
      signInVisible: true,
    });
    expect(c.kind).toBe(UNDECORATED_KINDS.SIGNED_OUT);
  });
});

describe("classifyUndecorated — origin comparison edges", () => {
  it("does not call a cosmetic www. hop a redirect", () => {
    const c = classifyUndecorated({ requestedUrl: "https://pi.ai/talk", finalUrl: "https://www.pi.ai/talk" });
    expect(c.kind).toBe(UNDECORATED_KINDS.DRIFT);
    expect(c.redirected).toBe(false);
  });

  it("does call any other subdomain a redirect (hey.pi.ai is not pi.ai)", () => {
    expect(
      classifyUndecorated({ requestedUrl: "https://pi.ai/talk", finalUrl: "https://blog.pi.ai/" }).kind
    ).toBe(UNDECORATED_KINDS.REDIRECTED);
  });

  it("falls back to unknown — never throws — when the final URL is missing or junk", () => {
    for (const finalUrl of [undefined, "", "about:blank", "not a url"]) {
      const c = classifyUndecorated({ requestedUrl: "https://pi.ai/talk", finalUrl });
      expect(c.kind).toBe(UNDECORATED_KINDS.UNKNOWN);
      expect(c.owner).toBe("unknown");
      expect(c.note).toMatch(/screenshot/i); // tells the reader where to look instead
    }
    expect(() => classifyUndecorated()).not.toThrow();
    expect(classifyUndecorated().kind).toBe(UNDECORATED_KINDS.UNKNOWN);
  });
});

describe("SIGN_IN_PROBE", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("spots the sign-in affordances a walled host shows", () => {
    document.body.innerHTML = `
      <nav><a href="/login">Log in</a><button>Sign up</button></nav>
      <main><p>Talk to Pi</p></main>`;
    const p = SIGN_IN_PROBE();
    expect(p.visible).toBe(true);
    expect(p.labels).toContain("Log in");
    expect(p.labels).toContain("Sign up");
  });

  it("stays quiet on a normal signed-in chat app", () => {
    document.body.innerHTML = `
      <main><button>Send</button><a href="/chat/abc">Yesterday's chat</a></main>`;
    expect(SIGN_IN_PROBE().visible).toBe(false);
  });

  it("ignores long prose that merely mentions signing in", () => {
    document.body.innerHTML = `<button>You can sign in later to keep your conversation history</button>`;
    expect(SIGN_IN_PROBE().visible).toBe(false);
  });
});

describe("summarize carries the undecorated verdict + final URL", () => {
  it("surfaces finalUrl and the classification kind in the run rollup", () => {
    const s = summarize({
      host: "pi",
      url: "https://pi.ai/talk",
      finalUrl: "https://hey.pi.ai/",
      decorated: false,
      undecorated: { kind: UNDECORATED_KINDS.REDIRECTED, owner: "automation", note: "…" },
    });
    expect(s.finalUrl).toBe("https://hey.pi.ai/");
    expect(s.undecorated).toBe(UNDECORATED_KINDS.REDIRECTED);
  });

  it("leaves both null on a healthy decorated host", () => {
    const s = summarize({ host: "claude", decorated: true });
    expect(s.undecorated).toBeNull();
    expect(s.finalUrl).toBeNull();
  });
});
