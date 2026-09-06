import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect, beforeEach } from "vitest";

const recorderSrc = readFileSync(
  resolve(__dirname, "../../scripts/dom-capture/recorder.js"),
  "utf8",
);

function loadRecorder(): any {
  new Function(recorderSrc)();
  return (window as any).__domCapture;
}

/** A fresh redactor per case, so alias counters don't leak between tests. */
function redactor(options?: { redact?: boolean }) {
  return loadRecorder().createRedactor(options);
}

const PLACEHOLDER_JWT =
  "eyJhbGciOiJub25lIn0.eyJzdWIiOiJSRURBQ1RFRCIsIm5vdGUiOiJzY3J1YmJlZC1maXh0dXJlIn0.SCRUBBED";

// ---------------------------------------------------------------------------
// Secret-SHAPED inputs are BUILT here, never written as literals.
//
// A committed high-entropy string is itself a secret-scanner finding — a
// redaction test whose fixtures trip `gitleaks generic-api-key` would become
// the very thing the redactor exists to prevent, and the honest fix is to stop
// committing the string, not to widen the scanner. These builders are
// deterministic, so every case is still reproducible, and each one names the
// shape it is standing in for.
// ---------------------------------------------------------------------------

const BASE62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const HEX = "0123456789abcdef";

/** A deterministic opaque run — what a real token looks like, minus the literal. */
function opaqueToken(length: number, seed = 7, alphabet = BASE62): string {
  let out = "";
  let x = seed >>> 0;
  for (let i = 0; i < length; i++) {
    x = (Math.imul(x, 1103515245) + 12345) >>> 0;
    out += alphabet[(x >>> 16) % alphabet.length];
  }
  return out;
}

