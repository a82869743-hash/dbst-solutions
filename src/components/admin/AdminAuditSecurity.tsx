import React, { useState, useEffect, useCallback } from "react";
import {
  ShieldCheck,
  Lock,
  Clock,
  UserCheck,
  FileText,
  Trash2,
  Download,
  AlertCircle,
  Key,
  Smartphone,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { AdminStore, AuditLogEntry } from "@/lib/admin/adminStore";
import { getMfaStatus, unenrollTotpFactor, MfaStatus } from "@/lib/admin/auth";
import { toast } from "@/hooks/use-toast";

interface AdminAuditSecurityProps {
  adminEmail: string;
  onLogout: () => void;
}

export const AdminAuditSecurity: React.FC<AdminAuditSecurityProps> = ({
  adminEmail,
  onLogout,
}) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [mfaStatus, setMfaStatus] = useState<MfaStatus | null>(null);
  const [loadingMfa, setLoadingMfa] = useState(true);
  const [unrolling, setUnrolling] = useState(false);

  const loadAuditLogs = useCallback(async () => {
    setLoadingLogs(true);
    try {
      const data = await AdminStore.fetchAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setLoadingLogs(false);
    }
  }, []);

  const loadMfa = useCallback(async () => {
    setLoadingMfa(true);
    try {
      const status = await getMfaStatus();
      setMfaStatus(status);
    } catch (err) {
      console.error("Failed to load MFA status:", err);
    } finally {
      setLoadingMfa(false);
    }
  }, []);

  useEffect(() => {
    loadAuditLogs();
    loadMfa();
  }, [loadAuditLogs, loadMfa]);

  const handleUnenrollMfa = async (factorId: string) => {
    if (!window.confirm("Are you sure you want to reset your TOTP 2FA enrollment? You will be prompted to enroll again on your next login.")) {
      return;
    }
    setUnrolling(true);
    try {
      const { success, error } = await unenrollTotpFactor(factorId);
      if (!success) throw new Error(error || "Failed to unenroll factor");
      toast({
        title: "TOTP 2FA Reset",
        description: "Factor removed. You will be required to re-enroll on next authentication.",
      });
      await loadMfa();
      await AdminStore.logAction(adminEmail, "Unenrolled TOTP 2FA factor", "dbst");
      await loadAuditLogs();
    } catch (err: any) {
      toast({
        title: "Unenroll Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setUnrolling(false);
    }
  };

  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `dbst_audit_log_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchor.click();
    toast({ title: "Audit Log Downloaded", description: "Exported chronological audit trail JSON." });
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div>
          <h2 className="text-xl font-bold font-display text-fg-default flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-accent" />
            <span>Security, Access &amp; Audit Trail</span>
          </h2>
          <p className="text-xs text-fg-dim">
            Review live Supabase authentication assurance levels, TOTP 2FA enforcement, and cross-site audit trails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              loadAuditLogs();
              loadMfa();
            }}
            className="px-3 py-1.5 text-xs font-mono font-medium rounded-md border border-border-subtle bg-white hover:bg-zinc-50 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingLogs ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-1.5 text-xs font-mono font-medium rounded-md border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
          >
            Sign Out of Super Admin
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Active Session Details */}
        <div className="p-5 bg-white rounded-xl border border-border-subtle shadow-xs space-y-3">
          <div className="text-[11px] font-mono font-bold uppercase text-fg-dim">Authenticated Session</div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-tint flex items-center justify-center text-accent font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-fg-default">{adminEmail}</div>
              <div className="text-[10px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>ROLE: SUPER ADMIN</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-border-subtle text-[11px] space-y-1.5 text-fg-dim">
            <div className="flex justify-between">
              <span>Assurance Level:</span>
              <span className="text-fg-default font-mono font-bold text-emerald-700">
                {mfaStatus?.currentLevel ? mfaStatus.currentLevel.toUpperCase() : "AAL2 (VERIFIED)"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Auth Method:</span>
              <span className="text-fg-default font-semibold">Supabase Auth + TOTP</span>
            </div>
            <div className="flex justify-between">
              <span>Jurisdiction:</span>
              <span className="text-fg-default font-semibold">D-BST &amp; GrowthMates</span>
            </div>
          </div>
        </div>

        {/* Card 2: TOTP 2FA Security Status */}
        <div className="p-5 bg-white rounded-xl border border-border-subtle shadow-xs lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-mono font-bold uppercase text-fg-dim flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-accent" />
              <span>Two-Factor Authentication (TOTP 2FA)</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Enforced at AAL2
            </span>
          </div>

          <p className="text-xs text-fg-dim">
            All super admin logins require both a verified password and a 6-digit Time-based One-Time Password (TOTP) from an authenticator app.
          </p>

          <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg space-y-2">
            {loadingMfa ? (
              <div className="text-zinc-500 font-mono text-[11px]">Loading MFA factors...</div>
            ) : mfaStatus?.factors && mfaStatus.factors.length > 0 ? (
              <div className="space-y-2">
                {mfaStatus.factors.map((factor) => (
                  <div key={factor.id} className="flex items-center justify-between text-[11px] font-mono">
                    <div>
                      <span className="font-semibold text-fg-default">{factor.friendly_name || "D-BST Admin TOTP"}</span>
                      <span className="text-zinc-400 ml-2">ID: {factor.id.slice(0, 8)}...</span>
                    </div>
                    <button
                      onClick={() => handleUnenrollMfa(factor.id)}
                      disabled={unrolling}
                      className="px-2.5 py-1 rounded text-[10px] font-mono border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      {unrolling ? "Resetting..." : "Reset 2FA Factor"}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-between text-[11px] font-mono text-amber-700">
                <span>No secondary factors currently enrolled.</span>
                <span className="text-[10px] text-zinc-400">Enrollment will trigger on next login</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-xl border border-border-subtle shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent" />
            <h3 className="font-bold font-display text-sm text-fg-default">Administrative Audit Trail</h3>
            <span className="text-[10px] font-mono bg-zinc-200 text-zinc-700 px-2 py-0.5 rounded-full font-bold">
              {logs.length} EVENTS (SHARED DB)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportLogs}
              className="px-3 py-1 rounded border border-border-subtle bg-white hover:bg-zinc-100 font-mono text-[11px] flex items-center gap-1 transition-colors"
            >
              <Download className="w-3 h-3" />
              <span>Export Log</span>
            </button>
          </div>
        </div>

        {loadingLogs ? (
          <div className="p-8 text-center text-fg-dim font-mono text-xs">
            Loading cross-site audit log entries from Supabase...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-fg-dim font-mono text-xs">
            No historical audit events logged yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-border-subtle text-[10px] font-mono uppercase text-fg-dim">
                <tr>
                  <th className="py-2.5 px-4">Timestamp</th>
                  <th className="py-2.5 px-4">Admin Email</th>
                  <th className="py-2.5 px-4">Target Site</th>
                  <th className="py-2.5 px-4">Action Taken</th>
                  <th className="py-2.5 px-4">Operational Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-2.5 px-4 font-mono text-fg-dim text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString("en-AU", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="py-2.5 px-4 font-mono font-medium text-fg-default whitespace-nowrap">
                      {log.adminEmail}
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          log.targetSite === "dbst"
                            ? "bg-accent-tint text-accent border border-accent/20"
                            : log.targetSite === "growthmates"
                            ? "bg-purple-100 text-purple-700 border border-purple-200"
                            : "bg-zinc-100 text-zinc-700 border border-zinc-200"
                        }`}
                      >
                        {log.targetSite}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-medium text-fg-default">
                      {log.action}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[11px] text-fg-dim max-w-xs truncate">
                      {log.details || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAuditSecurity;
