import EventBus from "../../events/EventBus";

/**
 * Tracks which ChatGPT assistant messages were already on screen when the current
 * voice call started, so auto-read-aloud can tell a *genuinely new* reply (which
 * should be read aloud — #200/#408) apart from a *pre-existing* message (which must
 * stay silent — #245).
 *
 * Why a call-start snapshot instead of the streaming flag alone: new replies are
 * normally marked `data-saypi-unread` while they stream in under our chat-history
 * observer. But on a brand-new chat the chat-history container is only discovered
 * by the progressive backoff search *after* the reply has finished streaming and
 * the SPA has route-changed to `/c/<id>`. The reply is then decorated through the
 * old-message path, which never sets that flag, so every auto-click path skips it
 * as "already read". The decoration path can't distinguish new from old in that
 * race; "was this turn present when the call started" can.
 *
 * Identity is the turn's `data-turn-id` — the same id `ChatGPTResponse.messageId`
 * uses — because it survives ChatGPT's React node replacements (an element-identity
 * snapshot would treat a re-rendered existing message as new and re-read it).
 */
let presentAtCallStart: Set<string> | null = null;
// The thread the call was placed in, or null if it began on a new chat / project
// page (where the conversation only gets its `/c/<id>` once the first reply arrives).
let callStartThreadId: string | null = null;
let trackingRegistered = false;

/** The `/c/<id>` thread id in a ChatGPT path (also matches `/g/.../c/<id>`), or null. */
function threadIdFromPath(pathname: string): string | null {
  const match = pathname.match(/\/c\/([^/?#]+)/);
  return match ? match[1] : null;
}

/**
 * Snapshot the turn ids currently in the DOM. Called when a call starts; on a
 * brand-new chat this captures nothing, so the first reply is correctly "new".
 */
export function captureMessagesPresentAtCallStart(
  root: ParentNode = document,
  pathname: string = window.location.pathname
): void {
  const ids = new Set<string>();
  root.querySelectorAll("[data-turn-id]").forEach((el) => {
    const id = el.getAttribute("data-turn-id")?.trim();
    if (id) ids.add(id);
  });
  presentAtCallStart = ids;
  callStartThreadId = threadIdFromPath(pathname);
}

/** Drop the snapshot. Called when a call ends so stale state can't read messages. */
export function clearMessagesPresentAtCallStart(): void {
  presentAtCallStart = null;
  callStartThreadId = null;
}

/**
 * True only when a call is active (a snapshot exists) and this turn was NOT present
 * when the call started. Without a snapshot, or without a usable id, returns false
 * — staying silent rather than risk re-reading an existing message (#245).
 *
 * Also returns false once the user has navigated to a DIFFERENT existing thread than
 * the one the call began in: that thread's messages predate the call and would
 * otherwise be re-read (a #245-style regression). The new-chat → `/c/<id>` and
 * project → thread transitions are exempt because the call began with no thread id.
 */
export function isMessageNewSinceCallStart(
  turnId: string | null | undefined,
  pathname: string = window.location.pathname
): boolean {
  if (!presentAtCallStart) return false;
  if (callStartThreadId !== null && threadIdFromPath(pathname) !== callStartThreadId) {
    return false;
  }
  const id = turnId?.trim();
  if (!id) return false;
  return !presentAtCallStart.has(id);
}

/** Idempotently wire the snapshot to the call lifecycle. */
export function initCallStartTracking(): void {
  if (trackingRegistered) return;
  trackingRegistered = true;
  EventBus.on("session:started", () => captureMessagesPresentAtCallStart());
  EventBus.on("session:ended", () => clearMessagesPresentAtCallStart());
}
