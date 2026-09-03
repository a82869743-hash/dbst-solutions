import React, { useState } from "react";
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
} from "lucide-react";
import { AdminStore, AuditLogEntry } from "@/lib/admin/adminStore";
import { toast } from "@/hooks/use-toast";

interface AdminAuditSecurityProps {
  adminEmail: string;
  onLogout: () => void;
}

export const AdminAuditSecurity: React.FC<AdminAuditSecurityProps> = ({
  adminEmail,
  onLogout,
}) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>(AdminStore.getAuditLogs());
  const [newPasskey, setNewPasskey] = useState("");
  const [confirmPasskey, setConfirmPasskey] = useState("");

  const handleUpdatePasskey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasskey || newPasskey.length < 6) {
      toast({ title: "Passkey Too Short", description: "Master passkey must be at least 6 characters.", variant: "destructive" });
      return;
    }
    if (newPasskey !== confirmPasskey) {
      toast({ title: "Mismatch", description: "Passkeys do not match.", variant: "destructive" });
      return;
    }

    localStorage.setItem("dbst_superadmin_master_passkey", newPasskey);
    AdminStore.logAction(adminEmail, "Updated emergency master passkey", "global");
    setNewPasskey("");
    setConfirmPasskey("");
    toast({ title: "Passkey Updated", description: "New master passkey is now active." });
  };

  const handleClearLogs = () => {
    if (!window.confirm("Are you sure you want to clear the audit log history?")) return;
    localStorage.removeItem("dbst_superadmin_audit");
    setLogs([]);
    toast({ title: "Audit Trail Cleared", description: "Historical log entries have been removed." });
  };

  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `security_audit_log_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchor.click();
    toast({ title: "Audit Log Downloaded", description: "Exported audit trail JSON." });
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
            Manage owner authentication, emergency credentials, and review chronological administrative actions.
          </p>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 text-xs font-mono font-medium rounded-md border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
        >
          Sign Out of Super Admin
        </button>
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
                <span>ROLE: SUPER ADMIN (OWNER)</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-border-subtle text-[11px] font-mono text-fg-dim space-y-1">
            <div className="flex justify-between">
              <span>Session Type:</span>
              <span className="text-fg-default font-semibold">Dual Auth / Owner</span>
            </div>
            <div className="flex justify-between">
              <span>Jurisdiction:</span>
              <span className="text-fg-default font-semibold">D-BST &amp; GrowthMates</span>
            </div>
          </div>
        </div>

        {/* Card 2: Update Master Emergency Passkey */}
        <div className="p-5 bg-white rounded-xl border border-border-subtle shadow-xs lg:col-span-2">
          <form onSubmit={handleUpdatePasskey} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-mono font-bold uppercase text-fg-dim flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-accent" />
                <span>Emergency Master Passkey</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">Bypasses offline token expirations</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-fg-dim mb-1">New Master Passkey</label>
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  value={newPasskey}
                  onChange={(e) => setNewPasskey(e.target.value)}
                  className="w-full px-3 py-1.5 rounded border border-border-subtle font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-fg-dim mb-1">Confirm New Passkey</label>
                <input
                  type="password"
                  placeholder="Repeat passkey"
                  value={confirmPasskey}
                  onChange={(e) => setConfirmPasskey(e.target.value)}
                  className="w-full px-3 py-1.5 rounded border border-border-subtle font-mono text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-accent text-white hover:bg-accent-deep text-xs font-medium transition-colors"
              >
                Update Passkey
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-xl border border-border-subtle shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent" />
            <h3 className="font-bold font-display text-sm text-fg-default">Administrative Audit Trail</h3>
            <span className="text-[10px] font-mono bg-zinc-200 text-zinc-700 px-2 py-0.5 rounded-full font-bold">
              {logs.length} EVENTS
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
            <button
              onClick={handleClearLogs}
              className="px-3 py-1 rounded border border-border-subtle bg-white hover:bg-red-50 text-red-600 font-mono text-[11px] flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear History</span>
            </button>
          </div>
        </div>

        {logs.length === 0 ? (
          <div className="p-8 text-center text-fg-dim">No historical audit events logged yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-border-subtle text-[10px] font-mono uppercase text-fg-dim">
                <tr>
                  <th className="py-2.5 px-4">Timestamp</th>
                  <th className="py-2.5 px-4">Admin Email</th>
                  <th className="py-2.5 px-4">Target Site</th>
                  <th className="py-2.5 px-4">Action Taken</th>
                  <th className="py-2.5 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle font-mono text-[11px]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-2.5 px-4 text-fg-dim whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString("en-AU", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-fg-default">{log.adminEmail}</td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          log.targetSite === "dbst"
                            ? "bg-orange-100 text-orange-800"
                            : log.targetSite === "growthmates"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-zinc-100 text-zinc-700"
                        }`}
                      >
                        {log.targetSite}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-fg-default font-semibold">{log.action}</td>
                    <td className="py-2.5 px-4 text-fg-dim text-[10px]">{log.details || "—"}</td>
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
