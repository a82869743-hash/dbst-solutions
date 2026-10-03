// Server-side handler for Super Admin authentication, Email-Approval OTP, and Session Management
// Compatible with Vercel Serverless Functions and Vite dev server middleware
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

interface AttemptRecord {
  count: number;
  firstAttemptAt: number;
  lockedUntil?: number;
}

interface MemoryOtpRecord {
  id: string;
  userId: string;
  email: string;
  codeHash: string;
  expiresAt: number;
  attemptCount: number;
  consumedAt?: number;
}

export interface MemorySessionRecord {
  id: string;
  userId: string;
  userEmail: string;
  refreshTokenHash: string;
  deviceLabel: string;
  ipAddress: string;
  targetSite: string;
  createdAt: string;
  lastSeenAt: string;
  revokedAt?: string | null;
  revokedBy?: string | null;
}

export interface MemoryBannedRecord {
  userId: string;
  userEmail: string;
  bannedAt: string;
  bannedBy: string;
  reason?: string;
}

// In-memory fallback stores (for local dev, tests, or before migrations are applied)
export const attemptStore = new Map<string, AttemptRecord>();
export const otpStore = new Map<string, MemoryOtpRecord>();
export const sessionStore = new Map<string, MemorySessionRecord>();
export const bannedStore = new Map<string, MemoryBannedRecord>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lockout cooldown
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const OTP_MAX_ATTEMPTS = 5;

function getClientKey(ip: string, email: string): string {
  const cleanIp = (ip || "unknown").toLowerCase().trim();
  const cleanEmail = (email || "unknown").toLowerCase().trim();
  return `${cleanIp}::${cleanEmail}`;
}

export function hashCode(code: string): string {
  return crypto.createHash("sha256").update(code.trim()).digest("hex");
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token.trim()).digest("hex");
}

export function parseDeviceLabel(ua?: string): string {
  if (!ua) return "Unknown Device";
  let os = "Desktop";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Macintosh") || ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("iPhone")) os = "iOS (iPhone)";
  else if (ua.includes("iPad")) os = "iOS (iPad)";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("Linux")) os = "Linux";

  let browser = "Browser";
  if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("Chrome/")) browser = "Chrome";
  else if (ua.includes("Safari/") && !ua.includes("Chrome/")) browser = "Safari";
  else if (ua.includes("Firefox/")) browser = "Firefox";

  return `${browser} on ${os}`;
}

let mockSupabaseClient: any = null;
export function setMockSupabaseClient(client: any) {
  mockSupabaseClient = client;
}

