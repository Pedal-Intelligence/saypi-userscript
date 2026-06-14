/**
 * Re-runnable host-DOM recorder for Layer 4 fixture capture.
 * See doc/autonomous-dev-loop.md → "Capturing real-host DOM".
 *
 * Injected verbatim into a host page via the Claude-in-Chrome javascript_tool.
 * Installs window.__domCapture with start(rootSelector?) / stop(). Records BOTH a
 * resting snapshot AND the live MutationObserver stream, so dynamic, event-driven
 * DOM changes are captured — not just a still frame. The host DOM is a moving
 * target, not an API contract: re-run this to refresh fixtures when a host changes.
 *
 * Self-contained (no imports) so it can be eval'd in the page, and exercised
 * directly in jsdom by test/scripts/dom-capture-recorder.spec.ts.
 */
(function installDomRecorder(global) {
  const MAX_TEXT = 200;

  function summarizeNode(node) {
    if (!node) return null;
    if (node.nodeType === 3 /* TEXT_NODE */) {
      const text = (node.textContent || "").trim();
      return text ? { type: "text", text: text.slice(0, MAX_TEXT) } : null;
    }
    if (node.nodeType !== 1 /* ELEMENT_NODE */) {
      return { type: "other", nodeType: node.nodeType };
    }
    const el = node;
    const attrs = {};
    for (const attr of Array.from(el.attributes || [])) {
      // Skip class/id — surfaced separately as first-class fields.
      if (attr.name !== "class" && attr.name !== "id") attrs[attr.name] = attr.value;
    }
    // SVG elements expose an SVGAnimatedString (not a string) for className;
    // we drop their classes rather than serialize that object.
    const className = typeof el.className === "string" ? el.className : "";
    const classes = className ? className.split(/\s+/).filter(Boolean) : undefined;
    const result = { type: "element", tag: el.tagName.toLowerCase() };
    if (el.id) result.id = el.id;
    if (classes && classes.length) result.classes = classes;
    if (Object.keys(attrs).length) result.attrs = attrs;
    return result;
  }

  function buildMutationRecord(mutation, now) {
    const base = { at: now, type: mutation.type, target: summarizeNode(mutation.target) };
    if (mutation.type === "attributes") {
      base.attributeName = mutation.attributeName;
      base.value = mutation.target.getAttribute
        ? mutation.target.getAttribute(mutation.attributeName)
        : undefined;
    } else if (mutation.type === "characterData") {
      base.value = (mutation.target.textContent || "").slice(0, MAX_TEXT);
    } else if (mutation.type === "childList") {
      base.added = Array.from(mutation.addedNodes).map(summarizeNode).filter(Boolean);
      base.removed = Array.from(mutation.removedNodes).map(summarizeNode).filter(Boolean);
    }
    return base;
  }

  const api = {
    summarizeNode,
    buildMutationRecord,
    _observer: null,
    _record: null,
    start(rootSelector) {
      // Re-runnable: drop any prior session so a second start() doesn't leak an
      // observer firing into an orphaned record.
      if (this._observer) {
        this._observer.disconnect();
        this._observer = null;
        this._record = null;
      }
      const root = rootSelector ? global.document.querySelector(rootSelector) : global.document.body;
      if (!root) throw new Error(`dom-recorder: root not found: ${rootSelector}`);
      const startedAt = Date.now();
      this._record = {
        host: global.location ? global.location.host : "(unknown)",
        url: global.location ? global.location.href : "(unknown)",
        rootSelector: rootSelector || "body",
        startedAt,
        restingSnapshot: root.outerHTML,
        mutations: [],
      };
      const record = this._record;
      this._observer = new global.MutationObserver((mutations) => {
        const now = Date.now() - startedAt;
        for (const m of mutations) record.mutations.push(buildMutationRecord(m, now));
      });
      this._observer.observe(root, { subtree: true, childList: true, attributes: true, characterData: true });
      return `recording "${record.rootSelector}" on ${record.host}`;
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
