import { describe, it, expect, beforeEach } from "vitest";
import { formatBuildStamp, stampBuildOnDocument, BUILD_STAMP } from "../src/build-stamp";

describe("build-stamp", () => {
  describe("formatBuildStamp", () => {
    it("includes the short sha and the build time", () => {
      const out = formatBuildStamp({ sha: "abc1234", branch: "main", time: "2026-06-16T21:00:00Z" });
      expect(out).toContain("abc1234");
      expect(out).toContain("2026-06-16T21:00:00Z");
    });

    it("appends the branch when it differs from the sha", () => {
      const out = formatBuildStamp({ sha: "abc1234", branch: "feature/x", time: "2026-06-16T21:00:00Z" });
      expect(out).toContain("feature/x");
    });

    it("collapses to the sha alone (no @branch, no trailing space) for the no-build fallback", () => {
      // The fallback BUILD_STAMP is { sha: "dev", branch: "dev", time: "" }.
      expect(formatBuildStamp({ sha: "dev", branch: "dev", time: "" })).toBe("dev");
    });
  });

  describe("stampBuildOnDocument", () => {
    beforeEach(() => {
      delete document.documentElement.dataset.saypiBuild;
    });

    it("writes the formatted stamp to documentElement.dataset.saypiBuild (readable from the page's main world)", () => {
      stampBuildOnDocument(document, { sha: "deadbee", branch: "main", time: "2026-06-16T00:00:00Z" });
      expect(document.documentElement.dataset.saypiBuild).toContain("deadbee");
    });

    it("defaults to the live document and BUILD_STAMP", () => {
      stampBuildOnDocument();
      expect(document.documentElement.dataset.saypiBuild).toBeTruthy();
    });
  });

  describe("BUILD_STAMP", () => {
    it("exposes string sha/branch/time (falls back gracefully outside a build)", () => {
      expect(typeof BUILD_STAMP.sha).toBe("string");
      expect(typeof BUILD_STAMP.branch).toBe("string");
      expect(typeof BUILD_STAMP.time).toBe("string");
    });
  });
});