export function getSupabaseServiceClient() {
  if (mockSupabaseClient) {
    return mockSupabaseClient;
  }
  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    "https://qffesrikwlzsmgprrczq.supabase.co";
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_KEY;

  if (serviceKey) {
    return createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return null;
}

function cleanExpiredMemoryEntries() {
  const now = Date.now();
  for (const [key, record] of attemptStore.entries()) {
    if (record.lockedUntil && record.lockedUntil < now) {
      attemptStore.delete(key);
    } else if (now - record.firstAttemptAt > WINDOW_MS && !record.lockedUntil) {
      attemptStore.delete(key);
    }
  }

  for (const [key, record] of otpStore.entries()) {
    if (record.expiresAt < now - 24 * 60 * 60 * 1000) {
      otpStore.delete(key);
    }
  }
}

// -----------------------------------------------------------------------------
// Rate Limiting (Preserved & Enhanced)
// -----------------------------------------------------------------------------
export async function checkRateLimit(ip: string, email: string) {
  const key = getClientKey(ip, email);
  const now = Date.now();
  const supabase = getSupabaseServiceClient();

  if (supabase) {
    try {
      const { data: row, error } = await supabase
        .from("admin_login_attempts")
        .select("attempt_count, first_attempt_at, locked_until")
        .eq("identifier", key)
        .maybeSingle();

      if (!error && row) {
        if (row.locked_until) {
          const lockedUntilMs = new Date(row.locked_until).getTime();
          if (lockedUntilMs > now) {
            const lockoutSeconds = Math.ceil((lockedUntilMs - now) / 1000);
            return {
              allowed: false,
              remainingAttempts: 0,
              lockoutSeconds,
              error: `Too many failed attempts. Account locked for ${lockoutSeconds} seconds.`,
            };
          }
        }

        const firstAttemptMs = new Date(row.first_attempt_at).getTime();
        if (now - firstAttemptMs > WINDOW_MS && !row.locked_until) {
          return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
        }

        const remainingAttempts = Math.max(0, MAX_ATTEMPTS - (row.attempt_count || 0));
        return {
          allowed: remainingAttempts > 0,
          remainingAttempts,
          ...(remainingAttempts === 0
            ? {
                error: "Too many failed attempts. Account temporarily locked.",
                lockoutSeconds: 900,
              }
            : {}),
        };
      }
    } catch (err) {
      console.warn("Supabase rate-limit read error, falling back to memory store:", err);
    }
  }

  cleanExpiredMemoryEntries();
  const record = attemptStore.get(key);

  if (record?.lockedUntil && record.lockedUntil > now) {
    const lockoutSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return {
      allowed: false,
      remainingAttempts: 0,
      lockoutSeconds,
      error: `Too many failed attempts. Account locked for ${lockoutSeconds} seconds.`,
    };
  }

  const count = record ? record.count : 0;
  const remainingAttempts = Math.max(0, MAX_ATTEMPTS - count);

  return {
    allowed: true,
    remainingAttempts,
  };
}

export async function recordAttempt({
  ip,
  email,
  status,
  reason,
  target_site = "dbst",
}: {
  ip: string;
  email: string;
  status: "success" | "failure" | "blocked";
  reason?: string;
  target_site?: string;
}) {
  const key = getClientKey(ip, email);
  const now = Date.now();
  const supabase = getSupabaseServiceClient();

  if (supabase) {
    try {
      if (status === "success") {
        await supabase.from("admin_login_attempts").delete().eq("identifier", key);
      } else if (status === "failure") {
        const { data: existing } = await supabase
          .from("admin_login_attempts")
          .select("attempt_count, first_attempt_at")
          .eq("identifier", key)
          .maybeSingle();

        const firstAttemptMs = existing?.first_attempt_at
          ? new Date(existing.first_attempt_at).getTime()
          : 0;

        if (existing && now - firstAttemptMs <= WINDOW_MS) {
          const newCount = (existing.attempt_count || 0) + 1;
          const lockedUntil =
            newCount >= MAX_ATTEMPTS ? new Date(now + LOCKOUT_MS).toISOString() : null;

          await supabase.from("admin_login_attempts").upsert({
            identifier: key,
            ip: ip || "unknown",
            email: email || "unknown",
            attempt_count: newCount,
            first_attempt_at: existing.first_attempt_at,
            locked_until: lockedUntil,
            updated_at: new Date().toISOString(),
          });
        } else {
          await supabase.from("admin_login_attempts").upsert({
            identifier: key,
            ip: ip || "unknown",
            email: email || "unknown",
            attempt_count: 1,
            first_attempt_at: new Date().toISOString(),
            locked_until: null,
            updated_at: new Date().toISOString(),
          });
        }
      }

      await supabase.from("audit_log").insert({
        action: `admin_login_${status}`,
        entity_type: "auth",
        admin_email: email || "unknown",
        details: {
          target_site,
          status,
          reason: reason || "",
          ip: ip || "unknown",
          timestamp: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error("Failed to update Supabase admin_login_attempts / audit_log:", err);
    }
  }

  cleanExpiredMemoryEntries();
  if (status === "success") {
    attemptStore.delete(key);
  } else if (status === "failure") {
    const record = attemptStore.get(key) || { count: 0, firstAttemptAt: now };
    record.count += 1;
    if (record.count >= MAX_ATTEMPTS) {
      record.lockedUntil = now + LOCKOUT_MS;
    }
    attemptStore.set(key, record);
  }

  const updatedCheck = await checkRateLimit(ip, email);
  return {
    success: true,
    ...updatedCheck,
  };
}

// -----------------------------------------------------------------------------
// Resend Email Dispatch for 6-Digit Approval OTP
// -----------------------------------------------------------------------------
async function sendApprovalEmail({
  code,
  userEmail,
  targetSite,
  deviceLabel,
  ip,
}: {
  code: string;
  userEmail: string;
  targetSite: string;
  deviceLabel: string;
  ip: string;
}): Promise<{ sent: boolean; error?: string }> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.ADMIN_OTP_NOTIFY_EMAIL || "bimal.swaroop@gmail.com";

  if (!resendApiKey) {
    console.warn(
      "[ADMIN_OTP] RESEND_API_KEY is not configured — skipping email dispatch. Delivery target:",
      notifyEmail
    );
    return { sent: false, error: "RESEND_API_KEY not configured on server" };
  }

  const isDbst = targetSite.toLowerCase().includes("dbst");
  const siteTitle = isDbst ? "D-BST Solutions" : "GrowthMates AI";
  const siteDomain = isDbst ? "dbstsolutions.com" : "growthmates.ai";
  const fromEmail = process.env.RESEND_FROM_EMAIL || "D-BST Admin <onboarding@resend.dev>";

  const emailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; background-color: #0E131F; color: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #1E293B;">
      <div style="padding: 24px; border-bottom: 1px solid #1E293B; background: linear-gradient(180deg, #131A29 0%, #0E131F 100%);">
        <div style="font-size: 11px; font-family: monospace; letter-spacing: 1.5px; color: #38BDF8; font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">
          SUPER ADMIN ACCESS CONTROL
        </div>
        <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #FFFFFF;">
          ${siteTitle} Login Approval Code
        </h1>
      </div>
      <div style="padding: 28px 24px;">
        <p style="margin: 0 0 18px 0; font-size: 14px; line-height: 1.5; color: #94A3B8;">
          A super admin login was initiated for account <strong style="color: #FFFFFF;">${userEmail}</strong>. Enter the following 6-digit approval code to grant control center access:
        </p>
        <div style="background-color: #171E2E; border: 1px solid #2563EB; border-radius: 10px; padding: 22px; text-align: center; margin-bottom: 24px;">
          <div style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 800; letter-spacing: 12px; color: #60A5FA;">
            ${code}
          </div>
          <div style="margin-top: 10px; font-size: 12px; color: #94A3B8;">
            ⏱ Expires in <strong>5 minutes</strong> &bull; Single-use only
          </div>
        </div>
        <div style="background-color: #131A29; border: 1px solid #1E293B; border-radius: 8px; padding: 16px; margin-bottom: 20px; font-size: 12px; font-family: monospace;">
          <div style="color: #64748B; font-weight: 700; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">
            Request Telemetry
          </div>
          <table style="width: 100%; border-collapse: collapse; color: #CBD5E1;">
            <tr>
              <td style="padding: 4px 0; color: #64748B;">Target Site:</td>
              <td style="padding: 4px 0; text-align: right; color: #38BDF8; font-weight: 600;">${siteTitle} (${siteDomain})</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748B;">Account:</td>
              <td style="padding: 4px 0; text-align: right;">${userEmail}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748B;">Device / OS:</td>
              <td style="padding: 4px 0; text-align: right;">${deviceLabel}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748B;">Client IP:</td>
              <td style="padding: 4px 0; text-align: right;">${ip}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748B;">Timestamp:</td>
              <td style="padding: 4px 0; text-align: right;">${new Date().toUTCString()}</td>
            </tr>
          </table>
        </div>
        <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #EF4444;">
          ⚠️ If you did not initiate this login, someone may be attempting unauthorized access. Revoke the session immediately from the Security &amp; Audit Trail panel.
        </p>
      </div>
      <div style="padding: 16px 24px; border-top: 1px solid #1E293B; font-size: 11px; color: #64748B; font-family: monospace; text-align: center;">
        Unified Security &bull; DBST Solutions &amp; GrowthMates AI
      </div>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [notifyEmail],
        subject: `[${targetSite.toUpperCase()}] Login Approval Code: ${code} (${userEmail})`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error("[ADMIN_OTP] Resend API error:", JSON.stringify(errData));
      return { sent: false, error: errData.message || `HTTP ${res.status}` };
    }

    return { sent: true };
  } catch (err: any) {
    console.error("[ADMIN_OTP] Email delivery failed:", err?.message || err);
    return { sent: false, error: err?.message || "Failed to send email" };
  }
}

// -----------------------------------------------------------------------------
// Unified Authentication & Session Verification Helper
// -----------------------------------------------------------------------------
export async function verifyAdminAuth(
  authHeader?: string,
  sessionId?: string,
  requireSessionId = false
) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized: missing Bearer token");
  }
  const token = authHeader.replace("Bearer ", "").trim();
  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    throw new Error("Server configuration error: Supabase service key missing");
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user) {
    throw new Error("Unauthorized: invalid session");
  }

  // 1. Ban check (reject if user account is disabled)
  const { data: banRow } = await supabase
    .from("admin_banned_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (banRow || bannedStore.has(user.id)) {
    throw new Error("Forbidden: user account has been disabled");
  }

  // 2. Session verification check — reject if this specific session was logged out or banned
  if (requireSessionId && !sessionId) {
    throw new Error("Unauthorized: missing session identifier");
  }

  if (sessionId) {
    let sessionRow: { id: string; revoked_at?: string | null } | null = null;
    try {
      const { data, error } = await supabase
        .from("admin_active_sessions")
        .select("id, revoked_at")
        .eq("id", sessionId)
        .maybeSingle();

      if (!error && data) {
        sessionRow = data;
      }
    } catch {}

    // Check memory store fallback
    if (!sessionRow) {
      const mem = sessionStore.get(sessionId);
      if (mem) {
        sessionRow = { id: mem.id, revoked_at: mem.revokedAt };
      }
    }

    if (!sessionRow || sessionRow.revoked_at) {
      throw new Error("Unauthorized: session has been revoked");
    }
  }

  // 3. Role check: ensure user has 'admin' in public.user_roles
  const { data: roleRow, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (roleError || !roleRow) {
    throw new Error("Forbidden: super admin role required");
  }

  return user;
}

