/**
 * Whether a Pi route change is a navigation AWAY from the current conversation
 * (new chat, or switching to a different thread) — as opposed to the current
 * conversation simply being assigned its thread id when the first message is sent
 * (`/talk` -> `/talk/<id>`).
 *
 * This matters for telemetry: we reset the current-turn telemetry on real
 * navigation, but must NOT reset on thread-creation — otherwise the first voice
 * turn of a new chat has its just-recorded metrics wiped the moment pi.ai swaps
 * `/talk` for `/talk/<newId>`, so its telemetry button never appears (it only
 * shows from the second turn on).
 *
 * @param oldPath previous URL pathname (e.g. "/talk" or "/talk/abc")
 * @param newPath new URL pathname
 */
export function isPiNavigationAwayFromConversation(
  oldPath: string,
  newPath: string
): boolean {
  const threadId = (p: string): string | null => {
    const m = p.match(/^\/talk\/([^/?#]+)/);
    return m ? m[1] : null;
  };
  const oldId = threadId(oldPath);
  const newId = threadId(newPath);
  if (newId === null) return true; // -> new chat (/talk) or a non-thread page
  if (oldId === null) return false; // /talk -> /talk/<id> = current thread just created
  return newId !== oldId; // switched to a different existing thread
}