const base64url = (json: string) =>
  Buffer.from(json, "utf8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

/** A structurally real HS256 JWT: base64url header . payload . opaque signature. */
const REAL_SHAPED_JWT = [
  base64url('{"alg":"HS256","typ":"JWT"}'),
  base64url('{"sub":"1234567890","name":"Jane Doe"}'),
  opaqueToken(43, 5),
].join(".");

/** OpenAI project-key shape: a known prefix plus an opaque tail. */
const OPENAI_SHAPED_KEY = "sk-" + "proj-" + opaqueToken(38, 13);
/** A 32-char mixed-case token, the shortest run the redactor treats as a secret. */
const MIXED_TOKEN = opaqueToken(32, 7);
/** A 40-char lowercase-hex digest — the sha1/sha256 session-id shape. */
const HEX_DIGEST = opaqueToken(40, 17, HEX);
/** An opaque bearer credential (not a JWT). */
const OPAQUE_BEARER = opaqueToken(24, 3);
/** Account-id tails: long enough to clear the redactor's 16-char floor. */
const USER_ID_TAIL = opaqueToken(24, 11);
const ORG_ID_TAIL = opaqueToken(24, 29);

describe("dom recorder redaction — things it must catch", () => {
  it("replaces a JWT with the scrubbed-fixture placeholder", () => {
    const out = redactor().text(`{"accessToken":"${REAL_SHAPED_JWT}"}`);
    expect(out).not.toContain(REAL_SHAPED_JWT);
    expect(out).toBe(`{"accessToken":"${PLACEHOLDER_JWT}"}`);
  });

  it("redacts an opaque Bearer token but keeps the scheme", () => {
    expect(redactor().text(`Authorization: Bearer ${OPAQUE_BEARER}`)).toBe(
      "Authorization: Bearer REDACTED",
    );
  });

  it("redacts a Bearer JWT as a JWT (the specific rule wins over the generic one)", () => {
    expect(redactor().text(`Bearer ${REAL_SHAPED_JWT}`)).toBe(`Bearer ${PLACEHOLDER_JWT}`);
  });

  it("replaces email addresses with a fake but well-formed address", () => {
    expect(redactor().text('"email","ross.cadogan@gmail.com","plan"')).toBe(
      '"email","redacted@example.com","plan"',
    );
  });

  it("replaces long random-looking secrets", () => {
    const r = redactor();
    expect(r.text(`key=${MIXED_TOKEN}`)).toContain("REDACTED");
    expect(r.text(OPENAI_SHAPED_KEY)).toBe("REDACTED-SECRET");
  });

  it("replaces long hex digests (sha-shaped session ids)", () => {
    expect(redactor().text(`sid=${HEX_DIGEST}`)).toBe("sid=REDACTED-SECRET");
  });

  it("redacts credential-shaped URL query parameters", () => {
    expect(
      redactor().text("https://host/cb?access_token=short1&state=xyz"),
    ).toBe("https://host/cb?access_token=REDACTED&state=xyz");
  });

  it("redacts account/org identifiers using the #541 placeholder convention", () => {
    const r = redactor();
    expect(r.text(`"id","user-${USER_ID_TAIL}"`)).toBe('"id","user-REDACTED"');
    expect(r.text(`"org","org-${ORG_ID_TAIL}"`)).toBe('"org","org-REDACTED"');
  });

  it("gives distinct UUIDs distinct fake UUIDs, and repeats the same one stably", () => {
    const r = redactor();
    const a = "3f2b1c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d";
    const b = "aaaabbbb-cccc-4ddd-8eee-ffff00001111";
    expect(r.text(a)).toBe("00000000-0000-4000-8000-000000000000");
    expect(r.text(b)).toBe("00000000-0000-4000-8000-000000000001");
    // Stable within a capture: the same source UUID always maps to the same alias,
    // so a fixture keeps its "these two nodes reference the same thing" topology.
    expect(r.text(`${a} and ${b} and ${a}`)).toBe(
      "00000000-0000-4000-8000-000000000000 and " +
        "00000000-0000-4000-8000-000000000001 and " +
        "00000000-0000-4000-8000-000000000000",
    );
  });

  it("is idempotent — redacting an already-redacted string changes nothing", () => {
    const r = redactor();
    const once = r.text(`${REAL_SHAPED_JWT} ross@example.org 3f2b1c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d`);
    expect(r.text(once)).toBe(once);
  });
});

describe("dom recorder redaction — things it must NOT mangle", () => {
  it("leaves ordinary prose alone", () => {
    const prose =
      "Sure — I can help with that. Let's start by listing the three options, " +
      "then we can talk through the tradeoffs of each one.";
    expect(redactor().text(prose)).toBe(prose);
  });

  it("leaves long host selectors and identifiers alone", () => {
    const r = redactor();
    // Measured entropy 3.7-4.0: below the secret floor, so these survive intact.
    for (const id of [
      "data-messageAuthorRoleAssistantV2Container",
      "ProseMirror-focused-composer-Wrapper2",
      "reactRouterDataRouterHydrationV3Element",
      "this-is-a-fairly-long-hyphenated-slug-for-a-post",
      "SOME_VERY_LONG_UPPERCASE_CONSTANT_NAME_HERE",
    ]) {
      expect(r.text(id)).toBe(id);
    }
  });

  it("does not mangle hyphenated names that merely start with an id prefix", () => {
    // The #541 manual scrub corrupted this exact class of string.
    const r = redactor();
    expect(r.text("new-user-days-past-days")).toBe("new-user-days-past-days");
    expect(r.text("user-message-bubble")).toBe("user-message-bubble");
    expect(r.text("account-settings")).toBe("account-settings");
  });

  it("leaves short ids, numbers and timestamps alone", () => {
    const r = redactor();
    expect(r.text("conversation-turn-12")).toBe("conversation-turn-12");
    expect(r.text("2026-09-06T12:34:56.789Z")).toBe("2026-09-06T12:34:56.789Z");
  });

  it("passes through non-strings and empty strings untouched", () => {
    const r = redactor();
    expect(r.text("")).toBe("");
    expect(r.text(undefined)).toBeUndefined();
    expect(r.text(null)).toBeNull();
  });
});

describe("dom recorder redaction — credential-shaped fields", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("classifies credential field names without over-matching", () => {
    const rec = loadRecorder();
    for (const name of ["password", "api-key", "user_token", "data-session-id", "otp", "csrfToken"]) {
      expect(rec.looksCredentialish(name), name).toBe(true);
    }
    for (const name of ["username", "spinner", "data-testid", "placeholder", "aria-label", "pinned"]) {
      expect(rec.looksCredentialish(name), name).toBe(false);
    }
  });

  it("redacts the value of a type=password input regardless of shape", () => {
    const rec = loadRecorder();
    document.body.innerHTML = `<input type="password" value="hunter2">`;
    const input = document.querySelector("input")!;
    const r = rec.createRedactor();
    expect(rec.isCredentialField(input)).toBe(true);
    expect(r.attribute(input, "value", "hunter2")).toBe("REDACTED");
  });

  it("redacts the value of an input whose name suggests a credential", () => {
    const rec = loadRecorder();
    document.body.innerHTML = `<input type="text" name="apiKey" value="short">`;
    const input = document.querySelector("input")!;
    expect(rec.createRedactor().attribute(input, "value", "short")).toBe("REDACTED");
  });

  it("leaves an ordinary text input's value alone", () => {
    const rec = loadRecorder();
    document.body.innerHTML = `<input type="text" name="search" value="pasta recipes">`;
    const input = document.querySelector("input")!;
    expect(rec.createRedactor().attribute(input, "value", "pasta recipes")).toBe("pasta recipes");
  });

  it("redacts any attribute whose NAME says credential, on any element", () => {
    const rec = loadRecorder();
    document.body.innerHTML = `<div data-auth-token="abc"></div>`;
    const div = document.querySelector("div")!;
    expect(rec.createRedactor().attribute(div, "data-auth-token", "abc")).toBe("REDACTED");
  });
});