// -----------------------------------------------------------------------------
// Core OTP & Session Handlers
// -----------------------------------------------------------------------------

export async function requestOtp({
  userId,
  email,
  ip,
  userAgent,
  target_site = "dbst",
}: {
  userId: string;
  email: string;
  ip: string;
  userAgent?: string;
  target_site?: string;
}) {
  const supabase = getSupabaseServiceClient();
  const cleanEmail = (email || "").toLowerCase().trim();
  const cleanUserId = userId || "";
  const now = Date.now();

  // 1. Check ban list first: if user is banned, reject immediately
  if (supabase) {
    try {
      const { data: banRow } = await supabase
        .from("admin_banned_users")
        .select("user_id, reason")
        .eq("user_id", cleanUserId)
        .maybeSingle();

      if (banRow) {
        return {
          allowed: false,
          banned: true,
          error: "This account has been disabled by an administrator. Login rejected.",
        };
      }
    } catch (e) {
      console.warn("Supabase admin_banned_users check fallback:", e);
    }
  }

  if (bannedStore.has(cleanUserId)) {
    return {
      allowed: false,
      banned: true,
      error: "This account has been disabled by an administrator. Login rejected.",
    };
  }

  // 2. Generate random 6-digit code
  const codeInt = crypto.randomInt(100000, 1000000);
  const code = codeInt.toString();
  const codeHash = hashCode(code);
  const expiresAt = new Date(now + OTP_EXPIRY_MS).toISOString();
  const deviceLabel = parseDeviceLabel(userAgent);

  // Invalidate any unconsumed codes for this user
  if (supabase) {
    try {
      await supabase
        .from("admin_login_otp")
        .update({ consumed_at: new Date().toISOString() })
        .eq("user_id", cleanUserId)
        .is("consumed_at", null);

      // Clean up old expired OTPs (where expires_at < now - 1 day)
      const cutoff = new Date(now - 24 * 60 * 60 * 1000).toISOString();
      await supabase.from("admin_login_otp").delete().lt("expires_at", cutoff);

      await supabase.from("admin_login_otp").insert({
        user_id: cleanUserId,
        code_hash: codeHash,
        expires_at: expiresAt,
        attempt_count: 0,
      });
    } catch (err) {
      console.warn("Supabase OTP storage error, using memory fallback:", err);
    }
  }

  // Memory fallback sync
  const otpId = `otp-${Date.now()}`;
  otpStore.set(cleanUserId, {
    id: otpId,
    userId: cleanUserId,
    email: cleanEmail,
    codeHash,
    expiresAt: now + OTP_EXPIRY_MS,
    attemptCount: 0,
  });

  // 3. Send email via Resend to ADMIN_OTP_NOTIFY_EMAIL
  const emailResult = await sendApprovalEmail({
    code,
    userEmail: cleanEmail,
    targetSite: target_site,
    deviceLabel,
    ip,
  });

  // Record audit log entry
  if (supabase) {
    try {
      await supabase.from("audit_log").insert({
        action: "admin_otp_requested",
        entity_type: "auth",
        admin_email: cleanEmail,
        details: {
          target_site,
          device: deviceLabel,
          ip,
          email_sent: emailResult.sent,
          timestamp: new Date().toISOString(),
        },
      });
    } catch {}
  }

  const notifyRecipient = process.env.ADMIN_OTP_NOTIFY_EMAIL || "bimal.swaroop@gmail.com";
  const maskedRecipient = notifyRecipient.replace(/^(.{2})(.*)(@.*)$/, (_, a, b, c) => `${a}${"*".repeat(Math.max(2, b.length))}${c}`);

  return {
    success: true,
    message: `A 6-digit approval code has been dispatched to ${maskedRecipient}.`,
    recipientHint: maskedRecipient,
    expiresInSeconds: 300,
  };
}

