import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  LogOut,
  Ban,
  UserX,
  Search,
  Filter,
  Monitor,
  Globe,
  Mail,
  ShieldAlert,
} from "lucide-react";
import { AdminStore, AuditLogEntry } from "@/lib/admin/adminStore";
import {
  fetchActiveSessions,
  revokeActiveSession,
  banAdminUser,
  fetchBannedUsers,
  unbanAdminUser,
  ActiveSessionItem,
  BannedUserItem,
} from "@/lib/admin/auth";
import { toast } from "@/hooks/use-toast";

interface AdminAuditSecurityProps {
  adminEmail: string;
  onLogout: () => void;
}

type SecuritySubTab = "sessions" | "audit" | "policy";

export const AdminAuditSecurity: React.FC<AdminAuditSecurityProps> = ({
  adminEmail,
  onLogout,
}) => {
  const [subTab, setSubTab] = useState<SecuritySubTab>("sessions");

  // Sessions & Banned state
  const [sessions, setSessions] = useState<ActiveSessionItem[]>([]);
  const [bannedUsers, setBannedUsers] = useState<BannedUserItem[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingBanned, setLoadingBanned] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Ban Modal state
  const [banModalTarget, setBanModalTarget] = useState<{ userId: string; userEmail: string } | null>(null);
  const [banReason, setBanReason] = useState("");

  // Audit Logs state
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  // Audit Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterEmail, setFilterEmail] = useState<string>("all");
  const [filterSite, setFilterSite] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const checkRevoked = useCallback((msg?: string) => {
    if (!msg) return false;
    const lower = msg.toLowerCase();
    if (
      lower.includes("session has been revoked") ||
      lower.includes("user account has been disabled") ||
      lower.includes("missing session identifier")
    ) {
      toast({
        title: "Session Terminated",
        description: "Your session or administrator privileges have been revoked.",
        variant: "destructive",
      });
      onLogout();
      return true;
    }
    return false;
  }, [onLogout]);

  // 1. Fetch Sessions
  const loadSessions = useCallback(async () => {
    setLoadingSessions(true);
    try {
      const res = await fetchActiveSessions();
      if (res.success) {
        setSessions(res.sessions || []);
      } else if (res.error && checkRevoked(res.error)) {
        return;
      }
    } catch (err: any) {
      console.error("Failed to load active sessions:", err);
      if (checkRevoked(err?.message)) return;
    } finally {
      setLoadingSessions(false);
    }
  }, [checkRevoked]);

  // 2. Fetch Banned Users
  const loadBannedUsers = useCallback(async () => {
    setLoadingBanned(true);
    try {
      const res = await fetchBannedUsers();
      if (res.success) {
        setBannedUsers(res.bannedUsers || []);
      } else if (res.error && checkRevoked(res.error)) {
        return;
      }
    } catch (err: any) {
      console.error("Failed to load banned users:", err);
      if (checkRevoked(err?.message)) return;
    } finally {
      setLoadingBanned(false);
    }
  }, [checkRevoked]);

  // 3. Fetch Audit Logs
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

  useEffect(() => {
    loadSessions();
    loadBannedUsers();
    loadAuditLogs();
  }, [loadSessions, loadBannedUsers, loadAuditLogs]);

  // Handle Terminating a Session
  const handleRevokeSession = async (sessionId: string, targetEmail: string) => {
    if (!window.confirm(`Are you sure you want to force log out the session for ${targetEmail}?`)) {
      return;
    }

    setActionInProgress(`revoke-${sessionId}`);
    try {
      const res = await revokeActiveSession(sessionId);
      if (!res.success) throw new Error(res.error || "Failed to terminate session");

      toast({
        title: "Session Terminated",
        description: `Successfully logged out session for ${targetEmail}.`,
      });

      await loadSessions();
      await loadAuditLogs();

      // If user revoked their own session, log them out locally
      const currentStored = sessionStorage.getItem("dbst_admin_session_id");
      if (currentStored === sessionId) {
        onLogout();
      }
    } catch (err: any) {
      if (checkRevoked(err?.message)) return;
      toast({
        title: "Revocation Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  // Open Ban Confirmation Modal
  const openBanModal = (userId: string, userEmail: string) => {
    setBanModalTarget({ userId, userEmail });
    setBanReason("Administrative security violation");
  };

  // Confirm and Execute User Ban
  const handleConfirmBan = async () => {
    if (!banModalTarget) return;

    setActionInProgress(`ban-${banModalTarget.userId}`);
    try {
      const res = await banAdminUser(
        banModalTarget.userId,
        banModalTarget.userEmail,
        banReason.trim() || undefined
      );

      if (!res.success) throw new Error(res.error || "Failed to ban user");

      toast({
        title: "User Banned & Sessions Revoked",
        description: `Admin role removed and all active sessions terminated for ${banModalTarget.userEmail}.`,
      });

      setBanModalTarget(null);
      await loadSessions();
      await loadBannedUsers();
      await loadAuditLogs();
    } catch (err: any) {
      if (checkRevoked(err?.message)) return;
      toast({
        title: "Ban Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  // Handle Unbanning a User
  const handleUnban = async (userId: string, userEmail: string) => {
    if (!window.confirm(`Unban ${userEmail}? Note: The 'admin' role must be manually re-assigned if access is restored.`)) {
      return;
    }

    setActionInProgress(`unban-${userId}`);
    try {
      const res = await unbanAdminUser(userId, userEmail);
      if (!res.success) throw new Error(res.error || "Failed to unban user");

      toast({
        title: "User Unbanned",
        description: `${userEmail} has been removed from the ban list.`,
      });

      await loadBannedUsers();
      await loadAuditLogs();
    } catch (err: any) {
      if (checkRevoked(err?.message)) return;
      toast({
        title: "Unban Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  // Unique admin emails for filter dropdown
  const uniqueEmails = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => {
      if (l.adminEmail && l.adminEmail !== "unknown") set.add(l.adminEmail);
    });
    return Array.from(set);
  }, [logs]);

  // Filtered Audit Logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // 1. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesAction = (log.action || "").toLowerCase().includes(q);
        const matchesEmail = (log.adminEmail || "").toLowerCase().includes(q);
        const matchesDetails = (log.details || "").toLowerCase().includes(q);
        if (!matchesAction && !matchesEmail && !matchesDetails) return false;
      }

      // 2. Email filter
      if (filterEmail !== "all" && log.adminEmail !== filterEmail) {
        return false;
      }

      // 3. Site filter
      if (filterSite !== "all" && log.targetSite !== filterSite) {
        return false;
      }

      // 4. Category filter
      if (filterCategory !== "all") {
        const action = log.action.toLowerCase();
        if (filterCategory === "auth" && !action.includes("login") && !action.includes("otp")) return false;
        if (filterCategory === "session" && !action.includes("session") && !action.includes("ban")) return false;
        if (filterCategory === "content" && !action.includes("content")) return false;
        if (filterCategory === "credentials" && !action.includes("credential")) return false;
        if (filterCategory === "inquiry" && !action.includes("lead") && !action.includes("inquiry")) return false;
      }

      return true;
    });
  }, [logs, searchQuery, filterEmail, filterSite, filterCategory]);

  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `dbst_audit_log_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchor.click();
    toast({ title: "Audit Log Downloaded", description: `Exported ${filteredLogs.length} audit entries to JSON.` });
  };

  const handleRefreshAll = () => {
    loadSessions();
    loadBannedUsers();
    loadAuditLogs();
    toast({ title: "Refreshed", description: "Updated session list and audit events." });
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div>
          <h2 className="text-xl font-bold font-display text-fg-default flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-accent" />
            <span>Security, Sessions &amp; Access Control</span>
          </h2>
          <p className="text-xs text-fg-dim">
            Manage live administrator sessions, ban unauthorized accounts, and review audit trails across <strong className="text-fg-default">dbstsolutions.com</strong> and <strong className="text-fg-default">growthmates.ai</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshAll}
            className="px-3 py-1.5 text-xs font-mono font-medium rounded-md border border-border-subtle bg-white hover:bg-zinc-50 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingSessions || loadingLogs ? "animate-spin" : ""}`} />
            <span>Sync Live</span>
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-1.5 text-xs font-mono font-medium rounded-md border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors shadow-xs"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Current Session */}
        <div className="p-4 bg-white rounded-xl border border-border-subtle shadow-xs space-y-2">
          <div className="text-[10px] font-mono font-bold uppercase text-fg-dim tracking-wider">Current Admin Identity</div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent-tint flex items-center justify-center text-accent font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-fg-default truncate max-w-[200px]" title={adminEmail}>
                {adminEmail}
              </div>
              <div className="text-[10px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>ROLE: SUPER ADMIN</span>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-border-subtle text-[10px] text-fg-dim flex justify-between">
            <span>Enforcement Gate:</span>
            <span className="font-mono text-fg-default font-semibold">Email 6-Digit OTP</span>
          </div>
        </div>

        {/* Card 2: Active Sessions Counter */}
        <div className="p-4 bg-white rounded-xl border border-border-subtle shadow-xs space-y-2">
          <div className="text-[10px] font-mono font-bold uppercase text-fg-dim tracking-wider">Live Active Sessions</div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold font-display text-fg-default">
              {sessions.length}
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {sessions.filter((s) => s.status === "Active").length} Active Now
            </span>
          </div>
          <div className="pt-2 border-t border-border-subtle text-[10px] text-fg-dim flex justify-between">
            <span>Heartbeat Frequency:</span>
            <span className="font-mono text-fg-default">Every 2 Minutes</span>
          </div>
        </div>

        {/* Card 3: Security & Banned Count */}
        <div className="p-4 bg-white rounded-xl border border-border-subtle shadow-xs space-y-2">
          <div className="text-[10px] font-mono font-bold uppercase text-fg-dim tracking-wider">Access Governance</div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold font-display text-fg-default">
              {bannedUsers.length}
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
              <UserX className="w-3 h-3 text-red-600" />
              Banned Accounts
            </span>
          </div>
          <div className="pt-2 border-t border-border-subtle text-[10px] text-fg-dim flex justify-between">
            <span>Client Isolation:</span>
            <span className="font-mono text-fg-default">Service Role Only (RLS)</span>
          </div>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border-subtle pb-2">
        <button
          onClick={() => setSubTab("sessions")}
          className={`px-3 py-1.5 rounded-md font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            subTab === "sessions"
              ? "bg-accent text-white shadow-xs"
              : "bg-white text-fg-dim hover:text-fg-default border border-border-subtle"
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Active Sessions &amp; Bans ({sessions.length})</span>
        </button>

        <button
          onClick={() => setSubTab("audit")}
          className={`px-3 py-1.5 rounded-md font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            subTab === "audit"
              ? "bg-accent text-white shadow-xs"
              : "bg-white text-fg-dim hover:text-fg-default border border-border-subtle"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Audit Trail ({filteredLogs.length})</span>
        </button>

        <button
          onClick={() => setSubTab("policy")}
          className={`px-3 py-1.5 rounded-md font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            subTab === "policy"
              ? "bg-accent text-white shadow-xs"
              : "bg-white text-fg-dim hover:text-fg-default border border-border-subtle"
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Security Policy &amp; OTP Specs</span>
        </button>
      </div>

      {/* SUBTAB 1: Active Sessions & Banned Accounts */}
      {subTab === "sessions" && (
        <div className="space-y-6">
          {/* Active Sessions Panel */}
          <div className="bg-white rounded-xl border border-border-subtle shadow-xs overflow-hidden">
            <div className="p-4 border-b border-border-subtle bg-zinc-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold font-display text-sm text-fg-default flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-accent" />
                  <span>Authenticated Active Sessions</span>
                </h3>
                <p className="text-[11px] text-fg-dim">
                  Live sessions tracked via Supabase. Idle sessions haven't pinged heartbeat within 10 minutes.
                </p>
              </div>
              <span className="font-mono text-[10px] text-fg-dim bg-white px-2 py-1 rounded border border-border-subtle">
                Updated in real-time
              </span>
            </div>

            {loadingSessions ? (
              <div className="p-8 text-center text-fg-dim font-mono">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-accent" />
                Loading active sessions...
              </div>
            ) : sessions.length === 0 ? (
              <div className="p-8 text-center text-fg-dim">
                No active sessions recorded yet. Sign-ins will appear here once authenticated with email OTP.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-border-subtle text-[10px] font-mono uppercase text-fg-dim">
                    <tr>
                      <th className="py-2.5 px-4">User Email</th>
                      <th className="py-2.5 px-4">Target Site</th>
                      <th className="py-2.5 px-4">Device &amp; Browser</th>
                      <th className="py-2.5 px-4">IP Address</th>
                      <th className="py-2.5 px-4">Login Time</th>
                      <th className="py-2.5 px-4">Last Activity</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle font-mono text-[11px]">
                    {sessions.map((sess) => (
                      <tr key={sess.id} className="hover:bg-zinc-50/60 transition-colors">
                        <td className="py-3 px-4 font-semibold text-fg-default">
                          <div className="flex items-center gap-1.5">
                            <span>{sess.userEmail}</span>
                            {sess.userEmail === adminEmail && (
                              <span className="text-[9px] bg-accent/10 text-accent font-bold px-1.5 py-0.2 rounded">
                                YOU
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              sess.targetSite === "dbst"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {sess.targetSite}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-fg-default">{sess.deviceLabel}</td>
                        <td className="py-3 px-4 text-fg-dim">{sess.ipAddress}</td>
                        <td className="py-3 px-4 text-fg-dim whitespace-nowrap">
                          {new Date(sess.createdAt).toLocaleString("en-AU", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="py-3 px-4 text-fg-dim whitespace-nowrap">
                          {new Date(sess.lastSeenAt).toLocaleTimeString("en-AU", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                              sess.status === "Active"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                sess.status === "Active" ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"
                              }`}
                            />
                            {sess.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleRevokeSession(sess.id, sess.userEmail)}
                              disabled={actionInProgress === `revoke-${sess.id}`}
                              className="px-2.5 py-1 rounded text-[10px] font-mono border border-zinc-300 text-zinc-700 hover:bg-zinc-100 transition-colors flex items-center gap-1 disabled:opacity-50"
                              title="Force log out this session"
                            >
                              <LogOut className="w-3 h-3 text-amber-600" />
                              <span>Log Out</span>
                            </button>

                            {sess.userEmail !== adminEmail && (
                              <button
                                onClick={() => openBanModal(sess.userId, sess.userEmail)}
                                disabled={actionInProgress === `ban-${sess.userId}`}
                                className="px-2.5 py-1 rounded text-[10px] font-mono border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center gap-1 disabled:opacity-50"
                                title="Ban this user account entirely"
                              >
                                <Ban className="w-3 h-3 text-red-600" />
                                <span>Ban User</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Banned Users Table */}
          <div className="bg-white rounded-xl border border-border-subtle shadow-xs overflow-hidden">
            <div className="p-4 border-b border-border-subtle bg-zinc-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold font-display text-sm text-fg-default flex items-center gap-2">
                  <UserX className="w-4 h-4 text-red-600" />
                  <span>Banned Users ({bannedUsers.length})</span>
                </h3>
                <p className="text-[11px] text-fg-dim">
                  Users prohibited from logging in even with correct credentials and OTP.
                </p>
              </div>
            </div>

            {loadingBanned ? (
              <div className="p-6 text-center text-fg-dim font-mono">Loading banned users...</div>
            ) : bannedUsers.length === 0 ? (
              <div className="p-6 text-center text-fg-dim text-xs">
                No users are currently banned in this system.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-border-subtle text-[10px] font-mono uppercase text-fg-dim">
                    <tr>
                      <th className="py-2 px-4">User</th>
                      <th className="py-2 px-4">Banned At</th>
                      <th className="py-2 px-4">Banned By</th>
                      <th className="py-2 px-4">Reason</th>
                      <th className="py-2 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle font-mono text-[11px]">
                    {bannedUsers.map((b) => (
                      <tr key={b.userId} className="hover:bg-zinc-50/60">
                        <td className="py-2.5 px-4 font-semibold text-fg-default">{b.userEmail}</td>
                        <td className="py-2.5 px-4 text-fg-dim whitespace-nowrap">
                          {new Date(b.bannedAt).toLocaleString("en-AU", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="py-2.5 px-4 text-fg-dim">{b.bannedBy}</td>
                        <td className="py-2.5 px-4 text-red-700 max-w-xs truncate" title={b.reason}>
                          {b.reason}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            onClick={() => handleUnban(b.userId, b.userEmail)}
                            disabled={actionInProgress === `unban-${b.userId}`}
                            className="px-2.5 py-1 rounded text-[10px] font-mono border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                          >
                            Unban
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: Audit Trail */}
      {subTab === "audit" && (
        <div className="bg-white rounded-xl border border-border-subtle shadow-xs overflow-hidden space-y-4">
          {/* Filter Bar */}
          <div className="p-4 border-b border-border-subtle bg-zinc-50 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent" />
                <h3 className="font-bold font-display text-sm text-fg-default">
                  Administrative Audit Trail
                </h3>
                <span className="text-[10px] font-mono bg-zinc-200 text-zinc-700 px-2 py-0.5 rounded-full font-bold">
                  {filteredLogs.length} OF {logs.length} EVENTS
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportLogs}
                  className="px-3 py-1 rounded border border-border-subtle bg-white hover:bg-zinc-100 font-mono text-[11px] flex items-center gap-1 transition-colors shadow-xs"
                >
                  <Download className="w-3 h-3" />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1 font-mono text-xs">
              {/* Search text */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search actions or details..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded border border-border-subtle bg-white text-fg-default text-xs focus:outline-none focus:border-accent"
                />
              </div>

              {/* Filter by Admin Email */}
              <div>
                <select
                  value={filterEmail}
                  onChange={(e) => setFilterEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-border-subtle bg-white text-fg-default text-xs focus:outline-none focus:border-accent"
                >
                  <option value="all">All Admin Accounts ({uniqueEmails.length})</option>
                  {uniqueEmails.map((email) => (
                    <option key={email} value={email}>
                      {email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter by Target Site */}
              <div>
                <select
                  value={filterSite}
                  onChange={(e) => setFilterSite(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-border-subtle bg-white text-fg-default text-xs focus:outline-none focus:border-accent"
                >
                  <option value="all">All Target Properties</option>
                  <option value="dbst">D-BST (dbstsolutions.com)</option>
                  <option value="growthmates">GrowthMates (growthmates.ai)</option>
                  <option value="global">Global Shared</option>
                </select>
              </div>

              {/* Filter by Category */}
              <div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-border-subtle bg-white text-fg-default text-xs focus:outline-none focus:border-accent"
                >
                  <option value="all">All Action Categories</option>
                  <option value="auth">Auth &amp; Email OTP</option>
                  <option value="session">Sessions &amp; Bans</option>
                  <option value="content">Content CMS Edits</option>
                  <option value="credentials">Credentials &amp; API Keys</option>
                  <option value="inquiry">Customer Inquiries</option>
                </select>
              </div>
            </div>
          </div>

          {/* Audit Table */}
          {loadingLogs ? (
            <div className="p-8 text-center text-fg-dim font-mono">Loading real-time audit trail...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-fg-dim">No historical audit events match your filter criteria.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-border-subtle text-[10px] font-mono uppercase text-fg-dim">
                  <tr>
                    <th className="py-2.5 px-4">Timestamp</th>
                    <th className="py-2.5 px-4">Acting Admin</th>
                    <th className="py-2.5 px-4">Target Site</th>
                    <th className="py-2.5 px-4">Action Taken</th>
                    <th className="py-2.5 px-4">Telemetry &amp; Context</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle font-mono text-[11px]">
                  {filteredLogs.map((log) => (
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
                      <td className="py-2.5 px-4 font-semibold text-fg-default whitespace-nowrap">
                        {log.adminEmail}
                      </td>
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
                      <td className="py-2.5 px-4 text-fg-default font-semibold whitespace-nowrap">
                        {log.action}
                      </td>
                      <td className="py-2.5 px-4 text-fg-dim text-[10px] max-w-md truncate" title={log.details}>
                        {log.details || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: Policy & Specs */}
      {subTab === "policy" && (
        <div className="bg-white rounded-xl border border-border-subtle p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-accent" />
            <h3 className="font-bold font-display text-base text-fg-default">
              Email-Approval Login &amp; Session Management Specifications
            </h3>
          </div>

          <p className="text-xs text-fg-dim leading-relaxed">
            Super admin access to both <strong className="text-fg-default">dbstsolutions.com</strong> and <strong className="text-fg-default">growthmates.ai</strong> is strictly gated behind server-side email approval codes and active session verification.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 font-mono text-xs">
            <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 space-y-2">
              <div className="font-bold text-fg-default flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-accent" />
                <span>Email Approval Code Gate</span>
              </div>
              <ul className="space-y-1 text-fg-dim text-[11px]">
                <li>&bull; Fixed Recipient: Server env <code className="text-accent">ADMIN_OTP_NOTIFY_EMAIL</code></li>
                <li>&bull; Code Format: 6-digit random cryptographically secure token</li>
                <li>&bull; Code Lifespan: 5 minutes (auto-invalidated on timeout)</li>
                <li>&bull; Max Wrong Attempts: 5 attempts before code is permanently locked</li>
                <li>&bull; Storage: SHA-256 hashed code in <code className="text-accent">public.admin_login_otp</code></li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 space-y-2">
              <div className="font-bold text-fg-default flex items-center gap-1.5">
                <Monitor className="w-4 h-4 text-accent" />
                <span>Session Tracking &amp; Ban Architecture</span>
              </div>
              <ul className="space-y-1 text-fg-dim text-[11px]">
                <li>&bull; Heartbeat Interval: Automatic ping every 2 minutes while active</li>
                <li>&bull; Session State: "Active" within 10 min, otherwise marked "Idle"</li>
                <li>&bull; Remote Session Revocation: Invalidation updates <code className="text-accent">admin_active_sessions</code></li>
                <li>&bull; Account Ban: Immediate revoke of all active tokens &amp; role removal</li>
                <li>&bull; RLS Policy: Strict server-only access (no direct client queries)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Ban User Confirmation Modal */}
      {banModalTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#171E2E] border border-zinc-800 rounded-2xl p-6 max-w-md w-full space-y-4 text-white shadow-floating">
            <div className="flex items-center gap-2 text-red-400">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <h3 className="font-bold font-display text-base text-white">
                Confirm Account Ban
              </h3>
            </div>

            <p className="text-xs text-zinc-300">
              You are about to permanently ban <strong className="text-white">{banModalTarget.userEmail}</strong>.
            </p>

            <div className="p-3 bg-red-950/40 border border-red-900 rounded-lg text-[11px] text-red-200 space-y-1">
              <div>This action will immediately:</div>
              <ul className="list-disc list-inside space-y-0.5 text-zinc-300">
                <li>Insert into <code className="text-red-300 font-mono">admin_banned_users</code></li>
                <li>Remove <code className="text-red-300 font-mono">'admin'</code> role from <code className="text-red-300 font-mono">user_roles</code></li>
                <li>Force terminate all active sessions across all devices</li>
                <li>Prevent future sign-ins even with valid password &amp; OTP</li>
              </ul>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                Reason for Ban (Optional):
              </label>
              <input
                type="text"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="e.g., Unauthorized access, credential compromise"
                className="w-full px-3 py-2 rounded border border-zinc-700 bg-zinc-900 text-white font-mono text-xs focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setBanModalTarget(null)}
                className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:text-white font-mono text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBan}
                disabled={actionInProgress === `ban-${banModalTarget.userId}`}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold transition-all shadow-md disabled:opacity-50"
              >
                {actionInProgress === `ban-${banModalTarget.userId}` ? "Banning..." : "Ban Account Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAuditSecurity;
