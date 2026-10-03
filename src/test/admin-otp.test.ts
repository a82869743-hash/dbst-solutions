import { describe, it, expect, afterEach } from "vitest";
import {
  hashCode,
  hashToken,
  parseDeviceLabel,
  requestOtp,
  verifyOtp,
  heartbeatSession,
  verifyAdminAuth,
  sessionStore,
  otpStore,
  bannedStore,
  setMockSupabaseClient,
} from "../../api/admin-auth";

describe("Admin Email OTP & Session Management", () => {
  const testUser = {
    userId: "test-user-unit-12345",
    email: "testadmin@dbstsolutions.com",
    ip: "127.0.0.1",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    target_site: "dbst",
  };

  afterEach(() => {
    setMockSupabaseClient(null);
    sessionStore.clear();
    otpStore.clear();
    bannedStore.clear();
  });

  it("parses user-agent devices accurately", () => {
    expect(parseDeviceLabel(testUser.userAgent)).toBe("Chrome on Windows");
    expect(
      parseDeviceLabel(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"
      )
    ).toBe("Safari on macOS");
  });

  it("generates deterministic sha-256 hashes", () => {
    const hash1 = hashCode("123456");
    const hash2 = hashCode("123456");
    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64);
  });

  it("dispatches OTP request and enforces 5 wrong attempt lockout", async () => {
    const req = await requestOtp(testUser);
    expect(req.success).toBe(true);

    // 1st wrong attempt
    const v1 = await verifyOtp({ ...testUser, code: "000000" });
    expect(v1.success).toBe(false);
    expect(v1.remainingAttempts).toBe(4);

    // 2nd wrong attempt
    const v2 = await verifyOtp({ ...testUser, code: "000001" });
    expect(v2.remainingAttempts).toBe(3);

    // 3rd wrong attempt
    const v3 = await verifyOtp({ ...testUser, code: "000002" });
    expect(v3.remainingAttempts).toBe(2);

    // 4th wrong attempt
    const v4 = await verifyOtp({ ...testUser, code: "000003" });
    expect(v4.remainingAttempts).toBe(1);

    // 5th wrong attempt -> locked
    const v5 = await verifyOtp({ ...testUser, code: "000004" });
    expect(v5.success).toBe(false);
    expect(v5.locked).toBe(true);
    expect(v5.remainingAttempts).toBe(0);

    // Subsequent attempt is still rejected
    const v6 = await verifyOtp({ ...testUser, code: "123456" });
    expect(v6.success).toBe(false);
    expect(v6.locked).toBe(true);
  });

  it("rejects expired OTP after validity window", async () => {
    await requestOtp(testUser);
    const memOtp = otpStore.get(testUser.userId);
    if (memOtp) {
      // Simulate expired timestamp (6 minutes ago)
      memOtp.expiresAt = Date.now() - 6 * 60 * 1000;
    }

    const res = await verifyOtp({ ...testUser, code: "123456" });
    expect(res.success).toBe(false);
    expect(res.expired).toBe(true);
  });

  it("verifies valid OTP, creates active session, and marks code consumed", async () => {
    await requestOtp(testUser);
    const knownCode = "654321";
    const memOtp = otpStore.get(testUser.userId);
    if (memOtp) {
      memOtp.codeHash = hashCode(knownCode);
    }

    const res = await verifyOtp({
      ...testUser,
      code: knownCode,
      refreshToken: "sample-refresh-token",
    });

    expect(res.success).toBe(true);
    expect(res.sessionId).toBeDefined();

    // Verify session was registered in active store
    const session = sessionStore.get(res.sessionId!);
    expect(session).toBeDefined();
    expect(session?.userId).toBe(testUser.userId);
    expect(session?.targetSite).toBe("dbst");

    // Code cannot be reused
    const reuseAttempt = await verifyOtp({
      ...testUser,
      code: knownCode,
    });
    expect(reuseAttempt.success).toBe(false);
  });

  it("handles heartbeat ping correctly", async () => {
    const hb = await heartbeatSession({
      sessionId: "sample-sess-id",
      userId: testUser.userId,
      email: testUser.email,
    });
    expect(hb.active).toBe(true);
  });

  describe("Server-Side Session Revocation Enforcement (verifyAdminAuth)", () => {
    const validToken = "valid-test-access-token-jwt";
    const validAdminUser = {
      id: "admin-user-uuid-999",
      email: "bimal.swaroop@gmail.com",
    };

    const createMockSupabase = (sessionData: { id: string; revoked_at?: string | null } | null) => ({
      auth: {
        getUser: async (token: string) => {
          if (token === validToken) {
            return { data: { user: validAdminUser }, error: null };
          }
          return { data: { user: null }, error: new Error("Invalid JWT") };
        },
      },
      from: (table: string) => {
        if (table === "admin_banned_users") {
          return {
            select: () => ({
              eq: () => ({
                maybeSingle: async () => ({ data: null, error: null }),
              }),
            }),
          };
        }
        if (table === "admin_active_sessions") {
          return {
            select: () => ({
              eq: (_col: string, val: string) => ({
                maybeSingle: async () => {
                  if (sessionData && sessionData.id === val) {
                    return { data: sessionData, error: null };
                  }
                  return { data: null, error: null };
                },
              }),
            }),
          };
        }
        if (table === "user_roles") {
          return {
            select: () => ({
              eq: () => ({
                eq: () => ({
                  maybeSingle: async () => ({ data: { role: "admin" }, error: null }),
                }),
              }),
            }),
          };
        }
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({ data: null, error: null }),
            }),
          }),
        };
      },
    });

    it("rejects request when session id is revoked despite valid token", async () => {
      const revokedSessionId = "revoked-sess-uuid-111";
      setMockSupabaseClient(
        createMockSupabase({
          id: revokedSessionId,
          revoked_at: new Date().toISOString(),
        })
      );

      await expect(
        verifyAdminAuth(`Bearer ${validToken}`, revokedSessionId, true)
      ).rejects.toThrow("Unauthorized: session has been revoked");
    });

    it("rejects request when session id is revoked in fallback memory store", async () => {
      const memRevokedId = "mem-revoked-sess-222";
      setMockSupabaseClient(createMockSupabase(null)); // Supabase returns null, falls back to memory

      sessionStore.set(memRevokedId, {
        id: memRevokedId,
        userId: validAdminUser.id,
        userEmail: validAdminUser.email,
        refreshTokenHash: "hash",
        deviceLabel: "Chrome on macOS",
        ipAddress: "127.0.0.1",
        targetSite: "dbst",
        createdAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString(),
        revokedAt: new Date().toISOString(),
        revokedBy: "superadmin",
      });

      await expect(
        verifyAdminAuth(`Bearer ${validToken}`, memRevokedId, true)
      ).rejects.toThrow("Unauthorized: session has been revoked");
    });

    it("allows request when session is active and unrevoked", async () => {
      const activeSessionId = "active-sess-uuid-333";
      setMockSupabaseClient(
        createMockSupabase({
          id: activeSessionId,
          revoked_at: null,
        })
      );

      const user = await verifyAdminAuth(
        `Bearer ${validToken}`,
        activeSessionId,
        true
      );
      expect(user.id).toBe(validAdminUser.id);
      expect(user.email).toBe(validAdminUser.email);
    });

    it("rejects request when session id is missing on protected endpoint", async () => {
      setMockSupabaseClient(createMockSupabase(null));

      await expect(
        verifyAdminAuth(`Bearer ${validToken}`, undefined, true)
      ).rejects.toThrow("Unauthorized: missing session identifier");
    });

    it("allows request without session id for pre-session verification flows", async () => {
      setMockSupabaseClient(createMockSupabase(null));

      const user = await verifyAdminAuth(
        `Bearer ${validToken}`,
        undefined,
        false
      );
      expect(user.id).toBe(validAdminUser.id);
    });

    it("rejects request when user is banned", async () => {
      bannedStore.set(validAdminUser.id, {
        userId: validAdminUser.id,
        userEmail: validAdminUser.email,
        bannedAt: new Date().toISOString(),
        bannedBy: "admin",
      });

      setMockSupabaseClient(createMockSupabase(null));

      await expect(
        verifyAdminAuth(`Bearer ${validToken}`, "any-sess-id", true)
      ).rejects.toThrow("Forbidden: user account has been disabled");
    });
  });
});
