/**
 * Post-win survey feedback payload (#437).
 *
 * Builds the JSON body for the saypi-saas feedback sink. The contract is fixed
 * (saypi-saas#202/#214): Bearer-JWT authed; teamId/userId are derived from the
 * verified token server-side, so the client never sends teamId. Pure + tested.
 */

export const FEEDBACK_URL = "https://www.saypi.ai/api/feedback";
export const POST_WIN_SOURCE = "extension_post_win";

export interface PostWinFeedbackInput {
  /** CSAT/NPS-style score; clamped to the 0-10 contract range. */
  rating?: number;
  message?: string;
  app?: string;
  version?: string;
  clientId?: string;
  metadata?: Record<string, unknown>;
}

export interface FeedbackBody {
  source: string;
  rating?: number;
  message?: string;
  app?: string;
  version?: string;
  clientId?: string;
  metadata?: Record<string, unknown>;
}

export function buildPostWinFeedback(input: PostWinFeedbackInput): FeedbackBody {
  const body: FeedbackBody = { source: POST_WIN_SOURCE };

  if (typeof input.rating === "number" && isFinite(input.rating)) {
    body.rating = Math.min(10, Math.max(0, Math.round(input.rating)));
  }

  const message = input.message?.trim();
  if (message) body.message = message.slice(0, 4000);

  if (input.app) body.app = String(input.app).toLowerCase();
  if (input.version) body.version = input.version;
  if (input.clientId) body.clientId = input.clientId;
  if (input.metadata && Object.keys(input.metadata).length > 0) {
    body.metadata = input.metadata;
  }

  return body;
}
