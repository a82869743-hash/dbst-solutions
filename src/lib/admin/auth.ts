import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface ActiveSessionItem {
  id: string;
  userId: string;
  userEmail: string;
  deviceLabel: string;
  ipAddress: string;
  targetSite: string;
  createdAt: string;
  lastSeenAt: string;
  status: "Active" | "Idle";
}

export interface BannedUserItem {
  userId: string;
  userEmail: string;
  bannedAt: string;
  bannedBy: string;
  reason: string;
}

export interface MfaStatus {
  currentLevel: "aal1" | "aal2" | null;
  nextLevel: "aal1" | "aal2" | null;
  hasVerifiedFactor: boolean;
  factors: Array<{
    id: string;
    friendly_name?: string;
    factor_type: string;
    status: string;
    created_at: string;
  }>;
}

export interface TotpEnrollmentData {
  factorId: string;
  qrCode: string;
  secret: string;
  uri: string;
}

/**
 * Purges any legacy backdoor tokens, hardcoded passkeys, and plain-text credentials from browser storage.
 */
export function purgeResidualClientSecrets(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem("dbst_superadmin_session");
    sessionStorage.removeItem("dbst_admin_session_id");
    localStorage.removeItem("dbst_superadmin_credentials");
    localStorage.removeItem("dbst_superadmin_master_passkey");
  } catch {
    // Ignore storage access errors
  }
}

/**
 * Checks if a user has the 'admin' role in the public.user_roles table.
 * Single source of truth backed by RLS.
 */
export async function verifyAdminRole(userId: string): Promise<boolean> {
  if (!userId) return false;
  try {
    const { data: roleRow, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (error || !roleRow) {
      return false;
    }
    return roleRow.role === "admin";
  } catch (err) {
    console.error("Error verifying admin role:", err);
    return false;
  }
}

/**
 * Checks if a user is currently on the banned users list.
 */
export async function checkIsUserBanned(userId: string): Promise<boolean> {
  if (!userId) return false;
  try {
    const { data, error } = await supabase
      .from("admin_banned_users")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!error && data) {
      return true;
    }
  } catch {}
  return false;
}

/**
 * Fetches the currently authenticated user and verifies admin status via user_roles.
 */
export async function checkAdminUser(): Promise<{
  user: User | null;
  isAdmin: boolean;
  isBanned?: boolean;
}> {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return { user: null, isAdmin: false };
    }

    const isBanned = await checkIsUserBanned(user.id);
    if (isBanned) {
      return { user, isAdmin: false, isBanned: true };
    }

    const isAdmin = await verifyAdminRole(user.id);
    return { user, isAdmin, isBanned: false };
  } catch {
    return { user: null, isAdmin: false };
  }
}

// -----------------------------------------------------------------------------
// Email Approval 6-Digit OTP Client APIs
// -----------------------------------------------------------------------------

/**
 * Initiates an email approval 6-digit OTP dispatch to ADMIN_OTP_NOTIFY_EMAIL.
 */
export async function requestEmailOtp({
  userId,
  email,
  targetSite = "dbst",
}: {
  userId: string;
  email: string;
  targetSite?: string;
}): Promise<{
  success: boolean;
  message?: string;
  error?: string;
  banned?: boolean;
  recipientHint?: string;
}> {
  try {
    const res = await fetch("/api/admin-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "request-otp",
        userId,
        email,
        target_site: targetSite,
      }),
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("requestEmailOtp error:", err);
    return { success: false, error: err?.message || "Failed to contact OTP server" };
  }
}

/**
 * Submits the 6-digit approval code for verification and generates an active admin session.
 */
export async function verifyEmailOtp({
  userId,
  email,
  code,
  refreshToken,
  targetSite = "dbst",
}: {
  userId: string;
  email: string;
  code: string;
  refreshToken?: string;
  targetSite?: string;
}): Promise<{
  success: boolean;
  sessionId?: string;
  message?: string;
  error?: string;
  remainingAttempts?: number;
  locked?: boolean;
  banned?: boolean;
}> {
  try {
    const res = await fetch("/api/admin-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "verify-otp",
        userId,
        email,
        code,
        refreshToken,
        target_site: targetSite,
      }),
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("verifyEmailOtp error:", err);
    return { success: false, error: err?.message || "Failed to verify approval code" };
  }
}

/**
 * Periodic session heartbeat updating last_seen_at and checking revocation/ban status.
 */
export async function sendSessionHeartbeat({
  sessionId,
  userId,
  email,
}: {
  sessionId: string;
  userId?: string;
  email?: string;
}): Promise<{ active: boolean; revoked?: boolean; banned?: boolean; error?: string }> {
  try {
    const res = await fetch("/api/admin-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "heartbeat",
        sessionId,
        userId,
        email,
      }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Heartbeat ping failed:", err);
  }
  return { active: true };
}

// -----------------------------------------------------------------------------
// Active Sessions & Access Control Client APIs
// -----------------------------------------------------------------------------

export function getStoredAdminSessionId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem("dbst_admin_session_id");
  } catch {
    return null;
  }
}

