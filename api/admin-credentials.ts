// Server-side handler for Super Admin Credentials Vault updates
// Compatible with Vercel Serverless Functions and Vite dev server middleware
import { createClient } from "@supabase/supabase-js";

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

// Maps client credential fields to server environment variable names
const FIELD_TO_ENV_KEY_MAP: Record<string, string> = {
  openaiApiKey: "OPENAI_API_KEY",
  anthropicApiKey: "ANTHROPIC_API_KEY",
  resendApiKey: "RESEND_API_KEY",
  emailApiKey: "EMAIL_API_KEY",
  slackWebhookUrl: "SLACK_WEBHOOK_URL",
  discordWebhookUrl: "DISCORD_WEBHOOK_URL",
};

async function updateVercelEnvVar(
  projectId: string,
  apiToken: string,
  key: string,
  value: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `https://api.vercel.com/v10/projects/${encodeURIComponent(projectId)}/env?upsert=true`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key,
        value,
        type: "encrypted",
        target: ["production", "preview", "development"],
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, error: data?.error?.message || `HTTP ${res.status}` };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Network error" };
  }
}

export async function handleCredentialsUpdate(
  authHeader: string | undefined,
  updates: Record<string, any>
) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized: missing Bearer token");
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    "https://pmfyqcmoqrgxfplugqid.supabase.co";
  const anonKey =
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZnlxY21vcXJneGZwbHVncWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NzcyNjksImV4cCI6MjA4NjE1MzI2OX0.M5Nr7P_ahOX2NB1TzPpRkbxa9zZRoHfPQif9Eq6ZUps";

  // Create client with the caller's JWT
  const supabase = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("Unauthorized: invalid session");
  }

  // Verify role = 'admin'
  const { data: roleRow, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (roleError || !roleRow) {
    throw new Error("Forbidden: admin role required");
  }

  const vercelApiToken = process.env.VERCEL_API_TOKEN;
  const vercelProjectId = process.env.VERCEL_PROJECT_ID;

  const validUpdatedEntries = Object.entries(updates).filter(
    ([k, v]) => FIELD_TO_ENV_KEY_MAP[k] && typeof v === "string" && v.trim().length > 0
  );

  if (validUpdatedEntries.length === 0) {
    return {
      success: true,
      persisted: false,
      message: "No sensitive key modifications provided.",
    };
  }

  // If Vercel credentials are fully configured, persist directly via Vercel REST API
  if (vercelApiToken && vercelProjectId) {
    const results: Array<{ key: string; success: boolean; error?: string }> = [];

    for (const [field, val] of validUpdatedEntries) {
      const envKey = FIELD_TO_ENV_KEY_MAP[field];
      const res = await updateVercelEnvVar(vercelProjectId, vercelApiToken, envKey, (val as string).trim());
      results.push({ key: envKey, ...res });
    }

    const allSuccess = results.every((r) => r.success);

    // Record audit log entry
    try {
      await supabase.from("audit_log").insert({
        action: "credentials_vault_persisted_vercel",
        entity_type: "security",
        admin_email: user.email || "unknown",
        details: {
          target_site: "dbst",
          provider: "vercel_api",
          updated_keys: results.map((r) => r.key),
          success: allSuccess,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error("Audit log error on credentials persistence:", err);
    }

    if (allSuccess) {
      return {
        success: true,
        persisted: true,
        message: `Successfully persisted ${results.length} environment variable(s) to Vercel project settings.`,
      };
    } else {
      const failed = results.filter((r) => !r.success);
      return {
        success: false,
        persisted: false,
        message: `Failed to update some keys on Vercel: ${failed.map((f) => `${f.key} (${f.error})`).join(", ")}`,
      };
    }
  }

  // If Vercel API credentials are not set on the server, be completely honest and guide the admin
  try {
    await supabase.from("audit_log").insert({
      action: "credentials_vault_update_attempted_manual_required",
      entity_type: "security",
      admin_email: user.email || "unknown",
      details: {
        target_site: "dbst",
        attempted_fields: validUpdatedEntries.map(([k]) => FIELD_TO_ENV_KEY_MAP[k] || k),
        note: "VERCEL_API_TOKEN not set on server. Manual update in dashboard required.",
        timestamp: new Date().toISOString(),
      },
    });
  } catch {}

  return {
    success: false,
    persisted: false,
    requiresManualConfig: true,
    message:
      "Direct serverless execution cannot persist environment variables durably. To automate this, configure VERCEL_API_TOKEN and VERCEL_PROJECT_ID in your hosting environment, or rotate keys directly in the Vercel Dashboard (Project Settings → Environment Variables).",
  };
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    const body = await parseBody(req);
    const result = await handleCredentialsUpdate(authHeader, body || {});
    const status = result.success ? 200 : result.requiresManualConfig ? 200 : 400;
    return res.status(status).json(result);
  } catch (err: any) {
    console.error("API error in admin-credentials:", err?.message || err);
    const status = err.message?.includes("Forbidden")
      ? 403
      : err.message?.includes("Unauthorized")
      ? 401
      : 500;
    return res.status(status).json({ error: err.message || "Failed to update credentials" });
  }
}
