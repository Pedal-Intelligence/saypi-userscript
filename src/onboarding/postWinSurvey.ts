/**
 * Gate for the one-time post-win micro-survey (#437).
 *
 * Shown once, after the user has had a few successful spoken exchanges (a
 * "clearly good conversation", per the week-1 design) — deliberately later than
 * the first-exchange speed-payoff notice so the two don't stack. Only for
 * authenticated users, since the feedback sink derives identity from the JWT.
 */

/** Successful exchanges before the survey is offered. */
export const SURVEY_MIN_INTERACTIONS = 3;

export interface SurveyInputs {
  surveyShown: boolean;
  interactionCount: number;
  authenticated: boolean;
}

export function decideSurvey(s: SurveyInputs): boolean {
  return (
    !s.surveyShown &&
    s.authenticated &&
    s.interactionCount >= SURVEY_MIN_INTERACTIONS
  );
}