export async function getAdminAuthHeaders(): Promise<Record<string, string> | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) return null;

  const sessionId = getStoredAdminSessionId();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`,
    ...(sessionId ? { "X-Admin-Session-Id": sessionId } : {}),
  };
}

/**
 * Fetches all unrevoked active sessions across properties.
 */
export async function fetchActiveSessions(): Promise<{
  success: boolean;
  sessions: ActiveSessionItem[];
  error?: string;
}> {
  try {
    const headers = await getAdminAuthHeaders();
    if (!headers) throw new Error("No active authenticated session");

    const res = await fetch("/api/admin-auth", {
      method: "POST",
      headers,
      body: JSON.stringify({ action: "list-sessions" }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to load sessions");
    return data;
  } catch (err: any) {
    console.error("fetchActiveSessions error:", err);
    return { success: false, sessions: [], error: err.message };
  }
}

/**
 * Terminates/revokes an active admin session.
 */
export async function revokeActiveSession(sessionId: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const headers = await getAdminAuthHeaders();
    if (!headers) throw new Error("No active authenticated session");

    const res = await fetch("/api/admin-auth", {
      method: "POST",
      headers,
      body: JSON.stringify({ action: "revoke-session", sessionId }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to revoke session");
    return data;
  } catch (err: any) {
    console.error("revokeActiveSession error:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Bans a user account, removes admin role, and terminates all active sessions.
 */
export async function banAdminUser(
  targetUserId: string,
  targetEmail: string,
  reason?: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const headers = await getAdminAuthHeaders();
    if (!headers) throw new Error("No active authenticated session");

    const res = await fetch("/api/admin-auth", {
      method: "POST",
      headers,
      body: JSON.stringify({
        action: "ban-user",
        targetUserId,
        targetEmail,
        reason,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to ban user");
    return data;
  } catch (err: any) {
    console.error("banAdminUser error:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Fetches the list of all banned users.
 */
export async function fetchBannedUsers(): Promise<{
  success: boolean;
  bannedUsers: BannedUserItem[];
  error?: string;
}> {
  try {
    const headers = await getAdminAuthHeaders();
    if (!headers) throw new Error("No active authenticated session");

    const res = await fetch("/api/admin-auth", {
      method: "POST",
      headers,
      body: JSON.stringify({ action: "list-banned-users" }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to load banned users");
    return data;
  } catch (err: any) {
    console.error("fetchBannedUsers error:", err);
    return { success: false, bannedUsers: [], error: err.message };
  }
}

/**
 * Unbans a user account (deletes from admin_banned_users without auto-restoring admin role).
 */
export async function unbanAdminUser(
  targetUserId: string,
  targetEmail: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const headers = await getAdminAuthHeaders();
    if (!headers) throw new Error("No active authenticated session");

    const res = await fetch("/api/admin-auth", {
      method: "POST",
      headers,
      body: JSON.stringify({
        action: "unban-user",
        targetUserId,
        targetEmail,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to unban user");
    return data;
  } catch (err: any) {
    console.error("unbanAdminUser error:", err);
    return { success: false, error: err.message };
  }
}

// -----------------------------------------------------------------------------
// Rate Limiting & Auditing
// -----------------------------------------------------------------------------

export async function checkLoginRateLimit(
  email: string
): Promise<{ allowed: boolean; remainingAttempts?: number; lockoutSeconds?: number }> {
  try {
    const res = await fetch("/api/admin-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "check-rate-limit", email }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fail open if endpoint offline
  }
  return { allowed: true };
}

export async function recordLoginAttempt(
  email: string,
  status: "success" | "failure" | "blocked",
  reason?: string,
  targetSite = "dbst"
): Promise<void> {
  try {
    await fetch("/api/admin-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "record-attempt",
        email,
        status,
        reason,
        target_site: targetSite,
      }),
    });
  } catch (err) {
    console.error("Failed to record login attempt to server:", err);
  }
}

export async function logAdminAudit(
  adminEmail: string,
  action: string,
  details: Record<string, any> = {},
  targetSite = "dbst"
): Promise<void> {
  try {
    await supabase.from("audit_log").insert({
      action,
      entity_type: "admin_action",
      admin_email: adminEmail,
      details: {
        target_site: targetSite,
        ...details,
        client_timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("Failed to insert admin audit log:", err);
  }
}

// -----------------------------------------------------------------------------
// Legacy TOTP MFA Helpers (Preserved as Optional / Reference)
// -----------------------------------------------------------------------------
export async function getMfaStatus(): Promise<MfaStatus> {
  try {
    const [aalRes, factorsRes] = await Promise.all([
      supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
      supabase.auth.mfa.listFactors(),
    ]);

    const currentLevel = (aalRes.data?.currentLevel as "aal1" | "aal2") || null;
    const nextLevel = (aalRes.data?.nextLevel as "aal1" | "aal2") || null;

    const factors = factorsRes.data?.all || [];
    const hasVerifiedFactor = factors.some(
      (f) => f.factor_type === "totp" && f.status === "verified"
    );

    return {
      currentLevel,
      nextLevel,
      hasVerifiedFactor,
      factors,
    };
  } catch (err) {
    console.error("Error getting MFA status:", err);
    return {
      currentLevel: null,
      nextLevel: null,
      hasVerifiedFactor: false,
      factors: [],
    };
  }
}

export async function enrollTotpFactor(
  friendlyName = "DBST Admin"
): Promise<{ data: TotpEnrollmentData | null; error?: string }> {
  try {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName,
    });

    if (error) {
      return { data: null, error: error.message };
    }

    if (!data?.totp) {
      return { data: null, error: "Failed to generate TOTP credentials" };
    }

    return {
      data: {
        factorId: data.id,
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
        uri: data.totp.uri,
      },
    };
  } catch (err: any) {
    return { data: null, error: err.message || "TOTP enrollment failed" };
  }
}

export async function verifyTotpCode(
  factorId: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const cleanCode = code.trim().replace(/\s+/g, "");
    const { data, error } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code: cleanCode,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: !!data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to verify code" };
  }
}

export async function unenrollTotpFactor(
  factorId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.mfa.unenroll({ factorId });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to unenroll factor" };
  }
}
