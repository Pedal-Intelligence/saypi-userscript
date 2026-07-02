import { test, expect } from "../fixtures/extension";
import { getTranscribeHits, getLastAudioContentType } from "../support/dictation";

/**
 * #462 isolation guard: the mock API's transcribe state (`hits`,
 * `lastAudioContentType`) is a single per-run instance shared by every spec, so
 * without a per-test reset a bare `getTranscribeHits() > 0` assertion could be
 * satisfied by an EARLIER spec's traffic — and `getLastAudioContentType()` could
 * report an earlier spec's upload. The `context` fixture therefore resets the
 * mock's transcribe state before launching each test's browser (isolation by
 * construction: no context, no extension traffic).
 *
 * This spec proves that wiring stays in place: it generates no voice traffic of
 * its own and asserts it observes ZERO prior state. It is only a meaningful
 * guard when it runs after a traffic-generating spec — Playwright runs spec
 * files alphabetically with workers=1, so `dictation-stt.e2e.ts` (and
 * `decoration.e2e.ts`) precede it in a full-suite run. If the fixture reset is
 * ever removed, this fails loudly with the leaked hit count.
 */
test("a fresh test observes zero mock /transcribe state (per-test reset holds)", async ({
  serviceWorker,
}) => {
  const hits = await getTranscribeHits(serviceWorker);
  const lastContentType = await getLastAudioContentType(serviceWorker);

  expect(hits, "mock /transcribe hits leaked in from a previous test").toBe(0);
  expect(
    lastContentType,
    "mock lastAudioContentType leaked in from a previous test",
  ).toBeNull();
});
