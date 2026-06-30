import { describe, it, expect, vi } from "vitest";
import { renderSurvey, renderSurveyThanks, SURVEY_RATINGS } from "../../src/onboarding/surveyView";

const translate = (k: string, sub?: string) => (sub ? `t:${k}:${sub}` : `t:${k}`);

describe("renderSurvey (#437)", () => {
  it("renders the question and a button per rating", () => {
    const root = document.createElement("div");
    renderSurvey(root, { translate, onRate: () => {}, onDismiss: () => {} });

    expect(root.querySelector("#saypi-survey-question")!.textContent).toBe("t:surveyQuestion");
    expect(root.querySelectorAll(".saypi-survey-notice-rating").length).toBe(SURVEY_RATINGS.length);
  });

  it("invokes onRate with the chosen rating", () => {
    const root = document.createElement("div");
    const onRate = vi.fn();
    renderSurvey(root, { translate, onRate, onDismiss: () => {} });

    root.querySelector<HTMLButtonElement>('[data-rating="4"]')!.click();
    expect(onRate).toHaveBeenCalledWith(4);
  });

  it("invokes onDismiss from the close button", () => {
    const root = document.createElement("div");
    const onDismiss = vi.fn();
    renderSurvey(root, { translate, onRate: () => {}, onDismiss });

    root.querySelector<HTMLButtonElement>(".saypi-survey-notice-close")!.click();
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});

describe("renderSurveyThanks (#437)", () => {
  it("replaces the survey with a thank-you", () => {
    const root = document.createElement("div");
    renderSurvey(root, { translate, onRate: () => {}, onDismiss: () => {} });
    renderSurveyThanks(root, translate);

    expect(root.querySelector(".saypi-survey-notice-rating")).toBeNull();
    expect(root.querySelector("#saypi-survey-thanks")!.textContent).toBe("t:surveyThanks");
  });
});
