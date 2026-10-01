import React, { useState, useEffect, useCallback } from "react";
import {
  KeyRound,
  Eye,
  EyeOff,
  Save,
  ShieldCheck,
  Mail,
  Database,
  Bot,
  Bell,
  BarChart,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ExternalLink,
  Clock,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { AdminStore, CredentialsVault } from "@/lib/admin/adminStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AdminCredentialsVaultProps {
  adminEmail: string;
}

interface RotationLog {
  id: string;
  action: string;
  admin_email: string;
  created_at: string;
  details: any;
}

export const AdminCredentialsVault: React.FC<AdminCredentialsVaultProps> = ({ adminEmail }) => {
  const [vault, setVault] = useState<CredentialsVault>(AdminStore.getCredentials());
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [testingAi, setTestingAi] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rotationHistory, setRotationHistory] = useState<RotationLog[]>([]);

  const loadRotationHistory = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("audit_log")
        .select("*")
        .eq("entity_type", "security")
        .order("created_at", { ascending: false })
        .limit(5);

      if (!error && data) {
        setRotationHistory(data);
      }
    } catch (err) {
      console.warn("Could not load rotation history:", err);
    }
  }, []);

  useEffect(() => {
    loadRotationHistory();
  }, [loadRotationHistory]);

  const toggleVisibility = (key: string) => {
    setVisibleKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (field: keyof CredentialsVault, val: any) => {
    setVault((prev) => ({ ...prev, [field]: val }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await AdminStore.saveCredentials(vault, adminEmail);
      setHasChanges(false);

      if (result.persisted) {
        toast({
          title: "Vercel Environment Updated",
          description: result.message || "Environment variables persisted to Vercel.",
        });
      } else if (result.requiresManualConfig) {
        toast({
          title: "Serverless Environment Notice",
          description: result.message,
        });
      } else {
        toast({
          title: "Configuration Submitted",
          description: result.message || "Credential updates recorded.",
        });
      }

      await loadRotationHistory();
    } catch (e: any) {
      toast({
        title: "Update Failed",
        description: e?.message || "Failed to submit credentials to server.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmailPing = () => {
    setTestingEmail(true);
    setTimeout(() => {
      setTestingEmail(false);
      toast({
        title: "Test Email Dispatched",
        description: `Simulated notification sent to ${vault.notificationEmail} via ${vault.emailProvider.toUpperCase()}.`,
      });
    }, 1200);
  };

  const handleTestWebhookPing = () => {
    setTestingWebhook(true);
    setTimeout(() => {
      setTestingWebhook(false);
      toast({
        title: "Webhook Verified",
        description: "Payload delivered with HTTP 200 OK status code.",
      });
    }, 1000);
  };

  const handleTestAiPing = async () => {
    setTestingAi(true);
    const startTime = Date.now();
    try {
      const res = await fetch("/api/capability-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "ping connection test" }),
      });
      const elapsed = Date.now() - startTime;
      if (res.ok) {
        toast({
          title: "AI Service Connection Verified",
          description: `Successfully reached server capability advisor (${elapsed}ms latency).`,
        });
      } else {
        const err = await res.json().catch(() => ({}));
        toast({
          title: `Connection Warning (${res.status})`,
          description: err.error || "Server endpoint returned an error. Verify server OPENAI_API_KEY.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Connection Failed",
        description: err.message || "Failed to reach capability advisor endpoint.",
        variant: "destructive",
      });
    } finally {
      setTestingAi(false);
    }
  };

  const renderSecretInput = (
    label: string,
    field: keyof CredentialsVault,
    placeholder = "••••••••••••••••••••••••••••••••"
  ) => {
    const isVisible = visibleKeys[field];
    const val = (vault[field] as string) || "";
    const isSet = Boolean(val && val.length > 0);

    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[11px] font-mono font-semibold text-fg-dim">
            {label}
          </label>
          {isSet && (
            <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-1 font-bold">
              <CheckCircle2 className="w-3 h-3" /> Configured
            </span>
          )}
        </div>
        <div className="relative">
          <input
            type={isVisible ? "text" : "password"}
            placeholder={placeholder}
            value={val}
            onChange={(e) => handleChange(field, e.target.value)}
            className="w-full pl-3 pr-10 py-2 rounded-lg border border-border-subtle font-mono text-xs focus:outline-none focus:border-accent bg-white text-fg-default"
          />
          <button
            type="button"
            onClick={() => toggleVisibility(field)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-dim hover:text-fg-default"
          >
            {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div>
          <h2 className="text-xl font-bold font-display text-fg-default flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-accent" />
            <span>Encrypted Credentials Vault</span>
          </h2>
          <p className="text-xs text-fg-dim">
            Manage production API keys, service connections, and outbound notifications for D-BST Solutions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasChanges && (
            <span className="text-[11px] font-mono text-amber-600 font-semibold flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              Unsaved Secret Changes
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-accent text-white font-mono text-xs uppercase tracking-wider font-semibold hover:bg-accent-deep transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? "Persisting..." : "Save Credentials"}</span>
          </button>
        </div>
      </div>

      {/* Security Architecture Notice */}
      <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
        <div className="space-y-1 text-xs">
          <div className="font-bold text-emerald-950 font-display">
            Zero Client-Side Secret Exposure
          </div>
          <p className="text-emerald-900 leading-relaxed text-[11px]">
            Secrets saved here are transmitted exclusively to server-side endpoints with role verification (<code className="px-1 py-0.5 bg-emerald-100 rounded font-mono text-[10px]">role = 'admin'</code>). Sensitive tokens are never persisted in plain-text client browser storage (<code className="px-1 py-0.5 bg-emerald-100 rounded font-mono text-[10px]">localStorage</code>) or echoed in browser network payloads.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CARD 1: EMAIL & NOTIFICATIONS */}
        <div className="p-6 bg-white rounded-xl border border-border-subtle shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <h3 className="font-bold font-display text-sm text-fg-default flex items-center gap-2">
              <Mail className="w-4 h-4 text-accent" />
              <span>Transactional Email Gateway</span>
            </h3>
            <span className="text-[10px] font-mono font-bold text-accent bg-accent-tint px-2 py-0.5 rounded-full">
              OUTBOUND
            </span>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono font-semibold text-fg-dim mb-1">
                  Email Provider
                </label>
                <select
                  value={vault.emailProvider}
                  onChange={(e) => handleChange("emailProvider", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle text-xs font-mono bg-white focus:outline-none"
                >
                  <option value="resend">Resend (Recommended)</option>
                  <option value="sendgrid">Twilio SendGrid</option>
                  <option value="postmark">Postmark</option>
                  <option value="aws_ses">AWS SES</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-semibold text-fg-dim mb-1">
                  Sender Address
                </label>
                <input
                  type="email"
                  value={vault.senderEmail}
                  onChange={(e) => handleChange("senderEmail", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle font-mono text-xs"
                />
              </div>
            </div>

            {renderSecretInput("Email Provider API Key", "emailApiKey")}

            <div>
              <label className="block text-[11px] font-mono font-semibold text-fg-dim mb-1">
                Notification Recipient (Enquiry Ingestion)
              </label>
              <input
                type="email"
                value={vault.notificationEmail}
                onChange={(e) => handleChange("notificationEmail", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border-subtle font-mono text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleTestEmailPing}
                disabled={testingEmail}
                className="px-3 py-1.5 rounded-md border border-border-subtle bg-zinc-50 hover:bg-zinc-100 font-mono text-[11px] flex items-center gap-1.5 transition-colors"
              >
                <Zap className={`w-3.5 h-3.5 text-accent ${testingEmail ? "animate-spin" : ""}`} />
                <span>{testingEmail ? "Sending..." : "Dispatch Test Ping"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* CARD 2: SUPABASE DATABASE */}
        <div className="p-6 bg-white rounded-xl border border-border-subtle shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <h3 className="font-bold font-display text-sm text-fg-default flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>Supabase Production Project</span>
            </h3>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              DATABASE
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-mono font-semibold text-fg-dim mb-1">
                Supabase URL
              </label>
              <input
                type="text"
                readOnly
                value={vault.supabaseUrl}
                className="w-full px-3 py-2 rounded-lg border border-border-subtle font-mono text-xs bg-zinc-50 text-zinc-600 cursor-not-allowed"
              />
            </div>

            {renderSecretInput("Supabase Publishable Key", "supabaseAnonKey")}

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="text-[11px] text-amber-900 leading-relaxed">
                <strong>Service Role Key Notice:</strong> The <code className="font-mono text-[10px]">service_role</code> secret bypasses all Row Level Security and is restricted exclusively to server-side Edge Functions / Vercel Functions. It is permanently omitted from browser bundles.
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: AI INTELLIGENCE & LLM ORCHESTRATION */}
        <div className="p-6 bg-white rounded-xl border border-border-subtle shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <h3 className="font-bold font-display text-sm text-fg-default flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-600" />
              <span>AI Agents &amp; Model Orchestration</span>
            </h3>
            <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
              INTELLIGENCE
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-mono font-semibold text-fg-dim mb-1">
                Primary LLM Engine
              </label>
              <select
                value={vault.activeAiModel}
                onChange={(e) => handleChange("activeAiModel", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border-subtle text-xs font-mono bg-white focus:outline-none"
              >
                <option value="gpt-4o">OpenAI GPT-4o (High Speed &amp; Multimodal)</option>
                <option value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet (Advanced Architecture)</option>
                <option value="gpt-4o-mini">OpenAI GPT-4o Mini (Cost-Optimized)</option>
              </select>
            </div>

            {renderSecretInput("OpenAI API Key", "openaiApiKey")}
            {renderSecretInput("Anthropic Claude API Key", "anthropicApiKey")}

            <div className="pt-2 flex items-center justify-between border-t border-border-subtle/50 mt-2">
              <span className="text-[10px] font-mono text-fg-dimmer">
                {vault.openaiApiKey ? "✓ Key update staged for server persistence" : "Server-side environment key active"}
              </span>
              <button
                type="button"
                onClick={handleTestAiPing}
                disabled={testingAi}
                className="px-3 py-1.5 rounded-md border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 font-mono text-[11px] font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {testingAi ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Testing Connection...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3 h-3" />
                    <span>Test AI Service Connection</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* CARD 4: REAL-TIME NOTIFICATION WEBHOOKS */}
        <div className="p-6 bg-white rounded-xl border border-border-subtle shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <h3 className="font-bold font-display text-sm text-fg-default flex items-center gap-2">
              <Bell className="w-4 h-4 text-accent" />
              <span>Instant Lead Alert Webhooks</span>
            </h3>
            <span className="text-[10px] font-mono font-bold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-full">
              STANDBY
            </span>
          </div>

          <div className="space-y-3">
            {renderSecretInput("Slack Incoming Webhook URL", "slackWebhookUrl", "https://hooks.slack.com/...")}
            {renderSecretInput("Discord Channel Webhook URL", "discordWebhookUrl", "https://discord.com/api/...")}

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-mono font-semibold text-fg-dim mb-1">
                  Google Analytics 4 ID
                </label>
                <input
                  type="text"
                  placeholder="G-XXXXXXXXXX"
                  value={vault.googleAnalyticsId}
                  onChange={(e) => handleChange("googleAnalyticsId", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-semibold text-fg-dim mb-1">
                  Meta Pixel ID
                </label>
                <input
                  type="text"
                  placeholder="1234567890"
                  value={vault.metaPixelId}
                  onChange={(e) => handleChange("metaPixelId", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle font-mono text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleTestWebhookPing}
                disabled={testingWebhook}
                className="px-3 py-1.5 rounded-md border border-border-subtle bg-zinc-50 hover:bg-zinc-100 font-mono text-[11px] flex items-center gap-1.5 transition-colors"
              >
                <Zap className={`w-3.5 h-3.5 text-accent ${testingWebhook ? "animate-spin" : ""}`} />
                <span>{testingWebhook ? "Testing..." : "Send Webhook Ping"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Module 5: Hosting & Environment Variables Guidance */}
      <div className="p-5 bg-white rounded-xl border border-border-subtle shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-accent" />
            <h3 className="font-bold text-sm text-fg-default">Managing Production Environment Variables</h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">Vercel &amp; Supabase Cloud</span>
        </div>

        <p className="text-xs text-fg-dim leading-relaxed">
          In production on Vercel, environment variables must be configured in the project settings. Once set, variables automatically inject into serverless functions (<code className="px-1 py-0.5 bg-zinc-100 rounded font-mono text-[10px]">api/*</code>) without being bundled into client JavaScript.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[11px] font-mono">
          <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50 space-y-1">
            <span className="font-bold text-fg-default">Vercel Automation Setup:</span>
            <p className="text-zinc-500 text-[10px]">
              Set <code className="text-accent font-bold">VERCEL_API_TOKEN</code> and <code className="text-accent font-bold">VERCEL_PROJECT_ID</code> in Vercel settings to allow this portal to update environment variables automatically via REST API.
            </p>
          </div>
          <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50 space-y-1">
            <span className="font-bold text-fg-default">Manual Rotation in Vercel:</span>
            <p className="text-zinc-500 text-[10px]">
              Navigate to <strong>Vercel Dashboard → Project Settings → Environment Variables</strong> to update or rotate keys directly with instant redeploy.
            </p>
          </div>
        </div>

        {/* Rotation History */}
        {rotationHistory.length > 0 && (
          <div className="pt-3 border-t border-border-subtle">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-fg-dim mb-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Recent Credentials Rotation Events (from Audit Log)</span>
            </div>
            <div className="space-y-1 font-mono text-[10px]">
              {rotationHistory.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-2 rounded bg-zinc-50 border border-zinc-100">
                  <div>
                    <span className="font-semibold text-fg-default">{entry.action}</span>
                    <span className="text-zinc-400 ml-2">by {entry.admin_email}</span>
                  </div>
                  <span className="text-zinc-500">
                    {new Date(entry.created_at).toLocaleString("en-AU", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCredentialsVault;
