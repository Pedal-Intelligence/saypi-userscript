# Wait for offscreen creation before dispatch

The release candidate's hermetic Opus-upload check exposed a startup race before
any audio was encoded: the background began creating its offscreen document,
Chrome reported that the document existed, and a concurrent VAD initialization
message reached it before its message listener was ready. Chrome rejected the
message with “Receiving end does not exist”; the call never reached transcription.

The existence query and the creation promise answer different questions. During
creation, the promise remains the readiness boundary even when `hasDocument()`
returns true. `setupOffscreenDocument` therefore waits for an ongoing creation
before treating an existing document as reusable. It checks for creation after
awaiting the existence query because another caller may begin creation during
that query. Ready documents still take the existing fast path, and the original
`finally` clears failed creation so later requests can retry.

Two deterministic tests fail on the unchanged `origin/main` code: a second caller
arriving after creation begins, and an earlier caller whose existence query
resolves after another caller begins creation. Both assert that no message is
dispatched before creation resolves. Further tests retain single creation for
simultaneous absent-document reads, recovery after failed creation, and reuse of
an already-ready document. The existing browser upload and lifecycle assertions
remain unchanged; this change neither adds retries nor extends their timeouts.

Issue: #610. No production host was exercised to reproduce this failure.