export async function verifyOtp({
  userId,
  email,
  code,
  refreshToken,
  ip,
  userAgent,
  target_site = "dbst",
}: {
  userId: string;
  email: string;
  code: string;
  refreshToken?: string;
  ip: string;
  userAgent?: string;
  target_site?: string;
}) {
  const supabase = getSupabaseServiceClient();
  const cleanEmail = (email || "").toLowerCase().trim();
  const cleanUserId = userId || "";
  const cleanCode = (code || "").trim();
  const now = Date.now();

  // 1. Check ban list first
  if (supabase) {
    try {
      const { data: banRow } = await supabase
        .from("admin_banned_users")
        .select("user_id")
        .eq("user_id", cleanUserId)
        .maybeSingle();

      if (banRow) {
        return {
          success: false,
          banned: true,
          error: "This account has been disabled by an administrator. Login rejected.",
        };
      }
    } catch {}
  }

  if (bannedStore.has(cleanUserId)) {
    return {
      success: false,
      banned: true,
      error: "This account has been disabled by an administrator. Login rejected.",
    };
  }

  // 2. Fetch pending OTP record from Supabase or fallback
  let otpRecord: { id?: string; code_hash: string; expires_at: string; attempt_count: number; consumed_at?: string | null } | null = null;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("admin_login_otp")
        .select("id, code_hash, expires_at, attempt_count, consumed_at")
        .eq("user_id", cleanUserId)
        .is("consumed_at", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        otpRecord = data;
      }
    } catch (e) {
      console.warn("Supabase OTP fetch fallback:", e);
    }
  }

  if (!otpRecord) {
    const mem = otpStore.get(cleanUserId);
    if (mem && !mem.consumedAt) {
      otpRecord = {
        id: mem.id,
        code_hash: mem.codeHash,
        expires_at: new Date(mem.expiresAt).toISOString(),
        attempt_count: mem.attemptCount,
        consumed_at: mem.consumedAt ? new Date(mem.consumedAt).toISOString() : null,
      };
    }
  }

  if (!otpRecord) {
    return {
      success: false,
      error: "No active approval code found. Please request a new code.",
    };
  }

  // Check expiration
  if (new Date(otpRecord.expires_at).getTime() < now) {
    return {
      success: false,
      expired: true,
      error: "Approval code has expired (valid for 5 minutes). Please request a fresh code.",
    };
  }

  // Check attempts
  if (otpRecord.attempt_count >= OTP_MAX_ATTEMPTS) {
    return {
      success: false,
      locked: true,
      error: "Too many failed attempts. This code is locked. Please request a new code.",
    };
  }

  // 3. Verify code match
  const inputHash = hashCode(cleanCode);
  const isMatch = inputHash === otpRecord.code_hash;

  if (!isMatch) {
    const newCount = otpRecord.attempt_count + 1;
    const remaining = Math.max(0, OTP_MAX_ATTEMPTS - newCount);

    if (supabase && otpRecord.id) {
      try {
        await supabase
          .from("admin_login_otp")
          .update({ attempt_count: newCount })
          .eq("id", otpRecord.id);

        await supabase.from("audit_log").insert({
          action: "admin_otp_failed_attempt",
          entity_type: "auth",
          admin_email: cleanEmail,
          details: {
            target_site,
            remaining_attempts: remaining,
            ip,
            timestamp: new Date().toISOString(),
          },
        });
      } catch {}
    }

    const mem = otpStore.get(cleanUserId);
    if (mem) {
      mem.attemptCount = newCount;
    }

    if (remaining === 0) {
      return {
        success: false,
        locked: true,
        remainingAttempts: 0,
        error: "Maximum attempts exceeded. This approval code is locked. Please request a new code.",
      };
    }

    return {
      success: false,
      remainingAttempts: remaining,
      error: `Incorrect approval code. ${remaining} attempt(s) remaining.`,
    };
  }

  // 4. Code verified: Mark consumed and create active session
  const consumedTime = new Date().toISOString();
  if (supabase && otpRecord.id) {
    try {
      await supabase
        .from("admin_login_otp")
        .update({ consumed_at: consumedTime })
        .eq("id", otpRecord.id);
    } catch {}
  }

  const mem = otpStore.get(cleanUserId);
  if (mem) {
    mem.consumedAt = now;
  }

  const refreshTokenHash = hashToken(refreshToken || `${cleanUserId}-${now}`);
  const deviceLabel = parseDeviceLabel(userAgent);
  let sessionId = `sess-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

  if (supabase) {
    try {
      const { data: sessionRow, error: sessionErr } = await supabase
        .from("admin_active_sessions")
        .insert({
          user_id: cleanUserId,
          user_email: cleanEmail,
          refresh_token_hash: refreshTokenHash,
          device_label: deviceLabel,
          ip_address: ip,
          target_site,
          created_at: consumedTime,
          last_seen_at: consumedTime,
        })
        .select("id")
        .single();

      if (!sessionErr && sessionRow) {
        sessionId = sessionRow.id;
      }
    } catch (e) {
      console.warn("Supabase admin_active_sessions insert fallback:", e);
    }
  }

  sessionStore.set(sessionId, {
    id: sessionId,
    userId: cleanUserId,
    userEmail: cleanEmail,
    refreshTokenHash,
    deviceLabel,
    ipAddress: ip,
    targetSite: target_site,
    createdAt: consumedTime,
    lastSeenAt: consumedTime,
  });

  // Record audit log
  if (supabase) {
    try {
      await supabase.from("audit_log").insert({
        action: "admin_login_success",
        entity_type: "auth",
        admin_email: cleanEmail,
        details: {
          auth_method: "email_approval_otp",
          session_id: sessionId,
          target_site,
          device: deviceLabel,
          ip,
          timestamp: consumedTime,
        },
      });
    } catch {}
  }

  // Clear rate limits for this client
  const clientKey = getClientKey(ip, cleanEmail);
  attemptStore.delete(clientKey);
  if (supabase) {
    try {
      await supabase.from("admin_login_attempts").delete().eq("identifier", clientKey);
    } catch {}
  }

  return {
    success: true,
    sessionId,
    message: "Email approval confirmed. Super Admin privileges unlocked.",
  };
}

// -----------------------------------------------------------------------------
// Heartbeat & Session Validation
// -----------------------------------------------------------------------------
export async function heartbeatSession({
  sessionId,
  userId,
  email,
}: {
  sessionId: string;
  userId?: string;
  email?: string;
}) {
  const supabase = getSupabaseServiceClient();
  const now = new Date().toISOString();

  // 1. Check if banned
  if (userId) {
    if (supabase) {
      try {
        const { data: banRow } = await supabase
          .from("admin_banned_users")
          .select("user_id")
          .eq("user_id", userId)
          .maybeSingle();

        if (banRow) {
          return { active: false, revoked: true, banned: true, error: "Account disabled." };
        }
      } catch {}
    }
    if (bannedStore.has(userId)) {
      return { active: false, revoked: true, banned: true, error: "Account disabled." };
    }
  }

  // 2. Check session row
  if (supabase && sessionId) {
    try {
      const { data: sessionRow, error } = await supabase
        .from("admin_active_sessions")
        .select("id, revoked_at, user_id")
        .eq("id", sessionId)
        .maybeSingle();

      if (!error && sessionRow) {
        if (sessionRow.revoked_at) {
          return { active: false, revoked: true, error: "Session has been terminated." };
        }

        // Update last_seen_at
        await supabase
          .from("admin_active_sessions")
          .update({ last_seen_at: now })
          .eq("id", sessionId);

        return { active: true, success: true };
      }
    } catch (e) {
      console.warn("Supabase heartbeat fallback:", e);
    }
  }

  const mem = sessionStore.get(sessionId);
  if (mem) {
    if (mem.revokedAt) {
      return { active: false, revoked: true, error: "Session has been terminated." };
    }
    mem.lastSeenAt = now;
    return { active: true, success: true };
  }

  return { active: true, success: true };
}

// -----------------------------------------------------------------------------
// Active Sessions Management (List, Revoke, Ban, Unban)
// Protected routes strictly require valid, unrevoked sessionId
// -----------------------------------------------------------------------------
export async function listSessions(authHeader?: string, sessionId?: string) {
  await verifyAdminAuth(authHeader, sessionId, true);
  const supabase = getSupabaseServiceClient();
  const now = Date.now();

  let sessions: any[] = [];

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("admin_active_sessions")
        .select("id, user_id, user_email, device_label, ip_address, target_site, created_at, last_seen_at, revoked_at")
        .is("revoked_at", null)
        .order("last_seen_at", { ascending: false });

      if (!error && data) {
        sessions = data;
      }
    } catch (e) {
      console.warn("Supabase list sessions fallback:", e);
    }
  }

  // Merge with memory store
  sessionStore.forEach((s) => {
    if (!s.revokedAt && !sessions.some((x) => x.id === s.id)) {
      sessions.push({
        id: s.id,
        user_id: s.userId,
        user_email: s.userEmail,
        device_label: s.deviceLabel,
        ip_address: s.ipAddress,
        target_site: s.targetSite,
        created_at: s.createdAt,
        last_seen_at: s.lastSeenAt,
      });
    }
  });

  const formatted = sessions.map((s) => {
    const lastSeenMs = new Date(s.last_seen_at).getTime();
    const isRecent = now - lastSeenMs <= 10 * 60 * 1000; // 10 minutes threshold
    return {
      id: s.id,
      userId: s.user_id,
      userEmail: s.user_email,
      deviceLabel: s.device_label || "Unknown Device",
      ipAddress: s.ip_address || "127.0.0.1",
      targetSite: s.target_site || "dbst",
      createdAt: s.created_at,
      lastSeenAt: s.last_seen_at,
      status: isRecent ? ("Active" as const) : ("Idle" as const),
    };
  });

  formatted.sort((a, b) => new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime());
  return { success: true, sessions: formatted };
}

export async function revokeSession({
  targetSessionId,
  authHeader,
  sessionId,
}: {
  targetSessionId: string;
  authHeader?: string;
  sessionId?: string;
}) {
  const adminUser = await verifyAdminAuth(authHeader, sessionId, true);
  const supabase = getSupabaseServiceClient();
  const now = new Date().toISOString();
  let targetEmail = "unknown";
  let targetUserId = "";

  if (supabase) {
    try {
      const { data: sessionRow } = await supabase
        .from("admin_active_sessions")
        .select("user_id, user_email, refresh_token_hash")
        .eq("id", targetSessionId)
        .maybeSingle();

      if (sessionRow) {
        targetEmail = sessionRow.user_email;
        targetUserId = sessionRow.user_id;
      }

      await supabase
        .from("admin_active_sessions")
        .update({
          revoked_at: now,
          revoked_by: adminUser.email || "admin",
        })
        .eq("id", targetSessionId);

      // Invalidate underlying Supabase session if targetUserId is available
      if (targetUserId) {
        try {
          await supabase.auth.admin.signOut(targetUserId);
        } catch {}
      }

      await supabase.from("audit_log").insert({
        action: "admin_session_revoked",
        entity_type: "security",
        admin_email: adminUser.email || "admin",
        details: {
          session_id: targetSessionId,
          target_email: targetEmail,
          target_user_id: targetUserId,
          revoked_by: adminUser.email,
          timestamp: now,
        },
      });
    } catch (e) {
      console.warn("Supabase revoke session fallback:", e);
    }
  }

  const mem = sessionStore.get(targetSessionId);
  if (mem) {
    mem.revokedAt = now;
    mem.revokedBy = adminUser.email || "admin";
  }

  return { success: true, message: `Session for ${targetEmail} successfully revoked.` };
}

export async function banUser({
  targetUserId,
  targetEmail,
  reason,
  authHeader,
  sessionId,
}: {
  targetUserId: string;
  targetEmail: string;
  reason?: string;
  authHeader?: string;
  sessionId?: string;
}) {
  const adminUser = await verifyAdminAuth(authHeader, sessionId, true);
  if (targetUserId === adminUser.id) {
    throw new Error("Cannot ban your own active administrator account.");
  }

  const supabase = getSupabaseServiceClient();
  const now = new Date().toISOString();
  const banReason = reason?.trim() || "Administrative security violation";

  if (supabase) {
    try {
      // 1. Insert into admin_banned_users
      await supabase.from("admin_banned_users").upsert({
        user_id: targetUserId,
        banned_at: now,
        banned_by: adminUser.email || "admin",
        reason: banReason,
      });

      // 2. Remove 'admin' role from public.user_roles
      await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", targetUserId)
        .eq("role", "admin");

      // 3. Revoke all active sessions for this user
      await supabase
        .from("admin_active_sessions")
        .update({
          revoked_at: now,
          revoked_by: adminUser.email || "admin",
        })
        .eq("user_id", targetUserId)
        .is("revoked_at", null);

      // 4. Invalidate Supabase Auth sessions
      try {
        await supabase.auth.admin.signOut(targetUserId);
      } catch {}

      // 5. Audit log
      await supabase.from("audit_log").insert({
        action: "admin_user_banned",
        entity_type: "security",
        admin_email: adminUser.email || "admin",
        details: {
          banned_user_id: targetUserId,
          banned_email: targetEmail,
          reason: banReason,
          timestamp: now,
        },
      });
    } catch (e) {
      console.warn("Supabase ban user fallback:", e);
    }
  }

  bannedStore.set(targetUserId, {
    userId: targetUserId,
    userEmail: targetEmail,
    bannedAt: now,
    bannedBy: adminUser.email || "admin",
    reason: banReason,
  });

  sessionStore.forEach((s) => {
    if (s.userId === targetUserId) {
      s.revokedAt = now;
      s.revokedBy = adminUser.email || "admin";
    }
  });

  return {
    success: true,
    message: `User ${targetEmail} has been banned and all active sessions revoked.`,
  };
}

export async function listBannedUsers(authHeader?: string, sessionId?: string) {
  await verifyAdminAuth(authHeader, sessionId, true);
  const supabase = getSupabaseServiceClient();

  let banned: any[] = [];

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("admin_banned_users")
        .select("user_id, banned_at, banned_by, reason")
        .order("banned_at", { ascending: false });

      if (!error && data) {
        banned = data;
      }
    } catch (e) {
      console.warn("Supabase list banned users fallback:", e);
    }
  }

  bannedStore.forEach((b) => {
    if (!banned.some((x) => x.user_id === b.userId)) {
      banned.push({
        user_id: b.userId,
        banned_at: b.bannedAt,
        banned_by: b.bannedBy,
        reason: b.reason,
        user_email: b.userEmail,
      });
    }
  });

  // Lookup emails from sessions or auth.users
  const userIds = banned.map((b) => b.user_id);
  const emailMap = new Map<string, string>();

  sessionStore.forEach((s) => {
    if (s.userEmail) emailMap.set(s.userId, s.userEmail);
  });

  if (supabase && userIds.length > 0) {
    try {
      const { data: sessionRows } = await supabase
        .from("admin_active_sessions")
        .select("user_id, user_email")
        .in("user_id", userIds);

      if (sessionRows) {
        sessionRows.forEach((r) => emailMap.set(r.user_id, r.user_email));
      }
    } catch {}
  }

  const formatted = banned.map((b) => ({
    userId: b.user_id,
    userEmail: emailMap.get(b.user_id) || b.user_email || "User",
    bannedAt: b.banned_at,
    bannedBy: b.banned_by,
    reason: b.reason || "Administrative restriction",
  }));

  return { success: true, bannedUsers: formatted };
}

export async function unbanUser({
  targetUserId,
  targetEmail,
  authHeader,
  sessionId,
}: {
  targetUserId: string;
  targetEmail: string;
  authHeader?: string;
  sessionId?: string;
}) {
  const adminUser = await verifyAdminAuth(authHeader, sessionId, true);
  const supabase = getSupabaseServiceClient();
  const now = new Date().toISOString();

  if (supabase) {
    try {
      await supabase.from("admin_banned_users").delete().eq("user_id", targetUserId);

      await supabase.from("audit_log").insert({
        action: "admin_user_unbanned",
        entity_type: "security",
        admin_email: adminUser.email || "admin",
        details: {
          unbanned_user_id: targetUserId,
          target_email: targetEmail,
          note: "Unbanned by admin. Admin role was NOT automatically restored.",
          timestamp: now,
        },
      });
    } catch (e) {
      console.warn("Supabase unban user fallback:", e);
    }
  }

  bannedStore.delete(targetUserId);

  return {
    success: true,
    message: `User ${targetEmail} unbanned. (Admin role must be re-granted separately).`,
  };
}

// -----------------------------------------------------------------------------
// Request Body Parser & HTTP Handler
// -----------------------------------------------------------------------------
function parseBody(req: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk: any) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
    req.on("error", reject);
  });
}

export default async function handler(req: any, res: any) {
  // Ensure response helpers are present in raw Node / Vite dev server middleware
  if (typeof res.status !== "function") {
    res.status = function (statusCode: number) {
      res.statusCode = statusCode;
      return res;
    };
  }
  if (typeof res.json !== "function") {
    res.json = function (data: any) {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(data));
      return res;
    };
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const forwarded = req.headers["x-forwarded-for"];
  const ip =
    (typeof forwarded === "string" ? forwarded.split(",")[0] : req.socket?.remoteAddress) ||
    "127.0.0.1";
  const userAgent = req.headers["user-agent"] || "";
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  const rawSessionId =
    req.headers["x-admin-session-id"] ||
    req.headers["x-admin-session-id".toLowerCase()];
  const sessionIdHeader = typeof rawSessionId === "string" ? rawSessionId.trim() : undefined;

  try {
    const body = await parseBody(req);
    const { action, email, userId, code, refreshToken, status, reason, target_site, sessionId: bodySessionId, targetUserId, targetEmail } = body || {};
    const callerSessionId = sessionIdHeader || (typeof bodySessionId === "string" && !["revoke-session"].includes(action) ? bodySessionId : undefined);

    // 1. Rate Limiting
    if (action === "check-rate-limit") {
      const result = await checkRateLimit(ip, email || "");
      return res.status(200).json(result);
    }

    if (action === "record-attempt") {
      const result = await recordAttempt({
        ip,
        email: email || "",
        status: status || "failure",
        reason,
        target_site: target_site || "dbst",
      });
      return res.status(200).json(result);
    }

    // 2. Request 6-digit OTP
    if (action === "request-otp") {
      const result = await requestOtp({
        userId: userId || "",
        email: email || "",
        ip,
        userAgent,
        target_site: target_site || "dbst",
      });
      const statusCode = result.banned ? 403 : result.success ? 200 : 400;
      return res.status(statusCode).json(result);
    }

    // 3. Verify 6-digit OTP
    if (action === "verify-otp") {
      const result = await verifyOtp({
        userId: userId || "",
        email: email || "",
        code: code || "",
        refreshToken,
        ip,
        userAgent,
        target_site: target_site || "dbst",
      });
      const statusCode = result.banned ? 403 : result.success ? 200 : 400;
      return res.status(statusCode).json(result);
    }

    // 4. Heartbeat
    if (action === "heartbeat") {
      const result = await heartbeatSession({
        sessionId: callerSessionId || bodySessionId || "",
        userId: userId || "",
        email: email || "",
      });
      return res.status(200).json(result);
    }

    // 5. Active Sessions List (Protected: requires valid caller session)
    if (action === "list-sessions") {
      const result = await listSessions(authHeader, callerSessionId);
      return res.status(200).json(result);
    }

    // 6. Revoke Session (Protected: requires valid caller session)
    if (action === "revoke-session") {
      const targetSessionId = bodySessionId || body?.targetSessionId || "";
      const result = await revokeSession({
        targetSessionId,
        authHeader,
        sessionId: callerSessionId,
      });
      return res.status(200).json(result);
    }

    // 7. Ban User (Protected: requires valid caller session)
    if (action === "ban-user") {
      const result = await banUser({
        targetUserId: targetUserId || "",
        targetEmail: targetEmail || "User",
        reason,
        authHeader,
        sessionId: callerSessionId,
      });
      return res.status(200).json(result);
    }

    // 8. List Banned Users (Protected: requires valid caller session)
    if (action === "list-banned-users") {
      const result = await listBannedUsers(authHeader, callerSessionId);
      return res.status(200).json(result);
    }

    // 9. Unban User (Protected: requires valid caller session)
    if (action === "unban-user") {
      const result = await unbanUser({
        targetUserId: targetUserId || "",
        targetEmail: targetEmail || "User",
        authHeader,
        sessionId: callerSessionId,
      });
      return res.status(200).json(result);
    }

    return res.status(400).json({ error: `Unknown action '${action}'` });
  } catch (err: any) {
    console.error("API error in admin-auth:", err?.message || err);
    const status = err.message?.includes("Forbidden")
      ? 403
      : err.message?.includes("Unauthorized")
      ? 401
      : 500;
    return res.status(status).json({ error: err?.message || "Internal server error" });
  }
}
