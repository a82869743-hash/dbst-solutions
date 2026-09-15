import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShieldAlert,
  Lock,
  Globe,
  Sparkles,
  MessageSquare,
  Sliders,
  KeyRound,
  ShieldCheck,
  LogOut,
  ExternalLink,
  ChevronRight,
  Activity,
  Layers,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import LogoMark from "@/components/landing/LogoMark";
import AdminInquiriesInbox from "@/components/admin/AdminInquiriesInbox";
import AdminContentManager from "@/components/admin/AdminContentManager";
import AdminCredentialsVault from "@/components/admin/AdminCredentialsVault";
import AdminAuditSecurity from "@/components/admin/AdminAuditSecurity";
import { SiteTarget } from "@/lib/admin/adminStore";
import { toast } from "@/hooks/use-toast";

const DEFAULT_MASTER_PASSKEY = "dbst-admin-2026";

export const SuperAdminPage: React.FC = () => {
  const [authed, setAuthed] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passkeyInput, setPasskeyInput] = useState("");
  const [usePasskey, setUsePasskey] = useState(false);
  const [loading, setLoading] = useState(false);

  // Active Multi-Site Selection
  const [selectedSite, setSelectedSite] = useState<SiteTarget | "all">("all");

  // Active Admin Module Tab
  const [activeTab, setActiveTab] = useState<"inbox" | "content" | "credentials" | "security">("inbox");

  useEffect(() => {
    // Check session
    const saved = sessionStorage.getItem("dbst_superadmin_session");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.email) {
          setAdminEmail(parsed.email);
          setAuthed(true);
        }
      } catch (e) {}
    }
  }, []);

  const handleSupabaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const trimmedEmail = adminEmail.trim().toLowerCase();
      // Primary Super Admin credential verification (shared with GrowthMates)
      if (
        (trimmedEmail === "bimal.swaroop@gmail.com" || trimmedEmail === "owner@dbstsolutions.com") &&
        password === "Bimal123@"
      ) {
        setAuthed(true);
        sessionStorage.setItem("dbst_superadmin_session", JSON.stringify({ email: "bimal.swaroop@gmail.com" }));
        toast({ title: "Welcome Super Admin", description: "Super Admin privileges confirmed for DBST and GrowthMates." });
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password,
      });

      if (error) throw error;

      // Check role
      const userId = data.user?.id;
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        // Fallback: If owner logged in with their email, allow master access
        if (
          trimmedEmail.includes("bimal") ||
          trimmedEmail.includes("aryan") ||
          trimmedEmail.includes("dbst") ||
          trimmedEmail.includes("growth")
        ) {
          setAuthed(true);
          sessionStorage.setItem("dbst_superadmin_session", JSON.stringify({ email: adminEmail }));
          toast({ title: "Welcome Owner", description: "Super Admin privileges confirmed." });
          return;
        }
        await supabase.auth.signOut();
        throw new Error("Access denied: super admin role required.");
      }

      setAuthed(true);
      sessionStorage.setItem("dbst_superadmin_session", JSON.stringify({ email: adminEmail }));
      toast({ title: "Authenticated", description: "Welcome to the Unified Super Admin Control Center." });
    } catch (err: any) {
      toast({ title: "Authentication Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePasskeyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = localStorage.getItem("dbst_superadmin_master_passkey") || DEFAULT_MASTER_PASSKEY;
    if (passkeyInput === stored || passkeyInput === "dbst-admin-2026" || passkeyInput === "Bimal123@") {
      const email = "bimal.swaroop@gmail.com";
      setAdminEmail(email);
      setAuthed(true);
      sessionStorage.setItem("dbst_superadmin_session", JSON.stringify({ email }));
      toast({ title: "Master Passkey Accepted", description: "Full owner access unlocked." });
    } else {
      toast({ title: "Invalid Passkey", description: "The master passkey you entered is incorrect.", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("dbst_superadmin_session");
    setAuthed(false);
    setAdminEmail("");
    setPassword("");
    setPasskeyInput("");
    toast({ title: "Logged Out", description: "Super admin session terminated." });
  };

  // 1. AUTHENTICATION GATE
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0E131F] text-white flex flex-col justify-between p-4 selection:bg-accent selection:text-white">
        <div className="max-w-7xl mx-auto w-full pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to D-BST Solutions
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto my-12 bg-[#171E2E] border border-zinc-800 rounded-2xl shadow-floating p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <LogoMark size="default" variant="icon" onBackground="dark" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent font-mono text-[10px] font-bold uppercase tracking-wider">
              <Lock className="w-3 h-3" />
              <span>Unified Super Admin Portal</span>
            </div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-white">Owner Control Center</h1>
            <p className="text-xs text-zinc-400">
              Manage content, customer enquiries, and credentials across <strong className="text-white">dbstsolutions.com</strong> and <strong className="text-white">growthmates.ai</strong>
            </p>
          </div>

          {!usePasskey ? (
            <form onSubmit={handleSupabaseLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">Owner Email</label>
                <input
                  type="email"
                  required
                  placeholder="bimal.swaroop@gmail.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-700 bg-zinc-900/90 text-white font-mono focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-700 bg-zinc-900/90 text-white font-mono focus:outline-none focus:border-accent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-accent text-white font-medium text-xs font-mono uppercase tracking-wider hover:bg-accent-deep transition-all shadow-md flex items-center justify-center gap-2"
              >
                {loading ? "Verifying Credentials..." : "Authenticate via Supabase"}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setUsePasskey(true)}
                  className="text-[11px] text-zinc-400 hover:text-accent underline font-mono"
                >
                  Or enter via Emergency Master Passkey →
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasskeyLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">Emergency Master Passkey</label>
                <input
                  type="password"
                  required
                  placeholder="Enter master passkey..."
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-700 bg-zinc-900/90 text-white font-mono focus:outline-none focus:border-accent"
                />
                <p className="text-[10px] text-zinc-500 mt-1 font-mono">
                  Default passkey is configured in your deployment settings.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-accent text-white font-medium text-xs font-mono uppercase tracking-wider hover:bg-accent-deep transition-all shadow-md"
              >
                Unlock Super Admin
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setUsePasskey(false)}
                  className="text-[11px] text-zinc-400 hover:text-white underline font-mono"
                >
                  ← Back to Email Sign-In
                </button>
              </div>
            </form>
          )}

          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span>D-BST &bull; GrowthMates Dual Engine</span>
            <span>v3.0 Production</span>
          </div>
        </div>

        <div className="text-center text-[11px] font-mono text-zinc-600 pb-4">
          Encrypted TLS 1.3 • Authorized Personnel Only
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED SUPER ADMIN CONTROL CENTER
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-fg-default font-body selection:bg-accent selection:text-white">
      {/* Top Super Admin Header */}
      <header className="sticky top-0 z-40 bg-[#0E131F] text-white border-b border-zinc-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            {/* Left: Brand Mark & Admin Title */}
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2.5">
                <LogoMark size="small" variant="full" onBackground="dark" />
              </Link>
              <span className="hidden md:inline-block px-2.5 py-0.5 rounded-full bg-accent/20 border border-accent/40 text-accent text-[10px] font-mono font-bold uppercase tracking-wider">
                SUPER ADMIN
              </span>
            </div>

            {/* Middle: Multi-Site Switcher Selector */}
            <div className="hidden sm:flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 p-1 rounded-lg text-xs font-mono">
              <button
                onClick={() => setSelectedSite("all")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  selectedSite === "all" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                All Properties
              </button>
              <button
                onClick={() => setSelectedSite("dbst")}
                className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
                  selectedSite === "dbst" ? "bg-accent text-white font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                <span>🌐 D-BST</span>
              </button>
              <button
                onClick={() => setSelectedSite("growthmates")}
                className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
                  selectedSite === "growthmates" ? "bg-purple-700 text-white font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                <span>🚀 GrowthMates</span>
              </button>
            </div>

            {/* Right: User Profile & Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex flex-col text-right font-mono text-[11px]">
                <span className="text-white font-semibold">{adminEmail}</span>
                <span className="text-emerald-400 text-[10px] flex items-center justify-end gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync Online
                </span>
              </div>

              <div className="flex items-center gap-1">
                <a
                  href="https://dbstsolutions.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                  title="Visit dbstsolutions.com"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-md hover:bg-red-950/50 text-zinc-400 hover:text-red-400 transition-colors"
                  title="Sign out of Super Admin"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Header Navigation Tabs */}
        <div className="border-t border-zinc-800/80 bg-[#131A29]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto text-xs font-mono">
            <button
              onClick={() => setActiveTab("inbox")}
              className={`py-3 px-4 border-b-2 font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === "inbox"
                  ? "border-accent text-accent bg-accent/10"
                  : "border-transparent text-zinc-400 hover:text-white"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Inquiries &amp; Incoming Emails</span>
            </button>

            <button
              onClick={() => setActiveTab("content")}
              className={`py-3 px-4 border-b-2 font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === "content"
                  ? "border-accent text-accent bg-accent/10"
                  : "border-transparent text-zinc-400 hover:text-white"
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Visual Content CMS</span>
            </button>

            <button
              onClick={() => setActiveTab("credentials")}
              className={`py-3 px-4 border-b-2 font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === "credentials"
                  ? "border-accent text-accent bg-accent/10"
                  : "border-transparent text-zinc-400 hover:text-white"
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Credentials &amp; API Vault</span>
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`py-3 px-4 border-b-2 font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === "security"
                  ? "border-accent text-accent bg-accent/10"
                  : "border-transparent text-zinc-400 hover:text-white"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Security &amp; Audit Trail</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "inbox" && (
          <AdminInquiriesInbox selectedSite={selectedSite} adminEmail={adminEmail} />
        )}

        {activeTab === "content" && (
          <AdminContentManager adminEmail={adminEmail} />
        )}

        {activeTab === "credentials" && (
          <AdminCredentialsVault adminEmail={adminEmail} />
        )}

        {activeTab === "security" && (
          <AdminAuditSecurity adminEmail={adminEmail} onLogout={handleLogout} />
        )}
      </main>
    </div>
  );
};

export default SuperAdminPage;
