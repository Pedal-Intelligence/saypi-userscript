/**
 * DOM for the post-win micro-survey notice (#437).
 *
 * Separated from the side-effectful module so the markup + interactions are
 * unit-testable in JSDOM. One question, a 1–5 rating row, and a dismiss; a
 * separate thank-you state after submission.
 */

export const SURVEY_RATINGS = [1, 2, 3, 4, 5] as const;

export interface SurveyViewOptions {
  translate: (key: string, substitutions?: string) => string;
  onRate: (rating: number) => void;
  onDismiss: () => void;
}

/** Builds the survey prompt (question + rating buttons + dismiss) into `root`. */
export function renderSurvey(root: HTMLElement, opts: SurveyViewOptions): void {
  root.innerHTML = "";
  const t = opts.translate;

  const content = document.createElement("div");
  content.className = "saypi-survey-notice-content";

  const question = document.createElement("p");
  question.id = "saypi-survey-question";
  question.className = "saypi-survey-notice-question";
  question.textContent = t("surveyQuestion");

  const ratings = document.createElement("div");
  ratings.className = "saypi-survey-notice-ratings";
  ratings.setAttribute("role", "group");
  ratings.setAttribute("aria-label", t("surveyQuestion"));

  for (const n of SURVEY_RATINGS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "saypi-survey-notice-rating";
    btn.dataset.rating = String(n);
    btn.textContent = String(n);
    btn.setAttribute("aria-label", t("surveyRatingLabel", String(n)));
    btn.addEventListener("click", () => opts.onRate(n));
    ratings.append(btn);
  }

  const close = document.createElement("button");
  close.type = "button";
  close.className = "saypi-survey-notice-close";
  close.setAttribute("aria-label", t("dismissNotice"));
  close.textContent = "×";
  close.addEventListener("click", () => opts.onDismiss());

  content.append(question, ratings, close);
  root.append(content);
}

/** Replaces the survey with a brief thank-you acknowledgement. */
export function renderSurveyThanks(
  root: HTMLElement,
  translate: (key: string) => string
): void {
  root.innerHTML = "";
  const content = document.createElement("div");
  content.className = "saypi-survey-notice-content";
  const thanks = document.createElement("p");
  thanks.id = "saypi-survey-thanks";
  thanks.className = "saypi-survey-notice-question";
  thanks.textContent = translate("surveyThanks");
  content.append(thanks);
  root.append(content);
}
