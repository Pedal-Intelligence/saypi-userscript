import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { AboutTab } from "../../../entrypoints/settings/tabs/about";
import { ONBOARDING_LINK_ID } from "../../../src/onboarding/settingsOnboardingLink";
import { ONBOARDING_PAGE_PATH } from "../../../src/onboarding/firstRun";
import { setupChromeMock, createTestContainer, cleanupTestContainer } from "../setup";

describe("AboutTab", () => {
  let chromeMock: ReturnType<typeof setupChromeMock>;
  let container: HTMLElement;
  let tab: AboutTab;

  beforeEach(() => {
    chromeMock = setupChromeMock();
    container = createTestContainer();
    tab = new AboutTab(container);
  });

  afterEach(() => {
    tab.destroy();
    cleanupTestContainer(container);
    chromeMock.cleanup();
  });

  it("gives someone who left setup unfinished a way back to it (#613)", async () => {
    await tab.init();

    const link = container.querySelector<HTMLAnchorElement>(`#${ONBOARDING_LINK_ID}`);
    expect(link, "the About tab offers a setup-guide link").not.toBeNull();
    expect(link!.hidden).toBe(false);
    expect(link!.getAttribute("href")).toContain(ONBOARDING_PAGE_PATH);
  });
});
