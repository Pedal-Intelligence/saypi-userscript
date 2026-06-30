import { describe, it, expect } from "vitest";
import {
  detectPermissionLoss,
  buildPermissionsUrl,
  parsePermissionReason,
  REVOKED_REASON,
} from "../../src/permissions/permissionLossDetection";

describe("detectPermissionLoss (#437)", () => {
  it("is a loss when previously granted but now not granted", () => {
    expect(detectPermissionLoss(true, "denied")).toBe(true);
    expect(detectPermissionLoss(true, "prompt")).toBe(true);
  });

  it("is not a loss when still granted", () => {
    expect(detectPermissionLoss(true, "granted")).toBe(false);
  });

  it("is not a loss when never previously granted (first-time prompt)", () => {
    expect(detectPermissionLoss(false, "prompt")).toBe(false);
    expect(detectPermissionLoss(false, "denied")).toBe(false);
  });
});

describe("buildPermissionsUrl (#437)", () => {
  it("appends the revoked reason on a loss", () => {
    expect(buildPermissionsUrl("chrome-extension://x/permissions.html", true)).toBe(
      `chrome-extension://x/permissions.html?reason=${REVOKED_REASON}`
    );
  });

  it("leaves the url untouched for a first-time prompt", () => {
    expect(buildPermissionsUrl("chrome-extension://x/permissions.html", false)).toBe(
      "chrome-extension://x/permissions.html"
    );
  });
});

describe("parsePermissionReason (#437)", () => {
  it("extracts the revoked reason", () => {
    expect(parsePermissionReason("?reason=revoked")).toBe(REVOKED_REASON);
  });

  it("returns null when absent or unknown", () => {
    expect(parsePermissionReason("")).toBeNull();
    expect(parsePermissionReason("?reason=something-else")).toBeNull();
    expect(parsePermissionReason("?foo=bar")).toBeNull();
  });
});
