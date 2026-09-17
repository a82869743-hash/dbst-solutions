import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

// Same-origin relative path validator to safely consume `next`.
function safeNext(next: string | null): string {
  if (!next) return "/";
  try {
    if (!next.startsWith("/") || next.startsWith("//")) return "/";
    return next;
  } catch {
    return "/";
  }
}

export default function Login() {
  const [params] = useSearchParams();
  const next = safeNext(params.get("next"));
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) window.location.href = next;
    })();
  }, [next]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const trimmedEmail = email.trim().toLowerCase();
        const { error } = await supabase.auth.signInWithPassword({ email: trimmedEmail, password });
        if (error) throw error;
        window.location.href = next;
      } else {
        const emailRedirectTo = `${window.location.origin}${next}`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo },
        });
        if (error) throw error;
        toast({ title: "Check your email", description: "Confirm to finish signing up." });
      }
    } catch (err: any) {
      toast({ title: "Authentication error", description: err.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    const redirectTo = `${window.location.origin}${next}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) {
      toast({ title: "Google sign-in error", description: error.message, variant: "destructive" });
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="max-w-md w-full p-8">
        <h1 className="text-2xl font-semibold mb-1">
          {mode === "signin" ? "Sign in" : "Create your account"}
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          {mode === "signin"
            ? "Access GrowthMates.ai with your account."
            : "Sign up to get started with GrowthMates.ai."}
        </p>

        <Button type="button" variant="outline" className="w-full mb-4" onClick={handleGoogle}>
          Continue with Google
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground mt-6 text-center">
          {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
          <button
            className="underline"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </Card>
    </main>
  );
}
