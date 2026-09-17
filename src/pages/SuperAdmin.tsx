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
  Smartphone,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Loader2,
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
  getMfaStatus,
  enrollTotpFactor,
  verifyTotpCode,
  checkLoginRateLimit,
  recordLoginAttempt,
  logAdminAudit,
  purgeResidualClientSecrets,
  TotpEnrollmentData,
} from "@/lib/admin/auth";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";

type AuthStep = "login" | "totp-challenge" | "totp-enroll";

export const SuperAdminPage: React.FC = () => {
  const [authed, setAuthed] = useState(false);
  const [authStep, setAuthStep] = useState<AuthStep>("login");
  const [adminEmail, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // MFA State
  const [enrolledFactorId, setEnrolledFactorId] = useState<string>("");
  const [enrollmentData, setEnrollmentData] = useState<TotpEnrollmentData | null>(null);
  const [secretCopied, setSecretCopied] = useState(false);

  // Active Multi-Site Selection
  const [selectedSite, setSelectedSite] = useState<SiteTarget | "all">("all");

  // Active Admin Module Tab
  const [activeTab, setActiveTab] = useState<"inbox" | "content" | "credentials" | "security">("inbox");

  // Initial session verification
  const verifyCurrentSession = useCallback(async () => {
    setCheckingSession(true);
    purgeResidualClientSecrets();
    try {
      const { user, isAdmin } = await checkAdminUser();
      if (!user || !isAdmin) {
        setAuthed(false);
        setAuthStep("login");
        return;
      }

      setAdminEmail(user.email || "");

      // Check MFA Status
      const mfa = await getMfaStatus();
      if (mfa.currentLevel === "aal2") {
        setAuthed(true);
        return;
      }

      // If user has verified TOTP factor, prompt for challenge
      if (mfa.hasVerifiedFactor && mfa.factors.length > 0) {
        const verifiedFactor = mfa.factors.find((f) => f.status === "verified");
        if (verifiedFactor) {
          setEnrolledFactorId(verifiedFactor.id);
          setAuthStep("totp-challenge");
          setAuthed(false);
          return;
        }
      }

      // Otherwise, require enrollment
      setAuthStep("totp-enroll");
      setAuthed(false);
      const enrollRes = await enrollTotpFactor("D-BST Admin");
      if (enrollRes.data) {
        setEnrollmentData(enrollRes.data);
      }
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

  // Handle Initial Password Sign-In
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = adminEmail.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      toast({ title: "Validation Error", description: "Email and password are required.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // 1. Check rate limit
      const rateLimit = await checkLoginRateLimit(trimmedEmail);
      if (!rateLimit.allowed) {
        await recordLoginAttempt(trimmedEmail, "blocked", "Rate limit lockout triggered");
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
        await recordLoginAttempt(trimmedEmail, "failure", error.message);
        throw error;
      }

      // 3. Verify user has 'admin' role in user_roles table
      const userId = data.user?.id;
      const isAdmin = userId ? await verifyAdminRole(userId) : false;

      if (!isAdmin) {
        await recordLoginAttempt(trimmedEmail, "failure", "Non-admin account attempted access to /super-admin");
        await supabase.auth.signOut();
        throw new Error("Access denied: super admin role required in user_roles.");
      }

      await recordLoginAttempt(trimmedEmail, "success");

      // 4. Check MFA Assurance Level
      const mfa = await getMfaStatus();

      if (mfa.currentLevel === "aal2") {
        setAuthed(true);
        toast({ title: "Authenticated", description: "Welcome to the Unified Super Admin Control Center." });
        return;
      }

      if (mfa.hasVerifiedFactor && mfa.factors.length > 0) {
        const verifiedFactor = mfa.factors.find((f) => f.status === "verified");
        if (verifiedFactor) {
          setEnrolledFactorId(verifiedFactor.id);
          setAuthStep("totp-challenge");
          toast({
            title: "2FA Verification Required",
            description: "Please enter the 6-digit code from your authenticator app.",
          });
          return;
        }
      }

      // Route to enrollment if no TOTP factor enrolled yet
      setAuthStep("totp-enroll");
      const enrollRes = await enrollTotpFactor("D-BST Admin");
      if (enrollRes.data) {
        setEnrollmentData(enrollRes.data);
      }
      toast({
        title: "2FA Enrollment Required",
        description: "Please configure your authenticator app to secure super admin access.",
      });
    } catch (err: any) {
      toast({ title: "Authentication Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Handle TOTP 2FA Verification Challenge
  const handleVerifyChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!totpCode || totpCode.trim().length !== 6) {
      toast({ title: "Invalid Code", description: "Please enter a valid 6-digit TOTP code.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { success, error } = await verifyTotpCode(enrolledFactorId, totpCode);
      if (!success) {
        await recordLoginAttempt(adminEmail, "failure", `Invalid TOTP code: ${error || "verification failed"}`);
        throw new Error(error || "Invalid verification code. Please check your authenticator app.");
      }

      await logAdminAudit(adminEmail, "admin_login_success", {
        mfa: "totp_aal2",
        target_site: "dbst",
      });

      setAuthed(true);
      setTotpCode("");
      toast({ title: "Access Granted", description: "Two-factor authentication confirmed (AAL2)." });
    } catch (err: any) {
      toast({ title: "2FA Verification Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Handle Initial TOTP 2FA Enrollment Confirmation
  const handleVerifyEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollmentData || !totpCode || totpCode.trim().length !== 6) {
      toast({ title: "Invalid Code", description: "Please enter the 6-digit code from your authenticator app.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { success, error } = await verifyTotpCode(enrollmentData.factorId, totpCode);
      if (!success) {
        throw new Error(error || "Invalid code. Make sure your device clock is synchronized.");
      }

      await logAdminAudit(adminEmail, "totp_mfa_enrolled", {
        factor_id: enrollmentData.factorId,
        target_site: "dbst",
      });

      setAuthed(true);
      setTotpCode("");
      toast({
        title: "2FA Successfully Enrolled",
        description: "Your authenticator is now configured. Super admin privileges unlocked.",
      });
    } catch (err: any) {
      toast({ title: "Enrollment Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCopySecret = () => {
    if (!enrollmentData?.secret) return;
    navigator.clipboard.writeText(enrollmentData.secret);
    setSecretCopied(true);
    toast({ title: "Secret Copied", description: "Manual entry key copied to clipboard." });
    setTimeout(() => setSecretCopied(false), 2500);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      purgeResidualClientSecrets();
      setAuthed(false);
      setAuthStep("login");
      setAdminEmail("");
      setPassword("");
      setTotpCode("");
      setEnrollmentData(null);
      setEnrolledFactorId("");
      toast({ title: "Logged Out", description: "Super admin session securely terminated." });
    }
  };

  // Loading state while verifying current session
  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#0E131F] text-white flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
          <span className="text-xs font-mono text-zinc-400">Verifying security credentials...</span>
        </div>
      </div>
    );
  }

  // 1. AUTHENTICATION GATES
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

          {/* STEP 1: Supabase Password Auth */}
          {authStep === "login" && (
            <form onSubmit={handlePasswordLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">Super Admin Email</label>
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
                className="w-full py-3 rounded-lg bg-accent text-white font-medium text-xs font-mono uppercase tracking-wider hover:bg-accent-deep transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <span>Authenticate via Supabase</span>
                )}
              </button>

              <p className="text-[10px] text-zinc-500 text-center font-mono pt-1">
                Role verified via <code className="text-zinc-400">user_roles</code> table. 2FA required on all sessions.
              </p>
            </form>
          )}

          {/* STEP 2: TOTP 2FA Verification Challenge */}
          {authStep === "totp-challenge" && (
            <form onSubmit={handleVerifyChallenge} className="space-y-5 text-xs">
              <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-lg flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-accent shrink-0" />
                <div className="text-[11px] font-mono">
                  <div className="text-zinc-300 font-semibold">Two-Factor Authentication</div>
                  <div className="text-zinc-500">Signing in as <span className="text-zinc-300">{adminEmail}</span></div>
                </div>
              </div>

              <div className="space-y-2 text-center">
                <label className="block text-[11px] font-mono text-zinc-400">
                  Enter 6-digit Authenticator Code
                </label>
                <div className="flex justify-center py-2">
                  <InputOTP
                    maxLength={6}
                    value={totpCode}
                    onChange={(val) => setTotpCode(val)}
                  >
                    <InputOTPGroup className="gap-2">
                      <InputOTPSlot index={0} className="w-10 h-12 text-base font-mono border-zinc-700 bg-zinc-900 text-white" />
                      <InputOTPSlot index={1} className="w-10 h-12 text-base font-mono border-zinc-700 bg-zinc-900 text-white" />
                      <InputOTPSlot index={2} className="w-10 h-12 text-base font-mono border-zinc-700 bg-zinc-900 text-white" />
                      <InputOTPSlot index={3} className="w-10 h-12 text-base font-mono border-zinc-700 bg-zinc-900 text-white" />
                      <InputOTPSlot index={4} className="w-10 h-12 text-base font-mono border-zinc-700 bg-zinc-900 text-white" />
                      <InputOTPSlot index={5} className="w-10 h-12 text-base font-mono border-zinc-700 bg-zinc-900 text-white" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || totpCode.length !== 6}
                className="w-full py-3 rounded-lg bg-accent text-white font-medium text-xs font-mono uppercase tracking-wider hover:bg-accent-deep transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <span>Verify &amp; Unlock (AAL2)</span>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-[11px] font-mono text-zinc-400 hover:text-white underline"
                >
                  Sign in with a different account
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: TOTP 2FA Initial Enrollment */}
          {authStep === "totp-enroll" && (
            <form onSubmit={handleVerifyEnrollment} className="space-y-4 text-xs">
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-accent">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Enforce Two-Factor Authentication</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Scan this QR code using Google Authenticator, Authy, or 1Password.
                </p>
              </div>

              {enrollmentData ? (
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-xl flex justify-center w-fit mx-auto shadow-md">
                    <img
                      src={enrollmentData.qrCode}
                      alt="TOTP 2FA QR Code"
                      className="w-44 h-44"
                    />
                  </div>

                  <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                      <span>Manual Secret Key:</span>
                      <button
                        type="button"
                        onClick={handleCopySecret}
                        className="text-accent hover:text-white flex items-center gap-1"
                      >
                        {secretCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{secretCopied ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                    <div className="font-mono text-[11px] text-zinc-300 break-all select-all">
                      {enrollmentData.secret}
                    </div>
                  </div>

                  <div className="space-y-1 text-center pt-1">
                    <label className="block text-[11px] font-mono text-zinc-400">
                      Enter first 6-digit code to confirm enrollment:
                    </label>
                    <div className="flex justify-center py-1">
                      <InputOTP
                        maxLength={6}
                        value={totpCode}
                        onChange={(val) => setTotpCode(val)}
                      >
                        <InputOTPGroup className="gap-2">
                          <InputOTPSlot index={0} className="w-9 h-11 text-base font-mono border-zinc-700 bg-zinc-900 text-white" />
                          <InputOTPSlot index={1} className="w-9 h-11 text-base font-mono border-zinc-700 bg-zinc-900 text-white" />
                          <InputOTPSlot index={2} className="w-9 h-11 text-base font-mono border-zinc-700 bg-zinc-900 text-white" />
                          <InputOTPSlot index={3} className="w-9 h-11 text-base font-mono border-zinc-700 bg-zinc-900 text-white" />
                          <InputOTPSlot index={4} className="w-9 h-11 text-base font-mono border-zinc-700 bg-zinc-900 text-white" />
                          <InputOTPSlot index={5} className="w-9 h-11 text-base font-mono border-zinc-700 bg-zinc-900 text-white" />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || totpCode.length !== 6}
                    className="w-full py-3 rounded-lg bg-accent text-white font-medium text-xs font-mono uppercase tracking-wider hover:bg-accent-deep transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Activating 2FA...</span>
                      </>
                    ) : (
                      <span>Complete Enrollment &amp; Sign In</span>
                    )}
                  </button>
                </div>
              ) : (
                <div className="py-8 text-center text-zinc-400 flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-accent" />
                  <span className="text-xs font-mono">Generating enrollment credentials...</span>
                </div>
              )}

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-[11px] font-mono text-zinc-400 hover:text-white underline"
                >
                  Cancel and sign out
                </button>
              </div>
            </form>
          )}

          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span>D-BST &bull; GrowthMates Dual Engine</span>
            <span>v3.0 Production &bull; AAL2 Enforced</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto w-full text-center pb-4 text-xs font-mono text-zinc-400">
          Super Admin Console &bull; Security Level: High (TOTP MFA Required) &bull; RLS Protected
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED SUPER ADMIN CONTROL CENTER
  return (
    <div className="min-h-screen bg-zinc-50 text-fg-default font-body selection:bg-accent selection:text-white">
      {/* Top Multi-Site Status Header */}
      <header className="bg-[#0E131F] text-white border-b border-zinc-800 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Portal Info */}
            <div className="flex items-center gap-3">
              <LogoMark size="small" variant="icon" onBackground="dark" />
              <div className="h-6 w-px bg-zinc-700 hidden sm:block" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-sm tracking-tight text-white">Unified Super Admin</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-semibold border border-emerald-500/30">
                    AAL2 SECURED
                  </span>
                </div>
                <div className="text-[10px] font-mono text-zinc-400 hidden sm:block">
                  Cross-Site Operations: dbstsolutions.com &amp; growthmates.ai
                </div>
              </div>
            </div>

            {/* Target Site Selector */}
            <div className="flex items-center gap-2 bg-zinc-900/90 p-1 rounded-lg border border-zinc-800 text-xs font-mono">
              <Globe className="w-3.5 h-3.5 text-zinc-400 ml-1.5" />
              <span className="text-[11px] text-zinc-400 font-medium hidden md:inline">Scope:</span>
              <button
                onClick={() => setSelectedSite("all")}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                  selectedSite === "all"
                    ? "bg-accent text-white shadow-xs"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                All Sites
              </button>
              <button
                onClick={() => setSelectedSite("dbst")}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                  selectedSite === "dbst"
                    ? "bg-accent text-white shadow-xs"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                D-BST
              </button>
              <button
                onClick={() => setSelectedSite("growthmates")}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                  selectedSite === "growthmates"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                GrowthMates
              </button>
            </div>

            {/* User Session & Logout */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <div className="text-xs font-mono font-medium text-white">{adminEmail}</div>
                <div className="text-[10px] font-mono text-emerald-400 font-bold">SUPER ADMIN</div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Module Navigation Tabs */}
          <div className="flex items-center gap-1 border-t border-zinc-800/80 -mb-px text-xs font-mono overflow-x-auto">
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
