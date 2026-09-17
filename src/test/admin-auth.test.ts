import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  purgeResidualClientSecrets,
  verifyAdminRole,
  checkAdminUser,
  checkLoginRateLimit,
} from "@/lib/admin/auth";
import { checkRateLimit, recordAttempt } from "../../api/admin-auth";
import { supabase } from "@/integrations/supabase/client";

describe("Admin Auth & Security Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    localStorage.clear();
  });

  describe("purgeResidualClientSecrets", () => {
    it("should completely eliminate legacy backdoor tokens and plain-text secrets from browser storage", () => {
      sessionStorage.setItem("dbst_superadmin_session", JSON.stringify({ email: "attacker@exploit.com" }));
      localStorage.setItem("dbst_superadmin_credentials", JSON.stringify({ supabaseServiceKey: "secret-key" }));
      localStorage.setItem("dbst_superadmin_master_passkey", "dbst-admin-2026");

      purgeResidualClientSecrets();

      expect(sessionStorage.getItem("dbst_superadmin_session")).toBeNull();
      expect(localStorage.getItem("dbst_superadmin_credentials")).toBeNull();
      expect(localStorage.getItem("dbst_superadmin_master_passkey")).toBeNull();
    });
  });

  describe("verifyAdminRole", () => {
    it("should return false when userId is empty", async () => {
      const result = await verifyAdminRole("");
      expect(result).toBe(false);
    });

    it("should return true when user_roles contains role = 'admin'", async () => {
      const maybeSingleMock = vi.fn().mockResolvedValue({
        data: { role: "admin" },
        error: null,
      });
      const eqRoleMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
      const eqUserMock = vi.fn().mockReturnValue({ eq: eqRoleMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqUserMock });
      vi.spyOn(supabase, "from").mockReturnValue({ select: selectMock } as any);

      const result = await verifyAdminRole("valid-admin-uuid");
      expect(result).toBe(true);
      expect(selectMock).toHaveBeenCalledWith("role");
      expect(eqUserMock).toHaveBeenCalledWith("user_id", "valid-admin-uuid");
      expect(eqRoleMock).toHaveBeenCalledWith("role", "admin");
    });

    it("should return false when user does not have admin role", async () => {
      const maybeSingleMock = vi.fn().mockResolvedValue({
        data: null,
        error: null,
      });
      const eqRoleMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
      const eqUserMock = vi.fn().mockReturnValue({ eq: eqRoleMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqUserMock });
      vi.spyOn(supabase, "from").mockReturnValue({ select: selectMock } as any);

      const result = await verifyAdminRole("regular-user-uuid");
      expect(result).toBe(false);
    });
  });

  describe("checkAdminUser", () => {
    it("should return { user: null, isAdmin: false } when unauthenticated", async () => {
      vi.spyOn(supabase.auth, "getUser").mockResolvedValue({
        data: { user: null },
        error: new Error("No session"),
      } as any);

      const res = await checkAdminUser();
      expect(res.user).toBeNull();
      expect(res.isAdmin).toBe(false);
    });

    it("should return { user, isAdmin: true } when user has verified admin role", async () => {
      const mockUser = { id: "test-admin-id", email: "admin@dbstsolutions.com" } as any;
      vi.spyOn(supabase.auth, "getUser").mockResolvedValue({
        data: { user: mockUser },
        error: null,
      } as any);

      const maybeSingleMock = vi.fn().mockResolvedValue({
        data: { role: "admin" },
        error: null,
      });
      const eqRoleMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
      const eqUserMock = vi.fn().mockReturnValue({ eq: eqRoleMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqUserMock });
      vi.spyOn(supabase, "from").mockReturnValue({ select: selectMock } as any);

      const res = await checkAdminUser();
      expect(res.user?.id).toBe("test-admin-id");
      expect(res.isAdmin).toBe(true);
    });
  });

  describe("Server Rate Limiting and Lockout (/api/admin-auth)", () => {
    it("should enforce account lockout after 5 consecutive failed attempts", async () => {
      const testIp = "192.168.1.50";
      const testEmail = "test-lockout@dbstsolutions.com";

      // 4 failures should still be allowed
      for (let i = 1; i <= 4; i++) {
        const attempt = await recordAttempt({
          ip: testIp,
          email: testEmail,
          status: "failure",
          reason: "Invalid password",
          target_site: "dbst",
        });
        expect(attempt.allowed).toBe(true);
        expect(attempt.remainingAttempts).toBe(5 - i);
      }

      // 5th failure triggers lockout
      const fifthAttempt = await recordAttempt({
        ip: testIp,
        email: testEmail,
        status: "failure",
        reason: "Invalid password",
        target_site: "dbst",
      });
      expect(fifthAttempt.allowed).toBe(false);
      expect(fifthAttempt.remainingAttempts).toBe(0);

      // Next check must report locked
      const check = await checkRateLimit(testIp, testEmail);
      expect(check.allowed).toBe(false);
      expect(check.lockoutSeconds).toBeGreaterThan(0);

      // Successful login clears failure counter
      await recordAttempt({
        ip: testIp,
        email: testEmail,
        status: "success",
        target_site: "dbst",
      });

      const resetCheck = await checkRateLimit(testIp, testEmail);
      expect(resetCheck.allowed).toBe(true);
      expect(resetCheck.remainingAttempts).toBe(5);
    });
  });
});
