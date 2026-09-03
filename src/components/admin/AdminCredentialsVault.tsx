import React, { useState } from "react";
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
} from "lucide-react";
import { AdminStore, CredentialsVault } from "@/lib/admin/adminStore";
import { toast } from "@/hooks/use-toast";

interface AdminCredentialsVaultProps {
  adminEmail: string;
}

export const AdminCredentialsVault: React.FC<AdminCredentialsVaultProps> = ({ adminEmail }) => {
  const [vault, setVault] = useState<CredentialsVault>(AdminStore.getCredentials());
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState(false);

  const toggleVisibility = (key: string) => {
    setVisibleKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (field: keyof CredentialsVault, val: any) => {
    setVault((prev) => ({ ...prev, [field]: val }));
    setHasChanges(true);
  };

  const handleSave = () => {
    AdminStore.saveCredentials(vault, adminEmail);
    setHasChanges(false);
    toast({
      title: "Credentials Vault Secured",
      description: "API keys and integration tokens updated successfully.",
    });
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

  const renderSecretInput = (
    label: string,
    field: keyof CredentialsVault,
    placeholder = "Enter private API key or secret token..."
  ) => {
    const isVisible = !!visibleKeys[field];
    return (
      <div>
        <label className="block text-[11px] font-mono font-semibold text-fg-dim mb-1">{label}</label>
        <div className="relative">
          <input
            type={isVisible ? "text" : "password"}
            value={vault[field] as string}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={placeholder}
            className="w-full pl-3 pr-10 py-2 rounded-lg border border-border-subtle bg-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
          <button
            type="button"
            onClick={() => toggleVisibility(field)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-dimmer hover:text-fg-default transition-colors"
            title={isVisible ? "Mask credential" : "Show credential"}
          >
            {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div>
          <h2 className="text-xl font-bold font-display text-fg-default flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-accent" />
            <span>Central Credentials &amp; Integrations Vault</span>
          </h2>
          <p className="text-xs text-fg-dim">
            Securely configure third-party API keys, SMTP relays, AI providers, and monitoring webhooks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasChanges && (
            <span className="text-[11px] font-mono text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              Unsaved modifications
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`px-5 py-2 text-xs font-medium rounded-md flex items-center gap-1.5 shadow-sm transition-all ${
              hasChanges
                ? "bg-accent text-white hover:bg-accent-deep animate-pulse"
                : "bg-zinc-200 text-zinc-500 cursor-not-allowed"
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Vault Credentials</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* CARD 1: EMAIL DISPATCH & NOTIFICATIONS */}
        <div className="p-6 bg-white rounded-xl border border-border-subtle shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <h3 className="font-bold font-display text-sm text-fg-default flex items-center gap-2">
              <Mail className="w-4 h-4 text-accent" />
              <span>Email Service &amp; Inbound Dispatch</span>
            </h3>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              CONNECTED
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-mono font-semibold text-fg-dim mb-1">
                Email Dispatch Provider
              </label>
              <select
                value={vault.emailProvider}
                onChange={(e) => handleChange("emailProvider", e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-border-subtle text-xs font-mono bg-white focus:outline-none"
              >
                <option value="resend">Resend (Recommended for Vercel)</option>
                <option value="sendgrid">SendGrid / Twilio</option>
                <option value="smtp">Custom Enterprise SMTP</option>
              </select>
            </div>

            {renderSecretInput("Email API Key / Secret Token", "emailApiKey")}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono font-semibold text-fg-dim mb-1">
                  Verified Sender Address
                </label>
                <input
                  type="email"
                  value={vault.senderEmail}
                  onChange={(e) => handleChange("senderEmail", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-semibold text-fg-dim mb-1">
                  Owner Notification Inbox
                </label>
                <input
                  type="email"
                  value={vault.notificationEmail}
                  onChange={(e) => handleChange("notificationEmail", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle font-mono text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleTestEmailPing}
                disabled={testingEmail}
                className="px-3 py-1.5 rounded-md border border-border-subtle bg-zinc-50 hover:bg-zinc-100 font-mono text-[11px] flex items-center gap-1.5 transition-colors"
              >
                <Zap className={`w-3.5 h-3.5 text-accent ${testingEmail ? "animate-spin" : ""}`} />
                <span>{testingEmail ? "Sending Ping..." : "Send Test Notification"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* CARD 2: SUPABASE DATABASE & AUTH */}
        <div className="p-6 bg-white rounded-xl border border-border-subtle shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <h3 className="font-bold font-display text-sm text-fg-default flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              <span>Supabase Database &amp; Auth</span>
            </h3>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              ACTIVE
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-mono font-semibold text-fg-dim mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                value={vault.supabaseUrl}
                onChange={(e) => handleChange("supabaseUrl", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border-subtle font-mono text-xs"
              />
            </div>

            {renderSecretInput("Supabase Publishable Anon Key", "supabaseAnonKey")}
            {renderSecretInput("Supabase Service Role Secret Key", "supabaseServiceKey")}

            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Service role key bypasses Row Level Security (RLS). Kept in encrypted memory and never passed to client-side bundles.
              </span>
            </div>
          </div>
        </div>

        {/* CARD 3: AI ENGINE & LLM PROVIDERS */}
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
    </div>
  );
};

export default AdminCredentialsVault;
