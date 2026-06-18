import { test, expect } from "../fixtures/extension";

/**
 * Layer 3 guard (real built CSS): the telemetry button must NOT appear on the
 * most-recent message unless that message recorded voice-turn metrics — i.e. it
 * carries the `.has-telemetry` marker (set by MessageControls when a real
 * `telemetry:updated` arrives). A non-call response (e.g. the greeting on a new
 * chat) never gets the marker, so its telemetry button stays hidden — which also
 * removes the awkward far-right positioning on the sparse greeting action bar.
 *
 * Pre-fix the show rule was `.present-messages .assistant-message:last-of-type
 * .saypi-telemetry-button:has(svg) { display:flex }` — no marker required — so a
 * last-of-type greeting showed it.
 */
test("telemetry button is hidden on the last message until it has recorded metrics (real build)", async ({
  context,
}) => {
  const page = await context.newPage();
  await page.goto("https://pi.ai/talk", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.body.classList.contains("pi"), {
    timeout: 20_000,
  });

  const result = await page.evaluate(() => {
    // The telemetry button CSS is scoped under html.desktop-view (SayPi adds this
    // on desktop; the mock host doesn't), so recreate it as pi-call-button.e2e does.
    document.documentElement.classList.add("desktop-view");

    // Build the real telemetry context: a present-messages container whose
    // last-of-type assistant message carries SayPi's controls + telemetry button.
    const history = document.createElement("div");
    history.className = "chat-history present-messages";
    const msg = document.createElement("div");
    msg.className = "assistant-message break-anywhere"; // last-of-type assistant message
    const bar = document.createElement("div");
    bar.className = "message-action-bar";
    const ctrls = document.createElement("div");
    ctrls.className = "saypi-tts-controls";
    const tel = document.createElement("button");
    tel.className = "saypi-telemetry-button";
    tel.innerHTML = '<svg viewBox="0 0 768 768"><path d="M384 96 L384 384"></path></svg>';
    ctrls.appendChild(tel);
    bar.appendChild(ctrls);
    msg.appendChild(bar);
    history.appendChild(msg);
    document.body.appendChild(history);

    // Without recorded metrics (no global marker) — must be hidden.
    const hiddenDisplay = getComputedStyle(tel).display;

    // Once a voice turn records metrics, TelemetryModule sets the global body
    // marker; the latest message's telemetry button then shows.
    document.body.classList.add("saypi-recent-telemetry");
    const shownDisplay = getComputedStyle(tel).display;

    // Clearing the marker (turn reset / route change) hides it again.
    document.body.classList.remove("saypi-recent-telemetry");
    const reHiddenDisplay = getComputedStyle(tel).display;

    return { hiddenDisplay, shownDisplay, reHiddenDisplay };
  });

  expect(
    result.hiddenDisplay,
    `telemetry button must be hidden on a non-call response (was ${result.hiddenDisplay})`
  ).toBe("none");
  expect(
    result.shownDisplay,
    "telemetry button must show on the latest message while the turn has recorded metrics"
  ).toBe("flex");
  expect(
    result.reHiddenDisplay,
    "telemetry button must hide again when the marker is cleared"
  ).toBe("none");
});
