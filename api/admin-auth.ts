// Server-side handler for Super Admin authentication rate limiting and audit logging
// Compatible with Vercel Serverless Functions and Vite dev server middleware
import { createClient } from "@supabase/supabase-js";

interface AttemptRecord {
  count: number;
  firstAttemptAt: number;
  lockedUntil?: number;
}

// In-memory fallback sliding window cache (for dev/tests without Supabase service key)
const attemptStore = new Map<string, AttemptRecord>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lockout cooldown

function getClientKey(ip: string, email: string): string {
  const cleanIp = (ip || "unknown").toLowerCase().trim();
  const cleanEmail = (email || "unknown").toLowerCase().trim();
  return `${cleanIp}::${cleanEmail}`;
}

function getSupabaseServiceClient() {
  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY;

  if (serviceKey) {
    if (!supabaseUrl) {
      throw new Error(
        "Missing SUPABASE_URL or VITE_SUPABASE_URL environment variable."
      );
    }
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
}

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
        // Check if currently locked out
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

        // Check if window has expired
        const firstAttemptMs = new Date(row.first_attempt_at).getTime();
        if (now - firstAttemptMs > WINDOW_MS && !row.locked_until) {
          // Window expired, allowed with full attempts
          return {
            allowed: true,
            remainingAttempts: MAX_ATTEMPTS,
          };
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

  // Memory fallback
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

  // 1. Update durable Supabase store if service role key available
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

      // Write to audit_log
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
  } else {
    // Log for server observability
    console.log(
      `[ADMIN_AUTH_AUDIT] ${status.toUpperCase()} | email: ${email} | ip: ${ip} | site: ${target_site} | reason: ${reason || "none"}`
    );
  }

  // 2. Synchronize memory store for local consistency
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
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const forwarded = req.headers["x-forwarded-for"];
  const ip =
    (typeof forwarded === "string" ? forwarded.split(",")[0] : req.socket?.remoteAddress) ||
    "127.0.0.1";

  try {
    const body = await parseBody(req);
    const { action, email, status, reason, target_site = "dbst" } = body || {};

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
        target_site,
      });
      return res.status(200).json(result);
    }

    return res.status(400).json({ error: "Unknown action" });
  } catch (err: any) {
    console.error("API error in admin-auth:", err?.message || err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
