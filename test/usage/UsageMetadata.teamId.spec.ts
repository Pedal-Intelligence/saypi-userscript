import { describe, it, beforeEach, expect, vi } from "vitest";

// Stable stubs for the always-present fields so the test focuses on teamId.
vi.mock("../../src/usage/ClientIdManager", () => ({
  getClientId: vi.fn().mockResolvedValue("client-uuid"),
}));
vi.mock("../../src/usage/VersionManager", () => ({
  getExtensionVersion: vi.fn().mockReturnValue("9.9.9"),
}));
vi.mock("../../src/chatbots/ChatbotIdentifier", () => ({
  ChatbotIdentifier: { getAppId: () => "pi" },
}));
vi.mock("../../src/prefs/PreferenceModule", () => ({
  UserPreferenceModule: {
    getInstance: () => ({ getCachedLanguage: () => "en-US" }),
  },
}));

// The JWT manager is the source of teamId. We swap its claims/auth state per test.
const getClaims = vi.fn();
const isAuthenticated = vi.fn();
vi.mock("../../src/JwtManager", () => ({
  getJwtManagerSync: () => ({ getClaims, isAuthenticated }),
}));

import { buildUsageMetadata } from "../../src/usage/UsageMetadata";

describe("buildUsageMetadata — teamId attribution (#437)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("includes teamId when the user is authenticated", async () => {
    isAuthenticated.mockReturnValue(true);
    getClaims.mockReturnValue({ userId: "u1", teamId: "team-42" });

    const meta = await buildUsageMetadata();

    expect(meta.teamId).toBe("team-42");
    // existing fields still populated
    expect(meta.clientId).toBe("client-uuid");
  });

  it("omits teamId when the user is not authenticated (stays anonymous)", async () => {
    isAuthenticated.mockReturnValue(false);
    getClaims.mockReturnValue(null);

    const meta = await buildUsageMetadata();

    expect(meta.teamId).toBeUndefined();
    // anonymous device id is still sent
    expect(meta.clientId).toBe("client-uuid");
  });

  it("omits teamId when authenticated but the claim is missing/empty", async () => {
    isAuthenticated.mockReturnValue(true);
    getClaims.mockReturnValue({ userId: "u1", teamId: "" });

    const meta = await buildUsageMetadata();

    expect(meta.teamId).toBeUndefined();
  });

  it("does not throw if reading claims fails — usage metadata still builds", async () => {
    isAuthenticated.mockImplementation(() => {
      throw new Error("jwt unavailable");
    });

    const meta = await buildUsageMetadata();

    expect(meta.teamId).toBeUndefined();
    expect(meta.clientId).toBe("client-uuid");
  });
});
