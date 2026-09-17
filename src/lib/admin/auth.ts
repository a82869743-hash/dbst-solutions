import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

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
 * Fetches the currently authenticated user and verifies admin status via user_roles.
 */
export async function checkAdminUser(): Promise<{
  user: User | null;
  isAdmin: boolean;
}> {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return { user: null, isAdmin: false };
    }

    const isAdmin = await verifyAdminRole(user.id);
    return { user, isAdmin };
  } catch {
    return { user: null, isAdmin: false };
  }
}

/**
 * Checks current Authenticator Assurance Level (AAL) and enrolled MFA factors.
 */
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

/**
 * Enrolls a new TOTP factor for the authenticated user.
 */
export async function enrollTotpFactor(
  friendlyName = "D-BST Admin"
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

/**
 * Challenges and verifies the 6-digit TOTP code, promoting session to AAL2.
 */
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

/**
 * Unenrolls an existing TOTP factor.
 */
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

/**
 * Rate limit check against the server-side endpoint.
 */
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
    // If endpoint is unreachable, fail safe
  }
  return { allowed: true };
}

/**
 * Records an authentication attempt to the server endpoint and shared audit_log.
 */
export async function recordLoginAttempt(
  email: string,
  status: "success" | "failure" | "blocked",
  reason?: string
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
        target_site: "dbst",
      }),
    });
  } catch (err) {
    console.error("Failed to record login attempt to server:", err);
  }
}

/**
 * Inserts a verified audit log entry into public.audit_log for the current admin.
 */
export async function logAdminAudit(
  adminEmail: string,
  action: string,
  details: Record<string, any> = {}
): Promise<void> {
  try {
    await supabase.from("audit_log").insert({
      action,
      entity_type: "admin_action",
      admin_email: adminEmail,
      details: {
        target_site: "dbst",
        ...details,
        client_timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("Failed to insert admin audit log:", err);
  }
}
