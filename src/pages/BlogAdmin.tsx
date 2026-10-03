import { useState, useEffect } from "react";
import { ArrowLeft, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DbstNavigation } from "@/components/navigation/DbstNavigation";
import { DbstFooter } from "@/components/navigation/DbstFooter";
import BlogAdmin from "@/components/blog/BlogAdmin";
import {
  checkAdminUser,
  verifyAdminRole,
  checkIsUserBanned,
  checkLoginRateLimit,
  recordLoginAttempt,
  purgeResidualClientSecrets,
} from "@/lib/admin/auth";
import { toast } from "@/hooks/use-toast";

const BlogAdminPage = () => {
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    purgeResidualClientSecrets();
    (async () => {
      const { user, isAdmin, isBanned } = await checkAdminUser();
      if (isBanned) {
        await supabase.auth.signOut();
        setAuthed(false);
        return;
      }
      if (user && isAdmin) {
        setAuthed(true);
      }
    })();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const trimmedEmail = email.trim().toLowerCase();
      if (!trimmedEmail || !password) {
        throw new Error("Email and password are required.");
      }

      const rateLimit = await checkLoginRateLimit(trimmedEmail);
      if (!rateLimit.allowed) {
        await recordLoginAttempt(trimmedEmail, "blocked", "Rate limit lockout triggered", "dbst");
        throw new Error(`Too many failed attempts. Please wait ${rateLimit.lockoutSeconds || 900} seconds before retrying.`);
      }

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

      const isBanned = await checkIsUserBanned(userId);
      if (isBanned) {
        await recordLoginAttempt(trimmedEmail, "blocked", "Banned account attempted login", "dbst");
        await supabase.auth.signOut();
        throw new Error("This account has been disabled. Login rejected.");
      }

      const isAdmin = await verifyAdminRole(userId);
      if (!isAdmin) {
        await recordLoginAttempt(trimmedEmail, "failure", "Non-admin account attempted blog admin access", "dbst");
        await supabase.auth.signOut();
        throw new Error("Access denied: admin role required in user_roles.");
      }

      await recordLoginAttempt(trimmedEmail, "success", "Blog admin privileges verified", "dbst");
      setAuthed(true);
      toast({ title: "Welcome", description: "Blog admin privileges verified." });
    } catch (e: any) {
      toast({ title: "Login failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base text-fg-default font-body">
      <DbstNavigation />
      <div className="container max-w-4xl py-16">
        <Link
          to="/blog"
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-mono text-fg-dim hover:text-fg-default"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        {!authed ? (
          <div className="mx-auto max-w-sm space-y-4 rounded-md border border-border-subtle bg-bg-surface p-8 shadow-raised">
            <h2 className="text-xl font-bold font-display text-center">Blog Admin Access</h2>
            <div>
              <label className="block text-xs font-semibold text-fg-default mb-1">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="admin@dbstsolutions.com"
                className="w-full rounded-md border border-border-subtle bg-bg-base px-3.5 py-2 text-xs text-fg-default focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-fg-default mb-1">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full rounded-md border border-border-subtle bg-bg-base px-3.5 py-2 text-xs text-fg-default focus:border-accent"
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full rounded-full bg-accent px-5 py-2.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 shadow-flat"
            >
              <LogIn className="h-4 w-4" /> {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        ) : (
          <BlogAdmin />
        )}
      </div>
      <DbstFooter />
    </div>
  );
};

export default BlogAdminPage;