describe("dom recorder redaction — fixture integrity", () => {
  it("keeps the snapshot's HTML structure intact while scrubbing its content", () => {
    const rec = loadRecorder();
    document.body.innerHTML = `
      <div id="root" data-conversation-id="3f2b1c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d">
        <p class="msg">Signed in as ross.cadogan@gmail.com</p>
        <input type="password" name="pw" value="hunter2">
        <input type="text" name="search" value="pasta recipes">
        <a href="/c/3f2b1c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d">thread</a>
      </div>`;
    const root = document.querySelector("#root")!;
    const html = rec.createRedactor().snapshot(root);

    // Structure preserved: same tags, same count, still parseable.
    const reparsed = document.createElement("div");
    reparsed.innerHTML = html;
    expect(reparsed.querySelectorAll("*").length).toBe(root.querySelectorAll("*").length + 1);
    expect(reparsed.querySelector("p.msg")).toBeTruthy();
    expect(reparsed.querySelector('input[name="search"]')!.getAttribute("value")).toBe(
      "pasta recipes",
    );

    // Content scrubbed.
    expect(html).not.toContain("ross.cadogan@gmail.com");
    expect(html).toContain("redacted@example.com");
    expect(html).not.toContain("hunter2");
    expect(html).not.toContain("3f2b1c4d");
    // The same source UUID aliases identically in the attribute and the href,
    // so the fixture still shows they referenced one another.
    expect(html.match(/00000000-0000-4000-8000-000000000000/g)!.length).toBe(2);

    // The live page is untouched — snapshot() works on a clone.
    expect(document.querySelector('input[type="password"]')!.getAttribute("value")).toBe("hunter2");
  });
});

describe("dom recorder redaction — the opt-out", () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="root"><span>ross@example.com</span></div>`;
  });

  it("is on by default and stamps the record", () => {
    const rec = loadRecorder();
    rec.start("#root");
    const record = rec.stop();
    expect(record.redaction).toEqual({ enabled: true });
    expect(record.restingSnapshot).toContain("redacted@example.com");
    expect(record.restingSnapshot).not.toContain("ross@example.com");
  });

  it("start(sel, { redact: false }) passes content through but marks the record do-not-commit", () => {
    const rec = loadRecorder();
    const banner = rec.start("#root", { redact: false });
    const record = rec.stop();
    expect(banner).toContain("REDACTION DISABLED");
    expect(record.redaction.enabled).toBe(false);
    expect(record.redaction.warning).toMatch(/Do not commit/i);
    expect(record.restingSnapshot).toContain("ross@example.com");
  });
});
