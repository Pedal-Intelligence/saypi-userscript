/**
 * Re-runnable host-DOM recorder for Layer 4 fixture capture.
 * See doc/autonomous-dev-loop.md → "Capturing real-host DOM".
 *
 * Injected verbatim into a host page via the Claude-in-Chrome javascript_tool.
 * Installs window.__domCapture with start(rootSelector?, options?) / stop().
 * Records BOTH a resting snapshot AND the live MutationObserver stream, so
 * dynamic, event-driven DOM changes are captured — not just a still frame. The
 * host DOM is a moving target, not an API contract: re-run this to refresh
 * fixtures when a host changes.
 *
 * Captures are taken from pages the founder is signed into, so every point where
 * host content is copied runs through capture-time redaction (issue #552). It is
 * ON by default; `start(sel, { redact: false })` opts out and the resulting
 * record is stamped `redaction.enabled === false` — such a record must NEVER be
 * committed.
 *
 * Self-contained (no imports) so it can be eval'd in the page, and exercised
 * directly in jsdom by test/scripts/dom-capture-recorder.spec.ts and
 * test/scripts/dom-capture-redaction.spec.ts.
 */
(function installDomRecorder(global) {
  const MAX_TEXT = 200;

  // ==========================================================================
  // Capture-time redaction (#552)
  //
  // A heuristic safety net, not a guarantee. It replaces credential- and
  // identity-shaped substrings with stable, obviously-fake markers so a fixture
  // keeps its shape (same HTML structure, same distinct-identifier topology)
  // while carrying nothing that authenticates or identifies anyone.
  // ==========================================================================

  // The exact placeholder minted by the PR #541 fixture scrub, so redacted
  // captures reuse a token the secret scanner already knows is fake:
  //   header {"alg":"none"} / payload {"sub":"REDACTED","note":"scrubbed-fixture"}
  const PLACEHOLDER_JWT =
    "eyJhbGciOiJub25lIn0.eyJzdWIiOiJSRURBQ1RFRCIsIm5vdGUiOiJzY3J1YmJlZC1maXh0dXJlIn0.SCRUBBED";
  const PLACEHOLDER_EMAIL = "redacted@example.com";
  const PLACEHOLDER_SECRET = "REDACTED-SECRET";
  const PLACEHOLDER_VALUE = "REDACTED";

  // Sentinel used to park a replacement so a later, broader rule cannot re-match
  // a marker this same pass just inserted. U+0001 never occurs in host DOM text
  // and is not in any of the character classes below.
  const HOLD = String.fromCharCode(1);

  // Three-part (or unsigned two-part) base64url JWTs. `eyJ` is base64url for '{"'.
  const JWT_RE = /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}(?:\.[A-Za-z0-9_-]*)?/g;
  // Authorization-header shapes: `Bearer <opaque>`, `Basic <base64>`.
  const AUTH_SCHEME_RE = /\b(Bearer|Basic|Token)\s+[A-Za-z0-9._~+/=-]{8,}/gi;
  const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g;
  const UUID_RE =
    /\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/g;
  // Account/tenant/device ids: a known prefix plus a long opaque tail. The 16-char
  // floor is deliberate — a shorter one mangles ordinary hyphenated identifiers
  // such as "new-user-days-past-days" (a real casualty of the #541 manual scrub).
  const ACCOUNT_ID_RE =
    /\b(user|org|acct|account|customer|cust|team|workspace|device|session)([-_])([A-Za-z0-9]{16,})\b/gi;
  // `?access_token=…` / `&api_key=…` style query parameters.
  const CREDENTIAL_PARAM_RE =
    /\b([A-Za-z0-9_-]*(?:token|secret|password|passwd|apikey|api_key|auth|session|signature)[A-Za-z0-9_-]*)=([A-Za-z0-9._~+/%-]{6,})/gi;
  // Fallback: long opaque runs. Filtered by isLikelySecretRun() below.
  const LONG_SECRET_RE = /[A-Za-z0-9_-]{32,}/g;

  // Attribute/field names that mean "this value is a credential", matched on
  // word segments so "spinner" does not look like a PIN and "user" does not look
  // like a password.
  const CREDENTIAL_WORDS = [
    "password", "passwd", "pwd", "passphrase", "secret", "token", "jwt",
    "apikey", "auth", "authorization", "credential", "credentials", "otp",
    "totp", "mfa", "cvv", "cvc", "ssn", "pin", "session", "sessionid", "sid",
    "csrf", "nonce", "signature", "bearer",
  ];
  const CREDENTIAL_JOINED_RE =
    /(password|passphrase|apikey|accesstoken|refreshtoken|idtoken|authtoken|sessiontoken|secretkey|privatekey|clientsecret|cardnumber|securitycode)/;

  function looksCredentialish(name) {
    if (!name) return false;
    // Split on separators AND camelCase humps, so "csrfToken" and "data-csrf-token"
    // classify alike. Whole-word matching is what keeps "spinner" from looking
    // like a PIN and "username" from looking like a password.
    const parts = String(name)
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean);
    for (const part of parts) {
      if (CREDENTIAL_WORDS.indexOf(part) !== -1) return true;
    }
    return CREDENTIAL_JOINED_RE.test(parts.join(""));
  }

  const FIELD_HINT_ATTRS = [
    "name", "id", "autocomplete", "placeholder", "aria-label", "data-testid",
  ];

  /** True for an <input>/<textarea> whose type or naming says "credential". */
  function isCredentialField(el) {
    if (!el || !el.tagName) return false;
    const tag = el.tagName.toLowerCase();
    if (tag !== "input" && tag !== "textarea") return false;
    const type = ((el.getAttribute && el.getAttribute("type")) || "").toLowerCase();
    if (type === "password") return true;
    for (const attr of FIELD_HINT_ATTRS) {
      const value = el.getAttribute ? el.getAttribute(attr) : null;
      if (value && looksCredentialish(value)) return true;
    }
    return false;
  }

  function shannonEntropy(text) {
    const counts = Object.create(null);
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      counts[ch] = (counts[ch] || 0) + 1;
    }
    let bits = 0;
    for (const ch in counts) {
      const p = counts[ch] / text.length;
      bits -= p * (Math.log(p) / Math.LN2);
    }
    return bits;
  }

  /**
   * Does a long opaque run look random rather than like content?
   *
   * Long lowercase hex is taken as a digest/session id outright. Otherwise the
   * run must use all three character classes AND clear an entropy floor of 4.2
   * bits/char. That floor is measured, not guessed: real 32+ char tokens score
   * 4.6–5.4 ("AbCd1234EfGh5678IjKl9012MnOp3456" = 4.63, an sk-proj key = 5.35),
   * while the long mixed-case host identifiers a capture must preserve score
   * 3.7–4.0 ("ProseMirror-focused-composer-Wrapper2" = 3.71,
   * "data-messageAuthorRoleAssistantV2Container" = 4.00). A lower floor mangles
   * host selectors, which is the failure mode that makes a fixture lie.
   */
  const SECRET_ENTROPY_FLOOR = 4.2;

  function isLikelySecretRun(run) {
    if (run.length < 32) return false;
    if (/^[0-9a-fA-F]{32,}$/.test(run)) return true;
    if (!/[a-z]/.test(run) || !/[A-Z]/.test(run) || !/[0-9]/.test(run)) return false;
    return shannonEntropy(run) >= SECRET_ENTROPY_FLOOR;
  }

  /**
   * Build a redactor with its own alias table. Identifier-shaped values (UUIDs,
   * account ids) get *numbered* fake markers so a capture keeps the distinctness
   * that makes it useful as a fixture — two different message UUIDs stay two
   * different (fake) UUIDs. Credential-shaped values collapse to one marker,
   * because a fixture never needs to tell two secrets apart.
   */
  function createRedactor(options) {
    const enabled = !options || options.redact !== false;
    const aliases = new Map();
    const counters = Object.create(null);
    // Markers this redactor has already minted. Re-redacting an output must be a
    // no-op, so an alias-shaped input is passed straight through rather than
    // being handed a second alias.
    const minted = new Set();

    function alias(kind, value, make) {
      if (minted.has(value)) return value;
      const key = kind + String.fromCharCode(0) + value;
      if (aliases.has(key)) return aliases.get(key);
      const index = counters[kind] || 0;
      counters[kind] = index + 1;
      const marker = make(index);
      aliases.set(key, marker);
      minted.add(marker);
      return marker;
    }

    /** Redact a scalar of host content. */
    function text(value) {
      if (!enabled || typeof value !== "string" || value === "") return value;
      const held = [];
      const hold = (marker) => {
        held.push(marker);
        return HOLD + (held.length - 1) + HOLD;
      };

      let out = value;
      out = out.replace(JWT_RE, () => hold(PLACEHOLDER_JWT));
      out = out.replace(AUTH_SCHEME_RE, (_m, scheme) => hold(scheme + " " + PLACEHOLDER_VALUE));
      out = out.replace(EMAIL_RE, () => hold(PLACEHOLDER_EMAIL));
      out = out.replace(UUID_RE, (m) =>
        hold(
          alias(
            "uuid",
            m.toLowerCase(),
            (n) => "00000000-0000-4000-8000-" + String(n).padStart(12, "0"),
          ),
        ),
      );
      out = out.replace(ACCOUNT_ID_RE, (_m, prefix, sep, tail) =>
        hold(
          alias(
            "account:" + prefix.toLowerCase(),
            tail,
            (n) => prefix + sep + PLACEHOLDER_VALUE + (n ? String(n) : ""),
          ),
        ),
      );
      out = out.replace(CREDENTIAL_PARAM_RE, (_m, key) => hold(key + "=" + PLACEHOLDER_VALUE));
      out = out.replace(LONG_SECRET_RE, (m) =>
        isLikelySecretRun(m) ? hold(PLACEHOLDER_SECRET) : m,
      );

      const restore = new RegExp(HOLD + "(\\d+)" + HOLD, "g");
      return out.replace(restore, (_m, i) => held[Number(i)]);
    }

    /** Redact one attribute value, using the owning element for field context. */
    function attribute(el, name, value) {
      if (!enabled) return value;
      if (looksCredentialish(name)) return PLACEHOLDER_VALUE;
      if (name && name.toLowerCase() === "value" && isCredentialField(el)) {
        return PLACEHOLDER_VALUE;
      }
      return text(value);
    }

    /**
     * Serialize an element for the resting snapshot. Works on a clone so live
     * credential fields can be emptied before serialization without touching the
     * host page; the resulting HTML then goes through text() like any scalar.
     */
    function snapshot(root) {
      if (!enabled) return root.outerHTML;
      const clone = root.cloneNode(true);
      const elements = [clone];
      if (clone.querySelectorAll) {
        for (const el of Array.from(clone.querySelectorAll("*"))) elements.push(el);
      }
      for (const el of elements) {
        if (!el.attributes) continue;
        const credentialField = isCredentialField(el);
        for (const attr of Array.from(el.attributes)) {
          if (looksCredentialish(attr.name)) {
            el.setAttribute(attr.name, PLACEHOLDER_VALUE);
          } else if (credentialField && attr.name.toLowerCase() === "value") {
            el.setAttribute(attr.name, PLACEHOLDER_VALUE);
          }
        }
        if (credentialField && el.tagName.toLowerCase() === "textarea") {
          el.textContent = PLACEHOLDER_VALUE;
        }
      }
      return text(clone.outerHTML);
    }

    return { enabled, text, attribute, snapshot };
  }

  // The redactor in force between start() and stop(). summarizeNode() is also
  // callable standalone (tests, ad-hoc probing), so there is always one active.
  let redactor = createRedactor();

  function summarizeNode(node) {
    if (!node) return null;
    if (node.nodeType === 3 /* TEXT_NODE */) {
      const text = redactor.text((node.textContent || "").trim());
      return text ? { type: "text", text: text.slice(0, MAX_TEXT) } : null;
    }
    if (node.nodeType !== 1 /* ELEMENT_NODE */) {
      return { type: "other", nodeType: node.nodeType };
    }
    const el = node;
    const attrs = {};
    for (const attr of Array.from(el.attributes || [])) {
      // Skip class/id — surfaced separately as first-class fields.
      if (attr.name !== "class" && attr.name !== "id") {
        attrs[attr.name] = redactor.attribute(el, attr.name, attr.value);
      }
    }
    // SVG elements expose an SVGAnimatedString (not a string) for className;
    // we drop their classes rather than serialize that object.
    const className = typeof el.className === "string" ? el.className : "";
    const classes = className ? className.split(/\s+/).filter(Boolean) : undefined;
    const result = { type: "element", tag: el.tagName.toLowerCase() };
    if (el.id) result.id = redactor.text(el.id);
    if (classes && classes.length) result.classes = classes;
    if (Object.keys(attrs).length) result.attrs = attrs;
    return result;
  }

  function buildMutationRecord(mutation, now) {
    const base = { at: now, type: mutation.type, target: summarizeNode(mutation.target) };
    if (mutation.type === "attributes") {
      base.attributeName = mutation.attributeName;
      const raw = mutation.target.getAttribute
        ? mutation.target.getAttribute(mutation.attributeName)
        : undefined;
      base.value =
        typeof raw === "string"
          ? redactor.attribute(mutation.target, mutation.attributeName, raw)
          : raw;
    } else if (mutation.type === "characterData") {
      base.value = redactor.text(mutation.target.textContent || "").slice(0, MAX_TEXT);
    } else if (mutation.type === "childList") {
      base.added = Array.from(mutation.addedNodes).map(summarizeNode).filter(Boolean);
      base.removed = Array.from(mutation.removedNodes).map(summarizeNode).filter(Boolean);
    }
    return base;
  }

  const api = {
    summarizeNode,
    buildMutationRecord,
    createRedactor,
    looksCredentialish,
    isCredentialField,
    _observer: null,
    _record: null,
    /**
     * @param {string} [rootSelector] tight selector for the subtree to record.
     * @param {{redact?: boolean}} [options] `{ redact: false }` disables
     *   capture-time redaction. Debug-only: the record is stamped
     *   `redaction.enabled === false` and must never be committed.
     */
    start(rootSelector, options) {
      // Re-runnable: drop any prior session so a second start() doesn't leak an
      // observer firing into an orphaned record.
      if (this._observer) {
        this._observer.disconnect();
        this._observer = null;
        this._record = null;
      }
      const root = rootSelector ? global.document.querySelector(rootSelector) : global.document.body;
      if (!root) throw new Error(`dom-recorder: root not found: ${rootSelector}`);
      redactor = createRedactor(options);
      const startedAt = Date.now();
      this._record = {
        host: global.location ? redactor.text(global.location.host) : "(unknown)",
        url: global.location ? redactor.text(global.location.href) : "(unknown)",
        rootSelector: rootSelector || "body",
        startedAt,
        redaction: redactor.enabled
          ? { enabled: true }
          : {
              enabled: false,
              warning:
                "UNREDACTED CAPTURE — may contain live tokens, emails and account ids. Do not commit.",
            },
        restingSnapshot: redactor.snapshot(root),
        mutations: [],
      };
      const record = this._record;
      this._observer = new global.MutationObserver((mutations) => {
        const now = Date.now() - startedAt;
        for (const m of mutations) record.mutations.push(buildMutationRecord(m, now));
      });
      this._observer.observe(root, { subtree: true, childList: true, attributes: true, characterData: true });
      return `recording "${record.rootSelector}" on ${record.host}${
        redactor.enabled ? "" : " (REDACTION DISABLED — do not commit)"
      }`;
    },
    stop() {
      if (!this._record && !this._observer) {
        throw new Error("dom-recorder: not recording (call start() first)");
      }
      if (this._observer) this._observer.disconnect();
      this._observer = null;
      const record = this._record;
      this._record = null;
      return record;
    },
  };

  global.__domCapture = api;
  return api;
})(typeof window !== "undefined" ? window : globalThis);
