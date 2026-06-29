import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  isFreshInstall,
  maybeOpenFirstRunTab,
  ONBOARDING_PAGE_PATH,
  ONBOARDING_SHOWN_KEY,
} from "../../src/onboarding/firstRun";

describe("isFreshInstall (#437)", () => {
  it("is true only for a fresh install", () => {
    expect(isFreshInstall("install")).toBe(true);
  });
  it("is false for browser/extension updates", () => {
    expect(isFreshInstall("update")).toBe(false);
    expect(isFreshInstall("chrome_update")).toBe(false);
    expect(isFreshInstall("browser_update")).toBe(false);
    expect(isFreshInstall("shared_module_update")).toBe(false);
    expect(isFreshInstall(undefined)).toBe(false);
  });
});

describe("maybeOpenFirstRunTab (#437)", () => {
  let store: Record<string, unknown>;
  let openTab: ReturnType<typeof vi.fn>;
  let getUrl: ReturnType<typeof vi.fn>;
  let deps: any;

  beforeEach(() => {
    store = {};
    openTab = vi.fn().mockResolvedValue(undefined);
    getUrl = vi.fn((p: string) => `chrome-extension://abc/${p}`);
    deps = {
      openTab,
      getUrl,
      storage: {
        get: vi.fn(async (k: string) => store[k]),
        set: vi.fn(async (k: string, v: unknown) => {
          store[k] = v;
        }),
      },
    };
  });

  it("opens the onboarding tab once on fresh install and records that it was shown", async () => {
    const opened = await maybeOpenFirstRunTab({ reason: "install" }, deps);

    expect(opened).toBe(true);
    expect(openTab).toHaveBeenCalledWith(`chrome-extension://abc/${ONBOARDING_PAGE_PATH}`);
    expect(store[ONBOARDING_SHOWN_KEY]).toBe(true);
  });

  it("does not open on update", async () => {
    const opened = await maybeOpenFirstRunTab({ reason: "update" }, deps);

    expect(opened).toBe(false);
    expect(openTab).not.toHaveBeenCalled();
  });

  it("does not reopen if already shown (no nag on reinstall loops)", async () => {
    store[ONBOARDING_SHOWN_KEY] = true;

    const opened = await maybeOpenFirstRunTab({ reason: "install" }, deps);

    expect(opened).toBe(false);
    expect(openTab).not.toHaveBeenCalled();
  });

  it("never lets a tab-open failure escape (install must not break)", async () => {
    openTab.mockRejectedValueOnce(new Error("no tabs api"));

    await expect(maybeOpenFirstRunTab({ reason: "install" }, deps)).resolves.toBe(false);
  });
});
