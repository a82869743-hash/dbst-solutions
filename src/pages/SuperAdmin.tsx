import React, { useState, useEffect, useCallback } from "react";
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
  Mail,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  Send,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import LogoMark from "@/components/landing/LogoMark";
import AdminInquiriesInbox from "@/components/admin/AdminInquiriesInbox";
import AdminContentManager from "@/components/admin/AdminContentManager";
import AdminCredentialsVault from "@/components/admin/AdminCredentialsVault";
import AdminAuditSecurity from "@/components/admin/AdminAuditSecurity";
import { SiteTarget } from "@/lib/admin/adminStore";
import {
  checkAdminUser,
  verifyAdminRole,
  requestEmailOtp,
  verifyEmailOtp,
  sendSessionHeartbeat,
  checkLoginRateLimit,
  recordLoginAttempt,
  logAdminAudit,
  purgeResidualClientSecrets,
  revokeActiveSession,
} from "@/lib/admin/auth";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";

type AuthStep = "login" | "otp-approval";

export const SuperAdminPage: React.FC = () => {
  const [authed, setAuthed] = useState(false);
  const [authStep, setAuthStep] = useState<AuthStep>("login");
  const [adminEmail, setAdminEmail] = useState("");
  const [tempUserId, setTempUserId] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [recipientHint, setRecipientHint] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Active Multi-Site Selection
  const [selectedSite, setSelectedSite] = useState<SiteTarget | "all">("all");

  // Active Admin Module Tab
  const [activeTab, setActiveTab] = useState<"inbox" | "content" | "credentials" | "security">("inbox");

  // Resend cooldown timer countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  // Initial session verification on page load
  const verifyCurrentSession = useCallback(async () => {
    setCheckingSession(true);
    purgeResidualClientSecrets();
    try {
      const { user, isAdmin, isBanned } = await checkAdminUser();

      if (isBanned) {
        toast({
          title: "Account Disabled",
          description: "This administrator account has been banned.",
          variant: "destructive",
        });
        await supabase.auth.signOut();
        setAuthed(false);
        setAuthStep("login");
        return;
      }

      if (!user || !isAdmin) {
        setAuthed(false);
        setAuthStep("login");
        return;
      }

      setAdminEmail(user.email || "");
      setTempUserId(user.id);

      // Check if this browser already has a verified active session ID in storage
      const storedSessionId = sessionStorage.getItem("dbst_admin_session_id");
      if (storedSessionId) {
        const heartbeat = await sendSessionHeartbeat({
          sessionId: storedSessionId,
          userId: user.id,
          email: user.email || "",
        });

        if (heartbeat.active && !heartbeat.revoked && !heartbeat.banned) {
          setAuthed(true);
          return;
        }
      }

      // If no valid active session in storage, prompt for email OTP approval
      setAuthed(false);
      setAuthStep("otp-approval");
      const res = await requestEmailOtp({
        userId: user.id,
        email: user.email || "",
        targetSite: "dbst",
      });

      if (res.banned) {
        toast({ title: "Access Denied", description: res.error, variant: "destructive" });
        await supabase.auth.signOut();
        setAuthStep("login");
        return;
      }

      if (res.recipientHint) {
        setRecipientHint(res.recipientHint);
      }
      setResendCooldown(30);
    } catch (err) {
      console.error("Session verification error:", err);
      setAuthed(false);
      setAuthStep("login");
    } finally {
      setCheckingSession(false);
    }
  }, []);

  useEffect(() => {
    verifyCurrentSession();
  }, [verifyCurrentSession]);

  // Periodic session heartbeat while active in /super-admin (every 2 minutes)
  useEffect(() => {
    if (!authed) return;

    const interval = setInterval(async () => {
      const storedSessionId = sessionStorage.getItem("dbst_admin_session_id") || "";
      try {
        const { user } = await checkAdminUser();
        const res = await sendSessionHeartbeat({
          sessionId: storedSessionId,
          userId: user?.id,
          email: adminEmail,
        });

        if (res.revoked || res.banned) {
          toast({
            title: res.banned ? "Account Disabled" : "Session Terminated",
            description: res.banned
              ? "Your account has been banned by an administrator."
              : "Your session was remotely logged out by an administrator.",
            variant: "destructive",
          });
          await handleLogout();
        }
      } catch (err) {
        console.warn("Heartbeat error:", err);
      }
    }, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, [authed, adminEmail]);

  // Handle Initial Password Sign-In
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = adminEmail.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      toast({ title: "Validation Error", description: "Email and password are required.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setAttemptsRemaining(null);
    try {
      // 1. Check rate limit
      const rateLimit = await checkLoginRateLimit(trimmedEmail);
      if (!rateLimit.allowed) {
        await recordLoginAttempt(trimmedEmail, "blocked", "Rate limit lockout triggered", "dbst");
        toast({
          title: "Account Temporarily Locked",
          description: `Too many failed attempts. Please wait ${rateLimit.lockoutSeconds || 900} seconds before retrying.`,
          variant: "destructive",
        });
        return;
      }

      // 2. Authenticate with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        await recordLoginAttempt(trimmedEmail, "failure", error.message, "dbst");
        throw error;
      }

      const userId = data.user?.id;
      if (!userId) throw new Error("Authentication failed: user ID missing");

      // 3. Verify user has 'admin' role in user_roles table
      const isAdmin = await verifyAdminRole(userId);
      if (!isAdmin) {
        await recordLoginAttempt(trimmedEmail, "failure", "Non-admin account attempted access to /super-admin", "dbst");
        await supabase.auth.signOut();
        throw new Error("Access denied: super admin role required in user_roles.");
      }

      setTempUserId(userId);

      // 4. Request 6-digit email approval code (dispatched to ADMIN_OTP_NOTIFY_EMAIL)
      const otpRes = await requestEmailOtp({
        userId,
        email: trimmedEmail,
        targetSite: "dbst",
      });

      if (otpRes.banned) {
        await recordLoginAttempt(trimmedEmail, "blocked", "Banned account attempted login", "dbst");
        await supabase.auth.signOut();
        throw new Error("This administrator account has been disabled. Login rejected.");
      }

      if (!otpRes.success) {
        throw new Error(otpRes.error || "Failed to generate approval code.");
      }

      await recordLoginAttempt(trimmedEmail, "success", "Password verified. Awaiting email approval code.", "dbst");

      if (otpRes.recipientHint) {
        setRecipientHint(otpRes.recipientHint);
      }
      setResendCooldown(30);
      setAuthStep("otp-approval");
      setOtpCode("");

      toast({
        title: "Approval Code Dispatched",
        description: `A 6-digit approval code was sent to ${otpRes.recipientHint || "the authorized administrator"}.`,
      });
    } catch (err: any) {
      toast({ title: "Authentication Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Handle 6-Digit Email Approval Code Verification
  const handleVerifyApprovalCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      toast({ title: "Invalid Code", description: "Please enter a valid 6-digit approval code.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const refreshToken = session?.refresh_token;

      const verifyRes = await verifyEmailOtp({
        userId: tempUserId,
        email: adminEmail,
        code: otpCode.trim(),
        refreshToken,
        targetSite: "dbst",
      });

      if (verifyRes.banned) {
        await supabase.auth.signOut();
        setAuthed(false);
        setAuthStep("login");
        throw new Error("Account has been banned. Access denied.");
      }

      if (!verifyRes.success) {
        if (typeof verifyRes.remainingAttempts === "number") {
          setAttemptsRemaining(verifyRes.remainingAttempts);
        }
        throw new Error(verifyRes.error || "Verification failed. Check the approval code and retry.");
      }

      // Successful verification
      if (verifyRes.sessionId) {
        sessionStorage.setItem("dbst_admin_session_id", verifyRes.sessionId);
      }

      await logAdminAudit(adminEmail, "admin_login_success", {
        auth_method: "email_approval_otp",
        target_site: "dbst",
      });

      setAuthed(true);
      setAuthStep("login");
      setOtpCode("");
      setPassword("");
      setAttemptsRemaining(null);

      toast({
        title: "Access Granted",
        description: "Email approval confirmed. Welcome to the Super Admin Control Center.",
      });
    } catch (err: any) {
      toast({ title: "Approval Verification Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Resend 6-Digit Approval Code
  const handleResendCode = async () => {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    try {
      const res = await requestEmailOtp({
        userId: tempUserId,
        email: adminEmail,
        targetSite: "dbst",
      });

      if (!res.success) {
        throw new Error(res.error || "Could not resend approval code");
      }

      if (res.recipientHint) {
        setRecipientHint(res.recipientHint);
      }
      setResendCooldown(45);
      setAttemptsRemaining(null);
      setOtpCode("");

      toast({
        title: "New Approval Code Sent",
        description: `Dispatched to ${res.recipientHint || "the authorized administrator"}. Valid for 5 minutes.`,
      });
    } catch (err: any) {
      toast({ title: "Resend Failed", description: err.message, variant: "destructive" });
    } finally {
      setResending(false);
    }
  };

  // Clean Logout
  const handleLogout = async () => {
    try {
      const currentSessionId = sessionStorage.getItem("dbst_admin_session_id");
      if (currentSessionId) {
        await revokeActiveSession(currentSessionId).catch(() => {});
      }
      await supabase.auth.signOut();
    } finally {
      purgeResidualClientSecrets();
      setAuthed(false);
      setAuthStep("login");
      setAdminEmail("");
      setTempUserId("");
      setPassword("");
      setOtpCode("");
      setAttemptsRemaining(null);
      toast({ title: "Logged Out", description: "Super admin session securely terminated." });
    }
  };

  // Loading state while verifying current session
  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#0E131F] text-white flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-mono text-xs text-zinc-400">Verifying secure admin session...</p>
        </div>
      </div>
    );
  }

  // 1. AUTHENTICATION GATE
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0E131F] text-white flex flex-col justify-between p-4 selection:bg-accent selection:text-white">
        <div className="max-w-7xl mx-auto w-full pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Home
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

          {/* STEP 1: Email & Password */}
          {authStep === "login" && (
            <form onSubmit={handlePasswordLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">Owner Email</label>
                <input
                  type="email"
                  required
                  placeholder="admin@dbstsolutions.com"
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
            </form>
          )}

          {/* STEP 2: 6-Digit Email Approval Code Verification */}
          {authStep === "otp-approval" && (
            <form onSubmit={handleVerifyApprovalCode} className="space-y-4 text-xs">
              <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-lg text-center space-y-1.5">
                <div className="flex items-center justify-center gap-1.5 text-accent font-mono text-[11px] font-semibold">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Approval Code Required</span>
                </div>
                <p className="text-[11px] text-zinc-300">
                  A 6-digit approval code was sent to the designated admin address:
                </p>
                <div className="inline-block px-2.5 py-1 bg-accent/10 border border-accent/20 rounded font-mono text-xs text-accent font-bold">
                  {recipientHint || "Authorized Admin Email"}
                </div>
                <p className="text-[10px] text-zinc-400">
                  Account attempting login: <span className="text-white font-semibold">{adminEmail}</span>
                </p>
              </div>

              {attemptsRemaining !== null && attemptsRemaining < 5 && (
                <div className="p-2.5 bg-red-950/40 border border-red-800 rounded-lg flex items-center gap-2 text-[11px] text-red-300">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>
                    Incorrect code entered. <strong>{attemptsRemaining}</strong> attempt(s) remaining before code lockout.
                  </span>
                </div>
              )}

              <div className="flex justify-center py-2">
                <InputOTP
                  maxLength={6}
                  value={otpCode}
                  onChange={(val) => setOtpCode(val)}
                  autoFocus
                >
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot index={0} className="w-10 h-12 text-lg border-zinc-700 bg-zinc-900 text-white font-mono" />
                    <InputOTPSlot index={1} className="w-10 h-12 text-lg border-zinc-700 bg-zinc-900 text-white font-mono" />
                    <InputOTPSlot index={2} className="w-10 h-12 text-lg border-zinc-700 bg-zinc-900 text-white font-mono" />
                    <InputOTPSlot index={3} className="w-10 h-12 text-lg border-zinc-700 bg-zinc-900 text-white font-mono" />
                    <InputOTPSlot index={4} className="w-10 h-12 text-lg border-zinc-700 bg-zinc-900 text-white font-mono" />
                    <InputOTPSlot index={5} className="w-10 h-12 text-lg border-zinc-700 bg-zinc-900 text-white font-mono" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 px-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-zinc-500" />
                  <span>Expires in 5 mins</span>
                </span>
                <button
                  type="button"
                  disabled={resendCooldown > 0 || resending}
                  onClick={handleResendCode}
                  className="text-accent hover:underline disabled:text-zinc-600 disabled:no-underline"
                >
                  {resending
                    ? "Sending..."
                    : resendCooldown > 0
                    ? `Resend Code (${resendCooldown}s)`
                    : "Resend Code"}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className="w-full py-3 rounded-lg bg-accent text-white font-medium text-xs font-mono uppercase tracking-wider hover:bg-accent-deep transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "Verifying Approval Code..." : "Confirm & Unlock Control Center"}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-[11px] text-zinc-400 hover:text-white underline font-mono"
                >
                  ← Cancel &amp; Sign Out
                </button>
              </div>
            </form>
          )}

          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span>DBST &bull; GrowthMates Unified Admin</span>
            <span>Email-Approval OTP Gate</span>
          </div>
        </div>

        <div className="text-center text-[11px] font-mono text-zinc-600 pb-4">
          Encrypted TLS 1.3 • Authorized Personnel Only • Zero Browser Plaintext Secrets
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
                  Live Sync Online (Email Approved)
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
